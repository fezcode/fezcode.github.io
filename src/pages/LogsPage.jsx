import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistLogsPage from './brutalist-views/BrutalistLogsPage';
import LuxeLogsPage from './luxe-views/LuxeLogsPage';

const LogsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeLogsPage />;
  }

  return <BrutalistLogsPage />;
};

export default LogsPage;
