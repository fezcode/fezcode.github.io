import { wrapText } from '../utils';

export const comic = (ctx, width, height, scale, data) => {
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

  // Background
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(0, 0, width, height);

  // Halftone Pattern Background
  ctx.save();
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.2;
  const dotSpacing = 30 * scale;
  for (let x = 0; x < width; x += dotSpacing) {
    for (let y = 0; y < height; y += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, 4 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // Thick Border
  const borderW = 10 * scale;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = borderW;
  ctx.strokeRect(borderW / 2, borderW / 2, width - borderW, height - borderW);

  // Decorative Panels
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 6 * scale;

  // Speech Bubble Shape for Title
  const pad = 100 * scale;
  const bubbleW = width - pad * 2;
  const bubbleH = height - pad * 2;
  const r = 40 * scale;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 12 * scale;
  ctx.shadowOffsetY = 12 * scale;

  ctx.beginPath();
  ctx.roundRect(pad, pad, bubbleW, bubbleH, r);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Content
  const contentPad = pad + 60 * scale;

  // Repo Owner (Sticker Style)
  ctx.save();
  ctx.translate(contentPad + 80 * scale, pad - 20 * scale);
  ctx.rotate(-0.03);
  ctx.fillStyle = primaryColor;
  const ownerW = ctx.measureText(repoOwner.toUpperCase()).width + 40 * scale;
  ctx.fillRect(-20 * scale, -25 * scale, ownerW + 40 * scale, 50 * scale);
  ctx.strokeRect(-20 * scale, -25 * scale, ownerW + 40 * scale, 50 * scale);
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${28 * scale}px "Comic Sans MS", cursive, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(repoOwner.toUpperCase(), ownerW / 2, 10 * scale);
  ctx.restore();

  // Repo Name
  ctx.textAlign = 'left';
  ctx.fillStyle = '#000000';
  ctx.font = `italic 900 ${110 * scale}px "Arial Black", sans-serif`;
  ctx.fillText(repoName, contentPad, pad + 150 * scale);

  // Description
  ctx.font = `bold ${32 * scale}px "Comic Sans MS", cursive, sans-serif`;
  wrapText(
    ctx,
    description,
    contentPad,
    pad + 250 * scale,
    bubbleW - 120 * scale,
    45 * scale,
  );

  // Footer Stats
  const footerY = pad + bubbleH - 60 * scale;

  // Stats (Bang!)
  const drawBang = (text, x, y, color) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * 0.1 - 0.05);
    ctx.fillStyle = color;
    ctx.font = `italic 900 ${36 * scale}px "Arial Black", sans-serif`;
    ctx.lineWidth = 5 * scale;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(text, 0, 0);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  };

  let statX = contentPad;
  if (stars) {
    drawBang(`★ ${stars}`, statX, footerY, '#ffd700');
    statX += 200 * scale;
  }
  if (forks) {
    drawBang(`⑂ ${forks}`, statX, footerY, '#00ffcc');
    statX += 200 * scale;
  }

  // Language (Action style)
  drawBang(language.toUpperCase(), width - contentPad - 150 * scale, footerY, primaryColor);

  // Support URL
  if (supportUrl) {
    ctx.font = `bold ${20 * scale}px "Comic Sans MS", cursive, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillText(supportUrl, width - contentPad, pad + bubbleH + 40 * scale);
  }
};
