// client/src/routes/AppRoutes.jsx

// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from '../context/AuthContext';
// import { ToastProvider } from '../context/ToastContext';
// import PrivateRoute from './PrivateRoute';
// import RoleBasedRoute from './RoleBasedRoute';
// import AppLayout from '../components/layout/AppLayout';

// // ==================== PUBLIC PAGES ====================
// import Home from '../pages/public/Home';

// // ==================== AUTH PAGES ====================
// import Login from '../pages/auth/Login';
// import Register from '../pages/auth/Register';
// import ForgotPassword from '../pages/auth/ForgotPassword';
// import ResetPassword from '../pages/auth/ResetPassword';
// import VerifyEmail from '../pages/auth/VerifyEmail';
// import Unauthorized from '../pages/error/Unauthorized';

// // ==================== TEST ROUTES ====================
// import TestRegister from '../pages/auth/TestRegister';
// import TestLogin from '../pages/auth/TestLogin';
// import TestDashboard from '../pages/TestDashboard';

// // ==================== DASHBOARD PAGES ====================
// import SuperAdminDashboard from '../pages/dashboard/SuperAdminDashboard';
// import AdminDashboard from '../pages/dashboard/AdminDashboard';
// import ManagerDashboard from '../pages/dashboard/ManagerDashboard';
// import HRDashboard from '../pages/dashboard/HRDashboard';
// import SupervisorDashboard from '../pages/dashboard/SupervisorDashboard';
// import TechnicianDashboard from '../pages/dashboard/TechnicianDashboard';
// import CustomerDashboard from '../pages/dashboard/CustomerDashboard';

// // ==================== USER MANAGEMENT ====================
// import UserList from '../pages/users/UserList';
// import UserForm from '../pages/users/UserForm';
// import UserDetails from '../pages/users/UserDetails';
// import RoleManagement from '../pages/users/RoleManagement';
// import PermissionManager from '../pages/users/PermissionManager';
// import EmployeeOnboarding from '../pages/users/EmployeeOnboarding';

// // ==================== BUILDING MANAGEMENT ====================
// import BuildingList from '../pages/buildings/BuildingList';
// import BuildingForm from '../pages/buildings/BuildingForm';
// import BuildingDetails from '../pages/buildings/BuildingDetails';
// import BuildingHierarchy from '../pages/buildings/BuildingHierarchy';
// import UnitManagement from '../pages/buildings/UnitManagement';
// import UnitForm from '../pages/buildings/UnitForm';
// import UnitDetails from '../pages/buildings/UnitDetails';
// import BulkUnitImport from '../pages/buildings/BulkUnitImport';
// import FloorManagement from '../pages/buildings/FloorManagement';

// // ==================== COMPLAINT MANAGEMENT ====================
// import ComplaintList from '../pages/complaints/ComplaintList';
// import ComplaintForm from '../pages/complaints/ComplaintForm';
// import ComplaintDetails from '../pages/complaints/ComplaintDetails';

// // ==================== TASK MANAGEMENT ====================
// import TaskList from '../pages/tasks/TaskList';
// import TaskBoard from '../pages/tasks/TaskBoard';
// import TaskDetails from '../pages/tasks/TaskDetails';
// import TaskForm from '../pages/tasks/TaskForm';
// import TaskAssignment from '../pages/tasks/TaskAssignment';
// import TaskCalendar from '../pages/tasks/TaskCalendar';
// import TaskProgress from '../pages/tasks/TaskProgress';
// import TaskVerification from '../pages/tasks/TaskVerification';

// // ==================== 🔴 ATTENDANCE MANAGEMENT ====================
// import MyAttendance from '../pages/attendance/MyAttendance';
// import TeamAttendance from '../pages/attendance/TeamAttendance';
// import CheckInOut from '../pages/attendance/CheckInOut';
// import AttendanceReport from '../pages/attendance/AttendanceReport';

// // ==================== 🔴 LEAVE MANAGEMENT ====================
// import MyLeave from '../pages/leave/MyLeave';
// import LeaveCalendar from '../pages/leave/LeaveCalendar';
// import PendingApprovals from '../pages/leave/PendingApprovals';
// import LeaveBalance from '../pages/leave/LeaveBalance';
// import LeaveRequestForm from '../pages/leave/LeaveRequestForm';

// // ==================== 🔴 PAYROLL MANAGEMENT ====================
// import MySalary from '../pages/salary/MySalary';
// import SalarySlip from '../pages/salary/SalarySlip';
// import SalaryStructure from '../pages/salary/SalaryStructure';
// import PayrollDashboard from '../pages/salary/PayrollDashboard';
// import PayrollProcessor from '../pages/salary/PayrollProcessor';
// import PayrollReports from '../pages/salary/PayrollReports';

// // ==================== 🔴 REPORTS ====================
// import ReportsDashboard from '../pages/reports/ReportsDashboard';
// import ReportBuilder from '../pages/reports/ReportBuilder';
// import AnalyticsDashboard from '../pages/reports/AnalyticsDashboard';

// // ==================== 🔴 SETTINGS ====================
// import GeneralSettings from '../pages/settings/GeneralSettings';
// import SystemSettings from '../pages/settings/SystemSettings';
// import BackupRestore from '../pages/settings/BackupRestore';
// import AuditLogs from '../pages/settings/AuditLogs';

// // ==================== 🔴 NOTIFICATIONS ====================
// import NotificationList from '../pages/notifications/NotificationList';
// import NotificationPreferences from '../pages/notifications/NotificationPreferences';

// // ==================== TRACKING ====================
// import LiveTracking from '../pages/tracking/LiveTracking';
// import RouteHistory from '../pages/tracking/RouteHistory';
// import GeofenceManager from '../pages/tracking/GeofenceManager';

// // ==================== SLA ====================
// import SLADashboard from '../pages/sla/SLADashboard';
// import BreachedTasks from '../pages/sla/BreachedTasks';
// import AtRiskTasks from '../pages/sla/AtRiskTasks';

// // ==================== PROFILE ====================
// import Profile from '../pages/profile/Profile';
// import ChangePassword from '../pages/profile/ChangePassword';
// import Settings from '../pages/profile/Settings';

// // ==================== ERROR PAGES ====================
// import NotFound from '../pages/error/NotFound';
// import AccountSuspended from '../pages/error/AccountSuspended';

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//       <ToastProvider>
//         <AuthProvider>
//           <Routes>
//             {/* ==================== PUBLIC ROUTES ==================== */}
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/reset-password" element={<ResetPassword />} />
//             <Route path="/verify-email" element={<VerifyEmail />} />
//             <Route path="/unauthorized" element={<Unauthorized />} />
//             <Route path="/account-suspended" element={<AccountSuspended />} />
            
//             {/* ==================== TEST ROUTES ==================== */}
//             <Route path="/test-register" element={<TestRegister />} />
//             <Route path="/test-login" element={<TestLogin />} />
//             <Route path="/test-dashboard" element={<TestDashboard />} />
            
//             {/* ==================== PROTECTED ROUTES ==================== */}
//             <Route element={<PrivateRoute />}>
//               <Route element={<AppLayout />}>
                
