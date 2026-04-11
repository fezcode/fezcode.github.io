import { wrapText } from '../utils';

export const needForSpeed = (ctx, width, height, scale, data) => {
  const { primaryColor, secondaryColor, bgColor, repoOwner, repoName, description } = data;

  ctx.save();

  // High-speed background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Speed lines (motion blur effect)
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 4 * scale;
  for (let i = 0; i < 150; i++) {
    const y = Math.random() * height;
    const length = Math.random() * 400 * scale + 100 * scale;
    const x = Math.random() * width - length;

    ctx.strokeStyle = Math.random() > 0.5 ? primaryColor : secondaryColor;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y);
    ctx.stroke();
  }

  // Slanted racing stripes
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(width * 0.7, 0);
  ctx.lineTo(width * 0.85, 0);
  ctx.lineTo(width * 0.6, height);
  ctx.lineTo(width * 0.45, height);
  ctx.fill();

  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.moveTo(width * 0.8, 0);
  ctx.lineTo(width * 0.85, 0);
  ctx.lineTo(width * 0.6, height);
  ctx.lineTo(width * 0.55, height);
  ctx.fill();

  // Checkered flag pattern at the bottom
  ctx.globalAlpha = 0.3;
  const squareSize = 20 * scale;
  for (let x = 0; x < width; x += squareSize) {
    for (let y = height - 60 * scale; y < height; y += squareSize) {
      if ((Math.floor(x / squareSize) + Math.floor(y / squareSize)) % 2 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, squareSize, squareSize);
      }
    }
  }

  // Overlay gradient to make text pop
  const grd = ctx.createLinearGradient(0, 0, width * 0.6, 0);
  grd.addColorStop(0, 'rgba(0,0,0,0.9)');
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();

  const padding = 80 * scale;

  // Slanted, fast text
  ctx.save();
  ctx.transform(1, 0, -0.15, 1, 0, 0); // Skew X for speed effect

  ctx.fillStyle = secondaryColor;
  ctx.font = `italic 900 ${30 * scale}px "Impact", "Arial Black", sans-serif`;
  ctx.fillText(`${repoOwner} /`.toUpperCase(), padding + 40 * scale, padding + 20 * scale);

  // Main Title with shadow/glow
  const titleY = padding + 110 * scale;
  const titleX = padding + 20 * scale;
  ctx.font = `italic 900 ${90 * scale}px "Impact", "Arial Black", sans-serif`;

  ctx.fillStyle = primaryColor;
  ctx.fillText(repoName.toUpperCase(), titleX + 6 * scale, titleY + 6 * scale);

  ctx.fillStyle = '#ffffff';
  ctx.fillText(repoName.toUpperCase(), titleX, titleY);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = `italic 600 ${32 * scale}px "Impact", "Arial Black", sans-serif`;
  wrapText(ctx, description.toUpperCase(), padding - 10 * scale, padding + 190 * scale, width * 0.7 - padding * 2, 45 * scale);

  ctx.restore();
};