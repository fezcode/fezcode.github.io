import React from 'react';
import KnitDialog from './knit/KnitDialog';
import '../styles/Knit.css';

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

const KnitModal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => (
  <KnitDialog
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    width={WIDTHS[maxWidth] || 576}
  >
    <div className="knt-patch">{children}</div>
  </KnitDialog>
);

export default KnitModal;
