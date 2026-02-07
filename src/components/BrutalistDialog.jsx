import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '@phosphor-icons/react';
import GenerativeArt from './GenerativeArt';

const BrutalistDialog = ({
  isOpen,
  onClose,
  onConfirm,
  children,
  title = 'SYSTEM_CONFIRMATION',
  message = 'Are you sure you want to execute this operation?',
  confirmText = 'CONFIRM_ACTION',
  cancelText = 'ABORT_OPERATION',
  variant = 'default',
}) => {
  const isPaper = variant === 'paper';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 backdrop-blur-md ${isPaper ? 'bg-[#1a1a1a]/40' : 'bg-black/80'}`}
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-lg p-8 md:p-12 rounded-sm shadow-2xl overflow-hidden border ${
              isPaper
                ? 'bg-[#e9e4d0] border-[#1a1a1a] text-[#1a1a1a]'
                : 'bg-[#050505] border-white/10 text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Art */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
              <GenerativeArt seed={title} className="w-full h-full" />
            </div>

            {/* Corner Accents (Lines only at corners) */}
            <div
              className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${isPaper ? 'border-[#1a1a1a]' : 'border-emerald-500'}`}
            />
            <div
              className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${isPaper ? 'border-[#1a1a1a]' : 'border-emerald-500'}`}
            />
            <div
              className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${isPaper ? 'border-[#1a1a1a]' : 'border-emerald-500'}`}
            />
            <div
              className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${isPaper ? 'border-[#1a1a1a]' : 'border-emerald-500'}`}
            />

            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start gap-4">
                <h3
                  className={`text-2xl font-black font-mono tracking-tighter uppercase italic leading-none ${isPaper ? 'text-[#1a1a1a]' : 'text-white'}`}
                >
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className={`p-1 transition-colors ${isPaper ? 'text-[#1a1a1a]/40 hover:text-[#1a1a1a]' : 'text-gray-500 hover:text-white'}`}
                >
                  <XIcon weight="bold" size={24} />
                </button>
              </div>

              {children ? (
                <div className="relative z-10">{children}</div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div
                      className={`h-px w-12 ${isPaper ? 'bg-[#1a1a1a]' : 'bg-emerald-500'}`}
                    />
                    <p
                      className={`font-mono text-xs uppercase tracking-widest leading-relaxed ${isPaper ? 'text-[#1a1a1a]/60' : 'text-gray-400'}`}
                    >
                      {message}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={onConfirm}
                      className={`flex-1 py-4 font-black uppercase tracking-[0.3em] transition-all text-xs ${
                        isPaper
                          ? 'bg-[#1a1a1a] text-[#e9e4d0] hover:opacity-90'
                          : 'bg-white text-black hover:bg-emerald-400'
                      }`}
                    >
                      {confirmText}
                    </button>
                    <button
                      onClick={onClose}
                      className={`flex-1 py-4 border transition-all font-mono text-[10px] uppercase tracking-widest ${
                        isPaper
                          ? 'border-[#1a1a1a]/20 text-[#1a1a1a]/40 hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                          : 'border-white/10 text-gray-500 hover:text-white hover:bg-white/5'
                      }`}
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

export default BrutalistDialog;
