import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { XIcon } from '@phosphor-icons/react';

const Toast = ({ id, title, message, duration = 3000, removeToast }) => {
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
      className="text-gray-100 font-arvo py-4 px-10 rounded-lg shadow-lg border backdrop-blur-sm flex items-center justify-between w-96 mb-4
       transition-colors bg-toast-background border-toast-border hover:bg-toast-background/90"
    >
      <div className="flex flex-col text-sm group w-max flex-grow">
        <span className="text-base text-red-100">{title}</span>
        <hr className="mt-1 mb-1 min-w-max mr-5 border-red-200" />
        <span className="text-sm text-stone-200">{message}</span>
      </div>
      <button onClick={() => removeToast(id)} className="p-2 border rounded-sm shadow-2xl border-dashed rounded-xs hover:bg-toast-background/100 ">
        <XIcon size={24} weight="bold" className="text-shadow-lg "/>
      </button>
    </motion.div>
  );
};
export default Toast;
