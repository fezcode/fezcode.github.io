import React from 'react';
import useOrbitDialog from '../orbit/useOrbitDialog';
import MarquetryText from './MarquetryText';
import { MarquetryBand, MarquetryIcon } from './MarquetryPieces';
import { WOOD } from './wood';

export default function MarquetryDialog({
  isOpen,
  onClose,
  title,
  label,
  actions,
  footer,
  width = 640,
  height,
  children,
}) {
  const dialogRef = useOrbitDialog(isOpen, onClose);
  if (!isOpen) return null;
  return (
    <div
      className="mqt-overlay"
      style={{ zIndex: 1000, alignItems: 'center' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="mqt-modal flex flex-col"
        style={{ maxWidth: width, height, maxHeight: height || '86dvh' }}
        onClick={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label || (typeof title === 'string' ? title : undefined)}
      >
        <MarquetryBand />
        <div className="mqt-dialog-head">
          {typeof title === 'string' ? (
            <MarquetryText
              as="h2"
              text={title}
              fg={WOOD.cream}
              className="flex-1"
            />
          ) : (
            <div className="flex-1 min-w-0">{title}</div>
          )}
          <div className="flex items-center gap-2 shrink-0">
            {actions}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="mqt-btn mqt-btn-icon"
            >
              <MarquetryIcon name="close" fg={WOOD.cream} />
            </button>
          </div>
        </div>
        <div
          className="mqt-modal-body flex-1 overflow-auto"
          style={{ minHeight: 0 }}
        >
          {children}
        </div>
        <div className="mqt-dialog-foot">
          <span className="mqt-label">
            <kbd className="mqt-kbd">ESC</kbd> close
          </span>
          {footer || <span className="mqt-label">Marquetry / Fezcodex</span>}
        </div>
      </div>
    </div>
  );
}
