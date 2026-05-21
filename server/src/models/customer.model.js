/**
 * CUSTOMER MODEL
 * Handles customer/owner information and unit ownership
 * Features: Registration, Unit verification, Owner/Tenant management
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
  // ==================== BASIC INFORMATION ====================
  customerId: { 
    type: String, 
    unique: true,
    sparse: true,
    index: { unique: true, partialFilterExpression: { customerId: { $exists: true, $ne: null } } }
  },
  salutation: { type: String, enum: ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  alternatePhone: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  nationality: String,
  occupation: String,
  companyName: String,
  
  // ==================== PASSWORD (for registered customers) ====================
  password: {
    type: String,
    select: false,
  },
  
  // ==================== ADDRESS ====================
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // ==================== EMERGENCY CONTACT ====================
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },
  
  // ==================== UNIT OWNERSHIP ====================
  ownedUnits: [{
    unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
    unitNumber: String,
    buildingName: String,
    ownershipStartDate: Date,
    isActive: { type: Boolean, default: true }
  }],
  
  // ==================== RENTED UNITS (if tenant) ====================
  rentedUnits: [{
    unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
    unitNumber: String,
    buildingName: String,
    leaseStartDate: Date,
    leaseEndDate: Date,
    monthlyRent: Number,
    isActive: { type: Boolean, default: true }
  }],
  
  // ==================== PREFERENCES ====================
  preferences: {
    language: { type: String, default: 'en' },
    notificationChannels: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  
  // ==================== ACCOUNT STATUS ====================
  accountStatus: {
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false }
  },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  
  // ==================== REGISTRATION INFO ====================
  registrationMethod: { type: String, enum: ['admin', 'self', 'import'], default: 'self' },
  isRegistered: { type: Boolean, default: false },
  registeredAt: { type: Date, default: Date.now },
  
  // ==================== TIMESTAMPS ====================
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // ==================== METADATA ====================
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES ====================
customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ customerId: 1 });
customerSchema.index({ 'ownedUnits.unitId': 1 });
customerSchema.index({ isRegistered: 1 });

// ==================== PRE-SAVE MIDDLEWARE ====================

// Hash password before saving
customerSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  this.updatedAt = new Date();
  next();
});

// Generate customerId only when needed
customerSchema.pre('save', async function(next) {
  if (!this.customerId && this.isRegistered) {
    const Customer = mongoose.model('Customer');
    const count = await Customer.countDocuments({ customerId: { $ne: null } });
    this.customerId = `CUST${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// ==================== VIRTUAL PROPERTIES ====================
customerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

customerSchema.virtual('hasOwnedUnits').get(function() {
  return this.ownedUnits && this.ownedUnits.length > 0;
});

customerSchema.virtual('hasRentedUnits').get(function() {
  return this.rentedUnits && this.rentedUnits.length > 0;
});

// ==================== INSTANCE METHODS ====================

/**
 * Compare password for login
 * @param {string} candidatePassword - Plain text password
 * @returns {Promise<boolean>}
 */
customerSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Get customer summary (safe for API responses)
 */
customerSchema.methods.getSummary = function() {
  return {
    id: this._id,
    customerId: this.customerId,
    name: this.fullName,
    email: this.email,
    phone: this.phone,
    ownedUnits: this.ownedUnits,
    rentedUnits: this.rentedUnits,
    isRegistered: this.isRegistered,
    emailVerified: this.emailVerified
  };
};

/**
 * Add owned unit to customer
 */
customerSchema.methods.addOwnedUnit = async function(unitData) {
  this.ownedUnits.push(unitData);
  await this.save();
  return this;
};

/**
 * Add rented unit to customer
 */
customerSchema.methods.addRentedUnit = async function(unitData) {
  this.rentedUnits.push(unitData);
  await this.save();
  return this;
};

/**
 * Remove owned unit
 */
customerSchema.methods.removeOwnedUnit = async function(unitId) {
  this.ownedUnits = this.ownedUnits.filter(u => u.unitId.toString() !== unitId);
  await this.save();
  return this;
};

/**
 * Remove rented unit
 */
customerSchema.methods.removeRentedUnit = async function(unitId) {
  this.rentedUnits = this.rentedUnits.filter(u => u.unitId.toString() !== unitId);
  await this.save();
  return this;
};

// ==================== STATIC METHODS ====================

/**
 * Find customer by email
 */
customerSchema.statics.findByEmail = function(email) {
  return this.findOne({ email, isRegistered: true });
};

/**
 * Find customer by phone
 */
customerSchema.statics.findByPhone = function(phone) {
  return this.findOne({ phone, isRegistered: true });
};

/**
 * Find customers by building
 */
customerSchema.statics.findByBuilding = function(buildingId) {
  return this.find({
    $or: [
      { 'ownedUnits.buildingId': buildingId },
      { 'rentedUnits.buildingId': buildingId }
    ]
  });
};

/**
 * Get customer count
 */
customerSchema.statics.getCustomerCount = async function() {
  return {
    total: await this.countDocuments(),
    registered: await this.countDocuments({ isRegistered: true }),
    unregistered: await this.countDocuments({ isRegistered: false })
  };
};

/**
 * Find or create customer (for bulk import)
 */
customerSchema.statics.findOrCreate = async function(customerData) {
  let customer = await this.findOne({ 
    $or: [{ email: customerData.email }, { phone: customerData.phone }] 
  });
  
  if (!customer) {
    customer = new this(customerData);
    await customer.save();
  }
  
  return customer;
};

// ==================== PREVENT OVERWRITE MODEL ERROR ====================
// ✅ This is the key fix - check if model already exists before creating
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

module.exports = Customer;