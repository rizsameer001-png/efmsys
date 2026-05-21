/**
 * LOCATION TRACKING MODEL
 * Real-time GPS tracking for technicians with route history
 */

const mongoose = require('mongoose');

const locationTrackingSchema = new mongoose.Schema({
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  technicianName: String,
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  
  // Current Location
  currentLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    accuracy: Number,
    speed: Number,
    heading: Number,
    altitude: Number,
    address: String,
    timestamp: { type: Date, default: Date.now, index: true }
  },
  
  // Route History (for current session)
  routeHistory: [{
    lat: Number,
    lng: Number,
    accuracy: Number,
    speed: Number,
    heading: Number,
    timestamp: Date,
    address: String
  }],
  
  // Session Information
  sessionId: String,
  sessionStart: Date,
  sessionEnd: Date,
  isActive: { type: Boolean, default: true, index: true },
  
  // Geofence Status
  geofenceStatus: {
    isWithinGeofence: { type: Boolean, default: false },
    currentGeofenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Geofence' },
    lastExitTime: Date,
    lastEntryTime: Date
  },
  
  // Statistics
  statistics: {
    totalDistance: { type: Number, default: 0 }, // meters
    totalDuration: { type: Number, default: 0 }, // minutes
    locationsCount: { type: Number, default: 0 },
    avgSpeed: { type: Number, default: 0 } // km/h
  },
  
  // Device Information
  deviceInfo: {
    deviceId: String,
    platform: String,
    appVersion: String,
    batteryLevel: Number,
    isCharging: Boolean
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes for performance
locationTrackingSchema.index({ technicianId: 1, isActive: 1 });
locationTrackingSchema.index({ 'currentLocation.timestamp': -1 });
locationTrackingSchema.index({ sessionId: 1 });

// Method to calculate distance between two points
locationTrackingSchema.statics.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

module.exports = mongoose.model('LocationTracking', locationTrackingSchema);