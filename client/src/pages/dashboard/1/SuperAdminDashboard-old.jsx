// client/src/pages/dashboard/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { userApi } from '../../api';
import StatCard from '../../components/dashboard/StatCard';
import Spinner from '../../components/common/Spinner';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await userApi.getUsers({ limit: 1 });
      setStats({
        totalUsers: response.data.data.pagination.total,
        activeUsers: 0,
        pendingApprovals: 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals || 0}
          icon="⏳"
          color="yellow"
        />
        <StatCard
          title="System Status"
          value="Online"
          icon="🟢"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <p className="text-gray-500">No recent activity</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">System Overview</h3>
          <p className="text-gray-500">System is running normally</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;