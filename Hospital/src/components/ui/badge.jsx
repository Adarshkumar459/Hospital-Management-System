import React from 'react';

export function Badge({ children, className = '', ...props }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`} {...props}>
      {children}
    </span>
  );
}
