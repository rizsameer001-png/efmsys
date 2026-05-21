// const socketIO = require('socket.io');
// const jwt = require('jsonwebtoken');
// const { logger } = require('../utils/logger');

// let io;

// /**
//  * Initialize Socket.IO with the HTTP server
//  * @param {Object} server - HTTP server instance
//  * @returns {Object} Socket.IO instance
//  */
// const initSocket = (server) => {
//   io = socketIO(server, {
//     cors: {
//       origin: process.env.CLIENT_URL || 'http://localhost:3000',
//       methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//       credentials: true,
//       allowedHeaders: ['Content-Type', 'Authorization']
//     },
//     transports: ['websocket', 'polling'],
//     pingTimeout: 60000,
//     pingInterval: 25000,
//   });

//   // Authentication middleware
//   io.use(async (socket, next) => {
//     try {
//       const token = socket.handshake.auth.token;
      
//       if (!token) {
//         return next(new Error('Authentication error: No token provided'));
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       socket.userId = decoded.userId || decoded.id;
//       socket.userRole = decoded.role;
//       socket.userEmail = decoded.email;
      
//       next();
//     } catch (error) {
//       console.error('Socket authentication error:', error.message);
//       next(new Error('Authentication error: Invalid token'));
//     }
//   });

//   // Connection handler
//   io.on('connection', (socket) => {
//     console.log(`🔌 New client connected: ${socket.id} - User: ${socket.userId} (${socket.userRole})`);

//     // Join user-specific room
//     if (socket.userId) {
//       socket.join(`user_${socket.userId}`);
//       console.log(`📱 User ${socket.userId} joined their personal room`);
//     }

//     // Join role-specific room
//     if (socket.userRole) {
//       socket.join(`role_${socket.userRole}`);
//       console.log(`👥 User with role ${socket.userRole} joined role room`);
//     }

//     // Store online users
//     if (!io.onlineUsers) {
//       io.onlineUsers = new Map();
//     }
//     io.onlineUsers.set(socket.userId, {
//       socketId: socket.id,
//       userId: socket.userId,
//       role: socket.userRole,
//       connectedAt: new Date()
//     });

//     // Broadcast user online status
//     io.emit('user_status_change', {
//       userId: socket.userId,
//       status: 'online',
//       role: socket.userRole,
//       timestamp: new Date()
//     });

//     // ==================== EVENT HANDLERS ====================

//     // Join task room
//     socket.on('join_task_room', (taskId) => {
//       socket.join(`task_${taskId}`);
//       console.log(`📋 User ${socket.userId} joined task room: ${taskId}`);
//     });

//     // Leave task room
//     socket.on('leave_task_room', (taskId) => {
//       socket.leave(`task_${taskId}`);
//       console.log(`📋 User ${socket.userId} left task room: ${taskId}`);
//     });

//     // Join complaint room
//     socket.on('join_complaint_room', (complaintId) => {
//       socket.join(`complaint_${complaintId}`);
//       console.log(`💬 User ${socket.userId} joined complaint room: ${complaintId}`);
//     });

//     // Join building room
//     socket.on('join_building_room', (buildingId) => {
//       socket.join(`building_${buildingId}`);
//       console.log(`🏢 User ${socket.userId} joined building room: ${buildingId}`);
//     });

//     // Typing indicator
//     socket.on('typing', (data) => {
//       const { room, isTyping } = data;
//       socket.to(room).emit('user_typing', {
//         userId: socket.userId,
//         userName: socket.userName,
//         isTyping,
//         timestamp: new Date()
//       });
//     });

//     // Task update event (from technician)
//     socket.on('task_update', (data) => {
//       const { taskId, status, progress, notes } = data;
//       io.to(`task_${taskId}`).emit('task_updated', {
//         taskId,
//         status,
//         progress,
//         notes,
//         updatedBy: socket.userId,
//         updatedAt: new Date()
//       });
//     });

//     // Task completion event
//     socket.on('task_completed', (data) => {
//       const { taskId, completedAt, evidence } = data;
//       io.to(`task_${taskId}`).emit('task_completed_event', {
//         taskId,
//         completedAt,
//         evidence,
//         completedBy: socket.userId,
//         timestamp: new Date()
//       });
//     });

//     // Task verification event
//     socket.on('task_verified', (data) => {
//       const { taskId, verified, notes, rating } = data;
//       io.to(`task_${taskId}`).emit('task_verified_event', {
//         taskId,
//         verified,
//         notes,
//         rating,
//         verifiedBy: socket.userId,
//         timestamp: new Date()
//       });
//     });

//     // Notification read event
//     socket.on('notification_read', (notificationId) => {
//       io.to(`user_${socket.userId}`).emit('notification_read_confirmation', {
//         notificationId,
//         readAt: new Date()
//       });
//     });

//     // Disconnect handler
//     socket.on('disconnect', () => {
//       console.log(`🔌 Client disconnected: ${socket.id} - User: ${socket.userId}`);
      
//       if (socket.userId && io.onlineUsers) {
//         io.onlineUsers.delete(socket.userId);
        
//         // Broadcast user offline status
//         io.emit('user_status_change', {
//           userId: socket.userId,
//           status: 'offline',
//           role: socket.userRole,
//           timestamp: new Date()
//         });
//       }
//     });

//     // Error handler
//     socket.on('error', (error) => {
//       console.error(`Socket error for user ${socket.userId}:`, error);
//     });

//     // Ping for connection health check
//     socket.on('ping', (callback) => {
//       if (typeof callback === 'function') {
//         callback({ pong: true, timestamp: new Date() });
//       }
//     });
//   });

//   return io;
// };

// /**
//  * Get Socket.IO instance
//  * @returns {Object} Socket.IO instance
//  */
// const getIO = () => {
//   if (!io) {
//     throw new Error('Socket.io not initialized! Call initSocket first.');
//   }
//   return io;
// };

// /**
//  * Get online users count
//  * @returns {number}
//  */
// const getOnlineUsersCount = () => {
//   return io?.onlineUsers?.size || 0;
// };

// /**
//  * Get online users list
//  * @returns {Array}
//  */
// const getOnlineUsers = () => {
//   if (!io?.onlineUsers) return [];
//   return Array.from(io.onlineUsers.values());
// };

// /**
//  * Check if user is online
//  * @param {string} userId - User ID to check
//  * @returns {boolean}
//  */
// const isUserOnline = (userId) => {
//   return io?.onlineUsers?.has(userId) || false;
// };

// /**
//  * Send notification to specific user
//  * @param {string} userId - User ID
//  * @param {Object} notification - Notification data
//  * @returns {boolean}
//  */
// const sendToUser = (userId, notification) => {
//   if (!io) return false;
//   io.to(`user_${userId}`).emit('notification', notification);
//   return true;
// };

// /**
//  * Send notification to role group
//  * @param {string} role - User role
//  * @param {Object} notification - Notification data
//  * @returns {boolean}
//  */
// const sendToRole = (role, notification) => {
//   if (!io) return false;
//   io.to(`role_${role}`).emit('notification', notification);
//   return true;
// };

// /**
//  * Send notification to building
//  * @param {string} buildingId - Building ID
//  * @param {Object} notification - Notification data
//  * @returns {boolean}
//  */
// const sendToBuilding = (buildingId, notification) => {
//   if (!io) return false;
//   io.to(`building_${buildingId}`).emit('notification', notification);
//   return true;
// };

// /**
//  * Send task update to all task followers
//  * @param {string} taskId - Task ID
//  * @param {Object} update - Update data
//  * @returns {boolean}
//  */
// const sendTaskUpdate = (taskId, update) => {
//   if (!io) return false;
//   io.to(`task_${taskId}`).emit('task_update', update);
//   return true;
// };

// /**
//  * Send complaint update to all complaint followers
//  * @param {string} complaintId - Complaint ID
//  * @param {Object} update - Update data
//  * @returns {boolean}
//  */
// const sendComplaintUpdate = (complaintId, update) => {
//   if (!io) return false;
//   io.to(`complaint_${complaintId}`).emit('complaint_update', update);
//   return true;
// };

// module.exports = {
//   initSocket,
//   getIO,
//   getOnlineUsersCount,
//   getOnlineUsers,
//   isUserOnline,
//   sendToUser,
//   sendToRole,
//   sendToBuilding,
//   sendTaskUpdate,
//   sendComplaintUpdate
// };





// const socketIO = require('socket.io');
// const jwt = require('jsonwebtoken');
// const { logger } = require('../utils/logger');

// let io;
// let connectedUsers = new Map(); // userId -> { socketId, socket, userInfo }

// /**
//  * Initialize Socket.IO with the HTTP server
//  * @param {Object} server - HTTP server instance
//  * @returns {Object} Socket.IO instance
//  */
// const initSocket = (server) => {
//   io = socketIO(server, {
//     cors: {
//       origin: process.env.CLIENT_URL || 'http://localhost:3000',
//       methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//       credentials: true,
//       allowedHeaders: ['Content-Type', 'Authorization']
//     },
//     transports: ['websocket', 'polling'],
//     pingTimeout: 60000,
//     pingInterval: 25000,
//   });

//   // Authentication middleware
//   io.use(async (socket, next) => {
//     try {
//       const token = socket.handshake.auth.token;
      
//       if (!token) {
//         return next(new Error('Authentication error: No token provided'));
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       socket.userId = decoded.userId || decoded.id;
//       socket.userRole = decoded.role;
//       socket.userEmail = decoded.email;
//       socket.userName = decoded.name || `${decoded.firstName} ${decoded.lastName}`;
      
//       next();
//     } catch (error) {
//       console.error('Socket authentication error:', error.message);
//       next(new Error('Authentication error: Invalid token'));
//     }
//   });

//   // Connection handler
//   io.on('connection', async (socket) => {
//     console.log(`🔌 New client connected: ${socket.id} - User: ${socket.userId} (${socket.userRole})`);

//     // Store user connection info
//     connectedUsers.set(socket.userId, {
//       socketId: socket.id,
//       socket: socket,
//       userId: socket.userId,
//       role: socket.userRole,
//       email: socket.userEmail,
//       name: socket.userName,
//       connectedAt: new Date(),
//       lastActivity: new Date()
//     });

//     // Update user online status in database (if User model is available)
//     try {
//       const User = require('../models/User.model');
//       await User.findByIdAndUpdate(socket.userId, {
//         isOnline: true,
//         lastSeen: new Date(),
//         socketId: socket.id
//       });
//     } catch (error) {
//       console.error('Error updating user online status:', error.message);
//     }

