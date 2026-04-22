import { wrapText } from '../utils';

/*
 * ATELIER_GALLERY — a museum wall-label composition.
 *
 * Cream paper with a gilt hairline frame. Left: a painterly composition of
 * overlapping color blocks using the palette. Right: a gallery plaque with
 * accession number, italic wordmark, dimensions, medium, and descriptive
 * caption set in EB Garamond. Signature move: a small jade period after the
 * repo name and a faint jade seal in the corner.
 */
export const atelierGallery = (ctx, width, height, scale, data) => {
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

  const WALL = '#E4D9D6';
  const PAPER = '#F5EFEC';
  const PAPER_SOFT = '#EEE7E2';
  const INK = '#2D1F2E';
  const INK_SOFT = '#6B5A65';
  const JADE = '#3F7D6B';
  const GILT = '#B89968';

  const serif = '"EB Garamond", "Iowan Old Style", serif';
  const sans = '"Nunito", system-ui, sans-serif';

  /* Seeded RNG for deterministic composition */
  const seed = `${repoOwner || ''}${repoName || ''}`;
  let h = 0xb8_99_68_f0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  }
  const rng = () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };

  /* Paper ground with a faint mauve wash at the edges */
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, width, height);
  const wash = ctx.createRadialGradient(
    width * 0.5,
    height * 0.5,
    width * 0.2,
    width * 0.5,
    height * 0.5,
    width * 0.75,
  );
  wash.addColorStop(0, 'rgba(228,217,214,0)');
  wash.addColorStop(1, 'rgba(228,217,214,0.45)');
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);

  /* Subtle paper grain */
  ctx.save();
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < 1400; i++) {
    const x = rng() * width;
    const y = rng() * height;
    const s = rng() * 1.5 * scale;
    ctx.fillStyle = rng() > 0.5 ? '#000' : '#fff';
    ctx.fillRect(x, y, s, s);
  }
  ctx.restore();

  /* Gilt hairline frame, inset */
  const inset = 36 * scale;
  ctx.strokeStyle = GILT;
  ctx.lineWidth = 1 * scale;
  ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);

  /* Layout split: left composition 40%, right label 60% */
  const padX = 60 * scale;
  const padY = 60 * scale;
  const splitX = width * 0.42;

  /* ── LEFT: painterly composition ── */
  ctx.save();
  ctx.beginPath();
  ctx.rect(padX, padY, splitX - padX - 20 * scale, height - padY * 2);
  ctx.clip();

  // Large ground block (bg color)
  ctx.fillStyle = bgColor;
  ctx.fillRect(padX, padY, splitX - padX - 20 * scale, height - padY * 2);

  // Overlapping primary rectangle
  const pW = (splitX - padX - 20 * scale) * (0.55 + rng() * 0.15);
  const pH = (height - padY * 2) * (0.55 + rng() * 0.15);
  const pX = padX + (splitX - padX - 20 * scale - pW) * rng();
  const pY = padY + (height - padY * 2 - pH) * rng();
  ctx.fillStyle = primaryColor;
  ctx.fillRect(pX, pY, pW, pH);

  // Smaller secondary circle or square
  const sSize = (height - padY * 2) * (0.3 + rng() * 0.1);
  const sX = padX + rng() * (splitX - padX - sSize - 20 * scale);
  const sY = padY + rng() * (height - padY * 2 - sSize);
  ctx.fillStyle = secondaryColor;
  if (rng() > 0.5) {
    ctx.beginPath();
    ctx.arc(sX + sSize / 2, sY + sSize / 2, sSize / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(sX, sY, sSize, sSize);
  }

  // Jade punctuation — a tiny square
  const jSize = 18 * scale;
  ctx.fillStyle = JADE;
  ctx.fillRect(
    padX + (splitX - padX - 20 * scale) - jSize - 24 * scale,
    padY + (height - padY * 2) - jSize - 24 * scale,
    jSize,
    jSize,
  );

  ctx.restore();

  // Gilt frame around the composition
  ctx.strokeStyle = GILT;
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(padX, padY, splitX - padX - 20 * scale, height - padY * 2);

  /* ── RIGHT: the wall label ── */
  const labelX = splitX + 40 * scale;
  const labelW = width - labelX - padX;
  let y = padY + 20 * scale;

  // Accession number
  ctx.fillStyle = INK_SOFT;
  ctx.font = `400 ${14 * scale}px ${sans}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('ACCESSION', labelX, y);
  ctx.fillStyle = INK;
  ctx.font = `italic 400 ${28 * scale}px ${serif}`;
  ctx.fillText(
    `№ ${String((h >>> 0) % 999).padStart(3, '0')} / MMXXVI`,
    labelX,
    y + 32 * scale,
  );
  y += 70 * scale;

  // Hairline
  ctx.strokeStyle = 'rgba(45,31,46,0.2)';
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(labelX, y);
  ctx.lineTo(labelX + labelW, y);
  ctx.stroke();
  y += 26 * scale;

  // Small-caps collection kicker
  ctx.fillStyle = INK_SOFT;
  ctx.font = `600 ${13 * scale}px ${sans}`;
  ctx.fillText('THE FEZCODEX COLLECTION', labelX, y);
  y += 36 * scale;

  // Repo name — italic Garamond with jade period
  ctx.fillStyle = INK;
  const titleSize = Math.min(72, 560 / Math.max(repoName.length, 8)) * scale;
  ctx.font = `italic 400 ${titleSize}px ${serif}`;
  const titleText = repoName || 'untitled';
  ctx.fillText(titleText, labelX, y + titleSize * 0.75);
  const titleW = ctx.measureText(titleText).width;
  ctx.fillStyle = JADE;
  ctx.fillText('.', labelX + titleW, y + titleSize * 0.75);
  y += titleSize + 14 * scale;

  // By-line
  ctx.fillStyle = INK_SOFT;
  ctx.font = `italic 400 ${22 * scale}px ${serif}`;
  ctx.fillText(`by ${repoOwner || 'anonymous'}`, labelX, y);
  y += 44 * scale;

  // Caption — wrapped Garamond italic
  ctx.fillStyle = INK;
  ctx.font = `italic 400 ${20 * scale}px ${serif}`;
  wrapText(ctx, description || '', labelX, y, labelW, 28 * scale);
  y += 28 * scale * 3.3;

  // Bottom hairline
  ctx.strokeStyle = 'rgba(45,31,46,0.2)';
  ctx.beginPath();
  ctx.moveTo(labelX, height - padY - 70 * scale);
  ctx.lineTo(labelX + labelW, height - padY - 70 * scale);
  ctx.stroke();

  // Bottom meta row — 3 columns: medium, dimensions, provenance
  const metaY = height - padY - 36 * scale;
  ctx.fillStyle = INK_SOFT;
  ctx.font = `600 ${11 * scale}px ${sans}`;

  // Medium
  ctx.fillText('MEDIUM', labelX, metaY - 18 * scale);
  ctx.fillStyle = INK;
  ctx.font = `italic 400 ${18 * scale}px ${serif}`;
  ctx.fillText(language || '—', labelX, metaY + 4 * scale);

  // Stars
  const col2 = labelX + labelW * 0.38;
  ctx.fillStyle = INK_SOFT;
  ctx.font = `600 ${11 * scale}px ${sans}`;
  ctx.fillText('STARS', col2, metaY - 18 * scale);
  ctx.fillStyle = INK;
  ctx.font = `italic 400 ${18 * scale}px ${serif}`;
  ctx.fillText(stars || '0', col2, metaY + 4 * scale);

  // Forks
  const col3 = labelX + labelW * 0.62;
  ctx.fillStyle = INK_SOFT;
  ctx.font = `600 ${11 * scale}px ${sans}`;
  ctx.fillText('FORKS', col3, metaY - 18 * scale);
  ctx.fillStyle = INK;
  ctx.font = `italic 400 ${18 * scale}px ${serif}`;
  ctx.fillText(forks || '0', col3, metaY + 4 * scale);

  // Provenance
  ctx.fillStyle = INK_SOFT;
  ctx.font = `600 ${11 * scale}px ${sans}`;
  ctx.fillText('PROVENANCE', labelX + labelW * 0.78, metaY - 18 * scale);
  ctx.fillStyle = INK;
  ctx.font = `italic 400 ${18 * scale}px ${serif}`;
  ctx.fillText('github', labelX + labelW * 0.78, metaY + 4 * scale);

  /* Jade seal in lower-right corner */
  const sealR = 28 * scale;
  const sealX = width - padX - sealR - 4 * scale;
  const sealY = padY + sealR + 4 * scale;
  ctx.strokeStyle = JADE;
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR - 4 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = JADE;
  ctx.font = `italic 400 ${18 * scale}px ${serif}`;
  ctx.textAlign = 'center';
  ctx.fillText('ƒ', sealX, sealY + 6 * scale);
  ctx.textAlign = 'left';

  /* Tiny atelier signature at bottom-left of label area */
  ctx.fillStyle = PAPER_SOFT; // drop-dummy for completeness
  ctx.fillStyle = INK_SOFT;
  ctx.font = `italic 400 ${13 * scale}px ${serif}`;
  ctx.fillText('the atelier, mmxxvi', labelX, height - padY - 6 * scale);
};
