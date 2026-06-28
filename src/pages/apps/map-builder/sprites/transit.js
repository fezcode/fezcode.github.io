// Transit & infrastructure sprites — top-down road/rail/air/utility tiles.
// Segments span edge-to-edge so they tile when placed in a line and rotated.
import { family } from './registry';
import {
  makeRng, rand, randInt, pick, chance, jitter,
  mix, darken, lighten, withAlpha,
  roundRect, polygonPath, ngon, star, blob, fillStroke, hatch,
  softShadow, clearShadow, groundShadow,
} from './draw';

// ---------------------------------------------------------------------------
// internal helpers (module-private; not exported)
// ---------------------------------------------------------------------------
const LW = (s) => Math.max(1, s * 0.02);

function strokeSegs(ctx, color, width, segs) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  for (const g of segs) { ctx.moveTo(g[0], g[1]); ctx.lineTo(g[2], g[3]); }
  ctx.stroke();
}

function dashSegs(ctx, color, width, dash, segs) {
  ctx.save();
  ctx.setLineDash(dash);
  strokeSegs(ctx, color, width, segs);
  ctx.setLineDash([]);
  ctx.restore();
}

function speckle(ctx, rng, x, y, w, h, color, n) {
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    ctx.beginPath();
    ctx.arc(x + rand(rng, 0, w), y + rand(rng, 0, h), rand(rng, 0.35, 1.1), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function asphalt(ctx, t, rng, x, y, w, h, base) {
  ctx.fillStyle = base;
  ctx.fillRect(x, y, w, h);
  speckle(ctx, rng, x, y, w, h, withAlpha(darken(base, 0.4), 0.16), Math.floor((w * h) / 90));
  if (chance(rng, 0.5)) {
    speckle(ctx, rng, x, y, w, h, withAlpha(lighten(base, 0.4), 0.12), Math.floor((w * h) / 170));
  }
}

function hazardBar(ctx, x, y, w, h, c1, c2) {
  ctx.save();
  roundRect(ctx, x, y, w, h, Math.min(w, h) * 0.25);
  ctx.clip();
  ctx.fillStyle = c1; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = c2;
  const step = Math.max(w, h) / 5;
  ctx.translate(x, y);
  for (let i = -h; i < w + h; i += step * 2) {
    ctx.beginPath();
    ctx.moveTo(i, 0); ctx.lineTo(i + step, 0);
    ctx.lineTo(i + step - h, h); ctx.lineTo(i - h, h);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function railBand(ctx, t, rng, s, gauge, len, ballast = true) {
  if (ballast) {
    ctx.fillStyle = withAlpha(t.terrain.dirt, 0.55);
    ctx.fillRect(-len / 2 - s * 0.03, -s / 2, len + s * 0.06, s);
    speckle(ctx, rng, -len / 2, -s / 2, len, s, withAlpha(darken(t.terrain.dirt, 0.35), 0.4), 26);
  }
  ctx.fillStyle = t.sprite.woodDark;
  const step = s * 0.135;
  const off = rand(rng, 0, step);
  for (let y = -s / 2 + off; y < s / 2; y += step) {
    roundRect(ctx, -len / 2, y - s * 0.026, len, s * 0.052, s * 0.012);
    ctx.fill();
  }
  strokeSegs(ctx, lighten(t.terrain.rail, 0.18), Math.max(1.2, s * 0.024), [
    [-gauge / 2, -s / 2, -gauge / 2, s / 2],
    [gauge / 2, -s / 2, gauge / 2, s / 2],
  ]);
  strokeSegs(ctx, darken(t.terrain.rail, 0.25), Math.max(1, s * 0.009), [
    [-gauge / 2 + s * 0.013, -s / 2, -gauge / 2 + s * 0.013, s / 2],
    [gauge / 2 - s * 0.013, -s / 2, gauge / 2 - s * 0.013, s / 2],
  ]);
}

// ===========================================================================
// ROADS
// ===========================================================================
family({
  id: 'transit.road.straight', name: 'Road (2-lane)', category: 'transit',
  tags: ['road', 'street', 'asphalt', 'straight', 'paved'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.26;
    asphalt(ctx, t, rng, -hw, -s / 2, hw * 2, s, t.terrain.road);
    if (chance(rng, 0.6)) {
      ctx.fillStyle = withAlpha(darken(t.terrain.road, 0.18), 0.5);
      roundRect(ctx, rand(rng, -hw * 0.6, 0), rand(rng, -s * 0.3, s * 0.3),
        rand(rng, hw * 0.5, hw), rand(rng, s * 0.08, s * 0.18), s * 0.02);
      ctx.fill();
    }
    strokeSegs(ctx, t.sprite.ink, LW(s), [
      [-hw, -s / 2, -hw, s / 2], [hw, -s / 2, hw, s / 2],
    ]);
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.03), [s * 0.12, s * 0.1], [[0, -s / 2, 0, s / 2]]);
  },
});

family({
  id: 'transit.road.highway', name: 'Highway (4-lane)', category: 'transit',
  tags: ['road', 'highway', 'motorway', 'asphalt', 'fourlane'], size: 80, variants: 5,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.34;
    asphalt(ctx, t, rng, -hw, -s / 2, hw * 2, s, darken(t.terrain.road, 0.05));
    strokeSegs(ctx, t.sprite.ink, LW(s), [[-hw, -s / 2, -hw, s / 2], [hw, -s / 2, hw, s / 2]]);
    strokeSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.018), [
      [-hw + s * 0.03, -s / 2, -hw + s * 0.03, s / 2],
      [hw - s * 0.03, -s / 2, hw - s * 0.03, s / 2],
    ]);
    const lane = hw / 2;
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.02), [s * 0.13, s * 0.1], [
      [-lane, -s / 2, -lane, s / 2], [lane, -s / 2, lane, s / 2],
    ]);
    strokeSegs(ctx, t.sprite.gold, Math.max(1, s * 0.018), [
      [-s * 0.014, -s / 2, -s * 0.014, s / 2], [s * 0.014, -s / 2, s * 0.014, s / 2],
    ]);
  },
});

family({
  id: 'transit.road.curve', name: 'Road Curve', category: 'transit',
  tags: ['road', 'curve', 'bend', 'turn', 'asphalt'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.26;
    const cx = s / 2, cy = s / 2, rMid = s / 2;
    const inner = rMid - hw, outer = rMid + hw;
    ctx.beginPath();
    ctx.arc(cx, cy, outer, Math.PI, Math.PI * 1.5);
    ctx.arc(cx, cy, inner, Math.PI * 1.5, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = t.terrain.road; ctx.fill();
    ctx.save(); ctx.clip();
    speckle(ctx, rng, -s / 2, -s / 2, s, s, withAlpha(darken(t.terrain.road, 0.4), 0.16), 40);
    ctx.restore();
    ctx.strokeStyle = t.sprite.ink; ctx.lineWidth = LW(s);
    ctx.beginPath(); ctx.arc(cx, cy, inner, Math.PI, Math.PI * 1.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, outer, Math.PI, Math.PI * 1.5); ctx.stroke();
    ctx.save();
    ctx.strokeStyle = t.terrain.roadLine; ctx.lineWidth = Math.max(1, s * 0.03);
    ctx.setLineDash([s * 0.12, s * 0.1]);
    ctx.beginPath(); ctx.arc(cx, cy, rMid, Math.PI, Math.PI * 1.5); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();
  },
});

family({
  id: 'transit.road.tjunction', name: 'T-Junction', category: 'transit',
  tags: ['road', 'junction', 'intersection', 't-junction', 'asphalt'], size: 88, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme; const hw = s * 0.22;
    asphalt(ctx, t, rng, -hw, -s / 2, hw * 2, s, t.terrain.road);
    asphalt(ctx, t, rng, -hw, -hw, s / 2 + hw, hw * 2, t.terrain.road);
    strokeSegs(ctx, t.sprite.ink, LW(s), [
      [-hw, -s / 2, -hw, s / 2],
      [hw, -s / 2, hw, -hw],
      [hw, hw, hw, s / 2],
      [hw, -hw, s / 2, -hw],
      [hw, hw, s / 2, hw],
    ]);
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.028), [s * 0.1, s * 0.09], [
      [0, -s / 2, 0, -hw], [0, hw, 0, s / 2], [hw, 0, s / 2, 0],
    ]);
    strokeSegs(ctx, tint || t.terrain.roadLine, Math.max(1.5, s * 0.03), [[hw * 0.25, hw + s * 0.03, hw * 0.95, hw + s * 0.03]]);
  },
});

