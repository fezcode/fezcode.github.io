import { family } from './registry';
import {
  makeRng, rand, randInt, pick, chance, jitter,
  mix, darken, lighten, withAlpha,
  roundRect, polygonPath, ngon, star, blob, fillStroke, hatch,
  softShadow, clearShadow, groundShadow,
} from './draw';

// Procedural sprites for the 'modern' category: houses, towers, civic and
// industrial buildings, infrastructure, vehicles, rail, aircraft, boats and
// street furniture. Pure Canvas2D vector drawing — no images or fonts. Sprites
// self-register on import via family({...}). Theme palette colours only.

// ---------------------------------------------------------------------------
// Local helpers (module scope, not exported). Built only on the imported
// toolkit + Canvas2D. Keep every generator tight and consistent.
// ---------------------------------------------------------------------------

function ellipse(ctx, x, y, rx, ry, fill, stroke, lw = 1, rot = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, Math.PI * 2);
  fillStroke(ctx, fill, stroke, lw);
}

function line(ctx, x1, y1, x2, y2, color, lw = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function box(ctx, t, x, y, w, h, fill, lw, rad = 1) {
  roundRect(ctx, x, y, w, h, rad);
  fillStroke(ctx, fill, t.ink, lw);
}

function door(ctx, t, cx, baseY, w, h, col) {
  roundRect(ctx, cx - w / 2, baseY - h, w, h, w * 0.12);
  fillStroke(ctx, col || t.woodDark, t.ink, 1);
  ctx.fillStyle = t.gold;
  const kn = Math.max(1, w * 0.08);
  ctx.fillRect(cx + w * 0.22, baseY - h * 0.55, kn, kn);
}

// mullion grid across a rectangle (window divisions)
function grid(ctx, x, y, w, h, cols, rows, color, lw = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  for (let c = 1; c < cols; c++) {
    const xx = x + (w * c) / cols;
    ctx.beginPath(); ctx.moveTo(xx, y); ctx.lineTo(xx, y + h); ctx.stroke();
  }
  for (let r = 1; r < rows; r++) {
    const yy = y + (h * r) / rows;
    ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke();
  }
}

// individual window cells, some lit
function windows(ctx, x, y, w, h, cols, rows, on, off, rng, p = 0.5, m) {
  const cw = w / cols, ch = h / rows;
  const mm = m ?? Math.min(cw, ch) * 0.22;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      ctx.fillStyle = chance(rng, p) ? on : off;
      ctx.fillRect(x + c * cw + mm, y + r * ch + mm, cw - 2 * mm, ch - 2 * mm);
    }
  }
}

function columns(ctx, t, x, baseY, w, h, n) {
  const gap = w / n;
  ctx.fillStyle = t.stoneLight;
  for (let i = 0; i < n; i++) {
    const cx = x + gap * (i + 0.5);
    ctx.fillRect(cx - gap * 0.16, baseY - h, gap * 0.32, h);
  }
  ctx.strokeStyle = withAlpha(t.ink, 0.35);
  ctx.lineWidth = 1;
  for (let i = 0; i < n; i++) {
    const cx = x + gap * (i + 0.5);
    ctx.strokeRect(cx - gap * 0.16, baseY - h, gap * 0.32, h);
  }
}

// four plan-view tyres straddling a vehicle body half-extent (bw,bl)
function tyres(ctx, bw, bl, color, yFront = -0.58, yRear = 0.58) {
  const ww = bw * 0.34, wl = bl * 0.24;
  ctx.fillStyle = color;
  for (const sy of [yFront, yRear]) {
    for (const sx of [-1, 1]) {
      roundRect(ctx, sx * bw - ww / 2, sy * bl - wl / 2, ww, wl, Math.min(ww, wl) * 0.45);
      ctx.fill();
    }
  }
}

// top-down car body: roof panel + windshield + rear window. Front points to -y.
function carBody(ctx, t, body, bw, bl, opt = {}) {
  const lw = Math.max(1, bw * 0.16);
  const tyre = darken(t.metalDark, 0.35);
  tyres(ctx, bw, bl, tyre, opt.yFront ?? -0.58, opt.yRear ?? 0.58);
  roundRect(ctx, -bw, -bl, bw * 2, bl * 2, bw * (opt.round ?? 0.55));
  fillStroke(ctx, body, t.ink, lw);
  ctx.fillStyle = withAlpha(t.white, 0.16);
  ctx.fillRect(-bw * 0.92, -bl * 0.88, bw * 0.5, bl * 1.76); // sheen
  const rL = opt.roofLen ?? 0.4, rOff = opt.roofOff ?? 0.0;
  const rTop = (rOff - rL) * bl, rBot = (rOff + rL) * bl;
  ctx.fillStyle = withAlpha(t.glass, 0.95);
  polygonPath(ctx, [
    { x: -bw * 0.66, y: rTop }, { x: bw * 0.66, y: rTop },
    { x: bw * 0.5, y: rTop - bl * 0.26 }, { x: -bw * 0.5, y: rTop - bl * 0.26 },
  ]);
  ctx.fill();
  polygonPath(ctx, [
    { x: -bw * 0.6, y: rBot }, { x: bw * 0.6, y: rBot },
    { x: bw * 0.44, y: rBot + bl * 0.2 }, { x: -bw * 0.44, y: rBot + bl * 0.2 },
  ]);
  ctx.fill();
  roundRect(ctx, -bw * 0.82, rTop, bw * 1.64, rBot - rTop, bw * 0.3);
  fillStroke(ctx, opt.roof || lighten(body, 0.1), withAlpha(t.ink, 0.35), Math.max(1, lw * 0.5));
  if (opt.lights !== false) {
    ctx.fillStyle = withAlpha(t.gold, 0.9);
    ctx.fillRect(-bw * 0.7, -bl * 0.98, bw * 0.4, bl * 0.08);
    ctx.fillRect(bw * 0.3, -bl * 0.98, bw * 0.4, bl * 0.08);
  }
}

// soft steam / smoke puffs rising from (cx,cy)
function puffs(ctx, cx, cy, r, color, rng, n = 5, spread = 1) {
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + jitter(rng, 0.8) * spread;
    const d = (i / n) * r * 2.2;
    const px = cx + Math.cos(a) * d + jitter(rng, r * 0.3);
    const py = cy - d * 0.8 - i * r * 0.1;
    const pr = r * (0.5 + (1 - i / n) * 0.7);
    ctx.fillStyle = withAlpha(color, Math.max(0.08, 0.5 - i * 0.06));
    ctx.beginPath();
    ctx.ellipse(px, py, pr, pr * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// concave hyperboloid cooling tower
function coolTower(ctx, t, cx, baseY, w, h, fill, lw) {
  const topW = w * 0.78, waist = w * 0.46, botW = w;
  ctx.beginPath();
  ctx.moveTo(cx - topW / 2, baseY - h);
  ctx.quadraticCurveTo(cx - waist / 2, baseY - h * 0.5, cx - botW / 2, baseY);
  ctx.lineTo(cx + botW / 2, baseY);
  ctx.quadraticCurveTo(cx + waist / 2, baseY - h * 0.5, cx + topW / 2, baseY - h);
  ctx.closePath();
  fillStroke(ctx, fill, t.ink, lw);
  ctx.fillStyle = withAlpha(t.ink, 0.18);
  ellipse(ctx, cx, baseY - h, topW / 2, topW * 0.12, withAlpha(t.ink, 0.18), null);
}

// =====================================================================
// HOUSES
// =====================================================================

family({
  id: 'modern.house.suburban', name: 'Suburban House', category: 'modern',
  tags: ['house', 'home', 'residential', 'suburb', 'gable'], size: 60, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.stoneLight, t.cloth, t.sand, lighten(t.brick, 0.25), t.stone]);
    const base = s * 0.36;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.4, s * 0.07);
    const bw = s * 0.52, bh = s * 0.34, bx = -bw / 2, by = base - bh;
    box(ctx, t, bx, by, bw, bh, wall, lw, s * 0.01);
    polygonPath(ctx, [{ x: bx - s * 0.05, y: by + s * 0.01 }, { x: 0, y: by - s * 0.2 }, { x: bx + bw + s * 0.05, y: by + s * 0.01 }]);
    fillStroke(ctx, t.roof, t.ink, lw);
    ctx.fillStyle = t.brickDark;
    ctx.fillRect(bx + bw * 0.64, by - s * 0.17, s * 0.05, s * 0.13);
    const ww = s * 0.11, wh = s * 0.1;
    for (const wx of [bx + bw * 0.1, bx + bw * 0.62]) {
      roundRect(ctx, wx, by + s * 0.05, ww, wh, s * 0.008);
      fillStroke(ctx, t.glass, t.ink, 1);
      line(ctx, wx + ww / 2, by + s * 0.05, wx + ww / 2, by + s * 0.05 + wh, withAlpha(t.ink, 0.5), 1);
      line(ctx, wx, by + s * 0.05 + wh / 2, wx + ww, by + s * 0.05 + wh / 2, withAlpha(t.ink, 0.5), 1);
    }
    door(ctx, t, bx + bw * 0.4, base, s * 0.1, s * 0.16);
    if (chance(rng, 0.6)) { // garage
      box(ctx, t, bx + bw * 0.62, base - s * 0.14, s * 0.16, s * 0.14, darken(wall, 0.08), lw, s * 0.006);
      grid(ctx, bx + bw * 0.62, base - s * 0.14, s * 0.16, s * 0.14, 1, 3, withAlpha(t.ink, 0.4), 1);
    }
    ctx.restore();
  },
});

family({
  id: 'modern.house.ranch', name: 'Ranch House', category: 'modern',
  tags: ['house', 'home', 'ranch', 'single-story', 'residential'], size: 60, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.brick, t.sand, t.stoneLight, t.cloth]);
    const base = s * 0.32;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.44, s * 0.06);
    const bw = s * 0.7, bh = s * 0.24, bx = -bw / 2, by = base - bh;
    box(ctx, t, bx, by, bw, bh, wall, lw, s * 0.01);
    polygonPath(ctx, [{ x: bx - s * 0.05, y: by + s * 0.005 }, { x: bx + s * 0.08, y: by - s * 0.12 }, { x: bx + bw - s * 0.08, y: by - s * 0.12 }, { x: bx + bw + s * 0.05, y: by + s * 0.005 }]);
    fillStroke(ctx, t.roof, t.ink, lw);
    ctx.fillStyle = t.glass;
    for (let i = 0; i < 4; i++) {
      const wx = bx + bw * (0.08 + i * 0.21);
      roundRect(ctx, wx, by + s * 0.05, s * 0.1, s * 0.1, s * 0.006);
      fillStroke(ctx, t.glass, t.ink, 1);
    }
    door(ctx, t, bx + bw * 0.5, base, s * 0.1, s * 0.16);
    ctx.restore();
  },
});

family({
  id: 'modern.house.cube', name: 'Modern Cube House', category: 'modern',
  tags: ['house', 'modern', 'cube', 'minimal', 'flat-roof'], size: 60, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.white, t.stoneLight, t.stone, t.cloth]);
    const base = s * 0.36;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.36, s * 0.06);
    const bw = s * 0.46, bh = s * 0.46, bx = -bw / 2, by = base - bh;
    box(ctx, t, bx, by, bw, bh, wall, lw, s * 0.01);
    // upper offset block
    box(ctx, t, bx + bw * 0.5, by - s * 0.1, bw * 0.55, s * 0.12, darken(wall, 0.08), lw, s * 0.006);
    // big glass panel
    box(ctx, t, bx + bw * 0.08, by + bh * 0.12, bw * 0.42, bh * 0.7, t.glass, lw, s * 0.006);
    grid(ctx, bx + bw * 0.08, by + bh * 0.12, bw * 0.42, bh * 0.7, 2, 3, withAlpha(t.ink, 0.4), 1);
    // accent door slab
    box(ctx, t, bx + bw * 0.62, base - s * 0.18, bw * 0.22, s * 0.18, t.woodDark, lw, s * 0.004);
    ctx.fillStyle = withAlpha(t.white, 0.18);
    ctx.fillRect(bx, by, bw * 0.16, bh);
    ctx.restore();
  },
});

family({
  id: 'modern.house.mansion', name: 'Mansion', category: 'modern',
  tags: ['house', 'mansion', 'luxury', 'estate', 'residential'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.stoneLight, t.cloth, t.sand, t.white]);
    const base = s * 0.38;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.46, s * 0.06);
    const bw = s * 0.7, bh = s * 0.32, bx = -bw / 2, by = base - bh;
    // wings
    box(ctx, t, bx, by + s * 0.04, bw, bh - s * 0.04, wall, lw, s * 0.008);
    polygonPath(ctx, [{ x: bx - s * 0.03, y: by + s * 0.05 }, { x: bx + s * 0.04, y: by - s * 0.06 }, { x: bx + bw - s * 0.04, y: by - s * 0.06 }, { x: bx + bw + s * 0.03, y: by + s * 0.05 }]);
    fillStroke(ctx, t.roof, t.ink, lw);
    // central portico
    box(ctx, t, -s * 0.16, by - s * 0.06, s * 0.32, bh + s * 0.06, lighten(wall, 0.06), lw, s * 0.006);
    polygonPath(ctx, [{ x: -s * 0.2, y: by - s * 0.05 }, { x: 0, y: by - s * 0.2 }, { x: s * 0.2, y: by - s * 0.05 }]);
    fillStroke(ctx, t.roofDark, t.ink, lw);
    columns(ctx, t, -s * 0.15, base, s * 0.3, bh, 4);
    // windows
    ctx.fillStyle = t.glass;
    for (let i = 0; i < 6; i++) {
      const wx = bx + bw * (0.06 + i * 0.16);
      if (Math.abs(wx) < s * 0.18) continue;
      roundRect(ctx, wx, by + s * 0.06, s * 0.07, s * 0.1, s * 0.02);
      fillStroke(ctx, t.glass, t.ink, 1);
      roundRect(ctx, wx, by + s * 0.18, s * 0.07, s * 0.1, s * 0.02);
      fillStroke(ctx, t.glass, t.ink, 1);
    }
    door(ctx, t, 0, base, s * 0.11, s * 0.18, t.gold);
    ctx.restore();
  },
});

family({
  id: 'modern.house.townhouse', name: 'Townhouse Row', category: 'modern',
  tags: ['house', 'townhouse', 'row', 'terrace', 'residential'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const base = s * 0.4, n = randInt(rng, 3, 4);
    groundShadow(ctx, 0, base + s * 0.03, s * 0.46, s * 0.06);
    const total = s * 0.82, uw = total / n, bx0 = -total / 2;
    const palette = [t.brick, t.stoneLight, t.cloth, t.sand, lighten(t.brick, 0.2), t.roofDark];
    for (let i = 0; i < n; i++) {
      const bx = bx0 + i * uw;
      const bh = s * (0.36 + (i % 2) * 0.04);
      const by = base - bh;
      const wall = tint || palette[(i + randInt(rng, 0, 5)) % palette.length];
      box(ctx, t, bx, by, uw - 1, bh, wall, lw, s * 0.006);
      // flat or gable roof cap
      ctx.fillStyle = t.roofDark;
      ctx.fillRect(bx, by - s * 0.03, uw - 1, s * 0.04);
      // windows
      ctx.fillStyle = t.glass;
      for (let r = 0; r < 2; r++) {
        roundRect(ctx, bx + uw * 0.2, by + s * 0.05 + r * s * 0.13, uw * 0.55, s * 0.09, s * 0.006);
        fillStroke(ctx, t.glass, t.ink, 1);
      }
      door(ctx, t, bx + uw * 0.5, base, uw * 0.32, s * 0.14);
    }
    ctx.restore();
  },
});

