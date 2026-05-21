// client/src/pages/dashboard/HRDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../../api/user.api';
import { taskApi } from '../../api/task.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const HRDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [recentHires, setRecentHires] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeave: 0,
    newThisMonth: 0,
    departments: [],
    attendanceRate: 94,
    avgResponseTime: 24
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    showToast('Logged out successfully', 'success');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // 🔴 Fetch all employees
      const usersRes = await userApi.getUsers({ limit: 100 });
      let employeesList = [];
      
      if (usersRes.data?.success && usersRes.data?.data?.users) {
        employeesList = usersRes.data.data.users;
      } else if (Array.isArray(usersRes.data?.data)) {
        employeesList = usersRes.data.data;
      } else if (Array.isArray(usersRes.data)) {
        employeesList = usersRes.data;
      }
      
      setEmployees(employeesList);
      
      // Calculate department stats
      const deptMap = new Map();
      employeesList.forEach(emp => {
        const dept = emp.department || 'Other';
        deptMap.set(dept, (deptMap.get(dept) || 0) + 1);
      });
      
      const departments = Array.from(deptMap.entries()).map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / employeesList.length) * 100)
      }));
      
      // Calculate statistics
      const activeCount = employeesList.filter(e => e.status === 'active').length;
      const onLeaveCount = employeesList.filter(e => e.status === 'on_leave').length;
      const newThisMonth = employeesList.filter(e => {
        const joinDate = new Date(e.joiningDate || e.createdAt);
        const now = new Date();
        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
      }).length;
      
      setStats({
        totalEmployees: employeesList.length,
        activeEmployees: activeCount,
        onLeave: onLeaveCount,
        newThisMonth: newThisMonth,
        departments: departments.slice(0, 5),
        attendanceRate: 94,
        avgResponseTime: 24
      });
      
      // Recent hires (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recent = employeesList
        .filter(e => new Date(e.joiningDate || e.createdAt) >= thirtyDaysAgo)
        .slice(0, 5)
        .map(e => ({
          id: e._id,
          name: `${e.firstName || ''} ${e.lastName || ''}`.trim(),
          role: e.role,
          department: e.department,
          joiningDate: e.joiningDate || e.createdAt,
          email: e.email
        }));
      
      setRecentHires(recent);
      
      // Mock leave requests (in real app, fetch from leave API)
      setLeaveRequests([
        { id: 1, name: 'John Smith', type: 'Annual Leave', days: 5, status: 'pending', startDate: '2024-03-20' },
        { id: 2, name: 'Sarah Johnson', type: 'Sick Leave', days: 2, status: 'pending', startDate: '2024-03-18' },
        { id: 3, name: 'Mike Chen', type: 'Personal Leave', days: 1, status: 'pending', startDate: '2024-03-22' }
      ]);
      
      // Mock upcoming birthdays
      setUpcomingBirthdays([
        { id: 1, name: 'Lisa Wong', department: 'Operations', date: 'March 25', daysLeft: 5 },
        { id: 2, name: 'David Kim', department: 'Technical', date: 'March 28', daysLeft: 8 },
        { id: 3, name: 'Anna Lee', department: 'HR', date: 'April 2', daysLeft: 12 }
      ]);
      
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      if (error.response?.status !== 403) {
        showToast('Failed to load dashboard data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      // API call to approve leave
      showToast('Leave request approved', 'success');
      setLeaveRequests(prev => prev.filter(l => l.id !== leaveId));
    } catch (error) {
      showToast('Failed to approve leave', 'error');
    }
  };

  const handleRejectLeave = async (leaveId) => {
    try {
      showToast('Leave request rejected', 'success');
      setLeaveRequests(prev => prev.filter(l => l.id !== leaveId));
    } catch (error) {
      showToast('Failed to reject leave', 'error');
    }
  };

  const getDepartmentColor = (index) => {
    const colors = ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-purple-100 text-purple-800', 'bg-orange-100 text-orange-800', 'bg-pink-100 text-pink-800'];
    return colors[index % colors.length];
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header with Logout */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}! Manage employee resources and records.</p>
        </div>
        <Button variant="danger" onClick={handleLogout} size="sm" className="bg-red-500 hover:bg-red-600">
          <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</p>
          <p className="text-sm text-gray-500">Total Employees</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-green-600">{stats.activeEmployees}</p>
          <p className="text-sm text-gray-500">Active Employees</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-orange-600">{stats.onLeave}</p>
          <p className="text-sm text-gray-500">On Leave</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-purple-600">{stats.newThisMonth}</p>
          <p className="text-sm text-gray-500">New This Month</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-green-600">{stats.attendanceRate}%</p>
          <p className="text-sm text-gray-500">Attendance Rate</p>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Department Distribution</h3>
            <Link to="/users" className="text-sm text-blue-600 hover:text-blue-800">View All →</Link>
          </div>
          <div className="space-y-3">
            {stats.departments.length > 0 ? (
              stats.departments.map((dept, idx) => (
                <div key={dept.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{dept.name}</span>
                    <span className="text-gray-500">{dept.count} employees ({dept.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${dept.name === 'operations' ? 'bg-blue-500' : dept.name === 'technical' ? 'bg-green-500' : dept.name === 'hr' ? 'bg-purple-500' : 'bg-orange-500'}`}
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No department data available</p>
            )}
          </div>
        </Card>

        {/* Recent Hires */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Recent Hires</h3>
            <Link to="/employee/onboarding" className="text-sm text-blue-600 hover:text-blue-800">+ Add Employee</Link>
          </div>
          <div className="space-y-3">
            {recentHires.length > 0 ? (
              recentHires.map(hire => (
                <div key={hire.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{hire.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{hire.role} • {hire.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      Joined: {new Date(hire.joiningDate).toLocaleDateString()}
                    </p>
                    <Link to={`/users/${hire.id}`} className="text-xs text-blue-600 hover:text-blue-800">
                      View Profile →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No recent hires</p>
            )}
          </div>
        </Card>
      </div>

      {/* Leave Requests */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Pending Leave Requests</h3>
          <Link to="/leaves" className="text-sm text-blue-600 hover:text-blue-800">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          {leaveRequests.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.days} days</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleApproveLeave(request.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectLeave(request.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500">No pending leave requests</p>
            </div>
          )}
        </div>
      </Card>

      {/* Upcoming Birthdays */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Upcoming Birthdays</h3>
          <span className="text-xs text-gray-500">This month</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingBirthdays.length > 0 ? (
            upcomingBirthdays.map(birthday => (
              <div key={birthday.id} className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center">
                  <span className="text-xl">🎂</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{birthday.name}</p>
                  <p className="text-xs text-gray-500">{birthday.department}</p>
                  <p className="text-xs text-pink-600">{birthday.date} • in {birthday.daysLeft} days</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3 py-4">No upcoming birthdays</p>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/employee/onboarding" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
          <div className="text-2xl mb-1">👤</div>
          <p className="text-sm font-medium">Onboard Employee</p>
        </Link>
        <Link to="/users" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors">
          <div className="text-2xl mb-1">👥</div>
          <p className="text-sm font-medium">Employee Directory</p>
        </Link>
        <Link to="/attendance" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors">
          <div className="text-2xl mb-1">📊</div>
          <p className="text-sm font-medium">Attendance Report</p>
        </Link>
        <Link to="/payroll" className="bg-orange-50 p-4 rounded-lg text-center hover:bg-orange-100 transition-colors">
          <div className="text-2xl mb-1">💰</div>
          <p className="text-sm font-medium">Payroll</p>
        </Link>
      </div>
    </div>
  );
};

export default HRDashboard;