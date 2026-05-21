// // client/src/pages/salary/PayrollSettings.jsx
// import React, { useState, useEffect } from 'react';
// import { salaryApi } from '../../api/salary.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Input from '../../components/common/Input';
// import Select from '../../components/common/Select';
// import Tabs from '../../components/common/Tabs';

// const PayrollSettings = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [activeTab, setActiveTab] = useState('general');
//   const [settings, setSettings] = useState({
//     general: {
//       payrollCycle: 'monthly',
//       payrollDay: 25,
//       currency: 'AED',
//       decimalPlaces: 2,
//       autoProcess: false,
//       notificationOnProcess: true,
//       allowManualAdjustments: true
//     },
//     overtime: {
//       enabled: true,
//       weekdayMultiplier: 1.5,
//       weekendMultiplier: 2,
//       holidayMultiplier: 2.5,
//       maxHoursPerWeek: 20,
//       calculationMethod: 'hourly_rate'
//     },
//     deductions: {
//       taxEnabled: true,
//       taxPercentage: 0,
//       socialSecurityEnabled: true,
//       socialSecurityPercentage: 0,
//       pensionEnabled: true,
//       pensionPercentage: 0,
//       loanRecoveryEnabled: true,
//       insuranceEnabled: true
//     },
//     bank: {
//       bankName: '',
//       accountNumber: '',
//       accountName: '',
//       ifscCode: '',
//       iban: '',
//       fileFormat: 'wps'
//     },
//     country: {
//       country: 'UAE',
//       taxYearStart: '2024-01-01',
//       taxYearEnd: '2024-12-31',
//       minimumWage: 0,
//       overtimeRegulation: 'standard'
//     }
//   });

//   const countries = [
//     { value: 'UAE', label: 'United Arab Emirates' },
//     { value: 'USA', label: 'United States' },
//     { value: 'UK', label: 'United Kingdom' },
//     { value: 'INDIA', label: 'India' },
//     { value: 'SAUDI', label: 'Saudi Arabia' },
//     { value: 'QATAR', label: 'Qatar' },
//     { value: 'KUWAIT', label: 'Kuwait' },
//     { value: 'OMAN', label: 'Oman' },
//     { value: 'BAHRAIN', label: 'Bahrain' }
//   ];

//   const currencies = [
//     { value: 'AED', label: 'AED - UAE Dirham' },
//     { value: 'USD', label: 'USD - US Dollar' },
//     { value: 'GBP', label: 'GBP - British Pound' },
//     { value: 'INR', label: 'INR - Indian Rupee' },
//     { value: 'SAR', label: 'SAR - Saudi Riyal' },
//     { value: 'QAR', label: 'QAR - Qatari Riyal' },
//     { value: 'KWD', label: 'KWD - Kuwaiti Dinar' }
//   ];

//   const fileFormats = [
//     { value: 'wps', label: 'WPS (UAE Wage Protection System)' },
//     { value: 'ach', label: 'ACH (US)' },
//     { value: 'bacs', label: 'BACS (UK)' },
//     { value: 'neft', label: 'NEFT/RTGS (India)' },
//     { value: 'standard', label: 'Standard CSV/Excel' }
//   ];

//   const tabs = [
//     { id: 'general', label: 'General Settings', icon: '⚙️' },
//     { id: 'overtime', label: 'Overtime Rules', icon: '⏱️' },
//     { id: 'deductions', label: 'Deductions', icon: '📉' },
//     { id: 'bank', label: 'Bank Details', icon: '🏦' },
//     { id: 'country', label: 'Country Settings', icon: '🌍' }
//   ];

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     setLoading(true);
//     try {
//       const response = await salaryApi.getPayrollSettings();
//       if (response.data.success) {
//         setSettings(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch settings error:', error);
//       showToast('Failed to load payroll settings', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (section, field, value) => {
//     setSettings(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value
//       }
//     }));
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const response = await salaryApi.updatePayrollSettings(settings);
//       if (response.data.success) {
//         showToast('Payroll settings saved successfully', 'success');
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to save settings', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleReset = async () => {
//     if (window.confirm('Reset all payroll settings to default values?')) {
//       setSaving(true);
//       try {
//         const response = await salaryApi.resetPayrollSettings();
//         if (response.data.success) {
//           setSettings(response.data.data);
//           showToast('Payroll settings reset to default', 'success');
//         }
//       } catch (error) {
//         showToast('Failed to reset settings', 'error');
//       } finally {
//         setSaving(false);
//       }
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Payroll Settings</h1>
//           <p className="text-gray-500 mt-1">Configure payroll processing rules and defaults</p>
//         </div>
//         <div className="flex gap-3">
//           <Button variant="secondary" onClick={handleReset} disabled={saving}>
//             Reset to Default
//           </Button>
//           <Button onClick={handleSave} isLoading={saving}>
//             Save Settings
//           </Button>
//         </div>
//       </div>

