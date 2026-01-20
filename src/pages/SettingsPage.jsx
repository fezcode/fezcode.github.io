import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistSettingsPage from './brutalist-views/BrutalistSettingsPage';
import LuxeSettingsPage from './luxe-views/LuxeSettingsPage';

const SettingsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeSettingsPage />;
  }

  return <BrutalistSettingsPage />;
};

export default SettingsPage;
