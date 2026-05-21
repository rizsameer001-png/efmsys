/**
 * TASK MODEL
 * Core model for managing all types of tasks in the system
 * Supports: Complaints, Preventive Maintenance, Corrective Maintenance, Inspections
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  // ==================== BASIC INFORMATION ====================
  taskId: { 
    type: String, 
    unique: true, 
    required: true,
    default: function() {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 10000);
      return `TSK${year}${random}`;
    }
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  
  // Task type classification
  taskType: { 
    type: String, 
    enum: ['complaint', 'preventive_maintenance', 'corrective_maintenance', 'inspection', 'installation', 'emergency'],
    default: 'complaint'
  },
  
  // Reference to source (complaint or work order)
  sourceId: { type: mongoose.Schema.Types.ObjectId, refPath: 'sourceModel' },
  sourceModel: { type: String, enum: ['Complaint', 'WorkOrder'] },
  
  // ==================== LOCATION DETAILS ====================
  location: {
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
    buildingName: { type: String },
    floorNumber: { type: Number },
    unitNumber: { type: String },
    unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
    exactLocation: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  
  // ==================== PRIORITY & SLA ====================
  priority: { 
    type: String, 
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium'
  },
  slaDeadline: { type: Date },
  slaBreached: { type: Boolean, default: false },
  breachReason: { type: String },
  breachNotificationSent: { type: Boolean, default: false },
  escalationLevel: { type: Number, default: 0 },
  escalationReason: { type: String },
  escalatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  escalatedAt: { type: Date },
  
  // ==================== TASK STATUS LIFECYCLE ====================
  status: { 
    type: String, 
    enum: [
      'pending',           // Created but not assigned
      'assigned',          // Assigned to technician
      'accepted',          // Technician accepted the task
      'in_progress',       // Work started
      'waiting_parts',     // Waiting for spare parts
      'waiting_approval',  // Waiting for supervisor approval
      'completed',         // Work done, pending verification
      'verified',          // Supervisor verified
      'closed',            // Task fully closed
      'cancelled',         // Task cancelled
      'rejected'           // Technician rejected
    ],
    default: 'pending'
  },
  
  // ==================== ASSIGNMENT DETAILS ====================
  assignment: {
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedToName: { type: String },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedAt: { type: Date },
    supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reassignmentCount: { type: Number, default: 0 },
    reassignmentReason: { type: String }
  },
  
  // ==================== TIMELINE TRACKING ====================
  timeline: {
    acceptedAt: { type: Date },
    startedAt: { type: Date },
    pausedAt: { type: Date },
    resumedAt: { type: Date },
    completedAt: { type: Date },
    verifiedAt: { type: Date },
    closedAt: { type: Date },
    cancelledAt: { type: Date }
  },
  
  // ==================== TIME TRACKING ====================
  timeTracking: {
    estimatedDuration: { type: Number }, // in minutes
    actualDuration: { type: Number }, // in minutes
    timeSpent: { type: Number, default: 0 },
    timePaused: { type: Number, default: 0 },
    overtimeMinutes: { type: Number, default: 0 }
  },
  
  // ==================== PROGRESS TRACKING ====================
  progress: {
    percentage: { type: Number, min: 0, max: 100, default: 0 },
    lastUpdatedAt: { type: Date },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // ==================== CHECKLIST ====================
  checklist: [{
    itemId: { type: String, required: true },
    itemName: { type: String, required: true },
    description: { type: String },
    required: { type: Boolean, default: true },
    completed: { type: Boolean, default: false },
    completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completedAt: { type: Date },
    imageBefore: { type: String },
    imageAfter: { type: String },
    notes: { type: String }
  }],
  
  // ==================== WORK EVIDENCE ====================
  evidence: {
    beforeImages: [{
      url: { type: String },
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: { type: Date, default: Date.now },
      description: { type: String }
    }],
    afterImages: [{
      url: { type: String },
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: { type: Date, default: Date.now },
      description: { type: String }
    }],
    videos: [{
      url: { type: String },
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: { type: Date, default: Date.now },
      duration: { type: Number }
    }],
    documents: [{
      name: { type: String },
      url: { type: String },
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  
  // ==================== TECHNICIAN NOTES ====================
  technicianNotes: [{
    note: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    isPublic: { type: Boolean, default: true }
  }],
  
  // ==================== PARTS & MATERIALS ====================
  partsUsed: [{
    partId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem' },
    partName: { type: String },
    quantity: { type: Number, default: 1 },
    unit: { type: String },
    unitCost: { type: Number },
    totalCost: { type: Number },
    supplier: { type: String },
    invoiceNumber: { type: String },
    usedAt: { type: Date, default: Date.now }
  }],
  
  // ==================== GPS TRACKING ====================
  gps: {
    checkIn: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
      timestamp: { type: Date },
      accuracy: { type: Number }
    },
    checkOut: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
      timestamp: { type: Date },
      accuracy: { type: Number }
    }
  },
  
  // ==================== VERIFICATION ====================
  verification: {
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    notes: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    reworkCount: { type: Number, default: 0 }
  },
  
  // ==================== REJECTION/REWORK ====================
  rejection: {
    reason: { type: String },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectedAt: { type: Date },
    reworkInstructions: { type: String }
  },
  
  // ==================== CUSTOMER FEEDBACK ====================
  customerFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    submittedAt: { type: Date },
    customerName: { type: String },
    customerSignature: { type: String }
  },
  
  // ==================== COMMUNICATION LOG ====================
  communicationLog: [{
    type: { type: String, enum: ['call', 'email', 'sms', 'chat', 'notification'] },
    direction: { type: String, enum: ['inbound', 'outbound'] },
    with: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  
  // ==================== TAGS & CATEGORIES ====================
  tags: [{ type: String }],
  category: { type: String },
  subCategory: { type: String },
  
  // ==================== SKILL REQUIREMENTS ====================
  requiredSkills: [{
    skill: { type: String },
    proficiencyLevel: { type: Number, min: 1, max: 5, default: 3 }
  }],
  
  // ==================== METADATA ====================
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES FOR PERFORMANCE ====================
taskSchema.index({ 'assignment.assignedTo': 1, status: 1 });
taskSchema.index({ priority: 1, status: 1 });
taskSchema.index({ slaDeadline: 1, status: 1 });
taskSchema.index({ 'location.buildingId': 1 });
taskSchema.index({ taskId: 1 }, { unique: true });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ status: 1, priority: 1, slaDeadline: 1 });
taskSchema.index({ isDeleted: 1 });

// ==================== VIRTUALS ====================
taskSchema.virtual('isOverdue').get(function() {
  return this.slaDeadline && this.slaDeadline < new Date() && 
         !['closed', 'cancelled', 'verified', 'completed'].includes(this.status);
});

taskSchema.virtual('timeRemaining').get(function() {
  if (!this.slaDeadline) return null;
  if (this.slaDeadline < new Date()) return 0;
  const remaining = this.slaDeadline - new Date();
  return Math.floor(remaining / 1000 / 60); // minutes
});

taskSchema.virtual('timeRemainingHours').get(function() {
  if (!this.slaDeadline) return null;
  if (this.slaDeadline < new Date()) return 0;
  const remaining = this.slaDeadline - new Date();
  return (remaining / 1000 / 60 / 60).toFixed(1); // hours
});

// ==================== PRE-SAVE MIDDLEWARE ====================
taskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-calculate progress percentage from checklist
  if (this.checklist && this.checklist.length > 0) {
    const completedItems = this.checklist.filter(item => item.completed).length;
    const newPercentage = Math.round((completedItems / this.checklist.length) * 100);
    if (this.progress.percentage !== newPercentage) {
      this.progress.percentage = newPercentage;
      this.progress.lastUpdatedAt = new Date();
    }
  }
  
  // Auto-calculate based on status
  if (this.status === 'completed' && this.progress.percentage !== 100) {
    this.progress.percentage = 100;
    this.progress.lastUpdatedAt = new Date();
  }
  
  if (this.status === 'pending' && this.progress.percentage !== 0) {
    this.progress.percentage = 0;
  }
  
  // Check if SLA is breached
  if (this.slaDeadline && this.slaDeadline < new Date() && !this.slaBreached && this.status !== 'closed') {
    this.slaBreached = true;
    this.breachReason = 'SLA deadline exceeded';
  }
  
  // Generate taskId if not exists
  if (!this.taskId) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000);
    this.taskId = `TSK${year}${random}`;
  }
  
  next();
});

// ==================== ✅ FIXED PRE-FIND MIDDLEWARE ====================
// ✅ Consolidated pre-find middleware to properly exclude soft-deleted tasks
taskSchema.pre(/^find/, function(next) {
  // Only apply soft-delete filter if not explicitly bypassed
  if (!this.getOptions().bypassSoftDelete) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

// ✅ Add a method to include soft-deleted items when needed
taskSchema.statics.findAllIncludingDeleted = function() {
  return this.find().setOptions({ bypassSoftDelete: true });
};

// ==================== STATIC METHODS ====================

/**
 * Find overdue tasks (SLA breached) - ✅ FIXED
 */
