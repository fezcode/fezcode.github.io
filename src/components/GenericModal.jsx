import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistModal from './BrutalistModal';
import LuxeModal from './LuxeModal';
import TerracottaModal from './TerracottaModal';
import MistModal from './MistModal';
import LedgerModal from './LedgerModal';

const GenericModal = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeModal {...props} />;
  if (fezcodexTheme === 'terracotta') return <TerracottaModal {...props} />;
  if (fezcodexTheme === 'mist') return <MistModal {...props} />;
  if (fezcodexTheme === 'ledger') return <LedgerModal {...props} />;
  return <BrutalistModal {...props} />;
};

export default GenericModal;
