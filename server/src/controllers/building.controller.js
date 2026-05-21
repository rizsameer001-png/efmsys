// /**
//  * BUILDING CONTROLLER
//  * Handles all building-related operations
//  * Features: Building CRUD, Unit Management, Owner/Tenant Assignment, Bulk Operations
//  */

// const mongoose = require('mongoose');
// const Building = require('../models/Building.model');
// const Unit = require('../models/Unit.model');
// const Customer = require('../models/Customer.model');

// // ==================== BUILDING CRUD ====================

// // Create Building
// const createBuilding = async (req, res) => {
//   try {
//     const buildingData = req.body;
//     buildingData.createdBy = req.userId || req.user._id;
    
//     // Check if building code already exists
//     const existingBuilding = await Building.findOne({ code: buildingData.code });
//     if (existingBuilding) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Building code already exists' 
//       });
//     }
    
//     const building = new Building(buildingData);
//     await building.save();
    
//     res.status(201).json({
//       success: true,
//       data: building,
//       message: 'Building created successfully'
//     });
//   } catch (error) {
//     console.error('Create building error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Get All Buildings (with filters)
// const getBuildings = async (req, res) => {
//   try {
//     const { 
//       page = 1, 
//       limit = 20, 
//       search, 
//       type, 
//       status, 
//       city,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;
    
//     const query = {};
    
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { code: { $regex: search, $options: 'i' } },
//         { 'address.city': { $regex: search, $options: 'i' } }
//       ];
//     }
//     if (type) query.type = type;
//     if (status) query.status = status;
//     if (city) query['address.city'] = { $regex: city, $options: 'i' };
    
//     const skip = (page - 1) * limit;
//     const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
//     const [buildings, total] = await Promise.all([
//       Building.find(query)
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(parseInt(limit))
//         .populate('createdBy', 'firstName lastName email'),
//       Building.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         buildings,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / limit)
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get buildings error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get Building by ID
// const getBuildingById = async (req, res) => {
//   try {
//     const building = await Building.findById(req.params.id)
//       .populate('createdBy', 'firstName lastName email')
//       .populate('updatedBy', 'firstName lastName email');
    
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     // Get units for this building
//     const units = await Unit.find({ buildingId: building._id, status: 'active' })
//       .sort({ floorNumber: 1, unitNumber: 1 });
    
//     res.json({
//       success: true,
//       data: { building, units }
//     });
//   } catch (error) {
//     console.error('Get building by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Update Building
// const updateBuilding = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     updates.updatedBy = req.userId || req.user._id;
//     updates.updatedAt = new Date();
    
