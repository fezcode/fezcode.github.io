import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { appIcons } from '../../utils/appIcons';
import usePersistentState from '../../hooks/usePersistentState';
import { KEY_APPS_COLLAPSED_CATEGORIES } from '../../utils/LocalStorageManager';
import {
  MistVeil,
  MistOrb,
  MistHorizon,
  MistStrip,
  MistSpec,
  MistColophon,
} from '../../components/mist';

/* =========================================================================
   FOG
   ========================================================================= */
const FOG_GRADIENT =
  'radial-gradient(1100px 600px at 80% -10%, #FFFFFF 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #D2DBD8 0%, transparent 50%), radial-gradient(700px 500px at 95% 90%, #E5EBE9 0%, transparent 45%)';

const ROMAN = [
  'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii',
];

/* =========================================================================
   number → words (for hero headword). Handles 0–999.
   "seventy-four" · "one hundred and seven"
   ========================================================================= */
const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen',
];
const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
];
const belowHundred = (n) => {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o === 0 ? TENS[t] : `${TENS[t]}-${ONES[o]}`;
};
const numberToWords = (n) => {
  if (n === 0) return 'none';
  if (n < 100) return belowHundred(n);
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (rest === 0) return `${ONES[h]} hundred`;
  return `${ONES[h]} hundred and ${belowHundred(rest)}`;
};

/* =========================================================================
   InstrumentRow — one half-remembered instrument, surfacing from the fog
   ========================================================================= */
const InstrumentRow = ({ app, serial, categoryName, index }) => {
  const Icon = appIcons[app.icon] || null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: (index % 8) * 0.06 }}
      className="group relative"
    >
      <Link
        to={app.to}
        className="grid grid-cols-[34px_auto_1fr_auto] gap-3 md:gap-5 items-baseline py-3.5 px-2 border-b border-[#3C4845]/10 rounded-t-xl hover:bg-white/40 transition-colors duration-250"
      >
        {/* drift serial */}
        <span className="font-ibm-plex-mono text-[10px] tracking-[0.16em] lowercase text-[#8A9894] self-center">
          {String(serial).padStart(3, '0')}
        </span>

        {/* soft icon orb */}
        <span className="w-7 h-7 rounded-full bg-white/50 backdrop-blur-sm shadow-[0_4px_14px_rgba(60,72,69,0.10)] flex items-center justify-center text-[#5C6B67] group-hover:text-[#5F837B] transition-colors duration-250 self-center">
          {Icon ? (
            <Icon size={12} weight="light" />
          ) : (
            <MistOrb size={14} breathe={false} />
          )}
        </span>

        {/* entry: title · whisper of description */}
        <div className="min-w-0">
          <span className="inline-flex items-baseline gap-3 flex-wrap">
            <span className="font-instr-serif text-[17px] md:text-[18px] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-250">
              {app.title}
            </span>
            {app.pinned_order && (
              <span className="inline-flex items-center gap-1.5 font-ibm-plex-mono text-[9px] tracking-[0.18em] lowercase text-[#8FA8BC]">
                <span
                  aria-hidden="true"
                  className="inline-block w-[5px] h-[5px] rounded-full bg-[#8FA8BC]"
                  style={{ boxShadow: '0 0 6px 1px rgba(143,168,188,0.6)' }}
                />
                pinned
              </span>
            )}
            {app.created_at &&
              Date.now() - new Date(app.created_at).getTime() <
                1000 * 60 * 60 * 24 * 45 && (
                <span className="inline-block font-ibm-plex-mono text-[9px] tracking-[0.18em] lowercase text-[#5F837B] bg-[#5F837B]/10 rounded-full px-2 py-px">
                  new
                </span>
              )}
            <span className="font-instr-serif italic text-[14px] text-[#5C6B67]">
              — {app.description}
            </span>
          </span>
          <div className="mt-0.5 font-ibm-plex-mono text-[9px] tracking-[0.16em] lowercase text-[#8A9894]/80">
            {(categoryName || '').toLowerCase()} · {app.to}
          </div>
        </div>

        {/* hover arrow, dissolving in */}
        <ArrowUpRightIcon
          size={12}
          weight="light"
          className="text-[#5F837B] self-center opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250"
        />
      </Link>
    </motion.article>
  );
};

/* =========================================================================
   CategoryDrift — a drift of instruments behind one veil of fog.
   Two rails: a tall italic category name, then the run-on list.
   ========================================================================= */
