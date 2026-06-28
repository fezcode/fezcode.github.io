import { family } from './registry';
import {
  makeRng, rand, randInt, pick, chance, jitter,
  mix, darken, lighten, withAlpha,
  roundRect, polygonPath, ngon, star, blob, fillStroke, hatch,
  softShadow, clearShadow, groundShadow,
} from './draw';

// ---------------------------------------------------------------------------
// Decorative cartographic flourishes: sea monsters, ships, clouds, frame
// corners, ink work, scrollwork, ribbons, birds and weather. Pure line-art in
// an antique engraving spirit. Theme colours only.
// ---------------------------------------------------------------------------

// Local helpers (module-private; not exported, not imported elsewhere).
const W = (s, k = 0.02) => Math.max(1, s * k);

function dot(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

// Open spiral path (caller does beginPath before, stroke after).
function spiralPath(ctx, cx, cy, r0, turns, dir = 1, startA = 0, shrink = 0.86) {
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const a = startA + dir * f * turns * Math.PI * 2;
    const r = r0 * (1 - f * shrink);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
}

// A small leaf / acanthus bud used by scrollwork and ornate frames.
function leafBud(ctx, x, y, ang, len, wid, fill, ink, lw) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(len * 0.5, -wid, len, 0);
  ctx.quadraticCurveTo(len * 0.5, wid, 0, 0);
  ctx.closePath();
  fillStroke(ctx, fill, ink, lw);
  ctx.restore();
}

// One gull "m" mark for bird flocks.
function gullMark(ctx, x, y, w, dip) {
  ctx.beginPath();
  ctx.moveTo(x - w, y);
  ctx.quadraticCurveTo(x - w * 0.5, y - dip, x, y);
  ctx.quadraticCurveTo(x + w * 0.5, y - dip, x + w, y);
  ctx.stroke();
}

// A wind-bowed square sail for the galleon.
function squareSail(ctx, cx, yardY, halfW, h, fill, ink, lw) {
  ctx.beginPath();
  ctx.moveTo(cx - halfW, yardY);
  ctx.lineTo(cx + halfW, yardY);
  ctx.quadraticCurveTo(cx + halfW * 1.05, yardY + h * 0.5, cx + halfW * 0.7, yardY + h);
  ctx.quadraticCurveTo(cx, yardY + h * 1.15, cx - halfW * 0.7, yardY + h);
  ctx.quadraticCurveTo(cx - halfW * 1.05, yardY + h * 0.5, cx - halfW, yardY);
  ctx.closePath();
  fillStroke(ctx, fill, ink, lw);
  ctx.strokeStyle = withAlpha(ink, 0.3);
  ctx.lineWidth = Math.max(1, lw * 0.6);
  ctx.beginPath();
  ctx.moveTo(cx, yardY);
  ctx.lineTo(cx, yardY + h * 1.05);
  ctx.stroke();
}

// =====================  SEA: monsters & water  =============================

family({
  id: 'decoration.sea.kraken',
  name: 'Kraken',
  category: 'decoration',
  tags: ['kraken', 'monster', 'tentacle', 'octopus', 'sea', 'here be dragons'],
  size: 92,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const body = tint || t.waterDark;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const arms = randInt(rng, 6, 8);
    for (let i = 0; i < arms; i++) {
      const a = (i / arms) * Math.PI * 2 + jitter(rng, 0.18);
      const len = s * rand(rng, 0.34, 0.48);
      const baseR = s * 0.12;
      const x0 = Math.cos(a) * baseR, y0 = Math.sin(a) * baseR;
      const mx = Math.cos(a) * len * 0.6, my = Math.sin(a) * len * 0.6;
      const curl = chance(rng, 0.5) ? 1.5 : -1.5;
      const ex = Math.cos(a) * len + Math.cos(a + curl) * s * 0.16;
      const ey = Math.sin(a) * len + Math.sin(a + curl) * s * 0.16;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(mx, my, ex, ey);
      ctx.strokeStyle = withAlpha(body, 0.8);
      ctx.lineWidth = W(s, 0.055);
      ctx.stroke();
      ctx.strokeStyle = withAlpha(t.ink, 0.7);
      ctx.lineWidth = W(s, 0.014);
      ctx.stroke();
    }
    ctx.fillStyle = withAlpha(body, 0.55);
    ctx.strokeStyle = t.ink;
    ctx.lineWidth = W(s, 0.02);
    blob(ctx, 0, -s * 0.02, s * 0.17, rng, 0.16, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = t.ink;
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(sx * s * 0.06, -s * 0.03, s * 0.025, 0, Math.PI * 2);
      ctx.fill();
    }
  },
});

family({
  id: 'decoration.sea.serpent',
  name: 'Sea Serpent',
  category: 'decoration',
  tags: ['serpent', 'snake', 'monster', 'sea', 'humps', 'here be dragons'],
  size: 90,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const body = tint || t.waterDark;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const n = randInt(rng, 3, 4);
    const w = s * 0.74;
    const x0 = -s * 0.40;
    const seg = w / n;
    const yb = s * 0.12;
    const amp = s * rand(rng, 0.14, 0.2);
    // body humps
    ctx.beginPath();
    ctx.moveTo(x0, yb);
    for (let i = 0; i < n; i++) {
      const xa = x0 + seg * i, xb = x0 + seg * (i + 1);
      const cx = (xa + xb) / 2;
      ctx.quadraticCurveTo(cx, yb - amp * (0.75 + 0.25 * rng()), xb, yb);
    }
    ctx.strokeStyle = withAlpha(body, 0.85);
    ctx.lineWidth = W(s, 0.085);
    ctx.stroke();
    ctx.strokeStyle = t.ink;
    ctx.lineWidth = W(s, 0.015);
    ctx.stroke();
    // head rising past the last hump
    const hx = x0 + w, hy = yb;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.quadraticCurveTo(hx + s * 0.08, hy - amp * 1.1, hx + s * 0.04, hy - amp * 1.45);
    ctx.strokeStyle = withAlpha(body, 0.85);
    ctx.lineWidth = W(s, 0.075);
    ctx.stroke();
    ctx.fillStyle = withAlpha(body, 0.85);
    ctx.strokeStyle = t.ink;
    ctx.lineWidth = W(s, 0.016);
    ctx.beginPath();
    ctx.ellipse(hx + s * 0.05, hy - amp * 1.5, s * 0.075, s * 0.05, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    dot(ctx, hx + s * 0.07, hy - amp * 1.55, W(s, 0.018), t.ink);
    // little waterline ticks under the dips
    ctx.strokeStyle = withAlpha(t.waterDark, 0.7);
    ctx.lineWidth = W(s, 0.016);
    for (let i = 0; i <= n; i++) {
      const x = x0 + seg * i;
      ctx.beginPath();
      ctx.moveTo(x - s * 0.05, yb + s * 0.04);
      ctx.quadraticCurveTo(x, yb + s * 0.01, x + s * 0.05, yb + s * 0.04);
      ctx.stroke();
    }
  },
});

