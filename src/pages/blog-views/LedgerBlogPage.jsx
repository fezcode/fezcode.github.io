import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import {
  LedgerFolio,
  LedgerNotice,
  LedgerRule,
} from '../../components/ledger';
import '../../styles/Ledger.css';

const FILTERS = [
  { id: 'all', label: 'ALL' },
  { id: 'dev', label: 'DEV' },
  { id: 'ai', label: 'AI' },
  { id: 'feat', label: 'FEAT' },
  { id: 'rant', label: 'RANT' },
  { id: 'essay', label: 'ESSAY' },
  { id: 'series', label: 'SERIES' },
  { id: 'gist', label: 'GIST' },
  { id: 'd&d', label: 'D&D' },
];

const formatEntryDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '—';
  return dt
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    })
    .toUpperCase();
};

/**
 * Blog index for the Ledger theme — the FIELD NOTES register. Every post is
 * an entry line: number, name, dotted leader, date. Series are bound volumes,
 * filed in the main register and cross-referenced in their own ruled section.
 */
const LedgerBlogPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { processedPosts } = await fetchAllBlogPosts();
        const seriesMap = new Map();
        const individual = [];
        processedPosts.forEach((post) => {
          if (post.series) {
            if (!seriesMap.has(post.series.slug)) {
              seriesMap.set(post.series.slug, {
                title: post.series.title,
                slug: post.series.slug,
                date: post.series.date || post.date,
                updated: post.series.updated || post.updated,
                isSeries: true,
                category: 'series',
                description: post.series.description || post.description,
                posts: [],
                tags: post.tags,
              });
            }
            seriesMap.get(post.series.slug).posts.push(post);
          } else {
            individual.push(post);
          }
        });
        const combined = [...Array.from(seriesMap.values()), ...individual];
        combined.sort(
          (a, b) =>
            new Date(b.updated || b.date) - new Date(a.updated || a.date),
        );
        if (!cancelled) setItems(combined);
      } catch (e) {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = items.filter((item) => {
    if (activeFilter !== 'all') {
      if (activeFilter === 'series' && !item.isSeries) return false;
      if (activeFilter !== 'series' && item.category !== activeFilter)
        return false;
    }
    if (query) {
      const q = query.toLowerCase();
      if (
        !item.title?.toLowerCase().includes(q) &&
        !item.description?.toLowerCase().includes(q) &&
        !item.slug?.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const series = items.filter((i) => i.isSeries);

  return (
    <div className="ldg-root">
      <div className="ldg-page">
        <Seo
          title="Field Notes | Fezcodex"
          description="The field notes register — every post dated, numbered, and filed. Entries are never erased, only superseded."
        />

        <LedgerFolio
          folio="FOLIO NO. 02 · FIELD NOTES"
          title="FIELD NOTES"
          sub="DATED · NUMBERED · NEVER ERASED"
        >
          {!loading && !error && (
            <p className="ldg-stats mt-3">
              <span>
                <strong>{String(items.length).padStart(2, '0')}</strong> ENTRIES
              </span>
              <span>
                <strong>{String(series.length).padStart(2, '0')}</strong> BOUND
                VOLUMES
              </span>
              <span>
                <strong>{String(filtered.length).padStart(2, '0')}</strong>{' '}
                SHOWN
              </span>
            </p>
          )}
        </LedgerFolio>

        {loading && <LedgerNotice>OPENING THE REGISTER…</LedgerNotice>}
        {error && (
          <LedgerNotice error>COULD NOT READ THE REGISTER</LedgerNotice>
        )}

        {!loading && !error && (
          <>
            {/* filters */}
            <div className="flex flex-col gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid var(--ldg-rule)' }}>
              <input
                className="ldg-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH THE REGISTER…"
                aria-label="Search entries"
              />
              <div className="flex flex-wrap gap-1.5">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="ldg-chip"
                    aria-pressed={activeFilter === f.id}
                    onClick={() => setActiveFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* the register */}
            <ol className="list-none m-0 p-0 flex flex-col gap-[2px]">
              {filtered.map((item, i) => (
                <li key={item.slug}>
                  <Link
                    to={
                      item.isSeries
                        ? `/blog/series/${item.slug}`
                        : `/blog/${item.slug}`
                    }
                    className="ldg-row-link"
                  >
                    <span className="ldg-rank">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="font-bold truncate"
                      style={{ minWidth: 0, flexShrink: 1 }}
                    >
                      {item.title}
                    </span>
                    <span className="ldg-leader" aria-hidden="true" />
                    <span
                      className="ldg-accent hidden sm:inline"
                      style={{ fontSize: '0.72rem', fontWeight: 700 }}
                    >
                      {item.isSeries
                        ? `VOL · ${String(item.posts.length).padStart(2, '0')}`
                        : (item.category || 'NOTE').toUpperCase()}
                    </span>
                    <span
                      className="ldg-muted"
                      style={{
                        fontSize: '0.76rem',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatEntryDate(item.updated || item.date)}
                    </span>
                    <span className="font-bold" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            {filtered.length === 0 && (
              <LedgerNotice>
                NO ENTRY UNDER THAT NAME —{' '}
                <button
                  type="button"
                  className="ldg-btn ldg-btn-accent"
                  onClick={() => {
                    setQuery('');
                    setActiveFilter('all');
                  }}
                >
                  CLEAR THE FILTERS
                </button>
              </LedgerNotice>
            )}

            {/* bound volumes cross-reference */}
            {series.length > 0 && (
              <section className="mt-10">
                <LedgerRule label="BOUND VOLUMES" className="mb-3" />
                <p className="ldg-label mb-3">
                  SEQUENCES FILED AS ONE ENTRY, READ IN ORDER.
                </p>
                <ul className="list-none m-0 p-0 flex flex-col gap-2">
                  {series.map((vol) => (
                    <li key={vol.slug} className="ldg-card">
                      <Link
                        className="ldg-card-link"
                        to={`/blog/series/${vol.slug}`}
                      >
                        <span className="flex items-baseline gap-3 flex-wrap">
                          <span
                            className="font-bold uppercase"
                            style={{ letterSpacing: '1px' }}
                          >
                            {vol.title}
                          </span>
                          <span className="ldg-leader" aria-hidden="true" />
                          <span
                            className="ldg-accent font-bold"
                            style={{ fontSize: '0.74rem' }}
                          >
                            {String(vol.posts.length).padStart(2, '0')} PARTS →
                          </span>
                        </span>
                        {vol.description && (
                          <span
                            className="ldg-muted block mt-1"
                            style={{ fontSize: '0.8rem' }}
                          >
                            {vol.description}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LedgerBlogPage;
