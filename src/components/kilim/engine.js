// The Kilim loom. Every woven surface is a grid of weft-faced passes: a cell
// holds a wool colour (hex) or null (no weft). Each cell is one pip of weft
// lying over a warp, wider than tall; rows are offset like brickwork, a slit
// opens wherever two colours meet along a row, and abrash (dye-lot drift)
// shifts the shade band by band. A loom weaves bottom-up, so rows are drawn
// from the last to the first.
//
// The grid helpers are shared with Knit: both crafts chart onto the same
// kind of grid, only the drawing differs.
export {
  makeGrid,
  getCell,
  setCell,
  fillRect,
  fillRow,
  stamp,
  repeatX,
  vstack,
} from '../knit/engine';

// Three gauges: GAUGE for fabric and bands, HEAD for woven headings (double
// gauge type drawn finer so long titles fit a column), FINE for icons.
export const GAUGE = { w: 5, h: 4 };
export const HEAD = { w: 3.4, h: 2.72 };
export const FINE = { w: 3.6, h: 3.2 };

export const WOOL = {
  madder: '#a3262a',
  madderDeep: '#5a1015',
  indigo: '#1f2c5a',
  indigoLight: '#3a5196',
  saffron: '#dca420',
  ivory: '#efe5cf',
  walnut: '#2e1910',
  pistachio: '#5b7a37',
  aubergine: '#5e2546',
  apricot: '#d8703a',
  teal: '#1d6a69',
  rose: '#c7556b',
};

const hexRgb = (hex) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
export const shade = ([r, g, b], f) =>
  f >= 0
    ? [r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f]
    : [r * (1 + f), g * (1 + f), b * (1 + f)];
const css = (c, a = 1) =>
  `rgba(${c.map((v) => Math.round(v)).join(',')},${a})`;
export const gapColor = (hex, depth = -0.74) => css(shade(hexRgb(hex), depth));
export const hash = (a, b) => {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const seedOf = (s) => {
  let h = 7;
  for (const ch of String(s ?? '')) h = (h * 31 + ch.charCodeAt(0)) % 100003;
  return h;
};

const dpr = () =>
  typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, 3);

// ---------------------------------------------------------------- pips

const VARIANTS = 4;
const sprites = new Map();

/** One weft pip: a rounded capsule, lit from above, with its plies. */
export function pipSprite(hex, w, h, variant, abrash) {
  const ratio = dpr();
  const key = `${hex}|${w}|${h}|${variant}|${abrash}|${ratio}`;
  const cached = sprites.get(key);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(w * ratio);
  canvas.height = Math.ceil(h * ratio);
  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  const base = shade(hexRgb(hex), abrash * 0.045 + (variant - 1.5) * 0.025);
  const inset = w * 0.07;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(inset, h * 0.075, w - inset * 2, h * 0.85, h * 0.46);
  else ctx.rect(inset, h * 0.075, w - inset * 2, h * 0.85);
  ctx.fillStyle = css(base);
  ctx.fill();
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, 'rgba(255,248,235,.24)');
  g.addColorStop(0.45, 'rgba(255,255,255,0)');
  g.addColorStop(1, 'rgba(0,0,0,.34)');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = css(shade(base, -0.45), 0.35);
  ctx.lineWidth = Math.max(0.35, w * 0.09);
  for (let i = 0; i < 3; i++) {
    const ox = w * (0.16 + i * 0.3) + (variant % 2) * w * 0.08;
    ctx.beginPath();
    ctx.moveTo(ox, h * 0.85);
    ctx.lineTo(ox + w * 0.22, h * 0.15);
    ctx.stroke();
  }
  sprites.set(key, canvas);
  return canvas;
}

// ---------------------------------------------------------------- drawing

/**
 * Weave a grid onto a canvas at the given gauge (pip width/height in CSS px).
 * brick: offset odd rows by half a pip, as a real weave does; icons turn it
 * off so their strokes stay straight. upTo: rows woven so far, counted from
 * the bottom, for the loom animation. gap: how dark the shadow between pips
 * is (finer gauges want it lighter, or the colour turns muddy).
 */
export function weaveGrid(
  canvas,
  grid,
  w = GAUGE.w,
  h = GAUGE.h,
  { seed = 1, brick = true, upTo = Infinity, gap = -0.74 } = {},
) {
  const ratio = dpr();
  const W = grid.cols * w;
  const H = grid.rows * h;
  const pw = Math.ceil(W * ratio);
  const ph = Math.ceil(H * ratio);
  if (canvas.width !== pw) canvas.width = pw;
  if (canvas.height !== ph) canvas.height = ph;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const cell = (r, c) => grid.cells[r * grid.cols + c];
  const bandShift = Math.floor(hash(seed, 3) * 9);
  for (let r = grid.rows - 1; r >= 0; r--) {
    if (grid.rows - 1 - r > upTo) break;
    const band = Math.floor((r + bandShift) / 9);
    const abrash = Math.round((hash(band, seed) - 0.5) * 4);
    const odd = brick && r % 2 === 1;
    const y = r * h;
    for (let c = 0; c < grid.cols; c++) {
      const hex = cell(r, c);
      if (!hex) continue;
      ctx.fillStyle = gapColor(hex, gap);
      ctx.fillRect(c * w, y, w, h);
    }
    const last = odd ? grid.cols : grid.cols - 1;
    for (let c = 0; c <= last; c++) {
      const cc = Math.min(c, grid.cols - 1);
      const hex = cell(r, cc);
      if (!hex) continue;
      const px = odd ? c * w - w / 2 : c * w;
      const variant = Math.floor(hash(r * 7.1 + seed, c * 3.3) * VARIANTS);
      ctx.drawImage(pipSprite(hex, w, h, variant, abrash), px, y, w, h);
      // slit: where colours change along a row the weft turns back
      const prev = cc > 0 ? cell(r, cc - 1) : null;
      if (c > 0 && c < grid.cols && prev && prev !== hex) {
        ctx.fillStyle = 'rgba(20,8,4,.55)';
        ctx.fillRect(px - w * 0.08, y + h * 0.1, w * 0.16, h * 0.8);
      }
    }
  }
}

// ---------------------------------------------------------------- textures

const textures = new Map();

/**
 * A seamless tile of plain weave in one wool, as a data URL for CSS
 * backgrounds. The row count is even so the brick offset repeats cleanly.
 */
export function kilimTexture(hex, cols = 48, rows = 48, seed = 11) {
  if (typeof document === 'undefined') return '';
  const ratio = dpr();
  const key = `${hex}|${cols}|${rows}|${ratio}`;
  if (textures.has(key)) return textures.get(key);
  const canvas = document.createElement('canvas');
  const grid = { cols, rows, cells: new Array(cols * rows).fill(hex) };
  weaveGrid(canvas, grid, GAUGE.w, GAUGE.h, { seed });
  const url = canvas.toDataURL('image/png');
  textures.set(key, url);
  return url;
}

/** CSS size of one texture tile, for background-size. */
export const TEXTURE_SIZE = `${48 * GAUGE.w}px ${48 * GAUGE.h}px`;
