import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistAchievementsPage from './brutalist-views/BrutalistAchievementsPage';
import LuxeAchievementsPage from './luxe-views/LuxeAchievementsPage';
import TerracottaAchievementsPage from './terracotta-views/TerracottaAchievementsPage';
import MistAchievementsPage from './mist-views/MistAchievementsPage';

const AchievementsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeAchievementsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaAchievementsPage />;
  if (fezcodexTheme === 'mist') return <MistAchievementsPage />;
  return <BrutalistAchievementsPage />;
};

export default AchievementsPage;
