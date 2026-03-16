import { wrapText, drawPill } from '../utils';

export const modernEdge = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    secondaryColor,
    bgColor,
    showPattern,
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
    supportUrl,
  } = data;

  // --- Accent gradient used throughout ---
  const accentGrad = ctx.createLinearGradient(0, 0, width, height);
  accentGrad.addColorStop(0, primaryColor);
  accentGrad.addColorStop(0.5, secondaryColor);
  accentGrad.addColorStop(1, primaryColor);

  // --- Glowing orbs (respond to showPattern) ---
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.filter = 'blur(80px)';

  // Top-right orb — primaryColor
  ctx.beginPath();
  ctx.arc(width * 0.75, height * 0.15, 320 * scale, 0, Math.PI * 2);
  ctx.fillStyle = primaryColor;
  ctx.fill();

  // Bottom-left orb — secondaryColor
  ctx.beginPath();
  ctx.arc(width * 0.25, height * 0.85, 260 * scale, 0, Math.PI * 2);
  ctx.fillStyle = secondaryColor;
  ctx.fill();

  ctx.restore();

  // --- Subtle mesh grid (only when showPattern is on) ---
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1 * scale;

    // Diagonal cross-hatch
    const step = 60 * scale;
    for (let i = -height; i < width + height; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i + height, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    ctx.restore();
  }

  const padding = 80 * scale;

  // --- Top accent bar ---
  ctx.save();
  ctx.fillStyle = accentGrad;
  ctx.fillRect(padding, padding - 30 * scale, 60 * scale, 4 * scale);
  ctx.restore();

  // --- Owner path ---
  ctx.fillStyle = primaryColor;
  ctx.font = `600 ${22 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'left';
  ctx.fillText(`${repoOwner} /`, padding, padding + 10 * scale);

  // --- Repo name ---
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${72 * scale}px "Inter", sans-serif`;
  ctx.fillText(repoName, padding, padding + 90 * scale);

  // --- Gradient underline beneath repo name ---
  ctx.save();
  const underlineY = padding + 105 * scale;
  const nameWidth = ctx.measureText(repoName).width;
  ctx.fillStyle = accentGrad;
  ctx.fillRect(padding, underlineY, Math.min(nameWidth, width - padding * 2), 3 * scale);
  ctx.restore();

  // --- Description ---
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = `400 ${26 * scale}px "Inter", sans-serif`;
  const maxWidth = width * 0.55;
  wrapText(ctx, description, padding, padding + 160 * scale, maxWidth, 38 * scale);

  // --- Language badge (left side, above bottom bar) ---
  const bottomY = height - padding;
  drawPill(ctx, padding, bottomY - 50 * scale, language, primaryColor, scale);

  // --- Stars & Forks chips ---
  ctx.textAlign = 'left';
  let chipX = padding;
  const chipY = bottomY;

  const drawChip = (label, value, color) => {
    if (!value) return;
    ctx.font = `700 ${18 * scale}px "JetBrains Mono", monospace`;
    const text = `${value} ${label}`;
    const tw = ctx.measureText(text).width;
    const chipW = tw + 24 * scale;
    const chipH = 32 * scale;

    // Chip background
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY - chipH + 6 * scale, chipW, chipH, 6 * scale);
    ctx.fill();
    ctx.restore();

    // Chip text
    ctx.fillStyle = color;
    ctx.font = `700 ${18 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText(text, chipX + 12 * scale, chipY);
    chipX += chipW + 14 * scale;
  };

  drawChip('Stars', stars, primaryColor);
  drawChip('Forks', forks, secondaryColor);

  // --- Right side: decorative card with bgColor swatch + supportUrl ---
  const cardW = 320 * scale;
  const cardH = 200 * scale;
  const cardX = width - padding - cardW;
  const cardY = height * 0.38;

  // Card background (frosted glass effect)
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 16 * scale);
  ctx.fill();
  ctx.restore();

  // Card border
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 16 * scale);
  ctx.stroke();
  ctx.restore();

  // bgColor swatch inside card
  const swatchSize = 36 * scale;
  const swatchX = cardX + 24 * scale;
  const swatchY = cardY + 24 * scale;

  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.roundRect(swatchX, swatchY, swatchSize, swatchSize, 8 * scale);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // primaryColor swatch
  ctx.save();
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.roundRect(swatchX + swatchSize + 10 * scale, swatchY, swatchSize, swatchSize, 8 * scale);
  ctx.fill();
  ctx.restore();

  // secondaryColor swatch
  ctx.save();
  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.roundRect(swatchX + (swatchSize + 10 * scale) * 2, swatchY, swatchSize, swatchSize, 8 * scale);
  ctx.fill();
  ctx.restore();

  // Label inside card
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = `600 ${12 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'left';
  ctx.fillText('PALETTE', swatchX, swatchY + swatchSize + 22 * scale);

  // Language inside card
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = `700 ${16 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(language, swatchX, swatchY + swatchSize + 50 * scale);

  // Pattern status indicator
  ctx.fillStyle = showPattern ? primaryColor : 'rgba(255,255,255,0.2)';
  ctx.font = `600 ${12 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(
    showPattern ? '● PATTERN ON' : '○ PATTERN OFF',
    swatchX,
    swatchY + swatchSize + 74 * scale,
  );

  // --- Support URL bottom-right ---
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `400 ${18 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText(supportUrl, width - padding, bottomY);
  }

  // --- Corner accents (top-left & bottom-right) ---
  ctx.save();
  ctx.strokeStyle = accentGrad;
  ctx.lineWidth = 2 * scale;
  ctx.globalAlpha = 0.4;

  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(padding - 20 * scale, padding - 40 * scale);
  ctx.lineTo(padding - 20 * scale, padding - 20 * scale);
  ctx.lineTo(padding, padding - 20 * scale);
  ctx.stroke();

  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(width - padding + 20 * scale, height - padding + 40 * scale);
  ctx.lineTo(width - padding + 20 * scale, height - padding + 20 * scale);
  ctx.lineTo(width - padding, height - padding + 20 * scale);
  ctx.stroke();

  ctx.restore();
};
