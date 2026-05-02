import { random, noise2D } from './noise';

const ARABIC_PREFIXES = ['Al-','Bayt-','Qasr-','Wadi-','Jebel-','Bahr-','Dar-','Ain-','Madinat-','Bab-','Ras-','Tell-'];

export const pickName = (seed, bank, used = new Set()) => {
  const { pre, suf } = bank;
  for (let i = 0; i < 60; i++) {
    let n =
      pre[Math.floor(random(seed + i) * pre.length)] +
      suf[Math.floor(random(seed + i + 0.37) * suf.length)];
    if (ARABIC_PREFIXES.some((p) => n.startsWith(p))) {
      n = n.replace(/^(\w+)-/, '$1 ').replace(/^./, (c) => c.toUpperCase());
    }
    if (!used.has(n)) {
      used.add(n);
      return n;
    }
  }
  return pre[0] + suf[0];
};

export const pickFrom = (seed, arr) =>
  arr[Math.floor(random(seed) * arr.length)];

// Mask shapes determine the broad continental silhouette.
export const computeMask = (kind, x, y, w, h, seed) => {
  const dx = x / w - 0.5;
  const dy = y / h - 0.5;
  const dist = Math.sqrt(dx * dx + dy * dy) * 2;
  switch (kind) {
    case 'radial':
      return Math.max(0, 1 - Math.pow(dist, 2));
    case 'wide':
      return Math.max(
        0,
        1 - Math.pow(Math.sqrt(dx * dx * 0.5 + dy * dy), 2) * 1.6,
      );
    case 'islands': {
      const a = noise2D((x / w) * 4, (y / h) * 4, seed);
      return Math.max(0, a - 0.35) * 1.3;
    }
    case 'peninsula': {
      const ax = x / w;
      return Math.max(0, 1 - Math.abs(dy) * 2.3) * (1 - ax * 0.6);
    }
    case 'island': {
      const r = Math.sqrt(dx * dx + dy * dy) * 2.4;
      return Math.max(0, 1 - Math.pow(r, 1.6));
    }
    case 'atoll': {
      const r = Math.sqrt(dx * dx + dy * dy) * 2.4;
      return Math.max(0, 1 - Math.pow(Math.abs(r - 0.7) * 3, 1.5));
    }
    case 'inland': {
      const r = Math.sqrt(dx * dx + dy * dy) * 2;
      const inner = Math.max(0, 1 - Math.pow((1 - r) * 1.5, 2));
      return Math.min(1, inner + 0.1);
    }
    case 'middle': {
      const ax = Math.abs(dx) * 1.6;
      const ay = Math.abs(dy) * 2.4;
      return Math.max(0, 1 - Math.pow(ax * ax + ay * ay, 0.9));
    }
    default:
      return Math.max(0, 1 - Math.pow(dist, 2));
  }
};

// Classify a map cell into a biome based on elevation, moisture and latitude.
export const biomeOf = (elev, moist, lat, climate) => {
  const temp = (1 - Math.abs(lat - 0.5) * 2) * climate + (climate - 0.5) * 0.4;
  if (elev > 0.78) return 'snow';
  if (temp < 0.25) return moist > 0.5 ? 'tundra' : 'snow';
  if (temp > 0.78 && moist < 0.4) return 'desert';
  if (moist > 0.78 && temp > 0.5) return 'jungle';
  if (moist > 0.6 && elev < 0.45) return 'swamp';
  if (moist > 0.45) return 'forest';
  return 'grass';
};
