import React from 'react';
import { MarquetryDialog } from './marquetry';
import ThemePicker from './ThemePicker';
import '../styles/Marquetry.css';

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

const MarquetryModal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
}) => (
  <MarquetryDialog
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    width={WIDTHS[maxWidth] || 576}
  >
    <div
      className={
        React.isValidElement(children) && children.type === ThemePicker
          ? 'mqt-patch'
          : 'mqt-patch mqt-prose mqt-generic-content'
      }
    >
      {children}
    </div>
  </MarquetryDialog>
);

export default MarquetryModal;
