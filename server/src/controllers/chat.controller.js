// server/src/controllers/chat.controller.js
const Chat = require('../models/Chat.model');
const Message = require('../models/Message.model');
const UserChatSettings = require('../models/UserChatSettings.model');
const User = require('../models/User.model');
const { getIO } = require('../config/socketio');

// ==================== CHAT PERMISSIONS ====================

// Permission Matrix
const chatPermissions = {
  customer: {
    canChatWith: ['technician', 'supervisor', 'manager', 'admin'],
    canCreateGroup: false,
    canJoinGroup: true
  },
  technician: {
    canChatWith: ['customer', 'technician', 'supervisor', 'admin'],
    canCreateGroup: false,
    canJoinGroup: true
  },
  supervisor: {
    canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
    canCreateGroup: true,
    canJoinGroup: true
  },
  manager: {
    canChatWith: ['customer', 'supervisor', 'manager', 'admin'],
    canCreateGroup: true,
    canJoinGroup: true
  },
  admin: {
    canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
    canCreateGroup: true,
    canJoinGroup: true
  },
  super_admin: {
    canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin', 'super_admin'],
    canCreateGroup: true,
    canJoinGroup: true
  },
  hr: {
    canChatWith: ['employee', 'manager', 'admin'],
    canCreateGroup: true,
    canJoinGroup: true
  }
};

// Check if two users can chat
const canChat = (userRole, targetRole) => {
  const permissions = chatPermissions[userRole];
  if (!permissions) return false;
  return permissions.canChatWith.includes(targetRole);
};

