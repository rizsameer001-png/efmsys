// server/src/controllers/role.controller.js
// Get all roles
// exports.getRoles = async (req, res) => {
//   try {
//     res.json({ success: true, data: [] });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get role by ID
// exports.getRoleById = async (req, res) => {
//   try {
//     res.json({ success: true, data: null });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Create role
// exports.createRole = async (req, res) => {
//   try {
//     res.status(201).json({ success: true, message: 'Role created' });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Update role
// exports.updateRole = async (req, res) => {
//   try {
//     res.json({ success: true, message: 'Role updated' });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Delete role
// exports.deleteRole = async (req, res) => {
//   try {
//     res.json({ success: true, message: 'Role deleted' });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get permissions
// exports.getPermissions = async (req, res) => {
//   try {
//     res.json({ success: true, data: { permissions: [], groupedPermissions: {} } });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Assign role to user
// exports.assignRoleToUser = async (req, res) => {
//   try {
//     res.json({ success: true, message: 'Role assigned' });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };


/**
 * ROLE CONTROLLER
 * Handles all role-related operations
 * Features: CRUD operations, Permissions management, Role assignment
 */

const Role = require('../models/Role.model');
const User = require('../models/User.model');
const ActivityLog = require('../models/ActivityLog.model');

// ============================================================================
// ROLE CRUD OPERATIONS
// ============================================================================

/**
 * @desc    Get all roles with pagination and filters
 * @route   GET /api/roles
 * @access  Private/Super Admin
 */
const getRoles = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isActive } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const skip = (page - 1) * limit;
    
    const [roles, total] = await Promise.all([
      Role.find(query)
        .sort('displayName')
        .skip(skip)
        .limit(parseInt(limit)),
      Role.countDocuments(query)
    ]);
    
    // Get user count for each role
    const rolesWithCount = await Promise.all(roles.map(async (role) => {
      const userCount = await User.countDocuments({ role: role.name });
      return {
        ...role.toObject(),
        userCount
      };
    }));
    
    res.json({
      success: true,
      data: rolesWithCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get single role by ID
 * @route   GET /api/roles/:id
 * @access  Private/Super Admin
 */
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({ success: false, error: 'Role not found' });
    }
    
    const userCount = await User.countDocuments({ role: role.name });
    
    res.json({
      success: true,
      data: {
        ...role.toObject(),
        userCount
      }
    });
  } catch (error) {
    console.error('Get role by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Create a new role
 * @route   POST /api/roles
 * @access  Private/Super Admin
 */
const createRole = async (req, res) => {
  try {
    const { name, displayName, description, permissions, isActive } = req.body;
    
    // Validate required fields
    if (!name || !displayName) {
      return res.status(400).json({
        success: false,
        error: 'Role name and display name are required'
      });
    }
    
    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        error: 'Role already exists'
      });
    }
    
    // Create new role
    const role = await Role.create({
      name,
      displayName,
      description: description || '',
      permissions: permissions || [],
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id
    });
    
    // Log activity
    await ActivityLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'CREATE_ROLE',
      entityType: 'role',
      entityId: role._id,
      newData: { name, displayName, permissions: permissions?.length || 0 },
      ipAddress: req.ip
    });
    
    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role
    });
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update an existing role
 * @route   PUT /api/roles/:id
 * @access  Private/Super Admin
 */
const updateRole = async (req, res) => {
  try {
    const { displayName, description, permissions, isActive } = req.body;
    
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({ success: false, error: 'Role not found' });
    }
    
    // Prevent modification of super_admin role
    if (role.name === 'super_admin') {
      return res.status(400).json({
        success: false,
        error: 'Cannot modify super admin role'
      });
    }
    
    // Update fields
    if (displayName) role.displayName = displayName;
    if (description !== undefined) role.description = description;
    if (permissions !== undefined) role.permissions = permissions;
    if (isActive !== undefined) role.isActive = isActive;
    role.updatedBy = req.user._id;
    
    await role.save();
    
    // Log activity
    await ActivityLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'UPDATE_ROLE',
      entityType: 'role',
      entityId: role._id,
      newData: { displayName, permissions: permissions?.length || 0, isActive },
      ipAddress: req.ip
    });
    
    res.json({
      success: true,
      message: 'Role updated successfully',
      data: role
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete a role (soft delete)
 * @route   DELETE /api/roles/:id
 * @access  Private/Super Admin
 */
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({ success: false, error: 'Role not found' });
    }
    
    // Prevent deletion of super_admin role
    if (role.name === 'super_admin') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete super admin role'
      });
    }
    
    // Check if any users have this role
    const userCount = await User.countDocuments({ role: role.name });
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete role. ${userCount} user(s) currently have this role.`
      });
    }
    
    // Soft delete (mark as inactive) or hard delete
    // Using hard delete for now
    await role.deleteOne();
    
    // Log activity
    await ActivityLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'DELETE_ROLE',
      entityType: 'role',
      entityId: role._id,
      oldData: { name: role.name, displayName: role.displayName },
      ipAddress: req.ip
    });
    
    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================================================
// PERMISSIONS MANAGEMENT
// ============================================================================

/**
 * @desc    Get all available permissions grouped by module
 * @route   GET /api/roles/permissions
 * @access  Private/Super Admin
 */
const getPermissions = async (req, res) => {
  try {
    // Define all available permissions
    const permissions = {
      user: [
        { value: 'users.view', label: 'View Users', description: 'View list of users' },
        { value: 'users.create', label: 'Create Users', description: 'Add new users to system' },
        { value: 'users.edit', label: 'Edit Users', description: 'Modify user details' },
        { value: 'users.delete', label: 'Delete Users', description: 'Remove users from system' },
        { value: 'users.export', label: 'Export Users', description: 'Export user data' },
        { value: 'users.import', label: 'Import Users', description: 'Bulk import users' }
      ],
      role: [
        { value: 'roles.view', label: 'View Roles', description: 'View role list' },
        { value: 'roles.create', label: 'Create Roles', description: 'Add new roles' },
        { value: 'roles.edit', label: 'Edit Roles', description: 'Modify role permissions' },
        { value: 'roles.delete', label: 'Delete Roles', description: 'Remove roles' },
        { value: 'roles.assign', label: 'Assign Roles', description: 'Assign roles to users' }
      ],
      building: [
        { value: 'buildings.view', label: 'View Buildings', description: 'View building list' },
        { value: 'buildings.create', label: 'Create Buildings', description: 'Add new buildings' },
        { value: 'buildings.edit', label: 'Edit Buildings', description: 'Modify building details' },
        { value: 'buildings.delete', label: 'Delete Buildings', description: 'Remove buildings' }
      ],
      task: [
        { value: 'tasks.view', label: 'View Tasks', description: 'View task list' },
        { value: 'tasks.create', label: 'Create Tasks', description: 'Create new tasks' },
        { value: 'tasks.assign', label: 'Assign Tasks', description: 'Assign tasks to technicians' },
        { value: 'tasks.update', label: 'Update Tasks', description: 'Update task details' },
        { value: 'tasks.complete', label: 'Complete Tasks', description: 'Mark tasks as completed' },
        { value: 'tasks.verify', label: 'Verify Tasks', description: 'Verify completed tasks' }
      ],
      complaint: [
        { value: 'complaints.view', label: 'View Complaints', description: 'View complaint list' },
        { value: 'complaints.create', label: 'Create Complaints', description: 'Create new complaints' },
        { value: 'complaints.assign', label: 'Assign Complaints', description: 'Assign complaints to staff' },
        { value: 'complaints.resolve', label: 'Resolve Complaints', description: 'Mark complaints as resolved' }
      ],
      attendance: [
        { value: 'attendance.view', label: 'View Attendance', description: 'View attendance records' },
        { value: 'attendance.mark', label: 'Mark Attendance', description: 'Mark own attendance' },
        { value: 'attendance.approve', label: 'Approve Attendance', description: 'Approve team attendance' },
        { value: 'attendance.export', label: 'Export Attendance', description: 'Export attendance reports' }
      ],
      salary: [
        { value: 'salary.view', label: 'View Salary', description: 'View salary records' },
        { value: 'salary.generate', label: 'Generate Salary', description: 'Generate monthly salary' },
        { value: 'salary.approve', label: 'Approve Salary', description: 'Approve salary for payment' },
        { value: 'salary.pay', label: 'Process Payment', description: 'Process salary payments' }
      ],
      report: [
        { value: 'reports.view', label: 'View Reports', description: 'View report list' },
        { value: 'reports.generate', label: 'Generate Reports', description: 'Create new reports' },
        { value: 'reports.export', label: 'Export Reports', description: 'Export reports to CSV/PDF' }
      ],
      system: [
        { value: 'system.settings', label: 'System Settings', description: 'View and edit system settings' },
        { value: 'system.logs', label: 'View Logs', description: 'View system activity logs' },
        { value: 'system.backup', label: 'Manage Backup', description: 'Create and restore backups' }
      ]
    };
    
    // Also return flat list for easier processing
    const flatPermissions = [];
    Object.keys(permissions).forEach(module => {
      permissions[module].forEach(perm => {
        flatPermissions.push({
          ...perm,
          module
        });
      });
    });
    
    res.json({
      success: true,
      data: {
        grouped: permissions,
        flat: flatPermissions,
        modules: Object.keys(permissions)
      }
    });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================================================
// ROLE ASSIGNMENT
// ============================================================================

/**
 * @desc    Assign role to a user
 * @route   POST /api/roles/assign
 * @access  Private/Super Admin
 */
const assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleName } = req.body;
    
    if (!userId || !roleName) {
      return res.status(400).json({
        success: false,
        error: 'UserId and roleName are required'
      });
    }
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if role exists
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }
    
    const oldRole = user.role;
    
    // Update user role
    user.role = roleName;
    await user.save();
    
    // Log activity
    await ActivityLog.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'ASSIGN_ROLE',
      entityType: 'user',
      entityId: user._id,
      oldData: { role: oldRole },
      newData: { role: roleName },
      ipAddress: req.ip
    });
    
    res.json({
      success: true,
      message: `Role "${roleName}" assigned to ${user.name || user.email} successfully`,
      data: {
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        oldRole,
        newRole: roleName
      }
    });
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * @desc    Toggle role active status
 * @route   PATCH /api/roles/:id/toggle
 * @access  Private/Super Admin
 */
const toggleRoleStatus = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({ success: false, error: 'Role not found' });
    }
    
    if (role.name === 'super_admin') {
      return res.status(400).json({
        success: false,
        error: 'Cannot modify super admin role status'
      });
    }
    
    role.isActive = !role.isActive;
    role.updatedBy = req.user._id;
    await role.save();
    
    res.json({
      success: true,
      message: `Role ${role.isActive ? 'activated' : 'deactivated'} successfully`,
      data: role
    });
  } catch (error) {
    console.error('Toggle role status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get role statistics
 * @route   GET /api/roles/stats
 * @access  Private/Super Admin
 */
const getRoleStats = async (req, res) => {
  try {
    const totalRoles = await Role.countDocuments();
    const activeRoles = await Role.countDocuments({ isActive: true });
    const inactiveRoles = totalRoles - activeRoles;
    
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalRoles,
        activeRoles,
        inactiveRoles,
        roleDistribution
      }
    });
  } catch (error) {
    console.error('Get role stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  // Core CRUD
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  
  // Permissions
  getPermissions,
  
  // Assignment
  assignRoleToUser,
  toggleRoleStatus,
  getRoleStats
};