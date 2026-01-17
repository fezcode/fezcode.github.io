import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, DownloadSimpleIcon } from '@phosphor-icons/react';

const VagueEditorialModal = ({
  isOpen,
  onClose,
  item,
  isInvert = true
}) => {
  if (!item) return null;

  const title = item.title;
  const description = item.description;
  const url = item.url;
  const date = item.date;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-8 ${isInvert ? 'is-invert' : ''}`}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className={`relative w-full max-w-3xl overflow-hidden flex flex-col shadow-2xl transition-colors duration-500
              ${isInvert ? 'bg-[#1a1a1a] text-[#f4f4f4]' : 'bg-[#f4f4f4] text-[#1a1a1a]'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Top Bar */}
            <div className={`flex items-center justify-between p-6 border-b ${isInvert ? 'border-white/10' : 'border-black/10'}`}>
              <div className="flex flex-col">
                <span className="font-instr-sans text-[10px] uppercase tracking-[0.3em] opacity-50 mb-1">Issue Details</span>
                <span className="font-instr-sans text-[11px] font-black uppercase tracking-widest">{date}</span>
              </div>
              <button
                onClick={onClose}
                className={`p-2 transition-transform hover:rotate-90 duration-300 ${isInvert ? 'text-white' : 'text-black'}`}
              >
                <XIcon weight="bold" size={24} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-8 md:p-16 flex-1 overflow-y-auto custom-scrollbar">
              <div className="max-w-2xl mx-auto text-center">
                {item.image && (
                   <div className="mb-12 relative group">
                      <img
                        src={item.image}
                        alt={title}
                        className={`w-full max-w-sm mx-auto shadow-2xl transition-all duration-700
                          ${isInvert
                            ? 'grayscale invert contrast-125'
                            : 'grayscale contrast-125'}`}
                      />
                      <div className={`absolute inset-0 pointer-events-none border border-current opacity-10`} />
                   </div>
                )}

                <h2 className="text-5xl md:text-7xl font-instr-serif italic leading-none mb-12">
                  {title}
                </h2>

                <div className={`w-12 h-px mx-auto mb-12 ${isInvert ? 'bg-white/20' : 'bg-black/20'}`} />

                <p className="text-xl md:text-2xl font-instr-serif leading-relaxed italic opacity-80 mb-16">
                  {description}
                </p>

                {url && url !== '#' && (
                  <div className="mt-8 flex flex-col items-center gap-6">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="c-button -whiteInvert !h-auto !py-4 !px-10 group"
                    >
                      <span className="c-button_label uppercase tracking-[0.3em] text-xs font-black flex items-center gap-4">
                        Download PDF
                        <DownloadSimpleIcon weight="bold" size={20} className="group-hover:translate-y-1 transition-transform" />
                      </span>
                    </a>

                    <p className="font-instr-sans text-[9px] uppercase tracking-[0.2em] opacity-40">
                      Format: PDF Document
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer decoration */}
            <div className={`h-2 w-full ${isInvert ? 'bg-white/5' : 'bg-black/5'}`} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VagueEditorialModal;
