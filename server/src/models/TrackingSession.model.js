// server/src/models/TrackingSession.model.js
const mongoose = require('mongoose');

const trackingSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  startLocation: {
    lat: Number,
    lng: Number,
    address: String
  },
  endLocation: {
    lat: Number,
    lng: Number,
    address: String
  },
  locations: [{
    lat: Number,
    lng: Number,
    timestamp: Date,
    accuracy: Number,
    heading: Number,
    speed: Number,
    address: String
  }],
  status: {
    type: String,
    enum: ['active', 'ended', 'paused'],
    default: 'active',
    index: true
  },
  totalDistance: {
    type: Number,
    default: 0
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes
trackingSessionSchema.index({ userId: 1, status: 1 });
trackingSessionSchema.index({ startTime: -1 });

module.exports = mongoose.model('TrackingSession', trackingSessionSchema);