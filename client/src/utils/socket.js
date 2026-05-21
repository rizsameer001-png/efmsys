// // client/src/utils/socket.js
// import io from 'socket.io-client';

// let socket = null;

// export const getSocket = () => {
//   if (!socket) {
//     const token = localStorage.getItem('accessToken');
//     socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
//       auth: { token },
//       transports: ['websocket']
//     });
    
//     socket.on('connect', () => {
//       console.log('Socket connected');
//     });
    
//     socket.on('disconnect', () => {
//       console.log('Socket disconnected');
//     });
    
//     socket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//     });
//   }
//   return socket;
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };




// // client/src/utils/socket.js
// import io from 'socket.io-client';

// let socket = null;
// let reconnectAttempts = 0;
// const MAX_RECONNECT_ATTEMPTS = 5;
// let eventListeners = new Map();

// /**
//  * Get the Socket.IO instance
//  * @returns {Object} Socket instance
//  */
// export const getSocket = () => {
//   if (!socket) {
//     const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
//     const apiUrl = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'http://localhost:5000';
    
//     socket = io(apiUrl, {
//       auth: { token },
//       transports: ['websocket', 'polling'],
//       reconnection: true,
//       reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 5000,
//       timeout: 20000,
//       autoConnect: true,
//       withCredentials: true
//     });
    
//     // Connection event handlers
//     socket.on('connect', () => {
//       console.log('🔌 Socket connected successfully');
//       reconnectAttempts = 0;
      
//       // Register socket ID with backend
//       registerSocketId();
      
//       // Start heartbeat
//       startHeartbeat();
      
//       // Emit connection event for listeners
//       emitLocalEvent('socket_connected', { socketId: socket.id });
//     });
    
//     socket.on('disconnect', (reason) => {
//       console.log('🔌 Socket disconnected:', reason);
      
//       // Stop heartbeat
//       stopHeartbeat();
      
//       // Emit disconnect event
//       emitLocalEvent('socket_disconnected', { reason });
      
//       // Handle specific disconnect reasons
//       if (reason === 'io server disconnect') {
//         // Server disconnected, attempt to reconnect
//         socket.connect();
//       }
//     });
    
//     socket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error.message);
//       reconnectAttempts++;
      
//       emitLocalEvent('socket_error', { error: error.message, attempts: reconnectAttempts });
      
//       if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
//         console.error('Max reconnection attempts reached');
//         emitLocalEvent('socket_max_attempts', { attempts: reconnectAttempts });
//       }
//     });
    
//     socket.on('reconnect', (attemptNumber) => {
//       console.log(`Socket reconnected after ${attemptNumber} attempts`);
//       registerSocketId();
//       emitLocalEvent('socket_reconnected', { attemptNumber });
//     });
    
//     socket.on('reconnect_attempt', (attemptNumber) => {
//       console.log(`Socket reconnection attempt ${attemptNumber}`);
//     });
    
//     socket.on('reconnect_error', (error) => {
//       console.error('Socket reconnection error:', error);
//     });
    
//     socket.on('reconnect_failed', () => {
//       console.error('Socket reconnection failed');
//       emitLocalEvent('socket_reconnect_failed', {});
//     });
    
//     // Handle ping/pong for connection health
//     socket.on('ping', () => {
//       // Update last activity
//       updateLastActivity();
//     });
    
//     socket.on('pong', (latency) => {
//       // Track latency for performance monitoring
//       emitLocalEvent('socket_latency', { latency });
//     });
//   }
  
//   return socket;
// };

// /**
//  * Register socket ID with backend
//  */
// const registerSocketId = async () => {
//   if (!socket || !socket.id) return;
  
//   try {
//     const { userApi } = await import('../api/user.api');
//     await userApi.registerSocketId(socket.id);
//     console.log('Socket ID registered with backend:', socket.id);
//   } catch (error) {
//     console.error('Failed to register socket ID:', error);
//   }
// };

// /**
//  * Unregister socket ID from backend
//  */
// const unregisterSocketId = async () => {
//   if (!socket) return;
  
//   try {
//     const { userApi } = await import('../api/user.api');
//     await userApi.unregisterSocketId();
//     console.log('Socket ID unregistered from backend');
//   } catch (error) {
//     console.error('Failed to unregister socket ID:', error);
//   }
// };

// // Heartbeat interval
// let heartbeatInterval = null;

// /**
//  * Start heartbeat to keep connection alive
//  */
// const startHeartbeat = () => {
//   if (heartbeatInterval) clearInterval(heartbeatInterval);
  
//   heartbeatInterval = setInterval(async () => {
//     if (socket && socket.connected) {
//       try {
//         const { userApi } = await import('../api/user.api');
//         await userApi.updateHeartbeat();
//         socket.emit('ping', (response) => {
//           if (response && response.pong) {
//             // Heartbeat successful
//           }
//         });
//       } catch (error) {
//         console.error('Heartbeat failed:', error);
//       }
//     }
//   }, 30000); // Every 30 seconds
// };

// /**
//  * Stop heartbeat
//  */
// const stopHeartbeat = () => {
//   if (heartbeatInterval) {
//     clearInterval(heartbeatInterval);
//     heartbeatInterval = null;
//   }
// };

// // Last activity tracking
// let lastActivity = Date.now();

// /**
//  * Update last activity timestamp
//  */
// const updateLastActivity = () => {
//   lastActivity = Date.now();
// };

// /**
//  * Check if socket is connected
//  * @returns {boolean}
//  */
// export const isSocketConnected = () => {
//   return socket && socket.connected;
// };

// /**
//  * Get socket ID
//  * @returns {string|null}
//  */
// export const getSocketId = () => {
//   return socket ? socket.id : null;
// };

// /**
//  * Join a chat room
//  * @param {string} chatId - Chat ID
//  */
// export const joinChatRoom = (chatId) => {
//   if (!socket || !socket.connected) {
//     console.warn('Socket not connected, cannot join chat room');
//     return false;
//   }
  
//   socket.emit('join_chat', chatId);
//   console.log(`Joined chat room: ${chatId}`);
//   return true;
// };

// /**
//  * Leave a chat room
//  * @param {string} chatId - Chat ID
//  */
// export const leaveChatRoom = (chatId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('leave_chat', chatId);
//   console.log(`Left chat room: ${chatId}`);
//   return true;
// };

// /**
//  * Send typing indicator
//  * @param {string} chatId - Chat ID
//  * @param {string} userName - User name
//  * @param {boolean} isTyping - Whether user is typing
//  */
// export const sendTypingIndicator = (chatId, userName, isTyping) => {
//   if (!socket || !socket.connected) return false;
  
//   const event = isTyping ? 'typing_start' : 'typing_stop';
//   socket.emit(event, { chatId, userName });
//   return true;
// };

// /**
//  * Send message read receipt
//  * @param {string} messageId - Message ID
//  * @param {string} chatId - Chat ID
//  */
// export const sendReadReceipt = (messageId, chatId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('message_read', { messageId, chatId });
//   return true;
// };

// /**
//  * Send message delivered receipt
//  * @param {string} messageId - Message ID
//  * @param {string} chatId - Chat ID
//  */
// export const sendDeliveredReceipt = (messageId, chatId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('message_delivered', { messageId, chatId });
//   return true;
// };

// /**
//  * Join user's personal room
//  * @param {string} userId - User ID
//  */
// export const joinUserRoom = (userId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_user_room', userId);
//   console.log(`Joined user room: ${userId}`);
//   return true;
// };

// /**
//  * Join task room for real-time updates
//  * @param {string} taskId - Task ID
//  */
// export const joinTaskRoom = (taskId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_task_room', taskId);
//   console.log(`Joined task room: ${taskId}`);
//   return true;
// };

// /**
//  * Leave task room
//  * @param {string} taskId - Task ID
//  */
// export const leaveTaskRoom = (taskId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('leave_task_room', taskId);
//   return true;
// };

// /**
//  * Join complaint room for real-time updates
//  * @param {string} complaintId - Complaint ID
//  */
// export const joinComplaintRoom = (complaintId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_complaint_room', complaintId);
//   console.log(`Joined complaint room: ${complaintId}`);
//   return true;
// };

// /**
//  * Join building room for real-time updates
//  * @param {string} buildingId - Building ID
//  */
// export const joinBuildingRoom = (buildingId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_building_room', buildingId);
//   console.log(`Joined building room: ${buildingId}`);
//   return true;
// };

// /**
//  * Send task update
//  * @param {string} taskId - Task ID
//  * @param {object} updateData - Update data
//  */
// export const sendTaskUpdate = (taskId, updateData) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('task_update', { taskId, ...updateData });
//   return true;
// };

// /**
//  * Send complaint update
//  * @param {string} complaintId - Complaint ID
//  * @param {object} updateData - Update data
//  */
// export const sendComplaintUpdate = (complaintId, updateData) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('complaint_update', { complaintId, ...updateData });
//   return true;
// };

// /**
//  * Add event listener for socket events
//  * @param {string} event - Event name
//  * @param {function} callback - Callback function
//  */
// export const onSocketEvent = (event, callback) => {
//   const socket = getSocket();
  
//   if (!eventListeners.has(event)) {
//     eventListeners.set(event, []);
//   }
  
//   eventListeners.get(event).push(callback);
//   socket.on(event, callback);
// };

// /**
//  * Remove event listener
//  * @param {string} event - Event name
//  * @param {function} callback - Callback function (optional)
//  */
// export const offSocketEvent = (event, callback = null) => {
//   const socket = getSocket();
  
//   if (callback) {
//     socket.off(event, callback);
//     const listeners = eventListeners.get(event) || [];
//     const index = listeners.indexOf(callback);
//     if (index > -1) listeners.splice(index, 1);
//   } else {
//     socket.off(event);
//     eventListeners.delete(event);
//   }
// };

// /**
//  * Emit local event (for internal use)
//  * @param {string} event - Event name
//  * @param {object} data - Event data
//  */
// const emitLocalEvent = (event, data) => {
//   const callbacks = eventListeners.get(event) || [];
//   callbacks.forEach(callback => callback(data));
// };

// /**
//  * Disconnect socket
//  */
// export const disconnectSocket = async () => {
//   if (socket) {
//     // Stop heartbeat
//     stopHeartbeat();
    
//     // Unregister socket ID
//     await unregisterSocketId();
    
//     // Update user status to offline
//     try {
//       const { userApi } = await import('../api/user.api');
//       await userApi.updateOnlineStatus(false);
//     } catch (error) {
//       console.error('Failed to update offline status:', error);
//     }
    
//     // Disconnect socket
//     socket.disconnect();
//     socket = null;
    
//     // Clear event listeners
//     eventListeners.clear();
    
//     console.log('Socket disconnected and cleaned up');
//   }
// };

// /**
//  * Reconnect socket manually
//  */
// export const reconnectSocket = async () => {
//   if (socket) {
//     await disconnectSocket();
//   }
  
//   reconnectAttempts = 0;
//   return getSocket();
// };

// /**
//  * Get connection status
//  * @returns {object} Connection status
//  */
// export const getConnectionStatus = () => {
//   return {
//     isConnected: socket ? socket.connected : false,
//     socketId: socket ? socket.id : null,
//     reconnectAttempts,
//     lastActivity: lastActivity ? new Date(lastActivity) : null
//   };
// };

// // Export default object for convenience
// export default {
//   getSocket,
//   disconnectSocket,
//   reconnectSocket,
//   isSocketConnected,
//   getSocketId,
//   getConnectionStatus,
//   joinChatRoom,
//   leaveChatRoom,
//   sendTypingIndicator,
//   sendReadReceipt,
//   sendDeliveredReceipt,
//   joinUserRoom,
//   joinTaskRoom,
//   leaveTaskRoom,
//   joinComplaintRoom,
//   joinBuildingRoom,
//   sendTaskUpdate,
//   sendComplaintUpdate,
//   onSocketEvent,
//   offSocketEvent
// };





// // client/src/utils/socket.js
// import io from 'socket.io-client';

// let socket = null;
// let reconnectAttempts = 0;
// const MAX_RECONNECT_ATTEMPTS = 5;
// let eventListeners = new Map();

// /**
//  * Get the Socket.IO instance
//  * @returns {Object} Socket instance
//  */
// export const getSocket = () => {
//   if (!socket) {
//     const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
//     // FIX: Use import.meta.env for Vite instead of process.env
//     const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
//     socket = io(apiUrl, {
//       auth: { token },
//       transports: ['websocket', 'polling'],
//       reconnection: true,
//       reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 5000,
//       timeout: 20000,
//       autoConnect: true,
//       withCredentials: true
//     });
    
//     // Connection event handlers
//     socket.on('connect', () => {
//       console.log('🔌 Socket connected successfully');
//       reconnectAttempts = 0;
      
//       // Register socket ID with backend
//       registerSocketId();
      
//       // Start heartbeat
//       startHeartbeat();
      
//       // Emit connection event for listeners
//       emitLocalEvent('socket_connected', { socketId: socket.id });
//     });
    
//     socket.on('disconnect', (reason) => {
//       console.log('🔌 Socket disconnected:', reason);
      
//       // Stop heartbeat
//       stopHeartbeat();
      
//       // Emit disconnect event
//       emitLocalEvent('socket_disconnected', { reason });
      
//       // Handle specific disconnect reasons
//       if (reason === 'io server disconnect') {
//         // Server disconnected, attempt to reconnect
//         socket.connect();
//       }
//     });
    
//     socket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error.message);
//       reconnectAttempts++;
      
//       emitLocalEvent('socket_error', { error: error.message, attempts: reconnectAttempts });
      
//       if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
//         console.error('Max reconnection attempts reached');
//         emitLocalEvent('socket_max_attempts', { attempts: reconnectAttempts });
//       }
//     });
    
//     socket.on('reconnect', (attemptNumber) => {
//       console.log(`Socket reconnected after ${attemptNumber} attempts`);
//       registerSocketId();
//       emitLocalEvent('socket_reconnected', { attemptNumber });
//     });
    
//     socket.on('reconnect_attempt', (attemptNumber) => {
//       console.log(`Socket reconnection attempt ${attemptNumber}`);
//     });
    
//     socket.on('reconnect_error', (error) => {
//       console.error('Socket reconnection error:', error);
//     });
    
//     socket.on('reconnect_failed', () => {
//       console.error('Socket reconnection failed');
//       emitLocalEvent('socket_reconnect_failed', {});
//     });
    
//     // Handle ping/pong for connection health
//     socket.on('ping', () => {
//       // Update last activity
//       updateLastActivity();
//     });
    
//     socket.on('pong', (latency) => {
//       // Track latency for performance monitoring
//       emitLocalEvent('socket_latency', { latency });
//     });
//   }
  
//   return socket;
// };

// /**
//  * Register socket ID with backend
//  */
// const registerSocketId = async () => {
//   if (!socket || !socket.id) return;
  
//   try {
//     const { userApi } = await import('../api/user.api');
//     await userApi.registerSocketId(socket.id);
//     console.log('Socket ID registered with backend:', socket.id);
//   } catch (error) {
//     console.error('Failed to register socket ID:', error);
//   }
// };

// /**
//  * Unregister socket ID from backend
//  */
// const unregisterSocketId = async () => {
//   if (!socket) return;
  
//   try {
//     const { userApi } = await import('../api/user.api');
//     await userApi.unregisterSocketId();
//     console.log('Socket ID unregistered from backend');
//   } catch (error) {
//     console.error('Failed to unregister socket ID:', error);
//   }
// };

// // Heartbeat interval
// let heartbeatInterval = null;

// /**
//  * Start heartbeat to keep connection alive
//  */
// const startHeartbeat = () => {
//   if (heartbeatInterval) clearInterval(heartbeatInterval);
  
//   heartbeatInterval = setInterval(async () => {
//     if (socket && socket.connected) {
//       try {
//         const { userApi } = await import('../api/user.api');
//         await userApi.updateHeartbeat();
//         socket.emit('ping', (response) => {
//           if (response && response.pong) {
//             // Heartbeat successful
//           }
//         });
//       } catch (error) {
//         console.error('Heartbeat failed:', error);
//       }
//     }
//   }, 30000); // Every 30 seconds
// };

// /**
//  * Stop heartbeat
//  */
// const stopHeartbeat = () => {
//   if (heartbeatInterval) {
//     clearInterval(heartbeatInterval);
//     heartbeatInterval = null;
//   }
// };

// // Last activity tracking
// let lastActivity = Date.now();

// /**
//  * Update last activity timestamp
//  */
// const updateLastActivity = () => {
//   lastActivity = Date.now();
// };

// /**
//  * Check if socket is connected
//  * @returns {boolean}
//  */
// export const isSocketConnected = () => {
//   return socket && socket.connected;
// };

// /**
//  * Get socket ID
//  * @returns {string|null}
//  */
// export const getSocketId = () => {
//   return socket ? socket.id : null;
// };

// /**
//  * Join a chat room
//  * @param {string} chatId - Chat ID
//  */
// export const joinChatRoom = (chatId) => {
//   if (!socket || !socket.connected) {
//     console.warn('Socket not connected, cannot join chat room');
//     return false;
//   }
  
//   socket.emit('join_chat', chatId);
//   console.log(`Joined chat room: ${chatId}`);
//   return true;
// };

// /**
//  * Leave a chat room
//  * @param {string} chatId - Chat ID
//  */
// export const leaveChatRoom = (chatId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('leave_chat', chatId);
//   console.log(`Left chat room: ${chatId}`);
//   return true;
// };

// /**
//  * Send typing indicator
//  * @param {string} chatId - Chat ID
//  * @param {string} userName - User name
//  * @param {boolean} isTyping - Whether user is typing
//  */
// export const sendTypingIndicator = (chatId, userName, isTyping) => {
//   if (!socket || !socket.connected) return false;
  
//   const event = isTyping ? 'typing_start' : 'typing_stop';
//   socket.emit(event, { chatId, userName });
//   return true;
// };

// /**
//  * Send message read receipt
//  * @param {string} messageId - Message ID
//  * @param {string} chatId - Chat ID
//  */
// export const sendReadReceipt = (messageId, chatId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('message_read', { messageId, chatId });
//   return true;
// };

// /**
//  * Send message delivered receipt
//  * @param {string} messageId - Message ID
//  * @param {string} chatId - Chat ID
//  */
// export const sendDeliveredReceipt = (messageId, chatId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('message_delivered', { messageId, chatId });
//   return true;
// };

// /**
//  * Join user's personal room
//  * @param {string} userId - User ID
//  */
// export const joinUserRoom = (userId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_user_room', userId);
//   console.log(`Joined user room: ${userId}`);
//   return true;
// };

// /**
//  * Join task room for real-time updates
//  * @param {string} taskId - Task ID
//  */
// export const joinTaskRoom = (taskId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_task_room', taskId);
//   console.log(`Joined task room: ${taskId}`);
//   return true;
// };

// /**
//  * Leave task room
//  * @param {string} taskId - Task ID
//  */
// export const leaveTaskRoom = (taskId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('leave_task_room', taskId);
//   return true;
// };

// /**
//  * Join complaint room for real-time updates
//  * @param {string} complaintId - Complaint ID
//  */
// export const joinComplaintRoom = (complaintId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_complaint_room', complaintId);
//   console.log(`Joined complaint room: ${complaintId}`);
//   return true;
// };

// /**
//  * Join building room for real-time updates
//  * @param {string} buildingId - Building ID
//  */
// export const joinBuildingRoom = (buildingId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_building_room', buildingId);
//   console.log(`Joined building room: ${buildingId}`);
//   return true;
// };

// /**
//  * Send task update
//  * @param {string} taskId - Task ID
//  * @param {object} updateData - Update data
//  */
// export const sendTaskUpdate = (taskId, updateData) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('task_update', { taskId, ...updateData });
//   return true;
// };

// /**
//  * Send complaint update
//  * @param {string} complaintId - Complaint ID
//  * @param {object} updateData - Update data
//  */
// export const sendComplaintUpdate = (complaintId, updateData) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('complaint_update', { complaintId, ...updateData });
//   return true;
// };

// /**
//  * Add event listener for socket events
//  * @param {string} event - Event name
//  * @param {function} callback - Callback function
//  */
// export const onSocketEvent = (event, callback) => {
//   const socket = getSocket();
  
//   if (!eventListeners.has(event)) {
//     eventListeners.set(event, []);
//   }
  
//   eventListeners.get(event).push(callback);
//   socket.on(event, callback);
// };

// /**
//  * Remove event listener
//  * @param {string} event - Event name
//  * @param {function} callback - Callback function (optional)
//  */
// export const offSocketEvent = (event, callback = null) => {
//   const socket = getSocket();
  
//   if (callback) {
//     socket.off(event, callback);
//     const listeners = eventListeners.get(event) || [];
//     const index = listeners.indexOf(callback);
//     if (index > -1) listeners.splice(index, 1);
//   } else {
//     socket.off(event);
//     eventListeners.delete(event);
//   }
// };

// /**
//  * Emit local event (for internal use)
//  * @param {string} event - Event name
//  * @param {object} data - Event data
//  */
// const emitLocalEvent = (event, data) => {
//   const callbacks = eventListeners.get(event) || [];
//   callbacks.forEach(callback => callback(data));
// };

// /**
//  * Disconnect socket
//  */
// export const disconnectSocket = async () => {
//   if (socket) {
//     // Stop heartbeat
//     stopHeartbeat();
    
//     // Unregister socket ID
//     await unregisterSocketId();
    
//     // Update user status to offline
//     try {
//       const { userApi } = await import('../api/user.api');
//       await userApi.updateOnlineStatus(false);
//     } catch (error) {
//       console.error('Failed to update offline status:', error);
//     }
    
//     // Disconnect socket
//     socket.disconnect();
//     socket = null;
    
//     // Clear event listeners
//     eventListeners.clear();
    
//     console.log('Socket disconnected and cleaned up');
//   }
// };

// /**
//  * Reconnect socket manually
//  */
// export const reconnectSocket = async () => {
//   if (socket) {
//     await disconnectSocket();
//   }
  
//   reconnectAttempts = 0;
//   return getSocket();
// };

// /**
//  * Get connection status
//  * @returns {object} Connection status
//  */
// export const getConnectionStatus = () => {
//   return {
//     isConnected: socket ? socket.connected : false,
//     socketId: socket ? socket.id : null,
//     reconnectAttempts,
//     lastActivity: lastActivity ? new Date(lastActivity) : null
//   };
// };

// // Export default object for convenience
// export default {
//   getSocket,
//   disconnectSocket,
//   reconnectSocket,
//   isSocketConnected,
//   getSocketId,
//   getConnectionStatus,
//   joinChatRoom,
//   leaveChatRoom,
//   sendTypingIndicator,
//   sendReadReceipt,
//   sendDeliveredReceipt,
//   joinUserRoom,
//   joinTaskRoom,
//   leaveTaskRoom,
//   joinComplaintRoom,
//   joinBuildingRoom,
//   sendTaskUpdate,
//   sendComplaintUpdate,
//   onSocketEvent,
//   offSocketEvent
// };



// // client/src/utils/socket.js
// import io from 'socket.io-client';

// let socket = null;
// let reconnectAttempts = 0;
// let reconnectTimer = null;
// const MAX_RECONNECT_ATTEMPTS = 5;
// const RECONNECT_DELAY = 2000;
// let eventListeners = new Map();
// let connectionStatus = {
//   isConnected: false,
//   socketId: null,
//   lastAttempt: null,
//   error: null
// };

// // Connection state callbacks
// let connectionCallbacks = [];

// /**
//  * Get the Socket.IO instance
//  * @returns {Object} Socket instance
//  */
// export const getSocket = () => {
//   if (!socket) {
//     const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    
//     // Validate token exists
//     if (!token) {
//       console.warn('No authentication token found, socket connection will fail');
//     }
    
//     const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
//     // Remove trailing slash for consistency
//     const cleanUrl = apiUrl.replace(/\/$/, '');
    
//     console.log(`Initializing socket connection to ${cleanUrl}`);
    
//     try {
//       socket = io(cleanUrl, {
//         auth: { token },
//         transports: ['websocket', 'polling'],
//         reconnection: true,
//         reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
//         reconnectionDelay: 1000,
//         reconnectionDelayMax: 5000,
//         timeout: 20000,
//         autoConnect: true,
//         withCredentials: true,
//         path: '/socket.io'
//       });
      
//       // Setup all event handlers
//       setupSocketEventHandlers();
      
//     } catch (error) {
//       console.error('Failed to create socket connection:', error);
//       connectionStatus.error = error.message;
//       notifyConnectionCallbacks(false, error.message);
//     }
//   }
  
//   return socket;
// };

// /**
//  * Setup all socket event handlers
//  */
// const setupSocketEventHandlers = () => {
//   if (!socket) return;
  
//   // Connection successful
//   socket.on('connect', () => {
//     console.log('🔌 Socket connected successfully');
//     reconnectAttempts = 0;
//     connectionStatus.isConnected = true;
//     connectionStatus.socketId = socket.id;
//     connectionStatus.error = null;
//     connectionStatus.lastAttempt = new Date();
    
//     // Register socket ID with backend
//     registerSocketId();
    
//     // Start heartbeat
//     startHeartbeat();
    
//     // Emit connection event for listeners
//     emitLocalEvent('socket_connected', { socketId: socket.id });
//     notifyConnectionCallbacks(true, null);
//   });
  
//   // Disconnect
//   socket.on('disconnect', (reason) => {
//     console.log('🔌 Socket disconnected:', reason);
//     connectionStatus.isConnected = false;
//     connectionStatus.socketId = null;
    
//     // Stop heartbeat
//     stopHeartbeat();
    
//     // Emit disconnect event
//     emitLocalEvent('socket_disconnected', { reason });
//     notifyConnectionCallbacks(false, reason);
    
//     // Handle specific disconnect reasons
//     if (reason === 'io server disconnect') {
//       // Server disconnected, attempt to reconnect
//       console.log('Server disconnected, attempting to reconnect...');
//       setTimeout(() => {
//         if (socket) socket.connect();
//       }, RECONNECT_DELAY);
//     }
//   });
  
//   // Connection error
//   socket.on('connect_error', (error) => {
//     console.error('Socket connection error:', error.message);
//     reconnectAttempts++;
//     connectionStatus.error = error.message;
//     connectionStatus.lastAttempt = new Date();
    
//     emitLocalEvent('socket_error', { error: error.message, attempts: reconnectAttempts });
    
//     if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
//       console.error('Max reconnection attempts reached');
//       emitLocalEvent('socket_max_attempts', { attempts: reconnectAttempts });
//       connectionStatus.error = `Failed after ${MAX_RECONNECT_ATTEMPTS} attempts`;
//     }
//   });
  
//   // Reconnection successful
//   socket.on('reconnect', (attemptNumber) => {
//     console.log(`Socket reconnected after ${attemptNumber} attempts`);
//     reconnectAttempts = 0;
//     connectionStatus.isConnected = true;
//     connectionStatus.socketId = socket.id;
//     connectionStatus.error = null;
    
//     registerSocketId();
//     emitLocalEvent('socket_reconnected', { attemptNumber });
//     notifyConnectionCallbacks(true, null);
//   });
  
//   // Reconnection attempt
//   socket.on('reconnect_attempt', (attemptNumber) => {
//     console.log(`Socket reconnection attempt ${attemptNumber}`);
//     emitLocalEvent('socket_reconnect_attempt', { attemptNumber });
//   });
  
//   // Reconnection error
//   socket.on('reconnect_error', (error) => {
//     console.error('Socket reconnection error:', error);
//     emitLocalEvent('socket_reconnect_error', { error: error.message });
//   });
  
//   // Reconnection failed
//   socket.on('reconnect_failed', () => {
//     console.error('Socket reconnection failed');
//     emitLocalEvent('socket_reconnect_failed', {});
//     connectionStatus.error = 'Reconnection failed permanently';
//   });
  
//   // Handle ping/pong for connection health
//   socket.on('ping', () => {
//     updateLastActivity();
//   });
  
//   socket.on('pong', (latency) => {
//     emitLocalEvent('socket_latency', { latency });
//   });
  
//   // Authentication error
//   socket.on('unauthorized', (data) => {
//     console.error('Socket unauthorized:', data);
//     emitLocalEvent('socket_unauthorized', data);
    
//     // Check if token expired
//     if (data.message?.includes('token')) {
//       console.warn('Token may be expired, consider refreshing');
//     }
//   });
// };

// /**
//  * Register socket ID with backend
//  */
// const registerSocketId = async () => {
//   if (!socket || !socket.id) return;
  
//   try {
//     const { userApi } = await import('../api/user.api');
//     await userApi.registerSocketId(socket.id);
//     console.log('Socket ID registered with backend:', socket.id);
//   } catch (error) {
//     console.error('Failed to register socket ID:', error);
//     // Don't retry immediately, will retry on next heartbeat
//   }
// };

// /**
//  * Unregister socket ID from backend
//  */
// const unregisterSocketId = async () => {
//   if (!socket) return;
  
//   try {
//     const { userApi } = await import('../api/user.api');
//     await userApi.unregisterSocketId();
//     console.log('Socket ID unregistered from backend');
//   } catch (error) {
//     console.error('Failed to unregister socket ID:', error);
//   }
// };

// // Heartbeat interval
// let heartbeatInterval = null;
// let heartbeatMisses = 0;
// const MAX_HEARTBEAT_MISSES = 3;

// /**
//  * Start heartbeat to keep connection alive
//  */
// const startHeartbeat = () => {
//   if (heartbeatInterval) clearInterval(heartbeatInterval);
//   heartbeatMisses = 0;
  
