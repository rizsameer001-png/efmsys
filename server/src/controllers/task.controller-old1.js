/**
 * TASK CONTROLLER
 * Handles all task CRUD operations and task listing endpoints
 */

const Task = require('../models/task.model');
const TaskProgress = require('../models/task-progress.model');
const User = require('../models/user.model');
const taskAssignmentService = require('../services/task-assignment.service');

/**
 * CREATE TASK
 * Creates a new task from complaint, work order, or manually
 */
exports.createTask = async (req, res) => {
  try {
    const taskData = req.body;
    taskData.createdBy = req.userId;
    
    // Generate unique task ID
    const taskCount = await Task.countDocuments();
    taskData.taskId = `TSK${new Date().getFullYear()}${String(taskCount + 1).padStart(5, '0')}`;
    
    // Calculate SLA deadline based on priority
    const slaMinutes = {
      critical: 60,
      high: 240,
      medium: 480,
      low: 1440
    };
    
    const deadlineMinutes = slaMinutes[taskData.priority] || 480;
    taskData.slaDeadline = new Date(Date.now() + deadlineMinutes * 60 * 1000);
    
    const task = new Task(taskData);
    await task.save();
    
    // Auto-assign if requested
    if (taskData.autoAssign) {
      await taskAssignmentService.autoAssignTask(task._id);
    }
    
    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * GET ALL TASKS
 * Returns tasks with filters based on user role
 */
exports.getTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      assignedTo,
      buildingId,
      startDate,
      endDate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = { isDeleted: { $ne: true } };
    
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
    
    // Apply filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query['assignment.assignedTo'] = assignedTo;
    if (buildingId) query['location.buildingId'] = buildingId;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { taskId: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('assignment.assignedTo', 'firstName lastName email')
        .populate('location.buildingId', 'name code')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Task.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET MY TASKS
 * Returns tasks assigned to the logged-in technician
 */
exports.getMyTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;
    
    const query = {
      'assignment.assignedTo': req.userId,
      status: { $nin: ['closed', 'cancelled'] },
      isDeleted: { $ne: true }
    };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    const tasks = await Task.find(query)
      .populate('location.buildingId', 'name code address')
      .sort({ priority: -1, slaDeadline: 1 });
    
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET TASK BY ID
 * Returns detailed task information
 */
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignment.assignedTo', 'firstName lastName email phone')
      .populate('assignment.assignedBy', 'firstName lastName email')
      .populate('assignment.supervisorId', 'firstName lastName email')
      .populate('location.buildingId', 'name code address')
      .populate('location.unitId', 'unitNumber floorNumber')
      .populate('verification.verifiedBy', 'firstName lastName')
      .populate('createdBy', 'firstName lastName');
    
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    // Get progress data
    const progress = await TaskProgress.findOne({ taskId: task._id });
    
    res.json({
      success: true,
      data: { task, progress }
    });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * UPDATE TASK
 * Updates task information
 */
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedBy = req.userId;
    updates.updatedAt = new Date();
    
    // Don't allow updating certain fields
    delete updates._id;
    delete updates.taskId;
    delete updates.createdBy;
    delete updates.createdAt;
    
    const task = await Task.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * DELETE TASK
 * Soft deletes a task
 */
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: req.userId },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * ASSIGN TASK
 * Assigns a task to a technician (manual)
 */
exports.assignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { technicianId } = req.body;
    
    const technician = await User.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ success: false, error: 'Technician not found' });
    }
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    task.assignment.assignedTo = technicianId;
    task.assignment.assignedToName = `${technician.firstName} ${technician.lastName}`;
    task.assignment.assignedBy = req.userId;
    task.assignment.assignedAt = new Date();
    task.status = 'assigned';
    await task.save();
    
    res.json({
      success: true,
      data: task,
      message: `Task assigned to ${technician.firstName} ${technician.lastName}`
    });
  } catch (error) {
    console.error('Assign task error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * AUTO-ASSIGN TASK
 * Automatically assigns task to best matching technician
 */
exports.autoAssignTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find available technicians with least workload
    const technicians = await User.find({ 
      role: 'technician', 
      status: 'active' 
    });
    
    if (technicians.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No technicians available'
      });
    }
    
    // Get task details
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    // Calculate workload for each technician
    const workloads = await Promise.all(technicians.map(async (tech) => {
      const activeTasks = await Task.countDocuments({
        'assignment.assignedTo': tech._id,
        status: { $in: ['assigned', 'accepted', 'in_progress'] }
      });
      return { technician: tech, activeTasks };
    }));
    
    // Sort by workload (least busy first)
    workloads.sort((a, b) => a.activeTasks - b.activeTasks);
    const bestTechnician = workloads[0].technician;
    
    // Assign task
    task.assignment.assignedTo = bestTechnician._id;
    task.assignment.assignedToName = `${bestTechnician.firstName} ${bestTechnician.lastName}`;
    task.assignment.assignedBy = req.userId;
    task.assignment.assignedAt = new Date();
    task.status = 'assigned';
    await task.save();
    
    res.json({
      success: true,
      data: task,
      message: `Task auto-assigned to ${bestTechnician.firstName} ${bestTechnician.lastName}`
    });
  } catch (error) {
    console.error('Auto assign task error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * REASSIGN TASK
 * Reassigns task to a different technician
 */
exports.reassignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { technicianId, reason } = req.body;
    
    const technician = await User.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ success: false, error: 'Technician not found' });
    }
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    const oldTechnician = task.assignment.assignedToName;
    
    task.assignment.assignedTo = technicianId;
    task.assignment.assignedToName = `${technician.firstName} ${technician.lastName}`;
    task.assignment.reassignmentCount += 1;
    task.assignment.reassignmentReason = reason;
    task.status = 'assigned';
    await task.save();
    
    res.json({
      success: true,
      data: task,
      message: `Task reassigned from ${oldTechnician} to ${technician.firstName} ${technician.lastName}`
    });
  } catch (error) {
    console.error('Reassign task error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * GET OVERDUE TASKS
 * Returns tasks that have breached SLA
 */
exports.getOverdueTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      slaDeadline: { $lt: new Date() },
      status: { $nin: ['closed', 'cancelled', 'completed'] },
      isDeleted: { $ne: true }
    })
      .populate('assignment.assignedTo', 'firstName lastName email')
      .populate('location.buildingId', 'name');
    
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get overdue tasks error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET TASK STATISTICS
 * Returns dashboard statistics for tasks
 */
