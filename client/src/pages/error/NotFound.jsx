// client/src/pages/error/NotFound.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    const role = user.role;
    switch (role) {
      case 'super_admin':
        return '/dashboard/super-admin';
      case 'admin':
        return '/dashboard/admin';
      case 'manager':
        return '/dashboard/manager';
      case 'supervisor':
        return '/dashboard/supervisor';
      case 'technician':
        return '/dashboard/technician';
      case 'customer':
        return '/dashboard/customer';
      case 'hr':
        return '/dashboard/hr';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-blue-200">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl animate-bounce">🔍</div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleGoBack} variant="secondary">
            ← Go Back
          </Button>
          <Link to={getDashboardLink()}>
            <Button variant="primary">
              🏠 Go to Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary">
              🏠 Home Page
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a href="/contact" className="text-blue-600 hover:text-blue-700">
              Contact Support
            </a>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-100" />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-200" />
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-300" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;