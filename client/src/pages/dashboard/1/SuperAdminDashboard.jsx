// client/src/pages/dashboard/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { userApi } from '../../api';
import StatCard from '../../components/dashboard/StatCard';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    totalBuildings: 0,
    totalComplaints: 0,
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch users
      const usersResponse = await userApi.getUsers({ limit: 1 });
      
      // Safely access nested properties
      const totalUsers = usersResponse?.data?.data?.pagination?.total || 0;
      
      setStats({
        totalUsers: totalUsers,
        activeUsers: Math.floor(totalUsers * 0.8), // Placeholder
        pendingApprovals: 5, // Placeholder
        totalBuildings: 3, // Placeholder
        totalComplaints: 12, // Placeholder
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      showToast('Failed to load dashboard data', 'error');
      // Set default stats on error
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        pendingApprovals: 0,
        totalBuildings: 0,
        totalComplaints: 0,
      });
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
          value={stats.totalUsers}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Total Buildings"
          value={stats.totalBuildings}
          icon="🏢"
          color="purple"
        />
        <StatCard
          title="Open Complaints"
          value={stats.totalComplaints}
          icon="📋"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <p className="text-gray-500">No recent activity to display</p>
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