exports.getTaskStatistics = async (req, res) => {
  try {
    const query = { isDeleted: { $ne: true } };
    
    const total = await Task.countDocuments(query);
    const pending = await Task.countDocuments({ ...query, status: 'pending' });
    const inProgress = await Task.countDocuments({ 
      ...query, 
      status: { $in: ['assigned', 'accepted', 'in_progress'] } 
    });
    const completed = await Task.countDocuments({ 
      ...query, 
      status: { $in: ['completed', 'verified', 'closed'] } 
    });
    const overdue = await Task.countDocuments({ 
      ...query, 
      slaBreached: true, 
      status: { $nin: ['closed', 'cancelled'] } 
    });
    
    const byPriority = {
      critical: await Task.countDocuments({ ...query, priority: 'critical' }),
      high: await Task.countDocuments({ ...query, priority: 'high' }),
      medium: await Task.countDocuments({ ...query, priority: 'medium' }),
      low: await Task.countDocuments({ ...query, priority: 'low' })
    };
    
    // Calculate average completion time
    const avgResult = await Task.aggregate([
      {
        $match: {
          'timeline.completedAt': { $exists: true },
          'timeline.startedAt': { $exists: true },
          isDeleted: { $ne: true }
        }
      },
      {
        $project: {
          duration: {
            $divide: [
              { $subtract: ['$timeline.completedAt', '$timeline.startedAt'] },
              1000 * 60 // Convert to minutes
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: '$duration' }
        }
      }
    ]);
    
    const avgCompletionTime = Math.round(avgResult[0]?.avgDuration || 0);
    
    // Format SLA by priority
    const slaByPriority = [
      { 
        _id: 'critical', 
        total: byPriority.critical, 
        breached: await Task.countDocuments({ ...query, priority: 'critical', slaBreached: true }),
        complianceRate: byPriority.critical > 0 ? 
          Math.round(((byPriority.critical - await Task.countDocuments({ ...query, priority: 'critical', slaBreached: true })) / byPriority.critical) * 100) : 100
      },
      { 
        _id: 'high', 
        total: byPriority.high, 
        breached: await Task.countDocuments({ ...query, priority: 'high', slaBreached: true }),
        complianceRate: byPriority.high > 0 ? 
          Math.round(((byPriority.high - await Task.countDocuments({ ...query, priority: 'high', slaBreached: true })) / byPriority.high) * 100) : 100
      },
      { 
        _id: 'medium', 
        total: byPriority.medium, 
        breached: await Task.countDocuments({ ...query, priority: 'medium', slaBreached: true }),
        complianceRate: byPriority.medium > 0 ? 
          Math.round(((byPriority.medium - await Task.countDocuments({ ...query, priority: 'medium', slaBreached: true })) / byPriority.medium) * 100) : 100
      },
      { 
        _id: 'low', 
        total: byPriority.low, 
        breached: await Task.countDocuments({ ...query, priority: 'low', slaBreached: true }),
        complianceRate: byPriority.low > 0 ? 
          Math.round(((byPriority.low - await Task.countDocuments({ ...query, priority: 'low', slaBreached: true })) / byPriority.low) * 100) : 100
      }
    ];

    res.json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        completed,
        overdue,
        byPriority,
        avgCompletionTime,
        slaByPriority
      }
    });
  } catch (error) {
    console.error('Get task statistics error:', error);
    // Return default statistics instead of error
    res.json({
      success: true,
      data: {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0,
        byPriority: { critical: 0, high: 0, medium: 0, low: 0 },
        avgCompletionTime: 0,
        slaByPriority: []
      }
    });
  }
};

