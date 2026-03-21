import { wrapText } from '../utils';

export const circlesBg = (ctx, width, height, scale, data) => {
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
  } = data;

  // --- Background ---
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // --- Randomized decorative circles using all 3 colors ---
  const colors = [primaryColor, secondaryColor, bgColor];
  const circleCount = 18 + Math.floor(Math.random() * 12); // 18–29 circles

  for (let i = 0; i < circleCount; i++) {
    const color = colors[i % 3]; // cycle through all 3 colors
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = (30 + Math.random() * 160) * scale;
    const alpha = 0.06 + Math.random() * 0.18;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Occasional stroke ring
    if (Math.random() > 0.5) {
      ctx.globalAlpha = alpha * 0.6;
      ctx.strokeStyle = color;
      ctx.lineWidth = (1 + Math.random() * 3) * scale;
      ctx.beginPath();
      ctx.arc(x, y, radius + (8 + Math.random() * 20) * scale, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- A few larger accent circles for depth ---
  for (let i = 0; i < 5; i++) {
    const color = colors[Math.floor(Math.random() * 3)];
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = (120 + Math.random() * 200) * scale;

    ctx.save();
    ctx.globalAlpha = 0.03 + Math.random() * 0.06;
    ctx.strokeStyle = color;
    ctx.lineWidth = (1 + Math.random() * 2) * scale;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // --- Central content card ---
  const cardW = width * 0.62;
  const cardH = height * 0.58;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  // Card backdrop (frosted glass effect)
  ctx.save();
  ctx.globalAlpha = 0.75;
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 20 * scale);
  ctx.fill();
  ctx.restore();

  // Card border
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 20 * scale);
  ctx.stroke();
  ctx.restore();

  // --- Text content ---
  const padding = 50 * scale;
  const contentX = cardX + padding;
  const contentCenterX = width / 2;

  // Owner
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.6;
  ctx.font = `500 ${18 * scale}px "Inter", "Segoe UI", sans-serif`;
  ctx.fillText(repoOwner, contentCenterX, cardY + padding + 10 * scale);
  ctx.restore();

  // Repo name
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = secondaryColor;
  ctx.font = `800 ${52 * scale}px "Inter", "Segoe UI", sans-serif`;
  let fontSize = 52;
  const maxNameW = cardW - padding * 2;
  while (ctx.measureText(repoName).width > maxNameW && fontSize > 28) {
    fontSize -= 2;
    ctx.font = `800 ${fontSize * scale}px "Inter", "Segoe UI", sans-serif`;
  }
  ctx.fillText(repoName, contentCenterX, cardY + padding + 60 * scale);
  ctx.restore();

  // Divider line
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 1 * scale;
  const divW = cardW * 0.4;
  ctx.beginPath();
  ctx.moveTo(contentCenterX - divW / 2, cardY + padding + 80 * scale);
  ctx.lineTo(contentCenterX + divW / 2, cardY + padding + 80 * scale);
  ctx.stroke();
  ctx.restore();

  // Description
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.7;
  ctx.font = `400 ${20 * scale}px "Inter", "Segoe UI", sans-serif`;
  wrapText(
    ctx,
    description,
    contentCenterX,
    cardY + padding + 115 * scale,
    cardW - padding * 2,
    30 * scale,
  );
  ctx.restore();

  // --- Stats at bottom of card ---
  const statY = cardY + cardH - 50 * scale;
  const statFont = `600 ${16 * scale}px "Inter", "Segoe UI", sans-serif`;

  const drawStatPill = (text, x, color) => {
    ctx.save();
    ctx.font = statFont;
    const tw = ctx.measureText(text).width + 30 * scale;
    const pillH = 32 * scale;

    // Pill background
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x - tw / 2, statY - pillH / 2, tw, pillH, pillH / 2);
    ctx.fill();

    // Pill border
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.roundRect(x - tw / 2, statY - pillH / 2, tw, pillH, pillH / 2);
    ctx.stroke();

    // Text
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, statY);
    ctx.restore();
  };

  const hasStats = stars || forks;
  if (hasStats) {
    drawStatPill(`★ ${stars}`, contentCenterX - 130 * scale, primaryColor);
    drawStatPill(language, contentCenterX, secondaryColor);
    drawStatPill(`⑂ ${forks}`, contentCenterX + 130 * scale, primaryColor);
  } else {
    drawStatPill(language, contentCenterX, secondaryColor);
  }

  // --- Small decorative circles around card edges ---
  for (let i = 0; i < 8; i++) {
    const color = colors[Math.floor(Math.random() * 3)];
    const angle = Math.random() * Math.PI * 2;
    const dist = (Math.min(cardW, cardH) / 2) + (20 + Math.random() * 80) * scale;
    const cx = width / 2 + Math.cos(angle) * dist;
    const cy = height / 2 + Math.sin(angle) * dist * 0.7;
    const r = (4 + Math.random() * 12) * scale;

    ctx.save();
    ctx.globalAlpha = 0.25 + Math.random() * 0.3;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};
