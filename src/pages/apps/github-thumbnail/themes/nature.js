import { wrapText } from '../utils';

export const nature = (ctx, width, height, scale, data) => {
  const { repoOwner, repoName, description, language, stars, forks } = data;
  // NATURE Style

  // Background: Soft gradient (Sky to Earth)
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#e0f7fa'); // Light Sky Blue
  grad.addColorStop(1, '#f1f8e9'); // Light Greenish
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Sun
  ctx.fillStyle = '#fff9c4'; // Pale yellow sun
  ctx.beginPath();
  ctx.arc(width * 0.85, height * 0.2, 120 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Hills (Bezier curves)
  ctx.fillStyle = '#a5d6a7'; // Light Green
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height * 0.7);
  ctx.bezierCurveTo(
    width * 0.3,
    height * 0.6,
    width * 0.6,
    height * 0.8,
    width,
    height * 0.65,
  );
  ctx.lineTo(width, height);
  ctx.fill();

  ctx.fillStyle = '#81c784'; // Medium Green
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height * 0.85);
  ctx.bezierCurveTo(
    width * 0.2,
    height * 0.75,
    width * 0.5,
    height * 0.9,
    width,
    height * 0.8,
  );
  ctx.lineTo(width, height);
  ctx.fill();

  // Procedural Trees (Simple Triangles/Circles)
  const drawTree = (x, y, size) => {
    // Trunk
    ctx.fillStyle = '#8d6e63'; // Brown
    ctx.fillRect(x - size / 4, y, size / 2, size);

    // Leaves
    ctx.fillStyle = '#4caf50'; // Leaf Green
    ctx.beginPath();
    ctx.moveTo(x, y - size * 1.5);
    ctx.lineTo(x + size, y + size * 0.2);
    ctx.lineTo(x - size, y + size * 0.2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y - size * 2.5);
    ctx.lineTo(x + size * 0.8, y - size * 0.5);
    ctx.lineTo(x - size * 0.8, y - size * 0.5);
    ctx.fill();
  };

  // Draw a few trees
  drawTree(100 * scale, height * 0.75, 40 * scale);
  drawTree(180 * scale, height * 0.78, 50 * scale);
  drawTree(width - 150 * scale, height * 0.7, 60 * scale);

  // Content Frame (Wood/Paper look)
  const framePadding = 80 * scale;
  const boxX = framePadding;
  const boxY = framePadding;
  const boxW = width - framePadding * 2;
  const boxH = height - framePadding * 2;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.1)';
  ctx.shadowBlur = 20 * scale;
  ctx.shadowOffsetY = 10 * scale;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 20 * scale);
  ctx.fill();
  ctx.restore();

  // Decorative border on the card
  ctx.strokeStyle = '#a1887f';
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(
    boxX + 10 * scale,
    boxY + 10 * scale,
    boxW - 20 * scale,
    boxH - 20 * scale,
  );

  // Text Content
  ctx.textAlign = 'center';

  // Icon/Emoji at top
  ctx.font = `${60 * scale}px serif`;
  ctx.fillText('🌿', width / 2, boxY + 70 * scale);

  // Title
  ctx.fillStyle = '#33691e'; // Dark Green
  ctx.font = `bold ${80 * scale}px "Georgia", "Times New Roman", serif`;
  ctx.fillText(repoName, width / 2, boxY + 160 * scale);

  // Owner
  ctx.fillStyle = '#5d4037'; // Brown
  ctx.font = `italic ${30 * scale}px "Georgia", serif`;
  ctx.fillText(`cultivated by ${repoOwner}`, width / 2, boxY + 210 * scale);

  // Description
  ctx.fillStyle = '#4e342e';
  ctx.font = `normal ${28 * scale}px "Helvetica Neue", sans-serif`;
  wrapText(
    ctx,
    description,
    width / 2,
    boxY + 280 * scale,
    boxW - 100 * scale,
    40 * scale,
  );

  // Bottom Stats (Leaves/Flowers)
  const statY = boxY + boxH - 60 * scale;
  ctx.font = `bold ${24 * scale}px "Courier New", monospace`;
  ctx.fillStyle = '#558b2f';

  let stats = `${language}`;
  if (stars) stats += `  •  ${stars} ☼`; // Sun symbol for stars
  if (forks) stats += `  •  ${forks} ⑂`;

  ctx.fillText(stats, width / 2, statY);
};
