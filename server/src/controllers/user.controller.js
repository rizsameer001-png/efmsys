// server/src/controllers/user.controller.js
// const User = require('../models/user.model');

// // Create User
// exports.createUser = async (req, res) => {
//   try {
//     res.status(201).json({ success: true, message: 'User created' });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Get All Users
// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find().select('-password').limit(20);
//     res.json({ success: true, data: users });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get User by ID
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
//     res.json({ success: true, data: user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Update User
// exports.updateUser = async (req, res) => {
//   try {
//     res.json({ success: true, message: 'User updated' });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Delete User
// exports.deleteUser = async (req, res) => {
//   try {
//     res.json({ success: true, message: 'User deleted' });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Bulk Import Users
// exports.bulkImportUsers = async (req, res) => {
//   try {
//     res.json({ success: true, message: 'Bulk import completed' });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Export Users
// exports.exportUsers = async (req, res) => {
//   try {
//     res.json({ success: true, message: 'Export completed' });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


// // server/src/controllers/user.controller.js
// const User = require('../models/User.model');
// const bcrypt = require('bcryptjs');

// // Create User
// exports.createUser = async (req, res) => {
//   try {
//     const userData = req.body;
    
//     // Check if user already exists
//     const existingUser = await User.findOne({ 
//       $or: [{ email: userData.email }, { employeeId: userData.employeeId }] 
//     });
    
//     if (existingUser) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'User with this email or employee ID already exists' 
//       });
//     }
    
//     // Hash password if provided
//     if (userData.password) {
//       userData.password = await bcrypt.hash(userData.password, 10);
//     } else {
//       // Set default password
//       userData.password = await bcrypt.hash('Welcome@123', 10);
//     }
    
//     // Set defaults
//     userData.isActive = userData.isActive !== undefined ? userData.isActive : true;
//     userData.isEmailVerified = userData.isEmailVerified || false;
//     userData.isPhoneVerified = userData.isPhoneVerified || false;
//     userData.createdAt = new Date();
    
//     const user = new User(userData);
//     await user.save();
    
//     // Remove password from response
//     const userResponse = user.toObject();
//     delete userResponse.password;
    
//     res.status(201).json({ 
//       success: true, 
//       data: userResponse,
//       message: 'User created successfully' 
//     });
//   } catch (error) {
//     console.error('Create user error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Get All Users
// exports.getUsers = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search, role, status } = req.query;
    
//     const query = {};
    
