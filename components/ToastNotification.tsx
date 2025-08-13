
import React, { useState, useEffect } from 'react';
import { ToastNotification as ToastType } from '../types';
import { CloseIcon } from './icons';

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: number) => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const toastStyles = {
    info: 'bg-blue-500 border-blue-400',
    success: 'bg-green-500 border-green-400',
    error: 'bg-red-500 border-red-400',
  };

  return (
    <div
      className={`relative w-full max-w-sm p-4 rounded-lg shadow-2xl text-white border-l-4 transition-all duration-300 transform ${toastStyles[toast.type]} ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
      role="alert"
    >
      <div className="flex items-center">
        <p className="flex-grow font-semibold">{toast.message}</p>
        <button
          onClick={handleDismiss}
          className="ml-4 p-1 rounded-full hover:bg-black/20"
          aria-label="Dismiss"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
