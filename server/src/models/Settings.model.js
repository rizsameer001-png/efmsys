const mongoose = require('mongoose');

// Debug flag
const DEBUG = process.env.DEBUG === 'true';

// Helper for debug logging
const debugLog = (message, data = null) => {
  if (DEBUG) {
    console.log(`[Settings Model] ${message}`);
    if (data) console.log(data);
  }
};

// General Settings Schema
const settingsSchema = new mongoose.Schema({
  company: {
    name: { type: String, default: '', trim: true },
    logo: { type: String, default: '', trim: true },
    email: { type: String, default: '', lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    website: { type: String, default: '', trim: true },
    address: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    country: { type: String, default: '', trim: true },
    taxId: { type: String, default: '', trim: true },
    registrationNumber: { type: String, default: '', trim: true }
  },
  branding: {
    primaryColor: { type: String, default: '#3B82F6', match: /^#[0-9A-Fa-f]{6}$/ },
    secondaryColor: { type: String, default: '#10B981', match: /^#[0-9A-Fa-f]{6}$/ },
    logoUrl: { type: String, default: '', trim: true },
    faviconUrl: { type: String, default: '', trim: true },
    companyTagline: { type: String, default: '', trim: true }
  },
  localization: {
    defaultLanguage: { type: String, default: 'en', enum: ['en', 'ar', 'hi', 'ur'] },
    defaultTimezone: { type: String, default: 'Asia/Dubai' },
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
    timeFormat: { type: String, default: '24h', enum: ['12h', '24h'] },
    currency: { type: String, default: 'AED' },
    currencySymbol: { type: String, default: 'AED', maxlength: 5 }
  },
  notification: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    taskAssignmentAlerts: { type: Boolean, default: true },
    leaveApprovalAlerts: { type: Boolean, default: true },
    attendanceReminders: { type: Boolean, default: true },
    salarySlipAlerts: { type: Boolean, default: true },
    dailyDigest: { type: Boolean, default: false }
  },
  security: {
    sessionTimeout: { type: Number, default: 30, min: 5, max: 120 },
    maxLoginAttempts: { type: Number, default: 5, min: 3, max: 10 },
    passwordExpiryDays: { type: Number, default: 90, min: 30, max: 180 },
    twoFactorAuth: { type: Boolean, default: false },
    ipWhitelist: { type: [String], default: [] }
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Email Settings Schema
const emailSettingsSchema = new mongoose.Schema({
  smtp: {
    host: { type: String, default: '', trim: true },
    port: { type: Number, default: 587, min: 1, max: 65535 },
    secure: { type: Boolean, default: true },
    auth: {
      user: { type: String, default: '', trim: true },
      pass: { type: String, default: '' }
    }
  },
  from: {
    email: { type: String, default: '', lowercase: true, trim: true },
    name: { type: String, default: 'FMS Enterprise', trim: true }
  },
  templates: {
    welcome: { type: Boolean, default: true },
    taskAssignment: { type: Boolean, default: true },
    taskCompletion: { type: Boolean, default: true },
    leaveApproval: { type: Boolean, default: true },
    payrollSlip: { type: Boolean, default: true },
    complaintUpdate: { type: Boolean, default: true }
  },
  notifications: {
    sendOnTaskAssign: { type: Boolean, default: true },
    sendOnTaskComplete: { type: Boolean, default: true },
    sendOnLeaveApproval: { type: Boolean, default: true },
    sendOnPayroll: { type: Boolean, default: true },
    sendDailyDigest: { type: Boolean, default: false },
    digestTime: { type: String, default: '09:00', match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ }
  },
  testEmail: { type: String, default: '', lowercase: true, trim: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Integration Settings Schema
const integrationSettingsSchema = new mongoose.Schema({
  slack: {
    enabled: { type: Boolean, default: false },
    webhookUrl: { type: String, default: '', trim: true },
    channel: { type: String, default: '#notifications', trim: true }
  },
  teams: {
    enabled: { type: Boolean, default: false },
    webhookUrl: { type: String, default: '', trim: true }
  },
  whatsapp: {
    enabled: { type: Boolean, default: false },
    apiKey: { type: String, default: '' },
    phoneNumberId: { type: String, default: '', trim: true }
  },
  googleCalendar: {
    enabled: { type: Boolean, default: false },
    apiKey: { type: String, default: '' },
    calendarId: { type: String, default: '', trim: true }
  },
  zapier: {
    enabled: { type: Boolean, default: false },
    webhookUrl: { type: String, default: '', trim: true }
  },
  webhooks: {
    taskCreated: { type: String, default: '', trim: true },
    taskCompleted: { type: String, default: '', trim: true },
    complaintRaised: { type: String, default: '', trim: true },
    leaveApplied: { type: String, default: '', trim: true }
  },
  apiKeys: [{
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true },
    permissions: [{ type: String, enum: ['read', 'write', 'admin'] }],
    expiresAt: { type: Date },
    lastUsed: { type: Date },
    createdAt: { type: Date, default: Date.now }
  }],
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Notification Settings Schema
const notificationSettingsSchema = new mongoose.Schema({
  channels: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    inApp: { type: Boolean, default: true }
  },
  taskNotifications: {
    onAssign: { type: Boolean, default: true },
    onAccept: { type: Boolean, default: true },
    onStart: { type: Boolean, default: true },
    onComplete: { type: Boolean, default: true },
    onVerify: { type: Boolean, default: true },
    onReject: { type: Boolean, default: true },
    onOverdue: { type: Boolean, default: true }
  },
  leaveNotifications: {
    onApply: { type: Boolean, default: true },
    onApproval: { type: Boolean, default: true },
    onRejection: { type: Boolean, default: true },
    onCancellation: { type: Boolean, default: true }
  },
  complaintNotifications: {
    onRaise: { type: Boolean, default: true },
    onAssign: { type: Boolean, default: true },
    onResolve: { type: Boolean, default: true },
    onFeedback: { type: Boolean, default: true }
  },
  attendanceNotifications: {
    onCheckIn: { type: Boolean, default: false },
    onCheckOut: { type: Boolean, default: false },
    onLate: { type: Boolean, default: true },
    onAbsent: { type: Boolean, default: true },
    onLeaveRequest: { type: Boolean, default: true }
  },
  payrollNotifications: {
    onSalaryGenerated: { type: Boolean, default: true },
    onSalaryApproved: { type: Boolean, default: true },
    onSalaryPaid: { type: Boolean, default: true },
    onSlipReady: { type: Boolean, default: true }
  },
  systemNotifications: {
    onMaintenance: { type: Boolean, default: true },
    onUpdate: { type: Boolean, default: true },
    onBackup: { type: Boolean, default: true },
    onAlert: { type: Boolean, default: true }
  },
  quietHours: {
    enabled: { type: Boolean, default: false },
    start: { type: String, default: '22:00', match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    end: { type: String, default: '07:00', match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    timezone: { type: String, default: 'Asia/Dubai' }
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// System Settings Schema
const systemSettingsSchema = new mongoose.Schema({
  system: {
    systemName: { type: String, default: '', trim: true },
    systemUrl: { type: String, default: '', trim: true },
    supportEmail: { type: String, default: '', lowercase: true, trim: true },
    supportPhone: { type: String, default: '', trim: true },
    maintenanceMode: { type: Boolean, default: false },
    debugMode: { type: Boolean, default: false }
  },
  integrations: {
    smtp: {
      enabled: { type: Boolean, default: false },
      host: { type: String, default: '', trim: true },
      port: { type: Number, default: 587 },
      secure: { type: Boolean, default: true },
      username: { type: String, default: '', trim: true },
      password: { type: String, default: '' },
      fromEmail: { type: String, default: '', lowercase: true, trim: true },
      fromName: { type: String, default: '', trim: true }
    },
    sms: {
      enabled: { type: Boolean, default: false },
      provider: { type: String, default: 'twilio', enum: ['twilio', 'nexmo', 'aws'] },
      apiKey: { type: String, default: '' },
      apiSecret: { type: String, default: '' },
      senderId: { type: String, default: '', trim: true }
    },
    payment: {
      enabled: { type: Boolean, default: false },
      provider: { type: String, default: 'stripe', enum: ['stripe', 'paypal', 'razorpay'] },
      apiKey: { type: String, default: '' },
      webhookSecret: { type: String, default: '' }
    }
  },
  performance: {
    cacheEnabled: { type: Boolean, default: true },
    cacheDuration: { type: Number, default: 3600, min: 60, max: 86400 },
    maxUploadSize: { type: Number, default: 10, min: 1, max: 100 },
    allowedFileTypes: { type: [String], default: ['jpg', 'png', 'pdf', 'doc', 'xlsx'] },
    compressionEnabled: { type: Boolean, default: true }
  },
  logs: {
    retentionDays: { type: Number, default: 30, min: 7, max: 365 },
    logLevel: { type: String, default: 'info', enum: ['debug', 'info', 'warn', 'error'] },
    auditLogEnabled: { type: Boolean, default: true },
    errorLogEnabled: { type: Boolean, default: true }
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Theme Settings Schema
const themeSettingsSchema = new mongoose.Schema({
  theme: {
    mode: { type: String, default: 'light', enum: ['light', 'dark', 'system'] },
    primaryColor: { type: String, default: '#3B82F6', match: /^#[0-9A-Fa-f]{6}$/ },
    secondaryColor: { type: String, default: '#10B981', match: /^#[0-9A-Fa-f]{6}$/ },
    accentColor: { type: String, default: '#8B5CF6', match: /^#[0-9A-Fa-f]{6}$/ },
    dangerColor: { type: String, default: '#EF4444', match: /^#[0-9A-Fa-f]{6}$/ },
    warningColor: { type: String, default: '#F59E0B', match: /^#[0-9A-Fa-f]{6}$/ },
    successColor: { type: String, default: '#10B981', match: /^#[0-9A-Fa-f]{6}$/ },
    infoColor: { type: String, default: '#06B6D4', match: /^#[0-9A-Fa-f]{6}$/ }
  },
  layout: {
    sidebarCollapsed: { type: Boolean, default: false },
    compactMode: { type: Boolean, default: false },
    showBreadcrumbs: { type: Boolean, default: true },
    showNotifications: { type: Boolean, default: true },
    fixedHeader: { type: Boolean, default: true },
    boxedLayout: { type: Boolean, default: false }
  },
  font: {
    family: { type: String, default: 'Inter', enum: ['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Montserrat', 'Nunito'] },
    size: { type: String, default: 'medium', enum: ['small', 'medium', 'large'] }
  },
  animations: {
    enabled: { type: Boolean, default: true },
    duration: { type: String, default: 'normal', enum: ['fast', 'normal', 'slow'] }
  },
  customization: {
    roundedCorners: { type: String, default: 'medium', enum: ['none', 'small', 'medium', 'large'] },
    cardShadow: { type: String, default: 'medium', enum: ['none', 'small', 'medium', 'large'] },
    borderWidth: { type: String, default: 'normal', enum: ['thin', 'normal', 'thick'] }
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Backup Schema
const backupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  size: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ['manual', 'auto'], default: 'manual' },
  path: { type: String, required: true, trim: true },
  createdBy: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for better performance
settingsSchema.index({ updatedAt: -1 });
emailSettingsSchema.index({ updatedAt: -1 });
notificationSettingsSchema.index({ updatedAt: -1 });
integrationSettingsSchema.index({ updatedAt: -1 });
systemSettingsSchema.index({ updatedAt: -1 });
themeSettingsSchema.index({ updatedAt: -1 });
backupSchema.index({ createdAt: -1 });
backupSchema.index({ type: 1 });

// Pre-save middleware for debugging
const addDebugMiddleware = (schema, name) => {
  schema.pre('save', function(next) {
    debugLog(`Saving ${name}:`, { id: this._id, isNew: this.isNew });
    next();
  });
  
  schema.post('save', function(doc) {
    debugLog(`${name} saved successfully:`, doc._id);
  });
  
  schema.post('findOne', function(doc) {
    if (doc) {
      debugLog(`${name} found:`, doc._id);
    } else {
      debugLog(`${name} not found`);
    }
  });
};

addDebugMiddleware(settingsSchema, 'Settings');
addDebugMiddleware(emailSettingsSchema, 'EmailSettings');
addDebugMiddleware(notificationSettingsSchema, 'NotificationSettings');
addDebugMiddleware(integrationSettingsSchema, 'IntegrationSettings');
addDebugMiddleware(systemSettingsSchema, 'SystemSettings');
addDebugMiddleware(themeSettingsSchema, 'ThemeSettings');
addDebugMiddleware(backupSchema, 'Backup');

module.exports = {
  Settings: mongoose.model('Settings', settingsSchema),
  EmailSettings: mongoose.model('EmailSettings', emailSettingsSchema),
  IntegrationSettings: mongoose.model('IntegrationSettings', integrationSettingsSchema),
  NotificationSettings: mongoose.model('NotificationSettings', notificationSettingsSchema),
  SystemSettings: mongoose.model('SystemSettings', systemSettingsSchema),
  ThemeSettings: mongoose.model('ThemeSettings', themeSettingsSchema),
  Backup: mongoose.model('Backup', backupSchema)
};