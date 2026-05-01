import { wrapText } from '../utils';

// Mac Miller — a quiet tribute to the look and feel of Swimming (2018)
// and Circles (2020). Soft sunset gradient (peach to dusty rose to faded
// pool blue), concentric hand-drawn rings echoing the Circles cover, a
// melancholic serif for the title, and warm muted mono crumbs underneath.
// Lowercase by default — the late records didn't shout.
export const macMiller = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    secondaryColor,
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
    supportUrl,
  } = data;

  // Palette — warm dusk over a still pool. The user's primary becomes the
  // ring accent; secondary nudges the sunset.
  const ringInk = primaryColor || '#C16E5C';
  const sunsetTop = secondaryColor && isLight(secondaryColor)
    ? secondaryColor
    : '#F4C9A8';
  const sunsetMid = '#E8A38E';
  const sunsetBottom = '#A8B8C4';
  const cream = '#F2E4D2';
  const ink = '#2B2522';
  const inkSoft = '#5C504A';
  const inkFaint = '#8A7E76';

  const serif = '"Cormorant Garamond", "Iowan Old Style", "EB Garamond", Georgia, serif';
  const mono = '"JetBrains Mono", "Geist Mono", ui-monospace, monospace';

  // 1. Sunset wash — vertical gradient, peach into dusty rose into pool blue.
  const wash = ctx.createLinearGradient(0, 0, 0, height);
  wash.addColorStop(0, sunsetTop);
  wash.addColorStop(0.55, sunsetMid);
  wash.addColorStop(1, sunsetBottom);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  // 2. Soft horizon glow — radial bloom roughly where the sun would sit.
  const glow = ctx.createRadialGradient(
    width * 0.72, height * 0.42, 0,
    width * 0.72, height * 0.42, width * 0.55,
  );
  glow.addColorStop(0, hexA('#FFE8C8', 0.55));
  glow.addColorStop(1, hexA('#FFE8C8', 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // 3. Grain — faint pastel film grain to take the digital edge off.
  ctx.save();
  ctx.globalAlpha = 0.06;
  const grainSeed = (repoName || 'circles').length * 7 + 13;
  for (let i = 0; i < 1400; i++) {
    const gx = mulberry(grainSeed + i) * width;
    const gy = mulberry(grainSeed + i * 3) * height;
    const tone = mulberry(grainSeed + i * 5) > 0.5 ? '#FFFFFF' : '#1A0F0A';
    ctx.fillStyle = tone;
    ctx.fillRect(gx, gy, 1.2 * scale, 1.2 * scale);
  }
  ctx.restore();

  // 4. Concentric rings — the Circles motif, lower-right, hand-drawn-ish wobble.
  const ringCx = width * 0.78;
  const ringCy = height * 0.52;
  const ringMax = Math.min(width, height) * 0.42;
  ctx.save();
  ctx.strokeStyle = ringInk;
  ctx.lineCap = 'round';
  for (let r = ringMax; r > 18 * scale; r -= 22 * scale) {
    const wob = (mulberry(Math.floor(r) + grainSeed) - 0.5) * 6 * scale;
    ctx.globalAlpha = 0.18 + 0.55 * (1 - r / ringMax);
    ctx.lineWidth = (1 + 1.6 * (1 - r / ringMax)) * scale;
    ctx.beginPath();
    // hand-drawn arc — 360° in 36 segments with slight noise
    const seg = 36;
    for (let s = 0; s <= seg; s++) {
      const ang = (s / seg) * Math.PI * 2;
      const noise = (mulberry(Math.floor(r) + s) - 0.5) * 2.4 * scale;
      const px = ringCx + Math.cos(ang) * (r + noise) + wob;
      const py = ringCy + Math.sin(ang) * (r + noise);
      if (s === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();

  // 5. Tiny filled centre dot — the still point.
  ctx.fillStyle = ringInk;
  ctx.beginPath();
  ctx.arc(ringCx, ringCy, 5 * scale, 0, Math.PI * 2);
  ctx.fill();

  // 6. Lap lane — a single soft horizontal line near the bottom, swimming-pool
  //    nod. Pale, feathered.
  ctx.save();
  ctx.strokeStyle = hexA('#FFFFFF', 0.35);
  ctx.lineWidth = 2 * scale;
  ctx.setLineDash([14 * scale, 18 * scale]);
  ctx.beginPath();
  ctx.moveTo(0, height * 0.86);
  ctx.lineTo(width, height * 0.86);
  ctx.stroke();
  ctx.restore();

  // 7. Type stack — left column. Lowercase by default; this isn't loud music.
  const padX = 64 * scale;

  // Tiny mono crumb at top
  ctx.fillStyle = inkFaint;
  ctx.font = `500 ${15 * scale}px ${mono}`;
  ctx.textAlign = 'left';
  letterSpaced(
    ctx,
    `side a  /  ${(repoOwner || '').toLowerCase()}`,
    padX,
    62 * scale,
    2.6 * scale,
  );

  // Track-number style label
  ctx.fillStyle = ringInk;
  ctx.font = `italic 600 ${16 * scale}px ${serif}`;
  ctx.fillText('track 01.', padX, 100 * scale);

  // The title — soft serif, italic, lowercase, generous size
  ctx.fillStyle = ink;
  const titleRaw = (repoName || '').toLowerCase();
  const titleSize = titleRaw.length > 14 ? 96 * scale : 124 * scale;
  ctx.font = `italic 400 ${titleSize}px ${serif}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(titleRaw, padX, height * 0.52);

  // A handwritten-feel attribution under the title
  ctx.fillStyle = inkSoft;
  ctx.font = `italic 400 ${28 * scale}px ${serif}`;
  ctx.fillText(
    `— a record by ${(repoOwner || '').toLowerCase()}`,
    padX,
    height * 0.52 + 46 * scale,
  );

  // Liner-note description, narrow column
  if (description) {
    ctx.fillStyle = ink;
    ctx.font = `400 ${26 * scale}px ${serif}`;
    wrapText(
      ctx,
      description,
      padX,
      height * 0.52 + 110 * scale,
      width * 0.46,
      38 * scale,
    );
  }

  // 8. Bottom liner — mono uppercase, letter-spaced, faded.
  const linerY = height - 64 * scale;
  ctx.font = `600 ${14 * scale}px ${mono}`;
  let mx = padX;
  const writeMeta = (label, value) => {
    ctx.fillStyle = inkFaint;
    const lw = letterSpaced(ctx, label, mx, linerY, 2.4 * scale);
    ctx.fillStyle = ink;
    const vw = letterSpaced(ctx, ' ' + value, mx + lw, linerY, 2.4 * scale);
    mx += lw + vw + 36 * scale;
  };
  if (stars !== undefined && stars !== null && stars !== '') writeMeta('LISTENS', String(stars));
  if (forks !== undefined && forks !== null && forks !== '') writeMeta('PRESSED', String(forks));
  if (language) writeMeta('IN', String(language).toUpperCase());

  // 9. Corner stamp — a tiny dedication, low-contrast.
  ctx.textAlign = 'right';
  ctx.fillStyle = inkFaint;
  ctx.font = `italic 400 ${15 * scale}px ${serif}`;
  ctx.fillText('for malcolm.', width - padX, linerY);

  if (supportUrl) {
    ctx.fillStyle = inkFaint;
    ctx.font = `500 ${12 * scale}px ${mono}`;
    ctx.fillText(supportUrl, width - padX, linerY + 22 * scale);
  }
  ctx.textAlign = 'left';
};

// ─── helpers ──────────────────────────────────────────────────────────────

function letterSpaced(ctx, text, x, y, spacing) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
  return cx - x;
}

function mulberry(seed) {
  let t = (seed * 1831565813) | 0;
  t = (t + 0x6D2B79F5) | 0;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
}

function hexA(hex, alpha) {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function isLight(hex) {
  const { r, g, b } = parseHex(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 170;
}

function parseHex(hex) {
  const h = (hex || '#000').replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return {
    r: parseInt(full.slice(0, 2), 16) || 0,
    g: parseInt(full.slice(2, 4), 16) || 0,
    b: parseInt(full.slice(4, 6), 16) || 0,
  };
}
