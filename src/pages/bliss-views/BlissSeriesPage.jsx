import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BooksIcon,
  CaretRightIcon,
  ListNumbersIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import {
  BlissWindow,
  BlissNotice,
  BlissTitleLink,
  blissDate,
} from '../../components/bliss';
import { getCategoryColor } from '../../utils/categoryColors';
import '../../styles/Bliss.css';

const BlissSeriesPage = () => {
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
    <div className="bl-root">
      <Seo
        title={`${seriesTitle || 'Series'} | Fezcodex Series`}
        description={`A bound volume of ${seriesPosts.length} parts from the field notes register.`}
      />
      <div className="bl-page">
        <BlissWindow
          title={seriesTitle || 'Series'}
          icon={BooksIcon}
          tone="pink"
          headingLevel={1}
          actions={<BlissTitleLink to="/blog">← Writing</BlissTitleLink>}
        >
          <p className="bl-eyebrow m-0">
            {ready ? `Bound volume · ${seriesPosts.length} parts` : 'Series'}
          </p>
          {description && <p className="mt-2 mb-0 max-w-3xl">{description}</p>}
          {ready && (
            <p className="bl-meta mt-3 mb-0">
              {seriesPosts.length} parts · first saved {blissDate(firstFiled)} ·
              last amended {blissDate(lastAmended)}
            </p>
          )}
          <Link to="/blog" className="bl-btn mt-4">
            <ArrowLeftIcon size={16} weight="bold" aria-hidden="true" />
            Writing
          </Link>
        </BlissWindow>

        {loading && <BlissNotice>Opening the series…</BlissNotice>}
        {error && <BlissNotice error>Could not read the collection.</BlissNotice>}
        {!loading && !error && seriesPosts.length === 0 && (
          <BlissNotice error>No series found at /{seriesSlug}</BlissNotice>
        )}

        {ready && (
          <BlissWindow
            title="Contents"
            icon={ListNumbersIcon}
            tone="blue"
            flush
            status={
              <>
                <span>{seriesPosts.length} objects</span>
                <span>Last amended {blissDate(lastAmended)}</span>
              </>
            }
          >
            <ol className="list-none m-0 p-0 bg-white">
              {seriesPosts.map((post, i) => {
                const idx = post.seriesIndex ?? i + 1;
                const category = post.category || 'Part';
                return (
                  <li key={post.slug}>
                    <Link
                      to={`/blog/series/${seriesSlug}/${post.slug}`}
                      className="bl-row"
                    >
                      <span
                        className="bl-icon bl-title-font font-bold"
                        style={{
                          width: 36,
                          height: 36,
                          background:
                            'linear-gradient(180deg, #ff8fb4, #d0346a)',
                        }}
                        aria-hidden="true"
                      >
                        <span className="relative">
                          {String(idx).padStart(2, '0')}
                        </span>
                      </span>
                      <span className="bl-row-body">
                        <span className="sr-only">Part {idx}: </span>
                        <span className="bl-row-title line-clamp-2">
                          {post.title}
                        </span>
                        <span className="bl-meta">
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle border border-white"
                            style={{
                              background: getCategoryColor(
                                'bliss',
                                post.category,
                              ),
                            }}
                            aria-hidden="true"
                          />
                          <span className="font-semibold">{category}</span>{' '}
                          · {blissDate(post.updated || post.date)}
                        </span>
                      </span>
                      <CaretRightIcon
                        size={16}
                        weight="bold"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ol>
            <nav
              className="flex justify-between items-center gap-4 px-4 py-3 border-t border-[#c9c4ad]"
              aria-label="Register navigation"
            >
              <Link to="/blog" className="bl-link">
                ← Back to the collection
              </Link>
              <span className="bl-label">End of series</span>
            </nav>
          </BlissWindow>
        )}
      </div>
    </div>
  );
};

export default BlissSeriesPage;
