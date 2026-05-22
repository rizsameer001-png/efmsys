const mongoose = require('mongoose');
require('dotenv').config();

const {
  Settings,
  EmailSettings,
  IntegrationSettings,
  NotificationSettings,
  SystemSettings,
  ThemeSettings,
  Backup
} = require('../models/Settings.model');

// Connect to database
const connectDB = require('../config/database');

const seedSettings = async () => {
  try {
    console.log('\n🌱 SAFE SEEDING - Preserving Existing Data...\n');
    console.log('='.repeat(60));

    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // ==================== GENERAL SETTINGS ====================
    console.log('\n📝 Checking General Settings...');
    
    let generalSettings = await Settings.findOne();
    if (!generalSettings) {
      console.log('   No general settings found. Creating default...');
      generalSettings = new Settings({
        company: {
          name: 'FMS Enterprise',
          logo: '',
          email: 'admin@fmsenterprise.com',
          phone: '+971 4 123 4567',
          website: 'https://fmsenterprise.com',
          address: '123 Business Bay',
          city: 'Dubai',
          country: 'UAE',
          taxId: '123456789',
          registrationNumber: 'REG123456'
        },
        branding: {
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981',
          logoUrl: '',
          faviconUrl: '',
          companyTagline: 'Your Trusted Facility Management Partner'
        },
        localization: {
          defaultLanguage: 'en',
          defaultTimezone: 'Asia/Dubai',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          currency: 'AED',
          currencySymbol: 'AED'
        },
        notification: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          taskAssignmentAlerts: true,
          leaveApprovalAlerts: true,
          attendanceReminders: true,
          salarySlipAlerts: true,
          dailyDigest: false
        },
        security: {
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          passwordExpiryDays: 90,
          twoFactorAuth: false,
          ipWhitelist: []
        }
      });
      
      await generalSettings.save();
      console.log('   ✅ General Settings created');
    } else {
      console.log('   ✅ General Settings already exist (preserved)');
      console.log(`   Company: ${generalSettings.company.name}`);
      console.log(`   Email: ${generalSettings.company.email}`);
    }

    // ==================== EMAIL SETTINGS ====================
    console.log('\n📝 Checking Email Settings...');
    
    let emailSettings = await EmailSettings.findOne();
    if (!emailSettings) {
      console.log('   No email settings found. Creating default...');
      emailSettings = new EmailSettings({
        smtp: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: true,
          auth: {
            user: '',
            pass: ''
          }
        },
        from: {
          email: 'noreply@fmsenterprise.com',
          name: 'FMS Enterprise'
        },
        templates: {
          welcome: true,
          taskAssignment: true,
          taskCompletion: true,
          leaveApproval: true,
          payrollSlip: true,
          complaintUpdate: true
        },
        notifications: {
          sendOnTaskAssign: true,
          sendOnTaskComplete: true,
          sendOnLeaveApproval: true,
          sendOnPayroll: true,
          sendDailyDigest: false,
          digestTime: '09:00'
        }
      });
      
      await emailSettings.save();
      console.log('   ✅ Email Settings created');
    } else {
      console.log('   ✅ Email Settings already exist (preserved)');
      console.log(`   SMTP Host: ${emailSettings.smtp.host || 'Not configured'}`);
    }

    // ==================== NOTIFICATION SETTINGS ====================
    console.log('\n📝 Checking Notification Settings...');
    
    let notificationSettings = await NotificationSettings.findOne();
    if (!notificationSettings) {
      console.log('   No notification settings found. Creating default...');
      notificationSettings = new NotificationSettings({
        channels: {
          email: true,
          push: true,
          sms: false,
          inApp: true
        },
        taskNotifications: {
          onAssign: true,
          onAccept: true,
          onStart: true,
          onComplete: true,
          onVerify: true,
          onReject: true,
          onOverdue: true
        },
        leaveNotifications: {
          onApply: true,
          onApproval: true,
          onRejection: true,
          onCancellation: true
        },
        complaintNotifications: {
          onRaise: true,
          onAssign: true,
          onResolve: true,
          onFeedback: true
        },
        attendanceNotifications: {
          onCheckIn: false,
          onCheckOut: false,
          onLate: true,
          onAbsent: true,
          onLeaveRequest: true
        },
        payrollNotifications: {
          onSalaryGenerated: true,
          onSalaryApproved: true,
          onSalaryPaid: true,
          onSlipReady: true
        },
        systemNotifications: {
          onMaintenance: true,
          onUpdate: true,
          onBackup: true,
          onAlert: true
        },
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '07:00',
          timezone: 'Asia/Dubai'
        }
      });
      
      await notificationSettings.save();
      console.log('   ✅ Notification Settings created');
    } else {
      console.log('   ✅ Notification Settings already exist (preserved)');
    }

    // ==================== INTEGRATION SETTINGS ====================
    console.log('\n📝 Checking Integration Settings...');
    
    let integrationSettings = await IntegrationSettings.findOne();
    if (!integrationSettings) {
      console.log('   No integration settings found. Creating default...');
      integrationSettings = new IntegrationSettings({
        slack: {
          enabled: false,
          webhookUrl: '',
          channel: '#notifications'
        },
        teams: {
          enabled: false,
          webhookUrl: ''
        },
        whatsapp: {
          enabled: false,
          apiKey: '',
          phoneNumberId: ''
        },
        googleCalendar: {
          enabled: false,
          apiKey: '',
          calendarId: ''
        },
        zapier: {
          enabled: false,
          webhookUrl: ''
        },
        webhooks: {
          taskCreated: '',
          taskCompleted: '',
          complaintRaised: '',
          leaveApplied: ''
        },
        apiKeys: []
      });
      
      await integrationSettings.save();
      console.log('   ✅ Integration Settings created');
    } else {
      console.log('   ✅ Integration Settings already exist (preserved)');
      console.log(`   API Keys count: ${integrationSettings.apiKeys?.length || 0}`);
    }

    // ==================== SYSTEM SETTINGS ====================
    console.log('\n📝 Checking System Settings...');
    
    let systemSettings = await SystemSettings.findOne();
    if (!systemSettings) {
      console.log('   No system settings found. Creating default...');
      systemSettings = new SystemSettings({
        system: {
          systemName: 'FMS Enterprise',
          systemUrl: 'https://fmsenterprise.com',
          supportEmail: 'support@fmsenterprise.com',
          supportPhone: '+971 4 123 4567',
          maintenanceMode: false,
          debugMode: false
        },
        integrations: {
          smtp: {
            enabled: false,
            host: '',
            port: 587,
            secure: true,
            username: '',
            password: '',
            fromEmail: '',
            fromName: ''
          },
          sms: {
            enabled: false,
            provider: 'twilio',
            apiKey: '',
            apiSecret: '',
            senderId: ''
          },
          payment: {
            enabled: false,
            provider: 'stripe',
            apiKey: '',
            webhookSecret: ''
          }
        },
        performance: {
          cacheEnabled: true,
          cacheDuration: 3600,
          maxUploadSize: 10,
          allowedFileTypes: ['jpg', 'png', 'pdf', 'doc', 'xlsx'],
          compressionEnabled: true
        },
        logs: {
          retentionDays: 30,
          logLevel: 'info',
          auditLogEnabled: true,
          errorLogEnabled: true
        }
      });
      
      await systemSettings.save();
      console.log('   ✅ System Settings created');
    } else {
      console.log('   ✅ System Settings already exist (preserved)');
      console.log(`   System Name: ${systemSettings.system.systemName}`);
      console.log(`   Maintenance Mode: ${systemSettings.system.maintenanceMode}`);
    }

    // ==================== THEME SETTINGS ====================
    console.log('\n📝 Checking Theme Settings...');
    
    let themeSettings = await ThemeSettings.findOne();
    if (!themeSettings) {
      console.log('   No theme settings found. Creating default...');
      themeSettings = new ThemeSettings({
        theme: {
          mode: 'light',
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981',
          accentColor: '#8B5CF6',
          dangerColor: '#EF4444',
          warningColor: '#F59E0B',
          successColor: '#10B981',
          infoColor: '#06B6D4'
        },
        layout: {
          sidebarCollapsed: false,
          compactMode: false,
          showBreadcrumbs: true,
          showNotifications: true,
          fixedHeader: true,
          boxedLayout: false
        },
        font: {
          family: 'Inter',
          size: 'medium'
        },
        animations: {
          enabled: true,
          duration: 'normal'
        },
        customization: {
          roundedCorners: 'medium',
          cardShadow: 'medium',
          borderWidth: 'normal'
        }
      });
      
      await themeSettings.save();
      console.log('   ✅ Theme Settings created');
    } else {
      console.log('   ✅ Theme Settings already exist (preserved)');
      console.log(`   Theme Mode: ${themeSettings.theme.mode}`);
      console.log(`   Primary Color: ${themeSettings.theme.primaryColor}`);
    }

    // ==================== BACKUPS (Optional - won't delete existing) ====================
    console.log('\n📝 Checking Backups...');
    
    const existingBackupsCount = await Backup.countDocuments();
    console.log(`   Existing backups: ${existingBackupsCount}`);
    
    // Only create a sample backup if NO backups exist at all
    if (existingBackupsCount === 0) {
      console.log('   No backups found. Creating a sample backup...');
      const sampleBackup = new Backup({
        name: `sample_backup_${new Date().toISOString().split('T')[0]}.zip`,
        size: 2048576,
        type: 'manual',
        path: `/backups/sample_backup_${Date.now()}.zip`,
        createdBy: 'System Seed',
        createdAt: new Date()
      });
      
      await sampleBackup.save();
      console.log('   ✅ Sample Backup created');
    } else {
      console.log('   ✅ Backups already exist (preserved)');
    }

    // ==================== SUMMARY ====================
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ SAFE SEEDING COMPLETED!');
    console.log('\n📊 Final Summary:');
    console.log(`   - General Settings: ${await Settings.countDocuments()} (preserved existing)`);
    console.log(`   - Email Settings: ${await EmailSettings.countDocuments()} (preserved existing)`);
    console.log(`   - Notification Settings: ${await NotificationSettings.countDocuments()} (preserved existing)`);
    console.log(`   - Integration Settings: ${await IntegrationSettings.countDocuments()} (preserved existing)`);
    console.log(`   - System Settings: ${await SystemSettings.countDocuments()} (preserved existing)`);
    console.log(`   - Theme Settings: ${await ThemeSettings.countDocuments()} (preserved existing)`);
    console.log(`   - Backups: ${await Backup.countDocuments()} (preserved existing)`);
    
    console.log('\n💡 No existing data was modified or deleted!');
    console.log('   Only missing settings were created.\n');

  } catch (error) {
    console.error('\n❌ Error during seeding:', error.message);
    console.error(error.stack);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed\n');
    process.exit(0);
  }
};

// Run the seeder
seedSettings();