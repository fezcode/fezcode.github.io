import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { loadTagIndex, tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey } from './tagTypes';

// State and URL handling for /tags and /tags/:tag. Every theme renders the
// same data with its own look, so the themed views stay presentational: they
// receive one `view` object from these hooks and never touch the index.

const RELATED_LIMIT = 30;

const splitWith = (value) =>
  (value || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

function useIndex() {
  const [index, setIndex] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let live = true;
    loadTagIndex()
      .then((data) => live && setIndex(data))
      .catch((e) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, []);
  return { index, error };
}

/**
 * /tags: every tag, searchable, filtered by content type, sorted by use or A–Z.
 *
 * view: { status: 'loading'|'error'|'ready', error, totalTags, totalItems,
 *   query, setQuery, type, setType, sort, setSort, types,
 *   shared: tags used 2+ times (or all matches while searching),
 *   single: tags used once, hrefFor(tag), sizeFor(count) -> 1..4 }
 * A tag: { slug, label, count, shown (count within the selected type),
 *   posts, logs, projects, description }
 */
export function useTagsIndexView() {
  const { index, error } = useIndex();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const type = typeByKey[params.get('type')] ? params.get('type') : 'all';
  const sort = params.get('sort') === 'az' ? 'az' : 'count';

  const setParam = (key, value, fallback) => {
    const next = new URLSearchParams(params);
    if (value === fallback) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const visible = useMemo(() => {
    if (!index) return [];
    const words = query.trim().toLowerCase();
    const plural = typeByKey[type]?.plural;
    return index.tags
      .map((tag) => ({ ...tag, shown: plural ? tag[plural] : tag.count }))
      .filter(
        (tag) =>
          tag.shown > 0 &&
          (!words ||
            tag.slug.includes(words) ||
            tag.label.toLowerCase().includes(words)),
      )
      .sort((a, b) =>
        sort === 'az'
          ? a.label.localeCompare(b.label)
          : b.shown - a.shown || a.label.localeCompare(b.label),
      );
  }, [index, query, type, sort]);

  return {
    status: error ? 'error' : index ? 'ready' : 'loading',
    error,
    totalTags: index?.tags.length || 0,
    totalItems: index?.items.length || 0,
    query,
    setQuery,
    type,
    setType: (next) => setParam('type', next, 'all'),
    sort,
    setSort: (next) => setParam('sort', next, 'count'),
    types: [{ key: 'all', label: 'All' }, ...TAG_TYPES],
    // One-off tags are most of the list; keep them aside unless searching.
    shared: query ? visible : visible.filter((tag) => tag.shown > 1),
    single: query ? [] : visible.filter((tag) => tag.shown === 1),
    hrefFor: (tag) =>
      type === 'all' ? tagPath(tag.slug) : `${tagPath(tag.slug)}?type=${type}`,
    sizeFor: (count) =>
      count >= 20 ? 4 : count >= 10 ? 3 : count >= 5 ? 2 : 1,
  };
}

/**
 * /tags/:tag?with=a,b&type=log: everything under one tag, narrowed by more
 * tags and by content type.
 *
 * view: { status: 'loading'|'error'|'missing'|'redirect'|'ready', error,
 *   rawTag, redirectTo, slug, meta (the tag), title ("Action + Crime"),
 *   active (all active slugs), extra (the ?with= slugs), labelOf(slug),
 *   type, setType, types, typeCounts {all, post, log, project},
 *   items (shown items), related [[slug, count]],
 *   hrefFor(slugs[]) -> URL for that tag set, removeHref(slug), addHref(slug) }
 * An item: { id, type, title, path, date, category?, series?, description, tags }
 */
export function useTagView() {
  const { tag: rawTag = '' } = useParams();
  const { index, error } = useIndex();
  const [params, setParams] = useSearchParams();

  const slug = index ? index.resolve(rawTag) : '';
  const withParam = params.get('with');
  const extra = useMemo(
    () =>
      index
        ? [...new Set(splitWith(withParam).map(index.resolve))].filter(
            (s) => s && s !== slug,
          )
        : [],
    [index, withParam, slug],
  );
  const active = useMemo(() => (slug ? [slug, ...extra] : []), [slug, extra]);
  const type = typeByKey[params.get('type')] ? params.get('type') : 'all';

  const matching = useMemo(() => {
    if (!index || !slug) return [];
    return (index.itemsByTag.get(slug) || []).filter((item) =>
      extra.every((tag) => item.tags.includes(tag)),
    );
  }, [index, slug, extra]);
  const items = useMemo(
    () =>
      type === 'all' ? matching : matching.filter((item) => item.type === type),
    [matching, type],
  );
  const related = useMemo(() => {
    const counts = new Map();
    for (const item of items) {
      for (const tag of item.tags) {
        if (!active.includes(tag)) counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return [...counts]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, RELATED_LIMIT);
  }, [items, active]);

  const hrefFor = (tags, nextType = type) => {
    const [first, ...rest] = tags;
    const query = new URLSearchParams();
    if (rest.length) query.set('with', rest.join(','));
    if (nextType !== 'all') query.set('type', nextType);
    const search = query.toString();
    return first ? `${tagPath(first)}${search ? `?${search}` : ''}` : '/tags';
  };
  const labelOf = (s) => index?.bySlug.get(s)?.label || s;
  const search = params.toString();

  let status = 'ready';
  if (error) status = 'error';
  else if (!index) status = 'loading';
  else if (!slug) status = 'missing';
  // An alias or a different spelling lands on the canonical URL.
  else if (slug !== rawTag) status = 'redirect';

  return {
    status,
    error,
    rawTag,
    redirectTo: `${tagPath(slug)}${search ? `?${search}` : ''}`,
    slug,
    meta: index?.bySlug.get(slug) || null,
    title: active.map(labelOf).join(' + '),
    active,
    extra,
    labelOf,
    type,
    setType: (next) => {
      const query = new URLSearchParams(params);
      if (next === 'all') query.delete('type');
      else query.set('type', next);
      setParams(query, { replace: true });
    },
    types: [{ key: 'all', label: 'All' }, ...TAG_TYPES],
    typeCounts: {
      all: matching.length,
      ...Object.fromEntries(
        TAG_TYPES.map((t) => [
          t.key,
          matching.filter((item) => item.type === t.key).length,
        ]),
      ),
    },
    items,
    related,
    hrefFor,
    removeHref: (tag) => hrefFor(active.filter((t) => t !== tag)),
    addHref: (tag) => hrefFor([...active, tag]),
  };
}
