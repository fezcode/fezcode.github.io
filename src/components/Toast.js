import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { XIcon } from '@phosphor-icons/react';
import colors from '../config/colors';

const Toast = ({ id, title, message, duration, removeToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [id, duration, removeToast]);

  return (
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="text-gray-300 py-4 px-10 rounded-lg shadow-lg border backdrop-blur-sm flex items-center justify-between w-96 mb-4"
        style={{ backgroundColor: colors['toast-background'], borderColor: colors['toast-border'] }}
      >
      <div className="flex flex-col text-sm">
        <span>{title}</span>
        <span>{message}</span>
      </div>
      <button onClick={() => removeToast(id)} className="pr-2">
        <XIcon size={24} weight="bold" />
      </button>
    </motion.div>
  );
};
export default Toast;
