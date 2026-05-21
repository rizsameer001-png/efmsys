// client/src/pages/settings/EmailSettings.jsx
import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../api/settings.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const EmailSettings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    smtp: {
      host: '',
      port: 587,
      secure: true,
      auth: {
        user: '',
        pass: ''
      }
    },
    from: {
      email: '',
      name: 'FMS Enterprise'
    },
    templates: {
      welcome: true,
      taskAssignment: true,
      taskCompletion: true,
      leaveApproval: true,
      payrollSlip: true,
      complaintUpdate: true
    },
    notifications: {
      sendOnTaskAssign: true,
      sendOnTaskComplete: true,
      sendOnLeaveApproval: true,
      sendOnPayroll: true,
      sendDailyDigest: false,
      digestTime: '09:00'
    },
    testEmail: ''
  });

  const smtpPorts = [
    { value: 25, label: '25 - SMTP' },
    { value: 465, label: '465 - SMTPS (SSL)' },
    { value: 587, label: '587 - SMTP (TLS)' },
    { value: 2525, label: '2525 - Alternative SMTP' }
  ];

  useEffect(() => {
    fetchEmailSettings();
  }, []);

  const fetchEmailSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsApi.getEmailSettings();
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Fetch email settings error:', error);
      showToast('Failed to load email settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNestedChange = (parent, child, field, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: {
          ...prev[parent][child],
          [field]: value
        }
      }
    }));
  };

  const handleTestEmail = async () => {
    if (!settings.testEmail) {
      showToast('Please enter a test email address', 'error');
      return;
    }
    
    setTesting(true);
    try {
      const response = await settingsApi.testEmailConfig(settings.testEmail);
      if (response.data.success) {
        showToast(`Test email sent successfully to ${settings.testEmail}`, 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to send test email', 'error');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await settingsApi.updateEmailSettings(settings);
      if (response.data.success) {
        showToast('Email settings saved successfully', 'success');
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
          <h1 className="text-2xl font-bold text-gray-900">Email Settings</h1>
          <p className="text-gray-500 mt-1">Configure email server and notification templates</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleTestEmail} isLoading={testing}>
            Send Test Email
          </Button>
          <Button onClick={handleSave} isLoading={saving}>
            Save Settings
          </Button>
        </div>
      </div>

      {/* SMTP Configuration */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SMTP Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="SMTP Host"
            value={settings.smtp.host}
            onChange={(e) => handleNestedChange('smtp', 'auth', 'host', e.target.value)}
            placeholder="smtp.gmail.com"
          />
          <Select
            label="SMTP Port"
            value={settings.smtp.port}
            onChange={(e) => handleNestedChange('smtp', 'auth', 'port', parseInt(e.target.value))}
            options={smtpPorts}
          />
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.smtp.secure}
                onChange={(e) => handleNestedChange('smtp', 'auth', 'secure', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Use SSL/TLS (Secure Connection)</span>
            </label>
          </div>
          <Input
            label="Username"
            value={settings.smtp.auth.user}
            onChange={(e) => handleNestedChange('smtp', 'auth', 'user', e.target.value)}
            placeholder="your-email@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={settings.smtp.auth.pass}
            onChange={(e) => handleNestedChange('smtp', 'auth', 'pass', e.target.value)}
            placeholder="••••••••"
          />
        </div>
      </Card>

      {/* Sender Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sender Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="From Email"
            type="email"
            value={settings.from.email}
            onChange={(e) => handleNestedChange('from', null, 'email', e.target.value)}
            placeholder="noreply@fms.com"
          />
          <Input
            label="From Name"
            value={settings.from.name}
            onChange={(e) => handleNestedChange('from', null, 'name', e.target.value)}
            placeholder="FMS Enterprise"
          />
        </div>
      </Card>

      {/* Email Templates */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.templates.welcome}
              onChange={(e) => handleNestedChange('templates', null, 'welcome', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Welcome Email</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.templates.taskAssignment}
              onChange={(e) => handleNestedChange('templates', null, 'taskAssignment', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Task Assignment Notification</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.templates.taskCompletion}
              onChange={(e) => handleNestedChange('templates', null, 'taskCompletion', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Task Completion Notification</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.templates.leaveApproval}
              onChange={(e) => handleNestedChange('templates', null, 'leaveApproval', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Leave Approval Notification</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.templates.payrollSlip}
              onChange={(e) => handleNestedChange('templates', null, 'payrollSlip', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Payroll Slip Email</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.templates.complaintUpdate}
              onChange={(e) => handleNestedChange('templates', null, 'complaintUpdate', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Complaint Update Notification</span>
          </label>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.notifications.sendOnTaskAssign}
              onChange={(e) => handleNestedChange('notifications', null, 'sendOnTaskAssign', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Send email on task assignment</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.notifications.sendOnTaskComplete}
              onChange={(e) => handleNestedChange('notifications', null, 'sendOnTaskComplete', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Send email on task completion</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.notifications.sendOnLeaveApproval}
              onChange={(e) => handleNestedChange('notifications', null, 'sendOnLeaveApproval', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Send email on leave approval</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.notifications.sendOnPayroll}
              onChange={(e) => handleNestedChange('notifications', null, 'sendOnPayroll', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Send email for payroll</span>
          </label>
        </div>
        <div className="mt-4 pt-4 border-t">
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={settings.notifications.sendDailyDigest}
              onChange={(e) => handleNestedChange('notifications', null, 'sendDailyDigest', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Send Daily Digest Email</span>
          </label>
          {settings.notifications.sendDailyDigest && (
            <Input
              label="Digest Time"
              type="time"
              value={settings.notifications.digestTime}
              onChange={(e) => handleNestedChange('notifications', null, 'digestTime', e.target.value)}
              className="w-48"
            />
          )}
        </div>
      </Card>

      {/* Test Email */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Configuration</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              label="Test Email Address"
              type="email"
              value={settings.testEmail}
              onChange={(e) => handleInputChange(null, 'testEmail', e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <Button variant="secondary" onClick={handleTestEmail} isLoading={testing}>
            Send Test Email
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          A test email will be sent to verify your SMTP configuration.
        </p>
      </Card>
    </div>
  );
};

export default EmailSettings;