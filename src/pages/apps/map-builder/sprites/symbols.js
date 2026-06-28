// Cartographic SYMBOLS — flat, legible map furniture drawn as Canvas2D vectors:
// compass roses, north arrows, map pins, POI badge-glyphs, legend frames, scale
// bars, graticules, cartouches, route arrows, weather glyphs and heraldry charges.
// Origin (0,0) is the CENTRE of a size x size box; Y increases downward. Colours
// come exclusively from the theme palette. Generators self-register on import.

import { family } from './registry';
import {
  makeRng, rand, randInt, pick, chance, jitter,
  mix, darken, lighten, withAlpha,
  roundRect, polygonPath, ngon, star, blob, fillStroke, hatch,
  softShadow, clearShadow, groundShadow,
} from './draw';

/* ------------------------------------------------------------------ helpers */

// Crisp icon line width.
const LW = (s, k = 0.03) => Math.max(1.2, s * k);

// Set up a rounded glyph stroke in one call.
function stroke(ctx, color, w) {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

// Heraldic shield outline of "radius" r, centred on origin.
function shieldPath(ctx, r) {
  ctx.beginPath();
  ctx.moveTo(-r * 0.94, -r * 0.86);
  ctx.lineTo(r * 0.94, -r * 0.86);
  ctx.lineTo(r * 0.94, r * 0.16);
  ctx.quadraticCurveTo(r * 0.94, r * 0.8, 0, r * 1.04);
  ctx.quadraticCurveTo(-r * 0.94, r * 0.8, -r * 0.94, r * 0.16);
  ctx.closePath();
}

// Filled badge behind a glyph. Shape varies by rng so each variant differs.
// Returns the chosen shape so callers can adapt the glyph if they wish.
function badge(ctx, s, t, rng, fill, fixedShape) {
  const shape = fixedShape || pick(rng, ['circle', 'round', 'shield', 'circle']);
  softShadow(ctx, t.shadow, s * 0.1, s * 0.045);
  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2);
  } else if (shape === 'round') {
    roundRect(ctx, -s * 0.42, -s * 0.42, s * 0.84, s * 0.84, s * 0.14);
  } else {
    shieldPath(ctx, s * 0.42);
  }
  fillStroke(ctx, fill, t.ink, LW(s, 0.035));
  clearShadow(ctx);
  // faint inner ring for depth on round badges
  if (shape === 'circle') {
    ctx.save();
    ctx.globalAlpha = 0.16;
    stroke(ctx, t.ink, LW(s, 0.02));
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  return shape;
}

// Capital "N" built from three strokes, centred at (cx,cy) with height h.
function letterN(ctx, cx, cy, h, color, w) {
  const hw = h * 0.36;
  stroke(ctx, color, w);
  ctx.beginPath();
  ctx.moveTo(cx - hw, cy + h / 2);
  ctx.lineTo(cx - hw, cy - h / 2);
  ctx.lineTo(cx + hw, cy + h / 2);
  ctx.lineTo(cx + hw, cy - h / 2);
  ctx.stroke();
}

// 7-segment digit so we never need a font for numbers.
const SEGMAP = {
  '0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg',
  '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg',
};
function digit7(ctx, n, cx, cy, w, h, color, lw) {
  const x0 = cx - w / 2, x1 = cx + w / 2;
  const y0 = cy - h / 2, ym = cy, y1 = cy + h / 2;
  const seg = {
    a: [x0, y0, x1, y0], b: [x1, y0, x1, ym], c: [x1, ym, x1, y1],
    d: [x0, y1, x1, y1], e: [x0, ym, x0, y1], f: [x0, y0, x0, ym], g: [x0, ym, x1, ym],
  };
  stroke(ctx, color, lw);
  const on = SEGMAP[String(n)] || '';
  for (let i = 0; i < on.length; i++) {
    const v = seg[on[i]];
    ctx.beginPath();
    ctx.moveTo(v[0], v[1]);
    ctx.lineTo(v[2], v[3]);
    ctx.stroke();
  }
}

// Classic fleur-de-lis centred at origin, total height ~2*u.
function fleurDeLis(ctx, u, fill, ink, lw) {
  // central petal
  ctx.beginPath();
  ctx.moveTo(0, -u);
  ctx.bezierCurveTo(0.10 * u, -0.62 * u, 0.26 * u, -0.18 * u, 0.07 * u, 0.16 * u);
  ctx.lineTo(-0.07 * u, 0.16 * u);
  ctx.bezierCurveTo(-0.26 * u, -0.18 * u, -0.10 * u, -0.62 * u, 0, -u);
  ctx.closePath();
  fillStroke(ctx, fill, ink, lw);
  // right petal
  ctx.beginPath();
  ctx.moveTo(0.02 * u, 0.12 * u);
  ctx.bezierCurveTo(0.5 * u, -0.05 * u, 0.6 * u, -0.5 * u, 0.32 * u, -0.6 * u);
  ctx.bezierCurveTo(0.34 * u, -0.3 * u, 0.2 * u, -0.05 * u, 0.02 * u, 0.12 * u);
  ctx.closePath();
  fillStroke(ctx, fill, ink, lw);
  // left petal
  ctx.beginPath();
  ctx.moveTo(-0.02 * u, 0.12 * u);
  ctx.bezierCurveTo(-0.5 * u, -0.05 * u, -0.6 * u, -0.5 * u, -0.32 * u, -0.6 * u);
  ctx.bezierCurveTo(-0.34 * u, -0.3 * u, -0.2 * u, -0.05 * u, -0.02 * u, 0.12 * u);
  ctx.closePath();
  fillStroke(ctx, fill, ink, lw);
  // crossing band
  roundRect(ctx, -0.34 * u, 0.08 * u, 0.68 * u, 0.16 * u, 0.05 * u);
  fillStroke(ctx, fill, ink, lw);
  // foot
  ctx.beginPath();
  ctx.moveTo(-0.16 * u, 0.24 * u);
  ctx.lineTo(0.16 * u, 0.24 * u);
  ctx.lineTo(0.1 * u, 0.58 * u);
  ctx.lineTo(-0.1 * u, 0.58 * u);
  ctx.closePath();
  fillStroke(ctx, fill, ink, lw);
}

/* =================================================================
 * COMPASS ROSES
 * ================================================================= */

family({
  id: 'symbols.compass.star8', name: 'Compass Rose (8-point)', category: 'symbols',
  tags: ['compass', 'rose', 'north', 'navigation', 'cardinal'], size: 120, variants: 3,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme.sprite, R = s * 0.42;
    ctx.save();
    ctx.rotate(rand(rng, -0.05, 0.05));
    stroke(ctx, t.ink, LW(s, 0.012));
    for (const rr of [R, R * 0.78]) { ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.stroke(); }
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2, long = i % 2 === 0, len = long ? R : R * 0.6;
      const wpt = s * 0.05;
      const tipx = Math.cos(a) * len, tipy = Math.sin(a) * len;
      const bx = Math.cos(a + Math.PI / 2) * wpt, by = Math.sin(a + Math.PI / 2) * wpt;
      polygonPath(ctx, [{ x: tipx, y: tipy }, { x: bx, y: by }, { x: -bx, y: -by }]);
      fillStroke(ctx, i === 0 ? t.danger : long ? t.ink : t.paper, t.ink, LW(s, 0.01));
    }
    ctx.fillStyle = t.ink;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.03, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'symbols.compass.star16', name: 'Compass Rose (16-point)', category: 'symbols',
  tags: ['compass', 'rose', 'north', 'navigation', 'wind'], size: 128, variants: 3,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme.sprite, R = s * 0.42;
    ctx.save();
    ctx.rotate(rand(rng, -0.04, 0.04));
    stroke(ctx, t.ink, LW(s, 0.01));
    for (const rr of [R, R * 0.82, R * 0.34]) { ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.stroke(); }
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const tier = i % 4 === 0 ? 0 : i % 2 === 0 ? 1 : 2;
      const len = tier === 0 ? R : tier === 1 ? R * 0.7 : R * 0.5;
      const wpt = tier === 2 ? s * 0.022 : s * 0.04;
      const tipx = Math.cos(a) * len, tipy = Math.sin(a) * len;
      const bx = Math.cos(a + Math.PI / 2) * wpt, by = Math.sin(a + Math.PI / 2) * wpt;
      polygonPath(ctx, [{ x: tipx, y: tipy }, { x: bx, y: by }, { x: -bx, y: -by }]);
      fillStroke(ctx, i === 0 ? t.danger : tier === 0 ? t.ink : t.paper, t.ink, LW(s, 0.008));
    }
    ctx.fillStyle = t.paper; ctx.beginPath(); ctx.arc(0, 0, s * 0.05, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = t.ink; ctx.beginPath(); ctx.arc(0, 0, s * 0.022, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'symbols.compass.needle', name: 'Compass Needle', category: 'symbols',
  tags: ['compass', 'needle', 'north', 'navigation'], size: 100, variants: 3,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme.sprite, R = s * 0.42;
    ctx.save();
    ctx.rotate(rand(rng, -0.06, 0.06));
    // bezel + ticks
    stroke(ctx, t.ink, LW(s, 0.014));
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2, big = i % 6 === 0;
      const r0 = big ? R * 0.82 : R * 0.9;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
      ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R);
      ctx.stroke();
    }
    // needle (north red / south pale)
    const nl = R * 0.74, w = s * 0.08;
    polygonPath(ctx, [{ x: 0, y: -nl }, { x: w, y: 0 }, { x: 0, y: 0 }]);
    fillStroke(ctx, t.danger, t.ink, LW(s, 0.01));
    polygonPath(ctx, [{ x: 0, y: -nl }, { x: -w, y: 0 }, { x: 0, y: 0 }]);
    fillStroke(ctx, lighten(t.danger, 0.25), t.ink, LW(s, 0.01));
    polygonPath(ctx, [{ x: 0, y: nl }, { x: w, y: 0 }, { x: 0, y: 0 }]);
    fillStroke(ctx, t.paper, t.ink, LW(s, 0.01));
    polygonPath(ctx, [{ x: 0, y: nl }, { x: -w, y: 0 }, { x: 0, y: 0 }]);
    fillStroke(ctx, darken(t.paper, 0.1), t.ink, LW(s, 0.01));
    ctx.fillStyle = t.metal;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.05, 0, Math.PI * 2); ctx.fill();
    stroke(ctx, t.ink, LW(s, 0.012)); ctx.stroke();
    ctx.restore();
  },
});

