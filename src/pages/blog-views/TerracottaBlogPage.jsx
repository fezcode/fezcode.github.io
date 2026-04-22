import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import {
  TerracottaStrip,
  TerracottaChapter,
  ChapterEm,
  TerracottaMark,
  TerracottaColophon,
  TerracottaSpec,
} from '../../components/terracotta';

const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.28 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;
const PAPER_GRADIENT =
  'radial-gradient(1100px 600px at 85% -10%, #E8DECE 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #EDE3D3 0%, transparent 50%)';

const CATEGORY_COLOR = {
  dev: '#6B8E23',
  ai: '#8A6A32',
  feat: '#B88532',
  rant: '#9E4A2F',
  gist: '#C96442',
  series: '#B88532',
  'd&d': '#9E4A2F',
  dnd: '#9E4A2F',
  default: '#2E2620',
};

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'dev', label: 'Dev' },
  { id: 'ai', label: 'AI' },
  { id: 'feat', label: 'Feat' },
  { id: 'rant', label: 'Rant' },
  { id: 'series', label: 'Series' },
  { id: 'gist', label: 'Gist' },
  { id: 'd&d', label: 'D&D' },
];

const formatCodexDate = (d) =>
  new Date(d)
    .toLocaleDateString('en-GB', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, ' · ');

const LogRow = ({ item, index }) => {
  const href = item.isSeries ? `/blog/series/${item.slug}` : `/blog/${item.slug}`;
  const categoryKey = (item.category || 'default').toLowerCase();
  const color = CATEGORY_COLOR[categoryKey] || CATEGORY_COLOR.default;
  const displayCategory = item.isSeries ? 'series' : categoryKey;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index, 12) * 0.03 }}
      className="group"
    >
      <Link
        to={href}
        className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[140px_1fr_auto_20px] gap-4 md:gap-8 items-baseline py-8 border-b border-[#1A161320] hover:border-[#1A1613]/40 transition-colors"
      >
        <span className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#2E2620]/70">
          {formatCodexDate(item.updated || item.date)}
        </span>

        <div className="min-w-0">
          <h3
            className="font-fraunces text-[22px] md:text-[30px] leading-[1.15] tracking-[-0.015em] text-[#1A1613] group-hover:text-[#9E4A2F] transition-colors"
            style={{
              fontStyle: 'italic',
              fontVariationSettings:
                '"opsz" 36, "SOFT" 80, "WONK" 1, "wght" 400',
            }}
          >
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-1.5 font-ibm-plex-mono text-[11.5px] leading-[1.55] text-[#2E2620] max-w-[68ch] line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        <span
          className="hidden md:inline-flex font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase px-2 py-0.5 border"
          style={{
            borderColor: color,
            color: color,
            backgroundColor: `${color}10`,
          }}
        >
          {displayCategory}
        </span>

        <span
          aria-hidden="true"
          className="hidden md:inline-block font-ibm-plex-mono text-sm justify-self-end opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
          style={{ color }}
        >
          →
        </span>
      </Link>
    </motion.article>
  );
};

