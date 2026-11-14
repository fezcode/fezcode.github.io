import React from 'react';
import { BlissDialog } from './bliss';
import '../styles/Bliss.css';

const WIDTHS = {
  'max-w-sm': 384,
  'max-w-md': 448,
  'max-w-lg': 512,
  'max-w-xl': 576,
  'max-w-2xl': 672,
  'max-w-3xl': 768,
  'max-w-4xl': 896,
  'max-w-5xl': 1024,
};

const BlissModal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
}) => (
  <BlissDialog
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    width={WIDTHS[maxWidth] || 576}
  >
    <div style={{ color: 'var(--bl-ink)', fontSize: 15, lineHeight: 1.55 }}>
      {children}
    </div>
  </BlissDialog>
);

export default BlissModal;
