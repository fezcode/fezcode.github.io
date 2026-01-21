import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistSidePanel from './BrutalistSidePanel';
import LuxeSidePanel from './LuxeSidePanel';

const SidePanel = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') {
    return <LuxeSidePanel {...props} />;
  }

  return <BrutalistSidePanel {...props} />;
};

export default SidePanel;
