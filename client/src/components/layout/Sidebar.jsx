// // // // client/src/components/layout/Sidebar.jsx



// client/src/components/layout/Sidebar.jsx
// import React, { useState, useMemo, useEffect } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { chatApi } from '../../api/chat.api';

// const Sidebar = ({ isOpen, onClose }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [expandedMenus, setExpandedMenus] = useState({});
//   const [unreadChatCount, setUnreadChatCount] = useState(0);
//   const [chatEnabled, setChatEnabled] = useState(false);

//   // Fetch chat settings and unread count
//   useEffect(() => {
//     const fetchChatData = async () => {
//       try {
//         const settingsRes = await chatApi.getUserChatSettings();
//         if (settingsRes.data.success) {
//           setChatEnabled(settingsRes.data.data.chatEnabled);
//         }
        
//         // Get unread messages count
//         const chatsRes = await chatApi.getUserChats();
//         if (chatsRes.data.success) {
//           const totalUnread = chatsRes.data.data.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
//           setUnreadChatCount(totalUnread);
//         }
//       } catch (error) {
//         console.error('Failed to fetch chat data:', error);
//       }
//     };
    
//     if (user?.chatEnabled) {
//       fetchChatData();
//     }
//   }, [user]);

//   // Define menu items based on user role
//   const menuItems = useMemo(() => {
//     const userRole = user?.role;
    
//     // Common items for all roles
//     const dashboardItem = {
//       id: 'dashboard',
//       label: 'Dashboard',
//       icon: '📊',
//       path: `/dashboard${userRole === 'super_admin' ? '/super-admin' : 
//                       userRole === 'admin' ? '/admin' : 
//                       userRole === 'manager' ? '/manager' :
//                       userRole === 'supervisor' ? '/supervisor' :
//                       userRole === 'technician' ? '/technician' :
//                       userRole === 'customer' ? '/customer' : ''}`
//     };
    
//     // ==================== 🤖 AI FEATURES MENU ====================
//     const aiFeaturesMenu = {
//       id: 'ai-features',
//       label: '🤖 AI Features',
//       icon: '🧠',
//       subItems: [
//         { path: '/ai/smart-assign', label: 'Smart Task Assignment', icon: '🎯', badge: 'AI' },
//         { path: '/ai/sla-predictor', label: 'SLA Predictor', icon: '📈', badge: 'AI' },
//         { path: '/ai/smart-scheduling', label: 'Smart Scheduling', icon: '📅', badge: 'AI' },
//         { path: '/ai/auto-responder', label: 'Auto Responder', icon: '💬', badge: 'AI' },
//         { path: '/ai/insights', label: 'AI Insights', icon: '💡', badge: 'AI' },
//         { path: '/ai/anomaly-detection', label: 'Anomaly Detection', icon: '⚠️', badge: 'Beta' }
//       ]
//     };
    
//     // ==================== 💬 CHAT MENU ====================
//     const chatMenu = {
//       id: 'chat',
//       label: 'Chat',
//       icon: '💬',
//       badge: unreadChatCount > 0 ? unreadChatCount.toString() : null,
//       subItems: [
//         { path: '/chat', label: 'All Chats', icon: '💬' },
//         { path: '/chat/groups', label: 'Group Chats', icon: '👥' },
//         { path: '/chat/settings', label: 'Chat Settings', icon: '⚙️' }
//       ]
//     };
    
//     // ==================== ATTENDANCE MENU ====================
//     const attendanceMenu = {
//       id: 'attendance',
//       label: 'Attendance',
//       icon: '⏰',
//       subItems: [
//         { path: '/attendance/my', label: 'My Attendance', icon: '👤' },
//         { path: '/attendance/team', label: 'Team Attendance', icon: '👥' },
//         { path: '/attendance/check-in-out', label: 'Check In/Out', icon: '📝' },
//         { path: '/attendance/report', label: 'Attendance Report', icon: '📊' },
//         { path: '/attendance/holidays', label: 'Holidays', icon: '🎉' },
//         { path: '/attendance/correction', label: 'Correction Requests', icon: '✏️' }
//       ]
//     };
    
//     // ==================== LEAVE MENU ====================
//     const leaveMenu = {
//       id: 'leave',
//       label: 'Leave Management',
//       icon: '🏖️',
//       subItems: [
//         { path: '/leave/my', label: 'My Leave', icon: '📋' },
//         { path: '/leave/calendar', label: 'Leave Calendar', icon: '📅' },
//         { path: '/leave/balance', label: 'Leave Balance', icon: '⚖️' },
//         { path: '/leave/apply', label: 'Apply Leave', icon: '➕' },
//         { path: '/leave/pending', label: 'Pending Approvals', icon: '⏳', badge: 'HR' },
//         { path: '/leave/history', label: 'Leave History', icon: '📜' }
//       ]
//     };
    
//     // ==================== PAYROLL MENU ====================
//     const payrollMenu = {
//       id: 'payroll',
//       label: 'Payroll',
//       icon: '💰',
//       subItems: [
//         { path: '/salary/my', label: 'My Salary', icon: '📄' },
//         { path: '/salary/slip/:id', label: 'Salary Slip', icon: '📑' },
//         { path: '/payroll/dashboard', label: 'Payroll Dashboard', icon: '📊', badge: 'HR' },
//         { path: '/payroll/process', label: 'Process Payroll', icon: '⚙️', badge: 'HR' },
//         { path: '/payroll/reports', label: 'Payroll Reports', icon: '📈', badge: 'HR' },
//         { path: '/salary/structure', label: 'Salary Structure', icon: '🏗️', badge: 'HR' },
//         { path: '/payroll/settings', label: 'Payroll Settings', icon: '⚙️', badge: 'Admin' }
//       ]
//     };
    
//     // ==================== REPORTS MENU ====================
//     const reportsMenu = {
//       id: 'reports',
//       label: 'Reports',
//       icon: '📊',
//       subItems: [
//         { path: '/reports', label: 'Reports Dashboard', icon: '📈' },
//         { path: '/reports/tasks', label: 'Task Reports', icon: '📋' },
//         { path: '/reports/attendance', label: 'Attendance Reports', icon: '⏰' },
//         { path: '/reports/financial', label: 'Financial Reports', icon: '💰' },
//         { path: '/reports/builder', label: 'Report Builder', icon: '🔧', badge: 'Admin' },
//         { path: '/reports/analytics', label: 'Analytics', icon: '📉' }
//       ]
//     };
    
//     // ==================== NOTIFICATIONS MENU ====================
//     const notificationsMenu = {
//       id: 'notifications',
//       label: 'Notifications',
//       icon: '🔔',
//       subItems: [
//         { path: '/notifications', label: 'All Notifications', icon: '📢' },
//         { path: '/notifications/preferences', label: 'Preferences', icon: '⚙️' }
//       ]
//     };
    
//     // ==================== SETTINGS MENU ====================
//     const settingsMenu = {
//       id: 'settings',
//       label: 'Settings',
//       icon: '⚙️',
//       subItems: [
//         { path: '/settings/general', label: 'General', icon: '🏠' },
//         { path: '/settings/email', label: 'Email', icon: '📧' },
//         { path: '/settings/notifications', label: 'Notifications', icon: '🔔' },
//         { path: '/settings/integrations', label: 'Integrations', icon: '🔌' },
//         { path: '/settings/theme', label: 'Theme', icon: '🎨' },
//         { path: '/settings/backup', label: 'Backup & Restore', icon: '💾', badge: 'Admin' },
//         { path: '/settings/audit-logs', label: 'Audit Logs', icon: '📜', badge: 'Admin' },
//         { path: '/settings/system', label: 'System', icon: '🖥️', badge: 'Admin' }
//       ]
//     };
    
//     // ==================== SUPER ADMIN ONLY MENUS ====================
//     const superAdminOnlyMenus = [
//       {
//         id: 'system-monitoring',
//         label: 'System Monitoring',
//         icon: '📊',
//         subItems: [
//           { path: '/system/health', label: 'System Health', icon: '💚', badge: 'Admin' },
//           { path: '/system/logs', label: 'Error Logs', icon: '📝', badge: 'Admin' },
//           { path: '/system/database', label: 'Database Status', icon: '🗄️', badge: 'Admin' }
//         ]
//       },
//       {
//         id: 'api-management',
//         label: 'API Management',
//         icon: '🔌',
//         subItems: [
//           { path: '/api-keys', label: 'API Keys', icon: '🔑', badge: 'Admin' },
//           { path: '/webhooks', label: 'Webhooks', icon: '🌐', badge: 'Admin' }
//         ]
//       },
//       {
//         id: 'chat-admin',
//         label: 'Chat Administration',
//         icon: '💬',
//         subItems: [
//           { path: '/admin/chat', label: 'Chat Monitoring', icon: '👁️', badge: 'Admin' },
//           { path: '/admin/chat/logs', label: 'Chat Logs', icon: '📜', badge: 'Admin' },
//           { path: '/admin/chat/settings', label: 'Chat Settings', icon: '⚙️', badge: 'Admin' }
//         ]
//       }
//     ];
    
