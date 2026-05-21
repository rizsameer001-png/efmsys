// const mongoose = require('mongoose');

// const activityLogSchema = new mongoose.Schema(
//   {
//     // User Information
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       index: true,
//     },
//     userName: {
//       type: String,
//       required: true,
//     },
//     userRole: {
//       type: String,
//       required: true,
//     },
//     userEmail: {
//       type: String,
//     },

//     // Action Information
//     action: {
//       type: String,
//       required: true,
//       enum: [
//         // Auth Actions
//         'LOGIN',
//         'LOGOUT',
//         'REGISTER',
//         'PASSWORD_RESET',
//         'PASSWORD_CHANGE',
        
//         // User Management
//         'CREATE_USER',
//         'UPDATE_USER',
//         'DELETE_USER',
//         'BULK_IMPORT_USERS',
//         'EXPORT_USERS',
        
//         // Role Management
//         'CREATE_ROLE',
//         'UPDATE_ROLE',
//         'DELETE_ROLE',
//         'ASSIGN_ROLE',
        
//         // Task Management
//         'CREATE_TASK',
//         'UPDATE_TASK',
//         'DELETE_TASK',
//         'ASSIGN_TASK',
//         'REASSIGN_TASK',
//         'ACCEPT_TASK',
//         'START_TASK',
//         'COMPLETE_TASK',
//         'VERIFY_TASK',
//         'REJECT_TASK',
//         'UPDATE_TASK_PROGRESS',
        
//         // Complaint Management
//         'CREATE_COMPLAINT',
//         'UPDATE_COMPLAINT',
//         'DELETE_COMPLAINT',
//         'ASSIGN_COMPLAINT',
//         'RESOLVE_COMPLAINT',
        
//         // Attendance Management
//         'CHECK_IN',
//         'CHECK_OUT',
//         'APPROVE_ATTENDANCE',
//         'MARK_LEAVE',
//         'APPROVE_LEAVE',
        
//         // Salary Management
//         'GENERATE_SALARY',
//         'APPROVE_SALARY',
//         'MARK_SALARY_PAID',
//         'UPDATE_SALARY',
        
//         // Building Management
//         'CREATE_BUILDING',
//         'UPDATE_BUILDING',
//         'DELETE_BUILDING',
        
//         // Notification Management
//         'SEND_NOTIFICATION',
//         'BULK_SEND_NOTIFICATIONS',
        
//         // Report Actions
//         'GENERATE_REPORT',
//         'EXPORT_REPORT',
        
//         // System Actions
//         'SYSTEM_SETTING_CHANGE',
//         'BACKUP_CREATED',
//         'DATABASE_CLEANUP'
//       ],
//       index: true,
//     },

//     // Entity Information (what was affected)
//     entityType: {
//       type: String,
//       enum: [
//         'user',
//         'role',
//         'task',
//         'complaint',
//         'attendance',
//         'leave',
//         'salary',
//         'building',
//         'notification',
//         'report',
//         'setting',
//         'system'
//       ],
//       required: true,
//       index: true,
//     },
//     entityId: {
//       type: String,
//       index: true,
//     },
//     entityName: {
//       type: String,
//     },

//     // Data Changes (for update actions)
//     oldData: {
//       type: mongoose.Schema.Types.Mixed,
//       default: null,
//     },
//     newData: {
//       type: mongoose.Schema.Types.Mixed,
//       default: null,
//     },

//     // Request Information
//     ipAddress: {
//       type: String,
//     },
//     userAgent: {
//       type: String,
//     },
//     requestMethod: {
//       type: String,
//       enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//     },
//     requestUrl: {
//       type: String,
//     },

//     // Status
//     status: {
//       type: String,
//       enum: ['success', 'failed', 'pending'],
//       default: 'success',
//     },
//     errorMessage: {
//       type: String,
//     },

//     // Duration (in milliseconds)
//     duration: {
//       type: Number,
//     },

//     // Metadata
//     metadata: {
//       type: mongoose.Schema.Types.Mixed,
//       default: {},
//     },

