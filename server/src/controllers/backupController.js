const Backup = require('../models/Backup');
const Settings = require('../models/Settings');
const AuditLog = require('../models/AuditLog');
const fs = require('fs').promises;
const path = require('path');

// Get backups list
exports.getBackups = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const backups = await Backup.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'username email');

    const total = await Backup.countDocuments();

    res.json({
      success: true,
      data: {
        backups,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get backups error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch backups'
    });
  }
};

// Create backup
exports.createBackup = async (req, res) => {
  try {
    const { backupType = 'full', notes } = req.body;
    
    // Create backup directory if it doesn't exist
    const backupDir = path.join(__dirname, '../backups');
    await fs.mkdir(backupDir, { recursive: true });

    // Generate backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${backupType}-${timestamp}.json`;
    const filePath = path.join(backupDir, filename);

    // Get all data to backup
    const Settings = require('../models/Settings');
    const User = require('../models/User');
    
    const settings = await Settings.getSettings();
    const users = await User.find().select('-password');

    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      backupType,
      data: {
        settings,
        users: users.map(u => u.toObject())
      }
    };

    // Write backup file
    await fs.writeFile(filePath, JSON.stringify(backupData, null, 2));
    
    // Get file size
    const stats = await fs.stat(filePath);

    // Save backup record
    const backup = await Backup.create({
      filename,
      fileSize: stats.size,
      filePath,
      backupType,
      status: 'completed',
      createdBy: req.user.id,
      notes
    });

    // Log audit
    await AuditLog.create({
      userId: req.user.id,
      username: req.user.username,
      email: req.user.email,
      action: 'CREATE',
      module: 'BACKUP',
      description: `Created ${backupType} backup`,
      resourceType: 'Backup',
      resourceId: backup._id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'success'
    });

    res.json({
      success: true,
      data: backup,
      message: 'Backup created successfully'
    });
  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create backup'
    });
  }
};

// Restore backup
exports.restoreBackup = async (req, res) => {
  try {
    const { backupId } = req.params;
    
    const backup = await Backup.findById(backupId);
    if (!backup) {
      return res.status(404).json({
        success: false,
        error: 'Backup not found'
      });
    }

    // Read backup file
    const backupData = JSON.parse(await fs.readFile(backup.filePath, 'utf8'));
    
    // Restore settings
    if (backupData.data.settings) {
      const settings = await Settings.getSettings();
      Object.assign(settings, backupData.data.settings);
      settings.updatedBy = req.user.id;
      await settings.save();
    }

    // Update backup record
    backup.restoredAt = new Date();
    backup.restoredBy = req.user.id;
    await backup.save();

    // Log audit
    await AuditLog.create({
      userId: req.user.id,
      username: req.user.username,
      email: req.user.email,
      action: 'RESTORE',
      module: 'BACKUP',
      description: `Restored from backup: ${backup.filename}`,
      resourceType: 'Backup',
      resourceId: backup._id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'success'
    });

    res.json({
      success: true,
      message: 'Backup restored successfully'
    });
  } catch (error) {
    console.error('Restore backup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore backup'
    });
  }
};

// Delete backup
exports.deleteBackup = async (req, res) => {
  try {
    const { backupId } = req.params;
    
    const backup = await Backup.findById(backupId);
    if (!backup) {
      return res.status(404).json({
        success: false,
        error: 'Backup not found'
      });
    }

    // Delete file
    try {
      await fs.unlink(backup.filePath);
    } catch (err) {
      console.error('Error deleting backup file:', err);
    }

    await backup.deleteOne();

    // Log audit
    await AuditLog.create({
      userId: req.user.id,
      username: req.user.username,
      email: req.user.email,
      action: 'DELETE',
      module: 'BACKUP',
      description: `Deleted backup: ${backup.filename}`,
      resourceType: 'Backup',
      resourceId: backup._id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'success'
    });

    res.json({
      success: true,
      message: 'Backup deleted successfully'
    });
  } catch (error) {
    console.error('Delete backup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete backup'
    });
  }
};