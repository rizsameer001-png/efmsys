/**
 * CUSTOMER CONTROLLER
 * Handles all customer-related operations
 * Features: Registration, Login, Unit verification, Profile management
 */

const Customer = require('../models/Customer.model');
const Unit = require('../models/Unit.model');
const Building = require('../models/Building.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==================== CUSTOMER REGISTRATION ====================

// Customer Registration
const registerCustomer = async (req, res) => {
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
      floorNumber: parseInt(floorNumber), 
      unitNumber 
    });

    if (!unit) {
      return res.status(400).json({ success: false, error: 'Unit not found' });
    }

    if (unit.ownership?.ownerName?.toLowerCase() !== ownerName.toLowerCase()) {
      return res.status(400).json({ success: false, error: 'Owner name does not match' });
    }

    // Create or update customer
    if (customer && !customer.isRegistered) {
      customer.firstName = firstName;
      customer.lastName = lastName;
      customer.password = password;
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
        password,
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
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
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

// ==================== UNIT VERIFICATION ====================

// Verify unit (public)
const verifyUnit = async (req, res) => {
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
    console.error('Verify unit error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== CUSTOMER LOGIN ====================

// Customer login
const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const customer = await Customer.findOne({ email, isRegistered: true }).select('+password');
    if (!customer) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const isValidPassword = await customer.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: customer._id, email: customer.email, type: 'customer' },
      process.env.JWT_SECRET || 'fallback_secret',
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
          ownedUnits: customer.ownedUnits,
          rentedUnits: customer.rentedUnits
        },
        token
      }
    });
  } catch (error) {
    console.error('Customer login error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================== CUSTOMER PROFILE ====================

// Get customer profile
const getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id)
      .populate('ownedUnits.unitId', 'unitNumber floorNumber unitType')
      .populate('ownedUnits.buildingId', 'name code address');
    
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    
    res.json({
      success: true,
      data: customer.getSummary()
    });
  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update customer profile
const updateCustomerProfile = async (req, res) => {
  try {
    const updates = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    
    res.json({
      success: true,
      data: customer.getSummary(),
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update customer profile error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const customer = await Customer.findById(req.user.id).select('+password');
    
    const isValid = await customer.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Current password is incorrect' });
    }
    
    customer.password = newPassword;
    await customer.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================== CUSTOMER MANAGEMENT (Admin) ====================

// Get all customers (Admin)
const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isRegistered } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isRegistered !== undefined) {
      query.isRegistered = isRegistered === 'true';
    }
    
    const skip = (page - 1) * limit;
    
    const [customers, total] = await Promise.all([
      Customer.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort('-createdAt'),
      Customer.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all customers error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get customer by ID (Admin)
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('ownedUnits.unitId')
      .populate('ownedUnits.buildingId')
      .populate('rentedUnits.unitId')
      .populate('rentedUnits.buildingId');
    
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Get customer by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create customer (Admin)
const createCustomer = async (req, res) => {
  try {
    const customerData = req.body;
    
    const existingCustomer = await Customer.findOne({
      $or: [{ email: customerData.email }, { phone: customerData.phone }]
    });
    
    if (existingCustomer) {
      return res.status(400).json({ success: false, error: 'Customer already exists' });
    }
    
    const customer = new Customer(customerData);
    await customer.save();
    
    res.status(201).json({
      success: true,
      data: customer,
      message: 'Customer created successfully'
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update customer (Admin)
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    
    res.json({
      success: true,
      data: customer,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete customer (Admin)
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    
    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== EXPORTS ====================

module.exports = {
  // Customer self-service
  registerCustomer,
  verifyUnit,
  customerLogin,
  getCustomerProfile,
  updateCustomerProfile,
  changePassword,
  
  // Admin management
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};