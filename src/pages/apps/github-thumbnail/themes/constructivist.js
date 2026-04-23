import { wrapText } from '../utils';

/*
 * CONSTRUCTIVIST — Rodchenko/Lissitzky poster. Dirty newsprint, overlapping
 * transparent color planes, halftone dot overlays, ultra-condensed slab type
 * at aggressive angles, and thick printer's rules. No figurative art — pure
 * typography, geometry, and printing texture.
 */

const seedRng = (seed) => {
  let h = 0xa7c1d3e9;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

export const constructivist = (ctx, width, height, scale, data) => {
  const {
    primaryColor, secondaryColor, bgColor,
    repoOwner, repoName, description, language, stars, forks, supportUrl,
    showPattern,
  } = data;

  const rng = seedRng(`${repoOwner}${repoName}`);

  const ink = '#0b0a08';
  const paper = '#efe4ce';
  const paperShade = '#d9cbae';

  // --- Newsprint paper with yellowing and fibre grain ---
  const paperGrad = ctx.createLinearGradient(0, 0, width, height);
  paperGrad.addColorStop(0, paper);
  paperGrad.addColorStop(1, paperShade);
  ctx.fillStyle = paperGrad;
  ctx.fillRect(0, 0, width, height);

  if (showPattern) {
    // Paper grain
    ctx.save();
    for (let i = 0; i < 1400; i++) {
      ctx.globalAlpha = 0.06 + rng() * 0.06;
      ctx.fillStyle = rng() > 0.5 ? '#000' : '#8a6a2a';
      ctx.fillRect(rng() * width, rng() * height, scale, scale);
    }
    ctx.restore();

    // Ink bleed / coffee-stain blotches (very subtle)
    ctx.save();
    for (let i = 0; i < 16; i++) {
      const x = rng() * width;
      const y = rng() * height;
      const r = (20 + rng() * 60) * scale;
      ctx.globalAlpha = 0.04 + rng() * 0.04;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(90,50,10,0.7)');
      g.addColorStop(1, 'rgba(90,50,10,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- Big overlapping color planes ---

  // A giant ink circle top-right (printed ink)
  const discR = Math.min(width, height) * 0.48;
  const discCx = width * 0.8;
  const discCy = height * 0.44;
  ctx.save();
  ctx.globalAlpha = 0.96;
  const discGrad = ctx.createRadialGradient(discCx - discR * 0.3, discCy - discR * 0.3, 0, discCx, discCy, discR);
  discGrad.addColorStop(0, '#1a1714');
  discGrad.addColorStop(1, ink);
  ctx.fillStyle = discGrad;
  ctx.beginPath();
  ctx.arc(discCx, discCy, discR, 0, Math.PI * 2);
  ctx.fill();

  // Concentric propaganda rings inside (drawn with halftone effect)
  ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,0.11)';
  ctx.lineWidth = 0.8 * scale;
  for (let r = discR * 0.15; r < discR; r += discR * 0.07) {
    ctx.beginPath();
    ctx.arc(discCx, discCy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Halftone dots radiating
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  for (let i = 0; i < 360; i += 5) {
    for (let r = discR * 0.2; r < discR * 0.95; r += 12 * scale) {
      const a = (i / 360) * Math.PI * 2;
      const x = discCx + Math.cos(a) * r;
      const y = discCy + Math.sin(a) * r;
      const s = Math.max(0.4, (r / discR) * 1.8) * scale;
      if (((i / 5 + r / (12 * scale)) | 0) % 2 === 0) continue;
      ctx.fillRect(x, y, s, s);
    }
  }
  ctx.restore();

  // A massive red wedge piercing up through the disc
  ctx.save();
  ctx.translate(width * 0.18, height * 0.98);
  ctx.rotate(-Math.PI * 0.33);
  const wedgeGrad = ctx.createLinearGradient(0, 0, height * 0.9, 0);
  wedgeGrad.addColorStop(0, primaryColor);
  wedgeGrad.addColorStop(0.8, primaryColor);
  wedgeGrad.addColorStop(1, 'rgba(0,0,0,0.15)');
  ctx.fillStyle = wedgeGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(height * 1.1, -20 * scale);
  ctx.lineTo(height * 1.1, 20 * scale);
  ctx.closePath();
  ctx.fill();
  // ink imperfection: a streak across the wedge
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, -6 * scale, height * 1.1, 1.5 * scale);
  ctx.restore();

  // Secondary transparent cyan/blue plane across middle
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(0, height * 0.56, width * 0.62, height * 0.1);
  ctx.globalAlpha = 0.3;
  ctx.fillRect(0, height * 0.66, width * 0.3, height * 0.03);
  ctx.restore();

  // A stark suprematist red square top-left with rotate
  ctx.save();
  ctx.translate(width * 0.24, height * 0.16);
  ctx.rotate(-0.18);
  ctx.fillStyle = primaryColor;
  ctx.fillRect(-50 * scale, -50 * scale, 100 * scale, 100 * scale);
  // outline
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(-50 * scale, -50 * scale, 100 * scale, 100 * scale);
  // inner halftone
  for (let y = -44 * scale; y < 40 * scale; y += 6 * scale) {
    for (let x = -44 * scale; x < 40 * scale; x += 6 * scale) {
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(x, y, 1.5 * scale, 1.5 * scale);
    }
  }
  ctx.restore();

  // Small black triangle
  ctx.save();
  ctx.translate(width * 0.5, height * 0.83);
  ctx.rotate(0.28);
  ctx.fillStyle = ink;
  ctx.beginPath();
  ctx.moveTo(0, -60 * scale);
  ctx.lineTo(80 * scale, 60 * scale);
  ctx.lineTo(-80 * scale, 60 * scale);
  ctx.closePath();
  ctx.fill();
  // inner cut
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(0, -20 * scale);
  ctx.lineTo(30 * scale, 40 * scale);
  ctx.lineTo(-30 * scale, 40 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Thick diagonal black rule full canvas
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 4 * scale;
  ctx.beginPath();
  ctx.moveTo(width * 0.07, height * 0.94);
  ctx.lineTo(width * 0.96, height * 0.08);
  ctx.stroke();
  // parallel thin rule
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(width * 0.07 - 14 * scale, height * 0.94 + 8 * scale);
  ctx.lineTo(width * 0.96 - 14 * scale, height * 0.08 + 8 * scale);
  ctx.stroke();
  ctx.restore();

  // --- Registration crosshairs at four corners ---
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.2 * scale;
  const crosses = [
    [30 * scale, 30 * scale], [width - 30 * scale, 30 * scale],
    [30 * scale, height - 30 * scale], [width - 30 * scale, height - 30 * scale],
  ];
  crosses.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 10 * scale, 0, Math.PI * 2);
    ctx.moveTo(x - 16 * scale, y);
    ctx.lineTo(x + 16 * scale, y);
    ctx.moveTo(x, y - 16 * scale);
    ctx.lineTo(x, y + 16 * scale);
    ctx.stroke();
  });
  ctx.restore();

  // --- Serial header strip (top) ---
  ctx.save();
  ctx.fillStyle = ink;
  ctx.font = `700 ${11 * scale}px "JetBrains Mono", "Courier New", monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const stamp = 'Nº 1926   ⏐   MOSCOW · LENINGRAD · ' + (repoOwner || '').toUpperCase() + ' · PRINT WORKS   ⏐   XXIV/IV';
  ctx.fillText(stamp, 54 * scale, 42 * scale);
  // underline
  ctx.fillRect(54 * scale, 58 * scale, width - 108 * scale, 1 * scale);
  ctx.fillRect(54 * scale, 62 * scale, width * 0.22, 3 * scale);
  ctx.restore();

  // --- MASTHEAD: ultra-condensed repo name ---
  ctx.save();
  const mastY = height * 0.18;
  const mastX = width * 0.1;

  // Measure / fit
  let mastSize = 210 * scale;
  const mastFont = (sz) => `900 ${sz}px "Syne", "Bebas Neue", "Oswald", "Impact", "Haettenschweiler", "Arial Narrow", sans-serif`;
  ctx.font = mastFont(mastSize);
  const maxMastW = width * 0.58;
  while (ctx.measureText(repoName.toUpperCase()).width > maxMastW && mastSize > 60 * scale) {
    mastSize -= 3 * scale;
    ctx.font = mastFont(mastSize);
  }

  ctx.save();
  ctx.translate(mastX, mastY);
  ctx.scale(0.68, 1.02); // aggressively condensed
  ctx.fillStyle = ink;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const letters = repoName.toUpperCase().split('');
  let xCursor = 0;
  letters.forEach((ch, i) => {
    // emphasis letter in red
    const isEmphasis = i === 0 || ch === ' ';
    ctx.fillStyle = isEmphasis ? primaryColor : ink;
    ctx.fillText(ch, xCursor, 0);
    // Add a subtle ghost offset behind each letter for print-misregister feel
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = secondaryColor;
    ctx.fillText(ch, xCursor + 2.5 / 0.68, 2);
    ctx.restore();
    xCursor += ctx.measureText(ch).width;
  });
  ctx.restore();

  // Red slash + black rules beneath the title
  const slashY = mastY + mastSize * 0.98;
  ctx.fillStyle = primaryColor;
  ctx.fillRect(mastX, slashY, width * 0.48, 10 * scale);
  ctx.fillStyle = ink;
  ctx.fillRect(mastX, slashY + 16 * scale, width * 0.3, 3 * scale);
  ctx.fillRect(mastX + width * 0.35, slashY + 16 * scale, width * 0.08, 3 * scale);
  ctx.restore();

  // --- Author callout (rotated, in circle) ---
  ctx.save();
  ctx.translate(width * 0.78, height * 0.17);
  ctx.rotate(-0.14);
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(0, 0, 68 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
  // inner halftone
  for (let y = -60 * scale; y < 60 * scale; y += 5 * scale) {
    for (let x = -60 * scale; x < 60 * scale; x += 5 * scale) {
      if (x * x + y * y > 60 * 60 * scale * scale) continue;
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(x, y, 1 * scale, 1 * scale);
    }
  }
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${11 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('AUTHOR', 0, -28 * scale);
  ctx.fillText('───', 0, -16 * scale);
  const ownerFontStack = `900 28px "Syne", "Bebas Neue", "Oswald", sans-serif`;
  // Fit owner
  const ownerUpper = (repoOwner || '').toUpperCase();
  let ownerSize = 28 * scale;
  ctx.font = `900 ${ownerSize}px "Syne", "Bebas Neue", "Oswald", sans-serif`;
  while (ctx.measureText(ownerUpper).width > 110 * scale && ownerSize > 10 * scale) {
    ownerSize -= 0.5;
    ctx.font = `900 ${ownerSize}px "Syne", "Bebas Neue", "Oswald", sans-serif`;
  }
  ctx.fillText(ownerUpper, 0, 4 * scale);
  ctx.font = `700 ${9 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('БЫТ · XXVI', 0, 26 * scale);
  ctx.restore();

  // --- Description block on left, narrow, italic condensed ---
  ctx.save();
  ctx.fillStyle = ink;
  ctx.font = `italic 500 ${15 * scale}px "Inter", "Helvetica Neue", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  // Under slash
  const descX = width * 0.1;
  const descY = slashY + 34 * scale;
  const descW = width * 0.4;
  wrapText(ctx, description, descX, descY, descW, 21 * scale);

  // Heavy vertical rule next to description
  ctx.fillStyle = primaryColor;
  ctx.fillRect(descX - 18 * scale, descY - 4 * scale, 4 * scale, 84 * scale);
  ctx.fillStyle = ink;
  ctx.fillRect(descX - 18 * scale, descY + 90 * scale, 4 * scale, 8 * scale);
  ctx.restore();

  // --- Big numeric callouts ---
  // STARS - big red rotated number to the right of the title
  ctx.save();
  ctx.translate(discCx - discR * 0.25, discCy - discR * 0.15);
  ctx.rotate(-0.25);
  ctx.fillStyle = primaryColor;
  ctx.font = `900 ${74 * scale}px "Syne", "Bebas Neue", "Oswald", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★' + (stars || '0'), 0, 0);
  // Ghost offset for misreg
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = secondaryColor;
  ctx.fillText('★' + (stars || '0'), 4 * scale, 3 * scale);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fff';
  ctx.font = `900 ${12 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('STARS  ⁕  OF THE PEOPLE', 0, 46 * scale);
  ctx.restore();

  // FORKS inside the ink disc
  ctx.save();
  ctx.translate(discCx + discR * 0.15, discCy + discR * 0.25);
  ctx.rotate(0.12);
  ctx.fillStyle = '#fff';
  ctx.font = `900 ${120 * scale}px "Syne", "Bebas Neue", "Oswald", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(forks || '0'), 0, 0);
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = primaryColor;
  ctx.fillText(String(forks || '0'), 4 * scale, 4 * scale);
  ctx.globalAlpha = 1;
  ctx.fillStyle = primaryColor;
  ctx.font = `900 ${16 * scale}px "Syne", "Bebas Neue", "Oswald", sans-serif`;
  ctx.fillText('× FORKS FORGED', 0, 80 * scale);
  ctx.restore();

  // LANGUAGE as a rotated banner at bottom-left
  ctx.save();
  ctx.translate(width * 0.18, height * 0.78);
  ctx.rotate(-0.08);
  // banner bg
  const langUpper = (language || '').toUpperCase();
  ctx.font = `900 ${30 * scale}px "Syne", "Bebas Neue", "Oswald", sans-serif`;
  const lwp = ctx.measureText('· ' + langUpper + ' ·').width + 36 * scale;
  ctx.fillStyle = ink;
  ctx.fillRect(0, -20 * scale, lwp, 44 * scale);
  // red notch
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(lwp, -20 * scale);
  ctx.lineTo(lwp + 24 * scale, 2 * scale);
  ctx.lineTo(lwp, 24 * scale);
  ctx.closePath();
  ctx.fill();
  // text
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('· ' + langUpper + ' ·', 18 * scale, 2 * scale);
  ctx.restore();

  // --- Bottom black strip with marks ---
  ctx.save();
  ctx.fillStyle = ink;
  ctx.fillRect(0, height - 28 * scale, width, 28 * scale);
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, height - 28 * scale, width * 0.22, 28 * scale);

  ctx.fillStyle = '#fff';
  ctx.font = `700 ${11 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('▲ PROLETARIAT · OPEN SOURCE · УРА!', 14 * scale, height - 14 * scale);
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = '#f0c75a';
    ctx.fillText('◄  ' + supportUrl, width - 14 * scale, height - 14 * scale);
  }
  ctx.restore();
};
