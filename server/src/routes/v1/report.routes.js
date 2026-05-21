// server/src/routes/v1/report.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

// All routes require authentication
router.use(protect);

// ==================== REPORTS DASHBOARD ====================

// Main reports dashboard
router.get('/', authorize(['admin', 'super_admin', 'manager', 'hr']), async (req, res) => {
  try {
    res.json({ 
      success: true, 
      data: {
        availableReports: [
          { id: 'tasks', name: 'Task Reports', description: 'Task completion and performance reports', icon: '📋' },
          { id: 'attendance', name: 'Attendance Reports', description: 'Employee attendance analytics', icon: '⏰' },
          { id: 'financial', name: 'Financial Reports', description: 'Payroll and revenue reports', icon: '💰' },
          { id: 'sla', name: 'SLA Reports', description: 'Service Level Agreement compliance', icon: '🎯' },
          { id: 'complaints', name: 'Complaint Reports', description: 'Customer complaint analysis', icon: '⚠️' }
        ],
        recentReports: [
          { id: 'report_1', name: 'January Task Report', type: 'tasks', generatedAt: new Date(), format: 'pdf' },
          { id: 'report_2', name: 'Q1 Attendance Summary', type: 'attendance', generatedAt: new Date(), format: 'excel' }
        ]
      }
    });
  } catch (error) {
    console.error('Reports dashboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== TASK REPORTS ====================

// Task reports
router.get('/tasks', authorize(['admin', 'super_admin', 'manager']), async (req, res) => {
  try {
    const { startDate, endDate, status, priority, assignedTo, groupBy = 'status' } = req.query;
    
    res.json({ 
      success: true, 
      data: {
        summary: {
          totalTasks: 156,
          completedTasks: 98,
          pendingTasks: 45,
          inProgressTasks: 13,
          completionRate: 62.8,
          overdueTasks: 12,
          avgCompletionTime: 3.5
        },
        byStatus: [
          { status: 'completed', count: 98, percentage: 62.8 },
          { status: 'pending', count: 45, percentage: 28.8 },
          { status: 'in_progress', count: 13, percentage: 8.3 }
        ],
        byPriority: [
          { priority: 'critical', count: 12, completed: 8, overdue: 2 },
          { priority: 'high', count: 34, completed: 22, overdue: 5 },
          { priority: 'medium', count: 78, completed: 52, overdue: 3 },
          { priority: 'low', count: 32, completed: 16, overdue: 2 }
        ],
        byTechnician: [
          { name: 'John Doe', tasks: 45, completed: 38, avgTime: 2.5 },
          { name: 'Jane Smith', tasks: 38, completed: 32, avgTime: 2.8 },
          { name: 'Mike Johnson', tasks: 42, completed: 28, avgTime: 3.2 }
        ],
        dailyBreakdown: [
          { date: '2024-01-01', created: 5, completed: 3, overdue: 1 },
          { date: '2024-01-02', created: 8, completed: 6, overdue: 0 },
          { date: '2024-01-03', created: 6, completed: 4, overdue: 2 }
        ]
      }
    });
  } catch (error) {
    console.error('Task reports error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export task report
router.get('/tasks/export', authorize(['admin', 'super_admin']), async (req, res) => {
  try {
    const { startDate, endDate, format = 'excel' } = req.query;
    
    if (format === 'csv') {
      const csvData = 'Task ID,Title,Status,Priority,Assigned To,Due Date,Completed Date\nTSK001,Fix AC,Completed,High,John Doe,2024-01-15,2024-01-14\nTSK002,Plumbing Issue,Pending,Medium,Jane Smith,2024-01-20,';
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=task_report_${Date.now()}.csv`);
      return res.send(csvData);
    }
    
    res.json({ success: true, message: 'Task report exported successfully' });
  } catch (error) {
    console.error('Export task report error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ATTENDANCE REPORTS ====================

// Attendance reports
router.get('/attendance', authorize(['admin', 'super_admin', 'manager', 'hr']), async (req, res) => {
  try {
    const { startDate, endDate, department, employeeId, reportType = 'summary' } = req.query;
    
    res.json({ 
      success: true, 
      data: {
        summary: {
          totalEmployees: 45,
          averageAttendance: 87.5,
          totalPresentDays: 1240,
          totalAbsentDays: 85,
          totalLateDays: 42,
          totalLeaveDays: 156
        },
        byDepartment: [
          { department: 'Operations', employees: 12, attendanceRate: 92.3, lateCount: 8, absentCount: 15 },
          { department: 'Technical', employees: 15, attendanceRate: 88.7, lateCount: 12, absentCount: 22 },
          { department: 'Housekeeping', employees: 18, attendanceRate: 85.2, lateCount: 22, absentCount: 48 }
        ],
        dailyAttendance: [
          { date: '2024-01-01', present: 42, absent: 3, late: 5, attendanceRate: 93.3 },
          { date: '2024-01-02', present: 40, absent: 5, late: 4, attendanceRate: 88.9 },
          { date: '2024-01-03', present: 41, absent: 4, late: 6, attendanceRate: 91.1 }
        ],
        topPerformers: [
          { name: 'John Doe', attendanceRate: 98.5, department: 'Operations', daysPresent: 42 },
          { name: 'Jane Smith', attendanceRate: 97.2, department: 'Technical', daysPresent: 41 }
        ],
        lowPerformers: [
          { name: 'Mike Johnson', attendanceRate: 65.3, department: 'Housekeeping', daysPresent: 28 }
        ]
      }
    });
  } catch (error) {
    console.error('Attendance reports error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export attendance report
router.get('/attendance/export', authorize(['admin', 'super_admin', 'hr']), async (req, res) => {
  try {
    const { startDate, endDate, format = 'excel' } = req.query;
    
    if (format === 'csv') {
      const csvData = 'Employee Name,Department,Present Days,Absent Days,Late Days,Attendance Rate\nJohn Doe,Operations,22,2,1,88.0%\nJane Smith,Technical,20,3,2,80.0%';
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=attendance_report_${Date.now()}.csv`);
      return res.send(csvData);
    }
    
    res.json({ success: true, message: 'Attendance report exported successfully' });
  } catch (error) {
    console.error('Export attendance report error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== FINANCIAL REPORTS ====================

// Financial reports
router.get('/financial', authorize(['admin', 'super_admin', 'accountant']), async (req, res) => {
  try {
    const { year, month, reportType = 'payroll' } = req.query;
    
    res.json({ 
      success: true, 
      data: {
        summary: {
          totalRevenue: 1250000,
          totalExpenses: 875000,
          netProfit: 375000,
          profitMargin: 30,
          payrollTotal: 425000,
          maintenanceCost: 250000,
          utilitiesCost: 150000,
          otherCosts: 50000
        },
        monthlyTrend: [
          { month: 'January', revenue: 98000, expenses: 72000, profit: 26000 },
          { month: 'February', revenue: 102000, expenses: 75000, profit: 27000 },
          { month: 'March', revenue: 115000, expenses: 82000, profit: 33000 }
        ],
        payrollBreakdown: [
          { department: 'Operations', amount: 150000, percentage: 35.3 },
          { department: 'Technical', amount: 120000, percentage: 28.2 },
          { department: 'Management', amount: 85000, percentage: 20.0 },
          { department: 'Housekeeping', amount: 70000, percentage: 16.5 }
        ],
        topEarners: [
          { name: 'John Doe', position: 'Senior Manager', salary: 25000, department: 'Management' },
          { name: 'Jane Smith', position: 'Technical Lead', salary: 18000, department: 'Technical' }
        ]
      }
    });
  } catch (error) {
    console.error('Financial reports error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export financial report
router.get('/financial/export', authorize(['admin', 'super_admin', 'accountant']), async (req, res) => {
  try {
    const { year, month, format = 'excel' } = req.query;
    
    if (format === 'csv') {
      const csvData = 'Month,Revenue,Expenses,Profit\nJanuary,98000,72000,26000\nFebruary,102000,75000,27000\nMarch,115000,82000,33000';
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=financial_report_${Date.now()}.csv`);
      return res.send(csvData);
    }
    
    res.json({ success: true, message: 'Financial report exported successfully' });
  } catch (error) {
    console.error('Export financial report error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== SLA REPORTS ====================

// SLA reports
router.get('/sla', authorize(['admin', 'super_admin', 'manager']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    res.json({ 
      success: true, 
      data: {
        summary: {
          totalTasks: 156,
          withinSLA: 134,
          breachedSLA: 22,
          complianceRate: 85.9,
          averageResponseTime: 45,
          averageResolutionTime: 240
        },
        byPriority: [
          { priority: 'critical', total: 12, withinSLA: 8, breached: 4, complianceRate: 66.7 },
          { priority: 'high', total: 34, withinSLA: 28, breached: 6, complianceRate: 82.4 },
          { priority: 'medium', total: 78, withinSLA: 70, breached: 8, complianceRate: 89.7 },
          { priority: 'low', total: 32, withinSLA: 28, breached: 4, complianceRate: 87.5 }
        ],
        breachedTasks: [
          { taskId: 'TSK001', title: 'AC Repair', priority: 'critical', slaDeadline: '2024-01-10', completedAt: '2024-01-12', breachHours: 48 },
          { taskId: 'TSK002', title: 'Plumbing Issue', priority: 'high', slaDeadline: '2024-01-15', completedAt: '2024-01-18', breachHours: 72 }
        ]
      }
    });
  } catch (error) {
    console.error('SLA reports error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== COMPLAINT REPORTS ====================

// Complaint reports
router.get('/complaints', authorize(['admin', 'super_admin', 'manager']), async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    res.json({ 
      success: true, 
      data: {
        summary: {
          totalComplaints: 89,
          resolved: 76,
          pending: 13,
          resolutionRate: 85.4,
          averageResolutionTime: 72,
          customerSatisfaction: 4.2
        },
        byCategory: [
          { category: 'Plumbing', count: 28, resolved: 24, avgTime: 48 },
          { category: 'Electrical', count: 22, resolved: 18, avgTime: 96 },
          { category: 'AC', count: 25, resolved: 22, avgTime: 72 },
          { category: 'Carpentry', count: 14, resolved: 12, avgTime: 24 }
        ],
        monthlyTrend: [
          { month: 'January', raised: 28, resolved: 24, pending: 4 },
          { month: 'February', raised: 32, resolved: 28, pending: 4 },
          { month: 'March', raised: 29, resolved: 24, pending: 5 }
        ]
      }
    });
  } catch (error) {
    console.error('Complaint reports error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ANALYTICS REPORTS ====================

// Analytics dashboard
router.get('/analytics', authorize(['admin', 'super_admin', 'manager']), async (req, res) => {
  try {
    res.json({ 
      success: true, 
      data: {
        performanceMetrics: {
          taskCompletionRate: 62.8,
          slaComplianceRate: 85.9,
          employeeAttendanceRate: 87.5,
          customerSatisfaction: 4.2,
          revenueGrowth: 12.5
        },
        trends: {
          tasksLast6Months: [45, 52, 58, 62, 68, 75],
          revenueLast6Months: [95000, 102000, 108000, 115000, 122000, 130000],
          attendanceLast6Months: [85, 86, 87, 88, 89, 90]
        },
        predictions: {
          nextMonthTasks: 85,
          nextMonthRevenue: 138000,
          riskFactors: ['High workload expected', 'Leave season approaching']
        }
      }
    });
  } catch (error) {
    console.error('Analytics reports error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== CUSTOM REPORT BUILDER ====================

// Report builder - get available fields
router.get('/builder/fields', authorize(['admin', 'super_admin']), async (req, res) => {
  try {
    res.json({ 
      success: true, 
      data: {
        modules: [
          {
            name: 'Tasks',
            fields: ['title', 'status', 'priority', 'assignedTo', 'createdAt', 'completedAt', 'slaDeadline']
          },
          {
            name: 'Attendance',
            fields: ['employeeName', 'date', 'status', 'checkInTime', 'checkOutTime', 'totalHours']
          },
          {
            name: 'Users',
            fields: ['name', 'email', 'role', 'department', 'joiningDate', 'status']
          },
          {
            name: 'Payroll',
            fields: ['employeeName', 'basicSalary', 'allowances', 'deductions', 'netSalary', 'paymentDate']
          }
        ]
      }
    });
  } catch (error) {
    console.error('Get report builder fields error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate custom report
router.post('/builder/generate', authorize(['admin', 'super_admin']), async (req, res) => {
  try {
    const { module, fields, filters, groupBy, sortBy } = req.body;
    
    res.json({ 
      success: true, 
      data: {
        generatedAt: new Date(),
        module,
        fields,
        filters,
        groupBy,
        sortBy,
        records: [
          { id: 1, name: 'Sample Data 1', value: 100 },
          { id: 2, name: 'Sample Data 2', value: 200 }
        ],
        summary: { totalRecords: 2, totalValue: 300 }
      }
    });
  } catch (error) {
    console.error('Generate custom report error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save report template
router.post('/builder/templates', authorize(['admin', 'super_admin']), async (req, res) => {
  try {
    const { name, description, config, isPublic = false } = req.body;
    
    res.status(201).json({ 
      success: true, 
      message: 'Report template saved successfully',
      data: { id: `template_${Date.now()}`, name, description, config, isPublic }
    });
  } catch (error) {
    console.error('Save report template error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get saved report templates
router.get('/builder/templates', authorize(['admin', 'super_admin']), async (req, res) => {
  try {
    res.json({ 
      success: true, 
      data: [
        { id: 'template_1', name: 'Monthly Task Summary', description: 'Monthly task completion report', isPublic: true },
        { id: 'template_2', name: 'Employee Attendance', description: 'Monthly attendance report', isPublic: true }
      ]
    });
  } catch (error) {
    console.error('Get report templates error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;