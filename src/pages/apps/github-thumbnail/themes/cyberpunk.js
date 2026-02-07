import { wrapText } from '../utils';

export const cyberpunk = (ctx, width, height, scale, data) => {
  const { repoOwner, repoName, description, language, stars, forks } = data;
  // CYBERPUNK_2077
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, width, height);

  // Glitch lines background
  ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
  for (let i = 0; i < height; i += 4 * scale) {
    if (Math.random() > 0.9) ctx.fillRect(0, i, width, 2 * scale);
  }

  const padding = 60 * scale;

  // Yellow Frame
  ctx.strokeStyle = '#FCEE0A';
  ctx.lineWidth = 10 * scale;
  ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

  // Corner Decorations
  ctx.fillStyle = '#FCEE0A';
  ctx.fillRect(padding, padding, 100 * scale, 100 * scale);
  ctx.fillRect(
    width - padding - 100 * scale,
    height - padding - 100 * scale,
    100 * scale,
    100 * scale,
  );

  // Text
  ctx.font = `900 ${110 * scale}px "Arial Black", sans-serif`;
  ctx.fillStyle = '#00F0FF';
  ctx.shadowColor = '#00F0FF';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = -5 * scale;
  ctx.shadowOffsetY = 0;
  ctx.fillText(
    repoName.toUpperCase(),
    padding + 40 * scale,
    height / 2 - 20 * scale,
  );

  ctx.fillStyle = '#FCEE0A';
  ctx.shadowOffsetX = 5 * scale;
  ctx.fillText(
    repoName.toUpperCase(),
    padding + 40 * scale,
    height / 2 - 20 * scale,
  );

  ctx.fillStyle = '#fff';
  ctx.shadowOffsetX = 0;
  ctx.fillText(
    repoName.toUpperCase(),
    padding + 40 * scale,
    height / 2 - 20 * scale,
  );

  // Subtext
  ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
  ctx.fillStyle = '#FCEE0A';
  ctx.fillText(
    `STATUS: ${repoOwner.toUpperCase()}`,
    padding + 40 * scale,
    height / 2 - 140 * scale,
  );

  // Description
  ctx.fillStyle = '#00F0FF';
  ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
  wrapText(
    ctx,
    description,
    padding + 40 * scale,
    height / 2 + 60 * scale,
    width * 0.7,
    40 * scale,
  );

  // Bottom Bar
  ctx.fillStyle = '#00F0FF';
  ctx.fillRect(
    padding + 120 * scale,
    height - padding - 80 * scale,
    width - padding * 2 - 240 * scale,
    60 * scale,
  );

  ctx.fillStyle = '#000';
  ctx.textAlign = 'right';
  ctx.font = `bold ${30 * scale}px "Arial Black", sans-serif`;
  let statsStr = '';
  if (stars) statsStr += `STARS: ${stars}   `;
  if (forks) statsStr += `FORKS: ${forks}   `;
  statsStr += `LANG: ${language.toUpperCase()}`;
  ctx.fillText(
    statsStr,
    width - padding - 140 * scale,
    height - padding - 40 * scale,
  );
};
