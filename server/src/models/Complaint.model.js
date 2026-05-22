/** //updated Complaint.model.js with customer fields made optional for admin-created complaints:
 * COMPLAINT MODEL
 * Handles customer complaints from creation to resolution
 */

const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  // ==================== BASIC INFORMATION ====================
  ticketNumber: { 
    type: String, 
    unique: true, 
    required: true,
    default: function() {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 10000);
      return `CMP${year}${random}`;
    }
  },
  
  // ✅ CHANGED: Customer Information - Made optional for admin-created complaints
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: false,  // ✅ Changed from required: true to false
    default: null 
  },
  customerName: { 
    type: String, 
    required: false,  // ✅ Changed from required: true to false
    default: null 
  },
  customerEmail: { 
    type: String, 
    required: false,  // ✅ Changed from required: true to false
    default: null 
  },
  customerPhone: { 
    type: String, 
    required: false,  // ✅ Changed from required: true to false
    default: null 
  },
  
  // Location Details
  location: {
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
    buildingName: String,
    floorNumber: Number,
    unitNumber: String,
    unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
    exactLocation: String
  },
  
  // ==================== COMPLAINT DETAILS ====================
  category: { 
    type: String, 
    enum: ['electrical', 'plumbing', 'cleaning', 'security', 'hvac', 'internet', 'parking', 'lift', 'water_leakage', 'other'],
    required: true 
  },
  subCategory: String,
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // Priority & SLA
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    required: true 
  },
  slaDeadline: { type: Date, required: true },
  slaBreached: { type: Boolean, default: false },
  breachReason: String,
  
  // ==================== STATUS LIFECYCLE ====================
  status: { 
    type: String, 
    enum: [
      'open',           // New complaint, not yet assigned
      'assigned',       // Assigned to technician
      'in_progress',    // Technician working on it
      'waiting_parts',  // Waiting for spare parts
      'completed',      // Work done, pending verification
      'verified',       // Supervisor verified
      'closed',         // Customer feedback received
      'cancelled'       // Complaint cancelled
    ],
    default: 'open'
  },
  
  // ==================== ASSIGNMENT ====================
  assignment: {
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedToName: String,
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedAt: Date,
    supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // ==================== TIMELINE ====================
  timeline: {
    raisedAt: { type: Date, default: Date.now },
    assignedAt: Date,
    startedAt: Date,
    completedAt: Date,
    verifiedAt: Date,
    closedAt: Date
  },
  
  // ==================== WORK EVIDENCE ====================
  evidence: {
    images: [{
      url: String,
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: { type: Date, default: Date.now },
      description: String
    }],
    videos: [{
      url: String,
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: { type: Date, default: Date.now },
      duration: Number
    }],
    voiceNote: String,
    documents: [{
      name: String,
      url: String,
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: Date
    }]
  },
  
  // ==================== TECHNICIAN NOTES ====================
  technicianNotes: [{
    note: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // ==================== VERIFICATION ====================
  verification: {
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date,
    notes: String,
    rating: { type: Number, min: 1, max: 5 }
  },
  
  // ==================== CUSTOMER FEEDBACK ====================
  customerFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    submittedAt: Date,
    resolvedSatisfactorily: Boolean
  },
  
  // ==================== ESCALATION ====================
  escalation: {
    level: { type: Number, default: 0 },
    reason: String,
    escalatedAt: Date,
    escalatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: Date
  },
  
  // ==================== METADATA ====================
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdByRole: { 
    type: String, 
    enum: ['customer', 'admin', 'manager', 'supervisor', 'technician'],
    default: 'customer'
  },  // ✅ NEW: Track who created the complaint
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
  source: { type: String, enum: ['customer_portal', 'admin', 'mobile', 'call_center'], default: 'customer_portal' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// ==================== VIRTUAL PROPERTIES ====================
complaintSchema.virtual('isCustomerProvided').get(function() {
  return !!(this.customerName && this.customerEmail);
});

complaintSchema.virtual('isAdminCreated').get(function() {
  return this.createdByRole !== 'customer';
});

// ==================== INDEXES ====================
complaintSchema.index({ ticketNumber: 1 }, { unique: true });
complaintSchema.index({ customerId: 1, createdAt: -1 });
complaintSchema.index({ status: 1, priority: 1 });
complaintSchema.index({ 'location.buildingId': 1 });
complaintSchema.index({ slaDeadline: 1, status: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ createdByRole: 1 });  // ✅ NEW: Index for createdByRole

// ==================== PRE-SAVE MIDDLEWARE ====================
complaintSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-generate ticket number if not exists
  if (!this.ticketNumber) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000);
    this.ticketNumber = `CMP${year}${random}`;
  }
  
  // Check SLA breach
  if (this.slaDeadline && this.slaDeadline < new Date() && !this.slaBreached && this.status !== 'closed') {
    this.slaBreached = true;
    this.breachReason = 'SLA deadline exceeded';
  }
  
  next();
});

// ==================== STATIC METHODS ====================
complaintSchema.statics.getDashboardStats = async function() {
  const stats = await this.aggregate([
    { $match: { isDeleted: false } },
    { $group: {
      _id: '$status',
      count: { $sum: 1 }
    }}
  ]);
  
  const result = {
    total: 0,
    open: 0,
    assigned: 0,
    inProgress: 0,
    completed: 0,
    verified: 0,
    closed: 0,
    slaBreached: 0,
    adminCreated: 0,      // ✅ NEW
    customerCreated: 0    // ✅ NEW
  };
  
  stats.forEach(s => {
    if (s._id === 'open') result.open = s.count;
    if (s._id === 'assigned') result.assigned = s.count;
    if (s._id === 'in_progress') result.inProgress = s.count;
    if (s._id === 'completed') result.completed = s.count;
    if (s._id === 'verified') result.verified = s.count;
    if (s._id === 'closed') result.closed = s.count;
  });
  
  result.total = result.open + result.assigned + result.inProgress + result.completed + result.verified + result.closed;
  result.slaBreached = await this.countDocuments({ slaBreached: true, isDeleted: false });
  
  // ✅ NEW: Count complaints by creator role
  result.adminCreated = await this.countDocuments({ createdByRole: { $ne: 'customer' }, isDeleted: false });
  result.customerCreated = await this.countDocuments({ createdByRole: 'customer', isDeleted: false });
  
  return result;
};

// ✅ NEW: Get complaints for admin view (includes both customer and admin-created)
complaintSchema.statics.getAdminComplaints = async function(filters = {}) {
  const query = { isDeleted: false };
  
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.buildingId) query['location.buildingId'] = filters.buildingId;
  if (filters.createdByRole) query.createdByRole = filters.createdByRole;
  
  return this.find(query)
    .populate('customerId', 'name email phone')
    .populate('assignment.assignedTo', 'name email technicianType')
    .populate('createdBy', 'name email role')
    .sort('-createdAt');
};

//module.exports = mongoose.model('Complaint', complaintSchema);

const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;