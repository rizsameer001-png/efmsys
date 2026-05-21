// client/src/pages/dashboard/ManagerDashboard.jsx
import React from 'react';
import StatCard from '../../components/dashboard/StatCard';

const ManagerDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-500">Monitor team performance and tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Team Members" value="12" icon="👥" color="blue" />
        <StatCard title="Active Tasks" value="8" icon="⚡" color="orange" />
        <StatCard title="Completed" value="23" icon="✅" color="green" />
        <StatCard title="SLA Rate" value="98%" icon="🎯" color="purple" />
      </div>
    </div>
  );
};

export default ManagerDashboard;