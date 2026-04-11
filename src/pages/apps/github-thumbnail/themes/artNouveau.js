import { wrapText } from '../utils';

export const artNouveau = (ctx, width, height, scale, data) => {
  const { primaryColor, secondaryColor, bgColor, repoOwner, repoName, description } = data;

  ctx.save();
  // Flowing, organic lines
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 8 * scale;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(0, height * 0.5);
  ctx.bezierCurveTo(width * 0.2, height * 0.2, width * 0.3, height * 0.8, width * 0.5, height * 0.5);
  ctx.bezierCurveTo(width * 0.7, height * 0.2, width * 0.8, height * 0.8, width, height * 0.5);
  ctx.stroke();

  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 4 * scale;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.6);
  ctx.bezierCurveTo(width * 0.2, height * 0.3, width * 0.3, height * 0.9, width * 0.5, height * 0.6);
  ctx.bezierCurveTo(width * 0.7, height * 0.3, width * 0.8, height * 0.9, width, height * 0.6);
  ctx.stroke();

  // Organic frame
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 12 * scale;
  ctx.strokeRect(40 * scale, 40 * scale, width - 80 * scale, height - 80 * scale);

  // Corner flourishes
  const drawFlourish = (x, y, flipX, flipY) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.fillStyle = bgColor; // Using bgColor for the inner flourish
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 4 * scale;
    ctx.beginPath();
    ctx.arc(40 * scale, 40 * scale, 40 * scale, Math.PI, Math.PI * 1.5);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  };
  drawFlourish(40 * scale, 40 * scale, false, false);
  drawFlourish(width - 40 * scale, 40 * scale, true, false);
  drawFlourish(40 * scale, height - 40 * scale, false, true);
  drawFlourish(width - 40 * scale, height - 40 * scale, true, true);
  ctx.restore();

  // Text
  const padding = 100 * scale;
  ctx.fillStyle = primaryColor;
  ctx.font = `italic ${30 * scale}px "Georgia", serif`;
  ctx.fillText(`${repoOwner} /`, padding, padding + 20 * scale);

  ctx.fillStyle = secondaryColor;
  ctx.font = `bold ${80 * scale}px "Georgia", serif`;
  ctx.fillText(repoName, padding, padding + 110 * scale);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = `italic ${32 * scale}px "Georgia", serif`;
  wrapText(ctx, description, padding, padding + 180 * scale, width - padding * 2, 45 * scale);
};