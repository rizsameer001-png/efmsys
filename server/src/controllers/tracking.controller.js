/**
 * TRACKING CONTROLLER
 * Handles GPS location tracking and route history
 */

// const LocationTracking = require('../models/location-tracking.model');
// const User = require('../models/user.model');

// /**
//  * Update technician location
//  */
// exports.updateLocation = async (req, res) => {
//   try {
//     const { lat, lng, accuracy, speed, heading, taskId } = req.body;
//     const technicianId = req.userId;

//     let tracking = await LocationTracking.findOne({ 
//       technicianId, 
//       isActive: true 
//     });

//     if (!tracking) {
//       tracking = new LocationTracking({
//         technicianId,
//         technicianName: `${req.user.firstName} ${req.user.lastName}`,
//         sessionStart: new Date(),
//         isActive: true
//       });
//     }

//     tracking.currentLocation = {
//       lat,
//       lng,
//       accuracy,
//       speed,
//       heading,
//       timestamp: new Date()
//     };
    
//     tracking.routeHistory.push({
//       lat,
//       lng,
//       accuracy,
//       speed,
//       heading,
//       timestamp: new Date()
//     });
    
//     // Limit route history to 1000 points
//     if (tracking.routeHistory.length > 1000) {
//       tracking.routeHistory.shift();
//     }
    
//     tracking.statistics.locationsCount += 1;
//     tracking.updatedAt = new Date();
    
//     await tracking.save();

//     res.json({
//       success: true,
//       data: tracking,
//       message: 'Location updated'
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get live locations of all technicians
//  */
// exports.getLiveLocations = async (req, res) => {
//   try {
//     const { buildingId } = req.query;
    
//     const query = { isActive: true };
//     if (buildingId) query['currentLocation.buildingId'] = buildingId;
    
//     const locations = await LocationTracking.find(query)
//       .populate('technicianId', 'firstName lastName email profileImage')
//       .sort({ 'currentLocation.timestamp': -1 });

//     const liveLocations = locations.map(loc => ({
//       technician: {
//         id: loc.technicianId._id,
//         name: `${loc.technicianId.firstName} ${loc.technicianId.lastName}`,
//         email: loc.technicianId.email,
//         profileImage: loc.technicianId.profileImage
//       },
//       location: loc.currentLocation,
//       isOnline: new Date() - loc.currentLocation.timestamp < 5 * 60 * 1000,
//       lastUpdate: loc.currentLocation.timestamp,
//       statistics: loc.statistics
//     }));

//     res.json({
//       success: true,
//       data: liveLocations
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get current tracking session
//  */
// exports.getCurrentSession = async (req, res) => {
//   try {
//     const technicianId = req.userId;
    
//     const tracking = await LocationTracking.findOne({ 
//       technicianId, 
//       isActive: true 
//     });

//     res.json({
//       success: true,
//       data: tracking || { isActive: false }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * End tracking session
//  */
// exports.endSession = async (req, res) => {
//   try {
//     const technicianId = req.userId;
    
//     const tracking = await LocationTracking.findOneAndUpdate(
//       { technicianId, isActive: true },
//       { 
//         isActive: false,
//         sessionEnd: new Date()
//       },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       data: tracking,
//       message: 'Tracking session ended'
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get route history for a technician
//  */
// exports.getRouteHistory = async (req, res) => {
//   try {
//     const { technicianId } = req.params;
//     const { startDate, endDate } = req.query;
    
//     const query = { technicianId };
//     if (startDate || endDate) {
//       query['routeHistory.timestamp'] = {};
//       if (startDate) query['routeHistory.timestamp'].$gte = new Date(startDate);
//       if (endDate) query['routeHistory.timestamp'].$lte = new Date(endDate);
//     }
    
//     const tracking = await LocationTracking.find(query)
//       .sort({ sessionStart: -1 });

//     const routePoints = [];
//     for (const session of tracking) {
//       routePoints.push(...session.routeHistory);
//     }

//     res.json({
//       success: true,
//       data: routePoints
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get technician tracking summary
//  */
// exports.getTechnicianTrackingSummary = async (req, res) => {
//   try {
//     const { technicianId } = req.params;
//     const { date } = req.query;
    
//     const targetDate = date ? new Date(date) : new Date();
//     const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    
//     const sessions = await LocationTracking.find({
//       technicianId,
//       sessionStart: { $gte: startOfDay, $lte: endOfDay }
//     });

//     const totalDistance = sessions.reduce((sum, s) => sum + (s.statistics.totalDistance || 0), 0);
//     const totalDuration = sessions.reduce((sum, s) => sum + (s.statistics.totalDuration || 0), 0);
    
//     res.json({
//       success: true,
//       data: {
//         date: targetDate,
//         sessions: sessions.length,
//         totalDistance: (totalDistance / 1000).toFixed(2), // km
//         totalDuration: Math.floor(totalDuration / 60), // hours
//         totalLocations: sessions.reduce((sum, s) => sum + (s.statistics.locationsCount || 0), 0)
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * TRACKING CONTROLLER
//  * Handles GPS location tracking and route history
//  */

// const LocationTracking = require('../models/location-tracking.model');
// const User = require('../models/User.model');
// const Task = require('../models/Task.model');
// const Notification = require('../models/Notification.model');
// const ActivityLog = require('../models/ActivityLog.model');
// const { getIO } = require('../config/socketio');

// // ==================== HELPER FUNCTIONS ====================

// /**
//  * Calculate distance between two points in meters (Haversine formula)
//  */
// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371e3; // Earth's radius in meters
//   const φ1 = (lat1 * Math.PI) / 180;
//   const φ2 = (lat2 * Math.PI) / 180;
//   const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//   const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//   const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//     Math.cos(φ1) * Math.cos(φ2) *
//     Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c;
// };

// /**
//  * Send notification to supervisor about location update
//  */
// const sendLocationNotification = async (technicianId, technicianName, action, location) => {
//   try {
//     const technician = await User.findById(technicianId);
//     if (technician?.supervisorId) {
//       const io = getIO();
//       const notification = {
//         title: action === 'start' ? '📍 Shift Started' : '📍 Shift Ended',
//         body: `${technicianName} has ${action === 'start' ? 'started' : 'ended'} their shift`,
//         type: 'tracking',
//         priority: 'medium',
//         referenceId: technicianId,
//         referenceModel: 'User',
//         data: { location, action, timestamp: new Date() }
//       };
      
//       if (io) {
//         io.to(`user_${technician.supervisorId}`).emit('technician_status_change', notification);
//       }
      
//       await Notification.create({
//         userId: technician.supervisorId,
//         ...notification
//       });
//     }
//   } catch (error) {
//     console.error('Send location notification error:', error);
//   }
// };

// /**
//  * Calculate session statistics
//  */
// const calculateSessionStats = async (tracking) => {
//   let totalDistance = 0;
//   let totalDuration = 0;
//   let speeds = [];
//   let maxSpeed = 0;
  
//   const points = tracking.routeHistory;
//   for (let i = 1; i < points.length; i++) {
//     const prev = points[i - 1];
//     const curr = points[i];
    
//     // Calculate distance
//     const distance = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
//     totalDistance += distance;
    
//     // Calculate speed
//     if (prev.timestamp && curr.timestamp) {
//       const timeDiff = (new Date(curr.timestamp) - new Date(prev.timestamp)) / 1000; // seconds
//       if (timeDiff > 0) {
//         const speed = (distance / 1000) / (timeDiff / 3600); // km/h
//         speeds.push(speed);
//         if (speed > maxSpeed) maxSpeed = speed;
//       }
//     }
//   }
  
//   // Calculate total duration
//   if (tracking.sessionStart && tracking.sessionEnd) {
//     totalDuration = (new Date(tracking.sessionEnd) - new Date(tracking.sessionStart)) / 1000; // seconds
//   } else if (tracking.sessionStart) {
//     totalDuration = (Date.now() - new Date(tracking.sessionStart)) / 1000;
//   }
  
//   const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
  
//   tracking.statistics = {
//     totalDistance: Math.round(totalDistance),
//     totalDuration: Math.round(totalDuration),
//     avgSpeed: Math.round(avgSpeed),
//     maxSpeed: Math.round(maxSpeed),
//     locationsCount: points.length,
//     lastUpdated: new Date()
//   };
  
//   return tracking;
// };

// // ==================== UPDATE LOCATION ====================

// /**
//  * Update technician location
//  */
// const updateLocation = async (req, res) => {
//   try {
//     const { lat, lng, accuracy, speed, heading, taskId } = req.body;
//     const technicianId = req.user._id || req.userId;
//     const technicianName = req.user.name;

//     // Validate coordinates
//     if (!lat || !lng) {
//       return res.status(400).json({ success: false, error: 'Latitude and longitude are required' });
//     }

//     // Find or create active tracking session
//     let tracking = await LocationTracking.findOne({ 
//       technicianId, 
//       isActive: true 
//     });

//     if (!tracking) {
//       tracking = new LocationTracking({
//         technicianId,
//         technicianName,
//         technicianRole: req.user.role,
//         technicianType: req.user.technicianType,
//         sessionStart: new Date(),
//         isActive: true,
//         routeHistory: [],
//         statistics: {
//           totalDistance: 0,
//           totalDuration: 0,
//           avgSpeed: 0,
//           maxSpeed: 0,
//           locationsCount: 0
//         }
//       });
      
//       // Send notification to supervisor
//       await sendLocationNotification(technicianId, technicianName, 'start', { lat, lng });
//     }

//     // Update current location
//     tracking.currentLocation = {
//       lat,
//       lng,
//       accuracy: accuracy || 10,
//       speed: speed || 0,
//       heading: heading || 0,
//       timestamp: new Date(),
//       taskId: taskId || null
//     };
    
//     // Add to route history
//     tracking.routeHistory.push({
//       lat,
//       lng,
//       accuracy: accuracy || 10,
//       speed: speed || 0,
//       heading: heading || 0,
//       timestamp: new Date(),
//       taskId: taskId || null
//     });
    
//     // Limit route history to 2000 points (last ~4 hours at 5-second intervals)
//     if (tracking.routeHistory.length > 2000) {
//       tracking.routeHistory = tracking.routeHistory.slice(-1500);
//     }
    
//     // Update statistics
//     tracking.statistics.locationsCount += 1;
//     tracking.updatedAt = new Date();
    
//     // Calculate distance and speed statistics
//     await calculateSessionStats(tracking);
    
//     await tracking.save();
    
//     // Update user's last known location
//     await User.findByIdAndUpdate(technicianId, {
//       'lastLocation.lat': lat,
//       'lastLocation.lng': lng,
//       'lastLocation.updatedAt': new Date(),
//       isOnline: true
//     });
    
//     // Broadcast to supervisors and managers via socket
//     const io = getIO();
//     if (io) {
//       io.to('role_supervisor').to('role_manager').to('role_admin').emit('technician_location_update', {
//         technicianId,
//         technicianName,
//         location: tracking.currentLocation,
//         isActive: true,
//         timestamp: new Date()
//       });
//     }

//     res.json({
//       success: true,
//       data: {
//         trackingId: tracking._id,
//         currentLocation: tracking.currentLocation,
//         statistics: tracking.statistics,
//         isActive: tracking.isActive
//       },
//       message: 'Location updated successfully'
//     });
//   } catch (error) {
//     console.error('Update location error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET LIVE LOCATIONS ====================

