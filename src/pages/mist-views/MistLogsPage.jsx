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

const CATEGORIES = [
  'Book', 'Movie', 'Video', 'Game', 'Article', 'Music', 'Series', 'Food', 'Websites', 'Tools', 'Event', 'Quote',
];

const CATEGORY_TINT = {
  book: '#5F837B',
  movie: '#8FA8BC',
  video: '#7E99A8',
  game: '#6F9184',
  article: '#8A9894',
  music: '#7C8FA0',
  series: '#7E99A8',
  food: '#8FA89E',
  websites: '#6F9184',
  tools: '#5C6B67',
  event: '#7C8FA0',
  quote: '#8FA8BC',
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

const Stars = ({ rating, size = 12 }) => (
  <span aria-hidden="true" className="inline-flex gap-0.5 items-baseline">
    {[...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        size={size}
        weight={i < rating ? 'fill' : 'regular'}
        style={{ color: i < rating ? '#8FA8BC' : 'rgba(60,72,69,0.18)' }}
      />
    ))}
  </span>
);

/**
 * MistLogCard — a slip of condensation. A veil surface in grid view,
 * a fading row in list view; nothing carries a hard edge.
 */
const MistLogCard = ({ log, index, viewMode = 'grid' }) => {
  const category = (log.category || 'log').toLowerCase();
  const tint = CATEGORY_TINT[category] || '#5C6B67';
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
        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, delay: Math.min(index, 12) * 0.06 }}
        className="group"
      >
        <Link
          to={to}
          className="grid grid-cols-[auto_auto_1fr_auto] md:grid-cols-[80px_96px_1fr_auto_20px] gap-3 md:gap-6 items-baseline py-5 border-b border-[#3C4845]/10"
        >
          <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.18em] lowercase text-[#8A9894]">
            {formatDate(log.date)}
          </span>
          <span
            className="font-ibm-plex-mono text-[9.5px] tracking-[0.18em] lowercase px-2 py-0.5 rounded-full justify-self-start backdrop-blur-sm"
            style={{ color: tint, backgroundColor: `${tint}1A` }}
          >
            {category}
          </span>
          <div className="min-w-0">
            <h3 className="font-instr-serif font-normal text-[19px] md:text-[24px] leading-[1.12] tracking-[-0.01em] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
              {log.title}
            </h3>
            {creator && (
              <span className="block mt-0.5 font-instr-serif italic text-[14px] text-[#5C6B67]">
                by {creator}
              </span>
            )}
          </div>
          <span className="hidden md:inline-flex justify-self-end">
            <Stars rating={rating} />
          </span>
          <span
            aria-hidden="true"
            className="hidden md:inline-block font-ibm-plex-mono text-sm justify-self-end text-[#5F837B] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-[250ms]"
          >
            →
          </span>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: Math.min(index, 12) * 0.06 }}
      className="group relative rounded-2xl bg-white/40 backdrop-blur-sm shadow-[0_18px_50px_rgba(60,72,69,0.10)] hover:bg-white/55 transition-colors duration-[250ms] overflow-hidden"
    >
      <Link to={to} className="block p-7 h-full">
        {/* strip: no · category · date */}
        <div className="flex items-center justify-between pb-4 font-ibm-plex-mono text-[9px] tracking-[0.2em] lowercase text-[#8A9894]">
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block w-[6px] h-[6px] rounded-full"
              style={{
                background: tint,
                boxShadow: `0 0 8px 1px ${tint}66`,
              }}
            />
            no. {String(log.originalIndex != null ? log.originalIndex + 1 : index + 1).padStart(3, '0')}
          </span>
          <span className="flex items-center gap-2">
            <span style={{ color: tint }}>{category}</span>
            <span className="opacity-50">·</span>
            <span>{formatDate(log.date)}</span>
          </span>
        </div>
        <MistHorizon tint="rgba(60,72,69,0.14)" />

        {/* title block */}
        <h3 className="mt-5 font-instr-serif font-normal text-[24px] md:text-[28px] leading-[1.08] tracking-[-0.015em] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
          {log.title}
        </h3>
        {creator && (
          <p className="mt-1.5 font-instr-serif italic text-[15px] text-[#5C6B67]">
            by {creator}
          </p>
        )}

        {/* stars */}
        {rating > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <Stars rating={rating} size={13} />
            <span className="font-ibm-plex-mono text-[9.5px] tracking-[0.2em] lowercase text-[#8A9894]">
              {rating}/5
            </span>
          </div>
        )}

        {/* description */}
        {log.description && (
          <p className="mt-5 font-outfit font-light text-[13px] leading-[1.7] text-[#5C6B67] line-clamp-3">
            {log.description}
          </p>
        )}

        {/* footer */}
        <div className="mt-6 pt-4">
          <MistHorizon tint="rgba(60,72,69,0.12)" />
          <div className="pt-4 flex items-center justify-between font-ibm-plex-mono text-[9.5px] tracking-[0.2em] lowercase">
            <span className="text-[#8A9894] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
              drift in
            </span>
            <span
              aria-hidden="true"
              className="text-[#5F837B] -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-[250ms]"
            >
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

const MistLogsPage = () => {
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
      className="min-h-screen relative text-[#3C4845] font-outfit selection:bg-[#8FA8BC]/30 selection:text-[#3C4845]"
      style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
    >
      <Seo
        title="Discovery Logs | Fezcodex"
        description="An archive of things seen, read, played, tasted — kept while waking; the fog keeps the rest."
      />
      <MistVeil />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-14 pb-[120px]">
        <MistStrip
          left="drift viii · the catalogue"
          center="kept while waking — rated by half-light"
          right={`${filtered.length} of ${logs.length} surfaced`}
        />

        {/* hero */}
        <section className="pt-20 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5F837B] mb-6 flex items-center gap-3">
                <span>fezcodex · drift</span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 max-w-[80px]"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(95,131,123,0.5), transparent)',
                  }}
                />
                <span>viii</span>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9 }}
                className="font-instr-serif font-normal text-[72px] md:text-[120px] leading-[0.92] tracking-[-0.02em] text-[#3C4845]"
              >
                discovery
                <br />
                <em className="italic text-[#5F837B]">logs</em>
              </motion.h1>
            </div>
            <motion.aside
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.12 }}
              className="flex flex-col gap-5"
            >
              <p className="font-instr-serif text-[20px] md:text-[22px] leading-[1.45] text-[#3C4845] max-w-[32ch]">
                Things <em className="italic text-[#5F837B]">seen, read, played, tasted</em>{' '}
                — written down before the fog could take them back.
              </p>
              <div className="pt-4">
                <MistHorizon />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <MistSpec label="entries" value={`${logs.length}`} />
                  <MistSpec label="categories" value={`${CATEGORIES.length}`} />
                  <MistSpec label="scale" value="1 ★ to 5 ★" />
                  <MistSpec label="ordered by" value="most recent waking" />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2 font-ibm-plex-mono text-[10px] tracking-[0.2em] lowercase">
                <button
                  type="button"
                  onClick={() => setShowInfo(true)}
                  className="inline-flex items-center gap-2 text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
                >
                  <InfoIcon size={12} /> rating scale
                </button>
                <span aria-hidden="true" className="text-[#8A9894]">·</span>
                <Link
                  to="/reading"
                  className="inline-flex items-center gap-2 text-[#5C6B67] hover:text-[#5F837B] transition-colors duration-[250ms]"
                >
                  <BookBookmarkIcon size={12} /> reading list
                </Link>
              </div>
            </motion.aside>
          </div>
        </section>

        {/* filter + view */}
        <section className="py-2">
          <MistHorizon />
          <div className="py-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5C6B67]">
              <FunnelIcon size={12} weight="regular" />
              <span>sift</span>
            </div>

            <div className="flex flex-wrap gap-1.5 flex-1">
              {CATEGORIES.map((c) => {
                const key = c.toLowerCase();
                const isActive = selected.includes(c);
                const tint = CATEGORY_TINT[key] || '#5C6B67';
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCategory(c)}
                    className={`font-ibm-plex-mono text-[9.5px] tracking-[0.18em] lowercase px-2.5 py-1 rounded-full transition-colors duration-[250ms] ${
                      isActive
                        ? 'text-[#EEF2F1]'
                        : 'bg-white/40 backdrop-blur-sm text-[#5C6B67] hover:text-[#5F837B]'
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: tint,
                            boxShadow: `0 8px 24px ${tint}59`,
                          }
                        : undefined
                    }
                  >
                    {key}
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
                  className="font-ibm-plex-mono text-[9.5px] tracking-[0.18em] lowercase px-2 py-1 text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms] inline-flex items-center gap-1"
                >
                  <XCircleIcon size={12} /> let it settle
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-full bg-white/40 backdrop-blur-sm p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  className={`p-1.5 rounded-full transition-colors duration-[250ms] ${
                    viewMode === 'grid'
                      ? 'bg-[#5F837B] text-[#EEF2F1] shadow-[0_4px_14px_rgba(95,131,123,0.35)]'
                      : 'text-[#5C6B67] hover:text-[#5F837B]'
                  }`}
                >
                  <SquaresFourIcon size={14} weight="regular" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  className={`p-1.5 rounded-full transition-colors duration-[250ms] ${
                    viewMode === 'list'
                      ? 'bg-[#5F837B] text-[#EEF2F1] shadow-[0_4px_14px_rgba(95,131,123,0.35)]'
                      : 'text-[#5C6B67] hover:text-[#5F837B]'
                  }`}
                >
                  <ListBulletsIcon size={14} weight="regular" />
                </button>
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search the fog…"
                className="w-[180px] bg-transparent border-b border-[#3C4845]/10 focus:border-[#5F837B]/60 focus:outline-none py-1.5 font-instr-serif italic text-[15px] text-[#3C4845] placeholder:text-[#8A9894]/70 transition-colors duration-[250ms]"
              />
            </div>
          </div>
          <MistHorizon />
        </section>

        {/* catalogue */}
        <section className="pt-16">
          <MistChapter
            numeral="i"
            label="the catalogue"
            title={
              <>
                in the order <ChapterEm>they surfaced.</ChapterEm>
              </>
            }
            blurb="newest first. each slip keeps a number, a category, a date — and how much of it stayed."
          />

          {loading ? (
            <div className="py-24 flex flex-col items-center gap-6">
              <MistOrb size={64} breathe />
              <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.26em] lowercase text-[#5C6B67]">
                condensing…
              </span>
            </div>
          ) : viewMode === 'list' ? (
            <div>
              <MistHorizon />
              <AnimatePresence mode="popLayout">
                {filtered.map((log, i) => (
                  <MistLogCard key={log.id} log={log} index={i} viewMode="list" />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((log, i) => (
                  <MistLogCard key={log.id} log={log} index={i} viewMode="grid" />
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-instr-serif italic text-[22px] text-[#8A9894]">
                nothing surfaces — the fog keeps it for now.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelected([]);
                  setQuery('');
                }}
                className="mt-4 font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
              >
                let it settle →
              </button>
            </div>
          )}
        </section>

        <MistColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · fezcode / a. s. bulbul</span>
              <span>
                logs · {logs.length} entries kept — the fog keeps the rest
              </span>
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
        <div className="font-outfit font-light text-[15px] leading-[1.7] text-[#5C6B67] space-y-5">
          <p>
            every entry is weighed the same way — five marks, read by
            half-light. stars are not preference; they are how much of the
            thing survived the waking.
          </p>
          <ol className="list-none p-0">
            {[
              ['5 ★', 'luminous — would press into a friend’s hands, still warm.'],
              ['4 ★', 'clear — recommended without hesitation.'],
              ['3 ★', 'worthwhile — has its hour; it might be yours.'],
              ['2 ★', 'thin — a caveat drifts beside every virtue.'],
              ['1 ★', 'dissolved — let the fog have it.'],
            ].map(([label, desc]) => (
              <li key={label} className="py-2.5 pl-[68px] relative border-b border-[#3C4845]/10 last:border-b-0">
                <span className="absolute left-0 top-2.5 font-ibm-plex-mono text-[11px] tracking-[0.18em] lowercase text-[#5F837B]">
                  {label}
                </span>
                <span className="font-instr-serif italic text-[16px] text-[#3C4845]">
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
            className="w-full py-3 mt-4 rounded-full bg-[#5F837B]/10 text-[#5F837B] hover:bg-[#5F837B] hover:text-[#EEF2F1] transition-colors duration-[250ms] font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase"
          >
            read the full guide →
          </button>
        </div>
      </GenericModal>
    </div>
  );
};

export default MistLogsPage;
