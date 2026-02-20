import { wrapText } from '../utils';

export const terminalPro = (ctx, width, height, scale, data) => {
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
    supportUrl,
  } = data;

  const padding = 60 * scale;

  // 1. Terminal Background (using bgColor)
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Terminal Frame (Modern CLI style)
  ctx.strokeStyle = '#ffffff';
  ctx.globalAlpha = 0.1;
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

  // 3. Header Bar (Status bar)
  ctx.fillStyle = primaryColor;
  ctx.fillRect(padding, padding, width - padding * 2, 40 * scale);

  ctx.fillStyle = '#000000';
  ctx.font = `bold ${16 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'left';
  ctx.fillText(`STATUS: ONLINE // PID: 2026 // NODE: ${repoOwner.toUpperCase()}`, padding + 20 * scale, padding + 26 * scale);

  ctx.textAlign = 'right';
  ctx.fillText(`${new Date().toLocaleDateString()}`, width - padding - 20 * scale, padding + 26 * scale);

  // 4. Main Body Content (Terminal Emulator)
  const bodyY = padding + 60 * scale;

  // Prompt line
  ctx.fillStyle = secondaryColor;
  ctx.textAlign = 'left';
  ctx.font = `bold ${32 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('>', padding + 20 * scale, bodyY + 60 * scale);

  // Repo Name (Project ID)
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${100 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(repoName.toUpperCase(), padding + 60 * scale, bodyY + 110 * scale);

  // Version/Stars (Sub-header)
  ctx.fillStyle = primaryColor;
  ctx.font = `bold ${24 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(`[ ★ STARS: ${stars} ] [ ⑂ FORKS: ${forks} ]`, padding + 60 * scale, bodyY + 170 * scale);

  // Description (Code/JSON style preview)
  const descY = bodyY + 240 * scale;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = `bold ${28 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('/* PROJECT DESCRIPTION */', padding + 20 * scale, descY);

  ctx.fillStyle = '#ffffff';
  ctx.font = `${30 * scale}px "JetBrains Mono", monospace`;
  wrapText(
    ctx,
    description,
    padding + 20 * scale,
    descY + 60 * scale,
    width - padding * 3,
    45 * scale
  );

  // 5. Tech/ASCII detail (Footer area)
  const footerY = height - padding - 100 * scale;

  // Fake Progress Bar
  ctx.strokeStyle = '#ffffff';
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(padding + 20 * scale, footerY, 400 * scale, 20 * scale);
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = primaryColor;
  ctx.fillRect(padding + 20 * scale, footerY, 400 * 0.75 * scale, 20 * scale);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = `bold ${14 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('SYNCING SYSTEM ASSETS... 75%', padding + 20 * scale, footerY + 40 * scale);

  // Language Tag
  const langX = width - padding - 200 * scale;
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(langX, footerY, 180 * scale, 60 * scale);
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.font = `bold ${22 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(language.toUpperCase(), langX + 90 * scale, footerY + 38 * scale);

  // Support URL
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = `bold ${18 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText(`URL: ${supportUrl.toUpperCase()}`, width - padding - 20 * scale, height - padding - 10 * scale);
  }
};
