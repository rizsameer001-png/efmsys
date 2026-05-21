// server/src/controllers/notification.controller.js
const Notification = require('../models/Notification.model');
const User = require('../models/User.model');

// ==================== SEND NOTIFICATIONS ====================

/**
 * Send notification to specific users
 */
exports.sendNotification = async (req, res) => {
  try {
    const { title, body, type, priority, targetUsers, targetRoles, targetDepartments, data } = req.body;
    const senderId = req.user._id;
    const senderRole = req.user.role;
    
    let recipients = [];
    
    // Determine recipients based on target criteria
    if (targetUsers && targetUsers.length > 0) {
      recipients = targetUsers;
    } else if (targetRoles && targetRoles.length > 0) {
      const users = await User.find({ role: { $in: targetRoles }, status: 'active' });
      recipients = users.map(u => u._id);
    } else if (targetDepartments && targetDepartments.length > 0) {
      const users = await User.find({ department: { $in: targetDepartments }, status: 'active' });
      recipients = users.map(u => u._id);
    } else {
      return res.status(400).json({ success: false, error: 'No recipients specified' });
    }
    
    // Create notifications for all recipients
    const notifications = recipients.map(recipientId => ({
      userId: recipientId,
      title,
      body,
      type: type || 'system',
      priority: priority || 'medium',
      data: data || {},
      createdBy: senderId,
      createdByRole: senderRole
    }));
    
    const created = await Notification.insertMany(notifications);
    
    // Emit socket events for real-time notifications
    const io = req.app.get('io');
    recipients.forEach(recipientId => {
      io.to(`user_${recipientId}`).emit('new_notification', {
        count: 1,
        notification: created.find(n => n.userId.toString() === recipientId.toString())
      });
    });
    
    res.status(201).json({
      success: true,
      data: created,
      message: `Notification sent to ${recipients.length} recipients`
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Send notification to a team (Manager/Supervisor only)
 */
exports.sendTeamNotification = async (req, res) => {
  try {
    const { title, body, type, priority, data } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;
    
    let teamIds = [];
    
    // Get team members based on role
    if (userRole === 'manager') {
      const team = await User.find({ reportingManager: userId, status: 'active' });
      teamIds = team.map(m => m._id);
    } else if (userRole === 'supervisor') {
      const team = await User.find({ supervisor: userId, status: 'active' });
      teamIds = team.map(m => m._id);
    } else {
      return res.status(403).json({ success: false, error: 'Only managers and supervisors can send team notifications' });
    }
    
    if (teamIds.length === 0) {
      return res.status(400).json({ success: false, error: 'No team members found' });
    }
    
    const notifications = teamIds.map(teamId => ({
      userId: teamId,
      title,
      body,
      type: type || 'system',
      priority: priority || 'medium',
      data: { ...data, senderId: userId, senderRole: userRole },
      createdBy: userId,
      createdByRole: userRole
    }));
    
    const created = await Notification.insertMany(notifications);
    
    // Emit socket events
    const io = req.app.get('io');
    teamIds.forEach(teamId => {
      io.to(`user_${teamId}`).emit('new_notification', {
        count: 1,
        notification: created.find(n => n.userId.toString() === teamId.toString())
      });
    });
    
    res.status(201).json({
      success: true,
      data: created,
      message: `Notification sent to ${teamIds.length} team members`
    });
  } catch (error) {
    console.error('Send team notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Send broadcast notification (Super Admin/Admin only)
 */
exports.sendBroadcastNotification = async (req, res) => {
  try {
    const { title, body, type, priority, data, roles, departments } = req.body;
    const userId = req.user._id;
    
    // Check permission
    if (!['super_admin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Only admins can send broadcast notifications' });
    }
    
    let query = { status: 'active' };
    if (roles && roles.length > 0) {
      query.role = { $in: roles };
    }
    if (departments && departments.length > 0) {
      query.department = { $in: departments };
    }
    
    const users = await User.find(query);
    
    if (users.length === 0) {
      return res.status(400).json({ success: false, error: 'No recipients found' });
    }
    
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      body,
      type: type || 'system',
      priority: priority || 'medium',
      data: { ...data, broadcast: true, senderId: userId },
      createdBy: userId,
      createdByRole: req.user.role
    }));
    
    const created = await Notification.insertMany(notifications);
    
    // Emit socket events
    const io = req.app.get('io');
    users.forEach(user => {
      io.to(`user_${user._id}`).emit('new_notification', {
        count: 1,
        notification: created.find(n => n.userId.toString() === user._id.toString())
      });
    });
    
    res.status(201).json({
      success: true,
      data: created,
      message: `Broadcast sent to ${users.length} users`
    });
  } catch (error) {
    console.error('Send broadcast error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET NOTIFICATIONS ====================

/**
 * Get all notifications for current user
 */
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, type, isRead } = req.query;
    
    const query = { userId };
    if (type && type !== 'all') query.type = type;
    if (isRead !== undefined) query.isRead = isRead === 'true';
    
    const skip = (page - 1) * limit;
    
    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'firstName lastName email role'),
      Notification.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get notification statistics
 */
exports.getNotificationStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const total = await Notification.countDocuments({ userId });
    const unread = await Notification.countDocuments({ userId, isRead: false });
    const read = total - unread;
    
    const byType = await Notification.aggregate([
      { $match: { userId } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    const typeStats = {};
    byType.forEach(t => { typeStats[t._id] = t.count; });
    
    res.json({
      success: true,
      data: { total, unread, read, byType: typeStats }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== ADMIN NOTIFICATION MANAGEMENT ====================

/**
 * Get all notifications (Admin only)
 */
exports.getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, type, status, startDate, endDate } = req.query;
    
    const query = {};
    if (userId) query.userId = userId;
    if (type && type !== 'all') query.type = type;
    if (status === 'read') query.isRead = true;
    if (status === 'unread') query.isRead = false;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const skip = (page - 1) * limit;
    
    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'firstName lastName email role')
        .populate('createdBy', 'firstName lastName email role'),
      Notification.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete notification (Admin only)
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    
    await notification.deleteOne();
    
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Bulk delete notifications (Admin only)
 */
exports.bulkDeleteNotifications = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    
    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Please provide an array of notification IDs' });
    }
    
    const result = await Notification.deleteMany({ _id: { $in: notificationIds } });
    
    res.json({
      success: true,
      message: `${result.deletedCount} notifications deleted`,
      count: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get notification templates (Admin only)
 */
exports.getNotificationTemplates = async (req, res) => {
  try {
    const templates = [
      { id: 'task_assigned', name: 'Task Assigned', subject: 'New Task Assigned', body: 'A new task "{task.title}" has been assigned to you.' },
      { id: 'task_completed', name: 'Task Completed', subject: 'Task Completed', body: 'Task "{task.title}" has been marked as completed.' },
      { id: 'task_verified', name: 'Task Verified', subject: 'Task Verified', body: 'Task "{task.title}" has been verified and closed.' },
      { id: 'complaint_raised', name: 'Complaint Raised', subject: 'New Complaint', body: 'A new complaint "{complaint.title}" has been raised.' },
      { id: 'complaint_resolved', name: 'Complaint Resolved', subject: 'Complaint Resolved', body: 'Your complaint "{complaint.title}" has been resolved.' },
      { id: 'leave_approved', name: 'Leave Approved', subject: 'Leave Approved', body: 'Your leave request from {leave.fromDate} to {leave.toDate} has been approved.' },
      { id: 'leave_rejected', name: 'Leave Rejected', subject: 'Leave Rejected', body: 'Your leave request has been rejected. Reason: {leave.reason}' },
      { id: 'attendance_reminder', name: 'Attendance Reminder', subject: 'Attendance Reminder', body: 'Please mark your attendance for today.' },
      { id: 'salary_generated', name: 'Salary Generated', subject: 'Salary Generated', body: 'Your salary for {salary.month} has been generated.' },
      { id: 'general_announcement', name: 'General Announcement', subject: 'Announcement', body: '{message}' }
    ];
    
    res.json({ success: true, data: templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};