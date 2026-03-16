export const sonarPing = (ctx, width, height, scale, data) => {
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

  // --- CRT background (uses bgColor) ---
  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // --- Vignette (radial darkening at edges) ---
  ctx.save();
  const vigGrad = ctx.createRadialGradient(
    width / 2, height / 2, height * 0.2,
    width / 2, height / 2, height * 0.75,
  );
  vigGrad.addColorStop(0, 'transparent');
  vigGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  const cx = width / 2;
  const cy = height / 2;
  const maxR = height * 0.42;

  // --- Concentric range rings ---
  const ringCount = 6;
  for (let i = 1; i <= ringCount; i++) {
    const r = (i / ringCount) * maxR;
    ctx.save();
    ctx.strokeStyle = primaryColor;
    ctx.globalAlpha = i === ringCount ? 0.25 : 0.08;
    ctx.lineWidth = i === ringCount ? 2 * scale : 1 * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Range labels on right side
    ctx.save();
    ctx.fillStyle = primaryColor;
    ctx.globalAlpha = 0.2;
    ctx.font = `400 ${10 * scale}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(`${i * 100}`, cx + r + 6 * scale, cy + 4 * scale);
    ctx.restore();
  }

  // --- Bearing lines (radial, every 30 degrees) ---
  for (let deg = 0; deg < 360; deg += 30) {
    const rad = (deg * Math.PI) / 180;
    const isMajor = deg % 90 === 0;

    ctx.save();
    ctx.strokeStyle = primaryColor;
    ctx.globalAlpha = isMajor ? 0.15 : 0.04;
    ctx.lineWidth = 1 * scale;

    if (!isMajor) {
      ctx.setLineDash([2 * scale, 6 * scale]);
    }

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(rad) * maxR, cy + Math.sin(rad) * maxR);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Bearing labels around perimeter
    if (isMajor) {
      const labelR = maxR + 18 * scale;
      const lx = cx + Math.cos(rad) * labelR;
      const ly = cy + Math.sin(rad) * labelR;
      ctx.save();
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.3;
      ctx.font = `600 ${12 * scale}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${deg}°`, lx, ly);
      ctx.restore();
    }
  }

  // --- Tick marks around outer ring (every 10 degrees) ---
  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.12;
  ctx.lineWidth = 1 * scale;
  for (let deg = 0; deg < 360; deg += 10) {
    if (deg % 30 === 0) continue;
    const rad = (deg * Math.PI) / 180;
    const inner = maxR - 6 * scale;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(rad) * inner, cy + Math.sin(rad) * inner);
    ctx.lineTo(cx + Math.cos(rad) * maxR, cy + Math.sin(rad) * maxR);
    ctx.stroke();
  }
  ctx.restore();

  // --- Sweep line (phosphor glow wedge) ---
  ctx.save();
  const sweepAngle = -0.4; // radians, pointing upper-left-ish
  const sweepSpread = 0.35;

  // Sweep trail (fading wedge)
  const sweepGrad = ctx.createConicGradient(sweepAngle - sweepSpread, cx, cy);
  sweepGrad.addColorStop(0, 'transparent');
  sweepGrad.addColorStop(0.08, primaryColor);
  sweepGrad.addColorStop(0.12, 'transparent');

  ctx.globalAlpha = 0.12;
  ctx.fillStyle = sweepGrad;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, maxR, sweepAngle - sweepSpread, sweepAngle + 0.02);
  ctx.closePath();
  ctx.fill();

  // Bright sweep edge
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(
    cx + Math.cos(sweepAngle) * maxR,
    cy + Math.sin(sweepAngle) * maxR,
  );
  ctx.stroke();
  ctx.restore();

  // --- Center dot (origin) ---
  ctx.save();
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.arc(cx, cy, 4 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.arc(cx, cy, 10 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- Noise/static texture (showPattern) ---
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.015;
    ctx.fillStyle = primaryColor;
    for (let i = 0; i < 500; i++) {
      const h = (i * 7919 + 31);
      const nx = (h % 1280) / 1280 * width;
      const ny = ((h * 6271) % 640) / 640 * height;
      const dist = Math.hypot(nx - cx, ny - cy);
      if (dist < maxR) {
        ctx.globalAlpha = 0.02 + Math.random() * 0.02;
        ctx.fillRect(nx, ny, 2 * scale, 2 * scale);
      }
    }
    ctx.restore();
  }

  // --- Data blips on the radar ---
  const drawBlip = (angle, distance, size, color, label, value) => {
    const rad = (angle * Math.PI) / 180;
    const r = (distance / 600) * maxR;
    const bx = cx + Math.cos(rad) * r;
    const by = cy + Math.sin(rad) * r;

    // Glow
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(bx, by, size * 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Blip dot
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(bx, by, size * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Pulsing ring
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.arc(bx, by, size * 2.5 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Label
    if (label) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.6;
      ctx.font = `600 ${11 * scale}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'left';
      ctx.fillText(label, bx + size * 3 * scale, by - 6 * scale);
      if (value) {
        ctx.globalAlpha = 0.35;
        ctx.font = `400 ${10 * scale}px "JetBrains Mono", monospace`;
        ctx.fillText(value, bx + size * 3 * scale, by + 8 * scale);
      }
      ctx.restore();
    }
  };

  // Stars blip (upper-left quadrant)
  if (stars) drawBlip(225, 320, 6, primaryColor, `★ ${stars}`, 'STARGAZERS');
  // Forks blip (lower-right quadrant)
  if (forks) drawBlip(45, 400, 5, secondaryColor, `⑂ ${forks}`, 'FORKS');
  // Language blip (right)
  drawBlip(350, 250, 4, primaryColor, language, 'CLASSIFICATION');
  // Small noise blips for atmosphere
  drawBlip(120, 480, 2, primaryColor, null, null);
  drawBlip(170, 350, 1.5, primaryColor, null, null);
  drawBlip(280, 520, 1.5, secondaryColor, null, null);
  drawBlip(70, 200, 1, primaryColor, null, null);
  drawBlip(310, 440, 1, primaryColor, null, null);

  // --- Repo name at center (below origin) ---
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = secondaryColor;
  ctx.font = `800 ${42 * scale}px "Inter", sans-serif`;
  let fontSize = 42;
  const maxNameW = maxR * 1.4;
  while (ctx.measureText(repoName).width > maxNameW && fontSize > 24) {
    fontSize -= 2;
    ctx.font = `800 ${fontSize * scale}px "Inter", sans-serif`;
  }
  ctx.fillText(repoName, cx, cy + 50 * scale);

  // Owner above
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.5;
  ctx.font = `500 ${14 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(`${repoOwner} //`, cx, cy + 22 * scale);
  ctx.restore();

  // --- HUD readouts in corners ---

  // Top-left: status block
  const hudPad = 30 * scale;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.35;
  ctx.font = `500 ${11 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('SONAR ACTIVE', hudPad, hudPad + 14 * scale);
  ctx.fillText(`SIG: ${repoName.toUpperCase()}`, hudPad, hudPad + 30 * scale);
  ctx.fillText(`RANGE: 600m`, hudPad, hudPad + 46 * scale);
  ctx.fillStyle = showPattern ? primaryColor : 'rgba(255,255,255,0.15)';
  ctx.fillText(showPattern ? '● NOISE FILTER: ON' : '○ NOISE FILTER: OFF', hudPad, hudPad + 62 * scale);
  ctx.restore();

  // Top-right: spectrum colors
  ctx.save();
  ctx.textAlign = 'right';
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.3;
  ctx.font = `500 ${11 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('SIGNAL SPECTRUM', width - hudPad, hudPad + 14 * scale);

  // Color bars
  const barW = 60 * scale;
  const barH = 8 * scale;
  const barX = width - hudPad - barW;
  [
    { color: bgColor, label: 'BASE' },
    { color: primaryColor, label: 'PRI' },
    { color: secondaryColor, label: 'SEC' },
  ].forEach(({ color, label }, i) => {
    const by = hudPad + 24 * scale + i * 18 * scale;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.7;
    ctx.fillRect(barX, by, barW, barH);
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = primaryColor;
    ctx.font = `400 ${9 * scale}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(label, barX - 8 * scale, by + 7 * scale);
  });
  ctx.restore();

  // Bottom-left: description
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.2;
  ctx.font = `500 ${10 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('// INTERCEPT LOG', hudPad, height - hudPad - 52 * scale);

  ctx.globalAlpha = 0.4;
  ctx.fillStyle = secondaryColor;
  ctx.font = `300 ${15 * scale}px "Inter", sans-serif`;
  // Truncate description to fit in corner
  const maxDescW = width * 0.38;
  let desc = description;
  while (ctx.measureText(desc).width > maxDescW && desc.length > 10) {
    desc = desc.slice(0, -4) + '...';
  }
  ctx.fillText(desc, hudPad, height - hudPad - 32 * scale);

  // Second line if description was long
  if (description.length > desc.length) {
    let desc2 = description.slice(desc.length - 3);
    while (ctx.measureText(desc2).width > maxDescW && desc2.length > 10) {
      desc2 = desc2.slice(0, -4) + '...';
    }
    ctx.fillText(desc2, hudPad, height - hudPad - 14 * scale);
  }
  ctx.restore();

  // Bottom-right: support URL + timestamp feel
  if (supportUrl) {
    ctx.save();
    ctx.textAlign = 'right';
    ctx.fillStyle = primaryColor;
    ctx.globalAlpha = 0.2;
    ctx.font = `400 ${11 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText(`NET: ${supportUrl}`, width - hudPad, height - hudPad - 14 * scale);
    ctx.restore();
  }

  // --- Scanline overlay for CRT feel ---
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = '#000000';
  for (let y = 0; y < height; y += 4 * scale) {
    ctx.fillRect(0, y, width, 2 * scale);
  }
  ctx.restore();
};
