import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { CheckIcon, CodeIcon, CopyIcon } from '@phosphor-icons/react';
import { BlissDialog } from './bliss';
import '../styles/Bliss.css';

const MONO = "'Lucida Console', 'Consolas', ui-monospace, monospace";

/* A light prism style for the white paper area — the site's dark
   customTheme would be unreadable on white. */
const blissSyntaxTheme = {
  'code[class*="language-"]': {
    color: '#1a1a1a',
    background: 'none',
    textShadow: 'none',
  },
  'pre[class*="language-"]': {
    color: '#1a1a1a',
    background: 'none',
    textShadow: 'none',
  },
  comment: { color: '#2f7a12', fontStyle: 'italic' },
  prolog: { color: '#2f7a12' },
  doctype: { color: '#2f7a12' },
  cdata: { color: '#2f7a12' },
  punctuation: { color: '#555044' },
  namespace: { opacity: 0.7 },
  property: { color: '#0e7490' },
  tag: { color: '#9a1a1a' },
  boolean: { color: '#c2410c' },
  number: { color: '#c2410c' },
  constant: { color: '#c2410c' },
  symbol: { color: '#c2410c' },
  deleted: { color: '#c0341c', textDecoration: 'line-through' },
  selector: { color: '#9a1a1a' },
  'attr-name': { color: '#c2410c' },
  string: { color: '#a31515' },
  char: { color: '#a31515' },
  builtin: { color: '#7a3fd0' },
  inserted: { color: '#2f7a12' },
  operator: { color: '#555044' },
  entity: { color: '#555044', cursor: 'help' },
  url: { color: '#0b3fb0' },
  atrule: { color: '#0b3fb8' },
  'attr-value': { color: '#0b3fb0' },
  keyword: { color: '#0b3fb8', fontWeight: '700' },
  function: { color: '#7a3fd0' },
  'class-name': { color: '#0e7490', fontWeight: '600' },
  regex: { color: '#b4005a' },
  important: { color: '#c0341c', fontWeight: 'bold' },
  variable: { color: '#1a1a1a' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};

const BlissCodeModal = ({ isOpen, onClose, children, language }) => {
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
    <BlissDialog
      isOpen={isOpen}
      onClose={onClose}
      label="Source code"
      title={`Source code · ${language || 'text'}`}
      icon={CodeIcon}
      width={1024}
      height="85vh"
      flush
      footer={<span>Language: {language || 'text'}</span>}
      actions={
        <button
          type="button"
          onClick={handleCopy}
          className="bl-btn bl-btn-sm"
        >
          {copied ? (
            <CheckIcon size={14} weight="bold" aria-hidden="true" />
          ) : (
            <CopyIcon size={14} weight="bold" aria-hidden="true" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      }
    >
      <div
        className="h-full overflow-auto"
        style={{
          background: 'var(--bl-paper)',
          borderTop: '1px solid var(--bl-line)',
        }}
      >
        <SyntaxHighlighter
          style={blissSyntaxTheme}
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
            color: '#8a8676',
            textAlign: 'right',
            fontFamily: MONO,
          }}
          codeTagProps={{ style: { fontFamily: MONO } }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </BlissDialog>,
    document.body,
  );
};

export default BlissCodeModal;
