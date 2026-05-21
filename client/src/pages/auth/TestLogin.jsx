// client/src/pages/auth/TestLogin.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const TestLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/test/login`, formData);
      
      if (response.data.success) {
        localStorage.setItem('testToken', response.data.data.token);
        localStorage.setItem('testUser', JSON.stringify(response.data.data.user));
        alert('Login successful! Redirecting to dashboard...');
        navigate('/test-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo accounts
  const demoAccounts = [
    { email: 'test@example.com', password: '123456', name: 'Test User' }
  ];

  const fillDemoAccount = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Test Login</h2>
          <p className="text-gray-600 mt-2">Sign in to your test account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="test@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3 text-center">Demo Accounts:</p>
          <div className="space-y-2">
            {demoAccounts.map((account, idx) => (
              <button
                key={idx}
                onClick={() => fillDemoAccount(account.email, account.password)}
                className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                <span className="font-medium">{account.email}</span>
                <span className="text-gray-500 ml-2">password: {account.password}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/test-register" className="text-green-500 hover:text-green-600">
              Register here
            </Link>
          </p>
          <p className="text-xs text-gray-400 mt-4">
            This is a test login for demo purposes
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestLogin;