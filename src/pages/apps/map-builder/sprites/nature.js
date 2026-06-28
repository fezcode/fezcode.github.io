// Procedural NATURE sprites for the map-builder. Pure Canvas2D vector drawing.
// Registers every generator as a side effect of import via family({...}).
// Origin (0,0) is the CENTRE of a size x size box; +y points DOWN.
import { family } from './registry';
import {
  makeRng, rand, randInt, pick, chance, jitter,
  mix, darken, lighten, withAlpha,
  roundRect, polygonPath, ngon, star, blob, fillStroke, hatch,
  softShadow, clearShadow, groundShadow,
} from './draw';

// ---- local conveniences (no extra imports) ----
const LW = (s) => Math.max(1, s * 0.02);
function circle(ctx, cx, cy, r) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
}
// stable seed pulled from the live rng so a clipped silhouette can be re-traced
const rseed = (rng) => (rng() * 1e9) >>> 0;

/* =====================================================================
 * TREES
 * ===================================================================== */

family({
  id: 'nature.tree.oak', name: 'Oak Tree', category: 'nature',
  tags: ['tree', 'forest', 'deciduous', 'oak', 'broadleaf'], size: 64, variants: 8,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    groundShadow(ctx, 0, s * 0.36, s * 0.28, s * 0.09);
    roundRect(ctx, -s * 0.055, s * 0.04, s * 0.11, s * 0.32, s * 0.03);
    fillStroke(ctx, t.trunk, t.ink, LW(s));
    const cy = -s * 0.1, R = s * 0.32;
    const lobes = randInt(rng, 6, 9);
    for (let i = 0; i < lobes; i++) {
      const a = (i / lobes) * Math.PI * 2 + jitter(rng, 0.25);
      blob(ctx, Math.cos(a) * R * 0.55, cy + Math.sin(a) * R * 0.42, R * rand(rng, 0.45, 0.62), rng, 0.25, 9);
      fillStroke(ctx, mix(main, t.leafDark, rand(rng, 0, 0.45)), null);
    }
    blob(ctx, 0, cy, R, rng, 0.16, 16);
    fillStroke(ctx, main, t.ink, LW(s));
    ctx.globalAlpha = 0.5;
    blob(ctx, -R * 0.3, cy - R * 0.3, R * 0.42, rng, 0.25, 10);
    fillStroke(ctx, lighten(main, 0.22), null);
    ctx.globalAlpha = 1;
    ctx.restore();
  },
});

family({
  id: 'nature.tree.pine', name: 'Pine Tree', category: 'nature',
  tags: ['tree', 'conifer', 'pine', 'evergreen', 'forest'], size: 64, variants: 8,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leafDark;
    groundShadow(ctx, 0, s * 0.4, s * 0.2, s * 0.07);
    roundRect(ctx, -s * 0.04, s * 0.22, s * 0.08, s * 0.18, s * 0.02);
    fillStroke(ctx, t.trunk, t.ink, LW(s));
    const tiers = randInt(rng, 3, 5);
    for (let i = 0; i < tiers; i++) {
      const f = i / (tiers - 1 || 1);
      const apexY = -s * 0.44 + f * s * 0.5;
      const w = s * 0.14 + f * s * 0.26;
      const h = s * 0.2 + f * s * 0.06;
      polygonPath(ctx, [
        { x: 0, y: apexY },
        { x: w, y: apexY + h },
        { x: w * 0.45, y: apexY + h },
        { x: 0, y: apexY + h * 1.16 },
        { x: -w * 0.45, y: apexY + h },
        { x: -w, y: apexY + h },
      ]);
      fillStroke(ctx, mix(main, t.leaf, (1 - f) * 0.0 + f * 0.22), t.ink, LW(s));
      ctx.globalAlpha = 0.35;
      polygonPath(ctx, [
        { x: 0, y: apexY },
        { x: -w * 0.55, y: apexY + h },
        { x: -w * 0.15, y: apexY + h },
      ]);
      fillStroke(ctx, lighten(main, 0.18), null);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  },
});

family({
  id: 'nature.tree.birch', name: 'Birch Tree', category: 'nature',
  tags: ['tree', 'birch', 'deciduous', 'pale', 'forest'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leafLight;
    groundShadow(ctx, 0, s * 0.36, s * 0.18, s * 0.06);
    roundRect(ctx, -s * 0.035, -s * 0.18, s * 0.07, s * 0.54, s * 0.02);
    fillStroke(ctx, lighten(t.stoneLight, 0.28), t.ink, LW(s));
    ctx.fillStyle = t.ink;
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < 5; i++) {
      const y = -s * 0.12 + i * s * 0.1;
      roundRect(ctx, -s * 0.03, y, s * 0.04, s * 0.015, s * 0.005);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    const cy = -s * 0.24, R = s * 0.24;
    const lobes = randInt(rng, 4, 6);
    for (let i = 0; i < lobes; i++) {
      const a = rand(rng, 0, Math.PI * 2);
      blob(ctx, Math.cos(a) * R * 0.6, cy + Math.sin(a) * R * 0.6, R * rand(rng, 0.4, 0.6), rng, 0.3, 9);
      fillStroke(ctx, mix(main, t.leaf, rand(rng, 0, 0.5)), null);
    }
    blob(ctx, 0, cy, R, rng, 0.22, 14);
    fillStroke(ctx, main, t.ink, LW(s));
    ctx.globalAlpha = 0.45;
    blob(ctx, -R * 0.25, cy - R * 0.25, R * 0.4, rng, 0.3, 9);
    fillStroke(ctx, lighten(main, 0.2), null);
    ctx.globalAlpha = 1;
    ctx.restore();
  },
});

family({
  id: 'nature.tree.willow', name: 'Willow Tree', category: 'nature',
  tags: ['tree', 'willow', 'weeping', 'drooping', 'riverside'], size: 68, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    groundShadow(ctx, 0, s * 0.36, s * 0.32, s * 0.08);
    roundRect(ctx, -s * 0.05, 0, s * 0.1, s * 0.34, s * 0.03);
    fillStroke(ctx, t.trunk, t.ink, LW(s));
    const cy = -s * 0.12, R = s * 0.34;
    blob(ctx, 0, cy, R, rng, 0.18, 16);
    fillStroke(ctx, mix(main, t.leafDark, 0.2), t.ink, LW(s));
    ctx.strokeStyle = mix(main, t.leafDark, 0.1);
    ctx.lineWidth = Math.max(1, s * 0.03);
    ctx.lineCap = 'round';
    const strands = randInt(rng, 8, 12);
    for (let i = 0; i < strands; i++) {
      const x0 = rand(rng, -R, R) * 0.9;
      const y0 = cy + Math.sqrt(Math.max(0, R * R - x0 * x0)) * 0.55;
      const len = rand(rng, s * 0.12, s * 0.3);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(x0 + jitter(rng, s * 0.04), y0 + len * 0.6, x0 + jitter(rng, s * 0.06), y0 + len);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.45;
    blob(ctx, -R * 0.3, cy - R * 0.25, R * 0.4, rng, 0.25, 10);
    fillStroke(ctx, lighten(main, 0.2), null);
    ctx.globalAlpha = 1;
    ctx.restore();
  },
});

family({
  id: 'nature.tree.palm', name: 'Palm Tree', category: 'nature',
  tags: ['tree', 'palm', 'tropical', 'beach', 'coconut'], size: 68, variants: 8,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    groundShadow(ctx, s * 0.04, s * 0.4, s * 0.22, s * 0.07);
    const lean = jitter(rng, s * 0.1);
    ctx.lineCap = 'round';
    ctx.strokeStyle = t.trunk;
    ctx.lineWidth = Math.max(2, s * 0.08);
    ctx.beginPath();
    ctx.moveTo(0, s * 0.38);
    ctx.quadraticCurveTo(lean * 0.6, s * 0.02, lean, -s * 0.22);
    ctx.stroke();
    ctx.strokeStyle = lighten(t.trunk, 0.22);
    ctx.lineWidth = Math.max(1, s * 0.03);
    ctx.beginPath();
    ctx.moveTo(0, s * 0.38);
    ctx.quadraticCurveTo(lean * 0.6, s * 0.02, lean, -s * 0.22);
    ctx.stroke();
    const tx = lean, ty = -s * 0.24;
    const n = randInt(rng, 6, 8);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + jitter(rng, 0.2);
      const fl = rand(rng, s * 0.22, s * 0.32);
      const ex = tx + Math.cos(a) * fl, ey = ty + Math.sin(a) * fl * 0.7 - s * 0.02;
      const fc = mix(main, t.leafDark, rand(rng, 0, 0.4));
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.quadraticCurveTo((tx + ex) / 2 + Math.cos(a + 1.5) * s * 0.05, (ty + ey) / 2 + Math.sin(a + 1.5) * s * 0.05, ex, ey);
      ctx.quadraticCurveTo((tx + ex) / 2 + Math.cos(a - 1.5) * s * 0.05, (ty + ey) / 2 + Math.sin(a - 1.5) * s * 0.05, tx, ty);
      ctx.closePath();
      fillStroke(ctx, fc, t.ink, Math.max(1, s * 0.014));
    }
    ctx.fillStyle = t.woodDark;
    for (let i = 0; i < randInt(rng, 2, 3); i++) {
      circle(ctx, tx + jitter(rng, s * 0.06), ty + rand(rng, 0, s * 0.05), s * 0.035);
      ctx.fill();
    }
    ctx.restore();
  },
});

family({
  id: 'nature.tree.dead', name: 'Dead Tree', category: 'nature',
  tags: ['tree', 'dead', 'bare', 'branches', 'spooky', 'winter'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme }) {
    ctx.save();
    const s = size, t = theme.sprite;
    groundShadow(ctx, 0, s * 0.36, s * 0.18, s * 0.06);
    ctx.strokeStyle = t.woodDark;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    function branch(x, y, ang, len, w, depth) {
      const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len;
      ctx.lineWidth = Math.max(1, w);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      if (depth <= 0 || len < s * 0.06) return;
      const k = randInt(rng, 2, 3);
      for (let i = 0; i < k; i++) {
        branch(ex, ey, ang - 0.6 + (i / (k - 1 || 1)) * 1.2 + jitter(rng, 0.3), len * rand(rng, 0.6, 0.78), w * 0.62, depth - 1);
      }
    }
    branch(0, s * 0.36, -Math.PI / 2 + jitter(rng, 0.15), s * 0.26, s * 0.09, randInt(rng, 3, 4));
    ctx.restore();
  },
});

family({
  id: 'nature.tree.maple', name: 'Autumn Maple', category: 'nature',
  tags: ['tree', 'maple', 'autumn', 'fall', 'deciduous'], size: 64, variants: 8,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const cols = [t.fire, t.gold, t.danger, t.roof, mix(t.fire, t.gold, 0.4)];
    const main = tint || t.fire;
    groundShadow(ctx, 0, s * 0.36, s * 0.27, s * 0.08);
    roundRect(ctx, -s * 0.05, s * 0.04, s * 0.1, s * 0.32, s * 0.03);
    fillStroke(ctx, t.trunk, t.ink, LW(s));
    const cy = -s * 0.1, R = s * 0.32;
    const lobes = randInt(rng, 7, 10);
    for (let i = 0; i < lobes; i++) {
      const a = rand(rng, 0, Math.PI * 2);
      blob(ctx, Math.cos(a) * R * 0.55, cy + Math.sin(a) * R * 0.45, R * rand(rng, 0.4, 0.6), rng, 0.28, 9);
      fillStroke(ctx, pick(rng, cols), null);
    }
    blob(ctx, 0, cy, R, rng, 0.18, 15);
    fillStroke(ctx, main, t.ink, LW(s));
    ctx.globalAlpha = 0.5;
    blob(ctx, -R * 0.3, cy - R * 0.3, R * 0.4, rng, 0.25, 10);
    fillStroke(ctx, lighten(t.gold, 0.2), null);
    ctx.globalAlpha = 0.85;
    for (let i = 0; i < randInt(rng, 3, 6); i++) {
      ctx.fillStyle = pick(rng, [t.fire, t.gold, t.danger, t.roof]);
      star(ctx, rand(rng, -R, R), rand(rng, s * 0.16, s * 0.34), 5, s * 0.03, s * 0.012, rand(rng, 0, 6));
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  },
});

