/**
 * COMPLETE DATABASE SEEDER
 * Seeds all users with different roles
 * Run with: npm run seed
 * Reset with: npm run seed:reset
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

// Flag to check if we should reset (clear existing users except super_admin)
const shouldReset = process.argv.includes('--reset');

console.log('Loading .env file...');
require('dotenv').config();
console.log('MONGODB_URI exists?', !!process.env.MONGODB_URI);
console.log('First few chars:', process.env.MONGODB_URI?.substring(0, 30));

// Complete user data for all roles
const users = [
  // ==================== ADMIN ROLES ====================
  {
    name: 'Super Admin',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@fms.com',
    phone: '9999999901',
    password: 'SuperAdmin@123',
    role: 'super_admin',
    employeeId: 'SA001',
    department: 'Administration',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '09:00', end: '17:00' }
  },
  {
    name: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@fms.com',
    phone: '9999999902',
    password: 'Admin@123',
    role: 'admin',
    employeeId: 'ADM001',
    department: 'Administration',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '09:00', end: '17:00' }
  },
  
  // ==================== MANAGEMENT ROLES ====================
  {
    name: 'Building Manager',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'manager@fms.com',
    phone: '9999999903',
    password: 'Manager@123',
    role: 'manager',
    employeeId: 'MGR001',
    department: 'Facility Management',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '09:30', end: '17:30' }
  },
  {
    name: 'Operations Manager',
    firstName: 'Sunil',
    lastName: 'Reddy',
    email: 'opmanager@fms.com',
    phone: '9999999913',
    password: 'OpManager@123',
    role: 'manager',
    employeeId: 'MGR002',
    department: 'Operations',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '09:00', end: '18:00' }
  },
  
  // ==================== SUPERVISOR ROLES ====================
  {
    name: 'Team Supervisor',
    firstName: 'Priya',
    lastName: 'Singh',
    email: 'supervisor@fms.com',
    phone: '9999999904',
    password: 'Supervisor@123',
    role: 'supervisor',
    employeeId: 'SPV001',
    department: 'Operations',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '09:00', end: '18:00' }
  },
  {
    name: 'Maintenance Supervisor',
    firstName: 'Rakesh',
    lastName: 'Verma',
    email: 'maint-supervisor@fms.com',
    phone: '9999999914',
    password: 'MaintSup@123',
    role: 'supervisor',
    employeeId: 'SPV002',
    department: 'Maintenance',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '08:00', end: '17:00' }
  },
  
  // ==================== TECHNICIAN ROLES ====================
  {
    name: 'Senior Electrician',
    firstName: 'Amit',
    lastName: 'Sharma',
    email: 'technician@fms.com',
    phone: '9999999905',
    password: 'Technician@123',
    role: 'technician',
    employeeId: 'TECH001',
    department: 'Maintenance',
    technicianType: 'electrician',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '08:00', end: '17:00' }
  },
  {
    name: 'Plumbing Technician',
    firstName: 'Suresh',
    lastName: 'Patel',
    email: 'plumber@fms.com',
    phone: '9999999906',
    password: 'Plumber@123',
    role: 'technician',
    employeeId: 'TECH002',
    department: 'Maintenance',
    technicianType: 'plumbing',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '09:00', end: '18:00' }
  },
  {
    name: 'HVAC Technician',
    firstName: 'Vikram',
    lastName: 'Reddy',
    email: 'hvac@fms.com',
    phone: '9999999907',
    password: 'HVAC@123',
    role: 'technician',
    employeeId: 'TECH003',
    department: 'Maintenance',
    technicianType: 'hvac',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '09:00', end: '18:00' }
  },
  {
    name: 'Cleaning Staff',
    firstName: 'Meera',
    lastName: 'Verma',
    email: 'cleaning@fms.com',
    phone: '9999999908',
    password: 'Cleaning@123',
    role: 'technician',
    employeeId: 'TECH004',
    department: 'Housekeeping',
    technicianType: 'cleaning',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '07:00', end: '15:00' }
  },
  {
    name: 'Security Guard',
    firstName: 'Ramesh',
    lastName: 'Yadav',
    email: 'security@fms.com',
    phone: '9999999909',
    password: 'Security@123',
    role: 'technician',
    employeeId: 'TECH005',
    department: 'Security',
    technicianType: 'security',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '20:00', end: '08:00' }
  },
  {
    name: 'AC Technician',
    firstName: 'Kunal',
    lastName: 'Joshi',
    email: 'ac@fms.com',
    phone: '9999999915',
    password: 'AC@123',
    role: 'technician',
    employeeId: 'TECH006',
    department: 'Maintenance',
    technicianType: 'hvac',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '09:00', end: '18:00' }
  },
  {
    name: 'Carpenter',
    firstName: 'Mohan',
    lastName: 'Singh',
    email: 'carpenter@fms.com',
    phone: '9999999916',
    password: 'Carpenter@123',
    role: 'technician',
    employeeId: 'TECH007',
    department: 'Maintenance',
    technicianType: 'carpentry',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '09:00', end: '18:00' }
  },
  {
    name: 'Pest Control',
    firstName: 'Nitin',
    lastName: 'Gupta',
    email: 'pest@fms.com',
    phone: '9999999917',
    password: 'Pest@123',
    role: 'technician',
    employeeId: 'TECH008',
    department: 'Maintenance',
    technicianType: 'pest_control',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '10:00', end: '19:00' }
  },
  
  // ==================== CUSTOMER ROLES ====================
  {
    name: 'Regular Customer',
    firstName: 'John',
    lastName: 'Doe',
    email: 'customer@fms.com',
    phone: '9999999910',
    password: 'Customer@123',
    role: 'customer',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true
  },
  {
    name: 'VIP Customer',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'vip@fms.com',
    phone: '9999999911',
    password: 'VIP@123',
    role: 'customer',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true
  },
  {
    name: 'Corporate Customer',
    firstName: 'ABC',
    lastName: 'Corp',
    email: 'corporate@fms.com',
    phone: '9999999918',
    password: 'Corporate@123',
    role: 'customer',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true
  },
  
  // ==================== FINANCE ROLES ====================
  {
    name: 'Accountant',
    firstName: 'CA',
    lastName: 'Mehta',
    email: 'accountant@fms.com',
    phone: '9999999912',
    password: 'Accountant@123',
    role: 'accountant',
    employeeId: 'ACC001',
    department: 'Finance',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '09:30', end: '18:00' }
  },
  {
    name: 'Billing Manager',
    firstName: 'Neha',
    lastName: 'Shah',
    email: 'billing@fms.com',
    phone: '9999999919',
    password: 'Billing@123',
    role: 'accountant',
    employeeId: 'ACC002',
    department: 'Finance',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '10:00', end: '19:00' }
  },
  
  // ==================== HR ROLES ====================
  {
    name: 'HR Manager',
    firstName: 'Pooja',
    lastName: 'Desai',
    email: 'hr@fms.com',
    phone: '9999999920',
    password: 'HR@123',
    role: 'hr',
    employeeId: 'HR001',
    department: 'Human Resources',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '09:30', end: '18:00' }
  }
];

const seedDatabase = async () => {
  console.log('\n=================================');
  console.log('🌱 DATABASE SEEDER');
  console.log('=================================\n');

  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fms';
    console.log(`📡 Connecting to MongoDB...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!\n');

    // Reset if flag is set
    if (shouldReset) {
      console.log('⚠️  Reset flag detected. Clearing existing users...');
      await User.deleteMany({});
      console.log('✅ All users cleared.\n');
    }

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    console.log('📝 Processing users...\n');

    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        
        if (existingUser && !shouldReset) {
          // Update existing user
          const hashedPassword = await bcrypt.hash(userData.password, 10);
          await User.findByIdAndUpdate(
            existingUser._id,
            {
              ...userData,
              password: hashedPassword,
              updatedAt: new Date()
            }
          );
          console.log(`🔄 Updated: ${userData.email.padEnd(25)} → ${userData.role}`);
          updatedCount++;
        } else if (!existingUser) {
          // Create new user
          const hashedPassword = await bcrypt.hash(userData.password, 10);
          const user = new User({
            ...userData,
            password: hashedPassword
          });
          await user.save();
          console.log(`✅ Created: ${userData.email.padEnd(25)} → ${userData.role}`);
          createdCount++;
        } else {
          console.log(`⏭️  Skipped: ${userData.email.padEnd(25)} → Already exists`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to process ${userData.email}:`, error.message);
        skippedCount++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SEEDING SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   ✅ Created: ${createdCount} users`);
    console.log(`   🔄 Updated: ${updatedCount} users`);
    console.log(`   ⏭️  Skipped: ${skippedCount} users`);
    console.log(`   📊 Total: ${users.length} users processed`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Display credentials summary
    console.log('🔑 LOGIN CREDENTIALS SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('| Role              | Email                           | Password              |');
    console.log('|-------------------|---------------------------------|-----------------------|');
    console.log('| Super Admin       | superadmin@fms.com              | SuperAdmin@123        |');
    console.log('| Admin             | admin@fms.com                   | Admin@123             |');
    console.log('| Manager           | manager@fms.com                 | Manager@123           |');
    console.log('| Operations Mgr    | opmanager@fms.com               | OpManager@123         |');
    console.log('| Supervisor        | supervisor@fms.com              | Supervisor@123        |');
    console.log('| Maintenance Sup   | maint-supervisor@fms.com        | MaintSup@123          |');
    console.log('| Electrician       | technician@fms.com              | Technician@123        |');
    console.log('| Plumber           | plumber@fms.com                 | Plumber@123           |');
    console.log('| HVAC              | hvac@fms.com                    | HVAC@123              |');
    console.log('| AC Technician     | ac@fms.com                      | AC@123                |');
    console.log('| Cleaning          | cleaning@fms.com                | Cleaning@123          |');
    console.log('| Security          | security@fms.com                | Security@123          |');
    console.log('| Carpenter         | carpenter@fms.com               | Carpenter@123         |');
    console.log('| Pest Control      | pest@fms.com                    | Pest@123              |');
    console.log('| Customer          | customer@fms.com                | Customer@123          |');
    console.log('| VIP Customer      | vip@fms.com                     | VIP@123               |');
    console.log('| Corporate Cust    | corporate@fms.com               | Corporate@123         |');
    console.log('| Accountant        | accountant@fms.com              | Accountant@123        |');
    console.log('| Billing Manager   | billing@fms.com                 | Billing@123           |');
    console.log('| HR Manager        | hr@fms.com                      | HR@123                |');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('💡 TIPS:');
    console.log('   • Use these credentials to login to the system');
    console.log('   • Each role has different dashboard access');
    console.log('   • Run "npm run seed:reset" to reset all users\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ SEEDING ERROR:', error.message);
    console.error('📋 Error Details:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();