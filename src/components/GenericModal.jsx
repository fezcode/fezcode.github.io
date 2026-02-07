import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistModal from './BrutalistModal';
import LuxeModal from './LuxeModal';

const GenericModal = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeModal {...props} />;
  }

  return <BrutalistModal {...props} />;
};

export default GenericModal;
