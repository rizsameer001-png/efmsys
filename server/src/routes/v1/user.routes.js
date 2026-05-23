// server/src/routes/v1/user.routes.js
//working routes uncomment if issue arise


// const express = require('express');
// const router = express.Router();
// const userController = require('../../controllers/user.controller');
// const { protect } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');

// // Debug: Check what we have
// console.log('User routes - protect type:', typeof protect);
// console.log('User routes - authorize type:', typeof authorize);

// // ==================== ALL ROUTES REQUIRE AUTHENTICATION ====================
// router.use(protect);

// // ==================== SPECIFIC ROUTES (NO PARAMETERS) - MUST COME FIRST ====================

// // Base CRUD routes
// router.get('/', authorize(['super_admin', 'admin', 'manager', 'hr']), userController.getUsers);
// router.post('/', authorize(['super_admin', 'admin', 'hr']), userController.createUser);

// // Export and Import routes
// router.get('/export', authorize(['super_admin', 'admin']), userController.exportUsers);
// router.post('/bulk-import', authorize(['super_admin', 'admin']), userController.bulkImportUsers);

// // Online Status Routes
// router.get('/online', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const onlineUsers = await User.find({
//       isUserOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isUserOnline lastSeen socketId');
    
//     res.json({ 
//       success: true, 
//       data: onlineUsers,
//       count: onlineUsers.length
//     });
//   } catch (error) {
//     console.error('Get online users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.get('/online/count', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const count = await User.countDocuments({ 
//       isUserOnline: true, 
//       status: 'active',
//       _id: { $ne: req.user._id }
//     });
    
//     res.json({ 
//       success: true, 
//       data: { count }
//     });
//   } catch (error) {
//     console.error('Get online users count error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.get('/online/technicians', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const onlineTechnicians = await User.find({
//       role: 'technician',
//       isUserOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isUserOnline lastSeen');
    
//     res.json({ 
//       success: true, 
//       data: onlineTechnicians,
//       count: onlineTechnicians.length
//     });
//   } catch (error) {
//     console.error('Get online technicians error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.get('/online/managers', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const onlineManagers = await User.find({
//       role: { $in: ['manager', 'super_admin', 'admin'] },
//       isUserOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isUserOnline lastSeen');
    
//     res.json({ 
//       success: true, 
//       data: onlineManagers,
//       count: onlineManagers.length
//     });
//   } catch (error) {
//     console.error('Get online managers error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Chat Permission Routes
// router.get('/chat-enabled', authorize(['super_admin', 'admin']), userController.getChatEnabledUsers);
// router.get('/chat/permissions', authorize(['super_admin', 'admin']), (req, res) => {
//   const permissionMatrix = {
//     super_admin: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin'],
//       canCreateGroup: true,
//       canModifyPermissions: true
//     },
//     admin: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     manager: {
//       canChatWith: ['customer', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     supervisor: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     technician: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'admin'],
//       canCreateGroup: false,
//       canModifyPermissions: false
//     },
//     hr: {
//       canChatWith: ['employee', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     customer: {
//       canChatWith: ['technician', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: false,
//       canModifyPermissions: false
//     }
//   };
  
//   res.json({ success: true, data: permissionMatrix });
// });

// router.get('/chat/stats', authorize(['super_admin', 'admin']), async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const totalUsers = await User.countDocuments({ status: 'active' });
//     const chatEnabledUsers = await User.countDocuments({ chatEnabled: true, status: 'active' });
//     const chatDisabledUsers = totalUsers - chatEnabledUsers;
    
//     const byRole = await User.aggregate([
//       { $match: { status: 'active' } },
//       { $group: {
//           _id: '$role',
//           total: { $sum: 1 },
//           chatEnabled: { $sum: { $cond: ['$chatEnabled', 1, 0] } }
//         }
//       }
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         totalUsers,
//         chatEnabledUsers,
//         chatDisabledUsers,
//         percentageEnabled: totalUsers ? ((chatEnabledUsers / totalUsers) * 100).toFixed(1) : 0,
//         byRole
//       }
//     });
//   } catch (error) {
//     console.error('Get chat stats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Status Update Routes
// router.post('/update-status', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const { isOnline } = req.body;
    
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { 
//         isUserOnline: isOnline !== undefined ? isOnline : true,
//         lastSeen: new Date()
//       },
//       { new: true }
//     ).select('_id isUserOnline lastSeen');
    
//     res.json({ 
//       success: true, 
//       data: {
//         isOnline: user.isUserOnline,
//         lastSeen: user.lastSeen
//       },
//       message: `Status updated to ${user.isUserOnline ? 'online' : 'offline'}`
//     });
//   } catch (error) {
//     console.error('Update status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.post('/heartbeat', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
    
//     await User.findByIdAndUpdate(req.user._id, { 
//       lastSeen: new Date(),
//       isUserOnline: true
//     });
    
//     res.json({ 
//       success: true, 
//       message: 'Heartbeat updated',
//       timestamp: new Date()
//     });
//   } catch (error) {
//     console.error('Heartbeat error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Bulk Operations Routes
// router.post('/bulk-toggle-chat', authorize(['super_admin']), userController.bulkToggleChatEnabled);
// router.post('/bulk/online-status', protect, async (req, res) => {
//   try {
//     const { userIds } = req.body;
    
//     if (!userIds || !Array.isArray(userIds)) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Please provide an array of user IDs' 
//       });
//     }
    
//     const User = require('../../models/User.model');
//     const users = await User.find({
//       _id: { $in: userIds },
//       status: 'active'
//     }).select('_id isUserOnline lastSeen');
    
//     const statusMap = {};
//     users.forEach(user => {
//       statusMap[user._id] = {
//         isOnline: user.isUserOnline,
//         lastSeen: user.lastSeen
//       };
//     });
    
//     res.json({ 
//       success: true, 
//       data: statusMap
//     });
//   } catch (error) {
//     console.error('Bulk online status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Activity Routes
// router.get('/activity/recent', authorize(['admin', 'manager', 'super_admin']), async (req, res) => {
//   try {
//     const { minutes = 5 } = req.query;
//     const cutoffTime = new Date(Date.now() - (minutes * 60 * 1000));
    
//     const User = require('../../models/User.model');
//     const activeUsers = await User.find({
//       lastSeen: { $gte: cutoffTime },
//       status: 'active'
//     }).select('_id firstName lastName email role isUserOnline lastSeen lastLoginAt')
//       .sort({ lastSeen: -1 });
    
//     res.json({ 
//       success: true, 
//       data: activeUsers,
//       count: activeUsers.length,
//       timeWindow: `${minutes} minutes`
//     });
//   } catch (error) {
//     console.error('Get recent activity error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.get('/activity/inactive', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     const { days = 7 } = req.query;
//     const cutoffTime = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
    
//     const User = require('../../models/User.model');
//     const inactiveUsers = await User.find({
//       $or: [
//         { lastSeen: { $lt: cutoffTime } },
//         { lastLoginAt: { $lt: cutoffTime } }
//       ],
//       status: 'active',
//       role: { $ne: 'super_admin' }
//     }).select('_id firstName lastName email role lastSeen lastLoginAt')
//       .sort({ lastSeen: 1 });
    
//     res.json({ 
//       success: true, 
//       data: inactiveUsers,
//       count: inactiveUsers.length,
//       inactiveSince: `${days} days`
//     });
//   } catch (error) {
//     console.error('Get inactive users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Socket Management Routes
// router.post('/socket/register', protect, async (req, res) => {
//   try {
//     const { socketId } = req.body;
    
//     if (!socketId) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Socket ID is required' 
//       });
//     }
    
//     const User = require('../../models/User.model');
//     await User.findByIdAndUpdate(req.user._id, {
//       socketId: socketId,
//       isUserOnline: true,
//       lastSeen: new Date()
//     });
    
//     res.json({ 
//       success: true, 
//       message: 'Socket ID registered successfully'
//     });
//   } catch (error) {
//     console.error('Register socket error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.delete('/socket/unregister', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     await User.findByIdAndUpdate(req.user._id, {
//       socketId: null,
//       isUserOnline: false,
//       lastSeen: new Date()
//     });
    
//     res.json({ 
//       success: true, 
//       message: 'Socket ID unregistered successfully'
//     });
//   } catch (error) {
//     console.error('Unregister socket error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== PARAMETER ROUTES (WITH :id) - MUST COME LAST ====================

// // Get user by ID
// router.get('/:id', authorize(['super_admin', 'admin', 'manager']), userController.getUserById);

// // Update user
// router.put('/:id', authorize(['super_admin', 'admin', 'manager']), userController.updateUser);

// // Delete user
// router.delete('/:id', authorize(['super_admin', 'admin']), userController.deleteUser);

// // Get user online status by ID
// router.get('/:id/status', protect, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const User = require('../../models/User.model');
    
//     const user = await User.findById(id)
//       .select('_id firstName lastName email role isUserOnline lastSeen socketId');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: {
//         userId: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         isOnline: user.isUserOnline,
//         lastSeen: user.lastSeen
//       }
//     });
//   } catch (error) {
//     console.error('Get user status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Toggle chat for specific user
// router.put('/:id/toggle-chat', authorize(['super_admin']), userController.toggleChatEnabled);

// // Activate/Deactivate user
// router.put('/:id/activate', authorize(['super_admin', 'admin']), userController.activateUser);
// router.put('/:id/deactivate', authorize(['super_admin', 'admin']), userController.deactivateUser);

// // Reset user password
// router.post('/:id/reset-password', authorize(['super_admin', 'admin']), userController.resetUserPassword);

// // User documents routes
// router.post('/:id/documents', authorize(['super_admin', 'admin']), userController.uploadUserDocument);
// router.get('/:id/documents', authorize(['super_admin', 'admin']), userController.getUserDocuments);
// router.delete('/:id/documents/:documentId', authorize(['super_admin', 'admin']), userController.deleteUserDocument);

// // User permissions routes
// router.get('/:id/permissions', authorize(['super_admin', 'admin']), userController.getUserPermissions);
// router.put('/:id/permissions', authorize(['super_admin', 'admin']), userController.updateUserPermissions);

// // ==================== PROFILE ROUTES ====================
// router.put('/profile', protect, userController.updateOwnProfile);
// router.put('/change-password', protect, userController.changeOwnPassword);
// router.post('/profile/image', protect, userController.uploadProfileImage);
// router.delete('/profile/image', protect, userController.removeProfileImage);

// // ==================== TEAM MANAGEMENT ROUTES ====================
// router.get('/technicians', protect, userController.getTechnicians);
// router.get('/team', protect, userController.getTeamMembers);
// router.get('/hierarchy', protect, userController.getReportingHierarchy);

// // ==================== NOTIFICATION ROUTES ====================
// router.post('/fcm-token', protect, userController.updateFCMToken);
// router.delete('/fcm-token', protect, userController.removeFCMToken);

// // ==================== DASHBOARD STATS ====================
// router.get('/dashboard/stats', authorize(['super_admin', 'admin']), userController.getDashboardStats);
// router.get('/activity-log', authorize(['super_admin', 'admin']), userController.getUserActivityLog);

// module.exports = router;












// const express = require('express');
// const router = express.Router();
// const userController = require('../../controllers/user.controller');
// const { protect } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');

// // Debug: Check what we have
// console.log('User routes - protect type:', typeof protect);
// console.log('User routes - authorize type:', typeof authorize);

// // ==================== ALL ROUTES REQUIRE AUTHENTICATION ====================
// router.use(protect);

// // ==================== SPECIFIC ROUTES (NO PARAMETERS) - MUST COME FIRST ====================

// // Base CRUD routes
// router.get('/', authorize(['super_admin', 'admin', 'manager', 'hr']), userController.getUsers);
// router.post('/', authorize(['super_admin', 'admin', 'hr']), userController.createUser);

// // Export and Import routes
// router.get('/export', authorize(['super_admin', 'admin']), userController.exportUsers);
// router.post('/bulk-import', authorize(['super_admin', 'admin']), userController.bulkImportUsers);

// // ==================== ONLINE STATUS MANAGEMENT ROUTES ====================

// /**
//  * @route   GET /api/v1/users/online
//  * @desc    Get all online users
//  * @access  Private
//  */
// router.get('/online', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const onlineUsers = await User.find({
//       isUserOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isUserOnline lastSeen socketId')
//       .sort({ lastSeen: -1 });
    
//     res.json({ 
//       success: true, 
//       data: onlineUsers,
//       count: onlineUsers.length
//     });
//   } catch (error) {
//     console.error('Get online users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   GET /api/v1/users/online/count
//  * @desc    Get count of online users
//  * @access  Private
//  */
// router.get('/online/count', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const count = await User.countDocuments({ 
//       isUserOnline: true, 
//       status: 'active',
//       _id: { $ne: req.user._id }
//     });
    
//     res.json({ 
//       success: true, 
//       data: { count }
//     });
//   } catch (error) {
//     console.error('Get online users count error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   GET /api/v1/users/online/technicians
//  * @desc    Get online technicians
//  * @access  Private
//  */
// router.get('/online/technicians', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const onlineTechnicians = await User.find({
//       role: 'technician',
//       isUserOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isUserOnline lastSeen');
    
//     res.json({ 
//       success: true, 
//       data: onlineTechnicians,
//       count: onlineTechnicians.length
//     });
//   } catch (error) {
//     console.error('Get online technicians error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   GET /api/v1/users/online/managers
//  * @desc    Get online managers and admins
//  * @access  Private
//  */
// router.get('/online/managers', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const onlineManagers = await User.find({
//       role: { $in: ['manager', 'super_admin', 'admin'] },
//       isUserOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isUserOnline lastSeen');
    
//     res.json({ 
//       success: true, 
//       data: onlineManagers,
//       count: onlineManagers.length
//     });
//   } catch (error) {
//     console.error('Get online managers error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   POST /api/v1/users/register-socket
//  * @desc    Register socket ID for current user
//  * @access  Private
//  */
// router.post('/register-socket', protect, async (req, res) => {
//   try {
//     const { socketId } = req.body;
//     const userId = req.user._id;
    
//     if (!socketId) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Socket ID is required' 
//       });
//     }
    
//     const User = require('../../models/User.model');
//     await User.findByIdAndUpdate(userId, { 
//       socketId: socketId,
//       isUserOnline: true,
//       lastSeen: new Date()
//     });
    
//     console.log(`✅ Socket ID ${socketId} registered for user ${userId}`);
    
//     res.json({ 
//       success: true, 
//       message: 'Socket ID registered successfully',
//       data: { socketId }
//     });
//   } catch (error) {
//     console.error('Register socket error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   POST /api/v1/users/unregister-socket
//  * @desc    Unregister socket ID for current user
//  * @access  Private
//  */
// router.post('/unregister-socket', protect, async (req, res) => {
//   try {
//     const userId = req.user._id;
    
//     const User = require('../../models/User.model');
//     await User.findByIdAndUpdate(userId, { 
//       socketId: null, 
//       isUserOnline: false, 
//       lastSeen: new Date() 
//     });
    
//     console.log(`✅ Socket ID unregistered for user ${userId}`);
    
//     res.json({ 
//       success: true, 
//       message: 'Socket ID unregistered successfully'
//     });
//   } catch (error) {
//     console.error('Unregister socket error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   POST /api/v1/users/heartbeat
//  * @desc    Update user heartbeat (keep online status)
//  * @access  Private
//  */
// router.post('/heartbeat', protect, async (req, res) => {
//   try {
//     const userId = req.user._id;
    
//     const User = require('../../models/User.model');
//     await User.findByIdAndUpdate(userId, { 
//       lastSeen: new Date(),
//       isUserOnline: true
//     });
    
//     res.json({ 
//       success: true, 
//       message: 'Heartbeat updated',
//       timestamp: new Date()
//     });
//   } catch (error) {
//     console.error('Heartbeat error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   PUT /api/v1/users/online-status
//  * @desc    Update user online status
//  * @access  Private
//  */
// router.put('/online-status', protect, async (req, res) => {
//   try {
//     const { isOnline } = req.body;
//     const userId = req.user._id;
    
//     const User = require('../../models/User.model');
//     const user = await User.findByIdAndUpdate(
//       userId, 
//       { 
//         isUserOnline: isOnline !== undefined ? isOnline : false,
//         lastSeen: new Date()
//       },
//       { new: true }
//     ).select('_id isUserOnline lastSeen');
    
//     // Broadcast status change via socket if available
//     const io = req.app.get('io');
//     if (io) {
//       io.emit('user_status_change', {
//         userId: userId,
//         userName: `${req.user.firstName} ${req.user.lastName}`,
//         userRole: req.user.role,
//         status: isOnline ? 'online' : 'offline',
//         timestamp: new Date()
//       });
//     }
    
//     res.json({ 
//       success: true, 
//       data: {
//         isOnline: user.isUserOnline,
//         lastSeen: user.lastSeen
//       },
//       message: `Status updated to ${user.isUserOnline ? 'online' : 'offline'}`
//     });
//   } catch (error) {
//     console.error('Update online status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   POST /api/v1/users/update-status
//  * @desc    Update user status (alias for online-status)
//  * @access  Private
//  */
// router.post('/update-status', protect, async (req, res) => {
//   try {
//     const { isOnline } = req.body;
//     const userId = req.user._id;
    
//     const User = require('../../models/User.model');
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { 
//         isUserOnline: isOnline !== undefined ? isOnline : true,
//         lastSeen: new Date()
//       },
//       { new: true }
//     ).select('_id isUserOnline lastSeen');
    
//     res.json({ 
//       success: true, 
//       data: {
//         isOnline: user.isUserOnline,
//         lastSeen: user.lastSeen
//       },
//       message: `Status updated to ${user.isUserOnline ? 'online' : 'offline'}`
//     });
//   } catch (error) {
//     console.error('Update status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== CHAT PERMISSION ROUTES ====================

// /**
//  * @route   GET /api/v1/users/chat-enabled
//  * @desc    Get users with chat enabled
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/chat-enabled', authorize(['super_admin', 'admin']), userController.getChatEnabledUsers);

// /**
//  * @route   GET /api/v1/users/chat/permissions
//  * @desc    Get chat permission matrix
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/chat/permissions', authorize(['super_admin', 'admin']), (req, res) => {
//   const permissionMatrix = {
//     super_admin: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin'],
//       canCreateGroup: true,
//       canModifyPermissions: true
//     },
//     admin: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     manager: {
//       canChatWith: ['customer', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     supervisor: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     technician: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'admin'],
//       canCreateGroup: false,
//       canModifyPermissions: false
//     },
//     hr: {
//       canChatWith: ['employee', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     customer: {
//       canChatWith: ['technician', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: false,
//       canModifyPermissions: false
//     }
//   };
  
//   res.json({ success: true, data: permissionMatrix });
// });

// /**
//  * @route   GET /api/v1/users/chat/stats
//  * @desc    Get chat statistics
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/chat/stats', authorize(['super_admin', 'admin']), async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const totalUsers = await User.countDocuments({ status: 'active' });
//     const chatEnabledUsers = await User.countDocuments({ chatEnabled: true, status: 'active' });
//     const chatDisabledUsers = totalUsers - chatEnabledUsers;
    
//     const byRole = await User.aggregate([
//       { $match: { status: 'active' } },
//       { $group: {
//           _id: '$role',
//           total: { $sum: 1 },
//           chatEnabled: { $sum: { $cond: ['$chatEnabled', 1, 0] } }
//         }
//       }
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         totalUsers,
//         chatEnabledUsers,
//         chatDisabledUsers,
//         percentageEnabled: totalUsers ? ((chatEnabledUsers / totalUsers) * 100).toFixed(1) : 0,
//         byRole
//       }
//     });
//   } catch (error) {
//     console.error('Get chat stats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== BULK OPERATIONS ROUTES ====================

// /**
//  * @route   POST /api/v1/users/bulk-toggle-chat
//  * @desc    Bulk toggle chat enabled for multiple users
//  * @access  Private (Super Admin only)
//  */
// router.post('/bulk-toggle-chat', authorize(['super_admin']), userController.bulkToggleChatEnabled);

// /**
//  * @route   POST /api/v1/users/bulk/online-status
//  * @desc    Get online status for multiple users
//  * @access  Private
//  */
// router.post('/bulk/online-status', protect, async (req, res) => {
//   try {
//     const { userIds } = req.body;
    
//     if (!userIds || !Array.isArray(userIds)) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Please provide an array of user IDs' 
//       });
//     }
    
//     const User = require('../../models/User.model');
//     const users = await User.find({
//       _id: { $in: userIds },
//       status: 'active'
//     }).select('_id isUserOnline lastSeen');
    
//     const statusMap = {};
//     users.forEach(user => {
//       statusMap[user._id] = {
//         isOnline: user.isUserOnline,
//         lastSeen: user.lastSeen
//       };
//     });
    
//     res.json({ 
//       success: true, 
//       data: statusMap
//     });
//   } catch (error) {
//     console.error('Bulk online status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== ACTIVITY ROUTES ====================

// /**
//  * @route   GET /api/v1/users/activity/recent
//  * @desc    Get recently active users
//  * @access  Private (Admin, Manager, Super Admin)
//  */
// router.get('/activity/recent', authorize(['admin', 'manager', 'super_admin']), async (req, res) => {
//   try {
//     const { minutes = 5 } = req.query;
//     const cutoffTime = new Date(Date.now() - (minutes * 60 * 1000));
    
//     const User = require('../../models/User.model');
//     const activeUsers = await User.find({
//       lastSeen: { $gte: cutoffTime },
//       status: 'active'
//     }).select('_id firstName lastName email role isUserOnline lastSeen lastLoginAt')
//       .sort({ lastSeen: -1 });
    
//     res.json({ 
//       success: true, 
//       data: activeUsers,
//       count: activeUsers.length,
//       timeWindow: `${minutes} minutes`
//     });
//   } catch (error) {
//     console.error('Get recent activity error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   GET /api/v1/users/activity/inactive
//  * @desc    Get inactive users
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/activity/inactive', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     const { days = 7 } = req.query;
//     const cutoffTime = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
    
//     const User = require('../../models/User.model');
//     const inactiveUsers = await User.find({
//       $or: [
//         { lastSeen: { $lt: cutoffTime } },
//         { lastLoginAt: { $lt: cutoffTime } }
//       ],
//       status: 'active',
//       role: { $ne: 'super_admin' }
//     }).select('_id firstName lastName email role lastSeen lastLoginAt')
//       .sort({ lastSeen: 1 });
    
//     res.json({ 
//       success: true, 
//       data: inactiveUsers,
//       count: inactiveUsers.length,
//       inactiveSince: `${days} days`
//     });
//   } catch (error) {
//     console.error('Get inactive users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== SOCKET MANAGEMENT ROUTES ====================

// /**
//  * @route   POST /api/v1/users/socket/register
//  * @desc    Register socket ID (alias for register-socket)
//  * @access  Private
//  */
// router.post('/socket/register', protect, async (req, res) => {
//   try {
//     const { socketId } = req.body;
    
//     if (!socketId) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Socket ID is required' 
//       });
//     }
    
//     const User = require('../../models/User.model');
//     await User.findByIdAndUpdate(req.user._id, {
//       socketId: socketId,
//       isUserOnline: true,
//       lastSeen: new Date()
//     });
    
//     res.json({ 
//       success: true, 
//       message: 'Socket ID registered successfully'
//     });
//   } catch (error) {
//     console.error('Register socket error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   DELETE /api/v1/users/socket/unregister
//  * @desc    Unregister socket ID
//  * @access  Private
//  */
// router.delete('/socket/unregister', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     await User.findByIdAndUpdate(req.user._id, {
//       socketId: null,
//       isUserOnline: false,
//       lastSeen: new Date()
//     });
    
//     res.json({ 
//       success: true, 
//       message: 'Socket ID unregistered successfully'
//     });
//   } catch (error) {
//     console.error('Unregister socket error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== PARAMETER ROUTES (WITH :id) - MUST COME LAST ====================

// /**
//  * @route   GET /api/v1/users/:id
//  * @desc    Get user by ID
//  * @access  Private (Admin, Manager)
//  */
// router.get('/:id', authorize(['super_admin', 'admin', 'manager']), userController.getUserById);

// /**
//  * @route   PUT /api/v1/users/:id
//  * @desc    Update user
//  * @access  Private (Admin, Manager)
//  */
// router.put('/:id', authorize(['super_admin', 'admin', 'manager']), userController.updateUser);

// /**
//  * @route   DELETE /api/v1/users/:id
//  * @desc    Delete user
//  * @access  Private (Admin, Super Admin)
//  */
// router.delete('/:id', authorize(['super_admin', 'admin']), userController.deleteUser);

// /**
//  * @route   GET /api/v1/users/:id/status
//  * @desc    Get user online status by ID
//  * @access  Private
//  */
// router.get('/:id/status', protect, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const User = require('../../models/User.model');
    
//     const user = await User.findById(id)
//       .select('_id firstName lastName email role isUserOnline lastSeen socketId');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: {
//         userId: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         isOnline: user.isUserOnline,
//         lastSeen: user.lastSeen
//       }
//     });
//   } catch (error) {
//     console.error('Get user status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   PUT /api/v1/users/:id/toggle-chat
//  * @desc    Toggle chat enabled for specific user
//  * @access  Private (Super Admin only)
//  */
// router.put('/:id/toggle-chat', authorize(['super_admin']), userController.toggleChatEnabled);

// /**
//  * @route   PUT /api/v1/users/:id/activate
//  * @desc    Activate user
//  * @access  Private (Admin, Super Admin)
//  */
// router.put('/:id/activate', authorize(['super_admin', 'admin']), userController.activateUser);

// /**
//  * @route   PUT /api/v1/users/:id/deactivate
//  * @desc    Deactivate user
//  * @access  Private (Admin, Super Admin)
//  */
// router.put('/:id/deactivate', authorize(['super_admin', 'admin']), userController.deactivateUser);

// /**
//  * @route   POST /api/v1/users/:id/reset-password
//  * @desc    Reset user password
//  * @access  Private (Admin, Super Admin)
//  */
// router.post('/:id/reset-password', authorize(['super_admin', 'admin']), userController.resetUserPassword);

// /**
//  * @route   POST /api/v1/users/:id/documents
//  * @desc    Upload user document
//  * @access  Private (Admin, Super Admin)
//  */
// router.post('/:id/documents', authorize(['super_admin', 'admin']), userController.uploadUserDocument);

// /**
//  * @route   GET /api/v1/users/:id/documents
//  * @desc    Get user documents
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/:id/documents', authorize(['super_admin', 'admin']), userController.getUserDocuments);

// /**
//  * @route   DELETE /api/v1/users/:id/documents/:documentId
//  * @desc    Delete user document
//  * @access  Private (Admin, Super Admin)
//  */
// router.delete('/:id/documents/:documentId', authorize(['super_admin', 'admin']), userController.deleteUserDocument);

// /**
//  * @route   GET /api/v1/users/:id/permissions
//  * @desc    Get user permissions
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/:id/permissions', authorize(['super_admin', 'admin']), userController.getUserPermissions);

// /**
//  * @route   PUT /api/v1/users/:id/permissions
//  * @desc    Update user permissions
//  * @access  Private (Super Admin only)
//  */
// router.put('/:id/permissions', authorize(['super_admin']), userController.updateUserPermissions);

// // ==================== PROFILE ROUTES ====================

// /**
//  * @route   PUT /api/v1/users/profile
//  * @desc    Update own profile
//  * @access  Private
//  */
// router.put('/profile', protect, userController.updateOwnProfile);

// /**
//  * @route   PUT /api/v1/users/change-password
//  * @desc    Change own password
//  * @access  Private
//  */
// router.put('/change-password', protect, userController.changeOwnPassword);

// /**
//  * @route   POST /api/v1/users/profile/image
//  * @desc    Upload profile image
//  * @access  Private
//  */
// router.post('/profile/image', protect, userController.uploadProfileImage);

// /**
//  * @route   DELETE /api/v1/users/profile/image
//  * @desc    Remove profile image
//  * @access  Private
//  */
// router.delete('/profile/image', protect, userController.removeProfileImage);

// // ==================== TEAM MANAGEMENT ROUTES ====================

// /**
//  * @route   GET /api/v1/users/technicians
//  * @desc    Get all technicians
//  * @access  Private
//  */
// router.get('/technicians', protect, userController.getTechnicians);

// /**
//  * @route   GET /api/v1/users/team
//  * @desc    Get team members (for managers/supervisors)
//  * @access  Private
//  */
// router.get('/team', protect, userController.getTeamMembers);

// /**
//  * @route   GET /api/v1/users/hierarchy
//  * @desc    Get reporting hierarchy
//  * @access  Private
//  */
// router.get('/hierarchy', protect, userController.getReportingHierarchy);

// // ==================== NOTIFICATION ROUTES ====================

// /**
//  * @route   POST /api/v1/users/fcm-token
//  * @desc    Update FCM token for push notifications
//  * @access  Private
//  */
// router.post('/fcm-token', protect, userController.updateFCMToken);

// /**
//  * @route   DELETE /api/v1/users/fcm-token
//  * @desc    Remove FCM token
//  * @access  Private
//  */
// router.delete('/fcm-token', protect, userController.removeFCMToken);

// // ==================== DASHBOARD STATS ====================

// /**
//  * @route   GET /api/v1/users/dashboard/stats
//  * @desc    Get user dashboard statistics
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/dashboard/stats', authorize(['super_admin', 'admin']), userController.getDashboardStats);

// /**
//  * @route   GET /api/v1/users/activity-log
//  * @desc    Get user activity log
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/activity-log', authorize(['super_admin', 'admin']), userController.getUserActivityLog);

// module.exports = router;











// const express = require('express');
// const router = express.Router();
// const userController = require('../../controllers/user.controller');
// const { protect } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');

// // Debug: Check what we have
// console.log('User routes - protect type:', typeof protect);
// console.log('User routes - authorize type:', typeof authorize);

// // ==================== ALL ROUTES REQUIRE AUTHENTICATION ====================
// router.use(protect);

// // ==================== SPECIFIC ROUTES (NO PARAMETERS) - MUST COME FIRST ====================

// // Base CRUD routes
// router.get('/', authorize(['super_admin', 'admin', 'manager', 'hr']), userController.getUsers);
// router.post('/', authorize(['super_admin', 'admin', 'hr']), userController.createUser);

// // Export and Import routes
// router.get('/export', authorize(['super_admin', 'admin']), userController.exportUsers);
// router.post('/bulk-import', authorize(['super_admin', 'admin']), userController.bulkImportUsers);

// // ==================== ONLINE STATUS MANAGEMENT ROUTES ====================

// /**
//  * 🔴 FIXED: GET /api/v1/users/online
//  * @desc    Get all online users (for chat module)
//  * @access  Private
//  * This route returns properly formatted user data for online status display
//  */
// router.get('/online', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const onlineUsers = await User.find({
//       isUserOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isUserOnline lastSeen socketId')
//       .sort({ lastSeen: -1 });
    
//     // Format the response for chat module
//     const formattedUsers = onlineUsers.map(user => ({
//       _id: user._id,
//       userId: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       role: user.role,
//       profileImage: user.profileImage,
//       isOnline: user.isUserOnline,
//       lastSeen: user.lastSeen,
//       name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
//       userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
//     }));
    
//     res.json({ 
//       success: true, 
//       data: formattedUsers,
//       count: formattedUsers.length
//     });
//   } catch (error) {
//     console.error('Get online users error:', error);
//     // Return empty array instead of error to prevent UI breaking
//     res.status(200).json({ 
//       success: true, 
//       data: [],
//       count: 0
//     });
//   }
// });

// /**
//  * @route   GET /api/v1/users/online/count
//  * @desc    Get count of online users
//  * @access  Private
//  */
// router.get('/online/count', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const count = await User.countDocuments({ 
//       isUserOnline: true, 
//       status: 'active',
//       _id: { $ne: req.user._id }
//     });
    
//     res.json({ 
//       success: true, 
//       data: { count }
//     });
//   } catch (error) {
//     console.error('Get online users count error:', error);
//     res.status(200).json({ success: true, data: { count: 0 } });
//   }
// });

// /**
//  * @route   GET /api/v1/users/online/technicians
//  * @desc    Get online technicians
//  * @access  Private
//  */
// router.get('/online/technicians', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const onlineTechnicians = await User.find({
//       role: 'technician',
//       isUserOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isUserOnline lastSeen');
    
//     res.json({ 
//       success: true, 
//       data: onlineTechnicians,
//       count: onlineTechnicians.length
//     });
//   } catch (error) {
//     console.error('Get online technicians error:', error);
//     res.status(200).json({ success: true, data: [], count: 0 });
//   }
// });

// /**
//  * @route   GET /api/v1/users/online/managers
//  * @desc    Get online managers and admins
//  * @access  Private
//  */
// router.get('/online/managers', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const onlineManagers = await User.find({
//       role: { $in: ['manager', 'super_admin', 'admin'] },
//       isUserOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isUserOnline lastSeen');
    
//     res.json({ 
//       success: true, 
//       data: onlineManagers,
//       count: onlineManagers.length
//     });
//   } catch (error) {
//     console.error('Get online managers error:', error);
//     res.status(200).json({ success: true, data: [], count: 0 });
//   }
// });

// /**
//  * @route   POST /api/v1/users/register-socket
//  * @desc    Register socket ID for current user
//  * @access  Private
//  */
// router.post('/register-socket', protect, async (req, res) => {
//   try {
//     const { socketId } = req.body;
//     const userId = req.user._id;
    
//     if (!socketId) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Socket ID is required' 
//       });
//     }
    
//     const User = require('../../models/User.model');
//     await User.findByIdAndUpdate(userId, { 
//       socketId: socketId,
//       isUserOnline: true,
//       lastSeen: new Date()
//     });
    
//     console.log(`✅ Socket ID ${socketId} registered for user ${userId}`);
    
//     res.json({ 
//       success: true, 
//       message: 'Socket ID registered successfully',
//       data: { socketId }
//     });
//   } catch (error) {
//     console.error('Register socket error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   POST /api/v1/users/unregister-socket
//  * @desc    Unregister socket ID for current user
//  * @access  Private
//  */
// router.post('/unregister-socket', protect, async (req, res) => {
//   try {
//     const userId = req.user._id;
    
//     const User = require('../../models/User.model');
//     await User.findByIdAndUpdate(userId, { 
//       socketId: null, 
//       isUserOnline: false, 
//       lastSeen: new Date() 
//     });
    
//     console.log(`✅ Socket ID unregistered for user ${userId}`);
    
//     res.json({ 
//       success: true, 
//       message: 'Socket ID unregistered successfully'
//     });
//   } catch (error) {
//     console.error('Unregister socket error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   POST /api/v1/users/heartbeat
//  * @desc    Update user heartbeat (keep online status)
//  * @access  Private
//  */
// router.post('/heartbeat', protect, async (req, res) => {
//   try {
//     const userId = req.user._id;
    
//     const User = require('../../models/User.model');
//     await User.findByIdAndUpdate(userId, { 
//       lastSeen: new Date(),
//       isUserOnline: true
//     });
    
//     res.json({ 
//       success: true, 
//       message: 'Heartbeat updated',
//       timestamp: new Date()
//     });
//   } catch (error) {
//     console.error('Heartbeat error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   PUT /api/v1/users/online-status
//  * @desc    Update user online status
//  * @access  Private
//  */
// router.put('/online-status', protect, async (req, res) => {
//   try {
//     const { isOnline } = req.body;
//     const userId = req.user._id;
    
//     const User = require('../../models/User.model');
//     const user = await User.findByIdAndUpdate(
//       userId, 
//       { 
//         isUserOnline: isOnline !== undefined ? isOnline : false,
//         lastSeen: new Date()
//       },
//       { new: true }
//     ).select('_id isUserOnline lastSeen');
    
//     // Broadcast status change via socket if available
//     const io = req.app.get('io');
//     if (io) {
//       io.emit('user_status_change', {
//         userId: userId,
//         userName: `${req.user.firstName} ${req.user.lastName}`,
//         userRole: req.user.role,
//         status: isOnline ? 'online' : 'offline',
//         timestamp: new Date()
//       });
//     }
    
//     res.json({ 
//       success: true, 
//       data: {
//         isOnline: user.isUserOnline,
//         lastSeen: user.lastSeen
//       },
//       message: `Status updated to ${user.isUserOnline ? 'online' : 'offline'}`
//     });
//   } catch (error) {
//     console.error('Update online status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   POST /api/v1/users/update-status
//  * @desc    Update user status (alias for online-status)
//  * @access  Private
//  */
// router.post('/update-status', protect, async (req, res) => {
//   try {
//     const { isOnline } = req.body;
//     const userId = req.user._id;
    
//     const User = require('../../models/User.model');
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { 
//         isUserOnline: isOnline !== undefined ? isOnline : true,
//         lastSeen: new Date()
//       },
//       { new: true }
//     ).select('_id isUserOnline lastSeen');
    
//     res.json({ 
//       success: true, 
//       data: {
//         isOnline: user.isUserOnline,
//         lastSeen: user.lastSeen
//       },
//       message: `Status updated to ${user.isUserOnline ? 'online' : 'offline'}`
//     });
//   } catch (error) {
//     console.error('Update status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== CHAT PERMISSION ROUTES ====================

// /**
//  * @route   GET /api/v1/users/chat-enabled
//  * @desc    Get users with chat enabled
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/chat-enabled', authorize(['super_admin', 'admin']), userController.getChatEnabledUsers);

// /**
//  * @route   GET /api/v1/users/chat/permissions
//  * @desc    Get chat permission matrix
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/chat/permissions', authorize(['super_admin', 'admin']), (req, res) => {
//   const permissionMatrix = {
//     super_admin: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin'],
//       canCreateGroup: true,
//       canModifyPermissions: true
//     },
//     admin: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     manager: {
//       canChatWith: ['customer', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     supervisor: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     technician: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'admin'],
//       canCreateGroup: false,
//       canModifyPermissions: false
//     },
//     hr: {
//       canChatWith: ['employee', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     customer: {
//       canChatWith: ['technician', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: false,
//       canModifyPermissions: false
//     }
//   };
  
//   res.json({ success: true, data: permissionMatrix });
// });

// /**
//  * @route   GET /api/v1/users/chat/stats
//  * @desc    Get chat statistics
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/chat/stats', authorize(['super_admin', 'admin']), async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const totalUsers = await User.countDocuments({ status: 'active' });
//     const chatEnabledUsers = await User.countDocuments({ chatEnabled: true, status: 'active' });
//     const chatDisabledUsers = totalUsers - chatEnabledUsers;
    
//     const byRole = await User.aggregate([
//       { $match: { status: 'active' } },
//       { $group: {
//           _id: '$role',
//           total: { $sum: 1 },
//           chatEnabled: { $sum: { $cond: ['$chatEnabled', 1, 0] } }
//         }
//       }
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         totalUsers,
//         chatEnabledUsers,
//         chatDisabledUsers,
//         percentageEnabled: totalUsers ? ((chatEnabledUsers / totalUsers) * 100).toFixed(1) : 0,
//         byRole
//       }
//     });
//   } catch (error) {
//     console.error('Get chat stats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== BULK OPERATIONS ROUTES ====================

// /**
//  * @route   POST /api/v1/users/bulk-toggle-chat
//  * @desc    Bulk toggle chat enabled for multiple users
//  * @access  Private (Super Admin only)
//  */
// router.post('/bulk-toggle-chat', authorize(['super_admin']), userController.bulkToggleChatEnabled);

// /**
//  * @route   POST /api/v1/users/bulk/online-status
//  * @desc    Get online status for multiple users
//  * @access  Private
//  */
// router.post('/bulk/online-status', protect, async (req, res) => {
//   try {
//     const { userIds } = req.body;
    
//     if (!userIds || !Array.isArray(userIds)) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Please provide an array of user IDs' 
//       });
//     }
    
//     const User = require('../../models/User.model');
//     const users = await User.find({
//       _id: { $in: userIds },
//       status: 'active'
//     }).select('_id isUserOnline lastSeen');
    
//     const statusMap = {};
//     users.forEach(user => {
//       statusMap[user._id] = {
//         isOnline: user.isUserOnline,
//         lastSeen: user.lastSeen
//       };
//     });
    
//     res.json({ 
//       success: true, 
//       data: statusMap
//     });
//   } catch (error) {
//     console.error('Bulk online status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== ACTIVITY ROUTES ====================

// /**
//  * @route   GET /api/v1/users/activity/recent
//  * @desc    Get recently active users
//  * @access  Private (Admin, Manager, Super Admin)
//  */
// router.get('/activity/recent', authorize(['admin', 'manager', 'super_admin']), async (req, res) => {
//   try {
//     const { minutes = 5 } = req.query;
//     const cutoffTime = new Date(Date.now() - (minutes * 60 * 1000));
    
//     const User = require('../../models/User.model');
//     const activeUsers = await User.find({
//       lastSeen: { $gte: cutoffTime },
//       status: 'active'
//     }).select('_id firstName lastName email role isUserOnline lastSeen lastLoginAt')
//       .sort({ lastSeen: -1 });
    
//     res.json({ 
//       success: true, 
//       data: activeUsers,
//       count: activeUsers.length,
//       timeWindow: `${minutes} minutes`
//     });
//   } catch (error) {
//     console.error('Get recent activity error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   GET /api/v1/users/activity/inactive
//  * @desc    Get inactive users
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/activity/inactive', authorize(['admin', 'super_admin']), async (req, res) => {
//   try {
//     const { days = 7 } = req.query;
//     const cutoffTime = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
    
//     const User = require('../../models/User.model');
//     const inactiveUsers = await User.find({
//       $or: [
//         { lastSeen: { $lt: cutoffTime } },
//         { lastLoginAt: { $lt: cutoffTime } }
//       ],
//       status: 'active',
//       role: { $ne: 'super_admin' }
//     }).select('_id firstName lastName email role lastSeen lastLoginAt')
//       .sort({ lastSeen: 1 });
    
//     res.json({ 
//       success: true, 
//       data: inactiveUsers,
//       count: inactiveUsers.length,
//       inactiveSince: `${days} days`
//     });
//   } catch (error) {
//     console.error('Get inactive users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== SOCKET MANAGEMENT ROUTES ====================

// /**
//  * @route   POST /api/v1/users/socket/register
//  * @desc    Register socket ID (alias for register-socket)
//  * @access  Private
//  */
// router.post('/socket/register', protect, async (req, res) => {
//   try {
//     const { socketId } = req.body;
    
//     if (!socketId) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Socket ID is required' 
//       });
//     }
    
//     const User = require('../../models/User.model');
//     await User.findByIdAndUpdate(req.user._id, {
//       socketId: socketId,
//       isUserOnline: true,
//       lastSeen: new Date()
//     });
    
//     res.json({ 
//       success: true, 
//       message: 'Socket ID registered successfully'
//     });
//   } catch (error) {
//     console.error('Register socket error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   DELETE /api/v1/users/socket/unregister
//  * @desc    Unregister socket ID
//  * @access  Private
//  */
// router.delete('/socket/unregister', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     await User.findByIdAndUpdate(req.user._id, {
//       socketId: null,
//       isUserOnline: false,
//       lastSeen: new Date()
//     });
    
//     res.json({ 
//       success: true, 
//       message: 'Socket ID unregistered successfully'
//     });
//   } catch (error) {
//     console.error('Unregister socket error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ==================== PARAMETER ROUTES (WITH :id) - MUST COME LAST ====================

// /**
//  * @route   GET /api/v1/users/:id
//  * @desc    Get user by ID
//  * @access  Private (Admin, Manager)
//  */
// router.get('/:id', authorize(['super_admin', 'admin', 'manager']), userController.getUserById);

// /**
//  * @route   PUT /api/v1/users/:id
//  * @desc    Update user
//  * @access  Private (Admin, Manager)
//  */
// router.put('/:id', authorize(['super_admin', 'admin', 'manager']), userController.updateUser);

// /**
//  * @route   DELETE /api/v1/users/:id
//  * @desc    Delete user
//  * @access  Private (Admin, Super Admin)
//  */
// router.delete('/:id', authorize(['super_admin', 'admin']), userController.deleteUser);

// /**
//  * @route   GET /api/v1/users/:id/status
//  * @desc    Get user online status by ID
//  * @access  Private
//  */
// router.get('/:id/status', protect, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const User = require('../../models/User.model');
    
//     const user = await User.findById(id)
//       .select('_id firstName lastName email role isUserOnline lastSeen socketId');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: {
//         userId: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         isOnline: user.isUserOnline,
//         lastSeen: user.lastSeen
//       }
//     });
//   } catch (error) {
//     console.error('Get user status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   PUT /api/v1/users/:id/toggle-chat
//  * @desc    Toggle chat enabled for specific user
//  * @access  Private (Super Admin only)
//  */
// router.put('/:id/toggle-chat', authorize(['super_admin']), userController.toggleChatEnabled);

// /**
//  * @route   PUT /api/v1/users/:id/activate
//  * @desc    Activate user
//  * @access  Private (Admin, Super Admin)
//  */
// router.put('/:id/activate', authorize(['super_admin', 'admin']), userController.activateUser);

// /**
//  * @route   PUT /api/v1/users/:id/deactivate
//  * @desc    Deactivate user
//  * @access  Private (Admin, Super Admin)
//  */
// router.put('/:id/deactivate', authorize(['super_admin', 'admin']), userController.deactivateUser);

// /**
//  * @route   POST /api/v1/users/:id/reset-password
//  * @desc    Reset user password
//  * @access  Private (Admin, Super Admin)
//  */
// router.post('/:id/reset-password', authorize(['super_admin', 'admin']), userController.resetUserPassword);

// /**
//  * @route   POST /api/v1/users/:id/documents
//  * @desc    Upload user document
//  * @access  Private (Admin, Super Admin)
//  */
// router.post('/:id/documents', authorize(['super_admin', 'admin']), userController.uploadUserDocument);

// /**
//  * @route   GET /api/v1/users/:id/documents
//  * @desc    Get user documents
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/:id/documents', authorize(['super_admin', 'admin']), userController.getUserDocuments);

// /**
//  * @route   DELETE /api/v1/users/:id/documents/:documentId
//  * @desc    Delete user document
//  * @access  Private (Admin, Super Admin)
//  */
// router.delete('/:id/documents/:documentId', authorize(['super_admin', 'admin']), userController.deleteUserDocument);

// /**
//  * @route   GET /api/v1/users/:id/permissions
//  * @desc    Get user permissions
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/:id/permissions', authorize(['super_admin', 'admin']), userController.getUserPermissions);

// /**
//  * @route   PUT /api/v1/users/:id/permissions
//  * @desc    Update user permissions
//  * @access  Private (Super Admin only)
//  */
// router.put('/:id/permissions', authorize(['super_admin']), userController.updateUserPermissions);

// // ==================== PROFILE ROUTES ====================

// /**
//  * @route   PUT /api/v1/users/profile
//  * @desc    Update own profile
//  * @access  Private
//  */
// router.put('/profile', protect, userController.updateOwnProfile);

// /**
//  * @route   PUT /api/v1/users/change-password
//  * @desc    Change own password
//  * @access  Private
//  */
// router.put('/change-password', protect, userController.changeOwnPassword);

// /**
//  * @route   POST /api/v1/users/profile/image
//  * @desc    Upload profile image
//  * @access  Private
//  */
// router.post('/profile/image', protect, userController.uploadProfileImage);

// /**
//  * @route   DELETE /api/v1/users/profile/image
//  * @desc    Remove profile image
//  * @access  Private
//  */
// router.delete('/profile/image', protect, userController.removeProfileImage);

// // ==================== TEAM MANAGEMENT ROUTES ====================

// /**
//  * @route   GET /api/v1/users/technicians
//  * @desc    Get all technicians
//  * @access  Private
//  */
// router.get('/technicians', protect, userController.getTechnicians);

// /**
//  * @route   GET /api/v1/users/team
//  * @desc    Get team members (for managers/supervisors)
//  * @access  Private
//  */
// router.get('/team', protect, userController.getTeamMembers);

// /**
//  * @route   GET /api/v1/users/hierarchy
//  * @desc    Get reporting hierarchy
//  * @access  Private
//  */
// router.get('/hierarchy', protect, userController.getReportingHierarchy);

// // ==================== NOTIFICATION ROUTES ====================

// /**
//  * @route   POST /api/v1/users/fcm-token
//  * @desc    Update FCM token for push notifications
//  * @access  Private
//  */
// router.post('/fcm-token', protect, userController.updateFCMToken);

// /**
//  * @route   DELETE /api/v1/users/fcm-token
//  * @desc    Remove FCM token
//  * @access  Private
//  */
// router.delete('/fcm-token', protect, userController.removeFCMToken);

// // ==================== DASHBOARD STATS ====================

// /**
//  * @route   GET /api/v1/users/dashboard/stats
//  * @desc    Get user dashboard statistics
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/dashboard/stats', authorize(['super_admin', 'admin']), userController.getDashboardStats);

// /**
//  * @route   GET /api/v1/users/activity-log
//  * @desc    Get user activity log
//  * @access  Private (Admin, Super Admin)
//  */
// router.get('/activity-log', authorize(['super_admin', 'admin']), userController.getUserActivityLog);

// module.exports = router;














const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

// Debug: Check what we have
console.log('User routes - protect type:', typeof protect);
console.log('User routes - authorize type:', typeof authorize);

// ==================== ALL ROUTES REQUIRE AUTHENTICATION ====================
router.use(protect);

// ==================== SPECIFIC ROUTES (NO PARAMETERS) - MUST COME FIRST ====================

// Base CRUD routes
router.get('/', authorize(['super_admin', 'admin', 'manager', 'hr']), userController.getUsers);
router.post('/', authorize(['super_admin', 'admin', 'hr']), userController.createUser);

// Export and Import routes
router.get('/export', authorize(['super_admin', 'admin']), userController.exportUsers);
router.post('/bulk-import', authorize(['super_admin', 'admin']), userController.bulkImportUsers);

// ==================== ONLINE STATUS MANAGEMENT ROUTES ====================

/**
 * 🔴 FIXED: GET /api/v1/users/online
 * @desc    Get all online users (for chat module)
 * @access  Private
 * This route returns properly formatted user data for online status display
 */
router.get('/online', protect, async (req, res) => {
  try {
    const User = require('../../models/User.model');
    const onlineUsers = await User.find({
      isUserOnline: true,
      status: 'active',
      _id: { $ne: req.user._id }
    }).select('_id firstName lastName email role profileImage isUserOnline lastSeen socketId')
      .sort({ lastSeen: -1 });
    
    // 🔴 FIX: Format the response for chat module with multiple name formats
    const formattedUsers = onlineUsers.map(user => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      const displayName = fullName || user.email || 'User';
      
      return {
        _id: user._id,
        userId: user._id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'user',
        profileImage: user.profileImage,
        isOnline: user.isUserOnline,
        lastSeen: user.lastSeen,
        socketId: user.socketId,
        // Multiple name formats for different UI components
        name: displayName,
        userName: displayName,
        fullName: fullName,
        displayName: displayName
      };
    });
    
    console.log(`📡 Online users API: Returning ${formattedUsers.length} online users`);
    
    res.json({ 
      success: true, 
      data: formattedUsers,
      count: formattedUsers.length
    });
  } catch (error) {
    console.error('Get online users error:', error);
    // Return empty array instead of error to prevent UI breaking
    res.status(200).json({ 
      success: true, 
      data: [],
      count: 0
    });
  }
});

/**
 * @route   GET /api/v1/users/online/count
 * @desc    Get count of online users
 * @access  Private
 */
router.get('/online/count', protect, async (req, res) => {
  try {
    const User = require('../../models/User.model');
    const count = await User.countDocuments({ 
      isUserOnline: true, 
      status: 'active',
      _id: { $ne: req.user._id }
    });
    
    res.json({ 
      success: true, 
      data: { count }
    });
  } catch (error) {
    console.error('Get online users count error:', error);
    res.status(200).json({ success: true, data: { count: 0 } });
  }
});

/**
 * @route   GET /api/v1/users/online/technicians
 * @desc    Get online technicians
 * @access  Private
 */
router.get('/online/technicians', protect, async (req, res) => {
  try {
    const User = require('../../models/User.model');
    const onlineTechnicians = await User.find({
      role: 'technician',
      isUserOnline: true,
      status: 'active',
      _id: { $ne: req.user._id }
    }).select('_id firstName lastName email role profileImage isUserOnline lastSeen');
    
    const formattedUsers = onlineTechnicians.map(user => ({
      _id: user._id,
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Technician',
      isOnline: user.isUserOnline,
      lastSeen: user.lastSeen
    }));
    
    res.json({ 
      success: true, 
      data: formattedUsers,
      count: formattedUsers.length
    });
  } catch (error) {
    console.error('Get online technicians error:', error);
    res.status(200).json({ success: true, data: [], count: 0 });
  }
});

/**
 * @route   GET /api/v1/users/online/managers
 * @desc    Get online managers and admins
 * @access  Private
 */
router.get('/online/managers', protect, async (req, res) => {
  try {
    const User = require('../../models/User.model');
    const onlineManagers = await User.find({
      role: { $in: ['manager', 'super_admin', 'admin'] },
      isUserOnline: true,
      status: 'active',
      _id: { $ne: req.user._id }
    }).select('_id firstName lastName email role profileImage isUserOnline lastSeen');
    
    const formattedUsers = onlineManagers.map(user => ({
      _id: user._id,
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Manager',
      isOnline: user.isUserOnline,
      lastSeen: user.lastSeen
    }));
    
    res.json({ 
      success: true, 
      data: formattedUsers,
      count: formattedUsers.length
    });
  } catch (error) {
    console.error('Get online managers error:', error);
    res.status(200).json({ success: true, data: [], count: 0 });
  }
});

/**
 * @route   POST /api/v1/users/register-socket
 * @desc    Register socket ID for current user
 * @access  Private
 */
router.post('/register-socket', protect, async (req, res) => {
  try {
    const { socketId } = req.body;
    const userId = req.user._id;
    
    if (!socketId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Socket ID is required' 
      });
    }
    
    const User = require('../../models/User.model');
    await User.findByIdAndUpdate(userId, { 
      socketId: socketId,
      isUserOnline: true,
      lastSeen: new Date()
    });
    
    console.log(`✅ Socket ID ${socketId} registered for user ${userId}`);
    
    res.json({ 
      success: true, 
      message: 'Socket ID registered successfully',
      data: { socketId }
    });
  } catch (error) {
    console.error('Register socket error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/v1/users/unregister-socket
 * @desc    Unregister socket ID for current user
 * @access  Private
 */
router.post('/unregister-socket', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const User = require('../../models/User.model');
    await User.findByIdAndUpdate(userId, { 
      socketId: null, 
      isUserOnline: false, 
      lastSeen: new Date() 
    });
    
    console.log(`✅ Socket ID unregistered for user ${userId}`);
    
    res.json({ 
      success: true, 
      message: 'Socket ID unregistered successfully'
    });
  } catch (error) {
    console.error('Unregister socket error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/v1/users/heartbeat
 * @desc    Update user heartbeat (keep online status)
 * @access  Private
 */
router.post('/heartbeat', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const User = require('../../models/User.model');
    await User.findByIdAndUpdate(userId, { 
      lastSeen: new Date(),
      isUserOnline: true
    });
    
    res.json({ 
      success: true, 
      message: 'Heartbeat updated',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Heartbeat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   PUT /api/v1/users/online-status
 * @desc    Update user online status
 * @access  Private
 */
router.put('/online-status', protect, async (req, res) => {
  try {
    const { isOnline } = req.body;
    const userId = req.user._id;
    
    const User = require('../../models/User.model');
    const user = await User.findByIdAndUpdate(
      userId, 
      { 
        isUserOnline: isOnline !== undefined ? isOnline : false,
        lastSeen: new Date()
      },
      { new: true }
    ).select('_id isUserOnline lastSeen');
    
    // Broadcast status change via socket if available
    const io = req.app.get('io');
    if (io) {
      io.emit('user_status_change', {
        userId: userId,
        userName: `${req.user.firstName} ${req.user.lastName}`.trim() || req.user.email,
        userRole: req.user.role,
        status: isOnline ? 'online' : 'offline',
        timestamp: new Date()
      });
    }
    
    res.json({ 
      success: true, 
      data: {
        isOnline: user.isUserOnline,
        lastSeen: user.lastSeen
      },
      message: `Status updated to ${user.isUserOnline ? 'online' : 'offline'}`
    });
  } catch (error) {
    console.error('Update online status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/v1/users/update-status
 * @desc    Update user status (alias for online-status)
 * @access  Private
 */
router.post('/update-status', protect, async (req, res) => {
  try {
    const { isOnline } = req.body;
    const userId = req.user._id;
    
    const User = require('../../models/User.model');
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        isUserOnline: isOnline !== undefined ? isOnline : true,
        lastSeen: new Date()
      },
      { new: true }
    ).select('_id isUserOnline lastSeen');
    
    res.json({ 
      success: true, 
      data: {
        isOnline: user.isUserOnline,
        lastSeen: user.lastSeen
      },
      message: `Status updated to ${user.isUserOnline ? 'online' : 'offline'}`
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== CHAT PERMISSION ROUTES ====================

/**
 * @route   GET /api/v1/users/chat-enabled
 * @desc    Get users with chat enabled
 * @access  Private (Admin, Super Admin)
 */
router.get('/chat-enabled', authorize(['super_admin', 'admin']), userController.getChatEnabledUsers);

/**
 * @route   GET /api/v1/users/chat/permissions
 * @desc    Get chat permission matrix
 * @access  Private (Admin, Super Admin)
 */
router.get('/chat/permissions', authorize(['super_admin', 'admin']), (req, res) => {
  const permissionMatrix = {
    super_admin: {
      canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin'],
      canCreateGroup: true,
      canModifyPermissions: true
    },
    admin: {
      canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
      canCreateGroup: true,
      canModifyPermissions: false
    },
    manager: {
      canChatWith: ['customer', 'supervisor', 'manager', 'admin'],
      canCreateGroup: true,
      canModifyPermissions: false
    },
    supervisor: {
      canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
      canCreateGroup: true,
      canModifyPermissions: false
    },
    technician: {
      canChatWith: ['customer', 'technician', 'supervisor', 'admin'],
      canCreateGroup: false,
      canModifyPermissions: false
    },
    hr: {
      canChatWith: ['employee', 'manager', 'admin'],
      canCreateGroup: true,
      canModifyPermissions: false
    },
    customer: {
      canChatWith: ['technician', 'supervisor', 'manager', 'admin'],
      canCreateGroup: false,
      canModifyPermissions: false
    }
  };
  
  res.json({ success: true, data: permissionMatrix });
});

/**
 * @route   GET /api/v1/users/chat/stats
 * @desc    Get chat statistics
 * @access  Private (Admin, Super Admin)
 */
router.get('/chat/stats', authorize(['super_admin', 'admin']), async (req, res) => {
  try {
    const User = require('../../models/User.model');
    const totalUsers = await User.countDocuments({ status: 'active' });
    const chatEnabledUsers = await User.countDocuments({ chatEnabled: true, status: 'active' });
    const chatDisabledUsers = totalUsers - chatEnabledUsers;
    
    const byRole = await User.aggregate([
      { $match: { status: 'active' } },
      { $group: {
          _id: '$role',
          total: { $sum: 1 },
          chatEnabled: { $sum: { $cond: ['$chatEnabled', 1, 0] } }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        totalUsers,
        chatEnabledUsers,
        chatDisabledUsers,
        percentageEnabled: totalUsers ? ((chatEnabledUsers / totalUsers) * 100).toFixed(1) : 0,
        byRole
      }
    });
  } catch (error) {
    console.error('Get chat stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== BULK OPERATIONS ROUTES ====================

/**
 * @route   POST /api/v1/users/bulk-toggle-chat
 * @desc    Bulk toggle chat enabled for multiple users
 * @access  Private (Super Admin only)
 */
router.post('/bulk-toggle-chat', authorize(['super_admin']), userController.bulkToggleChatEnabled);

/**
 * @route   POST /api/v1/users/bulk/online-status
 * @desc    Get online status for multiple users
 * @access  Private
 */
router.post('/bulk/online-status', protect, async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide an array of user IDs' 
      });
    }
    
    const User = require('../../models/User.model');
    const users = await User.find({
      _id: { $in: userIds },
      status: 'active'
    }).select('_id isUserOnline lastSeen');
    
    const statusMap = {};
    users.forEach(user => {
      statusMap[user._id] = {
        isOnline: user.isUserOnline,
        lastSeen: user.lastSeen
      };
    });
    
    res.json({ 
      success: true, 
      data: statusMap
    });
  } catch (error) {
    console.error('Bulk online status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ACTIVITY ROUTES ====================

/**
 * @route   GET /api/v1/users/activity/recent
 * @desc    Get recently active users
 * @access  Private (Admin, Manager, Super Admin)
 */
router.get('/activity/recent', authorize(['admin', 'manager', 'super_admin']), async (req, res) => {
  try {
    const { minutes = 5 } = req.query;
    const cutoffTime = new Date(Date.now() - (minutes * 60 * 1000));
    
    const User = require('../../models/User.model');
    const activeUsers = await User.find({
      lastSeen: { $gte: cutoffTime },
      status: 'active'
    }).select('_id firstName lastName email role isUserOnline lastSeen lastLoginAt')
      .sort({ lastSeen: -1 });
    
    res.json({ 
      success: true, 
      data: activeUsers,
      count: activeUsers.length,
      timeWindow: `${minutes} minutes`
    });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/v1/users/activity/inactive
 * @desc    Get inactive users
 * @access  Private (Admin, Super Admin)
 */
router.get('/activity/inactive', authorize(['admin', 'super_admin']), async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const cutoffTime = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
    
    const User = require('../../models/User.model');
    const inactiveUsers = await User.find({
      $or: [
        { lastSeen: { $lt: cutoffTime } },
        { lastLoginAt: { $lt: cutoffTime } }
      ],
      status: 'active',
      role: { $ne: 'super_admin' }
    }).select('_id firstName lastName email role lastSeen lastLoginAt')
      .sort({ lastSeen: 1 });
    
    res.json({ 
      success: true, 
      data: inactiveUsers,
      count: inactiveUsers.length,
      inactiveSince: `${days} days`
    });
  } catch (error) {
    console.error('Get inactive users error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== SOCKET MANAGEMENT ROUTES ====================

/**
 * @route   POST /api/v1/users/socket/register
 * @desc    Register socket ID (alias for register-socket)
 * @access  Private
 */
router.post('/socket/register', protect, async (req, res) => {
  try {
    const { socketId } = req.body;
    
    if (!socketId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Socket ID is required' 
      });
    }
    
    const User = require('../../models/User.model');
    await User.findByIdAndUpdate(req.user._id, {
      socketId: socketId,
      isUserOnline: true,
      lastSeen: new Date()
    });
    
    res.json({ 
      success: true, 
      message: 'Socket ID registered successfully'
    });
  } catch (error) {
    console.error('Register socket error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   DELETE /api/v1/users/socket/unregister
 * @desc    Unregister socket ID
 * @access  Private
 */
router.delete('/socket/unregister', protect, async (req, res) => {
  try {
    const User = require('../../models/User.model');
    await User.findByIdAndUpdate(req.user._id, {
      socketId: null,
      isUserOnline: false,
      lastSeen: new Date()
    });
    
    res.json({ 
      success: true, 
      message: 'Socket ID unregistered successfully'
    });
  } catch (error) {
    console.error('Unregister socket error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PARAMETER ROUTES (WITH :id) - MUST COME LAST ====================

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin, Manager)
 */
router.get('/:id', authorize(['super_admin', 'admin', 'manager']), userController.getUserById);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user
 * @access  Private (Admin, Manager)
 */
router.put('/:id', authorize(['super_admin', 'admin', 'manager']), userController.updateUser);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user
 * @access  Private (Admin, Super Admin)
 */
router.delete('/:id', authorize(['super_admin', 'admin']), userController.deleteUser);

/**
 * @route   GET /api/v1/users/:id/status
 * @desc    Get user online status by ID
 * @access  Private
 */
router.get('/:id/status', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const User = require('../../models/User.model');
    
    const user = await User.findById(id)
      .select('_id firstName lastName email role isUserOnline lastSeen socketId');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      data: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isOnline: user.isUserOnline,
        lastSeen: user.lastSeen,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
      }
    });
  } catch (error) {
    console.error('Get user status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   PUT /api/v1/users/:id/toggle-chat
 * @desc    Toggle chat enabled for specific user
 * @access  Private (Super Admin only)
 */
router.put('/:id/toggle-chat', authorize(['super_admin']), userController.toggleChatEnabled);

/**
 * @route   PUT /api/v1/users/:id/activate
 * @desc    Activate user
 * @access  Private (Admin, Super Admin)
 */
router.put('/:id/activate', authorize(['super_admin', 'admin']), userController.activateUser);

/**
 * @route   PUT /api/v1/users/:id/deactivate
 * @desc    Deactivate user
 * @access  Private (Admin, Super Admin)
 */
router.put('/:id/deactivate', authorize(['super_admin', 'admin']), userController.deactivateUser);

/**
 * @route   POST /api/v1/users/:id/reset-password
 * @desc    Reset user password
 * @access  Private (Admin, Super Admin)
 */
router.post('/:id/reset-password', authorize(['super_admin', 'admin']), userController.resetUserPassword);

/**
 * @route   POST /api/v1/users/:id/documents
 * @desc    Upload user document
 * @access  Private (Admin, Super Admin)
 */
router.post('/:id/documents', authorize(['super_admin', 'admin']), userController.uploadUserDocument);

/**
 * @route   GET /api/v1/users/:id/documents
 * @desc    Get user documents
 * @access  Private (Admin, Super Admin)
 */
router.get('/:id/documents', authorize(['super_admin', 'admin']), userController.getUserDocuments);

/**
 * @route   DELETE /api/v1/users/:id/documents/:documentId
 * @desc    Delete user document
 * @access  Private (Admin, Super Admin)
 */
router.delete('/:id/documents/:documentId', authorize(['super_admin', 'admin']), userController.deleteUserDocument);

/**
 * @route   GET /api/v1/users/:id/permissions
 * @desc    Get user permissions
 * @access  Private (Admin, Super Admin)
 */
router.get('/:id/permissions', authorize(['super_admin', 'admin']), userController.getUserPermissions);

/**
 * @route   PUT /api/v1/users/:id/permissions
 * @desc    Update user permissions
 * @access  Private (Super Admin only)
 */
router.put('/:id/permissions', authorize(['super_admin']), userController.updateUserPermissions);

// ==================== PROFILE ROUTES ====================

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update own profile
 * @access  Private
 */
router.put('/profile', protect, userController.updateOwnProfile);

/**
 * @route   PUT /api/v1/users/change-password
 * @desc    Change own password
 * @access  Private
 */
router.put('/change-password', protect, userController.changeOwnPassword);

/**
 * @route   POST /api/v1/users/profile/image
 * @desc    Upload profile image
 * @access  Private
 */
router.post('/profile/image', protect, userController.uploadProfileImage);

/**
 * @route   DELETE /api/v1/users/profile/image
 * @desc    Remove profile image
 * @access  Private
 */
router.delete('/profile/image', protect, userController.removeProfileImage);

// ==================== TEAM MANAGEMENT ROUTES ====================

/**
 * @route   GET /api/v1/users/technicians
 * @desc    Get all technicians
 * @access  Private
 */
router.get('/technicians', protect, userController.getTechnicians);

/**
 * @route   GET /api/v1/users/team
 * @desc    Get team members (for managers/supervisors)
 * @access  Private
 */
router.get('/team', protect, userController.getTeamMembers);

/**
 * @route   GET /api/v1/users/hierarchy
 * @desc    Get reporting hierarchy
 * @access  Private
 */
router.get('/hierarchy', protect, userController.getReportingHierarchy);

// ==================== NOTIFICATION ROUTES ====================

/**
 * @route   POST /api/v1/users/fcm-token
 * @desc    Update FCM token for push notifications
 * @access  Private
 */
router.post('/fcm-token', protect, userController.updateFCMToken);

/**
 * @route   DELETE /api/v1/users/fcm-token
 * @desc    Remove FCM token
 * @access  Private
 */
router.delete('/fcm-token', protect, userController.removeFCMToken);

// ==================== DASHBOARD STATS ====================

/**
 * @route   GET /api/v1/users/dashboard/stats
 * @desc    Get user dashboard statistics
 * @access  Private (Admin, Super Admin)
 */
router.get('/dashboard/stats', authorize(['super_admin', 'admin']), userController.getDashboardStats);

/**
 * @route   GET /api/v1/users/activity-log
 * @desc    Get user activity log
 * @access  Private (Admin, Super Admin)
 */
router.get('/activity-log', authorize(['super_admin', 'admin']), userController.getUserActivityLog);

module.exports = router;