//   heartbeatInterval = setInterval(async () => {
//     if (socket && socket.connected) {
//       try {
//         const { userApi } = await import('../api/user.api');
//         await userApi.updateHeartbeat();
        
//         // Send ping to server with timeout
//         let pingTimeout;
//         const pingPromise = new Promise((resolve, reject) => {
//           pingTimeout = setTimeout(() => reject(new Error('Ping timeout')), 5000);
          
//           socket.emit('ping', (response) => {
//             clearTimeout(pingTimeout);
//             if (response && response.pong) {
//               heartbeatMisses = 0;
//               resolve(response);
//             } else {
//               reject(new Error('Invalid ping response'));
//             }
//           });
//         });
        
//         await pingPromise;
        
//       } catch (error) {
//         console.error('Heartbeat failed:', error);
//         heartbeatMisses++;
        
//         if (heartbeatMisses >= MAX_HEARTBEAT_MISSES) {
//           console.warn('Multiple heartbeat failures, reconnecting...');
//           if (socket) socket.connect();
//           heartbeatMisses = 0;
//         }
//       }
//     }
//   }, 30000); // Every 30 seconds
// };

// /**
//  * Stop heartbeat
//  */
// const stopHeartbeat = () => {
//   if (heartbeatInterval) {
//     clearInterval(heartbeatInterval);
//     heartbeatInterval = null;
//     heartbeatMisses = 0;
//   }
// };

// // Last activity tracking
// let lastActivity = Date.now();

// /**
//  * Update last activity timestamp
//  */
// const updateLastActivity = () => {
//   lastActivity = Date.now();
// };

// /**
//  * Check if socket is connected
//  * @returns {boolean}
//  */
// export const isSocketConnected = () => {
//   return socket && socket.connected;
// };

// /**
//  * Get socket ID
//  * @returns {string|null}
//  */
// export const getSocketId = () => {
//   return socket ? socket.id : null;
// };

// /**
//  * Get connection status
//  * @returns {object}
//  */
// export const getConnectionStatus = () => {
//   return {
//     ...connectionStatus,
//     lastActivity: lastActivity ? new Date(lastActivity) : null,
//     uptime: connectionStatus.isConnected && connectionStatus.lastAttempt 
//       ? Date.now() - connectionStatus.lastAttempt 
//       : 0
//   };
// };

// /**
//  * Register connection status callback
//  * @param {function} callback - Callback function (isConnected, error)
//  */
// export const onConnectionStatusChange = (callback) => {
//   if (typeof callback === 'function') {
//     connectionCallbacks.push(callback);
//     // Immediately notify current status
//     callback(connectionStatus.isConnected, connectionStatus.error);
//   }
// };

// /**
//  * Remove connection status callback
//  * @param {function} callback - Callback to remove
//  */
// export const offConnectionStatusChange = (callback) => {
//   const index = connectionCallbacks.indexOf(callback);
//   if (index > -1) connectionCallbacks.splice(index, 1);
// };

// /**
//  * Notify all connection callbacks
//  * @param {boolean} isConnected - Connection status
//  * @param {string} error - Error message if any
//  */
// const notifyConnectionCallbacks = (isConnected, error) => {
//   connectionCallbacks.forEach(callback => {
//     try {
//       callback(isConnected, error);
//     } catch (err) {
//       console.error('Error in connection callback:', err);
//     }
//   });
// };

// /**
//  * Join a chat room with retry
//  * @param {string} chatId - Chat ID
//  * @param {number} retryCount - Number of retries
//  */
// export const joinChatRoom = (chatId, retryCount = 0) => {
//   if (!socket || !socket.connected) {
//     if (retryCount < 3) {
//       console.warn(`Socket not connected, retrying join chat room in 1s (attempt ${retryCount + 1})`);
//       setTimeout(() => joinChatRoom(chatId, retryCount + 1), 1000);
//     } else {
//       console.error('Failed to join chat room after 3 attempts');
//     }
//     return false;
//   }
  
//   socket.emit('join_chat', chatId);
//   console.log(`Joined chat room: ${chatId}`);
//   return true;
// };

// /**
//  * Leave a chat room
//  * @param {string} chatId - Chat ID
//  */
// export const leaveChatRoom = (chatId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('leave_chat', chatId);
//   console.log(`Left chat room: ${chatId}`);
//   return true;
// };

// /**
//  * Send typing indicator with debounce
//  * @param {string} chatId - Chat ID
//  * @param {string} userName - User name
//  * @param {boolean} isTyping - Whether user is typing
//  */
// let typingTimeout = null;
// export const sendTypingIndicator = (chatId, userName, isTyping) => {
//   if (!socket || !socket.connected) return false;
  
//   // Clear previous timeout
//   if (typingTimeout) clearTimeout(typingTimeout);
  
//   const event = isTyping ? 'typing_start' : 'typing_stop';
//   socket.emit(event, { chatId, userName });
  
//   // Auto-stop typing after 3 seconds if not manually stopped
//   if (isTyping) {
//     typingTimeout = setTimeout(() => {
//       socket.emit('typing_stop', { chatId, userName });
//     }, 3000);
//   }
  
//   return true;
// };

// /**
//  * Send message read receipt
//  * @param {string} messageId - Message ID
//  * @param {string} chatId - Chat ID
//  */
// export const sendReadReceipt = (messageId, chatId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('message_read', { messageId, chatId });
//   return true;
// };

// /**
//  * Send message delivered receipt
//  * @param {string} messageId - Message ID
//  * @param {string} chatId - Chat ID
//  */
// export const sendDeliveredReceipt = (messageId, chatId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('message_delivered', { messageId, chatId });
//   return true;
// };

// /**
//  * Join user's personal room
//  * @param {string} userId - User ID
//  */
// export const joinUserRoom = (userId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_user_room', userId);
//   console.log(`Joined user room: ${userId}`);
//   return true;
// };

// /**
//  * Join task room for real-time updates
//  * @param {string} taskId - Task ID
//  */
// export const joinTaskRoom = (taskId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_task_room', taskId);
//   console.log(`Joined task room: ${taskId}`);
//   return true;
// };

// /**
//  * Leave task room
//  * @param {string} taskId - Task ID
//  */
// export const leaveTaskRoom = (taskId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('leave_task_room', taskId);
//   return true;
// };

// /**
//  * Join complaint room for real-time updates
//  * @param {string} complaintId - Complaint ID
//  */
// export const joinComplaintRoom = (complaintId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_complaint_room', complaintId);
//   console.log(`Joined complaint room: ${complaintId}`);
//   return true;
// };

// /**
//  * Join building room for real-time updates
//  * @param {string} buildingId - Building ID
//  */
// export const joinBuildingRoom = (buildingId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_building_room', buildingId);
//   console.log(`Joined building room: ${buildingId}`);
//   return true;
// };

// /**
//  * Send task update
//  * @param {string} taskId - Task ID
//  * @param {object} updateData - Update data
//  */
// export const sendTaskUpdate = (taskId, updateData) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('task_update', { taskId, ...updateData });
//   return true;
// };

// /**
//  * Send complaint update
//  * @param {string} complaintId - Complaint ID
//  * @param {object} updateData - Update data
//  */
// export const sendComplaintUpdate = (complaintId, updateData) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('complaint_update', { complaintId, ...updateData });
//   return true;
// };

// /**
//  * Add event listener for socket events
//  * @param {string} event - Event name
//  * @param {function} callback - Callback function
//  */
// export const onSocketEvent = (event, callback) => {
//   const currentSocket = getSocket();
  
//   if (!eventListeners.has(event)) {
//     eventListeners.set(event, []);
//   }
  
//   eventListeners.get(event).push(callback);
//   currentSocket.on(event, callback);
// };

// /**
//  * Remove event listener
//  * @param {string} event - Event name
//  * @param {function} callback - Callback function (optional)
//  */
// export const offSocketEvent = (event, callback = null) => {
//   const currentSocket = getSocket();
  
//   if (callback) {
//     currentSocket.off(event, callback);
//     const listeners = eventListeners.get(event) || [];
//     const index = listeners.indexOf(callback);
//     if (index > -1) listeners.splice(index, 1);
//   } else {
//     currentSocket.off(event);
//     eventListeners.delete(event);
//   }
// };

// /**
//  * Emit local event (for internal use)
//  * @param {string} event - Event name
//  * @param {object} data - Event data
//  */
// const emitLocalEvent = (event, data) => {
//   const callbacks = eventListeners.get(event) || [];
//   callbacks.forEach(callback => {
//     try {
//       callback(data);
//     } catch (err) {
//       console.error(`Error in local event handler for ${event}:`, err);
//     }
//   });
// };

// /**
//  * Disconnect socket
//  */
// export const disconnectSocket = async () => {
//   if (socket) {
//     // Stop heartbeat
//     stopHeartbeat();
    
//     // Clear any pending reconnection timer
//     if (reconnectTimer) {
//       clearTimeout(reconnectTimer);
//       reconnectTimer = null;
//     }
    
//     // Unregister socket ID
//     await unregisterSocketId();
    
//     // Update user status to offline
//     try {
//       const { userApi } = await import('../api/user.api');
//       await userApi.updateOnlineStatus(false);
//     } catch (error) {
//       console.error('Failed to update offline status:', error);
//     }
    
//     // Disconnect socket
//     socket.disconnect();
//     socket = null;
    
//     // Clear event listeners
//     eventListeners.clear();
//     connectionCallbacks = [];
    
//     // Reset connection status
//     connectionStatus = {
//       isConnected: false,
//       socketId: null,
//       lastAttempt: null,
//       error: null
//     };
    
//     console.log('Socket disconnected and cleaned up');
//     notifyConnectionCallbacks(false, 'Disconnected');
//   }
// };

// /**
//  * Reconnect socket manually
//  */
// export const reconnectSocket = async () => {
//   console.log('Manual reconnect requested');
  
