import { wrapText } from '../utils';

export const cybernetic = (ctx, width, height, scale, data) => {
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
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, width, height);

  // Hexagon Pattern Background
  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1 * scale;
  const size = 60 * scale;
  for (let y = 0; y < height + size; y += size * 1.5) {
    for (let x = 0; x < width + size; x += size * Math.sqrt(3)) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        ctx.lineTo(
          x + size * Math.cos(angle),
          y + size * Math.sin(angle)
        );
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.restore();

  // Tech Frame
  const padding = 60 * scale;
  const borderW = 4 * scale;
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = borderW;
  ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

  // Corner Accents
  const cornerSize = 40 * scale;
  ctx.fillStyle = primaryColor;
  const drawCorner = (x, y, dx, dy) => {
    ctx.beginPath();
    ctx.moveTo(x, y + dy * cornerSize);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * cornerSize, y);
    ctx.lineTo(x + dx * cornerSize, y + dy * 10 * scale);
    ctx.lineTo(x + dx * 10 * scale, y + dy * 10 * scale);
    ctx.lineTo(x + dx * 10 * scale, y + dy * cornerSize);
    ctx.closePath();
    ctx.fill();
  };

  drawCorner(padding, padding, 1, 1);
  drawCorner(width - padding, padding, -1, 1);
  drawCorner(padding, height - padding, 1, -1);
  drawCorner(width - padding, height - padding, -1, -1);

  // Content
  const contentPad = padding + 80 * scale;

  // Repo Owner (HUD style)
  ctx.textAlign = 'left';
  ctx.font = `bold ${30 * scale}px "JetBrains Mono", monospace`;
  ctx.fillStyle = secondaryColor;
  ctx.fillText(`ID: ${repoOwner.toUpperCase()}`, contentPad, padding + 100 * scale);

  // Repo Name (Glitch Style)
  ctx.save();
  ctx.font = `900 ${110 * scale}px "Orbitron", "Arial Black", sans-serif`;
  ctx.shadowColor = primaryColor;
  ctx.shadowBlur = 20 * scale;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(repoName, contentPad, padding + 220 * scale);

  // Slight offset glow
  ctx.shadowColor = secondaryColor;
  ctx.shadowBlur = 10 * scale;
  ctx.fillText(repoName, contentPad + 2 * scale, padding + 220 * scale);
  ctx.restore();

  // Description
  ctx.font = `${34 * scale}px "JetBrains Mono", monospace`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  wrapText(
    ctx,
    description,
    contentPad,
    padding + 320 * scale,
    width - padding * 2 - 160 * scale,
    45 * scale,
  );

  // Footer Stats
  const footerY = height - padding - 60 * scale;

  // HUD Bars
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.2;
  ctx.fillRect(contentPad, footerY - 40 * scale, width - padding * 2 - 160 * scale, 60 * scale);
  ctx.globalAlpha = 1.0;

  // Stats
  ctx.font = `bold ${24 * scale}px "JetBrains Mono", monospace`;
  ctx.fillStyle = '#ffffff';
  let statX = contentPad + 30 * scale;

  const drawHudStat = (label, value) => {
    if (!value) return;
    const text = `${label}::${value}`;
    ctx.fillText(text, statX, footerY);
    statX += ctx.measureText(text).width + 60 * scale;
  };

  drawHudStat('STR', stars);
  drawHudStat('FRK', forks);
  drawHudStat('LNG', language.toUpperCase());

  // Support URL (Scanline style)
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.font = `bold ${20 * scale}px "JetBrains Mono", monospace`;
    ctx.fillStyle = secondaryColor;
    ctx.fillText(supportUrl, width - padding - 80 * scale, footerY);
  }

  // Scanlines
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#000000';
  for (let i = 0; i < height; i += 4 * scale) {
    ctx.fillRect(0, i, width, 1 * scale);
  }
  ctx.restore();
};
