// server/src/models/Message.model.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String },
  message: { type: String, trim: true },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'location', 'voice'],
    default: 'text'
  },
  
  // Attachments
  attachments: [{
    url: { type: String },
    fileName: { type: String },
    fileSize: { type: Number },
    mimeType: { type: String },
    fileType: { type: String, enum: ['image', 'pdf', 'document', 'voice'] }
  }],
  
  // Location sharing
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String }
  },
  
  // Message status
  status: {
    type: String,
    enum: ['sending', 'sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  
  // Read receipts per user
  readBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  
  deliveredTo: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveredAt: { type: Date, default: Date.now }
  }],
  
  // Reply to message
  replyTo: {
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    message: { type: String },
    senderName: { type: String }
  },
  
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
  deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for performance
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ status: 1 });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
module.exports = Message;