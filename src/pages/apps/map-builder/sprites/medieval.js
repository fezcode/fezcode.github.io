import { family } from './registry';
import {
  makeRng, rand, randInt, pick, chance, jitter,
  mix, darken, lighten, withAlpha,
  roundRect, polygonPath, ngon, star, blob, fillStroke, hatch,
  softShadow, clearShadow, groundShadow,
} from './draw';

// ----------------------------------------------------------------------------
// Medieval sprite pack. Castles, towers, walls, dwellings, religious buildings,
// mills, commerce, camps, bridges, ships, ruins, megaliths, siege engines and
// carts. Every generator draws with pure Canvas2D vectors using theme palette
// colours only. Origin (0,0) is the centre; +y is down.
// ----------------------------------------------------------------------------

// ---- module-local helpers (not exported) ----
const LW = (s) => Math.max(1, s * 0.02);
const TLW = (s) => Math.max(0.75, s * 0.012);

// horizontal masonry courses inside a rect
function courses(ctx, x, y, w, h, rows, color, lw) {
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineJoin = 'round';
  for (let i = 1; i < rows; i++) {
    const yy = y + (h / rows) * i;
    ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke();
  }
}

// vertical plank / board lines inside a rect
function planks(ctx, x, y, w, h, n, color, lw) {
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round';
  for (let i = 1; i < n; i++) {
    const xx = x + (w / n) * i;
    ctx.beginPath(); ctx.moveTo(xx, y); ctx.lineTo(xx, y + h); ctx.stroke();
  }
}

// crenellations sitting on top edge `yTop`, exactly spanning [x0, x0+w]
function battlement(ctx, x0, yTop, w, count, mh, body, ink, lw) {
  const mw = w / (count * 2 - 1);
  for (let i = 0; i < count; i++) {
    const mx = x0 + i * 2 * mw;
    ctx.beginPath(); ctx.rect(mx, yTop - mh, mw, mh);
    fillStroke(ctx, body, ink, lw);
  }
}

// round-topped (arched) opening: builds path only, base at top+h, peak at top
function arch(ctx, cx, top, w, h) {
  const r = w / 2;
  ctx.beginPath();
  ctx.moveTo(cx - r, top + h);
  ctx.lineTo(cx - r, top + r);
  ctx.arc(cx, top + r, r, Math.PI, Math.PI * 2);
  ctx.lineTo(cx + r, top + h);
  ctx.closePath();
}

// triangular pennant streaming from a pole top at (x,y)
function pennant(ctx, x, y, len, drop, color, ink, lw, dir) {
  dir = dir || 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dir * len, y + drop * 0.45);
  ctx.lineTo(x, y + drop);
  ctx.closePath();
  fillStroke(ctx, color, ink, lw);
}

// rectangular flag flying from a pole top at (x,y)
function flag(ctx, x, y, w, h, color, ink, lw, dir, rng) {
  dir = dir || 1;
  const wob = rng ? jitter(rng, h * 0.14) : 0;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dir * w * 0.5, y - wob * 0.5);
  ctx.lineTo(x + dir * w, y + wob);
  ctx.lineTo(x + dir * w, y + h + wob);
  ctx.lineTo(x + dir * w * 0.5, y + h - wob * 0.5);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  fillStroke(ctx, color, ink, lw);
}

// vertical pole
function pole(ctx, x, yTop, yBot, color, lw) {
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, yBot); ctx.lineTo(x, yTop); ctx.stroke();
}

// gentle water ripples beneath a hull
function ripples(ctx, cx, cy, w, color, lw, rng) {
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const yy = cy + i * lw * 2.4;
    const ww = w * (1 - i * 0.14);
    ctx.beginPath();
    ctx.moveTo(cx - ww / 2, yy);
    ctx.quadraticCurveTo(cx - ww / 4, yy + lw * 1.6, cx, yy);
    ctx.quadraticCurveTo(cx + ww / 4, yy - lw * 1.6, cx + ww / 2, yy);
    ctx.stroke();
  }
}

// boat hull, flat sheer line at y, curved bottom
function hull(ctx, cx, y, w, h, color, ink, lw) {
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, y);
  ctx.lineTo(cx + w / 2, y);
  ctx.quadraticCurveTo(cx + w / 2 - h * 0.5, y + h, cx, y + h);
  ctx.quadraticCurveTo(cx - w / 2 + h * 0.5, y + h, cx - w / 2, y);
  ctx.closePath();
  fillStroke(ctx, color, ink, lw);
}

// spoked cart / siege wheel
function wheel(ctx, cx, cy, r, t, lw) {
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  fillStroke(ctx, t.wood, t.ink, lw);
  ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.7;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r * 0.18, cy + Math.sin(a) * r * 0.18);
    ctx.lineTo(cx + Math.cos(a) * r * 0.92, cy + Math.sin(a) * r * 0.92);
    ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.18, 0, Math.PI * 2);
  fillStroke(ctx, t.woodDark, t.ink, lw * 0.7);
}

// ============================================================================
// CASTLES
// ============================================================================
family({
  id: 'medieval.castle.keep', name: 'Castle Keep', category: 'medieval',
  tags: ['castle', 'keep', 'fortress', 'stone', 'fort'], size: 88, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const body = tint || t.stone;
    groundShadow(ctx, 0, s * 0.40, s * 0.36, s * 0.09);
    const bw = s * 0.5, bh = s * 0.44, bx = -bw / 2, by = -s * 0.02;
    roundRect(ctx, bx, by, bw, bh, s * 0.02);
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(bx + bw * 0.62, by, bw * 0.38, bh);
    courses(ctx, bx, by, bw, bh, 6, withAlpha(t.stoneDark, 0.35), TLW(s));
    battlement(ctx, bx, by, bw, 6, s * 0.055, body, ink, lw * 0.85);
    const tw = s * 0.15, th = bh + s * 0.16, ty = by - s * 0.16;
    const txs = [bx - tw * 0.45, bx + bw - tw * 0.55];
    for (const tx of txs) {
      roundRect(ctx, tx, ty, tw, th, s * 0.02);
      fillStroke(ctx, body, ink, lw);
      ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(tx + tw * 0.6, ty, tw * 0.4, th);
      ctx.beginPath();
      ctx.moveTo(tx - tw * 0.08, ty); ctx.lineTo(tx + tw / 2, ty - s * 0.18); ctx.lineTo(tx + tw + tw * 0.08, ty); ctx.closePath();
      fillStroke(ctx, tint ? darken(body, 0.18) : t.roof, ink, lw * 0.8);
      ctx.fillStyle = darken(t.stone, 0.5); ctx.fillRect(tx + tw * 0.42, ty + th * 0.4, tw * 0.16, th * 0.18);
    }
    arch(ctx, 0, by + bh - s * 0.22, s * 0.16, s * 0.22);
    fillStroke(ctx, t.woodDark, ink, lw);
    ctx.strokeStyle = withAlpha(t.wood, 0.5); ctx.lineWidth = TLW(s);
    ctx.beginPath(); ctx.moveTo(0, by + bh - s * 0.22); ctx.lineTo(0, by + bh); ctx.stroke();
    ctx.fillStyle = darken(t.stone, 0.5);
    for (const wx of [-bw * 0.24, bw * 0.24]) { arch(ctx, wx, by + bh * 0.26, s * 0.07, s * 0.12); ctx.fill(); }
    const ftx = txs[0] + tw / 2;
    pole(ctx, ftx, ty - s * 0.18, ty - s * 0.32, t.woodDark, lw * 0.8);
    pennant(ctx, ftx, ty - s * 0.32, s * 0.14, s * 0.08, tint ? lighten(body, 0.25) : t.flag, ink, lw * 0.6, 1);
    ctx.fillStyle = withAlpha(t.stoneLight, 0.5); ctx.fillRect(bx + bw * 0.05, by + bh * 0.08, bw * 0.05, bh * 0.78);
  },
});

family({
  id: 'medieval.castle.concentric', name: 'Concentric Castle', category: 'medieval',
  tags: ['castle', 'fortress', 'curtain', 'walls', 'stone'], size: 96, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const body = tint || t.stone;
    groundShadow(ctx, 0, s * 0.42, s * 0.44, s * 0.1);
    const ow = s * 0.76, oh = s * 0.2, ox = -ow / 2, oy = s * 0.08;
    roundRect(ctx, ox, oy, ow, oh, s * 0.02);
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.35); ctx.fillRect(ox, oy + oh * 0.55, ow, oh * 0.45);
    battlement(ctx, ox, oy, ow, 9, s * 0.04, body, ink, lw * 0.7);
    arch(ctx, 0, oy + oh - s * 0.15, s * 0.12, s * 0.15);
    fillStroke(ctx, t.woodDark, ink, lw * 0.9);
    const dtw = s * 0.16;
    for (const tx of [ox - dtw * 0.2, ox + ow - dtw * 0.8]) {
      const tyy = oy - s * 0.12, thh = oh + s * 0.22;
      roundRect(ctx, tx, tyy, dtw, thh, dtw * 0.4);
      fillStroke(ctx, body, ink, lw);
      ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(tx + dtw * 0.6, tyy, dtw * 0.4, thh);
      ctx.beginPath();
      ctx.moveTo(tx - dtw * 0.06, tyy); ctx.lineTo(tx + dtw / 2, tyy - s * 0.16); ctx.lineTo(tx + dtw + dtw * 0.06, tyy); ctx.closePath();
      fillStroke(ctx, tint ? darken(body, 0.18) : t.roof, ink, lw * 0.8);
    }
    const kw = s * 0.28, kh = s * 0.34, kx = -kw / 2, ky = -s * 0.24;
    roundRect(ctx, kx, ky, kw, kh, s * 0.02);
    fillStroke(ctx, lighten(body, 0.05), ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(kx + kw * 0.62, ky, kw * 0.38, kh);
    battlement(ctx, kx, ky, kw, 4, s * 0.05, lighten(body, 0.05), ink, lw * 0.8);
    ctx.fillStyle = darken(t.stone, 0.5);
    for (const wx of [-kw * 0.22, kw * 0.22]) { arch(ctx, wx, ky + kh * 0.32, s * 0.06, s * 0.1); ctx.fill(); }
    pole(ctx, 0, ky, ky - s * 0.12, t.woodDark, lw * 0.8);
    pennant(ctx, 0, ky - s * 0.12, s * 0.13, s * 0.07, tint ? lighten(body, 0.3) : t.flag, ink, lw * 0.6, 1);
  },
});

family({
  id: 'medieval.castle.motte', name: 'Motte & Bailey', category: 'medieval',
  tags: ['castle', 'motte', 'bailey', 'mound', 'wood', 'palisade'], size: 88, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    groundShadow(ctx, 0, s * 0.42, s * 0.4, s * 0.09);
    const mTopW = s * 0.3, mBotW = s * 0.66, mTopY = -s * 0.04, mh = s * 0.36;
    ctx.beginPath();
    ctx.moveTo(-mBotW / 2, mTopY + mh); ctx.lineTo(-mTopW / 2, mTopY);
    ctx.lineTo(mTopW / 2, mTopY); ctx.lineTo(mBotW / 2, mTopY + mh); ctx.closePath();
    fillStroke(ctx, t.grass, ink, lw);
    ctx.fillStyle = withAlpha(t.grassDark, 0.5);
    ctx.beginPath();
    ctx.moveTo(mTopW * 0.1, mTopY); ctx.lineTo(mBotW / 2, mTopY + mh); ctx.lineTo(mBotW * 0.12, mTopY + mh); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = withAlpha(t.grassDark, 0.5); ctx.lineWidth = TLW(s);
    ctx.beginPath();
    ctx.moveTo(-mBotW * 0.34, mTopY + mh * 0.55); ctx.quadraticCurveTo(0, mTopY + mh * 0.72, mBotW * 0.34, mTopY + mh * 0.55); ctx.stroke();
    const kw = s * 0.22, kh = s * 0.26, kx = -kw / 2, ky = mTopY - kh;
    const wood = tint || t.wood;
    roundRect(ctx, kx, ky, kw, kh, s * 0.015);
    fillStroke(ctx, wood, ink, lw);
    planks(ctx, kx, ky, kw, kh, 4, withAlpha(t.woodDark, 0.55), TLW(s));
    ctx.fillStyle = withAlpha(t.woodDark, 0.4); ctx.fillRect(kx + kw * 0.64, ky, kw * 0.36, kh);
    battlement(ctx, kx, ky, kw, 3, s * 0.045, wood, ink, lw * 0.8);
    ctx.beginPath();
    ctx.moveTo(kx - kw * 0.08, ky - s * 0.045); ctx.lineTo(0, ky - s * 0.16); ctx.lineTo(kx + kw + kw * 0.08, ky - s * 0.045); ctx.closePath();
    fillStroke(ctx, t.roof, ink, lw * 0.8);
    ctx.fillStyle = t.woodDark; arch(ctx, 0, ky + kh - s * 0.12, s * 0.07, s * 0.12); ctx.fill();
    const py = mTopY + mh - s * 0.005;
    for (let i = -3; i <= 3; i++) {
      const px = i * s * 0.085, ph = s * 0.07;
      ctx.fillStyle = i % 2 ? t.woodDark : wood;
      ctx.beginPath();
      ctx.moveTo(px - s * 0.018, py); ctx.lineTo(px - s * 0.018, py - ph); ctx.lineTo(px, py - ph - s * 0.022);
      ctx.lineTo(px + s * 0.018, py - ph); ctx.lineTo(px + s * 0.018, py); ctx.closePath();
      fillStroke(ctx, ctx.fillStyle, ink, lw * 0.55);
    }
  },
});

family({
  id: 'medieval.castle.ruined', name: 'Ruined Castle', category: 'medieval',
  tags: ['castle', 'ruin', 'broken', 'stone', 'abandoned'], size: 88, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const body = tint || t.stoneDark;
    groundShadow(ctx, 0, s * 0.4, s * 0.36, s * 0.09);
    for (let i = 0; i < 7; i++) {
      const rx = jitter(rng, s * 0.34), ry = s * 0.33 + jitter(rng, s * 0.03), rr = rand(rng, s * 0.03, s * 0.06);
      blob(ctx, rx, ry, rr, rng, 0.4, 7);
      fillStroke(ctx, i % 2 ? darken(t.stone, 0.1) : t.stone, ink, lw * 0.6);
    }
    const wx = -s * 0.28, wtop = -s * 0.18, ww = s * 0.3, wbot = s * 0.32;
    ctx.beginPath();
    ctx.moveTo(wx, wbot); ctx.lineTo(wx, wtop + s * 0.05);
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const xx = wx + (ww * i) / steps, yy = wtop + jitter(rng, s * 0.04) + (i % 2 ? s * 0.04 : 0);
      ctx.lineTo(xx, yy);
    }
    ctx.lineTo(wx + ww, wbot); ctx.closePath();
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(wx + ww * 0.6, wtop, ww * 0.4, wbot - wtop);
    courses(ctx, wx, wtop + s * 0.06, ww, wbot - wtop - s * 0.06, 5, withAlpha(t.stoneDark, 0.4), TLW(s));
    ctx.fillStyle = t.paper; arch(ctx, wx + ww * 0.42, wtop + s * 0.12, s * 0.09, s * 0.14); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.8; ctx.stroke();
    const tx = s * 0.12, tw = s * 0.18, ttop = -s * 0.08, tbot = s * 0.32;
    ctx.beginPath();
    ctx.moveTo(tx, tbot); ctx.lineTo(tx, ttop + s * 0.06); ctx.lineTo(tx + tw * 0.5, ttop);
    ctx.lineTo(tx + tw, ttop + s * 0.14); ctx.lineTo(tx + tw, tbot); ctx.closePath();
    fillStroke(ctx, body, ink, lw);
    courses(ctx, tx, ttop + s * 0.06, tw, tbot - ttop - s * 0.06, 5, withAlpha(t.stoneDark, 0.4), TLW(s));
    ctx.strokeStyle = withAlpha(ink, 0.5); ctx.lineWidth = TLW(s);
    ctx.beginPath();
    ctx.moveTo(tx + tw * 0.5, ttop + s * 0.1); ctx.lineTo(tx + tw * 0.36, tbot * 0.6); ctx.lineTo(tx + tw * 0.5, tbot); ctx.stroke();
    ctx.strokeStyle = t.grassDark; ctx.lineWidth = lw * 0.6;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(wx + ww * 0.5 + i * s * 0.02, wtop + s * 0.03); ctx.lineTo(wx + ww * 0.5 + i * s * 0.03, wtop - s * 0.03); ctx.stroke();
    }
  },
});

// ============================================================================
// TOWERS
// ============================================================================
family({
  id: 'medieval.tower.round', name: 'Round Tower', category: 'medieval',
  tags: ['tower', 'keep', 'fort', 'stone', 'round'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, body = tint || t.stone, ink = t.ink, lw = LW(s);
    groundShadow(ctx, 0, s * 0.36, s * 0.24, s * 0.08);
    const w = s * 0.36, top = -s * 0.2, h = s * 0.52;
    roundRect(ctx, -w / 2, top, w, h, s * 0.05);
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.45); ctx.fillRect(w * 0.1, top, w * 0.4, h);
    courses(ctx, -w / 2, top, w, h, 7, withAlpha(t.stoneDark, 0.32), TLW(s));
    const roofed = chance(rng, 0.5);
    if (!roofed) {
      battlement(ctx, -w / 2, top, w, 4, s * 0.07, body, ink, lw * 0.9);
      ctx.fillStyle = withAlpha(t.stoneLight, 0.5); ctx.fillRect(-w / 2, top + s * 0.015, w, s * 0.02);
    }
    ctx.fillStyle = t.woodDark; arch(ctx, 0, top + h - s * 0.16, s * 0.12, s * 0.16); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.7; ctx.stroke();
    ctx.fillStyle = darken(t.stone, 0.5); arch(ctx, 0, top + h * 0.32, s * 0.07, s * 0.1); ctx.fill();
    if (roofed) {
      ctx.beginPath();
      ctx.moveTo(-w / 2 - s * 0.03, top); ctx.lineTo(0, top - s * 0.2); ctx.lineTo(w / 2 + s * 0.03, top); ctx.closePath();
      fillStroke(ctx, tint ? darken(body, 0.2) : t.roof, ink, lw * 0.9);
      pole(ctx, 0, top - s * 0.2, top - s * 0.3, t.woodDark, lw * 0.7);
      pennant(ctx, 0, top - s * 0.3, s * 0.12, s * 0.06, t.flag, ink, lw * 0.6, 1);
    }
    ctx.fillStyle = withAlpha(t.stoneLight, 0.5); ctx.fillRect(-w * 0.36, top + s * 0.05, w * 0.08, h * 0.78);
  },
});

family({
  id: 'medieval.tower.square', name: 'Square Tower', category: 'medieval',
  tags: ['tower', 'keep', 'fort', 'stone', 'square'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, body = tint || t.stone, ink = t.ink, lw = LW(s);
    groundShadow(ctx, 0, s * 0.36, s * 0.24, s * 0.08);
    const w = s * 0.4, top = -s * 0.22, h = s * 0.56;
    roundRect(ctx, -w / 2, top, w, h, s * 0.015);
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.42); ctx.fillRect(w * 0.12, top, w * 0.38, h);
    courses(ctx, -w / 2, top, w, h, 7, withAlpha(t.stoneDark, 0.3), TLW(s));
    battlement(ctx, -w / 2, top, w, 4, s * 0.06, body, ink, lw * 0.9);
    ctx.fillStyle = darken(t.stone, 0.5);
    for (const wy of [top + h * 0.3, top + h * 0.55]) for (const wx of [-w * 0.22, w * 0.22]) ctx.fillRect(wx - s * 0.012, wy, s * 0.024, s * 0.07);
    ctx.fillStyle = t.woodDark; roundRect(ctx, -w * 0.13, top + h - s * 0.16, w * 0.26, s * 0.16, s * 0.02); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.7; ctx.stroke();
    ctx.fillStyle = withAlpha(t.stoneLight, 0.5); ctx.fillRect(-w * 0.46, top + s * 0.05, w * 0.06, h * 0.82);
  },
});

family({
  id: 'medieval.tower.watch', name: 'Watchtower', category: 'medieval',
  tags: ['tower', 'watch', 'wood', 'lookout', 'scaffold'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, wood = tint || t.wood, ink = t.ink, lw = LW(s);
    groundShadow(ctx, 0, s * 0.4, s * 0.26, s * 0.07);
    const legTop = -s * 0.04, legBot = s * 0.36, spread = s * 0.2;
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.3; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-spread, legBot); ctx.lineTo(-s * 0.1, legTop);
    ctx.moveTo(spread, legBot); ctx.lineTo(s * 0.1, legTop);
    ctx.moveTo(-s * 0.13, legBot); ctx.lineTo(s * 0.08, legTop);
    ctx.moveTo(s * 0.13, legBot); ctx.lineTo(-s * 0.08, legTop);
    ctx.stroke();
    ctx.lineWidth = lw * 0.7;
    ctx.beginPath();
    ctx.moveTo(-spread * 0.62, legBot * 0.62); ctx.lineTo(spread * 0.62, legBot * 0.38);
    ctx.moveTo(spread * 0.62, legBot * 0.62); ctx.lineTo(-spread * 0.62, legBot * 0.38); ctx.stroke();
    roundRect(ctx, -s * 0.21, legTop - s * 0.03, s * 0.42, s * 0.05, s * 0.01);
    fillStroke(ctx, wood, ink, lw * 0.9);
    const cw = s * 0.3, ch = s * 0.17, cx = -cw / 2, cy = legTop - s * 0.03 - ch;
    roundRect(ctx, cx, cy, cw, ch, s * 0.01);
    fillStroke(ctx, wood, ink, lw);
    planks(ctx, cx, cy, cw, ch, 5, withAlpha(t.woodDark, 0.5), TLW(s));
    ctx.fillStyle = withAlpha(t.woodDark, 0.4); ctx.fillRect(cx + cw * 0.62, cy, cw * 0.38, ch);
    ctx.fillStyle = darken(t.wood, 0.5);
    ctx.fillRect(cx + cw * 0.16, cy + ch * 0.3, cw * 0.2, ch * 0.34);
    ctx.fillRect(cx + cw * 0.62, cy + ch * 0.3, cw * 0.2, ch * 0.34);
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.04, cy); ctx.lineTo(0, cy - s * 0.14); ctx.lineTo(cx + cw + s * 0.04, cy); ctx.closePath();
    fillStroke(ctx, tint ? darken(wood, 0.25) : t.roof, ink, lw * 0.9);
    pole(ctx, 0, cy - s * 0.14, cy - s * 0.24, t.woodDark, lw * 0.7);
    pennant(ctx, 0, cy - s * 0.24, s * 0.12, s * 0.06, t.flag, ink, lw * 0.6, 1);
  },
});

