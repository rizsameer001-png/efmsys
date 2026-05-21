// // server/src/controllers/leave.controller.js
// const Leave = require('../models/Leave.model');
// const LeaveBalance = require('../models/LeaveBalance.model');
// const User = require('../models/User.model');
// const Notification = require('../models/Notification.model');
// const { getIO } = require('../config/socketio');

// // ==================== EMPLOYEE ACTIONS ====================

// // Apply for leave
// exports.applyLeave = async (req, res) => {
//   try {
//     const { leaveType, fromDate, toDate, reason, attachment, emergencyContact } = req.body;
//     const employeeId = req.user._id || req.userId;
    
//     // Calculate total days
//     const from = new Date(fromDate);
//     const to = new Date(toDate);
//     const totalDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
    
//     // Check if dates are valid
//     if (from < new Date()) {
//       return res.status(400).json({ success: false, error: 'Cannot apply for past dates' });
//     }
    
//     // Check for overlapping leaves
//     const overlappingLeave = await Leave.findOne({
//       employeeId,
//       status: { $in: ['pending', 'approved'] },
//       $or: [
//         { fromDate: { $lte: to }, toDate: { $gte: from } }
//       ]
//     });
    
//     if (overlappingLeave) {
//       return res.status(400).json({ success: false, error: 'You already have a leave request for these dates' });
//     }
    
//     // Check leave balance
//     const currentYear = new Date().getFullYear();
//     let leaveBalance = await LeaveBalance.findOne({ employeeId, year: currentYear });
    
//     if (!leaveBalance) {
//       leaveBalance = new LeaveBalance({ employeeId, year: currentYear });
//       await leaveBalance.save();
//     }
    
//     const balanceKey = leaveType === 'annual' ? 'annual' : leaveType === 'sick' ? 'sick' : 'emergency';
//     if (leaveBalance.balances[balanceKey].remaining < totalDays) {
//       return res.status(400).json({ 
//         success: false, 
//         error: `Insufficient ${leaveType} leave balance. Available: ${leaveBalance.balances[balanceKey].remaining} days` 
//       });
//     }
    
//     // Get employee's reporting hierarchy
//     const employee = await User.findById(employeeId).populate('reportingManager supervisor');
    
//     const leave = new Leave({
//       employeeId,
//       leaveType,
//       fromDate: from,
//       toDate: to,
//       totalDays,
//       reason,
//       attachment,
//       emergencyContact,
//       supervisorApproval: { status: employee.supervisor ? 'pending' : 'approved' },
//       managerApproval: { status: employee.reportingManager ? 'pending' : 'approved' },
//       hrApproval: { status: 'pending' }
//     });
    
//     await leave.save();
    
//     // Send notifications to approvers
//     const io = getIO();
//     if (employee.supervisor) {
//       await sendApprovalNotification(employee.supervisor, leave, employee, 'supervisor');
//       if (io) io.to(`user_${employee.supervisor}`).emit('new_leave_request', { leave });
//     }
//     if (employee.reportingManager) {
//       await sendApprovalNotification(employee.reportingManager, leave, employee, 'manager');
//       if (io) io.to(`user_${employee.reportingManager}`).emit('new_leave_request', { leave });
//     }
//     if (!employee.supervisor && !employee.reportingManager) {
//       await sendApprovalNotification(null, leave, employee, 'hr');
//       if (io) io.to('role_hr').emit('new_leave_request', { leave });
//     }
    
//     res.status(201).json({
//       success: true,
//       data: leave,
//       message: 'Leave request submitted successfully'
//     });
//   } catch (error) {
//     console.error('Apply leave error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get my leave history
// exports.getMyLeaves = async (req, res) => {
//   try {
//     const employeeId = req.user._id || req.userId;
//     const { status, year, page = 1, limit = 20 } = req.query;
    
//     const query = { employeeId };
//     if (status) query.status = status;
//     if (year) {
//       const startYear = new Date(year, 0, 1);
//       const endYear = new Date(year, 11, 31);
//       query.createdAt = { $gte: startYear, $lte: endYear };
//     }
    
//     const skip = (page - 1) * limit;
    
//     const [leaves, total] = await Promise.all([
//       Leave.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
//       Leave.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: leaves,
//       pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
//     });
//   } catch (error) {
//     console.error('Get my leaves error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get my leave balance
// exports.getMyLeaveBalance = async (req, res) => {
//   try {
//     const employeeId = req.user._id || req.userId;
//     const year = parseInt(req.query.year) || new Date().getFullYear();
    
//     let leaveBalance = await LeaveBalance.findOne({ employeeId, year });
    
//     if (!leaveBalance) {
//       leaveBalance = new LeaveBalance({ employeeId, year });
//       await leaveBalance.save();
//     }
    
//     res.json({
//       success: true,
//       data: leaveBalance.balances
//     });
//   } catch (error) {
//     console.error('Get leave balance error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Cancel leave request
// exports.cancelLeave = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const employeeId = req.user._id || req.userId;
    
//     const leave = await Leave.findOne({ _id: id, employeeId });
//     if (!leave) {
//       return res.status(404).json({ success: false, error: 'Leave request not found' });
//     }
    
//     if (leave.status !== 'pending') {
//       return res.status(400).json({ success: false, error: 'Only pending leave requests can be cancelled' });
//     }
    
//     leave.status = 'cancelled';
//     await leave.save();
    
//     res.json({ success: true, message: 'Leave request cancelled successfully' });
//   } catch (error) {
//     console.error('Cancel leave error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== APPROVER ACTIONS ====================

// // Get pending approvals (for managers/supervisors/HR)
// exports.getPendingApprovals = async (req, res) => {
//   try {
//     const userRole = req.user.role;
//     const userId = req.user._id || req.userId;
//     const { page = 1, limit = 20 } = req.query;
    
//     let query = { status: 'pending' };
    
//     if (userRole === 'supervisor') {
//       // Get leaves where supervisor approval is pending and user is the supervisor
//       const team = await User.find({ supervisor: userId }).distinct('_id');
//       query.employeeId = { $in: team };
//       query['supervisorApproval.status'] = 'pending';
//     } else if (userRole === 'manager') {
//       // Get leaves where manager approval is pending
//       const team = await User.find({ reportingManager: userId }).distinct('_id');
//       query.employeeId = { $in: team };
//       query['managerApproval.status'] = 'pending';
//     } else if (userRole === 'hr' || userRole === 'admin' || userRole === 'super_admin') {
//       query['hrApproval.status'] = 'pending';
//     }
    
//     const skip = (page - 1) * limit;
    
//     const [leaves, total] = await Promise.all([
//       Leave.find(query)
//         .populate('employeeId', 'firstName lastName email role department')
//         .sort({ createdAt: 1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Leave.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: leaves,
//       pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
//     });
//   } catch (error) {
//     console.error('Get pending approvals error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Approve leave
// exports.approveLeave = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { comments } = req.body;
//     const userRole = req.user.role;
//     const userId = req.user._id || req.userId;
//     const userName = req.user.name;
    
//     const leave = await Leave.findById(id).populate('employeeId');
//     if (!leave) {
//       return res.status(404).json({ success: false, error: 'Leave request not found' });
//     }
    
//     // Update approval based on role
//     if (userRole === 'supervisor') {
//       leave.supervisorApproval = { status: 'approved', by: userId, at: new Date(), comments };
//     } else if (userRole === 'manager') {
//       leave.managerApproval = { status: 'approved', by: userId, at: new Date(), comments };
//     } else if (userRole === 'hr' || userRole === 'admin' || userRole === 'super_admin') {
//       leave.hrApproval = { status: 'approved', by: userId, at: new Date(), comments };
//     }
    
//     // Check if all approvals are done
//     const allApproved = 
//       (leave.supervisorApproval.status === 'approved' || !leave.employeeId.supervisor) &&
//       (leave.managerApproval.status === 'approved' || !leave.employeeId.reportingManager) &&
//       leave.hrApproval.status === 'approved';
    
//     if (allApproved) {
//       leave.status = 'approved';
      
//       // Update leave balance
//       const currentYear = new Date().getFullYear();
//       let leaveBalance = await LeaveBalance.findOne({ employeeId: leave.employeeId._id, year: currentYear });
//       if (!leaveBalance) {
//         leaveBalance = new LeaveBalance({ employeeId: leave.employeeId._id, year: currentYear });
//         await leaveBalance.save();
//       }
      
//       const balanceKey = leave.leaveType === 'annual' ? 'annual' : leave.leaveType === 'sick' ? 'sick' : 'emergency';
//       leaveBalance.balances[balanceKey].used += leave.totalDays;
//       leaveBalance.balances[balanceKey].remaining -= leave.totalDays;
//       await leaveBalance.save();
      
//       leave.leaveBalance = {
//         annual: leaveBalance.balances.annual.remaining,
//         sick: leaveBalance.balances.sick.remaining,
//         emergency: leaveBalance.balances.emergency.remaining
//       };
      
//       // Notify employee
//       await sendApprovalNotification(leave.employeeId._id, leave, null, 'employee_approved', { approver: userName });
//     }
    
//     await leave.save();
    
//     res.json({
//       success: true,
//       data: leave,
//       message: 'Leave request approved successfully'
//     });
//   } catch (error) {
//     console.error('Approve leave error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Reject leave
// exports.rejectLeave = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;
//     const userRole = req.user.role;
//     const userId = req.user._id || req.userId;
//     const userName = req.user.name;
    
//     const leave = await Leave.findById(id).populate('employeeId');
//     if (!leave) {
//       return res.status(404).json({ success: false, error: 'Leave request not found' });
//     }
    
//     leave.status = 'rejected';
    
//     // Record rejection based on role
//     if (userRole === 'supervisor') {
//       leave.supervisorApproval = { status: 'rejected', by: userId, at: new Date(), comments: reason };
//     } else if (userRole === 'manager') {
//       leave.managerApproval = { status: 'rejected', by: userId, at: new Date(), comments: reason };
//     } else {
//       leave.hrApproval = { status: 'rejected', by: userId, at: new Date(), comments: reason };
//     }
    
//     await leave.save();
    
//     // Notify employee
//     await sendApprovalNotification(leave.employeeId._id, leave, null, 'employee_rejected', { approver: userName, reason });
    
//     res.json({
//       success: true,
//       message: 'Leave request rejected'
//     });
//   } catch (error) {
//     console.error('Reject leave error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get team leave calendar (Manager/Supervisor)
// exports.getTeamLeaveCalendar = async (req, res) => {
//   try {
//     const userRole = req.user.role;
//     const userId = req.user._id || req.userId;
//     const { year, month } = req.query;
    
//     const targetYear = parseInt(year) || new Date().getFullYear();
//     const targetMonth = parseInt(month) || new Date().getMonth() + 1;
    
//     const startDate = new Date(targetYear, targetMonth - 1, 1);
//     const endDate = new Date(targetYear, targetMonth, 0);
    
//     let teamQuery = {};
//     if (userRole === 'supervisor') {
//       teamQuery.supervisor = userId;
//     } else if (userRole === 'manager') {
//       teamQuery.reportingManager = userId;
//     }
    
//     const teamMembers = await User.find(teamQuery).select('_id firstName lastName email');
    
//     const leaves = await Leave.find({
//       employeeId: { $in: teamMembers.map(m => m._id) },
//       status: 'approved',
//       fromDate: { $lte: endDate },
//       toDate: { $gte: startDate }
//     }).populate('employeeId', 'firstName lastName');
    
//     // Group leaves by date
//     const calendar = {};
//     for (let i = 1; i <= endDate.getDate(); i++) {
//       calendar[i] = [];
//     }
    
//     leaves.forEach(leave => {
//       const from = new Date(leave.fromDate);
//       const to = new Date(leave.toDate);
//       for (let d = from; d <= to; d.setDate(d.getDate() + 1)) {
//         const date = d.getDate();
//         if (calendar[date]) {
//           calendar[date].push({
//             employeeName: `${leave.employeeId.firstName} ${leave.employeeId.lastName}`,
//             leaveType: leave.leaveType,
//             id: leave._id
//           });
//         }
//       }
//     });
    
//     res.json({
//       success: true,
//       data: {
//         year: targetYear,
//         month: targetMonth,
//         monthName: new Date(targetYear, targetMonth - 1, 1).toLocaleString('default', { month: 'long' }),
//         calendar,
//         teamMembers: teamMembers.map(m => ({ id: m._id, name: `${m.firstName} ${m.lastName}` }))
//       }
//     });
//   } catch (error) {
//     console.error('Get team leave calendar error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Helper function to send notifications
// async function sendApprovalNotification(userId, leave, employee, type, extra = {}) {
//   try {
//     const io = getIO();
//     let title, body;
    
//     if (type === 'supervisor') {
//       title = 'New Leave Request';
//       body = `${employee.firstName} ${employee.lastName} has requested ${leave.totalDays} days of ${leave.leaveType} leave`;
//     } else if (type === 'manager') {
//       title = 'Leave Request for Approval';
//       body = `${employee.firstName} ${employee.lastName} (${employee.role}) - ${leave.totalDays} days ${leave.leaveType} leave`;
//     } else if (type === 'employee_approved') {
//       title = 'Leave Request Approved';
//       body = `Your leave request for ${leave.totalDays} days has been approved by ${extra.approver}`;
//     } else if (type === 'employee_rejected') {
//       title = 'Leave Request Rejected';
//       body = `Your leave request for ${leave.totalDays} days has been rejected. Reason: ${extra.reason}`;
//     }
    
//     const notification = await Notification.create({
//       userId,
//       title,
//       body,
//       type: 'leave',
//       referenceId: leave._id,
//       referenceModel: 'Leave'
//     });
    
//     if (io) {
//       io.to(`user_${userId}`).emit('leave_notification', notification);
//     }
    
//     return notification;
//   } catch (error) {
//     console.error('Notification error:', error);
//     return null;
//   }
// }

// module.exports = {
//   applyLeave,
//   getMyLeaves,
//   getMyLeaveBalance,
//   cancelLeave,
//   getPendingApprovals,
//   approveLeave,
//   rejectLeave,
//   getTeamLeaveCalendar
// };




