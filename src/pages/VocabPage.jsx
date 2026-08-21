import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistVocabPage from './brutalist-views/BrutalistVocabPage';
import LuxeVocabPage from './luxe-views/LuxeVocabPage';
import TerracottaVocabPage from './terracotta-views/TerracottaVocabPage';
import MistVocabPage from './mist-views/MistVocabPage';
import LedgerVocabPage from './ledger-views/LedgerVocabPage';

const VocabPage = () => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeVocabPage />;
  if (fezcodexTheme === 'terracotta') return <TerracottaVocabPage />;
  if (fezcodexTheme === 'mist') return <MistVocabPage />;
  if (fezcodexTheme === 'ledger') return <LedgerVocabPage />;
  return <BrutalistVocabPage />;
};

export default VocabPage;
