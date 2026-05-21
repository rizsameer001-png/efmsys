// client/src/pages/users/UserList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import FilterBar from '../../components/common/FilterBar';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import UserForm from './UserForm';
import { usePermission } from '../../hooks/usePermission';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../utils/formatters';

const UserList = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ 
    page: 1, 
    limit: 10, 
    total: 0, 
    pages: 0 
  });
  const [filters, setFilters] = useState({ search: '', role: '', department: '', status: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      
      // Safe data extraction with fallbacks
      const responseData = response?.data?.data || {};
      const usersData = responseData.users || [];
      const paginationData = responseData.pagination || { page: 1, limit: 10, total: 0, pages: 0 };
      
      setUsers(usersData);
      setPagination(paginationData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showToast('Failed to load users', 'error');
      setUsers([]);
      setPagination({ page: 1, limit: 10, total: 0, pages: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await userApi.deleteUser(selectedUser._id);
      showToast('User deleted successfully', 'success');
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      showToast('Failed to delete user', 'error');
    }
  };

  const columns = [
    { key: 'employeeId', header: 'Employee ID', width: '120px' },
    { 
      key: 'name', 
      header: 'Name', 
      width: '200px', 
      render: (_, row) => `${row.firstName || ''} ${row.lastName || ''}` 
    },
    { key: 'email', header: 'Email', width: '250px' },
    { key: 'phone', header: 'Phone', width: '150px' },
    { 
      key: 'role', 
      header: 'Role', 
      width: '120px', 
      render: (role) => <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{role || '-'}</span> 
    },
    { key: 'department', header: 'Department', width: '150px', render: (dept) => dept || '-' },
    { 
      key: 'status', 
      header: 'Status', 
      width: '100px', 
      render: (status) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {status || 'inactive'}
        </span>
      ) 
    },
    { 
      key: 'lastLoginAt', 
      header: 'Last Login', 
      width: '180px', 
      render: (date) => date ? formatDate(date) : '-' 
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '150px',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/users/${row._id}`); }} 
            className="text-blue-600 hover:text-blue-800"
          >
            View
          </button>
          {hasPermission('user.update') && (
            <button 
              onClick={(e) => { e.stopPropagation(); navigate(`/users/${row._id}/edit`); }} 
              className="text-green-600 hover:text-green-800"
            >
              Edit
            </button>
          )}
          {hasPermission('user.delete') && (
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedUser(row); setShowDeleteConfirm(true); }} 
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  const filterOptions = {
    role: [
      { value: '', label: 'All Roles' },
      { value: 'super_admin', label: 'Super Admin' },
      { value: 'admin', label: 'Admin' },
      { value: 'hr', label: 'HR' },
      { value: 'manager', label: 'Manager' },
      { value: 'supervisor', label: 'Supervisor' },
      { value: 'technician', label: 'Technician' },
    ],
    department: [
      { value: '', label: 'All Departments' },
      { value: 'operations', label: 'Operations' },
      { value: 'technical', label: 'Technical' },
      { value: 'housekeeping', label: 'Housekeeping' },
      { value: 'security', label: 'Security' },
      { value: 'hr', label: 'HR' },
    ],
    status: [
      { value: '', label: 'All Status' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'suspended', label: 'Suspended' },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        {hasPermission('user.create') && (
          <Button onClick={() => setShowCreateModal(true)}>Add User</Button>
        )}
      </div>

      <div className="card p-4 space-y-4">
        <SearchBar
          value={filters.search}
          onChange={(value) => setFilters({ ...filters, search: value, page: 1 })}
          placeholder="Search by name, email, or employee ID..."
        />
        <FilterBar
          filters={filters}
          options={filterOptions}
          onFilterChange={(key, value) => setFilters({ ...filters, [key]: value, page: 1 })}
        />
        <Table
          columns={columns}
          data={users}
          isLoading={loading}
          onRowClick={(row) => navigate(`/users/${row._id}`)}
          emptyMessage="No users found"
        />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages || 1}
          totalItems={pagination.total || 0}
          itemsPerPage={pagination.limit || 10}
          onPageChange={(page) => setPagination({ ...pagination, page })}
        />
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New User"
        size="lg"
      >
        <UserForm
          onSuccess={() => {
            setShowCreateModal(false);
            fetchUsers();
          }}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete user <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>?</p>
          <p className="text-sm text-red-600">This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserList;