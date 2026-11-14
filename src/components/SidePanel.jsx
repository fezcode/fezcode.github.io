import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistSidePanel from './BrutalistSidePanel';
import LuxeSidePanel from './LuxeSidePanel';
import TerracottaSidePanel from './TerracottaSidePanel';
import MistSidePanel from './MistSidePanel';
import LedgerSidePanel from './LedgerSidePanel';
import OrbitSidePanel from './OrbitSidePanel';
import KnitSidePanel from './KnitSidePanel';
import BlissSidePanel from './BlissSidePanel';

const SidePanel = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeSidePanel {...props} />;
  if (fezcodexTheme === 'terracotta') return <TerracottaSidePanel {...props} />;
  if (fezcodexTheme === 'mist') return <MistSidePanel {...props} />;
  if (fezcodexTheme === 'ledger') return <LedgerSidePanel {...props} />;
  if (fezcodexTheme === 'orbit') return <OrbitSidePanel {...props} />;
  if (fezcodexTheme === 'knit') return <KnitSidePanel {...props} />;
  if (fezcodexTheme === 'bliss') return <BlissSidePanel {...props} />;
  return <BrutalistSidePanel {...props} />;
};

export default SidePanel;