//     // Role-specific menus
//     const adminMenus = [
//       dashboardItem,
//       aiFeaturesMenu,
//       (user?.chatEnabled || userRole === 'super_admin') && chatMenu,
//       {
//         id: 'users',
//         label: 'User Management',
//         icon: '👥',
//         subItems: [
//           { path: '/users', label: 'All Users', icon: '👤' },
//           { path: '/users/new', label: 'Add User', icon: '➕' },
//           { path: '/employee/onboarding', label: 'Employee Onboarding', icon: '📝' },
//           { path: '/roles', label: 'Roles & Permissions', icon: '🔐' }
//         ]
//       },
//       {
//         id: 'buildings',
//         label: 'Building Management',
//         icon: '🏢',
//         subItems: [
//           { path: '/buildings', label: 'All Buildings', icon: '🏢' },
//           { path: '/buildings/new', label: 'Add Building', icon: '➕' }
//         ]
//       },
//       {
//         id: 'tasks',
//         label: 'Task Management',
//         icon: '📋',
//         subItems: [
//           { path: '/tasks', label: 'All Tasks', icon: '📋' },
//           { path: '/tasks/board', label: 'Task Board', icon: '📌' },
//           { path: '/tasks/calendar', label: 'Calendar', icon: '📅' },
//           { path: '/tasks/new', label: 'Create Task', icon: '➕' }
//         ]
//       },
//       {
//         id: 'complaints',
//         label: 'Complaints',
//         icon: '⚠️',
//         subItems: [
//           { path: '/complaints', label: 'All Complaints', icon: '⚠️' },
//           { path: '/complaints/new', label: 'New Complaint', icon: '➕' }
//         ]
//       },
//       attendanceMenu,
//       leaveMenu,
//       payrollMenu,
//       reportsMenu,
//       notificationsMenu,
//       {
//         id: 'tracking',
//         label: 'Live Tracking',
//         icon: '📍',
//         subItems: [
//           { path: '/tracking/live', label: 'Live Location', icon: '📍' },
//           { path: '/geofences', label: 'Geofences', icon: '🌍' }
//         ]
//       },
//       {
//         id: 'sla',
//         label: 'SLA Monitoring',
//         icon: '⏱️',
//         subItems: [
//           { path: '/sla/dashboard', label: 'SLA Dashboard', icon: '📊' },
//           { path: '/sla/breached', label: 'Breached Tasks', icon: '🚨' },
//           { path: '/sla/at-risk', label: 'At Risk Tasks', icon: '⚠️' },
//           { path: '/sla/history', label: 'SLA History', icon: '📜' },
//           { path: '/sla/report', label: 'SLA Report', icon: '📈' }
//         ]
//       },
//       settingsMenu,
//       { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
//     ].filter(Boolean);
    
//     const managerMenus = [
//       dashboardItem,
//       aiFeaturesMenu,
//       (user?.chatEnabled) && chatMenu,
//       {
//         id: 'buildings',
//         label: 'Building Management',
//         icon: '🏢',
//         subItems: [
//           { path: '/buildings', label: 'All Buildings', icon: '🏢' }
//         ]
//       },
//       {
//         id: 'tasks',
//         label: 'Task Management',
//         icon: '📋',
//         subItems: [
//           { path: '/tasks', label: 'Team Tasks', icon: '📋' },
//           { path: '/tasks/board', label: 'Task Board', icon: '📌' },
//           { path: '/tasks/new', label: 'Create Task', icon: '➕' }
//         ]
//       },
//       attendanceMenu,
//       leaveMenu,
//       reportsMenu,
//       notificationsMenu,
//       {
//         id: 'tracking',
//         label: 'Live Tracking',
//         icon: '📍',
//         path: '/tracking/live'
//       },
//       {
//         id: 'sla',
//         label: 'SLA Monitoring',
//         icon: '⏱️',
//         subItems: [
//           { path: '/sla/dashboard', label: 'SLA Dashboard', icon: '📊' },
//           { path: '/sla/breached', label: 'Breached Tasks', icon: '🚨' }
//         ]
//       },
//       { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
//     ].filter(Boolean);
    
//     const supervisorMenus = [
//       dashboardItem,
//       {
//         id: 'ai-features',
//         label: '🤖 AI Features',
//         icon: '🧠',
//         subItems: [
//           { path: '/ai/smart-assign', label: 'Smart Task Assignment', icon: '🎯', badge: 'AI' },
//           { path: '/ai/anomaly-detection', label: 'Anomaly Detection', icon: '⚠️', badge: 'Beta' }
//         ]
//       },
//       (user?.chatEnabled) && chatMenu,
//       {
//         id: 'tasks',
//         label: 'Task Management',
//         icon: '📋',
//         subItems: [
//           { path: '/tasks', label: 'Team Tasks', icon: '📋' },
//           { path: '/tasks/board', label: 'Task Board', icon: '📌' }
//         ]
//       },
//       attendanceMenu,
//       leaveMenu,
//       {
//         id: 'tracking',
//         label: 'Live Tracking',
//         icon: '📍',
//         path: '/tracking/live'
//       },
//       {
//         id: 'sla',
//         label: 'SLA Monitoring',
//         icon: '⏱️',
//         path: '/sla/breached'
//       },
//       notificationsMenu,
//       { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
//     ].filter(Boolean);
    
//     const technicianMenus = [
//       dashboardItem,
//       {
//         id: 'ai-features',
//         label: '🤖 AI Features',
//         icon: '🧠',
//         subItems: [
//           { path: '/ai/smart-routing', label: 'Smart Route Planning', icon: '🗺️', badge: 'AI' },
//           { path: '/ai/assistant', label: 'AI Assistant', icon: '🤖', badge: 'AI' }
//         ]
//       },
//       (user?.chatEnabled) && chatMenu,
//       {
//         id: 'tasks',
//         label: 'My Tasks',
//         icon: '📋',
//         subItems: [
//           { path: '/tasks', label: 'Assigned Tasks', icon: '📋' },
//           { path: '/tasks/calendar', label: 'Calendar', icon: '📅' }
//         ]
//       },
//       {
//         id: 'attendance',
//         label: 'Attendance',
//         icon: '⏰',
//         subItems: [
//           { path: '/attendance/my', label: 'My Attendance', icon: '👤' },
//           { path: '/attendance/check-in-out', label: 'Check In/Out', icon: '📝' }
//         ]
//       },
//       {
//         id: 'leave',
//         label: 'Leave',
//         icon: '🏖️',
//         subItems: [
//           { path: '/leave/my', label: 'My Leave', icon: '📋' },
//           { path: '/leave/apply', label: 'Apply Leave', icon: '➕' },
//           { path: '/leave/balance', label: 'Leave Balance', icon: '⚖️' }
//         ]
//       },
//       {
//         id: 'salary',
//         label: 'Salary',
//         icon: '💰',
//         subItems: [
//           { path: '/salary/my', label: 'My Salary', icon: '📄' },
//           { path: '/salary/slip/:id', label: 'Salary Slip', icon: '📑' }
//         ]
//       },
//       {
//         id: 'tracking',
//         label: 'Live Tracking',
//         icon: '📍',
//         path: '/tracking/live'
//       },
//       notificationsMenu,
//       { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
//     ].filter(Boolean);
    
//     const customerMenus = [
//       dashboardItem,
//       {
//         id: 'ai-features',
//         label: '🤖 AI Assistant',
//         icon: '🧠',
//         subItems: [
//           { path: '/ai/chatbot', label: 'AI Chatbot', icon: '💬', badge: 'AI' },
//           { path: '/ai/ticket-predictor', label: 'Ticket Predictor', icon: '🔮', badge: 'AI' }
//         ]
//       },
//       (user?.chatEnabled) && chatMenu,
//       {
//         id: 'properties',
//         label: 'My Properties',
//         icon: '🏠',
//         subItems: [
//           { path: '/my-properties', label: 'Properties', icon: '🏢' },
//           { path: '/service-requests', label: 'Service Requests', icon: '🔧' }
//         ]
//       },
//       {
//         id: 'complaints',
//         label: 'My Complaints',
//         icon: '⚠️',
//         subItems: [
//           { path: '/complaints', label: 'All Complaints', icon: '⚠️' },
//           { path: '/complaints/new', label: 'Raise Complaint', icon: '➕' }
//         ]
//       },
//       {
//         id: 'payments',
//         label: 'Payments',
//         icon: '💰',
//         subItems: [
//           { path: '/payment-history', label: 'Payment History', icon: '📜' },
//           { path: '/visitor-pass', label: 'Visitor Pass', icon: '🔑' }
//         ]
//       },
//       notificationsMenu,
//       { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
//     ].filter(Boolean);
    
//     const hrMenus = [
//       dashboardItem,
//       {
//         id: 'ai-features',
//         label: '🤖 AI Features',
//         icon: '🧠',
//         subItems: [
//           { path: '/ai/candidate-matching', label: 'Candidate Matching', icon: '🎯', badge: 'AI' },
//           { path: '/ai/attrition-predictor', label: 'Attrition Predictor', icon: '📉', badge: 'AI' }
//         ]
//       },
//       (user?.chatEnabled) && chatMenu,
//       {
//         id: 'employees',
//         label: 'Employee Management',
//         icon: '👥',
//         subItems: [
//           { path: '/users', label: 'All Employees', icon: '👤' },
//           { path: '/employee/onboarding', label: 'Onboarding', icon: '📝' },
//           { path: '/attendance', label: 'Attendance', icon: '⏰' },
//           { path: '/attendance/report', label: 'Attendance Report', icon: '📊' }
//         ]
//       },
//       leaveMenu,
//       payrollMenu,
//       reportsMenu,
//       notificationsMenu,
//       settingsMenu,
//       { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
//     ].filter(Boolean);
    
//     // Role-based menu selection
//     switch (userRole) {
//       case 'super_admin':
//         return [...adminMenus, ...superAdminOnlyMenus];
//       case 'admin':
//         return adminMenus;
//       case 'manager':
//         return managerMenus;
//       case 'supervisor':
//         return supervisorMenus;
//       case 'technician':
//         return technicianMenus;
//       case 'customer':
//         return customerMenus;
//       case 'hr':
//         return hrMenus;
//       default:
//         return [dashboardItem, notificationsMenu, { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }];
//     }
//   }, [user?.role, user?.chatEnabled, unreadChatCount]);

//   const toggleSubMenu = (menuId) => {
//     setExpandedMenus(prev => ({
//       ...prev,
//       [menuId]: !prev[menuId]
//     }));
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // Helper function to render badge
//   const renderBadge = (badge) => {
//     if (!badge) return null;
//     const badgeStyles = {
//       AI: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2',
//       Beta: 'bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2',
//       HR: 'bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2',
//       Admin: 'bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2'
//     };
    
//     // For numeric badges (like unread count)
//     if (!isNaN(badge) && badge > 0) {
//       return (
//         <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2 min-w-[18px] text-center">
//           {badge > 99 ? '99+' : badge}
//         </span>
//       );
//     }
    
//     return (
//       <span className={badgeStyles[badge] || 'bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2'}>
//         {badge}
//       </span>
//     );
//   };

//   return (
//     <>
//       {/* Mobile sidebar backdrop */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden" 
//           onClick={onClose}
//           aria-label="Close sidebar"
//         />
//       )}
      
//       {/* Sidebar */}
//       <div 
//         className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white text-lg font-bold">F</span>
//               </div>
//               <h1 className="text-xl font-bold text-gray-800">FMS Enterprise</h1>
//             </div>
//           </div>
          
//           {/* Navigation - Scrollable */}
//           <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
//             {menuItems.map((item) => (
//               <div key={item.id}>
//                 {item.subItems ? (
//                   // Menu with sub-items (dropdown)
//                   <div>
//                     <button
//                       onClick={() => toggleSubMenu(item.id)}
//                       className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 ${
//                         expandedMenus[item.id] ? 'bg-gray-100' : ''
//                       }`}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <span className="text-gray-500 text-lg">{item.icon}</span>
//                         <span className="text-gray-700">{item.label}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {item.badge && renderBadge(item.badge)}
//                         <svg
//                           className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
//                             expandedMenus[item.id] ? 'rotate-180' : ''
//                           }`}
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </div>
//                     </button>
                    
//                     {expandedMenus[item.id] && (
//                       <div className="mt-1 ml-6 space-y-1">
//                         {item.subItems.map((subItem) => (
//                           <NavLink
//                             key={subItem.path}
//                             to={subItem.path}
//                             onClick={() => onClose?.()}
//                             className={({ isActive }) =>
//                               `flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
//                                 isActive
//                                   ? 'bg-blue-50 text-blue-700 font-medium'
//                                   : 'text-gray-600 hover:bg-gray-100'
//                               }`
//                             }
//                           >
//                             <div className="flex items-center">
//                               <span className="mr-2 text-base">{subItem.icon}</span>
//                               <span>{subItem.label}</span>
//                             </div>
//                             {renderBadge(subItem.badge)}
//                           </NavLink>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   // Direct link (no sub-items)
//                   <NavLink
//                     to={item.path}
//                     onClick={() => onClose?.()}
//                     className={({ isActive }) =>
//                       `flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                         isActive
//                           ? 'bg-blue-50 text-blue-700'
//                           : 'text-gray-700 hover:bg-gray-100'
//                       }`
//                     }
//                   >
//                     <div className="flex items-center">
//                       <span className="mr-3 text-gray-500 text-lg">{item.icon}</span>
//                       <span>{item.label}</span>
//                     </div>
//                     {renderBadge(item.badge)}
//                   </NavLink>
//                 )}
//               </div>
//             ))}
//           </nav>
          
//           {/* AI Status Indicator */}
//           <div className="px-4 py-2 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-xs text-gray-600">AI Assistant Active</span>
//               </div>
//               <span className="text-xs text-purple-600">v2.0</span>
//             </div>
//           </div>
          
//           {/* User Info & Logout */}
//           <div className="p-4 border-t border-gray-200 bg-gray-50">
//             <div className="flex items-center space-x-3 mb-3">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
//                 <span className="text-white font-medium text-sm">
//                   {user?.firstName?.[0]}{user?.lastName?.[0]}
//                 </span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-900 truncate">
//                   {user?.firstName} {user?.lastName}
//                 </p>
//                 <p className="text-xs text-gray-500 capitalize truncate">
//                   {user?.role?.replace(/_/g, ' ')}
//                 </p>
//                 {user?.chatEnabled && (
//                   <p className="text-xs text-green-600">Chat Enabled</p>
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//             >
//               <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//               </svg>
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;



// // client/src/components/layout/Sidebar.jsx
// import React, { useState, useMemo, useEffect } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { chatApi } from '../../api/chat.api';
// import { userApi } from '../../api/user.api';

// const Sidebar = ({ isOpen, onClose }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [expandedMenus, setExpandedMenus] = useState({});
//   const [unreadChatCount, setUnreadChatCount] = useState(0);
//   const [chatEnabled, setChatEnabled] = useState(false);
//   const [onlineUsersCount, setOnlineUsersCount] = useState(0);
//   const [isLoadingChat, setIsLoadingChat] = useState(false);

//   // Fetch chat settings and unread count
//   useEffect(() => {
//     const fetchChatData = async () => {
//       // Only fetch if chat is enabled for user or user is super_admin
//       if (!user?.chatEnabled && user?.role !== 'super_admin') {
//         return;
//       }
      
//       setIsLoadingChat(true);
//       try {
//         // Get unread messages count
//         const chatsRes = await chatApi.getUserChats();
//         if (chatsRes.data?.success) {
//           const totalUnread = chatsRes.data.data?.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0) || 0;
//           setUnreadChatCount(totalUnread);
//         }
        
//         // Get chat settings
//         try {
//           const settingsRes = await chatApi.getUserChatSettings();
//           if (settingsRes.data?.success) {
//             setChatEnabled(settingsRes.data.data?.chatEnabled || false);
//           }
//         } catch (settingsError) {
//           console.warn('Chat settings not available:', settingsError.message);
//           // If settings API fails, use user's chatEnabled property
//           setChatEnabled(user?.chatEnabled || false);
//         }
        
//         // Get online users count (for admin)
//         if (user?.role === 'super_admin' || user?.role === 'admin') {
//           try {
//             const onlineUsersRes = await userApi.getOnlineUsersCount();
//             if (onlineUsersRes.data?.success) {
//               setOnlineUsersCount(onlineUsersRes.data.data?.count || 0);
//             }
//           } catch (onlineError) {
//             console.warn('Online users API not available:', onlineError.message);
//           }
//         }
//       } catch (error) {
//         console.error('Failed to fetch chat data:', error);
//         // Don't show error toast for sidebar background fetch
//       } finally {
//         setIsLoadingChat(false);
//       }
//     };
    
//     fetchChatData();
    
//     // Set up interval to refresh unread count every 30 seconds
//     const interval = setInterval(() => {
//       if (user?.chatEnabled || user?.role === 'super_admin') {
//         fetchChatData();
//       }
//     }, 30000);
    
//     return () => clearInterval(interval);
//   }, [user]);

//   // Define menu items based on user role
//   const menuItems = useMemo(() => {
//     const userRole = user?.role;
    
//     // Common items for all roles
//     const dashboardItem = {
//       id: 'dashboard',
//       label: 'Dashboard',
//       icon: '📊',
//       path: `/dashboard${userRole === 'super_admin' ? '/super-admin' : 
//                       userRole === 'admin' ? '/admin' : 
//                       userRole === 'manager' ? '/manager' :
//                       userRole === 'supervisor' ? '/supervisor' :
//                       userRole === 'technician' ? '/technician' :
//                       userRole === 'customer' ? '/customer' : ''}`
//     };
    
//     // ==================== 🤖 AI FEATURES MENU ====================
//     const aiFeaturesMenu = {
//       id: 'ai-features',
//       label: '🤖 AI Features',
//       icon: '🧠',
//       subItems: [
//         { path: '/ai/smart-assign', label: 'Smart Task Assignment', icon: '🎯', badge: 'AI' },
//         { path: '/ai/sla-predictor', label: 'SLA Predictor', icon: '📈', badge: 'AI' },
//         { path: '/ai/smart-scheduling', label: 'Smart Scheduling', icon: '📅', badge: 'AI' },
//         { path: '/ai/auto-responder', label: 'Auto Responder', icon: '💬', badge: 'AI' },
//         { path: '/ai/insights', label: 'AI Insights', icon: '💡', badge: 'AI' },
//         { path: '/ai/anomaly-detection', label: 'Anomaly Detection', icon: '⚠️', badge: 'Beta' }
//       ]
//     };
    
//     // ==================== 💬 CHAT MENU ====================
//     const chatMenu = {
//       id: 'chat',
//       label: 'Chat',
//       icon: '💬',
//       badge: unreadChatCount > 0 ? unreadChatCount.toString() : null,
//       subItems: [
//         { path: '/chat', label: 'All Chats', icon: '💬' },
//         { path: '/chat/groups', label: 'Group Chats', icon: '👥' },
//         { path: '/chat/settings', label: 'Chat Settings', icon: '⚙️' }
//       ]
//     };
    
//     // ==================== ATTENDANCE MENU ====================
//     const attendanceMenu = {
//       id: 'attendance',
//       label: 'Attendance',
//       icon: '⏰',
//       subItems: [
//         { path: '/attendance/my', label: 'My Attendance', icon: '👤' },
//         { path: '/attendance/team', label: 'Team Attendance', icon: '👥' },
//         { path: '/attendance/check-in-out', label: 'Check In/Out', icon: '📝' },
//         { path: '/attendance/report', label: 'Attendance Report', icon: '📊' },
//         { path: '/attendance/holidays', label: 'Holidays', icon: '🎉' },
//         { path: '/attendance/correction', label: 'Correction Requests', icon: '✏️' }
//       ]
//     };
    
//     // ==================== LEAVE MENU ====================
//     const leaveMenu = {
//       id: 'leave',
//       label: 'Leave Management',
//       icon: '🏖️',
//       subItems: [
//         { path: '/leave/my', label: 'My Leave', icon: '📋' },
//         { path: '/leave/calendar', label: 'Leave Calendar', icon: '📅' },
//         { path: '/leave/balance', label: 'Leave Balance', icon: '⚖️' },
//         { path: '/leave/apply', label: 'Apply Leave', icon: '➕' },
//         { path: '/leave/pending', label: 'Pending Approvals', icon: '⏳', badge: 'HR' },
//         { path: '/leave/history', label: 'Leave History', icon: '📜' }
//       ]
//     };
    
//     // ==================== PAYROLL MENU ====================
//     const payrollMenu = {
//       id: 'payroll',
//       label: 'Payroll',
//       icon: '💰',
//       subItems: [
//         { path: '/salary/my', label: 'My Salary', icon: '📄' },
//         { path: '/salary/slip/:id', label: 'Salary Slip', icon: '📑' },
//         { path: '/payroll/dashboard', label: 'Payroll Dashboard', icon: '📊', badge: 'HR' },
//         { path: '/payroll/process', label: 'Process Payroll', icon: '⚙️', badge: 'HR' },
//         { path: '/payroll/reports', label: 'Payroll Reports', icon: '📈', badge: 'HR' },
//         { path: '/salary/structure', label: 'Salary Structure', icon: '🏗️', badge: 'HR' },
//         { path: '/payroll/settings', label: 'Payroll Settings', icon: '⚙️', badge: 'Admin' }
//       ]
//     };
    
//     // ==================== REPORTS MENU ====================
//     const reportsMenu = {
//       id: 'reports',
//       label: 'Reports',
//       icon: '📊',
//       subItems: [
//         { path: '/reports', label: 'Reports Dashboard', icon: '📈' },
//         { path: '/reports/tasks', label: 'Task Reports', icon: '📋' },
//         { path: '/reports/attendance', label: 'Attendance Reports', icon: '⏰' },
//         { path: '/reports/financial', label: 'Financial Reports', icon: '💰' },
//         { path: '/reports/builder', label: 'Report Builder', icon: '🔧', badge: 'Admin' },
//         { path: '/reports/analytics', label: 'Analytics', icon: '📉' }
//       ]
//     };
    
//     // ==================== NOTIFICATIONS MENU ====================
//     const notificationsMenu = {
//       id: 'notifications',
//       label: 'Notifications',
//       icon: '🔔',
//       subItems: [
//         { path: '/notifications', label: 'All Notifications', icon: '📢' },
//         { path: '/notifications/preferences', label: 'Preferences', icon: '⚙️' }
//       ]
//     };
    
//     // ==================== SETTINGS MENU ====================
//     const settingsMenu = {
//       id: 'settings',
//       label: 'Settings',
//       icon: '⚙️',
//       subItems: [
//         { path: '/settings/general', label: 'General', icon: '🏠' },
//         { path: '/settings/email', label: 'Email', icon: '📧' },
//         { path: '/settings/notifications', label: 'Notifications', icon: '🔔' },
//         { path: '/settings/integrations', label: 'Integrations', icon: '🔌' },
//         { path: '/settings/theme', label: 'Theme', icon: '🎨' },
//         { path: '/settings/backup', label: 'Backup & Restore', icon: '💾', badge: 'Admin' },
//         { path: '/settings/audit-logs', label: 'Audit Logs', icon: '📜', badge: 'Admin' },
//         { path: '/settings/system', label: 'System', icon: '🖥️', badge: 'Admin' }
//       ]
//     };
    
//     // ==================== SUPER ADMIN ONLY MENUS ====================
//     const superAdminOnlyMenus = [
//       {
//         id: 'system-monitoring',
//         label: 'System Monitoring',
//         icon: '📊',
//         subItems: [
//           { path: '/system/health', label: 'System Health', icon: '💚', badge: 'Admin' },
//           { path: '/system/logs', label: 'Error Logs', icon: '📝', badge: 'Admin' },
//           { path: '/system/database', label: 'Database Status', icon: '🗄️', badge: 'Admin' }
//         ]
//       },
//       {
//         id: 'api-management',
//         label: 'API Management',
//         icon: '🔌',
//         subItems: [
//           { path: '/api-keys', label: 'API Keys', icon: '🔑', badge: 'Admin' },
//           { path: '/webhooks', label: 'Webhooks', icon: '🌐', badge: 'Admin' }
//         ]
//       },
//       {
//         id: 'chat-admin',
//         label: 'Chat Administration',
//         icon: '💬',
//         subItems: [
//           { path: '/admin/chat', label: 'Chat Monitoring', icon: '👁️', badge: 'Admin' },
//           { path: '/admin/chat/logs', label: 'Chat Logs', icon: '📜', badge: 'Admin' },
//           { path: '/admin/chat/settings', label: 'Chat Settings', icon: '⚙️', badge: 'Admin' }
//         ]
//       }
//     ];
    
//     // Check if chat should be shown (chat enabled OR super_admin OR admin)
//     const showChat = (user?.chatEnabled || userRole === 'super_admin' || userRole === 'admin') && !isLoadingChat;
    
//     // Role-specific menus
//     const adminMenus = [
//       dashboardItem,
//       aiFeaturesMenu,
//       showChat && chatMenu,
//       {
//         id: 'users',
//         label: 'User Management',
//         icon: '👥',
//         subItems: [
//           { path: '/users', label: 'All Users', icon: '👤' },
//           { path: '/users/new', label: 'Add User', icon: '➕' },
//           { path: '/employee/onboarding', label: 'Employee Onboarding', icon: '📝' },
//           { path: '/roles', label: 'Roles & Permissions', icon: '🔐' }
//         ]
//       },
//       {
//         id: 'buildings',
//         label: 'Building Management',
//         icon: '🏢',
//         subItems: [
//           { path: '/buildings', label: 'All Buildings', icon: '🏢' },
//           { path: '/buildings/new', label: 'Add Building', icon: '➕' }
//         ]
//       },
//       {
//         id: 'tasks',
//         label: 'Task Management',
//         icon: '📋',
//         subItems: [
//           { path: '/tasks', label: 'All Tasks', icon: '📋' },
//           { path: '/tasks/board', label: 'Task Board', icon: '📌' },
//           { path: '/tasks/calendar', label: 'Calendar', icon: '📅' },
//           { path: '/tasks/new', label: 'Create Task', icon: '➕' }
//         ]
//       },
//       {
//         id: 'complaints',
//         label: 'Complaints',
//         icon: '⚠️',
//         subItems: [
//           { path: '/complaints', label: 'All Complaints', icon: '⚠️' },
//           { path: '/complaints/new', label: 'New Complaint', icon: '➕' }
//         ]
//       },
//       attendanceMenu,
//       leaveMenu,
//       payrollMenu,
//       reportsMenu,
//       notificationsMenu,
//       {
//         id: 'tracking',
//         label: 'Live Tracking',
//         icon: '📍',
//         subItems: [
//           { path: '/tracking/live', label: 'Live Location', icon: '📍' },
//           { path: '/geofences', label: 'Geofences', icon: '🌍' }
//         ]
//       },
//       {
//         id: 'sla',
//         label: 'SLA Monitoring',
//         icon: '⏱️',
//         subItems: [
//           { path: '/sla/dashboard', label: 'SLA Dashboard', icon: '📊' },
//           { path: '/sla/breached', label: 'Breached Tasks', icon: '🚨' },
//           { path: '/sla/at-risk', label: 'At Risk Tasks', icon: '⚠️' },
//           { path: '/sla/history', label: 'SLA History', icon: '📜' },
//           { path: '/sla/report', label: 'SLA Report', icon: '📈' }
//         ]
//       },
//       settingsMenu,
//       { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
//     ].filter(Boolean);
    
//     const managerMenus = [
//       dashboardItem,
//       aiFeaturesMenu,
//       showChat && chatMenu,
//       {
//         id: 'buildings',
//         label: 'Building Management',
//         icon: '🏢',
//         subItems: [
//           { path: '/buildings', label: 'All Buildings', icon: '🏢' }
//         ]
//       },
//       {
//         id: 'tasks',
//         label: 'Task Management',
//         icon: '📋',
//         subItems: [
//           { path: '/tasks', label: 'Team Tasks', icon: '📋' },
//           { path: '/tasks/board', label: 'Task Board', icon: '📌' },
//           { path: '/tasks/new', label: 'Create Task', icon: '➕' }
//         ]
//       },
//       attendanceMenu,
//       leaveMenu,
//       reportsMenu,
//       notificationsMenu,
//       {
//         id: 'tracking',
//         label: 'Live Tracking',
//         icon: '📍',
//         path: '/tracking/live'
//       },
//       {
//         id: 'sla',
//         label: 'SLA Monitoring',
//         icon: '⏱️',
//         subItems: [
//           { path: '/sla/dashboard', label: 'SLA Dashboard', icon: '📊' },
//           { path: '/sla/breached', label: 'Breached Tasks', icon: '🚨' }
//         ]
//       },
//       { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
//     ].filter(Boolean);
    
//     const supervisorMenus = [
//       dashboardItem,
//       {
//         id: 'ai-features',
//         label: '🤖 AI Features',
//         icon: '🧠',
//         subItems: [
//           { path: '/ai/smart-assign', label: 'Smart Task Assignment', icon: '🎯', badge: 'AI' },
//           { path: '/ai/anomaly-detection', label: 'Anomaly Detection', icon: '⚠️', badge: 'Beta' }
//         ]
//       },
//       showChat && chatMenu,
//       {
//         id: 'tasks',
//         label: 'Task Management',
//         icon: '📋',
//         subItems: [
//           { path: '/tasks', label: 'Team Tasks', icon: '📋' },
//           { path: '/tasks/board', label: 'Task Board', icon: '📌' }
//         ]
//       },
//       attendanceMenu,
//       leaveMenu,
//       {
//         id: 'tracking',
//         label: 'Live Tracking',
//         icon: '📍',
//         path: '/tracking/live'
//       },
//       {
//         id: 'sla',
//         label: 'SLA Monitoring',
//         icon: '⏱️',
//         path: '/sla/breached'
//       },
//       notificationsMenu,
//       { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
//     ].filter(Boolean);
    
//     const technicianMenus = [
//       dashboardItem,
//       {
//         id: 'ai-features',
//         label: '🤖 AI Features',
//         icon: '🧠',
//         subItems: [
//           { path: '/ai/smart-routing', label: 'Smart Route Planning', icon: '🗺️', badge: 'AI' },
//           { path: '/ai/assistant', label: 'AI Assistant', icon: '🤖', badge: 'AI' }
//         ]
//       },
//       showChat && chatMenu,
//       {
//         id: 'tasks',
//         label: 'My Tasks',
//         icon: '📋',
//         subItems: [
//           { path: '/tasks', label: 'Assigned Tasks', icon: '📋' },
//           { path: '/tasks/calendar', label: 'Calendar', icon: '📅' }
//         ]
//       },
//       {
//         id: 'attendance',
//         label: 'Attendance',
//         icon: '⏰',
//         subItems: [
//           { path: '/attendance/my', label: 'My Attendance', icon: '👤' },
//           { path: '/attendance/check-in-out', label: 'Check In/Out', icon: '📝' }
//         ]
//       },
//       {
//         id: 'leave',
//         label: 'Leave',
//         icon: '🏖️',
//         subItems: [
//           { path: '/leave/my', label: 'My Leave', icon: '📋' },
//           { path: '/leave/apply', label: 'Apply Leave', icon: '➕' },
//           { path: '/leave/balance', label: 'Leave Balance', icon: '⚖️' }
//         ]
//       },
//       {
//         id: 'salary',
//         label: 'Salary',
//         icon: '💰',
//         subItems: [
//           { path: '/salary/my', label: 'My Salary', icon: '📄' },
//           { path: '/salary/slip/:id', label: 'Salary Slip', icon: '📑' }
//         ]
//       },
//       {
//         id: 'tracking',
//         label: 'Live Tracking',
//         icon: '📍',
//         path: '/tracking/live'
//       },
//       notificationsMenu,
//       { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
//     ].filter(Boolean);
    
//     const customerMenus = [
//       dashboardItem,
//       {
//         id: 'ai-features',
//         label: '🤖 AI Assistant',
//         icon: '🧠',
//         subItems: [
//           { path: '/ai/chatbot', label: 'AI Chatbot', icon: '💬', badge: 'AI' },
//           { path: '/ai/ticket-predictor', label: 'Ticket Predictor', icon: '🔮', badge: 'AI' }
//         ]
//       },
//       showChat && chatMenu,
//       {
//         id: 'properties',
//         label: 'My Properties',
//         icon: '🏠',
//         subItems: [
//           { path: '/my-properties', label: 'Properties', icon: '🏢' },
//           { path: '/service-requests', label: 'Service Requests', icon: '🔧' }
//         ]
//       },
//       {
//         id: 'complaints',
//         label: 'My Complaints',
//         icon: '⚠️',
//         subItems: [
//           { path: '/complaints', label: 'All Complaints', icon: '⚠️' },
//           { path: '/complaints/new', label: 'Raise Complaint', icon: '➕' }
//         ]
//       },
//       {
//         id: 'payments',
//         label: 'Payments',
//         icon: '💰',
//         subItems: [
//           { path: '/payment-history', label: 'Payment History', icon: '📜' },
//           { path: '/visitor-pass', label: 'Visitor Pass', icon: '🔑' }
//         ]
//       },
//       notificationsMenu,
//       { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
//     ].filter(Boolean);
    
//     const hrMenus = [
//       dashboardItem,
//       {
//         id: 'ai-features',
//         label: '🤖 AI Features',
//         icon: '🧠',
//         subItems: [
//           { path: '/ai/candidate-matching', label: 'Candidate Matching', icon: '🎯', badge: 'AI' },
//           { path: '/ai/attrition-predictor', label: 'Attrition Predictor', icon: '📉', badge: 'AI' }
//         ]
//       },
//       showChat && chatMenu,
//       {
//         id: 'employees',
//         label: 'Employee Management',
//         icon: '👥',
//         subItems: [
//           { path: '/users', label: 'All Employees', icon: '👤' },
//           { path: '/employee/onboarding', label: 'Onboarding', icon: '📝' },
//           { path: '/attendance', label: 'Attendance', icon: '⏰' },
//           { path: '/attendance/report', label: 'Attendance Report', icon: '📊' }
//         ]
//       },
//       leaveMenu,
//       payrollMenu,
//       reportsMenu,
//       notificationsMenu,
//       settingsMenu,
//       { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
//     ].filter(Boolean);
    
//     // Role-based menu selection
//     switch (userRole) {
//       case 'super_admin':
//         return [...adminMenus, ...superAdminOnlyMenus];
//       case 'admin':
//         return adminMenus;
//       case 'manager':
//         return managerMenus;
//       case 'supervisor':
//         return supervisorMenus;
//       case 'technician':
//         return technicianMenus;
//       case 'customer':
//         return customerMenus;
//       case 'hr':
//         return hrMenus;
//       default:
//         return [dashboardItem, notificationsMenu, { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }];
//     }
//   }, [user?.role, user?.chatEnabled, unreadChatCount, isLoadingChat]);

//   const toggleSubMenu = (menuId) => {
//     setExpandedMenus(prev => ({
//       ...prev,
//       [menuId]: !prev[menuId]
//     }));
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // Helper function to render badge
//   const renderBadge = (badge) => {
//     if (!badge) return null;
//     const badgeStyles = {
//       AI: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2',
//       Beta: 'bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2',
//       HR: 'bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2',
//       Admin: 'bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2'
//     };
    
//     // For numeric badges (like unread count)
//     if (!isNaN(badge) && badge > 0) {
//       return (
//         <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2 min-w-[18px] text-center">
//           {badge > 99 ? '99+' : badge}
//         </span>
//       );
//     }
    
//     return (
//       <span className={badgeStyles[badge] || 'bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2'}>
//         {badge}
//       </span>
//     );
//   };

//   return (
//     <>
//       {/* Mobile sidebar backdrop */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden" 
//           onClick={onClose}
//           aria-label="Close sidebar"
//         />
//       )}
      
//       {/* Sidebar */}
//       <div 
//         className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white text-lg font-bold">F</span>
//               </div>
//               <h1 className="text-xl font-bold text-gray-800">FMS Enterprise</h1>
//             </div>
//           </div>
          
//           {/* Navigation - Scrollable */}
//           <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
//             {menuItems.map((item) => (
//               <div key={item.id}>
//                 {item.subItems ? (
//                   // Menu with sub-items (dropdown)
//                   <div>
//                     <button
//                       onClick={() => toggleSubMenu(item.id)}
//                       className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 ${
//                         expandedMenus[item.id] ? 'bg-gray-100' : ''
//                       }`}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <span className="text-gray-500 text-lg">{item.icon}</span>
//                         <span className="text-gray-700">{item.label}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {item.badge && renderBadge(item.badge)}
//                         <svg
//                           className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
//                             expandedMenus[item.id] ? 'rotate-180' : ''
//                           }`}
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </div>
//                     </button>
                    
//                     {expandedMenus[item.id] && (
//                       <div className="mt-1 ml-6 space-y-1">
//                         {item.subItems.map((subItem) => (
//                           <NavLink
//                             key={subItem.path}
//                             to={subItem.path}
//                             onClick={() => onClose?.()}
//                             className={({ isActive }) =>
//                               `flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
//                                 isActive
//                                   ? 'bg-blue-50 text-blue-700 font-medium'
//                                   : 'text-gray-600 hover:bg-gray-100'
//                               }`
//                             }
//                           >
//                             <div className="flex items-center">
//                               <span className="mr-2 text-base">{subItem.icon}</span>
//                               <span>{subItem.label}</span>
//                             </div>
//                             {renderBadge(subItem.badge)}
//                           </NavLink>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   // Direct link (no sub-items)
//                   <NavLink
//                     to={item.path}
//                     onClick={() => onClose?.()}
//                     className={({ isActive }) =>
//                       `flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
//                         isActive
//                           ? 'bg-blue-50 text-blue-700'
//                           : 'text-gray-700 hover:bg-gray-100'
//                       }`
//                     }
//                   >
//                     <div className="flex items-center">
//                       <span className="mr-3 text-gray-500 text-lg">{item.icon}</span>
//                       <span>{item.label}</span>
//                     </div>
//                     {renderBadge(item.badge)}
//                   </NavLink>
//                 )}
//               </div>
//             ))}
//           </nav>
          
//           {/* Online Users Count (for admin) */}
//           {(user?.role === 'super_admin' || user?.role === 'admin') && onlineUsersCount > 0 && (
//             <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                   <span className="text-xs text-gray-600">{onlineUsersCount} users online</span>
//                 </div>
//                 <Link to="/chat" className="text-xs text-blue-600 hover:underline">
//                   View Chats
//                 </Link>
//               </div>
//             </div>
//           )}
          
//           {/* AI Status Indicator */}
//           <div className="px-4 py-2 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-xs text-gray-600">AI Assistant Active</span>
//               </div>
//               <span className="text-xs text-purple-600">v2.0</span>
//             </div>
//           </div>
          
//           {/* User Info & Logout */}
//           <div className="p-4 border-t border-gray-200 bg-gray-50">
//             <div className="flex items-center space-x-3 mb-3">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
//                 <span className="text-white font-medium text-sm">
//                   {user?.firstName?.[0]}{user?.lastName?.[0]}
//                 </span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-900 truncate">
//                   {user?.firstName} {user?.lastName}
//                 </p>
//                 <p className="text-xs text-gray-500 capitalize truncate">
//                   {user?.role?.replace(/_/g, ' ')}
//                 </p>
//                 {chatEnabled && (
//                   <p className="text-xs text-green-600">Chat Enabled</p>
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//             >
//               <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//               </svg>
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;



