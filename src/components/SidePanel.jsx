import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistSidePanel from './BrutalistSidePanel';
import LuxeSidePanel from './LuxeSidePanel';
import TerracottaSidePanel from './TerracottaSidePanel';
import MistSidePanel from './MistSidePanel';

const SidePanel = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeSidePanel {...props} />;
  if (fezcodexTheme === 'terracotta') return <TerracottaSidePanel {...props} />;
  if (fezcodexTheme === 'mist') return <MistSidePanel {...props} />;
  return <BrutalistSidePanel {...props} />;
};

export default SidePanel;