family({
  id: 'medieval.tower.bell', name: 'Bell Tower', category: 'medieval',
  tags: ['tower', 'bell', 'campanile', 'stone'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, body = tint || t.stone, ink = t.ink, lw = LW(s);
    groundShadow(ctx, 0, s * 0.38, s * 0.22, s * 0.07);
    const w = s * 0.34, top = -s * 0.26, h = s * 0.6;
    roundRect(ctx, -w / 2, top, w, h, s * 0.012);
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(w * 0.12, top, w * 0.38, h);
    courses(ctx, -w / 2, top, w, h, 8, withAlpha(t.stoneDark, 0.3), TLW(s));
    ctx.fillStyle = darken(t.stone, 0.55); arch(ctx, 0, top + s * 0.04, w * 0.5, s * 0.22); ctx.fill();
    const by = top + s * 0.14;
    ctx.beginPath();
    ctx.moveTo(-s * 0.05, by); ctx.quadraticCurveTo(-s * 0.062, by + s * 0.1, -s * 0.07, by + s * 0.12);
    ctx.lineTo(s * 0.07, by + s * 0.12); ctx.quadraticCurveTo(s * 0.062, by + s * 0.1, s * 0.05, by);
    ctx.quadraticCurveTo(0, by - s * 0.02, -s * 0.05, by); ctx.closePath();
    fillStroke(ctx, t.gold, ink, lw * 0.7);
    ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(0, by + s * 0.14, lw * 0.8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-w / 2 - s * 0.02, top); ctx.lineTo(0, top - s * 0.2); ctx.lineTo(w / 2 + s * 0.02, top); ctx.closePath();
    fillStroke(ctx, tint ? darken(body, 0.2) : t.roof, ink, lw);
    ctx.fillStyle = darken(t.stone, 0.5); arch(ctx, 0, top + h * 0.56, s * 0.08, s * 0.12); ctx.fill();
    ctx.fillStyle = t.woodDark; arch(ctx, 0, top + h - s * 0.14, s * 0.1, s * 0.14); ctx.fill();
  },
});

family({
  id: 'medieval.tower.wizard', name: 'Wizard Tower', category: 'medieval',
  tags: ['tower', 'wizard', 'mage', 'magic', 'spire'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, body = tint || t.stone, ink = t.ink, lw = LW(s);
    groundShadow(ctx, 0, s * 0.38, s * 0.22, s * 0.07);
    const lean = jitter(rng, s * 0.05);
    const baseW = s * 0.3, topW = s * 0.18, bottom = s * 0.34, topY = -s * 0.16;
    ctx.beginPath();
    ctx.moveTo(-baseW / 2, bottom); ctx.lineTo(-topW / 2 + lean, topY);
    ctx.lineTo(topW / 2 + lean, topY); ctx.lineTo(baseW / 2, bottom); ctx.closePath();
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4);
    ctx.beginPath();
    ctx.moveTo(topW * 0.1 + lean, topY); ctx.lineTo(topW / 2 + lean, topY); ctx.lineTo(baseW / 2, bottom); ctx.lineTo(baseW * 0.15, bottom); ctx.closePath(); ctx.fill();
    courses(ctx, -baseW / 2, topY, baseW, bottom - topY, 7, withAlpha(t.stoneDark, 0.3), TLW(s));
    const hatBaseY = topY, hatTipY = topY - s * 0.27, hatTipX = lean * 1.6;
    ctx.beginPath();
    ctx.moveTo(-topW / 2 - s * 0.03 + lean, hatBaseY);
    ctx.quadraticCurveTo(hatTipX - s * 0.03, hatBaseY - s * 0.13, hatTipX, hatTipY);
    ctx.quadraticCurveTo(hatTipX + s * 0.03, hatBaseY - s * 0.13, topW / 2 + s * 0.03 + lean, hatBaseY); ctx.closePath();
    fillStroke(ctx, tint ? darken(body, 0.25) : t.accent, ink, lw);
    ctx.fillStyle = t.gold; star(ctx, hatTipX, hatTipY, 5, s * 0.04, s * 0.018); fillStroke(ctx, t.gold, ink, lw * 0.6);
    softShadow(ctx, withAlpha(t.gold, 0.9), s * 0.12, 0, 0);
    ctx.fillStyle = t.gold; ctx.beginPath(); ctx.arc(lean * 0.6, s * 0.02, s * 0.05, 0, Math.PI * 2); ctx.fill();
    clearShadow(ctx);
    ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.7; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lean * 0.6 - s * 0.05, s * 0.02); ctx.lineTo(lean * 0.6 + s * 0.05, s * 0.02);
    ctx.moveTo(lean * 0.6, s * 0.02 - s * 0.05); ctx.lineTo(lean * 0.6, s * 0.02 + s * 0.05); ctx.stroke();
    ctx.fillStyle = withAlpha(t.gold, 0.8);
    for (let i = 0; i < 3; i++) { const sx = jitter(rng, s * 0.3), sy = topY - rand(rng, 0, s * 0.2); star(ctx, sx, sy, 4, s * 0.02, s * 0.008); ctx.fill(); }
    ctx.fillStyle = t.woodDark; arch(ctx, 0, bottom - s * 0.14, s * 0.09, s * 0.14); ctx.fill();
  },
});

family({
  id: 'medieval.tower.lighthouse', name: 'Lighthouse', category: 'medieval',
  tags: ['lighthouse', 'tower', 'coast', 'beacon', 'light'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, body = tint || t.white, ink = t.ink, lw = LW(s);
    groundShadow(ctx, 0, s * 0.4, s * 0.24, s * 0.07);
    const baseW = s * 0.3, topW = s * 0.16, bottom = s * 0.38, topY = -s * 0.12;
    ctx.beginPath();
    ctx.moveTo(-baseW / 2, bottom); ctx.lineTo(-topW / 2, topY);
    ctx.lineTo(topW / 2, topY); ctx.lineTo(baseW / 2, bottom); ctx.closePath();
    fillStroke(ctx, body, ink, lw);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-baseW / 2, bottom); ctx.lineTo(-topW / 2, topY);
    ctx.lineTo(topW / 2, topY); ctx.lineTo(baseW / 2, bottom); ctx.closePath(); ctx.clip();
    ctx.fillStyle = tint ? darken(body, 0.2) : t.danger;
    for (let i = 0; i < 3; i++) { const yy = topY + (bottom - topY) * ((i * 2 + 1) / 6); ctx.fillRect(-baseW, yy, baseW * 2, (bottom - topY) / 6); }
    ctx.fillStyle = withAlpha(ink, 0.12); ctx.fillRect(topW * 0.12, topY, baseW * 0.32, bottom - topY);
    ctx.restore();
    ctx.fillStyle = t.metalDark; roundRect(ctx, -topW / 2 - s * 0.03, topY - s * 0.03, topW + s * 0.06, s * 0.04, s * 0.005); ctx.fill();
    const lwd = topW * 0.85;
    roundRect(ctx, -lwd / 2, topY - s * 0.16, lwd, s * 0.13, s * 0.01);
    fillStroke(ctx, t.metal, ink, lw * 0.8);
    softShadow(ctx, withAlpha(t.gold, 0.9), s * 0.16, 0, 0);
    ctx.fillStyle = t.gold; ctx.fillRect(-lwd / 2 + s * 0.012, topY - s * 0.14, lwd - s * 0.024, s * 0.09);
    clearShadow(ctx);
    ctx.fillStyle = withAlpha(t.gold, 0.16);
    ctx.beginPath(); ctx.moveTo(0, topY - s * 0.095); ctx.lineTo(-s * 0.42, topY - s * 0.22); ctx.lineTo(-s * 0.42, topY + s * 0.02); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, topY - s * 0.095); ctx.lineTo(s * 0.42, topY - s * 0.22); ctx.lineTo(s * 0.42, topY + s * 0.02); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-lwd / 2 - s * 0.01, topY - s * 0.16); ctx.quadraticCurveTo(0, topY - s * 0.3, lwd / 2 + s * 0.01, topY - s * 0.16); ctx.closePath();
    fillStroke(ctx, tint ? darken(body, 0.3) : t.roof, ink, lw * 0.8);
    ctx.fillStyle = t.woodDark; arch(ctx, 0, bottom - s * 0.12, s * 0.08, s * 0.12); ctx.fill();
  },
});

// ============================================================================
// WALLS & GATES
// ============================================================================
family({
  id: 'medieval.wall.segment', name: 'City Wall', category: 'medieval',
  tags: ['wall', 'rampart', 'battlement', 'stone', 'fortification'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, body = tint || t.stone, ink = t.ink, lw = LW(s);
    groundShadow(ctx, 0, s * 0.3, s * 0.42, s * 0.07);
    const ww = s * 0.84, wh = s * 0.32, wx = -ww / 2, wy = -s * 0.06;
    roundRect(ctx, wx, wy, ww, wh, s * 0.01);
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.35); ctx.fillRect(wx, wy + wh * 0.62, ww, wh * 0.38);
    courses(ctx, wx, wy, ww, wh, 4, withAlpha(t.stoneDark, 0.32), TLW(s));
    ctx.strokeStyle = withAlpha(t.stoneDark, 0.28); ctx.lineWidth = TLW(s);
    for (let r = 0; r < 4; r++) {
      const yy = wy + (wh / 4) * r, off = r % 2 ? ww / 8 : 0;
      for (let x = wx + off; x < wx + ww; x += ww / 4) {
        ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x, yy + wh / 4); ctx.stroke();
      }
    }
    battlement(ctx, wx, wy, ww, 8, s * 0.05, body, ink, lw * 0.8);
    ctx.fillStyle = darken(t.stone, 0.5);
    for (const ax of [-ww * 0.28, 0, ww * 0.28]) ctx.fillRect(ax - s * 0.012, wy + wh * 0.35, s * 0.024, s * 0.1);
    ctx.fillStyle = withAlpha(t.stoneLight, 0.45); ctx.fillRect(wx, wy + s * 0.01, ww, s * 0.015);
  },
});

family({
  id: 'medieval.wall.gatehouse', name: 'Gatehouse', category: 'medieval',
  tags: ['gate', 'gatehouse', 'wall', 'entrance', 'towers'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, body = tint || t.stone, ink = t.ink, lw = LW(s);
    groundShadow(ctx, 0, s * 0.38, s * 0.4, s * 0.08);
    const tw = s * 0.2, th = s * 0.54, ty = -s * 0.22;
    for (const tx of [-s * 0.36, s * 0.16]) {
      roundRect(ctx, tx, ty, tw, th, s * 0.015);
      fillStroke(ctx, body, ink, lw);
      ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(tx + tw * 0.62, ty, tw * 0.38, th);
      courses(ctx, tx, ty, tw, th, 6, withAlpha(t.stoneDark, 0.3), TLW(s));
      battlement(ctx, tx, ty, tw, 3, s * 0.05, body, ink, lw * 0.8);
      ctx.fillStyle = darken(t.stone, 0.5); ctx.fillRect(tx + tw * 0.42, ty + th * 0.3, tw * 0.16, s * 0.08);
    }
    const gw = s * 0.32, gx = -gw / 2, gy = -s * 0.02, gh = s * 0.34;
    roundRect(ctx, gx, gy, gw, gh, s * 0.01);
    fillStroke(ctx, lighten(body, 0.04), ink, lw);
    battlement(ctx, gx, gy, gw, 4, s * 0.045, lighten(body, 0.04), ink, lw * 0.8);
    arch(ctx, 0, gy + gh - s * 0.26, s * 0.2, s * 0.26);
    fillStroke(ctx, darken(t.stone, 0.55), ink, lw);
    ctx.strokeStyle = withAlpha(t.metal, 0.8); ctx.lineWidth = TLW(s) * 1.4;
    arch(ctx, 0, gy + gh - s * 0.24, s * 0.17, s * 0.22);
    ctx.save(); ctx.clip();
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * s * 0.026, gy + gh - s * 0.26); ctx.lineTo(i * s * 0.026, gy + gh); ctx.stroke(); }
    for (let j = 0; j < 4; j++) { const yy = gy + gh - s * 0.24 + j * s * 0.06; ctx.beginPath(); ctx.moveTo(-s * 0.1, yy); ctx.lineTo(s * 0.1, yy); ctx.stroke(); }
    ctx.restore();
    pole(ctx, -s * 0.26, ty, ty - s * 0.12, t.woodDark, lw * 0.7);
    pennant(ctx, -s * 0.26, ty - s * 0.12, s * 0.12, s * 0.06, t.flag, ink, lw * 0.6, 1);
    pole(ctx, s * 0.26, ty, ty - s * 0.12, t.woodDark, lw * 0.7);
    pennant(ctx, s * 0.26, ty - s * 0.12, s * 0.12, s * 0.06, t.flag, ink, lw * 0.6, 1);
  },
});

family({
  id: 'medieval.wall.portcullis', name: 'Portcullis', category: 'medieval',
  tags: ['portcullis', 'gate', 'grille', 'iron', 'arch'], size: 56, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, body = t.stone, ink = t.ink, lw = LW(s);
    groundShadow(ctx, 0, s * 0.36, s * 0.3, s * 0.07);
    const ww = s * 0.56, wh = s * 0.62, wx = -ww / 2, wy = -s * 0.3;
    roundRect(ctx, wx, wy, ww, wh, s * 0.015);
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.38); ctx.fillRect(wx + ww * 0.66, wy, ww * 0.34, wh);
    courses(ctx, wx, wy, ww, wh, 7, withAlpha(t.stoneDark, 0.3), TLW(s));
    arch(ctx, 0, wy + s * 0.1, s * 0.36, s * 0.46);
    fillStroke(ctx, darken(t.stone, 0.6), ink, lw);
    const grid = tint || t.metal, raise = rand(rng, s * 0.04, s * 0.16);
    arch(ctx, 0, wy + s * 0.1, s * 0.36, s * 0.46);
    ctx.save(); ctx.clip();
    ctx.strokeStyle = grid; ctx.lineWidth = lw * 1.1; ctx.lineCap = 'round';
    const gridTop = wy + s * 0.1 + raise, gridBot = wy + s * 0.1 + s * 0.46;
    for (let i = -3; i <= 3; i++) {
      const gx = i * s * 0.05;
      ctx.beginPath(); ctx.moveTo(gx, gridTop); ctx.lineTo(gx, gridBot); ctx.stroke();
    }
    for (let j = 0; j < 5; j++) {
      const yy = gridTop + j * s * 0.06;
      ctx.beginPath(); ctx.moveTo(-s * 0.16, yy); ctx.lineTo(s * 0.16, yy); ctx.stroke();
    }
    ctx.fillStyle = grid;
    for (let i = -3; i <= 3; i++) { const gx = i * s * 0.05; ctx.beginPath(); ctx.moveTo(gx - s * 0.018, gridBot); ctx.lineTo(gx + s * 0.018, gridBot); ctx.lineTo(gx, gridBot + s * 0.03); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    ctx.strokeStyle = darken(grid, 0.3); ctx.lineWidth = TLW(s);
    ctx.beginPath(); ctx.moveTo(-s * 0.16, gridTop); ctx.lineTo(s * 0.16, gridTop); ctx.stroke();
  },
});

family({
  id: 'medieval.wall.palisade', name: 'Palisade', category: 'medieval',
  tags: ['palisade', 'fence', 'stockade', 'wood', 'stakes'], size: 64, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, wood = tint || t.wood, ink = t.ink, lw = LW(s);
    groundShadow(ctx, 0, s * 0.32, s * 0.42, s * 0.06);
    const baseY = s * 0.3, n = 9, span = s * 0.84, x0 = -span / 2, step = span / (n - 1);
    for (let i = 0; i < n; i++) {
      const px = x0 + i * step, ph = rand(rng, s * 0.42, s * 0.5), pw = step * 0.82;
      const topY = baseY - ph;
      ctx.beginPath();
      ctx.moveTo(px - pw / 2, baseY); ctx.lineTo(px - pw / 2, topY + pw * 0.5);
      ctx.lineTo(px, topY); ctx.lineTo(px + pw / 2, topY + pw * 0.5); ctx.lineTo(px + pw / 2, baseY); ctx.closePath();
      fillStroke(ctx, i % 2 ? darken(wood, 0.12) : wood, ink, lw * 0.8);
      ctx.strokeStyle = withAlpha(t.woodDark, 0.5); ctx.lineWidth = TLW(s);
      ctx.beginPath(); ctx.moveTo(px, topY + pw * 0.6); ctx.lineTo(px, baseY - s * 0.02); ctx.stroke();
    }
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.2; ctx.lineCap = 'round';
    for (const yy of [baseY - s * 0.12, baseY - s * 0.32]) { ctx.beginPath(); ctx.moveTo(x0 - s * 0.01, yy); ctx.lineTo(x0 + span + s * 0.01, yy + jitter(rng, s * 0.01)); ctx.stroke(); }
  },
});

// ============================================================================
// DWELLINGS
// ============================================================================
family({
  id: 'medieval.dwelling.cottage_thatch', name: 'Thatched Cottage', category: 'medieval',
  tags: ['cottage', 'house', 'thatch', 'village', 'home'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wall = t.cloth, thatch = tint || mix(t.sand, t.woodDark, 0.25);
    groundShadow(ctx, 0, s * 0.34, s * 0.32, s * 0.07);
    const bw = s * 0.5, bh = s * 0.26, bx = -bw / 2, by = s * 0.02;
    roundRect(ctx, bx, by, bw, bh, s * 0.01);
    fillStroke(ctx, wall, ink, lw);
    ctx.fillStyle = withAlpha(t.woodDark, 0.18); ctx.fillRect(bx + bw * 0.66, by, bw * 0.34, bh);
    ctx.beginPath();
    ctx.moveTo(bx - s * 0.06, by + s * 0.02);
    ctx.quadraticCurveTo(-s * 0.02, by - s * 0.24, 0, by - s * 0.24);
    ctx.quadraticCurveTo(s * 0.02, by - s * 0.24, bx + bw + s * 0.06, by + s * 0.02);
    ctx.quadraticCurveTo(bx + bw, by + s * 0.05, bx + bw - s * 0.02, by + s * 0.04);
    ctx.lineTo(bx + s * 0.02, by + s * 0.04);
    ctx.quadraticCurveTo(bx, by + s * 0.05, bx - s * 0.06, by + s * 0.02);
    ctx.closePath();
    fillStroke(ctx, thatch, ink, lw);
    ctx.strokeStyle = withAlpha(t.woodDark, 0.4); ctx.lineWidth = TLW(s);
    for (let i = 0; i < 5; i++) {
      const fx = bx + s * 0.06 + i * (bw - s * 0.12) / 4;
      ctx.beginPath(); ctx.moveTo(fx, by - s * 0.02); ctx.lineTo(fx + (fx < 0 ? -s * 0.04 : s * 0.04), by - s * 0.18); ctx.stroke();
    }
    ctx.fillStyle = t.woodDark; roundRect(ctx, -s * 0.06, by + bh - s * 0.16, s * 0.12, s * 0.16, s * 0.02); ctx.fill();
    ctx.fillStyle = t.glass; ctx.fillRect(bx + bw * 0.14, by + bh * 0.3, s * 0.08, s * 0.08);
    ctx.strokeStyle = ink; ctx.lineWidth = TLW(s); ctx.strokeRect(bx + bw * 0.14, by + bh * 0.3, s * 0.08, s * 0.08);
  },
});

family({
  id: 'medieval.dwelling.cottage_timber', name: 'Timber-framed House', category: 'medieval',
  tags: ['cottage', 'house', 'tudor', 'timber', 'village'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wall = t.white, beam = t.woodDark, roof = tint || t.roof;
    groundShadow(ctx, 0, s * 0.34, s * 0.3, s * 0.07);
    const bw = s * 0.46, bh = s * 0.3, bx = -bw / 2, by = s * 0.0;
    roundRect(ctx, bx, by, bw, bh, s * 0.008);
    fillStroke(ctx, wall, ink, lw);
    ctx.strokeStyle = beam; ctx.lineWidth = lw * 0.9; ctx.lineJoin = 'round';
    ctx.strokeRect(bx + lw, by + lw, bw - lw * 2, bh - lw * 2);
    ctx.beginPath();
    ctx.moveTo(bx + lw, by + bh / 2); ctx.lineTo(bx + bw - lw, by + bh / 2);
    ctx.moveTo(bx + bw * 0.34, by + lw); ctx.lineTo(bx + bw * 0.34, by + bh - lw);
    ctx.moveTo(bx + bw * 0.66, by + lw); ctx.lineTo(bx + bw * 0.66, by + bh - lw);
    ctx.moveTo(bx + lw, by + lw); ctx.lineTo(bx + bw * 0.34, by + bh / 2);
    ctx.moveTo(bx + bw - lw, by + lw); ctx.lineTo(bx + bw * 0.66, by + bh / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx - s * 0.05, by); ctx.lineTo(0, by - s * 0.2); ctx.lineTo(bx + bw + s * 0.05, by); ctx.closePath();
    fillStroke(ctx, roof, ink, lw);
    ctx.fillStyle = withAlpha(t.roofDark, 0.4);
    ctx.beginPath(); ctx.moveTo(0, by - s * 0.2); ctx.lineTo(bx + bw + s * 0.05, by); ctx.lineTo(bx + bw * 0.5, by); ctx.closePath(); ctx.fill();
    ctx.fillStyle = t.woodDark; roundRect(ctx, -s * 0.05, by + bh - s * 0.14, s * 0.1, s * 0.14, s * 0.01); ctx.fill();
    ctx.fillStyle = withAlpha(t.stoneDark, 0.6); ctx.fillRect(bx + bw * 0.74, by - s * 0.14, s * 0.05, s * 0.16);
  },
});

family({
  id: 'medieval.dwelling.longhouse', name: 'Longhouse', category: 'medieval',
  tags: ['longhouse', 'hall', 'viking', 'thatch', 'long'], size: 64, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wall = mix(t.wood, t.cloth, 0.4), thatch = tint || mix(t.sand, t.woodDark, 0.3);
    groundShadow(ctx, 0, s * 0.32, s * 0.44, s * 0.07);
    const bw = s * 0.78, bh = s * 0.22, bx = -bw / 2, by = s * 0.06;
    roundRect(ctx, bx, by, bw, bh, s * 0.01);
    fillStroke(ctx, wall, ink, lw);
    ctx.fillStyle = withAlpha(t.woodDark, 0.3); ctx.fillRect(bx, by + bh * 0.6, bw, bh * 0.4);
    planks(ctx, bx, by, bw, bh, 10, withAlpha(t.woodDark, 0.4), TLW(s));
    ctx.beginPath();
    ctx.moveTo(bx - s * 0.04, by + s * 0.02);
    ctx.quadraticCurveTo(bx + bw * 0.18, by - s * 0.2, bx + bw * 0.4, by - s * 0.21);
    ctx.lineTo(bx + bw * 0.6, by - s * 0.21);
    ctx.quadraticCurveTo(bx + bw * 0.82, by - s * 0.2, bx + bw + s * 0.04, by + s * 0.02);
    ctx.closePath();
    fillStroke(ctx, thatch, ink, lw);
    ctx.strokeStyle = withAlpha(t.woodDark, 0.4); ctx.lineWidth = TLW(s);
    ctx.beginPath();
    ctx.moveTo(bx + bw * 0.4, by - s * 0.18); ctx.lineTo(bx + bw * 0.4, by);
    ctx.moveTo(bx + bw * 0.6, by - s * 0.18); ctx.lineTo(bx + bw * 0.6, by); ctx.stroke();
    ctx.fillStyle = t.woodDark; arch(ctx, 0, by + bh - s * 0.14, s * 0.1, s * 0.14); ctx.fill();
    ctx.fillStyle = darken(t.wood, 0.4);
    for (const wx of [-bw * 0.3, bw * 0.3]) ctx.fillRect(wx - s * 0.03, by + bh * 0.3, s * 0.06, s * 0.06);
  },
});

family({
  id: 'medieval.dwelling.manor', name: 'Manor House', category: 'medieval',
  tags: ['manor', 'house', 'estate', 'noble', 'gables'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wall = t.cloth, roof = tint || t.roof;
    groundShadow(ctx, 0, s * 0.36, s * 0.4, s * 0.08);
    const bw = s * 0.6, bh = s * 0.34, bx = -bw / 2, by = s * 0.0;
    roundRect(ctx, bx, by, bw, bh, s * 0.01);
    fillStroke(ctx, wall, ink, lw);
    ctx.fillStyle = withAlpha(t.woodDark, 0.18); ctx.fillRect(bx + bw * 0.7, by, bw * 0.3, bh);
    courses(ctx, bx, by, bw, bh, 5, withAlpha(t.woodDark, 0.12), TLW(s));
    ctx.beginPath();
    ctx.moveTo(bx - s * 0.04, by); ctx.lineTo(bx + bw * 0.5, by - s * 0.16); ctx.lineTo(bx + bw + s * 0.04, by); ctx.closePath();
    fillStroke(ctx, roof, ink, lw);
    for (const gx of [bx + bw * 0.22, bx + bw * 0.78]) {
      const gw = bw * 0.26;
      ctx.beginPath();
      ctx.moveTo(gx - gw / 2 - s * 0.02, by - s * 0.04); ctx.lineTo(gx, by - s * 0.26); ctx.lineTo(gx + gw / 2 + s * 0.02, by - s * 0.04); ctx.closePath();
      fillStroke(ctx, roof, ink, lw);
      ctx.fillStyle = withAlpha(t.roofDark, 0.4);
      ctx.beginPath(); ctx.moveTo(gx, by - s * 0.26); ctx.lineTo(gx + gw / 2 + s * 0.02, by - s * 0.04); ctx.lineTo(gx, by - s * 0.04); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t.glass; ctx.fillRect(gx - s * 0.035, by - s * 0.13, s * 0.07, s * 0.09);
      ctx.strokeStyle = ink; ctx.lineWidth = TLW(s); ctx.strokeRect(gx - s * 0.035, by - s * 0.13, s * 0.07, s * 0.09);
    }
    ctx.fillStyle = withAlpha(t.stoneDark, 0.7);
    ctx.fillRect(bx + bw * 0.46, by - s * 0.28, s * 0.05, s * 0.12);
    ctx.fillRect(bx + bw * 0.54, by - s * 0.28, s * 0.05, s * 0.12);
    ctx.fillStyle = t.woodDark; arch(ctx, 0, by + bh - s * 0.16, s * 0.12, s * 0.16); ctx.fill();
    ctx.fillStyle = t.glass;
    for (const wx of [-bw * 0.28, bw * 0.28]) { ctx.fillRect(wx - s * 0.04, by + bh * 0.34, s * 0.08, s * 0.1); ctx.strokeStyle = ink; ctx.lineWidth = TLW(s); ctx.strokeRect(wx - s * 0.04, by + bh * 0.34, s * 0.08, s * 0.1); }
  },
});

family({
  id: 'medieval.dwelling.farmhouse', name: 'Farmhouse', category: 'medieval',
  tags: ['farmhouse', 'house', 'farm', 'rural', 'cottage'], size: 64, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wall = t.cloth, roof = tint || t.roofDark;
    groundShadow(ctx, 0, s * 0.36, s * 0.42, s * 0.07);
    const aw = s * 0.34, ah = s * 0.2, ax = s * 0.04, ay = s * 0.08;
    roundRect(ctx, ax, ay, aw, ah, s * 0.01);
    fillStroke(ctx, mix(wall, t.woodDark, 0.18), ink, lw * 0.9);
    ctx.beginPath();
    ctx.moveTo(ax - s * 0.03, ay); ctx.lineTo(ax + aw * 0.5, ay - s * 0.1); ctx.lineTo(ax + aw + s * 0.03, ay); ctx.closePath();
    fillStroke(ctx, darken(roof, 0.1), ink, lw * 0.9);
    const bw = s * 0.44, bh = s * 0.3, bx = -s * 0.42, by = -s * 0.02;
    roundRect(ctx, bx, by, bw, bh, s * 0.01);
    fillStroke(ctx, wall, ink, lw);
    ctx.fillStyle = withAlpha(t.woodDark, 0.18); ctx.fillRect(bx + bw * 0.68, by, bw * 0.32, bh);
    ctx.beginPath();
    ctx.moveTo(bx - s * 0.04, by); ctx.lineTo(bx + bw * 0.5, by - s * 0.18); ctx.lineTo(bx + bw + s * 0.04, by); ctx.closePath();
    fillStroke(ctx, roof, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.7); ctx.fillRect(bx + bw * 0.28, by - s * 0.26, s * 0.05, s * 0.12);
    ctx.fillStyle = t.woodDark; roundRect(ctx, bx + bw * 0.4, by + bh - s * 0.14, s * 0.11, s * 0.14, s * 0.01); ctx.fill();
    ctx.fillStyle = t.glass; ctx.fillRect(bx + bw * 0.16, by + bh * 0.34, s * 0.07, s * 0.08);
    ctx.fillStyle = darken(t.wood, 0.4); ctx.fillRect(ax + aw * 0.3, ay + ah * 0.3, aw * 0.4, ah * 0.5);
  },
});

// ============================================================================
// VILLAGE
// ============================================================================
family({
  id: 'medieval.village.cluster', name: 'Village Cluster', category: 'medieval',
  tags: ['village', 'hamlet', 'houses', 'settlement', 'cluster'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s) * 0.85;
    groundShadow(ctx, 0, s * 0.36, s * 0.44, s * 0.08);
    const roofs = [tint || t.roof, t.roofDark, mix(t.sand, t.woodDark, 0.3), t.roof];
    const houses = [
      { x: -s * 0.26, y: s * 0.08, w: s * 0.26, h: s * 0.18, r: 0 },
      { x: s * 0.02, y: s * 0.1, w: s * 0.24, h: s * 0.16, r: 1 },
      { x: -s * 0.08, y: -s * 0.08, w: s * 0.3, h: s * 0.2, r: 2 },
      { x: s * 0.18, y: -s * 0.04, w: s * 0.2, h: s * 0.16, r: 3 },
    ];
    houses.sort((a, b) => a.y - b.y);
    for (const hsObj of houses) {
      const { x, y, w, h, r } = hsObj;
      roundRect(ctx, x - w / 2, y, w, h, s * 0.008);
      fillStroke(ctx, t.cloth, ink, lw);
      ctx.fillStyle = withAlpha(t.woodDark, 0.16); ctx.fillRect(x + w * 0.16, y, w * 0.34, h);
      ctx.beginPath();
      ctx.moveTo(x - w / 2 - s * 0.03, y); ctx.lineTo(x, y - h * 0.7); ctx.lineTo(x + w / 2 + s * 0.03, y); ctx.closePath();
      fillStroke(ctx, roofs[r % roofs.length], ink, lw);
      ctx.fillStyle = withAlpha(t.roofDark, 0.35);
      ctx.beginPath(); ctx.moveTo(x, y - h * 0.7); ctx.lineTo(x + w / 2 + s * 0.03, y); ctx.lineTo(x, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t.woodDark; ctx.fillRect(x - w * 0.08, y + h - s * 0.08, w * 0.16, s * 0.08);
    }
    pole(ctx, -s * 0.3, -s * 0.06, -s * 0.22, t.woodDark, lw * 0.7);
    pennant(ctx, -s * 0.3, -s * 0.22, s * 0.1, s * 0.05, t.flag, ink, lw * 0.5, 1);
  },
});

// ============================================================================
// RELIGIOUS
// ============================================================================
family({
  id: 'medieval.religious.church', name: 'Church', category: 'medieval',
  tags: ['church', 'chapel', 'religion', 'steeple', 'cross'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const body = tint || t.stone;
    groundShadow(ctx, 0, s * 0.38, s * 0.4, s * 0.08);
    const nw = s * 0.42, nh = s * 0.3, nx = -s * 0.04, ny = s * 0.0;
    roundRect(ctx, nx, ny, nw, nh, s * 0.01);
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.38); ctx.fillRect(nx + nw * 0.7, ny, nw * 0.3, nh);
    ctx.beginPath();
    ctx.moveTo(nx - s * 0.03, ny); ctx.lineTo(nx + nw * 0.5, ny - s * 0.16); ctx.lineTo(nx + nw + s * 0.03, ny); ctx.closePath();
    fillStroke(ctx, tint ? darken(body, 0.2) : t.roof, ink, lw);
    ctx.fillStyle = t.glass;
    for (const wx of [nx + nw * 0.32, nx + nw * 0.62]) { arch(ctx, wx, ny + nh * 0.28, s * 0.07, s * 0.14); ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = TLW(s); ctx.stroke(); }
    ctx.fillStyle = t.woodDark; arch(ctx, nx + nw * 0.46, ny + nh - s * 0.16, s * 0.1, s * 0.16); ctx.fill();
    const bw = s * 0.18, bh = s * 0.46, bx = -s * 0.42, by = -s * 0.14;
    roundRect(ctx, bx, by, bw, bh, s * 0.01);
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.38); ctx.fillRect(bx + bw * 0.66, by, bw * 0.34, bh);
    ctx.fillStyle = darken(t.stone, 0.5); arch(ctx, bx + bw * 0.5, by + s * 0.06, s * 0.07, s * 0.1); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(bx - s * 0.02, by); ctx.lineTo(bx + bw * 0.5, by - s * 0.22); ctx.lineTo(bx + bw + s * 0.02, by); ctx.closePath();
    fillStroke(ctx, tint ? darken(body, 0.3) : t.roofDark, ink, lw * 0.9);
    ctx.strokeStyle = t.gold; ctx.lineWidth = lw; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(bx + bw * 0.5, by - s * 0.22); ctx.lineTo(bx + bw * 0.5, by - s * 0.34);
    ctx.moveTo(bx + bw * 0.5 - s * 0.03, by - s * 0.3); ctx.lineTo(bx + bw * 0.5 + s * 0.03, by - s * 0.3); ctx.stroke();
  },
});

family({
  id: 'medieval.religious.cathedral', name: 'Cathedral', category: 'medieval',
  tags: ['cathedral', 'minster', 'religion', 'spires', 'rose'], size: 92, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const body = tint || t.stone;
    groundShadow(ctx, 0, s * 0.42, s * 0.4, s * 0.09);
    const nw = s * 0.34, nh = s * 0.36, nx = -nw / 2, ny = -s * 0.04;
    roundRect(ctx, nx, ny, nw, nh, s * 0.01);
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(nx + nw * 0.68, ny, nw * 0.32, nh);
    ctx.beginPath();
    ctx.moveTo(nx - s * 0.02, ny); ctx.lineTo(0, ny - s * 0.16); ctx.lineTo(nx + nw + s * 0.02, ny); ctx.closePath();
    fillStroke(ctx, tint ? darken(body, 0.2) : t.roof, ink, lw);
    ctx.beginPath();
    ctx.moveTo(-s * 0.03, ny - s * 0.1); ctx.lineTo(0, ny - s * 0.32); ctx.lineTo(s * 0.03, ny - s * 0.1); ctx.closePath();
    fillStroke(ctx, tint ? darken(body, 0.28) : t.roofDark, ink, lw * 0.8);
    ctx.fillStyle = t.gold; ctx.beginPath(); ctx.arc(0, ny - s * 0.32, lw, 0, Math.PI * 2); ctx.fill();
    const tw = s * 0.16, th = nh + s * 0.18, ty = ny - s * 0.18;
    for (const tx of [nx - tw + s * 0.02, nx + nw - s * 0.02]) {
      roundRect(ctx, tx, ty, tw, th, s * 0.01);
      fillStroke(ctx, body, ink, lw);
      ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(tx + tw * 0.66, ty, tw * 0.34, th);
      ctx.beginPath();
      ctx.moveTo(tx - s * 0.01, ty); ctx.lineTo(tx + tw / 2, ty - s * 0.22); ctx.lineTo(tx + tw + s * 0.01, ty); ctx.closePath();
      fillStroke(ctx, tint ? darken(body, 0.2) : t.roof, ink, lw * 0.9);
      ctx.fillStyle = t.gold; ctx.beginPath(); ctx.arc(tx + tw / 2, ty - s * 0.22, lw, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = darken(t.stone, 0.5); arch(ctx, tx + tw / 2, ty + th * 0.28, s * 0.06, s * 0.1); ctx.fill();
    }
    ctx.fillStyle = t.glass; ctx.beginPath(); ctx.arc(0, ny + nh * 0.3, s * 0.06, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.7; ctx.stroke();
    ctx.strokeStyle = withAlpha(ink, 0.7); ctx.lineWidth = TLW(s);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(0, ny + nh * 0.3); ctx.lineTo(Math.cos(a) * s * 0.06, ny + nh * 0.3 + Math.sin(a) * s * 0.06); ctx.stroke(); }
    ctx.fillStyle = t.woodDark; arch(ctx, 0, ny + nh - s * 0.16, s * 0.12, s * 0.16); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.7; ctx.stroke();
  },
});

family({
  id: 'medieval.religious.abbey', name: 'Abbey', category: 'medieval',
  tags: ['abbey', 'monastery', 'cloister', 'priory', 'religion'], size: 88, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const body = tint || t.stone;
    groundShadow(ctx, 0, s * 0.42, s * 0.42, s * 0.09);
    const dw = s * 0.42, dh = s * 0.22, dx = -s * 0.02, dy = s * 0.06;
    roundRect(ctx, dx, dy, dw, dh, s * 0.01);
    fillStroke(ctx, body, ink, lw);
    ctx.beginPath();
    ctx.moveTo(dx - s * 0.02, dy); ctx.lineTo(dx + s * 0.05, dy - s * 0.1); ctx.lineTo(dx + dw - s * 0.05, dy - s * 0.1); ctx.lineTo(dx + dw + s * 0.02, dy); ctx.closePath();
    fillStroke(ctx, tint ? darken(body, 0.2) : t.roof, ink, lw);
    ctx.fillStyle = darken(t.stone, 0.5);
    const seg = (dw - s * 0.08) / 5;
    for (let i = 0; i < 5; i++) { const ax = dx + s * 0.04 + i * seg + seg / 2; arch(ctx, ax, dy + dh * 0.42, seg * 0.62, dh * 0.5); ctx.fill(); }
    const cw = s * 0.18, ch = s * 0.3, cx = -s * 0.36, cy = -s * 0.06;
    roundRect(ctx, cx, cy, cw, ch, s * 0.01);
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(cx + cw * 0.66, cy, cw * 0.34, ch);
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.02, cy); ctx.lineTo(cx + cw / 2, cy - s * 0.12); ctx.lineTo(cx + cw + s * 0.02, cy); ctx.closePath();
    fillStroke(ctx, tint ? darken(body, 0.22) : t.roof, ink, lw * 0.9);
    const btw = s * 0.1, bth = s * 0.42, btx = cx - btw * 0.5, bty = cy - s * 0.1;
    roundRect(ctx, btx, bty, btw, bth, s * 0.01);
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(btx + btw * 0.66, bty, btw * 0.34, bth);
    battlement(ctx, btx, bty, btw, 3, s * 0.035, body, ink, lw * 0.7);
    ctx.fillStyle = darken(t.stone, 0.5); arch(ctx, btx + btw / 2, bty + s * 0.06, s * 0.05, s * 0.08); ctx.fill();
    ctx.strokeStyle = t.gold; ctx.lineWidth = lw * 0.8; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + cw / 2, cy - s * 0.12); ctx.lineTo(cx + cw / 2, cy - s * 0.22);
    ctx.moveTo(cx + cw / 2 - s * 0.03, cy - s * 0.18); ctx.lineTo(cx + cw / 2 + s * 0.03, cy - s * 0.18); ctx.stroke();
  },
});

family({
  id: 'medieval.religious.chapel', name: 'Chapel', category: 'medieval',
  tags: ['chapel', 'church', 'shrine', 'bellcote', 'small'], size: 60, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const body = tint || t.stone;
    groundShadow(ctx, 0, s * 0.36, s * 0.3, s * 0.07);
    const bw = s * 0.4, bh = s * 0.32, bx = -bw / 2, by = s * 0.0;
    roundRect(ctx, bx, by, bw, bh, s * 0.01);
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.36); ctx.fillRect(bx + bw * 0.7, by, bw * 0.3, bh);
    courses(ctx, bx, by, bw, bh, 5, withAlpha(t.stoneDark, 0.28), TLW(s));
    ctx.beginPath();
    ctx.moveTo(bx - s * 0.03, by); ctx.lineTo(0, by - s * 0.16); ctx.lineTo(bx + bw + s * 0.03, by); ctx.closePath();
    fillStroke(ctx, tint ? darken(body, 0.2) : t.roof, ink, lw);
    ctx.beginPath();
    ctx.moveTo(-s * 0.06, by - s * 0.14); ctx.lineTo(-s * 0.06, by - s * 0.3); ctx.lineTo(s * 0.06, by - s * 0.3); ctx.lineTo(s * 0.06, by - s * 0.14);
    fillStroke(ctx, body, ink, lw * 0.9);
    arch(ctx, 0, by - s * 0.28, s * 0.08, s * 0.12);
    fillStroke(ctx, darken(t.stone, 0.5), ink, lw * 0.7);
    ctx.fillStyle = t.gold; ctx.beginPath(); ctx.arc(0, by - s * 0.2, s * 0.022, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = t.glass; arch(ctx, 0, by + bh * 0.26, s * 0.08, s * 0.14); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = TLW(s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, by + bh * 0.26); ctx.lineTo(0, by + bh * 0.26 + s * 0.14); ctx.moveTo(-s * 0.04, by + bh * 0.34); ctx.lineTo(s * 0.04, by + bh * 0.34); ctx.stroke();
    ctx.fillStyle = t.woodDark; arch(ctx, bx + bw * 0.78, by + bh - s * 0.13, s * 0.08, s * 0.13); ctx.fill();
  },
});

