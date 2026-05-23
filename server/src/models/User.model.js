//VVI importand Model -Working if any issues occur uncomment  below line






// // server/src/models/User.model.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const { ROLES, USER_STATUS, DEPARTMENTS, EMPLOYMENT_TYPES } = require('../config/constants');

// const userSchema = new mongoose.Schema(
//   {
//     // Basic Information
//     employeeId: {
//       type: String,
//       unique: true,
//       sparse: true,
//     },
//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     alternatePhone: String,

//     // Profile
//     profileImage: {
//       type: String,
//       default: null,
//     },
//     dateOfBirth: Date,
//     gender: {
//       type: String,
//       enum: ['male', 'female', 'other'],
//     },
//     nationality: String,

//     // Authentication
//     password: {
//       type: String,
//       required: true,
//       select: false,
//     },
//     resetPasswordToken: String,
//     resetPasswordExpires: Date,
//     emailVerified: {
//       type: Boolean,
//       default: false,
//     },
//     phoneVerified: {
//       type: Boolean,
//       default: false,
//     },

//     // Employment Details
//     employeeType: {
//       type: String,
//       enum: Object.values(EMPLOYMENT_TYPES),
//       default: EMPLOYMENT_TYPES.FULL_TIME,
//     },
//     designation: {
//       type: String,
//       required: true,
//     },
//     department: {
//       type: String,
//       enum: Object.values(DEPARTMENTS),
//       required: true,
//     },
//     reportingManager: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     supervisor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },

//     // Role & Permissions
//     role: {
//       type: String,
//       enum: Object.values(ROLES),
//       required: true,
//     },
//     customPermissions: [String],

//     // Chat Permission
//     chatEnabled: {
//       type: Boolean,
//       default: false,
//       description: 'Controls whether user can access chat features'
//     },

//     // Online Status Tracking - RENAMED to avoid conflict
//     isUserOnline: {
//       type: Boolean,
//       default: false,
//       description: 'Real-time online status for chat'
//     },
//     lastSeen: {
//       type: Date,
//       default: Date.now,
//       description: 'Last time user was active'
//     },
//     socketId: {
//       type: String,
//       default: null,
//       description: 'Socket.IO connection ID for real-time communication'
//     },

//     // Work Location
//     assignedBuildings: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Building',
//       },
//     ],
//     workLocation: String,

//     // Shift Details
//     shiftTiming: {
//       start: String,
//       end: String,
//       timezone: { type: String, default: 'Asia/Dubai' },
//     },

//     // Financial
//     bankDetails: {
//       accountName: String,
//       accountNumber: String,
//       bankName: String,
//       ifscCode: String,
//       iban: String,
//     },

//     // Documents
//     documents: [
//       {
//         type: {
//           type: String,
//           enum: ['passport', 'visa', 'emirates_id', 'pan_card', 'contract', 'offer_letter'],
//         },
//         number: String,
//         expiryDate: Date,
//         fileUrl: String,
//         verified: { type: Boolean, default: false },
//         uploadedAt: Date,
//       },
//     ],

//     // Status
//     status: {
//       type: String,
//       enum: Object.values(USER_STATUS),
//       default: USER_STATUS.ACTIVE,
//     },
//     joiningDate: Date,
//     terminationDate: Date,
//     terminationReason: String,

//     // Location Tracking (for GPS)
//     lastLocation: {
//       lat: { type: Number },
//       lng: { type: Number },
//       address: { type: String },
//       updatedAt: { type: Date },
//     },

//     // FCM Tokens for Push Notifications
//     fcmTokens: [{
//       type: String,
//     }],

//     // System Fields
//     lastLoginAt: Date,
//     lastLoginIP: String,
//     loginAttempts: {
//       type: Number,
//       default: 0,
//     },
//     lockUntil: Date,