family({
  id: 'modern.house.bungalow', name: 'Bungalow', category: 'modern',
  tags: ['house', 'bungalow', 'cottage', 'porch', 'residential'], size: 58, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.cloth, t.sand, t.stoneLight, lighten(t.leaf, 0.3)]);
    const base = s * 0.34;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.4, s * 0.06);
    const bw = s * 0.56, bh = s * 0.26, bx = -bw / 2, by = base - bh;
    box(ctx, t, bx, by, bw, bh, wall, lw, s * 0.008);
    // wide low hip roof
    polygonPath(ctx, [{ x: bx - s * 0.08, y: by + s * 0.01 }, { x: bx + s * 0.12, y: by - s * 0.16 }, { x: bx + bw - s * 0.12, y: by - s * 0.16 }, { x: bx + bw + s * 0.08, y: by + s * 0.01 }]);
    fillStroke(ctx, t.roof, t.ink, lw);
    // porch posts
    ctx.strokeStyle = t.ink; ctx.lineWidth = Math.max(1, s * 0.014);
    for (const px of [bx + s * 0.04, bx + bw - s * 0.04]) line(ctx, px, by + s * 0.02, px, base, t.woodDark, Math.max(1, s * 0.016));
    ctx.fillStyle = t.glass;
    roundRect(ctx, bx + bw * 0.16, by + s * 0.06, s * 0.12, s * 0.1, s * 0.006);
    fillStroke(ctx, t.glass, t.ink, 1);
    door(ctx, t, bx + bw * 0.66, base, s * 0.1, s * 0.14);
    ctx.restore();
  },
});

// =====================================================================
// TOWERS / APARTMENTS / OFFICES
// =====================================================================

family({
  id: 'modern.tower.apartment', name: 'Apartment Block', category: 'modern',
  tags: ['apartment', 'block', 'residential', 'flats', 'city'], size: 74, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.stone, t.brick, t.stoneLight, t.cloth]);
    groundShadow(ctx, 0, s * 0.42, s * 0.32, s * 0.06);
    const w = s * 0.56, h = s * 0.74, x = -w / 2, y = -s * 0.36;
    box(ctx, t, x, y, w, h, wall, lw, s * 0.01);
    ctx.fillStyle = withAlpha(t.white, 0.14);
    ctx.fillRect(x, y, w * 0.16, h);
    const cols = randInt(rng, 4, 5), rows = randInt(rng, 5, 7);
    windows(ctx, x + w * 0.06, y + h * 0.05, w * 0.88, h * 0.82, cols, rows,
      lighten(t.gold, 0.1), mix(t.glass, t.ink, 0.4), rng, 0.45);
    // balcony rails
    ctx.strokeStyle = withAlpha(t.ink, 0.5); ctx.lineWidth = 1;
    for (let r = 1; r < rows; r++) {
      const yy = y + h * 0.05 + (h * 0.82 * r) / rows;
      line(ctx, x + w * 0.06, yy, x + w * 0.94, yy, withAlpha(t.ink, 0.4), 1);
    }
    ctx.fillStyle = t.metalDark;
    ctx.fillRect(-w * 0.08, y - s * 0.05, w * 0.16, s * 0.05);
    ctx.restore();
  },
});

family({
  id: 'modern.tower.condo', name: 'Condo Tower', category: 'modern',
  tags: ['condo', 'tower', 'residential', 'highrise', 'city'], size: 84, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, body = tint || pick(rng, [t.stoneLight, t.glass, t.stone]);
    groundShadow(ctx, 0, s * 0.44, s * 0.28, s * 0.06);
    const w = s * 0.4, h = s * 0.84, x = -w / 2, y = -s * 0.42;
    box(ctx, t, x, y, w, h, body, Math.max(1, s * 0.02), s * 0.02);
    ctx.fillStyle = withAlpha(t.white, 0.16);
    ctx.fillRect(x, y, w * 0.18, h);
    // stacked balcony slabs
    const floors = randInt(rng, 9, 13);
    for (let f = 1; f < floors; f++) {
      const yy = y + (h * f) / floors;
      ctx.fillStyle = withAlpha(t.ink, 0.18);
      ctx.fillRect(x - w * 0.05, yy, w * 1.1, Math.max(1, s * 0.012));
    }
    windows(ctx, x + w * 0.08, y + h * 0.02, w * 0.84, h * 0.96, 3, floors,
      mix(t.glass, t.waterLight, 0.4), mix(t.glass, t.ink, 0.35), rng, 0.5);
    ctx.fillStyle = t.metalDark;
    ctx.fillRect(-w * 0.06, y - s * 0.04, w * 0.12, s * 0.04);
    ctx.restore();
  },
});

family({
  id: 'modern.tower.glass', name: 'Glass Tower', category: 'modern',
  tags: ['skyscraper', 'office', 'tower', 'glass', 'city'], size: 88, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, body = tint || t.glass;
    groundShadow(ctx, 0, s * 0.44, s * 0.28, s * 0.07);
    const w = s * 0.36, h = s * 0.86, top = -s * 0.43;
    roundRect(ctx, -w / 2, top, w, h, s * 0.02);
    fillStroke(ctx, body, t.ink, Math.max(1, s * 0.02));
    ctx.fillStyle = withAlpha(t.white, 0.2);
    ctx.fillRect(-w / 2, top, w * 0.32, h);
    ctx.strokeStyle = withAlpha(darken(body, 0.4), 0.7); ctx.lineWidth = 1;
    const cols = randInt(rng, 3, 5), rows = randInt(rng, 9, 14);
    grid(ctx, -w / 2, top, w, h, cols, rows, withAlpha(darken(body, 0.4), 0.7), 1);
    ctx.fillStyle = t.metalDark;
    ctx.fillRect(-w * 0.06, top - s * 0.06, w * 0.12, s * 0.06);
    ctx.fillStyle = t.danger;
    ctx.fillRect(-Math.max(1, s * 0.008), top - s * 0.1, Math.max(2, s * 0.016), s * 0.04);
    ctx.restore();
  },
});

family({
  id: 'modern.tower.artdeco', name: 'Art-Deco Skyscraper', category: 'modern',
  tags: ['skyscraper', 'artdeco', 'tower', 'spire', 'city'], size: 92, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, body = tint || pick(rng, [t.stoneLight, t.stone, t.sand]);
    groundShadow(ctx, 0, s * 0.45, s * 0.26, s * 0.06);
    const lw = Math.max(1, s * 0.018);
    const base = s * 0.45;
    // setbacks
    const tiers = [[0.4, 0.36], [0.3, 0.22], [0.2, 0.16]];
    let y = base;
    for (const [w, h] of tiers) {
      const ww = s * w, hh = s * h;
      box(ctx, t, -ww / 2, y - hh, ww, hh, body, lw, s * 0.004);
      ctx.fillStyle = withAlpha(t.white, 0.14);
      ctx.fillRect(-ww / 2, y - hh, ww * 0.18, hh);
      // vertical pilaster lines
      ctx.strokeStyle = withAlpha(t.ink, 0.45); ctx.lineWidth = 1;
      const c = Math.round(ww / (s * 0.05));
      for (let i = 1; i < c; i++) { const xx = -ww / 2 + (ww * i) / c; line(ctx, xx, y - hh + s * 0.01, xx, y - s * 0.005, withAlpha(t.ink, 0.4), 1); }
      y -= hh;
    }
    // crown + spire
    polygonPath(ctx, [{ x: -s * 0.06, y: y }, { x: 0, y: y - s * 0.06 }, { x: s * 0.06, y: y }]);
    fillStroke(ctx, t.gold, t.ink, lw);
    line(ctx, 0, y - s * 0.05, 0, y - s * 0.16, t.metalDark, Math.max(1, s * 0.01));
    ctx.fillStyle = t.danger;
    ctx.beginPath(); ctx.arc(0, y - s * 0.16, Math.max(1, s * 0.012), 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'modern.tower.stepped', name: 'Stepped Tower', category: 'modern',
  tags: ['skyscraper', 'stepped', 'ziggurat', 'tower', 'city'], size: 88, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, body = tint || pick(rng, [t.stone, t.metal, t.stoneLight]);
    groundShadow(ctx, 0, s * 0.45, s * 0.28, s * 0.06);
    const lw = Math.max(1, s * 0.018);
    let y = s * 0.45, w = s * 0.5;
    const steps = randInt(rng, 3, 4);
    for (let i = 0; i < steps; i++) {
      const hh = s * (0.18 - i * 0.01);
      box(ctx, t, -w / 2, y - hh, w, hh, i % 2 ? darken(body, 0.06) : body, lw, s * 0.004);
      windows(ctx, -w / 2 + w * 0.08, y - hh + hh * 0.12, w * 0.84, hh * 0.72,
        Math.max(3, Math.round(w / (s * 0.07))), 3, lighten(t.gold, 0.1), mix(t.glass, t.ink, 0.4), rng, 0.4);
      y -= hh;
      w *= 0.74;
    }
    ctx.fillStyle = t.metalDark;
    ctx.fillRect(-w * 0.2, y - s * 0.05, w * 0.4, s * 0.05);
    ctx.restore();
  },
});

family({
  id: 'modern.tower.office', name: 'Office Tower', category: 'modern',
  tags: ['office', 'tower', 'highrise', 'business', 'city'], size: 84, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, body = tint || pick(rng, [t.metal, t.stone, t.stoneDark]);
    groundShadow(ctx, 0, s * 0.44, s * 0.3, s * 0.06);
    const w = s * 0.46, h = s * 0.82, x = -w / 2, y = -s * 0.4;
    box(ctx, t, x, y, w, h, body, Math.max(1, s * 0.02), s * 0.01);
    // horizontal glass bands
    const bands = randInt(rng, 8, 11);
    for (let i = 0; i < bands; i++) {
      const by = y + h * 0.04 + (h * 0.9 * i) / bands;
      ctx.fillStyle = mix(t.glass, t.waterDark, 0.2);
      ctx.fillRect(x + w * 0.06, by, w * 0.88, (h * 0.9) / bands * 0.62);
    }
    ctx.fillStyle = withAlpha(t.white, 0.18);
    ctx.fillRect(x, y, w * 0.14, h);
    fillStroke(ctx, null, t.ink, Math.max(1, s * 0.02));
    box(ctx, t, x, y, w, h, null, Math.max(1, s * 0.02), s * 0.01);
    ctx.fillStyle = t.metalDark;
    ctx.fillRect(-w * 0.22, y - s * 0.04, w * 0.16, s * 0.04);
    ctx.fillRect(w * 0.06, y - s * 0.05, w * 0.1, s * 0.05);
    ctx.restore();
  },
});

// =====================================================================
// INDUSTRY
// =====================================================================

family({
  id: 'modern.industry.factory', name: 'Factory', category: 'modern',
  tags: ['factory', 'industry', 'chimney', 'plant', 'sawtooth'], size: 76, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.brick, t.stoneDark, t.metal]);
    const base = s * 0.4;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.46, s * 0.06);
    const chx = -s * 0.32, chTop = -s * 0.36;
    puffs(ctx, chx, chTop, s * 0.05, t.stoneDark, rng, 6, 0.7);
    box(ctx, t, chx - s * 0.035, chTop, s * 0.07, base - chTop, t.brickDark, lw, s * 0.004);
    ctx.fillStyle = t.white; ctx.fillRect(chx - s * 0.035, chTop + s * 0.02, s * 0.07, s * 0.02);
    const bw = s * 0.56, bh = s * 0.3, bx = -s * 0.12, by = base - bh;
    box(ctx, t, bx, by, bw, bh, wall, lw, s * 0.006);
    const teeth = 4, tw = bw / teeth;
    for (let i = 0; i < teeth; i++) {
      ctx.fillStyle = t.metalDark;
      polygonPath(ctx, [
        { x: bx + i * tw, y: by }, { x: bx + i * tw, y: by - s * 0.08 },
        { x: bx + (i + 1) * tw, y: by },
      ]);
      fillStroke(ctx, t.metalDark, t.ink, 1);
      polygonPath(ctx, [
        { x: bx + i * tw + tw * 0.1, y: by - s * 0.005 }, { x: bx + i * tw + tw * 0.1, y: by - s * 0.06 },
        { x: bx + i * tw + tw * 0.5, y: by - s * 0.01 },
      ]);
      fillStroke(ctx, withAlpha(t.glass, 0.8), null);
    }
    for (let i = 0; i < 3; i++) box(ctx, t, bx + bw * (0.1 + i * 0.3), base - s * 0.16, bw * 0.2, s * 0.16, darken(wall, 0.16), 1, s * 0.004);
    ctx.restore();
  },
});

family({
  id: 'modern.industry.warehouse', name: 'Warehouse', category: 'modern',
  tags: ['warehouse', 'industry', 'storage', 'depot', 'logistics'], size: 74, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.metal, t.stoneLight, t.stone]);
    const base = s * 0.38;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.48, s * 0.06);
    const bw = s * 0.82, bh = s * 0.34, bx = -bw / 2, by = base - bh;
    box(ctx, t, bx, by, bw, bh, wall, lw, s * 0.006);
    polygonPath(ctx, [{ x: bx - s * 0.02, y: by + s * 0.005 }, { x: 0, y: by - s * 0.1 }, { x: bx + bw + s * 0.02, y: by + s * 0.005 }]);
    fillStroke(ctx, t.metalDark, t.ink, lw);
    ctx.strokeStyle = withAlpha(t.ink, 0.18); ctx.lineWidth = 1;
    for (let i = 1; i < 10; i++) { const xx = bx + (bw * i) / 10; line(ctx, xx, by + s * 0.02, xx, base - s * 0.005, withAlpha(t.ink, 0.18), 1); }
    for (let i = 0; i < 4; i++) {
      const dx = bx + bw * (0.08 + i * 0.22);
      box(ctx, t, dx, base - s * 0.18, bw * 0.16, s * 0.18, darken(wall, 0.16), 1, s * 0.004);
      grid(ctx, dx, base - s * 0.18, bw * 0.16, s * 0.18, 1, 4, withAlpha(t.ink, 0.4), 1);
    }
    ctx.restore();
  },
});

family({
  id: 'modern.industry.powerplant', name: 'Power Plant', category: 'modern',
  tags: ['power', 'plant', 'cooling-tower', 'energy', 'industry'], size: 88, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.018);
    const body = tint || t.stoneLight;
    const base = s * 0.42;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.48, s * 0.06);
    for (const cx of [-s * 0.22, s * 0.06]) puffs(ctx, cx, -s * 0.34, s * 0.06, t.white, rng, 6, 0.6);
    coolTower(ctx, t, -s * 0.22, base, s * 0.26, s * 0.42, body, lw);
    coolTower(ctx, t, s * 0.06, base, s * 0.24, s * 0.4, body, lw);
    box(ctx, t, s * 0.2, base - s * 0.26, s * 0.24, s * 0.26, t.metal, lw, s * 0.004);
    grid(ctx, s * 0.2, base - s * 0.26, s * 0.24, s * 0.26, 4, 3, withAlpha(t.ink, 0.3), 1);
    box(ctx, t, s * 0.36, base - s * 0.4, s * 0.05, s * 0.4, t.brickDark, lw, s * 0.004);
    ctx.fillStyle = t.danger; ctx.fillRect(s * 0.36, base - s * 0.4, s * 0.05, s * 0.02);
    ctx.restore();
  },
});

// =====================================================================
// SHOPS / COMMERCIAL
// =====================================================================

family({
  id: 'modern.shop.mall', name: 'Shopping Mall', category: 'modern',
  tags: ['mall', 'shopping', 'retail', 'commercial', 'atrium'], size: 84, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.stoneLight, t.stone, t.sand]);
    const base = s * 0.38;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.48, s * 0.06);
    const bw = s * 0.84, bh = s * 0.4, bx = -bw / 2, by = base - bh;
    box(ctx, t, bx, by, bw, bh, wall, lw, s * 0.008);
    ctx.fillStyle = t.glass;
    ctx.beginPath(); ctx.ellipse(0, by, s * 0.16, s * 0.16, 0, Math.PI, 0); ctx.closePath();
    fillStroke(ctx, t.glass, t.ink, lw);
    grid(ctx, -s * 0.16, by - s * 0.16, s * 0.32, s * 0.16, 5, 2, withAlpha(t.ink, 0.4), 1);
    ctx.fillStyle = t.accent; ctx.fillRect(bx, by + s * 0.02, bw, s * 0.06);
    ctx.fillStyle = withAlpha(t.white, 0.85);
    for (let i = 0; i < 8; i++) ctx.fillRect(bx + bw * (0.08 + i * 0.1), by + s * 0.04, bw * 0.05, s * 0.022);
    box(ctx, t, bx + bw * 0.04, base - s * 0.2, bw * 0.92, s * 0.2, t.glass, 1, s * 0.004);
    grid(ctx, bx + bw * 0.04, base - s * 0.2, bw * 0.92, s * 0.2, 10, 2, withAlpha(t.ink, 0.35), 1);
    box(ctx, t, -s * 0.08, base - s * 0.2, s * 0.16, s * 0.2, t.metalDark, lw, s * 0.004);
    ctx.restore();
  },
});

family({
  id: 'modern.shop.bigbox', name: 'Big-Box Store', category: 'modern',
  tags: ['store', 'bigbox', 'retail', 'supermarket', 'commercial'], size: 80, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.stoneLight, t.cloth, t.metal]);
    const accent = pick(rng, [t.accent, t.danger, t.gold, t.leaf]);
    const base = s * 0.36;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.46, s * 0.06);
    const bw = s * 0.8, bh = s * 0.3, bx = -bw / 2, by = base - bh;
    box(ctx, t, bx, by, bw, bh, wall, lw, s * 0.004);
    ctx.fillStyle = accent; ctx.fillRect(bx, by, bw, s * 0.07);
    ctx.fillStyle = withAlpha(t.white, 0.9);
    ctx.fillRect(bx + bw * 0.06, by + s * 0.018, bw * 0.34, s * 0.034);
    ctx.beginPath(); ctx.arc(bx + bw * 0.78, by + s * 0.035, s * 0.026, 0, Math.PI * 2);
    ctx.fillStyle = t.white; ctx.fill();
    box(ctx, t, bx + bw * 0.06, base - s * 0.16, bw * 0.88, s * 0.16, t.glass, 1, s * 0.004);
    grid(ctx, bx + bw * 0.06, base - s * 0.16, bw * 0.88, s * 0.16, 8, 1, withAlpha(t.ink, 0.35), 1);
    box(ctx, t, -s * 0.1, base - s * 0.16, s * 0.2, s * 0.16, t.metalDark, lw, s * 0.004);
    ctx.restore();
  },
});

family({
  id: 'modern.shop.gas', name: 'Gas Station', category: 'modern',
  tags: ['gas', 'petrol', 'fuel', 'station', 'canopy'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const canopy = tint || pick(rng, [t.danger, t.accent, t.gold, t.leaf]);
    const base = s * 0.4;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.46, s * 0.06);
    box(ctx, t, s * 0.04, base - s * 0.26, s * 0.32, s * 0.26, t.stoneLight, lw, s * 0.006);
    box(ctx, t, s * 0.04, base - s * 0.26, s * 0.32, s * 0.12, t.glass, 1, s * 0.004);
    ctx.fillStyle = t.metal;
    for (const px of [-s * 0.34, -s * 0.04]) ctx.fillRect(px - s * 0.015, base - s * 0.3, s * 0.03, s * 0.3);
    box(ctx, t, -s * 0.42, base - s * 0.4, s * 0.46, s * 0.1, canopy, lw, s * 0.01);
    ctx.fillStyle = withAlpha(t.white, 0.85); ctx.fillRect(-s * 0.42, base - s * 0.33, s * 0.46, s * 0.025);
    for (const px of [-s * 0.28, -s * 0.12]) {
      ctx.fillStyle = t.metalDark; ctx.fillRect(px, base - s * 0.14, s * 0.04, s * 0.14);
      ctx.fillStyle = t.danger; ctx.fillRect(px, base - s * 0.14, s * 0.04, s * 0.03);
    }
    line(ctx, s * 0.42, base, s * 0.42, base - s * 0.34, t.metal, Math.max(1, s * 0.02));
    box(ctx, t, s * 0.34, base - s * 0.4, s * 0.16, s * 0.1, t.white, 1, s * 0.006);
    ctx.fillStyle = t.danger; ctx.fillRect(s * 0.36, base - s * 0.37, s * 0.12, s * 0.015);
    ctx.fillStyle = t.ink; ctx.fillRect(s * 0.36, base - s * 0.34, s * 0.12, s * 0.012);
    ctx.restore();
  },
});

// =====================================================================
// CIVIC
// =====================================================================

family({
  id: 'modern.civic.hospital', name: 'Hospital', category: 'modern',
  tags: ['hospital', 'health', 'medical', 'clinic', 'civic'], size: 80, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || t.white;
    const base = s * 0.42;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.46, s * 0.06);
    const bw = s * 0.6, bh = s * 0.62, bx = -bw / 2, by = base - bh;
    box(ctx, t, bx, by, bw, bh, wall, lw, s * 0.008);
    windows(ctx, bx + bw * 0.08, by + s * 0.06, bw * 0.84, bh * 0.7, 5, 6,
      mix(t.glass, t.waterLight, 0.3), mix(t.glass, t.ink, 0.3), rng, 0.5);
    // red cross sign
    const cs = s * 0.06, cy = by - s * 0.02;
    ctx.fillStyle = t.danger;
    ctx.fillRect(-cs * 0.32, cy - cs, cs * 0.64, cs * 2);
    ctx.fillRect(-cs, cy - cs * 0.32, cs * 2, cs * 0.64);
    // entrance canopy + ambulance bay
    box(ctx, t, -s * 0.12, base - s * 0.14, s * 0.24, s * 0.14, t.glass, lw, s * 0.004);
    ctx.fillStyle = t.accent; ctx.fillRect(-s * 0.16, base - s * 0.16, s * 0.32, s * 0.03);
    ctx.restore();
  },
});

family({
  id: 'modern.civic.school', name: 'School', category: 'modern',
  tags: ['school', 'education', 'civic', 'classroom', 'flag'], size: 76, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.brick, t.stoneLight, t.cloth]);
    const base = s * 0.4;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.48, s * 0.06);
    const bw = s * 0.74, bh = s * 0.36, bx = -bw / 2, by = base - bh;
    box(ctx, t, bx, by, bw, bh, wall, lw, s * 0.006);
    // central bell tower
    box(ctx, t, -s * 0.08, by - s * 0.16, s * 0.16, s * 0.16, darken(wall, 0.05), lw, s * 0.004);
    polygonPath(ctx, [{ x: -s * 0.1, y: by - s * 0.15 }, { x: 0, y: by - s * 0.28 }, { x: s * 0.1, y: by - s * 0.15 }]);
    fillStroke(ctx, t.roof, t.ink, lw);
    // clock
    ctx.beginPath(); ctx.arc(0, by - s * 0.08, s * 0.04, 0, Math.PI * 2);
    fillStroke(ctx, t.white, t.ink, 1);
    line(ctx, 0, by - s * 0.08, 0, by - s * 0.11, t.ink, 1);
    line(ctx, 0, by - s * 0.08, s * 0.025, by - s * 0.08, t.ink, 1);
    windows(ctx, bx + bw * 0.06, by + s * 0.06, bw * 0.88, bh * 0.6, 7, 2,
      lighten(t.gold, 0.1), mix(t.glass, t.ink, 0.3), rng, 0.4);
    door(ctx, t, 0, base, s * 0.1, s * 0.16);
    // flagpole
    line(ctx, bx + s * 0.04, base, bx + s * 0.04, by - s * 0.06, t.metal, Math.max(1, s * 0.012));
    ctx.fillStyle = t.flag;
    polygonPath(ctx, [{ x: bx + s * 0.04, y: by - s * 0.06 }, { x: bx + s * 0.12, y: by - s * 0.04 }, { x: bx + s * 0.04, y: by - s * 0.02 }]);
    ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'modern.civic.university', name: 'University Hall', category: 'modern',
  tags: ['university', 'college', 'hall', 'dome', 'civic'], size: 80, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.stoneLight, t.sand, t.stone]);
    const base = s * 0.42;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.48, s * 0.06);
    const bw = s * 0.78, bh = s * 0.3, bx = -bw / 2, by = base - bh;
    box(ctx, t, bx, by, bw, bh, wall, lw, s * 0.006);
    // central block + dome
    box(ctx, t, -s * 0.18, by - s * 0.12, s * 0.36, s * 0.12, lighten(wall, 0.04), lw, s * 0.004);
    ctx.beginPath(); ctx.ellipse(0, by - s * 0.12, s * 0.14, s * 0.14, 0, Math.PI, 0); ctx.closePath();
    fillStroke(ctx, t.metal, t.ink, lw);
    line(ctx, 0, by - s * 0.26, 0, by - s * 0.32, t.gold, Math.max(1, s * 0.012));
    ctx.fillStyle = t.gold; ctx.beginPath(); ctx.arc(0, by - s * 0.33, s * 0.02, 0, Math.PI * 2); ctx.fill();
    // portico columns + pediment
    polygonPath(ctx, [{ x: -s * 0.2, y: by + s * 0.005 }, { x: 0, y: by - s * 0.08 }, { x: s * 0.2, y: by + s * 0.005 }]);
    fillStroke(ctx, lighten(wall, 0.06), t.ink, lw);
    columns(ctx, t, -s * 0.18, base, s * 0.36, bh, 5);
    // wing windows
    ctx.fillStyle = t.glass;
    for (const wx of [bx + bw * 0.06, bx + bw * 0.16, bx + bw * 0.74, bx + bw * 0.84]) {
      roundRect(ctx, wx, by + s * 0.06, s * 0.06, s * 0.14, s * 0.02);
      fillStroke(ctx, t.glass, t.ink, 1);
    }
    ctx.restore();
  },
});

family({
  id: 'modern.civic.church', name: 'Modern Church', category: 'modern',
  tags: ['church', 'chapel', 'religion', 'a-frame', 'civic'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.stoneLight, t.white, t.cloth]);
    const base = s * 0.42;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.4, s * 0.06);
    // A-frame
    polygonPath(ctx, [{ x: -s * 0.26, y: base }, { x: 0, y: -s * 0.42 }, { x: s * 0.26, y: base }]);
    fillStroke(ctx, wall, t.ink, lw);
    ctx.fillStyle = withAlpha(t.ink, 0.12);
    polygonPath(ctx, [{ x: -s * 0.26, y: base }, { x: 0, y: -s * 0.42 }, { x: -s * 0.02, y: -s * 0.42 }, { x: -s * 0.22, y: base }]);
    ctx.fill();
    // tall stained glass front
    polygonPath(ctx, [{ x: -s * 0.07, y: base - s * 0.02 }, { x: 0, y: -s * 0.2 }, { x: s * 0.07, y: base - s * 0.02 }]);
    fillStroke(ctx, mix(t.glass, t.accent, 0.3), t.ink, 1);
    line(ctx, 0, -s * 0.2, 0, base - s * 0.02, withAlpha(t.ink, 0.4), 1);
    // cross at apex
    line(ctx, 0, -s * 0.42, 0, -s * 0.54, t.gold, Math.max(2, s * 0.02));
    line(ctx, -s * 0.04, -s * 0.49, s * 0.04, -s * 0.49, t.gold, Math.max(2, s * 0.02));
    // side wing
    box(ctx, t, s * 0.2, base - s * 0.2, s * 0.18, s * 0.2, wall, lw, s * 0.004);
    ctx.restore();
  },
});

family({
  id: 'modern.civic.museum', name: 'Museum', category: 'modern',
  tags: ['museum', 'gallery', 'classical', 'columns', 'civic'], size: 80, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.stoneLight, t.sand, t.white]);
    const base = s * 0.42;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.48, s * 0.06);
    // steps
    ctx.fillStyle = darken(wall, 0.1);
    for (let i = 0; i < 3; i++) ctx.fillRect(-s * 0.4 + i * s * 0.03, base - i * s * 0.025, s * 0.8 - i * s * 0.06, s * 0.025);
    const baseY = base - s * 0.06;
    // entablature + columns
    box(ctx, t, -s * 0.36, baseY - s * 0.28, s * 0.72, s * 0.06, wall, lw, s * 0.004);
    columns(ctx, t, -s * 0.34, baseY, s * 0.68, s * 0.22, 7);
    // pediment
    polygonPath(ctx, [{ x: -s * 0.4, y: baseY - s * 0.27 }, { x: 0, y: baseY - s * 0.44 }, { x: s * 0.4, y: baseY - s * 0.27 }]);
    fillStroke(ctx, lighten(wall, 0.04), t.ink, lw);
    ctx.fillStyle = withAlpha(t.ink, 0.2);
    ctx.beginPath(); ctx.arc(0, baseY - s * 0.33, s * 0.03, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'modern.civic.firestation', name: 'Fire Station', category: 'modern',
  tags: ['fire', 'station', 'firehouse', 'emergency', 'civic'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.brick, t.danger, t.brickDark]);
    const base = s * 0.4;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.46, s * 0.06);
    const bw = s * 0.7, bh = s * 0.4, bx = -bw / 2, by = base - bh;
    box(ctx, t, bx, by, bw, bh, wall, lw, s * 0.006);
    // hose drying tower
    box(ctx, t, bx + bw * 0.82, by - s * 0.14, s * 0.1, bh + s * 0.14, darken(wall, 0.08), lw, s * 0.004);
    // sign band
    ctx.fillStyle = t.white; ctx.fillRect(bx, by + s * 0.01, bw * 0.78, s * 0.05);
    ctx.fillStyle = t.danger;
    for (let i = 0; i < 5; i++) ctx.fillRect(bx + bw * (0.06 + i * 0.14), by + s * 0.022, bw * 0.08, s * 0.026);
    // big garage doors
    for (let i = 0; i < 2; i++) {
      const dx = bx + bw * (0.08 + i * 0.36);
      box(ctx, t, dx, base - s * 0.22, bw * 0.3, s * 0.22, t.glass, 1, s * 0.004);
      grid(ctx, dx, base - s * 0.22, bw * 0.3, s * 0.22, 3, 4, withAlpha(t.ink, 0.4), 1);
    }
    ctx.restore();
  },
});

family({
  id: 'modern.civic.police', name: 'Police Station', category: 'modern',
  tags: ['police', 'station', 'law', 'emergency', 'civic'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const wall = tint || pick(rng, [t.stone, t.stoneDark, t.metal]);
    const base = s * 0.4;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.46, s * 0.06);
    const bw = s * 0.66, bh = s * 0.46, bx = -bw / 2, by = base - bh;
    box(ctx, t, bx, by, bw, bh, wall, lw, s * 0.006);
    windows(ctx, bx + bw * 0.08, by + s * 0.08, bw * 0.84, bh * 0.62, 5, 4,
      mix(t.glass, t.waterDark, 0.2), mix(t.glass, t.ink, 0.3), rng, 0.4);
    // sign band (blue)
    ctx.fillStyle = t.accent; ctx.fillRect(bx, by + s * 0.01, bw, s * 0.05);
    ctx.fillStyle = withAlpha(t.white, 0.9); ctx.fillRect(bx + bw * 0.3, by + s * 0.022, bw * 0.4, s * 0.026);
    // shield badge
    ctx.fillStyle = t.gold;
    polygonPath(ctx, [{ x: 0, y: by - s * 0.12 }, { x: s * 0.05, y: by - s * 0.1 }, { x: s * 0.05, y: by - s * 0.03 }, { x: 0, y: by + s * 0.01 }, { x: -s * 0.05, y: by - s * 0.03 }, { x: -s * 0.05, y: by - s * 0.1 }]);
    fillStroke(ctx, t.gold, t.ink, 1);
    // entrance + lamp globes
    box(ctx, t, -s * 0.1, base - s * 0.18, s * 0.2, s * 0.18, t.metalDark, lw, s * 0.004);
    ctx.fillStyle = t.accent;
    ctx.beginPath(); ctx.arc(-s * 0.12, base - s * 0.18, s * 0.02, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.12, base - s * 0.18, s * 0.02, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

// =====================================================================
// SPORT
// =====================================================================

family({
  id: 'modern.sport.stadium', name: 'Stadium', category: 'modern',
  tags: ['stadium', 'sport', 'arena', 'football', 'field'], size: 92, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const body = tint || pick(rng, [t.metal, t.stoneLight, t.stone]);
    groundShadow(ctx, 0, s * 0.06, s * 0.46, s * 0.34);
    // outer roof ring
    ellipse(ctx, 0, 0, s * 0.45, s * 0.33, body, t.ink, lw);
    // seating bowl
    ellipse(ctx, 0, 0, s * 0.39, s * 0.27, t.stoneDark, withAlpha(t.ink, 0.5), 1);
    ctx.save();
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.39, s * 0.27, 0, 0, Math.PI * 2); ctx.clip();
    hatch(ctx, -s * 0.45, -s * 0.33, s * 0.9, s * 0.66, s * 0.04, 0, withAlpha(t.ink, 0.25), 1);
    ctx.restore();
    // pitch
    ellipse(ctx, 0, 0, s * 0.26, s * 0.16, t.grass, withAlpha(t.white, 0.6), 1);
    ctx.save();
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.26, s * 0.16, 0, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = t.grassDark;
    for (let i = 0; i < 6; i += 2) ctx.fillRect(-s * 0.26 + i * s * 0.09, -s * 0.16, s * 0.09, s * 0.32);
    ctx.restore();
    ctx.strokeStyle = withAlpha(t.white, 0.8); ctx.lineWidth = Math.max(1, s * 0.01);
    line(ctx, 0, -s * 0.16, 0, s * 0.16, withAlpha(t.white, 0.8), Math.max(1, s * 0.01));
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.05, s * 0.04, 0, 0, Math.PI * 2); ctx.stroke();
    // floodlights
    ctx.fillStyle = t.gold;
    for (const a of [0.7, 2.4, 3.85, 5.55]) {
      const lx = Math.cos(a) * s * 0.42, ly = Math.sin(a) * s * 0.3;
      ctx.beginPath(); ctx.arc(lx, ly, s * 0.022, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
});

family({
  id: 'modern.sport.arena', name: 'Arena', category: 'modern',
  tags: ['arena', 'dome', 'sport', 'concert', 'venue'], size: 84, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const body = tint || pick(rng, [t.metal, t.stoneLight, t.glass]);
    const base = s * 0.36;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.46, s * 0.06);
    // cylindrical base
    box(ctx, t, -s * 0.42, base - s * 0.24, s * 0.84, s * 0.24, t.stone, lw, s * 0.02);
    // dome
    ctx.beginPath(); ctx.ellipse(0, base - s * 0.24, s * 0.42, s * 0.26, 0, Math.PI, 0); ctx.closePath();
    fillStroke(ctx, body, t.ink, lw);
    ctx.strokeStyle = withAlpha(t.ink, 0.3); ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) { const a = Math.PI + (Math.PI * i) / 6; line(ctx, 0, base - s * 0.24, Math.cos(a) * s * 0.42, base - s * 0.24 + Math.sin(a) * s * 0.26, withAlpha(t.ink, 0.25), 1); }
    ctx.beginPath(); ctx.ellipse(0, base - s * 0.24, s * 0.28, s * 0.16, 0, Math.PI, 0); ctx.stroke();
    // marquee
    ctx.fillStyle = t.accent; ctx.fillRect(-s * 0.42, base - s * 0.18, s * 0.84, s * 0.05);
    ctx.fillStyle = withAlpha(t.gold, 0.9);
    for (let i = 0; i < 9; i++) ctx.fillRect(-s * 0.4 + i * s * 0.09, base - s * 0.165, s * 0.05, s * 0.02);
    // entrances
    ctx.fillStyle = t.glass;
    for (const ex of [-s * 0.28, -s * 0.04, s * 0.2]) { roundRect(ctx, ex, base - s * 0.1, s * 0.12, s * 0.1, s * 0.01); fillStroke(ctx, t.glass, t.ink, 1); }
    ctx.restore();
  },
});

// =====================================================================
// PARKING
// =====================================================================

family({
  id: 'modern.park.garage', name: 'Parking Garage', category: 'modern',
  tags: ['parking', 'garage', 'multistorey', 'car-park', 'structure'], size: 76, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const body = tint || pick(rng, [t.stone, t.stoneDark, t.metal]);
    const base = s * 0.42;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.44, s * 0.06);
    const bw = s * 0.66, bx = -bw / 2, top = -s * 0.4, h = base - top;
    box(ctx, t, bx, top, bw, h, body, lw, s * 0.004);
    const decks = 4, dh = h / decks;
    const carCols = [t.danger, t.accent, t.gold, t.leaf, t.metalDark, t.white];
    for (let d = 0; d < decks; d++) {
      const dy = top + d * dh;
      // open deck slab
      ctx.fillStyle = withAlpha(t.ink, 0.25); ctx.fillRect(bx, dy + dh - s * 0.02, bw, s * 0.02);
      // parked cars (small rects) on the open level
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = pick(rng, carCols);
        ctx.fillRect(bx + bw * (0.08 + i * 0.22), dy + dh * 0.34, bw * 0.14, dh * 0.42);
      }
    }
    // P sign
    ctx.fillStyle = t.accent; roundRect(ctx, bx + bw + s * 0.0, top, s * 0.12, s * 0.12, s * 0.02); fillStroke(ctx, t.accent, t.ink, 1);
    ctx.fillStyle = t.white; ctx.fillRect(bx + bw + s * 0.04, top + s * 0.02, s * 0.015, s * 0.08);
    ctx.fillRect(bx + bw + s * 0.04, top + s * 0.02, s * 0.04, s * 0.04);
    ctx.restore();
  },
});

family({
  id: 'modern.park.lot', name: 'Parking Lot', category: 'modern',
  tags: ['parking', 'lot', 'car-park', 'asphalt', 'plan'], size: 80, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const asphalt = tint || mix(t.stoneDark, t.ink, 0.25);
    groundShadow(ctx, 0, s * 0.04, s * 0.44, s * 0.34);
    box(ctx, t, -s * 0.42, -s * 0.34, s * 0.84, s * 0.68, asphalt, lw, s * 0.02);
    // stall lines
    ctx.strokeStyle = withAlpha(t.white, 0.7); ctx.lineWidth = Math.max(1, s * 0.012);
    const cols = 5;
    for (let row = 0; row < 2; row++) {
      const ry = row === 0 ? -s * 0.3 : s * 0.04;
      for (let c = 0; c <= cols; c++) { const cx = -s * 0.34 + c * (s * 0.68 / cols); line(ctx, cx, ry, cx, ry + s * 0.26, withAlpha(t.white, 0.7), Math.max(1, s * 0.01)); }
    }
    // a few parked cars
    const carCols = [t.danger, t.accent, t.gold, t.leaf, t.white, t.metalDark];
    for (let row = 0; row < 2; row++) {
      const ry = row === 0 ? -s * 0.3 : s * 0.04;
      for (let c = 0; c < cols; c++) {
        if (chance(rng, 0.45)) continue;
        ctx.fillStyle = pick(rng, carCols);
        roundRect(ctx, -s * 0.32 + c * (s * 0.68 / cols), ry + s * 0.03, s * 0.68 / cols - s * 0.03, s * 0.2, s * 0.02);
        fillStroke(ctx, pick(rng, carCols), withAlpha(t.ink, 0.5), 1);
      }
    }
    // drive lane line
    ctx.setLineDash([s * 0.04, s * 0.03]);
    line(ctx, -s * 0.4, -s * 0.02, s * 0.4, -s * 0.02, withAlpha(t.gold, 0.7), Math.max(1, s * 0.012));
    ctx.setLineDash([]);
    ctx.restore();
  },
});

// =====================================================================
// INFRASTRUCTURE
// =====================================================================

family({
  id: 'modern.infra.solar', name: 'Solar Panel Array', category: 'modern',
  tags: ['solar', 'panel', 'energy', 'renewable', 'array'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.016);
    const panel = tint || mix(t.accent, t.ink, 0.35);
    const base = s * 0.34;
    groundShadow(ctx, 0, base + s * 0.04, s * 0.44, s * 0.07);
    const rows = randInt(rng, 2, 3);
    for (let r = 0; r < rows; r++) {
      const py = base - r * s * 0.2;
      for (let cc = 0; cc < 3; cc++) {
        const px = -s * 0.36 + cc * s * 0.26;
        // tilted panel (parallelogram)
        polygonPath(ctx, [
          { x: px, y: py }, { x: px + s * 0.2, y: py },
          { x: px + s * 0.24, y: py - s * 0.12 }, { x: px + s * 0.04, y: py - s * 0.12 },
        ]);
        fillStroke(ctx, panel, t.ink, lw);
        // cells grid
        ctx.strokeStyle = withAlpha(t.waterLight, 0.5); ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) line(ctx, px + s * 0.04 + i * s * 0.05, py - s * 0.12, px + i * s * 0.05, py, withAlpha(t.waterLight, 0.45), 1);
        line(ctx, px + s * 0.02, py - s * 0.06, px + s * 0.22, py - s * 0.06, withAlpha(t.waterLight, 0.45), 1);
        // support legs
        line(ctx, px + s * 0.04, py, px + s * 0.04, py + s * 0.04, t.metalDark, Math.max(1, s * 0.01));
        line(ctx, px + s * 0.18, py, px + s * 0.18, py + s * 0.04, t.metalDark, Math.max(1, s * 0.01));
        // sheen
        ctx.fillStyle = withAlpha(t.white, 0.16);
        polygonPath(ctx, [{ x: px + s * 0.04, y: py - s * 0.12 }, { x: px + s * 0.1, y: py - s * 0.12 }, { x: px + s * 0.04, y: py }]);
        ctx.fill();
      }
    }
    ctx.restore();
  },
});

family({
  id: 'modern.infra.windturbine', name: 'Wind Turbine', category: 'modern',
  tags: ['wind', 'turbine', 'energy', 'renewable', 'blades'], size: 84, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.016);
    const body = tint || t.white;
    const base = s * 0.44, hubY = -s * 0.18;
    groundShadow(ctx, 0, base, s * 0.16, s * 0.04);
    // tapered tower
    polygonPath(ctx, [{ x: -s * 0.035, y: base }, { x: -s * 0.012, y: hubY }, { x: s * 0.012, y: hubY }, { x: s * 0.035, y: base }]);
    fillStroke(ctx, body, t.ink, lw);
    // nacelle
    roundRect(ctx, -s * 0.05, hubY - s * 0.02, s * 0.09, s * 0.04, s * 0.01);
    fillStroke(ctx, lighten(t.metal, 0.1), t.ink, 1);
    // 3 blades
    const phase = rand(rng, 0, Math.PI * 2);
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.translate(-s * 0.02, hubY);
      ctx.rotate(phase + (i * Math.PI * 2) / 3);
      ctx.fillStyle = body;
      polygonPath(ctx, [{ x: 0, y: -s * 0.012 }, { x: 0, y: s * 0.012 }, { x: s * 0.34, y: s * 0.004 }, { x: s * 0.34, y: -s * 0.002 }]);
      fillStroke(ctx, body, withAlpha(t.ink, 0.6), 1);
      ctx.restore();
    }
    ctx.fillStyle = t.metalDark;
    ctx.beginPath(); ctx.arc(-s * 0.02, hubY, s * 0.018, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'modern.infra.celltower', name: 'Cell Tower', category: 'modern',
  tags: ['cell', 'tower', 'antenna', 'mast', 'telecom'], size: 80, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.014);
    const body = tint || t.metal;
    const base = s * 0.44, topY = -s * 0.34;
    groundShadow(ctx, 0, base, s * 0.18, s * 0.04);
    // lattice triangle
    const bw = s * 0.18, tw = s * 0.05;
    line(ctx, -bw / 2, base, -tw / 2, topY, body, Math.max(1, s * 0.016));
    line(ctx, bw / 2, base, tw / 2, topY, body, Math.max(1, s * 0.016));
    // cross braces
    ctx.strokeStyle = withAlpha(body, 0.9); ctx.lineWidth = Math.max(1, s * 0.008);
    const steps = 7;
    for (let i = 0; i < steps; i++) {
      const f0 = i / steps, f1 = (i + 1) / steps;
      const lx0 = -bw / 2 + (bw - tw) / 2 * f0, rx0 = bw / 2 - (bw - tw) / 2 * f0;
      const lx1 = -bw / 2 + (bw - tw) / 2 * f1, rx1 = bw / 2 - (bw - tw) / 2 * f1;
      const y0 = base + (topY - base) * f0, y1 = base + (topY - base) * f1;
      line(ctx, lx0, y0, rx1, y1, withAlpha(body, 0.8), Math.max(1, s * 0.006));
      line(ctx, rx0, y0, lx1, y1, withAlpha(body, 0.8), Math.max(1, s * 0.006));
      line(ctx, lx0, y0, rx0, y0, withAlpha(body, 0.8), Math.max(1, s * 0.006));
    }
    // antennas
    ctx.fillStyle = t.stoneLight;
    for (const a of [0, 2.1, 4.2]) { const ax = Math.cos(a) * s * 0.05; ctx.fillRect(ax - s * 0.012, topY - s * 0.04, s * 0.024, s * 0.07); }
    // microwave drum
    ctx.beginPath(); ctx.arc(s * 0.06, topY + s * 0.06, s * 0.035, 0, Math.PI * 2);
    fillStroke(ctx, t.white, t.ink, 1);
    ctx.fillStyle = t.danger; ctx.beginPath(); ctx.arc(0, topY - s * 0.04, s * 0.012, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'modern.infra.watertower', name: 'Water Tower', category: 'modern',
  tags: ['water', 'tower', 'tank', 'utility', 'infrastructure'], size: 76, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.018);
    const body = tint || pick(rng, [t.metal, t.stoneLight, t.accent]);
    const base = s * 0.44, tankY = -s * 0.12;
    groundShadow(ctx, 0, base, s * 0.2, s * 0.04);
    // splayed legs
    for (const sx of [-1, 1]) {
      line(ctx, sx * s * 0.04, tankY + s * 0.04, sx * s * 0.18, base, t.metalDark, Math.max(1, s * 0.014));
      line(ctx, sx * s * 0.12, tankY + s * 0.04, sx * s * 0.06, base, t.metalDark, Math.max(1, s * 0.012));
    }
    // cross brace
    line(ctx, -s * 0.12, base - s * 0.12, s * 0.12, base - s * 0.12, t.metalDark, Math.max(1, s * 0.008));
    line(ctx, -s * 0.16, base - s * 0.02, s * 0.16, base - s * 0.02, t.metalDark, Math.max(1, s * 0.008));
    // tank (rounded cylinder)
    roundRect(ctx, -s * 0.16, tankY - s * 0.14, s * 0.32, s * 0.2, s * 0.06);
    fillStroke(ctx, body, t.ink, lw);
    // conical roof
    polygonPath(ctx, [{ x: -s * 0.16, y: tankY - s * 0.13 }, { x: 0, y: tankY - s * 0.24 }, { x: s * 0.16, y: tankY - s * 0.13 }]);
    fillStroke(ctx, darken(body, 0.1), t.ink, lw);
    ctx.fillStyle = withAlpha(t.white, 0.18); ctx.fillRect(-s * 0.16, tankY - s * 0.14, s * 0.06, s * 0.2);
    ctx.restore();
  },
});

family({
  id: 'modern.infra.radiomast', name: 'Radio Mast', category: 'modern',
  tags: ['radio', 'mast', 'antenna', 'broadcast', 'guyed'], size: 88, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || t.danger;
    const base = s * 0.46, topY = -s * 0.44;
    groundShadow(ctx, 0, base, s * 0.1, s * 0.03);
    // guy wires
    ctx.strokeStyle = withAlpha(t.ink, 0.4); ctx.lineWidth = 1;
    for (const gx of [-s * 0.34, s * 0.34]) { line(ctx, 0, topY + s * 0.1, gx, base, withAlpha(t.ink, 0.4), 1); line(ctx, 0, topY + s * 0.3, gx * 0.6, base, withAlpha(t.ink, 0.4), 1); }
    // banded mast
    const segs = 8, mw = s * 0.03;
    for (let i = 0; i < segs; i++) {
      const y0 = base + (topY - base) * (i / segs);
      const y1 = base + (topY - base) * ((i + 1) / segs);
      ctx.fillStyle = i % 2 ? body : t.white;
      ctx.fillRect(-mw / 2, y1, mw, y0 - y1);
    }
    ctx.strokeStyle = t.ink; ctx.lineWidth = Math.max(1, s * 0.006);
    ctx.strokeRect(-mw / 2, topY, mw, base - topY);
    // top light + dishes
    ctx.fillStyle = t.fire; ctx.beginPath(); ctx.arc(0, topY - s * 0.02, s * 0.018, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = t.metalDark;
    ctx.fillRect(mw / 2, topY + s * 0.16, s * 0.06, s * 0.014);
    ctx.fillRect(-mw / 2 - s * 0.06, topY + s * 0.26, s * 0.06, s * 0.014);
    ctx.restore();
  },
});

family({
  id: 'modern.infra.billboard', name: 'Billboard', category: 'modern',
  tags: ['billboard', 'sign', 'advertising', 'hoarding', 'street'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite, lw = Math.max(1, s * 0.02);
    const face = tint || pick(rng, [t.accent, t.danger, t.gold, t.leaf, t.waterLight]);
    const base = s * 0.44;
    groundShadow(ctx, 0, base, s * 0.24, s * 0.04);
    // posts
    ctx.fillStyle = t.metalDark;
    for (const px of [-s * 0.18, s * 0.18]) ctx.fillRect(px - s * 0.018, -s * 0.1, s * 0.036, base + s * 0.1);
    ctx.strokeStyle = withAlpha(t.ink, 0.4); ctx.lineWidth = 1;
    line(ctx, -s * 0.18, base - s * 0.12, s * 0.18, -s * 0.04, withAlpha(t.ink, 0.3), 1);
    // board
    const bw = s * 0.7, bh = s * 0.32, bx = -bw / 2, by = -s * 0.34;
    box(ctx, t, bx, by, bw, bh, face, lw, s * 0.01);
    // simple graphic
    ctx.fillStyle = withAlpha(t.white, 0.85); ctx.fillRect(bx + bw * 0.08, by + bh * 0.2, bw * 0.4, bh * 0.24);
    ctx.fillStyle = withAlpha(t.ink, 0.5); ctx.fillRect(bx + bw * 0.08, by + bh * 0.56, bw * 0.6, bh * 0.16);
    ctx.beginPath(); ctx.arc(bx + bw * 0.78, by + bh * 0.4, bh * 0.22, 0, Math.PI * 2); ctx.fillStyle = withAlpha(t.white, 0.85); ctx.fill();
    // flood lights
    ctx.fillStyle = t.gold;
    for (const lx of [bx + bw * 0.25, bx + bw * 0.6]) { ctx.fillRect(lx, by - s * 0.04, s * 0.05, s * 0.02); }
    ctx.restore();
  },
});

// =====================================================================
// VEHICLES (top-down plan view, front toward -y)
// =====================================================================

family({
  id: 'modern.car.sedan', name: 'Sedan', category: 'modern',
  tags: ['car', 'sedan', 'vehicle', 'auto', 'topdown'], size: 48, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.danger, t.accent, t.gold, t.metal, t.white, t.leaf]);
    groundShadow(ctx, s * 0.04, s * 0.04, s * 0.22, s * 0.4);
    carBody(ctx, t, body, s * 0.17, s * 0.36, { roofLen: 0.34 });
    ctx.restore();
  },
});

family({
  id: 'modern.car.suv', name: 'SUV', category: 'modern',
  tags: ['car', 'suv', 'vehicle', '4x4', 'topdown'], size: 50, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.metalDark, t.stoneDark, t.danger, t.accent, t.leafDark, t.white]);
    groundShadow(ctx, s * 0.04, s * 0.04, s * 0.24, s * 0.42);
    carBody(ctx, t, body, s * 0.2, s * 0.36, { roofLen: 0.5, roof: body, round: 0.4 });
    // roof rails
    ctx.strokeStyle = withAlpha(t.ink, 0.5); ctx.lineWidth = Math.max(1, s * 0.02);
    line(ctx, -s * 0.12, -s * 0.16, -s * 0.12, s * 0.16, withAlpha(t.ink, 0.5), Math.max(1, s * 0.016));
    line(ctx, s * 0.12, -s * 0.16, s * 0.12, s * 0.16, withAlpha(t.ink, 0.5), Math.max(1, s * 0.016));
    ctx.restore();
  },
});

family({
  id: 'modern.car.hatchback', name: 'Hatchback', category: 'modern',
  tags: ['car', 'hatchback', 'compact', 'vehicle', 'topdown'], size: 46, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.accent, t.gold, t.danger, t.leaf, t.white, t.waterLight]);
    groundShadow(ctx, s * 0.04, s * 0.04, s * 0.22, s * 0.36);
    carBody(ctx, t, body, s * 0.18, s * 0.32, { roofLen: 0.38, roofOff: 0.1 });
    ctx.restore();
  },
});

family({
  id: 'modern.car.pickup', name: 'Pickup Truck', category: 'modern',
  tags: ['truck', 'pickup', 'vehicle', 'utility', 'topdown'], size: 52, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.metalDark, t.danger, t.stoneDark, t.leafDark, t.white]);
    const bw = s * 0.19, bl = s * 0.38;
    groundShadow(ctx, s * 0.04, s * 0.04, s * 0.24, s * 0.42);
    tyres(ctx, bw, bl, darken(t.metalDark, 0.35));
    roundRect(ctx, -bw, -bl, bw * 2, bl * 2, bw * 0.4);
    fillStroke(ctx, body, t.ink, Math.max(1, bw * 0.16));
    // cab (front half)
    roundRect(ctx, -bw * 0.82, -bl * 0.85, bw * 1.64, bl * 0.7, bw * 0.3);
    fillStroke(ctx, lighten(body, 0.08), withAlpha(t.ink, 0.4), 1);
    ctx.fillStyle = withAlpha(t.glass, 0.95);
    ctx.fillRect(-bw * 0.66, -bl * 0.84, bw * 1.32, bl * 0.28);
    // bed (rear half)
    ctx.fillStyle = darken(body, 0.18);
    roundRect(ctx, -bw * 0.84, -bl * 0.05, bw * 1.68, bl * 0.92, bw * 0.18);
    fillStroke(ctx, darken(body, 0.2), withAlpha(t.ink, 0.5), 1);
    ctx.fillStyle = withAlpha(t.gold, 0.9);
    ctx.fillRect(-bw * 0.7, -bl * 0.98, bw * 0.4, bl * 0.07); ctx.fillRect(bw * 0.3, -bl * 0.98, bw * 0.4, bl * 0.07);
    ctx.restore();
  },
});

family({
  id: 'modern.car.taxi', name: 'Taxi', category: 'modern',
  tags: ['car', 'taxi', 'cab', 'vehicle', 'topdown'], size: 48, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || t.gold;
    groundShadow(ctx, s * 0.04, s * 0.04, s * 0.22, s * 0.4);
    carBody(ctx, t, body, s * 0.17, s * 0.36, { roofLen: 0.34 });
    // checker band
    const bw = s * 0.17;
    for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? t.ink : t.white; ctx.fillRect(-bw + i * (bw * 2 / 6), -s * 0.02, bw * 2 / 6, s * 0.03); }
    // roof sign
    ctx.fillStyle = t.ink; roundRect(ctx, -s * 0.04, -s * 0.04, s * 0.08, s * 0.04, s * 0.01); fillStroke(ctx, t.gold, t.ink, 1);
    ctx.restore();
  },
});

family({
  id: 'modern.car.police', name: 'Police Car', category: 'modern',
  tags: ['car', 'police', 'patrol', 'emergency', 'topdown'], size: 50, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || t.white;
    const bw = s * 0.18, bl = s * 0.37;
    groundShadow(ctx, s * 0.04, s * 0.04, s * 0.24, s * 0.42);
    carBody(ctx, t, body, bw, bl, { roofLen: 0.34, roof: t.metalDark });
    // dark door panels
    ctx.fillStyle = mix(t.metalDark, t.ink, 0.4);
    ctx.fillRect(-bw * 0.98, -bl * 0.1, bw * 0.28, bl * 0.5);
    ctx.fillRect(bw * 0.7, -bl * 0.1, bw * 0.28, bl * 0.5);
    // light bar
    roundRect(ctx, -bw * 0.5, -bl * 0.06, bw, bl * 0.12, bl * 0.04);
    fillStroke(ctx, null, t.ink, 1);
    ctx.fillStyle = t.danger; ctx.fillRect(-bw * 0.5, -bl * 0.05, bw * 0.5, bl * 0.1);
    ctx.fillStyle = t.accent; ctx.fillRect(0, -bl * 0.05, bw * 0.5, bl * 0.1);
    ctx.restore();
  },
});

family({
  id: 'modern.car.ambulance', name: 'Ambulance', category: 'modern',
  tags: ['ambulance', 'emergency', 'medical', 'vehicle', 'topdown'], size: 54, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || t.white;
    const bw = s * 0.2, bl = s * 0.42;
    groundShadow(ctx, s * 0.04, s * 0.04, s * 0.26, s * 0.46);
    tyres(ctx, bw, bl, darken(t.metalDark, 0.35));
    roundRect(ctx, -bw, -bl, bw * 2, bl * 2, bw * 0.22);
    fillStroke(ctx, body, t.ink, Math.max(1, bw * 0.14));
    // cab windshield
    ctx.fillStyle = withAlpha(t.glass, 0.95); ctx.fillRect(-bw * 0.7, -bl * 0.92, bw * 1.4, bl * 0.22);
    // red cross
    const cs = bw * 0.4;
    ctx.fillStyle = t.danger;
    ctx.fillRect(-cs * 0.3, -cs, cs * 0.6, cs * 2); ctx.fillRect(-cs, -cs * 0.3, cs * 2, cs * 0.6);
    // stripe
    ctx.fillStyle = t.danger; ctx.fillRect(-bw, bl * 0.5, bw * 2, bl * 0.12);
    // light bar
    ctx.fillStyle = t.accent; ctx.fillRect(-bw * 0.4, -bl * 0.74, bw * 0.8, bl * 0.06);
    ctx.restore();
  },
});

family({
  id: 'modern.car.firetruck', name: 'Fire Truck', category: 'modern',
  tags: ['firetruck', 'engine', 'emergency', 'ladder', 'topdown'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || t.danger;
    const bw = s * 0.2, bl = s * 0.46;
    groundShadow(ctx, s * 0.04, s * 0.04, s * 0.26, s * 0.48);
    tyres(ctx, bw, bl, darken(t.metalDark, 0.35), -0.66, 0.62);
    roundRect(ctx, -bw, -bl, bw * 2, bl * 2, bw * 0.18);
    fillStroke(ctx, body, t.ink, Math.max(1, bw * 0.14));
    // cab
    roundRect(ctx, -bw * 0.9, -bl * 0.95, bw * 1.8, bl * 0.46, bw * 0.18);
    fillStroke(ctx, darken(body, 0.08), withAlpha(t.ink, 0.5), 1);
    ctx.fillStyle = withAlpha(t.glass, 0.95); ctx.fillRect(-bw * 0.66, -bl * 0.92, bw * 1.32, bl * 0.2);
    // ladder along roof
    ctx.fillStyle = t.metal; ctx.fillRect(-bw * 0.18, -bl * 0.4, bw * 0.36, bl * 1.3);
    ctx.strokeStyle = withAlpha(t.ink, 0.5); ctx.lineWidth = 1;
    for (let i = 0; i < 9; i++) { const yy = -bl * 0.38 + i * bl * 0.14; line(ctx, -bw * 0.18, yy, bw * 0.18, yy, withAlpha(t.ink, 0.5), 1); }
    // equipment lockers
    ctx.fillStyle = withAlpha(t.white, 0.7); ctx.fillRect(-bw * 0.95, bl * 0.1, bw * 0.2, bl * 0.5); ctx.fillRect(bw * 0.75, bl * 0.1, bw * 0.2, bl * 0.5);
    ctx.fillStyle = t.accent; ctx.fillRect(-bw * 0.4, -bl * 0.52, bw * 0.8, bl * 0.05);
    ctx.restore();
  },
});

family({
  id: 'modern.car.bus', name: 'City Bus', category: 'modern',
  tags: ['bus', 'transit', 'public', 'vehicle', 'topdown'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.accent, t.danger, t.gold, t.leaf, t.metal]);
    const bw = s * 0.2, bl = s * 0.46;
    groundShadow(ctx, s * 0.04, s * 0.04, s * 0.26, s * 0.48);
    tyres(ctx, bw, bl, darken(t.metalDark, 0.35), -0.62, 0.62);
    roundRect(ctx, -bw, -bl, bw * 2, bl * 2, bw * 0.3);
    fillStroke(ctx, body, t.ink, Math.max(1, bw * 0.14));
    // roof panel + hatches
    ctx.fillStyle = lighten(body, 0.1); ctx.fillRect(-bw * 0.7, -bl * 0.8, bw * 1.4, bl * 1.6);
    ctx.fillStyle = withAlpha(t.ink, 0.2);
    ctx.fillRect(-bw * 0.4, -bl * 0.5, bw * 0.8, bl * 0.18); ctx.fillRect(-bw * 0.4, bl * 0.2, bw * 0.8, bl * 0.18);
    // windshield + rear glass strips
    ctx.fillStyle = withAlpha(t.glass, 0.95);
    ctx.fillRect(-bw * 0.7, -bl * 0.95, bw * 1.4, bl * 0.14);
    ctx.fillRect(-bw * 0.7, bl * 0.82, bw * 1.4, bl * 0.12);
    // sheen
    ctx.fillStyle = withAlpha(t.white, 0.14); ctx.fillRect(-bw * 0.95, -bl * 0.9, bw * 0.4, bl * 1.8);
    ctx.restore();
  },
});

family({
  id: 'modern.car.coach', name: 'Coach Bus', category: 'modern',
  tags: ['coach', 'bus', 'intercity', 'vehicle', 'topdown'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.stoneLight, t.metal, t.white, t.accent]);
    const bw = s * 0.2, bl = s * 0.47;
    groundShadow(ctx, s * 0.04, s * 0.04, s * 0.26, s * 0.49);
    tyres(ctx, bw, bl, darken(t.metalDark, 0.35), -0.66, 0.62);
    roundRect(ctx, -bw, -bl, bw * 2, bl * 2, bw * 0.34);
    fillStroke(ctx, body, t.ink, Math.max(1, bw * 0.14));
    ctx.fillStyle = darken(body, 0.06); ctx.fillRect(-bw * 0.72, -bl * 0.78, bw * 1.44, bl * 1.56);
    // livery stripe
    ctx.fillStyle = t.accent; ctx.fillRect(-bw, -bl * 0.1, bw * 2, bl * 0.08);
    // roof AC + escape hatch
    ctx.fillStyle = withAlpha(t.ink, 0.25); ctx.fillRect(-bw * 0.5, -bl * 0.6, bw, bl * 0.16);
    ctx.fillStyle = withAlpha(t.glass, 0.95);
    ctx.fillRect(-bw * 0.7, -bl * 0.96, bw * 1.4, bl * 0.13);
    ctx.fillStyle = withAlpha(t.white, 0.14); ctx.fillRect(-bw * 0.95, -bl * 0.9, bw * 0.4, bl * 1.8);
    ctx.restore();
  },
});