family({
  id: 'nature.tree.snowpine', name: 'Snowy Pine', category: 'nature',
  tags: ['tree', 'pine', 'conifer', 'snow', 'winter'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leafDark;
    groundShadow(ctx, 0, s * 0.4, s * 0.2, s * 0.07);
    roundRect(ctx, -s * 0.04, s * 0.22, s * 0.08, s * 0.18, s * 0.02);
    fillStroke(ctx, t.trunk, t.ink, LW(s));
    const tiers = randInt(rng, 3, 4);
    for (let i = 0; i < tiers; i++) {
      const f = i / (tiers - 1 || 1);
      const apexY = -s * 0.44 + f * s * 0.5;
      const w = s * 0.14 + f * s * 0.26;
      const h = s * 0.2 + f * s * 0.06;
      polygonPath(ctx, [
        { x: 0, y: apexY },
        { x: w, y: apexY + h },
        { x: 0, y: apexY + h * 1.16 },
        { x: -w, y: apexY + h },
      ]);
      fillStroke(ctx, main, t.ink, LW(s));
      polygonPath(ctx, [
        { x: 0, y: apexY },
        { x: w * 0.7, y: apexY + h * 0.7 },
        { x: 0, y: apexY + h * 0.5 },
        { x: -w * 0.7, y: apexY + h * 0.7 },
      ]);
      fillStroke(ctx, t.snow, null);
    }
    ctx.fillStyle = withAlpha(t.white, 0.85);
    for (let i = 0; i < randInt(rng, 4, 7); i++) {
      circle(ctx, rand(rng, -s * 0.3, s * 0.3), rand(rng, -s * 0.36, s * 0.34), s * 0.012);
      ctx.fill();
    }
    ctx.restore();
  },
});

family({
  id: 'nature.tree.jungle', name: 'Jungle Tree', category: 'nature',
  tags: ['tree', 'jungle', 'broadleaf', 'tropical', 'rainforest'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    groundShadow(ctx, 0, s * 0.38, s * 0.32, s * 0.09);
    roundRect(ctx, -s * 0.06, s * 0.06, s * 0.12, s * 0.3, s * 0.03);
    fillStroke(ctx, t.trunk, t.ink, LW(s));
    const cy = -s * 0.08, R = s * 0.36;
    for (let i = 0; i < randInt(rng, 7, 10); i++) {
      const a = rand(rng, 0, Math.PI * 2), d = R * rand(rng, 0.5, 0.9);
      const lx = Math.cos(a) * d, ly = cy + Math.sin(a) * d * 0.8;
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(0, 0, R * 0.32, R * 0.15, 0, 0, Math.PI * 2);
      ctx.closePath();
      fillStroke(ctx, mix(main, t.leafDark, rand(rng, 0, 0.5)), t.ink, Math.max(1, s * 0.012));
      ctx.restore();
    }
    blob(ctx, 0, cy, R * 0.8, rng, 0.2, 15);
    fillStroke(ctx, main, t.ink, LW(s));
    ctx.globalAlpha = 0.5;
    blob(ctx, -R * 0.25, cy - R * 0.2, R * 0.4, rng, 0.25, 10);
    fillStroke(ctx, t.leafLight, null);
    ctx.globalAlpha = 1;
    ctx.restore();
  },
});

family({
  id: 'nature.tree.cypress', name: 'Cypress Tree', category: 'nature',
  tags: ['tree', 'cypress', 'column', 'mediterranean', 'evergreen'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leafDark;
    groundShadow(ctx, 0, s * 0.4, s * 0.13, s * 0.05);
    roundRect(ctx, -s * 0.025, s * 0.28, s * 0.05, s * 0.12, s * 0.01);
    fillStroke(ctx, t.trunk, t.ink, LW(s));
    const w = s * (0.14 + rand(rng, 0, 0.04)), topY = -s * 0.38, botY = s * 0.3;
    ctx.beginPath();
    ctx.moveTo(0, topY);
    ctx.bezierCurveTo(w, topY + s * 0.2, w, botY - s * 0.06, 0, botY);
    ctx.bezierCurveTo(-w, botY - s * 0.06, -w, topY + s * 0.2, 0, topY);
    ctx.closePath();
    fillStroke(ctx, mix(main, t.leaf, 0.12), t.ink, LW(s));
    ctx.strokeStyle = withAlpha(t.leafDark, 0.5);
    ctx.lineWidth = Math.max(1, s * 0.015);
    for (let i = 0; i < 5; i++) {
      const x = rand(rng, -w * 0.7, w * 0.7);
      ctx.beginPath();
      ctx.moveTo(x, topY + s * 0.06);
      ctx.lineTo(x + jitter(rng, s * 0.02), botY - s * 0.04);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.ellipse(-w * 0.35, -s * 0.06, w * 0.4, s * 0.22, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, lighten(main, 0.2), null);
    ctx.globalAlpha = 1;
    ctx.restore();
  },
});

family({
  id: 'nature.tree.fruit', name: 'Fruit Tree', category: 'nature',
  tags: ['tree', 'fruit', 'apple', 'orchard', 'deciduous'], size: 64, variants: 8,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    groundShadow(ctx, 0, s * 0.36, s * 0.26, s * 0.08);
    roundRect(ctx, -s * 0.05, s * 0.04, s * 0.1, s * 0.32, s * 0.03);
    fillStroke(ctx, t.trunk, t.ink, LW(s));
    const cy = -s * 0.08, R = s * 0.3;
    for (let i = 0; i < randInt(rng, 5, 7); i++) {
      const a = rand(rng, 0, Math.PI * 2);
      blob(ctx, Math.cos(a) * R * 0.5, cy + Math.sin(a) * R * 0.45, R * rand(rng, 0.45, 0.6), rng, 0.25, 9);
      fillStroke(ctx, mix(main, t.leafDark, rand(rng, 0, 0.4)), null);
    }
    blob(ctx, 0, cy, R, rng, 0.16, 15);
    fillStroke(ctx, main, t.ink, LW(s));
    const fc = pick(rng, [t.danger, t.gold, t.roof, t.flag]);
    ctx.fillStyle = fc;
    const fruit = [];
    for (let i = 0; i < randInt(rng, 5, 9); i++) {
      const a = rand(rng, 0, Math.PI * 2), d = R * rand(rng, 0.2, 0.85);
      const fx = Math.cos(a) * d, fy = cy + Math.sin(a) * d * 0.9;
      fruit.push([fx, fy]);
      circle(ctx, fx, fy, s * 0.028);
      ctx.fill();
    }
    ctx.fillStyle = lighten(fc, 0.35);
    ctx.globalAlpha = 0.8;
    for (const [fx, fy] of fruit) {
      circle(ctx, fx - s * 0.01, fy - s * 0.01, s * 0.01);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  },
});

family({
  id: 'nature.tree.poplar', name: 'Poplar Tree', category: 'nature',
  tags: ['tree', 'poplar', 'column', 'tall', 'deciduous'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    groundShadow(ctx, 0, s * 0.4, s * 0.12, s * 0.05);
    roundRect(ctx, -s * 0.02, s * 0.26, s * 0.04, s * 0.14, s * 0.01);
    fillStroke(ctx, t.trunk, t.ink, LW(s));
    ctx.save();
    ctx.translate(0, -s * 0.06);
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.15, s * 0.34, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, mix(main, t.leafDark, 0.25), t.ink, LW(s));
    ctx.restore();
    for (let i = 0; i < 7; i++) {
      blob(ctx, jitter(rng, s * 0.06), -s * 0.34 + i * s * 0.095, s * 0.1, rng, 0.35, 9);
      fillStroke(ctx, mix(main, t.leaf, rand(rng, 0, 0.4)), null);
    }
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 3; i++) {
      blob(ctx, -s * 0.05, -s * 0.24 + i * s * 0.12, s * 0.07, rng, 0.3, 8);
      fillStroke(ctx, t.leafLight, null);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  },
});

family({
  id: 'nature.tree.mangrove', name: 'Mangrove Tree', category: 'nature',
  tags: ['tree', 'mangrove', 'swamp', 'roots', 'wetland'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    groundShadow(ctx, 0, s * 0.4, s * 0.34, s * 0.06, withAlpha(theme.terrain.waterDeep, 0.3));
    ctx.strokeStyle = t.woodDark;
    ctx.lineWidth = Math.max(1, s * 0.035);
    ctx.lineCap = 'round';
    for (let i = 0; i < randInt(rng, 5, 7); i++) {
      const x = rand(rng, -s * 0.3, s * 0.3);
      ctx.beginPath();
      ctx.moveTo(x * 0.4, s * 0.1);
      ctx.quadraticCurveTo(x * 0.8, s * 0.34, x, s * 0.4);
      ctx.stroke();
    }
    roundRect(ctx, -s * 0.05, -s * 0.02, s * 0.1, s * 0.16, s * 0.02);
    fillStroke(ctx, t.trunk, t.ink, LW(s));
    const cy = -s * 0.16, R = s * 0.34;
    for (let i = 0; i < randInt(rng, 5, 7); i++) {
      const a = rand(rng, 0, Math.PI * 2);
      blob(ctx, Math.cos(a) * R * 0.55, cy + Math.sin(a) * R * 0.3, R * rand(rng, 0.4, 0.55), rng, 0.25, 9);
      fillStroke(ctx, mix(main, t.leafDark, rand(rng, 0, 0.4)), null);
    }
    ctx.beginPath();
    ctx.ellipse(0, cy, R, R * 0.62, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, main, t.ink, LW(s));
    ctx.globalAlpha = 0.5;
    blob(ctx, -R * 0.3, cy - R * 0.18, R * 0.34, rng, 0.3, 9);
    fillStroke(ctx, t.leafLight, null);
    ctx.globalAlpha = 1;
    ctx.restore();
  },
});

/* =====================================================================
 * SHRUBS / GROUND WOOD
 * ===================================================================== */

family({
  id: 'nature.shrub.bush', name: 'Bush', category: 'nature',
  tags: ['bush', 'shrub', 'foliage', 'berries', 'undergrowth'], size: 56, variants: 8,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    groundShadow(ctx, 0, s * 0.32, s * 0.32, s * 0.08);
    const cy = s * 0.04, R = s * 0.3;
    for (let i = 0; i < randInt(rng, 4, 6); i++) {
      const a = rand(rng, 0, Math.PI * 2), d = R * rand(rng, 0.3, 0.7);
      blob(ctx, Math.cos(a) * d, cy + Math.sin(a) * d * 0.6, R * rand(rng, 0.4, 0.58), rng, 0.3, 10);
      fillStroke(ctx, mix(main, t.leafDark, rand(rng, 0, 0.5)), null);
    }
    blob(ctx, 0, cy, R * 0.78, rng, 0.25, 13);
    fillStroke(ctx, main, t.ink, LW(s));
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 3; i++) {
      blob(ctx, rand(rng, -R * 0.4, R * 0.4), cy - R * 0.2, R * 0.25, rng, 0.3, 8);
      fillStroke(ctx, t.leafLight, null);
    }
    ctx.globalAlpha = 1;
    if (chance(rng, 0.5)) {
      ctx.fillStyle = pick(rng, [t.danger, t.accent, t.flag]);
      for (let i = 0; i < randInt(rng, 4, 8); i++) {
        circle(ctx, rand(rng, -R * 0.6, R * 0.6), cy + rand(rng, -R * 0.4, R * 0.4), s * 0.022);
        ctx.fill();
      }
    }
    ctx.restore();
  },
});