family({
  id: 'transit.road.crossroads', name: 'Crossroads', category: 'transit',
  tags: ['road', 'junction', 'intersection', 'crossroads', 'crossing'], size: 88, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme; const hw = s * 0.22;
    asphalt(ctx, t, rng, -hw, -s / 2, hw * 2, s, t.terrain.road);
    asphalt(ctx, t, rng, -s / 2, -hw, s, hw * 2, t.terrain.road);
    strokeSegs(ctx, t.sprite.ink, LW(s), [
      [-hw, -s / 2, -hw, -hw], [hw, -s / 2, hw, -hw],
      [-hw, hw, -hw, s / 2], [hw, hw, hw, s / 2],
      [-s / 2, -hw, -hw, -hw], [-s / 2, hw, -hw, hw],
      [hw, -hw, s / 2, -hw], [hw, hw, s / 2, hw],
    ]);
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.028), [s * 0.1, s * 0.09], [
      [0, -s / 2, 0, -hw], [0, hw, 0, s / 2], [-s / 2, 0, -hw, 0], [hw, 0, s / 2, 0],
    ]);
    ctx.fillStyle = tint || t.terrain.roadLine;
    for (let i = -2; i <= 2; i++) {
      const x = i * (hw / 2.6);
      ctx.fillRect(x - hw * 0.07, -hw - s * 0.085, hw * 0.14, s * 0.07);
      ctx.fillRect(x - hw * 0.07, hw + s * 0.015, hw * 0.14, s * 0.07);
    }
  },
});

family({
  id: 'transit.road.roundabout', name: 'Roundabout', category: 'transit',
  tags: ['road', 'roundabout', 'circle', 'junction', 'traffic'], size: 92, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme; const hw = s * 0.16;
    const rOut = s * 0.34, rIn = s * 0.16;
    ctx.fillStyle = t.terrain.road;
    ctx.fillRect(-hw, -s / 2, hw * 2, s);
    ctx.fillRect(-s / 2, -hw, s, hw * 2);
    ctx.beginPath();
    ctx.arc(0, 0, rOut, 0, Math.PI * 2);
    ctx.arc(0, 0, rIn, 0, Math.PI * 2, true);
    ctx.fillStyle = t.terrain.road; ctx.fill('evenodd');
    ctx.strokeStyle = t.sprite.ink; ctx.lineWidth = LW(s);
    ctx.beginPath(); ctx.arc(0, 0, rOut, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, rIn, 0, Math.PI * 2);
    fillStroke(ctx, t.terrain.grass, t.sprite.ink, LW(s));
    ctx.beginPath(); ctx.arc(0, 0, rIn * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = tint || withAlpha(t.terrain.grassDark, 0.75); ctx.fill();
    ctx.save();
    ctx.strokeStyle = t.terrain.roadLine; ctx.lineWidth = Math.max(1, s * 0.02);
    ctx.setLineDash([s * 0.08, s * 0.07]);
    ctx.beginPath(); ctx.arc(0, 0, (rOut + rIn) / 2, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();
    strokeSegs(ctx, t.sprite.ink, LW(s), [
      [-hw, -s / 2, -hw, -rOut + s * 0.02], [hw, -s / 2, hw, -rOut + s * 0.02],
      [-hw, rOut - s * 0.02, -hw, s / 2], [hw, rOut - s * 0.02, hw, s / 2],
      [-s / 2, -hw, -rOut + s * 0.02, -hw], [-s / 2, hw, -rOut + s * 0.02, hw],
      [rOut - s * 0.02, -hw, s / 2, -hw], [rOut - s * 0.02, hw, s / 2, hw],
    ]);
  },
});

family({
  id: 'transit.road.cloverleaf', name: 'Cloverleaf Interchange', category: 'transit',
  tags: ['road', 'interchange', 'cloverleaf', 'highway', 'motorway', 'junction'], size: 96, variants: 4,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.13;
    const road = t.terrain.road;
    // lower highway (horizontal) + markings
    asphalt(ctx, t, rng, -s / 2, -hw, s, hw * 2, road);
    strokeSegs(ctx, t.sprite.ink, LW(s), [[-s / 2, -hw, s / 2, -hw], [-s / 2, hw, s / 2, hw]]);
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.02), [s * 0.1, s * 0.08], [[-s / 2, 0, s / 2, 0]]);
    // loop ramps in the 4 quadrants
    const rL = s * 0.3;
    ctx.strokeStyle = road; ctx.lineWidth = s * 0.1; ctx.lineCap = 'round';
    for (const q of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      ctx.beginPath();
      ctx.arc(q[0] * rL, q[1] * rL, rL * 0.62, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.lineCap = 'butt';
    // upper highway (vertical) drawn over -> overpass
    softShadow(ctx, t.sprite.shadow, s * 0.09, 0, 0);
    asphalt(ctx, t, rng, -hw, -s / 2, hw * 2, s, lighten(road, 0.05));
    clearShadow(ctx);
    strokeSegs(ctx, t.sprite.ink, LW(s), [[-hw, -s / 2, -hw, s / 2], [hw, -s / 2, hw, s / 2]]);
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.02), [s * 0.1, s * 0.08], [[0, -s / 2, 0, s / 2]]);
  },
});

family({
  id: 'transit.road.overpass', name: 'Overpass', category: 'transit',
  tags: ['road', 'overpass', 'bridge', 'flyover', 'junction'], size: 88, variants: 4,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.2; const uw = s * 0.17;
    asphalt(ctx, t, rng, -s / 2, -hw, s, hw * 2, t.terrain.road);
    strokeSegs(ctx, t.sprite.ink, LW(s), [[-s / 2, -hw, s / 2, -hw], [-s / 2, hw, s / 2, hw]]);
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.028), [s * 0.12, s * 0.1], [[-s / 2, 0, s / 2, 0]]);
    softShadow(ctx, t.sprite.shadow, s * 0.1, 0, 0);
    asphalt(ctx, t, rng, -uw, -s / 2, uw * 2, s, lighten(t.terrain.road, 0.05));
    clearShadow(ctx);
    strokeSegs(ctx, t.sprite.ink, Math.max(1.4, s * 0.024), [[-uw, -s / 2, -uw, s / 2], [uw, -s / 2, uw, s / 2]]);
    strokeSegs(ctx, t.sprite.metal, Math.max(1, s * 0.012), [[-uw + s * 0.02, -s / 2, -uw + s * 0.02, s / 2], [uw - s * 0.02, -s / 2, uw - s * 0.02, s / 2]]);
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.026), [s * 0.12, s * 0.1], [[0, -s / 2, 0, s / 2]]);
  },
});

