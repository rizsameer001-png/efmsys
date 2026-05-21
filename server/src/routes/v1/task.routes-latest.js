/**
 * TASK ROUTES
 * Defines all task-related API endpoints
 * Handles: CRUD operations, Assignment, Progress tracking, Verification
 */

const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/task.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { roleMiddleware } = require('../../middleware/role.middleware');
const { permissionMiddleware } = require('../../middleware/permission.middleware');

// ==================== ALL ROUTES REQUIRE AUTHENTICATION ====================
router.use(authMiddleware);

// ============================================================================
// TASK CRUD OPERATIONS
// ============================================================================

/**
 * @route   POST /api/v1/tasks
 * @desc    Create a new task
 * @access  Admin, Manager
 */
router.post(
  '/',
  roleMiddleware(['admin', 'manager', 'super_admin']),
  permissionMiddleware('task.create'),
  taskController.createTask
);

/**
 * @route   GET /api/v1/tasks
 * @desc    Get all tasks with filters
 * @access  All authenticated users (filtered by role)
 */
router.get(
  '/',
  permissionMiddleware('task.read'),
  taskController.getTasks
);

/**
 * @route   GET /api/v1/tasks/my
 * @desc    Get tasks assigned to the logged-in technician
 * @access  Technician only
 */
router.get(
  '/my',
  roleMiddleware(['technician']),
  taskController.getMyTasks
);

/**
 * @route   GET /api/v1/tasks/overdue
 * @desc    Get tasks that have breached SLA
 * @access  Manager, Admin, Super Admin
 */
router.get(
  '/overdue',
  roleMiddleware(['manager', 'admin', 'super_admin']),
  taskController.getOverdueTasks
);

/**
 * @route   GET /api/v1/tasks/statistics
 * @desc    Get task statistics for dashboard
 * @access  All authenticated users
 */
router.get(
  '/statistics',
  permissionMiddleware('task.read'),
  taskController.getTaskStatistics
);

/**
 * @route   GET /api/v1/tasks/:id
 * @desc    Get task by ID with full details
 * @access  All authenticated users (role-based filtering)
 */
router.get(
  '/:id',
  permissionMiddleware('task.read'),
  taskController.getTaskById
);

/**
 * @route   PUT /api/v1/tasks/:id
 * @desc    Update task information
 * @access  Admin, Manager, Assigned Technician
 */
router.put(
  '/:id',
  roleMiddleware(['admin', 'manager', 'technician', 'super_admin']),
  permissionMiddleware('task.update'),
  taskController.updateTask
);

/**
 * @route   DELETE /api/v1/tasks/:id
 * @desc    Soft delete a task
 * @access  Admin, Super Admin only
 */
router.delete(
  '/:id',
  roleMiddleware(['admin', 'super_admin']),
  permissionMiddleware('task.delete'),
  taskController.deleteTask
);

// ============================================================================
// TASK ASSIGNMENT
// ============================================================================

/**
 * @route   POST /api/v1/tasks/:id/assign
 * @desc    Manually assign task to a technician
 * @access  Admin, Manager
 */
router.post(
  '/:id/assign',
  roleMiddleware(['admin', 'manager', 'super_admin']),
  permissionMiddleware('task.assign'),
  taskController.assignTask
);

/**
 * @route   POST /api/v1/tasks/:id/auto-assign
 * @desc    Automatically assign task to best matching technician
 * @access  Admin, Manager
 */
router.post(
  '/:id/auto-assign',
  roleMiddleware(['admin', 'manager', 'super_admin']),
  permissionMiddleware('task.assign'),
  taskController.autoAssignTask
);

/**
 * @route   POST /api/v1/tasks/:id/reassign
 * @desc    Reassign task to a different technician
 * @access  Admin, Manager
 */
router.post(
  '/:id/reassign',
  roleMiddleware(['admin', 'manager', 'super_admin']),
  permissionMiddleware('task.assign'),
  taskController.reassignTask
);

// ============================================================================
// TASK PROGRESS & STATUS UPDATES
// ============================================================================

/**
 * @route   PUT /api/v1/tasks/:id/accept
 * @desc    Technician accepts the assigned task
 * @access  Technician only
 */
router.put(
  '/:id/accept',
  roleMiddleware(['technician']),
  taskController.acceptTask
);

/**
 * @route   PUT /api/v1/tasks/:id/start
 * @desc    Technician starts working on the task
 * @access  Technician only
 */
router.put(
  '/:id/start',
  roleMiddleware(['technician']),
  taskController.startTask
);

/**
 * @route   PUT /api/v1/tasks/:id/complete
 * @desc    Technician marks task as completed
 * @access  Technician only
 */
