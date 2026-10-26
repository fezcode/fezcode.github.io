import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import KnitDialog from './knit/KnitDialog';
import { KnitText, YARN } from './knit';
import '../styles/Knit.css';

const KnitImageModal = ({ src, alt, onClose }) => {
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
    <KnitDialog
      isOpen
      onClose={onClose}
      title={showAlt ? alt : 'Image viewer'}
      width="88vw"
      footer={
        <KnitText
          text={dimensions ? `${dimensions.width} × ${dimensions.height} px` : 'Measuring…'}
          size="small"
          fg={YARN.wheat}
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
            boxShadow: '0 0 0 6px #efe6d6, 0 6px 16px rgba(0,0,0,.5)',
          }}
          className="w-auto h-auto object-contain block select-none my-2"
        />
      </div>
    </KnitDialog>,
    document.body,
  );
};

export default KnitImageModal;
