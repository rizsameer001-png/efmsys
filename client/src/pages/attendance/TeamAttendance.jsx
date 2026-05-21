// client/src/pages/attendance/TeamAttendance.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { attendanceApi } from '../../api/attendance.api';
import { leaveApi } from '../../api/leave.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const TeamAttendance = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [teamAttendance, setTeamAttendance] = useState([]);
  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0, late: 0, onLeave: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  const fetchTeamAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const response = await attendanceApi.getTeamAttendance(selectedDate, departmentFilter);
      if (response.data.success) {
        setTeamAttendance(response.data.data.employees);
        setSummary(response.data.data.summary);
        
        // Extract unique departments
        const uniqueDepts = [...new Set(response.data.data.employees.map(e => e.department))];
        setDepartments(uniqueDepts);
      }
    } catch (error) {
      console.error('Fetch team attendance error:', error);
      showToast('Failed to load team attendance', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, departmentFilter, showToast]);

  useEffect(() => {
    fetchTeamAttendance();
  }, [fetchTeamAttendance]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleMarkAttendance = async (employeeId, status) => {
    try {
      await attendanceApi.markAttendance(employeeId, { date: selectedDate, status });
      showToast('Attendance marked successfully', 'success');
      fetchTeamAttendance();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to mark attendance', 'error');
    }
  };

  const handleSendReminder = (employee) => {
    // Send reminder notification
    showToast(`Reminder sent to ${employee.name}`, 'info');
  };

  const handleContactEmployee = (employee) => {
    window.location.href = `tel:${employee.phone || employee.email}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return '✅';
      case 'late': return '⏰';
      case 'absent': return '❌';
      case 'leave': return '🏖️';
      default: return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'leave': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['Employee Name', 'Role', 'Department', 'Status', 'Check In', 'Check Out', 'Total Hours'];
    const rows = teamAttendance.map(emp => [
      emp.name,
      emp.role,
      emp.department,
      emp.status,
      emp.checkInTime ? new Date(emp.checkInTime).toLocaleTimeString() : '-',
      emp.checkOutTime ? new Date(emp.checkOutTime).toLocaleTimeString() : '-',
      emp.totalHours
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team_attendance_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Attendance</h1>
          <p className="text-gray-500 mt-1">Monitor your team's daily attendance</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2">
            <span className="text-gray-500">📅</span>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="focus:outline-none"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <Button variant="secondary" size="sm" onClick={exportToCSV}>
            📥 Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{summary.total}</p>
          <p className="text-sm text-gray-500">Total Team</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{summary.present}</p>
          <p className="text-sm text-gray-500">Present</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
          <p className="text-sm text-gray-500">Absent</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{summary.late}</p>
          <p className="text-sm text-gray-500">Late</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{summary.onLeave}</p>
          <p className="text-sm text-gray-500">On Leave</p>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Employee Attendance</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            >
              📊 Table View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded ${viewMode === 'cards' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            >
              🃏 Card View
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamAttendance.map(employee => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="text-sm font-medium">{employee.name?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                          <p className="text-xs text-gray-500">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{employee.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(employee.status)}`}>
                        {getStatusIcon(employee.status)} {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.checkInTime ? new Date(employee.checkInTime).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.checkOutTime ? new Date(employee.checkOutTime).toLocaleTimeString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.totalHours || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleContactEmployee(employee)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Contact"
                        >
                          📞
                        </button>
                        <button
                          onClick={() => handleSendReminder(employee)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Send Reminder"
                        >
                          🔔
                        </button>
                        {employee.status === 'absent' && (
                          <button
                            onClick={() => handleMarkAttendance(employee.id, 'present')}
                            className="text-green-600 hover:text-green-800"
                            title="Mark Present"
                          >
                            ✅
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {teamAttendance.map(employee => (
              <Card key={employee.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-lg font-medium">{employee.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{employee.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{employee.role}</p>
                      <p className="text-xs text-gray-400">{employee.department}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(employee.status)}`}>
                    {getStatusIcon(employee.status)} {employee.status}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Check In</p>
                    <p className="font-medium">{employee.checkInTime ? new Date(employee.checkInTime).toLocaleTimeString() : '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Check Out</p>
                    <p className="font-medium">{employee.checkOutTime ? new Date(employee.checkOutTime).toLocaleTimeString() : '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Total Hours</p>
                    <p className="font-medium">{employee.totalHours || 0} hrs</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Late Minutes</p>
                    <p className="font-medium text-yellow-600">{employee.lateMinutes || 0} min</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => handleContactEmployee(employee)}
                    className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                  >
                    📞 Contact
                  </button>
                  <button
                    onClick={() => handleSendReminder(employee)}
                    className="px-2 py-1 text-xs bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100"
                  >
                    🔔 Reminder
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Absent Employees Section */}
      {summary.absent > 0 && (
        <Card className="p-6 bg-red-50 border border-red-200">
          <h3 className="font-semibold text-red-800 mb-3">⚠️ Absent Employees - Action Required</h3>
          <div className="space-y-2">
            {teamAttendance.filter(e => e.status === 'absent').map(employee => (
              <div key={employee.id} className="flex justify-between items-center p-2 bg-white rounded-lg">
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-gray-500">{employee.role} • {employee.department}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleContactEmployee(employee)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Contact
                  </button>
                  <button
                    onClick={() => handleMarkAttendance(employee.id, 'present')}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Mark Present
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TeamAttendance;