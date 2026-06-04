import { wrapText } from '../utils';

export const seedPacket = (ctx, width, height, scale, data) => {
  const {
    primaryColor = '#3f7d4e',
    secondaryColor = '#c8642f',
    bgColor = '#7a6a4f',
    repoOwner = '',
    repoName = '',
    description = '',
    language = '',
    stars = '',
    forks = '',
    supportUrl = '',
  } = data || {};

  const S = (n) => n * scale;
  const SERIF = 'Georgia, "Times New Roman", serif';
  const SANS = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const MONO = '"JetBrains Mono", "Courier New", ui-monospace, monospace';

  const owner = (repoOwner || 'owner').trim();
  const name = (repoName || 'repository').trim();
  const desc = (description || '').trim();
  const lang = (language || '').trim();

  const seed = seedFrom(repoName || 'seed');
  const zone = 3 + Math.floor(mulberry(seed + 11) * 7); // hardiness zone 3-9
  const leafCount = 3 + Math.floor(mulberry(seed + 5) * 3); // 3-5 leaves

  const PAPER = '#F3E9CF';
  const PAPER_SHADE = mix(PAPER, '#000000', 0.08);
  const INK = '#3a2f22';
  const INK_SOFT = mix(INK, PAPER, 0.32);

  // ---------------------------------------------------------------
  // GROUND — warm surface with seeded speckle
  // ---------------------------------------------------------------
  const ground = mix(bgColor, '#C9B89A', 0.4);
  ctx.fillStyle = ground;
  ctx.fillRect(0, 0, width, height);

  // Subtle vertical linen sheen
  const sheen = ctx.createLinearGradient(0, 0, width, height);
  sheen.addColorStop(0, hexA(lighten(ground, 0.06), 0.5));
  sheen.addColorStop(0.5, hexA(ground, 0));
  sheen.addColorStop(1, hexA(mix(ground, '#000000', 0.18), 0.4));
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, width, height);

  // Faint soil/linen weave texture
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = mix(ground, '#000000', 0.4);
  ctx.lineWidth = S(1);
  for (let y = 0; y < height; y += S(9)) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // Seeded speckle
  ctx.save();
  for (let i = 0; i < 220; i++) {
    const rx = mulberry(seed + i * 2 + 1);
    const ry = mulberry(seed + i * 2 + 2);
    const x = rx * width;
    const y = ry * height;
    const sz = (0.5 + mulberry(seed + i) * 1.6) * scale;
    ctx.globalAlpha = 0.05 + mulberry(seed + i + 3) * 0.07;
    ctx.fillStyle = i % 4 === 0 ? lighten(ground, 0.1) : mix(ground, '#000000', 0.35);
    ctx.beginPath();
    ctx.arc(x, y, sz, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // ---------------------------------------------------------------
  // THE PACKET — tall portrait, center-left
  // ---------------------------------------------------------------
  const pkW = S(420);
  const pkH = S(560);
  const pkX = S(80);
  const pkY = (height - pkH) / 2;

  // Drop shadow
  ctx.save();
  ctx.fillStyle = hexA('#000000', 0.28);
  roundRectPath(ctx, pkX + S(10), pkY + S(14), pkW, pkH, S(6));
  ctx.fill();
  ctx.restore();

  // Paper body
  ctx.save();
  const paperGrad = ctx.createLinearGradient(pkX, pkY, pkX, pkY + pkH);
  paperGrad.addColorStop(0, lighten(PAPER, 0.03));
  paperGrad.addColorStop(1, PAPER_SHADE);
  ctx.fillStyle = paperGrad;
  roundRectPath(ctx, pkX, pkY, pkW, pkH, S(6));
  ctx.fill();
  ctx.restore();

  // Clip everything to the packet so the torn top reads cleanly
  ctx.save();
  roundRectPath(ctx, pkX, pkY, pkW, pkH, S(6));
  ctx.clip();

  // Torn-open top edge: carve a sawtooth out of the paper using the ground
  const tearBase = pkY + S(26);
  const teeth = 12;
  const toothW = pkW / teeth;
  ctx.fillStyle = ground;
  ctx.beginPath();
  ctx.moveTo(pkX, pkY - S(2));
  ctx.lineTo(pkX, tearBase);
  for (let i = 0; i < teeth; i++) {
    const tx = pkX + i * toothW;
    const dip = S(6) + mulberry(seed + i + 40) * S(14);
    ctx.lineTo(tx + toothW * 0.5, tearBase - dip);
    ctx.lineTo(tx + toothW, tearBase);
  }
  ctx.lineTo(pkX + pkW, pkY - S(2));
  ctx.closePath();
  ctx.fill();

  // Tiny torn-fiber shading along the cut
  ctx.strokeStyle = hexA(INK, 0.18);
  ctx.lineWidth = S(1);
  ctx.beginPath();
  ctx.moveTo(pkX, tearBase);
  for (let i = 0; i < teeth; i++) {
    const tx = pkX + i * toothW;
    const dip = S(6) + mulberry(seed + i + 40) * S(14);
    ctx.lineTo(tx + toothW * 0.5, tearBase - dip);
    ctx.lineTo(tx + toothW, tearBase);
  }
  ctx.stroke();

  const contentTop = tearBase + S(6);

  // TOP BANNER — primaryColor band
  const bannerH = S(70);
  ctx.fillStyle = primaryColor;
  ctx.fillRect(pkX, contentTop, pkW, bannerH);
  ctx.fillStyle = hexA('#000000', 0.12);
  ctx.fillRect(pkX, contentTop + bannerH - S(5), pkW, S(5));
  const onBanner = readableOn(primaryColor);
  ctx.fillStyle = onBanner;
  ctx.font = `700 ${S(22)}px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  drawTracked(ctx, 'GITHUB SEEDS', pkX + pkW / 2, contentTop + bannerH / 2, S(6));
  ctx.textAlign = 'left';

  // Thin printed inner border
  const inset = S(14);
  ctx.strokeStyle = hexA(INK, 0.55);
  ctx.lineWidth = S(1.5);
  ctx.strokeRect(
    pkX + inset,
    contentTop + bannerH + S(8),
    pkW - inset * 2,
    pkY + pkH - (contentTop + bannerH + S(8)) - inset
  );

  // ILLUSTRATION WINDOW — framed oval with botanical drawing
  const winCX = pkX + pkW / 2;
  const winY = contentTop + bannerH + S(28);
  const winW = pkW - S(80);
  const winH = S(196);
  const winCY = winY + winH / 2;

  // Window background (aged off-white)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(winCX, winCY, winW / 2, winH / 2, 0, 0, Math.PI * 2);
  ctx.fillStyle = lighten(PAPER, 0.05);
  ctx.fill();
  ctx.clip();

  // Engraving hatch backdrop
  ctx.strokeStyle = hexA(primaryColor, 0.08);
  ctx.lineWidth = S(1);
  for (let y = winCY - winH; y < winCY + winH; y += S(6)) {
    ctx.beginPath();
    ctx.moveTo(winCX - winW, y);
    ctx.lineTo(winCX + winW, y);
    ctx.stroke();
  }

  drawPlant(ctx, winCX, winCY + winH * 0.42, winH, scale, primaryColor, secondaryColor, seed, leafCount);
  ctx.restore();

  // Window frame (double oval)
  ctx.strokeStyle = INK;
  ctx.lineWidth = S(3);
  ctx.beginPath();
  ctx.ellipse(winCX, winCY, winW / 2, winH / 2, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = hexA(INK, 0.5);
  ctx.lineWidth = S(1.5);
  ctx.beginPath();
  ctx.ellipse(winCX, winCY, winW / 2 - S(6), winH / 2 - S(6), 0, 0, Math.PI * 2);
  ctx.stroke();

  // VARIETY NAME (display serif)
  const nameY = winCY + winH / 2 + S(40);
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${S(38)}px ${SERIF}`;
  const packName = truncate(ctx, name, pkW - S(60), `700 ${S(38)}px ${SERIF}`);
  ctx.fillText(packName, winCX, nameY);

  // Owner strain (italic)
  ctx.font = `italic ${S(18)}px ${SERIF}`;
  ctx.fillStyle = INK_SOFT;
  const strain = truncate(ctx, `@${owner} Strain`, pkW - S(60), `italic ${S(18)}px ${SERIF}`);
  ctx.fillText(strain, winCX, nameY + S(28));

  // "{language} cultivar" line
  if (has(lang)) {
    ctx.font = `${S(13)}px ${SANS}`;
    ctx.fillStyle = secondaryColor;
    drawTracked(ctx, `${lang.toUpperCase()} CULTIVAR`, winCX, nameY + S(52), S(3));
  }
  ctx.textAlign = 'left';

  // BOTTOM INFO PANEL — bordered facts box
  const panelX = pkX + inset + S(8);
  const panelW = pkW - inset * 2 - S(16);
  const panelH = S(118);
  const panelY = pkY + pkH - inset - panelH - S(8);

  ctx.fillStyle = hexA(secondaryColor, 0.08);
  roundRectPath(ctx, panelX, panelY, panelW, panelH, S(4));
  ctx.fill();
  ctx.strokeStyle = hexA(INK, 0.55);
  ctx.lineWidth = S(1.5);
  roundRectPath(ctx, panelX, panelY, panelW, panelH, S(4));
  ctx.stroke();

  // Panel header
  ctx.fillStyle = INK;
  ctx.font = `italic 700 ${S(15)}px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Planting Instructions', panelX + panelW / 2, panelY + S(20));
  ctx.beginPath();
  ctx.moveTo(panelX + S(14), panelY + S(28));
  ctx.lineTo(panelX + panelW - S(14), panelY + S(28));
  ctx.strokeStyle = hexA(INK, 0.4);
  ctx.lineWidth = S(1);
  ctx.stroke();

  // Build the fact list (skip missing fields)
  const facts = [['Sow Depth', '¼ in']];
  if (has(forks)) facts.push(['Days to Sprout', String(forks)]);
  if (has(stars)) facts.push(['Yield', `★ ${stars}`]);
  if (has(lang)) facts.push(['Full Sun', lang]);
  facts.push(['Hardiness', `zone ${zone}`]);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const colX = [panelX + S(16), panelX + panelW / 2 + S(8)];
  const rowH = S(26);
  const factTop = panelY + S(46);
  facts.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const fx = colX[col];
    const fy = factTop + row * rowH;
    ctx.font = `${S(11)}px ${SANS}`;
    ctx.fillStyle = INK_SOFT;
    drawTracked(ctx, f[0].toUpperCase(), fx, fy, S(1.2), 'left');
    ctx.font = `700 ${S(15)}px ${SERIF}`;
    ctx.fillStyle = INK;
    const val = truncate(ctx, f[1], panelW / 2 - S(28), `700 ${S(15)}px ${SERIF}`);
    ctx.fillText(val, fx, fy + S(13));
  });
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  ctx.restore(); // end packet clip

  // Packet outer hairline
  ctx.strokeStyle = hexA(INK, 0.4);
  ctx.lineWidth = S(1);
  roundRectPath(ctx, pkX, pkY, pkW, pkH, S(6));
  ctx.stroke();

  // ---------------------------------------------------------------
  // RIGHT SIDE — repo heading + description + support
  // ---------------------------------------------------------------
  const rx = pkX + pkW + S(70);
  const rW = width - rx - S(70);

  // Small eyebrow
  ctx.fillStyle = hexA(readableOn(ground) === '#ffffff' ? '#ffffff' : INK, 0.7);
  ctx.font = `${S(15)}px ${MONO}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  const eyebrowY = height * 0.3;
  ctx.fillText(`${owner} /`, rx, eyebrowY);

  // Repo heading
  const headInk = readableOn(ground) === '#ffffff' ? '#fbf4e4' : INK;
  ctx.fillStyle = headInk;
  ctx.font = `700 ${S(52)}px ${SERIF}`;
  const headName = truncate(ctx, name, rW, `700 ${S(52)}px ${SERIF}`);
  ctx.fillText(headName, rx, eyebrowY + S(56));

  // Accent underline (secondaryColor)
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(rx, eyebrowY + S(74), Math.min(rW, S(120)), S(6));

  // Description (muted brown, wrapped)
  if (has(desc)) {
    ctx.fillStyle = hexA(headInk, 0.85);
    ctx.font = `${S(22)}px ${SERIF}`;
    ctx.textBaseline = 'alphabetic';
    const clipped = clampLines(ctx, desc, rW, 3);
    wrapText(ctx, clipped, rx, eyebrowY + S(118), rW, S(32));
  }

  // Support URL
  if (has(supportUrl)) {
    ctx.fillStyle = secondaryColor;
    ctx.font = `${S(15)}px ${MONO}`;
    const url = truncate(ctx, supportUrl, rW, `${S(15)}px ${MONO}`);
    ctx.fillText(`❤ ${url}`, rx, height - S(60));
  }
};

// =================================================================
// Helpers (hoisted)
// =================================================================
function drawPlant(ctx, baseX, baseY, areaH, scale, primary, secondary, seed, leaves) {
  const S = (n) => n * scale;
  const stemH = areaH * 0.7;
  const topX = baseX + (mulberry(seed + 7) - 0.5) * S(20);
  const topY = baseY - stemH;
  const midX = baseX + (mulberry(seed + 8) - 0.5) * S(34);
  const midY = baseY - stemH * 0.5;

  // Soil mound
  ctx.fillStyle = hexA(mix(primary, '#3a2f22', 0.6), 0.55);
  ctx.beginPath();
  ctx.ellipse(baseX, baseY + S(2), S(34), S(8), 0, 0, Math.PI * 2);
  ctx.fill();

  // Stem
  ctx.strokeStyle = primary;
  ctx.lineWidth = S(3.5);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.quadraticCurveTo(midX, midY, topX, topY);
  ctx.stroke();

  // Leaves alternating along the stem
  for (let i = 0; i < leaves; i++) {
    const t = 0.22 + (i / leaves) * 0.6;
    const lx = baseX + (midX - baseX) * (t * 2 < 1 ? t * 2 : 1) + (topX - baseX) * (t * t);
    const ly = baseY - stemH * t;
    const side = i % 2 === 0 ? 1 : -1;
    const len = S(48) - i * S(4);
    const wob = (mulberry(seed + i + 20) - 0.5) * S(18);
    drawLeaf(ctx, lx, ly, side, len, wob, scale, secondary, primary);
  }

  // Flower / sprout at the top
  drawBloom(ctx, topX, topY, scale, primary, secondary, seed);
  ctx.lineCap = 'butt';
}

function drawLeaf(ctx, x, y, side, len, wob, scale, fill, stroke) {
  const S = (n) => n * scale;
  const tipX = x + side * len;
  const tipY = y - len * 0.4 + wob;
  ctx.save();
  ctx.fillStyle = hexA(fill, 0.55);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = S(1.6);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + side * len * 0.5, y - len * 0.55, tipX, tipY);
  ctx.quadraticCurveTo(x + side * len * 0.45, y + len * 0.12, x, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Vein
  ctx.strokeStyle = hexA(stroke, 0.6);
  ctx.lineWidth = S(1);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + side * len * 0.5, y - len * 0.2, tipX, tipY);
  ctx.stroke();
  ctx.restore();
}

function drawBloom(ctx, x, y, scale, primary, secondary, seed) {
  const S = (n) => n * scale;
  const petals = 6 + Math.floor(mulberry(seed + 30) * 3);
  const r = S(20);
  ctx.save();
  ctx.strokeStyle = secondary;
  ctx.lineWidth = S(1.6);
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2 + mulberry(seed + 31);
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    ctx.fillStyle = hexA(secondary, 0.5);
    ctx.beginPath();
    ctx.ellipse(px, py, S(10), S(6), a, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  // Center
  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.arc(x, y, S(8), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hexA('#000000', 0.25);
  ctx.beginPath();
  ctx.arc(x, y, S(4), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTracked(ctx, text, x, y, spacing, align) {
  const al = align || 'center';
  const chars = String(text).split('');
  let total = 0;
  for (const c of chars) total += ctx.measureText(c).width + spacing;
  total -= spacing;
  let startX;
  if (al === 'center') startX = x - total / 2;
  else if (al === 'right') startX = x - total;
  else startX = x;
  const prevAlign = ctx.textAlign;
  ctx.textAlign = 'left';
  let cx = startX;
  for (const c of chars) {
    ctx.fillText(c, cx, y);
    cx += ctx.measureText(c).width + spacing;
  }
  ctx.textAlign = prevAlign;
}

function clampLines(ctx, text, maxW, maxLines) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = words[i];
      if (lines.length === maxLines) break;
    } else {
      line = test;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  let result = lines.slice(0, maxLines).join(' ');
  // If we truncated content, add an ellipsis to the visible text
  const used = lines.slice(0, maxLines).join(' ').split(/\s+/).length;
  if (used < words.length) {
    result = result.replace(/\s*\S*$/, '') + '…';
  }
  return result;
}

function parseHex(hex){const h=(hex||'#000').replace('#','');const f=h.length===3?h.split('').map(c=>c+c).join(''):h;return{r:parseInt(f.slice(0,2),16)||0,g:parseInt(f.slice(2,4),16)||0,b:parseInt(f.slice(4,6),16)||0};}
function rgbToHex(r,g,b){const h=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');return '#'+h(r)+h(g)+h(b);}
function mix(a,b,t){const x=parseHex(a),y=parseHex(b);return rgbToHex(x.r+(y.r-x.r)*t,x.g+(y.g-x.g)*t,x.b+(y.b-x.b)*t);}
function lighten(hex,a){const{r,g,b}=parseHex(hex);return rgbToHex(r+255*a,g+255*a,b+255*a);}
function hexA(hex,al){const{r,g,b}=parseHex(hex);return `rgba(${r}, ${g}, ${b}, ${al})`;}
function readableOn(hex){const{r,g,b}=parseHex(hex);return (0.299*r+0.587*g+0.114*b)>150?'#111111':'#ffffff';}
function seedFrom(str){let s=0;for(const c of (str||'x'))s=(s*31+c.charCodeAt(0))|0;return Math.abs(s)||1;}
function mulberry(seed){let t=(seed*1831565813)|0;t=(t+0x6D2B79F5)|0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return ((r^(r>>>14))>>>0)/4294967296;}
function has(v){return v!==undefined&&v!==null&&String(v).trim()!=='';}
function truncate(ctx,text,maxW,font){ctx.font=font;if(ctx.measureText(text).width<=maxW)return text;let t=text;while(t.length>1&&ctx.measureText(t+'…').width>maxW)t=t.slice(0,-1);return t+'…';}
function roundRectPath(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}
