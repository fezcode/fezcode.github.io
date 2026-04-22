import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistCommandPalette from './BrutalistCommandPalette';
import LuxeCommandPalette from './LuxeCommandPalette';
import TerracottaCommandPalette from './TerracottaCommandPalette';

const CommandPalette = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeCommandPalette {...props} />;
  if (fezcodexTheme === 'terracotta') return <TerracottaCommandPalette {...props} />;
  return <BrutalistCommandPalette {...props} />;
};

export default CommandPalette;
