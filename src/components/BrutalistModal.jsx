import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ArrowSquareOutIcon } from '@phosphor-icons/react';
import GenerativeArt from './GenerativeArt';

const BrutalistModal = ({
  isOpen,
  onClose,
  item,
}) => {
  if (!item) return null;

  const title = item.label || item.title;
  const description = item.description;
  const url = item.url;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            className="relative w-full max-w-4xl bg-[#050505] border border-white/20 rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row h-full md:h-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left/Top side: Large Art */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto border-b md:border-b-0 md:border-r border-white/20">
              {item.image ? (
                 <img src={item.image} alt={title} className="w-full h-full object-cover transition-all duration-700" />
              ) : (
                 <GenerativeArt seed={"2"+title+"[]"} className="w-full h-full" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#050505] to-transparent opacity-60" />
            </div>

            {/* Right side: Content */}
            <div className="flex-1 flex flex-col p-8 md:p-12 relative">
              {/* Decorative background logo */}
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none select-none">
                 <h1 className="text-9xl font-black font-playfairDisplay leading-none">FC</h1>
              </div>

              <div className="flex justify-between items-start mb-12">
                <div className="space-y-1">
                  <div className="h-1 w-12 bg-emerald-500 mb-4" />
                  <h2 className="text-4xl md:text-5xl font-normal font-playfairDisplay tracking-tighter text-white uppercase leading-none">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-white transition-colors"
                >
                  <XIcon weight="bold" size={32} />
                </button>
              </div>

              <div className="flex-grow space-y-8">
                <p className="text-xl md:text-2xl text-gray-300 font-arvo leading-relaxed">
                  {description}
                </p>
                {item.author && (
                  <div className="pt-4 flex items-center gap-3">
                    <div className="w-8 h-px bg-white/20" />
                    <span className="text-xs font-mono uppercase tracking-[0.4em] text-gray-500">
                      Authored by // {item.author}
                    </span>
                  </div>
                )}
              </div>

              {url && url !== '#' && (
                <div className="mt-12">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-4 bg-white text-black px-8 py-5 font-mono font-black text-xs uppercase tracking-[0.4em] hover:bg-emerald-400 transition-all w-full md:w-auto"
                  >
                    <span>{item.actionLabel || "Visit"}</span>
                    <ArrowSquareOutIcon weight="bold" size={20} />
                  </a>
                </div>
              )}

              {/* Grid corner markers */}
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20 m-4" />
              <div className="absolute bottom-0 right-6 w-1 h-1 bg-emerald-500 m-4 rounded-full animate-pulse" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BrutalistModal;
