import React, { useEffect, useMemo, useState } from 'react';
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import Seo from '../../components/Seo';
import { loadTagIndex, tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from './tagTypes';
import './tags.css';

const RELATED_LIMIT = 30;

const splitWith = (value) =>
  (value || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

/** Everything under one tag, narrowed by type and by more tags (?with=a,b). */
export default function TagPage() {
  const { tag: rawTag } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
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

  const slug = index ? index.resolve(rawTag) : '';
  const extra = useMemo(
    () =>
      index
        ? [...new Set(splitWith(params.get('with')).map(index.resolve))].filter(
            (s) => s && s !== slug,
          )
        : [],
    [index, params, slug],
  );
  const active = useMemo(() => (slug ? [slug, ...extra] : []), [slug, extra]);
  const type = typeByKey[params.get('type')] ? params.get('type') : 'all';

  // Items carrying every active tag; type tabs count within this set.
  const matching = useMemo(() => {
    if (!index || !slug) return [];
    return (index.itemsByTag.get(slug) || []).filter((item) =>
      extra.every((tag) => item.tags.includes(tag)),
    );
  }, [index, slug, extra]);
  const shown = useMemo(
    () =>
      type === 'all' ? matching : matching.filter((item) => item.type === type),
    [matching, type],
  );
  const related = useMemo(() => {
    const counts = new Map();
    for (const item of shown) {
      for (const tag of item.tags) {
        if (!active.includes(tag)) counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return [...counts]
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, RELATED_LIMIT);
  }, [shown, active]);

  const hrefFor = (tags, nextType = type) => {
    const [first, ...rest] = tags;
    const query = new URLSearchParams();
    if (rest.length) query.set('with', rest.join(','));
    if (nextType !== 'all') query.set('type', nextType);
    const search = query.toString();
    return first ? `${tagPath(first)}${search ? `?${search}` : ''}` : '/tags';
  };
  const setType = (next) => {
    const query = new URLSearchParams(params);
    if (next === 'all') query.delete('type');
    else query.set('type', next);
    setParams(query, { replace: true });
  };

  if (error)
    return (
      <div className="tg-root">
        <main className="tg-page">
          <p className="tg-empty">{error}</p>
        </main>
      </div>
    );
  if (!index)
    return (
      <div className="tg-root">
        <main className="tg-page">
          <p className="tg-empty">Loading…</p>
        </main>
      </div>
    );
  if (!slug)
    return (
      <div className="tg-root">
        <Seo title="Tag not found | Fezcodex" />
        <main className="tg-page">
          <Link to="/tags" className="tg-crumb">
            ← All tags
          </Link>
          <h1 className="tg-title">No tag “{rawTag}”</h1>
          <p className="tg-lede">
            Nothing is filed under that tag.{' '}
            <Link to="/tags">Browse all tags</Link>.
          </p>
        </main>
      </div>
    );
  // An alias or a different spelling lands on the canonical URL.
  if (slug !== rawTag) {
    const search = params.toString();
    return (
      <Navigate to={`${tagPath(slug)}${search ? `?${search}` : ''}`} replace />
    );
  }

  const meta = index.bySlug.get(slug);
  const labelOf = (s) => index.bySlug.get(s)?.label || s;
  const typeCounts = Object.fromEntries(
    TAG_TYPES.map((t) => [
      t.key,
      matching.filter((item) => item.type === t.key).length,
    ]),
  );
  const title = active.map(labelOf).join(' + ');

  return (
    <div className="tg-root">
      <Seo
        title={`${title} | Tags | Fezcodex`}
        description={
          meta.description ||
          `Posts, logs and projects tagged ${meta.label} on Fezcodex.`
        }
        canonicalPath={tagPath(slug)}
      />
      <main className="tg-page">
        <Link to="/tags" className="tg-crumb">
          ← All tags
        </Link>
        <header className="tg-head">
          <span className="tg-eyebrow">Tagged</span>
          <h1 className="tg-title">{meta.label}</h1>
          {meta.description && <p className="tg-lede">{meta.description}</p>}
          <p className="tg-stats">
            {TAG_TYPES.filter((t) => meta[t.plural] > 0).map((t) => (
              <span key={t.key} data-type={t.key}>
                <i className="tg-dot" aria-hidden="true" />
                {meta[t.plural]}{' '}
                {meta[t.plural] === 1 ? t.one.toLowerCase() : t.plural}
              </span>
            ))}
          </p>
        </header>

        {extra.length > 0 && (
          <div className="tg-active" aria-label="Active tag filters">
            <span className="tg-active-label">Filtered by</span>
            {active.map((tag) => (
              <span key={tag} className="tg-active-chip">
                {labelOf(tag)}
                <button
                  type="button"
                  aria-label={`Remove ${labelOf(tag)}`}
                  onClick={() =>
                    navigate(hrefFor(active.filter((t) => t !== tag)))
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="tg-layout">
          <section className="tg-results" aria-label="Tagged items">
            <div className="tg-segment" role="group" aria-label="Content type">
              {[{ key: 'all', label: 'All' }, ...TAG_TYPES].map((t) => {
                const count =
                  t.key === 'all' ? matching.length : typeCounts[t.key];
                return (
                  <button
                    key={t.key}
                    type="button"
                    data-type={t.key}
                    aria-pressed={type === t.key}
                    disabled={t.key !== 'all' && count === 0}
                    onClick={() => setType(t.key)}
                  >
                    {t.key !== 'all' && (
                      <i className="tg-dot" aria-hidden="true" />
                    )}
                    {t.label}
                    <span className="tg-segment-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {shown.length === 0 ? (
              <p className="tg-empty">
                Nothing here carries all of these tags.
              </p>
            ) : (
              <ol className="tg-list">
                {shown.map((item) => (
                  <li key={item.id} className="tg-row" data-type={item.type}>
                    <div className="tg-row-meta">
                      <span className="tg-row-type">
                        {typeByKey[item.type].one}
                        {item.category && ` · ${item.category}`}
                      </span>
                      {item.date && (
                        <time dateTime={item.date}>
                          {formatDate(item.date)}
                        </time>
                      )}
                    </div>
                    <h2 className="tg-row-title">
                      <Link to={item.path}>{item.title}</Link>
                    </h2>
                    {item.series && (
                      <p className="tg-row-series">Part of {item.series}</p>
                    )}
                    {item.description && (
                      <p className="tg-row-desc">{item.description}</p>
                    )}
                    <ul className="tg-row-tags" aria-label="Tags">
                      {item.tags.map((tag) => (
                        <li key={tag}>
                          <Link
                            to={tagPath(tag)}
                            data-active={active.includes(tag) || undefined}
                          >
                            {labelOf(tag)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {related.length > 0 && (
            <aside className="tg-related" aria-label="Narrow by another tag">
              <h2>Narrow by</h2>
              <p>
                Tags that appear alongside {title}. Each one narrows the list.
              </p>
              <ul className="tg-cloud tg-cloud-small">
                {related.map(([tag, count]) => (
                  <li key={tag}>
                    <Link
                      to={hrefFor([...active, tag])}
                      className="tg-chip"
                      data-size={0}
                    >
                      + {labelOf(tag)}
                      <span className="tg-chip-count">{count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