//     // Join user-specific room
//     if (socket.userId) {
//       socket.join(`user_${socket.userId}`);
//       console.log(`📱 User ${socket.userId} joined their personal room`);
//     }

//     // Join role-specific room
//     if (socket.userRole) {
//       socket.join(`role_${socket.userRole}`);
//       console.log(`👥 User with role ${socket.userRole} joined role room`);
//     }

//     // Broadcast user online status to all connected clients
//     io.emit('user_status_change', {
//       userId: socket.userId,
//       userName: socket.userName,
//       userRole: socket.userRole,
//       status: 'online',
//       timestamp: new Date()
//     });

//     // Send current online users list to the newly connected user
//     const onlineUsersList = Array.from(connectedUsers.values())
//       .filter(u => u.userId !== socket.userId)
//       .map(u => ({
//         userId: u.userId,
//         userName: u.name,
//         userRole: u.role,
//         connectedAt: u.connectedAt
//       }));
    
//     socket.emit('online_users', onlineUsersList);

//     // ==================== CHAT EVENT HANDLERS ====================

//     // Join chat room
//     socket.on('join_chat', (chatId) => {
//       socket.join(`chat_${chatId}`);
//       console.log(`💬 User ${socket.userId} joined chat room: ${chatId}`);
      
//       // Notify other users in chat that user joined
//       socket.to(`chat_${chatId}`).emit('user_joined_chat', {
//         userId: socket.userId,
//         userName: socket.userName,
//         chatId: chatId,
//         timestamp: new Date()
//       });
//     });

//     // Leave chat room
//     socket.on('leave_chat', (chatId) => {
//       socket.leave(`chat_${chatId}`);
//       console.log(`💬 User ${socket.userId} left chat room: ${chatId}`);
      
//       // Notify other users in chat that user left
//       socket.to(`chat_${chatId}`).emit('user_left_chat', {
//         userId: socket.userId,
//         userName: socket.userName,
//         chatId: chatId,
//         timestamp: new Date()
//       });
//     });

//     // Send new message
//     socket.on('new_message', (data) => {
//       const { chatId, message } = data;
//       console.log(`💬 New message in chat ${chatId} from user ${socket.userId}`);
      
//       // Broadcast to all users in the chat room
//       io.to(`chat_${chatId}`).emit('new_message', {
//         chatId: chatId,
//         message: message,
//         senderId: socket.userId,
//         senderName: socket.userName,
//         senderRole: socket.userRole,
//         timestamp: new Date()
//       });
//     });

//     // Typing indicator start
//     socket.on('typing_start', (data) => {
//       const { chatId, userName } = data;
//       socket.to(`chat_${chatId}`).emit('user_typing', {
//         userId: socket.userId,
//         userName: userName || socket.userName,
//         chatId: chatId,
//         isTyping: true,
//         timestamp: new Date()
//       });
//     });

//     // Typing indicator stop
//     socket.on('typing_stop', (data) => {
//       const { chatId, userName } = data;
//       socket.to(`chat_${chatId}`).emit('user_typing', {
//         userId: socket.userId,
//         userName: userName || socket.userName,
//         chatId: chatId,
//         isTyping: false,
//         timestamp: new Date()
//       });
//     });

//     // Message read receipt
//     socket.on('message_read', (data) => {
//       const { messageId, chatId } = data;
//       io.to(`chat_${chatId}`).emit('message_read', {
//         messageId: messageId,
//         chatId: chatId,
//         userId: socket.userId,
//         userName: socket.userName,
//         readAt: new Date()
//       });
//     });

//     // Message delivered receipt
//     socket.on('message_delivered', (data) => {
//       const { messageId, chatId } = data;
//       io.to(`chat_${chatId}`).emit('message_delivered', {
//         messageId: messageId,
//         chatId: chatId,
//         userId: socket.userId,
//         deliveredAt: new Date()
//       });
//     });

//     // ==================== TASK EVENT HANDLERS ====================

//     // Join task room
//     socket.on('join_task_room', (taskId) => {
//       socket.join(`task_${taskId}`);
//       console.log(`📋 User ${socket.userId} joined task room: ${taskId}`);
//     });

//     // Leave task room
//     socket.on('leave_task_room', (taskId) => {
//       socket.leave(`task_${taskId}`);
//       console.log(`📋 User ${socket.userId} left task room: ${taskId}`);
//     });

//     // Task update event (from technician)
//     socket.on('task_update', (data) => {
//       const { taskId, status, progress, notes } = data;
//       io.to(`task_${taskId}`).emit('task_updated', {
//         taskId,
//         status,
//         progress,
//         notes,
//         updatedBy: socket.userId,
//         updatedByName: socket.userName,
//         updatedAt: new Date()
//       });
//     });

//     // Task completion event
//     socket.on('task_completed', (data) => {
//       const { taskId, completedAt, evidence } = data;
//       io.to(`task_${taskId}`).emit('task_completed_event', {
//         taskId,
//         completedAt,
//         evidence,
//         completedBy: socket.userId,
//         completedByName: socket.userName,
//         timestamp: new Date()
//       });
//     });

//     // Task verification event
//     socket.on('task_verified', (data) => {
//       const { taskId, verified, notes, rating } = data;
//       io.to(`task_${taskId}`).emit('task_verified_event', {
//         taskId,
//         verified,
//         notes,
//         rating,
//         verifiedBy: socket.userId,
//         verifiedByName: socket.userName,
//         timestamp: new Date()
//       });
//     });

//     // ==================== COMPLAINT EVENT HANDLERS ====================

//     // Join complaint room
//     socket.on('join_complaint_room', (complaintId) => {
//       socket.join(`complaint_${complaintId}`);
//       console.log(`💬 User ${socket.userId} joined complaint room: ${complaintId}`);
//     });

//     // Join building room
//     socket.on('join_building_room', (buildingId) => {
//       socket.join(`building_${buildingId}`);
//       console.log(`🏢 User ${socket.userId} joined building room: ${buildingId}`);
//     });

//     // Complaint update
//     socket.on('complaint_update', (data) => {
//       const { complaintId, status, notes } = data;
//       io.to(`complaint_${complaintId}`).emit('complaint_updated', {
//         complaintId,
//         status,
//         notes,
//         updatedBy: socket.userId,
//         updatedByName: socket.userName,
//         updatedAt: new Date()
//       });
//     });

//     // ==================== NOTIFICATION EVENT HANDLERS ====================

//     // Notification read event
//     socket.on('notification_read', (notificationId) => {
//       io.to(`user_${socket.userId}`).emit('notification_read_confirmation', {
//         notificationId,
//         readAt: new Date()
//       });
//     });

//     // Mark all notifications as read
//     socket.on('mark_all_notifications_read', () => {
//       io.to(`user_${socket.userId}`).emit('all_notifications_read', {
//         userId: socket.userId,
//         markedAt: new Date()
//       });
//     });

//     // ==================== HEALTH CHECK ====================

//     // Ping for connection health check
//     socket.on('ping', (callback) => {
//       // Update last activity
//       const user = connectedUsers.get(socket.userId);
//       if (user) {
//         user.lastActivity = new Date();
//         connectedUsers.set(socket.userId, user);
//       }
      
//       if (typeof callback === 'function') {
//         callback({ pong: true, timestamp: new Date() });
//       }
//     });

//     // ==================== DISCONNECT HANDLER ====================

//     // Disconnect handler
//     socket.on('disconnect', async () => {
//       console.log(`🔌 Client disconnected: ${socket.id} - User: ${socket.userId}`);
      
//       // Remove from connected users map
//       if (socket.userId) {
//         connectedUsers.delete(socket.userId);
        
//         // Update user offline status in database
//         try {
//           const User = require('../models/User.model');
//           await User.findByIdAndUpdate(socket.userId, {
//             isOnline: false,
//             lastSeen: new Date(),
//             socketId: null
//           });
//         } catch (error) {
//           console.error('Error updating user offline status:', error.message);
//         }
        
//         // Broadcast user offline status
//         io.emit('user_status_change', {
//           userId: socket.userId,
//           userName: socket.userName,
//           userRole: socket.userRole,
//           status: 'offline',
//           lastSeen: new Date(),
//           timestamp: new Date()
//         });
//       }
//     });

//     // Error handler
//     socket.on('error', (error) => {
//       console.error(`Socket error for user ${socket.userId}:`, error);
//     });
//   });

//   return io;
// };

// /**
//  * Get Socket.IO instance
//  * @returns {Object} Socket.IO instance
//  */
// const getIO = () => {
//   if (!io) {
//     throw new Error('Socket.io not initialized! Call initSocket first.');
//   }
//   return io;
// };

// /**
//  * Get online users count
//  * @returns {number}
//  */
// const getOnlineUsersCount = () => {
//   return connectedUsers.size;
// };

// /**
//  * Get online users list
//  * @returns {Array}
//  */
// const getOnlineUsers = () => {
//   return Array.from(connectedUsers.values()).map(u => ({
//     userId: u.userId,
//     userName: u.name,
//     userRole: u.role,
//     connectedAt: u.connectedAt,
//     lastActivity: u.lastActivity
//   }));
// };

// /**
//  * Check if user is online
//  * @param {string} userId - User ID to check
//  * @returns {boolean}
//  */
// const isUserOnline = (userId) => {
//   return connectedUsers.has(userId);
// };

// /**
//  * Get user socket ID
//  * @param {string} userId - User ID
//  * @returns {string|null}
//  */
// const getUserSocketId = (userId) => {
//   const user = connectedUsers.get(userId);
//   return user ? user.socketId : null;
// };

// /**
//  * Send notification to specific user
//  * @param {string} userId - User ID
//  * @param {Object} notification - Notification data
//  * @returns {boolean}
//  */
// const sendToUser = (userId, notification) => {
//   if (!io) return false;
//   io.to(`user_${userId}`).emit('notification', notification);
//   return true;
// };

// /**
//  * Send message to specific user
//  * @param {string} userId - User ID
//  * @param {Object} message - Message data
//  * @returns {boolean}
//  */
// const sendMessageToUser = (userId, message) => {
//   if (!io) return false;
//   io.to(`user_${userId}`).emit('direct_message', message);
//   return true;
// };

// /**
//  * Send notification to role group
//  * @param {string} role - User role
//  * @param {Object} notification - Notification data
//  * @returns {boolean}
//  */
// const sendToRole = (role, notification) => {
//   if (!io) return false;
//   io.to(`role_${role}`).emit('notification', notification);
//   return true;
// };