family({
  id: 'nature.shrub.flowering', name: 'Flowering Shrub', category: 'nature',
  tags: ['shrub', 'bush', 'flowers', 'garden', 'foliage'], size: 60, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.grassDark;
    groundShadow(ctx, 0, s * 0.32, s * 0.32, s * 0.07);
    const n = randInt(rng, 2, 3);
    for (let i = 0; i < n; i++) {
      const x = (i - (n - 1) / 2) * s * 0.22;
      const r = s * rand(rng, 0.16, 0.22);
      blob(ctx, x, s * 0.08, r, rng, 0.3, 11);
      fillStroke(ctx, mix(main, t.leafDark, 0.2), t.ink, LW(s));
      ctx.globalAlpha = 0.5;
      blob(ctx, x - r * 0.3, s * 0.08 - r * 0.3, r * 0.4, rng, 0.3, 8);
      fillStroke(ctx, t.leafLight, null);
      ctx.globalAlpha = 1;
      ctx.fillStyle = pick(rng, [t.white, t.gold, t.accent, t.flag]);
      for (let k = 0; k < randInt(rng, 3, 6); k++) {
        circle(ctx, x + rand(rng, -r, r), s * 0.08 + rand(rng, -r, r * 0.6), s * 0.018);
        ctx.fill();
      }
    }
    ctx.restore();
  },
});

family({
  id: 'nature.shrub.hedge', name: 'Hedgerow', category: 'nature',
  tags: ['hedge', 'hedgerow', 'shrub', 'trimmed', 'border'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leafDark;
    groundShadow(ctx, 0, s * 0.32, s * 0.42, s * 0.06);
    const w = s * 0.8, h = s * 0.34, x = -w / 2, y = -s * 0.02;
    roundRect(ctx, x, y, w, h, s * 0.04);
    fillStroke(ctx, mix(main, t.leaf, 0.12), t.ink, LW(s));
    ctx.fillStyle = mix(main, t.leaf, 0.25);
    for (let i = 0; i < 8; i++) {
      const bx = x + (i + 0.5) * w / 8;
      blob(ctx, bx, y, (w / 16) * rand(rng, 1, 1.3), rng, 0.3, 8);
      ctx.fill();
    }
    hatch(ctx, x, y, w, h, s * 0.06, Math.PI / 4, withAlpha(t.leafDark, 0.3), Math.max(1, s * 0.01));
    ctx.globalAlpha = 0.4;
    roundRect(ctx, x + s * 0.03, y + s * 0.05, w - s * 0.06, h * 0.3, s * 0.03);
    fillStroke(ctx, t.leafLight, null);
    ctx.globalAlpha = 1;
    ctx.restore();
  },
});

family({
  id: 'nature.shrub.stump', name: 'Tree Stump', category: 'nature',
  tags: ['stump', 'wood', 'logged', 'rings', 'tree'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme }) {
    ctx.save();
    const s = size, t = theme.sprite;
    groundShadow(ctx, 0, s * 0.28, s * 0.26, s * 0.08);
    roundRect(ctx, -s * 0.2, -s * 0.02, s * 0.4, s * 0.22, s * 0.04);
    fillStroke(ctx, t.woodDark, t.ink, LW(s));
    ctx.strokeStyle = darken(t.woodDark, 0.2);
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = Math.max(1, s * 0.012);
    for (let i = 0; i < 6; i++) {
      const x = -s * 0.18 + i * s * 0.072;
      ctx.beginPath();
      ctx.moveTo(x, s * 0.03);
      ctx.lineTo(x, s * 0.18);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.02, s * 0.2, s * 0.1, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, t.wood, t.ink, LW(s));
    ctx.strokeStyle = t.woodDark;
    ctx.lineWidth = Math.max(1, s * 0.012);
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.ellipse(jitter(rng, s * 0.01), -s * 0.02, s * 0.2 * i / 4, s * 0.1 * i / 4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.02);
    ctx.lineTo(s * 0.14, -s * 0.06);
    ctx.stroke();
    ctx.restore();
  },
});

family({
  id: 'nature.shrub.log', name: 'Fallen Log', category: 'nature',
  tags: ['log', 'wood', 'fallen', 'trunk', 'moss'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme }) {
    ctx.save();
    const s = size, t = theme.sprite;
    groundShadow(ctx, 0, s * 0.18, s * 0.4, s * 0.09);
    ctx.rotate(jitter(rng, 0.15));
    roundRect(ctx, -s * 0.4, -s * 0.1, s * 0.8, s * 0.2, s * 0.1);
    fillStroke(ctx, t.wood, t.ink, LW(s));
    ctx.strokeStyle = darken(t.woodDark, 0.0);
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = Math.max(1, s * 0.012);
    for (let i = 0; i < 3; i++) {
      const y = -s * 0.05 + i * s * 0.05;
      ctx.beginPath();
      ctx.moveTo(-s * 0.34, y);
      ctx.lineTo(s * 0.3, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.ellipse(-s * 0.36, 0, s * 0.05, s * 0.1, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, lighten(t.wood, 0.15), t.ink, LW(s));
    ctx.strokeStyle = t.woodDark;
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath();
      ctx.ellipse(-s * 0.36, 0, s * 0.05 * i / 3, s * 0.1 * i / 3, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (chance(rng, 0.6)) {
      ctx.fillStyle = withAlpha(t.leaf, 0.7);
      for (let i = 0; i < randInt(rng, 3, 6); i++) {
        blob(ctx, rand(rng, -s * 0.3, s * 0.25), -s * 0.08, s * 0.05, rng, 0.4, 7);
        ctx.fill();
      }
    }
    ctx.restore();
  },
});

/* =====================================================================
 * MOUNTAINS / ROCKS / TERRAIN
 * ===================================================================== */

family({
  id: 'nature.mountain.peak', name: 'Mountain Peak', category: 'nature',
  tags: ['mountain', 'peak', 'rock', 'summit'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.stone;
    groundShadow(ctx, 0, s * 0.38, s * 0.34, s * 0.06);
    const apex = { x: jitter(rng, s * 0.05), y: -s * 0.4 };
    const bl = { x: -s * 0.4, y: s * 0.34 }, br = { x: s * 0.4, y: s * 0.34 };
    polygonPath(ctx, [apex, bl, br]);
    fillStroke(ctx, main, t.ink, LW(s));
    polygonPath(ctx, [apex, { x: apex.x, y: s * 0.34 }, br]);
    fillStroke(ctx, darken(main, 0.18), null);
    ctx.globalAlpha = 0.5;
    polygonPath(ctx, [apex, { x: apex.x - s * 0.14, y: s * 0.0 }, { x: apex.x, y: -s * 0.08 }]);
    fillStroke(ctx, lighten(main, 0.2), null);
    ctx.globalAlpha = 1;
    if (chance(rng, 0.6)) {
      polygonPath(ctx, [
        apex,
        { x: apex.x - s * 0.13, y: -s * 0.16 },
        { x: apex.x - s * 0.04, y: -s * 0.2 },
        { x: apex.x + s * 0.05, y: -s * 0.15 },
        { x: apex.x + s * 0.12, y: -s * 0.17 },
      ]);
      fillStroke(ctx, t.snow, null);
    }
    polygonPath(ctx, [apex, bl, br]);
    fillStroke(ctx, null, t.ink, LW(s));
    ctx.restore();
  },
});

family({
  id: 'nature.mountain.range', name: 'Mountain Range', category: 'nature',
  tags: ['mountain', 'range', 'peaks', 'ridge', 'massif'], size: 88, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.stone;
    groundShadow(ctx, 0, s * 0.4, s * 0.46, s * 0.05);
    const farN = randInt(rng, 2, 3);
    for (let i = 0; i < farN; i++) {
      const x = (i - (farN - 1) / 2) * s * 0.22 + jitter(rng, s * 0.03);
      const apexY = -s * rand(rng, 0.16, 0.28);
      polygonPath(ctx, [{ x, y: apexY }, { x: x - s * 0.22, y: s * 0.3 }, { x: x + s * 0.22, y: s * 0.3 }]);
      fillStroke(ctx, lighten(main, 0.16), t.ink, LW(s));
      polygonPath(ctx, [{ x, y: apexY }, { x: x - s * 0.05, y: apexY + s * 0.08 }, { x: x + s * 0.05, y: apexY + s * 0.08 }]);
      fillStroke(ctx, t.snow, null);
    }
    const nearN = randInt(rng, 2, 3);
    for (let i = 0; i < nearN; i++) {
      const x = (i - (nearN - 1) / 2) * s * 0.24 + jitter(rng, s * 0.03);
      const apexY = -s * rand(rng, 0.3, 0.42);
      polygonPath(ctx, [{ x, y: apexY }, { x: x - s * 0.26, y: s * 0.36 }, { x: x + s * 0.26, y: s * 0.36 }]);
      fillStroke(ctx, main, t.ink, LW(s));
      polygonPath(ctx, [{ x, y: apexY }, { x: x + s * 0.26, y: s * 0.36 }, { x, y: s * 0.36 }]);
      fillStroke(ctx, darken(main, 0.16), null);
      polygonPath(ctx, [
        { x, y: apexY },
        { x: x - s * 0.08, y: apexY + s * 0.12 },
        { x, y: apexY + s * 0.08 },
        { x: x + s * 0.07, y: apexY + s * 0.13 },
      ]);
      fillStroke(ctx, t.snow, null);
      polygonPath(ctx, [{ x, y: apexY }, { x: x - s * 0.26, y: s * 0.36 }, { x: x + s * 0.26, y: s * 0.36 }]);
      fillStroke(ctx, null, t.ink, LW(s));
    }
    ctx.restore();
  },
});

family({
  id: 'nature.mountain.snowcap', name: 'Snow-Capped Peak', category: 'nature',
  tags: ['mountain', 'snow', 'peak', 'alpine', 'winter'], size: 76, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.stoneDark;
    groundShadow(ctx, 0, s * 0.38, s * 0.36, s * 0.06);
    const apex = { x: jitter(rng, s * 0.04), y: -s * 0.42 };
    const bl = { x: -s * 0.42, y: s * 0.34 }, br = { x: s * 0.42, y: s * 0.34 };
    polygonPath(ctx, [apex, bl, br]);
    fillStroke(ctx, main, t.ink, LW(s));
    polygonPath(ctx, [apex, { x: apex.x, y: s * 0.34 }, br]);
    fillStroke(ctx, darken(main, 0.16), null);
    const snowY = -s * 0.04;
    polygonPath(ctx, [
      apex,
      { x: -s * 0.22, y: snowY },
      { x: -s * 0.12, y: snowY - s * 0.06 },
      { x: 0, y: snowY + s * 0.02 },
      { x: s * 0.1, y: snowY - s * 0.05 },
      { x: s * 0.22, y: snowY },
    ]);
    fillStroke(ctx, t.snow, null);
    ctx.globalAlpha = 0.4;
    polygonPath(ctx, [apex, { x: s * 0.22, y: snowY }, { x: s * 0.1, y: snowY - s * 0.05 }, { x: apex.x, y: snowY - s * 0.02 }]);
    fillStroke(ctx, mix(t.snow, t.water, 0.25), null);
    ctx.globalAlpha = 1;
    polygonPath(ctx, [apex, bl, br]);
    fillStroke(ctx, null, t.ink, LW(s));
    ctx.restore();
  },
});

