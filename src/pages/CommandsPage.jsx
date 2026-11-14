import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistCommandsPage from './brutalist-views/BrutalistCommandsPage';
import LuxeCommandsPage from './luxe-views/LuxeCommandsPage';
import TerracottaCommandsPage from './terracotta-views/TerracottaCommandsPage';
import MistCommandsPage from './mist-views/MistCommandsPage';
import LedgerCommandsPage from './ledger-views/LedgerCommandsPage';
import OrbitCommandsPage from './orbit-views/OrbitCommandsPage';
import KnitCommandsPage from './knit-views/KnitCommandsPage';
import BlissCommandsPage from './bliss-views/BlissCommandsPage';

const CommandsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeCommandsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaCommandsPage />;
  if (fezcodexTheme === 'mist') return <MistCommandsPage />;
  if (fezcodexTheme === 'ledger') return <LedgerCommandsPage />;
  if (fezcodexTheme === 'orbit') return <OrbitCommandsPage />;
  if (fezcodexTheme === 'knit') return <KnitCommandsPage />;
  if (fezcodexTheme === 'bliss') return <BlissCommandsPage />;
  return <BrutalistCommandsPage />;
};

export default CommandsPage;
