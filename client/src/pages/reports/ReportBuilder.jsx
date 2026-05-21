// client/src/pages/reports/ReportBuilder.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportApi } from '../../api/report.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const ReportBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    module: 'attendance',
    reportType: 'summary',
    dateRange: 'this_month',
    startDate: '',
    endDate: '',
    fields: [],
    filters: {},
    groupBy: '',
    sortBy: '',
    sortOrder: 'desc',
    format: 'pdf',
    schedule: {
      enabled: false,
      frequency: 'monthly',
      recipients: []
    }
  });

  const modules = [
    { value: 'attendance', label: 'Attendance', icon: '📊' },
    { value: 'leave', label: 'Leave', icon: '🏖️' },
    { value: 'task', label: 'Task', icon: '📋' },
    { value: 'salary', label: 'Salary', icon: '💰' },
    { value: 'building', label: 'Building', icon: '🏢' },
    { value: 'complaint', label: 'Complaint', icon: '⚠️' },
    { value: 'user', label: 'User', icon: '👥' }
  ];

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this_week', label: 'This Week' },
    { value: 'last_week', label: 'Last Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_quarter', label: 'This Quarter' },
    { value: 'this_year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const formats = [
    { value: 'pdf', label: 'PDF Document', icon: '📄' },
    { value: 'csv', label: 'CSV Spreadsheet', icon: '📊' },
    { value: 'excel', label: 'Excel File', icon: '📈' },
    { value: 'json', label: 'JSON Data', icon: '📋' }
  ];

  const attendanceFields = [
    { value: 'employeeName', label: 'Employee Name' },
    { value: 'employeeId', label: 'Employee ID' },
    { value: 'department', label: 'Department' },
    { value: 'date', label: 'Date' },
    { value: 'checkIn', label: 'Check In Time' },
    { value: 'checkOut', label: 'Check Out Time' },
    { value: 'totalHours', label: 'Total Hours' },
    { value: 'status', label: 'Status' },
    { value: 'lateMinutes', label: 'Late Minutes' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setReportConfig(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setReportConfig(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFieldToggle = (field) => {
    setReportConfig(prev => ({
      ...prev,
      fields: prev.fields.includes(field)
        ? prev.fields.filter(f => f !== field)
        : [...prev.fields, field]
    }));
  };

  const handleGenerate = async () => {
    if (!reportConfig.name) {
      showToast('Please enter a report name', 'warning');
      return;
    }
    
    if (reportConfig.fields.length === 0) {
      showToast('Please select at least one field', 'warning');
      return;
    }
    
    setGenerating(true);
    try {
      const response = await reportApi.generateCustomReport(reportConfig);
      if (response.data.success) {
        showToast('Report generated successfully!', 'success');
        
        // Download the report
        if (reportConfig.format === 'pdf') {
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        } else if (reportConfig.format === 'csv') {
          const blob = new Blob([response.data], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${reportConfig.name.replace(/\s/g, '_')}.csv`;
          link.click();
        }
        
        navigate('/reports');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to generate report', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      await reportApi.saveReportTemplate(reportConfig);
      showToast('Report template saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save template', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Custom Report Builder</h1>
        <p className="text-gray-500 mt-1">Create custom reports with selected fields and filters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Report Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Name *</label>
                <input
                  type="text"
                  name="name"
                  value={reportConfig.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Monthly Attendance Summary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={reportConfig.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the report"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                  <select
                    name="module"
                    value={reportConfig.module}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {modules.map(module => (
                      <option key={module.value} value={module.value}>
                        {module.icon} {module.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                  <select
                    name="reportType"
                    value={reportConfig.reportType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="summary">Summary Report</option>
                    <option value="detailed">Detailed Report</option>
                    <option value="aggregate">Aggregate Report</option>
                    <option value="comparison">Comparison Report</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Date Range */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Date Range</h3>
            <div className="space-y-4">
              <select
                name="dateRange"
                value={reportConfig.dateRange}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              
              {reportConfig.dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={reportConfig.startDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={reportConfig.endDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Fields Selection */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Select Fields</h3>
            <div className="grid grid-cols-2 gap-2">
              {attendanceFields.map(field => (
                <label key={field.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={reportConfig.fields.includes(field.value)}
                    onChange={() => handleFieldToggle(field.value)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{field.label}</span>
                </label>
              ))}
            </div>
            {reportConfig.fields.length === 0 && (
              <p className="text-sm text-yellow-600 mt-2">Please select at least one field</p>
            )}
          </Card>

          {/* Sort & Group */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Sort & Group</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
                <select
                  name="groupBy"
                  value={reportConfig.groupBy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">None</option>
                  <option value="department">Department</option>
                  <option value="status">Status</option>
                  <option value="month">Month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  name="sortBy"
                  value={reportConfig.sortBy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">None</option>
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="department">Department</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <select
                  name="sortOrder"
                  value={reportConfig.sortOrder}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
                <select
                  name="format"
                  value={reportConfig.format}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {formats.map(format => (
                    <option key={format.value} value={format.value}>
                      {format.icon} {format.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Preview & Actions */}
        <div className="space-y-6">
          {/* Preview Card */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Report Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Name:</span> {reportConfig.name || 'Untitled Report'}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Module:</span> {modules.find(m => m.value === reportConfig.module)?.label}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Fields:</span> {reportConfig.fields.length} selected
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Format:</span> {formats.find(f => f.value === reportConfig.format)?.label}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date Range:</span> {dateRanges.find(d => d.value === reportConfig.dateRange)?.label}
              </p>
            </div>
          </Card>

          {/* Schedule Options */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Schedule Report</h3>
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={reportConfig.schedule.enabled}
                onChange={(e) => setReportConfig(prev => ({
                  ...prev,
                  schedule: { ...prev.schedule, enabled: e.target.checked }
                }))}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Enable automatic scheduling</span>
            </label>
            
            {reportConfig.schedule.enabled && (
              <div className="space-y-3">
                <select
                  name="schedule.frequency"
                  value={reportConfig.schedule.frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
                <input
                  type="email"
                  placeholder="Recipient email (comma separated)"
                  value={reportConfig.schedule.recipients.join(', ')}
                  onChange={(e) => setReportConfig(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule, recipients: e.target.value.split(',').map(s => s.trim()) }
                  }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <Card className="p-6">
            <div className="space-y-3">
              <Button 
                onClick={handleGenerate} 
                isLoading={generating}
                className="w-full"
              >
                🚀 Generate Report
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleSaveTemplate}
                className="w-full"
              >
                💾 Save as Template
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/reports')}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;