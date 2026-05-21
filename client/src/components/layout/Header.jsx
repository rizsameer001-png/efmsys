// client/src/components/layout/Header.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import Dropdown from '../common/Dropdown';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const userMenuItems = [
    { label: 'My Profile', onClick: () => navigate('/profile') },
    { label: 'Settings', onClick: () => navigate('/settings') },
    { label: 'Change Password', onClick: () => navigate('/change-password') },
    { divider: true },
    { label: 'Logout', onClick: handleLogout, className: 'text-red-600' },
  ];
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center lg:hidden">
            <button
              onClick={onMenuClick}
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-end space-x-4">
            {/* Notifications */}
            <button className="relative text-gray-400 hover:text-gray-500 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {/* User Menu */}
            <Dropdown items={userMenuItems} align="right">
              <div className="flex items-center space-x-3 cursor-pointer">
                <Avatar name={`${user?.firstName} ${user?.lastName}`} size="sm" />
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;