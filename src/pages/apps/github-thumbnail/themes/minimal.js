import { wrapText } from '../utils';

export const minimal = (ctx, width, height, scale, data) => {
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
  // Improved Minimal Glass

  // Background with subtle gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#e2e8f0'); // slate-200
  grad.addColorStop(1, '#f8fafc'); // slate-50
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Abstract shapes for background depth
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(width * 0.2, height * 0.3, 400 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.7, 300 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Glass Card
  const cardW = width * 0.85;
  const cardH = height * 0.7;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;
  const r = 30 * scale;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 60 * scale;
  ctx.shadowOffsetY = 30 * scale;

  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, r);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'; // More opaque, cleaner
  ctx.fill();

  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
  ctx.restore();

  // Content inside Card
  const innerPad = 80 * scale;
  const contentY = cardY + innerPad;

  ctx.textAlign = 'left';

  // Small Owner Label
  ctx.fillStyle = '#64748b'; // slate-500
  ctx.font = `600 ${24 * scale}px "Plus Jakarta Sans", "Inter", sans-serif`;
  ctx.fillText(repoOwner.toUpperCase(), cardX + innerPad, contentY);

  // Repo Name
  ctx.fillStyle = '#0f172a'; // slate-900
  ctx.font = `800 ${80 * scale}px "Plus Jakarta Sans", "Inter", sans-serif`;
  ctx.fillText(repoName, cardX + innerPad, contentY + 100 * scale);

  // Description
  ctx.fillStyle = '#334155'; // slate-700
  ctx.font = `500 ${32 * scale}px "Plus Jakarta Sans", "Inter", sans-serif`;
  wrapText(
    ctx,
    description,
    cardX + innerPad,
    contentY + 180 * scale,
    cardW - innerPad * 2,
    48 * scale,
  );

  // Bottom Section inside card
  const bottomInnerY = cardY + cardH - innerPad + 20 * scale;

  // Stats Pills
  let currentX = cardX + innerPad;
  const pillH = 50 * scale;
  const pillPad = 30 * scale;

  const drawStatPill = (label, value, color) => {
    ctx.font = `bold ${20 * scale}px "Plus Jakarta Sans", sans-serif`;
    const text = `${value} ${label}`;
    const w = ctx.measureText(text).width + pillPad * 2;

    ctx.fillStyle = color; // light bg
    ctx.beginPath();
    ctx.roundRect(currentX, bottomInnerY - pillH, w, pillH, pillH / 2);
    ctx.fill();

    ctx.fillStyle = '#1e293b'; // Dark text
    ctx.fillText(
      text,
      currentX + pillPad,
      bottomInnerY - pillH / 2 + 8 * scale,
    ); // vertical center adjustment

    currentX += w + 20 * scale;
  };

  // Language Pill (Special style)
  drawStatPill('• ' + language, '', 'rgba(0,0,0,0.05)');

  if (stars) drawStatPill('Stars', stars, 'rgba(255, 220, 0, 0.15)');
  if (forks) drawStatPill('Forks', forks, 'rgba(0, 0, 0, 0.05)');

  // URL
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = `${20 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(
      supportUrl,
      cardX + cardW - innerPad,
      bottomInnerY - 10 * scale,
    );
  }
};
