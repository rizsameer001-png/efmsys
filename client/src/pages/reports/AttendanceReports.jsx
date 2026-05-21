// client/src/pages/reports/AttendanceReports.jsx
import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendance.api';
import { userApi } from '../../api/user.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Select from '../../components/common/Select';

const AttendanceReports = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    department: 'all',
    employeeId: 'all',
    reportType: 'summary'
  });
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const reportTypes = [
    { value: 'summary', label: 'Summary Report' },
    { value: 'detailed', label: 'Detailed Report' },
    { value: 'department', label: 'Department-wise Report' },
    { value: 'late_analysis', label: 'Late Arrival Analysis' },
    { value: 'absent_analysis', label: 'Absenteeism Analysis' }
  ];

  useEffect(() => {
    fetchReportData();
    fetchEmployees();
  }, [filters.startDate, filters.endDate, filters.department, filters.reportType]);

  const fetchEmployees = async () => {
    try {
      const response = await userApi.getUsers({ limit: 500 });
      if (response.data.success) {
        const users = response.data.data?.users || [];
        setEmployees(users);
        const uniqueDepts = [...new Set(users.map(u => u.department).filter(Boolean))];
        setDepartments(uniqueDepts.map(d => ({ value: d, label: d })));
      }
    } catch (error) {
      console.error('Fetch employees error:', error);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        department: filters.department !== 'all' ? filters.department : undefined,
        employeeId: filters.employeeId !== 'all' ? filters.employeeId : undefined,
        reportType: filters.reportType
      };
      
      const response = await attendanceApi.getAttendanceReport(params);
      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (error) {
      console.error('Fetch report error:', error);
      showToast('Failed to load report data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        department: filters.department !== 'all' ? filters.department : undefined,
        employeeId: filters.employeeId !== 'all' ? filters.employeeId : undefined,
        reportType: filters.reportType,
        format
      };
      
      const response = await attendanceApi.exportAttendance(params);
      
      const blob = new Blob([response.data], { 
        type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_report_${filters.startDate}_to_${filters.endDate}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      a.click();
      URL.revokeObjectURL(url);
      
      showToast('Report exported successfully', 'success');
    } catch (error) {
      showToast('Failed to export report', 'error');
    } finally {
      setExporting(false);
    }
  };

  const getAttendanceRateColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
        <p className="text-gray-500 mt-1">Track and analyze employee attendance</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
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
            options={[
              { value: 'all', label: 'All Departments' },
              ...departments
            ]}
          />
          <Select
            label="Employee"
            value={filters.employeeId}
            onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
            options={[
              { value: 'all', label: 'All Employees' },
              ...employees.map(e => ({ value: e._id, label: `${e.firstName} ${e.lastName}` }))
            ]}
          />
          <div className="flex items-end gap-2">
            <Button onClick={fetchReportData}>Generate Report</Button>
            <Button variant="secondary" onClick={() => setFilters({
              startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              department: 'all',
              employeeId: 'all',
              reportType: 'summary'
            })}>Reset</Button>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      {reportData?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{reportData.summary.totalEmployees}</p>
            <p className="text-sm text-gray-500">Total Employees</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{reportData.summary.avgAttendanceRate}%</p>
            <p className="text-sm text-gray-500">Avg Attendance Rate</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{reportData.summary.totalAbsentDays}</p>
            <p className="text-sm text-gray-500">Total Absent Days</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{reportData.summary.totalLateDays}</p>
            <p className="text-sm text-gray-500">Total Late Days</p>
          </Card>
        </div>
      )}

      {/* Report Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Attendance Details</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => handleExport('csv')} isLoading={exporting}>
              📥 Export CSV
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleExport('excel')} isLoading={exporting}>
              📊 Export Excel
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {reportData?.records?.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Late Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.records.map((record, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.presentDays}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{record.absentDays}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{record.lateDays}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{record.leaveDays}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${getAttendanceRateColor(record.attendanceRate)}`}>
                        {record.attendanceRate}%
                      </span>
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

export default AttendanceReports;