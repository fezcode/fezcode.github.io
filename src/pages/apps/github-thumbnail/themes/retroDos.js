import { wrapText } from '../utils';

export const retroDos = (ctx, width, height, scale, data) => {
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

  // 1. Classic DOS Blue Background (Default DOS blue, or bgColor)
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 2. DOS Frame (using borderWidth and secondaryColor)
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = borderWidth * scale;
  ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

  // Internal Header line
  ctx.lineWidth = borderWidth / 2 * scale;
  const headerY = padding + 80 * scale;
  ctx.beginPath();
  ctx.moveTo(padding, headerY);
  ctx.lineTo(width - padding, headerY);
  ctx.stroke();

  // 3. Header Text (BIOS Style)
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${32 * scale}px "Courier New", monospace`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`FEZ-BIOS V2.0 // SYSTEM: ${repoOwner.toUpperCase()}`, padding + 30 * scale, padding + 42 * scale);

  ctx.textAlign = 'right';
  ctx.fillText('0x2026_INIT', width - padding - 30 * scale, padding + 42 * scale);

    // 4. Main Body - Command Interface
    const bodyX = padding + 40 * scale;
    const bodyY = headerY + 60 * scale;

    // Prompt line
    ctx.textAlign = 'left';
    ctx.fillStyle = primaryColor;
    ctx.fillText('C:\\\\PROJECTS\\\\> LIST_DATA --VERBOSE', bodyX, bodyY);

    // Repo Name (Blocky DOS title)
    ctx.font = `bold ${100 * scale}px "Courier New", monospace`;
    ctx.fillStyle = primaryColor;
    ctx.fillText(repoName.toUpperCase(), bodyX, bodyY + 110 * scale);

    // Divider
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(bodyX, bodyY + 140 * scale);
    ctx.lineTo(width - padding - 100 * scale, bodyY + 140 * scale);
    ctx.stroke();

    // Description (RAW LOG)
    ctx.font = `${30 * scale}px "Courier New", monospace`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('LOG_DESC:', bodyX, bodyY + 190 * scale);

    wrapText(
      ctx,
      description.toUpperCase(),
      bodyX,
      bodyY + 240 * scale,
      width - padding * 3,
      45 * scale
    );

    // 5. System Stats (Bottom area)
    const footerY = height - padding - 60 * scale;

    // Progress Bar (DOS style)
    ctx.font = `bold ${24 * scale}px "Courier New", monospace`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('BOOTING_CORE: [', bodyX, footerY);

    const barW = 300 * scale;
    const barX = bodyX + 220 * scale;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(barX, footerY - 20 * scale, barW, 25 * scale);

    ctx.fillStyle = primaryColor;
    ctx.fillRect(barX + 5 * scale, footerY - 15 * scale, barW * 0.85 * scale, 15 * scale);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('] 85%', barX + barW + 15 * scale, footerY);

    // Metadata Footer
    ctx.textAlign = 'right';
    ctx.font = `bold ${22 * scale}px "Courier New", monospace`;
    ctx.fillStyle = secondaryColor;
    ctx.fillText(`★:${stars} | ⑂:${stars / 2} | LANG:${language.toUpperCase()}`, width - padding - 40 * scale, footerY);
};
