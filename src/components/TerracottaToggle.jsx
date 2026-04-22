import React from 'react';
import { motion } from 'framer-motion';

const TerracottaToggle = ({
  id,
  checked,
  onChange,
  label,
  disabled,
  colorTheme = 'terra',
}) => {
  const themes = {
    terra: { fill: '#C96442', deep: '#9E4A2F' },
    brass: { fill: '#B88532', deep: '#8A6A32' },
    sage: { fill: '#6B8E23', deep: '#4F6B1A' },
    ink: { fill: '#1A1613', deep: '#0D0A08' },
    rose: { fill: '#C96442', deep: '#9E4A2F' },
    blue: { fill: '#6B8E23', deep: '#4F6B1A' },
    green: { fill: '#6B8E23', deep: '#4F6B1A' },
    amber: { fill: '#B88532', deep: '#8A6A32' },
    purple: { fill: '#8A6A32', deep: '#6B4E22' },
    cyan: { fill: '#6B8E23', deep: '#4F6B1A' },
    indigo: { fill: '#9E4A2F', deep: '#7A3622' },
  };

  const active = themes[colorTheme] || themes.terra;

  return (
    <div
      className={`flex items-center justify-between w-full group gap-6 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !disabled && onChange({ target: { checked: !checked } })}
    >
      <label
        htmlFor={id}
        className="font-fraunces text-base text-[#1A1613] select-none cursor-pointer italic tracking-tight"
        onClick={(e) => e.stopPropagation()}
      >
        {label}
      </label>

      <div className="relative inline-flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />

        {/* Track — a hairline rectangle, no pill, to match editorial/brand language */}
        <div
          className="w-14 h-7 transition-all duration-300 relative border"
          style={{
            borderColor: checked ? active.deep : '#1A161320',
            backgroundColor: checked ? `${active.fill}22` : '#E8DECE',
          }}
        >
          {/* Tick marks inside the track — 4 hairlines like a ruler */}
          <div className="absolute inset-0 flex items-center justify-around pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="w-px h-2"
                style={{ backgroundColor: checked ? `${active.deep}60` : '#1A161320' }}
              />
            ))}
          </div>
        </div>

        {/* Knob — hexagonal ink/terra bob, echoing the plumb-bob mark */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 left-0.5 w-5 h-6 flex items-center justify-center pointer-events-none"
          animate={{ x: checked ? 32 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <svg viewBox="0 0 20 24" width="20" height="24" aria-hidden="true">
            <path
              d="M 10 1 L 16 6 L 17 14 L 10 23 L 3 14 L 4 6 Z"
              fill={checked ? active.fill : '#1A1613'}
              stroke={checked ? active.deep : '#1A1613'}
              strokeWidth="0.75"
            />
            <path
              d="M 10 1 L 10 23 L 3 14 L 4 6 Z"
              fill={checked ? active.deep : '#2E2620'}
              opacity="0.55"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default TerracottaToggle;