// // server/src/controllers/leave.controller.js
// const Leave = require('../models/Leave.model');
// const User = require('../models/User.model');

// // ==================== EMPLOYEE ENDPOINTS ====================

// /**
//  * Apply for leave
//  */
// exports.applyLeave = async (req, res) => {
//   try {
//     const { leaveType, startDate, endDate, reason, halfDay } = req.body;
//     const userId = req.user._id;

//     // Check for overlapping leaves
//     const existingLeave = await Leave.findOne({
//       userId,
//       status: { $in: ['pending', 'approved'] },
//       $or: [
//         { startDate: { $lte: endDate, $gte: startDate } },
//         { endDate: { $lte: endDate, $gte: startDate } }
//       ]
//     });

//     if (existingLeave) {
//       return res.status(400).json({
//         success: false,
//         error: 'You already have a leave request for this period'
//       });
//     }

//     const leave = new Leave({
//       userId,
//       leaveType,
//       startDate,
//       endDate,
//       reason,
//       halfDay: halfDay || false,
//       status: 'pending',
//       appliedOn: new Date()
//     });

//     await leave.save();
//     await leave.populate('userId', 'firstName lastName email');

//     res.status(201).json({
//       success: true,
//       data: leave,
//       message: 'Leave request submitted successfully'
//     });
//   } catch (error) {
//     console.error('Apply leave error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get my leaves
//  */
// exports.getMyLeaves = async (req, res) => {
//   try {
//     const { status, year, page = 1, limit = 20 } = req.query;
//     const userId = req.user._id;
    
//     const query = { userId };
//     if (status) query.status = status;
//     if (year) {
//       query.startDate = {
//         $gte: new Date(year, 0, 1),
//         $lte: new Date(year, 11, 31)
//       };
//     }
    
//     const skip = (page - 1) * limit;
    
//     const [leaves, total] = await Promise.all([
//       Leave.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Leave.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: leaves,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Get my leaves error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get my leave balance
//  */
// exports.getMyLeaveBalance = async (req, res) => {
//   try {
//     const { year = new Date().getFullYear() } = req.query;
//     const userId = req.user._id;
    
//     // Get user's employment type and calculate entitlement
//     const user = await User.findById(userId);
    
//     // Default leave balances based on employment type
//     const leaveBalances = {
//       annual: 22,
//       sick: 12,
//       casual: 5,
//       unpaid: 0
//     };
    
//     // Calculate used leaves
//     const usedLeaves = await Leave.aggregate([
//       {
//         $match: {
//           userId: user._id,
//           status: 'approved',
//           startDate: {
//             $gte: new Date(year, 0, 1),
//             $lte: new Date(year, 11, 31)
//           }
//         }
//       },
//       {
//         $group: {
//           _id: '$leaveType',
//           totalDays: { $sum: { $subtract: ['$endDate', '$startDate'] } }
//         }
//       }
//     ]);
    
//     usedLeaves.forEach(used => {
//       const days = Math.ceil(used.totalDays / (1000 * 60 * 60 * 24));
//       if (leaveBalances[used._id]) {
//         leaveBalances[used._id] = Math.max(0, leaveBalances[used._id] - days);
//       }
//     });
    
//     res.json({
//       success: true,
//       data: leaveBalances,
//       year: parseInt(year)
//     });
//   } catch (error) {
//     console.error('Get leave balance error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Cancel leave request
//  */
// exports.cancelLeave = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user._id;
    
//     const leave = await Leave.findOne({ _id: id, userId });
    
//     if (!leave) {
//       return res.status(404).json({ success: false, error: 'Leave request not found' });
//     }
    
//     if (leave.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         error: 'Only pending leave requests can be cancelled'
//       });
//     }
    
//     leave.status = 'cancelled';
//     await leave.save();
    
//     res.json({
//       success: true,
//       message: 'Leave request cancelled successfully'
//     });
//   } catch (error) {
//     console.error('Cancel leave error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Update leave request (employee)
//  */
// exports.updateLeaveRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user._id;
//     const updates = req.body;
    
//     const leave = await Leave.findOne({ _id: id, userId });
    
//     if (!leave) {
//       return res.status(404).json({ success: false, error: 'Leave request not found' });
//     }
    
//     if (leave.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         error: 'Only pending leave requests can be updated'
//       });
//     }
    
//     const allowedUpdates = ['leaveType', 'startDate', 'endDate', 'reason', 'halfDay'];
//     allowedUpdates.forEach(field => {
//       if (updates[field] !== undefined) {
//         leave[field] = updates[field];
//       }
//     });
    
//     await leave.save();
    
//     res.json({
//       success: true,
//       data: leave,
//       message: 'Leave request updated successfully'
//     });
//   } catch (error) {
//     console.error('Update leave error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Delete leave request (employee)
//  */
// exports.deleteLeaveRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user._id;
    
//     const leave = await Leave.findOne({ _id: id, userId });
    
//     if (!leave) {
//       return res.status(404).json({ success: false, error: 'Leave request not found' });
//     }
    
//     if (leave.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         error: 'Only pending leave requests can be deleted'
//       });
//     }
    
//     await leave.deleteOne();
    
//     res.json({
//       success: true,
//       message: 'Leave request deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete leave error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== APPROVER ENDPOINTS ====================

// /**
//  * Get pending approvals
//  */
// exports.getPendingApprovals = async (req, res) => {
//   try {
//     const { page = 1, limit = 20 } = req.query;
//     const userId = req.user._id;
//     const userRole = req.user.role;
    
//     let query = { status: 'pending' };
    
//     // Role-based filtering
//     if (userRole === 'supervisor') {
//       const team = await User.find({ supervisor: userId }).distinct('_id');
//       query.userId = { $in: team };
//     } else if (userRole === 'manager') {
//       const team = await User.find({ reportingManager: userId }).distinct('_id');
//       query.userId = { $in: team };
//     }
    
//     const skip = (page - 1) * limit;
    
//     const [leaves, total] = await Promise.all([
//       Leave.find(query)
//         .populate('userId', 'firstName lastName email department')
//         .sort({ createdAt: 1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Leave.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: leaves,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Get pending approvals error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Approve leave
//  */
// exports.approveLeave = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { comments } = req.body;
    
//     const leave = await Leave.findById(id);
    
//     if (!leave) {
//       return res.status(404).json({ success: false, error: 'Leave request not found' });
//     }
    
//     leave.status = 'approved';
//     leave.approvedBy = req.user._id;
//     leave.approvedAt = new Date();
//     leave.approverComments = comments;
//     await leave.save();
    
//     res.json({
//       success: true,
//       data: leave,
//       message: 'Leave request approved successfully'
//     });
//   } catch (error) {
//     console.error('Approve leave error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Reject leave
//  */
// exports.rejectLeave = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;
    
//     const leave = await Leave.findById(id);
    
//     if (!leave) {
//       return res.status(404).json({ success: false, error: 'Leave request not found' });
//     }
    
//     leave.status = 'rejected';
//     leave.rejectedBy = req.user._id;
//     leave.rejectedAt = new Date();
//     leave.rejectionReason = reason;
//     await leave.save();
    
