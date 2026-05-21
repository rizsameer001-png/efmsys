// server/src/controllers/salary.controller.js
const mongoose = require('mongoose');
const User = require('../models/User.model');
const SalaryStructure = require('../models/SalaryStructure.model');
const Attendance = require('../models/Attendance.model');
const Leave = require('../models/Leave.model');
const Payroll = require('../models/Payroll.model');

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate salary based on country and employee data
 */
const calculateSalaryByCountry = async (employeeId, month, year, attendanceData, leaveData) => {
  const salaryStructure = await SalaryStructure.findOne({ 
    employeeId, 
    status: 'active',
    effectiveFrom: { $lte: new Date(year, month - 1, 1) },
    $or: [
      { effectiveTo: { $gte: new Date(year, month - 1, 1) } },
      { effectiveTo: { $exists: false } }
    ]
  });
  
  if (!salaryStructure) {
    throw new Error('No active salary structure found for employee');
  }
  
  const { country, earnings, deductions, overtime } = salaryStructure;
  
  // Calculate basic pay
  let basic = earnings.basic.amount;
  
  // Calculate allowances based on country rules
  let housingAllowance = 0;
  let transportAllowance = 0;
  let medicalAllowance = earnings.medicalAllowance.amount || 0;
  let educationAllowance = earnings.educationAllowance.amount || 0;
  let telephoneAllowance = earnings.telephoneAllowance.amount || 0;
  
  // Country-specific calculations
  switch(country) {
    case 'UAE':
      // Housing allowance: 20-40% of basic
      if (earnings.housingAllowance.type === 'percentage') {
        housingAllowance = (basic * earnings.housingAllowance.value) / 100;
      } else {
        housingAllowance = earnings.housingAllowance.value;
      }
      // Transport allowance
      if (earnings.transportAllowance.type === 'percentage') {
        transportAllowance = (basic * earnings.transportAllowance.value) / 100;
      } else {
        transportAllowance = earnings.transportAllowance.value;
      }
      break;
      
    case 'USA':
      // US-specific calculations
      housingAllowance = earnings.housingAllowance.value || 0;
      transportAllowance = earnings.transportAllowance.value || 0;
      break;
      
    case 'INDIA':
      // India-specific calculations
      if (earnings.housingAllowance.type === 'percentage') {
        housingAllowance = (basic * earnings.housingAllowance.value) / 100;
      } else {
        housingAllowance = earnings.housingAllowance.value;
      }
      transportAllowance = earnings.transportAllowance.value || 0;
      break;
      
    default:
      housingAllowance = earnings.housingAllowance.value || 0;
      transportAllowance = earnings.transportAllowance.value || 0;
  }
  
  const totalAllowances = housingAllowance + transportAllowance + medicalAllowance + educationAllowance + telephoneAllowance;
  
  // Calculate overtime
  let overtimePay = 0;
  if (overtime.hourlyRate > 0 && attendanceData?.overtimeHours) {
    overtimePay = attendanceData.overtimeHours * overtime.hourlyRate * overtime.multiplier.weekday;
  }
  
  // Calculate deductions
  let incomeTax = deductions.incomeTax.amount || 0;
  let socialSecurity = deductions.socialSecurity.amount || 0;
  let pension = deductions.pension.amount || 0;
  let loanRecovery = deductions.loanRecovery.amount || 0;
  let insurance = deductions.insurance.amount || 0;
  let otherDeductions = deductions.otherDeductions?.reduce((sum, d) => sum + d.amount, 0) || 0;
  
  // Calculate leave deductions
  let unpaidLeaveDeduction = 0;
  if (leaveData?.unpaidLeaves > 0) {
    const dailyRate = basic / 30; // Assuming 30 days month
    unpaidLeaveDeduction = dailyRate * leaveData.unpaidLeaves;
  }
  
  const totalDeductions = incomeTax + socialSecurity + pension + loanRecovery + insurance + otherDeductions + unpaidLeaveDeduction;
  
  // Calculate gross and net
  const grossSalary = basic + totalAllowances + overtimePay;
  const netSalary = grossSalary - totalDeductions;
  
  return {
    basic,
    allowances: {
      housing: housingAllowance,
      transport: transportAllowance,
      medical: medicalAllowance,
      education: educationAllowance,
      telephone: telephoneAllowance,
      total: totalAllowances
    },
    overtimePay,
    deductions: {
      incomeTax,
      socialSecurity,
      pension,
      loanRecovery,
      insurance,
      other: otherDeductions,
      unpaidLeave: unpaidLeaveDeduction,
      total: totalDeductions
    },
    grossSalary,
    netSalary,
    country
  };
};

