import { wrapText } from '../utils';

export const quantumOverlay = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    secondaryColor,
    bgColor,
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
  } = data;

  const padding = 60 * scale;

  // 1. Deep Space Background (using bgColor)
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Quantum Particle Field (Background)
  ctx.save();
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 3 * scale;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? primaryColor : secondaryColor;
    ctx.globalAlpha = 0.2;
    ctx.fill();

    // Random Connection Lines
    if (i < 15) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 200 * scale, y + (Math.random() - 0.5) * 200 * scale);
      ctx.strokeStyle = primaryColor;
      ctx.globalAlpha = 0.1;
      ctx.stroke();
    }
  }
  ctx.restore();

  // 3. Central HUD Ring (Gradient Stroke)
  ctx.save();
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 280 * scale;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  const hudGradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
  hudGradient.addColorStop(0, primaryColor);
  hudGradient.addColorStop(1, secondaryColor);
  ctx.strokeStyle = hudGradient;
  ctx.lineWidth = 1 * scale;
  ctx.globalAlpha = 0.3;
  ctx.stroke();

  // HUD Accents (Arcs)
  ctx.lineWidth = 4 * scale;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, -Math.PI / 4, Math.PI / 4);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 1.25);
  ctx.stroke();
  ctx.restore();

  // 4. Content - Floating in Center
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Repo Owner (Technical Label)
  ctx.font = `bold ${24 * scale}px "JetBrains Mono", monospace`;
  ctx.fillStyle = secondaryColor;
  ctx.fillText(`// NODE: ${repoOwner.toUpperCase()}`, centerX, centerY - 160 * scale);

  // Repo Name (Bold, Glowing)
  ctx.save();
  ctx.font = `900 ${120 * scale}px "Inter", "Arial Black", sans-serif`;
  ctx.shadowColor = primaryColor;
  ctx.shadowBlur = 30 * scale;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(repoName, centerX, centerY - 40 * scale);
  ctx.restore();

  // Description (Wrapped in middle)
  ctx.font = `300 ${32 * scale}px "Inter", sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  wrapText(
    ctx,
    description,
    centerX,
    centerY + 60 * scale,
    width * 0.6,
    45 * scale
  );

  // 5. Data Points (Floating around)
  const drawDataPoint = (x, y, label, value, color) => {
    ctx.textAlign = 'center';
    ctx.font = `bold ${16 * scale}px "JetBrains Mono", monospace`;
    ctx.fillStyle = color;
    ctx.fillText(label, x, y - 25 * scale);

    ctx.font = `900 ${36 * scale}px "Inter", sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(value, x, y + 10 * scale);

    // Decorative bracket
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(x - 40 * scale, y - 40 * scale);
    ctx.lineTo(x - 50 * scale, y - 40 * scale);
    ctx.lineTo(x - 50 * scale, y + 20 * scale);
    ctx.lineTo(x - 40 * scale, y + 20 * scale);
    ctx.stroke();
  };

  const dataY = height - padding - 60 * scale;
  drawDataPoint(width * 0.25, dataY, 'STARS_QUANTUM', stars, primaryColor);
  drawDataPoint(width * 0.75, dataY, 'FORKS_DISTRIB', forks, secondaryColor);

  // Language (Bottom Center)
  ctx.font = `bold ${20 * scale}px "JetBrains Mono", monospace`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText(`RUNTIME::${language.toUpperCase()}`, centerX, height - padding);

  // Scanline/Grid Overlay
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < height; i += 4 * scale) {
    ctx.fillRect(0, i, width, 1 * scale);
  }
  ctx.restore();
};