// /**
//  * Send notification to multiple roles
//  * @param {Array} roles - Array of role names
//  * @param {Object} notification - Notification data
//  * @returns {boolean}
//  */
// const sendToRoles = (roles, notification) => {
//   if (!io) return false;
//   roles.forEach(role => {
//     io.to(`role_${role}`).emit('notification', notification);
//   });
//   return true;
// };

// /**
//  * Send notification to building
//  * @param {string} buildingId - Building ID
//  * @param {Object} notification - Notification data
//  * @returns {boolean}
//  */
// const sendToBuilding = (buildingId, notification) => {
//   if (!io) return false;
//   io.to(`building_${buildingId}`).emit('notification', notification);
//   return true;
// };

// /**
//  * Send task update to all task followers
//  * @param {string} taskId - Task ID
//  * @param {Object} update - Update data
//  * @returns {boolean}
//  */
// const sendTaskUpdate = (taskId, update) => {
//   if (!io) return false;
//   io.to(`task_${taskId}`).emit('task_update', update);
//   return true;
// };

// /**
//  * Send complaint update to all complaint followers
//  * @param {string} complaintId - Complaint ID
//  * @param {Object} update - Update data
//  * @returns {boolean}
//  */
// const sendComplaintUpdate = (complaintId, update) => {
//   if (!io) return false;
//   io.to(`complaint_${complaintId}`).emit('complaint_update', update);
//   return true;
// };

// /**
//  * Send message to chat room
//  * @param {string} chatId - Chat ID
//  * @param {Object} message - Message data
//  * @returns {boolean}
//  */
// const sendToChatRoom = (chatId, message) => {
//   if (!io) return false;
//   io.to(`chat_${chatId}`).emit('chat_message', message);
//   return true;
// };

// /**
//  * Broadcast to all connected clients
//  * @param {string} event - Event name
//  * @param {Object} data - Event data
//  * @returns {boolean}
//  */
// const broadcast = (event, data) => {
//   if (!io) return false;
//   io.emit(event, data);
//   return true;
// };

// /**
//  * Get user connection info
//  * @param {string} userId - User ID
//  * @returns {Object|null}
//  */
// const getUserConnectionInfo = (userId) => {
//   return connectedUsers.get(userId) || null;
// };

// /**
//  * Update user activity
//  * @param {string} userId - User ID
//  */
// const updateUserActivity = (userId) => {
//   const user = connectedUsers.get(userId);
//   if (user) {
//     user.lastActivity = new Date();
//     connectedUsers.set(userId, user);
//   }
// };

// module.exports = {
//   initSocket,
//   getIO,
//   getOnlineUsersCount,
//   getOnlineUsers,
//   isUserOnline,
//   getUserSocketId,
//   sendToUser,
//   sendMessageToUser,
//   sendToRole,
//   sendToRoles,
//   sendToBuilding,
//   sendTaskUpdate,
//   sendComplaintUpdate,
//   sendToChatRoom,
//   broadcast,
//   getUserConnectionInfo,
//   updateUserActivity
// };



// server/src/config/socketio.js
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

let io;
let connectedUsers = new Map(); // userId -> { socketId, socket, userInfo }

/**
 * Initialize Socket.IO with the HTTP server
 * @param {Object} server - HTTP server instance
 * @returns {Object} Socket.IO instance
 */
const initSocket = (server) => {
  console.log('🚀 Initializing Socket.IO server...');
  
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    transports: ['polling', 'websocket'], // Polling first, then upgrade to websocket
    pingTimeout: 60000,
    pingInterval: 25000,
    allowEIO3: true,
    path: '/socket.io',
    connectTimeout: 45000,
    maxHttpBufferSize: 1e6
  });

  // Debug: Log all socket events
  io.engine.on('connection_error', (err) => {
    console.error('❌ Socket engine connection error:', err);
  });

  // Authentication middleware with better error handling
  io.use(async (socket, next) => {
    console.log('🔐 Socket authentication attempt...');
    
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        console.error('❌ Socket authentication failed: No token provided');
        return next(new Error('Authentication error: No token provided'));
      }

      console.log(`📝 Token received: ${token.substring(0, 20)}...`);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId || decoded.id;
      socket.userRole = decoded.role;
      socket.userEmail = decoded.email;
      socket.userName = decoded.name || `${decoded.firstName} ${decoded.lastName}`;
      
      console.log(`✅ Socket authenticated: User ${socket.userId} (${socket.userRole})`);
      next();
    } catch (error) {
      console.error('❌ Socket authentication error:', error.message);
      next(new Error(`Authentication error: ${error.message}`));
    }
  });

  // Connection handler with detailed logging
  io.on('connection', async (socket) => {
    const connectionTime = new Date();
    console.log(`\n🔌 [${connectionTime.toISOString()}] New client connected:`);
    console.log(`   Socket ID: ${socket.id}`);
    console.log(`   User ID: ${socket.userId}`);
    console.log(`   User Role: ${socket.userRole}`);
    console.log(`   User Name: ${socket.userName}`);
    console.log(`   Transport: ${socket.conn.transport.name}`);

    // Store user connection info
    connectedUsers.set(socket.userId, {
      socketId: socket.id,
      socket: socket,
      userId: socket.userId,
      role: socket.userRole,
      email: socket.userEmail,
      name: socket.userName,
      connectedAt: connectionTime,
      lastActivity: new Date(),
      ip: socket.handshake.address
    });

    console.log(`📊 Total connected users: ${connectedUsers.size}`);

    // Update user online status in database
    try {
      const User = require('../models/User.model');
      const updatedUser = await User.findByIdAndUpdate(socket.userId, {
        isUserOnline: true,
        lastSeen: new Date(),
        socketId: socket.id
      }, { new: true });
      
      if (updatedUser) {
        console.log(`✅ User ${socket.userId} online status updated in database`);
      } else {
        console.warn(`⚠️ User ${socket.userId} not found in database`);
      }
    } catch (error) {
      console.error('❌ Error updating user online status:', error.message);
    }

    // Join user-specific room
    if (socket.userId) {
      socket.join(`user_${socket.userId}`);
      console.log(`📱 User ${socket.userId} joined personal room: user_${socket.userId}`);
    }

    // Join role-specific room
    if (socket.userRole) {
      socket.join(`role_${socket.userRole}`);
      console.log(`👥 User ${socket.userId} joined role room: role_${socket.userRole}`);
    }

    // Broadcast user online status to all connected clients
    const onlineEvent = {
      userId: socket.userId,
      userName: socket.userName,
      userRole: socket.userRole,
      status: 'online',
      timestamp: new Date()
    };
    io.emit('user_status_change', onlineEvent);
    console.log(`📡 Broadcasted online status for user ${socket.userId}`);

    // Send current online users list to the newly connected user
    const onlineUsersList = Array.from(connectedUsers.values())
      .filter(u => u.userId !== socket.userId)
      .map(u => ({
        userId: u.userId,
        userName: u.name,
        userRole: u.role,
        connectedAt: u.connectedAt,
        lastActivity: u.lastActivity
      }));
    
    socket.emit('online_users', onlineUsersList);
    console.log(`📋 Sent online users list to ${socket.userId} (${onlineUsersList.length} users)`);

    // ==================== CHAT EVENT HANDLERS ====================

    // Join chat room
    socket.on('join_chat', (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`💬 [${new Date().toISOString()}] User ${socket.userId} joined chat room: ${chatId}`);
      
      // Notify other users in chat that user joined
      socket.to(`chat_${chatId}`).emit('user_joined_chat', {
        userId: socket.userId,
        userName: socket.userName,
        chatId: chatId,
        timestamp: new Date()
      });
    });

    // Leave chat room
    socket.on('leave_chat', (chatId) => {
      socket.leave(`chat_${chatId}`);
      console.log(`💬 [${new Date().toISOString()}] User ${socket.userId} left chat room: ${chatId}`);
      
      socket.to(`chat_${chatId}`).emit('user_left_chat', {
        userId: socket.userId,
        userName: socket.userName,
        chatId: chatId,
        timestamp: new Date()
      });
    });

    // Send new message with detailed logging
    socket.on('new_message', (data) => {
      const { chatId, message } = data;
      console.log(`💬 [${new Date().toISOString()}] New message:`);
      console.log(`   Chat ID: ${chatId}`);
      console.log(`   From: ${socket.userId} (${socket.userName})`);
      console.log(`   Message: ${message?.substring(0, 50)}${message?.length > 50 ? '...' : ''}`);
      
      // Broadcast to all users in the chat room
      io.to(`chat_${chatId}`).emit('new_message', {
        chatId: chatId,
        message: message,
        senderId: socket.userId,
        senderName: socket.userName,
        senderRole: socket.userRole,
        timestamp: new Date()
      });
    });

    // Typing indicator start
    socket.on('typing_start', (data) => {
      const { chatId, userName } = data;
      console.log(`⌨️ User ${socket.userId} started typing in chat ${chatId}`);
      socket.to(`chat_${chatId}`).emit('user_typing', {
        userId: socket.userId,
        userName: userName || socket.userName,
        chatId: chatId,
        isTyping: true,
        timestamp: new Date()
      });
    });

    // Typing indicator stop
    socket.on('typing_stop', (data) => {
      const { chatId, userName } = data;
      console.log(`⌨️ User ${socket.userId} stopped typing in chat ${chatId}`);
      socket.to(`chat_${chatId}`).emit('user_typing', {
        userId: socket.userId,
        userName: userName || socket.userName,
        chatId: chatId,
        isTyping: false,
        timestamp: new Date()
      });
    });

    // Message read receipt
    socket.on('message_read', (data) => {
      const { messageId, chatId } = data;
      console.log(`👁️ User ${socket.userId} read message ${messageId} in chat ${chatId}`);
      io.to(`chat_${chatId}`).emit('message_read', {
        messageId: messageId,
        chatId: chatId,
        userId: socket.userId,
        userName: socket.userName,
        readAt: new Date()
      });
    });

    // Message delivered receipt
    socket.on('message_delivered', (data) => {
      const { messageId, chatId } = data;
      console.log(`📬 Message ${messageId} delivered to user ${socket.userId}`);
      io.to(`chat_${chatId}`).emit('message_delivered', {
        messageId: messageId,
        chatId: chatId,
        userId: socket.userId,
        deliveredAt: new Date()
      });
    });

    // ==================== TASK EVENT HANDLERS ====================

    socket.on('join_task_room', (taskId) => {
      socket.join(`task_${taskId}`);
      console.log(`📋 User ${socket.userId} joined task room: ${taskId}`);
    });

    socket.on('leave_task_room', (taskId) => {
      socket.leave(`task_${taskId}`);
      console.log(`📋 User ${socket.userId} left task room: ${taskId}`);
    });

    socket.on('task_update', (data) => {
      const { taskId, status, progress, notes } = data;
      console.log(`📋 Task update: ${taskId} -> ${status} (${progress}%)`);
      io.to(`task_${taskId}`).emit('task_updated', {
        taskId,
        status,
        progress,
        notes,
        updatedBy: socket.userId,
        updatedByName: socket.userName,
        updatedAt: new Date()
      });
    });

    socket.on('task_completed', (data) => {
      const { taskId, completedAt, evidence } = data;
      console.log(`✅ Task completed: ${taskId} by ${socket.userName}`);
      io.to(`task_${taskId}`).emit('task_completed_event', {
        taskId,
        completedAt,
        evidence,
        completedBy: socket.userId,
        completedByName: socket.userName,
        timestamp: new Date()
      });
    });

    socket.on('task_verified', (data) => {
      const { taskId, verified, notes, rating } = data;
      console.log(`🔍 Task verified: ${taskId} -> ${verified ? 'Approved' : 'Rejected'}`);
      io.to(`task_${taskId}`).emit('task_verified_event', {
        taskId,
        verified,
        notes,
        rating,
        verifiedBy: socket.userId,
        verifiedByName: socket.userName,
        timestamp: new Date()
      });
    });

    // ==================== COMPLAINT EVENT HANDLERS ====================

    socket.on('join_complaint_room', (complaintId) => {
      socket.join(`complaint_${complaintId}`);
      console.log(`⚠️ User ${socket.userId} joined complaint room: ${complaintId}`);
    });

    socket.on('join_building_room', (buildingId) => {
      socket.join(`building_${buildingId}`);
      console.log(`🏢 User ${socket.userId} joined building room: ${buildingId}`);
    });

    socket.on('complaint_update', (data) => {
      const { complaintId, status, notes } = data;
      console.log(`⚠️ Complaint update: ${complaintId} -> ${status}`);
      io.to(`complaint_${complaintId}`).emit('complaint_updated', {
        complaintId,
        status,
        notes,
        updatedBy: socket.userId,
        updatedByName: socket.userName,
        updatedAt: new Date()
      });
    });

    // ==================== NOTIFICATION EVENT HANDLERS ====================

    socket.on('notification_read', (notificationId) => {
      console.log(`🔔 User ${socket.userId} read notification ${notificationId}`);
      io.to(`user_${socket.userId}`).emit('notification_read_confirmation', {
        notificationId,
        readAt: new Date()
      });
    });

    socket.on('mark_all_notifications_read', () => {
      console.log(`🔔 User ${socket.userId} marked all notifications as read`);
      io.to(`user_${socket.userId}`).emit('all_notifications_read', {
        userId: socket.userId,
        markedAt: new Date()
      });
    });

    // ==================== HEALTH CHECK ====================

    socket.on('ping', (callback) => {
      const user = connectedUsers.get(socket.userId);
      if (user) {
        user.lastActivity = new Date();
        connectedUsers.set(socket.userId, user);
      }
      
      if (typeof callback === 'function') {
        callback({ pong: true, timestamp: new Date() });
      }
    });

    // Track transport upgrade
    socket.on('upgrade', (transport) => {
      console.log(`🔧 Socket ${socket.id} upgraded to ${transport}`);
    });

    // ==================== DISCONNECT HANDLER ====================

    socket.on('disconnect', async (reason) => {
      const disconnectTime = new Date();
      console.log(`\n🔌 [${disconnectTime.toISOString()}] Client disconnected:`);
      console.log(`   Socket ID: ${socket.id}`);
      console.log(`   User ID: ${socket.userId}`);
      console.log(`   Reason: ${reason}`);
      
      // Remove from connected users map
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        console.log(`📊 Total connected users: ${connectedUsers.size}`);
        
        // Update user offline status in database
        try {
          const User = require('../models/User.model');
          const updatedUser = await User.findByIdAndUpdate(socket.userId, {
            isUserOnline: false,
            lastSeen: new Date(),
            socketId: null
          }, { new: true });
          
          if (updatedUser) {
            console.log(`✅ User ${socket.userId} offline status updated in database`);
          }
        } catch (error) {
          console.error('❌ Error updating user offline status:', error.message);
        }
        
        // Broadcast user offline status
        io.emit('user_status_change', {
          userId: socket.userId,
          userName: socket.userName,
          userRole: socket.userRole,
          status: 'offline',
          lastSeen: new Date(),
          timestamp: new Date()
        });
        console.log(`📡 Broadcasted offline status for user ${socket.userId}`);
      }
    });

    // Error handler
    socket.on('error', (error) => {
      console.error(`❌ Socket error for user ${socket.userId}:`, error);
    });
  });

  // Log server start
  console.log('✅ Socket.IO server initialized successfully');
  console.log(`   Transport: polling + websocket upgrade`);
  console.log(`   Path: /socket.io`);
  
  return io;
};

