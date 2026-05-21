// client/src/pages/settings/SystemSettings.jsx
import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../api/settings.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const SystemSettings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    system: {
      systemName: '',
      systemUrl: '',
      supportEmail: '',
      supportPhone: '',
      maintenanceMode: false,
      debugMode: false
    },
    integrations: {
      smtp: {
        enabled: false,
        host: '',
        port: 587,
        secure: true,
        username: '',
        password: '',
        fromEmail: '',
        fromName: ''
      },
      sms: {
        enabled: false,
        provider: 'twilio',
        apiKey: '',
        apiSecret: '',
        senderId: ''
      },
      payment: {
        enabled: false,
        provider: 'stripe',
        apiKey: '',
        webhookSecret: ''
      }
    },
    performance: {
      cacheEnabled: true,
      cacheDuration: 3600,
      maxUploadSize: 10,
      allowedFileTypes: ['jpg', 'png', 'pdf', 'doc', 'xlsx'],
      compressionEnabled: true
    },
    logs: {
      retentionDays: 30,
      logLevel: 'info',
      auditLogEnabled: true,
      errorLogEnabled: true
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsApi.getSystemSettings();
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
      showToast('Failed to load system settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, subsection, field, value) => {
    if (subsection) {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [field]: value
          }
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await settingsApi.updateSystemSettings(settings);
      if (response.data.success) {
        showToast('System settings saved successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to save system settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async (type) => {
    try {
      const response = await settingsApi.testConnection(type, settings.integrations[type]);
      if (response.data.success) {
        showToast(`${type.toUpperCase()} connection successful!`, 'success');
      }
    } catch (error) {
      showToast(`Failed to connect to ${type.toUpperCase()}`, 'error');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500 mt-1">Configure system-wide settings and integrations</p>
      </div>

      {/* System Configuration */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">System Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">System Name</label>
            <input
              type="text"
              value={settings.system.systemName}
              onChange={(e) => handleChange('system', null, 'systemName', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">System URL</label>
            <input
              type="url"
              value={settings.system.systemUrl}
              onChange={(e) => handleChange('system', null, 'systemUrl', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
            <input
              type="email"
              value={settings.system.supportEmail}
              onChange={(e) => handleChange('system', null, 'supportEmail', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
            <input
              type="tel"
              value={settings.system.supportPhone}
              onChange={(e) => handleChange('system', null, 'supportPhone', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.system.maintenanceMode}
              onChange={(e) => handleChange('system', null, 'maintenanceMode', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Maintenance Mode</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.system.debugMode}
              onChange={(e) => handleChange('system', null, 'debugMode', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Debug Mode</span>
          </label>
        </div>
      </Card>

      {/* SMTP Settings */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Email (SMTP) Settings</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.integrations.smtp.enabled}
              onChange={(e) => handleChange('integrations', 'smtp', 'enabled', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Enable SMTP</span>
          </label>
        </div>
        {settings.integrations.smtp.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                <input
                  type="text"
                  value={settings.integrations.smtp.host}
                  onChange={(e) => handleChange('integrations', 'smtp', 'host', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                <input
                  type="number"
                  value={settings.integrations.smtp.port}
                  onChange={(e) => handleChange('integrations', 'smtp', 'port', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={settings.integrations.smtp.username}
                  onChange={(e) => handleChange('integrations', 'smtp', 'username', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={settings.integrations.smtp.password}
                  onChange={(e) => handleChange('integrations', 'smtp', 'password', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                <input
                  type="email"
                  value={settings.integrations.smtp.fromEmail}
                  onChange={(e) => handleChange('integrations', 'smtp', 'fromEmail', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                <input
                  type="text"
                  value={settings.integrations.smtp.fromName}
                  onChange={(e) => handleChange('integrations', 'smtp', 'fromName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => handleTestConnection('smtp')}>
                Test Connection
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* SMS Settings */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">SMS Settings</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.integrations.sms.enabled}
              onChange={(e) => handleChange('integrations', 'sms', 'enabled', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Enable SMS</span>
          </label>
        </div>
        {settings.integrations.sms.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <select
                  value={settings.integrations.sms.provider}
                  onChange={(e) => handleChange('integrations', 'sms', 'provider', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="twilio">Twilio</option>
                  <option value="nexmo">Vonage (Nexmo)</option>
                  <option value="aws">AWS SNS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key / Account SID</label>
                <input
                  type="text"
                  value={settings.integrations.sms.apiKey}
                  onChange={(e) => handleChange('integrations', 'sms', 'apiKey', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Secret / Auth Token</label>
                <input
                  type="password"
                  value={settings.integrations.sms.apiSecret}
                  onChange={(e) => handleChange('integrations', 'sms', 'apiSecret', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sender ID</label>
                <input
                  type="text"
                  value={settings.integrations.sms.senderId}
                  onChange={(e) => handleChange('integrations', 'sms', 'senderId', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="FMS Alert"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => handleTestConnection('sms')}>
                Test Connection
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Performance Settings */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Performance Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cache Duration (seconds)</label>
            <input
              type="number"
              value={settings.performance.cacheDuration}
              onChange={(e) => handleChange('performance', null, 'cacheDuration', parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Upload Size (MB)</label>
            <input
              type="number"
              value={settings.performance.maxUploadSize}
              onChange={(e) => handleChange('performance', null, 'maxUploadSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.performance.cacheEnabled}
              onChange={(e) => handleChange('performance', null, 'cacheEnabled', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Enable Cache</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.performance.compressionEnabled}
              onChange={(e) => handleChange('performance', null, 'compressionEnabled', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Enable Compression</span>
          </label>
        </div>
      </Card>

      {/* Logs Settings */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Logs & Monitoring</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Log Retention (days)</label>
            <input
              type="number"
              value={settings.logs.retentionDays}
              onChange={(e) => handleChange('logs', null, 'retentionDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Log Level</label>
            <select
              value={settings.logs.logLevel}
              onChange={(e) => handleChange('logs', null, 'logLevel', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.logs.auditLogEnabled}
              onChange={(e) => handleChange('logs', null, 'auditLogEnabled', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Enable Audit Logs</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.logs.errorLogEnabled}
              onChange={(e) => handleChange('logs', null, 'errorLogEnabled', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Enable Error Logs</span>
          </label>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={fetchSettings}>
          Reset
        </Button>
        <Button onClick={handleSave} isLoading={saving}>
          Save System Settings
        </Button>
      </div>
    </div>
  );
};

export default SystemSettings;