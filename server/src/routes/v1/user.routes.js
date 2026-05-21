// server/src/routes/v1/user.routes.js
// const express = require('express');
// const router = express.Router();
// const userController = require('../../controllers/user.controller');
// const authMiddleware = require('../../middleware/auth.middleware');

// console.log('✅ User Controller loaded, methods:', Object.keys(userController));

// router.use(authMiddleware);

// router.get('/', userController.getUsers);
// router.get('/export', userController.exportUsers);
// router.get('/:id', userController.getUserById);
// router.post('/', userController.createUser);
// router.post('/bulk-import', userController.bulkImportUsers);
// router.put('/:id', userController.updateUser);
// router.delete('/:id', userController.deleteUser);

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

// // ==================== USER ROUTES ====================
// router.get('/', authorize(['super_admin', 'admin']), userController.getUsers);
// router.get('/export', authorize(['super_admin', 'admin']), userController.exportUsers);
// router.post('/', authorize(['super_admin', 'admin']), userController.createUser);
// router.post('/bulk-import', authorize(['super_admin', 'admin']), userController.bulkImportUsers);
// router.get('/:id', authorize(['super_admin', 'admin', 'manager']), userController.getUserById);
// router.put('/:id', authorize(['super_admin', 'admin', 'manager']), userController.updateUser);
// router.delete('/:id', authorize(['super_admin', 'admin']), userController.deleteUser);

// module.exports = router;


//-------------------------------------------
// server/src/routes/v1/user.routes.js
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

// // ==================== USER ROUTES ====================
// // 🔴 FIX: Allow managers to view technicians
// router.get('/', authorize(['super_admin', 'admin', 'manager', 'hr']), userController.getUsers);
// router.get('/export', authorize(['super_admin', 'admin']), userController.exportUsers);
// router.post('/', authorize(['super_admin', 'admin', 'hr']), userController.createUser);
// router.post('/bulk-import', authorize(['super_admin', 'admin']), userController.bulkImportUsers);
// router.get('/:id', authorize(['super_admin', 'admin', 'manager']), userController.getUserById);
// router.put('/:id', authorize(['super_admin', 'admin', 'manager']), userController.updateUser);
// router.delete('/:id', authorize(['super_admin', 'admin']), userController.deleteUser);

// module.exports = router;


// // server/src/routes/v1/user.routes.js
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

// // ==================== USER CRUD ROUTES ====================
// router.get('/', authorize(['super_admin', 'admin', 'manager', 'hr']), userController.getUsers);
// router.get('/export', authorize(['super_admin', 'admin']), userController.exportUsers);
// router.post('/', authorize(['super_admin', 'admin', 'hr']), userController.createUser);
// router.post('/bulk-import', authorize(['super_admin', 'admin']), userController.bulkImportUsers);
// router.get('/:id', authorize(['super_admin', 'admin', 'manager']), userController.getUserById);
// router.put('/:id', authorize(['super_admin', 'admin', 'manager']), userController.updateUser);
// router.delete('/:id', authorize(['super_admin', 'admin']), userController.deleteUser);

// // ==================== CHAT PERMISSION ROUTES ====================

// /**
//  * @route   GET /api/users/chat-enabled
//  * @desc    Get all users with chat enabled
//  * @access  Super Admin, Admin
//  */
// router.get('/chat-enabled', authorize(['super_admin', 'admin']), userController.getChatEnabledUsers);

// /**
//  * @route   PUT /api/users/:id/toggle-chat
//  * @desc    Toggle chat enabled for a specific user
//  * @access  Super Admin only
//  */
// router.put('/:id/toggle-chat', authorize(['super_admin']), userController.toggleChatEnabled);

// /**
//  * @route   POST /api/users/bulk-toggle-chat
//  * @desc    Bulk enable/disable chat for multiple users
//  * @access  Super Admin only
//  */
// router.post('/bulk-toggle-chat', authorize(['super_admin']), userController.bulkToggleChatEnabled);

// /**
//  * @route   GET /api/users/chat/permissions
//  * @desc    Get chat permission matrix
//  * @access  Super Admin, Admin
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
//  * @route   GET /api/users/chat/stats
//  * @desc    Get chat statistics (enabled users count, etc.)
//  * @access  Super Admin, Admin
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

// module.exports = router;



// server/src/routes/v1/user.routes.js
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

// // ==================== USER CRUD ROUTES ====================
// router.get('/', authorize(['super_admin', 'admin', 'manager', 'hr']), userController.getUsers);
// router.get('/export', authorize(['super_admin', 'admin']), userController.exportUsers);
// router.post('/', authorize(['super_admin', 'admin', 'hr']), userController.createUser);
// router.post('/bulk-import', authorize(['super_admin', 'admin']), userController.bulkImportUsers);
// router.get('/:id', authorize(['super_admin', 'admin', 'manager']), userController.getUserById);
// router.put('/:id', authorize(['super_admin', 'admin', 'manager']), userController.updateUser);
// router.delete('/:id', authorize(['super_admin', 'admin']), userController.deleteUser);

// // ==================== ONLINE STATUS ROUTES ====================

// /**
//  * @route   GET /api/users/online
//  * @desc    Get all online users
//  * @access  Private (All authenticated users)
//  */
// router.get('/online', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const onlineUsers = await User.find({
//       isOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isOnline lastSeen socketId');
    
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
//  * @route   GET /api/users/online/count
//  * @desc    Get online users count
//  * @access  Private (All authenticated users)
//  */
// router.get('/online/count', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const count = await User.countDocuments({ 
//       isOnline: true, 
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
//  * @route   GET /api/users/:userId/status
//  * @desc    Get specific user online status
//  * @access  Private (All authenticated users)
//  */
// router.get('/:userId/status', protect, async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const User = require('../../models/User.model');
    