//       <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

//       {/* General Settings Tab */}
//       {activeTab === 'general' && (
//         <Card className="p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Select
//               label="Payroll Cycle"
//               value={settings.general.payrollCycle}
//               onChange={(e) => handleInputChange('general', 'payrollCycle', e.target.value)}
//               options={[
//                 { value: 'monthly', label: 'Monthly' },
//                 { value: 'biweekly', label: 'Bi-weekly' },
//                 { value: 'weekly', label: 'Weekly' },
//                 { value: 'semi_monthly', label: 'Semi-monthly' }
//               ]}
//             />
//             <Input
//               label="Payroll Day"
//               type="number"
//               value={settings.general.payrollDay}
//               onChange={(e) => handleInputChange('general', 'payrollDay', parseInt(e.target.value))}
//               min={1}
//               max={31}
//             />
//             <Select
//               label="Currency"
//               value={settings.general.currency}
//               onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
//               options={currencies}
//             />
//             <Input
//               label="Decimal Places"
//               type="number"
//               value={settings.general.decimalPlaces}
//               onChange={(e) => handleInputChange('general', 'decimalPlaces', parseInt(e.target.value))}
//               min={0}
//               max={4}
//             />
//             <div className="col-span-2">
//               <div className="space-y-2">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={settings.general.autoProcess}
//                     onChange={(e) => handleInputChange('general', 'autoProcess', e.target.checked)}
//                     className="w-4 h-4 rounded border-gray-300"
//                   />
//                   <span className="text-sm text-gray-700">Auto-process payroll on scheduled date</span>
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={settings.general.notificationOnProcess}
//                     onChange={(e) => handleInputChange('general', 'notificationOnProcess', e.target.checked)}
//                     className="w-4 h-4 rounded border-gray-300"
//                   />
//                   <span className="text-sm text-gray-700">Send notifications when payroll is processed</span>
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={settings.general.allowManualAdjustments}
//                     onChange={(e) => handleInputChange('general', 'allowManualAdjustments', e.target.checked)}
//                     className="w-4 h-4 rounded border-gray-300"
//                   />
//                   <span className="text-sm text-gray-700">Allow manual adjustments before approval</span>
//                 </label>
//               </div>
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Overtime Rules Tab */}
//       {activeTab === 'overtime' && (
//         <Card className="p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Overtime Rules</h3>
//           <div className="space-y-4">
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={settings.overtime.enabled}
//                 onChange={(e) => handleInputChange('overtime', 'enabled', e.target.checked)}
//                 className="w-4 h-4 rounded border-gray-300"
//               />
//               <span className="text-sm font-medium text-gray-700">Enable Overtime Calculation</span>
//             </label>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input
//                 label="Weekday Multiplier"
//                 type="number"
//                 step="0.5"
//                 value={settings.overtime.weekdayMultiplier}
//                 onChange={(e) => handleInputChange('overtime', 'weekdayMultiplier', parseFloat(e.target.value))}
//               />
//               <Input
//                 label="Weekend Multiplier"
//                 type="number"
//                 step="0.5"
//                 value={settings.overtime.weekendMultiplier}
//                 onChange={(e) => handleInputChange('overtime', 'weekendMultiplier', parseFloat(e.target.value))}
//               />
//               <Input
//                 label="Holiday Multiplier"
//                 type="number"
//                 step="0.5"
//                 value={settings.overtime.holidayMultiplier}
//                 onChange={(e) => handleInputChange('overtime', 'holidayMultiplier', parseFloat(e.target.value))}
//               />
//               <Input
//                 label="Max Overtime Hours Per Week"
//                 type="number"
//                 value={settings.overtime.maxHoursPerWeek}
//                 onChange={(e) => handleInputChange('overtime', 'maxHoursPerWeek', parseInt(e.target.value))}
//               />
//               <Select
//                 label="Calculation Method"
//                 value={settings.overtime.calculationMethod}
//                 onChange={(e) => handleInputChange('overtime', 'calculationMethod', e.target.value)}
//                 options={[
//                   { value: 'hourly_rate', label: 'Based on Hourly Rate' },
//                   { value: 'basic_percentage', label: 'Percentage of Basic Salary' },
//                   { value: 'fixed_rate', label: 'Fixed Rate per Hour' }
//                 ]}
//               />
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Deductions Tab */}
//       {activeTab === 'deductions' && (
//         <Card className="p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Deduction Settings</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="col-span-2 border-b pb-2 mb-2">
//               <h4 className="font-medium text-gray-800">Tax Settings</h4>
//             </div>
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={settings.deductions.taxEnabled}
//                 onChange={(e) => handleInputChange('deductions', 'taxEnabled', e.target.checked)}
//                 className="w-4 h-4 rounded border-gray-300"
//               />
//               <span className="text-sm text-gray-700">Enable Tax Deduction</span>
//             </label>
//             <Input
//               label="Tax Percentage (%)"
//               type="number"
//               step="0.5"
//               value={settings.deductions.taxPercentage}
//               onChange={(e) => handleInputChange('deductions', 'taxPercentage', parseFloat(e.target.value))}
//               disabled={!settings.deductions.taxEnabled}
//             />

//             <div className="col-span-2 border-b pb-2 mb-2 mt-4">
//               <h4 className="font-medium text-gray-800">Social Security & Pension</h4>
//             </div>
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={settings.deductions.socialSecurityEnabled}
//                 onChange={(e) => handleInputChange('deductions', 'socialSecurityEnabled', e.target.checked)}
//                 className="w-4 h-4 rounded border-gray-300"
//               />
//               <span className="text-sm text-gray-700">Enable Social Security</span>
//             </label>
//             <Input
//               label="Social Security Percentage (%)"
//               type="number"
//               step="0.5"
//               value={settings.deductions.socialSecurityPercentage}
//               onChange={(e) => handleInputChange('deductions', 'socialSecurityPercentage', parseFloat(e.target.value))}
//               disabled={!settings.deductions.socialSecurityEnabled}
//             />
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={settings.deductions.pensionEnabled}
//                 onChange={(e) => handleInputChange('deductions', 'pensionEnabled', e.target.checked)}
//                 className="w-4 h-4 rounded border-gray-300"
//               />
//               <span className="text-sm text-gray-700">Enable Pension Deduction</span>
//             </label>
//             <Input
//               label="Pension Percentage (%)"
//               type="number"
//               step="0.5"
//               value={settings.deductions.pensionPercentage}
//               onChange={(e) => handleInputChange('deductions', 'pensionPercentage', parseFloat(e.target.value))}
//               disabled={!settings.deductions.pensionEnabled}
//             />

//             <div className="col-span-2 border-b pb-2 mb-2 mt-4">
//               <h4 className="font-medium text-gray-800">Other Deductions</h4>
//             </div>
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={settings.deductions.loanRecoveryEnabled}
//                 onChange={(e) => handleInputChange('deductions', 'loanRecoveryEnabled', e.target.checked)}
//                 className="w-4 h-4 rounded border-gray-300"
//               />
//               <span className="text-sm text-gray-700">Allow Loan Recovery Deductions</span>
//             </label>
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={settings.deductions.insuranceEnabled}
//                 onChange={(e) => handleInputChange('deductions', 'insuranceEnabled', e.target.checked)}
//                 className="w-4 h-4 rounded border-gray-300"
//               />
//               <span className="text-sm text-gray-700">Enable Insurance Deductions</span>
//             </label>
//           </div>
//         </Card>
//       )}

//       {/* Bank Details Tab */}
//       {activeTab === 'bank' && (
//         <Card className="p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Transfer Settings</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               label="Bank Name"
//               value={settings.bank.bankName}
//               onChange={(e) => handleInputChange('bank', 'bankName', e.target.value)}
//             />
//             <Input
//               label="Account Name"
//               value={settings.bank.accountName}
//               onChange={(e) => handleInputChange('bank', 'accountName', e.target.value)}
//             />
//             <Input
//               label="Account Number"
//               value={settings.bank.accountNumber}
//               onChange={(e) => handleInputChange('bank', 'accountNumber', e.target.value)}
//             />
//             <Input
//               label="IFSC Code"
//               value={settings.bank.ifscCode}
//               onChange={(e) => handleInputChange('bank', 'ifscCode', e.target.value)}
//             />
//             <Input
//               label="IBAN"
//               value={settings.bank.iban}
//               onChange={(e) => handleInputChange('bank', 'iban', e.target.value)}
//               className="col-span-2"
//             />
//             <Select
//               label="Bank File Format"
//               value={settings.bank.fileFormat}
//               onChange={(e) => handleInputChange('bank', 'fileFormat', e.target.value)}
//               options={fileFormats}
//               className="col-span-2"
//             />
//           </div>
//         </Card>
//       )}

//       {/* Country Settings Tab */}
//       {activeTab === 'country' && (
//         <Card className="p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Country-Specific Settings</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Select
//               label="Country"
//               value={settings.country.country}
//               onChange={(e) => handleInputChange('country', 'country', e.target.value)}
//               options={countries}
//             />
//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 label="Tax Year Start"
//                 type="date"
//                 value={settings.country.taxYearStart}
//                 onChange={(e) => handleInputChange('country', 'taxYearStart', e.target.value)}
//               />
//               <Input
//                 label="Tax Year End"
//                 type="date"
//                 value={settings.country.taxYearEnd}
//                 onChange={(e) => handleInputChange('country', 'taxYearEnd', e.target.value)}
//               />
//             </div>
//             <Input
//               label="Minimum Wage (Monthly)"
//               type="number"
//               value={settings.country.minimumWage}
//               onChange={(e) => handleInputChange('country', 'minimumWage', parseFloat(e.target.value))}
//             />
//             <Select
//               label="Overtime Regulation"
//               value={settings.country.overtimeRegulation}
//               onChange={(e) => handleInputChange('country', 'overtimeRegulation', e.target.value)}
//               options={[
//                 { value: 'standard', label: 'Standard (1.5x / 2x)' },
//                 { value: 'uae_labor', label: 'UAE Labor Law' },
//                 { value: 'eu_working_time', label: 'EU Working Time Directive' },
//                 { value: 'us_fair_labor', label: 'US Fair Labor Standards' }
//               ]}
//             />
//           </div>
//         </Card>
//       )}

//       {/* Action Buttons */}
//       <div className="flex justify-end gap-3">
//         <Button variant="secondary" onClick={fetchSettings} disabled={saving}>
//           Cancel
//         </Button>
//         <Button onClick={handleSave} isLoading={saving}>
//           Save All Settings
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default PayrollSettings;





// client/src/pages/salary/PayrollSettings.jsx
import React, { useState, useEffect } from 'react';
import { salaryApi } from '../../api/salary.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const PayrollSettings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { hasPermission } = usePermission();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      payrollCycle: 'monthly',
      payrollDay: 25,
      currency: 'AED',
      decimalPlaces: 2,
      autoProcess: false,
      notificationOnProcess: true,
      allowManualAdjustments: true
    },
    overtime: {
      enabled: true,
      weekdayMultiplier: 1.5,
      weekendMultiplier: 2,
      holidayMultiplier: 2.5,
      maxHoursPerWeek: 20,
      calculationMethod: 'hourly_rate'
    },
    deductions: {
      taxEnabled: true,
      taxPercentage: 0,
      socialSecurityEnabled: true,
      socialSecurityPercentage: 0,
      pensionEnabled: true,
      pensionPercentage: 0,
      loanRecoveryEnabled: true,
      insuranceEnabled: true
    },
    bank: {
      bankName: '',
      accountNumber: '',
      accountName: '',
      ifscCode: '',
      iban: '',
      fileFormat: 'wps'
    },
    country: {
      country: 'UAE',
      taxYearStart: new Date().getFullYear() + '-01-01',
      taxYearEnd: new Date().getFullYear() + '-12-31',
      minimumWage: 0,
      overtimeRegulation: 'standard'
    }
  });

  // Check if user has permission to manage payroll settings
  const canManagePayroll = hasPermission('payroll.manage') || 
                           user?.role === 'admin' || 
                           user?.role === 'super_admin' || 
                           user?.role === 'hr';

  const countries = [
    { value: 'UAE', label: 'United Arab Emirates' },
    { value: 'USA', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'INDIA', label: 'India' },
    { value: 'SAUDI', label: 'Saudi Arabia' },
    { value: 'QATAR', label: 'Qatar' },
    { value: 'KUWAIT', label: 'Kuwait' },
    { value: 'OMAN', label: 'Oman' },
    { value: 'BAHRAIN', label: 'Bahrain' }
  ];

  const currencies = [
    { value: 'AED', label: 'AED - UAE Dirham' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'SAR', label: 'SAR - Saudi Riyal' },
    { value: 'QAR', label: 'QAR - Qatari Riyal' },
    { value: 'KWD', label: 'KWD - Kuwaiti Dinar' }
  ];

  const fileFormats = [
    { value: 'wps', label: 'WPS (UAE Wage Protection System)' },
    { value: 'ach', label: 'ACH (US)' },
    { value: 'bacs', label: 'BACS (UK)' },
    { value: 'neft', label: 'NEFT/RTGS (India)' },
    { value: 'standard', label: 'Standard CSV/Excel' }
  ];

  const payrollCycles = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'biweekly', label: 'Bi-weekly (Every 2 weeks)' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'semi_monthly', label: 'Semi-monthly (Twice per month)' }
  ];

  const calculationMethods = [
    { value: 'hourly_rate', label: 'Based on Hourly Rate' },
    { value: 'basic_percentage', label: 'Percentage of Basic Salary' },
    { value: 'fixed_rate', label: 'Fixed Rate per Hour' }
  ];

  const overtimeRegulations = [
    { value: 'standard', label: 'Standard (1.5x / 2x / 2.5x)' },
    { value: 'uae_labor', label: 'UAE Labor Law (1.25x / 1.5x / 2x)' },
    { value: 'eu_working_time', label: 'EU Working Time Directive' },
    { value: 'us_fair_labor', label: 'US Fair Labor Standards Act (1.5x after 40hrs)' },
    { value: 'india_factories', label: 'India Factories Act (2x for overtime)' }
  ];

  const tabs = [
    { id: 'general', label: 'General Settings', icon: '⚙️' },
    { id: 'overtime', label: 'Overtime Rules', icon: '⏱️' },
    { id: 'deductions', label: 'Deductions', icon: '📉' },
    { id: 'bank', label: 'Bank Details', icon: '🏦' },
    { id: 'country', label: 'Country Settings', icon: '🌍' }
  ];

  useEffect(() => {
    if (canManagePayroll) {
      fetchSettings();
    }
  }, [canManagePayroll]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await salaryApi.getPayrollSettings();
      
      if (response.success && response.data) {
        // Merge fetched settings with defaults
        setSettings(prev => ({
          ...prev,
          ...response.data,
          general: { ...prev.general, ...response.data.general },
          overtime: { ...prev.overtime, ...response.data.overtime },
          deductions: { ...prev.deductions, ...response.data.deductions },
          bank: { ...prev.bank, ...response.data.bank },
          country: { ...prev.country, ...response.data.country }
        }));
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
      showToast(error.response?.data?.message || 'Failed to load payroll settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section, parent, child, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [child]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await salaryApi.updatePayrollSettings(settings);
      
      if (response.success) {
        showToast(response.message || 'Payroll settings saved successfully', 'success');
      } else {
        showToast(response.error || 'Failed to save settings', 'error');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      showToast(error.response?.data?.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all payroll settings to default values? This action cannot be undone.')) {
      setSaving(true);
      try {
        const response = await salaryApi.resetPayrollSettings();
        
        if (response.success && response.data) {
          setSettings(response.data);
          showToast('Payroll settings reset to default', 'success');
        } else {
          showToast(response.error || 'Failed to reset settings', 'error');
        }
      } catch (error) {
        console.error('Reset settings error:', error);
        showToast(error.response?.data?.message || 'Failed to reset settings', 'error');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleTestConnection = async () => {
    try {
      const response = await salaryApi.testBankConnection(settings.bank);
      if (response.success) {
        showToast('Bank connection test successful!', 'success');
      } else {
        showToast(response.error || 'Bank connection test failed', 'error');
      }
    } catch (error) {
      showToast('Bank connection test failed', 'error');
    }
  };

  if (!canManagePayroll) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-yellow-800 font-medium">Access Denied</p>
          <p className="text-sm text-yellow-600 mt-1">
            You don't have permission to access payroll settings.
          </p>
          <p className="text-xs text-yellow-500 mt-2">
            Required role: Admin, HR, or Super Admin
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Settings</h1>
          <p className="text-gray-500 mt-1">Configure payroll processing rules and defaults</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleReset} disabled={saving}>
            Reset to Default
          </Button>
          <Button onClick={handleSave} isLoading={saving}>
            Save Settings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap gap-2 -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Payroll Cycle"
              value={settings.general.payrollCycle}
              onChange={(e) => handleInputChange('general', 'payrollCycle', e.target.value)}
              options={payrollCycles}
            />
            <Input
              label="Payroll Day (of month)"
              type="number"
              value={settings.general.payrollDay}
              onChange={(e) => handleInputChange('general', 'payrollDay', parseInt(e.target.value) || 25)}
              min={1}
              max={31}
              helperText="Day of month when payroll is processed"
            />
            <Select
              label="Currency"
              value={settings.general.currency}
              onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
              options={currencies}
            />
            <Input
              label="Decimal Places"
              type="number"
              value={settings.general.decimalPlaces}
              onChange={(e) => handleInputChange('general', 'decimalPlaces', parseInt(e.target.value) || 2)}
              min={0}
              max={4}
              helperText="Number of decimal places for salary amounts"
            />
            <div className="col-span-2 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.general.autoProcess}
                  onChange={(e) => handleInputChange('general', 'autoProcess', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Auto-process payroll on scheduled date</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.general.notificationOnProcess}
                  onChange={(e) => handleInputChange('general', 'notificationOnProcess', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Send notifications when payroll is processed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.general.allowManualAdjustments}
                  onChange={(e) => handleInputChange('general', 'allowManualAdjustments', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Allow manual adjustments before approval</span>
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* Overtime Rules Tab */}
      {activeTab === 'overtime' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overtime Rules</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.overtime.enabled}
                onChange={(e) => handleInputChange('overtime', 'enabled', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Enable Overtime Calculation</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Weekday Multiplier"
                type="number"
                step="0.5"
                value={settings.overtime.weekdayMultiplier}
                onChange={(e) => handleInputChange('overtime', 'weekdayMultiplier', parseFloat(e.target.value) || 1.5)}
                disabled={!settings.overtime.enabled}
              />
              <Input
                label="Weekend Multiplier"
                type="number"
                step="0.5"
                value={settings.overtime.weekendMultiplier}
                onChange={(e) => handleInputChange('overtime', 'weekendMultiplier', parseFloat(e.target.value) || 2)}
                disabled={!settings.overtime.enabled}
              />
              <Input
                label="Holiday Multiplier"
                type="number"
                step="0.5"
                value={settings.overtime.holidayMultiplier}
                onChange={(e) => handleInputChange('overtime', 'holidayMultiplier', parseFloat(e.target.value) || 2.5)}
                disabled={!settings.overtime.enabled}
              />
              <Input
                label="Max Overtime Hours Per Week"
                type="number"
                value={settings.overtime.maxHoursPerWeek}
                onChange={(e) => handleInputChange('overtime', 'maxHoursPerWeek', parseInt(e.target.value) || 20)}
                disabled={!settings.overtime.enabled}
                min={0}
                max={40}
              />
              <Select
                label="Calculation Method"
                value={settings.overtime.calculationMethod}
                onChange={(e) => handleInputChange('overtime', 'calculationMethod', e.target.value)}
                options={calculationMethods}
                disabled={!settings.overtime.enabled}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Deductions Tab */}
      {activeTab === 'deductions' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deduction Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tax Settings */}
            <div className="col-span-2 border-b pb-2 mb-2">
              <h4 className="font-medium text-gray-800">💰 Tax Settings</h4>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.deductions.taxEnabled}
                onChange={(e) => handleInputChange('deductions', 'taxEnabled', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable Tax Deduction</span>
            </label>
            <Input
              label="Tax Percentage (%)"
              type="number"
              step="0.5"
              value={settings.deductions.taxPercentage}
              onChange={(e) => handleInputChange('deductions', 'taxPercentage', parseFloat(e.target.value) || 0)}
              disabled={!settings.deductions.taxEnabled}
              min={0}
              max={50}
            />

            {/* Social Security & Pension */}
            <div className="col-span-2 border-b pb-2 mb-2 mt-4">
              <h4 className="font-medium text-gray-800">🏛️ Social Security & Pension</h4>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.deductions.socialSecurityEnabled}
                onChange={(e) => handleInputChange('deductions', 'socialSecurityEnabled', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable Social Security</span>
            </label>
            <Input
              label="Social Security Percentage (%)"
              type="number"
              step="0.5"
              value={settings.deductions.socialSecurityPercentage}
              onChange={(e) => handleInputChange('deductions', 'socialSecurityPercentage', parseFloat(e.target.value) || 0)}
              disabled={!settings.deductions.socialSecurityEnabled}
              min={0}
              max={20}
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.deductions.pensionEnabled}
                onChange={(e) => handleInputChange('deductions', 'pensionEnabled', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable Pension Deduction</span>
            </label>
            <Input
              label="Pension Percentage (%)"
              type="number"
              step="0.5"
              value={settings.deductions.pensionPercentage}
              onChange={(e) => handleInputChange('deductions', 'pensionPercentage', parseFloat(e.target.value) || 0)}
              disabled={!settings.deductions.pensionEnabled}
              min={0}
              max={20}
            />

            {/* Other Deductions */}
            <div className="col-span-2 border-b pb-2 mb-2 mt-4">
              <h4 className="font-medium text-gray-800">📋 Other Deductions</h4>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.deductions.loanRecoveryEnabled}
                onChange={(e) => handleInputChange('deductions', 'loanRecoveryEnabled', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Allow Loan Recovery Deductions</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.deductions.insuranceEnabled}
                onChange={(e) => handleInputChange('deductions', 'insuranceEnabled', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable Insurance Deductions</span>
            </label>
          </div>
        </Card>
      )}

      {/* Bank Details Tab */}
      {activeTab === 'bank' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Transfer Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bank Name"
              value={settings.bank.bankName}
              onChange={(e) => handleInputChange('bank', 'bankName', e.target.value)}
              placeholder="e.g., Emirates NBD"
            />
            <Input
              label="Account Name"
              value={settings.bank.accountName}
              onChange={(e) => handleInputChange('bank', 'accountName', e.target.value)}
              placeholder="Account holder name"
            />
            <Input
              label="Account Number"
              value={settings.bank.accountNumber}
              onChange={(e) => handleInputChange('bank', 'accountNumber', e.target.value)}
              placeholder="Bank account number"
            />
            <Input
              label="IFSC / Routing Code"
              value={settings.bank.ifscCode}
              onChange={(e) => handleInputChange('bank', 'ifscCode', e.target.value)}
              placeholder="IFSC or routing number"
            />
            <Input
              label="IBAN"
              value={settings.bank.iban}
              onChange={(e) => handleInputChange('bank', 'iban', e.target.value)}
              placeholder="International Bank Account Number"
              className="md:col-span-2"
            />
            <Select
              label="Bank File Format"
              value={settings.bank.fileFormat}
              onChange={(e) => handleInputChange('bank', 'fileFormat', e.target.value)}
              options={fileFormats}
              className="md:col-span-2"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="secondary" onClick={handleTestConnection} disabled={saving}>
              Test Bank Connection
            </Button>
          </div>
        </Card>
      )}

      {/* Country Settings Tab */}
      {activeTab === 'country' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Country-Specific Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Country"
              value={settings.country.country}
              onChange={(e) => handleInputChange('country', 'country', e.target.value)}
              options={countries}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tax Year Start"
                type="date"
                value={settings.country.taxYearStart}
                onChange={(e) => handleInputChange('country', 'taxYearStart', e.target.value)}
              />
              <Input
                label="Tax Year End"
                type="date"
                value={settings.country.taxYearEnd}
                onChange={(e) => handleInputChange('country', 'taxYearEnd', e.target.value)}
              />
            </div>
            <Input
              label="Minimum Wage (Monthly)"
              type="number"
              value={settings.country.minimumWage}
              onChange={(e) => handleInputChange('country', 'minimumWage', parseFloat(e.target.value) || 0)}
              min={0}
              helperText="Legal minimum monthly wage in local currency"
            />
            <Select
              label="Overtime Regulation"
              value={settings.country.overtimeRegulation}
              onChange={(e) => handleInputChange('country', 'overtimeRegulation', e.target.value)}
              options={overtimeRegulations}
            />
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Country-specific settings apply to all employees with that country selected in their profile.
              Changes will affect future payroll calculations.
            </p>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={fetchSettings} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} isLoading={saving}>
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default PayrollSettings;