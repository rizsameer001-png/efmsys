// server/src/models/Payroll.model.js
const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  country: { type: String, enum: ['UAE', 'USA', 'UK', 'INDIA'], default: 'UAE' },
  
  // Salary Components
  basic: { type: Number, default: 0 },
  allowances: {
    housing: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    telephone: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  overtimePay: { type: Number, default: 0 },
  grossSalary: { type: Number, default: 0 },
  
  // Deductions
  deductions: {
    incomeTax: { type: Number, default: 0 },
    socialSecurity: { type: Number, default: 0 },
    pension: { type: Number, default: 0 },
    loanRecovery: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
    unpaidLeave: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  
  netSalary: { type: Number, default: 0 },
  
  // Attendance & Leave Data
  attendance: {
    presentDays: { type: Number, default: 0 },
    absentDays: { type: Number, default: 0 },
    halfDays: { type: Number, default: 0 },
    overtimeHours: { type: Number, default: 0 }
  },
  leaves: {
    paidLeaves: { type: Number, default: 0 },
    unpaidLeaves: { type: Number, default: 0 }
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'processed', 'paid', 'cancelled'],
    default: 'draft'
  },
  processedAt: Date,
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paidAt: Date,
  paymentReference: String,
  notes: String
}, { timestamps: true });

// Compound unique index
payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Payroll', payrollSchema);