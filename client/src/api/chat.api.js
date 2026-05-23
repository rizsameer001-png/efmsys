// // client/src/api/chat.api.js
// import api from './axios.config';

// export const chatApi = {
//   // ==================== CHAT SETTINGS ====================
  
//   // Get user chat settings
//   getUserChatSettings: () => {
//     return api.get('/chat/settings');
//   },
  
//   // Update user chat settings (Super Admin only)
//   updateUserChatSettings: (userId, data) => {
//     return api.put(`/chat/settings/${userId}`, data);
//   },
  
//   // ==================== CHAT MANAGEMENT ====================
  
//   // Get or create direct chat
//   getOrCreateDirectChat: (targetUserId) => {
//     return api.post('/chat/direct', { targetUserId });
//   },
  
//   // Get user's chats
//   getUserChats: () => {
//     return api.get('/chat/chats');
//   },
  
//   // Get chat messages
//   getChatMessages: (chatId, page = 1, limit = 50) => {
//     return api.get(`/chat/chats/${chatId}/messages`, { params: { page, limit } });
//   },
  
//   // Send message
//   sendMessage: (chatId, data) => {
//     return api.post(`/chat/chats/${chatId}/messages`, data);
//   },
  
//   // Mark message as read
//   markAsRead: (messageId) => {
//     return api.put(`/chat/messages/${messageId}/read`);
//   },
  
//   // Delete message
//   deleteMessage: (messageId) => {
//     return api.delete(`/chat/messages/${messageId}`);
//   },
  
//   // ==================== GROUP CHAT ====================
  
//   // Create group chat
//   createGroupChat: (data) => {
//     return api.post('/chat/groups', data);
//   },
  
//   // ==================== TICKET CHAT ====================
  
//   // Create ticket-based chat
//   createTicketChat: (data) => {
//     return api.post('/chat/ticket', data);
//   },
  
//   // ==================== USER MANAGEMENT ====================
  
//   // Get available users for chat
//   getAvailableUsers: () => {
//     return api.get('/chat/users/available');
//   },
  
//   // Block user
//   blockUser: (userId, reason = '') => {
//     return api.post(`/chat/users/${userId}/block`, { reason });
//   },
  
//   // Unblock user
//   unblockUser: (userId) => {
//     return api.delete(`/chat/users/${userId}/block`);
//   },
  
//   // ==================== ADMIN ONLY ====================
  
//   // Get all chats (admin)
//   getAllChats: (params = {}) => {
//     return api.get('/chat/admin/chats', { params });
//   },
  
//   // Export chat logs (admin)
//   exportChatLogs: (params = {}) => {
//     return api.get('/chat/admin/export', { params, responseType: 'blob' });
//   }
// };





// client/src/api/chat.api.js
// import api from './axios.config';

// export const chatApi = {
//   // ==================== CHAT SETTINGS ====================
  
//   // Get user chat settings
//   getUserChatSettings: () => {
//     return api.get('/chat/settings');
//   },
  
//   // Update user chat settings (Super Admin only)
//   updateUserChatSettings: (userId, data) => {
//     return api.put(`/chat/settings/${userId}`, data);
//   },
  
//   // ==================== CHAT MANAGEMENT ====================
  
//   // Get or create direct chat
//   getOrCreateDirectChat: (targetUserId) => {
//     return api.post('/chat/direct', { targetUserId });
//   },
  
//   // Get user's chats
//   getUserChats: () => {
//     return api.get('/chat/chats');
//   },
  
//   // Get chat messages
//   getChatMessages: (chatId, page = 1, limit = 50) => {
//     return api.get(`/chat/chats/${chatId}/messages`, { params: { page, limit } });
//   },
  
//   // Get chat messages by date range
//   getChatMessagesByDateRange: (chatId, startDate, endDate) => {
//     return api.get(`/chat/chats/${chatId}/messages/date-range`, { 
//       params: { startDate, endDate } 
//     });
//   },
  
//   // Send message
//   sendMessage: (chatId, data) => {
//     return api.post(`/chat/chats/${chatId}/messages`, data);
//   },
  
//   // Send message with attachment
//   sendMessageWithAttachment: (chatId, formData) => {
//     return api.post(`/chat/chats/${chatId}/messages/attachment`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },
  
//   // Mark message as read
//   markAsRead: (messageId) => {
//     return api.put(`/chat/messages/${messageId}/read`);
//   },
  
//   // Mark all messages as read in a chat
//   markAllAsRead: (chatId) => {
//     return api.put(`/chat/chats/${chatId}/read-all`);
//   },
  
//   // Delete message
//   deleteMessage: (messageId) => {
//     return api.delete(`/chat/messages/${messageId}`);
//   },
  
//   // Delete message for everyone (admin only)
//   deleteMessageForEveryone: (messageId) => {
//     return api.delete(`/chat/messages/${messageId}/global`);
//   },
  
//   // Edit message
//   editMessage: (messageId, message) => {
//     return api.put(`/chat/messages/${messageId}`, { message });
//   },
  
//   // ==================== GROUP CHAT ====================
  
//   // Create group chat
//   createGroupChat: (data) => {
//     return api.post('/chat/groups', data);
//   },
  
//   // Update group chat
//   updateGroupChat: (groupId, data) => {
//     return api.put(`/chat/groups/${groupId}`, data);
//   },
  
//   // Add members to group
//   addGroupMembers: (groupId, userIds) => {
//     return api.post(`/chat/groups/${groupId}/members`, { userIds });
//   },
  
//   // Remove member from group
//   removeGroupMember: (groupId, userId) => {
//     return api.delete(`/chat/groups/${groupId}/members/${userId}`);
//   },
  
//   // Leave group
//   leaveGroup: (groupId) => {
//     return api.post(`/chat/groups/${groupId}/leave`);
//   },
  
//   // Get group details
//   getGroupDetails: (groupId) => {
//     return api.get(`/chat/groups/${groupId}`);
//   },
  
//   // ==================== TICKET CHAT ====================
  
//   // Create ticket-based chat
//   createTicketChat: (data) => {
//     return api.post('/chat/ticket', data);
//   },
  
//   // Get ticket chat by ticket ID
//   getTicketChat: (ticketId, ticketType) => {
//     return api.get(`/chat/ticket/${ticketId}`, { params: { ticketType } });
//   },
  
//   // ==================== USER MANAGEMENT ====================
  
//   // Get available users for chat
//   getAvailableUsers: () => {
//     return api.get('/chat/users/available');
//   },
  
//   // Search users for chat
//   searchUsers: (query) => {
//     return api.get('/chat/users/search', { params: { q: query } });
//   },
  
//   // Block user
//   blockUser: (userId, reason = '') => {
//     return api.post(`/chat/users/${userId}/block`, { reason });
//   },
  
//   // Unblock user
//   unblockUser: (userId) => {
//     return api.delete(`/chat/users/${userId}/block`);
//   },
  
//   // Get blocked users
//   getBlockedUsers: () => {
//     return api.get('/chat/users/blocked');
//   },
  
//   // ==================== STATISTICS & ANALYTICS ====================
  
//   // Get chat statistics (admin)
//   getChatStats: () => {
//     return api.get('/chat/stats');
//   },
  
//   // Get chat analytics (admin)
//   getChatAnalytics: (params = {}) => {
//     return api.get('/chat/analytics', { params });
//   },
  
//   // Get user chat activity
//   getUserChatActivity: (userId, params = {}) => {
//     return api.get(`/chat/users/${userId}/activity`, { params });
//   },
  
//   // Get chat response time stats
//   getResponseTimeStats: (params = {}) => {
//     return api.get('/chat/stats/response-time', { params });
//   },
  
//   // ==================== ADMIN ONLY ====================
  
//   // Get all chats (admin)
//   getAllChats: (params = {}) => {
//     return api.get('/chat/admin/chats', { params });
//   },
  
//   // Get chat by ID (admin)
//   getChatById: (chatId) => {
//     return api.get(`/chat/admin/chats/${chatId}`);
//   },
  
//   // Delete chat (admin)
//   deleteChat: (chatId) => {
//     return api.delete(`/chat/admin/chats/${chatId}`);
//   },
  
//   // Archive chat (admin)
//   archiveChat: (chatId) => {
//     return api.put(`/chat/admin/chats/${chatId}/archive`);
//   },
  
//   // Unarchive chat (admin)
//   unarchiveChat: (chatId) => {
//     return api.put(`/chat/admin/chats/${chatId}/unarchive`);
//   },
  
//   // Export chat logs (admin)
//   exportChatLogs: (params = {}) => {
//     return api.get('/chat/admin/export', { params, responseType: 'blob' });
//   },
  
//   // Export single chat logs (admin)
//   exportSingleChatLogs: (chatId, params = {}) => {
//     return api.get(`/chat/admin/chats/${chatId}/export`, { params, responseType: 'blob' });
//   },
  
//   // Get chat dashboard stats (admin)
//   getChatDashboardStats: () => {
//     return api.get('/chat/admin/dashboard-stats');
//   },
  
//   // ==================== MESSAGE SEARCH ====================
  
//   // Search messages
//   searchMessages: (query, params = {}) => {
//     return api.get('/chat/messages/search', { params: { q: query, ...params } });
//   },
  
//   // Search messages in specific chat
//   searchMessagesInChat: (chatId, query) => {
//     return api.get(`/chat/chats/${chatId}/messages/search`, { params: { q: query } });
//   },
  
//   // ==================== REACTIONS ====================
  
//   // Add reaction to message
//   addReaction: (messageId, reaction) => {
//     return api.post(`/chat/messages/${messageId}/reactions`, { reaction });
//   },
  
//   // Remove reaction from message
//   removeReaction: (messageId, reaction) => {
//     return api.delete(`/chat/messages/${messageId}/reactions/${reaction}`);
//   },
  
//   // ==================== NOTIFICATIONS ====================
  
//   // Get chat notification settings
//   getChatNotificationSettings: () => {
//     return api.get('/chat/notifications/settings');
//   },
  
//   // Update chat notification settings
//   updateChatNotificationSettings: (data) => {
//     return api.put('/chat/notifications/settings', data);
//   },
  
//   // ==================== TYPING INDICATORS ====================
  
//   // Send typing indicator (via socket, this is for API fallback)
//   sendTypingStatus: (chatId, isTyping) => {
//     return api.post(`/chat/chats/${chatId}/typing`, { isTyping });
//   },
  
//   // ==================== UNREAD COUNTS ====================
  
//   // Get total unread count
//   getTotalUnreadCount: () => {
//     return api.get('/chat/unread-count');
//   },
  
//   // Reset unread count for chat
//   resetUnreadCount: (chatId) => {
//     return api.put(`/chat/chats/${chatId}/unread/reset`);
//   },
  
//   // ==================== MESSAGE FORWARDING ====================
  
//   // Forward message to another chat
//   forwardMessage: (messageId, targetChatId) => {
//     return api.post(`/chat/messages/${messageId}/forward`, { targetChatId });
//   },
  
//   // ==================== MESSAGE PINNING ====================
  
//   // Pin message
//   pinMessage: (messageId) => {
//     return api.put(`/chat/messages/${messageId}/pin`);
//   },
  
//   // Unpin message
//   unpinMessage: (messageId) => {
//     return api.delete(`/chat/messages/${messageId}/pin`);
//   },
  
//   // Get pinned messages in chat
//   getPinnedMessages: (chatId) => {
//     return api.get(`/chat/chats/${chatId}/pinned-messages`);
//   }
// };

// export default chatApi;


// // client/src/api/chat.api.js
// import api from './axios.config';

// export const chatApi = {
//   // ==================== CHAT SETTINGS ====================
  
//   // Get user chat settings
//   getUserChatSettings: () => {
//     return api.get('/chat/settings');
//   },
  
//   // Update user chat settings (Super Admin only)
//   updateUserChatSettings: (userId, data) => {
//     return api.put(`/chat/settings/${userId}`, data);
//   },
  
//   // ==================== CHAT MANAGEMENT ====================
  
//   // Get or create direct chat
//   getOrCreateDirectChat: (targetUserId) => {
//     return api.post('/chat/direct', { targetUserId });
//   },
  
//   // Get user's chats
//   getUserChats: () => {
//     return api.get('/chat/chats');
//   },
  
//   // Get chat messages
//   getChatMessages: (chatId, page = 1, limit = 50) => {
//     return api.get(`/chat/chats/${chatId}/messages`, { params: { page, limit } });
//   },
  
//   // Get chat messages by date range
//   getChatMessagesByDateRange: (chatId, startDate, endDate) => {
//     return api.get(`/chat/chats/${chatId}/messages/date-range`, { 
//       params: { startDate, endDate } 
//     });
//   },
  
//   // Send message
//   sendMessage: (chatId, data) => {
//     return api.post(`/chat/chats/${chatId}/messages`, data);
//   },
  
//   // Send message with attachment
//   sendMessageWithAttachment: (chatId, formData) => {
//     return api.post(`/chat/chats/${chatId}/messages/attachment`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//   },
  
//   // Mark message as read
//   markAsRead: (messageId) => {
//     return api.put(`/chat/messages/${messageId}/read`);
//   },
  
//   // Mark all messages as read in a chat
//   markAllAsRead: (chatId) => {
//     return api.put(`/chat/chats/${chatId}/read-all`);
//   },
  
//   // Delete message
//   deleteMessage: (messageId) => {
//     return api.delete(`/chat/messages/${messageId}`);
//   },
  
//   // Delete message for everyone (admin only)
//   deleteMessageForEveryone: (messageId) => {
//     return api.delete(`/chat/messages/${messageId}/global`);
//   },
  
//   // Edit message
//   editMessage: (messageId, message) => {
//     return api.put(`/chat/messages/${messageId}`, { message });
//   },
  
//   // ==================== GROUP CHAT ====================
  
//   // Create group chat
//   createGroupChat: (data) => {
//     return api.post('/chat/groups', data);
//   },
  
//   // Update group chat
//   updateGroupChat: (groupId, data) => {
//     return api.put(`/chat/groups/${groupId}`, data);
//   },
  
//   // Add members to group
//   addGroupMembers: (groupId, userIds) => {
//     return api.post(`/chat/groups/${groupId}/members`, { userIds });
//   },
  
//   // Remove member from group
//   removeGroupMember: (groupId, userId) => {
//     return api.delete(`/chat/groups/${groupId}/members/${userId}`);
//   },
  
//   // Leave group
//   leaveGroup: (groupId) => {
//     return api.post(`/chat/groups/${groupId}/leave`);
//   },
  
//   // Get group details
//   getGroupDetails: (groupId) => {
//     return api.get(`/chat/groups/${groupId}`);
//   },
  
//   // ==================== TICKET CHAT ====================
  
//   // Create ticket-based chat
//   createTicketChat: (data) => {
//     return api.post('/chat/ticket', data);
//   },
  
//   // Get ticket chat by ticket ID
//   getTicketChat: (ticketId, ticketType) => {
//     return api.get(`/chat/ticket/${ticketId}`, { params: { ticketType } });
//   },
  
//   // ==================== USER MANAGEMENT ====================
  
//   // Get available users for chat
//   getAvailableUsers: () => {
//     return api.get('/chat/users/available');
//   },
  
//   // Search users for chat
//   searchUsers: (query) => {
//     return api.get('/chat/users/search', { params: { q: query } });
//   },
  
//   // Block user
//   blockUser: (userId, reason = '') => {
//     return api.post(`/chat/users/${userId}/block`, { reason });
//   },
  
//   // Unblock user
//   unblockUser: (userId) => {
//     return api.delete(`/chat/users/${userId}/block`);
//   },
  
//   // Get blocked users
//   getBlockedUsers: () => {
//     return api.get('/chat/users/blocked');
//   },
  
//   // ==================== STATISTICS & ANALYTICS ====================
  
//   // Get chat statistics (admin)
//   getChatStats: () => {
//     return api.get('/chat/stats');
//   },
  
//   // Get chat analytics (admin)
//   getChatAnalytics: (params = {}) => {
//     return api.get('/chat/analytics', { params });
//   },
  
//   // Get user chat activity
//   getUserChatActivity: (userId, params = {}) => {
//     return api.get(`/chat/users/${userId}/activity`, { params });
//   },
  
//   // Get chat response time stats
//   getResponseTimeStats: (params = {}) => {
//     return api.get('/chat/stats/response-time', { params });
//   },
  
//   // ==================== UNREAD COUNTS ====================
  
//   /**
//    * Get total unread count for current user
//    * @returns {Promise} - { count: number }
//    */
//   getTotalUnreadCount: async () => {
//     try {
//       console.log('📡 Fetching unread count from /chat/unread-count');
//       const response = await api.get('/chat/unread-count');
//       console.log('✅ Unread count response:', response.data);
//       return response;
//     } catch (error) {
//       console.error('❌ Unread count error:', error.response?.status, error.response?.data);
//       // Return mock response instead of throwing to prevent UI breaking
//       return { 
//         data: { 
//           success: true, 
//           data: { count: 0 } 
//         } 
//       };
//     }
//   },
  
//   // Reset unread count for chat
//   resetUnreadCount: (chatId) => {
//     return api.put(`/chat/chats/${chatId}/unread/reset`);
//   },
  
//   // ==================== ADMIN ONLY ====================
  
//   // Get all chats (admin)
//   getAllChats: (params = {}) => {
//     return api.get('/chat/admin/chats', { params });
//   },
  
//   // Get chat by ID (admin)
//   getChatById: (chatId) => {
//     return api.get(`/chat/admin/chats/${chatId}`);
//   },
  
//   // Delete chat (admin)
//   deleteChat: (chatId) => {
//     return api.delete(`/chat/admin/chats/${chatId}`);
//   },
  
//   // Archive chat (admin)
//   archiveChat: (chatId) => {
//     return api.put(`/chat/admin/chats/${chatId}/archive`);
//   },
  
//   // Unarchive chat (admin)
//   unarchiveChat: (chatId) => {
//     return api.put(`/chat/admin/chats/${chatId}/unarchive`);
//   },
  
//   // Export chat logs (admin)
//   exportChatLogs: (params = {}) => {
//     return api.get('/chat/admin/export', { params, responseType: 'blob' });
//   },
  
//   // Export single chat logs (admin)
//   exportSingleChatLogs: (chatId, params = {}) => {
//     return api.get(`/chat/admin/chats/${chatId}/export`, { params, responseType: 'blob' });
//   },
  
//   // Get chat dashboard stats (admin)
//   getChatDashboardStats: () => {
//     return api.get('/chat/admin/dashboard-stats');
//   },
  
//   // ==================== MESSAGE SEARCH ====================
  
//   // Search messages
//   searchMessages: (query, params = {}) => {
//     return api.get('/chat/messages/search', { params: { q: query, ...params } });
//   },
  
//   // Search messages in specific chat
//   searchMessagesInChat: (chatId, query) => {
//     return api.get(`/chat/chats/${chatId}/messages/search`, { params: { q: query } });
//   },
  
//   // ==================== REACTIONS ====================
  
//   // Add reaction to message
//   addReaction: (messageId, reaction) => {
//     return api.post(`/chat/messages/${messageId}/reactions`, { reaction });
//   },
  
//   // Remove reaction from message
//   removeReaction: (messageId, reaction) => {
//     return api.delete(`/chat/messages/${messageId}/reactions/${reaction}`);
//   },
  
//   // ==================== NOTIFICATIONS ====================
  
//   // Get chat notification settings
//   getChatNotificationSettings: () => {
//     return api.get('/chat/notifications/settings');
//   },
  
//   // Update chat notification settings
//   updateChatNotificationSettings: (data) => {
//     return api.put('/chat/notifications/settings', data);
//   },
  
//   // ==================== TYPING INDICATORS ====================
  
//   // Send typing indicator (via socket, this is for API fallback)
//   sendTypingStatus: (chatId, isTyping) => {
//     return api.post(`/chat/chats/${chatId}/typing`, { isTyping });
//   },
  
//   // ==================== MESSAGE FORWARDING ====================
  
//   // Forward message to another chat
//   forwardMessage: (messageId, targetChatId) => {
//     return api.post(`/chat/messages/${messageId}/forward`, { targetChatId });
//   },
  
//   // ==================== MESSAGE PINNING ====================
  
//   // Pin message
//   pinMessage: (messageId) => {
//     return api.put(`/chat/messages/${messageId}/pin`);
//   },
  
//   // Unpin message
//   unpinMessage: (messageId) => {
//     return api.delete(`/chat/messages/${messageId}/pin`);
//   },
  
//   // Get pinned messages in chat
//   getPinnedMessages: (chatId) => {
//     return api.get(`/chat/chats/${chatId}/pinned-messages`);
//   }
// };

// export default chatApi;








/**
 * Chat API Module
 * 
 * This module provides all chat-related API methods for the FMS Enterprise system.
 * It integrates with multiple interfaces and functional modules including:
 * 
 * 1. **ChatModule Component** - Main chat interface for real-time messaging
 * 2. **Dashboard Widget** - Unread message counts and chat statistics
 * 3. **Notification System** - Real-time message notifications
 * 4. **Admin Panel** - Chat monitoring and management
 * 5. **Ticket System** - Ticket-based conversation threads
 * 6. **Group Management** - Group chat creation and administration
 * 7. **User Profile** - User chat settings and preferences
 * 8. **Search Module** - Message and user search functionality
 * 
 * @module chatApi
 * @requires axios
 */

import api from './axios.config';

// Helper for debug logging (can be enabled via localStorage)
const DEBUG = localStorage.getItem('debug_api') === 'true';

const debugLog = (method, url, data = null) => {
  if (DEBUG) {
    console.log(`[Chat API] ${method} ${url}`);
    if (data) console.log('Data:', data);
  }
};

// Error handler wrapper for consistent error handling
const handleApiCall = async (apiCall, method, url, data = null) => {
  try {
    debugLog(method, url, data);
    const response = await apiCall();
    if (DEBUG && response.data) {
      console.log(`[Chat API] ${method} ${url} - Success:`, response.status);
    }
    return response;
  } catch (error) {
    console.error(`[Chat API Error] ${method} ${url}:`, error.response?.data || error.message);
    
    const enhancedError = {
      ...error,
      userMessage: error.response?.data?.error || error.response?.data?.message || 'An error occurred',
      statusCode: error.response?.status,
      endpoint: url,
      method: method
    };
    
    throw enhancedError;
  }
};

