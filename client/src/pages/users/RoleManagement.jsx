// client/src/pages/users/RoleManagement.jsx
import React, { useState, useEffect } from 'react';
import { roleApi } from '../../api';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const { showToast } = useToast();
  const { hasPermission } = usePermission();

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await roleApi.getRoles();
      setRoles(response.data.data);
    } catch (error) {
      showToast('Failed to load roles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await roleApi.getPermissions();
      setPermissions(response.data.data.groupedPermissions || {});
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    }
  };

  const handleDelete = async (role) => {
    if (role.isSystemRole) {
      showToast('Cannot delete system roles', 'error');
      return;
    }
    if (window.confirm(`Delete role "${role.displayName}"?`)) {
      try {
        await roleApi.deleteRole(role._id);
        showToast('Role deleted', 'success');
        fetchRoles();
      } catch (error) {
        showToast('Failed to delete role', 'error');
      }
    }
  };

  const handlePermissionToggle = (permissionName) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionName)
        ? prev.filter(p => p !== permissionName)
        : [...prev, permissionName]
    );
  };

  const handleSaveRole = async () => {
    if (!selectedRole?.name && !selectedRole?.displayName) {
      showToast('Role name is required', 'error');
      return;
    }

    try {
      const roleData = {
        name: selectedRole.name,
        displayName: selectedRole.displayName,
        description: selectedRole.description,
        permissions: selectedPermissions
      };

      if (selectedRole._id) {
        await roleApi.updateRole(selectedRole._id, roleData);
        showToast('Role updated', 'success');
      } else {
        await roleApi.createRole(roleData);
        showToast('Role created', 'success');
      }
      setShowModal(false);
      setSelectedRole(null);
      setSelectedPermissions([]);
      fetchRoles();
    } catch (error) {
      showToast(error.response?.data?.error || 'Operation failed', 'error');
    }
  };

  const openEditModal = (role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions?.map(p => p.name) || []);
    setShowModal(true);
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'displayName', header: 'Display Name' },
    { key: 'description', header: 'Description' },
    {
      key: 'isSystemRole',
      header: 'Type',
      render: (value) => value ? 'System' : 'Custom'
    },
    {
      key: 'permissions',
      header: 'Permissions',
      render: (perms) => `${perms?.length || 0} permissions`
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button onClick={() => openEditModal(row)} className="text-blue-600 hover:text-blue-800">
            Edit
          </button>
          {!row.isSystemRole && (
            <button onClick={() => handleDelete(row)} className="text-red-600 hover:text-red-800">
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-500 mt-1">Manage user roles and their permissions</p>
        </div>
        {hasPermission('role.create') && (
          <Button onClick={() => { setSelectedRole(null); setSelectedPermissions([]); setShowModal(true); }}>
            + Create Role
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <Table columns={columns} data={roles} />
      </Card>

      {/* Role Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedRole(null);
          setSelectedPermissions([]);
        }}
        title={selectedRole?._id ? 'Edit Role' : 'Create Role'}
        size="lg"
      >
        <div className="space-y-6">
          {/* Role Details */}
          <div className="space-y-4">
            <Input
              label="Role Name"
              value={selectedRole?.name || ''}
              onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
              placeholder="e.g., custom_role"
              helperText="Unique identifier (lowercase, no spaces)"
              disabled={selectedRole?.isSystemRole}
            />
            <Input
              label="Display Name"
              value={selectedRole?.displayName || ''}
              onChange={(e) => setSelectedRole({ ...selectedRole, displayName: e.target.value })}
              placeholder="e.g., Custom Role"
            />
            <Input
              label="Description"
              value={selectedRole?.description || ''}
              onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
              placeholder="Describe the role's purpose"
              textarea
            />
          </div>

          {/* Permissions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
            <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
              {Object.entries(permissions).map(([module, perms]) => (
                <div key={module} className="p-4">
                  <h4 className="font-medium text-gray-900 capitalize mb-3">{module}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {perms.map((perm) => (
                      <label key={perm._id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.name)}
                          onChange={() => handlePermissionToggle(perm.name)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{perm.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSaveRole}>Save Role</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoleManagement;