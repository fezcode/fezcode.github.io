import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import '../styles/Orbit.css';
import useOrbitDialog from './orbit/useOrbitDialog';

/* A prism style written in the orbit's own inks — every colour is a --orb-*
   token so the code re-inks itself when the register cycles. */
const orbitSyntaxTheme = {
  'code[class*="language-"]': {
    color: 'var(--orb-fg)',
    background: 'none',
    textShadow: 'none',
  },
  'pre[class*="language-"]': {
    color: 'var(--orb-fg)',
    background: 'none',
    textShadow: 'none',
  },
  comment: { color: 'var(--orb-muted)', fontStyle: 'italic' },
  prolog: { color: 'var(--orb-muted)' },
  doctype: { color: 'var(--orb-muted)' },
  cdata: { color: 'var(--orb-muted)' },
  punctuation: { color: 'var(--orb-muted)' },
  namespace: { opacity: 0.7 },
  property: { color: 'var(--orb-accent)' },
  tag: { color: 'var(--orb-accent)' },
  boolean: { color: 'var(--orb-accent)' },
  number: { color: 'var(--orb-accent)' },
  constant: { color: 'var(--orb-accent)' },
  symbol: { color: 'var(--orb-accent)' },
  deleted: { color: 'var(--orb-muted)', textDecoration: 'line-through' },
  selector: { color: 'var(--orb-accent)' },
  'attr-name': { color: 'var(--orb-muted)' },
  string: { color: 'var(--orb-accent)' },
  char: { color: 'var(--orb-accent)' },
  builtin: { color: 'var(--orb-accent)' },
  inserted: { color: 'var(--orb-accent)' },
  operator: { color: 'var(--orb-muted)' },
  entity: { color: 'var(--orb-muted)', cursor: 'help' },
  url: { color: 'var(--orb-accent)' },
  atrule: { color: 'var(--orb-accent)' },
  'attr-value': { color: 'var(--orb-accent)' },
  keyword: { color: 'var(--orb-highlight)', fontWeight: '700' },
  function: { color: 'var(--orb-highlight)', fontWeight: '500' },
  'class-name': { color: 'var(--orb-highlight)', fontWeight: '500' },
  regex: { color: 'var(--orb-accent)' },
  important: { color: 'var(--orb-accent)', fontWeight: 'bold' },
  variable: { color: 'var(--orb-fg)' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};

const OrbitCodeModal = ({ isOpen, onClose, children, language }) => {
  const [copied, setCopied] = useState(false);

  const dialogRef = useOrbitDialog(isOpen, onClose);

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
      className="orb-scrim"
      style={{ zIndex: 1000, alignItems: 'center', padding: '1rem' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="orb-modal"
        style={{ maxWidth: '1024px', height: '85vh', maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Source code"
      >
        <div
          className="flex items-baseline justify-between gap-4 px-5 py-3"
          style={{ borderBottom: '1px solid var(--orb-rule)' }}
        >
          <span className="orb-label truncate">
            SOURCE CODE ·{' '}
            <span className="orb-accent">
              {(language || 'text').toUpperCase()}
            </span>
          </span>
          <div className="flex items-baseline gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="orb-btn orb-btn-accent"
            >
              {copied ? 'COPIED ✓' : 'COPY'}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="orb-btn"
            >
              [×]
            </button>
          </div>
        </div>

        <div
          className="flex-1 overflow-auto orb-sunken"
          style={{ minHeight: 0 }}
        >
          <SyntaxHighlighter
            style={orbitSyntaxTheme}
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
              color: 'var(--orb-muted)',
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
          style={{ borderTop: '1px solid var(--orb-rule)' }}
        >
          <span className="orb-label">Source code · Read only</span>
          <span className="orb-eyebrow">ORBIT</span>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default OrbitCodeModal;
