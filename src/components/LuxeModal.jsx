import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '@phosphor-icons/react';

const LuxeModal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#F5F5F0]/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-xl bg-white border border-black/5 rounded-sm shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-8 border-b border-black/5 bg-[#FAFAF8]">
              <h2 className="text-3xl font-playfairDisplay italic text-[#1A1A1A]">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-[#1A1A1A]/30 hover:text-[#8D4004] transition-colors"
              >
                <XIcon size={24} weight="light" />
              </button>
            </div>

            <div className="p-10 max-h-[70vh] overflow-y-auto scrollbar-hide text-[#1A1A1A]/70 font-outfit text-base leading-relaxed">
              {children}
            </div>

            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#8D4004]/10 to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LuxeModal;
