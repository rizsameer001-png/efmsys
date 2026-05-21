// server/src/controllers/customer.controller.js
const Customer = require('../models/customer.model');
const Unit = require('../models/unit.model');
const Building = require('../models/building.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Customer Registration
exports.registerCustomer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      unitVerification
    } = req.body;

    console.log('Registering customer:', { email, firstName, lastName });

    // Check if customer already exists
    let customer = await Customer.findOne({ $or: [{ email }, { phone }] });
    
    if (customer && customer.isRegistered) {
      return res.status(400).json({ 
        success: false, 
        error: 'Customer already registered. Please login.' 
      });
    }

    // Verify unit ownership
    const { buildingCode, floorNumber, unitNumber, ownerName } = unitVerification;
    
    const building = await Building.findOne({ code: buildingCode });
    if (!building) {
      return res.status(400).json({ success: false, error: 'Building not found' });
    }

    const unit = await Unit.findOne({ 
      buildingId: building._id, 
      floorNumber, 
      unitNumber 
    });

    if (!unit) {
      return res.status(400).json({ success: false, error: 'Unit not found' });
    }

    if (unit.ownership?.ownerName?.toLowerCase() !== ownerName.toLowerCase()) {
      return res.status(400).json({ success: false, error: 'Owner name does not match' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create or update customer
    if (customer && !customer.isRegistered) {
      customer.firstName = firstName;
      customer.lastName = lastName;
      customer.password = hashedPassword;
      customer.isRegistered = true;
      customer.registrationMethod = 'self';
      customer.emailVerified = false;
      customer.phoneVerified = false;
      
      customer.ownedUnits.push({
        unitId: unit._id,
        buildingId: building._id,
        unitNumber: unit.unitNumber,
        buildingName: building.name,
        ownershipStartDate: new Date(),
        isActive: true
      });
      
      await customer.save();
    } else {
      customer = new Customer({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        isRegistered: true,
        registrationMethod: 'self',
        emailVerified: false,
        phoneVerified: false,
        ownedUnits: [{
          unitId: unit._id,
          buildingId: building._id,
          unitNumber: unit.unitNumber,
          buildingName: building.name,
          ownershipStartDate: new Date(),
          isActive: true
        }]
      });
      await customer.save();
    }

    // Generate token
    const token = jwt.sign(
      { id: customer._id, email: customer.email, type: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      data: {
        customerId: customer.customerId,
        email: customer.email,
        phone: customer.phone,
        firstName: customer.firstName,
        lastName: customer.lastName,
        ownedUnits: customer.ownedUnits
      },
      token,
      message: 'Registration successful. Please verify your email.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// Verify unit (public)
exports.verifyUnit = async (req, res) => {
  try {
    const { buildingCode, floorNumber, unitNumber, ownerName } = req.query;
    
    const building = await Building.findOne({ code: buildingCode });
    if (!building) {
      return res.json({ success: true, valid: false, message: 'Building not found' });
    }
    
    const unit = await Unit.findOne({ 
      buildingId: building._id, 
      floorNumber: parseInt(floorNumber), 
      unitNumber 
    });
    
    if (!unit) {
      return res.json({ success: true, valid: false, message: 'Unit not found' });
    }
    
    if (unit.ownership?.ownerName?.toLowerCase() !== ownerName.toLowerCase()) {
      return res.json({ success: true, valid: false, message: 'Owner name does not match' });
    }
    
    res.json({
      success: true,
      valid: true,
      data: {
        buildingName: building.name,
        unitNumber: unit.unitNumber,
        floorNumber: unit.floorNumber,
        ownerName: unit.ownership?.ownerName
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Customer login
exports.customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const customer = await Customer.findOne({ email, isRegistered: true });
    if (!customer) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, customer.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: customer._id, email: customer.email, type: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      data: {
        customer: {
          id: customer._id,
          customerId: customer.customerId,
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          phone: customer.phone,
          ownedUnits: customer.ownedUnits
        },
        token
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};