import { wrapText } from '../utils';

/*
 * PERIODIC_ELEMENT — the repo rendered as a periodic-table element tile.
 * Deep scientific canvas with a faint blurred periodic-grid motif behind
 * everything. A large element tile sits on the left (atomic number = stars,
 * group glyph top-right, huge 2-letter symbol derived from repoName, the
 * full name + forks/language below). A right info column carries the repo
 * heading, an accent underline, the wrapped description and a meta line.
 *
 * Field mapping:
 *   stars     -> atomic number (top-left of tile) + "★ N" accent (top-right)
 *   repoName  -> 2-letter element symbol + element name + right heading
 *   language  -> tile category color + category word + tile footer
 *   forks     -> tile footer + "⑂ N" accent (bottom-right, secondaryColor)
 *   description -> wrapped body in right column
 *   repoOwner -> "@owner" in meta line
 */
export const periodicElement = (ctx, width, height, scale, data) => {
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
  } = data;

  const sans = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const mono = '"JetBrains Mono", ui-monospace, monospace';

  const name = (repoName || 'element').trim();
  const seed = seedFrom(name);

  // Tile category color: language color if known, else the user's primary.
  const tileColor = langColor(language) || primaryColor || '#3178C6';
  const onTile = readableOn(tileColor);
  const tileInk = onTile === '#ffffff' ? 'rgba(255,255,255,0.62)' : 'rgba(0,0,0,0.55)';

  const accent = primaryColor || tileColor;
  const accent2 = secondaryColor || lighten(tileColor, 0.2);
  const ink = '#E8E8EA';
  const inkSoft = '#9AA0AA';

  // ---- 1. Background ----
  const bg = forceDark(bgColor);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Subtle radial lift toward center
  const glow = ctx.createRadialGradient(
    width * 0.5, height * 0.42, 0,
    width * 0.5, height * 0.5, width * 0.7,
  );
  glow.addColorStop(0, hexA(lighten(bg, 0.06), 0.5));
  glow.addColorStop(1, hexA(bg, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // ---- 2. Faint periodic-grid motif ----
  ctx.save();
  const cell = 84 * scale;
  const gap = 10 * scale;
  const square = cell - gap;
  const rad = 6 * scale;
  for (let gy = -cell; gy < height + cell; gy += cell) {
    for (let gx = -cell; gx < width + cell; gx += cell) {
      const jitter = mulberry(seedFrom(`${gx}:${gy}`));
      ctx.fillStyle = hexA('#ffffff', 0.018 + jitter * 0.02);
      roundRectPath(ctx, gx, gy, square, square, rad);
      ctx.fill();
    }
  }
  ctx.restore();

  // ---- 3. Layout frame ----
  const pad = 64 * scale;
  const tileSize = 372 * scale;
  const tileX = pad;
  const tileY = (height - tileSize) / 2;
  const colX = tileX + tileSize + 64 * scale;
  const colW = width - colX - pad;

  // ---- 4. Top accent row (1.x mass on far left, ★ stars on far right) ----
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = inkSoft;
  ctx.font = `${24 * scale}px ${mono}`;
  ctx.textAlign = 'left';
  const massLabel = atomicMass(seed);
  ctx.fillText(massLabel, pad, tileY - 26 * scale);

  if (has(stars)) {
    ctx.textAlign = 'right';
    ctx.fillStyle = accent;
    ctx.font = `${24 * scale}px ${mono}`;
    ctx.fillText(`★ ${String(stars).trim()}`, width - pad, tileY - 26 * scale);
  }

  // ---- 5. The element tile ----
  drawTile(ctx, tileX, tileY, tileSize, scale, {
    tileColor, onTile, tileInk, accent2, mono, sans,
    name, language, stars, forks, seed,
  });

  // ---- 6. Right info column ----
  let cy = tileY + 14 * scale;

  // Crumb: owner / category
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = inkSoft;
  ctx.font = `${18 * scale}px ${mono}`;
  const crumb = `${(repoOwner || 'owner').trim()} / element`;
  ctx.fillText(truncate(ctx, crumb, colW, ctx.font), colX, cy);
  cy += 60 * scale;

  // Heading = repoName
  ctx.fillStyle = ink;
  const headFont = `700 ${58 * scale}px ${sans}`;
  ctx.font = headFont;
  ctx.fillText(truncate(ctx, name, colW, headFont), colX, cy);
  cy += 26 * scale;

  // Underline rule in primary accent
  ctx.fillStyle = accent;
  ctx.fillRect(colX, cy, Math.min(colW, 200 * scale), 4 * scale);
  cy += 50 * scale;

  // Description (2-3 lines)
  if (has(description)) {
    ctx.fillStyle = inkSoft;
    ctx.font = `${26 * scale}px ${sans}`;
    const lineH = 38 * scale;
    const desc = clampLines(ctx, String(description).trim(), colW, 3);
    wrapText(ctx, desc, colX, cy, colW, lineH);
    cy += lineH * 3 + 18 * scale;
  } else {
    cy += 40 * scale;
  }

  // Meta line: category · group n · @owner
  const group = 1 + Math.floor(mulberry(seed) * 18);
  const catWord = categoryWord(language, seed);
  ctx.fillStyle = inkSoft;
  ctx.font = `${20 * scale}px ${mono}`;
  const meta = `${catWord} · group ${group} · @${(repoOwner || 'owner').trim()}`;
  ctx.fillText(truncate(ctx, meta, colW, ctx.font), colX, cy);

  // ---- 7. Bottom-right forks accent ----
  if (has(forks)) {
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = accent2;
    ctx.font = `${24 * scale}px ${mono}`;
    ctx.fillText(`⑂ ${String(forks).trim()}`, width - pad, tileY + tileSize + 38 * scale);
  }

  // Reset
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
};

// ----- the tile -----
function drawTile(ctx, x, y, size, scale, o) {
  const { tileColor, onTile, tileInk, accent2, mono, sans, name, language, stars, forks, seed } = o;
  const r = 28 * scale;

  // Drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 40 * scale;
  ctx.shadowOffsetY = 16 * scale;
  ctx.fillStyle = tileColor;
  roundRectPath(ctx, x, y, size, size, r);
  ctx.fill();
  ctx.restore();

  // Subtle vertical gradient over the body for depth
  const g = ctx.createLinearGradient(x, y, x, y + size);
  g.addColorStop(0, hexA(lighten(tileColor, 0.08), 0.9));
  g.addColorStop(1, hexA(mix(tileColor, '#000000', 0.18), 0.9));
  ctx.fillStyle = g;
  roundRectPath(ctx, x, y, size, size, r);
  ctx.fill();

  // Darker inner panel
  const inset = 14 * scale;
  ctx.fillStyle = hexA(mix(tileColor, '#000000', 0.12), 0.65);
  roundRectPath(ctx, x + inset, y + inset, size - inset * 2, size - inset * 2, r - 6 * scale);
  ctx.fill();

  // 2px border in a lighter shade
  ctx.strokeStyle = hexA(lighten(tileColor, 0.28), 0.85);
  ctx.lineWidth = 2 * scale;
  roundRectPath(ctx, x + 1 * scale, y + 1 * scale, size - 2 * scale, size - 2 * scale, r);
  ctx.stroke();

  const ipad = 30 * scale;

  // Atomic number (= stars) top-left
  ctx.textBaseline = 'top';
  if (has(stars)) {
    ctx.textAlign = 'left';
    ctx.fillStyle = onTile;
    ctx.font = `600 ${30 * scale}px ${mono}`;
    ctx.fillText(String(stars).trim(), x + ipad, y + ipad);
  }

  // Group glyph (seeded 1–18) top-right
  ctx.textAlign = 'right';
  ctx.fillStyle = tileInk;
  ctx.font = `${24 * scale}px ${mono}`;
  const group = 1 + Math.floor(mulberry(seed) * 18);
  ctx.fillText(`☆ ${group}`, x + size - ipad, y + ipad);

  // Center symbol — HUGE
  const symbol = symbolFor(name);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = onTile;
  let symSize = 150 * scale;
  ctx.font = `800 ${symSize}px ${sans}`;
  const maxSymW = size - ipad * 2;
  while (ctx.measureText(symbol).width > maxSymW && symSize > 60 * scale) {
    symSize -= 2 * scale;
    ctx.font = `800 ${symSize}px ${sans}`;
  }
  ctx.fillText(symbol, x + size / 2, y + size * 0.46);

  // Full element name (= repoName) below symbol
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = onTile;
  const nameFont = `600 ${30 * scale}px ${sans}`;
  ctx.font = nameFont;
  ctx.fillText(truncate(ctx, name, maxSymW, nameFont), x + size / 2, y + size * 0.78);

  // Footer: forks · language
  const footParts = [];
  if (has(forks)) footParts.push(String(forks).trim());
  if (has(language)) footParts.push(String(language).trim());
  if (footParts.length) {
    ctx.fillStyle = tileInk;
    const footFont = `${20 * scale}px ${mono}`;
    ctx.font = footFont;
    ctx.fillText(
      truncate(ctx, footParts.join(' · '), maxSymW, footFont),
      x + size / 2,
      y + size - ipad,
    );
  }

  // Accent corner tick (decorative, in secondary)
  ctx.strokeStyle = hexA(accent2, 0.9);
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(x + size - ipad - 22 * scale, y + size - ipad + 4 * scale);
  ctx.lineTo(x + size - ipad, y + size - ipad + 4 * scale);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

// ----- symbol derivation -----
function symbolFor(name) {
  const words = (name || 'element').split(/[^a-zA-Z0-9]+/).filter(Boolean);
  let a = '', b = '';
  if (words.length >= 2) {
    a = words[0][0] || 'E';
    b = words[1][0] || 'l';
  } else {
    const w = words[0] || 'El';
    a = w[0] || 'E';
    b = w[1] || 'l';
  }
  return (a.toUpperCase() + (b || 'l').toLowerCase());
}

function categoryWord(language, seed) {
  const lc = (language || '').toLowerCase();
  const map = {
    typescript: 'metals', javascript: 'metals', python: 'synthetics',
    rust: 'transition', go: 'noble', java: 'metals', 'c++': 'halogens',
    c: 'metalloids', ruby: 'alkali', php: 'lanthanides', swift: 'noble',
    kotlin: 'actinides', html: 'nonmetals', css: 'nonmetals', shell: 'gases',
  };
  if (map[lc]) return map[lc];
  const pool = ['metals', 'noble', 'synthetics', 'halogens', 'metalloids', 'alkali'];
  return pool[Math.floor(mulberry(seed) * pool.length)];
}

function atomicMass(seed) {
  const v = 1 + Math.floor(mulberry(seed) * 250);
  if (v >= 1000) return (v / 1000).toFixed(1) + 'k';
  return String(v);
}

function clampLines(ctx, text, maxW, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) break;
    } else {
      line = test;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  let out = lines.slice(0, maxLines);
  // If we truncated, add ellipsis to the last visible line
  if (lines.length >= maxLines) {
    let last = out[maxLines - 1];
    while (last.length > 1 && ctx.measureText(last + '…').width > maxW) last = last.slice(0, -1);
    out[maxLines - 1] = last + '…';
  }
  return out.join(' ');
}

// ----- generic helpers -----
function parseHex(hex){const h=(hex||'#000').replace('#','');const f=h.length===3?h.split('').map(c=>c+c).join(''):h;return{r:parseInt(f.slice(0,2),16)||0,g:parseInt(f.slice(2,4),16)||0,b:parseInt(f.slice(4,6),16)||0};}
function rgbToHex(r,g,b){const h=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');return '#'+h(r)+h(g)+h(b);}
function mix(a,b,t){const x=parseHex(a),y=parseHex(b);return rgbToHex(x.r+(y.r-x.r)*t,x.g+(y.g-x.g)*t,x.b+(y.b-x.b)*t);}
function lighten(hex,a){const{r,g,b}=parseHex(hex);return rgbToHex(r+255*a,g+255*a,b+255*a);}
function hexA(hex,al){const{r,g,b}=parseHex(hex);return `rgba(${r}, ${g}, ${b}, ${al})`;}
function readableOn(hex){const{r,g,b}=parseHex(hex);return (0.299*r+0.587*g+0.114*b)>150?'#111111':'#ffffff';}
function lum(hex){const{r,g,b}=parseHex(hex);return 0.2126*r+0.7152*g+0.0722*b;}
function forceDark(hex){return lum(hex)<70?hex:mix(hex,'#15171C',0.82);}
function seedFrom(str){let s=0;for(const c of (str||'x'))s=(s*31+c.charCodeAt(0))|0;return Math.abs(s)||1;}
function mulberry(seed){let t=(seed*1831565813)|0;t=(t+0x6D2B79F5)|0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return ((r^(r>>>14))>>>0)/4294967296;}
function has(v){return v!==undefined&&v!==null&&String(v).trim()!=='';}
function truncate(ctx,text,maxW,font){ctx.font=font;if(ctx.measureText(text).width<=maxW)return text;let t=text;while(t.length>1&&ctx.measureText(t+'…').width>maxW)t=t.slice(0,-1);return t+'…';}
function roundRectPath(ctx,x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}
function langColor(language){const m={typescript:'#3178C6',javascript:'#F1E05A',python:'#3572A5',rust:'#DEA584',go:'#00ADD8',java:'#B07219','c++':'#F34B7D',c:'#555555',ruby:'#701516',php:'#4F5D95',swift:'#F05138',kotlin:'#A97BFF',html:'#E34C26',css:'#563D7C',shell:'#89E051'};return m[(language||'').toLowerCase()]||'';}
