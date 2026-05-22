const mongoose = require('mongoose');

// General Settings Schema
const settingsSchema = new mongoose.Schema({
  company: {
    name: { type: String, default: '' },
    logo: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    website: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    taxId: { type: String, default: '' },
    registrationNumber: { type: String, default: '' }
  },
  branding: {
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#10B981' },
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    companyTagline: { type: String, default: '' }
  },
  localization: {
    defaultLanguage: { type: String, default: 'en' },
    defaultTimezone: { type: String, default: 'Asia/Dubai' },
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
    timeFormat: { type: String, default: '24h' },
    currency: { type: String, default: 'AED' },
    currencySymbol: { type: String, default: 'AED' }
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
    sessionTimeout: { type: Number, default: 30 },
    maxLoginAttempts: { type: Number, default: 5 },
    passwordExpiryDays: { type: Number, default: 90 },
    twoFactorAuth: { type: Boolean, default: false },
    ipWhitelist: { type: [String], default: [] }
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Email Settings Schema
const emailSettingsSchema = new mongoose.Schema({
  smtp: {
    host: { type: String, default: '' },
    port: { type: Number, default: 587 },
    secure: { type: Boolean, default: true },
    auth: {
      user: { type: String, default: '' },
      pass: { type: String, default: '' }
    }
  },
  from: {
    email: { type: String, default: '' },
    name: { type: String, default: 'FMS Enterprise' }
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
    digestTime: { type: String, default: '09:00' }
  },
  testEmail: { type: String, default: '' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Integration Settings Schema
const integrationSettingsSchema = new mongoose.Schema({
  slack: {
    enabled: { type: Boolean, default: false },
    webhookUrl: { type: String, default: '' },
    channel: { type: String, default: '#notifications' }
  },
  teams: {
    enabled: { type: Boolean, default: false },
    webhookUrl: { type: String, default: '' }
  },
  whatsapp: {
    enabled: { type: Boolean, default: false },
    apiKey: { type: String, default: '' },
    phoneNumberId: { type: String, default: '' }
  },
  googleCalendar: {
    enabled: { type: Boolean, default: false },
    apiKey: { type: String, default: '' },
    calendarId: { type: String, default: '' }
  },
  zapier: {
    enabled: { type: Boolean, default: false },
    webhookUrl: { type: String, default: '' }
  },
  webhooks: {
    taskCreated: { type: String, default: '' },
    taskCompleted: { type: String, default: '' },
    complaintRaised: { type: String, default: '' },
    leaveApplied: { type: String, default: '' }
  },
  apiKeys: [{
    name: { type: String, required: true },
    key: { type: String, required: true },
    permissions: [{ type: String }],
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
    start: { type: String, default: '22:00' },
    end: { type: String, default: '07:00' },
    timezone: { type: String, default: 'Asia/Dubai' }
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// System Settings Schema
const systemSettingsSchema = new mongoose.Schema({
  system: {
    systemName: { type: String, default: '' },
    systemUrl: { type: String, default: '' },
    supportEmail: { type: String, default: '' },
    supportPhone: { type: String, default: '' },
    maintenanceMode: { type: Boolean, default: false },
    debugMode: { type: Boolean, default: false }
  },
  integrations: {
    smtp: {
      enabled: { type: Boolean, default: false },
      host: { type: String, default: '' },
      port: { type: Number, default: 587 },
      secure: { type: Boolean, default: true },
      username: { type: String, default: '' },
      password: { type: String, default: '' },
      fromEmail: { type: String, default: '' },
      fromName: { type: String, default: '' }
    },
    sms: {
      enabled: { type: Boolean, default: false },
      provider: { type: String, default: 'twilio' },
      apiKey: { type: String, default: '' },
      apiSecret: { type: String, default: '' },
      senderId: { type: String, default: '' }
    },
    payment: {
      enabled: { type: Boolean, default: false },
      provider: { type: String, default: 'stripe' },
      apiKey: { type: String, default: '' },
      webhookSecret: { type: String, default: '' }
    }
  },
  performance: {
    cacheEnabled: { type: Boolean, default: true },
    cacheDuration: { type: Number, default: 3600 },
    maxUploadSize: { type: Number, default: 10 },
    allowedFileTypes: { type: [String], default: ['jpg', 'png', 'pdf', 'doc', 'xlsx'] },
    compressionEnabled: { type: Boolean, default: true }
  },
  logs: {
    retentionDays: { type: Number, default: 30 },
    logLevel: { type: String, default: 'info' },
    auditLogEnabled: { type: Boolean, default: true },
    errorLogEnabled: { type: Boolean, default: true }
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Theme Settings Schema
const themeSettingsSchema = new mongoose.Schema({
  theme: {
    mode: { type: String, default: 'light' },
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#10B981' },
    accentColor: { type: String, default: '#8B5CF6' },
    dangerColor: { type: String, default: '#EF4444' },
    warningColor: { type: String, default: '#F59E0B' },
    successColor: { type: String, default: '#10B981' },
    infoColor: { type: String, default: '#06B6D4' }
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
    family: { type: String, default: 'Inter' },
    size: { type: String, default: 'medium' }
  },
  animations: {
    enabled: { type: Boolean, default: true },
    duration: { type: String, default: 'normal' }
  },
  customization: {
    roundedCorners: { type: String, default: 'medium' },
    cardShadow: { type: String, default: 'medium' },
    borderWidth: { type: String, default: 'normal' }
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Backup Schema
const backupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, enum: ['manual', 'auto'], default: 'manual' },
  path: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  Settings: mongoose.model('Settings', settingsSchema),
  EmailSettings: mongoose.model('EmailSettings', emailSettingsSchema),
  IntegrationSettings: mongoose.model('IntegrationSettings', integrationSettingsSchema),
  NotificationSettings: mongoose.model('NotificationSettings', notificationSettingsSchema),
  SystemSettings: mongoose.model('SystemSettings', systemSettingsSchema),
  ThemeSettings: mongoose.model('ThemeSettings', themeSettingsSchema),
  Backup: mongoose.model('Backup', backupSchema)
};