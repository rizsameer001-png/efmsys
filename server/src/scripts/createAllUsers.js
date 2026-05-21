// server/src/scripts/createAllUsers.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../src/models/User.model');

// Your MongoDB URI - UPDATE WITH YOUR ACTUAL PASSWORD
const mongoURI = 'mongodb+srv://rizsameer001_db_user:apyzUNvvS0p0318K@cluster0.xbnnnsq.mongodb.net/fmsnew3?appName=Cluster0';

const newUsers = [
  // ==================== SUPER ADMIN ====================
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'super.adm@fms.com',
    phone: '+971501234509',
    employeeId: 'SUP002',
    role: 'super_admin',
    department: 'management',
    designation: 'System Administrator',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  
  // ==================== ADMIN ====================
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@fms.com',
    phone: '+971501230570',
    employeeId: 'ADM001',
    role: 'admin',
    department: 'management',
    designation: 'Administrator',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  {
    firstName: 'Operations',
    lastName: 'Admin',
    email: 'operations.admin@fms.com',
    phone: '+971501234571',
    employeeId: 'ADM002',
    role: 'admin',
    department: 'operations',
    designation: 'Operations Administrator',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  
  // ==================== MANAGERS ====================
  {
    firstName: 'Technical',
    lastName: 'Manager',
    email: 'technical.manager@fms.com',
    phone: '+971501234572',
    employeeId: 'MGR001',
    role: 'manager',
    department: 'technical',
    designation: 'Technical Manager',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  {
    firstName: 'Operations',
    lastName: 'Manager',
    email: 'operations.manager@fms.com',
    phone: '+971501234573',
    employeeId: 'MGR002',
    role: 'manager',
    department: 'operations',
    designation: 'Operations Manager',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  {
    firstName: 'Facility',
    lastName: 'Manager',
    email: 'facility.manager@fms.com',
    phone: '+971501234574',
    employeeId: 'MGR003',
    role: 'manager',
    department: 'management',
    designation: 'Facility Manager',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  
  // ==================== SUPERVISORS ====================
  {
    firstName: 'Technical',
    lastName: 'Supervisor',
    email: 'technical.supervisor@fms.com',
    phone: '+971501234575',
    employeeId: 'SUP001',
    role: 'supervisor',
    department: 'technical',
    designation: 'Technical Supervisor',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  {
    firstName: 'Field',
    lastName: 'Supervisor',
    email: 'field.supervisor@fms.com',
    phone: '+971501234576',
    employeeId: 'SUP002',
    role: 'supervisor',
    department: 'operations',
    designation: 'Field Supervisor',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  {
    firstName: 'Security',
    lastName: 'Supervisor',
    email: 'security.supervisor@fms.com',
    phone: '+971501234577',
    employeeId: 'SUP003',
    role: 'supervisor',
    department: 'security',
    designation: 'Security Supervisor',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  {
    firstName: 'Housekeeping',
    lastName: 'Supervisor',
    email: 'housekeeping.supervisor@fms.com',
    phone: '+971501234578',
    employeeId: 'SUP004',
    role: 'supervisor',
    department: 'housekeeping',
    designation: 'Housekeeping Supervisor',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  
  // ==================== TECHNICIANS (only if not exist) ====================
  {
    firstName: 'Amit',
    lastName: 'Sharma',
    email: 'amit.sharma@fms.com',
    phone: '+971501234567',
    employeeId: 'TECH0011',
    role: 'technician',
    department: 'technical',
    designation: 'Senior Technician',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  {
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@fms.com',
    phone: '+971507654321',
    employeeId: 'TECH002',
    role: 'technician',
    department: 'technical',
    designation: 'Technician',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  {
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@fms.com',
    phone: '+971508765432',
    employeeId: 'TECH003',
    role: 'technician',
    department: 'technical',
    designation: 'Electrician',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  {
    firstName: 'Ajay',
    lastName: 'Sharma',
    email: 'ajay.sharma@fms.com',
    phone: '+971509876543',
    employeeId: 'TECH005',
    role: 'technician',
    department: 'technical',
    designation: 'Senior Technician',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  {
    firstName: 'Ravi',
    lastName: 'Kumar',
    email: 'ravi.kumar@fms.com',
    phone: '+971501234579',
    employeeId: 'TECH006',
    role: 'technician',
    department: 'technical',
    designation: 'HVAC Technician',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  {
    firstName: 'Sunil',
    lastName: 'Verma',
    email: 'sunil.verma@fms.com',
    phone: '+971501234580',
    employeeId: 'TECH007',
    role: 'technician',
    department: 'technical',
    designation: 'Plumber',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  
  // ==================== HR ====================
  {
    firstName: 'HR',
    lastName: 'Manager',
    email: 'hr.manager@fms.com',
    phone: '+971501234581',
    employeeId: 'HR001',
    role: 'hr',
    department: 'hr',
    designation: 'HR Manager',
    status: 'active',
    isActive: true,
    chatEnabled: true
  },
  
  // ==================== ACCOUNTANT ====================
  {
    firstName: 'Finance',
    lastName: 'Accountant',
    email: 'finance.accountant@fms.com',
    phone: '+971501234582',
    employeeId: 'ACC001',
    role: 'accountant',
    department: 'finance',
    designation: 'Senior Accountant',
    status: 'active',
    isActive: true,
    chatEnabled: true
  }
];

async function createAllUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    // Get existing users first (to avoid overwriting)
    const existingUsers = await User.find({});
    const existingEmails = new Set(existingUsers.map(u => u.email));
    const existingEmployeeIds = new Set(existingUsers.map(u => u.employeeId).filter(id => id));
    
    console.log(`📊 Existing users in database: ${existingUsers.length}`);
    console.log(`📊 New users to attempt: ${newUsers.length}\n`);

    let createdCount = 0;
    let skippedCount = 0;
    let byRole = {
      super_admin: 0,
      admin: 0,
      manager: 0,
      supervisor: 0,
      technician: 0,
      hr: 0,
      accountant: 0
    };

    for (const user of newUsers) {
      // Check if user already exists by email OR employeeId
      const exists = existingEmails.has(user.email) || existingEmployeeIds.has(user.employeeId);
      
      if (!exists) {
        const hashedPassword = await bcrypt.hash('Welcome@123', 10);
        const newUser = new User({ 
          ...user, 
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        await newUser.save();
        console.log(`✅ CREATED: ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
        createdCount++;
        byRole[user.role]++;
        
        // Add to existing sets to prevent duplicate in same run
        existingEmails.add(user.email);
        existingEmployeeIds.add(user.employeeId);
      } else {
        console.log(`⏭️ SKIPPED: ${user.firstName} ${user.lastName} (${user.email}) - Already exists`);
        skippedCount++;
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ New Users Created: ${createdCount}`);
    console.log(`   ⏭️ Skipped (already exist): ${skippedCount}`);
    console.log(`   📊 Total processed: ${newUsers.length}`);
    
    if (createdCount > 0) {
      console.log(`\n   By Role (new users only):`);
      console.log(`   - Super Admin: ${byRole.super_admin}`);
      console.log(`   - Admin: ${byRole.admin}`);
      console.log(`   - Manager: ${byRole.manager}`);
      console.log(`   - Supervisor: ${byRole.supervisor}`);
      console.log(`   - Technician: ${byRole.technician}`);
      console.log(`   - HR: ${byRole.hr}`);
      console.log(`   - Accountant: ${byRole.accountant}`);
    }
    
    // Show all existing users after operation
    const finalUsers = await User.find({});
    console.log(`\n📊 Final total users in database: ${finalUsers.length}`);
    
    console.log('\n📋 Login Credentials for NEW users:');
    console.log('   Password for all: Welcome@123\n');
    
    if (byRole.super_admin > 0) console.log('   Super Admin: super.admin@fms.com');
    if (byRole.admin > 0) {
      console.log('   Admins:');
      if (byRole.admin >= 1) console.log('   - admin@fms.com');
      if (byRole.admin >= 2) console.log('   - operations.admin@fms.com');
    }
    if (byRole.manager > 0) {
      console.log('   Managers:');
      if (byRole.manager >= 1) console.log('   - technical.manager@fms.com');
      if (byRole.manager >= 2) console.log('   - operations.manager@fms.com');
      if (byRole.manager >= 3) console.log('   - facility.manager@fms.com');
    }
    if (byRole.supervisor > 0) {
      console.log('   Supervisors:');
      if (byRole.supervisor >= 1) console.log('   - technical.supervisor@fms.com');
      if (byRole.supervisor >= 2) console.log('   - field.supervisor@fms.com');
      if (byRole.supervisor >= 3) console.log('   - security.supervisor@fms.com');
      if (byRole.supervisor >= 4) console.log('   - housekeeping.supervisor@fms.com');
    }
    if (byRole.technician > 0) {
      console.log('   Technicians:');
      console.log('   - amit.sharma@fms.com, rajesh.kumar@fms.com, vikram.singh@fms.com');
    }
    
    console.log('\n✅ Operation completed successfully!');
    console.log('⚠️ Existing data remains unchanged.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`   ${key}: ${error.errors[key].message}`);
      });
    }
    process.exit(1);
  }
}

createAllUsers();