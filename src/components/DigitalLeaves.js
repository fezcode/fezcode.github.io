import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LEAF_TYPES = [
  // Type 1: Maple Leafish
  (color) => (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      className="overflow-visible"
    >
      <path
        d="M50 10 Q60 30 80 30 Q70 50 90 60 Q60 60 50 90 Q40 60 10 60 Q30 50 20 30 Q40 30 50 10 Z"
        fill={color}
      />
      <path
        d="M50 20 L50 80"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.5"
      />
    </svg>
  ),
  // Type 2: Oak Leafish
  (color) => (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      className="overflow-visible"
    >
      <path
        d="M50 10 Q70 10 70 30 Q80 30 80 50 Q70 50 70 70 Q60 90 50 90 Q40 90 30 70 Q30 50 20 50 Q20 30 30 30 Q30 10 50 10 Z"
        fill={color}
      />
      <path
        d="M50 15 L50 85"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.5"
      />
    </svg>
  ),
  // Type 3: Simple Ellipse Leaf
  (color) => (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      className="overflow-visible"
    >
      <path d="M50 10 Q90 50 50 90 Q10 50 50 10 Z" fill={color} />
      <path
        d="M50 10 L50 90"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.5"
      />
    </svg>
  ),
];

const COLORS = ['#eab308', '#f97316', '#ef4444', '#a16207', '#d97706']; // Yellows, Oranges, Reds, Browns

const DigitalLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    // Generate random leaves
    const newLeaves = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      size: 30 + Math.random() * 40, // px
      delay: Math.random() * 5, // seconds
      duration: 10 + Math.random() * 10, // seconds to fall
      type: Math.floor(Math.random() * LEAF_TYPES.length),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none overflow-hidden">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{
            y: -100,
            x: 0,
            opacity: 0,
            rotate: leaf.rotation,
          }}
          animate={{
            y: '110vh', // Fall off screen
            x: [0, 50, -50, 20, 0], // Swaying motion
            opacity: [0, 1, 1, 0], // Fade in then out at bottom
            rotate: leaf.rotation + 360, // Spin while falling
          }}
          transition={{
            y: {
              duration: leaf.duration,
              repeat: Infinity,
              delay: leaf.delay,
              ease: 'linear',
            },
            x: {
              duration: leaf.duration,
              repeat: Infinity,
              delay: leaf.delay,
              ease: 'easeInOut',
            },
            opacity: {
              duration: leaf.duration,
              repeat: Infinity,
              delay: leaf.delay,
              times: [0, 0.1, 0.9, 1],
            },
            rotate: {
              duration: leaf.duration,
              repeat: Infinity,
              delay: leaf.delay,
              ease: 'linear',
            },
          }}
          style={{
            position: 'absolute',
            left: `${leaf.left}%`,
            width: leaf.size,
            height: leaf.size,
          }}
        >
          {LEAF_TYPES[leaf.type](leaf.color)}
        </motion.div>
      ))}
    </div>
  );
};

export default DigitalLeaves;
