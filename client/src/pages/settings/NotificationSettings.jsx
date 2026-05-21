// client/src/pages/settings/NotificationSettings.jsx
import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../api/settings.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const NotificationSettings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    channels: {
      email: true,
      push: true,
      sms: false,
      inApp: true
    },
    taskNotifications: {
      onAssign: true,
      onAccept: true,
      onStart: true,
      onComplete: true,
      onVerify: true,
      onReject: true,
      onOverdue: true
    },
    leaveNotifications: {
      onApply: true,
      onApproval: true,
      onRejection: true,
      onCancellation: true
    },
    complaintNotifications: {
      onRaise: true,
      onAssign: true,
      onResolve: true,
      onFeedback: true
    },
    attendanceNotifications: {
      onCheckIn: false,
      onCheckOut: false,
      onLate: true,
      onAbsent: true,
      onLeaveRequest: true
    },
    payrollNotifications: {
      onSalaryGenerated: true,
      onSalaryApproved: true,
      onSalaryPaid: true,
      onSlipReady: true
    },
    systemNotifications: {
      onMaintenance: true,
      onUpdate: true,
      onBackup: true,
      onAlert: true
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
      timezone: 'Asia/Dubai'
    }
  });

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsApi.getNotificationSettings();
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Fetch notification settings error:', error);
      showToast('Failed to load notification settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (category, key) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
  };

  const handleQuietHoursToggle = () => {
    setSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        enabled: !prev.quietHours.enabled
      }
    }));
  };

  const handleQuietHoursChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await settingsApi.updateNotificationSettings(settings);
      if (response.data.success) {
        showToast('Notification settings saved successfully', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
          <p className="text-gray-500 mt-1">Manage how and when you receive notifications</p>
        </div>
        <Button onClick={handleSave} isLoading={saving}>
          Save Settings
        </Button>
      </div>

      {/* Notification Channels */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={settings.channels.email}
              onChange={() => handleToggle('channels', 'email')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <div>
              <span className="text-sm font-medium">📧 Email</span>
              <p className="text-xs text-gray-500">Receive via email</p>
            </div>
          </label>
          <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={settings.channels.push}
              onChange={() => handleToggle('channels', 'push')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <div>
              <span className="text-sm font-medium">📱 Push</span>
              <p className="text-xs text-gray-500">Browser/mobile push</p>
            </div>
          </label>
          <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={settings.channels.sms}
              onChange={() => handleToggle('channels', 'sms')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <div>
              <span className="text-sm font-medium">📱 SMS</span>
              <p className="text-xs text-gray-500">Text message alerts</p>
            </div>
          </label>
          <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={settings.channels.inApp}
              onChange={() => handleToggle('channels', 'inApp')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <div>
              <span className="text-sm font-medium">💬 In-App</span>
              <p className="text-xs text-gray-500">Inside the app</p>
            </div>
          </label>
        </div>
      </Card>

      {/* Task Notifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Task Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.taskNotifications.onAssign}
              onChange={() => handleToggle('taskNotifications', 'onAssign')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When task is assigned</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.taskNotifications.onAccept}
              onChange={() => handleToggle('taskNotifications', 'onAccept')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When task is accepted</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.taskNotifications.onStart}
              onChange={() => handleToggle('taskNotifications', 'onStart')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When task is started</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.taskNotifications.onComplete}
              onChange={() => handleToggle('taskNotifications', 'onComplete')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When task is completed</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.taskNotifications.onVerify}
              onChange={() => handleToggle('taskNotifications', 'onVerify')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When task is verified</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.taskNotifications.onReject}
              onChange={() => handleToggle('taskNotifications', 'onReject')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When task is rejected</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.taskNotifications.onOverdue}
              onChange={() => handleToggle('taskNotifications', 'onOverdue')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When task is overdue</span>
          </label>
        </div>
      </Card>

      {/* Leave Notifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏖️ Leave Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.leaveNotifications.onApply}
              onChange={() => handleToggle('leaveNotifications', 'onApply')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When leave is applied</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.leaveNotifications.onApproval}
              onChange={() => handleToggle('leaveNotifications', 'onApproval')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When leave is approved</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.leaveNotifications.onRejection}
              onChange={() => handleToggle('leaveNotifications', 'onRejection')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When leave is rejected</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.leaveNotifications.onCancellation}
              onChange={() => handleToggle('leaveNotifications', 'onCancellation')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When leave is cancelled</span>
          </label>
        </div>
      </Card>

      {/* Complaint Notifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Complaint Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.complaintNotifications.onRaise}
              onChange={() => handleToggle('complaintNotifications', 'onRaise')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When complaint is raised</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.complaintNotifications.onAssign}
              onChange={() => handleToggle('complaintNotifications', 'onAssign')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When complaint is assigned</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.complaintNotifications.onResolve}
              onChange={() => handleToggle('complaintNotifications', 'onResolve')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When complaint is resolved</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.complaintNotifications.onFeedback}
              onChange={() => handleToggle('complaintNotifications', 'onFeedback')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When feedback is received</span>
          </label>
        </div>
      </Card>

      {/* Attendance Notifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⏰ Attendance Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.attendanceNotifications.onCheckIn}
              onChange={() => handleToggle('attendanceNotifications', 'onCheckIn')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When check-in is recorded</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.attendanceNotifications.onCheckOut}
              onChange={() => handleToggle('attendanceNotifications', 'onCheckOut')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When check-out is recorded</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.attendanceNotifications.onLate}
              onChange={() => handleToggle('attendanceNotifications', 'onLate')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When marked late</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.attendanceNotifications.onAbsent}
              onChange={() => handleToggle('attendanceNotifications', 'onAbsent')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When absent without leave</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.attendanceNotifications.onLeaveRequest}
              onChange={() => handleToggle('attendanceNotifications', 'onLeaveRequest')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When leave request is submitted</span>
          </label>
        </div>
      </Card>

      {/* Payroll Notifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Payroll Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.payrollNotifications.onSalaryGenerated}
              onChange={() => handleToggle('payrollNotifications', 'onSalaryGenerated')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When salary is generated</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.payrollNotifications.onSalaryApproved}
              onChange={() => handleToggle('payrollNotifications', 'onSalaryApproved')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When salary is approved</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.payrollNotifications.onSalaryPaid}
              onChange={() => handleToggle('payrollNotifications', 'onSalaryPaid')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When salary is paid</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.payrollNotifications.onSlipReady}
              onChange={() => handleToggle('payrollNotifications', 'onSlipReady')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">When salary slip is ready</span>
          </label>
        </div>
      </Card>

      {/* System Notifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ System Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.systemNotifications.onMaintenance}
              onChange={() => handleToggle('systemNotifications', 'onMaintenance')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">System maintenance alerts</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.systemNotifications.onUpdate}
              onChange={() => handleToggle('systemNotifications', 'onUpdate')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">System update notifications</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.systemNotifications.onBackup}
              onChange={() => handleToggle('systemNotifications', 'onBackup')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Backup completion alerts</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.systemNotifications.onAlert}
              onChange={() => handleToggle('systemNotifications', 'onAlert')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Critical system alerts</span>
          </label>
        </div>
      </Card>

      {/* Quiet Hours */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🌙 Quiet Hours</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.quietHours.enabled}
              onChange={handleQuietHoursToggle}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Enable Quiet Hours</span>
          </label>
          
          {settings.quietHours.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={settings.quietHours.start}
                  onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={settings.quietHours.end}
                  onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                <select
                  value={settings.quietHours.timezone}
                  onChange={(e) => handleQuietHoursChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Asia/Dubai">Dubai (GST+4)</option>
                  <option value="Asia/Kolkata">India (IST+5:30)</option>
                  <option value="America/New_York">New York (EST-5)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                </select>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-2">
            During quiet hours, only critical notifications will be delivered.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotificationSettings;