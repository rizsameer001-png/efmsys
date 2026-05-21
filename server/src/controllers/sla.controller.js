// /**
//  * SLA CONTROLLER
//  * Handles SLA monitoring, breach alerts, and escalation
//  */

// const Task = require('../models/Task.model');
// const SLAHistory = require('../models/sla-history.model');
// const Notification = require('../models/Notification.model');
// const ActivityLog = require('../models/ActivityLog.model');
// const { getIO } = require('../config/socketio');

// // ==================== HELPER FUNCTIONS ====================

// /**
//  * Calculate SLA status for a task
//  */
// const calculateSLAStatus = (task) => {
//   const now = new Date();
//   const deadline = task.slaDeadline;
  
//   if (!deadline) return { status: 'not_set', percentage: 100, timeRemaining: null };
  
//   const totalTime = deadline - task.createdAt;
//   const elapsedTime = now - task.createdAt;
//   const percentageUsed = totalTime > 0 ? Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100)) : 0;
  
//   let status = 'on_track';
//   if (percentageUsed >= 100 || (task.slaBreached === true)) {
//     status = 'breached';
//   } else if (percentageUsed >= 75) {
//     status = 'at_risk';
//   } else if (percentageUsed >= 50) {
//     status = 'warning';
//   }
  
//   const hoursRemaining = Math.max(0, Math.round((deadline - now) / (1000 * 60 * 60)));
//   const minutesRemaining = Math.max(0, Math.round((deadline - now) / (1000 * 60)));
  
//   return {
//     status,
//     percentageUsed: Math.round(percentageUsed),
//     deadline,
//     timeRemaining: hoursRemaining > 0 ? `${hoursRemaining}h` : `${minutesRemaining}m`,
//     hoursRemaining,
//     minutesRemaining
//   };
// };

// /**
//  * Send SLA breach notification
//  */
// const sendSLABreachNotification = async (task, breachDetails) => {
//   try {
//     const io = getIO();
//     const notificationData = {
//       title: '⚠️ SLA Breach Alert',
//       message: `Task "${task.title}" (${task.taskId}) has breached its SLA deadline.`,
//       type: 'sla_breach',
//       priority: 'urgent',
//       actionUrl: `/tasks/${task._id}`,
//       metadata: { 
//         taskId: task._id, 
//         taskNumber: task.taskId, 
//         breachDetails,
//         hoursOverdue: breachDetails.hoursRemaining
//       }
//     };
    
//     // Notify assigned technician
//     if (task.assignment?.assignedTo) {
//       if (io) io.to(`user_${task.assignment.assignedTo}`).emit('sla_breach', notificationData);
//       await Notification.create({ 
//         userId: task.assignment.assignedTo, 
//         ...notificationData,
//         read: false
//       });
//     }
    
//     // Notify supervisor
//     if (task.assignment?.supervisorId) {
//       if (io) io.to(`user_${task.assignment.supervisorId}`).emit('sla_breach', notificationData);
//       await Notification.create({ 
//         userId: task.assignment.supervisorId, 
//         ...notificationData,
//         read: false
//       });
//     }
    
//     // Notify manager
//     if (task.assignment?.managerId) {
//       if (io) io.to(`user_${task.assignment.managerId}`).emit('sla_breach', notificationData);
//       await Notification.create({ 
//         userId: task.assignment.managerId, 
//         ...notificationData,
//         read: false
//       });
//     }
    
//     // Log activity
//     await ActivityLog.create({
//       userId: task.assignment?.assignedTo,
//       action: 'SLA_BREACH',
//       entityType: 'task',
//       entityId: task._id,
//       metadata: { taskTitle: task.title, breachDetails },
//       timestamp: new Date()
//     });
    
//   } catch (error) {
//     console.error('Send SLA breach notification error:', error);
//   }
// };

// /**
//  * Record SLA history
//  */
// const recordSLAHistory = async (task, type, description, userId = null, metadata = {}) => {
//   try {
//     const slaHistory = new SLAHistory({
//       taskId: task._id,
//       taskTitle: task.title,
//       taskNumber: task.taskId,
//       priority: task.priority,
//       type,
//       description,
//       triggeredBy: userId,
//       metadata: {
//         ...metadata,
//         slaDeadline: task.slaDeadline,
//         status: task.status,
//         escalationLevel: task.escalationLevel
//       },
//       timestamp: new Date()
//     });
//     await slaHistory.save();
//     return slaHistory;
//   } catch (error) {
//     console.error('Record SLA history error:', error);
//     return null;
//   }
// };

// // ==================== GET SLA DASHBOARD ====================

// /**
//  * Get SLA Dashboard data with comprehensive statistics
//  */
// const getSLADashboard = async (req, res) => {
//   try {
//     const { buildingId, department, priority } = req.query;
//     const now = new Date();
    
//     // Build query
//     let query = { isDeleted: { $ne: true } };
//     if (buildingId && buildingId !== 'undefined') query['location.buildingId'] = buildingId;
//     if (department && department !== 'undefined') query.department = department;
//     if (priority && priority !== 'undefined') query.priority = priority;
    
//     const tasks = await Task.find(query).lean();
    
//     // Count tasks by SLA status
//     let breachedCount = 0;
//     let atRiskCount = 0;
//     let warningCount = 0;
//     let onTrackCount = 0;
    
//     tasks.forEach(task => {
//       const slaStatus = calculateSLAStatus(task);
//       if (slaStatus.status === 'breached') breachedCount++;
//       else if (slaStatus.status === 'at_risk') atRiskCount++;
//       else if (slaStatus.status === 'warning') warningCount++;
//       else if (slaStatus.status === 'on_track') onTrackCount++;
//     });
    
//     const totalTasks = tasks.length;
//     const onTimeTasks = totalTasks - breachedCount;
    
//     // Calculate average resolution time for completed tasks
//     const completedTasks = await Task.find({
//       status: 'completed',
//       isDeleted: { $ne: true },
//       'timeline.completedAt': { $exists: true },
//       'timeline.startedAt': { $exists: true }
//     }).lean();
    
//     let totalResolutionHours = 0;
//     completedTasks.forEach(task => {
//       const completedAt = new Date(task.timeline.completedAt);
//       const startedAt = new Date(task.timeline.startedAt);
//       const hours = (completedAt - startedAt) / (1000 * 60 * 60);
//       totalResolutionHours += hours;
//     });
//     const avgResolutionHours = completedTasks.length > 0 ? (totalResolutionHours / completedTasks.length).toFixed(1) : 0;
    
//     // Calculate average response time
//     const assignedTasks = await Task.find({
//       'timeline.assignedAt': { $exists: true },
//       isDeleted: { $ne: true }
//     }).lean();
    
//     let totalResponseHours = 0;
//     assignedTasks.forEach(task => {
//       const assignedAt = new Date(task.timeline.assignedAt);
//       const createdAt = new Date(task.createdAt);
//       const hours = (assignedAt - createdAt) / (1000 * 60 * 60);
//       totalResponseHours += hours;
//     });
//     const avgResponseHours = assignedTasks.length > 0 ? (totalResponseHours / assignedTasks.length).toFixed(1) : 0;
    
//     // SLA by priority
//     const slaByPriority = [
//       { _id: 'critical', total: tasks.filter(t => t.priority === 'critical').length, breached: tasks.filter(t => t.priority === 'critical' && t.slaBreached).length },
//       { _id: 'high', total: tasks.filter(t => t.priority === 'high').length, breached: tasks.filter(t => t.priority === 'high' && t.slaBreached).length },
//       { _id: 'medium', total: tasks.filter(t => t.priority === 'medium').length, breached: tasks.filter(t => t.priority === 'medium' && t.slaBreached).length },
//       { _id: 'low', total: tasks.filter(t => t.priority === 'low').length, breached: tasks.filter(t => t.priority === 'low' && t.slaBreached).length }
//     ];

//     res.json({
//       success: true,
//       data: {
//         summary: {
//           totalTasks,
//           breachedTasks: breachedCount,
//           atRiskTasks: atRiskCount,
//           warningTasks: warningCount,
//           onTimeTasks,
//           complianceRate: totalTasks ? ((onTimeTasks / totalTasks) * 100).toFixed(1) : 100
//         },
//         averageResolutionTime: parseFloat(avgResolutionHours),
//         averageResponseTime: parseFloat(avgResponseHours),
//         slaByPriority,
//         lastUpdated: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Get SLA dashboard error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET BREACHED TASKS ====================

// /**
//  * Get all breached tasks with details
//  */
// const getBreachedTasks = async (req, res) => {
//   try {
//     const { buildingId, priority, page = 1, limit = 20 } = req.query;
//     const now = new Date();
    
//     let query = {
//       $or: [
//         { slaDeadline: { $lt: now } },
//         { slaBreached: true }
//       ],
//       status: { $nin: ['closed', 'cancelled'] },
//       isDeleted: { $ne: true }
//     };
    
//     if (buildingId && buildingId !== 'undefined') query['location.buildingId'] = buildingId;
//     if (priority && priority !== 'undefined') query.priority = priority;
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const [tasks, total] = await Promise.all([
//       Task.find(query)
//         .populate('assignment.assignedTo', 'name email technicianType')
//         .populate('assignment.supervisorId', 'name email')
//         .populate('location.buildingId', 'name code')
//         .sort({ slaDeadline: 1 })
//         .skip(skip)
//         .limit(parseInt(limit))
//         .lean(),
//       Task.countDocuments(query)
//     ]);
    
//     const breachedTasks = tasks.map(task => ({
//       ...task,
//       slaStatus: calculateSLAStatus(task),
//       hoursOverdue: task.slaDeadline ? Math.max(0, Math.round((now - new Date(task.slaDeadline)) / (1000 * 60 * 60))) : 0
//     }));
    
//     res.json({
//       success: true,
//       data: breachedTasks,
//       total,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       pages: Math.ceil(total / parseInt(limit))
//     });
//   } catch (error) {
//     console.error('Get breached tasks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET AT-RISK TASKS ====================

// /**
//  * Get tasks at risk of SLA breach (due within 2 hours)
//  */
// const getAtRiskTasks = async (req, res) => {
//   try {
//     const { buildingId, priority, page = 1, limit = 20 } = req.query;
//     const now = new Date();
//     const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
//     let query = {
//       slaDeadline: { $gt: now, $lt: twoHoursFromNow },
//       status: { $nin: ['closed', 'cancelled', 'completed', 'verified'] },
//       slaBreached: { $ne: true },
//       isDeleted: { $ne: true }
//     };
    
//     if (buildingId && buildingId !== 'undefined') query['location.buildingId'] = buildingId;
//     if (priority && priority !== 'undefined') query.priority = priority;
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const [tasks, total] = await Promise.all([
//       Task.find(query)
//         .populate('assignment.assignedTo', 'name email technicianType')
//         .populate('location.buildingId', 'name code')
//         .sort({ slaDeadline: 1 })
//         .skip(skip)
//         .limit(parseInt(limit))
//         .lean(),
//       Task.countDocuments(query)
//     ]);
    
//     const atRiskTasks = tasks.map(task => {
//       const timeRemaining = task.slaDeadline ? (new Date(task.slaDeadline) - now) / (1000 * 60) : 0;
//       return {
//         ...task,
//         slaStatus: calculateSLAStatus(task),
//         hoursRemaining: Math.max(0, Math.floor(timeRemaining / 60)),
//         minutesRemaining: Math.max(0, Math.floor(timeRemaining % 60))
//       };
//     });
    
//     res.json({
//       success: true,
//       data: atRiskTasks,
//       total,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       pages: Math.ceil(total / parseInt(limit))
//     });
//   } catch (error) {
//     console.error('Get at-risk tasks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET SLA HISTORY ====================

// /**
//  * Get SLA history for a specific task or all history
//  */
// const getSLAHistory = async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const { startDate, endDate, page = 1, limit = 20 } = req.query;
    
//     let query = {};
    
//     if (taskId && taskId !== 'undefined' && taskId !== 'null') {
//       query.taskId = taskId;
//     }
    
//     if (startDate || endDate) {
//       query.timestamp = {};
//       if (startDate) query.timestamp.$gte = new Date(startDate);
//       if (endDate) query.timestamp.$lte = new Date(endDate);
//     }
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const [history, total] = await Promise.all([
//       SLAHistory.find(query)
//         .sort({ timestamp: -1 })
//         .skip(skip)
//         .limit(parseInt(limit))
//         .lean(),
//       SLAHistory.countDocuments(query)
//     ]);
    
//     // Get task details if taskId is provided
//     let task = null;
//     if (taskId && taskId !== 'undefined' && taskId !== 'null') {
//       task = await Task.findById(taskId).select('taskId title priority slaDeadline status').lean();
//     }
    
//     const summary = {
//       totalEscalations: history.filter(h => h.type === 'escalation').length,
//       totalBreaches: history.filter(h => h.type === 'breach').length,
//       totalWarnings: history.filter(h => h.type === 'warning').length
//     };
    
//     res.json({
//       success: true,
//       data: history,
//       task,
//       summary,
//       total,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       pages: Math.ceil(total / parseInt(limit))
//     });
//   } catch (error) {
//     console.error('Get SLA history error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== ESCALATE TASK ====================

// /**
//  * Escalate a task due to SLA breach or other reasons
//  */
// const escalateTask = async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const { reason } = req.body;
//     const userId = req.user?._id || req.user?.id || req.userId;
//     const userName = req.user?.name || req.user?.firstName + ' ' + req.user?.lastName || 'System';
    
//     const task = await Task.findById(taskId);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     const escalationLevel = (task.escalationLevel || 0) + 1;
    
//     task.escalationLevel = escalationLevel;
//     task.escalationReason = reason;
//     task.escalatedAt = new Date();
//     task.status = 'escalated';
//     await task.save();
    
//     // Record escalation in SLA history
//     await recordSLAHistory(
//       task, 
//       'escalation', 
//       `Task escalated to level ${escalationLevel} due to: ${reason}`,
//       userId,
//       { escalationLevel, reason }
//     );
    
//     // Send escalation notification
//     const io = getIO();
//     const notificationData = {
//       title: `🚨 Task Escalated - Level ${escalationLevel}`,
//       message: `Task "${task.title}" (${task.taskId}) has been escalated. Reason: ${reason}`,
//       type: 'escalation',
//       priority: 'urgent',
//       actionUrl: `/tasks/${task._id}`,
//       metadata: { taskId: task._id, escalationLevel, reason }
//     };
    
//     // Notify admins
//     if (io) {
//       io.to('role_admin').to('role_super_admin').emit('task_escalated', notificationData);
//     }
    
//     await Notification.create({ 
//       userId: task.assignment?.assignedTo, 
//       ...notificationData,
//       read: false
//     });
    
//     await ActivityLog.create({
//       userId,
//       userName,
//       action: 'ESCALATE_TASK',
//       entityType: 'Task',
//       entityId: task._id,
//       metadata: { escalationLevel, reason },
//       ipAddress: req.ip || req.connection.remoteAddress
//     });
    
//     res.json({
//       success: true,
//       data: task,
//       message: `Task escalated to level ${escalationLevel}`
//     });
//   } catch (error) {
//     console.error('Escalate task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET MONTHLY SLA REPORT ====================

// /**
//  * Get comprehensive monthly SLA report
//  */
// const getMonthlySLAReport = async (req, res) => {
//   try {
//     const { year, month, buildingId, department } = req.query;
//     const targetYear = parseInt(year) || new Date().getFullYear();
//     const targetMonth = parseInt(month) || new Date().getMonth() + 1;
    
//     const startDate = new Date(targetYear, targetMonth - 1, 1);
//     const endDate = new Date(targetYear, targetMonth, 0);
//     endDate.setHours(23, 59, 59, 999);
    
//     let query = {
//       createdAt: { $gte: startDate, $lte: endDate },
//       isDeleted: { $ne: true }
//     };
    
//     if (buildingId && buildingId !== 'undefined') query['location.buildingId'] = buildingId;
//     if (department && department !== 'undefined') query.department = department;
    
//     const tasks = await Task.find(query).lean();
    
//     const totalTasks = tasks.length;
//     const breachedTasks = tasks.filter(t => t.slaBreached === true).length;
//     const onTimeTasks = totalTasks - breachedTasks;
//     const complianceRate = totalTasks ? ((onTimeTasks / totalTasks) * 100).toFixed(1) : 100;
    
//     // Daily breakdown
//     const daysInMonth = endDate.getDate();
//     const dailyBreakdown = [];
//     for (let i = 1; i <= daysInMonth; i++) {
//       const date = new Date(targetYear, targetMonth - 1, i);
//       const nextDate = new Date(targetYear, targetMonth - 1, i + 1);
//       const dailyTasks = tasks.filter(t => {
//         const createdAt = new Date(t.createdAt);
//         return createdAt >= date && createdAt < nextDate;
//       });
//       const dailyBreached = dailyTasks.filter(t => t.slaBreached).length;
//       dailyBreakdown.push({
//         date: i,
//         dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
//         total: dailyTasks.length,
//         breached: dailyBreached,
//         compliance: dailyTasks.length ? ((dailyTasks.length - dailyBreached) / dailyTasks.length * 100).toFixed(1) : 100
//       });
//     }
    
//     // Priority breakdown
//     const priorityBreakdown = {};
//     ['critical', 'high', 'medium', 'low'].forEach(p => {
//       const priorityTasks = tasks.filter(t => t.priority === p);
//       const priorityBreached = priorityTasks.filter(t => t.slaBreached).length;
//       priorityBreakdown[p] = {
//         total: priorityTasks.length,
//         breached: priorityBreached,
//         compliance: priorityTasks.length ? ((priorityTasks.length - priorityBreached) / priorityTasks.length * 100).toFixed(1) : 100
//       };
//     });

//     res.json({
//       success: true,
//       data: {
//         period: {
//           year: targetYear,
//           month: targetMonth,
//           monthName: new Date(targetYear, targetMonth - 1, 1).toLocaleString('default', { month: 'long' })
//         },
//         summary: {
//           totalTasks,
//           breachedTasks,
//           onTimeTasks,
//           complianceRate
//         },
//         dailyBreakdown,
//         priorityBreakdown,
//         lastUpdated: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Get monthly SLA report error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== SLA STATISTICS ====================

// /**
//  * Get SLA statistics summary
//  */
// const getSLAStatistics = async (req, res) => {
//   try {
//     const { buildingId, period = 'week' } = req.query;
    
//     let startDate = new Date();
//     if (period === 'day') {
//       startDate.setDate(startDate.getDate() - 1);
//     } else if (period === 'week') {
//       startDate.setDate(startDate.getDate() - 7);
//     } else if (period === 'month') {
//       startDate.setMonth(startDate.getMonth() - 1);
//     } else if (period === 'year') {
//       startDate.setFullYear(startDate.getFullYear() - 1);
//     }
    
//     let query = {
//       createdAt: { $gte: startDate },
//       isDeleted: { $ne: true }
//     };
    
//     if (buildingId && buildingId !== 'undefined') query['location.buildingId'] = buildingId;
    
//     const tasks = await Task.find(query).lean();
    
//     const totalTasks = tasks.length;
//     const breachedTasks = tasks.filter(t => t.slaBreached === true).length;
//     const complianceRate = totalTasks ? ((totalTasks - breachedTasks) / totalTasks * 100).toFixed(1) : 100;
    
//     // Calculate trend data
//     const dailyData = [];
//     for (let i = 6; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
//       date.setHours(0, 0, 0, 0);
//       const nextDate = new Date(date);
//       nextDate.setDate(nextDate.getDate() + 1);
      
//       const dayTasks = tasks.filter(t => {
//         const createdAt = new Date(t.createdAt);
//         return createdAt >= date && createdAt < nextDate;
//       });
//       const dayBreached = dayTasks.filter(t => t.slaBreached).length;
//       dailyData.push({
//         date: date.toLocaleDateString(),
//         total: dayTasks.length,
//         breached: dayBreached,
//         compliance: dayTasks.length ? ((dayTasks.length - dayBreached) / dayTasks.length * 100).toFixed(1) : 100
//       });
//     }
    
//     res.json({
//       success: true,
//       data: {
//         totalTasks,
//         breachedTasks,
//         complianceRate: parseFloat(complianceRate),
//         averageResponseTime: 0,
//         averageResolutionTime: 0,
//         trend: dailyData
//       }
//     });
//   } catch (error) {
//     console.error('Get SLA statistics error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== MONITOR SLA (Cron Job) ====================

// /**
//  * Monitor SLA for all active tasks (called by cron job)
//  */
// const monitorSLA = async () => {
//   try {
//     const activeTasks = await Task.find({
//       status: { $nin: ['closed', 'cancelled', 'completed'] },
//       isDeleted: { $ne: true },
//       slaDeadline: { $exists: true }
//     });
    
//     let breachedCount = 0;
//     let notificationCount = 0;
    
//     for (const task of activeTasks) {
//       const slaStatus = calculateSLAStatus(task);
      
//       if (slaStatus.status === 'breached' && !task.slaBreached) {
//         task.slaBreached = true;
//         task.slaBreachedAt = new Date();
//         await task.save();
//         breachedCount++;
        
//         // Send notification
//         await sendSLABreachNotification(task, slaStatus);
//         await recordSLAHistory(task, 'breach', 'SLA deadline breached', null, slaStatus);
//         notificationCount++;
//       }
      
//       // Send warning for at-risk tasks (if not already notified)
//       if (slaStatus.status === 'at_risk' && !task.slaWarningSent) {
//         task.slaWarningSent = true;
//         await task.save();
        
//         const warningData = {
//           title: '⚠️ SLA Warning',
//           message: `Task "${task.title}" (${task.taskId}) is at risk of breaching SLA deadline.`,
//           type: 'sla_warning',
//           priority: 'high',
//           actionUrl: `/tasks/${task._id}`,
//           metadata: { taskId: task._id, hoursRemaining: slaStatus.hoursRemaining }
//         };
        
//         const io = getIO();
//         if (io && task.assignment?.assignedTo) {
//           io.to(`user_${task.assignment.assignedTo}`).emit('sla_warning', warningData);
//         }
        
//         await recordSLAHistory(task, 'warning', `SLA warning: ${slaStatus.hoursRemaining} hours remaining`, null, slaStatus);
//         notificationCount++;
//       }
//     }
    
//     console.log(`[SLA Monitor] ${breachedCount} new breaches, ${notificationCount} notifications sent`);
//     return { breachedCount, notificationCount };
//   } catch (error) {
//     console.error('Monitor SLA error:', error);
//     return { breachedCount: 0, notificationCount: 0, error: error.message };
//   }
// };

// // ==================== EXPORTS ====================

// module.exports = {
//   getSLADashboard,
//   getBreachedTasks,
//   getAtRiskTasks,
//   getSLAHistory,
//   escalateTask,
//   getMonthlySLAReport,
//   getSLAStatistics,
//   monitorSLA,
//   calculateSLAStatus,
//   sendSLABreachNotification
// };







/**
 * SLA CONTROLLER
 * Handles SLA monitoring, breach alerts, and escalation
 */

const Task = require('../models/Task.model');
const SLAHistory = require('../models/sla-history.model');
const Notification = require('../models/Notification.model');
const ActivityLog = require('../models/ActivityLog.model');
const { getIO } = require('../config/socketio');

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate SLA status for a task
 */
const calculateSLAStatus = (task) => {
  const now = new Date();
  const deadline = task.slaDeadline;
  
  if (!deadline) return { status: 'not_set', percentage: 100, timeRemaining: null };
  
  const totalTime = deadline - task.createdAt;
  const elapsedTime = now - task.createdAt;
  const percentageUsed = totalTime > 0 ? Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100)) : 0;
  
  let status = 'on_track';
  if (percentageUsed >= 100 || (task.slaBreached === true)) {
    status = 'breached';
  } else if (percentageUsed >= 75) {
    status = 'at_risk';
  } else if (percentageUsed >= 50) {
    status = 'warning';
  }
  
  const hoursRemaining = Math.max(0, Math.round((deadline - now) / (1000 * 60 * 60)));
  const minutesRemaining = Math.max(0, Math.round((deadline - now) / (1000 * 60)));
  
  return {
    status,
    percentageUsed: Math.round(percentageUsed),
    deadline,
    timeRemaining: hoursRemaining > 0 ? `${hoursRemaining}h` : `${minutesRemaining}m`,
    hoursRemaining,
    minutesRemaining
  };
};

/**
 * Send SLA breach notification
 */
const sendSLABreachNotification = async (task, breachDetails) => {
  try {
    const io = getIO();
    const notificationData = {
      title: '⚠️ SLA Breach Alert',
      message: `Task "${task.title}" (${task.taskId}) has breached its SLA deadline.`,
      type: 'sla_breach',
      priority: 'urgent',
      actionUrl: `/tasks/${task._id}`,
      metadata: { 
        taskId: task._id, 
        taskNumber: task.taskId, 
        breachDetails,
        hoursOverdue: breachDetails.hoursRemaining
      }
    };
    
    // Notify assigned technician
    if (task.assignment?.assignedTo) {
      if (io) io.to(`user_${task.assignment.assignedTo}`).emit('sla_breach', notificationData);
      await Notification.create({ 
        userId: task.assignment.assignedTo, 
        ...notificationData,
        read: false
      });
    }
    
    // Notify supervisor
    if (task.assignment?.supervisorId) {
      if (io) io.to(`user_${task.assignment.supervisorId}`).emit('sla_breach', notificationData);
      await Notification.create({ 
        userId: task.assignment.supervisorId, 
        ...notificationData,
        read: false
      });
    }
    
    // Notify manager
    if (task.assignment?.managerId) {
      if (io) io.to(`user_${task.assignment.managerId}`).emit('sla_breach', notificationData);
      await Notification.create({ 
        userId: task.assignment.managerId, 
        ...notificationData,
        read: false
      });
    }
    
    // Log activity
    await ActivityLog.create({
      userId: task.assignment?.assignedTo,
      action: 'SLA_BREACH',
      entityType: 'task',
      entityId: task._id,
      metadata: { taskTitle: task.title, breachDetails },
      timestamp: new Date()
    });
    
  } catch (error) {
    console.error('Send SLA breach notification error:', error);
  }
};

/**
 * Record SLA history
 */
const recordSLAHistory = async (task, type, description, userId = null, metadata = {}) => {
  try {
    const slaHistory = new SLAHistory({
      taskId: task._id,
      taskTitle: task.title,
      taskNumber: task.taskId,
      priority: task.priority,
      type,
      description,
      triggeredBy: userId,
      metadata: {
        ...metadata,
        slaDeadline: task.slaDeadline,
        status: task.status,
        escalationLevel: task.escalationLevel
      },
      timestamp: new Date()
    });
    await slaHistory.save();
    return slaHistory;
  } catch (error) {
    console.error('Record SLA history error:', error);
    return null;
  }
};

// ==================== GET SLA DASHBOARD ====================

/**
 * Get SLA Dashboard data with comprehensive statistics
 */
const getSLADashboard = async (req, res) => {
  try {
    const { buildingId, department, priority } = req.query;
    const now = new Date();
    
    // Build query
    let query = { isDeleted: { $ne: true } };
    if (buildingId && buildingId !== 'undefined') query['location.buildingId'] = buildingId;
    if (department && department !== 'undefined') query.department = department;
    if (priority && priority !== 'undefined') query.priority = priority;
    
    const tasks = await Task.find(query).lean();
    
    // Count tasks by SLA status
    let breachedCount = 0;
    let atRiskCount = 0;
    let warningCount = 0;
    let onTrackCount = 0;
    
    tasks.forEach(task => {
      const slaStatus = calculateSLAStatus(task);
      if (slaStatus.status === 'breached') breachedCount++;
      else if (slaStatus.status === 'at_risk') atRiskCount++;
      else if (slaStatus.status === 'warning') warningCount++;
      else if (slaStatus.status === 'on_track') onTrackCount++;
    });
    
    const totalTasks = tasks.length;
    const onTimeTasks = totalTasks - breachedCount;
    
    // Calculate average resolution time for completed tasks
    const completedTasks = await Task.find({
      status: 'completed',
      isDeleted: { $ne: true },
      'timeline.completedAt': { $exists: true },
      'timeline.startedAt': { $exists: true }
    }).lean();
    
    let totalResolutionHours = 0;
    completedTasks.forEach(task => {
      const completedAt = new Date(task.timeline.completedAt);
      const startedAt = new Date(task.timeline.startedAt);
      const hours = (completedAt - startedAt) / (1000 * 60 * 60);
      totalResolutionHours += hours;
    });
    const avgResolutionHours = completedTasks.length > 0 ? (totalResolutionHours / completedTasks.length).toFixed(1) : 0;
    
    // Calculate average response time
    const assignedTasks = await Task.find({
      'timeline.assignedAt': { $exists: true },
      isDeleted: { $ne: true }
    }).lean();
    
    let totalResponseHours = 0;
    assignedTasks.forEach(task => {
      const assignedAt = new Date(task.timeline.assignedAt);
      const createdAt = new Date(task.createdAt);
      const hours = (assignedAt - createdAt) / (1000 * 60 * 60);
      totalResponseHours += hours;
    });
    const avgResponseHours = assignedTasks.length > 0 ? (totalResponseHours / assignedTasks.length).toFixed(1) : 0;
    
    // SLA by priority
    const slaByPriority = [
      { _id: 'critical', total: tasks.filter(t => t.priority === 'critical').length, breached: tasks.filter(t => t.priority === 'critical' && t.slaBreached).length },
      { _id: 'high', total: tasks.filter(t => t.priority === 'high').length, breached: tasks.filter(t => t.priority === 'high' && t.slaBreached).length },
      { _id: 'medium', total: tasks.filter(t => t.priority === 'medium').length, breached: tasks.filter(t => t.priority === 'medium' && t.slaBreached).length },
      { _id: 'low', total: tasks.filter(t => t.priority === 'low').length, breached: tasks.filter(t => t.priority === 'low' && t.slaBreached).length }
    ];

    res.json({
      success: true,
      data: {
        summary: {
          totalTasks,
          breachedTasks: breachedCount,
          atRiskTasks: atRiskCount,
          warningTasks: warningCount,
          onTimeTasks,
          complianceRate: totalTasks ? ((onTimeTasks / totalTasks) * 100).toFixed(1) : 100
        },
        averageResolutionTime: parseFloat(avgResolutionHours),
        averageResponseTime: parseFloat(avgResponseHours),
        slaByPriority,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Get SLA dashboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET BREACHED TASKS ====================

/**
 * Get all breached tasks with details
 */
const getBreachedTasks = async (req, res) => {
  try {
    const { buildingId, priority, page = 1, limit = 20 } = req.query;
    const now = new Date();
    
    let query = {
      $or: [
        { slaDeadline: { $lt: now } },
        { slaBreached: true }
      ],
      status: { $nin: ['closed', 'cancelled'] },
      isDeleted: { $ne: true }
    };
    
    if (buildingId && buildingId !== 'undefined') query['location.buildingId'] = buildingId;
    if (priority && priority !== 'undefined') query.priority = priority;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('assignment.assignedTo', 'name email technicianType')
        .populate('assignment.supervisorId', 'name email')
        .populate('location.buildingId', 'name code')
        .sort({ slaDeadline: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Task.countDocuments(query)
    ]);
    
    const breachedTasks = tasks.map(task => ({
      ...task,
      slaStatus: calculateSLAStatus(task),
      hoursOverdue: task.slaDeadline ? Math.max(0, Math.round((now - new Date(task.slaDeadline)) / (1000 * 60 * 60))) : 0
    }));
    
    res.json({
      success: true,
      data: breachedTasks,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get breached tasks error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET AT-RISK TASKS ====================

/**
 * Get tasks at risk of SLA breach (due within 2 hours)
 */
const getAtRiskTasks = async (req, res) => {
  try {
    const { buildingId, priority, page = 1, limit = 20 } = req.query;
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    let query = {
      slaDeadline: { $gt: now, $lt: twoHoursFromNow },
      status: { $nin: ['closed', 'cancelled', 'completed', 'verified'] },
      slaBreached: { $ne: true },
      isDeleted: { $ne: true }
    };
    
    if (buildingId && buildingId !== 'undefined') query['location.buildingId'] = buildingId;
    if (priority && priority !== 'undefined') query.priority = priority;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('assignment.assignedTo', 'name email technicianType')
        .populate('location.buildingId', 'name code')
        .sort({ slaDeadline: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Task.countDocuments(query)
    ]);
    
    const atRiskTasks = tasks.map(task => {
      const timeRemaining = task.slaDeadline ? (new Date(task.slaDeadline) - now) / (1000 * 60) : 0;
      return {
        ...task,
        slaStatus: calculateSLAStatus(task),
        hoursRemaining: Math.max(0, Math.floor(timeRemaining / 60)),
        minutesRemaining: Math.max(0, Math.floor(timeRemaining % 60))
      };
    });
    
    res.json({
      success: true,
      data: atRiskTasks,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get at-risk tasks error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET SLA HISTORY ====================

/**
 * Get SLA history for a specific task or all history
 */
const getSLAHistory = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { startDate, endDate, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (taskId && taskId !== 'undefined' && taskId !== 'null') {
      query.taskId = taskId;
    }
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [history, total] = await Promise.all([
      SLAHistory.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      SLAHistory.countDocuments(query)
    ]);
    
    // Get task details if taskId is provided
    let task = null;
    if (taskId && taskId !== 'undefined' && taskId !== 'null') {
      task = await Task.findById(taskId).select('taskId title priority slaDeadline status').lean();
    }
    
    const summary = {
      totalEscalations: history.filter(h => h.type === 'escalation').length,
      totalBreaches: history.filter(h => h.type === 'breach').length,
      totalWarnings: history.filter(h => h.type === 'warning').length
    };
    
    res.json({
      success: true,
      data: history,
      task,
      summary,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get SLA history error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== ESCALATE TASK ====================

/**
 * Escalate a task due to SLA breach or other reasons
 */
const escalateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { reason } = req.body;
    const userId = req.user?._id || req.user?.id || req.userId;
    const userName = req.user?.name || req.user?.firstName + ' ' + req.user?.lastName || 'System';
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    const escalationLevel = (task.escalationLevel || 0) + 1;
    
    task.escalationLevel = escalationLevel;
    task.escalationReason = reason;
    task.escalatedAt = new Date();
    task.status = 'escalated';
    await task.save();
    
    // Record escalation in SLA history
    await recordSLAHistory(
      task, 
      'escalation', 
      `Task escalated to level ${escalationLevel} due to: ${reason}`,
      userId,
      { escalationLevel, reason }
    );
    
    // Send escalation notification
    const io = getIO();
    const notificationData = {
      title: `🚨 Task Escalated - Level ${escalationLevel}`,
      message: `Task "${task.title}" (${task.taskId}) has been escalated. Reason: ${reason}`,
      type: 'escalation',
      priority: 'urgent',
      actionUrl: `/tasks/${task._id}`,
      metadata: { taskId: task._id, escalationLevel, reason }
    };
    
    // Notify admins
    if (io) {
      io.to('role_admin').to('role_super_admin').emit('task_escalated', notificationData);
    }
    
    await Notification.create({ 
      userId: task.assignment?.assignedTo, 
      ...notificationData,
      read: false
    });
    
    await ActivityLog.create({
      userId,
      userName,
      action: 'ESCALATE_TASK',
      entityType: 'Task',
      entityId: task._id,
      metadata: { escalationLevel, reason },
      ipAddress: req.ip || req.connection.remoteAddress
    });
    
    res.json({
      success: true,
      data: task,
      message: `Task escalated to level ${escalationLevel}`
    });
  } catch (error) {
    console.error('Escalate task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET MONTHLY SLA REPORT ====================

/**
 * Get comprehensive monthly SLA report
 */
const getMonthlySLAReport = async (req, res) => {
  try {
    const { year, month, buildingId, department } = req.query;
    const targetYear = parseInt(year) || new Date().getFullYear();
    const targetMonth = parseInt(month) || new Date().getMonth() + 1;
    
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0);
    endDate.setHours(23, 59, 59, 999);
    
    let query = {
      createdAt: { $gte: startDate, $lte: endDate },
      isDeleted: { $ne: true }
    };
    
    if (buildingId && buildingId !== 'undefined') query['location.buildingId'] = buildingId;
    if (department && department !== 'undefined') query.department = department;
    
    const tasks = await Task.find(query).lean();
    
    const totalTasks = tasks.length;
    const breachedTasks = tasks.filter(t => t.slaBreached === true).length;
    const onTimeTasks = totalTasks - breachedTasks;
    const complianceRate = totalTasks ? ((onTimeTasks / totalTasks) * 100).toFixed(1) : 100;
    
    // Daily breakdown
    const daysInMonth = endDate.getDate();
    const dailyBreakdown = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(targetYear, targetMonth - 1, i);
      const nextDate = new Date(targetYear, targetMonth - 1, i + 1);
      const dailyTasks = tasks.filter(t => {
        const createdAt = new Date(t.createdAt);
        return createdAt >= date && createdAt < nextDate;
      });
      const dailyBreached = dailyTasks.filter(t => t.slaBreached).length;
      dailyBreakdown.push({
        date: i,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        total: dailyTasks.length,
        breached: dailyBreached,
        compliance: dailyTasks.length ? ((dailyTasks.length - dailyBreached) / dailyTasks.length * 100).toFixed(1) : 100
      });
    }
    
    // Priority breakdown
    const priorityBreakdown = {};
    ['critical', 'high', 'medium', 'low'].forEach(p => {
      const priorityTasks = tasks.filter(t => t.priority === p);
      const priorityBreached = priorityTasks.filter(t => t.slaBreached).length;
      priorityBreakdown[p] = {
        total: priorityTasks.length,
        breached: priorityBreached,
        compliance: priorityTasks.length ? ((priorityTasks.length - priorityBreached) / priorityTasks.length * 100).toFixed(1) : 100
      };
    });

    res.json({
      success: true,
      data: {
        period: {
          year: targetYear,
          month: targetMonth,
          monthName: new Date(targetYear, targetMonth - 1, 1).toLocaleString('default', { month: 'long' })
        },
        summary: {
          totalTasks,
          breachedTasks,
          onTimeTasks,
          complianceRate
        },
        dailyBreakdown,
        priorityBreakdown,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Get monthly SLA report error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET DATE RANGE SLA REPORT (NEW) ====================

/**
 * Get SLA report for custom date range
 */
const getDateRangeReport = async (req, res) => {
  try {
    const { startDate, endDate, buildingId, department } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    let query = {
      createdAt: { $gte: start, $lte: end },
      isDeleted: { $ne: true }
    };
    
    if (buildingId && buildingId !== 'undefined') query['location.buildingId'] = buildingId;
    if (department && department !== 'undefined') query.department = department;
    
    const tasks = await Task.find(query).lean();
    
    const totalTasks = tasks.length;
    const breachedTasks = tasks.filter(t => t.slaBreached === true).length;
    const onTimeTasks = totalTasks - breachedTasks;
    const complianceRate = totalTasks ? ((onTimeTasks / totalTasks) * 100).toFixed(1) : 100;
    
    // Daily breakdown
    const dailyBreakdown = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dailyTasks = tasks.filter(t => {
        const createdAt = new Date(t.createdAt);
        return createdAt >= currentDate && createdAt < nextDate;
      });
      const dailyBreached = dailyTasks.filter(t => t.slaBreached).length;
      
      dailyBreakdown.push({
        date: currentDate.toISOString().split('T')[0],
        dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
        total: dailyTasks.length,
        breached: dailyBreached,
        compliance: dailyTasks.length ? ((dailyTasks.length - dailyBreached) / dailyTasks.length * 100).toFixed(1) : 100
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    res.json({
      success: true,
      data: {
        summary: {
          totalTasks,
          breachedTasks,
          onTimeTasks,
          complianceRate: parseFloat(complianceRate)
        },
        dailyBreakdown,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Get date range SLA report error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET SLA SUMMARY (NEW) ====================

/**
 * Get SLA summary for dashboard quick stats
 */
const getSLASummary = async (req, res) => {
  try {
    const { buildingId } = req.query;
    const now = new Date();
    
    let query = {
      status: { $in: ['assigned', 'accepted', 'in_progress'] },
      isDeleted: { $ne: true }
    };
    
    if (buildingId && buildingId !== 'undefined') query['location.buildingId'] = buildingId;
    
    const tasks = await Task.find(query).lean();
    
    let atRiskTasks = 0;
    let breachedTasks = 0;
    let onTrackTasks = 0;
    
    tasks.forEach(task => {
      if (!task.slaDeadline) return;
      
      const deadline = new Date(task.slaDeadline);
      const timeRemaining = (deadline - now) / (1000 * 60 * 60);
      
      if (timeRemaining < 0) {
        breachedTasks++;
      } else if (timeRemaining < 2) {
        atRiskTasks++;
      } else {
        onTrackTasks++;
      }
    });
    
    const totalTasks = tasks.length;
    const complianceRate = totalTasks > 0 
      ? parseFloat(((onTrackTasks / totalTasks) * 100).toFixed(1))
      : 100;
    
    res.json({
      success: true,
      data: {
        summary: {
          totalTasks,
          breachedTasks,
          atRiskTasks,
          onTimeTasks: onTrackTasks,
          complianceRate
        }
      }
    });
  } catch (error) {
    console.error('Get SLA summary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== EXPORT SLA REPORT (NEW) ====================

/**
 * Export SLA report as CSV/Excel
 */
const exportSLAReport = async (req, res) => {
  try {
    const { year, month, format = 'csv', buildingId } = req.query;
    const targetYear = parseInt(year) || new Date().getFullYear();
    const targetMonth = parseInt(month) || new Date().getMonth() + 1;
    
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0);
    endDate.setHours(23, 59, 59, 999);
    
    let query = {
      createdAt: { $gte: startDate, $lte: endDate },
      isDeleted: { $ne: true }
    };
    
    if (buildingId && buildingId !== 'undefined') query['location.buildingId'] = buildingId;
    
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .lean();
    
    if (format === 'csv') {
      // Generate CSV
      let csvRows = [
        ['Task ID', 'Title', 'Priority', 'Status', 'Created At', 'SLA Deadline', 'SLA Breached', 'Assigned To']
      ];
      
      tasks.forEach(task => {
        csvRows.push([
          task.taskId || task._id,
          `"${task.title.replace(/"/g, '""')}"`,
          task.priority || 'medium',
          task.status,
          new Date(task.createdAt).toLocaleDateString(),
          task.slaDeadline ? new Date(task.slaDeadline).toLocaleDateString() : 'N/A',
          task.slaBreached ? 'Yes' : 'No',
          task.assignedTo?.name || 'Unassigned'
        ]);
      });
      
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=sla_report_${targetYear}_${targetMonth}.csv`);
      res.send(csvContent);
    } else {
      // Return JSON
      res.json({
        success: true,
        data: tasks,
        count: tasks.length,
        period: { year: targetYear, month: targetMonth }
      });
    }
  } catch (error) {
    console.error('Export SLA report error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== SLA STATISTICS ====================

/**
 * Get SLA statistics summary
 */
const getSLAStatistics = async (req, res) => {
  try {
    const { buildingId, period = 'week' } = req.query;
    
    let startDate = new Date();
    if (period === 'day') {
      startDate.setDate(startDate.getDate() - 1);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }
    
    let query = {
      createdAt: { $gte: startDate },
      isDeleted: { $ne: true }
    };
    
    if (buildingId && buildingId !== 'undefined') query['location.buildingId'] = buildingId;
    
    const tasks = await Task.find(query).lean();
    
    const totalTasks = tasks.length;
    const breachedTasks = tasks.filter(t => t.slaBreached === true).length;
    const complianceRate = totalTasks ? ((totalTasks - breachedTasks) / totalTasks * 100).toFixed(1) : 100;
    
    // Calculate trend data
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayTasks = tasks.filter(t => {
        const createdAt = new Date(t.createdAt);
        return createdAt >= date && createdAt < nextDate;
      });
      const dayBreached = dayTasks.filter(t => t.slaBreached).length;
      dailyData.push({
        date: date.toLocaleDateString(),
        total: dayTasks.length,
        breached: dayBreached,
        compliance: dayTasks.length ? ((dayTasks.length - dayBreached) / dayTasks.length * 100).toFixed(1) : 100
      });
    }
    
    res.json({
      success: true,
      data: {
        totalTasks,
        breachedTasks,
        complianceRate: parseFloat(complianceRate),
        averageResponseTime: 0,
        averageResolutionTime: 0,
        trend: dailyData
      }
    });
  } catch (error) {
    console.error('Get SLA statistics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== MONITOR SLA (Cron Job) ====================

/**
 * Monitor SLA for all active tasks (called by cron job)
 */
const monitorSLA = async () => {
  try {
    const activeTasks = await Task.find({
      status: { $nin: ['closed', 'cancelled', 'completed'] },
      isDeleted: { $ne: true },
      slaDeadline: { $exists: true }
    });
    
    let breachedCount = 0;
    let notificationCount = 0;
    
    for (const task of activeTasks) {
      const slaStatus = calculateSLAStatus(task);
      
      if (slaStatus.status === 'breached' && !task.slaBreached) {
        task.slaBreached = true;
        task.slaBreachedAt = new Date();
        await task.save();
        breachedCount++;
        
        // Send notification
        await sendSLABreachNotification(task, slaStatus);
        await recordSLAHistory(task, 'breach', 'SLA deadline breached', null, slaStatus);
        notificationCount++;
      }
      
      // Send warning for at-risk tasks (if not already notified)
      if (slaStatus.status === 'at_risk' && !task.slaWarningSent) {
        task.slaWarningSent = true;
        await task.save();
        
        const warningData = {
          title: '⚠️ SLA Warning',
          message: `Task "${task.title}" (${task.taskId}) is at risk of breaching SLA deadline.`,
          type: 'sla_warning',
          priority: 'high',
          actionUrl: `/tasks/${task._id}`,
          metadata: { taskId: task._id, hoursRemaining: slaStatus.hoursRemaining }
        };
        
        const io = getIO();
        if (io && task.assignment?.assignedTo) {
          io.to(`user_${task.assignment.assignedTo}`).emit('sla_warning', warningData);
        }
        
        await recordSLAHistory(task, 'warning', `SLA warning: ${slaStatus.hoursRemaining} hours remaining`, null, slaStatus);
        notificationCount++;
      }
    }
    
    console.log(`[SLA Monitor] ${breachedCount} new breaches, ${notificationCount} notifications sent`);
    return { breachedCount, notificationCount };
  } catch (error) {
    console.error('Monitor SLA error:', error);
    return { breachedCount: 0, notificationCount: 0, error: error.message };
  }
};

// ==================== EXPORTS ====================

module.exports = {
  getSLADashboard,
  getBreachedTasks,
  getAtRiskTasks,
  getSLAHistory,
  escalateTask,
  getMonthlySLAReport,
  getDateRangeReport,      // NEW - Added
  getSLASummary,           // NEW - Added
  exportSLAReport,         // NEW - Added
  getSLAStatistics,
  monitorSLA,
  calculateSLAStatus,
  sendSLABreachNotification
};