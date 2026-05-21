/**
 * GEOFENCE CONTROLLER
 * Handles geofence CRUD and location validation
 */

// const Geofence = require('../models/geofence.model');
// const Building = require('../models/building.model');

// /**
//  * Create geofence
//  */
// exports.createGeofence = async (req, res) => {
//   try {
//     const geofenceData = req.body;
//     geofenceData.createdBy = req.userId;
    
//     const geofence = new Geofence(geofenceData);
//     await geofence.save();

//     res.status(201).json({
//       success: true,
//       data: geofence,
//       message: 'Geofence created successfully'
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get all geofences
//  */
// exports.getGeofences = async (req, res) => {
//   try {
//     const { buildingId, type } = req.query;
    
//     const query = {};
//     if (buildingId) query.buildingId = buildingId;
//     if (type) query.type = type;
    
//     const geofences = await Geofence.find(query)
//       .populate('buildingId', 'name code')
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: geofences
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get geofence by ID
//  */
// exports.getGeofenceById = async (req, res) => {
//   try {
//     const geofence = await Geofence.findById(req.params.id)
//       .populate('buildingId', 'name code address');
    
//     if (!geofence) {
//       return res.status(404).json({ success: false, error: 'Geofence not found' });
//     }

//     res.json({
//       success: true,
//       data: geofence
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Update geofence
//  */
// exports.updateGeofence = async (req, res) => {
//   try {
//     const updates = req.body;
//     updates.updatedBy = req.userId;
//     updates.updatedAt = new Date();
    
//     const geofence = await Geofence.findByIdAndUpdate(
//       req.params.id,
//       updates,
//       { new: true, runValidators: true }
//     );

//     if (!geofence) {
//       return res.status(404).json({ success: false, error: 'Geofence not found' });
//     }

//     res.json({
//       success: true,
//       data: geofence,
//       message: 'Geofence updated successfully'
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Delete geofence
//  */
// exports.deleteGeofence = async (req, res) => {
//   try {
//     const geofence = await Geofence.findByIdAndDelete(req.params.id);
    
//     if (!geofence) {
//       return res.status(404).json({ success: false, error: 'Geofence not found' });
//     }

//     res.json({
//       success: true,
//       message: 'Geofence deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Check if location is within geofence
//  */
// exports.checkLocation = async (req, res) => {
//   try {
//     const { location, buildingId } = req.body;
    
//     const geofences = await Geofence.find({ 
//       buildingId,
//       isActive: true 
//     });

//     let isWithin = false;
//     let currentGeofence = null;

//     for (const geofence of geofences) {
//       if (geofence.containsPoint(location.lat, location.lng)) {
//         isWithin = true;
//         currentGeofence = geofence;
//         break;
//       }
//     }

//     res.json({
//       success: true,
//       data: {
//         isWithin,
//         geofence: currentGeofence,
//         location
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get geofences by building
//  */
// exports.getGeofencesByBuilding = async (req, res) => {
//   try {
//     const { buildingId } = req.params;
    
//     const geofences = await Geofence.find({ 
//       buildingId,
//       isActive: true 
//     });

//     res.json({
//       success: true,
//       data: geofences
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


/**
 * GEOFENCE CONTROLLER
 * Handles geofence CRUD and location validation
 */

const Geofence = require('../models/Geofence.model');
const Building = require('../models/Building.model');
const User = require('../models/User.model');
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
 * Check if point is inside polygon (Ray casting algorithm)
 */
const isPointInPolygon = (lat, lng, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude;
    const yi = polygon[i].longitude;
    const xj = polygon[j].latitude;
    const yj = polygon[j].longitude;
    
    const intersect = ((yi > lng) !== (yj > lng)) &&
      (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

/**
 * Check if point is within circle geofence
 */
const isWithinCircle = (lat, lng, centerLat, centerLng, radius) => {
  const distance = calculateDistance(lat, lng, centerLat, centerLng);
  return distance <= radius;
};

/**
 * Send geofence breach notification
 */
const sendGeofenceAlert = async (userId, userName, geofence, location, action) => {
  try {
    const io = getIO();
    const notification = {
      title: action === 'entry' ? '📍 Entered Geofence' : '⚠️ Exited Geofence',
      body: `${userName} has ${action === 'entry' ? 'entered' : 'exited'} ${geofence.name}`,
      type: 'geofence',
      priority: action === 'exit' ? 'high' : 'medium',
      referenceId: geofence._id,
      referenceModel: 'Geofence',
      data: {
        userId,
        userName,
        geofenceName: geofence.name,
        buildingName: geofence.buildingId?.name,
        location,
        action,
        timestamp: new Date()
      }
    };
    
    // Notify supervisors and managers
    const supervisors = await User.find({ 
      buildingId: geofence.buildingId, 
      role: { $in: ['supervisor', 'manager'] } 
    });
    
    for (const supervisor of supervisors) {
      if (io) {
        io.to(`user_${supervisor._id}`).emit('geofence_alert', notification);
      }
      await Notification.create({
        userId: supervisor._id,
        ...notification
      });
    }
    
    // Also notify admins
    if (io) {
      io.to('role_admin').to('role_super_admin').emit('geofence_alert', notification);
    }
  } catch (error) {
    console.error('Send geofence alert error:', error);
  }
};

// ==================== CREATE GEOFENCE ====================

/**
 * Create geofence
 */
const createGeofence = async (req, res) => {
  try {
    const {
      name,
      buildingId,
      shape,
      coordinates,
      radius,
      polygon,
      allowedRoles,
      checkInRequired,
      checkOutRequired,
      allowedCheckInTime
    } = req.body;
    const userId = req.user._id || req.userId;
    const userName = req.user.name;
    
    // Verify building exists
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    // Check if geofence already exists for this building
    const existingGeofence = await Geofence.findOne({ buildingId, isActive: true });
    if (existingGeofence) {
      return res.status(400).json({ 
        success: false, 
        error: 'A geofence already exists for this building. Please update the existing one.' 
      });
    }
    
    const geofenceData = {
      name,
      buildingId,
      shape: shape || 'circle',
      allowedRoles: allowedRoles || ['all'],
      checkInRequired: checkInRequired !== false,
      checkOutRequired: checkOutRequired !== false,
      allowedCheckInTime: allowedCheckInTime || { start: '00:00', end: '23:59' },
      createdBy: userId
    };
    
    if (shape === 'circle') {
      if (!coordinates?.center || !radius) {
        return res.status(400).json({ success: false, error: 'Center coordinates and radius are required for circle geofence' });
      }
      geofenceData.coordinates = {
        center: coordinates.center,
        radius: radius || 100
      };
    } else if (shape === 'polygon') {
      if (!polygon && !coordinates?.polygon) {
        return res.status(400).json({ success: false, error: 'Polygon coordinates are required for polygon geofence' });
      }
      geofenceData.coordinates = {
        polygon: polygon || coordinates.polygon
      };
    }
    
    const geofence = new Geofence(geofenceData);
    await geofence.save();
    
    await ActivityLog.create({
      userId,
      userName,
      userRole: req.user.role,
      action: 'CREATE_GEOFENCE',
      entityType: 'geofence',
      entityId: geofence._id,
      newData: { name, buildingId: building.name, shape },
      ipAddress: req.ip
    });
    
    res.status(201).json({
      success: true,
      data: geofence,
      message: 'Geofence created successfully'
    });
  } catch (error) {
    console.error('Create geofence error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET ALL GEOFENCES ====================

/**
 * Get all geofences with filters
 */
const getGeofences = async (req, res) => {
  try {
    const { buildingId, isActive, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (buildingId) query.buildingId = buildingId;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const skip = (page - 1) * limit;
    
    const [geofences, total] = await Promise.all([
      Geofence.find(query)
        .populate('buildingId', 'name code address')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Geofence.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: geofences,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get geofences error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET GEOFENCE BY ID ====================

/**
 * Get geofence by ID
 */
const getGeofenceById = async (req, res) => {
  try {
    const geofence = await Geofence.findById(req.params.id)
      .populate('buildingId', 'name code address')
      .populate('createdBy', 'name email');
    
    if (!geofence) {
      return res.status(404).json({ success: false, error: 'Geofence not found' });
    }
    
    res.json({
      success: true,
      data: geofence
    });
  } catch (error) {
    console.error('Get geofence by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== UPDATE GEOFENCE ====================

/**
 * Update geofence
 */
const updateGeofence = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user._id || req.userId;
    const userName = req.user.name;
    
    updates.updatedBy = userId;
    updates.updatedAt = new Date();
    
    const geofence = await Geofence.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!geofence) {
      return res.status(404).json({ success: false, error: 'Geofence not found' });
    }
    
    await ActivityLog.create({
      userId,
      userName,
      userRole: req.user.role,
      action: 'UPDATE_GEOFENCE',
      entityType: 'geofence',
      entityId: geofence._id,
      newData: updates,
      ipAddress: req.ip
    });
    
    res.json({
      success: true,
      data: geofence,
      message: 'Geofence updated successfully'
    });
  } catch (error) {
    console.error('Update geofence error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== DELETE GEOFENCE ====================

/**
 * Delete geofence (soft delete)
 */
const deleteGeofence = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.userId;
    const userName = req.user.name;
    
    const geofence = await Geofence.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    if (!geofence) {
      return res.status(404).json({ success: false, error: 'Geofence not found' });
    }
    
    await ActivityLog.create({
      userId,
      userName,
      userRole: req.user.role,
      action: 'DELETE_GEOFENCE',
      entityType: 'geofence',
      entityId: geofence._id,
      oldData: { name: geofence.name, buildingId: geofence.buildingId },
      ipAddress: req.ip
    });
    
    res.json({
      success: true,
      message: 'Geofence deleted successfully'
    });
  } catch (error) {
    console.error('Delete geofence error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== CHECK LOCATION ====================

/**
 * Check if a location is within any geofence
 */
const checkLocation = async (req, res) => {
  try {
    const { latitude, longitude, userId } = req.body;
    const targetUserId = userId || req.user._id || req.userId;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, error: 'Latitude and longitude are required' });
    }
    
    // Get user's building
    const user = await User.findById(targetUserId);
    if (!user || !user.buildingId) {
      return res.json({ 
        success: true, 
        isValid: true, 
        message: 'No geofence configured for this user',
        insideAnyGeofence: false
      });
    }
    
    // Find geofence for user's building
    const geofence = await Geofence.findOne({ 
      buildingId: user.buildingId, 
      isActive: true 
    }).populate('buildingId', 'name code');
    
    if (!geofence) {
      return res.json({ 
        success: true, 
        isValid: true, 
        message: 'No active geofence for this building',
        insideAnyGeofence: false
      });
    }
    
    // Check if user role is allowed
    if (!geofence.allowedRoles.includes('all') && 
        !geofence.allowedRoles.includes(user.role)) {
      return res.json({ 
        success: true, 
        isValid: true, 
        message: 'Your role is not restricted by geofence',
        insideAnyGeofence: true
      });
    }
    
    // Check time restrictions
    if (geofence.allowedCheckInTime) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [startHour, startMin] = geofence.allowedCheckInTime.start.split(':');
      const [endHour, endMin] = geofence.allowedCheckInTime.end.split(':');
      const startTime = parseInt(startHour) * 60 + parseInt(startMin);
      const endTime = parseInt(endHour) * 60 + parseInt(endMin);
      
      if (currentTime < startTime || currentTime > endTime) {
        return res.json({ 
          success: true, 
          isValid: false, 
          message: `Check-in only allowed between ${geofence.allowedCheckInTime.start} and ${geofence.allowedCheckInTime.end}`,
          insideAnyGeofence: false,
          reason: 'time_restriction'
        });
      }
    }
    
    let isValid = false;
    let distance = null;
    
    // Geofence containsPoint method
    if (typeof geofence.containsPoint === 'function') {
      isValid = geofence.containsPoint(latitude, longitude);
    } else if (geofence.shape === 'circle') {
      const center = geofence.coordinates.center;
      const radius = geofence.coordinates.radius;
      distance = calculateDistance(latitude, longitude, center.latitude, center.longitude);
      isValid = distance <= radius;
    } else if (geofence.shape === 'polygon' && geofence.coordinates.polygon) {
      isValid = isPointInPolygon(latitude, longitude, geofence.coordinates.polygon);
    }
    
    // Check if user's location has changed (entry/exit)
    const previousLocation = user.lastLocation;
    const wasInside = previousLocation?.isInsideGeofence;
    
    if (wasInside !== undefined && wasInside !== isValid) {
      // User crossed boundary
      const action = isValid ? 'entry' : 'exit';
      await sendGeofenceAlert(targetUserId, user.name, geofence, { latitude, longitude }, action);
      
      // Update user's location status
      await User.findByIdAndUpdate(targetUserId, {
        'lastLocation.isInsideGeofence': isValid,
        'lastLocation.lastCheck': new Date()
      });
    }
    
    res.json({
      success: true,
      isValid,
      distance: distance ? Math.round(distance) : null,
      radius: geofence.shape === 'circle' && geofence.coordinates.radius ? geofence.coordinates.radius : null,
      geofence: {
        id: geofence._id,
        name: geofence.name,
        building: geofence.buildingId?.name,
        shape: geofence.shape
      },
      message: isValid ? 'Location is within geofence' : 'Location is outside geofence'
    });
  } catch (error) {
    console.error('Check location error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GET GEOFENCES BY BUILDING ====================

/**
 * Get geofences by building ID
 */
const getGeofencesByBuilding = async (req, res) => {
  try {
    const { buildingId } = req.params;
    
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).json({ success: false, error: 'Building not found' });
    }
    
    const geofences = await Geofence.find({ 
      buildingId, 
      isActive: true 
    }).populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: {
        building: {
          id: building._id,
          name: building.name,
          code: building.code,
          address: building.address
        },
        geofences,
        count: geofences.length
      }
    });
  } catch (error) {
    console.error('Get geofences by building error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== BULK OPERATIONS ====================

/**
 * Bulk create geofences
 */
const bulkCreateGeofences = async (req, res) => {
  try {
    const { geofences } = req.body;
    const userId = req.user._id || req.userId;
    const userName = req.user.name;
    
    const created = [];
    const failed = [];
    
    for (const geofenceData of geofences) {
      try {
        geofenceData.createdBy = userId;
        const geofence = new Geofence(geofenceData);
        await geofence.save();
        created.push(geofence);
      } catch (error) {
        failed.push({ data: geofenceData, error: error.message });
      }
    }
    
    await ActivityLog.create({
      userId,
      userName,
      userRole: req.user.role,
      action: 'BULK_CREATE_GEOFENCE',
      entityType: 'geofence',
      newData: { created: created.length, failed: failed.length },
      ipAddress: req.ip
    });
    
    res.status(201).json({
      success: true,
      data: { created, failed },
      message: `Created ${created.length} geofences, ${failed.length} failed`
    });
  } catch (error) {
    console.error('Bulk create geofences error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== EXPORTS ====================

module.exports = {
  createGeofence,
  getGeofences,
  getGeofenceById,
  updateGeofence,
  deleteGeofence,
  checkLocation,
  getGeofencesByBuilding,
  bulkCreateGeofences
};