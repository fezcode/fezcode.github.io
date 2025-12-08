import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FLOWER_TYPES = [
  // Type 1: Simple Daisy-like
  (color) => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" className="overflow-visible">
      <path d="M50 50 Q50 20 50 10 Q50 20 60 40 Z" fill={color} />
      <path d="M50 50 Q80 50 90 50 Q80 50 60 60 Z" fill={color} />
      <path d="M50 50 Q50 80 50 90 Q50 80 40 60 Z" fill={color} />
      <path d="M50 50 Q20 50 10 50 Q20 50 40 40 Z" fill={color} />
      <path d="M50 50 Q30 30 20 20 Q30 30 45 45 Z" fill={color} />
      <path d="M50 50 Q70 30 80 20 Q70 30 55 45 Z" fill={color} />
      <path d="M50 50 Q70 70 80 80 Q70 70 55 55 Z" fill={color} />
      <path d="M50 50 Q30 70 20 80 Q30 70 45 55 Z" fill={color} />
      <circle cx="50" cy="50" r="10" fill="#fbbf24" />
    </svg>
  ),
  // Type 2: Tulip-like
  (color) => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" className="overflow-visible">
      <path d="M30 40 Q30 80 50 90 Q70 80 70 40 Q50 50 30 40 Z" fill={color} />
      <path d="M30 40 Q40 20 50 40 Q60 20 70 40" fill={color} />
      <path d="M50 90 L50 150" stroke="#166534" strokeWidth="4" />
    </svg>
  ),
  // Type 3: Round
  (color) => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" className="overflow-visible">
       <circle cx="50" cy="50" r="30" fill={color} opacity="0.8" />
       <circle cx="50" cy="50" r="20" fill="#fff" opacity="0.3" />
       <path d="M50 80 L50 150" stroke="#166534" strokeWidth="4" />
    </svg>
  )
];

const COLORS = ['#f472b6', '#c084fc', '#60a5fa', '#f87171', '#fbbf24'];

const DigitalFlowers = () => {
  const [flowers, setFlowers] = useState([]);

  useEffect(() => {
    // Generate random flowers
    const newFlowers = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      size: 60 + Math.random() * 80, // px (Increased size from 40-100 to 60-140)
      delay: Math.random() * 2, // seconds
      type: Math.floor(Math.random() * FLOWER_TYPES.length),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 30 - 15, // degrees
    }));
    setFlowers(newFlowers);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-0 z-50 pointer-events-none">
      {flowers.map((flower) => (
        <motion.div
          key={flower.id}
          initial={{ y: 200, opacity: 0, rotate: flower.rotation }}
          animate={{
            y: 0,
            opacity: 1,
            rotate: [flower.rotation - 5, flower.rotation + 5, flower.rotation - 5]
          }}
          transition={{
            y: { duration: 1.5, delay: flower.delay, type: 'spring', stiffness: 50 },
            opacity: { duration: 1.5, delay: flower.delay },
            rotate: {
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: flower.delay + 0.5
            }
          }}
          style={{
            position: 'absolute',
            left: `${flower.left}%`,
            bottom: -20,
            width: flower.size,
            height: flower.size * 1.5, // Make them taller
            transformOrigin: 'bottom center',
          }}
        >
          {FLOWER_TYPES[flower.type](flower.color)}
        </motion.div>
      ))}
    </div>
  );
};

export default DigitalFlowers;
