import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistCommandPalette from './BrutalistCommandPalette';
import LuxeCommandPalette from './LuxeCommandPalette';

const CommandPalette = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeCommandPalette {...props} />;
  }

  return <BrutalistCommandPalette {...props} />;
};

export default CommandPalette;
