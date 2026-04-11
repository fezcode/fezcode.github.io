import { wrapText } from '../utils';

export const dithered = (ctx, width, height, scale, data) => {
  const { primaryColor, secondaryColor, bgColor, repoOwner, repoName, description } = data;

  ctx.save();
  // Simulate dithering by drawing a checkerboard of primary and secondary colors
  const ditherSize = 4 * scale;
  for(let y=0; y<height; y+=ditherSize) {
    for(let x=0; x<width; x+=ditherSize) {
      if ((Math.floor(x/ditherSize) + Math.floor(y/ditherSize)) % 2 === 0) {
        ctx.fillStyle = primaryColor;
      } else {
        ctx.fillStyle = secondaryColor;
      }
      ctx.fillRect(x, y, ditherSize, ditherSize);
    }
  }

  // Draw some large geometric shapes using bgColor with dithering alpha
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.2, 200 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillRect(width * 0.1, height * 0.6, 300 * scale, 300 * scale);
  ctx.restore();

  // Inner box for text
  const padding = 80 * scale;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(padding - 20 * scale, padding - 20 * scale, width - padding * 2 + 40 * scale, height - padding * 2 + 40 * scale);

  ctx.fillStyle = primaryColor;
  ctx.font = `bold ${30 * scale}px "Press Start 2P", monospace`;
  ctx.fillText(`${repoOwner} /`, padding, padding + 20 * scale);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${80 * scale}px "Inter", sans-serif`; // Press Start 2P might be too large for repoName, fallback to Inter
  ctx.fillText(repoName, padding, padding + 110 * scale);

  ctx.fillStyle = secondaryColor;
  ctx.font = `${32 * scale}px "Inter", sans-serif`;
  wrapText(ctx, description, padding, padding + 180 * scale, width - padding * 2, 45 * scale);
};