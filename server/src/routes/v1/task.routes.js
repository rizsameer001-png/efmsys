// /**
//  * TASK ROUTES
//  * Defines all task-related API endpoints
//  * Handles: CRUD operations, Assignment, Progress tracking, Verification
//  */

// const express = require('express');
// const router = express.Router();
// //const { protect } = require('../../middleware/auth.middleware');
// //const { authorize } = require('../../middleware/role.middleware');
// const { protect } = require('../../middleware/auth.middleware');  // ✅ Named import
// const { authorize } = require('../../middleware/role.middleware'); // ✅ Named import

// // Import all controller functions
// const taskController = require('../../controllers/task.controller');

// // ==================== ALL ROUTES REQUIRE AUTHENTICATION ====================
// router.use(protect);

// // ============================================================================
// // TASK CRUD OPERATIONS
// // ============================================================================

// /**
//  * @route   POST /api/tasks
//  * @desc    Create a new task
//  * @access  Admin, Manager, Super Admin
//  */
// router.post(
//   '/',
//   authorize(['super_admin', 'admin', 'manager']),
//   taskController.createTask
// );

// /**
//  * @route   GET /api/tasks/list
//  * @desc    Get all tasks with filters (main list endpoint)
//  * @access  All authenticated users (filtered by role)
//  */
// router.get('/list', taskController.getTaskList);

// /**
//  * @route   GET /api/tasks
//  * @desc    Get all tasks with filters (alternative)
//  * @access  All authenticated users (filtered by role)
//  */
// router.get('/', taskController.getTasks);

// /**
//  * @route   GET /api/tasks/my
//  * @desc    Get tasks assigned to the logged-in technician
//  * @access  Technician only
//  */
// router.get('/my', authorize(['technician']), taskController.getMyTasks);

// /**
//  * @route   GET /api/tasks/overdue
//  * @desc    Get tasks that have breached SLA
//  * @access  Manager, Admin, Super Admin
//  */
// router.get('/overdue', authorize(['super_admin', 'admin', 'manager']), taskController.getOverdueTasks);

// /**
//  * @route   GET /api/tasks/statistics
//  * @desc    Get task statistics for dashboard
//  * @access  All authenticated users
//  */
// router.get('/statistics', taskController.getTaskStatistics);

// /**
//  * @route   GET /api/tasks/available-technicians/:taskId
//  * @desc    Get available technicians for task assignment
//  * @access  Admin, Manager
//  */
// router.get(
//   '/available-technicians/:taskId',
//   authorize(['super_admin', 'admin', 'manager']),
//   taskController.getAvailableTechnicians
// );

// /**
//  * @route   GET /api/tasks/:id
//  * @desc    Get task by ID with full details
//  * @access  All authenticated users (role-based filtering)
//  */
// router.get('/:id', taskController.getTaskById);

// /**
//  * @route   PUT /api/tasks/:id
//  * @desc    Update task information
//  * @access  Admin, Manager, Assigned Technician, Super Admin
//  */
// router.put(
//   '/:id',
//   authorize(['super_admin', 'admin', 'manager', 'technician']),
//   taskController.updateTask
// );

// /**
//  * @route   DELETE /api/tasks/:id
//  * @desc    Soft delete a task
//  * @access  Admin, Super Admin only
//  */
// router.delete('/:id', authorize(['super_admin', 'admin']), taskController.deleteTask);

// // ============================================================================
// // TASK ASSIGNMENT
// // ============================================================================

// /**
//  * @route   POST /api/tasks/:id/assign
//  * @desc    Manually assign task to a technician
//  * @access  Admin, Manager, Super Admin
//  */
// router.post(
//   '/:id/assign',
//   authorize(['super_admin', 'admin', 'manager']),
//   taskController.assignTask
// );

// /**
//  * @route   POST /api/tasks/:id/auto-assign
//  * @desc    Automatically assign task to best matching technician
//  * @access  Admin, Manager, Super Admin
//  */
// router.post(
//   '/:id/auto-assign',
//   authorize(['super_admin', 'admin', 'manager']),
//   taskController.autoAssignTask
// );

