// client/src/components/common/FilterBar.jsx
import React, { useCallback, useMemo } from 'react';
import Select from './Select';

const FilterBar = ({ filters, options, onFilterChange, className = '' }) => {
  const handleChange = useCallback((key, value) => {
    onFilterChange?.(key, value);
  }, [onFilterChange]);

  const handleReset = useCallback(() => {
    if (onFilterChange) {
      Object.keys(options).forEach(key => {
        onFilterChange(key, '');
      });
    }
  }, [onFilterChange, options]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(v => v && v !== '');
  }, [filters]);

  const filterEntries = useMemo(() => Object.entries(options), [options]);

  const renderFilter = (key, config) => {
    const value = filters[key] || '';
    
    if (config.type === 'select') {
      return (
        <Select
          key={key}
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          options={config.options}
          placeholder={config.placeholder || `All ${key}`}
          className="min-w-[150px]"
        />
      );
    }
    
    if (config.type === 'date') {
      return (
        <input
          key={key}
          type="date"
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );
    }
    
    return null;
  };

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {filterEntries.map(([key, config]) => renderFilter(key, config))}
      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="px-3 py-2 text-sm text-red-600 hover:text-red-700"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;