// server/src/models/LeaveBalance.model.js
const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  year: { type: Number, required: true, default: () => new Date().getFullYear() },
  
  balances: {
    annual: { total: { type: Number, default: 22 }, used: { type: Number, default: 0 }, remaining: { type: Number, default: 22 } },
    sick: { total: { type: Number, default: 12 }, used: { type: Number, default: 0 }, remaining: { type: Number, default: 12 } },
    emergency: { total: { type: Number, default: 6 }, used: { type: Number, default: 0 }, remaining: { type: Number, default: 6 } }
  },
  
  carryForward: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

leaveBalanceSchema.index({ employeeId: 1, year: 1 }, { unique: true });

const LeaveBalance = mongoose.models.LeaveBalance || mongoose.model('LeaveBalance', leaveBalanceSchema);
module.exports = LeaveBalance;