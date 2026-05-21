const mongoose = require('mongoose');
const User = require('../../src/models/User.model');

const mongoURI = 'mongodb+srv://rizsameer001_db_user:apyzUNvvS0p0318K@cluster0.xbnnnsq.mongodb.net/fmsnew3?appName=Cluster0';

(async () => {
  await mongoose.connect(mongoURI);
  console.log('Connected');
  
  const result = await User.updateMany(
    { role: 'technician' },
    { $set: { status: 'active', isActive: true, isUserOnline: false, chatEnabled: true } }
  );
  
  console.log(`Updated ${result.modifiedCount} technicians`);
  
  const techs = await User.find({ role: 'technician' });
  techs.forEach(t => console.log(`${t.firstName} ${t.lastName}: status=${t.status}, active=${t.isActive}`));
  
  process.exit(0);
})();















// server/scripts/fixTechnicians.js
const mongoose = require('mongoose');
const User = require('../src/models/User.model');

const mongoURI ='mongodb+srv://rizsameer001_db_user:apyzUNvvS0p0318K@cluster0.xbnnnsq.mongodb.net/fmsnew3?appName=Cluster0';

async function fixTechnicians() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    
    // Find all technicians
    const technicians = await User.find({ role: 'technician' });
    console.log(`Found ${technicians.length} technicians`);
    
    for (const tech of technicians) {
      let updated = false;
      
      // Fix status
      if (!tech.status || tech.status !== 'active') {
        tech.status = 'active';
        updated = true;
      }
      
      // Fix isActive
      if (tech.isActive !== true) {
        tech.isActive = true;
        updated = true;
      }
      
      // Fix isUserOnline (add if missing)
      if (tech.isUserOnline === undefined) {
        tech.isUserOnline = false;
        updated = true;
      }
      
      if (updated) {
        await tech.save();
        console.log(`✅ Updated technician: ${tech.firstName} ${tech.lastName} (${tech.email})`);
      } else {
        console.log(`✅ Technician OK: ${tech.firstName} ${tech.lastName} (${tech.email})`);
      }
    }
    
    console.log('\n✅ All technicians fixed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixTechnicians();