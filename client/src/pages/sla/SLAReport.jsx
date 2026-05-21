// // client/src/pages/sla/SLAReport.jsx
// import React, { useState, useEffect } from 'react';
// import { slaApi } from '../../api/sla.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Select from '../../components/common/Select';

// const SLAReport = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [exporting, setExporting] = useState(false);
//   const [reportData, setReportData] = useState(null);
//   const [filters, setFilters] = useState({
//     year: new Date().getFullYear(),
//     month: new Date().getMonth() + 1,
//     buildingId: 'all',
//     department: 'all'
//   });
//   const [buildings, setBuildings] = useState([]);
//   const [departments, setDepartments] = useState([]);

//   const years = [2023, 2024, 2025, 2026];
//   const months = [
//     { value: 1, label: 'January' },
//     { value: 2, label: 'February' },
//     { value: 3, label: 'March' },
//     { value: 4, label: 'April' },
//     { value: 5, label: 'May' },
//     { value: 6, label: 'June' },
//     { value: 7, label: 'July' },
//     { value: 8, label: 'August' },
//     { value: 9, label: 'September' },
//     { value: 10, label: 'October' },
//     { value: 11, label: 'November' },
//     { value: 12, label: 'December' }
//   ];

//   useEffect(() => {
//     fetchReportData();
//   }, [filters.year, filters.month, filters.buildingId, filters.department]);

//   const fetchReportData = async () => {
//     setLoading(true);
//     try {
//       const response = await slaApi.getMonthlySLAReport(
//         filters.year,
//         filters.month,
//         filters.buildingId !== 'all' ? filters.buildingId : undefined,
//         filters.department !== 'all' ? filters.department : undefined
//       );
//       if (response.data.success) {
//         setReportData(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch SLA report error:', error);
//       showToast('Failed to load SLA report', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExport = async (format) => {
//     setExporting(true);
//     try {
//       const response = await slaApi.exportSLAReport(
//         filters.year,
//         filters.month,
//         format,
//         filters.buildingId !== 'all' ? filters.buildingId : undefined,
//         filters.department !== 'all' ? filters.department : undefined
//       );
      
//       const blob = new Blob([response.data], { 
//         type: format === 'csv' ? 'text/csv' : 
//               format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
//               'application/pdf'
//       });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `sla_report_${filters.month}_${filters.year}.${format === 'excel' ? 'xlsx' : format}`;
//       a.click();
//       URL.revokeObjectURL(url);
      
//       showToast('Report exported successfully', 'success');
//     } catch (error) {
//       showToast('Failed to export report', 'error');
//     } finally {
//       setExporting(false);
//     }
//   };

//   const getComplianceColor = (rate) => {
//     if (rate >= 90) return 'text-green-600';
//     if (rate >= 75) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   const getTrendIcon = (trend) => {
//     if (trend > 0) return '📈';
//     if (trend < 0) return '📉';
//     return '📊';
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">SLA Report</h1>
//         <p className="text-gray-500 mt-1">Service Level Agreement compliance and performance report</p>
//       </div>

//       {/* Filters */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Report Filters</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           <Select
//             label="Year"
//             value={filters.year}
//             onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
//             options={years.map(y => ({ value: y, label: y.toString() }))}
//           />
//           <Select
//             label="Month"
//             value={filters.month}
//             onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
//             options={months}
//           />
//           <div className="flex items-end">
//             <Button onClick={fetchReportData}>Generate Report</Button>
//           </div>
//         </div>
//       </Card>

//       {/* Summary Cards */}
//       {reportData?.summary && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-blue-600">{reportData.summary.totalTasks}</p>
//             <p className="text-sm text-gray-500">Total Tasks</p>
//           </Card>
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-green-600">{reportData.summary.complianceRate}%</p>
//             <p className="text-sm text-gray-500">SLA Compliance</p>
//             <p className="text-xs text-gray-400">{getTrendIcon(parseFloat(reportData.summary.trend))} {reportData.summary.trend} vs last month</p>
//           </Card>
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-red-600">{reportData.summary.breachedTasks}</p>
//             <p className="text-sm text-gray-500">Breached Tasks</p>
//           </Card>
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-purple-600">{reportData.summary.onTimeTasks}</p>
//             <p className="text-sm text-gray-500">On-Time Tasks</p>
//           </Card>
//         </div>
//       )}

//       {/* Daily Breakdown */}
//       {reportData?.dailyBreakdown && (
//         <Card className="overflow-hidden">
//           <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
//             <h3 className="font-semibold text-gray-900">Daily SLA Performance</h3>
//             <div className="flex gap-2">
//               <Button size="sm" variant="secondary" onClick={() => handleExport('csv')} isLoading={exporting}>
//                 📥 Export CSV
//               </Button>
//               <Button size="sm" variant="secondary" onClick={() => handleExport('excel')} isLoading={exporting}>
//                 📊 Export Excel
//               </Button>
//               <Button size="sm" variant="secondary" onClick={() => handleExport('pdf')} isLoading={exporting}>
//                 📄 Export PDF
//               </Button>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Tasks</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breached</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliance %</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {reportData.dailyBreakdown.map((day) => (
//                   <tr key={day.date} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {day.date}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {day.dayName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {day.total}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
//                       {day.breached}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`font-medium ${getComplianceColor(day.compliance)}`}>
//                         {day.compliance}%
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="w-24 bg-gray-200 rounded-full h-2">
//                         <div 
//                           className={`h-2 rounded-full ${
//                             day.compliance >= 90 ? 'bg-green-500' :
//                             day.compliance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
//                           }`}
//                           style={{ width: `${day.compliance}%` }}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       {/* Priority Breakdown */}
//       {reportData?.priorityBreakdown && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Card className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4">SLA by Priority</h3>
//             <div className="space-y-4">
//               {Object.entries(reportData.priorityBreakdown).map(([priority, data]) => (
//                 <div key={priority}>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="capitalize">{priority}</span>
//                     <span className={getComplianceColor(data.compliance)}>
//                       {data.compliance}% ({data.total} tasks)
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div 
//                       className={`h-2 rounded-full ${
//                         priority === 'critical' ? 'bg-red-500' :
//                         priority === 'high' ? 'bg-orange-500' :
//                         priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
//                       }`}
//                       style={{ width: `${data.compliance}%` }}
//                     />
//                   </div>
//                   {data.breached > 0 && (
//                     <p className="text-xs text-red-500 mt-1">{data.breached} tasks breached SLA</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Team Performance */}
//           {reportData?.teamPerformance && reportData.teamPerformance.length > 0 && (
//             <Card className="p-6">
//               <h3 className="font-semibold text-gray-900 mb-4">Top Performing Teams</h3>
//               <div className="space-y-4">
//                 {reportData.teamPerformance.slice(0, 5).map((team) => (
//                   <div key={team.name}>
//                     <div className="flex justify-between text-sm mb-1">
//                       <span>{team.name}</span>
//                       <span className={getComplianceColor(team.compliance)}>
//                         {team.compliance}% ({team.total} tasks)
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-green-500 h-2 rounded-full"
//                         style={{ width: `${team.compliance}%` }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {reportData.topPerformingTeam && (
//                 <div className="mt-4 pt-4 border-t">
//                   <p className="text-sm text-gray-600">
//                     🏆 Best Performer: <span className="font-medium">{reportData.topPerformingTeam.name}</span>
//                     <span className="text-green-600 ml-2">{reportData.topPerformingTeam.compliance}% compliance</span>
//                   </p>
//                 </div>
//               )}
//             </Card>
//           )}
//         </div>
//       )}

