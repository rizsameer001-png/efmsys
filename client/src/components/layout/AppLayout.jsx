// // client/src/components/layout/AppLayout.jsx
// import React, { useState } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import MobileNav from './MobileNav';
// import { useAuth } from '../../hooks/useAuth';
// import { usePermission } from '../../hooks/usePermission';
// import NotificationBell from '../components/notifications/NotificationBell';

// const AppLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { user } = useAuth();
//   const { hasPermission } = usePermission();
//   const navigate = useNavigate();

//   // Define all menu items with roles and permissions
//   const menuItems = [
//     {
//       id: 'dashboard',
//       label: 'Dashboard',
//       icon: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//         </svg>
//       ),
//       activeIcon: (
//         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//         </svg>
//       ),
//       path: '/dashboard',
//       roles: ['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer', 'hr', 'accountant'],
//     },
//     {
//       id: 'users',
//       label: 'Users',
//       icon: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//         </svg>
//       ),
//       activeIcon: (
//         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//         </svg>
//       ),
//       path: '/users',
//       roles: ['super_admin', 'admin', 'hr'],
//       permissions: ['user.read'],
//       subItems: [
//         { label: 'All Users', path: '/users', icon: '👥' },
//         { label: 'Add User', path: '/users/new', icon: '➕' },
//         { label: 'Employee Onboarding', path: '/employee/onboarding', icon: '📝' },
//         { label: 'Roles', path: '/roles', icon: '🔒' },
//         { label: 'Permissions', path: '/permissions', icon: '🔐' },
//       ]
//     },
//     {
//       id: 'buildings',
//       label: 'Buildings',
//       icon: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//         </svg>
//       ),
//       activeIcon: (
//         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//         </svg>
//       ),
//       path: '/buildings',
//       roles: ['super_admin', 'admin', 'manager'],
//       permissions: ['building.read'],
//       subItems: [
//         { label: 'All Buildings', path: '/buildings', icon: '🏢' },
//         { label: 'Add Building', path: '/buildings/new', icon: '➕' },
//         { label: 'Floor Management', path: '/buildings/floors', icon: '📐' },
//         { label: 'Unit Management', path: '/buildings/units', icon: '🏠' },
//         { label: 'Bulk Import', path: '/buildings/bulk-import', icon: '📥' },
//       ]
//     },
//     {
//       id: 'complaints',
//       label: 'Complaints',
//       icon: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//         </svg>
//       ),
//       activeIcon: (
//         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//         </svg>
//       ),
//       path: '/complaints',
//       roles: ['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer'],
//       subItems: [
//         { label: 'All Complaints', path: '/complaints', icon: '📋' },
//         { label: 'Raise Complaint', path: '/complaints/new', icon: '➕' },
//       ]
//     },
//     {
//       id: 'tasks',
//       label: 'Tasks',
//       icon: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//         </svg>
//       ),
//       activeIcon: (
//         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//         </svg>
//       ),
//       path: '/tasks',
//       roles: ['super_admin', 'admin', 'manager', 'supervisor', 'technician'],
//       permissions: ['task.read'],
//       subItems: [
//         { label: 'Task List', path: '/tasks', icon: '📋' },
//         { label: 'Task Board', path: '/tasks/board', icon: '📌' },
//         { label: 'Task Calendar', path: '/tasks/calendar', icon: '📅' },
//         { label: 'Create Task', path: '/tasks/new', icon: '➕' },
//       ]
//     },
//     {
//       id: 'attendance',
//       label: 'Attendance',
//       icon: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       ),
//       activeIcon: (
//         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       ),
//       path: '/attendance',
//       roles: ['super_admin', 'admin', 'hr', 'manager', 'supervisor', 'technician'],
//       subItems: [
//         { label: 'Dashboard', path: '/attendance', icon: '📊' },
//         { label: 'Check In/Out', path: '/attendance/check-in-out', icon: '✅' },
//         { label: 'Attendance Report', path: '/attendance/report', icon: '📄' },
//         { label: 'Leave Request', path: '/leaves/request', icon: '📝' },
//         { label: 'Leave Approvals', path: '/leaves/approve', icon: '✓' },
//       ]
//     },
//     {
//       id: 'payroll',
//       label: 'Payroll',
//       icon: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       ),
//       activeIcon: (
//         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       ),
//       path: '/payroll',
//       roles: ['super_admin', 'admin', 'hr', 'accountant'],
//       subItems: [
//         { label: 'Dashboard', path: '/payroll', icon: '📊' },
//         { label: 'Salary Structure', path: '/payroll/salary-structure', icon: '💰' },
//         { label: 'Process Payroll', path: '/payroll/process', icon: '⚙️' },
//         { label: 'Payroll Reports', path: '/payroll/reports', icon: '📄' },
//       ]
//     },
//     {
//       id: 'reports',
//       label: 'Reports',
//       icon: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//         </svg>
//       ),
//       activeIcon: (
//         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//         </svg>
//       ),
//       path: '/reports',
//       roles: ['super_admin', 'admin', 'manager', 'hr', 'accountant'],
//       subItems: [
//         { label: 'Reports Dashboard', path: '/reports', icon: '📊' },
//         { label: 'Report Builder', path: '/reports/builder', icon: '🔨' },
//         { label: 'Analytics', path: '/reports/analytics', icon: '📈' },
//       ]
//     },
//     {
//       id: 'tracking',
//       label: 'Live Tracking',
//       icon: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//         </svg>
//       ),
//       activeIcon: (
//         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//         </svg>
//       ),
//       path: '/tracking/live',
//       roles: ['super_admin', 'admin', 'manager', 'supervisor'],
//     },
//     {
//       id: 'sla',
//       label: 'SLA Monitor',
//       icon: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//         </svg>
//       ),
//       activeIcon: (
//         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//         </svg>
//       ),
//       path: '/sla/dashboard',
//       roles: ['super_admin', 'admin', 'manager'],
//     },
//     {
//       id: 'settings',
//       label: 'Settings',
//       icon: (
//         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//         </svg>
//       ),
//       activeIcon: (
//         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//         </svg>
//       ),
//       path: '/settings',
//       roles: ['super_admin', 'admin'],
//       subItems: [
//         { label: 'General', path: '/settings', icon: '⚙️' },
//         { label: 'System', path: '/settings/system', icon: '🔧' },
//         { label: 'Backup & Restore', path: '/settings/backup', icon: '💾' },
//         { label: 'Audit Logs', path: '/settings/audit-logs', icon: '📜' },
//       ]
//     },
//   ];

//   // Filter menu items based on user role and permissions
//   const filteredMenuItems = menuItems.filter(item => {
//     // Check role access
//     if (item.roles && !item.roles.includes(user?.role)) {
//       return false;
//     }
//     // Check permission access
//     if (item.permissions) {
//       const hasPerm = item.permissions.some(perm => hasPermission(perm));
//       if (!hasPerm) return false;
//     }
//     return true;
//   });

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Sidebar 
//         isOpen={sidebarOpen} 
//         onClose={() => setSidebarOpen(false)} 
//         menuItems={filteredMenuItems}
//       />
      
//       <div className="lg:pl-64">
//         <Header onMenuClick={() => setSidebarOpen(true)} />
        
//         <main className="py-6 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-6">
//           <Outlet />
//         </main>
        
//         {/* Mobile Navigation - Only visible on mobile */}
//         <MobileNav menuItems={filteredMenuItems} />
//       </div>
//     </div>
//   );
// };

// export default AppLayout;



// client/src/components/layout/AppLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useAuth } from '../../hooks/useAuth';
import { usePermission } from '../../hooks/usePermission';
import NotificationBell from '../notifications/NotificationBell';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { hasPermission } = usePermission();
  const navigate = useNavigate();

  // Define all menu items with roles and permissions
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: '/dashboard',
      roles: ['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer', 'hr', 'accountant'],
    },
    {
      id: 'users',
      label: 'Users',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      path: '/users',
      roles: ['super_admin', 'admin', 'hr'],
      permissions: ['user.read'],
      subItems: [
        { label: 'All Users', path: '/users', icon: '👥' },
        { label: 'Add User', path: '/users/new', icon: '➕' },
        { label: 'Employee Onboarding', path: '/employee/onboarding', icon: '📝' },
        { label: 'Roles', path: '/roles', icon: '🔒' },
        { label: 'Permissions', path: '/permissions', icon: '🔐' },
      ]
    },
    {
      id: 'buildings',
      label: 'Buildings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      path: '/buildings',
      roles: ['super_admin', 'admin', 'manager'],
      permissions: ['building.read'],
      subItems: [
        { label: 'All Buildings', path: '/buildings', icon: '🏢' },
        { label: 'Add Building', path: '/buildings/new', icon: '➕' },
        { label: 'Floor Management', path: '/buildings/floors', icon: '📐' },
        { label: 'Unit Management', path: '/buildings/units', icon: '🏠' },
        { label: 'Bulk Import', path: '/buildings/bulk-import', icon: '📥' },
      ]
    },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      path: '/complaints',
      roles: ['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer'],
      subItems: [
        { label: 'All Complaints', path: '/complaints', icon: '📋' },
        { label: 'Raise Complaint', path: '/complaints/new', icon: '➕' },
      ]
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      path: '/tasks',
      roles: ['super_admin', 'admin', 'manager', 'supervisor', 'technician'],
      permissions: ['task.read'],
      subItems: [
        { label: 'Task List', path: '/tasks', icon: '📋' },
        { label: 'Task Board', path: '/tasks/board', icon: '📌' },
        { label: 'Task Calendar', path: '/tasks/calendar', icon: '📅' },
        { label: 'Create Task', path: '/tasks/new', icon: '➕' },
      ]
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: '/attendance',
      roles: ['super_admin', 'admin', 'hr', 'manager', 'supervisor', 'technician'],
      subItems: [
        { label: 'Dashboard', path: '/attendance', icon: '📊' },
        { label: 'Check In/Out', path: '/attendance/check-in-out', icon: '✅' },
        { label: 'Attendance Report', path: '/attendance/report', icon: '📄' },
        { label: 'Leave Request', path: '/leaves/request', icon: '📝' },
        { label: 'Leave Approvals', path: '/leaves/approve', icon: '✓' },
      ]
    },
    {
      id: 'payroll',
      label: 'Payroll',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: '/payroll',
      roles: ['super_admin', 'admin', 'hr', 'accountant'],
      subItems: [
        { label: 'Dashboard', path: '/payroll', icon: '📊' },
        { label: 'Salary Structure', path: '/payroll/salary-structure', icon: '💰' },
        { label: 'Process Payroll', path: '/payroll/process', icon: '⚙️' },
        { label: 'Payroll Reports', path: '/payroll/reports', icon: '📄' },
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/reports',
      roles: ['super_admin', 'admin', 'manager', 'hr', 'accountant'],
      subItems: [
        { label: 'Reports Dashboard', path: '/reports', icon: '📊' },
        { label: 'Report Builder', path: '/reports/builder', icon: '🔨' },
        { label: 'Analytics', path: '/reports/analytics', icon: '📈' },
      ]
    },
    {
      id: 'tracking',
      label: 'Live Tracking',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/tracking/live',
      roles: ['super_admin', 'admin', 'manager', 'supervisor'],
    },
    {
      id: 'sla',
      label: 'SLA Monitor',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      path: '/sla/dashboard',
      roles: ['super_admin', 'admin', 'manager'],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/settings',
      roles: ['super_admin', 'admin'],
      subItems: [
        { label: 'General', path: '/settings', icon: '⚙️' },
        { label: 'System', path: '/settings/system', icon: '🔧' },
        { label: 'Backup & Restore', path: '/settings/backup', icon: '💾' },
        { label: 'Audit Logs', path: '/settings/audit-logs', icon: '📜' },
      ]
    },
  ];

  // Filter menu items based on user role and permissions
  const filteredMenuItems = menuItems.filter(item => {
    // Check role access
    if (item.roles && !item.roles.includes(user?.role)) {
      return false;
    }
    // Check permission access
    if (item.permissions) {
      const hasPerm = item.permissions.some(perm => hasPermission(perm));
      if (!hasPerm) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        menuItems={filteredMenuItems}
      />
      
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="py-6 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-6">
          <Outlet />
        </main>
        
        {/* Mobile Navigation - Only visible on mobile */}
        <MobileNav menuItems={filteredMenuItems} />
      </div>
    </div>
  );
};

export default AppLayout;