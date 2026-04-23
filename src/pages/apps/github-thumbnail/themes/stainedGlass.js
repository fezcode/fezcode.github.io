import { wrapText } from '../utils';

/*
 * STAINED_GLASS — a Gothic rose window set into a stone arch. Each piece of
 * glass has a true jewel-tone gradient (bright near the light source, dark at
 * the edges) plus a small white specular pop, so they read as glass, not flat
 * polygons. Leading is drawn twice (dark body + inner highlight) for bevel.
 */

const hexRgb = (hex) => {
  const c = (hex || '').replace('#', '');
  const f = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
  return [parseInt(f.slice(0, 2), 16) || 0, parseInt(f.slice(2, 4), 16) || 0, parseInt(f.slice(4, 6), 16) || 0];
};
const mix = (a, b, t) => {
  const [r1, g1, b1] = hexRgb(a);
  const [r2, g2, b2] = hexRgb(b);
  const m = (x, y) => Math.round(x + (y - x) * t);
  return `rgb(${m(r1, r2)},${m(g1, g2)},${m(b1, b2)})`;
};

const leaded = (ctx, scale, width = 3.5) => {
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#0a0805';
  ctx.lineWidth = width * scale;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(180,160,110,0.35)';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();
  ctx.restore();
};

// Fill the currently-active path with a jewel-glass gradient centered at (cx,cy)
// and a specular hotspot.
const fillJewel = (ctx, cx, cy, rOuter, baseColor, hotspot) => {
  const gg = ctx.createRadialGradient(
    cx - rOuter * 0.3, cy - rOuter * 0.45, 0,
    cx, cy, rOuter,
  );
  gg.addColorStop(0, mix(baseColor, '#ffffff', 0.55));
  gg.addColorStop(0.55, baseColor);
  gg.addColorStop(1, mix(baseColor, '#000000', 0.55));
  ctx.fillStyle = gg;
  ctx.fill();

  if (hotspot) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    const hg = ctx.createRadialGradient(
      cx - rOuter * 0.35, cy - rOuter * 0.5, 0,
      cx - rOuter * 0.35, cy - rOuter * 0.5, rOuter * 0.5,
    );
    hg.addColorStop(0, '#ffffff');
    hg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hg;
    ctx.fill();
    ctx.restore();
  }
};

// Gothic arch path (pointed arch = two circular segments meeting at apex)
const archPath = (ctx, x, y, w, h) => {
  const aStart = y + h * 0.42;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, aStart);
  // left arc
  ctx.quadraticCurveTo(x, y, x + w / 2, y);
  // right arc
  ctx.quadraticCurveTo(x + w, y, x + w, aStart);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
};

// Cusped foil path — a multi-lobed flower shape for tracery.
const foilPath = (ctx, cx, cy, r, lobes, phase = 0) => {
  const steps = 360;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const wave = Math.cos(t * lobes + phase);
    const rr = r * (0.82 + 0.18 * wave);
    const x = cx + Math.cos(t) * rr;
    const y = cy + Math.sin(t) * rr;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
};

