import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistSeriesPage from './brutalist-views/BrutalistSeriesPage';
import LuxeSeriesPage from './luxe-views/LuxeSeriesPage';

const SeriesPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeSeriesPage />;
  }

  return <BrutalistSeriesPage />;
};

export default SeriesPage;
