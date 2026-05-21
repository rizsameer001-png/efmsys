// client/src/pages/error/AccountSuspended.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const AccountSuspended = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [countdown, setCountdown] = useState(5);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      showToast('Please login with an active account', 'info');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // API call to submit support request
      // await supportApi.submitRequest(contactForm);
      showToast('Support request submitted. We will contact you shortly.', 'success');
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      showToast('Failed to submit request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getSuspensionReason = () => {
    // In real app, fetch from API
    const reasons = {
      payment: 'Your account has been suspended due to pending payments.',
      violation: 'Account suspended due to policy violation.',
      admin: 'Account suspended by administrator.',
      verification: 'Account pending verification.',
      security: 'Account suspended for security reasons.'
    };
    return reasons.admin;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <Card className="overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-4">
              <span className="text-5xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Account Suspended</h1>
            <p className="text-red-100 mt-1">Access to your account has been restricted</p>
          </div>

          <div className="p-6">
            {/* Suspension Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <h3 className="font-semibold text-red-800">Account Access Restricted</h3>
                  <p className="text-sm text-red-700 mt-1">{getSuspensionReason()}</p>
                  {user && (
                    <p className="text-xs text-red-600 mt-2">
                      Account: {user.email} • Role: {user.role}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Auto Redirect Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⏰</span>
                  <div>
                    <p className="text-sm text-yellow-800">
                      Redirecting to login in <span className="font-bold">{countdown}</span> seconds
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Logout Now
                </Button>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-1 mt-3">
                <div 
                  className="bg-yellow-600 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Link to="/contact">
                <Button variant="primary" className="w-full">
                  📧 Contact Support
                </Button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                🔐 Logout
              </button>
            </div>

            {/* Help Section */}
            <div className="border-t pt-4">
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800 font-medium">
                  ❓ Why is my account suspended?
                </summary>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-gray-600 space-y-1">
                  <p>Common reasons for account suspension:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Pending payment or subscription renewal</li>
                    <li>Multiple failed login attempts</li>
                    <li>Violation of terms of service</li>
                    <li>Account verification required</li>
                    <li>Suspicious activity detected</li>
                  </ul>
                  <p className="mt-2">Please contact support for assistance.</p>
                </div>
              </details>
            </div>
          </div>
        </Card>

        {/* Support Contact Form */}
        <Card className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Support</h3>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your issue..."
                required
              />
            </div>
            <Button type="submit" isLoading={submitting} variant="primary" className="w-full">
              Submit Request
            </Button>
          </form>
        </Card>

        {/* Alternative Contact Methods */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Or contact us directly at{" "}
            <a href="mailto:support@fms.com" className="text-blue-600 hover:text-blue-700">
              support@fms.com
            </a>
            {" "}or call{" "}
            <a href="tel:+971800123456" className="text-blue-600 hover:text-blue-700">
              +971 800 123456
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSuspended;