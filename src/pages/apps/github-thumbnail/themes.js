// Helper: Wrap Text
const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
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

// Helper: Draw Pill
const drawPill = (ctx, x, y, text, color, scale) => {
    ctx.font = `bold ${20 * scale}px "JetBrains Mono"`;
    const padding = 20 * scale;
    const textWidth = ctx.measureText(text).width;
    const height = 40 * scale;
    const width = textWidth + (padding * 2);

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.2;
    ctx.roundRect(x, y - height/1.5, width, height, height/2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = color;
    ctx.fillText(text, x + padding, y);
};

export const themeRenderers = {
  modern: (ctx, width, height, scale, data) => {
    const { primaryColor, secondaryColor, repoOwner, repoName, description, language, stars, forks, supportUrl } = data;
    // Background Gradient Orb
    ctx.save();
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, primaryColor);
    gradient.addColorStop(1, secondaryColor);

    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.2, 400 * scale, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.filter = 'blur(100px)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.8, 300 * scale, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();

    // Content Container
    const padding = 80 * scale;

    // Repo Owner/Name
    ctx.fillStyle = primaryColor;
    ctx.font = `bold ${30 * scale}px "JetBrains Mono"`;
    ctx.fillText(`${repoOwner} /`, padding, padding + 20 * scale);

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${80 * scale}px "Inter", sans-serif`;
    ctx.fillText(repoName, padding, padding + 110 * scale);

    // Description
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `${32 * scale}px "Inter", sans-serif`;
    const maxWidth = width - (padding * 2);
    wrapText(ctx, description, padding, padding + 180 * scale, maxWidth, 45 * scale);

    // Bottom Bar (Stats & Lang)
    const bottomY = height - padding;

    // Language Pill
    drawPill(ctx, padding, bottomY - 20 * scale, language, primaryColor, scale);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = `${20 * scale}px "JetBrains Mono"`;
    let currentX = width - padding;

    if (supportUrl) {
        ctx.fillText(supportUrl, currentX, bottomY);
        currentX -= (ctx.measureText(supportUrl).width + 40 * scale);
    }

    // Stats
    ctx.font = `bold ${24 * scale}px "JetBrains Mono"`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    const statGap = 40 * scale;

    if (forks) {
        ctx.fillText(`${forks} Forks`, currentX, bottomY);
        currentX -= (ctx.measureText(`${forks} Forks`).width + statGap);
    }

    if (stars) {
        ctx.fillText(`${stars} Stars`, currentX, bottomY);
    }
  },
  brutalist: (ctx, width, height, scale, data) => {
    const { primaryColor, secondaryColor, repoOwner, repoName, description, language, stars, forks, supportUrl } = data;
    // Brutalist Header Bar
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, width, 20 * scale);

    const padding = 60 * scale;
    const borderW = 4 * scale;

    // Main Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = borderW;
    ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

    // Decorative Corners
    const cornerSize = 20 * scale;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(padding - borderW/2, padding - borderW/2, cornerSize, cornerSize); // TL
    ctx.fillRect(width - padding - cornerSize + borderW/2, padding - borderW/2, cornerSize, cornerSize); // TR
    ctx.fillRect(padding - borderW/2, height - padding - cornerSize + borderW/2, cornerSize, cornerSize); // BL
    ctx.fillRect(width - padding - cornerSize + borderW/2, height - padding - cornerSize + borderW/2, cornerSize, cornerSize); // BR

    // Content
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${40 * scale}px "Courier New", monospace`;
    ctx.fillText(`USER: ${repoOwner.toUpperCase()}`, padding + 40 * scale, padding + 80 * scale);

    ctx.fillStyle = primaryColor;
    ctx.font = `900 ${100 * scale}px "Impact", sans-serif`;
    ctx.fillText(repoName.toUpperCase(), padding + 35 * scale, padding + 200 * scale);

    ctx.fillStyle = '#ffffff';
    ctx.font = `${30 * scale}px "Courier New", monospace`;
    wrapText(ctx, description, padding + 40 * scale, padding + 300 * scale, width - padding * 3, 40 * scale);

    // Footer Info
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(padding, height - padding - 80 * scale, width - padding * 2, 80 * scale);

    ctx.fillStyle = '#000000';
    ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(`LANG: ${language.toUpperCase()}`, padding + 40 * scale, height - padding - 40 * scale);

    ctx.textAlign = 'right';
    let statsText = '';
    if (stars) statsText += `★ ${stars}  `;
    if (forks) statsText += `⑂ ${forks}`;

    const rightPadding = padding + 40 * scale;

    if (supportUrl) {
        ctx.font = `${24 * scale}px "Courier New", monospace`;
        ctx.fillText(supportUrl.toUpperCase(), width - rightPadding, height - padding - 40 * scale);

        const urlWidth = ctx.measureText(supportUrl.toUpperCase()).width;
        ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
        if (statsText) {
            ctx.fillText(statsText, width - rightPadding - urlWidth - 60 * scale, height - padding - 40 * scale);
        }
    } else {
        ctx.fillText(statsText, width - rightPadding, height - padding - 40 * scale);
    }
  },
  minimal: (ctx, width, height, scale, data) => {
    const { primaryColor, secondaryColor, repoOwner, repoName, description, language, stars, forks, supportUrl } = data;
    // Improved Minimal Glass

    // Background with subtle gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#e2e8f0'); // slate-200
    grad.addColorStop(1, '#f8fafc'); // slate-50
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Abstract shapes for background depth
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.3, 400 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.7, 300 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Glass Card
    const cardW = width * 0.85;
    const cardH = height * 0.7;
    const cardX = (width - cardW) / 2;
    const cardY = (height - cardH) / 2;
    const r = 30 * scale;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 60 * scale;
    ctx.shadowOffsetY = 30 * scale;

    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, r);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'; // More opaque, cleaner
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
    ctx.restore();

    // Content inside Card
    const innerPad = 80 * scale;
    const contentY = cardY + innerPad;

    ctx.textAlign = 'left';

    // Small Owner Label
    ctx.fillStyle = '#64748b'; // slate-500
    ctx.font = `600 ${24 * scale}px "Plus Jakarta Sans", "Inter", sans-serif`;
    ctx.fillText(repoOwner.toUpperCase(), cardX + innerPad, contentY);

    // Repo Name
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.font = `800 ${80 * scale}px "Plus Jakarta Sans", "Inter", sans-serif`;
    ctx.fillText(repoName, cardX + innerPad, contentY + 100 * scale);

    // Description
    ctx.fillStyle = '#334155'; // slate-700
    ctx.font = `500 ${32 * scale}px "Plus Jakarta Sans", "Inter", sans-serif`;
    wrapText(ctx, description, cardX + innerPad, contentY + 180 * scale, cardW - (innerPad * 2), 48 * scale);

    // Bottom Section inside card
    const bottomInnerY = cardY + cardH - innerPad + 20 * scale;

    // Stats Pills
    let currentX = cardX + innerPad;
    const pillH = 50 * scale;
    const pillPad = 30 * scale;

    const drawStatPill = (label, value, color) => {
        ctx.font = `bold ${20 * scale}px "Plus Jakarta Sans", sans-serif`;
        const text = `${value} ${label}`;
        const w = ctx.measureText(text).width + (pillPad * 2);

        ctx.fillStyle = color; // light bg
        ctx.beginPath();
        ctx.roundRect(currentX, bottomInnerY - pillH, w, pillH, pillH/2);
        ctx.fill();

        ctx.fillStyle = '#1e293b'; // Dark text
        ctx.fillText(text, currentX + pillPad, bottomInnerY - pillH/2 + 8 * scale); // vertical center adjustment

        currentX += w + 20 * scale;
    };

    // Language Pill (Special style)
    drawStatPill('• ' + language, '', 'rgba(0,0,0,0.05)');

    if (stars) drawStatPill('Stars', stars, 'rgba(255, 220, 0, 0.15)');
    if (forks) drawStatPill('Forks', forks, 'rgba(0, 0, 0, 0.05)');

    // URL
    if (supportUrl) {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#94a3b8'; // slate-400
        ctx.font = `${20 * scale}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(supportUrl, cardX + cardW - innerPad, bottomInnerY - 10 * scale);
    }
  },
  retro: (ctx, width, height, scale, data) => {
    const { primaryColor, repoOwner, repoName, description, language, stars, forks, supportUrl } = data;
    // Retro Terminal Style (Unchanged from previous implementation)
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, width, height);

    // Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    for (let i = 0; i < height; i += 4 * scale) {
        ctx.fillRect(0, i, width, 2 * scale);
    }

    // Glow effect
    ctx.shadowBlur = 10 * scale;
    ctx.shadowColor = primaryColor;

    const padding = 80 * scale;

    ctx.font = `${30 * scale}px "Courier New", monospace`;
    ctx.fillStyle = primaryColor;
    ctx.textAlign = 'left';
    ctx.fillText(`> git clone https://github.com/${repoOwner}/${repoName}.git`, padding, padding);

    ctx.font = `bold ${80 * scale}px "Courier New", monospace`;
    ctx.fillStyle = primaryColor;
    ctx.fillText(repoName, padding, padding + 120 * scale);

    ctx.font = `${30 * scale}px "Courier New", monospace`;
    ctx.fillStyle = primaryColor;
    wrapText(ctx, description, padding, padding + 200 * scale, width - (padding * 2), 40 * scale);

    const bottomY = height - padding;
    ctx.textAlign = 'left';
    ctx.font = `${24 * scale}px "Courier New", monospace`;

    let statsText = '';
    if (stars) statsText += `[ STARS: ${stars} ] `;
    if (forks) statsText += `[ FORKS: ${forks} ] `;
    statsText += `[ LANG: ${language.toUpperCase()} ]`;

    ctx.fillText(statsText, padding, bottomY);
    ctx.fillStyle = primaryColor;
    ctx.fillRect(padding + ctx.measureText(statsText).width + 10 * scale, bottomY - 24 * scale, 15 * scale, 30 * scale);

    if (supportUrl) {
        ctx.textAlign = 'right';
        ctx.fillText(supportUrl, width - padding, padding);
    }
  },
  blueprint: (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, stars, supportUrl } = data;
    // Improved Blueprint CAD Style
    const blueBg = '#004ecb'; // Deeper, more authentic blueprint blue
    ctx.fillStyle = blueBg;
    ctx.fillRect(0, 0, width, height);

    const padding = 60 * scale;

    // Grid (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1 * scale;
    const gridSize = 40 * scale;

    ctx.beginPath();
    for (let x = 0; x < width; x += gridSize) ctx.rect(x, 0, 1, height);
    for (let y = 0; y < height; y += gridSize) ctx.rect(0, y, width, 1);
    ctx.stroke();

    // Major Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    for (let x = 0; x < width; x += gridSize * 4) ctx.rect(x, 0, 1, height);
    for (let y = 0; y < height; y += gridSize * 4) ctx.rect(0, y, width, 1);
    ctx.stroke();

    // Main Frame
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 6 * scale;
    ctx.strokeRect(padding, padding, width - (padding * 2), height - (padding * 2));

    // Title Block (Bottom Left)
    const blockW = 500 * scale;
    const blockH = 180 * scale;
    const blockX = padding; // Move to left
    const blockY = height - padding - blockH;

    ctx.lineWidth = 3 * scale;
    ctx.fillStyle = 'white';
    ctx.strokeRect(blockX, blockY, blockW, blockH);

    // Internal lines of Title Block
    const rowH = blockH / 4;
    ctx.beginPath();
    for(let i=1; i<4; i++) {
        ctx.moveTo(blockX, blockY + (i*rowH));
        ctx.lineTo(blockX + blockW, blockY + (i*rowH));
    }
    ctx.moveTo(blockX + (blockW * 0.3), blockY);
    ctx.lineTo(blockX + (blockW * 0.3), blockY + blockH);
    ctx.stroke();

    // Text in Block
    ctx.font = `bold ${14 * scale}px "Courier New", monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const labels = ['PROJECT', 'AUTHOR', 'URL', 'STARS'];
    const values = [repoName.substring(0, 20).toUpperCase(), repoOwner.toUpperCase(), (supportUrl || '').toUpperCase(), stars || '0'];

    labels.forEach((label, i) => {
        ctx.fillText(label, blockX + 10 * scale, blockY + (i * rowH) + (rowH/2));
        ctx.fillText(values[i], blockX + (blockW * 0.3) + 10 * scale, blockY + (i * rowH) + (rowH/2));
    });

    // Main Drawing Area Content
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Center Lines
    ctx.setLineDash([20 * scale, 10 * scale, 5 * scale, 10 * scale]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(width/2, padding); ctx.lineTo(width/2, height - padding); // Vert
    ctx.moveTo(padding, height/2); ctx.lineTo(width - padding, height/2); // Horiz
    ctx.stroke();
    ctx.setLineDash([]);

    // Project Name (Main) - Moved Up
    ctx.font = `bold ${100 * scale}px "Courier New", monospace`;
    ctx.fillStyle = 'white';
    ctx.fillText(repoName.toUpperCase(), width/2, height/2 - 80 * scale);

    // Measurement Lines
    const textW = ctx.measureText(repoName.toUpperCase()).width;
    const lineY = height/2; // adjusted

    ctx.beginPath();
    ctx.moveTo(width/2 - textW/2, lineY);
    ctx.lineTo(width/2 + textW/2, lineY);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    // Arrows
    ctx.beginPath();
    ctx.moveTo(width/2 - textW/2 + 20*scale, lineY - 10*scale); ctx.lineTo(width/2 - textW/2, lineY); ctx.lineTo(width/2 - textW/2 + 20*scale, lineY + 10*scale);
    ctx.moveTo(width/2 + textW/2 - 20*scale, lineY - 10*scale); ctx.lineTo(width/2 + textW/2, lineY); ctx.lineTo(width/2 + textW/2 - 20*scale, lineY + 10*scale);
    ctx.fill();

    // Description - Bottom Right
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `${24 * scale}px "Courier New", monospace`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

    const descX = width/2 + 40 * scale;
    const descY = height/2 + 40 * scale;
    const descW = width/2 - padding - 80 * scale;

    // Label for description
    ctx.fillText("NOTES:", descX, descY);

    // Wrap text below "NOTES:"
    wrapText(ctx, description.toUpperCase(), descX, descY + 40 * scale, descW, 35 * scale);
  },
  neon: (ctx, width, height, scale, data) => {
    const { primaryColor, secondaryColor, repoName, description, language, stars, forks, supportUrl } = data;
    // Neon Cyber Style (Unchanged)
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 10 * scale;
    ctx.beginPath();
    for(let i = -height; i < width; i+= 40 * scale) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i + height, height);
    }
    ctx.stroke();
    ctx.restore();

    const padding = 80 * scale;

    ctx.shadowBlur = 20 * scale;
    ctx.shadowColor = secondaryColor;
    ctx.fillStyle = secondaryColor;

    ctx.font = `900 ${100 * scale}px "Arial Black", sans-serif`;
    ctx.textAlign = 'left';

    ctx.fillStyle = 'red';
    ctx.fillText(repoName.toUpperCase(), padding - 4 * scale, padding + 100 * scale);
    ctx.fillStyle = 'cyan';
    ctx.fillText(repoName.toUpperCase(), padding + 4 * scale, padding + 100 * scale);

    ctx.fillStyle = 'white';
    ctx.shadowBlur = 30 * scale;
    ctx.shadowColor = primaryColor;
    ctx.fillText(repoName.toUpperCase(), padding, padding + 100 * scale);

    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 4 * scale;
    ctx.beginPath();
    ctx.moveTo(padding, padding + 140 * scale);
    ctx.lineTo(width - padding, padding + 140 * scale);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = `${30 * scale}px "Courier New", monospace`;
    wrapText(ctx, description, padding, padding + 220 * scale, width - (padding * 2), 40 * scale);

    const bottomY = height - padding;

    const drawNeonBox = (text, x, color) => {
        ctx.shadowBlur = 10 * scale;
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 * scale;

        const w = ctx.measureText(text).width + 40 * scale;
        const h = 50 * scale;

        ctx.strokeRect(x, bottomY - h, w, h);

        ctx.fillStyle = color;
        ctx.fillText(text, x + 20 * scale, bottomY - 15 * scale);
        return w + 20 * scale;
    };

    ctx.font = `bold ${24 * scale}px "Courier New", monospace`;
    let currentX = padding;

    currentX += drawNeonBox(language.toUpperCase(), currentX, primaryColor);
    if (stars) currentX += drawNeonBox(`${stars} ★`, currentX, secondaryColor);
    if (forks) drawNeonBox(`${forks} ⑂`, currentX, secondaryColor);

    if (supportUrl) {
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.shadowBlur = 10 * scale;
        ctx.shadowColor = 'white';
        ctx.fillText(supportUrl, width - padding, bottomY - 15 * scale);
    }
  },
  swiss: (ctx, width, height, scale, data) => {
    const { primaryColor, repoOwner, repoName, description, language, stars, forks, supportUrl } = data;
    // SWISS GRID Style
    ctx.fillStyle = '#f1f1f1'; // Off-white background
    ctx.fillRect(0, 0, width, height);

    // Bold Asymmetry
    const col1 = width * 0.22;

    // Left Column (Color Block)
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, col1, height);

    // Grid Lines
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(col1, 0); ctx.lineTo(col1, height); // Vertical split

    const row1 = height * 0.25;
    const row2 = height * 0.75;

    ctx.moveTo(col1, row1); ctx.lineTo(width, row1); // Top horizontal
    ctx.moveTo(col1, row2); ctx.lineTo(width, row2); // Bottom horizontal
    ctx.stroke();

    // Typography - Helvetica style (Arial/Inter fallback)
    const fontStack = '"Helvetica Neue", "Arial", sans-serif';
    const padding = 40 * scale;

    // 1. Top Right: Project Info
    ctx.fillStyle = '#000';
    ctx.font = `bold ${30 * scale}px ${fontStack}`;
    ctx.textAlign = 'left';
    ctx.fillText(repoOwner.toUpperCase(), col1 + padding, row1 - padding - 30 * scale);

    // 2. Center Right: Description & Name
    // Repo Name huge
    ctx.fillStyle = '#000';
    ctx.font = `900 ${100 * scale}px ${fontStack}`;
    ctx.fillText(repoName, col1 + padding, row1 + 120 * scale);

    // Description
    ctx.font = `normal ${32 * scale}px ${fontStack}`;
    wrapText(ctx, description, col1 + padding, row1 + 200 * scale, width - col1 - (padding * 2), 40 * scale);

    // 3. Bottom Right: Stats
    ctx.font = `bold ${24 * scale}px ${fontStack}`;
    let statX = col1 + padding;
    const statY = row2 + 60 * scale;

    if (stars) {
            ctx.fillText(`★ ${stars}`, statX, statY);
            statX += 150 * scale;
    }
    if (forks) {
        ctx.fillText(`⑂ ${forks}`, statX, statY);
            statX += 150 * scale;
    }
    ctx.fillText(language.toUpperCase(), statX, statY);

    // 4. Left Column: Vertical Text or Graphic
    ctx.save();
    ctx.translate(col1 / 2, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.font = `900 ${100 * scale}px ${fontStack}`;
    ctx.fillText("GIT", 0, 35 * scale);
    ctx.restore();

    if (supportUrl) {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = `normal ${20 * scale}px ${fontStack}`;
        ctx.fillText(supportUrl, width - padding, height - padding);
    }
  },
  japanese: (ctx, width, height, scale, data) => {
    const { primaryColor, secondaryColor, repoOwner, repoName, language, stars, forks, supportUrl } = data;
    // JAPANESE POP Style

    // Dynamic background pattern (Halftone / Stripes)                    ctx.fillStyle = secondaryColor; // Bg base
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(0, 0, width, height);

    // Sunburst or Stripes
    ctx.save();
    ctx.translate(width/2, height/2);
    ctx.fillStyle = primaryColor;
    for (let i = 0; i < 12; i++) {
            ctx.rotate(Math.PI / 6);
            ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();

    // Center Circle (Sun)
    ctx.beginPath();
    ctx.arc(width/2, height/2, 300 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Repo Name (Bold, Stroke)
    ctx.font = `900 ${120 * scale}px "Arial Black", sans-serif`;
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 8 * scale;

    ctx.strokeText(repoName.toUpperCase(), width/2, height/2);
    ctx.fillText(repoName.toUpperCase(), width/2, height/2);

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
        ctx.translate(width/2, height - 60 * scale);
        ctx.rotate(-0.05);
        ctx.fillStyle = '#000';
        ctx.fillRect(-200 * scale, -30 * scale, 400 * scale, 60 * scale);
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${24 * scale}px ${fontStack}`;
        ctx.fillText(supportUrl, 0, 0);
        ctx.restore();
    }
  },
  gameboy: (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars, forks, supportUrl } = data;
    // RETRO HANDHELD (Game Boy)
    const gbGreens = ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'];
    ctx.fillStyle = gbGreens[3]; // Lightest green bg
    ctx.fillRect(0, 0, width, height);

    // Pixel Grid effect
    ctx.fillStyle = 'rgba(15, 56, 15, 0.1)';
    for(let x=0; x<width; x+=4*scale) {
            ctx.fillRect(x, 0, 1, height);
    }
    for(let y=0; y<height; y+=4*scale) {
            ctx.fillRect(0, y, width, 1);
    }

    const padding = 60 * scale;

    // Top Header
    ctx.fillStyle = gbGreens[0]; // Darkest green
    ctx.fillRect(0, 0, width, 50 * scale);

    ctx.fillStyle = gbGreens[3];
    ctx.font = `bold ${24 * scale}px "Courier New", monospace`;
    ctx.textAlign = 'left';
    ctx.fillText("NINTENDO-ISH // GITHUB CART", padding, 35 * scale);

    ctx.textAlign = 'right';
    ctx.fillText("BATTERY [||||]", width - padding, 35 * scale);

    // Content
    ctx.textAlign = 'center';
    ctx.fillStyle = gbGreens[0];

    // 8-bit Font emulation using standard bold serif or courier
    ctx.font = `900 ${80 * scale}px "Courier New", monospace`;
    ctx.fillText(repoName.toUpperCase(), width/2, height/3);

    ctx.fillStyle = gbGreens[1];
    ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
    ctx.fillText(repoOwner.toUpperCase(), width/2, height/3 - 80 * scale);

    // Description Box
    ctx.fillStyle = gbGreens[2];
    ctx.fillRect(padding, height/2 - 20 * scale, width - (padding*2), 150 * scale);

    ctx.fillStyle = gbGreens[0];
    ctx.textAlign = 'center';
    ctx.font = `bold ${24 * scale}px "Courier New", monospace`;
    wrapText(ctx, description.toUpperCase(), width/2, height/2 + 20 * scale, width - (padding*3), 30 * scale);

    // Bottom Stats
    ctx.fillStyle = gbGreens[0];
    ctx.textAlign = 'left';

    const bottomY = height - 60 * scale;
    let statsStr = `LANG: ${language.toUpperCase()}`;
    if (stars) statsStr += `  STARS: ${stars}`;
    if (forks) statsStr += `  FORKS: ${forks}`;

    ctx.fillText(statsStr, padding, bottomY);

    if (supportUrl) {
        ctx.textAlign = 'right';
        ctx.fillText(supportUrl.toUpperCase(), width - padding, bottomY);
    }
  },
  vaporwave: (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description } = data;
    // VAPORWAVE AESTHETIC
    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#ff71ce'); // Neon Pink
    grad.addColorStop(0.5, '#01cdfe'); // Neon Blue
    grad.addColorStop(1, '#05ffa1'); // Neon Green
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Grid Floor
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2 * scale;

    const horizon = height * 0.6;
    const centerX = width / 2;

    // Perspective Lines
    for(let i=-20; i<=20; i++) {
        ctx.moveTo(centerX + (i * 100 * scale), height);
        ctx.lineTo(centerX, horizon);
    }

    // Horizontal Lines
    for(let i=0; i<10; i++) {
        const y = horizon + (Math.pow(i, 2) * 5 * scale);
        if (y > height) break;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Sun
    ctx.fillStyle = '#ffb900';
    ctx.beginPath();
    ctx.arc(centerX, horizon - 100 * scale, 150 * scale, 0, Math.PI, true);
    ctx.fill();

    // Sun stripes
    ctx.fillStyle = '#ff71ce'; // Match top bg roughly or pink
    for(let i=0; i<5; i++) {
            ctx.fillRect(centerX - 160*scale, horizon - 100*scale - (i*20*scale), 320*scale, 5*scale);
    }
    ctx.restore();

    // Text
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 5 * scale;
    ctx.shadowOffsetY = 5 * scale;

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    // Wide Text function
    const toFullWidth = (str) => str.split('').join(' ');

    ctx.font = `900 ${80 * scale}px "Times New Roman", serif`;
    ctx.fillText(toFullWidth(repoName.toUpperCase()), width/2, height * 0.4);

    ctx.font = `italic 400 ${30 * scale}px "Times New Roman", serif`;
    ctx.fillText(toFullWidth(repoOwner.toUpperCase()), width/2, height * 0.25);

    // Japanese Text Embellishment
    ctx.fillStyle = '#01cdfe';
    ctx.font = `bold ${60 * scale}px "Arial", sans-serif`;
    ctx.fillText("リサフランク420", width * 0.15, height * 0.8);
    ctx.fillText("現代のコンピューティング", width * 0.85, height * 0.8);

    // Description Box
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(width * 0.2, height * 0.85, width * 0.6, 80 * scale);

    ctx.fillStyle = 'white';
    ctx.font = `${20 * scale}px "Courier New", monospace`;
    ctx.fillText(description.substring(0, 60).toUpperCase(), width/2, height * 0.9);
  },
  noir: (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars, supportUrl } = data;
    // NOIR CINEMA Style

    // Grainy B&W Background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);

    // Spotlight effect
    const grad = ctx.createRadialGradient(width*0.3, height*0.3, 100*scale, width*0.5, height*0.5, 800*scale);
    grad.addColorStop(0, '#444');
    grad.addColorStop(1, '#000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Noise
    // (Simulated with simple dots for performance)
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for(let i=0; i<5000; i++) {
        ctx.fillRect(Math.random()*width, Math.random()*height, 2*scale, 2*scale);
    }

    const padding = 100 * scale;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#eee';

    // Serif Typography
    const serifFont = '"Georgia", "Times New Roman", serif';

    ctx.font = `italic 400 ${40 * scale}px ${serifFont}`;
    ctx.fillText('The ' + repoOwner + ' Files', padding, padding);

    ctx.font = `900 ${120 * scale}px ${serifFont}`;
    ctx.shadowColor = 'rgba(255,255,255,0.2)';
    ctx.shadowBlur = 20 * scale;
    ctx.fillText(repoName, padding, height/2 - 20 * scale);
    ctx.shadowBlur = 0;

    // Line
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(padding, height/2 + 20 * scale);
    ctx.lineTo(width - padding, height/2 + 20 * scale);
    ctx.stroke();

    ctx.font = `400 ${32 * scale}px ${serifFont}`;
    wrapText(ctx, description, padding, height/2 + 80 * scale, width * 0.6, 45 * scale);

    // Stamp style stats
    ctx.save();
    ctx.translate(width - 200 * scale, height - 200 * scale);
    ctx.rotate(-0.2);
    ctx.strokeStyle = '#d4d4d4';
    ctx.lineWidth = 5 * scale;
    ctx.strokeRect(-150 * scale, -80 * scale, 300 * scale, 160 * scale);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#d4d4d4';
    ctx.font = `900 ${40 * scale}px "Courier New", monospace`;
    ctx.fillText("CLASSIFIED", 0, -20 * scale);

    ctx.font = `bold ${20 * scale}px "Courier New", monospace`;
    ctx.fillText(`STARS: ${stars || '0'}`, 0, 20 * scale);
    ctx.fillText(`LANG: ${language.toUpperCase()}`, 0, 50 * scale);
    ctx.restore();

    if (supportUrl) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#666';
        ctx.font = `italic ${20 * scale}px ${serifFont}`;
        ctx.fillText(supportUrl, padding, height - padding/2);
    }
  },
  clay: (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars, forks, supportUrl } = data;
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
    drawClayRect(padding, padding, width - padding*2, height - padding*2, 60 * scale);

    // Content
    ctx.textAlign = 'center';
    ctx.fillStyle = '#334e68'; // Dark blue-grey text

    // Round Font
    const roundFont = '"Nunito", "Quicksand", "Arial Rounded MT Bold", sans-serif';

    ctx.font = `800 ${90 * scale}px ${roundFont}`;
    ctx.fillText(repoName, width/2, height * 0.35);

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
    wrapText(ctx, description, width/2, height * 0.55, width * 0.7, 45 * scale);

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
            ctx.roundRect(x - pillW/2, pillY, pillW, pillH, 40 * scale);
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.font = `bold ${24 * scale}px ${roundFont}`;
            ctx.fillText(text, x, pillY + pillH/2 + 8*scale);
            ctx.restore();
    };

    let pillX = width / 2;
    if (stars) {
        drawClayPill(pillX - 250*scale, `${stars} ★`, '#f6ad55'); // Orange
    }
    drawClayPill(pillX, language, '#63b3ed'); // Blue
    if (forks) {
        drawClayPill(pillX + 250*scale, `${forks} ⑂`, '#68d391'); // Green
    }
  },
  prismatic: (ctx, width, height, scale, data) => {
    const { primaryColor, secondaryColor, bgColor, repoOwner, repoName, description, language, stars, forks, supportUrl } = data;
    // PRISMATIC HAZE Style

    // Deep Dark Background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // 1. Vibrant Gradient Mesh / Orbs
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const drawOrb = (x, y, r, color) => {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    };

    drawOrb(width * 0.2, height * 0.3, 600 * scale, primaryColor);
    drawOrb(width * 0.8, height * 0.7, 500 * scale, secondaryColor);
    drawOrb(width * 0.5, height * 0.5, 400 * scale, bgColor); // Center highlight

    ctx.restore();

    // 2. Fine Grain Noise
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    for(let i=0; i<8000; i++) {
            ctx.fillRect(Math.random()*width, Math.random()*height, 2*scale, 2*scale);
    }
    ctx.restore();

    // 3. Glass Card Container
    const cardW = width * 0.85;
    const cardH = height * 0.65;
    const cardX = (width - cardW) / 2;
    const cardY = (height - cardH) / 2;
    const r = 40 * scale;

    ctx.save();
    // Glass Fill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, r);
    ctx.fill();

    // Glass Border
    const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
    borderGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
    borderGrad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
    borderGrad.addColorStop(1, 'rgba(255,255,255,0.4)');

    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    // Inner Glow
    ctx.shadowColor = 'rgba(255,255,255,0.2)';
    ctx.shadowBlur = 30 * scale;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    // 4. Content
    const contentPad = 80 * scale;

    // Elegant Typography
    const elegantFont = '"Playfair Display", "Times New Roman", serif';
    const cleanFont = '"Inter", "Helvetica Neue", sans-serif';

    // Repo Name (Big & Elegant)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = `italic 900 ${90 * scale}px ${elegantFont}`;
    ctx.fillText(repoName, width/2, height * 0.42);

    // Owner (Small & Clean)
    ctx.font = `300 ${24 * scale}px ${cleanFont}`;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.letterSpacing = '4px'; // Canvas doesn't support this directly easily without manual spacing, but standard fonts might handle it okay-ish or we ignore.
    ctx.fillText(`—  ${repoOwner.toUpperCase()}  —`, width/2, height * 0.52);

    // Description
    ctx.font = `400 ${28 * scale}px ${cleanFont}`;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    wrapText(ctx, description, width/2, height * 0.58, cardW - (contentPad*2), 40 * scale);

    // Bottom details
    const bottomY = cardY + cardH - 40 * scale;

    ctx.font = `600 ${20 * scale}px ${cleanFont}`;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';

    const details = [];
    if (language) details.push(language.toUpperCase());
    if (stars) details.push(`${stars} ★`);
    if (forks) details.push(`${forks} ⑂`);

    ctx.fillText(details.join('   •   '), width/2, bottomY - 30 * scale);

    if (supportUrl) {
            ctx.font = `italic 400 ${18 * scale}px ${elegantFont}`;
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillText(supportUrl, width/2, bottomY);
    }
  },
  cyberpunk: (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars, forks } = data;
    // CYBERPUNK_2077
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // Glitch lines background
    ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
    for(let i=0; i<height; i+=4*scale) {
            if (Math.random() > 0.9) ctx.fillRect(0, i, width, 2*scale);
    }

    const padding = 60 * scale;

    // Yellow Frame
    ctx.strokeStyle = '#FCEE0A';
    ctx.lineWidth = 10 * scale;
    ctx.strokeRect(padding, padding, width - padding*2, height - padding*2);

    // Corner Decorations
    ctx.fillStyle = '#FCEE0A';
    ctx.fillRect(padding, padding, 100 * scale, 100 * scale);
    ctx.fillRect(width - padding - 100 * scale, height - padding - 100 * scale, 100 * scale, 100 * scale);

    // Text
    ctx.font = `900 ${110 * scale}px "Arial Black", sans-serif`;
    ctx.fillStyle = '#00F0FF';
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = -5 * scale;
    ctx.shadowOffsetY = 0;
    ctx.fillText(repoName.toUpperCase(), padding + 40 * scale, height/2 - 20 * scale);

    ctx.fillStyle = '#FCEE0A';
    ctx.shadowOffsetX = 5 * scale;
    ctx.fillText(repoName.toUpperCase(), padding + 40 * scale, height/2 - 20 * scale);

    ctx.fillStyle = '#fff';
    ctx.shadowOffsetX = 0;
    ctx.fillText(repoName.toUpperCase(), padding + 40 * scale, height/2 - 20 * scale);

    // Subtext
    ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
    ctx.fillStyle = '#FCEE0A';
    ctx.fillText(`STATUS: ${repoOwner.toUpperCase()}`, padding + 40 * scale, height/2 - 140 * scale);

    // Description
    ctx.fillStyle = '#00F0FF';
    ctx.font = `bold ${30 * scale}px "Courier New", monospace`;
    wrapText(ctx, description, padding + 40 * scale, height/2 + 60 * scale, width * 0.7, 40 * scale);

    // Bottom Bar
    ctx.fillStyle = '#00F0FF';
    ctx.fillRect(padding + 120 * scale, height - padding - 80 * scale, width - padding*2 - 240 * scale, 60 * scale);

    ctx.fillStyle = '#000';
    ctx.textAlign = 'right';
    ctx.font = `bold ${30 * scale}px "Arial Black", sans-serif`;
    let statsStr = '';
    if (stars) statsStr += `STARS: ${stars}   `;
    if (forks) statsStr += `FORKS: ${forks}   `;
    statsStr += `LANG: ${language.toUpperCase()}`;
    ctx.fillText(statsStr, width - padding - 140 * scale, height - padding - 40 * scale);
  },
  sketch: (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars, forks } = data;
    // HAND_DRAWN Sketch
    ctx.fillStyle = '#fffdf0'; // Cream paper
    ctx.fillRect(0, 0, width, height);

    // Paper Texture (Noise)
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = '#000';
    for(let i=0; i<width; i+=4*scale) {
            for(let j=0; j<height; j+=4*scale) {
                if (Math.random() > 0.5) ctx.fillRect(i, j, 2*scale, 2*scale);
            }
    }
    ctx.restore();

    const padding = 80 * scale;

    // Scribble Border
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 3 * scale;
    ctx.lineCap = 'round';
    ctx.beginPath();
    // Rough rectangle
    const roughRect = (x, y, w, h) => {
        ctx.moveTo(x + Math.random()*10, y + Math.random()*10);
        ctx.lineTo(x + w - Math.random()*10, y - Math.random()*5);
        ctx.lineTo(x + w + Math.random()*5, y + h - Math.random()*10);
        ctx.lineTo(x - Math.random()*5, y + h + Math.random()*5);
        ctx.closePath();
    };
    roughRect(padding, padding, width - padding*2, height - padding*2);
    ctx.stroke();

    // Second pass for "sketchy" look
    ctx.strokeStyle = '#444';
    ctx.beginPath();
    roughRect(padding + 2*scale, padding + 2*scale, width - padding*2 - 5*scale, height - padding*2 - 5*scale);
    ctx.stroke();

    // Title
    ctx.fillStyle = '#222';
    ctx.font = `900 ${90 * scale}px "Segoe Print", "Comic Sans MS", "Chalkboard SE", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(repoName, width/2, height * 0.4);

    // Underline scribble
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.42);
    ctx.bezierCurveTo(width*0.4, height*0.44, width*0.6, height*0.41, width*0.7, height*0.43);
    ctx.stroke();

    // Owner
    ctx.font = `bold ${30 * scale}px "Segoe Print", "Comic Sans MS", "Chalkboard SE", sans-serif`;
    ctx.fillText(`by ${repoOwner}`, width/2, height * 0.25);

    // Description
    ctx.font = `normal ${30 * scale}px "Segoe Print", "Comic Sans MS", "Chalkboard SE", sans-serif`;
    wrapText(ctx, description, width/2, height * 0.55, width * 0.7, 45 * scale);

    // Stick figure stats? Or just text
    ctx.font = `bold ${24 * scale}px "Segoe Print", "Comic Sans MS", "Chalkboard SE", sans-serif`;
    let statsStr = language;
    if (stars) statsStr += `  |  * ${stars}`;
    if (forks) statsStr += `  |  Y ${forks}`;
    ctx.fillText(statsStr, width/2, height - padding - 20 * scale);
  },
  bauhaus: (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, language, stars } = data;
    // BAUHAUS_GEO
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    // Geometric Composition
    ctx.fillStyle = '#D93025'; // Red
    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.3, 150 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F4B400'; // Yellow
    ctx.fillRect(width * 0.6, height * 0.1, 400 * scale, 200 * scale);

    ctx.fillStyle = '#1A73E8'; // Blue
    ctx.beginPath();
    ctx.moveTo(width * 0.8, height);
    ctx.lineTo(width, height * 0.6);
    ctx.lineTo(width, height);
    ctx.fill();

    // Diagonal Black Bar
    ctx.fillStyle = '#000';
    ctx.save();
    ctx.translate(width/2, height/2);
    ctx.rotate(-Math.PI / 12);
    ctx.fillRect(-width, 0, width*2, 20 * scale);
    ctx.restore();

    const font = '"Futura", "Helvetica Neue", "Arial", sans-serif';

    // Typography
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.font = `900 ${120 * scale}px ${font}`;
    ctx.fillText(repoName, 60 * scale, height * 0.65);

    ctx.font = `bold ${40 * scale}px ${font}`;
    ctx.fillText(repoOwner.toUpperCase(), 60 * scale, height * 0.5);

    // Description in a block
    ctx.fillStyle = '#333';
    ctx.font = `normal ${30 * scale}px ${font}`;
    wrapText(ctx, description, 60 * scale, height * 0.75, width * 0.6, 40 * scale);

    // Side stats vertical
    ctx.save();
    ctx.translate(width - 60 * scale, 60 * scale);
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = 'left';
    ctx.font = `bold ${24 * scale}px ${font}`;
    ctx.fillText(`${language.toUpperCase()}  //  STARS: ${stars || 0}`, 0, 0);
    ctx.restore();
  },
  popart: (ctx, width, height, scale, data) => {
    const { repoOwner, repoName, description, stars } = data;
    // POP_ART_COMIC
    ctx.fillStyle = '#FFE600'; // Bright Yellow
    ctx.fillRect(0, 0, width, height);

    // Halftone Pattern (Red dots)
    ctx.fillStyle = '#FF0000';
    const dotSize = 4 * scale;
    const spacing = 12 * scale;
    for(let x=0; x<width; x+=spacing) {
            for(let y=0; y<height; y+=spacing) {
                ctx.beginPath();
                ctx.arc(x, y, dotSize, 0, Math.PI*2);
                ctx.fill();
            }
    }

    // Burst Background
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    const cx = width * 0.7;
    const cy = height * 0.4;
    const outerR = 500 * scale;
    const innerR = 300 * scale;
    const spikes = 20;
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.moveTo(cx, cy - outerR);
    for(let i=0; i<spikes; i++) {
        x = cx + Math.cos(rot) * outerR;
        y = cy + Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
    ctx.lineWidth = 10 * scale;
    ctx.strokeStyle = '#000';
    ctx.stroke();
    ctx.fill();

    // Text
    ctx.textAlign = 'left';
    ctx.fillStyle = '#000';
    ctx.font = `900 ${100 * scale}px "Comic Sans MS", "Impact", sans-serif`;

    // Shadow effect
    ctx.fillStyle = '#000';
    ctx.fillText(repoName.toUpperCase(), 80 * scale, height - 120 * scale);
    ctx.fillStyle = '#0099ff';
    ctx.fillText(repoName.toUpperCase(), 70 * scale, height - 130 * scale);

    // Speech Bubble for description
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    const bx = 100 * scale;
    const by = 100 * scale;
    const bw = 500 * scale;
    const bh = 200 * scale;
    ctx.roundRect(bx, by, bw, bh, 20 * scale);
    ctx.fill();
    ctx.stroke();

    // Triangle tail
    ctx.beginPath();
    ctx.moveTo(bx + 100 * scale, by + bh);
    ctx.lineTo(bx + 120 * scale, by + bh + 40 * scale);
    ctx.lineTo(bx + 180 * scale, by + bh);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.font = `bold ${24 * scale}px "Comic Sans MS", sans-serif`;
    wrapText(ctx, description.toUpperCase(), bx + 20 * scale, by + 50 * scale, bw - 40 * scale, 30 * scale);

    // Corner label
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 200 * scale, 60 * scale);
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${30 * scale}px sans-serif`;
    ctx.fillText(repoOwner.toUpperCase(), 20 * scale, 40 * scale);

    // Stats Box
    ctx.fillStyle = '#000';
    ctx.fillRect(width - 300 * scale, height - 80 * scale, 300 * scale, 80 * scale);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = `bold ${30 * scale}px sans-serif`;
    ctx.fillText(`${stars || '0'} STARS!`, width - 150 * scale, height - 30 * scale);
  }
};
