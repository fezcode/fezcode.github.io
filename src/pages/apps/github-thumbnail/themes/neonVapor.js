import { wrapText } from '../utils';

export const neonVapor = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    secondaryColor,
    bgColor,
    repoOwner,
    repoName,
    description,
    language,
    stars,
  } = data;

  const padding = 60 * scale;
  const glowIntensity = 50; // Fixed intensity

  // 1. Deep Space Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Glowing Sun (Vaporwave style)
  const sunRadius = 200 * scale;
  const sunX = width * 0.75;
  const sunY = height * 0.3;

    const sunGradient = ctx.createLinearGradient(sunX, sunY - sunRadius, sunX, sunY + sunRadius);
    sunGradient.addColorStop(0, primaryColor);
    sunGradient.addColorStop(0.5, secondaryColor);
    sunGradient.addColorStop(1, primaryColor);

    ctx.save();
    ctx.shadowColor = secondaryColor;
    ctx.shadowBlur = (glowIntensity / 100) * 80 * scale;
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // Retro Sun Scanlines
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = sunY - sunRadius; i < sunY + sunRadius; i += 20 * scale) {
      const scanHeight = 4 * scale * (1 + (i - (sunY - sunRadius)) / (sunRadius * 2));
      ctx.fillRect(sunX - sunRadius, i, sunRadius * 2, scanHeight);
    }
    ctx.restore();

    // 3. Perspectives Grid (Vaporwave floor)
    ctx.save();
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1 * scale;
    ctx.globalAlpha = 0.3;
    const gridY = height * 0.6;
    for (let x = -width; x < width * 2; x += 60 * scale) {
      ctx.beginPath();
      ctx.moveTo(width / 2, gridY);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = gridY; y < height; y += (y - gridY + 10) * 0.5) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // 4. Main Typography
    ctx.textAlign = 'left';

    // Repo Owner
    ctx.font = `italic bold ${30 * scale}px "Inter", sans-serif`;
    ctx.fillStyle = secondaryColor;
    ctx.fillText(repoOwner.toUpperCase(), padding, padding + 40 * scale);
    // Repo Name
  ctx.save();
  ctx.font = `italic 900 ${130 * scale}px "Inter", "Arial Black", sans-serif`;
  // Double glow
  ctx.shadowColor = primaryColor;
  ctx.shadowBlur = (glowIntensity / 100) * 40 * scale;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(repoName, padding, padding + 180 * scale);

  ctx.shadowColor = secondaryColor;
  ctx.shadowBlur = (glowIntensity / 100) * 20 * scale;
  ctx.fillText(repoName, padding + 4 * scale, padding + 180 * scale);
  ctx.restore();

  // Description
  ctx.font = `bold ${36 * scale}px "Inter", sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  wrapText(
    ctx,
    description,
    padding,
    padding + 280 * scale,
    width * 0.6,
    50 * scale
  );

  // 5. Retro Stats Pills
  const drawRetroPill = (x, y, label, value, color) => {
    ctx.font = `bold ${24 * scale}px "JetBrains Mono", monospace`;
    const text = `${label}: ${value}`;
    const tw = ctx.measureText(text).width + 40 * scale;

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.2;
    ctx.roundRect(x, y - 30 * scale, tw, 60 * scale, 30 * scale);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(x, y - 30 * scale, tw, 60 * scale, 30 * scale);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, x + 20 * scale, y + 8 * scale);
    return tw;
  };

  const footerY = height - padding - 20 * scale;
  let curX = padding;
  curX += drawRetroPill(curX, footerY, 'STARS', stars, primaryColor) + 20 * scale;
  drawRetroPill(curX, footerY, 'LANG', language.toUpperCase(), secondaryColor);
};