const CategoryDrift = ({
  categoryKey,
  category,
  romanIndex,
  serialStart,
  isCollapsed,
  onToggle,
  highlightQuery,
}) => {
  const apps = category.apps || [];
  const hiddenCount = apps.length;

  return (
    <section id={`drift-${categoryKey}`} className="relative">
      <MistHorizon />
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-12 py-10 md:py-14">
        {/* left rail: drift index + category name */}
        <aside className="relative flex flex-col justify-between gap-6">
          <div className="space-y-1">
            <div className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] lowercase text-[#5F837B]">
              drift {ROMAN[romanIndex] || romanIndex + 1}
            </div>
            <div className="font-ibm-plex-mono text-[9px] tracking-[0.16em] lowercase text-[#8A9894]">
              /{categoryKey.toLowerCase().replace(/\s+/g, '-')}/
            </div>
          </div>

          <h2
            className="font-instr-serif italic text-[#3C4845] leading-[0.92] tracking-[-0.02em] font-normal"
            style={{ fontSize: 'clamp(44px, 5vw, 68px)' }}
          >
            {category.name.toLowerCase()}
            <em aria-hidden="true" className="text-[#5F837B] not-italic">
              .
            </em>
          </h2>

          {category.description && (
            <p className="font-ibm-plex-mono text-[10.5px] leading-[1.8] tracking-[0.04em] lowercase text-[#8A9894] max-w-[26ch]">
              {category.description.toLowerCase()}
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex items-center gap-2 font-ibm-plex-mono text-[9.5px] tracking-[0.22em] lowercase text-[#5C6B67] hover:text-[#5F837B] transition-colors duration-250"
            >
              <span
                aria-hidden="true"
                className={`inline-block transition-transform duration-250 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
              >
                ▾
              </span>
              {isCollapsed ? 'unveil' : 'veil'} · {hiddenCount} kept
            </button>
          </div>
        </aside>

        {/* right rail: the run-on list */}
        <div className="min-w-0">
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
                className="overflow-hidden"
              >
                <div>
                  <MistHorizon tint="rgba(60,72,69,0.18)" />
                  {apps.map((app, i) => {
                    if (
                      highlightQuery &&
                      !matchesQuery(app, category.name, highlightQuery)
                    ) {
                      return null;
                    }
                    return (
                      <InstrumentRow
                        key={app.slug}
                        app={app}
                        serial={serialStart + i}
                        categoryName={category.name}
                        index={i}
                      />
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {isCollapsed && (
            <motion.button
              type="button"
              onClick={onToggle}
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7 }}
              className="w-full text-left py-4 px-3 rounded-xl bg-white/30 backdrop-blur-sm font-ibm-plex-mono text-[10px] tracking-[0.2em] lowercase text-[#8A9894] hover:text-[#5F837B] hover:bg-white/50 transition-colors duration-250"
            >
              ▸ {hiddenCount} kept behind the veil — touch to part it
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
};

const matchesQuery = (app, categoryName, q) => {
  if (!q) return true;
  const n = q.toLowerCase();
  return (
    (app.title || '').toLowerCase().includes(n) ||
    (app.description || '').toLowerCase().includes(n) ||
    (app.slug || '').toLowerCase().includes(n) ||
    (categoryName || '').toLowerCase().includes(n)
  );
};

/* =========================================================================
   Page
   ========================================================================= */
const MistAppsPage = () => {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = usePersistentState(
    KEY_APPS_COLLAPSED_CATEGORIES,
    {},
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/apps/apps.json');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setGrouped(data);
          setCollapsed((prev) => {
            const next = { ...prev };
            Object.keys(data).forEach((k) => {
              if (next[k] === undefined) next[k] = false;
            });
            return next;
          });
        }
      } catch (e) {
        // swallowed
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setCollapsed]);

  const orderedCategoryKeys = useMemo(
    () =>
      Object.keys(grouped).sort(
        (a, b) => (grouped[a]?.order || 0) - (grouped[b]?.order || 0),
      ),
    [grouped],
  );

  const allApps = useMemo(() => {
    const out = [];
    orderedCategoryKeys.forEach((k) => {
      (grouped[k].apps || []).forEach((app) => {
        out.push({ ...app, categoryKey: k, categoryName: grouped[k].name });
      });
    });
    return out;
  }, [grouped, orderedCategoryKeys]);

  const total = allApps.length;
  const pinnedCount = allApps.filter((a) => a.pinned_order).length;

  const filtered = useMemo(() => {
    if (!query) return grouped;
    const result = {};
    orderedCategoryKeys.forEach((k) => {
      const cat = grouped[k];
      const kept = (cat.apps || []).filter((app) =>
        matchesQuery(app, cat.name, query),
      );
      if (kept.length) result[k] = { ...cat, apps: kept };
    });
    return result;
  }, [grouped, orderedCategoryKeys, query]);

  const filteredKeys = Object.keys(filtered).sort(
    (a, b) => (filtered[a]?.order || 0) - (filtered[b]?.order || 0),
  );

  // running serial across all drifts
  const serialMap = useMemo(() => {
    let running = 1;
    const map = {};
    orderedCategoryKeys.forEach((k) => {
      map[k] = running;
      running += grouped[k].apps?.length || 0;
    });
    return map;
  }, [grouped, orderedCategoryKeys]);

  const unfoldAll = () => {
    const next = {};
    Object.keys(grouped).forEach((k) => {
      next[k] = false;
    });
    setCollapsed(next);
  };
  const foldAll = () => {
    const next = {};
    Object.keys(grouped).forEach((k) => {
      next[k] = true;
    });
    setCollapsed(next);
  };

  const jumpTo = (k) => {
    // ensure unveiled
    setCollapsed((prev) => ({ ...prev, [k]: false }));
    requestAnimationFrame(() => {
      const el = document.getElementById(`drift-${k}`);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
      >
        <div className="flex flex-col items-center gap-5">
          <MistOrb size={64} />
          <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.26em] lowercase text-[#5C6B67]">
            the fog is lifting
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative text-[#3C4845] font-outfit selection:bg-[#8FA8BC]/30 selection:text-[#3C4845]"
      style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
    >
      <Seo
        title="Instruments | Fezcodex"
        description="A drifting cabinet of small instruments — games, utilities, generators, toys — kept while waking."
      />
      <MistVeil />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-14 pb-[120px]">
        <MistStrip
          left="drift vi · instruments"
          center="small useful things, half-remembered"
          right={`${total} kept · ${pinnedCount} pinned`}
        />

        {/* ============ HERO ============ */}
        <section className="pt-20 md:pt-28 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9 }}
            className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end"
          >
            <div>
              <div className="font-ibm-plex-mono text-[11px] tracking-[0.22em] lowercase text-[#5F837B] mb-6 flex items-center gap-3">
                <span>count, half-recalled</span>
                <MistHorizon className="flex-1 max-w-[60px]" tint="rgba(95,131,123,0.5)" />
                <span>the cabinet</span>
              </div>

              {/* spelled-out count */}
              <h1
                className="font-instr-serif italic text-[#3C4845] leading-[0.86] tracking-[-0.03em] font-normal"
                style={{ fontSize: 'clamp(64px, 12vw, 172px)' }}
              >
                {numberToWords(total)}
              </h1>
              <div
                className="mt-2 font-instr-serif text-[#3C4845] tracking-[-0.025em] leading-[0.94] font-normal"
                style={{ fontSize: 'clamp(44px, 7.5vw, 110px)' }}
              >
                instruments
                <em aria-hidden="true" className="text-[#5F837B] not-italic">
                  .
                </em>
              </div>
            </div>

            <aside className="flex flex-col gap-5">
              <p className="font-instr-serif text-[20px] leading-[1.45] text-[#3C4845] max-w-[34ch]">
                a cabinet of{' '}
                <em className="italic text-[#5F837B]">small, useful things</em>,
                each one kept while waking. drift through — pick whichever
                surfaces first.
              </p>
              <div>
                <MistHorizon />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <MistSpec label="kept" value={`${total}`} />
                  <MistSpec label="drifts" value={`${orderedCategoryKeys.length}`} />
                  <MistSpec label="pinned" value={`${pinnedCount}`} />
                  <MistSpec label="numbered" value="001 –" />
                </div>
              </div>
            </aside>
          </motion.div>
        </section>

        {/* ============ STICKY CONTROLS ============ */}
        <section className="sticky top-0 z-30 py-4 -mx-6 md:-mx-14 px-6 md:px-14 bg-[#EEF2F1]/85 backdrop-blur-md">
          {/* whisper-line search */}
          <div className="flex items-baseline gap-3">
            <MagnifyingGlassIcon
              size={14}
              className={`shrink-0 ${query ? 'text-[#5F837B]' : 'text-[#8A9894]'}`}
            />
            <span className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] lowercase text-[#8A9894] shrink-0 hidden md:inline">
              murmur
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="whisper a name — quote, clock, bpm, pattern…"
              className="flex-1 bg-transparent border-0 border-b border-[#3C4845]/10 focus:border-[#5F837B]/60 focus:outline-none py-1.5 font-instr-serif italic text-[18px] md:text-[22px] text-[#3C4845] placeholder:text-[#8A9894]/60 transition-colors duration-250"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-[#8A9894] hover:text-[#5F837B] shrink-0 transition-colors duration-250"
                aria-label="Clear"
              >
                <XCircleIcon size={14} weight="fill" />
              </button>
            )}
          </div>

          {/* jump bar */}
          <div className="mt-3 flex items-center gap-2 flex-wrap font-ibm-plex-mono text-[10px] tracking-[0.18em] lowercase">
            <span className="text-[#8A9894]">drifts</span>
            <button
              type="button"
              onClick={unfoldAll}
              className="px-3 py-0.5 rounded-full bg-white/40 ring-1 ring-[#3C4845]/10 text-[#5C6B67] hover:text-[#5F837B] hover:bg-white/60 transition-colors duration-250"
            >
              part all veils
            </button>
            <button
              type="button"
              onClick={foldAll}
              className="px-3 py-0.5 rounded-full bg-white/40 ring-1 ring-[#3C4845]/10 text-[#5C6B67] hover:text-[#5F837B] hover:bg-white/60 transition-colors duration-250"
            >
              let the fog in
            </button>
            <MistHorizon className="w-5 mx-1" />
            {orderedCategoryKeys.map((k, idx) => (
              <button
                key={k}
                type="button"
                onClick={() => jumpTo(k)}
                className="px-3 py-0.5 rounded-full bg-white/40 ring-1 ring-[#3C4845]/10 text-[#5C6B67] hover:text-[#5F837B] hover:bg-white/60 transition-colors duration-250"
                title={grouped[k].name}
              >
                <span className="text-[#5F837B]">{ROMAN[idx] || idx + 1}</span>
                <span className="mx-1 opacity-40">·</span>
                <span>{grouped[k].name.toLowerCase()}</span>
                <span className="ml-1.5 opacity-60">{grouped[k].apps?.length || 0}</span>
              </button>
            ))}
          </div>
          <MistHorizon className="mt-4" />
        </section>

        {/* ============ DRIFTS ============ */}
        <section className="pt-4">
          {filteredKeys.length === 0 && (
            <div className="py-28 text-center">
              <p className="font-instr-serif italic text-[22px] text-[#8A9894]">
                no instrument answers that name — perhaps it was dreamt.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-3 font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#5F837B] hover:text-[#3C4845] transition-colors duration-250"
              >
                let it dissolve →
              </button>
            </div>
          )}

          {filteredKeys.map((k, idx) => (
            <CategoryDrift
              key={k}
              categoryKey={k}
              category={filtered[k]}
              romanIndex={idx}
              serialStart={serialMap[k] || 1}
              isCollapsed={!!collapsed[k] && !query}
              onToggle={() =>
                setCollapsed((prev) => ({ ...prev, [k]: !prev[k] }))
              }
              highlightQuery={query}
            />
          ))}
        </section>

        {/* ============ FOOTER SUMMARY ============ */}
        {!query && (
          <section className="mt-16 pt-10">
            <MistHorizon className="mb-10" />
            <div className="font-ibm-plex-mono text-[9.5px] tracking-[0.24em] lowercase text-[#5F837B] mb-5">
              what the cabinet remembers
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {orderedCategoryKeys.map((k, idx) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-3 py-2 border-b border-[#3C4845]/10"
                >
                  <div>
                    <div className="font-ibm-plex-mono text-[9px] tracking-[0.22em] lowercase text-[#8A9894]">
                      drift {ROMAN[idx] || idx + 1}
                    </div>
                    <div className="font-instr-serif italic text-[16px] text-[#3C4845]">
                      {grouped[k].name.toLowerCase()}
                    </div>
                  </div>
                  <div className="font-ibm-plex-mono text-[14px] tracking-[0.02em] text-[#5F837B]">
                    {String(grouped[k].apps?.length || 0).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <MistColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · fezcode</span>
              <span>
                cabinet · 001 – {String(total).padStart(3, '0')} · the fog keeps the rest
              </span>
            </>
          }
        />

        <div className="fixed bottom-6 right-6 opacity-50 pointer-events-none z-20 hidden md:block">
          <MistOrb size={22} />
        </div>
      </div>
    </div>
  );
};

export default MistAppsPage;
