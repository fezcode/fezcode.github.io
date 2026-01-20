import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistAchievementsPage from './brutalist-views/BrutalistAchievementsPage';
import LuxeAchievementsPage from './luxe-views/LuxeAchievementsPage';

const AchievementsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeAchievementsPage />;
  }

  return <BrutalistAchievementsPage />;
};

export default AchievementsPage;