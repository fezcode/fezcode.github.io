import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  XIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  TrophyIcon,
  TerminalIcon,
} from '@phosphor-icons/react';
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

    return () => clearTimeout(timer);
  }, [id, duration, removeToast]);

  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'error':
        return <WarningCircleIcon weight="fill" className="text-red-500" />;
      case 'gold':
        return <TrophyIcon weight="fill" className="text-amber-400" />;
      case 'techno':
        return <TerminalIcon weight="fill" className="text-emerald-400" />;
      default:
        return <CheckCircleIcon weight="fill" className="text-emerald-500" />;
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-500';
      case 'gold':
        return 'bg-amber-400';
      case 'techno':
        return 'bg-emerald-400';
      default:
        return 'bg-emerald-500';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'error':
        return 'border-red-500/50';
      case 'gold':
        return 'border-amber-400/50';
      case 'techno':
        return 'border-emerald-400/50';
      default:
        return 'border-emerald-500/50';
    }
  };

  const getGlowColor = () => {
    switch (type) {
      case 'error':
        return 'shadow-red-500/10';
      case 'gold':
        return 'shadow-amber-400/10';
      case 'techno':
        return 'shadow-emerald-400/10';
      default:
        return 'shadow-emerald-500/10';
    }
  };

  return (
    <motion.div
      layout
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`relative w-80 md:w-96 bg-[#050505]/95 backdrop-blur-xl border-2 ${getBorderColor()} rounded-sm shadow-2xl ${getGlowColor()} overflow-hidden mb-4 group`}
    >
      {/* Dynamic Timer Bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-1 z-20 ${getAccentColor()}`}
      />

      <div className="p-6 flex gap-4 items-start">
        <div className="flex-shrink-0 mt-1">
          <div className="text-xl">{getIcon()}</div>
        </div>

        <div className="flex-grow min-w-0 space-y-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-white leading-tight">
            {title}
          </h4>
          <p className="text-[11px] font-mono leading-relaxed text-gray-400">
            {message}
          </p>

          {links && links.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3">
              {links.map((link, index) => {
                const btnClass =
                  'text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all rounded-sm';
                if (link.to)
                  return (
                    <Link
                      key={index}
                      to={link.to}
                      className={btnClass}
                      onClick={() => removeToast(id)}
                    >
                      {link.label}
                    </Link>
                  );
                if (link.href)
                  return (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={btnClass}
                      onClick={() => removeToast(id)}
                    >
                      {link.label}
                    </a>
                  );
                if (link.onClick)
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        link.onClick();
                        removeToast(id);
                      }}
                      className={btnClass}
                    >
                      {link.label}
                    </button>
                  );
                return null;
              })}
            </div>
          )}
        </div>

        <button
          onClick={() => removeToast(id)}
          className="flex-shrink-0 text-gray-600 hover:text-white transition-colors p-1"
        >
          <XIcon size={16} weight="bold" />
        </button>
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />
    </motion.div>
  );
};

export default Toast;
