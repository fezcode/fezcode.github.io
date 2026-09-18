import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { staticRoutes } from './routes.js';

const PUBLIC = 'public';

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function blogRoutes() {
  const posts = readJson(join(PUBLIC, 'posts', 'posts.json')) || [];
  const out = new Set();
  for (const entry of posts) {
    if (!entry?.slug) continue;
    if (entry.series?.posts?.length) {
      out.add(`/blog/series/${entry.slug}`);
      for (const ep of entry.series.posts) {
        if (ep?.slug) out.add(`/blog/series/${entry.slug}/${ep.slug}`);
      }
    } else {
      out.add(`/blog/${entry.slug}`);
    }
  }
  return out;
}

function logsRoutes() {
  const out = new Set();
  const root = join(PUBLIC, 'logs');
  if (!existsSync(root)) return out;
  for (const category of readdirSync(root, { withFileTypes: true })) {
    if (!category.isDirectory()) continue;
    const dir = join(root, category.name);
    for (const file of readdirSync(dir)) {
      if (file.endsWith('.txt')) {
        out.add(`/logs/${category.name}/${file.slice(0, -4)}`);
      }
    }
    // Some categories (e.g. quote) keep their entries inline in the
    // category piml with no per-slug .txt — pull slugs from there too.
    const pimlPath = join(dir, `${category.name}.piml`);
    if (existsSync(pimlPath)) {
      const text = readFileSync(pimlPath, 'utf8');
      for (const line of text.split(/\r?\n/)) {
        const m = line.match(/^\s*\(slug\)\s*(\S+)/);
        if (m) out.add(`/logs/${category.name}/${m[1]}`);
      }
    }
  }
  return out;
}

function storyBookRoutes() {
  const out = new Set();
  const files = ['books_en.piml', 'books_tr.piml']
    .map((f) => join(PUBLIC, 'stories', f))
    .filter(existsSync);
  const bookIds = new Set();
  const bookEpisodes = new Map();
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    let currentBook = null;
    for (const line of text.split(/\r?\n/)) {
      const bookMatch = line.match(/\(bookId\)\s*(\S+)/);
      if (bookMatch) {
        currentBook = bookMatch[1];
        bookIds.add(currentBook);
        if (!bookEpisodes.has(currentBook)) bookEpisodes.set(currentBook, new Set());
        continue;
      }
      const epMatch = line.match(/^\s*\(id\)\s*(\S+)/);
      if (epMatch && currentBook) {
        bookEpisodes.get(currentBook).add(epMatch[1]);
      }
    }
  }
  for (const id of bookIds) out.add(`/stories/books/${id}`);
  for (const [book, eps] of bookEpisodes) {
    for (const ep of eps) out.add(`/stories/books/${book}/pages/${ep}`);
  }
  return out;
}

/**
 * /demystify is driven entirely by text files: public/demystify/index.txt
 * registers the collections, and each collection's index.txt registers its
 * entries. Reading them here means a new collection or entry is prerendered
 * and sitemapped without touching this file.
 */
function demystifyRoutes() {
  const out = new Set();
  const root = join(PUBLIC, 'demystify');
  const registry = join(root, 'index.txt');
  if (!existsSync(registry)) return out;

  const idsIn = (file) => {
    const ids = [];
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^id:\s*(\S+)/);
      if (m) ids.push(m[1]);
    }
    return ids;
  };

  out.add('/demystify');
  for (const collection of idsIn(registry)) {
    const index = join(root, collection, 'index.txt');
    if (!existsSync(index)) continue;
    out.add(`/demystify/${collection}`);
    for (const entry of idsIn(index)) {
      out.add(`/demystify/${collection}/${entry}`);
    }
  }
  return out;
}

// The vocabulary registry is an ES module the app bundles rather than a data
// file under public/, so the slugs are read off its top-level keys — the same
// keys /vocab/:term routes on. Without this the 70 entries were never
// prerendered and fell through to 404.html, which GitHub Pages serves with a
// 404 status: fine for a reader, invisible to a crawler.
function vocabRoutes() {
  const out = new Set();
  const source = (() => {
    try {
      return readFileSync(join('src', 'data', 'vocabulary.js'), 'utf8');
    } catch {
      return '';
    }
  })();

  for (const match of source.matchAll(/^ {2}'?([a-zA-Z0-9-]+)'?:\s*\{/gm)) {
    out.add(`/vocab/${match[1]}`);
  }
  return out;
}

// Apps are listed by hand in routes.js, which had fallen six behind apps.json —
// chladni-plate, map-builder, ebru, vitray, morphogenesis and
// constellation-cartographer were all live but never prerendered. Reading the
// same file the apps page reads keeps the two from drifting again. This only
// adds; anything in routes.js that apps.json does not know about is kept.
function appRoutes() {
  const apps = readJson(join(PUBLIC, 'apps', 'apps.json')) || {};
  const out = new Set();
  for (const category of Object.values(apps)) {
    for (const app of category?.apps || []) {
      if (app?.to?.startsWith('/apps/')) out.add(app.to);
    }
  }
  return out;
}

// Project pages were in the sitemap but never in the prerender list, so all 36
// of them have been served to crawlers as 404.html. Slugs are pulled off the
// piml by line, the way logsRoutes does it, rather than pulling in a parser.
function projectRoutes() {
  const out = new Set();
  const file = join(PUBLIC, 'projects', 'projects.piml');
  if (!existsSync(file)) return out;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*\(slug\)\s*(\S+)/);
    if (match) out.add(`/projects/${match[1]}`);
  }
  return out;
}

export function discoverAllRoutes() {
  const all = new Set(staticRoutes);
  for (const r of appRoutes()) all.add(r);
  for (const r of projectRoutes()) all.add(r);
  for (const r of blogRoutes()) all.add(r);
  for (const r of logsRoutes()) all.add(r);
  for (const r of storyBookRoutes()) all.add(r);
  for (const r of demystifyRoutes()) all.add(r);
  for (const r of vocabRoutes()) all.add(r);
  return Array.from(all);
}
