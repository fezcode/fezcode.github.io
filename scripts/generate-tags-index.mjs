import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import piml from 'piml';
import { normalizeTag } from '../src/utils/tagSlug.mjs';

// One index of every tag across posts, logs and projects, so /tags, the
// knowledge graph and any filter read a single small file instead of each
// fetching and re-normalizing every source. Pure file reads and string work:
// it runs in milliseconds and belongs in `pregenerate`.
//
//   public/tags/tags.piml   hand-written registry: labels, descriptions, aliases
//   public/tags/index.piml  generated here: (tags) with counts, (items) once each

const started = performance.now();
const PUBLIC = 'public';
const REGISTRY = join(PUBLIC, 'tags', 'tags.piml');
const OUT = join(PUBLIC, 'tags', 'index.piml');
const DESCRIPTION_LIMIT = 180;

const readPiml = (file) =>
  existsSync(file) ? piml.parse(readFileSync(file, 'utf8')) : {};
const list = (value) =>
  Array.isArray(value)
    ? value
    : value === undefined || value === null
      ? []
      : [value];
const text = (value) => (typeof value === 'string' ? value.trim() : '');
const short = (value) => {
  const clean = text(value).replace(/\s+/g, ' ');
  return clean.length > DESCRIPTION_LIMIT
    ? `${clean.slice(0, DESCRIPTION_LIMIT - 1).trimEnd()}…`
    : clean;
};

// ---- registry ----------------------------------------------------------
const registry = new Map();
const aliases = new Map();
const problems = [];
for (const tag of list(readPiml(REGISTRY).tags)) {
  const slug = normalizeTag(tag.slug);
  if (!slug) continue;
  if (slug !== tag.slug)
    problems.push(
      `registry slug "${tag.slug}" is not normalized (use "${slug}")`,
    );
  registry.set(slug, tag);
  for (const alias of list(tag.aliases)) {
    const key = normalizeTag(alias);
    if (key && key !== slug) aliases.set(key, slug);
  }
}
for (const [alias, slug] of aliases) {
  if (registry.has(alias))
    problems.push(`"${alias}" is both a tag and an alias of "${slug}"`);
}
const canonical = (raw) => {
  const slug = normalizeTag(raw);
  return aliases.get(slug) || slug;
};
const canonicalSet = (...sources) => [
  ...new Set(sources.flatMap(list).map(canonical).filter(Boolean)),
];

// ---- sources -----------------------------------------------------------
const items = [];
const add = (item) => {
  if (item.tags.length) items.push(item);
};

const posts = existsSync(join(PUBLIC, 'posts', 'posts.json'))
  ? JSON.parse(readFileSync(join(PUBLIC, 'posts', 'posts.json'), 'utf8'))
  : [];
for (const post of posts) {
  if (!post?.slug) continue;
  const episodes = list(post.series?.posts);
  if (episodes.length) {
    for (const episode of episodes) {
      if (!episode?.slug) continue;
      add({
        id: `post/${post.slug}/${episode.slug}`,
        type: 'post',
        title: text(episode.title),
        path: `/blog/series/${post.slug}/${episode.slug}`,
        date: text(episode.date || post.date),
        category: text(episode.category || post.category),
        series: text(post.title),
        description: short(episode.description || post.description),
        tags: canonicalSet(episode.tags, post.tags),
      });
    }
  } else {
    add({
      id: `post/${post.slug}`,
      type: 'post',
      title: text(post.title),
      path: `/blog/${post.slug}`,
      date: text(post.date),
      category: text(post.category),
      description: short(post.description),
      tags: canonicalSet(post.tags),
    });
  }
}

const logsRoot = join(PUBLIC, 'logs');
for (const dir of existsSync(logsRoot)
  ? readdirSync(logsRoot, { withFileTypes: true })
  : []) {
  if (!dir.isDirectory()) continue;
  const data = readPiml(join(logsRoot, dir.name, `${dir.name}.piml`));
  for (const log of list(data.logs || data.items)) {
    // Real log entries carry a (category) and (slug); `reading` does not.
    if (!log?.slug || !log.category) continue;
    add({
      id: `log/${dir.name}/${log.slug}`,
      type: 'log',
      title: text(log.title),
      path: `/logs/${dir.name}/${log.slug}`,
      date: text(log.date),
      category: dir.name,
      description: short(log.description),
      tags: canonicalSet(log.tags),
    });
  }
}

for (const project of list(
  readPiml(join(PUBLIC, 'projects', 'projects.piml')).projects,
)) {
  if (!project?.slug) continue;
  add({
    id: `project/${project.slug}`,
    type: 'project',
    title: text(project.title),
    path: `/projects/${project.slug}`,
    date: text(project.date),
    description: short(project.shortDescription || project.description),
    // A project's stack is part of what it is about: react, go, cli...
    tags: canonicalSet(project.tags, project.technologies),
  });
}

items.sort(
  (a, b) =>
    (b.date || '').localeCompare(a.date || '') || a.id.localeCompare(b.id),
);

// ---- tags --------------------------------------------------------------
const tags = new Map();
for (const item of items) {
  for (const slug of item.tags) {
    if (!tags.has(slug)) tags.set(slug, { post: 0, log: 0, project: 0 });
    tags.get(slug)[item.type] += 1;
  }
}
// Unregistered tags read as sentence case: dark-comedy -> "Dark comedy".
const label = (slug) => {
  const words = slug.replace(/-/g, ' ');
  return (
    text(registry.get(slug)?.label) ||
    words.charAt(0).toUpperCase() + words.slice(1)
  );
};
const tagList = [...tags]
  .map(([slug, counts]) => {
    const entry = registry.get(slug);
    return {
      slug,
      label: label(slug),
      count: counts.post + counts.log + counts.project,
      // Per-type counts only when nonzero, to keep the index small.
      ...(counts.post && { posts: counts.post }),
      ...(counts.log && { logs: counts.log }),
      ...(counts.project && { projects: counts.project }),
      ...(text(entry?.description) && { description: text(entry.description) }),
    };
  })
  .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));

const header = `# Generated by scripts/generate-tags-index.mjs from posts, logs, projects\n# and public/tags/tags.piml. Do not edit; edit the sources and regenerate.\n\n`;
// Aliases let a URL or a consumer resolve an old spelling (golang -> go).
const aliasList = [...aliases]
  .filter(([, slug]) => tags.has(slug))
  .map(([alias, slug]) => ({ alias, tag: slug }))
  .sort((a, b) => a.alias.localeCompare(b.alias));
const output =
  header + piml.stringify({ tags: tagList, aliases: aliasList, items }) + '\n';
const previous = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
if (previous !== output) writeFileSync(OUT, output);

const unregistered = tagList.filter((tag) => !registry.has(tag.slug)).length;
for (const problem of problems) console.warn(`generate-tags: ${problem}`);
console.log(
  `generate-tags: ${tagList.length} tags (${tagList.length - unregistered} registered) across ${items.length} items` +
    ` ${previous === output ? '(unchanged)' : `-> ${OUT}`} in ${(performance.now() - started).toFixed(0)}ms`,
);
