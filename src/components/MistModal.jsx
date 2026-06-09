import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '@phosphor-icons/react';
import { MistHorizon } from './mist';

const MistModal = ({
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
            className="absolute inset-0 bg-[#DFE5E3]/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`relative w-full ${maxWidth} bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_18px_50px_rgba(60,72,69,0.18)] overflow-hidden flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6">
              <h2 className="font-instr-serif italic text-2xl tracking-tight text-[#3C4845]">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-[#8A9894] hover:text-[#5F837B] hover:bg-[#E5EBE9]/70 transition-colors"
              >
                <XIcon size={22} weight="light" />
              </button>
            </div>

            <MistHorizon />

            <div className="p-8 max-h-[70vh] overflow-y-auto scrollbar-hide font-outfit font-light text-sm leading-relaxed text-[#3C4845]">
              {children}
            </div>

            <div
              aria-hidden="true"
              className="h-1 w-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(143,168,188,0.45), transparent)',
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MistModal;
