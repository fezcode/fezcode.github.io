import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '@phosphor-icons/react';

const TerracottaModal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) onClose();
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
            className="absolute inset-0 bg-[#1A1613]/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={`relative w-full ${maxWidth} bg-[#F3ECE0] border border-[#1A161320] rounded-sm shadow-[0_40px_80px_-40px_#1A161360] overflow-hidden flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-[#1A161320] bg-[#E8DECE]/60">
              <h2 className="text-2xl font-fraunces italic tracking-tight text-[#1A1613]">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-[#2E2620]/60 hover:text-[#9E4A2F] hover:bg-[#E8DECE] rounded-sm transition-all"
              >
                <XIcon size={24} weight="bold" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto scrollbar-hide text-[#2E2620] font-mono text-sm leading-relaxed">
              {children}
            </div>

            <div className="h-1 w-full bg-gradient-to-r from-[#C96442]/0 via-[#C96442]/60 to-[#C96442]/0 opacity-40" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TerracottaModal;