// /**
//  * @route   POST /api/tasks/:id/reassign
//  * @desc    Reassign task to a different technician
//  * @access  Admin, Manager, Super Admin
//  */
// router.post(
//   '/:id/reassign',
//   authorize(['super_admin', 'admin', 'manager']),
//   taskController.reassignTask
// );

// /**
//  * @route   GET /api/tasks/:id/assignment-history
//  * @desc    Get assignment history for a task
//  * @access  Admin, Manager
//  */
// router.get(
//   '/:id/assignment-history',
//   authorize(['super_admin', 'admin', 'manager']),
//   taskController.getAssignmentHistory
// );

// /**
//  * @route   GET /api/tasks/technician/:technicianId/workload
//  * @desc    Get workload for a specific technician
//  * @access  Admin, Manager
//  */
// router.get(
//   '/technician/:technicianId/workload',
//   authorize(['super_admin', 'admin', 'manager']),
//   taskController.getTechnicianWorkload
// );

// /**
//  * @route   GET /api/tasks/technician/:technicianId/daily-progress
//  * @desc    Get daily progress for a technician
//  * @access  Admin, Manager
//  */
// router.get(
//   '/technician/:technicianId/daily-progress',
//   authorize(['super_admin', 'admin', 'manager']),
//   taskController.getDailyProgress
// );

// // ============================================================================
// // TASK PROGRESS & STATUS UPDATES
// // ============================================================================

// /**
//  * @route   PUT /api/tasks/:id/accept
//  * @desc    Technician accepts the assigned task
//  * @access  Technician only
//  */
// router.put('/:id/accept', authorize(['technician']), taskController.acceptTask);

// /**
//  * @route   PUT /api/tasks/:id/start
//  * @desc    Technician starts working on the task
//  * @access  Technician only
//  */
// router.put('/:id/start', authorize(['technician']), taskController.startTask);

// /**
//  * @route   PUT /api/tasks/:id/progress
//  * @desc    Update task progress percentage
//  * @access  Technician only
//  */
// router.put('/:id/progress', authorize(['technician']), taskController.updateProgress);

// /**
//  * @route   PUT /api/tasks/:id/update-checklist
//  * @desc    Update checklist item status
//  * @access  Technician only
//  */
// router.put('/:id/update-checklist', authorize(['technician']), taskController.updateChecklist);

// /**
//  * @route   PUT /api/tasks/:id/upload-evidence
//  * @desc    Upload work evidence (images, videos)
//  * @access  Technician only
//  */
// router.put('/:id/upload-evidence', authorize(['technician']), taskController.uploadEvidence);

// /**
//  * @route   PUT /api/tasks/:id/complete
//  * @desc    Technician marks task as completed
//  * @access  Technician only
//  */
// router.put('/:id/complete', authorize(['technician']), taskController.completeTask);

// /**
//  * @route   PUT /api/tasks/:id/verify
//  * @desc    Supervisor/Manager verifies and closes the task
//  * @access  Supervisor, Manager, Admin, Super Admin
//  */
// router.put(
//   '/:id/verify',
//   authorize(['super_admin', 'admin', 'manager', 'supervisor']),
//   taskController.verifyTask
// );

// /**
//  * @route   PUT /api/tasks/:id/reject
//  * @desc    Supervisor/Manager rejects task for rework
//  * @access  Supervisor, Manager, Admin, Super Admin
//  */
// router.put(
//   '/:id/reject',
//   authorize(['super_admin', 'admin', 'manager', 'supervisor']),
//   taskController.rejectTask
// );

// /**
//  * @route   GET /api/tasks/:id/progress
//  * @desc    Get detailed progress for a task
//  * @access  Assigned technician, supervisor, manager, admin
//  */
// router.get(
//   '/:id/progress',
//   authorize(['technician', 'super_admin', 'admin', 'manager', 'supervisor']),
//   taskController.getTaskProgress
// );

// // ============================================================================
// // TASK FILTERS & UTILITIES
// // ============================================================================

// /**
//  * @route   GET /api/tasks/status/:status
//  * @desc    Get tasks by status
//  * @access  All authenticated users
//  */
// router.get('/status/:status', taskController.getTasksByStatus);

