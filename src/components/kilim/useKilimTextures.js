import { useEffect } from 'react';
import { WOOL, kilimTexture, TEXTURE_SIZE } from './engine';

let applied = false;

/** Publish a plain-weave tile for every wool as --klm-tex-<wool>. */
export const applyKilimTextures = () => {
  if (applied || typeof document === 'undefined') return;
  const root = document.documentElement;
  Object.entries(WOOL).forEach(([name, hex], i) => {
    const url = kilimTexture(hex, 48, 48, 11 + i * 7);
    if (url) root.style.setProperty(`--klm-tex-${name}`, `url("${url}")`);
  });
  root.style.setProperty('--klm-tex-size', TEXTURE_SIZE);
  applied = true;
};

const useKilimTextures = (active = true) => {
  useEffect(() => {
    if (active) applyKilimTextures();
  }, [active]);
};

export default useKilimTextures;
