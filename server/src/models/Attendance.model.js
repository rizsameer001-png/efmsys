// server/src/models/Attendance.model.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, index: true },
  
  // Check In Details
  checkIn: {
    time: { type: Date },
    gpsLocation: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String }
    },
    method: { type: String, enum: ['gps', 'qr', 'face', 'manual'], default: 'gps' },
    image: { type: String },
    ipAddress: { type: String },
    deviceInfo: { type: String }
  },
  
  // Check Out Details
  checkOut: {
    time: { type: Date },
    gpsLocation: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String }
    },
    method: { type: String, enum: ['gps', 'qr', 'face', 'manual'], default: 'gps' },
    image: { type: String }
  },
  
  // Calculations
  totalHours: { type: Number, default: 0 },
  overtimeHours: { type: Number, default: 0 },
  lateMinutes: { type: Number, default: 0 },
  earlyExitMinutes: { type: Number, default: 0 },
  
  // Status
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late', 'half_day', 'holiday', 'leave', 'week_off'],
    default: 'absent'
  },
  
  // Approval
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  notes: { type: String },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1, status: 1 });
attendanceSchema.index({ 'checkIn.time': 1 });

// Virtual for day name
attendanceSchema.virtual('dayName').get(function() {
  return this.date ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][this.date.getDay()] : '';
});

// Pre-save middleware
attendanceSchema.pre('save', function(next) {
  // Calculate total hours
  if (this.checkIn.time && this.checkOut.time) {
    const hours = (this.checkOut.time - this.checkIn.time) / (1000 * 60 * 60);
    this.totalHours = Math.round(hours * 10) / 10;
    
    // Calculate overtime (over 8 hours)
    if (this.totalHours > 8) {
      this.overtimeHours = Math.round((this.totalHours - 8) * 10) / 10;
    }
  }
  next();
});

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;