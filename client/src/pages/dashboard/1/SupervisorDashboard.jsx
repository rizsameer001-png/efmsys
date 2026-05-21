// client/src/pages/dashboard/SupervisorDashboard.jsx
import React from 'react';
import StatCard from '../../components/dashboard/StatCard';

const SupervisorDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Supervisor Dashboard</h1>
        <p className="text-gray-500">Field operations and technician oversight.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Technicians" value="8" icon="🔧" color="blue" />
        <StatCard title="Active Jobs" value="5" icon="⚡" color="orange" />
        <StatCard title="Completed" value="12" icon="✅" color="green" />
        <StatCard title="Pending Review" value="3" icon="⏳" color="yellow" />
      </div>
    </div>
  );
};

export default SupervisorDashboard;