// client/src/pages/attendance/HolidayManagement.jsx
import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendance.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const HolidayManagement = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [holidays, setHolidays] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    isRecurring: false,
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = ['admin', 'super_admin', 'hr'].includes(user?.role);

  useEffect(() => {
    fetchHolidays();
  }, [currentYear]);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const response = await attendanceApi.getHolidays(currentYear);
      if (response.data.success) {
        setHolidays(response.data.data);
      }
    } catch (error) {
      console.error('Fetch holidays error:', error);
      showToast('Failed to load holidays', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await attendanceApi.createHoliday(formData);
      if (response.data.success) {
        showToast('Holiday added successfully', 'success');
        setShowAddModal(false);
        setFormData({ name: '', date: '', isRecurring: false, description: '' });
        fetchHolidays();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to add holiday', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateHoliday = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await attendanceApi.updateHoliday(selectedHoliday._id, formData);
      if (response.data.success) {
        showToast('Holiday updated successfully', 'success');
        setShowEditModal(false);
        setSelectedHoliday(null);
        setFormData({ name: '', date: '', isRecurring: false, description: '' });
        fetchHolidays();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to update holiday', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHoliday = async (holidayId, holidayName) => {
    if (window.confirm(`Are you sure you want to delete "${holidayName}"?`)) {
      try {
        const response = await attendanceApi.deleteHoliday(holidayId);
        if (response.data.success) {
          showToast('Holiday deleted successfully', 'success');
          fetchHolidays();
        }
      } catch (error) {
        showToast('Failed to delete holiday', 'error');
      }
    }
  };

  const openEditModal = (holiday) => {
    setSelectedHoliday(holiday);
    setFormData({
      name: holiday.name,
      date: holiday.date.split('T')[0],
      isRecurring: holiday.isRecurring,
      description: holiday.description || ''
    });
    setShowEditModal(true);
  };

  const getMonthName = (month) => {
    return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
  };

  // Group holidays by month
  const holidaysByMonth = holidays.reduce((acc, holiday) => {
    const month = new Date(holiday.date).getMonth() + 1;
    if (!acc[month]) acc[month] = [];
    acc[month].push(holiday);
    return acc;
  }, {});

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Holiday Management</h1>
          <p className="text-gray-500 mt-1">Manage company holidays and special days</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowAddModal(true)}>+ Add Holiday</Button>
        )}
      </div>

      {/* Year Selector */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentYear(currentYear - 1)}
            className="px-3 py-1 border rounded-lg hover:bg-gray-50"
          >
            ← {currentYear - 1}
          </button>
          <span className="px-4 py-1 text-lg font-semibold">{currentYear}</span>
          <button
            onClick={() => setCurrentYear(currentYear + 1)}
            className="px-3 py-1 border rounded-lg hover:bg-gray-50"
          >
            {currentYear + 1} →
          </button>
        </div>
        <button
          onClick={() => setCurrentYear(new Date().getFullYear())}
          className="px-3 py-1 text-blue-600 hover:text-blue-800"
        >
          Today
        </button>
      </div>

      {/* Holidays by Month */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
          <Card key={month} className="overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h3 className="font-semibold text-gray-900">{getMonthName(month)}</h3>
            </div>
            <div className="p-4">
              {holidaysByMonth[month]?.length > 0 ? (
                <div className="space-y-2">
                  {holidaysByMonth[month].map(holiday => (
                    <div key={holiday._id} className="flex justify-between items-start border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(holiday.date).getDate()} - {holiday.name}
                          {holiday.isRecurring && <span className="ml-1 text-xs text-gray-400">(Annual)</span>}
                        </p>
                        {holiday.description && (
                          <p className="text-xs text-gray-500">{holiday.description}</p>
                        )}
                      </div>
                      {isAdmin && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditModal(holiday)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteHoliday(holiday._id, holiday.name)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No holidays</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Upcoming Holidays Summary */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50">
        <h3 className="font-semibold text-gray-900 mb-3">📅 Upcoming Holidays</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {holidays
            .filter(h => new Date(h.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 6)
            .map(holiday => (
              <div key={holiday._id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-red-600">
                    {new Date(holiday.date).getDate()}
                  </span>
                  <span className="text-xs text-red-500">
                    {new Date(holiday.date).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{holiday.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Add Holiday Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Holiday">
        <form onSubmit={handleAddHoliday} className="space-y-4">
          <Input
            label="Holiday Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Recurring yearly</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Additional details about this holiday..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Add Holiday
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Holiday Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Holiday">
        <form onSubmit={handleUpdateHoliday} className="space-y-4">
          <Input
            label="Holiday Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Recurring yearly</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Update Holiday
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HolidayManagement;