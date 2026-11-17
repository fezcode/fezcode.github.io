import React from 'react';
import KilimText from './KilimText';
import { KilimIcon, KilimBand } from './KilimPieces';
import { WOOL } from './engine';
import useOrbitDialog from '../orbit/useOrbitDialog';

/**
 * The shell every Kilim overlay shares: a woven piece over a darkened room,
 * a chain band at each end, a woven title, a close button. Focus is trapped
 * and Escape closes (the dialog behaviour is Orbit's).
 */
const KilimDialog = ({
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
      className="klm-overlay"
      style={{ zIndex: 1000 }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="klm-modal"
        style={{ maxWidth: width, height, maxHeight: height || '86vh' }}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label || (typeof title === 'string' ? title : undefined)}
      >
        <KilimBand pattern="end" />
        <div className="klm-modal-head">
          {typeof title === 'string' ? (
            <KilimText as="h2" text={title} maxLines={1} className="flex-1 min-w-0" />
          ) : (
            <div className="flex-1 min-w-0">{title}</div>
          )}
          <div className="flex items-center gap-2 shrink-0">
            {actions}
            <button type="button" onClick={onClose} aria-label="Close" className="klm-btn klm-btn-icon">
              <KilimIcon name="close" fg={WOOL.walnut} />
            </button>
          </div>
        </div>
        <div className="klm-modal-body">{children}</div>
        <div className="klm-modal-foot">
          <span className="klm-label">
            <kbd className="klm-kbd">Esc</kbd> close
          </span>
          {footer || <span className="klm-label">Kilim</span>}
        </div>
        <KilimBand pattern="end" />
      </div>
    </div>
  );
};

export default KilimDialog;
