const MONO = '"JetBrains Mono","Courier New",ui-monospace,monospace';
const SANS = '"Inter","Helvetica Neue",Arial,sans-serif';
const DOWN = '#E5484D';

export const stockTicker = (ctx, width, height, scale, data) => {
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

  const name = repoName || 'repo';
  const owner = repoOwner || '';
  const seed = seedFrom(name || 'ticker');
  const bg = forceDark(bgColor);
  const up = primaryColor || '#26A65B';
  const accent = secondaryColor || '#5B8DEF';
  const pad = 64 * scale;

  // --- Full background ---
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Subtle top/bottom panel gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, hexA('#ffffff', 0.02));
  bgGrad.addColorStop(0.5, hexA('#000000', 0));
  bgGrad.addColorStop(1, hexA('#000000', 0.18));
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // --- Layout regions ---
  const headerY = pad;
  const chartX = pad;
  const chartY = headerY + 168 * scale;
  const tapeH = 56 * scale;
  const chartW = width * 0.58;
  const chartH = height - chartY - pad - tapeH - 28 * scale;

  // --- Faint chart grid behind chart ---
  ctx.save();
  ctx.strokeStyle = hexA('#ffffff', 0.05);
  ctx.lineWidth = 1 * scale;
  const rows = 5;
  for (let r = 0; r <= rows; r++) {
    const gy = chartY + (chartH / rows) * r;
    ctx.beginPath();
    ctx.moveTo(chartX, gy);
    ctx.lineTo(chartX + chartW, gy);
    ctx.stroke();
  }
  const cols = 8;
  for (let c = 0; c <= cols; c++) {
    const gx = chartX + (chartW / cols) * c;
    ctx.beginPath();
    ctx.moveTo(gx, chartY);
    ctx.lineTo(gx, chartY + chartH);
    ctx.stroke();
  }
  ctx.restore();

  // ============ HEADER ============
  // Ticker symbol "$XXXXX"
  const symbol = '$' + (name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 5) || 'REPO');
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${64 * scale}px ${MONO}`;
  ctx.fillText(symbol, pad, headerY + 56 * scale);

  // Full repo name + @owner
  ctx.fillStyle = hexA('#ffffff', 0.55);
  ctx.font = `400 ${22 * scale}px ${SANS}`;
  const subLabel = truncate(ctx, owner ? `${name} @${owner}` : name, chartW * 0.7, `400 ${22 * scale}px ${SANS}`);
  ctx.fillText(subLabel, pad, headerY + 92 * scale);

  // Exchange tag
  ctx.fillStyle = hexA(accent, 0.85);
  ctx.font = `600 ${14 * scale}px ${MONO}`;
  ctx.fillText('NASDAQ:GHUB · REAL-TIME', pad, headerY + 124 * scale);

  // --- Price + change (top-right) ---
  const seededPrice = (40 + Math.floor(mulberry(seed + 11) * 920));
  const priceVal = has(stars) ? String(stars) : seededPrice + '.' + String(20 + Math.floor(mulberry(seed + 7) * 79));
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${70 * scale}px ${MONO}`;
  ctx.fillText(priceVal, width - pad, headerY + 60 * scale);

  // Tiny "USD" suffix above price baseline
  ctx.fillStyle = hexA('#ffffff', 0.4);
  ctx.font = `500 ${16 * scale}px ${MONO}`;
  ctx.fillText('USD', width - pad, headerY + 88 * scale);

  // Change pill
  const pctWhole = 1 + Math.floor(mulberry(seed + 3) * 8);
  const pctFrac = Math.floor(mulberry(seed + 13) * 9);
  const todayPts = 1 + Math.floor(mulberry(seed + 17) * 48);
  const pctText = `▲ +${pctWhole}.${pctFrac}%  ·  +${todayPts} today`;
  ctx.font = `600 ${22 * scale}px ${MONO}`;
  const pillTextW = ctx.measureText(pctText).width;
  const pillPadX = 18 * scale;
  const pillH = 40 * scale;
  const pillW = pillTextW + pillPadX * 2;
  const pillX = width - pad - pillW;
  const pillY = headerY + 104 * scale;
  ctx.fillStyle = hexA(up, 0.16);
  roundRectPath(ctx, pillX, pillY, pillW, pillH, pillH / 2);
  ctx.fill();
  ctx.strokeStyle = hexA(up, 0.7);
  ctx.lineWidth = 1.5 * scale;
  roundRectPath(ctx, pillX, pillY, pillW, pillH, pillH / 2);
  ctx.stroke();
  ctx.fillStyle = up;
  ctx.textAlign = 'left';
  ctx.fillText(pctText, pillX + pillPadX, pillY + pillH / 2 + 8 * scale);
  ctx.textAlign = 'left';

  // ============ CHART (candlesticks) ============
  const candleCount = 24;
  const candles = [];
  let level = 0.45 + mulberry(seed + 1) * 0.1; // 0..1 normalized
  let lo = 1;
  let hi = 0;
  for (let i = 0; i < candleCount; i++) {
    const open = level;
    const drift = (mulberry(seed + i * 5 + 2) - 0.46) * 0.12;
    const close = Math.max(0.05, Math.min(0.95, open + drift));
    const wickHi = Math.min(0.98, Math.max(open, close) + mulberry(seed + i * 5 + 3) * 0.06);
    const wickLo = Math.max(0.02, Math.min(open, close) - mulberry(seed + i * 5 + 4) * 0.06);
    candles.push({ open, close, wickHi, wickLo, upBar: close >= open });
    lo = Math.min(lo, wickLo);
    hi = Math.max(hi, wickHi);
    level = close;
  }
  const range = Math.max(0.0001, hi - lo);
  const toY = (v) => chartY + chartH - ((v - lo) / range) * chartH;
  const colW = chartW / candleCount;
  const bodyW = colW * 0.56;

  // Area fill under close-line
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(chartX, chartY + chartH);
  for (let i = 0; i < candleCount; i++) {
    const cx = chartX + colW * i + colW / 2;
    ctx.lineTo(cx, toY(candles[i].close));
  }
  ctx.lineTo(chartX + chartW, chartY + chartH);
  ctx.closePath();
  const areaGrad = ctx.createLinearGradient(0, chartY, 0, chartY + chartH);
  areaGrad.addColorStop(0, hexA(up, 0.22));
  areaGrad.addColorStop(1, hexA(up, 0));
  ctx.fillStyle = areaGrad;
  ctx.fill();
  ctx.restore();

  // Close-line
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < candleCount; i++) {
    const cx = chartX + colW * i + colW / 2;
    const cy = toY(candles[i].close);
    if (i === 0) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  }
  ctx.strokeStyle = hexA(up, 0.5);
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();
  ctx.restore();

  // Candles
  for (let i = 0; i < candleCount; i++) {
    const cx = chartX + colW * i + colW / 2;
    const c = candles[i];
    const col = c.upBar ? up : DOWN;
    // wick
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(cx, toY(c.wickHi));
    ctx.lineTo(cx, toY(c.wickLo));
    ctx.stroke();
    // body
    const yTop = toY(Math.max(c.open, c.close));
    const yBot = toY(Math.min(c.open, c.close));
    const bh = Math.max(2 * scale, yBot - yTop);
    ctx.fillStyle = col;
    ctx.fillRect(cx - bodyW / 2, yTop, bodyW, bh);
  }

  // Dashed current-price line at last close
  const lastY = toY(candles[candleCount - 1].close);
  ctx.save();
  ctx.setLineDash([6 * scale, 5 * scale]);
  ctx.strokeStyle = hexA(up, 0.8);
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(chartX, lastY);
  ctx.lineTo(chartX + chartW, lastY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Right-aligned price axis labels
  ctx.textAlign = 'left';
  ctx.font = `400 ${13 * scale}px ${MONO}`;
  for (let r = 0; r <= rows; r++) {
    const gy = chartY + (chartH / rows) * r;
    const v = hi - (range / rows) * r;
    const axisPrice = (seededPrice * (0.6 + v * 0.8)).toFixed(2);
    ctx.fillStyle = hexA('#ffffff', 0.3);
    ctx.fillText(axisPrice, chartX + chartW + 10 * scale, gy + 4 * scale);
  }
  // current price tag on the dashed line
  ctx.fillStyle = up;
  ctx.font = `600 ${13 * scale}px ${MONO}`;
  ctx.fillText('● ' + priceVal, chartX + chartW + 10 * scale, lastY - 6 * scale);

  // ============ STATS STRIP (right column) ============
  const statsX = chartX + chartW + 120 * scale;
  const statsW = width - statsX - pad;
  const stats = [];
  if (has(forks)) stats.push(['VOL', String(forks)]);
  if (has(stars)) stats.push(['MKT CAP', String(stars)]);
  if (has(language)) stats.push(['SECTOR', String(language).toUpperCase()]);
  const w52h = seededPrice + Math.floor(mulberry(seed + 21) * 120);
  const w52l = Math.max(1, seededPrice - Math.floor(mulberry(seed + 23) * 120));
  stats.push(['52W H/L', `${w52h}/${w52l}`]);
  const peWhole = 8 + Math.floor(mulberry(seed + 27) * 40);
  const peFrac = Math.floor(mulberry(seed + 29) * 9);
  stats.push(['P/E', `${peWhole}.${peFrac}`]);

  if (statsW > 150 * scale) {
    let sy = chartY + 6 * scale;
    const cellH = Math.min(64 * scale, (chartH - 12 * scale) / stats.length);
    ctx.textAlign = 'left';
    for (let i = 0; i < stats.length; i++) {
      const cy = sy + cellH * i;
      ctx.strokeStyle = hexA('#ffffff', 0.08);
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      ctx.moveTo(statsX, cy + cellH - 8 * scale);
      ctx.lineTo(statsX + statsW, cy + cellH - 8 * scale);
      ctx.stroke();

      ctx.fillStyle = hexA('#ffffff', 0.4);
      ctx.font = `500 ${14 * scale}px ${MONO}`;
      ctx.fillText(stats[i][0], statsX, cy + 18 * scale);

      ctx.fillStyle = i % 2 === 0 ? '#ffffff' : accent;
      ctx.font = `700 ${26 * scale}px ${MONO}`;
      const val = truncate(ctx, stats[i][1], statsW, `700 ${26 * scale}px ${MONO}`);
      ctx.fillText(val, statsX, cy + 46 * scale);
    }
  }

  // ============ Analyst note (description) ============
  if (has(description) && chartH > 120 * scale) {
    const noteY = chartY + chartH + 24 * scale;
    ctx.textAlign = 'left';
    ctx.fillStyle = hexA(accent, 0.85);
    ctx.font = `600 ${14 * scale}px ${MONO}`;
    ctx.fillText('ANALYST NOTE', chartX, noteY);
    ctx.fillStyle = hexA('#ffffff', 0.6);
    ctx.font = `400 ${17 * scale}px ${SANS}`;
    const note = truncate(ctx, description, chartW, `400 ${17 * scale}px ${SANS}`);
    ctx.fillText(note, chartX, noteY + 26 * scale);
  }

  // supportUrl (tiny)
  if (has(supportUrl)) {
    ctx.textAlign = 'right';
    ctx.fillStyle = hexA('#ffffff', 0.3);
    ctx.font = `400 ${13 * scale}px ${MONO}`;
    ctx.fillText(String(supportUrl), width - pad, chartY + chartH + 44 * scale);
    ctx.textAlign = 'left';
  }

  // ============ TICKER TAPE FOOTER ============
  const tapeY = height - tapeH;
  ctx.fillStyle = forceDark(mix(bg, '#000000', 0.4));
  ctx.fillRect(0, tapeY, width, tapeH);
  ctx.strokeStyle = hexA(up, 0.5);
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(0, tapeY);
  ctx.lineTo(width, tapeY);
  ctx.stroke();

  const symbols = ['RUST', 'GO', 'WASM', 'NODE', 'PY', 'CPP', 'TS', 'JVM', 'LUA', 'ZIG'];
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = `600 ${20 * scale}px ${MONO}`;
  let tx = pad * 0.5;
  const tapeMidY = tapeY + tapeH / 2;
  let k = 0;
  while (tx < width - 80 * scale && k < 24) {
    const sIdx = (seed + k * 7) % symbols.length;
    const isUp = mulberry(seed + k * 13 + 5) > 0.42;
    const mv = (1 + Math.floor(mulberry(seed + k * 13 + 9) * 9)) + '.' + Math.floor(mulberry(seed + k * 13 + 11) * 9);
    const sym = `${isUp ? '▲' : '▼'} $${symbols[sIdx]} ${isUp ? '+' : '-'}${mv}%`;
    ctx.fillStyle = isUp ? up : DOWN;
    ctx.fillText(sym, tx, tapeMidY);
    tx += ctx.measureText(sym).width + 36 * scale;
    // separator dot
    ctx.fillStyle = hexA('#ffffff', 0.2);
    ctx.fillText('·', tx - 22 * scale, tapeMidY);
    k++;
  }
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
};

// ===================== HELPERS (hoisted) =====================
function parseHex(hex){const h=(hex||'#000').replace('#','');const f=h.length===3?h.split('').map(c=>c+c).join(''):h;return{r:parseInt(f.slice(0,2),16)||0,g:parseInt(f.slice(2,4),16)||0,b:parseInt(f.slice(4,6),16)||0};}
function rgbToHex(r,g,b){const h=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');return '#'+h(r)+h(g)+h(b);}
function mix(a,b,t){const x=parseHex(a),y=parseHex(b);return rgbToHex(x.r+(y.r-x.r)*t,x.g+(y.g-x.g)*t,x.b+(y.b-x.b)*t);}
function hexA(hex,al){const{r,g,b}=parseHex(hex);return `rgba(${r}, ${g}, ${b}, ${al})`;}
function lum(hex){const{r,g,b}=parseHex(hex);return 0.2126*r+0.7152*g+0.0722*b;}
function forceDark(hex){return lum(hex)<60?hex:mix(hex,'#0B0E14',0.86);}
function seedFrom(str){let s=0;for(const c of (str||'x'))s=(s*31+c.charCodeAt(0))|0;return Math.abs(s)||1;}
function mulberry(seed){let t=(seed*1831565813)|0;t=(t+0x6D2B79F5)|0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return ((r^(r>>>14))>>>0)/4294967296;}
function has(v){return v!==undefined&&v!==null&&String(v).trim()!=='';}
function truncate(ctx,text,maxW,font){ctx.font=font;if(ctx.measureText(text).width<=maxW)return text;let t=text;while(t.length>1&&ctx.measureText(t+'…').width>maxW)t=t.slice(0,-1);return t+'…';}
function roundRectPath(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}