export const stainedGlass = (ctx, width, height, scale, data) => {
  const {
    primaryColor, secondaryColor, bgColor,
    repoOwner, repoName, description, language, stars, forks, supportUrl,
    showPattern,
  } = data;

  // --- Cathedral interior darkness ---
  const wall = ctx.createRadialGradient(width * 0.5, height * 0.45, width * 0.05, width * 0.5, height * 0.5, width * 0.85);
  wall.addColorStop(0, '#1c1510');
  wall.addColorStop(1, '#05030a');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, width, height);

  // Stone masonry pattern
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#2a1f16';
    ctx.lineWidth = 1 * scale;
    const sw = 120 * scale;
    const sh = 38 * scale;
    for (let y = 0, row = 0; y < height; y += sh, row++) {
      const off = (row % 2) * sw / 2;
      for (let x = -sw; x < width + sw; x += sw) {
        // Block outline
        ctx.strokeRect(x + off, y, sw, sh);
        // Crack detail in some blocks
        if (((x + y + row) >> 2) % 5 === 0) {
          ctx.beginPath();
          ctx.moveTo(x + off + 4 * scale, y + sh * 0.3);
          ctx.lineTo(x + off + sw - 8 * scale, y + sh * 0.7);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // Noise
    ctx.save();
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 600; i++) {
      const x = (i * 137) % width;
      const y = (i * 211) % height;
      ctx.fillStyle = i % 2 ? '#000' : '#554433';
      ctx.fillRect(x, y, scale, scale);
    }
    ctx.restore();
  }

  // --- Window region: tall pointed arch ---
  const fX = width * 0.07;
  const fY = height * 0.05;
  const fW = width * 0.86;
  const fH = height * 0.9;

  // Outer stone relief (a thick arch-shaped gradient)
  ctx.save();
  archPath(ctx, fX - 8 * scale, fY - 8 * scale, fW + 16 * scale, fH + 16 * scale);
  const stoneGrad = ctx.createLinearGradient(0, fY, 0, fY + fH);
  stoneGrad.addColorStop(0, '#7a634b');
  stoneGrad.addColorStop(0.5, '#4b3a2a');
  stoneGrad.addColorStop(1, '#2a1e14');
  ctx.fillStyle = stoneGrad;
  ctx.fill();
  // Inner shadow
  archPath(ctx, fX + 4 * scale, fY + 4 * scale, fW - 8 * scale, fH - 8 * scale);
  ctx.fillStyle = '#18100a';
  ctx.fill();
  ctx.restore();

  // Carved chisel marks around stone
  ctx.save();
  archPath(ctx, fX - 8 * scale, fY - 8 * scale, fW + 16 * scale, fH + 16 * scale);
  ctx.clip();
  archPath(ctx, fX + 4 * scale, fY + 4 * scale, fW - 8 * scale, fH - 8 * scale);
  ctx.strokeStyle = '#1a1008';
  ctx.lineWidth = 0.6 * scale;
  ctx.stroke();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = '#2a1a0a';
  for (let i = 0; i < 120; i++) {
    const t = i / 120;
    const cx = fX + fW / 2;
    // angle around the arch
    const ang = Math.PI + t * Math.PI * 2;
    const rad = fW * 0.5 + 6 * scale;
    const x = cx + Math.cos(ang) * rad;
    const y = fY + fH * 0.5 + Math.sin(ang) * (fH * 0.52);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(ang) * 10 * scale, y + Math.sin(ang) * 10 * scale);
    ctx.stroke();
  }
  ctx.restore();

  // --- Glass area inset ---
  const gi = 22 * scale;
  const gX = fX + gi;
  const gY = fY + gi;
  const gW = fW - gi * 2;
  const gH = fH - gi * 2;

  ctx.save();
  archPath(ctx, gX, gY, gW, gH);
  ctx.clip();

  // Distant sky seen through window — subtle so contrast reads
  const sky = ctx.createLinearGradient(0, gY, 0, gY + gH);
  sky.addColorStop(0, mix(bgColor, '#ffffff', 0.15));
  sky.addColorStop(1, bgColor);
  ctx.fillStyle = sky;
  ctx.fillRect(gX, gY, gW, gH);

  // --- Rose window centered in upper portion ---
  const rcx = gX + gW / 2;
  const rcy = gY + gH * 0.3;
  const rR = Math.min(gW * 0.38, gH * 0.3);

  // Ring 1 — outer 16-foil ring of small pointed panels
  const outerCount = 16;
  for (let i = 0; i < outerCount; i++) {
    const a0 = (i / outerCount) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / outerCount) * Math.PI * 2 - Math.PI / 2;
    const rIn = rR * 1.2;
    const rOut = rR * 1.6;
    ctx.beginPath();
    ctx.moveTo(rcx + Math.cos(a0) * rIn, rcy + Math.sin(a0) * rIn);
    ctx.lineTo(rcx + Math.cos(a0) * rOut, rcy + Math.sin(a0) * rOut);
    const midA = (a0 + a1) / 2;
    ctx.quadraticCurveTo(
      rcx + Math.cos(midA) * rOut * 1.06,
      rcy + Math.sin(midA) * rOut * 1.06,
      rcx + Math.cos(a1) * rOut,
      rcy + Math.sin(a1) * rOut,
    );
    ctx.lineTo(rcx + Math.cos(a1) * rIn, rcy + Math.sin(a1) * rIn);
    ctx.quadraticCurveTo(
      rcx + Math.cos(midA) * rIn * 0.98,
      rcy + Math.sin(midA) * rIn * 0.98,
      rcx + Math.cos(a0) * rIn,
      rcy + Math.sin(a0) * rIn,
    );
    ctx.closePath();
    const panelMid = {
      x: rcx + Math.cos(midA) * ((rIn + rOut) / 2),
      y: rcy + Math.sin(midA) * ((rIn + rOut) / 2),
    };
    const base = i % 2 === 0 ? primaryColor : mix(primaryColor, '#ffffff', 0.25);
    fillJewel(ctx, panelMid.x, panelMid.y, (rOut - rIn) * 0.9, base, true);
    leaded(ctx, scale, 2.4);
  }

  // Ring 2 — 8 cusped trefoil panels
  const midCount = 8;
  for (let i = 0; i < midCount; i++) {
    const a0 = (i / midCount) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / midCount) * Math.PI * 2 - Math.PI / 2;
    const rIn = rR * 0.62;
    const rOut = rR * 1.18;
    // Panel trapezoid with cusped outer edge
    ctx.beginPath();
    ctx.moveTo(rcx + Math.cos(a0) * rIn, rcy + Math.sin(a0) * rIn);
    ctx.lineTo(rcx + Math.cos(a0) * rOut, rcy + Math.sin(a0) * rOut);
    const midA = (a0 + a1) / 2;
    // cusp dip
    ctx.quadraticCurveTo(
      rcx + Math.cos(midA) * rOut * 0.88,
      rcy + Math.sin(midA) * rOut * 0.88,
      rcx + Math.cos(a1) * rOut,
      rcy + Math.sin(a1) * rOut,
    );
    ctx.lineTo(rcx + Math.cos(a1) * rIn, rcy + Math.sin(a1) * rIn);
    ctx.closePath();
    const mid = {
      x: rcx + Math.cos(midA) * ((rIn + rOut) / 2),
      y: rcy + Math.sin(midA) * ((rIn + rOut) / 2),
    };
    const base = i % 2 === 0 ? secondaryColor : mix(secondaryColor, '#ffe08a', 0.25);
    fillJewel(ctx, mid.x, mid.y, (rOut - rIn) * 0.9, base, true);
    leaded(ctx, scale, 2.6);

    // Small trefoil inside each panel (dark leading forms the flower shape)
    ctx.save();
    const tcx = mid.x;
    const tcy = mid.y;
    const tR = (rOut - rIn) * 0.28;
    ctx.strokeStyle = '#0a0805';
    ctx.lineWidth = 1.6 * scale;
    for (let k = 0; k < 3; k++) {
      const aa = midA + k * (Math.PI * 2 / 3);
      const px = tcx + Math.cos(aa) * tR * 0.6;
      const py = tcy + Math.sin(aa) * tR * 0.6;
      ctx.beginPath();
      ctx.arc(px, py, tR * 0.7, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Ring 3 — 6 inner petals around center
  const inCount = 6;
  for (let i = 0; i < inCount; i++) {
    const a0 = (i / inCount) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / inCount) * Math.PI * 2 - Math.PI / 2;
    const rIn = rR * 0.22;
    const rOut = rR * 0.6;
    ctx.beginPath();
    ctx.moveTo(rcx + Math.cos(a0) * rIn, rcy + Math.sin(a0) * rIn);
    ctx.lineTo(rcx + Math.cos(a0) * rOut, rcy + Math.sin(a0) * rOut);
    const midA = (a0 + a1) / 2;
    ctx.quadraticCurveTo(
      rcx + Math.cos(midA) * rOut * 1.04,
      rcy + Math.sin(midA) * rOut * 1.04,
      rcx + Math.cos(a1) * rOut,
      rcy + Math.sin(a1) * rOut,
    );
    ctx.lineTo(rcx + Math.cos(a1) * rIn, rcy + Math.sin(a1) * rIn);
    ctx.closePath();
    const mid = {
      x: rcx + Math.cos(midA) * ((rIn + rOut) / 2),
      y: rcy + Math.sin(midA) * ((rIn + rOut) / 2),
    };
    const base = i % 2 === 0 ? mix(primaryColor, '#ffe08a', 0.1) : mix(secondaryColor, '#ffffff', 0.2);
    fillJewel(ctx, mid.x, mid.y, (rOut - rIn) * 0.8, base, true);
    leaded(ctx, scale, 2.2);
  }

  // Center boss — six-foil with gold glass
  foilPath(ctx, rcx, rcy, rR * 0.28, 6);
  fillJewel(ctx, rcx, rcy, rR * 0.3, '#f0c75a', true);
  leaded(ctx, scale, 3);

  // Center initial
  ctx.save();
  ctx.fillStyle = '#1a1008';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 italic ${rR * 0.35}px "Playfair Display", "EB Garamond", "Times New Roman", serif`;
  ctx.fillText((repoName || 'X')[0].toUpperCase(), rcx, rcy + 2 * scale);
  ctx.restore();

  // Outer pointed ring boundary
  ctx.save();
  ctx.beginPath();
  ctx.arc(rcx, rcy, rR * 1.6, 0, Math.PI * 2);
  ctx.strokeStyle = '#0a0805';
  ctx.lineWidth = 3.5 * scale;
  ctx.stroke();
  ctx.restore();

  // --- Lower lancets (3 tall panels beneath the rose) ---
  const lTop = rcy + rR * 1.75;
  const lBot = gY + gH - 14 * scale;
  const lW = gW * 0.92;
  const lX = rcx - lW / 2;
  const lancets = 3;
  const colW = lW / lancets;

  const drawLancet = (idx) => {
    const x0 = lX + idx * colW + 8 * scale;
    const w0 = colW - 16 * scale;
    const y0 = lTop;
    const y1 = lBot;
    const apex = y0 + 40 * scale;

    ctx.save();
    // Clip to a tall arch for the lancet
    ctx.beginPath();
    ctx.moveTo(x0, apex);
    ctx.quadraticCurveTo(x0 + w0 / 2, y0 - 6 * scale, x0 + w0, apex);
    ctx.lineTo(x0 + w0, y1);
    ctx.lineTo(x0, y1);
    ctx.closePath();
    ctx.clip();

    // Base tint
    const tint = idx === 0 ? primaryColor : idx === 1 ? secondaryColor : primaryColor;
    const bgg = ctx.createLinearGradient(0, apex, 0, y1);
    bgg.addColorStop(0, mix(tint, '#ffffff', 0.3));
    bgg.addColorStop(1, mix(tint, '#000000', 0.3));
    ctx.fillStyle = bgg;
    ctx.fillRect(x0 - 6, apex - 40 * scale, w0 + 12, y1 - apex + 50 * scale);

    // Quarrel (diamond) grid — each diamond a small jewel
    const dw = 32 * scale;
    const dh = 22 * scale;
    for (let yy = apex - dh; yy < y1 + dh; yy += dh) {
      for (let xx = x0 - dw; xx < x0 + w0 + dw; xx += dw) {
        const cx = xx + dw / 2;
        const cy = yy + dh / 2;
        ctx.beginPath();
        ctx.moveTo(cx, yy);
        ctx.lineTo(xx + dw, cy);
        ctx.lineTo(cx, yy + dh);
        ctx.lineTo(xx, cy);
        ctx.closePath();
        const pick = (Math.floor((xx + yy * 13) / 10) + idx) % 4;
        const base = pick === 0 ? mix(tint, '#ffffff', 0.22)
          : pick === 1 ? tint
          : pick === 2 ? mix(tint, '#ffe08a', 0.22)
          : mix(tint, '#000000', 0.25);
        fillJewel(ctx, cx, cy, dw * 0.55, base, false);
        // Tiny stroke
        ctx.strokeStyle = '#0a0805';
        ctx.lineWidth = 1 * scale;
        ctx.stroke();
      }
    }

    // A saint/figure oval in the upper portion — rendered as a typographic emblem
    const fCx = x0 + w0 / 2;
    const fCy = apex + 60 * scale;
    const fR = Math.min(w0 * 0.36, 70 * scale);
    // Oval panel with rays
    ctx.save();
    ctx.translate(fCx, fCy);
    // Rays behind
    for (let j = 0; j < 24; j++) {
      ctx.rotate((Math.PI * 2) / 24);
      ctx.fillStyle = j % 2 === 0 ? '#f0c75a' : '#8b6218';
      ctx.fillRect(-1.5 * scale, -fR * 1.18, 3 * scale, fR * 0.2);
    }
    ctx.restore();

    ctx.beginPath();
    ctx.ellipse(fCx, fCy, fR * 0.85, fR, 0, 0, Math.PI * 2);
    fillJewel(ctx, fCx, fCy, fR, '#f0dc8a', true);
    leaded(ctx, scale, 3);

    // Emblem glyph per lancet
    ctx.save();
    ctx.fillStyle = '#1a1008';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${fR * 0.95}px "EB Garamond", "Times New Roman", serif`;
    const glyph = idx === 0 ? '✦' : idx === 1 ? '✠' : '❧';
    ctx.fillText(glyph, fCx, fCy + 2 * scale);
    ctx.restore();

    // Bottom inscribed rectangle with label/value
    const panY = y1 - 72 * scale;
    const panH = 58 * scale;
    ctx.beginPath();
    ctx.rect(x0 + 10 * scale, panY, w0 - 20 * scale, panH);
    fillJewel(ctx, x0 + w0 / 2, panY + panH / 2, w0 * 0.5, mix(tint, '#000000', 0.45), false);
    leaded(ctx, scale, 2.5);

    ctx.save();
    ctx.fillStyle = '#f4e5bb';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labels = ['STELLÆ', 'LINGUA', 'FURCÆ'];
    const values = [stars || '—', (language || '—').toUpperCase(), forks || '—'];
    ctx.font = `italic 500 ${10 * scale}px "EB Garamond", serif`;
    ctx.globalAlpha = 0.85;
    ctx.fillText(labels[idx], x0 + w0 / 2, panY + 14 * scale);
    ctx.globalAlpha = 1;
    ctx.font = `900 ${22 * scale}px "Playfair Display", "EB Garamond", serif`;
    let vs = 22 * scale;
    const maxW = w0 - 40 * scale;
    while (ctx.measureText(String(values[idx])).width > maxW && vs > 10 * scale) {
      vs -= 0.5;
      ctx.font = `900 ${vs}px "Playfair Display", "EB Garamond", serif`;
    }
    ctx.fillText(String(values[idx]), x0 + w0 / 2, panY + 36 * scale);
    ctx.restore();

    ctx.restore();

    // Lancet stone frame (outside the clipped jewel fills)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, apex);
    ctx.quadraticCurveTo(x0 + w0 / 2, y0 - 6 * scale, x0 + w0, apex);
    ctx.lineTo(x0 + w0, y1);
    ctx.lineTo(x0, y1);
    ctx.closePath();
    ctx.strokeStyle = '#0a0805';
    ctx.lineWidth = 3.5 * scale;
    ctx.stroke();
    ctx.restore();
  };
  for (let i = 0; i < lancets; i++) drawLancet(i);

  // Central mullion glyph column between lancets
  ctx.save();
  ctx.fillStyle = '#0a0805';
  ctx.fillRect(lX + colW - 3 * scale, lTop, 6 * scale, lBot - lTop);
  ctx.fillRect(lX + colW * 2 - 3 * scale, lTop, 6 * scale, lBot - lTop);
  ctx.restore();

  ctx.restore(); // end window clip

  // --- Arch stone frame outline ---
  ctx.save();
  archPath(ctx, gX, gY, gW, gH);
  ctx.strokeStyle = 'rgba(120,100,70,0.7)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();
  ctx.restore();

  // --- Inscription plaque above the arch apex (on stone border) ---
  ctx.save();
  ctx.fillStyle = '#e8c97a';
  ctx.font = `italic 600 ${13 * scale}px "EB Garamond", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    '⚜  DE DOMO · ' + (repoOwner || '').toUpperCase() + ' ·  ⚜',
    width / 2,
    fY - 2 * scale,
  );
  ctx.restore();

  // --- Stone plinth below arch with repo name + description ---
  ctx.save();
  const plY = fY + fH + 6 * scale;
  const plH = 28 * scale;
  const pg = ctx.createLinearGradient(0, plY, 0, plY + plH);
  pg.addColorStop(0, '#3a2c1c');
  pg.addColorStop(1, '#1a120a');
  ctx.fillStyle = pg;
  ctx.fillRect(fX, plY, fW, plH);
  ctx.strokeStyle = '#0a0805';
  ctx.lineWidth = 0.8 * scale;
  ctx.strokeRect(fX, plY, fW, plH);

  ctx.fillStyle = '#f2d78a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 italic ${16 * scale}px "Playfair Display", "EB Garamond", serif`;
  ctx.fillText('· ' + repoName.toUpperCase() + ' ·', width / 2, plY + plH / 2);
  ctx.restore();

  // Description far-bottom, subtle
  ctx.save();
  ctx.fillStyle = 'rgba(220,200,150,0.65)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = `italic 500 ${12 * scale}px "EB Garamond", serif`;
  wrapText(ctx, '❝ ' + description + ' ❞', width * 0.12, fY + fH + 42 * scale, width * 0.76, 14 * scale);
  ctx.restore();

  // Support URL bottom right
  if (supportUrl) {
    ctx.save();
    ctx.fillStyle = 'rgba(232,201,122,0.5)';
    ctx.font = `600 ${10 * scale}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('✠ ' + supportUrl, width - 16 * scale, height - 8 * scale);
    ctx.restore();
  }
};
