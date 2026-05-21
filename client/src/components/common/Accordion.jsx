// client/src/components/common/Accordion.jsx
import React, { useState } from 'react';

const Accordion = ({ items, allowMultiple = false, className = '' }) => {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (itemId) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setOpenItems(prev => prev.includes(itemId) ? [] : [itemId]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
          >
            <span className="font-medium">{item.title}</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${openItems.includes(item.id) ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openItems.includes(item.id) && (
            <div className="px-4 py-3 border-t">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;