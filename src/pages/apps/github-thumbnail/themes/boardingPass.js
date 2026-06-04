export const boardingPass = (ctx, width, height, scale, data) => {
  const {
    primaryColor = '#6366f1',
    secondaryColor = '#22d3ee',
    bgColor = '#0f172a',
    repoOwner = '',
    repoName = '',
    description = '',
    language = '',
    stars = '',
    forks = '',
  } = data || {};

  const mono = '"JetBrains Mono", ui-monospace, monospace';
  const sans = 'system-ui, -apple-system, "Segoe UI", sans-serif';

  // Deterministic ticket data derived from a stable seed
  const seed = seedFrom(repoName || repoOwner || 'flight');
  const flightNo = 1000 + Math.floor(mulberry(seed + 1) * 9000); // 4-digit
  const flightCode = `GH ${flightNo}`;
  const gateLetter = 'ABCDEF'[Math.floor(mulberry(seed + 2) * 6)];
  const gateDigit = 1 + Math.floor(mulberry(seed + 3) * 9);
  const gate = `${gateLetter}${gateDigit}`;
  const bh = String(Math.floor(mulberry(seed + 4) * 24)).padStart(2, '0');
  const bm = String(Math.floor(mulberry(seed + 5) * 60)).padStart(2, '0');
  const boardTime = `${bh}:${bm}`;
  const seatRow = 1 + Math.floor(mulberry(seed + 6) * 30);
  const seatCol = 'ABCDEF'[Math.floor(mulberry(seed + 7) * 6)];
  const seat = `${seatRow}${seatCol}`;

  const ink = '#1A1A1A';
  const muted = '#8A8A8A';
  const paper = '#F7F5F0';
  const onPrimary = readableOn(primaryColor);

  // --- Ground: bgColor with subtle vertical gradient ---
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, bgColor);
  grad.addColorStop(1, lighten(bgColor, 0.04));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Decorative dotted flight arcs (low alpha)
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = lighten(bgColor, 0.5);
  ctx.lineWidth = 1.5 * scale;
  ctx.setLineDash([3 * scale, 7 * scale]);
  for (let a = 0; a < 3; a++) {
    ctx.beginPath();
    const baseY = (0.18 + a * 0.34) * height;
    for (let x = 0; x <= width; x += 4 * scale) {
      const y = baseY + Math.sin(x / (160 * scale) + a) * 60 * scale;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();

  // Faint plane silhouettes
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = lighten(bgColor, 0.6);
  drawPlane(ctx, width * 0.12, height * 0.16, 70 * scale, -0.25);
  drawPlane(ctx, width * 0.86, height * 0.86, 90 * scale, 2.9);
  ctx.restore();

  // --- Card geometry ---
  const cardMargin = 90 * scale;
  const cardW = width - cardMargin * 2;
  const cardH = 360 * scale;
  const cardX = cardMargin;
  const cardY = (height - cardH) / 2;
  const cardR = 22 * scale;

  // Soft drop shadow (translucent offset rounded rect + canvas blur)
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 40 * scale;
  ctx.shadowOffsetY = 18 * scale;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  roundRectPath(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.fill();
  ctx.restore();

  // Card paper
  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.fillStyle = paper;
  ctx.fill();
  ctx.restore();

  // Split: main body (left ~72%) | stub (right ~28%)
  const stubW = cardW * 0.28;
  const perfX = cardX + cardW - stubW;
  const bodyX = cardX;
  const bodyW = perfX - bodyX;

  // Clip everything to the card for clean edges
  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, cardR);
  ctx.clip();

  // --- Header band across the main body ---
  const headerH = 56 * scale;
  ctx.fillStyle = primaryColor;
  ctx.fillRect(bodyX, cardY, bodyW, headerH);

  ctx.fillStyle = onPrimary;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.font = `700 ${22 * scale}px ${sans}`;
  ctx.fillText('✈ GITHUB AIRWAYS', bodyX + 28 * scale, cardY + headerH / 2);

  ctx.textAlign = 'right';
  ctx.font = `700 ${16 * scale}px ${mono}`;
  ctx.fillText('B O A R D I N G   P A S S', perfX - 26 * scale, cardY + headerH / 2);
  ctx.textAlign = 'left';

  // --- Body field grid ---
  const padL = bodyX + 28 * scale;
  const fieldsY = cardY + headerH + 36 * scale;
  const fields = [
    ['PASSENGER', truncate(ctx, (repoOwner || '—').toUpperCase(), bodyW * 0.34, `700 ${22 * scale}px ${mono}`)],
    ['FLIGHT', flightCode],
    ['GATE', gate],
    ['BOARDING', boardTime],
  ];
  const colW = (bodyW - 56 * scale) / 4;
  fields.forEach((f, i) => {
    const fx = padL + i * colW;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = muted;
    ctx.font = `700 ${12 * scale}px ${mono}`;
    ctx.fillText(letterSpace(f[0]), fx, fieldsY);
    ctx.fillStyle = ink;
    ctx.font = `700 ${22 * scale}px ${mono}`;
    ctx.fillText(f[1], fx, fieldsY + 28 * scale);
  });

  // --- Route line: MAIN -> repoName ---
  const routeY = fieldsY + 78 * scale;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = ink;
  ctx.font = `700 ${30 * scale}px ${sans}`;
  ctx.fillText('MAIN', padL, routeY);
  const originW = ctx.measureText('MAIN').width;

  // Destination (big repoName)
  ctx.font = `800 ${42 * scale}px ${sans}`;
  const destMaxW = bodyW - (padL - bodyX) - originW - 120 * scale;
  const destText = truncate(ctx, repoName || 'repository', destMaxW, `800 ${42 * scale}px ${sans}`);
  const destW = ctx.measureText(destText).width;
  const destX = perfX - 26 * scale - destW;

  // Dotted connector with a plane glyph in secondaryColor
  const connStart = padL + originW + 18 * scale;
  const connEnd = destX - 18 * scale;
  if (connEnd > connStart) {
    ctx.save();
    ctx.strokeStyle = mix(ink, paper, 0.55);
    ctx.lineWidth = 2 * scale;
    ctx.setLineDash([2 * scale, 6 * scale]);
    ctx.beginPath();
    ctx.moveTo(connStart, routeY);
    ctx.lineTo(connEnd, routeY);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = secondaryColor;
    ctx.font = `${24 * scale}px ${sans}`;
    ctx.textAlign = 'center';
    ctx.fillText('✈', (connStart + connEnd) / 2, routeY - 1 * scale);
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = ink;
  ctx.font = `800 ${42 * scale}px ${sans}`;
  ctx.fillText(destText, destX, routeY);

  // --- Meta row: stars / forks / language pill ---
  const metaY = routeY + 52 * scale;
  let metaX = padL;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  if (has(stars)) {
    ctx.fillStyle = ink;
    ctx.font = `700 ${20 * scale}px ${mono}`;
    const t = `★ ${String(stars)}`;
    ctx.fillText(t, metaX, metaY);
    metaX += ctx.measureText(t).width + 30 * scale;
  }
  if (has(forks)) {
    ctx.fillStyle = secondaryColor;
    ctx.font = `700 ${20 * scale}px ${mono}`;
    ctx.fillText('⑂', metaX, metaY);
    const gw = ctx.measureText('⑂').width + 8 * scale;
    ctx.fillStyle = ink;
    ctx.fillText(String(forks), metaX + gw, metaY);
    metaX += gw + ctx.measureText(String(forks)).width + 30 * scale;
  }
  if (has(language)) {
    ctx.font = `700 ${16 * scale}px ${mono}`;
    const lang = language.toUpperCase();
    const lw = ctx.measureText(lang).width;
    const pillH = 32 * scale;
    const pillW = lw + 28 * scale;
    roundRectPath(ctx, metaX, metaY - pillH / 2, pillW, pillH, pillH / 2);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
    ctx.fillStyle = primaryColor;
    ctx.textAlign = 'left';
    ctx.fillText(lang, metaX + 14 * scale, metaY + 1 * scale);
  }

  // --- Description: single muted truncated line ---
  if (has(description)) {
    const descY = metaY + 34 * scale;
    ctx.fillStyle = muted;
    ctx.font = `400 ${16 * scale}px ${sans}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    const desc = truncate(ctx, description, bodyW - 56 * scale, `400 ${16 * scale}px ${sans}`);
    ctx.fillText(desc, padL, descY);
  }

  // --- Horizontal barcode along bottom of main body ---
  const barAreaH = 40 * scale;
  const barY = cardY + cardH - barAreaH - 34 * scale;
  let bx = padL;
  const barMaxX = perfX - 26 * scale;
  ctx.fillStyle = ink;
  let bi = 0;
  while (bx < barMaxX - 2 * scale) {
    const bw = (1 + Math.floor(mulberry(seed + 100 + bi) * 4)) * scale;
    if (mulberry(seed + 200 + bi) > 0.32) {
      ctx.fillRect(bx, barY, bw, barAreaH);
    }
    bx += bw + (1 + Math.floor(mulberry(seed + 300 + bi) * 2)) * scale;
    bi++;
  }
  ctx.fillStyle = muted;
  ctx.font = `400 ${13 * scale}px ${mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`${flightCode}  •  GATE ${gate}  •  ${boardTime}`, padL, barY + barAreaH + 8 * scale);

  // ====================== STUB ======================
  // Stub mini header
  ctx.fillStyle = primaryColor;
  ctx.fillRect(perfX, cardY, stubW, headerH);
  ctx.fillStyle = onPrimary;
  ctx.font = `700 ${13 * scale}px ${mono}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letterSpace('SEAT'), perfX + stubW / 2, cardY + headerH / 2);

  // Big SEAT value
  const stubCx = perfX + stubW / 2;
  ctx.fillStyle = ink;
  ctx.font = `800 ${64 * scale}px ${sans}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(seat, stubCx - 4 * scale, cardY + headerH + 70 * scale);
  // secondaryColor accent underline
  ctx.fillStyle = secondaryColor;
  ctx.fillRect(stubCx - 44 * scale, cardY + headerH + 116 * scale, 88 * scale, 4 * scale);

  // GATE + FLIGHT repeated on stub
  const stubInfoY = cardY + headerH + 156 * scale;
  const stubInfo = [
    ['GATE', gate],
    ['FLIGHT', flightCode],
    ['BOARD', boardTime],
  ];
  stubInfo.forEach((f, i) => {
    const sy = stubInfoY + i * 42 * scale;
    ctx.fillStyle = muted;
    ctx.font = `700 ${11 * scale}px ${mono}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(letterSpace(f[0]), stubCx, sy);
    ctx.fillStyle = ink;
    ctx.font = `700 ${20 * scale}px ${mono}`;
    ctx.fillText(f[1], stubCx, sy + 22 * scale);
  });

  // Vertical barcode along stub's right edge
  const vbX = cardX + cardW - 26 * scale;
  let vy = cardY + 80 * scale;
  const vbMaxY = cardY + cardH - 26 * scale;
  ctx.fillStyle = ink;
  let vi = 0;
  const vbW = 22 * scale;
  while (vy < vbMaxY - 2 * scale) {
    const bh2 = (1 + Math.floor(mulberry(seed + 400 + vi) * 4)) * scale;
    if (mulberry(seed + 500 + vi) > 0.32) {
      ctx.fillRect(vbX - vbW, vy, vbW, bh2);
    }
    vy += bh2 + (1 + Math.floor(mulberry(seed + 600 + vi) * 2)) * scale;
    vi++;
  }

  ctx.restore(); // end card clip

  // --- Perforation: dashed vertical line + punched notch circles ---
  ctx.save();
  ctx.strokeStyle = mix(ink, paper, 0.6);
  ctx.lineWidth = 2 * scale;
  ctx.setLineDash([6 * scale, 6 * scale]);
  ctx.beginPath();
  ctx.moveTo(perfX, cardY + 14 * scale);
  ctx.lineTo(perfX, cardY + cardH - 14 * scale);
  ctx.stroke();
  ctx.restore();

  // Punched notches at top & bottom (filled with the ground gradient so they read as cut-outs)
  const notchR = 14 * scale;
  ctx.save();
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(perfX, cardY, notchR, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(perfX, cardY + cardH, notchR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// ---------------- helpers (hoisted) ----------------
function letterSpace(s) {
  return String(s || '').split('').join(' ');
}

function drawPlane(ctx, cx, cy, size, rot) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  const s = size;
  ctx.beginPath();
  ctx.moveTo(0.5 * s, 0);
  ctx.lineTo(-0.1 * s, 0.1 * s);
  ctx.lineTo(-0.35 * s, 0.1 * s);
  ctx.lineTo(-0.18 * s, 0.32 * s);
  ctx.lineTo(-0.34 * s, 0.32 * s);
  ctx.lineTo(-0.5 * s, 0.06 * s);
  ctx.lineTo(-0.5 * s, -0.06 * s);
  ctx.lineTo(-0.34 * s, -0.32 * s);
  ctx.lineTo(-0.18 * s, -0.32 * s);
  ctx.lineTo(-0.35 * s, -0.1 * s);
  ctx.lineTo(-0.1 * s, -0.1 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function parseHex(hex){const h=(hex||'#000').replace('#','');const f=h.length===3?h.split('').map(c=>c+c).join(''):h;return{r:parseInt(f.slice(0,2),16)||0,g:parseInt(f.slice(2,4),16)||0,b:parseInt(f.slice(4,6),16)||0};}
function rgbToHex(r,g,b){const h=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');return '#'+h(r)+h(g)+h(b);}
function mix(a,b,t){const x=parseHex(a),y=parseHex(b);return rgbToHex(x.r+(y.r-x.r)*t,x.g+(y.g-x.g)*t,x.b+(y.b-x.b)*t);}
function lighten(hex,a){const{r,g,b}=parseHex(hex);return rgbToHex(r+255*a,g+255*a,b+255*a);}
function readableOn(hex){const{r,g,b}=parseHex(hex);return (0.299*r+0.587*g+0.114*b)>150?'#111111':'#ffffff';}
function mulberry(seed){let t=(seed*1831565813)|0;t=(t+0x6D2B79F5)|0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return ((r^(r>>>14))>>>0)/4294967296;}
function seedFrom(str){let s=0;for(const c of (str||'x'))s=(s*31+c.charCodeAt(0))|0;return Math.abs(s)||1;}
function has(v){return v!==undefined&&v!==null&&String(v).trim()!=='';}
function truncate(ctx,text,maxW,font){ctx.font=font;if(ctx.measureText(text).width<=maxW)return text;let t=text;while(t.length>1&&ctx.measureText(t+'…').width>maxW)t=t.slice(0,-1);return t+'…';}
function roundRectPath(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}
