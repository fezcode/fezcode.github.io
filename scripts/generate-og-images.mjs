import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { writeFile, mkdir, copyFile, stat } from 'node:fs/promises';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, extname } from 'node:path';
import { buildRouteMetaMap, routeToOgPath, DIST, PUBLIC } from './lib/route-meta.mjs';

const WEBP_QUALITY = 80;

// Bump when the rendering algorithm changes (layout, gradient logic, font, etc.)
// — invalidates every cached WebP.
const CACHE_VERSION = 'v1';
const CACHE_DIR = join('node_modules', '.cache', 'og-images');

const W = 1200;
const H = 630;
const STRIP_H = 200;
const PAD_X = 70;

const ART_DIR = join(PUBLIC, 'images', 'og-art');
// resvg-js supports JPEG/PNG/GIF only — WebP/AVIF are silently skipped.
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif' };
const UNSUPPORTED_EXT = new Set(['.webp', '.avif', '.heic', '.heif', '.tiff', '.tif']);

function sha256Hex(input) {
  return createHash('sha256').update(input).digest('hex');
}

function loadArt() {
  if (!existsSync(ART_DIR)) return [];
  const out = [];
  const skipped = [];
  for (const f of readdirSync(ART_DIR)) {
    const ext = extname(f).toLowerCase();
    if (UNSUPPORTED_EXT.has(ext)) {
      skipped.push(f);
      continue;
    }
    if (!MIME[ext]) continue;
    const buf = readFileSync(join(ART_DIR, f));
    out.push({
      name: f,
      dataUri: `data:${MIME[ext]};base64,${buf.toString('base64')}`,
      hash: sha256Hex(buf),
    });
  }
  if (skipped.length) {
    console.warn(
      `generate-og-images: skipping ${skipped.length} unsupported file(s) (resvg-js only reads JPEG/PNG/GIF): ${skipped.join(', ')}`
    );
  }
  return out;
}

function cacheKeyFor({ title, slug, art }) {
  return sha256Hex(
    JSON.stringify({
      v: CACHE_VERSION,
      title,
      slug,
      artName: art?.name ?? null,
      artHash: art?.hash ?? null,
    })
  );
}

function hashSlug(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  }
  return h;
}

function gradientStops(slug) {
  const h = hashSlug(slug);
  const hue1 = h % 360;
  const hue2 = (hue1 + 25 + ((h >> 8) % 50)) % 360;
  const sat = 55 + ((h >> 16) % 25);
  const lit = 30 + ((h >> 20) % 12);
  return {
    a: `hsl(${hue1}, ${sat}%, ${lit}%)`,
    b: `hsl(${hue2}, ${sat + 5}%, ${lit + 10}%)`,
  };
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrap(text, maxChars, maxLines) {
  if (!text) return [];
  const words = String(text).replace(/\s+/g, ' ').trim().split(' ');
  const lines = [];
  let cur = '';
  let i = 0;
  for (; i < words.length; i++) {
    const w = words[i];
    const candidate = cur ? cur + ' ' + w : w;
    if (candidate.length <= maxChars) {
      cur = candidate;
    } else {
      if (cur) lines.push(cur);
      if (lines.length === maxLines) break;
      cur = w.length > maxChars ? w.slice(0, maxChars - 1) + '…' : w;
    }
  }
  if (cur && lines.length < maxLines) {
    lines.push(cur);
    i++;
  }
  if (i < words.length && lines.length > 0) {
    const last = lines[lines.length - 1];
    const room = maxChars - 1;
    lines[lines.length - 1] = last.length <= room ? last + '…' : last.slice(0, room) + '…';
  }
  return lines;
}

function pickArt(art, slug) {
  if (!art.length) return null;
  return art[hashSlug(slug) % art.length];
}

function buildSvg({ title, slug, art }) {
  const { a, b } = gradientStops(slug);
  const stripY = H - STRIP_H;
  const fadeStartY = stripY - 60;

  const titleLines = wrap(title, 30, 2);
  const titleFontSize = titleLines.length === 1 ? 64 : 56;
  const titleLineH = 64;
  const titleBlockH = titleLines.length * titleLineH;
  const titleStartY = stripY + (STRIP_H - titleBlockH) / 2 + titleFontSize - 6;

  const titleTspans = titleLines
    .map((l, i) => `<tspan x="${PAD_X}" dy="${i === 0 ? 0 : titleLineH}">${escapeXml(l)}</tspan>`)
    .join('');

  const background = art
    ? `<image href="${art.dataUri}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" />
       <rect x="0" y="0" width="${W}" height="${H}" fill="url(#topVignette)" />`
    : `<rect width="${W}" height="${H}" fill="#0a0a0a" />
       <rect y="${stripY}" width="${W}" height="${STRIP_H}" fill="url(#solidStrip)" />`;

  const stripOverlay = art
    ? `<rect x="0" y="${fadeStartY}" width="${W}" height="${H - fadeStartY}" fill="url(#fadeToBlack)" />`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="solidStrip" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}" />
      <stop offset="1" stop-color="${b}" />
    </linearGradient>
    <linearGradient id="topVignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.35" />
      <stop offset="0.18" stop-color="#000" stop-opacity="0" />
      <stop offset="0.55" stop-color="#000" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="fadeToBlack" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0" />
      <stop offset="0.35" stop-color="#000" stop-opacity="0.55" />
      <stop offset="1" stop-color="#000" stop-opacity="0.92" />
    </linearGradient>
  </defs>

  ${background}
  ${stripOverlay}

  <g>
    <rect x="${PAD_X - 14}" y="46" width="180" height="40" rx="6" fill="#000" fill-opacity="0.55" />
    <text x="${PAD_X}" y="73" font-family="Segoe UI, Arial, sans-serif" font-size="20" fill="#f0f0f0" letter-spacing="6" font-weight="600">FEZCODEX</text>
  </g>

  <text x="${PAD_X}" y="${titleStartY}" font-family="Georgia, 'Times New Roman', serif" font-size="${titleFontSize}" fill="#ffffff" font-weight="700">
    ${titleTspans}
  </text>
</svg>`;
}

async function renderWebp(svg) {
  const resvg = new Resvg(svg, {
    background: '#0a0a0a',
    font: { loadSystemFonts: true, defaultFontFamily: 'Georgia' },
    fitTo: { mode: 'width', value: W },
  });
  const png = resvg.render().asPng();
  return sharp(png).webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer();
}

async function main() {
  const t0 = Date.now();
  const art = loadArt();
  if (art.length === 0) {
    console.log(
      `generate-og-images: no paintings in ${ART_DIR}; falling back to solid background. ` +
        `Drop PD paintings (.jpg/.png/.webp) there to enable backgrounds.`
    );
  } else {
    console.log(`generate-og-images: ${art.length} painting(s) loaded from ${ART_DIR}`);
  }

  const routeMap = buildRouteMetaMap();
  const targets = [];
  for (const [route, meta] of routeMap) {
    if (meta.image) continue;
    if (!meta.title) continue;
    targets.push({ route, meta });
  }
  console.log(`generate-og-images: ${targets.length} route(s) need a fallback image`);

  if (!existsSync(CACHE_DIR)) await mkdir(CACHE_DIR, { recursive: true });

  let rendered = 0;
  let cached = 0;
  let totalBytes = 0;
  for (const { route, meta } of targets) {
    const slug = route.split('/').filter(Boolean).pop() || 'fezcodex';
    const chosenArt = pickArt(art, slug);
    const key = cacheKeyFor({ title: meta.title, slug, art: chosenArt });
    const cachePath = join(CACHE_DIR, `${key}.webp`);
    const outAbs = join(DIST, routeToOgPath(route));
    if (!existsSync(dirname(outAbs))) await mkdir(dirname(outAbs), { recursive: true });

    if (existsSync(cachePath)) {
      await copyFile(cachePath, outAbs);
      const st = await stat(cachePath);
      cached++;
      totalBytes += st.size;
      continue;
    }

    const svg = buildSvg({ title: meta.title, slug, art: chosenArt });
    const webp = await renderWebp(svg);
    await writeFile(outAbs, webp);
    await writeFile(cachePath, webp);
    rendered++;
    totalBytes += webp.length;
  }

  const written = rendered + cached;
  const avgKb = written ? Math.round(totalBytes / written / 1024) : 0;
  console.log(
    `generate-og-images: wrote ${written} WebP(s) (${rendered} rendered, ${cached} cached), avg ${avgKb} KB (${Date.now() - t0}ms)`
  );
}

await main();