family({
  id: 'symbols.compass.ornate', name: 'Ornate Compass Star', category: 'symbols',
  tags: ['compass', 'rose', 'ornate', 'antique', 'star'], size: 132, variants: 3,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme.sprite, R = s * 0.42;
    ctx.save();
    ctx.rotate(rand(rng, -0.03, 0.03));
    stroke(ctx, t.ink, LW(s, 0.01));
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
    // decorative dotted ring
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      ctx.fillStyle = i % 2 ? t.ink : t.gold;
      ctx.beginPath(); ctx.arc(Math.cos(a) * R, Math.sin(a) * R, s * 0.012, 0, Math.PI * 2); ctx.fill();
    }
    // faceted kite points (light/dark halves for a 3-D look)
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const long = i % 2 === 0, len = long ? R * 0.92 : R * 0.5;
      const bw = long ? s * 0.06 : s * 0.045;
      const perp = a + Math.PI / 2;
      const tip = { x: Math.cos(a) * len, y: Math.sin(a) * len };
      const bl = { x: Math.cos(perp) * bw, y: Math.sin(perp) * bw };
      const br = { x: -bl.x, y: -bl.y };
      const north = i === 0;
      polygonPath(ctx, [{ x: 0, y: 0 }, tip, bl]);
      fillStroke(ctx, north ? t.danger : t.paper, t.ink, LW(s, 0.008));
      polygonPath(ctx, [{ x: 0, y: 0 }, tip, br]);
      fillStroke(ctx, north ? darken(t.danger, 0.22) : t.ink, t.ink, LW(s, 0.008));
    }
    ctx.fillStyle = t.gold;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.04, 0, Math.PI * 2); ctx.fill();
    stroke(ctx, t.ink, LW(s, 0.01)); ctx.stroke();
    ctx.restore();
  },
});

family({
  id: 'symbols.compass.modernN', name: 'Modern North Arrow', category: 'symbols',
  tags: ['compass', 'north', 'arrow', 'modern', 'gis'], size: 110, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, col = tint || t.ink, R = s * 0.3;
    // big N over a split arrow
    letterN(ctx, 0, -R - s * 0.13, s * 0.16, col, LW(s, 0.03));
    const w = s * 0.13;
    polygonPath(ctx, [{ x: 0, y: -R }, { x: w, y: R * 0.55 }, { x: 0, y: R * 0.28 }]);
    fillStroke(ctx, t.paper, t.ink, LW(s, 0.022));
    polygonPath(ctx, [{ x: 0, y: -R }, { x: -w, y: R * 0.55 }, { x: 0, y: R * 0.28 }]);
    fillStroke(ctx, col, t.ink, LW(s, 0.022));
    if (chance(rng, 0.6)) {
      ctx.fillStyle = t.ink;
      ctx.beginPath(); ctx.arc(0, R * 0.55, s * 0.02, 0, Math.PI * 2); ctx.fill();
    }
  },
});

family({
  id: 'symbols.compass.fleur', name: 'Antique Fleur Compass', category: 'symbols',
  tags: ['compass', 'rose', 'fleur', 'antique', 'north'], size: 130, variants: 2,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme.sprite, R = s * 0.42;
    ctx.save();
    stroke(ctx, t.ink, LW(s, 0.011));
    for (const rr of [R, R * 0.8]) { ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.stroke(); }
    // cardinal + intercardinal points
    for (let i = 0; i < 8; i++) {
      if (i === 0) continue; // north handled by fleur
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const long = i % 2 === 0, len = long ? R * 0.78 : R * 0.5, wpt = s * 0.035;
      const tip = { x: Math.cos(a) * len, y: Math.sin(a) * len };
      const bx = Math.cos(a + Math.PI / 2) * wpt, by = Math.sin(a + Math.PI / 2) * wpt;
      polygonPath(ctx, [tip, { x: bx, y: by }, { x: -bx, y: -by }]);
      fillStroke(ctx, long ? t.ink : t.paper, t.ink, LW(s, 0.008));
    }
    // fleur pointing north (up)
    ctx.save();
    ctx.translate(0, -R * 0.5);
    fleurDeLis(ctx, R * 0.5, t.gold, t.ink, LW(s, 0.012));
    ctx.restore();
    ctx.fillStyle = t.ink;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.028, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

/* =================================================================
 * NORTH ARROWS
 * ================================================================= */

family({
  id: 'symbols.north.simple', name: 'North Arrow (Simple)', category: 'symbols',
  tags: ['north', 'arrow', 'simple', 'navigation'], size: 96, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, col = tint || t.ink, R = s * 0.34;
    letterN(ctx, 0, -R - s * 0.12, s * 0.15, col, LW(s, 0.03));
    stroke(ctx, t.ink, LW(s, 0.03));
    ctx.beginPath(); ctx.moveTo(0, R * 0.95); ctx.lineTo(0, -R * 0.7); ctx.stroke();
    const w = s * 0.1;
    polygonPath(ctx, [{ x: 0, y: -R }, { x: w, y: -R * 0.55 }, { x: -w, y: -R * 0.55 }]);
    fillStroke(ctx, col, t.ink, LW(s, 0.022));
    if (chance(rng, 0.5)) {
      ctx.fillStyle = t.ink;
      ctx.beginPath(); ctx.arc(0, R * 0.95, s * 0.025, 0, Math.PI * 2); ctx.fill();
    }
  },
});

family({
  id: 'symbols.north.surveyor', name: 'North Arrow (Surveyor)', category: 'symbols',
  tags: ['north', 'arrow', 'surveyor', 'feather'], size: 100, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, col = tint || t.ink, R = s * 0.36;
    stroke(ctx, t.ink, LW(s, 0.028));
    ctx.beginPath(); ctx.moveTo(0, R); ctx.lineTo(0, -R * 0.62); ctx.stroke();
    // feathered tail
    for (let i = 0; i < 3; i++) {
      const y = R - i * s * 0.1;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s * 0.1, y + s * 0.08); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(-s * 0.1, y + s * 0.08); ctx.stroke();
    }
    const w = s * 0.11;
    polygonPath(ctx, [{ x: 0, y: -R }, { x: w, y: -R * 0.5 }, { x: 0, y: -R * 0.66 }, { x: -w, y: -R * 0.5 }]);
    fillStroke(ctx, col, t.ink, LW(s, 0.02));
    letterN(ctx, s * 0.18, -R * 0.78, s * 0.13, col, LW(s, 0.028));
  },
});

family({
  id: 'symbols.north.diamond', name: 'North Arrow (Diamond)', category: 'symbols',
  tags: ['north', 'arrow', 'diamond', 'split'], size: 100, variants: 2,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, col = tint || t.ink, R = s * 0.36;
    // split shaft diamond
    polygonPath(ctx, [{ x: 0, y: -R }, { x: s * 0.11, y: 0 }, { x: 0, y: R * 0.86 }]);
    fillStroke(ctx, col, t.ink, LW(s, 0.02));
    polygonPath(ctx, [{ x: 0, y: -R }, { x: -s * 0.11, y: 0 }, { x: 0, y: R * 0.86 }]);
    fillStroke(ctx, t.paper, t.ink, LW(s, 0.02));
    letterN(ctx, 0, -R - s * 0.12, s * 0.15, col, LW(s, 0.03));
  },
});

/* =================================================================
 * MAP PINS
 * ================================================================= */

family({
  id: 'symbols.pin.teardrop', name: 'Map Pin', category: 'symbols',
  tags: ['pin', 'marker', 'location', 'poi'], size: 48, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || pick(rng, [t.danger, t.accent, t.flag, t.water, t.fire]);
    softShadow(ctx, t.shadow, s * 0.12, s * 0.04);
    ctx.beginPath();
    ctx.moveTo(0, s * 0.4);
    ctx.bezierCurveTo(-s * 0.34, -s * 0.02, -s * 0.22, -s * 0.4, 0, -s * 0.4);
    ctx.bezierCurveTo(s * 0.22, -s * 0.4, s * 0.34, -s * 0.02, 0, s * 0.4);
    fillStroke(ctx, fill, t.ink, LW(s, 0.03));
    clearShadow(ctx);
    const inner = pick(rng, ['dot', 'ring', 'star']);
    ctx.fillStyle = t.paper;
    if (inner === 'star') {
      star(ctx, 0, -s * 0.14, 5, s * 0.13, s * 0.06);
      fillStroke(ctx, t.paper, null);
    } else {
      ctx.beginPath(); ctx.arc(0, -s * 0.14, s * 0.13, 0, Math.PI * 2); ctx.fill();
      if (inner === 'ring') {
        ctx.fillStyle = fill;
        ctx.beginPath(); ctx.arc(0, -s * 0.14, s * 0.06, 0, Math.PI * 2); ctx.fill();
      }
    }
  },
});

family({
  id: 'symbols.pin.circle', name: 'Flat Circle Marker', category: 'symbols',
  tags: ['pin', 'marker', 'circle', 'dot', 'poi'], size: 44, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || pick(rng, [t.danger, t.accent, t.leafDark, t.water]);
    softShadow(ctx, t.shadow, s * 0.1, s * 0.04);
    ctx.beginPath(); ctx.arc(0, -s * 0.04, s * 0.34, 0, Math.PI * 2);
    fillStroke(ctx, fill, t.ink, LW(s, 0.035));
    clearShadow(ctx);
    // little pointer notch
    polygonPath(ctx, [{ x: -s * 0.08, y: s * 0.22 }, { x: s * 0.08, y: s * 0.22 }, { x: 0, y: s * 0.42 }]);
    fillStroke(ctx, fill, t.ink, LW(s, 0.03));
    ctx.fillStyle = t.paper;
    ctx.beginPath(); ctx.arc(0, -s * 0.04, s * 0.13, 0, Math.PI * 2); ctx.fill();
  },
});

family({
  id: 'symbols.pin.banner', name: 'Banner Pin', category: 'symbols',
  tags: ['pin', 'banner', 'flag', 'marker'], size: 50, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || pick(rng, [t.flag, t.accent, t.danger, t.gold]);
    // ground dot + pole
    groundShadow(ctx, 0, s * 0.42, s * 0.12, s * 0.04, t.shadow);
    stroke(ctx, t.ink, LW(s, 0.035));
    ctx.beginPath(); ctx.moveTo(-s * 0.22, -s * 0.36); ctx.lineTo(-s * 0.22, s * 0.42); ctx.stroke();
    // banner (rectangle with swallowtail)
    const swallow = chance(rng, 0.5);
    ctx.beginPath();
    ctx.moveTo(-s * 0.22, -s * 0.36);
    ctx.lineTo(s * 0.28, -s * 0.36);
    if (swallow) {
      ctx.lineTo(s * 0.16, -s * 0.16);
      ctx.lineTo(s * 0.28, s * 0.04);
    } else {
      ctx.lineTo(s * 0.28, s * 0.04);
    }
    ctx.lineTo(-s * 0.22, s * 0.04);
    ctx.closePath();
    fillStroke(ctx, fill, t.ink, LW(s, 0.03));
    ctx.fillStyle = t.ink;
    ctx.beginPath(); ctx.arc(-s * 0.22, s * 0.42, s * 0.05, 0, Math.PI * 2); ctx.fill();
  },
});

family({
  id: 'symbols.pin.numbered', name: 'Numbered Pin', category: 'symbols',
  tags: ['pin', 'number', 'marker', 'waypoint'], size: 48, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || t.accent;
    const n = randInt(rng, 1, 9);
    softShadow(ctx, t.shadow, s * 0.12, s * 0.04);
    ctx.beginPath();
    ctx.moveTo(0, s * 0.4);
    ctx.bezierCurveTo(-s * 0.34, -s * 0.02, -s * 0.22, -s * 0.4, 0, -s * 0.4);
    ctx.bezierCurveTo(s * 0.22, -s * 0.4, s * 0.34, -s * 0.02, 0, s * 0.4);
    fillStroke(ctx, fill, t.ink, LW(s, 0.03));
    clearShadow(ctx);
    ctx.fillStyle = t.paper;
    ctx.beginPath(); ctx.arc(0, -s * 0.16, s * 0.16, 0, Math.PI * 2); ctx.fill();
    digit7(ctx, n, 0, -s * 0.16, s * 0.12, s * 0.2, t.ink, LW(s, 0.04));
  },
});

