import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistHomePage from './brutalist-views/BrutalistHomePage';
import LuxeHomePage from './luxe-views/LuxeHomePage';
import TerracottaHomePage from './terracotta-views/TerracottaHomePage';

const HomePage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeHomePage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaHomePage />;
  return <BrutalistHomePage />;
};

export default HomePage;
