import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Code, ClipboardText } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import LuxeArt from './LuxeArt';
import { useToast } from '../hooks/useToast';

const LuxeCodeModal = ({ isOpen, onClose, children, language }) => {
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      addToast({
        title: 'Archive Synchronized',
        message: 'Code snippet copied to local clipboard.',
        type: 'success'
      });
    });
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[#F5F5F0]/95 backdrop-blur-md flex justify-center items-center z-[1000] p-4 md:p-12"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white border border-black/5 rounded-sm shadow-[0_40px_120px_-20px_rgba(0,0,0,0.2)] w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.98, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 35, stiffness: 200 }}
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <LuxeArt seed="CODE_EXPANSION" className="w-full h-full mix-blend-multiply" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 md:p-8 border-b border-black/5 bg-[#FAFAF8]">
              <div className="flex flex-col">
                <span className="font-outfit text-[9px] uppercase tracking-[0.4em] text-[#8D4004] font-bold">
                  Technical Specification
                </span>
                <h2 className="font-playfairDisplay italic text-2xl text-[#1A1A1A] flex items-center gap-3">
                  <Code size={24} weight="light" className="text-[#8D4004]" />
                  {language?.toUpperCase() || 'SOURCE'}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-[#1A1A1A] text-[#1A1A1A]/60 hover:text-white border border-black/10 rounded-full transition-all text-[10px] uppercase tracking-widest font-bold"
                >
                    <ClipboardText size={16} /> Copy
                </button>
                <button
                    onClick={onClose}
                    className="group p-2 text-[#1A1A1A]/20 hover:text-[#8D4004] transition-colors"
                >
                    <X size={24} weight="light" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto relative z-10 custom-scrollbar bg-white p-2">
               <SyntaxHighlighter
                style={coy}
                language={language}
                PreTag="div"
                customStyle={{
                    margin: 0,
                    padding: '2rem',
                    background: 'transparent',
                    fontSize: '0.95rem',
                    lineHeight: '1.7'
                }}
                showLineNumbers={true}
              >
                {children}
              </SyntaxHighlighter>
            </div>

            {/* Footer */}
            <div className="relative z-10 px-8 py-3 border-t border-black/5 bg-[#FAFAF8] flex justify-between items-center font-outfit text-[9px] uppercase tracking-[0.3em] text-black/20">
                <span>Refined Syntax Presentation</span>
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#8D4004]/30 rounded-full animate-pulse" />
                    <span>Archive Online</span>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LuxeCodeModal;