family({
  id: 'transit.road.exitramp', name: 'Motorway Exit Ramp', category: 'transit',
  tags: ['road', 'ramp', 'exit', 'slip', 'motorway', 'highway'], size: 90, variants: 4,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.18; const mx = -s * 0.12;
    asphalt(ctx, t, rng, mx - hw, -s / 2, hw * 2, s, t.terrain.road);
    const ccx = s * 0.6, ccy = s * 0.6, rMid = s * 0.55, rw = s * 0.07;
    ctx.beginPath();
    ctx.arc(ccx, ccy, rMid + rw, Math.PI, Math.PI * 1.4);
    ctx.arc(ccx, ccy, rMid - rw, Math.PI * 1.4, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = t.terrain.road; ctx.fill();
    strokeSegs(ctx, t.sprite.ink, LW(s), [[mx - hw, -s / 2, mx - hw, s / 2], [mx + hw, -s / 2, mx + hw, s / 2]]);
    ctx.strokeStyle = t.sprite.ink; ctx.lineWidth = LW(s);
    ctx.beginPath(); ctx.arc(ccx, ccy, rMid + rw, Math.PI, Math.PI * 1.4); ctx.stroke();
    ctx.beginPath(); ctx.arc(ccx, ccy, rMid - rw, Math.PI, Math.PI * 1.4); ctx.stroke();
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.026), [s * 0.12, s * 0.1], [[mx, -s / 2, mx, s / 2]]);
    ctx.save();
    ctx.strokeStyle = t.terrain.roadLine; ctx.lineWidth = Math.max(1, s * 0.02);
    ctx.setLineDash([s * 0.1, s * 0.08]);
    ctx.beginPath(); ctx.arc(ccx, ccy, rMid, Math.PI, Math.PI * 1.4); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();
    // gore-area chevron near the split
    strokeSegs(ctx, withAlpha(t.terrain.roadLine, 0.85), Math.max(1, s * 0.018), [
      [mx + hw, s * 0.16, mx + hw + s * 0.1, s * 0.24],
      [mx + hw, s * 0.26, mx + hw + s * 0.1, s * 0.34],
    ]);
  },
});

family({
  id: 'transit.road.dirt', name: 'Dirt Road', category: 'transit',
  tags: ['road', 'dirt', 'track', 'path', 'unpaved', 'rural'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.24;
    ctx.beginPath();
    const N = 6;
    ctx.moveTo(-hw + jitter(rng, s * 0.03), -s / 2);
    for (let i = 1; i <= N; i++) { ctx.lineTo(-hw + jitter(rng, s * 0.04), -s / 2 + (s / N) * i); }
    for (let i = N; i >= 0; i--) { ctx.lineTo(hw + jitter(rng, s * 0.04), -s / 2 + (s / N) * i); }
    ctx.closePath();
    ctx.fillStyle = t.terrain.dirt; ctx.fill();
    ctx.save(); ctx.clip();
    speckle(ctx, rng, -hw - 2, -s / 2, hw * 2 + 4, s, withAlpha(darken(t.terrain.dirt, 0.3), 0.4), 50);
    speckle(ctx, rng, -hw - 2, -s / 2, hw * 2 + 4, s, withAlpha(lighten(t.terrain.dirt, 0.25), 0.3), 25);
    dashSegs(ctx, withAlpha(darken(t.terrain.dirt, 0.35), 0.6), Math.max(1, s * 0.02), [s * 0.2, s * 0.12], [
      [-hw * 0.45, -s / 2, -hw * 0.45, s / 2], [hw * 0.45, -s / 2, hw * 0.45, s / 2],
    ]);
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(rand(rng, -hw * 0.8, hw * 0.8), rand(rng, -s * 0.4, s * 0.4), rand(rng, s * 0.01, s * 0.025), 0, Math.PI * 2);
      ctx.fillStyle = withAlpha(t.sprite.stoneDark, 0.6); ctx.fill();
    }
    ctx.restore();
  },
});

family({
  id: 'transit.road.cobblestone', name: 'Cobblestone Road', category: 'transit',
  tags: ['road', 'cobblestone', 'stone', 'paved', 'medieval', 'street'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.27;
    ctx.fillStyle = darken(t.terrain.stone, 0.08);
    ctx.fillRect(-hw, -s / 2, hw * 2, s);
    ctx.save();
    ctx.beginPath(); ctx.rect(-hw, -s / 2, hw * 2, s); ctx.clip();
    const r = s * 0.05;
    let row = 0;
    for (let y = -s / 2; y < s / 2 + r; y += r * 1.7) {
      const off = (row % 2) ? r : 0;
      for (let x = -hw - r; x < hw + r; x += r * 1.8) {
        ngon(ctx, x + off + jitter(rng, r * 0.2), y + jitter(rng, r * 0.2),
          r * rand(rng, 0.7, 0.95), randInt(rng, 5, 6), rand(rng, 0, 1));
        fillStroke(ctx, mix(t.terrain.stone, t.sprite.stoneDark, rand(rng, 0, 0.6)),
          withAlpha(t.sprite.ink, 0.5), Math.max(1, s * 0.01));
      }
      row++;
    }
    ctx.restore();
    strokeSegs(ctx, t.sprite.ink, LW(s), [[-hw, -s / 2, -hw, s / 2], [hw, -s / 2, hw, s / 2]]);
  },
});

// ===========================================================================
// RAIL
// ===========================================================================
family({
  id: 'transit.rail.straight', name: 'Railway Track', category: 'transit',
  tags: ['rail', 'railway', 'train', 'track', 'straight'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme;
    railBand(ctx, t, rng, s, s * 0.28, s * 0.46, true);
  },
});

family({
  id: 'transit.rail.curve', name: 'Railway Curve', category: 'transit',
  tags: ['rail', 'railway', 'train', 'curve', 'bend'], size: 72, variants: 4,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme;
    const cx = s / 2, cy = s / 2, rMid = s / 2, gauge = s * 0.28, halfLen = s * 0.23;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, rMid + halfLen, Math.PI, Math.PI * 1.5);
    ctx.arc(cx, cy, rMid - halfLen, Math.PI * 1.5, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = withAlpha(t.terrain.dirt, 0.55); ctx.fill();
    ctx.clip();
    speckle(ctx, rng, -s / 2, -s / 2, s, s, withAlpha(darken(t.terrain.dirt, 0.35), 0.4), 30);
    ctx.restore();
    ctx.strokeStyle = t.sprite.woodDark; ctx.lineWidth = s * 0.05;
    const a0 = Math.PI, a1 = Math.PI * 1.5, steps = 8;
    for (let i = 0; i <= steps; i++) {
      const a = a0 + (a1 - a0) * (i / steps);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (rMid - halfLen), cy + Math.sin(a) * (rMid - halfLen));
      ctx.lineTo(cx + Math.cos(a) * (rMid + halfLen), cy + Math.sin(a) * (rMid + halfLen));
      ctx.stroke();
    }
    ctx.lineWidth = Math.max(1.2, s * 0.022); ctx.strokeStyle = lighten(t.terrain.rail, 0.18);
    ctx.beginPath(); ctx.arc(cx, cy, rMid - gauge / 2, Math.PI, Math.PI * 1.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, rMid + gauge / 2, Math.PI, Math.PI * 1.5); ctx.stroke();
  },
});

family({
  id: 'transit.rail.junction', name: 'Railway Switch', category: 'transit',
  tags: ['rail', 'railway', 'junction', 'switch', 'points'], size: 88, variants: 4,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const gauge = s * 0.22;
    ctx.fillStyle = withAlpha(t.terrain.dirt, 0.5);
    polygonPath(ctx, [
      { x: -gauge * 1.1, y: -s / 2 }, { x: gauge * 1.1, y: -s / 2 },
      { x: s * 0.5, y: 0 }, { x: s * 0.5, y: s * 0.18 },
      { x: gauge * 1.1, y: s / 2 }, { x: -gauge * 1.1, y: s / 2 },
    ]);
    ctx.fill();
    ctx.fillStyle = t.sprite.woodDark; const step = s * 0.13;
    for (let y = -s / 2; y < s / 2; y += step) { roundRect(ctx, -gauge, y, gauge * 2, s * 0.05, s * 0.012); ctx.fill(); }
    strokeSegs(ctx, lighten(t.terrain.rail, 0.18), Math.max(1.2, s * 0.022), [
      [-gauge / 2, -s / 2, -gauge / 2, s / 2], [gauge / 2, -s / 2, gauge / 2, s / 2],
    ]);
    ctx.strokeStyle = lighten(t.terrain.rail, 0.18); ctx.lineWidth = Math.max(1.2, s * 0.022);
    ctx.beginPath();
    ctx.moveTo(gauge / 2, -s * 0.1); ctx.quadraticCurveTo(s * 0.2, s * 0.1, s * 0.5, s * 0.06); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-gauge / 2, 0); ctx.quadraticCurveTo(s * 0.18, s * 0.22, s * 0.5, s * 0.16); ctx.stroke();
  },
});

family({
  id: 'transit.rail.crossing', name: 'Level Crossing', category: 'transit',
  tags: ['rail', 'railway', 'crossing', 'road', 'level', 'warning'], size: 80, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme; const hw = s * 0.22;
    asphalt(ctx, t, rng, -hw, -s / 2, hw * 2, s, t.terrain.road);
    strokeSegs(ctx, t.sprite.ink, LW(s), [[-hw, -s / 2, -hw, -hw], [hw, -s / 2, hw, -hw], [-hw, hw, -hw, s / 2], [hw, hw, hw, s / 2]]);
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.026), [s * 0.1, s * 0.09], [[0, -s / 2, 0, -hw], [0, hw, 0, s / 2]]);
    ctx.save(); ctx.rotate(Math.PI / 2);
    railBand(ctx, t, rng, s, s * 0.2, s * 0.34, false);
    ctx.restore();
    ctx.fillStyle = t.terrain.roadLine;
    ctx.fillRect(-hw, -hw - s * 0.045, hw * 2, s * 0.03);
    ctx.fillRect(-hw, hw + s * 0.015, hw * 2, s * 0.03);
    hazardBar(ctx, -hw - s * 0.09, -s * 0.02, s * 0.06, s * 0.04, t.sprite.white, t.sprite.danger);
    hazardBar(ctx, hw + s * 0.03, -s * 0.02, s * 0.06, s * 0.04, t.sprite.white, t.sprite.danger);
    strokeSegs(ctx, tint || t.sprite.danger, Math.max(1.4, s * 0.02), [
      [-s * 0.06, -s * 0.06, s * 0.06, s * 0.06], [-s * 0.06, s * 0.06, s * 0.06, -s * 0.06],
    ]);
  },
});

family({
  id: 'transit.rail.station', name: 'Station Platform', category: 'transit',
  tags: ['rail', 'railway', 'station', 'platform', 'train'], size: 92, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme;
    ctx.save(); ctx.rotate(Math.PI / 2);
    railBand(ctx, t, rng, s, s * 0.16, s * 0.26, true);
    ctx.restore();
    const ph = s * 0.18;
    for (const sgn of [-1, 1]) {
      const y0 = sgn > 0 ? ph : -ph - s * 0.2;
      ctx.beginPath();
      roundRect(ctx, -s / 2, y0, s, s * 0.2, s * 0.02);
      fillStroke(ctx, t.sprite.stoneLight, t.sprite.ink, LW(s));
      ctx.fillStyle = t.sprite.gold;
      const ey = sgn > 0 ? ph + s * 0.015 : -ph - s * 0.03;
      ctx.fillRect(-s / 2, ey, s, s * 0.02);
    }
    softShadow(ctx, t.sprite.shadow, s * 0.06, s * 0.02, 0);
    roundRect(ctx, -s * 0.18, -ph - s * 0.16, s * 0.36, s * 0.1, s * 0.02);
    fillStroke(ctx, t.sprite.roof, t.sprite.ink, LW(s));
    clearShadow(ctx);
    ctx.fillStyle = tint || t.sprite.wood;
    for (let i = -1; i <= 1; i++) { roundRect(ctx, i * s * 0.16 - s * 0.04, ph + s * 0.12, s * 0.08, s * 0.03, s * 0.01); ctx.fill(); }
  },
});

family({
  id: 'transit.rail.metro', name: 'Metro Entrance', category: 'transit',
  tags: ['metro', 'subway', 'underground', 'entrance', 'station', 'stairs'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme;
    ctx.fillStyle = t.sprite.stone; ctx.fillRect(-s / 2, -s / 2, s, s);
    speckle(ctx, rng, -s / 2, -s / 2, s, s, withAlpha(t.sprite.stoneDark, 0.25), 30);
    const ox = -s * 0.28, oy = -s * 0.18, ow = s * 0.5, oh = s * 0.5;
    roundRect(ctx, ox, oy, ow, oh, s * 0.03);
    fillStroke(ctx, darken(t.sprite.stoneDark, 0.2), t.sprite.ink, LW(s));
    ctx.save(); roundRect(ctx, ox, oy, ow, oh, s * 0.03); ctx.clip();
    ctx.strokeStyle = t.sprite.stoneLight; ctx.lineWidth = Math.max(1, s * 0.018);
    for (let i = 1; i < 6; i++) { const y = oy + (oh / 6) * i; ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + ow, y); ctx.stroke(); }
    ctx.restore();
    strokeSegs(ctx, t.sprite.metal, Math.max(1.4, s * 0.022), [[ox, oy, ox + ow, oy], [ox, oy + oh, ox + ow, oy + oh]]);
    groundShadow(ctx, s * 0.28, s * 0.34, s * 0.08, s * 0.03, t.sprite.shadow);
    ctx.beginPath(); ctx.arc(s * 0.28, s * 0.18, s * 0.12, 0, Math.PI * 2);
    fillStroke(ctx, tint || t.sprite.accent, t.sprite.ink, LW(s));
    ctx.strokeStyle = t.sprite.white; ctx.lineWidth = Math.max(1.4, s * 0.03);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const mx = s * 0.28, my = s * 0.18, r = s * 0.06;
    ctx.beginPath();
    ctx.moveTo(mx - r, my + r); ctx.lineTo(mx - r, my - r); ctx.lineTo(mx, my + r * 0.2);
    ctx.lineTo(mx + r, my - r); ctx.lineTo(mx + r, my + r);
    ctx.stroke();
    ctx.lineCap = 'butt';
  },
});

family({
  id: 'transit.rail.tram', name: 'Tram Line', category: 'transit',
  tags: ['tram', 'streetcar', 'trolley', 'rail', 'street'], size: 72, variants: 4,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.28; const gauge = s * 0.2;
    asphalt(ctx, t, rng, -hw, -s / 2, hw * 2, s, mix(t.terrain.road, t.sprite.stone, 0.3));
    strokeSegs(ctx, t.sprite.ink, LW(s), [[-hw, -s / 2, -hw, s / 2], [hw, -s / 2, hw, s / 2]]);
    strokeSegs(ctx, darken(t.terrain.rail, 0.1), Math.max(1.2, s * 0.02), [[-gauge / 2, -s / 2, -gauge / 2, s / 2], [gauge / 2, -s / 2, gauge / 2, s / 2]]);
    strokeSegs(ctx, lighten(t.terrain.rail, 0.25), Math.max(1, s * 0.008), [[-gauge / 2, -s / 2, -gauge / 2, s / 2], [gauge / 2, -s / 2, gauge / 2, s / 2]]);
    ctx.fillStyle = t.sprite.metalDark;
    for (const sx of [-1, 1]) {
      for (const y of [-s * 0.3, s * 0.1]) {
        ctx.beginPath(); ctx.arc(sx * hw * 0.85, y, s * 0.025, 0, Math.PI * 2); ctx.fill();
      }
    }
  },
});

