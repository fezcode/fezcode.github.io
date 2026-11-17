import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customTheme } from '../utils/customTheme';
import KilimDialog from './kilim/KilimDialog';
import { KilimIcon, WOOL } from './kilim';
import '../styles/Kilim.css';
import '../styles/kilim-chrome.css';

const MONO = "'IBM Plex Mono', ui-monospace, monospace";

const KilimCodeModal = ({ isOpen, onClose, children, language }) => {
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
    <KilimDialog
      isOpen={isOpen}
      onClose={onClose}
      label="Source code"
      title={
        <span className="klm-label" style={{ color: 'var(--klm-ivory)' }}>
          Source code · {language || 'text'}
        </span>
      }
      width={1024}
      height="85vh"
      actions={
        <button type="button" onClick={handleCopy} className="klm-btn klm-btn-small">
          <KilimIcon name={copied ? 'check' : 'copy'} fg={WOOL.walnut} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      }
    >
      <div className="klm-code-block">
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
            color: '#b08f6a',
            textAlign: 'right',
            fontFamily: MONO,
          }}
          codeTagProps={{ style: { fontFamily: MONO } }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </KilimDialog>,
    document.body,
  );
};

export default KilimCodeModal;