//   if (socket) {
//     await disconnectSocket();
//   }
  
//   reconnectAttempts = 0;
  
//   // Small delay to ensure clean disconnect
//   await new Promise(resolve => setTimeout(resolve, 500));
  
//   return getSocket();
// };

// /**
//  * Get connection status (alias for backward compatibility)
//  */
// export const getSocketStatus = () => {
//   return {
//     isConnected: isSocketConnected(),
//     socketId: getSocketId(),
//     connectionStatus: getConnectionStatus()
//   };
// };

// // Export default object for convenience
// export default {
//   getSocket,
//   disconnectSocket,
//   reconnectSocket,
//   isSocketConnected,
//   getSocketId,
//   getConnectionStatus,
//   getSocketStatus,
//   onConnectionStatusChange,
//   offConnectionStatusChange,
//   joinChatRoom,
//   leaveChatRoom,
//   sendTypingIndicator,
//   sendReadReceipt,
//   sendDeliveredReceipt,
//   joinUserRoom,
//   joinTaskRoom,
//   leaveTaskRoom,
//   joinComplaintRoom,
//   joinBuildingRoom,
//   sendTaskUpdate,
//   sendComplaintUpdate,
//   onSocketEvent,
//   offSocketEvent
// };



// // client/src/utils/socket.js
// import io from 'socket.io-client';

// let socket = null;
// let reconnectAttempts = 0;
// let reconnectTimer = null;
// const MAX_RECONNECT_ATTEMPTS = 5;
// const RECONNECT_DELAY = 2000;
// let eventListeners = new Map();
// let connectionStatus = {
//   isConnected: false,
//   socketId: null,
//   lastAttempt: null,
//   error: null
// };

// // Connection state callbacks
// let connectionCallbacks = [];

// /**
//  * Get the Socket.IO instance
//  * @returns {Object} Socket instance
//  */
// export const getSocket = () => {
//   if (!socket) {
//     const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    
//     // Validate token exists
//     if (!token) {
//       console.warn('No authentication token found, socket connection will fail');
//     }
    
//     // Get API URL - remove /api/v1 if present in the URL
//     let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
//     // Remove trailing slash
//     apiUrl = apiUrl.replace(/\/$/, '');
//     // Remove /api/v1 or /api if present (socket.io should connect to base URL)
//     apiUrl = apiUrl.replace(/\/api(\/v1)?$/, '');
    
//     console.log(`Initializing socket connection to ${apiUrl}`);
    
//     try {
//       socket = io(apiUrl, {
//         auth: { token },
//         transports: ['websocket', 'polling'],
//         reconnection: true,
//         reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
//         reconnectionDelay: 1000,
//         reconnectionDelayMax: 5000,
//         timeout: 20000,
//         autoConnect: true,
//         withCredentials: true,
//         path: '/socket.io', // Ensure correct path
//         forceNew: true // Force new connection
//       });
      
//       // Setup all event handlers
//       setupSocketEventHandlers();
      
//     } catch (error) {
//       console.error('Failed to create socket connection:', error);
//       connectionStatus.error = error.message;
//       notifyConnectionCallbacks(false, error.message);
//     }
//   }
  
//   return socket;
// };

// /**
//  * Setup all socket event handlers
//  */
// const setupSocketEventHandlers = () => {
//   if (!socket) return;
  
//   // Connection successful
//   socket.on('connect', () => {
//     console.log('🔌 Socket connected successfully');
//     reconnectAttempts = 0;
//     connectionStatus.isConnected = true;
//     connectionStatus.socketId = socket.id;
//     connectionStatus.error = null;
//     connectionStatus.lastAttempt = new Date();
    
//     // Register socket ID with backend
//     registerSocketId();
    
//     // Start heartbeat
//     startHeartbeat();
    
//     // Emit connection event for listeners
//     emitLocalEvent('socket_connected', { socketId: socket.id });
//     notifyConnectionCallbacks(true, null);
//   });
  
//   // Disconnect
//   socket.on('disconnect', (reason) => {
//     console.log('🔌 Socket disconnected:', reason);
//     connectionStatus.isConnected = false;
//     connectionStatus.socketId = null;
    
//     // Stop heartbeat
//     stopHeartbeat();
    
//     // Emit disconnect event
//     emitLocalEvent('socket_disconnected', { reason });
//     notifyConnectionCallbacks(false, reason);
    
//     // Handle specific disconnect reasons
//     if (reason === 'io server disconnect') {
//       // Server disconnected, attempt to reconnect
//       console.log('Server disconnected, attempting to reconnect...');
//       setTimeout(() => {
//         if (socket) socket.connect();
//       }, RECONNECT_DELAY);
//     }
//   });
  
//   // Connection error
//   socket.on('connect_error', (error) => {
//     console.error('Socket connection error:', error.message);
//     reconnectAttempts++;
//     connectionStatus.error = error.message;
//     connectionStatus.lastAttempt = new Date();
    
//     emitLocalEvent('socket_error', { error: error.message, attempts: reconnectAttempts });
    
//     // Check for specific error types
//     if (error.message === 'Invalid namespace') {
//       console.error('Invalid namespace error - check socket.io server configuration');
//       connectionStatus.error = 'Socket configuration error. Please check server settings.';
//     } else if (error.message.includes('401') || error.message.includes('authentication')) {
//       console.error('Authentication error - token may be invalid or expired');
//       connectionStatus.error = 'Authentication failed. Please refresh the page.';
//     }
    
//     if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
//       console.error('Max reconnection attempts reached');
//       emitLocalEvent('socket_max_attempts', { attempts: reconnectAttempts });
//       connectionStatus.error = `Failed after ${MAX_RECONNECT_ATTEMPTS} attempts`;
//     }
//   });
  
//   // Reconnection successful
//   socket.on('reconnect', (attemptNumber) => {
//     console.log(`Socket reconnected after ${attemptNumber} attempts`);
//     reconnectAttempts = 0;
//     connectionStatus.isConnected = true;
//     connectionStatus.socketId = socket.id;
//     connectionStatus.error = null;
    
//     registerSocketId();
//     emitLocalEvent('socket_reconnected', { attemptNumber });
//     notifyConnectionCallbacks(true, null);
//   });
  
//   // Reconnection attempt
//   socket.on('reconnect_attempt', (attemptNumber) => {
//     console.log(`Socket reconnection attempt ${attemptNumber}`);
//     emitLocalEvent('socket_reconnect_attempt', { attemptNumber });
    
//     // Refresh token on reconnection attempt
//     const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
//     if (token && socket) {
//       socket.auth = { token };
//     }
//   });
  
//   // Reconnection error
//   socket.on('reconnect_error', (error) => {
//     console.error('Socket reconnection error:', error);
//     emitLocalEvent('socket_reconnect_error', { error: error.message });
//   });
  
//   // Reconnection failed
//   socket.on('reconnect_failed', () => {
//     console.error('Socket reconnection failed');
//     emitLocalEvent('socket_reconnect_failed', {});
//     connectionStatus.error = 'Reconnection failed permanently';
//   });
  
//   // Handle ping/pong for connection health
//   socket.on('ping', () => {
//     updateLastActivity();
//   });
  
//   socket.on('pong', (latency) => {
//     emitLocalEvent('socket_latency', { latency });
//   });
  
//   // Authentication error
//   socket.on('unauthorized', (data) => {
//     console.error('Socket unauthorized:', data);
//     emitLocalEvent('socket_unauthorized', data);
    
//     // Check if token expired
//     if (data.message?.includes('token')) {
//       console.warn('Token may be expired, consider refreshing');
//       connectionStatus.error = 'Session expired. Please refresh the page.';
//     }
//   });
// };

// /**
//  * Register socket ID with backend
//  */
// const registerSocketId = async () => {
//   if (!socket || !socket.id) return;
  
//   try {
//     const { userApi } = await import('../api/user.api');
//     await userApi.registerSocketId(socket.id);
//     console.log('Socket ID registered with backend:', socket.id);
//   } catch (error) {
//     console.error('Failed to register socket ID:', error);
//     // Don't retry immediately, will retry on next heartbeat
//   }
// };

// /**
//  * Unregister socket ID from backend
//  */
// const unregisterSocketId = async () => {
//   if (!socket) return;
  
//   try {
//     const { userApi } = await import('../api/user.api');
//     await userApi.unregisterSocketId();
//     console.log('Socket ID unregistered from backend');
//   } catch (error) {
//     console.error('Failed to unregister socket ID:', error);
//   }
// };

// // Heartbeat interval
// let heartbeatInterval = null;
// let heartbeatMisses = 0;
// const MAX_HEARTBEAT_MISSES = 3;

// /**
//  * Start heartbeat to keep connection alive
//  */
// const startHeartbeat = () => {
//   if (heartbeatInterval) clearInterval(heartbeatInterval);
//   heartbeatMisses = 0;
  
//   heartbeatInterval = setInterval(async () => {
//     if (socket && socket.connected) {
//       try {
//         const { userApi } = await import('../api/user.api');
//         await userApi.updateHeartbeat();
        
//         // Send ping to server with timeout
//         let pingTimeout;
//         const pingPromise = new Promise((resolve, reject) => {
//           pingTimeout = setTimeout(() => reject(new Error('Ping timeout')), 5000);
          
//           socket.emit('ping', (response) => {
//             clearTimeout(pingTimeout);
//             if (response && response.pong) {
//               heartbeatMisses = 0;
//               resolve(response);
//             } else {
//               reject(new Error('Invalid ping response'));
//             }
//           });
//         });
        
//         await pingPromise;
        
//       } catch (error) {
//         console.error('Heartbeat failed:', error);
//         heartbeatMisses++;
        
//         if (heartbeatMisses >= MAX_HEARTBEAT_MISSES) {
//           console.warn('Multiple heartbeat failures, reconnecting...');
//           if (socket) socket.connect();
//           heartbeatMisses = 0;
//         }
//       }
//     }
//   }, 30000); // Every 30 seconds
// };

