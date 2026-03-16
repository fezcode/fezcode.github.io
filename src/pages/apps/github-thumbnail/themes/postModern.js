import { wrapText } from '../utils';

export const postModern = (ctx, width, height, scale, data) => {
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

  // --- Deconstructed color blocks ---
  // Large diagonal primary slab
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(width * 0.55, 0);
  ctx.lineTo(width, 0);
  ctx.lineTo(width, height * 0.7);
  ctx.lineTo(width * 0.35, height * 0.45);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Secondary color wedge bottom-left
  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.5);
  ctx.lineTo(width * 0.4, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Small accent rectangle (floating)
  ctx.save();
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.7;
  ctx.translate(width * 0.78, height * 0.12);
  ctx.rotate(-0.12);
  ctx.fillRect(0, 0, 90 * scale, 90 * scale);
  ctx.restore();

  // Secondary circle
  ctx.save();
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.arc(width * 0.15, height * 0.25, 80 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // bgColor block — bottom right corner accent
  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.globalAlpha = 0.5;
  ctx.fillRect(width - 180 * scale, height - 120 * scale, 180 * scale, 120 * scale);
  ctx.restore();

  // --- Deconstructed grid / ruling (showPattern) ---
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1 * scale;

    // Irregular horizontal rules at random-ish intervals
    const rules = [0.18, 0.33, 0.47, 0.62, 0.78, 0.91];
    rules.forEach((r) => {
      ctx.beginPath();
      ctx.moveTo(0, height * r);
      ctx.lineTo(width, height * r);
      ctx.stroke();
    });

    // A few vertical cuts
    const vcuts = [0.22, 0.52, 0.73];
    vcuts.forEach((v) => {
      ctx.beginPath();
      ctx.moveTo(width * v, 0);
      ctx.lineTo(width * v, height);
      ctx.stroke();
    });

    ctx.restore();

    // Scattered tiny marks
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 30; i++) {
      const mx = ((i * 7919 + 31) % 100) / 100 * width;
      const my = ((i * 6271 + 17) % 100) / 100 * height;
      ctx.fillRect(mx, my, 3 * scale, 3 * scale);
    }
    ctx.restore();
  }

  const padding = 80 * scale;

  // --- Oversized rotated repo name (background text) ---
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${220 * scale}px "Inter", sans-serif`;
  ctx.translate(width * 0.5, height * 0.55);
  ctx.rotate(-0.08);
  ctx.textAlign = 'center';
  ctx.fillText(repoName.toUpperCase(), 0, 0);
  ctx.restore();

  // --- Owner — small, rotated sideways on the left edge ---
  ctx.save();
  ctx.fillStyle = secondaryColor;
  ctx.font = `600 ${14 * scale}px "JetBrains Mono", monospace`;
  ctx.translate(padding - 40 * scale, height * 0.55);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText(repoOwner.toUpperCase(), 0, 0);
  ctx.restore();

  // --- Main repo name — deconstructed, split across two lines ---
  ctx.textAlign = 'left';
  const nameChars = repoName.split('');
  const midPoint = Math.ceil(nameChars.length / 2);
  const topHalf = repoName.slice(0, midPoint);
  const bottomHalf = repoName.slice(midPoint);

  // Top half — large bold
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${88 * scale}px "Inter", sans-serif`;
  ctx.fillText(topHalf, padding, padding + 80 * scale);

  // Bottom half — shifted right, different weight
  ctx.fillStyle = primaryColor;
  ctx.font = `300 ${88 * scale}px "Inter", sans-serif`;
  const topW = ctx.measureText(topHalf).width;
  ctx.font = `300 ${88 * scale}px "Inter", sans-serif`;
  ctx.fillText(bottomHalf, padding + 60 * scale, padding + 170 * scale);

  // Strikethrough line across the name (deconstructed element)
  ctx.save();
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 3 * scale;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(padding, padding + 105 * scale);
  ctx.lineTo(padding + topW + 40 * scale, padding + 105 * scale);
  ctx.stroke();
  ctx.restore();

  // --- Description — in a semi-transparent box ---
  const descBoxX = padding;
  const descBoxY = padding + 210 * scale;
  const descBoxW = width * 0.48;

  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.3;
  ctx.fillRect(descBoxX, descBoxY, descBoxW, 100 * scale);
  ctx.restore();

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `300 ${22 * scale}px "Inter", sans-serif`;
  wrapText(ctx, description, descBoxX + 16 * scale, descBoxY + 30 * scale, descBoxW - 32 * scale, 32 * scale);

  // --- Language — large, rotated, overlapping ---
  ctx.save();
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.15;
  ctx.font = `900 ${120 * scale}px "Inter", sans-serif`;
  ctx.translate(width * 0.72, height * 0.68);
  ctx.rotate(0.15);
  ctx.textAlign = 'center';
  ctx.fillText(language.toUpperCase(), 0, 0);
  ctx.restore();

  // Language small label
  ctx.fillStyle = '#ffffff';
  ctx.font = `600 ${16 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'left';
  ctx.globalAlpha = 0.6;
  ctx.fillText(`[ ${language} ]`, width * 0.62, height - padding - 60 * scale);
  ctx.globalAlpha = 1;

  // --- Stats — scattered, different sizes ---
  const bottomY = height - padding;

  if (stars) {
    // Stars — big number
    ctx.fillStyle = primaryColor;
    ctx.font = `900 ${52 * scale}px "Inter", sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(stars, padding, bottomY - 10 * scale);

    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = `300 ${16 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText('stars', padding + ctx.measureText(stars).width + 10 * scale, bottomY - 10 * scale);

    // Reset font for stars measurement
    ctx.font = `900 ${52 * scale}px "Inter", sans-serif`;
  }

  if (forks) {
    // Forks — smaller, offset
    const forksX = padding + 220 * scale;
    ctx.fillStyle = secondaryColor;
    ctx.font = `900 ${36 * scale}px "Inter", sans-serif`;
    ctx.fillText(forks, forksX, bottomY - 16 * scale);

    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = `300 ${14 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText('forks', forksX + ctx.measureText(forks).width + 8 * scale, bottomY - 16 * scale);

    ctx.font = `900 ${36 * scale}px "Inter", sans-serif`;
  }

  // --- Color swatches — stacked vertically on far right ---
  const swatchX = width - padding - 20 * scale;
  const swatchS = 24 * scale;
  [bgColor, primaryColor, secondaryColor].forEach((color, i) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(swatchX, padding + i * (swatchS + 8 * scale));
    ctx.rotate(0.05 * (i - 1));
    ctx.fillRect(0, 0, swatchS, swatchS);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(0, 0, swatchS, swatchS);
    ctx.restore();
  });

  // --- Pattern status — tiny rotated label ---
  ctx.save();
  ctx.fillStyle = showPattern ? primaryColor : 'rgba(255,255,255,0.15)';
  ctx.font = `600 ${10 * scale}px "JetBrains Mono", monospace`;
  ctx.translate(width - padding + 10 * scale, height * 0.45);
  ctx.rotate(Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText(showPattern ? 'TEXTURE:ON' : 'TEXTURE:OFF', 0, 0);
  ctx.restore();

  // --- Support URL — bottom right, muted ---
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = `300 ${15 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText(supportUrl, width - padding, bottomY);
  }

  // --- Decorative slash marks (post-modern accent) ---
  ctx.save();
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 2 * scale;
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 4; i++) {
    const sx = padding + 10 * scale + i * 14 * scale;
    ctx.beginPath();
    ctx.moveTo(sx, padding + 190 * scale);
    ctx.lineTo(sx + 10 * scale, padding + 205 * scale);
    ctx.stroke();
  }
  ctx.restore();
};
