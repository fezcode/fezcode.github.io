import { wrapText } from '../utils';

// App colors (from src/config/colors.js)
const APP_COLORS = {
  primary: '#ef4444',    // primary.500
  secondary: '#fb923c',  // secondary.400
  reading: '#2dd4bf',    // reading
  event: '#10b981',      // event
  movie: '#DC143C',      // movie
  tools: '#e0aaff',      // tools
  article: '#FA8072',    // article
  game: '#00C9A7',       // game
  series: '#edc531',     // series
};

export const urbanRogue = (ctx, width, height, scale, data) => {
  const { repoOwner, repoName, description, language, stars, forks, bgColor, primaryColor } = data;

  // 1. Sophisticated Midnight/Steel Background
  const bg = bgColor || '#0a0a0b';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Subtle Premium Paper Texture/Noise
  ctx.save();
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 10000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const s = Math.random() * 2 * scale;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, s, s);
  }
  ctx.restore();

  // 2. High-End Architectural Grid (Blueprint-ish but elegant)
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1 * scale;
  const gridSize = 60 * scale;
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

  // 3. Elegant Skyline Silhouette (Minimalist & Sharp)
  const drawSkyline = () => {
    ctx.save();
    const gradient = ctx.createLinearGradient(0, height * 0.5, 0, height);
    gradient.addColorStop(0, 'rgba(255,255,255,0.02)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.08)');
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(0, height);

    // Empire State
    ctx.lineTo(width * 0.1, height);
    ctx.lineTo(width * 0.1, height * 0.6);
    ctx.lineTo(width * 0.12, height * 0.55);
    ctx.lineTo(width * 0.12, height * 0.4); // Spire
    ctx.lineTo(width * 0.13, height * 0.55);
    ctx.lineTo(width * 0.15, height * 0.6);
    ctx.lineTo(width * 0.15, height);

    // Chrysler
    ctx.lineTo(width * 0.35, height);
    ctx.lineTo(width * 0.35, height * 0.7);
    ctx.lineTo(width * 0.38, height * 0.5);
    ctx.lineTo(width * 0.41, height * 0.7);
    ctx.lineTo(width * 0.41, height);

    // One World Trade
    ctx.lineTo(width * 0.75, height);
    ctx.lineTo(width * 0.8, height * 0.3);
    ctx.lineTo(width * 0.85, height);

    ctx.lineTo(width, height);
    ctx.fill();
    ctx.restore();
  };
  drawSkyline();

  // 4. Elegant Accents & Borders
  const accentColor = primaryColor || APP_COLORS.series;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2 * scale;
  const margin = 40 * scale;

  // L-Shaped corners for architectural feel
  ctx.beginPath();
  ctx.moveTo(margin + 40 * scale, margin);
  ctx.lineTo(margin, margin);
  ctx.lineTo(margin, margin + 40 * scale);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width - margin - 40 * scale, height - margin);
  ctx.lineTo(width - margin, height - margin);
  ctx.lineTo(width - margin, height - margin - 40 * scale);
  ctx.stroke();

  // 5. Typography - New York Times / Luxury Magazine Aesthetic
  const padding = 120 * scale;

  // Using project-defined fonts
  const titleFont = '"Instrument Serif", serif';
  const metadataFont = '"Instrument Sans", "Inter", sans-serif';
  const labelFont = '"Outfit", "Syne", sans-serif';

  // Repo Owner (Small, Spaced out, Sans)
  ctx.textAlign = 'left';
  ctx.fillStyle = accentColor;
  ctx.font = `600 ${22 * scale}px ${labelFont}`;
  // Manually handle letter-spacing if needed (canvas API support varies)
  ctx.fillText(repoOwner.toUpperCase().split('').join('  '), padding, padding);

  // Repo Name (Large Serif, Dramatic)
  ctx.fillStyle = '#ffffff';
  ctx.font = `italic 700 ${140 * scale}px ${titleFont}`;
  ctx.fillText(repoName, padding, height / 2);

  // Description (Classic Modernist Typography)
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `400 ${34 * scale}px ${metadataFont}`;
  wrapText(ctx, description, padding, height / 2 + 100 * scale, width * 0.55, 48 * scale);

  // 6. Sophisticated Metadata (Fine lines)
  const statsX = width - padding;
  const statsY = height / 2 - 20 * scale;

  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${48 * scale}px ${labelFont}`;
  ctx.fillText(stars, statsX, statsY);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = `600 ${16 * scale}px ${labelFont}`;
  ctx.fillText('STARS', statsX, statsY + 30 * scale);

  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${48 * scale}px ${labelFont}`;
  ctx.fillText(forks, statsX, statsY + 120 * scale);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = `600 ${16 * scale}px ${labelFont}`;
  ctx.fillText('FORKS', statsX, statsY + 150 * scale);

  // Vertical Divider
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath();
  ctx.moveTo(statsX - 100 * scale, statsY - 40 * scale);
  ctx.lineTo(statsX - 100 * scale, statsY + 180 * scale);
  ctx.stroke();

  // 7. NYC "Passport" Stamp (Bottom Left - subtle)
  ctx.save();
  ctx.translate(padding, height - margin - 40 * scale);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1 * scale;
  ctx.strokeRect(0, 0, 200 * scale, 60 * scale);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `bold ${12 * scale}px ${metadataFont}`;
  ctx.textAlign = 'left';
  ctx.fillText('ORIGIN: FEZCODEX.CORE', 10 * scale, 25 * scale);
  ctx.fillText('LOCATION: MANHATTAN_GRID', 10 * scale, 45 * scale);
  ctx.restore();

  // Language Accent (Subtle circle)
  if (language) {
    const langX = width - padding;
    const langY = padding;
    ctx.textAlign = 'right';
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(langX - (ctx.measureText(language).width + 30 * scale), langY - 10 * scale, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `italic 600 ${26 * scale}px ${titleFont}`;
    ctx.fillText(language, langX, langY);
  }
};
