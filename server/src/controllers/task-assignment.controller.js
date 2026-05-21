// /**
//  * TASK ASSIGNMENT CONTROLLER
//  * Handles auto/manual assignment, skill matching, workload balancing
//  */

// const Task = require('../models/task.model');
// const User = require('../models/user.model');
// const TaskAssignment = require('../models/task-assignment.model');

// /**
//  * Auto-assign task based on skill matching and workload
//  */
// exports.autoAssignTask = async (req, res) => {
//   try {
//     const { taskId } = req.params;
    
//     const task = await Task.findById(taskId);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }

//     // Find available technicians
//     const technicians = await User.find({
//       role: 'technician',
//       status: 'active'
//     });

//     // Score each technician
//     const scored = await Promise.all(technicians.map(async tech => {
//       const activeTasks = await Task.countDocuments({
//         'assignment.assignedTo': tech._id,
//         status: { $in: ['assigned', 'accepted', 'in_progress'] }
//       });
      
//       const score = calculateScore(tech, task, activeTasks);
//       return { technician: tech, score };
//     }));

//     scored.sort((a, b) => b.score - a.score);
    
//     if (scored.length === 0 || scored[0].score < 30) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'No suitable technician found' 
//       });
//     }

//     const bestTech = scored[0].technician;
    
//     // Assign task
//     task.assignment.assignedTo = bestTech._id;
//     task.assignment.assignedToName = `${bestTech.firstName} ${bestTech.lastName}`;
//     task.assignment.assignedBy = req.userId;
//     task.assignment.assignedAt = new Date();
//     task.status = 'assigned';
//     await task.save();

//     // Record assignment
//     const assignment = new TaskAssignment({
//       taskId: task._id,
//       currentAssignee: bestTech._id,
//       currentAssigneeName: `${bestTech.firstName} ${bestTech.lastName}`,
//       assignmentMethod: 'auto',
//       priorityScore: scored[0].score,
//       assignments: [{
//         technicianId: bestTech._id,
//         technicianName: `${bestTech.firstName} ${bestTech.lastName}`,
//         assignedBy: req.userId,
//         type: 'auto',
//         status: 'pending'
//       }]
//     });
//     await assignment.save();

//     res.json({
//       success: true,
//       data: { task, assignment, matchScore: scored[0].score },
//       message: `Task auto-assigned to ${bestTech.firstName} ${bestTech.lastName}`
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Manual assign task to selected technician
//  */
// exports.manualAssignTask = async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const { technicianId, notes } = req.body;

//     const task = await Task.findById(taskId);
//     const technician = await User.findById(technicianId);

//     if (!task || !technician) {
//       return res.status(404).json({ success: false, error: 'Task or technician not found' });
//     }

//     task.assignment.assignedTo = technician._id;
//     task.assignment.assignedToName = `${technician.firstName} ${technician.lastName}`;
//     task.assignment.assignedBy = req.userId;
//     task.assignment.assignedAt = new Date();
//     task.status = 'assigned';
//     await task.save();

//     const assignment = new TaskAssignment({
//       taskId: task._id,
//       currentAssignee: technician._id,
//       currentAssigneeName: `${technician.firstName} ${technician.lastName}`,
//       assignmentMethod: 'manual',
//       assignments: [{
//         technicianId: technician._id,
//         technicianName: `${technician.firstName} ${technician.lastName}`,
//         assignedBy: req.userId,
//         type: 'manual',
//         status: 'pending',
//         reason: notes
//       }]
//     });
//     await assignment.save();

//     res.json({
//       success: true,
//       data: { task, assignment },
//       message: `Task assigned to ${technician.firstName} ${technician.lastName}`
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Reassign task to different technician
//  */
// exports.reassignTask = async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const { technicianId, reason } = req.body;

//     const task = await Task.findById(taskId);
//     const newTechnician = await User.findById(technicianId);

//     if (!task || !newTechnician) {
//       return res.status(404).json({ success: false, error: 'Task or technician not found' });
//     }

//     const oldTechnicianId = task.assignment.assignedTo;
    
//     task.assignment.assignedTo = newTechnician._id;
//     task.assignment.assignedToName = `${newTechnician.firstName} ${newTechnician.lastName}`;
//     task.assignment.reassignmentCount += 1;
//     task.assignment.reassignmentReason = reason;
//     task.status = 'assigned';
//     await task.save();

//     const assignment = await TaskAssignment.findOne({ taskId });
//     if (assignment) {
//       assignment.assignments.push({
//         technicianId: newTechnician._id,
//         technicianName: `${newTechnician.firstName} ${newTechnician.lastName}`,
//         assignedBy: req.userId,
//         type: 'reassignment',
//         status: 'pending',
//         reason: reason
//       });
//       assignment.currentAssignee = newTechnician._id;
//       assignment.currentAssigneeName = `${newTechnician.firstName} ${newTechnician.lastName}`;
//       await assignment.save();
//     }

//     res.json({
//       success: true,
//       data: task,
//       message: `Task reassigned to ${newTechnician.firstName} ${newTechnician.lastName}`
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get assignment history for a task
//  */
// exports.getAssignmentHistory = async (req, res) => {
//   try {
//     const { taskId } = req.params;
    
//     const assignment = await TaskAssignment.findOne({ taskId })
//       .populate('assignments.technicianId', 'firstName lastName')
//       .populate('assignments.assignedBy', 'firstName lastName');

//     res.json({
//       success: true,
//       data: assignment || { assignments: [] }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get technician workload
//  */
// exports.getTechnicianWorkload = async (req, res) => {
//   try {
//     const { technicianId } = req.params;
    
//     const activeTasks = await Task.countDocuments({
//       'assignment.assignedTo': technicianId,
//       status: { $in: ['assigned', 'accepted', 'in_progress'] }
//     });
    
//     const pendingTasks = await Task.countDocuments({
//       'assignment.assignedTo': technicianId,
//       status: 'assigned'
//     });
    
//     const completedToday = await Task.countDocuments({
//       'assignment.assignedTo': technicianId,
//       'timeline.completedAt': { $gte: new Date().setHours(0, 0, 0, 0) }
//     });

//     res.json({
//       success: true,
//       data: {
//         technicianId,
//         activeTasks,
//         pendingTasks,
//         completedToday,
//         capacityPercentage: Math.min(100, (activeTasks / 5) * 100)
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get available technicians for a task
//  */
// exports.getAvailableTechnicians = async (req, res) => {
//   try {
//     const { taskId } = req.params;
    
//     const task = await Task.findById(taskId);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }

//     const technicians = await User.find({
//       role: 'technician',
//       status: 'active'
//     }).select('firstName lastName email phone skills performanceRating');

//     const available = await Promise.all(technicians.map(async tech => {
//       const activeTasks = await Task.countDocuments({
//         'assignment.assignedTo': tech._id,
//         status: { $in: ['assigned', 'accepted', 'in_progress'] }
//       });
      
//       const score = calculateScore(tech, task, activeTasks);
      
//       return {
//         technician: {
//           _id: tech._id,
//           name: `${tech.firstName} ${tech.lastName}`,
//           email: tech.email,
//           phone: tech.phone,
//           skills: tech.skills,
//           performanceRating: tech.performanceRating || 3
//         },
//         currentWorkload: {
//           activeTasks,
//           available: activeTasks < 5
//         },
//         score
//       };
//     }));

//     available.sort((a, b) => b.score - a.score);

//     res.json({
//       success: true,
//       data: available
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Helper function to calculate technician score
// function calculateScore(technician, task, activeTasks) {
//   let score = 0;
  
//   // Workload (40%)
//   const workloadScore = Math.max(0, (5 - activeTasks) / 5) * 40;
//   score += workloadScore;
  