//     // Timestamp
//     createdAt: {
//       type: Date,
//       default: Date.now,
//       index: { expires: '90d' }, // Auto-delete after 90 days
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // ==================== INDEXES ====================
// activityLogSchema.index({ userId: 1, createdAt: -1 });
// activityLogSchema.index({ action: 1, createdAt: -1 });
// activityLogSchema.index({ entityType: 1, entityId: 1 });
// activityLogSchema.index({ userRole: 1, createdAt: -1 });
// activityLogSchema.index({ createdAt: -1 });
// activityLogSchema.index({ status: 1 });

// // ==================== COMPOUND INDEXES ====================
// activityLogSchema.index({ userId: 1, action: 1, createdAt: -1 });
// activityLogSchema.index({ entityType: 1, entityId: 1, action: 1 });

// // ==================== PRE-SAVE MIDDLEWARE ====================
// activityLogSchema.pre('save', function(next) {
//   // Ensure userName is set if missing
//   if (!this.userName && this.userId) {
//     // This will be populated in the controller
//     this.userName = 'Unknown';
//   }
//   next();
// });

// // ==================== VIRTUAL PROPERTIES ====================
// activityLogSchema.virtual('actionDisplayName').get(function() {
//   const actionNames = {
//     LOGIN: 'Login',
//     LOGOUT: 'Logout',
//     REGISTER: 'Registered',
//     CREATE_USER: 'Created User',
//     UPDATE_USER: 'Updated User',
//     DELETE_USER: 'Deleted User',
//     CREATE_TASK: 'Created Task',
//     UPDATE_TASK: 'Updated Task',
//     DELETE_TASK: 'Deleted Task',
//     ASSIGN_TASK: 'Assigned Task',
//     COMPLETE_TASK: 'Completed Task',
//     VERIFY_TASK: 'Verified Task',
//     CREATE_COMPLAINT: 'Created Complaint',
//     RESOLVE_COMPLAINT: 'Resolved Complaint',
//     CHECK_IN: 'Checked In',
//     CHECK_OUT: 'Checked Out',
//     GENERATE_SALARY: 'Generated Salary',
//     APPROVE_SALARY: 'Approved Salary'
//   };
//   return actionNames[this.action] || this.action;
// });

// activityLogSchema.virtual('entityDisplayName').get(function() {
//   const entityNames = {
//     user: 'User',
//     role: 'Role',
//     task: 'Task',
//     complaint: 'Complaint',
//     attendance: 'Attendance',
//     leave: 'Leave Request',
//     salary: 'Salary',
//     building: 'Building',
//     notification: 'Notification',
//     report: 'Report'
//   };
//   return entityNames[this.entityType] || this.entityType;
// });

// // ==================== INSTANCE METHODS ====================

// /**
//  * Get formatted log entry for display
//  */
// activityLogSchema.methods.getFormattedLog = function() {
//   return {
//     id: this._id,
//     user: {
//       id: this.userId,
//       name: this.userName,
//       role: this.userRole,
//       email: this.userEmail
//     },
//     action: {
//       code: this.action,
//       display: this.actionDisplayName
//     },
//     entity: {
//       type: this.entityType,
//       display: this.entityDisplayName,
//       id: this.entityId,
//       name: this.entityName
//     },
//     changes: {
//       old: this.oldData,
//       new: this.newData
//     },
//     request: {
//       ip: this.ipAddress,
//       method: this.requestMethod,
//       url: this.requestUrl
//     },
//     status: this.status,
//     error: this.errorMessage,
//     timestamp: this.createdAt,
//     timeAgo: this.getTimeAgo()
//   };
// };

// /**
//  * Get time ago string
//  */
// activityLogSchema.methods.getTimeAgo = function() {
//   const seconds = Math.floor((Date.now() - this.createdAt) / 1000);
  
//   if (seconds < 60) return `${seconds} seconds ago`;
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//   const days = Math.floor(hours / 24);
//   return `${days} day${days > 1 ? 's' : ''} ago`;
// };

