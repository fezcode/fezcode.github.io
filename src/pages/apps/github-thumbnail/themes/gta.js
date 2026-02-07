import { wrapText } from '../utils';

export const gta = (ctx, width, height, scale, data) => {
  const { repoOwner, repoName, description, stars } = data;
  // GRAND THEFT AUTO Style

  // Background: Warm sunset gradient (Los Santos vibe)
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#ffce00'); // Yellow
  grad.addColorStop(0.5, '#ff9900'); // Orange
  grad.addColorStop(1, '#cd0074'); // Deep Pink/Purple
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Silhouette of a city (Procedural)
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(0, height);
  let h = height * 0.8;
  for (let x = 0; x <= width; x += 40 * scale) {
    h = height * (0.6 + Math.random() * 0.3);
    ctx.lineTo(x, h);
    ctx.lineTo(x + 40 * scale, h);
  }
  ctx.lineTo(width, height);
  ctx.fill();

  // Black Borders (The Collage Look)
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 15 * scale;
  ctx.strokeRect(0, 0, width, height);

  // Title ("Pricedown" emulation)
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 8 * scale;
  ctx.textAlign = 'left';
  // Impact is the closest web-safe font to Pricedown
  ctx.font = `900 ${150 * scale}px "Impact", "Arial Black", sans-serif`;

  const titleX = 60 * scale;
  const titleY = height * 0.4;

  ctx.strokeText(repoName, titleX, titleY);
  ctx.fillText(repoName, titleX, titleY);

  // "The Price is Right" sub-style text
  ctx.fillStyle = '#000';
  ctx.font = `bold ${40 * scale}px "Arial Narrow", sans-serif`;
  ctx.fillText(
    repoOwner.toUpperCase(),
    titleX + 10 * scale,
    titleY - 120 * scale,
  );

  // "WANTED" Stars (Top Right)
  ctx.textAlign = 'right';

  // Draw "Wanted" Stars
  const numStars = Math.min(5, Math.ceil((parseInt(stars) || 0) / 100)) || 1;

  ctx.font = `900 ${60 * scale}px "Impact", sans-serif`;
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4 * scale;

  let currentStarX = width - 60 * scale;
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i < numStars ? '#fff' : 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    // Simple Star shape
    const r = 30 * scale;
    const cx = currentStarX;
    const cy = 80 * scale;
    for (let j = 0; j < 5; j++) {
      ctx.lineTo(
        Math.cos(((18 + j * 72) / 180) * Math.PI) * r + cx,
        -Math.sin(((18 + j * 72) / 180) * Math.PI) * r + cy,
      );
      ctx.lineTo(
        Math.cos(((54 + j * 72) / 180) * Math.PI) * (r / 2) + cx,
        -Math.sin(((54 + j * 72) / 180) * Math.PI) * (r / 2) + cy,
      );
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    currentStarX -= 70 * scale;
  }

  // Description Box (Bottom Left)
  // Comic style box
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 6 * scale;
  const boxX = 40 * scale;
  const boxY = height * 0.6;
  const boxW = width * 0.5;
  const boxH = height * 0.3;

  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  ctx.fillStyle = '#000';
  ctx.textAlign = 'left';
  ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
  wrapText(
    ctx,
    description,
    boxX + 30 * scale,
    boxY + 50 * scale,
    boxW - 60 * scale,
    40 * scale,
  );

  // Sticker (Bottom Right)
  ctx.save();
  ctx.translate(width - 200 * scale, height - 150 * scale);
  ctx.rotate(-0.2);
  ctx.fillStyle = '#000';
  ctx.fillRect(-150 * scale, -50 * scale, 300 * scale, 100 * scale);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.font = `900 ${40 * scale}px "Impact", sans-serif`;
  ctx.fillText('WASTED', 0, 15 * scale);
  ctx.restore();
};
