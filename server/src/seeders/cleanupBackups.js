const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Backup = require('../models/Settings.model').Backup;

const cleanupOldBackups = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Keep only last 10 backups
    const backups = await Backup.find().sort({ createdAt: -1 });
    const toDelete = backups.slice(10);
    
    for (const backup of toDelete) {
      // Delete physical file
      try {
        await fs.unlink(backup.path);
        console.log(`Deleted file: ${backup.path}`);
      } catch (err) {
        console.warn(`Could not delete file: ${backup.path}`, err.message);
      }
      
      // Delete database record
      await Backup.findByIdAndDelete(backup._id);
      console.log(`Deleted record: ${backup.name}`);
    }
    
    console.log(`Cleaned up ${toDelete.length} old backups`);
    process.exit(0);
  } catch (error) {
    console.error('Cleanup error:', error);
    process.exit(1);
  }
};

cleanupOldBackups();