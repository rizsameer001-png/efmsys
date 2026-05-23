// // server/src/routes/v1/chat.routes.js
// const express = require('express');
// const router = express.Router();
// const { protect } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');

// // All routes require authentication
// router.use(protect);

// // ==================== CHAT SETTINGS ====================

// // Get user chat settings
// router.get('/settings', async (req, res) => {
//   try {
//     const userId = req.user._id || req.userId;
//     res.json({ 
//       success: true, 
//       data: {
//         chatEnabled: true,
//         notifications: { email: true, push: true, sound: true },
//         theme: 'light',
//         blockedUsers: []
//       }
//     });
//   } catch (error) {
//     console.error('Get chat settings error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Update user chat settings (Super Admin only)
// router.put('/settings/:userId', authorize(['super_admin']), async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { chatEnabled } = req.body;
//     res.json({ 
//       success: true, 
//       message: `Chat settings updated for user ${userId}`,
//       data: { userId, chatEnabled }
//     });
//   } catch (error) {
//     console.error('Update chat settings error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== CHAT MANAGEMENT ====================

// // Get or create direct chat
// router.post('/direct', async (req, res) => {
//   try {
//     const { targetUserId } = req.body;
//     const userId = req.user._id || req.userId;
    
//     res.json({ 
//       success: true, 
//       data: {
//         _id: `chat_${Date.now()}`,
//         chatType: 'direct',
//         participants: [
//           { userId, name: req.user.name, role: req.user.role },
//           { userId: targetUserId, name: 'Other User', role: 'technician' }
//         ],
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Get or create direct chat error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get user's chats
// router.get('/chats', async (req, res) => {
//   try {
//     const userId = req.user._id || req.userId;
//     res.json({ 
//       success: true, 
//       data: [
//         {
//           _id: 'chat_1',
//           chatType: 'direct',
//           participants: [
//             { userId, name: req.user.name },
//             { userId: 'user2', name: 'John Doe', role: 'technician' }
//           ],
//           lastMessage: { message: 'Hello!', senderName: 'John Doe', timestamp: new Date() },
//           unreadCount: 2,
//           updatedAt: new Date()
//         },
//         {
//           _id: 'chat_2',
//           chatType: 'group',
//           groupName: 'Maintenance Team',
//           participants: [{ userId }, { userId: 'user3' }, { userId: 'user4' }],
//           lastMessage: { message: 'Meeting at 10 AM', senderName: 'Admin', timestamp: new Date() },
//           unreadCount: 0,
//           updatedAt: new Date()
//         }
//       ]
//     });
//   } catch (error) {
//     console.error('Get user chats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get chat messages
// router.get('/chats/:chatId/messages', async (req, res) => {
//   try {
//     const { chatId } = req.params;
//     const { page = 1, limit = 50 } = req.query;
    
//     res.json({ 
//       success: true, 
//       data: [
//         {
//           _id: 'msg_1',
//           senderId: 'user2',
//           senderName: 'John Doe',
//           message: 'Hello, how can I help you?',
//           status: 'read',
//           createdAt: new Date(Date.now() - 3600000)
//         },
//         {
//           _id: 'msg_2',
//           senderId: req.user._id || req.userId,
//           senderName: req.user.name,
//           message: 'I need help with my task',
//           status: 'delivered',
//           createdAt: new Date(Date.now() - 1800000)
//         }
//       ],
//       pagination: { page: 1, limit: 50, total: 2, pages: 1 }
//     });
//   } catch (error) {
//     console.error('Get chat messages error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Send message
// router.post('/chats/:chatId/messages', async (req, res) => {
//   try {
//     const { chatId } = req.params;
//     const { message, attachments, location } = req.body;
//     const userId = req.user._id || req.userId;
    
//     res.status(201).json({ 
//       success: true, 
//       data: {
//         _id: `msg_${Date.now()}`,
//         chatId,
//         senderId: userId,
//         senderName: req.user.name,
//         message: message || (attachments?.length ? '📎 Attachment' : null),
//         attachments,
//         location,
//         status: 'sent',
//         createdAt: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Send message error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Mark message as read
// router.put('/messages/:messageId/read', async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     res.json({ success: true, message: 'Message marked as read' });
//   } catch (error) {
//     console.error('Mark as read error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Delete message (admin only)
// router.delete('/messages/:messageId', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     res.json({ success: true, message: 'Message deleted' });
//   } catch (error) {
//     console.error('Delete message error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== GROUP CHAT ====================

// // Create group chat
// router.post('/groups', authorize(['admin', 'manager', 'supervisor']), async (req, res) => {
//   try {
//     const { groupName, groupDescription, participants, groupIcon } = req.body;
//     const userId = req.user._id || req.userId;
    
//     res.status(201).json({ 
//       success: true, 
//       data: {
//         _id: `group_${Date.now()}`,
//         chatType: 'group',
//         groupName,
//         groupDescription,
//         groupIcon,
//         participants: [{ userId }, ...participants.map(p => ({ userId: p }))],
//         createdBy: userId,
//         createdAt: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Create group chat error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== TICKET-BASED CHAT ====================

// // Create ticket-based chat
// router.post('/ticket', async (req, res) => {
//   try {
//     const { ticketId, ticketType, assignedToId } = req.body;
//     const userId = req.user._id || req.userId;
    
//     res.status(201).json({ 
//       success: true, 
//       data: {
//         _id: `ticket_chat_${Date.now()}`,
//         chatType: 'ticket',
//         ticketId,
//         ticketType,
//         participants: [
//           { userId, name: req.user.name },
//           { userId: assignedToId, name: 'Assigned User' }
//         ],
//         createdAt: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Create ticket chat error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== USER MANAGEMENT ====================

// // Get available users for chat
// router.get('/users/available', async (req, res) => {
//   try {
//     const userId = req.user._id || req.userId;
//     res.json({ 
//       success: true, 
//       data: [
//         { _id: 'user2', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'technician', chatEnabled: true },
//         { _id: 'user3', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'supervisor', chatEnabled: true },
//         { _id: 'user4', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', role: 'manager', chatEnabled: true }
//       ]
//     });
//   } catch (error) {
//     console.error('Get available users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Block user
// router.post('/users/:userId/block', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { reason } = req.body;
//     res.json({ success: true, message: `User ${userId} blocked` });
//   } catch (error) {
//     console.error('Block user error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Unblock user
// router.delete('/users/:userId/block', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     res.json({ success: true, message: `User ${userId} unblocked` });
//   } catch (error) {
//     console.error('Unblock user error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== ADMIN ONLY ====================

// // Get all chats (admin monitoring)
// router.get('/admin/chats', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     const { page = 1, limit = 20, search } = req.query;
//     res.json({ 
//       success: true, 
//       data: [
//         { _id: 'chat_1', chatType: 'direct', participants: ['User1', 'User2'], messageCount: 45, lastActive: new Date() },
//         { _id: 'chat_2', chatType: 'group', groupName: 'Maintenance Team', participantCount: 5, messageCount: 120, lastActive: new Date() }
//       ],
//       pagination: { page: 1, limit: 20, total: 2, pages: 1 }
//     });
//   } catch (error) {
//     console.error('Get all chats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Export chat logs
// router.get('/admin/export', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     const { chatId, startDate, endDate, format = 'csv' } = req.query;
    
