import { wrapText } from '../utils';

export const tacticalMap = (ctx, width, height, scale, data) => {
  const {
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
    primaryColor,
    secondaryColor,
    bgColor,
    showPattern
    } = data;

    // Use dynamic colors from the generator
    const phosphor = primaryColor || '#00FF41';
    const accent = secondaryColor || '#ffffff';
    const bg = bgColor || '#050a05';

    // Helper to convert hex to rgba for low-opacity variants
    const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const darkPhosphor = hexToRgba(phosphor, 0.1);

    // Background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // 1. Grid Overlay (Only if showPattern is enabled)
    if (showPattern) {
    ctx.strokeStyle = darkPhosphor;
    ctx.lineWidth = 1 * scale;
    const gridSize = 80 * scale;

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Grid Latitude/Longitude Labels
    ctx.fillStyle = hexToRgba(phosphor, 0.3);
    ctx.font = `${10 * scale}px "JetBrains Mono", monospace`;
    for (let x = 0; x <= width; x += gridSize * 2) {
      ctx.fillText(`${(x / 10).toFixed(0)}°E`, x + 5 * scale, 15 * scale);
    }
    for (let y = 0; y <= height; y += gridSize * 2) {
      ctx.fillText(`${(y / 10).toFixed(0)}°N`, 5 * scale, y + 15 * scale);
    }
    }
  // 2. Center Coordinates (Simplified)
  const cx = width / 2;
  const cy = height / 2;

  // 3. Main Text Content
  const padding = 100 * scale;

  // Glow for text
  ctx.shadowBlur = 12 * scale;
  ctx.shadowColor = phosphor;

  // Repo Name
  if (repoName) {
    ctx.fillStyle = phosphor;
    ctx.font = `900 ${100 * scale}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(repoName.toUpperCase(), cx, cy - 30 * scale);
  }

  // Owner Tag
  if (repoOwner) {
    ctx.font = `bold ${22 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText(`USER: ${repoOwner.toUpperCase()}`, cx, cy - 140 * scale);
  }

  // Description
  ctx.shadowBlur = 0;
  if (description) {
    ctx.fillStyle = accent;
    ctx.font = `${26 * scale}px "JetBrains Mono", monospace`;
    wrapText(
      ctx,
      description.toUpperCase(),
      cx,
      cy + 80 * scale,
      width - padding * 4,
      38 * scale,
      true // center
    );
  }

  // 4. Corner Data Blocks
  ctx.textAlign = 'left';
  ctx.font = `bold ${18 * scale}px "JetBrains Mono", monospace`;
  ctx.fillStyle = phosphor;

  // Top Left: System Stats
  if (data.supportUrl) {
    ctx.fillText(`ADDR: ${data.supportUrl.toUpperCase()}`, padding, padding);
  } else {
    ctx.fillText(`ADDR: GITHUB.COM/${repoOwner.toUpperCase()}`, padding, padding);
  }
  ctx.fillText(`SIGNAL: LOCKED`, padding, padding + 25 * scale);

  // Top Right: Coordinate Data (Ankara, Turkey)
  ctx.textAlign = 'right';
  ctx.fillText(`LOC: 39.9334° N, 32.8597° E`, width - padding, padding);
  ctx.fillText(`AZM: 312.4° // ELV: +44.2`, width - padding, padding + 25 * scale);

  // Bottom Left: Repo Stats
  ctx.textAlign = 'left';
  const bottomY = height - padding;
  let statsShown = 0;
  if (stars && stars !== '0') {
    ctx.fillText(`★ STARS: ${stars}`, padding, bottomY);
    statsShown++;
  }
  if (forks && forks !== '0') {
    ctx.fillText(`⑂ FORKS: ${forks}`, padding, bottomY + (statsShown * 25 * scale));
    statsShown++;
  }

  // Bottom Right: Language & Date
  ctx.textAlign = 'right';
  if (language) {
    ctx.fillText(`LANG: ${language.toUpperCase()}`, width - padding, bottomY);
  }
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.6;
  ctx.font = `normal ${14 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(`DATE_RECORDED: ${new Date().toLocaleDateString()}`, width - padding, bottomY + 25 * scale);
  ctx.globalAlpha = 1.0;
  // 5. Random "Vector" Lines to simulate a map
  ctx.strokeStyle = phosphor;
  ctx.lineWidth = 1 * scale;
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.moveTo(width * 0.1, height * 0.85);
  ctx.lineTo(width * 0.25, height * 0.7);
  ctx.lineTo(width * 0.18, height * 0.55);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width * 0.88, height * 0.15);
  ctx.lineTo(width * 0.75, height * 0.35);
  ctx.lineTo(width * 0.82, height * 0.45);
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  // Scanlines Overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  for (let i = 0; i < height; i += 4 * scale) {
    ctx.fillRect(0, i, width, 2 * scale);
  }
};
