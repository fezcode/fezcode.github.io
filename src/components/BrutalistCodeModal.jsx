import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Code } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customTheme } from '../utils/customTheme';
import GenerativeArt from './GenerativeArt';

const BrutalistCodeModal = ({ isOpen, onClose, children, language }) => {
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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 md:p-8"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-[#050505] border border-white/10 rounded-sm shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden group"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
              <GenerativeArt seed="CODE_MODAL" className="w-full h-full" />
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02] z-10">
              <div className="flex items-center gap-3">
                <Code size={20} className="text-emerald-500" weight="fill" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Code_Viewer
                  <span className="text-gray-600 mx-2">::</span>
                  <span className="text-emerald-500">{language || 'TEXT'}</span>
                </span>
              </div>
              <button
                onClick={onClose}
                className="group p-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/50 transition-all rounded-sm"
              >
                <X size={20} className="text-gray-500 group-hover:text-red-500 transition-colors" />
              </button>
            </div>

            <div className="flex-1 overflow-auto relative z-10 custom-scrollbar bg-black/40 text-gray-300">
               <SyntaxHighlighter
                style={customTheme}
                language={language}
                PreTag="div"
                customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    background: 'transparent',
                    height: '100%',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.9rem',
                }}
                showLineNumbers={true}
                lineNumberStyle={{
                    minWidth: '2.5em',
                    paddingRight: '1.5em',
                    color: '#333',
                    textAlign: 'right',
                    fontFamily: '"JetBrains Mono", monospace'
                }}
                codeTagProps={{
                  style: { fontFamily: "'JetBrains Mono', monospace" },
                }}
              >
                {children}
              </SyntaxHighlighter>
            </div>

            <div className="px-6 py-2 border-t border-white/10 bg-white/[0.02] flex justify-between items-center z-10">
                <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
                    ReadOnly Mode
                </span>
                <span className="font-mono text-[10px] text-emerald-500/50 uppercase tracking-widest">
                    • Connected
                </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default BrutalistCodeModal;
