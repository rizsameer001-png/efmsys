/**
 * SLA CONTROLLER
 * Handles SLA monitoring, breach alerts, and escalation
 */

// const Task = require('../models/task.model');
// const SLAHistory = require('../models/sla-history.model');

// /**
//  * Get SLA Dashboard data
//  */
// exports.getSLADashboard = async (req, res) => {
//   try {
//     const now = new Date();
    
//     // Count tasks by SLA status
//     const totalTasks = await Task.countDocuments();
//     const breachedTasks = await Task.countDocuments({
//       slaDeadline: { $lt: now },
//       status: { $nin: ['closed', 'cancelled'] }
//     });
    
//     const atRiskTasks = await Task.countDocuments({
//       slaDeadline: { $gt: now, $lt: new Date(now.getTime() + 2 * 60 * 60 * 1000) },
//       status: { $nin: ['closed', 'cancelled'] },
//       slaBreached: false
//     });
    
//     const onTimeTasks = totalTasks - breachedTasks - atRiskTasks;
    
//     // Average resolution time
//     const resolutionTime = await Task.aggregate([
//       {
//         $match: {
//           'timeline.completedAt': { $exists: true },
//           'timeline.startedAt': { $exists: true }
//         }
//       },
//       {
//         $project: {
//           duration: {
//             $divide: [
//               { $subtract: ['$timeline.completedAt', '$timeline.startedAt'] },
//               1000 * 60 * 60
//             ]
//           }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           avgHours: { $avg: '$duration' }
//         }
//       }
//     ]);
    
//     // SLA by priority
//     const slaByPriority = await Task.aggregate([
//       {
//         $group: {
//           _id: '$priority',
//           total: { $sum: 1 },
//           breached: {
//             $sum: {
//               $cond: [{ $eq: ['$slaBreached', true] }, 1, 0]
//             }
//           }
//         }
//       }
//     ]);

//     res.json({
//       success: true,
//       data: {
//         summary: {
//           totalTasks,
//           breachedTasks,
//           atRiskTasks,
//           onTimeTasks,
//           complianceRate: totalTasks ? ((onTimeTasks / totalTasks) * 100).toFixed(1) : 100
//         },
//         averageResolutionTime: resolutionTime[0]?.avgHours || 0,
//         slaByPriority
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get breached tasks
//  */
// exports.getBreachedTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({
//       slaDeadline: { $lt: new Date() },
//       status: { $nin: ['closed', 'cancelled'] }
//     })
//       .populate('assignment.assignedTo', 'firstName lastName email')
//       .populate('location.buildingId', 'name')
//       .sort({ slaDeadline: 1 });

//     res.json({
//       success: true,
//       data: tasks
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get at-risk tasks (due within 2 hours)
//  */
// exports.getAtRiskTasks = async (req, res) => {
//   try {
//     const now = new Date();
//     const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
//     const tasks = await Task.find({
//       slaDeadline: { $gt: now, $lt: twoHoursFromNow },
//       status: { $nin: ['closed', 'cancelled'] },
//       slaBreached: false
//     })
//       .populate('assignment.assignedTo', 'firstName lastName email')
//       .populate('location.buildingId', 'name')
//       .sort({ slaDeadline: 1 });

//     res.json({
//       success: true,
//       data: tasks
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get SLA history for a task
//  */
// exports.getSLAHistory = async (req, res) => {
//   try {
//     const { taskId } = req.params;
    
//     const history = await SLAHistory.find({ taskId })
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: history
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Escalate a task
//  */
// exports.escalateTask = async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const { reason } = req.body;
    
//     const task = await Task.findById(taskId);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }

//     task.escalationLevel = (task.escalationLevel || 0) + 1;
//     task.escalationReason = reason;
//     task.escalatedAt = new Date();
//     await task.save();

//     // Record in SLA history
//     const slaHistory = new SLAHistory({
//       taskId,
//       taskTitle: task.title,
//       priority: task.priority,
//       escalations: [{
//         level: task.escalationLevel,
//         escalatedAt: new Date(),
//         reason
//       }]
//     });
//     await slaHistory.save();

//     res.json({
//       success: true,
//       data: task,
//       message: `Task escalated to level ${task.escalationLevel}`
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get monthly SLA report
//  */
// exports.getMonthlySLAReport = async (req, res) => {
//   try {
//     const { year, month } = req.query;
//     const targetYear = parseInt(year) || new Date().getFullYear();
//     const targetMonth = parseInt(month) || new Date().getMonth() + 1;
    
//     const startDate = new Date(targetYear, targetMonth - 1, 1);
//     const endDate = new Date(targetYear, targetMonth, 0);

//     const tasks = await Task.find({
//       createdAt: { $gte: startDate, $lte: endDate }
//     });

//     const totalTasks = tasks.length;
//     const breachedTasks = tasks.filter(t => t.slaBreached).length;
//     const onTimeTasks = totalTasks - breachedTasks;

//     // Daily breakdown
//     const dailyBreakdown = {};
//     for (let i = 1; i <= endDate.getDate(); i++) {
//       const date = new Date(targetYear, targetMonth - 1, i);
//       const dailyTasks = tasks.filter(t => 
//         new Date(t.createdAt).toDateString() === date.toDateString()
//       );
//       dailyBreakdown[i] = {
//         total: dailyTasks.length,
//         breached: dailyTasks.filter(t => t.slaBreached).length
//       };
//     }

//     res.json({
//       success: true,
//       data: {
//         year: targetYear,
//         month: targetMonth,
//         summary: {
//           totalTasks,
//           breachedTasks,
//           onTimeTasks,
//           complianceRate: totalTasks ? ((onTimeTasks / totalTasks) * 100).toFixed(1) : 100
//         },
//         dailyBreakdown
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }



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
  const percentageUsed = Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));
  
  let status = 'on_track';
  if (percentageUsed >= 100 || (task.slaBreached === true)) {
    status = 'breached';
  } else if (percentageUsed >= 75) {
    status = 'at_risk';
  } else if (percentageUsed >= 50) {
    status = 'warning';
  }
  
  return {
    status,
    percentageUsed: Math.round(percentageUsed),
    deadline,
    timeRemaining: Math.max(0, Math.round((deadline - now) / (1000 * 60 * 60)))
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
      body: `Task "${task.title}" (${task.taskId}) has breached its SLA deadline.`,
      type: 'sla_breach',
      priority: 'high',
      referenceId: task._id,
      referenceModel: 'Task',
      data: { taskId: task._id, taskNumber: task.taskId, breachDetails }
    };
    
    // Notify assigned technician
    if (task.assignment?.assignedTo) {
      if (io) io.to(`user_${task.assignment.assignedTo}`).emit('sla_breach', notificationData);
      await Notification.create({ userId: task.assignment.assignedTo, ...notificationData });
    }
    
    // Notify supervisor
    if (task.assignment?.supervisorId) {
      if (io) io.to(`user_${task.assignment.supervisorId}`).emit('sla_breach', notificationData);
      await Notification.create({ userId: task.assignment.supervisorId, ...notificationData });
    }
    
    // Notify manager
    if (task.assignment?.managerId) {
      if (io) io.to(`user_${task.assignment.managerId}`).emit('sla_breach', notificationData);
      await Notification.create({ userId: task.assignment.managerId, ...notificationData });
    }
    
    // Notify admins
    if (io) io.to('role_admin').to('role_super_admin').emit('sla_breach', notificationData);
  } catch (error) {
    console.error('Send SLA breach notification error:', error);
  }
};

/**
 * Record SLA history
 */
