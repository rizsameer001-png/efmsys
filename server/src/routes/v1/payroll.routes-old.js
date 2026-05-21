// server/src/routes/v1/payroll.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

// All routes require authentication
router.use(protect);

// ==================== PAYROLL DASHBOARD ====================

// Get payroll dashboard data
router.get('/dashboard', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    res.json({ 
      success: true, 
      data: {
        summary: {
          totalPayroll: 125000,
          averageSalary: 4500,
          pendingPayments: 5,
          processedCount: 120,
          pendingCount: 8,
          thisMonthTotal: 145000,
          lastMonthTotal: 138000,
          growth: 5.1
        },
        byDepartment: [
          { department: 'Operations', total: 45000, employeeCount: 10 },
          { department: 'Technical', total: 35000, employeeCount: 8 },
          { department: 'Housekeeping', total: 25000, employeeCount: 12 },
          { department: 'Management', total: 40000, employeeCount: 5 }
        ],
        recentProcessed: [
          { month: 'January', year: 2024, total: 138000, status: 'paid', processedAt: '2024-01-28' },
          { month: 'December', year: 2023, total: 132000, status: 'paid', processedAt: '2023-12-28' }
        ]
      }
    });
  } catch (error) {
    console.error('Get payroll dashboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get payroll summary
router.get('/summary', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { month, year } = req.query;
    res.json({ 
      success: true, 
      data: {
        month: parseInt(month) || new Date().getMonth() + 1,
        year: parseInt(year) || new Date().getFullYear(),
        totalEmployees: 35,
        totalPayroll: 145000,
        averageSalary: 4142,
        totalDeductions: 12500,
        netPayroll: 132500
      }
    });
  } catch (error) {
    console.error('Get payroll summary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== EMPLOYEES FOR PAYROLL ====================

// Get employees for payroll processing
router.get('/employees', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { month, year, department } = req.query;
    res.json({ 
      success: true, 
      data: [
        { 
          id: '1', 
          name: 'John Doe', 
          employeeId: 'EMP001',
          department: 'Operations',
          basicSalary: 5000,
          allowances: 2000,
          deductions: 500,
          netSalary: 6500,
          bankDetails: { accountName: 'John Doe', accountNumber: '1234567890', bankName: 'CBD' }
        },
        { 
          id: '2', 
          name: 'Jane Smith', 
          employeeId: 'EMP002',
          department: 'Technical',
          basicSalary: 6000,
          allowances: 2500,
          deductions: 600,
          netSalary: 7900,
          bankDetails: { accountName: 'Jane Smith', accountNumber: '0987654321', bankName: 'ENBD' }
        }
      ]
    });
  } catch (error) {
    console.error('Get employees for payroll error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PAYROLL PROCESSING ====================

// Process payroll for all employees
router.post('/process', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { month, year, options } = req.body;
    res.json({ 
      success: true, 
      message: `Payroll for ${month}/${year} processed successfully`,
      data: { processedCount: 35, totalAmount: 145000 }
    });
  } catch (error) {
    console.error('Process payroll error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Process selected employees payroll
router.post('/process-selected', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { month, year, employeeIds, options } = req.body;
    res.json({ 
      success: true, 
      message: `Payroll processed for ${employeeIds?.length || 0} employees`,
      data: { processedCount: employeeIds?.length || 0 }
    });
  } catch (error) {
    console.error('Process selected payroll error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Process single employee payroll
router.post('/process/:employeeId', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year, adjustments } = req.body;
    res.json({ 
      success: true, 
      message: `Payroll processed for employee ${employeeId}`,
      data: { employeeId, month, year }
    });
  } catch (error) {
    console.error('Process single payroll error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PAYROLL APPROVAL ====================

// Approve payroll
router.post('/approve', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { month, year, notes } = req.body;
    res.json({ success: true, message: `Payroll for ${month}/${year} approved` });
  } catch (error) {
    console.error('Approve payroll error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reject payroll
router.post('/reject', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { month, year, reason } = req.body;
    res.json({ success: true, message: `Payroll for ${month}/${year} rejected` });
  } catch (error) {
    console.error('Reject payroll error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PAYROLL REPORTS ====================

// Get payroll report
router.get('/report', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { month, year, reportType, department } = req.query;
    res.json({ 
      success: true, 
      data: {
        reportType: reportType || 'summary',
        month: parseInt(month) || new Date().getMonth() + 1,
        year: parseInt(year) || new Date().getFullYear(),
        department: department || 'all',
        records: [
          { employeeName: 'John Doe', basicSalary: 5000, allowances: 2000, deductions: 500, netSalary: 6500 },
          { employeeName: 'Jane Smith', basicSalary: 6000, allowances: 2500, deductions: 600, netSalary: 7900 }
        ]
      }
    });
  } catch (error) {
    console.error('Get payroll report error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export payroll report
router.get('/export', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { month, year, reportType, department, format = 'excel' } = req.query;
    
    if (format === 'csv') {
      const csvData = 'Employee Name,Basic Salary,Allowances,Deductions,Net Salary\nJohn Doe,5000,2000,500,6500\nJane Smith,6000,2500,600,7900';
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=payroll_report_${month}_${year}.csv`);
      return res.send(csvData);
    }
    
    res.json({ 
      success: true, 
      message: 'Report exported successfully',
      data: { format, month, year }
    });
  } catch (error) {
    console.error('Export payroll report error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export bank transfer file
router.get('/bank-export', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { month, year, format = 'wps' } = req.query;
    
    if (format === 'wps') {
      const wpsData = 'Employee Name,Account Number,Bank Name,Amount\nJohn Doe,1234567890,CBD,6500\nJane Smith,0987654321,ENBD,7900';
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=wps_${month}_${year}.csv`);
      return res.send(wpsData);
    }
    
    res.json({ success: true, message: 'Bank export file generated' });
  } catch (error) {
    console.error('Bank export error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PAYROLL HISTORY ====================

// Get payroll history
router.get('/history', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { year, page = 1, limit = 20 } = req.query;
    res.json({ 
      success: true, 
      data: [
        { month: 1, year: 2024, totalPayroll: 145000, status: 'paid', processedAt: '2024-01-28' },
        { month: 12, year: 2023, totalPayroll: 138000, status: 'paid', processedAt: '2023-12-28' },
        { month: 11, year: 2023, totalPayroll: 132000, status: 'paid', processedAt: '2023-11-28' }
      ],
      pagination: { page: 1, limit: 20, total: 3, pages: 1 }
    });
  } catch (error) {
    console.error('Get payroll history error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get payroll by ID
router.get('/:payrollId', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { payrollId } = req.params;
    res.json({ success: true, data: { id: payrollId, status: 'completed', total: 145000 } });
  } catch (error) {
    console.error('Get payroll by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cancel payroll
router.post('/:payrollId/cancel', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { payrollId } = req.params;
    const { reason } = req.body;
    res.json({ success: true, message: `Payroll ${payrollId} cancelled` });
  } catch (error) {
    console.error('Cancel payroll error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PAYROLL SETTINGS ====================

// Get payroll settings
router.get('/settings', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    res.json({ 
      success: true, 
      data: {
        payrollCycle: 'monthly',
        payrollDay: 25,
        currency: 'AED',
        autoProcess: false,
        defaultDeductions: { tax: 0, socialSecurity: 0, pension: 0 }
      }
    });
  } catch (error) {
    console.error('Get payroll settings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update payroll settings
router.put('/settings', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    res.json({ success: true, message: 'Payroll settings updated' });
  } catch (error) {
    console.error('Update payroll settings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== SALARY SLIPS ====================

// Send salary slips to employees
router.post('/send-slips', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { month, year, employeeIds, sendEmail = true, sendSMS = false } = req.body;
    res.json({ 
      success: true, 
      message: `Salary slips sent to ${employeeIds?.length || 'all'} employees`,
      data: { sentCount: employeeIds?.length || 35 }
    });
  } catch (error) {
    console.error('Send salary slips error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Download multiple salary slips as zip
router.post('/bulk-slips', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { month, year, employeeIds } = req.body;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=salary_slips_${month}_${year}.zip`);
    res.send('Mock ZIP content');
  } catch (error) {
    console.error('Bulk download error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PAYROLL STATISTICS ====================

// Get payroll statistics
router.get('/statistics', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { year } = req.query;
    res.json({ 
      success: true, 
      data: {
        year: parseInt(year) || new Date().getFullYear(),
        monthlyData: [
          { month: 1, total: 145000, employeeCount: 35 },
          { month: 2, total: 148000, employeeCount: 36 },
          { month: 3, total: 152000, employeeCount: 38 }
        ],
        averageSalary: 4200,
        totalGrowth: 8.5
      }
    });
  } catch (error) {
    console.error('Get payroll statistics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get department-wise payroll summary
router.get('/department-summary', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { month, year } = req.query;
    res.json({ 
      success: true, 
      data: [
        { department: 'Operations', totalPayroll: 45000, employeeCount: 10, averageSalary: 4500 },
        { department: 'Technical', totalPayroll: 35000, employeeCount: 8, averageSalary: 4375 },
        { department: 'Housekeeping', totalPayroll: 25000, employeeCount: 12, averageSalary: 2083 }
      ]
    });
  } catch (error) {
    console.error('Get department summary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get country-wise payroll summary
router.get('/country-summary', authorize(['admin', 'hr', 'super_admin']), async (req, res) => {
  try {
    const { month, year } = req.query;
    res.json({ 
      success: true, 
      data: [
        { country: 'UAE', totalPayroll: 85000, employeeCount: 20, averageSalary: 4250 },
        { country: 'USA', totalPayroll: 60000, employeeCount: 15, averageSalary: 4000 }
      ]
    });
  } catch (error) {
    console.error('Get country summary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;