taskSchema.statics.findOverdue = function() {
  return this.find({
    slaDeadline: { $lt: new Date() },
    slaBreached: true,
    status: { $nin: ['closed', 'cancelled', 'verified', 'completed'] }
  });
};

/**
 * Find tasks by technician
 */
taskSchema.statics.findByTechnician = function(technicianId) {
  return this.find({ 
    'assignment.assignedTo': technicianId
  }).sort({ priority: -1, slaDeadline: 1 });
};

/**
 * Find tasks by building
 */
taskSchema.statics.findByBuilding = function(buildingId) {
  return this.find({ 
    'location.buildingId': buildingId
  }).sort({ createdAt: -1 });
};

/**
 * Find all active (non-deleted) tasks
 */
taskSchema.statics.findActive = function() {
  return this.find({});
};

/**
 * Get status counts for dashboard - ✅ FIXED with error handling
 */
taskSchema.statics.getStatusCounts = async function() {
  try {
    const counts = await this.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const result = {
      pending: 0, assigned: 0, accepted: 0, in_progress: 0,
      waiting_parts: 0, waiting_approval: 0, completed: 0, 
      verified: 0, closed: 0, cancelled: 0, rejected: 0,
      total: 0
    };
    
    counts.forEach(c => {
      if (result.hasOwnProperty(c._id)) {
        result[c._id] = c.count;
      }
      result.total += c.count;
    });
    
    return result;
  } catch (error) {
    console.error('Error getting status counts:', error);
    return {
      pending: 0, assigned: 0, accepted: 0, in_progress: 0,
      waiting_parts: 0, waiting_approval: 0, completed: 0, 
      verified: 0, closed: 0, cancelled: 0, rejected: 0,
      total: 0
    };
  }
};

/**
 * Get priority counts for dashboard - ✅ FIXED
 */
taskSchema.statics.getPriorityCounts = async function() {
  try {
    const counts = await this.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    const result = { critical: 0, high: 0, medium: 0, low: 0, total: 0 };
    counts.forEach(c => {
      if (result.hasOwnProperty(c._id)) {
        result[c._id] = c.count;
      }
      result.total += c.count;
    });
    
    return result;
  } catch (error) {
    console.error('Error getting priority counts:', error);
    return { critical: 0, high: 0, medium: 0, low: 0, total: 0 };
  }
};

/**
 * Get tasks due today
 */
taskSchema.statics.getDueToday = async function() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    slaDeadline: { $gte: startOfDay, $lte: endOfDay },
    status: { $nin: ['closed', 'cancelled', 'completed'] }
  });
};

/**
 * ✅ NEW: Get tasks with pagination and filters
 */
taskSchema.statics.getTaskList = async function(filters = {}, page = 1, limit = 20) {
  const query = { isDeleted: false };
  
  if (filters.status && filters.status !== 'all') query.status = filters.status;
  if (filters.priority && filters.priority !== 'all') query.priority = filters.priority;
  if (filters.assignedTo) query['assignment.assignedTo'] = filters.assignedTo;
  if (filters.buildingId) query['location.buildingId'] = filters.buildingId;
  if (filters.taskType && filters.taskType !== 'all') query.taskType = filters.taskType;
  
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { taskId: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  const skip = (page - 1) * limit;
  
  const [tasks, total] = await Promise.all([
    this.find(query)
      .populate('assignment.assignedTo', 'name email technicianType')
      .populate('assignment.assignedBy', 'name')
      .populate('location.buildingId', 'name code')
      .populate('sourceId', 'title complaintNumber')
      .sort({ priority: -1, slaDeadline: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    this.countDocuments(query)
  ]);
  
  return { tasks, total, page, totalPages: Math.ceil(total / limit) };
};

// ==================== INSTANCE METHODS ====================

/**
 * Update task progress
 */
taskSchema.methods.updateProgress = async function(percentage, updatedBy) {
  this.progress.percentage = Math.min(100, Math.max(0, percentage));
  this.progress.lastUpdatedAt = new Date();
  this.progress.updatedBy = updatedBy;
  
  if (percentage === 100 && this.status === 'in_progress') {
    this.status = 'completed';
    this.timeline.completedAt = new Date();
  }
  
  return await this.save();
};

/**
 * Calculate actual time spent on task (minutes)
 */
taskSchema.methods.calculateTimeSpent = function() {
  if (!this.timeline.startedAt) return 0;
  
  const endTime = this.timeline.completedAt || new Date();
  const totalMs = endTime - this.timeline.startedAt;
  const pausedMs = (this.timeTracking?.timePaused || 0) * 60 * 1000;
  
  return Math.floor((totalMs - pausedMs) / 1000 / 60);
};

/**
 * Check if technician can accept this task
 */
taskSchema.methods.canAccept = function(userId) {
  return this.status === 'assigned' && 
         this.assignment.assignedTo && 
         this.assignment.assignedTo.toString() === userId.toString();
};

/**
 * Check if technician can start this task
 */
taskSchema.methods.canStart = function(userId) {
  return this.status === 'accepted' && 
         this.assignment.assignedTo && 
         this.assignment.assignedTo.toString() === userId.toString();
};

/**
 * Check if technician can complete this task
 */
taskSchema.methods.canComplete = function(userId) {
  return this.status === 'in_progress' && 
         this.assignment.assignedTo && 
         this.assignment.assignedTo.toString() === userId.toString();
};

/**
 * Check if user can verify this task
 */
taskSchema.methods.canVerify = function(userRole) {
  return this.status === 'completed' && 
         ['supervisor', 'manager', 'admin', 'super_admin'].includes(userRole);
};

/**
 * Check if user can reject this task
 */
taskSchema.methods.canReject = function(userRole) {
  return (this.status === 'completed' || this.status === 'in_progress') && 
         ['supervisor', 'manager', 'admin', 'super_admin'].includes(userRole);
};

//module.exports = mongoose.model('Task', taskSchema);

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
module.exports = Task;