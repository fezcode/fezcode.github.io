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
import * as LocalStorageManager from '../utils/LocalStorageManager';

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
  // ToastProvider sits above VisualSettingsProvider in the tree (circular
  // constraint — AchievementProvider toasts, VisualSettings depends on
  // Achievement), so we read the theme straight from localStorage. Toasts are
  // short-lived so reading once at mount is fine.
  const theme = LocalStorageManager.get('fezcodex-theme', 'brutalist');
  const isTerracotta = theme === 'terracotta';
  const isLuxe = theme === 'luxe';

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, removeToast]);

  /* ============================================================
   * TERRACOTTA TOAST — editorial margin note on bone paper
   * ============================================================ */
  if (isTerracotta) {
    const terraAccent = (() => {
      switch (type) {
        case 'error':
          return { color: '#9E4A2F', bg: '#9E4A2F' };
        case 'gold':
          return { color: '#B88532', bg: '#B88532' };
        case 'techno':
          return { color: '#6B8E23', bg: '#6B8E23' };
        default:
          return { color: '#C96442', bg: '#C96442' };
      }
    })();

    const terraIcon = (() => {
      if (icon) return icon;
      switch (type) {
        case 'error':
          return (
            <WarningCircleIcon weight="duotone" style={{ color: terraAccent.color }} />
          );
        case 'gold':
          return (
            <TrophyIcon weight="duotone" style={{ color: terraAccent.color }} />
          );
        case 'techno':
          return (
            <TerminalIcon weight="duotone" style={{ color: terraAccent.color }} />
          );
        default:
          return (
            <CheckCircleIcon weight="duotone" style={{ color: terraAccent.color }} />
          );
      }
    })();

    const badgeLabel = (() => {
      switch (type) {
        case 'error':
          return 'Stop · error';
        case 'gold':
          return 'Honor · unlocked';
        case 'techno':
          return 'System · note';
        default:
          return 'Notice · confirmed';
      }
    })();

    return (
      <motion.div
        layout
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-80 md:w-96 bg-[#F3ECE0] border border-[#1A161320] shadow-[0_20px_40px_-20px_rgba(26,22,19,0.25)] overflow-hidden mb-4 group font-fraunces"
      >
        {/* left terra rule — the "ink stripe" down the side */}
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ backgroundColor: terraAccent.color }}
        />

        {/* timer bar along the bottom */}
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-[2px] z-20"
          style={{ backgroundColor: terraAccent.bg, opacity: 0.55 }}
        />

        <div className="pl-6 pr-4 pt-4 pb-5 flex gap-4 items-start">
          <div className="flex-shrink-0 mt-0.5 text-[22px]">{terraIcon}</div>

          <div className="flex-grow min-w-0 space-y-1.5">
            {/* mono badge */}
            <div className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block w-[5px] h-[5px] rounded-full"
                style={{ backgroundColor: terraAccent.color }}
              />
              <span style={{ color: terraAccent.color }}>{badgeLabel}</span>
            </div>

            {/* title — Fraunces italic */}
            <h4
              className="text-[17px] italic tracking-tight text-[#1A1613] leading-tight"
              style={{
                fontVariationSettings:
                  '"opsz" 24, "SOFT" 80, "WONK" 1, "wght" 440',
              }}
            >
              {title}
            </h4>

            {/* message — mono body */}
            <p className="font-ibm-plex-mono text-[11px] leading-[1.55] text-[#2E2620]">
              {message}
            </p>

            {links && links.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {links.map((link, index) => {
                  const btnClass =
                    'font-ibm-plex-mono text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 border border-[#1A161320] text-[#1A1613] hover:bg-[#1A1613] hover:text-[#F3ECE0] hover:border-[#1A1613] transition-colors';
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
                        type="button"
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
            type="button"
            onClick={() => removeToast(id)}
            className="flex-shrink-0 text-[#2E2620]/50 hover:text-[#9E4A2F] transition-colors p-1"
            aria-label="Dismiss"
          >
            <XIcon size={14} weight="bold" />
          </button>
        </div>
      </motion.div>
    );
  }

  /* ============================================================
   * LUXE TOAST — refined cream card with bronze rule + serif title
   * ============================================================ */
  if (isLuxe) {
    const luxeAccent = (() => {
      switch (type) {
        case 'error':
          return '#7A2020';
        case 'gold':
          return '#B88532';
        case 'techno':
          return '#355E3B';
        default:
          return '#8D4004';
      }
    })();

    const luxeIcon = (() => {
      if (icon) return icon;
      const common = { weight: 'duotone', style: { color: luxeAccent } };
      switch (type) {
        case 'error':
          return <WarningCircleIcon {...common} />;
        case 'gold':
          return <TrophyIcon {...common} />;
        case 'techno':
          return <TerminalIcon {...common} />;
        default:
          return <CheckCircleIcon {...common} />;
      }
    })();

    const luxeKicker = (() => {
      switch (type) {
        case 'error':
          return 'Alert';
        case 'gold':
          return 'Accolade';
        case 'techno':
          return 'System';
        default:
          return 'Notice';
      }
    })();

    return (
      <motion.div
        layout
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="relative w-80 md:w-[380px] bg-[#FAFAF8] border border-[#1A1A1A]/10 shadow-[0_24px_48px_-24px_rgba(26,26,26,0.28)] rounded-sm overflow-hidden mb-4 group"
      >
        {/* top hairline accent */}
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ backgroundColor: luxeAccent, opacity: 0.55 }}
        />
        {/* bottom timer */}
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-[1px] z-20"
          style={{ backgroundColor: luxeAccent, opacity: 0.55 }}
        />

        <div className="px-6 py-5 flex gap-4 items-start">
          <div
            className="flex-shrink-0 mt-0.5 text-[22px] w-9 h-9 flex items-center justify-center rounded-full"
            style={{ backgroundColor: `${luxeAccent}12` }}
          >
            {luxeIcon}
          </div>

          <div className="flex-grow min-w-0 space-y-1.5">
            <div
              className="font-outfit text-[9.5px] tracking-[0.24em] uppercase"
              style={{ color: luxeAccent }}
            >
              {luxeKicker}
            </div>
            <h4 className="font-playfairDisplay text-[19px] italic leading-tight text-[#1A1A1A]">
              {title}
            </h4>
            <p className="font-outfit text-[12.5px] leading-[1.55] text-[#1A1A1A]/70">
              {message}
            </p>

            {links && links.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2.5">
                {links.map((link, index) => {
                  const btnClass =
                    'font-outfit text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 border border-[#1A1A1A]/15 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAFAF8] hover:border-[#1A1A1A] transition-colors rounded-sm';
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
                        type="button"
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
            type="button"
            onClick={() => removeToast(id)}
            className="flex-shrink-0 text-[#1A1A1A]/30 hover:text-[#1A1A1A] transition-colors p-1"
            aria-label="Dismiss"
          >
            <XIcon size={14} weight="bold" />
          </button>
        </div>
      </motion.div>
    );
  }

  /* ============================================================
   * DEFAULT TOAST — brutalist dark card (legacy)
   * ============================================================ */

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
                      type="button"
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
          type="button"
          onClick={() => removeToast(id)}
          className="flex-shrink-0 text-gray-600 hover:text-white transition-colors p-1"
        >
          <XIcon size={16} weight="bold" />
        </button>
      </div>

      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />
    </motion.div>
  );
};

export default Toast;
