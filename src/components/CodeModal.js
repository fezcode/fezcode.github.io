import React, { useEffect } from 'react';
import { X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customTheme } from '../utils/customTheme';

const CodeModal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-gray-800 rounded-lg shadow-lg p-6 w-3/4 h-3/4"
            onClick={e => e.stopPropagation()}
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
            <SyntaxHighlighter
              style={customTheme}
              language="jsx"
              PreTag="pre"
              className="overflow-auto h-full"
              codeTagProps={{ style: { fontFamily: "'JetBrains Mono', monospace" } }}
            >
              {children}
            </SyntaxHighlighter>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CodeModal;
