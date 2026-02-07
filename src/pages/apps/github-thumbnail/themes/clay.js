import { wrapText } from '../utils';

export const clay = (ctx, width, height, scale, data) => {
  const {
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
    supportUrl,
  } = data;
  // PLAYFUL CLAY Style
  ctx.fillStyle = '#f0f4f8'; // Light blue-ish grey
  ctx.fillRect(0, 0, width, height);

  const cardColor = '#ffffff';
  const padding = 60 * scale;
  // Main Container (Claymorphism: rounded, inner shadow, outer shadow)
  const drawClayRect = (x, y, w, h, radius) => {
    ctx.save();
    // Outer Shadow
    ctx.shadowColor = '#b8c2cc';
    ctx.shadowBlur = 30 * scale;
    ctx.shadowOffsetY = 20 * scale;
    ctx.fillStyle = cardColor;

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();

    // Inner Highlight (simulated with clipping)
    ctx.shadowColor = 'transparent';
    ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 10 * scale;
    ctx.stroke();
    ctx.restore();
  };

  // Large Card
  drawClayRect(
    padding,
    padding,
    width - padding * 2,
    height - padding * 2,
    60 * scale,
  );

  // Content
  ctx.textAlign = 'center';
  ctx.fillStyle = '#334e68'; // Dark blue-grey text

  // Round Font
  const roundFont =
    '"Nunito", "Quicksand", "Arial Rounded MT Bold", sans-serif';

  ctx.font = `800 ${90 * scale}px ${roundFont}`;
  ctx.fillText(repoName, width / 2, height * 0.35);

  // Owner & URL Group
  const ownerText = `by ${repoOwner}`;
  ctx.font = `600 ${30 * scale}px ${roundFont}`;
  const ownerWidth = ctx.measureText(ownerText).width;

  let totalGroupWidth = ownerWidth;
  if (supportUrl) {
    ctx.font = `600 ${20 * scale}px ${roundFont}`;
    totalGroupWidth += ctx.measureText(supportUrl).width + 30 * scale;
  }

  const groupX = (width - totalGroupWidth) / 2;

  ctx.textAlign = 'left';
  ctx.fillStyle = '#829ab1';
  ctx.font = `600 ${30 * scale}px ${roundFont}`;
  ctx.fillText(ownerText, groupX, height * 0.45);

  if (supportUrl) {
    ctx.fillStyle = '#bcccdc';
    ctx.font = `600 ${20 * scale}px ${roundFont}`;
    ctx.fillText(supportUrl, groupX + ownerWidth + 30 * scale, height * 0.45);
  }

  // Description
  ctx.textAlign = 'center';
  ctx.fillStyle = '#486581';
  ctx.font = `500 ${32 * scale}px ${roundFont}`;
  wrapText(ctx, description, width / 2, height * 0.55, width * 0.7, 45 * scale);

  // Floating Pills for stats
  const pillW = 200 * scale;
  const pillH = 80 * scale;
  const pillY = height * 0.75;

  const drawClayPill = (x, text, color) => {
    ctx.save();
    ctx.shadowColor = color + '66'; // semi transparent
    ctx.shadowBlur = 20 * scale;
    ctx.shadowOffsetY = 10 * scale;
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.roundRect(x - pillW / 2, pillY, pillW, pillH, 40 * scale);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = `bold ${24 * scale}px ${roundFont}`;
    ctx.fillText(text, x, pillY + pillH / 2 + 8 * scale);
    ctx.restore();
  };

  let pillX = width / 2;
  if (stars) {
    drawClayPill(pillX - 250 * scale, `${stars} ★`, '#f6ad55'); // Orange
  }
  drawClayPill(pillX, language, '#63b3ed'); // Blue
  if (forks) {
    drawClayPill(pillX + 250 * scale, `${forks} ⑂`, '#68d391'); // Green
  }
};