// // ==================== STATIC METHODS ====================

// /**
//  * Log an activity
//  * @param {Object} params - Activity parameters
//  * @returns {Promise<Object>}
//  */
// activityLogSchema.statics.log = async function({
//   userId,
//   userName,
//   userRole,
//   userEmail,
//   action,
//   entityType,
//   entityId,
//   entityName,
//   oldData = null,
//   newData = null,
//   ipAddress = null,
//   userAgent = null,
//   requestMethod = null,
//   requestUrl = null,
//   status = 'success',
//   errorMessage = null,
//   duration = null,
//   metadata = {}
// }) {
//   try {
//     const log = new this({
//       userId,
//       userName,
//       userRole,
//       userEmail,
//       action,
//       entityType,
//       entityId,
//       entityName,
//       oldData,
//       newData,
//       ipAddress,
//       userAgent,
//       requestMethod,
//       requestUrl,
//       status,
//       errorMessage,
//       duration,
//       metadata
//     });
    
//     await log.save();
//     return log;
//   } catch (error) {
//     console.error('Error logging activity:', error);
//     return null;
//   }
// };

// /**
//  * Get activity logs with filters
//  * @param {Object} filters - Filter criteria
//  * @param {Object} pagination - Pagination options
//  * @returns {Promise<Object>}
//  */
// activityLogSchema.statics.getLogs = async function(filters = {}, pagination = {}) {
//   const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
//   const query = {};
  
//   // Apply filters
//   if (filters.userId) query.userId = filters.userId;
//   if (filters.userRole) query.userRole = filters.userRole;
//   if (filters.action) query.action = filters.action;
//   if (filters.entityType) query.entityType = filters.entityType;
//   if (filters.entityId) query.entityId = filters.entityId;
//   if (filters.status) query.status = filters.status;
  
//   // Date range filter
//   if (filters.startDate || filters.endDate) {
//     query.createdAt = {};
//     if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
//     if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
//   }
  
//   // Search filter
//   if (filters.search) {
//     query.$or = [
//       { userName: { $regex: filters.search, $options: 'i' } },
//       { action: { $regex: filters.search, $options: 'i' } },
//       { entityName: { $regex: filters.search, $options: 'i' } }
//     ];
//   }
  
//   const skip = (page - 1) * limit;
//   const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  
//   const [logs, total] = await Promise.all([
//     this.find(query)
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(limit)
//       .populate('userId', 'firstName lastName email role'),
//     this.countDocuments(query)
//   ]);
  
//   return {
//     logs,
//     pagination: {
//       page,
//       limit,
//       total,
//       pages: Math.ceil(total / limit)
//     }
//   };
// };

// /**
//  * Get activity statistics
//  * @param {Object} filters - Filter criteria
//  * @returns {Promise<Object>}
//  */
// activityLogSchema.statics.getStatistics = async function(filters = {}) {
//   const match = {};
  
//   if (filters.startDate || filters.endDate) {
//     match.createdAt = {};
//     if (filters.startDate) match.createdAt.$gte = new Date(filters.startDate);
//     if (filters.endDate) match.createdAt.$lte = new Date(filters.endDate);
//   }
  
//   const [total, byAction, byUser, byEntity] = await Promise.all([
//     this.countDocuments(match),
//     this.aggregate([
//       { $match: match },
//       { $group: { _id: '$action', count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 10 }
//     ]),
//     this.aggregate([
//       { $match: match },
//       { $group: { _id: '$userRole', count: { $sum: 1 } } }
//     ]),
//     this.aggregate([
//       { $match: match },
//       { $group: { _id: '$entityType', count: { $sum: 1 } } }
//     ])
//   ]);
  
//   return {
//     total,
//     topActions: byAction,
//     byUserRole: byUser,
//     byEntityType: byEntity
//   };
// };