//                 {/* ==================== DASHBOARD ==================== */}
//                 <Route path="/dashboard" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer']}>
//                     <SuperAdminDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/super-admin" element={
//                   <RoleBasedRoute roles={['super_admin']}>
//                     <SuperAdminDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/admin" element={
//                   <RoleBasedRoute roles={['admin', 'super_admin']}>
//                     <AdminDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/manager" element={
//                   <RoleBasedRoute roles={['manager', 'admin', 'super_admin']}>
//                     <ManagerDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/supervisor" element={
//                   <RoleBasedRoute roles={['supervisor', 'manager', 'admin', 'super_admin']}>
//                     <SupervisorDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/hr" element={
//                   <RoleBasedRoute roles={['hr', 'super_admin']}>
//                     <HRDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/technician" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'super_admin']}>
//                     <TechnicianDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/customer" element={
//                   <RoleBasedRoute roles={['customer']}>
//                     <CustomerDashboard />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== USERS ==================== */}
//                 <Route path="/users" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.read']}>
//                     <UserList />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/users/new" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.create']}>
//                     <UserForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/users/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.read']}>
//                     <UserDetails />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/users/:id/edit" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.update']}>
//                     <UserForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/employee/onboarding" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']}>
//                     <EmployeeOnboarding />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== ROLES ==================== */}
//                 <Route path="/roles" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <RoleManagement />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/permissions" element={
//                   <RoleBasedRoute roles={['super_admin']}>
//                     <PermissionManager />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== BUILDINGS ==================== */}
//                 <Route path="/buildings" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <BuildingList />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/new" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <BuildingForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <BuildingDetails />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/edit" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <BuildingForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/hierarchy" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <BuildingHierarchy />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/floors" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <FloorManagement />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/units" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <UnitManagement />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/bulk-import" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <BulkUnitImport />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/units/new/:buildingId" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <UnitForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/units/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <UnitDetails />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/units/:id/edit" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <UnitForm />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== COMPLAINTS ==================== */}
//                 <Route path="/complaints" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer']}>
//                     <ComplaintList />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/complaints/new" element={
//                   <RoleBasedRoute roles={['customer', 'admin']}>
//                     <ComplaintForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/complaints/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer']}>
//                     <ComplaintDetails />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== TASKS ==================== */}
//                 <Route path="/tasks" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician']}>
//                     <TaskList />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/board" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
//                     <TaskBoard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/calendar" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician']}>
//                     <TaskCalendar />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/new" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']} permissions={['task.create']}>
//                     <TaskForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician']}>
//                     <TaskDetails />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id/edit" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']} permissions={['task.update']}>
//                     <TaskForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id/assign" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']} permissions={['task.assign']}>
//                     <TaskAssignment />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id/progress" element={
//                   <RoleBasedRoute roles={['technician']}>
//                     <TaskProgress />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id/verify" element={
//                   <RoleBasedRoute roles={['supervisor', 'manager', 'admin']}>
//                     <TaskVerification />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== 🔴 ATTENDANCE ==================== */}
//                 <Route path="/attendance/my" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <MyAttendance />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/attendance/team" element={
//                   <RoleBasedRoute roles={['manager', 'supervisor']}>
//                     <TeamAttendance />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/attendance/check-in-out" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager']}>
//                     <CheckInOut />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/attendance/report" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <AttendanceReport />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== 🔴 LEAVE ==================== */}
//                 <Route path="/leave/my" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <MyLeave />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/leave/calendar" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <LeaveCalendar />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/leave/pending" element={
//                   <RoleBasedRoute roles={['supervisor', 'manager', 'hr', 'admin', 'super_admin']}>
//                     <PendingApprovals />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/leave/balance" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <LeaveBalance />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/leave/apply" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <LeaveRequestForm />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== 🔴 SALARY / PAYROLL ==================== */}
//                 <Route path="/salary/my" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager']}>
//                     <MySalary />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/salary/slip/:id" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr']}>
//                     <SalarySlip />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/salary/structure" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <SalaryStructure />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/payroll/dashboard" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <PayrollDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/payroll/process" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <PayrollProcessor />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/payroll/reports" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <PayrollReports />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== 🔴 REPORTS ==================== */}
//                 <Route path="/reports" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'hr']}>
//                     <ReportsDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/reports/builder" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <ReportBuilder />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/reports/analytics" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <AnalyticsDashboard />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== 🔴 SETTINGS ==================== */}
//                 <Route path="/settings/general" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <GeneralSettings />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/system" element={
//                   <RoleBasedRoute roles={['super_admin']}>
//                     <SystemSettings />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/backup" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <BackupRestore />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/audit-logs" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <AuditLogs />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== 🔴 NOTIFICATIONS ==================== */}
//                 <Route path="/notifications" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'hr']}>
//                     <NotificationList />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/notifications/preferences" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'hr']}>
//                     <NotificationPreferences />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== TRACKING ==================== */}
//                 <Route path="/tracking/live" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
//                     <LiveTracking />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tracking/history/:technicianId" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
//                     <RouteHistory />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/geofences" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <GeofenceManager />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== SLA ==================== */}
//                 <Route path="/sla/dashboard" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <SLADashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/sla/breached" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <BreachedTasks />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/sla/at-risk" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <AtRiskTasks />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== PROFILE ==================== */}
//                 <Route path="/profile" element={<Profile />} />
//                 <Route path="/change-password" element={<ChangePassword />} />
//                 <Route path="/profile/settings" element={<Settings />} />
                
//                 {/* ==================== 404 NOT FOUND ==================== */}
//                 <Route path="*" element={<NotFound />} />
                
//               </Route>
//             </Route>
//           </Routes>
//         </AuthProvider>
//       </ToastProvider>
//     </BrowserRouter>
//   );
// };

// export default AppRoutes;





// // client/src/routes/AppRoutes.jsx
// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from '../context/AuthContext';
// import { ToastProvider } from '../context/ToastContext';
// import PrivateRoute from './PrivateRoute';
// import RoleBasedRoute from './RoleBasedRoute';
// import AppLayout from '../components/layout/AppLayout';

// // ==================== PUBLIC PAGES ====================
// import Home from '../pages/public/Home';

// // ==================== AUTH PAGES ====================
// import Login from '../pages/auth/Login';
// import Register from '../pages/auth/Register';
// import ForgotPassword from '../pages/auth/ForgotPassword';
// import ResetPassword from '../pages/auth/ResetPassword';
// import VerifyEmail from '../pages/auth/VerifyEmail';
// import Unauthorized from '../pages/error/Unauthorized';

// // ==================== TEST ROUTES ====================
// import TestRegister from '../pages/auth/TestRegister';
// import TestLogin from '../pages/auth/TestLogin';
// import TestDashboard from '../pages/TestDashboard';

// // ==================== DASHBOARD PAGES ====================
// import SuperAdminDashboard from '../pages/dashboard/SuperAdminDashboard';
// import AdminDashboard from '../pages/dashboard/AdminDashboard';
// import ManagerDashboard from '../pages/dashboard/ManagerDashboard';
// import HRDashboard from '../pages/dashboard/HRDashboard';
// import SupervisorDashboard from '../pages/dashboard/SupervisorDashboard';
// import TechnicianDashboard from '../pages/dashboard/TechnicianDashboard';
// import CustomerDashboard from '../pages/dashboard/CustomerDashboard';

// // ==================== USER MANAGEMENT ====================
// import UserList from '../pages/users/UserList';
// import UserForm from '../pages/users/UserForm';
// import UserDetails from '../pages/users/UserDetails';
// import RoleManagement from '../pages/users/RoleManagement';
// import PermissionManager from '../pages/users/PermissionManager';
// import EmployeeOnboarding from '../pages/users/EmployeeOnboarding';

// // ==================== BUILDING MANAGEMENT ====================
// import BuildingList from '../pages/buildings/BuildingList';
// import BuildingForm from '../pages/buildings/BuildingForm';
// import BuildingDetails from '../pages/buildings/BuildingDetails';
// import BuildingHierarchy from '../pages/buildings/BuildingHierarchy';
// import UnitManagement from '../pages/buildings/UnitManagement';
// import UnitForm from '../pages/buildings/UnitForm';
// import UnitDetails from '../pages/buildings/UnitDetails';
// import BulkUnitImport from '../pages/buildings/BulkUnitImport';
// import FloorManagement from '../pages/buildings/FloorManagement';

// // ==================== COMPLAINT MANAGEMENT ====================
// import ComplaintList from '../pages/complaints/ComplaintList';
// import ComplaintForm from '../pages/complaints/ComplaintForm';
// import ComplaintDetails from '../pages/complaints/ComplaintDetails';

// // ==================== TASK MANAGEMENT ====================
// import TaskList from '../pages/tasks/TaskList';
// import TaskBoard from '../pages/tasks/TaskBoard';
// import TaskDetails from '../pages/tasks/TaskDetails';
// import TaskForm from '../pages/tasks/TaskForm';
// import TaskAssignment from '../pages/tasks/TaskAssignment';
// import TaskCalendar from '../pages/tasks/TaskCalendar';
// import TaskProgress from '../pages/tasks/TaskProgress';
// import TaskVerification from '../pages/tasks/TaskVerification';

// // ==================== ATTENDANCE MANAGEMENT ====================
// import MyAttendance from '../pages/attendance/MyAttendance';
// import TeamAttendance from '../pages/attendance/TeamAttendance';
// import CheckInOut from '../pages/attendance/CheckInOut';
// import AttendanceReport from '../pages/attendance/AttendanceReport';
// import AttendanceCorrection from '../pages/attendance/AttendanceCorrection'; // 🔴 NEW
// import HolidayManagement from '../pages/attendance/HolidayManagement'; // 🔴 NEW

// // ==================== LEAVE MANAGEMENT ====================
// import MyLeave from '../pages/leave/MyLeave';
// import LeaveCalendar from '../pages/leave/LeaveCalendar';
// import PendingApprovals from '../pages/leave/PendingApprovals';
// import LeaveBalance from '../pages/leave/LeaveBalance';
// import LeaveRequestForm from '../pages/leave/LeaveRequestForm';
// import LeaveHistory from '../pages/leave/LeaveHistory'; // 🔴 NEW