// /**
//  * Stop heartbeat
//  */
// const stopHeartbeat = () => {
//   if (heartbeatInterval) {
//     clearInterval(heartbeatInterval);
//     heartbeatInterval = null;
//     heartbeatMisses = 0;
//   }
// };

// // Last activity tracking
// let lastActivity = Date.now();

// /**
//  * Update last activity timestamp
//  */
// const updateLastActivity = () => {
//   lastActivity = Date.now();
// };

// /**
//  * Check if socket is connected
//  * @returns {boolean}
//  */
// export const isSocketConnected = () => {
//   return socket && socket.connected;
// };

// /**
//  * Get socket ID
//  * @returns {string|null}
//  */
// export const getSocketId = () => {
//   return socket ? socket.id : null;
// };

// /**
//  * Get connection status
//  * @returns {object}
//  */
// export const getConnectionStatus = () => {
//   return {
//     ...connectionStatus,
//     lastActivity: lastActivity ? new Date(lastActivity) : null,
//     uptime: connectionStatus.isConnected && connectionStatus.lastAttempt 
//       ? Date.now() - connectionStatus.lastAttempt 
//       : 0
//   };
// };

// /**
//  * Register connection status callback
//  * @param {function} callback - Callback function (isConnected, error)
//  */
// export const onConnectionStatusChange = (callback) => {
//   if (typeof callback === 'function') {
//     connectionCallbacks.push(callback);
//     // Immediately notify current status
//     callback(connectionStatus.isConnected, connectionStatus.error);
//   }
// };

// /**
//  * Remove connection status callback
//  * @param {function} callback - Callback to remove
//  */
// export const offConnectionStatusChange = (callback) => {
//   const index = connectionCallbacks.indexOf(callback);
//   if (index > -1) connectionCallbacks.splice(index, 1);
// };

// /**
//  * Notify all connection callbacks
//  * @param {boolean} isConnected - Connection status
//  * @param {string} error - Error message if any
//  */
// const notifyConnectionCallbacks = (isConnected, error) => {
//   connectionCallbacks.forEach(callback => {
//     try {
//       callback(isConnected, error);
//     } catch (err) {
//       console.error('Error in connection callback:', err);
//     }
//   });
// };

// /**
//  * Join a chat room with retry
//  * @param {string} chatId - Chat ID
//  * @param {number} retryCount - Number of retries
//  */
// export const joinChatRoom = (chatId, retryCount = 0) => {
//   if (!socket || !socket.connected) {
//     if (retryCount < 3) {
//       console.warn(`Socket not connected, retrying join chat room in 1s (attempt ${retryCount + 1})`);
//       setTimeout(() => joinChatRoom(chatId, retryCount + 1), 1000);
//     } else {
//       console.error('Failed to join chat room after 3 attempts');
//     }
//     return false;
//   }
  
//   socket.emit('join_chat', chatId);
//   console.log(`Joined chat room: ${chatId}`);
//   return true;
// };

// /**
//  * Leave a chat room
//  * @param {string} chatId - Chat ID
//  */
// export const leaveChatRoom = (chatId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('leave_chat', chatId);
//   console.log(`Left chat room: ${chatId}`);
//   return true;
// };

// /**
//  * Send typing indicator with debounce
//  * @param {string} chatId - Chat ID
//  * @param {string} userName - User name
//  * @param {boolean} isTyping - Whether user is typing
//  */
// let typingTimeout = null;
// export const sendTypingIndicator = (chatId, userName, isTyping) => {
//   if (!socket || !socket.connected) return false;
  
//   // Clear previous timeout
//   if (typingTimeout) clearTimeout(typingTimeout);
  
//   const event = isTyping ? 'typing_start' : 'typing_stop';
//   socket.emit(event, { chatId, userName });
  
//   // Auto-stop typing after 3 seconds if not manually stopped
//   if (isTyping) {
//     typingTimeout = setTimeout(() => {
//       socket.emit('typing_stop', { chatId, userName });
//     }, 3000);
//   }
  
//   return true;
// };

// /**
//  * Send message read receipt
//  * @param {string} messageId - Message ID
//  * @param {string} chatId - Chat ID
//  */
// export const sendReadReceipt = (messageId, chatId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('message_read', { messageId, chatId });
//   return true;
// };

// /**
//  * Send message delivered receipt
//  * @param {string} messageId - Message ID
//  * @param {string} chatId - Chat ID
//  */
// export const sendDeliveredReceipt = (messageId, chatId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('message_delivered', { messageId, chatId });
//   return true;
// };

// /**
//  * Join user's personal room
//  * @param {string} userId - User ID
//  */
// export const joinUserRoom = (userId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_user_room', userId);
//   console.log(`Joined user room: ${userId}`);
//   return true;
// };

// /**
//  * Join task room for real-time updates
//  * @param {string} taskId - Task ID
//  */
// export const joinTaskRoom = (taskId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_task_room', taskId);
//   console.log(`Joined task room: ${taskId}`);
//   return true;
// };

// /**
//  * Leave task room
//  * @param {string} taskId - Task ID
//  */
// export const leaveTaskRoom = (taskId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('leave_task_room', taskId);
//   return true;
// };

// /**
//  * Join complaint room for real-time updates
//  * @param {string} complaintId - Complaint ID
//  */
// export const joinComplaintRoom = (complaintId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_complaint_room', complaintId);
//   console.log(`Joined complaint room: ${complaintId}`);
//   return true;
// };

// /**
//  * Join building room for real-time updates
//  * @param {string} buildingId - Building ID
//  */
// export const joinBuildingRoom = (buildingId) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('join_building_room', buildingId);
//   console.log(`Joined building room: ${buildingId}`);
//   return true;
// };

// /**
//  * Send task update
//  * @param {string} taskId - Task ID
//  * @param {object} updateData - Update data
//  */
// export const sendTaskUpdate = (taskId, updateData) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('task_update', { taskId, ...updateData });
//   return true;
// };

// /**
//  * Send complaint update
//  * @param {string} complaintId - Complaint ID
//  * @param {object} updateData - Update data
//  */
// export const sendComplaintUpdate = (complaintId, updateData) => {
//   if (!socket || !socket.connected) return false;
  
//   socket.emit('complaint_update', { complaintId, ...updateData });
//   return true;
// };

// /**
//  * Add event listener for socket events
//  * @param {string} event - Event name
//  * @param {function} callback - Callback function
//  */
// export const onSocketEvent = (event, callback) => {
//   const currentSocket = getSocket();
  
//   if (!eventListeners.has(event)) {
//     eventListeners.set(event, []);
//   }
  
//   eventListeners.get(event).push(callback);
//   currentSocket.on(event, callback);
// };

// /**
//  * Remove event listener
//  * @param {string} event - Event name
//  * @param {function} callback - Callback function (optional)
//  */
// export const offSocketEvent = (event, callback = null) => {
//   const currentSocket = getSocket();
  
//   if (callback) {
//     currentSocket.off(event, callback);
//     const listeners = eventListeners.get(event) || [];
//     const index = listeners.indexOf(callback);
//     if (index > -1) listeners.splice(index, 1);
//   } else {
//     currentSocket.off(event);
//     eventListeners.delete(event);
//   }
// };

// /**
//  * Emit local event (for internal use)
//  * @param {string} event - Event name
//  * @param {object} data - Event data
//  */
// const emitLocalEvent = (event, data) => {
//   const callbacks = eventListeners.get(event) || [];
//   callbacks.forEach(callback => {
//     try {
//       callback(data);
//     } catch (err) {
//       console.error(`Error in local event handler for ${event}:`, err);
//     }
//   });
// };

// /**
//  * Disconnect socket
//  */
// export const disconnectSocket = async () => {
//   if (socket) {
//     // Stop heartbeat
//     stopHeartbeat();
    
//     // Clear any pending reconnection timer
//     if (reconnectTimer) {
//       clearTimeout(reconnectTimer);
//       reconnectTimer = null;
//     }
    
//     // Unregister socket ID
//     await unregisterSocketId();
    
//     // Update user status to offline
//     try {
//       const { userApi } = await import('../api/user.api');
//       await userApi.updateOnlineStatus(false);
//     } catch (error) {
//       console.error('Failed to update offline status:', error);
//     }
    
//     // Disconnect socket
//     socket.disconnect();
//     socket = null;
    
//     // Clear event listeners
//     eventListeners.clear();
//     connectionCallbacks = [];
    
//     // Reset connection status
//     connectionStatus = {
//       isConnected: false,
//       socketId: null,
//       lastAttempt: null,
//       error: null
//     };
    
//     console.log('Socket disconnected and cleaned up');
//     notifyConnectionCallbacks(false, 'Disconnected');
//   }
// };

// /**
//  * Reconnect socket manually
//  */
// export const reconnectSocket = async () => {
//   console.log('Manual reconnect requested');
  
//   if (socket) {
//     await disconnectSocket();
//   }
  
//   reconnectAttempts = 0;
  
//   // Small delay to ensure clean disconnect
//   await new Promise(resolve => setTimeout(resolve, 500));
  
//   return getSocket();
// };

// /**
//  * Get connection status (alias for backward compatibility)
//  */
// export const getSocketStatus = () => {
//   return {
//     isConnected: isSocketConnected(),
//     socketId: getSocketId(),
//     connectionStatus: getConnectionStatus()
//   };
// };

// /**
//  * Force refresh socket connection (useful after token refresh)
//  */
// export const refreshSocketConnection = async () => {
//   console.log('Refreshing socket connection...');
//   await disconnectSocket();
//   return getSocket();
// };

// // Export default object for convenience
// export default {
//   getSocket,
//   disconnectSocket,
//   reconnectSocket,
//   refreshSocketConnection,
//   isSocketConnected,
//   getSocketId,
//   getConnectionStatus,
//   getSocketStatus,
//   onConnectionStatusChange,
//   offConnectionStatusChange,
//   joinChatRoom,
//   leaveChatRoom,
//   sendTypingIndicator,
//   sendReadReceipt,
//   sendDeliveredReceipt,
//   joinUserRoom,
//   joinTaskRoom,
//   leaveTaskRoom,
//   joinComplaintRoom,
//   joinBuildingRoom,
//   sendTaskUpdate,
//   sendComplaintUpdate,
//   onSocketEvent,
//   offSocketEvent
// };




