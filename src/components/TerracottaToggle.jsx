import React from 'react';
import { motion } from 'framer-motion';

/**
 * Terracotta toggle — a small "level" with a plumb-bob knob that slides inside
 * the track. True/on = bob rests on the right (terra fill behind it); off = bob
 * rests on the left on bone-deep. No rounded pill — a rectangle, like a mason's
 * spirit level.
 */
const THEMES = {
  terra: { fill: '#C96442', deep: '#9E4A2F' },
  brass: { fill: '#B88532', deep: '#8A6A32' },
  sage: { fill: '#6B8E23', deep: '#4F6B1A' },
  ink: { fill: '#1A1613', deep: '#0D0A08' },
  // map generic-named themes to closest terracotta equivalent
  rose: { fill: '#C96442', deep: '#9E4A2F' },
  blue: { fill: '#6B8E23', deep: '#4F6B1A' },
  green: { fill: '#6B8E23', deep: '#4F6B1A' },
  amber: { fill: '#B88532', deep: '#8A6A32' },
  purple: { fill: '#8A6A32', deep: '#6B4E22' },
  cyan: { fill: '#6B8E23', deep: '#4F6B1A' },
  indigo: { fill: '#9E4A2F', deep: '#7A3622' },
};

// Dimensions chosen so the bob fits comfortably inside the track.
const TRACK_W = 48;
const TRACK_H = 22;
const BOB_W = 14;
const BOB_H = 18;
const PAD = 3;
const TRAVEL = TRACK_W - BOB_W - PAD * 2; // distance the bob slides

const TerracottaToggle = ({
  id,
  checked,
  onChange,
  label,
  disabled,
  colorTheme = 'terra',
}) => {
  const active = THEMES[colorTheme] || THEMES.terra;

  return (
    <div
      className={`flex items-center justify-between w-full group gap-6 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={() => !disabled && onChange({ target: { checked: !checked } })}
    >
      <label
        htmlFor={id}
        className="font-fraunces italic text-[16px] text-[#1A1613] tracking-tight select-none cursor-pointer"
        onClick={(e) => e.stopPropagation()}
        style={{ fontVariationSettings: '"opsz" 18, "SOFT" 80, "WONK" 1, "wght" 380' }}
      >
        {label}
      </label>

      <div
        className="relative shrink-0 border transition-colors"
        style={{
          width: TRACK_W,
          height: TRACK_H,
          borderColor: checked ? active.deep : '#1A161320',
          background: checked
            ? `linear-gradient(to right, ${active.fill}38, ${active.fill}1A)`
            : '#E8DECE',
        }}
      >
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />

        {/* ruler tick marks along the track floor */}
        <div
          aria-hidden="true"
          className="absolute inset-x-1.5 bottom-0 flex items-end justify-between pointer-events-none"
          style={{ height: '100%' }}
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="block"
              style={{
                width: 1,
                height: i === 0 || i === 3 ? 6 : 4,
                backgroundColor: checked
                  ? `${active.deep}66`
                  : '#1A161326',
              }}
            />
          ))}
        </div>

        {/* OFF / ON mono mini-labels */}
        <span
          aria-hidden="true"
          className="absolute left-1 top-1/2 -translate-y-1/2 font-ibm-plex-mono uppercase select-none"
          style={{
            fontSize: 7,
            letterSpacing: '0.14em',
            opacity: checked ? 0.25 : 0.55,
            color: '#1A1613',
          }}
        >
          off
        </span>
        <span
          aria-hidden="true"
          className="absolute right-1 top-1/2 -translate-y-1/2 font-ibm-plex-mono uppercase select-none"
          style={{
            fontSize: 7,
            letterSpacing: '0.14em',
            opacity: checked ? 0.85 : 0.3,
            color: checked ? active.deep : '#1A1613',
          }}
        >
          on
        </span>

        {/* Plumb-bob knob — stays inside the track */}
        <motion.div
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
          style={{
            left: PAD,
            width: BOB_W,
            height: BOB_H,
          }}
          animate={{ x: checked ? TRAVEL : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <svg
            width={BOB_W}
            height={BOB_H}
            viewBox="0 0 14 18"
            aria-hidden="true"
          >
            {/* cap */}
            <rect x="5" y="1" width="4" height="1.5" fill={checked ? active.deep : '#1A1613'} />
            {/* shoulder */}
            <rect x="3" y="3" width="8" height="1.5" fill={checked ? active.deep : '#1A1613'} />
            {/* body */}
            <path
              d="M 3 4.5 L 11 4.5 L 12 8 L 11 11 L 7 17 L 3 11 L 2 8 Z"
              fill={checked ? active.fill : '#1A1613'}
            />
            {/* shaded left half */}
            <path
              d="M 7 4.5 L 7 17 L 3 11 L 2 8 L 3 4.5 Z"
              fill={checked ? active.deep : '#2E2620'}
              opacity="0.75"
            />
            {/* gleam */}
            <path
              d="M 10.5 5.5 L 11.5 8 L 10.5 8 Z"
              fill="#F3ECE0"
              opacity="0.45"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default TerracottaToggle;