// ===========================================================================
// AIR
// ===========================================================================
family({
  id: 'transit.air.runway', name: 'Runway', category: 'transit',
  tags: ['airport', 'runway', 'aviation', 'tarmac', 'aircraft'], size: 96, variants: 4,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.3;
    const tar = darken(t.terrain.road, 0.32);
    asphalt(ctx, t, rng, -hw, -s / 2, hw * 2, s, tar);
    strokeSegs(ctx, t.terrain.roadLine, Math.max(1.4, s * 0.018), [[-hw + s * 0.02, -s / 2, -hw + s * 0.02, s / 2], [hw - s * 0.02, -s / 2, hw - s * 0.02, s / 2]]);
    dashSegs(ctx, t.terrain.roadLine, Math.max(1.5, s * 0.03), [s * 0.14, s * 0.1], [[0, -s * 0.4, 0, s * 0.4]]);
    ctx.fillStyle = t.terrain.roadLine;
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue;
      const x = i * (hw / 4.2);
      ctx.fillRect(x - hw * 0.045, -s / 2 + s * 0.03, hw * 0.09, s * 0.1);
      ctx.fillRect(x - hw * 0.045, s / 2 - s * 0.13, hw * 0.09, s * 0.1);
    }
  },
});

family({
  id: 'transit.air.taxiway', name: 'Taxiway', category: 'transit',
  tags: ['airport', 'taxiway', 'aviation', 'tarmac', 'apron'], size: 80, variants: 4,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.24;
    asphalt(ctx, t, rng, -hw, -s / 2, hw * 2, s, darken(t.terrain.road, 0.28));
    strokeSegs(ctx, t.sprite.ink, LW(s), [[-hw, -s / 2, -hw, s / 2], [hw, -s / 2, hw, s / 2]]);
    strokeSegs(ctx, t.sprite.gold, Math.max(1.5, s * 0.03), [[0, -s / 2, 0, s / 2]]);
    dashSegs(ctx, withAlpha(t.sprite.gold, 0.8), Math.max(1, s * 0.014), [s * 0.08, s * 0.06], [
      [-hw + s * 0.03, -s / 2, -hw + s * 0.03, s / 2], [hw - s * 0.03, -s / 2, hw - s * 0.03, s / 2],
    ]);
    ctx.fillStyle = t.sprite.gold;
    ctx.fillRect(-hw, -s * 0.06, hw * 2, s * 0.015);
    ctx.fillRect(-hw, -s * 0.02, hw * 2, s * 0.015);
  },
});

family({
  id: 'transit.air.helipad', name: 'Helipad', category: 'transit',
  tags: ['helipad', 'helicopter', 'aviation', 'pad', 'landing'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme; const R = s * 0.4;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
    fillStroke(ctx, darken(t.terrain.road, 0.2), t.sprite.ink, LW(s));
    speckle(ctx, rng, -R, -R, R * 2, R * 2, withAlpha(darken(t.terrain.road, 0.4), 0.15), 24);
    ctx.beginPath(); ctx.arc(0, 0, R * 0.78, 0, Math.PI * 2);
    ctx.strokeStyle = tint || t.terrain.roadLine; ctx.lineWidth = Math.max(1.5, s * 0.03); ctx.stroke();
    ctx.strokeStyle = t.terrain.roadLine; ctx.lineWidth = Math.max(2, s * 0.06); ctx.lineCap = 'butt';
    const hwd = s * 0.12, hht = s * 0.18;
    ctx.beginPath();
    ctx.moveTo(-hwd, -hht); ctx.lineTo(-hwd, hht);
    ctx.moveTo(hwd, -hht); ctx.lineTo(hwd, hht);
    ctx.moveTo(-hwd, 0); ctx.lineTo(hwd, 0);
    ctx.stroke();
  },
});

// ===========================================================================
// BRIDGES
// ===========================================================================
family({
  id: 'transit.bridge.beam', name: 'Beam Bridge', category: 'transit',
  tags: ['bridge', 'beam', 'crossing', 'river', 'road'], size: 80, variants: 4,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.24;
    ctx.fillStyle = t.terrain.water; ctx.fillRect(-s * 0.18, -s / 2, s * 0.36, s);
    ctx.fillStyle = withAlpha(t.terrain.waterDeep, 0.5);
    for (let i = 0; i < 4; i++) { ctx.fillRect(-s * 0.16, rand(rng, -s * 0.4, s * 0.4), s * 0.32, s * 0.015); }
    softShadow(ctx, t.sprite.shadow, s * 0.08, s * 0.04, 0);
    asphalt(ctx, t, rng, -s / 2, -hw, s, hw * 2, t.terrain.road);
    clearShadow(ctx);
    strokeSegs(ctx, t.sprite.ink, Math.max(1.5, s * 0.026), [[-s / 2, -hw, s / 2, -hw], [-s / 2, hw, s / 2, hw]]);
    strokeSegs(ctx, t.sprite.metal, Math.max(1, s * 0.012), [[-s / 2, -hw + s * 0.02, s / 2, -hw + s * 0.02], [-s / 2, hw - s * 0.02, s / 2, hw - s * 0.02]]);
    strokeSegs(ctx, withAlpha(t.sprite.ink, 0.5), Math.max(1, s * 0.012), [[-s * 0.18, -hw, -s * 0.18, hw], [s * 0.18, -hw, s * 0.18, hw]]);
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.024), [s * 0.12, s * 0.1], [[-s / 2, 0, s / 2, 0]]);
    ctx.fillStyle = t.sprite.stoneDark;
    roundRect(ctx, -s * 0.2, -hw - s * 0.02, s * 0.04, hw * 2 + s * 0.04, s * 0.01); ctx.fill();
    roundRect(ctx, s * 0.16, -hw - s * 0.02, s * 0.04, hw * 2 + s * 0.04, s * 0.01); ctx.fill();
  },
});

family({
  id: 'transit.bridge.suspension', name: 'Suspension Bridge', category: 'transit',
  tags: ['bridge', 'suspension', 'tower', 'cable', 'crossing'], size: 88, variants: 4,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.2;
    ctx.fillStyle = t.terrain.water; ctx.fillRect(-s / 2, -s / 2, s, s);
    ctx.fillStyle = withAlpha(t.terrain.waterDeep, 0.45);
    for (let i = 0; i < 5; i++) { ctx.fillRect(-s / 2, rand(rng, -s * 0.45, s * 0.45), s, s * 0.012); }
    ctx.strokeStyle = t.sprite.metalDark; ctx.lineWidth = Math.max(1.4, s * 0.02);
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(-s / 2, sgn * hw);
      ctx.quadraticCurveTo(0, sgn * hw * 2.4, s / 2, sgn * hw);
      ctx.stroke();
    }
    softShadow(ctx, t.sprite.shadow, s * 0.07, 0, 0);
    asphalt(ctx, t, rng, -s / 2, -hw, s, hw * 2, t.terrain.road);
    clearShadow(ctx);
    strokeSegs(ctx, t.sprite.ink, Math.max(1.4, s * 0.024), [[-s / 2, -hw, s / 2, -hw], [-s / 2, hw, s / 2, hw]]);
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.022), [s * 0.12, s * 0.1], [[-s / 2, 0, s / 2, 0]]);
    strokeSegs(ctx, withAlpha(t.sprite.metalDark, 0.7), Math.max(1, s * 0.008), [
      [-s * 0.35, -hw, -s * 0.35, hw], [-s * 0.1, -hw, -s * 0.1, hw], [s * 0.1, -hw, s * 0.1, hw], [s * 0.35, -hw, s * 0.35, hw],
    ]);
    for (const tx of [-s * 0.22, s * 0.22]) {
      roundRect(ctx, tx - s * 0.03, -hw - s * 0.08, s * 0.06, hw * 2 + s * 0.16, s * 0.01);
      fillStroke(ctx, t.sprite.metal, t.sprite.ink, Math.max(1, s * 0.014));
    }
  },
});