// Get user's chat permission settings
const getUserChatSettings = async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    
    let settings = await UserChatSettings.findOne({ userId });
    if (!settings) {
      settings = new UserChatSettings({ userId });
      await settings.save();
    }
    
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get user chat settings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update user chat settings (Super Admin only)
const updateUserChatSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { chatEnabled } = req.body;
    
    // Only super admin can update chat permissions
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }
    
    let settings = await UserChatSettings.findOne({ userId });
    if (!settings) {
      settings = new UserChatSettings({ userId });
    }
    
    settings.chatEnabled = chatEnabled;
    settings.updatedBy = req.user._id;
    await settings.save();
    
    // Update user's chatEnabled status in User model as well
    await User.findByIdAndUpdate(userId, { chatEnabled });
    
    res.json({ success: true, data: settings, message: 'Chat settings updated' });
  } catch (error) {
    console.error('Update user chat settings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== CHAT MANAGEMENT ====================

// Get or create direct chat
const getOrCreateDirectChat = async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    const { targetUserId } = req.body;
    
    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);
    
    if (!currentUser || !targetUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Check if current user has chat enabled
    const currentSettings = await UserChatSettings.findOne({ userId });
    if (!currentSettings?.chatEnabled) {
      return res.status(403).json({ success: false, error: 'Chat is disabled for you' });
    }
    
    // Check permission
    if (!canChat(currentUser.role, targetUser.role)) {
      return res.status(403).json({ success: false, error: 'You cannot chat with this user' });
    }
    
    // Find existing direct chat
    let chat = await Chat.findOne({
      chatType: 'direct',
      participants: { $all: [{ userId }, { userId: targetUserId }] },
      isActive: true
    }).populate('participants.userId', 'firstName lastName email role profileImage');
    
    if (!chat) {
      // Create new chat
      chat = new Chat({
        chatType: 'direct',
        participants: [
          { userId, role: currentUser.role, name: `${currentUser.firstName} ${currentUser.lastName}` },
          { userId: targetUserId, role: targetUser.role, name: `${targetUser.firstName} ${targetUser.lastName}` }
        ],
        unreadCounts: [
          { userId, count: 0 },
          { userId: targetUserId, count: 0 }
        ]
      });
      await chat.save();
      await chat.populate('participants.userId', 'firstName lastName email role profileImage');
    }
    
    res.json({ success: true, data: chat });
  } catch (error) {
    console.error('Get or create chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user's chats
const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    
    const chats = await Chat.find({
      'participants.userId': userId,
      isActive: true,
      isArchived: false
    })
      .populate('participants.userId', 'firstName lastName email role profileImage isOnline')
      .sort({ updatedAt: -1 });
    
    // Get last message for each chat
    const chatsWithLastMessage = await Promise.all(chats.map(async (chat) => {
      const lastMessage = await Message.findOne({ chatId: chat._id })
        .sort({ createdAt: -1 })
        .limit(1);
      
      const unreadCount = chat.unreadCounts.find(u => u.userId.toString() === userId.toString())?.count || 0;
      
      return {
        ...chat.toObject(),
        lastMessage,
        unreadCount
      };
    }));
    
    res.json({ success: true, data: chatsWithLastMessage });
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get chat messages
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id || req.userId;
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }
    
    // Check if user is participant
    if (!chat.participants.some(p => p.userId.toString() === userId.toString())) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }
    
    const skip = (page - 1) * limit;
    
    const messages = await Message.find({ chatId, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('senderId', 'firstName lastName email role profileImage');
    
    // Mark messages as delivered
    await Message.updateMany(
      { chatId, 'deliveredTo.userId': { $ne: userId } },
      { $push: { deliveredTo: { userId, deliveredAt: new Date() } } }
    );
    
    // Reset unread count for this user
    const unreadIndex = chat.unreadCounts.findIndex(u => u.userId.toString() === userId.toString());
    if (unreadIndex !== -1) {
      chat.unreadCounts[unreadIndex].count = 0;
      await chat.save();
    }
    
    res.json({ 
      success: true, 
      data: messages.reverse(),
      pagination: { page: parseInt(page), limit: parseInt(limit), total: messages.length }
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message, attachments, location, replyTo } = req.body;
    const userId = req.user._id || req.userId;
    
    const chat = await Chat.findById(chatId).populate('participants.userId', 'firstName lastName role');
    if (!chat) {
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }
    
    // Check if user is participant
    const participant = chat.participants.find(p => p.userId._id.toString() === userId.toString());
    if (!participant) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }
    
    // Create message
    const newMessage = new Message({
      chatId,
      senderId: userId,
      senderName: `${req.user.firstName} ${req.user.lastName}`,
      senderRole: req.user.role,
      message,
      messageType: attachments?.length ? 'file' : location ? 'location' : 'text',
      attachments,
      location,
      replyTo,
      status: 'sent',
      deliveredTo: [{ userId, deliveredAt: new Date() }]
    });
    
    await newMessage.save();
    await newMessage.populate('senderId', 'firstName lastName email role profileImage');
    
    // Update chat's last message
    chat.lastMessage = {
      message: message || (attachments?.length ? `📎 ${attachments.length} file(s)` : '📍 Location shared'),
      senderId: userId,
      senderName: participant.name,
      timestamp: new Date()
    };
    
    // Increment unread count for other participants
    for (const p of chat.participants) {
      if (p.userId._id.toString() !== userId.toString()) {
        const unreadIndex = chat.unreadCounts.findIndex(u => u.userId.toString() === p.userId._id.toString());
        if (unreadIndex !== -1) {
          chat.unreadCounts[unreadIndex].count += 1;
        }
      }
    }
    
    await chat.save();
    
    // Emit real-time event via Socket.IO
    const io = getIO();
    chat.participants.forEach(p => {
      if (p.userId._id.toString() !== userId.toString()) {
        io.to(`user_${p.userId._id}`).emit('new_message', {
          chatId,
          message: newMessage,
          chat: chat
        });
      }
    });
    
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id || req.userId;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    
    // Check if already read by this user
    if (!message.readBy.some(r => r.userId.toString() === userId.toString())) {
      message.readBy.push({ userId, readAt: new Date() });
      await message.save();
      
      // Emit read receipt
      const io = getIO();
      io.to(`user_${message.senderId}`).emit('message_read', {
        messageId,
        readBy: userId,
        readAt: new Date()
      });
    }
    
    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete message (for admin)
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id || req.userId;
    const userRole = req.user.role;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    
    // Only admin, super_admin, or message sender can delete
    if (userRole !== 'super_admin' && userRole !== 'admin' && message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }
    
    message.isDeleted = true;
    await message.save();
    
    // Emit deletion event
    const io = getIO();
    const chat = await Chat.findById(message.chatId);
    chat?.participants.forEach(p => {
      io.to(`user_${p.userId}`).emit('message_deleted', { messageId });
    });
    
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Block user
const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id || req.userId;
    const { reason } = req.body;
    
    let settings = await UserChatSettings.findOne({ userId: currentUserId });
    if (!settings) {
      settings = new UserChatSettings({ userId: currentUserId });
    }
    
    if (!settings.blockedUsers.some(b => b.userId.toString() === userId)) {
      settings.blockedUsers.push({ userId, reason, blockedAt: new Date() });
      await settings.save();
    }
    
    res.json({ success: true, message: 'User blocked' });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Unblock user
const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id || req.userId;
    
    await UserChatSettings.updateOne(
      { userId: currentUserId },
      { $pull: { blockedUsers: { userId } } }
    );
    
    res.json({ success: true, message: 'User unblocked' });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get available users for chat
const getAvailableUsers = async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    const currentUser = await User.findById(userId);
    
    // Get users with chat enabled
    const usersWithChat = await UserChatSettings.find({ chatEnabled: true })
      .populate('userId', 'firstName lastName email role profileImage department');
    
    // Filter based on permission matrix
    const availableUsers = usersWithChat
      .filter(u => u.userId._id.toString() !== userId.toString())
      .filter(u => canChat(currentUser.role, u.userId.role))
      .map(u => u.userId);
    
    res.json({ success: true, data: availableUsers });
  } catch (error) {
    console.error('Get available users error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create group chat
const createGroupChat = async (req, res) => {
  try {
    const { groupName, groupDescription, participants, groupIcon } = req.body;
    const userId = req.user._id || req.userId;
    const currentUser = await User.findById(userId);
    
    const permissions = chatPermissions[currentUser.role];
    if (!permissions?.canCreateGroup) {
      return res.status(403).json({ success: false, error: 'You cannot create groups' });
    }
    
    const participantUsers = await User.find({ _id: { $in: [userId, ...participants] } });
    
    const chatParticipants = participantUsers.map(u => ({
      userId: u._id,
      role: u.role,
      name: `${u.firstName} ${u.lastName}`,
      isActive: true
    }));
    
    const chat = new Chat({
      chatType: 'group',
      groupName,
      groupDescription,
      groupIcon,
      participants: chatParticipants,
      createdBy: userId,
      unreadCounts: participantUsers.map(u => ({ userId: u._id, count: 0 }))
    });
    
    await chat.save();
    
    res.status(201).json({ success: true, data: chat });
  } catch (error) {
    console.error('Create group chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create ticket-based chat
const createTicketChat = async (req, res) => {
  try {
    const { ticketId, ticketType, assignedToId } = req.body;
    const userId = req.user._id || req.userId;
    
    let existingChat = await Chat.findOne({
      chatType: 'ticket',
      $or: [{ complaintId: ticketId }, { taskId: ticketId }],
      isActive: true
    });
    
    if (existingChat) {
      return res.json({ success: true, data: existingChat });
    }
    
    const currentUser = await User.findById(userId);
    const assignedUser = await User.findById(assignedToId);
    
    const participants = [
      { userId: currentUser._id, role: currentUser.role, name: `${currentUser.firstName} ${currentUser.lastName}` },
      { userId: assignedUser._id, role: assignedUser.role, name: `${assignedUser.firstName} ${assignedUser.lastName}` }
    ];
    
    const chat = new Chat({
      chatType: 'ticket',
      complaintId: ticketType === 'complaint' ? ticketId : undefined,
      taskId: ticketType === 'task' ? ticketId : undefined,
      participants,
      unreadCounts: participants.map(p => ({ userId: p.userId, count: 0 }))
    });
    
    await chat.save();
    
    res.status(201).json({ success: true, data: chat });
  } catch (error) {
    console.error('Create ticket chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Admin: Get all chats (for monitoring)
const getAllChats = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query.$or = [
        { groupName: { $regex: search, $options: 'i' } },
        { 'participants.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    const chats = await Chat.find(query)
      .populate('participants.userId', 'firstName lastName email role')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Chat.countDocuments(query);
    
    res.json({
      success: true,
      data: chats,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get all chats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Admin: Export chat logs
const exportChatLogs = async (req, res) => {
  try {
    const { chatId, startDate, endDate, format = 'csv' } = req.query;
    
    const query = {};
    if (chatId) query.chatId = chatId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const messages = await Message.find(query)
      .populate('senderId', 'firstName lastName email role')
      .sort({ createdAt: 1 });
    
    if (format === 'csv') {
      const csvHeaders = ['Date', 'Time', 'Sender Name', 'Sender Email', 'Sender Role', 'Message', 'Status'];
      const csvRows = messages.map(m => [
        m.createdAt.toISOString().split('T')[0],
        m.createdAt.toISOString().split('T')[1].slice(0, 8),
        m.senderId?.firstName + ' ' + m.senderId?.lastName || 'Unknown',
        m.senderId?.email || 'Unknown',
        m.senderRole || 'Unknown',
        m.message || (m.attachments?.length ? `[Attachments: ${m.attachments.length}]` : ''),
        m.status
      ]);
      
      const csv = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=chat_logs.csv');
      return res.send(csv);
    }
    
    res.json({ success: true, data: messages, count: messages.length });
  } catch (error) {
    console.error('Export chat logs error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getUserChatSettings,
  updateUserChatSettings,
  getOrCreateDirectChat,
  getUserChats,
  getChatMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  blockUser,
  unblockUser,
  getAvailableUsers,
  createGroupChat,
  createTicketChat,
  getAllChats,
  exportChatLogs
};