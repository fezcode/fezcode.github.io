import React from 'react';
import { useVisualSettings } from '../context/VisualSettingsContext';
import BrutalistImageModal from './BrutalistImageModal';
import LuxeImageModal from './LuxeImageModal';
import TerracottaImageModal from './TerracottaImageModal';
import MistImageModal from './MistImageModal';
import LedgerImageModal from './LedgerImageModal';
import OrbitImageModal from './OrbitImageModal';
import KnitImageModal from './KnitImageModal';

const ImageModal = (props) => {
  const { fezcodexTheme } = useVisualSettings();

  if (fezcodexTheme === 'luxe') return <LuxeImageModal {...props} />;
  if (fezcodexTheme === 'terracotta')
    return <TerracottaImageModal {...props} />;
  if (fezcodexTheme === 'mist') return <MistImageModal {...props} />;
  if (fezcodexTheme === 'ledger') return <LedgerImageModal {...props} />;
  if (fezcodexTheme === 'orbit') return <OrbitImageModal {...props} />;
  if (fezcodexTheme === 'knit') return <KnitImageModal {...props} />;
  return <BrutalistImageModal {...props} />;
};

export default ImageModal;
