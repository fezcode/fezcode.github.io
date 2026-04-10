export const cassetteJCard = (ctx, width, height, scale, data) => {
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

  // --- Outer card stock background (slightly off from bgColor) ---
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // --- J-Card outer shell ---
  const margin = 28 * scale;
  const cardX = margin;
  const cardY = margin;
  const cardW = width - margin * 2;
  const cardH = height - margin * 2;

  // Card body
  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.12;
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 6 * scale);
  ctx.stroke();
  ctx.restore();

  // --- Spine panel (left strip, the part visible on the shelf) ---
  const spineW = 72 * scale;
  const spineX = cardX;
  const spineY = cardY;
  const spineH = cardH;

  // Spine background
  ctx.save();
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.12;
  ctx.fillRect(spineX, spineY, spineW, spineH);
  ctx.restore();

  // Spine border
  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 1 * scale;
  ctx.setLineDash([4 * scale, 4 * scale]);
  ctx.beginPath();
  ctx.moveTo(spineX + spineW, spineY);
  ctx.lineTo(spineX + spineW, spineY + spineH);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Fold mark indicator arrows
  ctx.save();
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.15;
  ctx.font = `400 ${13 * scale}px "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('◂ FOLD', spineX + spineW + 26 * scale, spineY + 14 * scale);
  ctx.fillText('◂ FOLD', spineX + spineW + 26 * scale, spineY + spineH - 8 * scale);
  ctx.restore();

  // Spine text (rotated, reads bottom-to-top like real cassettes)
  ctx.save();
  ctx.translate(spineX + spineW / 2, spineY + spineH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Artist / owner
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.5;
  ctx.font = `600 ${15 * scale}px "Courier New", monospace`;
  ctx.fillText(repoOwner.toUpperCase(), 0, -14 * scale);

  // Title on spine
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.9;
  ctx.font = `700 ${18 * scale}px "Courier New", monospace`;
  let spineName = repoName.toUpperCase();
  const maxSpineTextW = spineH - 80 * scale;
  while (ctx.measureText(spineName).width > maxSpineTextW && spineName.length > 5) {
    spineName = spineName.slice(0, -1);
  }
  ctx.fillText(spineName, 0, 6 * scale);

  // Side indicator
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.35;
  ctx.font = `400 ${13 * scale}px "Courier New", monospace`;
  ctx.fillText('SIDE A', 0, 26 * scale);
  ctx.restore();

  // --- Main front panel ---
  const frontX = spineX + spineW + 16 * scale;
  const frontY = cardY + 20 * scale;
  const frontW = cardW - spineW - 32 * scale;
  const frontH = cardH - 40 * scale;

  // --- Cassette window (the oval/rectangle cutout you see the tape reels through) ---
  const windowW = frontW * 0.55;
  const windowH = 100 * scale;
  const windowX = frontX + (frontW - windowW) / 2;
  const windowY = frontY + frontH - windowH - 30 * scale;

  // Window frame
  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.roundRect(windowX, windowY, windowW, windowH, 40 * scale);
  ctx.stroke();
  ctx.restore();

  // Window fill
  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.roundRect(windowX, windowY, windowW, windowH, 40 * scale);
  ctx.fill();
  ctx.restore();

  // Tape reels (two circles inside the window)
  const reelR = 28 * scale;
  const reelGap = windowW * 0.32;
  const reelCY = windowY + windowH / 2;
  const reel1X = windowX + windowW / 2 - reelGap;
  const reel2X = windowX + windowW / 2 + reelGap;

  [reel1X, reel2X].forEach((rx) => {
    // Outer reel circle
    ctx.save();
    ctx.strokeStyle = primaryColor;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.arc(rx, reelCY, reelR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Hub (inner circle)
    ctx.save();
    ctx.strokeStyle = secondaryColor;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.arc(rx, reelCY, 10 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Hub center dot
    ctx.save();
    ctx.fillStyle = secondaryColor;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(rx, reelCY, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Spokes
    ctx.save();
    ctx.strokeStyle = primaryColor;
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = 1 * scale;
    for (let s = 0; s < 3; s++) {
      const a = (s * Math.PI * 2) / 3 + 0.3;
      ctx.beginPath();
      ctx.moveTo(rx + Math.cos(a) * 10 * scale, reelCY + Math.sin(a) * 10 * scale);
      ctx.lineTo(rx + Math.cos(a) * reelR, reelCY + Math.sin(a) * reelR);
      ctx.stroke();
    }
    ctx.restore();
  });

  // Tape line connecting the two reels
  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.08;
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(reel1X + reelR, reelCY);
  ctx.lineTo(reel2X - reelR, reelCY);
  ctx.stroke();
  ctx.restore();

  // --- "SIDE A" label above window ---
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.2;
  ctx.font = `600 ${14 * scale}px "Courier New", monospace`;
  ctx.fillText('▸ SIDE A  ·  DOLBY NR  ·  CrO\u2082  ·  120\u00B5s', windowX + windowW / 2, windowY - 12 * scale);
  ctx.restore();

  // --- Title block (main content area above the tape window) ---
  const titleBlockY = frontY + 10 * scale;

  // Label / brand stripe at top
  ctx.save();
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.1;
  ctx.fillRect(frontX, titleBlockY, frontW, 34 * scale);
  ctx.restore();

  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.4;
  ctx.font = `700 ${14 * scale}px "Courier New", monospace`;
  ctx.fillText('HIGH FIDELITY  ·  TYPE II', frontX + 12 * scale, titleBlockY + 23 * scale);
  ctx.textAlign = 'right';
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.3;
  ctx.fillText(`C-${language.length * 6 || 90}`, frontX + frontW - 12 * scale, titleBlockY + 23 * scale);
  ctx.restore();

  // Owner as "artist"
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.5;
  ctx.font = `500 ${22 * scale}px "Courier New", monospace`;
  ctx.fillText(repoOwner.toUpperCase(), frontX + 12 * scale, titleBlockY + 62 * scale);
  ctx.restore();

  // Repo name as "album title"
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = secondaryColor;
  ctx.font = `700 ${48 * scale}px "Inter", "Segoe UI", sans-serif`;
  let fontSize = 48;
  const maxTitleW = frontW - 24 * scale;
  while (ctx.measureText(repoName).width > maxTitleW && fontSize > 24) {
    fontSize -= 2;
    ctx.font = `700 ${fontSize * scale}px "Inter", "Segoe UI", sans-serif`;
  }
  ctx.fillText(repoName, frontX + 12 * scale, titleBlockY + 108 * scale);
  ctx.restore();

  // Horizontal rule
  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.1;
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(frontX + 12 * scale, titleBlockY + 122 * scale);
  ctx.lineTo(frontX + frontW - 12 * scale, titleBlockY + 122 * scale);
  ctx.stroke();
  ctx.restore();

  // Track listing style description
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.55;
  ctx.font = `400 ${18 * scale}px "Courier New", monospace`;

  // Split description into "tracks"
  const words = description.split(' ');
  let tracks = [];
  let current = '';
  const maxTrackW = frontW - 90 * scale;
  for (const word of words) {
    const test = current ? current + ' ' + word : word;
    if (ctx.measureText(test).width > maxTrackW && current) {
      tracks.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) tracks.push(current);
  tracks = tracks.slice(0, 4); // max 4 "tracks"

  tracks.forEach((track, i) => {
    const ty = titleBlockY + 148 * scale + i * 30 * scale;
    // Track number
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = secondaryColor;
    ctx.fillText(`${String(i + 1).padStart(2, '0')}.`, frontX + 12 * scale, ty);
    // Track text
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = primaryColor;
    ctx.fillText(track, frontX + 52 * scale, ty);
  });
  ctx.restore();

  // --- Stats as "runtime" info near the window ---
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.35;
  ctx.font = `400 ${15 * scale}px "Courier New", monospace`;
  const statsY = windowY + windowH + 20 * scale;

  const statParts = [`◈ ${language}`];
  if (stars) statParts.push(`★ ${stars}`);
  if (forks) statParts.push(`⑂ ${forks}`);
  ctx.fillText(statParts.join('   ·   '), frontX + 12 * scale, statsY);

  // Right-aligned support URL as "label/publisher"
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = secondaryColor;
    ctx.globalAlpha = 0.25;
    ctx.fillText(`℗ ${supportUrl}`, frontX + frontW - 12 * scale, statsY);
  }
  ctx.restore();

  // --- Perforated edge marks (top & bottom of card, simulating tear lines) ---
  if (showPattern) {
    ctx.save();
    ctx.fillStyle = primaryColor;
    ctx.globalAlpha = 0.06;
    for (let x = cardX + spineW + 20 * scale; x < cardX + cardW - 10 * scale; x += 12 * scale) {
      ctx.fillRect(x, cardY, 2 * scale, 6 * scale);
      ctx.fillRect(x, cardY + cardH - 6 * scale, 2 * scale, 6 * scale);
    }
    ctx.restore();

    // Subtle paper texture noise
    ctx.save();
    ctx.globalAlpha = 0.012;
    ctx.fillStyle = primaryColor;
    for (let i = 0; i < 600; i++) {
      const h = (i * 4967 + 17);
      const nx = (h % 1280) / 1280 * width;
      const ny = ((h * 7213) % 640) / 640 * height;
      ctx.fillRect(nx, ny, 1 * scale, 1 * scale);
    }
    ctx.restore();
  }

  // --- Corner crop marks (print registration) ---
  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.08;
  ctx.lineWidth = 1 * scale;
  const cm = 14 * scale;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(cardX - 6 * scale, cardY); ctx.lineTo(cardX - 6 * scale - cm, cardY);
  ctx.moveTo(cardX, cardY - 6 * scale); ctx.lineTo(cardX, cardY - 6 * scale - cm);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(cardX + cardW + 6 * scale, cardY); ctx.lineTo(cardX + cardW + 6 * scale + cm, cardY);
  ctx.moveTo(cardX + cardW, cardY - 6 * scale); ctx.lineTo(cardX + cardW, cardY - 6 * scale - cm);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(cardX - 6 * scale, cardY + cardH); ctx.lineTo(cardX - 6 * scale - cm, cardY + cardH);
  ctx.moveTo(cardX, cardY + cardH + 6 * scale); ctx.lineTo(cardX, cardY + cardH + 6 * scale + cm);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(cardX + cardW + 6 * scale, cardY + cardH); ctx.lineTo(cardX + cardW + 6 * scale + cm, cardY + cardH);
  ctx.moveTo(cardX + cardW, cardY + cardH + 6 * scale); ctx.lineTo(cardX + cardW, cardY + cardH + 6 * scale + cm);
  ctx.stroke();
  ctx.restore();
};
