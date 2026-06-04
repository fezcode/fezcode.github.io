/*
 * WANTED POSTER — the repo rendered as an Old-West "WANTED / DEAD OR ALIVE"
 * bill nailed to a dark wooden wall. A weathered parchment with torn deckled
 * edges, aged brown stains, a framed mugshot, a HUGE reward in stars and a
 * seeded marshal's colophon at the foot. All randomness is deterministic.
 */

const SERIF = 'Georgia, "Times New Roman", serif';
const MONO = '"JetBrains Mono", "Courier New", monospace';

export const wantedPoster = (ctx, width, height, scale, data) => {
  const {
    primaryColor, secondaryColor, bgColor,
    repoOwner, repoName, language, stars, forks, supportUrl,
  } = data;

  const owner = (repoOwner || '').toString();
  const repo = (repoName || '').toString();
  const seed = seedFrom(repo || 'outlaw');

  // Inks
  const INK = '#2A211A';
  const INK_SOFT = '#5A4632';
  const PARCH = '#E7D7B0';
  const PARCH_HI = lighten(PARCH, 0.08);
  const PARCH_SHADE = mix(PARCH, '#7A5A2A', 0.35);

  // ---- WOOD GROUND ----
  const wood = mix(bgColor || '#3A2A1A', '#3A2A1A', 0.6);
  ctx.fillStyle = wood;
  ctx.fillRect(0, 0, width, height);

  // vertical plank seams
  const planks = 6;
  for (let i = 1; i < planks; i++) {
    const px = (width / planks) * i + (mulberry(seed + i * 7) - 0.5) * 16 * scale;
    ctx.strokeStyle = hexA('#000000', 0.35);
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, height);
    ctx.stroke();
    ctx.strokeStyle = hexA(lighten(wood, 0.12), 0.4);
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(px + 2 * scale, 0);
    ctx.lineTo(px + 2 * scale, height);
    ctx.stroke();
  }
  // faint horizontal grain lines
  ctx.strokeStyle = hexA('#000000', 0.10);
  ctx.lineWidth = 1 * scale;
  for (let i = 0; i < 40; i++) {
    const gy = mulberry(seed + i * 131) * height;
    const gx = mulberry(seed + i * 53) * width;
    const len = (60 + mulberry(seed + i * 17) * 180) * scale;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + len, gy + (mulberry(seed + i) - 0.5) * 6 * scale);
    ctx.stroke();
  }

  // ---- POSTER GEOMETRY ----
  const mx = 150 * scale;
  const my = 46 * scale;
  const px0 = mx;
  const py0 = my;
  const pw = width - mx * 2;
  const ph = height - my * 2;
  const cx = px0 + pw / 2;

  // drop shadow behind poster
  ctx.save();
  ctx.fillStyle = hexA('#000000', 0.45);
  roughRectPath(ctx, px0 + 8 * scale, py0 + 12 * scale, pw, ph, seed, scale);
  ctx.fill();
  ctx.restore();

  // ---- PARCHMENT with torn deckled edge ----
  ctx.save();
  roughRectPath(ctx, px0, py0, pw, ph, seed, scale);
  ctx.fillStyle = PARCH;
  ctx.fill();
  ctx.clip();

  // parchment vignette / aging gradient
  const ag = ctx.createRadialGradient(cx, py0 + ph * 0.42, ph * 0.1, cx, py0 + ph * 0.5, ph * 0.95);
  ag.addColorStop(0, PARCH_HI);
  ag.addColorStop(0.65, PARCH);
  ag.addColorStop(1, PARCH_SHADE);
  ctx.fillStyle = ag;
  ctx.fillRect(px0 - 10 * scale, py0 - 10 * scale, pw + 20 * scale, ph + 20 * scale);

  // aged brown blotches (seeded)
  for (let i = 0; i < 26; i++) {
    const bx = px0 + mulberry(seed + i * 911) * pw;
    const by = py0 + mulberry(seed + i * 313) * ph;
    const br = (8 + mulberry(seed + i * 71) * 46) * scale;
    const edge = Math.min(bx - px0, by - py0, px0 + pw - bx, py0 + ph - by) / Math.max(pw, ph);
    ctx.globalAlpha = 0.04 + (0.5 - Math.min(edge, 0.5)) * 0.14;
    ctx.fillStyle = mulberry(seed + i) > 0.5 ? '#6E4A1E' : '#4A3010';
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // crisp double ink border just inside the parchment
  const bm = 26 * scale;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4 * scale;
  ctx.strokeRect(px0 + bm, py0 + bm, pw - bm * 2, ph - bm * 2);
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeRect(px0 + bm + 7 * scale, py0 + bm + 7 * scale, pw - bm * 2 - 14 * scale, ph - bm * 2 - 14 * scale);

  // nail highlights at top corners
  [px0 + bm + 10 * scale, px0 + pw - bm - 10 * scale].forEach((nx) => {
    const ny = py0 + bm + 10 * scale;
    const ng = ctx.createRadialGradient(nx - 2 * scale, ny - 2 * scale, 0, nx, ny, 9 * scale);
    ng.addColorStop(0, '#caccce');
    ng.addColorStop(0.5, '#6a6c70');
    ng.addColorStop(1, '#1c1c1e');
    ctx.fillStyle = ng;
    ctx.beginPath();
    ctx.arc(nx, ny, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hexA('#ffffff', 0.7);
    ctx.beginPath();
    ctx.arc(nx - 2.5 * scale, ny - 2.5 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
  });

  // ---- HEADLINE: WANTED ----
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  let topY = py0 + bm + 72 * scale;
  ctx.fillStyle = INK;
  ctx.font = `900 ${92 * scale}px ${SERIF}`;
  ctx.save();
  ctx.shadowColor = hexA('#000000', 0.25);
  ctx.shadowBlur = 2 * scale;
  ctx.fillText('WANTED', cx, topY);
  ctx.restore();

  // — DEAD OR ALIVE — sub-banner
  topY += 36 * scale;
  ctx.fillStyle = INK_SOFT;
  ctx.font = `bold ${26 * scale}px ${SERIF}`;
  ctx.fillText('—  DEAD OR ALIVE  —', cx, topY);

  // thin rule under banner
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(cx - pw * 0.32, topY + 16 * scale);
  ctx.lineTo(cx + pw * 0.32, topY + 16 * scale);
  ctx.stroke();

  // ---- FRAMED PORTRAIT (mugshot) ----
  const portW = 170 * scale;
  const portH = 132 * scale;
  const portX = cx - portW / 2;
  const portY = topY + 30 * scale;
  // double-ruled frame
  ctx.fillStyle = mix(PARCH, '#FFFFFF', 0.25);
  ctx.fillRect(portX, portY, portW, portH);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5 * scale;
  ctx.strokeRect(portX, portY, portW, portH);
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeRect(portX + 8 * scale, portY + 8 * scale, portW - 16 * scale, portH - 16 * scale);

  // mugshot interior — seeded silhouette + initials disc
  ctx.save();
  ctx.beginPath();
  ctx.rect(portX + 10 * scale, portY + 10 * scale, portW - 20 * scale, portH - 20 * scale);
  ctx.clip();
  // sky wash
  const sky = ctx.createLinearGradient(0, portY, 0, portY + portH);
  sky.addColorStop(0, mix(PARCH, INK_SOFT, 0.18));
  sky.addColorStop(1, mix(PARCH, INK_SOFT, 0.42));
  ctx.fillStyle = sky;
  ctx.fillRect(portX, portY, portW, portH);

  const mcx = portX + portW / 2;
  const mcy = portY + portH * 0.52;
  // shoulders silhouette (seeded width)
  const shW = portW * (0.62 + mulberry(seed + 5) * 0.12);
  ctx.fillStyle = hexA(INK, 0.85);
  ctx.beginPath();
  ctx.moveTo(mcx - shW / 2, portY + portH);
  ctx.quadraticCurveTo(mcx - shW * 0.42, mcy + portH * 0.16, mcx - portW * 0.16, mcy + portH * 0.04);
  ctx.lineTo(mcx + portW * 0.16, mcy + portH * 0.04);
  ctx.quadraticCurveTo(mcx + shW * 0.42, mcy + portH * 0.16, mcx + shW / 2, portY + portH);
  ctx.closePath();
  ctx.fill();
  // head
  ctx.beginPath();
  ctx.arc(mcx, mcy - portH * 0.06, portW * 0.16, 0, Math.PI * 2);
  ctx.fill();
  // seeded hat brim
  if (mulberry(seed + 9) > 0.4) {
    ctx.fillStyle = hexA(INK, 0.9);
    const brim = portW * 0.30;
    ctx.beginPath();
    ctx.ellipse(mcx, mcy - portH * 0.16, brim, portH * 0.035, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(mcx - portW * 0.13, mcy - portH * 0.28, portW * 0.26, portH * 0.12);
  }
  ctx.restore();

  // ---- OUTLAW NAME ----
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  let y = portY + portH + 44 * scale;
  ctx.fillStyle = INK;
  const nameFont = `900 ${52 * scale}px ${SERIF}`;
  const nameTxt = truncate(ctx, (repo || 'unknown').toUpperCase(), pw - bm * 2 - 40 * scale, nameFont);
  ctx.font = nameFont;
  ctx.fillText(nameTxt, cx, y);

  // ---- REWARD ----
  y += 30 * scale;
  ctx.fillStyle = INK_SOFT;
  ctx.font = `bold ${22 * scale}px ${SERIF}`;
  ctx.fillText('REWARD', cx, y);

  y += 52 * scale;
  ctx.fillStyle = primaryColor || '#8B1A1A';
  ctx.font = `900 ${58 * scale}px ${MONO}`;
  const rewardTxt = has(stars) ? `★ ${stars}` : '$ ——';
  ctx.save();
  ctx.shadowColor = hexA('#000000', 0.3);
  ctx.shadowBlur = 3 * scale;
  ctx.fillText(rewardTxt, cx, y);
  ctx.restore();

  // ---- CRIMES / TERRITORIES line ----
  const crimes = [];
  if (has(language)) crimes.push(`for crimes of ${String(language).toUpperCase()}`);
  if (has(forks)) crimes.push(`wanted in ${forks} territories`);
  if (crimes.length) {
    y += 30 * scale;
    ctx.fillStyle = INK;
    const crimeFont = `italic ${20 * scale}px ${SERIF}`;
    ctx.font = crimeFont;
    ctx.fillText(truncate(ctx, crimes.join('  ·  '), pw - bm * 2 - 60 * scale, crimeFont), cx, y);
  }

  // ---- FOOTER: BY ORDER OF + marshal colophon ----
  const footY = py0 + ph - bm - 30 * scale;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(cx - pw * 0.30, footY - 26 * scale);
  ctx.lineTo(cx + pw * 0.30, footY - 26 * scale);
  ctx.stroke();

  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.font = `bold ${22 * scale}px ${SERIF}`;
  ctx.fillText(truncate(ctx, `BY ORDER OF @${owner || 'anon'}`, pw - bm * 2 - 60 * scale, ctx.font), cx, footY);

  const offices = ['ABILENE', 'DODGE CITY', 'TOMBSTONE', 'DEADWOOD', 'LARAMIE', 'SANTA FE', 'EL PASO', 'CARSON CITY'];
  const office = offices[Math.floor(mulberry(seed + 401) * offices.length) % offices.length];
  const yr = 1870 + Math.floor(mulberry(seed + 777) * 30);
  ctx.fillStyle = INK_SOFT;
  ctx.font = `${13 * scale}px ${MONO}`;
  let footer = `${office} MARSHAL'S OFFICE · A.D. ${yr}`;
  if (has(supportUrl)) footer += `  ·  ${supportUrl}`;
  ctx.fillText(truncate(ctx, footer, pw - bm * 2 - 60 * scale, ctx.font), cx, footY + 22 * scale);

  // ---- WAX / INK STAMP (secondary accent, rotated, low alpha) ----
  ctx.save();
  const stX = px0 + pw - bm - 86 * scale;
  const stY = py0 + ph - bm - 96 * scale;
  ctx.translate(stX, stY);
  ctx.rotate((mulberry(seed + 1234) - 0.5) * 0.7);
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = secondaryColor || '#7A2E2E';
  ctx.fillStyle = secondaryColor || '#7A2E2E';
  const stR = 64 * scale;
  ctx.lineWidth = 5 * scale;
  ctx.beginPath();
  ctx.arc(0, 0, stR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.arc(0, 0, stR - 9 * scale, 0, Math.PI * 2);
  ctx.stroke();
  // ring text
  ctx.font = `bold ${13 * scale}px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const ring = 'CERTIFIED · OUTLAW · ';
  for (let i = 0; i < ring.length; i++) {
    const a = (i / ring.length) * Math.PI * 2 - Math.PI / 2;
    ctx.save();
    ctx.rotate(a);
    ctx.translate(0, -(stR - 22 * scale));
    ctx.fillText(ring[i], 0, 0);
    ctx.restore();
  }
  // center star
  ctx.font = `${30 * scale}px ${SERIF}`;
  ctx.fillText('★', 0, 2 * scale);
  ctx.restore();

  // reset
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
};

// ---- HELPERS (hoisted) ----
function parseHex(hex){const h=(hex||'#000').replace('#','');const f=h.length===3?h.split('').map(c=>c+c).join(''):h;return{r:parseInt(f.slice(0,2),16)||0,g:parseInt(f.slice(2,4),16)||0,b:parseInt(f.slice(4,6),16)||0};}
function rgbToHex(r,g,b){const h=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');return '#'+h(r)+h(g)+h(b);}
function mix(a,b,t){const x=parseHex(a),y=parseHex(b);return rgbToHex(x.r+(y.r-x.r)*t,x.g+(y.g-x.g)*t,x.b+(y.b-x.b)*t);}
function lighten(hex,a){const{r,g,b}=parseHex(hex);return rgbToHex(r+255*a,g+255*a,b+255*a);}
function hexA(hex,al){const{r,g,b}=parseHex(hex);return `rgba(${r}, ${g}, ${b}, ${al})`;}
function seedFrom(str){let s=0;for(const c of (str||'x'))s=(s*31+c.charCodeAt(0))|0;return Math.abs(s)||1;}
function mulberry(seed){let t=(seed*1831565813)|0;t=(t+0x6D2B79F5)|0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return ((r^(r>>>14))>>>0)/4294967296;}
function has(v){return v!==undefined&&v!==null&&String(v).trim()!=='';}
function truncate(ctx,text,maxW,font){ctx.font=font;if(ctx.measureText(text).width<=maxW)return text;let t=text;while(t.length>1&&ctx.measureText(t+'…').width>maxW)t=t.slice(0,-1);return t+'…';}

// Rough deckled/torn rectangle edge — jittered points around the perimeter (seeded).
function roughRectPath(ctx,x,y,w,h,seed,scale){
  const j=6*scale;
  const perSide=14;
  const pts=[];
  const push=(px,py,k)=>{pts.push([px+(mulberry(seed+k*13)-0.5)*j, py+(mulberry(seed+k*29+5)-0.5)*j]);};
  let k=0;
  for(let i=0;i<perSide;i++){push(x+(w/perSide)*i,y,k++);}
  for(let i=0;i<perSide;i++){push(x+w,y+(h/perSide)*i,k++);}
  for(let i=0;i<perSide;i++){push(x+w-(w/perSide)*i,y+h,k++);}
  for(let i=0;i<perSide;i++){push(x,y+h-(h/perSide)*i,k++);}
  ctx.beginPath();
  ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);
  ctx.closePath();
}
