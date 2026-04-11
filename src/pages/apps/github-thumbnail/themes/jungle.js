import { wrapText } from '../utils';

export const jungle = (ctx, width, height, scale, data) => {
  const { primaryColor, secondaryColor, bgColor, repoOwner, repoName, description } = data;

  ctx.save();
  // Vines
  ctx.lineWidth = 15 * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const drawVine = (startX, startY, endX, endY, color) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(startX + 100 * scale, startY + 200 * scale, endX - 100 * scale, endY - 200 * scale, endX, endY);
    ctx.stroke();
  };

  drawVine(0, 0, width * 0.3, height, primaryColor);
  drawVine(width * 0.7, 0, width, height, secondaryColor);
  drawVine(width * 0.2, 0, width * 0.5, height, bgColor);

  // Leaves
  const drawLeaf = (x, y, angle, color) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 20 * scale, 15 * scale, 40 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  for(let i=0; i<30; i++) {
    drawLeaf(Math.random() * width, Math.random() * height, Math.random() * Math.PI * 2, Math.random() > 0.5 ? primaryColor : secondaryColor);
  }

  // Dark overlay for text
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0,0,width,height);
  ctx.restore();

  const padding = 80 * scale;
  ctx.fillStyle = primaryColor;
  ctx.font = `bold ${30 * scale}px "Trebuchet MS"`;
  ctx.fillText(`${repoOwner} /`, padding, padding + 20 * scale);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${80 * scale}px "Trebuchet MS"`;
  ctx.fillText(repoName, padding, padding + 110 * scale);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = `${32 * scale}px "Trebuchet MS"`;
  wrapText(ctx, description, padding, padding + 180 * scale, width - padding * 2, 45 * scale);
};