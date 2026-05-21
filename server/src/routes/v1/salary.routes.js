// // server/src/routes/v1/salary.routes.js
// const express = require('express');
// const router = express.Router();
// const { protect } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');

// // All routes require authentication
// router.use(protect);

// // ==================== EMPLOYEE SELF ====================
// // Get my salary details
// router.get('/my', async (req, res) => {
//   try {
//     res.json({ 
//       success: true, 
//       data: {
//         basic: 5000,
//         allowances: 2000,
//         deductions: 500,
//         netSalary: 6500
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get my salary slips
// router.get('/my-slips', async (req, res) => {
//   try {
//     res.json({ 
//       success: true, 
//       data: [
//         { month: 'January', year: 2024, amount: 6500, status: 'paid' },
//         { month: 'February', year: 2024, amount: 6500, status: 'paid' }
//       ]
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Download salary slip
// router.get('/slip/:id/download', async (req, res) => {
//   try {
//     res.json({ success: true, message: 'Salary slip downloaded' });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== MANAGER VIEW ====================
// // Get team salary
// router.get('/team', authorize(['manager']), async (req, res) => {
//   try {
//     res.json({ success: true, data: [] });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== ADMIN/HR ====================
// // Get all salaries
// router.get('/all', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
//   try {
//     res.json({ success: true, data: [] });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Update salary structure
// router.put('/structure/:employeeId', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
//   try {
//     res.json({ success: true, message: 'Salary structure updated' });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;





// server/src/routes/v1/salary.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const salaryController = require('../../controllers/salary.controller');

// All routes require authentication
router.use(protect);

// ==================== EMPLOYEE SELF ROUTES ====================
// These routes are accessible by all authenticated employees

/**
 * GET /api/v1/salary/my
 * Get current employee's salary details for current or specified month/year
 * Query params: month (1-12), year (YYYY)
 */
router.get('/my', salaryController.getMySalary);

/**
 * GET /api/v1/salary/history
 * Get salary history for current employee
 * Query params: year, page, limit
 */
router.get('/history', salaryController.getMySalaryHistory);

/**
 * GET /api/v1/salary/slip/:year/:month
 * Get salary slip for specific year and month
 */
router.get('/slip/:year/:month', salaryController.getSalarySlip);

/**
 * GET /api/v1/salary/slip/:id/download
 * Download salary slip as PDF
 */
router.get('/slip/:id/download', salaryController.downloadSalarySlip);

/**
 * GET /api/v1/salary/my-slips
 * Get all salary slips for current employee
 * Query params: year (optional)
 */
router.get('/my-slips', salaryController.getMySalarySlips);

/**
 * GET /api/v1/salary/my-summary
 * Get yearly salary summary
 * Query params: year
 */
router.get('/my-summary', salaryController.getMySalarySummary);

/**
 * GET /api/v1/salary/structure
 * Get current employee's salary structure
 */
router.get('/structure', salaryController.getSalaryStructure);

// ==================== MANAGER ROUTES ====================
// These routes are accessible by managers to view team members

/**
 * GET /api/v1/salary/team
 * Get team salary details (Manager only)
 * Query params: month, year, department
 */
router.get('/team', authorize(['manager', 'admin', 'hr', 'super_admin']), salaryController.getTeamSalary);

// ==================== ADMIN/HR ROUTES ====================
// These routes require admin, hr, or super_admin roles

/**
 * GET /api/v1/salary/all
 * Get all employees salary data (Admin/HR only)
 * Query params: month, year, department, country, page, limit
 */
router.get('/all', authorize(['admin', 'hr', 'super_admin']), salaryController.getAllSalaries);

/**
 * GET /api/v1/salary/employees
 * Get employees for payroll processing (Admin/HR only)
 * Query params: month, year, department, country
 */
router.get('/employees', authorize(['admin', 'hr', 'super_admin']), salaryController.getEmployeesForPayroll);

