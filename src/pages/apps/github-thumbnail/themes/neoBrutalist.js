import { wrapText } from '../utils';

export const neoBrutalist = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    secondaryColor,
    bgColor,
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
  } = data;

  const padding = 60 * scale;

  // 1. Background (using bgColor)
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Bold Shapes (Neo-Brutalist elements)
  ctx.save();
  // Large circle in background
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.3, 200 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Secondary color accent block with shadow
  const shadowOffset = 15 * scale;
  ctx.fillStyle = '#000000';
  ctx.fillRect(padding + shadowOffset, padding + 120 * scale + shadowOffset, 400 * scale, 80 * scale);
  ctx.fillStyle = secondaryColor;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4 * scale;
  ctx.fillRect(padding, padding + 120 * scale, 400 * scale, 80 * scale);
  ctx.strokeRect(padding, padding + 120 * scale, 400 * scale, 80 * scale);
  ctx.restore();

  // 3. Main Title (Repo Name) with Heavy Shadow
  ctx.save();
  ctx.font = `900 ${120 * scale}px "Inter", "Arial Black", sans-serif`;
  ctx.textAlign = 'left';

  // Text Shadow (Offset)
  ctx.fillStyle = '#000000';
  ctx.fillText(repoName, padding + 10 * scale, padding + 320 * scale);

  // Main Text
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4 * scale;
  ctx.fillText(repoName, padding, padding + 310 * scale);
  ctx.strokeText(repoName, padding, padding + 310 * scale);
  ctx.restore();

  // 4. Repo Owner (Pill style)
  ctx.font = `bold ${30 * scale}px "JetBrains Mono", monospace`;
  const ownerW = ctx.measureText(repoOwner.toUpperCase()).width + 40 * scale;
  ctx.fillStyle = '#000000';
  ctx.fillRect(padding + 5 * scale, padding + 5 * scale, ownerW, 60 * scale);
  ctx.fillStyle = primaryColor;
  ctx.fillRect(padding, padding, ownerW, 60 * scale);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3 * scale;
  ctx.strokeRect(padding, padding, ownerW, 60 * scale);

  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText(repoOwner.toUpperCase(), padding + ownerW / 2, padding + 42 * scale);

  // 5. Description
  ctx.save();
  ctx.textAlign = 'left';
  ctx.font = `bold ${32 * scale}px "Inter", sans-serif`;
  ctx.fillStyle = '#ffffff';
  wrapText(
    ctx,
    description,
    padding,
    padding + 400 * scale,
    width - padding * 2,
    45 * scale
  );
  ctx.restore();

  // 6. Footer Stats (Cards)
  const statBoxW = 180 * scale;
  const statBoxH = 100 * scale;
  const startX = padding;
  const startY = height - padding - statBoxH;

  const drawNeoStat = (x, y, label, value, color) => {
    if (!value) return;
    // Shadow
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 10 * scale, y + 10 * scale, statBoxW, statBoxH);
    // Box
    ctx.fillStyle = color;
    ctx.fillRect(x, y, statBoxW, statBoxH);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4 * scale;
    ctx.strokeRect(x, y, statBoxW, statBoxH);

    // Text
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${18 * scale}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(label, x + statBoxW / 2, y + 35 * scale);
    ctx.font = `900 ${32 * scale}px "Inter", sans-serif`;
    ctx.fillText(value, x + statBoxW / 2, y + 75 * scale);
  };

  drawNeoStat(startX, startY, 'STARS', stars, primaryColor);
  drawNeoStat(startX + statBoxW + 40 * scale, startY, 'FORKS', forks, secondaryColor);
  drawNeoStat(startX + (statBoxW + 40 * scale) * 2, startY, 'LANG', language.toUpperCase(), '#ffffff');
};
