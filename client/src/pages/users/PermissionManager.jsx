// client/src/pages/users/PermissionManager.jsx
import React, { useState, useEffect } from 'react';
import { roleApi } from '../../api';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import SearchBar from '../../components/common/SearchBar';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';

const PermissionManager = () => {
  const [permissions, setPermissions] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { hasPermission } = usePermission();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await roleApi.getPermissions();
      setPermissions(response.data.data.groupedPermissions || {});
    } catch (error) {
      showToast('Failed to load permissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterPermissions = (perms) => {
    if (!searchTerm) return perms;
    return perms.filter(perm =>
      perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Permission Manager</h1>
        <p className="text-gray-500 mt-1">Manage system permissions and access controls</p>
      </div>

      <div className="max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search permissions..."
        />
      </div>

      <div className="space-y-4">
        {Object.entries(permissions).map(([module, perms]) => {
          const filteredPerms = filterPermissions(perms);
          if (filteredPerms.length === 0) return null;
          
          return (
            <Card key={module} className="overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold capitalize text-gray-900">
                  {module}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({filteredPerms.length} permissions)
                  </span>
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPerms.map((perm) => (
                    <div
                      key={perm._id}
                      className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{perm.name}</p>
                        {perm.description && (
                          <p className="text-xs text-gray-500">{perm.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {Object.keys(permissions).length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No permissions found</p>
        </div>
      )}
    </div>
  );
};

export default PermissionManager;