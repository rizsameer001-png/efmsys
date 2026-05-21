// client/src/pages/reports/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { reportApi } from '../../api/report.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    attendance: { trend: [], average: 0, comparison: 0 },
    tasks: { completion: 0, sla: 0, overdue: 0 },
    complaints: { resolution: 0, averageTime: 0, satisfaction: 0 },
    productivity: { overall: 0, departmentWise: [] }
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await reportApi.getAnalyticsDashboard();
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Fetch analytics error:', error);
      showToast('Failed to load analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (value) => {
    if (value > 0) return '📈';
    if (value < 0) return '📉';
    return '📊';
  };

  const getTrendColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Business intelligence and performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Attendance Rate</p>
              <p className="text-3xl font-bold text-blue-600">{analytics.attendance.average}%</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm">{getTrendIcon(analytics.attendance.comparison)}</span>
                <span className={`text-sm ${getTrendColor(analytics.attendance.comparison)}`}>
                  {Math.abs(analytics.attendance.comparison)}% vs last month
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Task Completion</p>
              <p className="text-3xl font-bold text-green-600">{analytics.tasks.completion}%</p>
              <p className="text-sm text-gray-500 mt-1">SLA: {analytics.tasks.sla}%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Complaint Resolution</p>
              <p className="text-3xl font-bold text-purple-600">{analytics.complaints.resolution}%</p>
              <p className="text-sm text-gray-500 mt-1">Avg: {analytics.complaints.averageTime} hrs</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-xl">⚠️</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Customer Satisfaction</p>
              <p className="text-3xl font-bold text-orange-600">{analytics.complaints.satisfaction}/5</p>
              <p className="text-sm text-gray-500 mt-1">Based on 156 reviews</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance Trend Chart */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Attendance Trend</h3>
        <div className="h-64 flex items-end gap-2">
          {analytics.attendance.trend.map((point, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t transition-all duration-500"
                style={{ height: `${point.value * 2}px` }}
              />
              <p className="text-xs text-gray-500 mt-2">{point.label}</p>
              <p className="text-sm font-medium">{point.value}%</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Department Productivity */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Department Productivity</h3>
        <div className="space-y-4">
          {analytics.productivity.departmentWise.map((dept, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{dept.name}</span>
                <span className="text-gray-600">{dept.productivity}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${dept.productivity}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Key Insights</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Attendance improved by 5% compared to last quarter</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">⚠️</span>
              <span>Task overdue rate increased by 2% - Review priority assignments</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Customer satisfaction rating is above target (4.5/5)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">📊</span>
              <span>Technical department has highest productivity at 94%</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">🎯 Recommendations</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span>1.</span>
              <span>Implement additional training for technicians with low task completion rates</span>
            </li>
            <li className="flex items-start gap-2">
              <span>2.</span>
              <span>Review SLA deadlines for high-priority tasks</span>
            </li>
            <li className="flex items-start gap-2">
              <span>3.</span>
              <span>Consider incentive program for departments with {'>'}90% productivity</span>
            </li>
            <li className="flex items-start gap-2">
              <span>4.</span>
              <span>Schedule preventive maintenance to reduce emergency complaints</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;