/**
 * TASK PROGRESS MODEL
 * Tracks detailed progress updates and time entries for tasks
 */

const mongoose = require('mongoose');

const taskProgressSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Progress Updates
  updates: [{
    type: { type: String, enum: ['start', 'pause', 'resume', 'complete', 'note', 'checklist'] },
    description: String,
    progressPercentage: Number,
    timestamp: { type: Date, default: Date.now },
    location: {
      lat: Number,
      lng: Number,
      address: String
    }
  }],
  
  // Time Entries
  timeEntries: [{
    activity: String,
    startTime: Date,
    endTime: Date,
    duration: Number, // minutes
    category: { type: String, enum: ['work', 'travel', 'break', 'waiting'] }
  }],
  
  // Daily Summary
  dailySummary: [{
    date: Date,
    totalMinutes: Number,
    workMinutes: Number,
    travelMinutes: Number,
    breakMinutes: Number,
    waitingMinutes: Number,
    tasksCompleted: Number,
    notes: String
  }],
  
  // Current Session
  currentSession: {
    isActive: { type: Boolean, default: false },
    startedAt: Date,
    pausedAt: Date,
    totalPausedMinutes: { type: Number, default: 0 }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

taskProgressSchema.index({ taskId: 1, technicianId: 1 });
taskProgressSchema.index({ 'dailySummary.date': -1 });

module.exports = mongoose.model('TaskProgress', taskProgressSchema);