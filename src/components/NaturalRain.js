import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const NaturalRain = () => {
  const [raindrops, setRaindrops] = useState([]);

  useEffect(() => {
    // Generate random raindrops
    const newRaindrops = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      size: 1 + Math.random() * 2, // px (width/height of drop)
      height: 10 + Math.random() * 20, // px (length of the rain streak)
      delay: Math.random() * 5, // seconds
      duration: 1 + Math.random() * 1.5, // seconds to fall
      opacity: 0.2 + Math.random() * 0.6,
      color: `rgba(173, 216, 230, ${0.3 + Math.random() * 0.7})`, // Light blue, semi-transparent
    }));
    setRaindrops(newRaindrops);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none overflow-hidden">
      {raindrops.map((drop) => (
        <motion.div
          key={drop.id}
          initial={{
            y: -drop.height, // Start above the screen
            x: 0,
            opacity: drop.opacity,
          }}
          animate={{
            y: '110vh', // Fall off screen
            x: Math.random() * 20 - 10, // Slight horizontal drift
            opacity: [drop.opacity, drop.opacity, 0], // Fade out at bottom
          }}
          transition={{
            y: {
              duration: drop.duration,
              repeat: Infinity,
              delay: drop.delay,
              ease: "linear",
            },
            x: {
              duration: drop.duration,
              repeat: Infinity,
              delay: drop.delay,
              ease: "easeInOut",
            },
            opacity: {
              duration: drop.duration,
              repeat: Infinity,
              delay: drop.delay,
              times: [0, 0.9, 1], // Fade out near the end
            },
          }}
          style={{
            position: 'absolute',
            left: `${drop.left}%`,
            width: drop.size,
            height: drop.height,
            backgroundColor: drop.color,
            borderRadius: '50%', // Make them more like drops
            filter: 'blur(0.5px)', // Soften the edges
          }}
        />
      ))}
    </div>
  );
};

export default NaturalRain;
