import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useSnf } from '../../context/SnfContext';

/* Bezeled industrial panel. */
export const SnfPanel = ({
  as: Tag = 'div',
  bracket = false,
  glow = false,
  className = '',
  children,
  ...rest
}) => (
  <Tag
    className={`snf-panel ${bracket ? 'snf-panel-bracket' : ''} ${
      glow ? 'snf-box-glow' : ''
    } ${className}`}
    {...rest}
  >
    {children}
  </Tag>
);

/* Tactile button — renders a Link when `to` is provided. */
export const SnfButton = ({
  to,
  href,
  primary = false,
  className = '',
  children,
  ...rest
}) => {
  const cls = `snf-btn inline-flex items-center justify-center gap-2 ${
    primary ? 'snf-btn-primary' : ''
  } px-5 py-2.5 text-[11px] ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
};

/* Hardware toggle switch. */
export const SnfToggle = ({ on, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    className="snf-toggle"
    data-on={on ? '1' : '0'}
    onClick={() => onChange(!on)}
  >
    <span className="snf-toggle-knob" />
  </button>
);

/* Styled native select (keeps native a11y + mobile pickers). */
export const SnfSelect = ({ value, onChange, options, className = '', ...rest }) => (
  <select
    className={`snf-select ${className}`}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    {...rest}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

/* Slider. */
export const SnfRange = ({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.05,
  className = '',
  ...rest
}) => (
  <input
    type="range"
    className={`snf-range ${className}`}
    value={value}
    min={min}
    max={max}
    step={step}
    onChange={(e) => onChange(parseFloat(e.target.value))}
    {...rest}
  />
);

/* Terminal-style search field with a blinking prompt. */
export const SnfSearchInput = ({ value, onChange, placeholder = 'query archive…' }) => (
  <div className="snf-input flex items-center gap-3 px-4 py-3 w-full">
    <MagnifyingGlassIcon
      size={18}
      weight="bold"
      className="snf-phos-text flex-none"
    />
    <span className="snf-vt snf-phos-text text-lg leading-none select-none">
      &gt;
    </span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-transparent border-none outline-none w-full snf-mono text-sm tracking-wide text-[var(--snf-ink)] placeholder:text-[var(--snf-ink-dim)]"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        className="snf-dim hover:snf-phos-text flex-none"
        aria-label="clear search"
      >
        <XIcon size={16} weight="bold" />
      </button>
    )}
  </div>
);

/* Status indicator pill — classifies free-text status into ok/warn/dead. */
export const SnfPill = ({ status }) => {
  const s = (status || '').toLowerCase();
  let tone = 'snf-pill-ok';
  if (
    s.includes('decease') ||
    s.includes('dead') ||
    s.includes('killed') ||
    s.includes('destroyed')
  ) {
    tone = 'snf-pill-dead';
  } else if (
    s.includes('hollow') ||
    s.includes('scarred') ||
    s.includes('unknown') ||
    s.includes('missing') ||
    s.includes('abandon')
  ) {
    tone = 'snf-pill-warn';
  }
  return (
    <span className={`snf-pill ${tone}`}>
      <span className="snf-led" style={{ background: 'currentColor', boxShadow: 'none' }} />
      {status}
    </span>
  );
};

/* Section header used across pages. */
export const SnfPageHeader = ({ fileNo, label, title, subtitle, icon }) => (
  <header className="mb-10 md:mb-14">
    <div className="flex items-center gap-3 mb-3 snf-vt text-base md:text-lg snf-phos-text">
      <span className="snf-dim">FILE</span>
      <span>{fileNo}</span>
      <span className="snf-divider flex-grow" />
      <span className="snf-dim hidden sm:inline">{label}</span>
    </div>
    <div className="flex items-center gap-4">
      {icon && <span className="snf-phos-text snf-glow flex-none">{icon}</span>}
      <h1 className="snf-display snf-glow snf-aberrate text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] text-[var(--snf-phos)]">
        {title}
      </h1>
    </div>
    {subtitle && (
      <p className="snf-mono text-sm md:text-base snf-dim mt-4 max-w-2xl leading-relaxed">
        {subtitle}
      </p>
    )}
  </header>
);

/* Reusable detail modal (dossier popout). */
export const SnfModal = ({ open, onClose, kicker, children }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[400] flex items-center justify-center p-3 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-[3px]"
        />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="snf-panel snf-panel-bracket snf-box-glow relative w-full max-w-2xl max-h-[88vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="snf-bar flex items-center justify-between px-4 py-2.5 sticky top-0 z-10">
            <span className="snf-vt snf-phos-text text-base truncate pr-4">
              {kicker || 'CLASSIFIED RECORD'}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="close record"
              className="snf-dim hover:text-[var(--snf-phos)] transition-colors"
            >
              <XIcon size={22} weight="bold" />
            </button>
          </div>
          <div className="p-5 md:p-8">{children}</div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
  );
};

/* Empty-state line. */
export const SnfEmpty = ({ children }) => (
  <div className="col-span-full text-center py-16 snf-mono snf-dim text-sm">
    <span className="snf-vt snf-phos-text text-xl mr-2">!</span>
    {children}
  </div>
);

/* Animated wrapper that respects reduced motion. */
export const SnfReveal = ({ delay = 0, className = '', children }) => {
  const { prefersReducedMotion } = useSnf();
  if (prefersReducedMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
