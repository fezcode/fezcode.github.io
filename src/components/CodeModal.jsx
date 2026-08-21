import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistCodeModal from './BrutalistCodeModal';
import LuxeCodeModal from './LuxeCodeModal';
import TerracottaCodeModal from './TerracottaCodeModal';
import MistCodeModal from './MistCodeModal';
import LedgerCodeModal from './LedgerCodeModal';

const CodeModal = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeCodeModal {...props} />;
  if (fezcodexTheme === 'terracotta') return <TerracottaCodeModal {...props} />;
  if (fezcodexTheme === 'mist') return <MistCodeModal {...props} />;
  if (fezcodexTheme === 'ledger') return <LedgerCodeModal {...props} />;
  return <BrutalistCodeModal {...props} />;
};

export default CodeModal;