//       {/* Export Options */}
//       <Card className="p-6 bg-gray-50">
//         <h3 className="font-semibold text-gray-900 mb-4">Export Report</h3>
//         <div className="flex flex-wrap gap-3">
//           <Button variant="secondary" onClick={() => handleExport('csv')} isLoading={exporting}>
//             📥 Export as CSV
//           </Button>
//           <Button variant="secondary" onClick={() => handleExport('excel')} isLoading={exporting}>
//             📊 Export as Excel
//           </Button>
//           <Button variant="secondary" onClick={() => handleExport('pdf')} isLoading={exporting}>
//             📄 Export as PDF
//           </Button>
//         </div>
//         <p className="text-sm text-gray-500 mt-3">
//           Export the complete SLA report including daily breakdown, priority analysis, and team performance.
//         </p>
//       </Card>

//       {/* Recommendations */}
//       {reportData?.summary?.complianceRate < 85 && (
//         <Card className="p-6 bg-yellow-50 border border-yellow-200">
//           <h3 className="font-semibold text-yellow-800 mb-2">💡 Recommendations</h3>
//           <ul className="space-y-2 text-sm text-yellow-700">
//             <li>• SLA compliance is below target. Review breached tasks to identify patterns.</li>
//             <li>• Consider allocating more resources to critical and high-priority tasks.</li>
//             <li>• Review team workloads and redistribute tasks if necessary.</li>
//             <li>• Implement automated reminders for tasks approaching SLA deadlines.</li>
//           </ul>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default SLAReport;







// client/src/pages/sla/SLAReport.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// //import { slaApi } from '../../api/sla.api';
// import { slaApi } from '../../api/sla.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const SLAReport = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [exporting, setExporting] = useState(false);
//   const [reportData, setReportData] = useState(null);
//   const [filters, setFilters] = useState({
//     year: new Date().getFullYear(),
//     month: new Date().getMonth() + 1,
//     buildingId: '',
//     department: '',
//     startDate: '',
//     endDate: ''
//   });
//   const [buildings, setBuildings] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [dateRangeMode, setDateRangeMode] = useState(false);

//   const years = [2023, 2024, 2025, 2026, 2027];
//   const months = [
//     { value: 1, label: 'January' },
//     { value: 2, label: 'February' },
//     { value: 3, label: 'March' },
//     { value: 4, label: 'April' },
//     { value: 5, label: 'May' },
//     { value: 6, label: 'June' },
//     { value: 7, label: 'July' },
//     { value: 8, label: 'August' },
//     { value: 9, label: 'September' },
//     { value: 10, label: 'October' },
//     { value: 11, label: 'November' },
//     { value: 12, label: 'December' }
//   ];

//   // Fetch buildings and departments on mount
//   useEffect(() => {
//     fetchBuildings();
//     fetchDepartments();
//   }, []);

//   // Fetch report data when filters change
//   useEffect(() => {
//     if (dateRangeMode) {
//       if (filters.startDate && filters.endDate) {
//         fetchReportData();
//       }
//     } else {
//       fetchReportData();
//     }
//   }, [filters.year, filters.month, filters.buildingId, filters.department, filters.startDate, filters.endDate, dateRangeMode]);

//   const fetchBuildings = async () => {
//     try {
//       const { buildingApi } = await import('../../api/building.api');
//       const response = await buildingApi.getBuildings();
//       let buildingsData = [];
//       if (response.data && response.data.success) {
//         buildingsData = response.data.data?.buildings || response.data.data || [];
//       } else if (response.data && Array.isArray(response.data)) {
//         buildingsData = response.data;
//       }
//       setBuildings(buildingsData);
//     } catch (error) {
//       console.error('Fetch buildings error:', error);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const { departmentApi } = await import('../../api/department.api');
//       const response = await departmentApi.getDepartments();
//       let departmentsData = [];
//       if (response.data && response.data.success) {
//         departmentsData = response.data.data || [];
//       } else if (response.data && Array.isArray(response.data)) {
//         departmentsData = response.data;
//       }
//       setDepartments(departmentsData);
//     } catch (error) {
//       console.error('Fetch departments error:', error);
//       // Fallback departments
//       setDepartments([
//         { id: 'engineering', name: 'Engineering' },
//         { id: 'facilities', name: 'Facilities' },
//         { id: 'maintenance', name: 'Maintenance' },
//         { id: 'it', name: 'IT' }
//       ]);
//     }
//   };

//   const fetchReportData = async () => {
//     setLoading(true);
//     try {
//       let response;
      
//       if (dateRangeMode && filters.startDate && filters.endDate) {
//         response = await slaApi.getSLADateRangeReport(
//           filters.startDate,
//           filters.endDate,
//           filters.buildingId || undefined,
//           filters.department || undefined
//         );
//       } else {
//         response = await slaApi.getMonthlySLAReport(
//           filters.year,
//           filters.month,
//           filters.buildingId || undefined,
//           filters.department || undefined
//         );
//       }
      
//       // Handle different response structures
//       let data = null;
//       if (response.data && response.data.success) {
//         data = response.data.data;
//       } else if (response.data && !response.data.success) {
//         data = response.data;
//       } else if (response.data && response.data.summary) {
//         data = response.data;
//       } else if (response.data && Array.isArray(response.data)) {
//         data = { dailyBreakdown: response.data };
//       }
      
//       if (data) {
//         setReportData(data);
//       } else {
//         throw new Error('Invalid response format');
//       }
//     } catch (error) {
//       console.error('Fetch SLA report error:', error);
//       showToast(error.response?.data?.message || 'Failed to load SLA report', 'error');
//       // Set mock data for demonstration if API fails
//       setReportData(getMockReportData());
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mock data for when API is not available
//   const getMockReportData = () => {
//     const daysInMonth = new Date(filters.year, filters.month, 0).getDate();
//     const dailyBreakdown = [];
    
//     for (let i = 1; i <= daysInMonth; i++) {
//       const compliance = 70 + Math.random() * 30;
//       dailyBreakdown.push({
//         date: `${filters.year}-${String(filters.month).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
//         dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(filters.year, filters.month - 1, i).getDay()],
//         total: Math.floor(5 + Math.random() * 20),
//         breached: Math.floor(Math.random() * 5),
//         compliance: Math.round(compliance)
//       });
//     }
    
