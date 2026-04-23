import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const SelectContext = createContext(null);

export function Select({ value, onValueChange, children, className = '', ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleValueChange = (newValue) => {
    onValueChange(newValue);
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange, isOpen, setIsOpen }}>
      <div ref={containerRef} className={`relative ${className}`} {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className = '', ...props }) {
  const context = useContext(SelectContext);

  return (
    <div 
      className={`rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 cursor-pointer ${className}`} 
      onClick={() => context?.setIsOpen(!context?.isOpen)}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder, children, className = '', ...props }) {
  const context = useContext(SelectContext);
  const label = children || context?.value || placeholder || 'Select';

  return (
    <span className={`text-sm text-gray-700 ${className}`} {...props}>
      {label}
    </span>
  );
}

export function SelectContent({ children, className = '', ...props }) {
  const context = useContext(SelectContext);

  if (!context?.isOpen) return null;

  return (
    <div className={`absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SelectItem({ value, children, className = '', ...props }) {
  const context = useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => context?.onValueChange?.(value)}
      className={`w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