family({
  id: 'medieval.religious.shrine', name: 'Wayside Shrine', category: 'medieval',
  tags: ['shrine', 'altar', 'icon', 'religion', 'roadside'], size: 56, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wood = t.wood, roof = tint || t.roof;
    groundShadow(ctx, 0, s * 0.34, s * 0.24, s * 0.06);
    roundRect(ctx, -s * 0.2, s * 0.24, s * 0.4, s * 0.06, s * 0.01);
    fillStroke(ctx, t.stone, ink, lw * 0.9);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.4; ctx.lineCap = 'round';
    for (const px of [-s * 0.14, s * 0.14]) { ctx.beginPath(); ctx.moveTo(px, s * 0.24); ctx.lineTo(px, -s * 0.04); ctx.stroke(); }
    const nw = s * 0.26, nh = s * 0.2, nx = -nw / 2, ny = -s * 0.02;
    roundRect(ctx, nx, ny, nw, nh, s * 0.01);
    fillStroke(ctx, darken(t.stone, 0.45), ink, lw * 0.9);
    ctx.fillStyle = t.gold;
    ctx.beginPath(); ctx.arc(0, ny + nh * 0.36, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(-s * 0.025, ny + nh * 0.4, s * 0.05, nh * 0.5);
    ctx.beginPath();
    ctx.moveTo(nx - s * 0.06, ny + s * 0.01); ctx.lineTo(0, ny - s * 0.16); ctx.lineTo(nx + nw + s * 0.06, ny + s * 0.01); ctx.closePath();
    fillStroke(ctx, roof, ink, lw);
    ctx.strokeStyle = t.gold; ctx.lineWidth = lw * 0.8;
    ctx.beginPath();
    ctx.moveTo(0, ny - s * 0.16); ctx.lineTo(0, ny - s * 0.26);
    ctx.moveTo(-s * 0.025, ny - s * 0.225); ctx.lineTo(s * 0.025, ny - s * 0.225); ctx.stroke();
    ctx.fillStyle = withAlpha(t.fire, 0.9);
    for (const cx of [-s * 0.16, s * 0.16]) { ctx.beginPath(); ctx.ellipse(cx, s * 0.18, s * 0.012, s * 0.024, 0, 0, Math.PI * 2); ctx.fill(); }
  },
});

family({
  id: 'medieval.religious.cross', name: 'Wayside Cross', category: 'medieval',
  tags: ['cross', 'crucifix', 'monument', 'stone', 'celtic'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const stone = tint || t.stone;
    groundShadow(ctx, 0, s * 0.36, s * 0.26, s * 0.06);
    for (let i = 0; i < 3; i++) {
      const sw = s * (0.34 - i * 0.07), sy = s * 0.3 - i * s * 0.05;
      roundRect(ctx, -sw / 2, sy, sw, s * 0.06, s * 0.008);
      fillStroke(ctx, i % 2 ? darken(stone, 0.08) : stone, ink, lw * 0.8);
    }
    const shaftW = s * 0.08, shaftTop = -s * 0.34, shaftBot = s * 0.15;
    roundRect(ctx, -shaftW / 2, shaftTop, shaftW, shaftBot - shaftTop, s * 0.01);
    fillStroke(ctx, stone, ink, lw);
    const armY = shaftTop + s * 0.08, armW = s * 0.28;
    roundRect(ctx, -armW / 2, armY, armW, shaftW * 0.9, s * 0.01);
    fillStroke(ctx, stone, ink, lw);
    const celtic = chance(rng, 0.5);
    if (celtic) {
      ctx.beginPath(); ctx.arc(0, armY + shaftW * 0.45, s * 0.09, 0, Math.PI * 2);
      ctx.strokeStyle = ink; ctx.lineWidth = lw * 1.3; ctx.stroke();
    }
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(shaftW * 0.1, shaftTop, shaftW * 0.4, shaftBot - shaftTop);
    ctx.strokeStyle = withAlpha(ink, 0.4); ctx.lineWidth = TLW(s);
    ctx.beginPath(); ctx.moveTo(-shaftW / 2, armY + shaftW * 1.4); ctx.lineTo(shaftW / 2, armY + shaftW * 1.4); ctx.stroke();
  },
});

// ============================================================================
// MILLS
// ============================================================================
family({
  id: 'medieval.mill.windmill', name: 'Windmill', category: 'medieval',
  tags: ['windmill', 'mill', 'sails', 'grain', 'wind'], size: 72, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const body = tint || t.stone;
    groundShadow(ctx, 0, s * 0.4, s * 0.24, s * 0.07);
    const baseW = s * 0.34, topW = s * 0.22, bottom = s * 0.36, topY = -s * 0.16;
    ctx.beginPath();
    ctx.moveTo(-baseW / 2, bottom); ctx.lineTo(-topW / 2, topY);
    ctx.lineTo(topW / 2, topY); ctx.lineTo(baseW / 2, bottom); ctx.closePath();
    fillStroke(ctx, body, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4);
    ctx.beginPath();
    ctx.moveTo(topW * 0.12, topY); ctx.lineTo(topW / 2, topY); ctx.lineTo(baseW / 2, bottom); ctx.lineTo(baseW * 0.16, bottom); ctx.closePath(); ctx.fill();
    courses(ctx, -baseW / 2, topY, baseW, bottom - topY, 6, withAlpha(t.stoneDark, 0.3), TLW(s));
    ctx.beginPath();
    ctx.moveTo(-topW / 2 - s * 0.03, topY); ctx.quadraticCurveTo(0, topY - s * 0.14, topW / 2 + s * 0.03, topY);
    ctx.closePath();
    fillStroke(ctx, tint ? darken(body, 0.25) : t.roofDark, ink, lw);
    ctx.fillStyle = t.woodDark; arch(ctx, 0, bottom - s * 0.14, s * 0.09, s * 0.14); ctx.fill();
    ctx.fillStyle = darken(t.stone, 0.5); ctx.fillRect(-s * 0.03, topY + s * 0.06, s * 0.06, s * 0.06);
    const hubY = topY - s * 0.02;
    ctx.save();
    ctx.translate(0, hubY);
    ctx.rotate(rand(rng, 0, Math.PI / 2));
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.8;
    for (let k = 0; k < 4; k++) {
      ctx.rotate(Math.PI / 2);
      const len = s * 0.3, ww = s * 0.05;
      ctx.fillStyle = withAlpha(t.cloth, 0.85);
      ctx.beginPath(); ctx.rect(s * 0.03, -ww / 2, len, ww); fillStroke(ctx, withAlpha(t.cloth, 0.85), t.woodDark, lw * 0.7);
      ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.6;
      ctx.beginPath(); ctx.moveTo(s * 0.03, 0); ctx.lineTo(s * 0.03 + len, 0); ctx.stroke();
      for (let j = 1; j < 4; j++) { const lx = s * 0.03 + (len / 4) * j; ctx.beginPath(); ctx.moveTo(lx, -ww / 2); ctx.lineTo(lx, ww / 2); ctx.stroke(); }
    }
    ctx.restore();
    ctx.fillStyle = t.metalDark; ctx.beginPath(); ctx.arc(0, hubY, s * 0.03, 0, Math.PI * 2); fillStroke(ctx, t.metalDark, ink, lw * 0.7);
  },
});

family({
  id: 'medieval.mill.watermill', name: 'Watermill', category: 'medieval',
  tags: ['watermill', 'mill', 'wheel', 'river', 'water'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wall = tint || t.cloth;
    groundShadow(ctx, 0, s * 0.38, s * 0.42, s * 0.07);
    ctx.fillStyle = withAlpha(t.water, 0.55);
    roundRect(ctx, s * 0.08, s * 0.18, s * 0.36, s * 0.2, s * 0.02); ctx.fill();
    ripples(ctx, s * 0.26, s * 0.26, s * 0.3, withAlpha(t.waterLight, 0.7), TLW(s), rng);
    const bw = s * 0.4, bh = s * 0.3, bx = -s * 0.42, by = -s * 0.04;
    roundRect(ctx, bx, by, bw, bh, s * 0.01);
    fillStroke(ctx, wall, ink, lw);
    ctx.fillStyle = withAlpha(t.woodDark, 0.16); ctx.fillRect(bx + bw * 0.66, by, bw * 0.34, bh);
    planks(ctx, bx, by + bh * 0.5, bw, bh * 0.5, 6, withAlpha(t.woodDark, 0.3), TLW(s));
    ctx.beginPath();
    ctx.moveTo(bx - s * 0.04, by); ctx.lineTo(bx + bw * 0.5, by - s * 0.16); ctx.lineTo(bx + bw + s * 0.04, by); ctx.closePath();
    fillStroke(ctx, tint ? darken(wall, 0.3) : t.roof, ink, lw);
    ctx.fillStyle = t.woodDark; arch(ctx, bx + bw * 0.4, by + bh - s * 0.13, s * 0.09, s * 0.13); ctx.fill();
    ctx.fillStyle = t.glass; ctx.fillRect(bx + bw * 0.16, by + bh * 0.16, s * 0.07, s * 0.07);
    const wcx = s * 0.12, wcy = s * 0.16, wr = s * 0.16;
    ctx.beginPath(); ctx.arc(wcx, wcy, wr, 0, Math.PI * 2); fillStroke(ctx, t.wood, ink, lw);
    ctx.beginPath(); ctx.arc(wcx, wcy, wr * 0.62, 0, Math.PI * 2); fillStroke(ctx, null, ink, lw * 0.7);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.7;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(wcx, wcy); ctx.lineTo(wcx + Math.cos(a) * wr, wcy + Math.sin(a) * wr); ctx.stroke();
      const px = wcx + Math.cos(a) * wr, py = wcy + Math.sin(a) * wr;
      ctx.fillStyle = withAlpha(t.woodDark, 0.7);
      ctx.beginPath(); ctx.rect(px - s * 0.02, py - s * 0.02, s * 0.04, s * 0.04); ctx.fill();
    }
    ctx.fillStyle = t.metalDark; ctx.beginPath(); ctx.arc(wcx, wcy, s * 0.025, 0, Math.PI * 2); ctx.fill();
  },
});

// ============================================================================
// UTILITY
// ============================================================================
family({
  id: 'medieval.utility.well', name: 'Well', category: 'medieval',
  tags: ['well', 'water', 'village', 'stone', 'bucket'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const stone = tint || t.stone;
    groundShadow(ctx, 0, s * 0.32, s * 0.26, s * 0.06);
    const ww = s * 0.34, wy = s * 0.06, wh = s * 0.2;
    roundRect(ctx, -ww / 2, wy, ww, wh, s * 0.02);
    fillStroke(ctx, stone, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(ww * 0.12, wy, ww * 0.38, wh);
    ctx.beginPath(); ctx.ellipse(0, wy, ww / 2, s * 0.05, 0, 0, Math.PI * 2);
    fillStroke(ctx, darken(t.stone, 0.55), ink, lw * 0.9);
    ctx.fillStyle = withAlpha(t.water, 0.7); ctx.beginPath(); ctx.ellipse(0, wy + s * 0.01, ww / 2 - s * 0.03, s * 0.035, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = withAlpha(t.stoneDark, 0.4); ctx.lineWidth = TLW(s);
    for (let i = 1; i < 3; i++) { const yy = wy + (wh / 3) * i; ctx.beginPath(); ctx.moveTo(-ww / 2, yy); ctx.lineTo(ww / 2, yy); ctx.stroke(); }
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.2; ctx.lineCap = 'round';
    for (const px of [-ww * 0.42, ww * 0.42]) { ctx.beginPath(); ctx.moveTo(px, wy); ctx.lineTo(px, -s * 0.18); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-ww * 0.42, -s * 0.18); ctx.lineTo(0, -s * 0.3); ctx.lineTo(ww * 0.42, -s * 0.18); ctx.stroke();
    ctx.fillStyle = tint ? darken(stone, 0.2) : t.roof;
    ctx.beginPath();
    ctx.moveTo(-ww * 0.56, -s * 0.16); ctx.lineTo(0, -s * 0.32); ctx.lineTo(ww * 0.56, -s * 0.16);
    ctx.lineTo(ww * 0.46, -s * 0.13); ctx.lineTo(0, -s * 0.27); ctx.lineTo(-ww * 0.46, -s * 0.13); ctx.closePath();
    fillStroke(ctx, tint ? darken(stone, 0.2) : t.roof, ink, lw * 0.9);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.7;
    ctx.beginPath(); ctx.moveTo(s * 0.06, -s * 0.21); ctx.lineTo(s * 0.06, -s * 0.02); ctx.stroke();
    ctx.fillStyle = t.wood; roundRect(ctx, s * 0.02, -s * 0.02, s * 0.08, s * 0.07, s * 0.01); fillStroke(ctx, t.wood, ink, lw * 0.7);
  },
});

family({
  id: 'medieval.utility.granary', name: 'Granary', category: 'medieval',
  tags: ['granary', 'storehouse', 'grain', 'staddle', 'store'], size: 60, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wood = tint || t.wood;
    groundShadow(ctx, 0, s * 0.36, s * 0.3, s * 0.06);
    ctx.fillStyle = t.stone;
    for (const px of [-s * 0.2, 0, s * 0.2]) {
      ctx.beginPath(); ctx.moveTo(px - s * 0.03, s * 0.3); ctx.lineTo(px - s * 0.02, s * 0.16); ctx.lineTo(px + s * 0.02, s * 0.16); ctx.lineTo(px + s * 0.03, s * 0.3); ctx.closePath();
      fillStroke(ctx, t.stone, ink, lw * 0.8);
      ctx.beginPath(); ctx.ellipse(px, s * 0.16, s * 0.05, s * 0.02, 0, 0, Math.PI * 2);
      fillStroke(ctx, t.stoneLight, ink, lw * 0.7);
    }
    const bw = s * 0.5, bh = s * 0.22, bx = -bw / 2, by = -s * 0.06;
    roundRect(ctx, bx, by, bw, bh, s * 0.01);
    fillStroke(ctx, wood, ink, lw);
    planks(ctx, bx, by, bw, bh, 7, withAlpha(t.woodDark, 0.45), TLW(s));
    ctx.fillStyle = withAlpha(t.woodDark, 0.35); ctx.fillRect(bx + bw * 0.66, by, bw * 0.34, bh);
    ctx.beginPath();
    ctx.moveTo(bx - s * 0.05, by); ctx.lineTo(0, by - s * 0.16); ctx.lineTo(bx + bw + s * 0.05, by); ctx.closePath();
    fillStroke(ctx, tint ? darken(wood, 0.3) : t.roofDark, ink, lw);
    ctx.fillStyle = darken(t.wood, 0.4); roundRect(ctx, -s * 0.06, by + bh - s * 0.14, s * 0.12, s * 0.14, s * 0.01); ctx.fill();
    ctx.strokeStyle = withAlpha(t.woodDark, 0.5); ctx.lineWidth = TLW(s); ctx.strokeRect(-s * 0.06, by + bh - s * 0.14, s * 0.12, s * 0.14);
  },
});

family({
  id: 'medieval.utility.barn', name: 'Barn', category: 'medieval',
  tags: ['barn', 'farm', 'storage', 'hay', 'doors'], size: 64, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wall = tint || mix(t.roof, t.woodDark, 0.2);
    groundShadow(ctx, 0, s * 0.38, s * 0.38, s * 0.08);
    const bw = s * 0.56, bh = s * 0.32, bx = -bw / 2, by = s * 0.02;
    roundRect(ctx, bx, by, bw, bh, s * 0.01);
    fillStroke(ctx, wall, ink, lw);
    ctx.fillStyle = withAlpha(ink, 0.16); ctx.fillRect(bx + bw * 0.72, by, bw * 0.28, bh);
    planks(ctx, bx, by, bw, bh, 9, withAlpha(t.woodDark, 0.4), TLW(s));
    ctx.beginPath();
    ctx.moveTo(bx - s * 0.04, by);
    ctx.lineTo(bx + bw * 0.16, by - s * 0.14); ctx.lineTo(bx + bw * 0.84, by - s * 0.14); ctx.lineTo(bx + bw + s * 0.04, by); ctx.closePath();
    fillStroke(ctx, tint ? darken(wall, 0.25) : t.roofDark, ink, lw);
    ctx.fillStyle = t.cloth;
    const dw = s * 0.22, dh = s * 0.22, dx = -dw / 2, dy = by + bh - dh;
    roundRect(ctx, dx, dy, dw, dh, s * 0.008); fillStroke(ctx, mix(t.wood, t.cloth, 0.3), ink, lw * 0.9);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.8;
    ctx.beginPath();
    ctx.moveTo(dx, dy); ctx.lineTo(0, dy + dh * 0.5); ctx.lineTo(dx + dw, dy);
    ctx.moveTo(dx, dy + dh); ctx.lineTo(0, dy + dh * 0.5); ctx.lineTo(dx + dw, dy + dh);
    ctx.moveTo(0, dy); ctx.lineTo(0, dy + dh); ctx.stroke();
    ctx.fillStyle = withAlpha(t.sand, 0.9);
    ctx.beginPath(); ctx.moveTo(bx + bw * 0.5, by - s * 0.12); ctx.lineTo(bx + bw * 0.4, by - s * 0.02); ctx.lineTo(bx + bw * 0.6, by - s * 0.02); ctx.closePath(); ctx.fill();
  },
});

family({
  id: 'medieval.utility.stables', name: 'Stables', category: 'medieval',
  tags: ['stables', 'horse', 'barn', 'farm', 'stalls'], size: 64, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wall = tint || t.wood;
    groundShadow(ctx, 0, s * 0.38, s * 0.4, s * 0.07);
    const bw = s * 0.58, bh = s * 0.26, bx = -bw / 2, by = s * 0.04;
    roundRect(ctx, bx, by, bw, bh, s * 0.01);
    fillStroke(ctx, wall, ink, lw);
    ctx.fillStyle = withAlpha(t.woodDark, 0.18); ctx.fillRect(bx, by + bh * 0.5, bw, bh * 0.5);
    ctx.beginPath();
    ctx.moveTo(bx - s * 0.04, by); ctx.lineTo(bx + bw * 0.5, by - s * 0.13); ctx.lineTo(bx + bw + s * 0.04, by); ctx.closePath();
    fillStroke(ctx, tint ? darken(wall, 0.3) : t.roofDark, ink, lw);
    ctx.fillStyle = darken(t.wood, 0.5);
    for (let i = 0; i < 3; i++) {
      const sx = bx + bw * 0.1 + i * bw * 0.3;
      arch(ctx, sx + bw * 0.1, by + bh * 0.34, bw * 0.16, bh * 0.62); ctx.fill();
    }
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.7;
    for (let i = 0; i < 4; i++) { const px = bx + bw * 0.1 + i * bw * 0.27; ctx.beginPath(); ctx.moveTo(px, by + bh * 0.1); ctx.lineTo(px, by + bh); ctx.stroke(); }
    const hx = bx + bw * 0.78, hy = by + bh * 0.5;
    ctx.fillStyle = darken(t.wood, 0.2);
    ctx.beginPath();
    ctx.moveTo(hx, hy); ctx.quadraticCurveTo(hx + s * 0.04, hy - s * 0.06, hx + s * 0.06, hy - s * 0.1);
    ctx.lineTo(hx + s * 0.1, hy - s * 0.12); ctx.lineTo(hx + s * 0.09, hy - s * 0.07);
    ctx.quadraticCurveTo(hx + s * 0.08, hy, hx + s * 0.08, hy + s * 0.06);
    ctx.lineTo(hx + s * 0.02, hy + s * 0.06); ctx.lineTo(hx + s * 0.02, hy + s * 0.0); ctx.closePath();
    fillStroke(ctx, darken(t.wood, 0.15), ink, lw * 0.7);
  },
});

// ============================================================================
// COMMERCE
// ============================================================================
family({
  id: 'medieval.commerce.market', name: 'Market Stall', category: 'medieval',
  tags: ['market', 'stall', 'shop', 'awning', 'trade'], size: 60, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const stripe = tint || t.flag;
    groundShadow(ctx, 0, s * 0.34, s * 0.34, s * 0.06);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.2; ctx.lineCap = 'round';
    for (const px of [-s * 0.28, s * 0.28]) { ctx.beginPath(); ctx.moveTo(px, s * 0.28); ctx.lineTo(px, -s * 0.12); ctx.stroke(); }
    const cw = s * 0.5, cy = s * 0.04, cx = -cw / 2;
    roundRect(ctx, cx, cy, cw, s * 0.07, s * 0.01);
    fillStroke(ctx, t.wood, ink, lw * 0.9);
    ctx.fillStyle = withAlpha(t.woodDark, 0.5); ctx.fillRect(cx, cy + s * 0.04, cw, s * 0.03);
    const goods = [t.roof, t.leaf, t.gold, t.danger, t.accent];
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = goods[i % goods.length];
      ctx.beginPath(); ctx.arc(cx + s * 0.06 + i * s * 0.1, cy - s * 0.01, s * 0.022, 0, Math.PI * 2); fillStroke(ctx, goods[i % goods.length], ink, lw * 0.5);
    }
    const aw = s * 0.62, ay = -s * 0.14, ax = -aw / 2;
    ctx.beginPath();
    ctx.moveTo(ax, ay); ctx.lineTo(ax + aw, ay); ctx.lineTo(ax + aw, ay + s * 0.04);
    ctx.quadraticCurveTo(ax + aw * 0.92, ay + s * 0.1, ax + aw * 0.84, ay + s * 0.04);
    ctx.quadraticCurveTo(ax + aw * 0.76, ay + s * 0.1, ax + aw * 0.68, ay + s * 0.04);
    ctx.quadraticCurveTo(ax + aw * 0.6, ay + s * 0.1, ax + aw * 0.52, ay + s * 0.04);
    ctx.quadraticCurveTo(ax + aw * 0.44, ay + s * 0.1, ax + aw * 0.36, ay + s * 0.04);
    ctx.quadraticCurveTo(ax + aw * 0.28, ay + s * 0.1, ax + aw * 0.2, ay + s * 0.04);
    ctx.quadraticCurveTo(ax + aw * 0.12, ay + s * 0.1, ax + aw * 0.04, ay + s * 0.04);
    ctx.lineTo(ax, ay + s * 0.04); ctx.closePath();
    fillStroke(ctx, t.cloth, ink, lw);
    ctx.save();
    ctx.beginPath(); ctx.rect(ax, ay, aw, s * 0.1); ctx.clip();
    ctx.fillStyle = stripe;
    for (let i = 0; i < 7; i += 2) ctx.fillRect(ax + (aw / 7) * i, ay, aw / 7, s * 0.1);
    ctx.restore();
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.9;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + aw, ay); ctx.stroke();
  },
});

