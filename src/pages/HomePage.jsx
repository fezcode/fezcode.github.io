import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistHomePage from './homepage-views/BrutalistHomePage';
import LuxeHomePage from './homepage-views/LuxeHomePage';

const HomePage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeHomePage />;
  }

  return <BrutalistHomePage />;
};

export default HomePage;