// /**
//  * Get live locations of all technicians (for supervisors/managers)
//  */
// const getLiveLocations = async (req, res) => {
//   try {
//     const { buildingId, status } = req.query;
//     const userRole = req.user.role;
//     const userId = req.user._id || req.userId;
    
//     let query = { isActive: true };
    
//     // Role-based filtering
//     if (userRole === 'supervisor') {
//       const technicians = await User.find({ supervisorId: userId, role: 'technician' }).select('_id');
//       const techIds = technicians.map(t => t._id);
//       query.technicianId = { $in: techIds };
//     } else if (userRole === 'manager' && buildingId) {
//       const technicians = await User.find({ buildingId, role: 'technician' }).select('_id');
//       const techIds = technicians.map(t => t._id);
//       query.technicianId = { $in: techIds };
//     }
    
//     if (status === 'active') {
//       query.isActive = true;
//     } else if (status === 'inactive') {
//       query.isActive = false;
//     }
    
//     const locations = await LocationTracking.find(query)
//       .populate('technicianId', 'name email profileImage technicianType buildingId')
//       .sort({ 'currentLocation.timestamp': -1 });

//     const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
//     const liveLocations = locations.map(loc => {
//       const isOnline = loc.currentLocation?.timestamp && new Date(loc.currentLocation.timestamp) > fiveMinutesAgo;
//       const hasRecentActivity = loc.updatedAt && new Date(loc.updatedAt) > fiveMinutesAgo;
      
//       return {
//         technician: {
//           id: loc.technicianId?._id,
//           name: loc.technicianName || (loc.technicianId ? `${loc.technicianId.firstName} ${loc.technicianId.lastName}` : 'Unknown'),
//           email: loc.technicianId?.email,
//           profileImage: loc.technicianId?.profileImage,
//           technicianType: loc.technicianType || loc.technicianId?.technicianType,
//           buildingId: loc.technicianId?.buildingId
//         },
//         location: loc.currentLocation,
//         isOnline: isOnline && hasRecentActivity,
//         isActive: loc.isActive,
//         sessionStart: loc.sessionStart,
//         sessionEnd: loc.sessionEnd,
//         lastUpdate: loc.currentLocation?.timestamp || loc.updatedAt,
//         statistics: loc.statistics,
//         routePreview: loc.routeHistory.slice(-5) // Last 5 points for preview
//       };
//     });
    
//     // Calculate summary statistics
//     const onlineCount = liveLocations.filter(l => l.isOnline).length;
//     const activeCount = liveLocations.filter(l => l.isActive).length;
    
//     res.json({
//       success: true,
//       data: {
//         technicians: liveLocations,
//         summary: {
//           total: liveLocations.length,
//           online: onlineCount,
//           active: activeCount,
//           offline: liveLocations.length - onlineCount
//         },
//         lastUpdated: new Date()
//       }
//     });
//   } catch (error) {
//     console.error('Get live locations error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET CURRENT SESSION ====================

// /**
//  * Get current tracking session for technician
//  */
// const getCurrentSession = async (req, res) => {
//   try {
//     const technicianId = req.user._id || req.userId;
    
//     const tracking = await LocationTracking.findOne({ 
//       technicianId, 
//       isActive: true 
//     });
    
//     // Get current task if any
//     const currentTask = await Task.findOne({
//       'assignment.assignedTo': technicianId,
//       status: { $in: ['accepted', 'in_progress'] },
//       isDeleted: false
//     }).select('_id taskId title priority status');
    
//     if (!tracking) {
//       return res.json({
//         success: true,
//         data: {
//           isActive: false,
//           hasActiveSession: false,
//           currentTask: currentTask || null,
//           message: 'No active tracking session'
//         }
//       });
//     }
    
//     // Calculate session duration
//     const sessionDuration = tracking.sessionStart ? 
//       Math.floor((Date.now() - new Date(tracking.sessionStart)) / 1000 / 60) : 0;
    
//     res.json({
//       success: true,
//       data: {
//         isActive: tracking.isActive,
//         hasActiveSession: true,
//         trackingId: tracking._id,
//         sessionStart: tracking.sessionStart,
//         sessionDuration: sessionDuration,
//         currentLocation: tracking.currentLocation,
//         currentTask: currentTask || null,
//         statistics: tracking.statistics,
//         routeHistoryCount: tracking.routeHistory.length,
//         lastUpdate: tracking.updatedAt
//       }
//     });
//   } catch (error) {
//     console.error('Get current session error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== END SESSION ====================

// /**
//  * End tracking session
//  */
// const endSession = async (req, res) => {
//   try {
//     const technicianId = req.user._id || req.userId;
//     const technicianName = req.user.name;
    
//     const tracking = await LocationTracking.findOneAndUpdate(
//       { technicianId, isActive: true },
//       { 
//         isActive: false,
//         sessionEnd: new Date(),
//         updatedAt: new Date()
//       },
//       { new: true }
//     );
    
//     if (!tracking) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'No active tracking session found' 
//       });
//     }
    
//     // Calculate final statistics
//     await calculateSessionStats(tracking);
//     await tracking.save();
    
//     // Update user online status
//     await User.findByIdAndUpdate(technicianId, {
//       isOnline: false,
//       'lastLocation.updatedAt': new Date()
//     });
    
//     // Send notification to supervisor
//     await sendLocationNotification(
//       technicianId, 
//       technicianName, 
//       'end', 
//       tracking.currentLocation
//     );
    
//     // Log activity
//     await ActivityLog.create({
//       userId: technicianId,
//       userName: technicianName,
//       userRole: req.user.role,
//       action: 'END_TRACKING_SESSION',
//       entityType: 'tracking',
//       entityId: tracking._id,
//       newData: { sessionDuration: tracking.statistics.totalDuration, totalDistance: tracking.statistics.totalDistance },
//       ipAddress: req.ip
//     });
    
