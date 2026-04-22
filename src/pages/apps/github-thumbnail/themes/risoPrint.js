import { wrapText } from '../utils';

/*
 * RISO_PRINT — two-color risograph print with halftone dithering and a
 * slight color misregistration. Matte off-white paper, chunky geometric
 * sans title with a secondary-color offset shadow, halftone dot shapes
 * bleeding under the type, corner print metadata. Uses primary + secondary
 * + bg as the "spot colors."
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
  } = data;

  const PAPER = '#F4EEDA';
  const INK = '#1C1817';

  const mono = '"JetBrains Mono", "Space Mono", monospace';
  const display = '"Syne", "Inter", system-ui, sans-serif';

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

  /* Paper ground */
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, width, height);

  /* Halftone circle — primary color, dithered */
  const drawHalftone = (cx, cy, r, color) => {
    const dotSize = 4 * scale;
    const spacing = 10 * scale;
    ctx.fillStyle = color;
    for (let y = cy - r; y < cy + r; y += spacing) {
      for (let x = cx - r; x < cx + r; x += spacing) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > r) continue;
        // dot size shrinks near edge for the gradient feel
        const t = 1 - dist / r;
        const ds = dotSize * (0.4 + t * 0.8);
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(x, y, ds / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  };

  /* Big primary-color halftone circle on the right */
  drawHalftone(width * 0.72, height * 0.45, height * 0.42, primaryColor);

  /* Smaller secondary halftone burst lower-left */
  drawHalftone(width * 0.15, height * 0.85, height * 0.25, secondaryColor);

  /* Solid secondary-color geometric bar on top */
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.92;
  ctx.fillRect(width * 0.05, height * 0.08, width * 0.9, 6 * scale);
  ctx.fillRect(width * 0.05, height * 0.08 + 14 * scale, width * 0.45, 2 * scale);
  ctx.globalAlpha = 1;

  /* Top-left print metadata */
  ctx.fillStyle = INK;
  ctx.font = `700 ${14 * scale}px ${mono}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('EDITION 01 / ∞', width * 0.05, height * 0.08 - 14 * scale);

  /* Top-right stamp: PRINT SPECS */
  ctx.font = `700 ${12 * scale}px ${mono}`;
  const stamp = `2-COLOUR · RISO · ${language || 'MIXED'}`.toUpperCase();
  const stampW = ctx.measureText(stamp).width;
  ctx.fillStyle = INK;
  ctx.fillText(stamp, width - width * 0.05 - stampW, height * 0.08 - 14 * scale);

  /* ── The big title — with misregistration offset ── */
  const title = (repoName || 'untitled').toUpperCase();
  const titleSize = Math.min(180, 1200 / Math.max(title.length, 6)) * scale;
  const titleY = height * 0.55;

  // Offset ghost in secondary color
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.75;
  ctx.font = `800 ${titleSize}px ${display}`;
  ctx.fillText(title, width * 0.05 + 6 * scale, titleY + 6 * scale);
  ctx.globalAlpha = 1;

  // Main ink
  ctx.fillStyle = INK;
  ctx.fillText(title, width * 0.05, titleY);

  /* Owner tag — mono, tight */
  ctx.fillStyle = INK;
  ctx.font = `700 ${22 * scale}px ${mono}`;
  ctx.fillText(
    `@ ${repoOwner || 'anon'}`.toLowerCase(),
    width * 0.05,
    titleY + 40 * scale,
  );

  /* Description — wrapped mono */
  ctx.fillStyle = INK;
  ctx.font = `400 ${20 * scale}px ${mono}`;
  wrapText(
    ctx,
    description || '',
    width * 0.05,
    titleY + 80 * scale,
    width * 0.55,
    28 * scale,
  );

  /* Bottom meta bar — three mono data blocks */
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
  ctx.fillText(`★ ${stars || 0}`, width * 0.05, metaY);
  ctx.fillText(`⑂ ${forks || 0}`, width * 0.22, metaY);
  ctx.fillText(
    (language || 'MIXED').toUpperCase(),
    width * 0.38,
    metaY,
  );

  // Right side: small catalog number
  const catNum = `№ ${String((h >>> 0) % 999).padStart(3, '0')}`;
  const catW = ctx.measureText(catNum).width;
  ctx.fillText(catNum, width - width * 0.05 - catW, metaY);

  /* Print registration marks — classic riso corner crosses */
  const drawCross = (cx, cy) => {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1 * scale;
    const r = 8 * scale;
    ctx.beginPath();
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 2 * scale, 0, Math.PI * 2);
    ctx.stroke();
  };
  drawCross(20 * scale, 20 * scale);
  drawCross(width - 20 * scale, 20 * scale);
  drawCross(20 * scale, height - 20 * scale);
  drawCross(width - 20 * scale, height - 20 * scale);

  /* Final paper grain noise on top of everything */
  ctx.save();
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 2400; i++) {
    const x = rng() * width;
    const y = rng() * height;
    const s = rng() * 1.4 * scale;
    ctx.fillStyle = rng() > 0.5 ? '#000' : '#fff';
    ctx.fillRect(x, y, s, s);
  }
  ctx.restore();

  /* Bg color accent: a thin stripe on the left edge using bgColor so the
     control remains meaningful even on a light riso print. */
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 6 * scale, height);
};
