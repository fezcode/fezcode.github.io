import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistImageModal from './BrutalistImageModal';
import LuxeImageModal from './LuxeImageModal';

const ImageModal = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeImageModal {...props} />;
  }

  return <BrutalistImageModal {...props} />;
};

export default ImageModal;
