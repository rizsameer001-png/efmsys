/**
 * SLA HISTORY MODEL
 * Tracks Service Level Agreement compliance and breach history for tasks
 * 
 * PURPOSE:
 * - Records all SLA-related events for each task
 * - Tracks escalations, breaches, and warnings
 * - Provides historical data for SLA reports and analytics
 * - Enables audit trail for compliance monitoring
 */

const mongoose = require('mongoose');

const slaHistorySchema = new mongoose.Schema({
  // ==================== TASK REFERENCE ====================
  taskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task', 
    required: true,
    index: true,
    description: 'Reference to the task this SLA history belongs to'
  },
  taskTitle: { 
    type: String,
    description: 'Task title (denormalized for quick access)'
  },
  taskPriority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'],
    description: 'Task priority level'
  },
  taskStatus: { 
    type: String,
    enum: ['assigned', 'accepted', 'in_progress', 'completed', 'verified', 'rejected'],
    description: 'Task status at the time of SLA event'
  },
  
  // ==================== SLA DEFINITION ====================
  slaDefinition: {
    responseTime: { 
      type: Number, 
      default: 60,
      description: 'Maximum allowed response time in minutes'
    },
    resolutionTime: { 
      type: Number, 
      default: 240,
      description: 'Maximum allowed resolution time in minutes'
    },
    escalationTime: { 
      type: Number, 
      default: 120,
      description: 'Time before deadline to escalate in minutes'
    }
  },
  
  // ==================== ACTUAL PERFORMANCE ====================
  actualResponseTime: { 
    type: Number,
    description: 'Actual time taken to respond in minutes'
  },
  actualResolutionTime: { 
    type: Number,
    description: 'Actual time taken to resolve in minutes'
  },
  timeSpent: { 
    type: Number,
    description: 'Total time spent on task in minutes'
  },
  
  // ==================== EVENT TIMELINES ====================
  createdAt: { 
    type: Date, 
    default: Date.now,
    description: 'When the task was created'
  },
  assignedAt: { 
    type: Date,
    description: 'When the task was assigned to technician'
  },
  acceptedAt: { 
    type: Date,
    description: 'When the technician accepted the task'
  },
  startedAt: { 
    type: Date,
    description: 'When work on the task started'
  },
  completedAt: { 
    type: Date,
    description: 'When the task was marked as completed'
  },
  verifiedAt: { 
    type: Date,
    description: 'When the task was verified by supervisor'
  },
  
  // ==================== SLA DEADLINES ====================
  slaDeadline: { 
    type: Date,
    description: 'Original SLA deadline'
  },
  currentDeadline: { 
    type: Date,
    description: 'Current deadline (after escalations)'
  },
  deadlineExceededBy: { 
    type: Number,
    description: 'Minutes exceeded beyond deadline (negative = early, positive = late)'
  },
  
  // ==================== BREACH INFORMATION ====================
  isBreached: { 
    type: Boolean, 
    default: false,
    index: true,
    description: 'Whether SLA was breached'
  },
  breachType: { 
    type: String, 
    enum: ['response', 'resolution', 'escalation', 'deadline'],
    description: 'Type of SLA breach'
  },
  breachTime: { 
    type: Date,
    description: 'When the breach occurred'
  },
  breachReason: { 
    type: String,
    description: 'Reason for SLA breach'
  },
  breachDuration: { 
    type: Number,
    description: 'Minutes the deadline was exceeded by'
  },
  
  // ==================== ESCALATION HISTORY ====================
  currentEscalationLevel: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5,
    description: 'Current escalation level (0 = no escalation)'
  },
  escalations: [{
    level: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5,
      description: 'Escalation level (1-5)'
    },
    escalatedTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      description: 'User/role this was escalated to'
    },
    escalatedToRole: { 
      type: String,
      enum: ['technician', 'supervisor', 'manager', 'admin', 'super_admin'],
      description: 'Role this was escalated to'
    },
    escalatedAt: { 
      type: Date, 
      default: Date.now,
      description: 'When escalation happened'
    },
    reason: { 
      type: String,
      description: 'Why escalation occurred'
    },
    resolvedAt: { 
      type: Date,
      description: 'When escalation was resolved'
    },
    resolvedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      description: 'Who resolved the escalation'
    },
    notes: { 
      type: String,
      description: 'Additional notes about escalation'
    }
  }],
  
  // ==================== WARNING HISTORY ====================
  warnings: [{
    type: { 
      type: String, 
      enum: ['time_warning', 'escalation_warning', 'deadline_approaching'],
      description: 'Type of warning'
    },
    percentageUsed: { 
      type: Number,
      description: 'Percentage of SLA used when warning triggered'
    },
    timeRemaining: { 
      type: Number,
      description: 'Hours remaining when warning triggered'
    },
    triggeredAt: { 
      type: Date, 
      default: Date.now,
      description: 'When warning was triggered'
    },
    acknowledgedAt: { 
      type: Date,
      description: 'When warning was acknowledged'
    },
    acknowledgedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      description: 'Who acknowledged the warning'
    }
  }],
  
  // ==================== NOTIFICATION HISTORY ====================
  notifications: [{
    type: { 
      type: String, 
      enum: ['warning', 'breach', 'escalation', 'reminder'],
      description: 'Type of notification'
    },
    sentAt: { 
      type: Date, 
      default: Date.now,
      description: 'When notification was sent'
    },
    sentTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      description: 'Who received the notification'
    },
    sentToRole: { 
      type: String,
      description: 'Role of the recipient'
    },
    channel: { 
      type: String, 
      enum: ['email', 'sms', 'push', 'in_app'],
      description: 'How notification was sent'
    },
    status: { 
      type: String, 
      enum: ['pending', 'sent', 'delivered', 'failed'],
      default: 'pending',
      description: 'Delivery status'
    },
    content: { 
      type: String,
      description: 'Notification content'
    }
  }],
  
  // ==================== METRICS & STATISTICS ====================
  metrics: {
    slaPercentageUsed: { 
      type: Number,
      description: 'Percentage of SLA time used (0-100)'
    },
    timeRemainingPercentage: { 
      type: Number,
      description: 'Percentage of SLA time remaining (0-100)'
    },
    efficiency: { 
      type: Number,
      description: 'Efficiency score based on SLA performance'
    },
    riskScore: { 
      type: Number,
      min: 0,
      max: 100,
      description: 'Risk score (higher = more risk)'
    }
  },
  
  // ==================== RESOLUTION INFORMATION ====================
  resolution: {
    resolvedAt: { 
      type: Date,
      description: 'When the SLA issue was resolved'
    },
    resolvedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      description: 'Who resolved the SLA issue'
    },
    resolutionNotes: { 
      type: String,
      description: 'Notes about resolution'
    },
    actionTaken: { 
      type: String,
      description: 'Action taken to resolve SLA issue'
    }
  },
  
  // ==================== AUDIT TRAIL ====================
  auditLog: [{
    action: { 
      type: String,
      description: 'Action performed'
    },
    performedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      description: 'Who performed the action'
    },
    performedAt: { 
      type: Date, 
      default: Date.now,
      description: 'When action was performed'
    },
    details: { 
      type: mongoose.Schema.Types.Mixed,
      description: 'Additional action details'
    }
  }],
  
  // ==================== SYSTEM FIELDS ====================
  version: { 
    type: Number, 
    default: 1,
    description: 'Schema version for migrations'
  },
  isActive: { 
    type: Boolean, 
    default: true,
    index: true,
    description: 'Whether this record is active'
  },
  tags: [{
    type: String,
    description: 'Tags for categorization'
  }],
  metadata: { 
    type: mongoose.Schema.Types.Mixed,
    description: 'Additional metadata'
  }
}, {
  timestamps: true,  // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES ====================
// Primary indexes for most common queries
slaHistorySchema.index({ taskId: 1, createdAt: -1 });
slaHistorySchema.index({ isBreached: 1, breachTime: -1 });
slaHistorySchema.index({ createdAt: -1 });
slaHistorySchema.index({ isActive: 1, createdAt: -1 });

// Compound indexes for reports
slaHistorySchema.index({ taskPriority: 1, isBreached: 1 });
slaHistorySchema.index({ createdAt: 1, isBreached: 1 });
slaHistorySchema.index({ 'escalations.escalatedAt': -1 });

// Index for time-based queries
slaHistorySchema.index({ slaDeadline: 1, isBreached: 1 });
slaHistorySchema.index({ currentEscalationLevel: 1 });

// ==================== VIRTUAL FIELDS ====================
// Get total escalation count
slaHistorySchema.virtual('totalEscalations').get(function() {
  return this.escalations ? this.escalations.length : 0;
});

// Get total warnings count
slaHistorySchema.virtual('totalWarnings').get(function() {
  return this.warnings ? this.warnings.length : 0;
});

// Get total notifications sent
slaHistorySchema.virtual('totalNotifications').get(function() {
  return this.notifications ? this.notifications.length : 0;
});

// Get unresolved escalations
slaHistorySchema.virtual('unresolvedEscalations').get(function() {
  return this.escalations ? this.escalations.filter(e => !e.resolvedAt) : [];
});

// Get SLA status text
slaHistorySchema.virtual('slaStatus').get(function() {
  if (this.isBreached) return 'Breached';
  if (this.currentEscalationLevel > 0) return 'Escalated';
  if (this.metrics?.slaPercentageUsed > 75) return 'At Risk';
  if (this.metrics?.slaPercentageUsed > 50) return 'Warning';
  return 'On Track';
});

// ==================== INSTANCE METHODS ====================
/**
 * Add an escalation record
 * @param {Object} escalationData - Escalation details
 */
slaHistorySchema.methods.addEscalation = function(escalationData) {
  this.escalations.push({
    level: escalationData.level,
    escalatedTo: escalationData.escalatedTo,
    escalatedToRole: escalationData.escalatedToRole,
    reason: escalationData.reason,
    escalatedAt: new Date(),
    notes: escalationData.notes
  });
  this.currentEscalationLevel = escalationData.level;
  this.markModified('escalations');
  return this.save();
};

/**
 * Resolve an escalation
 * @param {Number} level - Escalation level to resolve
 * @param {Object} resolution - Resolution details
 */
slaHistorySchema.methods.resolveEscalation = function(level, resolution) {
  const escalation = this.escalations.find(e => e.level === level && !e.resolvedAt);
  if (escalation) {
    escalation.resolvedAt = new Date();
    escalation.resolvedBy = resolution.resolvedBy;
    escalation.notes = resolution.notes;
    this.markModified('escalations');
  }
  return this.save();
};

/**
 * Add a warning record
 * @param {Object} warningData - Warning details
 */
slaHistorySchema.methods.addWarning = function(warningData) {
  this.warnings.push({
    type: warningData.type,
    percentageUsed: warningData.percentageUsed,
    timeRemaining: warningData.timeRemaining,
    triggeredAt: new Date()
  });
  this.markModified('warnings');
  return this.save();
};

/**
 * Mark SLA as breached
 * @param {Object} breachData - Breach details
 */
slaHistorySchema.methods.markBreached = function(breachData) {
  this.isBreached = true;
  this.breachType = breachData.breachType;
  this.breachTime = new Date();
  this.breachReason = breachData.reason;
  this.breachDuration = breachData.duration;
  this.deadlineExceededBy = breachData.duration;
  this.markModified('metrics');
  return this.save();
};

/**
 * Add audit log entry
 * @param {Object} logData - Audit log details
 */
slaHistorySchema.methods.addAuditLog = function(logData) {
  this.auditLog.push({
    action: logData.action,
    performedBy: logData.performedBy,
    details: logData.details,
    performedAt: new Date()
  });
  this.markModified('auditLog');
  return this.save();
};

// ==================== STATIC METHODS ====================
/**
 * Get breached tasks for a date range
 * @param {Date} startDate - Start of date range
 * @param {Date} endDate - End of date range
 */
slaHistorySchema.statics.getBreachedTasks = function(startDate, endDate) {
  return this.find({
    isBreached: true,
    breachTime: { $gte: startDate, $lte: endDate }
  }).populate('taskId').sort({ breachTime: -1 });
};

/**
 * Get SLA compliance statistics
 * @param {Date} startDate - Start of period
 * @param {Date} endDate - End of period
 */
slaHistorySchema.statics.getComplianceStats = async function(startDate, endDate) {
  const total = await this.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }
  });
  
  const breached = await this.countDocuments({
    isBreached: true,
    breachTime: { $gte: startDate, $lte: endDate }
  });
  
  return {
    total,
    breached,
    complianceRate: total > 0 ? ((total - breached) / total * 100).toFixed(2) : 100,
    breachRate: total > 0 ? (breached / total * 100).toFixed(2) : 0
  };
};

/**
 * Get average resolution time by priority
 */
slaHistorySchema.statics.getAvgResolutionTimeByPriority = function() {
  return this.aggregate([
    { $match: { actualResolutionTime: { $exists: true } } },
    { $group: {
      _id: '$taskPriority',
      avgResolutionTime: { $avg: '$actualResolutionTime' },
      count: { $sum: 1 }
    }},
    { $sort: { avgResolutionTime: -1 } }
  ]);
};

// ==================== MIDDLEWARE ====================
// Pre-save middleware to update metrics
slaHistorySchema.pre('save', function(next) {
  // Update metrics before saving
  if (this.slaDeadline && this.createdAt) {
    const totalSlaMinutes = (this.slaDeadline - this.createdAt) / (1000 * 60);
    const elapsedMinutes = (new Date() - this.createdAt) / (1000 * 60);
    this.metrics = this.metrics || {};
    this.metrics.slaPercentageUsed = Math.min(100, Math.max(0, (elapsedMinutes / totalSlaMinutes) * 100));
    this.metrics.timeRemainingPercentage = 100 - this.metrics.slaPercentageUsed;
  }
  next();
});

// ==================== EXPORT ====================
module.exports = mongoose.model('SLAHistory', slaHistorySchema);