family({
  id: 'symbols.pin.gps', name: 'GPS Location Dot', category: 'symbols',
  tags: ['pin', 'gps', 'location', 'dot', 'here'], size: 40, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || t.accent;
    // soft accuracy halo
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = fill;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    softShadow(ctx, t.shadow, s * 0.1, s * 0.03);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.2, 0, Math.PI * 2);
    fillStroke(ctx, fill, t.white, LW(s, 0.06));
    clearShadow(ctx);
    if (chance(rng, 0.5)) {
      ctx.fillStyle = t.white;
      ctx.beginPath(); ctx.arc(0, 0, s * 0.07, 0, Math.PI * 2); ctx.fill();
    }
  },
});

/* =================================================================
 * POI BADGE GLYPHS
 * ================================================================= */

family({
  id: 'symbols.poi.food', name: 'Food (Fork & Knife)', category: 'symbols',
  tags: ['poi', 'food', 'restaurant', 'fork', 'knife', 'dining'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, g = t.white;
    badge(ctx, s, t, rng, tint || t.danger);
    stroke(ctx, g, LW(s, 0.05));
    const fx = -s * 0.13;
    for (const dx of [-s * 0.06, 0, s * 0.06]) {
      ctx.beginPath(); ctx.moveTo(fx + dx, -s * 0.24); ctx.lineTo(fx + dx, -s * 0.1); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(fx - s * 0.06, -s * 0.1); ctx.lineTo(fx + s * 0.06, -s * 0.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx, -s * 0.1); ctx.lineTo(fx, s * 0.24); ctx.stroke();
    const kx = s * 0.15;
    ctx.beginPath(); ctx.moveTo(kx, -s * 0.02); ctx.lineTo(kx, s * 0.24); ctx.stroke();
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(kx, -s * 0.24); ctx.lineTo(kx + s * 0.05, -s * 0.12); ctx.lineTo(kx, s * 0.0); ctx.closePath(); ctx.fill();
  },
});

family({
  id: 'symbols.poi.lodging', name: 'Lodging (Bed)', category: 'symbols',
  tags: ['poi', 'lodging', 'hotel', 'bed', 'sleep'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, g = t.white;
    badge(ctx, s, t, rng, tint || t.accent);
    stroke(ctx, g, LW(s, 0.045));
    // headboard
    ctx.beginPath(); ctx.moveTo(-s * 0.2, -s * 0.14); ctx.lineTo(-s * 0.2, s * 0.16); ctx.stroke();
    // mattress
    roundRect(ctx, -s * 0.2, s * 0.0, s * 0.42, s * 0.12, s * 0.03);
    fillStroke(ctx, g, null);
    // pillow
    roundRect(ctx, -s * 0.16, -s * 0.06, s * 0.12, s * 0.08, s * 0.02);
    fillStroke(ctx, null, g, LW(s, 0.035));
    // legs
    ctx.beginPath(); ctx.moveTo(-s * 0.18, s * 0.12); ctx.lineTo(-s * 0.18, s * 0.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.2, s * 0.12); ctx.lineTo(s * 0.2, s * 0.2); ctx.stroke();
  },
});

family({
  id: 'symbols.poi.info', name: 'Information', category: 'symbols',
  tags: ['poi', 'info', 'information', 'help'], size: 44, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, g = t.white;
    badge(ctx, s, t, rng, tint || t.accent);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, -s * 0.18, s * 0.055, 0, Math.PI * 2); ctx.fill();
    roundRect(ctx, -s * 0.05, -s * 0.06, s * 0.1, s * 0.28, s * 0.04);
    fillStroke(ctx, g, null);
  },
});

family({
  id: 'symbols.poi.hospital', name: 'Hospital (Cross)', category: 'symbols',
  tags: ['poi', 'hospital', 'medical', 'cross', 'health'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const bfill = tint || t.white;
    const cross = tint ? t.white : t.danger;
    badge(ctx, s, t, rng, bfill);
    const a = s * 0.07, b = s * 0.22;
    ctx.fillStyle = cross;
    roundRect(ctx, -a, -b, a * 2, b * 2, a * 0.4); ctx.fill();
    roundRect(ctx, -b, -a, b * 2, a * 2, a * 0.4); ctx.fill();
  },
});

family({
  id: 'symbols.poi.fuel', name: 'Fuel (Pump)', category: 'symbols',
  tags: ['poi', 'fuel', 'gas', 'petrol', 'pump'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, g = t.white;
    badge(ctx, s, t, rng, tint || t.accent);
    stroke(ctx, g, LW(s, 0.04));
    // pump body
    roundRect(ctx, -s * 0.2, -s * 0.22, s * 0.26, s * 0.44, s * 0.04);
    ctx.stroke();
    // window
    roundRect(ctx, -s * 0.15, -s * 0.16, s * 0.16, s * 0.1, s * 0.02);
    fillStroke(ctx, g, null);
    // nozzle arm
    ctx.beginPath();
    ctx.moveTo(s * 0.06, s * 0.0); ctx.lineTo(s * 0.16, s * 0.0);
    ctx.lineTo(s * 0.16, -s * 0.16); ctx.lineTo(s * 0.1, -s * 0.22);
    ctx.stroke();
  },
});

family({
  id: 'symbols.poi.parking', name: 'Parking (P)', category: 'symbols',
  tags: ['poi', 'parking', 'car', 'letter'], size: 44, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, g = t.white;
    badge(ctx, s, t, rng, tint || t.accent);
    stroke(ctx, g, LW(s, 0.07));
    ctx.beginPath();
    ctx.moveTo(-s * 0.09, s * 0.22);
    ctx.lineTo(-s * 0.09, -s * 0.22);
    ctx.lineTo(s * 0.0, -s * 0.22);
    ctx.arc(s * 0.0, -s * 0.11, s * 0.11, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(-s * 0.09, s * 0.0);
    ctx.stroke();
  },
});

family({
  id: 'symbols.poi.viewpoint', name: 'Viewpoint (Eye)', category: 'symbols',
  tags: ['poi', 'viewpoint', 'lookout', 'eye', 'scenic'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, g = t.white;
    const fill = tint || t.accent;
    badge(ctx, s, t, rng, fill);
    stroke(ctx, g, LW(s, 0.045));
    ctx.beginPath();
    ctx.moveTo(-s * 0.24, 0);
    ctx.quadraticCurveTo(0, -s * 0.2, s * 0.24, 0);
    ctx.quadraticCurveTo(0, s * 0.2, -s * 0.24, 0);
    ctx.closePath(); ctx.stroke();
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.09, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = fill;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.045, 0, Math.PI * 2); ctx.fill();
  },
});

family({
  id: 'symbols.poi.anchor', name: 'Port (Anchor)', category: 'symbols',
  tags: ['poi', 'anchor', 'port', 'harbour', 'marina'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, g = t.white;
    badge(ctx, s, t, rng, tint || t.water);
    stroke(ctx, g, LW(s, 0.05));
    ctx.beginPath(); ctx.arc(0, -s * 0.22, s * 0.06, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.16); ctx.lineTo(0, s * 0.24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.13, -s * 0.06); ctx.lineTo(s * 0.13, -s * 0.06); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, s * 0.04, s * 0.2, Math.PI * 0.12, Math.PI * 0.88); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.2, s * 0.08); ctx.lineTo(-s * 0.24, -s * 0.02); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.2, s * 0.08); ctx.lineTo(s * 0.24, -s * 0.02); ctx.stroke();
  },
});

family({
  id: 'symbols.poi.airport', name: 'Airport (Plane)', category: 'symbols',
  tags: ['poi', 'airport', 'plane', 'flight', 'air'], size: 50, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, g = t.white;
    badge(ctx, s, t, rng, tint || t.accent);
    ctx.save();
    ctx.rotate(rand(rng, -0.2, 0.2));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.26);
    ctx.lineTo(s * 0.04, -s * 0.1);
    ctx.lineTo(s * 0.24, s * 0.02);
    ctx.lineTo(s * 0.24, s * 0.08);
    ctx.lineTo(s * 0.05, s * 0.04);
    ctx.lineTo(s * 0.05, s * 0.16);
    ctx.lineTo(s * 0.13, s * 0.23);
    ctx.lineTo(s * 0.13, s * 0.27);
    ctx.lineTo(0, s * 0.21);
    ctx.lineTo(-s * 0.13, s * 0.27);
    ctx.lineTo(-s * 0.13, s * 0.23);
    ctx.lineTo(-s * 0.05, s * 0.16);
    ctx.lineTo(-s * 0.05, s * 0.04);
    ctx.lineTo(-s * 0.24, s * 0.08);
    ctx.lineTo(-s * 0.24, s * 0.02);
    ctx.lineTo(-s * 0.04, -s * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'symbols.poi.rail', name: 'Railway Station', category: 'symbols',
  tags: ['poi', 'rail', 'train', 'station', 'metro'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, g = t.white, fill = tint || t.accent;
    badge(ctx, s, t, rng, fill);
    // loco body
    roundRect(ctx, -s * 0.17, -s * 0.22, s * 0.34, s * 0.36, s * 0.08);
    fillStroke(ctx, g, null);
    // windows
    ctx.fillStyle = fill;
    roundRect(ctx, -s * 0.12, -s * 0.16, s * 0.24, s * 0.12, s * 0.02); ctx.fill();
    // skirt line
    stroke(ctx, fill, LW(s, 0.03));
    ctx.beginPath(); ctx.moveTo(-s * 0.12, s * 0.02); ctx.lineTo(s * 0.12, s * 0.02); ctx.stroke();
    // wheels
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(-s * 0.09, s * 0.18, s * 0.05, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.09, s * 0.18, s * 0.05, 0, Math.PI * 2); ctx.fill();
  },
});

family({
  id: 'symbols.poi.bus', name: 'Bus Stop', category: 'symbols',
  tags: ['poi', 'bus', 'transit', 'stop'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, g = t.white, fill = tint || t.accent;
    badge(ctx, s, t, rng, fill);
    roundRect(ctx, -s * 0.22, -s * 0.18, s * 0.44, s * 0.3, s * 0.05);
    fillStroke(ctx, g, null);
    ctx.fillStyle = fill;
    roundRect(ctx, -s * 0.17, -s * 0.13, s * 0.34, s * 0.1, s * 0.02); ctx.fill();
    // wheels
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(-s * 0.12, s * 0.16, s * 0.05, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.12, s * 0.16, s * 0.05, 0, Math.PI * 2); ctx.fill();
  },
});

family({
  id: 'symbols.poi.beach', name: 'Beach (Umbrella)', category: 'symbols',
  tags: ['poi', 'beach', 'umbrella', 'coast', 'seaside'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, g = t.white, fill = tint || t.water;
    badge(ctx, s, t, rng, fill);
    // canopy
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-s * 0.24, -s * 0.02);
    ctx.quadraticCurveTo(0, -s * 0.32, s * 0.24, -s * 0.02);
    ctx.closePath(); ctx.fill();
    // canopy ribs
    stroke(ctx, fill, LW(s, 0.025));
    for (const dx of [-s * 0.12, 0, s * 0.12]) {
      ctx.beginPath(); ctx.moveTo(0, -s * 0.18); ctx.lineTo(dx, -s * 0.02); ctx.stroke();
    }
    // pole
    stroke(ctx, g, LW(s, 0.04));
    ctx.beginPath(); ctx.moveTo(0, -s * 0.06); ctx.lineTo(0, s * 0.24); ctx.stroke();
  },
});

