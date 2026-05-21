// client/src/pages/reports/ReportsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportApi } from '../../api/report.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const ReportsDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reportStats, setReportStats] = useState({
    totalReports: 0,
    scheduledReports: 0,
    downloadedThisMonth: 0,
    popularReports: []
  });
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await reportApi.getReportsDashboard();
      if (response.data.success) {
        setReportStats(response.data.data.stats);
        setRecentReports(response.data.data.recentReports);
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      showToast('Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const reportCategories = [
    {
      title: 'Attendance Reports',
      icon: '📊',
      color: 'bg-blue-500',
      reports: [
        { name: 'Daily Attendance', path: '/reports/attendance/daily', description: 'View daily attendance summary' },
        { name: 'Monthly Attendance', path: '/reports/attendance/monthly', description: 'Monthly attendance report' },
        { name: 'Late Arrivals', path: '/reports/attendance/late', description: 'Employee late arrivals report' },
        { name: 'Absenteeism', path: '/reports/attendance/absent', description: 'Absenteeism analysis' }
      ]
    },
    {
      title: 'Leave Reports',
      icon: '🏖️',
      color: 'bg-green-500',
      reports: [
        { name: 'Leave Balance', path: '/reports/leave/balance', description: 'Employee leave balance report' },
        { name: 'Leave Taken', path: '/reports/leave/taken', description: 'Leave taken summary' },
        { name: 'Pending Approvals', path: '/reports/leave/pending', description: 'Pending leave requests' }
      ]
    },
    {
      title: 'Task Reports',
      icon: '📋',
      color: 'bg-purple-500',
      reports: [
        { name: 'Task Completion', path: '/reports/tasks/completion', description: 'Task completion rate' },
        { name: 'SLA Compliance', path: '/reports/tasks/sla', description: 'SLA compliance report' },
        { name: 'Technician Performance', path: '/reports/tasks/performance', description: 'Technician performance metrics' }
      ]
    },
    {
      title: 'Salary Reports',
      icon: '💰',
      color: 'bg-orange-500',
      reports: [
        { name: 'Payroll Summary', path: '/reports/salary/payroll', description: 'Monthly payroll summary' },
        { name: 'Salary Structure', path: '/reports/salary/structure', description: 'Salary structure report' },
        { name: 'Bank Transfer', path: '/reports/salary/bank', description: 'Bank transfer file' }
      ]
    },
    {
      title: 'Building Reports',
      icon: '🏢',
      color: 'bg-cyan-500',
      reports: [
        { name: 'Occupancy Report', path: '/reports/building/occupancy', description: 'Building occupancy status' },
        { name: 'Unit Status', path: '/reports/building/units', description: 'Unit wise status report' },
        { name: 'Maintenance Schedule', path: '/reports/building/maintenance', description: 'Upcoming maintenance' }
      ]
    },
    {
      title: 'Complaint Reports',
      icon: '⚠️',
      color: 'bg-red-500',
      reports: [
        { name: 'Complaint Summary', path: '/reports/complaints/summary', description: 'Complaint resolution summary' },
        { name: 'Resolution Time', path: '/reports/complaints/resolution', description: 'Average resolution time' },
        { name: 'Category Wise', path: '/reports/complaints/category', description: 'Complaints by category' }
      ]
    }
  ];

  const handleGenerateReport = async (reportType) => {
    showToast(`Generating ${reportType} report...`, 'info');
    // In production, this would trigger report generation
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports Dashboard</h1>
          <p className="text-gray-500 mt-1">Generate and manage business reports</p>
        </div>
        <Link to="/reports/builder">
          <Button variant="primary">
            🏗️ Custom Report Builder
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{reportStats.totalReports}</p>
          <p className="text-sm text-gray-500">Total Reports</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{reportStats.scheduledReports}</p>
          <p className="text-sm text-gray-500">Scheduled Reports</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{reportStats.downloadedThisMonth}</p>
          <p className="text-sm text-gray-500">Downloads This Month</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">{reportStats.popularReports?.length || 0}</p>
          <p className="text-sm text-gray-500">Popular Reports</p>
        </Card>
      </div>

      {/* Report Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCategories.map((category, idx) => (
          <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`${category.color} p-4 text-white`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-lg font-semibold">{category.title}</h3>
              </div>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                {category.reports.map((report, ridx) => (
                  <li key={ridx}>
                    <Link 
                      to={report.path}
                      className="block p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{report.name}</p>
                          <p className="text-xs text-gray-500">{report.description}</p>
                        </div>
                        <button
                          onClick={() => handleGenerateReport(report.name)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Generate →
                        </button>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Reports Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Recently Generated Reports</h3>
          <Link to="/reports/history" className="text-sm text-blue-600 hover:text-blue-800">
            View All History →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generated By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Format</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.length > 0 ? (
                recentReports.map((report, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{report.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.generatedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.generatedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 uppercase">
                        {report.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button className="text-blue-600 hover:text-blue-800">📥 Download</button>
                        <button className="text-green-600 hover:text-green-800">🔄 Regenerate</button>
                        <button className="text-red-600 hover:text-red-800">🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No recent reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Scheduled Reports Section */}
      <Card className="p-6 bg-blue-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-blue-800">📅 Scheduled Reports</h3>
            <p className="text-sm text-blue-600 mt-1">Automatically generated reports on schedule</p>
          </div>
          <Link to="/reports/schedule">
            <Button variant="secondary" size="sm">Manage Schedules</Button>
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span>📊</span>
            </div>
            <div>
              <p className="font-medium text-sm">Monthly Attendance Report</p>
              <p className="text-xs text-gray-500">Every 1st of month • PDF</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span>💰</span>
            </div>
            <div>
              <p className="font-medium text-sm">Weekly Payroll Summary</p>
              <p className="text-xs text-gray-500">Every Friday • CSV</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span>📋</span>
            </div>
            <div>
              <p className="font-medium text-sm">Task SLA Report</p>
              <p className="text-xs text-gray-500">Daily at 6 PM • Excel</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportsDashboard;