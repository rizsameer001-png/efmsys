// client/src/api/user.api.js
// import api from './axios.config';
// import { API_ENDPOINTS } from './endpoints';

// export const userApi = {
//   // Get all users
//   getUsers: async (params = {}) => {
//     try {
//       const response = await api.get(API_ENDPOINTS.USERS, { params });
//       // Ensure consistent response structure
//       return {
//         ...response,
//         data: {
//           success: response.data.success,
//           data: response.data.data || { users: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } }
//         }
//       };
//     } catch (error) {
//       console.error('Get users error:', error);
//       throw error;
//     }
//   },

//   // Get user by ID
//   getUserById: (id) => {
//     return api.get(`${API_ENDPOINTS.USERS}/${id}`);
//   },

//   // Create user
//   createUser: (userData) => {
//     return api.post(API_ENDPOINTS.USERS, userData);
//   },

//   // Update user
//   updateUser: (id, userData) => {
//     return api.put(`${API_ENDPOINTS.USERS}/${id}`, userData);
//   },

//   // Delete user
//   deleteUser: (id) => {
//     return api.delete(`${API_ENDPOINTS.USERS}/${id}`);
//   },

//   // Bulk import users
//   bulkImportUsers: (users) => {
//     return api.post(API_ENDPOINTS.USERS_BULK_IMPORT, { users });
//   },

//   // Export users
//   exportUsers: (params = {}) => {
//     return api.get(API_ENDPOINTS.USERS_EXPORT, { params });
//   },
// };


// // client/src/api/user.api.js
// import api from './axios.config';
// import { API_ENDPOINTS } from './endpoints';

// export const userApi = {
//   // Get all users
//   getUsers: async (params = {}) => {
//     try {
//       const response = await api.get(API_ENDPOINTS.USERS, { params });
      
//       // Handle different response structures
//       let users = [];
//       let pagination = { page: 1, limit: 10, total: 0, pages: 0 };
      
//       if (response.data.success) {
//         // Check if data is an object with users property
//         if (response.data.data && response.data.data.users) {
//           users = response.data.data.users;
//           pagination = response.data.data.pagination || pagination;
//         } 
//         // Check if data is directly an array
//         else if (Array.isArray(response.data.data)) {
//           users = response.data.data;
//         }
//         // Check if response.data is an array
//         else if (Array.isArray(response.data)) {
//           users = response.data;
//         }
//       }
      
//       return {
//         ...response,
//         data: {
//           success: true,
//           data: {
//             users: users,
//             pagination: pagination
//           }
//         }
//       };
//     } catch (error) {
//       console.error('Get users error:', error);
//       throw error;
//     }
//   },

//   // Get user by ID
//   getUserById: async (id) => {
//     const response = await api.get(`${API_ENDPOINTS.USERS}/${id}`);
//     return response;
//   },

//   // Create user
//   createUser: (userData) => {
//     return api.post(API_ENDPOINTS.USERS, userData);
//   },

//   // Update user
//   updateUser: (id, userData) => {
//     return api.put(`${API_ENDPOINTS.USERS}/${id}`, userData);
//   },

//   // Delete user
//   deleteUser: (id) => {
//     return api.delete(`${API_ENDPOINTS.USERS}/${id}`);
//   },

//   // Bulk import users
//   bulkImportUsers: (users) => {
//     return api.post(API_ENDPOINTS.USERS_BULK_IMPORT, { users });
//   },

//   // Export users
//   exportUsers: (params = {}) => {
//     return api.get(API_ENDPOINTS.USERS_EXPORT, { params });
//   },
// };



// client/src/api/user.api.js
// import api from './axios.config';
// import { API_ENDPOINTS } from './endpoints';

// export const userApi = {
//   // Get all users
//   getUsers: async (params = {}) => {
//     try {
//       const response = await api.get(API_ENDPOINTS.USERS, { params });
      
//       // Handle different response structures
//       let users = [];
//       let pagination = { page: 1, limit: 10, total: 0, pages: 0 };
      
//       if (response.data.success) {
//         // Check if data is an object with users property
//         if (response.data.data && response.data.data.users) {
//           users = response.data.data.users;
//           pagination = response.data.data.pagination || pagination;
//         } 
//         // Check if data is directly an array
//         else if (Array.isArray(response.data.data)) {
//           users = response.data.data;
//         }
//         // Check if response.data is an array
//         else if (Array.isArray(response.data)) {
//           users = response.data;
//         }
//       }
      
//       return {
//         ...response,
//         data: {
//           success: true,
//           data: {
//             users: users,
//             pagination: pagination
//           }
//         }
//       };
//     } catch (error) {
//       console.error('Get users error:', error);
//       throw error;
//     }
//   },

//   // Get user by ID
//   getUserById: async (id) => {
//     const response = await api.get(`${API_ENDPOINTS.USERS}/${id}`);
//     return response;
//   },

//   // 🔴 FIX 1: Create user - Ensure data is sent correctly
//   createUser: async (userData) => {
//     // Remove any undefined or empty values
//     const cleanData = {
//       ...userData,
//       // Ensure required fields have defaults
//       isActive: userData.status === 'active',
//       status: userData.status || 'active',
//       isEmailVerified: false,
//       isPhoneVerified: false,
//       createdAt: new Date()
//     };
    
//     // Remove _id if present (for new user)
//     delete cleanData._id;
    
//     const response = await api.post(API_ENDPOINTS.USERS, cleanData);
//     return response;
//   },

//   // 🔴 FIX 2: Update user - Ensure data is sent correctly
//   updateUser: async (id, userData) => {
//     // Remove sensitive fields that shouldn't be updated
//     const cleanData = { ...userData };
//     delete cleanData._id;
//     delete cleanData.password;
//     delete cleanData.createdAt;
    
//     cleanData.updatedAt = new Date();
//     cleanData.isActive = cleanData.status === 'active';
    
//     const response = await api.put(`${API_ENDPOINTS.USERS}/${id}`, cleanData);
//     return response;
//   },

//   // Delete user
//   deleteUser: async (id) => {
//     const response = await api.delete(`${API_ENDPOINTS.USERS}/${id}`);
//     return response;
//   },

//   // Bulk import users
//   bulkImportUsers: (users) => {
//     return api.post(API_ENDPOINTS.USERS_BULK_IMPORT, { users });
//   },

//   // Export users
//   exportUsers: (params = {}) => {
//     return api.get(API_ENDPOINTS.USERS_EXPORT, { params });
//   },
// };



// // client/src/api/user.api.js
// import api from './axios.config';
// import { API_ENDPOINTS } from './endpoints';

// export const userApi = {
//   // Get all users
//   getUsers: async (params = {}) => {
//     try {
//       const response = await api.get(API_ENDPOINTS.USERS, { params });
      
//       // Handle different response structures
//       let users = [];
//       let pagination = { page: 1, limit: 10, total: 0, pages: 0 };
      
//       if (response.data.success) {
//         // Check if data is an object with users property
//         if (response.data.data && response.data.data.users) {
//           users = response.data.data.users;
//           pagination = response.data.data.pagination || pagination;
//         } 
//         // Check if data is directly an array
//         else if (Array.isArray(response.data.data)) {
//           users = response.data.data;
//         }
//         // Check if response.data is an array
//         else if (Array.isArray(response.data)) {
//           users = response.data;
//         }
//       }
      
//       return {
//         ...response,
//         data: {
//           success: true,
//           data: {
//             users: users,
//             pagination: pagination
//           }
//         }
//       };
//     } catch (error) {
//       console.error('Get users error:', error);
//       throw error;
//     }
//   },

//   // Get user by ID
//   getUserById: async (id) => {
//     const response = await api.get(`${API_ENDPOINTS.USERS}/${id}`);
//     return response;
//   },

//   // 🔴 FIX 1: Create user - Ensure data is sent correctly
//   createUser: async (userData) => {
//     // Remove any undefined or empty values
//     const cleanData = {
//       ...userData,
//       // Ensure required fields have defaults
//       isActive: userData.status === 'active',
//       status: userData.status || 'active',
//       isEmailVerified: false,
//       isPhoneVerified: false,
//       createdAt: new Date()
//     };
    
//     // Remove _id if present (for new user)
//     delete cleanData._id;
    
//     const response = await api.post(API_ENDPOINTS.USERS, cleanData);
//     return response;
//   },

//   // 🔴 FIX 2: Update user - Ensure data is sent correctly
//   updateUser: async (id, userData) => {
//     // Remove sensitive fields that shouldn't be updated
//     const cleanData = { ...userData };
//     delete cleanData._id;
//     delete cleanData.password;
//     delete cleanData.createdAt;
    