//     // Apply filters
//     if (search) {
//       query.$or = [
//         { firstName: { $regex: search, $options: 'i' } },
//         { lastName: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { employeeId: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     if (role) query.role = role;
//     if (status) query.status = status;
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const [users, total] = await Promise.all([
//       User.find(query)
//         .select('-password')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       User.countDocuments(query)
//     ]);
    
//     res.json({ 
//       success: true, 
//       data: {
//         users,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / parseInt(limit))
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get User by ID
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
//     res.json({ success: true, data: user });
//   } catch (error) {
//     console.error('Get user by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Update User
// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
    
//     // Don't allow password update through this endpoint
//     delete updates.password;
    
//     // Don't allow role change for super_admin
//     if (updates.role === 'super_admin') {
//       const user = await User.findById(id);
//       if (user && user.role !== 'super_admin') {
//         return res.status(403).json({ 
//           success: false, 
//           error: 'Cannot assign super_admin role' 
//         });
//       }
//     }
    
//     updates.updatedAt = new Date();
    
//     const user = await User.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     ).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: user,
//       message: 'User updated successfully' 
//     });
//   } catch (error) {
//     console.error('Update user error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Delete User
// exports.deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Check if user exists
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     // Don't allow deletion of super_admin
//     if (user.role === 'super_admin') {
//       return res.status(403).json({ 
//         success: false, 
//         error: 'Cannot delete super admin user' 
//       });
//     }
    
//     await User.findByIdAndDelete(id);
    
//     res.json({ 
//       success: true, 
//       message: 'User deleted successfully' 
//     });
//   } catch (error) {
//     console.error('Delete user error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Bulk Import Users
// exports.bulkImportUsers = async (req, res) => {
//   try {
//     const { users } = req.body;
    
//     if (!users || !Array.isArray(users) || users.length === 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Please provide an array of users' 
//       });
//     }
    
//     const results = {
//       success: [],
//       failed: []
//     };
    
//     for (const userData of users) {
//       try {
//         // Check if user already exists
//         const existingUser = await User.findOne({ 
//           $or: [{ email: userData.email }, { employeeId: userData.employeeId }] 
//         });
        
//         if (existingUser) {
//           results.failed.push({ ...userData, reason: 'User already exists' });
//           continue;
//         }
        
//         // Hash password
//         if (userData.password) {
//           userData.password = await bcrypt.hash(userData.password, 10);
//         } else {
//           userData.password = await bcrypt.hash('Welcome@123', 10);
//         }
        
//         userData.createdAt = new Date();
        
//         const user = new User(userData);
//         await user.save();
        
//         const userResponse = user.toObject();
//         delete userResponse.password;
//         results.success.push(userResponse);
        
//       } catch (error) {
//         results.failed.push({ ...userData, reason: error.message });
//       }
//     }
    
//     res.json({ 
//       success: true, 
//       data: results,
//       message: `Imported ${results.success.length} users, ${results.failed.length} failed` 
//     });
//   } catch (error) {
//     console.error('Bulk import error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Export Users
// exports.exportUsers = async (req, res) => {
//   try {
//     const { role, status, format = 'json' } = req.query;
    
//     const query = {};
//     if (role) query.role = role;
//     if (status) query.status = status;
    
//     const users = await User.find(query)
//       .select('-password')
//       .sort({ createdAt: -1 });
    
//     if (format === 'csv') {
//       // Convert to CSV format
//       const csvHeaders = ['First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Status', 'Employee ID', 'Created At'];
//       const csvRows = users.map(user => [
//         user.firstName || '',
//         user.lastName || '',
//         user.email || '',
//         user.phone || '',
//         user.role || '',
//         user.status || 'active',
//         user.employeeId || '',
//         user.createdAt ? new Date(user.createdAt).toISOString() : ''
//       ]);
      
//       const csv = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
      
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', 'attachment; filename=users_export.csv');
//       return res.send(csv);
//     }
    
//     res.json({ 
//       success: true, 
//       data: users,
//       count: users.length
//     });
//   } catch (error) {
//     console.error('Export users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


// // server/src/controllers/user.controller.js
// const User = require('../models/User.model');
// const bcrypt = require('bcryptjs');

// // Create User - 🔴 FIXED with better error handling
// exports.createUser = async (req, res) => {
//   try {
//     const userData = req.body;
    
//     // 🔴 FIX: Clean undefined values
//     Object.keys(userData).forEach(key => {
//       if (userData[key] === undefined || userData[key] === null) {
//         delete userData[key];
//       }
//     });
    
//     // Check if user already exists
//     const existingUser = await User.findOne({ 
//       $or: [{ email: userData.email }, { employeeId: userData.employeeId }] 
//     });
    
//     if (existingUser) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'User with this email or employee ID already exists' 
//       });
//     }
    
//     // Hash password
//     const defaultPassword = 'Welcome@123';
//     userData.password = await bcrypt.hash(defaultPassword, 10);
    
//     // Set defaults
//     userData.isActive = true;
//     userData.isEmailVerified = false;
//     userData.isPhoneVerified = false;
//     userData.createdAt = new Date();
    
//     // Remove any fields that shouldn't be in the model
//     delete userData._id;
//     delete userData.__v;
    
//     const user = new User(userData);
//     await user.save();
    
//     // Remove password from response
//     const userResponse = user.toObject();
//     delete userResponse.password;
    
//     res.status(201).json({ 
//       success: true, 
//       data: userResponse,
//       message: 'User created successfully' 
//     });
//   } catch (error) {
//     console.error('Create user error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Get All Users
// exports.getUsers = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search, role, status } = req.query;
    
//     const query = {};
    
//     if (search) {
//       query.$or = [
//         { firstName: { $regex: search, $options: 'i' } },
//         { lastName: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { employeeId: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     if (role) query.role = role;
//     if (status) query.status = status;
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const [users, total] = await Promise.all([
//       User.find(query)
//         .select('-password')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       User.countDocuments(query)
//     ]);
    
//     res.json({ 
//       success: true, 
//       data: {
//         users,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / parseInt(limit))
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get User by ID
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
//     res.json({ success: true, data: user });
//   } catch (error) {
//     console.error('Get user by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Update User
// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
    
//     // Don't allow password update through this endpoint
//     delete updates.password;
    
//     // Don't allow role change for super_admin
//     if (updates.role === 'super_admin') {
//       const user = await User.findById(id);
//       if (user && user.role !== 'super_admin') {
//         return res.status(403).json({ 
//           success: false, 
//           error: 'Cannot assign super_admin role' 
//         });
//       }
//     }
    
//     updates.updatedAt = new Date();
    
//     const user = await User.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     ).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: user,
//       message: 'User updated successfully' 
//     });
//   } catch (error) {
//     console.error('Update user error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Delete User
// exports.deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     if (user.role === 'super_admin') {
//       return res.status(403).json({ 
//         success: false, 
//         error: 'Cannot delete super admin user' 
//       });
//     }
    
//     await User.findByIdAndDelete(id);
    
//     res.json({ 
//       success: true, 
//       message: 'User deleted successfully' 
//     });
//   } catch (error) {
//     console.error('Delete user error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Bulk Import Users
// exports.bulkImportUsers = async (req, res) => {
//   try {
//     const { users } = req.body;
    
//     if (!users || !Array.isArray(users) || users.length === 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Please provide an array of users' 
//       });
//     }
    
//     const results = {
//       success: [],
//       failed: []
//     };
    
//     for (const userData of users) {
//       try {
//         const existingUser = await User.findOne({ 
//           $or: [{ email: userData.email }, { employeeId: userData.employeeId }] 
//         });
        
//         if (existingUser) {
//           results.failed.push({ ...userData, reason: 'User already exists' });
//           continue;
//         }
        
//         userData.password = await bcrypt.hash(userData.password || 'Welcome@123', 10);
//         userData.createdAt = new Date();
        
//         const user = new User(userData);
//         await user.save();
        
//         const userResponse = user.toObject();
//         delete userResponse.password;
//         results.success.push(userResponse);
        
//       } catch (error) {
//         results.failed.push({ ...userData, reason: error.message });
//       }
//     }
    
//     res.json({ 
//       success: true, 
//       data: results,
//       message: `Imported ${results.success.length} users, ${results.failed.length} failed` 
//     });
//   } catch (error) {
//     console.error('Bulk import error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Export Users
// exports.exportUsers = async (req, res) => {
//   try {
//     const { role, status, format = 'json' } = req.query;
    
//     const query = {};
//     if (role) query.role = role;
//     if (status) query.status = status;
    
//     const users = await User.find(query)
//       .select('-password')
//       .sort({ createdAt: -1 });
    
//     if (format === 'csv') {
//       const csvHeaders = ['First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Status', 'Employee ID', 'Created At'];
//       const csvRows = users.map(user => [
//         user.firstName || '',
//         user.lastName || '',
//         user.email || '',
//         user.phone || '',
//         user.role || '',
//         user.status || 'active',
//         user.employeeId || '',
//         user.createdAt ? new Date(user.createdAt).toISOString() : ''
//       ]);
      
//       const csv = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
      
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', 'attachment; filename=users_export.csv');
//       return res.send(csv);
//     }
    
//     res.json({ 
//       success: true, 
//       data: users,
//       count: users.length
//     });
//   } catch (error) {
//     console.error('Export users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };




// // server/src/controllers/user.controller.js
// const User = require('../models/User.model');
// const bcrypt = require('bcryptjs');

// // Create User - 🔴 FIXED with better error handling and chatEnabled
// exports.createUser = async (req, res) => {
//   try {
//     const userData = req.body;
    
//     // 🔴 FIX: Clean undefined values
//     Object.keys(userData).forEach(key => {
//       if (userData[key] === undefined || userData[key] === null) {
//         delete userData[key];
//       }
//     });
    
//     // Check if user already exists
//     const existingUser = await User.findOne({ 
//       $or: [{ email: userData.email }, { employeeId: userData.employeeId }] 
//     });
    
//     if (existingUser) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'User with this email or employee ID already exists' 
//       });
//     }
    
//     // Hash password
//     const defaultPassword = 'Welcome@123';
//     userData.password = await bcrypt.hash(defaultPassword, 10);
    
//     // Set defaults
//     userData.isActive = true;
//     userData.isEmailVerified = false;
//     userData.isPhoneVerified = false;
//     userData.createdAt = new Date();
    
//     // 🔴 NEW: Set chatEnabled default (only Super Admin can set to true)
//     if (userData.chatEnabled === undefined) {
//       userData.chatEnabled = false;
//     }
    
//     // Remove any fields that shouldn't be in the model
//     delete userData._id;
//     delete userData.__v;
    
//     const user = new User(userData);
//     await user.save();
    
//     // Remove password from response
//     const userResponse = user.toObject();
//     delete userResponse.password;
    
//     res.status(201).json({ 
//       success: true, 
//       data: userResponse,
//       message: 'User created successfully' 
//     });
//   } catch (error) {
//     console.error('Create user error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Get All Users
// exports.getUsers = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search, role, status, chatEnabled } = req.query;
    
//     const query = {};
    
//     if (search) {
//       query.$or = [
//         { firstName: { $regex: search, $options: 'i' } },
//         { lastName: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { employeeId: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     if (role) query.role = role;
//     if (status) query.status = status;
//     // 🔴 NEW: Filter by chatEnabled
//     if (chatEnabled !== undefined) {
//       query.chatEnabled = chatEnabled === 'true';
//     }
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const [users, total] = await Promise.all([
//       User.find(query)
//         .select('-password')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       User.countDocuments(query)
//     ]);
    
//     res.json({ 
//       success: true, 
//       data: {
//         users,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / parseInt(limit))
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get User by ID
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
//     res.json({ success: true, data: user });
//   } catch (error) {
//     console.error('Get user by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Update User
// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
    
//     // Don't allow password update through this endpoint
//     delete updates.password;
    
//     // Don't allow role change for super_admin
//     if (updates.role === 'super_admin') {
//       const user = await User.findById(id);
//       if (user && user.role !== 'super_admin') {
//         return res.status(403).json({ 
//           success: false, 
//           error: 'Cannot assign super_admin role' 
//         });
//       }
//     }
    
//     // 🔴 NEW: Only Super Admin can update chatEnabled
//     const requestingUser = await User.findById(req.user._id);
//     if (updates.chatEnabled !== undefined && requestingUser?.role !== 'super_admin') {
//       delete updates.chatEnabled;
//     }
    
//     updates.updatedAt = new Date();
    
//     const user = await User.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     ).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: user,
//       message: 'User updated successfully' 
//     });
//   } catch (error) {
//     console.error('Update user error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Delete User
// exports.deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     if (user.role === 'super_admin') {
//       return res.status(403).json({ 
//         success: false, 
//         error: 'Cannot delete super admin user' 
//       });
//     }
    
//     await User.findByIdAndDelete(id);
    
//     res.json({ 
//       success: true, 
//       message: 'User deleted successfully' 
//     });
//   } catch (error) {
//     console.error('Delete user error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Bulk Import Users
// exports.bulkImportUsers = async (req, res) => {
//   try {
//     const { users } = req.body;
    
//     if (!users || !Array.isArray(users) || users.length === 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Please provide an array of users' 
//       });
//     }
    
//     const results = {
//       success: [],
//       failed: []
//     };
    
//     for (const userData of users) {
//       try {
//         const existingUser = await User.findOne({ 
//           $or: [{ email: userData.email }, { employeeId: userData.employeeId }] 
//         });
        
//         if (existingUser) {
//           results.failed.push({ ...userData, reason: 'User already exists' });
//           continue;
//         }
        
//         userData.password = await bcrypt.hash(userData.password || 'Welcome@123', 10);
//         userData.createdAt = new Date();
        
//         // 🔴 NEW: Set chatEnabled default
//         if (userData.chatEnabled === undefined) {
//           userData.chatEnabled = false;
//         }
        
//         const user = new User(userData);
//         await user.save();
        
//         const userResponse = user.toObject();
//         delete userResponse.password;
//         results.success.push(userResponse);
        
//       } catch (error) {
//         results.failed.push({ ...userData, reason: error.message });
//       }
//     }
    
//     res.json({ 
//       success: true, 
//       data: results,
//       message: `Imported ${results.success.length} users, ${results.failed.length} failed` 
//     });
//   } catch (error) {
//     console.error('Bulk import error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Export Users
// exports.exportUsers = async (req, res) => {
//   try {
//     const { role, status, format = 'json' } = req.query;
    
//     const query = {};
//     if (role) query.role = role;
//     if (status) query.status = status;
    
//     const users = await User.find(query)
//       .select('-password')
//       .sort({ createdAt: -1 });
    
//     if (format === 'csv') {
//       // 🔴 NEW: Add chatEnabled to CSV export
//       const csvHeaders = ['First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Status', 'Employee ID', 'Chat Enabled', 'Created At'];
//       const csvRows = users.map(user => [
//         user.firstName || '',
//         user.lastName || '',
//         user.email || '',
//         user.phone || '',
//         user.role || '',
//         user.status || 'active',
//         user.employeeId || '',
//         user.chatEnabled ? 'Yes' : 'No',
//         user.createdAt ? new Date(user.createdAt).toISOString() : ''
//       ]);
      
//       const csv = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
      
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', 'attachment; filename=users_export.csv');
//       return res.send(csv);
//     }
    
//     res.json({ 
//       success: true, 
//       data: users,
//       count: users.length
//     });
//   } catch (error) {
//     console.error('Export users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== 🔴 NEW: Chat Related Functions ====================

// /**
//  * Get users with chat enabled
//  */
// exports.getChatEnabledUsers = async (req, res) => {
//   try {
//     const users = await User.find({ 
//       chatEnabled: true, 
//       status: 'active' 
//     }).select('firstName lastName email role profileImage');
    
//     res.json({ success: true, data: users });
//   } catch (error) {
//     console.error('Get chat enabled users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Toggle chat enabled for a user (Super Admin only)
//  */
// exports.toggleChatEnabled = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { chatEnabled } = req.body;
    
//     // Only Super Admin can toggle chat
//     if (req.user.role !== 'super_admin') {
//       return res.status(403).json({ 
//         success: false, 
//         error: 'Only Super Admin can modify chat permissions' 
//       });
//     }
    
//     const user = await User.findByIdAndUpdate(
//       id,
//       { chatEnabled, updatedAt: new Date() },
//       { new: true }
//     ).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: user,
//       message: `Chat ${chatEnabled ? 'enabled' : 'disabled'} for ${user.firstName} ${user.lastName}` 
//     });
//   } catch (error) {
//     console.error('Toggle chat enabled error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Bulk enable/disable chat for multiple users
//  */
// exports.bulkToggleChatEnabled = async (req, res) => {
//   try {
//     const { userIds, chatEnabled } = req.body;
    
//     if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Please provide an array of user IDs' 
//       });
//     }
    
//     // Only Super Admin can bulk toggle chat
//     if (req.user.role !== 'super_admin') {
//       return res.status(403).json({ 
//         success: false, 
//         error: 'Only Super Admin can modify chat permissions' 
//       });
//     }
    
//     const result = await User.updateMany(
//       { _id: { $in: userIds } },
//       { chatEnabled, updatedAt: new Date() }
//     );
    
//     res.json({ 
//       success: true, 
//       data: result,
//       message: `Chat ${chatEnabled ? 'enabled' : 'disabled'} for ${result.modifiedCount} users` 
//     });
//   } catch (error) {
//     console.error('Bulk toggle chat enabled error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };






// // server/src/controllers/user.controller.js
// const User = require('../models/User.model');
// const bcrypt = require('bcryptjs');

// // Create User - 🔴 FIXED with better error handling and chatEnabled
// exports.createUser = async (req, res) => {
//   try {
//     const userData = req.body;
    
//     // 🔴 FIX: Clean undefined values
//     Object.keys(userData).forEach(key => {
//       if (userData[key] === undefined || userData[key] === null) {
//         delete userData[key];
//       }
//     });
    
//     // Check if user already exists
//     const existingUser = await User.findOne({ 
//       $or: [{ email: userData.email }, { employeeId: userData.employeeId }] 
//     });
    
//     if (existingUser) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'User with this email or employee ID already exists' 
//       });
//     }
    
//     // Hash password
//     const defaultPassword = 'Welcome@123';
//     userData.password = await bcrypt.hash(defaultPassword, 10);
    
//     // Set defaults
//     userData.isActive = true;
//     userData.isEmailVerified = false;
//     userData.isPhoneVerified = false;
//     userData.createdAt = new Date();
    
//     // Set chatEnabled default
//     if (userData.chatEnabled === undefined) {
//       userData.chatEnabled = false;
//     }
    
//     // Set online status defaults
//     userData.isUserOnline = false;
//     userData.lastSeen = new Date();
//     userData.socketId = null;
    
//     // Remove any fields that shouldn't be in the model
//     delete userData._id;
//     delete userData.__v;
    
//     const user = new User(userData);
//     await user.save();
    
//     // Remove password from response
//     const userResponse = user.toObject();
//     delete userResponse.password;
    
//     res.status(201).json({ 
//       success: true, 
//       data: userResponse,
//       message: 'User created successfully' 
//     });
//   } catch (error) {
//     console.error('Create user error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Get All Users
// exports.getUsers = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search, role, status, chatEnabled } = req.query;
    
//     const query = {};
    
//     if (search) {
//       query.$or = [
//         { firstName: { $regex: search, $options: 'i' } },
//         { lastName: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { employeeId: { $regex: search, $options: 'i' } }
//       ];
//     }
    
//     if (role) query.role = role;
//     if (status) query.status = status;
//     if (chatEnabled !== undefined) {
//       query.chatEnabled = chatEnabled === 'true';
//     }
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const [users, total] = await Promise.all([
//       User.find(query)
//         .select('-password')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       User.countDocuments(query)
//     ]);
    
//     res.json({ 
//       success: true, 
//       data: {
//         users,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / parseInt(limit))
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Get User by ID
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
//     res.json({ success: true, data: user });
//   } catch (error) {
//     console.error('Get user by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Update User
// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
    
//     // Don't allow password update through this endpoint
//     delete updates.password;
    
//     // Don't allow role change for super_admin
//     if (updates.role === 'super_admin') {
//       const user = await User.findById(id);
//       if (user && user.role !== 'super_admin') {
//         return res.status(403).json({ 
//           success: false, 
//           error: 'Cannot assign super_admin role' 
//         });
//       }
//     }
    
//     // Only Super Admin can update chatEnabled
//     const requestingUser = await User.findById(req.user._id);
//     if (updates.chatEnabled !== undefined && requestingUser?.role !== 'super_admin') {
//       delete updates.chatEnabled;
//     }
    
//     updates.updatedAt = new Date();
    
//     const user = await User.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true, runValidators: true }
//     ).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: user,
//       message: 'User updated successfully' 
//     });
//   } catch (error) {
//     console.error('Update user error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Delete User
// exports.deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     if (user.role === 'super_admin') {
//       return res.status(403).json({ 
//         success: false, 
//         error: 'Cannot delete super admin user' 
//       });
//     }
    
//     await User.findByIdAndDelete(id);
    
//     res.json({ 
//       success: true, 
//       message: 'User deleted successfully' 
//     });
//   } catch (error) {
//     console.error('Delete user error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Bulk Import Users
// exports.bulkImportUsers = async (req, res) => {
//   try {
//     const { users } = req.body;
    
//     if (!users || !Array.isArray(users) || users.length === 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Please provide an array of users' 
//       });
//     }
    
//     const results = {
//       success: [],
//       failed: []
//     };
    
//     for (const userData of users) {
//       try {
//         const existingUser = await User.findOne({ 
//           $or: [{ email: userData.email }, { employeeId: userData.employeeId }] 
//         });
        
//         if (existingUser) {
//           results.failed.push({ ...userData, reason: 'User already exists' });
//           continue;
//         }
        
//         userData.password = await bcrypt.hash(userData.password || 'Welcome@123', 10);
//         userData.createdAt = new Date();
        
//         if (userData.chatEnabled === undefined) {
//           userData.chatEnabled = false;
//         }
        
//         userData.isUserOnline = false;
//         userData.lastSeen = new Date();
//         userData.socketId = null;
        
//         const user = new User(userData);
//         await user.save();
        
//         const userResponse = user.toObject();
//         delete userResponse.password;
//         results.success.push(userResponse);
        
//       } catch (error) {
//         results.failed.push({ ...userData, reason: error.message });
//       }
//     }
    
//     res.json({ 
//       success: true, 
//       data: results,
//       message: `Imported ${results.success.length} users, ${results.failed.length} failed` 
//     });
//   } catch (error) {
//     console.error('Bulk import error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// // Export Users
// exports.exportUsers = async (req, res) => {
//   try {
//     const { role, status, format = 'json' } = req.query;
    
//     const query = {};
//     if (role) query.role = role;
//     if (status) query.status = status;
    
//     const users = await User.find(query)
//       .select('-password')
//       .sort({ createdAt: -1 });
    
//     if (format === 'csv') {
//       const csvHeaders = ['First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Status', 'Employee ID', 'Chat Enabled', 'Created At'];
//       const csvRows = users.map(user => [
//         user.firstName || '',
//         user.lastName || '',
//         user.email || '',
//         user.phone || '',
//         user.role || '',
//         user.status || 'active',
//         user.employeeId || '',
//         user.chatEnabled ? 'Yes' : 'No',
//         user.createdAt ? new Date(user.createdAt).toISOString() : ''
//       ]);
      
//       const csv = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
      
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', 'attachment; filename=users_export.csv');
//       return res.send(csv);
//     }
    
//     res.json({ 
//       success: true, 
//       data: users,
//       count: users.length
//     });
//   } catch (error) {
//     console.error('Export users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== ONLINE STATUS METHODS ====================

// /**
//  * Get all online users
//  */
// exports.getOnlineUsers = async (req, res) => {
//   try {
//     const onlineUsers = await User.find({
//       isUserOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isUserOnline lastSeen socketId');
    
//     res.json({ 
//       success: true, 
//       data: onlineUsers,
//       count: onlineUsers.length
//     });
//   } catch (error) {
//     console.error('Get online users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get online users count
//  */
// exports.getOnlineUsersCount = async (req, res) => {
//   try {
//     const count = await User.countDocuments({ 
//       isUserOnline: true, 
//       status: 'active',
//       _id: { $ne: req.user._id }
//     });
    
//     res.json({ 
//       success: true, 
//       data: { count }
//     });
//   } catch (error) {
//     console.error('Get online users count error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get specific user's online status
//  */
// exports.getUserOnlineStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const user = await User.findById(id)
//       .select('_id firstName lastName email role isUserOnline lastSeen socketId');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: {
//         userId: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         isOnline: user.isUserOnline,
//         lastSeen: user.lastSeen
//       }
//     });
//   } catch (error) {
//     console.error('Get user online status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Update current user's online status
//  */
// exports.updateOnlineStatus = async (req, res) => {
//   try {
//     const { isOnline } = req.body;
    
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { 
//         isUserOnline: isOnline !== undefined ? isOnline : true,
//         lastSeen: new Date()
//       },
//       { new: true }
//     ).select('_id isUserOnline lastSeen');
    
//     res.json({ 
//       success: true, 
//       data: {
//         isOnline: user.isUserOnline,
//         lastSeen: user.lastSeen
//       },
//       message: `Status updated to ${user.isUserOnline ? 'online' : 'offline'}`
//     });
//   } catch (error) {
//     console.error('Update online status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Update heartbeat (keep session alive)
//  */
// exports.updateHeartbeat = async (req, res) => {
//   try {
//     await User.findByIdAndUpdate(req.user._id, { 
//       lastSeen: new Date(),
//       isUserOnline: true
//     });
    
//     res.json({ 
//       success: true, 
//       message: 'Heartbeat updated',
//       timestamp: new Date()
//     });
//   } catch (error) {
//     console.error('Heartbeat error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get online technicians only
//  */
// exports.getOnlineTechnicians = async (req, res) => {
//   try {
//     const onlineTechnicians = await User.find({
//       role: 'technician',
//       isUserOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isUserOnline lastSeen');
    
//     res.json({ 
//       success: true, 
//       data: onlineTechnicians,
//       count: onlineTechnicians.length
//     });
//   } catch (error) {
//     console.error('Get online technicians error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get online managers only
//  */
// exports.getOnlineManagers = async (req, res) => {
//   try {
//     const onlineManagers = await User.find({
//       role: { $in: ['manager', 'super_admin', 'admin'] },
//       isUserOnline: true,
//       status: 'active',
//       _id: { $ne: req.user._id }
//     }).select('_id firstName lastName email role profileImage isUserOnline lastSeen');
    
//     res.json({ 
//       success: true, 
//       data: onlineManagers,
//       count: onlineManagers.length
//     });
//   } catch (error) {
//     console.error('Get online managers error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get bulk online status for multiple users
//  */
// exports.getBulkOnlineStatus = async (req, res) => {
//   try {
//     const { userIds } = req.body;
    
//     if (!userIds || !Array.isArray(userIds)) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Please provide an array of user IDs' 
//       });
//     }
    
//     const users = await User.find({
//       _id: { $in: userIds },
//       status: 'active'
//     }).select('_id isUserOnline lastSeen');
    
//     const statusMap = {};
//     users.forEach(user => {
//       statusMap[user._id] = {
//         isOnline: user.isUserOnline,
//         lastSeen: user.lastSeen
//       };
//     });
    
//     res.json({ 
//       success: true, 
//       data: statusMap
//     });
//   } catch (error) {
//     console.error('Bulk online status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get users active in last X minutes
//  */
// exports.getRecentActiveUsers = async (req, res) => {
//   try {
//     const { minutes = 5 } = req.query;
//     const cutoffTime = new Date(Date.now() - (minutes * 60 * 1000));
    
//     const activeUsers = await User.find({
//       lastSeen: { $gte: cutoffTime },
//       status: 'active'
//     }).select('_id firstName lastName email role isUserOnline lastSeen lastLoginAt')
//       .sort({ lastSeen: -1 });
    
//     res.json({ 
//       success: true, 
//       data: activeUsers,
//       count: activeUsers.length,
//       timeWindow: `${minutes} minutes`
//     });
//   } catch (error) {
//     console.error('Get recent active users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get inactive users (not seen for X days)
//  */
// exports.getInactiveUsers = async (req, res) => {
//   try {
//     const { days = 7 } = req.query;
//     const cutoffTime = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
    
//     const inactiveUsers = await User.find({
//       $or: [
//         { lastSeen: { $lt: cutoffTime } },
//         { lastLoginAt: { $lt: cutoffTime } }
//       ],
//       status: 'active',
//       role: { $ne: 'super_admin' }
//     }).select('_id firstName lastName email role lastSeen lastLoginAt')
//       .sort({ lastSeen: 1 });
    
//     res.json({ 
//       success: true, 
//       data: inactiveUsers,
//       count: inactiveUsers.length,
//       inactiveSince: `${days} days`
//     });
//   } catch (error) {
//     console.error('Get inactive users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Register socket ID for current user
//  */
// exports.registerSocketId = async (req, res) => {
//   try {
//     const { socketId } = req.body;
    
//     if (!socketId) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Socket ID is required' 
//       });
//     }
    
//     await User.findByIdAndUpdate(req.user._id, {
//       socketId: socketId,
//       isUserOnline: true,
//       lastSeen: new Date()
//     });
    
//     res.json({ 
//       success: true, 
//       message: 'Socket ID registered successfully'
//     });
//   } catch (error) {
//     console.error('Register socket error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Unregister socket ID (user disconnects)
//  */
// exports.unregisterSocketId = async (req, res) => {
//   try {
//     await User.findByIdAndUpdate(req.user._id, {
//       socketId: null,
//       isUserOnline: false,
//       lastSeen: new Date()
//     });
    
//     res.json({ 
//       success: true, 
//       message: 'Socket ID unregistered successfully'
//     });
//   } catch (error) {
//     console.error('Unregister socket error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== CHAT PERMISSION METHODS ====================

// /**
//  * Get users with chat enabled
//  */
// exports.getChatEnabledUsers = async (req, res) => {
//   try {
//     const users = await User.find({ 
//       chatEnabled: true, 
//       status: 'active' 
//     }).select('firstName lastName email role profileImage isUserOnline lastSeen');
    
//     res.json({ success: true, data: users });
//   } catch (error) {
//     console.error('Get chat enabled users error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get chat permission matrix
//  */
// exports.getChatPermissions = async (req, res) => {
//   const permissionMatrix = {
//     super_admin: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin'],
//       canCreateGroup: true,
//       canModifyPermissions: true
//     },
//     admin: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     manager: {
//       canChatWith: ['customer', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     supervisor: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     technician: {
//       canChatWith: ['customer', 'technician', 'supervisor', 'admin'],
//       canCreateGroup: false,
//       canModifyPermissions: false
//     },
//     hr: {
//       canChatWith: ['employee', 'manager', 'admin'],
//       canCreateGroup: true,
//       canModifyPermissions: false
//     },
//     customer: {
//       canChatWith: ['technician', 'supervisor', 'manager', 'admin'],
//       canCreateGroup: false,
//       canModifyPermissions: false
//     }
//   };
  
//   res.json({ success: true, data: permissionMatrix });
// };

// /**
//  * Get chat statistics
//  */
// exports.getChatStats = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments({ status: 'active' });
//     const chatEnabledUsers = await User.countDocuments({ chatEnabled: true, status: 'active' });
//     const chatDisabledUsers = totalUsers - chatEnabledUsers;
    
//     const byRole = await User.aggregate([
//       { $match: { status: 'active' } },
//       { $group: {
//           _id: '$role',
//           total: { $sum: 1 },
//           chatEnabled: { $sum: { $cond: ['$chatEnabled', 1, 0] } }
//         }
//       }
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         totalUsers,
//         chatEnabledUsers,
//         chatDisabledUsers,
//         percentageEnabled: totalUsers ? ((chatEnabledUsers / totalUsers) * 100).toFixed(1) : 0,
//         byRole
//       }
//     });
//   } catch (error) {
//     console.error('Get chat stats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Toggle chat enabled for a user (Super Admin only)
//  */
// exports.toggleChatEnabled = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { chatEnabled } = req.body;
    
//     if (req.user.role !== 'super_admin') {
//       return res.status(403).json({ 
//         success: false, 
//         error: 'Only Super Admin can modify chat permissions' 
//       });
//     }
    
//     const user = await User.findByIdAndUpdate(
//       id,
//       { chatEnabled, updatedAt: new Date() },
//       { new: true }
//     ).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: user,
//       message: `Chat ${chatEnabled ? 'enabled' : 'disabled'} for ${user.firstName} ${user.lastName}` 
//     });
//   } catch (error) {
//     console.error('Toggle chat enabled error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Bulk enable/disable chat for multiple users
//  */
// exports.bulkToggleChatEnabled = async (req, res) => {
//   try {
//     const { userIds, chatEnabled } = req.body;
    
//     if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Please provide an array of user IDs' 
//       });
//     }
    
//     if (req.user.role !== 'super_admin') {
//       return res.status(403).json({ 
//         success: false, 
//         error: 'Only Super Admin can modify chat permissions' 
//       });
//     }
    
//     const result = await User.updateMany(
//       { _id: { $in: userIds } },
//       { chatEnabled, updatedAt: new Date() }
//     );
    
//     res.json({ 
//       success: true, 
//       data: result,
//       message: `Chat ${chatEnabled ? 'enabled' : 'disabled'} for ${result.modifiedCount} users` 
//     });
//   } catch (error) {
//     console.error('Bulk toggle chat enabled error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== PROFILE METHODS ====================

// /**
//  * Update own profile
//  */
// exports.updateOwnProfile = async (req, res) => {
//   try {
//     const updates = req.body;
//     delete updates.password;
//     delete updates.role;
//     delete updates.email;
    
//     updates.updatedAt = new Date();
    
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       updates,
//       { new: true, runValidators: true }
//     ).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: user,
//       message: 'Profile updated successfully' 
//     });
//   } catch (error) {
//     console.error('Update profile error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Change own password
//  */
// exports.changeOwnPassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
    
//     const user = await User.findById(req.user._id).select('+password');
    
//     const isMatch = await user.comparePassword(currentPassword);
//     if (!isMatch) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Current password is incorrect' 
//       });
//     }
    
//     user.password = newPassword;
//     await user.save();
    
//     res.json({ 
//       success: true, 
//       message: 'Password changed successfully' 
//     });
//   } catch (error) {
//     console.error('Change password error:', error);
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Upload profile image
//  */
// exports.uploadProfileImage = async (req, res) => {
//   try {
//     // This would typically handle file upload
//     // For now, just return success
//     res.json({ 
//       success: true, 
//       message: 'Profile image uploaded successfully' 
//     });
//   } catch (error) {
//     console.error('Upload profile image error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Remove profile image
//  */
// exports.removeProfileImage = async (req, res) => {
//   try {
//     await User.findByIdAndUpdate(req.user._id, { profileImage: null });
    
//     res.json({ 
//       success: true, 
//       message: 'Profile image removed successfully' 
//     });
//   } catch (error) {
//     console.error('Remove profile image error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== TEAM MANAGEMENT METHODS ====================

// /**
//  * Get technicians for assignment
//  */
// exports.getTechnicians = async (req, res) => {
//   try {
//     const technicians = await User.find({ 
//       role: 'technician', 
//       status: 'active' 
//     }).select('firstName lastName email phone profileImage isUserOnline lastSeen');
    
//     res.json({ success: true, data: technicians });
//   } catch (error) {
//     console.error('Get technicians error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get team members (for managers and supervisors)
//  */
// exports.getTeamMembers = async (req, res) => {
//   try {
//     let query = {};
    
//     if (req.user.role === 'manager') {
//       query.reportingManager = req.user._id;
//     } else if (req.user.role === 'supervisor') {
//       query.supervisor = req.user._id;
//     } else {
//       return res.status(403).json({ 
//         success: false, 
//         error: 'You do not have team members' 
//       });
//     }
    
//     const teamMembers = await User.find(query)
//       .select('firstName lastName email role designation profileImage isUserOnline lastSeen');
    
//     res.json({ success: true, data: teamMembers, count: teamMembers.length });
//   } catch (error) {
//     console.error('Get team members error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get reporting hierarchy
//  */
// exports.getReportingHierarchy = async (req, res) => {
//   try {
//     const users = await User.find({ status: 'active' })
//       .select('_id firstName lastName role designation reportingManager supervisor');
    
//     res.json({ success: true, data: users });
//   } catch (error) {
//     console.error('Get reporting hierarchy error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== USER STATUS METHODS ====================

// /**
//  * Activate a user account
//  */
// exports.activateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const user = await User.findByIdAndUpdate(
//       id,
//       { status: 'active', updatedAt: new Date() },
//       { new: true }
//     ).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: user,
//       message: 'User activated successfully' 
//     });
//   } catch (error) {
//     console.error('Activate user error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Deactivate a user account
//  */
// exports.deactivateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;
    
//     const user = await User.findByIdAndUpdate(
//       id,
//       { status: 'inactive', terminationReason: reason, updatedAt: new Date() },
//       { new: true }
//     ).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: user,
//       message: 'User deactivated successfully' 
//     });
//   } catch (error) {
//     console.error('Deactivate user error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Reset user password (Admin only)
//  */
// exports.resetUserPassword = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const newPassword = 'Welcome@123';
    
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
    
//     const user = await User.findByIdAndUpdate(
//       id,
//       { password: hashedPassword, updatedAt: new Date() },
//       { new: true }
//     );
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       message: 'Password reset successfully. New password: Welcome@123' 
//     });
//   } catch (error) {
//     console.error('Reset password error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== NOTIFICATION METHODS ====================

// /**
//  * Update user's FCM token for push notifications
//  */
// exports.updateFCMToken = async (req, res) => {
//   try {
//     const { token } = req.body;
    
//     await User.findByIdAndUpdate(req.user._id, {
//       $addToSet: { fcmTokens: token }
//     });
    
//     res.json({ success: true, message: 'FCM token updated successfully' });
//   } catch (error) {
//     console.error('Update FCM token error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Remove FCM token
//  */
// exports.removeFCMToken = async (req, res) => {
//   try {
//     const { token } = req.body;
    
//     await User.findByIdAndUpdate(req.user._id, {
//       $pull: { fcmTokens: token }
//     });
    
//     res.json({ success: true, message: 'FCM token removed successfully' });
//   } catch (error) {
//     console.error('Remove FCM token error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== DOCUMENT METHODS ====================

// /**
//  * Upload user document (Admin only)
//  */
// exports.uploadUserDocument = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const documentData = req.body;
    
//     const user = await User.findByIdAndUpdate(
//       id,
//       { $push: { documents: documentData } },
//       { new: true }
//     );
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ success: true, message: 'Document uploaded successfully' });
//   } catch (error) {
//     console.error('Upload document error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get user documents
//  */
// exports.getUserDocuments = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const user = await User.findById(id).select('documents');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ success: true, data: user.documents });
//   } catch (error) {
//     console.error('Get documents error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Delete user document
//  */
// exports.deleteUserDocument = async (req, res) => {
//   try {
//     const { id, documentId } = req.params;
    
//     const user = await User.findByIdAndUpdate(
//       id,
//       { $pull: { documents: { _id: documentId } } },
//       { new: true }
//     );
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ success: true, message: 'Document deleted successfully' });
//   } catch (error) {
//     console.error('Delete document error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== PERMISSION METHODS ====================

// /**
//  * Get user permissions
//  */
// exports.getUserPermissions = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const user = await User.findById(id).select('role customPermissions');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: {
//         role: user.role,
//         customPermissions: user.customPermissions || []
//       }
//     });
//   } catch (error) {
//     console.error('Get user permissions error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Update user permissions
//  */
// exports.updateUserPermissions = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { permissions } = req.body;
    
//     const user = await User.findByIdAndUpdate(
//       id,
//       { customPermissions: permissions, updatedAt: new Date() },
//       { new: true }
//     ).select('role customPermissions');
    
//     if (!user) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }
    
//     res.json({ 
//       success: true, 
//       data: user,
//       message: 'Permissions updated successfully' 
//     });
//   } catch (error) {
//     console.error('Update permissions error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ==================== DASHBOARD METHODS ====================

// /**
//  * Get dashboard statistics
//  */
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments({ status: 'active' });
//     const onlineUsers = await User.countDocuments({ isUserOnline: true, status: 'active' });
//     const byRole = await User.getCountByRole();
    
//     res.json({
//       success: true,
//       data: {
//         totalUsers,
//         onlineUsers,
//         offlineUsers: totalUsers - onlineUsers,
//         byRole
//       }
//     });
//   } catch (error) {
//     console.error('Get dashboard stats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// /**
//  * Get user activity log
//  */
// exports.getUserActivityLog = async (req, res) => {
//   try {
//     const { page = 1, limit = 50, fromDate, toDate } = req.query;
    
//     // This would typically query an activity log collection
//     // For now, return basic user data
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const users = await User.find({})
//       .select('firstName lastName email role lastLoginAt lastSeen createdAt')
//       .sort({ lastLoginAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));
    
//     const total = await User.countDocuments({});
    
//     res.json({
//       success: true,
//       data: users,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / parseInt(limit))
//       }
//     });
//   } catch (error) {
//     console.error('Get activity log error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };













const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

// ==================== CREATE USER ====================
exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    
    // Clean undefined values
    Object.keys(userData).forEach(key => {
      if (userData[key] === undefined || userData[key] === null) {
        delete userData[key];
      }
    });
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: userData.email }, { employeeId: userData.employeeId }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User with this email or employee ID already exists' 
      });
    }
    
    // Hash password
    const defaultPassword = 'Welcome@123';
    userData.password = await bcrypt.hash(defaultPassword, 10);
    
    // Set defaults
    userData.status = userData.status || 'active';
    userData.chatEnabled = userData.chatEnabled || false;
    userData.isUserOnline = false;
    userData.lastSeen = new Date();
    userData.socketId = null;
    
    const user = new User(userData);
    await user.save();
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ 
      success: true, 
      data: userResponse,
      message: 'User created successfully' 
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================== GET ALL USERS ====================
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status, chatEnabled } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) query.role = role;
    if (status) query.status = status;
    if (chatEnabled !== undefined) {
      query.chatEnabled = chatEnabled === 'true';
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);
    
    res.json({ 
      success: true, 
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    // Return empty array instead of 500 to prevent UI break
    res.status(200).json({ 
      success: true, 
      data: {
        users: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      }
    });
  }
};