family({
  id: 'medieval.commerce.tavern', name: 'Tavern', category: 'medieval',
  tags: ['tavern', 'inn', 'pub', 'sign', 'ale'], size: 64, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wall = tint || t.cloth;
    groundShadow(ctx, 0, s * 0.36, s * 0.34, s * 0.07);
    const bw = s * 0.46, bh = s * 0.34, bx = -bw / 2, by = -s * 0.02;
    roundRect(ctx, bx, by, bw, bh, s * 0.01);
    fillStroke(ctx, wall, ink, lw);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.8;
    ctx.strokeRect(bx + lw, by + lw, bw - lw * 2, bh - lw * 2);
    ctx.beginPath();
    ctx.moveTo(bx + lw, by + bh * 0.5); ctx.lineTo(bx + bw - lw, by + bh * 0.5);
    ctx.moveTo(bx + bw * 0.5, by + lw); ctx.lineTo(bx + bw * 0.5, by + bh - lw); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx - s * 0.05, by); ctx.lineTo(0, by - s * 0.18); ctx.lineTo(bx + bw + s * 0.05, by); ctx.closePath();
    fillStroke(ctx, tint ? darken(wall, 0.3) : t.roof, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.7); ctx.fillRect(bx + bw * 0.7, by - s * 0.26, s * 0.05, s * 0.12);
    ctx.fillStyle = t.woodDark; roundRect(ctx, -s * 0.05, by + bh - s * 0.14, s * 0.1, s * 0.14, s * 0.01); ctx.fill();
    ctx.fillStyle = withAlpha(t.gold, 0.6); ctx.fillRect(bx + bw * 0.14, by + bh * 0.28, s * 0.08, s * 0.08);
    ctx.strokeStyle = ink; ctx.lineWidth = TLW(s); ctx.strokeRect(bx + bw * 0.14, by + bh * 0.28, s * 0.08, s * 0.08);
    const armX = bx + bw, armY = by + s * 0.06;
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(armX, armY); ctx.lineTo(armX + s * 0.12, armY); ctx.lineTo(armX + s * 0.12, armY + s * 0.02); ctx.stroke();
    roundRect(ctx, armX + s * 0.05, armY + s * 0.02, s * 0.14, s * 0.1, s * 0.01);
    fillStroke(ctx, t.wood, ink, lw * 0.8);
    ctx.fillStyle = t.gold;
    ctx.beginPath(); ctx.arc(armX + s * 0.12, armY + s * 0.07, s * 0.03, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = withAlpha(ink, 0.6); ctx.lineWidth = TLW(s); ctx.stroke();
  },
});

family({
  id: 'medieval.commerce.blacksmith', name: 'Blacksmith Forge', category: 'medieval',
  tags: ['blacksmith', 'forge', 'smithy', 'anvil', 'fire'], size: 64, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wall = tint || t.stone;
    groundShadow(ctx, 0, s * 0.38, s * 0.36, s * 0.07);
    const bw = s * 0.44, bh = s * 0.3, bx = -s * 0.04, by = -s * 0.02;
    roundRect(ctx, bx, by, bw, bh, s * 0.01);
    fillStroke(ctx, wall, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(bx + bw * 0.68, by, bw * 0.32, bh);
    courses(ctx, bx, by, bw, bh, 5, withAlpha(t.stoneDark, 0.3), TLW(s));
    ctx.beginPath();
    ctx.moveTo(bx - s * 0.04, by); ctx.lineTo(bx + bw * 0.5, by - s * 0.14); ctx.lineTo(bx + bw + s * 0.04, by); ctx.closePath();
    fillStroke(ctx, tint ? darken(wall, 0.3) : t.roofDark, ink, lw);
    const chx = bx + bw * 0.72;
    roundRect(ctx, chx, by - s * 0.32, s * 0.09, s * 0.2, s * 0.01);
    fillStroke(ctx, t.brick, ink, lw * 0.9);
    ctx.fillStyle = withAlpha(t.brickDark, 0.5); ctx.fillRect(chx + s * 0.06, by - s * 0.32, s * 0.03, s * 0.2);
    ctx.fillStyle = withAlpha(t.stoneLight, 0.5);
    for (let i = 0; i < 3; i++) { const r = s * (0.04 + i * 0.018); ctx.beginPath(); ctx.arc(chx + s * 0.045 + jitter(rng, s * 0.02), by - s * 0.36 - i * s * 0.05, r, 0, Math.PI * 2); ctx.fill(); }
    softShadow(ctx, withAlpha(t.fire, 0.9), s * 0.12, 0, 0);
    ctx.fillStyle = t.fire; arch(ctx, bx + bw * 0.32, by + bh - s * 0.16, s * 0.14, s * 0.16); ctx.fill();
    clearShadow(ctx);
    ctx.fillStyle = withAlpha(t.gold, 0.8); arch(ctx, bx + bw * 0.32, by + bh - s * 0.12, s * 0.08, s * 0.11); ctx.fill();
    const anx = -s * 0.3, any = s * 0.16;
    ctx.fillStyle = t.metalDark;
    ctx.beginPath();
    ctx.moveTo(anx - s * 0.08, any); ctx.lineTo(anx + s * 0.04, any); ctx.lineTo(anx + s * 0.08, any - s * 0.02);
    ctx.lineTo(anx + s * 0.02, any - s * 0.03); ctx.lineTo(anx + s * 0.02, any - s * 0.06);
    ctx.lineTo(anx - s * 0.02, any - s * 0.06); ctx.lineTo(anx - s * 0.02, any - s * 0.03);
    ctx.lineTo(anx - s * 0.06, any - s * 0.03); ctx.lineTo(anx - s * 0.06, any); ctx.closePath();
    fillStroke(ctx, t.metalDark, ink, lw * 0.7);
    ctx.fillStyle = t.woodDark; ctx.fillRect(anx - s * 0.05, any, s * 0.1, s * 0.05);
  },
});

// ============================================================================
// CAMPS
// ============================================================================
family({
  id: 'medieval.camp.tents', name: 'Encampment', category: 'medieval',
  tags: ['camp', 'tents', 'army', 'encampment', 'bivouac'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const cloth = tint || t.cloth;
    groundShadow(ctx, 0, s * 0.36, s * 0.42, s * 0.07);
    const tents = [
      { x: -s * 0.22, y: s * 0.14, w: s * 0.3, c: cloth },
      { x: s * 0.18, y: s * 0.16, w: s * 0.26, c: darken(cloth, 0.12) },
      { x: -s * 0.02, y: -s * 0.02, w: s * 0.34, c: lighten(cloth, 0.06) },
    ];
    tents.sort((a, b) => a.y - b.y);
    for (const tn of tents) {
      const { x, y, w, c } = tn, h = w * 0.8;
      ctx.beginPath();
      ctx.moveTo(x - w / 2, y); ctx.quadraticCurveTo(x - w * 0.16, y - h, x, y - h);
      ctx.quadraticCurveTo(x + w * 0.16, y - h, x + w / 2, y); ctx.closePath();
      fillStroke(ctx, c, ink, lw);
      ctx.fillStyle = withAlpha(ink, 0.16);
      ctx.beginPath(); ctx.moveTo(x, y - h); ctx.quadraticCurveTo(x + w * 0.16, y - h, x + w / 2, y); ctx.lineTo(x, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = darken(t.wood, 0.3);
      ctx.beginPath(); ctx.moveTo(x - w * 0.1, y); ctx.lineTo(x, y - h * 0.7); ctx.lineTo(x + w * 0.1, y); ctx.closePath(); ctx.fill();
      pole(ctx, x, y - h, y - h - s * 0.06, t.woodDark, lw * 0.6);
      pennant(ctx, x, y - h - s * 0.06, s * 0.08, s * 0.04, t.flag, ink, lw * 0.5, 1);
    }
    ctx.fillStyle = withAlpha(t.fire, 0.9);
    blob(ctx, s * 0.32, s * 0.24, s * 0.04, rng, 0.5, 8); ctx.fill();
  },
});

family({
  id: 'medieval.camp.pavilion', name: 'Pavilion Tent', category: 'medieval',
  tags: ['pavilion', 'tent', 'noble', 'round', 'camp'], size: 64, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const cloth = tint || t.white, band = mix(cloth, t.flag, 0.7);
    groundShadow(ctx, 0, s * 0.36, s * 0.34, s * 0.07);
    const w = s * 0.56, baseY = s * 0.24, h = s * 0.42, apexY = baseY - h;
    ctx.beginPath();
    ctx.moveTo(-w / 2, baseY);
    ctx.quadraticCurveTo(-w * 0.4, baseY - h * 0.5, -s * 0.05, apexY + s * 0.04);
    ctx.lineTo(0, apexY); ctx.lineTo(s * 0.05, apexY + s * 0.04);
    ctx.quadraticCurveTo(w * 0.4, baseY - h * 0.5, w / 2, baseY);
    ctx.quadraticCurveTo(0, baseY + s * 0.05, -w / 2, baseY); ctx.closePath();
    fillStroke(ctx, cloth, ink, lw);
    ctx.fillStyle = withAlpha(ink, 0.14);
    ctx.beginPath();
    ctx.moveTo(0, apexY); ctx.lineTo(s * 0.05, apexY + s * 0.04);
    ctx.quadraticCurveTo(w * 0.4, baseY - h * 0.5, w / 2, baseY);
    ctx.quadraticCurveTo(w * 0.2, baseY + s * 0.04, 0, baseY); ctx.closePath(); ctx.fill();
    ctx.fillStyle = band;
    ctx.beginPath();
    ctx.moveTo(-w / 2, baseY); ctx.quadraticCurveTo(0, baseY + s * 0.05, w / 2, baseY);
    ctx.lineTo(w / 2, baseY - s * 0.06); ctx.quadraticCurveTo(0, baseY - s * 0.01, -w / 2, baseY - s * 0.06); ctx.closePath();
    fillStroke(ctx, band, ink, lw * 0.7);
    ctx.strokeStyle = withAlpha(ink, 0.4); ctx.lineWidth = TLW(s);
    for (const dx of [-w * 0.28, 0, w * 0.28]) { ctx.beginPath(); ctx.moveTo(dx * 0.4, apexY + s * 0.06); ctx.quadraticCurveTo(dx, baseY - h * 0.4, dx * 1.3, baseY - s * 0.04); ctx.stroke(); }
    ctx.fillStyle = t.woodDark; arch(ctx, 0, baseY - s * 0.16, s * 0.12, s * 0.16); ctx.fill();
    ctx.fillStyle = withAlpha(darken(t.wood, 0.4), 0.6);
    ctx.beginPath(); ctx.moveTo(0, baseY - s * 0.16); ctx.lineTo(-s * 0.05, baseY); ctx.lineTo(s * 0.05, baseY); ctx.closePath(); ctx.fill();
    pole(ctx, 0, apexY, apexY - s * 0.08, t.woodDark, lw * 0.7);
    pennant(ctx, 0, apexY - s * 0.08, s * 0.13, s * 0.06, tint ? lighten(cloth, 0.2) : t.flag, ink, lw * 0.6, 1);
  },
});

family({
  id: 'medieval.camp.campfire', name: 'Campfire', category: 'medieval',
  tags: ['campfire', 'fire', 'camp', 'logs', 'flame'], size: 48, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    groundShadow(ctx, 0, s * 0.3, s * 0.3, s * 0.06);
    ctx.fillStyle = t.stone;
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2, rx = Math.cos(a) * s * 0.24, ry = s * 0.22 + Math.sin(a) * s * 0.08;
      ctx.beginPath(); ctx.arc(rx, ry, s * 0.04, 0, Math.PI * 2); fillStroke(ctx, i % 2 ? t.stoneDark : t.stone, ink, lw * 0.6);
    }
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.6; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-s * 0.18, s * 0.24); ctx.lineTo(s * 0.16, s * 0.14);
    ctx.moveTo(s * 0.18, s * 0.24); ctx.lineTo(-s * 0.16, s * 0.14);
    ctx.moveTo(-s * 0.04, s * 0.26); ctx.lineTo(s * 0.04, s * 0.12); ctx.stroke();
    ctx.strokeStyle = t.wood; ctx.lineWidth = lw * 0.8;
    ctx.beginPath(); ctx.moveTo(-s * 0.18, s * 0.24); ctx.lineTo(s * 0.16, s * 0.14); ctx.stroke();
    softShadow(ctx, withAlpha(t.fire, 0.8), s * 0.16, 0, 0);
    const main = tint || t.fire;
    ctx.beginPath();
    ctx.moveTo(-s * 0.1, s * 0.14);
    ctx.quadraticCurveTo(-s * 0.12, -s * 0.06, 0, -s * 0.22);
    ctx.quadraticCurveTo(s * 0.12, -s * 0.06, s * 0.1, s * 0.14);
    ctx.quadraticCurveTo(0, s * 0.06, -s * 0.1, s * 0.14); ctx.closePath();
    fillStroke(ctx, main, null, 0);
    clearShadow(ctx);
    ctx.fillStyle = withAlpha(t.gold, 0.95);
    ctx.beginPath();
    ctx.moveTo(-s * 0.05, s * 0.12);
    ctx.quadraticCurveTo(-s * 0.06, -s * 0.02, 0, -s * 0.13);
    ctx.quadraticCurveTo(s * 0.06, -s * 0.02, s * 0.05, s * 0.12);
    ctx.quadraticCurveTo(0, s * 0.05, -s * 0.05, s * 0.12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = withAlpha(t.fire, 0.7);
    for (let i = 0; i < 3; i++) { const sx = jitter(rng, s * 0.16); ctx.beginPath(); ctx.arc(sx, -s * 0.24 - rand(rng, 0, s * 0.1), s * 0.012, 0, Math.PI * 2); ctx.fill(); }
  },
});

// ============================================================================
// BRIDGES
// ============================================================================
family({
  id: 'medieval.bridge.wooden', name: 'Wooden Bridge', category: 'medieval',
  tags: ['bridge', 'wood', 'crossing', 'planks', 'river'], size: 64, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wood = tint || t.wood;
    ctx.fillStyle = withAlpha(t.water, 0.5);
    roundRect(ctx, -s * 0.46, s * 0.16, s * 0.92, s * 0.22, s * 0.02); ctx.fill();
    ripples(ctx, 0, s * 0.26, s * 0.7, withAlpha(t.waterLight, 0.6), TLW(s), rng);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.1; ctx.lineCap = 'round';
    for (const px of [-s * 0.3, -s * 0.1, s * 0.1, s * 0.3]) { ctx.beginPath(); ctx.moveTo(px, s * 0.32); ctx.lineTo(px, s * 0.02); ctx.stroke(); }
    const deckY = -s * 0.02, deckH = s * 0.08;
    ctx.beginPath();
    ctx.moveTo(-s * 0.42, deckY + s * 0.04);
    ctx.quadraticCurveTo(0, deckY - s * 0.08, s * 0.42, deckY + s * 0.04);
    ctx.lineTo(s * 0.42, deckY + deckH);
    ctx.quadraticCurveTo(0, deckY - s * 0.08 + deckH, -s * 0.42, deckY + deckH); ctx.closePath();
    fillStroke(ctx, wood, ink, lw);
    ctx.strokeStyle = withAlpha(t.woodDark, 0.5); ctx.lineWidth = TLW(s);
    for (let i = -4; i <= 4; i++) {
      const px = i * s * 0.09;
      ctx.beginPath(); ctx.moveTo(px, deckY - s * 0.02 - Math.abs(i) * 0); ctx.lineTo(px, deckY + deckH); ctx.stroke();
    }
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(-s * 0.42, deckY); ctx.quadraticCurveTo(0, deckY - s * 0.12, s * 0.42, deckY);
    ctx.stroke();
    for (const px of [-s * 0.42, -s * 0.14, s * 0.14, s * 0.42]) {
      const ry = -s * 0.12 * (1 - Math.pow(px / (s * 0.42), 2));
      ctx.beginPath(); ctx.moveTo(px, deckY + ry); ctx.lineTo(px, deckY + ry - s * 0.1); ctx.stroke();
    }
  },
});

family({
  id: 'medieval.bridge.stone', name: 'Stone Bridge', category: 'medieval',
  tags: ['bridge', 'stone', 'arch', 'crossing', 'river'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const stone = tint || t.stone;
    ctx.fillStyle = withAlpha(t.water, 0.5);
    roundRect(ctx, -s * 0.48, s * 0.14, s * 0.96, s * 0.24, s * 0.02); ctx.fill();
    const deckTop = -s * 0.1, span = s * 0.84;
    ctx.beginPath();
    ctx.moveTo(-span / 2, s * 0.22);
    ctx.lineTo(-span / 2, deckTop + s * 0.06);
    ctx.quadraticCurveTo(0, deckTop - s * 0.06, span / 2, deckTop + s * 0.06);
    ctx.lineTo(span / 2, s * 0.22);
    ctx.lineTo(span * 0.34, s * 0.22);
    ctx.quadraticCurveTo(span * 0.34, s * 0.04, 0, s * 0.04);
    ctx.quadraticCurveTo(-span * 0.34, s * 0.04, -span * 0.34, s * 0.22);
    ctx.closePath();
    fillStroke(ctx, stone, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.5);
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(side * span * 0.34, s * 0.22);
      ctx.quadraticCurveTo(side * span * 0.34, s * 0.05, 0, s * 0.045);
      ctx.lineTo(0, s * 0.08);
      ctx.quadraticCurveTo(side * span * 0.28, s * 0.09, side * span * 0.28, s * 0.22); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = withAlpha(t.stoneDark, 0.45); ctx.lineWidth = TLW(s);
    for (let i = 0; i < 7; i++) {
      const px = -span * 0.42 + i * span * 0.14;
      const ry = deckTop + s * 0.06 - s * 0.12 * (1 - Math.pow(px / (span / 2), 2));
      ctx.beginPath(); ctx.moveTo(px, ry); ctx.lineTo(px - Math.sign(px || 1) * s * 0.02, ry + s * 0.08); ctx.stroke();
    }
    ctx.fillStyle = stone;
    for (let i = 0; i < 8; i++) {
      const px = -span / 2 + i * span / 7;
      const ry = deckTop + s * 0.02 - s * 0.12 * (1 - Math.pow(px / (span / 2), 2));
      roundRect(ctx, px - s * 0.02, ry - s * 0.05, s * 0.045, s * 0.05, s * 0.005); fillStroke(ctx, stone, ink, lw * 0.7);
    }
    ctx.fillStyle = withAlpha(t.waterLight, 0.6);
    ripples(ctx, 0, s * 0.18, s * 0.4, withAlpha(t.waterLight, 0.6), TLW(s), rng);
  },
});

family({
  id: 'medieval.bridge.drawbridge', name: 'Drawbridge', category: 'medieval',
  tags: ['drawbridge', 'gate', 'chains', 'moat', 'castle'], size: 64, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const stone = tint || t.stone;
    groundShadow(ctx, 0, s * 0.4, s * 0.36, s * 0.06);
    ctx.fillStyle = withAlpha(t.water, 0.5); roundRect(ctx, -s * 0.46, s * 0.22, s * 0.92, s * 0.16, s * 0.02); ctx.fill();
    const ww = s * 0.5, wh = s * 0.56, wx = -ww / 2, wy = -s * 0.3;
    roundRect(ctx, wx, wy, ww, wh, s * 0.012);
    fillStroke(ctx, stone, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.38); ctx.fillRect(wx + ww * 0.7, wy, ww * 0.3, wh);
    courses(ctx, wx, wy, ww, wh, 7, withAlpha(t.stoneDark, 0.3), TLW(s));
    battlement(ctx, wx, wy, ww, 4, s * 0.05, stone, ink, lw * 0.8);
    arch(ctx, 0, wy + s * 0.12, s * 0.28, s * 0.42);
    fillStroke(ctx, darken(t.stone, 0.6), ink, lw);
    const open = chance(rng, 0.5);
    if (open) {
      ctx.save();
      ctx.translate(0, wy + wh - s * 0.04);
      ctx.fillStyle = t.wood;
      roundRect(ctx, -s * 0.14, 0, s * 0.28, s * 0.34, s * 0.01); fillStroke(ctx, t.wood, ink, lw);
      planks(ctx, -s * 0.14, 0, s * 0.28, s * 0.34, 4, withAlpha(t.woodDark, 0.5), TLW(s));
      ctx.restore();
      ctx.strokeStyle = t.metalDark; ctx.lineWidth = lw * 0.7;
      for (const cx of [-s * 0.12, s * 0.12]) { ctx.beginPath(); ctx.moveTo(cx, wy + s * 0.02); ctx.lineTo(cx, wy + wh - s * 0.04); ctx.stroke(); }
    } else {
      ctx.fillStyle = t.wood;
      roundRect(ctx, -s * 0.16, wy + wh - s * 0.06, s * 0.32, s * 0.06, s * 0.01); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-s * 0.14, wy + wh - s * 0.04);
      ctx.quadraticCurveTo(0, wy + wh + s * 0.12, s * 0.3, wy + wh + s * 0.04);
      ctx.lineTo(s * 0.3, wy + wh + s * 0.1);
      ctx.quadraticCurveTo(0, wy + wh + s * 0.18, -s * 0.14, wy + wh + s * 0.02); ctx.closePath();
      fillStroke(ctx, t.wood, ink, lw);
      ctx.strokeStyle = t.metalDark; ctx.lineWidth = lw * 0.6;
      ctx.beginPath(); ctx.moveTo(-s * 0.12, wy + s * 0.04); ctx.lineTo(s * 0.26, wy + wh + s * 0.05); ctx.stroke();
    }
    ctx.fillStyle = t.metalDark;
    for (const cx of [-s * 0.12, s * 0.12]) { ctx.beginPath(); ctx.arc(cx, wy + s * 0.02, lw, 0, Math.PI * 2); ctx.fill(); }
  },
});

// ============================================================================
// DOCKS & SHIPS
// ============================================================================
family({
  id: 'medieval.water.dock', name: 'Dock', category: 'medieval',
  tags: ['dock', 'pier', 'jetty', 'harbor', 'water'], size: 64, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wood = tint || t.wood;
    ctx.fillStyle = withAlpha(t.water, 0.55); roundRect(ctx, -s * 0.46, -s * 0.1, s * 0.92, s * 0.48, s * 0.02); ctx.fill();
    ripples(ctx, 0, s * 0.04, s * 0.7, withAlpha(t.waterLight, 0.6), TLW(s), rng);
    ripples(ctx, 0, s * 0.24, s * 0.6, withAlpha(t.waterLight, 0.5), TLW(s), rng);
    ctx.fillStyle = withAlpha(ink, 0.18);
    for (const px of [-s * 0.3, -s * 0.1, s * 0.1, s * 0.3]) ctx.fillRect(px - s * 0.02, -s * 0.04, s * 0.04, s * 0.36);
    const deckY = -s * 0.12, dh = s * 0.08;
    roundRect(ctx, -s * 0.4, deckY, s * 0.5, dh, s * 0.008);
    fillStroke(ctx, wood, ink, lw);
    roundRect(ctx, s * 0.04, deckY, s * 0.14, s * 0.34, s * 0.008);
    fillStroke(ctx, wood, ink, lw);
    ctx.strokeStyle = withAlpha(t.woodDark, 0.5); ctx.lineWidth = TLW(s);
    for (let i = -4; i <= 0; i++) { ctx.beginPath(); ctx.moveTo(i * s * 0.08 - s * 0.0, deckY); ctx.lineTo(i * s * 0.08, deckY + dh); ctx.stroke(); }
    for (let j = 1; j < 5; j++) { const yy = deckY + j * s * 0.07; ctx.beginPath(); ctx.moveTo(s * 0.04, yy); ctx.lineTo(s * 0.18, yy); ctx.stroke(); }
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.3; ctx.lineCap = 'round';
    for (const px of [-s * 0.36, s * 0.12]) { ctx.beginPath(); ctx.moveTo(px, deckY - s * 0.02); ctx.lineTo(px, deckY - s * 0.14); ctx.stroke(); }
    ctx.strokeStyle = withAlpha(t.metalDark, 0.7); ctx.lineWidth = lw * 0.6;
    ctx.beginPath(); ctx.arc(-s * 0.36, deckY - s * 0.08, s * 0.03, 0, Math.PI * 1.4); ctx.stroke();
    const moored = chance(rng, 0.6);
    if (moored) { hull(ctx, -s * 0.18, deckY + s * 0.16, s * 0.22, s * 0.1, t.wood, ink, lw * 0.9); }
  },
});

family({
  id: 'medieval.water.cog', name: 'Cog Ship', category: 'medieval',
  tags: ['ship', 'cog', 'boat', 'sail', 'merchant'], size: 64, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const sail = tint || t.white;
    ctx.fillStyle = withAlpha(t.water, 0.5); roundRect(ctx, -s * 0.46, s * 0.18, s * 0.92, s * 0.2, s * 0.02); ctx.fill();
    ripples(ctx, 0, s * 0.28, s * 0.7, withAlpha(t.waterLight, 0.6), TLW(s), rng);
    pole(ctx, 0, -s * 0.36, s * 0.16, t.woodDark, lw * 1.1);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.8;
    ctx.beginPath(); ctx.moveTo(-s * 0.22, -s * 0.26); ctx.lineTo(s * 0.22, -s * 0.26); ctx.stroke();
    const sw = s * 0.42, st = -s * 0.26, sh = s * 0.3;
    ctx.beginPath();
    ctx.moveTo(-sw / 2, st);
    ctx.lineTo(sw / 2, st);
    ctx.quadraticCurveTo(sw / 2 - s * 0.02, st + sh * 0.6, sw / 2 - s * 0.04, st + sh);
    ctx.quadraticCurveTo(0, st + sh + s * 0.03, -sw / 2 + s * 0.04, st + sh);
    ctx.quadraticCurveTo(-sw / 2 + s * 0.02, st + sh * 0.6, -sw / 2, st); ctx.closePath();
    fillStroke(ctx, sail, ink, lw);
    ctx.fillStyle = withAlpha(tint ? darken(sail, 0.2) : t.flag, 0.8);
    ctx.fillRect(-sw / 2 + s * 0.02, st + sh * 0.36, sw - s * 0.04, sh * 0.18);
    ctx.strokeStyle = withAlpha(ink, 0.2); ctx.lineWidth = TLW(s);
    for (let i = 1; i < 4; i++) { const px = -sw / 2 + (sw / 4) * i; ctx.beginPath(); ctx.moveTo(px, st); ctx.lineTo(px, st + sh); ctx.stroke(); }
    pole(ctx, 0, -s * 0.36, -s * 0.44, t.woodDark, lw * 0.7);
    pennant(ctx, 0, -s * 0.44, s * 0.12, s * 0.05, t.flag, ink, lw * 0.5, 1);
    const hy = s * 0.1, hw = s * 0.56;
    ctx.beginPath();
    ctx.moveTo(-hw / 2 - s * 0.02, hy - s * 0.04); ctx.lineTo(-hw / 2, hy);
    ctx.lineTo(hw / 2, hy); ctx.lineTo(hw / 2 + s * 0.02, hy - s * 0.04);
    ctx.quadraticCurveTo(hw / 2, hy + s * 0.16, 0, hy + s * 0.16);
    ctx.quadraticCurveTo(-hw / 2, hy + s * 0.16, -hw / 2 - s * 0.02, hy - s * 0.04); ctx.closePath();
    fillStroke(ctx, t.wood, ink, lw);
    ctx.fillStyle = withAlpha(t.woodDark, 0.4); ctx.fillRect(-hw / 2, hy + s * 0.08, hw, s * 0.08);
    planks(ctx, -hw / 2, hy, hw, s * 0.14, 8, withAlpha(t.woodDark, 0.3), TLW(s));
    ctx.fillStyle = mix(t.wood, t.cloth, 0.3);
    roundRect(ctx, -hw / 2 - s * 0.02, hy - s * 0.08, s * 0.1, s * 0.08, s * 0.01); fillStroke(ctx, mix(t.wood, t.cloth, 0.3), ink, lw * 0.8);
    roundRect(ctx, hw / 2 - s * 0.08, hy - s * 0.1, s * 0.1, s * 0.1, s * 0.01); fillStroke(ctx, mix(t.wood, t.cloth, 0.3), ink, lw * 0.8);
  },
});

family({
  id: 'medieval.water.galleon', name: 'Galleon', category: 'medieval',
  tags: ['ship', 'galleon', 'carrack', 'sails', 'warship'], size: 80, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const sail = tint || t.white;
    ctx.fillStyle = withAlpha(t.water, 0.5); roundRect(ctx, -s * 0.48, s * 0.2, s * 0.96, s * 0.18, s * 0.02); ctx.fill();
    ripples(ctx, 0, s * 0.3, s * 0.74, withAlpha(t.waterLight, 0.6), TLW(s), rng);
    const masts = [{ x: -s * 0.2, h: s * 0.34 }, { x: 0, h: s * 0.44 }, { x: s * 0.2, h: s * 0.34 }];
    for (const m of masts) {
      pole(ctx, m.x, -m.h, s * 0.12, t.woodDark, lw);
      const topY = -m.h + s * 0.04;
      for (let k = 0; k < 2; k++) {
        const yy = topY + k * (m.h * 0.5), sw = (s * 0.26) * (1 - k * 0.18), sh = m.h * 0.42;
        ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.6;
        ctx.beginPath(); ctx.moveTo(m.x - sw / 2 - s * 0.01, yy); ctx.lineTo(m.x + sw / 2 + s * 0.01, yy); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(m.x - sw / 2, yy); ctx.lineTo(m.x + sw / 2, yy);
        ctx.quadraticCurveTo(m.x + sw / 2 - s * 0.02, yy + sh * 0.7, m.x, yy + sh);
        ctx.quadraticCurveTo(m.x - sw / 2 + s * 0.02, yy + sh * 0.7, m.x - sw / 2, yy); ctx.closePath();
        fillStroke(ctx, k % 2 ? lighten(sail, 0.02) : sail, ink, lw * 0.8);
        ctx.fillStyle = withAlpha(tint ? darken(sail, 0.25) : t.flag, 0.4);
        ctx.fillRect(m.x - sw / 2 + s * 0.01, yy + sh * 0.3, sw - s * 0.02, sh * 0.12);
      }
      pole(ctx, m.x, -m.h, -m.h - s * 0.06, t.woodDark, lw * 0.5);
      pennant(ctx, m.x, -m.h - s * 0.06, s * 0.1, s * 0.04, t.flag, ink, lw * 0.4, 1);
    }
    const hy = s * 0.12, hw = s * 0.7;
    ctx.beginPath();
    ctx.moveTo(-hw / 2 - s * 0.03, hy - s * 0.08);
    ctx.lineTo(-hw / 2 + s * 0.02, hy - s * 0.02);
    ctx.lineTo(hw / 2 - s * 0.04, hy - s * 0.02);
    ctx.lineTo(hw / 2 + s * 0.02, hy - s * 0.12);
    ctx.lineTo(hw / 2 + s * 0.05, hy - s * 0.12);
    ctx.quadraticCurveTo(hw / 2, hy + s * 0.16, 0, hy + s * 0.18);
    ctx.quadraticCurveTo(-hw / 2 + s * 0.04, hy + s * 0.16, -hw / 2 - s * 0.03, hy - s * 0.08); ctx.closePath();
    fillStroke(ctx, t.wood, ink, lw);
    ctx.fillStyle = withAlpha(t.woodDark, 0.4); ctx.fillRect(-hw / 2, hy + s * 0.06, hw, s * 0.1);
    ctx.fillStyle = darken(t.wood, 0.4);
    for (let i = 0; i < 6; i++) ctx.fillRect(-hw * 0.36 + i * hw * 0.14, hy + s * 0.0, s * 0.03, s * 0.03);
    ctx.strokeStyle = withAlpha(t.gold, 0.7); ctx.lineWidth = TLW(s);
    ctx.beginPath(); ctx.moveTo(-hw / 2 + s * 0.04, hy - s * 0.02); ctx.lineTo(hw / 2 - s * 0.04, hy - s * 0.02); ctx.stroke();
    ctx.fillStyle = mix(t.wood, t.cloth, 0.3);
    roundRect(ctx, hw * 0.24, hy - s * 0.12, s * 0.14, s * 0.12, s * 0.01); fillStroke(ctx, mix(t.wood, t.cloth, 0.3), ink, lw * 0.8);
  },
});

family({
  id: 'medieval.water.longship', name: 'Longship', category: 'medieval',
  tags: ['ship', 'longship', 'drakkar', 'viking', 'dragon'], size: 72, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const sail = tint || t.flag;
    ctx.fillStyle = withAlpha(t.water, 0.5); roundRect(ctx, -s * 0.48, s * 0.14, s * 0.96, s * 0.22, s * 0.02); ctx.fill();
    ripples(ctx, 0, s * 0.26, s * 0.76, withAlpha(t.waterLight, 0.6), TLW(s), rng);
    pole(ctx, 0, -s * 0.34, s * 0.04, t.woodDark, lw);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.7;
    ctx.beginPath(); ctx.moveTo(-s * 0.2, -s * 0.26); ctx.lineTo(s * 0.2, -s * 0.26); ctx.stroke();
    const sw = s * 0.4, st = -s * 0.26, sh = s * 0.26;
    roundRect(ctx, -sw / 2, st, sw, sh, s * 0.01);
    fillStroke(ctx, sail, ink, lw);
    ctx.save();
    ctx.beginPath(); ctx.rect(-sw / 2, st, sw, sh); ctx.clip();
    ctx.fillStyle = withAlpha(t.white, 0.85);
    for (let i = 0; i < 5; i += 2) ctx.fillRect(-sw / 2 + (sw / 5) * i, st, sw / 5, sh);
    ctx.restore();
    pole(ctx, 0, -s * 0.34, -s * 0.42, t.woodDark, lw * 0.6);
    pennant(ctx, 0, -s * 0.42, s * 0.11, s * 0.05, t.flag, ink, lw * 0.5, 1);
    const hy = s * 0.08, hw = s * 0.74;
    ctx.beginPath();
    ctx.moveTo(-hw / 2, hy);
    ctx.quadraticCurveTo(-hw / 2 - s * 0.06, hy - s * 0.06, -hw / 2 - s * 0.02, hy - s * 0.14);
    ctx.quadraticCurveTo(-hw / 2 + s * 0.02, hy - s * 0.1, -hw / 2 + s * 0.06, hy - s * 0.02);
    ctx.lineTo(hw / 2 - s * 0.06, hy - s * 0.02);
    ctx.quadraticCurveTo(hw / 2 - s * 0.02, hy - s * 0.1, hw / 2 + s * 0.02, hy - s * 0.14);
    ctx.quadraticCurveTo(hw / 2 + s * 0.06, hy - s * 0.06, hw / 2, hy);
    ctx.quadraticCurveTo(0, hy + s * 0.16, -hw / 2, hy); ctx.closePath();
    fillStroke(ctx, t.wood, ink, lw);
    ctx.fillStyle = withAlpha(t.woodDark, 0.4); ctx.fillRect(-hw * 0.42, hy + s * 0.04, hw * 0.84, s * 0.06);
    for (let i = 0; i < 6; i++) {
      const cx = -hw * 0.32 + i * hw * 0.13;
      ctx.beginPath(); ctx.arc(cx, hy - s * 0.04, s * 0.04, 0, Math.PI * 2);
      fillStroke(ctx, i % 2 ? t.flag : t.metal, ink, lw * 0.6);
      ctx.strokeStyle = withAlpha(ink, 0.5); ctx.lineWidth = TLW(s);
      ctx.beginPath(); ctx.moveTo(cx - s * 0.025, hy - s * 0.04); ctx.lineTo(cx + s * 0.025, hy - s * 0.04); ctx.moveTo(cx, hy - s * 0.065); ctx.lineTo(cx, hy - s * 0.015); ctx.stroke();
    }
    ctx.fillStyle = darken(t.wood, 0.3);
    ctx.beginPath();
    ctx.moveTo(-hw / 2 - s * 0.02, hy - s * 0.14);
    ctx.quadraticCurveTo(-hw / 2 - s * 0.1, hy - s * 0.16, -hw / 2 - s * 0.08, hy - s * 0.24);
    ctx.lineTo(-hw / 2 - s * 0.02, hy - s * 0.18); ctx.closePath();
    fillStroke(ctx, darken(t.wood, 0.3), ink, lw * 0.7);
  },
});

family({
  id: 'medieval.water.rowboat', name: 'Rowboat', category: 'medieval',
  tags: ['boat', 'rowboat', 'dinghy', 'oars', 'small'], size: 48, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wood = tint || t.wood;
    ctx.fillStyle = withAlpha(t.water, 0.5); roundRect(ctx, -s * 0.44, s * 0.0, s * 0.88, s * 0.32, s * 0.03); ctx.fill();
    ripples(ctx, 0, s * 0.22, s * 0.6, withAlpha(t.waterLight, 0.6), TLW(s), rng);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(side * s * 0.06, s * 0.04); ctx.lineTo(side * s * 0.32, -s * 0.06); ctx.stroke();
      ctx.fillStyle = t.wood;
      ctx.beginPath(); ctx.ellipse(side * s * 0.34, -s * 0.07, s * 0.05, s * 0.02, side * 0.5, 0, Math.PI * 2); ctx.fill();
    }
    const hy = s * 0.06, hw = s * 0.5;
    ctx.beginPath();
    ctx.moveTo(-hw / 2, hy); ctx.lineTo(hw / 2, hy);
    ctx.quadraticCurveTo(hw / 2 - s * 0.04, hy + s * 0.14, 0, hy + s * 0.15);
    ctx.quadraticCurveTo(-hw / 2 + s * 0.04, hy + s * 0.14, -hw / 2, hy); ctx.closePath();
    fillStroke(ctx, wood, ink, lw);
    ctx.fillStyle = withAlpha(t.woodDark, 0.45); ctx.fillRect(-hw / 2, hy, hw, s * 0.04);
    ctx.strokeStyle = withAlpha(t.woodDark, 0.5); ctx.lineWidth = TLW(s);
    for (const py of [hy + s * 0.06, hy + s * 0.1]) { ctx.beginPath(); ctx.moveTo(-hw * 0.4, py); ctx.lineTo(hw * 0.4, py); ctx.stroke(); }
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.8;
    ctx.beginPath(); ctx.moveTo(-hw * 0.2, hy); ctx.lineTo(-hw * 0.2, hy + s * 0.04); ctx.moveTo(hw * 0.2, hy); ctx.lineTo(hw * 0.2, hy + s * 0.04); ctx.stroke();
  },
});

family({
  id: 'medieval.water.fishing', name: 'Fishing Boat', category: 'medieval',
  tags: ['boat', 'fishing', 'net', 'sail', 'small'], size: 56, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const sail = tint || t.cloth;
    ctx.fillStyle = withAlpha(t.water, 0.5); roundRect(ctx, -s * 0.44, s * 0.06, s * 0.88, s * 0.3, s * 0.03); ctx.fill();
    ripples(ctx, 0, s * 0.26, s * 0.66, withAlpha(t.waterLight, 0.6), TLW(s), rng);
    pole(ctx, -s * 0.08, -s * 0.32, s * 0.1, t.woodDark, lw);
    ctx.beginPath();
    ctx.moveTo(-s * 0.08, -s * 0.3); ctx.lineTo(-s * 0.08, s * 0.04);
    ctx.lineTo(s * 0.2, -s * 0.02); ctx.quadraticCurveTo(s * 0.04, -s * 0.18, -s * 0.08, -s * 0.3); ctx.closePath();
    fillStroke(ctx, sail, ink, lw);
    ctx.fillStyle = withAlpha(ink, 0.12);
    ctx.beginPath(); ctx.moveTo(-s * 0.08, -s * 0.14); ctx.lineTo(s * 0.13, -s * 0.04); ctx.lineTo(-s * 0.08, s * 0.02); ctx.closePath(); ctx.fill();
    const hy = s * 0.12, hw = s * 0.56;
    ctx.beginPath();
    ctx.moveTo(-hw / 2 - s * 0.02, hy - s * 0.04); ctx.lineTo(hw / 2 + s * 0.04, hy - s * 0.06);
    ctx.quadraticCurveTo(hw / 2 - s * 0.02, hy + s * 0.14, 0, hy + s * 0.15);
    ctx.quadraticCurveTo(-hw / 2 + s * 0.02, hy + s * 0.13, -hw / 2 - s * 0.02, hy - s * 0.04); ctx.closePath();
    fillStroke(ctx, t.wood, ink, lw);
    ctx.fillStyle = withAlpha(t.woodDark, 0.45); ctx.fillRect(-hw / 2, hy + s * 0.06, hw, s * 0.06);
    ctx.strokeStyle = withAlpha(t.cloth, 0.8); ctx.lineWidth = TLW(s);
    for (let i = 0; i < 5; i++) {
      const nx = hw * 0.16 + i * s * 0.05;
      ctx.beginPath(); ctx.moveTo(nx, hy - s * 0.04); ctx.lineTo(nx + s * 0.04, hy + s * 0.1); ctx.stroke();
    }
    ctx.strokeStyle = withAlpha(t.cloth, 0.8);
    for (let j = 0; j < 3; j++) { const ny = hy + j * s * 0.04; ctx.beginPath(); ctx.moveTo(hw * 0.16, ny); ctx.lineTo(hw * 0.44, ny + s * 0.04); ctx.stroke(); }
  },
});

// ============================================================================
// RUINS
// ============================================================================
family({
  id: 'medieval.ruin.arch', name: 'Broken Arch', category: 'medieval',
  tags: ['ruin', 'arch', 'broken', 'stone', 'ancient'], size: 60, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const stone = tint || t.stone;
    groundShadow(ctx, 0, s * 0.36, s * 0.34, s * 0.06);
    for (let i = 0; i < 5; i++) { const rx = jitter(rng, s * 0.32), ry = s * 0.3 + jitter(rng, s * 0.03); blob(ctx, rx, ry, rand(rng, s * 0.025, s * 0.05), rng, 0.4, 7); fillStroke(ctx, i % 2 ? darken(stone, 0.1) : stone, ink, lw * 0.6); }
    const pw = s * 0.12, pTop = -s * 0.1, pBot = s * 0.3;
    roundRect(ctx, -s * 0.3, pTop, pw, pBot - pTop, s * 0.01);
    fillStroke(ctx, stone, ink, lw);
    ctx.beginPath();
    ctx.moveTo(s * 0.18, pBot); ctx.lineTo(s * 0.18, pTop + s * 0.06);
    ctx.lineTo(s * 0.18 + pw * 0.5, pTop); ctx.lineTo(s * 0.18 + pw, pTop + s * 0.1);
    ctx.lineTo(s * 0.18 + pw, pBot); ctx.closePath();
    fillStroke(ctx, stone, ink, lw);
    ctx.beginPath();
    ctx.moveTo(-s * 0.3 + pw, pTop + s * 0.02);
    ctx.quadraticCurveTo(-s * 0.06, pTop - s * 0.22, s * 0.1, pTop - s * 0.02);
    ctx.lineTo(s * 0.06, pTop + s * 0.06);
    ctx.quadraticCurveTo(-s * 0.06, pTop - s * 0.1, -s * 0.3 + pw, pTop + s * 0.1); ctx.closePath();
    fillStroke(ctx, stone, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4);
    ctx.fillRect(-s * 0.3 + pw * 0.6, pTop, pw * 0.4, pBot - pTop);
    courses(ctx, -s * 0.3, pTop + s * 0.06, pw, pBot - pTop - s * 0.06, 4, withAlpha(t.stoneDark, 0.4), TLW(s));
    ctx.strokeStyle = t.grassDark; ctx.lineWidth = lw * 0.6; ctx.lineCap = 'round';
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(s * 0.18 + pw * 0.5 + i * s * 0.02, pTop + s * 0.01); ctx.lineTo(s * 0.18 + pw * 0.5 + i * s * 0.03, pTop - s * 0.05); ctx.stroke(); }
  },
});

family({
  id: 'medieval.ruin.column', name: 'Fallen Column', category: 'medieval',
  tags: ['ruin', 'column', 'pillar', 'fallen', 'classical'], size: 60, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const stone = tint || t.stoneLight;
    groundShadow(ctx, 0, s * 0.34, s * 0.4, s * 0.06);
    roundRect(ctx, -s * 0.4, s * 0.24, s * 0.8, s * 0.07, s * 0.01);
    fillStroke(ctx, t.stone, ink, lw * 0.9);
    const stubW = s * 0.14, stubH = s * 0.22, stubX = -s * 0.32;
    roundRect(ctx, stubX, s * 0.02, stubW, stubH, s * 0.01);
    fillStroke(ctx, stone, ink, lw);
    ctx.strokeStyle = withAlpha(t.stoneDark, 0.5); ctx.lineWidth = TLW(s);
    for (let i = 1; i < 4; i++) { const fx = stubX + (stubW / 4) * i; ctx.beginPath(); ctx.moveTo(fx, s * 0.04); ctx.lineTo(fx, s * 0.24); ctx.stroke(); }
    roundRect(ctx, stubX - s * 0.02, s * 0.0, stubW + s * 0.04, s * 0.04, s * 0.005);
    fillStroke(ctx, lighten(stone, 0.05), ink, lw * 0.8);
    const segY = s * 0.18, segW = s * 0.16, segH = s * 0.1;
    for (let i = 0; i < 3; i++) {
      const sx = -s * 0.06 + i * (segW + s * 0.01);
      roundRect(ctx, sx, segY, segW, segH, s * 0.02);
      fillStroke(ctx, i % 2 ? darken(stone, 0.06) : stone, ink, lw);
      ctx.fillStyle = withAlpha(t.stoneDark, 0.45);
      ctx.beginPath(); ctx.ellipse(sx + segW, segY + segH / 2, s * 0.02, segH / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = darken(t.stone, 0.4);
      ctx.beginPath(); ctx.ellipse(sx, segY + segH / 2, s * 0.018, segH / 2 - s * 0.005, 0, 0, Math.PI * 2); ctx.fill();
    }
    roundRect(ctx, s * 0.28, segY - s * 0.01, s * 0.07, segH + s * 0.02, s * 0.01);
    fillStroke(ctx, lighten(stone, 0.05), ink, lw * 0.9);
  },
});

family({
  id: 'medieval.ruin.wall', name: 'Ruined Wall', category: 'medieval',
  tags: ['ruin', 'wall', 'crumbling', 'stone', 'broken'], size: 60, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const stone = tint || t.stone;
    groundShadow(ctx, 0, s * 0.34, s * 0.42, s * 0.06);
    const segs = [
      { x: -s * 0.38, w: s * 0.22, h: s * 0.34 },
      { x: -s * 0.12, w: s * 0.18, h: s * 0.2 },
      { x: s * 0.12, w: s * 0.26, h: s * 0.4 },
    ];
    const baseY = s * 0.28;
    for (const sg of segs) {
      const topY = baseY - sg.h;
      ctx.beginPath();
      ctx.moveTo(sg.x, baseY); ctx.lineTo(sg.x, topY + s * 0.03);
      const steps = 4;
      for (let i = 0; i <= steps; i++) { const xx = sg.x + (sg.w * i) / steps, yy = topY + jitter(rng, s * 0.035) + (i % 2 ? s * 0.03 : 0); ctx.lineTo(xx, yy); }
      ctx.lineTo(sg.x + sg.w, baseY); ctx.closePath();
      fillStroke(ctx, stone, ink, lw);
      ctx.fillStyle = withAlpha(t.stoneDark, 0.4); ctx.fillRect(sg.x + sg.w * 0.62, topY, sg.w * 0.38, sg.h);
      courses(ctx, sg.x, topY + s * 0.04, sg.w, sg.h - s * 0.04, Math.max(2, Math.round(sg.h / s * 12)), withAlpha(t.stoneDark, 0.35), TLW(s));
      ctx.strokeStyle = withAlpha(t.stoneDark, 0.3); ctx.lineWidth = TLW(s);
      ctx.beginPath(); ctx.moveTo(sg.x + sg.w * 0.5, topY + s * 0.06); ctx.lineTo(sg.x + sg.w * 0.5, baseY); ctx.stroke();
    }
    for (let i = 0; i < 4; i++) { const rx = jitter(rng, s * 0.36), ry = baseY + jitter(rng, s * 0.03); blob(ctx, rx, ry, rand(rng, s * 0.02, s * 0.04), rng, 0.4, 6); fillStroke(ctx, i % 2 ? darken(stone, 0.1) : stone, ink, lw * 0.6); }
  },
});

// ============================================================================
// MEGALITHS
// ============================================================================
family({
  id: 'medieval.megalith.henge', name: 'Stone Henge', category: 'medieval',
  tags: ['henge', 'standing stones', 'circle', 'megalith', 'druid'], size: 80, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const stone = tint || t.stone;
    groundShadow(ctx, 0, s * 0.36, s * 0.44, s * 0.08);
    const cx = 0, cy = s * 0.12, rx = s * 0.36, ry = s * 0.12;
    const trilithons = 4;
    for (let i = 0; i < trilithons; i++) {
      const frac = i / (trilithons - 1);
      const ang = Math.PI - frac * Math.PI;
      const px = cx + Math.cos(ang) * rx, py = cy - Math.sin(ang) * ry;
      const depth = (py - (cy - ry)) / (2 * ry);
      const scale = 0.7 + depth * 0.5;
      const upW = s * 0.05 * scale, upH = s * 0.28 * scale, gap = s * 0.07 * scale;
      const shade = lighten(stone, (1 - depth) * 0.06);
      for (const dx of [-gap, gap]) {
        ctx.beginPath();
        ctx.moveTo(px + dx - upW / 2, py); ctx.lineTo(px + dx - upW / 2 + jitter(rng, s * 0.004), py - upH);
        ctx.lineTo(px + dx + upW / 2 + jitter(rng, s * 0.004), py - upH); ctx.lineTo(px + dx + upW / 2, py); ctx.closePath();
        fillStroke(ctx, shade, ink, lw * 0.9);
        ctx.fillStyle = withAlpha(t.stoneDark, 0.35); ctx.fillRect(px + dx + upW * 0.1, py - upH, upW * 0.4, upH);
      }
      ctx.beginPath();
      ctx.rect(px - gap - upW * 0.7, py - upH - s * 0.05 * scale, gap * 2 + upW * 1.4, s * 0.05 * scale);
      fillStroke(ctx, shade, ink, lw * 0.9);
    }
    ctx.fillStyle = withAlpha(t.grassDark, 0.4);
    ctx.beginPath(); ctx.ellipse(cx, cy, rx * 0.7, ry * 0.6, 0, 0, Math.PI * 2); ctx.fill();
  },
});

family({
  id: 'medieval.megalith.dolmen', name: 'Dolmen', category: 'medieval',
  tags: ['dolmen', 'megalith', 'tomb', 'capstone', 'ancient'], size: 56, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const stone = tint || t.stone;
    groundShadow(ctx, 0, s * 0.34, s * 0.34, s * 0.07);
    const baseY = s * 0.26, upH = s * 0.32;
    for (const ux of [-s * 0.2, 0.0, s * 0.2]) {
      const uw = s * 0.1 + jitter(rng, s * 0.01);
      ctx.beginPath();
      ctx.moveTo(ux - uw / 2, baseY); ctx.lineTo(ux - uw / 2 + jitter(rng, s * 0.01), baseY - upH);
      ctx.lineTo(ux + uw / 2 + jitter(rng, s * 0.01), baseY - upH); ctx.lineTo(ux + uw / 2, baseY); ctx.closePath();
      fillStroke(ctx, ux > 0 ? darken(stone, 0.08) : stone, ink, lw);
      ctx.fillStyle = withAlpha(t.stoneDark, 0.35); ctx.fillRect(ux + uw * 0.1, baseY - upH, uw * 0.4, upH);
    }
    const capY = baseY - upH;
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, capY + s * 0.02);
    ctx.lineTo(-s * 0.26, capY - s * 0.08);
    ctx.lineTo(s * 0.28, capY - s * 0.06);
    ctx.lineTo(s * 0.32, capY + s * 0.04);
    ctx.lineTo(s * 0.24, capY + s * 0.08);
    ctx.lineTo(-s * 0.24, capY + s * 0.07); ctx.closePath();
    fillStroke(ctx, lighten(stone, 0.04), ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.3);
    ctx.beginPath(); ctx.moveTo(-s * 0.24, capY + s * 0.07); ctx.lineTo(s * 0.24, capY + s * 0.08); ctx.lineTo(s * 0.32, capY + s * 0.04); ctx.lineTo(s * 0.28, capY + s * 0.0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(t.stone, 0.5); ctx.beginPath(); ctx.ellipse(0, baseY - upH * 0.4, s * 0.06, upH * 0.4, 0, 0, Math.PI * 2); ctx.fill();
  },
});

family({
  id: 'medieval.megalith.obelisk', name: 'Obelisk', category: 'medieval',
  tags: ['obelisk', 'monument', 'monolith', 'pillar', 'ancient'], size: 64, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const stone = tint || t.stone;
    groundShadow(ctx, 0, s * 0.38, s * 0.24, s * 0.06);
    for (let i = 0; i < 2; i++) {
      const bw = s * (0.3 - i * 0.07), by = s * 0.3 - i * s * 0.05;
      roundRect(ctx, -bw / 2, by, bw, s * 0.05, s * 0.006);
      fillStroke(ctx, i % 2 ? stone : darken(stone, 0.06), ink, lw * 0.9);
    }
    const baseW = s * 0.16, topW = s * 0.06, bottom = s * 0.26, neckY = -s * 0.22;
    ctx.beginPath();
    ctx.moveTo(-baseW / 2, bottom); ctx.lineTo(-topW / 2, neckY);
    ctx.lineTo(topW / 2, neckY); ctx.lineTo(baseW / 2, bottom); ctx.closePath();
    fillStroke(ctx, stone, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4);
    ctx.beginPath();
    ctx.moveTo(topW * 0.1, neckY); ctx.lineTo(topW / 2, neckY); ctx.lineTo(baseW / 2, bottom); ctx.lineTo(baseW * 0.12, bottom); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-topW / 2 - s * 0.005, neckY); ctx.lineTo(0, neckY - s * 0.1); ctx.lineTo(topW / 2 + s * 0.005, neckY); ctx.closePath();
    fillStroke(ctx, tint ? darken(stone, 0.1) : t.gold, ink, lw * 0.8);
    ctx.strokeStyle = withAlpha(t.stoneDark, 0.4); ctx.lineWidth = TLW(s);
    for (let i = 0; i < 3; i++) { const yy = neckY + s * 0.06 + i * s * 0.08; ctx.beginPath(); ctx.moveTo(-s * 0.02, yy); ctx.lineTo(s * 0.02, yy); ctx.moveTo(0, yy - s * 0.02); ctx.lineTo(0, yy + s * 0.02); ctx.stroke(); }
  },
});

family({
  id: 'medieval.megalith.standing', name: 'Standing Stone', category: 'medieval',
  tags: ['menhir', 'standing stone', 'megalith', 'monolith', 'rune'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const stone = tint || t.stoneDark;
    groundShadow(ctx, 0, s * 0.34, s * 0.24, s * 0.06);
    const baseY = s * 0.28, h = rand(rng, s * 0.5, s * 0.62), w = s * 0.2;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + jitter(rng, s * 0.02), baseY);
    ctx.lineTo(-w / 2 + jitter(rng, s * 0.02), baseY - h * 0.5);
    ctx.lineTo(-w * 0.3 + jitter(rng, s * 0.02), baseY - h);
    ctx.lineTo(w * 0.34 + jitter(rng, s * 0.02), baseY - h * 0.92);
    ctx.lineTo(w / 2 + jitter(rng, s * 0.02), baseY - h * 0.4);
    ctx.lineTo(w / 2 + jitter(rng, s * 0.02), baseY); ctx.closePath();
    fillStroke(ctx, stone, ink, lw);
    ctx.fillStyle = withAlpha(darken(t.stone, 0.3), 0.4); ctx.fillRect(w * 0.08, baseY - h * 0.9, w * 0.4, h * 0.9);
    ctx.fillStyle = withAlpha(t.stoneLight, 0.4); ctx.fillRect(-w * 0.42, baseY - h * 0.85, w * 0.12, h * 0.8);
    const carved = chance(rng, 0.55);
    if (carved) {
      ctx.strokeStyle = withAlpha(ink, 0.5); ctx.lineWidth = TLW(s) * 1.2;
      ctx.beginPath(); ctx.arc(-w * 0.04, baseY - h * 0.55, s * 0.04, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-w * 0.04, baseY - h * 0.42); ctx.lineTo(-w * 0.04, baseY - h * 0.2); ctx.moveTo(-w * 0.1, baseY - h * 0.32); ctx.lineTo(w * 0.02, baseY - h * 0.32); ctx.stroke();
    } else {
      ctx.strokeStyle = withAlpha(t.grassDark, 0.6); ctx.lineWidth = TLW(s) * 1.4;
      ctx.beginPath(); ctx.moveTo(-w * 0.2, baseY - h * 0.1); ctx.quadraticCurveTo(-w * 0.3, baseY - h * 0.3, -w * 0.24, baseY - h * 0.4); ctx.stroke();
    }
  },
});

// ============================================================================
// INDUSTRY
// ============================================================================
family({
  id: 'medieval.industry.mine', name: 'Mine Entrance', category: 'medieval',
  tags: ['mine', 'entrance', 'tunnel', 'cart', 'rails'], size: 60, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const rock = tint || t.stoneDark;
    groundShadow(ctx, 0, s * 0.38, s * 0.4, s * 0.07);
    blob(ctx, 0, -s * 0.04, s * 0.4, rng, 0.16, 16);
    fillStroke(ctx, rock, ink, lw);
    ctx.fillStyle = withAlpha(t.stoneDark, 0.4);
    blob(ctx, s * 0.12, -s * 0.02, s * 0.3, rng, 0.18, 14); ctx.fill();
    ctx.strokeStyle = withAlpha(ink, 0.3); ctx.lineWidth = TLW(s);
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-s * 0.3 + i * s * 0.16, -s * 0.3); ctx.lineTo(-s * 0.26 + i * s * 0.16, -s * 0.12); ctx.stroke(); }
    ctx.fillStyle = darken(t.ink, 0.0);
    arch(ctx, 0, s * 0.0, s * 0.26, s * 0.28); fillStroke(ctx, mix(t.ink, t.stoneDark, 0.2), ink, lw);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.4; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-s * 0.15, s * 0.28); ctx.lineTo(-s * 0.13, s * 0.02);
    ctx.moveTo(s * 0.15, s * 0.28); ctx.lineTo(s * 0.13, s * 0.02);
    ctx.moveTo(-s * 0.16, s * 0.0); ctx.lineTo(s * 0.16, s * 0.0); ctx.stroke();
    ctx.strokeStyle = t.rail || t.metalDark; ctx.lineWidth = lw * 0.7;
    ctx.beginPath();
    ctx.moveTo(-s * 0.06, s * 0.18); ctx.lineTo(-s * 0.1, s * 0.38);
    ctx.moveTo(s * 0.06, s * 0.18); ctx.lineTo(s * 0.1, s * 0.38); ctx.stroke();
    for (let i = 0; i < 3; i++) { const yy = s * 0.2 + i * s * 0.07; ctx.beginPath(); ctx.moveTo(-s * 0.07 - i * s * 0.012, yy); ctx.lineTo(s * 0.07 + i * s * 0.012, yy); ctx.stroke(); }
    const ccx = s * 0.0, ccy = s * 0.3;
    ctx.fillStyle = t.wood; roundRect(ctx, ccx - s * 0.08, ccy - s * 0.06, s * 0.16, s * 0.08, s * 0.01); fillStroke(ctx, t.wood, ink, lw * 0.8);
    ctx.fillStyle = withAlpha(t.gold, 0.8);
    ctx.beginPath(); ctx.moveTo(ccx - s * 0.05, ccy - s * 0.06); ctx.lineTo(ccx + s * 0.05, ccy - s * 0.06); ctx.lineTo(ccx + s * 0.03, ccy - s * 0.1); ctx.lineTo(ccx - s * 0.03, ccy - s * 0.1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = t.metalDark;
    for (const wx of [ccx - s * 0.05, ccx + s * 0.05]) { ctx.beginPath(); ctx.arc(wx, ccy + s * 0.03, s * 0.025, 0, Math.PI * 2); ctx.fill(); }
  },
});

family({
  id: 'medieval.industry.lumber', name: 'Lumber Camp', category: 'medieval',
  tags: ['lumber', 'logging', 'timber', 'logs', 'axe'], size: 64, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wood = tint || t.wood;
    groundShadow(ctx, 0, s * 0.38, s * 0.42, s * 0.07);
    const stackX = s * 0.16, stackY = s * 0.22;
    const rows = [3, 2, 1];
    for (let r = 0; r < rows.length; r++) {
      for (let c = 0; c < rows[r]; c++) {
        const lx = stackX - (rows[r] - 1) * s * 0.075 + c * s * 0.15;
        const ly = stackY - r * s * 0.13;
        ctx.beginPath(); ctx.ellipse(lx, ly, s * 0.075, s * 0.06, 0, 0, Math.PI * 2);
        fillStroke(ctx, wood, ink, lw * 0.9);
        ctx.fillStyle = lighten(wood, 0.12); ctx.beginPath(); ctx.arc(lx, ly, s * 0.045, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = withAlpha(t.woodDark, 0.6); ctx.lineWidth = TLW(s);
        for (let k = 1; k <= 2; k++) { ctx.beginPath(); ctx.arc(lx, ly, s * 0.045 * (k / 3), 0, Math.PI * 2); ctx.stroke(); }
      }
    }
    const stumpX = -s * 0.26, stumpY = s * 0.16;
    roundRect(ctx, stumpX - s * 0.08, stumpY, s * 0.16, s * 0.14, s * 0.01);
    fillStroke(ctx, t.woodDark, ink, lw);
    ctx.beginPath(); ctx.ellipse(stumpX, stumpY, s * 0.08, s * 0.035, 0, 0, Math.PI * 2);
    fillStroke(ctx, lighten(wood, 0.1), ink, lw * 0.8);
    ctx.strokeStyle = withAlpha(t.woodDark, 0.6); ctx.lineWidth = TLW(s);
    ctx.beginPath(); ctx.ellipse(stumpX, stumpY, s * 0.04, s * 0.018, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(stumpX - s * 0.02, stumpY - s * 0.02); ctx.lineTo(stumpX - s * 0.16, stumpY - s * 0.24); ctx.stroke();
    ctx.fillStyle = t.metal;
    ctx.save();
    ctx.translate(stumpX - s * 0.16, stumpY - s * 0.24); ctx.rotate(-0.6);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.04); ctx.quadraticCurveTo(s * 0.08, -s * 0.06, s * 0.09, 0);
    ctx.quadraticCurveTo(s * 0.08, s * 0.06, 0, s * 0.04); ctx.closePath();
    fillStroke(ctx, t.metal, ink, lw * 0.7);
    ctx.restore();
  },
});

// ============================================================================
// JUSTICE
// ============================================================================
family({
  id: 'medieval.justice.gallows', name: 'Gallows', category: 'medieval',
  tags: ['gallows', 'gibbet', 'execution', 'rope', 'wood'], size: 60, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wood = tint || t.woodDark;
    groundShadow(ctx, 0, s * 0.38, s * 0.3, s * 0.06);
    const platY = s * 0.3, platW = s * 0.5;
    roundRect(ctx, -platW / 2, platY - s * 0.05, platW, s * 0.06, s * 0.01);
    fillStroke(ctx, t.wood, ink, lw);
    planks(ctx, -platW / 2, platY - s * 0.05, platW, s * 0.06, 6, withAlpha(t.woodDark, 0.5), TLW(s));
    const postX = -s * 0.18, postTop = -s * 0.34, beamEnd = s * 0.16;
    ctx.fillStyle = wood;
    roundRect(ctx, postX - s * 0.03, postTop, s * 0.06, platY - s * 0.05 - postTop, s * 0.01);
    fillStroke(ctx, wood, ink, lw);
    roundRect(ctx, postX - s * 0.03, postTop, beamEnd - postX + s * 0.03, s * 0.06, s * 0.01);
    fillStroke(ctx, wood, ink, lw);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(postX + s * 0.03, postTop + s * 0.08); ctx.lineTo(postX + s * 0.1, postTop + s * 0.08); ctx.lineTo(postX + s * 0.03, postTop + s * 0.15); ctx.closePath(); ctx.stroke();
    const ropeX = beamEnd - s * 0.04;
    ctx.strokeStyle = mix(t.cloth, t.woodDark, 0.4); ctx.lineWidth = lw * 0.8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(ropeX, postTop + s * 0.06); ctx.lineTo(ropeX, postTop + s * 0.22); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(ropeX, postTop + s * 0.26, s * 0.035, s * 0.05, 0, 0, Math.PI * 2);
    fillStroke(ctx, null, mix(t.cloth, t.woodDark, 0.4), lw * 0.8);
    ctx.strokeStyle = withAlpha(t.woodDark, 0.6); ctx.lineWidth = lw * 0.8;
    ctx.beginPath(); ctx.moveTo(postX + s * 0.03, postTop + s * 0.12); ctx.lineTo(postX + s * 0.14, postTop + s * 0.01); ctx.stroke();
  },
});