// /**
//  * Clean old logs (called by cron job)
//  * @param {number} daysToKeep - Days to keep logs (default: 90)
//  * @returns {Promise<Object>}
//  */
// activityLogSchema.statics.cleanOldLogs = async function(daysToKeep = 90) {
//   const cutoffDate = new Date();
//   cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
//   const result = await this.deleteMany({
//     createdAt: { $lt: cutoffDate }
//   });
  
//   return result;
// };

// /**
//  * Get user activity summary
//  * @param {string} userId - User ID
//  * @param {number} days - Number of days to look back
//  * @returns {Promise<Object>}
//  */
// activityLogSchema.statics.getUserActivitySummary = async function(userId, days = 30) {
//   const startDate = new Date();
//   startDate.setDate(startDate.getDate() - days);
  
//   const logs = await this.find({
//     userId,
//     createdAt: { $gte: startDate }
//   });
  
//   const summary = {
//     totalActions: logs.length,
//     byAction: {},
//     lastActive: logs.length > 0 ? logs[0].createdAt : null,
//     activeDays: new Set(logs.map(l => l.createdAt.toDateString())).size
//   };
  
//   logs.forEach(log => {
//     summary.byAction[log.action] = (summary.byAction[log.action] || 0) + 1;
//   });
  
//   return summary;
// };

// // ==================== PREVENT OVERWRITE MODEL ERROR ====================
// module.exports = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);





// server/src/models/ActivityLog.model.js
const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    // User Information
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      default: 'Unknown', // 🔴 FIX: Added default value
    },
    userRole: {
      type: String,
      required: true,
      default: 'user', // 🔴 FIX: Added default value
    },
    userEmail: {
      type: String,
      default: '',
    },

    // Action Information
    action: {
      type: String,
      required: true,
      enum: [
        // Auth Actions
        'LOGIN',
        'LOGOUT',
        'REGISTER',
        'PASSWORD_RESET',
        'PASSWORD_CHANGE',
        
        // User Management
        'CREATE_USER',
        'UPDATE_USER',
        'DELETE_USER',
        'BULK_IMPORT_USERS',
        'EXPORT_USERS',
        
        // Role Management
        'CREATE_ROLE',
        'UPDATE_ROLE',
        'DELETE_ROLE',
        'ASSIGN_ROLE',
        
        // Task Management
        'CREATE_TASK',
        'UPDATE_TASK',
        'DELETE_TASK',
        'ASSIGN_TASK',
        'REASSIGN_TASK',
        'ACCEPT_TASK',
        'START_TASK',
        'COMPLETE_TASK',
        'VERIFY_TASK',
        'REJECT_TASK',
        'UPDATE_TASK_PROGRESS',
        
        // Complaint Management
        'CREATE_COMPLAINT',
        'UPDATE_COMPLAINT',
        'DELETE_COMPLAINT',
        'ASSIGN_COMPLAINT',
        'RESOLVE_COMPLAINT',
        
        // Attendance Management
        'CHECK_IN',
        'CHECK_OUT',
        'APPROVE_ATTENDANCE',
        'MARK_LEAVE',
        'APPROVE_LEAVE',
        
        // Salary Management
        'GENERATE_SALARY',
        'APPROVE_SALARY',
        'MARK_SALARY_PAID',
        'UPDATE_SALARY',
        
        // Building Management
        'CREATE_BUILDING',
        'UPDATE_BUILDING',
        'DELETE_BUILDING',
        
        // Notification Management
        'SEND_NOTIFICATION',
        'BULK_SEND_NOTIFICATIONS',
        
        // Report Actions
        'GENERATE_REPORT',
        'EXPORT_REPORT',
        
        // System Actions
        'SYSTEM_SETTING_CHANGE',
        'BACKUP_CREATED',
        'DATABASE_CLEANUP'
      ],
      index: true,
    },

    // Entity Information (what was affected)
    entityType: {
      type: String,
      enum: [
        'user',
        'role',
        'task',
        'complaint',
        'attendance',
        'leave',
        'salary',
        'building',
        'notification',
        'report',
        'setting',
        'system'
      ],
      required: true,
      index: true,
    },
    entityId: {
      type: String,
      index: true,
      default: '',
    },
    entityName: {
      type: String,
      default: '',
    },

    // Data Changes (for update actions)
    oldData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Request Information
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    requestMethod: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      default: null,
    },
    requestUrl: {
      type: String,
      default: '',
    },

    // Status
    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'success',
    },
    errorMessage: {
      type: String,
      default: '',
    },

    // Duration (in milliseconds)
    duration: {
      type: Number,
      default: 0,
    },

    // Metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Timestamp
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: '90d' }, // Auto-delete after 90 days
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==================== INDEXES ====================
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });
activityLogSchema.index({ userRole: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ status: 1 });

