import React from 'react';
import StudioCommandPalette from './StudioCommandPalette';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistCommandPalette from './BrutalistCommandPalette';
import LuxeCommandPalette from './LuxeCommandPalette';
import TerracottaCommandPalette from './TerracottaCommandPalette';
import MistCommandPalette from './MistCommandPalette';
import LedgerCommandPalette from './LedgerCommandPalette';
import OrbitCommandPalette from './OrbitCommandPalette';
import KnitCommandPalette from './KnitCommandPalette';
import KilimCommandPalette from './KilimCommandPalette';
import BlissCommandPalette from './BlissCommandPalette';

const CommandPalette = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'studio') return <StudioCommandPalette {...props} />;
  if (fezcodexTheme === 'luxe') return <LuxeCommandPalette {...props} />;
  if (fezcodexTheme === 'terracotta')
    return <TerracottaCommandPalette {...props} />;
  if (fezcodexTheme === 'mist') return <MistCommandPalette {...props} />;
  if (fezcodexTheme === 'ledger') return <LedgerCommandPalette {...props} />;
  if (fezcodexTheme === 'orbit') return <OrbitCommandPalette {...props} />;
  if (fezcodexTheme === 'knit') return <KnitCommandPalette {...props} />;
  if (fezcodexTheme === 'kilim') return <KilimCommandPalette {...props} />;
  if (fezcodexTheme === 'bliss') return <BlissCommandPalette {...props} />;
  return <BrutalistCommandPalette {...props} />;
};

export default CommandPalette;
