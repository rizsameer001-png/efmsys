// server/src/routes/v1/dashboard.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

// All routes require authentication
router.use(protect);

// ==================== DASHBOARD STATS ====================

// Main dashboard stats (role-based)
router.get('/stats', async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id || req.userId;
    
    // Role-based dashboard data
    let data = {};
    
    if (userRole === 'super_admin' || userRole === 'admin') {
      data = {
        users: { total: 2847, active: 2412, newThisMonth: 124, growth: 5.2 },
        buildings: { total: 45, active: 42, totalUnits: 2850, occupancyRate: 87.5 },
        tasks: { total: 1245, completed: 876, inProgress: 245, overdue: 124, completionRate: 70.4 },
        complaints: { total: 345, resolved: 289, pending: 56, resolutionRate: 83.8 },
        attendance: { present: 2345, absent: 124, late: 89, rate: 87.5 },
        revenue: { total: 12500000, thisMonth: 1450000, growth: 12.5 }
      };
    } else if (userRole === 'manager') {
      data = {
        team: { total: 25, active: 22, present: 20, absent: 2 },
        tasks: { total: 89, completed: 56, inProgress: 23, overdue: 10, completionRate: 62.9 },
        attendance: { present: 20, absent: 2, late: 3, rate: 80.0 },
        sla: { compliance: 85.5, breached: 8, atRisk: 5 }
      };
    } else if (userRole === 'supervisor') {
      data = {
        team: { total: 12, active: 11, present: 10, absent: 1 },
        tasks: { total: 45, completed: 28, inProgress: 12, overdue: 5, completionRate: 62.2 },
        attendance: { present: 10, absent: 1, late: 2, rate: 83.3 },
        pendingVerifications: 8
      };
    } else if (userRole === 'technician') {
      data = {
        myTasks: { assigned: 8, inProgress: 3, completed: 12, pendingReview: 2 },
        attendance: { present: 22, absent: 1, late: 2, rate: 88.0 },
        performance: { rating: 4.8, tasksCompleted: 45, avgCompletionTime: 2.5 }
      };
    } else if (userRole === 'customer') {
      data = {
        properties: { total: 1, activeComplaints: 2, resolved: 5, pendingPayment: 234 },
        serviceRequests: { open: 2, inProgress: 1, completed: 5 },
        payments: { totalPaid: 1250, pending: 234, lastPayment: 500 }
      };
    } else if (userRole === 'hr') {
      data = {
        employees: { total: 2847, active: 2412, newThisMonth: 124, leaving: 15 },
        attendance: { present: 2345, absent: 124, late: 89, rate: 87.5 },
        leaves: { pending: 45, approved: 234, rejected: 12 },
        payroll: { total: 12500000, average: 4500, pending: 5 }
      };
    }
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== RECENT ACTIVITIES ====================

// Get recent activities
router.get('/recent-activities', async (req, res) => {
  try {
    const userRole = req.user.role;
    const limit = parseInt(req.query.limit) || 10;
    
    let activities = [];
    
    if (userRole === 'super_admin' || userRole === 'admin') {
      activities = [
        { id: 1, type: 'user', action: 'New user registered', user: 'John Smith', time: '2 minutes ago', icon: '👤', color: 'blue' },
        { id: 2, type: 'task', action: 'Task completed', task: 'Fix AC in Tower A', time: '15 minutes ago', icon: '✅', color: 'green' },
        { id: 3, type: 'complaint', action: 'New complaint raised', complaint: 'Plumbing issue', time: '1 hour ago', icon: '📋', color: 'orange' },
        { id: 4, type: 'building', action: 'New building added', building: 'Tech Hub', time: '3 hours ago', icon: '🏢', color: 'purple' },
        { id: 5, type: 'payment', action: 'Payment received', amount: '$2,500', time: '5 hours ago', icon: '💰', color: 'green' },
        { id: 6, type: 'leave', action: 'Leave request approved', user: 'Sarah Johnson', time: '6 hours ago', icon: '🏖️', color: 'yellow' },
        { id: 7, type: 'attendance', action: 'Employee late check-in', user: 'Mike Chen', time: '7 hours ago', icon: '⏰', color: 'red' }
      ];
    } else if (userRole === 'manager') {
      activities = [
        { id: 1, type: 'task', action: 'New task assigned', task: 'Electrical Repair', time: '10 minutes ago', icon: '📋', color: 'blue' },
        { id: 2, type: 'task', action: 'Task completed', task: 'Plumbing Fix', time: '30 minutes ago', icon: '✅', color: 'green' },
        { id: 3, type: 'attendance', action: 'Team member late', user: 'John Doe', time: '1 hour ago', icon: '⏰', color: 'orange' }
      ];
    } else if (userRole === 'technician') {
      activities = [
        { id: 1, type: 'task', action: 'Task assigned', task: 'AC Maintenance', time: '5 minutes ago', icon: '📋', color: 'blue' },
        { id: 2, type: 'task', action: 'Task approved', task: 'Electrical Fix', time: '1 hour ago', icon: '✅', color: 'green' }
      ];
    } else {
      activities = [
        { id: 1, type: 'complaint', action: 'Your complaint updated', complaint: 'AC Issue', time: '2 hours ago', icon: '⚠️', color: 'blue' },
        { id: 2, type: 'payment', action: 'Payment due reminder', amount: '$234', time: '1 day ago', icon: '💰', color: 'yellow' }
      ];
    }
    
    res.json({ success: true, data: activities.slice(0, limit) });
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== QUICK STATS ====================

// Get quick stats for dashboard widgets
router.get('/quick-stats', async (req, res) => {
  try {
    const userRole = req.user.role;
    
    let data = {};
    
    if (userRole === 'super_admin' || userRole === 'admin') {
      data = {
        totalUsers: 2847,
        totalBuildings: 45,
        totalTasks: 1245,
        pendingLeaves: 45,
        pendingComplaints: 56,
        overdueTasks: 124,
        attendanceRate: 87.5,
        revenueGrowth: 12.5
      };
    } else if (userRole === 'manager') {
      data = {
        teamSize: 25,
        pendingTasks: 33,
        pendingLeaves: 5,
        attendanceRate: 80.0,
        slaCompliance: 85.5
      };
    } else if (userRole === 'supervisor') {
      data = {
        teamSize: 12,
        pendingTasks: 17,
        pendingVerifications: 8,
        attendanceRate: 83.3
      };
    } else if (userRole === 'technician') {
      data = {
        assignedTasks: 8,
        inProgressTasks: 3,
        pendingReview: 2,
        completedThisMonth: 12
      };
    } else if (userRole === 'customer') {
      data = {
        activeComplaints: 2,
        resolvedComplaints: 5,
        pendingPayment: 234,
        upcomingServices: 1
      };
    }
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Quick stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== CHART DATA ====================

// Get task statistics chart data
router.get('/chart/tasks', authorize(['admin', 'super_admin', 'manager']), async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    res.json({
      success: true,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Created',
            data: [45, 52, 58, 62, 68, 75],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)'
          },
          {
            label: 'Completed',
            data: [38, 44, 50, 55, 60, 68],
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgb(16, 185, 129)'
          },
          {
            label: 'Overdue',
            data: [7, 8, 8, 7, 8, 7],
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            borderColor: 'rgb(239, 68, 68)'
          }
        ]
      }
    });
  } catch (error) {
    console.error('Task chart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get attendance trend chart data
router.get('/chart/attendance', authorize(['admin', 'super_admin', 'manager', 'hr']), async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    res.json({
      success: true,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Attendance Rate (%)',
            data: [85, 86, 88, 87, 89, 90],
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgb(16, 185, 129)',
            fill: true
          }
        ]
      }
    });
  } catch (error) {
    console.error('Attendance chart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get revenue chart data
router.get('/chart/revenue', authorize(['admin', 'super_admin', 'accountant']), async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    res.json({
      success: true,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue (AED)',
            data: [125000, 132000, 148000, 156000, 168000, 175000],
            backgroundColor: 'rgba(139, 92, 246, 0.5)',
            borderColor: 'rgb(139, 92, 246)',
            fill: true
          }
        ]
      }
    });
  } catch (error) {
    console.error('Revenue chart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== KPI METRICS ====================

// Get KPI metrics for dashboard
router.get('/kpi', authorize(['admin', 'super_admin']), async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        customerSatisfaction: 4.2,
        employeeSatisfaction: 4.0,
        taskCompletionRate: 70.4,
        slaComplianceRate: 85.9,
        revenueGrowth: 12.5,
        employeeTurnover: 5.2,
        avgResponseTime: 45,
        avgResolutionTime: 240
      }
    });
  } catch (error) {
    console.error('KPI metrics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== TOP PERFORMERS ====================

// Get top performers
router.get('/top-performers', authorize(['admin', 'super_admin', 'manager']), async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        topTechnicians: [
          { name: 'John Doe', tasksCompleted: 45, rating: 4.9, efficiency: 95 },
          { name: 'Jane Smith', tasksCompleted: 42, rating: 4.8, efficiency: 92 },
          { name: 'Mike Johnson', tasksCompleted: 38, rating: 4.7, efficiency: 88 }
        ],
        topBuildings: [
          { name: 'Tower A', complaintsResolved: 89, satisfaction: 4.5, responseTime: 35 },
          { name: 'Tower B', complaintsResolved: 76, satisfaction: 4.3, responseTime: 42 },
          { name: 'Tower C', complaintsResolved: 68, satisfaction: 4.1, responseTime: 48 }
        ],
        topDepartments: [
          { name: 'Operations', productivity: 92, attendance: 95, tasksCompleted: 234 },
          { name: 'Technical', productivity: 88, attendance: 91, tasksCompleted: 187 },
          { name: 'Housekeeping', productivity: 85, attendance: 89, tasksCompleted: 156 }
        ]
      }
    });
  } catch (error) {
    console.error('Top performers error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== WIDGET DATA ====================

// Get upcoming events widget
router.get('/widget/upcoming', async (req, res) => {
  try {
    res.json({
      success: true,
      data: [
        { id: 1, title: 'Team Meeting', date: '2024-01-20', time: '10:00', type: 'meeting' },
        { id: 2, title: 'AC Maintenance', date: '2024-01-21', time: '14:00', type: 'task' },
        { id: 3, title: 'Payroll Processing', date: '2024-01-25', time: '09:00', type: 'payroll' }
      ]
    });
  } catch (error) {
    console.error('Upcoming events error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get notifications widget
router.get('/widget/notifications', async (req, res) => {
  try {
    res.json({
      success: true,
      data: [
        { id: 1, title: 'Task Assigned', message: 'New task assigned to you', time: '5 min ago', isRead: false },
        { id: 2, title: 'Leave Request', message: 'Leave request pending approval', time: '1 hour ago', isRead: false },
        { id: 3, title: 'SLA Alert', message: 'Task nearing deadline', time: '2 hours ago', isRead: true }
      ]
    });
  } catch (error) {
    console.error('Notifications widget error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;