family({
  id: 'modern.car.semi', name: 'Semi Truck', category: 'modern',
  tags: ['truck', 'semi', 'lorry', 'trailer', 'topdown'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const cabCol = tint || pick(rng, [t.danger, t.accent, t.metalDark, t.leafDark, t.gold]);
    const bw = s * 0.18;
    groundShadow(ctx, s * 0.04, s * 0.04, s * 0.24, s * 0.5);
    // trailer (rear)
    const trTop = -s * 0.06, trBot = s * 0.46;
    tyres(ctx, bw, (trBot - trTop) / 2, darken(t.metalDark, 0.35), 0.2, 0.92);
    ctx.save(); ctx.translate(0, (trTop + trBot) / 2);
    roundRect(ctx, -bw, -(trBot - trTop) / 2, bw * 2, trBot - trTop, bw * 0.1);
    fillStroke(ctx, t.white, t.ink, Math.max(1, bw * 0.14));
    ctx.strokeStyle = withAlpha(t.ink, 0.3); ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) { const yy = -(trBot - trTop) / 2 + (trBot - trTop) * i / 6; line(ctx, -bw, yy, bw, yy, withAlpha(t.ink, 0.25), 1); }
    ctx.restore();
    // cab (front)
    const cabTop = -s * 0.46, cabBot = -s * 0.12;
    tyres(ctx, bw, (cabBot - cabTop) / 2, darken(t.metalDark, 0.35), -0.8, 0.7);
    ctx.save(); ctx.translate(0, (cabTop + cabBot) / 2);
    roundRect(ctx, -bw, -(cabBot - cabTop) / 2, bw * 2, cabBot - cabTop, bw * 0.3);
    fillStroke(ctx, cabCol, t.ink, Math.max(1, bw * 0.14));
    ctx.fillStyle = withAlpha(t.glass, 0.95); ctx.fillRect(-bw * 0.7, -(cabBot - cabTop) / 2 + s * 0.01, bw * 1.4, s * 0.06);
    ctx.restore();
    // coupling gap detail
    ctx.fillStyle = t.metalDark; ctx.fillRect(-bw * 0.2, -s * 0.1, bw * 0.4, s * 0.05);
    ctx.restore();
  },
});

family({
  id: 'modern.car.boxvan', name: 'Box Van', category: 'modern',
  tags: ['van', 'box', 'delivery', 'vehicle', 'topdown'], size: 52, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.white, t.accent, t.gold, t.danger, t.metal]);
    const bw = s * 0.19, bl = s * 0.4;
    groundShadow(ctx, s * 0.04, s * 0.04, s * 0.24, s * 0.44);
    tyres(ctx, bw, bl, darken(t.metalDark, 0.35), -0.62, 0.62);
    roundRect(ctx, -bw, -bl, bw * 2, bl * 2, bw * 0.2);
    fillStroke(ctx, body, t.ink, Math.max(1, bw * 0.14));
    // cab section
    roundRect(ctx, -bw * 0.92, -bl * 0.96, bw * 1.84, bl * 0.5, bw * 0.22);
    fillStroke(ctx, darken(body, 0.06), withAlpha(t.ink, 0.4), 1);
    ctx.fillStyle = withAlpha(t.glass, 0.95); ctx.fillRect(-bw * 0.68, -bl * 0.92, bw * 1.36, bl * 0.2);
    // box roof seam
    ctx.strokeStyle = withAlpha(t.ink, 0.3); ctx.lineWidth = 1;
    line(ctx, -bw * 0.8, -bl * 0.42, bw * 0.8, -bl * 0.42, withAlpha(t.ink, 0.3), 1);
    line(ctx, 0, -bl * 0.42, 0, bl * 0.9, withAlpha(t.ink, 0.25), 1);
    ctx.restore();
  },
});

// =====================================================================
// TWO-WHEELERS
// =====================================================================

family({
  id: 'modern.bike.motorcycle', name: 'Motorcycle', category: 'modern',
  tags: ['motorcycle', 'motorbike', 'bike', 'vehicle', 'topdown'], size: 44, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.danger, t.accent, t.ink, t.metalDark, t.leafDark]);
    groundShadow(ctx, s * 0.03, s * 0.04, s * 0.1, s * 0.32);
    const dark = darken(t.metalDark, 0.4);
    // wheels
    ctx.fillStyle = dark;
    roundRect(ctx, -s * 0.04, -s * 0.36, s * 0.08, s * 0.16, s * 0.03); ctx.fill();
    roundRect(ctx, -s * 0.04, s * 0.2, s * 0.08, s * 0.16, s * 0.03); ctx.fill();
    // frame/body
    roundRect(ctx, -s * 0.06, -s * 0.2, s * 0.12, s * 0.42, s * 0.05);
    fillStroke(ctx, body, t.ink, Math.max(1, s * 0.02));
    // tank + seat
    ctx.fillStyle = lighten(body, 0.12); roundRect(ctx, -s * 0.05, -s * 0.16, s * 0.1, s * 0.12, s * 0.03); ctx.fill();
    ctx.fillStyle = darken(body, 0.3); roundRect(ctx, -s * 0.045, s * 0.0, s * 0.09, s * 0.16, s * 0.03); ctx.fill();
    // handlebars
    line(ctx, -s * 0.12, -s * 0.18, s * 0.12, -s * 0.18, dark, Math.max(1, s * 0.025));
    // headlight
    ctx.fillStyle = withAlpha(t.gold, 0.9); ctx.beginPath(); ctx.arc(0, -s * 0.22, s * 0.02, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'modern.bike.bicycle', name: 'Bicycle', category: 'modern',
  tags: ['bicycle', 'bike', 'cycle', 'vehicle', 'topdown'], size: 42, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const frame = tint || pick(rng, [t.danger, t.accent, t.leaf, t.gold, t.metalDark]);
    groundShadow(ctx, s * 0.02, s * 0.04, s * 0.08, s * 0.3);
    const dark = darken(t.metalDark, 0.4);
    // wheels (rings)
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, s * 0.03);
    ctx.beginPath(); ctx.ellipse(0, -s * 0.26, s * 0.06, s * 0.1, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, s * 0.26, s * 0.06, s * 0.1, 0, 0, Math.PI * 2); ctx.stroke();
    // frame
    line(ctx, 0, -s * 0.26, 0, s * 0.26, frame, Math.max(1, s * 0.025));
    line(ctx, 0, -s * 0.04, -s * 0.04, s * 0.14, frame, Math.max(1, s * 0.02));
    line(ctx, 0, -s * 0.04, s * 0.04, s * 0.14, frame, Math.max(1, s * 0.02));
    // handlebars + seat
    line(ctx, -s * 0.08, -s * 0.2, s * 0.08, -s * 0.2, dark, Math.max(1, s * 0.022));
    ctx.fillStyle = dark; roundRect(ctx, -s * 0.03, s * 0.12, s * 0.06, s * 0.06, s * 0.02); ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'modern.bike.scooter', name: 'Scooter', category: 'modern',
  tags: ['scooter', 'moped', 'vespa', 'vehicle', 'topdown'], size: 42, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.accent, t.gold, t.danger, t.leaf, t.white]);
    groundShadow(ctx, s * 0.02, s * 0.04, s * 0.09, s * 0.28);
    const dark = darken(t.metalDark, 0.4);
    ctx.fillStyle = dark;
    roundRect(ctx, -s * 0.035, -s * 0.32, s * 0.07, s * 0.12, s * 0.03); ctx.fill();
    roundRect(ctx, -s * 0.035, s * 0.2, s * 0.07, s * 0.12, s * 0.03); ctx.fill();
    // step-through body
    roundRect(ctx, -s * 0.07, -s * 0.22, s * 0.14, s * 0.42, s * 0.06);
    fillStroke(ctx, body, t.ink, Math.max(1, s * 0.02));
    // floor deck (lighter, narrow middle)
    ctx.fillStyle = darken(body, 0.2); roundRect(ctx, -s * 0.04, -s * 0.02, s * 0.08, s * 0.12, s * 0.02); ctx.fill();
    // seat
    ctx.fillStyle = mix(t.metalDark, t.ink, 0.4); roundRect(ctx, -s * 0.05, s * 0.08, s * 0.1, s * 0.12, s * 0.03); ctx.fill();
    // handlebars
    line(ctx, -s * 0.09, -s * 0.2, s * 0.09, -s * 0.2, dark, Math.max(1, s * 0.025));
    ctx.fillStyle = withAlpha(t.gold, 0.9); ctx.beginPath(); ctx.arc(0, -s * 0.24, s * 0.018, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

// =====================================================================
// RAIL
// =====================================================================

family({
  id: 'modern.rail.engine', name: 'Train Engine', category: 'modern',
  tags: ['train', 'locomotive', 'engine', 'rail', 'topdown'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.danger, t.accent, t.metalDark, t.leafDark, t.gold]);
    const bw = s * 0.2;
    groundShadow(ctx, s * 0.03, 0, s * 0.24, s * 0.46);
    // rails
    ctx.strokeStyle = withAlpha(t.ink, 0.3); ctx.lineWidth = Math.max(1, s * 0.012);
    line(ctx, -bw * 0.7, -s * 0.46, -bw * 0.7, s * 0.46, withAlpha(t.ink, 0.25), Math.max(1, s * 0.012));
    line(ctx, bw * 0.7, -s * 0.46, bw * 0.7, s * 0.46, withAlpha(t.ink, 0.25), Math.max(1, s * 0.012));
    // body with tapered nose at -y
    polygonPath(ctx, [
      { x: -bw * 0.7, y: -s * 0.3 }, { x: 0, y: -s * 0.44 }, { x: bw * 0.7, y: -s * 0.3 },
      { x: bw * 0.7, y: s * 0.42 }, { x: -bw * 0.7, y: s * 0.42 },
    ]);
    fillStroke(ctx, body, t.ink, Math.max(1, s * 0.02));
    // cab windshield
    ctx.fillStyle = withAlpha(t.glass, 0.95); ctx.fillRect(-bw * 0.5, -s * 0.34, bw, s * 0.08);
    // roof line + vents
    ctx.fillStyle = lighten(body, 0.1); ctx.fillRect(-bw * 0.45, -s * 0.22, bw * 0.9, s * 0.6);
    ctx.fillStyle = withAlpha(t.ink, 0.25);
    for (let i = 0; i < 3; i++) ctx.fillRect(-bw * 0.3, -s * 0.16 + i * s * 0.18, bw * 0.6, s * 0.06);
    // livery stripe + coupler
    ctx.fillStyle = t.gold; ctx.fillRect(-bw * 0.7, s * 0.36, bw * 1.4, s * 0.04);
    ctx.fillStyle = t.metalDark; ctx.fillRect(-bw * 0.1, s * 0.42, bw * 0.2, s * 0.04);
    ctx.restore();
  },
});

family({
  id: 'modern.rail.tram', name: 'Tram', category: 'modern',
  tags: ['tram', 'streetcar', 'trolley', 'rail', 'topdown'], size: 60, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.accent, t.danger, t.leaf, t.gold, t.metal]);
    const bw = s * 0.18;
    groundShadow(ctx, s * 0.03, 0, s * 0.22, s * 0.46);
    line(ctx, 0, -s * 0.46, 0, s * 0.46, withAlpha(t.ink, 0.25), Math.max(1, s * 0.012));
    roundRect(ctx, -bw, -s * 0.44, bw * 2, s * 0.88, bw * 0.4);
    fillStroke(ctx, body, t.ink, Math.max(1, s * 0.02));
    // roof
    ctx.fillStyle = lighten(body, 0.1); ctx.fillRect(-bw * 0.7, -s * 0.38, bw * 1.4, s * 0.76);
    // pantograph (diamond)
    ctx.strokeStyle = t.metalDark; ctx.lineWidth = Math.max(1, s * 0.012);
    ctx.beginPath(); ctx.moveTo(-bw * 0.4, -s * 0.06); ctx.lineTo(0, -s * 0.14); ctx.lineTo(bw * 0.4, -s * 0.06); ctx.stroke();
    // articulation joint
    ctx.fillStyle = withAlpha(t.ink, 0.3); ctx.fillRect(-bw, -s * 0.02, bw * 2, s * 0.04);
    // windshields
    ctx.fillStyle = withAlpha(t.glass, 0.95);
    ctx.fillRect(-bw * 0.6, -s * 0.42, bw * 1.2, s * 0.06); ctx.fillRect(-bw * 0.6, s * 0.36, bw * 1.2, s * 0.06);
    ctx.restore();
  },
});

family({
  id: 'modern.rail.subway', name: 'Subway Car', category: 'modern',
  tags: ['subway', 'metro', 'train', 'rail', 'topdown'], size: 60, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.metal, t.stoneLight, t.accent, t.white]);
    const bw = s * 0.19;
    groundShadow(ctx, s * 0.03, 0, s * 0.22, s * 0.46);
    roundRect(ctx, -bw, -s * 0.45, bw * 2, s * 0.9, bw * 0.3);
    fillStroke(ctx, body, t.ink, Math.max(1, s * 0.02));
    // roof corrugation
    ctx.strokeStyle = withAlpha(t.ink, 0.25); ctx.lineWidth = 1;
    for (let i = 1; i < 8; i++) { const yy = -s * 0.4 + i * s * 0.1; line(ctx, -bw * 0.8, yy, bw * 0.8, yy, withAlpha(t.ink, 0.22), 1); }
    // livery stripe
    ctx.fillStyle = t.danger; ctx.fillRect(-bw, -s * 0.04, bw * 2, s * 0.06);
    // doors (sides)
    ctx.fillStyle = mix(t.glass, t.ink, 0.2);
    for (const yy of [-s * 0.26, s * 0.14]) { ctx.fillRect(-bw, yy, bw * 0.16, s * 0.12); ctx.fillRect(bw * 0.84, yy, bw * 0.16, s * 0.12); }
    // end windshields
    ctx.fillStyle = withAlpha(t.glass, 0.95);
    ctx.fillRect(-bw * 0.6, -s * 0.43, bw * 1.2, s * 0.05); ctx.fillRect(-bw * 0.6, s * 0.38, bw * 1.2, s * 0.05);
    ctx.restore();
  },
});

// =====================================================================
// AIRCRAFT (plan view, nose toward -y)
// =====================================================================