//     // Metadata
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // ==================== INDEXES FOR PERFORMANCE ====================
// userSchema.index({ email: 1 });
// userSchema.index({ phone: 1 });
// userSchema.index({ employeeId: 1 });
// userSchema.index({ role: 1 });
// userSchema.index({ reportingManager: 1 });
// userSchema.index({ department: 1 });
// userSchema.index({ status: 1 });
// userSchema.index({ createdAt: -1 });
// userSchema.index({ chatEnabled: 1 });
// // Indexes for online status queries - UPDATED field name
// userSchema.index({ isUserOnline: 1 });
// userSchema.index({ socketId: 1 });
// userSchema.index({ lastSeen: -1 });

// // ==================== PRE-SAVE MIDDLEWARE ====================

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Generate employee ID for employees (not customers)
// userSchema.pre('save', async function (next) {
//   // Skip if already has employeeId or is customer
//   if (this.employeeId || this.role === 'customer') return next();

//   const year = new Date().getFullYear();
//   const count = await mongoose.model('User').countDocuments({ role: { $ne: 'customer' } });
//   this.employeeId = `EMP${year}${String(count + 1).padStart(6, '0')}`;
//   next();
// });

// // Pre-save middleware for chatEnabled (ensure it's always a boolean)
// userSchema.pre('save', function(next) {
//   if (this.chatEnabled === undefined || this.chatEnabled === null) {
//     this.chatEnabled = false;
//   }
//   next();
// });

// // ==================== INSTANCE METHODS ====================

// /**
//  * Compare password
//  * @param {string} candidatePassword - Plain text password to compare
//  * @returns {Promise<boolean>} - True if passwords match
//  */
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   if (!this.password) return false;
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// /**
//  * Check if account is locked
//  * @returns {boolean} - True if account is locked
//  */
// userSchema.methods.isLocked = function () {
//   return this.lockUntil && this.lockUntil > Date.now();
// };

// /**
//  * Increment login attempts on failed login
//  */
// userSchema.methods.incrementLoginAttempts = async function () {
//   this.loginAttempts += 1;

//   if (this.loginAttempts >= 5) {
//     this.lockUntil = Date.now() + 30 * 60 * 1000; // Lock for 30 minutes
//   }

//   await this.save();
// };

// /**
//  * Reset login attempts on successful login
//  */
// userSchema.methods.resetLoginAttempts = async function () {
//   this.loginAttempts = 0;
//   this.lockUntil = null;
//   await this.save();
// };

// /**
//  * Update last login information
//  * @param {string} ipAddress - IP address of login
//  */
// userSchema.methods.updateLastLogin = async function (ipAddress) {
//   this.lastLoginAt = new Date();
//   this.lastLoginIP = ipAddress;
//   this.loginAttempts = 0;
//   this.lockUntil = null;
//   await this.save();
// };

// /**
//  * Check if user is currently online (based on last activity threshold)
//  * @param {number} thresholdMinutes - Minutes to consider as online (default: 5)
//  * @returns {boolean}
//  */
// userSchema.methods.checkOnlineStatus = function (thresholdMinutes = 5) {
//   if (!this.lastLoginAt) return false;
//   const diffMinutes = (Date.now() - this.lastLoginAt) / (1000 * 60);
//   return diffMinutes < thresholdMinutes;
// };

// /**
//  * Get user's full name
//  * @returns {string}
//  */
// userSchema.methods.getFullName = function () {
//   return `${this.firstName} ${this.lastName}`;
// };

// /**
//  * Get user's profile summary (safe for API responses)
//  */
// userSchema.methods.getProfileSummary = function () {
//   return {
//     id: this._id,
//     employeeId: this.employeeId,
//     name: this.getFullName(),
//     email: this.email,
//     phone: this.phone,
//     role: this.role,
//     department: this.department,
//     designation: this.designation,
//     profileImage: this.profileImage,
//     status: this.status,
//     chatEnabled: this.chatEnabled,
//     isOnline: this.isUserOnline, // Use renamed field
//     lastSeen: this.lastSeen,
//     lastLoginAt: this.lastLoginAt,
//   };
// };

