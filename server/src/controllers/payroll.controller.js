// server/src/controllers/payroll.controller.js
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Payroll = require('../models/Payroll.model');
const SalaryStructure = require('../models/SalaryStructure.model');
const Attendance = require('../models/Attendance.model');
const Leave = require('../models/Leave.model');
const Notification = require('../models/Notification.model');

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate salary for an employee (reuse from salary controller)
 */
const calculateEmployeeSalary = async (employeeId, month, year) => {
  const salaryStructure = await SalaryStructure.findOne({ employeeId, status: 'active' });
  if (!salaryStructure) {
    throw new Error('No active salary structure found');
  }
  
  const attendance = await getEmployeeAttendance(employeeId, month, year);
  const leaves = await getEmployeeLeaves(employeeId, month, year);
  
  // Basic salary calculation
  const basic = salaryStructure.earnings.basic.amount;
  
  // Calculate allowances based on country
  let housingAllowance = 0, transportAllowance = 0;
  const country = salaryStructure.country;
  
  if (salaryStructure.earnings.housingAllowance?.type === 'percentage') {
    housingAllowance = (basic * (salaryStructure.earnings.housingAllowance.value || 20)) / 100;
  } else {
    housingAllowance = salaryStructure.earnings.housingAllowance?.value || 0;
  }
  
  if (salaryStructure.earnings.transportAllowance?.type === 'percentage') {
    transportAllowance = (basic * (salaryStructure.earnings.transportAllowance.value || 10)) / 100;
  } else {
    transportAllowance = salaryStructure.earnings.transportAllowance?.value || 0;
  }
  
  const medicalAllowance = salaryStructure.earnings.medicalAllowance?.amount || 0;
  const totalAllowances = housingAllowance + transportAllowance + medicalAllowance;
  
  // Overtime calculation
  let overtimePay = 0;
  if (salaryStructure.overtime?.hourlyRate && attendance.overtimeHours) {
    overtimePay = attendance.overtimeHours * salaryStructure.overtime.hourlyRate * 1.5;
  }
  
  // Deductions
  const unpaidLeaveDeduction = (basic / 30) * (leaves.unpaidLeaves || 0);
  const totalDeductions = (salaryStructure.deductions.incomeTax?.amount || 0) + 
                          (salaryStructure.deductions.socialSecurity?.amount || 0) +
                          unpaidLeaveDeduction;
  
  const grossSalary = basic + totalAllowances + overtimePay;
  const netSalary = grossSalary - totalDeductions;
  
  return {
    basic,
    allowances: { housing: housingAllowance, transport: transportAllowance, medical: medicalAllowance, total: totalAllowances },
    overtimePay,
    deductions: { incomeTax: salaryStructure.deductions.incomeTax?.amount || 0, unpaidLeave: unpaidLeaveDeduction, total: totalDeductions },
    grossSalary,
    netSalary,
    attendance,
    leaves,
    country
  };
};

const getEmployeeAttendance = async (employeeId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const attendance = await Attendance.find({ employeeId, date: { $gte: startDate, $lte: endDate } });
  
  return {
    presentDays: attendance.filter(a => a.status === 'present').length,
    absentDays: attendance.filter(a => a.status === 'absent').length,
    overtimeHours: attendance.reduce((sum, a) => sum + (a.overtimeHours || 0), 0)
  };
};

const getEmployeeLeaves = async (employeeId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const leaves = await Leave.find({ employeeId, status: 'approved', startDate: { $lte: endDate }, endDate: { $gte: startDate } });
  
  let unpaidLeaves = 0;
  leaves.forEach(leave => {
    if (leave.type !== 'paid') {
      const days = Math.ceil((leave.endDate - leave.startDate) / (1000 * 60 * 60 * 24)) + 1;
      unpaidLeaves += days;
    }
  });
  
  return { unpaidLeaves, totalLeaves: leaves.length };
};

// ==================== PAYROLL DASHBOARD ====================