family({
  id: 'modern.air.airplane', name: 'Airliner', category: 'modern',
  tags: ['airplane', 'aircraft', 'plane', 'airliner', 'topdown'], size: 80, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || t.white;
    groundShadow(ctx, s * 0.05, s * 0.05, s * 0.3, s * 0.36);
    // wings
    ctx.fillStyle = lighten(body, 0.04);
    polygonPath(ctx, [{ x: -s * 0.04, y: -s * 0.02 }, { x: -s * 0.44, y: s * 0.16 }, { x: -s * 0.44, y: s * 0.22 }, { x: -s * 0.04, y: s * 0.12 }]);
    fillStroke(ctx, lighten(body, 0.03), t.ink, Math.max(1, s * 0.015));
    polygonPath(ctx, [{ x: s * 0.04, y: -s * 0.02 }, { x: s * 0.44, y: s * 0.16 }, { x: s * 0.44, y: s * 0.22 }, { x: s * 0.04, y: s * 0.12 }]);
    fillStroke(ctx, lighten(body, 0.03), t.ink, Math.max(1, s * 0.015));
    // tailplane
    polygonPath(ctx, [{ x: -s * 0.03, y: s * 0.3 }, { x: -s * 0.18, y: s * 0.4 }, { x: -s * 0.03, y: s * 0.38 }]);
    fillStroke(ctx, lighten(body, 0.03), t.ink, 1);
    polygonPath(ctx, [{ x: s * 0.03, y: s * 0.3 }, { x: s * 0.18, y: s * 0.4 }, { x: s * 0.03, y: s * 0.38 }]);
    fillStroke(ctx, lighten(body, 0.03), t.ink, 1);
    // engines
    ctx.fillStyle = t.metalDark;
    ellipse(ctx, -s * 0.2, s * 0.1, s * 0.035, s * 0.06, t.metalDark, t.ink, 1);
    ellipse(ctx, s * 0.2, s * 0.1, s * 0.035, s * 0.06, t.metalDark, t.ink, 1);
    // fuselage
    roundRect(ctx, -s * 0.07, -s * 0.42, s * 0.14, s * 0.84, s * 0.07);
    fillStroke(ctx, body, t.ink, Math.max(1, s * 0.018));
    // nose cone
    polygonPath(ctx, [{ x: -s * 0.07, y: -s * 0.36 }, { x: 0, y: -s * 0.46 }, { x: s * 0.07, y: -s * 0.36 }]);
    fillStroke(ctx, body, t.ink, 1);
    // cockpit + windows
    ctx.fillStyle = withAlpha(t.glass, 0.95); ctx.beginPath(); ctx.ellipse(0, -s * 0.34, s * 0.045, s * 0.05, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = withAlpha(t.ink, 0.4);
    for (let i = 0; i < 7; i++) ctx.fillRect(-s * 0.05, -s * 0.24 + i * s * 0.07, s * 0.1, s * 0.012);
    // tail fin
    ctx.fillStyle = t.accent; polygonPath(ctx, [{ x: -s * 0.02, y: s * 0.42 }, { x: 0, y: s * 0.3 }, { x: s * 0.02, y: s * 0.42 }]); ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'modern.air.jet', name: 'Fighter Jet', category: 'modern',
  tags: ['jet', 'fighter', 'aircraft', 'military', 'topdown'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.metal, t.metalDark, t.stoneDark]);
    groundShadow(ctx, s * 0.05, s * 0.05, s * 0.26, s * 0.34);
    // delta wings
    ctx.fillStyle = darken(body, 0.06);
    polygonPath(ctx, [{ x: 0, y: -s * 0.05 }, { x: -s * 0.4, y: s * 0.26 }, { x: -s * 0.06, y: s * 0.24 }]);
    fillStroke(ctx, darken(body, 0.05), t.ink, Math.max(1, s * 0.014));
    polygonPath(ctx, [{ x: 0, y: -s * 0.05 }, { x: s * 0.4, y: s * 0.26 }, { x: s * 0.06, y: s * 0.24 }]);
    fillStroke(ctx, darken(body, 0.05), t.ink, Math.max(1, s * 0.014));
    // twin tail fins
    ctx.fillStyle = darken(body, 0.1);
    polygonPath(ctx, [{ x: -s * 0.07, y: s * 0.24 }, { x: -s * 0.16, y: s * 0.4 }, { x: -s * 0.05, y: s * 0.36 }]); ctx.fill();
    polygonPath(ctx, [{ x: s * 0.07, y: s * 0.24 }, { x: s * 0.16, y: s * 0.4 }, { x: s * 0.05, y: s * 0.36 }]); ctx.fill();
    // fuselage (pointed nose)
    polygonPath(ctx, [
      { x: 0, y: -s * 0.46 }, { x: s * 0.05, y: -s * 0.2 }, { x: s * 0.06, y: s * 0.38 },
      { x: -s * 0.06, y: s * 0.38 }, { x: -s * 0.05, y: -s * 0.2 },
    ]);
    fillStroke(ctx, body, t.ink, Math.max(1, s * 0.016));
    // canopy
    ctx.fillStyle = withAlpha(t.glass, 0.95); ctx.beginPath(); ctx.ellipse(0, -s * 0.16, s * 0.035, s * 0.08, 0, 0, Math.PI * 2); ctx.fill();
    // exhausts
    ctx.fillStyle = t.fire; ctx.fillRect(-s * 0.04, s * 0.36, s * 0.03, s * 0.04); ctx.fillRect(s * 0.01, s * 0.36, s * 0.03, s * 0.04);
    ctx.restore();
  },
});

family({
  id: 'modern.air.helicopter', name: 'Helicopter', category: 'modern',
  tags: ['helicopter', 'chopper', 'rotor', 'aircraft', 'topdown'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.accent, t.danger, t.leafDark, t.metalDark, t.gold]);
    groundShadow(ctx, s * 0.04, s * 0.05, s * 0.18, s * 0.3);
    // tail boom
    roundRect(ctx, -s * 0.03, s * 0.04, s * 0.06, s * 0.4, s * 0.02);
    fillStroke(ctx, body, t.ink, Math.max(1, s * 0.016));
    // tail fin + rotor
    polygonPath(ctx, [{ x: 0, y: s * 0.4 }, { x: -s * 0.08, y: s * 0.46 }, { x: 0, y: s * 0.44 }]); fillStroke(ctx, darken(body, 0.1), t.ink, 1);
    line(ctx, -s * 0.04, s * 0.42, s * 0.06, s * 0.42, t.metalDark, Math.max(1, s * 0.02));
    // cabin (teardrop)
    ctx.beginPath(); ctx.ellipse(0, -s * 0.08, s * 0.13, s * 0.2, 0, 0, Math.PI * 2);
    fillStroke(ctx, body, t.ink, Math.max(1, s * 0.018));
    // canopy glass at nose
    ctx.fillStyle = withAlpha(t.glass, 0.95); ctx.beginPath(); ctx.ellipse(0, -s * 0.2, s * 0.1, s * 0.1, 0, 0, Math.PI * 2); ctx.fill();
    // skids
    line(ctx, -s * 0.1, -s * 0.12, -s * 0.1, s * 0.1, t.metalDark, Math.max(1, s * 0.014));
    line(ctx, s * 0.1, -s * 0.12, s * 0.1, s * 0.1, t.metalDark, Math.max(1, s * 0.014));
    // main rotor (crossed blades)
    const ph = rand(rng, 0, 1);
    ctx.save(); ctx.translate(0, -s * 0.08); ctx.rotate(ph * Math.PI);
    ctx.fillStyle = withAlpha(t.ink, 0.6);
    roundRect(ctx, -s * 0.44, -s * 0.012, s * 0.88, s * 0.024, s * 0.012); ctx.fill();
    roundRect(ctx, -s * 0.012, -s * 0.44, s * 0.024, s * 0.88, s * 0.012); ctx.fill();
    ctx.restore();
    ctx.fillStyle = t.metalDark; ctx.beginPath(); ctx.arc(0, -s * 0.08, s * 0.03, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

// =====================================================================
// BOATS (plan view, bow toward -y)
// =====================================================================

family({
  id: 'modern.boat.speedboat', name: 'Speedboat', category: 'modern',
  tags: ['boat', 'speedboat', 'powerboat', 'watercraft', 'topdown'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.white, t.danger, t.accent, t.gold]);
    const bw = s * 0.16;
    groundShadow(ctx, 0, s * 0.04, s * 0.18, s * 0.4);
    // wake
    ctx.fillStyle = withAlpha(t.waterLight, 0.5);
    polygonPath(ctx, [{ x: -bw, y: s * 0.4 }, { x: bw, y: s * 0.4 }, { x: bw * 1.8, y: s * 0.5 }, { x: -bw * 1.8, y: s * 0.5 }]);
    ctx.fill();
    // hull (pointed bow)
    polygonPath(ctx, [{ x: 0, y: -s * 0.42 }, { x: bw, y: -s * 0.1 }, { x: bw, y: s * 0.4 }, { x: -bw, y: s * 0.4 }, { x: -bw, y: -s * 0.1 }]);
    fillStroke(ctx, body, t.ink, Math.max(1, s * 0.018));
    // cockpit + windshield
    ctx.fillStyle = mix(t.glass, t.waterDark, 0.2); roundRect(ctx, -bw * 0.7, -s * 0.06, bw * 1.4, s * 0.2, bw * 0.2); ctx.fill();
    ctx.fillStyle = withAlpha(t.glass, 0.9); polygonPath(ctx, [{ x: -bw * 0.7, y: -s * 0.06 }, { x: bw * 0.7, y: -s * 0.06 }, { x: bw * 0.45, y: -s * 0.16 }, { x: -bw * 0.45, y: -s * 0.16 }]); ctx.fill();
    // outboard motor
    ctx.fillStyle = t.metalDark; ctx.fillRect(-bw * 0.2, s * 0.4, bw * 0.4, s * 0.06);
    ctx.restore();
  },
});

family({
  id: 'modern.boat.yacht', name: 'Yacht', category: 'modern',
  tags: ['yacht', 'boat', 'luxury', 'watercraft', 'topdown'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || t.white;
    const bw = s * 0.15;
    groundShadow(ctx, 0, s * 0.04, s * 0.18, s * 0.46);
    // hull
    polygonPath(ctx, [{ x: 0, y: -s * 0.46 }, { x: bw, y: -s * 0.16 }, { x: bw, y: s * 0.38 }, { x: bw * 0.6, y: s * 0.46 }, { x: -bw * 0.6, y: s * 0.46 }, { x: -bw, y: s * 0.38 }, { x: -bw, y: -s * 0.16 }]);
    fillStroke(ctx, body, t.ink, Math.max(1, s * 0.018));
    // deck
    ctx.fillStyle = lighten(t.wood, 0.2); roundRect(ctx, -bw * 0.7, -s * 0.2, bw * 1.4, s * 0.56, bw * 0.2); ctx.fill();
    // superstructure (tiered)
    ctx.fillStyle = lighten(body, 0.02); roundRect(ctx, -bw * 0.62, -s * 0.14, bw * 1.24, s * 0.34, bw * 0.2); fillStroke(ctx, lighten(body, 0.02), withAlpha(t.ink, 0.4), 1);
    ctx.fillStyle = mix(t.glass, t.waterDark, 0.2); roundRect(ctx, -bw * 0.5, -s * 0.1, bw, s * 0.12, bw * 0.15); ctx.fill();
    ctx.fillStyle = body; roundRect(ctx, -bw * 0.42, -s * 0.04, bw * 0.84, s * 0.16, bw * 0.15); fillStroke(ctx, body, withAlpha(t.ink, 0.4), 1);
    // bow rail + mast
    ctx.fillStyle = t.accent; ctx.fillRect(-bw * 0.7, s * 0.2, bw * 1.4, s * 0.04);
    line(ctx, 0, -s * 0.1, 0, -s * 0.26, t.metalDark, Math.max(1, s * 0.012));
    ctx.restore();
  },
});

family({
  id: 'modern.boat.containership', name: 'Container Ship', category: 'modern',
  tags: ['ship', 'container', 'cargo', 'freight', 'topdown'], size: 92, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const hull = tint || pick(rng, [t.danger, t.metalDark, t.stoneDark, t.accent]);
    const bw = s * 0.18;
    groundShadow(ctx, 0, s * 0.02, s * 0.22, s * 0.48);
    // hull (pointed bow at -y, blunt stern +y)
    polygonPath(ctx, [{ x: 0, y: -s * 0.47 }, { x: bw, y: -s * 0.28 }, { x: bw, y: s * 0.44 }, { x: -bw, y: s * 0.44 }, { x: -bw, y: -s * 0.28 }]);
    fillStroke(ctx, hull, t.ink, Math.max(1, s * 0.02));
    // deck
    ctx.fillStyle = mix(t.stoneDark, t.ink, 0.2); roundRect(ctx, -bw * 0.86, -s * 0.34, bw * 1.72, s * 0.7, bw * 0.06); ctx.fill();
    // container blocks grid
    const cols = 3, rows = 7, gx = -bw * 0.78, gy = -s * 0.32, gw = bw * 1.56, gh = s * 0.58;
    const ccols = [t.danger, t.accent, t.gold, t.leaf, t.metal, t.waterDark, t.brick];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      ctx.fillStyle = pick(rng, ccols);
      ctx.fillRect(gx + c * (gw / cols) + 1, gy + r * (gh / rows) + 1, gw / cols - 2, gh / rows - 2);
    }
    ctx.strokeStyle = withAlpha(t.ink, 0.3); ctx.lineWidth = 1; ctx.strokeRect(gx, gy, gw, gh);
    // superstructure / bridge near stern
    ctx.fillStyle = t.white; roundRect(ctx, -bw * 0.6, s * 0.3, bw * 1.2, s * 0.12, bw * 0.1); fillStroke(ctx, t.white, t.ink, 1);
    ctx.fillStyle = withAlpha(t.glass, 0.9); ctx.fillRect(-bw * 0.5, s * 0.31, bw, s * 0.03);
    ctx.restore();
  },
});

// =====================================================================
// STREET FURNITURE & SITE OBJECTS
// =====================================================================

family({
  id: 'modern.street.trafficlight', name: 'Traffic Light', category: 'modern',
  tags: ['traffic', 'light', 'signal', 'street', 'stoplight'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const pole = tint || t.metalDark;
    const base = s * 0.44;
    groundShadow(ctx, 0, base, s * 0.12, s * 0.03);
    line(ctx, 0, base, 0, -s * 0.12, pole, Math.max(2, s * 0.03));
    // signal head
    box(ctx, t, -s * 0.07, -s * 0.42, s * 0.14, s * 0.32, t.ink, Math.max(1, s * 0.016), s * 0.02);
    const lit = randInt(rng, 0, 2);
    const cols = [t.danger, t.gold, t.grass];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i === lit ? cols[i] : darken(cols[i], 0.55);
      ctx.beginPath(); ctx.arc(0, -s * 0.36 + i * s * 0.1, s * 0.04, 0, Math.PI * 2); ctx.fill();
    }
    // visor
    ctx.fillStyle = withAlpha(t.ink, 0.6); ctx.fillRect(-s * 0.07, -s * 0.4 + lit * s * 0.1, s * 0.14, s * 0.012);
    ctx.restore();
  },
});

family({
  id: 'modern.street.streetlamp', name: 'Street Lamp', category: 'modern',
  tags: ['lamp', 'streetlight', 'lighting', 'street', 'post'], size: 60, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const pole = tint || pick(rng, [t.metalDark, t.ink, t.stoneDark]);
    const base = s * 0.44, topY = -s * 0.4;
    groundShadow(ctx, 0, base, s * 0.12, s * 0.03);
    // base
    ctx.fillStyle = pole; roundRect(ctx, -s * 0.04, base - s * 0.04, s * 0.08, s * 0.04, s * 0.01); ctx.fill();
    line(ctx, 0, base, 0, topY, pole, Math.max(2, s * 0.028));
    // curved arm
    ctx.strokeStyle = pole; ctx.lineWidth = Math.max(2, s * 0.024); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, topY); ctx.quadraticCurveTo(s * 0.12, topY - s * 0.04, s * 0.18, topY + s * 0.02); ctx.stroke();
    // lamp head + glow
    ctx.fillStyle = withAlpha(t.gold, 0.35); ctx.beginPath(); ctx.arc(s * 0.18, topY + s * 0.06, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = t.gold; roundRect(ctx, s * 0.13, topY + s * 0.03, s * 0.1, s * 0.05, s * 0.02); fillStroke(ctx, t.gold, t.ink, 1);
    ctx.restore();
  },
});

