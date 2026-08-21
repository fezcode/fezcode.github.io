import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistAchievementsPage from './brutalist-views/BrutalistAchievementsPage';
import LuxeAchievementsPage from './luxe-views/LuxeAchievementsPage';
import TerracottaAchievementsPage from './terracotta-views/TerracottaAchievementsPage';
import MistAchievementsPage from './mist-views/MistAchievementsPage';
import LedgerAchievementsPage from './ledger-views/LedgerAchievementsPage';

const AchievementsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeAchievementsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaAchievementsPage />;
  if (fezcodexTheme === 'mist') return <MistAchievementsPage />;
  if (fezcodexTheme === 'ledger') return <LedgerAchievementsPage />;
  return <BrutalistAchievementsPage />;
};

export default AchievementsPage;
