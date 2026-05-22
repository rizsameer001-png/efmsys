// // client/src/pages/reports/ReportBuilder.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { reportApi } from '../../api/report.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const ReportBuilder = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [generating, setGenerating] = useState(false);
//   const [reportConfig, setReportConfig] = useState({
//     name: '',
//     description: '',
//     module: 'attendance',
//     reportType: 'summary',
//     dateRange: 'this_month',
//     startDate: '',
//     endDate: '',
//     fields: [],
//     filters: {},
//     groupBy: '',
//     sortBy: '',
//     sortOrder: 'desc',
//     format: 'pdf',
//     schedule: {
//       enabled: false,
//       frequency: 'monthly',
//       recipients: []
//     }
//   });

//   const modules = [
//     { value: 'attendance', label: 'Attendance', icon: '📊' },
//     { value: 'leave', label: 'Leave', icon: '🏖️' },
//     { value: 'task', label: 'Task', icon: '📋' },
//     { value: 'salary', label: 'Salary', icon: '💰' },
//     { value: 'building', label: 'Building', icon: '🏢' },
//     { value: 'complaint', label: 'Complaint', icon: '⚠️' },
//     { value: 'user', label: 'User', icon: '👥' }
//   ];

//   const dateRanges = [
//     { value: 'today', label: 'Today' },
//     { value: 'yesterday', label: 'Yesterday' },
//     { value: 'this_week', label: 'This Week' },
//     { value: 'last_week', label: 'Last Week' },
//     { value: 'this_month', label: 'This Month' },
//     { value: 'last_month', label: 'Last Month' },
//     { value: 'this_quarter', label: 'This Quarter' },
//     { value: 'this_year', label: 'This Year' },
//     { value: 'custom', label: 'Custom Range' }
//   ];

//   const formats = [
//     { value: 'pdf', label: 'PDF Document', icon: '📄' },
//     { value: 'csv', label: 'CSV Spreadsheet', icon: '📊' },
//     { value: 'excel', label: 'Excel File', icon: '📈' },
//     { value: 'json', label: 'JSON Data', icon: '📋' }
//   ];

//   const attendanceFields = [
//     { value: 'employeeName', label: 'Employee Name' },
//     { value: 'employeeId', label: 'Employee ID' },
//     { value: 'department', label: 'Department' },
//     { value: 'date', label: 'Date' },
//     { value: 'checkIn', label: 'Check In Time' },
//     { value: 'checkOut', label: 'Check Out Time' },
//     { value: 'totalHours', label: 'Total Hours' },
//     { value: 'status', label: 'Status' },
//     { value: 'lateMinutes', label: 'Late Minutes' }
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setReportConfig(prev => ({
//         ...prev,
//         [parent]: { ...prev[parent], [child]: value }
//       }));
//     } else {
//       setReportConfig(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleFieldToggle = (field) => {
//     setReportConfig(prev => ({
//       ...prev,
//       fields: prev.fields.includes(field)
//         ? prev.fields.filter(f => f !== field)
//         : [...prev.fields, field]
//     }));
//   };

//   const handleGenerate = async () => {
//     if (!reportConfig.name) {
//       showToast('Please enter a report name', 'warning');
//       return;
//     }
    
//     if (reportConfig.fields.length === 0) {
//       showToast('Please select at least one field', 'warning');
//       return;
//     }
    
//     setGenerating(true);
//     try {
//       const response = await reportApi.generateCustomReport(reportConfig);
//       if (response.data.success) {
//         showToast('Report generated successfully!', 'success');
        
//         // Download the report
//         if (reportConfig.format === 'pdf') {
//           const blob = new Blob([response.data], { type: 'application/pdf' });
//           const url = URL.createObjectURL(blob);
//           window.open(url, '_blank');
//         } else if (reportConfig.format === 'csv') {
//           const blob = new Blob([response.data], { type: 'text/csv' });
//           const url = URL.createObjectURL(blob);
//           const link = document.createElement('a');
//           link.href = url;
//           link.download = `${reportConfig.name.replace(/\s/g, '_')}.csv`;
//           link.click();
//         }
        
//         navigate('/reports');
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to generate report', 'error');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const handleSaveTemplate = async () => {
//     try {
//       await reportApi.saveReportTemplate(reportConfig);
//       showToast('Report template saved successfully', 'success');
//     } catch (error) {
//       showToast('Failed to save template', 'error');
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Custom Report Builder</h1>
//         <p className="text-gray-500 mt-1">Create custom reports with selected fields and filters</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Configuration */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Basic Info */}
//           <Card className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4">Report Information</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Report Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={reportConfig.name}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="e.g., Monthly Attendance Summary"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                 <textarea
//                   name="description"
//                   value={reportConfig.description}
//                   onChange={handleChange}
//                   rows={2}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Brief description of the report"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
//                   <select
//                     name="module"
//                     value={reportConfig.module}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border rounded-lg"
//                   >
//                     {modules.map(module => (
//                       <option key={module.value} value={module.value}>
//                         {module.icon} {module.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
//                   <select
//                     name="reportType"
//                     value={reportConfig.reportType}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border rounded-lg"
//                   >
//                     <option value="summary">Summary Report</option>
//                     <option value="detailed">Detailed Report</option>
//                     <option value="aggregate">Aggregate Report</option>
//                     <option value="comparison">Comparison Report</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </Card>

//           {/* Date Range */}
//           <Card className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4">Date Range</h3>
//             <div className="space-y-4">
//               <select
//                 name="dateRange"
//                 value={reportConfig.dateRange}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded-lg"
//               >
//                 {dateRanges.map(range => (
//                   <option key={range.value} value={range.value}>{range.label}</option>
//                 ))}
//               </select>
              
//               {reportConfig.dateRange === 'custom' && (
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//                     <input
//                       type="date"
//                       name="startDate"
//                       value={reportConfig.startDate}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border rounded-lg"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//                     <input
//                       type="date"
//                       name="endDate"
//                       value={reportConfig.endDate}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border rounded-lg"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </Card>

//           {/* Fields Selection */}
//           <Card className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4">Select Fields</h3>
//             <div className="grid grid-cols-2 gap-2">
//               {attendanceFields.map(field => (
//                 <label key={field.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     checked={reportConfig.fields.includes(field.value)}
//                     onChange={() => handleFieldToggle(field.value)}
//                     className="w-4 h-4 rounded border-gray-300"
//                   />
//                   <span className="text-sm text-gray-700">{field.label}</span>
//                 </label>
//               ))}
//             </div>
//             {reportConfig.fields.length === 0 && (
//               <p className="text-sm text-yellow-600 mt-2">Please select at least one field</p>
//             )}
//           </Card>

//           {/* Sort & Group */}
//           <Card className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4">Sort & Group</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
//                 <select
//                   name="groupBy"
//                   value={reportConfig.groupBy}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 >
//                   <option value="">None</option>
//                   <option value="department">Department</option>
//                   <option value="status">Status</option>
//                   <option value="month">Month</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
//                 <select
//                   name="sortBy"
//                   value={reportConfig.sortBy}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 >
//                   <option value="">None</option>
//                   <option value="date">Date</option>
//                   <option value="name">Name</option>
//                   <option value="department">Department</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
//                 <select
//                   name="sortOrder"
//                   value={reportConfig.sortOrder}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 >
//                   <option value="asc">Ascending</option>
//                   <option value="desc">Descending</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
//                 <select
//                   name="format"
//                   value={reportConfig.format}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 >
//                   {formats.map(format => (
//                     <option key={format.value} value={format.value}>
//                       {format.icon} {format.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* Right Column - Preview & Actions */}
//         <div className="space-y-6">
//           {/* Preview Card */}
//           <Card className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4">Report Preview</h3>
//             <div className="bg-gray-50 rounded-lg p-4">
//               <p className="text-sm text-gray-600 mb-2">
//                 <span className="font-medium">Name:</span> {reportConfig.name || 'Untitled Report'}
//               </p>
//               <p className="text-sm text-gray-600 mb-2">
//                 <span className="font-medium">Module:</span> {modules.find(m => m.value === reportConfig.module)?.label}
//               </p>
//               <p className="text-sm text-gray-600 mb-2">
//                 <span className="font-medium">Fields:</span> {reportConfig.fields.length} selected
//               </p>
//               <p className="text-sm text-gray-600 mb-2">
//                 <span className="font-medium">Format:</span> {formats.find(f => f.value === reportConfig.format)?.label}
//               </p>
//               <p className="text-sm text-gray-600">
//                 <span className="font-medium">Date Range:</span> {dateRanges.find(d => d.value === reportConfig.dateRange)?.label}
//               </p>
//             </div>
//           </Card>

//           {/* Schedule Options */}
//           <Card className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4">Schedule Report</h3>
//             <label className="flex items-center gap-2 mb-3">
//               <input
//                 type="checkbox"
//                 checked={reportConfig.schedule.enabled}
//                 onChange={(e) => setReportConfig(prev => ({
//                   ...prev,
//                   schedule: { ...prev.schedule, enabled: e.target.checked }
//                 }))}
//                 className="w-4 h-4 rounded border-gray-300"
//               />
//               <span className="text-sm text-gray-700">Enable automatic scheduling</span>
//             </label>
            
//             {reportConfig.schedule.enabled && (
//               <div className="space-y-3">
//                 <select
//                   name="schedule.frequency"
//                   value={reportConfig.schedule.frequency}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 >
//                   <option value="daily">Daily</option>
//                   <option value="weekly">Weekly</option>
//                   <option value="monthly">Monthly</option>
//                   <option value="quarterly">Quarterly</option>
//                 </select>
//                 <input
//                   type="email"
//                   placeholder="Recipient email (comma separated)"
//                   value={reportConfig.schedule.recipients.join(', ')}
//                   onChange={(e) => setReportConfig(prev => ({
//                     ...prev,
//                     schedule: { ...prev.schedule, recipients: e.target.value.split(',').map(s => s.trim()) }
//                   }))}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 />
//               </div>
//             )}
//           </Card>

//           {/* Action Buttons */}
//           <Card className="p-6">
//             <div className="space-y-3">
//               <Button 
//                 onClick={handleGenerate} 
//                 isLoading={generating}
//                 className="w-full"
//               >
//                 🚀 Generate Report
//               </Button>
//               <Button 
//                 variant="secondary" 
//                 onClick={handleSaveTemplate}
//                 className="w-full"
//               >
//                 💾 Save as Template
//               </Button>
//               <Button 
//                 variant="secondary" 
//                 onClick={() => navigate('/reports')}
//                 className="w-full"
//               >
//                 Cancel
//               </Button>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportBuilder;







import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportApi } from '../../api/report.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

// 🔧 FIXED: Default field sets for different modules
const MODULE_FIELDS = {
  attendance: [
    { value: 'employeeName', label: 'Employee Name' },
    { value: 'employeeId', label: 'Employee ID' },
    { value: 'department', label: 'Department' },
    { value: 'date', label: 'Date' },
    { value: 'checkIn', label: 'Check In Time' },
    { value: 'checkOut', label: 'Check Out Time' },
    { value: 'totalHours', label: 'Total Hours' },
    { value: 'status', label: 'Status' },
    { value: 'lateMinutes', label: 'Late Minutes' }
  ],
  leave: [
    { value: 'employeeName', label: 'Employee Name' },
    { value: 'leaveType', label: 'Leave Type' },
    { value: 'startDate', label: 'Start Date' },
    { value: 'endDate', label: 'End Date' },
    { value: 'duration', label: 'Duration' },
    { value: 'status', label: 'Status' }
  ],
  task: [
    { value: 'taskTitle', label: 'Task Title' },
    { value: 'assignedTo', label: 'Assigned To' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' },
    { value: 'createdDate', label: 'Created Date' },
    { value: 'completedDate', label: 'Completed Date' },
    { value: 'slaStatus', label: 'SLA Status' }
  ],
  salary: [
    { value: 'employeeName', label: 'Employee Name' },
    { value: 'basicSalary', label: 'Basic Salary' },
    { value: 'allowances', label: 'Allowances' },
    { value: 'deductions', label: 'Deductions' },
    { value: 'netSalary', label: 'Net Salary' },
    { value: 'paymentDate', label: 'Payment Date' }
  ],
  building: [
    { value: 'buildingName', label: 'Building Name' },
    { value: 'unitNumber', label: 'Unit Number' },
    { value: 'unitType', label: 'Unit Type' },
    { value: 'status', label: 'Status' },
    { value: 'occupancy', label: 'Occupancy' }
  ],
  complaint: [
    { value: 'complaintId', label: 'Complaint ID' },
    { value: 'customerName', label: 'Customer Name' },
    { value: 'category', label: 'Category' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' },
    { value: 'resolutionTime', label: 'Resolution Time' }
  ],
  user: [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'role', label: 'Role' },
    { value: 'department', label: 'Department' },
    { value: 'status', label: 'Status' },
    { value: 'joinDate', label: 'Join Date' }
  ]
};

const ReportBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [loadingFields, setLoadingFields] = useState(false);
  const [availableFields, setAvailableFields] = useState(MODULE_FIELDS.attendance);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    module: 'attendance',
    reportType: 'summary',
    dateRange: 'this_month',
    startDate: '',
    endDate: '',
    fields: [],
    filters: {},
    groupBy: '',
    sortBy: '',
    sortOrder: 'desc',
    format: 'pdf',
    schedule: {
      enabled: false,
      frequency: 'monthly',
      recipients: []
    }
  });

  const modules = [
    { value: 'attendance', label: 'Attendance', icon: '📊' },
    { value: 'leave', label: 'Leave', icon: '🏖️' },
    { value: 'task', label: 'Task', icon: '📋' },
    { value: 'salary', label: 'Salary', icon: '💰' },
    { value: 'building', label: 'Building', icon: '🏢' },
    { value: 'complaint', label: 'Complaint', icon: '⚠️' },
    { value: 'user', label: 'User', icon: '👥' }
  ];

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this_week', label: 'This Week' },
    { value: 'last_week', label: 'Last Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_quarter', label: 'This Quarter' },
    { value: 'this_year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const formats = [
    { value: 'pdf', label: 'PDF Document', icon: '📄' },
    { value: 'csv', label: 'CSV Spreadsheet', icon: '📊' },
    { value: 'excel', label: 'Excel File', icon: '📈' },
    { value: 'json', label: 'JSON Data', icon: '📋' }
  ];

  // 🔧 FIXED: Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  // 🔧 FIXED: Update available fields when module changes
  useEffect(() => {
    setAvailableFields(MODULE_FIELDS[reportConfig.module] || MODULE_FIELDS.attendance);
    // Clear selected fields when module changes
    setReportConfig(prev => ({ ...prev, fields: [] }));
  }, [reportConfig.module]);

  // 🔧 FIXED: Load saved templates
  const loadTemplates = async () => {
    try {
      const response = await reportApi.getReportTemplates();
      if (response.data.success && response.data.data) {
        setTemplates(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      // Don't show toast for this, it's non-critical
    }
  };

  // 🔧 FIXED: Apply template
  const applyTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template && template.config) {
      setReportConfig(prev => ({
        ...prev,
        ...template.config,
        name: template.name,
        description: template.description
      }));
      showToast('Template applied successfully', 'success');
    }
  };

  // 🔧 FIXED: Reset form
  const resetForm = () => {
    setReportConfig({
      name: '',
      description: '',
      module: 'attendance',
      reportType: 'summary',
      dateRange: 'this_month',
      startDate: '',
      endDate: '',
      fields: [],
      filters: {},
      groupBy: '',
      sortBy: '',
      sortOrder: 'desc',
      format: 'pdf',
      schedule: {
        enabled: false,
        frequency: 'monthly',
        recipients: []
      }
    });
    setSelectedTemplate('');
    showToast('Form reset', 'info');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setReportConfig(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setReportConfig(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFieldToggle = (field) => {
    setReportConfig(prev => ({
      ...prev,
      fields: prev.fields.includes(field)
        ? prev.fields.filter(f => f !== field)
        : [...prev.fields, field]
    }));
  };

  const handleSelectAllFields = () => {
    if (reportConfig.fields.length === availableFields.length) {
      setReportConfig(prev => ({ ...prev, fields: [] }));
    } else {
      setReportConfig(prev => ({ 
        ...prev, 
        fields: availableFields.map(f => f.value) 
      }));
    }
  };

  // 🔧 FIXED: Enhanced handleGenerate with better error handling
  const handleGenerate = async () => {
    if (!reportConfig.name) {
      showToast('Please enter a report name', 'warning');
      return;
    }
    
    if (reportConfig.fields.length === 0) {
      showToast('Please select at least one field', 'warning');
      return;
    }
    
    setGenerating(true);
    try {
      const response = await reportApi.generateCustomReport(reportConfig);
      
      // Handle response based on format
      if (reportConfig.format === 'pdf') {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        showToast('Report generated and opened in new tab', 'success');
      } else if (reportConfig.format === 'csv') {
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportConfig.name.replace(/\s/g, '_')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Report downloaded successfully', 'success');
      } else if (reportConfig.format === 'excel') {
        const blob = new Blob([response.data], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportConfig.name.replace(/\s/g, '_')}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Report downloaded successfully', 'success');
      } else if (response.data.success) {
        showToast('Report generated successfully!', 'success');
        navigate('/reports');
      } else {
        showToast(response.data.message || 'Report generated successfully', 'success');
      }
    } catch (error) {
      console.error('Generate report error:', error);
      
      if (error.response?.status === 404) {
        showToast('Report generation API not available. This is a demo.', 'warning');
        // Demo fallback
        showToast('Demo: Report would be generated here', 'info');
      } else if (error.response?.status === 403) {
        showToast('Access denied. You need admin permissions.', 'error');
      } else if (error.code === 'ERR_NETWORK') {
        showToast('Network error. Please check your connection.', 'error');
      } else {
        showToast(error.response?.data?.error || 'Failed to generate report', 'error');
      }
    } finally {
      setGenerating(false);
    }
  };

  // 🔧 FIXED: Enhanced handleSaveTemplate
  const handleSaveTemplate = async () => {
    if (!reportConfig.name) {
      showToast('Please enter a report name before saving', 'warning');
      return;
    }
    
    setSavingTemplate(true);
    try {
      const templateData = {
        name: reportConfig.name,
        description: reportConfig.description,
        config: {
          module: reportConfig.module,
          reportType: reportConfig.reportType,
          dateRange: reportConfig.dateRange,
          fields: reportConfig.fields,
          groupBy: reportConfig.groupBy,
          sortBy: reportConfig.sortBy,
          sortOrder: reportConfig.sortOrder,
          format: reportConfig.format
        },
        isPublic: user?.role === 'admin' || user?.role === 'super_admin'
      };
      
      const response = await reportApi.saveReportTemplate(templateData);
      if (response.data.success) {
        showToast('Report template saved successfully', 'success');
        loadTemplates(); // Refresh templates list
      }
    } catch (error) {
      console.error('Save template error:', error);
      showToast('Failed to save template', 'error');
    } finally {
      setSavingTemplate(false);
    }
  };

  // Get preview summary
  const getPreviewSummary = () => {
    const module = modules.find(m => m.value === reportConfig.module);
    const format = formats.find(f => f.value === reportConfig.format);
    const dateRange = dateRanges.find(d => d.value === reportConfig.dateRange);
    
    return {
      moduleName: module?.label || 'Unknown',
      formatName: format?.label || 'Unknown',
      dateRangeName: dateRange?.label || 'Unknown',
      fieldCount: reportConfig.fields.length,
      hasSchedule: reportConfig.schedule.enabled
    };
  };

  const preview = getPreviewSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Report Builder</h1>
          <p className="text-gray-500 mt-1">Create custom reports with selected fields and filters</p>
        </div>
        <Button variant="secondary" onClick={resetForm}>
          Reset Form
        </Button>
      </div>

      {/* 🔧 FIXED: Template Selector */}
      {templates.length > 0 && (
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Load Template:</label>
            <select
              value={selectedTemplate}
              onChange={(e) => {
                setSelectedTemplate(e.target.value);
                if (e.target.value) applyTemplate(e.target.value);
              }}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a saved template --</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>{template.name}</option>
              ))}
            </select>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Report Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Name *</label>
                <input
                  type="text"
                  name="name"
                  value={reportConfig.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Monthly Attendance Summary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={reportConfig.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the report"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                  <select
                    name="module"
                    value={reportConfig.module}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {modules.map(module => (
                      <option key={module.value} value={module.value}>
                        {module.icon} {module.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                  <select
                    name="reportType"
                    value={reportConfig.reportType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="summary">Summary Report</option>
                    <option value="detailed">Detailed Report</option>
                    <option value="aggregate">Aggregate Report</option>
                    <option value="comparison">Comparison Report</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Date Range */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Date Range</h3>
            <div className="space-y-4">
              <select
                name="dateRange"
                value={reportConfig.dateRange}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              
              {reportConfig.dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={reportConfig.startDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={reportConfig.endDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Fields Selection */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Select Fields</h3>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleSelectAllFields}
              >
                {reportConfig.fields.length === availableFields.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {availableFields.map(field => (
                <label key={field.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reportConfig.fields.includes(field.value)}
                    onChange={() => handleFieldToggle(field.value)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{field.label}</span>
                </label>
              ))}
            </div>
            {reportConfig.fields.length === 0 && (
              <p className="text-sm text-yellow-600 mt-2">⚠️ Please select at least one field</p>
            )}
            {reportConfig.fields.length > 0 && (
              <p className="text-sm text-green-600 mt-2">✅ {reportConfig.fields.length} field(s) selected</p>
            )}
          </Card>

          {/* Sort & Group */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Sort & Group</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
                <select
                  name="groupBy"
                  value={reportConfig.groupBy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">None</option>
                  <option value="department">Department</option>
                  <option value="status">Status</option>
                  <option value="month">Month</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  name="sortBy"
                  value={reportConfig.sortBy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">None</option>
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="department">Department</option>
                  <option value="status">Status</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <select
                  name="sortOrder"
                  value={reportConfig.sortOrder}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="asc">Ascending (A-Z, 0-9)</option>
                  <option value="desc">Descending (Z-A, 9-0)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
                <select
                  name="format"
                  value={reportConfig.format}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {formats.map(format => (
                    <option key={format.value} value={format.value}>
                      {format.icon} {format.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Preview & Actions */}
        <div className="space-y-6">
          {/* Preview Card */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Report Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium text-gray-700">Name:</span>{' '}
                <span className="text-gray-900">{reportConfig.name || 'Untitled Report'}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700">Module:</span>{' '}
                <span className="text-gray-900">{preview.moduleName}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700">Fields:</span>{' '}
                <span className="text-gray-900">{preview.fieldCount} selected</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700">Format:</span>{' '}
                <span className="text-gray-900">{preview.formatName}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-700">Date Range:</span>{' '}
                <span className="text-gray-900">{preview.dateRangeName}</span>
              </p>
              {reportConfig.groupBy && (
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Group By:</span>{' '}
                  <span className="text-gray-900 capitalize">{reportConfig.groupBy}</span>
                </p>
              )}
              {reportConfig.sortBy && (
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Sort By:</span>{' '}
                  <span className="text-gray-900 capitalize">{reportConfig.sortBy} ({reportConfig.sortOrder === 'asc' ? '↑' : '↓'})</span>
                </p>
              )}
              {preview.hasSchedule && (
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Schedule:</span>{' '}
                  <span className="text-green-600">Enabled ({reportConfig.schedule.frequency})</span>
                </p>
              )}
            </div>
          </Card>

          {/* Schedule Options */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Schedule Report</h3>
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={reportConfig.schedule.enabled}
                onChange={(e) => setReportConfig(prev => ({
                  ...prev,
                  schedule: { ...prev.schedule, enabled: e.target.checked }
                }))}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Enable automatic scheduling</span>
            </label>
            
            {reportConfig.schedule.enabled && (
              <div className="space-y-3">
                <select
                  name="schedule.frequency"
                  value={reportConfig.schedule.frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
                <input
                  type="text"
                  placeholder="Recipient emails (comma separated)"
                  value={reportConfig.schedule.recipients.join(', ')}
                  onChange={(e) => setReportConfig(prev => ({
                    ...prev,
                    schedule: { 
                      ...prev.schedule, 
                      recipients: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    }
                  }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <p className="text-xs text-gray-500">Separate multiple emails with commas</p>
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <Card className="p-6">
            <div className="space-y-3">
              <Button 
                onClick={handleGenerate} 
                isLoading={generating}
                className="w-full"
                disabled={!reportConfig.name || reportConfig.fields.length === 0}
              >
                🚀 Generate Report
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleSaveTemplate}
                isLoading={savingTemplate}
                className="w-full"
                disabled={!reportConfig.name}
              >
                💾 Save as Template
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/reports')}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;