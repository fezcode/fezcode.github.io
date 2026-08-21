import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistAppsPage from './brutalist-views/BrutalistAppsPage';
import LuxeAppsPage from './luxe-views/LuxeAppsPage';
import TerracottaAppsPage from './terracotta-views/TerracottaAppsPage';
import MistAppsPage from './mist-views/MistAppsPage';
import LedgerAppsPage from './ledger-views/LedgerAppsPage';

const AppPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeAppsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaAppsPage />;
  if (fezcodexTheme === 'mist') return <MistAppsPage />;
  if (fezcodexTheme === 'ledger') return <LedgerAppsPage />;
  return <BrutalistAppsPage />;
};

export default AppPage;
