import { wrapText } from '../utils';

const roundRectPath = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

export const aeroGlass = (ctx, width, height, scale, data) => {
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

  // --- Vista/7 desktop wallpaper background ---
  const wallGrad = ctx.createLinearGradient(0, 0, width, height);
  wallGrad.addColorStop(0, bgColor);
  wallGrad.addColorStop(0.5, primaryColor);
  wallGrad.addColorStop(1, bgColor);
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, width, height);

  // Aurora / light streaks (Vista signature look)
  ctx.save();
  ctx.filter = 'blur(80px)';
  ctx.globalAlpha = 0.3;

  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.ellipse(width * 0.3, height * 0.5, 500 * scale, 120 * scale, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.ellipse(width * 0.7, height * 0.4, 400 * scale, 100 * scale, 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.06;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.3, 600 * scale, 80 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Subtle pattern overlay
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.02;
    ctx.fillStyle = '#ffffff';
    for (let x = 0; x < width; x += 3 * scale) {
      for (let y = 0; y < height; y += 3 * scale) {
        if ((x + y) % (6 * scale) === 0) {
          ctx.fillRect(x, y, 1 * scale, 1 * scale);
        }
      }
    }
    ctx.restore();
  }

  // --- Main Aero glass window ---
  const winW = width * 0.6;
  const winH = height * 0.74;
  const winX = (width - winW) / 2;
  const winY = (height - winH) / 2 + 8 * scale;
  const winR = 8 * scale;

  // Window drop shadow (Aero has a strong colored shadow)
  ctx.save();
  ctx.filter = 'blur(30px)';
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  roundRectPath(ctx, winX + 2 * scale, winY + 6 * scale, winW, winH, winR);
  ctx.fill();
  ctx.restore();

  // --- Title bar (Aero glass — translucent colored band) ---
  const tbH = 38 * scale;

  // Title bar glass fill
  ctx.save();
  const tbGrad = ctx.createLinearGradient(0, winY, 0, winY + tbH);
  tbGrad.addColorStop(0, 'rgba(180,210,240,0.45)');
  tbGrad.addColorStop(0.4, 'rgba(140,180,220,0.3)');
  tbGrad.addColorStop(0.5, 'rgba(100,150,200,0.2)');
  tbGrad.addColorStop(1, 'rgba(120,170,220,0.25)');
  ctx.fillStyle = tbGrad;
  roundRectPath(ctx, winX, winY, winW, tbH, [winR, winR, 0, 0]);
  ctx.fill();

  // Title bar top highlight (bright white line)
  const tbHighlight = ctx.createLinearGradient(0, winY, 0, winY + 2 * scale);
  tbHighlight.addColorStop(0, 'rgba(255,255,255,0.6)');
  tbHighlight.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = tbHighlight;
  roundRectPath(ctx, winX, winY, winW, 3 * scale, [winR, winR, 0, 0]);
  ctx.fill();
  ctx.restore();

  // Title bar border
  ctx.save();
  ctx.strokeStyle = 'rgba(100,150,200,0.4)';
  ctx.lineWidth = 1 * scale;
  roundRectPath(ctx, winX, winY, winW, tbH, [winR, winR, 0, 0]);
  ctx.stroke();
  ctx.restore();

  // Window title text (with shadow, Vista style)
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  // Text shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.font = `400 ${13 * scale}px "Segoe UI", "Inter", sans-serif`;
  ctx.fillText(`${repoOwner}/${repoName}`, winX + 14 * scale + 1, winY + tbH / 2 + 1);
  // Text
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${repoOwner}/${repoName}`, winX + 14 * scale, winY + tbH / 2);
  ctx.restore();

  // --- Window control buttons (minimize, maximize, close) ---
  const btnW = 28 * scale;
  const btnH = 20 * scale;
  const btnY = winY + (tbH - btnH) / 2;
  const btnGap = 2 * scale;

  // Close button (red)
  const closeX = winX + winW - btnW - 6 * scale;
  ctx.save();
  const closeGrad = ctx.createLinearGradient(0, btnY, 0, btnY + btnH);
  closeGrad.addColorStop(0, '#e5817b');
  closeGrad.addColorStop(0.5, '#d44940');
  closeGrad.addColorStop(1, '#b83a33');
  ctx.fillStyle = closeGrad;
  roundRectPath(ctx, closeX, btnY, btnW, btnH, 3 * scale);
  ctx.fill();
  // X symbol
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5 * scale;
  const xPad = 9 * scale;
  ctx.beginPath();
  ctx.moveTo(closeX + xPad, btnY + 6 * scale);
  ctx.lineTo(closeX + btnW - xPad, btnY + btnH - 6 * scale);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(closeX + btnW - xPad, btnY + 6 * scale);
  ctx.lineTo(closeX + xPad, btnY + btnH - 6 * scale);
  ctx.stroke();
  ctx.restore();

  // Maximize button
  const maxX = closeX - btnW - btnGap;
  ctx.save();
  const maxGrad = ctx.createLinearGradient(0, btnY, 0, btnY + btnH);
  maxGrad.addColorStop(0, 'rgba(200,220,240,0.5)');
  maxGrad.addColorStop(1, 'rgba(160,190,220,0.4)');
  ctx.fillStyle = maxGrad;
  roundRectPath(ctx, maxX, btnY, btnW, btnH, 3 * scale);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 1 * scale;
  ctx.strokeRect(maxX + 9 * scale, btnY + 6 * scale, btnW - 18 * scale, btnH - 12 * scale);
  ctx.restore();

  // Minimize button
  const minX = maxX - btnW - btnGap;
  ctx.save();
  ctx.fillStyle = maxGrad;
  roundRectPath(ctx, minX, btnY, btnW, btnH, 3 * scale);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(minX + 9 * scale, btnY + btnH - 7 * scale);
  ctx.lineTo(minX + btnW - 9 * scale, btnY + btnH - 7 * scale);
  ctx.stroke();
  ctx.restore();

  // --- Window body (white-ish content area) ---
  const bodyY = winY + tbH;
  const bodyH = winH - tbH;

  ctx.save();
  ctx.fillStyle = 'rgba(240,243,248,0.92)';
  roundRectPath(ctx, winX, bodyY, winW, bodyH, [0, 0, winR, winR]);
  ctx.fill();
  ctx.restore();

  // Window outer border
  ctx.save();
  ctx.strokeStyle = 'rgba(100,150,200,0.35)';
  ctx.lineWidth = 1.5 * scale;
  roundRectPath(ctx, winX, winY, winW, winH, winR);
  ctx.stroke();
  ctx.restore();

  // --- Content inside the window body ---
  const cPad = 30 * scale;
  const cX = winX + cPad;
  const cY = bodyY + cPad;
  const cW = winW - cPad * 2;

  // Owner path
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#6688aa';
  ctx.font = `400 ${14 * scale}px "Segoe UI", "Inter", sans-serif`;
  ctx.fillText(`> ${repoOwner}`, cX, cY);
  ctx.restore();

  // Repo name
  ctx.save();
  ctx.fillStyle = '#1a1a2e';
  ctx.font = `700 ${46 * scale}px "Segoe UI", "Inter", sans-serif`;
  let fontSize = 46;
  while (ctx.measureText(repoName).width > cW && fontSize > 24) {
    fontSize -= 2;
    ctx.font = `700 ${fontSize * scale}px "Segoe UI", "Inter", sans-serif`;
  }
  ctx.fillText(repoName, cX, cY + 50 * scale);
  ctx.restore();

  // Separator line (Vista style blue gradient)
  ctx.save();
  const sepGrad = ctx.createLinearGradient(cX, 0, cX + cW * 0.6, 0);
  sepGrad.addColorStop(0, primaryColor);
  sepGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = sepGrad;
  ctx.globalAlpha = 0.4;
  ctx.fillRect(cX, cY + 62 * scale, cW, 2 * scale);
  ctx.restore();

  // Description
  ctx.save();
  ctx.fillStyle = '#444466';
  ctx.font = `400 ${17 * scale}px "Segoe UI", "Inter", sans-serif`;
  wrapText(ctx, description, cX, cY + 90 * scale, cW, 26 * scale);
  ctx.restore();

  // --- Info area (Aero-style grouped box) ---
  const infoY = cY + 195 * scale;
  const infoW = cW;
  const infoH = 80 * scale;

  // Group box
  ctx.save();
  ctx.strokeStyle = 'rgba(100,150,200,0.25)';
  ctx.lineWidth = 1 * scale;
  roundRectPath(ctx, cX, infoY, infoW, infoH, 4 * scale);
  ctx.stroke();
  ctx.restore();

  // Group label background (to break the border line)
  ctx.save();
  ctx.fillStyle = 'rgba(240,243,248,1)';
  ctx.fillRect(cX + 8 * scale, infoY - 8 * scale, 80 * scale, 16 * scale);
  ctx.fillStyle = '#6688aa';
  ctx.font = `400 ${11 * scale}px "Segoe UI", "Inter", sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText('Details', cX + 12 * scale, infoY + 4 * scale);
  ctx.restore();

  // Info content
  const infoInnerX = cX + 16 * scale;
  let infoRowY = infoY + 28 * scale;

  // Language row
  ctx.save();
  ctx.fillStyle = '#888899';
  ctx.font = `400 ${13 * scale}px "Segoe UI", "Inter", sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText('Language:', infoInnerX, infoRowY);

  // Language colored dot + value
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(infoInnerX + 75 * scale, infoRowY - 4 * scale, 5 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a1a2e';
  ctx.font = `600 ${13 * scale}px "Segoe UI", "Inter", sans-serif`;
  ctx.fillText(language, infoInnerX + 86 * scale, infoRowY);
  ctx.restore();

  // Stars
  if (stars) {
    ctx.save();
    ctx.fillStyle = '#888899';
    ctx.font = `400 ${13 * scale}px "Segoe UI", "Inter", sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('Stars:', infoInnerX + 200 * scale, infoRowY);
    ctx.fillStyle = '#1a1a2e';
    ctx.font = `600 ${13 * scale}px "Segoe UI", "Inter", sans-serif`;
    ctx.fillText(`★ ${stars}`, infoInnerX + 245 * scale, infoRowY);
    ctx.restore();
  }

  // Forks
  if (forks) {
    ctx.save();
    ctx.fillStyle = '#888899';
    ctx.font = `400 ${13 * scale}px "Segoe UI", "Inter", sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('Forks:', infoInnerX + 340 * scale, infoRowY);
    ctx.fillStyle = '#1a1a2e';
    ctx.font = `600 ${13 * scale}px "Segoe UI", "Inter", sans-serif`;
    ctx.fillText(`⑂ ${forks}`, infoInnerX + 385 * scale, infoRowY);
    ctx.restore();
  }

  // Second row — colors
  infoRowY += 26 * scale;
  ctx.save();
  ctx.fillStyle = '#888899';
  ctx.font = `400 ${13 * scale}px "Segoe UI", "Inter", sans-serif`;
  ctx.fillText('Theme:', infoInnerX, infoRowY);

  const swS = 14 * scale;
  [bgColor, primaryColor, secondaryColor].forEach((color, i) => {
    const sx = infoInnerX + 75 * scale + i * (swS + 6 * scale);
    ctx.fillStyle = color;
    roundRectPath(ctx, sx, infoRowY - 11 * scale, swS, swS, 2 * scale);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1 * scale;
    roundRectPath(ctx, sx, infoRowY - 11 * scale, swS, swS, 2 * scale);
    ctx.stroke();
  });

  // Grid status
  ctx.fillStyle = showPattern ? '#4488aa' : '#aaaaaa';
  ctx.font = `400 ${11 * scale}px "Segoe UI", "Inter", sans-serif`;
  ctx.fillText(
    showPattern ? '✓ Pattern overlay' : '✗ Pattern overlay',
    infoInnerX + 75 * scale + 3 * (swS + 6 * scale) + 10 * scale,
    infoRowY,
  );
  ctx.restore();

  // --- Support URL (bottom of window, like a status bar) ---
  const statusBarH = 26 * scale;
  const statusBarY = winY + winH - statusBarH;

  ctx.save();
  // Status bar bg (slightly darker)
  ctx.fillStyle = 'rgba(220,225,235,0.95)';
  roundRectPath(ctx, winX, statusBarY, winW, statusBarH, [0, 0, winR, winR]);
  ctx.fill();
  // Top border
  ctx.fillStyle = 'rgba(160,180,200,0.3)';
  ctx.fillRect(winX, statusBarY, winW, 1 * scale);
  ctx.restore();

  if (supportUrl) {
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#8899aa';
    ctx.font = `400 ${11 * scale}px "Segoe UI", "Inter", sans-serif`;
    ctx.fillText(`🔗 ${supportUrl}`, winX + 12 * scale, statusBarY + statusBarH / 2);
    ctx.restore();
  }

  // --- Taskbar at bottom ---
  const taskbarH = 44 * scale;
  const taskbarY = height - taskbarH;

  // Taskbar glass
  ctx.save();
  const taskGrad = ctx.createLinearGradient(0, taskbarY, 0, height);
  taskGrad.addColorStop(0, 'rgba(40,60,90,0.7)');
  taskGrad.addColorStop(0.3, 'rgba(60,90,130,0.6)');
  taskGrad.addColorStop(0.5, 'rgba(80,120,170,0.5)');
  taskGrad.addColorStop(1, 'rgba(30,50,80,0.8)');
  ctx.fillStyle = taskGrad;
  ctx.fillRect(0, taskbarY, width, taskbarH);

  // Taskbar top highlight
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(0, taskbarY, width, 1.5 * scale);
  ctx.restore();

  // Start orb (Vista/7 signature)
  const orbR = 24 * scale;
  const orbX = 36 * scale;
  const orbY = taskbarY + taskbarH / 2;

  ctx.save();
  // Orb glow
  ctx.filter = 'blur(8px)';
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(orbX, orbY, orbR + 4 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Orb gradient
  ctx.save();
  const orbGrad = ctx.createRadialGradient(orbX, orbY - 6 * scale, 2, orbX, orbY, orbR);
  orbGrad.addColorStop(0, '#8ec8f8');
  orbGrad.addColorStop(0.4, '#4a9ee5');
  orbGrad.addColorStop(0.8, '#2266aa');
  orbGrad.addColorStop(1, '#1a4477');
  ctx.fillStyle = orbGrad;
  ctx.beginPath();
  ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
  ctx.fill();

  // Orb top shine
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.ellipse(orbX, orbY - 8 * scale, orbR * 0.7, orbR * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Orb border
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
  ctx.stroke();

  // Windows flag icon (simplified 4-square)
  const flagS = 7 * scale;
  const flagGap = 2 * scale;
  const flagX = orbX - flagS - flagGap / 2;
  const flagY = orbY - flagS - flagGap / 2;
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.9;
  // Perspective tilt with 4 colored squares
  const flagColors = ['#f65314', '#7cbb00', '#00a1f1', '#ffbb00'];
  [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([col, row], idx) => {
    ctx.fillStyle = flagColors[idx];
    ctx.fillRect(
      flagX + col * (flagS + flagGap),
      flagY + row * (flagS + flagGap),
      flagS,
      flagS,
    );
  });
  ctx.restore();

  // Taskbar pinned item (active window indicator)
  ctx.save();
  const pinX = orbX + orbR + 20 * scale;
  const pinW = 180 * scale;
  const pinH = 32 * scale;
  const pinY = taskbarY + (taskbarH - pinH) / 2;

  // Active window highlight
  const pinGrad = ctx.createLinearGradient(0, pinY, 0, pinY + pinH);
  pinGrad.addColorStop(0, 'rgba(180,210,255,0.25)');
  pinGrad.addColorStop(0.5, 'rgba(140,180,230,0.15)');
  pinGrad.addColorStop(1, 'rgba(100,150,200,0.2)');
  ctx.fillStyle = pinGrad;
  roundRectPath(ctx, pinX, pinY, pinW, pinH, 4 * scale);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1 * scale;
  roundRectPath(ctx, pinX, pinY, pinW, pinH, 4 * scale);
  ctx.stroke();

  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = `400 ${12 * scale}px "Segoe UI", "Inter", sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(repoName, pinX + 10 * scale, pinY + pinH / 2);
  ctx.restore();

  // System tray (right side of taskbar)
  ctx.save();
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = `400 ${11 * scale}px "Segoe UI", "Inter", sans-serif`;
  ctx.fillText('▲  🔊  📶', width - 80 * scale, orbY);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `400 ${12 * scale}px "Segoe UI", "Inter", sans-serif`;
  // Fake clock
  ctx.fillText('11:47 PM', width - 16 * scale, orbY - 6 * scale);
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = `400 ${10 * scale}px "Segoe UI", "Inter", sans-serif`;
  ctx.fillText('3/16/2026', width - 16 * scale, orbY + 8 * scale);
  ctx.restore();
};