// /**
//  * @route   GET /api/tasks/priority/:priority
//  * @desc    Get tasks by priority
//  * @access  All authenticated users
//  */
// router.get('/priority/:priority', taskController.getTasksByPriority);

// /**
//  * @route   GET /api/tasks/building/:buildingId
//  * @desc    Get tasks by building
//  * @access  Manager, Admin, Super Admin
//  */
// router.get(
//   '/building/:buildingId',
//   authorize(['super_admin', 'admin', 'manager']),
//   taskController.getTasksByBuilding
// );

// /**
//  * @route   GET /api/tasks/technician/:technicianId
//  * @desc    Get tasks by technician
//  * @access  Manager, Admin, Super Admin
//  */
// router.get(
//   '/technician/:technicianId',
//   authorize(['super_admin', 'admin', 'manager']),
//   taskController.getTasksByTechnician
// );

// // ============================================================================
// // TASK EXPORT
// // ============================================================================

// /**
//  * @route   GET /api/tasks/export/csv
//  * @desc    Export tasks to CSV
//  * @access  Admin, Super Admin
//  */
// router.get('/export/csv', authorize(['super_admin', 'admin']), taskController.exportTasksToCSV);

// module.exports = router;



//updated task.routes.js with the missing getAvailableTechnicians endpoint and better debugging:
/**
 * TASK ROUTES
 * Defines all task-related API endpoints
 * Handles: CRUD operations, Assignment, Progress tracking, Verification
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

// Import all controller functions
const taskController = require('../../controllers/task.controller');

// Debug logging
console.log('📋 Task Routes Initialized');
console.log(`   - protect middleware: ${typeof protect}`);
console.log(`   - authorize middleware: ${typeof authorize}`);

// ==================== ALL ROUTES REQUIRE AUTHENTICATION ====================
router.use(protect);

// ============================================================================
// TASK CRUD OPERATIONS
// ============================================================================

/**
 * @route   POST /api/v1/tasks
 * @desc    Create a new task
 * @access  Admin, Manager, Super Admin
 */
router.post(
  '/',
  authorize(['super_admin', 'admin', 'manager']),
  taskController.createTask
);

/**
 * @route   GET /api/v1/tasks/list
 * @desc    Get all tasks with filters (main list endpoint)
 * @access  All authenticated users (filtered by role)
 */
router.get('/list', taskController.getTaskList);

/**
 * @route   GET /api/v1/tasks
 * @desc    Get all tasks with filters (alternative)
 * @access  All authenticated users (filtered by role)
 */
router.get('/', taskController.getTasks);

/**
 * @route   GET /api/v1/tasks/my
 * @desc    Get tasks assigned to the logged-in technician
 * @access  Technician only
 */
router.get('/my', authorize(['technician']), taskController.getMyTasks);

/**
 * @route   GET /api/v1/tasks/overdue
 * @desc    Get tasks that have breached SLA
 * @access  Manager, Admin, Super Admin
 */
router.get('/overdue', authorize(['super_admin', 'admin', 'manager']), taskController.getOverdueTasks);

/**
 * @route   GET /api/v1/tasks/statistics
 * @desc    Get task statistics for dashboard
 * @access  All authenticated users
 */
router.get('/statistics', taskController.getTaskStatistics);

/**
 * @route   GET /api/v1/tasks/available-technicians/:taskId
 * @desc    Get available technicians for task assignment
 * @access  Admin, Manager
 */
router.get(
  '/available-technicians/:taskId',
  authorize(['super_admin', 'admin', 'manager']),
  async (req, res) => {
    console.log(`📋 [DEBUG] Getting available technicians for task: ${req.params.taskId}`);
    console.log(`   User: ${req.user._id} (${req.user.role})`);
    
    try {
      const User = require('../../models/User.model');
      
      // Find all active technicians
      const technicians = await User.find({ 
        role: 'technician', 
        status: 'active',
        isActive: true
      }).select('_id firstName lastName email phone profileImage isUserOnline lastSeen');
      
      console.log(`   Found ${technicians.length} active technicians`);
      
      // You can add logic to filter based on task requirements
      // For now, return all active technicians
      
      res.json({ 
        success: true, 
        data: technicians,
        count: technicians.length,
        message: technicians.length === 0 ? 'No technicians available' : null
      });
    } catch (error) {
      console.error('❌ Error fetching available technicians:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message,
        data: [] 
      });
    }
  }
);

