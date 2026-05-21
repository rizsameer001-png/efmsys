// server/src/models/Payroll.model.js
const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Attendance Data
  attendance: {
    totalWorkingDays: { type: Number, default: 0 },
    presentDays: { type: Number, default: 0 },
    absentDays: { type: Number, default: 0 },
    lateDays: { type: Number, default: 0 },
    overtimeHours: { type: Number, default: 0 },
    holidayWorkHours: { type: Number, default: 0 }
  },
  
  // Leave Data
  leave: {
    taken: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    unpaid: { type: Number, default: 0 }
  },
  
  // Earnings Calculated
  earningsCalculated: {
    basic: { type: Number, default: 0 },
    housingAllowance: { type: Number, default: 0 },
    transportAllowance: { type: Number, default: 0 },
    medicalAllowance: { type: Number, default: 0 },
    overtimePay: { type: Number, default: 0 },
    holidayPay: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    incentives: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 }
  },
  
  // Deductions Calculated
  deductionsCalculated: {
    tax: { type: Number, default: 0 },
    socialSecurity: { type: Number, default: 0 },
    pension: { type: Number, default: 0 },
    loanRecovery: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    unpaidLeave: { type: Number, default: 0 },
    otherDeductions: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 }
  },
  
  // Net Pay
  netSalary: { type: Number, default: 0 },
  
  // Payment Details
  bankTransfer: {
    status: { type: String, enum: ['pending', 'processed', 'failed'], default: 'pending' },
    transactionId: { type: String },
    processedAt: { type: Date }
  },
  
  // Salary Slip
  salarySlipUrl: { type: String },
  salarySlipSentAt: { type: Date },
  
  status: { type: String, enum: ['draft', 'calculated', 'approved', 'paid', 'archived'], default: 'draft' },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  processedAt: { type: Date },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Compound index for unique employee-month
payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });
payrollSchema.index({ month: 1, year: 1, status: 1 });

const Payroll = mongoose.models.Payroll || mongoose.model('Payroll', payrollSchema);
module.exports = Payroll;