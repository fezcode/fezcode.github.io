// Targets and card data for the Fezcodex share cards (scripts/og/codex-card.*).
// Three kinds: the brand `default`, `blog` posts and discovery `log`s. Posts
// and logs with their own existing image keep it and get no card.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { PUBLIC, parsePimlItems, readJson } from './route-meta.mjs';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const DEFAULT_FILE = 'images/og/default.png';

export const BLOG_ACCENTS = {
  dev: '#2563eb',
  rant: '#e2462d',
  feat: '#7c3aed',
  'd&d': '#b45309',
  gist: '#0d9488',
  ai: '#db2777',
  essay: '#c2410c',
};

export const LOG_ACCENTS = {
  book: '#f59e0b',
  movie: '#f43f5e',
  video: '#ef4444',
  game: '#8b5cf6',
  article: '#06b6d4',
  music: '#d946ef',
  series: '#f97316',
  food: '#84cc16',
  websites: '#6366f1',
  tools: '#10b981',
  event: '#eab308',
  quote: '#14b8a6',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  if (!m) return null;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

export function ogFileForRoute(route) {
  return `images/og/${route.replace(/^\//, '').replace(/\/$/, '')}.webp`;
}

function hasImage(image) {
  if (!image) return false;
  if (/^https?:\/\//.test(image)) return true;
  return existsSync(join(PUBLIC, image.replace(/^\//, '')));
}

function readMinutes(filename) {
  if (!filename) return null;
  const path = join(PUBLIC, 'posts', filename);
  if (!existsSync(path)) return null;
  const words = readFileSync(path, 'utf8').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function blogCard(route, entry, parent) {
  const minutes = readMinutes(entry.filename || parent?.filename);
  const category = entry.category || parent?.category;
  return {
    route,
    file: ogFileForRoute(route),
    data: {
      kind: 'blog',
      seed: route,
      title: entry.title || parent?.title,
      desc: entry.description || parent?.description || '',
      pills: [category, formatDate(entry.date || parent?.date)].filter(Boolean),
      accent: BLOG_ACCENTS[category] || '#e2462d',
      header: parent ? `writing · ${parent.title}` : 'writing',
      footer: ['fezcode', minutes && `${minutes} min read`].filter(Boolean).join(' · '),
      url: 'fezcode.com' + route,
    },
  };
}

function cleanTitle(title, category) {
  const t = String(title || '').replace(/^["“”]+|["“”]+$/g, '').trim();
  return category === 'quote' ? `“${t}”` : t;
}

export function getCodexOgTargets() {
  const targets = [
    { route: '/', file: DEFAULT_FILE, data: { kind: 'default', seed: 'fezcodex', accent: '#ff7a59' } },
  ];

  const posts = readJson(join(PUBLIC, 'posts', 'posts.json')) || [];
  for (const entry of posts) {
    if (!SLUG.test(entry?.slug || '')) continue;
    if (entry.series?.posts?.length) {
      const base = `/blog/series/${entry.slug}`;
      if (!hasImage(entry.image)) targets.push(blogCard(base, entry));
      for (const ep of entry.series.posts) {
        if (!SLUG.test(ep?.slug || '')) continue;
        if (hasImage(ep.image) || hasImage(entry.image)) continue;
        targets.push(blogCard(`${base}/${ep.slug}`, ep, entry));
      }
    } else if (!hasImage(entry.image)) {
      targets.push(blogCard(`/blog/${entry.slug}`, entry));
    }
  }

  const logsRoot = join(PUBLIC, 'logs');
  if (existsSync(logsRoot)) {
    for (const dir of readdirSync(logsRoot, { withFileTypes: true })) {
      if (!dir.isDirectory()) continue;
      const pimlPath = join(logsRoot, dir.name, `${dir.name}.piml`);
      if (!existsSync(pimlPath)) continue;
      const category = dir.name;
      for (const it of parsePimlItems(readFileSync(pimlPath, 'utf8'))) {
        if (!SLUG.test(it.slug || '') || hasImage(it.image)) continue;
        const route = `/logs/${category}/${it.slug}`;
        const logged = formatDate(it.date);
        targets.push({
          route,
          file: ogFileForRoute(route),
          data: {
            kind: 'log',
            seed: route,
            title: cleanTitle(it.title, category),
            byline: it.author || it.director || it.artist || it.creator || '',
            pills: [category, logged && `logged ${logged}`].filter(Boolean),
            accent: LOG_ACCENTS[category] || '#6366f1',
            header: 'discovery log',
            url: 'fezcode.com' + route,
          },
        });
      }
    }
  }
  return targets;
}