family({
  id: 'transit.bridge.arch', name: 'Arch Bridge', category: 'transit',
  tags: ['bridge', 'arch', 'stone', 'viaduct', 'crossing'], size: 88, variants: 4,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.2;
    ctx.fillStyle = t.terrain.water; ctx.fillRect(-s * 0.22, -s / 2, s * 0.44, s);
    ctx.strokeStyle = t.sprite.stoneDark; ctx.lineWidth = Math.max(1.5, s * 0.03);
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(0, sgn * hw, s * 0.2, 0, Math.PI, sgn < 0);
      ctx.stroke();
    }
    softShadow(ctx, t.sprite.shadow, s * 0.07, 0, 0);
    roundRect(ctx, -s / 2, -hw, s, hw * 2, s * 0.02);
    fillStroke(ctx, t.sprite.stone, t.sprite.ink, LW(s));
    clearShadow(ctx);
    strokeSegs(ctx, withAlpha(t.sprite.stoneDark, 0.6), Math.max(1, s * 0.012),
      [-3, -2, -1, 0, 1, 2, 3].map((i) => [i * s * 0.12, -hw, i * s * 0.12, hw]));
    strokeSegs(ctx, t.sprite.ink, Math.max(1.2, s * 0.016), [[-s / 2, -hw + s * 0.03, s / 2, -hw + s * 0.03], [-s / 2, hw - s * 0.03, s / 2, hw - s * 0.03]]);
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.02), [s * 0.1, s * 0.09], [[-s / 2, 0, s / 2, 0]]);
  },
});

// ===========================================================================
// TUNNEL / WATER INFRASTRUCTURE
// ===========================================================================
family({
  id: 'transit.tunnel.portal', name: 'Tunnel Portal', category: 'transit',
  tags: ['tunnel', 'portal', 'mountain', 'entrance', 'road'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.22;
    asphalt(ctx, t, rng, -hw, 0, hw * 2, s / 2, t.terrain.road);
    strokeSegs(ctx, t.sprite.ink, LW(s), [[-hw, 0, -hw, s / 2], [hw, 0, hw, s / 2]]);
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.028), [s * 0.1, s * 0.09], [[0, s * 0.08, 0, s / 2]]);
    roundRect(ctx, -s / 2, -s / 2, s, s * 0.55, s * 0.02);
    fillStroke(ctx, t.sprite.stone, t.sprite.ink, LW(s));
    ctx.save(); roundRect(ctx, -s / 2, -s / 2, s, s * 0.55, s * 0.02); ctx.clip();
    strokeSegs(ctx, withAlpha(t.sprite.stoneDark, 0.5), Math.max(1, s * 0.01), [
      [-s / 2, -s * 0.28, s / 2, -s * 0.28], [-s / 2, -s * 0.06, s / 2, -s * 0.06],
    ]);
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(-hw, s * 0.06);
    ctx.lineTo(-hw, -s * 0.1);
    ctx.arc(0, -s * 0.1, hw, Math.PI, 0);
    ctx.lineTo(hw, s * 0.06);
    ctx.closePath();
    fillStroke(ctx, t.sprite.ink, t.sprite.ink, LW(s));
    ctx.fillStyle = t.sprite.stoneDark;
    roundRect(ctx, -s * 0.04, -s * 0.34, s * 0.08, s * 0.1, s * 0.01); ctx.fill();
  },
});

family({
  id: 'transit.canal.lock', name: 'Canal Lock', category: 'transit',
  tags: ['canal', 'lock', 'water', 'gate', 'waterway'], size: 80, variants: 4,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const cw = s * 0.26;
    ctx.fillStyle = t.terrain.water; ctx.fillRect(-cw, -s / 2, cw * 2, s);
    ctx.fillStyle = withAlpha(t.terrain.waterDeep, 0.6); ctx.fillRect(-cw, 0, cw * 2, s / 2);
    ctx.fillStyle = withAlpha(t.sprite.waterLight, 0.5);
    for (let i = 0; i < 5; i++) { ctx.fillRect(-cw, rand(rng, -s * 0.45, s * 0.45), cw * 2, s * 0.012); }
    roundRect(ctx, -cw - s * 0.06, -s / 2, s * 0.06, s, s * 0.01); fillStroke(ctx, t.sprite.stone, t.sprite.ink, LW(s));
    roundRect(ctx, cw, -s / 2, s * 0.06, s, s * 0.01); fillStroke(ctx, t.sprite.stone, t.sprite.ink, LW(s));
    ctx.strokeStyle = t.sprite.woodDark; ctx.lineWidth = Math.max(1.6, s * 0.028);
    for (const gy of [-s * 0.24, s * 0.24]) {
      ctx.beginPath();
      ctx.moveTo(-cw, gy - s * 0.04); ctx.lineTo(0, gy);
      ctx.lineTo(cw, gy - s * 0.04); ctx.stroke();
    }
    ctx.fillStyle = t.sprite.metalDark;
    for (const by of [-s * 0.1, s * 0.1]) {
      for (const bx of [-cw - s * 0.03, cw + s * 0.03]) {
        ctx.beginPath(); ctx.arc(bx, by, s * 0.022, 0, Math.PI * 2); ctx.fill();
      }
    }
  },
});

family({
  id: 'transit.water.dam', name: 'Dam', category: 'transit',
  tags: ['dam', 'hydro', 'reservoir', 'water', 'wall', 'spillway'], size: 90, variants: 4,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme;
    ctx.fillStyle = t.terrain.waterDeep; ctx.fillRect(-s / 2, -s / 2, s, s * 0.42);
    ctx.fillStyle = t.terrain.water; ctx.fillRect(-s / 2, s * 0.16, s, s * 0.34);
    ctx.beginPath();
    ctx.moveTo(-s / 2, -s * 0.08);
    ctx.quadraticCurveTo(0, s * 0.06, s / 2, -s * 0.08);
    ctx.lineTo(s / 2, s * 0.16);
    ctx.quadraticCurveTo(0, s * 0.3, -s / 2, s * 0.16);
    ctx.closePath();
    fillStroke(ctx, t.sprite.stone, t.sprite.ink, LW(s));
    strokeSegs(ctx, withAlpha(t.sprite.stoneDark, 0.6), Math.max(1, s * 0.012),
      [-3, -2, -1, 0, 1, 2, 3].map((i) => [i * s * 0.13, -s * 0.05, i * s * 0.13, s * 0.2]));
    ctx.fillStyle = withAlpha(t.sprite.metalDark, 0.8);
    for (let i = -1; i <= 1; i++) { roundRect(ctx, i * s * 0.18 - s * 0.05, 0, s * 0.1, s * 0.16, s * 0.01); ctx.fill(); }
    strokeSegs(ctx, withAlpha(t.sprite.ink, 0.6), Math.max(1, s * 0.012), [[-s / 2, -s * 0.08, s / 2, -s * 0.08]]);
    dashSegs(ctx, t.terrain.roadLine, Math.max(1, s * 0.02), [s * 0.08, s * 0.07], [[-s / 2, -s * 0.02, s / 2, -s * 0.02]]);
    speckle(ctx, rng, -s / 2, s * 0.18, s, s * 0.1, withAlpha(t.sprite.white, 0.6), 30);
  },
});

