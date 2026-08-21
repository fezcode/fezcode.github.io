import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistCommandPalette from './BrutalistCommandPalette';
import LuxeCommandPalette from './LuxeCommandPalette';
import TerracottaCommandPalette from './TerracottaCommandPalette';
import MistCommandPalette from './MistCommandPalette';
import LedgerCommandPalette from './LedgerCommandPalette';

const CommandPalette = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeCommandPalette {...props} />;
  if (fezcodexTheme === 'terracotta')
    return <TerracottaCommandPalette {...props} />;
  if (fezcodexTheme === 'mist') return <MistCommandPalette {...props} />;
  if (fezcodexTheme === 'ledger') return <LedgerCommandPalette {...props} />;
  return <BrutalistCommandPalette {...props} />;
};

export default CommandPalette;
