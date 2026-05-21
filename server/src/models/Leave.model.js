// // server/src/models/Leave.model.js
// const mongoose = require('mongoose');

// const leaveSchema = new mongoose.Schema({
//   employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
//   leaveType: { 
//     type: String, 
//     enum: ['annual', 'sick', 'emergency', 'unpaid', 'maternity', 'paternity', 'bereavement'],
//     required: true 
//   },
  
//   // Date Range
//   fromDate: { type: Date, required: true },
//   toDate: { type: Date, required: true },
//   totalDays: { type: Number, required: true },
  
//   // Details
//   reason: { type: String, required: true },
//   attachment: { type: String },
  
//   // Emergency Contact during leave
//   emergencyContact: {
//     name: { type: String },
//     phone: { type: String },
//     relation: { type: String }
//   },
  
//   // Approval Workflow
//   supervisorApproval: {
//     status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
//     by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     at: { type: Date },
//     comments: { type: String }
//   },
//   managerApproval: {
//     status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
//     by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     at: { type: Date },
//     comments: { type: String }
//   },
//   hrApproval: {
//     status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
//     by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     at: { type: Date },
//     comments: { type: String }
//   },
  
//   // Final Status
//   status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
  
//   // Leave Balance After Approval
//   leaveBalance: {
//     annual: { type: Number, default: 0 },
//     sick: { type: Number, default: 0 },
//     emergency: { type: Number, default: 0 }
//   },
  
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// }, {
//   timestamps: true
// });

// // Indexes
// leaveSchema.index({ employeeId: 1, status: 1 });
// leaveSchema.index({ fromDate: -1, toDate: -1 });

// const Leave = mongoose.models.Leave || mongoose.model('Leave', leaveSchema);
// module.exports = Leave;




