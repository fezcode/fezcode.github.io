import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { XIcon } from '@phosphor-icons/react';

const Toast = ({ id, title, message, duration = 3000, type, removeToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [id, duration, removeToast]);

  const defaultStyle =
    'text-gray-100 font-arvo py-4 px-10 rounded-lg shadow-lg border backdrop-blur-sm flex items-center justify-between w-96 mb-4 transition-colors';
  const successStyle =
    ' bg-toast-background border-toast-border hover:bg-toast-background/90';
  const errorStyle =
    ' bg-toast-error-background border-toast-error-border hover:bg-toast-error-background/90';
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`${defaultStyle} ${type === 'error' ? `${errorStyle}` : `${successStyle}`}`}
    >
      <div className="flex flex-col text-sm group w-max flex-grow">
        <span className="text-base text-red-100">{title}</span>
        <motion.hr
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: duration / 1000 }}
          className="mt-1 mb-1 min-w-max mr-5 border-red-200"
        />
        <span className="text-sm text-stone-200">{message}</span>
      </div>
      <button
        onClick={() => removeToast(id)}
        className="p-2 border rounded-sm shadow-2xl border-dashed rounded-xs hover:bg-toast-background/100 "
      >
        <XIcon size={24} weight="bold" className="text-shadow-lg " />
      </button>
    </motion.div>
  );
};
export default Toast;