/**
 * Get employee attendance for a month
 */
const getEmployeeAttendance = async (employeeId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  const attendance = await Attendance.find({
    employeeId,
    date: { $gte: startDate, $lte: endDate }
  });
  
  const presentDays = attendance.filter(a => a.status === 'present').length;
  const absentDays = attendance.filter(a => a.status === 'absent').length;
  const halfDays = attendance.filter(a => a.status === 'half_day').length;
  const overtimeHours = attendance.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
  
  return { presentDays, absentDays, halfDays, overtimeHours };
};

/**
 * Get employee leaves for a month
 */
const getEmployeeLeaves = async (employeeId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  const leaves = await Leave.find({
    employeeId,
    status: 'approved',
    $or: [
      { startDate: { $gte: startDate, $lte: endDate } },
      { endDate: { $gte: startDate, $lte: endDate } }
    ]
  });
  
  let paidLeaves = 0;
  let unpaidLeaves = 0;
  
  leaves.forEach(leave => {
    const leaveStart = new Date(Math.max(leave.startDate, startDate));
    const leaveEnd = new Date(Math.min(leave.endDate, endDate));
    const days = Math.ceil((leaveEnd - leaveStart) / (1000 * 60 * 60 * 24)) + 1;
    
    if (leave.type === 'paid') {
      paidLeaves += days;
    } else {
      unpaidLeaves += days;
    }
  });
  
  return { paidLeaves, unpaidLeaves, totalLeaves: leaves.length };
};

// ==================== EMPLOYEE SELF ROUTES ====================

/**
 * Get current employee's salary for a specific month
 */
