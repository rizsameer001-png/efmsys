/**
 * TASK PROGRESS CONTROLLER
 * Handles task progress tracking, start, pause, resume, complete operations
 */

const Task = require('../models/task.model');
const TaskProgress = require('../models/task-progress.model');
const SLAHistory = require('../models/sla-history.model');

/**
 * Accept Task
 * Technician accepts the assigned task
 */
exports.acceptTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const technicianId = req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Verify task is assigned to this technician
    if (task.assignment.assignedTo.toString() !== technicianId) {
      return res.status(403).json({ success: false, error: 'Task not assigned to you' });
    }

    if (task.status !== 'assigned') {
      return res.status(400).json({ success: false, error: 'Task cannot be accepted' });
    }

    task.status = 'accepted';
    task.timeline.acceptedAt = new Date();
    await task.save();

    // Create progress record
    let progress = await TaskProgress.findOne({ taskId });
    if (!progress) {
      progress = new TaskProgress({
        taskId,
        technicianId,
        updates: [{
          type: 'accept',
          description: 'Task accepted',
          timestamp: new Date()
        }]
      });
    } else {
      progress.updates.push({
        type: 'accept',
        description: 'Task accepted',
        timestamp: new Date()
      });
    }
    await progress.save();

    res.json({
      success: true,
      data: task,
      message: 'Task accepted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Start Task
 * Technician starts working on the task with GPS verification
 */
exports.startTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { location } = req.body;
    const technicianId = req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (task.assignment.assignedTo.toString() !== technicianId) {
      return res.status(403).json({ success: false, error: 'Task not assigned to you' });
    }

    if (task.status !== 'accepted') {
      return res.status(400).json({ success: false, error: 'Task cannot be started' });
    }

    task.status = 'in_progress';
    task.timeline.startedAt = new Date();
    task.gps.checkIn = {
      lat: location.lat,
      lng: location.lng,
      timestamp: new Date(),
      accuracy: location.accuracy
    };
    await task.save();

    // Update progress
    let progress = await TaskProgress.findOne({ taskId });
    if (!progress) {
      progress = new TaskProgress({
        taskId,
        technicianId
      });
    }
    progress.currentSession = {
      isActive: true,
      startedAt: new Date()
    };
    progress.updates.push({
      type: 'start',
      description: 'Task started',
      location: { lat: location.lat, lng: location.lng },
      timestamp: new Date()
    });
    await progress.save();

    res.json({
      success: true,
      data: task,
      message: 'Task started successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update Task Progress
 * Update checklist and progress percentage
 */
exports.updateProgress = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { checklistItems, progressPercentage, notes } = req.body;
    const technicianId = req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Update checklist
    if (checklistItems && task.checklist) {
      for (const item of checklistItems) {
        const checklistItem = task.checklist.id(item.itemId);
        if (checklistItem) {
          checklistItem.completed = item.completed;
          checklistItem.completedBy = technicianId;
          checklistItem.completedAt = new Date();
          if (item.imageAfter) checklistItem.imageAfter = item.imageAfter;
          if (item.notes) checklistItem.notes = item.notes;
        }
      }
    }

    // Update progress percentage
    if (progressPercentage) {
      task.progress.percentage = progressPercentage;
      task.progress.lastUpdatedAt = new Date();
      task.progress.updatedBy = technicianId;
    } else {
      // Auto-calculate from checklist
      const completedItems = task.checklist.filter(item => item.completed).length;
      task.progress.percentage = Math.round((completedItems / task.checklist.length) * 100);
    }

    // Add technician note
    if (notes) {
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
        timestamp: new Date()
      });
      await progress.save();
    }

    res.json({
      success: true,
      data: task,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update Checklist
 * Update specific checklist item
 */
exports.updateChecklist = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { itemId, completed, imageAfter, notes } = req.body;
    const technicianId = req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const checklistItem = task.checklist.id(itemId);
    if (!checklistItem) {
      return res.status(404).json({ success: false, error: 'Checklist item not found' });
    }

    checklistItem.completed = completed;
    checklistItem.completedBy = technicianId;
    checklistItem.completedAt = new Date();
    if (imageAfter) checklistItem.imageAfter = imageAfter;
    if (notes) checklistItem.notes = notes;

    // Recalculate progress
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
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Upload Evidence
 * Upload images/videos as work evidence
 */
exports.uploadEvidence = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { images, videos, documents } = req.body;
    const technicianId = req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (images) {
      task.evidence.afterImages.push(...images.map(img => ({
        ...img,
        uploadedBy: technicianId,
        uploadedAt: new Date()
      })));
    }

    if (videos) {
      task.evidence.videos.push(...videos.map(vid => ({
        ...vid,
        uploadedBy: technicianId,
        uploadedAt: new Date()
      })));
    }

    if (documents) {
      task.evidence.documents.push(...documents.map(doc => ({
        ...doc,
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
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Pause Task
 * Pause the current task (e.g., waiting for parts, break)
 */
exports.pauseTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { reason } = req.body;
    const technicianId = req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (task.status !== 'in_progress') {
      return res.status(400).json({ success: false, error: 'Task cannot be paused' });
    }

    task.status = 'waiting_parts';
    task.timeline.pausedAt = new Date();
    await task.save();

    const progress = await TaskProgress.findOne({ taskId });
    if (progress) {
      progress.currentSession.pausedAt = new Date();
      progress.currentSession.isActive = false;
      progress.updates.push({
        type: 'pause',
        description: reason || 'Task paused',
        timestamp: new Date()
      });
      await progress.save();
    }

    res.json({
      success: true,
      data: task,
      message: 'Task paused successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Resume Task
 * Resume a paused task
 */
exports.resumeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const technicianId = req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (task.status !== 'waiting_parts') {
      return res.status(400).json({ success: false, error: 'Task cannot be resumed' });
    }

    task.status = 'in_progress';
    task.timeline.resumedAt = new Date();
    await task.save();

    const progress = await TaskProgress.findOne({ taskId });
    if (progress && progress.currentSession.pausedAt) {
      const pausedDuration = new Date() - progress.currentSession.pausedAt;
      progress.currentSession.totalPausedMinutes += Math.floor(pausedDuration / 60000);
      progress.currentSession.pausedAt = null;
      progress.currentSession.isActive = true;
      progress.updates.push({
        type: 'resume',
        description: 'Task resumed',
        timestamp: new Date()
      });
      await progress.save();
    }

    res.json({
      success: true,
      data: task,
      message: 'Task resumed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Complete Task
 * Mark task as completed with evidence
 */
exports.completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completionNotes, afterImages, partsUsed } = req.body;
    const technicianId = req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Verify all required checklist items are completed
    const incompleteRequired = task.checklist.filter(item => item.required && !item.completed);
    if (incompleteRequired.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Complete required items: ${incompleteRequired.map(i => i.itemName).join(', ')}`
      });
    }

    task.status = 'completed';
    task.timeline.completedAt = new Date();
    task.progress.percentage = 100;
    
    if (completionNotes) {
      task.technicianNotes.push({
        note: `COMPLETION: ${completionNotes}`,
        createdBy: technicianId,
        createdAt: new Date(),
        isPublic: true
      });
    }

    if (afterImages) {
      task.evidence.afterImages.push(...afterImages.map(img => ({
        url: img,
        uploadedBy: technicianId,
        uploadedAt: new Date(),
        description: 'Completion evidence'
      })));
    }

    if (partsUsed) {
      task.partsUsed = partsUsed;
    }

    // Calculate actual duration
    if (task.timeline.startedAt) {
      const duration = Math.floor((task.timeline.completedAt - task.timeline.startedAt) / 60000);
      task.timeTracking.actualDuration = duration;
    }

    await task.save();

    // Update progress record
    const progress = await TaskProgress.findOne({ taskId });
    if (progress) {
      progress.currentSession.isActive = false;
      progress.updates.push({
        type: 'complete',
        description: completionNotes || 'Task completed',
        progressPercentage: 100,
        timestamp: new Date()
      });
      await progress.save();
    }

    res.json({
      success: true,
      data: task,
      message: 'Task completed successfully. Pending verification.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Verify Task
 * Supervisor/Manager verifies and closes the task
 */
exports.verifyTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { rating, notes, status } = req.body;
    const verifierId = req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    if (status === 'approved') {
      task.status = 'verified';
      task.verification = {
        verifiedBy: verifierId,
        verifiedAt: new Date(),
        notes,
        rating,
        reworkCount: task.verification?.reworkCount || 0
      };
      task.timeline.verifiedAt = new Date();
      
      // Close task if no rework needed
      task.status = 'closed';
      task.timeline.closedAt = new Date();
    } else if (status === 'rejected') {
      task.status = 'assigned';
      task.rejection = {
        reason: notes,
        rejectedBy: verifierId,
        rejectedAt: new Date(),
        reworkInstructions: notes
      };
      task.verification.reworkCount = (task.verification?.reworkCount || 0) + 1;
    }

    await task.save();

    res.json({
      success: true,
      data: task,
      message: status === 'approved' ? 'Task verified and closed' : 'Task rejected for rework'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Reject Task
 * Supervisor/Manager rejects the task for rework
 */
exports.rejectTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { reason } = req.body;
    const verifierId = req.userId;

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
    task.verification.reworkCount = (task.verification?.reworkCount || 0) + 1;
    await task.save();

    res.json({
      success: true,
      data: task,
      message: 'Task rejected for rework'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get Task Progress
 * Get detailed progress for a task
 */
exports.getTaskProgress = async (req, res) => {
  try {
    const { taskId } = req.params;

    const progress = await TaskProgress.findOne({ taskId })
      .populate('updates.createdBy', 'firstName lastName');

    if (!progress) {
      return res.json({
        success: true,
        data: {
          updates: [],
          timeEntries: [],
          dailySummary: []
        }
      });
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get Daily Progress
 * Get daily progress summary for a technician
 */
exports.getDailyProgress = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { date } = req.query;

    const queryDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

    const tasks = await Task.find({
      'assignment.assignedTo': technicianId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const completedTasks = tasks.filter(t => t.status === 'closed');
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');

    res.json({
      success: true,
      data: {
        date: queryDate,
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        inProgressTasks: inProgressTasks.length,
        tasks: tasks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};