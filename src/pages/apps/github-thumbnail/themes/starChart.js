import { wrapText } from '../utils';

// Deterministic pseudo-random
const hash = (seed) => {
  let h = seed ^ 0xdeadbeef;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export const starChart = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    secondaryColor,
    bgColor,
    showPattern,
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
    supportUrl,
  } = data;

  // --- Deep space background ---
  ctx.save();
  ctx.fillStyle = '#06060e';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // --- Nebula clouds (soft colored regions) ---
  ctx.save();
  ctx.filter = 'blur(60px)';
  ctx.globalAlpha = 0.06;

  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.ellipse(width * 0.3, height * 0.4, 280 * scale, 160 * scale, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.ellipse(width * 0.72, height * 0.6, 220 * scale, 130 * scale, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.03;
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.2, 350 * scale, 100 * scale, 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // --- Star field (procedural, ~300 stars with varying magnitude) ---
  const starCount = 320;
  const starPositions = [];

  for (let i = 0; i < starCount; i++) {
    const sx = hash(i * 3 + 1) * width;
    const sy = hash(i * 3 + 2) * height;
    const mag = hash(i * 3 + 3); // 0=bright, 1=dim
    const radius = (1 - mag) * 2.5 * scale + 0.3 * scale;
    const alpha = (1 - mag) * 0.7 + 0.05;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Bright stars get a subtle glow
    if (mag < 0.15) {
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.08;
      ctx.beginPath();
      ctx.arc(sx, sy, radius * 6, 0, Math.PI * 2);
      ctx.fill();

      // Cross diffraction spikes
      ctx.strokeStyle = primaryColor;
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 0.5 * scale;
      const spikeLen = radius * 8;
      ctx.beginPath();
      ctx.moveTo(sx - spikeLen, sy);
      ctx.lineTo(sx + spikeLen, sy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sx, sy - spikeLen);
      ctx.lineTo(sx, sy + spikeLen);
      ctx.stroke();
    }

    // Star dot
    ctx.globalAlpha = alpha;
    ctx.fillStyle = mag < 0.1 ? primaryColor : mag < 0.25 ? '#e8e0ff' : '#ffffff';
    ctx.beginPath();
    ctx.arc(sx, sy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    starPositions.push({ x: sx, y: sy, mag });
  }

  // --- Constellation lines (connect nearby bright stars) ---
  const brightStars = starPositions.filter((s) => s.mag < 0.2);
  ctx.save();
  ctx.strokeStyle = secondaryColor;
  ctx.globalAlpha = 0.12;
  ctx.lineWidth = 1 * scale;
  ctx.setLineDash([3 * scale, 5 * scale]);

  const connected = new Set();
  for (let i = 0; i < brightStars.length; i++) {
    const a = brightStars[i];
    let nearest = null;
    let nearDist = Infinity;
    for (let j = 0; j < brightStars.length; j++) {
      if (i === j) continue;
      const key = Math.min(i, j) + '-' + Math.max(i, j);
      if (connected.has(key)) continue;
      const b = brightStars[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 180 * scale && dist < nearDist) {
        nearDist = dist;
        nearest = { star: b, key };
      }
    }
    if (nearest) {
      connected.add(nearest.key);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(nearest.star.x, nearest.star.y);
      ctx.stroke();
    }
  }
  ctx.setLineDash([]);
  ctx.restore();

  // --- Celestial coordinate grid (showPattern) ---
  if (showPattern) {
    ctx.save();

    // Right Ascension lines (curved arcs)
    ctx.globalAlpha = 0.04;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1 * scale;

    const raCount = 8;
    for (let i = 1; i < raCount; i++) {
      const x = (i / raCount) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      // Slight curve
      ctx.quadraticCurveTo(x + 30 * scale * Math.sin((i / raCount) * Math.PI), height / 2, x, height);
      ctx.stroke();
    }

    // Declination lines (curved horizontals)
    const decCount = 5;
    for (let i = 1; i < decCount; i++) {
      const y = (i / decCount) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.quadraticCurveTo(width / 2, y - 20 * scale * Math.cos((i / decCount) * Math.PI), width, y);
      ctx.stroke();
    }

    // RA/Dec labels
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = '#ffffff';
    ctx.font = `400 ${9 * scale}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    for (let i = 1; i < raCount; i++) {
      const x = (i / raCount) * width;
      ctx.fillText(`${i * 3}h`, x, 14 * scale);
    }
    ctx.textAlign = 'left';
    for (let i = 1; i < decCount; i++) {
      const y = (i / decCount) * height;
      const dec = 90 - (i / decCount) * 180;
      ctx.fillText(`${dec > 0 ? '+' : ''}${dec.toFixed(0)}°`, 6 * scale, y - 4 * scale);
    }

    ctx.restore();
  }

  const padding = 80 * scale;

  // --- Catalog entry panel (top-left) ---
  const catPad = 24 * scale;
  const catW = 520 * scale;
  const catH = 260 * scale;

  ctx.save();
  ctx.fillStyle = '#06060e';
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.roundRect(padding, padding, catW, catH, 6 * scale);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.roundRect(padding, padding, catW, catH, 6 * scale);
  ctx.stroke();
  ctx.restore();

  // Catalog header
  ctx.textAlign = 'left';
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.4;
  ctx.font = `500 ${12 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('STELLAR OBJECT CATALOG — OPEN SOURCE REGISTRY', padding + catPad, padding + 28 * scale);
  ctx.globalAlpha = 1;

  // Separator
  ctx.fillStyle = primaryColor;
  ctx.globalAlpha = 0.2;
  ctx.fillRect(padding + catPad, padding + 40 * scale, catW - catPad * 2, 1 * scale);
  ctx.globalAlpha = 1;

  // Owner as designation
  ctx.fillStyle = primaryColor;
  ctx.font = `600 ${16 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(`${repoOwner.toUpperCase()} ⟩`, padding + catPad, padding + 68 * scale);

  // Repo name
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${52 * scale}px "Inter", sans-serif`;
  let fontSize = 52;
  while (ctx.measureText(repoName).width > catW - catPad * 2 && fontSize > 28) {
    fontSize -= 2;
    ctx.font = `800 ${fontSize * scale}px "Inter", sans-serif`;
  }
  ctx.fillText(repoName, padding + catPad, padding + 124 * scale);

  // Classification line
  ctx.fillStyle = secondaryColor;
  ctx.globalAlpha = 0.5;
  ctx.font = `400 ${13 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(`CLASS: ${language.toUpperCase()}  ·  TYPE: OPEN-SOURCE  ·  STATUS: ACTIVE`, padding + catPad, padding + 156 * scale);
  ctx.globalAlpha = 1;

  // Color spectrum bar
  const specY = padding + 186 * scale;
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.font = `500 ${10 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('SPECTRUM', padding + catPad, specY);

  const specBarX = padding + catPad + 85 * scale;
  const specBarW = 260 * scale;
  const specBarH = 10 * scale;
  const specGrad = ctx.createLinearGradient(specBarX, 0, specBarX + specBarW, 0);
  specGrad.addColorStop(0, bgColor);
  specGrad.addColorStop(0.5, primaryColor);
  specGrad.addColorStop(1, secondaryColor);
  ctx.fillStyle = specGrad;
  ctx.fillRect(specBarX, specY - 8 * scale, specBarW, specBarH);

  // Tick marks on spectrum
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1 * scale;
  for (let t = 0; t <= 4; t++) {
    const tx = specBarX + (t / 4) * specBarW;
    ctx.beginPath();
    ctx.moveTo(tx, specY - 8 * scale);
    ctx.lineTo(tx, specY - 14 * scale);
    ctx.stroke();
  }

  // Grid status
  ctx.fillStyle = showPattern ? primaryColor : 'rgba(255,255,255,0.15)';
  ctx.font = `500 ${11 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(showPattern ? '◉ GRID OVERLAY' : '○ GRID HIDDEN', padding + catPad, padding + 228 * scale);

  // --- Description panel (bottom-left) ---
  const descPad = 20 * scale;
  const descW = width * 0.5;
  const descH = 130 * scale;
  const descX = padding;
  const descY = height - padding - descH;

  ctx.save();
  ctx.fillStyle = '#06060e';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.roundRect(descX, descY, descW, descH, 6 * scale);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = secondaryColor;
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1 * scale;
  ctx.setLineDash([2 * scale, 4 * scale]);
  ctx.beginPath();
  ctx.roundRect(descX, descY, descW, descH, 6 * scale);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = `500 ${11 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'left';
  ctx.fillText('OBSERVATION NOTES', descX + descPad, descY + 26 * scale);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = `300 ${19 * scale}px "Inter", sans-serif`;
  wrapText(ctx, description, descX + descPad, descY + 54 * scale, descW - descPad * 2, 28 * scale);

  // --- Metrics panel (bottom-right) ---
  const metPad = 20 * scale;
  const metW = 240 * scale;
  const metH = 130 * scale;
  const metX = width - padding - metW;
  const metY = height - padding - metH;

  ctx.save();
  ctx.fillStyle = '#06060e';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.roundRect(metX, metY, metW, metH, 6 * scale);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.roundRect(metX, metY, metW, metH, 6 * scale);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = `500 ${11 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'left';
  ctx.fillText('MAGNITUDE', metX + metPad, metY + 26 * scale);

  let readY = metY + 58 * scale;
  if (stars) {
    ctx.fillStyle = primaryColor;
    ctx.font = `800 ${30 * scale}px "Inter", sans-serif`;
    ctx.fillText(stars, metX + metPad, readY);
    const sw = ctx.measureText(stars).width;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `400 ${13 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText('★ obs', metX + metPad + sw + 10 * scale, readY);
    readY += 36 * scale;
  }

  if (forks) {
    ctx.fillStyle = secondaryColor;
    ctx.font = `800 ${30 * scale}px "Inter", sans-serif`;
    ctx.fillText(forks, metX + metPad, readY);
    const fw = ctx.measureText(forks).width;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `400 ${13 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText('⑂ forks', metX + metPad + fw + 10 * scale, readY);
  }

  // --- Support URL as catalog reference ---
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.font = `400 ${12 * scale}px "JetBrains Mono", monospace`;
    ctx.fillText(`CATALOG: ${supportUrl}`, width - padding, padding + 16 * scale);
  }

  // --- Corner crosshairs (finder marks) ---
  ctx.save();
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 1 * scale;
  ctx.globalAlpha = 0.2;
  const ch = 16 * scale;
  const co = padding * 0.5;

  const drawCrosshair = (cx, cy) => {
    ctx.beginPath();
    ctx.moveTo(cx - ch, cy);
    ctx.lineTo(cx + ch, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - ch);
    ctx.lineTo(cx, cy + ch);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, ch * 0.6, 0, Math.PI * 2);
    ctx.stroke();
  };

  drawCrosshair(co, co);
  drawCrosshair(width - co, co);
  drawCrosshair(co, height - co);
  drawCrosshair(width - co, height - co);
  ctx.restore();
};
