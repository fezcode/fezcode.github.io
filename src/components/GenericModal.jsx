import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistModal from './BrutalistModal';
import LuxeModal from './LuxeModal';
import TerracottaModal from './TerracottaModal';

const GenericModal = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeModal {...props} />;
  if (fezcodexTheme === 'terracotta') return <TerracottaModal {...props} />;
  return <BrutalistModal {...props} />;
};

export default GenericModal;
