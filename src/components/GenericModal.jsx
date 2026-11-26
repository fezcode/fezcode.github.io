import React from 'react';
import StudioModal from './StudioModal';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistModal from './BrutalistModal';
import LuxeModal from './LuxeModal';
import TerracottaModal from './TerracottaModal';
import MistModal from './MistModal';
import LedgerModal from './LedgerModal';
import OrbitModal from './OrbitModal';
import KnitModal from './KnitModal';
import KilimModal from './KilimModal';
import BlissModal from './BlissModal';

const GenericModal = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'studio') return <StudioModal {...props} />;
  if (fezcodexTheme === 'luxe') return <LuxeModal {...props} />;
  if (fezcodexTheme === 'terracotta') return <TerracottaModal {...props} />;
  if (fezcodexTheme === 'mist') return <MistModal {...props} />;
  if (fezcodexTheme === 'ledger') return <LedgerModal {...props} />;
  if (fezcodexTheme === 'orbit') return <OrbitModal {...props} />;
  if (fezcodexTheme === 'knit') return <KnitModal {...props} />;
  if (fezcodexTheme === 'kilim') return <KilimModal {...props} />;
  if (fezcodexTheme === 'bliss') return <BlissModal {...props} />;
  return <BrutalistModal {...props} />;
};

export default GenericModal;
