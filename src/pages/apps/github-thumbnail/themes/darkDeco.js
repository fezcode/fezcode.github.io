import { wrapText } from '../utils';

export const darkDeco = (ctx, width, height, scale, data) => {
  const { primaryColor, secondaryColor, bgColor, repoOwner, repoName, description } = data;

  ctx.save();
  // Art deco lines
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 4 * scale;

  for (let i = 0; i < 5; i++) {
    const offset = (i * 20 + 20) * scale;
    ctx.strokeRect(offset, offset, width - offset * 2, height - offset * 2);
  }

  // Geometric center pieces
  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2 + 100 * scale, 100 * scale);
  ctx.lineTo(width / 2, 200 * scale);
  ctx.lineTo(width / 2 - 100 * scale, 100 * scale);
  ctx.fill();

  ctx.fillStyle = bgColor;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(width / 2, height);
  ctx.lineTo(width / 2 + 100 * scale, height - 100 * scale);
  ctx.lineTo(width / 2, height - 200 * scale);
  ctx.lineTo(width / 2 - 100 * scale, height - 100 * scale);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  ctx.strokeStyle = secondaryColor;
  ctx.stroke();

  ctx.restore();

  // Dark background for text box
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  const boxWidth = width * 0.7;
  const boxHeight = height * 0.5;
  const bx = (width - boxWidth) / 2;
  const by = (height - boxHeight) / 2;
  ctx.fillRect(bx, by, boxWidth, boxHeight);
  ctx.strokeStyle = primaryColor;
  ctx.strokeRect(bx, by, boxWidth, boxHeight);

  ctx.textAlign = 'center';
  ctx.fillStyle = primaryColor;
  ctx.font = `bold ${24 * scale}px "Courier New", Courier, monospace`;
  ctx.fillText(`${repoOwner}`.toUpperCase(), width / 2, by + 60 * scale);

  ctx.fillStyle = secondaryColor;
  ctx.font = `bold ${64 * scale}px "Courier New", Courier, monospace`;
  ctx.fillText(repoName.toUpperCase(), width / 2, by + 140 * scale);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = `${28 * scale}px "Courier New", Courier, monospace`;
  ctx.textAlign = 'left';
  // wrapText wraps from left, so we pass appropriate left coordinate
  wrapText(ctx, description, bx + 40 * scale, by + 220 * scale, boxWidth - 80 * scale, 40 * scale);
};