import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistAchievementsPage from './brutalist-views/BrutalistAchievementsPage';
import LuxeAchievementsPage from './luxe-views/LuxeAchievementsPage';
import TerracottaAchievementsPage from './terracotta-views/TerracottaAchievementsPage';

const AchievementsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeAchievementsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaAchievementsPage />;
  return <BrutalistAchievementsPage />;
};

export default AchievementsPage;
