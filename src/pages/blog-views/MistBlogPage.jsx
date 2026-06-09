import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import {
  MistVeil,
  MistOrb,
  MistHorizon,
  MistStrip,
  MistChapter,
  ChapterEm,
  MistSpec,
  MistColophon,
} from '../../components/mist';

const FOG_GRADIENT =
  'radial-gradient(1100px 600px at 80% -10%, #FFFFFF 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #D2DBD8 0%, transparent 50%), radial-gradient(700px 500px at 95% 90%, #E5EBE9 0%, transparent 45%)';

const CATEGORY_TINT = {
  dev: '#5F837B',
  ai: '#8FA8BC',
  feat: '#6E8E9C',
  rant: '#7B8E5F',
  gist: '#5F837B',
  essay: '#8FA8BC',
  series: '#5F837B',
  'd&d': '#7B8E5F',
  dnd: '#7B8E5F',
  default: '#5C6B67',
};

const FILTERS = [
  { id: 'all', label: 'all' },
  { id: 'dev', label: 'dev' },
  { id: 'ai', label: 'ai' },
  { id: 'feat', label: 'feat' },
  { id: 'rant', label: 'rant' },
  { id: 'essay', label: 'essay' },
  { id: 'series', label: 'series' },
  { id: 'gist', label: 'gist' },
  { id: 'd&d', label: 'd&d' },
];

const formatDriftDate = (d) =>
  new Date(d)
    .toLocaleDateString('en-GB', {
      year: '2-digit',
      month: 'short',
      day: '2-digit',
    })
    .toLowerCase();

const DriftRow = ({ item, index }) => {
  const href = item.isSeries ? `/blog/series/${item.slug}` : `/blog/${item.slug}`;
  const categoryKey = (item.category || 'default').toLowerCase();
  const tint = CATEGORY_TINT[categoryKey] || CATEGORY_TINT.default;
  const displayCategory = item.isSeries ? 'series' : categoryKey;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: Math.min(index, 12) * 0.06 }}
      className="group"
    >
      <Link
        to={href}
        className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[130px_1fr_auto_20px] gap-4 md:gap-8 items-baseline py-8 border-b border-[#3C4845]/10"
      >
        <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.2em] lowercase text-[#8A9894]">
          {formatDriftDate(item.updated || item.date)}
        </span>

        <div className="min-w-0">
          <h3 className="font-instr-serif font-normal text-[24px] md:text-[31px] leading-[1.12] tracking-[-0.01em] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-2 font-outfit font-light text-[13.5px] leading-[1.65] text-[#5C6B67] max-w-[64ch] line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        <span
          className="hidden md:inline-flex font-ibm-plex-mono text-[9.5px] tracking-[0.22em] lowercase px-3 py-1 rounded-full bg-white/40 backdrop-blur-sm transition-colors duration-[250ms]"
          style={{ color: tint }}
        >
          {displayCategory}
        </span>

        <span
          aria-hidden="true"
          className="hidden md:inline-block font-ibm-plex-mono text-sm justify-self-end opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-[250ms] text-[#5F837B]"
        >
          →
        </span>
      </Link>
    </motion.article>
  );
};

const MistBlogPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
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
        // ignore
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
      if (activeFilter !== 'series' && item.category !== activeFilter) return false;
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

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
      >
        <div className="flex flex-col items-center gap-6">
          <MistOrb size={64} breathe />
          <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.32em] lowercase text-[#8A9894]">
            condensing…
          </span>
        </div>
      </div>
    );
  }

  const seriesCount = items.filter((i) => i.isSeries).length;

  return (
    <div
      className="min-h-screen relative text-[#3C4845] font-outfit selection:bg-[#8FA8BC]/30 selection:text-[#3C4845]"
      style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
    >
      <Seo
        title="Drift Notes | Fezcodex"
        description="Notes kept while waking — half-remembered, half-imagined. The fog keeps the rest."
      />
      <MistVeil />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-14 pb-[120px]">
        <MistStrip
          left="drift iii · notes"
          center="kept while waking"
          right={`${filtered.length} of ${items.length} surfaced`}
        />

        {/* hero */}
        <section className="pt-20 md:pt-28 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5F837B] mb-7 flex items-center gap-3">
                <span>codex entry · drift</span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 max-w-[80px]"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(95,131,123,0.5), transparent)',
                  }}
                />
                <span>iii</span>
              </div>
              <h1 className="font-instr-serif font-normal text-[64px] md:text-[116px] leading-[0.92] tracking-[-0.02em] text-[#3C4845]">
                kept while
                <br />
                <ChapterEm>waking</ChapterEm>
                <span aria-hidden="true" className="text-[#8FA8BC]">
                  .
                </span>
              </h1>
            </div>
            <aside className="flex flex-col gap-6 lg:pl-10 relative">
              <span
                aria-hidden="true"
                className="hidden lg:block absolute left-0 top-0 bottom-0 w-px"
                style={{
                  background:
                    'linear-gradient(180deg, transparent, rgba(60,72,69,0.14), transparent)',
                }}
              />
              <p className="font-instr-serif italic text-[21px] leading-[1.45] text-[#5C6B67] max-w-[34ch]">
                Drifts, rants, and dev diaries — written at the{' '}
                <span className="not-italic text-[#5F837B]">threshold</span>,
                before the fog lifts.
              </p>
              <div className="pt-5 relative">
                <MistHorizon className="absolute top-0 left-0" />
                <div className="grid grid-cols-2 gap-5">
                  <MistSpec label="entries" value={`${items.length}`} />
                  <MistSpec label="series" value={`${seriesCount}`} />
                  <MistSpec label="cadence" value="when it settles" />
                  <MistSpec label="medium" value="breath on glass" />
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* filter strip */}
        <section>
          <MistHorizon />
          <div className="py-6 flex flex-col md:flex-row gap-5 md:items-center">
            <div className="flex items-baseline gap-3 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#8A9894]">
              <span>sift</span>
              <span
                aria-hidden="true"
                className="h-px w-8"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(60,72,69,0.2), transparent)',
                }}
              />
            </div>

            <div className="flex flex-wrap gap-1.5 flex-1">
              {FILTERS.map((f) => {
                const isActive = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id)}
                    className={`font-ibm-plex-mono text-[9.5px] tracking-[0.18em] lowercase px-3 py-1 rounded-full transition-all duration-[250ms] ${
                      isActive
                        ? 'bg-white/50 backdrop-blur-sm text-[#5F837B] shadow-[0_8px_24px_rgba(60,72,69,0.10)]'
                        : 'text-[#5C6B67] hover:text-[#5F837B]'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <div className="relative md:max-w-[260px] w-full">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search the fog…"
                className="w-full bg-transparent border-b border-[#3C4845]/10 focus:border-[#5F837B]/50 focus:outline-none py-2 font-instr-serif italic text-[16px] text-[#3C4845] placeholder:text-[#8A9894]/60 transition-colors duration-[250ms]"
              />
            </div>
          </div>
          <MistHorizon />
        </section>

        {/* list */}
        <section className="pt-20">
          <MistChapter
            numeral="i"
            label="surfacings"
            title={
              <>
                most recent, <ChapterEm>least dissolved.</ChapterEm>
              </>
            }
            blurb="dated, drifting, read gently — the fog keeps the rest."
          />
          <div className="relative">
            <MistHorizon tint="rgba(60,72,69,0.2)" />
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <DriftRow key={item.slug} item={item} index={i} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <p className="font-instr-serif italic text-[22px] text-[#8A9894]">
                  nothing surfaced under that name.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveFilter('all');
                  }}
                  className="mt-4 font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#5F837B] hover:text-[#8FA8BC] transition-colors duration-[250ms]"
                >
                  let the fog clear →
                </button>
              </div>
            )}
          </div>
        </section>

        <MistColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · fezcode</span>
              <span>
                kept while waking · drift {String(items.length).padStart(3, '0')}
              </span>
            </>
          }
        />
      </div>
    </div>
  );
};

export default MistBlogPage;
