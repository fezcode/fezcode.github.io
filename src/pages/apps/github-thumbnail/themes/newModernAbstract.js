import { wrapText } from '../utils';

export const newModernAbstract = (ctx, width, height, scale, data) => {
  const { primaryColor, secondaryColor, bgColor, repoOwner, repoName, description } = data;

  // Draw some modern abstract shapes
  ctx.save();
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.2);
  ctx.bezierCurveTo(width * 0.4, -height * 0.1, width * 0.6, height * 0.5, width, height * 0.3);
  ctx.lineTo(width, 0);
  ctx.lineTo(0, 0);
  ctx.fill();

  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(width * 0.2, height);
  ctx.bezierCurveTo(width * 0.5, height * 0.6, width * 0.8, height * 1.2, width, height * 0.7);
  ctx.lineTo(width, height);
  ctx.lineTo(width * 0.2, height);
  ctx.fill();

  // Use bgColor for some contrasting elements
  ctx.fillStyle = bgColor;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.5, 100 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Text
  const padding = 80 * scale;
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${30 * scale}px "JetBrains Mono"`;
  ctx.fillText(`${repoOwner} /`, padding, padding + 20 * scale);

  ctx.font = `900 ${90 * scale}px "Inter", sans-serif`;
  ctx.fillText(repoName, padding, padding + 120 * scale);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = `${32 * scale}px "Inter", sans-serif`;
  wrapText(ctx, description, padding, padding + 190 * scale, width - padding * 2, 45 * scale);
};