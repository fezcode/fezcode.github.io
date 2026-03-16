import { wrapText } from '../utils';

// Simple deterministic noise for contour generation
const noise2D = (x, y) => {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

const smoothNoise = (x, y, freq) => {
  const fx = x * freq;
  const fy = y * freq;
  const ix = Math.floor(fx);
  const iy = Math.floor(fy);
  const fracX = fx - ix;
  const fracY = fy - iy;

  const v00 = noise2D(ix, iy);
  const v10 = noise2D(ix + 1, iy);
  const v01 = noise2D(ix, iy + 1);
  const v11 = noise2D(ix + 1, iy + 1);

  const i1 = v00 + fracX * (v10 - v00);
  const i2 = v01 + fracX * (v11 - v01);
  return i1 + fracY * (i2 - i1);
};

const getElevation = (x, y, w, h) => {
  const nx = x / w;
  const ny = y / h;
  return (
    smoothNoise(nx, ny, 3) * 0.5 +
    smoothNoise(nx, ny, 6) * 0.3 +
    smoothNoise(nx, ny, 12) * 0.2
  );
};

export const topographic = (ctx, width, height, scale, data) => {
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

  // --- Terrain paper background ---
  ctx.save();
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // --- Contour lines (the main visual) ---
  const contourLevels = 14;
  const step = 4 * scale; // sampling resolution

  for (let level = 0; level < contourLevels; level++) {
    const threshold = level / contourLevels;
    const isIndex = level % 4 === 0; // every 4th is a thicker "index" contour

    ctx.save();
    ctx.strokeStyle = primaryColor;
    ctx.globalAlpha = isIndex ? 0.3 : 0.1;
    ctx.lineWidth = isIndex ? 2 * scale : 1 * scale;

    // March across the grid and connect points at this elevation
    for (let y = 0; y < height; y += step) {
      let inContour = false;
      ctx.beginPath();
      for (let x = 0; x < width; x += step) {
        const elev = getElevation(x, y, width, height);
        const diff = Math.abs(elev - threshold);
        if (diff < 0.02) {
          if (!inContour) {
            ctx.moveTo(x, y);
            inContour = true;
          } else {
            ctx.lineTo(x, y);
          }
        } else {
          inContour = false;
        }
      }
      ctx.stroke();
    }

    // Vertical pass for smoother contours
    for (let x = 0; x < width; x += step) {
      let inContour = false;
      ctx.beginPath();
      for (let y = 0; y < height; y += step) {
        const elev = getElevation(x, y, width, height);
        const diff = Math.abs(elev - threshold);
        if (diff < 0.02) {
          if (!inContour) {
            ctx.moveTo(x, y);
            inContour = true;
          } else {
            ctx.lineTo(x, y);
          }
        } else {
          inContour = false;
        }
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Coordinate grid overlay (when showPattern is on) ---
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 1 * scale;
    ctx.setLineDash([4 * scale, 8 * scale]);

    const gridStep = 80 * scale;
    for (let x = gridStep; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = gridStep; y < height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Coordinate labels
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#ffffff';
    ctx.font = `400 ${9 * scale}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'left';
    let coordIdx = 0;
    for (let x = gridStep; x < width; x += gridStep * 2) {
      for (let y = gridStep; y < height; y += gridStep * 2) {
        ctx.fillText(
          `${(x / scale).toFixed(0)},${(y / scale).toFixed(0)}`,
          x + 3 * scale,
          y - 3 * scale,
        );
        coordIdx++;
      }
    }
    ctx.restore();
  }

  // --- Elevation markers (small + symbols at peaks) ---
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = secondaryColor;
  ctx.font = `500 ${10 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'center';
  const markerStep = 120 * scale;
  for (let mx = markerStep; mx < width - markerStep; mx += markerStep) {
    for (let my = markerStep; my < height - markerStep; my += markerStep) {
      const elev = getElevation(mx, my, width, height);
      if (elev > 0.6) {
        ctx.fillStyle = secondaryColor;
        ctx.globalAlpha = 0.35;
        // Cross marker
        ctx.fillRect(mx - 4 * scale, my - 0.5 * scale, 8 * scale, 1 * scale);
        ctx.fillRect(mx - 0.5 * scale, my - 4 * scale, 1 * scale, 8 * scale);
        // Elevation value
        ctx.globalAlpha = 0.2;
        ctx.fillText(`${(elev * 1000).toFixed(0)}m`, mx, my + 14 * scale);
      }
    }
  }
  ctx.restore();

  const padding = 80 * scale;

  // --- Survey frame border ---
  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeRect(
    padding * 0.4,
    padding * 0.4,
    width - padding * 0.8,
    height - padding * 0.8,
  );
  ctx.restore();

  // Corner registration marks
  ctx.save();
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 2 * scale;
  ctx.globalAlpha = 0.3;
  const cmLen = 20 * scale;
  const cmOff = padding * 0.4;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(cmOff, cmOff + cmLen);
  ctx.lineTo(cmOff, cmOff);
  ctx.lineTo(cmOff + cmLen, cmOff);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(width - cmOff - cmLen, cmOff);
  ctx.lineTo(width - cmOff, cmOff);
  ctx.lineTo(width - cmOff, cmOff + cmLen);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(cmOff, height - cmOff - cmLen);
  ctx.lineTo(cmOff, height - cmOff);
  ctx.lineTo(cmOff + cmLen, height - cmOff);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(width - cmOff - cmLen, height - cmOff);
  ctx.lineTo(width - cmOff, height - cmOff);
  ctx.lineTo(width - cmOff, height - cmOff - cmLen);
  ctx.stroke();
  ctx.restore();

  // --- Title block (top-left, like a survey legend) ---
  const titleBlockW = 420 * scale;
  const titleBlockH = 200 * scale;

  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.6;
  ctx.fillRect(padding, padding, titleBlockW, titleBlockH);
  ctx.restore();

  // Title block border
  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeRect(padding, padding, titleBlockW, titleBlockH);
  ctx.restore();

  // Survey header
  ctx.textAlign = 'left';
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.5;
  ctx.font = `500 ${11 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('GEOLOGICAL SURVEY — OPEN SOURCE REGISTRY', padding + 16 * scale, padding + 22 * scale);
  ctx.globalAlpha = 1;

  // Thin separator
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.3;
  ctx.fillRect(padding + 16 * scale, padding + 30 * scale, titleBlockW - 32 * scale, 1 * scale);
  ctx.globalAlpha = 1;

  // Owner
  ctx.fillStyle = primaryColor;
  ctx.font = `600 ${16 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(repoOwner, padding + 16 * scale, padding + 54 * scale);

  // Repo name — main title
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${48 * scale}px "Inter", sans-serif`;
  // Scale down if needed
  let tFontSize = 48;
  while (ctx.measureText(repoName).width > titleBlockW - 32 * scale && tFontSize > 24) {
    tFontSize -= 2;
    ctx.font = `800 ${tFontSize * scale}px "Inter", sans-serif`;
  }
  ctx.fillText(repoName, padding + 16 * scale, padding + 104 * scale);

  // Language & datum info
  ctx.fillStyle = secondaryColor;
  ctx.font = `400 ${13 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(`DATUM: ${language.toUpperCase()}  |  PROJECTION: OPEN-SRC`, padding + 16 * scale, padding + 130 * scale);

  // Color legend
  const legendY = padding + 155 * scale;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `400 ${10 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('LEGEND:', padding + 16 * scale, legendY);

  const swatchS = 12 * scale;
  const swatches = [
    { color: bgColor, label: 'BASE' },
    { color: primaryColor, label: 'CONTOUR' },
    { color: secondaryColor, label: 'MARKER' },
  ];
  let swX = padding + 70 * scale;
  swatches.forEach(({ color, label }) => {
    ctx.fillStyle = color;
    ctx.fillRect(swX, legendY - 9 * scale, swatchS, swatchS);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(swX, legendY - 9 * scale, swatchS, swatchS);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `400 ${10 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText(label, swX + swatchS + 4 * scale, legendY);
    swX += ctx.measureText(label).width + swatchS + 20 * scale;
  });

  // --- Description block (bottom-left) ---
  const descBlockY = height - padding - 120 * scale;
  const descBlockW = width * 0.45;

  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.45;
  ctx.fillRect(padding, descBlockY, descBlockW, 100 * scale);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 1 * scale;
  ctx.setLineDash([3 * scale, 3 * scale]);
  ctx.strokeRect(padding, descBlockY, descBlockW, 100 * scale);
  ctx.setLineDash([]);
  ctx.restore();

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = `500 ${10 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('FIELD NOTES', padding + 12 * scale, descBlockY + 18 * scale);

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `300 ${18 * scale}px "Inter", sans-serif`;
  wrapText(ctx, description, padding + 12 * scale, descBlockY + 42 * scale, descBlockW - 24 * scale, 26 * scale);

  // --- Stats panel (bottom-right) ---
  const statPanelW = 200 * scale;
  const statPanelH = 100 * scale;
  const statPanelX = width - padding - statPanelW;
  const statPanelY = height - padding - statPanelH - 20 * scale;

  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.45;
  ctx.fillRect(statPanelX, statPanelY, statPanelW, statPanelH);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = secondaryColor;
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 1 * scale;
  ctx.strokeRect(statPanelX, statPanelY, statPanelW, statPanelH);
  ctx.restore();

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = `500 ${10 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'left';
  ctx.fillText('SURVEY METRICS', statPanelX + 12 * scale, statPanelY + 18 * scale);

  let metricY = statPanelY + 42 * scale;
  if (stars) {
    ctx.fillStyle = primaryColor;
    ctx.font = `800 ${28 * scale}px "Inter", sans-serif`;
    ctx.fillText(stars, statPanelX + 12 * scale, metricY);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `400 ${12 * scale}px "JetBrains Mono", monospace`;
    const starsW = ctx.measureText(stars).width;
    ctx.font = `800 ${28 * scale}px "Inter", sans-serif`;
    ctx.font = `400 ${12 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText('STARS', statPanelX + 12 * scale + starsW + 8 * scale, metricY);
    metricY += 34 * scale;
  }

  if (forks) {
    ctx.fillStyle = secondaryColor;
    ctx.font = `800 ${28 * scale}px "Inter", sans-serif`;
    ctx.fillText(forks, statPanelX + 12 * scale, metricY);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `400 ${12 * scale}px "JetBrains Mono", monospace`;
    const forksW = ctx.measureText(forks).width;
    ctx.font = `800 ${28 * scale}px "Inter", sans-serif`;
    ctx.font = `400 ${12 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText('FORKS', statPanelX + 12 * scale + forksW + 8 * scale, metricY);
  }

  // --- Pattern / grid status indicator ---
  ctx.fillStyle = showPattern ? secondaryColor : 'rgba(255,255,255,0.15)';
  ctx.font = `500 ${10 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'right';
  ctx.fillText(
    showPattern ? 'GRID: ACTIVE' : 'GRID: HIDDEN',
    width - padding,
    padding + 18 * scale,
  );

  // --- Support URL as survey reference ---
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.font = `400 ${13 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText(`REF: ${supportUrl}`, width - padding, height - padding * 0.5 + 4 * scale);
  }
};