family({
  id: 'nature.mountain.volcano', name: 'Volcano', category: 'nature',
  tags: ['volcano', 'mountain', 'lava', 'smoke', 'eruption'], size: 80, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.stoneDark;
    groundShadow(ctx, 0, s * 0.38, s * 0.38, s * 0.06);
    const topL = -s * 0.14, topR = s * 0.14, topY = -s * 0.18, bl = -s * 0.4, br = s * 0.4, by = s * 0.34;
    polygonPath(ctx, [{ x: topL, y: topY }, { x: topR, y: topY }, { x: br, y: by }, { x: bl, y: by }]);
    fillStroke(ctx, main, t.ink, LW(s));
    polygonPath(ctx, [{ x: 0, y: topY }, { x: topR, y: topY }, { x: br, y: by }, { x: 0, y: by }]);
    fillStroke(ctx, darken(main, 0.18), null);
    ctx.strokeStyle = t.fire;
    ctx.lineWidth = Math.max(1, s * 0.02);
    ctx.lineCap = 'round';
    for (let i = 0; i < randInt(rng, 1, 3); i++) {
      const dir = pick(rng, [-1, 1]);
      ctx.beginPath();
      ctx.moveTo(dir * s * 0.06, topY);
      ctx.quadraticCurveTo(dir * s * 0.18, s * 0.05, dir * s * 0.2, s * 0.2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.ellipse(0, topY, s * 0.14, s * 0.05, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, t.danger, t.ink, LW(s));
    ctx.beginPath();
    ctx.ellipse(0, topY, s * 0.1, s * 0.035, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, t.fire, null);
    ctx.beginPath();
    ctx.ellipse(0, topY, s * 0.05, s * 0.018, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, lighten(t.fire, 0.3), null);
    ctx.fillStyle = withAlpha(t.stone, 0.5);
    for (let i = 0; i < randInt(rng, 3, 5); i++) {
      blob(ctx, jitter(rng, s * 0.06), topY - s * 0.08 - i * s * 0.07, s * 0.07 + i * s * 0.012, rng, 0.4, 9);
      ctx.fill();
    }
    ctx.restore();
  },
});

family({
  id: 'nature.mountain.mesa', name: 'Mesa Butte', category: 'nature',
  tags: ['mesa', 'butte', 'plateau', 'desert', 'rock'], size: 76, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.brick;
    groundShadow(ctx, 0, s * 0.36, s * 0.4, s * 0.06);
    const topY = -s * 0.2, by = s * 0.32, topHalf = s * 0.3, botHalf = s * 0.36;
    polygonPath(ctx, [{ x: -topHalf, y: topY }, { x: topHalf, y: topY }, { x: botHalf, y: by }, { x: -botHalf, y: by }]);
    fillStroke(ctx, main, t.ink, LW(s));
    ctx.strokeStyle = darken(main, 0.25);
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = Math.max(1, s * 0.012);
    for (let i = 1; i <= 3; i++) {
      const y = topY + i * (by - topY) / 4;
      ctx.beginPath();
      ctx.moveTo(-topHalf - i * s * 0.015, y);
      ctx.lineTo(topHalf + i * s * 0.015, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.5;
    polygonPath(ctx, [{ x: topHalf, y: topY }, { x: botHalf, y: by }, { x: botHalf - s * 0.1, y: by }, { x: topHalf - s * 0.06, y: topY }]);
    fillStroke(ctx, darken(main, 0.2), null);
    ctx.globalAlpha = 1;
    polygonPath(ctx, [
      { x: -topHalf, y: topY },
      { x: topHalf, y: topY },
      { x: topHalf - s * 0.04, y: topY - s * 0.05 },
      { x: -topHalf + s * 0.04, y: topY - s * 0.05 },
    ]);
    fillStroke(ctx, lighten(main, 0.18), t.ink, LW(s));
    ctx.restore();
  },
});

family({
  id: 'nature.mountain.crag', name: 'Rocky Crag', category: 'nature',
  tags: ['crag', 'rock', 'jagged', 'outcrop', 'spire'], size: 68, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.stoneDark;
    groundShadow(ctx, 0, s * 0.34, s * 0.34, s * 0.06);
    const n = randInt(rng, 3, 5);
    for (let i = 0; i < n; i++) {
      const cx = (i - (n - 1) / 2) * s * 0.16 + jitter(rng, s * 0.03);
      const h = rand(rng, 0.3, 0.46), w = rand(rng, 0.1, 0.16);
      polygonPath(ctx, [{ x: cx, y: -s * h }, { x: cx + s * w, y: s * 0.3 }, { x: cx - s * w, y: s * 0.3 }]);
      fillStroke(ctx, mix(main, t.stone, rand(rng, 0, 0.4)), t.ink, LW(s));
      polygonPath(ctx, [{ x: cx, y: -s * h }, { x: cx + s * w, y: s * 0.3 }, { x: cx, y: s * 0.3 }]);
      fillStroke(ctx, darken(main, 0.2), null);
    }
    ctx.restore();
  },
});

family({
  id: 'nature.rock.boulder', name: 'Boulder', category: 'nature',
  tags: ['rock', 'boulder', 'granite', 'stone'], size: 64, variants: 8,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.stone;
    groundShadow(ctx, 0, s * 0.28, s * 0.36, s * 0.1);
    softShadow(ctx, theme.sprite.shadow, s * 0.08, s * 0.03);
    const seed = rseed(rng);
    blob(ctx, 0, s * 0.02, s * 0.34, makeRng(seed), 0.18, 12);
    fillStroke(ctx, main, null);
    clearShadow(ctx);
    ctx.save();
    blob(ctx, 0, s * 0.02, s * 0.34, makeRng(seed), 0.18, 12);
    ctx.clip();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = darken(main, 0.2);
    blob(ctx, s * 0.12, s * 0.14, s * 0.3, rng, 0.2, 10);
    ctx.fill();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = lighten(main, 0.22);
    blob(ctx, -s * 0.1, -s * 0.12, s * 0.22, rng, 0.2, 10);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = withAlpha(t.ink, 0.45);
    ctx.lineWidth = Math.max(1, s * 0.012);
    ctx.beginPath();
    ctx.moveTo(jitter(rng, s * 0.1), -s * 0.2);
    ctx.lineTo(jitter(rng, s * 0.05), s * 0.0);
    ctx.lineTo(s * 0.12, s * 0.18);
    ctx.stroke();
    ctx.restore();
    blob(ctx, 0, s * 0.02, s * 0.34, makeRng(seed), 0.18, 12);
    fillStroke(ctx, null, t.ink, LW(s));
    ctx.fillStyle = mix(main, t.stoneDark, 0.3);
    for (let i = 0; i < randInt(rng, 1, 3); i++) {
      ngon(ctx, rand(rng, -s * 0.35, s * 0.35), s * 0.32, s * rand(rng, 0.04, 0.07), randInt(rng, 5, 6), rand(rng, 0, 1));
      fillStroke(ctx, mix(main, t.stoneDark, 0.3), t.ink, Math.max(1, s * 0.012));
    }
    ctx.restore();
  },
});

family({
  id: 'nature.rock.mossy', name: 'Mossy Rocks', category: 'nature',
  tags: ['rock', 'moss', 'cluster', 'stone', 'forest'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.stoneDark;
    groundShadow(ctx, 0, s * 0.3, s * 0.36, s * 0.08);
    const rocks = [
      { x: 0, y: -s * 0.08, r: s * 0.22 },
      { x: -s * 0.16, y: s * 0.08, r: s * 0.2 },
      { x: s * 0.14, y: s * 0.04, r: s * 0.18 },
    ];
    for (const rk of rocks) {
      const sd = rseed(rng);
      blob(ctx, rk.x, rk.y, rk.r, makeRng(sd), 0.2, 11);
      fillStroke(ctx, mix(main, t.stone, rand(rng, 0, 0.4)), t.ink, LW(s));
      ctx.save();
      blob(ctx, rk.x, rk.y, rk.r, makeRng(sd), 0.2, 11);
      ctx.clip();
      ctx.fillStyle = withAlpha(t.leaf, 0.7);
      blob(ctx, rk.x - rk.r * 0.2, rk.y - rk.r * 0.4, rk.r * 0.7, rng, 0.4, 9);
      ctx.fill();
      ctx.fillStyle = withAlpha(t.leafLight, 0.5);
      blob(ctx, rk.x, rk.y - rk.r * 0.5, rk.r * 0.4, rng, 0.4, 8);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  },
});

family({
  id: 'nature.terrain.cliff', name: 'Cliff Edge', category: 'nature',
  tags: ['cliff', 'edge', 'escarpment', 'rock', 'drop'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.stone;
    const seed = rseed(rng);
    const sampler = () => {
      const r = makeRng(seed);
      const a = [];
      for (let i = 0; i <= 10; i++) a.push(-s * 0.06 + (r() * 2 - 1) * s * 0.05);
      return a;
    };
    const ys = sampler();
    const xat = (i) => -s * 0.46 + i * (s * 0.92 / 10);
    ctx.fillStyle = darken(theme.terrain.grass, 0.14);
    roundRect(ctx, -s * 0.47, s * 0.06, s * 0.94, s * 0.42, s * 0.03);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-s * 0.46, ys[0]);
    for (let i = 1; i <= 10; i++) ctx.lineTo(xat(i), ys[i]);
    ctx.lineTo(s * 0.46, s * 0.18);
    ctx.lineTo(-s * 0.46, s * 0.18);
    ctx.closePath();
    fillStroke(ctx, main, t.ink, LW(s));
    ctx.strokeStyle = darken(main, 0.22);
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = Math.max(1, s * 0.012);
    for (let k = 0; k < 12; k++) {
      const x = -s * 0.42 + k * s * 0.078;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + jitter(rng, s * 0.01), s * 0.16);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(-s * 0.46, -s * 0.46);
    ctx.lineTo(s * 0.46, -s * 0.46);
    ctx.lineTo(s * 0.46, ys[10]);
    for (let i = 10; i >= 0; i--) ctx.lineTo(xat(i), ys[i]);
    ctx.closePath();
    fillStroke(ctx, theme.terrain.grass, t.ink, LW(s));
    ctx.strokeStyle = darken(theme.terrain.grass, 0.2);
    ctx.lineWidth = Math.max(1, s * 0.01);
    for (let i = 0; i <= 10; i++) {
      const x = xat(i);
      ctx.beginPath();
      ctx.moveTo(x, ys[i]);
      ctx.lineTo(x + jitter(rng, s * 0.01), ys[i] - s * 0.03);
      ctx.stroke();
    }
    ctx.restore();
  },
});

family({
  id: 'nature.terrain.hills', name: 'Rolling Hills', category: 'nature',
  tags: ['hills', 'grass', 'rolling', 'meadow', 'landscape'], size: 88, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || theme.terrain.grass;
    groundShadow(ctx, 0, s * 0.44, s * 0.46, s * 0.04);
    const shades = [lighten(main, 0.14), main, darken(main, 0.1)];
    for (let L = 0; L < 3; L++) {
      const baseY = -s * 0.04 + L * s * 0.14;
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, s * 0.5);
      ctx.lineTo(-s * 0.5, baseY);
      const bumps = randInt(rng, 2, 4);
      const seg = s / bumps;
      let x = -s * 0.5;
      for (let b = 0; b < bumps; b++) {
        const cx = x + seg / 2;
        const cy = baseY - rand(rng, s * 0.06, s * 0.14);
        ctx.quadraticCurveTo(cx, cy, x + seg, baseY + jitter(rng, s * 0.02));
        x += seg;
      }
      ctx.lineTo(s * 0.5, s * 0.5);
      ctx.closePath();
      fillStroke(ctx, shades[L], L === 2 ? t.ink : withAlpha(t.ink, 0.3), LW(s));
    }
    ctx.strokeStyle = darken(main, 0.18);
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = Math.max(1, s * 0.01);
    for (let i = 0; i < 14; i++) {
      const x = rand(rng, -s * 0.44, s * 0.44), y = rand(rng, s * 0.04, s * 0.4);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + jitter(rng, s * 0.02), y - s * 0.04);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  },
});