//     const building = await Building.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     );
    
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     res.json({
//       success: true,
//       data: building,
//       message: 'Building updated successfully'
//     });
//   } catch (error) {
//     console.error('Update building error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Delete Building (Soft delete)
// const deleteBuilding = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Check if building has units
//     const unitCount = await Unit.countDocuments({ buildingId: id });
//     if (unitCount > 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: `Cannot delete building with ${unitCount} units. Archive or reassign units first.` 
//       });
//     }
    
//     const building = await Building.findByIdAndUpdate(
//       id,
//       { status: 'inactive', updatedAt: new Date() },
//       { new: true }
//     );
    
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     res.json({
//       success: true,
//       message: 'Building deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete building error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get Building Hierarchy
// const getBuildingHierarchy = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const building = await Building.findById(id);
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     // Get all units grouped by floor
//     const units = await Unit.find({ buildingId: id, status: 'active' })
//       .populate('ownership.ownerId', 'firstName lastName email phone')
//       .populate('tenant.tenantId', 'firstName lastName email phone')
//       .sort({ floorNumber: 1, unitNumber: 1 });
    
//     // Group units by floor
//     const floorsMap = new Map();
//     units.forEach(unit => {
//       if (!floorsMap.has(unit.floorNumber)) {
//         floorsMap.set(unit.floorNumber, []);
//       }
//       floorsMap.get(unit.floorNumber).push(unit);
//     });
    
//     // Convert to array format
//     const floors = Array.from(floorsMap.entries()).map(([floorNumber, unitsList]) => ({
//       floorNumber,
//       unitCount: unitsList.length,
//       units: unitsList.map(unit => ({
//         id: unit._id,
//         unitNumber: unit.unitNumber,
//         unitType: unit.unitType,
//         area: unit.details?.area,
//         occupancyStatus: unit.occupancy?.status,
//         ownerName: unit.ownership?.ownerName,
//         ownerEmail: unit.ownership?.ownerEmail,
//         tenantName: unit.tenant?.tenantName,
//         isRented: unit.tenant?.isActive
//       }))
//     }));
    
//     res.json({
//       success: true,
//       data: {
//         building: {
//           id: building._id,
//           name: building.name,
//           code: building.code,
//           type: building.type,
//           address: building.address,
//           statistics: building.statistics
//         },
//         floors
//       }
//     });
//   } catch (error) {
//     console.error('Get building hierarchy error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UNIT MANAGEMENT ====================

// // Create Unit
// const createUnit = async (req, res) => {
//   try {
//     const unitData = req.body;
//     unitData.createdBy = req.userId || req.user._id;
    
//     // Check if unit already exists
//     const existingUnit = await Unit.findOne({
//       buildingId: unitData.buildingId,
//       floorNumber: unitData.floorNumber,
//       unitNumber: unitData.unitNumber
//     });
    
//     if (existingUnit) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Unit already exists in this building' 
//       });
//     }
    
//     const unit = new Unit(unitData);
//     await unit.save();
    
//     // Update building statistics
//     await updateBuildingStatistics(unitData.buildingId);
    
//     res.status(201).json({
//       success: true,
//       data: unit,
//       message: 'Unit created successfully'
//     });
//   } catch (error) {
//     console.error('Create unit error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Get Units by Building
// const getUnitsByBuilding = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
//     const { floor, status, type, page = 1, limit = 50 } = req.query;
    
//     const query = { buildingId, status: 'active' };
//     if (floor) query.floorNumber = parseInt(floor);
//     if (status) query['occupancy.status'] = status;
//     if (type) query.unitType = type;
    
//     const skip = (page - 1) * limit;
    
//     const [units, total] = await Promise.all([
//       Unit.find(query)
//         .sort({ floorNumber: 1, unitNumber: 1 })
//         .skip(skip)
//         .limit(parseInt(limit))
//         .populate('ownership.ownerId', 'firstName lastName email phone')
//         .populate('tenant.tenantId', 'firstName lastName email phone'),
//       Unit.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         units,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / limit)
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get units by building error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get Unit by ID
// const getUnitById = async (req, res) => {
//   try {
//     const unit = await Unit.findById(req.params.id)
//       .populate('buildingId', 'name code address')
//       .populate('ownership.ownerId', 'firstName lastName email phone profileImage')
//       .populate('tenant.tenantId', 'firstName lastName email phone');
    
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     res.json({
//       success: true,
//       data: unit
//     });
//   } catch (error) {
//     console.error('Get unit by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Update Unit
// const updateUnit = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     updates.updatedBy = req.userId || req.user._id;
//     updates.updatedAt = new Date();
    
//     const unit = await Unit.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     );
    
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       data: unit,
//       message: 'Unit updated successfully'
//     });
//   } catch (error) {
//     console.error('Update unit error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Delete Unit
// const deleteUnit = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const unit = await Unit.findByIdAndUpdate(
//       id,
//       { status: 'inactive', updatedAt: new Date() }
//     );
    
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       message: 'Unit deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete unit error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== OWNER & TENANT ASSIGNMENT ====================

// // Assign Owner to Unit
// const assignOwnerToUnit = async (req, res) => {
//   try {
//     const { unitId } = req.params;
//     const { ownerId, ownerName, ownerEmail, ownerPhone, ownerNationality, ownershipStartDate } = req.body;
    
//     const unit = await Unit.findById(unitId);
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     let customer = null;
//     if (ownerId) {
//       customer = await Customer.findById(ownerId);
//     } else if (ownerEmail || ownerPhone) {
//       customer = await Customer.findOne({ 
//         $or: [{ email: ownerEmail }, { phone: ownerPhone }] 
//       });
//     }
    
//     // Create new customer if not exists
//     if (!customer && (ownerName && ownerEmail && ownerPhone)) {
//       const nameParts = ownerName.split(' ');
//       customer = new Customer({
//         firstName: nameParts[0],
//         lastName: nameParts.slice(1).join(' ') || '',
//         email: ownerEmail,
//         phone: ownerPhone,
//         nationality: ownerNationality,
//         registrationMethod: 'admin',
//         isRegistered: false
//       });
//       await customer.save();
//     }
    
//     // Update unit ownership
//     unit.ownership = {
//       ownerId: customer?._id,
//       ownerName: ownerName || (customer ? `${customer.firstName} ${customer.lastName}` : ''),
//       ownerEmail: ownerEmail || customer?.email,
//       ownerPhone: ownerPhone || customer?.phone,
//       ownerNationality: ownerNationality || customer?.nationality,
//       ownershipStartDate: ownershipStartDate || new Date()
//     };
    
//     // Update occupancy status
//     if (unit.tenant?.isActive) {
//       unit.occupancy.status = 'tenant_occupied';
//     } else {
//       unit.occupancy.status = 'owner_occupied';
//     }
    
//     await unit.save();
    
//     // Update customer's owned units
//     if (customer) {
//       const building = await Building.findById(unit.buildingId);
//       customer.ownedUnits = customer.ownedUnits || [];
//       customer.ownedUnits.push({
//         unitId: unit._id,
//         buildingId: unit.buildingId,
//         unitNumber: unit.unitNumber,
//         buildingName: building.name,
//         ownershipStartDate: new Date(),
//         isActive: true
//       });
//       await customer.save();
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       data: { unit, customer },
//       message: 'Owner assigned successfully'
//     });
//   } catch (error) {
//     console.error('Assign owner error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Assign Tenant to Unit
// const assignTenantToUnit = async (req, res) => {
//   try {
//     const { unitId } = req.params;
//     const { 
//       tenantId, tenantName, tenantEmail, tenantPhone,
//       leaseStartDate, leaseEndDate, monthlyRent, securityDeposit
//     } = req.body;
    
//     const unit = await Unit.findById(unitId);
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     let customer = null;
//     if (tenantId) {
//       customer = await Customer.findById(tenantId);
//     } else if (tenantEmail || tenantPhone) {
//       customer = await Customer.findOne({ 
//         $or: [{ email: tenantEmail }, { phone: tenantPhone }] 
//       });
//     }
    
//     // Create new customer if not exists
//     if (!customer && (tenantName && tenantEmail && tenantPhone)) {
//       const nameParts = tenantName.split(' ');
//       customer = new Customer({
//         firstName: nameParts[0],
//         lastName: nameParts.slice(1).join(' ') || '',
//         email: tenantEmail,
//         phone: tenantPhone,
//         registrationMethod: 'admin',
//         isRegistered: false
//       });
//       await customer.save();
//     }
    
//     // Update unit tenant
//     unit.tenant = {
//       tenantId: customer?._id,
//       tenantName: tenantName || (customer ? `${customer.firstName} ${customer.lastName}` : ''),
//       tenantEmail: tenantEmail || customer?.email,
//       tenantPhone: tenantPhone || customer?.phone,
//       leaseStartDate: leaseStartDate || new Date(),
//       leaseEndDate: leaseEndDate,
//       monthlyRent: monthlyRent,
//       securityDeposit: securityDeposit,
//       isActive: true
//     };
    
//     // Update occupancy status
//     unit.occupancy.status = 'tenant_occupied';
//     unit.occupancy.moveInDate = leaseStartDate || new Date();
    
//     await unit.save();
    
//     // Update customer's rented units
//     if (customer) {
//       const building = await Building.findById(unit.buildingId);
//       customer.rentedUnits = customer.rentedUnits || [];
//       customer.rentedUnits.push({
//         unitId: unit._id,
//         buildingId: unit.buildingId,
//         unitNumber: unit.unitNumber,
//         buildingName: building.name,
//         leaseStartDate: leaseStartDate || new Date(),
//         leaseEndDate: leaseEndDate,
//         monthlyRent: monthlyRent,
//         isActive: true
//       });
//       await customer.save();
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       data: { unit, customer },
//       message: 'Tenant assigned successfully'
//     });
//   } catch (error) {
//     console.error('Assign tenant error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Remove Tenant from Unit
// const removeTenant = async (req, res) => {
//   try {
//     const { unitId } = req.params;
    
//     const unit = await Unit.findById(unitId);
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     // Update customer's rented units
//     if (unit.tenant.tenantId) {
//       await Customer.updateOne(
//         { _id: unit.tenant.tenantId, 'rentedUnits.unitId': unitId },
//         { $set: { 'rentedUnits.$.isActive': false, 'rentedUnits.$.leaseEndDate': new Date() } }
//       );
//     }
    
//     // Clear tenant data
//     unit.tenant = {
//       tenantId: null,
//       tenantName: '',
//       tenantEmail: '',
//       tenantPhone: '',
//       isActive: false
//     };
    
//     // Update occupancy status based on ownership
//     unit.occupancy.status = unit.ownership.ownerId ? 'owner_occupied' : 'vacant';
//     unit.occupancy.moveOutDate = new Date();
    
//     await unit.save();
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       message: 'Tenant removed successfully'
//     });
//   } catch (error) {
//     console.error('Remove tenant error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== BULK OPERATIONS ====================

// // Bulk Import Units
// const bulkImportUnits = async (req, res) => {
//   try {
//     const { buildingId, units } = req.body;
    
//     const building = await Building.findById(buildingId);
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     const results = {
//       success: [],
//       failed: [],
//       customersCreated: 0
//     };
    
//     for (const unitData of units) {
//       try {
//         // Check if unit exists
//         const existingUnit = await Unit.findOne({
//           buildingId,
//           floorNumber: unitData.floorNumber,
//           unitNumber: unitData.unitNumber
//         });
        
//         if (existingUnit) {
//           results.failed.push({ ...unitData, reason: 'Unit already exists' });
//           continue;
//         }
        
//         // Create or find owner customer
//         let ownerCustomer = null;
//         if (unitData.ownerEmail || unitData.ownerPhone) {
//           ownerCustomer = await Customer.findOne({
//             $or: [
//               { email: unitData.ownerEmail },
//               { phone: unitData.ownerPhone }
//             ]
//           });
          
//           if (!ownerCustomer && unitData.ownerName) {
//             const nameParts = unitData.ownerName.split(' ');
//             ownerCustomer = new Customer({
//               firstName: nameParts[0],
//               lastName: nameParts.slice(1).join(' ') || '',
//               email: unitData.ownerEmail,
//               phone: unitData.ownerPhone,
//               registrationMethod: 'import',
//               isRegistered: false
//             });
//             await ownerCustomer.save();
//             results.customersCreated++;
//           }
//         }
        
//         const unit = new Unit({
//           buildingId,
//           floorNumber: unitData.floorNumber,
//           unitNumber: unitData.unitNumber,
//           unitType: unitData.unitType || 'apartment',
//           details: {
//             area: unitData.area,
//             bedrooms: unitData.bedrooms,
//             bathrooms: unitData.bathrooms
//           },
//           ownership: {
//             ownerId: ownerCustomer?._id,
//             ownerName: unitData.ownerName,
//             ownerEmail: unitData.ownerEmail,
//             ownerPhone: unitData.ownerPhone,
//             ownershipStartDate: new Date()
//           },
//           occupancy: {
//             status: ownerCustomer ? 'owner_occupied' : 'vacant'
//           },
//           createdBy: req.userId || req.user._id
//         });
        
//         await unit.save();
        
//         // Update customer's owned units
//         if (ownerCustomer) {
//           ownerCustomer.ownedUnits = ownerCustomer.ownedUnits || [];
//           ownerCustomer.ownedUnits.push({
//             unitId: unit._id,
//             buildingId: building._id,
//             unitNumber: unit.unitNumber,
//             buildingName: building.name,
//             ownershipStartDate: new Date(),
//             isActive: true
//           });
//           await ownerCustomer.save();
//         }
        
//         results.success.push(unit);
//       } catch (error) {
//         results.failed.push({ ...unitData, reason: error.message });
//       }
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(buildingId);
    
//     res.json({
//       success: true,
//       data: results,
//       message: `Imported ${results.success.length} units, ${results.failed.length} failed. Created ${results.customersCreated} customers.`
//     });
//   } catch (error) {
//     console.error('Bulk import units error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Export Units
// const exportUnits = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
//     const { format = 'json' } = req.query;
    
//     const units = await Unit.find({ buildingId, status: 'active' })
//       .populate('buildingId', 'name code')
//       .sort({ floorNumber: 1, unitNumber: 1 });
    
//     const exportData = units.map(unit => ({
//       buildingCode: unit.buildingId.code,
//       buildingName: unit.buildingId.name,
//       floorNumber: unit.floorNumber,
//       unitNumber: unit.unitNumber,
//       unitType: unit.unitType,
//       area: unit.details?.area,
//       bedrooms: unit.details?.bedrooms,
//       bathrooms: unit.details?.bathrooms,
//       ownerName: unit.ownership?.ownerName,
//       ownerEmail: unit.ownership?.ownerEmail,
//       ownerPhone: unit.ownership?.ownerPhone,
//       tenantName: unit.tenant?.tenantName,
//       tenantEmail: unit.tenant?.tenantEmail,
//       occupancyStatus: unit.occupancy?.status,
//       status: unit.status
//     }));
    
//     res.json({
//       success: true,
//       data: exportData
//     });
//   } catch (error) {
//     console.error('Export units error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== HELPER FUNCTIONS ====================

// async function updateBuildingStatistics(buildingId) {
//   try {
//     const unitCount = await Unit.countDocuments({ buildingId, status: 'active' });
//     const occupiedCount = await Unit.countDocuments({ 
//       buildingId, 
//       'occupancy.status': { $in: ['owner_occupied', 'tenant_occupied'] },
//       status: 'active'
//     });
//     const maintenanceCount = await Unit.countDocuments({ 
//       buildingId, 
//       'occupancy.status': 'maintenance',
//       status: 'active'
//     });
    
//     await Building.updateOne(
//       { _id: buildingId },
//       { 
//         $set: { 
//           'statistics.totalUnits': unitCount,
//           'statistics.occupiedUnits': occupiedCount,
//           'statistics.vacantUnits': unitCount - occupiedCount - maintenanceCount,
//           'statistics.underMaintenance': maintenanceCount
//         }
//       }
//     );
//   } catch (error) {
//     console.error('Update building statistics error:', error);
//   }
// }

// // Get Floors (for building)
// const getFloors = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
    
//     const floors = await Unit.aggregate([
//       { $match: { buildingId: new mongoose.Types.ObjectId(buildingId), status: 'active' } },
//       { $group: { _id: '$floorNumber', unitCount: { $sum: 1 } } },
//       { $sort: { _id: 1 } }
//     ]);
    
//     res.json({
//       success: true,
//       data: floors.map(floor => ({ floorNumber: floor._id, unitCount: floor.unitCount }))
//     });
//   } catch (error) {
//     console.error('Get floors error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get Unit Types Summary
// const getUnitTypeSummary = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
    
//     const summary = await Unit.aggregate([
//       { $match: { buildingId: new mongoose.Types.ObjectId(buildingId), status: 'active' } },
//       { 
//         $group: { 
//           _id: '$unitType', 
//           count: { $sum: 1 },
//           occupied: { 
//             $sum: { 
//               $cond: [{ $in: ['$occupancy.status', ['owner_occupied', 'tenant_occupied']] }, 1, 0] 
//             } 
//           }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);
    
//     res.json({
//       success: true,
//       data: summary
//     });
//   } catch (error) {
//     console.error('Get unit type summary error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== EXPORTS ====================

// module.exports = {
//   // Building CRUD
//   createBuilding,
//   getBuildings,
//   getBuildingById,
//   updateBuilding,
//   deleteBuilding,
//   getBuildingHierarchy,
//   getFloors,
//   getUnitTypeSummary,
  
//   // Unit Management
//   createUnit,
//   getUnitsByBuilding,
//   getUnitById,
//   updateUnit,
//   deleteUnit,
  
//   // Owner & Tenant Assignment
//   assignOwnerToUnit,
//   assignTenantToUnit,
//   removeTenant,
  
//   // Bulk Operations
//   bulkImportUnits,
//   exportUnits
// };




// /**
//  * BUILDING CONTROLLER
//  * Handles all building-related operations
//  * Features: Building CRUD, Unit Management, Owner/Tenant Assignment, Bulk Operations
//  */

// const mongoose = require('mongoose');
// const Building = require('../models/Building.model');
// const Unit = require('../models/Unit.model');
// const Customer = require('../models/Customer.model');

// // ==================== BUILDING CRUD ====================

// // Create Building
// const createBuilding = async (req, res) => {
//   try {
//     const buildingData = req.body;
//     buildingData.createdBy = req.userId || req.user._id;
    
//     // Check if building code already exists
//     const existingBuilding = await Building.findOne({ code: buildingData.code });
//     if (existingBuilding) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Building code already exists' 
//       });
//     }
    
//     const building = new Building(buildingData);
//     await building.save();
    
//     res.status(201).json({
//       success: true,
//       data: building,
//       message: 'Building created successfully'
//     });
//   } catch (error) {
//     console.error('Create building error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Get All Buildings (with filters)
// const getBuildings = async (req, res) => {
//   try {
//     const { 
//       page = 1, 
//       limit = 20, 
//       search, 
//       type, 
//       status, 
//       city,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;
    
//     const query = {};
    
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { code: { $regex: search, $options: 'i' } },
//         { 'address.city': { $regex: search, $options: 'i' } }
//       ];
//     }
//     if (type) query.type = type;
//     if (status) query.status = status;
//     if (city) query['address.city'] = { $regex: city, $options: 'i' };
    
//     const skip = (page - 1) * limit;
//     const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
//     const [buildings, total] = await Promise.all([
//       Building.find(query)
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(parseInt(limit))
//         .populate('createdBy', 'firstName lastName email'),
//       Building.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         buildings,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / limit)
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get buildings error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get Building by ID
// const getBuildingById = async (req, res) => {
//   try {
//     const building = await Building.findById(req.params.id)
//       .populate('createdBy', 'firstName lastName email')
//       .populate('updatedBy', 'firstName lastName email');
    
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     // Get units for this building
//     const units = await Unit.find({ buildingId: building._id, status: 'active' })
//       .sort({ floorNumber: 1, unitNumber: 1 });
    
//     res.json({
//       success: true,
//       data: { building, units }
//     });
//   } catch (error) {
//     console.error('Get building by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Update Building
// const updateBuilding = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     updates.updatedBy = req.userId || req.user._id;
//     updates.updatedAt = new Date();
    
//     const building = await Building.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     );
    
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     res.json({
//       success: true,
//       data: building,
//       message: 'Building updated successfully'
//     });
//   } catch (error) {
//     console.error('Update building error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Delete Building (Soft delete)
// const deleteBuilding = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Check if building has units
//     const unitCount = await Unit.countDocuments({ buildingId: id });
//     if (unitCount > 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: `Cannot delete building with ${unitCount} units. Archive or reassign units first.` 
//       });
//     }
    
//     const building = await Building.findByIdAndUpdate(
//       id,
//       { status: 'inactive', updatedAt: new Date() },
//       { new: true }
//     );
    
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     res.json({
//       success: true,
//       message: 'Building deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete building error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get Building Hierarchy
// const getBuildingHierarchy = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const building = await Building.findById(id);
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     // Get all units grouped by floor
//     const units = await Unit.find({ buildingId: id, status: 'active' })
//       .populate('ownership.ownerId', 'firstName lastName email phone')
//       .populate('tenant.tenantId', 'firstName lastName email phone')
//       .sort({ floorNumber: 1, unitNumber: 1 });
    
//     // Group units by floor
//     const floorsMap = new Map();
//     units.forEach(unit => {
//       if (!floorsMap.has(unit.floorNumber)) {
//         floorsMap.set(unit.floorNumber, []);
//       }
//       floorsMap.get(unit.floorNumber).push(unit);
//     });
    
//     // Convert to array format
//     const floors = Array.from(floorsMap.entries()).map(([floorNumber, unitsList]) => ({
//       floorNumber,
//       unitCount: unitsList.length,
//       units: unitsList.map(unit => ({
//         id: unit._id,
//         unitNumber: unit.unitNumber,
//         unitType: unit.unitType,
//         area: unit.details?.area,
//         occupancyStatus: unit.occupancy?.status,
//         ownerName: unit.ownership?.ownerName,
//         ownerEmail: unit.ownership?.ownerEmail,
//         tenantName: unit.tenant?.tenantName,
//         isRented: unit.tenant?.isActive
//       }))
//     }));
    
//     res.json({
//       success: true,
//       data: {
//         building: {
//           id: building._id,
//           name: building.name,
//           code: building.code,
//           type: building.type,
//           address: building.address,
//           statistics: building.statistics
//         },
//         floors
//       }
//     });
//   } catch (error) {
//     console.error('Get building hierarchy error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== 🔴 FIX: FLOOR MANAGEMENT FUNCTIONS ====================

// // Get Floors (for building)
// const getFloors = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
    
//     // 🔴 FIX: Handle missing buildingId
//     if (!buildingId) {
//       return res.status(400).json({ success: false, error: 'Building ID is required' });
//     }
    
//     // Check if building exists
//     const building = await Building.findById(buildingId);
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     // Get floors from units aggregation
//     const floors = await Unit.aggregate([
//       { $match: { buildingId: new mongoose.Types.ObjectId(buildingId), status: 'active' } },
//       { $group: { _id: '$floorNumber', unitCount: { $sum: 1 } } },
//       { $sort: { _id: 1 } }
//     ]);
    
//     res.json({
//       success: true,
//       data: floors.map(floor => ({ floorNumber: floor._id, unitCount: floor.unitCount }))
//     });
//   } catch (error) {
//     console.error('Get floors error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // 🔴 FIX: Add Floor
// const addFloor = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
//     const { floorNumber } = req.body;
    
//     if (!floorNumber) {
//       return res.status(400).json({ success: false, error: 'Floor number is required' });
//     }
    
//     const building = await Building.findById(buildingId);
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     // Check if floor already exists in units
//     const existingFloor = await Unit.findOne({ 
//       buildingId, 
//       floorNumber: parseInt(floorNumber),
//       status: 'active'
//     });
    
//     if (existingFloor) {
//       return res.status(400).json({ success: false, error: 'Floor already has units' });
//     }
    
//     res.status(201).json({
//       success: true,
//       data: { floorNumber: parseInt(floorNumber), unitCount: 0 },
//       message: 'Floor added successfully'
//     });
//   } catch (error) {
//     console.error('Add floor error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // 🔴 FIX: Update Floor
// const updateFloor = async (req, res) => {
//   try {
//     const { buildingId, floorNumber } = req.params;
//     const { unitCount } = req.body;
    
//     const building = await Building.findById(buildingId);
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     // Update is handled at unit level, just return success
//     res.json({
//       success: true,
//       data: { floorNumber: parseInt(floorNumber), unitCount: unitCount || 0 },
//       message: 'Floor updated successfully'
//     });
//   } catch (error) {
//     console.error('Update floor error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // 🔴 FIX: Delete Floor
// const deleteFloor = async (req, res) => {
//   try {
//     const { buildingId, floorNumber } = req.params;
    
//     // Check if there are units on this floor
//     const unitsOnFloor = await Unit.countDocuments({ 
//       buildingId, 
//       floorNumber: parseInt(floorNumber),
//       status: 'active'
//     });
    
//     if (unitsOnFloor > 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: `Cannot delete floor with ${unitsOnFloor} units. Move or delete units first.` 
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Floor deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete floor error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get Unit Types Summary
// const getUnitTypeSummary = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
    
//     if (!buildingId) {
//       return res.status(400).json({ success: false, error: 'Building ID is required' });
//     }
    
//     const summary = await Unit.aggregate([
//       { $match: { buildingId: new mongoose.Types.ObjectId(buildingId), status: 'active' } },
//       { 
//         $group: { 
//           _id: '$unitType', 
//           count: { $sum: 1 },
//           occupied: { 
//             $sum: { 
//               $cond: [{ $in: ['$occupancy.status', ['owner_occupied', 'tenant_occupied']] }, 1, 0] 
//             } 
//           }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);
    
//     res.json({
//       success: true,
//       data: summary
//     });
//   } catch (error) {
//     console.error('Get unit type summary error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UNIT MANAGEMENT ====================

// // Create Unit
// const createUnit = async (req, res) => {
//   try {
//     const unitData = req.body;
//     unitData.createdBy = req.userId || req.user._id;
    
//     // Check if unit already exists
//     const existingUnit = await Unit.findOne({
//       buildingId: unitData.buildingId,
//       floorNumber: unitData.floorNumber,
//       unitNumber: unitData.unitNumber
//     });
    
//     if (existingUnit) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Unit already exists in this building' 
//       });
//     }
    
//     const unit = new Unit(unitData);
//     await unit.save();
    
//     // Update building statistics
//     await updateBuildingStatistics(unitData.buildingId);
    
//     res.status(201).json({
//       success: true,
//       data: unit,
//       message: 'Unit created successfully'
//     });
//   } catch (error) {
//     console.error('Create unit error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Get Units by Building
// const getUnitsByBuilding = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
//     const { floor, status, type, search, page = 1, limit = 50 } = req.query;
    
//     // 🔴 FIX: Handle missing buildingId
//     if (!buildingId || buildingId === 'undefined') {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Building ID is required' 
//       });
//     }
    
//     const query = { buildingId, status: 'active' };
//     if (floor) query.floorNumber = parseInt(floor);
//     if (status) query['occupancy.status'] = status;
//     if (type) query.unitType = type;
//     if (search) {
//       query.$or = [
//         { unitNumber: { $regex: search, $options: 'i' } },
//         { 'ownership.ownerName': { $regex: search, $options: 'i' } },
//         { 'tenant.tenantName': { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const [units, total] = await Promise.all([
//       Unit.find(query)
//         .sort({ floorNumber: 1, unitNumber: 1 })
//         .skip(skip)
//         .limit(parseInt(limit))
//         .populate('ownership.ownerId', 'firstName lastName email phone')
//         .populate('tenant.tenantId', 'firstName lastName email phone'),
//       Unit.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         units,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / parseInt(limit))
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get units by building error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get Unit by ID
// const getUnitById = async (req, res) => {
//   try {
//     const unit = await Unit.findById(req.params.id)
//       .populate('buildingId', 'name code address')
//       .populate('ownership.ownerId', 'firstName lastName email phone profileImage')
//       .populate('tenant.tenantId', 'firstName lastName email phone');
    
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     res.json({
//       success: true,
//       data: unit
//     });
//   } catch (error) {
//     console.error('Get unit by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Update Unit
// const updateUnit = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     updates.updatedBy = req.userId || req.user._id;
//     updates.updatedAt = new Date();
    
//     const unit = await Unit.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     );
    
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       data: unit,
//       message: 'Unit updated successfully'
//     });
//   } catch (error) {
//     console.error('Update unit error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Delete Unit
// const deleteUnit = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const unit = await Unit.findByIdAndUpdate(
//       id,
//       { status: 'inactive', updatedAt: new Date() }
//     );
    
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       message: 'Unit deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete unit error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== OWNER & TENANT ASSIGNMENT ====================

// // Assign Owner to Unit
// const assignOwnerToUnit = async (req, res) => {
//   try {
//     const { unitId } = req.params;
//     const { ownerId, ownerName, ownerEmail, ownerPhone, ownerNationality, ownershipStartDate } = req.body;
    
//     const unit = await Unit.findById(unitId);
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     let customer = null;
//     if (ownerId) {
//       customer = await Customer.findById(ownerId);
//     } else if (ownerEmail || ownerPhone) {
//       customer = await Customer.findOne({ 
//         $or: [{ email: ownerEmail }, { phone: ownerPhone }] 
//       });
//     }
    
//     // Create new customer if not exists
//     if (!customer && (ownerName && ownerEmail && ownerPhone)) {
//       const nameParts = ownerName.split(' ');
//       customer = new Customer({
//         firstName: nameParts[0],
//         lastName: nameParts.slice(1).join(' ') || '',
//         email: ownerEmail,
//         phone: ownerPhone,
//         nationality: ownerNationality,
//         registrationMethod: 'admin',
//         isRegistered: false
//       });
//       await customer.save();
//     }
    
//     // Update unit ownership
//     unit.ownership = {
//       ownerId: customer?._id,
//       ownerName: ownerName || (customer ? `${customer.firstName} ${customer.lastName}` : ''),
//       ownerEmail: ownerEmail || customer?.email,
//       ownerPhone: ownerPhone || customer?.phone,
//       ownerNationality: ownerNationality || customer?.nationality,
//       ownershipStartDate: ownershipStartDate || new Date()
//     };
    
//     // Update occupancy status
//     if (unit.tenant?.isActive) {
//       unit.occupancy.status = 'tenant_occupied';
//     } else {
//       unit.occupancy.status = 'owner_occupied';
//     }
    
//     await unit.save();
    
//     // Update customer's owned units
//     if (customer) {
//       const building = await Building.findById(unit.buildingId);
//       customer.ownedUnits = customer.ownedUnits || [];
//       customer.ownedUnits.push({
//         unitId: unit._id,
//         buildingId: unit.buildingId,
//         unitNumber: unit.unitNumber,
//         buildingName: building.name,
//         ownershipStartDate: new Date(),
//         isActive: true
//       });
//       await customer.save();
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       data: { unit, customer },
//       message: 'Owner assigned successfully'
//     });
//   } catch (error) {
//     console.error('Assign owner error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Assign Tenant to Unit
// const assignTenantToUnit = async (req, res) => {
//   try {
//     const { unitId } = req.params;
//     const { 
//       tenantId, tenantName, tenantEmail, tenantPhone,
//       leaseStartDate, leaseEndDate, monthlyRent, securityDeposit
//     } = req.body;
    
//     const unit = await Unit.findById(unitId);
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     let customer = null;
//     if (tenantId) {
//       customer = await Customer.findById(tenantId);
//     } else if (tenantEmail || tenantPhone) {
//       customer = await Customer.findOne({ 
//         $or: [{ email: tenantEmail }, { phone: tenantPhone }] 
//       });
//     }
    
//     // Create new customer if not exists
//     if (!customer && (tenantName && tenantEmail && tenantPhone)) {
//       const nameParts = tenantName.split(' ');
//       customer = new Customer({
//         firstName: nameParts[0],
//         lastName: nameParts.slice(1).join(' ') || '',
//         email: tenantEmail,
//         phone: tenantPhone,
//         registrationMethod: 'admin',
//         isRegistered: false
//       });
//       await customer.save();
//     }
    
//     // Update unit tenant
//     unit.tenant = {
//       tenantId: customer?._id,
//       tenantName: tenantName || (customer ? `${customer.firstName} ${customer.lastName}` : ''),
//       tenantEmail: tenantEmail || customer?.email,
//       tenantPhone: tenantPhone || customer?.phone,
//       leaseStartDate: leaseStartDate || new Date(),
//       leaseEndDate: leaseEndDate,
//       monthlyRent: monthlyRent,
//       securityDeposit: securityDeposit,
//       isActive: true
//     };
    
//     // Update occupancy status
//     unit.occupancy.status = 'tenant_occupied';
//     unit.occupancy.moveInDate = leaseStartDate || new Date();
    
//     await unit.save();
    
//     // Update customer's rented units
//     if (customer) {
//       const building = await Building.findById(unit.buildingId);
//       customer.rentedUnits = customer.rentedUnits || [];
//       customer.rentedUnits.push({
//         unitId: unit._id,
//         buildingId: unit.buildingId,
//         unitNumber: unit.unitNumber,
//         buildingName: building.name,
//         leaseStartDate: leaseStartDate || new Date(),
//         leaseEndDate: leaseEndDate,
//         monthlyRent: monthlyRent,
//         isActive: true
//       });
//       await customer.save();
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       data: { unit, customer },
//       message: 'Tenant assigned successfully'
//     });
//   } catch (error) {
//     console.error('Assign tenant error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Remove Tenant from Unit
// const removeTenant = async (req, res) => {
//   try {
//     const { unitId } = req.params;
    
//     const unit = await Unit.findById(unitId);
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     // Update customer's rented units
//     if (unit.tenant.tenantId) {
//       await Customer.updateOne(
//         { _id: unit.tenant.tenantId, 'rentedUnits.unitId': unitId },
//         { $set: { 'rentedUnits.$.isActive': false, 'rentedUnits.$.leaseEndDate': new Date() } }
//       );
//     }
    
//     // Clear tenant data
//     unit.tenant = {
//       tenantId: null,
//       tenantName: '',
//       tenantEmail: '',
//       tenantPhone: '',
//       isActive: false
//     };
    
//     // Update occupancy status based on ownership
//     unit.occupancy.status = unit.ownership.ownerId ? 'owner_occupied' : 'vacant';
//     unit.occupancy.moveOutDate = new Date();
    
//     await unit.save();
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       message: 'Tenant removed successfully'
//     });
//   } catch (error) {
//     console.error('Remove tenant error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== BULK OPERATIONS ====================

// // Bulk Import Units
// const bulkImportUnits = async (req, res) => {
//   try {
//     const { buildingId, units } = req.body;
    
//     const building = await Building.findById(buildingId);
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     const results = {
//       success: [],
//       failed: [],
//       customersCreated: 0
//     };
    
//     for (const unitData of units) {
//       try {
//         // Check if unit exists
//         const existingUnit = await Unit.findOne({
//           buildingId,
//           floorNumber: unitData.floorNumber,
//           unitNumber: unitData.unitNumber
//         });
        
//         if (existingUnit) {
//           results.failed.push({ ...unitData, reason: 'Unit already exists' });
//           continue;
//         }
        
//         // Create or find owner customer
//         let ownerCustomer = null;
//         if (unitData.ownerEmail || unitData.ownerPhone) {
//           ownerCustomer = await Customer.findOne({
//             $or: [
//               { email: unitData.ownerEmail },
//               { phone: unitData.ownerPhone }
//             ]
//           });
          
//           if (!ownerCustomer && unitData.ownerName) {
//             const nameParts = unitData.ownerName.split(' ');
//             ownerCustomer = new Customer({
//               firstName: nameParts[0],
//               lastName: nameParts.slice(1).join(' ') || '',
//               email: unitData.ownerEmail,
//               phone: unitData.ownerPhone,
//               registrationMethod: 'import',
//               isRegistered: false
//             });
//             await ownerCustomer.save();
//             results.customersCreated++;
//           }
//         }
        
//         const unit = new Unit({
//           buildingId,
//           floorNumber: unitData.floorNumber,
//           unitNumber: unitData.unitNumber,
//           unitType: unitData.unitType || 'apartment',
//           details: {
//             area: unitData.area,
//             bedrooms: unitData.bedrooms,
//             bathrooms: unitData.bathrooms
//           },
//           ownership: {
//             ownerId: ownerCustomer?._id,
//             ownerName: unitData.ownerName,
//             ownerEmail: unitData.ownerEmail,
//             ownerPhone: unitData.ownerPhone,
//             ownershipStartDate: new Date()
//           },
//           occupancy: {
//             status: ownerCustomer ? 'owner_occupied' : 'vacant'
//           },
//           createdBy: req.userId || req.user._id
//         });
        
//         await unit.save();
        
//         // Update customer's owned units
//         if (ownerCustomer) {
//           ownerCustomer.ownedUnits = ownerCustomer.ownedUnits || [];
//           ownerCustomer.ownedUnits.push({
//             unitId: unit._id,
//             buildingId: building._id,
//             unitNumber: unit.unitNumber,
//             buildingName: building.name,
//             ownershipStartDate: new Date(),
//             isActive: true
//           });
//           await ownerCustomer.save();
//         }
        
//         results.success.push(unit);
//       } catch (error) {
//         results.failed.push({ ...unitData, reason: error.message });
//       }
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(buildingId);
    
//     res.json({
//       success: true,
//       data: results,
//       message: `Imported ${results.success.length} units, ${results.failed.length} failed. Created ${results.customersCreated} customers.`
//     });
//   } catch (error) {
//     console.error('Bulk import units error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Export Units
// const exportUnits = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
//     const { format = 'json' } = req.query;
    
//     const units = await Unit.find({ buildingId, status: 'active' })
//       .populate('buildingId', 'name code')
//       .sort({ floorNumber: 1, unitNumber: 1 });
    
//     const exportData = units.map(unit => ({
//       buildingCode: unit.buildingId.code,
//       buildingName: unit.buildingId.name,
//       floorNumber: unit.floorNumber,
//       unitNumber: unit.unitNumber,
//       unitType: unit.unitType,
//       area: unit.details?.area,
//       bedrooms: unit.details?.bedrooms,
//       bathrooms: unit.details?.bathrooms,
//       ownerName: unit.ownership?.ownerName,
//       ownerEmail: unit.ownership?.ownerEmail,
//       ownerPhone: unit.ownership?.ownerPhone,
//       tenantName: unit.tenant?.tenantName,
//       tenantEmail: unit.tenant?.tenantEmail,
//       occupancyStatus: unit.occupancy?.status,
//       status: unit.status
//     }));
    
//     res.json({
//       success: true,
//       data: exportData
//     });
//   } catch (error) {
//     console.error('Export units error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== HELPER FUNCTIONS ====================

// async function updateBuildingStatistics(buildingId) {
//   try {
//     const unitCount = await Unit.countDocuments({ buildingId, status: 'active' });
//     const occupiedCount = await Unit.countDocuments({ 
//       buildingId, 
//       'occupancy.status': { $in: ['owner_occupied', 'tenant_occupied'] },
//       status: 'active'
//     });
//     const maintenanceCount = await Unit.countDocuments({ 
//       buildingId, 
//       'occupancy.status': 'maintenance',
//       status: 'active'
//     });
    
//     await Building.updateOne(
//       { _id: buildingId },
//       { 
//         $set: { 
//           'statistics.totalUnits': unitCount,
//           'statistics.occupiedUnits': occupiedCount,
//           'statistics.vacantUnits': unitCount - occupiedCount - maintenanceCount,
//           'statistics.underMaintenance': maintenanceCount
//         }
//       }
//     );
//   } catch (error) {
//     console.error('Update building statistics error:', error);
//   }
// }

// // ==================== EXPORTS ====================

// module.exports = {
//   // Building CRUD
//   createBuilding,
//   getBuildings,
//   getBuildingById,
//   updateBuilding,
//   deleteBuilding,
//   getBuildingHierarchy,
//   getFloors,
//   getUnitTypeSummary,
  
//   // 🔴 FIX: Added floor management exports
//   addFloor,
//   updateFloor,
//   deleteFloor,
  
//   // Unit Management
//   createUnit,
//   getUnitsByBuilding,
//   getUnitById,
//   updateUnit,
//   deleteUnit,
  
//   // Owner & Tenant Assignment
//   assignOwnerToUnit,
//   assignTenantToUnit,
//   removeTenant,
  
//   // Bulk Operations
//   bulkImportUnits,
//   exportUnits
// };


/**
 * BUILDING CONTROLLER
 * Handles all building-related operations
 * Features: Building CRUD, Unit Management, Owner/Tenant Assignment, Bulk Operations
 */

// const mongoose = require('mongoose');
// const Building = require('../models/Building.model');
// const Unit = require('../models/Unit.model');
// const Customer = require('../models/Customer.model');

// // ==================== BUILDING CRUD ====================

// // Create Building
// const createBuilding = async (req, res) => {
//   try {
//     const buildingData = req.body;
//     buildingData.createdBy = req.userId || req.user._id;
    
//     // Check if building code already exists
//     const existingBuilding = await Building.findOne({ code: buildingData.code });
//     if (existingBuilding) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Building code already exists' 
//       });
//     }
    
//     const building = new Building(buildingData);
//     await building.save();
    
//     res.status(201).json({
//       success: true,
//       data: building,
//       message: 'Building created successfully'
//     });
//   } catch (error) {
//     console.error('Create building error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Get All Buildings (with filters)
// const getBuildings = async (req, res) => {
//   try {
//     const { 
//       page = 1, 
//       limit = 20, 
//       search, 
//       type, 
//       status, 
//       city,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;
    
//     const query = {};
    
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { code: { $regex: search, $options: 'i' } },
//         { 'address.city': { $regex: search, $options: 'i' } }
//       ];
//     }
//     if (type) query.type = type;
//     if (status) query.status = status;
//     if (city) query['address.city'] = { $regex: city, $options: 'i' };
    
//     const skip = (page - 1) * limit;
//     const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
//     const [buildings, total] = await Promise.all([
//       Building.find(query)
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(parseInt(limit))
//         .populate('createdBy', 'firstName lastName email'),
//       Building.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         buildings,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / limit)
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get buildings error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get Building by ID
// const getBuildingById = async (req, res) => {
//   try {
//     // 🔴 FIX: Validate ObjectId before query
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ success: false, error: 'Invalid building ID' });
//     }
    
//     const building = await Building.findById(req.params.id)
//       .populate('createdBy', 'firstName lastName email')
//       .populate('updatedBy', 'firstName lastName email');
    
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     // Get units for this building
//     const units = await Unit.find({ buildingId: building._id, status: 'active' })
//       .sort({ floorNumber: 1, unitNumber: 1 });
    
//     res.json({
//       success: true,
//       data: { building, units }
//     });
//   } catch (error) {
//     console.error('Get building by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Update Building
// const updateBuilding = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     updates.updatedBy = req.userId || req.user._id;
//     updates.updatedAt = new Date();
    
//     const building = await Building.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     );
    
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     res.json({
//       success: true,
//       data: building,
//       message: 'Building updated successfully'
//     });
//   } catch (error) {
//     console.error('Update building error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Delete Building (Soft delete)
// const deleteBuilding = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Check if building has units
//     const unitCount = await Unit.countDocuments({ buildingId: id });
//     if (unitCount > 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: `Cannot delete building with ${unitCount} units. Archive or reassign units first.` 
//       });
//     }
    
//     const building = await Building.findByIdAndUpdate(
//       id,
//       { status: 'inactive', updatedAt: new Date() },
//       { new: true }
//     );
    
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     res.json({
//       success: true,
//       message: 'Building deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete building error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get Building Hierarchy
// const getBuildingHierarchy = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const building = await Building.findById(id);
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     // Get all units grouped by floor
//     const units = await Unit.find({ buildingId: id, status: 'active' })
//       .populate('ownership.ownerId', 'firstName lastName email phone')
//       .populate('tenant.tenantId', 'firstName lastName email phone')
//       .sort({ floorNumber: 1, unitNumber: 1 });
    
//     // Group units by floor
//     const floorsMap = new Map();
//     units.forEach(unit => {
//       if (!floorsMap.has(unit.floorNumber)) {
//         floorsMap.set(unit.floorNumber, []);
//       }
//       floorsMap.get(unit.floorNumber).push(unit);
//     });
    
//     // Convert to array format
//     const floors = Array.from(floorsMap.entries()).map(([floorNumber, unitsList]) => ({
//       floorNumber,
//       unitCount: unitsList.length,
//       units: unitsList.map(unit => ({
//         id: unit._id,
//         unitNumber: unit.unitNumber,
//         unitType: unit.unitType,
//         area: unit.details?.area,
//         occupancyStatus: unit.occupancy?.status,
//         ownerName: unit.ownership?.ownerName,
//         ownerEmail: unit.ownership?.ownerEmail,
//         tenantName: unit.tenant?.tenantName,
//         isRented: unit.tenant?.isActive
//       }))
//     }));
    
//     res.json({
//       success: true,
//       data: {
//         building: {
//           id: building._id,
//           name: building.name,
//           code: building.code,
//           type: building.type,
//           address: building.address,
//           statistics: building.statistics
//         },
//         floors
//       }
//     });
//   } catch (error) {
//     console.error('Get building hierarchy error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== FLOOR MANAGEMENT FUNCTIONS ====================

// // Get Floors (for building)
// const getFloors = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
    
//     // 🔴 FIX: Handle missing or invalid buildingId
//     if (!buildingId || buildingId === 'undefined' || buildingId === 'null') {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Building ID is required. Use /buildings/:buildingId/floors' 
//       });
//     }
    
//     // 🔴 FIX: Validate ObjectId format
//     if (!mongoose.Types.ObjectId.isValid(buildingId)) {
//       return res.status(400).json({ success: false, error: 'Invalid building ID format' });
//     }
    
//     // Check if building exists
//     const building = await Building.findById(buildingId);
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     // Get floors from units aggregation
//     const floors = await Unit.aggregate([
//       { $match: { buildingId: new mongoose.Types.ObjectId(buildingId), status: 'active' } },
//       { $group: { _id: '$floorNumber', unitCount: { $sum: 1 } } },
//       { $sort: { _id: 1 } }
//     ]);
    
//     res.json({
//       success: true,
//       data: floors.map(floor => ({ floorNumber: floor._id, unitCount: floor.unitCount }))
//     });
//   } catch (error) {
//     console.error('Get floors error:', error);
//     // 🔴 FIX: Return empty array instead of error for better UX
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Add Floor
// const addFloor = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
//     const { floorNumber } = req.body;
    
//     if (!floorNumber) {
//       return res.status(400).json({ success: false, error: 'Floor number is required' });
//     }
    
//     const building = await Building.findById(buildingId);
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     // Check if floor already exists in units
//     const existingFloor = await Unit.findOne({ 
//       buildingId, 
//       floorNumber: parseInt(floorNumber),
//       status: 'active'
//     });
    
//     if (existingFloor) {
//       return res.status(400).json({ success: false, error: 'Floor already has units' });
//     }
    
//     res.status(201).json({
//       success: true,
//       data: { floorNumber: parseInt(floorNumber), unitCount: 0 },
//       message: 'Floor added successfully'
//     });
//   } catch (error) {
//     console.error('Add floor error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Update Floor
// const updateFloor = async (req, res) => {
//   try {
//     const { buildingId, floorNumber } = req.params;
//     const { unitCount } = req.body;
    
//     const building = await Building.findById(buildingId);
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     res.json({
//       success: true,
//       data: { floorNumber: parseInt(floorNumber), unitCount: unitCount || 0 },
//       message: 'Floor updated successfully'
//     });
//   } catch (error) {
//     console.error('Update floor error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Delete Floor
// const deleteFloor = async (req, res) => {
//   try {
//     const { buildingId, floorNumber } = req.params;
    
//     // Check if there are units on this floor
//     const unitsOnFloor = await Unit.countDocuments({ 
//       buildingId, 
//       floorNumber: parseInt(floorNumber),
//       status: 'active'
//     });
    
//     if (unitsOnFloor > 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: `Cannot delete floor with ${unitsOnFloor} units. Move or delete units first.` 
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Floor deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete floor error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get Unit Types Summary
// const getUnitTypeSummary = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
    
//     if (!buildingId || buildingId === 'undefined') {
//       return res.status(400).json({ success: false, error: 'Building ID is required' });
//     }
    
//     const summary = await Unit.aggregate([
//       { $match: { buildingId: new mongoose.Types.ObjectId(buildingId), status: 'active' } },
//       { 
//         $group: { 
//           _id: '$unitType', 
//           count: { $sum: 1 },
//           occupied: { 
//             $sum: { 
//               $cond: [{ $in: ['$occupancy.status', ['owner_occupied', 'tenant_occupied']] }, 1, 0] 
//             } 
//           }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);
    
//     res.json({
//       success: true,
//       data: summary
//     });
//   } catch (error) {
//     console.error('Get unit type summary error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UNIT MANAGEMENT ====================

// // Create Unit
// const createUnit = async (req, res) => {
//   try {
//     const unitData = req.body;
//     unitData.createdBy = req.userId || req.user._id;
    
//     // Check if unit already exists
//     const existingUnit = await Unit.findOne({
//       buildingId: unitData.buildingId,
//       floorNumber: unitData.floorNumber,
//       unitNumber: unitData.unitNumber
//     });
    
//     if (existingUnit) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Unit already exists in this building' 
//       });
//     }
    
//     const unit = new Unit(unitData);
//     await unit.save();
    
//     // Update building statistics
//     await updateBuildingStatistics(unitData.buildingId);
    
//     res.status(201).json({
//       success: true,
//       data: unit,
//       message: 'Unit created successfully'
//     });
//   } catch (error) {
//     console.error('Create unit error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Get Units by Building
// const getUnitsByBuilding = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
//     const { floor, status, type, search, page = 1, limit = 50 } = req.query;
    
//     // 🔴 FIX: Handle missing or invalid buildingId
//     if (!buildingId || buildingId === 'undefined' || buildingId === 'null') {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Building ID is required' 
//       });
//     }
    
//     // 🔴 FIX: Validate ObjectId format
//     if (!mongoose.Types.ObjectId.isValid(buildingId)) {
//       return res.status(400).json({ success: false, error: 'Invalid building ID format' });
//     }
    
//     const query = { buildingId, status: 'active' };
//     if (floor && floor !== 'undefined') query.floorNumber = parseInt(floor);
//     if (status && status !== 'undefined') query['occupancy.status'] = status;
//     if (type && type !== 'undefined') query.unitType = type;
//     if (search) {
//       query.$or = [
//         { unitNumber: { $regex: search, $options: 'i' } },
//         { 'ownership.ownerName': { $regex: search, $options: 'i' } },
//         { 'tenant.tenantName': { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const [units, total] = await Promise.all([
//       Unit.find(query)
//         .sort({ floorNumber: 1, unitNumber: 1 })
//         .skip(skip)
//         .limit(parseInt(limit))
//         .populate('ownership.ownerId', 'firstName lastName email phone')
//         .populate('tenant.tenantId', 'firstName lastName email phone'),
//       Unit.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         units,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / parseInt(limit))
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get units by building error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get Unit by ID
// const getUnitById = async (req, res) => {
//   try {
//     const unit = await Unit.findById(req.params.id)
//       .populate('buildingId', 'name code address')
//       .populate('ownership.ownerId', 'firstName lastName email phone profileImage')
//       .populate('tenant.tenantId', 'firstName lastName email phone');
    
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     res.json({
//       success: true,
//       data: unit
//     });
//   } catch (error) {
//     console.error('Get unit by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Update Unit
// const updateUnit = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     updates.updatedBy = req.userId || req.user._id;
//     updates.updatedAt = new Date();
    
//     const unit = await Unit.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     );
    
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       data: unit,
//       message: 'Unit updated successfully'
//     });
//   } catch (error) {
//     console.error('Update unit error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Delete Unit
// const deleteUnit = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const unit = await Unit.findByIdAndUpdate(
//       id,
//       { status: 'inactive', updatedAt: new Date() }
//     );
    
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       message: 'Unit deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete unit error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== OWNER & TENANT ASSIGNMENT ====================

// // Assign Owner to Unit
// const assignOwnerToUnit = async (req, res) => {
//   try {
//     const { unitId } = req.params;
//     const { ownerId, ownerName, ownerEmail, ownerPhone, ownerNationality, ownershipStartDate } = req.body;
    
//     const unit = await Unit.findById(unitId);
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     let customer = null;
//     if (ownerId) {
//       customer = await Customer.findById(ownerId);
//     } else if (ownerEmail || ownerPhone) {
//       customer = await Customer.findOne({ 
//         $or: [{ email: ownerEmail }, { phone: ownerPhone }] 
//       });
//     }
    
//     // Create new customer if not exists
//     if (!customer && (ownerName && ownerEmail && ownerPhone)) {
//       const nameParts = ownerName.split(' ');
//       customer = new Customer({
//         firstName: nameParts[0],
//         lastName: nameParts.slice(1).join(' ') || '',
//         email: ownerEmail,
//         phone: ownerPhone,
//         nationality: ownerNationality,
//         registrationMethod: 'admin',
//         isRegistered: false
//       });
//       await customer.save();
//     }
    
//     // Update unit ownership
//     unit.ownership = {
//       ownerId: customer?._id,
//       ownerName: ownerName || (customer ? `${customer.firstName} ${customer.lastName}` : ''),
//       ownerEmail: ownerEmail || customer?.email,
//       ownerPhone: ownerPhone || customer?.phone,
//       ownerNationality: ownerNationality || customer?.nationality,
//       ownershipStartDate: ownershipStartDate || new Date()
//     };
    
//     // Update occupancy status
//     if (unit.tenant?.isActive) {
//       unit.occupancy.status = 'tenant_occupied';
//     } else {
//       unit.occupancy.status = 'owner_occupied';
//     }
    
//     await unit.save();
    
//     // Update customer's owned units
//     if (customer) {
//       const building = await Building.findById(unit.buildingId);
//       customer.ownedUnits = customer.ownedUnits || [];
//       customer.ownedUnits.push({
//         unitId: unit._id,
//         buildingId: unit.buildingId,
//         unitNumber: unit.unitNumber,
//         buildingName: building.name,
//         ownershipStartDate: new Date(),
//         isActive: true
//       });
//       await customer.save();
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       data: { unit, customer },
//       message: 'Owner assigned successfully'
//     });
//   } catch (error) {
//     console.error('Assign owner error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Assign Tenant to Unit
// const assignTenantToUnit = async (req, res) => {
//   try {
//     const { unitId } = req.params;
//     const { 
//       tenantId, tenantName, tenantEmail, tenantPhone,
//       leaseStartDate, leaseEndDate, monthlyRent, securityDeposit
//     } = req.body;
    
//     const unit = await Unit.findById(unitId);
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     let customer = null;
//     if (tenantId) {
//       customer = await Customer.findById(tenantId);
//     } else if (tenantEmail || tenantPhone) {
//       customer = await Customer.findOne({ 
//         $or: [{ email: tenantEmail }, { phone: tenantPhone }] 
//       });
//     }
    
//     // Create new customer if not exists
//     if (!customer && (tenantName && tenantEmail && tenantPhone)) {
//       const nameParts = tenantName.split(' ');
//       customer = new Customer({
//         firstName: nameParts[0],
//         lastName: nameParts.slice(1).join(' ') || '',
//         email: tenantEmail,
//         phone: tenantPhone,
//         registrationMethod: 'admin',
//         isRegistered: false
//       });
//       await customer.save();
//     }
    
//     // Update unit tenant
//     unit.tenant = {
//       tenantId: customer?._id,
//       tenantName: tenantName || (customer ? `${customer.firstName} ${customer.lastName}` : ''),
//       tenantEmail: tenantEmail || customer?.email,
//       tenantPhone: tenantPhone || customer?.phone,
//       leaseStartDate: leaseStartDate || new Date(),
//       leaseEndDate: leaseEndDate,
//       monthlyRent: monthlyRent,
//       securityDeposit: securityDeposit,
//       isActive: true
//     };
    
//     // Update occupancy status
//     unit.occupancy.status = 'tenant_occupied';
//     unit.occupancy.moveInDate = leaseStartDate || new Date();
    
//     await unit.save();
    
//     // Update customer's rented units
//     if (customer) {
//       const building = await Building.findById(unit.buildingId);
//       customer.rentedUnits = customer.rentedUnits || [];
//       customer.rentedUnits.push({
//         unitId: unit._id,
//         buildingId: unit.buildingId,
//         unitNumber: unit.unitNumber,
//         buildingName: building.name,
//         leaseStartDate: leaseStartDate || new Date(),
//         leaseEndDate: leaseEndDate,
//         monthlyRent: monthlyRent,
//         isActive: true
//       });
//       await customer.save();
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       data: { unit, customer },
//       message: 'Tenant assigned successfully'
//     });
//   } catch (error) {
//     console.error('Assign tenant error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Remove Tenant from Unit
// const removeTenant = async (req, res) => {
//   try {
//     const { unitId } = req.params;
    
//     const unit = await Unit.findById(unitId);
//     if (!unit) {
//       return res.status(404).json({ success: false, error: 'Unit not found' });
//     }
    
//     // Update customer's rented units
//     if (unit.tenant.tenantId) {
//       await Customer.updateOne(
//         { _id: unit.tenant.tenantId, 'rentedUnits.unitId': unitId },
//         { $set: { 'rentedUnits.$.isActive': false, 'rentedUnits.$.leaseEndDate': new Date() } }
//       );
//     }
    
//     // Clear tenant data
//     unit.tenant = {
//       tenantId: null,
//       tenantName: '',
//       tenantEmail: '',
//       tenantPhone: '',
//       isActive: false
//     };
    
//     // Update occupancy status based on ownership
//     unit.occupancy.status = unit.ownership.ownerId ? 'owner_occupied' : 'vacant';
//     unit.occupancy.moveOutDate = new Date();
    
//     await unit.save();
    
//     // Update building statistics
//     await updateBuildingStatistics(unit.buildingId);
    
//     res.json({
//       success: true,
//       message: 'Tenant removed successfully'
//     });
//   } catch (error) {
//     console.error('Remove tenant error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== BULK OPERATIONS ====================

// // Bulk Import Units
// const bulkImportUnits = async (req, res) => {
//   try {
//     const { buildingId, units } = req.body;
    
//     const building = await Building.findById(buildingId);
//     if (!building) {
//       return res.status(404).json({ success: false, error: 'Building not found' });
//     }
    
//     const results = {
//       success: [],
//       failed: [],
//       customersCreated: 0
//     };
    
//     for (const unitData of units) {
//       try {
//         // Check if unit exists
//         const existingUnit = await Unit.findOne({
//           buildingId,
//           floorNumber: unitData.floorNumber,
//           unitNumber: unitData.unitNumber
//         });
        
//         if (existingUnit) {
//           results.failed.push({ ...unitData, reason: 'Unit already exists' });
//           continue;
//         }
        
//         // Create or find owner customer
//         let ownerCustomer = null;
//         if (unitData.ownerEmail || unitData.ownerPhone) {
//           ownerCustomer = await Customer.findOne({
//             $or: [
//               { email: unitData.ownerEmail },
//               { phone: unitData.ownerPhone }
//             ]
//           });
          
//           if (!ownerCustomer && unitData.ownerName) {
//             const nameParts = unitData.ownerName.split(' ');
//             ownerCustomer = new Customer({
//               firstName: nameParts[0],
//               lastName: nameParts.slice(1).join(' ') || '',
//               email: unitData.ownerEmail,
//               phone: unitData.ownerPhone,
//               registrationMethod: 'import',
//               isRegistered: false
//             });
//             await ownerCustomer.save();
//             results.customersCreated++;
//           }
//         }
        
//         const unit = new Unit({
//           buildingId,
//           floorNumber: unitData.floorNumber,
//           unitNumber: unitData.unitNumber,
//           unitType: unitData.unitType || 'apartment',
//           details: {
//             area: unitData.area,
//             bedrooms: unitData.bedrooms,
//             bathrooms: unitData.bathrooms
//           },
//           ownership: {
//             ownerId: ownerCustomer?._id,
//             ownerName: unitData.ownerName,
//             ownerEmail: unitData.ownerEmail,
//             ownerPhone: unitData.ownerPhone,
//             ownershipStartDate: new Date()
//           },
//           occupancy: {
//             status: ownerCustomer ? 'owner_occupied' : 'vacant'
//           },
//           createdBy: req.userId || req.user._id
//         });
        
//         await unit.save();
        
//         // Update customer's owned units
//         if (ownerCustomer) {
//           ownerCustomer.ownedUnits = ownerCustomer.ownedUnits || [];
//           ownerCustomer.ownedUnits.push({
//             unitId: unit._id,
//             buildingId: building._id,
//             unitNumber: unit.unitNumber,
//             buildingName: building.name,
//             ownershipStartDate: new Date(),
//             isActive: true
//           });
//           await ownerCustomer.save();
//         }
        
//         results.success.push(unit);
//       } catch (error) {
//         results.failed.push({ ...unitData, reason: error.message });
//       }
//     }
    
//     // Update building statistics
//     await updateBuildingStatistics(buildingId);
    
//     res.json({
//       success: true,
//       data: results,
//       message: `Imported ${results.success.length} units, ${results.failed.length} failed. Created ${results.customersCreated} customers.`
//     });
//   } catch (error) {
//     console.error('Bulk import units error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Export Units
// const exportUnits = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
//     const { format = 'json' } = req.query;
    
//     const units = await Unit.find({ buildingId, status: 'active' })
//       .populate('buildingId', 'name code')
//       .sort({ floorNumber: 1, unitNumber: 1 });
    
//     const exportData = units.map(unit => ({
//       buildingCode: unit.buildingId.code,
//       buildingName: unit.buildingId.name,
//       floorNumber: unit.floorNumber,
//       unitNumber: unit.unitNumber,
//       unitType: unit.unitType,
//       area: unit.details?.area,
//       bedrooms: unit.details?.bedrooms,
//       bathrooms: unit.details?.bathrooms,
//       ownerName: unit.ownership?.ownerName,
//       ownerEmail: unit.ownership?.ownerEmail,
//       ownerPhone: unit.ownership?.ownerPhone,
//       tenantName: unit.tenant?.tenantName,
//       tenantEmail: unit.tenant?.tenantEmail,
//       occupancyStatus: unit.occupancy?.status,
//       status: unit.status
//     }));
    
//     res.json({
//       success: true,
//       data: exportData
//     });
//   } catch (error) {
//     console.error('Export units error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== HELPER FUNCTIONS ====================

// async function updateBuildingStatistics(buildingId) {
//   try {
//     const unitCount = await Unit.countDocuments({ buildingId, status: 'active' });
//     const occupiedCount = await Unit.countDocuments({ 
//       buildingId, 
//       'occupancy.status': { $in: ['owner_occupied', 'tenant_occupied'] },
//       status: 'active'
//     });
//     const maintenanceCount = await Unit.countDocuments({ 
//       buildingId, 
//       'occupancy.status': 'maintenance',
//       status: 'active'
//     });
    
//     await Building.updateOne(
//       { _id: buildingId },
//       { 
//         $set: { 
//           'statistics.totalUnits': unitCount,
//           'statistics.occupiedUnits': occupiedCount,
//           'statistics.vacantUnits': unitCount - occupiedCount - maintenanceCount,
//           'statistics.underMaintenance': maintenanceCount
//         }
//       }
//     );
//   } catch (error) {
//     console.error('Update building statistics error:', error);
//   }
// }

// // ==================== EXPORTS ====================

// module.exports = {
//   // Building CRUD
//   createBuilding,
//   getBuildings,
//   getBuildingById,
//   updateBuilding,
//   deleteBuilding,
//   getBuildingHierarchy,
//   getFloors,
//   getUnitTypeSummary,
  
//   // Floor management
//   addFloor,
//   updateFloor,
//   deleteFloor,
  
//   // Unit Management
//   createUnit,
//   getUnitsByBuilding,
//   getUnitById,
//   updateUnit,
//   deleteUnit,
  
//   // Owner & Tenant Assignment
//   assignOwnerToUnit,
//   assignTenantToUnit,
//   removeTenant,
  
//   // Bulk Operations
//   bulkImportUnits,
//   exportUnits
// };




/**
 * BUILDING CONTROLLER
 * Handles all building-related operations
 */

const mongoose = require('mongoose');
const Building = require('../models/Building.model');
const Unit = require('../models/Unit.model');
const Customer = require('../models/Customer.model');

// ==================== BUILDING CRUD ====================

const createBuilding = async (req, res) => {
  try {
    const buildingData = req.body;
    buildingData.createdBy = req.userId || req.user._id;
    
    const existingBuilding = await Building.findOne({ code: buildingData.code });
    if (existingBuilding) {
      return res.status(400).json({ success: false, error: 'Building code already exists' });
    }
    
    const building = new Building(buildingData);
    await building.save();
    
    res.status(201).json({ success: true, data: building, message: 'Building created successfully' });
  } catch (error) {
    console.error('Create building error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

const getBuildings = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, type, status, city, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
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
      Building.find(query).sort(sortOptions).skip(skip).limit(parseInt(limit)).populate('createdBy', 'firstName lastName email'),
      Building.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: { buildings, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } }
    });
  } catch (error) {
    console.error('Get buildings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getBuildingById = async (req, res) => {
  try {
    // 🔴 FIX: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid building ID' });
    }
    
    const building = await Building.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');
    
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    const units = await Unit.find({ buildingId: building._id, status: 'active' }).sort({ floorNumber: 1, unitNumber: 1 });
    
    res.json({ success: true, data: { building, units } });
  } catch (error) {
    console.error('Get building by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedBy = req.userId || req.user._id;
    updates.updatedAt = new Date();
    
    const building = await Building.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    res.json({ success: true, data: building, message: 'Building updated successfully' });
  } catch (error) {
    console.error('Update building error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    
    const unitCount = await Unit.countDocuments({ buildingId: id });
    if (unitCount > 0) {
      return res.status(400).json({ success: false, error: `Cannot delete building with ${unitCount} units.` });
    }
    
    const building = await Building.findByIdAndUpdate(id, { status: 'inactive', updatedAt: new Date() }, { new: true });
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    res.json({ success: true, message: 'Building deleted successfully' });
  } catch (error) {
    console.error('Delete building error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getBuildingHierarchy = async (req, res) => {
  try {
    const { id } = req.params;
    
    const building = await Building.findById(id);
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    const units = await Unit.find({ buildingId: id, status: 'active' })
      .populate('ownership.ownerId', 'firstName lastName email phone')
      .populate('tenant.tenantId', 'firstName lastName email phone')
      .sort({ floorNumber: 1, unitNumber: 1 });
    
    const floorsMap = new Map();
    units.forEach(unit => {
      if (!floorsMap.has(unit.floorNumber)) {
        floorsMap.set(unit.floorNumber, []);
      }
      floorsMap.get(unit.floorNumber).push(unit);
    });
    
    const floors = Array.from(floorsMap.entries()).map(([floorNumber, unitsList]) => ({
      floorNumber,
      unitCount: unitsList.length,
      units: unitsList.map(unit => ({
        id: unit._id,
        unitNumber: unit.unitNumber,
        unitType: unit.unitType,
        area: unit.details?.area,
        occupancyStatus: unit.occupancy?.status,
        ownerName: unit.ownership?.ownerName,
        ownerEmail: unit.ownership?.ownerEmail,
        tenantName: unit.tenant?.tenantName,
        isRented: unit.tenant?.isActive
      }))
    }));
    
    res.json({
      success: true,
      data: {
        building: { id: building._id, name: building.name, code: building.code, type: building.type, address: building.address, statistics: building.statistics },
        floors
      }
    });
  } catch (error) {
    console.error('Get building hierarchy error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== FLOOR MANAGEMENT ====================

const getFloors = async (req, res) => {
  try {
    const { buildingId } = req.params;
    
    // 🔴 FIX: Handle missing buildingId
    if (!buildingId || buildingId === 'undefined' || buildingId === 'null') {
      return res.status(400).json({ success: false, error: 'Building ID is required' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(buildingId)) {
      return res.status(400).json({ success: false, error: 'Invalid building ID format' });
    }
    
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    const floors = await Unit.aggregate([
      { $match: { buildingId: new mongoose.Types.ObjectId(buildingId), status: 'active' } },
      { $group: { _id: '$floorNumber', unitCount: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({ success: true, data: floors.map(floor => ({ floorNumber: floor._id, unitCount: floor.unitCount })) });
  } catch (error) {
    console.error('Get floors error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const addFloor = async (req, res) => {
  try {
    const { buildingId } = req.params;
    const { floorNumber } = req.body;
    
    if (!floorNumber) {
      return res.status(400).json({ success: false, error: 'Floor number is required' });
    }
    
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    res.status(201).json({ success: true, data: { floorNumber: parseInt(floorNumber), unitCount: 0 }, message: 'Floor added successfully' });
  } catch (error) {
    console.error('Add floor error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateFloor = async (req, res) => {
  try {
    const { buildingId, floorNumber } = req.params;
    const { unitCount } = req.body;
    
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    res.json({ success: true, data: { floorNumber: parseInt(floorNumber), unitCount: unitCount || 0 }, message: 'Floor updated successfully' });
  } catch (error) {
    console.error('Update floor error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteFloor = async (req, res) => {
  try {
    const { buildingId, floorNumber } = req.params;
    
    const unitsOnFloor = await Unit.countDocuments({ buildingId, floorNumber: parseInt(floorNumber), status: 'active' });
    if (unitsOnFloor > 0) {
      return res.status(400).json({ success: false, error: `Cannot delete floor with ${unitsOnFloor} units.` });
    }
    
    res.json({ success: true, message: 'Floor deleted successfully' });
  } catch (error) {
    console.error('Delete floor error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getUnitTypeSummary = async (req, res) => {
  try {
    const { buildingId } = req.params;
    
    if (!buildingId || buildingId === 'undefined') {
      return res.status(400).json({ success: false, error: 'Building ID is required' });
    }
    
    const summary = await Unit.aggregate([
      { $match: { buildingId: new mongoose.Types.ObjectId(buildingId), status: 'active' } },
      { $group: { _id: '$unitType', count: { $sum: 1 }, occupied: { $sum: { $cond: [{ $in: ['$occupancy.status', ['owner_occupied', 'tenant_occupied']] }, 1, 0] } } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Get unit type summary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== UNIT MANAGEMENT ====================

const createUnit = async (req, res) => {
  try {
    const unitData = req.body;
    unitData.createdBy = req.userId || req.user._id;
    
    const existingUnit = await Unit.findOne({ buildingId: unitData.buildingId, floorNumber: unitData.floorNumber, unitNumber: unitData.unitNumber });
    if (existingUnit) {
      return res.status(400).json({ success: false, error: 'Unit already exists in this building' });
    }
    
    const unit = new Unit(unitData);
    await unit.save();
    await updateBuildingStatistics(unitData.buildingId);
    
    res.status(201).json({ success: true, data: unit, message: 'Unit created successfully' });
  } catch (error) {
    console.error('Create unit error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

const getUnitsByBuilding = async (req, res) => {
  try {
    const { buildingId } = req.params;
    const { floor, status, type, search, page = 1, limit = 50 } = req.query;
    
    // 🔴 FIX: Handle missing buildingId
    if (!buildingId || buildingId === 'undefined' || buildingId === 'null') {
      return res.status(400).json({ success: false, error: 'Building ID is required' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(buildingId)) {
      return res.status(400).json({ success: false, error: 'Invalid building ID format' });
    }
    
    const query = { buildingId, status: 'active' };
    if (floor && floor !== 'undefined') query.floorNumber = parseInt(floor);
    if (status && status !== 'undefined') query['occupancy.status'] = status;
    if (type && type !== 'undefined') query.unitType = type;
    if (search) {
      query.$or = [
        { unitNumber: { $regex: search, $options: 'i' } },
        { 'ownership.ownerName': { $regex: search, $options: 'i' } },
        { 'tenant.tenantName': { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [units, total] = await Promise.all([
      Unit.find(query).sort({ floorNumber: 1, unitNumber: 1 }).skip(skip).limit(parseInt(limit))
        .populate('ownership.ownerId', 'firstName lastName email phone')
        .populate('tenant.tenantId', 'firstName lastName email phone'),
      Unit.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: { units, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) {
    console.error('Get units by building error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id)
      .populate('buildingId', 'name code address')
      .populate('ownership.ownerId', 'firstName lastName email phone profileImage')
      .populate('tenant.tenantId', 'firstName lastName email phone');
    
    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found' });
    }
    
    res.json({ success: true, data: unit });
  } catch (error) {
    console.error('Get unit by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedBy = req.userId || req.user._id;
    updates.updatedAt = new Date();
    
    const unit = await Unit.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found' });
    }
    
    await updateBuildingStatistics(unit.buildingId);
    res.json({ success: true, data: unit, message: 'Unit updated successfully' });
  } catch (error) {
    console.error('Update unit error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;
    
    const unit = await Unit.findByIdAndUpdate(id, { status: 'inactive', updatedAt: new Date() });
    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found' });
    }
    
    await updateBuildingStatistics(unit.buildingId);
    res.json({ success: true, message: 'Unit deleted successfully' });
  } catch (error) {
    console.error('Delete unit error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== OWNER & TENANT ASSIGNMENT ====================

const assignOwnerToUnit = async (req, res) => {
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
      customer = await Customer.findOne({ $or: [{ email: ownerEmail }, { phone: ownerPhone }] });
    }
    
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
    
    unit.ownership = {
      ownerId: customer?._id,
      ownerName: ownerName || (customer ? `${customer.firstName} ${customer.lastName}` : ''),
      ownerEmail: ownerEmail || customer?.email,
      ownerPhone: ownerPhone || customer?.phone,
      ownerNationality: ownerNationality || customer?.nationality,
      ownershipStartDate: ownershipStartDate || new Date()
    };
    
    unit.occupancy.status = unit.tenant?.isActive ? 'tenant_occupied' : 'owner_occupied';
    await unit.save();
    
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
    
    await updateBuildingStatistics(unit.buildingId);
    res.json({ success: true, data: { unit, customer }, message: 'Owner assigned successfully' });
  } catch (error) {
    console.error('Assign owner error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

const assignTenantToUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const { tenantId, tenantName, tenantEmail, tenantPhone, leaseStartDate, leaseEndDate, monthlyRent, securityDeposit } = req.body;
    
    const unit = await Unit.findById(unitId);
    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found' });
    }
    
    let customer = null;
    if (tenantId) {
      customer = await Customer.findById(tenantId);
    } else if (tenantEmail || tenantPhone) {
      customer = await Customer.findOne({ $or: [{ email: tenantEmail }, { phone: tenantPhone }] });
    }
    
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
    
    unit.tenant = {
      tenantId: customer?._id,
      tenantName: tenantName || (customer ? `${customer.firstName} ${customer.lastName}` : ''),
      tenantEmail: tenantEmail || customer?.email,
      tenantPhone: tenantPhone || customer?.phone,
      leaseStartDate: leaseStartDate || new Date(),
      leaseEndDate: leaseEndDate,
      monthlyRent: monthlyRent,
      securityDeposit: securityDeposit,
      isActive: true
    };
    
    unit.occupancy.status = 'tenant_occupied';
    unit.occupancy.moveInDate = leaseStartDate || new Date();
    await unit.save();
    
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
    
    await updateBuildingStatistics(unit.buildingId);
    res.json({ success: true, data: { unit, customer }, message: 'Tenant assigned successfully' });
  } catch (error) {
    console.error('Assign tenant error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

const removeTenant = async (req, res) => {
  try {
    const { unitId } = req.params;
    
    const unit = await Unit.findById(unitId);
    if (!unit) {
      return res.status(404).json({ success: false, error: 'Unit not found' });
    }
    
    if (unit.tenant.tenantId) {
      await Customer.updateOne(
        { _id: unit.tenant.tenantId, 'rentedUnits.unitId': unitId },
        { $set: { 'rentedUnits.$.isActive': false, 'rentedUnits.$.leaseEndDate': new Date() } }
      );
    }
    
    unit.tenant = { tenantId: null, tenantName: '', tenantEmail: '', tenantPhone: '', isActive: false };
    unit.occupancy.status = unit.ownership.ownerId ? 'owner_occupied' : 'vacant';
    unit.occupancy.moveOutDate = new Date();
    await unit.save();
    
    await updateBuildingStatistics(unit.buildingId);
    res.json({ success: true, message: 'Tenant removed successfully' });
  } catch (error) {
    console.error('Remove tenant error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================== BULK OPERATIONS ====================

const bulkImportUnits = async (req, res) => {
  try {
    const { buildingId, units } = req.body;
    
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    const results = { success: [], failed: [], customersCreated: 0 };
    
    for (const unitData of units) {
      try {
        const existingUnit = await Unit.findOne({ buildingId, floorNumber: unitData.floorNumber, unitNumber: unitData.unitNumber });
        if (existingUnit) {
          results.failed.push({ ...unitData, reason: 'Unit already exists' });
          continue;
        }
        
        let ownerCustomer = null;
        if (unitData.ownerEmail || unitData.ownerPhone) {
          ownerCustomer = await Customer.findOne({ $or: [{ email: unitData.ownerEmail }, { phone: unitData.ownerPhone }] });
          
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
          details: { area: unitData.area, bedrooms: unitData.bedrooms, bathrooms: unitData.bathrooms },
          ownership: {
            ownerId: ownerCustomer?._id,
            ownerName: unitData.ownerName,
            ownerEmail: unitData.ownerEmail,
            ownerPhone: unitData.ownerPhone,
            ownershipStartDate: new Date()
          },
          occupancy: { status: ownerCustomer ? 'owner_occupied' : 'vacant' },
          createdBy: req.userId || req.user._id
        });
        
        await unit.save();
        
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
    
    await updateBuildingStatistics(buildingId);
    res.json({ success: true, data: results, message: `Imported ${results.success.length} units, ${results.failed.length} failed.` });
  } catch (error) {
    console.error('Bulk import units error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

const exportUnits = async (req, res) => {
  try {
    const { buildingId } = req.params;
    const { format = 'json' } = req.query;
    
    const units = await Unit.find({ buildingId, status: 'active' }).populate('buildingId', 'name code').sort({ floorNumber: 1, unitNumber: 1 });
    
    const exportData = units.map(unit => ({
      buildingCode: unit.buildingId.code,
      buildingName: unit.buildingId.name,
      floorNumber: unit.floorNumber,
      unitNumber: unit.unitNumber,
      unitType: unit.unitType,
      area: unit.details?.area,
      bedrooms: unit.details?.bedrooms,
      bathrooms: unit.details?.bathrooms,
      ownerName: unit.ownership?.ownerName,
      ownerEmail: unit.ownership?.ownerEmail,
      ownerPhone: unit.ownership?.ownerPhone,
      tenantName: unit.tenant?.tenantName,
      tenantEmail: unit.tenant?.tenantEmail,
      occupancyStatus: unit.occupancy?.status,
      status: unit.status
    }));
    
    res.json({ success: true, data: exportData });
  } catch (error) {
    console.error('Export units error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== HELPER FUNCTIONS ====================

async function updateBuildingStatistics(buildingId) {
  try {
    const unitCount = await Unit.countDocuments({ buildingId, status: 'active' });
    const occupiedCount = await Unit.countDocuments({ buildingId, 'occupancy.status': { $in: ['owner_occupied', 'tenant_occupied'] }, status: 'active' });
    const maintenanceCount = await Unit.countDocuments({ buildingId, 'occupancy.status': 'maintenance', status: 'active' });
    
    await Building.updateOne(
      { _id: buildingId },
      { $set: { 'statistics.totalUnits': unitCount, 'statistics.occupiedUnits': occupiedCount, 'statistics.vacantUnits': unitCount - occupiedCount - maintenanceCount, 'statistics.underMaintenance': maintenanceCount } }
    );
  } catch (error) {
    console.error('Update building statistics error:', error);
  }
}

// ==================== EXPORTS ====================

module.exports = {
  createBuilding,
  getBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
  getBuildingHierarchy,
  getFloors,
  getUnitTypeSummary,
  addFloor,
  updateFloor,
  deleteFloor,
  createUnit,
  getUnitsByBuilding,
  getUnitById,
  updateUnit,
  deleteUnit,
  assignOwnerToUnit,
  assignTenantToUnit,
  removeTenant,
  bulkImportUnits,
  exportUnits
};