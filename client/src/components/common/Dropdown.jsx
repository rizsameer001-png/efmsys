// client/src/components/common/Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ trigger, items, onSelect, align = 'left', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setIsOpen(false);
    if (onSelect) onSelect(item);
    if (item.onClick) item.onClick();
  };

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`absolute z-50 mt-2 min-w-[160px] bg-white rounded-lg shadow-lg border border-gray-200 py-1 ${alignClasses[align]}`}>
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(item)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                item.disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${item.className || ''}`}
              disabled={item.disabled}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
              {item.shortcut && <span className="ml-2 text-xs text-gray-400">{item.shortcut}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;