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


// client/src/api/chat.api.js
import api from './axios.config';

export const chatApi = {
  // ==================== CHAT SETTINGS ====================
  
  // Get user chat settings
  getUserChatSettings: () => {
    return api.get('/chat/settings');
  },
  
  // Update user chat settings (Super Admin only)
  updateUserChatSettings: (userId, data) => {
    return api.put(`/chat/settings/${userId}`, data);
  },
  
  // ==================== CHAT MANAGEMENT ====================
  
  // Get or create direct chat
  getOrCreateDirectChat: (targetUserId) => {
    return api.post('/chat/direct', { targetUserId });
  },
  
  // Get user's chats
  getUserChats: () => {
    return api.get('/chat/chats');
  },
  
  // Get chat messages
  getChatMessages: (chatId, page = 1, limit = 50) => {
    return api.get(`/chat/chats/${chatId}/messages`, { params: { page, limit } });
  },
  
  // Get chat messages by date range
  getChatMessagesByDateRange: (chatId, startDate, endDate) => {
    return api.get(`/chat/chats/${chatId}/messages/date-range`, { 
      params: { startDate, endDate } 
    });
  },
  
  // Send message
  sendMessage: (chatId, data) => {
    return api.post(`/chat/chats/${chatId}/messages`, data);
  },
  
  // Send message with attachment
  sendMessageWithAttachment: (chatId, formData) => {
    return api.post(`/chat/chats/${chatId}/messages/attachment`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Mark message as read
  markAsRead: (messageId) => {
    return api.put(`/chat/messages/${messageId}/read`);
  },
  
  // Mark all messages as read in a chat
  markAllAsRead: (chatId) => {
    return api.put(`/chat/chats/${chatId}/read-all`);
  },
  
  // Delete message
  deleteMessage: (messageId) => {
    return api.delete(`/chat/messages/${messageId}`);
  },
  
  // Delete message for everyone (admin only)
  deleteMessageForEveryone: (messageId) => {
    return api.delete(`/chat/messages/${messageId}/global`);
  },
  
  // Edit message
  editMessage: (messageId, message) => {
    return api.put(`/chat/messages/${messageId}`, { message });
  },
  
  // ==================== GROUP CHAT ====================
  
  // Create group chat
  createGroupChat: (data) => {
    return api.post('/chat/groups', data);
  },
  
  // Update group chat
  updateGroupChat: (groupId, data) => {
    return api.put(`/chat/groups/${groupId}`, data);
  },
  
  // Add members to group
  addGroupMembers: (groupId, userIds) => {
    return api.post(`/chat/groups/${groupId}/members`, { userIds });
  },
  
  // Remove member from group
  removeGroupMember: (groupId, userId) => {
    return api.delete(`/chat/groups/${groupId}/members/${userId}`);
  },
  
  // Leave group
  leaveGroup: (groupId) => {
    return api.post(`/chat/groups/${groupId}/leave`);
  },
  
  // Get group details
  getGroupDetails: (groupId) => {
    return api.get(`/chat/groups/${groupId}`);
  },
  
  // ==================== TICKET CHAT ====================
  
  // Create ticket-based chat
  createTicketChat: (data) => {
    return api.post('/chat/ticket', data);
  },
  
  // Get ticket chat by ticket ID
  getTicketChat: (ticketId, ticketType) => {
    return api.get(`/chat/ticket/${ticketId}`, { params: { ticketType } });
  },
  
  // ==================== USER MANAGEMENT ====================
  
  // Get available users for chat
  getAvailableUsers: () => {
    return api.get('/chat/users/available');
  },
  
  // Search users for chat
  searchUsers: (query) => {
    return api.get('/chat/users/search', { params: { q: query } });
  },
  
  // Block user
  blockUser: (userId, reason = '') => {
    return api.post(`/chat/users/${userId}/block`, { reason });
  },
  
  // Unblock user
  unblockUser: (userId) => {
    return api.delete(`/chat/users/${userId}/block`);
  },
  
  // Get blocked users
  getBlockedUsers: () => {
    return api.get('/chat/users/blocked');
  },
  
  // ==================== STATISTICS & ANALYTICS ====================
  
  // Get chat statistics (admin)
  getChatStats: () => {
    return api.get('/chat/stats');
  },
  
  // Get chat analytics (admin)
  getChatAnalytics: (params = {}) => {
    return api.get('/chat/analytics', { params });
  },
  
  // Get user chat activity
  getUserChatActivity: (userId, params = {}) => {
    return api.get(`/chat/users/${userId}/activity`, { params });
  },
  
  // Get chat response time stats
  getResponseTimeStats: (params = {}) => {
    return api.get('/chat/stats/response-time', { params });
  },
  
  // ==================== UNREAD COUNTS ====================
  
  /**
   * Get total unread count for current user
   * @returns {Promise} - { count: number }
   */
  getTotalUnreadCount: async () => {
    try {
      console.log('📡 Fetching unread count from /chat/unread-count');
      const response = await api.get('/chat/unread-count');
      console.log('✅ Unread count response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Unread count error:', error.response?.status, error.response?.data);
      // Return mock response instead of throwing to prevent UI breaking
      return { 
        data: { 
          success: true, 
          data: { count: 0 } 
        } 
      };
    }
  },
  
  // Reset unread count for chat
  resetUnreadCount: (chatId) => {
    return api.put(`/chat/chats/${chatId}/unread/reset`);
  },
  
  // ==================== ADMIN ONLY ====================
  
  // Get all chats (admin)
  getAllChats: (params = {}) => {
    return api.get('/chat/admin/chats', { params });
  },
  
  // Get chat by ID (admin)
  getChatById: (chatId) => {
    return api.get(`/chat/admin/chats/${chatId}`);
  },
  
  // Delete chat (admin)
  deleteChat: (chatId) => {
    return api.delete(`/chat/admin/chats/${chatId}`);
  },
  
  // Archive chat (admin)
  archiveChat: (chatId) => {
    return api.put(`/chat/admin/chats/${chatId}/archive`);
  },
  
  // Unarchive chat (admin)
  unarchiveChat: (chatId) => {
    return api.put(`/chat/admin/chats/${chatId}/unarchive`);
  },
  
  // Export chat logs (admin)
  exportChatLogs: (params = {}) => {
    return api.get('/chat/admin/export', { params, responseType: 'blob' });
  },
  
  // Export single chat logs (admin)
  exportSingleChatLogs: (chatId, params = {}) => {
    return api.get(`/chat/admin/chats/${chatId}/export`, { params, responseType: 'blob' });
  },
  
  // Get chat dashboard stats (admin)
  getChatDashboardStats: () => {
    return api.get('/chat/admin/dashboard-stats');
  },
  
  // ==================== MESSAGE SEARCH ====================
  
  // Search messages
  searchMessages: (query, params = {}) => {
    return api.get('/chat/messages/search', { params: { q: query, ...params } });
  },
  
  // Search messages in specific chat
  searchMessagesInChat: (chatId, query) => {
    return api.get(`/chat/chats/${chatId}/messages/search`, { params: { q: query } });
  },
  
  // ==================== REACTIONS ====================
  
  // Add reaction to message
  addReaction: (messageId, reaction) => {
    return api.post(`/chat/messages/${messageId}/reactions`, { reaction });
  },
  
  // Remove reaction from message
  removeReaction: (messageId, reaction) => {
    return api.delete(`/chat/messages/${messageId}/reactions/${reaction}`);
  },
  
  // ==================== NOTIFICATIONS ====================
  
  // Get chat notification settings
  getChatNotificationSettings: () => {
    return api.get('/chat/notifications/settings');
  },
  
  // Update chat notification settings
  updateChatNotificationSettings: (data) => {
    return api.put('/chat/notifications/settings', data);
  },
  
  // ==================== TYPING INDICATORS ====================
  
  // Send typing indicator (via socket, this is for API fallback)
  sendTypingStatus: (chatId, isTyping) => {
    return api.post(`/chat/chats/${chatId}/typing`, { isTyping });
  },
  
  // ==================== MESSAGE FORWARDING ====================
  
  // Forward message to another chat
  forwardMessage: (messageId, targetChatId) => {
    return api.post(`/chat/messages/${messageId}/forward`, { targetChatId });
  },
  
  // ==================== MESSAGE PINNING ====================
  
  // Pin message
  pinMessage: (messageId) => {
    return api.put(`/chat/messages/${messageId}/pin`);
  },
  
  // Unpin message
  unpinMessage: (messageId) => {
    return api.delete(`/chat/messages/${messageId}/pin`);
  },
  
  // Get pinned messages in chat
  getPinnedMessages: (chatId) => {
    return api.get(`/chat/chats/${chatId}/pinned-messages`);
  }
};

export default chatApi;