//     cleanData.updatedAt = new Date();
//     cleanData.isActive = cleanData.status === 'active';
    
//     const response = await api.put(`${API_ENDPOINTS.USERS}/${id}`, cleanData);
//     return response;
//   },

//   // Delete user
//   deleteUser: async (id) => {
//     const response = await api.delete(`${API_ENDPOINTS.USERS}/${id}`);
//     return response;
//   },

//   // Bulk import users
//   bulkImportUsers: (users) => {
//     return api.post(API_ENDPOINTS.USERS_BULK_IMPORT, { users });
//   },

//   // Export users
//   exportUsers: (params = {}) => {
//     return api.get(API_ENDPOINTS.USERS_EXPORT, { params });
//   },
// };


// // client/src/api/user.api.js
// import api from './axios.config';
// import { API_ENDPOINTS } from './endpoints';

// export const userApi = {
//   // Get all users
//   getUsers: async (params = {}) => {
//     try {
//       const response = await api.get(API_ENDPOINTS.USERS, { params });
      
//       // Handle different response structures
//       let users = [];
//       let pagination = { page: 1, limit: 10, total: 0, pages: 0 };
      
//       if (response.data.success) {
//         // Check if data is an object with users property
//         if (response.data.data && response.data.data.users) {
//           users = response.data.data.users;
//           pagination = response.data.data.pagination || pagination;
//         } 
//         // Check if data is directly an array
//         else if (Array.isArray(response.data.data)) {
//           users = response.data.data;
//         }
//         // Check if response.data is an array
//         else if (Array.isArray(response.data)) {
//           users = response.data;
//         }
//       }
      
//       return {
//         ...response,
//         data: {
//           success: true,
//           data: {
//             users: users,
//             pagination: pagination
//           }
//         }
//       };
//     } catch (error) {
//       console.error('Get users error:', error);
//       throw error;
//     }
//   },

//   // Get user by ID
//   getUserById: async (id) => {
//     const response = await api.get(`${API_ENDPOINTS.USERS}/${id}`);
//     return response;
//   },

//   // Create user - Ensure data is sent correctly
//   createUser: async (userData) => {
//     // Remove any undefined or empty values
//     const cleanData = {
//       ...userData,
//       // Ensure required fields have defaults
//       isActive: userData.status === 'active',
//       status: userData.status || 'active',
//       isEmailVerified: false,
//       isPhoneVerified: false,
//       chatEnabled: userData.chatEnabled || false, // Default to false
//       createdAt: new Date()
//     };
    
//     // Remove _id if present (for new user)
//     delete cleanData._id;
    
//     const response = await api.post(API_ENDPOINTS.USERS, cleanData);
//     return response;
//   },

//   // Update user - Ensure data is sent correctly
//   updateUser: async (id, userData) => {
//     // Remove sensitive fields that shouldn't be updated
//     const cleanData = { ...userData };
//     delete cleanData._id;
//     delete cleanData.password;
//     delete cleanData.createdAt;
    
//     cleanData.updatedAt = new Date();
//     cleanData.isActive = cleanData.status === 'active';
    
//     const response = await api.put(`${API_ENDPOINTS.USERS}/${id}`, cleanData);
//     return response;
//   },

//   // Delete user
//   deleteUser: async (id) => {
//     const response = await api.delete(`${API_ENDPOINTS.USERS}/${id}`);
//     return response;
//   },

//   // Bulk import users
//   bulkImportUsers: (users) => {
//     return api.post(API_ENDPOINTS.USERS_BULK_IMPORT, { users });
//   },

//   // Export users
//   exportUsers: (params = {}) => {
//     return api.get(API_ENDPOINTS.USERS_EXPORT, { params });
//   },

//   // ==================== CHAT PERMISSION METHODS ====================

//   /**
//    * Toggle chat enabled for a specific user (Super Admin only)
//    * @param {string} userId - User ID
//    * @param {object} data - { chatEnabled: boolean }
//    */
//   toggleChatEnabled: async (userId, data) => {
//     const response = await api.put(`/users/${userId}/toggle-chat`, data);
//     return response;
//   },

//   /**
//    * Get all users with chat enabled
//    */
//   getChatEnabledUsers: async () => {
//     const response = await api.get('/users/chat-enabled');
//     return response;
//   },

//   /**
//    * Bulk enable/disable chat for multiple users (Super Admin only)
//    * @param {array} userIds - Array of user IDs
//    * @param {boolean} chatEnabled - Enable or disable chat
//    */
//   bulkToggleChatEnabled: async (userIds, chatEnabled) => {
//     const response = await api.post('/users/bulk-toggle-chat', { userIds, chatEnabled });
//     return response;
//   },

//   /**
//    * Get chat permission matrix
//    */
//   getChatPermissions: async () => {
//     const response = await api.get('/users/chat/permissions');
//     return response;
//   },

//   /**
//    * Get chat statistics (enabled users count, etc.)
//    */
//   getChatStats: async () => {
//     const response = await api.get('/users/chat/stats');
//     return response;
//   },

//   // ==================== USER STATUS METHODS ====================

//   /**
//    * Activate a user account
//    * @param {string} userId - User ID
//    */
//   activateUser: async (userId) => {
//     const response = await api.put(`/users/${userId}/activate`);
//     return response;
//   },

//   /**
//    * Deactivate a user account
//    * @param {string} userId - User ID
//    * @param {string} reason - Reason for deactivation
//    */
//   deactivateUser: async (userId, reason = '') => {
//     const response = await api.put(`/users/${userId}/deactivate`, { reason });
//     return response;
//   },

//   /**
//    * Reset user password (Admin only)
//    * @param {string} userId - User ID
//    */
//   resetUserPassword: async (userId) => {
//     const response = await api.post(`/users/${userId}/reset-password`);
//     return response;
//   },

//   // ==================== TEAM MANAGEMENT METHODS ====================

//   /**
//    * Get users by role
//    * @param {string} role - Role name (technician, supervisor, manager, etc.)
//    */
//   getUsersByRole: async (role) => {
//     const response = await api.get('/users', { params: { role, limit: 500 } });
//     return response;
//   },

//   /**
//    * Get technicians for assignment
//    */
//   getTechnicians: async () => {
//     const response = await api.get('/users/technicians');
//     return response;
//   },

//   /**
//    * Get team members (for managers and supervisors)
//    */
//   getTeamMembers: async () => {
//     const response = await api.get('/users/team');
//     return response;
//   },

//   /**
//    * Get reporting hierarchy
//    */
//   getReportingHierarchy: async () => {
//     const response = await api.get('/users/hierarchy');
//     return response;
//   },

//   // ==================== PROFILE METHODS ====================

//   /**
//    * Update own profile
//    * @param {object} profileData - Profile data to update
//    */
//   updateOwnProfile: async (profileData) => {
//     const response = await api.put('/users/profile', profileData);
//     return response;
//   },

//   /**
//    * Change own password
//    * @param {object} passwordData - { currentPassword, newPassword }
//    */
//   changeOwnPassword: async (passwordData) => {
//     const response = await api.put('/users/change-password', passwordData);
//     return response;
//   },

//   /**
//    * Upload profile image
//    * @param {FormData} formData - Form data with image file
//    */
//   uploadProfileImage: async (formData) => {
//     const response = await api.post('/users/profile/image', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     return response;
//   },

//   /**
//    * Remove profile image
//    */
//   removeProfileImage: async () => {
//     const response = await api.delete('/users/profile/image');
//     return response;
//   },

//   // ==================== NOTIFICATION METHODS ====================

//   /**
//    * Update user's FCM token for push notifications
//    * @param {string} token - FCM token
//    */
//   updateFCMToken: async (token) => {
//     const response = await api.post('/users/fcm-token', { token });
//     return response;
//   },

//   /**
//    * Remove FCM token
//    * @param {string} token - FCM token to remove
//    */
//   removeFCMToken: async (token) => {
//     const response = await api.delete('/users/fcm-token', { data: { token } });
//     return response;
//   },

//   // ==================== DOCUMENT METHODS ====================

//   /**
//    * Upload user document (Admin only)
//    * @param {string} userId - User ID
//    * @param {FormData} formData - Form data with document
//    */
//   uploadUserDocument: async (userId, formData) => {
//     const response = await api.post(`/users/${userId}/documents`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     return response;
//   },

//   /**
//    * Get user documents
//    * @param {string} userId - User ID
//    */
//   getUserDocuments: async (userId) => {
//     const response = await api.get(`/users/${userId}/documents`);
//     return response;
//   },

//   /**
//    * Delete user document
//    * @param {string} userId - User ID
//    * @param {string} documentId - Document ID
//    */
//   deleteUserDocument: async (userId, documentId) => {
//     const response = await api.delete(`/users/${userId}/documents/${documentId}`);
//     return response;
//   },

//   // ==================== BULK OPERATIONS ====================

//   /**
//    * Bulk update user status
//    * @param {array} userIds - Array of user IDs
//    * @param {string} status - New status
//    */
//   bulkUpdateStatus: async (userIds, status) => {
//     const response = await api.post('/users/bulk/status', { userIds, status });
//     return response;
//   },

//   /**
//    * Bulk assign role
//    * @param {array} userIds - Array of user IDs
//    * @param {string} role - Role to assign
//    */
//   bulkAssignRole: async (userIds, role) => {
//     const response = await api.post('/users/bulk/role', { userIds, role });
//     return response;
//   },

//   /**
//    * Bulk delete users
//    * @param {array} userIds - Array of user IDs
//    */
//   bulkDeleteUsers: async (userIds) => {
//     const response = await api.post('/users/bulk/delete', { userIds });
//     return response;
//   }
// };



// // client/src/api/user.api.js
// import api from './axios.config';
// import { API_ENDPOINTS } from './endpoints';

// export const userApi = {
//   // Get all users
//   getUsers: async (params = {}) => {
//     try {
//       const response = await api.get(API_ENDPOINTS.USERS, { params });
      
//       // Handle different response structures
//       let users = [];
//       let pagination = { page: 1, limit: 10, total: 0, pages: 0 };
      
//       if (response.data.success) {
//         // Check if data is an object with users property
//         if (response.data.data && response.data.data.users) {
//           users = response.data.data.users;
//           pagination = response.data.data.pagination || pagination;
//         } 
//         // Check if data is directly an array
//         else if (Array.isArray(response.data.data)) {
//           users = response.data.data;
//         }
//         // Check if response.data is an array
//         else if (Array.isArray(response.data)) {
//           users = response.data;
//         }
//       }
      
//       return {
//         ...response,
//         data: {
//           success: true,
//           data: {
//             users: users,
//             pagination: pagination
//           }
//         }
//       };
//     } catch (error) {
//       console.error('Get users error:', error);
//       throw error;
//     }
//   },

//   // Get user by ID
//   getUserById: async (id) => {
//     const response = await api.get(`${API_ENDPOINTS.USERS}/${id}`);
//     return response;
//   },

//   // Create user - Ensure data is sent correctly
//   createUser: async (userData) => {
//     // Remove any undefined or empty values
//     const cleanData = {
//       ...userData,
//       // Ensure required fields have defaults
//       isActive: userData.status === 'active',
//       status: userData.status || 'active',
//       isEmailVerified: false,
//       isPhoneVerified: false,
//       chatEnabled: userData.chatEnabled || false, // Default to false
//       createdAt: new Date()
//     };
    
//     // Remove _id if present (for new user)
//     delete cleanData._id;
    
//     const response = await api.post(API_ENDPOINTS.USERS, cleanData);
//     return response;
//   },

//   // Update user - Ensure data is sent correctly
//   updateUser: async (id, userData) => {
//     // Remove sensitive fields that shouldn't be updated
//     const cleanData = { ...userData };
//     delete cleanData._id;
//     delete cleanData.password;
//     delete cleanData.createdAt;
    
//     cleanData.updatedAt = new Date();
//     cleanData.isActive = cleanData.status === 'active';
    
//     const response = await api.put(`${API_ENDPOINTS.USERS}/${id}`, cleanData);
//     return response;
//   },

//   // Delete user
//   deleteUser: async (id) => {
//     const response = await api.delete(`${API_ENDPOINTS.USERS}/${id}`);
//     return response;
//   },

//   // Bulk import users
//   bulkImportUsers: (users) => {
//     return api.post(API_ENDPOINTS.USERS_BULK_IMPORT, { users });
//   },

//   // Export users
//   exportUsers: (params = {}) => {
//     return api.get(API_ENDPOINTS.USERS_EXPORT, { params });
//   },

//   // ==================== ONLINE STATUS METHODS ====================

//   /**
//    * Get all online users
//    * @returns {Promise} - List of online users
//    */
//   getOnlineUsers: async () => {
//     const response = await api.get('/users/online');
//     return response;
//   },

//   /**
//    * Get online users count
//    * @returns {Promise} - Count of online users
//    */
//   getOnlineUsersCount: async () => {
//     const response = await api.get('/users/online/count');
//     return response;
//   },

//   /**
//    * Get specific user's online status
//    * @param {string} userId - User ID
//    * @returns {Promise} - User online status
//    */
//   getUserOnlineStatus: async (userId) => {
//     const response = await api.get(`/users/${userId}/status`);
//     return response;
//   },

//   /**
//    * Update current user's online status
//    * @param {boolean} isOnline - Online status
//    * @returns {Promise} - Updated status
//    */
//   updateOnlineStatus: async (isOnline) => {
//     const response = await api.post('/users/update-status', { isOnline });
//     return response;
//   },

//   /**
//    * Send heartbeat to keep session alive
//    * @returns {Promise} - Heartbeat response
//    */
//   updateHeartbeat: async () => {
//     const response = await api.post('/users/heartbeat');
//     return response;
//   },

//   /**
//    * Get online technicians only
//    * @returns {Promise} - List of online technicians
//    */
//   getOnlineTechnicians: async () => {
//     const response = await api.get('/users/online/technicians');
//     return response;
//   },

//   /**
//    * Get online managers only
//    * @returns {Promise} - List of online managers
//    */
//   getOnlineManagers: async () => {
//     const response = await api.get('/users/online/managers');
//     return response;
//   },

//   /**
//    * Get bulk online status for multiple users
//    * @param {array} userIds - Array of user IDs
//    * @returns {Promise} - Map of user IDs to online status
//    */
//   getBulkOnlineStatus: async (userIds) => {
//     const response = await api.post('/users/bulk/online-status', { userIds });
//     return response;
//   },

//   /**
//    * Get users active in last X minutes
//    * @param {number} minutes - Minutes to check (default: 5)
//    * @returns {Promise} - List of active users
//    */
//   getRecentActiveUsers: async (minutes = 5) => {
//     const response = await api.get(`/users/activity/recent?minutes=${minutes}`);
//     return response;
//   },

//   /**
//    * Get inactive users (not seen for X days)
//    * @param {number} days - Days threshold (default: 7)
//    * @returns {Promise} - List of inactive users
//    */
//   getInactiveUsers: async (days = 7) => {
//     const response = await api.get(`/users/activity/inactive?days=${days}`);
//     return response;
//   },

//   /**
//    * Register socket ID for current user
//    * @param {string} socketId - Socket.IO connection ID
//    * @returns {Promise} - Registration response
//    */
//   registerSocketId: async (socketId) => {
//     const response = await api.post('/users/socket/register', { socketId });
//     return response;
//   },

//   /**
//    * Unregister socket ID (user disconnects)
//    * @returns {Promise} - Unregistration response
//    */
//   unregisterSocketId: async () => {
//     const response = await api.delete('/users/socket/unregister');
//     return response;
//   },

//   // ==================== CHAT PERMISSION METHODS ====================

//   /**
//    * Toggle chat enabled for a specific user (Super Admin only)
//    * @param {string} userId - User ID
//    * @param {object} data - { chatEnabled: boolean }
//    */
//   toggleChatEnabled: async (userId, data) => {
//     const response = await api.put(`/users/${userId}/toggle-chat`, data);
//     return response;
//   },

//   /**
//    * Get all users with chat enabled
//    */
//   getChatEnabledUsers: async () => {
//     const response = await api.get('/users/chat-enabled');
//     return response;
//   },

//   /**
//    * Bulk enable/disable chat for multiple users (Super Admin only)
//    * @param {array} userIds - Array of user IDs
//    * @param {boolean} chatEnabled - Enable or disable chat
//    */
//   bulkToggleChatEnabled: async (userIds, chatEnabled) => {
//     const response = await api.post('/users/bulk-toggle-chat', { userIds, chatEnabled });
//     return response;
//   },

//   /**
//    * Get chat permission matrix
//    */
//   getChatPermissions: async () => {
//     const response = await api.get('/users/chat/permissions');
//     return response;
//   },

