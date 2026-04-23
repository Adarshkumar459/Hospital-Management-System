import React, { useCallback, useState } from 'react';
import { ToastContext } from '../hooks/toast-context';

const Toaster = () => {
  const context = React.useContext(ToastContext);

  if (!context || context.toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {context.toasts.map((toast) => (
        <div key={toast.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="font-semibold text-slate-900">{toast.title}</div>
          <p className="mt-1 text-sm text-slate-600">{toast.description}</p>
          <button
            type="button"
            onClick={() => context.removeToast(toast.id)}
            className="mt-3 text-xs text-blue-600 underline"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, title, description }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toastItem) => toastItem.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toastItem) => toastItem.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}
