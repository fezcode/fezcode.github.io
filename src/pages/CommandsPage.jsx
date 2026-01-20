import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistCommandsPage from './brutalist-views/BrutalistCommandsPage';
import LuxeCommandsPage from './luxe-views/LuxeCommandsPage';

const CommandsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeCommandsPage />;
  }

  return <BrutalistCommandsPage />;
};

export default CommandsPage;
