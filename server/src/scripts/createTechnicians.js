// server/scripts/createTechnicians.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//const User = require('../src/models/User.model');
const User = require('../../src/models/User.model');

// Your MongoDB URI
const mongoURI = 'mongodb+srv://rizsameer001_db_user:apyzUNvvS0p0318K@cluster0.xbnnnsq.mongodb.net/fmsnew3?appName=Cluster0';

async function create() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB successfully');

    const technicians = [
      {
        firstName: 'Amit',
        lastName: 'Sharma',
        email: 'amit.kumar@fms.com',  // Changed to @fms.com
        phone: '+971501234567',
        employeeId: 'TECH009',
        role: 'technician',
        department: 'maintenance',
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
        employeeId: 'TECH006',
        role: 'technician',
        department: 'maintenance',
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
        employeeId: 'TECH007',
        role: 'technician',
        department: 'electrical',
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
        department: 'maintenance',
        designation: 'Senior Technician',
        status: 'active',
        isActive: true,
        chatEnabled: true
      }
    ];
    
    let createdCount = 0;
    let existingCount = 0;

    for (const tech of technicians) {
      const existing = await User.findOne({ 
        $or: [{ email: tech.email }, { employeeId: tech.employeeId }]
      });
      
      if (!existing) {
        const hashedPassword = await bcrypt.hash('Welcome@123', 10);
        const user = new User({ 
          ...tech, 
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        await user.save();
        console.log(`✅ Created: ${tech.email} (${tech.employeeId})`);
        createdCount++;
      } else {
        console.log(`⚠️ Already exists: ${tech.email}`);
        existingCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`   Created: ${createdCount} technicians`);
    console.log(`   Already existed: ${existingCount}`);
    console.log(`   Total processed: ${technicians.length}`);
    
    console.log('\n📋 Login Credentials:');
    technicians.forEach(tech => {
      console.log(`   Email: ${tech.email}`);
      console.log(`   Password: Welcome@123`);
      console.log(`   ---`);
    });
    
    console.log('\n✅ Done!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

create();