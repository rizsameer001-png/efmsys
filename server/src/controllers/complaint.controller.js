/**
 * COMPLAINT CONTROLLER
 * Handles all complaint-related operations
 */

const Complaint = require('../models/complaint.model');
const User = require('../models/user.model');
const Building = require('../models/building.model');
const Unit = require('../models/unit.model');

// ==================== CREATE COMPLAINT ====================
exports.createComplaint = async (req, res) => {
  try {
    const complaintData = req.body;
    
    // If customer is logged in, get their info
    if (req.userRole === 'customer') {
      complaintData.customerId = req.userId;
    }
    
    // Calculate SLA based on priority
    const slaHours = {
      urgent: 4,
      high: 8,
      medium: 24,
      low: 48
    };
    
    const deadlineHours = slaHours[complaintData.priority] || 24;
    complaintData.slaDeadline = new Date(Date.now() + deadlineHours * 60 * 60 * 1000);
    
    complaintData.createdBy = req.userId;
    complaintData.timeline = { raisedAt: new Date() };
    
    const complaint = new Complaint(complaintData);
    await complaint.save();
    
    // Notify managers
    await notifyManagers(complaint);
    
    res.status(201).json({
      success: true,
      data: complaint,
      message: `Complaint raised successfully. Ticket #${complaint.ticketNumber}`
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================== GET COMPLAINTS ====================
exports.getComplaints = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      category,
      buildingId,
      assignedTo,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = { isDeleted: false };
    
    // Role-based filtering
    if (req.userRole === 'customer') {
      query.customerId = req.userId;
    } else if (req.userRole === 'technician') {
      query['assignment.assignedTo'] = req.userId;
    } else if (req.userRole === 'supervisor') {
      const team = await User.find({ supervisor: req.userId }).distinct('_id');
      query['assignment.assignedTo'] = { $in: team };
    } else if (req.userRole === 'manager') {
      const team = await User.find({ reportingManager: req.userId }).distinct('_id');
      query['assignment.assignedTo'] = { $in: team };
    }
    
    // Apply filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (buildingId) query['location.buildingId'] = buildingId;
    if (assignedTo) query['assignment.assignedTo'] = assignedTo;
    if (search) {
      query.$or = [
        { ticketNumber: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .populate('customerId', 'firstName lastName email phone')
        .populate('assignment.assignedTo', 'firstName lastName email')
        .populate('location.buildingId', 'name code')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Complaint.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: {
        complaints,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET COMPLAINT BY ID ====================
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('customerId', 'firstName lastName email phone')
      .populate('assignment.assignedTo', 'firstName lastName email phone')
      .populate('assignment.assignedBy', 'firstName lastName')
      .populate('location.buildingId', 'name code address')
      .populate('location.unitId', 'unitNumber floorNumber');
    
    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }
    
    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== UPDATE COMPLAINT ====================
exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedBy = req.userId;
    updates.updatedAt = new Date();
    
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }
    
    res.json({
      success: true,
      data: complaint,
      message: 'Complaint updated successfully'
    });
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================== ASSIGN COMPLAINT ====================
exports.assignComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { technicianId } = req.body;
    
    const technician = await User.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ success: false, error: 'Technician not found' });
    }
    
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }
    
    complaint.assignment = {
      assignedTo: technicianId,
      assignedToName: `${technician.firstName} ${technician.lastName}`,
      assignedBy: req.userId,
      assignedAt: new Date(),
      supervisorId: req.userRole === 'supervisor' ? req.userId : complaint.assignment?.supervisorId,
      managerId: req.userRole === 'manager' ? req.userId : complaint.assignment?.managerId
    };
    complaint.status = 'assigned';
    complaint.timeline.assignedAt = new Date();
    await complaint.save();
    
    // Send notification to technician
    await notifyTechnician(complaint, technician);
    
    res.json({
      success: true,
      data: complaint,
      message: `Complaint assigned to ${technician.firstName} ${technician.lastName}`
    });
  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================== START WORK ====================
exports.startWork = async (req, res) => {
  try {
    const { id } = req.params;
    
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }
    
    if (complaint.assignment.assignedTo?.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: 'Not assigned to you' });
    }
    
    if (complaint.status !== 'assigned') {
      return res.status(400).json({ success: false, error: 'Complaint cannot be started' });
    }
    
    complaint.status = 'in_progress';
    complaint.timeline.startedAt = new Date();
    await complaint.save();
    
    res.json({
      success: true,
      data: complaint,
      message: 'Work started on complaint'
    });
  } catch (error) {
    console.error('Start work error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== COMPLETE WORK ====================
exports.completeWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, images } = req.body;
    
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }
    
    if (complaint.assignment.assignedTo?.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: 'Not assigned to you' });
    }
    
    if (complaint.status !== 'in_progress') {
      return res.status(400).json({ success: false, error: 'Complaint cannot be completed' });
    }
    
    complaint.status = 'completed';
    complaint.timeline.completedAt = new Date();
    
    if (notes) {
      complaint.technicianNotes.push({
        note: notes,
        createdBy: req.userId,
        createdAt: new Date()
      });
    }
    
    if (images && images.length) {
      complaint.evidence.images.push(...images);
    }
    
    await complaint.save();
    
    // Notify supervisor for verification
    await notifySupervisor(complaint);
    
    res.json({
      success: true,
      data: complaint,
      message: 'Work completed. Pending verification.'
    });
  } catch (error) {
    console.error('Complete work error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== VERIFY COMPLAINT ====================
exports.verifyComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, notes, rating } = req.body;
    
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }
    
    if (approved) {
      complaint.status = 'verified';
      complaint.verification = {
        verifiedBy: req.userId,
        verifiedAt: new Date(),
        notes,
        rating
      };
      complaint.timeline.verifiedAt = new Date();
    } else {
      complaint.status = 'assigned';
      complaint.technicianNotes.push({
        note: `REWORK REQUIRED: ${notes}`,
        createdBy: req.userId,
        createdAt: new Date()
      });
    }
    
    await complaint.save();
    
    res.json({
      success: true,
      data: complaint,
      message: approved ? 'Complaint verified' : 'Complaint rejected for rework'
    });
  } catch (error) {
    console.error('Verify complaint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== ADD FEEDBACK ====================
exports.addFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, resolvedSatisfactorily } = req.body;
    
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }
    
    // Only customer who raised the complaint can give feedback
    if (complaint.customerId?.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    
    complaint.customerFeedback = {
      rating,
      comment,
      resolvedSatisfactorily,
      submittedAt: new Date()
    };
    complaint.status = 'closed';
    complaint.timeline.closedAt = new Date();
    
    await complaint.save();
    
    res.json({
      success: true,
      data: complaint,
      message: 'Feedback submitted. Complaint closed.'
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== ESCALATE COMPLAINT ====================
exports.escalateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }
    
    const newLevel = (complaint.escalation?.level || 0) + 1;
    
    complaint.escalation = {
      level: newLevel,
      reason,
      escalatedAt: new Date(),
      escalatedTo: req.userId
    };
    
    await complaint.save();
    
    res.json({
      success: true,
      data: complaint,
      message: `Complaint escalated to level ${newLevel}`
    });
  } catch (error) {
    console.error('Escalate complaint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== UPLOAD EVIDENCE ====================
exports.uploadEvidence = async (req, res) => {
  try {
    const { id } = req.params;
    const { images, videos, voiceNote } = req.body;
    
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }
    
    if (images && images.length) {
      complaint.evidence.images.push(...images);
    }
    
    if (videos && videos.length) {
      complaint.evidence.videos.push(...videos);
    }
    
    if (voiceNote) {
      complaint.evidence.voiceNote = voiceNote;
    }
    
    await complaint.save();
    
    res.json({
      success: true,
      data: complaint,
      message: 'Evidence uploaded successfully'
    });
  } catch (error) {
    console.error('Upload evidence error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== DASHBOARD STATISTICS ====================
exports.getDashboardStats = async (req, res) => {
  try {
    const query = { isDeleted: false };
    
    // Role-based filtering
    if (req.userRole === 'technician') {
      query['assignment.assignedTo'] = req.userId;
    } else if (req.userRole === 'supervisor') {
      const team = await User.find({ supervisor: req.userId }).distinct('_id');
      query['assignment.assignedTo'] = { $in: team };
    } else if (req.userRole === 'manager') {
      const team = await User.find({ reportingManager: req.userId }).distinct('_id');
      query['assignment.assignedTo'] = { $in: team };
    }
    
    const stats = await Complaint.aggregate([
      { $match: query },
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);
    
    const priorityStats = await Complaint.aggregate([
      { $match: query },
      { $group: {
        _id: '$priority',
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
      slaBreached: await Complaint.countDocuments({ ...query, slaBreached: true }),
      byPriority: { low: 0, medium: 0, high: 0, urgent: 0 }
    };
    
    stats.forEach(s => {
      if (s._id === 'open') result.open = s.count;
      if (s._id === 'assigned') result.assigned = s.count;
      if (s._id === 'in_progress') result.inProgress = s.count;
      if (s._id === 'completed') result.completed = s.count;
      if (s._id === 'verified') result.verified = s.count;
      if (s._id === 'closed') result.closed = s.count;
    });
    
    priorityStats.forEach(p => {
      if (p._id) result.byPriority[p._id] = p.count;
    });
    
    result.total = result.open + result.assigned + result.inProgress + result.completed + result.verified + result.closed;
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper Functions
async function notifyManagers(complaint) {
  // Implementation for email/push notification
  console.log(`New complaint ${complaint.ticketNumber} raised`);
}

async function notifyTechnician(complaint, technician) {
  // Implementation for push notification
  console.log(`Complaint ${complaint.ticketNumber} assigned to ${technician.email}`);
}

async function notifySupervisor(complaint) {
  // Implementation for push notification
  console.log(`Complaint ${complaint.ticketNumber} ready for verification`);
}

module.exports = exports;