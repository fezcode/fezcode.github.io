import { wrapText } from '../utils';

/*
 * RISO_PRINT — two-plate risograph print with halftone dithering.
 *
 * Uses all three palette controls meaningfully:
 *   - bgColor        = paper stock (ground)
 *   - primaryColor   = main halftone plate (big circle burst)
 *   - secondaryColor = second plate (bar + burst + title misregistration)
 *
 * Texture toggle switches paper grain and a light halftone field on/off.
 * Ink color auto-adapts so dark paper stays readable.
 */
export const risoPrint = (ctx, width, height, scale, data) => {
  const {
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
    primaryColor,
    secondaryColor,
    bgColor,
    showPattern,
  } = data;

  const mono = '"JetBrains Mono", "Space Mono", monospace';
  const display = '"Abril Fatface", "Didot", "Bodoni 72", Georgia, serif';

  /* Seeded RNG */
  const seed = `${repoOwner || ''}${repoName || ''}`;
  let h = 0xfa_80_72_f0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  }
  const rng = () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };

  /* Auto-contrast ink based on paper luminance */
  const hexToRgb = (hex) => {
    const c = (hex || '#F4EEDA').replace('#', '');
    const f = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
    return {
      r: parseInt(f.slice(0, 2), 16),
      g: parseInt(f.slice(2, 4), 16),
      b: parseInt(f.slice(4, 6), 16),
    };
  };
  const { r, g, b } = hexToRgb(bgColor);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const darkPaper = luminance < 0.5;
  const INK = darkPaper ? '#F4EEDA' : '#1C1817';
  const INK_SOFT = darkPaper ? 'rgba(244,238,218,0.7)' : 'rgba(28,24,23,0.7)';

  /* Paper ground */
  ctx.fillStyle = bgColor || '#F4EEDA';
  ctx.fillRect(0, 0, width, height);

  /* ── Halftone field overlay (texture-toggle-gated) ───────────────
     A wide, low-opacity halftone grid of primary-color dots sweeping
     diagonally gives the print depth. Only when texture is applied. */
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = primaryColor;
    const fieldSpacing = 18 * scale;
    for (let yy = -fieldSpacing; yy < height + fieldSpacing; yy += fieldSpacing) {
      for (let xx = -fieldSpacing; xx < width + fieldSpacing; xx += fieldSpacing) {
        // Gradient from top-left to bottom-right using dot size
        const t = 1 - ((xx + yy) / (width + height));
        const ds = 1.2 * scale + t * 3 * scale;
        ctx.beginPath();
        ctx.arc(xx, yy, ds, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  /* Halftone utility — radial density fall-off */
  const drawHalftone = (cx, cy, r, color, maxDot = 5) => {
    const spacing = 10 * scale;
    ctx.fillStyle = color;
    for (let yy = cy - r; yy < cy + r; yy += spacing) {
      for (let xx = cx - r; xx < cx + r; xx += spacing) {
        const dx = xx - cx;
        const dy = yy - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > r) continue;
        const t = 1 - dist / r;
        const ds = maxDot * scale * (0.3 + t * 0.9);
        ctx.globalAlpha = 0.88;
        ctx.beginPath();
        ctx.arc(xx, yy, ds / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  };

  /* ── Primary-plate halftone: big burst top-right ── */
  drawHalftone(width * 0.74, height * 0.42, height * 0.46, primaryColor, 6);

  /* ── Secondary-plate bar across the top (with misregistration nub) ── */
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.95;
  ctx.fillRect(width * 0.05, height * 0.1, width * 0.9, 8 * scale);
  // Print-misalignment ghost: a faint offset copy
  ctx.globalAlpha = 0.45;
  ctx.fillRect(width * 0.05 + 3 * scale, height * 0.1 + 3 * scale, width * 0.9, 8 * scale);
  ctx.globalAlpha = 1;
  // Tiny secondary square nub on the right of the bar
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(width * 0.9, height * 0.1 - 10 * scale, 12 * scale, 28 * scale);

  /* ── Secondary-plate halftone burst lower-left ── */
  drawHalftone(width * 0.16, height * 0.78, height * 0.28, secondaryColor, 5);

  /* ── Secondary solid geometric mark: a filled square overlapping the
     lower-left burst, creating an opaque + halftone composition ── */
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.9;
  ctx.fillRect(width * 0.06, height * 0.82, 60 * scale, 60 * scale);
  ctx.globalAlpha = 1;

  /* ── Primary mark: a solid circle punctuating the description block ── */
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(width * 0.58, height * 0.72, 18 * scale, 0, Math.PI * 2);
  ctx.fill();

  /* ── Top meta row ── */
  ctx.fillStyle = INK;
  ctx.font = `700 ${14 * scale}px ${mono}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('EDITION 01 / ∞', width * 0.05, height * 0.1 - 14 * scale);

  ctx.font = `700 ${12 * scale}px ${mono}`;
  const stamp = `2-COLOUR · RISO · ${(language || 'MIXED').toUpperCase()}`;
  const stampW = ctx.measureText(stamp).width;
  ctx.fillText(stamp, width - width * 0.05 - stampW, height * 0.1 - 14 * scale);

  /* ── The big misregistered title ── */
  const title = (repoName || 'untitled').toUpperCase();
  const titleY = height * 0.55;
  const titleMaxW = width * 0.9;
  let titleSize = 140 * scale;
  ctx.font = `400 ${titleSize}px ${display}`;
  // Measure-and-shrink so the title always fits inside 90% of canvas width
  while (ctx.measureText(title).width > titleMaxW && titleSize > 24 * scale) {
    titleSize *= 0.94;
    ctx.font = `400 ${titleSize}px ${display}`;
  }

  // Single misregistration ghost in secondary
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.75;
  ctx.fillText(title, width * 0.05 + 6 * scale, titleY + 6 * scale);
  ctx.globalAlpha = 1;

  // Main ink on top
  ctx.fillStyle = INK;
  ctx.fillText(title, width * 0.05, titleY);

  /* Owner handle */
  ctx.fillStyle = INK;
  ctx.font = `700 ${22 * scale}px ${mono}`;
  ctx.fillText(`@ ${(repoOwner || 'anon').toLowerCase()}`, width * 0.05, titleY + 40 * scale);

  /* Description */
  ctx.fillStyle = INK;
  ctx.font = `400 ${20 * scale}px ${mono}`;
  wrapText(ctx, description || '', width * 0.05, titleY + 80 * scale, width * 0.55, 28 * scale);

  /* Bottom meta bar */
  const barY = height * 0.9;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(width * 0.05, barY);
  ctx.lineTo(width * 0.95, barY);
  ctx.stroke();

  ctx.fillStyle = INK;
  ctx.font = `700 ${18 * scale}px ${mono}`;
  const metaY = barY + 28 * scale;

  // Small spot-color swatches with labels — makes all three colors visible in the meta
  ctx.fillStyle = primaryColor;
  ctx.fillRect(width * 0.05, metaY - 14 * scale, 14 * scale, 14 * scale);
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(width * 0.05 + 20 * scale, metaY - 14 * scale, 14 * scale, 14 * scale);

  ctx.fillStyle = INK;
  ctx.fillText(`★ ${stars || 0}`, width * 0.05 + 52 * scale, metaY);
  ctx.fillText(`⑂ ${forks || 0}`, width * 0.22 + 52 * scale, metaY);

  ctx.fillStyle = INK_SOFT;
  ctx.font = `400 ${14 * scale}px ${mono}`;
  const texStatus = showPattern ? 'GRAIN · DOTS' : 'CLEAN';
  ctx.fillText(`TEXTURE · ${texStatus}`, width * 0.45, metaY);

  // Catalog number right
  ctx.fillStyle = INK;
  ctx.font = `700 ${18 * scale}px ${mono}`;
  const catNum = `№ ${String((h >>> 0) % 999).padStart(3, '0')}`;
  const catW = ctx.measureText(catNum).width;
  ctx.fillText(catNum, width - width * 0.05 - catW, metaY);

  /* Registration crosses */
  const drawCross = (cx, cy) => {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1 * scale;
    const rr = 8 * scale;
    ctx.beginPath();
    ctx.moveTo(cx - rr, cy);
    ctx.lineTo(cx + rr, cy);
    ctx.moveTo(cx, cy - rr);
    ctx.lineTo(cx, cy + rr);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, rr - 2 * scale, 0, Math.PI * 2);
    ctx.stroke();
  };
  drawCross(20 * scale, 20 * scale);
  drawCross(width - 20 * scale, 20 * scale);
  drawCross(20 * scale, height - 20 * scale);
  drawCross(width - 20 * scale, height - 20 * scale);

  /* Paper grain — texture-toggle-gated */
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = darkPaper ? 0.07 : 0.05;
    for (let i = 0; i < 2400; i++) {
      const x = rng() * width;
      const y = rng() * height;
      const s = rng() * 1.4 * scale;
      ctx.fillStyle = rng() > 0.5 ? '#000' : '#fff';
      ctx.fillRect(x, y, s, s);
    }
    ctx.restore();
  }
};
