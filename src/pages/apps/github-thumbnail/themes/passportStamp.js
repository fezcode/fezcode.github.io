export const passportStamp = (ctx, width, height, scale, data) => {
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

  // --- Passport page background ---
  // Off-white / cream paper base
  const paperColor = '#f5f0e8';
  ctx.fillStyle = paperColor;
  ctx.fillRect(0, 0, width, height);

  // Subtle paper grain texture (if showPattern)
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.04;
    for (let i = 0; i < 600; i++) {
      const x = ((i * 97 + 31) % 1280) * (width / 1280);
      const y = ((i * 53 + 17) % 640) * (height / 640);
      const size = (1 + (i % 3)) * scale;
      ctx.fillStyle = i % 3 === 0 ? '#8b7355' : '#a09080';
      ctx.fillRect(x, y, size, size);
    }
    ctx.restore();

    // Faint security guilloche lines
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = bgColor;
    ctx.lineWidth = 0.8 * scale;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 2) {
        const y = height / 2 + Math.sin(x / (60 + i * 10) + i) * (80 + i * 15) * scale;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Faded background watermark (country emblem style) ---
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = '#5a4a3a';
  ctx.lineWidth = 2 * scale;
  const cx = width * 0.5;
  const cy = height * 0.48;
  const emblemR = 200 * scale;
  // Outer circle
  ctx.beginPath();
  ctx.arc(cx, cy, emblemR, 0, Math.PI * 2);
  ctx.stroke();
  // Inner circle
  ctx.beginPath();
  ctx.arc(cx, cy, emblemR * 0.75, 0, Math.PI * 2);
  ctx.stroke();
  // Spokes
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * emblemR * 0.75, cy + Math.sin(angle) * emblemR * 0.75);
    ctx.lineTo(cx + Math.cos(angle) * emblemR, cy + Math.sin(angle) * emblemR);
    ctx.stroke();
  }
  ctx.restore();

  // --- Main stamp (repo name) — large circular stamp ---
  const stampX = width * 0.35;
  const stampY = height * 0.42;
  const stampR = 160 * scale;
  const stampAngle = -0.12; // Slightly tilted

  ctx.save();
  ctx.translate(stampX, stampY);
  ctx.rotate(stampAngle);

  // Stamp ink color from primaryColor
  ctx.strokeStyle = primaryColor;
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = 4 * scale;

  // Double circle border
  ctx.beginPath();
  ctx.arc(0, 0, stampR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, stampR - 10 * scale, 0, Math.PI * 2);
  ctx.stroke();

  // Repo name curved along top of stamp
  ctx.font = `bold ${28 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const nameUpper = repoName.toUpperCase();
  const nameArcR = stampR - 35 * scale;
  const nameSpread = Math.min(Math.PI * 0.9, nameUpper.length * 0.14);
  const nameStart = -Math.PI / 2 - nameSpread / 2;
  for (let i = 0; i < nameUpper.length; i++) {
    const charAngle = nameStart + (i / (nameUpper.length - 1 || 1)) * nameSpread;
    ctx.save();
    ctx.translate(Math.cos(charAngle) * nameArcR, Math.sin(charAngle) * nameArcR);
    ctx.rotate(charAngle + Math.PI / 2);
    ctx.fillText(nameUpper[i], 0, 0);
    ctx.restore();
  }

  // Center: star icon and stars count
  ctx.font = `bold ${36 * scale}px serif`;
  ctx.fillText('★', 0, -10 * scale);
  if (stars) {
    ctx.font = `bold ${20 * scale}px "JetBrains Mono"`;
    ctx.fillText(String(stars), 0, 20 * scale);
  }

  // Owner curved along bottom
  ctx.font = `bold ${16 * scale}px "JetBrains Mono"`;
  const ownerUpper = repoOwner.toUpperCase();
  const ownerArcR = stampR - 30 * scale;
  const ownerSpread = Math.min(Math.PI * 0.7, ownerUpper.length * 0.11);
  const ownerStart = Math.PI / 2 - ownerSpread / 2;
  for (let i = 0; i < ownerUpper.length; i++) {
    const charAngle = ownerStart + (i / (ownerUpper.length - 1 || 1)) * ownerSpread;
    ctx.save();
    ctx.translate(Math.cos(charAngle) * ownerArcR, Math.sin(charAngle) * ownerArcR);
    ctx.rotate(charAngle - Math.PI / 2);
    ctx.fillText(ownerUpper[i], 0, 0);
    ctx.restore();
  }

  ctx.restore();

  // --- Rectangular entry stamp (language + forks) ---
  const rectX = width * 0.68;
  const rectY = height * 0.22;
  const rectW = 260 * scale;
  const rectH = 100 * scale;
  const rectAngle = 0.08;

  ctx.save();
  ctx.translate(rectX, rectY);
  ctx.rotate(rectAngle);
  ctx.globalAlpha = 0.7;

  // Border
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 3 * scale;
  ctx.strokeRect(-rectW / 2, -rectH / 2, rectW, rectH);
  ctx.strokeRect(-rectW / 2 + 6 * scale, -rectH / 2 + 6 * scale, rectW - 12 * scale, rectH - 12 * scale);

  // Language header
  ctx.fillStyle = secondaryColor;
  ctx.font = `bold ${14 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LANGUAGE', 0, -rectH / 2 + 24 * scale);

  // Language value
  ctx.font = `bold ${32 * scale}px "JetBrains Mono"`;
  ctx.fillText(language.toUpperCase(), 0, 4 * scale);

  // Forks at bottom
  if (forks) {
    ctx.font = `${14 * scale}px "JetBrains Mono"`;
    ctx.fillText(`FORKS: ${forks}`, 0, rectH / 2 - 20 * scale);
  }

  ctx.restore();

  // --- Small date/exit stamp (description area) ---
  const smallStampX = width * 0.72;
  const smallStampY = height * 0.68;
  const smallR = 70 * scale;
  const smallAngle = 0.3;

  ctx.save();
  ctx.translate(smallStampX, smallStampY);
  ctx.rotate(smallAngle);
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = '#7a6a5a';
  ctx.fillStyle = '#7a6a5a';
  ctx.lineWidth = 2.5 * scale;

  ctx.beginPath();
  ctx.arc(0, 0, smallR, 0, Math.PI * 2);
  ctx.stroke();

  // Horizontal lines through center
  ctx.fillRect(-smallR + 10 * scale, -6 * scale, smallR * 2 - 20 * scale, 1.5 * scale);
  ctx.fillRect(-smallR + 10 * scale, 6 * scale, smallR * 2 - 20 * scale, 1.5 * scale);

  ctx.font = `bold ${11 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('OPEN SOURCE', 0, -18 * scale);
  ctx.font = `bold ${14 * scale}px "JetBrains Mono"`;
  ctx.fillText('APPROVED', 0, 0);
  ctx.font = `${10 * scale}px "JetBrains Mono"`;
  ctx.fillText('ENTRY GRANTED', 0, 18 * scale);

  ctx.restore();

  // --- Description: handwritten-style text along left side ---
  const descX = 50 * scale;
  const descY = height * 0.72;

  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#3a3028';
  ctx.font = `italic ${24 * scale}px "Georgia", serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Manual word wrap
  const words = description.split(' ');
  let line = '';
  let lineY = descY;
  const maxW = width * 0.45;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > maxW && i > 0) {
      ctx.fillText(line.trim(), descX, lineY);
      line = words[i] + ' ';
      lineY += 32 * scale;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), descX, lineY);
  ctx.restore();

  // --- Support URL as a small printed footer ---
  if (supportUrl) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#5a4a3a';
    ctx.font = `${14 * scale}px "JetBrains Mono"`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(supportUrl, width - 30 * scale, height - 20 * scale);
    ctx.restore();
  }

  // --- Page number / passport number top-right ---
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#3a3028';
  ctx.font = `${12 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('PAGE 01 / 01', width - 30 * scale, 20 * scale);
  ctx.restore();

  // --- Perforated edge on right side (passport page edge) ---
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#8b7355';
  for (let y = 20 * scale; y < height - 20 * scale; y += 12 * scale) {
    ctx.beginPath();
    ctx.arc(width - 6 * scale, y, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};
