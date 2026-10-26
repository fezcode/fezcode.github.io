// The Knit stitch engine. Every knitted surface on the site is a grid of
// stockinette stitches: a cell holds a yarn colour (hex) or null (no stitch).
// Each stitch is drawn as two twisted plies forming a V; rows are drawn
// bottom-up so every V's tip covers the shoulders of the stitch below.

// Two gauges, as with fingering and lace weight: GAUGE for fabric, bands and
// titles; FINE for small charted labels, icons and navigation.
export const GAUGE = { w: 5, h: 4.2 };
export const FINE = { w: 4, h: 3.4 };

export const YARN = {
  // the ground: deep Fair Isle navy (page), a shade down (rows, buttons),
  // and the darkest (sidebar). Names kept from the first, brown draft.
  walnut: '#2c4a7c',
  bark: '#213a63',
  peat: '#182b4a',
  cream: '#e3d8c4',
  oat: '#aaa39b',
  gold: '#c9952b',
  poppy: '#c3202b',
  snow: '#efefe9',
  peach: '#e0936b',
  rust: '#8a3529',
  wheat: '#d2b26a',
  moss: '#3e4a3c',
  lemon: '#e8c51a',
  ink: '#1d1c1c',
  teal: '#1f6b6b',
  jet: '#141414',
  denim: '#3d5a80',
  plum: '#6b3a5b',
};

const hexRgb = (hex) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
export const shade = ([r, g, b], f) =>
  f >= 0
    ? [r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f]
    : [r * (1 + f), g * (1 + f), b * (1 + f)];
const css = (c, a = 1) =>
  `rgba(${c.map((v) => Math.round(v)).join(',')},${a})`;
export const gapColor = (hex) => css(shade(hexRgb(hex), -0.72));
export const hash = (a, b) => {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const dpr = () =>
  typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, 3);

// ---------------------------------------------------------------- stitches

const VARIANTS = 5;
const sprites = new Map();

function drawLeg(ctx, side, base, w, h, rand) {
  const rx = w * 0.29;
  const ry = h * 0.66;
  ctx.save();
  ctx.translate(side * w * 0.215, -h * 0.12);
  ctx.rotate(side * (0.4 + (rand(side + 4) - 0.5) * 0.12));
  ctx.shadowColor = 'rgba(0,0,0,.55)';
  ctx.shadowBlur = Math.max(1, w * 0.27) * dpr();
  ctx.shadowOffsetY = Math.max(0.6, w * 0.13) * dpr();
  const grad = ctx.createLinearGradient(-rx, 0, rx, 0);
  grad.addColorStop(0, css(shade(base, -0.45)));
  grad.addColorStop(0.42, css(shade(base, 0.18)));
  grad.addColorStop(0.62, css(base));
  grad.addColorStop(1, css(shade(base, -0.5)));
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.clip();
  // the ply twist: diagonal grooves, each with a lit edge
  const step = ry / 3;
  const tilt = rx * 1.1;
  const lit = Math.max(0.5, w * 0.1);
  for (let t = -ry * 1.4; t < ry * 1.4; t += step) {
    ctx.beginPath();
    ctx.moveTo(-rx, t + tilt);
    ctx.lineTo(rx, t - tilt);
    ctx.strokeStyle = css(shade(base, -0.55), 0.5);
    ctx.lineWidth = Math.max(0.6, w * 0.07);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-rx, t + tilt + lit);
    ctx.lineTo(rx, t - tilt + lit);
    ctx.strokeStyle = css(shade(base, 0.35), 0.25);
    ctx.lineWidth = Math.max(0.5, w * 0.045);
    ctx.stroke();
  }
  const sheen = ctx.createRadialGradient(
    -rx * 0.3,
    -ry * 0.35,
    0,
    -rx * 0.3,
    -ry * 0.35,
    ry,
  );
  sheen.addColorStop(0, 'rgba(255,255,255,.16)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(-rx, -ry, rx * 2, ry * 2);
  ctx.restore();
}

export function stitchSprite(hex, w, h, variant) {
  const ratio = dpr();
  const key = `${hex}|${w}|${h}|${variant}|${ratio}`;
  const cached = sprites.get(key);
  if (cached) return cached;
  const W = w * 1.6;
  const H = h * 2;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(W * ratio);
  canvas.height = Math.ceil(H * ratio);
  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  ctx.translate(W / 2, H / 2);
  const seed = hex.charCodeAt(1) + hex.charCodeAt(3) + hex.charCodeAt(5);
  const rand = (i) => hash(variant * 13.7 + i, seed * 0.37 + i * 0.7);
  const base = shade(hexRgb(hex), (rand(1) - 0.5) * 0.12);
  drawLeg(ctx, -1, base, w, h, rand);
  drawLeg(ctx, 1, base, w, h, rand);
  const sprite = { canvas, W, H };
  sprites.set(key, sprite);
  return sprite;
}

