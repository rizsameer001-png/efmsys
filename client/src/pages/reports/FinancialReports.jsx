// client/src/pages/reports/FinancialReports.jsx
import React, { useState, useEffect } from 'react';
import { salaryApi } from '../../api/salary.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Select from '../../components/common/Select';

const FinancialReports = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    reportType: 'payroll_summary',
    department: 'all'
  });

  const years = [2023, 2024, 2025, 2026];
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const reportTypes = [
    { value: 'payroll_summary', label: 'Payroll Summary' },
    { value: 'department_payroll', label: 'Department-wise Payroll' },
    { value: 'salary_comparison', label: 'Salary Comparison' },
    { value: 'tax_report', label: 'Tax Report' },
    { value: 'bank_transfer', label: 'Bank Transfer Report' }
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'operations', label: 'Operations' },
    { value: 'technical', label: 'Technical' },
    { value: 'housekeeping', label: 'Housekeeping' },
    { value: 'security', label: 'Security' },
    { value: 'management', label: 'Management' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' }
  ];

  useEffect(() => {
    fetchReportData();
  }, [filters.year, filters.month, filters.reportType, filters.department]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const params = {
        year: filters.year,
        month: filters.month,
        reportType: filters.reportType,
        department: filters.department !== 'all' ? filters.department : undefined
      };
      
      const response = await salaryApi.getPayrollReport(params.year, params.month, params.reportType, params.department);
      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (error) {
      console.error('Fetch report error:', error);
      showToast('Failed to load financial report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const response = await salaryApi.exportPayrollReport(
        filters.year,
        filters.month,
        filters.reportType,
        filters.department !== 'all' ? filters.department : undefined,
        format
      );
      
      const blob = new Blob([response.data], { 
        type: format === 'csv' ? 'text/csv' : 
              format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
              'application/pdf'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial_report_${filters.month}_${filters.year}.${format === 'excel' ? 'xlsx' : format}`;
      a.click();
      URL.revokeObjectURL(url);
      
      showToast('Report exported successfully', 'success');
    } catch (error) {
      showToast('Failed to export report', 'error');
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(amount || 0);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <p className="text-gray-500 mt-1">View payroll and financial analytics</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Select
            label="Year"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
            options={years.map(y => ({ value: y, label: y.toString() }))}
          />
          <Select
            label="Month"
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
            options={months}
          />
          <Select
            label="Report Type"
            value={filters.reportType}
            onChange={(e) => setFilters({ ...filters, reportType: e.target.value })}
            options={reportTypes}
          />
          <Select
            label="Department"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            options={departments}
          />
          <div className="flex items-end gap-2">
            <Button onClick={fetchReportData}>Generate Report</Button>
            <Button variant="secondary" onClick={() => setFilters({
              year: new Date().getFullYear(),
              month: new Date().getMonth() + 1,
              reportType: 'payroll_summary',
              department: 'all'
            })}>Reset</Button>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      {reportData?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(reportData.summary.totalPayroll)}</p>
            <p className="text-sm text-gray-500">Total Payroll</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.summary.averageSalary)}</p>
            <p className="text-sm text-gray-500">Average Salary</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{reportData.summary.totalEmployees}</p>
            <p className="text-sm text-gray-500">Total Employees</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(reportData.summary.totalDeductions)}</p>
            <p className="text-sm text-gray-500">Total Deductions</p>
          </Card>
        </div>
      )}

      {/* Report Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Financial Details</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => handleExport('csv')} isLoading={exporting}>
              📥 Export CSV
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleExport('excel')} isLoading={exporting}>
              📊 Export Excel
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleExport('pdf')} isLoading={exporting}>
              📄 Export PDF
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {reportData?.records?.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allowances</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overtime</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.records.map((record, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(record.basicSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(record.allowances)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(record.overtime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {formatCurrency(record.deductions)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCurrency(record.netSalary)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">No data available</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FinancialReports;