// /**
//  * Update online status for real-time chat
//  * @param {boolean} isOnline - Online status
//  * @param {string} socketId - Socket.IO connection ID
//  */
// userSchema.methods.updateOnlineStatus = async function(isOnline, socketId = null) {
//   this.isUserOnline = isOnline;
//   this.lastSeen = new Date();
//   if (socketId) this.socketId = socketId;
//   if (!isOnline) this.socketId = null;
//   await this.save();
//   return this;
// };

// /**
//  * Check if user has specific permission
//  * @param {string} permission - Permission to check
//  * @returns {boolean}
//  */
// userSchema.methods.hasPermission = function (permission) {
//   if (this.role === 'super_admin') return true;
//   if (this.customPermissions && this.customPermissions.includes(permission)) return true;
//   return false;
// };

// /**
//  * Check if user can access a building
//  * @param {string} buildingId - Building ID to check
//  * @returns {boolean}
//  */
// userSchema.methods.canAccessBuilding = function (buildingId) {
//   if (this.role === 'super_admin') return true;
//   if (this.assignedBuildings && this.assignedBuildings.includes(buildingId)) return true;
//   return false;
// };

// /**
//  * Check if user can chat with target role
//  * @param {string} targetRole - Role of the user to chat with
//  * @returns {boolean}
//  */
// userSchema.methods.canChatWith = function (targetRole) {
//   if (!this.chatEnabled) return false;
  
//   // Permission Matrix
//   const permissions = {
//     super_admin: ['customer', 'technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin'],
//     admin: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
//     manager: ['customer', 'supervisor', 'manager', 'admin'],
//     supervisor: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
//     technician: ['customer', 'technician', 'supervisor', 'admin'],
//     hr: ['employee', 'manager', 'admin'],
//     customer: ['technician', 'supervisor', 'manager', 'admin']
//   };
  
//   return permissions[this.role]?.includes(targetRole) || false;
// };

// /**
//  * Get user's team members (for managers and supervisors)
//  */
// userSchema.methods.getTeamMembers = async function () {
//   if (this.role === 'manager') {
//     return await mongoose.model('User').find({ reportingManager: this._id });
//   }
//   if (this.role === 'supervisor') {
//     return await mongoose.model('User').find({ supervisor: this._id });
//   }
//   return [];
// };

// // ==================== STATIC METHODS ====================

// /**
//  * Find users by role
//  * @param {string} role - Role to filter by
//  * @returns {Promise<Array>}
//  */
// userSchema.statics.findByRole = function (role) {
//   return this.find({ role, status: USER_STATUS.ACTIVE });
// };

// /**
//  * Find users by department
//  * @param {string} department - Department to filter by
//  * @returns {Promise<Array>}
//  */
// userSchema.statics.findByDepartment = function (department) {
//   return this.find({ department, status: USER_STATUS.ACTIVE });
// };

// /**
//  * Find users by reporting manager
//  * @param {string} managerId - Manager ID
//  * @returns {Promise<Array>}
//  */
// userSchema.statics.findByManager = function (managerId) {
//   return this.find({ reportingManager: managerId, status: USER_STATUS.ACTIVE });
// };

// /**
//  * Get user count by role
//  * @returns {Promise<Object>}
//  */
// userSchema.statics.getCountByRole = async function () {
//   const counts = await this.aggregate([
//     { $group: { _id: '$role', count: { $sum: 1 } } }
//   ]);
  
//   const result = {};
//   counts.forEach(c => {
//     result[c._id] = c.count;
//   });
//   return result;
// };

// /**
//  * Get users with upcoming document expiry
//  * @param {number} daysAhead - Days to look ahead (default: 30)
//  * @returns {Promise<Array>}
//  */
// userSchema.statics.getDocumentExpiryReminders = async function (daysAhead = 30) {
//   const expiryDate = new Date();
//   expiryDate.setDate(expiryDate.getDate() + daysAhead);
  
//   return this.find({
//     'documents.expiryDate': { $lte: expiryDate, $gte: new Date() },
//     status: USER_STATUS.ACTIVE
//   }).populate('reportingManager', 'firstName lastName email');
// };

// /**
//  * Get active technicians for task assignment
//  * @returns {Promise<Array>}
//  */
// userSchema.statics.getActiveTechnicians = async function () {
//   return this.find({ 
//     role: 'technician', 
//     status: USER_STATUS.ACTIVE 
//   }).select('firstName lastName email phone profileImage');
// };

// /**
//  * Get users with chat enabled
//  * @returns {Promise<Array>}
//  */
// userSchema.statics.getChatEnabledUsers = async function () {
//   return this.find({ 
//     chatEnabled: true, 
//     status: USER_STATUS.ACTIVE 
//   }).select('firstName lastName email role profileImage');
// };

// /**
//  * Get online users for real-time chat
//  * @returns {Promise<Array>}
//  */
// userSchema.statics.getOnlineUsers = async function () {
//   return this.find({ 
//     isUserOnline: true,
//     status: USER_STATUS.ACTIVE 
//   }).select('firstName lastName email role profileImage isUserOnline lastSeen socketId');
// };

// /**
//  * Get user by socket ID
//  * @param {string} socketId - Socket.IO connection ID
//  * @returns {Promise<Object>}
//  */
// userSchema.statics.findBySocketId = function (socketId) {
//   return this.findOne({ socketId, status: USER_STATUS.ACTIVE });
// };

// /**
//  * Mark user as offline by socket ID (for disconnect handling)
//  * @param {string} socketId - Socket.IO connection ID
//  * @returns {Promise<Object>}
//  */
// userSchema.statics.markOfflineBySocketId = async function (socketId) {
//   return this.findOneAndUpdate(
//     { socketId },
//     { 
//       isUserOnline: false, 
//       lastSeen: new Date(),
//       socketId: null 
//     },
//     { new: true }
//   );
// };

// // ==================== VIRTUAL PROPERTIES ====================

// // Full name virtual
// userSchema.virtual('fullName').get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

// // Age virtual
// userSchema.virtual('age').get(function () {
//   if (!this.dateOfBirth) return null;
//   const today = new Date();
//   const birthDate = new Date(this.dateOfBirth);
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// });

// // Last seen formatted virtual - UPDATED field name
// userSchema.virtual('lastSeenFormatted').get(function () {
//   if (!this.lastSeen) return 'Never';
  
//   const now = new Date();
//   const lastSeenDate = new Date(this.lastSeen);
//   const diffSeconds = Math.floor((now - lastSeenDate) / 1000);
  
//   if (diffSeconds < 60) return 'Just now';
//   const diffMinutes = Math.floor(diffSeconds / 60);
//   if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
//   const diffHours = Math.floor(diffMinutes / 60);
//   if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
//   const diffDays = Math.floor(diffHours / 24);
//   if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
//   if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
//   return lastSeenDate.toLocaleDateString();
// });

// // Online status virtual (for backward compatibility)
// userSchema.virtual('isOnline').get(function () {
//   return this.isUserOnline;
// });

// // ==================== PREVENT OVERWRITE MODEL ERROR ====================
// const User = mongoose.models.User || mongoose.model('User', userSchema);
// module.exports = User;













//============================================================



const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES, USER_STATUS, DEPARTMENTS, EMPLOYMENT_TYPES } = require('../config/constants');

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    alternatePhone: String,

    // Profile
    profileImage: {
      type: String,
      default: null,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    nationality: String,

    // Authentication
    password: {
      type: String,
      required: true,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },

    // Employment Details
    employeeType: {
      type: String,
      enum: Object.values(EMPLOYMENT_TYPES),
      default: EMPLOYMENT_TYPES.FULL_TIME,
    },
    designation: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      enum: Object.values(DEPARTMENTS),
      required: true,
    },
    reportingManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Role & Permissions
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },
    customPermissions: [String],

    // Chat Permission
    chatEnabled: {
      type: Boolean,
      default: false,
      description: 'Controls whether user can access chat features'
    },

    // ==================== ONLINE STATUS FIELDS (ADDED) ====================
    // IMPORTANT: Using 'isOnline' field name (not isUserOnline) for compatibility
    // This field tracks real-time online status for chat and presence features
    isOnline: {
      type: Boolean,
      default: false,
      index: true,
      description: 'Real-time online status for chat and presence'
    },
    // Last seen timestamp - tracks user's last activity
    lastSeen: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'Last time user was active'
    },
    // Socket.IO connection ID for real-time communication
    socketId: {
      type: String,
      default: null,
      sparse: true,
      index: true,
      description: 'Socket.IO connection ID for real-time communication'
    },

    // Work Location
    assignedBuildings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
      },
    ],
    workLocation: String,

    // Shift Details
    shiftTiming: {
      start: String,
      end: String,
      timezone: { type: String, default: 'Asia/Dubai' },
    },

    // Financial
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      ifscCode: String,
      iban: String,
    },

    // Documents
    documents: [
      {
        type: {
          type: String,
          enum: ['passport', 'visa', 'emirates_id', 'pan_card', 'contract', 'offer_letter'],
        },
        number: String,
        expiryDate: Date,
        fileUrl: String,
        verified: { type: Boolean, default: false },
        uploadedAt: Date,
      },
    ],

    // Status
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    joiningDate: Date,
    terminationDate: Date,
    terminationReason: String,

    // Location Tracking (for GPS)
    lastLocation: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
      updatedAt: { type: Date },
    },

    // FCM Tokens for Push Notifications
    fcmTokens: [{
      type: String,
    }],

    // System Fields
    lastLoginAt: Date,
    lastLoginIP: String,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,

    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==================== INDEXES FOR PERFORMANCE ====================
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ employeeId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ reportingManager: 1 });
userSchema.index({ department: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ chatEnabled: 1 });
// Online status indexes (ADDED)
userSchema.index({ isOnline: 1, lastSeen: -1 });
userSchema.index({ socketId: 1 });
userSchema.index({ isOnline: 1, status: 1 });

// ==================== PRE-SAVE MIDDLEWARE ====================

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate employee ID for employees (not customers)
userSchema.pre('save', async function (next) {
  // Skip if already has employeeId or is customer
  if (this.employeeId || this.role === 'customer') return next();

  const year = new Date().getFullYear();
  const count = await mongoose.model('User').countDocuments({ role: { $ne: 'customer' } });
  this.employeeId = `EMP${year}${String(count + 1).padStart(6, '0')}`;
  next();
});

// Pre-save middleware for chatEnabled (ensure it's always a boolean)
userSchema.pre('save', function(next) {
  if (this.chatEnabled === undefined || this.chatEnabled === null) {
    this.chatEnabled = false;
  }
  next();
});

// Pre-save middleware for online status (ADDED - ensures default values)
userSchema.pre('save', function(next) {
  if (this.isOnline === undefined || this.isOnline === null) {
    this.isOnline = false;
  }
  if (!this.lastSeen) {
    this.lastSeen = new Date();
  }
  next();
});

// ==================== INSTANCE METHODS ====================

/**
 * Compare password
 * @param {string} candidatePassword - Plain text password to compare
 * @returns {Promise<boolean>} - True if passwords match
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Check if account is locked
 * @returns {boolean} - True if account is locked
 */
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

/**
 * Increment login attempts on failed login
 */
userSchema.methods.incrementLoginAttempts = async function () {
  this.loginAttempts += 1;

  if (this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 30 * 60 * 1000; // Lock for 30 minutes
  }

  await this.save();
};

/**
 * Reset login attempts on successful login
 */
userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = null;
  await this.save();
};

/**
 * Update last login information
 * @param {string} ipAddress - IP address of login
 */
userSchema.methods.updateLastLogin = async function (ipAddress) {
  this.lastLoginAt = new Date();
  this.lastLoginIP = ipAddress;
  this.loginAttempts = 0;
  this.lockUntil = null;
  await this.save();
};

/**
 * Check if user is currently online (based on last activity threshold)
 * @param {number} thresholdMinutes - Minutes to consider as online (default: 5)
 * @returns {boolean}
 */
