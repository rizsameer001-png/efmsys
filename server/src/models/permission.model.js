// server/src/models/permission.model.js
const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    module: {
      type: String,
      required: true,
      enum: [
        'users',
        'roles',
        'buildings',
        'complaints',
        'tasks',
        'attendance',
        'leaves',
        'payroll',
        'inventory',
        'reports',
        'settings',
        'notifications',
      ],
    },
    action: {
      type: String,
      required: true,
      enum: ['create', 'read', 'update', 'delete', 'approve', 'assign', 'export', 'import'],
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Predefined permissions
const defaultPermissions = [
  // User Management
  { name: 'user.create', module: 'users', action: 'create', description: 'Create new users' },
  { name: 'user.read', module: 'users', action: 'read', description: 'View users' },
  { name: 'user.update', module: 'users', action: 'update', description: 'Update users' },
  { name: 'user.delete', module: 'users', action: 'delete', description: 'Delete users' },
  { name: 'user.export', module: 'users', action: 'export', description: 'Export users' },
  { name: 'user.import', module: 'users', action: 'import', description: 'Import users' },

  // Role Management
  { name: 'role.create', module: 'roles', action: 'create', description: 'Create roles' },
  { name: 'role.read', module: 'roles', action: 'read', description: 'View roles' },
  { name: 'role.update', module: 'roles', action: 'update', description: 'Update roles' },
  { name: 'role.delete', module: 'roles', action: 'delete', description: 'Delete roles' },

  // Building Management
  { name: 'building.create', module: 'buildings', action: 'create', description: 'Create buildings' },
  { name: 'building.read', module: 'buildings', action: 'read', description: 'View buildings' },
  { name: 'building.update', module: 'buildings', action: 'update', description: 'Update buildings' },
  { name: 'building.delete', module: 'buildings', action: 'delete', description: 'Delete buildings' },

  // Complaint Management
  { name: 'complaint.create', module: 'complaints', action: 'create', description: 'Create complaints' },
  { name: 'complaint.read', module: 'complaints', action: 'read', description: 'View complaints' },
  { name: 'complaint.update', module: 'complaints', action: 'update', description: 'Update complaints' },
  { name: 'complaint.delete', module: 'complaints', action: 'delete', description: 'Delete complaints' },
  { name: 'complaint.assign', module: 'complaints', action: 'assign', description: 'Assign complaints' },

  // Task Management
  { name: 'task.create', module: 'tasks', action: 'create', description: 'Create tasks' },
  { name: 'task.read', module: 'tasks', action: 'read', description: 'View tasks' },
  { name: 'task.update', module: 'tasks', action: 'update', description: 'Update tasks' },
  { name: 'task.delete', module: 'tasks', action: 'delete', description: 'Delete tasks' },
  { name: 'task.assign', module: 'tasks', action: 'assign', description: 'Assign tasks' },
  { name: 'task.approve', module: 'tasks', action: 'approve', description: 'Approve tasks' },

  // Attendance Management
  { name: 'attendance.read', module: 'attendance', action: 'read', description: 'View attendance' },
  { name: 'attendance.approve', module: 'attendance', action: 'approve', description: 'Approve attendance' },

  // Leave Management
  { name: 'leave.create', module: 'leaves', action: 'create', description: 'Apply leave' },
  { name: 'leave.read', module: 'leaves', action: 'read', description: 'View leaves' },
  { name: 'leave.approve', module: 'leaves', action: 'approve', description: 'Approve leaves' },

  // Payroll Management
  { name: 'payroll.read', module: 'payroll', action: 'read', description: 'View payroll' },
  { name: 'payroll.create', module: 'payroll', action: 'create', description: 'Process payroll' },
  { name: 'payroll.approve', module: 'payroll', action: 'approve', description: 'Approve payroll' },
  { name: 'payroll.export', module: 'payroll', action: 'export', description: 'Export payroll' },

  // Report Management
  { name: 'report.read', module: 'reports', action: 'read', description: 'View reports' },
  { name: 'report.export', module: 'reports', action: 'export', description: 'Export reports' },

  // Settings
  { name: 'settings.read', module: 'settings', action: 'read', description: 'View settings' },
  { name: 'settings.update', module: 'settings', action: 'update', description: 'Update settings' },

  // Notifications
  { name: 'notification.send', module: 'notifications', action: 'create', description: 'Send notifications' },
  { name: 'notification.read', module: 'notifications', action: 'read', description: 'View notifications' },
];

module.exports = mongoose.model('Permission', permissionSchema);
module.exports.defaultPermissions = defaultPermissions;