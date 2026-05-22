// // client/src/pages/settings/GeneralSettings.jsx
// import React, { useState, useEffect } from 'react';
// import { settingsApi } from '../../api/settings.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Input from '../../components/common/Input';

// const GeneralSettings = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [settings, setSettings] = useState({
//     company: {
//       name: '',
//       logo: '',
//       email: '',
//       phone: '',
//       website: '',
//       address: '',
//       city: '',
//       country: '',
//       taxId: '',
//       registrationNumber: ''
//     },
//     branding: {
//       primaryColor: '#3B82F6',
//       secondaryColor: '#10B981',
//       logoUrl: '',
//       faviconUrl: '',
//       companyTagline: ''
//     },
//     localization: {
//       defaultLanguage: 'en',
//       defaultTimezone: 'Asia/Dubai',
//       dateFormat: 'DD/MM/YYYY',
//       timeFormat: '24h',
//       currency: 'AED',
//       currencySymbol: 'AED'
//     },
//     notification: {
//       emailNotifications: true,
//       pushNotifications: true,
//       smsNotifications: false,
//       taskAssignmentAlerts: true,
//       leaveApprovalAlerts: true,
//       attendanceReminders: true,
//       salarySlipAlerts: true,
//       dailyDigest: false
//     },
//     security: {
//       sessionTimeout: 30,
//       maxLoginAttempts: 5,
//       passwordExpiryDays: 90,
//       twoFactorAuth: false,
//       ipWhitelist: []
//     }
//   });

//   const languages = [
//     { value: 'en', label: 'English' },
//     { value: 'ar', label: 'Arabic' },
//     { value: 'hi', label: 'Hindi' },
//     { value: 'ur', label: 'Urdu' }
//   ];

//   const timezones = [
//     { value: 'Asia/Dubai', label: 'Dubai (GMT+4)' },
//     { value: 'Asia/Kolkata', label: 'India (GMT+5:30)' },
//     { value: 'America/New_York', label: 'USA Eastern (GMT-5)' },
//     { value: 'Europe/London', label: 'UK (GMT+0)' }
//   ];

//   const dateFormats = [
//     { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
//     { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
//     { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
//   ];

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     setLoading(true);
//     try {
//       const response = await settingsApi.getGeneralSettings();
//       if (response.data.success) {
//         setSettings(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch settings error:', error);
//       showToast('Failed to load settings', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (section, field, value) => {
//     setSettings(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value
//       }
//     }));
//   };

//   const handleCompanyChange = (field, value) => {
//     setSettings(prev => ({
//       ...prev,
//       company: { ...prev.company, [field]: value }
//     }));
//   };

//   const handleNotificationToggle = (field) => {
//     setSettings(prev => ({
//       ...prev,
//       notification: { ...prev.notification, [field]: !prev.notification[field] }
//     }));
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const response = await settingsApi.updateGeneralSettings(settings);
//       if (response.data.success) {
//         showToast('Settings saved successfully', 'success');
//       }
//     } catch (error) {
//       showToast('Failed to save settings', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
//         <p className="text-gray-500 mt-1">Manage company information and general preferences</p>
//       </div>

//       {/* Company Information */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Company Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             label="Company Name"
//             value={settings.company.name}
//             onChange={(e) => handleCompanyChange('name', e.target.value)}
//           />
//           <Input
//             label="Company Email"
//             type="email"
//             value={settings.company.email}
//             onChange={(e) => handleCompanyChange('email', e.target.value)}
//           />
//           <Input
//             label="Phone Number"
//             value={settings.company.phone}
//             onChange={(e) => handleCompanyChange('phone', e.target.value)}
//           />
//           <Input
//             label="Website"
//             value={settings.company.website}
//             onChange={(e) => handleCompanyChange('website', e.target.value)}
//           />
//           <Input
//             label="Tax ID / VAT Number"
//             value={settings.company.taxId}
//             onChange={(e) => handleCompanyChange('taxId', e.target.value)}
//           />
//           <Input
//             label="Registration Number"
//             value={settings.company.registrationNumber}
//             onChange={(e) => handleCompanyChange('registrationNumber', e.target.value)}
//           />
//           <div className="md:col-span-2">
//             <Input
//               label="Address"
//               value={settings.company.address}
//               onChange={(e) => handleCompanyChange('address', e.target.value)}
//             />
//           </div>
//           <Input
//             label="City"
//             value={settings.company.city}
//             onChange={(e) => handleCompanyChange('city', e.target.value)}
//           />
//           <Input
//             label="Country"
//             value={settings.company.country}
//             onChange={(e) => handleCompanyChange('country', e.target.value)}
//           />
//         </div>
//       </Card>

//       {/* Branding */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Branding</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
//             <div className="flex gap-2">
//               <input
//                 type="color"
//                 value={settings.branding.primaryColor}
//                 onChange={(e) => handleChange('branding', 'primaryColor', e.target.value)}
//                 className="w-12 h-10 border rounded cursor-pointer"
//               />
//               <input
//                 type="text"
//                 value={settings.branding.primaryColor}
//                 onChange={(e) => handleChange('branding', 'primaryColor', e.target.value)}
//                 className="flex-1 px-3 py-2 border rounded-lg"
//               />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
//             <div className="flex gap-2">
//               <input
//                 type="color"
//                 value={settings.branding.secondaryColor}
//                 onChange={(e) => handleChange('branding', 'secondaryColor', e.target.value)}
//                 className="w-12 h-10 border rounded cursor-pointer"
//               />
//               <input
//                 type="text"
//                 value={settings.branding.secondaryColor}
//                 onChange={(e) => handleChange('branding', 'secondaryColor', e.target.value)}
//                 className="flex-1 px-3 py-2 border rounded-lg"
//               />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
//             <Input
//               value={settings.branding.logoUrl}
//               onChange={(e) => handleChange('branding', 'logoUrl', e.target.value)}
//               placeholder="https://example.com/logo.png"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Company Tagline</label>
//             <Input
//               value={settings.branding.companyTagline}
//               onChange={(e) => handleChange('branding', 'companyTagline', e.target.value)}
//               placeholder="Your company tagline"
//             />
//           </div>
//         </div>
//       </Card>

//       {/* Localization */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Localization</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
//             <select
//               value={settings.localization.defaultLanguage}
//               onChange={(e) => handleChange('localization', 'defaultLanguage', e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg"
//             >
//               {languages.map(lang => (
//                 <option key={lang.value} value={lang.value}>{lang.label}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
//             <select
//               value={settings.localization.defaultTimezone}
//               onChange={(e) => handleChange('localization', 'defaultTimezone', e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg"
//             >
//               {timezones.map(tz => (
//                 <option key={tz.value} value={tz.value}>{tz.label}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
//             <select
//               value={settings.localization.dateFormat}
//               onChange={(e) => handleChange('localization', 'dateFormat', e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg"
//             >
//               {dateFormats.map(df => (
//                 <option key={df.value} value={df.value}>{df.label}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
//             <select
//               value={settings.localization.timeFormat}
//               onChange={(e) => handleChange('localization', 'timeFormat', e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg"
//             >
//               <option value="12h">12-hour format</option>
//               <option value="24h">24-hour format</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
//             <select
//               value={settings.localization.currency}
//               onChange={(e) => handleChange('localization', 'currency', e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg"
//             >
//               <option value="AED">AED - UAE Dirham</option>
//               <option value="USD">USD - US Dollar</option>
//               <option value="EUR">EUR - Euro</option>
//               <option value="GBP">GBP - British Pound</option>
//               <option value="INR">INR - Indian Rupee</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
//             <Input
//               value={settings.localization.currencySymbol}
//               onChange={(e) => handleChange('localization', 'currencySymbol', e.target.value)}
//               maxLength={5}
//             />
//           </div>
//         </div>
//       </Card>

//       {/* Notification Settings */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
//         <div className="space-y-3">
//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <div>
//               <span className="text-gray-700">Email Notifications</span>
//               <p className="text-xs text-gray-500">Receive notifications via email</p>
//             </div>
//             <div className="relative inline-block w-10 mr-2 align-middle select-none">
//               <input
//                 type="checkbox"
//                 checked={settings.notification.emailNotifications}
//                 onChange={() => handleNotificationToggle('emailNotifications')}
//                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//               />
//               <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notification.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`} />
//             </div>
//           </label>

