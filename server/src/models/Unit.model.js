// // server/src/models/Unit.model.js
// const mongoose = require('mongoose');

// const unitSchema = new mongoose.Schema({
//   // Basic Information
//   buildingId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Building', 
//     required: true 
//   },
//   floorNumber: { type: Number, required: true },
//   unitNumber: { type: String, required: true },
//   unitType: { 
//     type: String, 
//     enum: ['apartment', 'office', 'shop', 'warehouse', 'storage', 'parking', 'other'],
//     required: true 
//   },
  
//   // Physical Details
//   details: {
//     area: { value: Number, unit: { type: String, enum: ['sqft', 'sqm'], default: 'sqft' } },
//     bedrooms: { type: Number, default: 0 },
//     bathrooms: { type: Number, default: 0 },
//     hallCount: { type: Number, default: 0 },
//     kitchenCount: { type: Number, default: 0 },
//     balconyCount: { type: Number, default: 0 },
//     facing: { 
//       type: String, 
//       enum: ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'] 
//     },
//     floorPlan: String // URL to floor plan image
//   },
  
//   // Ownership Information
//   ownership: {
//     ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
//     ownerName: { type: String, required: true },
//     ownerEmail: { type: String, required: true },
//     ownerPhone: { type: String, required: true },
//     ownerAlternatePhone: String,
//     ownerNationality: String,
//     ownerIdProof: {
//       type: { type: String, enum: ['passport', 'emirates_id', 'national_id'] },
//       number: String,
//       fileUrl: String
//     },
//     ownershipStartDate: Date,
//     ownershipEndDate: Date,
//     deedNumber: String,
//     deedFile: String
//   },
  
//   // Tenant Information (if rented)
//   tenant: {
//     tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
//     tenantName: String,
//     tenantEmail: String,
//     tenantPhone: String,
//     tenantAlternatePhone: String,
//     leaseStartDate: Date,
//     leaseEndDate: Date,
//     monthlyRent: Number,
//     securityDeposit: Number,
//     leaseDocument: String,
//     isActive: { type: Boolean, default: false }
//   },
  
//   // Occupancy Status
//   occupancy: {
//     status: { 
//       type: String, 
//       enum: ['vacant', 'owner_occupied', 'tenant_occupied', 'maintenance', 'under_construction', 'blocked'],
//       default: 'vacant'
//     },
//     currentResidents: [{
//       name: String,
//       relation: String,
//       age: Number,
//       isPrimary: Boolean,
//       contactNumber: String
//     }],
//     moveInDate: Date,
//     moveOutDate: Date,
//     lastInspectionDate: Date,
//     nextInspectionDate: Date
//   },
  
//   // Billing & Utilities
//   billing: {
//     unitMeterNumber: String,
//     electricityMeterNumber: String,
//     waterMeterNumber: String,
//     gasMeterNumber: String,
//     tariffPlan: String,
//     utilityProvider: String,
//     annualMaintenanceFee: { type: Number, default: 0 },
//     lastBillAmount: Number,
//     lastBillDate: Date,
//     isBillPaid: { type: Boolean, default: true }
//   },
  
//   // Parking
//   parking: [{
//     slotNumber: String,
//     type: { type: String, enum: ['covered', 'open', 'reserved', 'visitor'] },
//     floor: Number,
//     isAssigned: { type: Boolean, default: true }
//   }],
  
//   // Documents
//   documents: [{
//     name: String,
//     type: { type: String, enum: ['deed', 'lease', 'inspection', 'maintenance', 'contract', 'other'] },
//     url: String,
//     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     uploadedAt: { type: Date, default: Date.now },
//     verified: { type: Boolean, default: false }
//   }],
  
//   // Maintenance History
//   maintenanceHistory: [{
//     date: Date,
//     type: String,
//     description: String,
//     cost: Number,
//     performedBy: String,
//     nextDueDate: Date
//   }],
  
//   // Complaint Statistics
//   complaintStats: {
//     total: { type: Number, default: 0 },
//     open: { type: Number, default: 0 },
//     inProgress: { type: Number, default: 0 },
//     resolved: { type: Number, default: 0 },
//     averageResolutionTime: Number // in hours
//   },
  