family({
  id: 'symbols.poi.danger', name: 'Danger (Skull)', category: 'symbols',
  tags: ['poi', 'danger', 'skull', 'hazard', 'death'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    badge(ctx, s, t, rng, tint || t.danger);
    ctx.fillStyle = t.white;
    ctx.beginPath(); ctx.arc(0, -s * 0.06, s * 0.2, 0, Math.PI * 2); ctx.fill();
    roundRect(ctx, -s * 0.11, s * 0.04, s * 0.22, s * 0.16, s * 0.04); ctx.fill();
    // eyes + nose
    ctx.fillStyle = t.ink;
    ctx.beginPath(); ctx.arc(-s * 0.08, -s * 0.07, s * 0.05, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.08, -s * 0.07, s * 0.05, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.0); ctx.lineTo(-s * 0.03, s * 0.05); ctx.lineTo(s * 0.03, s * 0.05);
    ctx.closePath(); ctx.fill();
    // jaw teeth
    stroke(ctx, t.ink, LW(s, 0.022));
    for (const dx of [-s * 0.05, 0, s * 0.05]) {
      ctx.beginPath(); ctx.moveTo(dx, s * 0.06); ctx.lineTo(dx, s * 0.16); ctx.stroke();
    }
  },
});

family({
  id: 'symbols.poi.treasure', name: 'Treasure Chest', category: 'symbols',
  tags: ['poi', 'treasure', 'chest', 'loot', 'reward'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    badge(ctx, s, t, rng, tint || t.woodDark);
    // body
    roundRect(ctx, -s * 0.2, -s * 0.02, s * 0.4, s * 0.22, s * 0.03);
    fillStroke(ctx, t.wood, t.ink, LW(s, 0.025));
    // lid
    ctx.beginPath();
    ctx.moveTo(-s * 0.22, -s * 0.02);
    ctx.quadraticCurveTo(-s * 0.22, -s * 0.18, 0, -s * 0.18);
    ctx.quadraticCurveTo(s * 0.22, -s * 0.18, s * 0.22, -s * 0.02);
    ctx.closePath();
    fillStroke(ctx, lighten(t.wood, 0.12), t.ink, LW(s, 0.025));
    // bands
    ctx.fillStyle = t.gold;
    roundRect(ctx, -s * 0.03, -s * 0.16, s * 0.06, s * 0.34, s * 0.01); ctx.fill();
    // lock
    ctx.fillStyle = t.gold;
    ctx.beginPath(); ctx.arc(0, s * 0.06, s * 0.045, 0, Math.PI * 2); ctx.fill();
    stroke(ctx, t.ink, LW(s, 0.02)); ctx.stroke();
  },
});

family({
  id: 'symbols.poi.quest', name: 'Quest (Exclamation)', category: 'symbols',
  tags: ['poi', 'quest', 'exclamation', 'objective', 'mission'], size: 44, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, g = t.white;
    badge(ctx, s, t, rng, tint || t.gold);
    const ink = tint ? g : t.ink;
    ctx.fillStyle = ink;
    polygonPath(ctx, [
      { x: -s * 0.06, y: -s * 0.22 }, { x: s * 0.06, y: -s * 0.22 },
      { x: s * 0.035, y: s * 0.06 }, { x: -s * 0.035, y: s * 0.06 },
    ]);
    ctx.fill();
    ctx.beginPath(); ctx.arc(0, s * 0.17, s * 0.055, 0, Math.PI * 2); ctx.fill();
  },
});

family({
  id: 'symbols.poi.shop', name: 'Shop (Bag)', category: 'symbols',
  tags: ['poi', 'shop', 'store', 'bag', 'market', 'retail'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, g = t.white;
    badge(ctx, s, t, rng, tint || t.accent);
    // bag body
    roundRect(ctx, -s * 0.16, -s * 0.1, s * 0.32, s * 0.3, s * 0.04);
    fillStroke(ctx, g, null);
    // handles
    stroke(ctx, g, LW(s, 0.035));
    ctx.beginPath(); ctx.arc(-s * 0.06, -s * 0.1, s * 0.06, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(s * 0.06, -s * 0.1, s * 0.06, Math.PI, 0); ctx.stroke();
  },
});

family({
  id: 'symbols.poi.water', name: 'Water (Drop)', category: 'symbols',
  tags: ['poi', 'water', 'drop', 'spring', 'well'], size: 44, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, g = t.white, fill = tint || t.water;
    badge(ctx, s, t, rng, fill);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.24);
    ctx.bezierCurveTo(s * 0.2, -s * 0.02, s * 0.16, s * 0.22, 0, s * 0.22);
    ctx.bezierCurveTo(-s * 0.16, s * 0.22, -s * 0.2, -s * 0.02, 0, -s * 0.24);
    ctx.fill();
    // highlight
    ctx.fillStyle = fill;
    ctx.beginPath(); ctx.arc(s * 0.05, s * 0.08, s * 0.04, 0, Math.PI * 2); ctx.fill();
  },
});

family({
  id: 'symbols.poi.fire', name: 'Fire (Flame)', category: 'symbols',
  tags: ['poi', 'fire', 'flame', 'camp', 'heat', 'danger'], size: 48, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || t.fire;
    badge(ctx, s, t, rng, fill);
    ctx.fillStyle = t.white;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.26);
    ctx.bezierCurveTo(s * 0.18, -s * 0.06, s * 0.16, s * 0.04, s * 0.1, s * 0.12);
    ctx.bezierCurveTo(s * 0.18, s * 0.16, s * 0.04, s * 0.26, 0, s * 0.24);
    ctx.bezierCurveTo(-s * 0.04, s * 0.26, -s * 0.18, s * 0.16, -s * 0.1, s * 0.12);
    ctx.bezierCurveTo(-s * 0.16, s * 0.04, -s * 0.18, -s * 0.06, 0, -s * 0.26);
    ctx.fill();
    // inner flame
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.04);
    ctx.bezierCurveTo(s * 0.09, s * 0.06, s * 0.06, s * 0.12, 0, s * 0.18);
    ctx.bezierCurveTo(-s * 0.06, s * 0.12, -s * 0.09, s * 0.06, 0, -s * 0.04);
    ctx.fill();
  },
});

family({
  id: 'symbols.poi.star', name: 'Favourite (Star)', category: 'symbols',
  tags: ['poi', 'star', 'favourite', 'rating', 'highlight'], size: 44, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    badge(ctx, s, t, rng, tint || t.accent);
    star(ctx, 0, 0, 5, s * 0.26, s * 0.11);
    fillStroke(ctx, t.gold, t.ink, LW(s, 0.025));
  },
});

family({
  id: 'symbols.poi.flag', name: 'Flag Marker', category: 'symbols',
  tags: ['poi', 'flag', 'marker', 'goal', 'point'], size: 48, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || pick(rng, [t.flag, t.danger, t.accent, t.gold]);
    groundShadow(ctx, 0, s * 0.4, s * 0.16, s * 0.05, t.shadow);
    stroke(ctx, t.ink, LW(s, 0.04));
    ctx.beginPath(); ctx.moveTo(-s * 0.16, -s * 0.36); ctx.lineTo(-s * 0.16, s * 0.4); ctx.stroke();
    const style = pick(rng, ['triangle', 'rect', 'swallow', 'wave']);
    ctx.beginPath();
    ctx.moveTo(-s * 0.16, -s * 0.36);
    if (style === 'triangle') {
      ctx.lineTo(s * 0.26, -s * 0.22);
      ctx.lineTo(-s * 0.16, -s * 0.08);
    } else if (style === 'swallow') {
      ctx.lineTo(s * 0.28, -s * 0.34);
      ctx.lineTo(s * 0.14, -s * 0.18);
      ctx.lineTo(s * 0.28, -s * 0.02);
      ctx.lineTo(-s * 0.16, -s * 0.02);
    } else if (style === 'wave') {
      ctx.quadraticCurveTo(s * 0.02, -s * 0.46, s * 0.16, -s * 0.3);
      ctx.quadraticCurveTo(s * 0.26, -s * 0.18, s * 0.28, -s * 0.04);
      ctx.lineTo(-s * 0.16, -s * 0.04);
    } else {
      ctx.lineTo(s * 0.26, -s * 0.36);
      ctx.lineTo(s * 0.26, -s * 0.06);
      ctx.lineTo(-s * 0.16, -s * 0.06);
    }
    ctx.closePath();
    fillStroke(ctx, fill, t.ink, LW(s, 0.028));
  },
});

/* =================================================================
 * POI SILHOUETTES (no badge)
 * ================================================================= */

family({
  id: 'symbols.poi.camp', name: 'Campsite (Tent)', category: 'symbols',
  tags: ['poi', 'camp', 'tent', 'camping', 'outdoor'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || pick(rng, [t.leafDark, t.danger, t.accent]);
    groundShadow(ctx, 0, s * 0.28, s * 0.34, s * 0.06, t.shadow);
    // tent body
    polygonPath(ctx, [{ x: -s * 0.34, y: s * 0.24 }, { x: 0, y: -s * 0.28 }, { x: s * 0.34, y: s * 0.24 }]);
    fillStroke(ctx, fill, t.ink, LW(s, 0.03));
    // door
    polygonPath(ctx, [{ x: 0, y: -s * 0.06 }, { x: -s * 0.1, y: s * 0.24 }, { x: s * 0.1, y: s * 0.24 }]);
    fillStroke(ctx, darken(typeof fill === 'string' && fill[0] === '#' ? fill : t.leafDark, 0.25), t.ink, LW(s, 0.02));
    // pole tip
    stroke(ctx, t.ink, LW(s, 0.025));
    ctx.beginPath(); ctx.moveTo(0, -s * 0.28); ctx.lineTo(0, -s * 0.38); ctx.stroke();
  },
});

family({
  id: 'symbols.poi.mountain', name: 'Mountain Peak', category: 'symbols',
  tags: ['poi', 'mountain', 'peak', 'summit', 'alpine'], size: 50, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    groundShadow(ctx, 0, s * 0.3, s * 0.36, s * 0.05, t.shadow);
    // back peak
    polygonPath(ctx, [{ x: -s * 0.02, y: s * 0.26 }, { x: s * 0.22, y: -s * 0.18 }, { x: s * 0.42, y: s * 0.26 }]);
    fillStroke(ctx, darken(t.stone, 0.12), t.ink, LW(s, 0.025));
    // front peak
    polygonPath(ctx, [{ x: -s * 0.42, y: s * 0.26 }, { x: -s * 0.08, y: -s * 0.28 }, { x: s * 0.24, y: s * 0.26 }]);
    fillStroke(ctx, tint || t.stone, t.ink, LW(s, 0.028));
    // snow cap
    ctx.fillStyle = t.snow;
    ctx.beginPath();
    ctx.moveTo(-s * 0.08, -s * 0.28);
    ctx.lineTo(-s * 0.2, -s * 0.08);
    ctx.lineTo(-s * 0.12, -s * 0.12);
    ctx.lineTo(-s * 0.04, -s * 0.04);
    ctx.lineTo(s * 0.03, -s * 0.12);
    ctx.lineTo(s * 0.04, -s * 0.06);
    ctx.lineTo(s * 0.08, -s * 0.1);
    ctx.closePath(); ctx.fill();
  },
});

