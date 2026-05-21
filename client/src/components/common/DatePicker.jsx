// client/src/components/common/DatePicker.jsx
import React, { useState, useRef, useEffect } from 'react';

const DatePicker = ({ value, onChange, placeholder = 'Select date', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    onChange(date);
    setIsOpen(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <input
        type="text"
        value={value ? formatDate(value) : ''}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        readOnly
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      />
      
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border rounded-lg shadow-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              &lt;
            </button>
            <span className="font-medium">
              {viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()}
            </span>
            <button
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              &gt;
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map(day => (
              <div key={day} className="text-center text-xs text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(viewDate).map((date, idx) => (
              <button
                key={idx}
                onClick={() => date && handleDateSelect(date)}
                disabled={!date}
                className={`text-center py-1 text-sm rounded ${
                  date && value && date.toDateString() === value.toDateString()
                    ? 'bg-blue-600 text-white'
                    : date
                    ? 'hover:bg-gray-100'
                    : 'text-gray-300'
                }`}
              >
                {date?.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;