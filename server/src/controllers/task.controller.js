// /**
//  * TASK CONTROLLER
//  * Handles all task CRUD operations and task listing endpoints
//  * Complete version with all 30+ functions
//  */

// const Task = require('../models/Task.model');
// const User = require('../models/User.model');
// const Notification = require('../models/Notification.model');
// const ActivityLog = require('../models/ActivityLog.model');
// const { getIO } = require('../config/socketio');
// const { logger } = require('../utils/logger');

// // ==================== CREATE TASK ====================
// exports.createTask = async (req, res) => {
//   try {
//     const taskData = req.body;
//     taskData.createdBy = req.user._id;
    
//     // Generate unique task ID
//     const taskCount = await Task.countDocuments();
//     taskData.taskId = `TSK${new Date().getFullYear()}${String(taskCount + 1).padStart(5, '0')}`;
    
//     // Calculate SLA deadline based on priority
//     const slaMinutes = {
//       critical: 60,
//       high: 240,
//       medium: 480,
//       low: 1440
//     };
    
//     const deadlineMinutes = slaMinutes[taskData.priority] || 480;
//     taskData.slaDeadline = new Date(Date.now() + deadlineMinutes * 60 * 1000);
    
//     // Set assignment details
//     taskData.assignment = {
//       assignedTo: taskData.assignedTo,
//       assignedToName: taskData.assignedToName,
//       assignedBy: req.user._id,
//       assignedAt: new Date(),
//       supervisorId: taskData.supervisorId,
//       managerId: taskData.managerId,
//       reassignmentCount: 0
//     };
    
//     const task = new Task(taskData);
//     await task.save();
    
//     // Send notification to assigned technician
//     if (taskData.assignedTo) {
//       const io = getIO();
//       io.to(`user_${taskData.assignedTo}`).emit('new_task', {
//         taskId: task._id,
//         title: task.title,
//         priority: task.priority
//       });
      
//       await Notification.create({
//         userId: taskData.assignedTo,
//         title: 'New Task Assigned',
//         body: `Task "${task.title}" has been assigned to you. Priority: ${task.priority}`,
//         type: 'task',
//         referenceId: task._id,
//         referenceModel: 'Task'
//       });
//     }
    
//     // Log activity
//     await ActivityLog.create({
//       userId: req.user._id,
//       userName: req.user.name,
//       userRole: req.user.role,
//       action: 'CREATE_TASK',
//       entityType: 'task',
//       entityId: task._id,
//       newData: { title: task.title, priority: task.priority },
//       ipAddress: req.ip
//     });
    
//     res.status(201).json({
//       success: true,
//       data: task,
//       message: 'Task created successfully'
//     });
//   } catch (error) {
//     console.error('Create task error:', error);
//     logger.error('Create task error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASK LIST (Main List Endpoint) ====================
// exports.getTaskList = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       status,
//       priority,
//       assignedTo,
//       buildingId,
//       startDate,
//       endDate,
//       search,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;
    
//     const query = { isDeleted: { $ne: true } };
    
//     // Role-based filtering
//     if (req.user.role === 'technician') {
//       query['assignment.assignedTo'] = req.user._id;
//     } else if (req.user.role === 'supervisor') {
//       const technicians = await User.find({ supervisorId: req.user._id, role: 'technician' }).select('_id');
//       query['assignment.assignedTo'] = { $in: technicians.map(t => t._id) };
//     } else if (req.user.role === 'manager') {
//       query['location.buildingId'] = req.user.buildingId;
//     }
    
//     // Apply filters
//     if (status && status !== 'all') query.status = status;
//     if (priority && priority !== 'all') query.priority = priority;
//     if (assignedTo) query['assignment.assignedTo'] = assignedTo;
//     if (buildingId) query['location.buildingId'] = buildingId;
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { taskId: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     // Date range filter
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }
    
//     const skip = (page - 1) * limit;
//     const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
//     const [tasks, total] = await Promise.all([
//       Task.find(query)
//         .populate('assignment.assignedTo', 'name email technicianType')
//         .populate('assignment.assignedBy', 'name')
//         .populate('location.buildingId', 'name code')
//         .populate('sourceId', 'title complaintNumber')
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Task.countDocuments(query)
//     ]);
    
//     // Get status counts for stats
//     const statusCounts = await Task.getStatusCounts();
//     const priorityCounts = await Task.getPriorityCounts();
//     const overdueTasks = await Task.countDocuments({ 
//       slaDeadline: { $lt: new Date() }, 
//       status: { $nin: ['closed', 'cancelled', 'verified', 'completed'] },
//       isDeleted: false 
//     });
    
//     res.json({
//       success: true,
//       data: {
//         tasks,
//         stats: {
//           status: statusCounts,
//           priority: priorityCounts,
//           overdue: overdueTasks,
//           total
//         },
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / limit)
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get task list error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET ALL TASKS ====================
// exports.getTasks = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       status,
//       priority,
//       assignedTo,
//       buildingId,
//       startDate,
//       endDate,
//       search,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;
    
//     const query = { isDeleted: { $ne: true } };
    
//     // Role-based filtering
//     if (req.user.role === 'technician') {
//       query['assignment.assignedTo'] = req.user._id;
//     } else if (req.user.role === 'supervisor') {
//       const team = await User.find({ supervisorId: req.user._id }).distinct('_id');
//       query['assignment.assignedTo'] = { $in: team };
//     } else if (req.user.role === 'manager') {
//       const team = await User.find({ reportingManager: req.user._id }).distinct('_id');
//       query['assignment.assignedTo'] = { $in: team };
//     }
    
//     // Apply filters
//     if (status && status !== 'all') query.status = status;
//     if (priority && priority !== 'all') query.priority = priority;
//     if (assignedTo) query['assignment.assignedTo'] = assignedTo;
//     if (buildingId) query['location.buildingId'] = buildingId;
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { taskId: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     // Date range filter
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }
    
//     const skip = (page - 1) * limit;
//     const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
//     const [tasks, total] = await Promise.all([
//       Task.find(query)
//         .populate('assignment.assignedTo', 'firstName lastName email')
//         .populate('location.buildingId', 'name code')
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Task.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         tasks,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / limit)
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get tasks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET MY TASKS ====================
// exports.getMyTasks = async (req, res) => {
//   try {
//     const { status, priority } = req.query;
    
//     const query = {
//       'assignment.assignedTo': req.user._id,
//       status: { $nin: ['closed', 'cancelled'] },
//       isDeleted: { $ne: true }
//     };
    
//     if (status && status !== 'all') query.status = status;
//     if (priority && priority !== 'all') query.priority = priority;
    
//     const tasks = await Task.find(query)
//       .populate('location.buildingId', 'name code address')
//       .populate('assignment.assignedBy', 'name')
//       .populate('sourceId', 'title complaintNumber')
//       .sort({ priority: -1, slaDeadline: 1 });
    
//     // Get counts by status
//     const statusCounts = await Task.aggregate([
//       { $match: { 'assignment.assignedTo': req.user._id, isDeleted: false } },
//       { $group: { _id: '$status', count: { $sum: 1 } } }
//     ]);
    
//     const counts = {
//       pending: 0, assigned: 0, accepted: 0, in_progress: 0, 
//       waiting_parts: 0, waiting_approval: 0, completed: 0,
//       verified: 0, closed: 0, total: tasks.length
//     };
//     statusCounts.forEach(c => {
//       if (counts.hasOwnProperty(c._id)) counts[c._id] = c.count;
//     });
    
//     res.json({
//       success: true,
//       data: { tasks, counts }
//     });
//   } catch (error) {
//     console.error('Get my tasks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASK BY ID ====================
// exports.getTaskById = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id)
//       .populate('assignment.assignedTo', 'firstName lastName email phone technicianType')
//       .populate('assignment.assignedBy', 'firstName lastName email')
//       .populate('assignment.supervisorId', 'firstName lastName email')
//       .populate('assignment.managerId', 'firstName lastName email')
//       .populate('location.buildingId', 'name code address')
//       .populate('location.unitId', 'unitNumber floorNumber')
//       .populate('verification.verifiedBy', 'firstName lastName')
//       .populate('createdBy', 'firstName lastName email');
    
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     // Check authorization
//     if (req.user.role === 'technician' && task.assignment.assignedTo?._id?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, error: 'Unauthorized' });
//     }
    
//     res.json({
//       success: true,
//       data: task
//     });
//   } catch (error) {
//     console.error('Get task by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UPDATE TASK ====================
// exports.updateTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     updates.updatedBy = req.user._id;
//     updates.updatedAt = new Date();
    
//     // Don't allow updating certain fields
//     delete updates._id;
//     delete updates.taskId;
//     delete updates.createdBy;
//     delete updates.createdAt;
    
//     const task = await Task.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     );
    
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     await ActivityLog.create({
//       userId: req.user._id,
//       userName: req.user.name,
//       userRole: req.user.role,
//       action: 'UPDATE_TASK',
//       entityType: 'task',
//       entityId: task._id,
//       newData: updates,
//       ipAddress: req.ip
//     });
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Task updated successfully'
//     });
//   } catch (error) {
//     console.error('Update task error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== DELETE TASK (Soft Delete) ====================
// exports.deleteTask = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const task = await Task.findByIdAndUpdate(
//       id,
//       { isDeleted: true, deletedAt: new Date(), deletedBy: req.user._id },
//       { new: true }
//     );
    
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     await ActivityLog.create({
//       userId: req.user._id,
//       userName: req.user.name,
//       userRole: req.user.role,
//       action: 'DELETE_TASK',
//       entityType: 'task',
//       entityId: task._id,
//       oldData: { title: task.title, status: task.status },
//       ipAddress: req.ip
//     });
    
//     res.json({
//       success: true,
//       message: 'Task deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== ASSIGN TASK ====================
// exports.assignTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { technicianId } = req.body;
    
//     const technician = await User.findById(technicianId);
//     if (!technician) {
//       return res.status(404).json({ success: false, error: 'Technician not found' });
//     }
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     const oldTechnician = task.assignment.assignedToName;
    
//     task.assignment.assignedTo = technicianId;
//     task.assignment.assignedToName = technician.name;
//     task.assignment.assignedBy = req.user._id;
//     task.assignment.assignedAt = new Date();
//     task.status = 'assigned';
//     await task.save();
    
//     // Send notification
//     const io = getIO();
//     io.to(`user_${technicianId}`).emit('task_assigned', {
//       taskId: task._id,
//       title: task.title
//     });
    
//     await Notification.create({
//       userId: technicianId,
//       title: 'Task Assigned',
//       body: `Task "${task.title}" has been assigned to you.`,
//       type: 'task',
//       referenceId: task._id,
//       referenceModel: 'Task'
//     });
    
//     await ActivityLog.create({
//       userId: req.user._id,
//       userName: req.user.name,
//       userRole: req.user.role,
//       action: 'ASSIGN_TASK',
//       entityType: 'task',
//       entityId: task._id,
//       newData: { assignedTo: technician.name, previousTechnician: oldTechnician },
//       ipAddress: req.ip
//     });
    
//     res.json({
//       success: true,
//       data: task,
//       message: `Task assigned to ${technician.name}`
//     });
//   } catch (error) {
//     console.error('Assign task error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== AUTO-ASSIGN TASK ====================
// exports.autoAssignTask = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const technicians = await User.find({ role: 'technician', isActive: true });
    
//     if (technicians.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'No technicians available'
//       });
//     }
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     // Calculate workload for each technician
//     const workloads = await Promise.all(technicians.map(async (tech) => {
//       const activeTasks = await Task.countDocuments({
//         'assignment.assignedTo': tech._id,
//         status: { $in: ['assigned', 'accepted', 'in_progress'] },
//         isDeleted: false
//       });
//       return { technician: tech, activeTasks };
//     }));
    
//     // Sort by workload (least busy first)
//     workloads.sort((a, b) => a.activeTasks - b.activeTasks);
//     const bestTechnician = workloads[0].technician;
    
//     task.assignment.assignedTo = bestTechnician._id;
//     task.assignment.assignedToName = bestTechnician.name;
//     task.assignment.assignedBy = req.user._id;
//     task.assignment.assignedAt = new Date();
//     task.status = 'assigned';
//     await task.save();
    
//     // Send notification
//     const io = getIO();
//     io.to(`user_${bestTechnician._id}`).emit('task_assigned', {
//       taskId: task._id,
//       title: task.title
//     });
    
//     res.json({
//       success: true,
//       data: task,
//       message: `Task auto-assigned to ${bestTechnician.name}`
//     });
//   } catch (error) {
//     console.error('Auto assign task error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== REASSIGN TASK ====================
// exports.reassignTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { technicianId, reason } = req.body;
    
//     const technician = await User.findById(technicianId);
//     if (!technician) {
//       return res.status(404).json({ success: false, error: 'Technician not found' });
//     }
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     const oldTechnician = task.assignment.assignedToName;
    
//     task.assignment.assignedTo = technicianId;
//     task.assignment.assignedToName = technician.name;
//     task.assignment.reassignmentCount += 1;
//     task.assignment.reassignmentReason = reason;
//     task.status = 'assigned';
//     await task.save();
    
//     res.json({
//       success: true,
//       data: task,
//       message: `Task reassigned from ${oldTechnician} to ${technician.name}`
//     });
//   } catch (error) {
//     console.error('Reassign task error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== ACCEPT TASK ====================
// exports.acceptTask = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (task.assignment.assignedTo?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, error: 'Task not assigned to you' });
//     }
    
//     if (task.status !== 'assigned') {
//       return res.status(400).json({ success: false, error: 'Task cannot be accepted' });
//     }
    
//     task.status = 'accepted';
//     task.timeline.acceptedAt = new Date();
//     await task.save();
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Task accepted successfully'
//     });
//   } catch (error) {
//     console.error('Accept task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== START TASK ====================
// exports.startTask = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (task.assignment.assignedTo?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, error: 'Task not assigned to you' });
//     }
    
//     if (task.status !== 'accepted') {
//       return res.status(400).json({ success: false, error: 'Task cannot be started' });
//     }
    
//     task.status = 'in_progress';
//     task.timeline.startedAt = new Date();
//     task.progress.percentage = 10;
//     await task.save();
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Task started successfully'
//     });
//   } catch (error) {
//     console.error('Start task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UPDATE PROGRESS ====================
// exports.updateProgress = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { percentage } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (task.assignment.assignedTo?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, error: 'Task not assigned to you' });
//     }
    
//     task.progress.percentage = Math.min(100, Math.max(0, percentage));
//     task.progress.lastUpdatedAt = new Date();
//     task.progress.updatedBy = req.user._id;
//     await task.save();
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Progress updated successfully'
//     });
//   } catch (error) {
//     console.error('Update progress error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UPDATE CHECKLIST ====================
// exports.updateChecklist = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { itemId, completed, imageAfter, notes } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     const checklistItem = task.checklist.id(itemId);
//     if (!checklistItem) {
//       return res.status(404).json({ success: false, error: 'Checklist item not found' });
//     }
    
//     checklistItem.completed = completed;
//     checklistItem.completedBy = req.user._id;
//     checklistItem.completedAt = new Date();
//     if (imageAfter) checklistItem.imageAfter = imageAfter;
//     if (notes) checklistItem.notes = notes;
    
//     // Update progress percentage
//     const completedItems = task.checklist.filter(item => item.completed).length;
//     task.progress.percentage = Math.round((completedItems / task.checklist.length) * 100);
//     task.progress.lastUpdatedAt = new Date();
    
//     await task.save();
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Checklist updated successfully'
//     });
//   } catch (error) {
//     console.error('Update checklist error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UPLOAD EVIDENCE ====================
// exports.uploadEvidence = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { images, videos } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (images && images.length) {
//       images.forEach(img => {
//         task.evidence.afterImages.push({
//           url: img,
//           uploadedBy: req.user._id,
//           uploadedAt: new Date(),
//           description: 'Work completion evidence'
//         });
//       });
//     }
    
//     if (videos && videos.length) {
//       videos.forEach(vid => {
//         task.evidence.videos.push({
//           url: vid,
//           uploadedBy: req.user._id,
//           uploadedAt: new Date()
//         });
//       });
//     }
    
//     await task.save();
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Evidence uploaded successfully'
//     });
//   } catch (error) {
//     console.error('Upload evidence error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== COMPLETE TASK ====================
// exports.completeTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { completionNotes, afterImages } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (task.assignment.assignedTo?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, error: 'Task not assigned to you' });
//     }
    
//     if (task.status !== 'in_progress') {
//       return res.status(400).json({ success: false, error: 'Task cannot be completed' });
//     }
    
//     task.status = 'completed';
//     task.timeline.completedAt = new Date();
//     task.progress.percentage = 100;
    
//     if (completionNotes) {
//       task.technicianNotes.push({
//         note: completionNotes,
//         createdBy: req.user._id,
//         createdAt: new Date()
//       });
//     }
    
//     if (afterImages && afterImages.length) {
//       afterImages.forEach(img => {
//         task.evidence.afterImages.push({
//           url: img,
//           uploadedBy: req.user._id,
//           uploadedAt: new Date(),
//           description: 'Completion evidence'
//         });
//       });
//     }
    
//     await task.save();
    
//     // Notify supervisor
//     if (task.assignment.supervisorId) {
//       const io = getIO();
//       io.to(`user_${task.assignment.supervisorId}`).emit('task_completed', {
//         taskId: task._id,
//         title: task.title
//       });
//     }
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Task completed successfully. Pending verification.'
//     });
//   } catch (error) {
//     console.error('Complete task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== VERIFY TASK ====================
// exports.verifyTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { rating, notes, approved } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (!['supervisor', 'manager', 'admin', 'super_admin'].includes(req.user.role)) {
//       return res.status(403).json({ success: false, error: 'Not authorized to verify tasks' });
//     }
    
//     if (approved) {
//       task.status = 'verified';
//       task.verification = {
//         verifiedBy: req.user._id,
//         verifiedAt: new Date(),
//         notes,
//         rating,
//         reworkCount: task.verification?.reworkCount || 0
//       };
//       task.timeline.verifiedAt = new Date();
//       task.status = 'closed';
//       task.timeline.closedAt = new Date();
//     } else {
//       task.status = 'assigned';
//       task.rejection = {
//         reason: notes,
//         rejectedBy: req.user._id,
//         rejectedAt: new Date(),
//         reworkInstructions: notes
//       };
//       task.verification = {
//         ...task.verification,
//         reworkCount: (task.verification?.reworkCount || 0) + 1
//       };
//     }
    
//     await task.save();
    
//     // Notify technician
//     const io = getIO();
//     io.to(`user_${task.assignment.assignedTo}`).emit('task_verified', {
//       taskId: task._id,
//       approved,
//       notes
//     });
    
//     res.json({
//       success: true,
//       data: task,
//       message: approved ? 'Task verified and closed' : 'Task rejected for rework'
//     });
//   } catch (error) {
//     console.error('Verify task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== REJECT TASK ====================
// exports.rejectTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (!['supervisor', 'manager', 'admin', 'super_admin'].includes(req.user.role)) {
//       return res.status(403).json({ success: false, error: 'Not authorized to reject tasks' });
//     }
    
//     task.status = 'assigned';
//     task.rejection = {
//       reason: reason,
//       rejectedBy: req.user._id,
//       rejectedAt: new Date(),
//       reworkInstructions: reason
//     };
//     task.verification = {
//       ...task.verification,
//       reworkCount: (task.verification?.reworkCount || 0) + 1
//     };
//     await task.save();
    
//     // Notify technician
//     const io = getIO();
//     io.to(`user_${task.assignment.assignedTo}`).emit('task_rejected', {
//       taskId: task._id,
//       reason
//     });
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Task rejected for rework'
//     });
//   } catch (error) {
//     console.error('Reject task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET OVERDUE TASKS ====================
// exports.getOverdueTasks = async (req, res) => {
//   try {
//     const tasks = await Task.findOverdue()
//       .populate('assignment.assignedTo', 'name email')
//       .populate('location.buildingId', 'name');
    
//     res.json({
//       success: true,
//       data: tasks
//     });
//   } catch (error) {
//     console.error('Get overdue tasks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASK STATISTICS ====================
// exports.getTaskStatistics = async (req, res) => {
//   try {
//     const statusCounts = await Task.getStatusCounts();
//     const priorityCounts = await Task.getPriorityCounts();
//     const overdueTasks = await Task.countDocuments({ 
//       slaDeadline: { $lt: new Date() }, 
//       status: { $nin: ['closed', 'cancelled', 'verified', 'completed'] },
//       isDeleted: false 
//     });
    
//     // Calculate average completion time
//     const avgResult = await Task.aggregate([
//       {
//         $match: {
//           'timeline.completedAt': { $exists: true },
//           'timeline.startedAt': { $exists: true },
//           isDeleted: false
//         }
//       },
//       {
//         $project: {
//           duration: {
//             $divide: [
//               { $subtract: ['$timeline.completedAt', '$timeline.startedAt'] },
//               1000 * 60
//             ]
//           }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           avgDuration: { $avg: '$duration' }
//         }
//       }
//     ]);
    
//     const avgCompletionTime = Math.round(avgResult[0]?.avgDuration || 0);
    
//     res.json({
//       success: true,
//       data: {
//         status: statusCounts,
//         priority: priorityCounts,
//         overdue: overdueTasks,
//         total: statusCounts.total,
//         avgCompletionTime
//       }
//     });
//   } catch (error) {
//     console.error('Get task statistics error:', error);
//     res.json({
//       success: true,
//       data: {
//         status: { pending: 0, assigned: 0, in_progress: 0, completed: 0, total: 0 },
//         priority: { critical: 0, high: 0, medium: 0, low: 0 },
//         overdue: 0,
//         total: 0,
//         avgCompletionTime: 0
//       }
//     });
//   }
// };

// // ==================== GET AVAILABLE TECHNICIANS ====================
// exports.getAvailableTechnicians = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     const technicians = await User.find({ role: 'technician', isActive: true })
//       .select('name email phone technicianType');
    
//     const availableTechnicians = await Promise.all(technicians.map(async (tech) => {
//       const activeTasks = await Task.countDocuments({
//         'assignment.assignedTo': tech._id,
//         status: { $in: ['assigned', 'accepted', 'in_progress'] },
//         isDeleted: false
//       });
      
//       const pendingTasks = await Task.countDocuments({
//         'assignment.assignedTo': tech._id,
//         status: 'assigned',
//         isDeleted: false
//       });
      
//       return {
//         technician: {
//           _id: tech._id,
//           name: tech.name,
//           email: tech.email,
//           phone: tech.phone,
//           technicianType: tech.technicianType
//         },
//         currentWorkload: {
//           activeTasks,
//           pendingTasks,
//           available: activeTasks < 5
//         }
//       };
//     }));
    
//     // Sort by workload (least busy first)
//     availableTechnicians.sort((a, b) => a.currentWorkload.activeTasks - b.currentWorkload.activeTasks);
    
//     res.json({
//       success: true,
//       data: availableTechnicians
//     });
//   } catch (error) {
//     console.error('Get available technicians error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TECHNICIAN WORKLOAD ====================
// exports.getTechnicianWorkload = async (req, res) => {
//   try {
//     const { technicianId } = req.params;
    
//     const technician = await User.findById(technicianId);
//     if (!technician) {
//       return res.status(404).json({ success: false, error: 'Technician not found' });
//     }
    
//     const activeTasks = await Task.countDocuments({
//       'assignment.assignedTo': technicianId,
//       status: { $in: ['assigned', 'accepted', 'in_progress'] },
//       isDeleted: false
//     });
    
//     const pendingTasks = await Task.countDocuments({
//       'assignment.assignedTo': technicianId,
//       status: 'assigned',
//       isDeleted: false
//     });
    
//     const completedToday = await Task.countDocuments({
//       'assignment.assignedTo': technicianId,
//       status: 'completed',
//       'timeline.completedAt': { $gte: new Date().setHours(0, 0, 0, 0) },
//       isDeleted: false
//     });
    
//     const overdueTasks = await Task.countDocuments({
//       'assignment.assignedTo': technicianId,
//       slaBreached: true,
//       status: { $nin: ['closed', 'cancelled'] },
//       isDeleted: false
//     });
    
//     res.json({
//       success: true,
//       data: {
//         technician: {
//           id: technician._id,
//           name: technician.name,
//           technicianType: technician.technicianType
//         },
//         workload: {
//           activeTasks,
//           pendingTasks,
//           completedToday,
//           overdueTasks,
//           capacityPercentage: Math.min(100, (activeTasks / 5) * 100)
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get technician workload error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET ASSIGNMENT HISTORY ====================
// exports.getAssignmentHistory = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const task = await Task.findById(id)
//       .populate('assignment.assignedTo', 'name')
//       .populate('assignment.assignedBy', 'name');
    
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     res.json({
//       success: true,
//       data: {
//         currentAssignment: task.assignment,
//         reassignmentCount: task.assignment?.reassignmentCount || 0,
//         reassignmentReason: task.assignment?.reassignmentReason
//       }
//     });
//   } catch (error) {
//     console.error('Get assignment history error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET DAILY PROGRESS ====================
// exports.getDailyProgress = async (req, res) => {
//   try {
//     const { technicianId } = req.params;
//     const { date } = req.query;
    
//     const targetDate = date ? new Date(date) : new Date();
//     const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    
//     const tasks = await Task.find({
//       'assignment.assignedTo': technicianId,
//       createdAt: { $gte: startOfDay, $lte: endOfDay },
//       isDeleted: false
//     });
    
//     const completedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'verified');
//     const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
//     const pendingTasks = tasks.filter(t => t.status === 'assigned');
    
//     const totalTimeSpent = tasks.reduce((sum, task) => {
//       return sum + (task.timeTracking?.timeSpent || 0);
//     }, 0);
    
//     res.json({
//       success: true,
//       data: {
//         date: startOfDay,
//         summary: {
//           totalTasks: tasks.length,
//           completedTasks: completedTasks.length,
//           inProgressTasks: inProgressTasks.length,
//           pendingTasks: pendingTasks.length,
//           totalTimeSpent: totalTimeSpent
//         },
//         tasks: tasks.map(t => ({
//           id: t._id,
//           taskId: t.taskId,
//           title: t.title,
//           status: t.status,
//           priority: t.priority,
//           timeSpent: t.timeTracking?.timeSpent || 0
//         }))
//       }
//     });
//   } catch (error) {
//     console.error('Get daily progress error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASKS BY STATUS ====================
// exports.getTasksByStatus = async (req, res) => {
//   try {
//     const { status } = req.params;
    
//     const query = { status, isDeleted: false };
    
//     if (req.user.role === 'technician') {
//       query['assignment.assignedTo'] = req.user._id;
//     }
    
//     const tasks = await Task.find(query)
//       .populate('assignment.assignedTo', 'name')
//       .populate('location.buildingId', 'name')
//       .sort({ createdAt: -1 });
    
//     res.json({
//       success: true,
//       data: tasks
//     });
//   } catch (error) {
//     console.error('Get tasks by status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASKS BY PRIORITY ====================
// exports.getTasksByPriority = async (req, res) => {
//   try {
//     const { priority } = req.params;
    
//     const query = { priority, isDeleted: false };
    
//     if (req.user.role === 'technician') {
//       query['assignment.assignedTo'] = req.user._id;
//     }
    
//     const tasks = await Task.find(query)
//       .populate('assignment.assignedTo', 'name')
//       .populate('location.buildingId', 'name')
//       .sort({ slaDeadline: 1 });
    
//     res.json({
//       success: true,
//       data: tasks
//     });
//   } catch (error) {
//     console.error('Get tasks by priority error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASKS BY BUILDING ====================
// exports.getTasksByBuilding = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
    
//     const tasks = await Task.find({ 
//       'location.buildingId': buildingId,
//       isDeleted: false 
//     })
//       .populate('assignment.assignedTo', 'name')
//       .sort({ priority: -1, createdAt: -1 });
    
//     res.json({
//       success: true,
//       data: tasks
//     });
//   } catch (error) {
//     console.error('Get tasks by building error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASKS BY TECHNICIAN ====================
// exports.getTasksByTechnician = async (req, res) => {
//   try {
//     const { technicianId } = req.params;
    
//     const tasks = await Task.find({ 
//       'assignment.assignedTo': technicianId,
//       isDeleted: false 
//     })
//       .populate('location.buildingId', 'name')
//       .sort({ createdAt: -1 });
    
//     res.json({
//       success: true,
//       data: tasks
//     });
//   } catch (error) {
//     console.error('Get tasks by technician error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== EXPORT TASKS TO CSV ====================
// exports.exportTasksToCSV = async (req, res) => {
//   try {
//     const tasks = await Task.find({ isDeleted: false })
//       .populate('assignment.assignedTo', 'name')
//       .populate('location.buildingId', 'name');
    
//     const csvData = tasks.map(task => ({
//       'Task ID': task.taskId,
//       'Title': task.title,
//       'Status': task.status,
//       'Priority': task.priority,
//       'Assigned To': task.assignment?.assignedToName || 'Unassigned',
//       'Building': task.location?.buildingName || 'N/A',
//       'Created At': task.createdAt.toISOString(),
//       'SLA Deadline': task.slaDeadline?.toISOString() || 'N/A',
//       'Completed At': task.timeline?.completedAt?.toISOString() || 'N/A'
//     }));
    
//     res.json({
//       success: true,
//       data: csvData
//     });
//   } catch (error) {
//     console.error('Export tasks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// //module.exports = exports;
// module.exports = {
//   // Core CRUD
//   createTask: exports.createTask,
//   getTasks: exports.getTasks,
//   getTaskList: exports.getTaskList,
//   getMyTasks: exports.getMyTasks,
//   getTaskById: exports.getTaskById,
//   updateTask: exports.updateTask,
//   deleteTask: exports.deleteTask,
  
//   // Assignment
//   assignTask: exports.assignTask,
//   autoAssignTask: exports.autoAssignTask,
//   reassignTask: exports.reassignTask,
//   getAssignmentHistory: exports.getAssignmentHistory,
//   getTechnicianWorkload: exports.getTechnicianWorkload,
//   getDailyProgress: exports.getDailyProgress,
  
//   // Progress & Status
//   acceptTask: exports.acceptTask,
//   startTask: exports.startTask,
//   updateProgress: exports.updateProgress,
//   updateChecklist: exports.updateChecklist,
//   uploadEvidence: exports.uploadEvidence,
//   completeTask: exports.completeTask,
//   verifyTask: exports.verifyTask,
//   rejectTask: exports.rejectTask,
//   getTaskProgress: exports.getTaskProgress || (async () => {}), // Fallback if missing
  
//   // Filters & Utilities
//   getTasksByStatus: exports.getTasksByStatus,
//   getTasksByPriority: exports.getTasksByPriority,
//   getTasksByBuilding: exports.getTasksByBuilding,
//   getTasksByTechnician: exports.getTasksByTechnician,
//   getOverdueTasks: exports.getOverdueTasks,
//   getTaskStatistics: exports.getTaskStatistics,
//   getAvailableTechnicians: exports.getAvailableTechnicians,
  
//   // Export
//   exportTasksToCSV: exports.exportTasksToCSV
// };







// /**
//  * TASK CONTROLLER
//  * Handles all task CRUD operations and task listing endpoints
//  * Complete version with all 30+ functions
//  */

// const Task = require('../models/Task.model');
// const User = require('../models/User.model');
// const Notification = require('../models/Notification.model');
// const ActivityLog = require('../models/ActivityLog.model');
// const { getIO } = require('../config/socketio');
// const { logger } = require('../utils/logger');

// // Helper function to get user name safely
// const getUserName = (user) => {
//   if (!user) return 'Unknown';
//   return user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown';
// };

// // Helper function to create activity log safely (FIXES ActivityLog validation)
// const createActivityLog = async (data) => {
//   try {
//     await ActivityLog.create({
//       userId: data.userId,
//       userName: data.userName || 'Unknown',
//       userRole: data.userRole || 'user',
//       userEmail: data.userEmail || '',
//       action: data.action,
//       entityType: data.entityType,
//       entityId: data.entityId ? data.entityId.toString() : '',
//       entityName: data.entityName || '',
//       oldData: data.oldData || null,
//       newData: data.newData || null,
//       ipAddress: data.ipAddress || '',
//       status: 'success'
//     });
//   } catch (error) {
//     console.error('Failed to create activity log:', error.message);
//     // Don't throw - just log the error
//   }
// };

// // ==================== CREATE TASK (With validation) ====================
// exports.createTask = async (req, res) => {
//   try {
//     const taskData = req.body;
//     taskData.createdBy = req.user._id;
    
//     // 🔴 FIX: Validate required fields
//     const requiredFields = ['title', 'description', 'priority'];
//     const missingFields = requiredFields.filter(field => !taskData[field]);
    
//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: `Missing required fields: ${missingFields.join(', ')}`
//       });
//     }
    
//     // Validate priority
//     const validPriorities = ['critical', 'high', 'medium', 'low'];
//     if (!validPriorities.includes(taskData.priority)) {
//       return res.status(400).json({
//         success: false,
//         error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`
//       });
//     }
    
//     // Generate unique task ID
//     const taskCount = await Task.countDocuments();
//     taskData.taskId = `TSK${new Date().getFullYear()}${String(taskCount + 1).padStart(5, '0')}`;
    
//     // Calculate SLA deadline based on priority
//     const slaMinutes = {
//       critical: 60,
//       high: 240,
//       medium: 480,
//       low: 1440
//     };
    
//     const deadlineMinutes = slaMinutes[taskData.priority] || 480;
//     taskData.slaDeadline = new Date(Date.now() + deadlineMinutes * 60 * 1000);
    
//     // Set default status
//     taskData.status = taskData.status || 'pending';
    
//     // Set assignment details only if assignedTo is provided
//     if (taskData.assignedTo && taskData.assignedTo !== '') {
//       taskData.assignment = {
//         assignedTo: taskData.assignedTo,
//         assignedToName: taskData.assignedToName,
//         assignedBy: req.user._id,
//         assignedAt: new Date(),
//         supervisorId: taskData.supervisorId,
//         managerId: taskData.managerId,
//         reassignmentCount: 0
//       };
//       taskData.status = 'assigned';
//     }
    
//     const task = new Task(taskData);
//     await task.save();
    
//     // Send notification to assigned technician
//     if (taskData.assignedTo && taskData.assignedTo !== '') {
//       try {
//         const io = getIO();
//         io.to(`user_${taskData.assignedTo}`).emit('new_task', {
//           taskId: task._id,
//           title: task.title,
//           priority: task.priority
//         });
        
//         await Notification.create({
//           userId: taskData.assignedTo,
//           title: 'New Task Assigned',
//           body: `Task "${task.title}" has been assigned to you. Priority: ${task.priority}`,
//           type: 'task',
//           referenceId: task._id,
//           referenceModel: 'Task'
//         });
//       } catch (notifError) {
//         console.error('Failed to send notification:', notifError.message);
//       }
//     }
    
//     // Log activity with safe function
//     await createActivityLog({
//       userId: req.user._id,
//       userName: getUserName(req.user),
//       userRole: req.user.role,
//       userEmail: req.user.email,
//       action: 'CREATE_TASK',
//       entityType: 'task',
//       entityId: task._id,
//       entityName: task.title,
//       newData: { title: task.title, priority: task.priority, taskId: task.taskId },
//       ipAddress: req.ip
//     });
    
//     res.status(201).json({
//       success: true,
//       data: task,
//       message: 'Task created successfully'
//     });
//   } catch (error) {
//     console.error('Create task error:', error);
//     logger.error('Create task error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASK LIST ====================
// exports.getTaskList = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       status,
//       priority,
//       assignedTo,
//       buildingId,
//       startDate,
//       endDate,
//       search,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;
    
//     const query = { isDeleted: { $ne: true } };
    
//     // Role-based filtering
//     if (req.user.role === 'technician') {
//       query['assignment.assignedTo'] = req.user._id;
//     } else if (req.user.role === 'supervisor') {
//       const technicians = await User.find({ supervisorId: req.user._id, role: 'technician' }).select('_id');
//       query['assignment.assignedTo'] = { $in: technicians.map(t => t._id) };
//     } else if (req.user.role === 'manager') {
//       query['location.buildingId'] = req.user.buildingId;
//     }
    
//     // Apply filters
//     if (status && status !== 'all') query.status = status;
//     if (priority && priority !== 'all') query.priority = priority;
//     if (assignedTo) query['assignment.assignedTo'] = assignedTo;
//     if (buildingId) query['location.buildingId'] = buildingId;
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { taskId: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     // Date range filter
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }
    
//     const skip = (page - 1) * limit;
//     const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
//     const [tasks, total] = await Promise.all([
//       Task.find(query)
//         .populate('assignment.assignedTo', 'name email technicianType')
//         .populate('assignment.assignedBy', 'name')
//         .populate('location.buildingId', 'name code')
//         .populate('sourceId', 'title complaintNumber')
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Task.countDocuments(query)
//     ]);
    
//     // Get status counts for stats
//     const statusCounts = await Task.getStatusCounts();
//     const priorityCounts = await Task.getPriorityCounts();
//     const overdueTasks = await Task.countDocuments({ 
//       slaDeadline: { $lt: new Date() }, 
//       status: { $nin: ['closed', 'cancelled', 'verified', 'completed'] },
//       isDeleted: false 
//     });
    
//     res.json({
//       success: true,
//       data: {
//         tasks,
//         stats: {
//           status: statusCounts,
//           priority: priorityCounts,
//           overdue: overdueTasks,
//           total
//         },
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / limit)
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get task list error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET ALL TASKS ====================
// exports.getTasks = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       status,
//       priority,
//       assignedTo,
//       buildingId,
//       startDate,
//       endDate,
//       search,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;
    
//     const query = { isDeleted: { $ne: true } };
    
//     // Role-based filtering
//     if (req.user.role === 'technician') {
//       query['assignment.assignedTo'] = req.user._id;
//     } else if (req.user.role === 'supervisor') {
//       const team = await User.find({ supervisorId: req.user._id }).distinct('_id');
//       query['assignment.assignedTo'] = { $in: team };
//     } else if (req.user.role === 'manager') {
//       const team = await User.find({ reportingManager: req.user._id }).distinct('_id');
//       query['assignment.assignedTo'] = { $in: team };
//     }
    
//     // Apply filters
//     if (status && status !== 'all') query.status = status;
//     if (priority && priority !== 'all') query.priority = priority;
//     if (assignedTo) query['assignment.assignedTo'] = assignedTo;
//     if (buildingId) query['location.buildingId'] = buildingId;
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { taskId: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     // Date range filter
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }
    
//     const skip = (page - 1) * limit;
//     const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
//     const [tasks, total] = await Promise.all([
//       Task.find(query)
//         .populate('assignment.assignedTo', 'firstName lastName email')
//         .populate('location.buildingId', 'name code')
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Task.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         tasks,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / limit)
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get tasks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET MY TASKS ====================
// exports.getMyTasks = async (req, res) => {
//   try {
//     const { status, priority } = req.query;
    
//     const query = {
//       'assignment.assignedTo': req.user._id,
//       status: { $nin: ['closed', 'cancelled'] },
//       isDeleted: { $ne: true }
//     };
    
//     if (status && status !== 'all') query.status = status;
//     if (priority && priority !== 'all') query.priority = priority;
    
//     const tasks = await Task.find(query)
//       .populate('location.buildingId', 'name code address')
//       .populate('assignment.assignedBy', 'name')
//       .populate('sourceId', 'title complaintNumber')
//       .sort({ priority: -1, slaDeadline: 1 });
    
//     // Get counts by status
//     const statusCounts = await Task.aggregate([
//       { $match: { 'assignment.assignedTo': req.user._id, isDeleted: false } },
//       { $group: { _id: '$status', count: { $sum: 1 } } }
//     ]);
    
//     const counts = {
//       pending: 0, assigned: 0, accepted: 0, in_progress: 0, 
//       waiting_parts: 0, waiting_approval: 0, completed: 0,
//       verified: 0, closed: 0, total: tasks.length
//     };
//     statusCounts.forEach(c => {
//       if (counts.hasOwnProperty(c._id)) counts[c._id] = c.count;
//     });
    
//     res.json({
//       success: true,
//       data: { tasks, counts }
//     });
//   } catch (error) {
//     console.error('Get my tasks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASK BY ID ====================
// exports.getTaskById = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id)
//       .populate('assignment.assignedTo', 'firstName lastName email phone technicianType')
//       .populate('assignment.assignedBy', 'firstName lastName email')
//       .populate('assignment.supervisorId', 'firstName lastName email')
//       .populate('assignment.managerId', 'firstName lastName email')
//       .populate('location.buildingId', 'name code address')
//       .populate('location.unitId', 'unitNumber floorNumber')
//       .populate('verification.verifiedBy', 'firstName lastName')
//       .populate('createdBy', 'firstName lastName email');
    
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     // Check authorization
//     if (req.user.role === 'technician' && task.assignment.assignedTo?._id?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, error: 'Unauthorized' });
//     }
    
//     res.json({
//       success: true,
//       data: task
//     });
//   } catch (error) {
//     console.error('Get task by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UPDATE TASK ====================
// exports.updateTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     updates.updatedBy = req.user._id;
//     updates.updatedAt = new Date();
    
//     // Don't allow updating certain fields
//     delete updates._id;
//     delete updates.taskId;
//     delete updates.createdBy;
//     delete updates.createdAt;
    
//     const task = await Task.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     );
    
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     await createActivityLog({
//       userId: req.user._id,
//       userName: getUserName(req.user),
//       userRole: req.user.role,
//       action: 'UPDATE_TASK',
//       entityType: 'task',
//       entityId: task._id,
//       entityName: task.title,
//       newData: updates,
//       ipAddress: req.ip
//     });
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Task updated successfully'
//     });
//   } catch (error) {
//     console.error('Update task error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== DELETE TASK (Soft Delete) ====================
// exports.deleteTask = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const task = await Task.findByIdAndUpdate(
//       id,
//       { isDeleted: true, deletedAt: new Date(), deletedBy: req.user._id },
//       { new: true }
//     );
    
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     await createActivityLog({
//       userId: req.user._id,
//       userName: getUserName(req.user),
//       userRole: req.user.role,
//       action: 'DELETE_TASK',
//       entityType: 'task',
//       entityId: task._id,
//       entityName: task.title,
//       oldData: { title: task.title, status: task.status },
//       ipAddress: req.ip
//     });
    
//     res.json({
//       success: true,
//       message: 'Task deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== ASSIGN TASK ====================
// exports.assignTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { technicianId } = req.body;
    
//     // 🔴 FIX: Validate technicianId
//     if (!technicianId || technicianId === '') {
//       return res.status(400).json({
//         success: false,
//         error: 'Technician ID is required'
//       });
//     }
    
//     const technician = await User.findById(technicianId);
//     if (!technician) {
//       return res.status(404).json({ success: false, error: 'Technician not found' });
//     }
    
//     // Check if user is a technician
//     if (technician.role !== 'technician') {
//       return res.status(400).json({
//         success: false,
//         error: 'Selected user is not a technician'
//       });
//     }
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     const oldTechnician = task.assignment?.assignedToName || 'Unassigned';
//     const technicianName = `${technician.firstName} ${technician.lastName}`.trim() || technician.email;
    
//     task.assignment = {
//       assignedTo: technicianId,
//       assignedToName: technicianName,
//       assignedBy: req.user._id,
//       assignedByRole: req.user.role,
//       assignedAt: new Date(),
//       reassignmentCount: (task.assignment?.reassignmentCount || 0) + (task.assignment?.assignedTo ? 1 : 0)
//     };
//     task.status = 'assigned';
//     await task.save();
    
//     // Send notification
//     try {
//       const io = getIO();
//       io.to(`user_${technicianId}`).emit('task_assigned', {
//         taskId: task._id,
//         title: task.title
//       });
      
//       await Notification.create({
//         userId: technicianId,
//         title: 'Task Assigned',
//         body: `Task "${task.title}" has been assigned to you.`,
//         type: 'task',
//         referenceId: task._id,
//         referenceModel: 'Task'
//       });
//     } catch (notifError) {
//       console.error('Failed to send notification:', notifError.message);
//     }
    
//     await createActivityLog({
//       userId: req.user._id,
//       userName: getUserName(req.user),
//       userRole: req.user.role,
//       action: 'ASSIGN_TASK',
//       entityType: 'task',
//       entityId: task._id,
//       entityName: task.title,
//       newData: { assignedTo: technicianName, previousTechnician: oldTechnician },
//       ipAddress: req.ip
//     });
    
//     res.json({
//       success: true,
//       data: task,
//       message: `Task assigned to ${technicianName}`
//     });
//   } catch (error) {
//     console.error('Assign task error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== AUTO-ASSIGN TASK (FIXED) ====================
// exports.autoAssignTask = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Find task
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         error: 'Task not found'
//       });
//     }
    
//     // Find available technicians
//     const technicians = await User.find({ 
//       role: 'technician', 
//       status: 'active',
//       isActive: true
//     });
    
//     if (technicians.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'No technicians available for assignment'
//       });
//     }
    
//     // Calculate workload for each technician
//     const workloads = await Promise.all(technicians.map(async (tech) => {
//       const activeTasks = await Task.countDocuments({
//         'assignment.assignedTo': tech._id,
//         status: { $in: ['assigned', 'accepted', 'in_progress'] },
//         isDeleted: false
//       });
//       return { technician: tech, activeTasks };
//     }));
    
//     // Sort by workload (least busy first)
//     workloads.sort((a, b) => a.activeTasks - b.activeTasks);
//     const bestTechnician = workloads[0].technician;
//     const technicianName = `${bestTechnician.firstName} ${bestTechnician.lastName}`.trim() || bestTechnician.email;
    
//     // Assign task
//     task.assignment = {
//       assignedTo: bestTechnician._id,
//       assignedToName: technicianName,
//       assignedBy: req.user._id,
//       assignedByRole: req.user.role,
//       assignedAt: new Date(),
//       reassignmentCount: (task.assignment?.reassignmentCount || 0) + (task.assignment?.assignedTo ? 1 : 0)
//     };
//     task.status = 'assigned';
//     await task.save();
    
//     // Send notification
//     try {
//       const io = getIO();
//       io.to(`user_${bestTechnician._id}`).emit('task_assigned', {
//         taskId: task._id,
//         title: task.title
//       });
      
//       await Notification.create({
//         userId: bestTechnician._id,
//         title: 'Task Assigned (Auto)',
//         body: `Task "${task.title}" has been auto-assigned to you based on workload.`,
//         type: 'task',
//         referenceId: task._id,
//         referenceModel: 'Task'
//       });
//     } catch (notifError) {
//       console.error('Failed to send notification:', notifError.message);
//     }
    
//     await createActivityLog({
//       userId: req.user._id,
//       userName: getUserName(req.user),
//       userRole: req.user.role,
//       action: 'ASSIGN_TASK',
//       entityType: 'task',
//       entityId: task._id,
//       entityName: task.title,
//       newData: { assignedTo: technicianName, autoAssigned: true, workloadScore: workloads[0].activeTasks },
//       ipAddress: req.ip
//     });
    
//     res.json({
//       success: true,
//       data: task,
//       message: `Task auto-assigned to ${technicianName} (${workloads[0].activeTasks} active tasks)`
//     });
//   } catch (error) {
//     console.error('Auto assign task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== REASSIGN TASK ====================
// exports.reassignTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { technicianId, reason } = req.body;
    
//     if (!technicianId || technicianId === '') {
//       return res.status(400).json({
//         success: false,
//         error: 'Technician ID is required'
//       });
//     }
    
//     const technician = await User.findById(technicianId);
//     if (!technician) {
//       return res.status(404).json({ success: false, error: 'Technician not found' });
//     }
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     const oldTechnician = task.assignment?.assignedToName || 'Unassigned';
//     const technicianName = `${technician.firstName} ${technician.lastName}`.trim() || technician.email;
    
//     task.assignment = {
//       ...task.assignment,
//       assignedTo: technicianId,
//       assignedToName: technicianName,
//       reassignmentCount: (task.assignment?.reassignmentCount || 0) + 1,
//       reassignmentReason: reason,
//       reassignedAt: new Date()
//     };
//     task.status = 'assigned';
//     await task.save();
    
//     await createActivityLog({
//       userId: req.user._id,
//       userName: getUserName(req.user),
//       userRole: req.user.role,
//       action: 'ASSIGN_TASK',
//       entityType: 'task',
//       entityId: task._id,
//       entityName: task.title,
//       newData: { assignedTo: technicianName, previousTechnician: oldTechnician, reason },
//       ipAddress: req.ip
//     });
    
//     res.json({
//       success: true,
//       data: task,
//       message: `Task reassigned from ${oldTechnician} to ${technicianName}`
//     });
//   } catch (error) {
//     console.error('Reassign task error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== ACCEPT TASK ====================
// exports.acceptTask = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (task.assignment.assignedTo?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, error: 'Task not assigned to you' });
//     }
    
//     if (task.status !== 'assigned') {
//       return res.status(400).json({ success: false, error: 'Task cannot be accepted' });
//     }
    
//     task.status = 'accepted';
//     task.timeline.acceptedAt = new Date();
//     await task.save();
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Task accepted successfully'
//     });
//   } catch (error) {
//     console.error('Accept task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== START TASK ====================
// exports.startTask = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (task.assignment.assignedTo?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, error: 'Task not assigned to you' });
//     }
    
//     if (task.status !== 'accepted') {
//       return res.status(400).json({ success: false, error: 'Task cannot be started' });
//     }
    
//     task.status = 'in_progress';
//     task.timeline.startedAt = new Date();
//     task.progress.percentage = 10;
//     await task.save();
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Task started successfully'
//     });
//   } catch (error) {
//     console.error('Start task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UPDATE PROGRESS ====================
// exports.updateProgress = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { percentage } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (task.assignment.assignedTo?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, error: 'Task not assigned to you' });
//     }
    
//     task.progress.percentage = Math.min(100, Math.max(0, percentage));
//     task.progress.lastUpdatedAt = new Date();
//     task.progress.updatedBy = req.user._id;
//     await task.save();
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Progress updated successfully'
//     });
//   } catch (error) {
//     console.error('Update progress error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UPDATE CHECKLIST ====================
// exports.updateChecklist = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { itemId, completed, imageAfter, notes } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     const checklistItem = task.checklist.id(itemId);
//     if (!checklistItem) {
//       return res.status(404).json({ success: false, error: 'Checklist item not found' });
//     }
    
//     checklistItem.completed = completed;
//     checklistItem.completedBy = req.user._id;
//     checklistItem.completedAt = new Date();
//     if (imageAfter) checklistItem.imageAfter = imageAfter;
//     if (notes) checklistItem.notes = notes;
    
//     // Update progress percentage
//     const completedItems = task.checklist.filter(item => item.completed).length;
//     task.progress.percentage = Math.round((completedItems / task.checklist.length) * 100);
//     task.progress.lastUpdatedAt = new Date();
    
//     await task.save();
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Checklist updated successfully'
//     });
//   } catch (error) {
//     console.error('Update checklist error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UPLOAD EVIDENCE ====================
// exports.uploadEvidence = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { images, videos } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (images && images.length) {
//       images.forEach(img => {
//         task.evidence.afterImages.push({
//           url: img,
//           uploadedBy: req.user._id,
//           uploadedAt: new Date(),
//           description: 'Work completion evidence'
//         });
//       });
//     }
    
//     if (videos && videos.length) {
//       videos.forEach(vid => {
//         task.evidence.videos.push({
//           url: vid,
//           uploadedBy: req.user._id,
//           uploadedAt: new Date()
//         });
//       });
//     }
    
//     await task.save();
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Evidence uploaded successfully'
//     });
//   } catch (error) {
//     console.error('Upload evidence error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== COMPLETE TASK ====================
// exports.completeTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { completionNotes, afterImages } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (task.assignment.assignedTo?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, error: 'Task not assigned to you' });
//     }
    
//     if (task.status !== 'in_progress') {
//       return res.status(400).json({ success: false, error: 'Task cannot be completed' });
//     }
    
//     task.status = 'completed';
//     task.timeline.completedAt = new Date();
//     task.progress.percentage = 100;
    
//     if (completionNotes) {
//       task.technicianNotes.push({
//         note: completionNotes,
//         createdBy: req.user._id,
//         createdAt: new Date()
//       });
//     }
    
//     if (afterImages && afterImages.length) {
//       afterImages.forEach(img => {
//         task.evidence.afterImages.push({
//           url: img,
//           uploadedBy: req.user._id,
//           uploadedAt: new Date(),
//           description: 'Completion evidence'
//         });
//       });
//     }
    
//     await task.save();
    
//     // Notify supervisor
//     if (task.assignment.supervisorId) {
//       try {
//         const io = getIO();
//         io.to(`user_${task.assignment.supervisorId}`).emit('task_completed', {
//           taskId: task._id,
//           title: task.title
//         });
//       } catch (socketError) {
//         console.error('Failed to send socket notification:', socketError.message);
//       }
//     }
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Task completed successfully. Pending verification.'
//     });
//   } catch (error) {
//     console.error('Complete task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== VERIFY TASK ====================
// exports.verifyTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { rating, notes, approved } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (!['supervisor', 'manager', 'admin', 'super_admin'].includes(req.user.role)) {
//       return res.status(403).json({ success: false, error: 'Not authorized to verify tasks' });
//     }
    
//     if (approved) {
//       task.status = 'verified';
//       task.verification = {
//         verifiedBy: req.user._id,
//         verifiedAt: new Date(),
//         notes,
//         rating,
//         reworkCount: task.verification?.reworkCount || 0
//       };
//       task.timeline.verifiedAt = new Date();
//       task.status = 'closed';
//       task.timeline.closedAt = new Date();
//     } else {
//       task.status = 'assigned';
//       task.rejection = {
//         reason: notes,
//         rejectedBy: req.user._id,
//         rejectedAt: new Date(),
//         reworkInstructions: notes
//       };
//       task.verification = {
//         ...task.verification,
//         reworkCount: (task.verification?.reworkCount || 0) + 1
//       };
//     }
    
//     await task.save();
    
//     // Notify technician
//     try {
//       const io = getIO();
//       io.to(`user_${task.assignment.assignedTo}`).emit('task_verified', {
//         taskId: task._id,
//         approved,
//         notes
//       });
//     } catch (socketError) {
//       console.error('Failed to send socket notification:', socketError.message);
//     }
    
//     res.json({
//       success: true,
//       data: task,
//       message: approved ? 'Task verified and closed' : 'Task rejected for rework'
//     });
//   } catch (error) {
//     console.error('Verify task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== REJECT TASK ====================
// exports.rejectTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (!['supervisor', 'manager', 'admin', 'super_admin'].includes(req.user.role)) {
//       return res.status(403).json({ success: false, error: 'Not authorized to reject tasks' });
//     }
    
//     task.status = 'assigned';
//     task.rejection = {
//       reason: reason,
//       rejectedBy: req.user._id,
//       rejectedAt: new Date(),
//       reworkInstructions: reason
//     };
//     task.verification = {
//       ...task.verification,
//       reworkCount: (task.verification?.reworkCount || 0) + 1
//     };
//     await task.save();
    
//     // Notify technician
//     try {
//       const io = getIO();
//       io.to(`user_${task.assignment.assignedTo}`).emit('task_rejected', {
//         taskId: task._id,
//         reason
//       });
//     } catch (socketError) {
//       console.error('Failed to send socket notification:', socketError.message);
//     }
    
//     res.json({
//       success: true,
//       data: task,
//       message: 'Task rejected for rework'
//     });
//   } catch (error) {
//     console.error('Reject task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET OVERDUE TASKS ====================
// exports.getOverdueTasks = async (req, res) => {
//   try {
//     const tasks = await Task.findOverdue()
//       .populate('assignment.assignedTo', 'name email')
//       .populate('location.buildingId', 'name');
    
//     res.json({
//       success: true,
//       data: tasks
//     });
//   } catch (error) {
//     console.error('Get overdue tasks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASK STATISTICS ====================
// exports.getTaskStatistics = async (req, res) => {
//   try {
//     const statusCounts = await Task.getStatusCounts();
//     const priorityCounts = await Task.getPriorityCounts();
//     const overdueTasks = await Task.countDocuments({ 
//       slaDeadline: { $lt: new Date() }, 
//       status: { $nin: ['closed', 'cancelled', 'verified', 'completed'] },
//       isDeleted: false 
//     });
    
//     // Calculate average completion time
//     const avgResult = await Task.aggregate([
//       {
//         $match: {
//           'timeline.completedAt': { $exists: true },
//           'timeline.startedAt': { $exists: true },
//           isDeleted: false
//         }
//       },
//       {
//         $project: {
//           duration: {
//             $divide: [
//               { $subtract: ['$timeline.completedAt', '$timeline.startedAt'] },
//               1000 * 60
//             ]
//           }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           avgDuration: { $avg: '$duration' }
//         }
//       }
//     ]);
    
//     const avgCompletionTime = Math.round(avgResult[0]?.avgDuration || 0);
    
//     res.json({
//       success: true,
//       data: {
//         status: statusCounts,
//         priority: priorityCounts,
//         overdue: overdueTasks,
//         total: statusCounts.total,
//         avgCompletionTime
//       }
//     });
//   } catch (error) {
//     console.error('Get task statistics error:', error);
//     res.json({
//       success: true,
//       data: {
//         status: { pending: 0, assigned: 0, in_progress: 0, completed: 0, total: 0 },
//         priority: { critical: 0, high: 0, medium: 0, low: 0 },
//         overdue: 0,
//         total: 0,
//         avgCompletionTime: 0
//       }
//     });
//   }
// };

// // ==================== GET AVAILABLE TECHNICIANS ====================
// exports.getAvailableTechnicians = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     const technicians = await User.find({ role: 'technician', isActive: true, status: 'active' })
//       .select('firstName lastName email phone technicianType');
    
//     const availableTechnicians = await Promise.all(technicians.map(async (tech) => {
//       const activeTasks = await Task.countDocuments({
//         'assignment.assignedTo': tech._id,
//         status: { $in: ['assigned', 'accepted', 'in_progress'] },
//         isDeleted: false
//       });
      
//       const pendingTasks = await Task.countDocuments({
//         'assignment.assignedTo': tech._id,
//         status: 'assigned',
//         isDeleted: false
//       });
      
//       return {
//         _id: tech._id,
//         firstName: tech.firstName,
//         lastName: tech.lastName,
//         name: `${tech.firstName} ${tech.lastName}`.trim(),
//         email: tech.email,
//         phone: tech.phone,
//         technicianType: tech.technicianType,
//         currentWorkload: {
//           activeTasks,
//           pendingTasks,
//           available: activeTasks < 5
//         }
//       };
//     }));
    
//     // Sort by workload (least busy first)
//     availableTechnicians.sort((a, b) => a.currentWorkload.activeTasks - b.currentWorkload.activeTasks);
    
//     res.json({
//       success: true,
//       data: availableTechnicians,
//       count: availableTechnicians.length
//     });
//   } catch (error) {
//     console.error('Get available technicians error:', error);
//     res.status(500).json({ success: false, error: error.message, data: [] });
//   }
// };

// // ==================== GET TECHNICIAN WORKLOAD ====================
// exports.getTechnicianWorkload = async (req, res) => {
//   try {
//     const { technicianId } = req.params;
    
//     const technician = await User.findById(technicianId);
//     if (!technician) {
//       return res.status(404).json({ success: false, error: 'Technician not found' });
//     }
    
//     const activeTasks = await Task.countDocuments({
//       'assignment.assignedTo': technicianId,
//       status: { $in: ['assigned', 'accepted', 'in_progress'] },
//       isDeleted: false
//     });
    
//     const pendingTasks = await Task.countDocuments({
//       'assignment.assignedTo': technicianId,
//       status: 'assigned',
//       isDeleted: false
//     });
    
//     const completedToday = await Task.countDocuments({
//       'assignment.assignedTo': technicianId,
//       status: 'completed',
//       'timeline.completedAt': { $gte: new Date().setHours(0, 0, 0, 0) },
//       isDeleted: false
//     });
    
//     const overdueTasks = await Task.countDocuments({
//       'assignment.assignedTo': technicianId,
//       slaBreached: true,
//       status: { $nin: ['closed', 'cancelled'] },
//       isDeleted: false
//     });
    
//     res.json({
//       success: true,
//       data: {
//         technician: {
//           id: technician._id,
//           name: `${technician.firstName} ${technician.lastName}`.trim(),
//           technicianType: technician.technicianType
//         },
//         workload: {
//           activeTasks,
//           pendingTasks,
//           completedToday,
//           overdueTasks,
//           capacityPercentage: Math.min(100, (activeTasks / 5) * 100)
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get technician workload error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET ASSIGNMENT HISTORY ====================
// exports.getAssignmentHistory = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const task = await Task.findById(id)
//       .populate('assignment.assignedTo', 'firstName lastName')
//       .populate('assignment.assignedBy', 'firstName lastName');
    
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     res.json({
//       success: true,
//       data: {
//         currentAssignment: task.assignment,
//         reassignmentCount: task.assignment?.reassignmentCount || 0,
//         reassignmentReason: task.assignment?.reassignmentReason
//       }
//     });
//   } catch (error) {
//     console.error('Get assignment history error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET DAILY PROGRESS ====================
// exports.getDailyProgress = async (req, res) => {
//   try {
//     const { technicianId } = req.params;
//     const { date } = req.query;
    
//     const targetDate = date ? new Date(date) : new Date();
//     const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    
//     const tasks = await Task.find({
//       'assignment.assignedTo': technicianId,
//       createdAt: { $gte: startOfDay, $lte: endOfDay },
//       isDeleted: false
//     });
    
//     const completedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'verified');
//     const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
//     const pendingTasks = tasks.filter(t => t.status === 'assigned');
    
//     const totalTimeSpent = tasks.reduce((sum, task) => {
//       return sum + (task.timeTracking?.timeSpent || 0);
//     }, 0);
    
//     res.json({
//       success: true,
//       data: {
//         date: startOfDay,
//         summary: {
//           totalTasks: tasks.length,
//           completedTasks: completedTasks.length,
//           inProgressTasks: inProgressTasks.length,
//           pendingTasks: pendingTasks.length,
//           totalTimeSpent: totalTimeSpent
//         },
//         tasks: tasks.map(t => ({
//           id: t._id,
//           taskId: t.taskId,
//           title: t.title,
//           status: t.status,
//           priority: t.priority,
//           timeSpent: t.timeTracking?.timeSpent || 0
//         }))
//       }
//     });
//   } catch (error) {
//     console.error('Get daily progress error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASKS BY STATUS ====================
// exports.getTasksByStatus = async (req, res) => {
//   try {
//     const { status } = req.params;
    
//     const query = { status, isDeleted: false };
    
//     if (req.user.role === 'technician') {
//       query['assignment.assignedTo'] = req.user._id;
//     }
    
//     const tasks = await Task.find(query)
//       .populate('assignment.assignedTo', 'name')
//       .populate('location.buildingId', 'name')
//       .sort({ createdAt: -1 });
    
//     res.json({
//       success: true,
//       data: tasks
//     });
//   } catch (error) {
//     console.error('Get tasks by status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASKS BY PRIORITY ====================
// exports.getTasksByPriority = async (req, res) => {
//   try {
//     const { priority } = req.params;
    
//     const query = { priority, isDeleted: false };
    
//     if (req.user.role === 'technician') {
//       query['assignment.assignedTo'] = req.user._id;
//     }
    
//     const tasks = await Task.find(query)
//       .populate('assignment.assignedTo', 'name')
//       .populate('location.buildingId', 'name')
//       .sort({ slaDeadline: 1 });
    
//     res.json({
//       success: true,
//       data: tasks
//     });
//   } catch (error) {
//     console.error('Get tasks by priority error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASKS BY BUILDING ====================
// exports.getTasksByBuilding = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
    
//     const tasks = await Task.find({ 
//       'location.buildingId': buildingId,
//       isDeleted: false 
//     })
//       .populate('assignment.assignedTo', 'name')
//       .sort({ priority: -1, createdAt: -1 });
    
//     res.json({
//       success: true,
//       data: tasks
//     });
//   } catch (error) {
//     console.error('Get tasks by building error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASKS BY TECHNICIAN ====================
// exports.getTasksByTechnician = async (req, res) => {
//   try {
//     const { technicianId } = req.params;
    
//     const tasks = await Task.find({ 
//       'assignment.assignedTo': technicianId,
//       isDeleted: false 
//     })
//       .populate('location.buildingId', 'name')
//       .sort({ createdAt: -1 });
    
//     res.json({
//       success: true,
//       data: tasks
//     });
//   } catch (error) {
//     console.error('Get tasks by technician error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== EXPORT TASKS TO CSV ====================
// exports.exportTasksToCSV = async (req, res) => {
//   try {
//     const tasks = await Task.find({ isDeleted: false })
//       .populate('assignment.assignedTo', 'name')
//       .populate('location.buildingId', 'name');
    
//     const csvData = tasks.map(task => ({
//       'Task ID': task.taskId,
//       'Title': task.title,
//       'Status': task.status,
//       'Priority': task.priority,
//       'Assigned To': task.assignment?.assignedToName || 'Unassigned',
//       'Building': task.location?.buildingName || 'N/A',
//       'Created At': task.createdAt.toISOString(),
//       'SLA Deadline': task.slaDeadline?.toISOString() || 'N/A',
//       'Completed At': task.timeline?.completedAt?.toISOString() || 'N/A'
//     }));
    
//     res.json({
//       success: true,
//       data: csvData
//     });
//   } catch (error) {
//     console.error('Export tasks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASK PROGRESS (Fallback) ====================
// exports.getTaskProgress = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const task = await Task.findById(id).select('progress timeline checklist');
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     res.json({
//       success: true,
//       data: {
//         progress: task.progress,
//         timeline: task.timeline,
//         checklist: task.checklist
//       }
//     });
//   } catch (error) {
//     console.error('Get task progress error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== EXPORTS ====================
// module.exports = {
//   // Core CRUD
//   createTask: exports.createTask,
//   getTasks: exports.getTasks,
//   getTaskList: exports.getTaskList,
//   getMyTasks: exports.getMyTasks,
//   getTaskById: exports.getTaskById,
//   updateTask: exports.updateTask,
//   deleteTask: exports.deleteTask,
  
//   // Assignment
//   assignTask: exports.assignTask,
//   autoAssignTask: exports.autoAssignTask,
//   reassignTask: exports.reassignTask,
//   getAssignmentHistory: exports.getAssignmentHistory,
//   getTechnicianWorkload: exports.getTechnicianWorkload,
//   getDailyProgress: exports.getDailyProgress,
  
//   // Progress & Status
//   acceptTask: exports.acceptTask,
//   startTask: exports.startTask,
//   updateProgress: exports.updateProgress,
//   updateChecklist: exports.updateChecklist,
//   uploadEvidence: exports.uploadEvidence,
//   completeTask: exports.completeTask,
//   verifyTask: exports.verifyTask,
//   rejectTask: exports.rejectTask,
//   getTaskProgress: exports.getTaskProgress,
  
//   // Filters & Utilities
//   getTasksByStatus: exports.getTasksByStatus,
//   getTasksByPriority: exports.getTasksByPriority,
//   getTasksByBuilding: exports.getTasksByBuilding,
//   getTasksByTechnician: exports.getTasksByTechnician,
//   getOverdueTasks: exports.getOverdueTasks,
//   getTaskStatistics: exports.getTaskStatistics,
//   getAvailableTechnicians: exports.getAvailableTechnicians,
  
//   // Export
//   exportTasksToCSV: exports.exportTasksToCSV
// };








// // server/src/controllers/task.controller.js
// const Task = require('../models/Task.model');
// const User = require('../models/User.model');
// const Notification = require('../models/Notification.model');
// const ActivityLog = require('../models/ActivityLog.model');
// const { getIO } = require('../config/socketio');
// const { logger } = require('../utils/logger');

// // Helper function to get user name safely
// const getUserName = (user) => {
//   if (!user) return 'Unknown';
//   return user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown';
// };

// // Helper function to create activity log safely
// const createActivityLog = async (data) => {
//   try {
//     await ActivityLog.create({
//       userId: data.userId,
//       userName: data.userName || 'Unknown',
//       userRole: data.userRole || 'user',
//       userEmail: data.userEmail || '',
//       action: data.action,
//       entityType: data.entityType,
//       entityId: data.entityId ? data.entityId.toString() : '',
//       entityName: data.entityName || '',
//       oldData: data.oldData || null,
//       newData: data.newData || null,
//       ipAddress: data.ipAddress || '',
//       status: 'success'
//     });
//   } catch (error) {
//     console.error('Failed to create activity log:', error.message);
//   }
// };

// // ==================== CREATE TASK ====================
// exports.createTask = async (req, res) => {
//   try {
//     const taskData = req.body;
//     taskData.createdBy = req.user._id;
    
//     // Validate required fields
//     const requiredFields = ['title', 'description', 'priority'];
//     const missingFields = requiredFields.filter(field => !taskData[field]);
    
//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: `Missing required fields: ${missingFields.join(', ')}`
//       });
//     }
    
//     // Generate unique task ID
//     const taskCount = await Task.countDocuments();
//     taskData.taskId = `TSK${new Date().getFullYear()}${String(taskCount + 1).padStart(5, '0')}`;
    
//     // Calculate SLA deadline based on priority
//     const slaMinutes = { critical: 60, high: 240, medium: 480, low: 1440 };
//     const deadlineMinutes = slaMinutes[taskData.priority] || 480;
//     taskData.slaDeadline = new Date(Date.now() + deadlineMinutes * 60 * 1000);
    
//     taskData.status = taskData.status || 'pending';
    
//     // Set assignment if technician provided
//     if (taskData.assignedTo && taskData.assignedTo !== '') {
//       const technician = await User.findById(taskData.assignedTo);
//       if (technician) {
//         taskData.assignment = {
//           assignedTo: taskData.assignedTo,
//           assignedToName: `${technician.firstName} ${technician.lastName}`.trim() || technician.email,
//           assignedBy: req.user._id,
//           assignedAt: new Date(),
//           reassignmentCount: 0
//         };
//         taskData.status = 'assigned';
//       }
//     }
    
//     const task = new Task(taskData);
//     await task.save();
    
//     // Send notification if assigned
//     if (taskData.assignedTo && taskData.assignedTo !== '') {
//       try {
//         const io = getIO();
//         io.to(`user_${taskData.assignedTo}`).emit('new_task', {
//           taskId: task._id,
//           title: task.title,
//           priority: task.priority
//         });
//       } catch (notifError) {
//         console.error('Failed to send notification:', notifError.message);
//       }
//     }
    
//     res.status(201).json({
//       success: true,
//       data: task,
//       message: 'Task created successfully'
//     });
//   } catch (error) {
//     console.error('Create task error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASK LIST ====================
// exports.getTaskList = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       status,
//       priority,
//       assignedTo,
//       buildingId,
//       search,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;
    
//     const query = { isDeleted: { $ne: true } };
    
//     // Role-based filtering
//     if (req.user.role === 'technician') {
//       query['assignment.assignedTo'] = req.user._id;
//     }
    
//     if (status && status !== 'all') query.status = status;
//     if (priority && priority !== 'all') query.priority = priority;
//     if (assignedTo) query['assignment.assignedTo'] = assignedTo;
//     if (buildingId) query['location.buildingId'] = buildingId;
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { taskId: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     const skip = (page - 1) * limit;
//     const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
//     const [tasks, total] = await Promise.all([
//       Task.find(query)
//         .populate('assignment.assignedTo', 'firstName lastName email')
//         .populate('location.buildingId', 'name code')
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Task.countDocuments(query)
//     ]);
    
//     const overdueTasks = await Task.countDocuments({ 
//       slaDeadline: { $lt: new Date() }, 
//       status: { $nin: ['closed', 'cancelled', 'verified', 'completed'] },
//       isDeleted: false 
//     });
    
//     res.json({
//       success: true,
//       data: { tasks },
//       stats: { overdue: overdueTasks, total },
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error('Get task list error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASKS ====================
// exports.getTasks = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, status, priority } = req.query;
//     const query = { isDeleted: { $ne: true } };
    
//     if (req.user.role === 'technician') {
//       query['assignment.assignedTo'] = req.user._id;
//     }
    
//     if (status && status !== 'all') query.status = status;
//     if (priority && priority !== 'all') query.priority = priority;
    
//     const skip = (page - 1) * limit;
    
//     const [tasks, total] = await Promise.all([
//       Task.find(query)
//         .populate('assignment.assignedTo', 'firstName lastName email')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Task.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: { tasks },
//       pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
//     });
//   } catch (error) {
//     console.error('Get tasks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET MY TASKS ====================
// exports.getMyTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({
//       'assignment.assignedTo': req.user._id,
//       isDeleted: { $ne: true }
//     })
//       .populate('location.buildingId', 'name code')
//       .sort({ priority: -1, createdAt: -1 });
    
//     const counts = {
//       pending: tasks.filter(t => t.status === 'pending').length,
//       assigned: tasks.filter(t => t.status === 'assigned').length,
//       accepted: tasks.filter(t => t.status === 'accepted').length,
//       in_progress: tasks.filter(t => t.status === 'in_progress').length,
//       completed: tasks.filter(t => t.status === 'completed').length,
//       verified: tasks.filter(t => t.status === 'verified').length,
//       total: tasks.length
//     };
    
//     res.json({ success: true, data: { tasks, counts } });
//   } catch (error) {
//     console.error('Get my tasks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASK BY ID ====================
// exports.getTaskById = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id)
//       .populate('assignment.assignedTo', 'firstName lastName email')
//       .populate('assignment.assignedBy', 'firstName lastName email')
//       .populate('location.buildingId', 'name code address')
//       .populate('verification.verifiedBy', 'firstName lastName');
    
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     res.json({ success: true, data: task });
//   } catch (error) {
//     console.error('Get task by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UPDATE TASK ====================
// exports.updateTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     updates.updatedAt = new Date();
    
//     const task = await Task.findByIdAndUpdate(id, updates, { new: true });
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     res.json({ success: true, data: task, message: 'Task updated successfully' });
//   } catch (error) {
//     console.error('Update task error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== DELETE TASK ====================
// exports.deleteTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const task = await Task.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
    
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     res.json({ success: true, message: 'Task deleted successfully' });
//   } catch (error) {
//     console.error('Delete task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== ASSIGN TASK ====================
// exports.assignTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { technicianId } = req.body;
    
//     console.log('📋 Assigning task:', id, 'to technician:', technicianId);
    
//     if (!technicianId || technicianId === '') {
//       return res.status(400).json({ success: false, error: 'Technician ID is required' });
//     }
    
//     const technician = await User.findById(technicianId);
//     if (!technician) {
//       return res.status(404).json({ success: false, error: 'Technician not found' });
//     }
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     const technicianName = `${technician.firstName} ${technician.lastName}`.trim() || technician.email;
    
//     task.assignment = {
//       assignedTo: technicianId,
//       assignedToName: technicianName,
//       assignedBy: req.user._id,
//       assignedByRole: req.user.role,
//       assignedAt: new Date(),
//       reassignmentCount: (task.assignment?.reassignmentCount || 0) + (task.assignment?.assignedTo ? 1 : 0)
//     };
//     task.status = 'assigned';
    
//     await task.save();
//     console.log('✅ Task assigned successfully');
    
//     res.json({ success: true, data: task, message: `Task assigned to ${technicianName}` });
//   } catch (error) {
//     console.error('Assign task error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== AUTO-ASSIGN TASK ====================
// exports.autoAssignTask = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     // Find all active technicians
//     const technicians = await User.find({ 
//       role: 'technician', 
//       status: 'active',
//       isActive: true
//     });
    
//     console.log(`📊 Found ${technicians.length} technicians`);
    
//     if (technicians.length === 0) {
//       return res.status(400).json({ success: false, error: 'No technicians available for assignment' });
//     }
    
//     // Calculate workload
//     const workloads = await Promise.all(technicians.map(async (tech) => {
//       const activeTasks = await Task.countDocuments({
//         'assignment.assignedTo': tech._id,
//         status: { $in: ['assigned', 'accepted', 'in_progress'] },
//         isDeleted: false
//       });
//       return { technician: tech, activeTasks };
//     }));
    
//     workloads.sort((a, b) => a.activeTasks - b.activeTasks);
//     const bestTechnician = workloads[0].technician;
//     const technicianName = `${bestTechnician.firstName} ${bestTechnician.lastName}`.trim() || bestTechnician.email;
    
//     task.assignment = {
//       assignedTo: bestTechnician._id,
//       assignedToName: technicianName,
//       assignedBy: req.user._id,
//       assignedByRole: req.user.role,
//       assignedAt: new Date(),
//       reassignmentCount: (task.assignment?.reassignmentCount || 0) + (task.assignment?.assignedTo ? 1 : 0)
//     };
//     task.status = 'assigned';
//     await task.save();
    
//     res.json({ success: true, data: task, message: `Task auto-assigned to ${technicianName}` });
//   } catch (error) {
//     console.error('Auto assign task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== REASSIGN TASK ====================
// exports.reassignTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { technicianId, reason } = req.body;
    
//     if (!technicianId || technicianId === '') {
//       return res.status(400).json({ success: false, error: 'Technician ID is required' });
//     }
    
//     const technician = await User.findById(technicianId);
//     if (!technician) {
//       return res.status(404).json({ success: false, error: 'Technician not found' });
//     }
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     const technicianName = `${technician.firstName} ${technician.lastName}`.trim() || technician.email;
    
//     task.assignment = {
//       ...task.assignment,
//       assignedTo: technicianId,
//       assignedToName: technicianName,
//       reassignmentCount: (task.assignment?.reassignmentCount || 0) + 1,
//       reassignmentReason: reason,
//       reassignedAt: new Date()
//     };
//     task.status = 'assigned';
//     await task.save();
    
//     res.json({ success: true, data: task, message: `Task reassigned to ${technicianName}` });
//   } catch (error) {
//     console.error('Reassign task error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // ==================== ACCEPT TASK ====================
// exports.acceptTask = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (task.assignment.assignedTo?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, error: 'Task not assigned to you' });
//     }
    
//     if (task.status !== 'assigned') {
//       return res.status(400).json({ success: false, error: 'Task cannot be accepted' });
//     }
    
//     task.status = 'accepted';
//     task.timeline = { ...task.timeline, acceptedAt: new Date() };
//     await task.save();
    
//     res.json({ success: true, data: task, message: 'Task accepted successfully' });
//   } catch (error) {
//     console.error('Accept task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== START TASK ====================
// exports.startTask = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (task.assignment.assignedTo?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, error: 'Task not assigned to you' });
//     }
    
//     if (task.status !== 'accepted') {
//       return res.status(400).json({ success: false, error: 'Task cannot be started' });
//     }
    
//     task.status = 'in_progress';
//     task.timeline = { ...task.timeline, startedAt: new Date() };
//     task.progress = { percentage: 10, lastUpdatedAt: new Date(), updatedBy: req.user._id };
//     await task.save();
    
//     res.json({ success: true, data: task, message: 'Task started successfully' });
//   } catch (error) {
//     console.error('Start task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UPDATE PROGRESS ====================
// exports.updateProgress = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { percentage } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     task.progress = {
//       percentage: Math.min(100, Math.max(0, percentage)),
//       lastUpdatedAt: new Date(),
//       updatedBy: req.user._id
//     };
//     await task.save();
    
//     res.json({ success: true, data: task, message: 'Progress updated successfully' });
//   } catch (error) {
//     console.error('Update progress error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UPDATE CHECKLIST ====================
// exports.updateChecklist = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { itemId, completed, imageAfter, notes } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     const checklistItem = task.checklist.id(itemId);
//     if (!checklistItem) {
//       return res.status(404).json({ success: false, error: 'Checklist item not found' });
//     }
    
//     checklistItem.completed = completed;
//     checklistItem.completedBy = req.user._id;
//     checklistItem.completedAt = new Date();
//     if (imageAfter) checklistItem.imageAfter = imageAfter;
//     if (notes) checklistItem.notes = notes;
    
//     const completedItems = task.checklist.filter(item => item.completed).length;
//     task.progress.percentage = Math.round((completedItems / task.checklist.length) * 100);
//     await task.save();
    
//     res.json({ success: true, data: task, message: 'Checklist updated successfully' });
//   } catch (error) {
//     console.error('Update checklist error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== UPLOAD EVIDENCE ====================
// exports.uploadEvidence = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { images, videos } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (images && images.length) {
//       images.forEach(img => {
//         task.evidence.afterImages.push({
//           url: img,
//           uploadedBy: req.user._id,
//           uploadedAt: new Date(),
//           description: 'Work evidence'
//         });
//       });
//     }
    
//     if (videos && videos.length) {
//       videos.forEach(vid => {
//         task.evidence.videos.push({
//           url: vid,
//           uploadedBy: req.user._id,
//           uploadedAt: new Date()
//         });
//       });
//     }
    
//     await task.save();
//     res.json({ success: true, data: task, message: 'Evidence uploaded successfully' });
//   } catch (error) {
//     console.error('Upload evidence error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== COMPLETE TASK ====================
// exports.completeTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { completionNotes, afterImages } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (task.status !== 'in_progress') {
//       return res.status(400).json({ success: false, error: 'Task cannot be completed' });
//     }
    
//     task.status = 'completed';
//     task.timeline = { ...task.timeline, completedAt: new Date() };
//     task.progress = { percentage: 100, lastUpdatedAt: new Date(), updatedBy: req.user._id };
    
//     if (completionNotes) {
//       task.technicianNotes = task.technicianNotes || [];
//       task.technicianNotes.push({
//         note: completionNotes,
//         createdBy: req.user._id,
//         createdAt: new Date()
//       });
//     }
    
//     if (afterImages && afterImages.length) {
//       afterImages.forEach(img => {
//         task.evidence.afterImages.push({
//           url: img,
//           uploadedBy: req.user._id,
//           uploadedAt: new Date(),
//           description: 'Completion evidence'
//         });
//       });
//     }
    
//     await task.save();
    
//     res.json({ success: true, data: task, message: 'Task completed. Pending verification.' });
//   } catch (error) {
//     console.error('Complete task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== VERIFY TASK ====================
// exports.verifyTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { rating, notes, approved } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     if (approved) {
//       task.status = 'verified';
//       task.verification = {
//         verifiedBy: req.user._id,
//         verifiedAt: new Date(),
//         notes,
//         rating,
//         reworkCount: task.verification?.reworkCount || 0
//       };
//       task.timeline = { ...task.timeline, verifiedAt: new Date() };
//       task.status = 'closed';
//       task.timeline = { ...task.timeline, closedAt: new Date() };
//     } else {
//       task.status = 'assigned';
//       task.rejection = {
//         reason: notes,
//         rejectedBy: req.user._id,
//         rejectedAt: new Date(),
//         reworkInstructions: notes
//       };
//       task.verification = {
//         ...task.verification,
//         reworkCount: (task.verification?.reworkCount || 0) + 1
//       };
//     }
    
//     await task.save();
    
//     res.json({ success: true, data: task, message: approved ? 'Task verified and closed' : 'Task rejected for rework' });
//   } catch (error) {
//     console.error('Verify task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== REJECT TASK ====================
// exports.rejectTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     task.status = 'assigned';
//     task.rejection = {
//       reason: reason,
//       rejectedBy: req.user._id,
//       rejectedAt: new Date(),
//       reworkInstructions: reason
//     };
//     task.verification = {
//       ...task.verification,
//       reworkCount: (task.verification?.reworkCount || 0) + 1
//     };
//     await task.save();
    
//     res.json({ success: true, data: task, message: 'Task rejected for rework' });
//   } catch (error) {
//     console.error('Reject task error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASK STATISTICS ====================
// exports.getTaskStatistics = async (req, res) => {
//   try {
//     const statusCounts = await Task.aggregate([
//       { $match: { isDeleted: false } },
//       { $group: { _id: '$status', count: { $sum: 1 } } }
//     ]);
    
//     const priorityCounts = await Task.aggregate([
//       { $match: { isDeleted: false } },
//       { $group: { _id: '$priority', count: { $sum: 1 } } }
//     ]);
    
//     const stats = { pending: 0, assigned: 0, in_progress: 0, completed: 0, total: 0 };
//     statusCounts.forEach(s => { if (stats[s._id] !== undefined) stats[s._id] = s.count; });
//     stats.total = Object.values(stats).reduce((a, b) => a + b, 0);
    
//     const priority = { critical: 0, high: 0, medium: 0, low: 0 };
//     priorityCounts.forEach(p => { if (priority[p._id] !== undefined) priority[p._id] = p.count; });
    
//     res.json({ success: true, data: { status: stats, priority, overdue: 0 } });
//   } catch (error) {
//     console.error('Get task statistics error:', error);
//     res.json({ success: true, data: { status: { total: 0 }, priority: {}, overdue: 0 } });
//   }
// };

// // ==================== GET AVAILABLE TECHNICIANS ====================
// exports.getAvailableTechnicians = async (req, res) => {
//   try {
//     console.log('🔍 Fetching available technicians...');
    
//     const technicians = await User.find({ 
//       role: 'technician',
//       status: 'active',
//       isActive: true
//     }).select('firstName lastName email phone employeeId');
    
//     console.log(`📊 Found ${technicians.length} active technicians`);
    
//     if (technicians.length === 0) {
//       console.log('⚠️ No active technicians found. Checking all technicians...');
//       const allTechs = await User.find({ role: 'technician' });
//       console.log(`📊 Total technicians in DB: ${allTechs.length}`);
//       allTechs.forEach(tech => {
//         console.log(`   - ${tech.firstName} ${tech.lastName}: status=${tech.status}, isActive=${tech.isActive}`);
//       });
//     }
    
//     const availableTechnicians = technicians.map(tech => ({
//       _id: tech._id,
//       firstName: tech.firstName,
//       lastName: tech.lastName,
//       name: `${tech.firstName} ${tech.lastName}`.trim(),
//       email: tech.email,
//       phone: tech.phone,
//       employeeId: tech.employeeId,
//       currentWorkload: { activeTasks: 0, available: true }
//     }));
    
//     res.json({ success: true, data: availableTechnicians, count: availableTechnicians.length });
//   } catch (error) {
//     console.error('Get available technicians error:', error);
//     res.status(500).json({ success: false, error: error.message, data: [] });
//   }
// };

// // ==================== GET OVERDUE TASKS ====================
// exports.getOverdueTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({
//       slaDeadline: { $lt: new Date() },
//       status: { $nin: ['closed', 'cancelled', 'verified', 'completed'] },
//       isDeleted: false
//     }).populate('assignment.assignedTo', 'firstName lastName email');
    
//     res.json({ success: true, data: tasks });
//   } catch (error) {
//     console.error('Get overdue tasks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASKS BY STATUS ====================
// exports.getTasksByStatus = async (req, res) => {
//   try {
//     const { status } = req.params;
//     const tasks = await Task.find({ status, isDeleted: false })
//       .populate('assignment.assignedTo', 'firstName lastName');
//     res.json({ success: true, data: tasks });
//   } catch (error) {
//     console.error('Get tasks by status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASKS BY PRIORITY ====================
// exports.getTasksByPriority = async (req, res) => {
//   try {
//     const { priority } = req.params;
//     const tasks = await Task.find({ priority, isDeleted: false })
//       .populate('assignment.assignedTo', 'firstName lastName');
//     res.json({ success: true, data: tasks });
//   } catch (error) {
//     console.error('Get tasks by priority error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASKS BY BUILDING ====================
// exports.getTasksByBuilding = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
//     const tasks = await Task.find({ 'location.buildingId': buildingId, isDeleted: false });
//     res.json({ success: true, data: tasks });
//   } catch (error) {
//     console.error('Get tasks by building error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASKS BY TECHNICIAN ====================
// exports.getTasksByTechnician = async (req, res) => {
//   try {
//     const { technicianId } = req.params;
//     const tasks = await Task.find({ 'assignment.assignedTo': technicianId, isDeleted: false });
//     res.json({ success: true, data: tasks });
//   } catch (error) {
//     console.error('Get tasks by technician error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TECHNICIAN WORKLOAD ====================
// exports.getTechnicianWorkload = async (req, res) => {
//   try {
//     const { technicianId } = req.params;
//     const technician = await User.findById(technicianId);
//     if (!technician) {
//       return res.status(404).json({ success: false, error: 'Technician not found' });
//     }
    
//     const activeTasks = await Task.countDocuments({
//       'assignment.assignedTo': technicianId,
//       status: { $in: ['assigned', 'accepted', 'in_progress'] },
//       isDeleted: false
//     });
    
//     res.json({ success: true, data: { technician, activeTasks, capacityPercentage: Math.min(100, (activeTasks / 5) * 100) } });
//   } catch (error) {
//     console.error('Get technician workload error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET ASSIGNMENT HISTORY ====================
// exports.getAssignmentHistory = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
//     res.json({ success: true, data: { currentAssignment: task.assignment, reassignmentCount: task.assignment?.reassignmentCount || 0 } });
//   } catch (error) {
//     console.error('Get assignment history error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET DAILY PROGRESS ====================
// exports.getDailyProgress = async (req, res) => {
//   try {
//     const { technicianId } = req.params;
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);
    
//     const tasks = await Task.find({
//       'assignment.assignedTo': technicianId,
//       createdAt: { $gte: startOfDay },
//       isDeleted: false
//     });
    
//     res.json({ success: true, data: { date: startOfDay, tasks, count: tasks.length } });
//   } catch (error) {
//     console.error('Get daily progress error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TASK PROGRESS ====================
// exports.getTaskProgress = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id).select('progress timeline checklist');
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
//     res.json({ success: true, data: task });
//   } catch (error) {
//     console.error('Get task progress error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== EXPORT TASKS TO CSV ====================
// exports.exportTasksToCSV = async (req, res) => {
//   try {
//     const tasks = await Task.find({ isDeleted: false });
//     const csvData = tasks.map(task => ({
//       'Task ID': task.taskId,
//       'Title': task.title,
//       'Status': task.status,
//       'Priority': task.priority,
//       'Assigned To': task.assignment?.assignedToName || 'Unassigned',
//       'Created At': task.createdAt.toISOString(),
//       'Completed At': task.timeline?.completedAt?.toISOString() || 'N/A'
//     }));
//     res.json({ success: true, data: csvData });
//   } catch (error) {
//     console.error('Export tasks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== EXPORTS ====================
// module.exports = {
//   createTask: exports.createTask,
//   getTasks: exports.getTasks,
//   getTaskList: exports.getTaskList,
//   getMyTasks: exports.getMyTasks,
//   getTaskById: exports.getTaskById,
//   updateTask: exports.updateTask,
//   deleteTask: exports.deleteTask,
//   assignTask: exports.assignTask,
//   autoAssignTask: exports.autoAssignTask,
//   reassignTask: exports.reassignTask,
//   acceptTask: exports.acceptTask,
//   startTask: exports.startTask,
//   updateProgress: exports.updateProgress,
//   updateChecklist: exports.updateChecklist,
//   uploadEvidence: exports.uploadEvidence,
//   completeTask: exports.completeTask,
//   verifyTask: exports.verifyTask,
//   rejectTask: exports.rejectTask,
//   getTasksByStatus: exports.getTasksByStatus,
//   getTasksByPriority: exports.getTasksByPriority,
//   getTasksByBuilding: exports.getTasksByBuilding,
//   getTasksByTechnician: exports.getTasksByTechnician,
//   getOverdueTasks: exports.getOverdueTasks,
//   getTaskStatistics: exports.getTaskStatistics,
//   getAvailableTechnicians: exports.getAvailableTechnicians,
//   getTechnicianWorkload: exports.getTechnicianWorkload,
//   getAssignmentHistory: exports.getAssignmentHistory,
//   getDailyProgress: exports.getDailyProgress,
//   getTaskProgress: exports.getTaskProgress,
//   exportTasksToCSV: exports.exportTasksToCSV
// };




// server/src/controllers/task.controller.js
const Task = require('../models/Task.model');
const User = require('../models/User.model');
const Notification = require('../models/Notification.model');
const ActivityLog = require('../models/ActivityLog.model');
const { getIO } = require('../config/socketio');
const { logger } = require('../utils/logger');

// Helper function to get user name safely
const getUserName = (user) => {
  if (!user) return 'Unknown';
  return user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown';
};

// Helper function to create activity log safely
const createActivityLog = async (data) => {
  try {
    await ActivityLog.create({
      userId: data.userId,
      userName: data.userName || 'Unknown',
      userRole: data.userRole || 'user',
      userEmail: data.userEmail || '',
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId ? data.entityId.toString() : '',
      entityName: data.entityName || '',
      oldData: data.oldData || null,
      newData: data.newData || null,
      ipAddress: data.ipAddress || '',
      status: 'success'
    });
  } catch (error) {
    console.error('Failed to create activity log:', error.message);
  }
};

// ==================== CREATE TASK ====================
exports.createTask = async (req, res) => {
  try {
    const taskData = req.body;
    taskData.createdBy = req.user._id;
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'priority'];
    const missingFields = requiredFields.filter(field => !taskData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Generate unique task ID
    const taskCount = await Task.countDocuments();
    taskData.taskId = `TSK${new Date().getFullYear()}${String(taskCount + 1).padStart(5, '0')}`;
    
    // Calculate SLA deadline based on priority
    const slaMinutes = { critical: 60, high: 240, medium: 480, low: 1440 };
    const deadlineMinutes = slaMinutes[taskData.priority] || 480;
    taskData.slaDeadline = new Date(Date.now() + deadlineMinutes * 60 * 1000);
    
    taskData.status = taskData.status || 'pending';
    
    // Set assignment if technician provided
    if (taskData.assignedTo && taskData.assignedTo !== '') {
      const technician = await User.findById(taskData.assignedTo);
      if (technician) {
        taskData.assignment = {
          assignedTo: taskData.assignedTo,
          assignedToName: `${technician.firstName} ${technician.lastName}`.trim() || technician.email,
          assignedBy: req.user._id,
          assignedAt: new Date(),
          reassignmentCount: 0
        };
        taskData.status = 'assigned';
      }
    }
    
    const task = new Task(taskData);
    await task.save();
    
    // Send notification if assigned
    if (taskData.assignedTo && taskData.assignedTo !== '') {
      try {
        const io = getIO();
        io.to(`user_${taskData.assignedTo}`).emit('new_task', {
          taskId: task._id,
          title: task.title,
          priority: task.priority
        });
      } catch (notifError) {
        console.error('Failed to send notification:', notifError.message);
      }
    }
    
    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================== GET TASK LIST ====================
exports.getTaskList = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      assignedTo,
      buildingId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = { isDeleted: { $ne: true } };
    
    // Role-based filtering
    if (req.user.role === 'technician') {
      query['assignment.assignedTo'] = req.user._id;
    }
    
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (assignedTo) query['assignment.assignedTo'] = assignedTo;
    if (buildingId) query['location.buildingId'] = buildingId;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { taskId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('assignment.assignedTo', 'firstName lastName email')
        .populate('location.buildingId', 'name code')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Task.countDocuments(query)
    ]);
    
    const overdueTasks = await Task.countDocuments({ 
      slaDeadline: { $lt: new Date() }, 
      status: { $nin: ['closed', 'cancelled', 'verified', 'completed'] },
      isDeleted: false 
    });
    
    res.json({
      success: true,
      data: { tasks },
      stats: { overdue: overdueTasks, total },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get task list error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TASKS ====================
exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority } = req.query;
    const query = { isDeleted: { $ne: true } };
    
    if (req.user.role === 'technician') {
      query['assignment.assignedTo'] = req.user._id;
    }
    
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    
    const skip = (page - 1) * limit;
    
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('assignment.assignedTo', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Task.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: { tasks },
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET MY TASKS ====================
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      'assignment.assignedTo': req.user._id,
      isDeleted: { $ne: true }
    })
      .populate('location.buildingId', 'name code')
      .sort({ priority: -1, createdAt: -1 });
    
    const counts = {
      pending: tasks.filter(t => t.status === 'pending').length,
      assigned: tasks.filter(t => t.status === 'assigned').length,
      accepted: tasks.filter(t => t.status === 'accepted').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      verified: tasks.filter(t => t.status === 'verified').length,
      total: tasks.length
    };
    
    res.json({ success: true, data: { tasks, counts } });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TASK BY ID ====================
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignment.assignedTo', 'firstName lastName email')
      .populate('assignment.assignedBy', 'firstName lastName email')
      .populate('location.buildingId', 'name code address')
      .populate('verification.verifiedBy', 'firstName lastName');
    
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== UPDATE TASK ====================
// exports.updateTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     updates.updatedAt = new Date();
    
//     const task = await Task.findByIdAndUpdate(id, updates, { new: true });
//     if (!task) {
//       return res.status(404).json({ success: false, error: 'Task not found' });
//     }
    
//     res.json({ success: true, data: task, message: 'Task updated successfully' });
//   } catch (error) {
//     console.error('Update task error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// server/src/controllers/task.controller.js
// Update the updateTask function

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    // Check permissions
    const isAdmin = ['super_admin', 'admin'].includes(req.user.role);
    const isAssignedTechnician = task.assignment?.assignedTo?.toString() === req.user._id?.toString();
    const isSupervisor = req.user.role === 'supervisor';
    
    // Allow if admin, assigned technician, or supervisor
    if (!isAdmin && !isAssignedTechnician && !isSupervisor) {
      return res.status(403).json({ 
        success: false, 
        error: 'You do not have permission to update this task' 
      });
    }
    
    // Supervisors can only update status for verification
    if (isSupervisor && updates.status && !['verified', 'rejected'].includes(updates.status)) {
      return res.status(403).json({
        success: false,
        error: 'Supervisors can only verify or reject tasks'
      });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
    
    res.json({ success: true, data: updatedTask, message: 'Task updated successfully' });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================== DELETE TASK ====================
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
    
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== ASSIGN TASK ====================
exports.assignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { technicianId } = req.body;
    
    console.log('📋 Assigning task:', id, 'to technician:', technicianId);
    
    if (!technicianId || technicianId === '') {
      return res.status(400).json({ success: false, error: 'Technician ID is required' });
    }
    
    const technician = await User.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ success: false, error: 'Technician not found' });
    }
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    const technicianName = `${technician.firstName} ${technician.lastName}`.trim() || technician.email;
    
    task.assignment = {
      assignedTo: technicianId,
      assignedToName: technicianName,
      assignedBy: req.user._id,
      assignedByRole: req.user.role,
      assignedAt: new Date(),
      reassignmentCount: (task.assignment?.reassignmentCount || 0) + (task.assignment?.assignedTo ? 1 : 0)
    };
    task.status = 'assigned';
    
    await task.save();
    console.log('✅ Task assigned successfully');
    
    res.json({ success: true, data: task, message: `Task assigned to ${technicianName}` });
  } catch (error) {
    console.error('Assign task error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================== AUTO-ASSIGN TASK ====================
exports.autoAssignTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    // Find all active technicians
    const technicians = await User.find({ 
      role: 'technician', 
      status: 'active',
      isActive: true
    });
    
    console.log(`📊 Found ${technicians.length} technicians`);
    
    if (technicians.length === 0) {
      return res.status(400).json({ success: false, error: 'No technicians available for assignment' });
    }
    
    // Calculate workload
    const workloads = await Promise.all(technicians.map(async (tech) => {
      const activeTasks = await Task.countDocuments({
        'assignment.assignedTo': tech._id,
        status: { $in: ['assigned', 'accepted', 'in_progress'] },
        isDeleted: false
      });
      return { technician: tech, activeTasks };
    }));
    
    workloads.sort((a, b) => a.activeTasks - b.activeTasks);
    const bestTechnician = workloads[0].technician;
    const technicianName = `${bestTechnician.firstName} ${bestTechnician.lastName}`.trim() || bestTechnician.email;
    
    task.assignment = {
      assignedTo: bestTechnician._id,
      assignedToName: technicianName,
      assignedBy: req.user._id,
      assignedByRole: req.user.role,
      assignedAt: new Date(),
      reassignmentCount: (task.assignment?.reassignmentCount || 0) + (task.assignment?.assignedTo ? 1 : 0)
    };
    task.status = 'assigned';
    await task.save();
    
    res.json({ success: true, data: task, message: `Task auto-assigned to ${technicianName}` });
  } catch (error) {
    console.error('Auto assign task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== REASSIGN TASK ====================
exports.reassignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { technicianId, reason } = req.body;
    
    if (!technicianId || technicianId === '') {
      return res.status(400).json({ success: false, error: 'Technician ID is required' });
    }
    
    const technician = await User.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ success: false, error: 'Technician not found' });
    }
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    const technicianName = `${technician.firstName} ${technician.lastName}`.trim() || technician.email;
    
    task.assignment = {
      ...task.assignment,
      assignedTo: technicianId,
      assignedToName: technicianName,
      reassignmentCount: (task.assignment?.reassignmentCount || 0) + 1,
      reassignmentReason: reason,
      reassignedAt: new Date()
    };
    task.status = 'assigned';
    await task.save();
    
    res.json({ success: true, data: task, message: `Task reassigned to ${technicianName}` });
  } catch (error) {
    console.error('Reassign task error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================== ACCEPT TASK ====================
exports.acceptTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    if (task.assignment.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Task not assigned to you' });
    }
    
    if (task.status !== 'assigned') {
      return res.status(400).json({ success: false, error: 'Task cannot be accepted' });
    }
    
    task.status = 'accepted';
    task.timeline = { ...task.timeline, acceptedAt: new Date() };
    await task.save();
    
    res.json({ success: true, data: task, message: 'Task accepted successfully' });
  } catch (error) {
    console.error('Accept task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== START TASK ====================
exports.startTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    if (task.assignment.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Task not assigned to you' });
    }
    
    if (task.status !== 'accepted') {
      return res.status(400).json({ success: false, error: 'Task cannot be started' });
    }
    
    task.status = 'in_progress';
    task.timeline = { ...task.timeline, startedAt: new Date() };
    task.progress = { percentage: 10, lastUpdatedAt: new Date(), updatedBy: req.user._id };
    await task.save();
    
    res.json({ success: true, data: task, message: 'Task started successfully' });
  } catch (error) {
    console.error('Start task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== UPDATE PROGRESS ====================
exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { percentage } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    task.progress = {
      percentage: Math.min(100, Math.max(0, percentage)),
      lastUpdatedAt: new Date(),
      updatedBy: req.user._id
    };
    await task.save();
    
    res.json({ success: true, data: task, message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== UPDATE CHECKLIST ====================
exports.updateChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemId, completed, imageAfter, notes } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    const checklistItem = task.checklist.id(itemId);
    if (!checklistItem) {
      return res.status(404).json({ success: false, error: 'Checklist item not found' });
    }
    
    checklistItem.completed = completed;
    checklistItem.completedBy = req.user._id;
    checklistItem.completedAt = new Date();
    if (imageAfter) checklistItem.imageAfter = imageAfter;
    if (notes) checklistItem.notes = notes;
    
    const completedItems = task.checklist.filter(item => item.completed).length;
    task.progress.percentage = Math.round((completedItems / task.checklist.length) * 100);
    await task.save();
    
    res.json({ success: true, data: task, message: 'Checklist updated successfully' });
  } catch (error) {
    console.error('Update checklist error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== UPLOAD EVIDENCE (FIXED FOR TECHNICIAN) ====================
exports.uploadEvidence = async (req, res) => {
  try {
    const { id } = req.params;
    const { images, videos } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    // Check if user is assigned technician or admin/super_admin
    const isAssignedTechnician = task.assignment?.assignedTo?.toString() === req.user._id?.toString();
    const isAdmin = ['super_admin', 'admin'].includes(req.user.role);
    
    if (!isAssignedTechnician && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        error: 'Only assigned technicians or administrators can upload evidence' 
      });
    }
    
    // Allow upload for in_progress, accepted, or assigned tasks
    if (!['in_progress', 'accepted', 'assigned'].includes(task.status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Evidence can only be uploaded when task is in progress or accepted' 
      });
    }
    
    // Initialize evidence object if not exists
    if (!task.evidence) {
      task.evidence = { afterImages: [], videos: [], beforeImages: [] };
    }
    if (!task.evidence.afterImages) task.evidence.afterImages = [];
    if (!task.evidence.videos) task.evidence.videos = [];
    
    let uploadCount = 0;
    
    // Upload images
    if (images && images.length > 0) {
      images.forEach(img => {
        task.evidence.afterImages.push({
          url: img,
          uploadedBy: req.user._id,
          uploadedByName: getUserName(req.user),
          uploadedAt: new Date(),
          description: 'Work evidence'
        });
        uploadCount++;
      });
    }
    
    // Upload videos
    if (videos && videos.length > 0) {
      videos.forEach(vid => {
        task.evidence.videos.push({
          url: vid,
          uploadedBy: req.user._id,
          uploadedByName: getUserName(req.user),
          uploadedAt: new Date()
        });
        uploadCount++;
      });
    }
    
    await task.save();
    
    // Create activity log
    await createActivityLog({
      userId: req.user._id,
      userName: getUserName(req.user),
      userRole: req.user.role,
      action: 'UPLOAD_EVIDENCE',
      entityType: 'task',
      entityId: task._id,
      entityName: task.title,
      newData: { imagesCount: images?.length || 0, videosCount: videos?.length || 0 },
      ipAddress: req.ip
    });
    
    res.json({ 
      success: true, 
      data: task, 
      message: `${uploadCount} file(s) uploaded successfully` 
    });
  } catch (error) {
    console.error('Upload evidence error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== COMPLETE TASK ====================
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { completionNotes, afterImages } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    if (task.status !== 'in_progress') {
      return res.status(400).json({ success: false, error: 'Task cannot be completed' });
    }
    
    task.status = 'completed';
    task.timeline = { ...task.timeline, completedAt: new Date() };
    task.progress = { percentage: 100, lastUpdatedAt: new Date(), updatedBy: req.user._id };
    
    if (completionNotes) {
      task.technicianNotes = task.technicianNotes || [];
      task.technicianNotes.push({
        note: completionNotes,
        createdBy: req.user._id,
        createdAt: new Date()
      });
    }
    
    if (afterImages && afterImages.length) {
      task.evidence.afterImages = task.evidence.afterImages || [];
      afterImages.forEach(img => {
        task.evidence.afterImages.push({
          url: img,
          uploadedBy: req.user._id,
          uploadedByName: getUserName(req.user),
          uploadedAt: new Date(),
          description: 'Completion evidence'
        });
      });
    }
    
    await task.save();
    
    res.json({ success: true, data: task, message: 'Task completed. Pending verification.' });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== VERIFY TASK ====================
exports.verifyTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, notes, approved } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    if (approved) {
      task.status = 'verified';
      task.verification = {
        verifiedBy: req.user._id,
        verifiedAt: new Date(),
        notes,
        rating,
        reworkCount: task.verification?.reworkCount || 0
      };
      task.timeline = { ...task.timeline, verifiedAt: new Date() };
      task.status = 'closed';
      task.timeline = { ...task.timeline, closedAt: new Date() };
    } else {
      task.status = 'assigned';
      task.rejection = {
        reason: notes,
        rejectedBy: req.user._id,
        rejectedAt: new Date(),
        reworkInstructions: notes
      };
      task.verification = {
        ...task.verification,
        reworkCount: (task.verification?.reworkCount || 0) + 1
      };
    }
    
    await task.save();
    
    res.json({ success: true, data: task, message: approved ? 'Task verified and closed' : 'Task rejected for rework' });
  } catch (error) {
    console.error('Verify task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== REJECT TASK ====================
exports.rejectTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    
    task.status = 'assigned';
    task.rejection = {
      reason: reason,
      rejectedBy: req.user._id,
      rejectedAt: new Date(),
      reworkInstructions: reason
    };
    task.verification = {
      ...task.verification,
      reworkCount: (task.verification?.reworkCount || 0) + 1
    };
    await task.save();
    
    res.json({ success: true, data: task, message: 'Task rejected for rework' });
  } catch (error) {
    console.error('Reject task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TASK STATISTICS ====================
exports.getTaskStatistics = async (req, res) => {
  try {
    const statusCounts = await Task.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const priorityCounts = await Task.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    const stats = { pending: 0, assigned: 0, in_progress: 0, completed: 0, total: 0 };
    statusCounts.forEach(s => { if (stats[s._id] !== undefined) stats[s._id] = s.count; });
    stats.total = Object.values(stats).reduce((a, b) => a + b, 0);
    
    const priority = { critical: 0, high: 0, medium: 0, low: 0 };
    priorityCounts.forEach(p => { if (priority[p._id] !== undefined) priority[p._id] = p.count; });
    
    res.json({ success: true, data: { status: stats, priority, overdue: 0 } });
  } catch (error) {
    console.error('Get task statistics error:', error);
    res.json({ success: true, data: { status: { total: 0 }, priority: {}, overdue: 0 } });
  }
};

// ==================== GET AVAILABLE TECHNICIANS ====================
exports.getAvailableTechnicians = async (req, res) => {
  try {
    console.log('🔍 Fetching available technicians...');
    
    const technicians = await User.find({ 
      role: 'technician',
      status: 'active',
      isActive: true
    }).select('firstName lastName email phone employeeId');
    
    console.log(`📊 Found ${technicians.length} active technicians`);
    
    if (technicians.length === 0) {
      console.log('⚠️ No active technicians found. Checking all technicians...');
      const allTechs = await User.find({ role: 'technician' });
      console.log(`📊 Total technicians in DB: ${allTechs.length}`);
      allTechs.forEach(tech => {
        console.log(`   - ${tech.firstName} ${tech.lastName}: status=${tech.status}, isActive=${tech.isActive}`);
      });
    }
    
    const availableTechnicians = technicians.map(tech => ({
      _id: tech._id,
      firstName: tech.firstName,
      lastName: tech.lastName,
      name: `${tech.firstName} ${tech.lastName}`.trim(),
      email: tech.email,
      phone: tech.phone,
      employeeId: tech.employeeId,
      currentWorkload: { activeTasks: 0, available: true }
    }));
    
    res.json({ success: true, data: availableTechnicians, count: availableTechnicians.length });
  } catch (error) {
    console.error('Get available technicians error:', error);
    res.status(500).json({ success: false, error: error.message, data: [] });
  }
};

// ==================== GET OVERDUE TASKS ====================
exports.getOverdueTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      slaDeadline: { $lt: new Date() },
      status: { $nin: ['closed', 'cancelled', 'verified', 'completed'] },
      isDeleted: false
    }).populate('assignment.assignedTo', 'firstName lastName email');
    
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Get overdue tasks error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TASKS BY STATUS ====================
exports.getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const tasks = await Task.find({ status, isDeleted: false })
      .populate('assignment.assignedTo', 'firstName lastName');
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Get tasks by status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TASKS BY PRIORITY ====================
exports.getTasksByPriority = async (req, res) => {
  try {
    const { priority } = req.params;
    const tasks = await Task.find({ priority, isDeleted: false })
      .populate('assignment.assignedTo', 'firstName lastName');
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Get tasks by priority error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TASKS BY BUILDING ====================
exports.getTasksByBuilding = async (req, res) => {
  try {
    const { buildingId } = req.params;
    const tasks = await Task.find({ 'location.buildingId': buildingId, isDeleted: false });
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Get tasks by building error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TASKS BY TECHNICIAN ====================
exports.getTasksByTechnician = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const tasks = await Task.find({ 'assignment.assignedTo': technicianId, isDeleted: false });
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Get tasks by technician error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TECHNICIAN WORKLOAD ====================
exports.getTechnicianWorkload = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const technician = await User.findById(technicianId);
    if (!technician) {
      return res.status(404).json({ success: false, error: 'Technician not found' });
    }
    
    const activeTasks = await Task.countDocuments({
      'assignment.assignedTo': technicianId,
      status: { $in: ['assigned', 'accepted', 'in_progress'] },
      isDeleted: false
    });
    
    res.json({ success: true, data: { technician, activeTasks, capacityPercentage: Math.min(100, (activeTasks / 5) * 100) } });
  } catch (error) {
    console.error('Get technician workload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET ASSIGNMENT HISTORY ====================
exports.getAssignmentHistory = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: { currentAssignment: task.assignment, reassignmentCount: task.assignment?.reassignmentCount || 0 } });
  } catch (error) {
    console.error('Get assignment history error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET DAILY PROGRESS ====================
exports.getDailyProgress = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const tasks = await Task.find({
      'assignment.assignedTo': technicianId,
      createdAt: { $gte: startOfDay },
      isDeleted: false
    });
    
    res.json({ success: true, data: { date: startOfDay, tasks, count: tasks.length } });
  } catch (error) {
    console.error('Get daily progress error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TASK PROGRESS ====================
exports.getTaskProgress = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).select('progress timeline checklist');
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Get task progress error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== EXPORT TASKS TO CSV ====================
exports.exportTasksToCSV = async (req, res) => {
  try {
    const tasks = await Task.find({ isDeleted: false });
    const csvData = tasks.map(task => ({
      'Task ID': task.taskId,
      'Title': task.title,
      'Status': task.status,
      'Priority': task.priority,
      'Assigned To': task.assignment?.assignedToName || 'Unassigned',
      'Created At': task.createdAt.toISOString(),
      'Completed At': task.timeline?.completedAt?.toISOString() || 'N/A'
    }));
    res.json({ success: true, data: csvData });
  } catch (error) {
    console.error('Export tasks error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== EXPORTS ====================
module.exports = {
  createTask: exports.createTask,
  getTasks: exports.getTasks,
  getTaskList: exports.getTaskList,
  getMyTasks: exports.getMyTasks,
  getTaskById: exports.getTaskById,
  updateTask: exports.updateTask,
  deleteTask: exports.deleteTask,
  assignTask: exports.assignTask,
  autoAssignTask: exports.autoAssignTask,
  reassignTask: exports.reassignTask,
  acceptTask: exports.acceptTask,
  startTask: exports.startTask,
  updateProgress: exports.updateProgress,
  updateChecklist: exports.updateChecklist,
  uploadEvidence: exports.uploadEvidence,
  completeTask: exports.completeTask,
  verifyTask: exports.verifyTask,
  rejectTask: exports.rejectTask,
  getTasksByStatus: exports.getTasksByStatus,
  getTasksByPriority: exports.getTasksByPriority,
  getTasksByBuilding: exports.getTasksByBuilding,
  getTasksByTechnician: exports.getTasksByTechnician,
  getOverdueTasks: exports.getOverdueTasks,
  getTaskStatistics: exports.getTaskStatistics,
  getAvailableTechnicians: exports.getAvailableTechnicians,
  getTechnicianWorkload: exports.getTechnicianWorkload,
  getAssignmentHistory: exports.getAssignmentHistory,
  getDailyProgress: exports.getDailyProgress,
  getTaskProgress: exports.getTaskProgress,
  exportTasksToCSV: exports.exportTasksToCSV
};