import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistSettingsPage from './brutalist-views/BrutalistSettingsPage';
import LuxeSettingsPage from './luxe-views/LuxeSettingsPage';
import TerracottaSettingsPage from './terracotta-views/TerracottaSettingsPage';
import MistSettingsPage from './mist-views/MistSettingsPage';
import LedgerSettingsPage from './ledger-views/LedgerSettingsPage';

const SettingsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeSettingsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaSettingsPage />;
  if (fezcodexTheme === 'mist') return <MistSettingsPage />;
  if (fezcodexTheme === 'ledger') return <LedgerSettingsPage />;
  return <BrutalistSettingsPage />;
};

export default SettingsPage;