//   // Metadata
//   status: { 
//     type: String, 
//     enum: ['active', 'inactive', 'archived'],
//     default: 'active' 
//   },
//   notes: String,
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   createdAt: { type: Date, default: Date.now },
//   updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   updatedAt: { type: Date, default: Date.now }
// }, {
//   timestamps: true
// });

// // Compound unique index for unit within building
// unitSchema.index({ buildingId: 1, floorNumber: 1, unitNumber: 1 }, { unique: true });

// // Indexes for searching
// unitSchema.index({ 'ownership.ownerEmail': 1 });
// unitSchema.index({ 'ownership.ownerPhone': 1 });
// unitSchema.index({ 'tenant.tenantEmail': 1 });
// unitSchema.index({ 'tenant.tenantPhone': 1 });
// unitSchema.index({ occupancyStatus: 1 });
// unitSchema.index({ unitType: 1 });

// // Pre-save middleware to update building statistics
// unitSchema.post('save', async function(doc) {
//   const Building = mongoose.model('Building');
//   const unitCount = await mongoose.model('Unit').countDocuments({ buildingId: doc.buildingId, status: 'active' });
//   const occupiedCount = await mongoose.model('Unit').countDocuments({ 
//     buildingId: doc.buildingId, 
//     'occupancy.status': { $in: ['owner_occupied', 'tenant_occupied'] },
//     status: 'active'
//   });
  
//   await Building.updateOne(
//     { _id: doc.buildingId },
//     { 
//       $set: { 
//         'statistics.totalUnits': unitCount,
//         'statistics.occupiedUnits': occupiedCount,
//         'statistics.vacantUnits': unitCount - occupiedCount
//       }
//     }
//   );
// });

// module.exports = mongoose.model('Unit', unitSchema);


/**
 * UNIT MODEL
 * Handles all unit/room information within buildings
 * Features: Ownership tracking, Tenant management, Occupancy status, Maintenance history
 */

const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  // Basic Information
  buildingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Building', 
    required: true 
  },
  floorNumber: { type: Number, required: true },
  unitNumber: { type: String, required: true },
  unitType: { 
    type: String, 
    enum: ['apartment', 'office', 'shop', 'warehouse', 'storage', 'parking', 'other'],
    required: true 
  },
  
  // Physical Details
  details: {
    area: { value: Number, unit: { type: String, enum: ['sqft', 'sqm'], default: 'sqft' } },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    hallCount: { type: Number, default: 0 },
    kitchenCount: { type: Number, default: 0 },
    balconyCount: { type: Number, default: 0 },
    facing: { 
      type: String, 
      enum: ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'] 
    },
    floorPlan: String // URL to floor plan image
  },
  
  // Ownership Information
  ownership: {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    ownerName: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    ownerPhone: { type: String, required: true },
    ownerAlternatePhone: String,
    ownerNationality: String,
    ownerIdProof: {
      type: { type: String, enum: ['passport', 'emirates_id', 'national_id'] },
      number: String,
      fileUrl: String
    },
    ownershipStartDate: Date,
    ownershipEndDate: Date,
    deedNumber: String,
    deedFile: String
  },
  
  // Tenant Information (if rented)
  tenant: {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    tenantName: String,
    tenantEmail: String,
    tenantPhone: String,
    tenantAlternatePhone: String,
    leaseStartDate: Date,
    leaseEndDate: Date,
    monthlyRent: Number,
    securityDeposit: Number,
    leaseDocument: String,
    isActive: { type: Boolean, default: false }
  },
  
  // Occupancy Status
  occupancy: {
    status: { 
      type: String, 
      enum: ['vacant', 'owner_occupied', 'tenant_occupied', 'maintenance', 'under_construction', 'blocked'],
      default: 'vacant'
    },
    currentResidents: [{
      name: String,
      relation: String,
      age: Number,
      isPrimary: Boolean,
      contactNumber: String
    }],
    moveInDate: Date,
    moveOutDate: Date,
    lastInspectionDate: Date,
    nextInspectionDate: Date
  },
  
  // Billing & Utilities
  billing: {
    unitMeterNumber: String,
    electricityMeterNumber: String,
    waterMeterNumber: String,
    gasMeterNumber: String,
    tariffPlan: String,
    utilityProvider: String,
    annualMaintenanceFee: { type: Number, default: 0 },
    lastBillAmount: Number,
    lastBillDate: Date,
    isBillPaid: { type: Boolean, default: true }
  },
  
  // Parking
  parking: [{
    slotNumber: String,
    type: { type: String, enum: ['covered', 'open', 'reserved', 'visitor'] },
    floor: Number,
    isAssigned: { type: Boolean, default: true }
  }],
  
  // Documents
  documents: [{
    name: String,
    type: { type: String, enum: ['deed', 'lease', 'inspection', 'maintenance', 'contract', 'other'] },
    url: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false }
  }],
  
  // Maintenance History
  maintenanceHistory: [{
    date: Date,
    type: String,
    description: String,
    cost: Number,
    performedBy: String,
    nextDueDate: Date
  }],
  
  // Complaint Statistics
  complaintStats: {
    total: { type: Number, default: 0 },
    open: { type: Number, default: 0 },
    inProgress: { type: Number, default: 0 },
    resolved: { type: Number, default: 0 },
    averageResolutionTime: Number // in hours
  },
  
  // Metadata
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'archived'],
    default: 'active' 
  },
  notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES ====================

