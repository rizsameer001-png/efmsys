/**
 * TASK FILTERS COMPONENT
 * Provides filtering options for task list
 */

import React from 'react';
import Select from '../common/Select';

const TaskFilters = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'waiting_parts', label: 'Waiting Parts' },
    { value: 'completed', label: 'Completed' },
    { value: 'verified', label: 'Verified' },
    { value: 'closed', label: 'Closed' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priority' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'preventive_maintenance', label: 'Preventive Maintenance' },
    { value: 'corrective_maintenance', label: 'Corrective Maintenance' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'emergency', label: 'Emergency' }
  ];

  return (
    <div className="flex flex-wrap gap-4">
      <Select
        label="Status"
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        options={statusOptions}
        className="min-w-[150px]"
      />
      <Select
        label="Priority"
        value={filters.priority}
        onChange={(e) => onFilterChange('priority', e.target.value)}
        options={priorityOptions}
        className="min-w-[150px]"
      />
      <Select
        label="Type"
        value={filters.type}
        onChange={(e) => onFilterChange('type', e.target.value)}
        options={typeOptions}
        className="min-w-[150px]"
      />
      
      {/* Clear Filters */}
      {(filters.status || filters.priority || filters.type) && (
        <button
          onClick={() => {
            onFilterChange('status', '');
            onFilterChange('priority', '');
            onFilterChange('type', '');
          }}
          className="text-sm text-red-600 hover:text-red-700 self-end mb-4"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default TaskFilters;