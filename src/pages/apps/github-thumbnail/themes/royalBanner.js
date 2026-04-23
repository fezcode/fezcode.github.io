import { wrapText } from '../utils';

/*
 * ROYAL_BANNER — a draped ceremonial flag hanging on a marble wall.
 * Folds are built from many overlapping transparent light/shadow bands,
 * not naive sine waves. The embroidered emblem is typographic; the rope
 * and tassels are drawn with many thin strokes for density.
 */

const seedRng = (seed) => {
  let h = 0x85ebca6b;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

const hexRgb = (hex) => {
  const c = (hex || '').replace('#', '');
  const f = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
  return [parseInt(f.slice(0, 2), 16) || 0, parseInt(f.slice(2, 4), 16) || 0, parseInt(f.slice(4, 6), 16) || 0];
};
const rgba = (hex, a) => {
  const [r, g, b] = hexRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};
const shade = (hex, k) => {
  const [r, g, b] = hexRgb(hex);
  const f = Math.max(0, 1 + k);
  const m = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${m(r)},${m(g)},${m(b)})`;
};

export const royalBanner = (ctx, width, height, scale, data) => {
  const {
    primaryColor, secondaryColor, bgColor,
    repoOwner, repoName, description, language, stars, forks, supportUrl,
    showPattern,
  } = data;

  const rng = seedRng(`${repoOwner}${repoName}`);

  // --- Wall: dark textured slate with subtle vignette ---
  const wall = ctx.createRadialGradient(width * 0.5, height * 0.35, width * 0.1, width * 0.5, height * 0.5, width * 0.9);
  wall.addColorStop(0, '#1f1b28');
  wall.addColorStop(1, '#070409');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, width, height);

  // Wall noise + faint plaster veins
  if (showPattern) {
    ctx.save();
    for (let i = 0; i < 900; i++) {
      const x = rng() * width;
      const y = rng() * height;
      ctx.globalAlpha = 0.04 + rng() * 0.06;
      ctx.fillStyle = rng() > 0.5 ? '#ffffff' : '#000000';
      ctx.fillRect(x, y, scale, scale);
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#c0b7a0';
    ctx.lineWidth = 0.5 * scale;
    for (let i = 0; i < 22; i++) {
      const x = rng() * width;
      const y = rng() * height;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(
        x + rng() * 80 * scale, y + (rng() - 0.5) * 60 * scale,
        x + rng() * 160 * scale - 80 * scale, y + (rng() - 0.5) * 120 * scale,
        x + rng() * 240 * scale - 120 * scale, y + (rng() - 0.5) * 200 * scale,
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Cross pole with iron brackets ---
  const poleY = 58 * scale;
  ctx.save();
  // Pole shadow on wall
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(90 * scale, poleY + 10 * scale, width - 180 * scale, 18 * scale);
  ctx.filter = 'blur(6px)';
  ctx.fillRect(90 * scale, poleY + 10 * scale, width - 180 * scale, 18 * scale);
  ctx.restore();

  const poleGrad = ctx.createLinearGradient(0, poleY - 10 * scale, 0, poleY + 10 * scale);
  poleGrad.addColorStop(0, '#4a3618');
  poleGrad.addColorStop(0.4, '#e0b864');
  poleGrad.addColorStop(0.55, '#fff2c0');
  poleGrad.addColorStop(1, '#2a1e08');
  ctx.fillStyle = poleGrad;
  ctx.fillRect(60 * scale, poleY - 8 * scale, width - 120 * scale, 16 * scale);
  // Pole finials (left/right gilded caps)
  [60 * scale, width - 60 * scale].forEach((xx) => {
    const g = ctx.createRadialGradient(xx - 6 * scale, poleY - 4 * scale, 0, xx, poleY, 18 * scale);
    g.addColorStop(0, '#ffe693');
    g.addColorStop(0.6, '#c8943a');
    g.addColorStop(1, '#3a2608');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(xx, poleY, 16 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2a1808';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();
    // spike
    ctx.fillStyle = '#d8a548';
    ctx.beginPath();
    ctx.moveTo(xx, poleY - 16 * scale);
    ctx.lineTo(xx + 5 * scale, poleY - 26 * scale);
    ctx.lineTo(xx - 5 * scale, poleY - 26 * scale);
    ctx.closePath();
    ctx.fill();
  });

  // --- Rope running along top + tassels at ends ---
  ctx.save();
  for (let i = 0; i < 80; i++) {
    const t = i / 80;
    const x = 80 * scale + t * (width - 160 * scale);
    const y = poleY + 8 * scale + Math.sin(t * Math.PI) * 10 * scale;
    ctx.fillStyle = i % 2 === 0 ? '#d4a93a' : '#6a4e18';
    ctx.fillRect(x, y, 6 * scale, 5 * scale);
  }
  ctx.restore();

  // Tassels
  const drawTassel = (tx, ty) => {
    ctx.save();
    ctx.fillStyle = '#c8943a';
    ctx.beginPath();
    ctx.arc(tx, ty, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3a2608';
    ctx.stroke();
    // Threads
    for (let i = 0; i < 14; i++) {
      const o = (i - 7) * 2 * scale;
      ctx.strokeStyle = i % 2 === 0 ? '#e6b648' : '#8b6218';
      ctx.lineWidth = 1.1 * scale;
      ctx.beginPath();
      ctx.moveTo(tx + o * 0.5, ty + 6 * scale);
      ctx.lineTo(tx + o, ty + 34 * scale + Math.abs(i - 7) * scale);
      ctx.stroke();
    }
    // Cap on threads
    ctx.fillStyle = '#8b6218';
    ctx.fillRect(tx - 8 * scale, ty + 34 * scale, 16 * scale, 3 * scale);
    ctx.restore();
  };
  drawTassel(92 * scale, poleY + 18 * scale);
  drawTassel(width - 92 * scale, poleY + 18 * scale);
  ctx.restore();

  // --- Banner cloth region ---
  const bx = 150 * scale;
  const by = poleY + 22 * scale;
  const bw = width - 300 * scale;
  const bh = height - by - 70 * scale;

  // Base cloth (primary color with vertical gradient for depth)
  const clothGrad = ctx.createLinearGradient(0, by, 0, by + bh);
  clothGrad.addColorStop(0, shade(primaryColor, 0.18));
  clothGrad.addColorStop(1, shade(primaryColor, -0.25));
  ctx.fillStyle = clothGrad;
  ctx.fillRect(bx, by, bw, bh);

  // Horizontal "charge" band in secondary color across the middle third
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(bx, by + bh * 0.38, bw, bh * 0.24);
  // inner gold rules on the charge band
  ctx.fillStyle = '#d8a548';
  ctx.fillRect(bx, by + bh * 0.38 - 2 * scale, bw, 2 * scale);
  ctx.fillRect(bx, by + bh * 0.62, bw, 2 * scale);

  // --- Fabric folds: stack many vertical gradient bands across cloth ---
  const foldCount = 14;
  const foldW = bw / foldCount;
  ctx.save();
  ctx.beginPath();
  ctx.rect(bx, by, bw, bh);
  ctx.clip();
  for (let i = 0; i < foldCount; i++) {
    const fx = bx + i * foldW;
    const isDark = (i % 2 === 0);
    const g = ctx.createLinearGradient(fx, 0, fx + foldW, 0);
    g.addColorStop(0, isDark ? 'rgba(0,0,0,0.0)' : 'rgba(255,255,255,0.0)');
    g.addColorStop(0.5, isDark ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.18)');
    g.addColorStop(1, isDark ? 'rgba(0,0,0,0.0)' : 'rgba(255,255,255,0.0)');
    ctx.fillStyle = g;
    ctx.fillRect(fx, by, foldW, bh);
  }
  // Weft threads — fine horizontal hairlines across cloth for cloth-weave texture
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 0.4 * scale;
  for (let yy = by; yy < by + bh; yy += 3 * scale) {
    ctx.beginPath();
    ctx.moveTo(bx, yy);
    ctx.lineTo(bx + bw, yy);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Damask pattern in primary field: fleur repeats
  ctx.save();
  ctx.globalAlpha = 0.09;
  ctx.fillStyle = '#ffffff';
  ctx.font = `${18 * scale}px "EB Garamond", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let yy = by + 24 * scale; yy < by + bh; yy += 34 * scale) {
    if (yy > by + bh * 0.36 && yy < by + bh * 0.64) continue;
    const off = ((yy / (34 * scale)) % 2) * 18 * scale;
    for (let xx = bx + 22 * scale + off; xx < bx + bw; xx += 36 * scale) {
      ctx.fillText('⚜', xx, yy);
    }
  }
  ctx.restore();

  // Subtle curved shading (hanging cloth gets darker at bottom edges)
  const bottomShade = ctx.createLinearGradient(0, by + bh * 0.7, 0, by + bh);
  bottomShade.addColorStop(0, 'rgba(0,0,0,0)');
  bottomShade.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = bottomShade;
  ctx.fillRect(bx, by, bw, bh);

  // --- Central medallion embroidery ---
  const mcx = bx + bw / 2;
  const mcy = by + bh / 2;
  const mR = Math.min(bw, bh) * 0.22;

  // Radiating stitch pattern (many tiny lines) behind medallion
  ctx.save();
  ctx.translate(mcx, mcy);
  ctx.strokeStyle = '#f2d78a';
  ctx.lineWidth = 0.7 * scale;
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const r0 = mR + 6 * scale;
    const r1 = mR + 26 * scale + (i % 3) * 4 * scale;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
    ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
    ctx.stroke();
  }
  ctx.restore();

  // Medallion gold disc with radial shading
  const gg = ctx.createRadialGradient(mcx - mR * 0.4, mcy - mR * 0.5, 0, mcx, mcy, mR);
  gg.addColorStop(0, '#ffe48c');
  gg.addColorStop(0.55, '#c89a3a');
  gg.addColorStop(1, '#4a3208');
  ctx.fillStyle = gg;
  ctx.beginPath();
  ctx.arc(mcx, mcy, mR, 0, Math.PI * 2);
  ctx.fill();
  // Ring
  ctx.strokeStyle = '#2a1b04';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();
  // Inner dark field
  ctx.fillStyle = shade(bgColor, -0.3);
  ctx.beginPath();
  ctx.arc(mcx, mcy, mR - 12 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f2d78a';
  ctx.lineWidth = 0.8 * scale;
  ctx.stroke();

  // Inner gold rosette
  ctx.save();
  ctx.translate(mcx, mcy);
  ctx.strokeStyle = '#f2d78a';
  ctx.lineWidth = 0.8 * scale;
  ctx.beginPath();
  const petals = 12;
  for (let i = 0; i <= 360; i++) {
    const t = (i / 360) * Math.PI * 2;
    const r = (mR - 18 * scale) * (0.6 + 0.4 * Math.abs(Math.cos(t * petals / 2)));
    const x = Math.cos(t) * r;
    const y = Math.sin(t) * r;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // Stars around the ring (count taken from user's stars if numeric)
  const starCount = 12;
  for (let i = 0; i < starCount; i++) {
    const a = (i / starCount) * Math.PI * 2 - Math.PI / 2;
    const sx = mcx + Math.cos(a) * (mR - 6 * scale);
    const sy = mcy + Math.sin(a) * (mR - 6 * scale);
    ctx.fillStyle = '#f2d78a';
    ctx.beginPath();
    for (let j = 0; j < 10; j++) {
      const aa = -Math.PI / 2 + j * (Math.PI / 5);
      const r = j % 2 === 0 ? 4 * scale : 1.8 * scale;
      const px = sx + Math.cos(aa) * r;
      const py = sy + Math.sin(aa) * r;
      if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Central repo name — fitted, with slight emboss
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let nameSize = mR * 0.35;
  ctx.font = `italic 900 ${nameSize}px "Playfair Display", "EB Garamond", serif`;
  const nameUpper = repoName.toUpperCase();
  while (ctx.measureText(nameUpper).width > (mR * 2 - 50 * scale) && nameSize > 10 * scale) {
    nameSize -= 0.5;
    ctx.font = `italic 900 ${nameSize}px "Playfair Display", "EB Garamond", serif`;
  }
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillText(nameUpper, mcx + 1 * scale, mcy - 6 * scale + 1 * scale);
  ctx.fillStyle = '#f2d78a';
  ctx.fillText(nameUpper, mcx, mcy - 6 * scale);

  ctx.font = `600 ${12 * scale}px "JetBrains Mono", monospace`;
  ctx.fillStyle = '#e2c07a';
  ctx.fillText('◆  ' + (repoOwner || '').toUpperCase() + '  ◆', mcx, mcy + nameSize * 0.7);

  ctx.font = `italic 500 ${11 * scale}px "EB Garamond", serif`;
  ctx.fillStyle = 'rgba(240,210,140,0.6)';
  ctx.fillText('· anno ⚜ domini ⚜ mmxxvi ·', mcx, mcy + nameSize * 1.0 + 8 * scale);
  ctx.restore();

  // --- Left and right charge cartouches on the cloth ---
  // Left — stars
  const leftCx = bx + bw * 0.16;
  const rightCx = bx + bw * 0.84;

  const drawCharge = (xCharge, glyph, labelTop, labelBot, value, tone) => {
    ctx.save();
    // Shield-shaped embroidered badge
    ctx.translate(xCharge, mcy);
    const sw = 120 * scale;
    const sh = 140 * scale;
    // Drop shadow
    ctx.save();
    ctx.filter = 'blur(4px)';
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.moveTo(-sw / 2, -sh / 2);
    ctx.lineTo(sw / 2, -sh / 2);
    ctx.lineTo(sw / 2, sh * 0.2);
    ctx.bezierCurveTo(sw / 2, sh * 0.4, sw * 0.25, sh * 0.48, 0, sh / 2);
    ctx.bezierCurveTo(-sw * 0.25, sh * 0.48, -sw / 2, sh * 0.4, -sw / 2, sh * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Shield body
    const bg = ctx.createLinearGradient(0, -sh / 2, 0, sh / 2);
    bg.addColorStop(0, shade(tone, 0.25));
    bg.addColorStop(1, shade(tone, -0.35));
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.moveTo(-sw / 2, -sh / 2);
    ctx.lineTo(sw / 2, -sh / 2);
    ctx.lineTo(sw / 2, sh * 0.2);
    ctx.bezierCurveTo(sw / 2, sh * 0.4, sw * 0.25, sh * 0.48, 0, sh / 2);
    ctx.bezierCurveTo(-sw * 0.25, sh * 0.48, -sw / 2, sh * 0.4, -sw / 2, sh * 0.2);
    ctx.closePath();
    ctx.fill();
    // Gold border
    ctx.strokeStyle = '#d8a548';
    ctx.lineWidth = 2.5 * scale;
    ctx.stroke();
    ctx.strokeStyle = '#3a2608';
    ctx.lineWidth = 0.8 * scale;
    ctx.stroke();

    // Embroidered labels
    ctx.fillStyle = '#f2d78a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${36 * scale}px "EB Garamond", serif`;
    ctx.fillText(glyph, 0, -sh * 0.18);
    ctx.font = `italic 500 ${9 * scale}px "EB Garamond", serif`;
    ctx.fillText(labelTop, 0, -sh * 0.36);
    ctx.font = `900 ${20 * scale}px "Playfair Display", "EB Garamond", serif`;
    ctx.fillText(String(value || '—'), 0, sh * 0.12);
    ctx.font = `italic 500 ${9 * scale}px "EB Garamond", serif`;
    ctx.fillText(labelBot, 0, sh * 0.28);

    ctx.restore();
  };
  drawCharge(leftCx, '✦', 'STELLÆ', 'of the people', stars, secondaryColor);
  drawCharge(rightCx, '⚔', 'FURCÆ', 'forged anew', forks, secondaryColor);

  ctx.restore(); // end banner clip

  // --- Fringed gold bottom trim ---
  ctx.save();
  const fringeTopY = by + bh;
  // Gold ribbon
  const rG = ctx.createLinearGradient(0, fringeTopY - 4 * scale, 0, fringeTopY + 10 * scale);
  rG.addColorStop(0, '#f5d27a');
  rG.addColorStop(0.5, '#c8943a');
  rG.addColorStop(1, '#3a2608');
  ctx.fillStyle = rG;
  ctx.fillRect(bx, fringeTopY, bw, 10 * scale);
  ctx.strokeStyle = '#2a1608';
  ctx.lineWidth = 0.6 * scale;
  ctx.strokeRect(bx, fringeTopY, bw, 10 * scale);
  // Fringe strands
  for (let i = 0; i < Math.floor(bw / (3 * scale)); i++) {
    const fx = bx + i * 3 * scale;
    const fh = (16 + (i % 7) * 2 + ((i * 13) % 5)) * scale;
    ctx.strokeStyle = i % 3 === 0 ? '#f5d27a' : (i % 3 === 1 ? '#c8943a' : '#8b6218');
    ctx.lineWidth = 1.2 * scale;
    ctx.beginPath();
    ctx.moveTo(fx, fringeTopY + 10 * scale);
    ctx.lineTo(fx + (i % 5 - 2) * 0.4 * scale, fringeTopY + 10 * scale + fh);
    ctx.stroke();
  }
  ctx.restore();

  // --- Bottom metadata band below fringe ---
  ctx.save();
  ctx.fillStyle = '#f5e4bb';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const metaY = height - 24 * scale;
  ctx.font = `italic 500 ${13 * scale}px "EB Garamond", serif`;
  // Description wrapped (single elegant italic line, truncate if long)
  ctx.save();
  ctx.fillStyle = 'rgba(245,228,187,0.75)';
  const descStr = '❝  ' + description + '  ❞';
  ctx.font = `italic 500 ${14 * scale}px "EB Garamond", serif`;
  // Truncate to width
  let td = descStr;
  while (ctx.measureText(td).width > bw - 240 * scale && td.length > 10) td = td.slice(0, -2);
  if (td !== descStr) td = td.slice(0, -3) + '…❞';
  ctx.fillText(td, bx + 8 * scale, metaY);
  ctx.restore();

  // Language pill
  ctx.fillStyle = '#000';
  const langTxt = (language || '').toUpperCase();
  ctx.font = `700 ${12 * scale}px "JetBrains Mono", monospace`;
  const langW = ctx.measureText(langTxt).width + 20 * scale;
  ctx.fillRect(bx + bw - langW - 4 * scale, metaY - 11 * scale, langW, 22 * scale);
  ctx.strokeStyle = '#d8a548';
  ctx.strokeRect(bx + bw - langW - 4 * scale, metaY - 11 * scale, langW, 22 * scale);
  ctx.fillStyle = '#f2d78a';
  ctx.textAlign = 'center';
  ctx.fillText(langTxt, bx + bw - langW / 2 - 4 * scale, metaY + 1 * scale);

  // Support URL — right-aligned, under the pill
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(245,228,187,0.55)';
    ctx.font = `500 ${10 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText('⚜ ' + supportUrl, bx + bw - 4 * scale, metaY + 14 * scale);
  }
  ctx.restore();
};