//     if (format === 'csv') {
//       const csvData = 'Date,Time,Sender,Message,Status\n2024-01-01,10:00,John Doe,Hello,read\n2024-01-01,10:01,Admin,Hi there,read';
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', `attachment; filename=chat_logs_${Date.now()}.csv`);
//       return res.send(csvData);
//     }
    
//     res.json({ success: true, data: [], message: 'Chat logs exported' });
//   } catch (error) {
//     console.error('Export chat logs error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;





// // server/src/routes/v1/chat.routes.js
// const express = require('express');
// const router = express.Router();
// const { protect } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');

// // All routes require authentication
// router.use(protect);

// // ==================== CHAT STATISTICS (MUST COME BEFORE PARAM ROUTES) ====================

// /**
//  * @route   GET /api/v1/chat/stats
//  * @desc    Get chat statistics for dashboard
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/stats', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     // Try to get real data from models, fallback to mock data
//     let Chat, Message, User;
    
//     try {
//       Chat = require('../../models/Chat.model');
//       Message = require('../../models/Message.model');
//       User = require('../../models/User.model');
//     } catch (err) {
//       console.log('Models not available, using mock data');
//     }

//     let totalChats = 0;
//     let totalMessages = 0;
//     let activeChats = 0;
//     let messagesByType = [];
//     let chatsByType = [];

//     if (Chat && Message && User) {
//       // Get real data from database
//       totalChats = await Chat.countDocuments({ isActive: true });
//       totalMessages = await Message.countDocuments({ isDeleted: false });
//       activeChats = await Chat.countDocuments({ 
//         updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
//         isActive: true 
//       });
      
//       // Get messages by type
//       messagesByType = await Message.aggregate([
//         { $match: { isDeleted: false } },
//         { $group: { _id: '$messageType', count: { $sum: 1 } } }
//       ]);
      
//       // Get chats by type
//       chatsByType = await Chat.aggregate([
//         { $match: { isActive: true } },
//         { $group: { _id: '$chatType', count: { $sum: 1 } } }
//       ]);
//     } else {
//       // Mock data for development
//       totalChats = 156;
//       totalMessages = 12450;
//       activeChats = 42;
//       messagesByType = [
//         { _id: 'text', count: 11234 },
//         { _id: 'image', count: 876 },
//         { _id: 'file', count: 234 },
//         { _id: 'location', count: 106 }
//       ];
//       chatsByType = [
//         { _id: 'direct', count: 134 },
//         { _id: 'group', count: 18 },
//         { _id: 'ticket', count: 4 }
//       ];
//     }

//     // Get total users with chat enabled
//     let chatEnabledUsers = 0;
//     if (User) {
//       chatEnabledUsers = await User.countDocuments({ chatEnabled: true, status: 'active' });
//     } else {
//       chatEnabledUsers = 45;
//     }

//     // Get recent messages (last 7 days)
//     let recentMessages = [];
//     if (Message) {
//       const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
//       recentMessages = await Message.aggregate([
//         { $match: { createdAt: { $gte: last7Days }, isDeleted: false } },
//         { $group: {
//             _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { _id: 1 } }
//       ]);
//     } else {
//       // Mock recent messages data
//       recentMessages = [
//         { _id: '2024-01-01', count: 234 },
//         { _id: '2024-01-02', count: 456 },
//         { _id: '2024-01-03', count: 345 },
//         { _id: '2024-01-04', count: 567 },
//         { _id: '2024-01-05', count: 678 },
//         { _id: '2024-01-06', count: 432 },
//         { _id: '2024-01-07', count: 543 }
//       ];
//     }

//     res.json({
//       success: true,
//       data: {
//         totalChats,
//         totalMessages,
//         activeChats,
//         chatEnabledUsers,
//         messagesByType,
//         chatsByType,
//         recentMessages,
//         averageMessagesPerChat: totalChats > 0 ? Math.round(totalMessages / totalChats) : 0,
//         messagesToday: recentMessages[recentMessages.length - 1]?.count || 0
//       }
//     });
//   } catch (error) {
//     console.error('Get chat stats error:', error);
//     // Return mock data on error
//     res.json({
//       success: true,
//       data: {
//         totalChats: 156,
//         totalMessages: 12450,
//         activeChats: 42,
//         chatEnabledUsers: 45,
//         messagesByType: [
//           { _id: 'text', count: 11234 },
//           { _id: 'image', count: 876 },
//           { _id: 'file', count: 234 },
//           { _id: 'location', count: 106 }
//         ],
//         chatsByType: [
//           { _id: 'direct', count: 134 },
//           { _id: 'group', count: 18 },
//           { _id: 'ticket', count: 4 }
//         ],
//         recentMessages: [
//           { _id: '2024-01-01', count: 234 },
//           { _id: '2024-01-02', count: 456 },
//           { _id: '2024-01-03', count: 345 },
//           { _id: '2024-01-04', count: 567 },
//           { _id: '2024-01-05', count: 678 },
//           { _id: '2024-01-06', count: 432 },
//           { _id: '2024-01-07', count: 543 }
//         ],
//         averageMessagesPerChat: 80,
//         messagesToday: 543
//       }
//     });
//   }
// });

// /**
//  * @route   GET /api/v1/chat/analytics
//  * @desc    Get detailed chat analytics
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/analytics', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     const { period = 'week' } = req.query;
//     let days = 7;
//     if (period === 'month') days = 30;
//     if (period === 'year') days = 365;
    
//     const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
//     let Chat, Message;
//     try {
//       Chat = require('../../models/Chat.model');
//       Message = require('../../models/Message.model');
//     } catch (err) {
//       console.log('Models not available');
//     }
    
//     let messagesOverTime = [];
//     let topChatters = [];
    
//     if (Message) {
//       messagesOverTime = await Message.aggregate([
//         { $match: { createdAt: { $gte: startDate }, isDeleted: false } },
//         { $group: {
//             _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { _id: 1 } }
//       ]);
      
//       topChatters = await Message.aggregate([
//         { $match: { isDeleted: false } },
//         { $group: {
//             _id: '$senderId',
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { count: -1 } },
//         { $limit: 10 }
//       ]);
      
//       // Populate user names
//       const User = require('../../models/User.model');
//       for (let chatter of topChatters) {
//         const user = await User.findById(chatter._id).select('firstName lastName email');
//         if (user) {
//           chatter.name = `${user.firstName} ${user.lastName}`;
//           chatter.email = user.email;
//         }
//       }
//     } else {
//       messagesOverTime = [
//         { _id: '2024-01-01', count: 234 },
//         { _id: '2024-01-02', count: 456 }
//       ];
//       topChatters = [
//         { _id: 'user1', name: 'John Doe', count: 1234 },
//         { _id: 'user2', name: 'Jane Smith', count: 987 }
//       ];
//     }
    
//     res.json({
//       success: true,
//       data: {
//         period,
//         messagesOverTime,
//         topChatters,
//         averageResponseTime: 2.5, // minutes
//         peakHour: 14, // 2 PM
//         busiestDay: 'Monday'
//       }
//     });
//   } catch (error) {
//     console.error('Get chat analytics error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== CHAT SETTINGS ====================

