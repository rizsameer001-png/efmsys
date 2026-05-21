// client/src/components/common/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search...',
  debounceDelay = 300,
  loading = false,
  suggestions = [],
  onSuggestionClick,
  className = '',
  autoFocus = false,
  size = 'md',
  variant = 'default',
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const debouncedValue = useDebounce(localValue, debounceDelay);
  const suggestionsRef = useRef(null);

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Trigger search on debounced value change
  useEffect(() => {
    if (onSearch && debouncedValue !== value) {
      onSearch(debouncedValue);
    }
    if (onChange) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onSearch, onChange, value]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(localValue);
      setShowSuggestions(false);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setLocalValue('');
    if (onSearch) onSearch('');
    if (onChange) onChange('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalValue(suggestion.label || suggestion);
    if (onSearch) onSearch(suggestion.label || suggestion);
    if (onSuggestionClick) onSuggestionClick(suggestion);
    setShowSuggestions(false);
  };

  const sizes = {
    sm: 'px-2 py-1.5 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-2.5 text-lg',
  };

  const variants = {
    default: 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    gray: 'bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500',
    outline: 'bg-transparent border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            if (localValue.length > 0 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            setIsFocused(false);
            // Delay closing suggestions to allow for click
            setTimeout(() => {
              if (!suggestionsRef.current?.contains(document.activeElement)) {
                setShowSuggestions(false);
              }
            }, 200);
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`
            block w-full pl-10 pr-10 
            border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${sizes[size]} 
            ${variants[variant]}
          `}
        />

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {/* Clear Button */}
        {!loading && localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 transition-colors"
            >
              {/* Suggestion Icon */}
              {suggestion.icon && (
                <span className="text-gray-400">{suggestion.icon}</span>
              )}
              
              {/* Suggestion Content */}
              <div className="flex-1">
                <div className="text-sm text-gray-900">
                  {suggestion.label || suggestion}
                </div>
                {suggestion.description && (
                  <div className="text-xs text-gray-500">
                    {suggestion.description}
                  </div>
                )}
              </div>
              
              {/* Suggestion Metadata */}
              {suggestion.metadata && (
                <span className="text-xs text-gray-400">
                  {suggestion.metadata}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {showSuggestions && localValue && suggestions.length === 0 && !loading && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
          <p className="text-sm text-gray-500">No results found for "{localValue}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;