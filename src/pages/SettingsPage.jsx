import React from 'react';
import StudioSettingsPage from './studio-views/StudioSettingsPage';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistSettingsPage from './brutalist-views/BrutalistSettingsPage';
import LuxeSettingsPage from './luxe-views/LuxeSettingsPage';
import TerracottaSettingsPage from './terracotta-views/TerracottaSettingsPage';
import MistSettingsPage from './mist-views/MistSettingsPage';
import LedgerSettingsPage from './ledger-views/LedgerSettingsPage';
import OrbitSettingsPage from './orbit-views/OrbitSettingsPage';
import KnitSettingsPage from './knit-views/KnitSettingsPage';
import KilimSettingsPage from './kilim-views/KilimSettingsPage';
import BlissSettingsPage from './bliss-views/BlissSettingsPage';

const SettingsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'studio') return <StudioSettingsPage />;
  if (fezcodexTheme === 'luxe') return <LuxeSettingsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaSettingsPage />;
  if (fezcodexTheme === 'mist') return <MistSettingsPage />;
  if (fezcodexTheme === 'ledger') return <LedgerSettingsPage />;
  if (fezcodexTheme === 'orbit') return <OrbitSettingsPage />;
  if (fezcodexTheme === 'knit') return <KnitSettingsPage />;
  if (fezcodexTheme === 'kilim') return <KilimSettingsPage />;
  if (fezcodexTheme === 'bliss') return <BlissSettingsPage />;
  return <BrutalistSettingsPage />;
};

export default SettingsPage;
