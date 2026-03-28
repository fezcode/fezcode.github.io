export const missionControl = (ctx, width, height, scale, data) => {
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

  // ===== BACKGROUND =====
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Star field
  if (showPattern) {
    ctx.save();
    for (let i = 0; i < 150; i++) {
      const sx = ((i * 197 + 43) % 1280) * (width / 1280);
      const sy = ((i * 113 + 71) % 640) * (height / 640);
      const sr = (0.5 + (i % 3) * 0.5) * scale;
      ctx.globalAlpha = 0.15 + (i % 5) * 0.08;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Faint grid overlay
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 0.5 * scale;
    for (let x = 0; x < width; x += 30 * scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30 * scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ===== HELPER: Draw panel with HUD brackets =====
  const drawPanel = (px, py, pw, ph, title, borderColor) => {
    // Panel background
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(px, py, pw, ph);

    // Border
    ctx.strokeStyle = borderColor || primaryColor;
    ctx.lineWidth = 1.5 * scale;
    ctx.globalAlpha = 0.5;
    ctx.strokeRect(px, py, pw, ph);
    ctx.globalAlpha = 1;

    // Corner brackets
    const bLen = 12 * scale;
    const bw = 2 * scale;
    ctx.fillStyle = borderColor || primaryColor;
    ctx.globalAlpha = 0.8;
    // Top-left
    ctx.fillRect(px, py, bLen, bw);
    ctx.fillRect(px, py, bw, bLen);
    // Top-right
    ctx.fillRect(px + pw - bLen, py, bLen, bw);
    ctx.fillRect(px + pw - bw, py, bw, bLen);
    // Bottom-left
    ctx.fillRect(px, py + ph - bw, bLen, bw);
    ctx.fillRect(px, py + ph - bLen, bw, bLen);
    // Bottom-right
    ctx.fillRect(px + pw - bLen, py + ph - bw, bLen, bw);
    ctx.fillRect(px + pw - bw, py + ph - bLen, bw, bLen);
    ctx.globalAlpha = 1;

    // Title bar
    if (title) {
      ctx.fillStyle = borderColor || primaryColor;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(px, py, pw, 22 * scale);
      ctx.globalAlpha = 1;
      ctx.fillStyle = borderColor || primaryColor;
      ctx.font = `bold ${10 * scale}px "JetBrains Mono"`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(title, px + 8 * scale, py + 6 * scale);
    }
  };

  // ===== HELPER: Status dot =====
  const drawStatusDot = (dx, dy, color, label) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(dx, dy, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    // Glow
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(dx, dy, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    if (label) {
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = `${9 * scale}px "JetBrains Mono"`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, dx + 10 * scale, dy);
    }
  };

  // ===== TOP STATUS BAR =====
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, width, 28 * scale);
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 28 * scale, width, 1 * scale);

  // Mission name
  ctx.fillStyle = primaryColor;
  ctx.font = `bold ${11 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`MISSION: ${repoName.toUpperCase()}`, 14 * scale, 14 * scale);

  // Status indicators in top bar
  drawStatusDot(width * 0.4, 14 * scale, '#4caf50', 'SYS NOMINAL');
  drawStatusDot(width * 0.55, 14 * scale, '#4caf50', 'TELEMETRY OK');
  drawStatusDot(width * 0.7, 14 * scale, '#ffd54f', 'TRACKING');

  // Clock
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = `${10 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('MET 00:42:17:03', width - 14 * scale, 14 * scale);

  // ===== PANEL 1: MAIN DISPLAY — Orbital trajectory (top-left) =====
  const p1x = 12 * scale;
  const p1y = 38 * scale;
  const p1w = width * 0.48;
  const p1h = height * 0.52;
  drawPanel(p1x, p1y, p1w, p1h, 'ORBITAL TRAJECTORY — PRIMARY DISPLAY', primaryColor);

  // Earth (small circle)
  const earthX = p1x + p1w * 0.35;
  const earthY = p1y + p1h * 0.55;
  const earthR = 40 * scale;

  ctx.save();
  ctx.fillStyle = '#1a3a5c';
  ctx.beginPath();
  ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
  ctx.fill();
  // Atmosphere glow
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.arc(earthX, earthY, earthR + 4 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 0.1;
  ctx.beginPath();
  ctx.arc(earthX, earthY, earthR + 10 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Continent hint
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#2d6a4f';
  ctx.beginPath();
  ctx.arc(earthX - 10 * scale, earthY - 8 * scale, 15 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(earthX + 12 * scale, earthY + 5 * scale, 10 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Orbital ellipse
  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 1.5 * scale;
  ctx.setLineDash([6 * scale, 4 * scale]);
  ctx.beginPath();
  ctx.ellipse(earthX, earthY, p1w * 0.38, p1h * 0.3, -0.3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Satellite on orbit
  const satAngle = -0.8;
  const satX = earthX + Math.cos(satAngle) * p1w * 0.38;
  const satY = earthY + Math.sin(satAngle) * p1h * 0.3;
  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.arc(satX, satY, 5 * scale, 0, Math.PI * 2);
  ctx.fill();
  // Satellite glow
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.arc(satX, satY, 10 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Satellite label
  ctx.fillStyle = secondaryColor;
  ctx.font = `bold ${9 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`SAT-${repoName.substring(0, 4).toUpperCase()}`, satX + 12 * scale, satY - 4 * scale);

  // Orbit data readout
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `${9 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const orbitDataX = p1x + 10 * scale;
  const orbitDataY = p1y + p1h - 55 * scale;
  ctx.fillText(`ALT: 408.2 km`, orbitDataX, orbitDataY);
  ctx.fillText(`VEL: 7.66 km/s`, orbitDataX, orbitDataY + 12 * scale);
  ctx.fillText(`INC: 51.6°`, orbitDataX, orbitDataY + 24 * scale);
  ctx.fillText(`PER: 92.4 min`, orbitDataX, orbitDataY + 36 * scale);

  // Crosshair on panel center
  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.1;
  ctx.lineWidth = 0.5 * scale;
  ctx.beginPath();
  ctx.moveTo(p1x, earthY);
  ctx.lineTo(p1x + p1w, earthY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(earthX, p1y);
  ctx.lineTo(earthX, p1y + p1h);
  ctx.stroke();
  ctx.restore();

  // ===== PANEL 2: RADAR / TRACKING (top-right) =====
  const p2x = p1x + p1w + 10 * scale;
  const p2y = p1y;
  const p2w = width - p2x - 12 * scale;
  const p2h = p1h * 0.55;
  drawPanel(p2x, p2y, p2w, p2h, 'TRACKING RADAR', secondaryColor);

  const radarCX = p2x + p2w / 2;
  const radarCY = p2y + 22 * scale + (p2h - 22 * scale) / 2;
  const radarR = Math.min(p2w, p2h - 22 * scale) * 0.4;

  // Radar circles
  ctx.save();
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 0.5 * scale;
  for (let i = 1; i <= 3; i++) {
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(radarCX, radarCY, radarR * (i / 3), 0, Math.PI * 2);
    ctx.stroke();
  }

  // Radar cross
  ctx.globalAlpha = 0.1;
  ctx.beginPath();
  ctx.moveTo(radarCX - radarR, radarCY);
  ctx.lineTo(radarCX + radarR, radarCY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(radarCX, radarCY - radarR);
  ctx.lineTo(radarCX, radarCY + radarR);
  ctx.stroke();

  // Sweep wedge
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.moveTo(radarCX, radarCY);
  ctx.arc(radarCX, radarCY, radarR, -0.6, 0.1);
  ctx.closePath();
  ctx.fill();

  // Radar blips
  const blips = [
    { a: 0.8, r: 0.6 }, { a: 2.1, r: 0.4 }, { a: 3.5, r: 0.8 },
    { a: 4.7, r: 0.3 }, { a: 5.9, r: 0.7 },
  ];
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = secondaryColor;
  blips.forEach((b) => {
    ctx.beginPath();
    ctx.arc(
      radarCX + Math.cos(b.a) * radarR * b.r,
      radarCY + Math.sin(b.a) * radarR * b.r,
      2.5 * scale, 0, Math.PI * 2,
    );
    ctx.fill();
  });
  ctx.restore();

  // ===== PANEL 3: TELEMETRY BARS (right, below radar) =====
  const p3x = p2x;
  const p3y = p2y + p2h + 8 * scale;
  const p3w = p2w;
  const p3h = p1h - p2h - 8 * scale;
  drawPanel(p3x, p3y, p3w, p3h, 'TELEMETRY', primaryColor);

  // Bar chart from stats
  const barAreaX = p3x + 12 * scale;
  const barAreaY = p3y + 30 * scale;
  const barAreaW = p3w - 24 * scale;
  const barAreaH = p3h - 42 * scale;
  const barLabels = ['CPU', 'MEM', 'NET', 'I/O', 'PWR', 'THR'];
  const barValues = [0.82, 0.65, 0.91, 0.47, 0.73, 0.58];
  const barW = (barAreaW / barLabels.length) - 6 * scale;

  barLabels.forEach((label, i) => {
    const bx = barAreaX + i * (barW + 6 * scale);
    const bh = barAreaH * barValues[i];
    const by = barAreaY + barAreaH - bh;

    // Bar
    const barGrad = ctx.createLinearGradient(bx, by, bx, barAreaY + barAreaH);
    barGrad.addColorStop(0, primaryColor);
    barGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = barGrad;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(bx, by, barW, bh);
    ctx.globalAlpha = 1;

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = `${7 * scale}px "JetBrains Mono"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(label, bx + barW / 2, barAreaY + barAreaH + 3 * scale);

    // Value
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(`${Math.round(barValues[i] * 100)}%`, bx + barW / 2, by - 10 * scale);
  });

  // ===== PANEL 4: MISSION INFO — Main content (bottom-left) =====
  const p4x = 12 * scale;
  const p4y = p1y + p1h + 10 * scale;
  const p4w = width * 0.48;
  const p4h = height - p4y - 38 * scale;
  drawPanel(p4x, p4y, p4w, p4h, 'MISSION BRIEF', primaryColor);

  // Repo name
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${32 * scale}px "Inter", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  let nameSize = 32 * scale;
  ctx.font = `bold ${nameSize}px "Inter", sans-serif`;
  while (ctx.measureText(repoName).width > p4w - 24 * scale && nameSize > 16 * scale) {
    nameSize -= 2 * scale;
    ctx.font = `bold ${nameSize}px "Inter", sans-serif`;
  }
  ctx.fillText(repoName, p4x + 12 * scale, p4y + 28 * scale);

  // Owner
  ctx.fillStyle = primaryColor;
  ctx.font = `${14 * scale}px "JetBrains Mono"`;
  ctx.fillText(`CMD: ${repoOwner}`, p4x + 12 * scale, p4y + 28 * scale + nameSize + 6 * scale);

  // Description
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = `${13 * scale}px "Inter", sans-serif`;
  const descStartY = p4y + 28 * scale + nameSize + 28 * scale;
  const dWords = description.split(' ');
  let dLine = '';
  let dY = descStartY;
  const dMaxW = p4w - 24 * scale;
  for (let i = 0; i < dWords.length; i++) {
    const test = dLine + dWords[i] + ' ';
    if (ctx.measureText(test).width > dMaxW && i > 0) {
      ctx.fillText(dLine.trim(), p4x + 12 * scale, dY);
      dLine = dWords[i] + ' ';
      dY += 18 * scale;
    } else {
      dLine = test;
    }
  }
  ctx.fillText(dLine.trim(), p4x + 12 * scale, dY);

  // ===== PANEL 5: COMMS / DATA (bottom-right) =====
  const p5x = p4x + p4w + 10 * scale;
  const p5y = p4y;
  const p5w = width - p5x - 12 * scale;
  const p5h = p4h;
  drawPanel(p5x, p5y, p5w, p5h, 'COMMS & DATA', secondaryColor);

  const commsX = p5x + 12 * scale;
  let commsY = p5y + 32 * scale;

  // Signal strength bars
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `${9 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('SIGNAL', commsX, commsY);
  commsY += 14 * scale;

  const sigBars = 8;
  const sigBarW = 8 * scale;
  const sigMaxH = 24 * scale;
  for (let i = 0; i < sigBars; i++) {
    const sh = sigMaxH * ((i + 1) / sigBars);
    const active = i < 6;
    ctx.fillStyle = active ? secondaryColor : 'rgba(255,255,255,0.1)';
    ctx.globalAlpha = active ? 0.7 : 0.3;
    ctx.fillRect(commsX + i * (sigBarW + 3 * scale), commsY + sigMaxH - sh, sigBarW, sh);
  }
  ctx.globalAlpha = 1;
  commsY += sigMaxH + 14 * scale;

  // Data readouts
  const dataRows = [
    { key: 'LANG', val: language.toUpperCase() },
    { key: 'STARS', val: stars ? String(stars) : '—' },
    { key: 'FORKS', val: forks ? String(forks) : '—' },
    { key: 'STATUS', val: 'ACTIVE' },
  ];
  dataRows.forEach((row) => {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `${9 * scale}px "JetBrains Mono"`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(row.key, commsX, commsY);
    ctx.fillStyle = secondaryColor;
    ctx.font = `bold ${12 * scale}px "JetBrains Mono"`;
    ctx.fillText(row.val, commsX + 55 * scale, commsY);
    // Dotted separator
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(commsX, commsY + 16 * scale, p5w - 24 * scale, 1 * scale);
    commsY += 22 * scale;
  });

  // Waveform visualization
  commsY += 4 * scale;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `${9 * scale}px "JetBrains Mono"`;
  ctx.fillText('WAVEFORM', commsX, commsY);
  commsY += 14 * scale;

  ctx.save();
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 1.5 * scale;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  const wfW = p5w - 24 * scale;
  for (let i = 0; i <= wfW; i += 2 * scale) {
    const wfY = commsY + Math.sin(i / (8 * scale) + 1) * 10 * scale * Math.sin(i / (40 * scale));
    if (i === 0) ctx.moveTo(commsX + i, wfY);
    else ctx.lineTo(commsX + i, wfY);
  }
  ctx.stroke();
  ctx.restore();

  // ===== BOTTOM STATUS BAR =====
  const btmBarY = height - 28 * scale;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, btmBarY, width, 28 * scale);
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, btmBarY, width, 1 * scale);

  // Timeline progress bar
  const tlX = 14 * scale;
  const tlY = btmBarY + 10 * scale;
  const tlW = width * 0.4;
  const tlH = 6 * scale;
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(tlX, tlY, tlW, tlH);
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.6;
  ctx.fillRect(tlX, tlY, tlW * 0.68, tlH);
  ctx.globalAlpha = 1;
  // Progress marker
  ctx.fillStyle = '#fff';
  ctx.fillRect(tlX + tlW * 0.68 - 1 * scale, tlY - 2 * scale, 3 * scale, tlH + 4 * scale);

  // Timeline labels
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `${8 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('T+00:00', tlX, btmBarY + 22 * scale);
  ctx.textAlign = 'right';
  ctx.fillText('T+01:30', tlX + tlW, btmBarY + 22 * scale);
  ctx.textAlign = 'center';
  ctx.fillStyle = primaryColor;
  ctx.fillText('T+01:01', tlX + tlW * 0.68, btmBarY + 22 * scale);

  // Support URL
  if (supportUrl) {
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = `${10 * scale}px "JetBrains Mono"`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(supportUrl, width - 14 * scale, btmBarY + 14 * scale);
  }

  // Frequency readout
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = `${9 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'center';
  ctx.fillText('FREQ 2.4GHz  •  BAND S  •  LOCK', width * 0.65, btmBarY + 14 * scale);

  // ===== MISSION PATCH (emblem) — top right corner overlay =====
  const patchX = width - 70 * scale;
  const patchY = 50 * scale;
  const patchR = 28 * scale;

  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(patchX, patchY, patchR + 8 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 1.5 * scale;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(patchX, patchY, patchR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Star inside patch
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.6;
  ctx.font = `${20 * scale}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', patchX, patchY - 2 * scale);
  ctx.globalAlpha = 1;

  // Patch text
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = `bold ${6 * scale}px "JetBrains Mono"`;
  ctx.fillText(repoName.toUpperCase().substring(0, 8), patchX, patchY + patchR - 6 * scale);
};
