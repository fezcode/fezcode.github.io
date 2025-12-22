import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '@phosphor-icons/react';
import GenerativeArt from './GenerativeArt';

const BrutalistDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'SYSTEM_CONFIRMATION',
  message = 'Are you sure you want to execute this operation?',
  confirmText = 'CONFIRM_ACTION',
  cancelText = 'ABORT_OPERATION',
}) => {
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
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#050505] border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Art */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
              <GenerativeArt seed={title} className="w-full h-full" />
            </div>

            {/* Corner Accents (Lines only at corners) */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500" />

            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-2xl font-black font-mono tracking-tighter text-white uppercase italic leading-none">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-500 hover:text-white transition-colors"
                >
                  <XIcon weight="bold" size={24} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="h-px w-12 bg-emerald-500" />
                <p className="text-gray-400 font-mono text-xs uppercase tracking-widest leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={onConfirm}
                  className="flex-1 py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-xs"
                >
                  {confirmText}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-4 border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all font-mono text-[10px] uppercase tracking-widest"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BrutalistDialog;
