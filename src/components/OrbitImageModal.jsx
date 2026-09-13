import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import '../styles/Orbit.css';
import useOrbitDialog from './orbit/useOrbitDialog';

const OrbitImageModal = ({ src, alt, onClose }) => {
  const [dimensions, setDimensions] = useState(null);

  const dialogRef = useOrbitDialog(!!src, onClose);

  const handleImageLoad = (e) => {
    setDimensions({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    });
  };

  const showAlt =
    alt &&
    ![
      'Project Detail',
      'Enlarged Content',
      'Intel Imagery',
      'Full size image',
    ].includes(alt);

  if (!src) return null;

  return createPortal(
    <div
      className="orb-scrim"
      style={{ zIndex: 1000, alignItems: 'center', padding: '1rem' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="orb-modal"
        style={{ maxWidth: '85vw', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={showAlt ? alt : 'Image viewer'}
      >
        <div
          className="flex items-baseline justify-between gap-4 px-5 py-3"
          style={{ borderBottom: '1px solid var(--orb-rule)' }}
        >
          <span className="orb-label truncate">IMAGE VIEWER</span>
          <div className="flex items-baseline gap-3 shrink-0">
            <span className="orb-label hidden md:inline">
              <kbd className="orb-kbd">ESC</kbd> CLOSE
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="orb-btn"
            >
              [×]
            </button>
          </div>
        </div>

        <div
          className="orb-sunken flex-1 flex items-center justify-center overflow-hidden"
          style={{ minHeight: 0, padding: '1rem' }}
        >
          <img
            src={src}
            alt={alt}
            onLoad={handleImageLoad}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(90vh - 9rem)',
              border: '1px solid var(--orb-rule)',
            }}
            className="w-auto h-auto object-contain block select-none"
          />
        </div>

        <div
          className="flex items-baseline justify-between gap-4 px-5 py-2"
          style={{ borderTop: '1px solid var(--orb-rule)' }}
        >
          <span className="orb-label truncate">
            IMAGE · {showAlt ? alt.toUpperCase() : 'UNTITLED'}
          </span>
          <span
            className="orb-label shrink-0"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {dimensions
              ? `${dimensions.width} × ${dimensions.height} PX`
              : 'MEASURING…'}
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default OrbitImageModal;
