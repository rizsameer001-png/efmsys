// client/src/pages/dashboard/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../../api/user.api';
import { buildingApi } from '../../api/building.api';
import { taskApi } from '../../api/task.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { formatNumber } from '../../utils/formatters';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, newThisMonth: 0 },
    buildings: { total: 0, active: 0, totalUnits: 0 },
    tasks: { total: 0, completed: 0, inProgress: 0, overdue: 0 },
    complaints: { total: 0, resolved: 0, pending: 0 },
    revenue: { total: 0, thisMonth: 0, growth: 0 }
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, buildingsRes, tasksRes] = await Promise.all([
        userApi.getUsers({ limit: 1 }),
        buildingApi.getBuildings(),
        taskApi.getTaskStatistics()
      ]);

      setStats({
        users: {
          total: usersRes.data.data?.pagination?.total || 0,
          active: Math.floor((usersRes.data.data?.pagination?.total || 0) * 0.85),
          newThisMonth: 24
        },
        buildings: {
          total: buildingsRes.data.data?.buildings?.length || 0,
          active: buildingsRes.data.data?.buildings?.filter(b => b.status === 'active').length || 0,
          totalUnits: 1250
        },
        tasks: {
          total: tasksRes.data.data?.total || 0,
          completed: tasksRes.data.data?.completed || 0,
          inProgress: tasksRes.data.data?.inProgress || 0,
          overdue: tasksRes.data.data?.overdue || 0
        },
        complaints: {
          total: 156,
          resolved: 134,
          pending: 22
        },
        revenue: {
          total: 1250000,
          thisMonth: 145000,
          growth: 12.5
        }
      });

      setRecentActivities([
        { id: 1, type: 'user', action: 'New user registered', user: 'John Doe', time: '2 minutes ago', icon: '👤' },
        { id: 2, type: 'task', action: 'Task completed', task: 'Fix AC in Tower A', time: '15 minutes ago', icon: '✅' },
        { id: 3, type: 'complaint', action: 'New complaint raised', complaint: 'Plumbing issue', time: '1 hour ago', icon: '📋' },
        { id: 4, type: 'building', action: 'New building added', building: 'Tech Hub', time: '3 hours ago', icon: '🏢' }
      ]);

      setRecentUsers([
        { id: 1, name: 'John Smith', email: 'john@example.com', role: 'admin', joined: '2024-01-15' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'manager', joined: '2024-01-14' },
        { id: 3, name: 'Mike Chen', email: 'mike@example.com', role: 'technician', joined: '2024-01-13' }
      ]);

    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h1>
        <p className="text-blue-100 mt-1">Here's what's happening with your enterprise today.</p>
        <div className="mt-4 flex space-x-4">
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <p className="text-sm">Total Revenue</p>
            <p className="text-2xl font-bold">${formatNumber(stats.revenue.total)}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2">
            <p className="text-sm">Growth Rate</p>
            <p className="text-2xl font-bold">+{stats.revenue.growth}%</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
              <p className="text-xs text-green-600 mt-1">+{stats.users.newThisMonth} this month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/users" className="text-sm text-blue-600 hover:text-blue-800">View all users →</Link>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Buildings</p>
              <p className="text-3xl font-bold text-gray-900">{stats.buildings.total}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.buildings.totalUnits} total units</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/buildings" className="text-sm text-blue-600 hover:text-blue-800">Manage buildings →</Link>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.tasks.total}</p>
              <p className="text-xs text-green-600 mt-1">{stats.tasks.completed} completed</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-800">View tasks →</Link>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Complaints</p>
              <p className="text-3xl font-bold text-gray-900">{stats.complaints.total}</p>
              <p className="text-xs text-red-600 mt-1">{stats.complaints.pending} pending</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/complaints" className="text-sm text-blue-600 hover:text-blue-800">View complaints →</Link>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Task Status Overview</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Completed</span>
                <span>{Math.round((stats.tasks.completed / stats.tasks.total) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.tasks.completed / stats.tasks.total) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>In Progress</span>
                <span>{Math.round((stats.tasks.inProgress / stats.tasks.total) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats.tasks.inProgress / stats.tasks.total) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overdue</span>
                <span>{Math.round((stats.tasks.overdue / stats.tasks.total) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(stats.tasks.overdue / stats.tasks.total) * 100}%` }} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-center space-x-3 pb-3 border-b last:border-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span>{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Users Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Recent Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;