//   /**
//    * Get chat statistics (enabled users count, etc.)
//    */
//   getChatStats: async () => {
//     const response = await api.get('/users/chat/stats');
//     return response;
//   },

//   // ==================== USER STATUS METHODS ====================

//   /**
//    * Activate a user account
//    * @param {string} userId - User ID
//    */
//   activateUser: async (userId) => {
//     const response = await api.put(`/users/${userId}/activate`);
//     return response;
//   },

//   /**
//    * Deactivate a user account
//    * @param {string} userId - User ID
//    * @param {string} reason - Reason for deactivation
//    */
//   deactivateUser: async (userId, reason = '') => {
//     const response = await api.put(`/users/${userId}/deactivate`, { reason });
//     return response;
//   },

//   /**
//    * Reset user password (Admin only)
//    * @param {string} userId - User ID
//    */
//   resetUserPassword: async (userId) => {
//     const response = await api.post(`/users/${userId}/reset-password`);
//     return response;
//   },

//   // ==================== TEAM MANAGEMENT METHODS ====================

//   /**
//    * Get users by role
//    * @param {string} role - Role name (technician, supervisor, manager, etc.)
//    */
//   getUsersByRole: async (role) => {
//     const response = await api.get('/users', { params: { role, limit: 500 } });
//     return response;
//   },

//   /**
//    * Get technicians for assignment
//    */
//   getTechnicians: async () => {
//     const response = await api.get('/users/technicians');
//     return response;
//   },

//   /**
//    * Get team members (for managers and supervisors)
//    */
//   getTeamMembers: async () => {
//     const response = await api.get('/users/team');
//     return response;
//   },

//   /**
//    * Get reporting hierarchy
//    */
//   getReportingHierarchy: async () => {
//     const response = await api.get('/users/hierarchy');
//     return response;
//   },

//   // ==================== PROFILE METHODS ====================

//   /**
//    * Update own profile
//    * @param {object} profileData - Profile data to update
//    */
//   updateOwnProfile: async (profileData) => {
//     const response = await api.put('/users/profile', profileData);
//     return response;
//   },

//   /**
//    * Change own password
//    * @param {object} passwordData - { currentPassword, newPassword }
//    */
//   changeOwnPassword: async (passwordData) => {
//     const response = await api.put('/users/change-password', passwordData);
//     return response;
//   },

//   /**
//    * Upload profile image
//    * @param {FormData} formData - Form data with image file
//    */
//   uploadProfileImage: async (formData) => {
//     const response = await api.post('/users/profile/image', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     return response;
//   },

//   /**
//    * Remove profile image
//    */
//   removeProfileImage: async () => {
//     const response = await api.delete('/users/profile/image');
//     return response;
//   },

//   // ==================== NOTIFICATION METHODS ====================

//   /**
//    * Update user's FCM token for push notifications
//    * @param {string} token - FCM token
//    */
//   updateFCMToken: async (token) => {
//     const response = await api.post('/users/fcm-token', { token });
//     return response;
//   },

//   /**
//    * Remove FCM token
//    * @param {string} token - FCM token to remove
//    */
//   removeFCMToken: async (token) => {
//     const response = await api.delete('/users/fcm-token', { data: { token } });
//     return response;
//   },

//   // ==================== DOCUMENT METHODS ====================

//   /**
//    * Upload user document (Admin only)
//    * @param {string} userId - User ID
//    * @param {FormData} formData - Form data with document
//    */
//   uploadUserDocument: async (userId, formData) => {
//     const response = await api.post(`/users/${userId}/documents`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     return response;
//   },

//   /**
//    * Get user documents
//    * @param {string} userId - User ID
//    */
//   getUserDocuments: async (userId) => {
//     const response = await api.get(`/users/${userId}/documents`);
//     return response;
//   },

//   /**
//    * Delete user document
//    * @param {string} userId - User ID
//    * @param {string} documentId - Document ID
//    */
//   deleteUserDocument: async (userId, documentId) => {
//     const response = await api.delete(`/users/${userId}/documents/${documentId}`);
//     return response;
//   },

//   // ==================== BULK OPERATIONS ====================

//   /**
//    * Bulk update user status
//    * @param {array} userIds - Array of user IDs
//    * @param {string} status - New status
//    */
//   bulkUpdateStatus: async (userIds, status) => {
//     const response = await api.post('/users/bulk/status', { userIds, status });
//     return response;
//   },

//   /**
//    * Bulk assign role
//    * @param {array} userIds - Array of user IDs
//    * @param {string} role - Role to assign
//    */
//   bulkAssignRole: async (userIds, role) => {
//     const response = await api.post('/users/bulk/role', { userIds, role });
//     return response;
//   },

//   /**
//    * Bulk delete users
//    * @param {array} userIds - Array of user IDs
//    */
//   bulkDeleteUsers: async (userIds) => {
//     const response = await api.post('/users/bulk/delete', { userIds });
//     return response;
//   }
// };




// // client/src/api/user.api.js
// import api from './axios.config';
// import { API_ENDPOINTS } from './endpoints';

// export const userApi = {
//   // Get all users
//   getUsers: async (params = {}) => {
//     try {
//       const response = await api.get(API_ENDPOINTS.USERS, { params });
      
//       // Handle different response structures
//       let users = [];
//       let pagination = { page: 1, limit: 10, total: 0, pages: 0 };
      
//       if (response.data.success) {
//         // Check if data is an object with users property
//         if (response.data.data && response.data.data.users) {
//           users = response.data.data.users;
//           pagination = response.data.data.pagination || pagination;
//         } 
//         // Check if data is directly an array
//         else if (Array.isArray(response.data.data)) {
//           users = response.data.data;
//         }
//         // Check if response.data is an array
//         else if (Array.isArray(response.data)) {
//           users = response.data;
//         }
//       }
      
//       return {
//         ...response,
//         data: {
//           success: true,
//           data: {
//             users: users,
//             pagination: pagination
//           }
//         }
//       };
//     } catch (error) {
//       console.error('Get users error:', error);
//       throw error;
//     }
//   },

//   // Get user by ID
//   getUserById: async (id) => {
//     const response = await api.get(`${API_ENDPOINTS.USERS}/${id}`);
//     return response;
//   },

//   // Create user - Ensure data is sent correctly
//   createUser: async (userData) => {
//     // Remove any undefined or empty values
//     const cleanData = {
//       ...userData,
//       // Ensure required fields have defaults
//       isActive: userData.status === 'active',
//       status: userData.status || 'active',
//       isEmailVerified: false,
//       isPhoneVerified: false,
//       chatEnabled: userData.chatEnabled || false, // Default to false
//       createdAt: new Date()
//     };
    
//     // Remove _id if present (for new user)
//     delete cleanData._id;
    
//     const response = await api.post(API_ENDPOINTS.USERS, cleanData);
//     return response;
//   },

//   // Update user - Ensure data is sent correctly
//   updateUser: async (id, userData) => {
//     // Remove sensitive fields that shouldn't be updated
//     const cleanData = { ...userData };
//     delete cleanData._id;
//     delete cleanData.password;
//     delete cleanData.createdAt;
    
//     cleanData.updatedAt = new Date();
//     cleanData.isActive = cleanData.status === 'active';
    
//     const response = await api.put(`${API_ENDPOINTS.USERS}/${id}`, cleanData);
//     return response;
//   },

//   // Delete user
//   deleteUser: async (id) => {
//     const response = await api.delete(`${API_ENDPOINTS.USERS}/${id}`);
//     return response;
//   },

//   // Bulk import users
//   bulkImportUsers: (users) => {
//     return api.post(API_ENDPOINTS.USERS_BULK_IMPORT, { users });
//   },

//   // Export users
//   exportUsers: (params = {}) => {
//     return api.get(API_ENDPOINTS.USERS_EXPORT, { params });
//   },

//   // ==================== ONLINE STATUS METHODS ====================

//   /**
//    * Get all online users
//    * @returns {Promise} - List of online users
//    */
//   getOnlineUsers: async () => {
//     const response = await api.get('/users/online');
//     return response;
//   },

//   /**
//    * Get online users count
//    * @returns {Promise} - Count of online users
//    */
//   getOnlineUsersCount: async () => {
//     const response = await api.get('/users/online/count');
//     return response;
//   },

//   /**
//    * Get specific user's online status
//    * @param {string} userId - User ID
//    * @returns {Promise} - User online status
//    */
//   getUserOnlineStatus: async (userId) => {
//     const response = await api.get(`/users/${userId}/status`);
//     return response;
//   },

