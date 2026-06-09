import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistLogDetailPage from './brutalist-views/BrutalistLogDetailPage';
import LuxeLogDetailPage from './luxe-views/LuxeLogDetailPage';
import TerracottaLogDetailPage from './terracotta-views/TerracottaLogDetailPage';
import MistLogDetailPage from './mist-views/MistLogDetailPage';

const LogDetailPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeLogDetailPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaLogDetailPage />;
  if (fezcodexTheme === 'mist') return <MistLogDetailPage />;
  return <BrutalistLogDetailPage />;
};

export default LogDetailPage;
