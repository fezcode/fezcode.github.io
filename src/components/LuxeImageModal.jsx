import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowsInSimple } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

const LuxeImageModal = ({ src, alt, onClose }) => {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    if (src) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (src) {
      window.addEventListener('keydown', handleKeyDown);
    }

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
    ![
      'Project Detail',
      'Enlarged Content',
      'Intel Imagery',
      'Full size image',
    ].includes(alt);

  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#F5F5F0]/95 backdrop-blur-md p-4 md:p-8"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.98, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 35, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-black/5 p-4 md:p-6 rounded-t-sm shadow-sm">
              <div className="flex flex-col">
                <span className="font-outfit text-[9px] uppercase tracking-[0.4em] text-[#8D4004] font-bold">
                  Visual Archive
                </span>
                <h2 className="font-playfairDisplay italic text-xl text-[#1A1A1A] truncate max-w-md">
                  {showAlt ? alt : 'Selected Specimen'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="group flex items-center gap-3 px-6 py-2 bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white border border-black/10 rounded-full transition-all shadow-sm"
              >
                <span className="font-outfit text-[10px] uppercase tracking-widest font-bold">
                  Minimize
                </span>
                <ArrowsInSimple size={18} weight="light" />
              </button>
            </div>

            {/* Image Container */}
            <div className="relative flex-1 min-h-0 bg-white border-x border-black/5 overflow-hidden flex items-center justify-center p-4 md:p-12">
              <img
                src={src}
                alt={alt}
                onLoad={handleImageLoad}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
                className="w-auto h-auto object-contain block shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] select-none transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>

            {/* Footer */}
            <div className="bg-[#FAFAF8] border border-black/5 p-4 px-8 flex justify-between items-center rounded-b-sm">
              <div className="flex items-center gap-4 font-outfit text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                <span>Dimension Analysis</span>
                <span className="w-1 h-1 bg-[#8D4004]/30 rounded-full" />
                <span className="text-[#1A1A1A]/60 font-bold">
                  {dimensions
                    ? `${dimensions.width} x ${dimensions.height} PX`
                    : 'SCANNING...'}
                </span>
              </div>
              <span className="font-playfairDisplay italic text-[10px] text-[#1A1A1A]/20">
                Fezcodex High-Fidelity Viewer
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default LuxeImageModal;
