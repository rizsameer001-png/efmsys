// // server/src/app.js


// server/src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const errorMiddleware = require('./middleware/error.middleware');
const { initializeRedis } = require('./config/redis');
const { initSocket } = require('./config/socketio');

// ==================== IMPORT ALL ROUTES ====================

// Auth & User Routes
const authRoutes = require('./routes/v1/auth.routes');
const userRoutes = require('./routes/v1/user.routes');
const roleRoutes = require('./routes/v1/role.routes');

// Building & Customer Routes
const buildingRoutes = require('./routes/v1/building.routes');
const customerRoutes = require('./routes/v1/customer.routes');

// ==================== TASK MANAGEMENT ROUTES ====================
const taskRoutes = require('./routes/v1/task.routes');
const taskAssignmentRoutes = require('./routes/v1/task-assignment.routes');
const taskProgressRoutes = require('./routes/v1/task-progress.routes');

// ==================== ATTENDANCE & LEAVE ROUTES ====================
const attendanceRoutes = require('./routes/v1/attendance.routes');
const leaveRoutes = require('./routes/v1/leave.routes');

// ==================== PAYROLL & SALARY ROUTES ====================
const salaryRoutes = require('./routes/v1/salary.routes');
const payrollRoutes = require('./routes/v1/payroll.routes');

// ==================== SLA & TRACKING ROUTES ====================
const slaRoutes = require('./routes/v1/sla.routes');
const trackingRoutes = require('./routes/v1/tracking.routes');
const geofenceRoutes = require('./routes/v1/geofence.routes');

// ==================== COMPLAINT ROUTES ====================
const complaintRoutes = require('./routes/v1/complaint.routes');

// ==================== CHAT ROUTES ====================
const chatRoutes = require('./routes/v1/chat.routes');

// ==================== REPORT ROUTES ====================
const reportRoutes = require('./routes/v1/report.routes');

// ==================== NOTIFICATION ROUTES ====================
const notificationRoutes = require('./routes/v1/notification.routes');

// ==================== DASHBOARD ROUTES ====================
const dashboardRoutes = require('./routes/v1/dashboard.routes');

// ==================== VISITOR PASS ROUTES ====================
const visitorPassRoutes = require('./routes/v1/visitorPass.routes');

// Test Routes (Development)
const testAuthRoutes = require('./routes/v1/testAuth.routes');

const app = express();

// Connect to database
connectDB();

// Initialize Redis (non-blocking)
initializeRedis().catch(console.error);

// ==================== MIDDLEWARE ====================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
  skip: () => process.env.REDIS_DISABLED === 'true',
});
app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static('uploads'));

// ==================== HEALTH CHECK ENDPOINTS ====================
app.get('/', (req, res) => {
  res.json({
    name: 'FMS Enterprise API',
    version: '2.0.0',
    status: 'running',
    features: {
      auth: true,
      users: true,
      roles: true,
      buildings: true,
      customers: true,
      tasks: true,
      attendance: true,
      leave: true,
      payroll: true,
      complaints: true,
      chat: true,
      tracking: true,
      sla: true,
      reports: true,
      notifications: true,
      visitorPass: true
    },
    endpoints: {
      health: '/health',
      apiHealth: '/api/health',
      api: '/api/v1',
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      tasks: '/api/v1/tasks',
      chat: '/api/v1/chat',
      tracking: '/api/v1/tracking',
      visitorPass: '/api/v1/visitor-pass'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    redis: process.env.REDIS_DISABLED === 'true' ? 'disabled' : 'mock'
  });
});

// ==================== FRONTEND ROUTE REDIRECTS ====================
/**
 * FIX: Add redirect for /payroll/processor to the correct API endpoint
 * This handles the frontend route that was showing 404
 */
app.get('/payroll/processor', (req, res) => {
  // Redirect to the salary payroll dashboard API
  res.redirect('/api/v1/salary/payroll/dashboard');
});

/**
 * Additional frontend route redirects for common paths
 */
app.get('/payroll/dashboard', (req, res) => {
  res.redirect('/api/v1/salary/payroll/dashboard');
});

app.get('/payroll/settings', (req, res) => {
  res.redirect('/api/v1/salary/payroll/settings');
});

app.get('/payroll/reports', (req, res) => {
  res.redirect('/api/v1/salary/payroll/report');
});

app.get('/salary/structure', (req, res) => {
  res.redirect('/api/v1/salary/all');
});

// ==================== API ROUTES REGISTRATION ====================
// IMPORTANT: Order matters - specific routes BEFORE parameterized routes

// Authentication & User Management
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);

// Building & Customer Management
app.use('/api/v1/buildings', buildingRoutes);
app.use('/api/v1/customer', customerRoutes);

// Task Management
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/task-assignments', taskAssignmentRoutes);
app.use('/api/v1/task-progress', taskProgressRoutes);

// Attendance & Leave
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/leave', leaveRoutes);

// Payroll & Salary
app.use('/api/v1/salary', salaryRoutes);
app.use('/api/v1/payroll', payrollRoutes);

// SLA & Tracking
app.use('/api/v1/sla', slaRoutes);
app.use('/api/v1/tracking', trackingRoutes);
app.use('/api/v1/geofences', geofenceRoutes);

// Complaints
app.use('/api/v1/complaints', complaintRoutes);

// Chat System
app.use('/api/v1/chat', chatRoutes);

// Reports
app.use('/api/v1/reports', reportRoutes);

// Notifications
app.use('/api/v1/notifications', notificationRoutes);

// Dashboard
app.use('/api/v1/dashboard', dashboardRoutes);

// Visitor Pass - Make sure this is registered
app.use('/api/v1/visitor-pass', visitorPassRoutes);

// Test Routes (Development only)
app.use('/api/v1/test', testAuthRoutes);

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      roles: '/api/v1/roles',
      buildings: '/api/v1/buildings',
      customers: '/api/v1/customer',
      tasks: '/api/v1/tasks',
      taskAssignments: '/api/v1/task-assignments',
      taskProgress: '/api/v1/task-progress',
      attendance: '/api/v1/attendance',
      leave: '/api/v1/leave',
      salary: '/api/v1/salary',
      payroll: '/api/v1/payroll',
      complaints: '/api/v1/complaints',
      chat: '/api/v1/chat',
      sla: '/api/v1/sla',
      tracking: '/api/v1/tracking',
      geofences: '/api/v1/geofences',
      reports: '/api/v1/reports',
      notifications: '/api/v1/notifications',
      dashboard: '/api/v1/dashboard',
      visitorPass: '/api/v1/visitor-pass'
    }
  });
});

// ==================== ERROR HANDLER ====================
app.use(errorMiddleware);

// ==================== START SERVER WITH SOCKET.IO ====================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n📋 API Endpoints:`);
  console.log(`   🔐 Auth: http://localhost:${PORT}/api/v1/auth`);
  console.log(`   👥 Users: http://localhost:${PORT}/api/v1/users`);
  console.log(`   📋 Tasks: http://localhost:${PORT}/api/v1/tasks`);
  console.log(`   📍 Tracking: http://localhost:${PORT}/api/v1/tracking`);
  console.log(`   🚨 SLA: http://localhost:${PORT}/api/v1/sla`);
  console.log(`   💬 Chat: http://localhost:${PORT}/api/v1/chat`);
  console.log(`   📊 Reports: http://localhost:${PORT}/api/v1/reports`);
  console.log(`   🔔 Notifications: http://localhost:${PORT}/api/v1/notifications`);
  console.log(`   🔑 Visitor Pass: http://localhost:${PORT}/api/v1/visitor-pass`);
  console.log(`   💰 Payroll: http://localhost:${PORT}/api/v1/salary/payroll/dashboard`);
});

// ==================== INITIALIZE SOCKET.IO FOR REAL-TIME FEATURES ====================
const io = initSocket(server);

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join user room for private messages
  socket.on('join-user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });
  
  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.to(`user_${data.to}`).emit('user-typing', {
      from: data.from,
      name: data.name,
      isTyping: true
    });
  });
  
  socket.on('stop-typing', (data) => {
    socket.to(`user_${data.to}`).emit('user-typing', {
      from: data.from,
      name: data.name,
      isTyping: false
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export both app and server for testing
module.exports = { app, server };