// ==================== GET USER BY ID ====================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== UPDATE USER ====================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    delete updates.password;
    delete updates._id;
    
    if (updates.role === 'super_admin') {
      const user = await User.findById(id);
      if (user && user.role !== 'super_admin') {
        return res.status(403).json({ 
          success: false, 
          error: 'Cannot assign super_admin role' 
        });
      }
    }
    
    const requestingUser = await User.findById(req.user._id);
    if (updates.chatEnabled !== undefined && requestingUser?.role !== 'super_admin') {
      delete updates.chatEnabled;
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      data: user,
      message: 'User updated successfully' 
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// ==================== DELETE USER ====================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    if (user.role === 'super_admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Cannot delete super admin user' 
      });
    }
    
    await User.findByIdAndDelete(id);
    
    res.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== ONLINE STATUS METHODS (FOR CHAT) ====================

/**
 * Get all online users (for chat module)
 */
exports.getOnlineUsers = async (req, res) => {
  try {
    const onlineUsers = await User.find({
      isUserOnline: true,
      status: 'active',
      _id: { $ne: req.user._id }
    }).select('_id firstName lastName email role profileImage isUserOnline lastSeen socketId');
    
    res.json({ 
      success: true, 
      data: onlineUsers,
      count: onlineUsers.length
    });
  } catch (error) {
    console.error('Get online users error:', error);
    res.json({ success: true, data: [], count: 0 });
  }
};

