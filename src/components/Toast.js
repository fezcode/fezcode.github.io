import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="fixed top-28 -translate-y-1/2 left-0 right-0 mx-auto text-gray-300 py-4 px-10 rounded-lg shadow-lg border backdrop-blur-sm flex items-center justify-between w-96"
      style={{ backgroundColor: 'rgba(68, 64, 59, 0.8)', borderColor: '#5a5e64' }}
    >
      <div className="flex flex-col text-sm">
        <span>{title}</span>
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="pr-2">
        <X size={24} weight="bold" />
      </button>
    </motion.div>
  );
};

export default Toast;
