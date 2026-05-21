// server/src/models/UserChatSettings.model.js
const mongoose = require('mongoose');

const userChatSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // Chat permission (controlled by Super Admin)
  chatEnabled: { type: Boolean, default: false },
  
  // Blocked users
  blockedUsers: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    blockedAt: { type: Date, default: Date.now },
    reason: { type: String }
  }],
  
  // Notification preferences
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sound: { type: Boolean, default: true }
  },
  
  // Theme preference
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const UserChatSettings = mongoose.models.UserChatSettings || mongoose.model('UserChatSettings', userChatSettingsSchema);
module.exports = UserChatSettings;