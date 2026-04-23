import React from 'react';

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`min-h-30 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}
