import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistCommandsPage from './brutalist-views/BrutalistCommandsPage';
import LuxeCommandsPage from './luxe-views/LuxeCommandsPage';
import TerracottaCommandsPage from './terracotta-views/TerracottaCommandsPage';

const CommandsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeCommandsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaCommandsPage />;
  return <BrutalistCommandsPage />;
};

export default CommandsPage;
