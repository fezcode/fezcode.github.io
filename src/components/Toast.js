import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { XIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const Toast = ({
  id,
  title,
  message,
  duration = 3000,
  type,
  removeToast,
  icon,
  links,
}) => {
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
  const goldStyle =
    ' bg-toast-gold-background border-toast-gold-border hover:bg-toast-gold-background/90';
  const technoStyle =
    ' bg-toast-techno-background border-toast-techno-border hover:bg-toast-techno-background/90';
  // Techno Style
  const technoTextStyle = 'text-toast-techno-color';
  const technoHRStyle = 'border-toast-techno-color';
  // Toast Style
  let toastStyle = successStyle;
  // Toast Text Style
  let textStyle = 'text-red-100'
  // Toast HR Style
  let hrStyle = 'border-red-200'
  if (type === 'error') toastStyle = errorStyle;
  if (type === 'gold') toastStyle = goldStyle;
  if (type === 'techno') { toastStyle = technoStyle; textStyle = technoTextStyle; hrStyle = technoHRStyle; }

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`${defaultStyle} ${toastStyle}`}
    >
      <div className="flex flex-col text-sm group w-max flex-grow">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl text-red-100">{icon}</span>}
          <span className={`text-base ${textStyle}`}>{title}</span>
        </div>
        <motion.hr
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: duration / 1000 }}
          className={`mt-1 mb-1 min-w-max mr-5 ${hrStyle}`}
        />
        <span className="text-sm text-stone-200">{message}</span>
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 mr-5">
            {links.map((link, index) => {
              const buttonClass =
                'text-xs font-medium bg-white/20 hover:bg-white/30 text-white py-1.5 px-3 rounded transition-colors border border-white/10 shadow-sm';

              if (link.to) {
                return (
                  <Link
                    key={index}
                    to={link.to}
                    className={buttonClass}
                    onClick={() => removeToast(id)}
                  >
                    {link.label}
                  </Link>
                );
              }
              if (link.href) {
                return (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass}
                    onClick={() => removeToast(id)}
                  >
                    {link.label}
                  </a>
                );
              }
              if (link.onClick) {
                 return (
                  <button
                    key={index}
                    onClick={() => {
                        link.onClick();
                        removeToast(id);
                    }}
                    className={buttonClass}
                  >
                    {link.label}
                  </button>
                 )
              }
              return null;
            })}
          </div>
        )}
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
