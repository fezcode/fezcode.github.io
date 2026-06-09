import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MistOrb } from './mist';

const MistImageModal = ({ src, alt, onClose }) => {
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
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#DFE5E3]/60 backdrop-blur-sm p-2 md:p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(900px 600px at 85% -10%, rgba(255,255,255,0.8) 0%, transparent 55%), radial-gradient(700px 500px at 5% 105%, rgba(210,219,216,0.8) 0%, transparent 50%)',
            }}
          />

          <motion.div
            className="relative w-full h-full max-w-[85vw] max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-2 md:p-3 rounded-t-2xl shadow-[0_18px_50px_rgba(60,72,69,0.18)]">
              <div className="flex items-center gap-3">
                <MistOrb size={18} />
                <span className="font-ibm-plex-mono lowercase text-[10px] tracking-[0.26em] text-[#5C6B67]">
                  image viewer · seen through fog
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden md:inline font-ibm-plex-mono lowercase text-[9px] tracking-[0.2em] text-[#8A9894] mr-2">
                  press esc to wake
                </span>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5EBE9]/80 text-[#5C6B67] hover:bg-[#5F837B] hover:text-white transition-colors"
                >
                  <X size={16} weight="light" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 min-h-0 bg-white/70 backdrop-blur-md rounded-b-2xl overflow-hidden flex items-center justify-center">
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(60,72,69,0.14), transparent)',
                }}
              />

              <img
                src={src}
                alt={alt}
                onLoad={handleImageLoad}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
                className="w-auto h-auto object-contain block shadow-[0_18px_50px_rgba(60,72,69,0.18)] select-none"
              />
            </div>

            <div className="mt-3 flex justify-between items-center px-2">
              <span className="font-ibm-plex-mono lowercase text-sm tracking-[0.18em] text-[#5C6B67] truncate max-w-[50vw]">
                {showAlt ? alt : 'an unnamed drift'}
              </span>
              <span className="font-ibm-plex-mono lowercase text-sm tracking-[0.18em] text-[#5C6B67] text-right">
                {dimensions
                  ? `${dimensions.width} × ${dimensions.height} px`
                  : 'measuring…'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default MistImageModal;
