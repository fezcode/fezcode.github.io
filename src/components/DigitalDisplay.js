import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DigitalDisplay = ({
  text,
  colorClass = 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]',
  showCursor = true,
  className = '',
}) => {
  return (
    <div
      className={`bg-green-900/20 border border-green-800/50 rounded-xl p-4 h-24 flex items-center justify-end overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] ${className}`}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={text?.toString()} // Ensure key is a string or primitive
          initial={{ opacity: 0.5, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl sm:text-5xl font-mono tracking-widest font-bold ${colorClass}`}
        >
          {text}
        </motion.span>
      </AnimatePresence>

      {/* Cursor/Caret */}
      {showCursor && (
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-3 h-10 bg-green-400/50 ml-1"
        />
      )}
    </div>
  );
};

export default DigitalDisplay;