family({
  id: 'decoration.sea.whale',
  name: 'Spouting Whale',
  category: 'decoration',
  tags: ['whale', 'spout', 'sea', 'ocean', 'leviathan'],
  size: 88,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const body = tint || t.water;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-s * 0.36, s * 0.02);
    ctx.quadraticCurveTo(-s * 0.30, -s * 0.20, 0, -s * 0.18);
    ctx.quadraticCurveTo(s * 0.22, -s * 0.16, s * 0.30, -s * 0.02);
    ctx.quadraticCurveTo(s * 0.40, -s * 0.06, s * 0.42, -s * 0.16);
    ctx.quadraticCurveTo(s * 0.45, -s * 0.02, s * 0.40, s * 0.03);
    ctx.quadraticCurveTo(s * 0.45, s * 0.10, s * 0.40, s * 0.18);
    ctx.quadraticCurveTo(s * 0.33, s * 0.06, s * 0.27, s * 0.08);
    ctx.quadraticCurveTo(s * 0.10, s * 0.20, -s * 0.20, s * 0.18);
    ctx.quadraticCurveTo(-s * 0.34, s * 0.16, -s * 0.36, s * 0.02);
    ctx.closePath();
    fillStroke(ctx, withAlpha(body, 0.55), t.ink, W(s, 0.02));
    // belly line
    ctx.strokeStyle = withAlpha(t.ink, 0.45);
    ctx.lineWidth = W(s, 0.012);
    ctx.beginPath();
    ctx.moveTo(-s * 0.32, s * 0.06);
    ctx.quadraticCurveTo(-s * 0.05, s * 0.13, s * 0.16, s * 0.08);
    ctx.stroke();
    // mouth + eye
    ctx.beginPath();
    ctx.moveTo(-s * 0.36, s * 0.01);
    ctx.quadraticCurveTo(-s * 0.30, s * 0.03, -s * 0.24, s * 0.02);
    ctx.stroke();
    dot(ctx, -s * 0.25, -s * 0.04, W(s, 0.02), t.ink);
    // spout
    const sx = -s * 0.20, sy = -s * 0.18;
    ctx.strokeStyle = withAlpha(tint || t.waterLight, 0.9);
    ctx.lineWidth = W(s, 0.02);
    const jets = randInt(rng, 3, 5);
    for (let i = 0; i < jets; i++) {
      const a = -Math.PI / 2 + (i - (jets - 1) / 2) * 0.30;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(
        sx + Math.cos(a) * s * 0.06, sy + Math.sin(a) * s * 0.16,
        sx + Math.cos(a) * s * 0.10, sy + Math.sin(a) * s * 0.24,
      );
      ctx.stroke();
    }
    ctx.fillStyle = withAlpha(tint || t.waterLight, 0.8);
    for (let i = 0; i < 3; i++) {
      dot(ctx, sx + jitter(rng, s * 0.10), sy - s * 0.22 + jitter(rng, s * 0.04), W(s, 0.02), withAlpha(tint || t.waterLight, 0.8));
    }
  },
});

family({
  id: 'decoration.sea.dolphin',
  name: 'Leaping Dolphin',
  category: 'decoration',
  tags: ['dolphin', 'porpoise', 'leap', 'sea', 'ocean'],
  size: 80,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const body = tint || t.water;
    ctx.save();
    ctx.rotate(jitter(rng, 0.1));
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-s * 0.32, s * 0.16);
    ctx.bezierCurveTo(-s * 0.34, -s * 0.18, s * 0.0, -s * 0.30, s * 0.22, -s * 0.16);
    ctx.lineTo(s * 0.30, -s * 0.04);
    ctx.lineTo(s * 0.42, -s * 0.14);
    ctx.lineTo(s * 0.40, s * 0.0);
    ctx.lineTo(s * 0.30, s * 0.02);
    ctx.bezierCurveTo(s * 0.06, s * 0.04, -s * 0.12, s * 0.10, -s * 0.20, s * 0.20);
    ctx.closePath();
    fillStroke(ctx, withAlpha(body, 0.55), t.ink, W(s, 0.02));
    // dorsal fin
    ctx.beginPath();
    ctx.moveTo(-s * 0.02, -s * 0.27);
    ctx.quadraticCurveTo(s * 0.09, -s * 0.40, s * 0.11, -s * 0.25);
    ctx.closePath();
    fillStroke(ctx, withAlpha(body, 0.55), t.ink, W(s, 0.018));
    // pectoral fin
    ctx.beginPath();
    ctx.moveTo(-s * 0.10, s * 0.06);
    ctx.quadraticCurveTo(-s * 0.04, s * 0.18, s * 0.04, s * 0.10);
    ctx.closePath();
    fillStroke(ctx, withAlpha(darken(body, 0.1), 0.5), t.ink, W(s, 0.016));
    dot(ctx, -s * 0.22, s * 0.02, W(s, 0.02), t.ink);
    ctx.restore();
    // splash where it meets the water
    ctx.strokeStyle = withAlpha(t.waterDark, 0.7);
    ctx.lineWidth = W(s, 0.018);
    for (let i = -1; i <= 1; i++) {
      const x = -s * 0.22 + i * s * 0.10;
      ctx.beginPath();
      ctx.moveTo(x - s * 0.05, s * 0.26);
      ctx.quadraticCurveTo(x, s * 0.20, x + s * 0.05, s * 0.26);
      ctx.stroke();
    }
  },
});

family({
  id: 'decoration.sea.waves',
  name: 'Wave Swells',
  category: 'decoration',
  tags: ['waves', 'sea', 'ocean', 'water', 'ripple', 'swell'],
  size: 72,
  variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.waterDark;
    ctx.strokeStyle = withAlpha(col, 0.9);
    ctx.lineWidth = W(s, 0.025);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const rows = randInt(rng, 3, 4);
    const amp = s * rand(rng, 0.05, 0.08);
    for (let r = 0; r < rows; r++) {
      const y = -s * 0.28 + r * (s * 0.20) + jitter(rng, s * 0.02);
      const step = s * rand(rng, 0.13, 0.16);
      ctx.beginPath();
      for (let x = -s * 0.42; x <= s * 0.42; x += step) {
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + step * 0.5, y - amp, x + step, y);
        if (chance(rng, 0.25)) {
          ctx.moveTo(x + step, y);
          ctx.quadraticCurveTo(x + step * 1.15, y + amp * 0.5, x + step * 1.3, y);
        }
      }
      ctx.stroke();
    }
  },
});

family({
  id: 'decoration.sea.ripples',
  name: 'Ripple Rings',
  category: 'decoration',
  tags: ['ripple', 'rings', 'water', 'concentric', 'pond'],
  size: 72,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.waterDark;
    ctx.lineCap = 'round';
    const rings = randInt(rng, 3, 5);
    const gap = (s * 0.46) / (rings + 0.5);
    for (let i = 1; i <= rings; i++) {
      const r = gap * i * rand(rng, 0.95, 1.05);
      ctx.strokeStyle = withAlpha(col, Math.max(0.2, 0.9 - i * 0.13));
      ctx.lineWidth = Math.max(1, W(s, 0.024) * (1 - i * 0.08));
      if (i > 1 && chance(rng, 0.5)) {
        const segs = randInt(rng, 2, 3);
        for (let k = 0; k < segs; k++) {
          const a0 = (k / segs) * Math.PI * 2 + jitter(rng, 0.3);
          ctx.beginPath();
          ctx.arc(0, 0, r, a0, a0 + rand(rng, 0.8, 1.5));
          ctx.stroke();
        }
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    dot(ctx, jitter(rng, s * 0.02), jitter(rng, s * 0.02), W(s, 0.03), withAlpha(col, 0.8));
  },
});

// =====================  SHIPS  ============================================

family({
  id: 'decoration.ship.silhouette',
  name: 'Sailing Ship',
  category: 'decoration',
  tags: ['ship', 'sail', 'boat', 'sailboat', 'sea', 'silhouette'],
  size: 84,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const ink = t.ink;
    const sail = tint || t.cloth;
    const hull = t.woodDark;
    const lwv = W(s, 0.02);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // mast
    ctx.strokeStyle = ink;
    ctx.lineWidth = W(s, 0.02);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.40);
    ctx.lineTo(0, s * 0.12);
    ctx.stroke();
    // main sail (bowed) and fore sail
    ctx.beginPath();
    ctx.moveTo(s * 0.02, -s * 0.36);
    ctx.quadraticCurveTo(s * 0.28, -s * 0.14, s * 0.02, s * 0.04);
    ctx.closePath();
    fillStroke(ctx, withAlpha(sail, 0.9), ink, lwv);
    ctx.beginPath();
    ctx.moveTo(-s * 0.02, -s * 0.30);
    ctx.quadraticCurveTo(-s * 0.22, -s * 0.12, -s * 0.02, s * 0.02);
    ctx.closePath();
    fillStroke(ctx, withAlpha(sail, 0.9), ink, lwv);
    // pennant
    ctx.fillStyle = withAlpha(tint || t.flag, 0.9);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.40);
    ctx.lineTo(s * 0.14, -s * 0.37);
    ctx.lineTo(0, -s * 0.34);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.lineWidth = W(s, 0.012);
    ctx.stroke();
    // hull
    ctx.beginPath();
    ctx.moveTo(-s * 0.34, s * 0.12);
    ctx.lineTo(s * 0.34, s * 0.12);
    ctx.quadraticCurveTo(s * 0.24, s * 0.28, s * 0.04, s * 0.28);
    ctx.lineTo(-s * 0.16, s * 0.28);
    ctx.quadraticCurveTo(-s * 0.30, s * 0.28, -s * 0.34, s * 0.12);
    ctx.closePath();
    fillStroke(ctx, withAlpha(hull, 0.85), ink, lwv);
    // waterline
    ctx.strokeStyle = withAlpha(t.waterDark, 0.75);
    ctx.lineWidth = W(s, 0.018);
    ctx.beginPath();
    for (let x = -s * 0.46; x <= s * 0.46; x += s * 0.14) {
      ctx.moveTo(x, s * 0.34);
      ctx.quadraticCurveTo(x + s * 0.07, s * 0.30, x + s * 0.14, s * 0.34);
    }
    ctx.stroke();
  },
});