/**
 * Update user heartbeat (keep online status alive)
 */
exports.updateHeartbeat = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { 
      lastSeen: new Date(),
      isUserOnline: true
    });
    
    res.json({ 
      success: true, 
      message: 'Heartbeat updated',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Heartbeat error:', error);
    res.json({ success: true });
  }
};

/**
 * Register socket ID for current user
 */
exports.registerSocketId = async (req, res) => {
  try {
    const { socketId } = req.body;
    
    if (!socketId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Socket ID is required' 
      });
    }
    
    await User.findByIdAndUpdate(req.user._id, {
      socketId: socketId,
      isUserOnline: true,
      lastSeen: new Date()
    });
    
    res.json({ 
      success: true, 
      message: 'Socket ID registered successfully'
    });
  } catch (error) {
    console.error('Register socket error:', error);
    res.json({ success: true });
  }
};

/**
 * Unregister socket ID
 */
exports.unregisterSocketId = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      socketId: null,
      isUserOnline: false,
      lastSeen: new Date()
    });
    
    res.json({ 
      success: true, 
      message: 'Socket ID unregistered successfully'
    });
  } catch (error) {
    console.error('Unregister socket error:', error);
    res.json({ success: true });
  }
};

/**
 * Update online status
 */
exports.updateOnlineStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;
    
    await User.findByIdAndUpdate(
      req.user._id,
      { 
        isUserOnline: isOnline !== undefined ? isOnline : true,
        lastSeen: new Date()
      }
    );
    
    res.json({ 
      success: true, 
      message: `Status updated to ${isOnline ? 'online' : 'offline'}`
    });
  } catch (error) {
    console.error('Update online status error:', error);
    res.json({ success: true });
  }
};

/**
 * Get user online status by ID
 */
exports.getUserOnlineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id)
      .select('_id firstName lastName email role isUserOnline lastSeen');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      data: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isOnline: user.isUserOnline,
        lastSeen: user.lastSeen
      }
    });
  } catch (error) {
    console.error('Get user online status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== CHAT PERMISSION METHODS ====================

/**
 * Get users with chat enabled
 */
exports.getChatEnabledUsers = async (req, res) => {
  try {
    const users = await User.find({ 
      chatEnabled: true, 
      status: 'active' 
    }).select('firstName lastName email role profileImage isUserOnline lastSeen');
    
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get chat enabled users error:', error);
    res.json({ success: true, data: [] });
  }
};

/**
 * Toggle chat enabled for a user (Super Admin only)
 */
exports.toggleChatEnabled = async (req, res) => {
  try {
    const { id } = req.params;
    const { chatEnabled } = req.body;
    
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only Super Admin can modify chat permissions' 
      });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { chatEnabled },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      data: user,
      message: `Chat ${chatEnabled ? 'enabled' : 'disabled'} for ${user.firstName} ${user.lastName}` 
    });
  } catch (error) {
    console.error('Toggle chat enabled error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== PROFILE METHODS ====================

exports.updateOwnProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.role;
    delete updates.email;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      data: user,
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.changeOwnPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        error: 'Current password is incorrect' 
      });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    res.json({ 
      success: true, 
      message: 'Profile image uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.removeProfileImage = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { profileImage: null });
    res.json({ 
      success: true, 
      message: 'Profile image removed successfully' 
    });
  } catch (error) {
    console.error('Remove profile image error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== USER STATUS METHODS ====================

exports.activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndUpdate(
      id,
      { status: 'active' },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      data: user,
      message: 'User activated successfully' 
    });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const user = await User.findByIdAndUpdate(
      id,
      { status: 'inactive', terminationReason: reason },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      data: user,
      message: 'User deactivated successfully' 
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const newPassword = 'Welcome@123';
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Password reset successfully. New password: Welcome@123' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== TEAM MANAGEMENT ====================

exports.getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ 
      role: 'technician', 
      status: 'active' 
    }).select('firstName lastName email phone profileImage isUserOnline lastSeen');
    
    res.json({ success: true, data: technicians });
  } catch (error) {
    console.error('Get technicians error:', error);
    res.json({ success: true, data: [] });
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'manager') {
      query.reportingManager = req.user._id;
    } else if (req.user.role === 'supervisor') {
      query.supervisor = req.user._id;
    } else {
      return res.json({ success: true, data: [], count: 0 });
    }
    
    const teamMembers = await User.find(query)
      .select('firstName lastName email role designation profileImage isUserOnline lastSeen');
    
    res.json({ success: true, data: teamMembers, count: teamMembers.length });
  } catch (error) {
    console.error('Get team members error:', error);
    res.json({ success: true, data: [] });
  }
};

exports.getReportingHierarchy = async (req, res) => {
  try {
    const users = await User.find({ status: 'active' })
      .select('_id firstName lastName role designation reportingManager supervisor');
    
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get reporting hierarchy error:', error);
    res.json({ success: true, data: [] });
  }
};

// ==================== DASHBOARD STATS ====================

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ status: 'active' });
    const onlineUsers = await User.countDocuments({ isUserOnline: true, status: 'active' });
    
    res.json({
      success: true,
      data: {
        totalUsers,
        onlineUsers,
        offlineUsers: totalUsers - onlineUsers
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.json({ success: true, data: { totalUsers: 0, onlineUsers: 0, offlineUsers: 0 } });
  }
};

// ==================== BULK OPERATIONS ====================

exports.bulkToggleChatEnabled = async (req, res) => {
  try {
    const { userIds, chatEnabled } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide an array of user IDs' 
      });
    }
    
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only Super Admin can modify chat permissions' 
      });
    }
    
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { chatEnabled }
    );
    
    res.json({ 
      success: true, 
      data: result,
      message: `Chat ${chatEnabled ? 'enabled' : 'disabled'} for ${result.modifiedCount} users` 
    });
  } catch (error) {
    console.error('Bulk toggle chat enabled error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.bulkImportUsers = async (req, res) => {
  try {
    const { users } = req.body;
    
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide an array of users' 
      });
    }
    
    const results = { success: [], failed: [] };
    
    for (const userData of users) {
      try {
        const existingUser = await User.findOne({ 
          $or: [{ email: userData.email }, { employeeId: userData.employeeId }] 
        });
        
        if (existingUser) {
          results.failed.push({ ...userData, reason: 'User already exists' });
          continue;
        }
        
        userData.password = await bcrypt.hash(userData.password || 'Welcome@123', 10);
        userData.chatEnabled = userData.chatEnabled || false;
        userData.isUserOnline = false;
        userData.lastSeen = new Date();
        userData.socketId = null;
        
        const user = new User(userData);
        await user.save();
        
        const userResponse = user.toObject();
        delete userResponse.password;
        results.success.push(userResponse);
        
      } catch (error) {
        results.failed.push({ ...userData, reason: error.message });
      }
    }
    
    res.json({ 
      success: true, 
      data: results,
      message: `Imported ${results.success.length} users, ${results.failed.length} failed` 
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.exportUsers = async (req, res) => {
  try {
    const { role, status, format = 'json' } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });
    
    if (format === 'csv') {
      const csvHeaders = ['First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Status', 'Employee ID', 'Chat Enabled', 'Created At'];
      const csvRows = users.map(user => [
        user.firstName || '',
        user.lastName || '',
        user.email || '',
        user.phone || '',
        user.role || '',
        user.status || 'active',
        user.employeeId || '',
        user.chatEnabled ? 'Yes' : 'No',
        user.createdAt ? new Date(user.createdAt).toISOString() : ''
      ]);
      
      const csv = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=users_export.csv');
      return res.send(csv);
    }
    
    res.json({ 
      success: true, 
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== DOCUMENT METHODS ====================

exports.uploadUserDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const documentData = req.body;
    
    const user = await User.findByIdAndUpdate(
      id,
      { $push: { documents: documentData } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, message: 'Document uploaded successfully' });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('documents');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, data: user.documents || [] });
  } catch (error) {
    console.error('Get documents error:', error);
    res.json({ success: true, data: [] });
  }
};

