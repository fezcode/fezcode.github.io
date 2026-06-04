import { wrapText } from '../utils';

// Spotify "Now Playing" — the repo reimagined as a music streaming player
// card. A large generated gradient album cover sits on the left; the full
// player stack (track, artist, progress, transport controls, footer) runs
// down the right. Everything is seeded from the repo name so plays/times/art
// are deterministic.
export const spotifyNowPlaying = (ctx, width, height, scale, data) => {
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

  const accent = primaryColor || '#1DB954';
  const accent2 = secondaryColor || '#1ED760';
  const surface = forceDark(bgColor || '#121212');
  const sans = 'system-ui,-apple-system,"Segoe UI","Helvetica Neue",sans-serif';
  const mono = '"JetBrains Mono","Geist Mono",ui-monospace,monospace';

  const owner = (repoOwner || 'owner').toString();
  const name = (repoName || 'track').toString();
  const seed = seedFrom(name);

  const S = (n) => n * scale;

  // ── Background — color washed up from the album art into a dark base.
  const washTop = mix(accent, surface, 0.7);
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, washTop);
  bg.addColorStop(0.62, mix(washTop, surface, 0.75));
  bg.addColorStop(1, surface);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const text = '#ffffff';
  const muted = hexA(text, 0.66);
  const faint = hexA(text, 0.42);
  const padX = S(72);

  // ── ALBUM ART — large rounded square on the left, generated cover.
  const artSize = S(468);
  const artX = padX;
  const artY = S(96);
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = S(40);
  ctx.shadowOffsetY = S(18);
  roundRectPath(ctx, artX, artY, artSize, artSize, S(14));
  ctx.fillStyle = surface;
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRectPath(ctx, artX, artY, artSize, artSize, S(14));
  ctx.clip();
  // diagonal primary → secondary gradient
  const cover = ctx.createLinearGradient(artX, artY, artX + artSize, artY + artSize);
  cover.addColorStop(0, accent);
  cover.addColorStop(1, accent2);
  ctx.fillStyle = cover;
  ctx.fillRect(artX, artY, artSize, artSize);
  // seeded soft orbs
  for (let i = 0; i < 5; i++) {
    const ox = artX + mulberry(seed + i * 7) * artSize;
    const oy = artY + mulberry(seed + i * 13 + 4) * artSize;
    const orad = (40 + mulberry(seed + i * 17) * 120) * scale;
    const tone = mulberry(seed + i * 23) > 0.5 ? lighten(accent2, 0.25) : mix(accent, '#000000', 0.4);
    const orb = ctx.createRadialGradient(ox, oy, 0, ox, oy, orad);
    orb.addColorStop(0, hexA(tone, 0.5));
    orb.addColorStop(1, hexA(tone, 0));
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(ox, oy, orad, 0, Math.PI * 2);
    ctx.fill();
  }
  // subtle vinyl sheen — a soft diagonal highlight band
  const sheen = ctx.createLinearGradient(artX, artY, artX + artSize, artY + artSize);
  sheen.addColorStop(0, hexA('#ffffff', 0));
  sheen.addColorStop(0.45, hexA('#ffffff', 0.12));
  sheen.addColorStop(0.55, hexA('#ffffff', 0));
  ctx.fillStyle = sheen;
  ctx.fillRect(artX, artY, artSize, artSize);
  // faint monogram of the name initial, low alpha
  ctx.fillStyle = hexA('#000000', 0.16);
  ctx.font = `800 ${S(200)}px ${sans}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText((name[0] || '♪').toUpperCase(), artX + artSize / 2, artY + artSize / 2);
  ctx.textAlign = 'left';
  ctx.restore();

  // ── RIGHT STACK — the whole player, to the right of the cover.
  const rx = artX + artSize + S(70);
  const rW = width - rx - padX;
  const rCx = rx + rW / 2;

  // eyebrow + small equalizer flourish
  ctx.fillStyle = faint;
  ctx.font = `700 ${S(14)}px ${sans}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  letterSpaced(ctx, 'NOW PLAYING', rx, S(120), S(3.2));
  drawEqualizer(ctx, rx + rW - S(64), S(104), S(54), S(22), accent, accent2, seed);

  // title (big bold white)
  ctx.fillStyle = text;
  const titleSize = name.length > 18 ? S(44) : S(58);
  const titleFont = `800 ${titleSize}px ${sans}`;
  ctx.font = titleFont;
  ctx.fillText(truncate(ctx, name, rW, titleFont), rx, S(180));

  // artist (muted)
  ctx.fillStyle = muted;
  ctx.font = `500 ${S(24)}px ${sans}`;
  ctx.fillText(truncate(ctx, `@${owner}`, rW, `500 ${S(24)}px ${sans}`), rx, S(216));

  // album · language
  if (has(language)) {
    ctx.fillStyle = faint;
    ctx.font = `500 ${S(17)}px ${sans}`;
    ctx.fillText(truncate(ctx, `Album · ${language}`, rW, `500 ${S(17)}px ${sans}`), rx, S(246));
  }

  // description (muted, up to 2 lines)
  if (has(description)) {
    ctx.fillStyle = muted;
    ctx.font = `400 ${S(20)}px ${sans}`;
    const clipped = description.length > 130 ? `${description.slice(0, 127)}…` : description;
    wrapText(ctx, clipped, rx, S(290), rW, S(30));
  }

  // ── PROGRESS BAR
  const barY = S(388);
  const barH = S(6);
  const frac = 0.18 + mulberry(seed + 91) * 0.62;
  roundRectPath(ctx, rx, barY, rW, barH, barH / 2);
  ctx.fillStyle = hexA('#ffffff', 0.22);
  ctx.fill();
  const fillW = rW * frac;
  roundRectPath(ctx, rx, barY, fillW, barH, barH / 2);
  ctx.fillStyle = accent;
  ctx.fill();
  // knob
  ctx.beginPath();
  ctx.arc(rx + fillW, barY + barH / 2, S(8), 0, Math.PI * 2);
  ctx.fillStyle = text;
  ctx.fill();
  // time stamps (mono)
  const total = 95 + Math.floor(mulberry(seed + 33) * 200); // 1:35 .. ~4:55
  const elapsed = Math.floor(total * frac);
  ctx.font = `500 ${S(14)}px ${mono}`;
  ctx.fillStyle = faint;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(fmtTime(elapsed), rx, barY + S(14));
  ctx.textAlign = 'right';
  ctx.fillText(fmtTime(total), rx + rW, barY + S(14));
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // ── CONTROLS row — shuffle · prev · PLAY · next · repeat
  const ctrlY = S(460);
  const playR = S(34);
  const gap = S(84);
  ctx.lineWidth = S(3);
  drawShuffle(ctx, rCx - gap * 2, ctrlY, S(13), muted);
  drawSkip(ctx, rCx - gap, ctrlY, S(12), text, true);
  // PLAY circle
  ctx.beginPath();
  ctx.arc(rCx, ctrlY, playR, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.fill();
  // play triangle
  const tri = S(15);
  ctx.beginPath();
  ctx.moveTo(rCx - tri * 0.55 + S(2), ctrlY - tri);
  ctx.lineTo(rCx - tri * 0.55 + S(2), ctrlY + tri);
  ctx.lineTo(rCx + tri + S(2), ctrlY);
  ctx.closePath();
  ctx.fillStyle = readableOn(accent);
  ctx.fill();
  drawSkip(ctx, rCx + gap, ctrlY, S(12), text, false);
  drawRepeat(ctx, rCx + gap * 2, ctrlY, S(13), muted);

  // ── BOTTOM ROW — like · plays/saves · device
  const botY = S(530);
  ctx.lineWidth = S(2.4);
  drawHeart(ctx, rx + S(9), botY, S(11), accent2);

  ctx.textBaseline = 'middle';
  ctx.font = `500 ${S(15)}px ${sans}`;
  ctx.textAlign = 'left';
  let mx = rx + S(36);
  if (has(stars)) {
    ctx.fillStyle = muted;
    ctx.fillText(`♪ ${stars} plays`, mx, botY);
    mx += ctx.measureText(`♪ ${stars} plays`).width + S(22);
  }
  if (has(forks)) {
    ctx.fillStyle = faint;
    ctx.fillText(`${forks} saves`, mx, botY);
  }
  // device line (right aligned)
  const device = has(supportUrl) ? supportUrl : `Listening on ${owner}'s Mac`;
  ctx.textAlign = 'right';
  drawSpeaker(ctx, rx + rW - S(8), botY, S(9), accent);
  ctx.fillStyle = accent;
  ctx.font = `600 ${S(14)}px ${sans}`;
  ctx.fillText(truncate(ctx, device, rW * 0.62, `600 ${S(14)}px ${sans}`), rx + rW - S(28), botY);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
};

