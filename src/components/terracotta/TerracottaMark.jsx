import React from 'react';
import { motion } from 'framer-motion';

/**
 * The Plumb bob — single source-of-truth glyph for the Terracotta theme.
 * A faceted hexagonal teardrop with cord, cap, shoulder ring, and inner chisel.
 * The mark never rotates, never sits inside a rounded-square prison; it hangs.
 */
const TerracottaMark = ({
  size = 32,
  color = 'currentColor',
  sway = false,
  className = '',
  title,
}) => {
  const width = size;
  const height = (size * 160) / 120;

  const svg = (
    <svg
      viewBox="0 0 120 160"
      width={width}
      height={height}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : 'true'}
      className={className}
      style={{ overflow: 'visible' }}
    >
      {/* cord */}
      <line
        x1="60"
        y1="2"
        x2="60"
        y2="36"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.65"
      />
      {/* cap */}
      <path d="M 52 34 L 68 34 L 66 40 L 54 40 Z" fill={color} opacity="0.9" />
      {/* shoulder ring */}
      <path d="M 42 44 L 78 44 L 76 50 L 44 50 Z" fill={color} />
      {/* body */}
      <path
        d="M 44 50 L 76 50 L 86 72 L 80 96 L 60 156 L 40 96 L 34 72 Z"
        fill={color}
      />
      {/* inner chisel */}
      <path
        d="M 60 50 L 60 156 L 40 96 L 34 72 L 44 50 Z"
        fill={color}
        opacity="0.82"
      />
      {/* gleam */}
      <path d="M 78 56 L 82 72 L 78 72 Z" fill="#FFFFFF" opacity="0.18" />
    </svg>
  );

  if (!sway) return svg;

  // The bob sways ±1.5° over 6s, anchored at the top of the cord.
  return (
    <motion.span
      aria-hidden="true"
      className={`inline-block ${className}`}
      style={{ transformOrigin: '50% 1%' }}
      animate={{ rotate: [1.5, -1.5, 1.5] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {svg}
    </motion.span>
  );
};

export default TerracottaMark;
