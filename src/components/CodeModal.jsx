import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistCodeModal from './BrutalistCodeModal';
import LuxeCodeModal from './LuxeCodeModal';
import TerracottaCodeModal from './TerracottaCodeModal';
import MistCodeModal from './MistCodeModal';
import LedgerCodeModal from './LedgerCodeModal';
import OrbitCodeModal from './OrbitCodeModal';
import KnitCodeModal from './KnitCodeModal';
import BlissCodeModal from './BlissCodeModal';

const CodeModal = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeCodeModal {...props} />;
  if (fezcodexTheme === 'terracotta') return <TerracottaCodeModal {...props} />;
  if (fezcodexTheme === 'mist') return <MistCodeModal {...props} />;
  if (fezcodexTheme === 'ledger') return <LedgerCodeModal {...props} />;
  if (fezcodexTheme === 'orbit') return <OrbitCodeModal {...props} />;
  if (fezcodexTheme === 'knit') return <KnitCodeModal {...props} />;
  if (fezcodexTheme === 'bliss') return <BlissCodeModal {...props} />;
  return <BrutalistCodeModal {...props} />;
};

export default CodeModal;
