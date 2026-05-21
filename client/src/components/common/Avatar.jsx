// client/src/components/common/Avatar.jsx
import React from 'react';

const Avatar = ({ name, size = 'md', src, className = '' }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-32 h-32 text-4xl',
  };

  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
  ];

  const getColor = (name) => {
    if (!name) return colors[0];
    const index = name.length % colors.length;
    return colors[index];
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-medium ${getColor(name)} ${sizes[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;