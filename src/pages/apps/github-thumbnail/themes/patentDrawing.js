import { wrapText } from '../utils';

export const patentDrawing = (ctx, width, height, scale, data) => {
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

  const S = scale;
  const SERIF = 'Georgia,"Times New Roman",serif';
  const MONO = '"JetBrains Mono","Courier New",ui-monospace,monospace';

  const owner = (repoOwner || '').trim() || 'inventor';
  const name = (repoName || '').trim() || 'apparatus';
  const desc = (description || '').trim() || 'A novel software apparatus and method of operation.';

  const seed = seedFrom(name);
  const rnd = (n) => mulberry(seed + n * 101);

  // --- Paper: aged off-white, tinted by bgColor ---
  const paper = mix(bgColor, '#F3EFE3', 0.85);
  const ink = '#1b1813';
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, width, height);

  // Faint speckle / age spots (seeded, very low alpha brown)
  ctx.save();
  for (let i = 0; i < 220; i++) {
    const sx = rnd(i + 1) * width;
    const sy = rnd(i + 500) * height;
    const r = (0.4 + rnd(i + 900) * 1.8) * S;
    ctx.globalAlpha = 0.025 + rnd(i + 1300) * 0.04;
    ctx.fillStyle = rnd(i + 60) > 0.5 ? '#6b5a40' : '#9a8763';
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Soft corner aging vignette
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#7a6a4a';
  ctx.fillRect(0, 0, width, 28 * S);
  ctx.fillRect(0, height - 28 * S, width, 28 * S);
  ctx.restore();

  const margin = 34 * S;

  // --- Sheet border (double rule) ---
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3 * S;
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
  ctx.lineWidth = 1 * S;
  ctx.strokeRect(margin + 8 * S, margin + 8 * S, width - margin * 2 - 16 * S, height - margin * 2 - 16 * S);

  const inX = margin + 20 * S;
  const inW = width - margin * 2 - 40 * S;

  // --- Faint rotated "PATENTED" stamp (secondaryColor) in a corner ---
  ctx.save();
  ctx.translate(width - margin - 150 * S, height - margin - 120 * S);
  ctx.rotate(-0.22);
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = secondaryColor;
  ctx.fillStyle = secondaryColor;
  ctx.lineWidth = 4 * S;
  ctx.beginPath();
  ctx.arc(0, 0, 90 * S, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 78 * S, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = `bold ${30 * S}px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PATENTED', 0, 0);
  ctx.font = `${13 * S}px ${MONO}`;
  ctx.fillText('GITHUB P.T.O.', 0, 26 * S);
  ctx.restore();
  ctx.textAlign = 'left';

  // --- HEADER (centered, serif) ---
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  ctx.font = `${17 * S}px ${SERIF}`;
  ctx.fillText('U N I T E D   S T A T E S   P A T E N T   O F F I C E', width / 2, margin + 44 * S);

  ctx.font = `bold ${46 * S}px ${SERIF}`;
  const title = truncate(ctx, name.toUpperCase(), inW - 80 * S, `bold ${46 * S}px ${SERIF}`);
  ctx.fillText(title, width / 2, margin + 92 * S);

  // Underline flourish
  ctx.lineWidth = 1.5 * S;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 120 * S, margin + 104 * S);
  ctx.lineTo(width / 2 + 120 * S, margin + 104 * S);
  ctx.stroke();

  // Reference row: Patent No. (left) / Filed (right) / Inventor (center below)
  const patNo = has(stars)
    ? String(Math.abs(parseInt(stars, 10) || 0) * 137 + 1000000).slice(0, 7).padEnd(7, '0')
    : String(2000000 + Math.floor(rnd(7) * 7999999)).slice(0, 7);
  const yyyy = 1998 + Math.floor(rnd(11) * 27);
  const mm = String(1 + Math.floor(rnd(13) * 12)).padStart(2, '0');
  const dd = String(1 + Math.floor(rnd(17) * 27)).padStart(2, '0');

  const refY = margin + 134 * S;
  ctx.font = `${15 * S}px ${SERIF}`;
  ctx.textAlign = 'left';
  ctx.fillText('Patent No. ', inX, refY);
  const labW = ctx.measureText('Patent No. ').width;
  ctx.font = `${15 * S}px ${MONO}`;
  ctx.fillText(`US ${patNo}`, inX + labW, refY);

  // Filed date (right-aligned): mono date, then serif label to its left.
  const dateStr = `${yyyy}-${mm}-${dd}`;
  ctx.textAlign = 'right';
  ctx.font = `${15 * S}px ${MONO}`;
  ctx.fillText(dateStr, inX + inW, refY);
  const dateW = ctx.measureText(dateStr).width;
  ctx.font = `${15 * S}px ${SERIF}`;
  ctx.fillText('Filed: ', inX + inW - dateW, refY);
  ctx.textAlign = 'left';

  ctx.textAlign = 'center';
  ctx.font = `italic ${15 * S}px ${SERIF}`;
  ctx.fillText(`Inventor: ${truncate(ctx, owner, 360 * S, `italic ${15 * S}px ${SERIF}`)}`, width / 2, refY + 22 * S);
  ctx.textAlign = 'left';

  // Header separator rule
  ctx.lineWidth = 1 * S;
  ctx.beginPath();
  ctx.moveTo(inX, refY + 38 * S);
  ctx.lineTo(inX + inW, refY + 38 * S);
  ctx.stroke();

  // ===================== THE FIGURE (left ~60%) =====================
  const figLeft = inX + 10 * S;
  const figTop = refY + 58 * S;
  const figW = inW * 0.6;
  const figH = height - margin - 60 * S - figTop;
  const fcx = figLeft + figW * 0.5;
  const fcy = figTop + figH * 0.46;

  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineWidth = 1.5 * S;
  ctx.lineJoin = 'round';

  // Seeded layout of a few components
  const highlightIdx = Math.floor(rnd(3) * 4); // which part gets the color accent

  // -- Component A: main body (rectangle with hatching) --
  const bodyW = (170 + rnd(21) * 40) * S;
  const bodyH = (120 + rnd(23) * 30) * S;
  const bx = fcx - bodyW * 0.5 - 30 * S;
  const by = fcy - bodyH * 0.5;
  strokeRect(ctx, bx, by, bodyW, bodyH);
  hatch(ctx, bx, by, bodyW * 0.42, bodyH, 10 * S, ink, 0.7 * S); // shaded left face

  // -- Component B: cylinder (right of body) --
  const cylX = bx + bodyW + 36 * S;
  const cylY = fcy - 44 * S;
  const cylW = 96 * S;
  const cylH = 88 * S;
  cylinder(ctx, cylX, cylY, cylW, cylH, S);

  // -- Component C: gear / wheel above body --
  const gearCx = bx + bodyW * 0.5;
  const gearCy = by - 64 * S;
  const gearR = 46 * S;
  gear(ctx, gearCx, gearCy, gearR, 12, S);
  // shaft linking gear to body
  ctx.beginPath();
  ctx.moveTo(gearCx, gearCy + gearR);
  ctx.lineTo(gearCx, by);
  ctx.stroke();

  // -- Component D: small circle node (sensor) at lower-left --
  const nodeX = bx - 4 * S;
  const nodeY = by + bodyH + 30 * S;
  const nodeR = 22 * S;
  ctx.beginPath();
  ctx.arc(nodeX, nodeY, nodeR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(nodeX, nodeY, nodeR * 0.45, 0, Math.PI * 2);
  ctx.stroke();
  // connector from node to body
  ctx.beginPath();
  ctx.moveTo(nodeX + nodeR, nodeY);
  ctx.lineTo(bx + 14 * S, by + bodyH);
  ctx.stroke();

  // -- Dashed hidden line through the body (internal mechanism) --
  ctx.save();
  ctx.setLineDash([7 * S, 6 * S]);
  ctx.beginPath();
  ctx.moveTo(bx + 8 * S, fcy);
  ctx.lineTo(cylX + cylW, fcy);
  ctx.stroke();
  ctx.restore();

  // -- ONE highlighted component in primaryColor (the only color on figure) --
  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3.5 * S;
  if (highlightIdx === 0) {
    strokeRect(ctx, bx, by, bodyW, bodyH);
  } else if (highlightIdx === 1) {
    ctx.beginPath();
    ctx.ellipse(cylX + cylW * 0.5, cylY, cylW * 0.5, 14 * S, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (highlightIdx === 2) {
    ctx.beginPath();
    ctx.arc(gearCx, gearCy, gearR * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = primaryColor;
    ctx.globalAlpha = 0.85;
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(nodeX, nodeY, nodeR, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // -- Numbered callouts (serif) with leader lines --
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineWidth = 1 * S;
  const callouts = [
    { n: 10, px: gearCx, py: gearCy - gearR, lx: gearCx + 70 * S, ly: gearCy - gearR - 20 * S },
    { n: 12, px: bx + bodyW * 0.5, py: by, lx: bx - 50 * S, ly: by - 18 * S },
    { n: 14, px: bx + bodyW, py: fcy, lx: cylX + cylW + 34 * S, ly: cylY - 24 * S },
    { n: 16, px: cylX + cylW * 0.5, py: cylY + cylH, lx: cylX + cylW + 40 * S, ly: cylY + cylH + 18 * S },
    { n: 20, px: nodeX, py: nodeY + nodeR, lx: nodeX - 46 * S, ly: nodeY + nodeR + 18 * S },
    { n: 22, px: bx, py: by + bodyH * 0.6, lx: bx - 50 * S, ly: by + bodyH * 0.6 },
  ];
  ctx.font = `italic ${17 * S}px ${SERIF}`;
  ctx.textBaseline = 'middle';
  callouts.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.px, c.py, 2 * S, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(c.px, c.py);
    ctx.lineTo(c.lx, c.ly);
    ctx.stroke();
    ctx.textAlign = c.lx < c.px ? 'right' : 'left';
    const off = c.lx < c.px ? -5 * S : 5 * S;
    ctx.fillText(String(c.n), c.lx + off, c.ly);
  });
  ctx.textAlign = 'left';

  // -- FIG. 1 label centered under the drawing --
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `bold ${22 * S}px ${SERIF}`;
  ctx.fillText('FIG. 1', figLeft + figW * 0.5, figTop + figH - 8 * S);
  ctx.textAlign = 'left';

  // ===================== RIGHT COLUMN: ABSTRACT / CLAIMS =====================
  const colX = figLeft + figW + 26 * S;
  const colW = inX + inW - colX;
  let colY = figTop + 6 * S;

  // vertical divider rule
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1 * S;
  ctx.beginPath();
  ctx.moveTo(colX - 14 * S, figTop);
  ctx.lineTo(colX - 14 * S, figTop + figH - 14 * S);
  ctx.stroke();

  ctx.fillStyle = ink;
  ctx.textBaseline = 'alphabetic';
  ctx.font = `bold ${20 * S}px ${SERIF}`;
  ctx.fillText('ABSTRACT', colX, colY);
  colY += 8 * S;
  ctx.lineWidth = 1 * S;
  ctx.beginPath();
  ctx.moveTo(colX, colY);
  ctx.lineTo(colX + colW, colY);
  ctx.stroke();
  colY += 26 * S;

  ctx.font = `${16 * S}px ${SERIF}`;
  const claim = `1. A system (12) comprising a primary assembly and a coupled module (14), the ${name} being configured such that ${desc}`;
  const claimText = claim.length > 360 ? claim.slice(0, 357).trimEnd() + '…' : claim;
  wrapText(ctx, claimText, colX, colY, colW, 23 * S);

  // Lower note line referencing callouts
  const noteY = figTop + figH * 0.62;
  ctx.font = `italic ${14 * S}px ${SERIF}`;
  ctx.fillStyle = mix(ink, paper, 0.25);
  wrapText(
    ctx,
    `2. The system of claim 1, wherein the sensor (20) and drive gear (10) cooperate as shown in FIG. 1.`,
    colX,
    noteY,
    colW,
    22 * S,
  );
  ctx.fillStyle = ink;

  // -- Tiny mono notes (stars / forks / language / url) at bottom of column --
  let metaY = figTop + figH - 60 * S;
  ctx.font = `${13 * S}px ${MONO}`;
  ctx.fillStyle = mix(ink, paper, 0.2);
  if (has(forks)) {
    ctx.fillText(`Sheet 1 of ${forks}`, colX, metaY);
    metaY += 20 * S;
  }
  if (has(stars)) {
    ctx.fillText(`Cl. ${stars}`, colX, metaY);
    metaY += 20 * S;
  }
  if (has(language)) {
    ctx.fillText(`Int. Cl. ${truncate(ctx, language, colW - 70 * S, `${13 * S}px ${MONO}`)}`, colX, metaY);
    metaY += 20 * S;
  }
  ctx.fillStyle = ink;

  // --- Footer: support URL (secondary accent) ---
  if (has(supportUrl)) {
    ctx.font = `${12 * S}px ${MONO}`;
    ctx.fillStyle = secondaryColor;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(
      truncate(ctx, supportUrl, inW * 0.5, `${12 * S}px ${MONO}`),
      inX + inW,
      height - margin - 16 * S,
    );
    ctx.textAlign = 'left';
    ctx.fillStyle = ink;
  }

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
};

// ---------------- figure helpers ----------------
function strokeRect(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.stroke();
}

function hatch(ctx, x, y, w, h, gap, color, lw) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  for (let i = -h; i < w + h; i += gap) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i + h, y + h);
    ctx.stroke();
  }
  ctx.restore();
}

function cylinder(ctx, x, y, w, h, S) {
  const ry = 14 * S;
  // top ellipse
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y, w / 2, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  // sides
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + h);
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w, y + h);
  ctx.stroke();
  // bottom arc
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h, w / 2, ry, 0, 0, Math.PI);
  ctx.stroke();
}

function gear(ctx, cx, cy, r, teeth, S) {
  const inner = r * 0.78;
  ctx.beginPath();
  for (let i = 0; i <= teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const a1 = ((i + 0.5) / teeth) * Math.PI * 2;
    ctx.lineTo(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r);
    ctx.lineTo(cx + Math.cos(a1) * inner, cy + Math.sin(a1) * inner);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.28, 0, Math.PI * 2);
  ctx.stroke();
}

// ---------------- generic helpers ----------------
function parseHex(hex){const h=(hex||'#000').replace('#','');const f=h.length===3?h.split('').map(c=>c+c).join(''):h;return{r:parseInt(f.slice(0,2),16)||0,g:parseInt(f.slice(2,4),16)||0,b:parseInt(f.slice(4,6),16)||0};}
function rgbToHex(r,g,b){const h=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');return '#'+h(r)+h(g)+h(b);}
function mix(a,b,t){const x=parseHex(a),y=parseHex(b);return rgbToHex(x.r+(y.r-x.r)*t,x.g+(y.g-x.g)*t,x.b+(y.b-x.b)*t);}
function seedFrom(str){let s=0;for(const c of (str||'x'))s=(s*31+c.charCodeAt(0))|0;return Math.abs(s)||1;}
function mulberry(seed){let t=(seed*1831565813)|0;t=(t+0x6D2B79F5)|0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return ((r^(r>>>14))>>>0)/4294967296;}
function has(v){return v!==undefined&&v!==null&&String(v).trim()!=='';}
function truncate(ctx,text,maxW,font){ctx.font=font;if(ctx.measureText(text).width<=maxW)return text;let t=text;while(t.length>1&&ctx.measureText(t+'…').width>maxW)t=t.slice(0,-1);return t+'…';}
