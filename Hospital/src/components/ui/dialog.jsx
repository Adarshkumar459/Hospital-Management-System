import React from 'react';

export function Dialog({ open, onOpenChange, children }) {
  if (!open) {
    return null;
  }

  const handleBackdropClick = () => {
    onOpenChange?.(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="absolute inset-0" onClick={handleBackdropClick} />
      <div className="relative z-10 w-full max-w-3xl overflow-auto">{children}</div>
    </div>
  );
}

export function DialogContent({ children, className = '', ...props }) {
  return (
    <div className={`overflow-hidden rounded-3xl bg-white shadow-2xl ${className}`} {...props}>
      {children}
    </div>
  );
}

export function DialogHeader({ children, className = '', ...props }) {
  return (
    <div className={`border-b border-gray-200 px-6 py-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = '', ...props }) {
  return (
    <h2 className={`text-2xl font-bold text-gray-900 ${className}`} {...props}>
      {children}
    </h2>
  );
}

export function DialogTrigger({ children, onClick, className = '', ...props }) {
  return (
    <button type="button" onClick={onClick} className={className} {...props}>
      {children}
    </button>
  );
}
