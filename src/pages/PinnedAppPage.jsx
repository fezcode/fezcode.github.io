import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistPinnedAppPage from './brutalist-views/BrutalistPinnedAppPage';
import LuxePinnedAppsPage from './luxe-views/LuxePinnedAppsPage';
import TerracottaPinnedAppPage from './terracotta-views/TerracottaPinnedAppPage';

const PinnedAppPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxePinnedAppsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaPinnedAppPage />;
  return <BrutalistPinnedAppPage />;
};

export default PinnedAppPage;
