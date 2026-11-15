import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from './tagTypes';
import './tags.css';

const Shell = ({ children }) => (
  <div className="tg-root">
    <main className="tg-page">{children}</main>
  </div>
);

/** Theme-neutral /tags/:tag, used when a theme has no view of its own. */
export default function ClassicTagView({ view }) {
  if (view.status === 'error')
    return (
      <Shell>
        <p className="tg-empty">{view.error}</p>
      </Shell>
    );
  if (view.status === 'loading')
    return (
      <Shell>
        <p className="tg-empty">Loading…</p>
      </Shell>
    );
  if (view.status === 'missing')
    return (
      <Shell>
        <Seo title="Tag not found | Fezcodex" />
        <Link to="/tags" className="tg-crumb">
          ← All tags
        </Link>
        <h1 className="tg-title">No tag “{view.rawTag}”</h1>
        <p className="tg-lede">
          Nothing is filed under that tag.{' '}
          <Link to="/tags">Browse all tags</Link>.
        </p>
      </Shell>
    );

  const { meta } = view;
  return (
    <div className="tg-root">
      <Seo
        title={`${view.title} | Tags | Fezcodex`}
        description={
          meta.description ||
          `Posts, logs and projects tagged ${meta.label} on Fezcodex.`
        }
        canonicalPath={tagPath(view.slug)}
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

        {view.extra.length > 0 && (
          <div className="tg-active" aria-label="Active tag filters">
            <span className="tg-active-label">Filtered by</span>
            {view.active.map((tag) => (
              <span key={tag} className="tg-active-chip">
                {view.labelOf(tag)}
                <Link
                  to={view.removeHref(tag)}
                  aria-label={`Remove ${view.labelOf(tag)}`}
                >
                  ×
                </Link>
              </span>
            ))}
          </div>
        )}

        <div className="tg-layout">
          <section className="tg-results" aria-label="Tagged items">
            <div className="tg-segment" role="group" aria-label="Content type">
              {view.types.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  data-type={t.key}
                  aria-pressed={view.type === t.key}
                  disabled={t.key !== 'all' && view.typeCounts[t.key] === 0}
                  onClick={() => view.setType(t.key)}
                >
                  {t.key !== 'all' && (
                    <i className="tg-dot" aria-hidden="true" />
                  )}
                  {t.label}
                  <span className="tg-segment-count">
                    {view.typeCounts[t.key]}
                  </span>
                </button>
              ))}
            </div>

            {view.items.length === 0 ? (
              <p className="tg-empty">
                Nothing here carries all of these tags.
              </p>
            ) : (
              <ol className="tg-list">
                {view.items.map((item) => (
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
                            data-active={view.active.includes(tag) || undefined}
                          >
                            {view.labelOf(tag)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {view.related.length > 0 && (
            <aside className="tg-related" aria-label="Narrow by another tag">
              <h2>Narrow by</h2>
              <p>
                Tags that appear alongside {view.title}. Each one narrows the
                list.
              </p>
              <ul className="tg-cloud tg-cloud-small">
                {view.related.map(([tag, count]) => (
                  <li key={tag}>
                    <Link
                      to={view.addHref(tag)}
                      className="tg-chip"
                      data-size={0}
                    >
                      + {view.labelOf(tag)}
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
