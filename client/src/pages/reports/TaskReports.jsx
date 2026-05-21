// client/src/pages/reports/TaskReports.jsx
import React, { useState, useEffect } from 'react';
import { taskApi } from '../../api/task.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Select from '../../components/common/Select';
import DatePicker from '../../components/common/DatePicker';

const TaskReports = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: 'all',
    priority: 'all',
    department: 'all',
    technicianId: 'all',
    buildingId: 'all',
    groupBy: 'status'
  });
  const [technicians, setTechnicians] = useState([]);
  const [buildings, setBuildings] = useState([]);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'verified', label: 'Verified' },
    { value: 'closed', label: 'Closed' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const groupByOptions = [
    { value: 'status', label: 'Group by Status' },
    { value: 'priority', label: 'Group by Priority' },
    { value: 'technician', label: 'Group by Technician' },
    { value: 'building', label: 'Group by Building' },
    { value: 'day', label: 'Group by Day' },
    { value: 'week', label: 'Group by Week' },
    { value: 'month', label: 'Group by Month' }
  ];

  useEffect(() => {
    fetchReportData();
    fetchFiltersData();
  }, [filters.startDate, filters.endDate, filters.status, filters.priority, filters.groupBy]);

  const fetchFiltersData = async () => {
    try {
      const [techRes, buildingRes] = await Promise.all([
        userApi.getUsers({ role: 'technician', limit: 100 }),
        buildingApi.getBuildings()
      ]);
      
      if (techRes.data.success) {
        setTechnicians(techRes.data.data?.users || []);
      }
      if (buildingRes.data.success) {
        setBuildings(buildingRes.data.data?.buildings || []);
      }
    } catch (error) {
      console.error('Fetch filters error:', error);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        status: filters.status !== 'all' ? filters.status : undefined,
        priority: filters.priority !== 'all' ? filters.priority : undefined,
        groupBy: filters.groupBy,
        technicianId: filters.technicianId !== 'all' ? filters.technicianId : undefined,
        buildingId: filters.buildingId !== 'all' ? filters.buildingId : undefined,
        department: filters.department !== 'all' ? filters.department : undefined
      };
      
      const response = await taskApi.getTaskReport(params);
      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (error) {
      console.error('Fetch report error:', error);
      showToast('Failed to load report data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const params = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        status: filters.status !== 'all' ? filters.status : undefined,
        priority: filters.priority !== 'all' ? filters.priority : undefined,
        format
      };
      
      const response = await taskApi.exportTaskReport(params);
      
      // Create blob and download
      const blob = new Blob([response.data], { 
        type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `task_report_${filters.startDate}_to_${filters.endDate}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      a.click();
      URL.revokeObjectURL(url);
      
      showToast('Report exported successfully', 'success');
    } catch (error) {
      showToast('Failed to export report', 'error');
    } finally {
      setExporting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      accepted: 'bg-cyan-100 text-cyan-800',
      in_progress: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      verified: 'bg-purple-100 text-purple-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Task Reports</h1>
        <p className="text-gray-500 mt-1">Analyze task performance and metrics</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={statusOptions}
          />
          <Select
            label="Priority"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            options={priorityOptions}
          />
          <Select
            label="Group By"
            value={filters.groupBy}
            onChange={(e) => setFilters({ ...filters, groupBy: e.target.value })}
            options={groupByOptions}
          />
          <Select
            label="Technician"
            value={filters.technicianId}
            onChange={(e) => setFilters({ ...filters, technicianId: e.target.value })}
            options={[
              { value: 'all', label: 'All Technicians' },
              ...technicians.map(t => ({ value: t._id, label: `${t.firstName} ${t.lastName}` }))
            ]}
          />
          <Select
            label="Building"
            value={filters.buildingId}
            onChange={(e) => setFilters({ ...filters, buildingId: e.target.value })}
            options={[
              { value: 'all', label: 'All Buildings' },
              ...buildings.map(b => ({ value: b._id, label: b.name }))
            ]}
          />
          <div className="flex items-end gap-2">
            <Button onClick={fetchReportData}>Apply Filters</Button>
            <Button variant="secondary" onClick={() => setFilters({
              startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              status: 'all',
              priority: 'all',
              department: 'all',
              technicianId: 'all',
              buildingId: 'all',
              groupBy: 'status'
            })}>Reset</Button>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      {reportData?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{reportData.summary.totalTasks}</p>
            <p className="text-sm text-gray-500">Total Tasks</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{reportData.summary.completedTasks}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{reportData.summary.pendingTasks}</p>
            <p className="text-sm text-gray-500">In Progress</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{reportData.summary.completionRate}%</p>
            <p className="text-sm text-gray-500">Completion Rate</p>
          </Card>
        </div>
      )}

      {/* Report Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Task Report Details</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => handleExport('csv')} isLoading={exporting}>
              📥 Export CSV
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleExport('excel')} isLoading={exporting}>
              📊 Export Excel
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {reportData?.groups?.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Tasks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overdue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Time (hrs)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.groups.map((group, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {group.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{group.completed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{group.pending}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{group.overdue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.avgCompletionTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">No data available</div>
          )}
        </div>
      </Card>

      {/* Performance Metrics */}
      {reportData?.performance && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">SLA Performance</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>SLA Compliance</span>
                  <span className="text-green-600">{reportData.performance.slaCompliance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${reportData.performance.slaCompliance}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>On-Time Completion</span>
                  <span className="text-blue-600">{reportData.performance.onTimeRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${reportData.performance.onTimeRate}%` }} />
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Priority Distribution</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Critical</span>
                <span className="text-red-600">{reportData.priorityDistribution?.critical || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>High</span>
                <span className="text-orange-600">{reportData.priorityDistribution?.high || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Medium</span>
                <span className="text-yellow-600">{reportData.priorityDistribution?.medium || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Low</span>
                <span className="text-green-600">{reportData.priorityDistribution?.low || 0}</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TaskReports;