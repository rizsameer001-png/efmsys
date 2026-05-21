/**
 * TASK PROGRESS CONTROLLER
 * Handles task progress tracking, start, pause, resume, complete operations
 */

const Task = require('../models/Task.model');
const TaskProgress = require('../models/task-progress.model');
const Notification = require('../models/Notification.model');
const ActivityLog = require('../models/ActivityLog.model');
const { getIO } = require('../config/socketio');

// ==================== HELPER FUNCTIONS ====================

/**
 * Send notification to user
 */
async function sendNotification(userId, title, body, taskId) {
  try {
    const io = getIO();
    if (io) {
      io.to(`user_${userId}`).emit('task_notification', { taskId, title, body });
    }
    
    await Notification.create({
      userId,
      title,
      body,
      type: 'task',
      referenceId: taskId,
      referenceModel: 'Task'
    });
  } catch (error) {
    console.error('Notification error:', error);
  }
}

/**
 * Log activity
 */
async function logActivity(userId, userName, userRole, action, taskId, details, ip) {
  try {
    await ActivityLog.create({
      userId,
      userName,
      userRole,
      action,
      entityType: 'task',
      entityId: taskId,
      newData: details,
      ipAddress: ip
    });
  } catch (error) {
    console.error('Activity log error:', error);
  }
}

// ==================== ACCEPT TASK ====================

/**
 * Accept Task
 * Technician accepts the assigned task
 */
const acceptTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const technicianId = req.user._id || req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Verify task is assigned to this technician
    if (task.assignment?.assignedTo?.toString() !== technicianId.toString()) {
      return res.status(403).json({ success: false, error: 'Task not assigned to you' });
    }

    if (task.status !== 'assigned') {
      return res.status(400).json({ success: false, error: 'Task cannot be accepted' });
    }

    task.status = 'accepted';
    task.timeline = { ...task.timeline, acceptedAt: new Date() };
    await task.save();

    // Create or update progress record
    let progress = await TaskProgress.findOne({ taskId });
    if (!progress) {
      progress = new TaskProgress({
        taskId,
        technicianId,
        updates: []
      });
    }
    progress.updates.push({
      type: 'accept',
      description: 'Task accepted',
      timestamp: new Date(),
      createdBy: technicianId
    });
    await progress.save();

    // Notify assigner
    if (task.assignment?.assignedBy) {
      await sendNotification(
        task.assignment.assignedBy,
        'Task Accepted',
        `Task "${task.title}" has been accepted by ${req.user.name}`,
        taskId
      );
    }

    await logActivity(
      technicianId, req.user.name, req.user.role, 'ACCEPT_TASK', taskId,
      { taskId, taskNumber: task.taskId, title: task.title }, req.ip
    );

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

/**
 * Start Task
 * Technician starts working on the task with GPS verification
 */
const startTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { location } = req.body;
    const technicianId = req.user._id || req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (task.assignment?.assignedTo?.toString() !== technicianId.toString()) {
      return res.status(403).json({ success: false, error: 'Task not assigned to you' });
    }

    if (task.status !== 'accepted') {
      return res.status(400).json({ success: false, error: 'Task cannot be started' });
    }

    task.status = 'in_progress';
    task.timeline = { ...task.timeline, startedAt: new Date() };
    task.progress = { ...task.progress, percentage: 10, lastUpdatedAt: new Date(), updatedBy: technicianId };
    
    if (location) {
      task.gps = {
        ...task.gps,
        checkIn: {
          lat: location.lat,
          lng: location.lng,
          address: location.address,
          timestamp: new Date(),
          accuracy: location.accuracy
        }
      };
    }
    await task.save();

    // Update progress record
    let progress = await TaskProgress.findOne({ taskId });
    if (!progress) {
      progress = new TaskProgress({
        taskId,
        technicianId,
        updates: []
      });
    }
    progress.currentSession = {
      isActive: true,
      startedAt: new Date()
    };
    progress.updates.push({
      type: 'start',
      description: 'Task started',
      location: location ? { lat: location.lat, lng: location.lng } : null,
      timestamp: new Date(),
      createdBy: technicianId
    });
    await progress.save();

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

/**
 * Update Task Progress
 * Update checklist and progress percentage
 */