family({
  id: 'transit.water.aqueduct', name: 'Aqueduct', category: 'transit',
  tags: ['aqueduct', 'water', 'channel', 'roman', 'arches', 'viaduct'], size: 88, variants: 4,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme; const hw = s * 0.22;
    softShadow(ctx, t.sprite.shadow, s * 0.07, 0, 0);
    roundRect(ctx, -s / 2, -hw, s, hw * 2, s * 0.02);
    fillStroke(ctx, t.sprite.stone, t.sprite.ink, LW(s));
    clearShadow(ctx);
    ctx.fillStyle = t.terrain.water;
    ctx.fillRect(-s / 2, -s * 0.05, s, s * 0.1);
    strokeSegs(ctx, withAlpha(t.sprite.waterLight, 0.7), Math.max(1, s * 0.01), [[-s / 2, 0, s / 2, 0]]);
    strokeSegs(ctx, t.sprite.ink, Math.max(1.2, s * 0.016), [[-s / 2, -s * 0.06, s / 2, -s * 0.06], [-s / 2, s * 0.06, s / 2, s * 0.06]]);
    ctx.strokeStyle = t.sprite.stoneDark; ctx.lineWidth = Math.max(1.4, s * 0.02);
    for (let i = -2; i <= 2; i++) {
      const x = i * s * 0.2;
      ctx.beginPath(); ctx.arc(x, hw, s * 0.09, Math.PI, 0); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, -hw, s * 0.09, 0, Math.PI); ctx.stroke();
    }
    strokeSegs(ctx, withAlpha(t.sprite.stoneDark, 0.5), Math.max(1, s * 0.01),
      [-3, -2, -1, 1, 2, 3].map((i) => [i * s * 0.14, -hw, i * s * 0.14, hw]));
  },
});

// ===========================================================================
// UTILITY / INDUSTRIAL
// ===========================================================================
family({
  id: 'transit.power.pylon', name: 'Power-line Pylon', category: 'transit',
  tags: ['power', 'pylon', 'electricity', 'transmission', 'grid', 'cable'], size: 80, variants: 5,
  draw(ctx, { size, rng, theme }) {
    const s = size, t = theme;
    const arms = [s * 0.34, s * 0.2, s * 0.34];
    const armY = [-s * 0.14, 0, s * 0.14];
    ctx.strokeStyle = withAlpha(t.sprite.ink, 0.6); ctx.lineWidth = Math.max(1, s * 0.012);
    for (let k = 0; k < 3; k++) {
      for (const sgn of [-1, 1]) {
        const ax = sgn * arms[k];
        ctx.beginPath();
        ctx.moveTo(ax, -s / 2); ctx.quadraticCurveTo(ax, armY[k], ax, s / 2); ctx.stroke();
      }
    }
    groundShadow(ctx, 0, 0, s * 0.3, s * 0.12, t.sprite.shadow);
    ngon(ctx, 0, 0, s * 0.16, 4, Math.PI / 4);
    fillStroke(ctx, withAlpha(t.sprite.metal, 0.85), t.sprite.metalDark, Math.max(1, s * 0.014));
    strokeSegs(ctx, t.sprite.metalDark, Math.max(1, s * 0.012), [
      [-s * 0.11, -s * 0.11, s * 0.11, s * 0.11], [-s * 0.11, s * 0.11, s * 0.11, -s * 0.11],
    ]);
    ctx.fillStyle = t.sprite.metal;
    for (let k = 0; k < 3; k++) { ctx.fillRect(-arms[k], armY[k] - s * 0.012, arms[k] * 2, s * 0.024); }
    ctx.fillStyle = t.sprite.glass;
    for (let k = 0; k < 3; k++) {
      for (const sgn of [-1, 1]) { ctx.beginPath(); ctx.arc(sgn * arms[k], armY[k], s * 0.018, 0, Math.PI * 2); ctx.fill(); }
    }
  },
});

family({
  id: 'transit.pipe.segment', name: 'Pipeline', category: 'transit',
  tags: ['pipeline', 'pipe', 'oil', 'gas', 'industrial', 'utility'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme; const hw = s * 0.16;
    ctx.fillStyle = t.sprite.metalDark;
    for (const y of [-s * 0.28, s * 0.28]) {
      roundRect(ctx, -hw - s * 0.03, y - s * 0.03, hw * 2 + s * 0.06, s * 0.06, s * 0.01); ctx.fill();
    }
    groundShadow(ctx, 0, 0, hw * 1.4, s * 0.46, t.sprite.shadow);
    roundRect(ctx, -hw, -s / 2, hw * 2, s, hw * 0.5);
    fillStroke(ctx, tint || t.sprite.metal, t.sprite.ink, LW(s));
    strokeSegs(ctx, withAlpha(t.sprite.white, 0.5), Math.max(1.4, s * 0.02), [[-hw * 0.4, -s / 2, -hw * 0.4, s / 2]]);
    strokeSegs(ctx, withAlpha(t.sprite.ink, 0.3), Math.max(1.4, s * 0.02), [[hw * 0.55, -s / 2, hw * 0.55, s / 2]]);
    ctx.fillStyle = darken(t.sprite.metal, 0.2);
    for (const y of [-s * 0.16, s * 0.16]) {
      roundRect(ctx, -hw - s * 0.02, y - s * 0.02, hw * 2 + s * 0.04, s * 0.04, s * 0.01); ctx.fill();
      strokeSegs(ctx, withAlpha(t.sprite.ink, 0.5), Math.max(1, s * 0.01), [[-hw, y, hw, y]]);
    }
  },
});

family({
  id: 'transit.port.gantry', name: 'Gantry Crane', category: 'transit',
  tags: ['port', 'crane', 'gantry', 'container', 'harbor', 'dock'], size: 96, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme;
    ctx.fillStyle = t.terrain.water; ctx.fillRect(-s / 2, -s / 2, s * 0.32, s);
    ctx.fillStyle = t.sprite.stone; ctx.fillRect(-s * 0.18, -s / 2, s * 0.68, s);
    speckle(ctx, rng, -s * 0.18, -s / 2, s * 0.68, s, withAlpha(t.sprite.stoneDark, 0.25), 30);
    strokeSegs(ctx, t.sprite.ink, LW(s), [[-s * 0.18, -s / 2, -s * 0.18, s / 2]]);
    strokeSegs(ctx, t.sprite.metalDark, Math.max(1.4, s * 0.02), [[-s * 0.05, -s / 2, -s * 0.05, s / 2], [s * 0.3, -s / 2, s * 0.3, s / 2]]);
    groundShadow(ctx, s * 0.05, 0, s * 0.4, s * 0.16, t.sprite.shadow);
    const boom = tint || t.sprite.accent;
    softShadow(ctx, t.sprite.shadow, s * 0.07, 0, s * 0.04);
    roundRect(ctx, -s * 0.42, -s * 0.06, s * 0.78, s * 0.12, s * 0.02);
    fillStroke(ctx, t.sprite.metal, t.sprite.ink, LW(s));
    clearShadow(ctx);
    for (const lx of [-s * 0.05, s * 0.3]) {
      for (const ly of [-s * 0.34, s * 0.34]) {
        roundRect(ctx, lx - s * 0.025, ly - s * 0.04, s * 0.05, s * 0.08, s * 0.01);
        fillStroke(ctx, t.sprite.metal, t.sprite.metalDark, Math.max(1, s * 0.012));
      }
    }
    ctx.beginPath();
    roundRect(ctx, -s * 0.3, -s * 0.04, s * 0.08, s * 0.08, s * 0.01);
    ctx.fillStyle = boom; ctx.fill();
    strokeSegs(ctx, t.sprite.ink, Math.max(1, s * 0.012), [[-s * 0.26, s * 0.04, -s * 0.26, s * 0.18]]);
    ctx.fillStyle = t.sprite.danger;
    roundRect(ctx, -s * 0.31, s * 0.18, s * 0.1, s * 0.03, s * 0.005); ctx.fill();
    strokeSegs(ctx, boom, Math.max(1.4, s * 0.02), [[-s * 0.42, -s * 0.04, s * 0.36, -s * 0.04]]);
  },
});

