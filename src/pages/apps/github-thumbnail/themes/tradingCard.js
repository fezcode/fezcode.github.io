import { wrapText } from '../utils';

/*
 * TRADING_CARD — the repo rendered as a holographic collectible card
 * (Pokemon / sports-card energy). A portrait foil card sits centered-left on a
 * dark vignetted ground; a right column carries the repo heading, description
 * and a meta line.
 *
 * Field mapping:
 *   repoName    -> creature name (card top bar) + big right heading + flavour name
 *   stars       -> "HP {stars}" (top-right, red) + right meta "★ {stars}"
 *   language    -> TYPE token color (langColor) + "LV. · {language}" stat strip
 *   forks       -> "Fork Strike {forks} dmg" attack line + right meta "⑂ {forks}"
 *   description -> wrapped attack flavour text (card) + wrapped right column body
 *   repoOwner   -> "illus. @{owner}" footer
 *   supportUrl  -> small line under right meta if present
 *   primary/secondary -> foil border gradient, accents, holo sheen
 *   bgColor     -> ground (forced dark)
 */
export const tradingCard = (ctx, width, height, scale, data) => {
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

  const sans = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const serif = 'Georgia, "Times New Roman", serif';
  const mono = '"JetBrains Mono", "Courier New", ui-monospace, monospace';

  const S = (n) => n * scale;
  const name = (repoName || 'card').trim();
  const owner = (repoOwner || '').trim();
  const desc = (description || '').trim();
  const seed = seedFrom(name);

  const primary = primaryColor || '#7C5CFF';
  const secondary = secondaryColor || '#22D3EE';
  const ground = forceDark(bgColor || '#16131F');
  const typeColor = langColor(language) || primary;

  // Seeded pseudo-random values (deterministic).
  const lv = 10 + Math.floor(mulberry(seed) * 90);
  const setNum = String(1 + Math.floor(mulberry(seed + 7) * 151)).padStart(3, '0');
  const setMax = '151';

  // ---------------------------------------------------------------- GROUND
  const bg = ctx.createRadialGradient(
    width * 0.42, height * 0.42, S(40),
    width * 0.5, height * 0.5, width * 0.72,
  );
  bg.addColorStop(0, lighten(ground, 0.05));
  bg.addColorStop(1, ground);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Faint seeded sparkle dots.
  ctx.save();
  for (let i = 0; i < 70; i++) {
    const x = mulberry(seed + i * 3 + 1) * width;
    const y = mulberry(seed + i * 3 + 2) * height;
    const r = (0.6 + mulberry(seed + i * 3 + 3) * 1.8) * scale;
    ctx.globalAlpha = 0.05 + mulberry(seed + i * 5) * 0.18;
    ctx.fillStyle = i % 3 === 0 ? secondary : '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // ------------------------------------------------------------------ CARD
  const cardW = S(430);
  const cardH = S(560);
  const cardX = S(70);
  const cardY = (height - cardH) / 2;
  const radius = S(26);

  // Drop shadow.
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = S(38);
  ctx.shadowOffsetY = S(16);
  roundRectPath(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.fillStyle = ground;
  ctx.fill();
  ctx.restore();

  // Foil border = primary -> secondary diagonal gradient.
  const foil = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  foil.addColorStop(0, lighten(primary, 0.12));
  foil.addColorStop(0.5, secondary);
  foil.addColorStop(1, lighten(secondary, 0.12));
  roundRectPath(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.fillStyle = foil;
  ctx.fill();

  // Foil shimmer streaks (seeded, low alpha).
  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.clip();
  for (let i = 0; i < 10; i++) {
    ctx.globalAlpha = 0.04 + mulberry(seed + i * 11) * 0.06;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = S(2 + mulberry(seed + i) * 6);
    const ox = cardX - cardH + (i / 10) * (cardW + cardH);
    ctx.beginPath();
    ctx.moveTo(ox, cardY);
    ctx.lineTo(ox + cardH, cardY + cardH);
    ctx.stroke();
  }
  ctx.restore();

  // Inner card face (lighter panel).
  const bw = S(20);
  const faceX = cardX + bw;
  const faceY = cardY + bw;
  const faceW = cardW - bw * 2;
  const faceH = cardH - bw * 2;
  const faceR = S(14);
  const faceColor = mix(ground, '#ffffff', 0.14);
  roundRectPath(ctx, faceX, faceY, faceW, faceH, faceR);
  const faceGrad = ctx.createLinearGradient(faceX, faceY, faceX, faceY + faceH);
  faceGrad.addColorStop(0, lighten(faceColor, 0.04));
  faceGrad.addColorStop(1, faceColor);
  ctx.fillStyle = faceGrad;
  ctx.fill();

  const onFace = readableOn(faceColor);
  const mutedFace = hexA(onFace, 0.62);
  const pad = S(18);
  const inX = faceX + pad;
  const inW = faceW - pad * 2;
  let cy = faceY + pad;

  // ------------------------------------------------------------- TOP BAR
  const topH = S(34);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  let hpW = 0;
  if (has(stars)) {
    ctx.font = `bold ${S(22)}px ${sans}`;
    const hpText = `HP ${stars}`;
    hpW = ctx.measureText(hpText).width + S(34);
  }
  const nameMaxW = inW - hpW - S(8);
  ctx.fillStyle = onFace;
  ctx.font = `bold ${S(26)}px ${sans}`;
  const topName = truncate(ctx, name, nameMaxW, `bold ${S(26)}px ${sans}`);
  ctx.fillText(topName, inX, cy + topH / 2);

  if (has(stars)) {
    // TYPE token circle on the far right.
    const tokR = S(13);
    const tokCx = inX + inW - tokR;
    const tokCy = cy + topH / 2;
    ctx.beginPath();
    ctx.arc(tokCx, tokCy, tokR, 0, Math.PI * 2);
    ctx.fillStyle = typeColor;
    ctx.fill();
    ctx.lineWidth = S(2);
    ctx.strokeStyle = hexA('#ffffff', 0.6);
    ctx.stroke();
    // "HP {stars}" in red/bold, right-aligned to the left of token.
    ctx.textAlign = 'right';
    ctx.font = `bold ${S(22)}px ${sans}`;
    ctx.fillStyle = '#E5484D';
    ctx.fillText(`HP ${stars}`, tokCx - tokR - S(8), tokCy);
    ctx.textAlign = 'left';
  }
  cy += topH + S(8);

  // -------------------------------------------------------- ART WINDOW
  const artH = S(220);
  const artX = inX;
  const artY = cy;
  const artW = inW;
  const artR = S(10);

  // Beveled border (foil-toned frame).
  roundRectPath(ctx, artX - S(4), artY - S(4), artW + S(8), artH + S(8), artR + S(3));
  ctx.fillStyle = mix(primary, secondary, 0.5);
  ctx.fill();

  ctx.save();
  roundRectPath(ctx, artX, artY, artW, artH, artR);
  ctx.clip();

  // Diagonal primary -> secondary gradient.
  const artGrad = ctx.createLinearGradient(artX, artY, artX + artW, artY + artH);
  artGrad.addColorStop(0, lighten(primary, 0.06));
  artGrad.addColorStop(1, mix(secondary, ground, 0.25));
  ctx.fillStyle = artGrad;
  ctx.fillRect(artX, artY, artW, artH);

  // Seeded geometric "creature art" shapes.
  for (let i = 0; i < 14; i++) {
    const sx = artX + mulberry(seed + i * 9 + 1) * artW;
    const sy = artY + mulberry(seed + i * 9 + 2) * artH;
    const ss = (24 + mulberry(seed + i * 9 + 3) * 90) * scale;
    ctx.globalAlpha = 0.07 + mulberry(seed + i * 9 + 4) * 0.14;
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : lighten(secondary, 0.15);
    if (mulberry(seed + i * 9 + 5) > 0.5) {
      // Circle.
      ctx.beginPath();
      ctx.arc(sx, sy, ss / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Triangle.
      ctx.beginPath();
      ctx.moveTo(sx, sy - ss / 2);
      ctx.lineTo(sx + ss / 2, sy + ss / 2);
      ctx.lineTo(sx - ss / 2, sy + ss / 2);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  // Holographic sheen: translucent white diagonal band.
  const sheen = ctx.createLinearGradient(artX, artY, artX + artW, artY + artH);
  sheen.addColorStop(0, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.42, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.52, 'rgba(255,255,255,0.32)');
  sheen.addColorStop(0.62, 'rgba(255,255,255,0)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(artX, artY, artW, artH);
  ctx.restore();

  cy = artY + artH + S(14);

  // --------------------------------------------------- LV / LANGUAGE STRIP
  ctx.fillStyle = mutedFace;
  ctx.font = `600 ${S(13)}px ${mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const stripParts = [`LV.${lv}`];
  if (has(language)) stripParts.push(language);
  ctx.fillText(stripParts.join('  ·  '), inX, cy);
  // thin rule under strip
  ctx.strokeStyle = hexA(onFace, 0.18);
  ctx.lineWidth = S(1);
  ctx.beginPath();
  ctx.moveTo(inX, cy + S(12));
  ctx.lineTo(inX + inW, cy + S(12));
  ctx.stroke();
  cy += S(26);

  // ------------------------------------------------- ABILITY / ATTACK BOX
  const boxY = cy;
  const boxH = faceY + faceH - pad - S(34) - boxY;
  roundRectPath(ctx, inX, boxY, inW, boxH, S(8));
  ctx.fillStyle = hexA(onFace, 0.05);
  ctx.fill();
  ctx.strokeStyle = hexA(onFace, 0.12);
  ctx.lineWidth = S(1);
  ctx.stroke();

  let ay = boxY + S(20);
  const aPad = S(14);
  if (has(forks)) {
    // Energy dot.
    ctx.beginPath();
    ctx.arc(inX + aPad + S(7), ay, S(7), 0, Math.PI * 2);
    ctx.fillStyle = secondary;
    ctx.fill();
    // Attack name.
    ctx.fillStyle = onFace;
    ctx.font = `bold ${S(17)}px ${sans}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('⑂ Fork Strike', inX + aPad + S(20), ay);
    // Damage, right-aligned.
    ctx.textAlign = 'right';
    ctx.font = `bold ${S(18)}px ${sans}`;
    ctx.fillStyle = onFace;
    ctx.fillText(`${forks} dmg`, inX + inW - aPad, ay);
    ctx.textAlign = 'left';
    ay += S(26);
  }

  // Flavour / attack description (wrapped, italic).
  if (has(desc)) {
    ctx.fillStyle = mutedFace;
    ctx.font = `italic ${S(13)}px ${serif}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const flavour = truncate(ctx, desc, inW * 2.6, `italic ${S(13)}px ${serif}`);
    wrapText(ctx, flavour, inX + aPad, ay + S(4), inW - aPad * 2, S(18));
    ctx.textBaseline = 'middle';
  }

  // ----------------------------------------------------------- FOOTER ROW
  const footY = faceY + faceH - pad - S(8);
  // Rarity star (primary).
  star(ctx, inX + S(8), footY, S(8), S(3.4), 5);
  ctx.fillStyle = primary;
  ctx.fill();
  // Set / collector number + illus.
  ctx.fillStyle = mutedFace;
  ctx.font = `600 ${S(11)}px ${mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${setNum}/${setMax}`, inX + S(22), footY);
  if (owner) {
    ctx.textAlign = 'right';
    const illus = truncate(ctx, `illus. @${owner}`, inW * 0.5, `600 ${S(11)}px ${mono}`);
    ctx.fillText(illus, inX + inW, footY);
    ctx.textAlign = 'left';
  }

  // ------------------------------------------- WHOLE-CARD HOLO OVERLAY
  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.clip();
  const holo = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  holo.addColorStop(0, hexA(primary, 0.0));
  holo.addColorStop(0.5, hexA(secondary, 0.07));
  holo.addColorStop(1, hexA(primary, 0.0));
  ctx.fillStyle = holo;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.restore();

  // ============================================================ RIGHT SIDE
  const rx = cardX + cardW + S(64);
  const rw = width - rx - S(70);
  if (rw > S(120)) {
    const onGround = readableOn(ground);
    const mutedGround = hexA(onGround, 0.7);

    // Big heading (truncate / shrink).
    let headSize = 64;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `800 ${S(headSize)}px ${sans}`;
    while (ctx.measureText(name).width > rw && headSize > 28) {
      headSize -= 2;
      ctx.font = `800 ${S(headSize)}px ${sans}`;
    }
    const heading = truncate(ctx, name, rw, `800 ${S(headSize)}px ${sans}`);
    let ry = height * 0.5 - S(70);
    ctx.fillStyle = onGround;
    ctx.fillText(heading, rx, ry);

    // Underline in primary.
    ry += S(20);
    ctx.fillStyle = primary;
    ctx.fillRect(rx, ry, Math.min(rw, S(180)), S(6));
    ry += S(40);

    // Description (2-3 lines).
    if (has(desc)) {
      ctx.fillStyle = mutedGround;
      ctx.font = `400 ${S(20)}px ${sans}`;
      ctx.textBaseline = 'alphabetic';
      const body = truncate(ctx, desc, rw * 2.6, `400 ${S(20)}px ${sans}`);
      wrapText(ctx, body, rx, ry, rw, S(28));
      ry += S(28) * 3 + S(8);
    }

    // Meta line: ★ {stars} · ⑂ {forks} · {language}.
    ry = Math.max(ry, height * 0.5 + S(40));
    ctx.font = `600 ${S(18)}px ${mono}`;
    ctx.textBaseline = 'middle';
    let mx = rx;
    const metaY = ry;
    const sepColor = hexA(onGround, 0.4);
    const drawSep = () => {
      ctx.fillStyle = sepColor;
      ctx.fillText('·', mx, metaY);
      mx += ctx.measureText('·').width + S(10);
    };
    let firstMeta = true;
    if (has(stars)) {
      ctx.fillStyle = onGround;
      const t = `★ ${stars}`;
      ctx.fillText(t, mx, metaY);
      mx += ctx.measureText(t).width + S(10);
      firstMeta = false;
    }
    if (has(forks)) {
      if (!firstMeta) drawSep();
      ctx.fillStyle = secondary;
      const t = `⑂ ${forks}`;
      ctx.fillText(t, mx, metaY);
      mx += ctx.measureText(t).width + S(10);
      firstMeta = false;
    }
    if (has(language)) {
      if (!firstMeta) drawSep();
      ctx.fillStyle = onGround;
      ctx.fillText(language, mx, metaY);
      firstMeta = false;
    }

    // supportUrl (small).
    if (has(supportUrl)) {
      ctx.fillStyle = mutedGround;
      ctx.font = `500 ${S(14)}px ${mono}`;
      ctx.textBaseline = 'middle';
      const url = truncate(ctx, supportUrl, rw, `500 ${S(14)}px ${mono}`);
      ctx.fillText(url, rx, metaY + S(34));
    }
  }

  // Reset shared state.
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = 1;
};

// ----------------------------------------------------------------- HELPERS
function parseHex(hex){const h=(hex||'#000').replace('#','');const f=h.length===3?h.split('').map(c=>c+c).join(''):h;return{r:parseInt(f.slice(0,2),16)||0,g:parseInt(f.slice(2,4),16)||0,b:parseInt(f.slice(4,6),16)||0};}
function rgbToHex(r,g,b){const h=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');return '#'+h(r)+h(g)+h(b);}
function mix(a,b,t){const x=parseHex(a),y=parseHex(b);return rgbToHex(x.r+(y.r-x.r)*t,x.g+(y.g-x.g)*t,x.b+(y.b-x.b)*t);}
function lighten(hex,a){const{r,g,b}=parseHex(hex);return rgbToHex(r+255*a,g+255*a,b+255*a);}
function hexA(hex,al){const{r,g,b}=parseHex(hex);return `rgba(${r}, ${g}, ${b}, ${al})`;}
function lum(hex){const{r,g,b}=parseHex(hex);return 0.2126*r+0.7152*g+0.0722*b;}
function readableOn(hex){const{r,g,b}=parseHex(hex);return (0.299*r+0.587*g+0.114*b)>150?'#111111':'#ffffff';}
function forceDark(hex){return lum(hex)<70?hex:mix(hex,'#16131F',0.82);}
function seedFrom(str){let s=0;for(const c of (str||'x'))s=(s*31+c.charCodeAt(0))|0;return Math.abs(s)||1;}
function mulberry(seed){let t=(seed*1831565813)|0;t=(t+0x6D2B79F5)|0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return ((r^(r>>>14))>>>0)/4294967296;}
function has(v){return v!==undefined&&v!==null&&String(v).trim()!=='';}
function truncate(ctx,text,maxW,font){ctx.font=font;if(ctx.measureText(text).width<=maxW)return text;let t=text;while(t.length>1&&ctx.measureText(t+'…').width>maxW)t=t.slice(0,-1);return t+'…';}
function roundRectPath(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}
function langColor(language){const m={typescript:'#3178C6',javascript:'#F1E05A',python:'#3572A5',rust:'#DEA584',go:'#00ADD8',java:'#B07219','c++':'#F34B7D',c:'#555555',ruby:'#701516',php:'#4F5D95',swift:'#F05138',kotlin:'#A97BFF',html:'#E34C26',css:'#563D7C',shell:'#89E051'};return m[(language||'').toLowerCase()]||'';}
function star(ctx,cx,cy,rOut,rIn,points=5){ctx.beginPath();for(let i=0;i<points*2;i++){const a=-Math.PI/2+i*(Math.PI/points);const r=i%2===0?rOut:rIn;const x=cx+Math.cos(a)*r;const y=cy+Math.sin(a)*r;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();}
