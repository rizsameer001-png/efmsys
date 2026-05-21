// // server/src/routes/v1/attendance.routes.js
// const express = require('express');
// const router = express.Router();
// const attendanceController = require('../controllers/attendance.controller');
// const { protect } = require('../middleware/auth.middleware');
// const { authorize } = require('../middleware/role.middleware');

// router.use(protect);

// // ==================== EMPLOYEE SELF ====================
// router.post('/check-in', attendanceController.checkIn);
// router.post('/check-out', attendanceController.checkOut);
// router.get('/my', attendanceController.getMyAttendance);

// // ==================== MANAGER/SUPERVISOR ====================
// router.get('/team', authorize(['manager', 'supervisor']), attendanceController.getTeamAttendance);
// router.put('/:employeeId/mark', authorize(['manager', 'supervisor', 'hr', 'admin']), attendanceController.markAttendance);

// // ==================== ADMIN/HR ====================
// router.get('/all', authorize(['admin', 'hr', 'super_admin']), attendanceController.getAllAttendance);
// router.get('/absent', authorize(['admin', 'hr', 'super_admin']), attendanceController.getAbsentEmployees);
// router.get('/late', authorize(['admin', 'hr', 'super_admin']), attendanceController.getLateEmployees);
// router.get('/report', authorize(['admin', 'hr', 'manager']), attendanceController.getAttendanceReport);
// router.get('/export', authorize(['admin', 'hr']), attendanceController.exportAttendance);
// router.get('/summary', attendanceController.getMonthlySummary);
// router.get('/department-stats', authorize(['admin', 'hr']), attendanceController.getDepartmentStats);

// // ==================== CORRECTION REQUESTS ====================
// router.post('/correction-request', attendanceController.requestCorrection);
// router.get('/pending-corrections', authorize(['manager', 'hr', 'admin']), attendanceController.getPendingCorrections);
// router.put('/correction-request/:requestId/approve', authorize(['manager', 'hr', 'admin']), attendanceController.approveCorrection);
// router.put('/correction-request/:requestId/reject', authorize(['manager', 'hr', 'admin']), attendanceController.rejectCorrection);

// // ==================== HOLIDAYS ====================
// router.get('/holidays', attendanceController.getHolidays);
// router.post('/holidays', authorize(['admin', 'hr', 'super_admin']), attendanceController.createHoliday);
// router.put('/holidays/:holidayId', authorize(['admin', 'hr', 'super_admin']), attendanceController.updateHoliday);
// router.delete('/holidays/:holidayId', authorize(['admin', 'hr', 'super_admin']), attendanceController.deleteHoliday);

// // ==================== DASHBOARD ====================
// router.get('/dashboard-stats', authorize(['admin', 'hr', 'manager']), attendanceController.getDashboardStats);
// router.get('/today-summary', attendanceController.getTodaySummary);

// module.exports = router;



// // server/src/routes/v1/attendance.routes.js
// const express = require('express');
// const router = express.Router();
// // 🔴 FIX: Correct path - go up two levels to controllers folder
// const attendanceController = require('../../controllers/attendance.controller');
// const { protect } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');

// router.use(protect);

// // ==================== EMPLOYEE SELF ====================
// router.post('/check-in', attendanceController.checkIn);
// router.post('/check-out', attendanceController.checkOut);
// router.get('/my', attendanceController.getMyAttendance);

// // ==================== MANAGER/SUPERVISOR ====================
// router.get('/team', authorize(['manager', 'supervisor']), attendanceController.getTeamAttendance);
// router.put('/:employeeId/mark', authorize(['manager', 'supervisor', 'hr', 'admin']), attendanceController.markAttendance);

// // ==================== ADMIN/HR ====================
// router.get('/all', authorize(['admin', 'hr', 'super_admin']), attendanceController.getAllAttendance);
// router.get('/absent', authorize(['admin', 'hr', 'super_admin']), attendanceController.getAbsentEmployees);
// router.get('/late', authorize(['admin', 'hr', 'super_admin']), attendanceController.getLateEmployees);
// router.get('/report', authorize(['admin', 'hr', 'manager']), attendanceController.getAttendanceReport);
// router.get('/export', authorize(['admin', 'hr']), attendanceController.exportAttendance);
// router.get('/summary', attendanceController.getMonthlySummary);
// router.get('/department-stats', authorize(['admin', 'hr']), attendanceController.getDepartmentStats);

// // ==================== CORRECTION REQUESTS ====================
// router.post('/correction-request', attendanceController.requestCorrection);
// router.get('/pending-corrections', authorize(['manager', 'hr', 'admin']), attendanceController.getPendingCorrections);
// router.put('/correction-request/:requestId/approve', authorize(['manager', 'hr', 'admin']), attendanceController.approveCorrection);
// router.put('/correction-request/:requestId/reject', authorize(['manager', 'hr', 'admin']), attendanceController.rejectCorrection);

// // ==================== HOLIDAYS ====================
// router.get('/holidays', attendanceController.getHolidays);
// router.post('/holidays', authorize(['admin', 'hr', 'super_admin']), attendanceController.createHoliday);
// router.put('/holidays/:holidayId', authorize(['admin', 'hr', 'super_admin']), attendanceController.updateHoliday);
// router.delete('/holidays/:holidayId', authorize(['admin', 'hr', 'super_admin']), attendanceController.deleteHoliday);

// // ==================== DASHBOARD ====================
// //router.get('/dashboard-stats', authorize(['admin', 'hr', 'manager']), attendanceController.getDashboardStats);
// router.get('/dashboard-stats', protect, authorize('super_admin', 'admin', 'hr', 'manager'), attendanceController.getDashboardStats);
// router.get('/today-summary', attendanceController.getTodaySummary);

// // server/src/routes/v1/chat.routes.js
// // Add this route after the stats route

// // Get total unread count for user
// router.get('/unread-count', protect, async (req, res) => {
//   try {
//     const userId = req.user._id || req.userId;
//     const Chat = require('../../models/Chat.model');
    
//     // Find all chats where user is a participant
//     const chats = await Chat.find({
//       'participants.userId': userId,
//       isActive: true
//     });
    
//     // Calculate total unread count
//     let totalUnread = 0;
//     chats.forEach(chat => {
//       const userUnread = chat.unreadCounts?.find(u => u.userId.toString() === userId.toString());
//       if (userUnread) {
//         totalUnread += userUnread.count || 0;
//       }
//     });
    
//     res.json({ 
//       success: true, 
//       data: { count: totalUnread }
//     });
//   } catch (error) {
//     console.error('Get unread count error:', error);
//     // Return mock data if error
//     res.json({ 
//       success: true, 
//       data: { count: 0 }
//     });
//   }
// });

// module.exports = router;






// // server/src/routes/v1/attendance.routes.js
// const express = require('express');
// const router = express.Router();
// const attendanceController = require('../../controllers/attendance.controller');
// const { protect } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');

// // All routes require authentication
// router.use(protect);

// // ==================== EMPLOYEE SELF ====================

// /**
//  * @route   POST /api/v1/attendance/check-in
//  * @desc    Employee check-in
//  * @access  Private (All authenticated users)
//  */
// router.post('/check-in', attendanceController.checkIn);

// /**
//  * @route   POST /api/v1/attendance/check-out
//  * @desc    Employee check-out
//  * @access  Private (All authenticated users)
//  */
// router.post('/check-out', attendanceController.checkOut);

// /**
//  * @route   GET /api/v1/attendance/my
//  * @desc    Get current user's attendance records
//  * @access  Private (All authenticated users)
//  */
// router.get('/my', attendanceController.getMyAttendance);

// // ==================== MANAGER/SUPERVISOR ====================

// /**
//  * @route   GET /api/v1/attendance/team
//  * @desc    Get team attendance (Manager/Supervisor can view their team)
//  * @access  Manager, Supervisor, Admin, Super Admin
//  */
// router.get('/team', 
//   authorize(['manager', 'supervisor', 'admin', 'super_admin']), 
//   attendanceController.getTeamAttendance
// );

// /**
//  * @route   PUT /api/v1/attendance/:employeeId/mark
//  * @desc    Mark attendance for an employee (Manager/HR)
//  * @access  Manager, Supervisor, HR, Admin, Super Admin
//  */
// router.put('/:employeeId/mark', 
//   authorize(['manager', 'supervisor', 'hr', 'admin', 'super_admin']), 
//   attendanceController.markAttendance
// );

// // ==================== ADMIN/HR ====================

// /**
//  * @route   GET /api/v1/attendance/all
//  * @desc    Get all employees attendance (Admin/HR)
//  * @access  Admin, HR, Super Admin
//  */
// router.get('/all', 
//   authorize(['admin', 'hr', 'super_admin']), 
//   attendanceController.getAllAttendance
// );

// /**
//  * @route   GET /api/v1/attendance/absent
//  * @desc    Get list of absent employees
//  * @access  Admin, HR, Super Admin, Manager
//  */
// router.get('/absent', 
//   authorize(['admin', 'hr', 'super_admin', 'manager']), 
//   attendanceController.getAbsentEmployees
// );

// /**
//  * @route   GET /api/v1/attendance/late
//  * @desc    Get list of late employees
//  * @access  Admin, HR, Super Admin, Manager
//  */
// router.get('/late', 
//   authorize(['admin', 'hr', 'super_admin', 'manager']), 
//   attendanceController.getLateEmployees
// );

// /**
//  * @route   GET /api/v1/attendance/report
//  * @desc    Generate attendance report
//  * @access  Admin, HR, Manager, Super Admin
//  */
// router.get('/report', 
//   authorize(['admin', 'hr', 'manager', 'super_admin']), 
//   attendanceController.getAttendanceReport
// );

// /**
//  * @route   GET /api/v1/attendance/export
//  * @desc    Export attendance data
//  * @access  Admin, HR, Super Admin
//  */
// router.get('/export', 
//   authorize(['admin', 'hr', 'super_admin']), 
//   attendanceController.exportAttendance
// );

// /**
//  * @route   GET /api/v1/attendance/summary
//  * @desc    Get monthly attendance summary
//  * @access  Private (All authenticated users)
//  */
// router.get('/summary', 
//   protect, 
//   attendanceController.getMonthlySummary
// );

// /**
//  * @route   GET /api/v1/attendance/department-stats
//  * @desc    Get attendance statistics by department
//  * @access  Admin, HR, Super Admin, Manager
//  */
// router.get('/department-stats', 
//   authorize(['admin', 'hr', 'super_admin', 'manager']), 
//   attendanceController.getDepartmentStats
// );

// // ==================== CORRECTION REQUESTS ====================

// /**
//  * @route   POST /api/v1/attendance/correction-request
//  * @desc    Request attendance correction
//  * @access  Private (All authenticated users)
//  */
// router.post('/correction-request', 
//   protect, 
//   attendanceController.requestCorrection
// );

// /**
//  * @route   GET /api/v1/attendance/pending-corrections
//  * @desc    Get pending attendance correction requests
//  * @access  Manager, HR, Admin, Super Admin
//  */
// router.get('/pending-corrections', 
//   authorize(['manager', 'hr', 'admin', 'super_admin']), 
//   attendanceController.getPendingCorrections
// );

// /**
//  * @route   PUT /api/v1/attendance/correction-request/:requestId/approve
//  * @desc    Approve attendance correction request
//  * @access  Manager, HR, Admin, Super Admin
//  */
// router.put('/correction-request/:requestId/approve', 
//   authorize(['manager', 'hr', 'admin', 'super_admin']), 
//   attendanceController.approveCorrection
// );

// /**
//  * @route   PUT /api/v1/attendance/correction-request/:requestId/reject
//  * @desc    Reject attendance correction request
//  * @access  Manager, HR, Admin, Super Admin
//  */
// router.put('/correction-request/:requestId/reject', 
//   authorize(['manager', 'hr', 'admin', 'super_admin']), 
//   attendanceController.rejectCorrection
// );

// // ==================== HOLIDAYS ====================

// /**
//  * @route   GET /api/v1/attendance/holidays
//  * @desc    Get list of holidays
//  * @access  Private (All authenticated users)
//  */
// router.get('/holidays', 
//   protect, 
//   attendanceController.getHolidays
// );

// /**
//  * @route   POST /api/v1/attendance/holidays
//  * @desc    Create a new holiday
//  * @access  Admin, HR, Super Admin
//  */
// router.post('/holidays', 
//   authorize(['admin', 'hr', 'super_admin']), 
//   attendanceController.createHoliday
// );

// /**
//  * @route   PUT /api/v1/attendance/holidays/:holidayId
//  * @desc    Update an existing holiday
//  * @access  Admin, HR, Super Admin
//  */
// router.put('/holidays/:holidayId', 
//   authorize(['admin', 'hr', 'super_admin']), 
//   attendanceController.updateHoliday
// );

// /**
//  * @route   DELETE /api/v1/attendance/holidays/:holidayId
//  * @desc    Delete a holiday
//  * @access  Admin, HR, Super Admin
//  */
// router.delete('/holidays/:holidayId', 
//   authorize(['admin', 'hr', 'super_admin']), 
//   attendanceController.deleteHoliday
// );

// // ==================== DASHBOARD ====================

// /**
//  * @route   GET /api/v1/attendance/dashboard-stats
//  * @desc    Get attendance statistics for dashboard
//  * @access  Admin, HR, Manager, Super Admin
//  */
// router.get('/dashboard-stats', 
//   authorize(['admin', 'hr', 'manager', 'super_admin']), 
//   attendanceController.getDashboardStats
// );

// /**
//  * @route   GET /api/v1/attendance/today-summary
//  * @desc    Get today's attendance summary
//  * @access  Private (All authenticated users)
//  */
// router.get('/today-summary', 
//   protect, 
//   attendanceController.getTodaySummary
// );

// // ==================== USER ATTENDANCE (Admin) ====================

// /**
//  * @route   GET /api/v1/attendance/user/:userId
//  * @desc    Get attendance for a specific user (Admin only)
//  * @access  Admin, Super Admin, HR
//  */
// router.get('/user/:userId', 
//   authorize(['admin', 'super_admin', 'hr']), 
//   attendanceController.getUserAttendanceById
// );

// module.exports = router;





// server/src/routes/v1/attendance.routes.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../../controllers/attendance.controller');
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

// All routes require authentication
router.use(protect);

// ==================== EMPLOYEE SELF ====================

/**
 * @route   POST /api/v1/attendance/check-in
 * @desc    Employee check-in
 * @access  Private (All authenticated users)
 */
router.post('/check-in', attendanceController.checkIn);

/**
 * @route   POST /api/v1/attendance/check-out
 * @desc    Employee check-out
 * @access  Private (All authenticated users)
 */
router.post('/check-out', attendanceController.checkOut);

/**
 * @route   GET /api/v1/attendance/my
 * @desc    Get current user's attendance records
 * @access  Private (All authenticated users)
 */
router.get('/my', attendanceController.getMyAttendance);

// ==================== MANAGER/SUPERVISOR ====================

/**
 * @route   GET /api/v1/attendance/team
 * @desc    Get team attendance (Manager/Supervisor can view their team)
 * @access  Manager, Supervisor, Admin, Super Admin
 */
router.get('/team', 
  authorize(['manager', 'supervisor', 'admin', 'super_admin']), 
  attendanceController.getTeamAttendance
);

/**
 * @route   PUT /api/v1/attendance/:employeeId/mark
 * @desc    Mark attendance for an employee (Manager/HR)
 * @access  Manager, Supervisor, HR, Admin, Super Admin
 */
router.put('/:employeeId/mark', 
  authorize(['manager', 'supervisor', 'hr', 'admin', 'super_admin']), 
  attendanceController.markAttendance
);

// ==================== ADMIN/HR ====================

/**
 * @route   GET /api/v1/attendance/all
 * @desc    Get all employees attendance (Admin/HR)
 * @access  Admin, HR, Super Admin
 */
router.get('/all', 
  authorize(['admin', 'hr', 'super_admin']), 
  attendanceController.getAllAttendance
);

/**
 * @route   GET /api/v1/attendance/absent
 * @desc    Get list of absent employees
 * @access  Admin, HR, Super Admin, Manager
 */
router.get('/absent', 
  authorize(['admin', 'hr', 'super_admin', 'manager']), 
  attendanceController.getAbsentEmployees
);

/**
 * @route   GET /api/v1/attendance/late
 * @desc    Get list of late employees
 * @access  Admin, HR, Super Admin, Manager
 */
router.get('/late', 
  authorize(['admin', 'hr', 'super_admin', 'manager']), 
  attendanceController.getLateEmployees
);

/**
 * @route   GET /api/v1/attendance/report
 * @desc    Generate attendance report
 * @access  Admin, HR, Manager, Super Admin
 */
router.get('/report', 
  authorize(['admin', 'hr', 'manager', 'super_admin']), 
  attendanceController.getAttendanceReport
);

/**
 * @route   GET /api/v1/attendance/export
 * @desc    Export attendance data
 * @access  Admin, HR, Super Admin
 */
router.get('/export', 
  authorize(['admin', 'hr', 'super_admin']), 
  attendanceController.exportAttendance
);

/**
 * @route   GET /api/v1/attendance/summary
 * @desc    Get monthly attendance summary
 * @access  Private (All authenticated users)
 */
router.get('/summary', 
  protect, 
  attendanceController.getMonthlySummary
);

/**
 * @route   GET /api/v1/attendance/department-stats
 * @desc    Get attendance statistics by department
 * @access  Admin, HR, Super Admin, Manager
 */
router.get('/department-stats', 
  authorize(['admin', 'hr', 'super_admin', 'manager']), 
  attendanceController.getDepartmentStats
);

// ==================== CORRECTION REQUESTS ====================

/**
 * @route   POST /api/v1/attendance/correction-request
 * @desc    Request attendance correction
 * @access  Private (All authenticated users)
 */
router.post('/correction-request', 
  protect, 
  attendanceController.requestCorrection
);

/**
 * 🔴 NEW: @route   GET /api/v1/attendance/my-correction-requests
 * @desc    Get current user's correction requests
 * @access  Private (All authenticated users)
 */
router.get('/my-correction-requests', 
  protect, 
  attendanceController.getMyCorrectionRequests
);

/**
 * @route   GET /api/v1/attendance/pending-corrections
 * @desc    Get pending attendance correction requests
 * @access  Manager, HR, Admin, Super Admin
 */
router.get('/pending-corrections', 
  authorize(['manager', 'hr', 'admin', 'super_admin']), 
  attendanceController.getPendingCorrections
);

/**
 * 🔴 NEW: @route   GET /api/v1/attendance/correction-requests
 * @desc    Get all correction requests (Admin)
 * @access  Admin, Super Admin
 */
router.get('/correction-requests', 
  authorize(['admin', 'super_admin']), 
  attendanceController.getAllCorrectionRequests
);

/**
 * 🔴 NEW: @route   GET /api/v1/attendance/correction-request/:requestId
 * @desc    Get correction request by ID
 * @access  Private (User can view their own, Admin can view all)
 */
router.get('/correction-request/:requestId', 
  protect, 
  attendanceController.getCorrectionRequestById
);

/**
 * @route   PUT /api/v1/attendance/correction-request/:requestId/approve
 * @desc    Approve attendance correction request
 * @access  Manager, HR, Admin, Super Admin
 */
router.put('/correction-request/:requestId/approve', 
  authorize(['manager', 'hr', 'admin', 'super_admin']), 
  attendanceController.approveCorrection
);

/**
 * @route   PUT /api/v1/attendance/correction-request/:requestId/reject
 * @desc    Reject attendance correction request
 * @access  Manager, HR, Admin, Super Admin
 */
router.put('/correction-request/:requestId/reject', 
  authorize(['manager', 'hr', 'admin', 'super_admin']), 
  attendanceController.rejectCorrection
);

// ==================== HOLIDAYS ====================

/**
 * @route   GET /api/v1/attendance/holidays
 * @desc    Get list of holidays
 * @access  Private (All authenticated users)
 */
router.get('/holidays', 
  protect, 
  attendanceController.getHolidays
);

/**
 * @route   POST /api/v1/attendance/holidays
 * @desc    Create a new holiday
 * @access  Admin, HR, Super Admin
 */
router.post('/holidays', 
  authorize(['admin', 'hr', 'super_admin']), 
  attendanceController.createHoliday
);

/**
 * @route   PUT /api/v1/attendance/holidays/:holidayId
 * @desc    Update an existing holiday
 * @access  Admin, HR, Super Admin
 */
router.put('/holidays/:holidayId', 
  authorize(['admin', 'hr', 'super_admin']), 
  attendanceController.updateHoliday
);

/**
 * @route   DELETE /api/v1/attendance/holidays/:holidayId
 * @desc    Delete a holiday
 * @access  Admin, HR, Super Admin
 */
router.delete('/holidays/:holidayId', 
  authorize(['admin', 'hr', 'super_admin']), 
  attendanceController.deleteHoliday
);

// ==================== DASHBOARD ====================

/**
 * @route   GET /api/v1/attendance/dashboard-stats
 * @desc    Get attendance statistics for dashboard
 * @access  Admin, HR, Manager, Super Admin
 */
router.get('/dashboard-stats', 
  authorize(['admin', 'hr', 'manager', 'super_admin']), 
  attendanceController.getDashboardStats
);

/**
 * @route   GET /api/v1/attendance/today-summary
 * @desc    Get today's attendance summary
 * @access  Private (All authenticated users)
 */
router.get('/today-summary', 
  protect, 
  attendanceController.getTodaySummary
);

// ==================== USER ATTENDANCE (Admin) ====================

/**
 * @route   GET /api/v1/attendance/user/:userId
 * @desc    Get attendance for a specific user (Admin only)
 * @access  Admin, Super Admin, HR
 */
router.get('/user/:userId', 
  authorize(['admin', 'super_admin', 'hr']), 
  attendanceController.getUserAttendanceById
);

module.exports = router;