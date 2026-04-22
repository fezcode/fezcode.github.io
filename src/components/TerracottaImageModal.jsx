import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Scan } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

const TerracottaImageModal = ({ src, alt, onClose }) => {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    if (src) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (src) window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [src, onClose]);

  const handleImageLoad = (e) => {
    setDimensions({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    });
  };

  const showAlt =
    alt &&
    !['Project Detail', 'Enlarged Content', 'Intel Imagery', 'Full size image'].includes(alt);

  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#1A1613]/85 backdrop-blur-xl p-2 md:p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #F3ECE0 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />

          <motion.div
            className="relative w-full h-full max-w-[85vw] max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between bg-[#F3ECE0]/95 border border-[#1A161320] border-b-0 p-2 md:p-3 backdrop-blur-md rounded-t-sm">
              <div className="flex items-center gap-3">
                <Scan className="text-[#C96442] animate-pulse" size={16} />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#2E2620]/70">
                  PLUMB.IMG_VIEWER // CALM_MODE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden md:inline font-mono text-[9px] text-[#2E2620]/50 uppercase tracking-widest mr-2">
                  Press ESC to exit
                </span>
                <button
                  onClick={onClose}
                  className="group flex items-center gap-2 px-4 py-1.5 bg-[#E8DECE] hover:bg-[#C96442] text-[#2E2620] hover:text-[#F3ECE0] border border-[#1A161320] rounded-sm transition-all"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 min-h-0 bg-[#F3ECE0]/60 backdrop-blur-sm rounded-b-sm overflow-hidden flex items-center justify-center">
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#C96442]/50 z-10" />
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-[#C96442]/50 z-10" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-[#C96442]/50 z-10" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#C96442]/50 z-10" />

              <img
                src={src}
                alt={alt}
                onLoad={handleImageLoad}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
                className="w-auto h-auto object-contain block shadow-[0_0_50px_rgba(26,22,19,0.4)] select-none"
              />
            </div>

            <div className="mt-3 flex justify-between items-center px-2">
              <span className="font-mono text-sm uppercase tracking-widest text-[#F3ECE0] font-bold truncate max-w-[50vw]">
                {showAlt ? alt : 'RAW_STREAM'}
              </span>
              <span className="font-mono text-sm uppercase tracking-widest text-[#F3ECE0] font-bold text-right">
                {dimensions ? `${dimensions.width} x ${dimensions.height} PX` : 'CALCULATING...'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default TerracottaImageModal;
