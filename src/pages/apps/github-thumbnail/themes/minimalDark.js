import { wrapText } from '../utils';

export const minimalDark = (ctx, width, height, scale, data) => {
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

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, height);

  // Decorative side bar
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, 15 * scale, height);

  // Content
  const padding = 100 * scale;

  // Owner / Name
  ctx.textAlign = 'left';
  ctx.font = `500 ${32 * scale}px "Inter", sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText(repoOwner.toLowerCase(), padding, padding + 20 * scale);

  ctx.font = `bold ${110 * scale}px "Inter", sans-serif`;
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(repoName, padding, padding + 130 * scale);

  // Description
  ctx.font = `${36 * scale}px "Inter", sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  wrapText(
    ctx,
    description,
    padding,
    padding + 220 * scale,
    width - padding * 2,
    50 * scale,
  );

  // Footer
  const footerY = height - padding;

  // Stats
  ctx.font = `600 ${28 * scale}px "JetBrains Mono", monospace`;
  ctx.fillStyle = secondaryColor;
  let currentX = padding;

  const drawStat = (icon, value) => {
    if (!value) return;
    const text = `${icon} ${value}`;
    ctx.fillText(text, currentX, footerY);
    currentX += ctx.measureText(text).width + 50 * scale;
  };

  drawStat('★', stars);
  drawStat('⑂', forks);

  // Language
  ctx.fillStyle = primaryColor;
  ctx.fillText(language.toUpperCase(), currentX, footerY);

  // Support URL
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.font = `400 ${22 * scale}px "Inter", sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText(supportUrl, width - padding, footerY);
  }
};
