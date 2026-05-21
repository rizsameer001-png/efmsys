// client/src/components/common/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = true,
  hover = false,
  onClick 
}) => {
  const baseStyles = 'bg-white rounded-lg shadow-sm border border-gray-200';
  const paddingStyles = padding ? 'p-6' : '';
  const hoverStyles = hover ? 'hover:shadow-md transition-shadow cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseStyles} ${paddingStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;