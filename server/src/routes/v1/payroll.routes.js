// server/src/routes/v1/payroll.routes.js
const express = require('express');
const router = express.Router();
const payrollController = require('../../controllers/payroll.controller');
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

// All routes require authentication
router.use(protect);

// ==================== PAYROLL DASHBOARD ====================

// Get payroll dashboard data
router.get('/dashboard', authorize(['admin', 'hr', 'super_admin']), payrollController.getPayrollDashboard);

// Get payroll summary
router.get('/summary', authorize(['admin', 'hr', 'super_admin']), payrollController.getPayrollSummary);

// ==================== EMPLOYEES FOR PAYROLL ====================

// Get employees for payroll processing
router.get('/employees', authorize(['admin', 'hr', 'super_admin']), payrollController.getEmployeesForPayroll);

// ==================== PAYROLL PROCESSING ====================

// Preview payroll before processing
router.post('/preview', authorize(['admin', 'hr', 'super_admin']), payrollController.previewPayroll);

// Process payroll for all employees
router.post('/process', authorize(['admin', 'hr', 'super_admin']), payrollController.processPayroll);

// Process selected employees payroll
router.post('/process-selected', authorize(['admin', 'hr', 'super_admin']), payrollController.processSelectedPayroll);

// Process single employee payroll
router.post('/process/:employeeId', authorize(['admin', 'hr', 'super_admin']), payrollController.processSinglePayroll);

// ==================== PAYROLL APPROVAL ====================

// Approve payroll
router.post('/approve', authorize(['admin', 'hr', 'super_admin']), payrollController.approvePayroll);

// Reject payroll
router.post('/reject', authorize(['admin', 'hr', 'super_admin']), payrollController.rejectPayroll);

// ==================== PAYROLL REPORTS ====================

// Get payroll report
router.get('/report', authorize(['admin', 'hr', 'super_admin']), payrollController.getPayrollReport);

// Export payroll report
router.get('/export', authorize(['admin', 'hr', 'super_admin']), payrollController.exportPayrollReport);

// Export bank transfer file (WPS format)
router.get('/bank-export', authorize(['admin', 'hr', 'super_admin']), payrollController.exportBankFile);

// ==================== PAYROLL HISTORY ====================

// Get payroll history
router.get('/history', authorize(['admin', 'hr', 'super_admin']), payrollController.getPayrollHistory);

// Get payroll by ID
router.get('/:payrollId', authorize(['admin', 'hr', 'super_admin']), payrollController.getPayrollById);

// Cancel payroll
router.post('/:payrollId/cancel', authorize(['admin', 'hr', 'super_admin']), payrollController.cancelPayroll);

// ==================== PAYROLL SETTINGS ====================

// Get payroll settings
router.get('/settings', authorize(['admin', 'hr', 'super_admin']), payrollController.getPayrollSettings);

// Update payroll settings
router.put('/settings', authorize(['admin', 'hr', 'super_admin']), payrollController.updatePayrollSettings);

// ==================== SALARY SLIPS ====================

// Send salary slips to employees
router.post('/send-slips', authorize(['admin', 'hr', 'super_admin']), payrollController.sendSalarySlips);

// Download multiple salary slips as zip
router.post('/bulk-slips', authorize(['admin', 'hr', 'super_admin']), payrollController.bulkDownloadSlips);

// ==================== PAYROLL STATISTICS ====================

// Get payroll statistics
router.get('/statistics', authorize(['admin', 'hr', 'super_admin']), payrollController.getPayrollStatistics);

// Get department-wise payroll summary
router.get('/department-summary', authorize(['admin', 'hr', 'super_admin']), payrollController.getDepartmentSummary);

// Get country-wise payroll summary
router.get('/country-summary', authorize(['admin', 'hr', 'super_admin']), payrollController.getCountrySummary);

module.exports = router;