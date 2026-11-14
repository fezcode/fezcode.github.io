import React from 'react';
import BlissWindow from './BlissWindow';
import useOrbitDialog from '../orbit/useOrbitDialog';

/**
 * The shell every Bliss overlay shares: a window over a dimmed desktop.
 * Focus is trapped and Escape closes (the dialog behaviour is Orbit's).
 */
const BlissDialog = ({
  isOpen,
  onClose,
  title,
  label,
  icon = 'AppWindowIcon',
  actions,
  footer,
  width = 640,
  height,
  flush = false,
  children,
}) => {
  const dialogRef = useOrbitDialog(isOpen, onClose);
  if (!isOpen) return null;
  return (
    <div
      className="bl-overlay"
      style={{ zIndex: 1000 }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bl-modal"
        style={{ maxWidth: width, height, maxHeight: height || '86vh' }}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label || (typeof title === 'string' ? title : undefined)}
      >
        <BlissWindow
          as="div"
          title={title}
          icon={icon}
          tone="blue"
          headingLevel={2}
          actions={actions}
          onClose={onClose}
          flush={flush}
          className="h-full"
          bodyClassName="bl-modal-body"
          style={{ maxHeight: height || '86vh' }}
          status={
            footer === null ? undefined : (
              <>
                <span>
                  <kbd className="bl-kbd">Esc</kbd> to close
                </span>
                {footer || <span>Fezcodex</span>}
              </>
            )
          }
        >
          {children}
        </BlissWindow>
      </div>
    </div>
  );
};

export default BlissDialog;
