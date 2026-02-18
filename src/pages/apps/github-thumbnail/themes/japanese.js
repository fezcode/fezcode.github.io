export const japanese = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    secondaryColor,
    repoOwner,
    repoName,
    language,
    stars,
    forks,
    supportUrl,
  } = data;
  // JAPANESE POP Style

  // Dynamic background pattern (Sunburst)
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(0, 0, width, height);

  // Sunburst rays
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.fillStyle = primaryColor;
  const rays = 16;
  for (let i = 0; i < rays; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, width, (i * 2 * Math.PI) / rays, ((i * 2 + 1) * Math.PI) / rays);
    ctx.lineTo(0, 0);
    ctx.fill();
  }
  ctx.restore();

  // Center Circle (Sun)
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 220 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Repo Name (Bold, Stroke)
  ctx.font = `900 ${100 * scale}px "Arial Black", sans-serif`;
  ctx.fillStyle = '#000';
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 10 * scale;

  ctx.strokeText(repoName.toUpperCase(), width / 2, height / 2);
  ctx.fillText(repoName.toUpperCase(), width / 2, height / 2);

  // Vertical Text (Decorations)
  const fontStack = '"Arial", sans-serif';
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${40 * scale}px ${fontStack}`;

  const drawVert = (text, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    for (let i = 0; i < text.length; i++) {
      ctx.fillText(text[i], 0, i * 40 * scale);
    }
    ctx.restore();
  };

  drawVert(repoOwner.toUpperCase(), 60 * scale, 60 * scale);
  drawVert(language.toUpperCase(), width - 60 * scale, 60 * scale);

  // Stats in Floating Bubbles
  const drawBubble = (text, x, y, color) => {
    ctx.beginPath();
    ctx.arc(x, y, 60 * scale, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4 * scale;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.font = `bold ${20 * scale}px ${fontStack}`;
    ctx.fillText(text, x, y);
  };

  if (stars) drawBubble(`★ ${stars}`, width * 0.2, height * 0.8, '#ffe600');
  if (forks) drawBubble(`⑂ ${forks}`, width * 0.8, height * 0.8, '#0099ff');

  // Support URL (Sticker style)
  if (supportUrl) {
    ctx.save();
    ctx.translate(width / 2, height - 60 * scale);
    ctx.rotate(-0.05);
    ctx.fillStyle = '#000';
    ctx.fillRect(-200 * scale, -30 * scale, 400 * scale, 60 * scale);
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${24 * scale}px ${fontStack}`;
    ctx.fillText(supportUrl, 0, 0);
    ctx.restore();
  }
};
