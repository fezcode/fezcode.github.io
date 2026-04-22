import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistLogDetailPage from './brutalist-views/BrutalistLogDetailPage';
import LuxeLogDetailPage from './luxe-views/LuxeLogDetailPage';
import TerracottaLogDetailPage from './terracotta-views/TerracottaLogDetailPage';

const LogDetailPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeLogDetailPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaLogDetailPage />;
  return <BrutalistLogDetailPage />;
};

export default LogDetailPage;
