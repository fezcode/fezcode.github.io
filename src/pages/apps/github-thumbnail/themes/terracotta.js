import { wrapText } from '../utils';

/*
 * TERRACOTTA — a Plumb-brand letterpress broadside.
 *
 * Bone paper, terra ink, brass and sage accents. Fraunces italic for the
 * repo name, IBM Plex Mono for meta. Signature details: registration
 * crosshairs in the four corners, a double edge rule, a plumb-bob hung on
 * a thin cord in the upper-right, and a hatched field at bottom-left.
 * Rendered deterministically from the repo seed.
 */
export const terracotta = (ctx, width, height, scale, data) => {
  const { repoOwner, repoName, description, language, stars } = data;

  /* Palette */
  const BONE = '#F3ECE0';
  const BONE_DEEP = '#E8DECE';
  const INK = '#1A1613';
  const INK_SOFT = '#2E2620';
  const TERRA = '#C96442';
  const TERRA_DEEP = '#9E4A2F';
  const BRASS = '#B88532';
  const SAGE = '#6B8E23';
  const RULE = 'rgba(26,22,19,0.2)';

  /* Seeded RNG */
  const seed = `${repoOwner || ''}${repoName || ''}`;
  let h = 0xc9_64_42_f0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  }
  const rng = () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };

  /* Fonts */
  const serif = '"Fraunces", "Times New Roman", serif';
  const mono = '"IBM Plex Mono", "JetBrains Mono", monospace';

  /* Background — bone paper with a warm radial bloom */
  ctx.fillStyle = BONE;
  ctx.fillRect(0, 0, width, height);

  const grad = ctx.createRadialGradient(
    width * 0.82,
    height * -0.1,
    0,
    width * 0.82,
    height * -0.1,
    width * 0.9,
  );
  grad.addColorStop(0, BONE_DEEP);
  grad.addColorStop(1, BONE);
  ctx.fillStyle = grad;
  ctx.globalAlpha = 0.55;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1;

  /* Paper grain — speckles */
  ctx.save();
  for (let i = 0; i < 520; i++) {
    const cx = rng() * width;
    const cy = rng() * height;
    const r = rng() * 1.4 * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(26,22,19,${0.05 + rng() * 0.07})`;
    ctx.fill();
  }
  ctx.restore();

  /* Double edge rule */
  const margin = 44 * scale;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.2 * scale;
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 0.8 * scale;
  ctx.strokeRect(
    margin + 6 * scale,
    margin + 6 * scale,
    width - margin * 2 - 12 * scale,
    height - margin * 2 - 12 * scale,
  );

  /* Registration crosshairs in the four corners */
  const drawCrosshair = (cx, cy) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(26,22,19,0.55)';
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, 8 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 14 * scale, cy);
    ctx.lineTo(cx + 14 * scale, cy);
    ctx.moveTo(cx, cy - 14 * scale);
    ctx.lineTo(cx, cy + 14 * scale);
    ctx.stroke();
    ctx.restore();
  };
  const cOff = 20 * scale;
  drawCrosshair(cOff, cOff);
  drawCrosshair(width - cOff, cOff);
  drawCrosshair(cOff, height - cOff);
  drawCrosshair(width - cOff, height - cOff);

  /* Top kicker — mono colophon strip */
  ctx.save();
  ctx.fillStyle = TERRA;
  ctx.beginPath();
  ctx.arc(margin + 14 * scale, margin + 34 * scale, 5 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = INK_SOFT;
  ctx.font = `500 ${16 * scale}px ${mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const kicker = `FEZCODEX · PLATE № ${(
    Math.floor(rng() * 99) + 1
  )
    .toString()
    .padStart(2, '0')} · MMXXVI`;
  ctx.fillText(kicker, margin + 28 * scale, margin + 34 * scale);

  ctx.strokeStyle = RULE;
  ctx.lineWidth = 1 * scale;
  const kickerTextWidth = ctx.measureText(kicker).width;
  const ruleStart = margin + 28 * scale + kickerTextWidth + 20 * scale;
  ctx.beginPath();
  ctx.moveTo(ruleStart, margin + 34 * scale);
  ctx.lineTo(width - margin - 220 * scale, margin + 34 * scale);
  ctx.stroke();

  ctx.fillStyle = TERRA_DEEP;
  ctx.textAlign = 'right';
  ctx.fillText('A CODEX ENTRY', width - margin - 14 * scale, margin + 34 * scale);
  ctx.restore();

  /* Plumb-bob mark — hung on a cord in the upper-right */
  ctx.save();
  const bobCx = width * 0.82;
  const cordTop = margin + 60 * scale;
  const cordBottom = height * 0.46;
  const bobBase = cordBottom;
  const bobSize = 58 * scale;

  // cord
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  ctx.moveTo(bobCx, cordTop);
  ctx.lineTo(bobCx, bobBase);
  ctx.stroke();

  // cap — small ink square at the top of the bob (brass cap)
  ctx.fillStyle = BRASS;
  ctx.fillRect(
    bobCx - 6 * scale,
    bobBase - 4 * scale,
    12 * scale,
    8 * scale,
  );
  ctx.strokeStyle = INK;
  ctx.lineWidth = 0.8 * scale;
  ctx.strokeRect(
    bobCx - 6 * scale,
    bobBase - 4 * scale,
    12 * scale,
    8 * scale,
  );

  // the teardrop bob — faceted terra body
  ctx.fillStyle = TERRA;
  ctx.beginPath();
  ctx.moveTo(bobCx - bobSize / 2, bobBase + 4 * scale);
  ctx.lineTo(bobCx + bobSize / 2, bobBase + 4 * scale);
  ctx.lineTo(bobCx + bobSize / 2 - 2 * scale, bobBase + bobSize * 0.55);
  ctx.lineTo(bobCx, bobBase + bobSize * 1.4);
  ctx.lineTo(bobCx - bobSize / 2 + 2 * scale, bobBase + bobSize * 0.55);
  ctx.closePath();
  ctx.fill();

  // chisel line down the middle
  ctx.strokeStyle = TERRA_DEEP;
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(bobCx, bobBase + 4 * scale);
  ctx.lineTo(bobCx, bobBase + bobSize * 1.4);
  ctx.stroke();

  // gleam — thin highlight
  ctx.strokeStyle = 'rgba(243,236,224,0.55)';
  ctx.lineWidth = 1.4 * scale;
  ctx.beginPath();
  ctx.moveTo(bobCx - bobSize / 4, bobBase + 10 * scale);
  ctx.lineTo(bobCx - bobSize / 8, bobBase + bobSize * 0.9);
  ctx.stroke();

  // outline
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(bobCx - bobSize / 2, bobBase + 4 * scale);
  ctx.lineTo(bobCx + bobSize / 2, bobBase + 4 * scale);
  ctx.lineTo(bobCx + bobSize / 2 - 2 * scale, bobBase + bobSize * 0.55);
  ctx.lineTo(bobCx, bobBase + bobSize * 1.4);
  ctx.lineTo(bobCx - bobSize / 2 + 2 * scale, bobBase + bobSize * 0.55);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  /* Hatched field — bottom-left decorative ornament */
  ctx.save();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 0.8 * scale;
  const hatchX = margin + 14 * scale;
  const hatchY = height - margin - 120 * scale;
  const hatchW = 200 * scale;
  const hatchH = 60 * scale;
  for (let i = 0; i < 26; i++) {
    const x1 = hatchX + (hatchW * i) / 25;
    ctx.beginPath();
    ctx.moveTo(x1, hatchY);
    ctx.lineTo(x1 - hatchH * 0.55, hatchY + hatchH);
    ctx.stroke();
  }
  // thin fleuron dot line below
  for (let i = 0; i < 5; i++) {
    const fx = hatchX + (hatchW * i) / 4;
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(fx, hatchY + hatchH + 14 * scale, 1.6 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  /* Repo owner — mono, tracked uppercase */
  ctx.save();
  ctx.fillStyle = INK_SOFT;
  ctx.font = `500 ${20 * scale}px ${mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  const ownerLabel = (repoOwner || '').toUpperCase().split('').join(' ');
  ctx.fillText(ownerLabel, margin + 14 * scale, height * 0.34);
  ctx.restore();

  /* Repo name — giant Fraunces italic with terra period */
  ctx.save();
  ctx.fillStyle = INK;
  const repoFontSize = repoName && repoName.length > 14 ? 96 : 128;
  ctx.font = `italic 500 ${repoFontSize * scale}px ${serif}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  const nameY = height * 0.52;
  ctx.fillText(repoName || 'untitled', margin + 14 * scale, nameY);

  const nameW = ctx.measureText(repoName || 'untitled').width;
  ctx.fillStyle = TERRA;
  ctx.font = `900 ${repoFontSize * scale}px ${serif}`;
  ctx.fillText('.', margin + 14 * scale + nameW, nameY);
  ctx.restore();

  /* Description — Fraunces italic body */
  ctx.save();
  ctx.fillStyle = INK_SOFT;
  ctx.font = `italic 400 ${28 * scale}px ${serif}`;
  ctx.textAlign = 'left';
  wrapText(
    ctx,
    description || '',
    margin + 14 * scale,
    height * 0.62,
    Math.min(width * 0.62, 760 * scale),
    42 * scale,
  );
  ctx.restore();

  /* Bottom dictionary-entry footer */
  ctx.save();
  const footY = height - margin - 34 * scale;
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 0.8 * scale;
  ctx.beginPath();
  ctx.moveTo(margin + 14 * scale, footY - 18 * scale);
  ctx.lineTo(width - margin - 14 * scale, footY - 18 * scale);
  ctx.stroke();

  // language — sage label
  ctx.fillStyle = SAGE;
  ctx.font = `500 ${13 * scale}px ${mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(
    `LANG ·`,
    margin + 14 * scale,
    footY,
  );
  ctx.fillStyle = INK;
  ctx.fillText(
    `${(language || 'n/a').toUpperCase()}`,
    margin + 14 * scale + 70 * scale,
    footY,
  );

  // stars — brass label
  ctx.fillStyle = BRASS;
  const starsLabelX = margin + 14 * scale + 260 * scale;
  ctx.fillText('STARS ·', starsLabelX, footY);
  ctx.fillStyle = INK;
  ctx.fillText(String(stars ?? 0), starsLabelX + 80 * scale, footY);

  // handle right-aligned
  ctx.fillStyle = TERRA_DEEP;
  ctx.textAlign = 'right';
  ctx.fillText(
    `${repoOwner || '—'} / ${repoName || '—'}`,
    width - margin - 14 * scale,
    footY,
  );

  // signature italic
  ctx.fillStyle = INK_SOFT;
  ctx.font = `italic 400 ${16 * scale}px ${serif}`;
  ctx.textAlign = 'left';
  ctx.fillText(
    '— set from the stone, read in order.',
    margin + 14 * scale,
    height - margin + 22 * scale,
  );
  ctx.restore();
};