family({
  id: 'decoration.ship.galleon',
  name: 'Galleon',
  category: 'decoration',
  tags: ['galleon', 'ship', 'sails', 'masts', 'sea', 'caravel'],
  size: 94,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const sail = tint || t.cloth;
    const ink = t.ink;
    const hull = t.woodDark;
    const lwv = W(s, 0.016);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    const masts = [
      { x: -s * 0.18, top: -s * 0.30 },
      { x: 0, top: -s * 0.42 },
      { x: s * 0.18, top: -s * 0.32 },
    ];
    masts.forEach((m) => {
      ctx.strokeStyle = t.woodDark;
      ctx.lineWidth = W(s, 0.02);
      ctx.beginPath();
      ctx.moveTo(m.x, m.top);
      ctx.lineTo(m.x, s * 0.02);
      ctx.stroke();
      squareSail(ctx, m.x, m.top + s * 0.04, s * 0.10, s * 0.13, withAlpha(sail, 0.92), ink, lwv);
      squareSail(ctx, m.x, m.top + s * 0.21, s * 0.12, s * 0.15, withAlpha(sail, 0.92), ink, lwv);
      ctx.fillStyle = withAlpha(tint || t.flag, 0.9);
      ctx.strokeStyle = ink;
      ctx.lineWidth = W(s, 0.012);
      ctx.beginPath();
      ctx.moveTo(m.x, m.top);
      ctx.lineTo(m.x + s * 0.10, m.top + s * 0.02);
      ctx.lineTo(m.x, m.top + s * 0.045);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
    // bowsprit
    ctx.strokeStyle = t.woodDark;
    ctx.lineWidth = W(s, 0.02);
    ctx.beginPath();
    ctx.moveTo(-s * 0.28, -s * 0.02);
    ctx.lineTo(-s * 0.46, -s * 0.10);
    ctx.stroke();
    // hull with fore & stern castles
    ctx.beginPath();
    ctx.moveTo(-s * 0.40, s * 0.02);
    ctx.lineTo(-s * 0.30, -s * 0.04);
    ctx.lineTo(s * 0.24, -s * 0.04);
    ctx.lineTo(s * 0.30, -s * 0.12);
    ctx.lineTo(s * 0.40, -s * 0.12);
    ctx.lineTo(s * 0.42, s * 0.02);
    ctx.quadraticCurveTo(s * 0.20, s * 0.24, -s * 0.10, s * 0.22);
    ctx.quadraticCurveTo(-s * 0.32, s * 0.20, -s * 0.40, s * 0.02);
    ctx.closePath();
    fillStroke(ctx, withAlpha(hull, 0.9), ink, lwv);
    // gun ports
    ctx.fillStyle = withAlpha(t.ink, 0.6);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.rect(-s * 0.22 + i * s * 0.10, s * 0.03, s * 0.03, s * 0.03);
      ctx.fill();
    }
    // waterline
    ctx.strokeStyle = withAlpha(t.waterDark, 0.8);
    ctx.lineWidth = W(s, 0.02);
    ctx.beginPath();
    for (let x = -s * 0.46; x <= s * 0.46; x += s * 0.12) {
      ctx.moveTo(x, s * 0.28);
      ctx.quadraticCurveTo(x + s * 0.06, s * 0.24, x + s * 0.12, s * 0.28);
    }
    ctx.stroke();
  },
});

// =====================  CLOUDS  ===========================================

family({
  id: 'decoration.cloud.puffy',
  name: 'Puffy Cloud',
  category: 'decoration',
  tags: ['cloud', 'puffy', 'sky', 'weather', 'cumulus'],
  size: 76,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const fill = tint || t.white;
    ctx.lineJoin = 'round';
    const lobes = randInt(rng, 4, 6);
    const cx0 = -s * 0.28, step = (s * 0.56) / (lobes - 1);
    const baseY = s * 0.16;
    const tops = [];
    ctx.fillStyle = withAlpha(fill, 0.9);
    for (let i = 0; i < lobes; i++) {
      const edge = i === 0 || i === lobes - 1;
      const r = s * rand(rng, 0.12, 0.17) * (edge ? 0.82 : 1);
      const c = { x: cx0 + step * i, y: baseY - r * 0.85 + jitter(rng, s * 0.02), r };
      tops.push(c);
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0, baseY - s * 0.06, s * 0.22, 0, Math.PI * 2);
    ctx.fill();
    roundRect(ctx, -s * 0.30, baseY - s * 0.10, s * 0.60, s * 0.12, s * 0.06);
    ctx.fill();
    // outline: lobed top + flat base
    ctx.strokeStyle = t.ink;
    ctx.lineWidth = W(s, 0.018);
    tops.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, Math.PI * 0.92, Math.PI * 2.08);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(-s * 0.30, baseY);
    ctx.lineTo(s * 0.30, baseY);
    ctx.stroke();
  },
});

family({
  id: 'decoration.cloud.wispy',
  name: 'Wispy Cloud',
  category: 'decoration',
  tags: ['cloud', 'wispy', 'sky', 'weather', 'cirrus', 'streak'],
  size: 76,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.white;
    ctx.lineCap = 'round';
    const lines = randInt(rng, 3, 5);
    for (let i = 0; i < lines; i++) {
      const y = -s * 0.14 + i * (s * 0.11) + jitter(rng, s * 0.02);
      const w = s * rand(rng, 0.5, 0.78) * (1 - i * 0.07);
      ctx.strokeStyle = withAlpha(col, Math.max(0.3, 0.85 - i * 0.12));
      ctx.lineWidth = Math.max(1, W(s, 0.05) * (1 - i * 0.12));
      ctx.beginPath();
      ctx.moveTo(-w / 2, y);
      ctx.bezierCurveTo(-w * 0.2, y - s * 0.05, w * 0.2, y + s * 0.03, w / 2, y);
      ctx.stroke();
    }
    // faint underline
    ctx.strokeStyle = withAlpha(t.ink, 0.3);
    ctx.lineWidth = W(s, 0.012);
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, s * 0.22);
    ctx.bezierCurveTo(-s * 0.1, s * 0.18, s * 0.1, s * 0.25, s * 0.34, s * 0.21);
    ctx.stroke();
  },
});

family({
  id: 'decoration.cloud.storm',
  name: 'Storm Cloud',
  category: 'decoration',
  tags: ['cloud', 'storm', 'lightning', 'rain', 'weather', 'thunder'],
  size: 78,
  variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const fill = tint || t.stoneDark;
    ctx.lineJoin = 'round';
    const lobes = randInt(rng, 4, 5);
    const cx0 = -s * 0.26, step = (s * 0.52) / (lobes - 1);
    const baseY = -s * 0.02;
    const tops = [];
    ctx.fillStyle = withAlpha(fill, 0.7);
    for (let i = 0; i < lobes; i++) {
      const edge = i === 0 || i === lobes - 1;
      const r = s * rand(rng, 0.12, 0.16) * (edge ? 0.85 : 1);
      const c = { x: cx0 + step * i, y: baseY - r * 0.8 + jitter(rng, s * 0.02), r };
      tops.push(c);
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    }
    roundRect(ctx, -s * 0.28, baseY - s * 0.10, s * 0.56, s * 0.12, s * 0.06);
    ctx.fill();
    ctx.strokeStyle = t.ink;
    ctx.lineWidth = W(s, 0.018);
    tops.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, Math.PI * 0.92, Math.PI * 2.08);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(-s * 0.28, baseY);
    ctx.lineTo(s * 0.28, baseY);
    ctx.stroke();
    // lightning bolt
    ctx.fillStyle = withAlpha(tint || t.gold, 0.95);
    ctx.strokeStyle = t.ink;
    ctx.lineWidth = W(s, 0.012);
    ctx.beginPath();
    ctx.moveTo(s * 0.02, baseY + s * 0.02);
    ctx.lineTo(-s * 0.08, baseY + s * 0.20);
    ctx.lineTo(-s * 0.01, baseY + s * 0.20);
    ctx.lineTo(-s * 0.07, baseY + s * 0.40);
    ctx.lineTo(s * 0.10, baseY + s * 0.14);
    ctx.lineTo(s * 0.03, baseY + s * 0.14);
    ctx.lineTo(s * 0.10, baseY + s * 0.02);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // rain
    ctx.strokeStyle = withAlpha(t.waterDark, 0.7);
    ctx.lineWidth = W(s, 0.014);
    for (let i = 0; i < 5; i++) {
      const x = -s * 0.22 + i * s * 0.11;
      if (Math.abs(x) < s * 0.04) continue;
      ctx.beginPath();
      ctx.moveTo(x, baseY + s * 0.06);
      ctx.lineTo(x - s * 0.04, baseY + s * 0.20);
      ctx.stroke();
    }
  },
});

// =====================  FRAME CORNERS & EDGES  ============================

family({
  id: 'decoration.frame.ornate',
  name: 'Ornate Corner',
  category: 'decoration',
  tags: ['frame', 'corner', 'ornate', 'border', 'flourish', 'scroll'],
  size: 124,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const line = tint || t.ink;
    const o = -s * 0.42, inn = -s * 0.32;
    const reach = s * rand(rng, 0.28, 0.34);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // double rule
    ctx.strokeStyle = line;
    ctx.lineWidth = W(s, 0.02);
    ctx.beginPath();
    ctx.moveTo(o, reach);
    ctx.lineTo(o, o);
    ctx.lineTo(reach, o);
    ctx.stroke();
    ctx.lineWidth = W(s, 0.013);
    ctx.beginPath();
    ctx.moveTo(inn, reach * 0.9);
    ctx.lineTo(inn, inn);
    ctx.lineTo(reach * 0.9, inn);
    ctx.stroke();
    // corner spiral blossom
    ctx.lineWidth = W(s, 0.015);
    ctx.beginPath();
    spiralPath(ctx, inn + s * 0.07, inn + s * 0.07, s * 0.15, 1.5, 1, Math.PI * 0.75);
    ctx.stroke();
    // acanthus curls along each arm with leaf buds
    for (const along of [0, 1]) {
      const sign = along === 0 ? 1 : -1; // horizontal vs vertical arm
      ctx.beginPath();
      if (along === 0) {
        ctx.moveTo(inn + s * 0.10, inn);
        ctx.bezierCurveTo(inn + s * 0.22, inn - s * 0.02, inn + s * 0.24, inn + s * 0.12, inn + s * 0.16, inn + s * 0.14);
      } else {
        ctx.moveTo(inn, inn + s * 0.10);
        ctx.bezierCurveTo(inn - s * 0.02, inn + s * 0.22, inn + s * 0.12, inn + s * 0.24, inn + s * 0.14, inn + s * 0.16);
      }
      ctx.lineWidth = W(s, 0.013);
      ctx.stroke();
      void sign;
    }
    leafBud(ctx, inn + s * 0.20, inn + s * 0.04, 0.3, s * 0.10, s * 0.04, withAlpha(line, 0.22), line, W(s, 0.01));
    leafBud(ctx, inn + s * 0.04, inn + s * 0.20, Math.PI / 2 - 0.3, s * 0.10, s * 0.04, withAlpha(line, 0.22), line, W(s, 0.01));
    // end florets
    dot(ctx, o, reach, W(s, 0.02), line);
    dot(ctx, reach, o, W(s, 0.02), line);
  },
});

family({
  id: 'decoration.frame.simple',
  name: 'Simple Corner',
  category: 'decoration',
  tags: ['frame', 'corner', 'simple', 'border', 'rule'],
  size: 108,
  variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const line = tint || t.ink;
    const o = -s * 0.40, inn = -s * 0.32;
    const reach = s * rand(rng, 0.28, 0.34);
    ctx.strokeStyle = line;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = W(s, 0.022);
    ctx.beginPath();
    ctx.moveTo(o, reach);
    ctx.lineTo(o, o);
    ctx.lineTo(reach, o);
    ctx.stroke();
    ctx.lineWidth = W(s, 0.014);
    ctx.beginPath();
    ctx.moveTo(inn, reach * 0.85);
    ctx.lineTo(inn, inn);
    ctx.lineTo(reach * 0.85, inn);
    ctx.stroke();
    const c = (o + inn) / 2;
    ctx.beginPath();
    ctx.moveTo(c, c - s * 0.05);
    ctx.lineTo(c + s * 0.05, c);
    ctx.lineTo(c, c + s * 0.05);
    ctx.lineTo(c - s * 0.05, c);
    ctx.closePath();
    fillStroke(ctx, withAlpha(line, 0.25), line, W(s, 0.014));
    dot(ctx, o, reach, W(s, 0.018), line);
    dot(ctx, reach, o, W(s, 0.018), line);
  },
});

family({
  id: 'decoration.frame.artdeco',
  name: 'Art-Deco Corner',
  category: 'decoration',
  tags: ['frame', 'corner', 'art deco', 'geometric', 'border', 'fan'],
  size: 120,
  variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const line = tint || t.gold;
    const ink = t.ink;
    const cx = -s * 0.40, cy = -s * 0.40;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    const steps = randInt(rng, 3, 4);
    ctx.strokeStyle = line;
    ctx.lineWidth = W(s, 0.018);
    for (let i = 0; i < steps; i++) {
      const off = -s * 0.42 + i * s * 0.055;
      const reach = s * 0.30 - i * s * 0.04;
      ctx.beginPath();
      ctx.moveTo(off, reach);
      ctx.lineTo(off, off);
      ctx.lineTo(reach, off);
      ctx.stroke();
    }
    // sunrise arcs
    ctx.strokeStyle = withAlpha(ink, 0.8);
    ctx.lineWidth = W(s, 0.012);
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.11 * i, 0, Math.PI / 2);
      ctx.stroke();
    }
    // fan rays
    const rays = 5;
    for (let i = 0; i <= rays; i++) {
      const a = (i / rays) * (Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * s * 0.30, cy + Math.sin(a) * s * 0.30);
      ctx.stroke();
    }
    dot(ctx, cx, cy, W(s, 0.03), line);
  },
});

family({
  id: 'decoration.frame.knotwork',
  name: 'Knotwork Corner',
  category: 'decoration',
  tags: ['frame', 'corner', 'knotwork', 'celtic', 'interlace', 'border'],
  size: 120,
  variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const line = tint || t.ink;
    const paper = t.paper;
    const o = -s * 0.42, inn = -s * 0.34;
    const reach = s * 0.30;
    // border rules
    ctx.strokeStyle = line;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = W(s, 0.016);
    ctx.beginPath();
    ctx.moveTo(o, reach);
    ctx.lineTo(o, o);
    ctx.lineTo(reach, o);
    ctx.moveTo(inn, reach * 0.85);
    ctx.lineTo(inn, inn);
    ctx.lineTo(reach * 0.85, inn);
    ctx.stroke();
    // interlocking Solomon's knot at the corner
    const kx = inn + s * 0.10, ky = inn + s * 0.10;
    ctx.lineWidth = W(s, 0.035);
    roundRect(ctx, kx - s * 0.15, ky - s * 0.06, s * 0.30, s * 0.12, s * 0.05);
    ctx.stroke();
    roundRect(ctx, kx - s * 0.06, ky - s * 0.15, s * 0.12, s * 0.30, s * 0.05);
    ctx.stroke();
    // weave illusion: clear short gaps where the vertical loop dips under
    ctx.strokeStyle = paper;
    ctx.lineWidth = W(s, 0.05);
    for (const gy of [ky - s * 0.06, ky + s * 0.06]) {
      ctx.beginPath();
      ctx.moveTo(kx - s * 0.04, gy);
      ctx.lineTo(kx + s * 0.04, gy);
      ctx.stroke();
    }
    // redraw horizontal loop edges over the gaps
    ctx.strokeStyle = line;
    ctx.lineWidth = W(s, 0.035);
    ctx.beginPath();
    ctx.moveTo(kx - s * 0.10, ky - s * 0.06);
    ctx.lineTo(kx + s * 0.10, ky - s * 0.06);
    ctx.moveTo(kx - s * 0.10, ky + s * 0.06);
    ctx.lineTo(kx + s * 0.10, ky + s * 0.06);
    ctx.stroke();
  },
});

