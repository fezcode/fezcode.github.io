import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import {
  StudioFolio,
  StudioLeader,
  StudioNotice,
  StudioRule,
} from '../../components/studio';
import '../../styles/Studio.css';

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

const StudioSeriesPage = () => {
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
  const firstFiled = seriesPosts.length > 0 ? seriesPosts[0].date : null;
  const lastAmended = seriesPosts.reduce((latest, p) => {
    const d = new Date(p.updated || p.date);
    return !latest || d > latest ? d : latest;
  }, null);

  return (
    <div className="std-root">
      <div className="std-page">
        <Seo
          title={`${seriesTitle || 'Series'} | Fezcodex Series`}
          description={`A bound volume of ${seriesPosts.length} parts from the field notes register.`}
        />

        <Link
          to="/blog"
          className="std-label inline-block mb-4 no-underline font-bold hover:text-[var(--std-accent)]"
        >
          [← WRITING]
        </Link>

        {loading && <StudioNotice>Opening the series…</StudioNotice>}
        {error && (
          <StudioNotice error>Could not read the collection</StudioNotice>
        )}
        {!loading && !error && seriesPosts.length === 0 && (
          <StudioNotice error>No series found at /{seriesSlug}</StudioNotice>
        )}

        {!loading && !error && seriesPosts.length > 0 && (
          <>
            <StudioFolio
              folio={`BOUND VOLUME · ${String(seriesPosts.length).padStart(2, '0')} PARTS`}
              title={seriesTitle}
              sub={description ? description.toUpperCase() : undefined}
            >
              <div
                className="mt-4 flex flex-col gap-2"
                style={{ maxWidth: '46ch', fontSize: '0.8rem' }}
              >
                <StudioLeader
                  label="PARTS"
                  value={String(seriesPosts.length).padStart(2, '0')}
                />
                <StudioLeader
                  label="FIRST SAVED"
                  value={formatEntryDate(firstFiled)}
                />
                <StudioLeader
                  label="LAST AMENDED"
                  value={formatEntryDate(lastAmended)}
                />
              </div>
            </StudioFolio>

            <StudioRule label="CONTENTS" className="mb-3" />
            <ol className="list-none m-0 p-0 flex flex-col gap-[2px]">
              {seriesPosts.map((post, i) => {
                const idx = post.seriesIndex ?? i + 1;
                return (
                  <li key={post.slug}>
                    <Link
                      to={`/blog/series/${seriesSlug}/${post.slug}`}
                      className="std-row-link"
                    >
                      <span className="std-rank">
                        {String(idx).padStart(2, '0')}
                      </span>
                      <span
                        className="font-bold truncate"
                        style={{ minWidth: 0, flexShrink: 1 }}
                      >
                        {post.title}
                      </span>
                      <span className="std-leader" aria-hidden="true" />
                      <span
                        className="std-accent hidden sm:inline"
                        style={{ fontSize: '0.72rem', fontWeight: 700 }}
                      >
                        {(post.category || 'PART').toUpperCase()}
                      </span>
                      <span
                        className="std-muted"
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
              style={{ borderTop: '1px solid var(--std-rule)' }}
              aria-label="Register navigation"
            >
              <Link
                to="/blog"
                className="std-label no-underline font-bold hover:text-[var(--std-accent)]"
              >
                ← BACK TO THE COLLECTION
              </Link>
              <span className="std-label">End of contents</span>
            </nav>
          </>
        )}
      </div>
    </div>
  );
};

export default StudioSeriesPage;
