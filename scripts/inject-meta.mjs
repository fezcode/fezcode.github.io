import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  buildRouteMetaMap,
  routeToOgPath,
  DIST,
  SITE,
  DEFAULT_IMAGE,
  DEFAULT_DESC,
} from './lib/route-meta.mjs';

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function absoluteUrl(maybePath) {
  if (!maybePath) return SITE + DEFAULT_IMAGE;
  if (/^https?:\/\//.test(maybePath)) return maybePath;
  return SITE + (maybePath.startsWith('/') ? maybePath : '/' + maybePath);
}

function resolveImage(route, meta) {
  if (meta.image) return absoluteUrl(meta.image);
  const generated = routeToOgPath(route);
  const distPath = join(DIST, generated);
  if (existsSync(distPath)) return absoluteUrl('/' + generated);
  return absoluteUrl(DEFAULT_IMAGE);
}

function rewriteHead(html, route, meta) {
  const title = meta.title || 'fezcodex';
  const description = meta.description || DEFAULT_DESC;
  const image = resolveImage(route, meta);
  const url = SITE + route;
  const type = meta.type || 'website';

  const eTitle = escapeAttr(title);
  const eDesc = escapeAttr(description);
  const eImg = escapeAttr(image);
  const eUrl = escapeAttr(url);
  const eType = escapeAttr(type);

  const subs = [
    [/<title>[^<]*<\/title>/i, `<title>${eTitle}</title>`],
    [
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${eDesc}" />`,
    ],
    [
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:type" content="${eType}" />`,
    ],
    [
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${eUrl}" />`,
    ],
    [
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${eTitle}" />`,
    ],
    [
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${eDesc}" />`,
    ],
    [
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image" content="${eImg}" />`,
    ],
    [
      /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:url" content="${eUrl}" />`,
    ],
    [
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${eTitle}" />`,
    ],
    [
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${eDesc}" />`,
    ],
    [
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:image" content="${eImg}" />`,
    ],
  ];

  let out = html;
  let hits = 0;
  for (const [re, rep] of subs) {
    const next = out.replace(re, rep);
    if (next !== out) hits++;
    out = next;
  }
  return { html: out, hits };
}

function fileToRoute(file) {
  const rel = file.slice(DIST.length).replace(/\\/g, '/');
  if (rel === '/index.html') return '/';
  if (rel.endsWith('/index.html')) return rel.slice(0, -'/index.html'.length);
  return null;
}

async function walkHtml(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walkHtml(full, out);
    else if (entry.isFile() && entry.name === 'index.html') out.push(full);
  }
  return out;
}

async function main() {
  const t0 = Date.now();
  if (!existsSync(DIST)) {
    console.error(`inject-meta: ${DIST} does not exist; run vite build first`);
    process.exit(1);
  }
  const routeMap = buildRouteMetaMap();
  console.log(`inject-meta: ${routeMap.size} routes have per-page metadata`);

  const files = await walkHtml(DIST);
  let touched = 0;
  let skipped = 0;
  let missing = 0;
  for (const file of files) {
    const route = fileToRoute(file);
    if (route == null) {
      skipped++;
      continue;
    }
    const meta = routeMap.get(route);
    if (!meta) {
      missing++;
      continue;
    }
    const html = await readFile(file, 'utf8');
    const { html: next, hits } = rewriteHead(html, route, meta);
    if (hits === 0) {
      skipped++;
      continue;
    }
    await writeFile(file, next, 'utf8');
    touched++;
  }
  console.log(
    `inject-meta: rewrote ${touched} file(s), ${missing} without per-page meta, ${skipped} skipped (${Date.now() - t0}ms)`
  );
}

await main();
