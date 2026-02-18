import { wrapText } from '../utils';

export const gradient = (ctx, width, height, scale, data) => {
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

  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, primaryColor);
  bgGrad.addColorStop(1, secondaryColor);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle Mesh Orbs
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.3;

  const drawOrb = (x, y, r, color) => {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  drawOrb(width * 0.1, height * 0.1, 800 * scale, '#ffffff');
  drawOrb(width * 0.9, height * 0.9, 600 * scale, '#ffffff');
  ctx.restore();

  // Glass Container
  const padX = 80 * scale;
  const padY = 60 * scale;
  const cardW = width - padX * 2;
  const cardH = height - padY * 2;
  const r = 30 * scale;

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.shadowColor = 'rgba(0,0,0,0.1)';
  ctx.shadowBlur = 40 * scale;
  ctx.beginPath();
  ctx.roundRect(padX, padY, cardW, cardH, r);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
  ctx.restore();

  // Content
  const contentPad = padX + 60 * scale;

  // Repo Owner
  ctx.textAlign = 'left';
  ctx.font = `bold ${32 * scale}px "Inter", sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText(repoOwner, contentPad, padY + 80 * scale);

  // Repo Name
  ctx.font = `900 ${110 * scale}px "Inter", sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(repoName, contentPad, padY + 190 * scale);

  // Description
  ctx.font = `500 ${36 * scale}px "Inter", sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  wrapText(
    ctx,
    description,
    contentPad,
    padY + 280 * scale,
    cardW - 120 * scale,
    50 * scale,
  );

  // Footer
  const footerY = padY + cardH - 60 * scale;

  // Language Tag
  const langText = language.toUpperCase();
  ctx.font = `bold ${24 * scale}px "JetBrains Mono", monospace`;
  const langW = ctx.measureText(langText).width;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.roundRect(contentPad - 15 * scale, footerY - 35 * scale, langW + 30 * scale, 50 * scale, 10 * scale);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.fillText(langText, contentPad, footerY);

  // Stats
  let statX = contentPad + langW + 80 * scale;
  ctx.font = `bold ${30 * scale}px "Inter", sans-serif`;

  if (stars) {
    ctx.fillText(`★ ${stars}`, statX, footerY);
    statX += 160 * scale;
  }
  if (forks) {
    ctx.fillText(`⑂ ${forks}`, statX, footerY);
  }

  // Support URL
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.font = `normal ${22 * scale}px "Inter", sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(supportUrl, width - padX - 60 * scale, footerY);
  }
};
