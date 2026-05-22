/**
 * GEOFENCE MODEL
 * Defines geographic boundaries for buildings and restricted areas
 */

const mongoose = require('mongoose');

const geofenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  type: { type: String, enum: ['building', 'site', 'restricted', 'safe_zone', 'parking'] },
  
  // Polygon coordinates for complex boundaries
  polygon: [{
    lat: Number,
    lng: Number
  }],
  
  // OR circular radius
  circle: {
    center: { lat: Number, lng: Number },
    radius: { type: Number, default: 0 } // meters
  },
  
  // Schedule when geofence is active
  schedule: {
    startTime: String, // HH:MM format
    endTime: String,
    daysOfWeek: [{ type: Number, min: 0, max: 6 }], // 0=Sunday
    timezone: { type: String, default: 'Asia/Dubai' }
  },
  
  // Alert Settings
  alerts: {
    onEntry: { type: Boolean, default: true },
    onExit: { type: Boolean, default: true },
    entryMessage: String,
    exitMessage: String,
    notifyRoles: [{ type: String }] // roles to notify
  },
  
  // Geofence Metadata
  description: String,
  radius: Number, // meters (for backward compatibility)
  color: { type: String, default: '#3B82F6' },
  isActive: { type: Boolean, default: true },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
geofenceSchema.index({ buildingId: 1, isActive: 1 });
geofenceSchema.index({ type: 1 });

// Method to check if a point is inside the geofence
geofenceSchema.methods.containsPoint = function(lat, lng) {
  // Check circle
  if (this.circle && this.circle.radius > 0) {
    const distance = this.calculateDistance(
      lat, lng,
      this.circle.center.lat, this.circle.center.lng
    );
    return distance <= this.circle.radius;
  }
  
  // Check polygon (Ray casting algorithm)
  if (this.polygon && this.polygon.length >= 3) {
    let inside = false;
    for (let i = 0, j = this.polygon.length - 1; i < this.polygon.length; j = i++) {
      const xi = this.polygon[i].lng, yi = this.polygon[i].lat;
      const xj = this.polygon[j].lng, yj = this.polygon[j].lat;
      
      const intersect = ((yi > lat) != (yj > lat)) &&
        (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
  
  return false;
};

// Helper method to calculate distance
geofenceSchema.methods.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
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

module.exports = mongoose.model('Geofence', geofenceSchema);