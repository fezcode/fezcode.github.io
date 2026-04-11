import { wrapText } from '../utils';

export const cubic = (ctx, width, height, scale, data) => {
  const { primaryColor, secondaryColor, bgColor, repoOwner, repoName, description } = data;

  ctx.save();
  const cubeSize = 100 * scale;
  for(let x = -cubeSize; x < width + cubeSize; x += cubeSize * 1.5) {
    for(let y = -cubeSize; y < height + cubeSize; y += cubeSize * 1.5) {
      const offsetX = ((y / (cubeSize * 1.5)) % 2 === 0) ? cubeSize * 0.75 : 0;

      const px = x + offsetX;
      const py = y;

      // Top face
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + cubeSize * 0.866, py + cubeSize * 0.5);
      ctx.lineTo(px, py + cubeSize);
      ctx.lineTo(px - cubeSize * 0.866, py + cubeSize * 0.5);
      ctx.fill();

      // Left face
      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.moveTo(px - cubeSize * 0.866, py + cubeSize * 0.5);
      ctx.lineTo(px, py + cubeSize);
      ctx.lineTo(px, py + cubeSize * 2);
      ctx.lineTo(px - cubeSize * 0.866, py + cubeSize * 1.5);
      ctx.fill();

      // Right face
      ctx.fillStyle = bgColor;
      ctx.globalAlpha = 0.5; // Since bgColor is also background, we make it transparent to blend
      ctx.beginPath();
      ctx.moveTo(px, py + cubeSize);
      ctx.lineTo(px + cubeSize * 0.866, py + cubeSize * 0.5);
      ctx.lineTo(px + cubeSize * 0.866, py + cubeSize * 1.5);
      ctx.lineTo(px, py + cubeSize * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }
  ctx.restore();

  // Dim background slightly for text
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, width, height);

  const padding = 80 * scale;
  ctx.fillStyle = primaryColor;
  ctx.font = `bold ${30 * scale}px "JetBrains Mono"`;
  ctx.fillText(`${repoOwner} /`, padding, padding + 20 * scale);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${80 * scale}px "Inter", sans-serif`;
  ctx.fillText(repoName, padding, padding + 110 * scale);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = `${32 * scale}px "Inter", sans-serif`;
  wrapText(ctx, description, padding, padding + 180 * scale, width - padding * 2, 45 * scale);
};