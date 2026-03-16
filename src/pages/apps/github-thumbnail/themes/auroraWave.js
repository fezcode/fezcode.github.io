import { wrapText } from '../utils';

export const auroraWave = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    secondaryColor,
    bgColor,
    showPattern,
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
    supportUrl,
  } = data;

  // --- Aurora wave bands ---
  ctx.save();
  const waveCount = 5;
  for (let i = 0; i < waveCount; i++) {
    const yBase = height * 0.25 + i * 50 * scale;
    const grad = ctx.createLinearGradient(0, yBase, width, yBase);
    const alpha = 0.06 - i * 0.008;
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.2, primaryColor);
    grad.addColorStop(0.5, secondaryColor);
    grad.addColorStop(0.8, primaryColor);
    grad.addColorStop(1, 'transparent');

    ctx.globalAlpha = Math.max(alpha, 0.015);
    ctx.beginPath();
    ctx.moveTo(0, yBase);
    for (let x = 0; x <= width; x += 4) {
      const wave = Math.sin((x / width) * Math.PI * 3 + i * 1.2) * (40 * scale);
      ctx.lineTo(x, yBase + wave);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }
  ctx.restore();

  // --- Noise texture dots (when showPattern is on) ---
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.025;
    ctx.fillStyle = '#ffffff';
    const seed = 42;
    for (let i = 0; i < 600; i++) {
      const px = ((seed * (i + 1) * 7919) % width);
      const py = ((seed * (i + 1) * 6271) % height);
      const r = ((i % 3) + 1) * scale;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  const padding = 80 * scale;

  // --- Vertical accent line on the left ---
  ctx.save();
  const lineGrad = ctx.createLinearGradient(0, padding, 0, height - padding);
  lineGrad.addColorStop(0, primaryColor);
  lineGrad.addColorStop(0.5, secondaryColor);
  lineGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = lineGrad;
  ctx.globalAlpha = 0.6;
  ctx.fillRect(padding - 30 * scale, padding, 3 * scale, height - padding * 2);
  ctx.restore();

  // --- Owner ---
  const contentX = padding;
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = `500 ${20 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(repoOwner, contentX, padding + 14 * scale);

  // --- Repo name ---
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${76 * scale}px "Inter", sans-serif`;
  ctx.fillText(repoName, contentX, padding + 100 * scale);

  // --- Soft glow behind the name ---
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.filter = 'blur(40px)';
  ctx.fillStyle = primaryColor;
  const nameW = ctx.measureText(repoName).width;
  ctx.fillRect(contentX, padding + 40 * scale, nameW, 70 * scale);
  ctx.restore();

  // --- Description ---
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `300 ${26 * scale}px "Inter", sans-serif`;
  wrapText(ctx, description, contentX, padding + 160 * scale, width * 0.52, 38 * scale);

  // --- Stats bar at the bottom ---
  const bottomY = height - padding;

  // Language tag with dot indicator
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(contentX + 8 * scale, bottomY - 6 * scale, 6 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${20 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(language, contentX + 24 * scale, bottomY);

  // Stars
  let statX = contentX + 24 * scale + ctx.measureText(language).width + 40 * scale;

  if (stars) {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = `400 ${16 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText('★', statX, bottomY);
    statX += 20 * scale;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = `700 ${20 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText(stars, statX, bottomY);
    statX += ctx.measureText(stars).width + 30 * scale;
  }

  // Forks
  if (forks) {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = `400 ${16 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText('⑂', statX, bottomY);
    statX += 20 * scale;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = `700 ${20 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText(forks, statX, bottomY);
  }

  // --- Right-side info panel ---
  const panelW = 280 * scale;
  const panelH = 180 * scale;
  const panelX = width - padding - panelW;
  const panelY = height * 0.35;

  // Panel bg
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelW, panelH, 12 * scale);
  ctx.fill();
  ctx.restore();

  // Panel left accent
  ctx.save();
  const panelAccent = ctx.createLinearGradient(0, panelY, 0, panelY + panelH);
  panelAccent.addColorStop(0, primaryColor);
  panelAccent.addColorStop(1, secondaryColor);
  ctx.fillStyle = panelAccent;
  ctx.globalAlpha = 0.7;
  ctx.fillRect(panelX, panelY, 3 * scale, panelH);
  ctx.restore();

  const innerX = panelX + 22 * scale;
  let innerY = panelY + 30 * scale;

  // Color palette row
  const swatchR = 10 * scale;
  [bgColor, primaryColor, secondaryColor].forEach((color, i) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(innerX + i * (swatchR * 2.8), innerY, swatchR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();
    ctx.restore();
  });

  innerY += 36 * scale;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `500 ${12 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'left';
  ctx.fillText('THEME PALETTE', innerX, innerY);

  innerY += 28 * scale;
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = `600 ${14 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(language.toUpperCase(), innerX, innerY);

  innerY += 26 * scale;
  ctx.fillStyle = showPattern ? secondaryColor : 'rgba(255,255,255,0.2)';
  ctx.font = `500 ${11 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(showPattern ? '◆ TEXTURE ACTIVE' : '◇ TEXTURE OFF', innerX, innerY);

  // --- Support URL bottom-right ---
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = `300 ${16 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText(supportUrl, width - padding, bottomY);
  }
};