export const chatApi = {
  // ==================== USER CHAT SETTINGS ====================
  /**
   * Get current user's chat settings
   * @returns {Promise} - User's chat preferences (notifications, theme, blocked users)
   * @integration Used by ChatModule to load user preferences and settings panel
   */
  getUserChatSettings: () => {
    return handleApiCall(
      () => api.get('/chat/settings'),
      'GET',
      '/chat/settings'
    );
  },

  /**
   * Update user chat settings (Super Admin only)
   * @param {string} userId - Target user ID
   * @param {Object} data - Settings to update
   * @param {boolean} data.chatEnabled - Enable/disable chat for user
   * @param {Object} data.notifications - Notification preferences
   * @returns {Promise} - Updated settings
   * @integration Used by Admin Panel to manage user chat permissions
   */
  updateUserChatSettings: (userId, data) => {
    return handleApiCall(
      () => api.put(`/chat/settings/${userId}`, data),
      'PUT',
      `/chat/settings/${userId}`,
      data
    );
  },

  // ==================== DIRECT CHAT MANAGEMENT ====================
  /**
   * Get or create a direct chat with another user
   * @param {string} targetUserId - ID of user to chat with
   * @returns {Promise} - Chat object with participants and metadata
   * @integration Used by ChatModule when starting a new conversation
   * @integration Used by User Profile's "Message" button
   */
  getOrCreateDirectChat: (targetUserId) => {
    return handleApiCall(
      () => api.post('/chat/direct', { targetUserId }),
      'POST',
      '/chat/direct',
      { targetUserId }
    );
  },

  /**
   * Get all chats for current user
   * @returns {Promise} - Array of chat objects with last message and unread counts
   * @integration Used by ChatModule sidebar to display chat list
   * @integration Used by Dashboard widget to show recent conversations
   */
  getUserChats: () => {
    return handleApiCall(
      () => api.get('/chat/chats'),
      'GET',
      '/chat/chats'
    );
  },

  /**
   * Get messages for a specific chat with pagination
   * @param {string} chatId - Chat ID
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Messages per page (default: 50)
   * @returns {Promise} - Paginated messages with sender details
   * @integration Used by ChatModule message area to load conversation history
   * @integration Used by Search Results to fetch messages from specific chat
   */
  getChatMessages: (chatId, page = 1, limit = 50) => {
    return handleApiCall(
      () => api.get(`/chat/chats/${chatId}/messages`, { params: { page, limit } }),
      'GET',
      `/chat/chats/${chatId}/messages`,
      { page, limit }
    );
  },

  /**
   * Get messages within date range for a chat
   * @param {string} chatId - Chat ID
   * @param {string} startDate - ISO date string
   * @param {string} endDate - ISO date string
   * @returns {Promise} - Messages within date range
   * @integration Used by Admin Reports for chat history export
   * @integration Used by Analytics module for message trend analysis
   */
  getChatMessagesByDateRange: (chatId, startDate, endDate) => {
    return handleApiCall(
      () => api.get(`/chat/chats/${chatId}/messages/date-range`, { 
        params: { startDate, endDate } 
      }),
      'GET',
      `/chat/chats/${chatId}/messages/date-range`,
      { startDate, endDate }
    );
  },

  /**
   * Send a text message to a chat
   * @param {string} chatId - Chat ID
   * @param {Object} data - Message data
   * @param {string} data.message - Message text
   * @param {string} data.messageType - Type of message (text, location, etc.)
   * @param {Object} data.location - Location data if applicable
   * @returns {Promise} - Created message object
   * @integration Core method used by ChatModule for sending messages
   */
  sendMessage: (chatId, data) => {
    return handleApiCall(
      () => api.post(`/chat/chats/${chatId}/messages`, data),
      'POST',
      `/chat/chats/${chatId}/messages`,
      data
    );
  },

  /**
   * Send a message with file attachment
   * @param {string} chatId - Chat ID
   * @param {FormData} formData - Form data containing file and message
   * @returns {Promise} - Created message with attachment
   * @integration Used by ChatModule for file/image sharing
   * @integration Used by Ticket System for attaching files to tickets
   */
  sendMessageWithAttachment: (chatId, formData) => {
    return handleApiCall(
      () => api.post(`/chat/chats/${chatId}/messages/attachment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000 // 60 second timeout for file uploads
      }),
      'POST',
      `/chat/chats/${chatId}/messages/attachment`,
      formData
    );
  },

  /**
   * Mark a single message as read
   * @param {string} messageId - Message ID
   * @returns {Promise} - Success status
   * @integration Used by ChatModule when viewing messages
   * @integration Triggers socket event for read receipts
   */
  markAsRead: (messageId) => {
    return handleApiCall(
      () => api.put(`/chat/messages/${messageId}/read`),
      'PUT',
      `/chat/messages/${messageId}/read`
    );
  },

  /**
   * Mark all messages in a chat as read
   * @param {string} chatId - Chat ID
   * @returns {Promise} - Success status
   * @integration Used when user opens a chat to clear unread badge
   * @integration Used by Notification System to clear unread counts
   */
  markAllAsRead: (chatId) => {
    return handleApiCall(
      () => api.put(`/chat/chats/${chatId}/read-all`),
      'PUT',
      `/chat/chats/${chatId}/read-all`
    );
  },

  /**
   * Delete a message (soft delete for user)
   * @param {string} messageId - Message ID
   * @returns {Promise} - Success status
   * @integration Used by ChatModule message options menu
   */
  deleteMessage: (messageId) => {
    return handleApiCall(
      () => api.delete(`/chat/messages/${messageId}`),
      'DELETE',
      `/chat/messages/${messageId}`
    );
  },

  /**
   * Delete message for all users (Admin only)
   * @param {string} messageId - Message ID
   * @returns {Promise} - Success status
   * @integration Used by Admin Panel for content moderation
   */
  deleteMessageForEveryone: (messageId) => {
    return handleApiCall(
      () => api.delete(`/chat/messages/${messageId}/global`),
      'DELETE',
      `/chat/messages/${messageId}/global`
    );
  },

  /**
   * Edit an existing message
   * @param {string} messageId - Message ID
   * @param {string} message - New message text
   * @returns {Promise} - Updated message
   * @integration Used by ChatModule for message editing feature
   */
  editMessage: (messageId, message) => {
    return handleApiCall(
      () => api.put(`/chat/messages/${messageId}`, { message }),
      'PUT',
      `/chat/messages/${messageId}`,
      { message }
    );
  },

  // ==================== GROUP CHAT ====================
  /**
   * Create a new group chat
   * @param {Object} data - Group data
   * @param {string} data.groupName - Group name
   * @param {string} data.groupDescription - Group description (optional)
   * @param {Array} data.participants - Array of user IDs
   * @param {string} data.groupIcon - Group icon URL (optional)
   * @returns {Promise} - Created group chat object
   * @integration Used by ChatModule "New Group" feature
   * @integration Used by Team Collaboration module
   */
  createGroupChat: (data) => {
    return handleApiCall(
      () => api.post('/chat/groups', data),
      'POST',
      '/chat/groups',
      data
    );
  },

  /**
   * Update group chat details
   * @param {string} groupId - Group ID
   * @param {Object} data - Updated group data
   * @returns {Promise} - Updated group chat
   * @integration Used by Group Settings panel
   */
  updateGroupChat: (groupId, data) => {
    return handleApiCall(
      () => api.put(`/chat/groups/${groupId}`, data),
      'PUT',
      `/chat/groups/${groupId}`,
      data
    );
  },

  /**
   * Add members to a group chat
   * @param {string} groupId - Group ID
   * @param {Array} userIds - Array of user IDs to add
   * @returns {Promise} - Updated group with new members
   * @integration Used by Group Member Management interface
   */
  addGroupMembers: (groupId, userIds) => {
    return handleApiCall(
      () => api.post(`/chat/groups/${groupId}/members`, { userIds }),
      'POST',
      `/chat/groups/${groupId}/members`,
      { userIds }
    );
  },

  /**
   * Remove a member from group chat
   * @param {string} groupId - Group ID
   * @param {string} userId - User ID to remove
   * @returns {Promise} - Success status
   * @integration Used by Group Admin management
   */
  removeGroupMember: (groupId, userId) => {
    return handleApiCall(
      () => api.delete(`/chat/groups/${groupId}/members/${userId}`),
      'DELETE',
      `/chat/groups/${groupId}/members/${userId}`
    );
  },

  /**
   * Leave a group chat
   * @param {string} groupId - Group ID
   * @returns {Promise} - Success status
   * @integration Used by ChatModule "Leave Group" option
   */
  leaveGroup: (groupId) => {
    return handleApiCall(
      () => api.post(`/chat/groups/${groupId}/leave`),
      'POST',
      `/chat/groups/${groupId}/leave`
    );
  },

  /**
   * Get detailed group information
   * @param {string} groupId - Group ID
   * @returns {Promise} - Group details with members
   * @integration Used by Group Info panel
   */
  getGroupDetails: (groupId) => {
    return handleApiCall(
      () => api.get(`/chat/groups/${groupId}`),
      'GET',
      `/chat/groups/${groupId}`
    );
  },

  // ==================== TICKET CHAT ====================
  /**
   * Create a ticket-based chat (for support tickets)
   * @param {Object} data - Ticket chat data
   * @param {string} data.ticketId - Ticket ID
   * @param {string} data.ticketType - Type of ticket (complaint/task)
   * @param {string} data.assignedToId - Assigned user ID
   * @returns {Promise} - Created ticket chat
   * @integration Used by Ticket System to create conversation threads
   * @integration Integrated with Complaint and Task modules
   */
  createTicketChat: (data) => {
    return handleApiCall(
      () => api.post('/chat/ticket', data),
      'POST',
      '/chat/ticket',
      data
    );
  },

  /**
   * Get chat associated with a ticket
   * @param {string} ticketId - Ticket ID
   * @param {string} ticketType - Type of ticket
   * @returns {Promise} - Ticket chat object
   * @integration Used by Ticket Detail page to load conversation
   */
  getTicketChat: (ticketId, ticketType) => {
    return handleApiCall(
      () => api.get(`/chat/ticket/${ticketId}`, { params: { ticketType } }),
      'GET',
      `/chat/ticket/${ticketId}`,
      { ticketType }
    );
  },

  // ==================== USER MANAGEMENT ====================
  /**
   * Get available users for starting new chats
   * @returns {Promise} - List of users with chat enabled
   * @integration Used by ChatModule "New Chat" modal
   * @integration Filtered by permission matrix
   */
  getAvailableUsers: () => {
    return handleApiCall(
      () => api.get('/chat/users/available'),
      'GET',
      '/chat/users/available'
    );
  },

  /**
   * Search for users to chat with
   * @param {string} query - Search query (name or email)
   * @returns {Promise} - Filtered user list
   * @integration Used by ChatModule search feature
   */
  searchUsers: (query) => {
    return handleApiCall(
      () => api.get('/chat/users/search', { params: { q: query } }),
      'GET',
      '/chat/users/search',
      { q: query }
    );
  },

  /**
   * Block a user from chatting
   * @param {string} userId - User ID to block
   * @param {string} reason - Reason for blocking (optional)
   * @returns {Promise} - Success status
   * @integration Used by ChatModule user menu option
   */
  blockUser: (userId, reason = '') => {
    return handleApiCall(
      () => api.post(`/chat/users/${userId}/block`, { reason }),
      'POST',
      `/chat/users/${userId}/block`,
      { reason }
    );
  },

  /**
   * Unblock a previously blocked user
   * @param {string} userId - User ID to unblock
   * @returns {Promise} - Success status
   * @integration Used by Settings > Blocked Users list
   */
  unblockUser: (userId) => {
    return handleApiCall(
      () => api.delete(`/chat/users/${userId}/block`),
      'DELETE',
      `/chat/users/${userId}/block`
    );
  },

  /**
   * Get list of blocked users
   * @returns {Promise} - Array of blocked users with blocking details
   * @integration Used by Settings > Privacy & Security
   */
  getBlockedUsers: () => {
    return handleApiCall(
      () => api.get('/chat/users/blocked'),
      'GET',
      '/chat/users/blocked'
    );
  },

  // ==================== STATISTICS & ANALYTICS ====================
  /**
   * Get chat statistics for dashboard
   * @returns {Promise} - Statistics including total messages, active chats, etc.
   * @integration Used by Admin Dashboard widgets
   * @integration Used by Analytics module for reporting
   */
  getChatStats: () => {
    return handleApiCall(
      () => api.get('/chat/stats'),
      'GET',
      '/chat/stats'
    );
  },

  /**
   * Get detailed chat analytics
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period (day/week/month/year)
   * @returns {Promise} - Analytics data including trends, top chatters
   * @integration Used by Analytics Dashboard
   */
  getChatAnalytics: (params = {}) => {
    return handleApiCall(
      () => api.get('/chat/analytics', { params }),
      'GET',
      '/chat/analytics',
      params
    );
  },

  /**
   * Get chat activity for a specific user
   * @param {string} userId - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise} - User's chat activity data
   * @integration Used by User Profile > Activity tab
   * @integration Used by HR reports
   */
  getUserChatActivity: (userId, params = {}) => {
    return handleApiCall(
      () => api.get(`/chat/users/${userId}/activity`, { params }),
      'GET',
      `/chat/users/${userId}/activity`,
      params
    );
  },

  /**
   * Get response time statistics for support chats
   * @param {Object} params - Query parameters (date range, department)
   * @returns {Promise} - Response time metrics
   * @integration Used by Support Team dashboard
   * @integration Used by SLA monitoring
   */
  getResponseTimeStats: (params = {}) => {
    return handleApiCall(
      () => api.get('/chat/stats/response-time', { params }),
      'GET',
      '/chat/stats/response-time',
      params
    );
  },

  // ==================== UNREAD COUNTS ====================
  /**
   * Get total unread message count for current user
   * @returns {Promise<Object>} - { count: number }
   * @integration Used by Dashboard to show notification badge
   * @integration Used by Header component for message indicator
   * @integration Used by ChatModule sidebar for unread badges
   */
  getTotalUnreadCount: async () => {
    try {
      debugLog('GET', '/chat/unread-count');
      const response = await api.get('/chat/unread-count');
      if (DEBUG) console.log('✅ Unread count response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Unread count error:', error.response?.status, error.response?.data);
      // Return mock response to prevent UI breaking
      return { 
        data: { 
          success: true, 
          data: { count: 0 } 
        } 
      };
    }
  },

  /**
   * Reset unread count for a specific chat
   * @param {string} chatId - Chat ID
   * @returns {Promise} - Success status
   * @integration Called automatically when user opens a chat
   */
  resetUnreadCount: (chatId) => {
    return handleApiCall(
      () => api.put(`/chat/chats/${chatId}/unread/reset`),
      'PUT',
      `/chat/chats/${chatId}/unread/reset`
    );
  },

  // ==================== ADMIN PANEL ====================
  /**
   * Get all chats for admin monitoring
   * @param {Object} params - Pagination and filter parameters
   * @returns {Promise} - Paginated list of all chats
   * @integration Used by Admin Panel > Chat Monitoring
   */
  getAllChats: (params = {}) => {
    return handleApiCall(
      () => api.get('/chat/admin/chats', { params }),
      'GET',
      '/chat/admin/chats',
      params
    );
  },

  /**
   * Get detailed chat information for admin
   * @param {string} chatId - Chat ID
   * @returns {Promise} - Complete chat details with all messages
   * @integration Used by Admin Panel for chat inspection
   */
  getChatById: (chatId) => {
    return handleApiCall(
      () => api.get(`/chat/admin/chats/${chatId}`),
      'GET',
      `/chat/admin/chats/${chatId}`
    );
  },

  /**
   * Delete an entire chat (Admin only)
   * @param {string} chatId - Chat ID
   * @returns {Promise} - Success status
   * @integration Used by Admin Panel for chat removal
   */
  deleteChat: (chatId) => {
    return handleApiCall(
      () => api.delete(`/chat/admin/chats/${chatId}`),
      'DELETE',
      `/chat/admin/chats/${chatId}`
    );
  },

  /**
   * Archive a chat (Admin only)
   * @param {string} chatId - Chat ID
   * @returns {Promise} - Success status
   * @integration Used by Admin Panel for chat archiving
   */
  archiveChat: (chatId) => {
    return handleApiCall(
      () => api.put(`/chat/admin/chats/${chatId}/archive`),
      'PUT',
      `/chat/admin/chats/${chatId}/archive`
    );
  },

  /**
   * Unarchive a chat (Admin only)
   * @param {string} chatId - Chat ID
   * @returns {Promise} - Success status
   * @integration Used by Admin Panel to restore archived chats
   */
  unarchiveChat: (chatId) => {
    return handleApiCall(
      () => api.put(`/chat/admin/chats/${chatId}/unarchive`),
      'PUT',
      `/chat/admin/chats/${chatId}/unarchive`
    );
  },

  /**
   * Export chat logs to CSV/JSON (Admin only)
   * @param {Object} params - Export parameters (date range, chatId, format)
   * @returns {Promise} - Blob file for download
   * @integration Used by Admin Reports for data export
   */
  exportChatLogs: (params = {}) => {
    return handleApiCall(
      () => api.get('/chat/admin/export', { params, responseType: 'blob' }),
      'GET',
      '/chat/admin/export',
      params
    );
  },

  /**
   * Export single chat logs (Admin only)
   * @param {string} chatId - Chat ID
   * @param {Object} params - Export parameters
   * @returns {Promise} - Blob file for download
   * @integration Used by Admin Panel per-chat export
   */
  exportSingleChatLogs: (chatId, params = {}) => {
    return handleApiCall(
      () => api.get(`/chat/admin/chats/${chatId}/export`, { params, responseType: 'blob' }),
      'GET',
      `/chat/admin/chats/${chatId}/export`,
      params
    );
  },

  /**
   * Get chat dashboard statistics (Admin only)
   * @returns {Promise} - Comprehensive dashboard stats
   * @integration Used by Admin Dashboard chat widget
   */
  getChatDashboardStats: () => {
    return handleApiCall(
      () => api.get('/chat/admin/dashboard-stats'),
      'GET',
      '/chat/admin/dashboard-stats'
    );
  },

  // ==================== MESSAGE SEARCH ====================
  /**
   * Search messages across all user's chats
   * @param {string} query - Search query
   * @param {Object} params - Additional parameters
   * @returns {Promise} - Search results with message previews
   * @integration Used by ChatModule search feature
   * @integration Used by Global Search component
   */
  searchMessages: (query, params = {}) => {
    return handleApiCall(
      () => api.get('/chat/messages/search', { params: { q: query, ...params } }),
      'GET',
      '/chat/messages/search',
      { q: query, ...params }
    );
  },

  /**
   * Search messages within a specific chat
   * @param {string} chatId - Chat ID
   * @param {string} query - Search query
   * @returns {Promise} - Search results within the chat
   * @integration Used by ChatModule in-chat search
   */
  searchMessagesInChat: (chatId, query) => {
    return handleApiCall(
      () => api.get(`/chat/chats/${chatId}/messages/search`, { params: { q: query } }),
      'GET',
      `/chat/chats/${chatId}/messages/search`,
      { q: query }
    );
  },

  // ==================== REACTIONS ====================
  /**
   * Add reaction to a message
   * @param {string} messageId - Message ID
   * @param {string} reaction - Emoji reaction (👍, ❤️, 😂, etc.)
   * @returns {Promise} - Updated message with reactions
   * @integration Used by ChatModule message reactions feature
   */
  addReaction: (messageId, reaction) => {
    return handleApiCall(
      () => api.post(`/chat/messages/${messageId}/reactions`, { reaction }),
      'POST',
      `/chat/messages/${messageId}/reactions`,
      { reaction }
    );
  },

  /**
   * Remove reaction from a message
   * @param {string} messageId - Message ID
   * @param {string} reaction - Reaction to remove
   * @returns {Promise} - Updated message
   * @integration Used by ChatModule message reactions feature
   */
  removeReaction: (messageId, reaction) => {
    return handleApiCall(
      () => api.delete(`/chat/messages/${messageId}/reactions/${reaction}`),
      'DELETE',
      `/chat/messages/${messageId}/reactions/${reaction}`
    );
  },

  // ==================== NOTIFICATION SETTINGS ====================
  /**
   * Get chat notification settings
   * @returns {Promise} - Notification preferences
   * @integration Used by Settings > Notifications
   */
  getChatNotificationSettings: () => {
    return handleApiCall(
      () => api.get('/chat/notifications/settings'),
      'GET',
      '/chat/notifications/settings'
    );
  },

  /**
   * Update chat notification settings
   * @param {Object} data - Notification settings
   * @returns {Promise} - Updated settings
   * @integration Used by Settings > Notifications
   */
  updateChatNotificationSettings: (data) => {
    return handleApiCall(
      () => api.put('/chat/notifications/settings', data),
      'PUT',
      '/chat/notifications/settings',
      data
    );
  },

  // ==================== TYPING INDICATORS ====================
  /**
   * Send typing status (API fallback when socket is unavailable)
   * @param {string} chatId - Chat ID
   * @param {boolean} isTyping - Whether user is typing
   * @returns {Promise} - Success status
   * @integration Fallback for socket-based typing indicators
   */
  sendTypingStatus: (chatId, isTyping) => {
    return handleApiCall(
      () => api.post(`/chat/chats/${chatId}/typing`, { isTyping }),
      'POST',
      `/chat/chats/${chatId}/typing`,
      { isTyping }
    );
  },

  // ==================== MESSAGE FORWARDING ====================
  /**
   * Forward a message to another chat
   * @param {string} messageId - Original message ID
   * @param {string} targetChatId - Destination chat ID
   * @returns {Promise} - Forwarded message
   * @integration Used by ChatModule forward feature
   */
  forwardMessage: (messageId, targetChatId) => {
    return handleApiCall(
      () => api.post(`/chat/messages/${messageId}/forward`, { targetChatId }),
      'POST',
      `/chat/messages/${messageId}/forward`,
      { targetChatId }
    );
  },

  // ==================== MESSAGE PINNING ====================
  /**
   * Pin a message to the top of chat
   * @param {string} messageId - Message ID
   * @returns {Promise} - Success status
   * @integration Used by ChatModule message options menu
   */
  pinMessage: (messageId) => {
    return handleApiCall(
      () => api.put(`/chat/messages/${messageId}/pin`),
      'PUT',
      `/chat/messages/${messageId}/pin`
    );
  },

  /**
   * Unpin a previously pinned message
   * @param {string} messageId - Message ID
   * @returns {Promise} - Success status
   * @integration Used by ChatModule pinned messages section
   */
  unpinMessage: (messageId) => {
    return handleApiCall(
      () => api.delete(`/chat/messages/${messageId}/pin`),
      'DELETE',
      `/chat/messages/${messageId}/pin`
    );
  },

  /**
   * Get all pinned messages in a chat
   * @param {string} chatId - Chat ID
   * @returns {Promise} - List of pinned messages
   * @integration Used by ChatModule pinned messages sidebar
   */
  getPinnedMessages: (chatId) => {
    return handleApiCall(
      () => api.get(`/chat/chats/${chatId}/pinned-messages`),
      'GET',
      `/chat/chats/${chatId}/pinned-messages`
    );
  }
};

export default chatApi;