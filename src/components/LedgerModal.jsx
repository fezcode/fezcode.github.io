import React, { useEffect } from 'react';
import '../styles/Ledger.css';

/**
 * Ledger theme generic modal — a double-ruled registrar's frame. Uppercase
 * ruled header with a [×] close, body set in the mono voice, and nothing
 * animated: the frame is simply present, or it is not.
 */
const LedgerModal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="ldg-scrim"
      style={{ zIndex: 1000, alignItems: 'center', padding: '1rem' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`ldg-modal w-full ${maxWidth}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
      >
        <div
          className="flex items-baseline justify-between gap-4 px-5 py-4"
          style={{ borderBottom: '1px solid var(--ldg-rule)' }}
        >
          <h2
            className="m-0 font-bold uppercase truncate"
            style={{
              fontSize: '0.95rem',
              letterSpacing: '2px',
              color: 'var(--ldg-highlight)',
            }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ldg-btn shrink-0"
          >
            [×]
          </button>
        </div>

        <div
          className="ldg-prose px-5 py-5 overflow-y-auto"
          style={{ maxHeight: '70vh' }}
        >
          {children}
        </div>

        <div
          className="flex items-baseline justify-between px-5 py-2"
          style={{ borderTop: '1px solid var(--ldg-rule)' }}
        >
          <span className="ldg-label">
            <kbd className="ldg-kbd">ESC</kbd> CLOSE
          </span>
          <span className="ldg-eyebrow">FILED</span>
        </div>
      </div>
    </div>
  );
};

export default LedgerModal;
