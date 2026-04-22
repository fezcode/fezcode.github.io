import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '@phosphor-icons/react';
import TerracottaGenerativeArt from './TerracottaGenerativeArt';

const TerracottaDialog = ({
  isOpen,
  onClose,
  onConfirm,
  children,
  title = 'CONFIRMATION',
  message = 'Are you sure you want to proceed?',
  confirmText = 'CONFIRM',
  cancelText = 'CANCEL',
  variant = 'default',
}) => {
  const isPaper = variant === 'paper';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 backdrop-blur-md ${isPaper ? 'bg-[#1A1613]/30' : 'bg-[#1A1613]/60'}`}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-lg p-8 md:p-12 rounded-sm shadow-[0_40px_80px_-40px_#1A161360] overflow-hidden border ${
              isPaper
                ? 'bg-[#e9e4d0] border-[#1A1613] text-[#1A1613]'
                : 'bg-[#F3ECE0] border-[#1A161320] text-[#1A1613]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
              <TerracottaGenerativeArt seed={title} className="w-full h-full" />
            </div>

            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#C96442]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#C96442]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#C96442]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#C96442]" />

            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-3xl font-fraunces italic tracking-tight leading-none text-[#1A1613]">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 transition-colors text-[#2E2620]/50 hover:text-[#9E4A2F]"
                >
                  <XIcon weight="bold" size={24} />
                </button>
              </div>

              {children ? (
                <div className="relative z-10">{children}</div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="h-px w-12 bg-[#C96442]" />
                    <p className="font-mono text-xs uppercase tracking-widest leading-relaxed text-[#2E2620]/80">
                      {message}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={onConfirm}
                      className="flex-1 py-4 font-bold uppercase tracking-[0.3em] transition-all text-xs bg-[#1A1613] text-[#F3ECE0] hover:bg-[#C96442]"
                    >
                      {confirmText}
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 py-4 border transition-all font-mono text-[10px] uppercase tracking-widest border-[#1A161320] text-[#2E2620]/70 hover:border-[#1A1613] hover:text-[#1A1613] hover:bg-[#E8DECE]"
                    >
                      {cancelText}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TerracottaDialog;