//   /**
//    * Update current user's online status
//    * @param {boolean} isOnline - Online status
//    * @returns {Promise} - Updated status
//    */
//   updateOnlineStatus: async (isOnline) => {
//     const response = await api.post('/users/update-status', { isOnline });
//     return response;
//   },

//   /**
//    * Send heartbeat to keep session alive
//    * @returns {Promise} - Heartbeat response
//    */
//   updateHeartbeat: async () => {
//     const response = await api.post('/users/heartbeat');
//     return response;
//   },

//   /**
//    * Get online technicians only
//    * @returns {Promise} - List of online technicians
//    */
//   getOnlineTechnicians: async () => {
//     const response = await api.get('/users/online/technicians');
//     return response;
//   },

//   /**
//    * Get online managers only
//    * @returns {Promise} - List of online managers
//    */
//   getOnlineManagers: async () => {
//     const response = await api.get('/users/online/managers');
//     return response;
//   },

//   /**
//    * Get bulk online status for multiple users
//    * @param {array} userIds - Array of user IDs
//    * @returns {Promise} - Map of user IDs to online status
//    */
//   getBulkOnlineStatus: async (userIds) => {
//     const response = await api.post('/users/bulk/online-status', { userIds });
//     return response;
//   },

//   /**
//    * Get users active in last X minutes
//    * @param {number} minutes - Minutes to check (default: 5)
//    * @returns {Promise} - List of active users
//    */
//   getRecentActiveUsers: async (minutes = 5) => {
//     const response = await api.get(`/users/activity/recent?minutes=${minutes}`);
//     return response;
//   },

//   /**
//    * Get inactive users (not seen for X days)
//    * @param {number} days - Days threshold (default: 7)
//    * @returns {Promise} - List of inactive users
//    */
//   getInactiveUsers: async (days = 7) => {
//     const response = await api.get(`/users/activity/inactive?days=${days}`);
//     return response;
//   },

//   /**
//    * Register socket ID for current user
//    * @param {string} socketId - Socket.IO connection ID
//    * @returns {Promise} - Registration response
//    */
//   registerSocketId: async (socketId) => {
//     const response = await api.post('/users/socket/register', { socketId });
//     return response;
//   },

//   /**
//    * Unregister socket ID (user disconnects)
//    * @returns {Promise} - Unregistration response
//    */
//   unregisterSocketId: async () => {
//     const response = await api.delete('/users/socket/unregister');
//     return response;
//   },

//   // ==================== LEAVE MANAGEMENT METHODS ====================

//   /**
//    * Get leave statistics
//    * @param {object} params - Query parameters (year, month, department)
//    * @returns {Promise} - Leave statistics
//    */
//   getLeaveStats: async (params = {}) => {
//     const response = await api.get('/leaves/stats', { params });
//     return response;
//   },

//   /**
//    * Get user's leave balance
//    * @param {string} userId - User ID (optional, defaults to current user)
//    * @returns {Promise} - Leave balance
//    */
//   getLeaveBalance: async (userId = null) => {
//     const url = userId ? `/leaves/balance/${userId}` : '/leaves/balance';
//     const response = await api.get(url);
//     return response;
//   },

//   /**
//    * Get leave requests
//    * @param {object} params - Query parameters
//    * @returns {Promise} - List of leave requests
//    */
//   getLeaveRequests: async (params = {}) => {
//     const response = await api.get('/leaves', { params });
//     return response;
//   },

//   /**
//    * Create leave request
//    * @param {object} leaveData - Leave request data
//    * @returns {Promise} - Created leave request
//    */
//   createLeaveRequest: async (leaveData) => {
//     const response = await api.post('/leaves', leaveData);
//     return response;
//   },

//   /**
//    * Update leave request status (Approve/Reject)
//    * @param {string} leaveId - Leave request ID
//    * @param {object} data - { status, remarks }
//    * @returns {Promise} - Updated leave request
//    */
//   updateLeaveStatus: async (leaveId, data) => {
//     const response = await api.put(`/leaves/${leaveId}/status`, data);
//     return response;
//   },

//   // ==================== ATTENDANCE METHODS ====================

//   /**
//    * Get attendance dashboard statistics
//    * @param {object} params - Query parameters (date, department)
//    * @returns {Promise} - Attendance statistics
//    */
//   getAttendanceStats: async (params = {}) => {
//     const response = await api.get('/attendance/dashboard-stats', { params });
//     return response;
//   },

//   /**
//    * Get user's attendance records
//    * @param {object} params - Query parameters (month, year)
//    * @returns {Promise} - Attendance records
//    */
//   getUserAttendance: async (params = {}) => {
//     const response = await api.get('/attendance/my-attendance', { params });
//     return response;
//   },

//   /**
//    * Check-in user
//    * @param {object} data - Check-in data (location, notes)
//    * @returns {Promise} - Check-in response
//    */
//   checkIn: async (data = {}) => {
//     const response = await api.post('/attendance/check-in', data);
//     return response;
//   },

//   /**
//    * Check-out user
//    * @param {object} data - Check-out data (location, notes)
//    * @returns {Promise} - Check-out response
//    */
//   checkOut: async (data = {}) => {
//     const response = await api.post('/attendance/check-out', data);
//     return response;
//   },

//   /**
//    * Get attendance summary for a user
//    * @param {string} userId - User ID (optional)
//    * @param {number} year - Year
//    * @param {number} month - Month
//    * @returns {Promise} - Attendance summary
//    */
//   getAttendanceSummary: async (userId = null, year = null, month = null) => {
//     const params = {};
//     if (userId) params.userId = userId;
//     if (year) params.year = year;
//     if (month) params.month = month;
//     const response = await api.get('/attendance/summary', { params });
//     return response;
//   },

//   // ==================== CHAT PERMISSION METHODS ====================

//   /**
//    * Toggle chat enabled for a specific user (Super Admin only)
//    * @param {string} userId - User ID
//    * @param {object} data - { chatEnabled: boolean }
//    */
//   toggleChatEnabled: async (userId, data) => {
//     const response = await api.put(`/users/${userId}/toggle-chat`, data);
//     return response;
//   },

//   /**
//    * Get all users with chat enabled
//    */
//   getChatEnabledUsers: async () => {
//     const response = await api.get('/users/chat-enabled');
//     return response;
//   },

//   /**
//    * Bulk enable/disable chat for multiple users (Super Admin only)
//    * @param {array} userIds - Array of user IDs
//    * @param {boolean} chatEnabled - Enable or disable chat
//    */
//   bulkToggleChatEnabled: async (userIds, chatEnabled) => {
//     const response = await api.post('/users/bulk-toggle-chat', { userIds, chatEnabled });
//     return response;
//   },

//   /**
//    * Get chat permission matrix
//    */
//   getChatPermissions: async () => {
//     const response = await api.get('/users/chat/permissions');
//     return response;
//   },

//   /**
//    * Get chat statistics (enabled users count, etc.)
//    */
//   getChatStats: async () => {
//     const response = await api.get('/users/chat/stats');
//     return response;
//   },

//   // ==================== USER STATUS METHODS ====================

//   /**
//    * Activate a user account
//    * @param {string} userId - User ID
//    */
//   activateUser: async (userId) => {
//     const response = await api.put(`/users/${userId}/activate`);
//     return response;
//   },

//   /**
//    * Deactivate a user account
//    * @param {string} userId - User ID
//    * @param {string} reason - Reason for deactivation
//    */
//   deactivateUser: async (userId, reason = '') => {
//     const response = await api.put(`/users/${userId}/deactivate`, { reason });
//     return response;
//   },

//   /**
//    * Reset user password (Admin only)
//    * @param {string} userId - User ID
//    */
//   resetUserPassword: async (userId) => {
//     const response = await api.post(`/users/${userId}/reset-password`);
//     return response;
//   },

//   // ==================== TEAM MANAGEMENT METHODS ====================

//   /**
//    * Get users by role
//    * @param {string} role - Role name (technician, supervisor, manager, etc.)
//    */
//   getUsersByRole: async (role) => {
//     const response = await api.get('/users', { params: { role, limit: 500 } });
//     return response;
//   },

//   /**
//    * Get technicians for assignment
//    */
//   getTechnicians: async () => {
//     const response = await api.get('/users/technicians');
//     return response;
//   },

//   /**
//    * Get team members (for managers and supervisors)
//    */
//   getTeamMembers: async () => {
//     const response = await api.get('/users/team');
//     return response;
//   },

