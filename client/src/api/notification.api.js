// // client/src/api/notification.api.js
// import api from './axios.config';





// // client/src/api/notification.api.js
// import api from './axios.config';

// export const notificationApi = {
//   // ==================== USER ENDPOINTS ====================
  
//   // Get notifications list
//   getNotifications: (filter = 'all', page = 1, limit = 20) => {
//     return api.get('/notifications', { params: { filter, page, limit } });
//   },
  
//   // Get my notifications (with pagination)
//   getMyNotifications: (params = {}) => {
//     return api.get('/notifications', { params });
//   },
  
//   // Get notification statistics
//   getNotificationStats: () => {
//     return api.get('/notifications/stats');
//   },
  
//   // Mark single notification as read
//   markAsRead: (id) => {
//     return api.put(`/notifications/${id}/read`);
//   },
  
//   // Mark all notifications as read
//   markAllAsRead: () => {
//     return api.put('/notifications/read-all');
//   },
  
//   // Delete a notification
//   deleteNotification: (id) => {
//     return api.delete(`/notifications/${id}`);
//   },
  
//   // Delete all read notifications
//   deleteAllRead: () => {
//     return api.delete('/notifications/read-all');
//   },
  
//   // Get notification preferences
//   getPreferences: () => {
//     return api.get('/notifications/preferences');
//   },
  
//   // Update notification preferences
//   updatePreferences: (preferences) => {
//     return api.put('/notifications/preferences', preferences);
//   },
  
//   // Get unread count (for badge)
//   getUnreadCount: () => {
//     return api.get('/notifications/unread-count');
//   },
  
//   // ==================== SEND NOTIFICATIONS ====================
  
//   /**
//    * Send notification to specific users (Admin/Super Admin/HR)
//    * @param {Object} data - Notification data
//    * @param {string} data.title - Notification title
//    * @param {string} data.body - Notification body
//    * @param {string} data.type - Notification type (task, complaint, system, etc.)
//    * @param {string} data.priority - Priority (low, medium, high, urgent)
//    * @param {array} data.targetUsers - Array of user IDs
//    * @param {array} data.targetRoles - Array of role names
//    * @param {array} data.targetDepartments - Array of department names
//    * @param {object} data.data - Additional data
//    */
//   sendNotification: (data) => {
//     return api.post('/notifications/send', data);
//   },
  
//   /**
//    * Send notification to team (Manager/Supervisor only)
//    * @param {Object} data - Notification data
//    * @param {string} data.title - Notification title
//    * @param {string} data.body - Notification body
//    * @param {string} data.type - Notification type
//    * @param {string} data.priority - Priority level
//    * @param {object} data.data - Additional data
//    */
//   sendTeamNotification: (data) => {
//     return api.post('/notifications/send-team', data);
//   },
  
//   /**
//    * Send broadcast notification to all users (Super Admin/Admin only)
//    * @param {Object} data - Notification data
//    * @param {string} data.title - Notification title
//    * @param {string} data.body - Notification body
//    * @param {string} data.type - Notification type
//    * @param {string} data.priority - Priority level
//    * @param {array} data.roles - Filter by roles (optional)
//    * @param {array} data.departments - Filter by departments (optional)
//    * @param {object} data.data - Additional data
//    */
//   sendBroadcast: (data) => {
//     return api.post('/notifications/send-broadcast', data);
//   },
  
//   // ==================== ADMIN MANAGEMENT ====================
  
//   /**
//    * Get all notifications (Admin/Super Admin)
//    * @param {Object} params - Query parameters
//    * @param {number} params.page - Page number
//    * @param {number} params.limit - Items per page
//    * @param {string} params.type - Filter by type
//    * @param {string} params.status - Filter by status (read/unread)
//    * @param {string} params.userId - Filter by user ID
//    * @param {string} params.startDate - Start date filter
//    * @param {string} params.endDate - End date filter
//    */
//   getAllNotifications: (params = {}) => {
//     return api.get('/notifications/admin/all', { params });
//   },
  
//   /**
//    * Delete notification (Admin/Super Admin)
//    * @param {string} id - Notification ID
//    */
//   deleteNotificationAdmin: (id) => {
//     return api.delete(`/notifications/admin/${id}`);
//   },
  
//   /**
//    * Bulk delete notifications (Admin/Super Admin)
//    * @param {array} notificationIds - Array of notification IDs
//    */
//   bulkDeleteNotifications: (notificationIds) => {
//     return api.post('/notifications/admin/bulk-delete', { notificationIds });
//   },
  
//   /**
//    * Get notification templates (Admin/Super Admin)
//    */
//   getTemplates: () => {
//     return api.get('/notifications/templates');
//   },
  
