import { wrapText } from '../utils';

export const darkMedieval = (ctx, width, height, scale, data) => {
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
    supportUrl,
  } = data;

  const roundRect = (ctx, x, y, w, h, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // 1. Draw Physical Wooden Frame
  // Outer base wood
  ctx.fillStyle = '#1a0d00';
  ctx.fillRect(0, 0, width, height);

  // Outer 3D bevels
  ctx.fillStyle = '#2e1a05'; // Top light
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(width, 0);
  ctx.lineTo(width - 30*scale, 30*scale); ctx.lineTo(30*scale, 30*scale);
  ctx.fill();

  ctx.fillStyle = '#0a0500'; // Bottom shadow
  ctx.beginPath();
  ctx.moveTo(0, height); ctx.lineTo(width, height);
  ctx.lineTo(width - 30*scale, height - 30*scale); ctx.lineTo(30*scale, height - 30*scale);
  ctx.fill();

  ctx.fillStyle = '#140a00'; // Left light-ish shadow
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(0, height);
  ctx.lineTo(30*scale, height - 30*scale); ctx.lineTo(30*scale, 30*scale);
  ctx.fill();

  ctx.fillStyle = '#3d240a'; // Right highlight
  ctx.beginPath();
  ctx.moveTo(width, 0); ctx.lineTo(width, height);
  ctx.lineTo(width - 30*scale, height - 30*scale); ctx.lineTo(width - 30*scale, 30*scale);
  ctx.fill();

  // 2. Gold Inlay
  const gold = ctx.createLinearGradient(0, 0, width, height);
  gold.addColorStop(0, '#bf953f');
  gold.addColorStop(0.25, '#fcf6ba');
  gold.addColorStop(0.5, '#b38728');
  gold.addColorStop(0.75, '#fbf5b7');
  gold.addColorStop(1, '#aa771c');

  ctx.fillStyle = gold;
  ctx.fillRect(30*scale, 30*scale, width - 60*scale, 20*scale); // top
  ctx.fillRect(30*scale, height - 50*scale, width - 60*scale, 20*scale); // bot
  ctx.fillRect(30*scale, 30*scale, 20*scale, height - 60*scale); // left
  ctx.fillRect(width - 50*scale, 30*scale, 20*scale, height - 60*scale); // right

  // Add detail lines to gold
  ctx.strokeStyle = '#5a3f05';
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(35*scale, 35*scale, width - 70*scale, height - 70*scale);
  ctx.strokeRect(45*scale, 45*scale, width - 90*scale, height - 90*scale);

  // 3. Inner Wood Bevel
  const innerWood = '#1a0d00';
  ctx.fillStyle = innerWood;
  ctx.fillRect(50*scale, 50*scale, width - 100*scale, height - 100*scale);

  ctx.fillStyle = '#2e1a05';
  ctx.beginPath();
  ctx.moveTo(50*scale, 50*scale); ctx.lineTo(width - 50*scale, 50*scale);
  ctx.lineTo(width - 80*scale, 80*scale); ctx.lineTo(80*scale, 80*scale);
  ctx.fill();

  ctx.fillStyle = '#0a0500';
  ctx.beginPath();
  ctx.moveTo(50*scale, height - 50*scale); ctx.lineTo(width - 50*scale, height - 50*scale);
  ctx.lineTo(width - 80*scale, height - 80*scale); ctx.lineTo(80*scale, height - 80*scale);
  ctx.fill();

  ctx.fillStyle = '#140a00';
  ctx.beginPath();
  ctx.moveTo(50*scale, 50*scale); ctx.lineTo(50*scale, height - 50*scale);
  ctx.lineTo(80*scale, height - 80*scale); ctx.lineTo(80*scale, 80*scale);
  ctx.fill();

  ctx.fillStyle = '#3d240a';
  ctx.beginPath();
  ctx.moveTo(width - 50*scale, 50*scale); ctx.lineTo(width - 50*scale, height - 50*scale);
  ctx.lineTo(width - 80*scale, height - 80*scale); ctx.lineTo(width - 80*scale, 80*scale);
  ctx.fill();

  // 4. The Canvas / Painting Area
  ctx.save();
  ctx.beginPath();
  ctx.rect(80*scale, 80*scale, width - 160*scale, height - 160*scale);
  ctx.clip();

  // Base background
  ctx.fillStyle = bgColor;
  ctx.fillRect(80*scale, 80*scale, width - 160*scale, height - 160*scale);

  // Vignette
  const vignette = ctx.createRadialGradient(width/2, height/2, height*0.1, width/2, height/2, height*0.6);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = vignette;
  ctx.fillRect(80*scale, 80*scale, width - 160*scale, height - 160*scale);

  // Canvas Thread Texture
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#ffffff';
  for(let i = 80*scale; i < height - 80*scale; i += 3*scale) {
    ctx.fillRect(80*scale, i, width - 160*scale, 1*scale);
  }
  for(let i = 80*scale; i < width - 80*scale; i += 3*scale) {
    ctx.fillRect(i, 80*scale, 1*scale, height - 160*scale);
  }

  // Painterly splotches / clouds (simulate oil paint texture)
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      ctx.arc(
          80*scale + Math.random() * (width - 160*scale),
          80*scale + Math.random() * (height - 160*scale),
          50*scale + Math.random() * 120*scale,
          0, Math.PI * 2
      );
      ctx.fillStyle = (i % 2 === 0) ? primaryColor : secondaryColor;
      ctx.filter = `blur(${25*scale}px)`;
      ctx.fill();
  }
  ctx.filter = 'none';
  ctx.globalAlpha = 1.0;

  // 5. Ornaments on Canvas (Illuminated Manuscript Vines)
  const drawVineCorner = (x, y, scaleX, scaleY) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scaleX, scaleY);

      ctx.strokeStyle = gold;
      ctx.lineWidth = 3 * scale;
      ctx.lineCap = 'round';

      // Main stem
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(80*scale, 20*scale, 120*scale, 120*scale);
      ctx.stroke();

      // Leaf 1
      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.moveTo(40*scale, 10*scale);
      ctx.quadraticCurveTo(50*scale, -10*scale, 70*scale, 0);
      ctx.quadraticCurveTo(50*scale, 20*scale, 40*scale, 10*scale);
      ctx.fill(); ctx.stroke();

      // Leaf 2
      ctx.beginPath();
      ctx.moveTo(80*scale, 40*scale);
      ctx.quadraticCurveTo(100*scale, 30*scale, 110*scale, 50*scale);
      ctx.quadraticCurveTo(90*scale, 60*scale, 80*scale, 40*scale);
      ctx.fill(); ctx.stroke();

      // Flower
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.arc(120*scale, 120*scale, 15*scale, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = gold;
      ctx.beginPath();
      ctx.arc(120*scale, 120*scale, 5*scale, 0, Math.PI*2);
      ctx.fill();

      ctx.restore();
  };

  drawVineCorner(80*scale, 80*scale, 1, 1);
  drawVineCorner(width - 80*scale, 80*scale, -1, 1);
  drawVineCorner(80*scale, height - 80*scale, 1, -1);
  drawVineCorner(width - 80*scale, height - 80*scale, -1, -1);

  // 6. Typography & Content

  // Repo Owner (Author)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `italic ${28 * scale}px "Georgia", serif`;
  ctx.fillStyle = '#dddddd';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 6 * scale;
  ctx.shadowOffsetY = 3 * scale;
  ctx.fillText(`— Opus by ${repoOwner} —`, width / 2, 160 * scale);

  // Title with Drop Cap
  const firstLetter = repoName.charAt(0).toUpperCase();
  const restOfName = repoName.slice(1);

  ctx.textBaseline = 'alphabetic';

  // Measure to center
  ctx.font = `bold ${120 * scale}px "Georgia", serif`;
  const firstWidth = ctx.measureText(firstLetter).width;
  ctx.font = `bold ${80 * scale}px "Georgia", serif`;
  const restWidth = ctx.measureText(restOfName).width;
  const totalWidth = firstWidth + restWidth;

  const startX = (width - totalWidth) / 2;
  const textY = 290 * scale;

  // Drop Cap Box
  ctx.fillStyle = primaryColor;
  ctx.fillRect(startX - 15*scale, textY - 95*scale, firstWidth + 30*scale, 110*scale);

  // Ornate border for drop cap box
  ctx.strokeStyle = gold;
  ctx.lineWidth = 4 * scale;
  ctx.strokeRect(startX - 15*scale, textY - 95*scale, firstWidth + 30*scale, 110*scale);
  ctx.lineWidth = 1 * scale;
  ctx.strokeRect(startX - 10*scale, textY - 90*scale, firstWidth + 20*scale, 100*scale);

  // Drop Cap Letter
  ctx.fillStyle = gold;
  ctx.font = `bold ${120 * scale}px "Georgia", serif`;
  ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = 10 * scale;
  ctx.shadowOffsetY = 5 * scale;
  ctx.fillText(firstLetter, startX, textY);

  // Rest of Name
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${80 * scale}px "Georgia", serif`;
  ctx.fillText(restOfName, startX + firstWidth, textY);

  // Decorative Line below title
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(width / 2 - 200 * scale, 340 * scale);
  ctx.quadraticCurveTo(width / 2, 360 * scale, width / 2 + 200 * scale, 340 * scale);
  ctx.strokeStyle = gold;
  ctx.lineWidth = 3 * scale;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(width / 2, 350 * scale, 6 * scale, 0, Math.PI * 2);
  ctx.fillStyle = secondaryColor;
  ctx.fill();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
  ctx.restore();

  // Description
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = `italic ${32 * scale}px "Georgia", serif`;
  ctx.fillStyle = '#dcdcdc';
  ctx.shadowBlur = 5 * scale;
  ctx.shadowOffsetY = 2 * scale;
  wrapText(ctx, description, width / 2, 390 * scale, width - 360 * scale, 45 * scale);

  // Footer / Stats Plaque
  const hasLanguage = language && language.trim() !== '';
  const hasStars = stars && stars.trim() !== '';
  const hasForks = forks && forks.trim() !== '';
  const hasSupportUrl = supportUrl && supportUrl.trim() !== '';

  if (hasLanguage || hasStars || hasForks || hasSupportUrl) {
    const footerY = height - 160 * scale;

    // Plaque Background
    ctx.fillStyle = 'rgba(10, 5, 0, 0.6)';
    roundRect(ctx, width / 2 - 380 * scale, footerY, 760 * scale, 60 * scale, 15 * scale);
    ctx.fill();
    ctx.strokeStyle = gold;
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    ctx.textBaseline = 'middle';
    ctx.font = `bold ${22 * scale}px "Georgia", serif`;

    if (hasLanguage) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#dddddd';
      ctx.fillText(`\u2694\uFE0F ${language.toUpperCase()}`, width / 2 - 340 * scale, footerY + 30 * scale);
    }

    if (hasStars || hasForks) {
      ctx.textAlign = 'center';
      ctx.fillStyle = gold;
      let centerText = '';
      if (hasStars && hasForks) centerText = `\u2605 ${stars}   \u2022   \u2382 ${forks}`;
      else if (hasStars) centerText = `\u2605 ${stars}`;
      else if (hasForks) centerText = `\u2382 ${forks}`;
      ctx.fillText(centerText, width / 2, footerY + 30 * scale);
    }

    if (hasSupportUrl) {
      ctx.textAlign = 'right';
      ctx.fillStyle = '#dddddd';
      ctx.fillText(`\u2712\uFE0F ${supportUrl}`, width / 2 + 340 * scale, footerY + 30 * scale);
    }
  }

  ctx.restore(); // Restore clip
  };