// // Get user chat settings
// router.get('/settings', async (req, res) => {
//   try {
//     const userId = req.user._id || req.userId;
//     res.json({ 
//       success: true, 
//       data: {
//         chatEnabled: true,
//         notifications: { email: true, push: true, sound: true },
//         theme: 'light',
//         blockedUsers: []
//       }
//     });
//   } catch (error) {
//     console.error('Get chat settings error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Update user chat settings (Super Admin only)
// router.put('/settings/:userId', authorize(['super_admin']), async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { chatEnabled } = req.body;
//     res.json({ 
//       success: true, 
//       message: `Chat settings updated for user ${userId}`,
//       data: { userId, chatEnabled }
//     });
//   } catch (error) {
//     console.error('Update chat settings error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== CHAT MANAGEMENT ====================

// // Get or create direct chat
// router.post('/direct', async (req, res) => {
//   try {
//     const { targetUserId } = req.body;
//     const userId = req.user._id || req.userId;
    
//     res.json({ 
//       success: true, 
//       data: {
//         _id: `chat_${Date.now()}`,
//         chatType: 'direct',
//         participants: [
//           { userId, name: req.user.name, role: req.user.role },
//           { userId: targetUserId, name: 'Other User', role: 'technician' }
//         ],
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Get or create direct chat error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get user's chats
// router.get('/chats', async (req, res) => {
//   try {
//     const userId = req.user._id || req.userId;
//     res.json({ 
//       success: true, 
//       data: [
//         {
//           _id: 'chat_1',
//           chatType: 'direct',
//           participants: [
//             { userId, name: req.user.name },
//             { userId: 'user2', name: 'John Doe', role: 'technician' }
//           ],
//           lastMessage: { message: 'Hello!', senderName: 'John Doe', timestamp: new Date() },
//           unreadCount: 2,
//           updatedAt: new Date()
//         },
//         {
//           _id: 'chat_2',
//           chatType: 'group',
//           groupName: 'Maintenance Team',
//           participants: [{ userId }, { userId: 'user3' }, { userId: 'user4' }],
//           lastMessage: { message: 'Meeting at 10 AM', senderName: 'Admin', timestamp: new Date() },
//           unreadCount: 0,
//           updatedAt: new Date()
//         }
//       ]
//     });
//   } catch (error) {
//     console.error('Get user chats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get chat messages
// router.get('/chats/:chatId/messages', async (req, res) => {
//   try {
//     const { chatId } = req.params;
//     const { page = 1, limit = 50 } = req.query;
    
//     res.json({ 
//       success: true, 
//       data: [
//         {
//           _id: 'msg_1',
//           senderId: 'user2',
//           senderName: 'John Doe',
//           message: 'Hello, how can I help you?',
//           status: 'read',
//           createdAt: new Date(Date.now() - 3600000)
//         },
//         {
//           _id: 'msg_2',
//           senderId: req.user._id || req.userId,
//           senderName: req.user.name,
//           message: 'I need help with my task',
//           status: 'delivered',
//           createdAt: new Date(Date.now() - 1800000)
//         }
//       ],
//       pagination: { page: 1, limit: 50, total: 2, pages: 1 }
//     });
//   } catch (error) {
//     console.error('Get chat messages error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Send message
// router.post('/chats/:chatId/messages', async (req, res) => {
//   try {
//     const { chatId } = req.params;
//     const { message, attachments, location } = req.body;
//     const userId = req.user._id || req.userId;
    
//     res.status(201).json({ 
//       success: true, 
//       data: {
//         _id: `msg_${Date.now()}`,
//         chatId,
//         senderId: userId,
//         senderName: req.user.name,
//         message: message || (attachments?.length ? '📎 Attachment' : null),
//         attachments,
//         location,
//         status: 'sent',
//         createdAt: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Send message error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Mark message as read
// router.put('/messages/:messageId/read', async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     res.json({ success: true, message: 'Message marked as read' });
//   } catch (error) {
//     console.error('Mark as read error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Delete message (admin only)
// router.delete('/messages/:messageId', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     res.json({ success: true, message: 'Message deleted' });
//   } catch (error) {
//     console.error('Delete message error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== GROUP CHAT ====================

// // Create group chat
// router.post('/groups', authorize(['admin', 'manager', 'supervisor']), async (req, res) => {
//   try {
//     const { groupName, groupDescription, participants, groupIcon } = req.body;
//     const userId = req.user._id || req.userId;
    
//     res.status(201).json({ 
//       success: true, 
//       data: {
//         _id: `group_${Date.now()}`,
//         chatType: 'group',
//         groupName,
//         groupDescription,
//         groupIcon,
//         participants: [{ userId }, ...participants.map(p => ({ userId: p }))],
//         createdBy: userId,
//         createdAt: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Create group chat error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== TICKET-BASED CHAT ====================

// // Create ticket-based chat
// router.post('/ticket', async (req, res) => {
//   try {
//     const { ticketId, ticketType, assignedToId } = req.body;
//     const userId = req.user._id || req.userId;
    
//     res.status(201).json({ 
//       success: true, 
//       data: {
//         _id: `ticket_chat_${Date.now()}`,
//         chatType: 'ticket',
//         ticketId,
//         ticketType,
//         participants: [
//           { userId, name: req.user.name },
//           { userId: assignedToId, name: 'Assigned User' }
//         ],
//         createdAt: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Create ticket chat error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== USER MANAGEMENT ====================

// // Get available users for chat
// router.get('/users/available', async (req, res) => {
//   try {
//     const userId = req.user._id || req.userId;
//     res.json({ 
//       success: true, 
//       data: [
//         { _id: 'user2', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'technician', chatEnabled: true },
//         { _id: 'user3', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'supervisor', chatEnabled: true },
//         { _id: 'user4', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', role: 'manager', chatEnabled: true }
//       ]
//     });
//   } catch (error) {
//     console.error('Get available users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Block user
// router.post('/users/:userId/block', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { reason } = req.body;
//     res.json({ success: true, message: `User ${userId} blocked` });
//   } catch (error) {
//     console.error('Block user error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Unblock user
// router.delete('/users/:userId/block', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     res.json({ success: true, message: `User ${userId} unblocked` });
//   } catch (error) {
//     console.error('Unblock user error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== ADMIN ONLY ====================

// // Get all chats (admin monitoring)
// router.get('/admin/chats', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     const { page = 1, limit = 20, search } = req.query;
//     res.json({ 
//       success: true, 
//       data: [
//         { _id: 'chat_1', chatType: 'direct', participants: ['User1', 'User2'], messageCount: 45, lastActive: new Date() },
//         { _id: 'chat_2', chatType: 'group', groupName: 'Maintenance Team', participantCount: 5, messageCount: 120, lastActive: new Date() }
//       ],
//       pagination: { page: 1, limit: 20, total: 2, pages: 1 }
//     });
//   } catch (error) {
//     console.error('Get all chats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Export chat logs
// router.get('/admin/export', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     const { chatId, startDate, endDate, format = 'csv' } = req.query;
    
//     if (format === 'csv') {
//       const csvData = 'Date,Time,Sender,Message,Status\n2024-01-01,10:00,John Doe,Hello,read\n2024-01-01,10:01,Admin,Hi there,read';
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', `attachment; filename=chat_logs_${Date.now()}.csv`);
//       return res.send(csvData);
//     }
    
