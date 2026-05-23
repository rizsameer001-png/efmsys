// // server/src/models/Message.model.js
// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//   chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
//   senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   senderName: { type: String, required: true },
//   senderRole: { type: String },
//   message: { type: String, trim: true },
//   messageType: {
//     type: String,
//     enum: ['text', 'image', 'file', 'location', 'voice'],
//     default: 'text'
//   },
  
//   // Attachments
//   attachments: [{
//     url: { type: String },
//     fileName: { type: String },
//     fileSize: { type: Number },
//     mimeType: { type: String },
//     fileType: { type: String, enum: ['image', 'pdf', 'document', 'voice'] }
//   }],
  
//   // Location sharing
//   location: {
//     lat: { type: Number },
//     lng: { type: Number },
//     address: { type: String }
//   },
  
//   // Message status
//   status: {
//     type: String,
//     enum: ['sending', 'sent', 'delivered', 'read', 'failed'],
//     default: 'sent'
//   },
  
//   // Read receipts per user
//   readBy: [{
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     readAt: { type: Date, default: Date.now }
//   }],
  
//   deliveredTo: [{
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     deliveredAt: { type: Date, default: Date.now }
//   }],
  
//   // Reply to message
//   replyTo: {
//     messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
//     message: { type: String },
//     senderName: { type: String }
//   },
  
//   isEdited: { type: Boolean, default: false },
//   editedAt: { type: Date },
//   isDeleted: { type: Boolean, default: false },
//   deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
//   createdAt: { type: Date, default: Date.now }
// }, { timestamps: true });

// // Indexes for performance
// messageSchema.index({ chatId: 1, createdAt: -1 });
// messageSchema.index({ senderId: 1 });
// messageSchema.index({ status: 1 });

// const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
// module.exports = Message;





const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Chat', 
    required: true, 
    index: true 
  },
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  senderName: { 
    type: String, 
    required: true 
  },
  senderRole: { 
    type: String,
    enum: ['customer', 'technician', 'supervisor', 'manager', 'admin', 'super_admin', 'hr', 'employee'],
    default: 'user'
  },
  message: { 
    type: String, 
    trim: true,
    maxlength: 5000  // Max message length
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'location', 'voice', 'video', 'document'],
    default: 'text'
  },
  
  // ==================== ATTACHMENTS ====================
  attachments: [{
    url: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    fileType: { 
      type: String, 
      enum: ['image', 'pdf', 'document', 'voice', 'video', 'archive', 'other'],
      default: 'other'
    },
    thumbnail: { type: String }, // URL for image/video thumbnail
    duration: { type: Number }, // For voice/video messages (seconds)
    width: { type: Number }, // For images
    height: { type: Number }, // For images
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // ==================== LOCATION SHARING ====================
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String, trim: true },
    placeId: { type: String },
    accuracy: { type: Number } // GPS accuracy in meters
  },
  
  // ==================== VOICE MESSAGE ====================
  voiceMessage: {
    url: { type: String },
    duration: { type: Number }, // in seconds
    waveform: [{ type: Number }], // Audio waveform data
    transcribed: { type: String }, // Transcribed text
    transcribedAt: { type: Date }
  },
  
  // ==================== MESSAGE STATUS ====================
  status: {
    type: String,
    enum: ['sending', 'sent', 'delivered', 'read', 'failed', 'recalled'],
    default: 'sent',
    index: true
  },
  
  // ==================== READ RECEIPTS ====================
  readBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now },
    deviceInfo: { type: String } // Device information
  }],
  
  deliveredTo: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveredAt: { type: Date, default: Date.now },
    deviceInfo: { type: String }
  }],
  
  // ==================== REPLY TO MESSAGE ====================
  replyTo: {
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    message: { type: String },
    senderName: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messageType: { type: String },
    attachment: { type: String } // Attachment preview
  },
  
  // ==================== EDITING ====================
  isEdited: { 
    type: Boolean, 
    default: false 
  },
  editedAt: { 
    type: Date 
  },
  editHistory: [{
    message: { type: String },
    editedAt: { type: Date, default: Date.now },
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // ==================== DELETION (Self-delete for users) ====================
  isDeleted: { 
    type: Boolean, 
    default: false,
    index: true 
  },
  deletedFor: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }], // Users who deleted this message (soft delete for them)
  deletedAt: { 
    type: Date 
  },
  deletedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  // ==================== EXPIRY / AUTO-DELETION ====================
  expiryEnabled: { 
    type: Boolean, 
    default: false 
  },
  expiryDuration: { 
    type: String, 
    enum: ['1h', '6h', '12h', '24h', '3d', '7d', '30d'],
    default: '24h'
  },
  expiresAt: { 
    type: Date,
    index: true 
  },
  isExpired: { 
    type: Boolean, 
    default: false 
  },
  expiredAt: { 
    type: Date 
  },
  
  // ==================== MESSAGE FLAGS ====================
  isImportant: { 
    type: Boolean, 
    default: false 
  },
  isStarred: { 
    type: Boolean, 
    default: false 
  },
  isPinned: { 
    type: Boolean, 
    default: false 
  },
  pinnedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  pinnedAt: { 
    type: Date 
  },
  
  // ==================== FORWARDING ====================
  forwardedFrom: {
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    senderName: { type: String }
  },
  forwardedCount: { 
    type: Number, 
    default: 0 
  },
  
  // ==================== REACTIONS ====================
  reactions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reaction: { 
      type: String,
      enum: ['👍', '👎', '❤️', '😂', '😮', '😢', '😡', '🎉', '🙏'],
      default: '👍'
    },
    reactedAt: { type: Date, default: Date.now }
  }],
  
  // ==================== MENTIONS ====================
  mentions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    position: { type: Number } // Position in message text
  }],
  
  // ==================== METADATA ====================
  metadata: {
    ipAddress: { type: String },
    userAgent: { type: String },
    clientId: { type: String },
    platform: { type: String, enum: ['web', 'mobile', 'desktop'] }
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES FOR PERFORMANCE ====================
// Chat message retrieval
messageSchema.index({ chatId: 1, createdAt: -1 });
// User messages
messageSchema.index({ senderId: 1, createdAt: -1 });
// Status queries
messageSchema.index({ status: 1, createdAt: -1 });
// Expiry cleanup
messageSchema.index({ expiresAt: 1, isExpired: 1 });
// Deletion queries
messageSchema.index({ isDeleted: 1, deletedAt: 1 });
// Reactions and mentions
messageSchema.index({ 'reactions.userId': 1 });
messageSchema.index({ 'mentions.userId': 1 });

// ==================== VIRTUAL FIELDS ====================

// Virtual for formatted message type
messageSchema.virtual('messageTypeDisplay').get(function() {
  const types = {
    text: '💬 Text',
    image: '🖼️ Image',
    file: '📎 File',
    location: '📍 Location',
    voice: '🎤 Voice',
    video: '🎥 Video',
    document: '📄 Document'
  };
  return types[this.messageType] || '💬 Message';
});

// Virtual for expiry duration display
messageSchema.virtual('expiryDurationDisplay').get(function() {
  const durations = {
    '1h': '1 hour',
    '6h': '6 hours',
    '12h': '12 hours',
    '24h': '24 hours',
    '3d': '3 days',
    '7d': '7 days',
    '30d': '30 days'
  };
  return durations[this.expiryDuration] || 'Never';
});

// ==================== PRE-SAVE MIDDLEWARE ====================

// Set expiresAt based on expiryDuration
messageSchema.pre('save', function(next) {
  if (this.expiryEnabled && this.expiryDuration) {
    const durationMap = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '12h': 12 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '3d': 3 * 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    this.expiresAt = new Date(Date.now() + (durationMap[this.expiryDuration] || 24 * 60 * 60 * 1000));
  }
  next();
});

// Update updatedAt on save
messageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// ==================== INSTANCE METHODS ====================

// Mark message as read by user
messageSchema.methods.markAsRead = async function(userId, deviceInfo = null) {
  if (!this.readBy.some(r => r.userId.toString() === userId.toString())) {
    this.readBy.push({ userId, readAt: new Date(), deviceInfo });
    this.status = 'read';
    await this.save();
    return true;
  }
  return false;
};

// Mark message as delivered to user
messageSchema.methods.markAsDelivered = async function(userId, deviceInfo = null) {
  if (!this.deliveredTo.some(d => d.userId.toString() === userId.toString())) {
    this.deliveredTo.push({ userId, deliveredAt: new Date(), deviceInfo });
    if (this.status === 'sent') {
      this.status = 'delivered';
    }
    await this.save();
    return true;
  }
  return false;
};

// Soft delete for specific user
messageSchema.methods.softDeleteForUser = async function(userId) {
  if (!this.deletedFor.some(id => id.toString() === userId.toString())) {
    this.deletedFor.push(userId);
    await this.save();
    return true;
  }
  return false;
};

// Hard delete (admin only)
messageSchema.methods.hardDelete = async function(userId, userRole) {
  if (userRole === 'super_admin' || userRole === 'admin') {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = userId;
    await this.save();
    return true;
  }
  return false;
};

// Add reaction to message
messageSchema.methods.addReaction = async function(userId, reaction) {
  const existingReaction = this.reactions.find(r => r.userId.toString() === userId.toString());
  if (existingReaction) {
    existingReaction.reaction = reaction;
    existingReaction.reactedAt = new Date();
  } else {
    this.reactions.push({ userId, reaction, reactedAt: new Date() });
  }
  await this.save();
  return this.reactions;
};

// Remove reaction from message
messageSchema.methods.removeReaction = async function(userId) {
  this.reactions = this.reactions.filter(r => r.userId.toString() !== userId.toString());
  await this.save();
  return this.reactions;
};

// Edit message content
messageSchema.methods.editMessage = async function(userId, newMessage) {
  if (this.senderId.toString() !== userId.toString()) {
    throw new Error('Only message sender can edit');
  }
  
  this.editHistory.push({
    message: this.message,
    editedAt: new Date(),
    editedBy: userId
  });
  
  this.message = newMessage;
  this.isEdited = true;
  this.editedAt = new Date();
  await this.save();
  
  return this;
};

// Recall message (delete for everyone)
messageSchema.methods.recallMessage = async function(userId, userRole) {
  const canRecall = (this.senderId.toString() === userId.toString()) || 
                     userRole === 'admin' || 
                     userRole === 'super_admin';
  
  if (!canRecall) {
    throw new Error('Unauthorized to recall this message');
  }
  
  this.status = 'recalled';
  this.message = 'This message was recalled';
  this.isEdited = true;
  this.editedAt = new Date();
  await this.save();
  
  return this;
};

// Check if message is expired
messageSchema.methods.isMessageExpired = function() {
  if (!this.expiryEnabled || !this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Mark as expired
messageSchema.methods.markAsExpired = async function() {
  if (this.isMessageExpired() && !this.isExpired) {
    this.isExpired = true;
    this.expiredAt = new Date();
    this.isDeleted = true;
    this.deletedAt = new Date();
    await this.save();
    return true;
  }
  return false;
};

// ==================== STATIC METHODS ====================

// Get messages for a chat with pagination
messageSchema.statics.getChatMessages = async function(chatId, userId, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  const messages = await this.find({
    chatId,
    isDeleted: false,
    deletedFor: { $ne: userId }
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('senderId', 'firstName lastName email role profileImage')
    .populate('replyTo.messageId')
    .populate('reactions.userId', 'firstName lastName');
  
  const total = await this.countDocuments({
    chatId,
    isDeleted: false,
    deletedFor: { $ne: userId }
  });
  
  return {
    messages: messages.reverse(),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Get unread messages for user
messageSchema.statics.getUnreadMessages = async function(userId) {
  return await this.find({
    'readBy.userId': { $ne: userId },
    'deletedFor': { $ne: userId },
    isDeleted: false
  })
    .populate('chatId', 'chatType groupName participants')
    .populate('senderId', 'firstName lastName email');
};

// Clean up expired messages (run via cron job)
messageSchema.statics.cleanupExpiredMessages = async function() {
  const now = new Date();
  const expiredMessages = await this.find({
    expiryEnabled: true,
    expiresAt: { $lte: now },
    isExpired: false,
    isDeleted: false
  });
  
  for (const message of expiredMessages) {
    await message.markAsExpired();
  }
  
  return expiredMessages.length;
};

// Get messages by date range
messageSchema.statics.getMessagesByDateRange = async function(chatId, startDate, endDate) {
  const query = { chatId, isDeleted: false };
  if (startDate) query.createdAt = { $gte: startDate };
  if (endDate) query.createdAt = { ...query.createdAt, $lte: endDate };
  
  return await this.find(query)
    .sort({ createdAt: 1 })
    .populate('senderId', 'firstName lastName email role');
};

// Search messages
messageSchema.statics.searchMessages = async function(chatId, searchTerm, userId, limit = 50) {
  return await this.find({
    chatId,
    message: { $regex: searchTerm, $options: 'i' },
    isDeleted: false,
    deletedFor: { $ne: userId }
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('senderId', 'firstName lastName email');
};

// Get message statistics
messageSchema.statics.getStatistics = async function(chatId) {
  const stats = await this.aggregate([
    { $match: { chatId: mongoose.Types.ObjectId(chatId), isDeleted: false } },
    { $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        totalAttachments: { $sum: { $size: '$attachments' } },
        uniqueSenders: { $addToSet: '$senderId' },
        messagesByType: { $push: '$messageType' }
      }
    }
  ]);
  
  if (stats.length === 0) return null;
  
  const result = stats[0];
  const typeCount = {};
  result.messagesByType.forEach(type => {
    typeCount[type] = (typeCount[type] || 0) + 1;
  });
  
  return {
    totalMessages: result.totalMessages,
    totalAttachments: result.totalAttachments,
    uniqueSenders: result.uniqueSenders.length,
    messagesByType: typeCount,
    averageMessagesPerDay: result.totalMessages / Math.ceil((new Date() - new Date(result.firstMessage)) / (1000 * 60 * 60 * 24))
  };
};

// ==================== COMPOUND INDEXES ====================
messageSchema.index({ chatId: 1, createdAt: -1, isDeleted: 1 });
messageSchema.index({ senderId: 1, createdAt: -1, isDeleted: 1 });
messageSchema.index({ expiresAt: 1, isExpired: 1, isDeleted: 1 });
messageSchema.index({ 'mentions.userId': 1, createdAt: -1 });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
module.exports = Message;