// // server/src/routes/leave.routes.js
// const express = require('express');
// const router = express.Router();
// const leaveController = require('../controllers/leave.controller');
// const { protect } = require('../middleware/auth.middleware');
// const { authorize } = require('../middleware/role.middleware');

// router.use(protect);

// // Employee endpoints
// router.post('/apply', leaveController.applyLeave);
// router.get('/my', leaveController.getMyLeaves);
// router.get('/balance', leaveController.getMyLeaveBalance);
// router.put('/:id/cancel', leaveController.cancelLeave);

// // Approver endpoints
// router.get('/pending', authorize(['supervisor', 'manager', 'hr', 'admin', 'super_admin']), leaveController.getPendingApprovals);
// router.put('/:id/approve', authorize(['supervisor', 'manager', 'hr', 'admin', 'super_admin']), leaveController.approveLeave);
// router.put('/:id/reject', authorize(['supervisor', 'manager', 'hr', 'admin', 'super_admin']), leaveController.rejectLeave);

// // Team calendar (Manager/Supervisor)
// router.get('/team-calendar', authorize(['supervisor', 'manager']), leaveController.getTeamLeaveCalendar);

// module.exports = router;


// server/src/routes/v1/leave.routes.js
// const express = require('express');
// const router = express.Router();
// const leaveController = require('../../controllers/leave.controller');
// const { protect } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');

// router.use(protect);

// // Employee endpoints
// router.post('/apply', leaveController.applyLeave);
// router.get('/my', leaveController.getMyLeaves);
// router.get('/balance', leaveController.getMyLeaveBalance);
// router.put('/:id/cancel', leaveController.cancelLeave);

// // Approver endpoints
// router.get('/pending', authorize(['supervisor', 'manager', 'hr', 'admin', 'super_admin']), leaveController.getPendingApprovals);
// router.put('/:id/approve', authorize(['supervisor', 'manager', 'hr', 'admin', 'super_admin']), leaveController.approveLeave);
// router.put('/:id/reject', authorize(['supervisor', 'manager', 'hr', 'admin', 'super_admin']), leaveController.rejectLeave);

// // Team calendar (Manager/Supervisor)
// router.get('/team-calendar', authorize(['supervisor', 'manager']), leaveController.getTeamLeaveCalendar);

// // Leave stats for dashboard
// router.get('/stats', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
//   try {
//     const Leave = require('../../models/Leave.model');
//     const pending = await Leave.countDocuments({ status: 'pending' });
//     const approved = await Leave.countDocuments({ status: 'approved' });
//     const rejected = await Leave.countDocuments({ status: 'rejected' });
    
//     res.json({ success: true, data: { pending, approved, rejected } });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;


// // server/src/routes/leave.routes.js
// const express = require('express');
// const router = express.Router();
// //const leaveController = require('./controllers/leave.controller');
// const leaveController = require('../../controllers/leave.controller');
// const { protect } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');

// router.use(protect);

// // Employee endpoints
// router.post('/apply', leaveController.applyLeave);
// router.get('/my', leaveController.getMyLeaves);
// router.get('/balance', leaveController.getMyLeaveBalance);
// router.put('/:id/cancel', leaveController.cancelLeave);

// // Approver endpoints
// router.get('/pending', authorize(['supervisor', 'manager', 'hr', 'admin', 'super_admin']), leaveController.getPendingApprovals);
// router.put('/:id/approve', authorize(['supervisor', 'manager', 'hr', 'admin', 'super_admin']), leaveController.approveLeave);
// router.put('/:id/reject', authorize(['supervisor', 'manager', 'hr', 'admin', 'super_admin']), leaveController.rejectLeave);

// // Team calendar
// router.get('/team-calendar', authorize(['supervisor', 'manager']), leaveController.getTeamLeaveCalendar);

// // Leave stats
// router.get('/stats', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
//   try {
//     const Leave = require('../../models/Leave.model');
//     const pending = await Leave.countDocuments({ status: 'pending' });
//     const approved = await Leave.countDocuments({ status: 'approved' });
//     const rejected = await Leave.countDocuments({ status: 'rejected' });
//     res.json({ success: true, data: { pending, approved, rejected } });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;



// server/src/routes/v1/leave.routes.js
const express = require('express');
const router = express.Router();
const leaveController = require('../../controllers/leave.controller');
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

// All routes require authentication
router.use(protect);

// ==================== EMPLOYEE ENDPOINTS ====================

// Apply for leave
router.post('/apply', leaveController.applyLeave);

// Get my leaves
router.get('/my', leaveController.getMyLeaves);

// Get my leave balance
router.get('/balance', leaveController.getMyLeaveBalance);

// Cancel leave request
router.put('/:id/cancel', leaveController.cancelLeave);

// Update leave request (employee)
router.put('/:id', leaveController.updateLeaveRequest);

// Delete leave request (employee)
router.delete('/:id', leaveController.deleteLeaveRequest);

// ==================== APPROVER ENDPOINTS ====================

// Get pending approvals (Supervisor, Manager, HR, Admin)
router.get('/pending', authorize(['supervisor', 'manager', 'hr', 'admin', 'super_admin']), leaveController.getPendingApprovals);

// Approve leave
router.put('/:id/approve', authorize(['supervisor', 'manager', 'hr', 'admin', 'super_admin']), leaveController.approveLeave);

// Reject leave
router.put('/:id/reject', authorize(['supervisor', 'manager', 'hr', 'admin', 'super_admin']), leaveController.rejectLeave);

// ==================== TEAM & CALENDAR ENDPOINTS ====================

// Team leave calendar (Manager/Supervisor)
router.get('/team-calendar', authorize(['supervisor', 'manager']), leaveController.getTeamLeaveCalendar);

// Company leave calendar (all holidays and leaves)
router.get('/company-calendar', protect, leaveController.getCompanyLeaveCalendar);

// Team leave summary (Manager/Supervisor)
router.get('/team-summary', authorize(['supervisor', 'manager']), leaveController.getTeamLeaveSummary);

// ==================== LEAVE STATISTICS ENDPOINTS ====================

// Leave statistics (Admin/HR/Super Admin)
router.get('/stats', authorize(['admin', 'hr', 'super_admin']), leaveController.getLeaveStats);

// Dashboard leave statistics
router.get('/dashboard-stats', authorize(['admin', 'hr', 'super_admin']), leaveController.getDashboardLeaveStats);

// Leave summary by department
router.get('/summary/department', authorize(['admin', 'hr', 'super_admin']), leaveController.getLeaveSummaryByDepartment);

// Leave summary by month
router.get('/summary/month', authorize(['admin', 'hr', 'super_admin']), leaveController.getLeaveSummaryByMonth);

// ==================== LEAVE TYPES & POLICY ENDPOINTS ====================

// Get leave types
router.get('/types', protect, leaveController.getLeaveTypes);

// Get leave policy
router.get('/policy', protect, leaveController.getLeavePolicy);

// Update leave policy (Admin only)
router.put('/policy', authorize(['admin', 'super_admin']), leaveController.updateLeavePolicy);

// ==================== LEAVE ENTITLEMENT ENDPOINTS ====================

// Get user leave entitlement
router.get('/entitlement/:userId', authorize(['admin', 'hr', 'super_admin']), leaveController.getLeaveEntitlement);

// Update leave entitlement (Admin only)
router.put('/entitlement/:userId', authorize(['admin', 'super_admin']), leaveController.updateLeaveEntitlement);

// Bulk update leave entitlement (Admin only)
router.post('/entitlement/bulk', authorize(['admin', 'super_admin']), leaveController.bulkUpdateLeaveEntitlement);

// ==================== LEAVE REPORTING ENDPOINTS ====================

// Export leave report (Admin only)
router.get('/export', authorize(['admin', 'super_admin']), leaveController.exportLeaveReport);

// Leave analytics (Admin only)
router.get('/analytics', authorize(['admin', 'super_admin']), leaveController.getLeaveAnalytics);

// ==================== ADMIN ENDPOINTS ====================

// Get all leave requests (Admin)
router.get('/all', authorize(['admin', 'super_admin']), leaveController.getAllLeaveRequests);

// Get leave request by ID
router.get('/:id', protect, leaveController.getLeaveRequestById);

// Get user leave balance (Admin)
router.get('/balance/:userId', authorize(['admin', 'hr', 'super_admin']), leaveController.getUserLeaveBalance);

// ==================== BULK OPERATIONS ====================

// Bulk approve leaves (Admin only)
router.post('/bulk/approve', authorize(['admin', 'super_admin']), leaveController.bulkApproveLeaves);

// Bulk reject leaves (Admin only)
router.post('/bulk/reject', authorize(['admin', 'super_admin']), leaveController.bulkRejectLeaves);

module.exports = router;