// // ==================== PAYROLL MANAGEMENT ====================
// import MySalary from '../pages/salary/MySalary';
// import SalarySlip from '../pages/salary/SalarySlip';
// import SalaryStructure from '../pages/salary/SalaryStructure';
// import PayrollDashboard from '../pages/salary/PayrollDashboard';
// import PayrollProcessor from '../pages/salary/PayrollProcessor';
// import PayrollReports from '../pages/salary/PayrollReports';
// import PayrollSettings from '../pages/salary/PayrollSettings'; // 🔴 NEW

// // ==================== REPORTS ====================
// import ReportsDashboard from '../pages/reports/ReportsDashboard';
// import ReportBuilder from '../pages/reports/ReportBuilder';
// import AnalyticsDashboard from '../pages/reports/AnalyticsDashboard';
// import TaskReports from '../pages/reports/TaskReports'; // 🔴 NEW
// import AttendanceReports from '../pages/reports/AttendanceReports'; // 🔴 NEW
// import FinancialReports from '../pages/reports/FinancialReports'; // 🔴 NEW

// // ==================== SETTINGS ====================
// import GeneralSettings from '../pages/settings/GeneralSettings';
// import SystemSettings from '../pages/settings/SystemSettings';
// import BackupRestore from '../pages/settings/BackupRestore';
// import AuditLogs from '../pages/settings/AuditLogs';
// import EmailSettings from '../pages/settings/EmailSettings'; // 🔴 NEW
// import NotificationSettings from '../pages/settings/NotificationSettings'; // 🔴 NEW
// import IntegrationSettings from '../pages/settings/IntegrationSettings'; // 🔴 NEW
// import ThemeSettings from '../pages/settings/ThemeSettings'; // 🔴 NEW

// // ==================== NOTIFICATIONS ====================
// // Notification Pages
// import NotificationList from '../pages/notifications/NotificationList';
// import NotificationManagement from '../pages/notifications/NotificationManagement';
// import NotificationPreferences from '../pages/notifications/NotificationPreferences';

// // import NotificationList from '../pages/notifications/NotificationList';
// // import NotificationPreferences from '../pages/notifications/NotificationPreferences';

// // ==================== TRACKING ====================
// import LiveTracking from '../pages/tracking/LiveTracking';
// import RouteHistory from '../pages/tracking/RouteHistory';
// import GeofenceManager from '../pages/tracking/GeofenceManager';

// // ==================== SLA ====================
// import SLADashboard from '../pages/sla/SLADashboard';
// import BreachedTasks from '../pages/sla/BreachedTasks';
// import AtRiskTasks from '../pages/sla/AtRiskTasks';
// import SLAHistory from '../pages/sla/SLAHistory'; // 🔴 NEW
// import SLAReport from '../pages/sla/SLAReport'; // 🔴 NEW

// // ==================== PROFILE ====================
// import Profile from '../pages/profile/Profile';
// import ChangePassword from '../pages/profile/ChangePassword';
// import Settings from '../pages/profile/Settings';
// import MyDocuments from '../pages/profile/MyDocuments'; // 🔴 NEW

// // ==================== ERROR PAGES ====================
// import NotFound from '../pages/error/NotFound';
// import AccountSuspended from '../pages/error/AccountSuspended';
// import MaintenanceMode from '../pages/error/MaintenanceMode'; // 🔴 NEW

// // ==================== CUSTOMER PORTAL ====================
// import MyProperties from '../pages/customer/MyProperties'; // 🔴 NEW
// import ServiceRequests from '../pages/customer/ServiceRequests'; // 🔴 NEW
// import PaymentHistory from '../pages/customer/PaymentHistory'; // 🔴 NEW
// import VisitorPass from '../pages/customer/VisitorPass'; // 🔴 NEW

// //=========================Chat==========================
// import ChatModule from '../pages/chat/ChatModule';
// import GroupChats from '../pages/chat/GroupChats';
// import ChatSettings from '../pages/chat/ChatSettings';
// import AdminChatManagement from '../pages/admin/AdminChatManagement';

// //=============================================================

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//       <ToastProvider>
//         <AuthProvider>
//           <Routes>
//             {/* ==================== PUBLIC ROUTES ==================== */}
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/reset-password" element={<ResetPassword />} />
//             <Route path="/verify-email" element={<VerifyEmail />} />
//             <Route path="/unauthorized" element={<Unauthorized />} />
//             <Route path="/account-suspended" element={<AccountSuspended />} />
//             <Route path="/maintenance" element={<MaintenanceMode />} />
            
//             {/* ==================== TEST ROUTES ==================== */}
//             <Route path="/test-register" element={<TestRegister />} />
//             <Route path="/test-login" element={<TestLogin />} />
//             <Route path="/test-dashboard" element={<TestDashboard />} />
            
//             {/* ==================== PROTECTED ROUTES ==================== */}
//             <Route element={<PrivateRoute />}>
//               <Route element={<AppLayout />}>
                
//                 {/* ==================== DASHBOARD ==================== */}
//                 <Route path="/dashboard" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer']}>
//                     <SuperAdminDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/super-admin" element={
//                   <RoleBasedRoute roles={['super_admin']}>
//                     <SuperAdminDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/admin" element={
//                   <RoleBasedRoute roles={['admin', 'super_admin']}>
//                     <AdminDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/manager" element={
//                   <RoleBasedRoute roles={['manager', 'admin', 'super_admin']}>
//                     <ManagerDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/supervisor" element={
//                   <RoleBasedRoute roles={['supervisor', 'manager', 'admin', 'super_admin']}>
//                     <SupervisorDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/hr" element={
//                   <RoleBasedRoute roles={['hr', 'super_admin']}>
//                     <HRDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/technician" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'super_admin']}>
//                     <TechnicianDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/customer" element={
//                   <RoleBasedRoute roles={['customer']}>
//                     <CustomerDashboard />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== USERS ==================== */}
//                 <Route path="/users" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.read']}>
//                     <UserList />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/users/new" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.create']}>
//                     <UserForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/users/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.read']}>
//                     <UserDetails />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/users/:id/edit" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.update']}>
//                     <UserForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/employee/onboarding" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']}>
//                     <EmployeeOnboarding />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== ROLES ==================== */}
//                 <Route path="/roles" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <RoleManagement />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/permissions" element={
//                   <RoleBasedRoute roles={['super_admin']}>
//                     <PermissionManager />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== BUILDINGS ==================== */}
//                 <Route path="/buildings" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <BuildingList />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/new" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <BuildingForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <BuildingDetails />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/edit" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <BuildingForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/hierarchy" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <BuildingHierarchy />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/floors" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <FloorManagement />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/units" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <UnitManagement />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/bulk-import" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <BulkUnitImport />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/units/new/:buildingId" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <UnitForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/units/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <UnitDetails />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/units/:id/edit" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <UnitForm />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== COMPLAINTS ==================== */}
//                 <Route path="/complaints" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer']}>
//                     <ComplaintList />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/complaints/new" element={
//                   <RoleBasedRoute roles={['customer', 'admin']}>
//                     <ComplaintForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/complaints/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer']}>
//                     <ComplaintDetails />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== TASKS ==================== */}
//                 <Route path="/tasks" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician']}>
//                     <TaskList />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/board" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
//                     <TaskBoard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/calendar" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician']}>
//                     <TaskCalendar />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/new" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']} permissions={['task.create']}>
//                     <TaskForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician']}>
//                     <TaskDetails />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id/edit" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']} permissions={['task.update']}>
//                     <TaskForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id/assign" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']} permissions={['task.assign']}>
//                     <TaskAssignment />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id/progress" element={
//                   <RoleBasedRoute roles={['technician']}>
//                     <TaskProgress />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id/verify" element={
//                   <RoleBasedRoute roles={['supervisor', 'manager', 'admin']}>
//                     <TaskVerification />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== ATTENDANCE ==================== */}
//                 <Route path="/attendance/my" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <MyAttendance />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/attendance/team" element={
//                   <RoleBasedRoute roles={['manager', 'supervisor']}>
//                     <TeamAttendance />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/attendance/check-in-out" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager']}>
//                     <CheckInOut />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/attendance/report" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <AttendanceReport />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/attendance/correction" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr']}>
//                     <AttendanceCorrection />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/attendance/holidays" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <HolidayManagement />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== LEAVE ==================== */}
//                 <Route path="/leave/my" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <MyLeave />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/leave/calendar" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <LeaveCalendar />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/leave/pending" element={
//                   <RoleBasedRoute roles={['supervisor', 'manager', 'hr', 'admin', 'super_admin']}>
//                     <PendingApprovals />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/leave/balance" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <LeaveBalance />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/leave/apply" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <LeaveRequestForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/leave/history" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <LeaveHistory />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== SALARY / PAYROLL ==================== */}
//                 <Route path="/salary/my" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager']}>
//                     <MySalary />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/salary/slip/:id" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr']}>
//                     <SalarySlip />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/salary/structure" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <SalaryStructure />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/payroll/dashboard" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <PayrollDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/payroll/process" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <PayrollProcessor />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/payroll/reports" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <PayrollReports />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/payroll/settings" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <PayrollSettings />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== REPORTS ==================== */}
//                 <Route path="/reports" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'hr']}>
//                     <ReportsDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/reports/builder" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <ReportBuilder />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/reports/analytics" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <AnalyticsDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/reports/tasks" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <TaskReports />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/reports/attendance" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'hr']}>
//                     <AttendanceReports />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/reports/financial" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'accountant']}>
//                     <FinancialReports />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== SETTINGS ==================== */}
//                 <Route path="/settings/general" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <GeneralSettings />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/system" element={
//                   <RoleBasedRoute roles={['super_admin']}>
//                     <SystemSettings />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/backup" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <BackupRestore />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/audit-logs" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <AuditLogs />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/email" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <EmailSettings />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/notifications" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <NotificationSettings />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/integrations" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <IntegrationSettings />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/theme" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <ThemeSettings />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== NOTIFICATIONS ==================== */}
//                 <Route path="/notifications" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'hr']}>
//                     <NotificationList />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/notifications/preferences" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'hr']}>
//                     <NotificationPreferences />
//                   </RoleBasedRoute>
//                 } />