// client/src/utils/socket.js
import io from 'socket.io-client';

let socket = null;
let reconnectAttempts = 0;
let reconnectTimer = null;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY = 2000;
let eventListeners = new Map();
let connectionStatus = {
  isConnected: false,
  socketId: null,
  lastAttempt: null,
  error: null
};

// Connection state callbacks
let connectionCallbacks = [];

// Store pending actions to retry after reconnect
let pendingActions = [];

/**
 * Get the Socket.IO instance
 * @returns {Object} Socket instance
 */
export const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    
    // Validate token exists
    if (!token) {
      console.warn('⚠️ No authentication token found, socket connection will fail');
    }
    
    // Get API URL - remove /api/v1 if present in the URL
    let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Remove trailing slash
    apiUrl = apiUrl.replace(/\/$/, '');
    // Remove /api/v1 or /api if present (socket.io should connect to base URL)
    apiUrl = apiUrl.replace(/\/api(\/v1)?$/, '');
    
    console.log(`🔌 Initializing socket connection to ${apiUrl}`);
    console.log(`🔑 Token present: ${!!token}`);
    
    try {
      socket = io(apiUrl, {
        auth: { token },
        transports: ['polling', 'websocket'], // Polling first then upgrade
        reconnection: true,
        reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        autoConnect: true,
        withCredentials: true,
        path: '/socket.io',
        forceNew: true,
        upgrade: true,
        rememberUpgrade: true
      });
      
      // Setup all event handlers
      setupSocketEventHandlers();
      
    } catch (error) {
      console.error('❌ Failed to create socket connection:', error);
      connectionStatus.error = error.message;
      notifyConnectionCallbacks(false, error.message);
    }
  }
  
  return socket;
};

/**
 * Setup all socket event handlers with enhanced debugging
 */
const setupSocketEventHandlers = () => {
  if (!socket) return;
  
  // Connection successful
  socket.on('connect', () => {
    console.log('✅ Socket connected successfully');
    console.log(`📡 Socket ID: ${socket.id}`);
    reconnectAttempts = 0;
    connectionStatus.isConnected = true;
    connectionStatus.socketId = socket.id;
    connectionStatus.error = null;
    connectionStatus.lastAttempt = new Date();
    
    // Register socket ID with backend
    registerSocketId();
    
    // Start heartbeat
    startHeartbeat();
    
    // Process any pending actions
    processPendingActions();
    
    // Emit connection event for listeners
    emitLocalEvent('socket_connected', { socketId: socket.id });
    notifyConnectionCallbacks(true, null);
    
    // Join user's personal room
    const userId = localStorage.getItem('userId');
    if (userId) {
      joinUserRoom(userId);
    }
  });
  
  // Disconnect
  socket.on('disconnect', (reason) => {
    console.log(`🔌 Socket disconnected: ${reason}`);
    connectionStatus.isConnected = false;
    connectionStatus.socketId = null;
    
    // Stop heartbeat
    stopHeartbeat();
    
    // Emit disconnect event
    emitLocalEvent('socket_disconnected', { reason });
    notifyConnectionCallbacks(false, reason);
    
    // Handle specific disconnect reasons
    if (reason === 'io server disconnect') {
      // Server disconnected, attempt to reconnect
      console.log('🔄 Server disconnected, attempting to reconnect...');
      setTimeout(() => {
        if (socket) socket.connect();
      }, RECONNECT_DELAY);
    }
  });
  
  // Connection error
  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
    reconnectAttempts++;
    connectionStatus.error = error.message;
    connectionStatus.lastAttempt = new Date();
    
    emitLocalEvent('socket_error', { error: error.message, attempts: reconnectAttempts });
    
    // Check for specific error types
    if (error.message === 'Invalid namespace') {
      console.error('⚠️ Invalid namespace error - check socket.io server configuration');
      connectionStatus.error = 'Socket configuration error. Please check server settings.';
    } else if (error.message.includes('401') || error.message.includes('authentication')) {
      console.error('⚠️ Authentication error - token may be invalid or expired');
      connectionStatus.error = 'Authentication failed. Please refresh the page.';
    }
    
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('❌ Max reconnection attempts reached');
      emitLocalEvent('socket_max_attempts', { attempts: reconnectAttempts });
      connectionStatus.error = `Failed after ${MAX_RECONNECT_ATTEMPTS} attempts`;
    }
  });
  
  // Reconnection successful
  socket.on('reconnect', (attemptNumber) => {
    console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
    reconnectAttempts = 0;
    connectionStatus.isConnected = true;
    connectionStatus.socketId = socket.id;
    connectionStatus.error = null;
    
    registerSocketId();
    emitLocalEvent('socket_reconnected', { attemptNumber });
    notifyConnectionCallbacks(true, null);
    
    // Re-join user's room
    const userId = localStorage.getItem('userId');
    if (userId) {
      joinUserRoom(userId);
    }
  });
  
  // Reconnection attempt
  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log(`🔄 Socket reconnection attempt ${attemptNumber}`);
    emitLocalEvent('socket_reconnect_attempt', { attemptNumber });
    
    // Refresh token on reconnection attempt
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token && socket) {
      socket.auth = { token };
      console.log('🔄 Refreshed auth token for reconnection');
    }
  });
  
  // Reconnection error
  socket.on('reconnect_error', (error) => {
    console.error('❌ Socket reconnection error:', error);
    emitLocalEvent('socket_reconnect_error', { error: error.message });
  });
  
  // Reconnection failed
  socket.on('reconnect_failed', () => {
    console.error('❌ Socket reconnection failed');
    emitLocalEvent('socket_reconnect_failed', {});
    connectionStatus.error = 'Reconnection failed permanently';
  });
  
  // Handle ping/pong for connection health
  socket.on('ping', () => {
    updateLastActivity();
  });
  
  socket.on('pong', (latency) => {
    console.log(`📡 Socket latency: ${latency}ms`);
    emitLocalEvent('socket_latency', { latency });
  });
  
  // Authentication error
  socket.on('unauthorized', (data) => {
    console.error('❌ Socket unauthorized:', data);
    emitLocalEvent('socket_unauthorized', data);
    
    // Check if token expired
    if (data.message?.includes('token')) {
      console.warn('⚠️ Token may be expired, consider refreshing');
      connectionStatus.error = 'Session expired. Please refresh the page.';
    }
  });
};

/**
 * Process pending actions after reconnection
 */
const processPendingActions = () => {
  if (pendingActions.length > 0) {
    console.log(`📦 Processing ${pendingActions.length} pending actions`);
    pendingActions.forEach(action => {
      if (action.type === 'join_chat' && socket) {
        socket.emit('join_chat', action.chatId);
        console.log(`🔄 Re-joined chat room: ${action.chatId}`);
      }
    });
    pendingActions = [];
  }
};

/**
 * Add pending action to retry after reconnect
 */
const addPendingAction = (action) => {
  pendingActions.push(action);
  console.log(`📝 Added pending action: ${action.type}`);
};

/**
 * Register socket ID with backend
 */
const registerSocketId = async () => {
  if (!socket || !socket.id) return;
  
  try {
    const { userApi } = await import('../api/user.api');
    await userApi.registerSocketId(socket.id);
    console.log('✅ Socket ID registered with backend:', socket.id);
  } catch (error) {
    console.error('❌ Failed to register socket ID:', error);
  }
};

/**
 * Unregister socket ID from backend
 */
const unregisterSocketId = async () => {
  if (!socket) return;
  
  try {
    const { userApi } = await import('../api/user.api');
    await userApi.unregisterSocketId();
    console.log('✅ Socket ID unregistered from backend');
  } catch (error) {
    console.error('❌ Failed to unregister socket ID:', error);
  }
};

// Heartbeat interval
let heartbeatInterval = null;
let heartbeatMisses = 0;
const MAX_HEARTBEAT_MISSES = 3;

/**
 * Start heartbeat to keep connection alive
 */
const startHeartbeat = () => {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatMisses = 0;
  
  heartbeatInterval = setInterval(async () => {
    if (socket && socket.connected) {
      try {
        const { userApi } = await import('../api/user.api');
        await userApi.updateHeartbeat();
        
        // Send ping to server with timeout
        let pingTimeout;
        const pingPromise = new Promise((resolve, reject) => {
          pingTimeout = setTimeout(() => reject(new Error('Ping timeout')), 5000);
          
          socket.emit('ping', (response) => {
            clearTimeout(pingTimeout);
            if (response && response.pong) {
              heartbeatMisses = 0;
              resolve(response);
            } else {
              reject(new Error('Invalid ping response'));
            }
          });
        });
        
        await pingPromise;
        
      } catch (error) {
        console.error('❤️ Heartbeat failed:', error);
        heartbeatMisses++;
        
        if (heartbeatMisses >= MAX_HEARTBEAT_MISSES) {
          console.warn('⚠️ Multiple heartbeat failures, reconnecting...');
          if (socket) socket.connect();
          heartbeatMisses = 0;
        }
      }
    }
  }, 30000); // Every 30 seconds
};

/**
 * Stop heartbeat
 */
const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
    heartbeatMisses = 0;
  }
};

// Last activity tracking
let lastActivity = Date.now();

/**
 * Update last activity timestamp
 */
const updateLastActivity = () => {
  lastActivity = Date.now();
};

/**
 * Check if socket is connected
 * @returns {boolean}
 */
export const isSocketConnected = () => {
  return socket && socket.connected;
};

/**
 * Get socket ID
 * @returns {string|null}
 */
export const getSocketId = () => {
  return socket ? socket.id : null;
};

/**
 * Get connection status
 * @returns {object}
 */