// ============================================================================
// HERALDRY
// ============================================================================
family({
  id: 'medieval.heraldry.banner', name: 'Banner Pole', category: 'medieval',
  tags: ['banner', 'flag', 'standard', 'pole', 'heraldry'], size: 64, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const cloth = tint || t.flag;
    groundShadow(ctx, 0, s * 0.38, s * 0.14, s * 0.05);
    const poleX = -s * 0.04, top = -s * 0.36, bot = s * 0.36;
    pole(ctx, poleX, top, bot, t.woodDark, lw * 1.2);
    ctx.fillStyle = t.gold; ctx.beginPath(); ctx.arc(poleX, top, lw * 1.4, 0, Math.PI * 2); fillStroke(ctx, t.gold, ink, lw * 0.6);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.8;
    ctx.beginPath(); ctx.moveTo(poleX, top + s * 0.04); ctx.lineTo(poleX + s * 0.2, top + s * 0.04); ctx.stroke();
    const bw = s * 0.2, bh = s * 0.4, bx = poleX + s * 0.02;
    ctx.beginPath();
    ctx.moveTo(bx, top + s * 0.04); ctx.lineTo(bx + bw, top + s * 0.04);
    ctx.lineTo(bx + bw, top + s * 0.04 + bh);
    ctx.lineTo(bx + bw * 0.5, top + s * 0.04 + bh - s * 0.06);
    ctx.lineTo(bx, top + s * 0.04 + bh); ctx.closePath();
    fillStroke(ctx, cloth, ink, lw);
    ctx.fillStyle = withAlpha(ink, 0.16);
    ctx.beginPath();
    ctx.moveTo(bx + bw * 0.5, top + s * 0.04); ctx.lineTo(bx + bw, top + s * 0.04);
    ctx.lineTo(bx + bw, top + s * 0.04 + bh); ctx.lineTo(bx + bw * 0.5, top + s * 0.04 + bh - s * 0.06); ctx.closePath(); ctx.fill();
    const charge = randInt(rng, 0, 2);
    ctx.fillStyle = tint ? lighten(cloth, 0.35) : t.gold;
    const ccx = bx + bw / 2, ccy = top + s * 0.04 + bh * 0.42;
    if (charge === 0) { star(ctx, ccx, ccy, 5, s * 0.05, s * 0.022); fillStroke(ctx, tint ? lighten(cloth, 0.35) : t.gold, ink, lw * 0.6); }
    else if (charge === 1) {
      ctx.beginPath();
      ctx.moveTo(ccx, ccy - s * 0.05); ctx.quadraticCurveTo(ccx + s * 0.06, ccy - s * 0.02, ccx, ccy + s * 0.06);
      ctx.quadraticCurveTo(ccx - s * 0.06, ccy - s * 0.02, ccx, ccy - s * 0.05); ctx.closePath();
      fillStroke(ctx, tint ? lighten(cloth, 0.35) : t.gold, ink, lw * 0.6);
    } else {
      ctx.fillRect(ccx - s * 0.012, ccy - s * 0.05, s * 0.024, s * 0.1);
      ctx.fillRect(ccx - s * 0.04, ccy - s * 0.02, s * 0.08, s * 0.024);
    }
  },
});

family({
  id: 'medieval.heraldry.shield', name: 'Heraldic Shield', category: 'medieval',
  tags: ['shield', 'coat of arms', 'heraldry', 'crest', 'arms'], size: 56, variants: 6,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const field = tint || t.flag;
    groundShadow(ctx, 0, s * 0.4, s * 0.2, s * 0.04);
    const w = s * 0.56, top = -s * 0.34, h = s * 0.7;
    const shieldPath = () => {
      ctx.beginPath();
      ctx.moveTo(-w / 2, top);
      ctx.lineTo(w / 2, top);
      ctx.lineTo(w / 2, top + h * 0.45);
      ctx.quadraticCurveTo(w / 2, top + h * 0.82, 0, top + h);
      ctx.quadraticCurveTo(-w / 2, top + h * 0.82, -w / 2, top + h * 0.45);
      ctx.closePath();
    };
    shieldPath();
    fillStroke(ctx, field, ink, lw * 1.3);
    ctx.save();
    shieldPath(); ctx.clip();
    const division = randInt(rng, 0, 3);
    const second = t.metal === field ? t.gold : (tint ? lighten(field, 0.3) : t.metal);
    ctx.fillStyle = mix(field, t.ink, 0.18);
    if (division === 0) { ctx.fillStyle = second; ctx.fillRect(0, top - s * 0.05, w, h + s * 0.1); }
    else if (division === 1) { ctx.fillStyle = second; ctx.fillRect(-w, top + h * 0.42, w * 2, h); }
    else if (division === 2) { ctx.fillStyle = second; ctx.beginPath(); ctx.moveTo(-w, top - s * 0.05); ctx.lineTo(w, top + h); ctx.lineTo(w, top - s * 0.05); ctx.closePath(); ctx.fill(); }
    else {
      ctx.fillStyle = second;
      ctx.beginPath(); ctx.moveTo(0, top - s * 0.05); ctx.lineTo(w, top + h); ctx.lineTo(-w, top + h); ctx.closePath(); ctx.fill();
    }
    const charge = randInt(rng, 0, 2);
    ctx.fillStyle = withAlpha(t.gold, 0.95);
    if (charge === 0) { star(ctx, 0, top + h * 0.42, 5, s * 0.08, s * 0.035); ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.7; ctx.stroke(); }
    else if (charge === 1) {
      ctx.beginPath();
      ctx.moveTo(0, top + h * 0.22);
      ctx.bezierCurveTo(s * 0.14, top + h * 0.2, s * 0.12, top + h * 0.5, 0, top + h * 0.62);
      ctx.bezierCurveTo(-s * 0.12, top + h * 0.5, -s * 0.14, top + h * 0.2, 0, top + h * 0.22); ctx.closePath();
      ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.7; ctx.stroke();
    } else {
      for (let i = 0; i < 3; i++) { const cy = top + h * 0.3 + i * h * 0.18; ctx.beginPath(); ctx.arc(0, cy, s * 0.04, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.6; ctx.stroke(); }
    }
    ctx.restore();
    ctx.fillStyle = withAlpha(t.white, 0.25);
    ctx.beginPath(); ctx.moveTo(-w / 2, top); ctx.lineTo(-w * 0.32, top); ctx.lineTo(-w * 0.32, top + h * 0.4); ctx.quadraticCurveTo(-w / 2, top + h * 0.5, -w / 2, top + h * 0.45); ctx.closePath(); ctx.fill();
  },
});

// ============================================================================
// SIEGE ENGINES
// ============================================================================
family({
  id: 'medieval.siege.catapult', name: 'Catapult', category: 'medieval',
  tags: ['siege', 'catapult', 'mangonel', 'war', 'engine'], size: 64, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wood = tint || t.wood;
    groundShadow(ctx, 0, s * 0.36, s * 0.4, s * 0.06);
    wheel(ctx, -s * 0.24, s * 0.24, s * 0.1, t, lw * 0.9);
    wheel(ctx, s * 0.24, s * 0.24, s * 0.1, t, lw * 0.9);
    ctx.fillStyle = wood;
    roundRect(ctx, -s * 0.3, s * 0.12, s * 0.6, s * 0.07, s * 0.01); fillStroke(ctx, wood, ink, lw);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.4; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, s * 0.12); ctx.lineTo(-s * 0.04, -s * 0.06);
    ctx.moveTo(s * 0.04, s * 0.12); ctx.lineTo(-s * 0.04, -s * 0.06); ctx.stroke();
    ctx.strokeStyle = wood; ctx.lineWidth = lw * 1.6;
    ctx.beginPath(); ctx.moveTo(s * 0.22, s * 0.16); ctx.lineTo(-s * 0.24, -s * 0.18); ctx.stroke();
    ctx.fillStyle = darken(t.wood, 0.2);
    ctx.beginPath(); ctx.arc(-s * 0.24, -s * 0.18, s * 0.05, 0, Math.PI * 2); fillStroke(ctx, darken(t.wood, 0.2), ink, lw * 0.8);
    ctx.fillStyle = t.stoneDark;
    ctx.beginPath(); ctx.arc(-s * 0.27, -s * 0.24, s * 0.04, 0, Math.PI * 2); fillStroke(ctx, t.stoneDark, ink, lw * 0.7);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(-s * 0.04, -s * 0.06); ctx.lineTo(s * 0.04, -s * 0.02); ctx.stroke();
    ctx.fillStyle = withAlpha(t.danger, 0.8);
    ctx.beginPath(); ctx.arc(-s * 0.04, -s * 0.07, s * 0.02, 0, Math.PI * 2); ctx.fill();
  },
});

family({
  id: 'medieval.siege.trebuchet', name: 'Trebuchet', category: 'medieval',
  tags: ['siege', 'trebuchet', 'counterweight', 'war', 'engine'], size: 72, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wood = tint || t.wood;
    groundShadow(ctx, 0, s * 0.38, s * 0.42, s * 0.06);
    ctx.fillStyle = wood; roundRect(ctx, -s * 0.34, s * 0.22, s * 0.68, s * 0.06, s * 0.01); fillStroke(ctx, wood, ink, lw);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.5; ctx.lineCap = 'round';
    const pivX = 0, pivY = -s * 0.06;
    ctx.beginPath();
    ctx.moveTo(-s * 0.18, s * 0.22); ctx.lineTo(pivX, pivY);
    ctx.moveTo(s * 0.18, s * 0.22); ctx.lineTo(pivX, pivY);
    ctx.moveTo(-s * 0.14, s * 0.1); ctx.lineTo(s * 0.14, s * 0.1); ctx.stroke();
    ctx.strokeStyle = wood; ctx.lineWidth = lw * 1.7;
    const shortX = -s * 0.16, shortY = s * 0.06, longX = s * 0.3, longY = -s * 0.32;
    ctx.beginPath(); ctx.moveTo(shortX, shortY); ctx.lineTo(longX, longY); ctx.stroke();
    ctx.fillStyle = t.metalDark;
    ctx.beginPath(); ctx.arc(pivX, pivY, s * 0.03, 0, Math.PI * 2); fillStroke(ctx, t.metalDark, ink, lw * 0.7);
    ctx.fillStyle = darken(t.stone, 0.3);
    roundRect(ctx, shortX - s * 0.06, shortY, s * 0.12, s * 0.12, s * 0.015); fillStroke(ctx, darken(t.stone, 0.3), ink, lw * 0.9);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.7;
    ctx.beginPath(); ctx.moveTo(shortX - s * 0.04, shortY); ctx.lineTo(shortX, shortY - s * 0.02); ctx.lineTo(shortX + s * 0.04, shortY); ctx.stroke();
    ctx.strokeStyle = mix(t.cloth, t.woodDark, 0.3); ctx.lineWidth = lw * 0.7;
    ctx.beginPath(); ctx.moveTo(longX, longY); ctx.lineTo(longX + s * 0.02, longY + s * 0.14); ctx.stroke();
    ctx.fillStyle = t.stoneDark;
    ctx.beginPath(); ctx.arc(longX + s * 0.02, longY + s * 0.16, s * 0.03, 0, Math.PI * 2); fillStroke(ctx, t.stoneDark, ink, lw * 0.6);
  },
});

family({
  id: 'medieval.siege.ballista', name: 'Ballista', category: 'medieval',
  tags: ['siege', 'ballista', 'bolt', 'crossbow', 'war'], size: 60, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const wood = tint || t.wood;
    groundShadow(ctx, 0, s * 0.36, s * 0.38, s * 0.06);
    wheel(ctx, -s * 0.2, s * 0.24, s * 0.09, t, lw * 0.85);
    wheel(ctx, s * 0.2, s * 0.24, s * 0.09, t, lw * 0.85);
    ctx.fillStyle = wood; roundRect(ctx, -s * 0.26, s * 0.1, s * 0.52, s * 0.07, s * 0.01); fillStroke(ctx, wood, ink, lw);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, s * 0.1); ctx.lineTo(0, -s * 0.04); ctx.stroke();
    ctx.fillStyle = wood;
    roundRect(ctx, -s * 0.04, -s * 0.12, s * 0.4, s * 0.06, s * 0.01); fillStroke(ctx, wood, ink, lw * 0.9);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.24); ctx.quadraticCurveTo(s * 0.04, -s * 0.09, 0, -s * 0.0);
    ctx.moveTo(0, -s * 0.24); ctx.quadraticCurveTo(-s * 0.04, -s * 0.09, 0, -s * 0.0); ctx.stroke();
    ctx.fillStyle = t.metalDark;
    for (const ax of [-s * 0.02, s * 0.02]) { ctx.beginPath(); ctx.arc(ax, -s * 0.22, s * 0.022, 0, Math.PI * 2); fillStroke(ctx, t.metalDark, ink, lw * 0.6); }
    ctx.strokeStyle = withAlpha(t.cloth, 0.9); ctx.lineWidth = lw * 0.6;
    ctx.beginPath(); ctx.moveTo(-s * 0.02, -s * 0.22); ctx.lineTo(s * 0.0, -s * 0.1); ctx.lineTo(s * 0.02, -s * 0.22); ctx.stroke();
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.1; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(s * 0.0, -s * 0.09); ctx.lineTo(s * 0.32, -s * 0.09); ctx.stroke();
    ctx.fillStyle = t.metal;
    ctx.beginPath(); ctx.moveTo(s * 0.32, -s * 0.11); ctx.lineTo(s * 0.4, -s * 0.09); ctx.lineTo(s * 0.32, -s * 0.07); ctx.closePath(); fillStroke(ctx, t.metal, ink, lw * 0.6);
  },
});

family({
  id: 'medieval.siege.ram', name: 'Battering Ram', category: 'medieval',
  tags: ['siege', 'ram', 'battering', 'penthouse', 'war'], size: 64, variants: 4,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const roof = tint || t.roof;
    groundShadow(ctx, 0, s * 0.36, s * 0.42, s * 0.06);
    wheel(ctx, -s * 0.22, s * 0.26, s * 0.08, t, lw * 0.8);
    wheel(ctx, s * 0.22, s * 0.26, s * 0.08, t, lw * 0.8);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.2; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-s * 0.26, s * 0.18); ctx.lineTo(-s * 0.26, -s * 0.04);
    ctx.moveTo(s * 0.26, s * 0.18); ctx.lineTo(s * 0.26, -s * 0.04); ctx.stroke();
    ctx.strokeStyle = mix(t.metal, t.woodDark, 0.3); ctx.lineWidth = lw * 1.6;
    const ramY = s * 0.06;
    ctx.beginPath(); ctx.moveTo(-s * 0.34, ramY); ctx.lineTo(s * 0.36, ramY); ctx.stroke();
    ctx.fillStyle = t.metal;
    ctx.beginPath();
    ctx.moveTo(s * 0.3, ramY - s * 0.05); ctx.lineTo(s * 0.42, ramY); ctx.lineTo(s * 0.3, ramY + s * 0.05); ctx.closePath();
    fillStroke(ctx, t.metal, ink, lw * 0.7);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.7;
    for (const cx of [-s * 0.12, s * 0.12]) { ctx.beginPath(); ctx.moveTo(cx, -s * 0.04); ctx.lineTo(cx, ramY - s * 0.02); ctx.stroke(); }
    ctx.beginPath();
    ctx.moveTo(-s * 0.36, -s * 0.04); ctx.lineTo(-s * 0.26, -s * 0.2); ctx.lineTo(s * 0.26, -s * 0.2); ctx.lineTo(s * 0.36, -s * 0.04); ctx.closePath();
    fillStroke(ctx, roof, ink, lw);
    ctx.fillStyle = withAlpha(t.roofDark, 0.4);
    ctx.beginPath(); ctx.moveTo(0, -s * 0.2); ctx.lineTo(s * 0.26, -s * 0.2); ctx.lineTo(s * 0.36, -s * 0.04); ctx.lineTo(0, -s * 0.04); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = withAlpha(ink, 0.3); ctx.lineWidth = TLW(s);
    for (let i = 1; i < 5; i++) { const px = -s * 0.34 + i * s * 0.135; ctx.beginPath(); ctx.moveTo(px, -s * 0.2 + Math.abs(px) * 0.5); ctx.lineTo(px, -s * 0.04); ctx.stroke(); }
  },
});

// ============================================================================
// CARTS
// ============================================================================
family({
  id: 'medieval.cart.hay', name: 'Hay Cart', category: 'medieval',
  tags: ['cart', 'hay', 'wagon', 'farm', 'harvest'], size: 56, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const hayc = tint || mix(t.sand, t.gold, 0.4);
    groundShadow(ctx, 0, s * 0.36, s * 0.4, s * 0.06);
    wheel(ctx, -s * 0.18, s * 0.22, s * 0.12, t, lw);
    wheel(ctx, s * 0.18, s * 0.22, s * 0.12, t, lw);
    ctx.fillStyle = t.wood;
    roundRect(ctx, -s * 0.3, s * 0.04, s * 0.6, s * 0.12, s * 0.01); fillStroke(ctx, t.wood, ink, lw);
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 0.7;
    for (let i = 0; i < 5; i++) { const px = -s * 0.26 + i * s * 0.13; ctx.beginPath(); ctx.moveTo(px, s * 0.04); ctx.lineTo(px, s * 0.16); ctx.stroke(); }
    blob(ctx, 0, -s * 0.08, s * 0.3, rng, 0.14, 16);
    fillStroke(ctx, hayc, ink, lw);
    ctx.fillStyle = withAlpha(darken(hayc, 0.18), 0.6);
    blob(ctx, s * 0.1, -s * 0.04, s * 0.2, rng, 0.16, 12); ctx.fill();
    ctx.strokeStyle = withAlpha(t.woodDark, 0.45); ctx.lineWidth = TLW(s);
    for (let i = 0; i < 8; i++) { const a = rand(rng, 0, Math.PI * 2), r = rand(rng, s * 0.1, s * 0.26); const hx = Math.cos(a) * r, hy = -s * 0.08 + Math.sin(a) * r * 0.6; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + jitter(rng, s * 0.04), hy - rand(rng, s * 0.02, s * 0.06)); ctx.stroke(); }
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.1; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s * 0.3, s * 0.12); ctx.lineTo(-s * 0.44, s * 0.08); ctx.stroke();
  },
});

family({
  id: 'medieval.cart.ox', name: 'Ox Cart', category: 'medieval',
  tags: ['cart', 'ox', 'wagon', 'oxen', 'transport'], size: 64, variants: 5,
  draw(ctx, { size, rng, theme, tint }) {
    const s = size, t = theme.sprite, ink = t.ink, lw = LW(s);
    const cartc = tint || t.wood;
    groundShadow(ctx, 0, s * 0.38, s * 0.44, s * 0.06);
    wheel(ctx, s * 0.04, s * 0.22, s * 0.12, t, lw);
    ctx.fillStyle = cartc;
    roundRect(ctx, -s * 0.16, s * 0.0, s * 0.42, s * 0.14, s * 0.01); fillStroke(ctx, cartc, ink, lw);
    planks(ctx, -s * 0.16, s * 0.0, s * 0.42, s * 0.14, 6, withAlpha(t.woodDark, 0.45), TLW(s));
    ctx.fillStyle = withAlpha(t.sand, 0.85);
    blob(ctx, s * 0.06, -s * 0.04, s * 0.16, rng, 0.2, 10); ctx.fill();
    ctx.strokeStyle = t.woodDark; ctx.lineWidth = lw * 1.1; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s * 0.16, s * 0.12); ctx.lineTo(-s * 0.4, s * 0.14); ctx.stroke();
    const oxX = -s * 0.36, oxY = s * 0.06;
    ctx.fillStyle = mix(t.woodDark, t.cloth, 0.3);
    roundRect(ctx, oxX - s * 0.16, oxY - s * 0.05, s * 0.22, s * 0.13, s * 0.04); fillStroke(ctx, mix(t.woodDark, t.cloth, 0.3), ink, lw);
    ctx.strokeStyle = ink; ctx.lineWidth = lw * 1.2; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(oxX - s * 0.12, oxY + s * 0.08); ctx.lineTo(oxX - s * 0.12, oxY + s * 0.2);
    ctx.moveTo(oxX - s * 0.02, oxY + s * 0.08); ctx.lineTo(oxX - s * 0.02, oxY + s * 0.2);
    ctx.moveTo(oxX + s * 0.04, oxY + s * 0.06); ctx.lineTo(oxX + s * 0.05, oxY + s * 0.2); ctx.stroke();
    ctx.fillStyle = mix(t.woodDark, t.cloth, 0.3);
    ctx.beginPath();
    ctx.moveTo(oxX - s * 0.16, oxY - s * 0.04);
    ctx.quadraticCurveTo(oxX - s * 0.26, oxY - s * 0.06, oxX - s * 0.26, oxY + s * 0.04);
    ctx.quadraticCurveTo(oxX - s * 0.24, oxY + s * 0.08, oxX - s * 0.18, oxY + s * 0.07);
    ctx.lineTo(oxX - s * 0.16, oxY + s * 0.04); ctx.closePath();
    fillStroke(ctx, mix(t.woodDark, t.cloth, 0.3), ink, lw * 0.9);
    ctx.strokeStyle = t.white; ctx.lineWidth = lw * 1.1;
    ctx.beginPath();
    ctx.moveTo(oxX - s * 0.24, oxY - s * 0.05); ctx.quadraticCurveTo(oxX - s * 0.3, oxY - s * 0.1, oxX - s * 0.26, oxY - s * 0.12);
    ctx.moveTo(oxX - s * 0.21, oxY - s * 0.06); ctx.quadraticCurveTo(oxX - s * 0.18, oxY - s * 0.12, oxX - s * 0.21, oxY - s * 0.14); ctx.stroke();
    ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(oxX - s * 0.22, oxY - s * 0.01, lw * 0.7, 0, Math.PI * 2); ctx.fill();
  },
});