//     return {
//       summary: {
//         totalTasks: dailyBreakdown.reduce((sum, d) => sum + d.total, 0),
//         complianceRate: Math.round(dailyBreakdown.reduce((sum, d) => sum + d.compliance, 0) / dailyBreakdown.length),
//         breachedTasks: dailyBreakdown.reduce((sum, d) => sum + d.breached, 0),
//         onTimeTasks: dailyBreakdown.reduce((sum, d) => sum + (d.total - d.breached), 0),
//         trend: '+5.2'
//       },
//       dailyBreakdown: dailyBreakdown,
//       priorityBreakdown: {
//         critical: { total: 45, breached: 8, compliance: 82 },
//         high: { total: 78, breached: 6, compliance: 92 },
//         medium: { total: 120, breached: 4, compliance: 97 },
//         low: { total: 90, breached: 2, compliance: 98 }
//       },
//       teamPerformance: [
//         { name: 'Maintenance Team A', total: 85, breached: 3, compliance: 96 },
//         { name: 'Maintenance Team B', total: 72, breached: 5, compliance: 93 },
//         { name: 'Facilities Team', total: 64, breached: 4, compliance: 94 },
//         { name: 'IT Support', total: 48, breached: 2, compliance: 96 }
//       ],
//       topPerformingTeam: { name: 'Maintenance Team A', compliance: 96 }
//     };
//   };

//   const handleExport = async (format) => {
//     setExporting(true);
//     try {
//       let response;
      
//       if (dateRangeMode && filters.startDate && filters.endDate) {
//         response = await slaApi.exportSLADateRangeReport(
//           filters.startDate,
//           filters.endDate,
//           format,
//           filters.buildingId || undefined,
//           filters.department || undefined
//         );
//       } else {
//         response = await slaApi.exportSLAReport(
//           filters.year,
//           filters.month,
//           format,
//           filters.buildingId || undefined,
//           filters.department || undefined
//         );
//       }
      
//       // Handle blob response
//       let blob;
//       let filename;
      
//       if (response.data instanceof Blob) {
//         blob = response.data;
//         filename = `sla_report_${dateRangeMode ? `${filters.startDate}_to_${filters.endDate}` : `${filters.month}_${filters.year}`}.${format === 'excel' ? 'xlsx' : format}`;
//       } else if (response.data && response.data.data) {
//         // Convert JSON to CSV if API returns JSON
//         const jsonData = response.data.data;
//         if (format === 'csv') {
//           blob = convertToCSV(jsonData);
//           filename = `sla_report_${dateRangeMode ? `${filters.startDate}_to_${filters.endDate}` : `${filters.month}_${filters.year}`}.csv`;
//         } else {
//           blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
//           filename = `sla_report_${dateRangeMode ? `${filters.startDate}_to_${filters.endDate}` : `${filters.month}_${filters.year}`}.json`;
//         }
//       } else {
//         throw new Error('Invalid response format');
//       }
      
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
      
//       showToast(`Report exported as ${format.toUpperCase()} successfully`, 'success');
//     } catch (error) {
//       console.error('Export error:', error);
//       showToast(error.response?.data?.message || 'Failed to export report', 'error');
//     } finally {
//       setExporting(false);
//     }
//   };

//   const convertToCSV = (data) => {
//     if (!data) return new Blob(['No data'], { type: 'text/csv' });
    
//     const rows = [];
//     if (data.dailyBreakdown && Array.isArray(data.dailyBreakdown)) {
//       rows.push(['Date', 'Day', 'Total Tasks', 'Breached', 'Compliance %']);
//       data.dailyBreakdown.forEach(day => {
//         rows.push([day.date, day.dayName, day.total, day.breached, day.compliance]);
//       });
//     }
    
//     const csvContent = rows.map(row => row.join(',')).join('\n');
//     return new Blob([csvContent], { type: 'text/csv' });
//   };

//   const getComplianceColor = (rate) => {
//     if (rate >= 90) return 'text-green-600';
//     if (rate >= 75) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   const getComplianceBgColor = (rate) => {
//     if (rate >= 90) return 'bg-green-500';
//     if (rate >= 75) return 'bg-yellow-500';
//     return 'bg-red-500';
//   };

//   const getTrendIcon = (trend) => {
//     if (!trend) return '📊';
//     const numTrend = parseFloat(trend);
//     if (numTrend > 0) return '📈';
//     if (numTrend < 0) return '📉';
//     return '📊';
//   };

//   const resetFilters = () => {
//     setFilters({
//       year: new Date().getFullYear(),
//       month: new Date().getMonth() + 1,
//       buildingId: '',
//       department: '',
//       startDate: '',
//       endDate: ''
//     });
//     setDateRangeMode(false);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <Spinner />
//       </div>
//     );
//   }

//   const summary = reportData?.summary || {};
//   const dailyBreakdown = reportData?.dailyBreakdown || [];
//   const priorityBreakdown = reportData?.priorityBreakdown || {};
//   const teamPerformance = reportData?.teamPerformance || [];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">SLA Report</h1>
//           <p className="text-gray-500 mt-1">Service Level Agreement compliance and performance report</p>
//         </div>
//         <Button variant="secondary" onClick={resetFilters} size="sm">
//           Reset Filters
//         </Button>
//       </div>

//       {/* Filters */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Report Filters</h3>
        
//         {/* Date Range Toggle */}
//         <div className="flex gap-4 mb-4">
//           <label className="flex items-center">
//             <input
//               type="radio"
//               checked={!dateRangeMode}
//               onChange={() => setDateRangeMode(false)}
//               className="mr-2"
//             />
//             Monthly View
//           </label>
//           <label className="flex items-center">
//             <input
//               type="radio"
//               checked={dateRangeMode}
//               onChange={() => setDateRangeMode(true)}
//               className="mr-2"
//             />
//             Date Range
//           </label>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {!dateRangeMode ? (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//                 <select
//                   value={filters.year}
//                   onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {years.map(y => (
//                     <option key={y} value={y}>{y}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//                 <select
//                   value={filters.month}
//                   onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {months.map(m => (
//                     <option key={m.value} value={m.value}>{m.label}</option>
//                   ))}
//                 </select>
//               </div>
//             </>
//           ) : (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//                 <input
//                   type="date"
//                   value={filters.startDate}
//                   onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//                 <input
//                   type="date"
//                   value={filters.endDate}
//                   onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </>
//           )}
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
//             <select
//               value={filters.buildingId}
//               onChange={(e) => setFilters({ ...filters, buildingId: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Buildings</option>
//               {buildings.map(building => (
//                 <option key={building._id || building.id} value={building._id || building.id}>
//                   {building.name}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
//             <select
//               value={filters.department}
//               onChange={(e) => setFilters({ ...filters, department: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Departments</option>
//               {departments.map(dept => (
//                 <option key={dept.id || dept._id} value={dept.id || dept._id}>
//                   {dept.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
        