const TerracottaBlogPage = () => {
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
        style={{ background: '#F3ECE0', backgroundImage: PAPER_GRADIENT }}
      >
        <div className="flex flex-col items-center gap-5">
          <TerracottaMark size={52} color="#C96442" sway />
          <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.32em] uppercase text-[#2E2620]/80">
            Pulling the field notes
          </span>
        </div>
      </div>
    );
  }

  const seriesCount = items.filter((i) => i.isSeries).length;

  return (
    <div
      className="min-h-screen relative text-[#1A1613] font-fraunces selection:bg-[#C96442]/25"
      style={{
        background: '#F3ECE0',
        backgroundImage: PAPER_GRADIENT,
        fontFeatureSettings: '"ss01", "ss02", "kern"',
      }}
    >
      <Seo
        title="Field Notes | Fezcodex"
        description="Rants, dev diaries, dossiers — drafted in ink, held to the line."
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.32] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-14 pb-[120px]">
        <TerracottaStrip
          left="Folio III · field notes"
          center="Written slow. Read loud."
          right={`${filtered.length} of ${items.length}`}
        />

        {/* hero */}
        <section className="pt-20 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F] mb-6 flex items-center gap-3">
                <span>Codex entry · §</span>
                <span aria-hidden="true" className="h-px flex-1 max-w-[80px] bg-[#9E4A2F]/50" />
                <span>III</span>
              </div>
              <h1
                className="font-fraunces text-[72px] md:text-[128px] leading-[0.86] tracking-[-0.035em] text-[#1A1613]"
                style={{
                  fontVariationSettings:
                    '"opsz" 144, "SOFT" 30, "WONK" 1, "wght" 460',
                }}
              >
                Field<br />
                <ChapterEm>notes</ChapterEm>
                <span
                  aria-hidden="true"
                  className="text-[#C96442]"
                  style={{ fontVariationSettings: '"wght" 800' }}
                >
                  .
                </span>
              </h1>
            </div>
            <aside className="flex flex-col gap-5 lg:border-l border-[#1A161320] lg:pl-10">
              <p
                className="font-fraunces italic text-[20px] leading-[1.4] text-[#1A1613] max-w-[34ch]"
                style={{
                  fontVariationSettings:
                    '"opsz" 48, "SOFT" 100, "WONK" 0, "wght" 380',
                }}
              >
                Dossiers, rants, and dev diaries — written{' '}
                <span
                  className="not-italic text-[#9E4A2F]"
                  style={{
                    fontStyle: 'normal',
                    fontVariationSettings: '"wght" 560',
                  }}
                >
                  slow
                </span>{' '}
                on purpose.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1A161320]">
                <TerracottaSpec label="Entries" value={`${items.length}`} />
                <TerracottaSpec label="Series" value={`${seriesCount}`} />
                <TerracottaSpec label="Cadence" value="Irregular" />
                <TerracottaSpec label="Medium" value="Ink on bone" />
              </div>
            </aside>
          </div>
        </section>

        {/* filter strip */}
        <section className="py-6 border-y border-[#1A161320] flex flex-col md:flex-row gap-5 md:items-center">
          <div className="flex items-baseline gap-3 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#2E2620]/80">
            <span>Filter</span>
            <span aria-hidden="true" className="h-px w-8 bg-[#1A161320]" />
          </div>

          <div className="flex flex-wrap gap-1.5 flex-1">
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.id;
              const color = CATEGORY_COLOR[f.id] || CATEGORY_COLOR.default;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className={`font-ibm-plex-mono text-[9.5px] tracking-[0.18em] uppercase px-2 py-1 border transition-colors ${
                    isActive
                      ? 'text-[#F3ECE0]'
                      : 'border-[#1A161320] text-[#2E2620] hover:border-[#1A1613]/50'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: color,
                          borderColor: color,
                        }
                      : undefined
                  }
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
              placeholder="Search notes…"
              className="w-full bg-transparent border-b border-[#1A161320] focus:border-[#C96442] focus:outline-none py-2 font-fraunces italic text-[15px] text-[#1A1613] placeholder:text-[#2E2620]/40 transition-colors"
            />
          </div>
        </section>

        {/* list */}
        <section className="pt-20">
          <TerracottaChapter
            numeral="I"
            label="Entries, in reverse"
            title={
              <>
                Most <ChapterEm>recent first.</ChapterEm>
              </>
            }
            blurb="Dated, categorised, and read without hurry."
          />
          <div className="border-t border-[#1A1613]/25">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <LogRow key={item.slug} item={item} index={i} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <p className="font-fraunces italic text-[22px] text-[#2E2620]/60">
                  Nothing filed under that mark.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveFilter('all');
                  }}
                  className="mt-4 font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#9E4A2F] hover:text-[#C96442]"
                >
                  Reset filter →
                </button>
              </div>
            )}
          </div>
        </section>

        <TerracottaColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · Fezcode</span>
              <span>Field Notes · folio {String(items.length).padStart(3, '0')}</span>
            </>
          }
        />
      </div>
    </div>
  );
};

export default TerracottaBlogPage;