userSchema.methods.checkOnlineStatus = function (thresholdMinutes = 5) {
  // First check the actual online flag
  if (this.isOnline) return true;
  
  // Fallback: check last activity time
  if (!this.lastSeen) return false;
  const diffMinutes = (Date.now() - this.lastSeen) / (1000 * 60);
  return diffMinutes < thresholdMinutes;
};

/**
 * Get user's full name
 * @returns {string}
 */
userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

/**
 * Get user's profile summary (safe for API responses)
 */
userSchema.methods.getProfileSummary = function () {
  return {
    id: this._id,
    employeeId: this.employeeId,
    name: this.getFullName(),
    email: this.email,
    phone: this.phone,
    role: this.role,
    department: this.department,
    designation: this.designation,
    profileImage: this.profileImage,
    status: this.status,
    chatEnabled: this.chatEnabled,
    isOnline: this.isOnline,  // Use the renamed field
    lastSeen: this.lastSeen,
    lastLoginAt: this.lastLoginAt,
  };
};

/**
 * Update online status for real-time chat
 * @param {boolean} isOnline - Online status
 * @param {string} socketId - Socket.IO connection ID
 * @returns {Promise<Object>}
 */
userSchema.methods.updateOnlineStatus = async function(isOnline, socketId = null) {
  this.isOnline = isOnline;
  this.lastSeen = new Date();
  if (socketId) this.socketId = socketId;
  if (!isOnline) this.socketId = null;
  await this.save();
  return this;
};

/**
 * Update user's heartbeat (keep alive)
 * @returns {Promise<Object>}
 */
userSchema.methods.updateHeartbeat = async function() {
  this.lastSeen = new Date();
  if (this.isOnline === false) {
    this.isOnline = true;
  }
  await this.save();
  return this;
};

/**
 * Get online status for frontend display
 * @returns {Object}
 */
userSchema.methods.getOnlineStatus = function() {
  return {
    isOnline: this.isOnline,
    lastSeen: this.lastSeen,
    lastSeenFormatted: this.lastSeenFormatted,
    socketId: this.socketId
  };
};

/**
 * Check if user has specific permission
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
userSchema.methods.hasPermission = function (permission) {
  if (this.role === 'super_admin') return true;
  if (this.customPermissions && this.customPermissions.includes(permission)) return true;
  return false;
};

/**
 * Check if user can access a building
 * @param {string} buildingId - Building ID to check
 * @returns {boolean}
 */
userSchema.methods.canAccessBuilding = function (buildingId) {
  if (this.role === 'super_admin') return true;
  if (this.assignedBuildings && this.assignedBuildings.includes(buildingId)) return true;
  return false;
};

/**
 * Check if user can chat with target role
 * @param {string} targetRole - Role of the user to chat with
 * @returns {boolean}
 */
userSchema.methods.canChatWith = function (targetRole) {
  if (!this.chatEnabled) return false;
  
  // Permission Matrix
  const permissions = {
    super_admin: ['customer', 'technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin'],
    admin: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
    manager: ['customer', 'supervisor', 'manager', 'admin'],
    supervisor: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
    technician: ['customer', 'technician', 'supervisor', 'admin'],
    hr: ['employee', 'manager', 'admin'],
    customer: ['technician', 'supervisor', 'manager', 'admin']
  };
  
  return permissions[this.role]?.includes(targetRole) || false;
};

/**
 * Get user's team members (for managers and supervisors)
 */
userSchema.methods.getTeamMembers = async function () {
  if (this.role === 'manager') {
    return await mongoose.model('User').find({ reportingManager: this._id, status: USER_STATUS.ACTIVE });
  }
  if (this.role === 'supervisor') {
    return await mongoose.model('User').find({ supervisor: this._id, status: USER_STATUS.ACTIVE });
  }
  return [];
};

// ==================== STATIC METHODS ====================

/**
 * Find users by role
 * @param {string} role - Role to filter by
 * @returns {Promise<Array>}
 */
userSchema.statics.findByRole = function (role) {
  return this.find({ role, status: USER_STATUS.ACTIVE });
};

/**
 * Find users by department
 * @param {string} department - Department to filter by
 * @returns {Promise<Array>}
 */
