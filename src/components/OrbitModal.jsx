import React from 'react';
import '../styles/Orbit.css';
import useOrbitDialog from './orbit/useOrbitDialog';

const OrbitModal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
}) => {
  const dialogRef = useOrbitDialog(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="orb-scrim"
      style={{ zIndex: 1000, alignItems: 'center', padding: '1rem' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`orb-modal w-full ${maxWidth}`}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
      >
        <div
          className="flex items-baseline justify-between gap-4 px-5 py-4"
          style={{ borderBottom: '1px solid var(--orb-rule)' }}
        >
          <h2
            className="m-0 font-bold uppercase truncate"
            style={{
              fontSize: '0.95rem',
              letterSpacing: '2px',
              color: 'var(--orb-highlight)',
            }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="orb-btn shrink-0"
          >
            [×]
          </button>
        </div>

        <div
          className="orb-prose px-5 py-5 overflow-y-auto"
          style={{ maxHeight: '70vh' }}
        >
          {children}
        </div>

        <div
          className="flex items-baseline justify-between px-5 py-2"
          style={{ borderTop: '1px solid var(--orb-rule)' }}
        >
          <span className="orb-label">
            <kbd className="orb-kbd">ESC</kbd> CLOSE
          </span>
          <span className="orb-eyebrow">ORBIT</span>
        </div>
      </div>
    </div>
  );
};

export default OrbitModal;
