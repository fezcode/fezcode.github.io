import { wrapText } from '../utils';

export const luxe = (ctx, width, height, scale, data) => {
  const { repoOwner, repoName, description, language, stars, primaryColor, secondaryColor, bgColor } = data;

  // LCG Random Generator (Ported from LuxeArt.jsx)
  const seed = repoName + repoOwner;
  let h = 0xdeadbeef;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  }
  const rng = () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };

  // Background
  ctx.fillStyle = '#EBEBEB'; // Light grey/white as in LuxeArt
  ctx.fillRect(0, 0, width, height);

  // Organic Curves (Ported from LuxeArt.jsx)
  const curveCount = 8 + Math.floor(rng() * 5);
  const baseHue = Math.floor(rng() * 360);

  ctx.save();
  // We'll use multiply blend mode for the curves as in LuxeArt
  ctx.globalCompositeOperation = 'multiply';

  for (let i = 0; i < curveCount; i++) {
    const points = [];
    const segments = 4;
    const startY = rng() * height;

    points.push({ x: 0, y: startY });

    for (let j = 1; j <= segments; j++) {
      points.push({
        x: (j / segments) * width,
        y: startY + (rng() - 0.5) * (height * 0.5),
      });
    }

    // Draw Smooth Curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let j = 0; j < points.length - 1; j++) {
      const p0 = points[j];
      const p1 = points[j + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1.x, p1.y);
    }

    // Close shape to bottom
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    // Color generation (Ported from LuxeArt.jsx)
    const isGold = rng() > 0.8;
    const hue = isGold ? 45 : baseHue + (rng() - 0.5) * 30;
    const sat = isGold ? 60 : 0;
    const lit = isGold ? 60 : 90 - i * 5;
    const opacity = 0.05 + rng() * 0.15;

    ctx.fillStyle = `hsla(${hue}, ${sat}%, ${lit}%, ${opacity})`;
    ctx.fill();

    ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${lit - 20}%, ${opacity * 2})`;
    ctx.lineWidth = 1 * scale;
    ctx.stroke();
  }
  ctx.restore();

  // Noise specks
  ctx.save();
  for (let k = 0; k < 100; k++) {
    const cx = rng() * width;
    const cy = rng() * height;
    const r = rng() * 3 * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fill();
  }
  ctx.restore();

  // Typography & Content
  const serifFont = '"Playfair Display", "Times New Roman", serif';
  const monoFont = '"JetBrains Mono", "Courier New", monospace';

  // Decorative Line
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(width * 0.1, height * 0.2);
  ctx.lineTo(width * 0.9, height * 0.2);
  ctx.stroke();

  // Repo Owner (Brand)
  ctx.fillStyle = '#000';
  ctx.font = `italic 300 ${24 * scale}px ${serifFont}`;
  ctx.textAlign = 'left';
  ctx.letterSpacing = '10px';
  ctx.fillText(repoOwner.toUpperCase(), width * 0.1, height * 0.15);

  // Repo Name
  ctx.font = `normal 900 ${120 * scale}px ${serifFont}`;
  ctx.letterSpacing = 'normal';
  ctx.fillText(repoName, width * 0.1, height * 0.45);

  // Description
  ctx.font = `italic 300 ${32 * scale}px ${serifFont}`;
  ctx.fillStyle = '#333';
  wrapText(ctx, description, width * 0.1, height * 0.6, width * 0.6, 45 * scale);

  // Language & Stats (Bottom Bar)
  ctx.font = `bold ${20 * scale}px ${monoFont}`;
  ctx.fillStyle = '#000';
  ctx.textAlign = 'right';
  ctx.fillText(language.toUpperCase(), width * 0.9, height * 0.85);

  ctx.font = `normal ${20 * scale}px ${monoFont}`;
  ctx.fillText(`${stars} STARS // ${repoOwner}`, width * 0.9, height * 0.9);

  // Accent Circle
  ctx.beginPath();
  ctx.arc(width * 0.85, height * 0.4, 40 * scale, 0, Math.PI * 2);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 0.5 * scale;
  ctx.stroke();
};