family({
  id: 'nature.terrain.dune', name: 'Sand Dunes', category: 'nature',
  tags: ['dune', 'sand', 'desert', 'ripples', 'arid'], size: 84, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || theme.terrain.sand;
    groundShadow(ctx, 0, s * 0.44, s * 0.46, s * 0.04);
    const shades = [lighten(main, 0.12), main, darken(main, 0.1)];
    for (let L = 0; L < 3; L++) {
      const baseY = -s * 0.06 + L * s * 0.16;
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, s * 0.5);
      ctx.lineTo(-s * 0.5, baseY);
      const bumps = randInt(rng, 2, 3);
      const seg = s / bumps;
      let x = -s * 0.5;
      for (let b = 0; b < bumps; b++) {
        const cx = x + seg * 0.5;
        const cy = baseY - rand(rng, s * 0.05, s * 0.12);
        ctx.quadraticCurveTo(cx, cy, x + seg, baseY + jitter(rng, s * 0.02));
        x += seg;
      }
      ctx.lineTo(s * 0.5, s * 0.5);
      ctx.closePath();
      fillStroke(ctx, shades[L], L === 2 ? t.ink : null, LW(s));
      ctx.strokeStyle = darken(main, 0.14);
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = Math.max(1, s * 0.01);
      for (let r = 0; r < 3; r++) {
        const ry = baseY + s * 0.03 + r * s * 0.04;
        ctx.beginPath();
        ctx.moveTo(-s * 0.4, ry);
        ctx.quadraticCurveTo(jitter(rng, s * 0.2), ry - s * 0.02, s * 0.4, ry);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  },
});

/* =====================================================================
 * DESERT PLANTS / GRASSES / FERNS
 * ===================================================================== */

family({
  id: 'nature.cactus.saguaro', name: 'Saguaro Cactus', category: 'nature',
  tags: ['cactus', 'saguaro', 'desert', 'succulent', 'arid'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    groundShadow(ctx, 0, s * 0.4, s * 0.18, s * 0.05);
    function arm(side, y) {
      const x0 = side * s * 0.06;
      const bend = side * s * 0.16;
      const topY = y - rand(rng, s * 0.16, s * 0.24);
      const drawArm = (w, col) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = w;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.quadraticCurveTo(x0 + bend, y, x0 + bend, topY);
        ctx.stroke();
      };
      drawArm(Math.max(3, s * 0.16) + 2 * LW(s), t.ink);
      drawArm(Math.max(3, s * 0.16), main);
    }
    const arms = randInt(rng, 1, 2);
    for (let i = 0; i < arms; i++) arm(i === 0 ? -1 : 1, rand(rng, -s * 0.08, s * 0.06));
    roundRect(ctx, -s * 0.08, -s * 0.36, s * 0.16, s * 0.74, s * 0.08);
    fillStroke(ctx, main, t.ink, LW(s));
    ctx.strokeStyle = withAlpha(t.leafDark, 0.5);
    ctx.lineWidth = Math.max(1, s * 0.012);
    for (let i = -1; i <= 1; i++) {
      const x = i * s * 0.045;
      ctx.beginPath();
      ctx.moveTo(x, -s * 0.32);
      ctx.lineTo(x, s * 0.34);
      ctx.stroke();
    }
    if (chance(rng, 0.45)) {
      ctx.fillStyle = pick(rng, [t.flag, t.gold, t.white]);
      for (let i = 0; i < randInt(rng, 2, 3); i++) {
        circle(ctx, jitter(rng, s * 0.06), -s * 0.36 + jitter(rng, s * 0.03), s * 0.03);
        ctx.fill();
      }
    }
    ctx.restore();
  },
});

family({
  id: 'nature.cactus.pricklypear', name: 'Prickly Pear', category: 'nature',
  tags: ['cactus', 'prickly', 'pear', 'pads', 'desert'], size: 60, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    groundShadow(ctx, 0, s * 0.34, s * 0.28, s * 0.07);
    const pads = randInt(rng, 3, 5);
    for (let i = 0; i < pads; i++) {
      const px = jitter(rng, s * 0.2);
      const py = s * 0.12 - i * s * 0.1 - rand(rng, 0, s * 0.05);
      const rr = s * rand(rng, 0.1, 0.16);
      const ang = jitter(rng, 0.5);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.ellipse(0, 0, rr, rr * 1.3, 0, 0, Math.PI * 2);
      ctx.closePath();
      fillStroke(ctx, mix(main, t.leafDark, rand(rng, 0, 0.4)), t.ink, LW(s));
      ctx.fillStyle = withAlpha(t.gold, 0.7);
      for (let k = 0; k < 6; k++) {
        circle(ctx, rand(rng, -rr * 0.6, rr * 0.6), rand(rng, -rr, rr), s * 0.008);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.fillStyle = t.danger;
    for (let i = 0; i < randInt(rng, 2, 4); i++) {
      circle(ctx, jitter(rng, s * 0.15), -s * 0.18 + jitter(rng, s * 0.05), s * 0.03);
      ctx.fill();
    }
    ctx.restore();
  },
});

family({
  id: 'nature.cactus.barrel', name: 'Barrel Cactus', category: 'nature',
  tags: ['cactus', 'barrel', 'desert', 'succulent', 'round'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    groundShadow(ctx, 0, s * 0.34, s * 0.24, s * 0.07);
    ctx.beginPath();
    ctx.ellipse(0, s * 0.04, s * 0.24, s * 0.3, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, main, t.ink, LW(s));
    ctx.strokeStyle = withAlpha(t.leafDark, 0.6);
    ctx.lineWidth = Math.max(1, s * 0.014);
    for (let i = -3; i <= 3; i++) {
      const f = i / 3;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.26);
      ctx.quadraticCurveTo(f * s * 0.3, s * 0.04, 0, s * 0.34);
      ctx.stroke();
    }
    ctx.fillStyle = withAlpha(t.gold, 0.7);
    for (let i = 0; i < 16; i++) {
      circle(ctx, rand(rng, -s * 0.22, s * 0.22), rand(rng, -s * 0.22, s * 0.3), s * 0.01);
      ctx.fill();
    }
    ctx.fillStyle = pick(rng, [t.gold, t.flag, t.danger]);
    for (let i = 0; i < randInt(rng, 3, 5); i++) {
      const a = Math.PI + (i / 4) * Math.PI;
      circle(ctx, Math.cos(a) * s * 0.12, -s * 0.24 + Math.sin(a) * s * 0.04, s * 0.025);
      ctx.fill();
    }
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.ellipse(-s * 0.08, -s * 0.02, s * 0.08, s * 0.16, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, t.leafLight, null);
    ctx.globalAlpha = 1;
    ctx.restore();
  },
});

family({
  id: 'nature.plant.reeds', name: 'Reeds & Cattails', category: 'nature',
  tags: ['reeds', 'cattail', 'marsh', 'wetland', 'water'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.grassDark;
    ctx.fillStyle = withAlpha(theme.terrain.water, 0.5);
    ctx.beginPath();
    ctx.ellipse(0, s * 0.34, s * 0.4, s * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    const n = randInt(rng, 5, 8);
    for (let i = 0; i < n; i++) {
      const x = rand(rng, -s * 0.3, s * 0.3);
      const h = rand(rng, s * 0.4, s * 0.7);
      const topY = s * 0.34 - h;
      ctx.strokeStyle = mix(main, t.leaf, 0.3);
      ctx.lineWidth = Math.max(1, s * 0.014);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, s * 0.34);
      ctx.quadraticCurveTo(x + s * 0.12, topY + s * 0.1, x + s * 0.06, topY - s * 0.04);
      ctx.stroke();
      ctx.strokeStyle = main;
      ctx.lineWidth = Math.max(1, s * 0.02);
      ctx.beginPath();
      ctx.moveTo(x, s * 0.34);
      ctx.quadraticCurveTo(x + jitter(rng, s * 0.03), (s * 0.34 + topY) / 2, x + jitter(rng, s * 0.04), topY);
      ctx.stroke();
      if (chance(rng, 0.7)) {
        roundRect(ctx, x - s * 0.025 + jitter(rng, s * 0.04), topY, s * 0.05, s * 0.14, s * 0.025);
        fillStroke(ctx, t.woodDark, t.ink, Math.max(1, s * 0.012));
      }
    }
    ctx.restore();
  },
});