//                       {/* ==================== NOTIFICATION ROUTES ==================== */}
          
// 		          {/* User Notifications - All authenticated users */}
// 		          <Route path="/notifications" element={<NotificationList />} />
// 		          <Route path="/notifications/preferences" element={<NotificationPreferences />} />
		          
// 		          {/* Admin Notification Management - Super Admin, Admin, HR only */}
// 		          <Route path="/notifications/manage" element={
// 		            <RoleBasedRoute allowedRoles={['super_admin', 'admin', 'hr']}>
// 		              <NotificationManagement />
// 		            </RoleBasedRoute>
// 		          } />
		          
// 		          {/* Send Notification - Super Admin, Admin, HR, Manager, Supervisor */}
// 		          <Route path="/notifications/send" element={
// 		            <RoleBasedRoute allowedRoles={['super_admin', 'admin', 'hr', 'manager', 'supervisor']}>
// 		              <NotificationManagement />
// 		            </RoleBasedRoute>
// 		          } />
//                 {/*=================================================================*/}
                
//                 {/* ==================== TRACKING ==================== */}
//                 <Route path="/tracking/live" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
//                     <LiveTracking />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tracking/history/:technicianId" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
//                     <RouteHistory />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/geofences" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <GeofenceManager />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== SLA ==================== */}
//                 <Route path="/sla/dashboard" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <SLADashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/sla/breached" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <BreachedTasks />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/sla/at-risk" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <AtRiskTasks />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/sla/history" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <SLAHistory />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/sla/report" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <SLAReport />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== PROFILE ==================== */}
//                 <Route path="/profile" element={<Profile />} />
//                 <Route path="/change-password" element={<ChangePassword />} />
//                 <Route path="/profile/settings" element={<Settings />} />
//                 <Route path="/profile/documents" element={<MyDocuments />} />


// 				{/* ==================== CHAT MODULE ==================== */}
// 				<Route path="/chat" element={
// 				  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer', 'hr']}>
// 				    <ChatModule />
// 				  </RoleBasedRoute>
// 				} />
// 				<Route path="/chat/groups" element={
// 				  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
// 				    <GroupChats />
// 				  </RoleBasedRoute>
// 				} />
// 				<Route path="/chat/settings" element={
// 				  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer', 'hr']}>
// 				    <ChatSettings />
// 				  </RoleBasedRoute>
// 				} />
// 				<Route path="/admin/chat" element={
// 				  <RoleBasedRoute roles={['super_admin', 'admin']}>
// 				    <AdminChatManagement />
// 				  </RoleBasedRoute>
// 				} />
                
//                 {/* ==================== CUSTOMER PORTAL ==================== */}
//                 <Route path="/my-properties" element={
//                   <RoleBasedRoute roles={['customer']}>
//                     <MyProperties />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/service-requests" element={
//                   <RoleBasedRoute roles={['customer']}>
//                     <ServiceRequests />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/payment-history" element={
//                   <RoleBasedRoute roles={['customer']}>
//                     <PaymentHistory />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/visitor-pass" element={
//                   <RoleBasedRoute roles={['customer']}>
//                     <VisitorPass />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== 404 NOT FOUND ==================== */}
//                 <Route path="*" element={<NotFound />} />
                
//               </Route>
//             </Route>
//           </Routes>
//         </AuthProvider>
//       </ToastProvider>
//     </BrowserRouter>
//   );
// };

// export default AppRoutes;




// // client/src/routes/AppRoutes.jsx
// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from '../context/AuthContext';
// import { ToastProvider } from '../context/ToastContext';
// import PrivateRoute from './PrivateRoute';
// import RoleBasedRoute from './RoleBasedRoute';
// import AppLayout from '../components/layout/AppLayout';

// // ==================== PUBLIC PAGES ====================
// import Home from '../pages/public/Home';

// // ==================== AUTH PAGES ====================
// import Login from '../pages/auth/Login';
// import Register from '../pages/auth/Register';
// import ForgotPassword from '../pages/auth/ForgotPassword';
// import ResetPassword from '../pages/auth/ResetPassword';
// import VerifyEmail from '../pages/auth/VerifyEmail';
// import Unauthorized from '../pages/error/Unauthorized';

// // ==================== TEST ROUTES ====================
// import TestRegister from '../pages/auth/TestRegister';
// import TestLogin from '../pages/auth/TestLogin';
// import TestDashboard from '../pages/TestDashboard';

// // ==================== DASHBOARD PAGES ====================
// import SuperAdminDashboard from '../pages/dashboard/SuperAdminDashboard';
// import AdminDashboard from '../pages/dashboard/AdminDashboard';
// import ManagerDashboard from '../pages/dashboard/ManagerDashboard';
// import HRDashboard from '../pages/dashboard/HRDashboard';
// import SupervisorDashboard from '../pages/dashboard/SupervisorDashboard';
// import TechnicianDashboard from '../pages/dashboard/TechnicianDashboard';
// import CustomerDashboard from '../pages/dashboard/CustomerDashboard';

// // ==================== USER MANAGEMENT ====================
// import UserList from '../pages/users/UserList';
// import UserForm from '../pages/users/UserForm';
// import UserDetails from '../pages/users/UserDetails';
// import RoleManagement from '../pages/users/RoleManagement';
// import PermissionManager from '../pages/users/PermissionManager';
// import EmployeeOnboarding from '../pages/users/EmployeeOnboarding';

// // ==================== BUILDING MANAGEMENT ====================
// import BuildingList from '../pages/buildings/BuildingList';
// import BuildingForm from '../pages/buildings/BuildingForm';
// import BuildingDetails from '../pages/buildings/BuildingDetails';
// import BuildingHierarchy from '../pages/buildings/BuildingHierarchy';
// import UnitManagement from '../pages/buildings/UnitManagement';
// import UnitForm from '../pages/buildings/UnitForm';
// import UnitDetails from '../pages/buildings/UnitDetails';
// import BulkUnitImport from '../pages/buildings/BulkUnitImport';
// import FloorManagement from '../pages/buildings/FloorManagement';

// // ==================== COMPLAINT MANAGEMENT ====================
// import ComplaintList from '../pages/complaints/ComplaintList';
// import ComplaintForm from '../pages/complaints/ComplaintForm';
// import ComplaintDetails from '../pages/complaints/ComplaintDetails';

// // ==================== TASK MANAGEMENT ====================
// import TaskList from '../pages/tasks/TaskList';
// import TaskBoard from '../pages/tasks/TaskBoard';
// import TaskDetails from '../pages/tasks/TaskDetails';
// import TaskForm from '../pages/tasks/TaskForm';
// import TaskAssignment from '../pages/tasks/TaskAssignment';
// import TaskCalendar from '../pages/tasks/TaskCalendar';
// import TaskProgress from '../pages/tasks/TaskProgress';
// import TaskVerification from '../pages/tasks/TaskVerification';

