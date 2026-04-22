import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistSeriesPage from './brutalist-views/BrutalistSeriesPage';
import LuxeSeriesPage from './luxe-views/LuxeSeriesPage';
import TerracottaSeriesPage from './terracotta-views/TerracottaSeriesPage';

const SeriesPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeSeriesPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaSeriesPage />;
  return <BrutalistSeriesPage />;
};

export default SeriesPage;
