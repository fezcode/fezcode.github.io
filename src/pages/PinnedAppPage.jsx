import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistPinnedAppPage from './brutalist-views/BrutalistPinnedAppPage';
import LuxePinnedAppsPage from './luxe-views/LuxePinnedAppsPage';
import TerracottaPinnedAppPage from './terracotta-views/TerracottaPinnedAppPage';
import MistPinnedAppPage from './mist-views/MistPinnedAppPage';
import LedgerPinnedAppPage from './ledger-views/LedgerPinnedAppPage';
import OrbitPinnedAppPage from './orbit-views/OrbitPinnedAppPage';
import MarquetryPinnedAppPage from './marquetry-views/MarquetryPinnedAppPage';
import KnitPinnedAppPage from './knit-views/KnitPinnedAppPage';

const PinnedAppPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxePinnedAppsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaPinnedAppPage />;
  if (fezcodexTheme === 'mist') return <MistPinnedAppPage />;
  if (fezcodexTheme === 'ledger') return <LedgerPinnedAppPage />;
  if (fezcodexTheme === 'orbit') return <OrbitPinnedAppPage />;
  if (fezcodexTheme === 'marquetry') return <MarquetryPinnedAppPage />;
  if (fezcodexTheme === 'knit') return <KnitPinnedAppPage />;
  return <BrutalistPinnedAppPage />;
};

export default PinnedAppPage;
