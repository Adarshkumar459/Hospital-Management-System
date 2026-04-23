import React from 'react';

export function Button({ children, className = '', variant, size, ...props }) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  const variantStyles =
    variant === 'outline'
      ? 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100'
      : variant === 'ghost'
      ? 'bg-transparent text-gray-900 hover:bg-gray-100'
      : variant === 'secondary'
      ? 'border border-blue-600 bg-white text-blue-600 hover:bg-gray-100'
      : 'bg-blue-600 text-white hover:bg-blue-700';
  const sizeStyles =
    size === 'sm'
      ? 'px-3 py-2 text-sm'
      : size === 'lg'
      ? 'px-5 py-3 text-base'
      : 'px-4 py-2';

  return (
    <button className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
