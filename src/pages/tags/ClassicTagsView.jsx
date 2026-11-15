import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import './tags.css';

/** Theme-neutral /tags, used when a theme has no view of its own. */
export default function ClassicTagsView({ view }) {
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
          {view.status === 'ready' && (
            <p className="tg-lede">
              {view.totalTags} tags across {view.totalItems} posts, logs and
              projects. Pick one to see everything filed under it.
            </p>
          )}
        </header>

        <div className="tg-controls">
          <label className="tg-search">
            <span className="sr-only">Search tags</span>
            <input
              type="search"
              value={view.query}
              onChange={(event) => view.setQuery(event.target.value)}
              placeholder="Search tags…"
            />
          </label>
          <div className="tg-segment" role="group" aria-label="Content type">
            {view.types.map((t) => (
              <button
                key={t.key}
                type="button"
                data-type={t.key}
                aria-pressed={view.type === t.key}
                onClick={() => view.setType(t.key)}
              >
                {t.key !== 'all' && <i className="tg-dot" aria-hidden="true" />}
                {t.label}
              </button>
            ))}
          </div>
          <div className="tg-segment" role="group" aria-label="Sort tags">
            <button
              type="button"
              aria-pressed={view.sort === 'count'}
              onClick={() => view.setSort('count')}
            >
              Most used
            </button>
            <button
              type="button"
              aria-pressed={view.sort === 'az'}
              onClick={() => view.setSort('az')}
            >
              A–Z
            </button>
          </div>
        </div>

        {view.status === 'error' && <p className="tg-empty">{view.error}</p>}
        {view.status === 'loading' && <p className="tg-empty">Loading tags…</p>}
        {view.status === 'ready' &&
          view.shared.length + view.single.length === 0 && (
            <p className="tg-empty">No tags match “{view.query}”.</p>
          )}

        {view.shared.length > 0 && (
          <ul className="tg-cloud" aria-label="Tags">
            {view.shared.map((tag) => (
              <li key={tag.slug}>
                <Link
                  to={view.hrefFor(tag)}
                  className="tg-chip"
                  data-size={view.sizeFor(tag.shown)}
                >
                  {tag.label}
                  <span className="tg-chip-count">{tag.shown}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {view.single.length > 0 && (
          <details className="tg-longtail">
            <summary>Used once ({view.single.length})</summary>
            <ul className="tg-cloud tg-cloud-small">
              {view.single.map((tag) => (
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
