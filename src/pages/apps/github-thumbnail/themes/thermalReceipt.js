import { wrapText } from '../utils';

export const thermalReceipt = (ctx, width, height, scale, data) => {
  const {
    primaryColor = '#7CE7C2',
    secondaryColor = '#F6A560',
    bgColor = '#14141A',
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
    supportUrl,
  } = data;

  const S = (n) => n * scale;
  const MONO = '"JetBrains Mono", "Courier New", ui-monospace, monospace';
  const SANS = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const INK = '#2A2A2A';
  const PAPER = '#F7F6F1';

  const owner = repoOwner || 'owner';
  const name = repoName || 'repository';
  const desc = description || '';
  const seed = seedFrom(name || owner || 'receipt');

  // --- Dark counter surface ---
  const bg = forceDark(bgColor);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Faint horizontal counter texture
  ctx.save();
  ctx.strokeStyle = lighten(bg, 0.04);
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = S(1);
  for (let y = 0; y < height; y += S(7)) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // ================= RECEIPT PAPER (LEFT) =================
  const rW = S(440);
  const rX = S(72);
  const rY = S(70);
  const rH = height - S(140);
  const tooth = S(13); // sawtooth size for torn edges

  // Drop shadow behind paper
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = S(34);
  ctx.shadowOffsetX = S(8);
  ctx.shadowOffsetY = S(14);
  roundRectPath(ctx, rX, rY, rW, rH, S(2));
  ctx.fill();
  ctx.restore();

  // Paper body with torn top & bottom edges
  ctx.save();
  paperPath(ctx, rX, rY, rW, rH, tooth);
  ctx.fillStyle = PAPER;
  ctx.fill();
  // very subtle inner shading on the right edge for a slight curl feel
  const grad = ctx.createLinearGradient(rX, 0, rX + rW, 0);
  grad.addColorStop(0, 'rgba(0,0,0,0.04)');
  grad.addColorStop(0.06, 'rgba(0,0,0,0)');
  grad.addColorStop(0.94, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.05)');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Clip all receipt content to the paper body
  ctx.save();
  paperPath(ctx, rX, rY, rW, rH, tooth);
  ctx.clip();

  const padX = S(34);
  const colL = rX + padX; // left text column
  const colR = rX + rW - padX; // right edge of content
  const cW = colR - colL;
  let y = rY + tooth + S(40);
  ctx.fillStyle = INK;

  // --- Header ---
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `700 ${S(26)}px ${MONO}`;
  ctx.fillText('GITHUB  MARKET', rX + rW / 2, y);
  y += S(28);

  ctx.font = `400 ${S(13)}px ${MONO}`;
  const addrNum = 100 + Math.floor(mulberry(seed) * 900);
  ctx.fillText(`${addrNum} Commit St · Open Source`, rX + rW / 2, y);
  y += S(20);
  ctx.fillText(seededDate(seed), rX + rW / 2, y);
  y += S(26);

  ctx.textAlign = 'left';
  dashed(ctx, colL, colR, y, S(1.4));
  y += S(30);

  // --- Receipt meta ---
  const rcptNum = 1000 + Math.floor(mulberry(seed + 7) * 9000);
  ctx.font = `400 ${S(15)}px ${MONO}`;
  ctx.fillText(`RECEIPT #${rcptNum}`, colL, y);
  y += S(24);

  ctx.font = `700 ${S(17)}px ${MONO}`;
  ctx.fillText(truncate(ctx, name, cW, ctx.font).toUpperCase(), colL, y);
  y += S(30);

  // --- Column header ---
  ctx.font = `700 ${S(13)}px ${MONO}`;
  const qtyX = colL;
  const itemX = colL + S(46);
  ctx.fillText('QTY', qtyX, y);
  ctx.fillText('ITEM', itemX, y);
  ctx.textAlign = 'right';
  ctx.fillText('AMT', colR, y);
  ctx.textAlign = 'left';
  y += S(8);
  dashed(ctx, colL, colR, y, S(1));
  y += S(26);

  // --- Itemized rows ---
  const rowH = S(26);
  // AMT column reserves a fixed slot on the right; item text clips before it.
  const amtSlotW = S(96);
  const itemMaxW = colR - itemX - amtSlotW;
  const row = (label, amt) => {
    ctx.font = `400 ${S(15)}px ${MONO}`;
    ctx.textAlign = 'left';
    ctx.fillText('1', qtyX, y);
    ctx.fillText(truncate(ctx, label, itemMaxW, ctx.font), itemX, y);
    ctx.textAlign = 'right';
    ctx.fillText(truncate(ctx, amt, amtSlotW, ctx.font), colR, y);
    ctx.textAlign = 'left';
    y += rowH;
  };

  let anyRow = false;
  if (has(stars)) { row('★ stars', fmtNum(stars)); anyRow = true; }
  if (has(forks)) { row('⑂ forks', fmtNum(forks)); anyRow = true; }
  if (has(language)) { row(String(language), '--'); anyRow = true; }
  if (!anyRow) row('repository', '--');

  y += S(2);
  dashed(ctx, colL, colR, y, S(1));
  y += S(30);

  // --- Total ---
  const total = computeTotal(stars, forks);
  ctx.font = `700 ${S(18)}px ${MONO}`;
  ctx.textAlign = 'left';
  ctx.fillText('TOTAL', colL, y);
  ctx.textAlign = 'right';
  ctx.fillText(total, colR, y);
  ctx.textAlign = 'left';
  y += S(34);

  // --- Paid / thank you ---
  ctx.textAlign = 'center';
  ctx.font = `700 ${S(15)}px ${MONO}`;
  ctx.fillText('** PAID **  ·  THANK YOU', rX + rW / 2, y);
  y += S(22);
  ctx.font = `400 ${S(14)}px ${MONO}`;
  ctx.fillText('*  *  *  *  *', rX + rW / 2, y);
  y += S(36);

  // --- Barcode ---
  const barTop = y;
  const barBottom = rY + rH - tooth - S(46);
  const barH = Math.max(S(40), barBottom - barTop);
  let bx = colL;
  ctx.fillStyle = INK;
  let bi = 0;
  while (bx < colR - S(2)) {
    const r = mulberry(seed + bi * 13 + 31);
    const bw = (r < 0.5 ? 1.4 : 3.0) * scale;
    if (bi % 2 === 0) ctx.fillRect(bx, barTop, bw, barH);
    bx += bw;
    bi++;
  }
  let barNum = '';
  for (let i = 0; i < 12; i++) barNum += Math.floor(mulberry(seed + i * 5 + 3) * 10);
  ctx.textAlign = 'center';
  ctx.font = `400 ${S(14)}px ${MONO}`;
  ctx.fillText(barNum.replace(/(\d{6})(\d{6})/, '$1 $2'), rX + rW / 2, barTop + barH + S(24));

  ctx.textAlign = 'left';
  ctx.restore(); // end paper clip

  // ================= RIGHT INFO PANEL =================
  const pX = rX + rW + S(80);
  const pW = width - pX - S(72);
  let py = S(150);

  // Repo name heading
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = primaryColor;
  let titleSize = 58;
  ctx.font = `800 ${S(titleSize)}px ${SANS}`;
  while (ctx.measureText(name).width > pW && titleSize > 26) {
    titleSize -= 2;
    ctx.font = `800 ${S(titleSize)}px ${SANS}`;
  }
  ctx.fillText(truncate(ctx, name, pW, ctx.font), pX, py);
  py += S(18);

  // Underline rule
  ctx.strokeStyle = hexA(secondaryColor, 0.85);
  ctx.lineWidth = S(3);
  ctx.beginPath();
  ctx.moveTo(pX, py);
  ctx.lineTo(pX + Math.min(pW, S(200)), py);
  ctx.stroke();
  py += S(44);

  // Description (3-4 wrapped lines, muted)
  if (has(desc)) {
    ctx.fillStyle = '#AEB4BE';
    ctx.font = `400 ${S(22)}px ${SANS}`;
    const clamped = clampLines(ctx, desc, pW, 4);
    wrapText(ctx, clamped, pX, py, pW, S(32));
    py += S(32) * Math.min(4, countLines(ctx, clamped, pW)) + S(28);
  } else {
    py += S(12);
  }

  // Owner handle
  ctx.fillStyle = hexA(primaryColor, 0.9);
  ctx.font = `600 ${S(22)}px ${MONO}`;
  ctx.fillText(`@${truncate(ctx, owner, pW, ctx.font)}`, pX, py);
  py += S(46);

  // Language chip
  if (has(language)) {
    const lbl = String(language);
    ctx.font = `600 ${S(20)}px ${SANS}`;
    const dotR = S(8);
    const padc = S(18);
    const txtW = ctx.measureText(lbl).width;
    const chipW = padc * 2 + dotR * 2 + S(12) + txtW;
    const chipH = S(40);
    ctx.save();
    roundRectPath(ctx, pX, py - chipH + S(8), chipW, chipH, chipH / 2);
    ctx.fillStyle = hexA(secondaryColor, 0.14);
    ctx.fill();
    ctx.strokeStyle = hexA(secondaryColor, 0.4);
    ctx.lineWidth = S(1.5);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.arc(pX + padc + dotR, py - chipH / 2 + S(8), dotR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E6E9EE';
    ctx.textBaseline = 'middle';
    ctx.fillText(lbl, pX + padc + dotR * 2 + S(12), py - chipH / 2 + S(9));
    ctx.textBaseline = 'alphabetic';
    py += S(20);
  }

  // Support URL at bottom (muted)
  if (has(supportUrl)) {
    ctx.fillStyle = hexA('#AEB4BE', 0.85);
    ctx.font = `400 ${S(18)}px ${MONO}`;
    const url = truncate(ctx, String(supportUrl), pW, ctx.font);
    ctx.fillText(url, pX, height - S(72));
  }

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
};

// ---------------- helpers ----------------
function parseHex(hex){const h=(hex||'#000').replace('#','');const f=h.length===3?h.split('').map(c=>c+c).join(''):h;return{r:parseInt(f.slice(0,2),16)||0,g:parseInt(f.slice(2,4),16)||0,b:parseInt(f.slice(4,6),16)||0};}
function rgbToHex(r,g,b){const h=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');return '#'+h(r)+h(g)+h(b);}
function mix(a,b,t){const x=parseHex(a),y=parseHex(b);return rgbToHex(x.r+(y.r-x.r)*t,x.g+(y.g-x.g)*t,x.b+(y.b-x.b)*t);}
function lighten(hex,a){const{r,g,b}=parseHex(hex);return rgbToHex(r+255*a,g+255*a,b+255*a);}
function hexA(hex,al){const{r,g,b}=parseHex(hex);return `rgba(${r}, ${g}, ${b}, ${al})`;}
function lum(hex){const{r,g,b}=parseHex(hex);return 0.2126*r+0.7152*g+0.0722*b;}
function forceDark(hex){return lum(hex)<70?hex:mix(hex,'#14141A',0.82);}
function seedFrom(str){let s=0;for(const c of (str||'x'))s=(s*31+c.charCodeAt(0))|0;return Math.abs(s)||1;}
function mulberry(seed){let t=(seed*1831565813)|0;t=(t+0x6D2B79F5)|0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return ((r^(r>>>14))>>>0)/4294967296;}
function has(v){return v!==undefined&&v!==null&&String(v).trim()!=='';}
function truncate(ctx,text,maxW,font){ctx.font=font;if(ctx.measureText(text).width<=maxW)return text;let t=text;while(t.length>1&&ctx.measureText(t+'…').width>maxW)t=t.slice(0,-1);return t+'…';}
function roundRectPath(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}

// Paper body with sawtooth (torn) top & bottom edges.
function paperPath(ctx, x, y, w, h, tooth) {
  const t = tooth;
  ctx.beginPath();
  // top torn edge (left -> right, zigzag)
  ctx.moveTo(x, y + t);
  let i = 0;
  for (let px = x; px < x + w; px += t) {
    const peakY = i % 2 === 0 ? y : y + t;
    ctx.lineTo(Math.min(px + t, x + w), peakY);
    i++;
  }
  // down the right side
  ctx.lineTo(x + w, y + h - t);
  // bottom torn edge (right -> left, zigzag)
  i = 0;
  for (let px = x + w; px > x; px -= t) {
    const peakY = i % 2 === 0 ? y + h : y + h - t;
    ctx.lineTo(Math.max(px - t, x), peakY);
    i++;
  }
  // up the left side
  ctx.lineTo(x, y + t);
  ctx.closePath();
}

// Dashed horizontal separator line.
function dashed(ctx, x1, x2, y, lw) {
  ctx.save();
  ctx.strokeStyle = 'rgba(42, 42, 42, 0.55)';
  ctx.lineWidth = lw;
  ctx.setLineDash([lw * 4, lw * 3]);
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

// Deterministic YYYY-MM-DD from a seed (no new Date()).
function seededDate(seed) {
  const yr = 2019 + Math.floor(mulberry(seed + 11) * 7);
  const mo = 1 + Math.floor(mulberry(seed + 23) * 12);
  const dy = 1 + Math.floor(mulberry(seed + 41) * 28);
  const p = (n) => String(n).padStart(2, '0');
  return `${yr}-${p(mo)}-${p(dy)}`;
}

// Format a stat number for the AMT column, keeping its original style.
function fmtNum(v) {
  const s = String(v).trim();
  return s.length > 8 ? s.slice(0, 8) : s;
}

// Parse a stat that may be "1.2k" / "1,542" / "342" into a number.
function statValue(v) {
  if (!has(v)) return 0;
  const s = String(v).trim().toLowerCase().replace(/,/g, '');
  const m = s.match(/^([\d.]+)\s*([km])?/);
  if (!m) return 0;
  let n = parseFloat(m[1]) || 0;
  if (m[2] === 'k') n *= 1000;
  else if (m[2] === 'm') n *= 1000000;
  return n;
}

// TOTAL = stars + forks if any numeric, else fall back to raw stars/dashes.
function computeTotal(stars, forks) {
  const sum = statValue(stars) + statValue(forks);
  if (sum > 0) return sum.toLocaleString('en-US');
  if (has(stars)) return String(stars).trim();
  return '--';
}

// Cap a string to roughly `maxLines` worth of wrapped text + ellipsis.
function clampLines(ctx, text, maxW, maxLines) {
  const words = String(text).split(/\s+/);
  let line = '';
  let lines = 1;
  let out = '';
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (ctx.measureText(test).width > maxW && line) {
      if (lines >= maxLines) {
        let trimmed = line;
        while (trimmed.length > 1 && ctx.measureText(trimmed + '…').width > maxW) trimmed = trimmed.slice(0, -1);
        out += trimmed + '…';
        return out.trim();
      }
      out += line + ' ';
      line = words[i];
      lines++;
    } else {
      line = test;
    }
  }
  out += line;
  return out.trim();
}

// Count how many wrapped lines a string will occupy at maxW.
function countLines(ctx, text, maxW) {
  const words = String(text).split(/\s+/);
  let line = '';
  let lines = 1;
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (ctx.measureText(test).width > maxW && line) {
      lines++;
      line = words[i];
    } else {
      line = test;
    }
  }
  return lines;
}
