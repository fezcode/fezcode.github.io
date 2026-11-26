import React from 'react';
import StudioAchievementsPage from './studio-views/StudioAchievementsPage';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistAchievementsPage from './brutalist-views/BrutalistAchievementsPage';
import LuxeAchievementsPage from './luxe-views/LuxeAchievementsPage';
import TerracottaAchievementsPage from './terracotta-views/TerracottaAchievementsPage';
import MistAchievementsPage from './mist-views/MistAchievementsPage';
import LedgerAchievementsPage from './ledger-views/LedgerAchievementsPage';
import OrbitAchievementsPage from './orbit-views/OrbitAchievementsPage';
import KnitAchievementsPage from './knit-views/KnitAchievementsPage';
import KilimAchievementsPage from './kilim-views/KilimAchievementsPage';
import BlissAchievementsPage from './bliss-views/BlissAchievementsPage';

const AchievementsPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'studio') return <StudioAchievementsPage />;
  if (fezcodexTheme === 'luxe') return <LuxeAchievementsPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaAchievementsPage />;
  if (fezcodexTheme === 'mist') return <MistAchievementsPage />;
  if (fezcodexTheme === 'ledger') return <LedgerAchievementsPage />;
  if (fezcodexTheme === 'orbit') return <OrbitAchievementsPage />;
  if (fezcodexTheme === 'knit') return <KnitAchievementsPage />;
  if (fezcodexTheme === 'kilim') return <KilimAchievementsPage />;
  if (fezcodexTheme === 'bliss') return <BlissAchievementsPage />;
  return <BrutalistAchievementsPage />;
};

export default AchievementsPage;