const updateProgress = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { checklistItems, progressPercentage, notes } = req.body;
    const technicianId = req.user._id || req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Update checklist
    if (checklistItems && task.checklist && task.checklist.length) {
      for (const item of checklistItems) {
        const checklistItem = task.checklist.id(item.itemId);
        if (checklistItem) {
          checklistItem.completed = item.completed;
          if (item.completed) {
            checklistItem.completedBy = technicianId;
            checklistItem.completedAt = new Date();
          }
          if (item.imageAfter) checklistItem.imageAfter = item.imageAfter;
          if (item.notes) checklistItem.notes = item.notes;
        }
      }
    }

    // Update progress percentage
    if (progressPercentage !== undefined) {
      task.progress.percentage = Math.min(100, Math.max(0, progressPercentage));
      task.progress.lastUpdatedAt = new Date();
      task.progress.updatedBy = technicianId;
    } else if (task.checklist && task.checklist.length) {
      // Auto-calculate from checklist
      const completedItems = task.checklist.filter(item => item.completed).length;
      task.progress.percentage = Math.round((completedItems / task.checklist.length) * 100);
      task.progress.lastUpdatedAt = new Date();
      task.progress.updatedBy = technicianId;
    }

    // Add technician note
    if (notes) {
      task.technicianNotes = task.technicianNotes || [];
      task.technicianNotes.push({
        note: notes,
        createdBy: technicianId,
        createdAt: new Date(),
        isPublic: true
      });
    }

    await task.save();

    // Update progress record
    const progress = await TaskProgress.findOne({ taskId });
    if (progress) {
      progress.updates.push({
        type: 'progress',
        description: `Progress updated to ${task.progress.percentage}%`,
        progressPercentage: task.progress.percentage,
        timestamp: new Date(),
        createdBy: technicianId,
        notes
      });
      await progress.save();
    }

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

/**
 * Update Checklist
 * Update specific checklist item
 */
const updateChecklist = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { itemId, completed, imageAfter, notes } = req.body;
    const technicianId = req.user._id || req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const checklistItem = task.checklist.id(itemId);
    if (!checklistItem) {
      return res.status(404).json({ success: false, error: 'Checklist item not found' });
    }

    checklistItem.completed = completed;
    if (completed) {
      checklistItem.completedBy = technicianId;
      checklistItem.completedAt = new Date();
    }
    if (imageAfter) checklistItem.imageAfter = imageAfter;
    if (notes) checklistItem.notes = notes;

    // Recalculate progress
    const completedItems = task.checklist.filter(item => item.completed).length;
    task.progress.percentage = Math.round((completedItems / task.checklist.length) * 100);
    task.progress.lastUpdatedAt = new Date();
    task.progress.updatedBy = technicianId;

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

/**
 * Upload Evidence
 * Upload images/videos as work evidence
 */
const uploadEvidence = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { images, videos, documents } = req.body;
    const technicianId = req.user._id || req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (images && images.length) {
      task.evidence = task.evidence || {};
      task.evidence.afterImages = task.evidence.afterImages || [];
      task.evidence.afterImages.push(...images.map(img => ({
        url: img.url || img,
        uploadedBy: technicianId,
        uploadedAt: new Date(),
        description: img.description || 'Work completion evidence'
      })));
    }

    if (videos && videos.length) {
      task.evidence = task.evidence || {};
      task.evidence.videos = task.evidence.videos || [];
      task.evidence.videos.push(...videos.map(vid => ({
        url: vid.url || vid,
        uploadedBy: technicianId,
        uploadedAt: new Date(),
        duration: vid.duration
      })));
    }

    if (documents && documents.length) {
      task.evidence = task.evidence || {};
      task.evidence.documents = task.evidence.documents || [];
      task.evidence.documents.push(...documents.map(doc => ({
        name: doc.name,
        url: doc.url,
        uploadedBy: technicianId,
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

// ==================== PAUSE TASK ====================

/**
 * Pause Task
 * Pause the current task (e.g., waiting for parts, break)
 */
const pauseTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { reason } = req.body;
    const technicianId = req.user._id || req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (task.status !== 'in_progress') {
      return res.status(400).json({ success: false, error: 'Task cannot be paused' });
    }

    task.status = 'waiting_parts';
    task.timeline = { ...task.timeline, pausedAt: new Date() };
    await task.save();

    const progress = await TaskProgress.findOne({ taskId });
    if (progress) {
      progress.currentSession = progress.currentSession || {};
      progress.currentSession.pausedAt = new Date();
      progress.currentSession.isActive = false;
      progress.updates.push({
        type: 'pause',
        description: reason || 'Task paused',
        timestamp: new Date(),
        createdBy: technicianId
      });
      await progress.save();
    }

    res.json({
      success: true,
      data: task,
      message: 'Task paused successfully'
    });
  } catch (error) {
    console.error('Pause task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== RESUME TASK ====================

/**
 * Resume Task
 * Resume a paused task
 */
const resumeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const technicianId = req.user._id || req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (task.status !== 'waiting_parts') {
      return res.status(400).json({ success: false, error: 'Task cannot be resumed' });
    }

    task.status = 'in_progress';
    task.timeline = { ...task.timeline, resumedAt: new Date() };
    await task.save();

    const progress = await TaskProgress.findOne({ taskId });
    if (progress && progress.currentSession?.pausedAt) {
      const pausedDuration = (new Date() - new Date(progress.currentSession.pausedAt)) / 60000;
      progress.currentSession.totalPausedMinutes = (progress.currentSession.totalPausedMinutes || 0) + Math.floor(pausedDuration);
      progress.currentSession.pausedAt = null;
      progress.currentSession.isActive = true;
      progress.updates.push({
        type: 'resume',
        description: 'Task resumed',
        timestamp: new Date(),
        createdBy: technicianId
      });
      await progress.save();
    }

    res.json({
      success: true,
      data: task,
      message: 'Task resumed successfully'
    });
  } catch (error) {
    console.error('Resume task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== COMPLETE TASK ====================

/**
 * Complete Task
 * Mark task as completed with evidence
 */
const completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completionNotes, afterImages, partsUsed } = req.body;
    const technicianId = req.user._id || req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Verify all required checklist items are completed
    if (task.checklist && task.checklist.length) {
      const incompleteRequired = task.checklist.filter(item => item.required && !item.completed);
      if (incompleteRequired.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Complete required items: ${incompleteRequired.map(i => i.itemName).join(', ')}`
        });
      }
    }

    task.status = 'completed';
    task.timeline = { ...task.timeline, completedAt: new Date() };
    task.progress = { ...task.progress, percentage: 100, lastUpdatedAt: new Date(), updatedBy: technicianId };
    
    if (completionNotes) {
      task.technicianNotes = task.technicianNotes || [];
      task.technicianNotes.push({
        note: completionNotes,
        createdBy: technicianId,
        createdAt: new Date(),
        isPublic: true
      });
    }

    if (afterImages && afterImages.length) {
      task.evidence = task.evidence || {};
      task.evidence.afterImages = task.evidence.afterImages || [];
      task.evidence.afterImages.push(...afterImages.map(img => ({
        url: img.url || img,
        uploadedBy: technicianId,
        uploadedAt: new Date(),
        description: 'Completion evidence'
      })));
    }

    if (partsUsed && partsUsed.length) {
      task.partsUsed = partsUsed;
    }

    // Calculate actual duration
    if (task.timeline.startedAt) {
      const duration = Math.floor((new Date(task.timeline.completedAt) - new Date(task.timeline.startedAt)) / 60000);
      task.timeTracking = { ...task.timeTracking, actualDuration: duration };
    }

    await task.save();

    // Update progress record
    const progress = await TaskProgress.findOne({ taskId });
    if (progress) {
      if (progress.currentSession) {
        progress.currentSession.isActive = false;
        progress.currentSession.endedAt = new Date();
      }
      progress.updates.push({
        type: 'complete',
        description: completionNotes || 'Task completed',
        progressPercentage: 100,
        timestamp: new Date(),
        createdBy: technicianId
      });
      await progress.save();
    }

    // Notify supervisor
    if (task.assignment?.supervisorId) {
      await sendNotification(
        task.assignment.supervisorId,
        'Task Completed',
        `Task "${task.title}" has been completed and is ready for verification`,
        taskId
      );
    }

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

/**
 * Verify Task
 * Supervisor/Manager verifies and closes the task
 */
const verifyTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { rating, notes, approved } = req.body;
    const verifierId = req.user._id || req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (approved) {
      task.status = 'verified';
      task.verification = {
        verifiedBy: verifierId,
        verifiedAt: new Date(),
        notes,
        rating,
        reworkCount: task.verification?.reworkCount || 0
      };
      task.timeline = { ...task.timeline, verifiedAt: new Date() };
      task.status = 'closed';
      task.timeline = { ...task.timeline, closedAt: new Date() };
      
      // Notify technician
      if (task.assignment?.assignedTo) {
        await sendNotification(
          task.assignment.assignedTo,
          'Task Verified',
          `Your task "${task.title}" has been verified and closed. Rating: ${rating || 'N/A'}/5`,
          taskId
        );
      }
    } else {
      task.status = 'assigned';
      task.rejection = {
        reason: notes,
        rejectedBy: verifierId,
        rejectedAt: new Date(),
        reworkInstructions: notes
      };
      task.verification = {
        ...task.verification,
        reworkCount: (task.verification?.reworkCount || 0) + 1
      };
      
      // Notify technician
      if (task.assignment?.assignedTo) {
        await sendNotification(
          task.assignment.assignedTo,
          'Task Rejected',
          `Task "${task.title}" needs rework. Reason: ${notes}`,
          taskId
        );
      }
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

/**
 * Reject Task
 * Supervisor/Manager rejects the task for rework
 */
const rejectTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { reason } = req.body;
    const verifierId = req.user._id || req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    task.status = 'assigned';
    task.rejection = {
      reason,
      rejectedBy: verifierId,
      rejectedAt: new Date(),
      reworkInstructions: reason
    };
    task.verification = {
      ...task.verification,
      reworkCount: (task.verification?.reworkCount || 0) + 1
    };
    await task.save();

    // Notify technician
    if (task.assignment?.assignedTo) {
      await sendNotification(
        task.assignment.assignedTo,
        'Task Rejected',
        `Task "${task.title}" needs rework. Reason: ${reason}`,
        taskId
      );
    }

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

// ==================== GET TASK PROGRESS ====================

/**
 * Get Task Progress
 * Get detailed progress for a task
 */
const getTaskProgress = async (req, res) => {
  try {
    const { taskId } = req.params;

    const progress = await TaskProgress.findOne({ taskId })
      .populate('updates.createdBy', 'firstName lastName name');

    if (!progress) {
      return res.json({
        success: true,
        data: {
          updates: [],
          currentSession: null,
          checklist: []
        }
      });
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Get task progress error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET DAILY PROGRESS ====================

/**
 * Get Daily Progress
 * Get daily progress summary for a technician
 */
const getDailyProgress = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { date } = req.query;

    const queryDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      'assignment.assignedTo': technicianId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).populate('assignment.assignedBy', 'firstName lastName name');

    const completedTasks = tasks.filter(t => t.status === 'closed' || t.status === 'verified');
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
    const acceptedTasks = tasks.filter(t => t.status === 'accepted');
    const assignedTasks = tasks.filter(t => t.status === 'assigned');

    res.json({
      success: true,
      data: {
        date: startOfDay,
        summary: {
          totalTasks: tasks.length,
          completedTasks: completedTasks.length,
          inProgressTasks: inProgressTasks.length,
          acceptedTasks: acceptedTasks.length,
          assignedTasks: assignedTasks.length
        },
        tasks: tasks.map(t => ({
          id: t._id,
          taskId: t.taskId,
          title: t.title,
          status: t.status,
          priority: t.priority,
          progress: t.progress?.percentage || 0,
          startedAt: t.timeline?.startedAt,
          completedAt: t.timeline?.completedAt
        }))
      }
    });
  } catch (error) {
    console.error('Get daily progress error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== EXPORTS ====================

module.exports = {
  acceptTask,
  startTask,
  pauseTask,
  resumeTask,
  updateProgress,
  updateChecklist,
  uploadEvidence,
  completeTask,
  verifyTask,
  rejectTask,
  getTaskProgress,
  getDailyProgress
};