//     const user = await User.findById(userId)
//       .select('_id firstName lastName email role isOnline lastSeen socketId');
    
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
//         isOnline: user.isOnline,
//         lastSeen: user.lastSeen,
//         lastSeenFormatted: user.lastSeenFormatted
//       }
//     });
//   } catch (error) {
//     console.error('Get user status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   POST /api/users/update-status
//  * @desc    Update current user's online status (heartbeat)
//  * @access  Private
//  */
// router.post('/update-status', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const { isOnline } = req.body;
    
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { 
//         isOnline: isOnline !== undefined ? isOnline : true,
//         lastSeen: new Date()
//       },
//       { new: true }
//     ).select('_id isOnline lastSeen');
    
//     res.json({ 
//       success: true, 
//       data: {
//         isOnline: user.isOnline,
//         lastSeen: user.lastSeen
//       },
//       message: `Status updated to ${user.isOnline ? 'online' : 'offline'}`
//     });
//   } catch (error) {
//     console.error('Update status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// /**
//  * @route   POST /api/users/heartbeat
//  * @desc    Update user's last seen timestamp (keep session alive)
//  * @access  Private
//  */
// router.post('/heartbeat', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
    
//     await User.findByIdAndUpdate(req.user._id, { 
//       lastSeen: new Date(),
//       isOnline: true
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

// // ==================== CHAT PERMISSION ROUTES ====================

// /**
//  * @route   GET /api/users/chat-enabled
//  * @desc    Get all users with chat enabled
//  * @access  Super Admin, Admin
//  */
// router.get('/chat-enabled', authorize(['super_admin', 'admin']), userController.getChatEnabledUsers);

// /**
//  * @route   PUT /api/users/:id/toggle-chat
//  * @desc    Toggle chat enabled for a specific user
//  * @access  Super Admin only
//  */
// router.put('/:id/toggle-chat', authorize(['super_admin']), userController.toggleChatEnabled);

// /**
//  * @route   POST /api/users/bulk-toggle-chat
//  * @desc    Bulk enable/disable chat for multiple users
//  * @access  Super Admin only
//  */
// router.post('/bulk-toggle-chat', authorize(['super_admin']), userController.bulkToggleChatEnabled);

// /**
//  * @route   GET /api/users/chat/permissions
//  * @desc    Get chat permission matrix
//  * @access  Super Admin, Admin
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
//  * @route   GET /api/users/chat/stats
//  * @desc    Get chat statistics (enabled users count, etc.)
//  * @access  Super Admin, Admin
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

// // ==================== BULK USER STATUS ROUTES ====================

// /**
//  * @route   POST /api/users/bulk/online-status
//  * @desc    Get online status for multiple users
//  * @access  Private (All authenticated users)
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
//     }).select('_id isOnline lastSeen');
    
//     const statusMap = {};
//     users.forEach(user => {
//       statusMap[user._id] = {
//         isOnline: user.isOnline,
//         lastSeen: user.lastSeen,
//         lastSeenFormatted: user.lastSeenFormatted
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

// /**
//  * @route   GET /api/users/online/technicians
//  * @desc    Get online technicians only
//  * @access  Private (All authenticated users)
//  */
// router.get('/online/technicians', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const onlineTechnicians = await User.find({
//       role: 'technician',
//       isOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isOnline lastSeen');
    
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
//  * @route   GET /api/users/online/managers
//  * @desc    Get online managers only
//  * @access  Private (All authenticated users)
//  */
// router.get('/online/managers', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     const onlineManagers = await User.find({
//       role: { $in: ['manager', 'super_admin', 'admin'] },
//       isOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isOnline lastSeen');
    
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

// // ==================== USER ACTIVITY ROUTES ====================

// /**
//  * @route   GET /api/users/activity/recent
//  * @desc    Get users active in last X minutes
//  * @access  Admin, Manager
//  */
// router.get('/activity/recent', authorize(['admin', 'manager', 'super_admin']), async (req, res) => {
//   try {
//     const { minutes = 5 } = req.query;
//     const cutoffTime = new Date(Date.now() - (minutes * 60 * 1000));
    
//     const User = require('../../models/User.model');
//     const activeUsers = await User.find({
//       lastSeen: { $gte: cutoffTime },
//       status: 'active'
//     }).select('_id firstName lastName email role isOnline lastSeen lastLoginAt')
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
//  * @route   GET /api/users/activity/inactive
//  * @desc    Get inactive users (not seen for X days)
//  * @access  Admin, Super Admin
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
//  * @route   POST /api/users/socket/register
//  * @desc    Register socket ID for current user
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
//       isOnline: true,
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
//  * @route   DELETE /api/users/socket/unregister
//  * @desc    Unregister socket ID (user disconnects)
//  * @access  Private
//  */
// router.delete('/socket/unregister', protect, async (req, res) => {
//   try {
//     const User = require('../../models/User.model');
//     await User.findByIdAndUpdate(req.user._id, {
//       socketId: null,
//       isOnline: false,
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

// module.exports = router;





// server/src/routes/v1/user.routes.js
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

// Online Status Routes
router.get('/online', protect, async (req, res) => {
  try {
    const User = require('../../models/User.model');
    const onlineUsers = await User.find({
      isUserOnline: true,
      status: 'active',
      _id: { $ne: req.user._id }
    }).select('_id firstName lastName email role profileImage isUserOnline lastSeen socketId');
    
    res.json({ 
      success: true, 
      data: onlineUsers,
      count: onlineUsers.length
    });
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

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
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/online/technicians', protect, async (req, res) => {
  try {
    const User = require('../../models/User.model');
    const onlineTechnicians = await User.find({
      role: 'technician',
      isUserOnline: true,
      status: 'active',
      _id: { $ne: req.user._id }
    }).select('_id firstName lastName email role profileImage isUserOnline lastSeen');
    
    res.json({ 
      success: true, 
      data: onlineTechnicians,
      count: onlineTechnicians.length
    });
  } catch (error) {
    console.error('Get online technicians error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/online/managers', protect, async (req, res) => {
  try {
    const User = require('../../models/User.model');
    const onlineManagers = await User.find({
      role: { $in: ['manager', 'super_admin', 'admin'] },
      isUserOnline: true,
      status: 'active',
      _id: { $ne: req.user._id }
    }).select('_id firstName lastName email role profileImage isUserOnline lastSeen');
    
    res.json({ 
      success: true, 
      data: onlineManagers,
      count: onlineManagers.length
    });
  } catch (error) {
    console.error('Get online managers error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chat Permission Routes
router.get('/chat-enabled', authorize(['super_admin', 'admin']), userController.getChatEnabledUsers);
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

// Status Update Routes
router.post('/update-status', protect, async (req, res) => {
  try {
    const User = require('../../models/User.model');
    const { isOnline } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
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

router.post('/heartbeat', protect, async (req, res) => {
  try {
    const User = require('../../models/User.model');
    
    await User.findByIdAndUpdate(req.user._id, { 
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

// Bulk Operations Routes
router.post('/bulk-toggle-chat', authorize(['super_admin']), userController.bulkToggleChatEnabled);
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

// Activity Routes
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

// Socket Management Routes
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

// Get user by ID
router.get('/:id', authorize(['super_admin', 'admin', 'manager']), userController.getUserById);

// Update user
router.put('/:id', authorize(['super_admin', 'admin', 'manager']), userController.updateUser);

// Delete user
router.delete('/:id', authorize(['super_admin', 'admin']), userController.deleteUser);

// Get user online status by ID
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
        lastSeen: user.lastSeen
      }
    });
  } catch (error) {
    console.error('Get user status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Toggle chat for specific user
router.put('/:id/toggle-chat', authorize(['super_admin']), userController.toggleChatEnabled);

// Activate/Deactivate user
router.put('/:id/activate', authorize(['super_admin', 'admin']), userController.activateUser);
router.put('/:id/deactivate', authorize(['super_admin', 'admin']), userController.deactivateUser);

// Reset user password
router.post('/:id/reset-password', authorize(['super_admin', 'admin']), userController.resetUserPassword);

// User documents routes
router.post('/:id/documents', authorize(['super_admin', 'admin']), userController.uploadUserDocument);
router.get('/:id/documents', authorize(['super_admin', 'admin']), userController.getUserDocuments);
router.delete('/:id/documents/:documentId', authorize(['super_admin', 'admin']), userController.deleteUserDocument);

// User permissions routes
router.get('/:id/permissions', authorize(['super_admin', 'admin']), userController.getUserPermissions);
router.put('/:id/permissions', authorize(['super_admin', 'admin']), userController.updateUserPermissions);

// ==================== PROFILE ROUTES ====================
router.put('/profile', protect, userController.updateOwnProfile);
router.put('/change-password', protect, userController.changeOwnPassword);
router.post('/profile/image', protect, userController.uploadProfileImage);
router.delete('/profile/image', protect, userController.removeProfileImage);

// ==================== TEAM MANAGEMENT ROUTES ====================
router.get('/technicians', protect, userController.getTechnicians);
router.get('/team', protect, userController.getTeamMembers);
router.get('/hierarchy', protect, userController.getReportingHierarchy);

// ==================== NOTIFICATION ROUTES ====================
router.post('/fcm-token', protect, userController.updateFCMToken);
router.delete('/fcm-token', protect, userController.removeFCMToken);

// ==================== DASHBOARD STATS ====================
router.get('/dashboard/stats', authorize(['super_admin', 'admin']), userController.getDashboardStats);
router.get('/activity-log', authorize(['super_admin', 'admin']), userController.getUserActivityLog);

module.exports = router;