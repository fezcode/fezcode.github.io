import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { MarquetryDialog, MarquetryText, WOOD } from './marquetry';
import '../styles/Marquetry.css';

const MarquetryImageModal = ({ src, alt, onClose }) => {
  const [dimensions, setDimensions] = useState(null);
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
    <MarquetryDialog
      isOpen
      onClose={onClose}
      title={showAlt ? alt : 'Image viewer'}
      width="88vw"
      footer={
        <MarquetryText
          text={
            dimensions
              ? `${dimensions.width} × ${dimensions.height} px`
              : 'Measuring…'
          }
          size="small"
          fg={WOOD.bark}
          fit
        />
      }
    >
      <div className="flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          onLoad={(e) =>
            setDimensions({
              width: e.target.naturalWidth,
              height: e.target.naturalHeight,
            })
          }
          style={{
            maxWidth: '100%',
            maxHeight: 'calc(86vh - 11rem)',
            borderRadius: 6,
            boxShadow: '0 0 0 6px #eee0bb, 0 6px 16px rgba(0,0,0,.35)',
          }}
          className="w-auto h-auto object-contain block select-none my-2"
        />
      </div>
    </MarquetryDialog>,
    document.body,
  );
};

export default MarquetryImageModal;
