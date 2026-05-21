// client/src/pages/users/RoleManagement.jsx
import React, { useState, useEffect } from 'react';
import { roleApi } from '../../api';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
//import { useToast } from '../../context/ToastContext'; 
import { useToast } from '../../hooks/useToast';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchRoles();
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
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button onClick={() => { setSelectedRole(row); setShowModal(true); }} className="text-blue-600">
            Edit
          </button>
          {!row.isSystemRole && (
            <button onClick={() => handleDelete(row)} className="text-red-600">
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
        <Button onClick={() => { setSelectedRole(null); setShowModal(true); }}>
          Add Role
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={roles} isLoading={loading} />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedRole ? 'Edit Role' : 'Add Role'}
      >
        <RoleForm
          role={selectedRole}
          onSuccess={() => {
            setShowModal(false);
            fetchRoles();
          }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

const RoleForm = ({ role, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    displayName: role?.displayName || '',
    description: role?.description || '',
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (role) {
        await roleApi.updateRole(role._id, formData);
        showToast('Role updated', 'success');
      } else {
        await roleApi.createRole(formData);
        showToast('Role created', 'success');
      }
      onSuccess();
    } catch (error) {
      showToast(error.response?.data?.error || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Role Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        disabled={role?.isSystemRole}
      />
      <Input
        label="Display Name"
        value={formData.displayName}
        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
        required
      />
      <Input
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        textarea
      />
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={loading}>Save</Button>
      </div>
    </form>
  );
};

export default RoleManagement;