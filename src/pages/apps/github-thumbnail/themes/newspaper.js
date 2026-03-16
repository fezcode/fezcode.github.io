import { wrapText } from '../utils';

export const newspaper = (ctx, width, height, scale, data) => {
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

  // --- Paper background override ---
  ctx.save();
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // --- Aged paper noise texture (when showPattern is on) ---
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.03;
    ctx.fillStyle = bgColor;
    const seed = 137;
    for (let i = 0; i < 1200; i++) {
      const px = (seed * (i + 1) * 4919) % width;
      const py = (seed * (i + 1) * 7127) % height;
      const r = ((i % 4) + 0.5) * scale;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  const padding = 80 * scale;
  const inkColor = '#1a1a1a';
  const mutedInk = '#4a4540';
  const ruleColor = '#c8c0b0';

  // --- Top masthead rule (double line) ---
  ctx.fillStyle = inkColor;
  ctx.fillRect(padding, padding - 10 * scale, width - padding * 2, 4 * scale);
  ctx.fillRect(padding, padding - 2 * scale, width - padding * 2, 1 * scale);

  // --- Masthead: edition info ---
  ctx.textAlign = 'left';
  ctx.fillStyle = mutedInk;
  ctx.font = `italic 400 ${14 * scale}px Georgia, "Times New Roman", serif`;
  ctx.fillText('The Open Source Chronicle', padding, padding + 20 * scale);

  ctx.textAlign = 'right';
  ctx.font = `400 ${14 * scale}px Georgia, "Times New Roman", serif`;
  ctx.fillText(`est. ${repoOwner}`, width - padding, padding + 20 * scale);

  // --- Thin rule below masthead ---
  ctx.fillStyle = ruleColor;
  ctx.fillRect(padding, padding + 32 * scale, width - padding * 2, 1 * scale);

  // --- Headline (repo name) ---
  ctx.textAlign = 'center';
  ctx.fillStyle = inkColor;
  ctx.font = `900 ${80 * scale}px Georgia, "Times New Roman", serif`;
  const headlineY = padding + 120 * scale;

  // Measure and potentially scale down for long names
  const headlineMaxW = width - padding * 2;
  let fontSize = 80;
  ctx.font = `900 ${fontSize * scale}px Georgia, "Times New Roman", serif`;
  while (ctx.measureText(repoName).width > headlineMaxW && fontSize > 40) {
    fontSize -= 4;
    ctx.font = `900 ${fontSize * scale}px Georgia, "Times New Roman", serif`;
  }
  ctx.fillText(repoName, width / 2, headlineY);

  // --- Thin rule below headline ---
  ctx.fillStyle = ruleColor;
  ctx.fillRect(padding, headlineY + 16 * scale, width - padding * 2, 1 * scale);

  // --- Subheadline / owner byline ---
  ctx.textAlign = 'center';
  ctx.fillStyle = mutedInk;
  ctx.font = `italic 400 ${22 * scale}px Georgia, "Times New Roman", serif`;
  ctx.fillText(`By ${repoOwner}  ·  Written in ${language}`, width / 2, headlineY + 48 * scale);

  // --- Column divider (vertical rule in the middle) ---
  const columnDivX = width * 0.52;
  const bodyTop = headlineY + 72 * scale;
  const bodyBottom = height - padding - 40 * scale;
  ctx.fillStyle = ruleColor;
  ctx.fillRect(columnDivX, bodyTop, 1 * scale, bodyBottom - bodyTop);

  // --- Left column: description as article body ---
  ctx.textAlign = 'left';
  ctx.fillStyle = '#2a2520';
  ctx.font = `400 ${20 * scale}px Georgia, "Times New Roman", serif`;
  const leftColX = padding;
  const leftColW = columnDivX - padding - 30 * scale;

  // Drop cap
  if (description.length > 0) {
    const dropChar = description[0].toUpperCase();
    const restText = description.slice(1);

    ctx.fillStyle = primaryColor;
    ctx.font = `700 ${64 * scale}px Georgia, "Times New Roman", serif`;
    ctx.fillText(dropChar, leftColX, bodyTop + 48 * scale);
    const dropW = ctx.measureText(dropChar).width + 6 * scale;

    // First line after drop cap
    ctx.fillStyle = '#2a2520';
    ctx.font = `400 ${20 * scale}px Georgia, "Times New Roman", serif`;
    wrapText(ctx, restText, leftColX + dropW, bodyTop + 24 * scale, leftColW - dropW, 28 * scale);

    // Continue wrapping below
    ctx.fillStyle = '#2a2520';
    wrapText(ctx, restText, leftColX, bodyTop + 80 * scale, leftColW, 28 * scale);
  }

  // --- Right column: stats & info panel ---
  const rightColX = columnDivX + 26 * scale;
  let rightY = bodyTop + 16 * scale;

  // "By the Numbers" header
  ctx.fillStyle = inkColor;
  ctx.font = `700 ${14 * scale}px Georgia, "Times New Roman", serif`;
  ctx.textAlign = 'left';
  ctx.fillText('BY THE NUMBERS', rightColX, rightY);
  rightY += 8 * scale;

  ctx.fillStyle = ruleColor;
  ctx.fillRect(rightColX, rightY, 160 * scale, 1 * scale);
  rightY += 28 * scale;

  // Stars stat
  if (stars) {
    ctx.fillStyle = primaryColor;
    ctx.font = `900 ${44 * scale}px Georgia, "Times New Roman", serif`;
    ctx.fillText(stars, rightColX, rightY + 10 * scale);

    ctx.fillStyle = mutedInk;
    ctx.font = `italic 400 ${16 * scale}px Georgia, "Times New Roman", serif`;
    ctx.fillText('stargazers', rightColX + ctx.measureText(stars).width + 14 * scale, rightY + 10 * scale);

    // Re-measure stars width for proper positioning
    ctx.font = `900 ${44 * scale}px Georgia, "Times New Roman", serif`;
    rightY += 50 * scale;
  }

  // Forks stat
  if (forks) {
    ctx.fillStyle = secondaryColor;
    ctx.font = `900 ${44 * scale}px Georgia, "Times New Roman", serif`;
    ctx.fillText(forks, rightColX, rightY + 10 * scale);

    ctx.fillStyle = mutedInk;
    ctx.font = `italic 400 ${16 * scale}px Georgia, "Times New Roman", serif`;
    ctx.fillText('forks', rightColX + ctx.measureText(forks).width + 14 * scale, rightY + 10 * scale);

    ctx.font = `900 ${44 * scale}px Georgia, "Times New Roman", serif`;
    rightY += 50 * scale;
  }

  // Thin rule
  ctx.fillStyle = ruleColor;
  ctx.fillRect(rightColX, rightY, 160 * scale, 1 * scale);
  rightY += 24 * scale;

  // Language badge - styled as a classified tag
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.12;
  ctx.fillRect(rightColX, rightY - 14 * scale, 160 * scale, 28 * scale);
  ctx.globalAlpha = 1;

  ctx.fillStyle = primaryColor;
  ctx.font = `700 ${14 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(language.toUpperCase(), rightColX + 10 * scale, rightY + 4 * scale);

  rightY += 36 * scale;

  // Color palette indicators
  ctx.fillStyle = mutedInk;
  ctx.font = `italic 400 ${12 * scale}px Georgia, "Times New Roman", serif`;
  ctx.fillText('Color edition', rightColX, rightY);

  const swatchY = rightY + 12 * scale;
  const swatchS = 16 * scale;
  [bgColor, primaryColor, secondaryColor].forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(rightColX + i * (swatchS + 6 * scale), swatchY, swatchS, swatchS);
    ctx.strokeStyle = ruleColor;
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(rightColX + i * (swatchS + 6 * scale), swatchY, swatchS, swatchS);
  });

  // --- Bottom footer rule ---
  const footerY = height - padding;
  ctx.fillStyle = inkColor;
  ctx.fillRect(padding, footerY - 24 * scale, width - padding * 2, 2 * scale);
  ctx.fillRect(padding, footerY - 18 * scale, width - padding * 2, 1 * scale);

  // Footer text
  ctx.textAlign = 'left';
  ctx.fillStyle = mutedInk;
  ctx.font = `italic 400 ${14 * scale}px Georgia, "Times New Roman", serif`;
  ctx.fillText(
    showPattern ? '• Textured Edition •' : '• Clean Edition •',
    padding,
    footerY,
  );

  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = mutedInk;
    ctx.font = `400 ${14 * scale}px Georgia, "Times New Roman", serif`;
    ctx.fillText(supportUrl, width - padding, footerY);
  }
};