family({
  id: 'symbols.poi.castle', name: 'Castle', category: 'symbols',
  tags: ['poi', 'castle', 'fort', 'keep', 'stronghold'], size: 50, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || t.stone;
    groundShadow(ctx, 0, s * 0.34, s * 0.36, s * 0.05, t.shadow);
    // crenellated silhouette
    const top = -s * 0.18, mid = -s * 0.06, base = s * 0.3;
    ctx.beginPath();
    ctx.moveTo(-s * 0.36, base);
    ctx.lineTo(-s * 0.36, top);
    ctx.lineTo(-s * 0.28, top);
    ctx.lineTo(-s * 0.28, mid);
    ctx.lineTo(-s * 0.2, mid);
    ctx.lineTo(-s * 0.2, top);
    ctx.lineTo(-s * 0.12, top);
    ctx.lineTo(-s * 0.12, mid);
    ctx.lineTo(s * 0.12, mid);
    ctx.lineTo(s * 0.12, top);
    ctx.lineTo(s * 0.2, top);
    ctx.lineTo(s * 0.2, mid);
    ctx.lineTo(s * 0.28, mid);
    ctx.lineTo(s * 0.28, top);
    ctx.lineTo(s * 0.36, top);
    ctx.lineTo(s * 0.36, base);
    ctx.closePath();
    fillStroke(ctx, fill, t.ink, LW(s, 0.028));
    // central keep
    ctx.beginPath();
    ctx.moveTo(-s * 0.1, mid);
    ctx.lineTo(-s * 0.1, -s * 0.34);
    ctx.lineTo(-s * 0.04, -s * 0.34);
    ctx.lineTo(-s * 0.04, -s * 0.42);
    ctx.lineTo(s * 0.04, -s * 0.42);
    ctx.lineTo(s * 0.04, -s * 0.34);
    ctx.lineTo(s * 0.1, -s * 0.34);
    ctx.lineTo(s * 0.1, mid);
    ctx.closePath();
    fillStroke(ctx, lighten(t.stone, 0.08), t.ink, LW(s, 0.025));
    // door
    ctx.fillStyle = t.ink;
    ctx.beginPath();
    ctx.moveTo(-s * 0.05, base);
    ctx.lineTo(-s * 0.05, s * 0.08);
    ctx.quadraticCurveTo(0, s * 0.02, s * 0.05, s * 0.08);
    ctx.lineTo(s * 0.05, base);
    ctx.closePath(); ctx.fill();
  },
});

family({
  id: 'symbols.poi.tree', name: 'Park (Tree)', category: 'symbols',
  tags: ['poi', 'tree', 'park', 'garden', 'nature'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || t.leaf;
    groundShadow(ctx, 0, s * 0.36, s * 0.26, s * 0.05, t.shadow);
    // trunk
    ctx.fillStyle = t.trunk;
    roundRect(ctx, -s * 0.05, -s * 0.02, s * 0.1, s * 0.36, s * 0.02);
    fillStroke(ctx, t.trunk, t.ink, LW(s, 0.022));
    // canopy (three lobes)
    for (const o of [{ x: -s * 0.14, y: -s * 0.06, r: s * 0.18 }, { x: s * 0.14, y: -s * 0.06, r: s * 0.18 }, { x: 0, y: -s * 0.22, r: s * 0.22 }]) {
      ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      fillStroke(ctx, fill, t.ink, LW(s, 0.022));
    }
    // highlight
    ctx.save(); ctx.globalAlpha = 0.4;
    ctx.fillStyle = t.leafLight;
    ctx.beginPath(); ctx.arc(-s * 0.04, -s * 0.26, s * 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

family({
  id: 'symbols.poi.cave', name: 'Cave', category: 'symbols',
  tags: ['poi', 'cave', 'cavern', 'grotto', 'entrance'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    groundShadow(ctx, 0, s * 0.34, s * 0.36, s * 0.05, t.shadow);
    // hill
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, s * 0.3);
    ctx.quadraticCurveTo(-s * 0.32, -s * 0.34, 0, -s * 0.34);
    ctx.quadraticCurveTo(s * 0.32, -s * 0.34, s * 0.4, s * 0.3);
    ctx.closePath();
    fillStroke(ctx, tint || t.stoneDark, t.ink, LW(s, 0.028));
    // cave mouth
    ctx.beginPath();
    ctx.moveTo(-s * 0.18, s * 0.3);
    ctx.quadraticCurveTo(-s * 0.18, -s * 0.06, 0, -s * 0.06);
    ctx.quadraticCurveTo(s * 0.18, -s * 0.06, s * 0.18, s * 0.3);
    ctx.closePath();
    fillStroke(ctx, t.ink, null);
    // stalactite hints
    ctx.fillStyle = t.stoneDark;
    for (const dx of [-s * 0.08, 0, s * 0.08]) {
      ctx.beginPath();
      ctx.moveTo(dx - s * 0.02, s * 0.02); ctx.lineTo(dx + s * 0.02, s * 0.02); ctx.lineTo(dx, s * 0.1);
      ctx.closePath(); ctx.fill();
    }
  },
});

family({
  id: 'symbols.poi.bridge', name: 'Bridge', category: 'symbols',
  tags: ['poi', 'bridge', 'crossing', 'arch'], size: 48, variants: 2,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || t.stone;
    groundShadow(ctx, 0, s * 0.3, s * 0.38, s * 0.05, t.shadow);
    // deck + arch
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, -s * 0.12);
    ctx.lineTo(s * 0.4, -s * 0.12);
    ctx.lineTo(s * 0.4, s * 0.02);
    ctx.lineTo(s * 0.26, s * 0.02);
    ctx.quadraticCurveTo(s * 0.26, s * 0.2, 0, s * 0.2);
    ctx.quadraticCurveTo(-s * 0.26, s * 0.2, -s * 0.26, s * 0.02);
    ctx.lineTo(-s * 0.4, s * 0.02);
    ctx.closePath();
    fillStroke(ctx, fill, t.ink, LW(s, 0.028));
    // water below
    stroke(ctx, t.water, LW(s, 0.03));
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, s * 0.28);
    ctx.quadraticCurveTo(-s * 0.15, s * 0.22, 0, s * 0.28);
    ctx.quadraticCurveTo(s * 0.15, s * 0.34, s * 0.3, s * 0.28);
    ctx.stroke();
    // rail posts
    stroke(ctx, t.ink, LW(s, 0.025));
    for (const dx of [-s * 0.34, s * 0.34]) {
      ctx.beginPath(); ctx.moveTo(dx, -s * 0.12); ctx.lineTo(dx, -s * 0.24); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(-s * 0.36, -s * 0.22); ctx.lineTo(s * 0.36, -s * 0.22); ctx.stroke();
  },
});

family({
  id: 'symbols.poi.lighthouse', name: 'Lighthouse', category: 'symbols',
  tags: ['poi', 'lighthouse', 'beacon', 'coast', 'light'], size: 50, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, band = tint || t.danger;
    groundShadow(ctx, 0, s * 0.4, s * 0.26, s * 0.04, t.shadow);
    // light glow
    ctx.save(); ctx.globalAlpha = 0.5;
    ctx.fillStyle = t.gold;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.3); ctx.lineTo(-s * 0.3, -s * 0.42); ctx.lineTo(-s * 0.3, -s * 0.2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.3); ctx.lineTo(s * 0.3, -s * 0.42); ctx.lineTo(s * 0.3, -s * 0.2); ctx.closePath(); ctx.fill();
    ctx.restore();
    // tapered tower
    ctx.beginPath();
    ctx.moveTo(-s * 0.1, s * 0.36);
    ctx.lineTo(-s * 0.06, -s * 0.18);
    ctx.lineTo(s * 0.06, -s * 0.18);
    ctx.lineTo(s * 0.1, s * 0.36);
    ctx.closePath();
    fillStroke(ctx, t.white, t.ink, LW(s, 0.028));
    // bands
    ctx.save();
    ctx.beginPath(); ctx.rect(-s * 0.12, -s * 0.18, s * 0.24, s * 0.54); ctx.clip();
    ctx.fillStyle = band;
    for (let y = -s * 0.12; y < s * 0.36; y += s * 0.18) {
      ctx.fillRect(-s * 0.14, y, s * 0.28, s * 0.09);
    }
    ctx.restore();
    // re-outline tower
    ctx.beginPath();
    ctx.moveTo(-s * 0.1, s * 0.36); ctx.lineTo(-s * 0.06, -s * 0.18);
    ctx.lineTo(s * 0.06, -s * 0.18); ctx.lineTo(s * 0.1, s * 0.36);
    ctx.closePath();
    fillStroke(ctx, null, t.ink, LW(s, 0.028));
    // lantern room
    ctx.fillStyle = t.gold;
    roundRect(ctx, -s * 0.08, -s * 0.3, s * 0.16, s * 0.12, s * 0.02);
    fillStroke(ctx, t.gold, t.ink, LW(s, 0.025));
    // roof
    polygonPath(ctx, [{ x: -s * 0.1, y: -s * 0.3 }, { x: s * 0.1, y: -s * 0.3 }, { x: 0, y: -s * 0.42 }]);
    fillStroke(ctx, t.roof, t.ink, LW(s, 0.025));
  },
});

family({
  id: 'symbols.poi.windmill', name: 'Windmill', category: 'symbols',
  tags: ['poi', 'windmill', 'mill', 'wind'], size: 50, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || t.stone;
    groundShadow(ctx, 0, s * 0.4, s * 0.24, s * 0.04, t.shadow);
    // tower (tapered)
    ctx.beginPath();
    ctx.moveTo(-s * 0.14, s * 0.38);
    ctx.lineTo(-s * 0.08, -s * 0.08);
    ctx.lineTo(s * 0.08, -s * 0.08);
    ctx.lineTo(s * 0.14, s * 0.38);
    ctx.closePath();
    fillStroke(ctx, fill, t.ink, LW(s, 0.028));
    // cap
    polygonPath(ctx, [{ x: -s * 0.1, y: -s * 0.08 }, { x: s * 0.1, y: -s * 0.08 }, { x: 0, y: -s * 0.2 }]);
    fillStroke(ctx, t.roof, t.ink, LW(s, 0.025));
    // sails
    ctx.save();
    ctx.translate(0, -s * 0.1);
    ctx.rotate(rand(rng, 0, Math.PI / 2));
    stroke(ctx, t.ink, LW(s, 0.03));
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.rotate((i / 4) * Math.PI * 2);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -s * 0.3); ctx.stroke();
      ctx.fillStyle = t.cloth;
      polygonPath(ctx, [{ x: 0, y: -s * 0.08 }, { x: s * 0.05, y: -s * 0.1 }, { x: s * 0.03, y: -s * 0.3 }, { x: 0, y: -s * 0.3 }]);
      fillStroke(ctx, t.cloth, t.ink, LW(s, 0.02));
      ctx.restore();
    }
    ctx.fillStyle = t.metal;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.035, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
});

/* =================================================================
 * SCALE / GRID / LEGEND
 * ================================================================= */

