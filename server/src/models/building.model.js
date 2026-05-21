// server/src/models/building.model.js
const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { 
    type: String, 
    enum: ['residential', 'commercial', 'office', 'mall', 'hospital', 'hotel', 'industrial', 'mixed_use'],
    required: true 
  },
  
  // Location
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    country: { type: String, required: true, default: 'UAE' },
    zipCode: String,
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  
  // Contact Information
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  
  emergencyContacts: [{
    name: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    isPrimary: { type: Boolean, default: false }
  }],
  
  managementContact: {
    name: String,
    phone: String,
    email: String,
    position: String
  },
  
  // Building Statistics
  statistics: {
    totalFloors: { type: Number, default: 0 },
    totalUnits: { type: Number, default: 0 },
    occupiedUnits: { type: Number, default: 0 },
    vacantUnits: { type: Number, default: 0 },
    underMaintenance: { type: Number, default: 0 }
  },
  
  // Amenities
  amenities: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['recreation', 'fitness', 'utility', 'security', 'parking'] },
    location: String,
    capacity: Number,
    operatingHours: {
      start: String,
      end: String
    },
    isAvailable: { type: Boolean, default: true }
  }],
  
  // Parking
  parking: {
    totalSlots: { type: Number, default: 0 },
    occupiedSlots: { type: Number, default: 0 },
    visitorSlots: { type: Number, default: 0 },
    evChargingSlots: { type: Number, default: 0 },
    floors: [{
      floor: Number,
      slots: Number,
      type: { type: String, enum: ['covered', 'open', 'basement'] }
    }]
  },
  
  // Images
  images: [{
    url: String,
    type: { type: String, enum: ['exterior', 'interior', 'lobby', 'parking', 'other'] },
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Documents
  documents: [{
    name: String,
    type: { type: String, enum: ['blueprint', 'permit', 'insurance', 'contract', 'other'] },
    url: String,
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Metadata
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'maintenance', 'under_construction'],
    default: 'active' 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for units
buildingSchema.virtual('units', {
  ref: 'Unit',
  localField: '_id',
  foreignField: 'buildingId',
  justOne: false
});

// Indexes
buildingSchema.index({ code: 1 }, { unique: true });
buildingSchema.index({ name: 1 });
buildingSchema.index({ type: 1 });
buildingSchema.index({ status: 1 });
buildingSchema.index({ 'address.city': 1, 'address.country': 1 });

//module.exports = mongoose.model('Building', buildingSchema);

const Building = mongoose.models.Building || mongoose.model('Building', buildingSchema);
module.exports = Building;