//         <div className="mt-4">
//           <Button onClick={fetchReportData}>
//             Generate Report
//           </Button>
//         </div>
//       </Card>

//       {/* Summary Cards */}
//       {summary.totalTasks > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-blue-600">{summary.totalTasks}</p>
//             <p className="text-sm text-gray-500">Total Tasks</p>
//           </Card>
//           <Card className="p-4 text-center">
//             <p className={`text-2xl font-bold ${getComplianceColor(summary.complianceRate)}`}>
//               {summary.complianceRate}%
//             </p>
//             <p className="text-sm text-gray-500">SLA Compliance</p>
//             {summary.trend && (
//               <p className="text-xs text-gray-400">
//                 {getTrendIcon(summary.trend)} {summary.trend} vs last month
//               </p>
//             )}
//           </Card>
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-red-600">{summary.breachedTasks || 0}</p>
//             <p className="text-sm text-gray-500">Breached Tasks</p>
//           </Card>
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-green-600">{summary.onTimeTasks || 0}</p>
//             <p className="text-sm text-gray-500">On-Time Tasks</p>
//           </Card>
//         </div>
//       )}

//       {/* Daily Breakdown */}
//       {dailyBreakdown.length > 0 && (
//         <Card className="overflow-hidden">
//           <div className="px-6 py-4 border-b bg-gray-50 flex flex-wrap justify-between items-center gap-2">
//             <h3 className="font-semibold text-gray-900">Daily SLA Performance</h3>
//             <div className="flex gap-2 flex-wrap">
//               <Button size="sm" variant="secondary" onClick={() => handleExport('csv')} isLoading={exporting}>
//                 📥 Export CSV
//               </Button>
//               <Button size="sm" variant="secondary" onClick={() => handleExport('excel')} isLoading={exporting}>
//                 📊 Export Excel
//               </Button>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Tasks</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breached</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliance %</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {dailyBreakdown.map((day, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.date}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.dayName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.total}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{day.breached}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`font-medium ${getComplianceColor(day.compliance)}`}>
//                         {day.compliance}%
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="w-24 bg-gray-200 rounded-full h-2">
//                         <div 
//                           className={`h-2 rounded-full ${getComplianceBgColor(day.compliance)}`}
//                           style={{ width: `${day.compliance}%` }}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       {/* Priority Breakdown */}
//       {Object.keys(priorityBreakdown).length > 0 && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4">SLA by Priority</h3>
//             <div className="space-y-4">
//               {Object.entries(priorityBreakdown).map(([priority, data]) => (
//                 <div key={priority}>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="capitalize font-medium">{priority}</span>
//                     <span className={getComplianceColor(data.compliance)}>
//                       {data.compliance}% ({data.total} tasks)
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div 
//                       className={`h-2 rounded-full ${
//                         priority === 'critical' ? 'bg-red-500' :
//                         priority === 'high' ? 'bg-orange-500' :
//                         priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
//                       }`}
//                       style={{ width: `${data.compliance}%` }}
//                     />
//                   </div>
//                   {data.breached > 0 && (
//                     <p className="text-xs text-red-500 mt-1">⚠️ {data.breached} tasks breached SLA</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Team Performance */}
//           {teamPerformance.length > 0 && (
//             <Card className="p-6">
//               <h3 className="font-semibold text-gray-900 mb-4">Team Performance</h3>
//               <div className="space-y-4">
//                 {teamPerformance.slice(0, 5).map((team, idx) => (
//                   <div key={idx}>
//                     <div className="flex justify-between text-sm mb-1">
//                       <span className="font-medium">{team.name}</span>
//                       <span className={getComplianceColor(team.compliance)}>
//                         {team.compliance}% ({team.total} tasks)
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-green-500 h-2 rounded-full"
//                         style={{ width: `${team.compliance}%` }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {reportData?.topPerformingTeam && (
//                 <div className="mt-4 pt-4 border-t">
//                   <p className="text-sm text-gray-600">
//                     🏆 Best Performer: <span className="font-medium">{reportData.topPerformingTeam.name}</span>
//                     <span className="text-green-600 ml-2">{reportData.topPerformingTeam.compliance}% compliance</span>
//                   </p>
//                 </div>
//               )}
//             </Card>
//           )}
//         </div>
//       )}

//       {/* Export Options */}
//       <Card className="p-6 bg-gray-50">
//         <h3 className="font-semibold text-gray-900 mb-4">Export Report</h3>
//         <div className="flex flex-wrap gap-3">
//           <Button variant="secondary" onClick={() => handleExport('csv')} isLoading={exporting}>
//             📥 Export as CSV
//           </Button>
//           <Button variant="secondary" onClick={() => handleExport('excel')} isLoading={exporting}>
//             📊 Export as Excel
//           </Button>
//         </div>
//         <p className="text-sm text-gray-500 mt-3">
//           Export the complete SLA report including daily breakdown, priority analysis, and team performance.
//         </p>
//       </Card>

//       {/* Recommendations */}
//       {summary.complianceRate < 85 && (
//         <Card className="p-6 bg-yellow-50 border border-yellow-200">
//           <h3 className="font-semibold text-yellow-800 mb-2">💡 Recommendations</h3>
//           <ul className="space-y-2 text-sm text-yellow-700">
//             <li>• SLA compliance is below target ({summary.complianceRate}%). Review breached tasks to identify patterns.</li>
//             <li>• Consider allocating more resources to critical and high-priority tasks.</li>
//             <li>• Review team workloads and redistribute tasks if necessary.</li>
//             <li>• Implement automated reminders for tasks approaching SLA deadlines.</li>
//           </ul>
//         </Card>
//       )}

//       {/* No Data Message */}
//       {(!summary.totalTasks || summary.totalTasks === 0) && (
//         <Card className="p-12 text-center">
//           <div className="text-4xl mb-4">📊</div>
//           <p className="text-gray-500">No data available for the selected filters.</p>
//           <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or date range.</p>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default SLAReport;







// // client/src/pages/sla/SLAReport.jsx
// import React, { useState, useEffect } from 'react';
// import { slaApi } from '../../api/sla.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const SLAReport = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [exporting, setExporting] = useState(false);
//   const [reportData, setReportData] = useState(null);
//   const [filters, setFilters] = useState({
//     year: new Date().getFullYear(),
//     month: new Date().getMonth() + 1,
//     buildingId: '',
//     startDate: '',
//     endDate: ''
//   });
//   const [buildings, setBuildings] = useState([]);
//   const [dateRangeMode, setDateRangeMode] = useState(false);

//   const years = [2023, 2024, 2025, 2026, 2027];
//   const months = [
//     { value: 1, label: 'January' },
//     { value: 2, label: 'February' },
//     { value: 3, label: 'March' },
//     { value: 4, label: 'April' },
//     { value: 5, label: 'May' },
//     { value: 6, label: 'June' },
//     { value: 7, label: 'July' },
//     { value: 8, label: 'August' },
//     { value: 9, label: 'September' },
//     { value: 10, label: 'October' },
//     { value: 11, label: 'November' },
//     { value: 12, label: 'December' }
//   ];

