import { wrapText, drawPill } from '../utils';

export const modernNature = (ctx, width, height, scale, data) => {
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

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Organic gradient orbs
  ctx.save();
  const grad1 = ctx.createRadialGradient(
    width * 0.75, height * 0.2, 0,
    width * 0.75, height * 0.2, 500 * scale,
  );
  grad1.addColorStop(0, primaryColor);
  grad1.addColorStop(1, 'transparent');
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = grad1;
  ctx.fillRect(0, 0, width, height);

  const grad2 = ctx.createRadialGradient(
    width * 0.15, height * 0.85, 0,
    width * 0.15, height * 0.85, 400 * scale,
  );
  grad2.addColorStop(0, secondaryColor);
  grad2.addColorStop(1, 'transparent');
  ctx.fillStyle = grad2;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Leaf vein pattern (if showPattern)
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1.5 * scale;

    // Flowing organic lines
    for (let i = 0; i < 8; i++) {
      const startY = (height / 8) * i;
      ctx.beginPath();
      ctx.moveTo(0, startY);
      for (let x = 0; x <= width; x += 40 * scale) {
        const y = startY + Math.sin((x / width) * Math.PI * 2 + i) * 60 * scale;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Scattered organic dots
    for (let i = 0; i < 30; i++) {
      const x = (width * ((i * 7 + 13) % 31)) / 31;
      const y = (height * ((i * 11 + 5) % 23)) / 23;
      const r = (3 + (i % 5)) * scale;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? primaryColor : secondaryColor;
      ctx.fill();
    }
    ctx.restore();
  }

  // Abstract leaf silhouette top-right
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(width * 0.95, 0);
  ctx.bezierCurveTo(
    width * 0.7, height * 0.05,
    width * 0.75, height * 0.35,
    width * 0.85, height * 0.45,
  );
  ctx.bezierCurveTo(
    width * 0.95, height * 0.35,
    width, height * 0.15,
    width, 0,
  );
  ctx.fill();
  ctx.restore();

  // Abstract leaf silhouette bottom-left
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.bezierCurveTo(
    width * 0.1, height * 0.75,
    width * 0.25, height * 0.7,
    width * 0.2, height * 0.6,
  );
  ctx.bezierCurveTo(
    width * 0.05, height * 0.65,
    0, height * 0.8,
    0, height,
  );
  ctx.fill();
  ctx.restore();

  // Content
  const padding = 80 * scale;

  // Owner line with botanical separator
  ctx.fillStyle = primaryColor;
  ctx.font = `500 ${26 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'left';
  const ownerText = `${repoOwner} /`;
  ctx.fillText(ownerText, padding, padding + 20 * scale);

  // Repo name
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${76 * scale}px "Inter", sans-serif`;
  ctx.fillText(repoName, padding, padding + 108 * scale);

  // Thin accent line under title
  const lineGrad = ctx.createLinearGradient(padding, 0, padding + 300 * scale, 0);
  lineGrad.addColorStop(0, primaryColor);
  lineGrad.addColorStop(1, secondaryColor);
  ctx.fillStyle = lineGrad;
  ctx.fillRect(padding, padding + 125 * scale, 200 * scale, 3 * scale);

  // Description
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = `${30 * scale}px "Inter", sans-serif`;
  const maxWidth = width - padding * 2;
  wrapText(ctx, description, padding, padding + 180 * scale, maxWidth, 44 * scale);

  // Bottom section
  const bottomY = height - padding;

  // Language pill
  drawPill(ctx, padding, bottomY - 20 * scale, language, primaryColor, scale);

  // Right-aligned stats and support URL
  ctx.textAlign = 'right';
  let currentX = width - padding;

  // Support URL
  if (supportUrl) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = `${18 * scale}px "JetBrains Mono"`;
    ctx.fillText(supportUrl, currentX, bottomY);
    currentX -= ctx.measureText(supportUrl).width + 40 * scale;
  }

  // Stats
  ctx.font = `bold ${22 * scale}px "JetBrains Mono"`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  const statGap = 36 * scale;

  if (forks) {
    ctx.fillText(`${forks} Forks`, currentX, bottomY);
    currentX -= ctx.measureText(`${forks} Forks`).width + statGap;
  }

  if (stars) {
    ctx.fillText(`${stars} Stars`, currentX, bottomY);
    currentX -= ctx.measureText(`${stars} Stars`).width + statGap;
  }

  // Small botanical accent near stats — a tiny leaf icon
  ctx.save();
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.4;
  ctx.font = `${20 * scale}px serif`;
  ctx.fillText('🌿', currentX, bottomY + 2 * scale);
  ctx.restore();
};
