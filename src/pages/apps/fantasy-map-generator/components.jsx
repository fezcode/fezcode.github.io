import React from 'react';
import { CaretDownIcon } from '@phosphor-icons/react';

const DISPLAY = '"DM Serif Display", "Fraunces", "EB Garamond", serif';
const SANS = '"Instrument Sans", "Outfit", system-ui, sans-serif';
const MONO = '"DM Mono", "IBM Plex Mono", monospace';

export const Slider = ({ label, value, min, max, step, onChange, hint, theme }) => {
  const pct = ((value - min) / (max - min)) * 100;
  const display =
    typeof value === 'number'
      ? Number.isInteger(value)
        ? value
        : value.toFixed(2)
      : value;
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-baseline gap-2 min-w-0">
        <label
          className="text-[10px] font-medium tracking-[0.18em] uppercase truncate"
          style={{ fontFamily: SANS, color: theme.muted }}
        >
          {label}
        </label>
        <span
          className="text-[11px] tabular-nums shrink-0"
          style={{ fontFamily: MONO, color: theme.ink }}
        >
          {display}
        </span>
      </div>
      <div className="relative h-3 w-full flex items-center group cursor-pointer">
        <div
          className="absolute w-full h-[2px]"
          style={{ background: theme.muted + '40' }}
        />
        <div
          className="absolute h-[2px]"
          style={{ width: `${pct}%`, background: theme.spot }}
        />
        <div
          className="absolute w-3.5 h-3.5 rounded-full transform -translate-x-1/2 transition-transform group-hover:scale-110"
          style={{
            left: `${pct}%`,
            background: theme.surface,
            border: `2px solid ${theme.ink}`,
            boxShadow: `0 0 0 2px ${theme.spot}`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      {hint && (
        <span
          className="text-[10px] italic"
          style={{ fontFamily: SANS, color: theme.muted }}
        >
          {hint}
        </span>
      )}
    </div>
  );
};

export const Toggle = ({ label, value, onChange, theme }) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    className="group flex items-center justify-between w-full py-1.5 transition-colors"
  >
    <span
      className="text-[12px] tracking-wide truncate pr-2"
      style={{ fontFamily: SANS, color: theme.ink }}
    >
      {label}
    </span>
    <span
      className="relative w-9 h-5 rounded-full transition-all shrink-0"
      style={{
        background: value ? theme.spot : theme.muted + '30',
        border: `1.5px solid ${theme.ink}`,
      }}
    >
      <span
        className="absolute top-1/2 w-3 h-3 rounded-full -translate-y-1/2 transition-all"
        style={{
          left: value ? 'calc(100% - 0.85rem)' : '0.15rem',
          background: theme.surface,
          border: `1.5px solid ${theme.ink}`,
        }}
      />
    </span>
  </button>
);

export const Select = ({ label, value, options, onChange, theme }) => (
  <div className="flex flex-col gap-1.5 w-full min-w-0">
    <label
      className="text-[10px] font-medium tracking-[0.18em] uppercase"
      style={{ fontFamily: SANS, color: theme.muted }}
    >
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none text-sm py-2 pl-3 pr-9 cursor-pointer transition-colors focus:outline-none truncate"
        style={{
          fontFamily: SANS,
          background: theme.surface,
          color: theme.ink,
          border: `1.5px solid ${theme.ink}`,
          borderRadius: 0,
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <CaretDownIcon
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        size={14}
        style={{ color: theme.spot }}
      />
    </div>
  </div>
);

export const Tab = ({ active, onClick, label, num, theme }) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative flex items-baseline gap-1.5 px-2 py-2 transition-all whitespace-nowrap"
    style={{
      fontFamily: SANS,
      color: active ? theme.ink : theme.muted,
    }}
  >
    <span
      className="text-[9px] tabular-nums tracking-wider"
      style={{ fontFamily: MONO, color: active ? theme.spot : theme.muted }}
    >
      {num}
    </span>
    <span className="text-[12px] uppercase tracking-wider font-medium">
      {label}
    </span>
    {active && (
      <span
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: theme.spot }}
      />
    )}
  </button>
);

export { DISPLAY, SANS, MONO };
