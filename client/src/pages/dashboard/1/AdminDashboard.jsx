// client/src/pages/dashboard/AdminDashboard.jsx
import React from 'react';
import StatCard from '../../components/dashboard/StatCard';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Manage buildings, staff, and operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Buildings" value="12" icon="🏢" color="blue" />
        <StatCard title="Staff" value="156" icon="👥" color="green" />
        <StatCard title="Open Complaints" value="23" icon="📋" color="orange" />
        <StatCard title="Tasks Today" value="45" icon="✅" color="purple" />
      </div>
    </div>
  );
};

export default AdminDashboard;