/**
 * Accept Task
 * Technician accepts the assigned task
 */
exports.acceptTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    if (task.assignment.assignedTo?.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: 'Task not assigned to you' });
    }
    
    if (task.status !== 'assigned') {
      return res.status(400).json({ success: false, error: 'Task cannot be accepted' });
    }
    
    task.status = 'accepted';
    task.timeline.acceptedAt = new Date();
    await task.save();
    
    res.json({
      success: true,
      data: task,
      message: 'Task accepted successfully'
    });
  } catch (error) {
    console.error('Accept task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Start Task
 * Technician starts working on the task
 */
exports.startTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    if (task.assignment.assignedTo?.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: 'Task not assigned to you' });
    }
    
    if (task.status !== 'accepted') {
      return res.status(400).json({ success: false, error: 'Task cannot be started' });
    }
    
    task.status = 'in_progress';
    task.timeline.startedAt = new Date();
    task.progress.percentage = 10;
    await task.save();
    
    res.json({
      success: true,
      data: task,
      message: 'Task started successfully'
    });
  } catch (error) {
    console.error('Start task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Complete Task
 * Technician marks task as completed
 */
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { completionNotes, afterImages } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    if (task.assignment.assignedTo?.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: 'Task not assigned to you' });
    }
    
    if (task.status !== 'in_progress') {
      return res.status(400).json({ success: false, error: 'Task cannot be completed' });
    }
    
    task.status = 'completed';
    task.timeline.completedAt = new Date();
    task.progress.percentage = 100;
    
    if (completionNotes) {
      task.technicianNotes = task.technicianNotes || [];
      task.technicianNotes.push({
        note: completionNotes,
        createdBy: req.userId,
        createdAt: new Date()
      });
    }
    
    if (afterImages) {
      task.evidence.afterImages = task.evidence.afterImages || [];
      task.evidence.afterImages.push(...afterImages);
    }
    
    await task.save();
    
    res.json({
      success: true,
      data: task,
      message: 'Task completed successfully. Pending verification.'
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Verify Task
 * Supervisor/Manager verifies and closes the task
 */
exports.verifyTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, notes, approved } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    if (approved) {
      task.status = 'verified';
      task.verification = {
        verifiedBy: req.userId,
        verifiedAt: new Date(),
        notes,
        rating,
        reworkCount: task.verification?.reworkCount || 0
      };
      task.timeline.verifiedAt = new Date();
      task.status = 'closed';
      task.timeline.closedAt = new Date();
    } else {
      task.status = 'assigned';
      task.rejection = {
        reason: notes,
        rejectedBy: req.userId,
        rejectedAt: new Date(),
        reworkInstructions: notes
      };
      task.verification = {
        ...task.verification,
        reworkCount: (task.verification?.reworkCount || 0) + 1
      };
    }
    
    await task.save();
    
    res.json({
      success: true,
      data: task,
      message: approved ? 'Task verified and closed' : 'Task rejected for rework'
    });
  } catch (error) {
    console.error('Verify task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * REJECT TASK
 * Supervisor/Manager rejects task for rework
 */
exports.rejectTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    if (!['supervisor', 'manager', 'admin', 'super_admin'].includes(req.userRole)) {
      return res.status(403).json({ success: false, error: 'Not authorized to reject tasks' });
    }
    
    task.status = 'assigned';
    task.rejection = {
      reason: reason,
      rejectedBy: req.userId,
      rejectedAt: new Date(),
      reworkInstructions: reason
    };
    task.verification = {
      ...task.verification,
      reworkCount: (task.verification?.reworkCount || 0) + 1
    };
    await task.save();
    
    res.json({
      success: true,
      data: task,
      message: 'Task rejected for rework'
    });
  } catch (error) {
    console.error('Reject task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET AVAILABLE TECHNICIANS
 * Returns list of available technicians for task assignment
 */
exports.getAvailableTechnicians = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    // Find all active technicians
    const technicians = await User.find({ 
      role: 'technician', 
      status: 'active' 
    }).select('firstName lastName email phone');
    
    // Calculate workload for each technician
    const availableTechnicians = await Promise.all(technicians.map(async (tech) => {
      const activeTasks = await Task.countDocuments({
        'assignment.assignedTo': tech._id,
        status: { $in: ['assigned', 'accepted', 'in_progress'] },
        isDeleted: false
      });
      
      const pendingTasks = await Task.countDocuments({
        'assignment.assignedTo': tech._id,
        status: 'assigned',
        isDeleted: false
      });
      
      return {
        technician: {
          _id: tech._id,
          name: `${tech.firstName} ${tech.lastName}`,
          email: tech.email,
          phone: tech.phone
        },
        currentWorkload: {
          activeTasks,
          pendingTasks,
          available: activeTasks < 5
        }
      };
    }));
    
    // Sort by workload (least busy first)
    availableTechnicians.sort((a, b) => a.currentWorkload.activeTasks - b.currentWorkload.activeTasks);
    
    res.json({
      success: true,
      data: availableTechnicians
    });
  } catch (error) {
    console.error('Get available technicians error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET ASSIGNMENT HISTORY
 * Returns assignment history for a task
 */
exports.getAssignmentHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id)
      .populate('assignment.assignedTo', 'firstName lastName')
      .populate('assignment.assignedBy', 'firstName lastName');
    
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    res.json({
      success: true,
      data: {
        currentAssignment: task.assignment,
        reassignmentCount: task.assignment?.reassignmentCount || 0,
        reassignmentReason: task.assignment?.reassignmentReason
      }
    });
  } catch (error) {
    console.error('Get assignment history error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET TECHNICIAN WORKLOAD
 * Returns workload summary for a specific technician
 */
exports.getTechnicianWorkload = async (req, res) => {
  try {
    const { technicianId } = req.params;
    
    const technician = await User.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ success: false, error: 'Technician not found' });
    }
    
    const activeTasks = await Task.countDocuments({
      'assignment.assignedTo': technicianId,
      status: { $in: ['assigned', 'accepted', 'in_progress'] },
      isDeleted: false
    });
    
    const pendingTasks = await Task.countDocuments({
      'assignment.assignedTo': technicianId,
      status: 'assigned',
      isDeleted: false
    });
    
    const completedToday = await Task.countDocuments({
      'assignment.assignedTo': technicianId,
      status: 'completed',
      'timeline.completedAt': { $gte: new Date().setHours(0, 0, 0, 0) },
      isDeleted: false
    });
    
    const overdueTasks = await Task.countDocuments({
      'assignment.assignedTo': technicianId,
      slaBreached: true,
      status: { $nin: ['closed', 'cancelled'] },
      isDeleted: false
    });
    
    res.json({
      success: true,
      data: {
        technician: {
          id: technician._id,
          name: `${technician.firstName} ${technician.lastName}`
        },
        workload: {
          activeTasks,
          pendingTasks,
          completedToday,
          overdueTasks,
          capacityPercentage: Math.min(100, (activeTasks / 5) * 100)
        }
      }
    });
  } catch (error) {
    console.error('Get technician workload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET DAILY PROGRESS
 * Returns daily progress summary for a technician
 */
exports.getDailyProgress = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { date } = req.query;
    
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    
    const tasks = await Task.find({
      'assignment.assignedTo': technicianId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      isDeleted: false
    });
    
    const completedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'verified');
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
    const pendingTasks = tasks.filter(t => t.status === 'assigned');
    
    // Calculate total time spent
    const totalTimeSpent = tasks.reduce((sum, task) => {
      return sum + (task.timeTracking?.timeSpent || 0);
    }, 0);
    
    res.json({
      success: true,
      data: {
        date: startOfDay,
        summary: {
          totalTasks: tasks.length,
          completedTasks: completedTasks.length,
          inProgressTasks: inProgressTasks.length,
          pendingTasks: pendingTasks.length,
          totalTimeSpent: totalTimeSpent // minutes
        },
        tasks: tasks.map(t => ({
          id: t._id,
          taskId: t.taskId,
          title: t.title,
          status: t.status,
          priority: t.priority,
          timeSpent: t.timeTracking?.timeSpent || 0
        }))
      }
    });
  } catch (error) {
    console.error('Get daily progress error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = exports;