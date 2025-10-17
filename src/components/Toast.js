import React, { useState, useEffect } from 'react';

import { X } from '@phosphor-icons/react';

const Toast = ({ title, message, duration, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <div
      className="fixed top-28 left-1/2 -translate-x-1/2 text-gray-300 py-4 px-10 rounded-lg shadow-lg border backdrop-blur-sm flex items-center justify-between w-96"
      style={{ backgroundColor: 'rgba(68, 64, 59, 0.65)', borderColor: '#5a5e64' }}
    >
      <div className="flex flex-col text-sm">
        <span>{title}</span>
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="pr-2">
        <X size={24} weight="bold" />
      </button>
    </div>
  );
};

export default Toast;
