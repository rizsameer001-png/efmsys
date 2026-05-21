// server/src/controllers/visitorPass.controller.js
const VisitorPass = require('../models/VisitorPass.model');

/**
 * Request a new visitor pass
 */
exports.requestPass = async (req, res) => {
  try {
    const { visitorName, visitorPhone, purpose, visitDate, visitTime, vehicleNumber } = req.body;
    const userId = req.user._id;
    
    // Validate required fields
    if (!visitorName || !visitorPhone || !purpose || !visitDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: visitorName, visitorPhone, purpose, visitDate'
      });
    }
    
    const pass = new VisitorPass({
      userId,
      visitorName,
      visitorPhone,
      purpose,
      visitDate: new Date(visitDate),
      visitTime: visitTime || null,
      vehicleNumber: vehicleNumber || null,
      status: 'pending',
      requestedAt: new Date()
    });
    
    await pass.save();
    await pass.populate('userId', 'firstName lastName email phone');
    
    res.status(201).json({
      success: true,
      data: pass,
      message: 'Visitor pass requested successfully'
    });
  } catch (error) {
    console.error('Request pass error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get active visitor passes for current user
 */
exports.getActivePasses = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const passes = await VisitorPass.find({
      userId,
      status: 'approved',
      visitDate: { $gte: new Date() }
    }).sort({ visitDate: 1 });
    
    res.json({ success: true, data: passes });
  } catch (error) {
    console.error('Get active passes error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get pending visitor pass requests
 */
exports.getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const passes = await VisitorPass.find({
      userId,
      status: 'pending'
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, data: passes });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get visitor pass history
 */
exports.getVisitorHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, fromDate, toDate } = req.query;
    
    const query = { userId };
    
    if (fromDate || toDate) {
      query.visitDate = {};
      if (fromDate) query.visitDate.$gte = new Date(fromDate);
      if (toDate) query.visitDate.$lte = new Date(toDate);
    }
    
    const skip = (page - 1) * limit;
    
    const [passes, total] = await Promise.all([
      VisitorPass.find(query)
        .sort({ visitDate: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      VisitorPass.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: passes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get visitor history error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get upcoming passes
 */
exports.getUpcomingPasses = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 7 } = req.query;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));
    
    const passes = await VisitorPass.find({
      userId,
      status: 'approved',
      visitDate: { $gte: new Date(), $lte: endDate }
    }).sort({ visitDate: 1 });
    
    res.json({ success: true, data: passes });
  } catch (error) {
    console.error('Get upcoming passes error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get visitor pass by ID
 */
exports.getPassById = async (req, res) => {
  try {
    const { passId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;
    
    const pass = await VisitorPass.findById(passId)
      .populate('userId', 'firstName lastName email phone');
    
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Visitor pass not found' });
    }
    
    // Check permission
    if (pass.userId._id.toString() !== userId.toString() && 
        !['admin', 'super_admin', 'security'].includes(userRole)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    res.json({ success: true, data: pass });
  } catch (error) {
    console.error('Get pass by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Cancel a visitor pass request
 */
exports.cancelPass = async (req, res) => {
  try {
    const { passId } = req.params;
    const userId = req.user._id;
    
    const pass = await VisitorPass.findOne({ _id: passId, userId });
    
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Visitor pass not found' });
    }
    
    if (pass.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending requests can be cancelled'
      });
    }
    
    pass.status = 'cancelled';
    await pass.save();
    
    res.json({ success: true, message: 'Visitor pass cancelled successfully' });
  } catch (error) {
    console.error('Cancel pass error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update visitor pass (for pending only)
 */
exports.updatePass = async (req, res) => {
  try {
    const { passId } = req.params;
    const userId = req.user._id;
    const updates = req.body;
    
    const pass = await VisitorPass.findOne({ _id: passId, userId });
    
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Visitor pass not found' });
    }
    
    if (pass.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending requests can be updated'
      });
    }
    
    const allowedUpdates = ['visitorName', 'visitorPhone', 'purpose', 'visitDate', 'visitTime', 'vehicleNumber'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        pass[field] = updates[field];
      }
    });
    
    await pass.save();
    
    res.json({ success: true, data: pass, message: 'Visitor pass updated successfully' });
  } catch (error) {
    console.error('Update pass error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete visitor pass (for pending only)
 */
exports.deletePass = async (req, res) => {
  try {
    const { passId } = req.params;
    const userId = req.user._id;
    
    const pass = await VisitorPass.findOne({ _id: passId, userId });
    
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Visitor pass not found' });
    }
    
    if (pass.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending requests can be deleted'
      });
    }
    
    await pass.deleteOne();
    
    res.json({ success: true, message: 'Visitor pass deleted successfully' });
  } catch (error) {
    console.error('Delete pass error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Download visitor pass PDF
 */
exports.downloadPassPDF = async (req, res) => {
  try {
    const { passId } = req.params;
    
    const pass = await VisitorPass.findById(passId).populate('userId', 'firstName lastName email phone');
    
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Visitor pass not found' });
    }
    
    // Generate PDF (simplified for now)
    const pdfContent = `
      VISITOR PASS
      Pass ID: ${pass._id}
      Visitor: ${pass.visitorName}
      Phone: ${pass.visitorPhone}
      Purpose: ${pass.purpose}
      Date: ${new Date(pass.visitDate).toLocaleDateString()}
      Status: ${pass.status}
    `;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=visitor_pass_${passId}.pdf`);
    res.send(pdfContent);
  } catch (error) {
    console.error('Download PDF error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Send visitor pass via SMS/Email
 */
exports.sendPassViaMessage = async (req, res) => {
  try {
    const { passId } = req.params;
    const { sms, email } = req.body;
    
    const pass = await VisitorPass.findById(passId).populate('userId', 'firstName lastName email phone');
    
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Visitor pass not found' });
    }
    
    // In production, integrate with SMS/Email service
    console.log(`Sending pass ${passId} via SMS: ${sms}, Email: ${email}`);
    
    res.json({ success: true, message: 'Visitor pass sent successfully' });
  } catch (error) {
    console.error('Send pass error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== ADMIN/SECURITY ENDPOINTS ====================

/**
 * Check-in visitor (security)
 */
exports.checkInVisitor = async (req, res) => {
  try {
    const { passId } = req.params;
    const { notes, photo } = req.body;
    
    const pass = await VisitorPass.findById(passId);
    
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Visitor pass not found' });
    }
    
    pass.checkIn = {
      time: new Date(),
      checkedBy: req.user._id,
      notes: notes || null,
      photo: photo || null
    };
    pass.status = 'active';
    await pass.save();
    
    res.json({ success: true, data: pass, message: 'Visitor checked in successfully' });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Check-out visitor (security)
 */
exports.checkOutVisitor = async (req, res) => {
  try {
    const { passId } = req.params;
    const { notes } = req.body;
    
    const pass = await VisitorPass.findById(passId);
    
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Visitor pass not found' });
    }
    
    pass.checkOut = {
      time: new Date(),
      checkedBy: req.user._id,
      notes: notes || null
    };
    pass.status = 'completed';
    await pass.save();
    
    res.json({ success: true, data: pass, message: 'Visitor checked out successfully' });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Approve visitor pass (admin)
 */
exports.approvePass = async (req, res) => {
  try {
    const { passId } = req.params;
    const { approved, remarks } = req.body;
    
    const pass = await VisitorPass.findById(passId);
    
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Visitor pass not found' });
    }
    
    pass.status = approved ? 'approved' : 'pending';
    if (remarks) {
      pass.adminRemarks = remarks;
    }
    pass.approvedAt = new Date();
    pass.approvedBy = req.user._id;
    await pass.save();
    
    res.json({
      success: true,
      data: pass,
      message: approved ? 'Visitor pass approved' : 'Visitor pass requires review'
    });
  } catch (error) {
    console.error('Approve pass error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Reject visitor pass (admin)
 */
exports.rejectPass = async (req, res) => {
  try {
    const { passId } = req.params;
    const { reason } = req.body;
    
    const pass = await VisitorPass.findById(passId);
    
    if (!pass) {
      return res.status(404).json({ success: false, error: 'Visitor pass not found' });
    }
    
    pass.status = 'rejected';
    pass.rejectionReason = reason;
    pass.rejectedAt = new Date();
    pass.rejectedBy = req.user._id;
    await pass.save();
    
    res.json({ success: true, data: pass, message: 'Visitor pass rejected' });
  } catch (error) {
    console.error('Reject pass error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get all visitor passes (admin)
 */
exports.getAllPasses = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, fromDate, toDate } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }
    
    const skip = (page - 1) * limit;
    
    const [passes, total] = await Promise.all([
      VisitorPass.find(query)
        .populate('userId', 'firstName lastName email phone')
        .populate('approvedBy', 'firstName lastName')
        .populate('rejectedBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      VisitorPass.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: passes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all passes error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get visitor pass analytics (admin)
 */
exports.getPassAnalytics = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), month } = req.query;
    
    const matchQuery = {};
    if (year) {
      matchQuery.createdAt = {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31)
      };
    }
    if (month) {
      matchQuery.createdAt = {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0)
      };
    }
    
    const stats = await VisitorPass.aggregate([
      { $match: matchQuery },
      { $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const monthlyTrend = await VisitorPass.aggregate([
      { $match: matchQuery },
      { $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        statusBreakdown: stats,
        monthlyTrend,
        total: stats.reduce((sum, s) => sum + s.count, 0)
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Export visitor passes (admin)
 */
exports.exportPasses = async (req, res) => {
  try {
    const { fromDate, toDate, format = 'csv' } = req.query;
    
    const query = {};
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }
    
    const passes = await VisitorPass.find(query)
      .populate('userId', 'firstName lastName email');
    
    if (format === 'csv') {
      const csvHeaders = ['Pass ID', 'Visitor Name', 'Visitor Phone', 'Purpose', 'Visit Date', 'Status', 'Requested By', 'Requested At'];
      const csvRows = passes.map(pass => [
        pass._id,
        pass.visitorName,
        pass.visitorPhone,
        pass.purpose,
        new Date(pass.visitDate).toISOString().split('T')[0],
        pass.status,
        `${pass.userId?.firstName || ''} ${pass.userId?.lastName || ''}`,
        pass.createdAt.toISOString()
      ]);
      
      const csv = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=visitor_passes_${Date.now()}.csv`);
      return res.send(csv);
    }
    
    res.json({ success: true, data: passes, count: passes.length });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Bulk approve passes (admin)
 */
exports.bulkApprovePasses = async (req, res) => {
  try {
    const { passIds, remarks } = req.body;
    
    if (!passIds || !Array.isArray(passIds) || passIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of pass IDs'
      });
    }
    
    const result = await VisitorPass.updateMany(
      { _id: { $in: passIds }, status: 'pending' },
      {
        status: 'approved',
        approvedBy: req.user._id,
        approvedAt: new Date(),
        adminRemarks: remarks
      }
    );
    
    res.json({
      success: true,
      message: `${result.modifiedCount} visitor passes approved`,
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk approve error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Bulk reject passes (admin)
 */
exports.bulkRejectPasses = async (req, res) => {
  try {
    const { passIds, reason } = req.body;
    
    if (!passIds || !Array.isArray(passIds) || passIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of pass IDs'
      });
    }
    
    const result = await VisitorPass.updateMany(
      { _id: { $in: passIds }, status: 'pending' },
      {
        status: 'rejected',
        rejectedBy: req.user._id,
        rejectedAt: new Date(),
        rejectionReason: reason
      }
    );
    
    res.json({
      success: true,
      message: `${result.modifiedCount} visitor passes rejected`,
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk reject error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get visitor pass statistics (admin)
 */
exports.getVisitorStats = async (req, res) => {
  try {
    const total = await VisitorPass.countDocuments();
    const active = await VisitorPass.countDocuments({ status: 'active' });
    const pending = await VisitorPass.countDocuments({ status: 'pending' });
    const approved = await VisitorPass.countDocuments({ status: 'approved' });
    const rejected = await VisitorPass.countDocuments({ status: 'rejected' });
    const completed = await VisitorPass.countDocuments({ status: 'completed' });
    
    res.json({
      success: true,
      data: {
        total,
        active,
        pending,
        approved,
        rejected,
        completed
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};