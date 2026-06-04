import { wrapText } from '../utils';

export const nutritionFacts = (ctx, width, height, scale, data) => {
  const {
    primaryColor = '#2563eb',
    secondaryColor = '#16a34a',
    bgColor = '#f1efe6',
    repoOwner = '',
    repoName = '',
    description = '',
    language = '',
    stars = '',
    forks = '',
    supportUrl = '',
  } = data || {};

  // The FDA label uses a Helvetica-like sans; branding mixes sans + serif.
  const sans = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const mono = '"JetBrains Mono", "Courier New", ui-monospace, monospace';
  const serif = 'Georgia, "Times New Roman", serif';

  const seed = seedFrom(repoName || 'repo');
  // Deterministic 0..100% daily values for each itemized row.
  const pct = (n) => Math.round(mulberry(seed + n) * 100);
  const owner = repoOwner || '';

  // ---------------------------------------------------------------- Ground
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, lighten(bgColor, 0.03));
  grad.addColorStop(1, mix(bgColor, primaryColor, 0.06));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle diagonal hatch tint for texture (very low alpha).
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = readableOn(bgColor) === '#ffffff' ? '#ffffff' : '#000000';
  ctx.lineWidth = 1 * scale;
  for (let x = -height; x < width; x += 26 * scale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + height, height);
    ctx.stroke();
  }
  ctx.restore();

  // ============================================================ THE LABEL
  const labelX = 70 * scale;
  const labelY = 70 * scale;
  const labelW = width * 0.46 - 70 * scale;
  const labelH = height - 140 * scale;
  const labelR = 14 * scale;

  // Drop shadow under the panel.
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.30)';
  ctx.shadowBlur = 34 * scale;
  ctx.shadowOffsetY = 16 * scale;
  ctx.fillStyle = '#ffffff';
  roundRectPath(ctx, labelX, labelY, labelW, labelH, labelR);
  ctx.fill();
  ctx.restore();

  // White panel + thick black border (authentic ~6px rule).
  ctx.fillStyle = '#ffffff';
  roundRectPath(ctx, labelX, labelY, labelW, labelH, labelR);
  ctx.fill();
  ctx.lineWidth = 6 * scale;
  ctx.strokeStyle = '#000000';
  roundRectPath(ctx, labelX, labelY, labelW, labelH, labelR);
  ctx.stroke();

  const padX = 22 * scale;
  const innerX = labelX + padX;
  const innerR = labelX + labelW - padX;
  const innerW = innerR - innerX;
  let cy = labelY + 20 * scale;

  // Pure black/white inside for authenticity.
  ctx.fillStyle = '#000000';

  // --- Title ---
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = `900 ${44 * scale}px ${sans}`;
  ctx.fillText('Nutrition Facts', innerX, cy);
  cy += 54 * scale;

  // Thin rule.
  rule(ctx, innerX, innerR, cy, 1 * scale);
  cy += 9 * scale;

  // --- Serving size ---
  ctx.font = `400 ${15 * scale}px ${sans}`;
  ctx.fillText('Serving size', innerX, cy);
  ctx.textAlign = 'right';
  ctx.font = `700 ${15 * scale}px ${sans}`;
  ctx.fillText('1 repository (1 repo)', innerR, cy);
  ctx.textAlign = 'left';
  cy += 24 * scale;

  // THICK black bar.
  rule(ctx, innerX, innerR, cy, 9 * scale);
  cy += 18 * scale;

  // --- Amount per serving + hero figure (Stars, else Commits) ---
  ctx.font = `700 ${12 * scale}px ${sans}`;
  ctx.fillText('Amount per serving', innerX, cy);
  cy += 18 * scale;

  const heroLabel = has(stars) ? 'Stars' : 'Commits';
  const heroValue = has(stars)
    ? String(stars)
    : String(1000 + Math.floor(mulberry(seed + 7) * 9000));
  ctx.font = `900 ${34 * scale}px ${sans}`;
  ctx.fillText(heroLabel, innerX, cy);
  ctx.textAlign = 'right';
  ctx.fillText(truncate(ctx, heroValue, innerW * 0.45, `900 ${34 * scale}px ${sans}`), innerR, cy);
  ctx.textAlign = 'left';
  cy += 42 * scale;

  // Thin rule + % Daily Value header.
  rule(ctx, innerX, innerR, cy, 4 * scale);
  cy += 8 * scale;
  ctx.textAlign = 'right';
  ctx.font = `700 ${15 * scale}px ${sans}`;
  ctx.fillText('% Daily Value*', innerR, cy);
  ctx.textAlign = 'left';
  cy += 22 * scale;

  // --- Itemized rows ---
  const rows = [];
  if (has(forks)) rows.push(['Forks', String(forks), pct(11)]);
  rows.push(['Issues', '', pct(12)]);
  rows.push(['Commits', '', pct(13)]);
  rows.push(['Pull Requests', '', pct(14)]);

  rows.forEach((row, i) => {
    if (i > 0) {
      rule(ctx, innerX, innerR, cy, 1 * scale);
      cy += 9 * scale;
    }
    const [name, value, p] = row;
    ctx.textAlign = 'left';
    ctx.font = `700 ${17 * scale}px ${sans}`;
    let label = name;
    if (has(value)) label += ` ${value}`;
    ctx.fillText(truncate(ctx, label, innerW * 0.6, `700 ${17 * scale}px ${sans}`), innerX, cy);
    ctx.textAlign = 'right';
    ctx.font = `700 ${17 * scale}px ${sans}`;
    ctx.fillText(`${p}%`, innerR, cy);
    ctx.textAlign = 'left';
    cy += 24 * scale;
  });

  // THICK bar.
  rule(ctx, innerX, innerR, cy, 9 * scale);
  cy += 16 * scale;

  // --- Language row (only if present) ---
  if (has(language)) {
    ctx.textAlign = 'left';
    ctx.font = `400 ${16 * scale}px ${sans}`;
    ctx.fillText('Language', innerX, cy);
    ctx.textAlign = 'right';
    ctx.font = `700 ${16 * scale}px ${sans}`;
    ctx.fillText(truncate(ctx, language, innerW * 0.5, `700 ${16 * scale}px ${sans}`), innerR, cy);
    ctx.textAlign = 'left';
    cy += 22 * scale;
    rule(ctx, innerX, innerR, cy, 1 * scale);
    cy += 9 * scale;
  }

  // --- Footnote ---
  ctx.font = `400 ${11 * scale}px ${sans}`;
  ctx.fillStyle = '#000000';
  ctx.textBaseline = 'top';
  wrapText(
    ctx,
    '* % Daily Value based on a 2,000-commit daily diet.',
    innerX,
    cy,
    innerW,
    14 * scale,
  );
  cy += 30 * scale;
  if (has(supportUrl)) {
    ctx.font = `400 ${11 * scale}px ${mono}`;
    ctx.fillText(truncate(ctx, supportUrl, innerW, `400 ${11 * scale}px ${mono}`), innerX, cy);
  }

  // ========================================================== RIGHT SIDE
  const rx = width * 0.46 + 20 * scale;
  const rRight = width - 70 * scale;
  const rW = rRight - rx;
  let ry = height * 0.30;

  const onBg = readableOn(bgColor);
  const headingColor = lum(primaryColor) > 60 || readableOn(bgColor) === '#111111'
    ? primaryColor
    : mix(primaryColor, onBg, 0.15);

  // repoName big bold heading.
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = headingColor;
  ctx.font = `800 ${64 * scale}px ${sans}`;
  const nameText = truncate(ctx, repoName || 'repository', rW, `800 ${64 * scale}px ${sans}`);
  ctx.fillText(nameText, rx, ry);
  const nameW = ctx.measureText(nameText).width;

  // Accent underline in primaryColor.
  ctx.fillStyle = primaryColor;
  ctx.fillRect(rx, ry + 18 * scale, Math.min(nameW, rW), 6 * scale);
  ry += 60 * scale;

  // Description wrapped (2–3 lines, muted).
  if (has(description)) {
    ctx.fillStyle = hexA(onBg, 0.72);
    ctx.font = `400 ${22 * scale}px ${serif}`;
    const desc = truncate(ctx, description, rW * 2.4, `400 ${22 * scale}px ${serif}`);
    ctx.textBaseline = 'top';
    wrapText(ctx, desc, rx, ry, rW, 30 * scale);
    ry += 96 * scale;
  }

  // @owner line.
  if (has(owner)) {
    ctx.fillStyle = hexA(onBg, 0.85);
    ctx.font = `600 ${20 * scale}px ${mono}`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(truncate(ctx, `@${owner}`, rW, `600 ${20 * scale}px ${mono}`), rx, ry);
    ry += 44 * scale;
  }

  // Playful organic badge using secondaryColor.
  const badgeText = 'GITHUB ORGANIC · NON-GMO CODE';
  ctx.font = `800 ${13 * scale}px ${sans}`;
  const btW = ctx.measureText(badgeText).width;
  const bPadX = 16 * scale;
  const bH = 34 * scale;
  const bW = Math.min(btW + bPadX * 2, rW);
  ctx.save();
  roundRectPath(ctx, rx, ry, bW, bH, bH / 2);
  ctx.lineWidth = 2.5 * scale;
  ctx.strokeStyle = secondaryColor;
  ctx.stroke();
  ctx.fillStyle = hexA(secondaryColor, 0.14);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = secondaryColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    truncate(ctx, badgeText, bW - bPadX * 2, `800 ${13 * scale}px ${sans}`),
    rx + bPadX,
    ry + bH / 2 + 1 * scale,
  );

  // Reset text state for the next theme.
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
};

// ---------------- helpers (hoisted) ----------------
function rule(ctx, x1, x2, y, thickness) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(x1, y, x2 - x1, thickness);
}

function parseHex(hex){const h=(hex||'#000').replace('#','');const f=h.length===3?h.split('').map(c=>c+c).join(''):h;return{r:parseInt(f.slice(0,2),16)||0,g:parseInt(f.slice(2,4),16)||0,b:parseInt(f.slice(4,6),16)||0};}
function rgbToHex(r,g,b){const h=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');return '#'+h(r)+h(g)+h(b);}
function mix(a,b,t){const x=parseHex(a),y=parseHex(b);return rgbToHex(x.r+(y.r-x.r)*t,x.g+(y.g-x.g)*t,x.b+(y.b-x.b)*t);}
function lighten(hex,a){const{r,g,b}=parseHex(hex);return rgbToHex(r+255*a,g+255*a,b+255*a);}
function hexA(hex,al){const{r,g,b}=parseHex(hex);return `rgba(${r}, ${g}, ${b}, ${al})`;}
function lum(hex){const{r,g,b}=parseHex(hex);return 0.2126*r+0.7152*g+0.0722*b;}
function readableOn(hex){const{r,g,b}=parseHex(hex);return (0.299*r+0.587*g+0.114*b)>150?'#111111':'#ffffff';}
function seedFrom(str){let s=0;for(const c of (str||'x'))s=(s*31+c.charCodeAt(0))|0;return Math.abs(s)||1;}
function mulberry(seed){let t=(seed*1831565813)|0;t=(t+0x6D2B79F5)|0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return ((r^(r>>>14))>>>0)/4294967296;}
function has(v){return v!==undefined&&v!==null&&String(v).trim()!=='';}
function truncate(ctx,text,maxW,font){ctx.font=font;if(ctx.measureText(text).width<=maxW)return text;let t=text;while(t.length>1&&ctx.measureText(t+'…').width>maxW)t=t.slice(0,-1);return t+'…';}
function roundRectPath(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}
