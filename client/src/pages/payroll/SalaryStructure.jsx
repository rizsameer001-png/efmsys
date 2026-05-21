// client/src/pages/salary/SalaryStructure.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { salaryApi } from '../../api/salary.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const SalaryStructure = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { hasPermission } = usePermission();
  
  const [loading, setLoading] = useState(true);
  const [salaryStructure, setSalaryStructure] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [formData, setFormData] = useState({
    basicSalary: '',
    allowances: {
      hra: '',
      conveyance: '',
      medical: '',
      special: '',
      lta: '',
      bonus: ''
    },
    deductions: {
      pf: '',
      professionalTax: '',
      tds: '',
      loan: '',
      otherDeductions: ''
    }
  });
  const [bulkData, setBulkData] = useState({
    incrementPercentage: '',
    effectiveDate: '',
    applyTo: 'all' // all, selected, department
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const isAdmin = hasPermission('salary.manage') || user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'hr';

  /**
   * Fetch current user's salary structure (for employees)
   */
  const fetchMySalaryStructure = useCallback(async () => {
    try {
      const response = await salaryApi.getMySalaryStructure();
      if (response.success) {
        setSalaryStructure(response.data);
      } else {
        // Use mock data as fallback
        setSalaryStructure({
          basicSalary: 50000,
          allowances: {
            hra: 15000,
            conveyance: 2000,
            medical: 1250,
            special: 5000,
            lta: 3000,
            bonus: 5000
          },
          deductions: {
            pf: 1800,
            professionalTax: 200,
            tds: 2500,
            loan: 0,
            otherDeductions: 0
          },
          grossEarnings: 81250,
          totalDeductions: 4500,
          netSalary: 76750
        });
        showToast('Using demo salary structure data', 'info');
      }
    } catch (error) {
      console.error('Error fetching my salary structure:', error);
      // Set default structure on error
      setSalaryStructure({
        basicSalary: 50000,
        allowances: {
          hra: 15000,
          conveyance: 2000,
          medical: 1250,
          special: 5000,
          lta: 3000,
          bonus: 5000
        },
        deductions: {
          pf: 1800,
          professionalTax: 200,
          tds: 2500,
          loan: 0,
          otherDeductions: 0
        },
        grossEarnings: 81250,
        totalDeductions: 4500,
        netSalary: 76750
      });
      showToast('Unable to fetch salary structure. Showing demo data.', 'warning');
    }
  }, [showToast]);

  /**
   * Fetch employees list for admin/HR view
   */
  const fetchEmployees = useCallback(async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      const response = await salaryApi.getEmployeesForSalary({
        page: pagination.page,
        limit: pagination.limit,
        department: filters.department || undefined,
        search: filters.search || undefined
      });
      
      if (response.success) {
        setEmployees(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.total || 0,
          pages: Math.ceil((response.total || 0) / prev.limit)
        }));
      } else {
        showToast(response.error || 'Failed to fetch employees', 'error');
        // Use mock data as fallback
        setEmployees([
          { id: '1', name: 'John Doe', department: 'Maintenance', position: 'Technician', currentSalary: 50000 },
          { id: '2', name: 'Jane Smith', department: 'Electrical', position: 'Senior Technician', currentSalary: 60000 },
          { id: '3', name: 'Mike Johnson', department: 'Plumbing', position: 'Technician', currentSalary: 48000 }
        ]);
        setPagination(prev => ({ ...prev, total: 3, pages: 1 }));
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      showToast('Failed to fetch employees', 'error');
      // Set mock data on error
      setEmployees([
        { id: '1', name: 'John Doe', department: 'Maintenance', position: 'Technician', currentSalary: 50000 },
        { id: '2', name: 'Jane Smith', department: 'Electrical', position: 'Senior Technician', currentSalary: 60000 },
        { id: '3', name: 'Mike Johnson', department: 'Plumbing', position: 'Technician', currentSalary: 48000 }
      ]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, pagination.page, pagination.limit, filters.department, filters.search, showToast]);

  useEffect(() => {
    if (isAdmin) {
      fetchEmployees();
    } else {
      fetchMySalaryStructure();
      setLoading(false);
    }
  }, [isAdmin, fetchEmployees, fetchMySalaryStructure]);

  /**
   * Handle edit employee salary structure
   */
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      basicSalary: employee.currentSalary || employee.basicSalary || 50000,
      allowances: employee.allowances || {
        hra: 15000,
        conveyance: 2000,
        medical: 1250,
        special: 5000,
        lta: 3000,
        bonus: 5000
      },
      deductions: employee.deductions || {
        pf: 1800,
        professionalTax: 200,
        tds: 2500,
        loan: 0,
        otherDeductions: 0
      }
    });
    setShowEditModal(true);
  };

  /**
   * Save updated salary structure for employee
   */
  const handleSaveSalaryStructure = async () => {
    if (!selectedEmployee) return;
    
    try {
      const response = await salaryApi.updateSalaryStructure(selectedEmployee.id, formData);
      if (response.success) {
        showToast(`Salary structure updated for ${selectedEmployee.name}`, 'success');
        setShowEditModal(false);
        fetchEmployees();
      } else {
        showToast(response.error || 'Failed to update salary structure', 'error');
      }
    } catch (error) {
      console.error('Error saving salary structure:', error);
      showToast('Failed to update salary structure', 'error');
    }
  };

  /**
   * Handle bulk increment
   */
  const handleBulkIncrement = async () => {
    if (!bulkData.incrementPercentage) {
      showToast('Please enter increment percentage', 'warning');
      return;
    }
    
    try {
      const employeesToUpdate = bulkData.applyTo === 'selected' ? selectedEmployees : null;
      const response = await salaryApi.bulkUpdateSalaryStructures({
        incrementPercentage: parseFloat(bulkData.incrementPercentage),
        effectiveDate: bulkData.effectiveDate,
        applyTo: bulkData.applyTo,
        employeeIds: employeesToUpdate,
        department: bulkData.applyTo === 'department' ? filters.department : null
      });
      
      if (response.success) {
        showToast(`Bulk increment applied successfully to ${response.data?.updatedCount || employees.length} employees`, 'success');
        setShowBulkModal(false);
        setBulkData({ incrementPercentage: '', effectiveDate: '', applyTo: 'all' });
        setSelectedEmployees([]);
        fetchEmployees();
      } else {
        showToast(response.error || 'Failed to apply bulk increment', 'error');
      }
    } catch (error) {
      console.error('Error applying bulk increment:', error);
      showToast('Failed to apply bulk increment', 'error');
    }
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  /**
   * Toggle employee selection for bulk operations
   */
  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  /**
   * Select all employees
   */
  const selectAllEmployees = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(emp => emp.id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  // Employee View - Show only my salary structure
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Salary Structure</h1>
          <p className="text-gray-500 mt-1">Your current salary breakdown and components</p>
        </div>

        {/* Salary Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-gradient-to-r from-green-50 to-emerald-50">
            <p className="text-sm text-gray-600">Basic Salary</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(salaryStructure?.basicSalary)}</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-r from-blue-50 to-cyan-50">
            <p className="text-sm text-gray-600">Gross Earnings</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(salaryStructure?.grossEarnings)}</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-r from-purple-50 to-pink-50">
            <p className="text-sm text-gray-600">Net Salary</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(salaryStructure?.netSalary)}</p>
          </Card>
        </div>

        {/* Allowances Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Allowances</h3>
          <div className="space-y-3">
            {salaryStructure?.allowances && Object.entries(salaryStructure.allowances).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="font-medium">{formatCurrency(value)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Deductions Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deductions</h3>
          <div className="space-y-3">
            {salaryStructure?.deductions && Object.entries(salaryStructure.deductions).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="font-medium text-red-600">-{formatCurrency(value)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t font-medium">
              <span>Total Deductions</span>
              <span className="text-red-600">-{formatCurrency(salaryStructure?.totalDeductions)}</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Admin/HR View - Manage all employees' salary structures
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary Structure Management</h1>
          <p className="text-gray-500 mt-1">Manage employee salary structures and components</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setShowBulkModal(true)}
            disabled={employees.length === 0}
          >
            📊 Bulk Increment
          </Button>
          <Button onClick={() => {/* Export functionality */}}>
            📥 Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Employee</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Name, ID, or email..."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">All Departments</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="HVAC">HVAC</option>
            </select>
          </div>
          <Button onClick={() => {
            setPagination(prev => ({ ...prev, page: 1 }));
            fetchEmployees();
          }}>
            Apply Filters
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => {
              setFilters({ department: '', search: '' });
              setPagination(prev => ({ ...prev, page: 1 }));
              fetchEmployees();
            }}
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* Employees Table */}
      <Card className="overflow-hidden">
        {employees.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-4xl mb-2">👥</div>
            <p>No employees found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.length === employees.length && employees.length > 0}
                        onChange={selectAllEmployees}
                        className="rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => toggleEmployeeSelection(employee.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{employee.name}</div>
                        <div className="text-xs text-gray-500">ID: {employee.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{employee.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{employee.position}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(employee.currentSalary || employee.basicSalary)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit Structure →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t flex justify-between items-center">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} employees)
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Edit Salary Structure Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Salary Structure - ${selectedEmployee?.name}`}
        size="lg"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Basic Salary */}
          <Input
            label="Basic Salary"
            type="number"
            value={formData.basicSalary}
            onChange={(e) => setFormData({ ...formData, basicSalary: parseInt(e.target.value) })}
          />
          
          {/* Allowances */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Allowances</h4>
            <div className="space-y-3">
              {Object.entries(formData.allowances).map(([key, value]) => (
                <Input
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  type="number"
                  value={value}
                  onChange={(e) => setFormData({
                    ...formData,
                    allowances: { ...formData.allowances, [key]: parseInt(e.target.value) || 0 }
                  })}
                />
              ))}
            </div>
          </div>
          
          {/* Deductions */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Deductions</h4>
            <div className="space-y-3">
              {Object.entries(formData.deductions).map(([key, value]) => (
                <Input
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  type="number"
                  value={value}
                  onChange={(e) => setFormData({
                    ...formData,
                    deductions: { ...formData.deductions, [key]: parseInt(e.target.value) || 0 }
                  })}
                />
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={handleSaveSalaryStructure}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Increment Modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Bulk Salary Increment"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              This will apply an increment to {selectedEmployees.length > 0 ? selectedEmployees.length : employees.length} employee(s)
            </p>
          </div>
          
          <Input
            label="Increment Percentage (%)"
            type="number"
            value={bulkData.incrementPercentage}
            onChange={(e) => setBulkData({ ...bulkData, incrementPercentage: e.target.value })}
            placeholder="e.g., 10"
          />
          
          <Input
            label="Effective Date"
            type="date"
            value={bulkData.effectiveDate}
            onChange={(e) => setBulkData({ ...bulkData, effectiveDate: e.target.value })}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apply To</label>
            <select
              value={bulkData.applyTo}
              onChange={(e) => setBulkData({ ...bulkData, applyTo: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="all">All Employees</option>
              <option value="selected" disabled={selectedEmployees.length === 0}>Selected Employees ({selectedEmployees.length})</option>
              <option value="department">Department: {filters.department || 'All'}</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowBulkModal(false)}>Cancel</Button>
            <Button onClick={handleBulkIncrement}>Apply Increment</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SalaryStructure;