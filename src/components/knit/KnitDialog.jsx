import React from 'react';
import KnitText from './KnitText';
import { KnitIcon, KnitBand } from './KnitPieces';
import { YARN } from './engine';
import useOrbitDialog from '../orbit/useOrbitDialog';

/**
 * The shell every Knit overlay shares: a knitted piece over a dimmed room,
 * with a knitted title, a close button and a peerie band at each end.
 * Focus is trapped and Escape closes (the dialog behaviour is Orbit's).
 */
const KnitDialog = ({
  isOpen,
  onClose,
  title,
  label,
  actions,
  footer,
  width = 640,
  height,
  children,
}) => {
  const dialogRef = useOrbitDialog(isOpen, onClose);
  if (!isOpen) return null;
  return (
    <div
      className="knt-overlay"
      style={{ zIndex: 1000, alignItems: 'center' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="knt-modal flex flex-col"
        style={{ maxWidth: width, height, maxHeight: height || '86vh' }}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label || (typeof title === 'string' ? title : undefined)}
      >
        <KnitBand pattern="peerie" />
        <div className="flex items-center justify-between gap-3 px-4 py-3 knt-wool-bark">
          {typeof title === 'string' ? (
            <KnitText as="h2" text={title} size="small" fg={YARN.gold} maxLines={1} className="flex-1" />
          ) : (
            <div className="flex-1 min-w-0">{title}</div>
          )}
          <div className="flex items-center gap-2 shrink-0">
            {actions}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="knt-btn knt-btn-icon"
            >
              <KnitIcon name="close" fg={YARN.cream} />
            </button>
          </div>
        </div>
        <div className="knt-modal-body flex-1 overflow-auto" style={{ minHeight: 0 }}>
          {children}
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-2 knt-wool-bark">
          <span className="knt-label">
            <kbd className="knt-kbd">ESC</kbd> close
          </span>
          {footer || <KnitText text="Knit" size="small" fg={YARN.wheat} fit />}
        </div>
        <KnitBand pattern="peerie" />
      </div>
    </div>
  );
};

export default KnitDialog;
