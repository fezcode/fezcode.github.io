import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistHomePage from './brutalist-views/BrutalistHomePage';
import LuxeHomePage from './luxe-views/LuxeHomePage';

const HomePage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeHomePage />;
  }

  return <BrutalistHomePage />;
};

export default HomePage;