// Compound unique index for unit within building
unitSchema.index({ buildingId: 1, floorNumber: 1, unitNumber: 1 }, { unique: true });

// Indexes for searching
unitSchema.index({ 'ownership.ownerEmail': 1 });
unitSchema.index({ 'ownership.ownerPhone': 1 });
unitSchema.index({ 'tenant.tenantEmail': 1 });
unitSchema.index({ 'tenant.tenantPhone': 1 });
unitSchema.index({ 'occupancy.status': 1 });
unitSchema.index({ unitType: 1 });
unitSchema.index({ status: 1 });
unitSchema.index({ buildingId: 1 });

// ==================== VIRTUAL PROPERTIES ====================

unitSchema.virtual('isOwnerOccupied').get(function() {
  return this.occupancy.status === 'owner_occupied';
});

unitSchema.virtual('isTenantOccupied').get(function() {
  return this.occupancy.status === 'tenant_occupied';
});

unitSchema.virtual('isVacant').get(function() {
  return this.occupancy.status === 'vacant';
});

unitSchema.virtual('hasTenant').get(function() {
  return this.tenant && this.tenant.isActive;
});

unitSchema.virtual('displayName').get(function() {
  return `Floor ${this.floorNumber}, Unit ${this.unitNumber}`;
});

// ==================== PRE-SAVE MIDDLEWARE ====================

unitSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// ==================== POST-SAVE MIDDLEWARE ====================

// Update building statistics when unit is saved
unitSchema.post('save', async function(doc) {
  try {
    const Building = mongoose.model('Building');
    const Unit = mongoose.model('Unit');
    
    const unitCount = await Unit.countDocuments({ buildingId: doc.buildingId, status: 'active' });
    const occupiedCount = await Unit.countDocuments({ 
      buildingId: doc.buildingId, 
      'occupancy.status': { $in: ['owner_occupied', 'tenant_occupied'] },
      status: 'active'
    });
    const maintenanceCount = await Unit.countDocuments({ 
      buildingId: doc.buildingId, 
      'occupancy.status': 'maintenance',
      status: 'active'
    });
    
    await Building.updateOne(
      { _id: doc.buildingId },
      { 
        $set: { 
          'statistics.totalUnits': unitCount,
          'statistics.occupiedUnits': occupiedCount,
          'statistics.vacantUnits': unitCount - occupiedCount - maintenanceCount,
          'statistics.underMaintenance': maintenanceCount
        }
      }
    );
  } catch (error) {
    console.error('Error updating building statistics:', error);
  }
});

// ==================== INSTANCE METHODS ====================

/**
 * Assign owner to unit
 */
unitSchema.methods.assignOwner = async function(ownerData) {
  this.ownership = {
    ownerId: ownerData.ownerId,
    ownerName: ownerData.ownerName,
    ownerEmail: ownerData.ownerEmail,
    ownerPhone: ownerData.ownerPhone,
    ownerAlternatePhone: ownerData.ownerAlternatePhone,
    ownerNationality: ownerData.ownerNationality,
    ownershipStartDate: ownerData.ownershipStartDate || new Date(),
    deedNumber: ownerData.deedNumber
  };
  
  if (!this.tenant || !this.tenant.isActive) {
    this.occupancy.status = 'owner_occupied';
  }
  
  await this.save();
  return this;
};