/**
 * @route   GET /api/v1/tasks/:id
 * @desc    Get task by ID with full details
 * @access  All authenticated users (role-based filtering)
 */
router.get('/:id', taskController.getTaskById);

/**
 * @route   PUT /api/v1/tasks/:id
 * @desc    Update task information
 * @access  Admin, Manager, Assigned Technician, Super Admin
 */
router.put(
  '/:id',
  authorize(['super_admin', 'admin', 'manager', 'technician']),
  taskController.updateTask
);

/**
 * @route   DELETE /api/v1/tasks/:id
 * @desc    Soft delete a task
 * @access  Admin, Super Admin only
 */
router.delete('/:id', authorize(['super_admin', 'admin']), taskController.deleteTask);

// ============================================================================
// TASK ASSIGNMENT
// ============================================================================

/**
 * @route   POST /api/v1/tasks/:id/assign
 * @desc    Manually assign task to a technician
 * @access  Admin, Manager, Super Admin
 */
router.post(
  '/:id/assign',
  authorize(['super_admin', 'admin', 'manager']),
  taskController.assignTask
);

/**
 * @route   POST /api/v1/tasks/:id/auto-assign
 * @desc    Automatically assign task to best matching technician
 * @access  Admin, Manager, Super Admin
 */
router.post(
  '/:id/auto-assign',
  authorize(['super_admin', 'admin', 'manager']),
  taskController.autoAssignTask
);

/**
 * @route   POST /api/v1/tasks/:id/reassign
 * @desc    Reassign task to a different technician
 * @access  Admin, Manager, Super Admin
 */
router.post(
  '/:id/reassign',
  authorize(['super_admin', 'admin', 'manager']),
  taskController.reassignTask
);

/**
 * @route   GET /api/v1/tasks/:id/assignment-history
 * @desc    Get assignment history for a task
 * @access  Admin, Manager
 */
router.get(
  '/:id/assignment-history',
  authorize(['super_admin', 'admin', 'manager']),
  taskController.getAssignmentHistory
);

/**
 * @route   GET /api/v1/tasks/technician/:technicianId/workload
 * @desc    Get workload for a specific technician
 * @access  Admin, Manager
 */
router.get(
  '/technician/:technicianId/workload',
  authorize(['super_admin', 'admin', 'manager']),
  taskController.getTechnicianWorkload
);

/**
 * @route   GET /api/v1/tasks/technician/:technicianId/daily-progress
 * @desc    Get daily progress for a technician
 * @access  Admin, Manager
 */
router.get(
  '/technician/:technicianId/daily-progress',
  authorize(['super_admin', 'admin', 'manager']),
  taskController.getDailyProgress
);

// ============================================================================
// TASK PROGRESS & STATUS UPDATES
// ============================================================================

/**
 * @route   PUT /api/v1/tasks/:id/accept
 * @desc    Technician accepts the assigned task
 * @access  Technician only
 */
router.put('/:id/accept', authorize(['technician']), taskController.acceptTask);

/**
 * @route   PUT /api/v1/tasks/:id/start
 * @desc    Technician starts working on the task
 * @access  Technician only
 */
router.put('/:id/start', authorize(['technician']), taskController.startTask);

/**
 * @route   PUT /api/v1/tasks/:id/progress
 * @desc    Update task progress percentage
 * @access  Technician only
 */
router.put('/:id/progress', authorize(['technician']), taskController.updateProgress);

/**
 * @route   PUT /api/v1/tasks/:id/update-checklist
 * @desc    Update checklist item status
 * @access  Technician only
 */
router.put('/:id/update-checklist', authorize(['technician']), taskController.updateChecklist);

/**
 * @route   PUT /api/v1/tasks/:id/upload-evidence
 * @desc    Upload work evidence (images, videos)
 * @access  Technician only
 */
