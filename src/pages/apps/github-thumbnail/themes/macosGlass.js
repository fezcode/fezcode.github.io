import { wrapText } from '../utils';

// Helper to draw a rounded rect path without filling/stroking
const roundRectPath = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

export const macosGlass = (ctx, width, height, scale, data) => {
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

  // --- Wallpaper background ---
  // Soft gradient mesh inspired by macOS Sequoia wallpaper
  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Large blurred color blobs
  ctx.filter = 'blur(120px)';
  ctx.globalAlpha = 0.5;

  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.ellipse(width * 0.2, height * 0.3, 400 * scale, 300 * scale, 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.ellipse(width * 0.75, height * 0.25, 350 * scale, 250 * scale, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.85, 450 * scale, 200 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.ellipse(width * 0.85, height * 0.7, 300 * scale, 250 * scale, 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // --- Subtle grid pattern (showPattern) ---
  if (showPattern) {
    ctx.save();
    ctx.globalAlpha = 0.03;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1 * scale;
    const gridSize = 50 * scale;
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
    ctx.restore();
  }

  // --- Main glass window ---
  const winW = width * 0.62;
  const winH = height * 0.72;
  const winX = (width - winW) / 2;
  const winY = (height - winH) / 2 + 10 * scale;
  const winR = 16 * scale;

  // Window shadow
  ctx.save();
  ctx.filter = 'blur(40px)';
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  roundRectPath(ctx, winX + 4 * scale, winY + 8 * scale, winW, winH, winR);
  ctx.fill();
  ctx.restore();

  // Glass fill (frosted translucent)
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  roundRectPath(ctx, winX, winY, winW, winH, winR);
  ctx.fill();
  ctx.restore();

  // Glass inner highlight (top edge glow)
  ctx.save();
  const highlightGrad = ctx.createLinearGradient(0, winY, 0, winY + 60 * scale);
  highlightGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
  highlightGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = highlightGrad;
  roundRectPath(ctx, winX, winY, winW, 60 * scale, [winR, winR, 0, 0]);
  ctx.fill();
  ctx.restore();

  // Glass border
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1.5 * scale;
  roundRectPath(ctx, winX, winY, winW, winH, winR);
  ctx.stroke();
  ctx.restore();

  // --- Title bar ---
  const titleBarH = 52 * scale;
  const tbY = winY;

  // Title bar separator
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(winX, tbY + titleBarH, winW, 1 * scale);
  ctx.restore();

  // Traffic lights
  const tlY = tbY + titleBarH / 2;
  const tlStartX = winX + 22 * scale;
  const tlR = 7 * scale;
  const tlGap = 22 * scale;

  const trafficColors = ['#ff5f57', '#febc2e', '#28c840'];
  trafficColors.forEach((color, i) => {
    const tx = tlStartX + i * tlGap;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(tx, tlY, tlR, 0, Math.PI * 2);
    ctx.fill();

    // Subtle inner shadow
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.arc(tx, tlY + 1 * scale, tlR - 1 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Window title (repo name in title bar)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = `500 ${14 * scale}px -apple-system, "SF Pro Text", "Inter", sans-serif`;
  ctx.fillText(`${repoOwner}/${repoName}`, winX + winW / 2, tlY + 5 * scale);
  ctx.restore();

  // --- Window content ---
  const contentX = winX + 36 * scale;
  const contentY = tbY + titleBarH + 30 * scale;
  const contentW = winW - 72 * scale;

  // Owner
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.7;
  ctx.font = `500 ${16 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(repoOwner, contentX, contentY);
  ctx.restore();

  // Repo name — large
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${52 * scale}px -apple-system, "SF Pro Display", "Inter", sans-serif`;
  let fontSize = 52;
  while (ctx.measureText(repoName).width > contentW && fontSize > 28) {
    fontSize -= 2;
    ctx.font = `700 ${fontSize * scale}px -apple-system, "SF Pro Display", "Inter", sans-serif`;
  }
  ctx.fillText(repoName, contentX, contentY + 52 * scale);
  ctx.restore();

  // Description
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `400 ${18 * scale}px -apple-system, "SF Pro Text", "Inter", sans-serif`;
  wrapText(ctx, description, contentX, contentY + 86 * scale, contentW, 26 * scale);
  ctx.restore();

  // --- Pill badges row ---
  const badgeY = contentY + 165 * scale;
  let badgeX = contentX;

  const drawGlassPill = (text, color) => {
    ctx.save();
    ctx.font = `600 ${13 * scale}px -apple-system, "SF Pro Text", "Inter", sans-serif`;
    const tw = ctx.measureText(text).width;
    const dotSpace = 22 * scale; // space for the colored dot + gap
    const hPad = 14 * scale;
    const pillW = dotSpace + tw + hPad * 2;
    const pillH = 34 * scale;
    const pillR = pillH / 2;

    // Pill glass bg
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    roundRectPath(ctx, badgeX, badgeY, pillW, pillH, pillR);
    ctx.fill();

    // Pill border
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1 * scale;
    roundRectPath(ctx, badgeX, badgeY, pillW, pillH, pillR);
    ctx.stroke();

    // Colored dot
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(badgeX + hPad + 4 * scale, badgeY + pillH / 2, 4 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Text (vertically centered using textBaseline)
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText(text, badgeX + hPad + dotSpace, badgeY + pillH / 2);

    ctx.restore();
    badgeX += pillW + 10 * scale;
  };

  drawGlassPill(language, primaryColor);
  if (stars) drawGlassPill(`★ ${stars}`, '#febc2e');
  if (forks) drawGlassPill(`⑂ ${forks}`, secondaryColor);

  // --- Color palette dots (bottom of window) ---
  const paletteY = winY + winH - 44 * scale;
  let dotX = contentX;

  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = `500 ${10 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'left';
  ctx.fillText('THEME', dotX, paletteY - 2 * scale);
  dotX += 55 * scale;

  [bgColor, primaryColor, secondaryColor].forEach((color) => {
    // Dot border
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.arc(dotX, paletteY - 6 * scale, 8 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
    dotX += 26 * scale;
  });

  // Pattern status
  dotX += 16 * scale;
  ctx.fillStyle = showPattern ? primaryColor : 'rgba(255,255,255,0.15)';
  ctx.font = `500 ${10 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(showPattern ? '● Grid' : '○ Grid', dotX, paletteY - 2 * scale);
  ctx.restore();

  // Support URL (bottom right of window)
  if (supportUrl) {
    ctx.save();
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = `400 ${12 * scale}px -apple-system, "SF Pro Text", "Inter", sans-serif`;
    ctx.fillText(supportUrl, winX + winW - 36 * scale, paletteY - 2 * scale);
    ctx.restore();
  }

  // --- Floating mini widget (top-right, outside window) ---
  const widgetW = 160 * scale;
  const widgetH = 70 * scale;
  const widgetX = winX + winW + 20 * scale;
  const widgetY = winY + 30 * scale;

  // Only draw if it fits
  if (widgetX + widgetW < width - 20 * scale) {
    // Widget shadow
    ctx.save();
    ctx.filter = 'blur(20px)';
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    roundRectPath(ctx, widgetX + 2 * scale, widgetY + 4 * scale, widgetW, widgetH, 12 * scale);
    ctx.fill();
    ctx.restore();

    // Widget glass
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    roundRectPath(ctx, widgetX, widgetY, widgetW, widgetH, 12 * scale);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1 * scale;
    roundRectPath(ctx, widgetX, widgetY, widgetW, widgetH, 12 * scale);
    ctx.stroke();
    ctx.restore();

    // Widget content — stars count
    ctx.save();
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = `500 ${10 * scale}px -apple-system, "SF Pro Text", "Inter", sans-serif`;
    ctx.fillText('Stargazers', widgetX + 16 * scale, widgetY + 22 * scale);
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${26 * scale}px -apple-system, "SF Pro Display", "Inter", sans-serif`;
    ctx.fillText(stars || '0', widgetX + 16 * scale, widgetY + 52 * scale);
    ctx.restore();
  }

  // --- Floating mini widget (bottom-left, outside window) ---
  const widget2W = 140 * scale;
  const widget2H = 60 * scale;
  const widget2X = winX - widget2W - 20 * scale;
  const widget2Y = winY + winH - widget2H - 40 * scale;

  if (widget2X > 20 * scale) {
    ctx.save();
    ctx.filter = 'blur(20px)';
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    roundRectPath(ctx, widget2X + 2 * scale, widget2Y + 4 * scale, widget2W, widget2H, 12 * scale);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    roundRectPath(ctx, widget2X, widget2Y, widget2W, widget2H, 12 * scale);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1 * scale;
    roundRectPath(ctx, widget2X, widget2Y, widget2W, widget2H, 12 * scale);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = `500 ${10 * scale}px -apple-system, "SF Pro Text", "Inter", sans-serif`;
    ctx.fillText('Language', widget2X + 14 * scale, widget2Y + 22 * scale);
    ctx.fillStyle = primaryColor;
    ctx.font = `700 ${20 * scale}px -apple-system, "SF Pro Display", "Inter", sans-serif`;
    ctx.fillText(language, widget2X + 14 * scale, widget2Y + 46 * scale);
    ctx.restore();
  }
};
