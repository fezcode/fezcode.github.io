import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistLogsPage from './brutalist-views/BrutalistLogsPage';
import LuxeLogsPage from './luxe-views/LuxeLogsPage';
import TerracottaLogsPage from './terracotta-views/TerracottaLogsPage';
import MistLogsPage from './mist-views/MistLogsPage';
import LedgerLogsPage from './ledger-views/LedgerLogsPage';
import OrbitLogsPage from './orbit-views/OrbitLogsPage';

const LogsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeLogsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaLogsPage />;
  if (fezcodexTheme === 'mist') return <MistLogsPage />;
  if (fezcodexTheme === 'ledger') return <LedgerLogsPage />;
  if (fezcodexTheme === 'orbit') return <OrbitLogsPage />;
  return <BrutalistLogsPage />;
};

export default LogsPage;
