import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import {
  LedgerFolio,
  LedgerLeader,
  LedgerNotice,
  LedgerRule,
} from '../../components/ledger';
import '../../styles/Ledger.css';

const formatEntryDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '—';
  return dt
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();
};

/**
 * Series view for the Ledger theme — a bound volume pulled from the field
 * notes register. The contents page lists every part as an entry line:
 * part number, name, dotted leader, date. Read in order; the binding
 * (seriesIndex) decides the order, not recency.
 */
const LedgerSeriesPage = () => {
  const { seriesSlug } = useParams();
  const [seriesPosts, setSeriesPosts] = useState([]);
  const [seriesTitle, setSeriesTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { processedPosts } = await fetchAllBlogPosts();
        const filtered = processedPosts
          .filter((p) => p.series && p.series.slug === seriesSlug)
          .sort((a, b) => (a.seriesIndex || 0) - (b.seriesIndex || 0));
        if (cancelled) return;
        setSeriesPosts(filtered);
        setSeriesTitle(filtered.length > 0 ? filtered[0].series.title : '');
      } catch (e) {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [seriesSlug]);

  const description =
    seriesPosts.length > 0 ? seriesPosts[0].series.description : null;
  const firstFiled =
    seriesPosts.length > 0 ? seriesPosts[0].date : null;
  const lastAmended = seriesPosts.reduce((latest, p) => {
    const d = new Date(p.updated || p.date);
    return !latest || d > latest ? d : latest;
  }, null);

  return (
    <div className="ldg-root">
      <div className="ldg-page">
        <Seo
          title={`${seriesTitle || 'Series'} | Fezcodex Series`}
          description={`A bound volume of ${seriesPosts.length} parts from the field notes register.`}
        />

        <Link
          to="/blog"
          className="ldg-label inline-block mb-4 no-underline font-bold hover:text-[var(--ldg-accent)]"
        >
          [← FIELD NOTES]
        </Link>

        {loading && <LedgerNotice>UNBINDING THE VOLUME…</LedgerNotice>}
        {error && (
          <LedgerNotice error>COULD NOT READ THE REGISTER</LedgerNotice>
        )}
        {!loading && !error && seriesPosts.length === 0 && (
          <LedgerNotice error>
            NO VOLUME FILED UNDER /{seriesSlug}
          </LedgerNotice>
        )}

        {!loading && !error && seriesPosts.length > 0 && (
          <>
            <LedgerFolio
              folio={`BOUND VOLUME · ${String(seriesPosts.length).padStart(2, '0')} PARTS`}
              title={seriesTitle}
              sub={description ? description.toUpperCase() : undefined}
            >
              <div
                className="mt-4 flex flex-col gap-2"
                style={{ maxWidth: '46ch', fontSize: '0.8rem' }}
              >
                <LedgerLeader
                  label="PARTS"
                  value={String(seriesPosts.length).padStart(2, '0')}
                />
                <LedgerLeader
                  label="FIRST FILED"
                  value={formatEntryDate(firstFiled)}
                />
                <LedgerLeader
                  label="LAST AMENDED"
                  value={formatEntryDate(lastAmended)}
                />
              </div>
            </LedgerFolio>

            <LedgerRule label="CONTENTS" className="mb-3" />
            <ol className="list-none m-0 p-0 flex flex-col gap-[2px]">
              {seriesPosts.map((post, i) => {
                const idx = post.seriesIndex ?? i + 1;
                return (
                  <li key={post.slug}>
                    <Link
                      to={`/blog/series/${seriesSlug}/${post.slug}`}
                      className="ldg-row-link"
                    >
                      <span className="ldg-rank">
                        {String(idx).padStart(2, '0')}
                      </span>
                      <span
                        className="font-bold truncate"
                        style={{ minWidth: 0, flexShrink: 1 }}
                      >
                        {post.title}
                      </span>
                      <span className="ldg-leader" aria-hidden="true" />
                      <span
                        className="ldg-accent hidden sm:inline"
                        style={{ fontSize: '0.72rem', fontWeight: 700 }}
                      >
                        {(post.category || 'PART').toUpperCase()}
                      </span>
                      <span
                        className="ldg-muted"
                        style={{
                          fontSize: '0.76rem',
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatEntryDate(post.updated || post.date)}
                      </span>
                      <span className="font-bold" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>

            <nav
              className="flex justify-between gap-4 mt-10 pt-4"
              style={{ borderTop: '1px solid var(--ldg-rule)' }}
              aria-label="Register navigation"
            >
              <Link
                to="/blog"
                className="ldg-label no-underline font-bold hover:text-[var(--ldg-accent)]"
              >
                ← BACK TO THE REGISTER
              </Link>
              <span className="ldg-label">END OF CONTENTS</span>
            </nav>
          </>
        )}
      </div>
    </div>
  );
};

export default LedgerSeriesPage;
