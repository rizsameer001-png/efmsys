// server/src/controllers/role.controller.js
const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const User = require('../models/user.model');

// Get all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate('permissions', 'name module action');

    res.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id).populate('permissions', 'name module action description');

    if (!role) {
      return res.status(404).json({ success: false, error: 'Role not found' });
    }

    res.json({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create custom role
exports.createRole = async (req, res) => {
  try {
    const { name, displayName, description, permissions } = req.body;

    // Check if role exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ success: false, error: 'Role already exists' });
    }

    // Validate permissions
    const validPermissions = await Permission.find({ name: { $in: permissions } });
    const permissionIds = validPermissions.map(p => p._id);

    const role = new Role({
      name,
      displayName,
      description,
      permissions: permissionIds,
      createdBy: req.userId,
      isSystemRole: false,
    });

    await role.save();

    const populatedRole = await Role.findById(role._id).populate('permissions');

    res.status(201).json({
      success: true,
      data: populatedRole,
      message: 'Role created successfully',
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName, description, permissions } = req.body;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ success: false, error: 'Role not found' });
    }

    // Cannot modify system roles
    if (role.isSystemRole) {
      return res.status(400).json({
        success: false,
        error: 'Cannot modify system roles',
      });
    }

    if (displayName) role.displayName = displayName;
    if (description) role.description = description;

    if (permissions) {
      const validPermissions = await Permission.find({ name: { $in: permissions } });
      role.permissions = validPermissions.map(p => p._id);
    }

    await role.save();

    const updatedRole = await Role.findById(id).populate('permissions');

    res.json({
      success: true,
      data: updatedRole,
      message: 'Role updated successfully',
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ success: false, error: 'Role not found' });
    }

    // Cannot delete system roles
    if (role.isSystemRole) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete system roles',
      });
    }

    // Check if any user has this role
    const usersWithRole = await User.countDocuments({ role: role.name });
    if (usersWithRole > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete role. ${usersWithRole} users currently have this role.`,
      });
    }

    await role.deleteOne();

    res.json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all permissions
exports.getPermissions = async (req, res) => {
  try {
    const { module } = req.query;
    const query = { isActive: true };
    if (module) query.module = module;

    const permissions = await Permission.find(query).sort('module action');

    // Group by module
    const groupedPermissions = permissions.reduce((acc, p) => {
      if (!acc[p.module]) acc[p.module] = [];
      acc[p.module].push(p);
      return acc;
    }, {});

    res.json({
      success: true,
      data: { permissions, groupedPermissions },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Assign role to user
exports.assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleName, customPermissions } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(404).json({ success: false, error: 'Role not found' });
    }

    user.role = roleName;
    if (customPermissions) {
      user.customPermissions = customPermissions;
    }
    await user.save();

    res.json({
      success: true,
      data: { userId: user._id, role: user.role, customPermissions: user.customPermissions },
      message: 'Role assigned successfully',
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};