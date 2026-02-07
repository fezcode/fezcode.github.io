import { wrapText } from '../utils';

export const brutalist = (ctx, width, height, scale, data) => {
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
  // Brutalist Header Bar
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, width, 20 * scale);

  const padding = 60 * scale;
  const borderW = 4 * scale;

  // Main Border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = borderW;
  ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

  // Decorative Corners
  const cornerSize = 20 * scale;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(
    padding - borderW / 2,
    padding - borderW / 2,
    cornerSize,
    cornerSize,
  ); // TL
  ctx.fillRect(
    width - padding - cornerSize + borderW / 2,
    padding - borderW / 2,
    cornerSize,
    cornerSize,
  ); // TR
  ctx.fillRect(
    padding - borderW / 2,
    height - padding - cornerSize + borderW / 2,
    cornerSize,
    cornerSize,
  ); // BL
  ctx.fillRect(
    width - padding - cornerSize + borderW / 2,
    height - padding - cornerSize + borderW / 2,
    cornerSize,
    cornerSize,
  ); // BR

  // Content
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${40 * scale}px "Courier New", monospace`;
  ctx.fillText(
    `USER: ${repoOwner.toUpperCase()}`,
    padding + 40 * scale,
    padding + 80 * scale,
  );

  ctx.fillStyle = primaryColor;
  ctx.font = `900 ${100 * scale}px "Impact", sans-serif`;
  ctx.fillText(
    repoName.toUpperCase(),
    padding + 35 * scale,
    padding + 200 * scale,
  );

  ctx.fillStyle = '#ffffff';
  ctx.font = `${30 * scale}px "Courier New", monospace`;
  wrapText(
    ctx,
    description,
    padding + 40 * scale,
    padding + 300 * scale,
    width - padding * 3,
    40 * scale,
  );

  // Footer Info
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(
    padding,
    height - padding - 80 * scale,
    width - padding * 2,
    80 * scale,
  );

  ctx.fillStyle = '#000000';
  ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(
    `LANG: ${language.toUpperCase()}`,
    padding + 40 * scale,
    height - padding - 40 * scale,
  );

  ctx.textAlign = 'right';
  let statsText = '';
  if (stars) statsText += `★ ${stars}  `;
  if (forks) statsText += `⑂ ${forks}`;

  const rightPadding = padding + 40 * scale;

  if (supportUrl) {
    ctx.font = `${24 * scale}px "Courier New", monospace`;
    ctx.fillText(
      supportUrl.toUpperCase(),
      width - rightPadding,
      height - padding - 40 * scale,
    );

    const urlWidth = ctx.measureText(supportUrl.toUpperCase()).width;
    ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
    if (statsText) {
      ctx.fillText(
        statsText,
        width - rightPadding - urlWidth - 60 * scale,
        height - padding - 40 * scale,
      );
    }
  } else {
    ctx.fillText(
      statsText,
      width - rightPadding,
      height - padding - 40 * scale,
    );
  }
};