family({
  id: 'transit.port.dockcrane', name: 'Dock Crane', category: 'transit',
  tags: ['port', 'crane', 'jib', 'harbor', 'dock', 'cargo'], size: 90, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme;
    ctx.fillStyle = t.terrain.water; ctx.fillRect(-s / 2, -s / 2, s, s * 0.34);
    ctx.fillStyle = t.sprite.stone; ctx.fillRect(-s / 2, 0, s, s * 0.5);
    strokeSegs(ctx, t.sprite.ink, LW(s), [[-s / 2, 0, s / 2, 0]]);
    groundShadow(ctx, 0, s * 0.12, s * 0.22, s * 0.1, t.sprite.shadow);
    ctx.beginPath(); ctx.arc(0, s * 0.12, s * 0.1, 0, Math.PI * 2);
    fillStroke(ctx, t.sprite.metalDark, t.sprite.ink, LW(s));
    const ang = rand(rng, -1.0, -0.5);
    ctx.save(); ctx.translate(0, s * 0.12); ctx.rotate(ang);
    roundRect(ctx, -s * 0.12, -s * 0.03, s * 0.5, s * 0.06, s * 0.01);
    fillStroke(ctx, tint || t.sprite.gold, t.sprite.ink, LW(s));
    strokeSegs(ctx, withAlpha(t.sprite.ink, 0.4), Math.max(1, s * 0.01),
      [0, 1, 2, 3, 4].map((i) => [i * s * 0.09 - s * 0.08, -s * 0.03, i * s * 0.09 - s * 0.05, s * 0.03]));
    ctx.fillStyle = t.sprite.metalDark;
    roundRect(ctx, -s * 0.18, -s * 0.045, s * 0.08, s * 0.09, s * 0.01); ctx.fill();
    strokeSegs(ctx, t.sprite.ink, Math.max(1, s * 0.012), [[s * 0.36, 0, s * 0.36, s * 0.1]]);
    ctx.restore();
    ctx.beginPath(); ctx.arc(0, s * 0.12, s * 0.045, 0, Math.PI * 2);
    fillStroke(ctx, t.sprite.glass, t.sprite.ink, Math.max(1, s * 0.012));
  },
});

// ===========================================================================
// LOTS / DEPOTS
// ===========================================================================
family({
  id: 'transit.lot.parking', name: 'Parking Lot', category: 'transit',
  tags: ['parking', 'lot', 'cars', 'asphalt', 'spaces'], size: 80, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme;
    asphalt(ctx, t, rng, -s / 2, -s / 2, s, s, t.terrain.road);
    ctx.strokeStyle = t.terrain.roadLine; ctx.lineWidth = Math.max(1, s * 0.016);
    const bays = 6;
    for (let i = 0; i <= bays; i++) {
      const x = -s / 2 + (s / bays) * i;
      ctx.beginPath(); ctx.moveTo(x, -s / 2); ctx.lineTo(x, -s * 0.08); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, s * 0.08); ctx.lineTo(x, s / 2); ctx.stroke();
    }
    dashSegs(ctx, withAlpha(t.terrain.roadLine, 0.7), Math.max(1, s * 0.014), [s * 0.06, s * 0.05], [[-s / 2, 0, s / 2, 0]]);
    const carCols = [t.sprite.roof, t.sprite.accent, t.sprite.metal, tint || t.sprite.gold, t.sprite.danger];
    for (let i = 0; i < bays; i++) {
      const x = -s / 2 + (s / bays) * (i + 0.5);
      if (chance(rng, 0.55)) {
        roundRect(ctx, x - s * 0.05, -s * 0.42, s * 0.1, s * 0.28, s * 0.02);
        fillStroke(ctx, pick(rng, carCols), t.sprite.ink, Math.max(1, s * 0.012));
        strokeSegs(ctx, withAlpha(t.sprite.glass, 0.8), Math.max(1, s * 0.012), [[x - s * 0.04, -s * 0.3, x + s * 0.04, -s * 0.3]]);
      }
      if (chance(rng, 0.55)) {
        roundRect(ctx, x - s * 0.05, s * 0.14, s * 0.1, s * 0.28, s * 0.02);
        fillStroke(ctx, pick(rng, carCols), t.sprite.ink, Math.max(1, s * 0.012));
        strokeSegs(ctx, withAlpha(t.sprite.glass, 0.8), Math.max(1, s * 0.012), [[x - s * 0.04, s * 0.3, x + s * 0.04, s * 0.3]]);
      }
    }
  },
});

family({
  id: 'transit.lot.busdepot', name: 'Bus Depot', category: 'transit',
  tags: ['bus', 'depot', 'station', 'terminal', 'transport'], size: 90, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme;
    asphalt(ctx, t, rng, -s / 2, -s / 2, s, s, mix(t.terrain.road, t.sprite.stone, 0.25));
    softShadow(ctx, t.sprite.shadow, s * 0.06, s * 0.03, 0);
    roundRect(ctx, -s / 2, -s / 2, s, s * 0.18, s * 0.02);
    fillStroke(ctx, t.sprite.stoneLight, t.sprite.ink, LW(s));
    clearShadow(ctx);
    ctx.strokeStyle = t.terrain.roadLine; ctx.lineWidth = Math.max(1, s * 0.016);
    const bays = 4;
    for (let i = 0; i <= bays; i++) { const x = -s / 2 + (s / bays) * i; ctx.beginPath(); ctx.moveTo(x, -s * 0.32); ctx.lineTo(x, s / 2); ctx.stroke(); }
    const cols = [t.sprite.accent, tint || t.sprite.flag, t.sprite.gold, t.sprite.leaf];
    for (let i = 0; i < bays; i++) {
      if (chance(rng, 0.7)) {
        const x = -s / 2 + (s / bays) * (i + 0.5);
        roundRect(ctx, x - s * 0.07, -s * 0.28, s * 0.14, s * 0.5, s * 0.03);
        fillStroke(ctx, pick(rng, cols), t.sprite.ink, Math.max(1.2, s * 0.014));
        ctx.fillStyle = t.sprite.glass;
        for (let w = 0; w < 3; w++) { roundRect(ctx, x - s * 0.05, -s * 0.22 + w * s * 0.12, s * 0.1, s * 0.06, s * 0.01); ctx.fill(); }
        strokeSegs(ctx, withAlpha(t.sprite.ink, 0.4), Math.max(1, s * 0.01), [[x - s * 0.07, -s * 0.03, x + s * 0.07, -s * 0.03]]);
      }
    }
  },
});