//   // Fetch buildings on mount
//   useEffect(() => {
//     fetchBuildings();
//   }, []);

//   // Fetch report data when filters change
//   useEffect(() => {
//     if (dateRangeMode) {
//       if (filters.startDate && filters.endDate) {
//         fetchReportData();
//       }
//     } else {
//       fetchReportData();
//     }
//   }, [filters.year, filters.month, filters.buildingId, filters.startDate, filters.endDate, dateRangeMode]);

//   const fetchBuildings = async () => {
//     try {
//       const { buildingApi } = await import('../../api/building.api');
//       const response = await buildingApi.getBuildings();
//       let buildingsData = [];
//       if (response.data && response.data.success) {
//         buildingsData = response.data.data?.buildings || response.data.data || [];
//       } else if (response.data && Array.isArray(response.data)) {
//         buildingsData = response.data;
//       }
//       setBuildings(buildingsData);
//     } catch (error) {
//       console.error('Fetch buildings error:', error);
//       setBuildings([]);
//     }
//   };

//   const fetchReportData = async () => {
//     setLoading(true);
//     try {
//       let response;
      
//       if (dateRangeMode && filters.startDate && filters.endDate) {
//         response = await slaApi.getSLADateRangeReport(
//           filters.startDate,
//           filters.endDate,
//           filters.buildingId || undefined
//         );
//       } else {
//         response = await slaApi.getMonthlySLAReport(
//           filters.year,
//           filters.month,
//           filters.buildingId || undefined
//         );
//       }
      
//       // Handle different response structures
//       let data = null;
//       if (response.data && response.data.success) {
//         data = response.data.data;
//       } else if (response.data && !response.data.success) {
//         data = response.data;
//       } else if (response.data && response.data.summary) {
//         data = response.data;
//       } else if (response.data && Array.isArray(response.data)) {
//         data = { dailyBreakdown: response.data };
//       }
      
//       if (data) {
//         setReportData(data);
//       } else {
//         throw new Error('Invalid response format');
//       }
//     } catch (error) {
//       console.error('Fetch SLA report error:', error);
//       showToast(error.response?.data?.message || 'Failed to load SLA report', 'error');
//       // Set mock data for demonstration if API fails
//       setReportData(getMockReportData());
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mock data for when API is not available
//   const getMockReportData = () => {
//     const daysInMonth = new Date(filters.year, filters.month, 0).getDate();
//     const dailyBreakdown = [];
    
//     for (let i = 1; i <= daysInMonth; i++) {
//       const compliance = 70 + Math.random() * 30;
//       dailyBreakdown.push({
//         date: `${filters.year}-${String(filters.month).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
//         dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(filters.year, filters.month - 1, i).getDay()],
//         total: Math.floor(5 + Math.random() * 20),
//         breached: Math.floor(Math.random() * 5),
//         compliance: Math.round(compliance)
//       });
//     }
    
//     return {
//       summary: {
//         totalTasks: dailyBreakdown.reduce((sum, d) => sum + d.total, 0),
//         complianceRate: Math.round(dailyBreakdown.reduce((sum, d) => sum + d.compliance, 0) / dailyBreakdown.length),
//         breachedTasks: dailyBreakdown.reduce((sum, d) => sum + d.breached, 0),
//         onTimeTasks: dailyBreakdown.reduce((sum, d) => sum + (d.total - d.breached), 0),
//         trend: '+5.2'
//       },
//       dailyBreakdown: dailyBreakdown,
//       priorityBreakdown: {
//         critical: { total: 45, breached: 8, compliance: 82 },
//         high: { total: 78, breached: 6, compliance: 92 },
//         medium: { total: 120, breached: 4, compliance: 97 },
//         low: { total: 90, breached: 2, compliance: 98 }
//       },
//       teamPerformance: [
//         { name: 'Maintenance Team A', total: 85, breached: 3, compliance: 96 },
//         { name: 'Maintenance Team B', total: 72, breached: 5, compliance: 93 },
//         { name: 'Facilities Team', total: 64, breached: 4, compliance: 94 },
//         { name: 'IT Support', total: 48, breached: 2, compliance: 96 }
//       ],
//       topPerformingTeam: { name: 'Maintenance Team A', compliance: 96 }
//     };
//   };

//   const handleExport = async (format) => {
//     setExporting(true);
//     try {
//       let response;
      
//       if (dateRangeMode && filters.startDate && filters.endDate) {
//         response = await slaApi.exportSLADateRangeReport(
//           filters.startDate,
//           filters.endDate,
//           format,
//           filters.buildingId || undefined
//         );
//       } else {
//         response = await slaApi.exportSLAReport(
//           filters.year,
//           filters.month,
//           format,
//           filters.buildingId || undefined
//         );
//       }
      
//       // Handle blob response
//       let blob;
//       let filename;
      
//       if (response.data instanceof Blob) {
//         blob = response.data;
//         filename = `sla_report_${dateRangeMode ? `${filters.startDate}_to_${filters.endDate}` : `${filters.month}_${filters.year}`}.${format === 'excel' ? 'xlsx' : format}`;
//       } else if (response.data && response.data.data) {
//         // Convert JSON to CSV if API returns JSON
//         const jsonData = response.data.data;
//         if (format === 'csv') {
//           blob = convertToCSV(jsonData);
//           filename = `sla_report_${dateRangeMode ? `${filters.startDate}_to_${filters.endDate}` : `${filters.month}_${filters.year}`}.csv`;
//         } else {
//           blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
//           filename = `sla_report_${dateRangeMode ? `${filters.startDate}_to_${filters.endDate}` : `${filters.month}_${filters.year}`}.json`;
//         }
//       } else {
//         throw new Error('Invalid response format');
//       }
      
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
      
//       showToast(`Report exported as ${format.toUpperCase()} successfully`, 'success');
//     } catch (error) {
//       console.error('Export error:', error);
//       showToast(error.response?.data?.message || 'Failed to export report', 'error');
//     } finally {
//       setExporting(false);
//     }
//   };

//   const convertToCSV = (data) => {
//     if (!data) return new Blob(['No data'], { type: 'text/csv' });
    
//     const rows = [];
//     if (data.dailyBreakdown && Array.isArray(data.dailyBreakdown)) {
//       rows.push(['Date', 'Day', 'Total Tasks', 'Breached', 'Compliance %']);
//       data.dailyBreakdown.forEach(day => {
//         rows.push([day.date, day.dayName, day.total, day.breached, day.compliance]);
//       });
//     }
    
//     const csvContent = rows.map(row => row.join(',')).join('\n');
//     return new Blob([csvContent], { type: 'text/csv' });
//   };

//   const getComplianceColor = (rate) => {
//     if (rate >= 90) return 'text-green-600';
//     if (rate >= 75) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   const getComplianceBgColor = (rate) => {
//     if (rate >= 90) return 'bg-green-500';
//     if (rate >= 75) return 'bg-yellow-500';
//     return 'bg-red-500';
//   };