//   // Performance (30%)
//   const perfScore = (technician.performanceRating || 3) / 5 * 30;
//   score += perfScore;
  
//   // Skill match (30%)
//   let skillMatch = 1;
//   if (task.requiredSkills && task.requiredSkills.length > 0 && technician.skills) {
//     let matches = 0;
//     for (const required of task.requiredSkills) {
//       const hasSkill = technician.skills.some(s => 
//         s.name === required.skill && s.proficiency >= required.proficiencyLevel
//       );
//       if (hasSkill) matches++;
//     }
//     skillMatch = matches / task.requiredSkills.length;
//   }
//   score += skillMatch * 30;
  
//   return Math.min(100, score);
// }



/**
 * TASK ASSIGNMENT CONTROLLER
 * Handles auto/manual assignment, skill matching, workload balancing
 */

const Task = require('../models/Task.model');
const User = require('../models/User.model');
const TaskAssignment = require('../models/task-assignment.model');
const Notification = require('../models/Notification.model');
const { getIO } = require('../config/socketio');

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate technician score based on workload, performance, and skill match
 */
function calculateScore(technician, task, activeTasks) {
  let score = 0;
  
  // Workload (40%) - Less active tasks = higher score
  const workloadScore = Math.max(0, (5 - activeTasks) / 5) * 40;
  score += workloadScore;
  
  // Performance (30%) - Higher rating = higher score
  const perfScore = (technician.performanceRating || 3) / 5 * 30;
  score += perfScore;
  
  // Skill match (30%) - Better skill match = higher score
  let skillMatch = 1;
  if (task.requiredSkills && task.requiredSkills.length > 0 && technician.skills) {
    let matches = 0;
    for (const required of task.requiredSkills) {
      const hasSkill = technician.skills.some(s => 
        s.name === required.skill && s.proficiency >= required.proficiencyLevel
      );
      if (hasSkill) matches++;
    }
    skillMatch = matches / task.requiredSkills.length;
  }
  score += skillMatch * 30;
  
  return Math.min(100, score);
}

/**
 * Send notification to technician about new assignment
 */
async function sendAssignmentNotification(technicianId, task, assignmentMethod) {
  try {
    const io = getIO();
    if (io) {
      io.to(`user_${technicianId}`).emit('task_assigned', {
        taskId: task._id,
        taskNumber: task.taskId,
        title: task.title,
        priority: task.priority,
        assignmentMethod
      });
    }
    
    await Notification.create({
      userId: technicianId,
      title: 'New Task Assigned',
      body: `Task "${task.title}" has been assigned to you. Priority: ${task.priority}`,
      type: 'task',
      priority: task.priority === 'critical' ? 'high' : 'medium',
      referenceId: task._id,
      referenceModel: 'Task'
    });
  } catch (error) {
    console.error('Error sending assignment notification:', error);
  }
}

// ==================== AUTO-ASSIGN TASK ====================

/**
 * Auto-assign task based on skill matching and workload
 */
const autoAssignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Find available technicians
    const technicians = await User.find({
      role: 'technician',
      isActive: true
    });

    if (technicians.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'No technicians available' 
      });
    }

    // Score each technician
    const scored = await Promise.all(technicians.map(async tech => {
      const activeTasks = await Task.countDocuments({
        'assignment.assignedTo': tech._id,
        status: { $in: ['assigned', 'accepted', 'in_progress'] }
      });
      
      const score = calculateScore(tech, task, activeTasks);
      return { technician: tech, score, activeTasks };
    }));

    scored.sort((a, b) => b.score - a.score);
    
    if (scored.length === 0 || scored[0].score < 20) {
      return res.status(404).json({ 
        success: false, 
        error: 'No suitable technician found' 
      });
    }

    const bestTech = scored[0].technician;
    
    // Assign task
    task.assignment = {
      assignedTo: bestTech._id,
      assignedToName: bestTech.name || `${bestTech.firstName} ${bestTech.lastName}`,
      assignedBy: req.user._id,
      assignedAt: new Date(),
      reassignmentCount: 0
    };
    task.status = 'assigned';
    await task.save();

    // Record assignment
    const assignment = new TaskAssignment({
      taskId: task._id,
      currentAssignee: bestTech._id,
      currentAssigneeName: bestTech.name || `${bestTech.firstName} ${bestTech.lastName}`,
      assignmentMethod: 'auto',
      priorityScore: scored[0].score,
      assignments: [{
        technicianId: bestTech._id,
        technicianName: bestTech.name || `${bestTech.firstName} ${bestTech.lastName}`,
        assignedBy: req.user._id,
        type: 'auto',
        status: 'assigned'
      }]
    });
    await assignment.save();

    // Send notification
    await sendAssignmentNotification(bestTech._id, task, 'auto');

    res.json({
      success: true,
      data: { task, assignment, matchScore: scored[0].score },
      message: `Task auto-assigned to ${bestTech.name || bestTech.firstName}`
    });
  } catch (error) {
    console.error('Auto assign task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== MANUAL ASSIGN TASK ====================

/**
 * Manual assign task to selected technician
 */
const manualAssignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { technicianId, notes } = req.body;

    const task = await Task.findById(taskId);
    const technician = await User.findById(technicianId);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    if (!technician) {
      return res.status(404).json({ success: false, error: 'Technician not found' });
    }

    // Update task assignment
    task.assignment = {
      assignedTo: technician._id,
      assignedToName: technician.name || `${technician.firstName} ${technician.lastName}`,
      assignedBy: req.user._id,
      assignedAt: new Date(),
      reassignmentCount: task.assignment?.reassignmentCount || 0
    };
    task.status = 'assigned';
    await task.save();

    // Record assignment
    const assignment = new TaskAssignment({
      taskId: task._id,
      currentAssignee: technician._id,
      currentAssigneeName: technician.name || `${technician.firstName} ${technician.lastName}`,
      assignmentMethod: 'manual',
      assignments: [{
        technicianId: technician._id,
        technicianName: technician.name || `${technician.firstName} ${technician.lastName}`,
        assignedBy: req.user._id,
        type: 'manual',
        status: 'assigned',
        reason: notes
      }]
    });
    await assignment.save();

    // Send notification
    await sendAssignmentNotification(technician._id, task, 'manual');

    res.json({
      success: true,
      data: { task, assignment },
      message: `Task assigned to ${technician.name || technician.firstName}`
    });
  } catch (error) {
    console.error('Manual assign task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== REASSIGN TASK ====================

/**
 * Reassign task to different technician
 */
const reassignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { technicianId, reason } = req.body;

    const task = await Task.findById(taskId);
    const newTechnician = await User.findById(technicianId);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    if (!newTechnician) {
      return res.status(404).json({ success: false, error: 'New technician not found' });
    }

    const oldTechnicianId = task.assignment?.assignedTo;
    const oldTechnicianName = task.assignment?.assignedToName;
    
    // Update task assignment
    task.assignment = {
      assignedTo: newTechnician._id,
      assignedToName: newTechnician.name || `${newTechnician.firstName} ${newTechnician.lastName}`,
      assignedBy: req.user._id,
      assignedAt: new Date(),
      reassignmentCount: (task.assignment?.reassignmentCount || 0) + 1,
      reassignmentReason: reason
    };
    task.status = 'assigned';
    await task.save();

    // Update assignment history
    let assignment = await TaskAssignment.findOne({ taskId: task._id });
    if (!assignment) {
      assignment = new TaskAssignment({ taskId: task._id, assignments: [] });
    }
    
    assignment.assignments.push({
      technicianId: newTechnician._id,
      technicianName: newTechnician.name || `${newTechnician.firstName} ${newTechnician.lastName}`,
      assignedBy: req.user._id,
      type: 'reassignment',
      status: 'assigned',
      reason: reason
    });
    assignment.currentAssignee = newTechnician._id;
    assignment.currentAssigneeName = newTechnician.name || `${newTechnician.firstName} ${newTechnician.lastName}`;
    assignment.assignmentMethod = 'reassignment';
    await assignment.save();

    // Send notification to new technician
    await sendAssignmentNotification(newTechnician._id, task, 'reassignment');

    res.json({
      success: true,
      data: task,
      message: `Task reassigned from ${oldTechnicianName || 'previous'} to ${newTechnician.name || newTechnician.firstName}`
    });
  } catch (error) {
    console.error('Reassign task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET ASSIGNMENT HISTORY ====================

/**
 * Get assignment history for a task
 */
const getAssignmentHistory = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const assignment = await TaskAssignment.findOne({ taskId })
      .populate('assignments.technicianId', 'firstName lastName email')
      .populate('assignments.assignedBy', 'firstName lastName email');

    if (!assignment) {
      return res.json({
        success: true,
        data: { assignments: [], currentAssignee: null }
      });
    }

    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Get assignment history error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TECHNICIAN WORKLOAD ====================

/**
 * Get technician workload
 */
const getTechnicianWorkload = async (req, res) => {
  try {
    const { technicianId } = req.params;
    
    const technician = await User.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ success: false, error: 'Technician not found' });
    }
    
    const activeTasks = await Task.countDocuments({
      'assignment.assignedTo': technicianId,
      status: { $in: ['assigned', 'accepted', 'in_progress'] }
    });
    
    const pendingTasks = await Task.countDocuments({
      'assignment.assignedTo': technicianId,
      status: 'assigned'
    });
    
    const completedToday = await Task.countDocuments({
      'assignment.assignedTo': technicianId,
      status: 'completed',
      'timeline.completedAt': { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    
    const overdueTasks = await Task.countDocuments({
      'assignment.assignedTo': technicianId,
      slaBreached: true,
      status: { $nin: ['closed', 'cancelled'] }
    });

    res.json({
      success: true,
      data: {
        technicianId,
        technicianName: technician.name || `${technician.firstName} ${technician.lastName}`,
        activeTasks,
        pendingTasks,
        completedToday,
        overdueTasks,
        capacityPercentage: Math.min(100, (activeTasks / 5) * 100),
        isOverloaded: activeTasks > 5
      }
    });
  } catch (error) {
    console.error('Get technician workload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET AVAILABLE TECHNICIANS ====================

/**
 * Get available technicians for a task
 */
const getAvailableTechnicians = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const technicians = await User.find({
      role: 'technician',
      isActive: true
    }).select('firstName lastName email phone skills performanceRating technicianType');

    const available = await Promise.all(technicians.map(async tech => {
      const activeTasks = await Task.countDocuments({
        'assignment.assignedTo': tech._id,
        status: { $in: ['assigned', 'accepted', 'in_progress'] }
      });
      
      const score = calculateScore(tech, task, activeTasks);
      
      return {
        technician: {
          _id: tech._id,
          name: tech.name || `${tech.firstName} ${tech.lastName}`,
          email: tech.email,
          phone: tech.phone,
          technicianType: tech.technicianType,
          skills: tech.skills || [],
          performanceRating: tech.performanceRating || 3
        },
        currentWorkload: {
          activeTasks,
          available: activeTasks < 5,
          capacityPercentage: Math.min(100, (activeTasks / 5) * 100)
        },
        matchScore: Math.round(score)
      };
    }));

    available.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      data: available,
      total: available.length
    });
  } catch (error) {
    console.error('Get available technicians error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== EXPORTS ====================

module.exports = {
  autoAssignTask,
  manualAssignTask,
  reassignTask,
  getAssignmentHistory,
  getTechnicianWorkload,
  getAvailableTechnicians
};