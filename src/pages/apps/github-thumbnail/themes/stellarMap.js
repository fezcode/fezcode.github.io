import { wrapText } from '../utils';

export const stellarMap = (ctx, width, height, scale, data) => {
  const { primaryColor, secondaryColor, bgColor, repoOwner, repoName, description } = data;

  ctx.save();
  // Starfield
  for(let i=0; i<200; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? primaryColor : secondaryColor;
    ctx.globalAlpha = Math.random();
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 3 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  // Constellation lines
  ctx.strokeStyle = bgColor;
  ctx.globalAlpha = 0.8;
  ctx.lineWidth = 1 * scale;

  // Generate random points for constellations
  const points = Array.from({length: 20}, () => ({x: Math.random() * width, y: Math.random() * height}));
  ctx.beginPath();
  for(let i=0; i<points.length - 1; i++) {
    if (Math.random() > 0.3) {
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[i+1].x, points[i+1].y);
    }
  }
  ctx.stroke();

  // Nebula effect
  const grd = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
  grd.addColorStop(0, primaryColor + '40'); // 25% opacity
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();

  const padding = 80 * scale;
  ctx.fillStyle = secondaryColor;
  ctx.font = `bold ${30 * scale}px "Courier New"`;
  ctx.fillText(`SYSTEM: ${repoOwner.toUpperCase()}`, padding, padding + 20 * scale);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${80 * scale}px "Arial"`;
  ctx.fillText(repoName, padding, padding + 110 * scale);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = `${32 * scale}px "Arial"`;
  wrapText(ctx, description, padding, padding + 180 * scale, width - padding * 2, 45 * scale);
};