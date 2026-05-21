// server/src/controllers/user.controller.js
const User = require('../models/user.model');
const Role = require('../models/role.model');
const emailService = require('../services/email.service');
const tokenService = require('../services/token.service');

// Create User (Admin/HR only)
exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      designation,
      department,
      reportingManager,
      supervisor,
      assignedBuildings,
      shiftTiming,
      joiningDate,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or phone already exists',
      });
    }

    // Generate temporary password
    const tempPassword = tokenService.generateOTP(8);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      role,
      designation,
      department,
      reportingManager,
      supervisor,
      assignedBuildings,
      shiftTiming,
      joiningDate: joiningDate || new Date(),
      password: tempPassword,
      createdBy: req.userId,
    });

    await user.save();

    // Send welcome email with credentials
    await emailService.sendAccountCreatedEmail(user, tempPassword);

    // Return user without password
    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      success: true,
      data: userData,
      message: 'User created successfully. Credentials sent via email.',
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get All Users (with filters)
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      department,
      status,
      buildingId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) query.role = role;
    if (department) query.department = department;
    if (status) query.status = status;

    // Role-based filtering
    if (req.userRole === 'manager') {
      query.reportingManager = req.userId;
    } else if (req.userRole === 'supervisor') {
      query.supervisor = req.userId;
    }

    if (buildingId) {
      query.assignedBuildings = buildingId;
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .populate('reportingManager', 'firstName lastName email')
        .populate('supervisor', 'firstName lastName email')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('-password')
      .populate('reportingManager', 'firstName lastName email employeeId')
      .populate('supervisor', 'firstName lastName email employeeId')
      .populate('assignedBuildings', 'name code');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check permission to view this user
    if (req.userRole === 'manager' && user.reportingManager?._id.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    if (req.userRole === 'supervisor' && user.supervisor?._id.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent role change for self
    if (id === req.userId && updates.role) {
      return res.status(400).json({
        success: false,
        error: 'You cannot change your own role',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check permission
    if (req.userRole === 'manager' && user.reportingManager?.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    // Remove fields that cannot be updated directly
    delete updates.password;
    delete updates.employeeId;
    delete updates.createdBy;

    Object.assign(user, updates);
    await user.save();

    const updatedUser = await User.findById(id).select('-password');

    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete User (Soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.userId) {
      return res.status(400).json({
        success: false,
        error: 'You cannot delete your own account',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Soft delete - set status to terminated
    user.status = 'terminated';
    user.terminationDate = new Date();
    user.terminatedBy = req.userId;
    await user.save();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Bulk Import Users
exports.bulkImportUsers = async (req, res) => {
  try {
    const { users } = req.body;
    const results = {
      success: [],
      failed: [],
    };

    for (const userData of users) {
      try {
        const existingUser = await User.findOne({
          $or: [{ email: userData.email }, { phone: userData.phone }],
        });

        if (existingUser) {
          results.failed.push({ ...userData, reason: 'Email or phone already exists' });
          continue;
        }

        const tempPassword = tokenService.generateOTP(8);
        const user = new User({
          ...userData,
          password: tempPassword,
          createdBy: req.userId,
        });

        await user.save();
        await emailService.sendAccountCreatedEmail(user, tempPassword);

        results.success.push({
          id: user._id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        });
      } catch (error) {
        results.failed.push({ ...userData, reason: error.message });
      }
    }

    res.json({
      success: true,
      data: results,
      message: `Imported ${results.success.length} users, ${results.failed.length} failed`,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Export Users
exports.exportUsers = async (req, res) => {
  try {
    const { format = 'csv', ...filters } = req.query;

    const query = {};
    if (filters.role) query.role = filters.role;
    if (filters.department) query.department = filters.department;
    if (filters.status) query.status = filters.status;

    const users = await User.find(query)
      .select('employeeId firstName lastName email phone role department status joiningDate')
      .lean();

    if (format === 'csv') {
      const csv = users.map(user => ({
        'Employee ID': user.employeeId,
        'First Name': user.firstName,
        'Last Name': user.lastName,
        Email: user.email,
        Phone: user.phone,
        Role: user.role,
        Department: user.department,
        Status: user.status,
        'Joining Date': user.joiningDate?.toISOString().split('T')[0],
      }));

      res.json({
        success: true,
        data: csv,
      });
    } else {
      res.json({
        success: true,
        data: users,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};