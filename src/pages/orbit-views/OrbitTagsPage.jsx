import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { OrbitFolio, OrbitNotice, OrbitRule } from '../../components/orbit';
import { tagPath } from '../../utils/tagIndex';
import '../../styles/Orbit.css';
import './orbit-tags.css';

const pad = (n, width = 3) => String(n).padStart(width, '0');

/** ORBIT /tags: the cross-reference index, as a field of chips. */
export default function OrbitTagsPage({ view }) {
  const ready = view.status === 'ready';
  const shownCount = view.shared.length + view.single.length;

  return (
    <div className="orb-root">
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />
      <div className="orb-page">
        <OrbitFolio
          folio="INDEX"
          title="Tags"
          sub="Every thread that runs through the posts, logs and projects. Pick one to see everything filed under it."
        >
          {ready && (
            <p className="orb-stats mt-4">
              <span>
                <strong>{pad(view.totalTags)}</strong> TAGS
              </span>
              <span>
                <strong>{pad(view.totalItems)}</strong> ENTRIES INDEXED
              </span>
              <span>
                <strong>{pad(shownCount)}</strong> SHOWN
              </span>
            </p>
          )}
        </OrbitFolio>

        {/* finding aid */}
        <div
          className="flex flex-col gap-3 mb-6 pb-4"
          style={{ borderBottom: '1px solid var(--orb-rule)' }}
        >
          <input
            type="search"
            className="orb-input"
            value={view.query}
            onChange={(event) => view.setQuery(event.target.value)}
            placeholder="Find a tag…"
            aria-label="Search tags"
          />
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Content type"
            >
              {view.types.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={`orb-chip orb-tg-type-${t.key}`}
                  aria-pressed={view.type === t.key}
                  onClick={() => view.setType(t.key)}
                >
                  {t.key !== 'all' && (
                    <span className="orb-tg-pip" aria-hidden="true" />
                  )}
                  {t.label}
                </button>
              ))}
            </div>
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Sort tags"
            >
              <span className="orb-label mr-1">SORT</span>
              <button
                type="button"
                className="orb-chip"
                aria-pressed={view.sort === 'count'}
                onClick={() => view.setSort('count')}
              >
                Most used
              </button>
              <button
                type="button"
                className="orb-chip"
                aria-pressed={view.sort === 'az'}
                onClick={() => view.setSort('az')}
              >
                A–Z
              </button>
            </div>
          </div>
        </div>

        {view.status === 'error' && (
          <OrbitNotice error>{view.error}</OrbitNotice>
        )}
        {view.status === 'loading' && (
          <OrbitNotice>Opening the index…</OrbitNotice>
        )}
        {ready && shownCount === 0 && (
          <OrbitNotice>
            No tags match “{view.query}”.{' '}
            <button
              type="button"
              className="orb-link"
              onClick={() => view.setQuery('')}
            >
              Clear the search
            </button>
          </OrbitNotice>
        )}

        {view.shared.length > 0 && (
          <section>
            <OrbitRule
              label={
                view.query
                  ? `MATCHES · ${pad(view.shared.length)}`
                  : `CROSS-REFERENCED · ${pad(view.shared.length)}`
              }
              className="mb-4"
            />
            <ul
              className="list-none m-0 p-0 flex flex-wrap items-center gap-2"
              aria-label="Tags"
            >
              {view.shared.map((tag) => (
                <li key={tag.slug} className="min-w-0">
                  <Link
                    to={view.hrefFor(tag)}
                    className="orb-chip orb-tg-tag max-w-full"
                    data-size={view.sizeFor(tag.shown)}
                    aria-label={`${tag.label}, ${tag.shown} ${
                      tag.shown === 1 ? 'entry' : 'entries'
                    }`}
                  >
                    <span
                      className="min-w-0"
                      style={{ overflowWrap: 'anywhere' }}
                    >
                      {tag.label}
                    </span>
                    <span className="orb-tg-count" aria-hidden="true">
                      {tag.shown}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {view.single.length > 0 && (
          <details className="mt-10">
            <summary className="orb-summary orb-label">
              <span className="orb-accent">
                Used once ({view.single.length})
              </span>
            </summary>
            <ul className="list-none m-0 p-0 mt-4 flex flex-wrap items-center gap-1.5">
              {view.single.map((tag) => (
                <li key={tag.slug} className="min-w-0">
                  <Link
                    to={tagPath(tag.slug)}
                    className="orb-chip orb-tg-tag max-w-full"
                    data-size={0}
                  >
                    <span
                      className="min-w-0"
                      style={{ overflowWrap: 'anywhere' }}
                    >
                      {tag.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}

        {ready && (
          <footer className="mt-12">
            <OrbitRule className="mb-4" />
            <span className="orb-label">
              INDEX · {pad(view.totalTags)} TAGS ON RECORD ·{' '}
              {view.sort === 'az' ? 'SORTED A→Z' : 'SORTED BY USE'}
            </span>
          </footer>
        )}
      </div>
    </div>
  );
}
