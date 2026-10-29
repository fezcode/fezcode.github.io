import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistModal from './BrutalistModal';
import LuxeModal from './LuxeModal';
import TerracottaModal from './TerracottaModal';
import MistModal from './MistModal';
import LedgerModal from './LedgerModal';
import OrbitModal from './OrbitModal';
import MarquetryModal from './MarquetryModal';
import KnitModal from './KnitModal';

const GenericModal = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeModal {...props} />;
  if (fezcodexTheme === 'terracotta') return <TerracottaModal {...props} />;
  if (fezcodexTheme === 'mist') return <MistModal {...props} />;
  if (fezcodexTheme === 'ledger') return <LedgerModal {...props} />;
  if (fezcodexTheme === 'orbit') return <OrbitModal {...props} />;
  if (fezcodexTheme === 'marquetry') return <MarquetryModal {...props} />;
  if (fezcodexTheme === 'knit') return <KnitModal {...props} />;
  return <BrutalistModal {...props} />;
};

export default GenericModal;
