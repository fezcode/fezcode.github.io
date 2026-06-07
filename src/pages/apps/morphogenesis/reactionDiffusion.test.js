import {
  step,
  samplePalette,
  Culture,
  PRESETS,
  PALETTES,
} from './reactionDiffusion';

describe('step', () => {
  test('the substrate (A=1, B=0) is a fixed point', () => {
    const W = 8;
    const H = 8;
    const n = W * H;
    const a = new Float32Array(n).fill(1);
    const b = new Float32Array(n); // all zero
    const na = new Float32Array(n);
    const nb = new Float32Array(n);
    step(a, b, na, nb, W, H, 0.0545, 0.062);
    for (let i = 0; i < n; i++) {
      expect(na[i]).toBeCloseTo(1, 5);
      expect(nb[i]).toBeCloseTo(0, 5);
    }
  });

  test('keeps values within [0, 1]', () => {
    const W = 16;
    const H = 16;
    const n = W * H;
    const a = new Float32Array(n).fill(1);
    const b = new Float32Array(n);
    b[8 * W + 8] = 1; // a seed
    a[8 * W + 8] = 0;
    const na = new Float32Array(n);
    const nb = new Float32Array(n);
    for (let s = 0; s < 50; s++) {
      step(a, b, na, nb, W, H, 0.0545, 0.062);
      a.set(na);
      b.set(nb);
    }
    for (let i = 0; i < n; i++) {
      expect(a[i]).toBeGreaterThanOrEqual(0);
      expect(a[i]).toBeLessThanOrEqual(1);
      expect(b[i]).toBeGreaterThanOrEqual(0);
      expect(b[i]).toBeLessThanOrEqual(1);
      expect(Number.isFinite(a[i])).toBe(true);
      expect(Number.isFinite(b[i])).toBe(true);
    }
  });

  test('diffusion spreads B to neighbouring cells', () => {
    const W = 8;
    const H = 8;
    const n = W * H;
    const a = new Float32Array(n).fill(1);
    const b = new Float32Array(n);
    const center = 4 * W + 4;
    b[center] = 1;
    const na = new Float32Array(n);
    const nb = new Float32Array(n);
    step(a, b, na, nb, W, H, 0.0545, 0.062);
    const right = 4 * W + 5;
    expect(nb[right]).toBeGreaterThan(0); // B has diffused to the neighbour
  });
});

describe('samplePalette', () => {
  const stops = [
    [0.0, [0, 0, 0]],
    [1.0, [100, 200, 40]],
  ];
  test('clamps to the end stops', () => {
    expect(samplePalette(stops, -1)).toEqual([0, 0, 0]);
    expect(samplePalette(stops, 5)).toEqual([100, 200, 40]);
  });
  test('interpolates between stops', () => {
    expect(samplePalette(stops, 0.5)).toEqual([50, 100, 20]);
  });
});

describe('Culture', () => {
  test('initialises to the substrate and reports empty', () => {
    const c = new Culture({ width: 20, height: 20 });
    expect(c.isEmpty).toBe(true);
    expect(c.generation).toBe(0);
    expect(c.a.every((v) => v === 1)).toBe(true);
    expect(c.b.every((v) => v === 0)).toBe(true);
  });

  test('seeding inoculates B and makes the dish non-empty', () => {
    const c = new Culture({ width: 40, height: 40 });
    c.seed(20, 20, 5);
    expect(c.isEmpty).toBe(false);
    expect(c.b[20 * 40 + 20]).toBe(1);
    expect(c.a[20 * 40 + 20]).toBe(0);
  });

  test('stepping advances the generation counter', () => {
    const c = new Culture({ width: 24, height: 24 });
    c.seed(12, 12, 4);
    c.step(10);
    expect(c.generation).toBe(10);
  });

  test('a seeded culture actually evolves (B mass changes)', () => {
    const c = new Culture({ width: 32, height: 32, preset: PRESETS[0] });
    c.seed(16, 16, 5);
    const massBefore = c.b.reduce((s, v) => s + v, 0);
    c.step(60);
    const massAfter = c.b.reduce((s, v) => s + v, 0);
    expect(massAfter).not.toBeCloseTo(massBefore, 1);
  });

  test('setPreset changes the feed/kill rates', () => {
    const c = new Culture({ width: 10, height: 10 });
    c.setPreset(PRESETS.find((p) => p.id === 'maze'));
    expect(c.f).toBeCloseTo(0.029, 5);
    expect(c.k).toBeCloseTo(0.057, 5);
  });

  test('reset returns the dish to the substrate', () => {
    const c = new Culture({ width: 16, height: 16 });
    c.seed(8, 8, 4);
    c.step(5);
    c.reset();
    expect(c.generation).toBe(0);
    expect(c.isEmpty).toBe(true);
  });

  test('render fills an RGBA buffer with valid bytes', () => {
    const c = new Culture({ width: 8, height: 8 });
    c.seed(4, 4, 3);
    c.step(20);
    const rgba = new Uint8ClampedArray(8 * 8 * 4);
    c.render(rgba, PALETTES[0].stops);
    let nonzero = 0;
    for (let i = 0; i < rgba.length; i += 4) {
      expect(rgba[i + 3]).toBe(255); // opaque
      if (rgba[i] + rgba[i + 1] + rgba[i + 2] > 0) nonzero++;
    }
    expect(nonzero).toBeGreaterThan(0);
  });
});