//   /**
//    * Get reporting hierarchy
//    */
//   getReportingHierarchy: async () => {
//     const response = await api.get('/users/hierarchy');
//     return response;
//   },

//   // ==================== PROFILE METHODS ====================

//   /**
//    * Update own profile
//    * @param {object} profileData - Profile data to update
//    */
//   updateOwnProfile: async (profileData) => {
//     const response = await api.put('/users/profile', profileData);
//     return response;
//   },

//   /**
//    * Change own password
//    * @param {object} passwordData - { currentPassword, newPassword }
//    */
//   changeOwnPassword: async (passwordData) => {
//     const response = await api.put('/users/change-password', passwordData);
//     return response;
//   },

//   /**
//    * Upload profile image
//    * @param {FormData} formData - Form data with image file
//    */
//   uploadProfileImage: async (formData) => {
//     const response = await api.post('/users/profile/image', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     return response;
//   },

//   /**
//    * Remove profile image
//    */
//   removeProfileImage: async () => {
//     const response = await api.delete('/users/profile/image');
//     return response;
//   },

//   // ==================== NOTIFICATION METHODS ====================

//   /**
//    * Update user's FCM token for push notifications
//    * @param {string} token - FCM token
//    */
//   updateFCMToken: async (token) => {
//     const response = await api.post('/users/fcm-token', { token });
//     return response;
//   },

//   /**
//    * Remove FCM token
//    * @param {string} token - FCM token to remove
//    */
//   removeFCMToken: async (token) => {
//     const response = await api.delete('/users/fcm-token', { data: { token } });
//     return response;
//   },

//   // ==================== DOCUMENT METHODS ====================

//   /**
//    * Upload user document (Admin only)
//    * @param {string} userId - User ID
//    * @param {FormData} formData - Form data with document
//    */
//   uploadUserDocument: async (userId, formData) => {
//     const response = await api.post(`/users/${userId}/documents`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     return response;
//   },

//   /**
//    * Get user documents
//    * @param {string} userId - User ID
//    */
//   getUserDocuments: async (userId) => {
//     const response = await api.get(`/users/${userId}/documents`);
//     return response;
//   },

//   /**
//    * Delete user document
//    * @param {string} userId - User ID
//    * @param {string} documentId - Document ID
//    */
//   deleteUserDocument: async (userId, documentId) => {
//     const response = await api.delete(`/users/${userId}/documents/${documentId}`);
//     return response;
//   },

//   // ==================== BULK OPERATIONS ====================

//   /**
//    * Bulk update user status
//    * @param {array} userIds - Array of user IDs
//    * @param {string} status - New status
//    */
//   bulkUpdateStatus: async (userIds, status) => {
//     const response = await api.post('/users/bulk/status', { userIds, status });
//     return response;
//   },

//   /**
//    * Bulk assign role
//    * @param {array} userIds - Array of user IDs
//    * @param {string} role - Role to assign
//    */
//   bulkAssignRole: async (userIds, role) => {
//     const response = await api.post('/users/bulk/role', { userIds, role });
//     return response;
//   },

//   /**
//    * Bulk delete users
//    * @param {array} userIds - Array of user IDs
//    */
//   bulkDeleteUsers: async (userIds) => {
//     const response = await api.post('/users/bulk/delete', { userIds });
//     return response;
//   },

//   // ==================== DASHBOARD STATISTICS ====================

//   /**
//    * Get dashboard statistics
//    * @returns {Promise} - Dashboard stats
//    */
//   getDashboardStats: async () => {
//     const response = await api.get('/users/dashboard/stats');
//     return response;
//   },

//   /**
//    * Get user activity log
//    * @param {object} params - Query parameters (page, limit, fromDate, toDate)
//    * @returns {Promise} - Activity log
//    */
//   getUserActivityLog: async (params = {}) => {
//     const response = await api.get('/users/activity-log', { params });
//     return response;
//   },

//   /**
//    * Get user permissions
//    * @param {string} userId - User ID
//    * @returns {Promise} - User permissions
//    */
//   getUserPermissions: async (userId) => {
//     const response = await api.get(`/users/${userId}/permissions`);
//     return response;
//   },

//   /**
//    * Update user permissions
//    * @param {string} userId - User ID
//    * @param {array} permissions - Array of permission strings
//    * @returns {Promise} - Updated permissions
//    */
//   updateUserPermissions: async (userId, permissions) => {
//     const response = await api.put(`/users/${userId}/permissions`, { permissions });
//     return response;
//   }
// };

// export default userApi;









import api from './axios.config';
import { API_ENDPOINTS } from './endpoints';

// Debug flag
const DEBUG = import.meta.env.VITE_DEBUG_API === 'true';

// Helper for debug logging
const debugLog = (method, url, data = null) => {
  if (DEBUG) {
    console.log(`[User API] ${method} ${url}`);
    if (data) console.log('Data:', data);
  }
};

// Helper for error handling
const handleResponse = async (promise, method, url) => {
  try {
    debugLog(method, url);
    const response = await promise;
    return response;
  } catch (error) {
    console.error(`[User API Error] ${method} ${url}:`, error.response?.data || error.message);
    throw error;
  }
};