const recordSLAHistory = async (task, type, description, userId, metadata = {}) => {
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
    const { buildingId, department } = req.query;
    const now = new Date();
    
    let query = { isDeleted: false };
    if (buildingId) query['location.buildingId'] = buildingId;
    if (department) query.department = department;
    
    const tasks = await Task.find(query);
    
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
    const onTimeTasks = totalTasks - breachedCount - atRiskCount - warningCount;
    
    // Calculate average resolution time
    const resolutionTimeResult = await Task.aggregate([
      {
        $match: {
          'timeline.completedAt': { $exists: true },
          'timeline.startedAt': { $exists: true },
          isDeleted: false
        }
      },
      {
        $project: {
          duration: {
            $divide: [
              { $subtract: ['$timeline.completedAt', '$timeline.startedAt'] },
              1000 * 60 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgHours: { $avg: '$duration' },
          minHours: { $min: '$duration' },
          maxHours: { $max: '$duration' }
        }
      }
    ]);
    
    // Calculate average response time
    const responseTimeResult = await Task.aggregate([
      {
        $match: {
          'timeline.assignedAt': { $exists: true },
          isDeleted: false
        }
      },
      {
        $project: {
          duration: {
            $divide: [
              { $subtract: ['$timeline.assignedAt', '$createdAt'] },
              1000 * 60 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgHours: { $avg: '$duration' }
        }
      }
    ]);
    
    // SLA by priority
    const slaByPriority = await Task.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$priority',
          total: { $sum: 1 },
          breached: {
            $sum: {
              $cond: [{ $eq: ['$slaBreached', true] }, 1, 0]
            }
          }
        }
      }
    ]);
    
    // SLA by status
    const slaByStatus = await Task.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$status',
          total: { $sum: 1 },
          breached: {
            $sum: {
              $cond: [{ $eq: ['$slaBreached', true] }, 1, 0]
            }
          }
        }
      }
    ]);

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
        averageResolutionTime: {
          hours: resolutionTimeResult[0]?.avgHours?.toFixed(1) || 0,
          minHours: resolutionTimeResult[0]?.minHours?.toFixed(1) || 0,
          maxHours: resolutionTimeResult[0]?.maxHours?.toFixed(1) || 0
        },
        averageResponseTime: responseTimeResult[0]?.avgHours?.toFixed(1) || 0,
        slaByPriority,
        slaByStatus,
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
    const { buildingId, page = 1, limit = 20 } = req.query;
    const now = new Date();
    
    let query = {
      $or: [
        { slaDeadline: { $lt: now } },
        { slaBreached: true }
      ],
      status: { $nin: ['closed', 'cancelled'] },
      isDeleted: false
    };
    
    if (buildingId) query['location.buildingId'] = buildingId;
    
    const skip = (page - 1) * limit;
    
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('assignment.assignedTo', 'name email technicianType')
        .populate('assignment.supervisorId', 'name email')
        .populate('location.buildingId', 'name code')
        .sort({ slaDeadline: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Task.countDocuments(query)
    ]);
    
    const breachedTasks = tasks.map(task => ({
      ...task.toObject(),
      slaStatus: calculateSLAStatus(task),
      hoursOverdue: task.slaDeadline ? Math.max(0, Math.round((now - task.slaDeadline) / (1000 * 60 * 60))) : 0
    }));
    
    res.json({
      success: true,
      data: breachedTasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
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
    const { buildingId, page = 1, limit = 20 } = req.query;
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    
    let query = {
      slaDeadline: { $gt: now, $lt: twoHoursFromNow },
      status: { $nin: ['closed', 'cancelled', 'completed', 'verified'] },
      slaBreached: false,
      isDeleted: false
    };
    
    if (buildingId) query['location.buildingId'] = buildingId;
    
    const skip = (page - 1) * limit;
    
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('assignment.assignedTo', 'name email technicianType')
        .populate('location.buildingId', 'name code')
        .sort({ slaDeadline: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Task.countDocuments(query)
    ]);
    
    const atRiskTasks = tasks.map(task => ({
      ...task.toObject(),
      slaStatus: calculateSLAStatus(task),
      hoursRemaining: Math.max(0, Math.round((task.slaDeadline - now) / (1000 * 60 * 60))),
      minutesRemaining: Math.max(0, Math.round((task.slaDeadline - now) / (1000 * 60)))
    }));
    
    res.json({
      success: true,
      data: atRiskTasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get at-risk tasks error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET SLA HISTORY ====================

/**
 * Get SLA history for a specific task
 */
const getSLAHistory = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const [history, task] = await Promise.all([
      SLAHistory.find({ taskId }).sort({ timestamp: -1 }),
      Task.findById(taskId).select('taskId title priority slaDeadline status')
    ]);
    
    if (!task && history.length === 0) {
      return res.status(404).json({ success: false, error: 'No SLA history found' });
    }
    
    res.json({
      success: true,
      data: {
        task,
        history,
        currentStatus: task ? calculateSLAStatus(task) : null,
        totalEscalations: history.filter(h => h.type === 'escalation').length,
        totalBreaches: history.filter(h => h.type === 'breach').length
      }
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
    const { reason, escalateTo } = req.body;
    const userId = req.user._id || req.userId;
    const userName = req.user.name;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    const escalationLevel = (task.escalationLevel || 0) + 1;
    let escalatedTo = escalateTo;
    let escalatedToRole = '';
    
    // Determine escalation target based on level if not specified
    if (!escalatedTo) {
      if (escalationLevel === 1) {
        escalatedToRole = 'supervisor';
        escalatedTo = task.assignment?.supervisorId;
      } else if (escalationLevel === 2) {
        escalatedToRole = 'manager';
        escalatedTo = task.assignment?.managerId;
      } else {
        escalatedToRole = 'admin';
      }
    }
    
    task.escalationLevel = escalationLevel;
    task.escalationReason = reason;
    task.escalatedAt = new Date();
    task.escalatedTo = escalatedTo;
    task.status = 'escalated';
    await task.save();
    
    // Record escalation in SLA history
    await recordSLAHistory(
      task, 
      'escalation', 
      `Task escalated to level ${escalationLevel} due to: ${reason}`,
      userId,
      { escalationLevel, escalatedToRole, reason }
    );
    
    // Send escalation notification
    const io = getIO();
    const notificationData = {
      title: `🚨 Task Escalated - Level ${escalationLevel}`,
      body: `Task "${task.title}" (${task.taskId}) has been escalated to ${escalatedToRole || 'higher level'}. Reason: ${reason}`,
      type: 'escalation',
      priority: 'high',
      referenceId: task._id,
      referenceModel: 'Task',
      data: { taskId: task._id, escalationLevel, reason }
    };
    
    if (escalatedTo && io) {
      io.to(`user_${escalatedTo}`).emit('task_escalated', notificationData);
      await Notification.create({ userId: escalatedTo, ...notificationData });
    }
    
    // Also notify admins
    if (io) {
      io.to('role_admin').to('role_super_admin').emit('task_escalated', notificationData);
    }
    
    await ActivityLog.create({
      userId,
      userName,
      userRole: req.user.role,
      action: 'ESCALATE_TASK',
      entityType: 'task',
      entityId: task._id,
      newData: { escalationLevel, reason, escalatedToRole },
      ipAddress: req.ip
    });
    
    res.json({
      success: true,
      data: task,
      message: `Task escalated to level ${escalationLevel}${escalatedToRole ? ` (${escalatedToRole})` : ''}`
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
    
    let query = {
      createdAt: { $gte: startDate, $lte: endDate },
      isDeleted: false
    };
    
    if (buildingId) query['location.buildingId'] = buildingId;
    if (department) query.department = department;
    
    const tasks = await Task.find(query);
    
    const totalTasks = tasks.length;
    const breachedTasks = tasks.filter(t => t.slaBreached).length;
    const onTimeTasks = totalTasks - breachedTasks;
    
    // Daily breakdown
    const dailyBreakdown = [];
    for (let i = 1; i <= endDate.getDate(); i++) {
      const date = new Date(targetYear, targetMonth - 1, i);
      const dailyTasks = tasks.filter(t => 
        new Date(t.createdAt).toDateString() === date.toDateString()
      );
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
    
    // Team performance
    const teamPerformance = {};
    const technicians = [...new Set(tasks.map(t => t.assignment?.assignedToName).filter(Boolean))];
    for (const tech of technicians) {
      const techTasks = tasks.filter(t => t.assignment?.assignedToName === tech);
      const techBreached = techTasks.filter(t => t.slaBreached).length;
      teamPerformance[tech] = {
        total: techTasks.length,
        breached: techBreached,
        compliance: techTasks.length ? ((techTasks.length - techBreached) / techTasks.length * 100).toFixed(1) : 100
      };
    }
    
    // Calculate trends (compare with previous month)
    const prevMonthStart = new Date(targetYear, targetMonth - 2, 1);
    const prevMonthEnd = new Date(targetYear, targetMonth - 1, 0);
    const prevMonthTasks = await Task.countDocuments({
      createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
      isDeleted: false
    });
    const prevMonthBreached = await Task.countDocuments({
      createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
      slaBreached: true,
      isDeleted: false
    });
    const prevMonthCompliance = prevMonthTasks ? ((prevMonthTasks - prevMonthBreached) / prevMonthTasks * 100).toFixed(1) : 100;
    
    const currentCompliance = totalTasks ? ((totalTasks - breachedTasks) / totalTasks * 100).toFixed(1) : 100;
    const trend = (currentCompliance - prevMonthCompliance).toFixed(1);

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
          complianceRate: currentCompliance,
          previousMonthCompliance: prevMonthCompliance,
          trend: trend > 0 ? `+${trend}%` : `${trend}%`
        },
        dailyBreakdown,
        priorityBreakdown,
        teamPerformance: Object.entries(teamPerformance).map(([name, data]) => ({ name, ...data })),
        topPerformingTeam: Object.entries(teamPerformance).sort((a, b) => b[1].compliance - a[1].compliance)[0] || null,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Get monthly SLA report error:', error);
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
      status: { $nin: ['closed', 'cancelled'] },
      isDeleted: false,
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
    }
    
    console.log(`SLA Monitor: ${breachedCount} new breaches, ${notificationCount} notifications sent`);
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
  monitorSLA,
  calculateSLAStatus,
  sendSLABreachNotification
};
// };