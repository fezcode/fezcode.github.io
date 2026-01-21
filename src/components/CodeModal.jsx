import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistCodeModal from './BrutalistCodeModal';
import LuxeCodeModal from './LuxeCodeModal';

const CodeModal = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeCodeModal {...props} />;
  }

  return <BrutalistCodeModal {...props} />;
};

export default CodeModal;