//     // Broadcast session ended via socket
//     const io = getIO();
//     if (io) {
//       io.to('role_supervisor').to('role_manager').emit('technician_session_ended', {
//         technicianId,
//         technicianName,
//         sessionSummary: tracking.statistics,
//         timestamp: new Date()
//       });
//     }
    
//     res.json({
//       success: true,
//       data: {
//         sessionSummary: tracking.statistics,
//         sessionStart: tracking.sessionStart,
//         sessionEnd: tracking.sessionEnd,
//         totalLocations: tracking.statistics.locationsCount
//       },
//       message: 'Tracking session ended successfully'
//     });
//   } catch (error) {
//     console.error('End session error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET ROUTE HISTORY ====================

// /**
//  * Get route history for a technician
//  */
// const getRouteHistory = async (req, res) => {
//   try {
//     const { technicianId } = req.params;
//     const { startDate, endDate, page = 1, limit = 500 } = req.query;
    
//     // Check authorization
//     if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
//       if (req.user.role === 'supervisor') {
//         const technician = await User.findById(technicianId);
//         if (technician?.supervisorId?.toString() !== (req.user._id || req.userId).toString()) {
//           return res.status(403).json({ success: false, error: 'Unauthorized' });
//         }
//       }
//     }
    
//     let query = { technicianId };
    
//     if (startDate || endDate) {
//       query.sessionStart = {};
//       if (startDate) query.sessionStart.$gte = new Date(startDate);
//       if (endDate) query.sessionStart.$lte = new Date(endDate);
//     }
    
//     const skip = (page - 1) * limit;
    
//     const [sessions, total] = await Promise.all([
//       LocationTracking.find(query)
//         .sort({ sessionStart: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       LocationTracking.countDocuments(query)
//     ]);
    
//     // Combine all route points from sessions
//     const routePoints = [];
//     for (const session of sessions) {
//       routePoints.push(...session.routeHistory);
//     }
    
//     // Calculate route summary
//     let totalDistance = 0;
//     let totalDuration = 0;
//     let maxSpeed = 0;
    
//     for (let i = 1; i < routePoints.length; i++) {
//       const prev = routePoints[i - 1];
//       const curr = routePoints[i];
//       const distance = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
//       totalDistance += distance;
      
//       if (curr.speed && curr.speed > maxSpeed) maxSpeed = curr.speed;
      
//       if (prev.timestamp && curr.timestamp) {
//         totalDuration += (new Date(curr.timestamp) - new Date(prev.timestamp)) / 1000;
//       }
//     }
    
//     // Get technician info
//     const technician = await User.findById(technicianId).select('name email technicianType');
    
//     res.json({
//       success: true,
//       data: {
//         technician: {
//           id: technician?._id,
//           name: technician?.name,
//           technicianType: technician?.technicianType
//         },
//         sessions,
//         routePoints: routePoints.slice(-500), // Last 500 points for performance
//         summary: {
//           totalSessions: sessions.length,
//           totalDistance: Math.round(totalDistance / 1000), // km
//           totalDuration: Math.floor(totalDuration / 3600), // hours
//           avgSpeed: totalDuration > 0 ? Math.round((totalDistance / 1000) / (totalDuration / 3600)) : 0,
//           maxSpeed: Math.round(maxSpeed),
//           totalLocations: routePoints.length
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
//     console.error('Get route history error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== GET TECHNICIAN TRACKING SUMMARY ====================

// /**
//  * Get technician tracking summary for a date range
//  */
// const getTechnicianTrackingSummary = async (req, res) => {
//   try {
//     const { technicianId } = req.params;
//     const { period = 'day', date } = req.query;
    
//     let startDate = date ? new Date(date) : new Date();
//     let endDate = new Date(startDate);
    
//     switch (period) {
//       case 'day':
//         startDate.setHours(0, 0, 0, 0);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case 'week':
//         startDate.setDate(startDate.getDate() - 7);
//         startDate.setHours(0, 0, 0, 0);
//         break;
//       case 'month':
//         startDate.setMonth(startDate.getMonth() - 1);
//         startDate.setHours(0, 0, 0, 0);
//         break;
//       default:
//         startDate.setHours(0, 0, 0, 0);
//         endDate.setHours(23, 59, 59, 999);
//     }
    
//     const sessions = await LocationTracking.find({
//       technicianId,
//       sessionStart: { $gte: startDate, $lte: endDate }
//     });
    
//     // Calculate totals
//     let totalDistance = 0;
//     let totalDuration = 0;
//     let totalLocations = 0;
//     let activeSessions = 0;
    
//     for (const session of sessions) {
//       totalDistance += session.statistics?.totalDistance || 0;
//       totalDuration += session.statistics?.totalDuration || 0;
//       totalLocations += session.statistics?.locationsCount || 0;
//       if (session.isActive) activeSessions++;
//     }
    
//     // Get technician info
//     const technician = await User.findById(technicianId).select('name email technicianType buildingId');
    
//     // Get daily breakdown
//     const dailyBreakdown = [];
//     const currentDate = new Date(startDate);
//     while (currentDate <= endDate) {
//       const dayStart = new Date(currentDate);
//       dayStart.setHours(0, 0, 0, 0);
//       const dayEnd = new Date(currentDate);
//       dayEnd.setHours(23, 59, 59, 999);
      
//       const daySessions = sessions.filter(s => 
//         s.sessionStart >= dayStart && s.sessionStart <= dayEnd
//       );
      
//       const dayDistance = daySessions.reduce((sum, s) => sum + (s.statistics?.totalDistance || 0), 0);
      