family({
  id: 'symbols.scale.ruler', name: 'Scale Bar (Ruler)', category: 'symbols',
  tags: ['scale', 'ruler', 'bar', 'distance', 'legend'], size: 120, variants: 3,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme.sprite, w = s * 0.8, x0 = -w / 2;
    const segs = randInt(rng, 4, 5);
    stroke(ctx, t.ink, LW(s, 0.02));
    // baseline
    ctx.beginPath(); ctx.moveTo(x0, s * 0.05); ctx.lineTo(x0 + w, s * 0.05); ctx.stroke();
    for (let i = 0; i <= segs; i++) {
      const x = x0 + (w / segs) * i;
      const h = s * 0.1;
      ctx.beginPath(); ctx.moveTo(x, s * 0.05); ctx.lineTo(x, s * 0.05 - h); ctx.stroke();
      // minor tick
      if (i < segs) {
        const xm = x + w / segs / 2;
        ctx.beginPath(); ctx.moveTo(xm, s * 0.05); ctx.lineTo(xm, s * 0.05 - h * 0.5); ctx.stroke();
      }
    }
    // labels: 0 .. segs
    digit7(ctx, 0, x0, s * 0.16, s * 0.05, s * 0.09, t.ink, LW(s, 0.018));
    digit7(ctx, segs, x0 + w, s * 0.16, s * 0.05, s * 0.09, t.ink, LW(s, 0.018));
  },
});

family({
  id: 'symbols.scale.segmented', name: 'Scale Bar (Segmented)', category: 'symbols',
  tags: ['scale', 'bar', 'segmented', 'checker', 'distance'], size: 120, variants: 3,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme.sprite, w = s * 0.8, x0 = -w / 2, h = s * 0.1, y = -h / 2;
    const segs = randInt(rng, 4, 6);
    const sw = w / segs;
    for (let i = 0; i < segs; i++) {
      ctx.fillStyle = i % 2 ? t.paper : t.ink;
      ctx.fillRect(x0 + i * sw, y, sw, h);
    }
    stroke(ctx, t.ink, LW(s, 0.02));
    ctx.strokeRect(x0, y, w, h);
    // end ticks + labels
    for (let i = 0; i <= segs; i += Math.ceil(segs / 2)) {
      const x = x0 + sw * i;
      ctx.beginPath(); ctx.moveTo(x, y - s * 0.02); ctx.lineTo(x, y - s * 0.06); ctx.stroke();
      digit7(ctx, i, x, y - s * 0.13, s * 0.05, s * 0.08, t.ink, LW(s, 0.018));
    }
  },
});

family({
  id: 'symbols.grid.graticule', name: 'Graticule Stamp', category: 'symbols',
  tags: ['grid', 'graticule', 'coordinates', 'lat', 'long'], size: 110, variants: 2,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme.sprite, R = s * 0.4;
    stroke(ctx, t.ink, LW(s, 0.014));
    ctx.strokeRect(-R, -R, R * 2, R * 2);
    // inner grid
    ctx.save(); ctx.globalAlpha = 0.55;
    for (let i = 1; i < 4; i++) {
      const p = -R + (R * 2 / 4) * i;
      ctx.beginPath(); ctx.moveTo(p, -R); ctx.lineTo(p, R); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-R, p); ctx.lineTo(R, p); ctx.stroke();
    }
    ctx.restore();
    // corner tick crosses
    stroke(ctx, t.ink, LW(s, 0.02));
    for (const cx of [-R, R]) for (const cy of [-R, R]) {
      ctx.beginPath(); ctx.moveTo(cx - s * 0.04, cy); ctx.lineTo(cx + s * 0.04, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.04); ctx.lineTo(cx, cy + s * 0.04); ctx.stroke();
    }
    // degree marks
    ctx.fillStyle = t.ink;
    for (let i = 0; i <= 4; i++) {
      const p = -R + (R * 2 / 4) * i;
      ctx.beginPath(); ctx.arc(p, -R - s * 0.04, s * 0.012, 0, Math.PI * 2); ctx.fill();
    }
  },
});

family({
  id: 'symbols.legend.frame', name: 'Legend Frame', category: 'symbols',
  tags: ['legend', 'key', 'frame', 'box'], size: 120, variants: 3,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme.sprite, W = s * 0.84, H = s * 0.78, x = -W / 2, y = -H / 2;
    softShadow(ctx, t.shadow, s * 0.06, s * 0.03);
    roundRect(ctx, x, y, W, H, s * 0.03);
    fillStroke(ctx, t.paper, t.ink, LW(s, 0.02));
    clearShadow(ctx);
    // inner border
    ctx.save(); ctx.globalAlpha = 0.6;
    roundRect(ctx, x + s * 0.03, y + s * 0.03, W - s * 0.06, H - s * 0.06, s * 0.02);
    fillStroke(ctx, null, t.ink, LW(s, 0.012));
    ctx.restore();
    // title bar
    ctx.fillStyle = t.accent;
    roundRect(ctx, x + s * 0.06, y + s * 0.06, W - s * 0.12, s * 0.1, s * 0.015);
    fillStroke(ctx, t.accent, t.ink, LW(s, 0.012));
    // legend rows
    const swatches = [t.water, t.leaf, t.danger];
    for (let i = 0; i < 3; i++) {
      const ry = y + s * 0.24 + i * s * 0.16;
      ctx.fillStyle = swatches[i];
      roundRect(ctx, x + s * 0.08, ry, s * 0.1, s * 0.08, s * 0.01);
      fillStroke(ctx, swatches[i], t.ink, LW(s, 0.012));
      stroke(ctx, t.ink, LW(s, 0.014));
      ctx.beginPath();
      ctx.moveTo(x + s * 0.24, ry + s * 0.04);
      ctx.lineTo(x + W - s * 0.1, ry + s * 0.04);
      ctx.stroke();
    }
  },
});

/* =================================================================
 * CARTOUCHES
 * ================================================================= */

family({
  id: 'symbols.cartouche.ribbon', name: 'Banner Ribbon', category: 'symbols',
  tags: ['cartouche', 'banner', 'ribbon', 'title', 'scroll'], size: 130, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || t.cloth, W = s * 0.36, H = s * 0.16;
    softShadow(ctx, t.shadow, s * 0.06, s * 0.03);
    // tails
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(dir * W, -H * 0.7);
      ctx.lineTo(dir * (W + s * 0.16), -H * 0.7);
      ctx.lineTo(dir * (W + s * 0.1), 0);
      ctx.lineTo(dir * (W + s * 0.16), H * 0.7);
      ctx.lineTo(dir * W, H * 0.7);
      ctx.closePath();
      fillStroke(ctx, darken(t.cloth, 0.2), t.ink, LW(s, 0.016));
    }
    clearShadow(ctx);
    // fold shadows
    for (const dir of [-1, 1]) {
      polygonPath(ctx, [
        { x: dir * W, y: -H }, { x: dir * (W - s * 0.06), y: -H * 0.6 },
        { x: dir * (W - s * 0.06), y: H * 0.6 }, { x: dir * W, y: H },
      ]);
      fillStroke(ctx, darken(t.cloth, 0.32), t.ink, LW(s, 0.014));
    }
    // central plate
    roundRect(ctx, -W, -H, W * 2, H * 2, s * 0.02);
    fillStroke(ctx, fill, t.ink, LW(s, 0.02));
    // inner rule
    ctx.save(); ctx.globalAlpha = 0.5;
    stroke(ctx, t.ink, LW(s, 0.012));
    ctx.beginPath(); ctx.moveTo(-W + s * 0.05, 0); ctx.lineTo(W - s * 0.05, 0); ctx.stroke();
    ctx.restore();
  },
});

family({
  id: 'symbols.cartouche.scroll', name: 'Title Scroll', category: 'symbols',
  tags: ['cartouche', 'scroll', 'parchment', 'title'], size: 128, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || t.paper, W = s * 0.32, H = s * 0.2;
    softShadow(ctx, t.shadow, s * 0.06, s * 0.03);
    // body
    ctx.beginPath();
    ctx.moveTo(-W, -H);
    ctx.quadraticCurveTo(0, -H - s * 0.04, W, -H);
    ctx.lineTo(W, H);
    ctx.quadraticCurveTo(0, H + s * 0.04, -W, H);
    ctx.closePath();
    fillStroke(ctx, fill, t.ink, LW(s, 0.02));
    clearShadow(ctx);
    // curled ends
    for (const dir of [-1, 1]) {
      ctx.save();
      ctx.translate(dir * W, 0);
      ctx.fillStyle = darken(t.paper, 0.12);
      roundRect(ctx, -s * 0.04, -H - s * 0.02, s * 0.08, H * 2 + s * 0.04, s * 0.04);
      fillStroke(ctx, darken(t.paper, 0.1), t.ink, LW(s, 0.016));
      stroke(ctx, t.ink, LW(s, 0.014));
      ctx.beginPath(); ctx.arc(0, -H, s * 0.03, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, H, s * 0.03, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    // text rules
    ctx.save(); ctx.globalAlpha = 0.4;
    stroke(ctx, t.ink, LW(s, 0.012));
    for (const dy of [-s * 0.06, 0, s * 0.06]) {
      ctx.beginPath(); ctx.moveTo(-W + s * 0.08, dy); ctx.lineTo(W - s * 0.08, dy); ctx.stroke();
    }
    ctx.restore();
  },
});

family({
  id: 'symbols.cartouche.plate', name: 'Ornate Title Plate', category: 'symbols',
  tags: ['cartouche', 'plate', 'frame', 'ornate', 'title'], size: 124, variants: 2,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, W = s * 0.78, H = s * 0.5, x = -W / 2, y = -H / 2;
    softShadow(ctx, t.shadow, s * 0.06, s * 0.03);
    roundRect(ctx, x, y, W, H, s * 0.05);
    fillStroke(ctx, tint || t.paper, t.ink, LW(s, 0.022));
    clearShadow(ctx);
    // double inner frame
    roundRect(ctx, x + s * 0.04, y + s * 0.04, W - s * 0.08, H - s * 0.08, s * 0.04);
    fillStroke(ctx, null, t.gold, LW(s, 0.016));
    // corner flourishes
    stroke(ctx, t.gold, LW(s, 0.016));
    const cor = [[x + s * 0.04, y + s * 0.04, 1, 1], [x + W - s * 0.04, y + s * 0.04, -1, 1], [x + s * 0.04, y + H - s * 0.04, 1, -1], [x + W - s * 0.04, y + H - s * 0.04, -1, -1]];
    for (const [cx, cy, sx, sy] of cor) {
      ctx.beginPath();
      ctx.moveTo(cx + sx * s * 0.08, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy + sy * s * 0.08);
      ctx.stroke();
      ctx.fillStyle = t.gold;
      ctx.beginPath(); ctx.arc(cx, cy, s * 0.012, 0, Math.PI * 2); ctx.fill();
    }
    // center rule
    ctx.save(); ctx.globalAlpha = 0.5;
    stroke(ctx, t.ink, LW(s, 0.012));
    ctx.beginPath(); ctx.moveTo(x + s * 0.12, 0); ctx.lineTo(x + W - s * 0.12, 0); ctx.stroke();
    ctx.restore();
  },
});

/* =================================================================
 * MARKS / ROUTES / MILESTONE
 * ================================================================= */

