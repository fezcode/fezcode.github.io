import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import {
  OrbitFolio,
  OrbitLeader,
  OrbitNotice,
  OrbitRule,
} from '../../components/orbit';
import '../../styles/Orbit.css';

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

const OrbitSeriesPage = () => {
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
    <div className="orb-root">
      <div className="orb-page">
        <Seo
          title={`${seriesTitle || 'Series'} | Fezcodex Series`}
          description={`A bound volume of ${seriesPosts.length} parts from the field notes register.`}
        />

        <Link
          to="/blog"
          className="orb-label inline-block mb-4 no-underline font-bold hover:text-[var(--orb-accent)]"
        >
          [← WRITING]
        </Link>

        {loading && <OrbitNotice>Opening the series…</OrbitNotice>}
        {error && (
          <OrbitNotice error>COULD NOT READ THE COLLECTION</OrbitNotice>
        )}
        {!loading && !error && seriesPosts.length === 0 && (
          <OrbitNotice error>No series found at /{seriesSlug}</OrbitNotice>
        )}

        {!loading && !error && seriesPosts.length > 0 && (
          <>
            <OrbitFolio
              folio={`BOUND VOLUME · ${String(seriesPosts.length).padStart(2, '0')} PARTS`}
              title={seriesTitle}
              sub={description ? description.toUpperCase() : undefined}
            >
              <div
                className="mt-4 flex flex-col gap-2"
                style={{ maxWidth: '46ch', fontSize: '0.8rem' }}
              >
                <OrbitLeader
                  label="PARTS"
                  value={String(seriesPosts.length).padStart(2, '0')}
                />
                <OrbitLeader
                  label="FIRST SAVED"
                  value={formatEntryDate(firstFiled)}
                />
                <OrbitLeader
                  label="LAST AMENDED"
                  value={formatEntryDate(lastAmended)}
                />
              </div>
            </OrbitFolio>

            <OrbitRule label="CONTENTS" className="mb-3" />
            <ol className="list-none m-0 p-0 flex flex-col gap-[2px]">
              {seriesPosts.map((post, i) => {
                const idx = post.seriesIndex ?? i + 1;
                return (
                  <li key={post.slug}>
                    <Link
                      to={`/blog/series/${seriesSlug}/${post.slug}`}
                      className="orb-row-link"
                    >
                      <span className="orb-rank">
                        {String(idx).padStart(2, '0')}
                      </span>
                      <span
                        className="font-bold truncate"
                        style={{ minWidth: 0, flexShrink: 1 }}
                      >
                        {post.title}
                      </span>
                      <span className="orb-leader" aria-hidden="true" />
                      <span
                        className="orb-accent hidden sm:inline"
                        style={{ fontSize: '0.72rem', fontWeight: 700 }}
                      >
                        {(post.category || 'PART').toUpperCase()}
                      </span>
                      <span
                        className="orb-muted"
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
              style={{ borderTop: '1px solid var(--orb-rule)' }}
              aria-label="Register navigation"
            >
              <Link
                to="/blog"
                className="orb-label no-underline font-bold hover:text-[var(--orb-accent)]"
              >
                ← BACK TO THE COLLECTION
              </Link>
              <span className="orb-label">END OF CONTENTS</span>
            </nav>
          </>
        )}
      </div>
    </div>
  );
};

export default OrbitSeriesPage;