//       dailyBreakdown.push({
//         date: currentDate.toISOString().split('T')[0],
//         dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
//         sessions: daySessions.length,
//         distanceKm: Math.round(dayDistance / 1000),
//         isActive: daySessions.some(s => s.isActive)
//       });
      
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
    
//     res.json({
//       success: true,
//       data: {
//         technician: {
//           id: technician?._id,
//           name: technician?.name,
//           email: technician?.email,
//           technicianType: technician?.technicianType,
//           buildingId: technician?.buildingId
//         },
//         period,
//         range: {
//           startDate,
//           endDate
//         },
//         summary: {
//           totalSessions: sessions.length,
//           activeSessions,
//           totalDistance: Math.round(totalDistance / 1000), // km
//           totalDuration: Math.floor(totalDuration / 3600), // hours
//           averageSpeed: totalDuration > 0 ? Math.round((totalDistance / 1000) / (totalDuration / 3600)) : 0,
//           totalLocations,
//           mostActiveDay: dailyBreakdown.reduce((max, day) => day.sessions > max.sessions ? day : max, { sessions: 0 })
//         },
//         dailyBreakdown
//       }
//     });
//   } catch (error) {
//     console.error('Get technician tracking summary error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== EXPORTS ====================

// module.exports = {
//   updateLocation,
//   getLiveLocations,
//   getCurrentSession,
//   endSession,
//   getRouteHistory,
//   getTechnicianTrackingSummary
// };






/**
 * TRACKING CONTROLLER
 * Handles GPS location tracking and route history
 */

const LocationTracking = require('../models/location-tracking.model');
const TrackingSession = require('../models/TrackingSession.model');
const User = require('../models/User.model');
const Task = require('../models/Task.model');
const Notification = require('../models/Notification.model');
const ActivityLog = require('../models/ActivityLog.model');
const { getIO } = require('../config/socketio');

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate distance between two points in meters (Haversine formula)
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Send notification to supervisor about location update
 */
const sendLocationNotification = async (technicianId, technicianName, action, location) => {
  try {
    const technician = await User.findById(technicianId);
    if (technician?.supervisorId) {
      const io = getIO();
      const notification = {
        title: action === 'start' ? '📍 Shift Started' : '📍 Shift Ended',
        body: `${technicianName} has ${action === 'start' ? 'started' : 'ended'} their shift`,
        type: 'tracking',
        priority: 'medium',
        referenceId: technicianId,
        referenceModel: 'User',
        data: { location, action, timestamp: new Date() }
      };
      
      if (io) {
        io.to(`user_${technician.supervisorId}`).emit('technician_status_change', notification);
      }
      
      await Notification.create({
        userId: technician.supervisorId,
        ...notification
      });
    }
  } catch (error) {
    console.error('Send location notification error:', error);
  }
};

// ==================== UPDATE LOCATION ====================

/**
 * Update technician location
 */
exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng, accuracy, speed, heading, taskId } = req.body;
    const technicianId = req.user._id || req.userId;
    const technicianName = req.user.name;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: 'Latitude and longitude are required' });
    }

    // Find or create active tracking session
    let tracking = await LocationTracking.findOne({ 
      technicianId, 
      isActive: true 
    });

    if (!tracking) {
      tracking = new LocationTracking({
        technicianId,
        technicianName,
        technicianRole: req.user.role,
        technicianType: req.user.technicianType,
        sessionStart: new Date(),
        isActive: true,
        routeHistory: [],
        statistics: {
          totalDistance: 0,
          totalDuration: 0,
          avgSpeed: 0,
          maxSpeed: 0,
          locationsCount: 0
        }
      });
      
      await sendLocationNotification(technicianId, technicianName, 'start', { lat, lng });
    }

    tracking.currentLocation = {
      lat,
      lng,
      accuracy: accuracy || 10,
      speed: speed || 0,
      heading: heading || 0,
      timestamp: new Date(),
      taskId: taskId || null
    };
    
    tracking.routeHistory.push({
      lat,
      lng,
      accuracy: accuracy || 10,
      speed: speed || 0,
      heading: heading || 0,
      timestamp: new Date(),
      taskId: taskId || null
    });
    
    if (tracking.routeHistory.length > 2000) {
      tracking.routeHistory = tracking.routeHistory.slice(-1500);
    }
    
    tracking.statistics.locationsCount += 1;
    tracking.updatedAt = new Date();
    
    await tracking.save();
    
    // Update user's last known location
    await User.findByIdAndUpdate(technicianId, {
      'lastLocation.lat': lat,
      'lastLocation.lng': lng,
      'lastLocation.updatedAt': new Date(),
      isOnline: true
    });
    
    const io = getIO();
    if (io) {
      io.to('role_supervisor').to('role_manager').to('role_admin').emit('technician_location_update', {
        technicianId,
        technicianName,
        location: tracking.currentLocation,
        isActive: true,
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      data: {
        trackingId: tracking._id,
        currentLocation: tracking.currentLocation,
        statistics: tracking.statistics,
        isActive: tracking.isActive
      },
      message: 'Location updated successfully'
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== START SESSION ====================

/**
 * Start tracking session
 */
exports.startSession = async (req, res) => {
  try {
    const { taskId, location } = req.body;
    const userId = req.user._id || req.userId;
    const userName = req.user.name;
    
    // End any existing active session
    await TrackingSession.updateMany(
      { userId, status: 'active' },
      { status: 'ended', endedAt: new Date() }
    );
    
    const session = new TrackingSession({
      userId,
      userName,
      taskId,
      startLocation: location,
      startTime: new Date(),
      status: 'active',
      locations: location ? [{ ...location, timestamp: new Date() }] : []
    });
    
    await session.save();
    
    res.json({
      success: true,
      data: session,
      message: 'Tracking session started'
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET CURRENT SESSION ====================

/**
 * Get current tracking session for technician
 */
exports.getCurrentSession = async (req, res) => {
  try {
    const technicianId = req.user._id || req.userId;
    
    // Try to get from new TrackingSession model
    let session = await TrackingSession.findOne({ 
      userId: technicianId, 
      status: 'active' 
    }).sort({ startTime: -1 });
    
    if (session) {
      const sessionDuration = session.startTime ? 
        Math.floor((Date.now() - new Date(session.startTime)) / 1000 / 60) : 0;
      
      return res.json({
        success: true,
        data: {
          isActive: true,
          hasActiveSession: true,
          trackingId: session._id,
          sessionStart: session.startTime,
          sessionDuration: sessionDuration,
          currentLocation: session.locations?.[session.locations.length - 1] || null,
          taskId: session.taskId,
          statistics: session.statistics || { totalDistance: 0, locationsCount: session.locations?.length || 0 }
        }
      });
    }
    
    // Fallback to old LocationTracking model
    const tracking = await LocationTracking.findOne({ 
      technicianId, 
      isActive: true 
    });
    
    const currentTask = await Task.findOne({
      'assignment.assignedTo': technicianId,
      status: { $in: ['accepted', 'in_progress'] },
      isDeleted: false
    }).select('_id taskId title priority status');
    
    if (!tracking) {
      return res.json({
        success: true,
        data: {
          isActive: false,
          hasActiveSession: false,
          currentTask: currentTask || null,
          message: 'No active tracking session'
        }
      });
    }
    
    const sessionDuration = tracking.sessionStart ? 
      Math.floor((Date.now() - new Date(tracking.sessionStart)) / 1000 / 60) : 0;
    
    res.json({
      success: true,
      data: {
        isActive: tracking.isActive,
        hasActiveSession: true,
        trackingId: tracking._id,
        sessionStart: tracking.sessionStart,
        sessionDuration: sessionDuration,
        currentLocation: tracking.currentLocation,
        currentTask: currentTask || null,
        statistics: tracking.statistics,
        routeHistoryCount: tracking.routeHistory.length,
        lastUpdate: tracking.updatedAt
      }
    });
  } catch (error) {
    console.error('Get current session error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== END SESSION ====================

/**
 * End tracking session
 */
exports.endSession = async (req, res) => {
  try {
    const technicianId = req.user._id || req.userId;
    const technicianName = req.user.name;
    const { location, notes } = req.body;
    
    // Try to end from new TrackingSession model
    let session = await TrackingSession.findOneAndUpdate(
      { userId: technicianId, status: 'active' },
      {
        endLocation: location,
        endTime: new Date(),
        status: 'ended',
        notes: notes || ''
      },
      { new: true }
    );
    
    if (session) {
      if (session.locations && session.locations.length > 0) {
        let totalDistance = 0;
        for (let i = 1; i < session.locations.length; i++) {
          const prev = session.locations[i - 1];
          const curr = session.locations[i];
          if (prev.lat && prev.lng && curr.lat && curr.lng) {
            totalDistance += calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
          }
        }
        session.totalDistance = totalDistance;
        await session.save();
      }
      
      return res.json({
        success: true,
        data: session,
        message: 'Tracking session ended'
      });
    }
    
    // Fallback to old LocationTracking model
    const tracking = await LocationTracking.findOneAndUpdate(
      { technicianId, isActive: true },
      { 
        isActive: false,
        sessionEnd: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!tracking) {
      return res.status(404).json({ 
        success: false, 
        error: 'No active tracking session found' 
      });
    }
    
    await User.findByIdAndUpdate(technicianId, {
      isOnline: false,
      'lastLocation.updatedAt': new Date()
    });
    
    await sendLocationNotification(technicianId, technicianName, 'end', tracking.currentLocation);
    
    await ActivityLog.create({
      userId: technicianId,
      userName: technicianName,
      userRole: req.user.role,
      action: 'END_TRACKING_SESSION',
      entityType: 'tracking',
      entityId: tracking._id,
      newData: { sessionDuration: tracking.statistics.totalDuration, totalDistance: tracking.statistics.totalDistance },
      ipAddress: req.ip
    });
    
    const io = getIO();
    if (io) {
      io.to('role_supervisor').to('role_manager').emit('technician_session_ended', {
        technicianId,
        technicianName,
        sessionSummary: tracking.statistics,
        timestamp: new Date()
      });
    }
    
    res.json({
      success: true,
      data: {
        sessionSummary: tracking.statistics,
        sessionStart: tracking.sessionStart,
        sessionEnd: tracking.sessionEnd,
        totalLocations: tracking.statistics.locationsCount
      },
      message: 'Tracking session ended successfully'
    });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET LIVE LOCATIONS ====================

/**
 * Get live locations of all technicians (for supervisors/managers)
 */
exports.getLiveLocations = async (req, res) => {
  try {
    const { buildingId, status } = req.query;
    const userRole = req.user.role;
    const userId = req.user._id || req.userId;
    
    let query = { isActive: true };
    
    if (userRole === 'supervisor') {
      const technicians = await User.find({ supervisorId: userId, role: 'technician' }).select('_id');
      const techIds = technicians.map(t => t._id);
      query.technicianId = { $in: techIds };
    } else if (userRole === 'manager' && buildingId) {
      const technicians = await User.find({ buildingId, role: 'technician' }).select('_id');
      const techIds = technicians.map(t => t._id);
      query.technicianId = { $in: techIds };
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    const locations = await LocationTracking.find(query)
      .populate('technicianId', 'name email profileImage technicianType buildingId')
      .sort({ 'currentLocation.timestamp': -1 });

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const liveLocations = locations.map(loc => {
      const isOnline = loc.currentLocation?.timestamp && new Date(loc.currentLocation.timestamp) > fiveMinutesAgo;
      const hasRecentActivity = loc.updatedAt && new Date(loc.updatedAt) > fiveMinutesAgo;
      
      return {
        technician: {
          id: loc.technicianId?._id,
          name: loc.technicianName || (loc.technicianId ? `${loc.technicianId.firstName} ${loc.technicianId.lastName}` : 'Unknown'),
          email: loc.technicianId?.email,
          profileImage: loc.technicianId?.profileImage,
          technicianType: loc.technicianType || loc.technicianId?.technicianType,
          buildingId: loc.technicianId?.buildingId
        },
        location: loc.currentLocation,
        isOnline: isOnline && hasRecentActivity,
        isActive: loc.isActive,
        sessionStart: loc.sessionStart,
        sessionEnd: loc.sessionEnd,
        lastUpdate: loc.currentLocation?.timestamp || loc.updatedAt,
        statistics: loc.statistics,
        routePreview: loc.routeHistory?.slice(-5) || []
      };
    });
    
    const onlineCount = liveLocations.filter(l => l.isOnline).length;
    const activeCount = liveLocations.filter(l => l.isActive).length;
    
    res.json({
      success: true,
      data: {
        technicians: liveLocations,
        summary: {
          total: liveLocations.length,
          online: onlineCount,
          active: activeCount,
          offline: liveLocations.length - onlineCount
        },
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Get live locations error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TECHNICIAN LIVE LOCATION ====================

/**
 * Get technician live location
 */
exports.getTechnicianLiveLocation = async (req, res) => {
  try {
    const { technicianId } = req.params;
    
    const user = await User.findById(technicianId)
      .select('_id firstName lastName email profileImage lastLocation');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Technician not found' });
    }
    
    const isActive = user.lastLocation?.updatedAt && 
      new Date(user.lastLocation.updatedAt) > new Date(Date.now() - 5 * 60 * 1000);
    
    res.json({
      success: true,
      data: {
        technician: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          profileImage: user.profileImage
        },
        location: user.lastLocation,
        isOnline: isActive
      }
    });
  } catch (error) {
    console.error('Get technician live location error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET ROUTE HISTORY ====================

/**
 * Get route history for a technician
 */
exports.getRouteHistory = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { fromDate, toDate, limit = 100 } = req.query;
    
    const query = { userId: technicianId, status: 'ended' };
    
    if (fromDate) query.startTime = { $gte: new Date(fromDate) };
    if (toDate) query.endTime = { $lte: new Date(toDate) };
    
    const sessions = await TrackingSession.find(query)
      .sort({ startTime: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Get route history error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET MY ROUTE HISTORY ====================

/**
 * Get my route history (for current technician)
 */
exports.getMyRouteHistory = async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    const { fromDate, toDate, limit = 100 } = req.query;
    
    const query = { userId, status: 'ended' };
    
    if (fromDate) query.startTime = { $gte: new Date(fromDate) };
    if (toDate) query.endTime = { $lte: new Date(toDate) };
    
    const sessions = await TrackingSession.find(query)
      .sort({ startTime: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Get my route history error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET ROUTE HISTORY BY DATE RANGE ====================

/**
 * Get route history by date range
 */
exports.getRouteHistoryByDateRange = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Both startDate and endDate are required'
      });
    }
    
    const sessions = await TrackingSession.find({
      userId: technicianId,
      startTime: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).sort({ startTime: 1 });
    
    res.json({
      success: true,
      data: sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Get route history by date range error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TECHNICIAN TRACKING SUMMARY ====================

/**
 * Get technician tracking summary
 */
exports.getTechnicianTrackingSummary = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const sessions = await TrackingSession.find({
      userId: technicianId,
      status: 'ended',
      startTime: { $gte: startDate }
    });
    
    const totalDistance = sessions.reduce((sum, s) => sum + (s.totalDistance || 0), 0);
    const totalSessions = sessions.length;
    const averageDistance = totalSessions > 0 ? totalDistance / totalSessions : 0;
    
    // Group by date
    const byDate = {};
    sessions.forEach(session => {
      const date = session.startTime.toISOString().split('T')[0];
      if (!byDate[date]) {
        byDate[date] = { distance: 0, sessions: 0, time: 0 };
      }
      byDate[date].distance += session.totalDistance || 0;
      byDate[date].sessions += 1;
      if (session.startTime && session.endTime) {
        byDate[date].time += (session.endTime - session.startTime);
      }
    });
    
    res.json({
      success: true,
      data: {
        technicianId,
        summary: {
          totalDistance: Math.round(totalDistance * 100) / 100,
          totalSessions,
          averageDistance: Math.round(averageDistance * 100) / 100,
          period: `${days} days`
        },
        dailyBreakdown: byDate
      }
    });
  } catch (error) {
    console.error('Get technician tracking summary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET MY TRACKING SUMMARY ====================

/**
 * Get tracking summary for current technician
 */
exports.getMyTrackingSummary = async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sessions = await TrackingSession.find({
      userId,
      status: 'ended',
      startTime: { $gte: today }
    });
    
    const totalDistance = sessions.reduce((sum, s) => sum + (s.totalDistance || 0), 0);
    const totalTime = sessions.reduce((sum, s) => {
      if (s.startTime && s.endTime) {
        return sum + (s.endTime - s.startTime);
      }
      return sum;
    }, 0);
    
    res.json({
      success: true,
      data: {
        today: {
          sessionsCount: sessions.length,
          totalDistance: Math.round(totalDistance * 100) / 100,
          totalTimeMinutes: Math.round(totalTime / (1000 * 60))
        }
      }
    });
  } catch (error) {
    console.error('Get my tracking summary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET ALL TECHNICIANS SUMMARY ====================

/**
 * Get all technicians tracking summary
 */
exports.getAllTechniciansSummary = async (req, res) => {
  try {
    const technicians = await User.find({ role: 'technician', status: 'active' })
      .select('_id firstName lastName email');
    
    const summaries = await Promise.all(technicians.map(async (tech) => {
      const sessions = await TrackingSession.find({
        userId: tech._id,
        status: 'ended',
        startTime: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });
      
      const totalDistance = sessions.reduce((sum, s) => sum + (s.totalDistance || 0), 0);
      const totalSessions = sessions.length;
      
      return {
        technician: {
          id: tech._id,
          name: `${tech.firstName} ${tech.lastName}`,
          email: tech.email
        },
        totalDistance: Math.round(totalDistance * 100) / 100,
        totalSessions,
        lastActive: sessions[0]?.endTime || null
      };
    }));
    
    res.json({
      success: true,
      data: summaries,
      count: summaries.length
    });
  } catch (error) {
    console.error('Get all technicians summary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET TRACKING DASHBOARD STATS ====================

/**
 * Get tracking dashboard statistics
 */
exports.getTrackingDashboardStats = async (req, res) => {
  try {
    const activeSessions = await TrackingSession.countDocuments({ status: 'active' });
    const todaySessions = await TrackingSession.countDocuments({
      status: 'ended',
      startTime: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    
    const technicians = await User.countDocuments({ role: 'technician', status: 'active' });
    const onlineTechnicians = await User.countDocuments({
      role: 'technician',
      'lastLocation.updatedAt': { $gte: new Date(Date.now() - 5 * 60 * 1000) }
    });
    
    res.json({
      success: true,
      data: {
        activeTrackingSessions: activeSessions,
        todaySessions,
        totalTechnicians: technicians,
        onlineTechnicians,
        offlineTechnicians: technicians - onlineTechnicians
      }
    });
  } catch (error) {
    console.error('Get tracking dashboard stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET ACTIVE SESSIONS COUNT ====================

/**
 * Get active sessions count
 */
exports.getActiveSessionsCount = async (req, res) => {
  try {
    const count = await TrackingSession.countDocuments({ status: 'active' });
    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('Get active sessions count error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET DISTANCE TRAVELED ====================

/**
 * Get distance traveled for a technician
 */
exports.getDistanceTraveled = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { fromDate, toDate } = req.query;
    
    const query = { userId: technicianId, status: 'ended' };
    if (fromDate) query.startTime = { $gte: new Date(fromDate) };
    if (toDate) query.endTime = { $lte: new Date(toDate) };
    
    const sessions = await TrackingSession.find(query);
    const totalDistance = sessions.reduce((sum, s) => sum + (s.totalDistance || 0), 0);
    
    res.json({
      success: true,
      data: {
        technicianId,
        totalDistance: Math.round(totalDistance * 100) / 100,
        unit: 'km',
        sessionsCount: sessions.length
      }
    });
  } catch (error) {
    console.error('Get distance traveled error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET LAST KNOWN LOCATION ====================

/**
 * Get last known location of a technician
 */
exports.getLastKnownLocation = async (req, res) => {
  try {
    const { technicianId } = req.params;
    
    const user = await User.findById(technicianId)
      .select('lastLocation');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Technician not found' });
    }
    
    const session = await TrackingSession.findOne({ userId: technicianId, status: 'ended' })
      .sort({ endTime: -1 });
    
    res.json({
      success: true,
      data: {
        location: user.lastLocation,
        lastSession: session,
        isActive: user.lastLocation?.updatedAt && 
          new Date(user.lastLocation.updatedAt) > new Date(Date.now() - 5 * 60 * 1000)
      }
    });
  } catch (error) {
    console.error('Get last known location error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== VISITOR TRACKING ====================

/**
 * Track visitor movement (for security)
 */
exports.trackVisitor = async (req, res) => {
  try {
    const { visitorId, location, activity } = req.body;
    
    const visitorTracking = await VisitorTracking.findOneAndUpdate(
      { visitorId, status: 'active' },
      {
        $push: {
          locations: {
            location,
            timestamp: new Date(),
            activity: activity || 'movement'
          }
        },
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.json({
      success: true,
      data: visitorTracking,
      message: 'Visitor location updated'
    });
  } catch (error) {
    console.error('Track visitor error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get visitor tracking history
 */
exports.getVisitorTrackingHistory = async (req, res) => {
  try {
    const { visitorId } = req.params;
    
    const tracking = await VisitorTracking.find({ visitorId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: tracking
    });
  } catch (error) {
    console.error('Get visitor tracking history error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== EXPORTS ====================

module.exports = {
  updateLocation: exports.updateLocation,
  startSession: exports.startSession,
  getCurrentSession: exports.getCurrentSession,
  endSession: exports.endSession,
  getLiveLocations: exports.getLiveLocations,
  getTechnicianLiveLocation: exports.getTechnicianLiveLocation,
  getRouteHistory: exports.getRouteHistory,
  getMyRouteHistory: exports.getMyRouteHistory,
  getRouteHistoryByDateRange: exports.getRouteHistoryByDateRange,
  getTechnicianTrackingSummary: exports.getTechnicianTrackingSummary,
  getMyTrackingSummary: exports.getMyTrackingSummary,
  getAllTechniciansSummary: exports.getAllTechniciansSummary,
  getTrackingDashboardStats: exports.getTrackingDashboardStats,
  getActiveSessionsCount: exports.getActiveSessionsCount,
  getDistanceTraveled: exports.getDistanceTraveled,
  getLastKnownLocation: exports.getLastKnownLocation,
  trackVisitor: exports.trackVisitor,
  getVisitorTrackingHistory: exports.getVisitorTrackingHistory
};