/**
 * Assign tenant to unit
 */
unitSchema.methods.assignTenant = async function(tenantData) {
  this.tenant = {
    tenantId: tenantData.tenantId,
    tenantName: tenantData.tenantName,
    tenantEmail: tenantData.tenantEmail,
    tenantPhone: tenantData.tenantPhone,
    leaseStartDate: tenantData.leaseStartDate || new Date(),
    leaseEndDate: tenantData.leaseEndDate,
    monthlyRent: tenantData.monthlyRent,
    securityDeposit: tenantData.securityDeposit,
    isActive: true
  };
  
  this.occupancy.status = 'tenant_occupied';
  this.occupancy.moveInDate = tenantData.leaseStartDate || new Date();
  
  await this.save();
  return this;
};

/**
 * Remove tenant from unit
 */
unitSchema.methods.removeTenant = async function() {
  this.tenant = {
    tenantId: null,
    tenantName: '',
    tenantEmail: '',
    tenantPhone: '',
    isActive: false
  };
  
  this.occupancy.status = this.ownership.ownerId ? 'owner_occupied' : 'vacant';
  this.occupancy.moveOutDate = new Date();
  
  await this.save();
  return this;
};

/**
 * Mark unit as vacant
 */
unitSchema.methods.markAsVacant = async function() {
  this.occupancy.status = 'vacant';
  this.tenant.isActive = false;
  await this.save();
  return this;
};

/**
 * Add maintenance record
 */
unitSchema.methods.addMaintenanceRecord = async function(maintenanceData) {
  this.maintenanceHistory.push(maintenanceData);
  await this.save();
  return this;
};

// ==================== STATIC METHODS ====================

/**
 * Get units by building with pagination
 */
unitSchema.statics.getByBuilding = async function(buildingId, options = {}) {
  const { page = 1, limit = 50, status, occupancyStatus } = options;
  const query = { buildingId, status: 'active' };
  
  if (occupancyStatus) query['occupancy.status'] = occupancyStatus;
  if (status) query.status = status;
  
  const skip = (page - 1) * limit;
  
  const [units, total] = await Promise.all([
    this.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ floorNumber: 1, unitNumber: 1 })
      .populate('ownership.ownerId', 'firstName lastName email phone')
      .populate('tenant.tenantId', 'firstName lastName email phone'),
    this.countDocuments(query)
  ]);
  
  return { units, total, page, pages: Math.ceil(total / limit) };
};

/**
 * Get units by owner email
 */
unitSchema.statics.getByOwnerEmail = function(email) {
  return this.find({ 'ownership.ownerEmail': email, status: 'active' });
};

/**
 * Get units by tenant email
 */
unitSchema.statics.getByTenantEmail = function(email) {
  return this.find({ 'tenant.tenantEmail': email, status: 'active' });
};

/**
 * Get available units for rent
 */
unitSchema.statics.getAvailableForRent = function(buildingId) {
  const query = { 
    buildingId, 
    'occupancy.status': 'vacant',
    status: 'active'
  };
  return this.find(query).sort({ floorNumber: 1, unitNumber: 1 });
};

/**
 * Get occupancy summary by building
 */
unitSchema.statics.getOccupancySummary = async function(buildingId) {
  const summary = await this.aggregate([
    { $match: { buildingId: new mongoose.Types.ObjectId(buildingId), status: 'active' } },
    {
      $group: {
        _id: '$occupancy.status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    vacant: 0,
    owner_occupied: 0,
    tenant_occupied: 0,
    maintenance: 0,
    under_construction: 0,
    blocked: 0,
    total: 0
  };
  
  summary.forEach(item => {
    if (result.hasOwnProperty(item._id)) {
      result[item._id] = item.count;
    }
    result.total += item.count;
  });
  
  return result;
};

// ==================== PREVENT OVERWRITE MODEL ERROR ====================
// ✅ This is the key fix - check if model already exists before creating
const Unit = mongoose.models.Unit || mongoose.model('Unit', unitSchema);

module.exports = Unit;