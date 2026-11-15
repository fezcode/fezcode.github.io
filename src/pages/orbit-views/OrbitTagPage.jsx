import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { OrbitNotice, OrbitRule } from '../../components/orbit';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';
import '../../styles/Orbit.css';
import './orbit-tags.css';

const pad = (n, width = 3) => String(n).padStart(width, '0');

const timeOf = (value) => {
  const time = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(time) ? -Infinity : time;
};
const yearOf = (value) => {
  const time = timeOf(value);
  return time === -Infinity ? null : new Date(time).getFullYear();
};

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
    [← STAR ATLAS]
  </Link>
);

/** ORBIT /tags/:tag: an observation log for one object in the atlas. */
export default function OrbitTagPage({ view }) {
  const items = view.items;

  // Newest observation first; undated entries settle at the end.
  const observations = useMemo(
    () =>
      [...items].sort((a, b) => {
        const diff = timeOf(b.date) - timeOf(a.date);
        return Number.isNaN(diff) ? 0 : diff;
      }),
    [items],
  );

  // One column per year from first to last sighting, stacked by type.
  const timeline = useMemo(() => {
    const byYear = new Map();
    let undated = 0;
    for (const item of items) {
      const year = yearOf(item.date);
      if (year === null) {
        undated += 1;
        continue;
      }
      const row = byYear.get(year) || { year, total: 0 };
      row.total += 1;
      row[item.type] = (row[item.type] || 0) + 1;
      byYear.set(year, row);
    }
    if (!byYear.size) return { years: [], max: 0, peak: null, undated };
    const known = [...byYear.keys()];
    const years = [];
    for (let y = Math.min(...known); y <= Math.max(...known); y += 1) {
      years.push(byYear.get(y) || { year: y, total: 0 });
    }
    const peak = years.reduce((best, row) =>
      row.total > best.total ? row : best,
    );
    return { years, max: peak.total, peak, undated };
  }, [items]);

  if (view.status === 'error')
    return (
      <Shell>
        <OrbitNotice error>{view.error}</OrbitNotice>
      </Shell>
    );
  if (view.status === 'loading')
    return (
      <Shell>
        <OrbitNotice>Pointing the telescope…</OrbitNotice>
      </Shell>
    );
  if (view.status === 'missing')
    return (
      <Shell>
        <Seo title="Tag not found | Fezcodex" />
        <BackLink />
        <OrbitNotice error>
          404 — No object “{view.rawTag}” in the atlas. Nothing is filed under
          it.
        </OrbitNotice>
        <div className="mt-4 text-center">
          <Link to="/tags" className="orb-btn no-underline">
            Browse all tags →
          </Link>
        </div>
      </Shell>
    );

  const { meta } = view;
  const { years, max, peak, undated } = timeline;

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

        {/* log entry header */}
        <header className="mb-6">
          <p className="orb-eyebrow mb-4">OBSERVATION LOG / FEZCODEX</p>
          <h1 className="orb-title">
            <span className="orb-tg-logkey">OBJECT:</span> {meta.label}{' '}
            <span className="orb-tg-logkey">
              · {meta.count} {meta.count === 1 ? 'OBSERVATION' : 'OBSERVATIONS'}
            </span>
          </h1>
          {meta.description && (
            <p className="orb-intro">
              <span className="orb-label">NOTES — </span>
              {meta.description}
            </p>
          )}
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
            {view.active.map((tag, index) => (
              <React.Fragment key={tag}>
                {index === 0 && <span className="orb-label mr-1">OBJECT</span>}
                {index === 1 && (
                  <span className="orb-label mx-1">CONJUNCTION WITH:</span>
                )}
                <span className="orb-chip is-active orb-tg-active">
                  <span style={{ overflowWrap: 'anywhere' }}>
                    {view.labelOf(tag).toUpperCase()}
                  </span>
                  <Link
                    to={view.removeHref(tag)}
                    className="orb-tg-remove"
                    aria-label={`Remove ${view.labelOf(tag)}`}
                  >
                    ×
                  </Link>
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        <div
          className="flex flex-wrap items-center gap-1.5 mb-8"
          role="group"
          aria-label="Content type"
        >
          <span className="orb-label mr-1">SPECTRUM</span>
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

        {/* time axis: sightings per year */}
        {years.length > 0 && (
          <section className="mb-10" aria-label="Observations per year">
            <OrbitRule label="TIME AXIS" className="mb-4" />
            <div className="overflow-x-auto pb-1">
              <ol className="orb-tg-axis list-none m-0 p-0 flex items-end">
                {years.map((row) => (
                  <li
                    key={row.year}
                    className="flex-1 min-w-[26px] flex flex-col items-center"
                  >
                    <span className="sr-only">
                      {row.year}: {row.total}{' '}
                      {row.total === 1 ? 'observation' : 'observations'}
                    </span>
                    <span className="orb-tg-axis-count" aria-hidden="true">
                      {row.total || '·'}
                    </span>
                    <span className="orb-tg-axis-well" aria-hidden="true">
                      {row.total > 0 && (
                        <span
                          className="orb-tg-axis-bar"
                          style={{ height: `${(row.total / max) * 100}%` }}
                        >
                          {TAG_TYPES.filter((t) => row[t.key] > 0).map((t) => (
                            <span
                              key={t.key}
                              className={`orb-tg-axis-seg orb-tg-type-${t.key}`}
                              style={{ flexGrow: row[t.key] }}
                            />
                          ))}
                        </span>
                      )}
                    </span>
                    <span className="orb-tg-axis-tick" aria-hidden="true" />
                    <span className="orb-tg-axis-year" aria-hidden="true">
                      <span className="sm:hidden">
                        ’{String(row.year).slice(-2)}
                      </span>
                      <span className="hidden sm:inline">{row.year}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="orb-label m-0 mt-3">
              FIRST SEEN {years[0].year} · LAST SEEN{' '}
              {years[years.length - 1].year} · PEAK {peak.total} IN {peak.year}
              {undated > 0 && ` · ${undated} UNDATED`}
            </p>
          </section>
        )}

        {view.related.length > 0 && (
          <section className="mb-10" aria-label="Narrow by another tag">
            <OrbitRule label="NEARBY OBJECTS" className="mb-3" />
            <h2 className="sr-only">Narrow by</h2>
            <p className="orb-muted text-sm mt-0 mb-4">
              Tags that appear alongside {view.title}. Each one narrows the log
              to a conjunction.
            </p>
            <ul className="list-none m-0 p-0 flex flex-wrap gap-1.5">
              {view.related.map(([tag, count]) => (
                <li key={tag} className="min-w-0 max-w-full">
                  <Link
                    to={view.addHref(tag)}
                    className="orb-chip orb-tg-near max-w-full"
                  >
                    <span style={{ overflowWrap: 'anywhere' }}>
                      + {view.labelOf(tag)}
                    </span>
                    <span className="orb-tg-count">{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-label="Tagged items">
          {observations.length === 0 ? (
            <OrbitNotice>No observations carry all of these tags.</OrbitNotice>
          ) : (
            <>
              <OrbitRule
                label={`OBSERVATIONS · ${pad(observations.length)}`}
                className="mb-1"
              />
              <ol className="list-none m-0 p-0">
                {observations.map((item, index) => (
                  <li
                    key={item.id}
                    className={`orb-tg-obs orb-tg-type-${item.type} grid grid-cols-1 gap-y-2 py-5 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-x-6`}
                    style={{
                      borderTop:
                        index === 0 ? 'none' : '1px solid var(--orb-rule)',
                    }}
                  >
                    <div className="orb-label flex flex-wrap items-baseline gap-x-3 sm:flex-col sm:gap-y-0.5">
                      {item.date ? (
                        <time className="orb-tg-stamp" dateTime={item.date}>
                          {formatDate(item.date)}
                        </time>
                      ) : (
                        <span className="orb-tg-stamp">UNDATED</span>
                      )}
                      <span>OBS {pad(observations.length - index)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="orb-label m-0 mb-1.5 flex flex-wrap items-center gap-x-2">
                        <span className="orb-tg-pip" aria-hidden="true" />
                        <span className="orb-tg-ink font-medium">
                          {typeByKey[item.type].one}
                        </span>
                        {item.category && <span>· {item.category}</span>}
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
                            <li key={tag} className="min-w-0 max-w-full">
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
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
