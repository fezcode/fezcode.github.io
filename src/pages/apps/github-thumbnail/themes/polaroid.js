import { wrapText } from '../utils';

export const polaroid = (ctx, width, height, scale, data) => {
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
    supportUrl = '',
  } = data || {};

  const script = '"Segoe Script", "Bradley Hand", "Comic Sans MS", cursive';
  const sans = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const mono = '"JetBrains Mono", ui-monospace, monospace';

  const seed = seedFrom(repoName || 'photo');

  // ---------- Ground: dark surface so the white photo pops ----------
  const ground = forceDark(bgColor);
  const gg = ctx.createLinearGradient(0, 0, 0, height);
  gg.addColorStop(0, lighten(ground, 0.04));
  gg.addColorStop(1, ground);
  ctx.fillStyle = gg;
  ctx.fillRect(0, 0, width, height);

  // Faint seeded grain texture (low alpha)
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = lighten(ground, 0.6);
  for (let i = 0; i < 320; i++) {
    const gx = mulberry(seed + i * 2) * width;
    const gy = mulberry(seed + i * 2 + 1) * height;
    const gs = (0.5 + mulberry(seed + i + 7) * 1.6) * scale;
    ctx.fillRect(gx, gy, gs, gs);
  }
  ctx.restore();

  // Soft vignette
  const vig = ctx.createRadialGradient(
    width / 2, height / 2, height * 0.2,
    width / 2, height / 2, height * 0.85
  );
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);

  // ---------- Polaroid geometry (center-left) ----------
  const cardW = 440 * scale;
  const cardH = 520 * scale;
  const cx = width * 0.31;
  const cy = height * 0.5;
  const angle = (-4 + (mulberry(seed + 3) - 0.5) * 3) * (Math.PI / 180);

  const border = 26 * scale;        // side/top white border
  const bottomStrip = 120 * scale;  // classic fat bottom border
  const photoX = -cardW / 2 + border;
  const photoY = -cardH / 2 + border;
  const photoW = cardW - border * 2;
  const photoH = cardH - border - bottomStrip;

  // ---------- A tiny second polaroid peeking behind ----------
  ctx.save();
  ctx.translate(cx + 14 * scale, cy + 10 * scale);
  ctx.rotate(angle + 6 * (Math.PI / 180));
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 34 * scale;
  ctx.shadowOffsetY = 16 * scale;
  ctx.fillStyle = '#EFece4';
  roundRectPath(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 8 * scale);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  // faded picture on the peeking one
  const pk = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
  pk.addColorStop(0, mix(secondaryColor, '#ffffff', 0.45));
  pk.addColorStop(1, mix(primaryColor, '#ffffff', 0.45));
  ctx.fillStyle = pk;
  ctx.fillRect(photoX, photoY, photoW, photoH);
  ctx.restore();

  // ---------- Main polaroid (rotated, save/translate/rotate) ----------
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  // Drop shadow first (offset translucent rounded rect)
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 46 * scale;
  ctx.shadowOffsetY = 22 * scale;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  roundRectPath(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 8 * scale);
  ctx.fill();
  ctx.restore();

  // White card
  const cardGrad = ctx.createLinearGradient(0, -cardH / 2, 0, cardH / 2);
  cardGrad.addColorStop(0, '#FFFFFF');
  cardGrad.addColorStop(1, '#F2EFE8');
  ctx.fillStyle = cardGrad;
  roundRectPath(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 8 * scale);
  ctx.fill();

  // ---------- Photo area (primary -> secondary gradient = the picture) ----------
  ctx.save();
  ctx.beginPath();
  ctx.rect(photoX, photoY, photoW, photoH);
  ctx.clip();

  const photoGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
  photoGrad.addColorStop(0, primaryColor);
  photoGrad.addColorStop(1, secondaryColor);
  ctx.fillStyle = photoGrad;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // A few seeded soft orbs (low alpha) so it reads as a real picture
  for (let i = 0; i < 5; i++) {
    const ox = photoX + mulberry(seed + i * 4 + 10) * photoW;
    const oy = photoY + mulberry(seed + i * 4 + 11) * photoH;
    const orad = (40 + mulberry(seed + i * 4 + 12) * 90) * scale;
    const tint = mulberry(seed + i * 4 + 13) > 0.5 ? '#FFFFFF' : '#000000';
    const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, orad);
    og.addColorStop(0, hexA(tint, 0.18));
    og.addColorStop(1, hexA(tint, 0));
    ctx.fillStyle = og;
    ctx.beginPath();
    ctx.arc(ox, oy, orad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Faded / overexposed top of the photo
  const fade = ctx.createLinearGradient(0, photoY, 0, photoY + photoH * 0.5);
  fade.addColorStop(0, 'rgba(255,255,255,0.28)');
  fade.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = fade;
  ctx.fillRect(photoX, photoY, photoW, photoH * 0.5);

  // Subtle inner shadow around the photo edges
  ctx.strokeStyle = 'rgba(0,0,0,0.28)';
  ctx.lineWidth = 10 * scale;
  ctx.strokeRect(photoX, photoY, photoW, photoH);
  ctx.restore();

  // Crisp 1px frame line on the photo
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.strokeRect(photoX, photoY, photoW, photoH);

  // ---------- Caption on the bottom white strip ----------
  const capCx = -cardW / 2 + cardW / 2;
  const capY = photoY + photoH + bottomStrip * 0.42;
  ctx.fillStyle = '#2A2A2E';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const capName = truncate(ctx, repoName || 'untitled', cardW - border * 2 - 20 * scale, `${44 * scale}px ${script}`);
  ctx.font = `${44 * scale}px ${script}`;
  ctx.fillText(capName, capCx, capY);

  // Seeded date scrawl beneath the caption
  const seasons = ['spring', 'summer', 'autumn', 'winter'];
  const season = seasons[Math.floor(mulberry(seed + 21) * 4)];
  const yr = 20 + Math.floor(mulberry(seed + 22) * 6); // '20–'25
  const dateText = `${season} '${yr}`;
  ctx.fillStyle = '#9A9088';
  ctx.font = `${22 * scale}px ${script}`;
  ctx.fillText(dateText, capCx, capY + 36 * scale);

  ctx.textAlign = 'left';
  ctx.restore(); // end rotated polaroid

  // ---------- Tape across a corner (translucent, on top, in screen space) ----------
  ctx.save();
  ctx.translate(cx - cardW / 2 + 30 * scale, cy - cardH / 2 - 6 * scale);
  ctx.rotate(-38 * (Math.PI / 180));
  ctx.fillStyle = 'rgba(245, 240, 220, 0.4)';
  ctx.fillRect(-70 * scale, -22 * scale, 140 * scale, 44 * scale);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1 * scale;
  ctx.strokeRect(-70 * scale, -22 * scale, 140 * scale, 44 * scale);
  ctx.restore();

  // ====================== META COLUMN (right, on dark ground) ======================
  const colX = width * 0.6;
  const colW = width - colX - 80 * scale;
  let mY = height * 0.27;
  const light = '#F4F4F6';
  const muted = lighten(ground, 0.55);

  // @owner small label
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = secondaryColor;
  ctx.font = `600 ${22 * scale}px ${sans}`;
  ctx.fillText(truncate(ctx, '@' + (repoOwner || 'owner'), colW, `600 ${22 * scale}px ${sans}`), colX, mY);
  mY += 50 * scale;

  // repoName headline (reinforces, big & clean)
  ctx.fillStyle = light;
  ctx.font = `700 ${44 * scale}px ${sans}`;
  ctx.fillText(truncate(ctx, repoName || 'repository', colW, `700 ${44 * scale}px ${sans}`), colX, mY);
  mY += 46 * scale;

  // Description wrapped (2–3 lines, muted)
  if (has(description)) {
    ctx.fillStyle = muted;
    ctx.font = `400 ${21 * scale}px ${sans}`;
    const lineH = 30 * scale;
    const desc = clampLines(ctx, description, colW, `400 ${21 * scale}px ${sans}`, 3);
    wrapText(ctx, desc, colX, mY, colW, lineH);
    mY += lineH * 3 + 18 * scale;
  } else {
    mY += 24 * scale;
  }

  // Stats row: ★ stars · ⑂ forks · language
  if (has(stars) || has(forks) || has(language)) {
    let sx = colX;
    ctx.textBaseline = 'middle';
    ctx.font = `500 ${20 * scale}px ${mono}`;
    const sep = '   ·   ';
    let first = true;

    if (has(stars)) {
      ctx.fillStyle = light;
      const t = `★ ${String(stars)}`;
      ctx.fillText(t, sx, mY);
      sx += ctx.measureText(t).width;
      first = false;
    }
    if (has(forks)) {
      if (!first) { ctx.fillStyle = muted; ctx.fillText(sep, sx, mY); sx += ctx.measureText(sep).width; }
      ctx.fillStyle = secondaryColor;
      ctx.fillText('⑂', sx, mY);
      const gw = ctx.measureText('⑂ ').width;
      ctx.fillStyle = light;
      ctx.fillText(' ' + String(forks), sx + ctx.measureText('⑂').width, mY);
      sx += gw + ctx.measureText(String(forks)).width;
      first = false;
    }
    if (has(language)) {
      if (!first) { ctx.fillStyle = muted; ctx.fillText(sep, sx, mY); sx += ctx.measureText(sep).width; }
      ctx.fillStyle = primaryColor;
      ctx.fillText(language, sx, mY);
    }
    ctx.textBaseline = 'alphabetic';
  }

  // supportUrl tiny at the bottom
  if (has(supportUrl)) {
    ctx.fillStyle = muted;
    ctx.font = `400 ${15 * scale}px ${mono}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(truncate(ctx, supportUrl, colW, `400 ${15 * scale}px ${mono}`), colX, height - 60 * scale);
  }
  ctx.textAlign = 'left';
};

// ---------------- helpers (hoisted) ----------------
function clampLines(ctx, text, maxW, font, maxLines) {
  ctx.font = font;
  const words = String(text).split(' ');
  const lines = [];
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = words[i];
      if (lines.length === maxLines - 1) break;
    } else {
      line = test;
    }
  }
  // remaining words go onto the last line, truncated to fit
  const rest = words.slice(lines.join(' ').split(' ').filter(Boolean).length).join(' ');
  let last = line || rest;
  if (lines.length === maxLines - 1 && ctx.measureText(last).width > maxW) {
    while (last.length > 1 && ctx.measureText(last + '…').width > maxW) last = last.slice(0, -1);
    last = last + '…';
  }
  lines.push(last);
  return lines.join(' ');
}

function parseHex(hex){const h=(hex||'#000').replace('#','');const f=h.length===3?h.split('').map(c=>c+c).join(''):h;return{r:parseInt(f.slice(0,2),16)||0,g:parseInt(f.slice(2,4),16)||0,b:parseInt(f.slice(4,6),16)||0};}
function rgbToHex(r,g,b){const h=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');return '#'+h(r)+h(g)+h(b);}
function mix(a,b,t){const x=parseHex(a),y=parseHex(b);return rgbToHex(x.r+(y.r-x.r)*t,x.g+(y.g-x.g)*t,x.b+(y.b-x.b)*t);}
function lighten(hex,a){const{r,g,b}=parseHex(hex);return rgbToHex(r+255*a,g+255*a,b+255*a);}
function hexA(hex,al){const{r,g,b}=parseHex(hex);return `rgba(${r}, ${g}, ${b}, ${al})`;}
function lum(hex){const{r,g,b}=parseHex(hex);return 0.2126*r+0.7152*g+0.0722*b;}
function forceDark(hex){return lum(hex)<80?hex:mix(hex,'#1A1A20',0.8);}
function seedFrom(str){let s=0;for(const c of (str||'x'))s=(s*31+c.charCodeAt(0))|0;return Math.abs(s)||1;}
function mulberry(seed){let t=(seed*1831565813)|0;t=(t+0x6D2B79F5)|0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return ((r^(r>>>14))>>>0)/4294967296;}
function has(v){return v!==undefined&&v!==null&&String(v).trim()!=='';}
function truncate(ctx,text,maxW,font){ctx.font=font;if(ctx.measureText(text).width<=maxW)return text;let t=text;while(t.length>1&&ctx.measureText(t+'…').width>maxW)t=t.slice(0,-1);return t+'…';}
function roundRectPath(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}