family({
  id: 'nature.plant.grass', name: 'Grass Tuft', category: 'nature',
  tags: ['grass', 'tuft', 'blades', 'ground', 'meadow'], size: 56, variants: 8,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || theme.terrain.grass;
    groundShadow(ctx, 0, s * 0.3, s * 0.3, s * 0.05, withAlpha(t.ink, 0.12));
    const clumps = randInt(rng, 2, 3);
    for (let c = 0; c < clumps; c++) {
      const ox = (c - (clumps - 1) / 2) * s * 0.22 + jitter(rng, s * 0.03);
      const blades = randInt(rng, 5, 8);
      for (let i = 0; i < blades; i++) {
        const base = ox + jitter(rng, s * 0.06);
        const lean = jitter(rng, s * 0.12);
        const h = rand(rng, s * 0.2, s * 0.36);
        ctx.strokeStyle = mix(main, theme.terrain.grassDark, rand(rng, 0, 0.5));
        ctx.lineWidth = Math.max(1, s * 0.02);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(base, s * 0.3);
        ctx.quadraticCurveTo(base + lean * 0.5, s * 0.3 - h * 0.6, base + lean, s * 0.3 - h);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
});

family({
  id: 'nature.plant.fern', name: 'Fern', category: 'nature',
  tags: ['fern', 'frond', 'undergrowth', 'leaf', 'forest'], size: 60, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    groundShadow(ctx, 0, s * 0.32, s * 0.26, s * 0.06);
    const fronds = randInt(rng, 5, 7);
    for (let i = 0; i < fronds; i++) {
      const a = -Math.PI / 2 + (i - (fronds - 1) / 2) * 0.42 + jitter(rng, 0.1);
      const len = rand(rng, s * 0.34, s * 0.44);
      const tipx = Math.cos(a) * len, tipy = s * 0.26 + Math.sin(a) * len;
      ctx.strokeStyle = mix(main, t.leafDark, 0.3);
      ctx.lineWidth = Math.max(1, s * 0.018);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, s * 0.26);
      ctx.quadraticCurveTo(Math.cos(a) * len * 0.5 - Math.sin(a) * s * 0.04, s * 0.26 + Math.sin(a) * len * 0.5 + Math.cos(a) * s * 0.04, tipx, tipy);
      ctx.stroke();
      ctx.lineWidth = Math.max(1, s * 0.01);
      const perp = a + Math.PI / 2;
      for (let k = 1; k <= 6; k++) {
        const f = k / 7;
        const px = Math.cos(a) * len * f, py = s * 0.26 + Math.sin(a) * len * f;
        const ll = s * 0.06 * (1 - f * 0.5);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(perp) * ll, py + Math.sin(perp) * ll);
        ctx.moveTo(px, py);
        ctx.lineTo(px - Math.cos(perp) * ll, py - Math.sin(perp) * ll);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
});

/* =====================================================================
 * FLOWERS / MUSHROOMS
 * ===================================================================== */

family({
  id: 'nature.flower.wildflower', name: 'Wildflower Patch', category: 'nature',
  tags: ['flower', 'wildflower', 'patch', 'bloom', 'meadow'], size: 64, variants: 8,
  draw(ctx, { size, rng, theme }) {
    ctx.save();
    const s = size, t = theme.sprite;
    groundShadow(ctx, 0, s * 0.32, s * 0.32, s * 0.06);
    ctx.fillStyle = withAlpha(theme.terrain.grass, 0.6);
    blob(ctx, 0, s * 0.18, s * 0.34, rng, 0.25, 12);
    ctx.fill();
    const cols = [t.flag, t.gold, t.accent, t.white, t.danger];
    const n = randInt(rng, 7, 11);
    const flowers = [];
    for (let i = 0; i < n; i++) {
      flowers.push({ x: rand(rng, -s * 0.34, s * 0.34), y: rand(rng, -s * 0.05, s * 0.22), col: pick(rng, cols), pr: s * rand(rng, 0.03, 0.045) });
    }
    flowers.sort((a, b) => a.y - b.y);
    for (const fl of flowers) {
      ctx.strokeStyle = theme.terrain.grassDark;
      ctx.lineWidth = Math.max(1, s * 0.012);
      ctx.beginPath();
      ctx.moveTo(fl.x, fl.y + s * 0.12);
      ctx.lineTo(fl.x, fl.y);
      ctx.stroke();
      ctx.fillStyle = fl.col;
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * Math.PI * 2;
        circle(ctx, fl.x + Math.cos(a) * fl.pr, fl.y + Math.sin(a) * fl.pr, fl.pr * 0.6);
        ctx.fill();
      }
      ctx.fillStyle = t.gold;
      circle(ctx, fl.x, fl.y, fl.pr * 0.5);
      ctx.fill();
    }
    ctx.restore();
  },
});

family({
  id: 'nature.flower.lavender', name: 'Lavender Row', category: 'nature',
  tags: ['flower', 'lavender', 'row', 'purple', 'herb'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.accent;
    groundShadow(ctx, 0, s * 0.34, s * 0.34, s * 0.06);
    const rows = randInt(rng, 2, 3);
    for (let r = 0; r < rows; r++) {
      const ry = s * 0.02 + r * s * 0.14;
      const count = randInt(rng, 5, 7);
      for (let i = 0; i < count; i++) {
        const x = -s * 0.36 + (i + 0.5) * (s * 0.72 / count) + jitter(rng, s * 0.02);
        ctx.strokeStyle = theme.terrain.grassDark;
        ctx.lineWidth = Math.max(1, s * 0.012);
        ctx.beginPath();
        ctx.moveTo(x, ry + s * 0.1);
        ctx.lineTo(x, ry - s * 0.12);
        ctx.stroke();
        ctx.fillStyle = mix(main, t.leafDark, rand(rng, 0, 0.2));
        for (let k = 0; k < 5; k++) {
          circle(ctx, x + jitter(rng, s * 0.01), ry - s * 0.12 + k * s * 0.025, s * 0.018);
          ctx.fill();
        }
        ctx.fillStyle = lighten(main, 0.25);
        circle(ctx, x, ry - s * 0.12, s * 0.016);
        ctx.fill();
      }
    }
    ctx.restore();
  },
});

family({
  id: 'nature.flower.tulip', name: 'Tulip Bed', category: 'nature',
  tags: ['flower', 'tulip', 'bed', 'garden', 'spring'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme }) {
    ctx.save();
    const s = size, t = theme.sprite;
    groundShadow(ctx, 0, s * 0.34, s * 0.34, s * 0.06);
    ctx.fillStyle = withAlpha(theme.terrain.dirt, 0.6);
    roundRect(ctx, -s * 0.4, s * 0.0, s * 0.8, s * 0.3, s * 0.03);
    ctx.fill();
    const cols = [t.flag, t.gold, t.danger, t.white, t.accent];
    const rows = 2, perRow = randInt(rng, 4, 5);
    for (let r = 0; r < rows; r++) {
      const ry = s * 0.06 + r * s * 0.14;
      for (let i = 0; i < perRow; i++) {
        const x = -s * 0.32 + (i + 0.5) * (s * 0.64 / perRow) + jitter(rng, s * 0.02);
        const col = pick(rng, cols);
        ctx.strokeStyle = t.leafDark;
        ctx.lineWidth = Math.max(1, s * 0.014);
        ctx.beginPath();
        ctx.moveTo(x, ry);
        ctx.lineTo(x, ry - s * 0.14);
        ctx.stroke();
        ctx.strokeStyle = t.leaf;
        ctx.lineWidth = Math.max(1, s * 0.02);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, ry - s * 0.02);
        ctx.quadraticCurveTo(x - s * 0.05, ry - s * 0.06, x - s * 0.06, ry - s * 0.12);
        ctx.stroke();
        const fy = ry - s * 0.14, fr = s * 0.04;
        ctx.beginPath();
        ctx.moveTo(x - fr, fy);
        ctx.quadraticCurveTo(x - fr, fy - fr * 1.6, x, fy - fr * 1.2);
        ctx.quadraticCurveTo(x + fr, fy - fr * 1.6, x + fr, fy);
        ctx.quadraticCurveTo(x, fy + fr * 0.6, x - fr, fy);
        ctx.closePath();
        fillStroke(ctx, col, t.ink, Math.max(1, s * 0.01));
        ctx.strokeStyle = darken(col, 0.2);
        ctx.lineWidth = Math.max(1, s * 0.008);
        ctx.beginPath();
        ctx.moveTo(x, fy - fr * 1.1);
        ctx.lineTo(x, fy);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
});

family({
  id: 'nature.flower.meadow', name: 'Flower Meadow', category: 'nature',
  tags: ['flower', 'meadow', 'field', 'bloom', 'grass'], size: 84, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || theme.terrain.grass;
    roundRect(ctx, -s * 0.46, -s * 0.46, s * 0.92, s * 0.92, s * 0.06);
    fillStroke(ctx, main, null);
    ctx.strokeStyle = darken(main, 0.18);
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = Math.max(1, s * 0.01);
    for (let i = 0; i < 60; i++) {
      const x = rand(rng, -s * 0.44, s * 0.44), y = rand(rng, -s * 0.44, s * 0.44);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + jitter(rng, s * 0.02), y - s * 0.04);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const cols = [t.white, t.gold, t.flag, t.accent];
    for (let i = 0; i < randInt(rng, 30, 50); i++) {
      const x = rand(rng, -s * 0.44, s * 0.44), y = rand(rng, -s * 0.44, s * 0.44);
      ctx.fillStyle = pick(rng, cols);
      circle(ctx, x, y, s * rand(rng, 0.012, 0.022));
      ctx.fill();
      ctx.fillStyle = withAlpha(t.gold, 0.8);
      circle(ctx, x, y, s * 0.006);
      ctx.fill();
    }
    ctx.restore();
  },
});

family({
  id: 'nature.fungus.cluster', name: 'Mushroom Cluster', category: 'nature',
  tags: ['mushroom', 'fungus', 'cluster', 'toadstool', 'forest'], size: 60, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.danger;
    groundShadow(ctx, 0, s * 0.32, s * 0.3, s * 0.07);
    const shrooms = [
      { x: 0, y: s * 0.1, sc: 1 },
      { x: -s * 0.18, y: s * 0.16, sc: 0.7 },
      { x: s * 0.16, y: s * 0.18, sc: 0.6 },
    ];
    for (const m of shrooms) {
      const cw = s * 0.2 * m.sc, ch = s * 0.14 * m.sc, sy = m.y;
      roundRect(ctx, m.x - s * 0.04 * m.sc, sy - ch * 0.2, s * 0.08 * m.sc, s * 0.18 * m.sc, s * 0.02);
      fillStroke(ctx, t.cloth, t.ink, Math.max(1, s * 0.012));
      ctx.beginPath();
      ctx.ellipse(m.x, sy - ch * 0.2, cw, ch, 0, Math.PI, 0);
      ctx.closePath();
      fillStroke(ctx, mix(main, t.danger, 0), t.ink, LW(s));
      ctx.fillStyle = t.white;
      for (let k = 0; k < randInt(rng, 3, 5); k++) {
        circle(ctx, m.x + rand(rng, -cw * 0.6, cw * 0.6), sy - ch * 0.2 - rand(rng, 0, ch * 0.7), s * 0.018 * m.sc);
        ctx.fill();
      }
    }
    ctx.restore();
  },
});

family({
  id: 'nature.fungus.toadstool', name: 'Toadstool', category: 'nature',
  tags: ['mushroom', 'toadstool', 'fungus', 'amanita', 'spotted'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.danger;
    groundShadow(ctx, 0, s * 0.36, s * 0.22, s * 0.07);
    roundRect(ctx, -s * 0.08, -s * 0.02, s * 0.16, s * 0.36, s * 0.05);
    fillStroke(ctx, t.white, t.ink, LW(s));
    ctx.fillStyle = withAlpha(t.cloth, 0.8);
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.02, s * 0.14, s * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    softShadow(ctx, theme.sprite.shadow, s * 0.06, s * 0.03);
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.04, s * 0.3, s * 0.22, 0, Math.PI, 0);
    ctx.closePath();
    fillStroke(ctx, main, t.ink, LW(s));
    clearShadow(ctx);
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.04, s * 0.3, s * 0.05, 0, 0, Math.PI);
    ctx.closePath();
    fillStroke(ctx, darken(main, 0.15), null);
    ctx.fillStyle = t.white;
    for (let k = 0; k < randInt(rng, 5, 8); k++) {
      circle(ctx, rand(rng, -s * 0.22, s * 0.22), -s * 0.1 - rand(rng, 0, s * 0.12), s * rand(rng, 0.02, 0.035));
      ctx.fill();
    }
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.ellipse(-s * 0.1, -s * 0.14, s * 0.1, s * 0.06, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, t.white, null);
    ctx.globalAlpha = 1;
    ctx.restore();
  },
});

/* =====================================================================
 * CROPS / AGRICULTURE
 * ===================================================================== */

family({
  id: 'nature.crop.wheat', name: 'Wheat Field', category: 'nature',
  tags: ['crop', 'wheat', 'field', 'farm', 'grain'], size: 88, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.gold;
    roundRect(ctx, -s * 0.46, -s * 0.4, s * 0.92, s * 0.8, s * 0.04);
    fillStroke(ctx, mix(main, t.sand, 0.3), t.ink, LW(s));
    ctx.strokeStyle = darken(main, 0.2);
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = Math.max(1, s * 0.012);
    for (let i = 0; i < 10; i++) {
      const y = -s * 0.38 + i * s * 0.085;
      ctx.beginPath();
      ctx.moveTo(-s * 0.44, y);
      ctx.lineTo(s * 0.44, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = main;
    ctx.lineWidth = Math.max(1, s * 0.014);
    ctx.lineCap = 'round';
    for (let i = 0; i < 70; i++) {
      const x = rand(rng, -s * 0.42, s * 0.42), y = rand(rng, -s * 0.36, s * 0.36);
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.06);
      ctx.lineTo(x + jitter(rng, s * 0.01), y);
      ctx.stroke();
      ctx.fillStyle = lighten(main, 0.2);
      circle(ctx, x + jitter(rng, s * 0.01), y, s * 0.012);
      ctx.fill();
    }
    ctx.restore();
  },
});