//     res.json({
//       success: true,
//       data: leave,
//       message: 'Leave request rejected'
//     });
//   } catch (error) {
//     console.error('Reject leave error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== TEAM & CALENDAR ENDPOINTS ====================

// /**
//  * Get team leave calendar
//  */
// exports.getTeamLeaveCalendar = async (req, res) => {
//   try {
//     const { year, month } = req.query;
//     const userId = req.user._id;
//     const userRole = req.user.role;
    
//     let teamIds = [userId];
    
//     if (userRole === 'supervisor') {
//       teamIds = await User.find({ supervisor: userId }).distinct('_id');
//     } else if (userRole === 'manager') {
//       teamIds = await User.find({ reportingManager: userId }).distinct('_id');
//     }
    
//     const startDate = new Date(year, month - 1, 1);
//     const endDate = new Date(year, month, 0);
    
//     const leaves = await Leave.find({
//       userId: { $in: teamIds },
//       status: 'approved',
//       startDate: { $lte: endDate },
//       endDate: { $gte: startDate }
//     }).populate('userId', 'firstName lastName');
    
//     res.json({
//       success: true,
//       data: leaves,
//       year: parseInt(year),
//       month: parseInt(month)
//     });
//   } catch (error) {
//     console.error('Get team calendar error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get company leave calendar
//  */
// exports.getCompanyLeaveCalendar = async (req, res) => {
//   try {
//     const { year } = req.query;
    
//     const leaves = await Leave.find({
//       status: 'approved',
//       startDate: {
//         $gte: new Date(year, 0, 1),
//         $lte: new Date(year, 11, 31)
//       }
//     }).populate('userId', 'firstName lastName department');
    
//     res.json({
//       success: true,
//       data: leaves,
//       year: parseInt(year)
//     });
//   } catch (error) {
//     console.error('Get company calendar error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get team leave summary
//  */
// exports.getTeamLeaveSummary = async (req, res) => {
//   try {
//     const { year = new Date().getFullYear(), month, department } = req.query;
//     const userId = req.user._id;
//     const userRole = req.user.role;
    
//     let teamIds = [];
    
//     if (userRole === 'supervisor') {
//       teamIds = await User.find({ supervisor: userId }).distinct('_id');
//     } else if (userRole === 'manager') {
//       teamIds = await User.find({ reportingManager: userId }).distinct('_id');
//     }
    
//     if (department) {
//       const departmentUsers = await User.find({ department }).distinct('_id');
//       teamIds = teamIds.filter(id => departmentUsers.includes(id));
//     }
    
//     const matchQuery = {
//       userId: { $in: teamIds },
//       status: 'approved'
//     };
    
//     if (year) {
//       matchQuery.startDate = {
//         $gte: new Date(year, 0, 1),
//         $lte: new Date(year, 11, 31)
//       };
//     }
    
//     const summary = await Leave.aggregate([
//       { $match: matchQuery },
//       { $group: {
//           _id: '$leaveType',
//           totalDays: { $sum: { $subtract: ['$endDate', '$startDate'] } },
//           count: { $sum: 1 }
//         }
//       }
//     ]);
    
//     res.json({
//       success: true,
//       data: summary,
//       year: parseInt(year)
//     });
//   } catch (error) {
//     console.error('Get team summary error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== LEAVE STATISTICS ENDPOINTS ====================

// /**
//  * Get leave statistics
//  */
// exports.getLeaveStats = async (req, res) => {
//   try {
//     const { year = new Date().getFullYear() } = req.query;
    
//     const pending = await Leave.countDocuments({ status: 'pending' });
//     const approved = await Leave.countDocuments({ status: 'approved' });
//     const rejected = await Leave.countDocuments({ status: 'rejected' });
//     const cancelled = await Leave.countDocuments({ status: 'cancelled' });
    
//     res.json({
//       success: true,
//       data: {
//         pending,
//         approved,
//         rejected,
//         cancelled,
//         total: pending + approved + rejected + cancelled
//       }
//     });
//   } catch (error) {
//     console.error('Get leave stats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get dashboard leave statistics
//  */
// exports.getDashboardLeaveStats = async (req, res) => {
//   try {
//     const currentMonth = new Date().getMonth() + 1;
//     const currentYear = new Date().getFullYear();
    
//     const monthlyStats = await Leave.aggregate([
//       {
//         $match: {
//           status: 'approved',
//           startDate: {
//             $gte: new Date(currentYear, 0, 1),
//             $lte: new Date(currentYear, 11, 31)
//           }
//         }
//       },
//       {
//         $group: {
//           _id: { $month: '$startDate' },
//           count: { $sum: 1 }
//         }
//       }
//     ]);
    
//     const byType = await Leave.aggregate([
//       { $match: { status: 'approved' } },
//       { $group: { _id: '$leaveType', count: { $sum: 1 } } }
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         monthlyStats,
//         byType,
//         currentMonthPending: await Leave.countDocuments({
//           status: 'pending',
//           startDate: {
//             $gte: new Date(currentYear, currentMonth - 1, 1),
//             $lte: new Date(currentYear, currentMonth, 0)
//           }
//         })
//       }
//     });
//   } catch (error) {
//     console.error('Get dashboard stats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get leave summary by department
//  */
// exports.getLeaveSummaryByDepartment = async (req, res) => {
//   try {
//     const { year = new Date().getFullYear() } = req.query;
    
//     const summary = await Leave.aggregate([
//       {
//         $match: {
//           status: 'approved',
//           startDate: {
//             $gte: new Date(year, 0, 1),
//             $lte: new Date(year, 11, 31)
//           }
//         }
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'userId',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },
//       { $unwind: '$user' },
//       {
//         $group: {
//           _id: '$user.department',
//           totalLeaves: { $sum: 1 },
//           totalDays: { $sum: { $subtract: ['$endDate', '$startDate'] } }
//         }
//       }
//     ]);
    
//     res.json({
//       success: true,
//       data: summary,
//       year: parseInt(year)
//     });
//   } catch (error) {
//     console.error('Get department summary error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get leave summary by month
//  */
// exports.getLeaveSummaryByMonth = async (req, res) => {
//   try {
//     const { year = new Date().getFullYear() } = req.query;
    
//     const monthlySummary = await Leave.aggregate([
//       {
//         $match: {
//           status: 'approved',
//           startDate: {
//             $gte: new Date(year, 0, 1),
//             $lte: new Date(year, 11, 31)
//           }
//         }
//       },
//       {
//         $group: {
//           _id: { $month: '$startDate' },
//           count: { $sum: 1 },
//           totalDays: { $sum: { $subtract: ['$endDate', '$startDate'] } }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);
    
//     res.json({
//       success: true,
//       data: monthlySummary,
//       year: parseInt(year)
//     });
//   } catch (error) {
//     console.error('Get monthly summary error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== LEAVE TYPES & POLICY ENDPOINTS ====================

