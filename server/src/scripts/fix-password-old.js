// server/src/scripts/fix-password.js
require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import User Model (correct path from src/scripts to src/models)
const User = require('../models/user.model');

async function fixPassword() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fms_db';
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 URI:', uri?.replace(/\/\/(.*):(.*)@/, '//***:***@'));
    
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');

    // Find super admin user
    console.log('🔍 Looking for super admin user...');
    let user = await User.findOne({ email: 'superadmin@fms.com' }).select('+password');
    
    if (!user) {
      console.log('❌ User not found! Creating new super admin...\n');
      
      // Hash new password
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      // Create new super admin
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
      console.log('   Current password hash:', user.password?.substring(0, 30) + '...\n');
      
      // Hash new password
      console.log('🔐 Resetting password...');
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      // Update password
      user.password = hashedPassword;
      await user.save();
      
      console.log('✅ Password reset successfully!\n');
    }
    
    // Verify the new password works
    console.log('🔍 Verifying new password...');
    const testVerify = await bcrypt.compare('Admin@123', user.password);
    console.log('   Password verification test:', testVerify ? '✅ PASSED' : '❌ FAILED');
    
    if (!testVerify) {
      console.log('\n⚠️ Warning: Password verification failed!');
      console.log('   Please check the password hashing.');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 LOGIN CREDENTIALS:');
    console.log('='.repeat(60));
    console.log(`   Email:    ${user.email}`);
    console.log(`   Password: Admin@123`);
    console.log(`   Role:     ${user.role}`);
    console.log('='.repeat(60));
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
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

// Run the function
fixPassword();