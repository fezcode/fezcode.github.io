import { wrapText } from '../utils';

export const etherealGlow = (ctx, width, height, scale, data) => {
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
    bgColor,
    showPattern,
  } = data;

  // ===== RICH GRADIENT BACKGROUND =====
  const bgGrad = ctx.createLinearGradient(0, 0, width * 0.4, height);
  bgGrad.addColorStop(0, bgColor);
  bgGrad.addColorStop(0.5, bgColor);
  bgGrad.addColorStop(1, bgColor);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // ===== LUMINOUS ORBS — layered, blurred, overlapping =====
  const drawOrb = (ox, oy, or, color, opacity) => {
    ctx.save();
    const orbGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, or);
    orbGrad.addColorStop(0, color);
    orbGrad.addColorStop(0.4, color);
    orbGrad.addColorStop(1, 'transparent');
    ctx.globalAlpha = opacity;
    ctx.filter = `blur(${Math.round(or * 0.4)}px)`;
    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(ox, oy, or, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Primary large orb — top right
  drawOrb(width * 0.78, height * 0.15, 350 * scale, primaryColor, 0.18);
  // Secondary orb — bottom left
  drawOrb(width * 0.18, height * 0.85, 300 * scale, secondaryColor, 0.15);
  // Accent orb — center left
  drawOrb(width * 0.35, height * 0.4, 200 * scale, primaryColor, 0.08);
  // Small warm orb — top left
  drawOrb(width * 0.08, height * 0.1, 150 * scale, secondaryColor, 0.1);
  // Deep orb — bottom right
  drawOrb(width * 0.88, height * 0.75, 250 * scale, primaryColor, 0.12);

  // ===== PRISMATIC LIGHT STREAKS =====
  if (showPattern) {
    ctx.save();
    // Diagonal light ray 1
    ctx.globalAlpha = 0.04;
    const ray1Grad = ctx.createLinearGradient(width * 0.3, 0, width * 0.7, height);
    ray1Grad.addColorStop(0, 'transparent');
    ray1Grad.addColorStop(0.3, primaryColor);
    ray1Grad.addColorStop(0.5, '#fff');
    ray1Grad.addColorStop(0.7, secondaryColor);
    ray1Grad.addColorStop(1, 'transparent');
    ctx.fillStyle = ray1Grad;
    ctx.beginPath();
    ctx.moveTo(width * 0.45, 0);
    ctx.lineTo(width * 0.52, 0);
    ctx.lineTo(width * 0.22, height);
    ctx.lineTo(width * 0.15, height);
    ctx.closePath();
    ctx.fill();

    // Diagonal light ray 2 — thinner
    ctx.globalAlpha = 0.03;
    const ray2Grad = ctx.createLinearGradient(width * 0.5, 0, width * 0.8, height);
    ray2Grad.addColorStop(0, 'transparent');
    ray2Grad.addColorStop(0.4, secondaryColor);
    ray2Grad.addColorStop(0.6, '#fff');
    ray2Grad.addColorStop(1, 'transparent');
    ctx.fillStyle = ray2Grad;
    ctx.beginPath();
    ctx.moveTo(width * 0.6, 0);
    ctx.lineTo(width * 0.63, 0);
    ctx.lineTo(width * 0.33, height);
    ctx.lineTo(width * 0.3, height);
    ctx.closePath();
    ctx.fill();

    // Horizontal light bloom across middle
    ctx.globalAlpha = 0.025;
    const bloomGrad = ctx.createLinearGradient(0, height * 0.35, 0, height * 0.65);
    bloomGrad.addColorStop(0, 'transparent');
    bloomGrad.addColorStop(0.5, '#fff');
    bloomGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = bloomGrad;
    ctx.fillRect(0, height * 0.35, width, height * 0.3);
    ctx.restore();

    // ===== SPARKLE PARTICLES =====
    ctx.save();
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 173 + 29) % 127) / 127 * width;
      const sy = ((i * 89 + 47) % 113) / 113 * height;
      const ss = (0.8 + (i % 4) * 0.6) * scale;
      ctx.globalAlpha = 0.08 + (i % 6) * 0.04;
      ctx.fillStyle = '#fff';

      // Four-point star sparkle
      ctx.beginPath();
      ctx.moveTo(sx, sy - ss * 3);
      ctx.lineTo(sx + ss, sy);
      ctx.lineTo(sx, sy + ss * 3);
      ctx.lineTo(sx - ss, sy);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // ===== FROSTED GLASS CONTENT CARD =====
  const cardPad = 70 * scale;
  const cardX = cardPad;
  const cardY = cardPad;
  const cardW = width - cardPad * 2;
  const cardH = height - cardPad * 2;
  const cardR = 24 * scale;

  // Card frosted background
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
  ctx.clip();

  // Semi-transparent fill
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // Inner light gradient — top edge glow
  const innerGlow = ctx.createLinearGradient(cardX, cardY, cardX, cardY + 80 * scale);
  innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  innerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = innerGlow;
  ctx.fillRect(cardX, cardY, cardW, 80 * scale);
  ctx.restore();

  // Card border — subtle luminous stroke
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();
  ctx.restore();

  // Top-edge highlight (glass refraction)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cardX + 1, cardY + 1, cardW - 2, cardR * 2, [cardR, cardR, 0, 0]);
  ctx.clip();
  const edgeGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
  edgeGrad.addColorStop(0, 'rgba(255,255,255,0)');
  edgeGrad.addColorStop(0.3, 'rgba(255,255,255,0.08)');
  edgeGrad.addColorStop(0.7, 'rgba(255,255,255,0.03)');
  edgeGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(cardX, cardY, cardW, cardR * 2);
  ctx.restore();

  // ===== CONTENT =====
  const cx = cardX + 50 * scale;
  const contentMaxW = cardW - 100 * scale;

  // Owner — delicate, airy
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.7;
  ctx.font = `500 ${20 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(repoOwner, cx, cardY + 40 * scale);
  ctx.globalAlpha = 1;

  // Tiny accent dot after owner
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.5;
  const ownerW = ctx.measureText(repoOwner).width;
  ctx.beginPath();
  ctx.arc(cx + ownerW + 12 * scale, cardY + 50 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Repo name — large, elegant, white
  ctx.fillStyle = '#fff';
  let nameSize = 72 * scale;
  ctx.font = `700 ${nameSize}px "Inter", sans-serif`;
  while (ctx.measureText(repoName).width > contentMaxW && nameSize > 36 * scale) {
    nameSize -= 3 * scale;
    ctx.font = `700 ${nameSize}px "Inter", sans-serif`;
  }
  const nameY = cardY + 72 * scale;
  ctx.fillText(repoName, cx, nameY);

  // Luminous gradient line under name
  const nameBottom = nameY + nameSize + 4 * scale;
  const lineGrad = ctx.createLinearGradient(cx, 0, cx + 280 * scale, 0);
  lineGrad.addColorStop(0, primaryColor);
  lineGrad.addColorStop(0.5, secondaryColor);
  lineGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = lineGrad;
  ctx.globalAlpha = 0.5;
  ctx.fillRect(cx, nameBottom, 280 * scale, 2.5 * scale);
  // Glow under line
  ctx.globalAlpha = 0.15;
  ctx.filter = `blur(${6 * scale}px)`;
  ctx.fillRect(cx, nameBottom - 2 * scale, 280 * scale, 8 * scale);
  ctx.filter = 'none';
  ctx.globalAlpha = 1;

  // Description — soft, breathable
  const descY = nameBottom + 28 * scale;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = `300 ${26 * scale}px "Inter", sans-serif`;
  wrapText(ctx, description, cx, descY, contentMaxW, 38 * scale);

  // ===== BOTTOM SECTION =====
  const bottomY = cardY + cardH - 50 * scale;

  // Language pill with glow
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = primaryColor;
  ctx.filter = `blur(${10 * scale}px)`;
  ctx.beginPath();
  ctx.roundRect(cx - 5 * scale, bottomY - 30 * scale, 120 * scale, 40 * scale, 20 * scale);
  ctx.fill();
  ctx.filter = 'none';
  ctx.restore();
  // Language pill — custom drawn for vertical centering
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${20 * scale}px "JetBrains Mono"`;
  const pillPad = 20 * scale;
  const pillTextW = ctx.measureText(language).width;
  const pillW = pillTextW + pillPad * 2;
  const pillH = 40 * scale;
  const pillX = cx;
  const pillY = bottomY - pillH / 2 - 4 * scale;

  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = primaryColor;
  ctx.fillText(language, pillX + pillPad, pillY + pillH / 2);

  // Stats — soft, right-aligned
  ctx.textAlign = 'right';
  let statX = cardX + cardW - 50 * scale;

  // Support URL
  if (supportUrl) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = `300 ${16 * scale}px "JetBrains Mono"`;
    ctx.textBaseline = 'bottom';
    ctx.fillText(supportUrl, statX, bottomY);
    statX -= ctx.measureText(supportUrl).width + 36 * scale;
  }

  // Forks
  if (forks) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = `500 ${20 * scale}px "JetBrains Mono"`;
    ctx.textBaseline = 'bottom';
    ctx.fillText(`${forks}`, statX, bottomY);
    const forksNumW = ctx.measureText(`${forks}`).width;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = `300 ${14 * scale}px "Inter", sans-serif`;
    ctx.fillText(' forks', statX - forksNumW - 2 * scale, bottomY);
    statX -= forksNumW + ctx.measureText(' forks').width + 30 * scale;
  }

  // Stars with tiny glow
  if (stars) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = `500 ${20 * scale}px "JetBrains Mono"`;
    ctx.textBaseline = 'bottom';
    ctx.fillText(`${stars}`, statX, bottomY);
    const starsNumW = ctx.measureText(`${stars}`).width;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = `300 ${14 * scale}px "Inter", sans-serif`;
    ctx.fillText(' stars', statX - starsNumW - 2 * scale, bottomY);

    // Tiny star glow
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.arc(statX - starsNumW - ctx.measureText(' stars').width - 14 * scale, bottomY - 8 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.08;
    ctx.filter = `blur(${4 * scale}px)`;
    ctx.beginPath();
    ctx.arc(statX - starsNumW - ctx.measureText(' stars').width - 14 * scale, bottomY - 8 * scale, 10 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.filter = 'none';
    ctx.restore();
  }

  // ===== OUTER AMBIENT GLOW on card edges =====
  ctx.save();
  // Bottom-right glow
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = primaryColor;
  ctx.filter = `blur(${40 * scale}px)`;
  ctx.beginPath();
  ctx.arc(cardX + cardW, cardY + cardH, 100 * scale, 0, Math.PI * 2);
  ctx.fill();
  // Top-left glow
  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.arc(cardX, cardY, 80 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.filter = 'none';
  ctx.restore();
};
