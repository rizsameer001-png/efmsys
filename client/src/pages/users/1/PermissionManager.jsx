// client/src/pages/users/PermissionManager.jsx
import React, { useState, useEffect } from 'react';
import { roleApi } from '../../api';
import Spinner from '../../components/common/Spinner';
//import { useToast } from '../../context/ToastContext';
import { useToast } from '../../hooks/useToast';

const PermissionManager = () => {
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await roleApi.getPermissions();
      setPermissions(response.data.data.groupedPermissions);
    } catch (error) {
      showToast('Failed to load permissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Permission Manager</h1>
        <p className="text-gray-500">Manage system permissions and access controls.</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {Object.entries(permissions).map(([module, perms]) => (
          <div key={module} className="border-b border-gray-200 last:border-b-0">
            <div className="px-6 py-4 bg-gray-50">
              <h3 className="text-lg font-semibold capitalize">{module}</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {perms.map((perm) => (
                  <div key={perm._id} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-700">{perm.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionManager;