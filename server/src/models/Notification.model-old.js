// const mongoose = require('mongoose');

// const notificationSchema = new mongoose.Schema(
//   {
//     // Recipient
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       index: true,
//     },
    
//     // Notification Content
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     body: {
//       type: String,
//       required: true,
//     },
    
//     // Notification Type
//     type: {
//       type: String,
//       enum: [
//         'task',           // Task assigned, updated, completed
//         'complaint',      // Complaint raised, assigned, resolved
//         'attendance',     // Check-in/out, leave request
//         'salary',         // Salary generated, approved, paid
//         'payment',        // Payment received, invoice generated
//         'approval',       // Leave approval, expense approval
//         'reminder',       // Task reminder, SLA reminder
//         'alert',          // Emergency alert, SLA breach
//         'system',         // System notifications
//         'chat',           // New message
//         'maintenance',    // PPM reminders
//         'inspection'      // Inspection scheduled, completed
//       ],
//       required: true,
//       index: true,
//     },
    
//     // Priority Levels
//     priority: {
//       type: String,
//       enum: ['low', 'medium', 'high', 'urgent'],
//       default: 'medium',
//     },
    
//     // Reference to related document
//     referenceId: {
//       type: mongoose.Schema.Types.ObjectId,
//       refPath: 'referenceModel',
//     },
//     referenceModel: {
//       type: String,
//       enum: [
//         'Task',
//         'Complaint',
//         'Leave',
//         'Salary',
//         'Invoice',
//         'Payment',
//         'Attendance',
//         'User',
//         'PPM_Schedule',
//         'Inspection'
//       ],
//     },
    
//     // Additional Data
//     data: {
//       type: mongoose.Schema.Types.Mixed,
//       default: {},
//     },
    
//     // Read Status
//     isRead: {
//       type: Boolean,
//       default: false,
//       index: true,
//     },
//     readAt: {
//       type: Date,
//     },
    
//     // Delivery Status
//     isDelivered: {
//       type: Boolean,
//       default: false,
//     },
//     deliveredAt: {
//       type: Date,
//     },
    
//     // Delivery Channels
//     channels: [{
//       type: String,
//       enum: ['inapp', 'push', 'email', 'sms'],
//     }],
    
//     // Expiry
//     expiresAt: {
//       type: Date,
//       default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
//     },
    
//     // Metadata
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//       index: true,
//     },
//     updatedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // ==================== INDEXES ====================
// notificationSchema.index({ userId: 1, isRead: 1 });
// notificationSchema.index({ userId: 1, createdAt: -1 });
// notificationSchema.index({ type: 1, createdAt: -1 });
// notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// // ==================== PRE-SAVE MIDDLEWARE ====================
// notificationSchema.pre('save', function(next) {
//   this.updatedAt = new Date();
//   next();
// });

// // ==================== VIRTUAL PROPERTIES ====================
// notificationSchema.virtual('timeAgo').get(function() {
//   const seconds = Math.floor((Date.now() - this.createdAt) / 1000);
  
//   if (seconds < 60) return `${seconds} seconds ago`;
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//   const days = Math.floor(hours / 24);
//   if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
//   const weeks = Math.floor(days / 7);
//   if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
//   const months = Math.floor(days / 30);
//   return `${months} month${months > 1 ? 's' : ''} ago`;
// });

// // ==================== INSTANCE METHODS ====================

// /**
//  * Mark notification as read
//  */
// notificationSchema.methods.markAsRead = async function() {
//   if (!this.isRead) {
//     this.isRead = true;
//     this.readAt = new Date();
//     await this.save();
//   }
//   return this;
// };

// /**
//  * Mark notification as delivered
//  */
// notificationSchema.methods.markAsDelivered = async function(channel = 'inapp') {
//   if (!this.channels.includes(channel)) {
//     this.channels.push(channel);
//   }
//   this.isDelivered = true;
//   this.deliveredAt = new Date();
//   await this.save();
//   return this;
// };

// // ==================== STATIC METHODS ====================

// /**
//  * Get unread count for a user
//  * @param {string} userId - User ID
//  * @returns {Promise<number>}
//  */
// notificationSchema.statics.getUnreadCount = async function(userId) {
//   return await this.countDocuments({ userId, isRead: false, expiresAt: { $gt: new Date() } });
// };

// /**
//  * Get notifications for a user with pagination
//  * @param {string} userId - User ID
//  * @param {Object} options - Pagination options
//  * @returns {Promise<Object>}
//  */
// notificationSchema.statics.getUserNotifications = async function(userId, { page = 1, limit = 20, type = null }) {
//   const query = { userId, expiresAt: { $gt: new Date() } };
//   if (type) query.type = type;
  
//   const skip = (page - 1) * limit;
  
//   const [notifications, total] = await Promise.all([
//     this.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate('createdBy', 'firstName lastName'),
//     this.countDocuments(query)
//   ]);
  
//   return {
//     notifications,
//     pagination: {
//       page,
//       limit,
//       total,
//       pages: Math.ceil(total / limit)
//     }
//   };
// };

// /**
//  * Mark all notifications as read for a user
//  * @param {string} userId - User ID
//  * @returns {Promise<Object>}
//  */
// notificationSchema.statics.markAllAsRead = async function(userId) {
//   const result = await this.updateMany(
//     { userId, isRead: false },
//     { isRead: true, readAt: new Date() }
//   );
//   return result;
// };

// /**
//  * Delete old notifications (called by cron job)
//  * @param {number} daysOld - Days to keep (default: 30)
//  * @returns {Promise<Object>}
//  */
// notificationSchema.statics.deleteOldNotifications = async function(daysOld = 30) {
//   const cutoffDate = new Date();
//   cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
//   const result = await this.deleteMany({
//     createdAt: { $lt: cutoffDate },
//     isRead: true
//   });
  
//   return result;
// };

// /**
//  * Create notification for multiple users (bulk)
//  * @param {Array} userIds - Array of user IDs
//  * @param {Object} notificationData - Notification data
//  * @returns {Promise<Array>}
//  */
// notificationSchema.statics.createBulk = async function(userIds, notificationData) {
//   const notifications = userIds.map(userId => ({
//     userId,
//     ...notificationData,
//     createdAt: new Date()
//   }));
  
//   return await this.insertMany(notifications);
// };

// /**
//  * Get notification statistics
//  * @param {string} userId - User ID
//  * @returns {Promise<Object>}
//  */
// notificationSchema.statics.getStats = async function(userId) {
//   const [total, unread, byType] = await Promise.all([
//     this.countDocuments({ userId }),
//     this.countDocuments({ userId, isRead: false }),
//     this.aggregate([
//       { $match: { userId } },
//       { $group: { _id: '$type', count: { $sum: 1 } } }
//     ])
//   ]);
  
//   const typeStats = {};
//   byType.forEach(t => { typeStats[t._id] = t.count; });
  
//   return { total, unread, byType: typeStats };
// };

// // ==================== HELPER FUNCTION TO CREATE NOTIFICATION ====================
// /**
//  * Create and send notification (can be used from other controllers)
//  * @param {Object} params - Notification parameters
//  * @returns {Promise<Object>}
//  */
// const createNotification = async ({
//   userId,
//   title,
//   body,
//   type,
//   priority = 'medium',
//   referenceId = null,
//   referenceModel = null,
//   data = {},
//   channels = ['inapp'],
//   createdBy = null
// }) => {
//   try {
//     const notification = new Notification({
//       userId,
//       title,
//       body,
//       type,
//       priority,
//       referenceId,
//       referenceModel,
//       data,
//       channels,
//       createdBy
//     });
    
//     await notification.save();
//     return notification;
//   } catch (error) {
//     console.error('Create notification error:', error);
//     return null;
//   }
// };

// // ==================== PREVENT OVERWRITE MODEL ERROR ====================
// const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

// // Attach helper function to model
// Notification.createNotification = createNotification;

// module.exports = Notification;




// server/src/models/Notification.model.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // Recipient
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    
    // Notification Content
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    
    // Notification Type
    type: {
      type: String,
      enum: [
        'task',           // Task assigned, updated, completed
        'complaint',      // Complaint raised, assigned, resolved
        'attendance',     // Check-in/out, leave request
        'leave',          // Leave request status (🔴 ADDED)
        'salary',         // Salary generated, approved, paid
        'payment',        // Payment received, invoice generated
        'approval',       // Leave approval, expense approval
        'reminder',       // Task reminder, SLA reminder
        'alert',          // Emergency alert, SLA breach
        'system',         // System notifications
        'chat',           // New message
        'maintenance',    // PPM reminders
        'inspection',     // Inspection scheduled, completed
        'announcement'    // Company announcements (🔴 ADDED)
      ],
      required: true,
      index: true,
    },
    
    // Priority Levels
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    
    // Reference to related document
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'referenceModel',
    },
    referenceModel: {
      type: String,
      enum: [
        'Task',
        'Complaint',
        'Leave',
        'Salary',
        'Invoice',
        'Payment',
        'Attendance',
        'User',
        'PPM_Schedule',
        'Inspection'
      ],
    },
    
    // Additional Data
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    
    // Read Status
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
    
    // Delivery Status
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    
    // Delivery Channels
    channels: [{
      type: String,
      enum: ['inapp', 'push', 'email', 'sms'],
    }],
    
    // 🔴 NEW: Who created this notification (for admin tracking)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdByRole: {
      type: String,
    },
    
    // 🔴 NEW: Action URL (where to navigate when clicked)
    actionUrl: {
      type: String,
      default: null,
    },
    
    // 🔴 NEW: Icon for UI (auto-set based on type)
    icon: {
      type: String,
      default: null,
    },
    
    // 🔴 NEW: Color for UI (auto-set based on type)
    color: {
      type: String,
      default: null,
    },
    
    // Expiry
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ==================== INDEXES ====================
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
notificationSchema.index({ createdBy: 1 }); // 🔴 NEW
notificationSchema.index({ referenceId: 1, referenceModel: 1 }); // 🔴 NEW

// ==================== PRE-SAVE MIDDLEWARE ====================
notificationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // 🔴 NEW: Auto-set icon and color based on type
  if (!this.icon) {
    const icons = {
      task: '📋',
      complaint: '⚠️',
      attendance: '⏰',
      leave: '🏖️',
      salary: '💰',
      payment: '💳',
      approval: '✓',
      reminder: '🔔',
      alert: '🚨',
      system: '⚙️',
      chat: '💬',
      maintenance: '🔧',
      inspection: '🔍',
      announcement: '📢'
    };
    this.icon = icons[this.type] || '📢';
  }
  
  if (!this.color) {
    const colors = {
      task: '#3B82F6',
      complaint: '#EF4444',
      attendance: '#10B981',
      leave: '#F59E0B',
      salary: '#8B5CF6',
      payment: '#10B981',
      approval: '#10B981',
      reminder: '#F59E0B',
      alert: '#EF4444',
      system: '#6B7280',
      chat: '#06B6D4',
      maintenance: '#F59E0B',
      inspection: '#8B5CF6',
      announcement: '#8B5CF6'
    };
    this.color = colors[this.type] || '#6B7280';
  }
  
  next();
});

// ==================== VIRTUAL PROPERTIES ====================
notificationSchema.virtual('timeAgo').get(function() {
  const seconds = Math.floor((Date.now() - this.createdAt) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
});

// 🔴 NEW: Formatted date virtual
notificationSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleString();
});

// ==================== INSTANCE METHODS ====================

/**
 * Mark notification as read
 */
notificationSchema.methods.markAsRead = async function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

/**
 * Mark notification as delivered
 */
notificationSchema.methods.markAsDelivered = async function(channel = 'inapp') {
  if (!this.channels.includes(channel)) {
    this.channels.push(channel);
  }
  this.isDelivered = true;
  this.deliveredAt = new Date();
  await this.save();
  return this;
};

// ==================== STATIC METHODS ====================

/**
 * Get unread count for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>}
 */
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({ userId, isRead: false, expiresAt: { $gt: new Date() } });
};

/**
 * Get notifications for a user with pagination
 * @param {string} userId - User ID
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>}
 */
notificationSchema.statics.getUserNotifications = async function(userId, { page = 1, limit = 20, type = null }) {
  const query = { userId, expiresAt: { $gt: new Date() } };
  if (type && type !== 'all') query.type = type;
  
  const skip = (page - 1) * limit;
  
  const [notifications, total] = await Promise.all([
    this.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'firstName lastName'),
    this.countDocuments(query)
  ]);
  
  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>}
 */
notificationSchema.statics.markAllAsRead = async function(userId) {
  const result = await this.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  return result;
};

/**
 * Delete old notifications (called by cron job)
 * @param {number} daysOld - Days to keep (default: 30)
 * @returns {Promise<Object>}
 */
notificationSchema.statics.deleteOldNotifications = async function(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const result = await this.deleteMany({
    createdAt: { $lt: cutoffDate },
    isRead: true
  });
  
  return result;
};

/**
 * Create notification for multiple users (bulk)
 * @param {Array} userIds - Array of user IDs
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Array>}
 */
notificationSchema.statics.createBulk = async function(userIds, notificationData) {
  const notifications = userIds.map(userId => ({
    userId,
    ...notificationData,
    createdAt: new Date()
  }));
  
  return await this.insertMany(notifications);
};

/**
 * Get notification statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>}
 */
notificationSchema.statics.getStats = async function(userId) {
  const [total, unread, byType] = await Promise.all([
    this.countDocuments({ userId }),
    this.countDocuments({ userId, isRead: false }),
    this.aggregate([
      { $match: { userId } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ])
  ]);
  
  const typeStats = {};
  byType.forEach(t => { typeStats[t._id] = t.count; });
  
  return { total, unread, byType: typeStats };
};

// 🔴 NEW: Get notifications by type for a user
notificationSchema.statics.getByType = async function(userId, type, limit = 10) {
  return await this.find({ userId, type, isRead: false })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// 🔴 NEW: Clean up expired notifications
notificationSchema.statics.cleanExpired = async function() {
  const result = await this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
  return result;
};

// ==================== HELPER FUNCTION TO CREATE NOTIFICATION ====================
/**
 * Create and send notification (can be used from other controllers)
 * @param {Object} params - Notification parameters
 * @returns {Promise<Object>}
 */
const createNotification = async ({
  userId,
  title,
  body,
  type,
  priority = 'medium',
  referenceId = null,
  referenceModel = null,
  data = {},
  channels = ['inapp'],
  createdBy = null,
  createdByRole = null,
  actionUrl = null
}) => {
  try {
    const notification = new Notification({
      userId,
      title,
      body,
      type,
      priority,
      referenceId,
      referenceModel,
      data,
      channels,
      createdBy,
      createdByRole,
      actionUrl
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    return null;
  }
};

// ==================== PREVENT OVERWRITE MODEL ERROR ====================
const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

// Attach helper function to model
Notification.createNotification = createNotification;

module.exports = Notification;