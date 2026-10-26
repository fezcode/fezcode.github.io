import { useEffect } from 'react';
import { YARN, knitTexture } from './engine';

let applied = false;

/** Publish a plain-stockinette tile for every yarn as --knt-tex-<yarn>. */
export const applyKnitTextures = () => {
  if (applied || typeof document === 'undefined') return;
  const root = document.documentElement;
  Object.entries(YARN).forEach(([name, hex]) => {
    const url = knitTexture(hex);
    if (url) root.style.setProperty(`--knt-tex-${name}`, `url("${url}")`);
  });
  applied = true;
};

const useKnitTextures = (active = true) => {
  useEffect(() => {
    if (active) applyKnitTextures();
  }, [active]);
};

export default useKnitTextures;
