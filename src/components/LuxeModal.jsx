import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '@phosphor-icons/react';

const LuxeModal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#F5F5F0]/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl bg-white border border-[#1A1A1A]/10 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A]/5 bg-[#FAFAF8]">
              <h2 className="font-playfairDisplay text-2xl text-[#1A1A1A] italic">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors p-2"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto font-outfit text-[#1A1A1A]/80 leading-relaxed text-sm">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LuxeModal;
