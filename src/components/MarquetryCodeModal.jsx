import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customTheme } from '../utils/customTheme';
import {
  MarquetryDialog,
  MarquetryText,
  MarquetryIcon,
  WOOD,
} from './marquetry';
import '../styles/Marquetry.css';

const MONO = "'IBM Plex Mono', ui-monospace, monospace";

const MarquetryCodeModal = ({ isOpen, onClose, children, language }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(String(children ?? ''))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  if (!isOpen) return null;

  return createPortal(
    <MarquetryDialog
      isOpen={isOpen}
      onClose={onClose}
      label="Source code"
      title={`Source code · ${language || 'text'}`}
      width={1024}
      height="85vh"
      actions={
        <button
          type="button"
          onClick={handleCopy}
          className="mqt-btn mqt-btn-gold"
        >
          <MarquetryIcon name={copied ? 'check' : 'copy'} fg={WOOD.peat} />
          <MarquetryText
            text={copied ? 'Copied' : 'Copy'}
            size="small"
            fg={WOOD.peat}
            fit
          />
        </button>
      }
    >
      <div className="mqt-code-block h-full overflow-auto">
        <SyntaxHighlighter
          style={customTheme}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            minHeight: '100%',
            fontFamily: MONO,
            fontSize: '0.85rem',
          }}
          showLineNumbers
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1.5em',
            color: '#a08b70',
            textAlign: 'right',
            fontFamily: MONO,
          }}
          codeTagProps={{ style: { fontFamily: MONO } }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </MarquetryDialog>,
    document.body,
  );
};

export default MarquetryCodeModal;
