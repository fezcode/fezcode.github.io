import { wrapText } from '../utils';

/*
 * ILLUMINATED_MANUSCRIPT — two-column codex folio on aged vellum. Dense
 * acanthus vine marginalia fills the border; the historiated initial holds
 * an interlaced knot. Body text is set in two columns with rubricated
 * versals and red chapter marks for a true Book-of-Hours density.
 */

const seedRng = (seed) => {
  let h = 0xde17c3ab;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

// Acanthus leaf drawn along a path normal.
const acanthusLeaf = (ctx, x, y, len, angle, scale, col1, col2) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = col1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(len * 0.2, -len * 0.4, len * 0.6, -len * 0.4, len, 0);
  ctx.bezierCurveTo(len * 0.6, len * 0.4, len * 0.2, len * 0.4, 0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = col2;
  ctx.lineWidth = 0.8 * scale;
  ctx.stroke();
  // midrib
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(len, 0);
  ctx.stroke();
  // vein serrations
  for (let i = 1; i < 5; i++) {
    const t = i / 5;
    ctx.beginPath();
    ctx.moveTo(len * t, 0);
    ctx.lineTo(len * (t + 0.08), -len * 0.25);
    ctx.moveTo(len * t, 0);
    ctx.lineTo(len * (t + 0.08), len * 0.25);
    ctx.stroke();
  }
  ctx.restore();
};

// Continuous vine with acanthus leaves, berries, and little gold trefoils.
const vineSpray = (ctx, x, y, dir, length, segments, scale, rng, palette) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(dir);
  // Spine path: several bezier segments forming an undulating curve.
  const pts = [{ x: 0, y: 0 }];
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    pts.push({
      x: length * t,
      y: Math.sin(t * Math.PI * 2.6) * length * 0.22 + (rng() - 0.5) * 6 * scale,
    });
  }
  // Draw spine
  ctx.strokeStyle = palette.vine;
  ctx.lineWidth = 2.2 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length - 1; i++) {
    const xc = (pts[i].x + pts[i + 1].x) / 2;
    const yc = (pts[i].y + pts[i + 1].y) / 2;
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
  }
  ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
  ctx.stroke();
  // Inner highlight on the spine
  ctx.strokeStyle = palette.vineHi;
  ctx.lineWidth = 0.7 * scale;
  ctx.stroke();

  // Decorate with leaves along the spine
  for (let i = 0; i < pts.length - 1; i++) {
    const p = pts[i];
    const q = pts[i + 1];
    const a = Math.atan2(q.y - p.y, q.x - p.x);
    const L = (10 + (i % 3) * 4) * scale;
    if (i % 2 === 0) {
      acanthusLeaf(ctx, p.x, p.y, L, a - Math.PI / 2 - 0.3, scale, palette.leaf, palette.vine);
    } else {
      acanthusLeaf(ctx, p.x, p.y, L, a + Math.PI / 2 + 0.3, scale, palette.leafAlt, palette.vine);
    }
  }

  // Berry clusters at intervals
  for (let i = 1; i < pts.length - 1; i += 2) {
    const p = pts[i];
    ctx.fillStyle = palette.berry;
    for (let j = 0; j < 5; j++) {
      const jx = p.x + Math.cos((j / 5) * Math.PI * 2) * 3 * scale;
      const jy = p.y + Math.sin((j / 5) * Math.PI * 2) * 3 * scale;
      ctx.beginPath();
      ctx.arc(jx, jy, 2.2 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = palette.berryHi;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.2 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  // Gold trefoil at the tip
  ctx.save();
  const tip = pts[pts.length - 1];
  ctx.translate(tip.x, tip.y);
  ctx.fillStyle = palette.gold;
  for (let k = 0; k < 3; k++) {
    ctx.save();
    ctx.rotate((k * Math.PI * 2) / 3);
    ctx.beginPath();
    ctx.ellipse(0, -5 * scale, 3 * scale, 5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = palette.berry;
  ctx.beginPath();
  ctx.arc(0, 0, 2 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
};

// Large Celtic-style interlaced knot within a square.
const interlaceKnot = (ctx, cx, cy, size, color, bgCol, scale) => {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = bgCol;
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // Grid of crossing arcs — 4x4 cell-based interlace
  const n = 4;
  const cell = size / n;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const x = -size / 2 + i * cell;
      const y = -size / 2 + j * cell;
      // Diagonal arc from one corner pair
      ctx.beginPath();
      if ((i + j) % 2 === 0) {
        ctx.arc(x, y, cell * 0.55, 0, Math.PI / 2);
        ctx.moveTo(x + cell, y + cell);
        ctx.arc(x + cell, y + cell, cell * 0.55, Math.PI, Math.PI * 1.5);
      } else {
        ctx.arc(x + cell, y, cell * 0.55, Math.PI / 2, Math.PI);
        ctx.moveTo(x, y + cell);
        ctx.arc(x, y + cell, cell * 0.55, 1.5 * Math.PI, 2 * Math.PI);
      }
      ctx.stroke();
    }
  }
  // Double the knot with a tight inner stroke to suggest depth
  ctx.strokeStyle = bgCol;
  ctx.lineWidth = 0.8 * scale;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const x = -size / 2 + i * cell;
      const y = -size / 2 + j * cell;
      ctx.beginPath();
      if ((i + j) % 2 === 0) {
        ctx.arc(x, y, cell * 0.55, 0, Math.PI / 2);
        ctx.moveTo(x + cell, y + cell);
        ctx.arc(x + cell, y + cell, cell * 0.55, Math.PI, Math.PI * 1.5);
      } else {
        ctx.arc(x + cell, y, cell * 0.55, Math.PI / 2, Math.PI);
        ctx.moveTo(x, y + cell);
        ctx.arc(x, y + cell, cell * 0.55, 1.5 * Math.PI, 2 * Math.PI);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
};

export const illuminatedManuscript = (ctx, width, height, scale, data) => {
  const {
    primaryColor, secondaryColor, bgColor,
    repoOwner, repoName, description, language, stars, forks, supportUrl,
    showPattern,
  } = data;

  const rng = seedRng(`${repoOwner}${repoName}`);

  const ruby = primaryColor;
  const azure = secondaryColor;
  const gold = '#d8a93a';
  const goldLight = '#f3d774';
  const goldDeep = '#8b6a22';
  const ink = '#1a0f06';
  const inkSoft = '#4a3522';
  const leafG = '#3a6b2e';
  const leafGAlt = '#5e8b3a';
  const berryR = '#8b1f1f';
  const berryH = '#f5e8b0';

  // --- Aged vellum ground with warm golden wash ---
  const ground = ctx.createRadialGradient(width * 0.5, height * 0.45, width * 0.05, width * 0.5, height * 0.55, width * 0.9);
  ground.addColorStop(0, '#f8ebc4');
  ground.addColorStop(0.65, '#e8d098');
  ground.addColorStop(1, '#b89358');
  ctx.fillStyle = ground;
  ctx.fillRect(0, 0, width, height);

  if (showPattern) {
    // Hair follicle marks
    ctx.save();
    for (let i = 0; i < 220; i++) {
      const x = rng() * width;
      const y = rng() * height;
      const r = (0.5 + rng() * 2) * scale;
      ctx.globalAlpha = 0.08 + rng() * 0.08;
      ctx.fillStyle = rng() > 0.5 ? '#7a5310' : '#5a3a08';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    // Long fibre streaks
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = '#8a5e20';
    ctx.lineWidth = 0.5 * scale;
    for (let i = 0; i < 110; i++) {
      const x = rng() * width;
      const y = rng() * height;
      const len = (20 + rng() * 60) * scale;
      const a = rng() * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Gilt outer frame with dense diapering ---
  const fOut = 20 * scale;
  const fIn = 34 * scale;

  ctx.save();
  // Gold band
  const gb = ctx.createLinearGradient(0, fOut, 0, fIn);
  gb.addColorStop(0, goldLight);
  gb.addColorStop(0.5, gold);
  gb.addColorStop(1, goldDeep);
  ctx.fillStyle = gb;
  // top/bottom/left/right bands
  ctx.fillRect(fOut, fOut, width - fOut * 2, fIn - fOut);
  ctx.fillRect(fOut, height - fIn, width - fOut * 2, fIn - fOut);
  ctx.fillRect(fOut, fOut, fIn - fOut, height - fOut * 2);
  ctx.fillRect(width - fIn, fOut, fIn - fOut, height - fOut * 2);
  // Hairlines
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 0.8 * scale;
  ctx.strokeRect(fOut, fOut, width - fOut * 2, height - fOut * 2);
  ctx.strokeRect(fIn, fIn, width - fIn * 2, height - fIn * 2);

  // Diapering: tiny alternating colored lozenges in the gold band
  const dstep = 10 * scale;
  const bandYs = [fOut + (fIn - fOut) / 2, height - fIn + (fIn - fOut) / 2];
  bandYs.forEach((y) => {
    for (let x = fIn; x < width - fIn; x += dstep) {
      const pick = ((x / dstep) | 0) % 3;
      const col = pick === 0 ? ruby : pick === 1 ? azure : '#0b0706';
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(x, y - 2.5 * scale);
      ctx.lineTo(x + 4 * scale, y);
      ctx.lineTo(x, y + 2.5 * scale);
      ctx.lineTo(x - 4 * scale, y);
      ctx.closePath();
      ctx.fill();
    }
  });
  const bandXs = [fOut + (fIn - fOut) / 2, width - fIn + (fIn - fOut) / 2];
  bandXs.forEach((x) => {
    for (let y = fIn; y < height - fIn; y += dstep) {
      const pick = ((y / dstep) | 0) % 3;
      const col = pick === 0 ? azure : pick === 1 ? ruby : '#0b0706';
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(x, y - 2.5 * scale);
      ctx.lineTo(x + 4 * scale, y);
      ctx.lineTo(x, y + 2.5 * scale);
      ctx.lineTo(x - 4 * scale, y);
      ctx.closePath();
      ctx.fill();
    }
  });

  // Corner roundels with ruby center and blue ring
  const corners = [[fOut + 4 * scale, fOut + 4 * scale], [width - fOut - 4 * scale, fOut + 4 * scale], [width - fOut - 4 * scale, height - fOut - 4 * scale], [fOut + 4 * scale, height - fOut - 4 * scale]];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = ink;
    ctx.fillRect(cx - 13 * scale, cy - 13 * scale, 26 * scale, 26 * scale);
    ctx.fillStyle = gold;
    ctx.fillRect(cx - 11 * scale, cy - 11 * scale, 22 * scale, 22 * scale);
    ctx.fillStyle = ruby;
    ctx.beginPath();
    ctx.arc(cx, cy, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = azure;
    ctx.beginPath();
    ctx.arc(cx, cy, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = goldLight;
    ctx.beginPath();
    ctx.arc(cx, cy, 1.5 * scale, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // --- Marginalia vines: 4 sprays flanking the corners, 2 mid-side ---
  const palette = { vine: '#4a3220', vineHi: '#8b6a22', leaf: leafG, leafAlt: leafGAlt, berry: berryR, berryHi: berryH, gold };
  // Top-left spraying in
  vineSpray(ctx, fIn + 8 * scale, fIn + 8 * scale, 0.3, 260 * scale, 6, scale, rng, palette);
  // Top-right
  vineSpray(ctx, width - fIn - 8 * scale, fIn + 8 * scale, Math.PI - 0.3, 260 * scale, 6, scale, rng, palette);
  // Bottom-left
  vineSpray(ctx, fIn + 8 * scale, height - fIn - 8 * scale, -0.3, 240 * scale, 5, scale, rng, palette);
  // Bottom-right
  vineSpray(ctx, width - fIn - 8 * scale, height - fIn - 8 * scale, Math.PI + 0.3, 240 * scale, 5, scale, rng, palette);
  // Left mid
  vineSpray(ctx, fIn + 8 * scale, height * 0.5, -Math.PI / 2 + 0.3, 140 * scale, 4, scale, rng, palette);
  vineSpray(ctx, fIn + 8 * scale, height * 0.5, Math.PI / 2 - 0.3, 140 * scale, 4, scale, rng, palette);
  // Right mid
  vineSpray(ctx, width - fIn - 8 * scale, height * 0.5, Math.PI / 2 + 0.3, 140 * scale, 4, scale, rng, palette);
  vineSpray(ctx, width - fIn - 8 * scale, height * 0.5, -Math.PI / 2 - 0.3, 140 * scale, 4, scale, rng, palette);

  // --- Rubric header ---
  const tx = fIn + 60 * scale;
  const ty = fIn + 26 * scale;
  const tw = width - (fIn + 60 * scale) * 2;
  const th = height - (fIn + 26 * scale) * 2;

  ctx.save();
  ctx.fillStyle = ruby;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = `italic 600 ${14 * scale}px "EB Garamond", serif`;
  const rubric = 'INCIPIT ⁘ CODEX ⁘ ' + (repoOwner || '').toUpperCase() + ' ⁘ CAPUT I';
  ctx.fillText(rubric, tx, ty);
  // Pilcrow and rule
  ctx.fillStyle = goldDeep;
  ctx.font = `700 ${16 * scale}px "EB Garamond", serif`;
  ctx.textAlign = 'right';
  ctx.fillText('¶ fol. mmxxvi', tx + tw, ty);
  // Red rule
  ctx.strokeStyle = ruby;
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(tx, ty + 22 * scale);
  ctx.lineTo(tx + tw, ty + 22 * scale);
  ctx.stroke();
  // Diamond pair flanking a gold rule just below
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 0.6 * scale;
  ctx.beginPath();
  ctx.moveTo(tx, ty + 26 * scale);
  ctx.lineTo(tx + tw, ty + 26 * scale);
  ctx.stroke();
  ctx.restore();

  // --- Historiated initial (capital letter) ---
  const initSize = 160 * scale;
  const initX = tx;
  const initY = ty + 40 * scale;
  const letter = (repoName || 'X')[0].toUpperCase();

  // Ornate outer box with ruby/gold/azure layers
  ctx.save();
  ctx.fillStyle = ink;
  ctx.fillRect(initX - 2 * scale, initY - 2 * scale, initSize + 4 * scale, initSize + 4 * scale);
  ctx.fillStyle = gold;
  ctx.fillRect(initX, initY, initSize, initSize);
  // Inner ruby panel with interlaced knot background
  const knotInset = 10 * scale;
  interlaceKnot(
    ctx,
    initX + initSize / 2,
    initY + initSize / 2,
    initSize - knotInset * 2,
    gold,
    ruby,
    scale,
  );
  // Gold frame
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(initX + knotInset, initY + knotInset, initSize - knotInset * 2, initSize - knotInset * 2);
  ctx.restore();

  // Azure diamond behind the letter
  ctx.save();
  ctx.translate(initX + initSize / 2, initY + initSize / 2);
  ctx.fillStyle = azure;
  ctx.beginPath();
  ctx.moveTo(0, -initSize * 0.4);
  ctx.lineTo(initSize * 0.4, 0);
  ctx.lineTo(0, initSize * 0.4);
  ctx.lineTo(-initSize * 0.4, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = goldLight;
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
  ctx.strokeStyle = '#0b0706';
  ctx.lineWidth = 0.6 * scale;
  ctx.stroke();

  // Dot ornaments at diamond corners
  ctx.fillStyle = gold;
  [[0, -initSize * 0.4], [initSize * 0.4, 0], [0, initSize * 0.4], [-initSize * 0.4, 0]].forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.arc(dx, dy, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ruby;
    ctx.beginPath();
    ctx.arc(dx, dy, 1.8 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = gold;
  });

  // The capital letter — gold leaf look with deeper drop
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${initSize * 0.66}px "Playfair Display", "EB Garamond", "Times New Roman", serif`;
  // Drop shadow layer
  ctx.fillStyle = '#4a0a0a';
  ctx.fillText(letter, 2 * scale, 4 * scale);
  // Main
  const letGrad = ctx.createLinearGradient(0, -initSize * 0.3, 0, initSize * 0.3);
  letGrad.addColorStop(0, '#fff3b3');
  letGrad.addColorStop(0.5, gold);
  letGrad.addColorStop(1, goldDeep);
  ctx.fillStyle = letGrad;
  ctx.fillText(letter, 0, 0);
  // Outline
  ctx.strokeStyle = '#0b0706';
  ctx.lineWidth = 1 * scale;
  ctx.strokeText(letter, 0, 0);
  ctx.restore();

  // Gold tendril from the initial into the text area
  ctx.save();
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(initX + initSize, initY + initSize * 0.3);
  ctx.bezierCurveTo(initX + initSize + 60 * scale, initY - 10 * scale, initX + initSize + 140 * scale, initY + 40 * scale, initX + initSize + 220 * scale, initY + 10 * scale);
  ctx.stroke();
  // Leaves on the tendril
  acanthusLeaf(ctx, initX + initSize + 70 * scale, initY - 6 * scale, 16 * scale, -0.3, scale, leafG, goldDeep);
  acanthusLeaf(ctx, initX + initSize + 180 * scale, initY + 30 * scale, 16 * scale, 0.2, scale, leafGAlt, goldDeep);
  ctx.fillStyle = ruby;
  ctx.beginPath();
  ctx.arc(initX + initSize + 230 * scale, initY + 8 * scale, 4 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- The rest of the repo name, set large beside the initial ---
  const nameRemain = (repoName || '').slice(1);
  ctx.save();
  ctx.fillStyle = ink;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  let nameSize = 74 * scale;
  ctx.font = `italic 900 ${nameSize}px "Playfair Display", "EB Garamond", serif`;
  const nameMax = tw - initSize - 40 * scale;
  while (ctx.measureText(nameRemain).width > nameMax && nameSize > 28 * scale) {
    nameSize -= 2 * scale;
    ctx.font = `italic 900 ${nameSize}px "Playfair Display", "EB Garamond", serif`;
  }
  ctx.fillText(nameRemain, initX + initSize + 26 * scale, initY + initSize * 0.14);
  // Decorative red rule under name remain
  ctx.strokeStyle = ruby;
  ctx.lineWidth = 1.4 * scale;
  const nmW = ctx.measureText(nameRemain).width;
  ctx.beginPath();
  ctx.moveTo(initX + initSize + 26 * scale, initY + initSize * 0.14 + nameSize * 0.95);
  ctx.lineTo(initX + initSize + 26 * scale + nmW, initY + initSize * 0.14 + nameSize * 0.95);
  ctx.stroke();
  // gold parallel rule
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 0.6 * scale;
  ctx.beginPath();
  ctx.moveTo(initX + initSize + 26 * scale, initY + initSize * 0.14 + nameSize * 0.95 + 4 * scale);
  ctx.lineTo(initX + initSize + 26 * scale + nmW * 0.7, initY + initSize * 0.14 + nameSize * 0.95 + 4 * scale);
  ctx.stroke();
  ctx.restore();

  // Beneath the name, a small italic descriptor
  ctx.save();
  ctx.fillStyle = inkSoft;
  ctx.font = `italic 500 ${14 * scale}px "EB Garamond", serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(
    '— a · codex · set · forth · by · ' + (repoOwner || '').toLowerCase() + ' · in · the · tongue · of · ' + (language || '').toLowerCase() + ' —',
    initX + initSize + 26 * scale,
    initY + initSize * 0.14 + nameSize + 14 * scale,
  );
  ctx.restore();

  // --- Two-column body text (description) with rubricated versals ---
  const bodyTop = initY + initSize + 26 * scale;
  const bodyBot = height - fIn - 60 * scale;
  const colGap = 30 * scale;
  const colW = (tw - colGap) / 2;
  const colLeftX = tx;
  const colRightX = tx + colW + colGap;

  ctx.save();
  ctx.fillStyle = ink;
  ctx.font = `italic 500 ${17 * scale}px "EB Garamond", "Georgia", serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const lineH = 24 * scale;

  // Expand description to feel book-of-hours: repeat with latin filler interwoven
  const latin = ' ⁘ ora pro nobis ⁘ quia nominor leo ⁘ ad astra per aspera ⁘ ';
  const fullBody = (description + latin + description + latin).trim();
  const words = fullBody.split(/\s+/);
  // Layout into two columns manually with rubric first-letters
  const layout = (startX, startY, maxY) => {
    let line = '';
    let curY = startY;
    let first = true;
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const test = line + (line ? ' ' : '') + w;
      if (ctx.measureText(test).width > colW) {
        // paint current line
        if (first) {
          // Rubricate the first character in red
          const ch0 = line[0];
          const rest = line.slice(1);
          ctx.fillStyle = ruby;
          ctx.font = `900 ${lineH}px "Playfair Display", "EB Garamond", serif`;
          ctx.fillText(ch0, startX, curY - 3 * scale);
          const ch0w = ctx.measureText(ch0).width;
          ctx.fillStyle = ink;
          ctx.font = `italic 500 ${17 * scale}px "EB Garamond", "Georgia", serif`;
          ctx.fillText(rest, startX + ch0w + 2 * scale, curY);
          first = false;
        } else {
          ctx.fillStyle = ink;
          ctx.fillText(line, startX, curY);
        }
        line = w;
        curY += lineH;
        if (curY > maxY) return i;
      } else {
        line = test;
      }
    }
    if (curY <= maxY) {
      ctx.fillStyle = ink;
      ctx.fillText(line, startX, curY);
    }
    return words.length;
  };
  const consumed = layout(colLeftX, bodyTop, bodyBot);
  // Second column: advance past the consumed words
  if (consumed < words.length) {
    // Redraw from consumed point
    const rem = words.slice(consumed).join(' ');
    ctx.save();
    let line2 = '';
    let y2 = bodyTop;
    const rwords = rem.split(/\s+/);
    let first2 = true;
    for (let i = 0; i < rwords.length; i++) {
      const w = rwords[i];
      const test = line2 + (line2 ? ' ' : '') + w;
      if (ctx.measureText(test).width > colW) {
        if (first2) {
          const ch0 = line2[0];
          const rest = line2.slice(1);
          ctx.fillStyle = azure;
          ctx.font = `900 ${lineH}px "Playfair Display", "EB Garamond", serif`;
          ctx.fillText(ch0, colRightX, y2 - 3 * scale);
          const ch0w = ctx.measureText(ch0).width;
          ctx.fillStyle = ink;
          ctx.font = `italic 500 ${17 * scale}px "EB Garamond", "Georgia", serif`;
          ctx.fillText(rest, colRightX + ch0w + 2 * scale, y2);
          first2 = false;
        } else {
          ctx.fillStyle = ink;
          ctx.fillText(line2, colRightX, y2);
        }
        line2 = w;
        y2 += lineH;
        if (y2 > bodyBot) break;
      } else {
        line2 = test;
      }
    }
    if (y2 <= bodyBot) {
      ctx.fillStyle = ink;
      ctx.fillText(line2, colRightX, y2);
    }
    ctx.restore();
  }

  // Vertical rule between columns
  ctx.strokeStyle = goldDeep;
  ctx.lineWidth = 0.6 * scale;
  const sepX = colLeftX + colW + colGap / 2;
  ctx.beginPath();
  ctx.moveTo(sepX, bodyTop);
  ctx.lineTo(sepX, bodyBot);
  ctx.stroke();
  // Diamonds along the center rule
  for (let y = bodyTop + 40 * scale; y < bodyBot; y += 60 * scale) {
    ctx.fillStyle = ruby;
    ctx.beginPath();
    ctx.moveTo(sepX, y - 3 * scale);
    ctx.lineTo(sepX + 3 * scale, y);
    ctx.lineTo(sepX, y + 3 * scale);
    ctx.lineTo(sepX - 3 * scale, y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // --- Right side marginal stats column (overlays the right column start) ---
  // Actually, place stats as a rubric banner beneath the body in the inter-columnar strip.
  ctx.save();
  const rbY = bodyBot + 12 * scale;
  // Fill a ruby bar
  ctx.fillStyle = ruby;
  ctx.fillRect(tx, rbY, tw, 24 * scale);
  ctx.fillStyle = gold;
  ctx.fillRect(tx, rbY - 3 * scale, tw, 2 * scale);
  ctx.fillRect(tx, rbY + 24 * scale, tw, 2 * scale);

  ctx.fillStyle = '#fef0c8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `italic 700 ${13 * scale}px "EB Garamond", serif`;
  const rubricStats = `✦ STELLÆ · ${stars || '—'}   ⚔ FURCÆ · ${forks || '—'}   ⚜ LINGUA · ${(language || '—').toUpperCase()}   ☙ ANNO · MMXXVI`;
  ctx.fillText(rubricStats, width / 2, rbY + 12 * scale);
  ctx.restore();

  // --- Colophon at the very bottom within margin ---
  ctx.save();
  ctx.fillStyle = inkSoft;
  ctx.font = `italic 400 ${12 * scale}px "EB Garamond", serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText('explicit · scripsit per manus · ' + (repoOwner || 'anon'), tx, height - fIn - 10 * scale);
  if (supportUrl) {
    ctx.textAlign = 'right';
    ctx.fillStyle = ruby;
    ctx.font = `italic 700 ${12 * scale}px "EB Garamond", serif`;
    ctx.fillText('⚜ ' + supportUrl, tx + tw, height - fIn - 10 * scale);
  }
  ctx.restore();
};
