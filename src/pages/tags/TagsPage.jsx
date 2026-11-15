import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { loadTagIndex, tagPath } from '../../utils/tagIndex';
import { TAG_TYPES } from './tagTypes';
import './tags.css';

// Chip sizes step with use, so the common tags read first.
const sizeFor = (count) =>
  count >= 20 ? 4 : count >= 10 ? 3 : count >= 5 ? 2 : 1;

export default function TagsPage() {
  const [index, setIndex] = useState(null);
  const [error, setError] = useState('');
  const [params, setParams] = useSearchParams();
  const type = TAG_TYPES.some((t) => t.key === params.get('type'))
    ? params.get('type')
    : 'all';
  const sort = params.get('sort') === 'az' ? 'az' : 'count';
  const [query, setQuery] = useState('');

  useEffect(() => {
    let live = true;
    loadTagIndex()
      .then((data) => live && setIndex(data))
      .catch((e) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, []);

  const setParam = (key, value, fallback) => {
    const next = new URLSearchParams(params);
    if (value === fallback) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const visible = useMemo(() => {
    if (!index) return [];
    const words = query.trim().toLowerCase();
    const plural = TAG_TYPES.find((t) => t.key === type)?.plural;
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

  // One-off tags are most of the list; keep them out of the way unless searched.
  const shared = query ? visible : visible.filter((tag) => tag.shown > 1);
  const single = query ? [] : visible.filter((tag) => tag.shown === 1);

  return (
    <div className="tg-root">
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />
      <main className="tg-page">
        <header className="tg-head">
          <span className="tg-eyebrow">Index</span>
          <h1 className="tg-title">Tags</h1>
          {index && (
            <p className="tg-lede">
              {index.tags.length} tags across {index.items.length} posts, logs
              and projects. Pick one to see everything filed under it.
            </p>
          )}
        </header>

        <div className="tg-controls">
          <label className="tg-search">
            <span className="sr-only">Search tags</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tags…"
            />
          </label>
          <div className="tg-segment" role="group" aria-label="Content type">
            {[{ key: 'all', label: 'All' }, ...TAG_TYPES].map((t) => (
              <button
                key={t.key}
                type="button"
                data-type={t.key}
                aria-pressed={type === t.key}
                onClick={() => setParam('type', t.key, 'all')}
              >
                {t.key !== 'all' && <i className="tg-dot" aria-hidden="true" />}
                {t.label}
              </button>
            ))}
          </div>
          <div className="tg-segment" role="group" aria-label="Sort tags">
            <button
              type="button"
              aria-pressed={sort === 'count'}
              onClick={() => setParam('sort', 'count', 'count')}
            >
              Most used
            </button>
            <button
              type="button"
              aria-pressed={sort === 'az'}
              onClick={() => setParam('sort', 'az', 'count')}
            >
              A–Z
            </button>
          </div>
        </div>

        {error && <p className="tg-empty">{error}</p>}
        {!index && !error && <p className="tg-empty">Loading tags…</p>}
        {index && visible.length === 0 && (
          <p className="tg-empty">No tags match “{query}”.</p>
        )}

        {shared.length > 0 && (
          <ul className="tg-cloud" aria-label="Tags">
            {shared.map((tag) => (
              <li key={tag.slug}>
                <Link
                  to={
                    type === 'all'
                      ? tagPath(tag.slug)
                      : `${tagPath(tag.slug)}?type=${type}`
                  }
                  className="tg-chip"
                  data-size={sizeFor(tag.shown)}
                >
                  {tag.label}
                  <span className="tg-chip-count">{tag.shown}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {single.length > 0 && (
          <details className="tg-longtail">
            <summary>Used once ({single.length})</summary>
            <ul className="tg-cloud tg-cloud-small">
              {single.map((tag) => (
                <li key={tag.slug}>
                  <Link
                    to={tagPath(tag.slug)}
                    className="tg-chip"
                    data-size={0}
                  >
                    {tag.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}
      </main>
    </div>
  );
}
