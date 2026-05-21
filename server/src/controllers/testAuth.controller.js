// server/src/controllers/testAuth.controller.js
const TestUser = require('../models/testUser.model');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'test_secret_key',
    { expiresIn: '7d' }
  );
};

// Register
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    console.log('Register attempt:', { email, name });
    
    // Check if user exists
    const existingUser = await TestUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User already exists. Please login.' 
      });
    }
    
    // Create new user
    const user = new TestUser({
      email,
      password,
      name: name || email.split('@')[0]
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user._id, user.email);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', email);
    
    // Find user
    const user = await TestUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }
    
    // Generate token
    const token = generateToken(user._id, user.email);
    
    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await TestUser.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};