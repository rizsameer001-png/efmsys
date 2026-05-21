// client/src/pages/attendance/AttendanceDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attendanceApi } from '../../api/attendance.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const AttendanceDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    today: { present: 0, absent: 0, late: 0, onLeave: 0, total: 0 },
    week: { present: 0, absent: 0, late: 0, onLeave: 0, total: 0 },
    month: { present: 0, absent: 0, late: 0, onLeave: 0, total: 0, attendanceRate: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await attendanceApi.getAttendanceDashboard();
      if (response.data.success) {
        setStats(response.data.data.stats);
        setRecentActivity(response.data.data.recentActivity);
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      showToast('Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of team attendance</p>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.today.present}</p>
          <p className="text-sm text-gray-500">Present Today</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.today.absent}</p>
          <p className="text-sm text-gray-500">Absent Today</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.today.late}</p>
          <p className="text-sm text-gray-500">Late Today</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.today.onLeave}</p>
          <p className="text-sm text-gray-500">On Leave</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link to="/attendance/check-in-out">
          <Button className="w-full">✅ Check In/Out</Button>
        </Link>
        <Link to="/attendance/team">
          <Button variant="secondary" className="w-full">👥 Team Attendance</Button>
        </Link>
        <Link to="/attendance/report">
          <Button variant="secondary" className="w-full">📊 View Report</Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Check-ins</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{activity.name}</p>
                <p className="text-sm text-gray-500">{activity.role}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">Checked in at {activity.checkInTime}</p>
                <p className="text-xs text-gray-400">{activity.date}</p>
              </div>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <p className="text-center text-gray-500 py-4">No recent check-ins</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AttendanceDashboard;