family({
  id: 'decoration.frame.edge',
  name: 'Frame Edge Piece',
  category: 'decoration',
  tags: ['frame', 'edge', 'border', 'band', 'rule', 'tile'],
  size: 112,
  variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.ink;
    const x0 = -s * 0.46, x1 = s * 0.46;
    ctx.strokeStyle = col;
    ctx.lineCap = 'round';
    ctx.lineWidth = W(s, 0.02);
    ctx.beginPath();
    ctx.moveTo(x0, -s * 0.10);
    ctx.lineTo(x1, -s * 0.10);
    ctx.moveTo(x0, s * 0.10);
    ctx.lineTo(x1, s * 0.10);
    ctx.stroke();
    const reps = randInt(rng, 5, 7);
    const step = (x1 - x0) / reps;
    for (let i = 0; i < reps; i++) {
      const cx = x0 + step * (i + 0.5);
      ctx.beginPath();
      ctx.moveTo(cx, -s * 0.05);
      ctx.lineTo(cx + s * 0.04, 0);
      ctx.lineTo(cx, s * 0.05);
      ctx.lineTo(cx - s * 0.04, 0);
      ctx.closePath();
      fillStroke(ctx, withAlpha(col, 0.25), col, W(s, 0.014));
      dot(ctx, x0 + step * i, 0, W(s, 0.016), col);
    }
    dot(ctx, x1, 0, W(s, 0.016), col);
  },
});

family({
  id: 'decoration.frame.vignette',
  name: 'Vignette Corner',
  category: 'decoration',
  tags: ['frame', 'corner', 'vignette', 'shade', 'border', 'fade'],
  size: 112,
  variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.ink;
    ctx.save();
    const cx = -s * 0.5, cy = -s * 0.5;
    const g = ctx.createRadialGradient(cx, cy, s * 0.15, cx, cy, s * 0.95);
    g.addColorStop(0, withAlpha(col, rand(rng, 0.4, 0.55)));
    g.addColorStop(0.6, withAlpha(col, 0.16));
    g.addColorStop(1, withAlpha(col, 0));
    ctx.fillStyle = g;
    ctx.fillRect(-s * 0.5, -s * 0.5, s, s);
    ctx.strokeStyle = withAlpha(col, 0.7);
    ctx.lineWidth = W(s, 0.014);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-s * 0.42, s * 0.0);
    ctx.lineTo(-s * 0.42, -s * 0.42);
    ctx.lineTo(s * 0.0, -s * 0.42);
    ctx.stroke();
    dot(ctx, -s * 0.42, -s * 0.42, W(s, 0.022), withAlpha(col, 0.7));
    ctx.restore();
  },
});

// =====================  INK WORK  ========================================

family({
  id: 'decoration.ink.splatter',
  name: 'Ink Splatter',
  category: 'decoration',
  tags: ['ink', 'splatter', 'blot', 'spatter', 'stain', 'droplet'],
  size: 76,
  variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const ink = tint || t.ink;
    // main blot
    ctx.fillStyle = withAlpha(ink, 0.92);
    blob(ctx, jitter(rng, s * 0.05), jitter(rng, s * 0.05), s * rand(rng, 0.14, 0.2), rng, 0.55, 11);
    ctx.fill();
    // satellite droplets
    const drops = randInt(rng, 6, 11);
    for (let i = 0; i < drops; i++) {
      const a = rng() * Math.PI * 2;
      const d = s * rand(rng, 0.18, 0.42);
      const r = s * rand(rng, 0.015, 0.05);
      ctx.fillStyle = withAlpha(ink, rand(rng, 0.6, 0.9));
      blob(ctx, Math.cos(a) * d, Math.sin(a) * d, r, rng, 0.4, 8);
      ctx.fill();
    }
    // fine specks
    const specks = randInt(rng, 10, 18);
    for (let i = 0; i < specks; i++) {
      const a = rng() * Math.PI * 2;
      const d = s * rand(rng, 0.1, 0.46);
      dot(ctx, Math.cos(a) * d, Math.sin(a) * d, Math.max(0.6, s * rand(rng, 0.004, 0.014)), withAlpha(ink, rand(rng, 0.5, 0.85)));
    }
    // a streak or two
    if (chance(rng, 0.6)) {
      const a = rng() * Math.PI * 2;
      ctx.strokeStyle = withAlpha(ink, 0.8);
      ctx.lineCap = 'round';
      ctx.lineWidth = W(s, 0.02);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * s * 0.1, Math.sin(a) * s * 0.1);
      ctx.lineTo(Math.cos(a) * s * 0.42, Math.sin(a) * s * 0.42);
      ctx.stroke();
    }
  },
});

family({
  id: 'decoration.ink.coffeestain',
  name: 'Coffee Stain',
  category: 'decoration',
  tags: ['coffee', 'stain', 'ring', 'mug', 'tea', 'mark'],
  size: 80,
  variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.woodDark;
    const k = 20;
    const pts = [];
    const baseR = s * rand(rng, 0.30, 0.36);
    for (let i = 0; i <= k; i++) {
      const a = (i / k) * Math.PI * 2;
      const rr = baseR * (1 + jitter(rng, 0.05));
      pts.push({ x: Math.cos(a) * rr, y: Math.sin(a) * rr });
    }
    const ring = () => {
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
    };
    // faint pooled interior
    ring();
    ctx.fillStyle = withAlpha(col, 0.08);
    ctx.fill();
    // soft body of the ring
    ring();
    ctx.strokeStyle = withAlpha(col, 0.38);
    ctx.lineWidth = W(s, 0.05);
    ctx.lineJoin = 'round';
    ctx.stroke();
    // darker rim
    ring();
    ctx.strokeStyle = withAlpha(col, 0.6);
    ctx.lineWidth = W(s, 0.016);
    ctx.stroke();
    // a drip or two
    if (chance(rng, 0.7)) {
      const a = rng() * Math.PI * 2;
      ctx.fillStyle = withAlpha(col, 0.3);
      blob(ctx, Math.cos(a) * baseR * 1.15, Math.sin(a) * baseR * 1.15, s * 0.04, rng, 0.4, 8);
      ctx.fill();
    }
  },
});

// =====================  SCROLLWORK  ======================================

family({
  id: 'decoration.flourish.scroll',
  name: 'Scrollwork Flourish',
  category: 'decoration',
  tags: ['scroll', 'flourish', 'filigree', 'ornament', 'vine', 'curl'],
  size: 84,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.ink;
    ctx.strokeStyle = col;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = W(s, 0.02);
    // main S stem
    ctx.beginPath();
    ctx.moveTo(-s * 0.05, s * 0.32);
    ctx.bezierCurveTo(s * 0.22, s * 0.10, -s * 0.22, -s * 0.10, s * 0.05, -s * 0.32);
    ctx.stroke();
    // spiral ends
    ctx.lineWidth = W(s, 0.018);
    ctx.beginPath();
    spiralPath(ctx, s * 0.05, -s * 0.32, s * 0.09, 1.2, 1, Math.PI * 0.5);
    ctx.stroke();
    ctx.beginPath();
    spiralPath(ctx, -s * 0.05, s * 0.32, s * 0.09, 1.2, -1, -Math.PI * 0.5);
    ctx.stroke();
    // side branch curls
    for (const dir of [-1, 1]) {
      const bx = dir * s * 0.06, by = dir * s * 0.06;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx + dir * s * 0.18, by - s * 0.10, bx + dir * s * 0.22, by + s * 0.04);
      ctx.lineWidth = W(s, 0.014);
      ctx.stroke();
      ctx.beginPath();
      spiralPath(ctx, bx + dir * s * 0.22, by + s * 0.04, s * 0.05, 1, dir, 0);
      ctx.stroke();
      leafBud(ctx, bx + dir * s * 0.10, by - s * 0.05, dir > 0 ? -0.5 : Math.PI + 0.5, s * 0.09, s * 0.035, withAlpha(col, 0.25), col, W(s, 0.01));
    }
  },
});

family({
  id: 'decoration.flourish.divider',
  name: 'Divider Flourish',
  category: 'decoration',
  tags: ['divider', 'flourish', 'rule', 'separator', 'ornament', 'symmetric'],
  size: 92,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.ink;
    ctx.strokeStyle = col;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // central lozenge
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.09);
    ctx.lineTo(s * 0.06, 0);
    ctx.lineTo(0, s * 0.09);
    ctx.lineTo(-s * 0.06, 0);
    ctx.closePath();
    fillStroke(ctx, withAlpha(col, 0.2), col, W(s, 0.018));
    for (const dir of [-1, 1]) {
      ctx.lineWidth = W(s, 0.018);
      ctx.beginPath();
      ctx.moveTo(dir * s * 0.06, 0);
      ctx.bezierCurveTo(dir * s * 0.16, -s * 0.07, dir * s * 0.26, s * 0.07, dir * s * 0.38, 0);
      ctx.stroke();
      // end spiral
      ctx.lineWidth = W(s, 0.014);
      ctx.beginPath();
      spiralPath(ctx, dir * s * 0.40, 0, s * 0.06, 1.1, dir, Math.PI);
      ctx.stroke();
      dot(ctx, dir * s * 0.20, jitter(rng, s * 0.01) - s * 0.005, W(s, 0.018), col);
      // little flick
      ctx.lineWidth = W(s, 0.013);
      ctx.beginPath();
      ctx.moveTo(dir * s * 0.30, s * 0.02);
      ctx.quadraticCurveTo(dir * s * 0.34, s * 0.10, dir * s * 0.40, s * 0.09);
      ctx.stroke();
    }
  },
});

// =====================  RIBBONS  =========================================

family({
  id: 'decoration.ribbon.banner',
  name: 'Ribbon Banner',
  category: 'decoration',
  tags: ['ribbon', 'banner', 'scroll', 'label', 'pennant', 'title'],
  size: 88,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const cloth = tint || t.cloth;
    const ink = t.ink;
    const lwv = W(s, 0.018);
    const y0 = -s * 0.12, h = s * 0.24;
    ctx.lineJoin = 'round';
    // folded tabs behind the ends
    ctx.fillStyle = withAlpha(darken(cloth, 0.18), 0.9);
    ctx.beginPath();
    ctx.moveTo(-s * 0.30, y0 + h * 0.12);
    ctx.lineTo(-s * 0.44, y0 - s * 0.02);
    ctx.lineTo(-s * 0.44, y0 + h * 0.5);
    ctx.lineTo(-s * 0.30, y0 + h * 0.5);
    ctx.closePath();
    fillStroke(ctx, withAlpha(darken(cloth, 0.18), 0.9), ink, lwv);
    ctx.beginPath();
    ctx.moveTo(s * 0.30, y0 + h * 0.12);
    ctx.lineTo(s * 0.44, y0 - s * 0.02);
    ctx.lineTo(s * 0.44, y0 + h * 0.5);
    ctx.lineTo(s * 0.30, y0 + h * 0.5);
    ctx.closePath();
    fillStroke(ctx, withAlpha(darken(cloth, 0.18), 0.9), ink, lwv);
    // main band with swallowtails
    ctx.beginPath();
    ctx.moveTo(-s * 0.36, y0);
    ctx.lineTo(-s * 0.26, y0 + h * 0.5);
    ctx.lineTo(-s * 0.36, y0 + h);
    ctx.quadraticCurveTo(0, y0 + h + s * 0.03, s * 0.36, y0 + h);
    ctx.lineTo(s * 0.26, y0 + h * 0.5);
    ctx.lineTo(s * 0.36, y0);
    ctx.quadraticCurveTo(0, y0 - s * 0.03, -s * 0.36, y0);
    ctx.closePath();
    fillStroke(ctx, withAlpha(cloth, 0.95), ink, lwv);
    // fold creases
    ctx.strokeStyle = withAlpha(ink, 0.4);
    ctx.lineWidth = W(s, 0.012);
    for (const fx of [-s * 0.20, s * 0.20]) {
      ctx.beginPath();
      ctx.moveTo(fx, y0 + s * 0.01);
      ctx.lineTo(fx, y0 + h - s * 0.01);
      ctx.stroke();
    }
  },
});

family({
  id: 'decoration.ribbon.end',
  name: 'Ribbon End',
  category: 'decoration',
  tags: ['ribbon', 'end', 'tail', 'streamer', 'fold'],
  size: 76,
  variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const cloth = tint || t.cloth;
    const ink = t.ink;
    const lwv = W(s, 0.018);
    ctx.save();
    ctx.rotate(jitter(rng, 0.12));
    ctx.lineJoin = 'round';
    // hanging tail with forked notch
    ctx.beginPath();
    ctx.moveTo(-s * 0.12, -s * 0.30);
    ctx.lineTo(s * 0.12, -s * 0.30);
    ctx.quadraticCurveTo(s * 0.14, s * 0.0, s * 0.12, s * 0.26);
    ctx.lineTo(0, s * 0.14);
    ctx.lineTo(-s * 0.12, s * 0.26);
    ctx.quadraticCurveTo(-s * 0.14, s * 0.0, -s * 0.12, -s * 0.30);
    ctx.closePath();
    fillStroke(ctx, withAlpha(cloth, 0.95), ink, lwv);
    // folded top corner (behind)
    ctx.beginPath();
    ctx.moveTo(-s * 0.12, -s * 0.30);
    ctx.lineTo(-s * 0.24, -s * 0.20);
    ctx.lineTo(-s * 0.12, -s * 0.14);
    ctx.closePath();
    fillStroke(ctx, withAlpha(darken(cloth, 0.2), 0.9), ink, lwv);
    // centre crease
    ctx.strokeStyle = withAlpha(ink, 0.4);
    ctx.lineWidth = W(s, 0.012);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.28);
    ctx.lineTo(0, s * 0.10);
    ctx.stroke();
    ctx.restore();
  },
});

// =====================  CREATURES & SKY  =================================

family({
  id: 'decoration.creature.dragon',
  name: 'Flying Dragon',
  category: 'decoration',
  tags: ['dragon', 'wyvern', 'wing', 'monster', 'flying', 'here be dragons'],
  size: 92,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const body = tint || t.ink;
    const lwv = W(s, 0.018);
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // body, neck, head and curling tail (facing left)
    ctx.beginPath();
    ctx.moveTo(-s * 0.42, -s * 0.04);
    ctx.lineTo(-s * 0.34, -s * 0.12);
    ctx.lineTo(-s * 0.30, -s * 0.07);
    ctx.quadraticCurveTo(-s * 0.20, -s * 0.16, -s * 0.06, -s * 0.10);
    ctx.quadraticCurveTo(s * 0.04, -s * 0.06, s * 0.14, -s * 0.02);
    ctx.quadraticCurveTo(s * 0.30, s * 0.04, s * 0.40, s * 0.14);
    ctx.quadraticCurveTo(s * 0.46, s * 0.20, s * 0.42, s * 0.28);
    ctx.quadraticCurveTo(s * 0.40, s * 0.31, s * 0.47, s * 0.33);
    ctx.quadraticCurveTo(s * 0.36, s * 0.23, s * 0.30, s * 0.18);
    ctx.quadraticCurveTo(s * 0.14, s * 0.12, s * 0.02, s * 0.10);
    ctx.quadraticCurveTo(-s * 0.10, s * 0.08, -s * 0.16, s * 0.0);
    ctx.quadraticCurveTo(-s * 0.26, s * 0.02, -s * 0.30, s * 0.04);
    ctx.quadraticCurveTo(-s * 0.38, s * 0.04, -s * 0.42, -s * 0.04);
    ctx.closePath();
    fillStroke(ctx, withAlpha(body, 0.5), t.ink, lwv);
    // horn
    ctx.beginPath();
    ctx.moveTo(-s * 0.34, -s * 0.12);
    ctx.lineTo(-s * 0.31, -s * 0.20);
    ctx.lineTo(-s * 0.29, -s * 0.12);
    ctx.closePath();
    fillStroke(ctx, withAlpha(body, 0.5), t.ink, lwv);
    // eye
    dot(ctx, -s * 0.345, -s * 0.055, W(s, 0.02), t.paper);
    // wing membrane with scalloped trailing edge
    const tips = [
      [-s * 0.04, -s * 0.42],
      [s * 0.08, -s * 0.34],
      [s * 0.18, -s * 0.22],
      [s * 0.20, -s * 0.06],
    ];
    ctx.beginPath();
    ctx.moveTo(s * 0.0, -s * 0.04);
    ctx.lineTo(tips[0][0], tips[0][1]);
    let prev = tips[0];
    for (let i = 1; i < tips.length; i++) {
      const cur = tips[i];
      const mx = (prev[0] + cur[0]) / 2;
      const my = (prev[1] + cur[1]) / 2 + s * 0.06;
      ctx.quadraticCurveTo(mx, my, cur[0], cur[1]);
      prev = cur;
    }
    ctx.lineTo(s * 0.0, -s * 0.04);
    ctx.closePath();
    fillStroke(ctx, withAlpha(body, 0.4), t.ink, lwv);
    // wing spars
    ctx.strokeStyle = withAlpha(t.ink, 0.6);
    ctx.lineWidth = W(s, 0.012);
    tips.forEach((tp) => {
      ctx.beginPath();
      ctx.moveTo(s * 0.0, -s * 0.04);
      ctx.lineTo(tp[0], tp[1]);
      ctx.stroke();
    });
    ctx.restore();
  },
});

family({
  id: 'decoration.bird.flock',
  name: 'Bird Flock',
  category: 'decoration',
  tags: ['birds', 'flock', 'v formation', 'geese', 'sky', 'flying'],
  size: 78,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.ink;
    ctx.strokeStyle = col;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = W(s, 0.02);
    const lx = jitter(rng, s * 0.04), ly = -s * 0.24;
    gullMark(ctx, lx, ly, s * 0.08, s * 0.06);
    const rows = randInt(rng, 3, 4);
    for (const arm of [-1, 1]) {
      for (let i = 1; i <= rows; i++) {
        const x = lx + arm * (s * 0.11 * i) + jitter(rng, s * 0.02);
        const y = ly + s * 0.11 * i + jitter(rng, s * 0.02);
        const w = s * (0.075 - i * 0.008);
        gullMark(ctx, x, y, w, w * 0.7);
      }
    }
  },
});

family({
  id: 'decoration.bird.gull',
  name: 'Single Gull',
  category: 'decoration',
  tags: ['gull', 'bird', 'seagull', 'sky', 'flying'],
  size: 70,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.ink;
    ctx.strokeStyle = col;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = W(s, 0.03);
    // main gull with a slight body bump
    const w = s * rand(rng, 0.28, 0.34);
    const dip = s * rand(rng, 0.14, 0.2);
    ctx.beginPath();
    ctx.moveTo(-w, -s * 0.02);
    ctx.quadraticCurveTo(-w * 0.45, -dip, 0, s * 0.04);
    ctx.quadraticCurveTo(w * 0.45, -dip, w, -s * 0.02);
    ctx.stroke();
    // tiny body tick
    ctx.lineWidth = W(s, 0.02);
    ctx.beginPath();
    ctx.moveTo(0, s * 0.04);
    ctx.lineTo(0, s * 0.10);
    ctx.stroke();
    // optional distant companion
    if (chance(rng, 0.7)) {
      const cx = w * rand(rng, 0.9, 1.3) * (chance(rng, 0.5) ? 1 : -1);
      const cy = -s * rand(rng, 0.18, 0.30);
      const cw = s * 0.14;
      ctx.lineWidth = W(s, 0.02);
      gullMark(ctx, cx, cy, cw, cw * 0.7);
    }
  },
});

family({
  id: 'decoration.weather.fog',
  name: 'Fog Patch',
  category: 'decoration',
  tags: ['fog', 'mist', 'haze', 'weather', 'cloud', 'bands'],
  size: 80,
  variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.white;
    const bands = randInt(rng, 3, 5);
    ctx.lineCap = 'round';
    for (let i = 0; i < bands; i++) {
      const y = -s * 0.24 + i * (s * 0.50 / bands);
      const w = s * rand(rng, 0.62, 0.84);
      const h = s * rand(rng, 0.05, 0.08);
      const x0 = -w / 2 + jitter(rng, s * 0.04);
      // wavy filled lozenge
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.bezierCurveTo(x0 + w * 0.3, y - h, x0 + w * 0.7, y - h, x0 + w, y);
      ctx.bezierCurveTo(x0 + w * 0.7, y + h, x0 + w * 0.3, y + h, x0, y);
      ctx.closePath();
      ctx.fillStyle = withAlpha(col, rand(rng, 0.32, 0.5));
      ctx.fill();
      // faint top line
      ctx.strokeStyle = withAlpha(t.ink, 0.18);
      ctx.lineWidth = W(s, 0.012);
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.bezierCurveTo(x0 + w * 0.3, y - h, x0 + w * 0.7, y - h, x0 + w, y);
      ctx.stroke();
    }
  },
});

family({
  id: 'decoration.sky.sunburst',
  name: 'Sunburst Rays',
  category: 'decoration',
  tags: ['sun', 'sunburst', 'rays', 'compass', 'star', 'radiant'],
  size: 84,
  variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.gold;
    const ink = t.ink;
    ctx.lineCap = 'round';
    const rays = randInt(rng, 12, 16);
    const inner = s * 0.16;
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2 + jitter(rng, 0.02);
      const long = i % 2 === 0;
      const len = long ? s * 0.46 : s * 0.34;
      ctx.strokeStyle = withAlpha(long ? col : ink, long ? 0.9 : 0.6);
      ctx.lineWidth = long ? W(s, 0.02) : W(s, 0.012);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
      ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
      ctx.stroke();
    }
    // sun disk
    ctx.beginPath();
    ctx.arc(0, 0, inner, 0, Math.PI * 2);
    fillStroke(ctx, withAlpha(col, 0.4), ink, W(s, 0.02));
    dot(ctx, 0, 0, W(s, 0.04), withAlpha(ink, 0.5));
  },
});

family({
  id: 'decoration.knot.decorative',
  name: 'Decorative Knot',
  category: 'decoration',
  tags: ['knot', 'rope', 'tie', 'ornament', 'celtic'],
  size: 78,
  variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.ink;
    const paper = t.paper;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // looped overhand knot drawn as a thick rope
    ctx.strokeStyle = col;
    ctx.lineWidth = W(s, 0.07);
    ctx.beginPath();
    ctx.moveTo(-s * 0.34, s * 0.22);
    ctx.bezierCurveTo(-s * 0.32, -s * 0.12, s * 0.06, -s * 0.32, s * 0.10, s * 0.02);
    ctx.bezierCurveTo(s * 0.12, s * 0.18, -s * 0.12, s * 0.20, -s * 0.06, -s * 0.04);
    ctx.bezierCurveTo(-s * 0.02, -s * 0.18, s * 0.22, -s * 0.10, s * 0.34, s * 0.22);
    ctx.stroke();
    // over/under gap at the crossing
    ctx.strokeStyle = paper;
    ctx.lineWidth = W(s, 0.10);
    ctx.beginPath();
    ctx.moveTo(-s * 0.02, -s * 0.02);
    ctx.lineTo(s * 0.06, -s * 0.10);
    ctx.stroke();
    // redraw the over-strand
    ctx.strokeStyle = col;
    ctx.lineWidth = W(s, 0.07);
    ctx.beginPath();
    ctx.moveTo(-s * 0.10, s * 0.04);
    ctx.bezierCurveTo(-s * 0.04, -s * 0.14, s * 0.04, -s * 0.16, s * 0.12, -s * 0.04);
    ctx.stroke();
    // rope sheen
    ctx.strokeStyle = withAlpha(lighten(col, 0.4), 0.5);
    ctx.lineWidth = W(s, 0.02);
    ctx.beginPath();
    ctx.moveTo(-s * 0.30, s * 0.20);
    ctx.bezierCurveTo(-s * 0.28, -s * 0.08, s * 0.04, -s * 0.26, s * 0.08, s * 0.0);
    ctx.stroke();
  },
});

family({
  id: 'decoration.rope.corner',
  name: 'Rope Corner',
  category: 'decoration',
  tags: ['rope', 'corner', 'frame', 'cord', 'border', 'nautical'],
  size: 116,
  variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const rope = tint || t.wood;
    const o1 = -s * 0.40, o2 = -s * 0.30;
    const reach = s * 0.34;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // two parallel rope strands bent in an L
    for (const off of [o1, o2]) {
      ctx.strokeStyle = withAlpha(rope, 0.95);
      ctx.lineWidth = W(s, 0.05);
      ctx.beginPath();
      ctx.moveTo(off, reach);
      ctx.lineTo(off, off + s * 0.04);
      ctx.quadraticCurveTo(off, off, off + s * 0.04, off);
      ctx.lineTo(reach, off);
      ctx.stroke();
    }
    // twist ticks crossing both strands
    ctx.strokeStyle = withAlpha(t.ink, 0.55);
    ctx.lineWidth = W(s, 0.013);
    const mid = (o1 + o2) / 2;
    // vertical arm ticks
    for (let y = mid; y <= reach; y += s * 0.06) {
      ctx.beginPath();
      ctx.moveTo(o1 - s * 0.03, y - s * 0.02);
      ctx.lineTo(o2 + s * 0.03, y + s * 0.02);
      ctx.stroke();
    }
    // horizontal arm ticks
    for (let x = mid; x <= reach; x += s * 0.06) {
      ctx.beginPath();
      ctx.moveTo(x - s * 0.02, o1 - s * 0.03);
      ctx.lineTo(x + s * 0.02, o2 + s * 0.03);
      ctx.stroke();
    }
    // corner knot
    dot(ctx, mid, mid, W(s, 0.045), withAlpha(rope, 0.95));
  },
});

family({
  id: 'decoration.deco.tassel',
  name: 'Tassel',
  category: 'decoration',
  tags: ['tassel', 'cord', 'fringe', 'ornament', 'hanging'],
  size: 72,
  variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.gold;
    const ink = t.ink;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // top cord loop
    ctx.strokeStyle = withAlpha(col, 0.95);
    ctx.lineWidth = W(s, 0.025);
    ctx.beginPath();
    ctx.arc(0, -s * 0.30, s * 0.06, Math.PI * 0.15, Math.PI * 0.85, false);
    ctx.stroke();
    // cord down to the head
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.24);
    ctx.lineTo(0, -s * 0.08);
    ctx.stroke();
    // bell head
    ctx.beginPath();
    ctx.moveTo(-s * 0.10, -s * 0.06);
    ctx.lineTo(s * 0.10, -s * 0.06);
    ctx.lineTo(s * 0.13, s * 0.06);
    ctx.lineTo(-s * 0.13, s * 0.06);
    ctx.closePath();
    fillStroke(ctx, withAlpha(col, 0.85), ink, W(s, 0.016));
    // wrap band
    ctx.strokeStyle = withAlpha(ink, 0.6);
    ctx.lineWidth = W(s, 0.016);
    ctx.beginPath();
    ctx.moveTo(-s * 0.11, s * 0.0);
    ctx.lineTo(s * 0.11, s * 0.0);
    ctx.stroke();
    // skirt threads
    ctx.strokeStyle = withAlpha(col, 0.95);
    ctx.lineWidth = W(s, 0.016);
    const threads = randInt(rng, 7, 10);
    for (let i = 0; i < threads; i++) {
      const fx = -s * 0.12 + (s * 0.24) * (i / (threads - 1));
      ctx.beginPath();
      ctx.moveTo(fx, s * 0.06);
      ctx.quadraticCurveTo(fx * 1.1, s * 0.22, fx * 1.2 + jitter(rng, s * 0.01), s * 0.34);
      ctx.stroke();
    }
  },
});

family({
  id: 'decoration.deco.fleur',
  name: 'Fleur Ornament',
  category: 'decoration',
  tags: ['fleur', 'fleur-de-lis', 'ornament', 'heraldry', 'lily'],
  size: 74,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.gold;
    const ink = t.ink;
    const lwv = W(s, 0.018);
    ctx.lineJoin = 'round';
    // central petal
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.40);
    ctx.bezierCurveTo(s * 0.13, -s * 0.20, s * 0.10, s * 0.02, 0, s * 0.10);
    ctx.bezierCurveTo(-s * 0.10, s * 0.02, -s * 0.13, -s * 0.20, 0, -s * 0.40);
    ctx.closePath();
    fillStroke(ctx, withAlpha(col, 0.45), ink, lwv);
    // side petals
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, s * 0.0);
      ctx.bezierCurveTo(dir * s * 0.06, -s * 0.10, dir * s * 0.28, -s * 0.06, dir * s * 0.30, s * 0.06);
      ctx.bezierCurveTo(dir * s * 0.30, s * 0.16, dir * s * 0.12, s * 0.12, 0, s * 0.08);
      ctx.closePath();
      fillStroke(ctx, withAlpha(col, 0.4), ink, lwv);
    }
    // horizontal band
    roundRect(ctx, -s * 0.16, s * 0.05, s * 0.32, s * 0.07, s * 0.02);
    fillStroke(ctx, withAlpha(col, 0.55), ink, lwv);
    // base spike
    ctx.beginPath();
    ctx.moveTo(0, s * 0.12);
    ctx.lineTo(s * 0.10, s * 0.30);
    ctx.lineTo(-s * 0.10, s * 0.30);
    ctx.closePath();
    fillStroke(ctx, withAlpha(col, 0.45), ink, lwv);
  },
});

family({
  id: 'decoration.sky.starfield',
  name: 'Star Field',
  category: 'decoration',
  tags: ['stars', 'starfield', 'dots', 'sky', 'night', 'scatter'],
  size: 78,
  variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const col = tint || t.ink;
    const n = randInt(rng, 16, 26);
    for (let i = 0; i < n; i++) {
      const x = jitter(rng, s * 0.46);
      const y = jitter(rng, s * 0.46);
      const roll = rng();
      if (roll < 0.18) {
        // four-point sparkle
        const r = s * rand(rng, 0.04, 0.07);
        star(ctx, x, y, 4, r, r * 0.32);
        ctx.fillStyle = withAlpha(col, rand(rng, 0.7, 0.95));
        ctx.fill();
      } else if (roll < 0.3) {
        // tiny cross twinkle
        ctx.strokeStyle = withAlpha(col, 0.7);
        ctx.lineWidth = W(s, 0.012);
        const r = s * rand(rng, 0.03, 0.05);
        ctx.beginPath();
        ctx.moveTo(x - r, y); ctx.lineTo(x + r, y);
        ctx.moveTo(x, y - r); ctx.lineTo(x, y + r);
        ctx.stroke();
      } else {
        dot(ctx, x, y, Math.max(0.7, s * rand(rng, 0.008, 0.022)), withAlpha(col, rand(rng, 0.45, 0.9)));
      }
    }
  },
});

family({
  id: 'decoration.weather.snowfall',
  name: 'Snowfall',
  category: 'decoration',
  tags: ['snow', 'snowfall', 'flakes', 'winter', 'weather', 'dots'],
  size: 76,
  variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite;
    const flake = tint || t.snow;
    const n = randInt(rng, 18, 28);
    for (let i = 0; i < n; i++) {
      const x = jitter(rng, s * 0.46);
      const y = jitter(rng, s * 0.46);
      if (rng() < 0.16) {
        // six-spoke flake
        const r = s * rand(rng, 0.04, 0.06);
        ctx.strokeStyle = withAlpha(mix(flake, t.ink, 0.25), 0.85);
        ctx.lineWidth = W(s, 0.012);
        ctx.lineCap = 'round';
        for (let k = 0; k < 3; k++) {
          const a = k * (Math.PI / 3);
          ctx.beginPath();
          ctx.moveTo(x - Math.cos(a) * r, y - Math.sin(a) * r);
          ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
          ctx.stroke();
        }
      } else {
        const r = Math.max(0.8, s * rand(rng, 0.012, 0.03));
        dot(ctx, x, y, r, withAlpha(flake, rand(rng, 0.7, 0.95)));
        ctx.strokeStyle = withAlpha(t.ink, 0.2);
        ctx.lineWidth = Math.max(0.5, W(s, 0.006));
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  },
});
