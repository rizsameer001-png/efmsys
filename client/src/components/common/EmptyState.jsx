// client/src/components/common/EmptyState.jsx
import React from 'react';
import Button from './Button';

const EmptyState = ({ 
  title = 'No data found', 
  description = 'Try adjusting your search or filter to find what you\'re looking for.',
  icon,
  actionText,
  onAction,
  className = '' 
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon ? (
        <div className="text-6xl mb-4">{icon}</div>
      ) : (
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )}
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {actionText && onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>{actionText}</Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;