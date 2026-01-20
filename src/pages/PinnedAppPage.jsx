import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistPinnedAppPage from './brutalist-views/BrutalistPinnedAppPage';
import LuxePinnedAppsPage from './luxe-views/LuxePinnedAppsPage';

const PinnedAppPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxePinnedAppsPage />;
  }

  return <BrutalistPinnedAppPage />;
};

export default PinnedAppPage;
