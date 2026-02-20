import { wrapText } from '../utils';

export const cadTech = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    secondaryColor,
    bgColor,
    repoOwner,
    repoName,
    description,
    language,
    stars,
  } = data;

  const padding = 60 * scale;
  const borderWidth = 4; // Fixed value

  // 1. Engineering Background (Blueprint/CAD Style)
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Technical Grid (CAD Style)
  ctx.strokeStyle = '#ffffff';
  ctx.globalAlpha = 0.05;
  ctx.lineWidth = 1 * scale;
  const gridSize = 40 * scale;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

    // 3. Technical Border (using borderWidth and secondaryColor)
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = borderWidth * scale;
    ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

    // Corner Accents (Measurement lines)
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = primaryColor;
    const cornerSize = 40 * scale;

    // Top Left Accents
    ctx.beginPath();
    ctx.moveTo(padding - 20 * scale, padding);
    ctx.lineTo(padding + cornerSize, padding);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding, padding - 20 * scale);
    ctx.lineTo(padding, padding + cornerSize);
    ctx.stroke();

    // 4. Content - Architectural Layout
    ctx.textAlign = 'left';

    // Project Info Box (Top Right)
    const infoW = 300 * scale;
    const infoH = 100 * scale;
    const infoX = width - padding - infoW - 20 * scale;
    const infoY = padding + 20 * scale;

    ctx.strokeStyle = secondaryColor;
    ctx.strokeRect(infoX, infoY, infoW, infoH);

    ctx.font = `bold ${16 * scale}px "JetBrains Mono", monospace`;
    ctx.fillStyle = secondaryColor;
    ctx.fillText('REF_NODE: 0x2026', infoX + 15 * scale, infoY + 30 * scale);
    ctx.fillText(`OWNER: ${repoOwner.toUpperCase()}`, infoX + 15 * scale, infoY + 60 * scale);
    ctx.fillText(`DATE: ${new Date().toLocaleDateString()}`, infoX + 15 * scale, infoY + 85 * scale);

    // Main Heading (Blueprint style)
    ctx.font = `900 ${110 * scale}px "Inter", sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(repoName, padding + 40 * scale, padding + 160 * scale);

    // Underline with Measurement labels
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = primaryColor;
    ctx.beginPath();
    ctx.moveTo(padding + 40 * scale, padding + 180 * scale);
    ctx.lineTo(width - padding - 40 * scale, padding + 180 * scale);
    ctx.stroke();

    ctx.font = `bold ${12 * scale}px "JetBrains Mono", monospace`;
    ctx.fillStyle = primaryColor;
    ctx.fillText(`${width - padding * 2}mm_REF`, width / 2, padding + 175 * scale);

    // Description (Architectural notes)
    ctx.font = `${30 * scale}px "Inter", sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    wrapText(
      ctx,
      description.toUpperCase(),
      padding + 40 * scale,
      padding + 250 * scale,
      width - padding * 3,
      45 * scale
    );

    // 5. Tech Metadata (Bottom)
    const footerY = height - padding - 40 * scale;

    // Language Chip
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(padding + 40 * scale, footerY, 180 * scale, 60 * scale);
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${24 * scale}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(language.toUpperCase(), padding + 40 * scale + 90 * scale, footerY + 38 * scale);
    // Metrics (Table style)
  ctx.textAlign = 'right';
  ctx.font = `bold ${20 * scale}px "JetBrains Mono", monospace`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`| ST_REF: ${stars} | FK_REF: ${stars / 2} |`, width - padding - 40 * scale, footerY + 35 * scale);
};
