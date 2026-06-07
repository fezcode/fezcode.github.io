// ─── MORPHOGENESIS :: Gray-Scott reaction-diffusion ─────────────────────
// Two chemicals A and B diffuse across a grid and react: A + 2B -> 3B. A is
// fed in at rate `f`; B is removed at rate `k + f`. From a near-uniform start,
// tiny seeds of B grow into the patterns Alan Turing predicted for
// morphogenesis — spots, stripes, coral, fingerprints — depending on f and k.
//
//   A' = A + (Da·∇²A − A·B² + f·(1 − A)) · dt
//   B' = B + (Db·∇²B + A·B² − (k + f)·B) · dt
//
// The Laplacian uses a conservative 3×3 kernel and wraps at the edges, so the
// culture is seamless. Grids are flat Float32Arrays for speed.

export const PRESETS = [
  { id: 'coral', name: 'Coral', f: 0.0545, k: 0.062 },
  { id: 'mitosis', name: 'Mitosis', f: 0.0367, k: 0.0649 },
  { id: 'maze', name: 'Maze', f: 0.029, k: 0.057 },
  { id: 'spots', name: 'Spots', f: 0.03, k: 0.062 },
  { id: 'fingerprints', name: 'Fingerprints', f: 0.078, k: 0.061 },
  { id: 'flow', name: 'Flow', f: 0.014, k: 0.054 },
];

const DA = 1.0;
const DB = 0.5;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * One Gray-Scott step from (a, b) into (na, nb). Edges wrap (toroidal).
 * Pure: reads a/b, writes na/nb; never mutates the source grids.
 */
export function step(a, b, na, nb, W, H, f, k, dt = 1.0) {
  for (let y = 0; y < H; y++) {
    const ym = ((y - 1 + H) % H) * W;
    const yp = ((y + 1) % H) * W;
    const yc = y * W;
    for (let x = 0; x < W; x++) {
      const xm = (x - 1 + W) % W;
      const xp = (x + 1) % W;
      const i = yc + x;

      const av = a[i];
      const bv = b[i];

      // conservative Laplacian: center -1, orthogonal 0.2, diagonal 0.05
      const lapA =
        av * -1 +
        (a[yc + xm] + a[yc + xp] + a[ym + x] + a[yp + x]) * 0.2 +
        (a[ym + xm] + a[ym + xp] + a[yp + xm] + a[yp + xp]) * 0.05;
      const lapB =
        bv * -1 +
        (b[yc + xm] + b[yc + xp] + b[ym + x] + b[yp + x]) * 0.2 +
        (b[ym + xm] + b[ym + xp] + b[yp + xm] + b[yp + xp]) * 0.05;

      const abb = av * bv * bv;
      na[i] = clamp01(av + (DA * lapA - abb + f * (1 - av)) * dt);
      nb[i] = clamp01(bv + (DB * lapB + abb - (k + f) * bv) * dt);
    }
  }
}

/** Linear interpolation across a palette of [position, [r,g,b]] stops. */
export function samplePalette(stops, t) {
  if (t <= stops[0][0]) return stops[0][1];
  const last = stops[stops.length - 1];
  if (t >= last[0]) return last[1];
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [p0, c0] = stops[i - 1];
      const [p1, c1] = stops[i];
      const u = (t - p0) / (p1 - p0);
      return [
        c0[0] + (c1[0] - c0[0]) * u,
        c0[1] + (c1[1] - c0[1]) * u,
        c0[2] + (c1[2] - c0[2]) * u,
      ];
    }
  }
  return last[1];
}

export const PALETTES = [
  {
    id: 'agar',
    name: 'Agar',
    stops: [
      [0.0, [18, 32, 38]],
      [0.45, [27, 96, 92]],
      [0.7, [120, 184, 150]],
      [1.0, [233, 226, 199]],
    ],
  },
  {
    id: 'ember',
    name: 'Ember',
    stops: [
      [0.0, [20, 12, 14]],
      [0.5, [150, 40, 30]],
      [0.78, [222, 130, 40]],
      [1.0, [245, 224, 150]],
    ],
  },
  {
    id: 'ink',
    name: 'Ink',
    stops: [
      [0.0, [236, 233, 224]],
      [0.55, [120, 130, 140]],
      [1.0, [20, 24, 30]],
    ],
  },
  {
    id: 'aurora',
    name: 'Aurora',
    stops: [
      [0.0, [10, 14, 28]],
      [0.45, [40, 70, 150]],
      [0.72, [70, 200, 180]],
      [1.0, [220, 240, 200]],
    ],
  },
];

// ── The culture (stateful sim used by the UI) ───────────────────────────

export class Culture {
  constructor({ width, height, preset = PRESETS[0] }) {
    this.W = width;
    this.H = height;
    const n = width * height;
    this.a = new Float32Array(n);
    this.b = new Float32Array(n);
    this.na = new Float32Array(n);
    this.nb = new Float32Array(n);
    this.f = preset.f;
    this.k = preset.k;
    this.generation = 0;
    this.reset();
  }

  get isEmpty() {
    // empty == no living agent present (independent of generation), so the
    // "inoculate" hint shows whenever the dish has nothing growing in it.
    return this._noB();
  }

  _noB() {
    for (let i = 0; i < this.b.length; i++) if (this.b[i] > 0.001) return false;
    return true;
  }

  setPreset(preset) {
    this.f = preset.f;
    this.k = preset.k;
  }

  /** Clear to the substrate state: A = 1 everywhere, B = 0. */
  reset() {
    this.a.fill(1);
    this.b.fill(0);
    this.generation = 0;
  }

  /** Inoculate a disk of B (and depress A) — a seed of life. */
  seed(cx, cy, r) {
    const { W, H, a, b } = this;
    const r2 = r * r;
    const x0 = Math.max(0, Math.floor(cx - r));
    const x1 = Math.min(W - 1, Math.ceil(cx + r));
    const y0 = Math.max(0, Math.floor(cy - r));
    const y1 = Math.min(H - 1, Math.ceil(cy + r));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy <= r2) {
          const i = y * W + x;
          b[i] = 1;
          a[i] = 0;
        }
      }
    }
  }

  /** Scatter `count` random seeds across the dish. `rand` defaults to Math.random. */
  seedRandom(count = 12, r = 4, rand = Math.random) {
    for (let n = 0; n < count; n++) {
      this.seed(rand() * this.W, rand() * this.H, r);
    }
  }

  /** Advance the simulation `times` steps. */
  step(times = 1) {
    for (let t = 0; t < times; t++) {
      step(this.a, this.b, this.na, this.nb, this.W, this.H, this.f, this.k);
      const ta = this.a;
      this.a = this.na;
      this.na = ta;
      const tb = this.b;
      this.b = this.nb;
      this.nb = tb;
      this.generation++;
    }
  }

  /** Paint the culture into an RGBA buffer using a palette (array of stops). */
  render(rgba, stops, contrast = 2.6) {
    const { a, b } = this;
    for (let i = 0; i < a.length; i++) {
      const t = clamp01((a[i] - b[i]) * 0.5 + 0.5); // A-dominant -> high, B -> low
      const v = clamp01((1 - t) * contrast); // emphasise the B (reacted) regions
      const col = samplePalette(stops, v);
      const j = i * 4;
      rgba[j] = col[0];
      rgba[j + 1] = col[1];
      rgba[j + 2] = col[2];
      rgba[j + 3] = 255;
    }
  }
}
