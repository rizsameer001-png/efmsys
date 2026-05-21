// server/src/models/VisitorPass.model.js
const mongoose = require('mongoose');

const visitorPassSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visitorName: {
    type: String,
    required: true,
    trim: true
  },
  visitorPhone: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['delivery', 'guest', 'maintenance', 'other'],
    required: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  visitTime: {
    type: String,
    default: null
  },
  vehicleNumber: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  qrCode: {
    type: String,
    default: null
  },
  checkIn: {
    time: Date,
    checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: String,
    photo: String
  },
  checkOut: {
    time: Date,
    checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: String
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: Date,
  rejectionReason: String,
  adminRemarks: String,
  requestedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes
visitorPassSchema.index({ userId: 1, status: 1 });
visitorPassSchema.index({ visitDate: 1 });
visitorPassSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('VisitorPass', visitorPassSchema);