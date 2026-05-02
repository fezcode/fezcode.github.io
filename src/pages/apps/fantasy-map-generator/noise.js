// Deterministic seeded noise utilities used across the fantasy map generator.

export const random = (s) => {
  let t = s + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const noise2D = (x, y, seed) => {
  const hash = (n) => {
    n = Math.sin(n) * 43758.5453123;
    return n - Math.floor(n);
  };
  const lerp = (a, b, t) => a + t * (b - a);
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const a = hash(ix + iy * 57 + seed);
  const b = hash(ix + 1 + iy * 57 + seed);
  const c = hash(ix + (iy + 1) * 57 + seed);
  const d = hash(ix + 1 + (iy + 1) * 57 + seed);
  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);
  return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
};

export const fbm = (x, y, seed, octaves) => {
  let v = 0,
    amp = 0.5,
    freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += noise2D(x * freq, y * freq, seed) * amp;
    freq *= 2;
    amp *= 0.5;
  }
  return v;
};

export const ridgedFbm = (x, y, seed, octaves) => {
  let v = 0,
    amp = 0.5,
    freq = 1;
  for (let i = 0; i < octaves; i++) {
    let n = noise2D(x * freq, y * freq, seed);
    n = 1 - Math.abs(n * 2 - 1);
    v += n * n * amp;
    freq *= 2;
    amp *= 0.5;
  }
  return v;
};
