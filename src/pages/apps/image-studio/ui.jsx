/**
 * ui.jsx — the "Darkroom" design system.
 *
 * A self-contained set of primitives + a scoped stylesheet that give the merged
 * image studio its 2026 look: warm charcoal, safelight-amber accent, film grain,
 * Fraunces display / Outfit body / IBM Plex Mono technical type. Everything is
 * namespaced under `.darkroom` so it never leaks into the rest of the site.
 */
import React from 'react';
import { motion } from 'framer-motion';

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const CSS = `
.darkroom {
  --dk-void: #0b0806;
  --dk-void-2: #130d0a;
  --dk-paper: #f4ece0;
  --dk-ink: #b9ab98;
  --dk-mute: #82715d;
  --dk-faint: #4c4035;
  --dk-line: rgba(255, 200, 150, 0.13);
  --dk-line-soft: rgba(255, 200, 150, 0.06);
  --dk-safe: #ff5a36;
  --dk-safe-2: #ff9355;
  --dk-glass: rgba(30, 22, 18, 0.58);
  --dk-glass-2: rgba(20, 15, 12, 0.46);
  position: relative;
  min-height: 100vh;
  color: var(--dk-ink);
  font-family: 'Outfit', system-ui, sans-serif;
  background:
    radial-gradient(115% 80% at 88% -12%, rgba(255, 90, 54, 0.18), transparent 55%),
    radial-gradient(90% 70% at 6% 112%, rgba(255, 147, 85, 0.08), transparent 60%),
    linear-gradient(180deg, var(--dk-void-2) 0%, var(--dk-void) 60%);
  overflow-x: hidden;
}
.darkroom::before {
  content: '';
  position: fixed;
  inset: -50%;
  background-image: ${GRAIN};
  background-size: 200px 200px;
  opacity: 0.05;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 0;
  animation: dk-grain 0.6s steps(2) infinite;
}
.darkroom::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(130% 100% at 50% 40%, transparent 55%, rgba(0,0,0,0.55) 100%);
}
.dk-display { font-family: 'Fraunces', 'Times New Roman', serif; }
.dk-mono { font-family: 'IBM Plex Mono', monospace; }

.darkroom ::selection { background: rgba(255, 90, 54, 0.32); color: #fff; }

.dk-glass {
  position: relative;
  background:
    linear-gradient(180deg, var(--dk-glass), var(--dk-glass-2));
  border: 1px solid var(--dk-line);
  border-radius: 18px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow:
    0 1px 0 rgba(255, 220, 190, 0.05) inset,
    0 30px 60px -30px rgba(0, 0, 0, 0.8);
}

.dk-safe-glow { box-shadow: 0 0 0 1px rgba(255,90,54,0.4), 0 0 34px -6px rgba(255,90,54,0.5); }

/* range slider */
.darkroom input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--dk-safe), var(--dk-safe-2));
  border-radius: 99px;
  outline: none;
  cursor: pointer;
}
.darkroom input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--dk-paper);
  border: 3px solid var(--dk-safe);
  box-shadow: 0 0 14px -2px var(--dk-safe);
  transition: transform 0.15s ease;
}
.darkroom input[type='range']::-webkit-slider-thumb:hover { transform: scale(1.18); }
.darkroom input[type='range']::-moz-range-thumb {
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--dk-paper); border: 3px solid var(--dk-safe);
}

.dk-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
.dk-scroll::-webkit-scrollbar-track { background: transparent; }
.dk-scroll::-webkit-scrollbar-thumb { background: var(--dk-faint); border-radius: 99px; }

@keyframes dk-grain {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-6px, 4px); }
}
@keyframes dk-rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
.dk-rise { animation: dk-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
`;

export function DarkroomStyles() {
  return <style>{CSS}</style>;
}

/* --------------------------------------------------------------- primitives */

export function SectionLabel({ index, children, className = '' }) {
  return (
    <div
      className={`dk-mono flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.34em] ${className}`}
      style={{ color: 'var(--dk-mute)' }}
    >
      {index != null && (
        <span style={{ color: 'var(--dk-safe)' }}>{index}</span>
      )}
      <span>{children}</span>
      <span className="h-px flex-1" style={{ background: 'var(--dk-line)' }} />
    </div>
  );
}

export function Panel({ children, className = '', glow = false, ...rest }) {
  return (
    <div
      className={`dk-glass ${glow ? 'dk-safe-glow' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SolidButton({
  children,
  icon: Icon,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[13px] font-semibold tracking-wide transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30 ${className}`}
      style={{
        background: disabled
          ? 'rgba(255,255,255,0.05)'
          : 'linear-gradient(180deg, var(--dk-safe-2), var(--dk-safe))',
        color: disabled ? 'var(--dk-mute)' : '#1b0d07',
        boxShadow: disabled ? 'none' : '0 10px 30px -10px rgba(255,90,54,0.7)',
      }}
    >
      {Icon && <Icon size={17} weight="bold" />}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  icon: Icon,
  onClick,
  disabled = false,
  active = false,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full border px-5 py-3 text-[12px] font-medium uppercase tracking-[0.18em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30 ${className}`}
      style={{
        borderColor: active ? 'var(--dk-safe)' : 'var(--dk-line)',
        color: active ? 'var(--dk-paper)' : 'var(--dk-ink)',
        background: active ? 'rgba(255,90,54,0.10)' : 'transparent',
      }}
    >
      {Icon && <Icon size={16} weight="bold" />}
      {children}
    </button>
  );
}

export function RangeSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  format,
}) {
  const display = format ? format(value) : `${value}${unit}`;
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span
          className="dk-mono text-[10px] uppercase tracking-[0.28em]"
          style={{ color: 'var(--dk-mute)' }}
        >
          {label}
        </span>
        <span
          className="dk-mono text-[12px] font-semibold"
          style={{ color: 'var(--dk-safe)' }}
        >
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

export function ColorField({ label, value, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span
        className="dk-mono text-[10px] uppercase tracking-[0.28em]"
        style={{ color: 'var(--dk-mute)' }}
      >
        {label}
      </span>
      <span
        className="flex items-center gap-3 rounded-full border px-3 py-1.5"
        style={{ borderColor: 'var(--dk-line)' }}
      >
        <span
          className="dk-mono text-[11px] uppercase"
          style={{ color: 'var(--dk-ink)' }}
        >
          {value}
        </span>
        <span
          className="relative h-6 w-6 overflow-hidden rounded-full border"
          style={{ background: value, borderColor: 'var(--dk-line)' }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </span>
      </span>
    </label>
  );
}

/** Animated segmented control. Options: [{ value, label, icon? }] */
export function SegmentedControl({ options, value, onChange, layoutId = 'seg' }) {
  return (
    <div
      className="inline-flex rounded-full border p-1"
      style={{ borderColor: 'var(--dk-line)', background: 'rgba(0,0,0,0.25)' }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium tracking-wide transition-colors duration-300"
            style={{ color: active ? '#1b0d07' : 'var(--dk-ink)' }}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'linear-gradient(180deg, var(--dk-safe-2), var(--dk-safe))',
                  boxShadow: '0 8px 22px -10px rgba(255,90,54,0.8)',
                }}
              />
            )}
            {Icon && <Icon size={15} weight="bold" className="relative z-10" />}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Stat({ label, value, accent = false }) {
  return (
    <div className="space-y-1">
      <div
        className="dk-mono text-[9px] uppercase tracking-[0.28em]"
        style={{ color: 'var(--dk-mute)' }}
      >
        {label}
      </div>
      <div
        className="dk-mono text-sm font-semibold"
        style={{ color: accent ? 'var(--dk-safe)' : 'var(--dk-paper)' }}
      >
        {value}
      </div>
    </div>
  );
}

export const formatBytes = (bytes) => {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};
