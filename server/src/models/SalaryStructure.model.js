// server/src/models/SalaryStructure.model.js
const mongoose = require('mongoose');

const salaryStructureSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  country: { type: String, enum: ['UAE', 'USA', 'UK', 'INDIA'], required: true, default: 'UAE' },
  effectiveFrom: { type: Date, required: true },
  effectiveTo: { type: Date },
  
  // Earnings Components
  earnings: {
    basic: { amount: { type: Number, required: true }, taxable: { type: Boolean, default: true } },
    housingAllowance: { type: { type: String, enum: ['fixed', 'percentage'], default: 'fixed' }, value: { type: Number, default: 0 }, taxable: { type: Boolean, default: true } },
    transportAllowance: { type: { type: String, enum: ['fixed', 'percentage'], default: 'fixed' }, value: { type: Number, default: 0 }, taxable: { type: Boolean, default: true } },
    medicalAllowance: { amount: { type: Number, default: 0 }, taxable: { type: Boolean, default: false } },
    educationAllowance: { amount: { type: Number, default: 0 }, taxable: { type: Boolean, default: false } },
    telephoneAllowance: { amount: { type: Number, default: 0 }, taxable: { type: Boolean, default: true } }
  },
  
  // Deductions
  deductions: {
    incomeTax: { amount: { type: Number, default: 0 }, type: { type: String } },
    socialSecurity: { amount: { type: Number, default: 0 } },
    pension: { amount: { type: Number, default: 0 } },
    loanRecovery: { amount: { type: Number, default: 0 } },
    insurance: { amount: { type: Number, default: 0 } },
    otherDeductions: [{ name: { type: String }, amount: { type: Number } }]
  },
  
  // Overtime Settings
  overtime: {
    hourlyRate: { type: Number, default: 0 },
    multiplier: { weekday: { type: Number, default: 1.5 }, weekend: { type: Number, default: 2 }, holiday: { type: Number, default: 2.5 } },
    maxHoursPerWeek: { type: Number, default: 20 }
  },
  
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const SalaryStructure = mongoose.models.SalaryStructure || mongoose.model('SalaryStructure', salaryStructureSchema);
module.exports = SalaryStructure;