// server/src/models/Leave.model.js
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  // 🔴 FIX: Use employeeId (not userId) to match controller
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Employee ID is required'],
    index: true 
  },
  
  leaveType: { 
    type: String, 
    enum: ['annual', 'sick', 'casual', 'unpaid', 'emergency', 'maternity', 'paternity', 'bereavement'],
    required: [true, 'Leave type is required']
  },
  
  // 🔴 FIX: Use fromDate/toDate (not startDate/endDate) to match controller
  fromDate: { 
    type: Date, 
    required: [true, 'From date is required']
  },
  toDate: { 
    type: Date, 
    required: [true, 'To date is required']
  },
  
  // 🔴 FIX: Make totalDays required with validation
  totalDays: { 
    type: Number, 
    required: [true, 'Total days is required'],
    min: [0.5, 'Total days must be at least 0.5'],
    validate: {
      validator: function(v) {
        return v > 0;
      },
      message: 'Total days must be greater than 0'
    }
  },
  
  // Half day leave
  halfDay: {
    type: Boolean,
    default: false
  },
  
  // Details
  reason: { 
    type: String, 
    required: [true, 'Reason is required'],
    trim: true,
    minlength: [3, 'Reason must be at least 3 characters']
  },
  attachment: { 
    type: String,
    default: null
  },
  
  // Status
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'cancelled'], 
    default: 'pending',
    index: true
  },
  
  // Applied timestamp
  appliedOn: {
    type: Date,
    default: Date.now
  },
  
  // 🔴 FIX: Simplified approval fields (matching controller)
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  approvedComments: {
    type: String,
    default: ''
  },
  
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: {
    type: Date
  },
  cancelledReason: {
    type: String,
    default: ''
  },
  
  // Emergency Contact during leave (optional)
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relation: { type: String }
  },
  
  // Leave Balance After Approval (optional)
  leaveBalance: {
    annual: { type: Number, default: 0 },
    sick: { type: Number, default: 0 },
    emergency: { type: Number, default: 0 }
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
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

// ==================== PRE-SAVE MIDDLEWARE ====================

// Update updatedAt on save
leaveSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Auto-calculate totalDays if not provided
leaveSchema.pre('save', function(next) {
  if (this.fromDate && this.toDate && (!this.totalDays || this.totalDays === 0)) {
    const diffTime = Math.abs(this.toDate - this.fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.totalDays = this.halfDay ? Math.max(0.5, diffDays) : diffDays;
  }
  next();
});

// ==================== INDEXES ====================
leaveSchema.index({ employeeId: 1, status: 1 });
leaveSchema.index({ employeeId: 1, fromDate: -1, toDate: -1 });
leaveSchema.index({ fromDate: -1, toDate: -1 });
leaveSchema.index({ status: 1, appliedOn: -1 });
leaveSchema.index({ approvedBy: 1 });
leaveSchema.index({ rejectedBy: 1 });

// ==================== COMPOUND INDEXES ====================
leaveSchema.index({ employeeId: 1, status: 1, appliedOn: -1 });

// ==================== VIRTUAL PROPERTIES ====================

// Get duration in days
leaveSchema.virtual('duration').get(function() {
  return this.totalDays;
});

// Get formatted date range
leaveSchema.virtual('dateRange').get(function() {
  return `${this.fromDate.toLocaleDateString()} - ${this.toDate.toLocaleDateString()}`;
});

// Get employee name (populated)
leaveSchema.virtual('employeeName', {
  ref: 'User',
  localField: 'employeeId',
  foreignField: '_id',
  justOne: true,
  options: { select: 'firstName lastName email' }
});

// ==================== INSTANCE METHODS ====================

/**
 * Check if leave can be cancelled
 */
leaveSchema.methods.canCancel = function() {
  return this.status === 'pending';
};

/**
 * Check if leave can be approved
 */
leaveSchema.methods.canApprove = function() {
  return this.status === 'pending';
};

/**
 * Check if leave can be rejected
 */
leaveSchema.methods.canReject = function() {
  return this.status === 'pending';
};

/**
 * Approve leave
 */
leaveSchema.methods.approve = function(approverId, comments = '') {
  if (!this.canApprove()) {
    throw new Error('Cannot approve this leave request');
  }
  this.status = 'approved';
  this.approvedBy = approverId;
  this.approvedAt = new Date();
  this.approvedComments = comments;
  return this;
};

/**
 * Reject leave
 */
leaveSchema.methods.reject = function(rejecterId, reason = '') {
  if (!this.canReject()) {
    throw new Error('Cannot reject this leave request');
  }
  this.status = 'rejected';
  this.rejectedBy = rejecterId;
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
  return this;
};

/**
 * Cancel leave
 */
leaveSchema.methods.cancel = function(cancellerId, reason = '') {
  if (!this.canCancel()) {
    throw new Error('Cannot cancel this leave request');
  }
  this.status = 'cancelled';
  this.cancelledBy = cancellerId;
  this.cancelledAt = new Date();
  this.cancelledReason = reason;
  return this;
};

// ==================== STATIC METHODS ====================

/**
 * Get pending leave requests for a user
 */
leaveSchema.statics.getPendingForUser = function(userId) {
  return this.find({ employeeId: userId, status: 'pending' })
    .sort({ appliedOn: -1 });
};

/**
 * Get approved leaves for a user in a date range
 */
leaveSchema.statics.getApprovedInRange = function(userId, startDate, endDate) {
  return this.find({
    employeeId: userId,
    status: 'approved',
    fromDate: { $lte: endDate },
    toDate: { $gte: startDate }
  });
};

/**
 * Get total days taken by leave type for a user in a year
 */
leaveSchema.statics.getTotalDaysByType = async function(userId, year, leaveType) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  const result = await this.aggregate([
    {
      $match: {
        employeeId: userId,
        status: 'approved',
        leaveType: leaveType,
        fromDate: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalDays: { $sum: '$totalDays' }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].totalDays : 0;
};

/**
 * Get leave statistics for dashboard
 */
leaveSchema.statics.getStatistics = async function(companyId = null) {
  const match = {};
  if (companyId) match.companyId = companyId;
  
  const stats = await this.aggregate([
    { $match: match },
    { $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalDays: { $sum: '$totalDays' }
      }
    }
  ]);
  
  const result = {
    pending: { count: 0, days: 0 },
    approved: { count: 0, days: 0 },
    rejected: { count: 0, days: 0 },
    cancelled: { count: 0, days: 0 }
  };
  
  stats.forEach(stat => {
    if (result[stat._id]) {
      result[stat._id].count = stat.count;
      result[stat._id].days = stat.totalDays;
    }
  });
  
  return result;
};

// ==================== PREVENT OVERWRITE MODEL ERROR ====================
const Leave = mongoose.models.Leave || mongoose.model('Leave', leaveSchema);
module.exports = Leave;