const getMySalary = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;
    
    // Check if payroll already processed
    let payroll = await Payroll.findOne({ employeeId, month, year });
    
    if (payroll && payroll.status === 'processed') {
      return res.json({ success: true, data: payroll, isProcessed: true });
    }
    
    // Calculate salary dynamically
    const attendance = await getEmployeeAttendance(employeeId, month, year);
    const leaves = await getEmployeeLeaves(employeeId, month, year);
    const salaryCalc = await calculateSalaryByCountry(employeeId, month, year, attendance, leaves);
    
    const employee = await User.findById(employeeId).select('name email employeeId designation department joiningDate');
    
    res.json({
      success: true,
      data: {
        employee,
        month,
        year,
        attendance,
        leaves,
        ...salaryCalc,
        isProcessed: false
      }
    });
  } catch (error) {
    console.error('Get my salary error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get employee's salary history
 */
const getMySalaryHistory = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const { limit = 12 } = req.query;
    
    const history = await Payroll.find({ employeeId })
      .sort({ year: -1, month: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Get salary history error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get salary slip
 */
const getSalarySlip = async (req, res) => {
  try {
    const { employeeId, month, year } = req.params;
    const currentUserId = req.user._id;
    
    // Check permission
    if (employeeId !== currentUserId.toString() && !['admin', 'hr', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    const payroll = await Payroll.findOne({ employeeId, month, year })
      .populate('employeeId', 'name email employeeId designation department');
    
    if (!payroll) {
      return res.status(404).json({ success: false, error: 'Salary slip not found' });
    }
    
    res.json({ success: true, data: payroll });
  } catch (error) {
    console.error('Get salary slip error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== ADMIN/HR ROUTES ====================

/**
 * Get employees for payroll processing
 */
const getEmployeesForPayroll = async (req, res) => {
  try {
    const { month = new Date().getMonth() + 1, year = new Date().getFullYear(), country, department } = req.query;
    
    let query = { role: { $in: ['technician', 'supervisor', 'manager'] } };
    if (country) query.country = country;
    if (department) query.department = department;
    
    const employees = await User.find(query).select('name email employeeId designation department joiningDate country');
    
    const employeesWithStatus = await Promise.all(employees.map(async (emp) => {
      const existingPayroll = await Payroll.findOne({
        employeeId: emp._id,
        month: parseInt(month),
        year: parseInt(year)
      });
      
      const salaryStructure = await SalaryStructure.findOne({ employeeId: emp._id, status: 'active' });
      
      return {
        ...emp.toObject(),
        hasPayrollProcessed: !!existingPayroll,
        payrollStatus: existingPayroll?.status || 'draft',
        hasSalaryStructure: !!salaryStructure,
        netSalary: existingPayroll?.netSalary || 0
      };
    }));
    
    // Group by country for summary
    const countrySummary = {};
    employeesWithStatus.forEach(emp => {
      const empCountry = emp.country || 'UAE';
      if (!countrySummary[empCountry]) {
        countrySummary[empCountry] = { total: 0, withStructure: 0, processed: 0 };
      }
      countrySummary[empCountry].total++;
      if (emp.hasSalaryStructure) countrySummary[empCountry].withStructure++;
      if (emp.hasPayrollProcessed) countrySummary[empCountry].processed++;
    });
    
    res.json({
      success: true,
      data: employeesWithStatus,
      summary: {
        total: employeesWithStatus.length,
        withSalaryStructure: employeesWithStatus.filter(e => e.hasSalaryStructure).length,
        processed: employeesWithStatus.filter(e => e.hasPayrollProcessed).length,
        byCountry: countrySummary
      }
    });
  } catch (error) {
    console.error('Get employees for payroll error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Preview payroll before processing
 */
const previewPayroll = async (req, res) => {
  try {
    const { employeeIds, month, year } = req.body;
    
    const previews = [];
    
    for (const employeeId of employeeIds) {
      const attendance = await getEmployeeAttendance(employeeId, month, year);
      const leaves = await getEmployeeLeaves(employeeId, month, year);
      const salaryCalc = await calculateSalaryByCountry(employeeId, month, year, attendance, leaves);
      const employee = await User.findById(employeeId).select('name email employeeId designation department country');
      
      previews.push({
        employeeId,
        employeeName: employee?.name,
        employeeCode: employee?.employeeId,
        department: employee?.department,
        country: salaryCalc.country,
        attendance,
        leaves,
        ...salaryCalc
      });
    }
    
    const totals = {
      totalEmployees: previews.length,
      totalGrossSalary: previews.reduce((sum, p) => sum + p.grossSalary, 0),
      totalDeductions: previews.reduce((sum, p) => sum + p.deductions.total, 0),
      totalNetSalary: previews.reduce((sum, p) => sum + p.netSalary, 0)
    };
    
    res.json({ success: true, data: { previews, totals } });
  } catch (error) {
    console.error('Preview payroll error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Process payroll for selected employees
 */
const processPayroll = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { employeeIds, month, year, processedBy } = req.body;
    
    const results = {
      processed: [],
      failed: [],
      summary: {
        totalProcessed: 0,
        totalNetSalary: 0,
        byCountry: {}
      }
    };
    
    for (const employeeId of employeeIds) {
      try {
        const attendance = await getEmployeeAttendance(employeeId, month, year);
        const leaves = await getEmployeeLeaves(employeeId, month, year);
        const salaryCalc = await calculateSalaryByCountry(employeeId, month, year, attendance, leaves);
        const employee = await User.findById(employeeId);
        
        const payrollData = {
          employeeId,
          month,
          year,
          basic: salaryCalc.basic,
          allowances: salaryCalc.allowances,
          deductions: salaryCalc.deductions,
          overtimePay: salaryCalc.overtimePay,
          grossSalary: salaryCalc.grossSalary,
          netSalary: salaryCalc.netSalary,
          attendance: {
            presentDays: attendance.presentDays,
            absentDays: attendance.absentDays,
            halfDays: attendance.halfDays,
            overtimeHours: attendance.overtimeHours
          },
          leaves: {
            paidLeaves: leaves.paidLeaves,
            unpaidLeaves: leaves.unpaidLeaves
          },
          status: 'processed',
          processedAt: new Date(),
          processedBy,
          country: salaryCalc.country
        };
        
        // Check if already exists
        const existing = await Payroll.findOne({ employeeId, month, year }).session(session);
        
        if (existing) {
          await Payroll.updateOne({ _id: existing._id }, payrollData, { session });
          results.processed.push({ employeeId, status: 'updated', netSalary: salaryCalc.netSalary });
        } else {
          await Payroll.create([payrollData], { session });
          results.processed.push({ employeeId, status: 'created', netSalary: salaryCalc.netSalary });
        }
        
        results.summary.totalProcessed++;
        results.summary.totalNetSalary += salaryCalc.netSalary;
        
        const empCountry = employee?.country || 'UAE';
        if (!results.summary.byCountry[empCountry]) {
          results.summary.byCountry[empCountry] = { count: 0, totalNetSalary: 0 };
        }
        results.summary.byCountry[empCountry].count++;
        results.summary.byCountry[empCountry].totalNetSalary += salaryCalc.netSalary;
        
      } catch (err) {
        results.failed.push({ employeeId, error: err.message });
      }
    }
    
    await session.commitTransaction();
    
    res.json({
      success: true,
      data: results,
      message: `Processed ${results.processed.length} employees, ${results.failed.length} failed`
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Process payroll error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    session.endSession();
  }
};

/**
 * Get payroll dashboard stats
 */
const getPayrollDashboard = async (req, res) => {
  try {
    const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;
    
    const payrolls = await Payroll.find({ month, year });
    const totalEmployees = await User.countDocuments({ role: { $in: ['technician', 'supervisor', 'manager'] } });
    const processedCount = payrolls.length;
    const pendingCount = totalEmployees - processedCount;
    
    const totalNetSalary = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
    const totalGrossSalary = payrolls.reduce((sum, p) => sum + p.grossSalary, 0);
    const totalDeductions = payrolls.reduce((sum, p) => sum + p.deductions?.total || 0, 0);
    
    // Country-wise breakdown
    const byCountry = {};
    payrolls.forEach(p => {
      const country = p.country || 'UAE';
      if (!byCountry[country]) {
        byCountry[country] = { count: 0, totalNetSalary: 0 };
      }
      byCountry[country].count++;
      byCountry[country].totalNetSalary += p.netSalary;
    });
    
    res.json({
      success: true,
      data: {
        summary: {
          totalEmployees,
          processedCount,
          pendingCount,
          totalNetSalary,
          totalGrossSalary,
          totalDeductions,
          complianceRate: totalEmployees > 0 ? (processedCount / totalEmployees * 100).toFixed(1) : 0
        },
        byCountry,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Get payroll dashboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get salary structure for an employee
 */
const getSalaryStructure = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // Check permission
    if (employeeId !== req.user._id.toString() && !['admin', 'hr', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    const structure = await SalaryStructure.findOne({ employeeId, status: 'active' });
    
    if (!structure) {
      return res.status(404).json({ success: false, error: 'Salary structure not found' });
    }
    
    res.json({ success: true, data: structure });
  } catch (error) {
    console.error('Get salary structure error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update salary structure for an employee
 */
const updateSalaryStructure = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updateData = req.body;
    
    // Only admin/hr/super_admin can update
    if (!['admin', 'hr', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    
    // Deactivate old structure
    await SalaryStructure.updateMany(
      { employeeId, status: 'active' },
      { status: 'inactive', effectiveTo: new Date() }
    );
    
    // Create new structure
    const structure = await SalaryStructure.create({
      ...updateData,
      employeeId,
      updatedBy: req.user._id,
      status: 'active'
    });
    
    res.json({
      success: true,
      data: structure,
      message: 'Salary structure updated successfully'
    });
  } catch (error) {
    console.error('Update salary structure error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getMySalary,
  getMySalaryHistory,
  getSalarySlip,
  getEmployeesForPayroll,
  previewPayroll,
  processPayroll,
  getPayrollDashboard,
  getSalaryStructure,
  updateSalaryStructure
};