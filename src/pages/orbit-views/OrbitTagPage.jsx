import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { OrbitNotice, OrbitRule } from '../../components/orbit';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';
import '../../styles/Orbit.css';
import './orbit-tags.css';

const pad = (n, width = 3) => String(n).padStart(width, '0');

const Shell = ({ children }) => (
  <div className="orb-root">
    <div className="orb-page">{children}</div>
  </div>
);

const BackLink = () => (
  <Link
    to="/tags"
    className="orb-label inline-block mb-6 no-underline font-bold hover:text-[var(--orb-accent)]"
  >
    [← ALL TAGS]
  </Link>
);

/** ORBIT /tags/:tag: everything filed under one tag, narrowed further. */
export default function OrbitTagPage({ view }) {
  if (view.status === 'error')
    return (
      <Shell>
        <OrbitNotice error>{view.error}</OrbitNotice>
      </Shell>
    );
  if (view.status === 'loading')
    return (
      <Shell>
        <OrbitNotice>Retrieving the tag…</OrbitNotice>
      </Shell>
    );
  if (view.status === 'missing')
    return (
      <Shell>
        <Seo title="Tag not found | Fezcodex" />
        <BackLink />
        <OrbitNotice error>
          404 — Nothing is filed under “{view.rawTag}”.
        </OrbitNotice>
        <div className="mt-4 text-center">
          <Link to="/tags" className="orb-btn no-underline">
            Browse all tags →
          </Link>
        </div>
      </Shell>
    );

  const { meta } = view;
  return (
    <div className="orb-root">
      <Seo
        title={`${view.title} | Tags | Fezcodex`}
        description={
          meta.description ||
          `Posts, logs and projects tagged ${meta.label} on Fezcodex.`
        }
        canonicalPath={tagPath(view.slug)}
      />
      <div className="orb-page">
        <BackLink />

        <header className="mb-6">
          <p className="orb-eyebrow mb-4">FEZCODEX / TAGGED</p>
          <h1 className="orb-title">{meta.label}</h1>
          {meta.description && <p className="orb-intro">{meta.description}</p>}
          <p className="orb-stats mt-4">
            {TAG_TYPES.filter((t) => meta[t.plural] > 0).map((t) => (
              <span
                key={t.key}
                className={`inline-flex items-center gap-2 orb-tg-type-${t.key}`}
              >
                <span className="orb-tg-pip" aria-hidden="true" />
                <span>
                  <strong>{pad(meta[t.plural])}</strong>{' '}
                  {(meta[t.plural] === 1 ? t.one : t.plural).toUpperCase()}
                </span>
              </span>
            ))}
          </p>
          <hr className="orb-rule mt-4" />
        </header>

        {view.extra.length > 0 && (
          <div
            className="flex flex-wrap items-center gap-1.5 mb-6"
            aria-label="Active tag filters"
          >
            <span className="orb-label mr-1">FILTERED BY</span>
            {view.active.map((tag) => (
              <span key={tag} className="orb-chip is-active orb-tg-active">
                <span style={{ overflowWrap: 'anywhere' }}>
                  {view.labelOf(tag)}
                </span>
                <Link
                  to={view.removeHref(tag)}
                  className="orb-tg-remove"
                  aria-label={`Remove ${view.labelOf(tag)}`}
                >
                  ×
                </Link>
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="min-w-0" aria-label="Tagged items">
            <div
              className="flex flex-wrap items-center gap-1.5 mb-5"
              role="group"
              aria-label="Content type"
            >
              {view.types.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={`orb-chip orb-tg-type-${t.key}`}
                  aria-pressed={view.type === t.key}
                  disabled={t.key !== 'all' && view.typeCounts[t.key] === 0}
                  onClick={() => view.setType(t.key)}
                >
                  {t.key !== 'all' && (
                    <span className="orb-tg-pip" aria-hidden="true" />
                  )}
                  {t.label}
                  <span className="orb-tg-count">{view.typeCounts[t.key]}</span>
                </button>
              ))}
            </div>

            {view.items.length === 0 ? (
              <OrbitNotice>Nothing here carries all of these tags.</OrbitNotice>
            ) : (
              <>
                <OrbitRule
                  label={`ON RECORD · ${pad(view.items.length)}`}
                  className="mb-1"
                />
                <ol className="list-none m-0 p-0">
                  {view.items.map((item, index) => (
                    <li
                      key={item.id}
                      className={`py-5 orb-tg-type-${item.type}`}
                      style={{
                        borderTop:
                          index === 0 ? 'none' : '1px solid var(--orb-rule)',
                      }}
                    >
                      <p className="orb-label m-0 mb-2 flex flex-wrap items-center gap-x-2">
                        <span className="orb-tg-pip" aria-hidden="true" />
                        <span className="orb-tg-ink font-medium">
                          {typeByKey[item.type].one}
                        </span>
                        {item.category && <span>· {item.category}</span>}
                        {item.date && (
                          <>
                            <span aria-hidden="true">·</span>
                            <time dateTime={item.date}>
                              {formatDate(item.date)}
                            </time>
                          </>
                        )}
                      </p>
                      <h2 className="m-0 text-xl md:text-2xl font-medium tracking-tight leading-snug">
                        <Link to={item.path} className="orb-tg-title">
                          {item.title}
                        </Link>
                      </h2>
                      {item.series && (
                        <p className="orb-label m-0 mt-1">
                          Part of {item.series}
                        </p>
                      )}
                      {item.description && (
                        <p className="orb-muted m-0 mt-2 max-w-3xl text-base">
                          {item.description}
                        </p>
                      )}
                      {item.tags.length > 0 && (
                        <ul
                          className="list-none m-0 p-0 mt-3 flex flex-wrap gap-1.5"
                          aria-label="Tags"
                        >
                          {item.tags.map((tag) => (
                            <li key={tag} className="min-w-0">
                              <Link
                                to={tagPath(tag)}
                                className="orb-tg-itemtag"
                                data-active={
                                  view.active.includes(tag) || undefined
                                }
                              >
                                #{view.labelOf(tag)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </section>

          {view.related.length > 0 && (
            <aside className="min-w-0" aria-label="Narrow by another tag">
              <OrbitRule label="NARROW BY" className="mb-3" />
              <h2 className="sr-only">Narrow by</h2>
              <p className="orb-muted text-sm mt-0 mb-4">
                Tags that appear alongside {view.title}. Each one narrows the
                list.
              </p>
              <ul className="list-none m-0 p-0 flex flex-wrap gap-1.5">
                {view.related.map(([tag, count]) => (
                  <li key={tag} className="min-w-0">
                    <Link
                      to={view.addHref(tag)}
                      className="orb-chip orb-tg-tag max-w-full"
                      data-size={0}
                    >
                      <span style={{ overflowWrap: 'anywhere' }}>
                        + {view.labelOf(tag)}
                      </span>
                      <span className="orb-tg-count">{count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
