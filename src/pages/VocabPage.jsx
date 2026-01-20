import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistVocabPage from './brutalist-views/BrutalistVocabPage';
import LuxeVocabPage from './luxe-views/LuxeVocabPage';

const VocabPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeVocabPage />;
  }

  return <BrutalistVocabPage />;
};

export default VocabPage;