//     res.json({ success: true, data: [], message: 'Chat logs exported' });
//   } catch (error) {
//     console.error('Export chat logs error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;







// // server/src/routes/v1/chat.routes.js
// const express = require('express');
// const router = express.Router();
// const { protect } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');

// // All routes require authentication
// router.use(protect);

// // ==================== CHAT STATISTICS (MUST COME BEFORE PARAM ROUTES) ====================

// /**
//  * @route   GET /api/v1/chat/unread-count
//  * @desc    Get total unread messages count for current user
//  * @access  Private
//  */
// router.get('/unread-count', protect, async (req, res) => {
//   try {
//     const userId = req.user._id || req.userId;
    
//     // Try to get from database if Chat model exists
//     let totalUnread = 0;
//     try {
//       const Chat = require('../../models/Chat.model');
      
//       // Find all chats where user is a participant
//       const chats = await Chat.find({
//         'participants.userId': userId,
//         isActive: true
//       });
      
//       // Calculate total unread count from chat unreadCounts
//       chats.forEach(chat => {
//         const userUnread = chat.unreadCounts?.find(
//           u => u.userId?.toString() === userId?.toString()
//         );
//         if (userUnread && userUnread.count) {
//           totalUnread += userUnread.count;
//         }
//       });
      
//     } catch (modelError) {
//       console.warn('Chat model not available, using mock data');
//       // Mock data for development
//       totalUnread = Math.floor(Math.random() * 5);
//     }
    
//     res.json({ 
//       success: true, 
//       data: { count: totalUnread }
//     });
//   } catch (error) {
//     console.error('Get unread count error:', error);
//     // Always return success with 0 count to avoid breaking the UI
//     res.json({ 
//       success: true, 
//       data: { count: 0 }
//     });
//   }
// });

// /**
//  * @route   GET /api/v1/chat/stats
//  * @desc    Get chat statistics for dashboard
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/stats', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     // Try to get real data from models, fallback to mock data
//     let Chat, Message, User;
    
//     try {
//       Chat = require('../../models/Chat.model');
//       Message = require('../../models/Message.model');
//       User = require('../../models/User.model');
//     } catch (err) {
//       console.log('Models not available, using mock data');
//     }

//     let totalChats = 0;
//     let totalMessages = 0;
//     let activeChats = 0;
//     let messagesByType = [];
//     let chatsByType = [];

//     if (Chat && Message && User) {
//       // Get real data from database
//       totalChats = await Chat.countDocuments({ isActive: true });
//       totalMessages = await Message.countDocuments({ isDeleted: false });
//       activeChats = await Chat.countDocuments({ 
//         updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
//         isActive: true 
//       });
      
//       // Get messages by type
//       messagesByType = await Message.aggregate([
//         { $match: { isDeleted: false } },
//         { $group: { _id: '$messageType', count: { $sum: 1 } } }
//       ]);
      
//       // Get chats by type
//       chatsByType = await Chat.aggregate([
//         { $match: { isActive: true } },
//         { $group: { _id: '$chatType', count: { $sum: 1 } } }
//       ]);
//     } else {
//       // Mock data for development
//       totalChats = 156;
//       totalMessages = 12450;
//       activeChats = 42;
//       messagesByType = [
//         { _id: 'text', count: 11234 },
//         { _id: 'image', count: 876 },
//         { _id: 'file', count: 234 },
//         { _id: 'location', count: 106 }
//       ];
//       chatsByType = [
//         { _id: 'direct', count: 134 },
//         { _id: 'group', count: 18 },
//         { _id: 'ticket', count: 4 }
//       ];
//     }

//     // Get total users with chat enabled
//     let chatEnabledUsers = 0;
//     if (User) {
//       chatEnabledUsers = await User.countDocuments({ chatEnabled: true, status: 'active' });
//     } else {
//       chatEnabledUsers = 45;
//     }

//     // Get recent messages (last 7 days)
//     let recentMessages = [];
//     if (Message) {
//       const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
//       recentMessages = await Message.aggregate([
//         { $match: { createdAt: { $gte: last7Days }, isDeleted: false } },
//         { $group: {
//             _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { _id: 1 } }
//       ]);
//     } else {
//       // Mock recent messages data
//       recentMessages = [
//         { _id: '2024-01-01', count: 234 },
//         { _id: '2024-01-02', count: 456 },
//         { _id: '2024-01-03', count: 345 },
//         { _id: '2024-01-04', count: 567 },
//         { _id: '2024-01-05', count: 678 },
//         { _id: '2024-01-06', count: 432 },
//         { _id: '2024-01-07', count: 543 }
//       ];
//     }

//     res.json({
//       success: true,
//       data: {
//         totalChats,
//         totalMessages,
//         activeChats,
//         chatEnabledUsers,
//         messagesByType,
//         chatsByType,
//         recentMessages,
//         averageMessagesPerChat: totalChats > 0 ? Math.round(totalMessages / totalChats) : 0,
//         messagesToday: recentMessages[recentMessages.length - 1]?.count || 0
//       }
//     });
//   } catch (error) {
//     console.error('Get chat stats error:', error);
//     // Return mock data on error
//     res.json({
//       success: true,
//       data: {
//         totalChats: 156,
//         totalMessages: 12450,
//         activeChats: 42,
//         chatEnabledUsers: 45,
//         messagesByType: [
//           { _id: 'text', count: 11234 },
//           { _id: 'image', count: 876 },
//           { _id: 'file', count: 234 },
//           { _id: 'location', count: 106 }
//         ],
//         chatsByType: [
//           { _id: 'direct', count: 134 },
//           { _id: 'group', count: 18 },
//           { _id: 'ticket', count: 4 }
//         ],
//         recentMessages: [
//           { _id: '2024-01-01', count: 234 },
//           { _id: '2024-01-02', count: 456 },
//           { _id: '2024-01-03', count: 345 },
//           { _id: '2024-01-04', count: 567 },
//           { _id: '2024-01-05', count: 678 },
//           { _id: '2024-01-06', count: 432 },
//           { _id: '2024-01-07', count: 543 }
//         ],
//         averageMessagesPerChat: 80,
//         messagesToday: 543
//       }
//     });
//   }
// });

// /**
//  * @route   GET /api/v1/chat/analytics
//  * @desc    Get detailed chat analytics
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/analytics', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     const { period = 'week' } = req.query;
//     let days = 7;
//     if (period === 'month') days = 30;
//     if (period === 'year') days = 365;
    
//     const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
//     let Chat, Message;
//     try {
//       Chat = require('../../models/Chat.model');
//       Message = require('../../models/Message.model');
//     } catch (err) {
//       console.log('Models not available');
//     }
    
//     let messagesOverTime = [];
//     let topChatters = [];
    
//     if (Message) {
//       messagesOverTime = await Message.aggregate([
//         { $match: { createdAt: { $gte: startDate }, isDeleted: false } },
//         { $group: {
//             _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { _id: 1 } }
//       ]);
      
//       topChatters = await Message.aggregate([
//         { $match: { isDeleted: false } },
//         { $group: {
//             _id: '$senderId',
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { count: -1 } },
//         { $limit: 10 }
//       ]);
      
//       // Populate user names
//       const User = require('../../models/User.model');
//       for (let chatter of topChatters) {
//         const user = await User.findById(chatter._id).select('firstName lastName email');
//         if (user) {
//           chatter.name = `${user.firstName} ${user.lastName}`;
//           chatter.email = user.email;
//         }
//       }
//     } else {
//       messagesOverTime = [
//         { _id: '2024-01-01', count: 234 },
//         { _id: '2024-01-02', count: 456 }
//       ];
//       topChatters = [
//         { _id: 'user1', name: 'John Doe', count: 1234 },
//         { _id: 'user2', name: 'Jane Smith', count: 987 }
//       ];
//     }
    
//     res.json({
//       success: true,
//       data: {
//         period,
//         messagesOverTime,
//         topChatters,
//         averageResponseTime: 2.5, // minutes
//         peakHour: 14, // 2 PM
//         busiestDay: 'Monday'
//       }
//     });
//   } catch (error) {
//     console.error('Get chat analytics error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== CHAT SETTINGS ====================

// // Get user chat settings
// router.get('/settings', async (req, res) => {
//   try {
//     const userId = req.user._id || req.userId;
//     res.json({ 
//       success: true, 
//       data: {
//         chatEnabled: true,
//         notifications: { email: true, push: true, sound: true },
//         theme: 'light',
//         blockedUsers: []
//       }
//     });
//   } catch (error) {
//     console.error('Get chat settings error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Update user chat settings (Super Admin only)
// router.put('/settings/:userId', authorize(['super_admin']), async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { chatEnabled } = req.body;
//     res.json({ 
//       success: true, 
//       message: `Chat settings updated for user ${userId}`,
//       data: { userId, chatEnabled }
//     });
//   } catch (error) {
//     console.error('Update chat settings error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== CHAT MANAGEMENT ====================

// // Get or create direct chat
// router.post('/direct', async (req, res) => {
//   try {
//     const { targetUserId } = req.body;
//     const userId = req.user._id || req.userId;
    
//     res.json({ 
//       success: true, 
//       data: {
//         _id: `chat_${Date.now()}`,
//         chatType: 'direct',
//         participants: [
//           { userId, name: req.user.name, role: req.user.role },
//           { userId: targetUserId, name: 'Other User', role: 'technician' }
//         ],
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Get or create direct chat error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get user's chats
// router.get('/chats', async (req, res) => {
//   try {
//     const userId = req.user._id || req.userId;
//     res.json({ 
//       success: true, 
//       data: [
//         {
//           _id: 'chat_1',
//           chatType: 'direct',
//           participants: [
//             { userId, name: req.user.name },
//             { userId: 'user2', name: 'John Doe', role: 'technician' }
//           ],
//           lastMessage: { message: 'Hello!', senderName: 'John Doe', timestamp: new Date() },
//           unreadCount: 2,
//           updatedAt: new Date()
//         },
//         {
//           _id: 'chat_2',
//           chatType: 'group',
//           groupName: 'Maintenance Team',
//           participants: [{ userId }, { userId: 'user3' }, { userId: 'user4' }],
//           lastMessage: { message: 'Meeting at 10 AM', senderName: 'Admin', timestamp: new Date() },
//           unreadCount: 0,
//           updatedAt: new Date()
//         }
//       ]
//     });
//   } catch (error) {
//     console.error('Get user chats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get chat messages
// router.get('/chats/:chatId/messages', async (req, res) => {
//   try {
//     const { chatId } = req.params;
//     const { page = 1, limit = 50 } = req.query;
    
//     res.json({ 
//       success: true, 
//       data: [
//         {
//           _id: 'msg_1',
//           senderId: 'user2',
//           senderName: 'John Doe',
//           message: 'Hello, how can I help you?',
//           status: 'read',
//           createdAt: new Date(Date.now() - 3600000)
//         },
//         {
//           _id: 'msg_2',
//           senderId: req.user._id || req.userId,
//           senderName: req.user.name,
//           message: 'I need help with my task',
//           status: 'delivered',
//           createdAt: new Date(Date.now() - 1800000)
//         }
//       ],
//       pagination: { page: 1, limit: 50, total: 2, pages: 1 }
//     });
//   } catch (error) {
//     console.error('Get chat messages error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Send message
// router.post('/chats/:chatId/messages', async (req, res) => {
//   try {
//     const { chatId } = req.params;
//     const { message, attachments, location } = req.body;
//     const userId = req.user._id || req.userId;
    
//     res.status(201).json({ 
//       success: true, 
//       data: {
//         _id: `msg_${Date.now()}`,
//         chatId,
//         senderId: userId,
//         senderName: req.user.name,
//         message: message || (attachments?.length ? '📎 Attachment' : null),
//         attachments,
//         location,
//         status: 'sent',
//         createdAt: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Send message error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Mark message as read
// router.put('/messages/:messageId/read', async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     res.json({ success: true, message: 'Message marked as read' });
//   } catch (error) {
//     console.error('Mark as read error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Delete message (admin only)
// router.delete('/messages/:messageId', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     res.json({ success: true, message: 'Message deleted' });
//   } catch (error) {
//     console.error('Delete message error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== GROUP CHAT ====================

// // Create group chat
// router.post('/groups', authorize(['admin', 'manager', 'supervisor']), async (req, res) => {
//   try {
//     const { groupName, groupDescription, participants, groupIcon } = req.body;
//     const userId = req.user._id || req.userId;
    
//     res.status(201).json({ 
//       success: true, 
//       data: {
//         _id: `group_${Date.now()}`,
//         chatType: 'group',
//         groupName,
//         groupDescription,
//         groupIcon,
//         participants: [{ userId }, ...participants.map(p => ({ userId: p }))],
//         createdBy: userId,
//         createdAt: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Create group chat error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== TICKET-BASED CHAT ====================

// // Create ticket-based chat
// router.post('/ticket', async (req, res) => {
//   try {
//     const { ticketId, ticketType, assignedToId } = req.body;
//     const userId = req.user._id || req.userId;
    
//     res.status(201).json({ 
//       success: true, 
//       data: {
//         _id: `ticket_chat_${Date.now()}`,
//         chatType: 'ticket',
//         ticketId,
//         ticketType,
//         participants: [
//           { userId, name: req.user.name },
//           { userId: assignedToId, name: 'Assigned User' }
//         ],
//         createdAt: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Create ticket chat error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== USER MANAGEMENT ====================

// // Get available users for chat
// router.get('/users/available', async (req, res) => {
//   try {
//     const userId = req.user._id || req.userId;
//     res.json({ 
//       success: true, 
//       data: [
//         { _id: 'user2', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'technician', chatEnabled: true },
//         { _id: 'user3', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'supervisor', chatEnabled: true },
//         { _id: 'user4', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', role: 'manager', chatEnabled: true }
//       ]
//     });
//   } catch (error) {
//     console.error('Get available users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Block user
// router.post('/users/:userId/block', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { reason } = req.body;
//     res.json({ success: true, message: `User ${userId} blocked` });
//   } catch (error) {
//     console.error('Block user error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Unblock user
// router.delete('/users/:userId/block', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     res.json({ success: true, message: `User ${userId} unblocked` });
//   } catch (error) {
//     console.error('Unblock user error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== ADMIN ONLY ====================

// // Get all chats (admin monitoring)
// router.get('/admin/chats', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     const { page = 1, limit = 20, search } = req.query;
//     res.json({ 
//       success: true, 
//       data: [
//         { _id: 'chat_1', chatType: 'direct', participants: ['User1', 'User2'], messageCount: 45, lastActive: new Date() },
//         { _id: 'chat_2', chatType: 'group', groupName: 'Maintenance Team', participantCount: 5, messageCount: 120, lastActive: new Date() }
//       ],
//       pagination: { page: 1, limit: 20, total: 2, pages: 1 }
//     });
//   } catch (error) {
//     console.error('Get all chats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Export chat logs
// router.get('/admin/export', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     const { chatId, startDate, endDate, format = 'csv' } = req.query;
    
//     if (format === 'csv') {
//       const csvData = 'Date,Time,Sender,Message,Status\n2024-01-01,10:00,John Doe,Hello,read\n2024-01-01,10:01,Admin,Hi there,read';
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', `attachment; filename=chat_logs_${Date.now()}.csv`);
//       return res.send(csvData);
//     }
    
//     res.json({ success: true, data: [], message: 'Chat logs exported' });
//   } catch (error) {
//     console.error('Export chat logs error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;








const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

// All routes require authentication
router.use(protect);

// ==================== CHAT STATISTICS (MUST COME BEFORE PARAM ROUTES) ====================

/**
 * @route   GET /api/v1/chat/unread-count
 * @desc    Get total unread messages count for current user
 * @access  Private
 */
router.get('/unread-count', async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    let totalUnread = 0;
    try {
      const Chat = require('../../models/Chat.model');
      
      const chats = await Chat.find({
        'participants.userId': userId,
        isActive: true
      });
      
      chats.forEach(chat => {
        const userUnread = chat.unreadCounts?.find(
          u => u.userId?.toString() === userId?.toString()
        );
        if (userUnread && userUnread.count) {
          totalUnread += userUnread.count;
        }
      });
      
    } catch (modelError) {
      console.log('Chat model not available, using mock data');
      totalUnread = Math.floor(Math.random() * 10);
    }
    
    res.json({ 
      success: true, 
      data: { count: totalUnread }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.json({ success: true, data: { count: 0 } });
  }
});

/**
 * @route   GET /api/v1/chat/stats
 * @desc    Get chat statistics for dashboard
 * @access  Private (Admin, Super Admin)
 */
router.get('/stats', authorize('admin', 'super_admin'), async (req, res) => {
  try {
    let Chat, Message, User;
    
    try {
      Chat = require('../../models/Chat.model');
      Message = require('../../models/Message.model');
      User = require('../../models/User.model');
    } catch (err) {
      console.log('Models not available, using mock data');
    }

    let totalChats = 0;
    let totalMessages = 0;
    let activeChats = 0;
    let messagesByType = [];
    let chatsByType = [];

    if (Chat && Message && User) {
      totalChats = await Chat.countDocuments({ isActive: true });
      totalMessages = await Message.countDocuments({ isDeleted: false });
      activeChats = await Chat.countDocuments({ 
        updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        isActive: true 
      });
      
      messagesByType = await Message.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$messageType', count: { $sum: 1 } } }
      ]);
      
      chatsByType = await Chat.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$chatType', count: { $sum: 1 } } }
      ]);
    } else {
      totalChats = 156;
      totalMessages = 12450;
      activeChats = 42;
      messagesByType = [
        { _id: 'text', count: 11234 },
        { _id: 'image', count: 876 },
        { _id: 'file', count: 234 },
        { _id: 'location', count: 106 }
      ];
      chatsByType = [
        { _id: 'direct', count: 134 },
        { _id: 'group', count: 18 },
        { _id: 'ticket', count: 4 }
      ];
    }

    let chatEnabledUsers = 0;
    if (User) {
      chatEnabledUsers = await User.countDocuments({ chatEnabled: true, status: 'active' });
    } else {
      chatEnabledUsers = 45;
    }

    let recentMessages = [];
    if (Message) {
      const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      recentMessages = await Message.aggregate([
        { $match: { createdAt: { $gte: last7Days }, isDeleted: false } },
        { $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
    } else {
      recentMessages = [
        { _id: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 234 },
        { _id: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 456 },
        { _id: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 345 },
        { _id: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 567 },
        { _id: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 678 },
        { _id: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 432 },
        { _id: new Date().toISOString().split('T')[0], count: 543 }
      ];
    }

    res.json({
      success: true,
      data: {
        totalChats,
        totalMessages,
        activeChats,
        chatEnabledUsers,
        messagesByType,
        chatsByType,
        recentMessages,
        averageMessagesPerChat: totalChats > 0 ? Math.round(totalMessages / totalChats) : 0,
        messagesToday: recentMessages[recentMessages.length - 1]?.count || 0
      }
    });
  } catch (error) {
    console.error('Get chat stats error:', error);
    res.json({
      success: true,
      data: {
        totalChats: 156,
        totalMessages: 12450,
        activeChats: 42,
        chatEnabledUsers: 45,
        messagesByType: [{ _id: 'text', count: 11234 }, { _id: 'image', count: 876 }, { _id: 'file', count: 234 }, { _id: 'location', count: 106 }],
        chatsByType: [{ _id: 'direct', count: 134 }, { _id: 'group', count: 18 }, { _id: 'ticket', count: 4 }],
        recentMessages: [],
        averageMessagesPerChat: 80,
        messagesToday: 543
      }
    });
  }
});

/**
 * @route   GET /api/v1/chat/analytics
 * @desc    Get detailed chat analytics
 * @access  Private (Admin, Super Admin)
 */