// ---------------------------------------------------------------- grids

export const makeGrid = (cols, rows, fill = null) => ({
  cols,
  rows,
  cells: new Array(cols * rows).fill(fill),
});

export const getCell = (g, x, y) =>
  x < 0 || y < 0 || x >= g.cols || y >= g.rows ? null : g.cells[y * g.cols + x];

export const setCell = (g, x, y, hex) => {
  if (x < 0 || y < 0 || x >= g.cols || y >= g.rows) return;
  g.cells[y * g.cols + x] = hex;
};

export const fillRect = (g, x, y, w, h, hex) => {
  for (let r = y; r < y + h; r++)
    for (let c = x; c < x + w; c++) setCell(g, c, r, hex);
};

export const fillRow = (g, y, hex) => fillRect(g, 0, y, g.cols, 1, hex);

/** Paint a bitmap (array of strings) into the grid; map turns chars into yarns. */
export const stamp = (g, bitmap, x, y, map, scale = 1) => {
  bitmap.forEach((line, r) => {
    for (let c = 0; c < line.length; c++) {
      const hex = map[line[c]];
      if (hex === undefined) continue;
      for (let dy = 0; dy < scale; dy++)
        for (let dx = 0; dx < scale; dx++)
          setCell(g, x + c * scale + dx, y + r * scale + dy, hex);
    }
  });
};

/** Repeat a bitmap across a row band. */
export const repeatX = (g, bitmap, y, map, period, offset = 0) => {
  for (let x = offset - period; x < g.cols; x += period) stamp(g, bitmap, x, y, map);
};

/** Stack grids of equal width vertically. */
export const vstack = (...grids) => {
  const parts = grids.filter(Boolean);
  const cols = parts[0].cols;
  const out = makeGrid(cols, parts.reduce((n, p) => n + p.rows, 0));
  let offset = 0;
  parts.forEach((p) => {
    for (let r = 0; r < p.rows; r++)
      for (let c = 0; c < cols; c++)
        out.cells[(offset + r) * cols + c] = getCell(p, c, r);
    offset += p.rows;
  });
  return out;
};

// ---------------------------------------------------------------- drawing

/** Knit a grid onto a canvas at the given gauge (stitch width/height in CSS px). */
export function knitGrid(canvas, grid, w = GAUGE.w, h = GAUGE.h) {
  const ratio = dpr();
  canvas.width = Math.ceil(grid.cols * w * ratio);
  canvas.height = Math.ceil(grid.rows * h * ratio);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, grid.cols * w, grid.rows * h);
  // the shadow between plies
  for (let r = 0; r < grid.rows; r++)
    for (let c = 0; c < grid.cols; c++) {
      const hex = grid.cells[r * grid.cols + c];
      if (!hex) continue;
      ctx.fillStyle = gapColor(hex);
      ctx.fillRect(c * w, r * h, w, h);
    }
  for (let r = grid.rows - 1; r >= 0; r--)
    for (let c = 0; c < grid.cols; c++) {
      const hex = grid.cells[r * grid.cols + c];
      if (!hex) continue;
      const s = stitchSprite(hex, w, h, Math.floor(hash(r, c) * VARIANTS));
      ctx.drawImage(
        s.canvas,
        c * w + w / 2 - s.W / 2,
        r * h + h / 2 - s.H / 2,
        s.W,
        s.H,
      );
    }
}

// ---------------------------------------------------------------- textures

const textures = new Map();

/**
 * A seamless tile of plain stockinette in one yarn, as a data URL for CSS
 * backgrounds. Stitches that spill over an edge are drawn again on the
 * opposite edge so the tile repeats without seams.
 */
export function knitTexture(hex, w = GAUGE.w, h = GAUGE.h, cols = 12, rows = 12) {
  if (typeof document === 'undefined') return '';
  const ratio = dpr();
  const key = `${hex}|${w}|${h}|${cols}|${rows}|${ratio}`;
  if (textures.has(key)) return textures.get(key);
  const TW = cols * w;
  const TH = rows * h;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(TW * ratio);
  canvas.height = Math.round(TH * ratio);
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.fillStyle = gapColor(hex);
  ctx.fillRect(0, 0, TW, TH);
  for (let r = rows; r >= -1; r--)
    for (let c = -1; c <= cols; c++) {
      const rr = (r + rows) % rows;
      const cc = (c + cols) % cols;
      const s = stitchSprite(hex, w, h, Math.floor(hash(rr, cc) * VARIANTS));
      ctx.drawImage(s.canvas, c * w + w / 2 - s.W / 2, r * h + h / 2 - s.H / 2, s.W, s.H);
    }
  const url = canvas.toDataURL('image/png');
  textures.set(key, url);
  return url;
}