router.put(
  '/:id/complete',
  roleMiddleware(['technician']),
  taskController.completeTask
);

/**
 * @route   PUT /api/v1/tasks/:id/verify
 * @desc    Supervisor/Manager verifies and closes the task
 * @access  Supervisor, Manager, Admin
 */
router.put(
  '/:id/verify',
  roleMiddleware(['supervisor', 'manager', 'admin', 'super_admin']),
  permissionMiddleware('task.approve'),
  taskController.verifyTask
);

/**
 * @route   PUT /api/v1/tasks/:id/reject
 * @desc    Supervisor/Manager rejects task for rework
 * @access  Supervisor, Manager, Admin
 */
router.put(
  '/:id/reject',
  roleMiddleware(['supervisor', 'manager', 'admin', 'super_admin']),
  permissionMiddleware('task.approve'),
  taskController.rejectTask
);

// ============================================================================
// TASK PROGRESS UPDATES (Detailed)
// ============================================================================

/**
 * @route   PUT /api/v1/tasks/:id/progress
 * @desc    Update task progress percentage
 * @access  Technician only
 */
router.put(
  '/:id/progress',
  roleMiddleware(['technician']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { percentage } = req.body;
      const Task = require('../../models/task.model');
      
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
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * @route   PUT /api/v1/tasks/:id/update-checklist
 * @desc    Update checklist item status
 * @access  Technician only
 */
router.put(
  '/:id/update-checklist',
  roleMiddleware(['technician']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { itemId, completed, imageAfter, notes } = req.body;
      const Task = require('../../models/task.model');
      
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
  }
);

/**
 * @route   PUT /api/v1/tasks/:id/upload-evidence
 * @desc    Upload work evidence (images, videos)
 * @access  Technician only
 */
router.put(
  '/:id/upload-evidence',
  roleMiddleware(['technician']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { images, videos } = req.body;
      const Task = require('../../models/task.model');
      
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
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * @route   GET /api/v1/tasks/:id/progress
 * @desc    Get detailed progress for a task
 * @access  Assigned technician, supervisor, manager
 */
router.get(
  '/:id/progress',
  roleMiddleware(['technician', 'supervisor', 'manager', 'admin']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const Task = require('../../models/task.model');
      const TaskProgress = require('../../models/task-progress.model');
      
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
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// ============================================================================
// TASK FILTERS & UTILITIES
// ============================================================================

/**
 * @route   GET /api/v1/tasks/status/:status
 * @desc    Get tasks by status
 * @access  All authenticated users
 */
router.get(
  '/status/:status',
  permissionMiddleware('task.read'),
  async (req, res) => {
    try {
      const { status } = req.params;
      const Task = require('../../models/task.model');
      
      const query = { status, isDeleted: false };
      
      // Role-based filtering
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
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * @route   GET /api/v1/tasks/priority/:priority
 * @desc    Get tasks by priority
 * @access  All authenticated users
 */
router.get(
  '/priority/:priority',
  permissionMiddleware('task.read'),
  async (req, res) => {
    try {
      const { priority } = req.params;
      const Task = require('../../models/task.model');
      
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
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * @route   GET /api/v1/tasks/building/:buildingId
 * @desc    Get tasks by building
 * @access  Manager, Admin, Super Admin
 */
router.get(
  '/building/:buildingId',
  roleMiddleware(['manager', 'admin', 'super_admin']),
  permissionMiddleware('task.read'),
  async (req, res) => {
    try {
      const { buildingId } = req.params;
      const Task = require('../../models/task.model');
      
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
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * @route   GET /api/v1/tasks/technician/:technicianId
 * @desc    Get tasks by technician
 * @access  Manager, Admin, Super Admin
 */
router.get(
  '/technician/:technicianId',
  roleMiddleware(['manager', 'admin', 'super_admin']),
  permissionMiddleware('task.read'),
  async (req, res) => {
    try {
      const { technicianId } = req.params;
      const Task = require('../../models/task.model');
      
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
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// ============================================================================
// TASK EXPORT
// ============================================================================

/**
 * @route   GET /api/v1/tasks/export/csv
 * @desc    Export tasks to CSV
 * @access  Admin, Super Admin
 */
router.get(
  '/export/csv',
  roleMiddleware(['admin', 'super_admin']),
  permissionMiddleware('task.export'),
  async (req, res) => {
    try {
      const Task = require('../../models/task.model');
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
        'SLA Deadline': task.slaDeadline?.toISOString() || 'N/A'
      }));
      
      res.json({
        success: true,
        data: csvData
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

module.exports = router;