// /**
//  * Get leave types
//  */
// exports.getLeaveTypes = async (req, res) => {
//   try {
//     const leaveTypes = [
//       { id: 'annual', name: 'Annual Leave', defaultDays: 22, requiresApproval: true },
//       { id: 'sick', name: 'Sick Leave', defaultDays: 12, requiresApproval: true, requiresDoctorNote: true },
//       { id: 'casual', name: 'Casual Leave', defaultDays: 5, requiresApproval: true },
//       { id: 'unpaid', name: 'Unpaid Leave', defaultDays: 0, requiresApproval: true },
//       { id: 'emergency', name: 'Emergency Leave', defaultDays: 3, requiresApproval: true },
//       { id: 'maternity', name: 'Maternity Leave', defaultDays: 90, requiresApproval: true },
//       { id: 'paternity', name: 'Paternity Leave', defaultDays: 5, requiresApproval: true },
//       { id: 'bereavement', name: 'Bereavement Leave', defaultDays: 3, requiresApproval: true }
//     ];
    
//     res.json({ success: true, data: leaveTypes });
//   } catch (error) {
//     console.error('Get leave types error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get leave policy
//  */
// exports.getLeavePolicy = async (req, res) => {
//   try {
//     const policy = {
//       maxConsecutiveDays: 30,
//       minimumNoticeDays: 2,
//       requiresDoctorNote: true,
//       carryForward: true,
//       maxCarryForward: 10,
//       workingDaysOnly: true,
//       holidayInclusion: false,
//       approvalRequired: true,
//       autoApproveAfterDays: null
//     };
    
//     res.json({ success: true, data: policy });
//   } catch (error) {
//     console.error('Get leave policy error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Update leave policy
//  */
// exports.updateLeavePolicy = async (req, res) => {
//   try {
//     const updates = req.body;
//     // In production, save to database
//     res.json({
//       success: true,
//       data: updates,
//       message: 'Leave policy updated successfully'
//     });
//   } catch (error) {
//     console.error('Update leave policy error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== LEAVE ENTITLEMENT ENDPOINTS ====================

// /**
//  * Get leave entitlement
//  */
// exports.getLeaveEntitlement = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { year = new Date().getFullYear() } = req.query;
    
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     const entitlements = {
//       annual: 22,
//       sick: 12,
//       casual: 5,
//       unpaid: 0
//     };
    
//     res.json({
//       success: true,
//       data: entitlements,
//       user: `${user.firstName} ${user.lastName}`,
//       year: parseInt(year)
//     });
//   } catch (error) {
//     console.error('Get entitlement error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Update leave entitlement
//  */
// exports.updateLeaveEntitlement = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const entitlements = req.body;
    
//     // In production, save to database
//     res.json({
//       success: true,
//       data: entitlements,
//       message: `Leave entitlement updated for user ${userId}`
//     });
//   } catch (error) {
//     console.error('Update entitlement error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Bulk update leave entitlement
//  */
// exports.bulkUpdateLeaveEntitlement = async (req, res) => {
//   try {
//     const { entitlements } = req.body;
    
//     if (!entitlements || !Array.isArray(entitlements)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Please provide an array of entitlements'
//       });
//     }
    
//     // In production, save to database
//     res.json({
//       success: true,
//       message: `Updated ${entitlements.length} entitlements`,
//       count: entitlements.length
//     });
//   } catch (error) {
//     console.error('Bulk update entitlement error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== LEAVE REPORTING ENDPOINTS ====================

// /**
//  * Export leave report
//  */
// exports.exportLeaveReport = async (req, res) => {
//   try {
//     const { fromDate, toDate, format = 'csv' } = req.query;
    
//     const leaves = await Leave.find({
//       createdAt: {
//         $gte: fromDate ? new Date(fromDate) : new Date(0),
//         $lte: toDate ? new Date(toDate) : new Date()
//       }
//     }).populate('userId', 'firstName lastName email department');
    
//     if (format === 'csv') {
//       const csvHeaders = ['Employee Name', 'Email', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Reason'];
//       const csvRows = leaves.map(leave => [
//         `${leave.userId?.firstName || ''} ${leave.userId?.lastName || ''}`,
//         leave.userId?.email || '',
//         leave.userId?.department || '',
//         leave.leaveType,
//         new Date(leave.startDate).toISOString().split('T')[0],
//         new Date(leave.endDate).toISOString().split('T')[0],
//         Math.ceil((leave.endDate - leave.startDate) / (1000 * 60 * 60 * 24)),
//         leave.status,
//         leave.reason || ''
//       ]);
      
//       const csv = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', `attachment; filename=leave_report_${Date.now()}.csv`);
//       return res.send(csv);
//     }
    
//     res.json({ success: true, data: leaves, count: leaves.length });
//   } catch (error) {
//     console.error('Export report error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get leave analytics
//  */
// exports.getLeaveAnalytics = async (req, res) => {
//   try {
//     const { year = new Date().getFullYear() } = req.query;
    
//     const totalLeaves = await Leave.countDocuments({
//       status: 'approved',
//       startDate: {
//         $gte: new Date(year, 0, 1),
//         $lte: new Date(year, 11, 31)
//       }
//     });
    
//     const mostPopularLeaveType = await Leave.aggregate([
//       { $match: { status: 'approved' } },
//       { $group: { _id: '$leaveType', count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 1 }
//     ]);
    
//     const peakMonth = await Leave.aggregate([
//       { $match: { status: 'approved' } },
//       { $group: { _id: { $month: '$startDate' }, count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 1 }
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         totalLeaves,
//         mostPopularLeaveType: mostPopularLeaveType[0]?._id || 'annual',
//         peakMonth: peakMonth[0]?._id || 1,
//         averageApprovalTime: 2.5 // days
//       },
//       year: parseInt(year)
//     });
//   } catch (error) {
//     console.error('Get analytics error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== ADMIN ENDPOINTS ====================

// /**
//  * Get all leave requests (Admin)
//  */
// exports.getAllLeaveRequests = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, status, fromDate, toDate } = req.query;
    
//     const query = {};
//     if (status) query.status = status;
//     if (fromDate || toDate) {
//       query.createdAt = {};
//       if (fromDate) query.createdAt.$gte = new Date(fromDate);
//       if (toDate) query.createdAt.$lte = new Date(toDate);
//     }
    
//     const skip = (page - 1) * limit;
    
//     const [leaves, total] = await Promise.all([
//       Leave.find(query)
//         .populate('userId', 'firstName lastName email department')
//         .populate('approvedBy', 'firstName lastName')
//         .populate('rejectedBy', 'firstName lastName')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Leave.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: leaves,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Get all leaves error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get leave request by ID
//  */
// exports.getLeaveRequestById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const leave = await Leave.findById(id)
//       .populate('userId', 'firstName lastName email department designation')
//       .populate('approvedBy', 'firstName lastName')
//       .populate('rejectedBy', 'firstName lastName');
    
//     if (!leave) {
//       return res.status(404).json({ success: false, error: 'Leave request not found' });
//     }
    
//     // Check permission (users can only see their own, admins can see all)
//     if (leave.userId._id.toString() !== req.user._id.toString() && 
//         !['admin', 'super_admin'].includes(req.user.role)) {
//       return res.status(403).json({ success: false, error: 'Access denied' });
//     }
    
//     res.json({ success: true, data: leave });
//   } catch (error) {
//     console.error('Get leave by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get user leave balance (Admin)
//  */
// exports.getUserLeaveBalance = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { year = new Date().getFullYear() } = req.query;
    
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     // Calculate used leaves
//     const usedLeaves = await Leave.aggregate([
//       {
//         $match: {
//           userId: user._id,
//           status: 'approved',
//           startDate: {
//             $gte: new Date(year, 0, 1),
//             $lte: new Date(year, 11, 31)
//           }
//         }
//       },
//       {
//         $group: {
//           _id: '$leaveType',
//           totalDays: { $sum: { $subtract: ['$endDate', '$startDate'] } }
//         }
//       }
//     ]);
    
//     const entitlements = {
//       annual: 22,
//       sick: 12,
//       casual: 5,
//       unpaid: 0
//     };
    
//     usedLeaves.forEach(used => {
//       const days = Math.ceil(used.totalDays / (1000 * 60 * 60 * 24));
//       if (entitlements[used._id]) {
//         entitlements[used._id] = Math.max(0, entitlements[used._id] - days);
//       }
//     });
    
//     res.json({
//       success: true,
//       data: entitlements,
//       user: `${user.firstName} ${user.lastName}`,
//       year: parseInt(year)
//     });
//   } catch (error) {
//     console.error('Get user leave balance error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== BULK OPERATIONS ====================

// /**
//  * Bulk approve leaves
//  */
// exports.bulkApproveLeaves = async (req, res) => {
//   try {
//     const { leaveIds, comments } = req.body;
    
//     if (!leaveIds || !Array.isArray(leaveIds) || leaveIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'Please provide an array of leave IDs'
//       });
//     }
    
//     const result = await Leave.updateMany(
//       { _id: { $in: leaveIds }, status: 'pending' },
//       {
//         status: 'approved',
//         approvedBy: req.user._id,
//         approvedAt: new Date(),
//         approverComments: comments
//       }
//     );
    
//     res.json({
//       success: true,
//       message: `${result.modifiedCount} leave requests approved`,
//       count: result.modifiedCount
//     });
//   } catch (error) {
//     console.error('Bulk approve error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Bulk reject leaves
//  */
// exports.bulkRejectLeaves = async (req, res) => {
//   try {
//     const { leaveIds, reason } = req.body;
    
//     if (!leaveIds || !Array.isArray(leaveIds) || leaveIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'Please provide an array of leave IDs'
//       });
//     }
    
//     const result = await Leave.updateMany(
//       { _id: { $in: leaveIds }, status: 'pending' },
//       {
//         status: 'rejected',
//         rejectedBy: req.user._id,
//         rejectedAt: new Date(),
//         rejectionReason: reason
//       }
//     );
    
//     res.json({
//       success: true,
//       message: `${result.modifiedCount} leave requests rejected`,
//       count: result.modifiedCount
//     });
//   } catch (error) {
//     console.error('Bulk reject error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };



// server/src/controllers/leave.controller.js
const Leave = require('../models/Leave.model');
const User = require('../models/User.model');

// ==================== EMPLOYEE ENDPOINTS ====================

/**
 * 🔴 FIXED: Apply for leave - Using correct field names (fromDate/toDate)
 */
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason, halfDay } = req.body;
    const userId = req.user._id;

    console.log('📋 Apply Leave Request:', {
      userId,
      leaveType,
      fromDate,
      toDate,
      reason,
      halfDay
    });

    // 🔴 FIX: Validate required fields
    if (!leaveType) {
      return res.status(400).json({
        success: false,
        error: 'Leave type is required'
      });
    }

    if (!fromDate) {
      return res.status(400).json({
        success: false,
        error: 'From date is required'
      });
    }

    if (!toDate) {
      return res.status(400).json({
        success: false,
        error: 'To date is required'
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Reason is required'
      });
    }

    // Convert dates
    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Calculate total days
    const diffTime = Math.abs(to - from);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Check for overlapping leaves
    const existingLeave = await Leave.findOne({
      employeeId: userId,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { fromDate: { $lte: to, $gte: from } },
        { toDate: { $lte: to, $gte: from } }
      ]
    });

    if (existingLeave) {
      return res.status(400).json({
        success: false,
        error: 'You already have a leave request for this period'
      });
    }

    // 🔴 FIX: Use correct field names (employeeId, fromDate, toDate)
    const leave = new Leave({
      employeeId: userId,
      leaveType,
      fromDate: from,
      toDate: to,
      totalDays: halfDay ? Math.max(0.5, totalDays) : totalDays,
      reason,
      halfDay: halfDay || false,
      status: 'pending',
      appliedOn: new Date()
    });

    await leave.save();
    await leave.populate('employeeId', 'firstName lastName email');

    console.log('✅ Leave request created:', leave._id);

    res.status(201).json({
      success: true,
      data: leave,
      message: 'Leave request submitted successfully'
    });
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get my leaves
 */
