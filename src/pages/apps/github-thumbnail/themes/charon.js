import { wrapText } from '../utils';

// Charon — editorial-dark masthead, modeled on the Charon git server's
// project-page header. Deep ink canvas, signal-lime accents, a serif
// headline against a procedural specimen-plate motif (gradient quadrant
// + dotted arc + tick marks), tiny letter-spaced mono crumb + meta row.
export const charon = (ctx, width, height, scale, data) => {
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

  // Palette — dark editorial. The user's primaryColor becomes the signal
  // accent; secondaryColor optionally tints the canvas.
  const signal = primaryColor || '#C8FF3D';
  const canvas = mixToDark(secondaryColor || '#14130F');
  const canvasSoft = lighten(canvas, 0.04);
  const ink = '#EAE6DD';
  const inkSoft = '#9C968A';
  const inkFaint = '#5C5950';
  const line = '#332F26';

  const serif = '"Tiempos Headline", "Source Serif Pro", "PT Serif", Georgia, serif';
  const mono = '"JetBrains Mono", "Geist Mono", ui-monospace, monospace';

  // 1. Canvas
  ctx.fillStyle = canvas;
  ctx.fillRect(0, 0, width, height);

  // 2. Specimen-plate motif: top-right quadrant, diagonal gradient + arc + ticks.
  //    Drawn first so the masthead types over it cleanly.
  const motifW = width * 0.46;
  const motifH = height * 0.78;
  const motifX = width - motifW;
  const motifY = 0;

  const grad = ctx.createLinearGradient(motifX, motifY, width, motifY + motifH);
  grad.addColorStop(0, canvasSoft);
  grad.addColorStop(1, canvas);
  ctx.fillStyle = grad;
  ctx.fillRect(motifX, motifY, motifW, motifH);

  // Procedural blobs — soft signal echo, very low alpha
  ctx.save();
  const seedish = (repoName || 'charon').length;
  for (let i = 0; i < 4; i++) {
    const cx = motifX + motifW * (0.3 + 0.5 * mulberry(seedish + i));
    const cy = motifY + motifH * (0.2 + 0.6 * mulberry(seedish * 3 + i));
    const r = (60 + 90 * mulberry(seedish * 7 + i)) * scale;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, hexA(signal, 0.10 - i * 0.015));
    g.addColorStop(1, hexA(signal, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Dotted arc through the motif — the "signal sweep"
  ctx.save();
  ctx.strokeStyle = signal;
  ctx.lineWidth = 2 * scale;
  ctx.setLineDash([2 * scale, 8 * scale]);
  ctx.beginPath();
  const arcCx = motifX + motifW * 0.28;
  const arcCy = motifY + motifH * 1.1;
  const arcR = motifW * 0.95;
  ctx.arc(arcCx, arcCy, arcR, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.restore();

  // Tick marks running down the right edge
  ctx.fillStyle = inkFaint;
  for (let i = 0; i < 18; i++) {
    const ty = motifY + 30 * scale + i * 22 * scale;
    if (ty > motifY + motifH - 30 * scale) break;
    const tw = i % 5 === 0 ? 22 * scale : 10 * scale;
    ctx.fillRect(width - 30 * scale - tw, ty, tw, 1.5 * scale);
  }

  // Single signal dot (the "you are here")
  ctx.fillStyle = signal;
  ctx.beginPath();
  ctx.arc(width - 40 * scale, motifY + motifH * 0.62, 5 * scale, 0, Math.PI * 2);
  ctx.fill();

  // 3. Hairline rule under the masthead motif
  ctx.fillStyle = line;
  ctx.fillRect(0, motifY + motifH, width, 1 * scale);

  // 4. Type stack — left column.
  const padX = 64 * scale;

  // Tiny mono crumb: charon  /  owner  /  repo
  ctx.fillStyle = inkSoft;
  ctx.font = `500 ${15 * scale}px ${mono}`;
  ctx.textAlign = 'left';
  const crumb = `charon  /  ${(repoOwner || '').toLowerCase()}  /  ${(repoName || '').toLowerCase()}`;
  letterSpaced(ctx, crumb.toUpperCase(), padX, 56 * scale, 2.4 * scale);

  // Mono label
  ctx.fillStyle = signal;
  ctx.font = `600 ${13 * scale}px ${mono}`;
  letterSpaced(ctx, 'REPOSITORY', padX, 92 * scale, 3 * scale);

  // Big serif repo name
  ctx.fillStyle = ink;
  const nameSize = repoName && repoName.length > 14 ? 90 * scale : 120 * scale;
  ctx.font = `400 ${nameSize}px ${serif}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(repoName || '', padX, motifY + motifH * 0.55);

  // Owner em-rule line
  ctx.fillStyle = inkSoft;
  ctx.font = `italic 400 ${28 * scale}px ${serif}`;
  ctx.fillText(`a repository under @${(repoOwner || '').toLowerCase()}`, padX, motifY + motifH * 0.55 + 50 * scale);

  // Description — serif body, wrapped within the left column.
  if (description) {
    ctx.fillStyle = ink;
    ctx.font = `400 ${30 * scale}px ${serif}`;
    wrapText(
      ctx,
      description,
      padX,
      motifY + motifH * 0.55 + 120 * scale,
      width * 0.48,
      42 * scale,
    );
  }

  // 5. Bottom meta row — mono uppercase, letter-spaced, with bullet separators
  const metaY = height - 70 * scale;
  ctx.fillStyle = line;
  ctx.fillRect(padX, metaY - 28 * scale, width - padX * 2, 1 * scale);

  ctx.font = `600 ${15 * scale}px ${mono}`;
  ctx.fillStyle = inkSoft;
  let mx = padX;
  const writeMeta = (label, value, accent) => {
    ctx.fillStyle = inkFaint;
    const lw = letterSpaced(ctx, label, mx, metaY, 2.4 * scale);
    ctx.fillStyle = accent ? signal : ink;
    const vw = letterSpaced(ctx, ' ' + value, mx + lw, metaY, 2.4 * scale);
    mx += lw + vw + 36 * scale;
  };
  if (stars !== undefined && stars !== null && stars !== '') writeMeta('STARS', String(stars), true);
  if (forks !== undefined && forks !== null && forks !== '') writeMeta('FORKS', String(forks), false);
  if (language) writeMeta('LANG', String(language).toUpperCase(), false);

  // 6. Corner stamp — "CHARON" with a tiny signal square
  ctx.fillStyle = signal;
  ctx.fillRect(width - padX - 92 * scale, metaY - 9 * scale, 9 * scale, 9 * scale);
  ctx.fillStyle = ink;
  ctx.font = `700 ${14 * scale}px ${mono}`;
  letterSpaced(ctx, 'CHARON', width - padX - 78 * scale, metaY, 3.6 * scale);

  // 7. Optional support URL — tiny mono, bottom right under the rule
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = inkFaint;
    ctx.font = `500 ${13 * scale}px ${mono}`;
    ctx.fillText(supportUrl, width - padX, metaY + 22 * scale);
    ctx.textAlign = 'left';
  }
};

// ─── helpers ──────────────────────────────────────────────────────────────

// Hand-roll letter-spacing on a 2D context (canvas has no letterSpacing in
// older browsers); returns the advance width in px.
function letterSpaced(ctx, text, x, y, spacing) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
  return cx - x;
}

// Mulberry32-ish — deterministic 0..1 from an integer seed.
function mulberry(seed) {
  let t = (seed * 1831565813) | 0;
  t = (t + 0x6D2B79F5) | 0;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
}

// Normalize the user-picked secondary into a dark canvas — if they picked
// something light, we collapse it toward ink so the editorial look survives.
function mixToDark(hex) {
  const { r, g, b } = parseHex(hex);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (lum < 60) return hex;
  // pull toward our default ink canvas
  const target = parseHex('#14130F');
  const t = 0.85;
  return rgbToHex(
    Math.round(r * (1 - t) + target.r * t),
    Math.round(g * (1 - t) + target.g * t),
    Math.round(b * (1 - t) + target.b * t),
  );
}

function lighten(hex, amount) {
  const { r, g, b } = parseHex(hex);
  return rgbToHex(
    Math.min(255, Math.round(r + 255 * amount)),
    Math.min(255, Math.round(g + 255 * amount)),
    Math.min(255, Math.round(b + 255 * amount)),
  );
}

function hexA(hex, alpha) {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

function rgbToHex(r, g, b) {
  const h = (n) => n.toString(16).padStart(2, '0');
  return '#' + h(r) + h(g) + h(b);
}
