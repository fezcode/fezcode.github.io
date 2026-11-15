import piml from 'piml';
import { normalizeTag } from './tagSlug.mjs';

// public/tags/index.piml is generated at build time (scripts/generate-tags-index.mjs).
// It is fetched once per session and shared by every consumer.
let pending = null;

const list = (value) =>
  Array.isArray(value)
    ? value
    : value === undefined || value === null
      ? []
      : [value];

export function parseTagIndex(source) {
  const data = piml.parse(source);
  const tags = list(data.tags).map((tag) => ({
    slug: tag.slug,
    label: tag.label || tag.slug,
    count: Number(tag.count) || 0,
    posts: Number(tag.posts) || 0,
    logs: Number(tag.logs) || 0,
    projects: Number(tag.projects) || 0,
    description: tag.description || '',
  }));
  const items = list(data.items).map((item) => ({
    ...item,
    tags: list(item.tags),
  }));
  const aliases = new Map(list(data.aliases).map((a) => [a.alias, a.tag]));
  const bySlug = new Map(tags.map((tag) => [tag.slug, tag]));
  const itemsByTag = new Map();
  for (const item of items) {
    for (const slug of item.tags) {
      if (!itemsByTag.has(slug)) itemsByTag.set(slug, []);
      itemsByTag.get(slug).push(item);
    }
  }
  /** Any spelling -> the canonical tag slug the index knows, or ''. */
  const resolve = (value) => {
    const slug = normalizeTag(value);
    const canonical = aliases.get(slug) || slug;
    return bySlug.has(canonical) ? canonical : '';
  };
  return { tags, items, aliases, bySlug, itemsByTag, resolve };
}

export function loadTagIndex() {
  if (!pending) {
    pending = fetch('/tags/index.piml')
      .then((response) => {
        if (!response.ok) throw new Error('The tag index could not be loaded.');
        return response.text();
      })
      .then(parseTagIndex)
      .catch((error) => {
        pending = null; // let a later visit retry
        throw error;
      });
  }
  return pending;
}

export const tagPath = (slug) => `/tags/${encodeURIComponent(slug)}`;
