/**
 * TASK CONTROLLER
 * Handles all task CRUD operations and task listing endpoints
 */

const Task = require('../models/task.model');
const TaskProgress = require('../models/task-progress.model');
const User = require('../models/user.model');
const taskAssignmentService = require('../services/task-assignment.service');

// ==================== CREATE TASK ====================
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

// ==================== GET ALL TASKS ====================
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

// ==================== GET MY TASKS ====================
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

// ==================== GET TASK BY ID ====================
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

// ==================== UPDATE TASK ====================
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

// ==================== DELETE TASK ====================
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

// ==================== ASSIGN TASK ====================
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

// ==================== AUTO-ASSIGN TASK ====================
exports.autoAssignTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const technicians = await User.find({ role: 'technician', status: 'active' });
    
    if (technicians.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No technicians available'
      });
    }
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    const workloads = await Promise.all(technicians.map(async (tech) => {
      const activeTasks = await Task.countDocuments({
        'assignment.assignedTo': tech._id,
        status: { $in: ['assigned', 'accepted', 'in_progress'] }
      });
      return { technician: tech, activeTasks };
    }));
    
    workloads.sort((a, b) => a.activeTasks - b.activeTasks);
    const bestTechnician = workloads[0].technician;
    
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

// ==================== REASSIGN TASK ====================
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

// ==================== GET OVERDUE TASKS ====================
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

// ==================== GET TASK STATISTICS ====================
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
              1000 * 60
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

// ==================== ACCEPT TASK ====================
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

// ==================== START TASK ====================
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

// ==================== UPDATE PROGRESS ====================
exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { percentage } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    if (task.assignment.assignedTo?.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: 'Task not assigned to you' });
    }
    
    task.progress.percentage = Math.min(100, Math.max(0, percentage));
    task.progress.lastUpdatedAt = new Date();
    task.progress.updatedBy = req.userId;
    await task.save();
    
    res.json({
      success: true,
      data: task,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== UPDATE CHECKLIST ====================
exports.updateChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemId, completed, imageAfter, notes } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    const checklistItem = task.checklist.id(itemId);
    if (!checklistItem) {
      return res.status(404).json({ success: false, error: 'Checklist item not found' });
    }
    
    checklistItem.completed = completed;
    checklistItem.completedBy = req.userId;
    checklistItem.completedAt = new Date();
    if (imageAfter) checklistItem.imageAfter = imageAfter;
    if (notes) checklistItem.notes = notes;
    
    const completedItems = task.checklist.filter(item => item.completed).length;
    task.progress.percentage = Math.round((completedItems / task.checklist.length) * 100);
    task.progress.lastUpdatedAt = new Date();
    
    await task.save();
    
    res.json({
      success: true,
      data: task,
      message: 'Checklist updated successfully'
    });
  } catch (error) {
    console.error('Update checklist error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== UPLOAD EVIDENCE ====================
exports.uploadEvidence = async (req, res) => {
  try {
    const { id } = req.params;
    const { images, videos } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    if (images && images.length) {
      task.evidence.afterImages.push(...images.map(img => ({
        url: img,
        uploadedBy: req.userId,
        uploadedAt: new Date(),
        description: 'Work completion evidence'
      })));
    }
    
    if (videos && videos.length) {
      task.evidence.videos.push(...videos.map(vid => ({
        url: vid,
        uploadedBy: req.userId,
        uploadedAt: new Date()
      })));
    }
    
    await task.save();
    
    res.json({
      success: true,
      data: task,
      message: 'Evidence uploaded successfully'
    });
  } catch (error) {
    console.error('Upload evidence error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== COMPLETE TASK ====================
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

// ==================== VERIFY TASK ====================
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

// ==================== REJECT TASK ====================
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

// ==================== GET AVAILABLE TECHNICIANS ====================
exports.getAvailableTechnicians = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    const technicians = await User.find({ role: 'technician', status: 'active' })
      .select('firstName lastName email phone');
    
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

// ==================== GET ASSIGNMENT HISTORY ====================
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

// ==================== GET TECHNICIAN WORKLOAD ====================
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

// ==================== GET DAILY PROGRESS ====================
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
          totalTimeSpent: totalTimeSpent
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

// ==================== GET TASK PROGRESS ====================
exports.getTaskProgress = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    const progress = await TaskProgress.findOne({ taskId: task._id });
    
    res.json({
      success: true,
      data: {
        task: {
          status: task.status,
          progressPercentage: task.progress.percentage,
          checklist: task.checklist
        },
        progress: progress || null
      }
    });
  } catch (error) {
    console.error('Get task progress error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TASKS BY STATUS ====================
exports.getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    const query = { status, isDeleted: false };
    
    if (req.userRole === 'technician') {
      query['assignment.assignedTo'] = req.userId;
    }
    
    const tasks = await Task.find(query)
      .populate('assignment.assignedTo', 'firstName lastName')
      .populate('location.buildingId', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks by status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TASKS BY PRIORITY ====================
exports.getTasksByPriority = async (req, res) => {
  try {
    const { priority } = req.params;
    
    const query = { priority, isDeleted: false };
    
    if (req.userRole === 'technician') {
      query['assignment.assignedTo'] = req.userId;
    }
    
    const tasks = await Task.find(query)
      .populate('assignment.assignedTo', 'firstName lastName')
      .populate('location.buildingId', 'name')
      .sort({ slaDeadline: 1 });
    
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks by priority error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TASKS BY BUILDING ====================
exports.getTasksByBuilding = async (req, res) => {
  try {
    const { buildingId } = req.params;
    
    const tasks = await Task.find({ 
      'location.buildingId': buildingId,
      isDeleted: false 
    })
      .populate('assignment.assignedTo', 'firstName lastName')
      .sort({ priority: -1, createdAt: -1 });
    
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks by building error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TASKS BY TECHNICIAN ====================
exports.getTasksByTechnician = async (req, res) => {
  try {
    const { technicianId } = req.params;
    
    const tasks = await Task.find({ 
      'assignment.assignedTo': technicianId,
      isDeleted: false 
    })
      .populate('location.buildingId', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks by technician error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== EXPORT TASKS TO CSV ====================
exports.exportTasksToCSV = async (req, res) => {
  try {
    const tasks = await Task.find({ isDeleted: false })
      .populate('assignment.assignedTo', 'firstName lastName')
      .populate('location.buildingId', 'name');
    
    const csvData = tasks.map(task => ({
      'Task ID': task.taskId,
      'Title': task.title,
      'Status': task.status,
      'Priority': task.priority,
      'Assigned To': task.assignment?.assignedToName || 'Unassigned',
      'Building': task.location?.buildingName || 'N/A',
      'Created At': task.createdAt.toISOString(),
      'SLA Deadline': task.slaDeadline?.toISOString() || 'N/A',
      'Completed At': task.timeline?.completedAt?.toISOString() || 'N/A'
    }));
    
    res.json({
      success: true,
      data: csvData
    });
  } catch (error) {
    console.error('Export tasks error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = exports;