import { wrapText } from '../utils';

export const neon = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    secondaryColor,
    repoName,
    description,
    language,
    stars,
    forks,
    supportUrl,
  } = data;
  // Neon Cyber Style (Unchanged)
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 10 * scale;
  ctx.beginPath();
  for (let i = -height; i < width; i += 40 * scale) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
  }
  ctx.stroke();
  ctx.restore();

  const padding = 80 * scale;

  ctx.shadowBlur = 20 * scale;
  ctx.shadowColor = secondaryColor;
  ctx.fillStyle = secondaryColor;

  ctx.font = `900 ${100 * scale}px "Arial Black", sans-serif`;
  ctx.textAlign = 'left';

  ctx.fillStyle = secondaryColor;
  ctx.fillText(
    repoName.toUpperCase(),
    padding - 4 * scale,
    padding + 100 * scale,
  );
  ctx.fillStyle = primaryColor;
  ctx.fillText(
    repoName.toUpperCase(),
    padding + 4 * scale,
    padding + 100 * scale,
  );

  ctx.fillStyle = 'white';
  ctx.shadowBlur = 30 * scale;
  ctx.shadowColor = primaryColor;
  ctx.fillText(repoName.toUpperCase(), padding, padding + 100 * scale);

  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 4 * scale;
  ctx.beginPath();
  ctx.moveTo(padding, padding + 140 * scale);
  ctx.lineTo(width - padding, padding + 140 * scale);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = `${30 * scale}px "Courier New", monospace`;
  wrapText(
    ctx,
    description,
    padding,
    padding + 220 * scale,
    width - padding * 2,
    40 * scale,
  );

  const bottomY = height - padding;

  const drawNeonBox = (text, x, color) => {
    ctx.shadowBlur = 10 * scale;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 * scale;

    const w = ctx.measureText(text).width + 40 * scale;
    const h = 50 * scale;

    ctx.strokeRect(x, bottomY - h, w, h);

    ctx.fillStyle = color;
    ctx.fillText(text, x + 20 * scale, bottomY - 15 * scale);
    return w + 20 * scale;
  };

  ctx.font = `bold ${24 * scale}px "Courier New", monospace`;
  let currentX = padding;

  currentX += drawNeonBox(language.toUpperCase(), currentX, primaryColor);
  if (stars) currentX += drawNeonBox(`${stars} ★`, currentX, secondaryColor);
  if (forks) drawNeonBox(`${forks} ⑂`, currentX, secondaryColor);

  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = 'white';
    ctx.shadowBlur = 10 * scale;
    ctx.shadowColor = 'white';
    ctx.fillText(supportUrl, width - padding, bottomY - 15 * scale);
  }
};
