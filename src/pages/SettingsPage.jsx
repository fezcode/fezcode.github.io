import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistSettingsPage from './brutalist-views/BrutalistSettingsPage';
import LuxeSettingsPage from './luxe-views/LuxeSettingsPage';
import TerracottaSettingsPage from './terracotta-views/TerracottaSettingsPage';

const SettingsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeSettingsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaSettingsPage />;
  return <BrutalistSettingsPage />;
};

export default SettingsPage;
