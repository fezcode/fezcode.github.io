import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistPinnedAppPage from './brutalist-views/BrutalistPinnedAppPage';
import LuxePinnedAppsPage from './luxe-views/LuxePinnedAppsPage';
import TerracottaPinnedAppPage from './terracotta-views/TerracottaPinnedAppPage';
import MistPinnedAppPage from './mist-views/MistPinnedAppPage';

const PinnedAppPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxePinnedAppsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaPinnedAppPage />;
  if (fezcodexTheme === 'mist') return <MistPinnedAppPage />;
  return <BrutalistPinnedAppPage />;
};

export default PinnedAppPage;