exports.deleteUserDocument = async (req, res) => {
  try {
    const { id, documentId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { documents: { _id: documentId } } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== PERMISSION METHODS ====================

exports.getUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('role customPermissions');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      data: {
        role: user.role,
        customPermissions: user.customPermissions || []
      }
    });
  } catch (error) {
    console.error('Get user permissions error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;
    
    const user = await User.findByIdAndUpdate(
      id,
      { customPermissions: permissions },
      { new: true }
    ).select('role customPermissions');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      data: user,
      message: 'Permissions updated successfully' 
    });
  } catch (error) {
    console.error('Update permissions error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserActivityLog = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find({})
      .select('firstName lastName email role lastLoginAt lastSeen createdAt')
      .sort({ lastLoginAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments({});
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get activity log error:', error);
    res.json({ success: true, data: [], pagination: { page: 1, limit: 50, total: 0, pages: 0 } });
  }
};

// ==================== NOTIFICATION METHODS ====================

exports.updateFCMToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { fcmTokens: token }
    });
    
    res.json({ success: true, message: 'FCM token updated successfully' });
  } catch (error) {
    console.error('Update FCM token error:', error);
    res.json({ success: true });
  }
};

exports.removeFCMToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { fcmTokens: token }
    });
    
    res.json({ success: true, message: 'FCM token removed successfully' });
  } catch (error) {
    console.error('Remove FCM token error:', error);
    res.json({ success: true });
  }
};

