export const transitRoundel = (ctx, width, height, scale, data) => {
  const {
    primaryColor = '#E1251B',
    secondaryColor = '#00782A',
    bgColor = '#F4F2ED',
    repoOwner = '',
    repoName = '',
    description = '',
    language = '',
    stars = '',
    forks = '',
    supportUrl = '',
  } = data || {};

  const sans = 'system-ui, -apple-system, "Helvetica Neue", "Segoe UI", sans-serif';
  const mono = '"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace';

  const name = (repoName || 'station').toString();
  const owner = (repoOwner || '').toString();
  const lineColor = langColor(language) || primaryColor;
  const accent = secondaryColor;

  const seed = seedFrom(name);
  const zone = 1 + Math.floor(mulberry(seed + 7) * 6); // 1-6
  const onWall = readableOn(bgColor);
  const wallDark = lum(bgColor) < 128;
  const tileLine = hexA(onWall, wallDark ? 0.05 : 0.06);

  // --- Station wall background ---
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Subtle large tile grid (low-alpha lines)
  ctx.save();
  ctx.strokeStyle = tileLine;
  ctx.lineWidth = 1 * scale;
  const tile = 80 * scale;
  for (let x = tile; x < width; x += tile) {
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, 0);
    ctx.lineTo(Math.round(x) + 0.5, height);
    ctx.stroke();
  }
  for (let y = tile; y < height; y += tile) {
    ctx.beginPath();
    ctx.moveTo(0, Math.round(y) + 0.5);
    ctx.lineTo(width, Math.round(y) + 0.5);
    ctx.stroke();
  }
  ctx.restore();

  // Horizontal sign band behind everything
  const bandY = 150 * scale;
  const bandH = 200 * scale;
  ctx.fillStyle = wallDark ? lighten(bgColor, 0.06) : mix(bgColor, '#ffffff', 0.5);
  ctx.fillRect(0, bandY, width, bandH);
  ctx.strokeStyle = hexA(onWall, 0.08);
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(0, bandY + 0.5);
  ctx.lineTo(width, bandY + 0.5);
  ctx.moveTo(0, bandY + bandH + 0.5);
  ctx.lineTo(width, bandY + bandH + 0.5);
  ctx.stroke();

  // ================= THE ROUNDEL =================
  const cx = 240 * scale;
  const cy = bandY + bandH / 2;
  const ringR = 118 * scale;
  const ringW = 30 * scale;

  // Outer ring (line color)
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = ringW;
  ctx.beginPath();
  ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // ---- Station name bar across the roundel, extending right ----
  const barH = 56 * scale;
  const barY = cy - barH / 2;
  const barX = cx - ringR - ringW / 2;
  const barRight = width - 470 * scale; // leave room for departures panel
  const barW = Math.max(barRight - barX, ringR * 2 + 40 * scale);

  ctx.fillStyle = lineColor;
  ctx.fillRect(barX, barY, barW, barH);

  // Repo name on the bar (readable transit type)
  const barInk = readableOn(lineColor);
  const nameMaxW = barW - (ringR * 2 + 60 * scale);
  const nameX = cx + ringR + 22 * scale;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = barInk;
  const nameFont = `700 ${34 * scale}px ${sans}`;
  const stationName = truncate(ctx, name.toUpperCase(), nameMaxW, nameFont);
  ctx.font = nameFont;
  ctx.fillText(stationName, nameX, cy - 1 * scale);

  // Sub-line under the bar: @owner • zone N
  const subParts = [];
  if (has(owner)) subParts.push('@' + owner);
  subParts.push('ZONE ' + zone);
  ctx.fillStyle = hexA(onWall, 0.7);
  ctx.font = `700 ${15 * scale}px ${mono}`;
  ctx.textBaseline = 'top';
  ctx.fillText(subParts.join('   •   '), nameX, barY + barH + 14 * scale);

  // Center disc + first letter sits over the bar (roundel center)
  const innerR = ringR - ringW; // inner radius of the open ring
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.arc(cx, cy, innerR + 2 * scale, 0, Math.PI * 2);
  ctx.fill();
  // re-draw bar segment across the center so the classic bar-over-disc reads
  ctx.fillStyle = lineColor;
  ctx.fillRect(cx - innerR - 2 * scale, barY, (innerR + 2 * scale) * 2, barH);

  // First letter of repo on the center bar
  ctx.fillStyle = barInk;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `800 ${44 * scale}px ${sans}`;
  ctx.fillText((name[0] || '?').toUpperCase(), cx, cy - 1 * scale);
  ctx.textAlign = 'left';

  // ================= LINE STRIP (route) =================
  const routeY = bandY + bandH + 110 * scale;
  const routeX0 = 110 * scale;
  const routeX1 = width - 470 * scale;
  const stationCount = 6;

  // Secondary interchange line branching off (drawn first, underneath)
  const branchX = routeX0 + (routeX1 - routeX0) * 0.62;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 12 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(branchX, routeY);
  ctx.lineTo(branchX + 90 * scale, routeY + 90 * scale);
  ctx.stroke();

  // Main route line (thick line color)
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 14 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(routeX0, routeY);
  ctx.lineTo(routeX1, routeY);
  ctx.stroke();
  ctx.lineCap = 'butt';

  // Station ticks; current station aligned under the roundel
  const currentIdx = 2; // aligns the big stop roughly under the roundel center
  for (let i = 0; i < stationCount; i++) {
    const sx = routeX0 + ((routeX1 - routeX0) / (stationCount - 1)) * i;
    const isCurrent = i === currentIdx;
    const r = isCurrent ? 20 * scale : 11 * scale;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sx, routeY, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = (isCurrent ? 6 : 4) * scale;
    ctx.beginPath();
    ctx.arc(sx, routeY, r, 0, Math.PI * 2);
    ctx.stroke();
    if (isCurrent) {
      ctx.fillStyle = hexA(onWall, 0.85);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.font = `700 ${15 * scale}px ${sans}`;
      ctx.fillText(truncate(ctx, name.toUpperCase(), 170 * scale, `700 ${15 * scale}px ${sans}`), sx, routeY + 30 * scale);
      ctx.textAlign = 'left';
    }
  }
  // Interchange node at the branch
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(branchX + 90 * scale, routeY + 90 * scale, 12 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4 * scale;
  ctx.beginPath();
  ctx.arc(branchX + 90 * scale, routeY + 90 * scale, 12 * scale, 0, Math.PI * 2);
  ctx.stroke();

  // ================= DEPARTURES PANEL =================
  const panX = width - 420 * scale;
  const panY = 150 * scale;
  const panW = 330 * scale;
  const panH = 340 * scale;
  ctx.save();
  roundRectPath(ctx, panX, panY, panW, panH, 14 * scale);
  ctx.fillStyle = '#0A0A0A';
  ctx.fill();
  ctx.strokeStyle = hexA('#ffffff', 0.08);
  ctx.lineWidth = 1 * scale;
  ctx.stroke();
  ctx.clip();

  // Header
  ctx.fillStyle = '#FFB000';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${20 * scale}px ${mono}`;
  ctx.fillText('NEXT TRAINS', panX + 26 * scale, panY + 36 * scale);
  ctx.strokeStyle = hexA('#FFB000', 0.4);
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(panX + 26 * scale, panY + 62 * scale);
  ctx.lineTo(panX + panW - 26 * scale, panY + 62 * scale);
  ctx.stroke();

  // Rows: derive times; use stars/forks as first two if present
  const lineLabel = (name.toUpperCase() + ' LINE');
  const rows = [];
  const t0 = has(stars) ? clampMin(Math.floor(Number(stars) % 12) + 1, 1) : 1 + Math.floor(mulberry(seed + 11) * 9);
  const t1 = has(forks) ? clampMin(Math.floor(Number(forks) % 18) + 2, 2) : 3 + Math.floor(mulberry(seed + 12) * 12);
  rows.push({ dest: lineLabel, min: t0 });
  rows.push({ dest: 'VIA ' + (owner ? owner.toUpperCase() : 'MAIN'), min: t1 });
  rows.push({ dest: 'ALL STOPS', min: 3 + Math.floor(mulberry(seed + 13) * 20) });
  rows.push({ dest: 'TERMINUS', min: 8 + Math.floor(mulberry(seed + 14) * 24) });

  const rowFont = `700 ${17 * scale}px ${mono}`;
  const rowStartY = panY + 96 * scale;
  const rowH = 44 * scale;
  rows.forEach((row, i) => {
    const ry = rowStartY + i * rowH;
    ctx.fillStyle = '#FFB000';
    ctx.font = rowFont;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), panX + 26 * scale, ry);
    const destX = panX + 52 * scale;
    const timeStr = String(row.min) + ' min';
    ctx.font = `700 ${15 * scale}px ${mono}`;
    const timeW = ctx.measureText(timeStr).width;
    ctx.font = rowFont;
    const dest = truncate(ctx, row.dest, panW - 52 * scale - timeW - 40 * scale, rowFont);
    ctx.fillText(dest, destX, ry);
    ctx.fillStyle = '#FFD466';
    ctx.font = `700 ${15 * scale}px ${mono}`;
    ctx.textAlign = 'right';
    ctx.fillText(timeStr, panX + panW - 26 * scale, ry);
    ctx.textAlign = 'left';
  });

  ctx.restore();

  // ================= FOOTER TAGS =================
  const footY = bandY + bandH + 160 * scale + 40 * scale;
  let fx = 110 * scale;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  // MIND THE GAP / language LINE tag
  const tagText = has(language) ? language.toUpperCase() + ' LINE' : 'MIND THE GAP';
  ctx.font = `700 ${15 * scale}px ${mono}`;
  const tagW = ctx.measureText(tagText).width + 28 * scale;
  const tagH = 34 * scale;
  roundRectPath(ctx, fx, footY - tagH / 2, tagW, tagH, 6 * scale);
  ctx.fillStyle = has(language) ? lineColor : accent;
  ctx.fill();
  ctx.fillStyle = readableOn(has(language) ? lineColor : accent);
  ctx.fillText(tagText, fx + 14 * scale, footY + 1 * scale);
  fx += tagW + 22 * scale;

  // Description as a single muted line
  if (has(description)) {
    ctx.fillStyle = hexA(onWall, 0.6);
    ctx.font = `400 ${16 * scale}px ${sans}`;
    const descMax = (panX - 40 * scale) - fx;
    if (descMax > 60 * scale) {
      ctx.fillText(truncate(ctx, description, descMax, `400 ${16 * scale}px ${sans}`), fx, footY + 1 * scale);
    }
  }

  // supportUrl tiny, bottom-left
  if (has(supportUrl)) {
    ctx.fillStyle = hexA(onWall, 0.45);
    ctx.font = `400 ${12 * scale}px ${mono}`;
    ctx.textBaseline = 'bottom';
    ctx.fillText(truncate(ctx, String(supportUrl), 360 * scale, `400 ${12 * scale}px ${mono}`), 110 * scale, height - 28 * scale);
  }
};

// ---------------- helpers (hoisted) ----------------
function clampMin(n, m) { return (isFinite(n) ? Math.max(n, m) : m); }

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
function langColor(language){const m={typescript:'#3178C6',javascript:'#F1E05A',python:'#3572A5',rust:'#DEA584',go:'#00ADD8',java:'#B07219','c++':'#F34B7D',c:'#555555',ruby:'#701516',php:'#4F5D95',swift:'#F05138',kotlin:'#A97BFF',html:'#E34C26',css:'#563D7C',shell:'#89E051'};return m[(language||'').toLowerCase()]||'';}
