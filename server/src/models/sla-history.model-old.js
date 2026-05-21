/**
 * SLA HISTORY MODEL
 * Tracks Service Level Agreement compliance and breach history
 */

const mongoose = require('mongoose');

const slaHistorySchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  taskTitle: String,
  priority: String,
  
  // SLA Definition
  slaDefinition: {
    responseTime: Number, // minutes
    resolutionTime: Number, // minutes
    escalationTime: Number // minutes
  },
  
  // Actual Performance
  actualResponseTime: Number, // minutes
  actualResolutionTime: Number, // minutes
  
  // Timelines
  createdAt: Date,
  assignedAt: Date,
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  verifiedAt: Date,
  
  // Breach Information
  isBreached: { type: Boolean, default: false },
  breachType: { type: String, enum: ['response', 'resolution', 'escalation'] },
  breachTime: Date,
  breachReason: String,
  breachDuration: Number, // minutes exceeded
  
  // Escalation History
  escalations: [{
    level: Number,
    escalatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    escalatedAt: Date,
    reason: String,
    resolvedAt: Date
  }],
  
  // Notifications
  notifications: [{
    type: { type: String, enum: ['warning', 'breach', 'escalation'] },
    sentAt: Date,
    sentTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    channel: { type: String, enum: ['email', 'sms', 'push'] }
  }],
  
  createdAt: { type: Date, default: Date.now }
});

slaHistorySchema.index({ taskId: 1 });
slaHistorySchema.index({ isBreached: 1, breachTime: -1 });
slaHistorySchema.index({ createdAt: -1 });

module.exports = mongoose.model('SLAHistory', slaHistorySchema);