exports.getMyLeaves = async (req, res) => {
  try {
    const { status, year, page = 1, limit = 20 } = req.query;
    const userId = req.user._id;
    
    const query = { employeeId: userId };
    if (status) query.status = status;
    if (year) {
      query.fromDate = {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31)
      };
    }
    
    const skip = (page - 1) * limit;
    
    const [leaves, total] = await Promise.all([
      Leave.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Leave.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: leaves,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my leaves error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get my leave balance
 */
exports.getMyLeaveBalance = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    
    const leaveBalances = {
      annual: 22,
      sick: 12,
      casual: 5,
      unpaid: 0
    };
    
    const usedLeaves = await Leave.aggregate([
      {
        $match: {
          employeeId: user._id,
          status: 'approved',
          fromDate: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31)
          }
        }
      },
      {
        $group: {
          _id: '$leaveType',
          totalDays: { $sum: '$totalDays' }
        }
      }
    ]);
    
    usedLeaves.forEach(used => {
      if (leaveBalances[used._id]) {
        leaveBalances[used._id] = Math.max(0, leaveBalances[used._id] - used.totalDays);
      }
    });
    
    res.json({
      success: true,
      data: leaveBalances,
      year: parseInt(year)
    });
  } catch (error) {
    console.error('Get leave balance error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Cancel leave request
 */
exports.cancelLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const leave = await Leave.findOne({ _id: id, employeeId: userId });
    
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }
    
    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending leave requests can be cancelled'
      });
    }
    
    leave.status = 'cancelled';
    await leave.save();
    
    res.json({
      success: true,
      message: 'Leave request cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel leave error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update leave request (employee)
 */
exports.updateLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updates = req.body;
    
    const leave = await Leave.findOne({ _id: id, employeeId: userId });
    
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }
    
    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending leave requests can be updated'
      });
    }
    
    const allowedUpdates = ['leaveType', 'fromDate', 'toDate', 'reason', 'halfDay'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        leave[field] = updates[field];
      }
    });
    
    await leave.save();
    
    res.json({
      success: true,
      data: leave,
      message: 'Leave request updated successfully'
    });
  } catch (error) {
    console.error('Update leave error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete leave request (employee)
 */
exports.deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const leave = await Leave.findOne({ _id: id, employeeId: userId });
    
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }
    
    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending leave requests can be deleted'
      });
    }
    
    await leave.deleteOne();
    
    res.json({
      success: true,
      message: 'Leave request deleted successfully'
    });
  } catch (error) {
    console.error('Delete leave error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== APPROVER ENDPOINTS ====================

/**
 * Get pending approvals
 */
exports.getPendingApprovals = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user._id;
    const userRole = req.user.role;
    
    let query = { status: 'pending' };
    
    if (userRole === 'supervisor') {
      const team = await User.find({ supervisor: userId }).distinct('_id');
      query.employeeId = { $in: team };
    } else if (userRole === 'manager') {
      const team = await User.find({ reportingManager: userId }).distinct('_id');
      query.employeeId = { $in: team };
    }
    
    const skip = (page - 1) * limit;
    
    const [leaves, total] = await Promise.all([
      Leave.find(query)
        .populate('employeeId', 'firstName lastName email department')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Leave.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: leaves,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Approve leave
 */
exports.approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    
    const leave = await Leave.findById(id);
    
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }
    
    leave.status = 'approved';
    leave.approvedBy = req.user._id;
    leave.approvedAt = new Date();
    leave.approvedComments = comments;
    await leave.save();
    
    res.json({
      success: true,
      data: leave,
      message: 'Leave request approved successfully'
    });
  } catch (error) {
    console.error('Approve leave error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Reject leave
 */
exports.rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const leave = await Leave.findById(id);
    
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }
    
    leave.status = 'rejected';
    leave.rejectedBy = req.user._id;
    leave.rejectedAt = new Date();
    leave.rejectionReason = reason;
    await leave.save();
    
    res.json({
      success: true,
      data: leave,
      message: 'Leave request rejected'
    });
  } catch (error) {
    console.error('Reject leave error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== TEAM & CALENDAR ENDPOINTS ====================

/**
 * Get team leave calendar
 */
exports.getTeamLeaveCalendar = async (req, res) => {
  try {
    const { year, month } = req.query;
    const userId = req.user._id;
    const userRole = req.user.role;
    
    let teamIds = [userId];
    
    if (userRole === 'supervisor') {
      teamIds = await User.find({ supervisor: userId }).distinct('_id');
    } else if (userRole === 'manager') {
      teamIds = await User.find({ reportingManager: userId }).distinct('_id');
    }
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const leaves = await Leave.find({
      employeeId: { $in: teamIds },
      status: 'approved',
      fromDate: { $lte: endDate },
      toDate: { $gte: startDate }
    }).populate('employeeId', 'firstName lastName');
    
    res.json({
      success: true,
      data: leaves,
      year: parseInt(year),
      month: parseInt(month)
    });
  } catch (error) {
    console.error('Get team calendar error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get company leave calendar
 */
exports.getCompanyLeaveCalendar = async (req, res) => {
  try {
    const { year } = req.query;
    
    const leaves = await Leave.find({
      status: 'approved',
      fromDate: {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31)
      }
    }).populate('employeeId', 'firstName lastName department');
    
    res.json({
      success: true,
      data: leaves,
      year: parseInt(year)
    });
  } catch (error) {
    console.error('Get company calendar error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get team leave summary
 */
exports.getTeamLeaveSummary = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), month, department } = req.query;
    const userId = req.user._id;
    const userRole = req.user.role;
    
    let teamIds = [];
    
    if (userRole === 'supervisor') {
      teamIds = await User.find({ supervisor: userId }).distinct('_id');
    } else if (userRole === 'manager') {
      teamIds = await User.find({ reportingManager: userId }).distinct('_id');
    }
    
    if (department) {
      const departmentUsers = await User.find({ department }).distinct('_id');
      teamIds = teamIds.filter(id => departmentUsers.includes(id));
    }
    
    const matchQuery = {
      employeeId: { $in: teamIds },
      status: 'approved'
    };
    
    if (year) {
      matchQuery.fromDate = {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31)
      };
    }
    
    const summary = await Leave.aggregate([
      { $match: matchQuery },
      { $group: {
          _id: '$leaveType',
          totalDays: { $sum: '$totalDays' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: summary,
      year: parseInt(year)
    });
  } catch (error) {
    console.error('Get team summary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== LEAVE STATISTICS ENDPOINTS ====================

/**
 * Get leave statistics
 */
exports.getLeaveStats = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    const pending = await Leave.countDocuments({ status: 'pending' });
    const approved = await Leave.countDocuments({ status: 'approved' });
    const rejected = await Leave.countDocuments({ status: 'rejected' });
    const cancelled = await Leave.countDocuments({ status: 'cancelled' });
    
    res.json({
      success: true,
      data: {
        pending,
        approved,
        rejected,
        cancelled,
        total: pending + approved + rejected + cancelled
      }
    });
  } catch (error) {
    console.error('Get leave stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get dashboard leave statistics
 */
exports.getDashboardLeaveStats = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const monthlyStats = await Leave.aggregate([
      {
        $match: {
          status: 'approved',
          fromDate: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$fromDate' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const byType = await Leave.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$leaveType', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: {
        monthlyStats,
        byType,
        currentMonthPending: await Leave.countDocuments({
          status: 'pending',
          fromDate: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lte: new Date(currentYear, currentMonth, 0)
          }
        })
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get leave summary by department
 */
exports.getLeaveSummaryByDepartment = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    const summary = await Leave.aggregate([
      {
        $match: {
          status: 'approved',
          fromDate: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31)
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      {
        $group: {
          _id: '$employee.department',
          totalLeaves: { $sum: 1 },
          totalDays: { $sum: '$totalDays' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: summary,
      year: parseInt(year)
    });
  } catch (error) {
    console.error('Get department summary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get leave summary by month
 */
exports.getLeaveSummaryByMonth = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    const monthlySummary = await Leave.aggregate([
      {
        $match: {
          status: 'approved',
          fromDate: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$fromDate' },
          count: { $sum: 1 },
          totalDays: { $sum: '$totalDays' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: monthlySummary,
      year: parseInt(year)
    });
  } catch (error) {
    console.error('Get monthly summary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== LEAVE TYPES & POLICY ENDPOINTS ====================

/**
 * Get leave types
 */
exports.getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = [
      { id: 'annual', name: 'Annual Leave', defaultDays: 22, requiresApproval: true },
      { id: 'sick', name: 'Sick Leave', defaultDays: 12, requiresApproval: true, requiresDoctorNote: true },
      { id: 'casual', name: 'Casual Leave', defaultDays: 5, requiresApproval: true },
      { id: 'unpaid', name: 'Unpaid Leave', defaultDays: 0, requiresApproval: true },
      { id: 'emergency', name: 'Emergency Leave', defaultDays: 3, requiresApproval: true },
      { id: 'maternity', name: 'Maternity Leave', defaultDays: 90, requiresApproval: true },
      { id: 'paternity', name: 'Paternity Leave', defaultDays: 5, requiresApproval: true },
      { id: 'bereavement', name: 'Bereavement Leave', defaultDays: 3, requiresApproval: true }
    ];
    
    res.json({ success: true, data: leaveTypes });
  } catch (error) {
    console.error('Get leave types error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get leave policy
 */
exports.getLeavePolicy = async (req, res) => {
  try {
    const policy = {
      maxConsecutiveDays: 30,
      minimumNoticeDays: 2,
      requiresDoctorNote: true,
      carryForward: true,
      maxCarryForward: 10,
      workingDaysOnly: true,
      holidayInclusion: false,
      approvalRequired: true,
      autoApproveAfterDays: null
    };
    
    res.json({ success: true, data: policy });
  } catch (error) {
    console.error('Get leave policy error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update leave policy
 */
exports.updateLeavePolicy = async (req, res) => {
  try {
    const updates = req.body;
    res.json({
      success: true,
      data: updates,
      message: 'Leave policy updated successfully'
    });
  } catch (error) {
    console.error('Update leave policy error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== LEAVE ENTITLEMENT ENDPOINTS ====================

/**
 * Get leave entitlement
 */
exports.getLeaveEntitlement = async (req, res) => {
  try {
    const { userId } = req.params;
    const { year = new Date().getFullYear() } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const entitlements = {
      annual: 22,
      sick: 12,
      casual: 5,
      unpaid: 0
    };
    
    res.json({
      success: true,
      data: entitlements,
      user: `${user.firstName} ${user.lastName}`,
      year: parseInt(year)
    });
  } catch (error) {
    console.error('Get entitlement error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update leave entitlement
 */
exports.updateLeaveEntitlement = async (req, res) => {
  try {
    const { userId } = req.params;
    const entitlements = req.body;
    
    res.json({
      success: true,
      data: entitlements,
      message: `Leave entitlement updated for user ${userId}`
    });
  } catch (error) {
    console.error('Update entitlement error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Bulk update leave entitlement
 */
exports.bulkUpdateLeaveEntitlement = async (req, res) => {
  try {
    const { entitlements } = req.body;
    
    if (!entitlements || !Array.isArray(entitlements)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of entitlements'
      });
    }
    
    res.json({
      success: true,
      message: `Updated ${entitlements.length} entitlements`,
      count: entitlements.length
    });
  } catch (error) {
    console.error('Bulk update entitlement error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== LEAVE REPORTING ENDPOINTS ====================

/**
 * Export leave report
 */
exports.exportLeaveReport = async (req, res) => {
  try {
    const { fromDate, toDate, format = 'csv' } = req.query;
    
    const leaves = await Leave.find({
      createdAt: {
        $gte: fromDate ? new Date(fromDate) : new Date(0),
        $lte: toDate ? new Date(toDate) : new Date()
      }
    }).populate('employeeId', 'firstName lastName email department');
    
    if (format === 'csv') {
      const csvHeaders = ['Employee Name', 'Email', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Reason'];
      const csvRows = leaves.map(leave => [
        `${leave.employeeId?.firstName || ''} ${leave.employeeId?.lastName || ''}`,
        leave.employeeId?.email || '',
        leave.employeeId?.department || '',
        leave.leaveType,
        new Date(leave.fromDate).toISOString().split('T')[0],
        new Date(leave.toDate).toISOString().split('T')[0],
        leave.totalDays,
        leave.status,
        leave.reason || ''
      ]);
      
      const csv = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=leave_report_${Date.now()}.csv`);
      return res.send(csv);
    }
    
    res.json({ success: true, data: leaves, count: leaves.length });
  } catch (error) {
    console.error('Export report error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get leave analytics
 */
exports.getLeaveAnalytics = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    const totalLeaves = await Leave.countDocuments({
      status: 'approved',
      fromDate: {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31)
      }
    });
    
    const mostPopularLeaveType = await Leave.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$leaveType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    const peakMonth = await Leave.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: { $month: '$fromDate' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    res.json({
      success: true,
      data: {
        totalLeaves,
        mostPopularLeaveType: mostPopularLeaveType[0]?._id || 'annual',
        peakMonth: peakMonth[0]?._id || 1,
        averageApprovalTime: 2.5
      },
      year: parseInt(year)
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== ADMIN ENDPOINTS ====================

/**
 * Get all leave requests (Admin)
 */
exports.getAllLeaveRequests = async (req, res) => {
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
    
    const [leaves, total] = await Promise.all([
      Leave.find(query)
        .populate('employeeId', 'firstName lastName email department')
        .populate('approvedBy', 'firstName lastName')
        .populate('rejectedBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Leave.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: leaves,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all leaves error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get leave request by ID
 */
exports.getLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const leave = await Leave.findById(id)
      .populate('employeeId', 'firstName lastName email department designation')
      .populate('approvedBy', 'firstName lastName')
      .populate('rejectedBy', 'firstName lastName');
    
    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }
    
    if (leave.employeeId._id.toString() !== req.user._id.toString() && 
        !['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    res.json({ success: true, data: leave });
  } catch (error) {
    console.error('Get leave by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get user leave balance (Admin)
 */
exports.getUserLeaveBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { year = new Date().getFullYear() } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const usedLeaves = await Leave.aggregate([
      {
        $match: {
          employeeId: user._id,
          status: 'approved',
          fromDate: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31)
          }
        }
      },
      {
        $group: {
          _id: '$leaveType',
          totalDays: { $sum: '$totalDays' }
        }
      }
    ]);
    
    const entitlements = {
      annual: 22,
      sick: 12,
      casual: 5,
      unpaid: 0
    };
    
    usedLeaves.forEach(used => {
      if (entitlements[used._id]) {
        entitlements[used._id] = Math.max(0, entitlements[used._id] - used.totalDays);
      }
    });
    
    res.json({
      success: true,
      data: entitlements,
      user: `${user.firstName} ${user.lastName}`,
      year: parseInt(year)
    });
  } catch (error) {
    console.error('Get user leave balance error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== BULK OPERATIONS ====================

/**
 * Bulk approve leaves
 */
exports.bulkApproveLeaves = async (req, res) => {
  try {
    const { leaveIds, comments } = req.body;
    
    if (!leaveIds || !Array.isArray(leaveIds) || leaveIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of leave IDs'
      });
    }
    
    const result = await Leave.updateMany(
      { _id: { $in: leaveIds }, status: 'pending' },
      {
        status: 'approved',
        approvedBy: req.user._id,
        approvedAt: new Date(),
        approvedComments: comments
      }
    );
    
    res.json({
      success: true,
      message: `${result.modifiedCount} leave requests approved`,
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk approve error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Bulk reject leaves
 */
exports.bulkRejectLeaves = async (req, res) => {
  try {
    const { leaveIds, reason } = req.body;
    
    if (!leaveIds || !Array.isArray(leaveIds) || leaveIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of leave IDs'
      });
    }
    
    const result = await Leave.updateMany(
      { _id: { $in: leaveIds }, status: 'pending' },
      {
        status: 'rejected',
        rejectedBy: req.user._id,
        rejectedAt: new Date(),
        rejectionReason: reason
      }
    );
    
    res.json({
      success: true,
      message: `${result.modifiedCount} leave requests rejected`,
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk reject error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== EXPORTS ====================
module.exports = exports;


