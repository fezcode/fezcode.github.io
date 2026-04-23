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
      if (!file.endsWith('.txt')) continue;
      const slug = file.slice(0, -4);
      out.add(`/logs/${category.name}/${slug}`);
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

export function discoverAllRoutes() {
  const all = new Set(staticRoutes);
  for (const r of blogRoutes()) all.add(r);
  for (const r of logsRoutes()) all.add(r);
  for (const r of storyBookRoutes()) all.add(r);
  return Array.from(all);
}
