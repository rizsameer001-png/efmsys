// client/src/pages/TestDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const TestDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('testToken');
    if (!token) {
      navigate('/test-login');
      return;
    }

    // Get user info
    axios.get(`${API_URL}/test/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setUser(response.data.data);
      setLoading(false);
    })
    .catch(() => {
      localStorage.removeItem('testToken');
      navigate('/test-login');
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('testToken');
    localStorage.removeItem('testUser');
    navigate('/test-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Test Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
          <div className="space-y-3">
            <p><strong>Name:</strong> {user?.name || 'User'}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>User ID:</strong> {user?._id}</p>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              ✅ Login successful! This is your test dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;