// // ==================== ATTENDANCE MANAGEMENT ====================
// import MyAttendance from '../pages/attendance/MyAttendance';
// import TeamAttendance from '../pages/attendance/TeamAttendance';
// import CheckInOut from '../pages/attendance/CheckInOut';
// import AttendanceReport from '../pages/attendance/AttendanceReport';
// import AttendanceCorrection from '../pages/attendance/AttendanceCorrection';
// import HolidayManagement from '../pages/attendance/HolidayManagement';

// // ==================== LEAVE MANAGEMENT ====================
// import MyLeave from '../pages/leave/MyLeave';
// import LeaveCalendar from '../pages/leave/LeaveCalendar';
// import PendingApprovals from '../pages/leave/PendingApprovals';
// import LeaveBalance from '../pages/leave/LeaveBalance';
// import LeaveRequestForm from '../pages/leave/LeaveRequestForm';
// import LeaveHistory from '../pages/leave/LeaveHistory';

// // ==================== PAYROLL MANAGEMENT ====================
// import MySalary from '../pages/salary/MySalary';
// import SalarySlip from '../pages/salary/SalarySlip';
// import SalaryStructure from '../pages/salary/SalaryStructure';
// import PayrollDashboard from '../pages/salary/PayrollDashboard';
// import PayrollProcessor from '../pages/salary/PayrollProcessor';
// import PayrollReports from '../pages/salary/PayrollReports';
// import PayrollSettings from '../pages/salary/PayrollSettings';

// // ==================== REPORTS ====================
// import ReportsDashboard from '../pages/reports/ReportsDashboard';
// import ReportBuilder from '../pages/reports/ReportBuilder';
// import AnalyticsDashboard from '../pages/reports/AnalyticsDashboard';
// import TaskReports from '../pages/reports/TaskReports';
// import AttendanceReports from '../pages/reports/AttendanceReports';
// import FinancialReports from '../pages/reports/FinancialReports';

// // ==================== SETTINGS ====================
// import GeneralSettings from '../pages/settings/GeneralSettings';
// import SystemSettings from '../pages/settings/SystemSettings';
// import BackupRestore from '../pages/settings/BackupRestore';
// import AuditLogs from '../pages/settings/AuditLogs';
// import EmailSettings from '../pages/settings/EmailSettings';
// import NotificationSettings from '../pages/settings/NotificationSettings';
// import IntegrationSettings from '../pages/settings/IntegrationSettings';
// import ThemeSettings from '../pages/settings/ThemeSettings';

// // ==================== NOTIFICATIONS ====================
// import NotificationList from '../pages/notifications/NotificationList';
// import NotificationManagement from '../pages/notifications/NotificationManagement';
// import NotificationPreferences from '../pages/notifications/NotificationPreferences';

// // ==================== TRACKING ====================
// import LiveTracking from '../pages/tracking/LiveTracking';
// import RouteHistory from '../pages/tracking/RouteHistory';
// import GeofenceManager from '../pages/tracking/GeofenceManager';

// // ==================== SLA ====================
// import SLADashboard from '../pages/sla/SLADashboard';
// import BreachedTasks from '../pages/sla/BreachedTasks';
// import AtRiskTasks from '../pages/sla/AtRiskTasks';
// import SLAHistory from '../pages/sla/SLAHistory';
// import SLAReport from '../pages/sla/SLAReport';

// // ==================== PROFILE ====================
// import Profile from '../pages/profile/Profile';
// import ChangePassword from '../pages/profile/ChangePassword';
// import Settings from '../pages/profile/Settings';
// import MyDocuments from '../pages/profile/MyDocuments';

// // ==================== ERROR PAGES ====================
// import NotFound from '../pages/error/NotFound';
// import AccountSuspended from '../pages/error/AccountSuspended';
// import MaintenanceMode from '../pages/error/MaintenanceMode';

// // ==================== CUSTOMER PORTAL ====================
// import MyProperties from '../pages/customer/MyProperties';
// import ServiceRequests from '../pages/customer/ServiceRequests';
// import PaymentHistory from '../pages/customer/PaymentHistory';
// import VisitorPass from '../pages/customer/VisitorPass';

// // ==================== CHAT MODULE ====================
// import ChatModule from '../pages/chat/ChatModule';
// import GroupChats from '../pages/chat/GroupChats';
// import ChatSettings from '../pages/chat/ChatSettings';
// import AdminChatManagement from '../pages/admin/AdminChatManagement';

// // =============================================================

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//       <ToastProvider>
//         <AuthProvider>
//           <Routes>
//             {/* ==================== PUBLIC ROUTES ==================== */}
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/reset-password" element={<ResetPassword />} />
//             <Route path="/verify-email" element={<VerifyEmail />} />
//             <Route path="/unauthorized" element={<Unauthorized />} />
//             <Route path="/account-suspended" element={<AccountSuspended />} />
//             <Route path="/maintenance" element={<MaintenanceMode />} />
            
//             {/* ==================== TEST ROUTES ==================== */}
//             <Route path="/test-register" element={<TestRegister />} />
//             <Route path="/test-login" element={<TestLogin />} />
//             <Route path="/test-dashboard" element={<TestDashboard />} />
            
//             {/* ==================== PROTECTED ROUTES ==================== */}
//             <Route element={<PrivateRoute />}>
//               <Route element={<AppLayout />}>
                
//                 {/* ==================== DASHBOARD ==================== */}
//                 <Route path="/dashboard" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer']}>
//                     <SuperAdminDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/super-admin" element={
//                   <RoleBasedRoute roles={['super_admin']}>
//                     <SuperAdminDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/admin" element={
//                   <RoleBasedRoute roles={['admin', 'super_admin']}>
//                     <AdminDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/manager" element={
//                   <RoleBasedRoute roles={['manager', 'admin', 'super_admin']}>
//                     <ManagerDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/supervisor" element={
//                   <RoleBasedRoute roles={['supervisor', 'manager', 'admin', 'super_admin']}>
//                     <SupervisorDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/hr" element={
//                   <RoleBasedRoute roles={['hr', 'super_admin']}>
//                     <HRDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/technician" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'super_admin']}>
//                     <TechnicianDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/dashboard/customer" element={
//                   <RoleBasedRoute roles={['customer']}>
//                     <CustomerDashboard />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== USERS ==================== */}
//                 <Route path="/users" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.read']}>
//                     <UserList />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/users/new" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.create']}>
//                     <UserForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/users/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.read']}>
//                     <UserDetails />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/users/:id/edit" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.update']}>
//                     <UserForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/employee/onboarding" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']}>
//                     <EmployeeOnboarding />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== ROLES ==================== */}
//                 <Route path="/roles" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <RoleManagement />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/permissions" element={
//                   <RoleBasedRoute roles={['super_admin']}>
//                     <PermissionManager />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== BUILDINGS ==================== */}
//                 <Route path="/buildings" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <BuildingList />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/new" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <BuildingForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <BuildingDetails />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/edit" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <BuildingForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/hierarchy" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <BuildingHierarchy />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/floors" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <FloorManagement />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/units" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <UnitManagement />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/buildings/:id/bulk-import" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <BulkUnitImport />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/units/new/:buildingId" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <UnitForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/units/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <UnitDetails />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/units/:id/edit" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <UnitForm />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== COMPLAINTS ==================== */}
//                 <Route path="/complaints" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer']}>
//                     <ComplaintList />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/complaints/new" element={
//                   <RoleBasedRoute roles={['customer', 'admin']}>
//                     <ComplaintForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/complaints/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer']}>
//                     <ComplaintDetails />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== TASKS ==================== */}
//                 <Route path="/tasks" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician']}>
//                     <TaskList />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/board" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
//                     <TaskBoard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/calendar" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician']}>
//                     <TaskCalendar />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/new" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']} permissions={['task.create']}>
//                     <TaskForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician']}>
//                     <TaskDetails />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id/edit" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']} permissions={['task.update']}>
//                     <TaskForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id/assign" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']} permissions={['task.assign']}>
//                     <TaskAssignment />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id/progress" element={
//                   <RoleBasedRoute roles={['technician']}>
//                     <TaskProgress />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tasks/:id/verify" element={
//                   <RoleBasedRoute roles={['supervisor', 'manager', 'admin']}>
//                     <TaskVerification />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== ATTENDANCE ==================== */}
//                 <Route path="/attendance/my" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <MyAttendance />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/attendance/team" element={
//                   <RoleBasedRoute roles={['manager', 'supervisor']}>
//                     <TeamAttendance />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/attendance/check-in-out" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager']}>
//                     <CheckInOut />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/attendance/report" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <AttendanceReport />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/attendance/correction" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr']}>
//                     <AttendanceCorrection />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/attendance/holidays" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <HolidayManagement />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== LEAVE ==================== */}
//                 <Route path="/leave/my" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <MyLeave />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/leave/calendar" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <LeaveCalendar />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/leave/pending" element={
//                   <RoleBasedRoute roles={['supervisor', 'manager', 'hr', 'admin', 'super_admin']}>
//                     <PendingApprovals />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/leave/balance" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <LeaveBalance />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/leave/apply" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <LeaveRequestForm />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/leave/history" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
//                     <LeaveHistory />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== SALARY / PAYROLL ==================== */}
//                 <Route path="/salary/my" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager']}>
//                     <MySalary />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/salary/slip/:id" element={
//                   <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr']}>
//                     <SalarySlip />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/salary/structure" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <SalaryStructure />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/payroll/dashboard" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <PayrollDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/payroll/process" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <PayrollProcessor />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/payroll/reports" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <PayrollReports />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/payroll/settings" element={
//                   <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
//                     <PayrollSettings />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== REPORTS ==================== */}
//                 <Route path="/reports" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'hr']}>
//                     <ReportsDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/reports/builder" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <ReportBuilder />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/reports/analytics" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <AnalyticsDashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/reports/tasks" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <TaskReports />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/reports/attendance" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'hr']}>
//                     <AttendanceReports />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/reports/financial" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'accountant']}>
//                     <FinancialReports />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== SETTINGS ==================== */}
//                 <Route path="/settings/general" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <GeneralSettings />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/system" element={
//                   <RoleBasedRoute roles={['super_admin']}>
//                     <SystemSettings />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/backup" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <BackupRestore />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/audit-logs" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <AuditLogs />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/email" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <EmailSettings />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/notifications" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <NotificationSettings />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/integrations" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <IntegrationSettings />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/settings/theme" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <ThemeSettings />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== NOTIFICATIONS ==================== */}
//                 {/* User Notifications - All authenticated users */}
//                 <Route path="/notifications" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'hr', 'customer']}>
//                     <NotificationList />
//                   </RoleBasedRoute>
//                 } />
                
//                 <Route path="/notifications/preferences" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'hr', 'customer']}>
//                     <NotificationPreferences />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* Admin Notification Management - Super Admin, Admin, HR only */}
//                 <Route path="/notifications/manage" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr']}>
//                     <NotificationManagement />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* Send Notification - Super Admin, Admin, HR, Manager, Supervisor */}
//                 <Route path="/notifications/send" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'hr', 'manager', 'supervisor']}>
//                     <NotificationManagement />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== TRACKING ==================== */}
//                 <Route path="/tracking/live" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
//                     <LiveTracking />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/tracking/history/:technicianId" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
//                     <RouteHistory />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/geofences" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <GeofenceManager />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== SLA ==================== */}
//                 <Route path="/sla/dashboard" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <SLADashboard />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/sla/breached" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <BreachedTasks />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/sla/at-risk" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <AtRiskTasks />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/sla/history" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <SLAHistory />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/sla/report" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
//                     <SLAReport />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== PROFILE ==================== */}
//                 <Route path="/profile" element={<Profile />} />
//                 <Route path="/change-password" element={<ChangePassword />} />
//                 <Route path="/profile/settings" element={<Settings />} />
//                 <Route path="/profile/documents" element={<MyDocuments />} />

//                 {/* ==================== CHAT MODULE ==================== */}
//                 <Route path="/chat" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer', 'hr']}>
//                     <ChatModule />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/chat/groups" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
//                     <GroupChats />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/chat/settings" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer', 'hr']}>
//                     <ChatSettings />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/admin/chat" element={
//                   <RoleBasedRoute roles={['super_admin', 'admin']}>
//                     <AdminChatManagement />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== CUSTOMER PORTAL ==================== */}
//                 <Route path="/my-properties" element={
//                   <RoleBasedRoute roles={['customer']}>
//                     <MyProperties />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/service-requests" element={
//                   <RoleBasedRoute roles={['customer']}>
//                     <ServiceRequests />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/payment-history" element={
//                   <RoleBasedRoute roles={['customer']}>
//                     <PaymentHistory />
//                   </RoleBasedRoute>
//                 } />
//                 <Route path="/visitor-pass" element={
//                   <RoleBasedRoute roles={['customer']}>
//                     <VisitorPass />
//                   </RoleBasedRoute>
//                 } />
                
//                 {/* ==================== 404 NOT FOUND ==================== */}
//                 <Route path="*" element={<NotFound />} />
                
//               </Route>
//             </Route>
//           </Routes>
//         </AuthProvider>
//       </ToastProvider>
//     </BrowserRouter>
//   );
// };

// export default AppRoutes;






// client/src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';
import AppLayout from '../components/layout/AppLayout';

// ==================== PUBLIC PAGES ====================
import Home from '../pages/public/Home';

// ==================== AUTH PAGES ====================
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';
import Unauthorized from '../pages/error/Unauthorized';

// ==================== TEST ROUTES ====================
import TestRegister from '../pages/auth/TestRegister';
import TestLogin from '../pages/auth/TestLogin';
import TestDashboard from '../pages/TestDashboard';

// ==================== DASHBOARD PAGES ====================
import SuperAdminDashboard from '../pages/dashboard/SuperAdminDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import ManagerDashboard from '../pages/dashboard/ManagerDashboard';
import HRDashboard from '../pages/dashboard/HRDashboard';
import SupervisorDashboard from '../pages/dashboard/SupervisorDashboard';
import TechnicianDashboard from '../pages/dashboard/TechnicianDashboard';
import CustomerDashboard from '../pages/dashboard/CustomerDashboard';

// ==================== USER MANAGEMENT ====================
import UserList from '../pages/users/UserList';
import UserForm from '../pages/users/UserForm';
import UserDetails from '../pages/users/UserDetails';
import RoleManagement from '../pages/users/RoleManagement';
import PermissionManager from '../pages/users/PermissionManager';
import EmployeeOnboarding from '../pages/users/EmployeeOnboarding';

// ==================== BUILDING MANAGEMENT ====================
import BuildingList from '../pages/buildings/BuildingList';
import BuildingForm from '../pages/buildings/BuildingForm';
import BuildingDetails from '../pages/buildings/BuildingDetails';
import BuildingHierarchy from '../pages/buildings/BuildingHierarchy';
import UnitManagement from '../pages/buildings/UnitManagement';
import UnitForm from '../pages/buildings/UnitForm';
import UnitDetails from '../pages/buildings/UnitDetails';
import BulkUnitImport from '../pages/buildings/BulkUnitImport';
import FloorManagement from '../pages/buildings/FloorManagement';

// ==================== COMPLAINT MANAGEMENT ====================
import ComplaintList from '../pages/complaints/ComplaintList';
import ComplaintForm from '../pages/complaints/ComplaintForm';
import ComplaintDetails from '../pages/complaints/ComplaintDetails';

// ==================== TASK MANAGEMENT ====================
import TaskList from '../pages/tasks/TaskList';
import TaskBoard from '../pages/tasks/TaskBoard';
import TaskDetails from '../pages/tasks/TaskDetails';
import TaskForm from '../pages/tasks/TaskForm';
import TaskAssignment from '../pages/tasks/TaskAssignment';
import TaskCalendar from '../pages/tasks/TaskCalendar';
import TaskProgress from '../pages/tasks/TaskProgress';
import TaskVerification from '../pages/tasks/TaskVerification';

// ==================== ATTENDANCE MANAGEMENT ====================
import MyAttendance from '../pages/attendance/MyAttendance';
import TeamAttendance from '../pages/attendance/TeamAttendance';
import CheckInOut from '../pages/attendance/CheckInOut';
import AttendanceReport from '../pages/attendance/AttendanceReport';
import AttendanceCorrection from '../pages/attendance/AttendanceCorrection';
import HolidayManagement from '../pages/attendance/HolidayManagement';

// ==================== LEAVE MANAGEMENT ====================
import MyLeave from '../pages/leave/MyLeave';
import LeaveCalendar from '../pages/leave/LeaveCalendar';
import PendingApprovals from '../pages/leave/PendingApprovals';
import LeaveBalance from '../pages/leave/LeaveBalance';
import LeaveRequestForm from '../pages/leave/LeaveRequestForm';
import LeaveHistory from '../pages/leave/LeaveHistory';

