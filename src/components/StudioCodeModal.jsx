import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import '../styles/Studio.css';
import useStudioDialog from './studio/useStudioDialog';

/* A prism style written in Studio's Daylight palette — every colour is a --std-*
   token so the code re-inks itself when the register cycles. */
import { studioSyntaxTheme } from './studio/studioSyntaxTheme';

const StudioCodeModal = ({ isOpen, onClose, children, language }) => {
  const [copied, setCopied] = useState(false);

  const dialogRef = useStudioDialog(isOpen, onClose);

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
    <div
      className="std-scrim"
      style={{ zIndex: 1000, alignItems: 'center', padding: '1rem' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="std-modal"
        style={{ maxWidth: '1024px', height: '85vh', maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Source code"
      >
        <div
          className="flex items-baseline justify-between gap-4 px-5 py-3"
          style={{ borderBottom: '1px solid var(--std-rule)' }}
        >
          <span className="std-label truncate">
            SOURCE CODE ·{' '}
            <span className="std-accent">
              {(language || 'text').toUpperCase()}
            </span>
          </span>
          <div className="flex items-baseline gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="std-btn std-btn-accent"
            >
              {copied ? 'COPIED ✓' : 'COPY'}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="std-btn"
            >
              [×]
            </button>
          </div>
        </div>

        <div
          className="flex-1 overflow-auto std-sunken"
          style={{ minHeight: 0 }}
        >
          <SyntaxHighlighter
            style={studioSyntaxTheme}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              background: 'transparent',
              height: '100%',
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: '0.85rem',
            }}
            showLineNumbers={true}
            lineNumberStyle={{
              minWidth: '2.5em',
              paddingRight: '1.5em',
              color: 'var(--std-muted)',
              textAlign: 'right',
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            }}
            codeTagProps={{
              style: {
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              },
            }}
          >
            {children}
          </SyntaxHighlighter>
        </div>

        <div
          className="flex items-baseline justify-between px-5 py-2"
          style={{ borderTop: '1px solid var(--std-rule)' }}
        >
          <span className="std-label">Source code · Read only</span>
          <span className="std-eyebrow">Studio</span>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default StudioCodeModal;