/**
 * Get Socket.IO instance
 * @returns {Object} Socket.IO instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized! Call initSocket first.');
  }
  return io;
};

/**
 * Get online users count
 * @returns {number}
 */
const getOnlineUsersCount = () => {
  return connectedUsers.size;
};

/**
 * Get online users list
 * @returns {Array}
 */
const getOnlineUsers = () => {
  return Array.from(connectedUsers.values()).map(u => ({
    userId: u.userId,
    userName: u.name,
    userRole: u.role,
    connectedAt: u.connectedAt,
    lastActivity: u.lastActivity
  }));
};

/**
 * Check if user is online
 * @param {string} userId - User ID to check
 * @returns {boolean}
 */
const isUserOnline = (userId) => {
  return connectedUsers.has(userId);
};

/**
 * Get user socket ID
 * @param {string} userId - User ID
 * @returns {string|null}
 */
const getUserSocketId = (userId) => {
  const user = connectedUsers.get(userId);
  return user ? user.socketId : null;
};

/**
 * Send notification to specific user
 * @param {string} userId - User ID
 * @param {Object} notification - Notification data
 * @returns {boolean}
 */
const sendToUser = (userId, notification) => {
  if (!io) return false;
  io.to(`user_${userId}`).emit('notification', notification);
  console.log(`📨 Sent notification to user ${userId}`);
  return true;
};

