// // server/src/models/role.model.js
// const mongoose = require('mongoose');
// const { ROLES } = require('../config/constants');

// const roleSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//       enum: Object.values(ROLES),
//     },
//     displayName: {
//       type: String,
//       required: true,
//     },
//     description: String,
//     permissions: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Permission',
//       },
//     ],
//     isSystemRole: {
//       type: Boolean,
//       default: false,
//     },
//     level: {
//       type: Number,
//       default: 0,
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Predefined roles with default permissions
// const defaultRoles = [
//   {
//     name: ROLES.SUPER_ADMIN,
//     displayName: 'Super Administrator',
//     description: 'Full system access',
//     level: 100,
//     isSystemRole: true,
//   },
//   {
//     name: ROLES.ADMIN,
//     displayName: 'Administrator',
//     description: 'Operational management access',
//     level: 90,
//     isSystemRole: true,
//   },
//   {
//     name: ROLES.HR,
//     displayName: 'HR Manager',
//     description: 'Employee and payroll management',
//     level: 85,
//     isSystemRole: true,
//   },
//   {
//     name: ROLES.MANAGER,
//     displayName: 'Manager',
//     description: 'Team and building management',
//     level: 80,
//     isSystemRole: true,
//   },
//   {
//     name: ROLES.SUPERVISOR,
//     displayName: 'Supervisor',
//     description: 'Field operations supervision',
//     level: 70,
//     isSystemRole: true,
//   },
//   {
//     name: ROLES.TECHNICIAN,
//     displayName: 'Technician',
//     description: 'Task execution',
//     level: 50,
//     isSystemRole: true,
//   },
//   {
//     name: ROLES.ACCOUNTANT,
//     displayName: 'Accountant',
//     description: 'Billing and finance',
//     level: 85,
//     isSystemRole: true,
//   },
//   {
//     name: ROLES.CUSTOMER,
//     displayName: 'Customer',
//     description: 'Resident/Owner portal access',
//     level: 10,
//     isSystemRole: true,
//   },
// ];

// module.exports = mongoose.model('Role', roleSchema);
// module.exports.defaultRoles = defaultRoles;


/**
 * ROLE MODEL
 * Handles role definitions and permissions
 * Features: Role hierarchy, Permissions management, Default system roles
 */

const mongoose = require('mongoose');
const { ROLES } = require('../config/constants');

// ============================================================================
// PERMISSION SCHEMA (Embedded for better performance)
// ============================================================================

const permissionSchema = new mongoose.Schema({
  module: {
    type: String,
    required: true,
    enum: ['user', 'role', 'building', 'task', 'complaint', 'attendance', 'salary', 'report', 'system', 'dashboard'],
  },
  action: {
    type: String,
    required: true,
    enum: ['view', 'create', 'edit', 'delete', 'assign', 'approve', 'export', 'import', 'manage'],
  },
  resource: {
    type: String,
  },
  description: String,
}, { _id: false });

// ============================================================================
// ROLE SCHEMA
// ============================================================================

const roleSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(ROLES),
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    
    // Permissions - Can be either string array or ObjectId references
    permissions: [{
      type: String,  // Changed from ObjectId to String for simplicity
    }],
    // Alternative: If using separate Permission model, uncomment below:
    // permissionIds: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Permission',
    // }],
    
    // Role Hierarchy
    level: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    parentRole: {
      type: String,
      enum: Object.values(ROLES),
      default: null,
    },
    
    // System Role Flag (cannot be deleted/modified)
    isSystemRole: {
      type: Boolean,
      default: false,
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Audit Fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    
    // Metadata
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================================================
// INDEXES
// ============================================================================

roleSchema.index({ name: 1 });
roleSchema.index({ level: -1 });
roleSchema.index({ isActive: 1 });
roleSchema.index({ isSystemRole: 1 });

// ============================================================================
// VIRTUAL PROPERTIES
// ============================================================================

// Get user count for this role
roleSchema.virtual('userCount', {
  ref: 'User',
  localField: 'name',
  foreignField: 'role',
  count: true,
});

// Get inherited permissions from parent role
roleSchema.virtual('inheritedPermissions').get(function() {
  if (!this.parentRole) return [];
  // This would need to fetch parent role's permissions
  return [];
});

// Check if role can manage another role (based on level)
roleSchema.virtual('canManage').get(function() {
  return function(targetRoleLevel) {
    return this.level > targetRoleLevel;
  };
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Check if role has a specific permission
 * @param {string} permission - Permission to check (format: "module.action")
 * @returns {boolean}
 */
roleSchema.methods.hasPermission = function(permission) {
  if (this.name === ROLES.SUPER_ADMIN) return true;
  return this.permissions.includes(permission);
};

/**
 * Check if role has any of the given permissions
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean}
 */
roleSchema.methods.hasAnyPermission = function(permissions) {
  if (this.name === ROLES.SUPER_ADMIN) return true;
  return permissions.some(permission => this.permissions.includes(permission));
};

/**
 * Check if role has all of the given permissions
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean}
 */
roleSchema.methods.hasAllPermissions = function(permissions) {
  if (this.name === ROLES.SUPER_ADMIN) return true;
  return permissions.every(permission => this.permissions.includes(permission));
};

/**
 * Add permission to role
 * @param {string} permission - Permission to add
 */
roleSchema.methods.addPermission = function(permission) {
  if (!this.permissions.includes(permission)) {
    this.permissions.push(permission);
  }
  return this;
};

/**
 * Remove permission from role
 * @param {string} permission - Permission to remove
 */
roleSchema.methods.removePermission = function(permission) {
  this.permissions = this.permissions.filter(p => p !== permission);
  return this;
};

/**
 * Get permissions grouped by module
 */
roleSchema.methods.getGroupedPermissions = function() {
  const grouped = {};
  this.permissions.forEach(permission => {
    const [module, action] = permission.split('.');
    if (!grouped[module]) grouped[module] = [];
    grouped[module].push(action);
  });
  return grouped;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Get all active roles
 */
roleSchema.statics.getActiveRoles = function() {
  return this.find({ isActive: true }).sort('level');
};

/**
 * Get role by name
 * @param {string} name - Role name
 */
roleSchema.statics.getRoleByName = function(name) {
  return this.findOne({ name });
};

/**
 * Get roles above a certain level
 * @param {number} level - Minimum level
 */
roleSchema.statics.getRolesAboveLevel = function(level) {
  return this.find({ level: { $gt: level }, isActive: true }).sort('level');
};

/**
 * Get roles below a certain level
 * @param {number} level - Maximum level
 */
roleSchema.statics.getRolesBelowLevel = function(level) {
  return this.find({ level: { $lt: level }, isActive: true }).sort('-level');
};

/**
 * Initialize default roles in database
 */
roleSchema.statics.initDefaultRoles = async function() {
  const defaultRoles = [
    {
      name: ROLES.SUPER_ADMIN,
      displayName: 'Super Administrator',
      description: 'Full system access with all permissions',
      level: 100,
      isSystemRole: true,
      permissions: ['*'], // All permissions
    },
    {
      name: ROLES.ADMIN,
      displayName: 'Administrator',
      description: 'Operational management access',
      level: 90,
      isSystemRole: true,
      permissions: [
        'user.view', 'user.create', 'user.edit', 'user.delete',
        'role.view', 'role.assign',
        'building.view', 'building.create', 'building.edit',
        'task.view', 'task.create', 'task.assign',
        'complaint.view', 'complaint.assign',
        'attendance.view', 'attendance.approve',
        'report.view', 'report.export',
        'system.settings', 'system.logs'
      ],
    },
    {
      name: ROLES.HR,
      displayName: 'HR Manager',
      description: 'Employee and payroll management',
      level: 85,
      isSystemRole: true,
      permissions: [
        'user.view', 'user.create', 'user.edit',
        'attendance.view', 'attendance.approve', 'attendance.export',
        'salary.view', 'salary.generate', 'salary.approve',
        'report.view', 'report.export'
      ],
    },
    {
      name: ROLES.MANAGER,
      displayName: 'Manager',
      description: 'Team and building management',
      level: 80,
      isSystemRole: true,
      permissions: [
        'user.view',
        'building.view', 'building.edit',
        'task.view', 'task.create', 'task.assign',
        'complaint.view', 'complaint.assign',
        'attendance.view', 'attendance.approve',
        'report.view'
      ],
    },
    {
      name: ROLES.SUPERVISOR,
      displayName: 'Supervisor',
      description: 'Field operations supervision',
      level: 70,
      isSystemRole: true,
      permissions: [
        'user.view',
        'task.view', 'task.assign', 'task.verify',
        'complaint.view', 'complaint.assign',
        'attendance.view',
        'report.view'
      ],
    },
    {
      name: ROLES.TECHNICIAN,
      displayName: 'Technician',
      description: 'Task execution',
      level: 50,
      isSystemRole: true,
      permissions: [
        'task.view', 'task.update', 'task.complete',
        'attendance.mark', 'attendance.view'
      ],
    },
    {
      name: ROLES.ACCOUNTANT,
      displayName: 'Accountant',
      description: 'Billing and finance',
      level: 85,
      isSystemRole: true,
      permissions: [
        'invoice.view', 'invoice.create', 'invoice.edit',
        'payment.view', 'payment.process',
        'report.view', 'report.export'
      ],
    },
    {
      name: ROLES.CUSTOMER,
      displayName: 'Customer',
      description: 'Resident/Owner portal access',
      level: 10,
      isSystemRole: true,
      permissions: [
        'complaint.create', 'complaint.view',
        'invoice.view',
        'payment.make'
      ],
    },
  ];
  
  let createdCount = 0;
  let updatedCount = 0;
  
  for (const roleData of defaultRoles) {
    try {
      const existingRole = await this.findOne({ name: roleData.name });
      
      if (!existingRole) {
        await this.create(roleData);
        createdCount++;
        console.log(`✅ Created default role: ${roleData.displayName}`);
      } else {
        // Update existing role if needed (preserve custom permissions)
        let needsUpdate = false;
        if (existingRole.level !== roleData.level) {
          existingRole.level = roleData.level;
          needsUpdate = true;
        }
        if (existingRole.description !== roleData.description) {
          existingRole.description = roleData.description;
          needsUpdate = true;
        }
        if (needsUpdate) {
          await existingRole.save();
          updatedCount++;
          console.log(`🔄 Updated default role: ${roleData.displayName}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error creating role ${roleData.name}:`, error.message);
    }
  }
  
  console.log(`📊 Role initialization complete: ${createdCount} created, ${updatedCount} updated`);
  return { createdCount, updatedCount };
};

// ============================================================================
// PRE-SAVE MIDDLEWARE
// ============================================================================

// Ensure super_admin has all permissions
roleSchema.pre('save', function(next) {
  if (this.name === ROLES.SUPER_ADMIN) {
    this.permissions = ['*'];
    this.level = 100;
  }
  next();
});

// Validate level is within range
roleSchema.pre('save', function(next) {
  if (this.level < 0 || this.level > 100) {
    next(new Error('Role level must be between 0 and 100'));
  }
  next();
});

// ============================================================================
// POST-INIT MIDDLEWARE
// ============================================================================

roleSchema.post('init', function(doc) {
  // Ensure permissions array exists
  if (!doc.permissions) doc.permissions = [];
});

// ============================================================================
// EXPORT
// ============================================================================

// Predefined default roles data
const defaultRolesData = [
  {
    name: ROLES.SUPER_ADMIN,
    displayName: 'Super Administrator',
    description: 'Full system access',
    level: 100,
    isSystemRole: true,
  },
  {
    name: ROLES.ADMIN,
    displayName: 'Administrator',
    description: 'Operational management access',
    level: 90,
    isSystemRole: true,
  },
  {
    name: ROLES.HR,
    displayName: 'HR Manager',
    description: 'Employee and payroll management',
    level: 85,
    isSystemRole: true,
  },
  {
    name: ROLES.MANAGER,
    displayName: 'Manager',
    description: 'Team and building management',
    level: 80,
    isSystemRole: true,
  },
  {
    name: ROLES.SUPERVISOR,
    displayName: 'Supervisor',
    description: 'Field operations supervision',
    level: 70,
    isSystemRole: true,
  },
  {
    name: ROLES.TECHNICIAN,
    displayName: 'Technician',
    description: 'Task execution',
    level: 50,
    isSystemRole: true,
  },
  {
    name: ROLES.ACCOUNTANT,
    displayName: 'Accountant',
    description: 'Billing and finance',
    level: 85,
    isSystemRole: true,
  },
  {
    name: ROLES.CUSTOMER,
    displayName: 'Customer',
    description: 'Resident/Owner portal access',
    level: 10,
    isSystemRole: true,
  },
];

// Create and export model safely (prevent overwrite error)
const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);

module.exports = Role;
module.exports.defaultRoles = defaultRolesData;
module.exports.ROLES = ROLES;


// const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);
// module.exports = Role;