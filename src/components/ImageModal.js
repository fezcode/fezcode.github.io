import React, { useEffect } from 'react';
import { X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageModal = ({ src, alt, onClose }) => {
  useEffect(() => {
    if (src) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset'; // Clean up on unmount
    };
  }, [src]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
          onClick={onClose} // Close modal when clicking outside image
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative"
            onClick={e => e.stopPropagation()} // Prevent modal from closing when clicking on image
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-white text-2xl bg-gray-800 rounded-full p-2 hover:bg-gray-700 focus:outline-none"
            >
              <X size={24} weight="bold" />
            </button>
            <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;