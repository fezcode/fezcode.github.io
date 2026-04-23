import { wrapText } from '../utils';

/*
 * HERALDIC — engraved coat-of-arms in the style of steel-plate banknote art.
 * Density is built from fine hatching, ornamental glyphs, guilloché rosettes,
 * and typography rather than polygon figures. Every surface is textured.
 */

const seedRng = (seed) => {
  let h = 0x9e3779b9;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

// Fine parallel hatching inside an arbitrary clip region.
const hatch = (ctx, x, y, w, h, angle, spacing, color, alpha, lw) => {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(angle);
  const d = Math.hypot(w, h);
  for (let i = -d; i < d; i += spacing) {
    ctx.beginPath();
    ctx.moveTo(i, -d);
    ctx.lineTo(i, d);
    ctx.stroke();
  }
  ctx.restore();
};

// Guilloché rosette — concentric spirograph-like flourish.
const guilloche = (ctx, cx, cy, rInner, rOuter, petals, color, lw, alpha) => {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  const steps = 720;
  ctx.beginPath();
  for (let s = 0; s <= steps; s++) {
    const t = (s / steps) * Math.PI * 2;
    const r = rInner + (rOuter - rInner) * 0.5 * (1 + Math.cos(t * petals));
    const x = cx + Math.cos(t) * r;
    const y = cy + Math.sin(t) * r;
    if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
};

// Banknote-style border of tiny fleurs between two rules.
const ornamentBand = (ctx, x, y, w, h, primary, gold, ink, scale) => {
  ctx.save();
  // Outer/inner hairlines
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.2 * scale;
  ctx.strokeRect(x, y, w, h);
  ctx.lineWidth = 0.6 * scale;
  ctx.strokeRect(x + 5 * scale, y + 5 * scale, w - 10 * scale, h - 10 * scale);
  // Fleur repeats along top/bottom
  const step = 18 * scale;
  ctx.fillStyle = primary;
  ctx.font = `${12 * scale}px "EB Garamond", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let px = x + step / 2; px < x + w; px += step) {
    ctx.fillText('⚜', px, y + h / 2);
    ctx.fillText('⚜', px, y + h / 2);
  }
  ctx.restore();
};

// Shield path — classic "heater" profile.
const shieldPath = (ctx, cx, cy, w, h) => {
  const hw = w / 2;
  ctx.beginPath();
  ctx.moveTo(cx - hw, cy - h / 2);
  // shoulders with tiny flair
  ctx.quadraticCurveTo(cx - hw, cy - h / 2 + h * 0.03, cx - hw + w * 0.02, cy - h / 2 + h * 0.02);
  ctx.lineTo(cx + hw - w * 0.02, cy - h / 2 + h * 0.02);
  ctx.quadraticCurveTo(cx + hw, cy - h / 2 + h * 0.03, cx + hw, cy - h / 2);
  ctx.lineTo(cx + hw, cy - h * 0.05);
  // curved flanks to a pointed base
  ctx.bezierCurveTo(cx + hw, cy + h * 0.3, cx + hw * 0.45, cy + h * 0.46, cx, cy + h / 2);
  ctx.bezierCurveTo(cx - hw * 0.45, cy + h * 0.46, cx - hw, cy + h * 0.3, cx - hw, cy - h * 0.05);
  ctx.closePath();
};

// Cloth-fold scroll for motto — rendered with layered gradient strips to feel real.
const mottoScroll = (ctx, cx, cy, w, h, parchment, shade, deep, gold, ink, text, scale) => {
  const hw = w / 2;
  ctx.save();

  // Back shadow flare
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + h * 0.6, hw * 1.2, h * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Center body with subtle curve
  const bodyGrad = ctx.createLinearGradient(0, cy - h / 2, 0, cy + h / 2);
  bodyGrad.addColorStop(0, shade);
  bodyGrad.addColorStop(0.5, parchment);
  bodyGrad.addColorStop(1, shade);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(cx - hw, cy);
  ctx.quadraticCurveTo(cx, cy - h * 0.6, cx + hw, cy);
  ctx.quadraticCurveTo(cx, cy + h * 0.4, cx - hw, cy);
  ctx.closePath();
  ctx.fill();

  // Fold crease hatching along the body
  ctx.save();
  ctx.clip();
  for (let i = 0; i < 22; i++) {
    const t = i / 22;
    const x = cx - hw + w * t;
    const y = cy - Math.sin(t * Math.PI) * h * 0.55;
    ctx.strokeStyle = `rgba(90,60,22,${0.1 + (i % 3) * 0.04})`;
    ctx.lineWidth = 0.8 * scale;
    ctx.beginPath();
    ctx.moveTo(x, y + 2 * scale);
    ctx.lineTo(x, cy + Math.sin(t * Math.PI) * h * 0.35);
    ctx.stroke();
  }
  ctx.restore();

  // Bottom edge stroke
  ctx.strokeStyle = deep;
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  ctx.moveTo(cx - hw, cy);
  ctx.quadraticCurveTo(cx, cy - h * 0.6, cx + hw, cy);
  ctx.quadraticCurveTo(cx, cy + h * 0.4, cx - hw, cy);
  ctx.closePath();
  ctx.stroke();

  // Left and right curled ends — drawn as layered crescents with shading
  const drawCurl = (sign) => {
    const cxE = cx + sign * hw;
    ctx.fillStyle = deep;
    ctx.beginPath();
    ctx.moveTo(cxE, cy - h * 0.05);
    ctx.quadraticCurveTo(cxE + sign * h * 0.6, cy - h * 0.45, cxE + sign * h * 0.95, cy + h * 0.1);
    ctx.quadraticCurveTo(cxE + sign * h * 0.4, cy + h * 0.35, cxE + sign * h * 0.05, cy + h * 0.15);
    ctx.closePath();
    ctx.fill();

    // Inner curl roll
    ctx.fillStyle = parchment;
    ctx.beginPath();
    ctx.ellipse(
      cxE + sign * h * 0.55, cy - h * 0.1,
      h * 0.35, h * 0.3,
      -sign * 0.3,
      0, Math.PI * 2,
    );
    ctx.fill();

    // Curl hatch shading
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(
      cxE + sign * h * 0.55, cy - h * 0.1,
      h * 0.35, h * 0.3,
      -sign * 0.3,
      0, Math.PI * 2,
    );
    ctx.clip();
    ctx.strokeStyle = 'rgba(80,50,10,0.3)';
    ctx.lineWidth = 0.6 * scale;
    for (let a = -1; a < 1; a += 0.05) {
      ctx.beginPath();
      ctx.moveTo(cxE + sign * h * (0.2 + a), cy - h * 0.5);
      ctx.lineTo(cxE + sign * h * (0.9 + a), cy + h * 0.3);
      ctx.stroke();
    }
    ctx.restore();

    // Hairline outline
    ctx.strokeStyle = deep;
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.ellipse(
      cxE + sign * h * 0.55, cy - h * 0.1,
      h * 0.35, h * 0.3,
      -sign * 0.3,
      0, Math.PI * 2,
    );
    ctx.stroke();
  };
  drawCurl(-1);
  drawCurl(1);

  // Motto text — black letterpress, centered on the body
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `italic 700 ${h * 0.36}px "Playfair Display", "EB Garamond", "Times New Roman", serif`;
  const upper = text.toUpperCase();
  const maxWidth = w * 0.82;
  let size = h * 0.42;
  ctx.font = `italic 700 ${size}px "Playfair Display", "EB Garamond", serif`;
  while (ctx.measureText(upper).width > maxWidth && size > h * 0.2) {
    size -= 0.5;
    ctx.font = `italic 700 ${size}px "Playfair Display", "EB Garamond", serif`;
  }
  // Subtle emboss — light highlight up, deeper shadow down
  ctx.fillStyle = 'rgba(255,245,220,0.5)';
  ctx.fillText(upper, cx, cy - 1 * scale);
  ctx.fillStyle = ink;
  ctx.fillText(upper, cx, cy);

  // Small gold diamonds flanking the motto
  ctx.fillStyle = gold;
  [-1, 1].forEach((s) => {
    const dx = cx + s * (ctx.measureText(upper).width / 2 + 18 * scale);
    ctx.beginPath();
    ctx.moveTo(dx, cy - 5 * scale);
    ctx.lineTo(dx + 4 * scale, cy);
    ctx.lineTo(dx, cy + 5 * scale);
    ctx.lineTo(dx - 4 * scale, cy);
    ctx.closePath();
    ctx.fill();
  });

  ctx.restore();
};

export const heraldic = (ctx, width, height, scale, data) => {
  const {
    primaryColor, secondaryColor, bgColor,
    repoOwner, repoName, description, language, stars, forks, supportUrl,
    showPattern,
  } = data;

  const rng = seedRng(`${repoOwner}${repoName}`);

  // Palette — treat user palette as the heraldic tinctures (field colors), with
  // fixed parchment/gold/ink for the engraving structure.
  const parchment = '#f2e5c6';
  const parchmentSoft = '#e5d3a2';
  const parchmentDeep = '#c4a766';
  const ink = '#1a1208';
  const inkSoft = '#4a3820';
  const gold = '#c89a3a';
  const goldLight = '#f0d37a';
  const goldDeep = '#8b6a22';
  const tinctureA = primaryColor;
  const tinctureB = secondaryColor;
  const tinctureDeep = bgColor;

  // --- Parchment ground with aged wash and foxing ---
  const ground = ctx.createRadialGradient(
    width * 0.5, height * 0.45, width * 0.05,
    width * 0.5, height * 0.5, width * 0.8,
  );
  ground.addColorStop(0, parchment);
  ground.addColorStop(0.6, parchmentSoft);
  ground.addColorStop(1, parchmentDeep);
  ctx.fillStyle = ground;
  ctx.fillRect(0, 0, width, height);

  // Foxing / stains
  if (showPattern) {
    ctx.save();
    for (let i = 0; i < 260; i++) {
      const x = rng() * width;
      const y = rng() * height;
      const r = (rng() * 3 + 0.6) * scale;
      const edge = Math.min(x, y, width - x, height - y) / Math.max(width, height);
      ctx.globalAlpha = 0.05 + (1 - edge) * 0.08;
      ctx.fillStyle = rng() > 0.5 ? '#7a5520' : '#5a3a10';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Fibre lines
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#8b6a22';
    ctx.lineWidth = 0.4 * scale;
    for (let i = 0; i < 80; i++) {
      const x = rng() * width;
      const y = rng() * height;
      const len = (12 + rng() * 40) * scale;
      const a = rng() * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Engraved outer frame: dense banknote border ---
  const bw = 18 * scale;
  const bInset = 18 * scale;
  // Outer rule
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(bInset, bInset, width - bInset * 2, height - bInset * 2);
  ctx.lineWidth = 0.6 * scale;
  ctx.strokeRect(bInset + 3 * scale, bInset + 3 * scale, width - bInset * 2 - 6 * scale, height - bInset * 2 - 6 * scale);
  ctx.restore();

  // Guilloché bands on top and bottom edges
  ctx.save();
  ctx.beginPath();
  ctx.rect(bInset + 7 * scale, bInset + 7 * scale, width - bInset * 2 - 14 * scale, bw);
  ctx.rect(bInset + 7 * scale, height - bInset - 7 * scale - bw, width - bInset * 2 - 14 * scale, bw);
  ctx.clip();
  for (let i = 0; i < 2; i++) {
    const yy = i === 0 ? bInset + 7 * scale + bw / 2 : height - bInset - 7 * scale - bw / 2;
    for (let x = bInset; x < width - bInset; x += 40 * scale) {
      guilloche(ctx, x, yy, bw * 0.18, bw * 0.42, 6, inkSoft, 0.45 * scale, 0.75);
    }
  }
  ctx.restore();
  // Rules around the guilloché
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 0.8 * scale;
  [bInset + 7 * scale, bInset + 7 * scale + bw, height - bInset - 7 * scale - bw, height - bInset - 7 * scale].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(bInset + 7 * scale, y);
    ctx.lineTo(width - bInset - 7 * scale, y);
    ctx.stroke();
  });
  ctx.restore();

  // Left/right vertical engraved bands (crosshatch)
  const sideY1 = bInset + 7 * scale + bw + 6 * scale;
  const sideY2 = height - bInset - 7 * scale - bw - 6 * scale;
  const sideW = 28 * scale;
  [bInset + 7 * scale, width - bInset - 7 * scale - sideW].forEach((sx) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(sx, sideY1, sideW, sideY2 - sideY1);
    ctx.clip();
    // Cross-hatching
    hatch(ctx, sx, sideY1, sideW, sideY2 - sideY1, Math.PI / 4, 3 * scale, ink, 0.35, 0.5 * scale);
    hatch(ctx, sx, sideY1, sideW, sideY2 - sideY1, -Math.PI / 4, 3 * scale, ink, 0.35, 0.5 * scale);
    // Fleur column
    ctx.fillStyle = ink;
    ctx.font = `${12 * scale}px "EB Garamond", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let yy = sideY1 + 16 * scale; yy < sideY2; yy += 22 * scale) {
      ctx.fillText('⚜', sx + sideW / 2, yy);
    }
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 0.8 * scale;
    ctx.strokeRect(sx, sideY1, sideW, sideY2 - sideY1);
    ctx.restore();
  });

  // --- Top banner: "Of the house of ..." ---
  const topBY = bInset + 7 * scale + bw + 38 * scale;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = inkSoft;
  ctx.font = `italic 500 ${14 * scale}px "EB Garamond", serif`;
  ctx.fillText('· EX · DOMO · NOBILI ·', width / 2, topBY - 16 * scale);
  ctx.fillStyle = ink;
  ctx.font = `700 ${40 * scale}px "Playfair Display", "EB Garamond", serif`;
  const ownerTxt = (repoOwner || '').toUpperCase().split('').join(' ');
  let ownerSize = 40 * scale;
  ctx.font = `700 ${ownerSize}px "Playfair Display", "EB Garamond", serif`;
  while (ctx.measureText(ownerTxt).width > width - 240 * scale && ownerSize > 16 * scale) {
    ownerSize -= 0.5;
    ctx.font = `700 ${ownerSize}px "Playfair Display", "EB Garamond", serif`;
  }
  ctx.fillText(ownerTxt, width / 2, topBY + 14 * scale);

  // Rule with lozenge centered between
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 0.8 * scale;
  ctx.beginPath();
  const ruleY = topBY + 42 * scale;
  ctx.moveTo(width / 2 - 220 * scale, ruleY);
  ctx.lineTo(width / 2 - 16 * scale, ruleY);
  ctx.moveTo(width / 2 + 16 * scale, ruleY);
  ctx.lineTo(width / 2 + 220 * scale, ruleY);
  ctx.stroke();
  ctx.fillStyle = goldDeep;
  ctx.beginPath();
  ctx.moveTo(width / 2, ruleY - 6 * scale);
  ctx.lineTo(width / 2 + 6 * scale, ruleY);
  ctx.lineTo(width / 2, ruleY + 6 * scale);
  ctx.lineTo(width / 2 - 6 * scale, ruleY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // --- Shield (central achievement) ---
  const cx = width / 2;
  const cy = height * 0.56;
  const shW = 260 * scale;
  const shH = 310 * scale;

  // Shield drop shadow
  ctx.save();
  ctx.filter = 'blur(8px)';
  ctx.fillStyle = 'rgba(30,18,6,0.35)';
  shieldPath(ctx, cx + 6 * scale, cy + 10 * scale, shW, shH);
  ctx.fill();
  ctx.restore();

  // Paint the shield ground (quartered, with damask pattern) — clipped
  ctx.save();
  shieldPath(ctx, cx, cy, shW, shH);
  ctx.save();
  ctx.clip();

  // Full shield ground linear tincture
  const sg = ctx.createLinearGradient(cx - shW / 2, cy - shH / 2, cx + shW / 2, cy + shH / 2);
  sg.addColorStop(0, tinctureA);
  sg.addColorStop(1, tinctureDeep);
  ctx.fillStyle = sg;
  ctx.fillRect(cx - shW / 2, cy - shH / 2, shW, shH);

  // Quarterly split, with secondary tint in UR and LL
  ctx.fillStyle = tinctureB;
  ctx.fillRect(cx, cy - shH / 2, shW / 2, shH / 2);
  ctx.fillRect(cx - shW / 2, cy, shW / 2, shH / 2);

  // Fine damask: tiny fleurs repeating in every quarter
  const drawDamask = (qx, qy, qw, qh, baseFill) => {
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = baseFill;
    ctx.font = `${10 * scale}px "EB Garamond", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let yy = qy + 12 * scale; yy < qy + qh; yy += 18 * scale) {
      for (let xx = qx + 12 * scale + ((yy / (18 * scale)) % 2) * 9 * scale; xx < qx + qw; xx += 18 * scale) {
        ctx.fillText('⚜', xx, yy);
      }
    }
    ctx.restore();
  };
  drawDamask(cx - shW / 2, cy - shH / 2, shW / 2, shH / 2, goldLight);
  drawDamask(cx, cy - shH / 2, shW / 2, shH / 2, goldDeep);
  drawDamask(cx - shW / 2, cy, shW / 2, shH / 2, goldDeep);
  drawDamask(cx, cy, shW / 2, shH / 2, goldLight);

  // Cross-hatched shading across whole shield (engraved)
  hatch(ctx, cx - shW / 2, cy - shH / 2, shW, shH, Math.PI / 3, 2.5 * scale, '#000', 0.12, 0.4 * scale);
  hatch(ctx, cx - shW / 2, cy - shH / 2, shW, shH, -Math.PI / 3, 4 * scale, '#000', 0.09, 0.4 * scale);

  // Central monogram disc
  const mR = Math.min(shW, shH) * 0.26;
  const mg = ctx.createRadialGradient(cx - mR * 0.3, cy - mR * 0.3, 0, cx, cy, mR);
  mg.addColorStop(0, goldLight);
  mg.addColorStop(0.55, gold);
  mg.addColorStop(1, goldDeep);
  ctx.fillStyle = mg;
  ctx.beginPath();
  ctx.arc(cx, cy, mR, 0, Math.PI * 2);
  ctx.fill();
  // Disc rim stroke
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 2.2 * scale;
  ctx.stroke();
  ctx.strokeStyle = parchment;
  ctx.lineWidth = 0.8 * scale;
  ctx.beginPath();
  ctx.arc(cx, cy, mR - 4 * scale, 0, Math.PI * 2);
  ctx.stroke();

  // Engraved rays inside the disc
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, mR - 6 * scale, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = 'rgba(50,30,4,0.22)';
  ctx.lineWidth = 0.6 * scale;
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * mR, cy + Math.sin(a) * mR);
    ctx.stroke();
  }
  ctx.restore();

  // Monogram (owner initial + repo initial ligature feel)
  ctx.save();
  const mono = ((repoOwner || 'X')[0] + (repoName || 'X')[0]).toUpperCase();
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let monoSize = mR * 1.1;
  ctx.font = `900 italic ${monoSize}px "Playfair Display", "EB Garamond", serif`;
  while (ctx.measureText(mono).width > mR * 1.6 && monoSize > mR * 0.5) {
    monoSize -= 2;
    ctx.font = `900 italic ${monoSize}px "Playfair Display", "EB Garamond", serif`;
  }
  // emboss
  ctx.fillStyle = 'rgba(255,240,190,0.45)';
  ctx.fillText(mono, cx, cy - 1 * scale);
  ctx.fillStyle = ink;
  ctx.fillText(mono, cx, cy + 1 * scale);
  ctx.restore();

  // Corner ornaments in the quarters (typographic charges, not polygon figures)
  const quarterCharge = (qx, qy, glyph, col) => {
    ctx.save();
    ctx.fillStyle = col;
    ctx.globalAlpha = 0.9;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${shH * 0.14}px "EB Garamond", serif`;
    ctx.fillText(glyph, qx, qy);
    ctx.restore();
  };
  quarterCharge(cx - shW / 4, cy - shH / 4, '✶', goldLight);
  quarterCharge(cx + shW / 4, cy - shH / 4, '⚔', goldDeep);
  quarterCharge(cx - shW / 4, cy + shH / 4, '❦', goldDeep);
  quarterCharge(cx + shW / 4, cy + shH / 4, '❧', goldLight);

  ctx.restore(); // end shield clip

  // Shield quartering cross + border
  ctx.save();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 4 * scale;
  shieldPath(ctx, cx, cy, shW, shH);
  ctx.stroke();
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 1 * scale;
  shieldPath(ctx, cx, cy, shW - 6 * scale, shH - 6 * scale);
  ctx.stroke();
  // cross
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(cx, cy - shH / 2 + 4 * scale);
  ctx.lineTo(cx, cy + shH / 2 - 8 * scale);
  ctx.moveTo(cx - shW / 2 + 4 * scale, cy);
  ctx.lineTo(cx + shW / 2 - 4 * scale, cy);
  ctx.stroke();
  ctx.restore();

  // --- Crown above shield ---
  ctx.save();
  const crownX = cx;
  const crownY = cy - shH / 2 - 44 * scale;
  const cwHalf = shW * 0.35;
  // Base gold band with bevel
  const bandGrad = ctx.createLinearGradient(0, crownY - 4 * scale, 0, crownY + 30 * scale);
  bandGrad.addColorStop(0, goldLight);
  bandGrad.addColorStop(0.5, gold);
  bandGrad.addColorStop(1, goldDeep);
  ctx.fillStyle = bandGrad;
  ctx.fillRect(crownX - cwHalf, crownY + 6 * scale, cwHalf * 2, 22 * scale);
  // Band hairline
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 1 * scale;
  ctx.strokeRect(crownX - cwHalf, crownY + 6 * scale, cwHalf * 2, 22 * scale);
  // Jewels
  const jewelCount = 5;
  for (let i = 0; i < jewelCount; i++) {
    const jx = crownX - cwHalf + (cwHalf * 2) * ((i + 0.5) / jewelCount);
    const jc = i % 2 === 0 ? tinctureA : tinctureB;
    const jg = ctx.createRadialGradient(jx - 3 * scale, crownY + 15 * scale, 0, jx, crownY + 17 * scale, 8 * scale);
    jg.addColorStop(0, '#ffffff');
    jg.addColorStop(0.25, jc);
    jg.addColorStop(1, '#000000');
    ctx.fillStyle = jg;
    ctx.beginPath();
    ctx.arc(jx, crownY + 17 * scale, 6 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
  // Points rising
  const peaks = 7;
  for (let i = 0; i < peaks; i++) {
    const t = i / (peaks - 1);
    const px = crownX - cwHalf + cwHalf * 2 * t;
    const pY = crownY + 6 * scale;
    const pt = pY - (18 + Math.sin(t * Math.PI) * 14) * scale;
    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.moveTo(px - 5 * scale, pY);
    ctx.lineTo(px, pt);
    ctx.lineTo(px + 5 * scale, pY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = goldDeep;
    ctx.lineWidth = 0.8 * scale;
    ctx.stroke();
    // Pearl
    ctx.fillStyle = '#fdf1c9';
    ctx.beginPath();
    ctx.arc(px, pt - 5 * scale, 3.2 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = goldDeep;
    ctx.lineWidth = 0.6 * scale;
    ctx.stroke();
  }
  // Arch + orb + cross
  ctx.strokeStyle = gold;
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(crownX - cwHalf * 0.95, crownY - 8 * scale);
  ctx.quadraticCurveTo(crownX, crownY - 40 * scale, crownX + cwHalf * 0.95, crownY - 8 * scale);
  ctx.stroke();
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.arc(crownX, crownY - 32 * scale, 6 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 0.8 * scale;
  ctx.stroke();
  ctx.fillStyle = gold;
  ctx.fillRect(crownX - 1.5 * scale, crownY - 48 * scale, 3 * scale, 12 * scale);
  ctx.fillRect(crownX - 6 * scale, crownY - 44 * scale, 12 * scale, 3 * scale);
  ctx.restore();

  // --- Flanking engraved columns instead of polygon figures ---
  // Two narrow columns with ornate capital/base and fluted shading
  const colX = [cx - shW / 2 - 78 * scale, cx + shW / 2 + 38 * scale];
  const colW2 = 40 * scale;
  const colY = cy - shH / 2 + 20 * scale;
  const colH = shH + 10 * scale;
  colX.forEach((xx) => {
    ctx.save();
    // Capital block
    ctx.fillStyle = gold;
    ctx.fillRect(xx - 4 * scale, colY - 12 * scale, colW2 + 8 * scale, 14 * scale);
    ctx.strokeStyle = goldDeep;
    ctx.strokeRect(xx - 4 * scale, colY - 12 * scale, colW2 + 8 * scale, 14 * scale);
    // Column body with fluted hatching
    ctx.fillStyle = parchment;
    ctx.fillRect(xx, colY, colW2, colH);
    ctx.save();
    ctx.beginPath();
    ctx.rect(xx, colY, colW2, colH);
    ctx.clip();
    ctx.strokeStyle = 'rgba(60,40,10,0.4)';
    ctx.lineWidth = 0.6 * scale;
    for (let i = 1; i < 6; i++) {
      const lx = xx + (colW2 / 6) * i;
      ctx.beginPath();
      ctx.moveTo(lx, colY);
      ctx.lineTo(lx, colY + colH);
      ctx.stroke();
    }
    // Vertical glyph column (ornaments)
    ctx.fillStyle = ink;
    ctx.font = `${14 * scale}px "EB Garamond", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const glyphs = ['✦', '⚜', '✠', '❧', '✶', '☙', '✠', '⚜', '✦'];
    glyphs.forEach((g, i) => {
      ctx.fillText(g, xx + colW2 / 2, colY + 22 * scale + i * 34 * scale);
    });
    ctx.restore();
    // Base block
    ctx.fillStyle = gold;
    ctx.fillRect(xx - 4 * scale, colY + colH - 2 * scale, colW2 + 8 * scale, 14 * scale);
    ctx.strokeStyle = goldDeep;
    ctx.strokeRect(xx - 4 * scale, colY + colH - 2 * scale, colW2 + 8 * scale, 14 * scale);
    ctx.restore();
  });

  // --- Motto scroll below shield ---
  mottoScroll(
    ctx, cx, cy + shH / 2 + 46 * scale, 460 * scale, 56 * scale,
    parchment, parchmentSoft, goldDeep, gold, ink,
    repoName, scale,
  );

  // --- Left cartouche: ordinaries (stars/forks/language) ---
  const leftX = bInset + 7 * scale + sideW + 38 * scale;
  const cartY = cy - shH / 2 + 14 * scale;
  ctx.save();
  ctx.fillStyle = ink;
  ctx.font = `italic 600 ${12 * scale}px "EB Garamond", serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('— ORDINARIES —', leftX, cartY);
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 0.8 * scale;
  ctx.beginPath();
  ctx.moveTo(leftX, cartY + 22 * scale);
  ctx.lineTo(leftX + 160 * scale, cartY + 22 * scale);
  ctx.stroke();

  let ry = cartY + 36 * scale;
  const rows = [];
  if (stars) rows.push(['✦', 'STELLÆ', stars]);
  if (forks) rows.push(['⚔', 'FURCÆ', forks]);
  if (language) rows.push(['⚜', 'LINGUA', language.toUpperCase()]);
  rows.forEach(([g, k, v]) => {
    ctx.fillStyle = goldDeep;
    ctx.font = `${22 * scale}px "EB Garamond", serif`;
    ctx.fillText(g, leftX, ry + 6 * scale);
    ctx.fillStyle = inkSoft;
    ctx.font = `italic 500 ${11 * scale}px "EB Garamond", serif`;
    ctx.fillText(k, leftX + 30 * scale, ry);
    ctx.fillStyle = ink;
    ctx.font = `700 ${22 * scale}px "Playfair Display", "EB Garamond", serif`;
    ctx.fillText(String(v), leftX + 30 * scale, ry + 14 * scale);
    // Hair rule
    ctx.strokeStyle = 'rgba(60,40,10,0.3)';
    ctx.lineWidth = 0.4 * scale;
    ctx.beginPath();
    ctx.moveTo(leftX, ry + 44 * scale);
    ctx.lineTo(leftX + 160 * scale, ry + 44 * scale);
    ctx.stroke();
    ry += 52 * scale;
  });
  ctx.restore();

  // --- Right cartouche: description as manuscript hand ---
  const rightX = width - bInset - 7 * scale - sideW - 38 * scale;
  const rightW = 220 * scale;
  ctx.save();
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillStyle = ink;
  ctx.font = `italic 600 ${12 * scale}px "EB Garamond", serif`;
  ctx.fillText('— ARGUMENT —', rightX, cartY);
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 0.8 * scale;
  ctx.beginPath();
  ctx.moveTo(rightX - 160 * scale, cartY + 22 * scale);
  ctx.lineTo(rightX, cartY + 22 * scale);
  ctx.stroke();
  // Description wrapped right-aligned is tricky; draw as plain left-aligned within right-anchored box
  ctx.textAlign = 'left';
  ctx.fillStyle = inkSoft;
  ctx.font = `italic 500 ${16 * scale}px "EB Garamond", "Georgia", serif`;
  wrapText(ctx, description, rightX - rightW, cartY + 36 * scale, rightW, 22 * scale);
  ctx.restore();

  // --- Bottom footer: attribution with colophon rules ---
  const footY = height - bInset - 7 * scale - bw - 6 * scale - 26 * scale;
  ctx.save();
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 0.6 * scale;
  ctx.beginPath();
  ctx.moveTo(bInset + 7 * scale + sideW + 30 * scale, footY);
  ctx.lineTo(width - bInset - 7 * scale - sideW - 30 * scale, footY);
  ctx.stroke();
  ctx.fillStyle = inkSoft;
  ctx.font = `italic 400 ${12 * scale}px "EB Garamond", serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(
    `colophon · scripsit per manus · ${(repoOwner || 'anon').toLowerCase()} · a · d · mmxxvi`,
    bInset + 7 * scale + sideW + 30 * scale,
    footY + 6 * scale,
  );
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = ink;
    ctx.font = `700 ${12 * scale}px "EB Garamond", serif`;
    ctx.fillText('⚜ ' + supportUrl, width - bInset - 7 * scale - sideW - 30 * scale, footY + 6 * scale);
  }
  ctx.restore();
};
