import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistAppsPage from './brutalist-views/BrutalistAppsPage';
import LuxeAppsPage from './luxe-views/LuxeAppsPage';
import TerracottaAppsPage from './terracotta-views/TerracottaAppsPage';

const AppPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeAppsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaAppsPage />;
  return <BrutalistAppsPage />;
};

export default AppPage;