const getPayrollDashboard = async (req, res) => {
  try {
    const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;
    
    const payrolls = await Payroll.find({ month: parseInt(month), year: parseInt(year) });
    const totalEmployees = await User.countDocuments({ role: { $in: ['technician', 'supervisor', 'manager'] } });
    
    const processedCount = payrolls.length;
    const totalNetSalary = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    
    // Get previous month for comparison
    const prevMonth = parseInt(month) === 1 ? 12 : parseInt(month) - 1;
    const prevYear = parseInt(month) === 1 ? parseInt(year) - 1 : parseInt(year);
    const prevPayrolls = await Payroll.find({ month: prevMonth, year: prevYear });
    const prevTotal = prevPayrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    
    const growth = prevTotal > 0 ? ((totalNetSalary - prevTotal) / prevTotal * 100).toFixed(1) : 0;
    
    res.json({
      success: true,
      data: {
        summary: {
          totalPayroll: totalNetSalary,
          averageSalary: processedCount > 0 ? totalNetSalary / processedCount : 0,
          pendingPayments: totalEmployees - processedCount,
          processedCount,
          pendingCount: totalEmployees - processedCount,
          thisMonthTotal: totalNetSalary,
          lastMonthTotal: prevTotal,
          growth: parseFloat(growth)
        },
        byDepartment: [],
        recentProcessed: await Payroll.find().sort({ createdAt: -1 }).limit(5).lean()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPayrollSummary = async (req, res) => {
  try {
    const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;
    
    const payrolls = await Payroll.find({ month: parseInt(month), year: parseInt(year) });
    const totalNetSalary = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    const totalGrossSalary = payrolls.reduce((sum, p) => sum + (p.grossSalary || 0), 0);
    const totalDeductions = payrolls.reduce((sum, p) => sum + (p.deductions?.total || 0), 0);
    
    res.json({
      success: true,
      data: {
        month: parseInt(month),
        year: parseInt(year),
        totalEmployees: payrolls.length,
        totalPayroll: totalGrossSalary,
        averageSalary: payrolls.length > 0 ? totalGrossSalary / payrolls.length : 0,
        totalDeductions,
        netPayroll: totalNetSalary
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== EMPLOYEES FOR PAYROLL ====================

const getEmployeesForPayroll = async (req, res) => {
  try {
    const { month = new Date().getMonth() + 1, year = new Date().getFullYear(), department, country } = req.query;
    
    let query = { role: { $in: ['technician', 'supervisor', 'manager'] } };
    if (department) query.department = department;
    if (country) query.country = country;
    
    const employees = await User.find(query).select('name email employeeId designation department country bankDetails');
    
    const employeesWithData = await Promise.all(employees.map(async (emp) => {
      const existingPayroll = await Payroll.findOne({ employeeId: emp._id, month: parseInt(month), year: parseInt(year) });
      const salaryStructure = await SalaryStructure.findOne({ employeeId: emp._id, status: 'active' });
      
      let preview = null;
      if (salaryStructure && !existingPayroll) {
        try {
          preview = await calculateEmployeeSalary(emp._id, parseInt(month), parseInt(year));
        } catch (err) {
          console.error(`Preview error for ${emp._id}:`, err.message);
        }
      }
      
      return {
        id: emp._id,
        name: emp.name,
        employeeId: emp.employeeId,
        department: emp.department,
        country: emp.country || 'UAE',
        basicSalary: salaryStructure?.earnings.basic.amount || 0,
        allowances: preview?.allowances?.total || 0,
        deductions: preview?.deductions?.total || 0,
        netSalary: existingPayroll?.netSalary || preview?.netSalary || 0,
        bankDetails: emp.bankDetails,
        hasPayrollProcessed: !!existingPayroll,
        hasSalaryStructure: !!salaryStructure
      };
    }));
    
    res.json({ success: true, data: employeesWithData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== PAYROLL PROCESSING ====================

const previewPayroll = async (req, res) => {
  try {
    const { month, year, employeeIds } = req.body;
    const previews = [];
    
    for (const employeeId of employeeIds) {
      try {
        const salaryData = await calculateEmployeeSalary(employeeId, month, year);
        const employee = await User.findById(employeeId).select('name employeeId department');
        previews.push({
          employeeId,
          employeeName: employee?.name,
          employeeCode: employee?.employeeId,
          department: employee?.department,
          ...salaryData
        });
      } catch (err) {
        previews.push({ employeeId, error: err.message });
      }
    }
    
    res.json({ success: true, data: { previews } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const processPayroll = async (req, res) => {
  try {
    const { month, year, options } = req.body;
    const employees = await User.find({ role: { $in: ['technician', 'supervisor', 'manager'] } });
    
    const results = { processed: [], failed: [] };
    
    for (const emp of employees) {
      try {
        const salaryData = await calculateEmployeeSalary(emp._id, month, year);
        
        const payroll = await Payroll.findOneAndUpdate(
          { employeeId: emp._id, month, year },
          {
            employeeId: emp._id,
            month,
            year,
            ...salaryData,
            status: 'processed',
            processedAt: new Date(),
            processedBy: req.user._id
          },
          { upsert: true, new: true }
        );
        
        results.processed.push({ employeeId: emp._id, netSalary: payroll.netSalary });
      } catch (err) {
        results.failed.push({ employeeId: emp._id, error: err.message });
      }
    }
    
    res.json({ success: true, message: `Processed ${results.processed.length} employees`, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const processSelectedPayroll = async (req, res) => {
  try {
    const { month, year, employeeIds, options } = req.body;
    const results = { processed: [], failed: [] };
    
    for (const employeeId of employeeIds) {
      try {
        const salaryData = await calculateEmployeeSalary(employeeId, month, year);
        
        const payroll = await Payroll.findOneAndUpdate(
          { employeeId, month, year },
          { ...salaryData, status: 'processed', processedAt: new Date(), processedBy: req.user._id },
          { upsert: true, new: true }
        );
        
        results.processed.push({ employeeId, netSalary: payroll.netSalary });
      } catch (err) {
        results.failed.push({ employeeId, error: err.message });
      }
    }
    
    res.json({ success: true, message: `Processed ${results.processed.length} employees`, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const processSinglePayroll = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year, adjustments } = req.body;
    
    const salaryData = await calculateEmployeeSalary(employeeId, month, year);
    const payroll = await Payroll.findOneAndUpdate(
      { employeeId, month, year },
      { ...salaryData, adjustments, status: 'processed', processedAt: new Date(), processedBy: req.user._id },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== PAYROLL APPROVAL ====================

const approvePayroll = async (req, res) => {
  try {
    const { month, year, notes } = req.body;
    await Payroll.updateMany({ month, year }, { status: 'approved', approvedAt: new Date(), approvedBy: req.user._id, approvalNotes: notes });
    res.json({ success: true, message: `Payroll for ${month}/${year} approved` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const rejectPayroll = async (req, res) => {
  try {
    const { month, year, reason } = req.body;
    await Payroll.updateMany({ month, year }, { status: 'rejected', rejectionReason: reason, rejectedAt: new Date(), rejectedBy: req.user._id });
    res.json({ success: true, message: `Payroll for ${month}/${year} rejected` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== EXPORTS ====================

const getPayrollReport = async (req, res) => {
  try {
    const { month, year, reportType, department } = req.query;
    const query = { month: parseInt(month), year: parseInt(year) };
    if (department) query.department = department;
    
    const payrolls = await Payroll.find(query).populate('employeeId', 'name employeeId department');
    res.json({ success: true, data: payrolls });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const exportPayrollReport = async (req, res) => {
  try {
    const { month, year, format = 'csv' } = req.query;
    const payrolls = await Payroll.find({ month: parseInt(month), year: parseInt(year) }).populate('employeeId', 'name employeeId');
    
    if (format === 'csv') {
      let csv = 'Employee Name,Employee ID,Basic Salary,Allowances,Deductions,Net Salary\n';
      payrolls.forEach(p => {
        csv += `${p.employeeId?.name || 'N/A'},${p.employeeId?.employeeId || 'N/A'},${p.basic},${p.allowances?.total || 0},${p.deductions?.total || 0},${p.netSalary}\n`;
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=payroll_${month}_${year}.csv`);
      return res.send(csv);
    }
    
    res.json({ success: true, data: payrolls });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const exportBankFile = async (req, res) => {
  try {
    const { month, year } = req.query;
    const payrolls = await Payroll.find({ month: parseInt(month), year: parseInt(year), status: 'approved' }).populate('employeeId', 'name bankDetails');
    
    let wpsData = 'Employee Name,Account Number,Bank Name,Amount\n';
    payrolls.forEach(p => {
      const bank = p.employeeId?.bankDetails || {};
      wpsData += `${p.employeeId?.name || 'N/A'},${bank.accountNumber || ''},${bank.bankName || ''},${p.netSalary}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=wps_${month}_${year}.csv`);
    res.send(wpsData);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPayrollHistory = async (req, res) => {
  try {
    const { year, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const payrolls = await Payroll.aggregate([
      { $match: year ? { year: parseInt(year) } : {} },
      { $group: { _id: { month: '$month', year: '$year' }, totalPayroll: { $sum: '$netSalary' }, employeeCount: { $sum: 1 } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) }
    ]);
    
    const total = await Payroll.aggregate([
      { $match: year ? { year: parseInt(year) } : {} },
      { $group: { _id: { month: '$month', year: '$year' } } },
      { $count: 'total' }
    ]);
    
    res.json({ success: true, data: payrolls, pagination: { page, limit, total: total[0]?.total || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.payrollId).populate('employeeId', 'name employeeId department');
    if (!payroll) return res.status(404).json({ success: false, error: 'Payroll not found' });
    res.json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const cancelPayroll = async (req, res) => {
  try {
    const { reason } = req.body;
    const payroll = await Payroll.findByIdAndUpdate(req.params.payrollId, { status: 'cancelled', cancellationReason: reason, cancelledAt: new Date(), cancelledBy: req.user._id });
    if (!payroll) return res.status(404).json({ success: false, error: 'Payroll not found' });
    res.json({ success: true, message: 'Payroll cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPayrollSettings = async (req, res) => {
  try {
    const settings = await PayrollSettings.findOne() || {
      payrollCycle: 'monthly',
      payrollDay: 25,
      currency: 'AED',
      autoProcess: false,
      defaultDeductions: { tax: 0, socialSecurity: 0, pension: 0 }
    };
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updatePayrollSettings = async (req, res) => {
  try {
    const settings = await PayrollSettings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const sendSalarySlips = async (req, res) => {
  try {
    const { month, year, employeeIds, sendEmail = true, sendSMS = false } = req.body;
    const query = { month, year };
    if (employeeIds?.length) query.employeeId = { $in: employeeIds };
    
    const payrolls = await Payroll.find(query).populate('employeeId', 'name email phone');
    
    for (const payroll of payrolls) {
      if (sendEmail && payroll.employeeId?.email) {
        // Send email logic here
        console.log(`Sending salary slip to ${payroll.employeeId.email}`);
      }
    }
    
    res.json({ success: true, message: `Salary slips sent to ${payrolls.length} employees` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const bulkDownloadSlips = async (req, res) => {
  try {
    const { month, year, employeeIds } = req.body;
    const query = { month, year };
    if (employeeIds?.length) query.employeeId = { $in: employeeIds };
    
    const payrolls = await Payroll.find(query).populate('employeeId', 'name employeeId');
    // In production, create a ZIP file with all salary slips
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=salary_slips_${month}_${year}.zip`);
    res.send('Mock ZIP content');
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPayrollStatistics = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      const payrolls = await Payroll.find({ month, year: parseInt(year) });
      monthlyData.push({
        month,
        total: payrolls.reduce((sum, p) => sum + p.netSalary, 0),
        employeeCount: payrolls.length
      });
    }
    
    const totalPayroll = monthlyData.reduce((sum, m) => sum + m.total, 0);
    const totalEmployees = monthlyData.reduce((sum, m) => sum + m.employeeCount, 0);
    const averageSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;
    
    res.json({
      success: true,
      data: {
        year: parseInt(year),
        monthlyData,
        averageSalary,
        totalGrowth: 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getDepartmentSummary = async (req, res) => {
  try {
    const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;
    
    const summary = await Payroll.aggregate([
      { $match: { month: parseInt(month), year: parseInt(year) } },
      { $lookup: { from: 'users', localField: 'employeeId', foreignField: '_id', as: 'employee' } },
      { $unwind: '$employee' },
      { $group: { _id: '$employee.department', totalPayroll: { $sum: '$netSalary' }, employeeCount: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: summary.map(s => ({
        department: s._id || 'Unassigned',
        totalPayroll: s.totalPayroll,
        employeeCount: s.employeeCount,
        averageSalary: s.employeeCount > 0 ? s.totalPayroll / s.employeeCount : 0
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCountrySummary = async (req, res) => {
  try {
    const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;
    
    const summary = await Payroll.aggregate([
      { $match: { month: parseInt(month), year: parseInt(year) } },
      { $group: { _id: '$country', totalPayroll: { $sum: '$netSalary' }, employeeCount: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: summary.map(s => ({
        country: s._id || 'UAE',
        totalPayroll: s.totalPayroll,
        employeeCount: s.employeeCount,
        averageSalary: s.employeeCount > 0 ? s.totalPayroll / s.employeeCount : 0
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getPayrollDashboard,
  getPayrollSummary,
  getEmployeesForPayroll,
  previewPayroll,
  processPayroll,
  processSelectedPayroll,
  processSinglePayroll,
  approvePayroll,
  rejectPayroll,
  getPayrollReport,
  exportPayrollReport,
  exportBankFile,
  getPayrollHistory,
  getPayrollById,
  cancelPayroll,
  getPayrollSettings,
  updatePayrollSettings,
  sendSalarySlips,
  bulkDownloadSlips,
  getPayrollStatistics,
  getDepartmentSummary,
  getCountrySummary
};