family({
  id: 'nature.crop.corn', name: 'Corn Rows', category: 'nature',
  tags: ['crop', 'corn', 'maize', 'farm', 'rows'], size: 80, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    groundShadow(ctx, 0, s * 0.4, s * 0.44, s * 0.05);
    ctx.fillStyle = withAlpha(theme.terrain.dirt, 0.5);
    roundRect(ctx, -s * 0.46, s * 0.1, s * 0.92, s * 0.3, s * 0.03);
    ctx.fill();
    const stalks = randInt(rng, 5, 7);
    for (let i = 0; i < stalks; i++) {
      const x = -s * 0.4 + (i + 0.5) * (s * 0.8 / stalks) + jitter(rng, s * 0.02);
      const h = rand(rng, s * 0.5, s * 0.66);
      ctx.strokeStyle = mix(main, t.leafDark, 0.2);
      ctx.lineWidth = Math.max(1, s * 0.02);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, s * 0.32);
      ctx.lineTo(x + jitter(rng, s * 0.02), s * 0.32 - h);
      ctx.stroke();
      ctx.strokeStyle = main;
      ctx.lineWidth = Math.max(1, s * 0.025);
      for (let k = 0; k < 3; k++) {
        const ly = s * 0.32 - h * (0.3 + k * 0.22);
        const side = k % 2 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(x, ly);
        ctx.quadraticCurveTo(x + side * s * 0.12, ly - s * 0.02, x + side * s * 0.16, ly + s * 0.06);
        ctx.stroke();
      }
      if (chance(rng, 0.7)) {
        roundRect(ctx, x + s * 0.02, s * 0.32 - h * 0.5, s * 0.05, s * 0.12, s * 0.025);
        fillStroke(ctx, t.gold, t.ink, Math.max(1, s * 0.01));
      }
      ctx.strokeStyle = lighten(t.gold, 0.1);
      ctx.lineWidth = Math.max(1, s * 0.01);
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.moveTo(x, s * 0.32 - h);
        ctx.lineTo(x + jitter(rng, s * 0.04), s * 0.32 - h - s * 0.06);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
});

family({
  id: 'nature.crop.vineyard', name: 'Vineyard', category: 'nature',
  tags: ['crop', 'vineyard', 'grapes', 'vines', 'farm'], size: 84, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    groundShadow(ctx, 0, s * 0.4, s * 0.44, s * 0.05);
    const rows = randInt(rng, 2, 3);
    for (let r = 0; r < rows; r++) {
      const ry = -s * 0.1 + r * s * 0.2;
      ctx.strokeStyle = t.woodDark;
      ctx.lineWidth = Math.max(1, s * 0.012);
      ctx.beginPath();
      ctx.moveTo(-s * 0.4, ry);
      ctx.lineTo(s * 0.4, ry);
      ctx.stroke();
      for (let p = 0; p <= 4; p++) {
        const x = -s * 0.4 + p * s * 0.2;
        ctx.beginPath();
        ctx.moveTo(x, ry - s * 0.06);
        ctx.lineTo(x, ry + s * 0.04);
        ctx.stroke();
      }
      for (let i = 0; i < 5; i++) {
        const x = -s * 0.36 + i * s * 0.18 + jitter(rng, s * 0.02);
        blob(ctx, x, ry, s * 0.08, rng, 0.3, 9);
        fillStroke(ctx, mix(main, t.leafDark, rand(rng, 0, 0.4)), null);
        ctx.fillStyle = t.accent;
        for (let k = 0; k < 5; k++) {
          circle(ctx, x + jitter(rng, s * 0.03), ry + s * 0.05 + k * s * 0.018, s * 0.016);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  },
});

family({
  id: 'nature.crop.rice', name: 'Rice Paddy', category: 'nature',
  tags: ['crop', 'rice', 'paddy', 'flooded', 'terrace'], size: 84, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    roundRect(ctx, -s * 0.46, -s * 0.4, s * 0.92, s * 0.8, s * 0.04);
    fillStroke(ctx, withAlpha(theme.terrain.water, 0.85), t.ink, LW(s));
    ctx.strokeStyle = theme.terrain.dirt;
    ctx.lineWidth = Math.max(2, s * 0.03);
    for (let i = 1; i < 3; i++) {
      const y = -s * 0.4 + i * s * 0.8 / 3;
      ctx.beginPath();
      ctx.moveTo(-s * 0.46, y);
      ctx.lineTo(s * 0.46, y);
      ctx.stroke();
    }
    ctx.strokeStyle = withAlpha(t.white, 0.3);
    ctx.lineWidth = Math.max(1, s * 0.01);
    for (let i = 0; i < 6; i++) {
      const y = rand(rng, -s * 0.36, s * 0.36);
      ctx.beginPath();
      ctx.moveTo(rand(rng, -s * 0.4, 0), y);
      ctx.lineTo(rand(rng, 0, s * 0.4), y);
      ctx.stroke();
    }
    for (let gy = 0; gy < 3; gy++) {
      for (let gx = 0; gx < 8; gx++) {
        const x = -s * 0.4 + gx * s * 0.11 + jitter(rng, s * 0.01);
        const y = -s * 0.28 + gy * s * 0.26 + jitter(rng, s * 0.02);
        ctx.strokeStyle = mix(main, t.leafDark, rand(rng, 0, 0.3));
        ctx.lineWidth = Math.max(1, s * 0.012);
        ctx.lineCap = 'round';
        for (let b = 0; b < 3; b++) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + jitter(rng, s * 0.03), y - s * 0.05);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  },
});

family({
  id: 'nature.crop.pumpkin', name: 'Pumpkin Patch', category: 'nature',
  tags: ['crop', 'pumpkin', 'patch', 'harvest', 'autumn'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.fire;
    groundShadow(ctx, 0, s * 0.34, s * 0.4, s * 0.06);
    ctx.strokeStyle = t.leafDark;
    ctx.lineWidth = Math.max(1, s * 0.014);
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(rand(rng, -s * 0.3, 0), rand(rng, -s * 0.2, s * 0.2));
      ctx.quadraticCurveTo(jitter(rng, s * 0.3), rand(rng, -s * 0.2, s * 0.2), rand(rng, 0, s * 0.3), rand(rng, -s * 0.2, s * 0.2));
      ctx.stroke();
    }
    for (let i = 0; i < 6; i++) {
      blob(ctx, rand(rng, -s * 0.34, s * 0.34), rand(rng, -s * 0.2, s * 0.2), s * 0.06, rng, 0.4, 7);
      fillStroke(ctx, mix(t.leaf, t.leafDark, rand(rng, 0, 0.4)), null);
    }
    const n = randInt(rng, 3, 5);
    for (let i = 0; i < n; i++) {
      const x = rand(rng, -s * 0.3, s * 0.3), y = rand(rng, -s * 0.05, s * 0.24), pr = s * rand(rng, 0.09, 0.14);
      for (let k = -1; k <= 1; k++) {
        ctx.beginPath();
        ctx.ellipse(x + k * pr * 0.5, y, pr * 0.4, pr * 0.85, 0, 0, Math.PI * 2);
        ctx.closePath();
        fillStroke(ctx, mix(main, t.gold, 0.2), k === 0 ? t.ink : null, LW(s));
      }
      ctx.beginPath();
      ctx.ellipse(x, y, pr, pr * 0.85, 0, 0, Math.PI * 2);
      ctx.closePath();
      fillStroke(ctx, null, t.ink, LW(s));
      ctx.strokeStyle = t.woodDark;
      ctx.lineWidth = Math.max(1, s * 0.02);
      ctx.beginPath();
      ctx.moveTo(x, y - pr * 0.8);
      ctx.lineTo(x + jitter(rng, s * 0.02), y - pr * 1.05);
      ctx.stroke();
    }
    ctx.restore();
  },
});

/* =====================================================================
 * WATER NATURE / ICE / GEOTHERMAL
 * ===================================================================== */

family({
  id: 'nature.water.lilypad', name: 'Lily Pads', category: 'nature',
  tags: ['water', 'lily', 'pad', 'pond', 'lotus'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    ctx.fillStyle = withAlpha(theme.terrain.water, 0.4);
    ctx.beginPath();
    ctx.ellipse(0, s * 0.0, s * 0.44, s * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    const n = randInt(rng, 3, 5);
    for (let i = 0; i < n; i++) {
      const x = rand(rng, -s * 0.3, s * 0.3), y = rand(rng, -s * 0.22, s * 0.22), pr = s * rand(rng, 0.1, 0.16);
      const notch = rand(rng, 0, Math.PI * 2);
      ctx.beginPath();
      ctx.arc(x, y, pr, notch + 0.4, notch + Math.PI * 2 - 0.4);
      ctx.lineTo(x, y);
      ctx.closePath();
      fillStroke(ctx, mix(main, t.leafDark, rand(rng, 0, 0.3)), t.ink, LW(s));
      ctx.strokeStyle = withAlpha(t.leafDark, 0.5);
      ctx.lineWidth = Math.max(1, s * 0.01);
      for (let k = 0; k < 5; k++) {
        const a = notch + 0.5 + k * (Math.PI * 2 - 1) / 5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * pr * 0.85, y + Math.sin(a) * pr * 0.85);
        ctx.stroke();
      }
    }
    const fx = rand(rng, -s * 0.2, s * 0.2), fy = rand(rng, -s * 0.15, s * 0.1);
    const petalCol = pick(rng, [t.white, t.flag, t.accent]);
    for (let p = 0; p < 8; p++) {
      const a = (p / 8) * Math.PI * 2;
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.05, s * 0.02, s * 0.05, 0, 0, Math.PI * 2);
      ctx.closePath();
      fillStroke(ctx, petalCol, t.ink, Math.max(1, s * 0.008));
      ctx.restore();
    }
    ctx.fillStyle = t.gold;
    circle(ctx, fx, fy, s * 0.025);
    ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'nature.water.coral', name: 'Coral', category: 'nature',
  tags: ['water', 'coral', 'reef', 'ocean', 'sea'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    ctx.fillStyle = withAlpha(theme.terrain.water, 0.4);
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.44, s * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    const cols = [t.danger, t.flag, t.gold, tint || t.accent, t.roof];
    const clumps = randInt(rng, 3, 5);
    for (let c = 0; c < clumps; c++) {
      const ox = rand(rng, -s * 0.28, s * 0.28), oy = rand(rng, -s * 0.2, s * 0.24);
      const col = pick(rng, cols);
      const type = randInt(rng, 0, 2);
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineCap = 'round';
      if (type === 0) {
        ctx.lineWidth = Math.max(1, s * 0.03);
        for (let b = 0; b < randInt(rng, 3, 5); b++) {
          const a = -Math.PI / 2 + jitter(rng, 1);
          const l = rand(rng, s * 0.1, s * 0.18);
          const mx = ox + Math.cos(a) * l * 0.5, my = oy + Math.sin(a) * l * 0.5;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(mx, my);
          ctx.lineTo(mx + jitter(rng, s * 0.06), my - l * 0.5);
          ctx.stroke();
        }
      } else if (type === 1) {
        blob(ctx, ox, oy, s * 0.12, rng, 0.2, 11);
        fillStroke(ctx, col, t.ink, Math.max(1, s * 0.012));
        ctx.strokeStyle = darken(col, 0.2);
        ctx.lineWidth = Math.max(1, s * 0.01);
        for (let k = 0; k < 4; k++) {
          ctx.beginPath();
          ctx.moveTo(ox - s * 0.1, oy - s * 0.04 + k * s * 0.03);
          ctx.quadraticCurveTo(ox, oy - s * 0.06 + k * s * 0.03, ox + s * 0.1, oy - s * 0.04 + k * s * 0.03);
          ctx.stroke();
        }
      } else {
        ctx.lineWidth = Math.max(1, s * 0.018);
        for (let f = -3; f <= 3; f++) {
          ctx.beginPath();
          ctx.moveTo(ox, oy + s * 0.08);
          ctx.quadraticCurveTo(ox + f * s * 0.02, oy, ox + f * s * 0.03, oy - s * 0.12);
          ctx.stroke();
        }
      }
    }
    ctx.fillStyle = withAlpha(t.white, 0.5);
    for (let i = 0; i < randInt(rng, 3, 6); i++) {
      circle(ctx, rand(rng, -s * 0.3, s * 0.3), rand(rng, -s * 0.3, s * 0.2), s * rand(rng, 0.01, 0.02));
      ctx.fill();
    }
    ctx.restore();
  },
});

family({
  id: 'nature.ice.iceberg', name: 'Iceberg', category: 'nature',
  tags: ['ice', 'iceberg', 'arctic', 'frozen', 'cold'], size: 76, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.snow;
    ctx.fillStyle = withAlpha(theme.terrain.waterDeep, 0.5);
    roundRect(ctx, -s * 0.46, s * 0.0, s * 0.92, s * 0.46, s * 0.02);
    ctx.fill();
    ctx.fillStyle = mix(t.snow, theme.terrain.water, 0.5);
    ctx.globalAlpha = 0.5;
    polygonPath(ctx, [{ x: -s * 0.3, y: s * 0.04 }, { x: s * 0.32, y: s * 0.06 }, { x: s * 0.2, y: s * 0.4 }, { x: -s * 0.34, y: s * 0.36 }]);
    ctx.fill();
    ctx.globalAlpha = 1;
    polygonPath(ctx, [{ x: -s * 0.28, y: s * 0.02 }, { x: -s * 0.1, y: -s * 0.34 }, { x: s * 0.08, y: -s * 0.4 }, { x: s * 0.3, y: s * 0.04 }]);
    fillStroke(ctx, main, t.ink, LW(s));
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = mix(t.snow, theme.terrain.water, 0.35);
    polygonPath(ctx, [{ x: s * 0.08, y: -s * 0.4 }, { x: s * 0.3, y: s * 0.04 }, { x: s * 0.04, y: s * 0.02 }]);
    ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = t.white;
    polygonPath(ctx, [{ x: -s * 0.1, y: -s * 0.34 }, { x: -s * 0.28, y: s * 0.02 }, { x: s * 0.0, y: s * 0.0 }]);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = withAlpha(t.white, 0.6);
    ctx.lineWidth = Math.max(1, s * 0.014);
    ctx.beginPath();
    ctx.moveTo(-s * 0.28, s * 0.02);
    ctx.lineTo(s * 0.3, s * 0.04);
    ctx.stroke();
    ctx.restore();
  },
});

