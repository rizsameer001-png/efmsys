// client/src/pages/dashboard/CustomerDashboard.jsx
import React from 'react';
import StatCard from '../../components/dashboard/StatCard';

const CustomerDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500">Welcome back! Manage your property and requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="My Properties" value="1" icon="🏠" color="blue" />
        <StatCard title="Active Complaints" value="2" icon="📋" color="orange" />
        <StatCard title="Pending Payment" value="$234" icon="💰" color="red" />
        <StatCard title="Resolved" value="5" icon="✅" color="green" />
      </div>
    </div>
  );
};

export default CustomerDashboard;