// ==================== PAYROLL MANAGEMENT ====================
import MySalary from '../pages/salary/MySalary';
import SalarySlip from '../pages/salary/SalarySlip';
import SalaryStructure from '../pages/salary/SalaryStructure';
import PayrollDashboard from '../pages/salary/PayrollDashboard';
import PayrollProcessor from '../pages/salary/PayrollProcessor';
import PayrollReports from '../pages/salary/PayrollReports';
import PayrollSettings from '../pages/salary/PayrollSettings';

// ==================== REPORTS ====================
import ReportsDashboard from '../pages/reports/ReportsDashboard';
import ReportBuilder from '../pages/reports/ReportBuilder';
import AnalyticsDashboard from '../pages/reports/AnalyticsDashboard';
import TaskReports from '../pages/reports/TaskReports';
import AttendanceReports from '../pages/reports/AttendanceReports';
import FinancialReports from '../pages/reports/FinancialReports';

// ==================== SETTINGS ====================
import GeneralSettings from '../pages/settings/GeneralSettings';
import SystemSettings from '../pages/settings/SystemSettings';
import BackupRestore from '../pages/settings/BackupRestore';
import AuditLogs from '../pages/settings/AuditLogs';
import EmailSettings from '../pages/settings/EmailSettings';
import NotificationSettings from '../pages/settings/NotificationSettings';
import IntegrationSettings from '../pages/settings/IntegrationSettings';
import ThemeSettings from '../pages/settings/ThemeSettings';

// ==================== NOTIFICATIONS ====================
import NotificationList from '../pages/notifications/NotificationList';
import NotificationManagement from '../pages/notifications/NotificationManagement';
import NotificationPreferences from '../pages/notifications/NotificationPreferences';

// ==================== TRACKING ====================
import LiveTracking from '../pages/tracking/LiveTracking';
import RouteHistory from '../pages/tracking/RouteHistory';
import GeofenceManager from '../pages/tracking/GeofenceManager';

// ==================== SLA ====================
import SLADashboard from '../pages/sla/SLADashboard';
import BreachedTasks from '../pages/sla/BreachedTasks';
import AtRiskTasks from '../pages/sla/AtRiskTasks';
import SLAHistory from '../pages/sla/SLAHistory';
import SLAReport from '../pages/sla/SLAReport';

// ==================== PROFILE ====================
import Profile from '../pages/profile/Profile';
import ChangePassword from '../pages/profile/ChangePassword';
import Settings from '../pages/profile/Settings';
import MyDocuments from '../pages/profile/MyDocuments';

// ==================== ERROR PAGES ====================
import NotFound from '../pages/error/NotFound';
import AccountSuspended from '../pages/error/AccountSuspended';
import MaintenanceMode from '../pages/error/MaintenanceMode';

// ==================== CUSTOMER PORTAL ====================
import MyProperties from '../pages/customer/MyProperties';
import ServiceRequests from '../pages/customer/ServiceRequests';
import PaymentHistory from '../pages/customer/PaymentHistory';
import VisitorPass from '../pages/customer/VisitorPass';

// ==================== CHAT MODULE ====================
import ChatModule from '../pages/chat/ChatModule';
import GroupChats from '../pages/chat/GroupChats';
import ChatSettings from '../pages/chat/ChatSettings';
import AdminChatManagement from '../pages/admin/AdminChatManagement';

