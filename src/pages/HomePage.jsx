import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistHomePage from './brutalist-views/BrutalistHomePage';
import LuxeHomePage from './luxe-views/LuxeHomePage';
import TerracottaHomePage from './terracotta-views/TerracottaHomePage';
import MistHomePage from './mist-views/MistHomePage';
import LedgerHomePage from './ledger-views/LedgerHomePage';
import OrbitHomePage from './orbit-views/OrbitHomePage';
import KnitHomePage from './knit-views/KnitHomePage';
import KilimHomePage from './kilim-views/KilimHomePage';
import BlissHomePage from './bliss-views/BlissHomePage';

const HomePage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeHomePage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaHomePage />;
  if (fezcodexTheme === 'mist') return <MistHomePage />;
  if (fezcodexTheme === 'ledger') return <LedgerHomePage />;
  if (fezcodexTheme === 'orbit') return <OrbitHomePage />;
  if (fezcodexTheme === 'knit') return <KnitHomePage />;
  if (fezcodexTheme === 'kilim') return <KilimHomePage />;
  if (fezcodexTheme === 'bliss') return <BlissHomePage />;
  return <BrutalistHomePage />;
};

export default HomePage;
