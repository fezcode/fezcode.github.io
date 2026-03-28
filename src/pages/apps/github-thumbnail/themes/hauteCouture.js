export const hauteCouture = (ctx, width, height, scale, data) => {
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

  // --- Stark editorial background ---
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Diagonal color block — bold fashion slash
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(width * 0.55, 0);
  ctx.lineTo(width * 0.72, 0);
  ctx.lineTo(width * 0.42, height);
  ctx.lineTo(width * 0.25, height);
  ctx.closePath();
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.12;
  ctx.fill();
  ctx.restore();

  // Second thinner slash
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(width * 0.74, 0);
  ctx.lineTo(width * 0.78, 0);
  ctx.lineTo(width * 0.48, height);
  ctx.lineTo(width * 0.44, height);
  ctx.closePath();
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.08;
  ctx.fill();
  ctx.restore();

  // Fashion grid pattern (if showPattern)
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.03;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1 * scale;
    // Horizontal rules
    for (let y = 0; y < height; y += 40 * scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    // Vertical rules
    for (let x = 0; x < width; x += 40 * scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    ctx.restore();
  }

  const pad = 60 * scale;

  // --- MASSIVE repo name — the hero ---
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Measure and scale font to be as large as possible
  let fontSize = 180 * scale;
  ctx.font = `900 ${fontSize}px "Inter", "Helvetica Neue", sans-serif`;
  while (ctx.measureText(repoName.toUpperCase()).width > width - pad * 2 && fontSize > 60 * scale) {
    fontSize -= 4 * scale;
    ctx.font = `900 ${fontSize}px "Inter", "Helvetica Neue", sans-serif`;
  }

  const nameUpper = repoName.toUpperCase();
  const nameY = height * 0.18;
  ctx.fillText(nameUpper, pad, nameY);

  // Measure actual name height
  const nameMetrics = ctx.measureText(nameUpper);
  const nameBottom = nameY + nameMetrics.actualBoundingBoxDescent;

  // Accent underline — two-tone
  const lineY = nameBottom + 12 * scale;
  ctx.fillStyle = primaryColor;
  ctx.fillRect(pad, lineY, 120 * scale, 6 * scale);
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(pad + 130 * scale, lineY, 60 * scale, 6 * scale);
  ctx.restore();

  // --- Owner as spaced-out editorial subtitle ---
  const ownerY = lineY + 30 * scale;
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = `300 ${22 * scale}px "Inter", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const ownerSpaced = repoOwner.toUpperCase().split('').join('  ');
  ctx.fillText(ownerSpaced, pad, ownerY);

  // --- Description — elegant, light weight ---
  const descY = ownerY + 48 * scale;
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `300 ${24 * scale}px "Inter", sans-serif`;
  const words = description.split(' ');
  let line = '';
  let currentY = descY;
  const maxW = width * 0.55;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > maxW && i > 0) {
      ctx.fillText(line.trim(), pad, currentY);
      line = words[i] + ' ';
      currentY += 34 * scale;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), pad, currentY);

  // --- Right side: editorial metadata column ---
  const metaX = width * 0.7;

  // Language — HUGE vertical text
  ctx.save();
  ctx.translate(width - pad - 10 * scale, height * 0.15);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.15;
  ctx.font = `900 ${120 * scale}px "Inter", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(language.toUpperCase(), 0, 0);
  ctx.restore();

  // Stats — stacked, bold numbers
  const statsX = metaX;
  let statsY = height * 0.45;

  if (stars) {
    ctx.fillStyle = '#fff';
    ctx.font = `900 ${48 * scale}px "Inter", sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(String(stars), statsX, statsY);

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `300 ${14 * scale}px "Inter", sans-serif`;
    ctx.fillText('STARS', statsX, statsY + 54 * scale);
    statsY += 90 * scale;
  }

  if (forks) {
    ctx.fillStyle = '#fff';
    ctx.font = `900 ${48 * scale}px "Inter", sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(String(forks), statsX, statsY);

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `300 ${14 * scale}px "Inter", sans-serif`;
    ctx.fillText('FORKS', statsX, statsY + 54 * scale);
  }

  // --- Bottom bar ---
  const bottomY = height - pad;

  // Language pill — minimal rectangle
  ctx.fillStyle = primaryColor;
  ctx.font = `600 ${16 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  const langText = language.toUpperCase();
  const langW = ctx.measureText(langText).width + 24 * scale;
  ctx.globalAlpha = 0.15;
  ctx.fillRect(pad, bottomY - 24 * scale, langW, 28 * scale);
  ctx.globalAlpha = 1;
  ctx.fillStyle = primaryColor;
  ctx.fillText(langText, pad + 12 * scale, bottomY);

  // Thin horizontal rule
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(pad, bottomY - 36 * scale, width - pad * 2, 1 * scale);

  // Support URL — right aligned
  if (supportUrl) {
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = `300 ${14 * scale}px "JetBrains Mono"`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(supportUrl, width - pad, bottomY);
  }

  // Issue / Season tag
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.font = `300 ${12 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('ISSUE No. 01  —  DIGITAL EDITION', width - pad, pad);
};
