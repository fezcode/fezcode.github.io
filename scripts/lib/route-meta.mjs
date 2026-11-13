import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import piml from 'piml';

export const PUBLIC = 'public';
export const DIST = 'dist/client';
export const SITE = 'https://fezcode.com';
export const DEFAULT_IMAGE = '/images/asset/ogtitle.png';
export const DEFAULT_DESC = 'codex by fezcode...';

export function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

export function parsePimlItems(text) {
  const items = [];
  let current = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith('> (item)')) {
      if (current) items.push(current);
      current = {};
      continue;
    }
    if (!current) continue;
    const m = line.match(/^\(([\w-]+)\)\s*(.*)$/);
    if (m) current[m[1]] = m[2];
  }
  if (current) items.push(current);
  return items;
}

function blogMeta(routeMap, posts) {
  for (const entry of posts) {
    if (!entry?.slug) continue;
    if (entry.series?.posts?.length) {
      routeMap.set(`/blog/series/${entry.slug}`, {
        title: entry.title,
        description: entry.description,
        image: entry.image,
        type: 'article',
      });
      for (const ep of entry.series.posts) {
        if (!ep?.slug) continue;
        routeMap.set(`/blog/series/${entry.slug}/${ep.slug}`, {
          title: ep.title || entry.title,
          description: ep.description || entry.description,
          image: ep.image || entry.image,
          type: 'article',
        });
      }
    } else {
      routeMap.set(`/blog/${entry.slug}`, {
        title: entry.title,
        description: entry.description,
        image: entry.image,
        type: 'article',
      });
    }
  }
}

function logsMeta(routeMap) {
  const root = join(PUBLIC, 'logs');
  if (!existsSync(root)) return;
  for (const cat of readdirSync(root, { withFileTypes: true })) {
    if (!cat.isDirectory()) continue;
    const pimlPath = join(root, cat.name, `${cat.name}.piml`);
    if (!existsSync(pimlPath)) continue;
    const items = parsePimlItems(readFileSync(pimlPath, 'utf8'));
    for (const it of items) {
      if (!it.slug) continue;
      routeMap.set(`/logs/${cat.name}/${it.slug}`, {
        title: it.title?.replace(/^"|"$/g, '') || cat.name,
        description: it.description,
        image: it.image,
        type: 'article',
      });
    }
  }
}

function projectsMeta(routeMap) {
  const registryPath = join(PUBLIC, 'projects', 'projects.piml');
  if (!existsSync(registryPath)) return;
  const { projects } = piml.parse(readFileSync(registryPath, 'utf8'));
  if (!Array.isArray(projects)) return;
  for (const project of projects) {
    if (!project?.slug) continue;
    routeMap.set(`/projects/${project.slug}`, {
      title: `${project.title} | Fezcodex`,
      description: project.shortDescription,
      image: project.image,
      type: 'website',
    });
  }
}

export function buildRouteMetaMap() {
  const map = new Map();
  const posts = readJson(join(PUBLIC, 'posts', 'posts.json')) || [];
  blogMeta(map, posts);
  logsMeta(map);
  projectsMeta(map);
  return map;
}

export function routeToOgPath(route) {
  // /blog/foo -> images/og/blog/foo.webp
  // /logs/book/bar -> images/og/logs/book/bar.webp
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  return `images/og/${clean}.webp`;
}
