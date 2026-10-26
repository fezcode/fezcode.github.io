import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customTheme } from '../utils/customTheme';
import KnitDialog from './knit/KnitDialog';
import { KnitText, KnitIcon, YARN } from './knit';
import '../styles/Knit.css';

const MONO = "'IBM Plex Mono', ui-monospace, monospace";

const KnitCodeModal = ({ isOpen, onClose, children, language }) => {
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
    <KnitDialog
      isOpen={isOpen}
      onClose={onClose}
      label="Source code"
      title={`Source code · ${language || 'text'}`}
      width={1024}
      height="85vh"
      actions={
        <button type="button" onClick={handleCopy} className="knt-btn knt-btn-gold">
          <KnitIcon name={copied ? 'check' : 'copy'} fg={YARN.peat} />
          <KnitText text={copied ? 'Copied' : 'Copy'} size="small" fg={YARN.peat} fit />
        </button>
      }
    >
      <div className="knt-code-block h-full overflow-auto">
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
    </KnitDialog>,
    document.body,
  );
};

export default KnitCodeModal;
