import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Code } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customTheme } from '../utils/customTheme';
import TerracottaGenerativeArt from './TerracottaGenerativeArt';

const TerracottaCodeModal = ({ isOpen, onClose, children, language }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[#1A1613]/85 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 md:p-8"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-[#F3ECE0] border border-[#1A161320] rounded-sm shadow-[0_40px_80px_-40px_#1A161360] w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden group"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
          >
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
              <TerracottaGenerativeArt seed="CODE_MODAL" className="w-full h-full" />
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A161320] bg-[#E8DECE]/60 z-10">
              <div className="flex items-center gap-3">
                <Code size={20} className="text-[#C96442]" weight="fill" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#2E2620]">
                  Code_Viewer
                  <span className="text-[#2E2620]/40 mx-2">::</span>
                  <span className="text-[#9E4A2F]">{language || 'TEXT'}</span>
                </span>
              </div>
              <button
                onClick={onClose}
                className="group p-2 hover:bg-[#C96442]/10 border border-transparent hover:border-[#C96442]/50 transition-all rounded-sm"
              >
                <X size={20} className="text-[#2E2620]/60 group-hover:text-[#9E4A2F] transition-colors" />
              </button>
            </div>

            <div className="flex-1 overflow-auto relative z-10 custom-scrollbar bg-[#1A1613] text-[#F3ECE0]">
              <SyntaxHighlighter
                style={customTheme}
                language={language}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  background: 'transparent',
                  height: '100%',
                  fontFamily: '"IBM Plex Mono", "JetBrains Mono", monospace',
                  fontSize: '0.9rem',
                }}
                showLineNumbers={true}
                lineNumberStyle={{
                  minWidth: '2.5em',
                  paddingRight: '1.5em',
                  color: '#7A6A58',
                  textAlign: 'right',
                  fontFamily: '"IBM Plex Mono", "JetBrains Mono", monospace',
                }}
                codeTagProps={{
                  style: { fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" },
                }}
              >
                {children}
              </SyntaxHighlighter>
            </div>

            <div className="px-6 py-2 border-t border-[#1A161320] bg-[#E8DECE]/60 flex justify-between items-center z-10">
              <span className="font-mono text-[10px] text-[#2E2620]/50 uppercase tracking-widest">
                ReadOnly Mode
              </span>
              <span className="font-mono text-[10px] text-[#C96442]/70 uppercase tracking-widest">
                • Connected
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default TerracottaCodeModal;
