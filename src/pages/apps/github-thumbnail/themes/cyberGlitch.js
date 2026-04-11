import { wrapText } from '../utils';

export const cyberGlitch = (ctx, width, height, scale, data) => {
  const { primaryColor, secondaryColor, bgColor, repoOwner, repoName, description } = data;

  ctx.save();
  // Glitch bands
  for(let i=0; i<30; i++) {
    const y = Math.random() * height;
    const h = Math.random() * 20 * scale;
    const x = Math.random() * width;
    const w = Math.random() * width;

    ctx.fillStyle = Math.random() > 0.5 ? primaryColor : secondaryColor;
    ctx.globalAlpha = Math.random() * 0.5;
    ctx.fillRect(x, y, w, h);
  }

  // Draw some code-like text using bgColor
  ctx.fillStyle = bgColor;
  ctx.globalAlpha = 0.3; // since bgColor might be dark, we make it an overlay block
  ctx.fillRect(0,0,width,height);

  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.4;
  ctx.font = `${14 * scale}px monospace`;
  for(let i=0; i<100; i++) {
    ctx.fillText(Math.random().toString(36).substring(2), Math.random() * width, Math.random() * height);
  }
  ctx.restore();

  const padding = 80 * scale;

  // Title with glitch effect
  const titleY = padding + 110 * scale;
  ctx.font = `900 ${80 * scale}px "JetBrains Mono", monospace`;

  // Cyan shadow
  ctx.fillStyle = primaryColor;
  ctx.fillText(repoName, padding - 5 * scale, titleY);

  // Magenta shadow
  ctx.fillStyle = secondaryColor;
  ctx.fillText(repoName, padding + 5 * scale, titleY);

  // Main white text
  ctx.fillStyle = '#ffffff';
  ctx.fillText(repoName, padding, titleY);

  ctx.fillStyle = primaryColor;
  ctx.font = `bold ${30 * scale}px "JetBrains Mono"`;
  ctx.fillText(`${repoOwner} /`, padding, padding + 20 * scale);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = `${32 * scale}px "JetBrains Mono"`;
  wrapText(ctx, description, padding, padding + 180 * scale, width - padding * 2, 45 * scale);
};