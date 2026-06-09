import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { MistOrb, MistHorizon } from './mist';

/* a prism style for the mist — cool inks on a pale veil, nothing harsh */
const mistSyntaxTheme = {
  'code[class*="language-"]': {
    color: '#3C4845',
    background: 'none',
    textShadow: 'none',
  },
  'pre[class*="language-"]': {
    color: '#3C4845',
    background: 'none',
    textShadow: 'none',
  },
  comment: { color: '#8A9894', fontStyle: 'italic' },
  prolog: { color: '#8A9894' },
  doctype: { color: '#8A9894' },
  cdata: { color: '#8A9894' },
  punctuation: { color: '#5C6B67' },
  namespace: { opacity: 0.7 },
  property: { color: '#5F837B' },
  tag: { color: '#5F837B' },
  boolean: { color: '#8FA8BC' },
  number: { color: '#8FA8BC' },
  constant: { color: '#8FA8BC' },
  symbol: { color: '#8FA8BC' },
  deleted: { color: '#5C6B67', textDecoration: 'line-through' },
  selector: { color: '#5F837B' },
  'attr-name': { color: '#5C6B67' },
  string: { color: '#5F837B' },
  char: { color: '#5F837B' },
  builtin: { color: '#5F837B' },
  inserted: { color: '#5F837B' },
  operator: { color: '#5C6B67' },
  entity: { color: '#5C6B67', cursor: 'help' },
  url: { color: '#8FA8BC' },
  atrule: { color: '#5F837B' },
  'attr-value': { color: '#5F837B' },
  keyword: { color: '#5F837B', fontStyle: 'italic' },
  function: { color: '#3C4845', fontWeight: '500' },
  'class-name': { color: '#3C4845', fontWeight: '500' },
  regex: { color: '#8FA8BC' },
  important: { color: '#5F837B', fontWeight: 'bold' },
  variable: { color: '#3C4845' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};

const MistCodeModal = ({ isOpen, onClose, children, language }) => {
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
          className="fixed inset-0 bg-[#DFE5E3]/60 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 md:p-8"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white/85 backdrop-blur-md rounded-2xl shadow-[0_18px_50px_rgba(60,72,69,0.18)] w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between px-6 py-4 z-10">
              <div className="flex items-center gap-3">
                <MistOrb size={22} />
                <span className="font-ibm-plex-mono lowercase text-[11px] tracking-[0.22em] text-[#5C6B67]">
                  source, half-remembered
                  <span className="text-[#8A9894] mx-2">·</span>
                  <span className="text-[#5F837B]">{language || 'text'}</span>
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-[#8A9894] hover:text-[#5F837B] hover:bg-[#E5EBE9]/70 transition-colors"
              >
                <X size={20} weight="light" />
              </button>
            </div>

            <MistHorizon />

            <div className="flex-1 overflow-auto relative z-10 custom-scrollbar bg-[#E5EBE9]/90">
              <SyntaxHighlighter
                style={mistSyntaxTheme}
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
                  color: '#8A9894',
                  textAlign: 'right',
                  fontFamily: '"IBM Plex Mono", "JetBrains Mono", monospace',
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
                  },
                }}
              >
                {children}
              </SyntaxHighlighter>
            </div>

            <MistHorizon />

            <div className="px-6 py-2 flex justify-between items-center z-10">
              <span className="font-ibm-plex-mono lowercase text-[10px] tracking-[0.2em] text-[#8A9894]">
                read-only · nothing to wake
              </span>
              <span className="font-ibm-plex-mono lowercase text-[10px] tracking-[0.2em] text-[#5F837B]">
                · still here
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default MistCodeModal;
