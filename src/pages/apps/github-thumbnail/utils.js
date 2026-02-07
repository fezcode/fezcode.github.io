export const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
};

export const drawPill = (ctx, x, y, text, color, scale) => {
  ctx.font = `bold ${20 * scale}px "JetBrains Mono"`;
  const padding = 20 * scale;
  const textWidth = ctx.measureText(text).width;
  const height = 40 * scale;
  const width = textWidth + padding * 2;

  ctx.fillStyle = color;
  ctx.globalAlpha = 0.2;
  ctx.roundRect(x, y - height / 1.5, width, height, height / 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  ctx.fillStyle = color;
  ctx.fillText(text, x + padding, y);
};