router.put('/:id/upload-evidence', authorize(['technician']), taskController.uploadEvidence);

/**
 * @route   PUT /api/v1/tasks/:id/complete
 * @desc    Technician marks task as completed
 * @access  Technician only
 */
router.put('/:id/complete', authorize(['technician']), taskController.completeTask);

/**
 * @route   PUT /api/v1/tasks/:id/verify
 * @desc    Supervisor/Manager verifies and closes the task
 * @access  Supervisor, Manager, Admin, Super Admin
 */
router.put(
  '/:id/verify',
  authorize(['super_admin', 'admin', 'manager', 'supervisor']),
  taskController.verifyTask
);

/**
 * @route   PUT /api/v1/tasks/:id/reject
 * @desc    Supervisor/Manager rejects task for rework
 * @access  Supervisor, Manager, Admin, Super Admin
 */
router.put(
  '/:id/reject',
  authorize(['super_admin', 'admin', 'manager', 'supervisor']),
  taskController.rejectTask
);

/**
 * @route   GET /api/v1/tasks/:id/progress
 * @desc    Get detailed progress for a task
 * @access  Assigned technician, supervisor, manager, admin
 */
router.get(
  '/:id/progress',
  authorize(['technician', 'super_admin', 'admin', 'manager', 'supervisor']),
  taskController.getTaskProgress
);

// ============================================================================
// TASK FILTERS & UTILITIES
// ============================================================================

/**
 * @route   GET /api/v1/tasks/status/:status
 * @desc    Get tasks by status
 * @access  All authenticated users
 */
router.get('/status/:status', taskController.getTasksByStatus);

/**
 * @route   GET /api/v1/tasks/priority/:priority
 * @desc    Get tasks by priority
 * @access  All authenticated users
 */
router.get('/priority/:priority', taskController.getTasksByPriority);

/**
 * @route   GET /api/v1/tasks/building/:buildingId
 * @desc    Get tasks by building
 * @access  Manager, Admin, Super Admin
 */
router.get(
  '/building/:buildingId',
  authorize(['super_admin', 'admin', 'manager']),
  taskController.getTasksByBuilding
);

/**
 * @route   GET /api/v1/tasks/technician/:technicianId
 * @desc    Get tasks by technician
 * @access  Manager, Admin, Super Admin
 */
router.get(
  '/technician/:technicianId',
  authorize(['super_admin', 'admin', 'manager']),
  taskController.getTasksByTechnician
);

// ============================================================================
// TASK EXPORT
// ============================================================================

/**
 * @route   GET /api/v1/tasks/export/csv
 * @desc    Export tasks to CSV
 * @access  Admin, Super Admin
 */
router.get('/export/csv', authorize(['super_admin', 'admin']), taskController.exportTasksToCSV);

// Debug: Log all registered routes
console.log('📋 Task Routes Registered:');
console.log('   - POST   /');
console.log('   - GET    /list');
console.log('   - GET    /');
console.log('   - GET    /my');
console.log('   - GET    /overdue');
console.log('   - GET    /statistics');
console.log('   - GET    /available-technicians/:taskId');
console.log('   - GET    /:id');
console.log('   - PUT    /:id');
console.log('   - DELETE /:id');
console.log('   - POST   /:id/assign');
console.log('   - POST   /:id/auto-assign');
console.log('   - POST   /:id/reassign');
console.log('   - GET    /:id/assignment-history');
console.log('   - GET    /technician/:technicianId/workload');
console.log('   - GET    /technician/:technicianId/daily-progress');
console.log('   - PUT    /:id/accept');
console.log('   - PUT    /:id/start');
console.log('   - PUT    /:id/progress');
console.log('   - PUT    /:id/update-checklist');
console.log('   - PUT    /:id/upload-evidence');
console.log('   - PUT    /:id/complete');
console.log('   - PUT    /:id/verify');
console.log('   - PUT    /:id/reject');
console.log('   - GET    /:id/progress');
console.log('   - GET    /status/:status');
console.log('   - GET    /priority/:priority');
console.log('   - GET    /building/:buildingId');
console.log('   - GET    /technician/:technicianId');
console.log('   - GET    /export/csv');

module.exports = router;