// ─── helpers ────────────────────────────────────────────────────────────────

function letterSpaced(ctx, txt, x, y, spacing) {
  const align = ctx.textAlign;
  let total = 0;
  for (const ch of txt) total += ctx.measureText(ch).width + spacing;
  total -= spacing;
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  const prev = ctx.textAlign;
  ctx.textAlign = 'left';
  for (const ch of txt) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
  ctx.textAlign = prev;
  return total;
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function drawSkip(ctx, x, y, s, color, isPrev) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  const dir = isPrev ? -1 : 1;
  // two triangles pointing in the skip direction
  ctx.beginPath();
  ctx.moveTo(x - dir * s, y - s);
  ctx.lineTo(x - dir * s, y + s);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x, y + s);
  ctx.lineTo(x + dir * s, y);
  ctx.closePath();
  ctx.fill();
  // bar at the leading edge
  ctx.lineWidth = s * 0.32;
  ctx.beginPath();
  ctx.moveTo(x + dir * s * 1.15, y - s);
  ctx.lineTo(x + dir * s * 1.15, y + s);
  ctx.stroke();
  ctx.restore();
}

function drawShuffle(ctx, x, y, s, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = s * 0.22;
  ctx.lineCap = 'round';
  const L = s * 1.4;
  ctx.beginPath();
  ctx.moveTo(x - L, y - s * 0.6);
  ctx.bezierCurveTo(x - s * 0.2, y - s * 0.6, x + s * 0.2, y + s * 0.6, x + L * 0.7, y + s * 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - L, y + s * 0.6);
  ctx.bezierCurveTo(x - s * 0.2, y + s * 0.6, x + s * 0.2, y - s * 0.6, x + L * 0.7, y - s * 0.6);
  ctx.stroke();
  // arrowheads
  arrow(ctx, x + L * 0.7, y + s * 0.6, s * 0.5, color, 1);
  arrow(ctx, x + L * 0.7, y - s * 0.6, s * 0.5, color, 1);
  ctx.restore();
}