export const getConnectionStatus = () => {
  return {
    ...connectionStatus,
    lastActivity: lastActivity ? new Date(lastActivity) : null,
    uptime: connectionStatus.isConnected && connectionStatus.lastAttempt 
      ? Date.now() - connectionStatus.lastAttempt 
      : 0
  };
};

/**
 * Register connection status callback
 * @param {function} callback - Callback function (isConnected, error)
 */
export const onConnectionStatusChange = (callback) => {
  if (typeof callback === 'function') {
    connectionCallbacks.push(callback);
    // Immediately notify current status
    callback(connectionStatus.isConnected, connectionStatus.error);
  }
};

/**
 * Remove connection status callback
 * @param {function} callback - Callback to remove
 */
export const offConnectionStatusChange = (callback) => {
  const index = connectionCallbacks.indexOf(callback);
  if (index > -1) connectionCallbacks.splice(index, 1);
};

/**
 * Notify all connection callbacks
 * @param {boolean} isConnected - Connection status
 * @param {string} error - Error message if any
 */
const notifyConnectionCallbacks = (isConnected, error) => {
  connectionCallbacks.forEach(callback => {
    try {
      callback(isConnected, error);
    } catch (err) {
      console.error('Error in connection callback:', err);
    }
  });
};

/**
 * Join a chat room with retry and persistence
 * @param {string} chatId - Chat ID
 * @param {number} retryCount - Number of retries
 */
export const joinChatRoom = (chatId, retryCount = 0) => {
  if (!socket || !socket.connected) {
    console.warn(`⚠️ Socket not connected, cannot join chat room ${chatId}`);
    if (retryCount < 5) {
      console.log(`🔄 Will retry joining chat room in 2s (attempt ${retryCount + 1})`);
      setTimeout(() => joinChatRoom(chatId, retryCount + 1), 2000);
      // Add to pending actions
      addPendingAction({ type: 'join_chat', chatId });
    } else {
      console.error(`❌ Failed to join chat room ${chatId} after 5 attempts`);
    }
    return false;
  }
  
  socket.emit('join_chat', chatId);
  console.log(`✅ Joined chat room: ${chatId}`);
  return true;
};

/**
 * Leave a chat room
 * @param {string} chatId - Chat ID
 */
export const leaveChatRoom = (chatId) => {
  if (!socket || !socket.connected) return false;
  
  socket.emit('leave_chat', chatId);
  console.log(`👋 Left chat room: ${chatId}`);
  return true;
};

/**
 * Send typing indicator with debounce
 * @param {string} chatId - Chat ID
 * @param {string} userName - User name
 * @param {boolean} isTyping - Whether user is typing
 */
let typingTimeout = null;
export const sendTypingIndicator = (chatId, userName, isTyping) => {
  if (!socket || !socket.connected) {
    console.warn('⚠️ Socket not connected, cannot send typing indicator');
    return false;
  }
  
  // Clear previous timeout
  if (typingTimeout) clearTimeout(typingTimeout);
  
  const event = isTyping ? 'typing_start' : 'typing_stop';
  socket.emit(event, { chatId, userName });
  console.log(`📝 Typing indicator: ${isTyping ? 'started' : 'stopped'} in chat ${chatId}`);
  
  // Auto-stop typing after 3 seconds if not manually stopped
  if (isTyping) {
    typingTimeout = setTimeout(() => {
      socket.emit('typing_stop', { chatId, userName });
    }, 3000);
  }
  
  return true;
};

/**
 * Send message read receipt
 * @param {string} messageId - Message ID
 * @param {string} chatId - Chat ID
 */
export const sendReadReceipt = (messageId, chatId) => {
  if (!socket || !socket.connected) return false;
  
  socket.emit('message_read', { messageId, chatId });
  console.log(`👁️ Read receipt sent for message ${messageId}`);
  return true;
};

/**
 * Send message delivered receipt
 * @param {string} messageId - Message ID
 * @param {string} chatId - Chat ID
 */
export const sendDeliveredReceipt = (messageId, chatId) => {
  if (!socket || !socket.connected) return false;
  
  socket.emit('message_delivered', { messageId, chatId });
  console.log(`📬 Delivered receipt sent for message ${messageId}`);
  return true;
};

/**
 * Join user's personal room
 * @param {string} userId - User ID
 */
export const joinUserRoom = (userId) => {
  if (!socket || !socket.connected) {
    console.warn(`⚠️ Socket not connected, cannot join user room for ${userId}`);
    return false;
  }
  
  socket.emit('join_user_room', userId);
  console.log(`🏠 Joined user room: ${userId}`);
  return true;
};

/**
 * Join task room for real-time updates
 * @param {string} taskId - Task ID
 */
export const joinTaskRoom = (taskId) => {
  if (!socket || !socket.connected) return false;
  
  socket.emit('join_task_room', taskId);
  console.log(`📋 Joined task room: ${taskId}`);
  return true;
};

/**
 * Leave task room
 * @param {string} taskId - Task ID
 */
export const leaveTaskRoom = (taskId) => {
  if (!socket || !socket.connected) return false;
  
  socket.emit('leave_task_room', taskId);
  return true;
};

/**
 * Join complaint room for real-time updates
 * @param {string} complaintId - Complaint ID
 */
export const joinComplaintRoom = (complaintId) => {
  if (!socket || !socket.connected) return false;
  
  socket.emit('join_complaint_room', complaintId);
  console.log(`⚠️ Joined complaint room: ${complaintId}`);
  return true;
};

/**
 * Join building room for real-time updates
 * @param {string} buildingId - Building ID
 */
export const joinBuildingRoom = (buildingId) => {
  if (!socket || !socket.connected) return false;
  
  socket.emit('join_building_room', buildingId);
  console.log(`🏢 Joined building room: ${buildingId}`);
  return true;
};

/**
 * Send task update
 * @param {string} taskId - Task ID
 * @param {object} updateData - Update data
 */
export const sendTaskUpdate = (taskId, updateData) => {
  if (!socket || !socket.connected) return false;
  
  socket.emit('task_update', { taskId, ...updateData });
  return true;
};

/**
 * Send complaint update
 * @param {string} complaintId - Complaint ID
 * @param {object} updateData - Update data
 */
export const sendComplaintUpdate = (complaintId, updateData) => {
  if (!socket || !socket.connected) return false;
  
  socket.emit('complaint_update', { complaintId, ...updateData });
  return true;
};

/**
 * Add event listener for socket events
 * @param {string} event - Event name
 * @param {function} callback - Callback function
 */
export const onSocketEvent = (event, callback) => {
  const currentSocket = getSocket();
  
  if (!eventListeners.has(event)) {
    eventListeners.set(event, []);
  }
  
  eventListeners.get(event).push(callback);
  currentSocket.on(event, callback);
  console.log(`🎧 Added event listener for: ${event}`);
};

/**
 * Remove event listener
 * @param {string} event - Event name
 * @param {function} callback - Callback function (optional)
 */
export const offSocketEvent = (event, callback = null) => {
  const currentSocket = getSocket();
  
  if (callback) {
    currentSocket.off(event, callback);
    const listeners = eventListeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  } else {
    currentSocket.off(event);
    eventListeners.delete(event);
  }
  console.log(`🔇 Removed event listener for: ${event}`);
};

/**
 * Emit local event (for internal use)
 * @param {string} event - Event name
 * @param {object} data - Event data
 */
const emitLocalEvent = (event, data) => {
  const callbacks = eventListeners.get(event) || [];
  callbacks.forEach(callback => {
    try {
      callback(data);
    } catch (err) {
      console.error(`Error in local event handler for ${event}:`, err);
    }
  });
};

/**
 * Disconnect socket
 */
export const disconnectSocket = async () => {
  if (socket) {
    console.log('🔌 Disconnecting socket...');
    // Stop heartbeat
    stopHeartbeat();
    
    // Clear any pending reconnection timer
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    
    // Unregister socket ID
    await unregisterSocketId();
    
    // Update user status to offline
    try {
      const { userApi } = await import('../api/user.api');
      await userApi.updateOnlineStatus(false);
    } catch (error) {
      console.error('Failed to update offline status:', error);
    }
    
    // Disconnect socket
    socket.disconnect();
    socket = null;
    
    // Clear event listeners
    eventListeners.clear();
    connectionCallbacks = [];
    pendingActions = [];
    
    // Reset connection status
    connectionStatus = {
      isConnected: false,
      socketId: null,
      lastAttempt: null,
      error: null
    };
    
    console.log('✅ Socket disconnected and cleaned up');
    notifyConnectionCallbacks(false, 'Disconnected');
  }
};

/**
 * Reconnect socket manually
 */
export const reconnectSocket = async () => {
  console.log('🔄 Manual reconnect requested');
  
  if (socket) {
    await disconnectSocket();
  }
  
  reconnectAttempts = 0;
  pendingActions = [];
  
  // Small delay to ensure clean disconnect
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return getSocket();
};

/**
 * Get connection status (alias for backward compatibility)
 */
export const getSocketStatus = () => {
  return {
    isConnected: isSocketConnected(),
    socketId: getSocketId(),
    connectionStatus: getConnectionStatus()
  };
};

/**
 * Force refresh socket connection (useful after token refresh)
 */
export const refreshSocketConnection = async () => {
  console.log('🔄 Refreshing socket connection...');
  await disconnectSocket();
  return getSocket();
};

// Export default object for convenience
export default {
  getSocket,
  disconnectSocket,
  reconnectSocket,
  refreshSocketConnection,
  isSocketConnected,
  getSocketId,
  getConnectionStatus,
  getSocketStatus,
  onConnectionStatusChange,
  offConnectionStatusChange,
  joinChatRoom,
  leaveChatRoom,
  sendTypingIndicator,
  sendReadReceipt,
  sendDeliveredReceipt,
  joinUserRoom,
  joinTaskRoom,
  leaveTaskRoom,
  joinComplaintRoom,
  joinBuildingRoom,
  sendTaskUpdate,
  sendComplaintUpdate,
  onSocketEvent,
  offSocketEvent
};