import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistVocabPage from './brutalist-views/BrutalistVocabPage';
import LuxeVocabPage from './luxe-views/LuxeVocabPage';
import TerracottaVocabPage from './terracotta-views/TerracottaVocabPage';

const VocabPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeVocabPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaVocabPage />;
  return <BrutalistVocabPage />;
};

export default VocabPage;
