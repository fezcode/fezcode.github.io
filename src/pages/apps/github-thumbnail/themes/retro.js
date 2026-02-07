import { wrapText } from '../utils';

export const retro = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
    supportUrl,
  } = data;
  // Retro Terminal Style (Unchanged from previous implementation)
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, width, height);

  // Scanlines
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  for (let i = 0; i < height; i += 4 * scale) {
    ctx.fillRect(0, i, width, 2 * scale);
  }

  // Glow effect
  ctx.shadowBlur = 10 * scale;
  ctx.shadowColor = primaryColor;

  const padding = 80 * scale;

  ctx.font = `${30 * scale}px "Courier New", monospace`;
  ctx.fillStyle = primaryColor;
  ctx.textAlign = 'left';
  ctx.fillText(
    `> git clone https://github.com/${repoOwner}/${repoName}.git`,
    padding,
    padding,
  );

  ctx.font = `bold ${80 * scale}px "Courier New", monospace`;
  ctx.fillStyle = primaryColor;
  ctx.fillText(repoName, padding, padding + 120 * scale);

  ctx.font = `${30 * scale}px "Courier New", monospace`;
  ctx.fillStyle = primaryColor;
  wrapText(
    ctx,
    description,
    padding,
    padding + 200 * scale,
    width - padding * 2,
    40 * scale,
  );

  const bottomY = height - padding;
  ctx.textAlign = 'left';
  ctx.font = `${24 * scale}px "Courier New", monospace`;

  let statsText = '';
  if (stars) statsText += `[ STARS: ${stars} ] `;
  if (forks) statsText += `[ FORKS: ${forks} ] `;
  statsText += `[ LANG: ${language.toUpperCase()} ]`;

  ctx.fillText(statsText, padding, bottomY);
  ctx.fillStyle = primaryColor;
  ctx.fillRect(
    padding + ctx.measureText(statsText).width + 10 * scale,
    bottomY - 24 * scale,
    15 * scale,
    30 * scale,
  );

  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillText(supportUrl, width - padding, padding);
  }
};