// ==================== COMPOUND INDEXES ====================
activityLogSchema.index({ userId: 1, action: 1, createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1, action: 1 });

// ==================== PRE-SAVE MIDDLEWARE ====================
activityLogSchema.pre('save', function(next) {
  // 🔴 FIX: Ensure userName is set if missing
  if (!this.userName || this.userName === '') {
    this.userName = 'Unknown';
  }
  
  // 🔴 FIX: Ensure userRole is set if missing
  if (!this.userRole || this.userRole === '') {
    this.userRole = 'user';
  }
  
  // 🔴 FIX: Ensure entityId is string
  if (this.entityId && typeof this.entityId !== 'string') {
    this.entityId = this.entityId.toString();
  }
  
  next();
});

// ==================== VIRTUAL PROPERTIES ====================
activityLogSchema.virtual('actionDisplayName').get(function() {
  const actionNames = {
    LOGIN: 'Login',
    LOGOUT: 'Logout',
    REGISTER: 'Registered',
    CREATE_USER: 'Created User',
    UPDATE_USER: 'Updated User',
    DELETE_USER: 'Deleted User',
    CREATE_TASK: 'Created Task',
    UPDATE_TASK: 'Updated Task',
    DELETE_TASK: 'Deleted Task',
    ASSIGN_TASK: 'Assigned Task',
    COMPLETE_TASK: 'Completed Task',
    VERIFY_TASK: 'Verified Task',
    CREATE_COMPLAINT: 'Created Complaint',
    RESOLVE_COMPLAINT: 'Resolved Complaint',
    CHECK_IN: 'Checked In',
    CHECK_OUT: 'Checked Out',
    GENERATE_SALARY: 'Generated Salary',
    APPROVE_SALARY: 'Approved Salary'
  };
  return actionNames[this.action] || this.action;
});

activityLogSchema.virtual('entityDisplayName').get(function() {
  const entityNames = {
    user: 'User',
    role: 'Role',
    task: 'Task',
    complaint: 'Complaint',
    attendance: 'Attendance',
    leave: 'Leave Request',
    salary: 'Salary',
    building: 'Building',
    notification: 'Notification',
    report: 'Report'
  };
  return entityNames[this.entityType] || this.entityType;
});

// ==================== INSTANCE METHODS ====================

/**
 * Get formatted log entry for display
 */
activityLogSchema.methods.getFormattedLog = function() {
  return {
    id: this._id,
    user: {
      id: this.userId,
      name: this.userName,
      role: this.userRole,
      email: this.userEmail
    },
    action: {
      code: this.action,
      display: this.actionDisplayName
    },
    entity: {
      type: this.entityType,
      display: this.entityDisplayName,
      id: this.entityId,
      name: this.entityName
    },
    changes: {
      old: this.oldData,
      new: this.newData
    },
    request: {
      ip: this.ipAddress,
      method: this.requestMethod,
      url: this.requestUrl
    },
    status: this.status,
    error: this.errorMessage,
    timestamp: this.createdAt,
    timeAgo: this.getTimeAgo()
  };
};

/**
 * Get time ago string
 */
