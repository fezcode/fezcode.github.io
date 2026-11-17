import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import {
  KilimRug,
  KilimText,
  KilimBand,
  KilimBadge,
  KilimNotice,
  WOOL,
  pickBySeed,
  kilimDate,
} from '../../components/kilim';
import '../../styles/Kilim.css';
import './kilim-content.css';

/** Each episode is a swatch dyed its own colour, as on a weaver's sampler. */
const GROUNDS = [
  'klm-wool-indigo',
  'klm-wool-teal',
  'klm-wool-aubergine',
  'klm-wool-madder',
  'klm-wool-pistachio',
];

const KilimSeriesPage = () => {
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
    <div className="klm-root">
      <Seo
        title={`${seriesTitle || 'Series'} | Fezcodex Series`}
        description={`A bound volume of ${seriesPosts.length} parts from the field notes register.`}
      />
      <div className="klm-page !pb-0">
        <KilimRug
          eyebrow={ready ? `A sampler · ${seriesPosts.length} parts` : 'Series'}
          title={seriesTitle || 'Series'}
          intro={description || undefined}
          seed={seriesSlug}
        >
          <div className="klm-actions">
            <Link to="/blog" className="klm-btn klm-btn-ivory">
              <span aria-hidden="true">←</span> Writing
            </Link>
            {ready && (
              <span className="klm-label">
                {seriesPosts.length} parts · first woven {kilimDate(firstFiled)} ·
                last amended {kilimDate(lastAmended)}
              </span>
            )}
          </div>
        </KilimRug>
      </div>
      <div className="klm-page">
        {loading && <KilimNotice>Unrolling the series…</KilimNotice>}
        {error && <KilimNotice error>Could not read the collection.</KilimNotice>}
        {!loading && !error && seriesPosts.length === 0 && (
          <KilimNotice error>No series found at /{seriesSlug}</KilimNotice>
        )}
        {ready && (
          <>
            <div className="klm-sampler">
              <div className="klm-sampler-head">
                <KilimText as="h2" text="Contents" fg={WOOL.saffron} fit />
                <span className="klm-label">Read in order, swatch by swatch</span>
              </div>
              <ol className="klm-sampler-grid">
                {seriesPosts.map((post, i) => {
                  const idx = post.seriesIndex ?? i + 1;
                  return (
                    <li key={post.slug}>
                      <Link
                        to={`/blog/series/${seriesSlug}/${post.slug}`}
                        className={`klm-swatch ${pickBySeed(post.slug, GROUNDS)}`}
                      >
                        <span className="klm-swatch-no" aria-hidden="true">
                          {String(idx).padStart(2, '0')}
                        </span>
                        <div className="klm-swatch-weave">
                          <KilimBadge seed={post.slug} size={17} />
                        </div>
                        <div className="klm-swatch-body">
                          <h3 className="klm-swatch-title">
                            <span className="sr-only">Part {idx}: </span>
                            {post.title}
                          </h3>
                          <span className="klm-label">
                            {post.category || 'Part'} ·{' '}
                            {kilimDate(post.updated || post.date)}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
            <nav
              className="flex justify-between items-center gap-4 mt-10"
              aria-label="Register navigation"
            >
              <Link to="/blog" className="klm-link">
                ← Back to the collection
              </Link>
              <span className="klm-label">Cut from the loom</span>
            </nav>
          </>
        )}
      </div>
      <KilimBand pattern={['stars', 'end']} className="mt-6" />
    </div>
  );
};

export default KilimSeriesPage;
