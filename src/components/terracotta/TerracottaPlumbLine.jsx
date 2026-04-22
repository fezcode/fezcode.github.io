import React from 'react';
import { motion } from 'framer-motion';

/**
 * The cord that dangles from a wordmark letter.
 * Anchored at the bottom (tied to the letter), swinging ±1.5° over 6s.
 * Matches the sway keyframe from the Plumb brand identity.
 */
const TerracottaPlumbLine = ({
  height = 54,
  thickness = 1.5,
  color = '#1A1613',
  knot = true,
}) => (
  <motion.span
    aria-hidden="true"
    className="absolute left-1/2 pointer-events-none"
    style={{
      top: -height,
      width: thickness,
      height,
      backgroundColor: color,
      transformOrigin: 'bottom center',
      translateX: '-50%',
    }}
    initial={{ rotate: 1.5 }}
    animate={{ rotate: [1.5, -1.5, 1.5] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
  >
    {knot && (
      <span
        className="block absolute -top-1 left-1/2 -translate-x-1/2"
        style={{
          width: 5,
          height: 5,
          backgroundColor: color,
          borderRadius: '50%',
        }}
      />
    )}
  </motion.span>
);

export default TerracottaPlumbLine;