activityLogSchema.methods.getTimeAgo = function() {
  const seconds = Math.floor((Date.now() - this.createdAt) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

// ==================== STATIC METHODS ====================

/**
 * Log an activity
 * @param {Object} params - Activity parameters
 * @returns {Promise<Object>}
 */
activityLogSchema.statics.log = async function({
  userId,
  userName,
  userRole,
  userEmail,
  action,
  entityType,
  entityId,
  entityName,
  oldData = null,
  newData = null,
  ipAddress = null,
  userAgent = null,
  requestMethod = null,
  requestUrl = null,
  status = 'success',
  errorMessage = null,
  duration = null,
  metadata = {}
}) {
  try {
    // 🔴 FIX: Ensure required fields have values
    const logData = {
      userId,
      userName: userName || 'Unknown',
      userRole: userRole || 'user',
      userEmail: userEmail || '',
      action,
      entityType,
      entityId: entityId ? entityId.toString() : '',
      entityName: entityName || '',
      oldData,
      newData,
      ipAddress: ipAddress || '',
      userAgent: userAgent || '',
      requestMethod: requestMethod || null,
      requestUrl: requestUrl || '',
      status,
      errorMessage: errorMessage || '',
      duration: duration || 0,
      metadata: metadata || {}
    };
    
    const log = new this(logData);
    await log.save();
    return log;
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw error - just log to console
    return null;
  }
};

/**
 * Get activity logs with filters
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>}
 */
activityLogSchema.statics.getLogs = async function(filters = {}, pagination = {}) {
  const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
  const query = {};
  
  // Apply filters
  if (filters.userId) query.userId = filters.userId;
  if (filters.userRole) query.userRole = filters.userRole;
  if (filters.action) query.action = filters.action;
  if (filters.entityType) query.entityType = filters.entityType;
  if (filters.entityId) query.entityId = filters.entityId;
  if (filters.status) query.status = filters.status;
  
  // Date range filter
  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
  }
  
  // Search filter
  if (filters.search) {
    query.$or = [
      { userName: { $regex: filters.search, $options: 'i' } },
      { action: { $regex: filters.search, $options: 'i' } },
      { entityName: { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  const skip = (page - 1) * limit;
  const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  
  const [logs, total] = await Promise.all([
    this.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName email role'),
    this.countDocuments(query)
  ]);
  
  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get activity statistics
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Object>}
 */
activityLogSchema.statics.getStatistics = async function(filters = {}) {
  const match = {};
  
  if (filters.startDate || filters.endDate) {
    match.createdAt = {};
    if (filters.startDate) match.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) match.createdAt.$lte = new Date(filters.endDate);
  }
  
  const [total, byAction, byUser, byEntity] = await Promise.all([
    this.countDocuments(match),
    this.aggregate([
      { $match: match },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    this.aggregate([
      { $match: match },
      { $group: { _id: '$userRole', count: { $sum: 1 } } }
    ]),
    this.aggregate([
      { $match: match },
      { $group: { _id: '$entityType', count: { $sum: 1 } } }
    ])
  ]);
  
  return {
    total,
    topActions: byAction,
    byUserRole: byUser,
    byEntityType: byEntity
  };
};

/**
 * Clean old logs (called by cron job)
 * @param {number} daysToKeep - Days to keep logs (default: 90)
 * @returns {Promise<Object>}
 */
activityLogSchema.statics.cleanOldLogs = async function(daysToKeep = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  const result = await this.deleteMany({
    createdAt: { $lt: cutoffDate }
  });
  
  return result;
};

/**
 * Get user activity summary
 * @param {string} userId - User ID
 * @param {number} days - Number of days to look back
 * @returns {Promise<Object>}
 */
activityLogSchema.statics.getUserActivitySummary = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const logs = await this.find({
    userId,
    createdAt: { $gte: startDate }
  });
  
  const summary = {
    totalActions: logs.length,
    byAction: {},
    lastActive: logs.length > 0 ? logs[0].createdAt : null,
    activeDays: new Set(logs.map(l => l.createdAt.toDateString())).size
  };
  
  logs.forEach(log => {
    summary.byAction[log.action] = (summary.byAction[log.action] || 0) + 1;
  });
  
  return summary;
};

// ==================== PREVENT OVERWRITE MODEL ERROR ====================
module.exports = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);