/**
 * GET /api/v1/salary/employee/:employeeId
 * Get specific employee's salary details (Admin/HR only)
 * Query params: month, year
 */
router.get('/employee/:employeeId', authorize(['admin', 'hr', 'super_admin']), salaryController.getEmployeeSalary);

/**
 * GET /api/v1/salary/structure/:employeeId
 * Get salary structure for specific employee (Admin/HR only)
 */
router.get('/structure/:employeeId', authorize(['admin', 'hr', 'super_admin']), salaryController.getSalaryStructure);

/**
 * PUT /api/v1/salary/structure/:employeeId
 * Update salary structure for specific employee (Admin/HR only)
 */
router.put('/structure/:employeeId', authorize(['admin', 'hr', 'super_admin']), salaryController.updateSalaryStructure);

/**
 * POST /api/v1/salary/bulk-update
 * Bulk update salary structures for multiple employees (Admin/HR only)
 */
router.post('/bulk-update', authorize(['admin', 'hr', 'super_admin']), salaryController.bulkUpdateSalaryStructures);

// ==================== PAYROLL PROCESSING ROUTES ====================
// These routes handle payroll calculation and processing

/**
 * GET /api/v1/salary/payroll/dashboard
 * Get payroll dashboard statistics
 * Query params: month, year
 */
router.get('/payroll/dashboard', authorize(['admin', 'hr', 'super_admin']), salaryController.getPayrollDashboard);

/**
 * GET /api/v1/salary/payroll/summary
 * Get payroll summary for month/year
 * Query params: month, year
 */
router.get('/payroll/summary', authorize(['admin', 'hr', 'super_admin']), salaryController.getPayrollSummary);

/**
 * GET /api/v1/salary/payroll/statistics
 * Get payroll statistics for year
 * Query params: year
 */
router.get('/payroll/statistics', authorize(['admin', 'hr', 'super_admin']), salaryController.getPayrollStatistics);

/**
 * GET /api/v1/salary/payroll/report
 * Get payroll report
 * Query params: month, year, reportType
 */
router.get('/payroll/report', authorize(['admin', 'hr', 'super_admin']), salaryController.getPayrollReport);

/**
 * GET /api/v1/salary/payroll/export
 * Export payroll report as CSV/Excel
 * Query params: month, year, format
 */
router.get('/payroll/export', authorize(['admin', 'hr', 'super_admin']), salaryController.exportPayrollReport);

/**
 * POST /api/v1/salary/payroll/preview
 * Preview payroll before processing
 * Body: { employeeIds, month, year }
 */
router.post('/payroll/preview', authorize(['admin', 'hr', 'super_admin']), salaryController.previewPayroll);

/**
 * POST /api/v1/salary/payroll/process
 * Process payroll for all eligible employees
 * Body: { month, year }
 */
router.post('/payroll/process', authorize(['admin', 'hr', 'super_admin']), salaryController.processPayroll);

/**
 * POST /api/v1/salary/payroll/process-selected
 * Process payroll for selected employees
 * Body: { month, year, employeeIds }
 */
router.post('/payroll/process-selected', authorize(['admin', 'hr', 'super_admin']), salaryController.processSelectedPayroll);

/**
 * POST /api/v1/salary/payroll/approve
 * Approve processed payroll
 * Body: { month, year, notes }
 */
router.post('/payroll/approve', authorize(['admin', 'hr', 'super_admin']), salaryController.approvePayroll);

/**
 * POST /api/v1/salary/payroll/reject
 * Reject payroll
 * Body: { month, year, reason }
 */
router.post('/payroll/reject', authorize(['admin', 'hr', 'super_admin']), salaryController.rejectPayroll);

// ==================== PAYROLL SETTINGS ROUTES ====================

/**
 * GET /api/v1/salary/payroll/settings
 * Get payroll settings
 */
router.get('/payroll/settings', authorize(['admin', 'hr', 'super_admin']), salaryController.getPayrollSettings);

/**
 * PUT /api/v1/salary/payroll/settings
 * Update payroll settings
 * Body: settings object
 */
router.put('/payroll/settings', authorize(['admin', 'hr', 'super_admin']), salaryController.updatePayrollSettings);

/**
 * POST /api/v1/salary/payroll/settings/reset
 * Reset payroll settings to default
 */
router.post('/payroll/settings/reset', authorize(['admin', 'hr', 'super_admin']), salaryController.resetPayrollSettings);

/**
 * POST /api/v1/salary/payroll/bank/test
 * Test bank connection
 * Body: bankDetails
 */
router.post('/payroll/bank/test', authorize(['admin', 'hr', 'super_admin']), salaryController.testBankConnection);

// ==================== SALARY SLIP ROUTES ====================

/**
 * POST /api/v1/salary/slip/:id/email
 * Email salary slip to employee
 */
router.post('/slip/:id/email', salaryController.emailSalarySlip);

/**
 * POST /api/v1/salary/slips/send
 * Send salary slips to employees
 * Body: { month, year, employeeIds, sendEmail, sendSMS }
 */
router.post('/slips/send', authorize(['admin', 'hr', 'super_admin']), salaryController.sendSalarySlips);

/**
 * POST /api/v1/salary/slips/bulk-download
 * Download multiple salary slips as zip
 * Body: { month, year, employeeIds }
 */
router.post('/slips/bulk-download', authorize(['admin', 'hr', 'super_admin']), salaryController.bulkDownloadSlips);

// ==================== DEPARTMENT & COUNTRY SUMMARY ====================

/**
 * GET /api/v1/salary/department-summary
 * Get department-wise payroll summary
 * Query params: month, year
 */
router.get('/department-summary', authorize(['admin', 'hr', 'super_admin']), salaryController.getDepartmentSummary);

/**
 * GET /api/v1/salary/country-summary
 * Get country-wise payroll summary
 * Query params: month, year
 */
router.get('/country-summary', authorize(['admin', 'hr', 'super_admin']), salaryController.getCountrySummary);

module.exports = router;



// Summary of Added Routes:
// Category  Method  Route Purpose
// Employee Self GET /my Get my salary
// GET /history  Get salary history
// GET /slip/:year/:month  Get salary slip
// GET /my-slips Get all my slips
// GET /my-summary Get yearly summary
// GET /structure  Get my salary structure
// POST  /slip/:id/email Email salary slip
// Manager GET /team Get team salaries
// Admin/HR  GET /all  Get all salaries
// GET /employees  Get employees for payroll
// GET /employee/:employeeId Get employee salary
// GET /structure/:employeeId  Get employee structure
// PUT /structure/:employeeId  Update structure
// POST  /bulk-update  Bulk update structures
// Payroll Processing  GET /payroll/dashboard  Dashboard stats
// GET /payroll/summary  Monthly summary
// GET /payroll/statistics Yearly statistics
// GET /payroll/report Payroll report
// GET /payroll/export Export report
// POST  /payroll/preview  Preview payroll
// POST  /payroll/process  Process all
// POST  /payroll/process-selected Process selected
// POST  /payroll/approve  Approve payroll
// POST  /payroll/reject Reject payroll
// Payroll Settings  GET /payroll/settings Get settings
// PUT /payroll/settings Update settings
// POST  /payroll/settings/reset Reset settings
// POST  /payroll/bank/test  Test bank connection
// Bulk Operations POST  /slips/send Send slips to employees
// POST  /slips/bulk-download  Bulk download slips
// Summaries GET /department-summary Department summary
// GET /country-summary  Country summary
// Key Changes Made:
// Removed mock responses - All routes now use real controller functions

// Added salaryController import - Properly imports all controller methods

// Added missing routes - History, employees, payroll processing, settings

// Proper authorization - Role-based access control for admin/HR routes

// Documentation - Added JSDoc comments for each route

// Consistent naming - RESTful API conventions

// Now backend has all the necessary endpoints for complete salary and payroll functionality!