family({
  id: 'symbols.mark.x', name: 'X Marks the Spot', category: 'symbols',
  tags: ['mark', 'x', 'cross', 'treasure', 'spot'], size: 48, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, col = tint || t.danger, r = s * 0.26;
    const style = pick(rng, ['plain', 'circle', 'dots', 'dashed']);
    if (style === 'circle') {
      stroke(ctx, t.ink, LW(s, 0.025));
      ctx.beginPath(); ctx.arc(0, 0, s * 0.36, 0, Math.PI * 2); ctx.stroke();
    }
    stroke(ctx, col, LW(s, 0.09));
    if (style === 'dashed') ctx.setLineDash([s * 0.08, s * 0.05]);
    ctx.beginPath(); ctx.moveTo(-r, -r); ctx.lineTo(r, r); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r, -r); ctx.lineTo(-r, r); ctx.stroke();
    ctx.setLineDash([]);
    if (style === 'dots') {
      ctx.fillStyle = t.ink;
      for (const p of [[-r, -r], [r, -r], [-r, r], [r, r]]) {
        ctx.beginPath(); ctx.arc(p[0], p[1], s * 0.04, 0, Math.PI * 2); ctx.fill();
      }
    }
  },
});

family({
  id: 'symbols.route.straight', name: 'Route Arrow (Dashed)', category: 'symbols',
  tags: ['route', 'arrow', 'path', 'direction', 'dashed'], size: 56, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, col = tint || t.accent;
    ctx.save();
    ctx.rotate(rand(rng, -0.2, 0.2));
    stroke(ctx, col, LW(s, 0.07));
    ctx.setLineDash([s * 0.1, s * 0.07]);
    ctx.beginPath(); ctx.moveTo(-s * 0.36, 0); ctx.lineTo(s * 0.18, 0); ctx.stroke();
    ctx.setLineDash([]);
    polygonPath(ctx, [{ x: s * 0.4, y: 0 }, { x: s * 0.16, y: -s * 0.14 }, { x: s * 0.16, y: s * 0.14 }]);
    fillStroke(ctx, col, t.ink, LW(s, 0.025));
    ctx.restore();
  },
});

family({
  id: 'symbols.route.curved', name: 'Route Arrow (Curved)', category: 'symbols',
  tags: ['route', 'arrow', 'path', 'direction', 'curve'], size: 56, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, col = tint || t.accent;
    const cx = rand(rng, -s * 0.2, s * 0.05), cy = -s * 0.32;
    stroke(ctx, col, LW(s, 0.07));
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, s * 0.22);
    ctx.quadraticCurveTo(cx, cy, s * 0.24, -s * 0.06);
    ctx.stroke();
    // arrowhead aligned to end tangent
    const ex = s * 0.24, ey = -s * 0.06;
    let dx = ex - cx, dy = ey - cy;
    const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
    const px = -dy, py = dx, w = s * 0.12;
    const back = { x: ex - dx * s * 0.16, y: ey - dy * s * 0.16 };
    polygonPath(ctx, [
      { x: ex + dx * s * 0.06, y: ey + dy * s * 0.06 },
      { x: back.x + px * w, y: back.y + py * w },
      { x: back.x - px * w, y: back.y - py * w },
    ]);
    fillStroke(ctx, col, t.ink, LW(s, 0.025));
  },
});

family({
  id: 'symbols.route.dotted', name: 'Dotted Path', category: 'symbols',
  tags: ['route', 'path', 'dotted', 'trail', 'walk'], size: 52, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, col = tint || t.danger;
    const cx = rand(rng, -s * 0.2, s * 0.2), cy = rand(rng, -s * 0.3, -s * 0.1);
    const n = 7;
    for (let i = 0; i <= n; i++) {
      const u = i / n, iv = 1 - u;
      const x = iv * iv * (-s * 0.34) + 2 * iv * u * cx + u * u * (s * 0.34);
      const y = iv * iv * (s * 0.28) + 2 * iv * u * cy + u * u * (s * 0.24);
      const r = (i === 0 || i === n) ? s * 0.07 : s * 0.035;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      fillStroke(ctx, (i === 0 || i === n) ? col : t.ink, (i === 0 || i === n) ? t.ink : null, LW(s, 0.022));
    }
  },
});

family({
  id: 'symbols.route.milestone', name: 'Milestone', category: 'symbols',
  tags: ['route', 'milestone', 'marker', 'distance', 'post'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || t.stone;
    groundShadow(ctx, 0, s * 0.4, s * 0.2, s * 0.04, t.shadow);
    // rounded-top post
    ctx.beginPath();
    ctx.moveTo(-s * 0.18, s * 0.36);
    ctx.lineTo(-s * 0.18, -s * 0.1);
    ctx.quadraticCurveTo(-s * 0.18, -s * 0.28, 0, -s * 0.28);
    ctx.quadraticCurveTo(s * 0.18, -s * 0.28, s * 0.18, -s * 0.1);
    ctx.lineTo(s * 0.18, s * 0.36);
    ctx.closePath();
    fillStroke(ctx, fill, t.ink, LW(s, 0.028));
    // band
    ctx.fillStyle = t.accent;
    roundRect(ctx, -s * 0.18, -s * 0.16, s * 0.36, s * 0.1, s * 0.01);
    fillStroke(ctx, t.accent, t.ink, LW(s, 0.014));
    // number
    digit7(ctx, randInt(rng, 1, 9), 0, s * 0.1, s * 0.1, s * 0.18, t.ink, LW(s, 0.04));
  },
});

/* =================================================================
 * WEATHER
 * ================================================================= */

family({
  id: 'symbols.weather.sun', name: 'Sun', category: 'symbols',
  tags: ['weather', 'sun', 'clear', 'fair', 'sunny'], size: 52, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, col = tint || t.gold;
    // glow
    ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.34, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // rays
    stroke(ctx, col, LW(s, 0.05));
    const rays = pick(rng, [8, 12]);
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * s * 0.28, Math.sin(a) * s * 0.28);
      ctx.lineTo(Math.cos(a) * s * 0.4, Math.sin(a) * s * 0.4);
      ctx.stroke();
    }
    // disc
    ctx.beginPath(); ctx.arc(0, 0, s * 0.2, 0, Math.PI * 2);
    fillStroke(ctx, col, t.ink, LW(s, 0.03));
  },
});

family({
  id: 'symbols.weather.cloud', name: 'Cloud', category: 'symbols',
  tags: ['weather', 'cloud', 'overcast', 'cloudy'], size: 50, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || t.white;
    cloudPath(ctx, s, rng);
    fillStroke(ctx, fill, t.ink, LW(s, 0.03));
  },
});

family({
  id: 'symbols.weather.rain', name: 'Rain', category: 'symbols',
  tags: ['weather', 'rain', 'shower', 'wet'], size: 50, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    ctx.save();
    ctx.translate(0, -s * 0.08);
    cloudPath(ctx, s * 0.92, rng);
    fillStroke(ctx, t.white, t.ink, LW(s, 0.03));
    ctx.restore();
    // drops
    stroke(ctx, tint || t.water, LW(s, 0.045));
    for (const dx of [-s * 0.18, 0, s * 0.18]) {
      const j = jitter(rng, s * 0.03);
      ctx.beginPath();
      ctx.moveTo(dx + j, s * 0.14); ctx.lineTo(dx + j - s * 0.04, s * 0.3);
      ctx.stroke();
    }
  },
});

family({
  id: 'symbols.weather.snow', name: 'Snowflake', category: 'symbols',
  tags: ['weather', 'snow', 'snowflake', 'cold', 'winter'], size: 48, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, col = tint || t.accent, R = s * 0.36;
    stroke(ctx, col, LW(s, 0.04));
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate((i / 6) * Math.PI * 2);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -R); ctx.stroke();
      // branches
      for (const yy of [-R * 0.5, -R * 0.78]) {
        ctx.beginPath();
        ctx.moveTo(0, yy); ctx.lineTo(s * 0.08, yy - s * 0.08); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, yy); ctx.lineTo(-s * 0.08, yy - s * 0.08); ctx.stroke();
      }
      ctx.restore();
    }
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.04, 0, Math.PI * 2); ctx.fill();
  },
});

family({
  id: 'symbols.weather.wind', name: 'Wind Swirl', category: 'symbols',
  tags: ['weather', 'wind', 'breeze', 'swirl', 'gust'], size: 50, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, col = tint || t.accent;
    stroke(ctx, col, LW(s, 0.05));
    // two gust lines with curled ends
    ctx.beginPath();
    ctx.moveTo(-s * 0.36, -s * 0.12);
    ctx.lineTo(s * 0.18, -s * 0.12);
    ctx.arc(s * 0.18, -s * 0.04, s * 0.08, -Math.PI / 2, Math.PI * 0.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-s * 0.36, s * 0.1);
    ctx.lineTo(s * 0.26, s * 0.1);
    ctx.arc(s * 0.26, s * 0.02, s * 0.08, Math.PI / 2, -Math.PI * 0.9, true);
    ctx.stroke();
    if (chance(rng, 0.6)) {
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, s * 0.3);
      ctx.lineTo(s * 0.05, s * 0.3);
      ctx.stroke();
    }
  },
});

/* =================================================================
 * HERALDRY CHARGES
 * ================================================================= */

family({
  id: 'symbols.heraldry.fleur', name: 'Fleur-de-Lis', category: 'symbols',
  tags: ['heraldry', 'fleur', 'lily', 'charge', 'french'], size: 50, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || pick(rng, [t.gold, t.accent, t.flag]);
    ctx.save();
    ctx.translate(0, s * 0.06);
    fleurDeLis(ctx, s * 0.4, fill, t.ink, LW(s, 0.028));
    ctx.restore();
  },
});

family({
  id: 'symbols.heraldry.cross', name: 'Heraldic Cross', category: 'symbols',
  tags: ['heraldry', 'cross', 'charge', 'shield'], size: 50, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || pick(rng, [t.danger, t.gold, t.accent, t.ink]);
    const style = pick(rng, ['latin', 'pattee', 'potent', 'plain']);
    const a = s * 0.08;
    if (style === 'pattee') {
      ctx.beginPath();
      ctx.moveTo(-a, -s * 0.36);
      ctx.quadraticCurveTo(0, -s * 0.16, a, -s * 0.36);
      ctx.lineTo(s * 0.36, -a);
      ctx.quadraticCurveTo(s * 0.16, 0, s * 0.36, a);
      ctx.lineTo(a, s * 0.36);
      ctx.quadraticCurveTo(0, s * 0.16, -a, s * 0.36);
      ctx.lineTo(-s * 0.36, a);
      ctx.quadraticCurveTo(-s * 0.16, 0, -s * 0.36, -a);
      ctx.closePath();
      fillStroke(ctx, fill, t.ink, LW(s, 0.025));
    } else {
      const reach = style === 'latin' ? s * 0.4 : s * 0.34;
      const up = style === 'latin' ? s * 0.26 : s * 0.34;
      ctx.fillStyle = fill;
      roundRect(ctx, -a, -up, a * 2, up + reach, a * 0.3); ctx.fill();
      roundRect(ctx, -s * 0.34, -a, s * 0.68, a * 2, a * 0.3); ctx.fill();
      // re-outline union
      stroke(ctx, t.ink, LW(s, 0.022));
      roundRect(ctx, -a, -up, a * 2, up + reach, a * 0.3); ctx.stroke();
      roundRect(ctx, -s * 0.34, -a, s * 0.68, a * 2, a * 0.3); ctx.stroke();
      if (style === 'potent') {
        stroke(ctx, t.ink, LW(s, 0.022));
        for (const [ex, ey, hx, hy] of [[0, -up, 1, 0], [0, reach, 1, 0], [-s * 0.34, 0, 0, 1], [s * 0.34, 0, 0, 1]]) {
          ctx.beginPath();
          ctx.moveTo(ex - hx * s * 0.07 - hy * 0, ey - hy * s * 0.07 - hx * 0);
          ctx.lineTo(ex + hx * s * 0.07, ey + hy * s * 0.07);
          ctx.stroke();
        }
      }
    }
  },
});

