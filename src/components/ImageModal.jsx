import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistImageModal from './BrutalistImageModal';
import LuxeImageModal from './LuxeImageModal';
import TerracottaImageModal from './TerracottaImageModal';

const ImageModal = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeImageModal {...props} />;
  if (fezcodexTheme === 'terracotta') return <TerracottaImageModal {...props} />;
  return <BrutalistImageModal {...props} />;
};

export default ImageModal;
