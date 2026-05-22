/**
 * TASK ASSIGNMENT SERVICE
 * Handles auto-assignment, skill matching, and workload balancing
 */

const User = require('../models/User.model');
const Task = require('../models/Task.model');
const TaskAssignment = require('../models/task-assignment.model');

class TaskAssignmentService {
  
  /**
   * AUTO-ASSIGN TASK - Finds the best technician based on multiple factors
   * Factors: Skills, Current workload, Proximity to location, Shift timing, Performance rating
   */
  async autoAssignTask(taskId) {
    const task = await Task.findById(taskId).populate('location.buildingId');
    
    if (!task) throw new Error('Task not found');
    
    // Find all available technicians
    const technicians = await User.find({
      role: 'technician',
      status: 'active',
      'shiftTiming.isActive': true
    });
    
    // Score each technician
    const scoredTechnicians = await Promise.all(
      technicians.map(async tech => ({
        technician: tech,
        score: await this.calculateTechnicianScore(tech, task)
      }))
    );
    
    // Sort by score and get top candidate
    scoredTechnicians.sort((a, b) => b.score - a.score);
    
    if (scoredTechnicians.length === 0 || scoredTechnicians[0].score < 30) {
      // No suitable technician found - escalate
      await this.escalateUnassignedTask(task);
      return null;
    }
    
    const bestTechnician = scoredTechnicians[0].technician;
    
    // Assign the task
    return await this.assignTaskToTechnician(task, bestTechnician, 'auto');
  }
  
  /**
   * Calculate technician score based on multiple criteria
   */
  async calculateTechnicianScore(technician, task) {
    let score = 0;
    
    // 1. Skill Match (40% weight)
    const skillMatch = await this.calculateSkillMatch(technician, task);
    score += skillMatch * 40;
    
    // 2. Workload Balance (25% weight)
    const workloadScore = await this.calculateWorkloadScore(technician);
    score += workloadScore * 25;
    
    // 3. Proximity to Task Location (20% weight)
    const proximityScore = await this.calculateProximityScore(technician, task);
    score += proximityScore * 20;
    
    // 4. Performance Rating (15% weight)
    const performanceScore = technician.performanceRating / 5;
    score += performanceScore * 15;
    
    return Math.min(100, score);
  }
  
  /**
   * Calculate skill match between technician and task requirements
   */
  async calculateSkillMatch(technician, task) {
    if (!task.requiredSkills || task.requiredSkills.length === 0) {
      return 1; // No skill requirements = perfect match
    }
    
    const technicianSkills = technician.skills || [];
    let matchCount = 0;
    
    for (const required of task.requiredSkills) {
      const techSkill = technicianSkills.find(s => s.name === required.skill);
      if (techSkill && techSkill.proficiency >= required.proficiencyLevel) {
        matchCount++;
      }
    }
    
    return matchCount / task.requiredSkills.length;
  }
  
  /**
   * Calculate workload score based on current active tasks
   */
  async calculateWorkloadScore(technician) {
    const activeTasks = await Task.countDocuments({
      'assignment.assignedTo': technician._id,
      status: { $in: ['assigned', 'accepted', 'in_progress'] }
    });
    
    const maxTasks = 5; // Maximum tasks per technician
    const score = Math.max(0, 1 - (activeTasks / maxTasks));
    return score;
  }
  
  /**
   * Calculate proximity score based on distance to task location
   */
  async calculateProximityScore(technician, task) {
    if (!technician.currentLocation || !task.location.coordinates) {
      return 0.5; // Default middle score if location unknown
    }
    
    const distance = this.calculateDistance(
      technician.currentLocation.lat,
      technician.currentLocation.lng,
      task.location.coordinates.lat,
      task.location.coordinates.lng
    );
    
    // Distance in meters -> score
    // 0m = 1.0, 5km = 0, linearly decreasing
    return Math.max(0, 1 - (distance / 5000));
  }
  
  /**
   * Assign task to technician
   */
  async assignTaskToTechnician(task, technician, method = 'auto') {
    // Update task assignment
    task.assignment.assignedTo = technician._id;
    task.assignment.assignedToName = `${technician.firstName} ${technician.lastName}`;
    task.assignment.assignedBy = task.createdBy;
    task.assignment.assignedAt = new Date();
    task.status = 'assigned';
    await task.save();
    
    // Create assignment record
    const assignment = new TaskAssignment({
      taskId: task._id,
      currentAssignee: technician._id,
      currentAssigneeName: `${technician.firstName} ${technician.lastName}`,
      assignedAt: new Date(),
      assignmentMethod: method,
      assignments: [{
        technicianId: technician._id,
        technicianName: `${technician.firstName} ${technician.lastName}`,
        assignedBy: task.createdBy,
        assignedAt: new Date(),
        type: method,
        status: 'pending'
      }]
    });
    await assignment.save();
    
    // Send notification
    await this.sendAssignmentNotification(task, technician);
    
    return { task, assignment };
  }
  
  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
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
  }
  
  /**
   * Manual assignment by manager/supervisor
   */
  async manualAssignTask(taskId, technicianId, assignedBy) {
    const task = await Task.findById(taskId);
    const technician = await User.findById(technicianId);
    
    if (!task || !technician) {
      throw new Error('Task or technician not found');
    }
    
    return await this.assignTaskToTechnician(task, technician, 'manual');
  }
  
  /**
   * Reassign task to another technician
   */
  async reassignTask(taskId, newTechnicianId, reason, reassignedBy) {
    const task = await Task.findById(taskId);
    const newTechnician = await User.findById(newTechnicianId);
    
    if (!task || !newTechnician) {
      throw new Error('Task or technician not found');
    }
    
    // Update assignment
    task.assignment.reassignmentCount += 1;
    task.assignment.reassignmentReason = reason;
    task.status = 'assigned';
    await task.save();
    
    // Create new assignment record
    const assignment = await TaskAssignment.findOne({ taskId });
    assignment.assignments.push({
      technicianId: newTechnician._id,
      technicianName: `${newTechnician.firstName} ${newTechnician.lastName}`,
      assignedBy: reassignedBy,
      assignedAt: new Date(),
      type: 'reassignment',
      reason: reason,
      status: 'pending'
    });
    assignment.currentAssignee = newTechnician._id;
    assignment.currentAssigneeName = `${newTechnician.firstName} ${newTechnician.lastName}`;
    await assignment.save();
    
    // Notify technician
    await this.sendReassignmentNotification(task, newTechnician, reason);
    
    return { task, assignment };
  }
  
  /**
   * Escalate unassigned task to manager
   */
  async escalateUnassignedTask(task) {
    task.escalationLevel = 1;
    task.escalationReason = 'No suitable technician found';
    await task.save();
    
    // Notify managers
    const managers = await User.find({ role: 'manager', status: 'active' });
    for (const manager of managers) {
      await this.sendEscalationNotification(task, manager);
    }
  }
  
  /**
   * Send assignment notification
   */
  async sendAssignmentNotification(task, technician) {
    // Implementation for push/email/sms notification
    console.log(`Task ${task.taskId} assigned to ${technician.email}`);
  }
  
  /**
   * Send reassignment notification
   */
  async sendReassignmentNotification(task, technician, reason) {
    console.log(`Task ${task.taskId} reassigned to ${technician.email}. Reason: ${reason}`);
  }
  
  /**
   * Send escalation notification
   */
  async sendEscalationNotification(task, manager) {
    console.log(`Task ${task.taskId} escalated to ${manager.email}`);
  }
}

module.exports = new TaskAssignmentService();