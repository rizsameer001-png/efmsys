/**
 * TASK PROGRESS BAR COMPONENT
 * Displays task completion progress
 */

import React from 'react';

const TaskProgressBar = ({ percentage, size = 'md', showLabel = true, animated = true }) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };
  
  const getColor = (percentage) => {
    if (percentage < 30) return 'bg-red-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{clampedPercentage}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${getColor(clampedPercentage)} ${sizes[size]} rounded-full transition-all duration-500 ${
            animated ? 'transition-all' : ''
          }`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default TaskProgressBar;