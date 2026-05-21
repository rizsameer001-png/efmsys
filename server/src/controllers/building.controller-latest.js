// server/src/controllers/building.controller.js
const Building = require('../models/building.model');
const Unit = require('../models/unit.model');
const Customer = require('../models/customer.model');

// ==================== BUILDING CRUD ====================

// Create Building
exports.createBuilding = async (req, res) => {
  try {
    const buildingData = req.body;
    buildingData.createdBy = req.userId;
    
    // Check if building code already exists
    const existingBuilding = await Building.findOne({ code: buildingData.code });
    if (existingBuilding) {
      return res.status(400).json({ 
        success: false, 
        error: 'Building code already exists' 
      });
    }
    
    const building = new Building(buildingData);
    await building.save();
    
    res.status(201).json({
      success: true,
      data: building,
      message: 'Building created successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get All Buildings (with filters)
exports.getBuildings = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      type, 
      status, 
      city,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }
    if (type) query.type = type;
    if (status) query.status = status;
    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const [buildings, total] = await Promise.all([
      Building.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'firstName lastName email'),
      Building.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: {
        buildings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Building by ID
exports.getBuildingById = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');
    
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    // Get units for this building
    const units = await Unit.find({ buildingId: building._id, status: 'active' })
      .sort({ floorNumber: 1, unitNumber: 1 });
    
    res.json({
      success: true,
      data: { building, units }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update Building
exports.updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedBy = req.userId;
    updates.updatedAt = new Date();
    
    const building = await Building.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    res.json({
      success: true,
      data: building,
      message: 'Building updated successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete Building (Soft delete)
exports.deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if building has units
    const unitCount = await Unit.countDocuments({ buildingId: id });
    if (unitCount > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `Cannot delete building with ${unitCount} units. Archive or reassign units first.` 
      });
    }
    
    const building = await Building.findByIdAndUpdate(
      id,
      { status: 'inactive', updatedAt: new Date() },
      { new: true }
    );
    
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    res.json({
      success: true,
      message: 'Building deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Building Hierarchy
exports.getBuildingHierarchy = async (req, res) => {
  try {
    const { id } = req.params;
    
    const building = await Building.findById(id);
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    // Get all units grouped by floor
    const units = await Unit.find({ buildingId: id, status: 'active' })
      .populate('ownership.ownerId', 'firstName lastName email phone')
      .populate('tenant.tenantId', 'firstName lastName email phone')
      .sort({ floorNumber: 1, unitNumber: 1 });
    
    // Group units by floor
    const floorsMap = new Map();
    units.forEach(unit => {
      if (!floorsMap.has(unit.floorNumber)) {
        floorsMap.set(unit.floorNumber, []);
      }
      floorsMap.get(unit.floorNumber).push(unit);
    });
    
    // Convert to array format
    const floors = Array.from(floorsMap.entries()).map(([floorNumber, unitsList]) => ({
      floorNumber,
      unitCount: unitsList.length,
      units: unitsList.map(unit => ({
        id: unit._id,
        unitNumber: unit.unitNumber,
        unitType: unit.unitType,
        area: unit.details.area,
        occupancyStatus: unit.occupancy.status,
        ownerName: unit.ownership.ownerName,
        ownerEmail: unit.ownership.ownerEmail,
        tenantName: unit.tenant.tenantName,
        isRented: unit.tenant.isActive
      }))
    }));
    
    res.json({
      success: true,
      data: {
        building: {
          id: building._id,
          name: building.name,
          code: building.code,
          type: building.type,
          address: building.address,
          statistics: building.statistics
        },
        floors
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== UNIT MANAGEMENT ====================

// Create Unit
exports.createUnit = async (req, res) => {
  try {
    const unitData = req.body;
    unitData.createdBy = req.userId;
    
    // Check if unit already exists
    const existingUnit = await Unit.findOne({
      buildingId: unitData.buildingId,
      floorNumber: unitData.floorNumber,
      unitNumber: unitData.unitNumber
    });
    
    if (existingUnit) {
      return res.status(400).json({ 
        success: false, 
        error: 'Unit already exists in this building' 
      });
    }
    
    const unit = new Unit(unitData);
    await unit.save();
    
    // Update building statistics
    await updateBuildingStatistics(unitData.buildingId);
    
    res.status(201).json({
      success: true,
      data: unit,
      message: 'Unit created successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get Units by Building
exports.getUnitsByBuilding = async (req, res) => {
  try {
    const { buildingId } = req.params;
    const { floor, status, type, page = 1, limit = 50 } = req.query;
    
    const query = { buildingId, status: 'active' };
    if (floor) query.floorNumber = parseInt(floor);
    if (status) query['occupancy.status'] = status;
    if (type) query.unitType = type;
    
    const skip = (page - 1) * limit;
    
    const [units, total] = await Promise.all([
      Unit.find(query)
        .sort({ floorNumber: 1, unitNumber: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('ownership.ownerId', 'firstName lastName email phone')
        .populate('tenant.tenantId', 'firstName lastName email phone'),
      Unit.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: {
        units,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Unit by ID
exports.getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id)
      .populate('buildingId', 'name code address')
      .populate('ownership.ownerId', 'firstName lastName email phone profileImage')
      .populate('tenant.tenantId', 'firstName lastName email phone');
    
    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found' });
    }
    
    res.json({
      success: true,
      data: unit
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update Unit
exports.updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedBy = req.userId;
    updates.updatedAt = new Date();
    
    const unit = await Unit.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found' });
    }
    
    // Update building statistics
    await updateBuildingStatistics(unit.buildingId);
    
    res.json({
      success: true,
      data: unit,
      message: 'Unit updated successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete Unit
exports.deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;
    
    const unit = await Unit.findByIdAndUpdate(
      id,
      { status: 'inactive', updatedAt: new Date() }
    );
    
    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found' });
    }
    
    // Update building statistics
    await updateBuildingStatistics(unit.buildingId);
    
    res.json({
      success: true,
      message: 'Unit deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== OWNER & TENANT ASSIGNMENT ====================

// Assign Owner to Unit
exports.assignOwnerToUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const { ownerId, ownerName, ownerEmail, ownerPhone, ownerNationality, ownershipStartDate } = req.body;
    
    const unit = await Unit.findById(unitId);
    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found' });
    }
    
    let customer = null;
    if (ownerId) {
      customer = await Customer.findById(ownerId);
    } else if (ownerEmail || ownerPhone) {
      customer = await Customer.findOne({ 
        $or: [{ email: ownerEmail }, { phone: ownerPhone }] 
      });
    }
    
    // Create new customer if not exists
    if (!customer && (ownerName && ownerEmail && ownerPhone)) {
      const nameParts = ownerName.split(' ');
      customer = new Customer({
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' ') || '',
        email: ownerEmail,
        phone: ownerPhone,
        nationality: ownerNationality,
        registrationMethod: 'admin',
        isRegistered: false
      });
      await customer.save();
    }
    
    // Update unit ownership
    unit.ownership = {
      ownerId: customer?._id,
      ownerName: ownerName || customer?.firstName + ' ' + customer?.lastName,
      ownerEmail: ownerEmail || customer?.email,
      ownerPhone: ownerPhone || customer?.phone,
      ownerNationality: ownerNationality || customer?.nationality,
      ownershipStartDate: ownershipStartDate || new Date()
    };
    
    // Update occupancy status
    if (unit.tenant?.isActive) {
      unit.occupancy.status = 'tenant_occupied';
    } else {
      unit.occupancy.status = 'owner_occupied';
    }
    
    await unit.save();
    
    // Update customer's owned units
    if (customer) {
      const building = await Building.findById(unit.buildingId);
      customer.ownedUnits = customer.ownedUnits || [];
      customer.ownedUnits.push({
        unitId: unit._id,
        buildingId: unit.buildingId,
        unitNumber: unit.unitNumber,
        buildingName: building.name,
        ownershipStartDate: new Date(),
        isActive: true
      });
      await customer.save();
    }
    
    // Update building statistics
    await updateBuildingStatistics(unit.buildingId);
    
    res.json({
      success: true,
      data: { unit, customer },
      message: 'Owner assigned successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Assign Tenant to Unit
exports.assignTenantToUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const { 
      tenantId, tenantName, tenantEmail, tenantPhone,
      leaseStartDate, leaseEndDate, monthlyRent, securityDeposit
    } = req.body;
    
    const unit = await Unit.findById(unitId);
    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found' });
    }
    
    let customer = null;
    if (tenantId) {
      customer = await Customer.findById(tenantId);
    } else if (tenantEmail || tenantPhone) {
      customer = await Customer.findOne({ 
        $or: [{ email: tenantEmail }, { phone: tenantPhone }] 
      });
    }
    
    // Create new customer if not exists
    if (!customer && (tenantName && tenantEmail && tenantPhone)) {
      const nameParts = tenantName.split(' ');
      customer = new Customer({
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' ') || '',
        email: tenantEmail,
        phone: tenantPhone,
        registrationMethod: 'admin',
        isRegistered: false
      });
      await customer.save();
    }
    
    // Update unit tenant
    unit.tenant = {
      tenantId: customer?._id,
      tenantName: tenantName || customer?.firstName + ' ' + customer?.lastName,
      tenantEmail: tenantEmail || customer?.email,
      tenantPhone: tenantPhone || customer?.phone,
      leaseStartDate: leaseStartDate || new Date(),
      leaseEndDate: leaseEndDate,
      monthlyRent: monthlyRent,
      securityDeposit: securityDeposit,
      isActive: true
    };
    
    // Update occupancy status
    unit.occupancy.status = 'tenant_occupied';
    unit.occupancy.moveInDate = leaseStartDate || new Date();
    
    await unit.save();
    
    // Update customer's rented units
    if (customer) {
      const building = await Building.findById(unit.buildingId);
      customer.rentedUnits = customer.rentedUnits || [];
      customer.rentedUnits.push({
        unitId: unit._id,
        buildingId: unit.buildingId,
        unitNumber: unit.unitNumber,
        buildingName: building.name,
        leaseStartDate: leaseStartDate || new Date(),
        leaseEndDate: leaseEndDate,
        monthlyRent: monthlyRent,
        isActive: true
      });
      await customer.save();
    }
    
    // Update building statistics
    await updateBuildingStatistics(unit.buildingId);
    
    res.json({
      success: true,
      data: { unit, customer },
      message: 'Tenant assigned successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Remove Tenant from Unit
exports.removeTenant = async (req, res) => {
  try {
    const { unitId } = req.params;
    
    const unit = await Unit.findById(unitId);
    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found' });
    }
    
    // Update customer's rented units
    if (unit.tenant.tenantId) {
      await Customer.updateOne(
        { _id: unit.tenant.tenantId, 'rentedUnits.unitId': unitId },
        { $set: { 'rentedUnits.$.isActive': false, 'rentedUnits.$.leaseEndDate': new Date() } }
      );
    }
    
    // Clear tenant data
    unit.tenant = {
      tenantId: null,
      tenantName: '',
      tenantEmail: '',
      tenantPhone: '',
      isActive: false
    };
    
    // Update occupancy status based on ownership
    unit.occupancy.status = unit.ownership.ownerId ? 'owner_occupied' : 'vacant';
    unit.occupancy.moveOutDate = new Date();
    
    await unit.save();
    
    // Update building statistics
    await updateBuildingStatistics(unit.buildingId);
    
    res.json({
      success: true,
      message: 'Tenant removed successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================== BULK OPERATIONS ====================

// Bulk Import Units
exports.bulkImportUnits = async (req, res) => {
  try {
    const { buildingId, units } = req.body;
    
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    const results = {
      success: [],
      failed: [],
      customersCreated: 0
    };
    
    for (const unitData of units) {
      try {
        // Check if unit exists
        const existingUnit = await Unit.findOne({
          buildingId,
          floorNumber: unitData.floorNumber,
          unitNumber: unitData.unitNumber
        });
        
        if (existingUnit) {
          results.failed.push({ ...unitData, reason: 'Unit already exists' });
          continue;
        }
        
        // Create or find owner customer
        let ownerCustomer = null;
        if (unitData.ownerEmail || unitData.ownerPhone) {
          ownerCustomer = await Customer.findOne({
            $or: [
              { email: unitData.ownerEmail },
              { phone: unitData.ownerPhone }
            ]
          });
          
          if (!ownerCustomer && unitData.ownerName) {
            const nameParts = unitData.ownerName.split(' ');
            ownerCustomer = new Customer({
              firstName: nameParts[0],
              lastName: nameParts.slice(1).join(' ') || '',
              email: unitData.ownerEmail,
              phone: unitData.ownerPhone,
              registrationMethod: 'import',
              isRegistered: false
            });
            await ownerCustomer.save();
            results.customersCreated++;
          }
        }
        
        const unit = new Unit({
          buildingId,
          floorNumber: unitData.floorNumber,
          unitNumber: unitData.unitNumber,
          unitType: unitData.unitType || 'apartment',
          details: {
            area: unitData.area,
            bedrooms: unitData.bedrooms,
            bathrooms: unitData.bathrooms
          },
          ownership: {
            ownerId: ownerCustomer?._id,
            ownerName: unitData.ownerName,
            ownerEmail: unitData.ownerEmail,
            ownerPhone: unitData.ownerPhone,
            ownershipStartDate: new Date()
          },
          occupancy: {
            status: ownerCustomer ? 'owner_occupied' : 'vacant'
          },
          createdBy: req.userId
        });
        
        await unit.save();
        
        // Update customer's owned units
        if (ownerCustomer) {
          ownerCustomer.ownedUnits = ownerCustomer.ownedUnits || [];
          ownerCustomer.ownedUnits.push({
            unitId: unit._id,
            buildingId: building._id,
            unitNumber: unit.unitNumber,
            buildingName: building.name,
            ownershipStartDate: new Date(),
            isActive: true
          });
          await ownerCustomer.save();
        }
        
        results.success.push(unit);
      } catch (error) {
        results.failed.push({ ...unitData, reason: error.message });
      }
    }
    
    // Update building statistics
    await updateBuildingStatistics(buildingId);
    
    res.json({
      success: true,
      data: results,
      message: `Imported ${results.success.length} units, ${results.failed.length} failed. Created ${results.customersCreated} customers.`
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Export Units
exports.exportUnits = async (req, res) => {
  try {
    const { buildingId } = req.params;
    const { format = 'json' } = req.query;
    
    const units = await Unit.find({ buildingId, status: 'active' })
      .populate('buildingId', 'name code')
      .sort({ floorNumber: 1, unitNumber: 1 });
    
    const exportData = units.map(unit => ({
      buildingCode: unit.buildingId.code,
      buildingName: unit.buildingId.name,
      floorNumber: unit.floorNumber,
      unitNumber: unit.unitNumber,
      unitType: unit.unitType,
      area: unit.details.area?.value,
      bedrooms: unit.details.bedrooms,
      bathrooms: unit.details.bathrooms,
      ownerName: unit.ownership.ownerName,
      ownerEmail: unit.ownership.ownerEmail,
      ownerPhone: unit.ownership.ownerPhone,
      tenantName: unit.tenant.tenantName,
      tenantEmail: unit.tenant.tenantEmail,
      occupancyStatus: unit.occupancy.status,
      status: unit.status
    }));
    
    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== HELPER FUNCTIONS ====================

async function updateBuildingStatistics(buildingId) {
  const unitCount = await Unit.countDocuments({ buildingId, status: 'active' });
  const occupiedCount = await Unit.countDocuments({ 
    buildingId, 
    'occupancy.status': { $in: ['owner_occupied', 'tenant_occupied'] },
    status: 'active'
  });
  const maintenanceCount = await Unit.countDocuments({ 
    buildingId, 
    'occupancy.status': 'maintenance',
    status: 'active'
  });
  
  await Building.updateOne(
    { _id: buildingId },
    { 
      $set: { 
        'statistics.totalUnits': unitCount,
        'statistics.occupiedUnits': occupiedCount,
        'statistics.vacantUnits': unitCount - occupiedCount - maintenanceCount,
        'statistics.underMaintenance': maintenanceCount
      }
    }
  );
}

// Get Floors (for building)
exports.getFloors = async (req, res) => {
  try {
    const { buildingId } = req.params;
    
    const floors = await Unit.aggregate([
      { $match: { buildingId: mongoose.Types.ObjectId(buildingId), status: 'active' } },
      { $group: { _id: '$floorNumber', unitCount: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: floors.map(floor => ({ floorNumber: floor._id, unitCount: floor.unitCount }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Unit Types Summary
exports.getUnitTypeSummary = async (req, res) => {
  try {
    const { buildingId } = req.params;
    
    const summary = await Unit.aggregate([
      { $match: { buildingId: mongoose.Types.ObjectId(buildingId), status: 'active' } },
      { $group: { 
        _id: '$unitType', 
        count: { $sum: 1 },
        occupied: { 
          $sum: { 
            $cond: [{ $in: ['$occupancy.status', ['owner_occupied', 'tenant_occupied']] }, 1, 0] 
          } 
        }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};