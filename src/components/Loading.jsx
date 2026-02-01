import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-full bg-[#050505] text-white font-mono overflow-hidden">
      {/* Scanline Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 3px 100%'
        }}
      />

      {/* Moving Scanline */}
      <motion.div
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-1 z-20 bg-white/5 pointer-events-none"
      />

      <div className="relative z-30 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.98, 1.02, 0.98]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400"
          >
            Initializing
          </motion.div>
          <div className="flex items-center gap-1">
            {['L', 'O', 'A', 'D', 'I', 'N', 'G'].map((char, i) => (
              <motion.span
                key={i}
                animate={{
                  opacity: [0.2, 1, 0.2],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
                className="text-2xl font-black tracking-tighter"
              >
                {char}
              </motion.span>
            ))}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-2 h-6 bg-primary-400 ml-1"
            />
          </div>
        </div>

        {/* Modern Progress Bar */}
        <div className="w-48 h-[2px] bg-gray-900 relative overflow-hidden">
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-primary-400 to-transparent shadow-[0_0_10px_rgba(248,113,113,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;