// =============================================================

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* ==================== PUBLIC ROUTES ==================== */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/account-suspended" element={<AccountSuspended />} />
            <Route path="/maintenance" element={<MaintenanceMode />} />
            
            {/* ==================== TEST ROUTES ==================== */}
            <Route path="/test-register" element={<TestRegister />} />
            <Route path="/test-login" element={<TestLogin />} />
            <Route path="/test-dashboard" element={<TestDashboard />} />
            
            {/* ==================== PROTECTED ROUTES ==================== */}
            <Route element={<PrivateRoute />}>
              <Route element={<AppLayout />}>
                
                {/* ==================== DASHBOARD ==================== */}
                <Route path="/dashboard" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer']}>
                    <SuperAdminDashboard />
                  </RoleBasedRoute>
                } />
                <Route path="/dashboard/super-admin" element={
                  <RoleBasedRoute roles={['super_admin']}>
                    <SuperAdminDashboard />
                  </RoleBasedRoute>
                } />
                <Route path="/dashboard/admin" element={
                  <RoleBasedRoute roles={['admin', 'super_admin']}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                } />
                <Route path="/dashboard/manager" element={
                  <RoleBasedRoute roles={['manager', 'admin', 'super_admin']}>
                    <ManagerDashboard />
                  </RoleBasedRoute>
                } />
                <Route path="/dashboard/supervisor" element={
                  <RoleBasedRoute roles={['supervisor', 'manager', 'admin', 'super_admin']}>
                    <SupervisorDashboard />
                  </RoleBasedRoute>
                } />
                <Route path="/dashboard/hr" element={
                  <RoleBasedRoute roles={['hr', 'super_admin']}>
                    <HRDashboard />
                  </RoleBasedRoute>
                } />
                <Route path="/dashboard/technician" element={
                  <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'super_admin']}>
                    <TechnicianDashboard />
                  </RoleBasedRoute>
                } />
                <Route path="/dashboard/customer" element={
                  <RoleBasedRoute roles={['customer']}>
                    <CustomerDashboard />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== USERS ==================== */}
                <Route path="/users" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.read']}>
                    <UserList />
                  </RoleBasedRoute>
                } />
                <Route path="/users/new" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.create']}>
                    <UserForm />
                  </RoleBasedRoute>
                } />
                <Route path="/users/:id" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.read']}>
                    <UserDetails />
                  </RoleBasedRoute>
                } />
                <Route path="/users/:id/edit" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'hr']} permissions={['user.update']}>
                    <UserForm />
                  </RoleBasedRoute>
                } />
                <Route path="/employee/onboarding" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'hr']}>
                    <EmployeeOnboarding />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== ROLES ==================== */}
                <Route path="/roles" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <RoleManagement />
                  </RoleBasedRoute>
                } />
                <Route path="/permissions" element={
                  <RoleBasedRoute roles={['super_admin']}>
                    <PermissionManager />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== BUILDINGS ==================== */}
                <Route path="/buildings" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
                    <BuildingList />
                  </RoleBasedRoute>
                } />
                <Route path="/buildings/new" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <BuildingForm />
                  </RoleBasedRoute>
                } />
                <Route path="/buildings/:id" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
                    <BuildingDetails />
                  </RoleBasedRoute>
                } />
                <Route path="/buildings/:id/edit" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <BuildingForm />
                  </RoleBasedRoute>
                } />
                <Route path="/buildings/:id/hierarchy" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
                    <BuildingHierarchy />
                  </RoleBasedRoute>
                } />
                <Route path="/buildings/:id/floors" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
                    <FloorManagement />
                  </RoleBasedRoute>
                } />
                <Route path="/buildings/:id/units" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
                    <UnitManagement />
                  </RoleBasedRoute>
                } />
                <Route path="/buildings/:id/bulk-import" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <BulkUnitImport />
                  </RoleBasedRoute>
                } />
                <Route path="/units/new/:buildingId" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <UnitForm />
                  </RoleBasedRoute>
                } />
                <Route path="/units/:id" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
                    <UnitDetails />
                  </RoleBasedRoute>
                } />
                <Route path="/units/:id/edit" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <UnitForm />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== COMPLAINTS ==================== */}
                <Route path="/complaints" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer']}>
                    <ComplaintList />
                  </RoleBasedRoute>
                } />
                <Route path="/complaints/new" element={
                  <RoleBasedRoute roles={['customer', 'admin']}>
                    <ComplaintForm />
                  </RoleBasedRoute>
                } />
                <Route path="/complaints/:id" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer']}>
                    <ComplaintDetails />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== TASKS ==================== */}
                <Route path="/tasks" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician']}>
                    <TaskList />
                  </RoleBasedRoute>
                } />
                <Route path="/tasks/board" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
                    <TaskBoard />
                  </RoleBasedRoute>
                } />
                <Route path="/tasks/calendar" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician']}>
                    <TaskCalendar />
                  </RoleBasedRoute>
                } />
                <Route path="/tasks/new" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']} permissions={['task.create']}>
                    <TaskForm />
                  </RoleBasedRoute>
                } />
                <Route path="/tasks/:id" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician']}>
                    <TaskDetails />
                  </RoleBasedRoute>
                } />
                <Route path="/tasks/:id/edit" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']} permissions={['task.update']}>
                    <TaskForm />
                  </RoleBasedRoute>
                } />
                <Route path="/tasks/:id/assign" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']} permissions={['task.assign']}>
                    <TaskAssignment />
                  </RoleBasedRoute>
                } />
                <Route path="/tasks/:id/progress" element={
                  <RoleBasedRoute roles={['technician']}>
                    <TaskProgress />
                  </RoleBasedRoute>
                } />
                <Route path="/tasks/:id/verify" element={
                  <RoleBasedRoute roles={['supervisor', 'manager', 'admin']}>
                    <TaskVerification />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== ATTENDANCE ==================== */}
                <Route path="/attendance/my" element={
                  <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
                    <MyAttendance />
                  </RoleBasedRoute>
                } />
                <Route path="/attendance/team" element={
                  <RoleBasedRoute roles={['manager', 'supervisor']}>
                    <TeamAttendance />
                  </RoleBasedRoute>
                } />
                <Route path="/attendance/check-in-out" element={
                  <RoleBasedRoute roles={['technician', 'supervisor', 'manager']}>
                    <CheckInOut />
                  </RoleBasedRoute>
                } />
                <Route path="/attendance/report" element={
                  <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
                    <AttendanceReport />
                  </RoleBasedRoute>
                } />
                <Route path="/attendance/correction" element={
                  <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr']}>
                    <AttendanceCorrection />
                  </RoleBasedRoute>
                } />
                <Route path="/attendance/holidays" element={
                  <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
                    <HolidayManagement />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== LEAVE ==================== */}
                <Route path="/leave/my" element={
                  <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
                    <MyLeave />
                  </RoleBasedRoute>
                } />
                <Route path="/leave/calendar" element={
                  <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
                    <LeaveCalendar />
                  </RoleBasedRoute>
                } />
                <Route path="/leave/pending" element={
                  <RoleBasedRoute roles={['supervisor', 'manager', 'hr', 'admin', 'super_admin']}>
                    <PendingApprovals />
                  </RoleBasedRoute>
                } />
                <Route path="/leave/balance" element={
                  <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
                    <LeaveBalance />
                  </RoleBasedRoute>
                } />
                <Route path="/leave/apply" element={
                  <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
                    <LeaveRequestForm />
                  </RoleBasedRoute>
                } />
                <Route path="/leave/history" element={
                  <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr', 'super_admin']}>
                    <LeaveHistory />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== SALARY / PAYROLL ==================== */}
                <Route path="/salary/my" element={
                  <RoleBasedRoute roles={['technician', 'supervisor', 'manager']}>
                    <MySalary />
                  </RoleBasedRoute>
                } />
                <Route path="/salary/slip/:id" element={
                  <RoleBasedRoute roles={['technician', 'supervisor', 'manager', 'admin', 'hr']}>
                    <SalarySlip />
                  </RoleBasedRoute>
                } />
                <Route path="/salary/structure" element={
                  <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
                    <SalaryStructure />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== PAYROLL ROUTES ==================== */}
                {/* Main Payroll Dashboard */}
                <Route path="/payroll/dashboard" element={
                  <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
                    <PayrollDashboard />
                  </RoleBasedRoute>
                } />
                
                {/* Payroll Processor - Main processing page */}
                <Route path="/payroll/processor" element={
                  <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
                    <PayrollProcessor />
                  </RoleBasedRoute>
                } />
                
                {/* Alias for /payroll/process (keeping both for compatibility) */}
                <Route path="/payroll/process" element={
                  <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
                    <PayrollProcessor />
                  </RoleBasedRoute>
                } />
                
                {/* Payroll Reports */}
                <Route path="/payroll/reports" element={
                  <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
                    <PayrollReports />
                  </RoleBasedRoute>
                } />
                
                {/* Payroll Settings */}
                <Route path="/payroll/settings" element={
                  <RoleBasedRoute roles={['admin', 'hr', 'super_admin']}>
                    <PayrollSettings />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== REPORTS ==================== */}
                <Route path="/reports" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'hr']}>
                    <ReportsDashboard />
                  </RoleBasedRoute>
                } />
                <Route path="/reports/builder" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <ReportBuilder />
                  </RoleBasedRoute>
                } />
                <Route path="/reports/analytics" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
                    <AnalyticsDashboard />
                  </RoleBasedRoute>
                } />
                <Route path="/reports/tasks" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
                    <TaskReports />
                  </RoleBasedRoute>
                } />
                <Route path="/reports/attendance" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'hr']}>
                    <AttendanceReports />
                  </RoleBasedRoute>
                } />
                <Route path="/reports/financial" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'accountant']}>
                    <FinancialReports />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== SETTINGS ==================== */}
                <Route path="/settings/general" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <GeneralSettings />
                  </RoleBasedRoute>
                } />
                <Route path="/settings/system" element={
                  <RoleBasedRoute roles={['super_admin']}>
                    <SystemSettings />
                  </RoleBasedRoute>
                } />
                <Route path="/settings/backup" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <BackupRestore />
                  </RoleBasedRoute>
                } />
                <Route path="/settings/audit-logs" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <AuditLogs />
                  </RoleBasedRoute>
                } />
                <Route path="/settings/email" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <EmailSettings />
                  </RoleBasedRoute>
                } />
                <Route path="/settings/notifications" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <NotificationSettings />
                  </RoleBasedRoute>
                } />
                <Route path="/settings/integrations" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <IntegrationSettings />
                  </RoleBasedRoute>
                } />
                <Route path="/settings/theme" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <ThemeSettings />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== NOTIFICATIONS ==================== */}
                <Route path="/notifications" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'hr', 'customer']}>
                    <NotificationList />
                  </RoleBasedRoute>
                } />
                <Route path="/notifications/preferences" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'hr', 'customer']}>
                    <NotificationPreferences />
                  </RoleBasedRoute>
                } />
                <Route path="/notifications/manage" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'hr']}>
                    <NotificationManagement />
                  </RoleBasedRoute>
                } />
                <Route path="/notifications/send" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'hr', 'manager', 'supervisor']}>
                    <NotificationManagement />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== TRACKING ==================== */}
                <Route path="/tracking/live" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
                    <LiveTracking />
                  </RoleBasedRoute>
                } />
                <Route path="/tracking/history/:technicianId" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
                    <RouteHistory />
                  </RoleBasedRoute>
                } />
                <Route path="/geofences" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <GeofenceManager />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== SLA ==================== */}
                <Route path="/sla/dashboard" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
                    <SLADashboard />
                  </RoleBasedRoute>
                } />
                <Route path="/sla/breached" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
                    <BreachedTasks />
                  </RoleBasedRoute>
                } />
                <Route path="/sla/at-risk" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
                    <AtRiskTasks />
                  </RoleBasedRoute>
                } />
                <Route path="/sla/history" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
                    <SLAHistory />
                  </RoleBasedRoute>
                } />
                <Route path="/sla/report" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager']}>
                    <SLAReport />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== PROFILE ==================== */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/profile/settings" element={<Settings />} />
                <Route path="/profile/documents" element={<MyDocuments />} />

                {/* ==================== CHAT MODULE ==================== */}
                <Route path="/chat" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer', 'hr']}>
                    <ChatModule />
                  </RoleBasedRoute>
                } />
                <Route path="/chat/groups" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor']}>
                    <GroupChats />
                  </RoleBasedRoute>
                } />
                <Route path="/chat/settings" element={
                  <RoleBasedRoute roles={['super_admin', 'admin', 'manager', 'supervisor', 'technician', 'customer', 'hr']}>
                    <ChatSettings />
                  </RoleBasedRoute>
                } />
                <Route path="/admin/chat" element={
                  <RoleBasedRoute roles={['super_admin', 'admin']}>
                    <AdminChatManagement />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== CUSTOMER PORTAL ==================== */}
                <Route path="/my-properties" element={
                  <RoleBasedRoute roles={['customer']}>
                    <MyProperties />
                  </RoleBasedRoute>
                } />
                <Route path="/service-requests" element={
                  <RoleBasedRoute roles={['customer']}>
                    <ServiceRequests />
                  </RoleBasedRoute>
                } />
                <Route path="/payment-history" element={
                  <RoleBasedRoute roles={['customer']}>
                    <PaymentHistory />
                  </RoleBasedRoute>
                } />
                <Route path="/visitor-pass" element={
                  <RoleBasedRoute roles={['customer']}>
                    <VisitorPass />
                  </RoleBasedRoute>
                } />
                
                {/* ==================== 404 NOT FOUND ==================== */}
                <Route path="*" element={<NotFound />} />
                
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;