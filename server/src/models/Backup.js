const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  fileSize: { type: Number, required: true },
  filePath: { type: String, required: true },
  backupType: { type: String, enum: ['full', 'partial', 'config'], default: 'full' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  restoredAt: { type: Date },
  restoredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String }
});

module.exports = mongoose.model('Backup', backupSchema);