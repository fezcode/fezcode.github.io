import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import {
  MarquetryText,
  MarquetryIcon,
  MarquetryHero,
  MarquetryBand,
  MarquetryNotice,
  WOOD,
  marquetryDate,
} from '../../components/marquetry';
import '../../styles/Marquetry.css';

const MarquetrySeriesPage = () => {
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
  const ready = !loading && !error && seriesPosts.length > 0;

  return (
    <div className="mqt-root">
      <Seo
        title={`${seriesTitle || 'Series'} | Fezcodex Series`}
        description={`A bound volume of ${seriesPosts.length} parts from the field notes register.`}
      />
      <MarquetryHero
        eyebrow={
          ready ? `Bound volume · ${seriesPosts.length} parts` : 'Series'
        }
        title={seriesTitle || 'Series'}
        intro={description || undefined}
        scale={1}
      >
        <Link to="/blog" className="mqt-btn mt-6">
          <MarquetryIcon name="arrowLeft" fg={WOOD.teal} />
          <MarquetryText text="Writing" size="small" fg={WOOD.ink} fit />
        </Link>
        {ready && (
          <MarquetryText
            text={`${seriesPosts.length} parts · first saved ${marquetryDate(firstFiled)} · last amended ${marquetryDate(lastAmended)}`}
            size="small"
            fg={WOOD.bark}
            className="mt-5"
          />
        )}
      </MarquetryHero>
      <div className="mqt-page">
        {loading && <MarquetryNotice>Reading the series…</MarquetryNotice>}
        {error && (
          <MarquetryNotice error>
            Could not read the collection.
          </MarquetryNotice>
        )}
        {!loading && !error && seriesPosts.length === 0 && (
          <MarquetryNotice error>
            No series found at /{seriesSlug}
          </MarquetryNotice>
        )}
        {ready && (
          <>
            <MarquetryText
              as="h2"
              text="Contents"
              fg={WOOD.teal}
              className="mb-4"
            />
            <ol className="list-none m-0 p-0">
              {seriesPosts.map((post, i) => {
                const idx = post.seriesIndex ?? i + 1;
                return (
                  <li key={post.slug}>
                    <Link
                      to={`/blog/series/${seriesSlug}/${post.slug}`}
                      className="mqt-row"
                    >
                      <MarquetryText
                        text={String(idx).padStart(2, '0')}
                        fg={WOOD.teal}
                        fit
                        aria-hidden="true"
                      />
                      <div className="mqt-row-body">
                        <MarquetryText
                          as="h3"
                          text={post.title}
                          fg={WOOD.ink}
                          maxLines={2}
                        />
                        <MarquetryText
                          text={`${post.category || 'Part'} · ${marquetryDate(post.updated || post.date)}`}
                          size="small"
                          fg={WOOD.bark}
                          className="mt-2"
                        />
                      </div>
                      <MarquetryIcon name="arrowRight" fg={WOOD.teal} />
                    </Link>
                  </li>
                );
              })}
            </ol>
            <nav
              className="flex justify-between items-center gap-4 mt-10"
              aria-label="Register navigation"
            >
              <Link to="/blog" className="mqt-link">
                ← Back to the collection
              </Link>
              <span className="mqt-label">End of contents</span>
            </nav>
          </>
        )}
      </div>
      <MarquetryBand
        pattern={['peerie', 'flowers', 'peerie']}
        className="mt-10"
      />
    </div>
  );
};

export default MarquetrySeriesPage;
