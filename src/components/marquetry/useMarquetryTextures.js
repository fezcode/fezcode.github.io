import { useEffect, useState } from 'react';
import { woodTextures } from './wood';

export const applyMarquetryTextures = () => {
  const textures = woodTextures();
  if (typeof document !== 'undefined') {
    for (const [name, url] of Object.entries(textures)) {
      const property = `--mqt-tex-${name}`;
      if (!document.documentElement.style.getPropertyValue(property)) {
        document.documentElement.style.setProperty(property, `url("${url}")`);
      }
    }
  }
  return textures;
};

export default function useMarquetryTextures(active = true) {
  const [textures, setTextures] = useState({});
  useEffect(() => {
    if (active) setTextures(applyMarquetryTextures());
  }, [active]);
  return textures;
}
