import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistCommandPalette from './BrutalistCommandPalette';
import LuxeCommandPalette from './LuxeCommandPalette';
import TerracottaCommandPalette from './TerracottaCommandPalette';
import MistCommandPalette from './MistCommandPalette';

const CommandPalette = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeCommandPalette {...props} />;
  if (fezcodexTheme === 'terracotta')
    return <TerracottaCommandPalette {...props} />;
  if (fezcodexTheme === 'mist') return <MistCommandPalette {...props} />;
  return <BrutalistCommandPalette {...props} />;
};

export default CommandPalette;
