// client/src/pages/attendance/MyAttendance.jsx
import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendance.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const MyAttendance = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAttendance();
  }, [currentMonth, currentYear]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await attendanceApi.getMyAttendance(currentMonth, currentYear);
      if (response.data.success) {
        setAttendance(response.data.data);
        setTodayStatus(response.data.data.today);
      }
    } catch (error) {
      console.error('Fetch attendance error:', error);
      showToast('Failed to load attendance', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setChecking(true);
    try {
      // Get GPS location
      let gpsLocation = null;
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        gpsLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      }
      
      const response = await attendanceApi.checkIn({ gpsLocation });
      if (response.data.success) {
        showToast('Check-in successful!', 'success');
        fetchAttendance();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Check-in failed', 'error');
    } finally {
      setChecking(false);
    }
  };

  const handleCheckOut = async () => {
    setChecking(true);
    try {
      let gpsLocation = null;
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        gpsLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      }
      
      const response = await attendanceApi.checkOut({ gpsLocation });
      if (response.data.success) {
        showToast('Check-out successful!', 'success');
        fetchAttendance();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Check-out failed', 'error');
    } finally {
      setChecking(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
        <p className="text-gray-500 mt-1">Track your daily attendance records</p>
      </div>

      {/* Today's Status Card */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Today's Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Status</p>
            <p className={`text-lg font-semibold ${
              todayStatus?.status === 'present' ? 'text-green-600' :
              todayStatus?.status === 'late' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {todayStatus?.status || 'Not Checked In'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Check In</p>
            <p className="text-lg font-semibold">
              {todayStatus?.checkInTime ? new Date(todayStatus.checkInTime).toLocaleTimeString() : '-'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Check Out</p>
            <p className="text-lg font-semibold">
              {todayStatus?.checkOutTime ? new Date(todayStatus.checkOutTime).toLocaleTimeString() : '-'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Hours</p>
            <p className="text-lg font-semibold">{todayStatus?.totalHours || 0} hrs</p>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mt-4">
          {!todayStatus?.checkInTime && (
            <Button onClick={handleCheckIn} isLoading={checking}>
              Check In
            </Button>
          )}
          {todayStatus?.checkInTime && !todayStatus?.checkOutTime && (
            <Button onClick={handleCheckOut} isLoading={checking} variant="secondary">
              Check Out
            </Button>
          )}
        </div>
      </Card>

      {/* Monthly Summary */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Monthly Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{attendance?.currentMonth?.attendancePercentage || 0}%</p>
            <p className="text-xs text-gray-500">Attendance Rate</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{attendance?.currentMonth?.presentDays || 0}</p>
            <p className="text-xs text-gray-500">Present</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{attendance?.currentMonth?.absentDays || 0}</p>
            <p className="text-xs text-gray-500">Absent</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{attendance?.currentMonth?.lateDays || 0}</p>
            <p className="text-xs text-gray-500">Late</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{attendance?.currentMonth?.leaveDays || 0}</p>
            <p className="text-xs text-gray-500">Leave</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-600">{attendance?.currentMonth?.totalDays || 0}</p>
            <p className="text-xs text-gray-500">Total Days</p>
          </div>
        </div>
      </Card>

      {/* Attendance List */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Attendance History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
               </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendance?.attendanceList?.map(record => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.dayName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' :
                      record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                      record.status === 'absent' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.checkIn?.time ? new Date(record.checkIn.time).toLocaleTimeString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.checkOut?.time ? new Date(record.checkOut.time).toLocaleTimeString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.totalHours || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default MyAttendance;