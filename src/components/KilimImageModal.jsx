import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import KilimDialog from './kilim/KilimDialog';
import '../styles/Kilim.css';

const KilimImageModal = ({ src, alt, onClose }) => {
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
    <KilimDialog
      isOpen
      onClose={onClose}
      title={showAlt ? alt : 'Image viewer'}
      width="88vw"
      footer={
        <span className="klm-label">
          {dimensions ? `${dimensions.width} × ${dimensions.height} px` : 'Measuring…'}
        </span>
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
            maxHeight: 'calc(86vh - 12rem)',
            border: '3px solid #2e1910',
            boxShadow: '0 0 0 6px #efe5cf, 8px 8px 0 6px rgba(20,8,4,.6)',
          }}
          className="w-auto h-auto object-contain block select-none my-3"
        />
      </div>
    </KilimDialog>,
    document.body,
  );
};

export default KilimImageModal;