userSchema.statics.findByDepartment = function (department) {
  return this.find({ department, status: USER_STATUS.ACTIVE });
};

/**
 * Find users by reporting manager
 * @param {string} managerId - Manager ID
 * @returns {Promise<Array>}
 */
userSchema.statics.findByManager = function (managerId) {
  return this.find({ reportingManager: managerId, status: USER_STATUS.ACTIVE });
};

/**
 * Get user count by role
 * @returns {Promise<Object>}
 */
userSchema.statics.getCountByRole = async function () {
  const counts = await this.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);
  
  const result = {};
  counts.forEach(c => {
    result[c._id] = c.count;
  });
  return result;
};

/**
 * Get users with upcoming document expiry
 * @param {number} daysAhead - Days to look ahead (default: 30)
 * @returns {Promise<Array>}
 */
userSchema.statics.getDocumentExpiryReminders = async function (daysAhead = 30) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + daysAhead);
  
  return this.find({
    'documents.expiryDate': { $lte: expiryDate, $gte: new Date() },
    status: USER_STATUS.ACTIVE
  }).populate('reportingManager', 'firstName lastName email');
};

/**
 * Get active technicians for task assignment
 * @returns {Promise<Array>}
 */
userSchema.statics.getActiveTechnicians = async function () {
  return this.find({ 
    role: 'technician', 
    status: USER_STATUS.ACTIVE 
  }).select('firstName lastName email phone profileImage');
};

/**
 * Get users with chat enabled
 * @returns {Promise<Array>}
 */
userSchema.statics.getChatEnabledUsers = async function () {
  return this.find({ 
    chatEnabled: true, 
    status: USER_STATUS.ACTIVE 
  }).select('firstName lastName email role profileImage');
};

/**
 * Get online users for real-time chat
 * @returns {Promise<Array>}
 */
userSchema.statics.getOnlineUsers = async function () {
  return this.find({ 
    isOnline: true,
    status: USER_STATUS.ACTIVE 
  }).select('firstName lastName email role profileImage isOnline lastSeen socketId');
};

/**
 * Get user by socket ID
 * @param {string} socketId - Socket.IO connection ID
 * @returns {Promise<Object>}
 */
userSchema.statics.findBySocketId = function (socketId) {
  return this.findOne({ socketId, status: USER_STATUS.ACTIVE });
};

/**
 * Mark user as offline by socket ID (for disconnect handling)
 * @param {string} socketId - Socket.IO connection ID
 * @returns {Promise<Object>}
 */
userSchema.statics.markOfflineBySocketId = async function (socketId) {
  return this.findOneAndUpdate(
    { socketId },
    { 
      isOnline: false, 
      lastSeen: new Date(),
      socketId: null 
    },
    { new: true }
  );
};

/**
 * Get all users with online status (for presence feature)
 * @returns {Promise<Array>}
 */
userSchema.statics.getAllWithOnlineStatus = async function () {
  return this.find({ status: USER_STATUS.ACTIVE })
    .select('firstName lastName email role profileImage isOnline lastSeen socketId');
};

/**
 * Bulk update online status (for maintenance)
 * @returns {Promise<Object>}
 */
userSchema.statics.resetAllOnlineStatus = async function () {
  return this.updateMany(
    { isOnline: true },
    { isOnline: false, lastSeen: new Date(), socketId: null }
  );
};

// ==================== VIRTUAL PROPERTIES ====================

// Full name virtual
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Age virtual
userSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Last seen formatted virtual
userSchema.virtual('lastSeenFormatted').get(function () {
  if (!this.lastSeen) return 'Never';
  
  const now = new Date();
  const lastSeenDate = new Date(this.lastSeen);
  const diffSeconds = Math.floor((now - lastSeenDate) / 1000);
  
  if (diffSeconds < 60) return 'Just now';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return lastSeenDate.toLocaleDateString();
});

// Short name virtual
userSchema.virtual('shortName').get(function () {
  return `${this.firstName} ${this.lastName.charAt(0)}.`;
});

// ==================== PREVENT OVERWRITE MODEL ERROR ====================
const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;








