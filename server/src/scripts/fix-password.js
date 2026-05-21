// server/src/scripts/fix-password.js
require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import User Model
const User = require('../models/user.model');

async function fixPassword() {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.error('❌ MONGODB_URI not found in .env file!');
      process.exit(1);
    }
    
    console.log('🔄 Connecting to MongoDB Atlas...');
    const safeUri = uri.replace(/\/\/(.*):(.*)@/, '//***:***@');
    console.log('📍 URI:', safeUri);
    
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('');

    // Find super admin user
    console.log('🔍 Looking for super admin user...');
    let user = await User.findOne({ email: 'superadmin@fms.com' }).select('+password');
    
    if (!user) {
      console.log('❌ User not found! Creating new super admin...\n');
      
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      user = new User({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@fms.com',
        phone: '+971500000001',
        role: 'super_admin',
        designation: 'System Administrator',
        department: 'management',
        status: 'active',
        password: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
        joiningDate: new Date(),
      });
      
      await user.save();
      console.log('✅ Super Admin created successfully!\n');
    } else {
      console.log('✅ User found:', user.email);
      console.log('   Role:', user.role);
      console.log('   Status:', user.status);
      
      console.log('\n🔐 Resetting password...');
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      user.password = hashedPassword;
      await user.save();
      
      console.log('✅ Password reset successfully!\n');
    }
    
    // Verify the new password works
    console.log('🔍 Verifying new password...');
    const testVerify = await bcrypt.compare('Admin@123', user.password);
    console.log('   Password verification test:', testVerify ? '✅ PASSED' : '❌ FAILED');
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 LOGIN CREDENTIALS:');
    console.log('='.repeat(60));
    console.log(`   Email:    ${user.email}`);
    console.log(`   Password: Admin@123`);
    console.log(`   Role:     ${user.role}`);
    console.log('='.repeat(60));
    
    // List all users in database
    const allUsers = await User.find({}).select('email role status');
    console.log('\n📋 All Users in Database:');
    console.log('-'.repeat(40));
    allUsers.forEach(u => {
      console.log(`   ${u.email} - ${u.role} - ${u.status}`);
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB Atlas');
    console.log('\n🚀 You can now login with:');
    console.log('   superadmin@fms.com / Admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
}

fixPassword();