function drawRepeat(ctx, x, y, s, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = s * 0.22;
  ctx.lineCap = 'round';
  const r = s;
  ctx.beginPath();
  ctx.arc(x, y, r, Math.PI * 0.15, Math.PI * 1.7);
  ctx.stroke();
  arrow(ctx, x + Math.cos(Math.PI * 0.15) * r, y + Math.sin(Math.PI * 0.15) * r, s * 0.5, color, 1);
  ctx.restore();
}

function arrow(ctx, x, y, s, color, dir) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - s * dir, y - s);
  ctx.lineTo(x - s * dir, y + s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawHeart(ctx, x, y, s, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.24;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.7);
  ctx.bezierCurveTo(x - s * 1.4, y - s * 0.5, x - s * 0.5, y - s * 1.1, x, y - s * 0.35);
  ctx.bezierCurveTo(x + s * 0.5, y - s * 1.1, x + s * 1.4, y - s * 0.5, x, y + s * 0.7);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawSpeaker(ctx, x, y, s, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.22;
  ctx.lineCap = 'round';
  // speaker body
  ctx.beginPath();
  ctx.moveTo(x - s, y - s * 0.4);
  ctx.lineTo(x - s * 0.4, y - s * 0.4);
  ctx.lineTo(x + s * 0.2, y - s);
  ctx.lineTo(x + s * 0.2, y + s);
  ctx.lineTo(x - s * 0.4, y + s * 0.4);
  ctx.lineTo(x - s, y + s * 0.4);
  ctx.closePath();
  ctx.fill();
  // sound waves
  ctx.beginPath();
  ctx.arc(x + s * 0.2, y, s * 0.7, -Math.PI * 0.35, Math.PI * 0.35);
  ctx.stroke();
  ctx.restore();
}

function drawEqualizer(ctx, x, y, w, h, c1, c2, seed) {
  ctx.save();
  const bars = 9;
  const bw = w / (bars * 1.6);
  for (let i = 0; i < bars; i++) {
    const bh = (0.25 + mulberry(seed + i * 31) * 0.75) * h;
    const bx = x + i * (bw * 1.6);
    roundRectPath(ctx, bx, y + h - bh, bw, bh, bw / 2);
    ctx.fillStyle = i % 2 === 0 ? c1 : c2;
    ctx.globalAlpha = 0.85;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function parseHex(hex) {
  const h = (hex || '#000').replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return { r: parseInt(f.slice(0, 2), 16) || 0, g: parseInt(f.slice(2, 4), 16) || 0, b: parseInt(f.slice(4, 6), 16) || 0 };
}
function rgbToHex(r, g, b) {
  const h = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return '#' + h(r) + h(g) + h(b);
}
function mix(a, b, t) {
  const x = parseHex(a), y = parseHex(b);
  return rgbToHex(x.r + (y.r - x.r) * t, x.g + (y.g - x.g) * t, x.b + (y.b - x.b) * t);
}
function lighten(hex, a) {
  const { r, g, b } = parseHex(hex);
  return rgbToHex(r + 255 * a, g + 255 * a, b + 255 * a);
}
function hexA(hex, al) {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${al})`;
}
function lum(hex) {
  const { r, g, b } = parseHex(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function forceDark(hex) {
  return lum(hex) < 70 ? hex : mix(hex, '#121212', 0.86);
}
function readableOn(hex) {
  const { r, g, b } = parseHex(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#111111' : '#ffffff';
}
function seedFrom(str) {
  let s = 0;
  for (const c of (str || 'x')) s = (s * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(s) || 1;
}
function mulberry(seed) {
  let t = (seed * 1831565813) | 0;
  t = (t + 0x6D2B79F5) | 0;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
}
function has(v) {
  return v !== undefined && v !== null && String(v).trim() !== '';
}
function truncate(ctx, text, maxW, font) {
  ctx.font = font;
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t + '…';
}
function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
