// client/src/pages/dashboard/TechnicianDashboard.jsx
import React from 'react';
import StatCard from '../../components/dashboard/StatCard';

const TechnicianDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Technician Dashboard</h1>
        <p className="text-gray-500">Your tasks and assignments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Assigned Tasks" value="4" icon="📋" color="blue" />
        <StatCard title="In Progress" value="2" icon="⚡" color="orange" />
        <StatCard title="Completed" value="8" icon="✅" color="green" />
        <StatCard title="Rating" value="4.8" icon="⭐" color="yellow" />
      </div>
    </div>
  );
};

export default TechnicianDashboard;