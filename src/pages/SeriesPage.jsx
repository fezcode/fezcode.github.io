import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistSeriesPage from './brutalist-views/BrutalistSeriesPage';
import LuxeSeriesPage from './luxe-views/LuxeSeriesPage';
import TerracottaSeriesPage from './terracotta-views/TerracottaSeriesPage';
import MistSeriesPage from './mist-views/MistSeriesPage';
import LedgerSeriesPage from './ledger-views/LedgerSeriesPage';
import OrbitSeriesPage from './orbit-views/OrbitSeriesPage';
import KnitSeriesPage from './knit-views/KnitSeriesPage';

const SeriesPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeSeriesPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaSeriesPage />;
  if (fezcodexTheme === 'mist') return <MistSeriesPage />;
  if (fezcodexTheme === 'ledger') return <LedgerSeriesPage />;
  if (fezcodexTheme === 'orbit') return <OrbitSeriesPage />;
  if (fezcodexTheme === 'knit') return <KnitSeriesPage />;
  return <BrutalistSeriesPage />;
};

export default SeriesPage;