//   /**
//    * Create notification template (Admin/Super Admin)
//    * @param {Object} template - Template data
//    */
//   createTemplate: (template) => {
//     return api.post('/notifications/templates', template);
//   },
  
//   /**
//    * Update notification template (Admin/Super Admin)
//    * @param {string} id - Template ID
//    * @param {Object} template - Template data
//    */
//   updateTemplate: (id, template) => {
//     return api.put(`/notifications/templates/${id}`, template);
//   },
  
//   /**
//    * Delete notification template (Admin/Super Admin)
//    * @param {string} id - Template ID
//    */
//   deleteTemplate: (id) => {
//     return api.delete(`/notifications/templates/${id}`);
//   },
  
//   // ==================== PUSH NOTIFICATIONS ====================
  
//   /**
//    * Subscribe to push notifications
//    * @param {Object} subscription - Push subscription object
//    */
//   subscribePush: (subscription) => {
//     return api.post('/notifications/subscribe', subscription);
//   },
  
//   /**
//    * Unsubscribe from push notifications
//    */
//   unsubscribePush: () => {
//     return api.delete('/notifications/subscribe');
//   },
  
//   /**
//    * Register FCM token for push notifications
//    * @param {string} token - FCM token
//    */
//   registerFCMToken: (token) => {
//     return api.post('/notifications/fcm-token', { token });
//   },
  
//   /**
//    * Remove FCM token
//    * @param {string} token - FCM token to remove
//    */
//   removeFCMToken: (token) => {
//     return api.delete('/notifications/fcm-token', { data: { token } });
//   },
  
//   // ==================== TEST NOTIFICATIONS ====================
  
//   /**
//    * Send test notification (for development)
//    * @param {string} userId - User ID to send test notification to
//    */
//   sendTestNotification: (userId = null) => {
//     return api.post('/notifications/test', { userId });
//   },
  
//   // ==================== ANALYTICS & STATISTICS ====================
  
//   /**
//    * Get notification analytics (Admin/Super Admin)
//    * @param {Object} params - Query parameters
//    * @param {string} params.startDate - Start date
//    * @param {string} params.endDate - End date
//    * @param {string} params.groupBy - Group by (day, week, month)
//    */
//   getNotificationAnalytics: (params = {}) => {
//     return api.get('/notifications/admin/analytics', { params });
//   },
  
//   /**
//    * Export notification logs (Admin/Super Admin)
//    * @param {Object} params - Export parameters
//    * @param {string} params.startDate - Start date
//    * @param {string} params.endDate - End date
//    * @param {string} params.format - Export format (csv, excel)
//    */
//   exportNotificationLogs: (params = {}) => {
//     return api.get('/notifications/admin/export', { params, responseType: 'blob' });
//   },
  
//   // ==================== SCHEDULED NOTIFICATIONS ====================
  
//   /**
//    * Schedule a notification for later
//    * @param {Object} data - Scheduled notification data
//    * @param {string} data.title - Notification title
//    * @param {string} data.body - Notification body
//    * @param {date} data.scheduledFor - Date and time to send
//    * @param {array} data.targetUsers - Array of user IDs
//    * @param {array} data.targetRoles - Array of role names
//    */
//   scheduleNotification: (data) => {
//     return api.post('/notifications/schedule', data);
//   },
  
//   /**
//    * Get scheduled notifications (Admin/Super Admin)
//    * @param {Object} params - Query parameters
//    */
//   getScheduledNotifications: (params = {}) => {
//     return api.get('/notifications/scheduled', { params });
//   },
  
//   /**
//    * Cancel scheduled notification
//    * @param {string} id - Scheduled notification ID
//    */
//   cancelScheduledNotification: (id) => {
//     return api.delete(`/notifications/scheduled/${id}`);
//   }
// };

// export default notificationApi;





// client/src/api/notification.api.js
import api from './axios.config';

export const notificationApi = {
  // ==================== USER ENDPOINTS ====================
  
  /**
   * Get notifications list (alias for getMyNotifications)
   * @param {string} filter - Filter by 'all', 'unread', 'read'
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  getNotifications: (filter = 'all', page = 1, limit = 20) => {
    return api.get('/notifications', { params: { filter, page, limit } });
  },
  
  /**
   * Get my notifications (with pagination and filters)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.type - Filter by notification type
   * @param {boolean} params.unreadOnly - Only show unread notifications
   */
  getMyNotifications: (params = {}) => {
    return api.get('/notifications', { params });
  },
  
  /**
   * Get notification statistics (counts by type and status)
   * @returns {Promise} - { total, unread, read, byType: { task: 0, complaint: 0, ... } }
   */
  getNotificationStats: () => {
    return api.get('/notifications/stats');
  },
  
  /**
   * Mark single notification as read
   * @param {string} id - Notification ID
   */
  markAsRead: (id) => {
    return api.put(`/notifications/${id}/read`);
  },
  
  /**
   * Mark all notifications as read
   */
  markAllAsRead: () => {
    return api.put('/notifications/read-all');
  },
  
  /**
   * Delete a notification
   * @param {string} id - Notification ID
   */
  deleteNotification: (id) => {
    return api.delete(`/notifications/${id}`);
  },
  
  /**
   * Delete all read notifications
   */
  deleteAllRead: () => {
    return api.delete('/notifications/read-all');
  },
  
  /**
   * Get notification preferences for current user
   * @returns {Promise} - { email_enabled, push_enabled, types: {...}, quiet_hours: {...} }
   */
  getPreferences: () => {
    return api.get('/notifications/preferences');
  },
  
  /**
   * Update notification preferences
   * @param {Object} preferences - Preferences object
   * @param {boolean} preferences.email_enabled - Enable email notifications
   * @param {boolean} preferences.push_enabled - Enable push notifications
   * @param {Object} preferences.types - Toggle by notification type
   * @param {Object} preferences.quiet_hours - Quiet hours settings
   */
  updatePreferences: (preferences) => {
    return api.put('/notifications/preferences', preferences);
  },
  
  /**
   * Get unread count for notification badge
   * @returns {Promise} - { count: number }
   */
  getUnreadCount: () => {
    return api.get('/notifications/unread-count');
  },
  
  // ==================== SEND NOTIFICATIONS ====================
  
  /**
   * Send notification to specific users (Admin/Super Admin/HR)
   * @param {Object} data - Notification data
   * @param {string} data.title - Notification title
   * @param {string} data.message - Notification message/body
   * @param {string} data.type - Notification type (task, complaint, system, etc.)
   * @param {string} data.priority - Priority (low, medium, high, urgent)
   * @param {array} data.targetUsers - Array of user IDs
   * @param {array} data.targetRoles - Array of role names
   * @param {array} data.targetDepartments - Array of department names
   * @param {string} data.actionUrl - URL to navigate when clicked
   * @param {object} data.metadata - Additional metadata
   */
  sendNotification: (data) => {
    return api.post('/notifications/send', data);
  },
  
  /**
   * Send notification to team (Manager/Supervisor only)
   * @param {Object} data - Notification data
   * @param {string} data.title - Notification title
   * @param {string} data.message - Notification body
   * @param {string} data.type - Notification type
   * @param {string} data.priority - Priority level
   * @param {string} data.teamId - Team ID (optional, defaults to manager's team)
   * @param {object} data.metadata - Additional data
   */
  sendTeamNotification: (data) => {
    return api.post('/notifications/send-team', data);
  },
  
  /**
   * Send broadcast notification to all users (Super Admin/Admin only)
   * @param {Object} data - Notification data
   * @param {string} data.title - Notification title
   * @param {string} data.message - Notification body
   * @param {string} data.type - Notification type
   * @param {string} data.priority - Priority level
   * @param {array} data.roles - Filter by roles (optional)
   * @param {array} data.departments - Filter by departments (optional)
   * @param {object} data.metadata - Additional data
   */
  sendBroadcast: (data) => {
    return api.post('/notifications/send-broadcast', data);
  },
  
  // ==================== ADMIN MANAGEMENT ====================
  
  /**
   * Get all notifications across all users (Admin/Super Admin)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.type - Filter by type
   * @param {string} params.status - Filter by status (read/unread)
   * @param {string} params.userId - Filter by user ID
   * @param {string} params.startDate - Start date filter (YYYY-MM-DD)
   * @param {string} params.endDate - End date filter (YYYY-MM-DD)
   * @param {string} params.search - Search in title/message
   */
  getAllNotifications: (params = {}) => {
    return api.get('/notifications/admin/all', { params });
  },
  
  /**
   * Delete notification by admin (Admin/Super Admin)
   * @param {string} id - Notification ID
   */
  deleteNotificationAdmin: (id) => {
    return api.delete(`/notifications/admin/${id}`);
  },
  
  /**
   * Bulk delete notifications (Admin/Super Admin)
   * @param {array} notificationIds - Array of notification IDs
   */
  bulkDeleteNotifications: (notificationIds) => {
    return api.post('/notifications/admin/bulk-delete', { notificationIds });
  },
  
  /**
   * Bulk mark notifications as read (Admin/Super Admin)
   * @param {array} notificationIds - Array of notification IDs
   */
  bulkMarkAsRead: (notificationIds) => {
    return api.post('/notifications/admin/bulk-read', { notificationIds });
  },
  
  /**
   * Get notification templates (Admin/Super Admin)
   */
  getTemplates: () => {
    return api.get('/notifications/templates');
  },
  
  /**
   * Create notification template (Admin/Super Admin)
   * @param {Object} template - Template data
   * @param {string} template.name - Template name
   * @param {string} template.title - Template title
   * @param {string} template.message - Template message
   * @param {string} template.type - Notification type
   * @param {string} template.priority - Priority level
   */
  createTemplate: (template) => {
    return api.post('/notifications/templates', template);
  },
  
  /**
   * Update notification template (Admin/Super Admin)
   * @param {string} id - Template ID
   * @param {Object} template - Template data
   */
  updateTemplate: (id, template) => {
    return api.put(`/notifications/templates/${id}`, template);
  },
  
  /**
   * Delete notification template (Admin/Super Admin)
   * @param {string} id - Template ID
   */
  deleteTemplate: (id) => {
    return api.delete(`/notifications/templates/${id}`);
  },
  
  // ==================== PUSH NOTIFICATIONS ====================
  
  /**
   * Subscribe to push notifications (Web Push API)
   * @param {Object} subscription - Push subscription object from browser
   */
  subscribePush: (subscription) => {
    return api.post('/notifications/subscribe', subscription);
  },
  
  /**
   * Unsubscribe from push notifications
   */
  unsubscribePush: () => {
    return api.delete('/notifications/subscribe');
  },
  
  /**
   * Register FCM token for mobile push notifications
   * @param {string} token - FCM device token
   */
  registerFCMToken: (token) => {
    return api.post('/notifications/fcm-token', { token });
  },
  
  /**
   * Remove FCM token
   * @param {string} token - FCM token to remove
   */
  removeFCMToken: (token) => {
    return api.delete('/notifications/fcm-token', { data: { token } });
  },
  
  // ==================== TEST NOTIFICATIONS ====================
  
  /**
   * Send test notification (for development/testing)
   * @param {string} userId - User ID to send test notification to (null = current user)
   */
  sendTestNotification: (userId = null) => {
    return api.post('/notifications/test', userId ? { userId } : {});
  },
  
  // ==================== ANALYTICS & STATISTICS ====================
  
  /**
   * Get notification analytics (Admin/Super Admin)
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @param {string} params.groupBy - Group by ('day', 'week', 'month')
   * @param {string} params.type - Filter by notification type
   */
  getNotificationAnalytics: (params = {}) => {
    return api.get('/notifications/admin/analytics', { params });
  },
  
  /**
   * Export notification logs (Admin/Super Admin)
   * @param {Object} params - Export parameters
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @param {string} params.format - Export format ('csv', 'excel', 'pdf')
   * @param {string} params.type - Filter by notification type
   */
  exportNotificationLogs: (params = {}) => {
    return api.get('/notifications/admin/export', { 
      params, 
      responseType: 'blob' // Important for file download
    });
  },
  
  // ==================== SCHEDULED NOTIFICATIONS ====================
  
  /**
   * Schedule a notification for later delivery
   * @param {Object} data - Scheduled notification data
   * @param {string} data.title - Notification title
   * @param {string} data.message - Notification body
   * @param {string|Date} data.scheduledFor - Date and time to send (ISO string)
   * @param {array} data.targetUsers - Array of user IDs
   * @param {array} data.targetRoles - Array of role names
   * @param {string} data.type - Notification type
   * @param {string} data.priority - Priority level
   * @param {string} data.recurrence - Recurrence pattern (optional: 'daily', 'weekly', 'monthly')
   */
  scheduleNotification: (data) => {
    return api.post('/notifications/schedule', data);
  },
  
  /**
   * Get scheduled notifications (Admin/Super Admin)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status ('pending', 'sent', 'cancelled')
   */
  getScheduledNotifications: (params = {}) => {
    return api.get('/notifications/scheduled', { params });
  },
  
  /**
   * Cancel scheduled notification
   * @param {string} id - Scheduled notification ID
   */
  cancelScheduledNotification: (id) => {
    return api.delete(`/notifications/scheduled/${id}`);
  },
  
  /**
   * Update scheduled notification
   * @param {string} id - Scheduled notification ID
   * @param {Object} data - Updated schedule data
   */
  updateScheduledNotification: (id, data) => {
    return api.put(`/notifications/scheduled/${id}`, data);
  }
};

export default notificationApi;