// client/src/pages/leave/LeaveCalendar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';  // 🔴 FIX: Added missing Link import
import { leaveApi } from '../../api/leave.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const LeaveCalendar = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [calendarData, setCalendarData] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const fetchLeaveBalance = useCallback(async () => {
    try {
      const response = await leaveApi.getMyLeaveBalance(selectedYear);
      if (response.data.success) {
        setLeaveBalance(response.data.data);
      }
    } catch (error) {
      console.error('Fetch leave balance error:', error);
    }
  }, [selectedYear]);

  const fetchTeamLeaveCalendar = useCallback(async () => {
    if (user?.role !== 'manager' && user?.role !== 'supervisor') return;
    
    try {
      const response = await leaveApi.getTeamLeaveCalendar(selectedYear, selectedMonth);
      if (response.data.success) {
        setCalendarData(response.data.data.calendar);
        setTeamMembers(response.data.data.teamMembers);
      }
    } catch (error) {
      console.error('Fetch team leave calendar error:', error);
    }
  }, [selectedYear, selectedMonth, user?.role]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchLeaveBalance(), fetchTeamLeaveCalendar()]);
      setLoading(false);
    };
    fetchData();
  }, [fetchLeaveBalance, fetchTeamLeaveCalendar]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedMonth(month === 0 ? 12 : month);
    setSelectedYear(month === 0 ? year - 1 : year);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedMonth(month === 11 ? 1 : month + 2);
    setSelectedYear(month === 11 ? year + 1 : year);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedMonth(new Date().getMonth() + 1);
    setSelectedYear(new Date().getFullYear());
  };

  const getLeaveTypeColor = (leaveType) => {
    const colors = {
      annual: 'bg-green-100 text-green-800 border-green-200',
      sick: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      emergency: 'bg-red-100 text-red-800 border-red-200',
      unpaid: 'bg-gray-100 text-gray-800 border-gray-200',
      maternity: 'bg-pink-100 text-pink-800 border-pink-200',
      paternity: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[leaveType] || colors.annual;
  };

  const getLeaveTypeIcon = (leaveType) => {
    const icons = {
      annual: '🏖️',
      sick: '🤒',
      emergency: '🚨',
      unpaid: '💰',
      maternity: '👶',
      paternity: '👶'
    };
    return icons[leaveType] || '📋';
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leave Calendar</h1>
        <p className="text-gray-500 mt-1">
          {user?.role === 'manager' || user?.role === 'supervisor' 
            ? 'View team leave schedule and manage leave balances' 
            : 'Track your leave balance and schedule'}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Balance Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">My Leave Balance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">🏖️ Annual Leave</p>
                  <p className="text-sm text-green-600">Total: {leaveBalance?.annual?.total || 22} days</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{leaveBalance?.annual?.remaining || 0}</p>
                  <p className="text-xs text-green-500">Remaining</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-800">🤒 Sick Leave</p>
                  <p className="text-sm text-yellow-600">Total: {leaveBalance?.sick?.total || 12} days</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">{leaveBalance?.sick?.remaining || 0}</p>
                  <p className="text-xs text-yellow-500">Remaining</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-800">🚨 Emergency Leave</p>
                  <p className="text-sm text-red-600">Total: {leaveBalance?.emergency?.total || 6} days</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">{leaveBalance?.emergency?.remaining || 0}</p>
                  <p className="text-xs text-red-500">Remaining</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Used Annual Leave</span>
                <span className="font-medium">{leaveBalance?.annual?.used || 0} / {leaveBalance?.annual?.total || 22} days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: `${((leaveBalance?.annual?.used || 0) / (leaveBalance?.annual?.total || 22)) * 100}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Leave Request Button */}
          <Card className="p-6 text-center">
            <p className="text-gray-600 mb-3">Need time off?</p>
            <Link to="/leave/my">
              <Button variant="primary" className="w-full">+ Apply for Leave</Button>
            </Link>
          </Card>

          {/* Team Members List (for Managers) */}
          {(user?.role === 'manager' || user?.role === 'supervisor') && teamMembers.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Team Members</h3>
              <div className="space-y-2">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">{member.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {/* Calendar Navigation */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-50"
                >
                  ← Prev
                </button>
                <button
                  onClick={handleToday}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-50"
                >
                  Today
                </button>
                <button
                  onClick={handleNextMonth}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-50"
                >
                  Next →
                </button>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {monthNames[month]} {year}
              </h2>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[100px] bg-gray-50 rounded-lg p-1" />
              ))}
              
              {/* Actual days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNumber = i + 1;
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                const dayLeaves = calendarData[dayNumber] || [];
                const isToday = new Date().toDateString() === new Date(year, month, dayNumber).toDateString();
                
                return (
                  <div
                    key={dayNumber}
                    className={`min-h-[100px] border rounded-lg p-1 overflow-y-auto ${
                      isToday ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`text-right text-sm font-medium p-1 ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                      {dayNumber}
                    </div>
                    <div className="space-y-1">
                      {dayLeaves.map((leave, idx) => (
                        <div
                          key={idx}
                          className={`text-xs p-1 rounded border ${getLeaveTypeColor(leave.leaveType)} cursor-pointer`}
                          title={`${leave.employeeName} - ${leave.leaveType} leave`}
                        >
                          <span className="mr-1">{getLeaveTypeIcon(leave.leaveType)}</span>
                          <span className="truncate">{leave.employeeName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Leave Type Legend</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-xs text-gray-600">Annual Leave</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-xs text-gray-600">Sick Leave</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-xs text-gray-600">Emergency Leave</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                  <span className="text-xs text-gray-600">Unpaid Leave</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Upcoming Leave Requests */}
          <Card className="p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Upcoming Leave Requests</h3>
            <div className="space-y-3">
              {teamMembers.length > 0 ? (
                teamMembers.map(member => {
                  // In a real app, fetch actual upcoming leaves
                  return null;
                })
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No upcoming leave requests
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;