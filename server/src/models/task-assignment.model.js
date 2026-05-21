/**
 * TASK ASSIGNMENT MODEL
 * Tracks assignment history, skill matching, and workload balancing
 */

const mongoose = require('mongoose');

const taskAssignmentSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  
  // Assignment History
  assignments: [{
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    technicianName: String,
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedAt: { type: Date, default: Date.now },
    type: { type: String, enum: ['auto', 'manual', 'reassignment'] },
    reason: String,
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'] }
  }],
  
  // Current Assignment
  currentAssignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  currentAssigneeName: String,
  assignedAt: Date,
  
  // Skill Matching
  skillMatchScore: { type: Number, min: 0, max: 100 },
  matchedSkills: [String],
  missingSkills: [String],
  
  // Workload Balancing
  technicianWorkload: {
    activeTasks: Number,
    pendingTasks: Number,
    completedToday: Number,
    capacityPercentage: Number
  },
  
  // Assignment Rules
  assignmentMethod: { type: String, enum: ['auto', 'manual', 'round_robin', 'skill_based'] },
  priorityScore: Number,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

taskAssignmentSchema.index({ taskId: 1 });
taskAssignmentSchema.index({ currentAssignee: 1 });
taskAssignmentSchema.index({ assignedAt: -1 });

module.exports = mongoose.model('TaskAssignment', taskAssignmentSchema);