family({
  id: 'symbols.heraldry.crown', name: 'Crown', category: 'symbols',
  tags: ['heraldry', 'crown', 'king', 'royal', 'charge'], size: 50, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || t.gold;
    groundShadow(ctx, 0, s * 0.32, s * 0.3, s * 0.04, t.shadow);
    // band
    roundRect(ctx, -s * 0.32, s * 0.1, s * 0.64, s * 0.16, s * 0.03);
    fillStroke(ctx, fill, t.ink, LW(s, 0.028));
    // points
    const pts = randInt(rng, 3, 5);
    ctx.beginPath();
    ctx.moveTo(-s * 0.32, s * 0.12);
    ctx.lineTo(-s * 0.32, -s * 0.16);
    for (let i = 0; i < pts; i++) {
      const x = -s * 0.32 + (s * 0.64 / (pts - 1)) * i;
      ctx.lineTo(x, s * 0.0);
      if (i < pts - 1) {
        const nx = -s * 0.32 + (s * 0.64 / (pts - 1)) * (i + 1);
        ctx.lineTo((x + nx) / 2, -s * 0.16 - (i % 2) * s * 0.06);
      }
    }
    ctx.lineTo(s * 0.32, -s * 0.16);
    ctx.lineTo(s * 0.32, s * 0.12);
    ctx.closePath();
    fillStroke(ctx, fill, t.ink, LW(s, 0.028));
    // jewels
    ctx.fillStyle = t.danger;
    for (let i = 0; i < pts; i++) {
      const x = -s * 0.32 + (s * 0.64 / (pts - 1)) * i;
      ctx.beginPath(); ctx.arc(x, -s * 0.02, s * 0.035, 0, Math.PI * 2); ctx.fill();
    }
    // band gems
    ctx.fillStyle = t.accent;
    for (const dx of [-s * 0.16, 0, s * 0.16]) {
      ctx.beginPath(); ctx.arc(dx, s * 0.18, s * 0.03, 0, Math.PI * 2); ctx.fill();
    }
  },
});

family({
  id: 'symbols.heraldry.sword', name: 'Sword', category: 'symbols',
  tags: ['heraldry', 'sword', 'blade', 'weapon', 'charge'], size: 52, variants: 3,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    // blade
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.42);
    ctx.lineTo(s * 0.06, -s * 0.28);
    ctx.lineTo(s * 0.05, s * 0.12);
    ctx.lineTo(-s * 0.05, s * 0.12);
    ctx.lineTo(-s * 0.06, -s * 0.28);
    ctx.closePath();
    fillStroke(ctx, t.metal, t.ink, LW(s, 0.025));
    // fuller
    ctx.save(); ctx.globalAlpha = 0.5;
    stroke(ctx, t.ink, LW(s, 0.014));
    ctx.beginPath(); ctx.moveTo(0, -s * 0.34); ctx.lineTo(0, s * 0.08); ctx.stroke();
    ctx.restore();
    // crossguard
    const guard = tint || t.gold;
    roundRect(ctx, -s * 0.22, s * 0.12, s * 0.44, s * 0.07, s * 0.02);
    fillStroke(ctx, guard, t.ink, LW(s, 0.025));
    // grip
    ctx.fillStyle = t.woodDark;
    roundRect(ctx, -s * 0.04, s * 0.19, s * 0.08, s * 0.16, s * 0.02);
    fillStroke(ctx, t.woodDark, t.ink, LW(s, 0.022));
    // pommel
    ctx.beginPath(); ctx.arc(0, s * 0.38, s * 0.05, 0, Math.PI * 2);
    fillStroke(ctx, guard, t.ink, LW(s, 0.022));
  },
});

family({
  id: 'symbols.heraldry.lion', name: 'Heraldic Lion', category: 'symbols',
  tags: ['heraldry', 'lion', 'beast', 'charge', 'royal'], size: 52, variants: 2,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || t.gold;
    groundShadow(ctx, 0, s * 0.36, s * 0.32, s * 0.04, t.shadow);
    // body (passant, facing left)
    ctx.beginPath();
    ctx.moveTo(-s * 0.34, -s * 0.06);          // chest
    ctx.quadraticCurveTo(-s * 0.4, -s * 0.18, -s * 0.3, -s * 0.2); // head top
    ctx.quadraticCurveTo(-s * 0.22, -s * 0.22, -s * 0.22, -s * 0.12); // muzzle
    ctx.lineTo(-s * 0.16, -s * 0.12);
    ctx.quadraticCurveTo(-s * 0.05, -s * 0.22, s * 0.18, -s * 0.16); // back
    ctx.quadraticCurveTo(s * 0.34, -s * 0.12, s * 0.32, s * 0.0);    // rump
    ctx.lineTo(s * 0.34, s * 0.28);            // back leg
    ctx.lineTo(s * 0.24, s * 0.28);
    ctx.lineTo(s * 0.22, s * 0.06);
    ctx.lineTo(s * 0.04, s * 0.08);
    ctx.lineTo(s * 0.06, s * 0.28);            // mid leg
    ctx.lineTo(-s * 0.04, s * 0.28);
    ctx.lineTo(-s * 0.04, s * 0.06);
    ctx.lineTo(-s * 0.2, s * 0.06);
    ctx.lineTo(-s * 0.18, s * 0.28);           // front leg
    ctx.lineTo(-s * 0.28, s * 0.28);
    ctx.lineTo(-s * 0.34, s * 0.04);
    ctx.closePath();
    fillStroke(ctx, fill, t.ink, LW(s, 0.024));
    // tail
    stroke(ctx, t.ink, LW(s, 0.028));
    ctx.beginPath();
    ctx.moveTo(s * 0.32, -s * 0.02);
    ctx.quadraticCurveTo(s * 0.46, -s * 0.04, s * 0.42, -s * 0.24);
    ctx.stroke();
    ctx.fillStyle = fill;
    ctx.beginPath(); ctx.arc(s * 0.42, -s * 0.26, s * 0.04, 0, Math.PI * 2);
    fillStroke(ctx, fill, t.ink, LW(s, 0.02));
    // eye
    ctx.fillStyle = t.ink;
    ctx.beginPath(); ctx.arc(-s * 0.29, -s * 0.14, s * 0.018, 0, Math.PI * 2); ctx.fill();
  },
});

family({
  id: 'symbols.heraldry.eagle', name: 'Heraldic Eagle', category: 'symbols',
  tags: ['heraldry', 'eagle', 'bird', 'charge', 'imperial'], size: 52, variants: 2,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || t.ink;
    // displayed eagle (spread wings, symmetric)
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.34);                          // head top
    ctx.quadraticCurveTo(s * 0.04, -s * 0.36, s * 0.08, -s * 0.3);
    ctx.lineTo(s * 0.16, -s * 0.3);                    // beak
    ctx.quadraticCurveTo(s * 0.06, -s * 0.24, s * 0.06, -s * 0.18);
    ctx.quadraticCurveTo(s * 0.24, -s * 0.26, s * 0.4, -s * 0.12); // upper wing
    ctx.quadraticCurveTo(s * 0.3, -s * 0.1, s * 0.34, s * 0.02);
    ctx.quadraticCurveTo(s * 0.22, -s * 0.02, s * 0.26, s * 0.12); // lower wing feathers
    ctx.lineTo(s * 0.12, s * 0.08);
    ctx.lineTo(s * 0.16, s * 0.28);                    // tail right
    ctx.lineTo(0, s * 0.22);
    ctx.lineTo(-s * 0.16, s * 0.28);                   // tail left
    ctx.lineTo(-s * 0.12, s * 0.08);
    ctx.lineTo(-s * 0.26, s * 0.12);
    ctx.quadraticCurveTo(-s * 0.22, -s * 0.02, -s * 0.34, s * 0.02);
    ctx.quadraticCurveTo(-s * 0.3, -s * 0.1, -s * 0.4, -s * 0.12);
    ctx.quadraticCurveTo(-s * 0.24, -s * 0.26, -s * 0.06, -s * 0.18);
    ctx.quadraticCurveTo(-s * 0.06, -s * 0.24, -s * 0.16, -s * 0.3);
    ctx.lineTo(-s * 0.08, -s * 0.3);
    ctx.quadraticCurveTo(-s * 0.04, -s * 0.36, 0, -s * 0.34);
    ctx.closePath();
    fillStroke(ctx, fill, t.ink, LW(s, 0.022));
    // eye
    ctx.fillStyle = t.paper;
    ctx.beginPath(); ctx.arc(s * 0.02, -s * 0.26, s * 0.02, 0, Math.PI * 2); ctx.fill();
  },
});

family({
  id: 'symbols.waypoint.diamond', name: 'Waypoint Diamond', category: 'symbols',
  tags: ['waypoint', 'diamond', 'marker', 'node', 'point'], size: 44, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, fill = tint || pick(rng, [t.accent, t.danger, t.gold, t.water]);
    softShadow(ctx, t.shadow, s * 0.1, s * 0.04);
    polygonPath(ctx, [{ x: 0, y: -s * 0.36 }, { x: s * 0.36, y: 0 }, { x: 0, y: s * 0.36 }, { x: -s * 0.36, y: 0 }]);
    fillStroke(ctx, fill, t.ink, LW(s, 0.035));
    clearShadow(ctx);
    if (chance(rng, 0.5)) {
      // inner diamond
      ctx.save(); ctx.globalAlpha = 0.85;
      polygonPath(ctx, [{ x: 0, y: -s * 0.18 }, { x: s * 0.18, y: 0 }, { x: 0, y: s * 0.18 }, { x: -s * 0.18, y: 0 }]);
      fillStroke(ctx, t.paper, null);
      ctx.restore();
    } else {
      ctx.fillStyle = t.paper;
      ctx.beginPath(); ctx.arc(0, 0, s * 0.1, 0, Math.PI * 2); ctx.fill();
    }
  },
});

// Shared cloud silhouette used by several weather glyphs.
function cloudPath(ctx, s, rng) {
  const j = rng ? jitter(rng, s * 0.02) : 0;
  ctx.beginPath();
  ctx.moveTo(-s * 0.3, s * 0.14);
  ctx.arc(-s * 0.16, s * 0.02, s * 0.16, Math.PI * 0.6, Math.PI * 1.5);
  ctx.arc(s * 0.02 + j, -s * 0.08, s * 0.2, Math.PI * 1.1, Math.PI * 1.9);
  ctx.arc(s * 0.22, s * 0.02, s * 0.15, Math.PI * 1.6, Math.PI * 0.5);
  ctx.closePath();
}