/**
 * Send message to specific user
 * @param {string} userId - User ID
 * @param {Object} message - Message data
 * @returns {boolean}
 */
const sendMessageToUser = (userId, message) => {
  if (!io) return false;
  io.to(`user_${userId}`).emit('direct_message', message);
  console.log(`💬 Sent direct message to user ${userId}`);
  return true;
};

/**
 * Send notification to role group
 * @param {string} role - User role
 * @param {Object} notification - Notification data
 * @returns {boolean}
 */
const sendToRole = (role, notification) => {
  if (!io) return false;
  io.to(`role_${role}`).emit('notification', notification);
  console.log(`📨 Sent notification to role ${role}`);
  return true;
};

/**
 * Send notification to multiple roles
 * @param {Array} roles - Array of role names
 * @param {Object} notification - Notification data
 * @returns {boolean}
 */
const sendToRoles = (roles, notification) => {
  if (!io) return false;
  roles.forEach(role => {
    io.to(`role_${role}`).emit('notification', notification);
  });
  console.log(`📨 Sent notification to roles: ${roles.join(', ')}`);
  return true;
};

/**
 * Send notification to building
 * @param {string} buildingId - Building ID
 * @param {Object} notification - Notification data
 * @returns {boolean}
 */
const sendToBuilding = (buildingId, notification) => {
  if (!io) return false;
  io.to(`building_${buildingId}`).emit('notification', notification);
  console.log(`🏢 Sent notification to building ${buildingId}`);
  return true;
};

/**
 * Send task update to all task followers
 * @param {string} taskId - Task ID
 * @param {Object} update - Update data
 * @returns {boolean}
 */
const sendTaskUpdate = (taskId, update) => {
  if (!io) return false;
  io.to(`task_${taskId}`).emit('task_update', update);
  console.log(`📋 Sent task update for task ${taskId}`);
  return true;
};

/**
 * Send complaint update to all complaint followers
 * @param {string} complaintId - Complaint ID
 * @param {Object} update - Update data
 * @returns {boolean}
 */
const sendComplaintUpdate = (complaintId, update) => {
  if (!io) return false;
  io.to(`complaint_${complaintId}`).emit('complaint_update', update);
  console.log(`⚠️ Sent complaint update for complaint ${complaintId}`);
  return true;
};

/**
 * Send message to chat room
 * @param {string} chatId - Chat ID
 * @param {Object} message - Message data
 * @returns {boolean}
 */
const sendToChatRoom = (chatId, message) => {
  if (!io) return false;
  io.to(`chat_${chatId}`).emit('chat_message', message);
  console.log(`💬 Sent message to chat room ${chatId}`);
  return true;
};

/**
 * Broadcast to all connected clients
 * @param {string} event - Event name
 * @param {Object} data - Event data
 * @returns {boolean}
 */
const broadcast = (event, data) => {
  if (!io) return false;
  io.emit(event, data);
  console.log(`📡 Broadcasted event ${event} to all clients`);
  return true;
};

/**
 * Get user connection info
 * @param {string} userId - User ID
 * @returns {Object|null}
 */
const getUserConnectionInfo = (userId) => {
  return connectedUsers.get(userId) || null;
};

/**
 * Update user activity
 * @param {string} userId - User ID
 */
const updateUserActivity = (userId) => {
  const user = connectedUsers.get(userId);
  if (user) {
    user.lastActivity = new Date();
    connectedUsers.set(userId, user);
  }
};

// Export all functions
module.exports = {
  initSocket,
  getIO,
  getOnlineUsersCount,
  getOnlineUsers,
  isUserOnline,
  getUserSocketId,
  sendToUser,
  sendMessageToUser,
  sendToRole,
  sendToRoles,
  sendToBuilding,
  sendTaskUpdate,
  sendComplaintUpdate,
  sendToChatRoom,
  broadcast,
  getUserConnectionInfo,
  updateUserActivity
};