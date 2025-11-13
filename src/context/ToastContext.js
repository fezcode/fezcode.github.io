import React, { createContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

export const ToastContext = createContext();

let id = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const newToast = { ...toast, id: id++ };
    setToasts((prevToasts) => {
      if (prevToasts.length >= 5) {
        const updatedToasts = prevToasts.slice(0, prevToasts.length - 1);
        return [newToast, ...updatedToasts];
      }
      return [newToast, ...prevToasts];
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-28 right-10 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            type={toast.type}
            removeToast={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