// client/src/components/layout/Sidebar.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom'; // Added Link import
import { useAuth } from '../../hooks/useAuth';
import { chatApi } from '../../api/chat.api';
import { userApi } from '../../api/user.api';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [chatEnabled, setChatEnabled] = useState(false);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [hasChatError, setHasChatError] = useState(false);

  // Fetch chat settings and unread count
  useEffect(() => {
    const fetchChatData = async () => {
      // Only fetch if chat is enabled for user or user is super_admin or admin
      if (!user?.chatEnabled && user?.role !== 'super_admin' && user?.role !== 'admin') {
        return;
      }
      
      setIsLoadingChat(true);
      try {
        // Get unread messages count
        try {
          const chatsRes = await chatApi.getUserChats();
          if (chatsRes.data?.success) {
            const totalUnread = chatsRes.data.data?.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0) || 0;
            setUnreadChatCount(totalUnread);
            setHasChatError(false);
          }
        } catch (chatsError) {
          console.warn('Failed to fetch chats:', chatsError.message);
          setHasChatError(true);
        }
        
        // Get chat settings
        try {
          const settingsRes = await chatApi.getUserChatSettings();
          if (settingsRes.data?.success) {
            setChatEnabled(settingsRes.data.data?.chatEnabled || false);
          } else {
            setChatEnabled(user?.chatEnabled || false);
          }
        } catch (settingsError) {
          console.warn('Chat settings not available:', settingsError.message);
          // If settings API fails, use user's chatEnabled property
          setChatEnabled(user?.chatEnabled || false);
        }
        
        // Get online users count (for admin)
        if (user?.role === 'super_admin' || user?.role === 'admin') {
          try {
            const onlineUsersRes = await userApi.getOnlineUsersCount();
            if (onlineUsersRes.data?.success) {
              setOnlineUsersCount(onlineUsersRes.data.data?.count || 0);
            }
          } catch (onlineError) {
            console.warn('Online users API not available:', onlineError.message);
          }
        }
      } catch (error) {
        console.error('Failed to fetch chat data:', error);
        setHasChatError(true);
      } finally {
        setIsLoadingChat(false);
      }
    };
    
    fetchChatData();
    
    // Set up interval to refresh unread count every 30 seconds
    const interval = setInterval(() => {
      if (user?.chatEnabled || user?.role === 'super_admin' || user?.role === 'admin') {
        fetchChatData();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  // Define menu items based on user role
  const menuItems = useMemo(() => {
    const userRole = user?.role;
    
    // Common items for all roles
    const dashboardItem = {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: `/dashboard${userRole === 'super_admin' ? '/super-admin' : 
                      userRole === 'admin' ? '/admin' : 
                      userRole === 'manager' ? '/manager' :
                      userRole === 'supervisor' ? '/supervisor' :
                      userRole === 'technician' ? '/technician' :
                      userRole === 'customer' ? '/customer' : ''}`
    };
    
    // ==================== 🤖 AI FEATURES MENU ====================
    const aiFeaturesMenu = {
      id: 'ai-features',
      label: '🤖 AI Features',
      icon: '🧠',
      subItems: [
        { path: '/ai/smart-assign', label: 'Smart Task Assignment', icon: '🎯', badge: 'AI' },
        { path: '/ai/sla-predictor', label: 'SLA Predictor', icon: '📈', badge: 'AI' },
        { path: '/ai/smart-scheduling', label: 'Smart Scheduling', icon: '📅', badge: 'AI' },
        { path: '/ai/auto-responder', label: 'Auto Responder', icon: '💬', badge: 'AI' },
        { path: '/ai/insights', label: 'AI Insights', icon: '💡', badge: 'AI' },
        { path: '/ai/anomaly-detection', label: 'Anomaly Detection', icon: '⚠️', badge: 'Beta' }
      ]
    };
    
    // ==================== 💬 CHAT MENU ====================
    const chatMenu = {
      id: 'chat',
      label: 'Chat',
      icon: '💬',
      badge: unreadChatCount > 0 ? unreadChatCount.toString() : null,
      subItems: [
        { path: '/chat', label: 'All Chats', icon: '💬' },
        { path: '/chat/groups', label: 'Group Chats', icon: '👥' },
        { path: '/chat/settings', label: 'Chat Settings', icon: '⚙️' }
      ]
    };
    
    // ==================== ATTENDANCE MENU ====================
    const attendanceMenu = {
      id: 'attendance',
      label: 'Attendance',
      icon: '⏰',
      subItems: [
        { path: '/attendance/my', label: 'My Attendance', icon: '👤' },
        { path: '/attendance/team', label: 'Team Attendance', icon: '👥' },
        { path: '/attendance/check-in-out', label: 'Check In/Out', icon: '📝' },
        { path: '/attendance/report', label: 'Attendance Report', icon: '📊' },
        { path: '/attendance/holidays', label: 'Holidays', icon: '🎉' },
        { path: '/attendance/correction', label: 'Correction Requests', icon: '✏️' }
      ]
    };
    
    // ==================== LEAVE MENU ====================
    const leaveMenu = {
      id: 'leave',
      label: 'Leave Management',
      icon: '🏖️',
      subItems: [
        { path: '/leave/my', label: 'My Leave', icon: '📋' },
        { path: '/leave/calendar', label: 'Leave Calendar', icon: '📅' },
        { path: '/leave/balance', label: 'Leave Balance', icon: '⚖️' },
        { path: '/leave/apply', label: 'Apply Leave', icon: '➕' },
        { path: '/leave/pending', label: 'Pending Approvals', icon: '⏳', badge: 'HR' },
        { path: '/leave/history', label: 'Leave History', icon: '📜' }
      ]
    };
    
    // ==================== PAYROLL MENU ====================
    const payrollMenu = {
      id: 'payroll',
      label: 'Payroll',
      icon: '💰',
      subItems: [
        { path: '/salary/my', label: 'My Salary', icon: '📄' },
        { path: '/salary/slip/:id', label: 'Salary Slip', icon: '📑' },
        { path: '/payroll/dashboard', label: 'Payroll Dashboard', icon: '📊', badge: 'HR' },
        { path: '/payroll/process', label: 'Process Payroll', icon: '⚙️', badge: 'HR' },
        { path: '/payroll/reports', label: 'Payroll Reports', icon: '📈', badge: 'HR' },
        { path: '/salary/structure', label: 'Salary Structure', icon: '🏗️', badge: 'HR' },
        { path: '/payroll/settings', label: 'Payroll Settings', icon: '⚙️', badge: 'Admin' }
      ]
    };
    
    // ==================== REPORTS MENU ====================
    const reportsMenu = {
      id: 'reports',
      label: 'Reports',
      icon: '📊',
      subItems: [
        { path: '/reports', label: 'Reports Dashboard', icon: '📈' },
        { path: '/reports/tasks', label: 'Task Reports', icon: '📋' },
        { path: '/reports/attendance', label: 'Attendance Reports', icon: '⏰' },
        { path: '/reports/financial', label: 'Financial Reports', icon: '💰' },
        { path: '/reports/builder', label: 'Report Builder', icon: '🔧', badge: 'Admin' },
        { path: '/reports/analytics', label: 'Analytics', icon: '📉' }
      ]
    };
    
    // ==================== NOTIFICATIONS MENU ====================
    const notificationsMenu = {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      subItems: [
        { path: '/notifications', label: 'All Notifications', icon: '📢' },
        { path: '/notifications/preferences', label: 'Preferences', icon: '⚙️' }
      ]
    };
    
    // ==================== SETTINGS MENU ====================
    const settingsMenu = {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      subItems: [
        { path: '/settings/general', label: 'General', icon: '🏠' },
        { path: '/settings/email', label: 'Email', icon: '📧' },
        { path: '/settings/notifications', label: 'Notifications', icon: '🔔' },
        { path: '/settings/integrations', label: 'Integrations', icon: '🔌' },
        { path: '/settings/theme', label: 'Theme', icon: '🎨' },
        { path: '/settings/backup', label: 'Backup & Restore', icon: '💾', badge: 'Admin' },
        { path: '/settings/audit-logs', label: 'Audit Logs', icon: '📜', badge: 'Admin' },
        { path: '/settings/system', label: 'System', icon: '🖥️', badge: 'Admin' }
      ]
    };
    
    // ==================== SUPER ADMIN ONLY MENUS ====================
    const superAdminOnlyMenus = [
      {
        id: 'system-monitoring',
        label: 'System Monitoring',
        icon: '📊',
        subItems: [
          { path: '/system/health', label: 'System Health', icon: '💚', badge: 'Admin' },
          { path: '/system/logs', label: 'Error Logs', icon: '📝', badge: 'Admin' },
          { path: '/system/database', label: 'Database Status', icon: '🗄️', badge: 'Admin' }
        ]
      },
      {
        id: 'api-management',
        label: 'API Management',
        icon: '🔌',
        subItems: [
          { path: '/api-keys', label: 'API Keys', icon: '🔑', badge: 'Admin' },
          { path: '/webhooks', label: 'Webhooks', icon: '🌐', badge: 'Admin' }
        ]
      },
      {
        id: 'chat-admin',
        label: 'Chat Administration',
        icon: '💬',
        subItems: [
          { path: '/admin/chat', label: 'Chat Monitoring', icon: '👁️', badge: 'Admin' },
          { path: '/admin/chat/logs', label: 'Chat Logs', icon: '📜', badge: 'Admin' },
          { path: '/admin/chat/settings', label: 'Chat Settings', icon: '⚙️', badge: 'Admin' }
        ]
      }
    ];
    
    // Check if chat should be shown (chat enabled OR super_admin OR admin)
    const showChat = (user?.chatEnabled || userRole === 'super_admin' || userRole === 'admin') && !isLoadingChat;
    
    // Role-specific menus
    const adminMenus = [
      dashboardItem,
      aiFeaturesMenu,
      showChat && chatMenu,
      {
        id: 'users',
        label: 'User Management',
        icon: '👥',
        subItems: [
          { path: '/users', label: 'All Users', icon: '👤' },
          { path: '/users/new', label: 'Add User', icon: '➕' },
          { path: '/employee/onboarding', label: 'Employee Onboarding', icon: '📝' },
          { path: '/roles', label: 'Roles & Permissions', icon: '🔐' }
        ]
      },
      {
        id: 'buildings',
        label: 'Building Management',
        icon: '🏢',
        subItems: [
          { path: '/buildings', label: 'All Buildings', icon: '🏢' },
          { path: '/buildings/new', label: 'Add Building', icon: '➕' }
        ]
      },
      {
        id: 'tasks',
        label: 'Task Management',
        icon: '📋',
        subItems: [
          { path: '/tasks', label: 'All Tasks', icon: '📋' },
          { path: '/tasks/board', label: 'Task Board', icon: '📌' },
          { path: '/tasks/calendar', label: 'Calendar', icon: '📅' },
          { path: '/tasks/new', label: 'Create Task', icon: '➕' }
        ]
      },
      {
        id: 'complaints',
        label: 'Complaints',
        icon: '⚠️',
        subItems: [
          { path: '/complaints', label: 'All Complaints', icon: '⚠️' },
          { path: '/complaints/new', label: 'New Complaint', icon: '➕' }
        ]
      },
      attendanceMenu,
      leaveMenu,
      payrollMenu,
      reportsMenu,
      notificationsMenu,
      {
        id: 'tracking',
        label: 'Live Tracking',
        icon: '📍',
        subItems: [
          { path: '/tracking/live', label: 'Live Location', icon: '📍' },
          { path: '/geofences', label: 'Geofences', icon: '🌍' }
        ]
      },
      {
        id: 'sla',
        label: 'SLA Monitoring',
        icon: '⏱️',
        subItems: [
          { path: '/sla/dashboard', label: 'SLA Dashboard', icon: '📊' },
          { path: '/sla/breached', label: 'Breached Tasks', icon: '🚨' },
          { path: '/sla/at-risk', label: 'At Risk Tasks', icon: '⚠️' },
          { path: '/sla/history', label: 'SLA History', icon: '📜' },
          { path: '/sla/report', label: 'SLA Report', icon: '📈' }
        ]
      },
      settingsMenu,
      { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
    ].filter(Boolean);
    
    const managerMenus = [
      dashboardItem,
      aiFeaturesMenu,
      showChat && chatMenu,
      {
        id: 'buildings',
        label: 'Building Management',
        icon: '🏢',
        subItems: [
          { path: '/buildings', label: 'All Buildings', icon: '🏢' }
        ]
      },
      {
        id: 'tasks',
        label: 'Task Management',
        icon: '📋',
        subItems: [
          { path: '/tasks', label: 'Team Tasks', icon: '📋' },
          { path: '/tasks/board', label: 'Task Board', icon: '📌' },
          { path: '/tasks/new', label: 'Create Task', icon: '➕' }
        ]
      },
      attendanceMenu,
      leaveMenu,
      reportsMenu,
      notificationsMenu,
      {
        id: 'tracking',
        label: 'Live Tracking',
        icon: '📍',
        path: '/tracking/live'
      },
      {
        id: 'sla',
        label: 'SLA Monitoring',
        icon: '⏱️',
        subItems: [
          { path: '/sla/dashboard', label: 'SLA Dashboard', icon: '📊' },
          { path: '/sla/breached', label: 'Breached Tasks', icon: '🚨' }
        ]
      },
      { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
    ].filter(Boolean);
    
    const supervisorMenus = [
      dashboardItem,
      {
        id: 'ai-features',
        label: '🤖 AI Features',
        icon: '🧠',
        subItems: [
          { path: '/ai/smart-assign', label: 'Smart Task Assignment', icon: '🎯', badge: 'AI' },
          { path: '/ai/anomaly-detection', label: 'Anomaly Detection', icon: '⚠️', badge: 'Beta' }
        ]
      },
      showChat && chatMenu,
      {
        id: 'tasks',
        label: 'Task Management',
        icon: '📋',
        subItems: [
          { path: '/tasks', label: 'Team Tasks', icon: '📋' },
          { path: '/tasks/board', label: 'Task Board', icon: '📌' }
        ]
      },
      attendanceMenu,
      leaveMenu,
      {
        id: 'tracking',
        label: 'Live Tracking',
        icon: '📍',
        path: '/tracking/live'
      },
      {
        id: 'sla',
        label: 'SLA Monitoring',
        icon: '⏱️',
        path: '/sla/breached'
      },
      notificationsMenu,
      { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
    ].filter(Boolean);
    
    const technicianMenus = [
      dashboardItem,
      {
        id: 'ai-features',
        label: '🤖 AI Features',
        icon: '🧠',
        subItems: [
          { path: '/ai/smart-routing', label: 'Smart Route Planning', icon: '🗺️', badge: 'AI' },
          { path: '/ai/assistant', label: 'AI Assistant', icon: '🤖', badge: 'AI' }
        ]
      },
      showChat && chatMenu,
      {
        id: 'tasks',
        label: 'My Tasks',
        icon: '📋',
        subItems: [
          { path: '/tasks', label: 'Assigned Tasks', icon: '📋' },
          { path: '/tasks/calendar', label: 'Calendar', icon: '📅' }
        ]
      },
      {
        id: 'attendance',
        label: 'Attendance',
        icon: '⏰',
        subItems: [
          { path: '/attendance/my', label: 'My Attendance', icon: '👤' },
          { path: '/attendance/check-in-out', label: 'Check In/Out', icon: '📝' }
        ]
      },
      {
        id: 'leave',
        label: 'Leave',
        icon: '🏖️',
        subItems: [
          { path: '/leave/my', label: 'My Leave', icon: '📋' },
          { path: '/leave/apply', label: 'Apply Leave', icon: '➕' },
          { path: '/leave/balance', label: 'Leave Balance', icon: '⚖️' }
        ]
      },
      {
        id: 'salary',
        label: 'Salary',
        icon: '💰',
        subItems: [
          { path: '/salary/my', label: 'My Salary', icon: '📄' },
          { path: '/salary/slip/:id', label: 'Salary Slip', icon: '📑' }
        ]
      },
      {
        id: 'tracking',
        label: 'Live Tracking',
        icon: '📍',
        path: '/tracking/live'
      },
      notificationsMenu,
      { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
    ].filter(Boolean);
    
    const customerMenus = [
      dashboardItem,
      {
        id: 'ai-features',
        label: '🤖 AI Assistant',
        icon: '🧠',
        subItems: [
          { path: '/ai/chatbot', label: 'AI Chatbot', icon: '💬', badge: 'AI' },
          { path: '/ai/ticket-predictor', label: 'Ticket Predictor', icon: '🔮', badge: 'AI' }
        ]
      },
      showChat && chatMenu,
      {
        id: 'properties',
        label: 'My Properties',
        icon: '🏠',
        subItems: [
          { path: '/my-properties', label: 'Properties', icon: '🏢' },
          { path: '/service-requests', label: 'Service Requests', icon: '🔧' }
        ]
      },
      {
        id: 'complaints',
        label: 'My Complaints',
        icon: '⚠️',
        subItems: [
          { path: '/complaints', label: 'All Complaints', icon: '⚠️' },
          { path: '/complaints/new', label: 'Raise Complaint', icon: '➕' }
        ]
      },
      {
        id: 'payments',
        label: 'Payments',
        icon: '💰',
        subItems: [
          { path: '/payment-history', label: 'Payment History', icon: '📜' },
          { path: '/visitor-pass', label: 'Visitor Pass', icon: '🔑' }
        ]
      },
      notificationsMenu,
      { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
    ].filter(Boolean);
    
    const hrMenus = [
      dashboardItem,
      {
        id: 'ai-features',
        label: '🤖 AI Features',
        icon: '🧠',
        subItems: [
          { path: '/ai/candidate-matching', label: 'Candidate Matching', icon: '🎯', badge: 'AI' },
          { path: '/ai/attrition-predictor', label: 'Attrition Predictor', icon: '📉', badge: 'AI' }
        ]
      },
      showChat && chatMenu,
      {
        id: 'employees',
        label: 'Employee Management',
        icon: '👥',
        subItems: [
          { path: '/users', label: 'All Employees', icon: '👤' },
          { path: '/employee/onboarding', label: 'Onboarding', icon: '📝' },
          { path: '/attendance', label: 'Attendance', icon: '⏰' },
          { path: '/attendance/report', label: 'Attendance Report', icon: '📊' }
        ]
      },
      leaveMenu,
      payrollMenu,
      reportsMenu,
      notificationsMenu,
      settingsMenu,
      { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }
    ].filter(Boolean);
    
    // Role-based menu selection
    switch (userRole) {
      case 'super_admin':
        return [...adminMenus, ...superAdminOnlyMenus];
      case 'admin':
        return adminMenus;
      case 'manager':
        return managerMenus;
      case 'supervisor':
        return supervisorMenus;
      case 'technician':
        return technicianMenus;
      case 'customer':
        return customerMenus;
      case 'hr':
        return hrMenus;
      default:
        return [dashboardItem, notificationsMenu, { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' }];
    }
  }, [user?.role, user?.chatEnabled, unreadChatCount, isLoadingChat]);

  const toggleSubMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Helper function to render badge
  const renderBadge = (badge) => {
    if (!badge) return null;
    const badgeStyles = {
      AI: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2',
      Beta: 'bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2',
      HR: 'bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2',
      Admin: 'bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2'
    };
    
    // For numeric badges (like unread count)
    if (!isNaN(badge) && badge > 0) {
      return (
        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2 min-w-[18px] text-center">
          {badge > 99 ? '99+' : badge}
        </span>
      );
    }
    
    return (
      <span className={badgeStyles[badge] || 'bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2'}>
        {badge}
      </span>
    );
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">F</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">FMS Enterprise</h1>
            </div>
          </div>
          
          {/* Navigation - Scrollable */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.subItems ? (
                  // Menu with sub-items (dropdown)
                  <div>
                    <button
                      onClick={() => toggleSubMenu(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 ${
                        expandedMenus[item.id] ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500 text-lg">{item.icon}</span>
                        <span className="text-gray-700">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && renderBadge(item.badge)}
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            expandedMenus[item.id] ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    {expandedMenus[item.id] && (
                      <div className="mt-1 ml-6 space-y-1">
                        {item.subItems.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => onClose?.()}
                            className={({ isActive }) =>
                              `flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-blue-50 text-blue-700 font-medium'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`
                            }
                          >
                            <div className="flex items-center">
                              <span className="mr-2 text-base">{subItem.icon}</span>
                              <span>{subItem.label}</span>
                            </div>
                            {renderBadge(subItem.badge)}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Direct link (no sub-items)
                  <NavLink
                    to={item.path}
                    onClick={() => onClose?.()}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-gray-500 text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {renderBadge(item.badge)}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>
          
          {/* Chat Error Message (if API fails) */}
          {hasChatError && (user?.role === 'super_admin' || user?.role === 'admin') && (
            <div className="px-4 py-2 border-t border-gray-200 bg-yellow-50">
              <p className="text-xs text-yellow-700 text-center">
                Chat service unavailable. Please try again later.
              </p>
            </div>
          )}
          
          {/* Online Users Count (for admin) */}
          {(user?.role === 'super_admin' || user?.role === 'admin') && onlineUsersCount > 0 && !hasChatError && (
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">{onlineUsersCount} users online</span>
                </div>
                <Link to="/chat" className="text-xs text-blue-600 hover:underline">
                  View Chats
                </Link>
              </div>
            </div>
          )}
          
          {/* AI Status Indicator */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">AI Assistant Active</span>
              </div>
              <span className="text-xs text-purple-600">v2.0</span>
            </div>
          </div>
          
          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize truncate">
                  {user?.role?.replace(/_/g, ' ')}
                </p>
                {chatEnabled && (
                  <p className="text-xs text-green-600">Chat Enabled</p>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;