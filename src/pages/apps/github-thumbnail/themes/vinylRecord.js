export const vinylRecord = (ctx, width, height, scale, data) => {
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

  // --- Album sleeve background ---
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Subtle cardboard texture (if showPattern)
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 800; i++) {
      const x = ((i * 131 + 7) % 1280) * (width / 1280);
      const y = ((i * 79 + 23) % 640) * (height / 640);
      ctx.fillStyle = i % 2 === 0 ? '#fff' : '#000';
      ctx.fillRect(x, y, (1 + (i % 2)) * scale, scale);
    }
    ctx.restore();
  }

  // --- The vinyl record ---
  const recordCX = width * 0.38;
  const recordCY = height * 0.5;
  const recordR = height * 0.44;

  // Record shadow
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(recordCX + 8 * scale, recordCY + 8 * scale, recordR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Record body (black vinyl)
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(recordCX, recordCY, recordR, 0, Math.PI * 2);
  ctx.fill();

  // Grooves — concentric rings with subtle sheen
  if (showPattern) {
    ctx.save();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 0.5 * scale;
    for (let r = recordR * 0.35; r < recordR * 0.95; r += 3 * scale) {
      ctx.globalAlpha = 0.3 + Math.sin(r * 0.1) * 0.15;
      ctx.beginPath();
      ctx.arc(recordCX, recordCY, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Light reflection arc across record
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 40 * scale;
  ctx.beginPath();
  ctx.arc(recordCX - 30 * scale, recordCY - 30 * scale, recordR * 0.7, -0.8, 0.4);
  ctx.stroke();
  ctx.restore();

  // --- Center label ---
  const labelR = recordR * 0.3;

  // Label background with gradient
  const labelGrad = ctx.createRadialGradient(
    recordCX, recordCY, 0,
    recordCX, recordCY, labelR,
  );
  labelGrad.addColorStop(0, primaryColor);
  labelGrad.addColorStop(1, secondaryColor);
  ctx.fillStyle = labelGrad;
  ctx.beginPath();
  ctx.arc(recordCX, recordCY, labelR, 0, Math.PI * 2);
  ctx.fill();

  // Label rim
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.arc(recordCX, recordCY, labelR, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring on label
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.arc(recordCX, recordCY, labelR * 0.85, 0, Math.PI * 2);
  ctx.stroke();

  // Spindle hole
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(recordCX, recordCY, 6 * scale, 0, Math.PI * 2);
  ctx.fill();

  // --- Label text ---
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Record label name (owner as label)
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = `bold ${11 * scale}px "JetBrains Mono"`;
  ctx.fillText(repoOwner.toUpperCase() + ' RECORDS', recordCX, recordCY - labelR * 0.55);

  // Repo name as track title
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${20 * scale}px "Inter", sans-serif`;
  const nameDisplay = repoName.length > 14 ? repoName.substring(0, 13) + '…' : repoName;
  ctx.fillText(nameDisplay, recordCX, recordCY - 4 * scale);

  // Language as genre
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `italic ${12 * scale}px "Inter", sans-serif`;
  ctx.fillText(language, recordCX, recordCY + 18 * scale);

  // RPM / format text
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = `${9 * scale}px "JetBrains Mono"`;
  ctx.fillText('33⅓ RPM • STEREO', recordCX, recordCY + labelR * 0.55);

  // --- Right side: Album sleeve info ---
  const infoX = width * 0.64;
  const infoY = height * 0.14;
  const infoW = width * 0.32;

  // Album title (repo name, large)
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = primaryColor;
  ctx.font = `bold ${52 * scale}px "Inter", sans-serif`;

  // Word wrap for long names
  let fittedName = repoName;
  ctx.font = `bold ${52 * scale}px "Inter", sans-serif`;
  if (ctx.measureText(repoName).width > infoW) {
    ctx.font = `bold ${38 * scale}px "Inter", sans-serif`;
    fittedName = repoName;
  }
  ctx.fillText(fittedName, infoX, infoY);

  // Artist line (owner)
  const artistY = infoY + (ctx.measureText('M').actualBoundingBoxAscent + ctx.measureText('M').actualBoundingBoxDescent) + 16 * scale;
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = `${20 * scale}px "JetBrains Mono"`;
  ctx.fillText(`by ${repoOwner}`, infoX, artistY);

  // Divider line
  const divY = artistY + 36 * scale;
  const divGrad = ctx.createLinearGradient(infoX, 0, infoX + infoW, 0);
  divGrad.addColorStop(0, primaryColor);
  divGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = divGrad;
  ctx.fillRect(infoX, divY, infoW, 2 * scale);

  // Description as liner notes
  const notesY = divY + 20 * scale;
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `italic ${18 * scale}px "Georgia", serif`;
  // Manual wrap
  const words = description.split(' ');
  let line = '';
  let lineY = notesY;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > infoW && i > 0) {
      ctx.fillText(line.trim(), infoX, lineY);
      line = words[i] + ' ';
      lineY += 26 * scale;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), infoX, lineY);

  // --- Track listing style stats ---
  const statsY = lineY + 50 * scale;
  ctx.font = `${14 * scale}px "JetBrains Mono"`;
  ctx.fillStyle = 'rgba(255,255,255,0.35)';

  let statLine = statsY;
  if (stars) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('A1', infoX, statLine);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(`${stars} Stars`, infoX + 30 * scale, statLine);
    // Dotted leader
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    const dotsStart = infoX + 30 * scale + ctx.measureText(`${stars} Stars`).width + 8 * scale;
    for (let dx = dotsStart; dx < infoX + infoW - 40 * scale; dx += 6 * scale) {
      ctx.fillRect(dx, statLine + 5 * scale, 2 * scale, 1 * scale);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.textAlign = 'right';
    ctx.fillText('3:45', infoX + infoW, statLine);
    ctx.textAlign = 'left';
    statLine += 22 * scale;
  }

  if (forks) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('A2', infoX, statLine);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(`${forks} Forks`, infoX + 30 * scale, statLine);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    const dotsStart = infoX + 30 * scale + ctx.measureText(`${forks} Forks`).width + 8 * scale;
    for (let dx = dotsStart; dx < infoX + infoW - 40 * scale; dx += 6 * scale) {
      ctx.fillRect(dx, statLine + 5 * scale, 2 * scale, 1 * scale);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.textAlign = 'right';
    ctx.fillText('4:12', infoX + infoW, statLine);
    ctx.textAlign = 'left';
    statLine += 22 * scale;
  }

  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText('B1', infoX, statLine);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText(language, infoX + 30 * scale, statLine);

  // --- Support URL as catalog number ---
  if (supportUrl) {
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = `${12 * scale}px "JetBrains Mono"`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`CAT# ${supportUrl}`, width - 40 * scale, height - 24 * scale);
  }

  // --- Copyright line ---
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = `${10 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`© ${repoOwner.toUpperCase()} RECORDS. ALL RIGHTS RESERVED.`, 40 * scale, height - 24 * scale);
};