family({
  id: 'modern.street.bench', name: 'Park Bench', category: 'modern',
  tags: ['bench', 'seat', 'park', 'street', 'furniture'], size: 52, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const wood = tint || pick(rng, [t.wood, t.woodDark, t.leafDark, t.metalDark]);
    const base = s * 0.34;
    groundShadow(ctx, 0, base + s * 0.04, s * 0.34, s * 0.05);
    // legs
    ctx.fillStyle = t.metalDark;
    for (const lx of [-s * 0.26, s * 0.26]) ctx.fillRect(lx - s * 0.015, base - s * 0.16, s * 0.03, s * 0.16);
    // seat slab
    box(ctx, t, -s * 0.3, base - s * 0.18, s * 0.6, s * 0.06, wood, Math.max(1, s * 0.016), s * 0.01);
    // backrest slats
    box(ctx, t, -s * 0.3, base - s * 0.36, s * 0.6, s * 0.16, wood, Math.max(1, s * 0.016), s * 0.01);
    ctx.strokeStyle = withAlpha(t.ink, 0.4); ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) line(ctx, -s * 0.3, base - s * 0.36 + i * s * 0.04, s * 0.3, base - s * 0.36 + i * s * 0.04, withAlpha(t.ink, 0.35), 1);
    // armrest supports
    for (const lx of [-s * 0.28, s * 0.28]) line(ctx, lx, base - s * 0.34, lx, base - s * 0.12, t.metalDark, Math.max(1, s * 0.016));
    ctx.restore();
  },
});

family({
  id: 'modern.street.busstop', name: 'Bus Stop Shelter', category: 'modern',
  tags: ['busstop', 'shelter', 'transit', 'street', 'furniture'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const frame = tint || pick(rng, [t.metal, t.accent, t.metalDark]);
    const base = s * 0.4;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.4, s * 0.05);
    // back + side glass
    box(ctx, t, -s * 0.32, base - s * 0.34, s * 0.5, s * 0.34, withAlpha(t.glass, 0.6), Math.max(1, s * 0.014), s * 0.01);
    // roof
    box(ctx, t, -s * 0.36, base - s * 0.4, s * 0.58, s * 0.06, frame, Math.max(1, s * 0.018), s * 0.01);
    // bench inside
    ctx.fillStyle = t.woodDark; ctx.fillRect(-s * 0.3, base - s * 0.12, s * 0.44, s * 0.04);
    for (const lx of [-s * 0.28, s * 0.1]) ctx.fillRect(lx, base - s * 0.1, s * 0.02, s * 0.1);
    // sign post + flag
    line(ctx, s * 0.3, base, s * 0.3, base - s * 0.44, t.metalDark, Math.max(2, s * 0.022));
    box(ctx, t, s * 0.24, base - s * 0.46, s * 0.16, s * 0.1, t.accent, 1, s * 0.01);
    ctx.fillStyle = t.white; ctx.beginPath(); ctx.arc(s * 0.32, base - s * 0.41, s * 0.03, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'modern.street.fountain', name: 'Fountain', category: 'modern',
  tags: ['fountain', 'water', 'plaza', 'park', 'feature'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const stone = tint || pick(rng, [t.stone, t.stoneLight, t.stoneDark]);
    const base = s * 0.4;
    groundShadow(ctx, 0, base + s * 0.02, s * 0.4, s * 0.07);
    // lower basin
    ellipse(ctx, 0, base - s * 0.06, s * 0.38, s * 0.14, stone, t.ink, Math.max(1, s * 0.018));
    ellipse(ctx, 0, base - s * 0.08, s * 0.32, s * 0.1, t.water, withAlpha(t.ink, 0.4), 1);
    // pedestal
    ctx.fillStyle = stone; ctx.fillRect(-s * 0.05, base - s * 0.24, s * 0.1, s * 0.18);
    // upper bowl
    ellipse(ctx, 0, base - s * 0.24, s * 0.16, s * 0.06, lighten(stone, 0.06), t.ink, 1);
    ellipse(ctx, 0, base - s * 0.25, s * 0.12, s * 0.04, t.waterLight, null);
    // water jet + droplets
    line(ctx, 0, base - s * 0.26, 0, base - s * 0.42, withAlpha(t.waterLight, 0.8), Math.max(2, s * 0.02));
    ctx.fillStyle = withAlpha(t.waterLight, 0.7);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; ctx.beginPath(); ctx.arc(Math.cos(a) * s * 0.1, base - s * 0.3 + Math.abs(Math.sin(a)) * s * 0.04, s * 0.012, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  },
});

family({
  id: 'modern.street.statue', name: 'Monument', category: 'modern',
  tags: ['statue', 'monument', 'memorial', 'plaza', 'landmark'], size: 68, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const stone = tint || pick(rng, [t.stone, t.stoneLight, t.metal]);
    const base = s * 0.42;
    groundShadow(ctx, 0, base + s * 0.02, s * 0.3, s * 0.06);
    // tiered plinth
    ctx.fillStyle = darken(stone, 0.12); ctx.fillRect(-s * 0.18, base - s * 0.06, s * 0.36, s * 0.06);
    box(ctx, t, -s * 0.12, base - s * 0.24, s * 0.24, s * 0.18, stone, Math.max(1, s * 0.016), s * 0.006);
    const kind = randInt(rng, 0, 1);
    if (kind === 0) {
      // obelisk
      polygonPath(ctx, [{ x: -s * 0.05, y: base - s * 0.24 }, { x: -s * 0.025, y: -s * 0.42 }, { x: s * 0.025, y: -s * 0.42 }, { x: s * 0.05, y: base - s * 0.24 }]);
      fillStroke(ctx, lighten(stone, 0.04), t.ink, Math.max(1, s * 0.016));
      ctx.fillStyle = t.gold; polygonPath(ctx, [{ x: -s * 0.025, y: -s * 0.42 }, { x: 0, y: -s * 0.5 }, { x: s * 0.025, y: -s * 0.42 }]); ctx.fill();
    } else {
      // statue figure
      ctx.fillStyle = mix(stone, t.gold, 0.3);
      ctx.beginPath(); ctx.arc(0, -s * 0.3, s * 0.05, 0, Math.PI * 2); ctx.fill(); // head
      roundRect(ctx, -s * 0.06, -s * 0.26, s * 0.12, s * 0.2, s * 0.03); ctx.fill(); // torso
      line(ctx, s * 0.04, -s * 0.22, s * 0.16, -s * 0.34, mix(stone, t.gold, 0.3), Math.max(2, s * 0.026)); // raised arm
      fillStroke(ctx, null, withAlpha(t.ink, 0.4), 1);
    }
    ctx.restore();
  },
});

family({
  id: 'modern.street.hydrant', name: 'Fire Hydrant', category: 'modern',
  tags: ['hydrant', 'fire', 'water', 'street', 'furniture'], size: 48, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.danger, t.gold, t.accent]);
    const base = s * 0.36;
    groundShadow(ctx, 0, base + s * 0.02, s * 0.16, s * 0.04);
    // base flange
    ctx.fillStyle = darken(body, 0.2); ctx.fillRect(-s * 0.12, base - s * 0.04, s * 0.24, s * 0.04);
    // barrel
    roundRect(ctx, -s * 0.09, base - s * 0.28, s * 0.18, s * 0.24, s * 0.04);
    fillStroke(ctx, body, t.ink, Math.max(1, s * 0.02));
    // side nozzles
    ctx.fillStyle = darken(body, 0.15);
    ctx.fillRect(-s * 0.13, base - s * 0.2, s * 0.05, s * 0.06); ctx.fillRect(s * 0.08, base - s * 0.2, s * 0.05, s * 0.06);
    // bonnet cap
    ctx.beginPath(); ctx.ellipse(0, base - s * 0.28, s * 0.09, s * 0.05, 0, Math.PI, 0); ctx.closePath();
    fillStroke(ctx, lighten(body, 0.1), t.ink, 1);
    ctx.fillStyle = darken(body, 0.2); ctx.beginPath(); ctx.arc(0, base - s * 0.31, s * 0.02, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = withAlpha(t.white, 0.2); ctx.fillRect(-s * 0.09, base - s * 0.26, s * 0.04, s * 0.2);
    ctx.restore();
  },
});

family({
  id: 'modern.street.trashbin', name: 'Trash Bin', category: 'modern',
  tags: ['trash', 'bin', 'garbage', 'waste', 'street'], size: 48, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.leafDark, t.metalDark, t.accent, t.danger]);
    const base = s * 0.38;
    groundShadow(ctx, 0, base + s * 0.02, s * 0.18, s * 0.04);
    // body (slightly tapered)
    polygonPath(ctx, [{ x: -s * 0.13, y: base - s * 0.34 }, { x: s * 0.13, y: base - s * 0.34 }, { x: s * 0.11, y: base }, { x: -s * 0.11, y: base }]);
    fillStroke(ctx, body, t.ink, Math.max(1, s * 0.02));
    // vertical ribs
    ctx.strokeStyle = withAlpha(t.ink, 0.3); ctx.lineWidth = 1;
    for (const rx of [-s * 0.06, 0, s * 0.06]) line(ctx, rx, base - s * 0.3, rx, base - s * 0.02, withAlpha(t.ink, 0.3), 1);
    // lid
    ctx.fillStyle = darken(body, 0.15); roundRect(ctx, -s * 0.15, base - s * 0.4, s * 0.3, s * 0.07, s * 0.02); fillStroke(ctx, darken(body, 0.15), t.ink, 1);
    ctx.fillStyle = t.ink; ctx.fillRect(-s * 0.03, base - s * 0.42, s * 0.06, s * 0.03); // handle
    ctx.restore();
  },
});

family({
  id: 'modern.street.foodtruck', name: 'Food Truck', category: 'modern',
  tags: ['foodtruck', 'food', 'vendor', 'street', 'van'], size: 60, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.gold, t.accent, t.danger, t.leaf, t.white]);
    const base = s * 0.4;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.42, s * 0.05);
    // wheels
    ctx.fillStyle = darken(t.metalDark, 0.35);
    for (const wx of [-s * 0.24, s * 0.24]) { ctx.beginPath(); ctx.arc(wx, base, s * 0.06, 0, Math.PI * 2); ctx.fill(); }
    // box body
    box(ctx, t, -s * 0.36, base - s * 0.3, s * 0.5, s * 0.28, body, Math.max(1, s * 0.02), s * 0.02);
    // cab
    polygonPath(ctx, [{ x: s * 0.14, y: base - s * 0.24 }, { x: s * 0.36, y: base - s * 0.18 }, { x: s * 0.36, y: base - s * 0.02 }, { x: s * 0.14, y: base - s * 0.02 }]);
    fillStroke(ctx, darken(body, 0.08), t.ink, Math.max(1, s * 0.018));
    ctx.fillStyle = withAlpha(t.glass, 0.95); polygonPath(ctx, [{ x: s * 0.18, y: base - s * 0.22 }, { x: s * 0.32, y: base - 0.17 * s }, { x: s * 0.32, y: base - s * 0.1 }, { x: s * 0.18, y: base - s * 0.1 }]); ctx.fill();
    // serving window + awning
    ctx.fillStyle = mix(t.glass, t.ink, 0.1); ctx.fillRect(-s * 0.3, base - s * 0.24, s * 0.34, s * 0.12);
    ctx.fillStyle = t.danger;
    for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? t.white : t.danger; ctx.fillRect(-s * 0.32 + i * s * 0.06, base - s * 0.3, s * 0.06, s * 0.05); }
    // counter
    ctx.fillStyle = t.woodDark; ctx.fillRect(-s * 0.32, base - s * 0.13, s * 0.36, s * 0.03);
    ctx.restore();
  },
});

family({
  id: 'modern.street.crane', name: 'Construction Crane', category: 'modern',
  tags: ['crane', 'construction', 'tower-crane', 'site', 'building'], size: 92, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const body = tint || pick(rng, [t.gold, t.danger, t.accent, t.metal]);
    const base = s * 0.46, mastTop = -s * 0.22, mx = -s * 0.1;
    groundShadow(ctx, mx, base, s * 0.14, s * 0.04);
    // mast (lattice)
    ctx.strokeStyle = body; ctx.lineWidth = Math.max(1, s * 0.014);
    line(ctx, mx - s * 0.03, base, mx - s * 0.03, mastTop, body, Math.max(1, s * 0.014));
    line(ctx, mx + s * 0.03, base, mx + s * 0.03, mastTop, body, Math.max(1, s * 0.014));
    ctx.strokeStyle = withAlpha(body, 0.85); ctx.lineWidth = Math.max(1, s * 0.007);
    for (let i = 0; i < 7; i++) { const y0 = base + (mastTop - base) * (i / 7), y1 = base + (mastTop - base) * ((i + 1) / 7); line(ctx, mx - s * 0.03, y0, mx + s * 0.03, y1, withAlpha(body, 0.8), Math.max(1, s * 0.006)); line(ctx, mx + s * 0.03, y0, mx - s * 0.03, y1, withAlpha(body, 0.8), Math.max(1, s * 0.006)); }
    // operator cab
    box(ctx, t, mx - s * 0.04, mastTop - s * 0.06, s * 0.08, s * 0.06, t.glass, 1, s * 0.01);
    // jib (long, left) + counter-jib (right)
    const jibY = mastTop - s * 0.04;
    line(ctx, mx, jibY, -s * 0.42, jibY, body, Math.max(2, s * 0.02));
    line(ctx, mx, jibY, s * 0.24, jibY, body, Math.max(2, s * 0.02));
    // top A-frame + tie cables
    line(ctx, mx, jibY, mx, jibY - s * 0.1, body, Math.max(1, s * 0.012));
    line(ctx, mx, jibY - s * 0.1, -s * 0.36, jibY, withAlpha(t.ink, 0.5), 1);
    line(ctx, mx, jibY - s * 0.1, s * 0.2, jibY, withAlpha(t.ink, 0.5), 1);
    // counterweight
    ctx.fillStyle = t.stoneDark; ctx.fillRect(s * 0.18, jibY - s * 0.02, s * 0.08, s * 0.08);
    // trolley + hook
    const hx = -s * 0.3;
    line(ctx, hx, jibY, hx, jibY + s * 0.2, t.metalDark, Math.max(1, s * 0.01));
    ctx.fillStyle = t.metalDark; ctx.beginPath(); ctx.arc(hx, jibY + s * 0.22, s * 0.02, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'modern.street.containers', name: 'Shipping Containers', category: 'modern',
  tags: ['container', 'shipping', 'cargo', 'stack', 'site'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    ctx.save();
    const s = size, t = theme.sprite;
    const base = s * 0.4;
    groundShadow(ctx, 0, base + s * 0.03, s * 0.44, s * 0.05);
    const ccols = [t.danger, t.accent, t.gold, t.leaf, t.metalDark, t.brick, t.waterDark];
    const cw = s * 0.4, ch = s * 0.14;
    // bottom row (two) then stacked
    const layout = [
      { x: -s * 0.38, y: base - ch }, { x: s * 0.0, y: base - ch },
      { x: -s * 0.2, y: base - ch * 2 - s * 0.01 }, { x: s * 0.18, y: base - ch * 2 - s * 0.01 },
      { x: -s * 0.02, y: base - ch * 3 - s * 0.02 },
    ];
    for (let i = 0; i < layout.length; i++) {
      const c = tint || ccols[(i + randInt(rng, 0, 6)) % ccols.length];
      const { x, y } = layout[i];
      box(ctx, t, x, y, cw, ch, c, Math.max(1, s * 0.016), s * 0.006);
      // corrugation
      ctx.strokeStyle = withAlpha(t.ink, 0.3); ctx.lineWidth = 1;
      for (let k = 1; k < 8; k++) line(ctx, x + (cw * k) / 8, y + 1, x + (cw * k) / 8, y + ch - 1, withAlpha(t.ink, 0.28), 1);
      // doors at right end
      ctx.fillStyle = withAlpha(t.ink, 0.18); ctx.fillRect(x + cw - s * 0.05, y + 1, s * 0.04, ch - 2);
      ctx.fillStyle = withAlpha(t.white, 0.12); ctx.fillRect(x + 1, y + 1, cw - 2, ch * 0.18);
    }
    ctx.restore();
  },
});
