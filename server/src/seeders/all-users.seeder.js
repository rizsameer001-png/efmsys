/**
 * ALL USERS SEEDER
 * Creates users for all roles: Super Admin, Admin, Manager, Supervisor, Technician, Customer
 * Run with: node src/seeders/all-users.seeder.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

// User data for all roles
const users = [
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
    name: 'Team Supervisor',
    firstName: 'Priya',
    lastName: 'Singh',
    email: 'supervisor@fms.com',
    phone: '9999999904',
    password: 'Supervisor@123',
    role: 'supervisor',
    employeeId: 'SPV001',
    department: 'Operations',
    technicianType: 'supervisor',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    shift: { start: '09:00', end: '18:00' }
  },
  {
    name: 'Senior Technician',
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
  }
];

const seedAllUsers = async () => {
  console.log('\n=================================');
  console.log('👥 ALL USERS SEEDER');
  console.log('=================================\n');

  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fms';
    console.log(`📡 Connecting to: ${mongoUri.substring(0, 50)}...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!\n');

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        
        if (existingUser) {
          // Update existing user
          const hashedPassword = await bcrypt.hash(userData.password, 10);
          const updatedUser = await User.findByIdAndUpdate(
            existingUser._id,
            {
              ...userData,
              password: hashedPassword,
              updatedAt: new Date()
            },
            { new: true }
          );
          console.log(`🔄 Updated: ${userData.email} (${userData.role})`);
          updatedCount++;
        } else {
          // Create new user
          const hashedPassword = await bcrypt.hash(userData.password, 10);
          const user = new User({
            ...userData,
            password: hashedPassword
          });
          await user.save();
          console.log(`✅ Created: ${userData.email} (${userData.role})`);
          createdCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to process ${userData.email}:`, error.message);
        skippedCount++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 USERS CREATED/UPDATED:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   ✅ Created: ${createdCount} users`);
    console.log(`   🔄 Updated: ${updatedCount} users`);
    console.log(`   ⏭️  Skipped: ${skippedCount} users`);
    console.log(`   📊 Total: ${users.length} users processed`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Display credentials summary
    console.log('🔑 LOGIN CREDENTIALS SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('| Role           | Email                      | Password           |');
    console.log('|----------------|----------------------------|--------------------|');
    console.log('| Super Admin    | superadmin@fms.com         | SuperAdmin@123     |');
    console.log('| Admin          | admin@fms.com              | Admin@123          |');
    console.log('| Manager        | manager@fms.com            | Manager@123        |');
    console.log('| Supervisor     | supervisor@fms.com         | Supervisor@123     |');
    console.log('| Technician     | technician@fms.com         | Technician@123     |');
    console.log('| Plumber        | plumber@fms.com            | Plumber@123        |');
    console.log('| HVAC           | hvac@fms.com               | HVAC@123           |');
    console.log('| Cleaning       | cleaning@fms.com           | Cleaning@123       |');
    console.log('| Security       | security@fms.com           | Security@123       |');
    console.log('| Customer       | customer@fms.com           | Customer@123       |');
    console.log('| VIP Customer   | vip@fms.com                | VIP@123            |');
    console.log('| Accountant     | accountant@fms.com         | Accountant@123     |');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('📋 Error Details:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seeder
seedAllUsers();