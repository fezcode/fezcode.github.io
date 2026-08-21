import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import '../styles/Ledger.css';

/* A prism style written in the ledger's own inks — every colour is a --ldg-*
   token so the code re-inks itself when the register cycles. */
const ledgerSyntaxTheme = {
  'code[class*="language-"]': {
    color: 'var(--ldg-fg)',
    background: 'none',
    textShadow: 'none',
  },
  'pre[class*="language-"]': {
    color: 'var(--ldg-fg)',
    background: 'none',
    textShadow: 'none',
  },
  comment: { color: 'var(--ldg-muted)', fontStyle: 'italic' },
  prolog: { color: 'var(--ldg-muted)' },
  doctype: { color: 'var(--ldg-muted)' },
  cdata: { color: 'var(--ldg-muted)' },
  punctuation: { color: 'var(--ldg-muted)' },
  namespace: { opacity: 0.7 },
  property: { color: 'var(--ldg-accent)' },
  tag: { color: 'var(--ldg-accent)' },
  boolean: { color: 'var(--ldg-accent)' },
  number: { color: 'var(--ldg-accent)' },
  constant: { color: 'var(--ldg-accent)' },
  symbol: { color: 'var(--ldg-accent)' },
  deleted: { color: 'var(--ldg-muted)', textDecoration: 'line-through' },
  selector: { color: 'var(--ldg-accent)' },
  'attr-name': { color: 'var(--ldg-muted)' },
  string: { color: 'var(--ldg-accent)' },
  char: { color: 'var(--ldg-accent)' },
  builtin: { color: 'var(--ldg-accent)' },
  inserted: { color: 'var(--ldg-accent)' },
  operator: { color: 'var(--ldg-muted)' },
  entity: { color: 'var(--ldg-muted)', cursor: 'help' },
  url: { color: 'var(--ldg-accent)' },
  atrule: { color: 'var(--ldg-accent)' },
  'attr-value': { color: 'var(--ldg-accent)' },
  keyword: { color: 'var(--ldg-highlight)', fontWeight: '700' },
  function: { color: 'var(--ldg-highlight)', fontWeight: '500' },
  'class-name': { color: 'var(--ldg-highlight)', fontWeight: '500' },
  regex: { color: 'var(--ldg-accent)' },
  important: { color: 'var(--ldg-accent)', fontWeight: 'bold' },
  variable: { color: 'var(--ldg-fg)' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};

/**
 * Ledger theme code modal — source filed as an exhibit. Double-ruled frame,
 * line numbers in the margin like folio numbers, and a COPY control that
 * stamps COPIED ✓ once the text is in the clipboard.
 */
const LedgerCodeModal = ({ isOpen, onClose, children, language }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
      className="ldg-scrim"
      style={{ zIndex: 1000, alignItems: 'center', padding: '1rem' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="ldg-modal"
        style={{ maxWidth: '1024px', height: '85vh', maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Source code"
      >
        <div
          className="flex items-baseline justify-between gap-4 px-5 py-3"
          style={{ borderBottom: '1px solid var(--ldg-rule)' }}
        >
          <span className="ldg-label truncate">
            EXHIBIT — SOURCE ·{' '}
            <span className="ldg-accent">
              {(language || 'text').toUpperCase()}
            </span>
          </span>
          <div className="flex items-baseline gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="ldg-btn ldg-btn-accent"
            >
              {copied ? 'COPIED ✓' : 'COPY'}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="ldg-btn"
            >
              [×]
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto ldg-sunken" style={{ minHeight: 0 }}>
          <SyntaxHighlighter
            style={ledgerSyntaxTheme}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              background: 'transparent',
              height: '100%',
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: '0.85rem',
            }}
            showLineNumbers={true}
            lineNumberStyle={{
              minWidth: '2.5em',
              paddingRight: '1.5em',
              color: 'var(--ldg-muted)',
              textAlign: 'right',
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            }}
            codeTagProps={{
              style: {
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              },
            }}
          >
            {children}
          </SyntaxHighlighter>
        </div>

        <div
          className="flex items-baseline justify-between px-5 py-2"
          style={{ borderTop: '1px solid var(--ldg-rule)' }}
        >
          <span className="ldg-label">READ-ONLY · ENTERED IN INK</span>
          <span className="ldg-eyebrow">LEDGER</span>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default LedgerCodeModal;
