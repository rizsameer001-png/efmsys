// client/src/components/common/Rating.jsx
import React, { useState } from 'react';

const Rating = ({ value, onChange, readonly = false, size = 'md', max = 5 }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const handleClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  const getStarColor = (star) => {
    const ratingValue = hoverValue || value || 0;
    return star <= ratingValue ? 'text-yellow-400' : 'text-gray-300';
  };

  return (
    <div className="flex items-center space-x-1" onMouseLeave={handleMouseLeave}>
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            className={`${sizes[size]} ${getStarColor(starValue)} transition-colors focus:outline-none ${!readonly ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            disabled={readonly}
          >
            ★
          </button>
        );
      })}
      {value && <span className="ml-2 text-sm text-gray-500">({value}/5)</span>}
    </div>
  );
};

export default Rating;