family({
  id: 'nature.ice.floe', name: 'Ice Floe', category: 'nature',
  tags: ['ice', 'floe', 'arctic', 'pack', 'frozen'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme }) {
    ctx.save();
    const s = size, t = theme.sprite;
    ctx.fillStyle = withAlpha(theme.terrain.waterDeep, 0.5);
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.46, s * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    const n = randInt(rng, 4, 7);
    for (let i = 0; i < n; i++) {
      const x = rand(rng, -s * 0.3, s * 0.3), y = rand(rng, -s * 0.28, s * 0.28);
      const sides = randInt(rng, 5, 7), r = s * rand(rng, 0.1, 0.18);
      const rr = makeRng(rseed(rng));
      const pts = [];
      for (let k = 0; k < sides; k++) {
        const a = (k / sides) * Math.PI * 2;
        const rad = r * (0.7 + rr() * 0.5);
        pts.push({ x: x + Math.cos(a) * rad, y: y + Math.sin(a) * rad * 0.85 });
      }
      polygonPath(ctx, pts);
      fillStroke(ctx, withAlpha(t.snow, 0.95), t.ink, Math.max(1, s * 0.012));
      ctx.strokeStyle = mix(t.snow, theme.terrain.water, 0.4);
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = Math.max(1, s * 0.008);
      ctx.beginPath();
      ctx.moveTo(x - r * 0.5, y);
      ctx.lineTo(x + r * 0.4, y + jitter(rng, r * 0.3));
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  },
});

family({
  id: 'nature.water.waterfall', name: 'Waterfall', category: 'nature',
  tags: ['water', 'waterfall', 'cascade', 'river', 'falls'], size: 80, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || theme.terrain.water;
    roundRect(ctx, -s * 0.46, -s * 0.46, s * 0.22, s * 0.7, s * 0.04);
    fillStroke(ctx, t.stone, t.ink, LW(s));
    roundRect(ctx, s * 0.24, -s * 0.46, s * 0.22, s * 0.7, s * 0.04);
    fillStroke(ctx, t.stone, t.ink, LW(s));
    ctx.fillStyle = main;
    ctx.globalAlpha = 0.9;
    roundRect(ctx, -s * 0.22, -s * 0.46, s * 0.44, s * 0.7, s * 0.02);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = withAlpha(t.white, 0.7);
    ctx.lineWidth = Math.max(1, s * 0.012);
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const x = rand(rng, -s * 0.2, s * 0.2);
      ctx.beginPath();
      ctx.moveTo(x, -s * 0.44);
      ctx.lineTo(x + jitter(rng, s * 0.01), s * 0.18);
      ctx.stroke();
    }
    ctx.fillStyle = theme.terrain.waterDeep;
    ctx.beginPath();
    ctx.ellipse(0, s * 0.34, s * 0.4, s * 0.12, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, theme.terrain.waterDeep, t.ink, LW(s));
    ctx.fillStyle = withAlpha(t.white, 0.8);
    for (let i = 0; i < randInt(rng, 5, 9); i++) {
      circle(ctx, rand(rng, -s * 0.25, s * 0.25), s * 0.26 + jitter(rng, s * 0.04), s * rand(rng, 0.02, 0.04));
      ctx.fill();
    }
    for (let i = 0; i < 6; i++) {
      circle(ctx, rand(rng, -s * 0.2, s * 0.2), -s * 0.42 + jitter(rng, s * 0.02), s * 0.025);
      ctx.fill();
    }
    ctx.restore();
  },
});

family({
  id: 'nature.geo.geyser', name: 'Geyser', category: 'nature',
  tags: ['geyser', 'water', 'eruption', 'geothermal', 'steam'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.water;
    groundShadow(ctx, 0, s * 0.38, s * 0.3, s * 0.06);
    ctx.beginPath();
    ctx.ellipse(0, s * 0.3, s * 0.28, s * 0.1, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, t.stoneLight, t.ink, LW(s));
    ctx.beginPath();
    ctx.ellipse(0, s * 0.28, s * 0.1, s * 0.04, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, t.stoneDark, t.ink, Math.max(1, s * 0.012));
    ctx.fillStyle = main;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(-s * 0.06, s * 0.28);
    ctx.quadraticCurveTo(-s * 0.14, -s * 0.2, -s * 0.05, -s * 0.42);
    ctx.lineTo(s * 0.05, -s * 0.42);
    ctx.quadraticCurveTo(s * 0.14, -s * 0.2, s * 0.06, s * 0.28);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = withAlpha(t.white, 0.7);
    ctx.lineWidth = Math.max(1, s * 0.012);
    for (let i = 0; i < 5; i++) {
      const x = rand(rng, -s * 0.05, s * 0.05);
      ctx.beginPath();
      ctx.moveTo(x, s * 0.2);
      ctx.lineTo(x + jitter(rng, s * 0.03), -s * 0.4);
      ctx.stroke();
    }
    ctx.fillStyle = main;
    ctx.globalAlpha = 0.8;
    for (let i = 0; i < randInt(rng, 5, 9); i++) {
      circle(ctx, rand(rng, -s * 0.18, s * 0.18), -s * 0.36 + rand(rng, -s * 0.06, s * 0.1), s * rand(rng, 0.012, 0.022));
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = withAlpha(t.white, 0.4);
    for (let i = 0; i < randInt(rng, 3, 5); i++) {
      blob(ctx, jitter(rng, s * 0.1), -s * 0.3 - i * s * 0.04, s * 0.1, rng, 0.4, 9);
      ctx.fill();
    }
    ctx.restore();
  },
});

family({
  id: 'nature.geo.hotspring', name: 'Hot Spring', category: 'nature',
  tags: ['hotspring', 'water', 'geothermal', 'pool', 'steam'], size: 76, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.waterLight;
    groundShadow(ctx, 0, s * 0.34, s * 0.4, s * 0.06);
    const seed = rseed(rng);
    blob(ctx, 0, s * 0.04, s * 0.4, makeRng(seed), 0.18, 14);
    fillStroke(ctx, t.stoneLight, t.ink, LW(s));
    blob(ctx, 0, s * 0.04, s * 0.32, makeRng(seed), 0.18, 14);
    fillStroke(ctx, mix(t.stoneLight, t.sand, 0.4), t.ink, Math.max(1, s * 0.012));
    blob(ctx, 0, s * 0.04, s * 0.26, rng, 0.2, 13);
    fillStroke(ctx, main, t.ink, Math.max(1, s * 0.012));
    blob(ctx, 0, s * 0.06, s * 0.16, rng, 0.25, 11);
    fillStroke(ctx, withAlpha(theme.terrain.water, 0.9), null);
    ctx.strokeStyle = withAlpha(t.white, 0.4);
    ctx.lineWidth = Math.max(1, s * 0.008);
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath();
      ctx.ellipse(0, s * 0.04, s * 0.1 * i, s * 0.05 * i, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = withAlpha(t.white, 0.35);
    for (let i = 0; i < randInt(rng, 3, 5); i++) {
      blob(ctx, rand(rng, -s * 0.15, s * 0.15), -s * 0.1 - i * s * 0.06, s * 0.09, rng, 0.4, 9);
      ctx.fill();
    }
    ctx.restore();
  },
});

family({
  id: 'nature.water.oasis', name: 'Oasis', category: 'nature',
  tags: ['oasis', 'desert', 'palm', 'water', 'pool'], size: 84, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, main = tint || t.leaf;
    ctx.fillStyle = withAlpha(theme.terrain.sand, 0.9);
    blob(ctx, 0, s * 0.1, s * 0.44, rng, 0.15, 14);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, s * 0.16, s * 0.26, s * 0.16, 0, 0, Math.PI * 2);
    ctx.closePath();
    fillStroke(ctx, theme.terrain.water, t.ink, LW(s));
    ctx.fillStyle = withAlpha(t.white, 0.3);
    ctx.beginPath();
    ctx.ellipse(-s * 0.06, s * 0.12, s * 0.1, s * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
    const palms = randInt(rng, 2, 3);
    for (let i = 0; i < palms; i++) {
      const px = (i - (palms - 1) / 2) * s * 0.22 + jitter(rng, s * 0.03);
      const baseY = s * 0.06, lean = jitter(rng, s * 0.08);
      ctx.strokeStyle = t.trunk;
      ctx.lineWidth = Math.max(2, s * 0.05);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(px, baseY);
      ctx.quadraticCurveTo(px + lean, baseY - s * 0.2, px + lean * 1.4, -s * 0.28);
      ctx.stroke();
      const tx = px + lean * 1.4, ty = -s * 0.3;
      for (let f = 0; f < 6; f++) {
        const a = (f / 6) * Math.PI * 2;
        const fl = s * rand(rng, 0.14, 0.2);
        const fc = mix(main, t.leafDark, rand(rng, 0, 0.4));
        const ex = tx + Math.cos(a) * fl, ey = ty + Math.sin(a) * fl * 0.7;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.quadraticCurveTo((tx + ex) / 2 + Math.cos(a + 1.5) * s * 0.04, (ty + ey) / 2 + Math.sin(a + 1.5) * s * 0.04, ex, ey);
        ctx.quadraticCurveTo((tx + ex) / 2 + Math.cos(a - 1.5) * s * 0.04, (ty + ey) / 2 + Math.sin(a - 1.5) * s * 0.04, tx, ty);
        ctx.closePath();
        fillStroke(ctx, fc, t.ink, Math.max(1, s * 0.012));
      }
    }
    ctx.restore();
  },
});
