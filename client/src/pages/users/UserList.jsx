// // client/src/pages/users/UserList.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { userApi } from '../../api';
// import Button from '../../components/common/Button';
// import Table from '../../components/common/Table';
// import Pagination from '../../components/common/Pagination';
// import SearchBar from '../../components/common/SearchBar';
// import FilterBar from '../../components/common/FilterBar';
// import Modal from '../../components/common/Modal';
// import Spinner from '../../components/common/Spinner';
// import UserForm from './UserForm';
// import { usePermission } from '../../hooks/usePermission';
// import { useToast } from '../../hooks/useToast';
// import { formatDate } from '../../utils/formatters';

// const UserList = () => {
//   const navigate = useNavigate();
//   const { hasPermission } = usePermission();
//   const { showToast } = useToast();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pagination, setPagination] = useState({ 
//     page: 1, 
//     limit: 10, 
//     total: 0, 
//     pages: 0 
//   });
//   const [filters, setFilters] = useState({ search: '', role: '', department: '', status: '' });
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   const fetchUsers = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await userApi.getUsers({
//         page: pagination.page,
//         limit: pagination.limit,
//         ...filters,
//       });
      
//       const responseData = response?.data?.data || {};
//       const usersData = responseData.users || [];
//       const paginationData = responseData.pagination || { page: 1, limit: 10, total: 0, pages: 0 };
      
//       setUsers(usersData);
//       setPagination(paginationData);
//     } catch (error) {
//       console.error('Failed to fetch users:', error);
//       showToast('Failed to load users', 'error');
//       setUsers([]);
//       setPagination({ page: 1, limit: 10, total: 0, pages: 0 });
//     } finally {
//       setLoading(false);
//     }
//   }, [pagination.page, pagination.limit, filters, showToast]);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   const handleDelete = async () => {
//     if (!selectedUser) return;
    
//     try {
//       await userApi.deleteUser(selectedUser._id);
//       showToast('User deleted successfully', 'success');
//       setShowDeleteConfirm(false);
//       setSelectedUser(null);
//       fetchUsers();
//     } catch (error) {
//       console.error('Failed to delete user:', error);
//       showToast('Failed to delete user', 'error');
//     }
//   };

//   const handleFilterChange = useCallback((key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
//   }, []);

//   const handlePageChange = useCallback((page) => {
//     setPagination(prev => ({ ...prev, page }));
//   }, []);

//   const columns = [
//     { key: 'employeeId', header: 'Employee ID', width: '120px' },
//     { 
//       key: 'name', 
//       header: 'Name', 
//       width: '200px', 
//       render: (_, row) => `${row.firstName || ''} ${row.lastName || ''}` 
//     },
//     { key: 'email', header: 'Email', width: '250px' },
//     { key: 'phone', header: 'Phone', width: '150px' },
//     { 
//       key: 'role', 
//       header: 'Role', 
//       width: '120px', 
//       render: (role) => <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{role || '-'}</span> 
//     },
//     { key: 'department', header: 'Department', width: '150px', render: (dept) => dept || '-' },
//     { 
//       key: 'status', 
//       header: 'Status', 
//       width: '100px', 
//       render: (status) => (
//         <span className={`px-2 py-1 text-xs rounded-full ${
//           status === 'active' ? 'bg-green-100 text-green-800' : 
//           status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
//           'bg-red-100 text-red-800'
//         }`}>
//           {status || 'inactive'}
//         </span>
//       ) 
//     },
//     { 
//       key: 'lastLoginAt', 
//       header: 'Last Login', 
//       width: '180px', 
//       render: (date) => date ? formatDate(date) : '-' 
//     },
//     {
//       key: 'actions',
//       header: 'Actions',
//       width: '150px',
//       render: (_, row) => (
//         <div className="flex space-x-2">
//           <button 
//             onClick={(e) => { e.stopPropagation(); navigate(`/users/${row._id}`); }} 
//             className="text-blue-600 hover:text-blue-800"
//           >
//             View
//           </button>
//           {hasPermission('user.update') && (
//             <button 
//               onClick={(e) => { e.stopPropagation(); navigate(`/users/${row._id}/edit`); }} 
//               className="text-green-600 hover:text-green-800"
//             >
//               Edit
//             </button>
//           )}
//           {hasPermission('user.delete') && (
//             <button 
//               onClick={(e) => { e.stopPropagation(); setSelectedUser(row); setShowDeleteConfirm(true); }} 
//               className="text-red-600 hover:text-red-800"
//             >
//               Delete
//             </button>
//           )}
//         </div>
//       ),
//     },
//   ];

//   const filterOptions = {
//     role: {
//       type: 'select',
//       options: [
//         { value: '', label: 'All Roles' },
//         { value: 'super_admin', label: 'Super Admin' },
//         { value: 'admin', label: 'Admin' },
//         { value: 'hr', label: 'HR' },
//         { value: 'manager', label: 'Manager' },
//         { value: 'supervisor', label: 'Supervisor' },
//         { value: 'technician', label: 'Technician' },
//         { value: 'accountant', label: 'Accountant' },
//       ],
//     },
//     department: {
//       type: 'select',
//       options: [
//         { value: '', label: 'All Departments' },
//         { value: 'operations', label: 'Operations' },
//         { value: 'technical', label: 'Technical' },
//         { value: 'housekeeping', label: 'Housekeeping' },
//         { value: 'security', label: 'Security' },
//         { value: 'hr', label: 'HR' },
//         { value: 'finance', label: 'Finance' },
//       ],
//     },
//     status: {
//       type: 'select',
//       options: [
//         { value: '', label: 'All Status' },
//         { value: 'active', label: 'Active' },
//         { value: 'inactive', label: 'Inactive' },
//         { value: 'suspended', label: 'Suspended' },
//       ],
//     },
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Users</h1>
//           <p className="text-gray-500 mt-1">Manage all system users and their roles</p>
//         </div>
//         {hasPermission('user.create') && (
//           <Button onClick={() => setShowCreateModal(true)}>+ Add User</Button>
//         )}
//       </div>

//       <div className="bg-white rounded-lg shadow p-4 space-y-4">
//         <SearchBar
//           value={filters.search}
//           onChange={(value) => handleFilterChange('search', value)}
//           placeholder="Search by name, email, or employee ID..."
//         />
//         <FilterBar
//           filters={filters}
//           options={filterOptions}
//           onFilterChange={handleFilterChange}
//         />
//         <Table
//           columns={columns}
//           data={users}
//           isLoading={loading}
//           onRowClick={(row) => navigate(`/users/${row._id}`)}
//           emptyMessage="No users found"
//         />
//         <Pagination
//           currentPage={pagination.page}
//           totalPages={pagination.pages || 1}
//           totalItems={pagination.total || 0}
//           itemsPerPage={pagination.limit || 10}
//           onPageChange={handlePageChange}
//         />
//       </div>

//       {/* Create User Modal */}
//       <Modal
//         isOpen={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         title="Add New User"
//         size="lg"
//       >
//         <UserForm
//           onSuccess={() => {
//             setShowCreateModal(false);
//             fetchUsers();
//           }}
//           onCancel={() => setShowCreateModal(false)}
//         />
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={showDeleteConfirm}
//         onClose={() => setShowDeleteConfirm(false)}
//         title="Confirm Delete"
//         size="sm"
//       >
//         <div className="space-y-4">
//           <p>Are you sure you want to delete user <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>?</p>
//           <p className="text-sm text-red-600">This action cannot be undone.</p>
//           <div className="flex justify-end space-x-3">
//             <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
//             <Button variant="danger" onClick={handleDelete}>Delete</Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default UserList;



// client/src/pages/users/UserList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../../api/user.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const UserList = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'technician', label: 'Technician' },
    { value: 'customer', label: 'Customer' },
    { value: 'hr', label: 'HR' },
    { value: 'accountant', label: 'Accountant' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.role && { role: filters.role }),
        ...(filters.status && { status: filters.status })
      };
      
      const response = await userApi.getUsers(params);
      console.log('Users API Response:', response.data);
      
      // Extract users from response
      let usersList = [];
      let paginationData = { page: 1, limit: 10, total: 0, pages: 0 };
      
      if (response.data.success) {
        if (response.data.data && response.data.data.users) {
          usersList = response.data.data.users;
          paginationData = response.data.data.pagination || paginationData;
        } else if (Array.isArray(response.data.data)) {
          usersList = response.data.data;
        } else if (Array.isArray(response.data)) {
          usersList = response.data;
        }
      }
      
      setUsers(usersList);
      setPagination(prev => ({ ...prev, ...paginationData }));
      
    } catch (error) {
      console.error('Fetch users error:', error);
      showToast('Failed to load users', 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await userApi.deleteUser(userId);
        showToast('User deleted successfully', 'success');
        fetchUsers(); // Refresh list
      } catch (error) {
        console.error('Delete user error:', error);
        showToast('Failed to delete user', 'error');
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      supervisor: 'bg-indigo-100 text-indigo-800',
      technician: 'bg-green-100 text-green-800',
      customer: 'bg-gray-100 text-gray-800',
      hr: 'bg-pink-100 text-pink-800',
      accountant: 'bg-yellow-100 text-yellow-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage all system users and their roles</p>
        </div>
        <Link to="/users/new">
          <Button variant="primary">
            <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New User
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Search"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <Select
            label="Role"
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            options={roleOptions}
          />
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            options={statusOptions}
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role?.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(user.status)}`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.employeeId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/users/${user._id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </Link>
                      <Link to={`/users/${user._id}/edit`} className="text-green-600 hover:text-green-900 mr-3">
                        Edit
                      </Link>
                      {currentUser?.role === 'super_admin' && user.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <p>No users found</p>
                      <Link to="/users/new" className="text-blue-600 hover:text-blue-800 mt-2">
                        + Add your first user
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserList;