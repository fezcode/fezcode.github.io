import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FunnelIcon,
  SquaresFourIcon,
  ListBulletsIcon,
  XCircleIcon,
  StarIcon,
  InfoIcon,
  BookBookmarkIcon,
} from '@phosphor-icons/react';
import piml from 'piml';
import Seo from '../../components/Seo';
import GenericModal from '../../components/GenericModal';
import RatingSystemDetail from '../../components/RatingSystemDetail';
import usePersistentState from '../../hooks/usePersistentState';
import { useAchievements } from '../../context/AchievementContext';
import { useSidePanel } from '../../context/SidePanelContext';
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

const CATEGORIES = [
  'Book', 'Movie', 'Video', 'Game', 'Article', 'Music', 'Series', 'Food', 'Websites', 'Tools', 'Event',
];

const CATEGORY_COLOR = {
  book: '#9E4A2F',
  movie: '#C96442',
  video: '#B88532',
  game: '#6B8E23',
  article: '#8A6A32',
  music: '#9E4A2F',
  series: '#B88532',
  food: '#C96442',
  websites: '#6B8E23',
  tools: '#2E2620',
  event: '#B88532',
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

/**
 * TerracottaLogCard — a small archival slip.
 *
 *   ┌──────────────────────────────────┐
 *   │ No.146 · movie · 14/04/26   ★★★★☆│
 *   │                                   │
 *   │ Black Dynamite                    │
 *   │ dir. Scott Sanders                │
 *   │ ─────────────                     │
 *   │ quote/description…                │
 *   │                         view log →│
 *   └──────────────────────────────────┘
 */
const TerracottaLogCard = ({ log, index, viewMode = 'grid' }) => {
  const category = (log.category || 'log').toLowerCase();
  const color = CATEGORY_COLOR[category] || '#2E2620';
  const creator =
    log.author ||
    log.director ||
    log.artist ||
    log.creator ||
    log.by ||
    log.studio ||
    '';
  const rating = Number(log.rating) || 0;
  const to = `/logs/${category}/${log.slug}`;

  if (viewMode === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.3, delay: Math.min(index, 12) * 0.02 }}
        className="group"
      >
        <Link
          to={to}
          className="grid grid-cols-[auto_auto_1fr_auto] md:grid-cols-[80px_90px_1fr_auto_20px] gap-3 md:gap-6 items-baseline py-5 border-b border-dashed border-[#1A161320] hover:border-[#1A1613]/40 transition-colors"
        >
          <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#2E2620]/70">
            {formatDate(log.date)}
          </span>
          <span
            className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase px-1.5 py-0.5 border justify-self-start"
            style={{
              color,
              borderColor: color,
              backgroundColor: `${color}10`,
            }}
          >
            {category}
          </span>
          <div className="min-w-0">
            <h3
              className="font-fraunces text-[18px] md:text-[22px] tracking-[-0.01em] leading-[1.15] text-[#1A1613] group-hover:text-[#9E4A2F] transition-colors"
              style={{
                fontVariationSettings:
                  '"opsz" 28, "SOFT" 50, "WONK" 1, "wght" 440',
              }}
            >
              {log.title}
            </h3>
            {creator && (
              <span
                className="block mt-0.5 font-fraunces italic text-[13px] text-[#2E2620]"
                style={{
                  fontVariationSettings:
                    '"opsz" 18, "SOFT" 100, "wght" 360',
                }}
              >
                by {creator}
              </span>
            )}
          </div>
          <span
            aria-hidden="true"
            className="hidden md:inline-flex gap-0.5 justify-self-end items-baseline"
          >
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                size={12}
                weight={i < rating ? 'fill' : 'regular'}
                style={{ color: i < rating ? '#B88532' : '#1A161325' }}
              />
            ))}
          </span>
          <span
            aria-hidden="true"
            className="hidden md:inline-block font-ibm-plex-mono text-sm justify-self-end text-[#9E4A2F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
          >
            →
          </span>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index, 12) * 0.03 }}
      className="group relative bg-[#F3ECE0] border border-[#1A161320] hover:border-[#1A1613]/40 hover:bg-[#E8DECE]/35 transition-colors overflow-hidden"
    >
      <Link to={to} className="block p-6 h-full">
        {/* strip: no · category · date · stars */}
        <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#1A161320] font-ibm-plex-mono text-[9px] tracking-[0.22em] uppercase text-[#2E2620]/80">
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block w-[5px] h-[5px] rounded-full"
              style={{ backgroundColor: color }}
            />
            No. {String(log.originalIndex != null ? log.originalIndex + 1 : index + 1).padStart(3, '0')}
          </span>
          <span className="flex items-center gap-2">
            <span style={{ color }}>{category}</span>
            <span className="opacity-50">·</span>
            <span>{formatDate(log.date)}</span>
          </span>
        </div>

        {/* title block */}
        <h3
          className="mt-5 font-fraunces text-[22px] md:text-[26px] leading-[1.1] tracking-[-0.02em] text-[#1A1613] group-hover:text-[#9E4A2F] transition-colors"
          style={{
            fontVariationSettings:
              '"opsz" 32, "SOFT" 40, "WONK" 1, "wght" 460',
          }}
        >
          {log.title}
        </h3>
        {creator && (
          <p
            className="mt-1.5 font-fraunces italic text-[14px] text-[#2E2620]"
            style={{
              fontVariationSettings:
                '"opsz" 18, "SOFT" 100, "wght" 360',
            }}
          >
            by {creator}
          </p>
        )}

        {/* stars */}
        {rating > 0 && (
          <div className="mt-4 flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                size={13}
                weight={i < rating ? 'fill' : 'regular'}
                style={{ color: i < rating ? '#B88532' : '#1A161325' }}
              />
            ))}
            <span className="ml-2 font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#2E2620]/60">
              {rating}/5
            </span>
          </div>
        )}

        {/* description */}
        {log.description && (
          <p className="mt-5 font-ibm-plex-mono text-[11px] leading-[1.6] text-[#2E2620] line-clamp-3">
            {log.description}
          </p>
        )}

        {/* footer */}
        <div className="mt-6 pt-4 border-t border-dashed border-[#1A161320] flex items-center justify-between font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase">
          <span className="text-[#2E2620]/60 group-hover:text-[#1A1613] transition-colors">
            View log
          </span>
          <span
            aria-hidden="true"
            className="text-[#9E4A2F] -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
          >
            →
          </span>
        </div>
      </Link>
    </motion.article>
  );
};

const TerracottaLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = usePersistentState(
    'fez_logs_view_mode',
    'grid',
  );
  const [showInfo, setShowInfo] = useState(false);
  const { unlockAchievement } = useAchievements();
  const { openSidePanel } = useSidePanel();

  useEffect(() => {
    unlockAchievement('log_diver');
    let cancelled = false;
    (async () => {
      try {
        const fetches = CATEGORIES.map(async (c) => {
          const r = await fetch(`/logs/${c.toLowerCase()}/${c.toLowerCase()}.piml`);
          if (!r.ok) return [];
          const txt = await r.text();
          const data = piml.parse(txt);
          return data.logs || [];
        });
        const all = (await Promise.all(fetches)).flat();
        const withId = all
          .map((log, i) => ({
            ...log,
            id: `${log.title}-${log.date}-${i}`,
            originalIndex: i,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        if (!cancelled) setLogs(withId);
      } catch (e) {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [unlockAchievement]);

  const toggleCategory = (c) =>
    setSelected((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return logs.filter((log) => {
      if (selected.length && !selected.includes(log.category)) return false;
      if (!q) return true;
      return (
        log.title?.toLowerCase().includes(q) ||
        log.description?.toLowerCase().includes(q) ||
        log.author?.toLowerCase().includes(q) ||
        (log.director || '').toLowerCase().includes(q)
      );
    });
  }, [logs, selected, query]);

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
        title="Discovery Logs | Fezcodex"
        description="A catalogued archive of media — books, films, games, places, meals."
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.32] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-14 pb-[120px]">
        <TerracottaStrip
          left="Folio VIII · catalogue"
          center="Kept · rated · read true"
          right={`${filtered.length} of ${logs.length}`}
        />

        {/* hero */}
        <section className="pt-20 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F] mb-6 flex items-center gap-3">
                <span>Codex entry · §</span>
                <span aria-hidden="true" className="h-px flex-1 max-w-[60px] bg-[#9E4A2F]/50" />
                <span>VIII</span>
              </div>
              <h1
                className="font-fraunces text-[72px] md:text-[128px] leading-[0.86] tracking-[-0.035em] text-[#1A1613]"
                style={{
                  fontVariationSettings:
                    '"opsz" 144, "SOFT" 30, "WONK" 1, "wght" 460',
                }}
              >
                Discovery<br />
                <ChapterEm>logs</ChapterEm>
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
                className="font-fraunces italic text-[19px] leading-[1.4] text-[#1A1613] max-w-[36ch]"
                style={{
                  fontVariationSettings:
                    '"opsz" 48, "SOFT" 100, "WONK" 0, "wght" 380',
                }}
              >
                A catalogue of things{' '}
                <span
                  className="not-italic text-[#9E4A2F]"
                  style={{
                    fontStyle: 'normal',
                    fontVariationSettings: '"wght" 560',
                  }}
                >
                  seen, read, played, tasted
                </span>{' '}
                — rated on a plumb line of five stars.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1A161320]">
                <TerracottaSpec label="Entries" value={`${logs.length}`} />
                <TerracottaSpec
                  label="Categories"
                  value={`${CATEGORIES.length}`}
                />
                <TerracottaSpec label="Scale" value="1 ★ to 5 ★" />
                <TerracottaSpec label="Sort" value="Newest first" />
              </div>
              <div className="flex items-center gap-4 pt-2 font-ibm-plex-mono text-[10px] tracking-[0.2em] uppercase">
                <button
                  type="button"
                  onClick={() => setShowInfo(true)}
                  className="inline-flex items-center gap-2 text-[#9E4A2F] hover:text-[#C96442]"
                >
                  <InfoIcon size={12} /> Rating scale
                </button>
                <span aria-hidden="true" className="text-[#2E2620]/30">·</span>
                <Link
                  to="/reading"
                  className="inline-flex items-center gap-2 text-[#2E2620] hover:text-[#1A1613]"
                >
                  <BookBookmarkIcon size={12} /> Reading list
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* filter + view */}
        <section className="py-6 border-y border-[#1A161320] flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#2E2620]/80">
            <FunnelIcon size={12} weight="regular" />
            <span>Filter</span>
          </div>

          <div className="flex flex-wrap gap-1.5 flex-1">
            {CATEGORIES.map((c) => {
              const key = c.toLowerCase();
              const isActive = selected.includes(c);
              const color = CATEGORY_COLOR[key] || '#2E2620';
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCategory(c)}
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
                  {c}
                </button>
              );
            })}
            {(selected.length > 0 || query) && (
              <button
                type="button"
                onClick={() => {
                  setSelected([]);
                  setQuery('');
                }}
                className="font-ibm-plex-mono text-[9.5px] tracking-[0.18em] uppercase px-2 py-1 text-[#9E4A2F] hover:text-[#C96442] inline-flex items-center gap-1"
              >
                <XCircleIcon size={12} /> Reset
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-[#1A161320]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`p-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#1A1613] text-[#F3ECE0]'
                    : 'text-[#2E2620] hover:text-[#1A1613]'
                }`}
              >
                <SquaresFourIcon size={14} weight="regular" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`p-1.5 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#1A1613] text-[#F3ECE0]'
                    : 'text-[#2E2620] hover:text-[#1A1613]'
                }`}
              >
                <ListBulletsIcon size={14} weight="regular" />
              </button>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-[180px] bg-transparent border-b border-[#1A161320] focus:border-[#C96442] focus:outline-none py-1.5 font-fraunces italic text-[14px] text-[#1A1613] placeholder:text-[#2E2620]/40 transition-colors"
            />
          </div>
        </section>

        {/* catalogue */}
        <section className="pt-16">
          <TerracottaChapter
            numeral="I"
            label="The catalogue"
            title={
              <>
                In <ChapterEm>order of encounter.</ChapterEm>
              </>
            }
            blurb="Newest first. Each slip bears a number, a category, a date, and a plumb rating."
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-60 bg-[#E8DECE]/50 border border-[#1A161320] animate-pulse"
                />
              ))}
            </div>
          ) : viewMode === 'list' ? (
            <div className="border-t border-[#1A1613]/25">
              <AnimatePresence mode="popLayout">
                {filtered.map((log, i) => (
                  <TerracottaLogCard
                    key={log.id}
                    log={log}
                    index={i}
                    viewMode="list"
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((log, i) => (
                  <TerracottaLogCard
                    key={log.id}
                    log={log}
                    index={i}
                    viewMode="grid"
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-fraunces italic text-[22px] text-[#2E2620]/60">
                No slip meets that filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelected([]);
                  setQuery('');
                }}
                className="mt-4 font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#9E4A2F] hover:text-[#C96442]"
              >
                Reset filter →
              </button>
            </div>
          )}
        </section>

        <TerracottaColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · Fezcode</span>
              <span>Logs · {logs.length} entries</span>
            </>
          }
        />
      </div>

      {/* rating scale modal */}
      <GenericModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Rating scale"
      >
        <div className="font-fraunces text-[15px] leading-[1.65] text-[#2E2620] space-y-5">
          <p>
            Every entry is measured the same way — a plumb line of five marks.
            Stars are not preference; they are fit to purpose.
          </p>
          <ol
            className="list-none p-0"
            style={{ counterReset: 'ratings' }}
          >
            {[
              ['5 ★', 'Masterwork — would hand to a friend without hesitation.'],
              ['4 ★', 'Strong — recommended without caveat.'],
              ['3 ★', 'Worthwhile — has its audience, might be yours.'],
              ['2 ★', 'Flawed — a caveat for every virtue.'],
              ['1 ★', 'Avoidable — the line is off.'],
            ].map(([label, desc]) => (
              <li
                key={label}
                className="py-2.5 pl-[68px] relative border-b border-dashed border-[#1A161320] last:border-b-0"
              >
                <span className="absolute left-0 top-2.5 font-ibm-plex-mono text-[12px] tracking-[0.18em] uppercase text-[#9E4A2F]">
                  {label}
                </span>
                <span className="font-fraunces italic text-[15px] text-[#1A1613]">
                  {desc}
                </span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => {
              setShowInfo(false);
              openSidePanel('Rating System Details', <RatingSystemDetail />, 600);
            }}
            className="w-full py-3 mt-4 border border-[#C96442] text-[#9E4A2F] hover:bg-[#C96442] hover:text-[#F3ECE0] transition-colors font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase"
          >
            Read the full guide →
          </button>
        </div>
      </GenericModal>

      {/* corner mark */}
      <div className="fixed bottom-6 right-6 opacity-40 pointer-events-none z-20 hidden md:block">
        <TerracottaMark size={18} color="#C96442" />
      </div>
    </div>
  );
};

export default TerracottaLogsPage;