//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <div>
//               <span className="text-gray-700">Push Notifications</span>
//               <p className="text-xs text-gray-500">Receive browser push notifications</p>
//             </div>
//             <div className="relative inline-block w-10 mr-2 align-middle select-none">
//               <input
//                 type="checkbox"
//                 checked={settings.notification.pushNotifications}
//                 onChange={() => handleNotificationToggle('pushNotifications')}
//                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//               />
//               <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notification.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'}`} />
//             </div>
//           </label>

//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <div>
//               <span className="text-gray-700">Task Assignment Alerts</span>
//               <p className="text-xs text-gray-500">Get notified when tasks are assigned</p>
//             </div>
//             <div className="relative inline-block w-10 mr-2 align-middle select-none">
//               <input
//                 type="checkbox"
//                 checked={settings.notification.taskAssignmentAlerts}
//                 onChange={() => handleNotificationToggle('taskAssignmentAlerts')}
//                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//               />
//               <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notification.taskAssignmentAlerts ? 'bg-blue-600' : 'bg-gray-300'}`} />
//             </div>
//           </label>

//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <div>
//               <span className="text-gray-700">Leave Approval Alerts</span>
//               <p className="text-xs text-gray-500">Get notified when leave requests need approval</p>
//             </div>
//             <div className="relative inline-block w-10 mr-2 align-middle select-none">
//               <input
//                 type="checkbox"
//                 checked={settings.notification.leaveApprovalAlerts}
//                 onChange={() => handleNotificationToggle('leaveApprovalAlerts')}
//                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//               />
//               <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notification.leaveApprovalAlerts ? 'bg-blue-600' : 'bg-gray-300'}`} />
//             </div>
//           </label>

//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <div>
//               <span className="text-gray-700">Daily Digest</span>
//               <p className="text-xs text-gray-500">Receive daily summary of activities</p>
//             </div>
//             <div className="relative inline-block w-10 mr-2 align-middle select-none">
//               <input
//                 type="checkbox"
//                 checked={settings.notification.dailyDigest}
//                 onChange={() => handleNotificationToggle('dailyDigest')}
//                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//               />
//               <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notification.dailyDigest ? 'bg-blue-600' : 'bg-gray-300'}`} />
//             </div>
//           </label>
//         </div>
//       </Card>

//       {/* Security Settings */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
//             <Input
//               type="number"
//               value={settings.security.sessionTimeout}
//               onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
//               min={5}
//               max={120}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
//             <Input
//               type="number"
//               value={settings.security.maxLoginAttempts}
//               onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
//               min={3}
//               max={10}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (days)</label>
//             <Input
//               type="number"
//               value={settings.security.passwordExpiryDays}
//               onChange={(e) => handleChange('security', 'passwordExpiryDays', parseInt(e.target.value))}
//               min={30}
//               max={180}
//             />
//           </div>
//           <div>
//             <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mt-4">
//               <div>
//                 <span className="text-gray-700">Two-Factor Authentication</span>
//                 <p className="text-xs text-gray-500">Require 2FA for all users</p>
//               </div>
//               <div className="relative inline-block w-10 mr-2 align-middle select-none">
//                 <input
//                   type="checkbox"
//                   checked={settings.security.twoFactorAuth}
//                   onChange={() => handleChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
//                   className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//                 />
//                 <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300'}`} />
//               </div>
//             </label>
//           </div>
//         </div>
//       </Card>

//       {/* Action Buttons */}
//       <div className="flex justify-end gap-3">
//         <Button variant="secondary" onClick={fetchSettings}>
//           Reset
//         </Button>
//         <Button onClick={handleSave} isLoading={saving}>
//           Save Settings
//         </Button>
//       </div>

//       <style jsx>{`
//         .toggle-checkbox:checked {
//           right: 0;
//           border-color: #3B82F6;
//         }
//         .toggle-checkbox:checked + .toggle-label {
//           background-color: #3B82F6;
//         }
//         .toggle-checkbox {
//           right: 0;
//           transition: all 0.3s ease;
//         }
//         .toggle-checkbox:checked {
//           right: 1rem;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default GeneralSettings;





import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../api/settings.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Input from '../../components/common/Input';

const GeneralSettings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    company: {
      name: '',
      logo: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      city: '',
      country: '',
      taxId: '',
      registrationNumber: ''
    },
    branding: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      logoUrl: '',
      faviconUrl: '',
      companyTagline: ''
    },
    localization: {
      defaultLanguage: 'en',
      defaultTimezone: 'Asia/Dubai',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      currency: 'AED',
      currencySymbol: 'AED'
    },
    notification: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      taskAssignmentAlerts: true,
      leaveApprovalAlerts: true,
      attendanceReminders: true,
      salarySlipAlerts: true,
      dailyDigest: false
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordExpiryDays: 90,
      twoFactorAuth: false,
      ipWhitelist: []
    }
  });

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'Arabic' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ur', label: 'Urdu' }
  ];

  const timezones = [
    { value: 'Asia/Dubai', label: 'Dubai (GMT+4)' },
    { value: 'Asia/Kolkata', label: 'India (GMT+5:30)' },
    { value: 'America/New_York', label: 'USA Eastern (GMT-5)' },
    { value: 'Europe/London', label: 'UK (GMT+0)' }
  ];

  const dateFormats = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsApi.getGeneralSettings();
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
      showToast(error.userMessage || 'Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCompanyChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      company: { ...prev.company, [field]: value }
    }));
  };

  const handleNotificationToggle = (field) => {
    setSettings(prev => ({
      ...prev,
      notification: { ...prev.notification, [field]: !prev.notification[field] }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await settingsApi.updateGeneralSettings(settings);
      if (response.data.success) {
        showToast('Settings saved successfully', 'success');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      showToast(error.userMessage || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchSettings();
    showToast('Settings reset to last saved values', 'info');
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
          <p className="text-gray-500 mt-1">Manage company information and general preferences</p>
          {user?.role === 'super_admin' && (
            <p className="text-xs text-purple-600 mt-1">👑 Super Admin Access - Full control over all settings</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            Logged in as: <span className="font-medium">{user?.name || user?.email}</span>
          </div>
          <div className="text-xs text-gray-400">
            Role: <span className="capitalize">{user?.role || 'User'}</span>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            value={settings.company.name || ''}
            onChange={(e) => handleCompanyChange('name', e.target.value)}
          />
          <Input
            label="Company Email"
            type="email"
            value={settings.company.email || ''}
            onChange={(e) => handleCompanyChange('email', e.target.value)}
          />
          <Input
            label="Phone Number"
            value={settings.company.phone || ''}
            onChange={(e) => handleCompanyChange('phone', e.target.value)}
          />
          <Input
            label="Website"
            value={settings.company.website || ''}
            onChange={(e) => handleCompanyChange('website', e.target.value)}
          />
          <Input
            label="Tax ID / VAT Number"
            value={settings.company.taxId || ''}
            onChange={(e) => handleCompanyChange('taxId', e.target.value)}
          />
          <Input
            label="Registration Number"
            value={settings.company.registrationNumber || ''}
            onChange={(e) => handleCompanyChange('registrationNumber', e.target.value)}
          />
          <div className="md:col-span-2">
            <Input
              label="Address"
              value={settings.company.address || ''}
              onChange={(e) => handleCompanyChange('address', e.target.value)}
            />
          </div>
          <Input
            label="City"
            value={settings.company.city || ''}
            onChange={(e) => handleCompanyChange('city', e.target.value)}
          />
          <Input
            label="Country"
            value={settings.company.country || ''}
            onChange={(e) => handleCompanyChange('country', e.target.value)}
          />
        </div>
      </Card>

      {/* Branding */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Branding</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.branding.primaryColor || '#3B82F6'}
                onChange={(e) => handleChange('branding', 'primaryColor', e.target.value)}
                className="w-12 h-10 border rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.branding.primaryColor || '#3B82F6'}
                onChange={(e) => handleChange('branding', 'primaryColor', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.branding.secondaryColor || '#10B981'}
                onChange={(e) => handleChange('branding', 'secondaryColor', e.target.value)}
                className="w-12 h-10 border rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.branding.secondaryColor || '#10B981'}
                onChange={(e) => handleChange('branding', 'secondaryColor', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <Input
              value={settings.branding.logoUrl || ''}
              onChange={(e) => handleChange('branding', 'logoUrl', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Tagline</label>
            <Input
              value={settings.branding.companyTagline || ''}
              onChange={(e) => handleChange('branding', 'companyTagline', e.target.value)}
              placeholder="Your company tagline"
            />
          </div>
        </div>
      </Card>

      {/* Localization */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Localization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
            <select
              value={settings.localization.defaultLanguage || 'en'}
              onChange={(e) => handleChange('localization', 'defaultLanguage', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              value={settings.localization.defaultTimezone || 'Asia/Dubai'}
              onChange={(e) => handleChange('localization', 'defaultTimezone', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {timezones.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
            <select
              value={settings.localization.dateFormat || 'DD/MM/YYYY'}
              onChange={(e) => handleChange('localization', 'dateFormat', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {dateFormats.map(df => (
                <option key={df.value} value={df.value}>{df.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
            <select
              value={settings.localization.timeFormat || '24h'}
              onChange={(e) => handleChange('localization', 'timeFormat', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="12h">12-hour format</option>
              <option value="24h">24-hour format</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={settings.localization.currency || 'AED'}
              onChange={(e) => handleChange('localization', 'currency', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="AED">AED - UAE Dirham</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
            <Input
              value={settings.localization.currencySymbol || 'AED'}
              onChange={(e) => handleChange('localization', 'currencySymbol', e.target.value)}
              maxLength={5}
            />
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-700">Email Notifications</span>
              <p className="text-xs text-gray-500">Receive notifications via email</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                checked={settings.notification.emailNotifications}
                onChange={() => handleNotificationToggle('emailNotifications')}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notification.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`} />
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-700">Push Notifications</span>
              <p className="text-xs text-gray-500">Receive browser push notifications</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                checked={settings.notification.pushNotifications}
                onChange={() => handleNotificationToggle('pushNotifications')}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notification.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'}`} />
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-700">Task Assignment Alerts</span>
              <p className="text-xs text-gray-500">Get notified when tasks are assigned</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                checked={settings.notification.taskAssignmentAlerts}
                onChange={() => handleNotificationToggle('taskAssignmentAlerts')}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notification.taskAssignmentAlerts ? 'bg-blue-600' : 'bg-gray-300'}`} />
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-700">Leave Approval Alerts</span>
              <p className="text-xs text-gray-500">Get notified when leave requests need approval</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                checked={settings.notification.leaveApprovalAlerts}
                onChange={() => handleNotificationToggle('leaveApprovalAlerts')}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notification.leaveApprovalAlerts ? 'bg-blue-600' : 'bg-gray-300'}`} />
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-700">Daily Digest</span>
              <p className="text-xs text-gray-500">Receive daily summary of activities</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                checked={settings.notification.dailyDigest}
                onChange={() => handleNotificationToggle('dailyDigest')}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notification.dailyDigest ? 'bg-blue-600' : 'bg-gray-300'}`} />
            </div>
          </label>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
            <Input
              type="number"
              value={settings.security.sessionTimeout || 30}
              onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
              min={5}
              max={120}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
            <Input
              type="number"
              value={settings.security.maxLoginAttempts || 5}
              onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
              min={3}
              max={10}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (days)</label>
            <Input
              type="number"
              value={settings.security.passwordExpiryDays || 90}
              onChange={(e) => handleChange('security', 'passwordExpiryDays', parseInt(e.target.value))}
              min={30}
              max={180}
            />
          </div>
          <div>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mt-4">
              <div>
                <span className="text-gray-700">Two-Factor Authentication</span>
                <p className="text-xs text-gray-500">Require 2FA for all users</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={() => handleChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300'}`} />
              </div>
            </label>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleSave} isLoading={saving}>
          Save Settings
        </Button>
      </div>

      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #3B82F6;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3B82F6;
        }
        .toggle-checkbox {
          right: 0;
          transition: all 0.3s ease;
        }
        .toggle-checkbox:checked {
          right: 1rem;
        }
      `}</style>
    </div>
  );
};

export default GeneralSettings;