import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import '../styles/Ledger.css';

/**
 * Ledger theme image modal — the image mounted as a plate. A double-ruled
 * frame holds the picture; beneath it a caption line records the plate name
 * and its measured dimensions, the way an archive labels its exhibits.
 */
const LedgerImageModal = ({ src, alt, onClose }) => {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    if (src) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (src) window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [src, onClose]);

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
      className="ldg-scrim"
      style={{ zIndex: 1000, alignItems: 'center', padding: '1rem' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="ldg-modal"
        style={{ maxWidth: '85vw', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={showAlt ? alt : 'Image viewer'}
      >
        <div
          className="flex items-baseline justify-between gap-4 px-5 py-3"
          style={{ borderBottom: '1px solid var(--ldg-rule)' }}
        >
          <span className="ldg-label truncate">PLATE — MOUNTED FOR REVIEW</span>
          <div className="flex items-baseline gap-3 shrink-0">
            <span className="ldg-label hidden md:inline">
              <kbd className="ldg-kbd">ESC</kbd> CLOSE
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="ldg-btn"
            >
              [×]
            </button>
          </div>
        </div>

        <div
          className="ldg-sunken flex-1 flex items-center justify-center overflow-hidden"
          style={{ minHeight: 0, padding: '1rem' }}
        >
          <img
            src={src}
            alt={alt}
            onLoad={handleImageLoad}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(90vh - 9rem)',
              border: '1px solid var(--ldg-rule)',
            }}
            className="w-auto h-auto object-contain block select-none"
          />
        </div>

        <div
          className="flex items-baseline justify-between gap-4 px-5 py-2"
          style={{ borderTop: '1px solid var(--ldg-rule)' }}
        >
          <span className="ldg-label truncate">
            PLATE — {showAlt ? alt.toUpperCase() : 'UNTITLED'}
          </span>
          <span
            className="ldg-label shrink-0"
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

export default LedgerImageModal;
