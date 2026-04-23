import { wrapText } from '../utils';

/*
 * TAROT_CARD — occult card rendered with sacred geometry, hand-drawn stroke
 * variation, dense starfield, ornate gilt border with repeating tracery, and
 * typographic emblems instead of polygon figures.
 */

const seedRng = (seed) => {
  let h = 0x3779b9a1;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

const toRoman = (num) => {
  const n = parseInt(String(num).replace(/[^\d]/g, ''), 10);
  if (!Number.isFinite(n) || n <= 0) return 'I';
  const map = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
  let v = Math.min(2999, n);
  let out = '';
  for (const [k, r] of map) while (v >= k) { out += r; v -= k; }
  return out;
};

// Hand-drawn line: break into many tiny segments with slight jitter.
const sketchLine = (ctx, x1, y1, x2, y2, rng, jitter = 1) => {
  const segs = Math.max(4, Math.floor(Math.hypot(x2 - x1, y2 - y1) / 8));
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const x = x1 + (x2 - x1) * t + (rng() - 0.5) * jitter;
    const y = y1 + (y2 - y1) * t + (rng() - 0.5) * jitter;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
};

// Star at (cx,cy) filled
const star = (ctx, cx, cy, rOut, rIn, points = 5) => {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const a = -Math.PI / 2 + i * (Math.PI / points);
    const r = i % 2 === 0 ? rOut : rIn;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
};

export const tarotCard = (ctx, width, height, scale, data) => {
  const {
    primaryColor, secondaryColor, bgColor,
    repoOwner, repoName, description, language, stars, forks, supportUrl,
    showPattern,
  } = data;

  const rng = seedRng(`${repoOwner}${repoName}`);

  // --- Velvet backdrop with deep vignette ---
  const bg = ctx.createRadialGradient(width * 0.5, height * 0.45, width * 0.05, width * 0.5, height * 0.5, width * 0.75);
  bg.addColorStop(0, '#1d122a');
  bg.addColorStop(1, '#060308');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  if (showPattern) {
    // Dense star field behind the card
    for (let i = 0; i < 420; i++) {
      const x = rng() * width;
      const y = rng() * height;
      const r = rng() * 1.6 * scale;
      ctx.globalAlpha = 0.12 + rng() * 0.45;
      ctx.fillStyle = rng() > 0.7 ? '#f5d27a' : '#e0d8f0';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      // Tiny cross sparkle for brightest stars
      if (r > 1.1 * scale) {
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 0.4 * scale;
        ctx.beginPath();
        ctx.moveTo(x - r * 2, y); ctx.lineTo(x + r * 2, y);
        ctx.moveTo(x, y - r * 2); ctx.lineTo(x, y + r * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    // Faint nebula cloud
    const neb = ctx.createRadialGradient(width * 0.7, height * 0.2, 0, width * 0.7, height * 0.2, width * 0.5);
    neb.addColorStop(0, 'rgba(150,60,140,0.18)');
    neb.addColorStop(1, 'rgba(150,60,140,0)');
    ctx.fillStyle = neb;
    ctx.fillRect(0, 0, width, height);
    const neb2 = ctx.createRadialGradient(width * 0.3, height * 0.8, 0, width * 0.3, height * 0.8, width * 0.45);
    neb2.addColorStop(0, 'rgba(60,120,200,0.14)');
    neb2.addColorStop(1, 'rgba(60,120,200,0)');
    ctx.fillStyle = neb2;
    ctx.fillRect(0, 0, width, height);
  }

  // --- Card dimensions (tarot portrait proportions) ---
  const cardH = height * 0.9;
  const cardW = cardH * 0.62;
  const cardX = width * 0.5 - cardW / 2;
  const cardY = height * 0.05;

  // Card shadow
  ctx.save();
  ctx.filter = 'blur(16px)';
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(cardX + 10 * scale, cardY + 18 * scale, cardW, cardH);
  ctx.restore();

  // Card body — aged midnight paper
  const cg = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
  cg.addColorStop(0, bgColor);
  cg.addColorStop(1, '#0b0416');
  ctx.fillStyle = cg;
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // Paper texture
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 900; i++) {
      const x = cardX + rng() * cardW;
      const y = cardY + rng() * cardH;
      ctx.fillStyle = rng() > 0.5 ? '#ffe48c' : '#2a1a50';
      ctx.fillRect(x, y, scale, scale);
    }
    ctx.restore();
  }

  // --- Gilt double border with dense tracery band between ---
  const b1 = 10 * scale;
  const b2 = 24 * scale;
  // Outer gilt
  ctx.save();
  ctx.strokeStyle = '#8b6218';
  ctx.lineWidth = 4 * scale;
  ctx.strokeRect(cardX + b1, cardY + b1, cardW - b1 * 2, cardH - b1 * 2);
  // Inner gilt
  ctx.strokeStyle = '#f0c75a';
  ctx.lineWidth = 1.2 * scale;
  ctx.strokeRect(cardX + b2, cardY + b2, cardW - b2 * 2, cardH - b2 * 2);
  // Tracery band (between b1 and b2): repeating ornament glyphs
  ctx.fillStyle = '#f0c75a';
  ctx.font = `${10 * scale}px "EB Garamond", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const trMidY = cardY + (b1 + b2) / 2;
  const trMidYb = cardY + cardH - (b1 + b2) / 2;
  const trMidXl = cardX + (b1 + b2) / 2;
  const trMidXr = cardX + cardW - (b1 + b2) / 2;
  const glyphs = ['✦', '❋', '☿', '✶', '⚹', '❊'];
  const step = 16 * scale;
  for (let x = cardX + b2; x < cardX + cardW - b2; x += step) {
    const g = glyphs[((x / step) | 0) % glyphs.length];
    ctx.fillText(g, x + step / 2, trMidY);
    ctx.fillText(g, x + step / 2, trMidYb);
  }
  for (let y = cardY + b2; y < cardY + cardH - b2; y += step) {
    const g = glyphs[((y / step) | 0) % glyphs.length];
    ctx.fillText(g, trMidXl, y + step / 2);
    ctx.fillText(g, trMidXr, y + step / 2);
  }
  ctx.restore();

  // --- Ornate corner cartouches ---
  const cornerOrn = (cx, cy, rot) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.strokeStyle = '#f0c75a';
    ctx.lineWidth = 1.4 * scale;
    // curl
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(8 * scale, -4 * scale, 24 * scale, -10 * scale, 32 * scale, -30 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-4 * scale, 8 * scale, -10 * scale, 24 * scale, -30 * scale, 32 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(12 * scale, -4 * scale);
    ctx.quadraticCurveTo(24 * scale, -6 * scale, 26 * scale, -18 * scale);
    ctx.stroke();
    ctx.fillStyle = '#f0c75a';
    ctx.beginPath();
    ctx.arc(32 * scale, -30 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-30 * scale, 32 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  cornerOrn(cardX + b2 + 10 * scale, cardY + b2 + 10 * scale, 0);
  cornerOrn(cardX + cardW - b2 - 10 * scale, cardY + b2 + 10 * scale, Math.PI / 2);
  cornerOrn(cardX + cardW - b2 - 10 * scale, cardY + cardH - b2 - 10 * scale, Math.PI);
  cornerOrn(cardX + b2 + 10 * scale, cardY + cardH - b2 - 10 * scale, -Math.PI / 2);

  // --- Inner card area ---
  const iPad = 38 * scale;
  const iX = cardX + iPad;
  const iY = cardY + iPad;
  const iW = cardW - iPad * 2;

  // --- Top: Roman numeral between two filigree dividers ---
  const numeral = toRoman(stars || forks || repoName.length);
  ctx.save();
  ctx.fillStyle = '#e7c86e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${38 * scale}px "Playfair Display", "EB Garamond", serif`;
  const numY = iY + 24 * scale;
  ctx.fillText(numeral, cardX + cardW / 2, numY);

  // Dividers flanking the numeral
  const tm = ctx.measureText(numeral).width;
  ctx.strokeStyle = '#8b6218';
  ctx.lineWidth = 0.8 * scale;
  ctx.beginPath();
  ctx.moveTo(cardX + cardW / 2 - tm / 2 - 10 * scale, numY);
  ctx.lineTo(cardX + cardW / 2 - cardW * 0.35, numY);
  ctx.moveTo(cardX + cardW / 2 + tm / 2 + 10 * scale, numY);
  ctx.lineTo(cardX + cardW / 2 + cardW * 0.35, numY);
  ctx.stroke();
  // End dots
  ctx.fillStyle = '#f0c75a';
  ctx.beginPath();
  ctx.arc(cardX + cardW / 2 - cardW * 0.35, numY, 3 * scale, 0, Math.PI * 2);
  ctx.arc(cardX + cardW / 2 + cardW * 0.35, numY, 3 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- Center mandala / sacred geometry ---
  const vcx = cardX + cardW / 2;
  const vcy = cardY + cardH * 0.44;
  const vR = Math.min(cardW * 0.36, cardH * 0.24);

  // Halo rays (many thin)
  ctx.save();
  ctx.translate(vcx, vcy);
  for (let i = 0; i < 60; i++) {
    ctx.save();
    ctx.rotate((i / 60) * Math.PI * 2);
    ctx.fillStyle = i % 4 === 0 ? '#f0c75a' : i % 2 === 0 ? '#8b6218' : 'rgba(240,199,90,0.5)';
    const rl = (vR * 0.9 + (i % 3) * 6 * scale);
    ctx.fillRect(-0.8 * scale, -rl, 1.6 * scale, rl * 0.35);
    ctx.restore();
  }
  ctx.restore();

  // Outer ring
  ctx.save();
  ctx.strokeStyle = '#8b6218';
  ctx.lineWidth = 1.4 * scale;
  ctx.beginPath();
  ctx.arc(vcx, vcy, vR * 1.05, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#f0c75a';
  ctx.lineWidth = 0.6 * scale;
  ctx.beginPath();
  ctx.arc(vcx, vcy, vR * 1.1, 0, Math.PI * 2);
  ctx.stroke();
  // 12-point zodiac ticks
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const c = Math.cos(a), s = Math.sin(a);
    ctx.strokeStyle = '#f0c75a';
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(vcx + c * vR * 1.05, vcy + s * vR * 1.05);
    ctx.lineTo(vcx + c * vR * 1.18, vcy + s * vR * 1.18);
    ctx.stroke();
  }
  ctx.restore();

  // Inner jewel disc with gradient
  const jg = ctx.createRadialGradient(vcx - vR * 0.3, vcy - vR * 0.35, 0, vcx, vcy, vR);
  jg.addColorStop(0, '#ffe48c');
  jg.addColorStop(0.4, primaryColor);
  jg.addColorStop(1, '#200918');
  ctx.fillStyle = jg;
  ctx.beginPath();
  ctx.arc(vcx, vcy, vR * 0.88, 0, Math.PI * 2);
  ctx.fill();

  // Interlocking triangles (Solomon's seal) in gold
  ctx.save();
  ctx.strokeStyle = '#f0c75a';
  ctx.lineWidth = 1.6 * scale;
  // upright triangle
  ctx.beginPath();
  ctx.moveTo(vcx, vcy - vR * 0.72);
  ctx.lineTo(vcx + vR * 0.62, vcy + vR * 0.36);
  ctx.lineTo(vcx - vR * 0.62, vcy + vR * 0.36);
  ctx.closePath();
  ctx.stroke();
  // inverted
  ctx.beginPath();
  ctx.moveTo(vcx, vcy + vR * 0.72);
  ctx.lineTo(vcx + vR * 0.62, vcy - vR * 0.36);
  ctx.lineTo(vcx - vR * 0.62, vcy - vR * 0.36);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  // Hexagon wreath of tiny stars at the intersections
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + i * (Math.PI / 3);
    const x = vcx + Math.cos(a) * vR * 0.48;
    const y = vcy + Math.sin(a) * vR * 0.48;
    star(ctx, x, y, 6 * scale, 2.5 * scale);
    ctx.fillStyle = '#f0c75a';
    ctx.fill();
  }

  // Inner center coin with the repo initial
  ctx.save();
  const coinR = vR * 0.3;
  const cg2 = ctx.createRadialGradient(vcx - coinR * 0.3, vcy - coinR * 0.35, 0, vcx, vcy, coinR);
  cg2.addColorStop(0, '#fff0b4');
  cg2.addColorStop(0.5, '#f0c75a');
  cg2.addColorStop(1, '#5a3e0a');
  ctx.fillStyle = cg2;
  ctx.beginPath();
  ctx.arc(vcx, vcy, coinR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1a0e08';
  ctx.lineWidth = 1.2 * scale;
  ctx.stroke();

  ctx.fillStyle = '#1a0e08';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 italic ${coinR * 1.1}px "Playfair Display", "EB Garamond", serif`;
  ctx.fillText((repoName || 'X')[0].toUpperCase(), vcx, vcy + 2 * scale);
  ctx.restore();

  // Sketchy orbit rings outside for hand-drawn feel
  ctx.save();
  ctx.strokeStyle = 'rgba(240,199,90,0.5)';
  ctx.lineWidth = 0.6 * scale;
  for (let r = vR * 1.3; r < vR * 1.85; r += vR * 0.1) {
    const segs = 180;
    ctx.beginPath();
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const jitter = (rng() - 0.5) * 1.5;
      const rr = r + jitter;
      const x = vcx + Math.cos(a) * rr;
      const y = vcy + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();

  // Four corner wandering stars inside card
  [
    [vcx - vR * 1.5, vcy - vR * 1.2],
    [vcx + vR * 1.5, vcy - vR * 1.2],
    [vcx - vR * 1.5, vcy + vR * 1.2],
    [vcx + vR * 1.5, vcy + vR * 1.2],
  ].forEach(([x, y]) => {
    star(ctx, x, y, 9 * scale, 3 * scale, 6);
    ctx.fillStyle = '#f0c75a';
    ctx.fill();
    ctx.strokeStyle = '#1a0e08';
    ctx.lineWidth = 0.5 * scale;
    ctx.stroke();
  });

  // --- Beneath center: two apothecary dials for forks / language ---
  const dialY = cardY + cardH * 0.74;
  const dialR = 34 * scale;
  const dials = [
    [cardX + cardW * 0.28, 'VINCULUM', String(forks || '—')],
    [cardX + cardW * 0.72, 'LINGUA', (language || '—').toUpperCase()],
  ];
  dials.forEach(([dx, lab, val]) => {
    ctx.save();
    // Background chalky disc
    ctx.fillStyle = 'rgba(240,199,90,0.06)';
    ctx.beginPath();
    ctx.arc(dx, dialY, dialR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f0c75a';
    ctx.lineWidth = 1.2 * scale;
    ctx.stroke();
    ctx.strokeStyle = '#8b6218';
    ctx.lineWidth = 0.5 * scale;
    ctx.beginPath();
    ctx.arc(dx, dialY, dialR - 4 * scale, 0, Math.PI * 2);
    ctx.stroke();

    // 24 ticks
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const l = i % 6 === 0 ? 6 * scale : 3 * scale;
      ctx.beginPath();
      ctx.moveTo(dx + Math.cos(a) * (dialR - 6 * scale), dialY + Math.sin(a) * (dialR - 6 * scale));
      ctx.lineTo(dx + Math.cos(a) * (dialR - 6 * scale - l), dialY + Math.sin(a) * (dialR - 6 * scale - l));
      ctx.stroke();
    }

    ctx.fillStyle = '#f0c75a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${16 * scale}px "Playfair Display", "EB Garamond", serif`;
    let fs = 16 * scale;
    while (ctx.measureText(val).width > dialR * 1.5 && fs > 8 * scale) {
      fs -= 0.5;
      ctx.font = `900 ${fs}px "Playfair Display", "EB Garamond", serif`;
    }
    ctx.fillText(val, dx, dialY);

    ctx.fillStyle = '#8b6218';
    ctx.font = `italic 500 ${10 * scale}px "EB Garamond", serif`;
    ctx.fillText(lab, dx, dialY + dialR + 14 * scale);
    ctx.restore();
  });

  // --- Bottom title cartouche ---
  const tY = cardY + cardH - 78 * scale;
  ctx.save();
  // cartouche panel
  const tG = ctx.createLinearGradient(0, tY, 0, tY + 42 * scale);
  tG.addColorStop(0, '#1a0e08');
  tG.addColorStop(1, '#0a0408');
  ctx.fillStyle = tG;
  ctx.fillRect(cardX + 28 * scale, tY, cardW - 56 * scale, 42 * scale);
  ctx.strokeStyle = '#f0c75a';
  ctx.lineWidth = 1.2 * scale;
  ctx.strokeRect(cardX + 28 * scale, tY, cardW - 56 * scale, 42 * scale);
  ctx.strokeStyle = '#8b6218';
  ctx.lineWidth = 0.5 * scale;
  ctx.strokeRect(cardX + 32 * scale, tY + 4 * scale, cardW - 64 * scale, 34 * scale);

  // title text
  ctx.fillStyle = '#f4e5bb';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let titleSize = 22 * scale;
  const titleText = '✦  ' + repoName.toUpperCase() + '  ✦';
  ctx.font = `italic 900 ${titleSize}px "Playfair Display", "EB Garamond", serif`;
  while (ctx.measureText(titleText).width > cardW - 80 * scale && titleSize > 10 * scale) {
    titleSize -= 0.5;
    ctx.font = `italic 900 ${titleSize}px "Playfair Display", "EB Garamond", serif`;
  }
  ctx.fillText(titleText, cardX + cardW / 2, tY + 21 * scale);
  ctx.restore();

  // owner subscript
  ctx.save();
  ctx.fillStyle = '#b89968';
  ctx.font = `italic 500 ${12 * scale}px "EB Garamond", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('— divined by ' + (repoOwner || '').toLowerCase() + ' —', cardX + cardW / 2, tY + 56 * scale);
  ctx.restore();

  // --- Side columns: description (left) / supportUrl (right) ---
  // Left, rotated ccw
  ctx.save();
  ctx.translate(width * 0.07, height * 0.5);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#b89968';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `italic 500 ${12 * scale}px "EB Garamond", serif`;
  const left = '✦  ' + description + '  ✦';
  const trim = left.length > 110 ? left.slice(0, 108) + '…' : left;
  ctx.fillText(trim, 0, 0);
  ctx.restore();

  // Right, rotated cw
  if (supportUrl) {
    ctx.save();
    ctx.translate(width * 0.93, height * 0.5);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#b89968';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `italic 500 ${11 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText('◈  ' + supportUrl + '  ◈  anno domini  mmxxvi  ◈', 0, 0);
    ctx.restore();
  }

  // --- Above/below small captions about the card ---
  ctx.save();
  ctx.fillStyle = 'rgba(180,153,104,0.7)';
  ctx.font = `italic 500 ${11 * scale}px "EB Garamond", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('the minor arcana · pulled by ' + (repoOwner || 'the querent'), cardX + cardW / 2, cardY - 2 * scale);
  ctx.fillText('·  ·  ·', cardX + cardW / 2, cardY + cardH + 6 * scale);
  ctx.restore();
};