router.get('/analytics', authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let days = period === 'month' ? 30 : period === 'year' ? 365 : 7;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    let messagesOverTime = [];
    let topChatters = [];
    
    try {
      const Message = require('../../models/Message.model');
      
      if (Message) {
        messagesOverTime = await Message.aggregate([
          { $match: { createdAt: { $gte: startDate }, isDeleted: false } },
          { $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        
        topChatters = await Message.aggregate([
          { $match: { isDeleted: false } },
          { $group: { _id: '$senderId', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]);
        
        const User = require('../../models/User.model');
        for (let chatter of topChatters) {
          const user = await User.findById(chatter._id).select('firstName lastName email');
          if (user) {
            chatter.name = `${user.firstName} ${user.lastName}`;
            chatter.email = user.email;
          } else {
            chatter.name = 'Unknown User';
            chatter.email = 'unknown@example.com';
          }
        }
      }
    } catch (err) {
      console.log('Models not available, using mock data');
      messagesOverTime = [
        { _id: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 234 },
        { _id: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 456 },
        { _id: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 345 },
        { _id: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 567 },
        { _id: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 678 },
        { _id: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], count: 432 },
        { _id: new Date().toISOString().split('T')[0], count: 543 }
      ];
      topChatters = [
        { _id: 'user1', name: 'John Doe', count: 1234 },
        { _id: 'user2', name: 'Jane Smith', count: 987 },
        { _id: 'user3', name: 'Mike Johnson', count: 876 }
      ];
    }
    
    res.json({
      success: true,
      data: {
        period,
        messagesOverTime,
        topChatters,
        averageResponseTime: 2.5,
        peakHour: 14,
        busiestDay: 'Monday'
      }
    });
  } catch (error) {
    console.error('Get chat analytics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== CHAT SETTINGS ====================

/**
 * @route   GET /api/v1/chat/settings
 * @desc    Get current user's chat settings
 * @access  Private
 */
router.get('/settings', async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    res.json({ 
      success: true, 
      data: {
        chatEnabled: true,
        notifications: { email: true, push: true, sound: true },
        theme: 'light',
        blockedUsers: []
      }
    });
  } catch (error) {
    console.error('Get chat settings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   PUT /api/v1/chat/settings/:userId
 * @desc    Update user chat settings (Admin/Super Admin only)
 * @access  Private (Admin, Super Admin)
 */
router.put('/settings/:userId', authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { chatEnabled, notifications, theme } = req.body;
    
    res.json({ 
      success: true, 
      message: `Chat settings updated for user ${userId}`,
      data: { userId, chatEnabled, notifications, theme }
    });
  } catch (error) {
    console.error('Update chat settings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== CHAT MANAGEMENT ====================

/**
 * @route   POST /api/v1/chat/direct
 * @desc    Get or create direct chat with another user
 * @access  Private
 */
router.post('/direct', async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const userId = req.user._id || req.user.id;
    
    if (!targetUserId) {
      return res.status(400).json({ success: false, error: 'Target user ID is required' });
    }
    
    res.json({ 
      success: true, 
      data: {
        _id: `chat_${Date.now()}`,
        chatType: 'direct',
        participants: [
          { userId, name: req.user.name, role: req.user.role },
          { userId: targetUserId, name: 'Other User', role: 'technician' }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Get or create direct chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/v1/chat/chats
 * @desc    Get all chats for current user
 * @access  Private
 */
router.get('/chats', async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    res.json({ 
      success: true, 
      data: [
        {
          _id: 'chat_1',
          chatType: 'direct',
          participants: [
            { userId, name: req.user.name, role: req.user.role },
            { userId: 'user2', name: 'John Doe', role: 'technician', avatar: null, online: true }
          ],
          lastMessage: { 
            message: 'Hello! How can I help you?', 
            senderId: 'user2',
            senderName: 'John Doe', 
            timestamp: new Date(),
            status: 'read'
          },
          unreadCount: 2,
          updatedAt: new Date()
        },
        {
          _id: 'chat_2',
          chatType: 'group',
          groupName: 'Maintenance Team',
          groupIcon: null,
          participants: [
            { userId, name: req.user.name, role: req.user.role },
            { userId: 'user3', name: 'Jane Smith', role: 'supervisor' },
            { userId: 'user4', name: 'Mike Johnson', role: 'manager' }
          ],
          lastMessage: { 
            message: 'Meeting at 10 AM tomorrow', 
            senderId: 'user3',
            senderName: 'Jane Smith', 
            timestamp: new Date(),
            status: 'delivered'
          },
          unreadCount: 0,
          updatedAt: new Date()
        },
        {
          _id: 'chat_3',
          chatType: 'ticket',
          ticketId: 'TKT-001',
          ticketSubject: 'Urgent maintenance required',
          participants: [
            { userId, name: req.user.name },
            { userId: 'user5', name: 'Support Team' }
          ],
          lastMessage: { 
            message: 'We are working on your ticket', 
            senderId: 'user5',
            senderName: 'Support Team', 
            timestamp: new Date(),
            status: 'read'
          },
          unreadCount: 1,
          updatedAt: new Date()
        }
      ]
    });
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/v1/chat/chats/:chatId/messages
 * @desc    Get messages for a specific chat
 * @access  Private
 */
router.get('/chats/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id || req.user.id;
    
    // Mock messages data
    const messages = [];
    const now = new Date();
    
    for (let i = 0; i < 20; i++) {
      const isOwn = i % 2 === 0;
      messages.push({
        _id: `msg_${i}`,
        chatId,
        senderId: isOwn ? userId : 'user2',
        senderName: isOwn ? req.user.name : 'John Doe',
        senderRole: isOwn ? req.user.role : 'technician',
        message: isOwn ? `This is my message ${i}` : `Reply message ${i}`,
        messageType: 'text',
        attachments: i === 5 ? [{ url: '/uploads/file.pdf', name: 'document.pdf', size: 1024 }] : [],
        status: isOwn ? 'read' : 'delivered',
        createdAt: new Date(now - i * 60 * 60 * 1000),
        readAt: isOwn ? new Date(now - i * 60 * 60 * 1000 + 5 * 60 * 1000) : null
      });
    }
    
    res.json({ 
      success: true, 
      data: messages.reverse(),
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total: messages.length, 
        pages: Math.ceil(messages.length / limit) 
      }
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/v1/chat/chats/:chatId/messages
 * @desc    Send a message to a chat
 * @access  Private
 */
router.post('/chats/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message, messageType = 'text', attachments, location, replyToId } = req.body;
    const userId = req.user._id || req.user.id;
    
    if (!message && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ success: false, error: 'Message or attachments required' });
    }
    
    const newMessage = {
      _id: `msg_${Date.now()}`,
      chatId,
      senderId: userId,
      senderName: req.user.name,
      senderRole: req.user.role,
      message: message || (attachments?.length ? '📎 Attachment' : null),
      messageType,
      attachments: attachments || [],
      location: location || null,
      replyToId: replyToId || null,
      status: 'sent',
      createdAt: new Date()
    };
    
    res.status(201).json({ 
      success: true, 
      data: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   PUT /api/v1/chat/messages/:messageId/read
 * @desc    Mark a message as read
 * @access  Private
 */
router.put('/messages/:messageId/read', async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id || req.user.id;
    
    res.json({ 
      success: true, 
      message: 'Message marked as read',
      data: { messageId, readAt: new Date() }
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   DELETE /api/v1/chat/messages/:messageId
 * @desc    Delete a message (Admin/Super Admin only)
 * @access  Private (Admin, Super Admin)
 */
router.delete('/messages/:messageId', authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { messageId } = req.params;
    
    res.json({ 
      success: true, 
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== GROUP CHAT ====================

/**
 * @route   POST /api/v1/chat/groups
 * @desc    Create a group chat
 * @access  Private (Admin, Manager, Supervisor)
 */
router.post('/groups', authorize('admin', 'manager', 'supervisor'), async (req, res) => {
  try {
    const { groupName, groupDescription, participants, groupIcon } = req.body;
    const userId = req.user._id || req.user.id;
    
    if (!groupName) {
      return res.status(400).json({ success: false, error: 'Group name is required' });
    }
    
    const newGroup = {
      _id: `group_${Date.now()}`,
      chatType: 'group',
      groupName,
      groupDescription: groupDescription || '',
      groupIcon: groupIcon || null,
      participants: [{ userId, name: req.user.name, role: 'admin' }, ...(participants || []).map(p => ({ userId: p }))],
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    res.status(201).json({ 
      success: true, 
      data: newGroup
    });
  } catch (error) {
    console.error('Create group chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   PUT /api/v1/chat/groups/:groupId
 * @desc    Update group chat details
 * @access  Private (Group Admin or Super Admin)
 */
router.put('/groups/:groupId', authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { groupId } = req.params;
    const { groupName, groupDescription, groupIcon } = req.body;
    
    res.json({ 
      success: true, 
      message: 'Group updated successfully',
      data: { groupId, groupName, groupDescription, groupIcon }
    });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/v1/chat/groups/:groupId/participants
 * @desc    Add participants to group
 * @access  Private (Group Admin or Super Admin)
 */
router.post('/groups/:groupId/participants', authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userIds } = req.body;
    
    res.json({ 
      success: true, 
      message: `${userIds?.length || 0} participants added to group`,
      data: { groupId, addedParticipants: userIds }
    });
  } catch (error) {
    console.error('Add participants error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   DELETE /api/v1/chat/groups/:groupId/participants/:userId
 * @desc    Remove participant from group
 * @access  Private (Group Admin or Super Admin)
 */
router.delete('/groups/:groupId/participants/:userId', authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    
    res.json({ 
      success: true, 
      message: `User ${userId} removed from group`
    });
  } catch (error) {
    console.error('Remove participant error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== TICKET-BASED CHAT ====================

/**
 * @route   POST /api/v1/chat/ticket
 * @desc    Create a ticket-based chat
 * @access  Private
 */
router.post('/ticket', async (req, res) => {
  try {
    const { ticketId, ticketType, assignedToId, subject } = req.body;
    const userId = req.user._id || req.user.id;
    
    if (!ticketId) {
      return res.status(400).json({ success: false, error: 'Ticket ID is required' });
    }
    
    res.status(201).json({ 
      success: true, 
      data: {
        _id: `ticket_chat_${Date.now()}`,
        chatType: 'ticket',
        ticketId,
        ticketType: ticketType || 'support',
        ticketSubject: subject || `Ticket ${ticketId}`,
        participants: [
          { userId, name: req.user.name, role: req.user.role },
          { userId: assignedToId || 'support', name: 'Support Team', role: 'support' }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Create ticket chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== USER MANAGEMENT ====================

/**
 * @route   GET /api/v1/chat/users/available
 * @desc    Get available users for chat
 * @access  Private
 */
router.get('/users/available', async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const search = req.query.search || '';
    
    res.json({ 
      success: true, 
      data: [
        { _id: 'user2', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'technician', chatEnabled: true, online: true, lastSeen: new Date() },
        { _id: 'user3', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'supervisor', chatEnabled: true, online: false, lastSeen: new Date(Date.now() - 5 * 60 * 1000) },
        { _id: 'user4', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', role: 'manager', chatEnabled: true, online: true, lastSeen: new Date() },
        { _id: 'user5', firstName: 'Sarah', lastName: 'Williams', email: 'sarah@example.com', role: 'technician', chatEnabled: true, online: false, lastSeen: new Date(Date.now() - 30 * 60 * 1000) }
      ]
    });
  } catch (error) {
    console.error('Get available users error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/v1/chat/users/:userId/block
 * @desc    Block a user from chatting
 * @access  Private
 */
router.post('/users/:userId/block', async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const currentUserId = req.user._id || req.user.id;
    
    res.json({ 
      success: true, 
      message: `User ${userId} blocked successfully`,
      data: { blockedUserId: userId, reason: reason || 'No reason provided', blockedAt: new Date() }
    });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   DELETE /api/v1/chat/users/:userId/block
 * @desc    Unblock a user
 * @access  Private
 */
router.delete('/users/:userId/block', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id || req.user.id;
    
    res.json({ 
      success: true, 
      message: `User ${userId} unblocked successfully`
    });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== TYPING INDICATORS ====================

/**
 * @route   POST /api/v1/chat/typing
 * @desc    Send typing indicator
 * @access  Private
 */
router.post('/typing', async (req, res) => {
  try {
    const { chatId, isTyping } = req.body;
    const userId = req.user._id || req.user.id;
    
    res.json({ 
      success: true, 
      data: { chatId, userId, isTyping, timestamp: new Date() }
    });
  } catch (error) {
    console.error('Typing indicator error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ADMIN ONLY ====================

/**
 * @route   GET /api/v1/chat/admin/chats
 * @desc    Get all chats for admin monitoring
 * @access  Private (Admin, Super Admin)
 */
router.get('/admin/chats', authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, chatType } = req.query;
    
    res.json({ 
      success: true, 
      data: [
        { _id: 'chat_1', chatType: 'direct', participants: ['John Doe', 'Admin User'], messageCount: 45, lastActive: new Date(), status: 'active' },
        { _id: 'chat_2', chatType: 'group', groupName: 'Maintenance Team', participantCount: 5, messageCount: 120, lastActive: new Date(), status: 'active' },
        { _id: 'chat_3', chatType: 'ticket', ticketId: 'TKT-001', participantCount: 2, messageCount: 12, lastActive: new Date(), status: 'resolved' }
      ],
      pagination: { page: parseInt(page), limit: parseInt(limit), total: 3, pages: 1 }
    });
  } catch (error) {
    console.error('Get all chats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/v1/chat/admin/chats/:chatId
 * @desc    Get detailed chat info for admin
 * @access  Private (Admin, Super Admin)
 */
router.get('/admin/chats/:chatId', authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { chatId } = req.params;
    
    res.json({ 
      success: true, 
      data: {
        _id: chatId,
        chatType: 'direct',
        participants: [
          { userId: 'user1', name: 'John Doe', email: 'john@example.com', role: 'technician', joinedAt: new Date() },
          { userId: 'user2', name: 'Admin User', email: 'admin@example.com', role: 'admin', joinedAt: new Date() }
        ],
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 45,
        attachmentCount: 3,
        lastActive: new Date()
      }
    });
  } catch (error) {
    console.error('Get chat details error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/v1/chat/admin/export
 * @desc    Export chat logs
 * @access  Private (Admin, Super Admin)
 */
router.get('/admin/export', authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { chatId, startDate, endDate, format = 'csv' } = req.query;
    
    if (format === 'csv') {
      const csvHeader = 'Date,Time,Sender,Sender Role,Message,Status,Attachments\n';
      const csvRows = [
        csvHeader,
        `${new Date().toISOString().split('T')[0]},10:00,John Doe,Technician,Hello,read,`,
        `${new Date().toISOString().split('T')[0]},10:01,Admin,Admin,Hi there,read,`,
        `${new Date().toISOString().split('T')[0]},10:02,John Doe,Technician,Can you help me?,delivered,image.png`
      ].join('');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=chat_logs_${Date.now()}.csv`);
      return res.send(csvRows);
    }
    
    res.json({ 
      success: true, 
      data: [], 
      message: 'Chat logs exported',
      format,
      exportedAt: new Date()
    });
  } catch (error) {
    console.error('Export chat logs error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== SEARCH ====================

/**
 * @route   GET /api/v1/chat/search
 * @desc    Search messages across chats
 * @access  Private
 */
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    const userId = req.user._id || req.user.id;
    
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [], message: 'Search query too short' });
    }
    
    res.json({ 
      success: true, 
      data: [
        { _id: 'msg_1', chatId: 'chat_1', chatName: 'John Doe', message: `Message containing "${q}"`, sender: 'John Doe', createdAt: new Date() },
        { _id: 'msg_2', chatId: 'chat_2', chatName: 'Maintenance Team', message: `Another message with "${q}"`, sender: 'Jane Smith', createdAt: new Date() }
      ]
    });
  } catch (error) {
    console.error('Search messages error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;