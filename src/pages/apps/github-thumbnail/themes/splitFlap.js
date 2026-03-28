import { wrapText } from '../utils';

export const splitFlap = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    secondaryColor,
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
    supportUrl,
    bgColor,
    showPattern,
  } = data;

  // Board background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Outer frame — thick metallic border
  const frameW = 16 * scale;
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 0, width, frameW);
  ctx.fillRect(0, height - frameW, width, frameW);
  ctx.fillRect(0, 0, frameW, height);
  ctx.fillRect(width - frameW, 0, frameW, height);

  // Inner bevel
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(frameW, frameW, width - frameW * 2, 4 * scale);
  ctx.fillRect(frameW, height - frameW - 4 * scale, width - frameW * 2, 4 * scale);

  // Screw holes in corners
  const drawScrew = (x, y) => {
    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.arc(x, y, 6 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(x - 3 * scale, y - 3 * scale);
    ctx.lineTo(x + 3 * scale, y + 3 * scale);
    ctx.stroke();
  };
  const screwInset = 24 * scale;
  drawScrew(screwInset, screwInset);
  drawScrew(width - screwInset, screwInset);
  drawScrew(screwInset, height - screwInset);
  drawScrew(width - screwInset, height - screwInset);

  // Rivet pattern on top/bottom rail (if showPattern)
  if (showPattern) {
    ctx.fillStyle = '#444';
    for (let i = 0; i < 20; i++) {
      const rx = frameW + 50 * scale + i * ((width - frameW * 2 - 100 * scale) / 19);
      ctx.beginPath();
      ctx.arc(rx, frameW / 2, 2.5 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(rx, height - frameW / 2, 2.5 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const padding = 50 * scale;
  const contentX = frameW + padding;
  const contentY = frameW + padding;
  const contentW = width - (frameW + padding) * 2;

  // --- Helper: draw a single flap cell ---
  const drawFlapCell = (x, y, char, cellW, cellH, color) => {
    const r = 4 * scale;

    // Cell background
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.roundRect(x, y, cellW, cellH, r);
    ctx.fill();

    // Top half (slightly lighter)
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, cellW, cellH / 2);
    ctx.clip();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.roundRect(x, y, cellW, cellH, r);
    ctx.fill();
    ctx.restore();

    // Split line (the mechanical gap)
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(x, y + cellH / 2 - 1 * scale, cellW, 2 * scale);

    // Subtle inner shadow at top
    const innerShadow = ctx.createLinearGradient(x, y, x, y + 8 * scale);
    innerShadow.addColorStop(0, 'rgba(0,0,0,0.4)');
    innerShadow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = innerShadow;
    ctx.fillRect(x + 1, y + 1, cellW - 2, 8 * scale);

    // Character
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, x + cellW / 2, y + cellH / 2 + 1 * scale);
  };

  // --- Helper: draw a row of flap cells for text ---
  const drawFlapRow = (x, y, text, cellW, cellH, gap, color, maxCells) => {
    const chars = text.toUpperCase().split('');
    const totalCells = maxCells || chars.length;
    for (let i = 0; i < totalCells; i++) {
      const char = i < chars.length ? chars[i] : ' ';
      drawFlapCell(x + i * (cellW + gap), y, char, cellW, cellH, color);
    }
  };

  // --- HEADER: Station-style label ---
  ctx.fillStyle = primaryColor;
  ctx.font = `bold ${14 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('REPOSITORY', contentX, contentY);

  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText('OPEN SOURCE DEPARTURES', contentX + 200 * scale, contentY);

  // --- ROW 1: Repo name in large flap cells ---
  const nameY = contentY + 28 * scale;
  const nameCellW = 62 * scale;
  const nameCellH = 80 * scale;
  const nameGap = 4 * scale;
  const maxNameCells = Math.min(repoName.length, Math.floor(contentW / (nameCellW + nameGap)));

  ctx.font = `bold ${52 * scale}px "JetBrains Mono"`;
  drawFlapRow(contentX, nameY, repoName, nameCellW, nameCellH, nameGap, primaryColor, maxNameCells);

  // --- ROW 2: Owner in smaller cells ---
  const ownerY = nameY + nameCellH + 16 * scale;
  const ownerCellW = 28 * scale;
  const ownerCellH = 36 * scale;
  const ownerGap = 3 * scale;

  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `bold ${11 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('MAINTAINER', contentX, ownerY - 14 * scale);

  ctx.font = `bold ${22 * scale}px "JetBrains Mono"`;
  const ownerDisplay = repoOwner;
  drawFlapRow(contentX, ownerY, ownerDisplay, ownerCellW, ownerCellH, ownerGap, '#e0e0e0', ownerDisplay.length);

  // --- ROW 3: Description in small flap cells ---
  const descY = ownerY + ownerCellH + 24 * scale;
  const descCellW = 22 * scale;
  const descCellH = 30 * scale;
  const descGap = 2 * scale;
  const descMaxPerRow = Math.floor(contentW / (descCellW + descGap));

  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `bold ${11 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('INFO', contentX, descY - 14 * scale);

  ctx.font = `bold ${16 * scale}px "JetBrains Mono"`;
  const descUpper = description.toUpperCase();
  const descRows = Math.ceil(descUpper.length / descMaxPerRow);
  const maxRows = 2;
  for (let row = 0; row < Math.min(descRows, maxRows); row++) {
    const slice = descUpper.substring(row * descMaxPerRow, (row + 1) * descMaxPerRow);
    drawFlapRow(contentX, descY + row * (descCellH + 4 * scale), slice, descCellW, descCellH, descGap, 'rgba(255,255,255,0.7)', slice.length);
  }

  // --- BOTTOM: Info row like a departure board ---
  const bottomRowY = height - frameW - padding - 48 * scale;
  const infoCellW = 28 * scale;
  const infoCellH = 36 * scale;
  const infoGap = 3 * scale;

  // Divider line
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(contentX, bottomRowY - 20 * scale, contentW, 1 * scale);

  // Column labels
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.font = `bold ${11 * scale}px "JetBrains Mono"`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  let colX = contentX;

  // LANG column
  ctx.fillText('LANG', colX, bottomRowY - 16 * scale);
  ctx.font = `bold ${22 * scale}px "JetBrains Mono"`;
  const langText = language.substring(0, 6);
  drawFlapRow(colX, bottomRowY, langText, infoCellW, infoCellH, infoGap, secondaryColor, langText.length);
  colX += langText.length * (infoCellW + infoGap) + 30 * scale;

  // STARS column
  if (stars) {
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = `bold ${11 * scale}px "JetBrains Mono"`;
    ctx.textAlign = 'left';
    ctx.fillText('STARS', colX, bottomRowY - 16 * scale);
    ctx.font = `bold ${22 * scale}px "JetBrains Mono"`;
    const starsText = String(stars);
    drawFlapRow(colX, bottomRowY, starsText, infoCellW, infoCellH, infoGap, '#ffd54f', starsText.length);
    colX += starsText.length * (infoCellW + infoGap) + 30 * scale;
  }

  // FORKS column
  if (forks) {
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = `bold ${11 * scale}px "JetBrains Mono"`;
    ctx.textAlign = 'left';
    ctx.fillText('FORKS', colX, bottomRowY - 16 * scale);
    ctx.font = `bold ${22 * scale}px "JetBrains Mono"`;
    const forksText = String(forks);
    drawFlapRow(colX, bottomRowY, forksText, infoCellW, infoCellH, infoGap, '#81d4fa', forksText.length);
  }

  // Support URL — right-aligned, LED-style
  if (supportUrl) {
    ctx.fillStyle = primaryColor;
    ctx.globalAlpha = 0.5;
    ctx.font = `${16 * scale}px "JetBrains Mono"`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(supportUrl, contentX + contentW, bottomRowY + infoCellH / 2);
    ctx.globalAlpha = 1;
  }

  // Status indicator dot (top-right) — like an active board
  ctx.fillStyle = '#4caf50';
  ctx.beginPath();
  ctx.arc(contentX + contentW - 4 * scale, contentY + 7 * scale, 5 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Glow on the dot
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#4caf50';
  ctx.beginPath();
  ctx.arc(contentX + contentW - 4 * scale, contentY + 7 * scale, 12 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};
