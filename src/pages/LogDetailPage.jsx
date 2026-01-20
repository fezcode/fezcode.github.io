import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistLogDetailPage from './brutalist-views/BrutalistLogDetailPage';
import LuxeLogDetailPage from './luxe-views/LuxeLogDetailPage';

const LogDetailPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeLogDetailPage />;
  }

  return <BrutalistLogDetailPage />;
};

export default LogDetailPage;
