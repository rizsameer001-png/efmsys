// // server/src/models/Chat.model.js
// const mongoose = require('mongoose');

// const chatSchema = new mongoose.Schema({
//   // Chat participants
//   participants: [{
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     role: { type: String },
//     name: { type: String },
//     joinedAt: { type: Date, default: Date.now },
//     leftAt: { type: Date },
//     isActive: { type: Boolean, default: true }
//   }],
  
//   // Chat type
//   chatType: {
//     type: String,
//     enum: ['direct', 'group', 'ticket'],
//     default: 'direct'
//   },
  
//   // For ticket-based chat
//   ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
//   taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
//   workOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder' },
  
//   // For group chat
//   groupName: { type: String },
//   groupDescription: { type: String },
//   groupIcon: { type: String },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
//   // Chat settings
//   isActive: { type: Boolean, default: true },
//   isArchived: { type: Boolean, default: false },
//   lastMessage: {
//     message: { type: String },
//     senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     senderName: { type: String },
//     timestamp: { type: Date, default: Date.now }
//   },
  
//   // Unread counts per participant
//   unreadCounts: [{
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     count: { type: Number, default: 0 }
//   }],
  
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// }, { timestamps: true });

// // Indexes
// chatSchema.index({ participants: 1 });
// chatSchema.index({ ticketId: 1 });
// chatSchema.index({ chatType: 1 });
// chatSchema.index({ updatedAt: -1 });

// const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
// module.exports = Chat;







const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  // ==================== CHAT PARTICIPANTS ====================
  participants: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    role: { 
      type: String,
      enum: ['customer', 'technician', 'supervisor', 'manager', 'admin', 'super_admin', 'hr', 'employee'],
      default: 'user'
    },
    name: { 
      type: String,
      required: true 
    },
    joinedAt: { 
      type: Date, 
      default: Date.now 
    },
    leftAt: { 
      type: Date 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    lastSeen: { 
      type: Date,
      default: Date.now 
    },
    isTyping: { 
      type: Boolean, 
      default: false 
    },
    typingAt: { 
      type: Date 
    }
  }],
  
  // ==================== CHAT TYPE ====================
  chatType: {
    type: String,
    enum: ['direct', 'group', 'ticket'],
    default: 'direct',
    index: true
  },
  
  // ==================== TICKET-BASED CHAT ====================
  ticketId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Complaint',
    index: true 
  },
  taskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task',
    index: true 
  },
  workOrderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'WorkOrder',
    index: true 
  },
  ticketSubject: { 
    type: String,
    trim: true
  },
  ticketType: {
    type: String,
    enum: ['complaint', 'task', 'support', 'maintenance'],
    default: 'support'
  },
  ticketStatus: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  
  // ==================== GROUP CHAT ====================
  groupName: { 
    type: String,
    trim: true
  },
  groupDescription: { 
    type: String,
    trim: true,
    maxlength: 500
  },
  groupIcon: { 
    type: String 
  },
  groupBanner: { 
    type: String 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  
  // ==================== GROUP ADMINISTRATION ====================
  groupAdmins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  groupSettings: {
    allowAddParticipants: { type: Boolean, default: true },
    allowRemoveParticipants: { type: Boolean, default: true },
    allowChangeGroupInfo: { type: Boolean, default: true },
    onlyAdminsCanSend: { type: Boolean, default: false },
    joinRequests: { type: Boolean, default: true }
  },
  
  // ==================== CHAT SETTINGS ====================
  isActive: { 
    type: Boolean, 
    default: true,
    index: true 
  },
  isArchived: { 
    type: Boolean, 
    default: false 
  },
  isMuted: { 
    type: Boolean, 
    default: false 
  },
  mutedBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mutedAt: { type: Date, default: Date.now },
    until: { type: Date } // Optional unmute date
  }],
  
  // ==================== MESSAGE SETTINGS ====================
  lastMessage: {
    message: { type: String, trim: true },
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: { type: String },
    messageType: { 
      type: String,
      enum: ['text', 'image', 'file', 'location', 'voice', 'video']
    },
    timestamp: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
  },
  
  // ==================== UNREAD COUNTS ====================
  unreadCounts: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    count: { type: Number, default: 0 },
    lastReadAt: { type: Date, default: Date.now },
    lastMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
  }],
  
  // ==================== MESSAGE EXPIRY (Chat Level) ====================
  messageExpiry: {
    enabled: { type: Boolean, default: false },
    duration: { 
      type: String, 
      enum: ['1h', '6h', '12h', '24h', '3d', '7d', '30d', 'never'],
      default: 'never'
    },
    appliedAt: { type: Date },
    appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // ==================== PINNED MESSAGES ====================
  pinnedMessages: [{
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    pinnedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pinnedAt: { type: Date, default: Date.now },
    message: { type: String },
    senderName: { type: String }
  }],
  
  // ==================== STARRED MESSAGES (Per User) ====================
  starredMessages: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    starredAt: { type: Date, default: Date.now }
  }],
  
  // ==================== TYPING INDICATORS ====================
  typingUsers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 3000) } // 3 second expiry
  }],
  
  // ==================== MENTIONS ====================
  mentions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    message: { type: String },
    mentionedAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  }],
  
  // ==================== ATTACHMENTS SUMMARY ====================
  attachments: {
    total: { type: Number, default: 0 },
    images: { type: Number, default: 0 },
    files: { type: Number, default: 0 },
    voice: { type: Number, default: 0 },
    videos: { type: Number, default: 0 }
  },
  
  // ==================== METADATA ====================
  metadata: {
    totalMessages: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now },
    category: { type: String },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    tags: [{ type: String }]
  },
  
  updatedAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES FOR PERFORMANCE ====================
// Participant queries
chatSchema.index({ 'participants.userId': 1, isActive: 1 });
chatSchema.index({ 'participants.userId': 1, updatedAt: -1 });
// Ticket/Work order queries
chatSchema.index({ ticketId: 1, chatType: 'ticket' });
chatSchema.index({ taskId: 1, chatType: 'ticket' });
chatSchema.index({ workOrderId: 1 });
// Group chat queries
chatSchema.index({ chatType: 1, groupName: 1 });
chatSchema.index({ createdBy: 1, chatType: 'group' });
// Unread counts
chatSchema.index({ 'unreadCounts.userId': 1, 'unreadCounts.count': -1 });
// Mentions
chatSchema.index({ 'mentions.userId': 1, 'mentions.isRead': 1 });
// Expiry
chatSchema.index({ 'messageExpiry.enabled': 1, updatedAt: 1 });
// Archived chats
chatSchema.index({ isArchived: 1, updatedAt: -1 });

// ==================== COMPOUND INDEXES ====================
chatSchema.index({ chatType: 1, isActive: 1, updatedAt: -1 });
chatSchema.index({ 'participants.userId': 1, chatType: 1, updatedAt: -1 });

// ==================== VIRTUAL FIELDS ====================

// Get participant count
chatSchema.virtual('participantCount').get(function() {
  return this.participants.filter(p => p.isActive).length;
});

// Get active participants
chatSchema.virtual('activeParticipants').get(function() {
  return this.participants.filter(p => p.isActive);
});

// Get chat display name
chatSchema.virtual('displayName').get(function() {
  if (this.chatType === 'group') {
    return this.groupName;
  } else if (this.chatType === 'ticket') {
    return `Ticket: ${this.ticketSubject || this.ticketId}`;
  } else {
    // For direct chats, return other participant's name
    // This should be populated or set separately
    return 'Direct Chat';
  }
});

// Check if chat has unread messages for user
chatSchema.virtual('hasUnread').get(function() {
  return this.unreadCounts.some(u => u.count > 0);
});

// ==================== PRE-SAVE MIDDLEWARE ====================

// Update timestamps
chatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Update message expiry settings for all messages when changed
chatSchema.pre('save', async function(next) {
  if (this.isModified('messageExpiry.enabled') || this.isModified('messageExpiry.duration')) {
    const Message = mongoose.model('Message');
    if (this.messageExpiry.enabled && this.messageExpiry.duration !== 'never') {
      // Apply expiry to future messages only
      // This will be handled when creating new messages
    }
  }
  next();
});

// ==================== INSTANCE METHODS ====================

// Add participant to chat
chatSchema.methods.addParticipant = async function(userId, userRole, userName) {
  const existing = this.participants.find(p => p.userId.toString() === userId.toString());
  if (existing) {
    if (!existing.isActive) {
      existing.isActive = true;
      existing.leftAt = null;
      existing.joinedAt = new Date();
    }
    return this;
  }
  
  this.participants.push({
    userId,
    role: userRole,
    name: userName,
    joinedAt: new Date(),
    isActive: true
  });
  
  this.unreadCounts.push({ userId, count: 0 });
  
  return await this.save();
};

// Remove participant from chat
chatSchema.methods.removeParticipant = async function(userId) {
  const participant = this.participants.find(p => p.userId.toString() === userId.toString());
  if (participant) {
    participant.isActive = false;
    participant.leftAt = new Date();
  }
  
  return await this.save();
};

// Update last message
chatSchema.methods.updateLastMessage = async function(message) {
  this.lastMessage = {
    message: message.message,
    messageId: message._id,
    senderId: message.senderId,
    senderName: message.senderName,
    messageType: message.messageType,
    timestamp: message.createdAt,
    isDeleted: false
  };
  
  this.metadata.lastActivity = new Date();
  this.metadata.totalMessages = (this.metadata.totalMessages || 0) + 1;
  
  return await this.save();
};

// Increment unread count for participants except sender
chatSchema.methods.incrementUnreadCount = async function(excludeUserId) {
  for (const unread of this.unreadCounts) {
    if (unread.userId.toString() !== excludeUserId.toString()) {
      unread.count += 1;
    }
  }
  return await this.save();
};

// Reset unread count for user
chatSchema.methods.resetUnreadCount = async function(userId, lastMessageId = null) {
  const unread = this.unreadCounts.find(u => u.userId.toString() === userId.toString());
  if (unread) {
    unread.count = 0;
    unread.lastReadAt = new Date();
    if (lastMessageId) {
      unread.lastMessageId = lastMessageId;
    }
  }
  return await this.save();
};

// Add typing indicator
chatSchema.methods.addTypingUser = async function(userId, userName) {
  // Remove existing typing entry for this user
  this.typingUsers = this.typingUsers.filter(t => t.userId.toString() !== userId.toString());
  
  // Add new typing indicator
  this.typingUsers.push({
    userId,
    userName,
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + 3000)
  });
  
  // Clean up expired typing indicators
  this.typingUsers = this.typingUsers.filter(t => t.expiresAt > new Date());
  
  return await this.save();
};

// Remove typing indicator
chatSchema.methods.removeTypingUser = async function(userId) {
  this.typingUsers = this.typingUsers.filter(t => t.userId.toString() !== userId.toString());
  return await this.save();
};

// Pin message
chatSchema.methods.pinMessage = async function(messageId, userId, message, senderName) {
  const existing = this.pinnedMessages.find(p => p.messageId.toString() === messageId.toString());
  if (!existing) {
    this.pinnedMessages.unshift({
      messageId,
      pinnedBy: userId,
      pinnedAt: new Date(),
      message,
      senderName
    });
    
    // Keep only last 50 pinned messages
    if (this.pinnedMessages.length > 50) {
      this.pinnedMessages = this.pinnedMessages.slice(0, 50);
    }
  }
  return await this.save();
};

// Unpin message
chatSchema.methods.unpinMessage = async function(messageId) {
  this.pinnedMessages = this.pinnedMessages.filter(p => p.messageId.toString() !== messageId.toString());
  return await this.save();
};

// Star message for user
chatSchema.methods.starMessage = async function(userId, messageId) {
  const existing = this.starredMessages.find(s => 
    s.userId.toString() === userId.toString() && 
    s.messageId.toString() === messageId.toString()
  );
  
  if (!existing) {
    this.starredMessages.push({ userId, messageId, starredAt: new Date() });
  }
  
  return await this.save();
};

// Unstar message for user
chatSchema.methods.unstarMessage = async function(userId, messageId) {
  this.starredMessages = this.starredMessages.filter(s => 
    !(s.userId.toString() === userId.toString() && s.messageId.toString() === messageId.toString())
  );
  return await this.save();
};

// Add mention
chatSchema.methods.addMention = async function(userId, messageId, message) {
  const existing = this.mentions.find(m => 
    m.userId.toString() === userId.toString() && 
    m.messageId.toString() === messageId.toString()
  );
  
  if (!existing) {
    this.mentions.push({ userId, messageId, message, mentionedAt: new Date() });
  }
  
  return await this.save();
};

// Mark mention as read
chatSchema.methods.markMentionAsRead = async function(userId, messageId) {
  const mention = this.mentions.find(m => 
    m.userId.toString() === userId.toString() && 
    m.messageId.toString() === messageId.toString()
  );
  
  if (mention) {
    mention.isRead = true;
  }
  
  return await this.save();
};

// Get unread mentions for user
chatSchema.methods.getUnreadMentions = async function(userId) {
  return this.mentions.filter(m => 
    m.userId.toString() === userId.toString() && 
    !m.isRead
  );
};

// Archive chat
chatSchema.methods.archive = async function() {
  this.isArchived = true;
  return await this.save();
};

// Unarchive chat
chatSchema.methods.unarchive = async function() {
  this.isArchived = false;
  return await this.save();
};

// Mute chat for user
chatSchema.methods.mute = async function(userId, until = null) {
  const existing = this.mutedBy.find(m => m.userId.toString() === userId.toString());
  if (!existing) {
    this.mutedBy.push({ userId, mutedAt: new Date(), until });
  }
  this.isMuted = true;
  return await this.save();
};

// Unmute chat for user
chatSchema.methods.unmute = async function(userId) {
  this.mutedBy = this.mutedBy.filter(m => m.userId.toString() !== userId.toString());
  if (this.mutedBy.length === 0) {
    this.isMuted = false;
  }
  return await this.save();
};

// Check if chat is muted for user
chatSchema.methods.isMutedForUser = function(userId) {
  const mute = this.mutedBy.find(m => m.userId.toString() === userId.toString());
  if (!mute) return false;
  if (mute.until && mute.until < new Date()) return false;
  return true;
};

// ==================== STATIC METHODS ====================

// Get user's chats
chatSchema.statics.getUserChats = async function(userId, options = {}) {
  const { includeArchived = false, limit = 50, skip = 0 } = options;
  
  const query = {
    'participants.userId': userId,
    'participants.isActive': true
  };
  
  if (!includeArchived) {
    query.isArchived = false;
  }
  
  return await this.find(query)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('participants.userId', 'firstName lastName email role profileImage isOnline');
};

// Get or create direct chat
chatSchema.statics.getOrCreateDirectChat = async function(userId1, userId2, user1Data, user2Data) {
  let chat = await this.findOne({
    chatType: 'direct',
    participants: { 
      $all: [
        { $elemMatch: { userId: userId1, isActive: true } },
        { $elemMatch: { userId: userId2, isActive: true } }
      ]
    }
  }).populate('participants.userId', 'firstName lastName email role');
  
  if (!chat) {
    chat = new this({
      chatType: 'direct',
      participants: [
        {
          userId: userId1,
          role: user1Data.role,
          name: `${user1Data.firstName} ${user1Data.lastName}`,
          joinedAt: new Date()
        },
        {
          userId: userId2,
          role: user2Data.role,
          name: `${user2Data.firstName} ${user2Data.lastName}`,
          joinedAt: new Date()
        }
      ],
      unreadCounts: [
        { userId: userId1, count: 0 },
        { userId: userId2, count: 0 }
      ]
    });
    await chat.save();
  }
  
  return chat;
};

// Get chat by ticket
chatSchema.statics.getChatByTicket = async function(ticketId, ticketType = 'complaint') {
  const query = ticketType === 'complaint' 
    ? { ticketId, chatType: 'ticket' }
    : { taskId: ticketId, chatType: 'ticket' };
  
  return await this.findOne(query)
    .populate('participants.userId', 'firstName lastName email role')
    .populate('ticketId', 'subject status')
    .populate('taskId', 'title status');
};

// Get active chats count for user
chatSchema.statics.getActiveChatsCount = async function(userId) {
  return await this.countDocuments({
    'participants.userId': userId,
    'participants.isActive': true,
    isArchived: false,
    isActive: true
  });
};

// Get unread messages total for user
chatSchema.statics.getTotalUnreadCount = async function(userId) {
  const chats = await this.find({
    'participants.userId': userId,
    'participants.isActive': true
  });
  
  let totalUnread = 0;
  chats.forEach(chat => {
    const unread = chat.unreadCounts.find(u => u.userId.toString() === userId.toString());
    if (unread) {
      totalUnread += unread.count;
    }
  });
  
  return totalUnread;
};

// Clean up expired typing indicators (run via cron)
chatSchema.statics.cleanupTypingIndicators = async function() {
  return await this.updateMany(
    { 'typingUsers.expiresAt': { $lt: new Date() } },
    { $pull: { typingUsers: { expiresAt: { $lt: new Date() } } } }
  );
};

// Archive old chats (run via cron)
chatSchema.statics.archiveOldChats = async function(daysInactive = 30) {
  const cutoffDate = new Date(Date.now() - daysInactive * 24 * 60 * 60 * 1000);
  return await this.updateMany(
    {
      updatedAt: { $lt: cutoffDate },
      isArchived: false,
      chatType: { $ne: 'ticket' } // Don't auto-archive tickets
    },
    { isArchived: true }
  );
};

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
module.exports = Chat;