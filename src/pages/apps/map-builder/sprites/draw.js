// Shared drawing toolkit for procedural sprite generators.
// Every generator receives (ctx, { size, rng, theme, tint }) with the origin (0,0)
// already translated to the CENTRE of a `size`x`size` box. Draw within roughly
// [-size/2, +size/2]. Shadows/outlines may spill a little; the cache pads for it.

// ---- seeded RNG (mulberry32) ----
export function makeRng(seed) {
  let a = (seed >>> 0) || 1;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const rand = (rng, a = 0, b = 1) => a + (b - a) * rng();
export const randInt = (rng, a, b) => Math.floor(a + (b - a + 1) * rng());
export const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)] ?? arr[0];
export const chance = (rng, p) => rng() < p;
export const jitter = (rng, amt) => (rng() * 2 - 1) * amt;

// ---- colour ----
function hexToRgb(hex) {
  let h = String(hex).replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
const cc = (v) => Math.max(0, Math.min(255, Math.round(v)));
const toRgb = (r, g, b) => `rgb(${cc(r)},${cc(g)},${cc(b)})`;
export function mix(hex, target, t) {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  return toRgb(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t);
}
export const darken = (hex, t) => mix(hex, '#000000', t);
export const lighten = (hex, t) => mix(hex, '#ffffff', t);
export function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ---- paths ----
export function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export function polygonPath(ctx, pts) {
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
}

export function ngon(ctx, cx, cy, r, sides, rot = 0) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const a = rot + (i / sides) * Math.PI * 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
}

export function star(ctx, cx, cy, spikes, outer, inner, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = rot + (i / (spikes * 2)) * Math.PI * 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
}

// Organic wobbly blob — rocks, foliage clumps, lakes, islands.
export function blob(ctx, cx, cy, r, rng, wobble = 0.25, points = 14) {
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const rr = r * (1 - wobble + (rng ? rng() : 0.5) * wobble * 2);
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
}

// ---- fills / strokes ----
export function fillStroke(ctx, fill, stroke, lw = 2) {
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
}

export function hatch(ctx, x, y, w, h, spacing, angle, color, lw = 1) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  const len = Math.hypot(w, h) + spacing;
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(angle);
  for (let i = -len; i < len; i += spacing) {
    ctx.beginPath();
    ctx.moveTo(i, -len);
    ctx.lineTo(i, len);
    ctx.stroke();
  }
  ctx.restore();
}

export function softShadow(ctx, color = 'rgba(0,0,0,0.28)', blur = 6, oy = 3, ox = 0) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = ox;
  ctx.shadowOffsetY = oy;
}
export function clearShadow(ctx) {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

// Flat ground shadow ellipse beneath a standing object.
export function groundShadow(ctx, cx, cy, rx, ry, color = 'rgba(0,0,0,0.18)') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
