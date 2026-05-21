// server/src/models/Chat.model.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  // Chat participants
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String },
    name: { type: String },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date },
    isActive: { type: Boolean, default: true }
  }],
  
  // Chat type
  chatType: {
    type: String,
    enum: ['direct', 'group', 'ticket'],
    default: 'direct'
  },
  
  // For ticket-based chat
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  workOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder' },
  
  // For group chat
  groupName: { type: String },
  groupDescription: { type: String },
  groupIcon: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Chat settings
  isActive: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  lastMessage: {
    message: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  
  // Unread counts per participant
  unreadCounts: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    count: { type: Number, default: 0 }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
chatSchema.index({ participants: 1 });
chatSchema.index({ ticketId: 1 });
chatSchema.index({ chatType: 1 });
chatSchema.index({ updatedAt: -1 });

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
module.exports = Chat;