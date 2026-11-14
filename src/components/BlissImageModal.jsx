import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ImageIcon } from '@phosphor-icons/react';
import { BlissDialog } from './bliss';
import '../styles/Bliss.css';

const BlissImageModal = ({ src, alt, onClose }) => {
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
    <BlissDialog
      isOpen
      onClose={onClose}
      title={showAlt ? alt : 'Image viewer'}
      icon={ImageIcon}
      width="88vw"
      footer={
        <span>
          {dimensions
            ? `${dimensions.width} × ${dimensions.height} px`
            : 'Measuring…'}
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
            maxHeight: 'calc(86vh - 11rem)',
            padding: 4,
            background: 'var(--bl-paper)',
            border: '1px solid #7f9db9',
            boxShadow: '0 4px 12px rgba(0, 20, 80, 0.25)',
          }}
          className="w-auto h-auto object-contain block select-none my-2"
        />
      </div>
    </BlissDialog>,
    document.body,
  );
};

export default BlissImageModal;