export const userApi = {
  // ==================== USER CRUD OPERATIONS ====================
  
  /**
   * Get all users with pagination and filters
   * @param {Object} params - Query parameters (page, limit, role, status, search)
   * @returns {Promise} List of users with pagination
   */
  getUsers: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS, { params });
      
      // Handle different response structures
      let users = [];
      let pagination = { page: 1, limit: 10, total: 0, pages: 0 };
      
      if (response.data.success) {
        if (response.data.data && response.data.data.users) {
          users = response.data.data.users;
          pagination = response.data.data.pagination || pagination;
        } else if (Array.isArray(response.data.data)) {
          users = response.data.data;
        } else if (Array.isArray(response.data)) {
          users = response.data;
        }
      }
      
      return {
        ...response,
        data: {
          success: true,
          data: {
            users: users,
            pagination: pagination
          }
        }
      };
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise} User details
   */
  getUserById: async (id) => {
    return handleResponse(
      api.get(`${API_ENDPOINTS.USERS}/${id}`),
      'GET',
      `/users/${id}`
    );
  },

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise} Created user
   */
  createUser: async (userData) => {
    // Remove any undefined or empty values
    const cleanData = {
      ...userData,
      isActive: userData.status === 'active',
      status: userData.status || 'active',
      isEmailVerified: false,
      isPhoneVerified: false,
      chatEnabled: userData.chatEnabled || false,
      createdAt: new Date()
    };
    
    delete cleanData._id;
    
    return handleResponse(
      api.post(API_ENDPOINTS.USERS, cleanData),
      'POST',
      '/users'
    );
  },

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} Updated user
   */
  updateUser: async (id, userData) => {
    const cleanData = { ...userData };
    delete cleanData._id;
    delete cleanData.password;
    delete cleanData.createdAt;
    
    cleanData.updatedAt = new Date();
    cleanData.isActive = cleanData.status === 'active';
    
    return handleResponse(
      api.put(`${API_ENDPOINTS.USERS}/${id}`, cleanData),
      'PUT',
      `/users/${id}`
    );
  },

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise} Deletion confirmation
   */
  deleteUser: async (id) => {
    return handleResponse(
      api.delete(`${API_ENDPOINTS.USERS}/${id}`),
      'DELETE',
      `/users/${id}`
    );
  },

  /**
   * Bulk import users
   * @param {Array} users - Array of user objects
   * @returns {Promise} Import results
   */
  bulkImportUsers: (users) => {
    return handleResponse(
      api.post(API_ENDPOINTS.USERS_BULK_IMPORT, { users }),
      'POST',
      '/users/bulk-import'
    );
  },

  /**
   * Export users to file
   * @param {Object} params - Export parameters
   * @returns {Promise} Blob data
   */
  exportUsers: (params = {}) => {
    return handleResponse(
      api.get(API_ENDPOINTS.USERS_EXPORT, { params, responseType: 'blob' }),
      'GET',
      '/users/export'
    );
  },

  // ==================== ONLINE STATUS METHODS ====================

  /**
   * Get all online users
   * @returns {Promise} List of online users
   */
  getOnlineUsers: async () => {
    return handleResponse(
      api.get('/users/online'),
      'GET',
      '/users/online'
    );
  },

  /**
   * Get online users count
   * @returns {Promise} Count of online users
   */
  getOnlineUsersCount: async () => {
    return handleResponse(
      api.get('/users/online/count'),
      'GET',
      '/users/online/count'
    );
  },

  /**
   * Get specific user's online status
   * @param {string} userId - User ID
   * @returns {Promise} User online status
   */
  getUserOnlineStatus: async (userId) => {
    return handleResponse(
      api.get(`/users/${userId}/status`),
      'GET',
      `/users/${userId}/status`
    );
  },

  /**
   * Update current user's online status
   * @param {boolean} isOnline - Online status
   * @returns {Promise} Updated status
   */
  updateOnlineStatus: async (isOnline) => {
    return handleResponse(
      api.post('/users/update-status', { isOnline }),
      'POST',
      '/users/update-status'
    );
  },

  /**
   * Send heartbeat to keep session alive
   * @returns {Promise} Heartbeat response
   */
  updateHeartbeat: async () => {
    return handleResponse(
      api.post('/users/heartbeat'),
      'POST',
      '/users/heartbeat'
    );
  },

  /**
   * Get online technicians only
   * @returns {Promise} List of online technicians
   */
  getOnlineTechnicians: async () => {
    return handleResponse(
      api.get('/users/online/technicians'),
      'GET',
      '/users/online/technicians'
    );
  },

  /**
   * Get online managers only
   * @returns {Promise} List of online managers
   */
  getOnlineManagers: async () => {
    return handleResponse(
      api.get('/users/online/managers'),
      'GET',
      '/users/online/managers'
    );
  },

  /**
   * Get bulk online status for multiple users
   * @param {Array} userIds - Array of user IDs
   * @returns {Promise} Map of user IDs to online status
   */
  getBulkOnlineStatus: async (userIds) => {
    return handleResponse(
      api.post('/users/bulk/online-status', { userIds }),
      'POST',
      '/users/bulk/online-status'
    );
  },

  /**
   * Get users active in last X minutes
   * @param {number} minutes - Minutes to check (default: 5)
   * @returns {Promise} List of active users
   */
  getRecentActiveUsers: async (minutes = 5) => {
    return handleResponse(
      api.get(`/users/activity/recent?minutes=${minutes}`),
      'GET',
      '/users/activity/recent'
    );
  },

  /**
   * Get inactive users (not seen for X days)
   * @param {number} days - Days threshold (default: 7)
   * @returns {Promise} List of inactive users
   */
  getInactiveUsers: async (days = 7) => {
    return handleResponse(
      api.get(`/users/activity/inactive?days=${days}`),
      'GET',
      '/users/activity/inactive'
    );
  },

  /**
   * Register socket ID for current user
   * @param {string} socketId - Socket.IO connection ID
   * @returns {Promise} Registration response
   */
  registerSocketId: async (socketId) => {
    return handleResponse(
      api.post('/users/socket/register', { socketId }),
      'POST',
      '/users/socket/register'
    );
  },

  /**
   * Unregister socket ID (user disconnects)
   * @returns {Promise} Unregistration response
   */
  unregisterSocketId: async () => {
    return handleResponse(
      api.delete('/users/socket/unregister'),
      'DELETE',
      '/users/socket/unregister'
    );
  },

  // ==================== LEAVE MANAGEMENT METHODS ====================

  /**
   * Get leave statistics
   * @param {Object} params - Query parameters (year, month, department)
   * @returns {Promise} Leave statistics
   */
  getLeaveStats: async (params = {}) => {
    return handleResponse(
      api.get('/leaves/stats', { params }),
      'GET',
      '/leaves/stats'
    );
  },

  /**
   * Get user's leave balance
   * @param {string} userId - User ID (optional, defaults to current user)
   * @returns {Promise} Leave balance
   */
  getLeaveBalance: async (userId = null) => {
    const url = userId ? `/leaves/balance/${userId}` : '/leaves/balance';
    return handleResponse(
      api.get(url),
      'GET',
      url
    );
  },

  /**
   * Get leave requests
   * @param {Object} params - Query parameters
   * @returns {Promise} List of leave requests
   */
  getLeaveRequests: async (params = {}) => {
    return handleResponse(
      api.get('/leaves', { params }),
      'GET',
      '/leaves'
    );
  },

  /**
   * Create leave request
   * @param {Object} leaveData - Leave request data
   * @returns {Promise} Created leave request
   */
  createLeaveRequest: async (leaveData) => {
    return handleResponse(
      api.post('/leaves', leaveData),
      'POST',
      '/leaves'
    );
  },

  /**
   * Update leave request status (Approve/Reject)
   * @param {string} leaveId - Leave request ID
   * @param {Object} data - { status, remarks }
   * @returns {Promise} Updated leave request
   */
  updateLeaveStatus: async (leaveId, data) => {
    return handleResponse(
      api.put(`/leaves/${leaveId}/status`, data),
      'PUT',
      `/leaves/${leaveId}/status`
    );
  },

  // ==================== ATTENDANCE METHODS ====================

  /**
   * Get attendance dashboard statistics
   * @param {Object} params - Query parameters (date, department)
   * @returns {Promise} Attendance statistics
   */
  getAttendanceStats: async (params = {}) => {
    return handleResponse(
      api.get('/attendance/dashboard-stats', { params }),
      'GET',
      '/attendance/dashboard-stats'
    );
  },

  /**
   * Get user's attendance records
   * @param {Object} params - Query parameters (month, year)
   * @returns {Promise} Attendance records
   */
  getUserAttendance: async (params = {}) => {
    return handleResponse(
      api.get('/attendance/my-attendance', { params }),
      'GET',
      '/attendance/my-attendance'
    );
  },

  /**
   * Check-in user
   * @param {Object} data - Check-in data (location, notes)
   * @returns {Promise} Check-in response
   */
  checkIn: async (data = {}) => {
    return handleResponse(
      api.post('/attendance/check-in', data),
      'POST',
      '/attendance/check-in'
    );
  },

  /**
   * Check-out user
   * @param {Object} data - Check-out data (location, notes)
   * @returns {Promise} Check-out response
   */
  checkOut: async (data = {}) => {
    return handleResponse(
      api.post('/attendance/check-out', data),
      'POST',
      '/attendance/check-out'
    );
  },

  /**
   * Get attendance summary for a user
   * @param {string} userId - User ID (optional)
   * @param {number} year - Year
   * @param {number} month - Month
   * @returns {Promise} Attendance summary
   */
  getAttendanceSummary: async (userId = null, year = null, month = null) => {
    const params = {};
    if (userId) params.userId = userId;
    if (year) params.year = year;
    if (month) params.month = month;
    return handleResponse(
      api.get('/attendance/summary', { params }),
      'GET',
      '/attendance/summary'
    );
  },

  // ==================== CHAT PERMISSION METHODS ====================

  /**
   * Toggle chat enabled for a specific user (Super Admin only)
   * @param {string} userId - User ID
   * @param {Object} data - { chatEnabled: boolean }
   * @returns {Promise} Updated user
   */
  toggleChatEnabled: async (userId, data) => {
    return handleResponse(
      api.put(`/users/${userId}/toggle-chat`, data),
      'PUT',
      `/users/${userId}/toggle-chat`
    );
  },

  /**
   * Get all users with chat enabled
   * @returns {Promise} List of chat-enabled users
   */
  getChatEnabledUsers: async () => {
    return handleResponse(
      api.get('/users/chat-enabled'),
      'GET',
      '/users/chat-enabled'
    );
  },

  /**
   * Bulk enable/disable chat for multiple users (Super Admin only)
   * @param {Array} userIds - Array of user IDs
   * @param {boolean} chatEnabled - Enable or disable chat
   * @returns {Promise} Bulk operation result
   */
  bulkToggleChatEnabled: async (userIds, chatEnabled) => {
    return handleResponse(
      api.post('/users/bulk-toggle-chat', { userIds, chatEnabled }),
      'POST',
      '/users/bulk-toggle-chat'
    );
  },

  /**
   * Get chat permission matrix
   * @returns {Promise} Chat permissions
   */
  getChatPermissions: async () => {
    return handleResponse(
      api.get('/users/chat/permissions'),
      'GET',
      '/users/chat/permissions'
    );
  },

  /**
   * Get chat statistics (enabled users count, etc.)
   * @returns {Promise} Chat statistics
   */
  getChatStats: async () => {
    return handleResponse(
      api.get('/users/chat/stats'),
      'GET',
      '/users/chat/stats'
    );
  },

  // ==================== USER STATUS METHODS ====================

  /**
   * Activate a user account
   * @param {string} userId - User ID
   * @returns {Promise} Activation response
   */
  activateUser: async (userId) => {
    return handleResponse(
      api.put(`/users/${userId}/activate`),
      'PUT',
      `/users/${userId}/activate`
    );
  },

  /**
   * Deactivate a user account
   * @param {string} userId - User ID
   * @param {string} reason - Reason for deactivation
   * @returns {Promise} Deactivation response
   */
  deactivateUser: async (userId, reason = '') => {
    return handleResponse(
      api.put(`/users/${userId}/deactivate`, { reason }),
      'PUT',
      `/users/${userId}/deactivate`
    );
  },

  /**
   * Reset user password (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise} Password reset response
   */
  resetUserPassword: async (userId) => {
    return handleResponse(
      api.post(`/users/${userId}/reset-password`),
      'POST',
      `/users/${userId}/reset-password`
    );
  },

  // ==================== TEAM MANAGEMENT METHODS ====================

  /**
   * Get users by role
   * @param {string} role - Role name (technician, supervisor, manager, etc.)
   * @returns {Promise} List of users with specified role
   */
  getUsersByRole: async (role) => {
    return handleResponse(
      api.get('/users', { params: { role, limit: 500 } }),
      'GET',
      '/users'
    );
  },

  /**
   * ✅ FIXED: Get technicians for assignment
   * @param {Object} params - Query parameters (status, online, buildingId)
   * @returns {Promise} List of technicians
   */
  getTechnicians: async (params = {}) => {
    return handleResponse(
      api.get('/users/technicians', { params }),
      'GET',
      '/users/technicians'
    );
  },

  /**
   * Get team members (for managers and supervisors)
   * @returns {Promise} List of team members
   */
  getTeamMembers: async () => {
    return handleResponse(
      api.get('/users/team'),
      'GET',
      '/users/team'
    );
  },

  /**
   * Get reporting hierarchy
   * @returns {Promise} Reporting hierarchy structure
   */
  getReportingHierarchy: async () => {
    return handleResponse(
      api.get('/users/hierarchy'),
      'GET',
      '/users/hierarchy'
    );
  },

  // ==================== PROFILE METHODS ====================

  /**
   * Update own profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Updated profile
   */
  updateOwnProfile: async (profileData) => {
    return handleResponse(
      api.put('/users/profile', profileData),
      'PUT',
      '/users/profile'
    );
  },

  /**
   * Change own password
   * @param {Object} passwordData - { currentPassword, newPassword }
   * @returns {Promise} Password change response
   */
  changeOwnPassword: async (passwordData) => {
    return handleResponse(
      api.put('/users/change-password', passwordData),
      'PUT',
      '/users/change-password'
    );
  },

  /**
   * Upload profile image
   * @param {FormData} formData - Form data with image file
   * @returns {Promise} Upload response
   */
  uploadProfileImage: async (formData) => {
    return handleResponse(
      api.post('/users/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
      'POST',
      '/users/profile/image'
    );
  },

  /**
   * Remove profile image
   * @returns {Promise} Removal response
   */
  removeProfileImage: async () => {
    return handleResponse(
      api.delete('/users/profile/image'),
      'DELETE',
      '/users/profile/image'
    );
  },

  // ==================== NOTIFICATION METHODS ====================

  /**
   * Update user's FCM token for push notifications
   * @param {string} token - FCM token
   * @returns {Promise} Token update response
   */
  updateFCMToken: async (token) => {
    return handleResponse(
      api.post('/users/fcm-token', { token }),
      'POST',
      '/users/fcm-token'
    );
  },

  /**
   * Remove FCM token
   * @param {string} token - FCM token to remove
   * @returns {Promise} Token removal response
   */
  removeFCMToken: async (token) => {
    return handleResponse(
      api.delete('/users/fcm-token', { data: { token } }),
      'DELETE',
      '/users/fcm-token'
    );
  },

  // ==================== DOCUMENT METHODS ====================

  /**
   * Upload user document (Admin only)
   * @param {string} userId - User ID
   * @param {FormData} formData - Form data with document
   * @returns {Promise} Upload response
   */
  uploadUserDocument: async (userId, formData) => {
    return handleResponse(
      api.post(`/users/${userId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
      'POST',
      `/users/${userId}/documents`
    );
  },

  /**
   * Get user documents
   * @param {string} userId - User ID
   * @returns {Promise} List of user documents
   */
  getUserDocuments: async (userId) => {
    return handleResponse(
      api.get(`/users/${userId}/documents`),
      'GET',
      `/users/${userId}/documents`
    );
  },

  /**
   * Delete user document
   * @param {string} userId - User ID
   * @param {string} documentId - Document ID
   * @returns {Promise} Deletion response
   */
  deleteUserDocument: async (userId, documentId) => {
    return handleResponse(
      api.delete(`/users/${userId}/documents/${documentId}`),
      'DELETE',
      `/users/${userId}/documents/${documentId}`
    );
  },

  // ==================== BULK OPERATIONS ====================

  /**
   * Bulk update user status
   * @param {Array} userIds - Array of user IDs
   * @param {string} status - New status
   * @returns {Promise} Bulk update response
   */
  bulkUpdateStatus: async (userIds, status) => {
    return handleResponse(
      api.post('/users/bulk/status', { userIds, status }),
      'POST',
      '/users/bulk/status'
    );
  },

  /**
   * Bulk assign role
   * @param {Array} userIds - Array of user IDs
   * @param {string} role - Role to assign
   * @returns {Promise} Bulk role assignment response
   */
  bulkAssignRole: async (userIds, role) => {
    return handleResponse(
      api.post('/users/bulk/role', { userIds, role }),
      'POST',
      '/users/bulk/role'
    );
  },

  /**
   * Bulk delete users
   * @param {Array} userIds - Array of user IDs
   * @returns {Promise} Bulk deletion response
   */
  bulkDeleteUsers: async (userIds) => {
    return handleResponse(
      api.post('/users/bulk/delete', { userIds }),
      'POST',
      '/users/bulk/delete'
    );
  },

  // ==================== DASHBOARD STATISTICS ====================

  /**
   * Get dashboard statistics
   * @returns {Promise} Dashboard stats
   */
  getDashboardStats: async () => {
    return handleResponse(
      api.get('/users/dashboard/stats'),
      'GET',
      '/users/dashboard/stats'
    );
  },

  /**
   * Get user activity log
   * @param {Object} params - Query parameters (page, limit, fromDate, toDate)
   * @returns {Promise} Activity log
   */
  getUserActivityLog: async (params = {}) => {
    return handleResponse(
      api.get('/users/activity-log', { params }),
      'GET',
      '/users/activity-log'
    );
  },

  /**
   * Get user permissions
   * @param {string} userId - User ID
   * @returns {Promise} User permissions
   */
  getUserPermissions: async (userId) => {
    return handleResponse(
      api.get(`/users/${userId}/permissions`),
      'GET',
      `/users/${userId}/permissions`
    );
  },

  /**
   * Update user permissions
   * @param {string} userId - User ID
   * @param {Array} permissions - Array of permission strings
   * @returns {Promise} Updated permissions
   */
  updateUserPermissions: async (userId, permissions) => {
    return handleResponse(
      api.put(`/users/${userId}/permissions`, { permissions }),
      'PUT',
      `/users/${userId}/permissions`
    );
  },

  // ==================== ALIASES FOR BACKWARD COMPATIBILITY ====================
  // These methods preserve old functionality

  /**
   * @deprecated Use getUsers instead
   */
  getAllUsers: async (params = {}) => {
    console.warn('getAllUsers is deprecated. Use getUsers instead.');
    return userApi.getUsers(params);
  },

  /**
   * @deprecated Use updateUser instead
   */
  updateUserById: async (id, userData) => {
    console.warn('updateUserById is deprecated. Use updateUser instead.');
    return userApi.updateUser(id, userData);
  },

  /**
   * @deprecated Use deleteUser instead
   */
  removeUser: async (id) => {
    console.warn('removeUser is deprecated. Use deleteUser instead.');
    return userApi.deleteUser(id);
  },

  /**
   * @deprecated Use getUsersByRole with role='technician' instead
   */
  getTechniciansList: async () => {
    console.warn('getTechniciansList is deprecated. Use getTechnicians instead.');
    return userApi.getTechnicians();
  }
};

// Export individual functions for direct imports
export const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getTechnicians,
  getOnlineUsers,
  getOnlineUsersCount,
  getLeaveStats,
  getLeaveBalance,
  getAttendanceStats
} = userApi;

export default userApi;