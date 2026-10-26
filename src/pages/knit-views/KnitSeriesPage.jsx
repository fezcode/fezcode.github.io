import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import {
  KnitText,
  KnitIcon,
  KnitHero,
  KnitBand,
  KnitNotice,
  YARN,
  knitDate,
} from '../../components/knit';
import '../../styles/Knit.css';

const KnitSeriesPage = () => {
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
    <div className="knt-root">
      <Seo
        title={`${seriesTitle || 'Series'} | Fezcodex Series`}
        description={`A bound volume of ${seriesPosts.length} parts from the field notes register.`}
      />
      <KnitHero
        eyebrow={ready ? `Bound volume · ${seriesPosts.length} parts` : 'Series'}
        title={seriesTitle || 'Series'}
        intro={description || undefined}
        wool="rust"
        motif="hearts"
        scale={1}
      >
        <Link to="/blog" className="knt-btn mt-6">
          <KnitIcon name="arrowLeft" fg={YARN.gold} />
          <KnitText text="Writing" size="small" fg={YARN.cream} fit />
        </Link>
        {ready && (
          <KnitText
            text={`${seriesPosts.length} parts · first saved ${knitDate(firstFiled)} · last amended ${knitDate(lastAmended)}`}
            size="small"
            fg={YARN.wheat}
            className="mt-5"
          />
        )}
      </KnitHero>
      <div className="knt-page">
        {loading && <KnitNotice>Unrolling the series…</KnitNotice>}
        {error && <KnitNotice error>Could not read the collection.</KnitNotice>}
        {!loading && !error && seriesPosts.length === 0 && (
          <KnitNotice error>No series found at /{seriesSlug}</KnitNotice>
        )}
        {ready && (
          <>
            <KnitText as="h2" text="Contents" fg={YARN.gold} className="mb-4" />
            <ol className="list-none m-0 p-0">
              {seriesPosts.map((post, i) => {
                const idx = post.seriesIndex ?? i + 1;
                return (
                  <li key={post.slug}>
                    <Link
                      to={`/blog/series/${seriesSlug}/${post.slug}`}
                      className="knt-row"
                    >
                      <KnitText
                        text={String(idx).padStart(2, '0')}
                        fg={YARN.gold}
                        fit
                        aria-hidden="true"
                      />
                      <div className="knt-row-body">
                        <KnitText as="h3" text={post.title} fg={YARN.cream} maxLines={2} />
                        <KnitText
                          text={`${post.category || 'Part'} · ${knitDate(post.updated || post.date)}`}
                          size="small"
                          fg={YARN.wheat}
                          className="mt-2"
                        />
                      </div>
                      <KnitIcon name="arrowRight" fg={YARN.gold} />
                    </Link>
                  </li>
                );
              })}
            </ol>
            <nav
              className="flex justify-between items-center gap-4 mt-10"
              aria-label="Register navigation"
            >
              <Link to="/blog" className="knt-link">
                ← Back to the collection
              </Link>
              <span className="knt-label">Cast off</span>
            </nav>
          </>
        )}
      </div>
      <KnitBand pattern={['peerie', 'flowers', 'peerie']} className="mt-10" />
    </div>
  );
};

export default KnitSeriesPage;