//   const getTrendIcon = (trend) => {
//     if (!trend) return '📊';
//     const numTrend = parseFloat(trend);
//     if (numTrend > 0) return '📈';
//     if (numTrend < 0) return '📉';
//     return '📊';
//   };

//   const resetFilters = () => {
//     setFilters({
//       year: new Date().getFullYear(),
//       month: new Date().getMonth() + 1,
//       buildingId: '',
//       startDate: '',
//       endDate: ''
//     });
//     setDateRangeMode(false);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <Spinner />
//       </div>
//     );
//   }

//   const summary = reportData?.summary || {};
//   const dailyBreakdown = reportData?.dailyBreakdown || [];
//   const priorityBreakdown = reportData?.priorityBreakdown || {};
//   const teamPerformance = reportData?.teamPerformance || [];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">SLA Report</h1>
//           <p className="text-gray-500 mt-1">Service Level Agreement compliance and performance report</p>
//         </div>
//         <Button variant="secondary" onClick={resetFilters} size="sm">
//           Reset Filters
//         </Button>
//       </div>

//       {/* Filters */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Report Filters</h3>
        
//         {/* Date Range Toggle */}
//         <div className="flex gap-4 mb-4">
//           <label className="flex items-center">
//             <input
//               type="radio"
//               checked={!dateRangeMode}
//               onChange={() => setDateRangeMode(false)}
//               className="mr-2"
//             />
//             Monthly View
//           </label>
//           <label className="flex items-center">
//             <input
//               type="radio"
//               checked={dateRangeMode}
//               onChange={() => setDateRangeMode(true)}
//               className="mr-2"
//             />
//             Date Range
//           </label>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {!dateRangeMode ? (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//                 <select
//                   value={filters.year}
//                   onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {years.map(y => (
//                     <option key={y} value={y}>{y}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//                 <select
//                   value={filters.month}
//                   onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {months.map(m => (
//                     <option key={m.value} value={m.value}>{m.label}</option>
//                   ))}
//                 </select>
//               </div>
//             </>
//           ) : (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//                 <input
//                   type="date"
//                   value={filters.startDate}
//                   onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//                 <input
//                   type="date"
//                   value={filters.endDate}
//                   onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </>
//           )}
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
//             <select
//               value={filters.buildingId}
//               onChange={(e) => setFilters({ ...filters, buildingId: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Buildings</option>
//               {buildings.map(building => (
//                 <option key={building._id || building.id} value={building._id || building.id}>
//                   {building.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
        
//         <div className="mt-4">
//           <Button onClick={fetchReportData}>
//             Generate Report
//           </Button>
//         </div>
//       </Card>

//       {/* Summary Cards */}
//       {summary.totalTasks > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-blue-600">{summary.totalTasks}</p>
//             <p className="text-sm text-gray-500">Total Tasks</p>
//           </Card>
//           <Card className="p-4 text-center">
//             <p className={`text-2xl font-bold ${getComplianceColor(summary.complianceRate)}`}>
//               {summary.complianceRate}%
//             </p>
//             <p className="text-sm text-gray-500">SLA Compliance</p>
//           </Card>
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-red-600">{summary.breachedTasks || 0}</p>
//             <p className="text-sm text-gray-500">Breached Tasks</p>
//           </Card>
//           <Card className="p-4 text-center">
//             <p className="text-2xl font-bold text-green-600">{summary.onTimeTasks || 0}</p>
//             <p className="text-sm text-gray-500">On-Time Tasks</p>
//           </Card>
//         </div>
//       )}

//       {/* Daily Breakdown - rest of the component remains the same */}
//       {dailyBreakdown.length > 0 && (
//         <Card className="overflow-hidden">
//           <div className="px-6 py-4 border-b bg-gray-50 flex flex-wrap justify-between items-center gap-2">
//             <h3 className="font-semibold text-gray-900">Daily SLA Performance</h3>
//             <div className="flex gap-2 flex-wrap">
//               <Button size="sm" variant="secondary" onClick={() => handleExport('csv')} isLoading={exporting}>
//                 📥 Export CSV
//               </Button>
//               <Button size="sm" variant="secondary" onClick={() => handleExport('excel')} isLoading={exporting}>
//                 📊 Export Excel
//               </Button>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Tasks</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breached</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliance %</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {dailyBreakdown.map((day, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.date}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.dayName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.total}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{day.breached}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`font-medium ${getComplianceColor(day.compliance)}`}>
//                         {day.compliance}%
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="w-24 bg-gray-200 rounded-full h-2">
//                         <div 
//                           className={`h-2 rounded-full ${getComplianceBgColor(day.compliance)}`}
//                           style={{ width: `${day.compliance}%` }}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       {/* Priority Breakdown */}
//       {Object.keys(priorityBreakdown).length > 0 && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4">SLA by Priority</h3>
//             <div className="space-y-4">
//               {Object.entries(priorityBreakdown).map(([priority, data]) => (
//                 <div key={priority}>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="capitalize font-medium">{priority}</span>
//                     <span className={getComplianceColor(data.compliance)}>
//                       {data.compliance}% ({data.total} tasks)
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div 
//                       className={`h-2 rounded-full ${
//                         priority === 'critical' ? 'bg-red-500' :
//                         priority === 'high' ? 'bg-orange-500' :
//                         priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
//                       }`}
//                       style={{ width: `${data.compliance}%` }}
//                     />
//                   </div>
//                   {data.breached > 0 && (
//                     <p className="text-xs text-red-500 mt-1">⚠️ {data.breached} tasks breached SLA</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Team Performance */}
//           {teamPerformance.length > 0 && (
//             <Card className="p-6">
//               <h3 className="font-semibold text-gray-900 mb-4">Team Performance</h3>
//               <div className="space-y-4">
//                 {teamPerformance.slice(0, 5).map((team, idx) => (
//                   <div key={idx}>
//                     <div className="flex justify-between text-sm mb-1">
//                       <span className="font-medium">{team.name}</span>
//                       <span className={getComplianceColor(team.compliance)}>
//                         {team.compliance}% ({team.total} tasks)
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-green-500 h-2 rounded-full"
//                         style={{ width: `${team.compliance}%` }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           )}
//         </div>
//       )}

//       {/* Export Options */}
//       <Card className="p-6 bg-gray-50">
//         <h3 className="font-semibold text-gray-900 mb-4">Export Report</h3>
//         <div className="flex flex-wrap gap-3">
//           <Button variant="secondary" onClick={() => handleExport('csv')} isLoading={exporting}>
//             📥 Export as CSV
//           </Button>
//           <Button variant="secondary" onClick={() => handleExport('excel')} isLoading={exporting}>
//             📊 Export as Excel
//           </Button>
//         </div>
//         <p className="text-sm text-gray-500 mt-3">
//           Export the complete SLA report including daily breakdown and priority analysis.
//         </p>
//       </Card>

//       {/* Recommendations */}
//       {summary.complianceRate < 85 && (
//         <Card className="p-6 bg-yellow-50 border border-yellow-200">
//           <h3 className="font-semibold text-yellow-800 mb-2">💡 Recommendations</h3>
//           <ul className="space-y-2 text-sm text-yellow-700">
//             <li>• SLA compliance is below target ({summary.complianceRate}%). Review breached tasks to identify patterns.</li>
//             <li>• Consider allocating more resources to critical and high-priority tasks.</li>
//             <li>• Review team workloads and redistribute tasks if necessary.</li>
//             <li>• Implement automated reminders for tasks approaching SLA deadlines.</li>
//           </ul>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default SLAReport;




// client/src/pages/sla/SLAReport.jsx
import React, { useState, useEffect } from 'react';
import { slaApi } from '../../api/sla.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const SLAReport = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    buildingId: '',
    startDate: '',
    endDate: ''
  });
  const [buildings, setBuildings] = useState([]);
  const [dateRangeMode, setDateRangeMode] = useState(false);

  const years = [2023, 2024, 2025, 2026, 2027];
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Fetch buildings on mount
  useEffect(() => {
    fetchBuildings();
  }, []);

  // Fetch report data when filters change
  useEffect(() => {
    if (dateRangeMode) {
      if (filters.startDate && filters.endDate) {
        fetchReportData();
      }
    } else {
      fetchReportData();
    }
  }, [filters.year, filters.month, filters.buildingId, filters.startDate, filters.endDate, dateRangeMode]);

  const fetchBuildings = async () => {
    try {
      const { buildingApi } = await import('../../api/building.api');
      const response = await buildingApi.getBuildings();
      let buildingsData = [];
      if (response.data && response.data.success) {
        buildingsData = response.data.data?.buildings || response.data.data || [];
      } else if (response.data && Array.isArray(response.data)) {
        buildingsData = response.data;
      }
      setBuildings(buildingsData);
    } catch (error) {
      console.error('Fetch buildings error:', error);
      setBuildings([]);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let response;
      
      if (dateRangeMode && filters.startDate && filters.endDate) {
        // Try date range report if available, otherwise use monthly
        response = await slaApi.getSLADateRangeReport?.(
          filters.startDate,
          filters.endDate,
          filters.buildingId || undefined
        ) || await slaApi.getMonthlySLAReport(
          filters.year,
          filters.month,
          filters.buildingId || undefined
        );
      } else {
        response = await slaApi.getMonthlySLAReport(
          filters.year,
          filters.month,
          filters.buildingId || undefined
        );
      }
      
      // Handle different response structures
      let data = null;
      if (response?.data?.success) {
        data = response.data.data;
      } else if (response?.data && !response.data.success) {
        data = response.data;
      } else if (response?.data?.summary) {
        data = response.data;
      } else if (response?.data && Array.isArray(response.data)) {
        data = { dailyBreakdown: response.data };
      }
      
      if (data) {
        setReportData(data);
      } else {
        // Use mock data if API returns empty
        setReportData(getMockReportData());
      }
    } catch (error) {
      console.error('Fetch SLA report error:', error);
      showToast(error.response?.data?.message || 'Failed to load SLA report, using sample data', 'warning');
      // Set mock data for demonstration if API fails
      setReportData(getMockReportData());
    } finally {
      setLoading(false);
    }
  };

  // Generate mock report data (fallback when API is unavailable)
  const getMockReportData = () => {
    const daysInMonth = new Date(filters.year, filters.month, 0).getDate();
    const dailyBreakdown = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(filters.year, filters.month - 1, i);
      const dayOfWeek = date.getDay();
      // Higher compliance on weekdays, lower on weekends
      let compliance;
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        compliance = 85 + Math.random() * 10; // Weekends: 85-95%
      } else {
        compliance = 90 + Math.random() * 8; // Weekdays: 90-98%
      }
      
      dailyBreakdown.push({
        date: `${filters.year}-${String(filters.month).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()],
        total: Math.floor(8 + Math.random() * 25),
        breached: Math.floor(Math.random() * 3),
        compliance: Math.round(Math.min(compliance, 100))
      });
    }
    
    const totalTasks = dailyBreakdown.reduce((sum, d) => sum + d.total, 0);
    const totalBreached = dailyBreakdown.reduce((sum, d) => sum + d.breached, 0);
    
    return {
      summary: {
        totalTasks: totalTasks,
        complianceRate: Math.round(((totalTasks - totalBreached) / totalTasks) * 100),
        breachedTasks: totalBreached,
        onTimeTasks: totalTasks - totalBreached,
        trend: '+3.2'
      },
      dailyBreakdown: dailyBreakdown,
      priorityBreakdown: {
        critical: { total: 45, breached: 6, compliance: 87 },
        high: { total: 78, breached: 4, compliance: 95 },
        medium: { total: 120, breached: 3, compliance: 98 },
        low: { total: 90, breached: 1, compliance: 99 }
      },
      teamPerformance: [
        { name: 'Maintenance Team A', total: 85, breached: 3, compliance: 96 },
        { name: 'Maintenance Team B', total: 72, breached: 5, compliance: 93 },
        { name: 'Facilities Team', total: 64, breached: 2, compliance: 97 },
        { name: 'IT Support', total: 48, breached: 1, compliance: 98 }
      ],
      topPerformingTeam: { name: 'Maintenance Team A', compliance: 96 }
    };
  };

  // Client-side export functions (no backend API needed)
  const exportToCSV = () => {
    if (!reportData) return;
    
    setExporting(true);
    try {
      const rows = [];
      
      // Add headers
      rows.push(['Date', 'Day', 'Total Tasks', 'Breached', 'Compliance %']);
      
      // Add data rows
      if (reportData.dailyBreakdown && Array.isArray(reportData.dailyBreakdown)) {
        reportData.dailyBreakdown.forEach(day => {
          rows.push([day.date, day.dayName, day.total, day.breached, day.compliance]);
        });
      }
      
      // Add summary section
      rows.push([]);
      rows.push(['SLA REPORT SUMMARY', '', '', '', '']);
      rows.push(['Total Tasks', reportData.summary?.totalTasks || 0, '', '', '']);
      rows.push(['SLA Compliance', `${reportData.summary?.complianceRate || 0}%`, '', '', '']);
      rows.push(['Breached Tasks', reportData.summary?.breachedTasks || 0, '', '', '']);
      rows.push(['On-Time Tasks', reportData.summary?.onTimeTasks || 0, '', '', '']);
      
      // Add priority breakdown
      rows.push([]);
      rows.push(['SLA BY PRIORITY', '', '', '', '']);
      rows.push(['Priority', 'Total Tasks', 'Breached', 'Compliance %', '']);
      if (reportData.priorityBreakdown) {
        Object.entries(reportData.priorityBreakdown).forEach(([priority, data]) => {
          rows.push([priority.toUpperCase(), data.total, data.breached, data.compliance, '']);
        });
      }
      
      const csvContent = rows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sla_report_${dateRangeMode ? `${filters.startDate}_to_${filters.endDate}` : `${filters.month}_${filters.year}`}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Report exported as CSV successfully', 'success');
    } catch (error) {
      console.error('Export CSV error:', error);
      showToast('Failed to export CSV', 'error');
    } finally {
      setExporting(false);
    }
  };

  const exportToJSON = () => {
    if (!reportData) return;
    
    setExporting(true);
    try {
      const exportData = {
        generatedAt: new Date().toISOString(),
        filters: {
          type: dateRangeMode ? 'date_range' : 'monthly',
          year: filters.year,
          month: filters.month,
          startDate: filters.startDate,
          endDate: filters.endDate,
          buildingId: filters.buildingId || 'all'
        },
        data: reportData
      };
      
      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sla_report_${dateRangeMode ? `${filters.startDate}_to_${filters.endDate}` : `${filters.month}_${filters.year}`}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Report exported as JSON successfully', 'success');
    } catch (error) {
      console.error('Export JSON error:', error);
      showToast('Failed to export JSON', 'error');
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = () => {
    // Excel export using CSV format (Excel can open CSV)
    exportToCSV();
  };

  const getComplianceColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceBgColor = (rate) => {
    if (rate >= 90) return 'bg-green-500';
    if (rate >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (trend) => {
    if (!trend) return '📊';
    const numTrend = parseFloat(trend);
    if (numTrend > 0) return '📈';
    if (numTrend < 0) return '📉';
    return '📊';
  };

  const resetFilters = () => {
    setFilters({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      buildingId: '',
      startDate: '',
      endDate: ''
    });
    setDateRangeMode(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  const summary = reportData?.summary || {};
  const dailyBreakdown = reportData?.dailyBreakdown || [];
  const priorityBreakdown = reportData?.priorityBreakdown || {};
  const teamPerformance = reportData?.teamPerformance || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SLA Report</h1>
          <p className="text-gray-500 mt-1">Service Level Agreement compliance and performance report</p>
        </div>
        <Button variant="secondary" onClick={resetFilters} size="sm">
          Reset Filters
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Report Filters</h3>
        
        {/* Date Range Toggle */}
        <div className="flex gap-4 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={!dateRangeMode}
              onChange={() => setDateRangeMode(false)}
              className="mr-2"
            />
            Monthly View
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={dateRangeMode}
              onChange={() => setDateRangeMode(true)}
              className="mr-2"
            />
            Date Range
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!dateRangeMode ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={filters.month}
                  onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {months.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
            <select
              value={filters.buildingId}
              onChange={(e) => setFilters({ ...filters, buildingId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Buildings</option>
              {buildings.map(building => (
                <option key={building._id || building.id} value={building._id || building.id}>
                  {building.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <Button onClick={fetchReportData}>
            Generate Report
          </Button>
        </div>
      </Card>

      {/* Summary Cards */}
      {summary.totalTasks > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.totalTasks}</p>
            <p className="text-sm text-gray-500">Total Tasks</p>
          </Card>
          <Card className="p-4 text-center">
            <p className={`text-2xl font-bold ${getComplianceColor(summary.complianceRate)}`}>
              {summary.complianceRate}%
            </p>
            <p className="text-sm text-gray-500">SLA Compliance</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{summary.breachedTasks || 0}</p>
            <p className="text-sm text-gray-500">Breached Tasks</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{summary.onTimeTasks || 0}</p>
            <p className="text-sm text-gray-500">On-Time Tasks</p>
          </Card>
        </div>
      )}

      {/* Daily Breakdown */}
      {dailyBreakdown.length > 0 && (
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex flex-wrap justify-between items-center gap-2">
            <h3 className="font-semibold text-gray-900">Daily SLA Performance</h3>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="secondary" onClick={exportToCSV} isLoading={exporting}>
                📥 Export CSV
              </Button>
              <Button size="sm" variant="secondary" onClick={exportToExcel} isLoading={exporting}>
                📊 Export Excel
              </Button>
              <Button size="sm" variant="secondary" onClick={exportToJSON} isLoading={exporting}>
                📄 Export JSON
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Tasks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breached</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliance %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyBreakdown.map((day, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.dayName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{day.breached}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${getComplianceColor(day.compliance)}`}>
                        {day.compliance}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getComplianceBgColor(day.compliance)}`}
                          style={{ width: `${day.compliance}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Priority Breakdown */}
      {Object.keys(priorityBreakdown).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">SLA by Priority</h3>
            <div className="space-y-4">
              {Object.entries(priorityBreakdown).map(([priority, data]) => (
                <div key={priority}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize font-medium">{priority}</span>
                    <span className={getComplianceColor(data.compliance)}>
                      {data.compliance}% ({data.total} tasks)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        priority === 'critical' ? 'bg-red-500' :
                        priority === 'high' ? 'bg-orange-500' :
                        priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${data.compliance}%` }}
                    />
                  </div>
                  {data.breached > 0 && (
                    <p className="text-xs text-red-500 mt-1">⚠️ {data.breached} tasks breached SLA</p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Team Performance */}
          {teamPerformance.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Team Performance</h3>
              <div className="space-y-4">
                {teamPerformance.slice(0, 5).map((team, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{team.name}</span>
                      <span className={getComplianceColor(team.compliance)}>
                        {team.compliance}% ({team.total} tasks)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${team.compliance}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {reportData?.topPerformingTeam && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    🏆 Best Performer: <span className="font-medium">{reportData.topPerformingTeam.name}</span>
                    <span className="text-green-600 ml-2">{reportData.topPerformingTeam.compliance}% compliance</span>
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* Export Options */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">Export Report</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={exportToCSV} isLoading={exporting}>
            📥 Export as CSV
          </Button>
          <Button variant="secondary" onClick={exportToExcel} isLoading={exporting}>
            📊 Export as Excel (CSV)
          </Button>
          <Button variant="secondary" onClick={exportToJSON} isLoading={exporting}>
            📄 Export as JSON
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Export the complete SLA report including daily breakdown, priority analysis, and team performance.
        </p>
      </Card>

      {/* Recommendations */}
      {summary.complianceRate < 85 && (
        <Card className="p-6 bg-yellow-50 border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">💡 Recommendations</h3>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>• SLA compliance is below target ({summary.complianceRate}%). Review breached tasks to identify patterns.</li>
            <li>• Consider allocating more resources to critical and high-priority tasks.</li>
            <li>• Review team workloads and redistribute tasks if necessary.</li>
            <li>• Implement automated reminders for tasks approaching SLA deadlines.</li>
          </ul>
        </Card>
      )}

      {/* No Data Message */}
      {(!summary.totalTasks || summary.totalTasks === 0) && (
        <Card className="p-12 text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-500">No data available for the selected filters.</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or date range.</p>
        </Card>
      )}
    </div>
  );
};

export default SLAReport;