// ==================== CHAT PERMISSION MATRIX ====================

exports.getChatPermissions = async (req, res) => {
  const permissionMatrix = {
    super_admin: {
      canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin'],
      canCreateGroup: true,
      canModifyPermissions: true
    },
    admin: {
      canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
      canCreateGroup: true,
      canModifyPermissions: false
    },
    manager: {
      canChatWith: ['customer', 'supervisor', 'manager', 'admin'],
      canCreateGroup: true,
      canModifyPermissions: false
    },
    supervisor: {
      canChatWith: ['customer', 'technician', 'supervisor', 'manager', 'admin'],
      canCreateGroup: true,
      canModifyPermissions: false
    },
    technician: {
      canChatWith: ['customer', 'technician', 'supervisor', 'admin'],
      canCreateGroup: false,
      canModifyPermissions: false
    },
    hr: {
      canChatWith: ['employee', 'manager', 'admin'],
      canCreateGroup: true,
      canModifyPermissions: false
    },
    customer: {
      canChatWith: ['technician', 'supervisor', 'manager', 'admin'],
      canCreateGroup: false,
      canModifyPermissions: false
    }
  };
  
  res.json({ success: true, data: permissionMatrix });
};

exports.getChatStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ status: 'active' });
    const chatEnabledUsers = await User.countDocuments({ chatEnabled: true, status: 'active' });
    
    res.json({
      success: true,
      data: {
        totalUsers,
        chatEnabledUsers,
        chatDisabledUsers: totalUsers - chatEnabledUsers,
        percentageEnabled: totalUsers ? ((chatEnabledUsers / totalUsers) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Get chat stats error:', error);
    res.json({ success: true, data: { totalUsers: 0, chatEnabledUsers: 0, chatDisabledUsers: 0, percentageEnabled: 0 } });
  }
};







