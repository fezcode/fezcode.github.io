import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistAppsPage from './brutalist-views/BrutalistAppsPage';
import LuxeAppsPage from './luxe-views/LuxeAppsPage';

const AppPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeAppsPage />;
  }

  return <BrutalistAppsPage />;
};

export default AppPage;
