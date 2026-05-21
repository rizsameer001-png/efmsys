// server/src/routes/v1/notification.routes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notification.controller');
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

router.use(protect);

// ==================== USER ENDPOINTS ====================

// Get my notifications
router.get('/', notificationController.getMyNotifications);

// Get notification statistics
router.get('/stats', notificationController.getNotificationStats);

// Mark as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }
    
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
    
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark all as read
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete my notification
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({ _id: id, userId: req.user._id });
    
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    
    await notification.deleteOne();
    
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== SEND NOTIFICATIONS ====================

// Send notification to specific users (Admin/Super Admin)
router.post('/send', authorize(['super_admin', 'admin', 'hr']), notificationController.sendNotification);

// Send notification to team (Manager/Supervisor)
router.post('/send-team', authorize(['manager', 'supervisor']), notificationController.sendTeamNotification);

// Send broadcast notification (Super Admin/Admin)
router.post('/send-broadcast', authorize(['super_admin', 'admin']), notificationController.sendBroadcastNotification);

// ==================== ADMIN ENDPOINTS ====================

// Get all notifications (Admin)
router.get('/admin/all', authorize(['super_admin', 'admin']), notificationController.getAllNotifications);

// Delete notification (Admin)
router.delete('/admin/:id', authorize(['super_admin', 'admin']), notificationController.deleteNotification);

// Bulk delete notifications (Admin)
router.post('/admin/bulk-delete', authorize(['super_admin', 'admin']), notificationController.bulkDeleteNotifications);

// Get notification templates (Admin)
router.get('/templates', authorize(['super_admin', 'admin']), notificationController.getNotificationTemplates);

// Get user notification preferences
router.get('/preferences', async (req, res) => {
  try {
    // Get or create user preferences
    res.json({ success: true, data: {
      email: true,
      push: true,
      inApp: true,
      sound: true,
      quietHours: { enabled: false, start: '22:00', end: '07:00' }
    } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update notification preferences
router.put('/preferences', async (req, res) => {
  try {
    const preferences = req.body;
    res.json({ success: true, data: preferences, message: 'Preferences updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;