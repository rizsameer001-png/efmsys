// server/src/routes/v1/notification.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const notificationController = require('../../controllers/notification.controller');

// All routes require authentication
router.use(protect);

// ==================== USER ENDPOINTS ====================

// Get my notifications
router.get('/', notificationController.getMyNotifications);

// Get notification statistics
router.get('/stats', notificationController.getNotificationStats);

// Get unread count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all as read
router.put('/read-all', notificationController.markAllAsRead);

// Delete my notification
router.delete('/:id', notificationController.deleteMyNotification);

// ==================== SEND NOTIFICATIONS ====================

// Send notification to specific users (Admin/Super Admin/HR)
router.post('/send', authorize(['super_admin', 'admin', 'hr']), notificationController.sendNotification);

// Send notification to team (Manager/Supervisor)
router.post('/send-team', authorize(['manager', 'supervisor']), notificationController.sendTeamNotification);

// Send broadcast notification (Super Admin/Admin only)
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

// ==================== BULK ACTIONS ====================

// Bulk mark as read
router.post('/bulk/read', notificationController.bulkMarkAsRead);

// Bulk delete (user's own notifications)
router.post('/bulk/delete', notificationController.bulkDeleteUserNotifications);

// ==================== NOTIFICATION PREFERENCES ====================

// Get my preferences
router.get('/preferences', notificationController.getMyPreferences);

// Update my preferences
router.put('/preferences', notificationController.updateMyPreferences);

// Get user preferences (Admin only)
router.get('/user/:userId/preferences', authorize(['super_admin', 'admin']), notificationController.getUserPreferences);

// Update user preferences (Admin only)
router.put('/user/:userId/preferences', authorize(['super_admin', 'admin']), notificationController.updateUserPreferences);

// ==================== TEST NOTIFICATION ====================

// Send test notification (Admin only)
router.post('/test', authorize(['super_admin', 'admin']), notificationController.sendTestNotification);

module.exports = router;