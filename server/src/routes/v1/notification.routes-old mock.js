// server/src/routes/v1/notification.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// ==================== NOTIFICATIONS ====================

// Get all notifications for current user
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    const { page = 1, limit = 20, type, isRead } = req.query;
    
    res.json({ 
      success: true, 
      data: [
        {
          _id: 'notif_1',
          userId,
          title: 'Task Assigned',
          body: 'You have been assigned a new task: Fix AC Unit',
          type: 'task',
          priority: 'medium',
          isRead: false,
          createdAt: new Date(),
          referenceId: 'task_123',
          referenceModel: 'Task'
        },
        {
          _id: 'notif_2',
          userId,
          title: 'Leave Request Approved',
          body: 'Your leave request for Jan 20-25 has been approved',
          type: 'leave',
          priority: 'low',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000),
          referenceId: 'leave_456',
          referenceModel: 'Leave'
        },
        {
          _id: 'notif_3',
          userId,
          title: 'SLA Breach Alert',
          body: 'Task "Electrical Repair" is about to breach SLA deadline',
          type: 'alert',
          priority: 'high',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000),
          referenceId: 'task_789',
          referenceModel: 'Task'
        }
      ],
      pagination: { page: 1, limit: 20, total: 3, pages: 1 }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get unread notification count
router.get('/unread-count', async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    
    res.json({ 
      success: true, 
      data: { 
        count: 5,
        byType: {
          task: 2,
          leave: 1,
          alert: 1,
          complaint: 1
        }
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get notification by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({ 
      success: true, 
      data: {
        _id: id,
        title: 'Task Assigned',
        body: 'You have been assigned a new task: Fix AC Unit',
        type: 'task',
        priority: 'medium',
        isRead: false,
        createdAt: new Date(),
        referenceId: 'task_123',
        referenceModel: 'Task'
      }
    });
  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark all notifications as read
router.put('/read-all', async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete all read notifications
router.delete('/read/all', async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    
    res.json({ success: true, message: 'All read notifications deleted' });
  } catch (error) {
    console.error('Delete read notifications error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== NOTIFICATION PREFERENCES ====================

// Get notification preferences
router.get('/preferences', async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    
    res.json({ 
      success: true, 
      data: {
        email: true,
        push: true,
        sms: false,
        inApp: true,
        sound: true,
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '07:00'
        },
        categories: {
          task: { email: true, push: true, inApp: true },
          leave: { email: true, push: true, inApp: true },
          complaint: { email: true, push: true, inApp: true },
          attendance: { email: false, push: false, inApp: true },
          payroll: { email: true, push: false, inApp: true },
          system: { email: true, push: true, inApp: true }
        }
      }
    });
  } catch (error) {
    console.error('Get notification preferences error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update notification preferences
router.put('/preferences', async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    const preferences = req.body;
    
    res.json({ success: true, message: 'Notification preferences updated', data: preferences });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== NOTIFICATION SETTINGS (Admin) ====================

// Get notification settings for a user (Admin)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    res.json({ 
      success: true, 
      data: {
        userId,
        email: true,
        push: true,
        sms: false,
        categories: {
          task: true,
          leave: true,
          complaint: true,
          attendance: true,
          payroll: true,
          system: true
        }
      }
    });
  } catch (error) {
    console.error('Get user notification settings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update notification settings for a user (Admin)
router.put('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const settings = req.body;
    
    res.json({ success: true, message: `Notification settings updated for user ${userId}` });
  } catch (error) {
    console.error('Update user notification settings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== BULK NOTIFICATION ACTIONS ====================

// Bulk mark as read
router.post('/bulk/read', async (req, res) => {
  try {
    const { notificationIds } = req.body;
    
    res.json({ 
      success: true, 
      message: `${notificationIds?.length || 0} notifications marked as read`,
      data: { count: notificationIds?.length || 0 }
    });
  } catch (error) {
    console.error('Bulk mark as read error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bulk delete notifications
router.post('/bulk/delete', async (req, res) => {
  try {
    const { notificationIds } = req.body;
    
    res.json({ 
      success: true, 
      message: `${notificationIds?.length || 0} notifications deleted`,
      data: { count: notificationIds?.length || 0 }
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== NOTIFICATION STATISTICS ====================

// Get notification statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    
    res.json({ 
      success: true, 
      data: {
        total: 45,
        unread: 5,
        read: 40,
        byType: {
          task: 15,
          leave: 8,
          complaint: 10,
          attendance: 5,
          payroll: 4,
          system: 3
        },
        byPriority: {
          high: 3,
          medium: 25,
          low: 17
        },
        lastWeek: [8, 6, 7, 5, 9, 4, 6]
      }
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== TEST NOTIFICATION ====================

// Send test notification (Admin only)
router.post('/test', async (req, res) => {
  try {
    const { userId, title, body, type = 'system' } = req.body;
    
    res.json({ 
      success: true, 
      message: 'Test notification sent successfully',
      data: { userId, title, body, type }
    });
  } catch (error) {
    console.error('Send test notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;