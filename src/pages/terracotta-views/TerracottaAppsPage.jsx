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
  TerracottaStrip,
  TerracottaMark,
  TerracottaColophon,
  TerracottaSpec,
} from '../../components/terracotta';

/* =========================================================================
   PAPER
   ========================================================================= */
const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.28 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;
const PAPER_GRADIENT =
  'radial-gradient(1100px 600px at 85% -10%, #E8DECE 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #EDE3D3 0%, transparent 50%)';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

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
   InstrumentRow — a single catalogued instrument
   Dense two-column grid. No image blocks, no glow shadows.
   ========================================================================= */
const InstrumentRow = ({ app, serial, categoryName }) => {
  const Icon = appIcons[app.icon] || null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.28 }}
      className="group relative"
    >
      <Link
        to={app.to}
        className={`grid grid-cols-[28px_auto_1fr_auto] gap-3 md:gap-5 items-baseline py-3.5 pr-2 border-b border-dashed border-[#1A161320] hover:border-[#1A1613]/45 hover:bg-[#E8DECE]/30 transition-colors relative ${app.pinned_order ? 'border-l-2 border-l-[#C96442] pl-2' : ''}`}
      >
        {/* catalogue serial */}
        <span className="font-ibm-plex-mono text-[10px] tracking-[0.14em] uppercase text-[#9E4A2F]/85 self-center">
          № {String(serial).padStart(3, '0')}
        </span>

        {/* tiny icon slot */}
        <span className="w-6 h-6 border border-[#1A161320] bg-[#F3ECE0] flex items-center justify-center text-[#1A1613] group-hover:border-[#C96442] group-hover:text-[#9E4A2F] transition-colors">
          {Icon ? (
            <Icon size={12} weight="regular" />
          ) : (
            <TerracottaMark size={10} color="currentColor" />
          )}
        </span>

        {/* dictionary-style entry: title • description */}
        <div className="min-w-0">
          <span className="inline-flex items-baseline gap-3 flex-wrap">
            <span
              className="font-fraunces text-[16px] md:text-[17px] tracking-[-0.01em] text-[#1A1613] group-hover:text-[#9E4A2F] transition-colors"
              style={{
                fontVariationSettings:
                  '"opsz" 22, "SOFT" 50, "WONK" 1, "wght" 460',
              }}
            >
              {app.title}
            </span>
            {app.pinned_order && (
              <span
                className="font-ibm-plex-mono uppercase text-[#9E4A2F]"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.18em',
                }}
              >
                · pinned
              </span>
            )}
            {app.created_at &&
              Date.now() - new Date(app.created_at).getTime() <
                1000 * 60 * 60 * 24 * 45 && (
                <span
                  className="inline-block font-ibm-plex-mono uppercase text-[#6B8E23] border border-[#6B8E23]/45 bg-[#6B8E23]/10 px-1"
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.18em',
                  }}
                >
                  new
                </span>
              )}
            <span
              className="font-fraunces italic text-[14px] text-[#2E2620]"
              style={{
                fontVariationSettings:
                  '"opsz" 18, "SOFT" 100, "wght" 360',
              }}
            >
              — {app.description}
            </span>
          </span>
          <div className="mt-0.5 font-ibm-plex-mono text-[9px] tracking-[0.14em] uppercase text-[#2E2620]/50">
            {categoryName} · {app.to}
          </div>
        </div>

        {/* hover arrow */}
        <ArrowUpRightIcon
          size={12}
          weight="bold"
          className="text-[#9E4A2F] self-center opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
        />
      </Link>
    </motion.article>
  );
};

/* =========================================================================
   CategoryDrawer — a two-rail drawer with a huge italic category label and
   a dense 1/2-column run-on list of instruments.
   ========================================================================= */
const CategoryDrawer = ({
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
    <section
      id={`drawer-${categoryKey}`}
      className="relative grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-12 py-10 md:py-14 border-t border-[#1A161320]"
    >
      {/* left rail: drawer index + vertical category name */}
      <aside className="relative flex flex-col justify-between gap-6">
        <div className="space-y-1">
          <div className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#9E4A2F]">
            Drawer {ROMAN[romanIndex] || romanIndex + 1}
          </div>
          <div className="font-ibm-plex-mono text-[9px] tracking-[0.14em] uppercase text-[#2E2620]/65">
            /{categoryKey.toLowerCase().replace(/\s+/g, '-')}/
          </div>
        </div>

        <h2
          className="font-fraunces italic text-[#1A1613] leading-[0.88] tracking-[-0.03em]"
          style={{
            fontSize: 'clamp(44px, 5vw, 72px)',
            fontVariationSettings:
              '"opsz" 80, "SOFT" 100, "WONK" 1, "wght" 380',
          }}
        >
          {category.name}
          <span
            aria-hidden="true"
            className="text-[#C96442]"
            style={{ fontVariationSettings: '"wght" 800' }}
          >
            .
          </span>
        </h2>

        {category.description && (
          <p className="font-fraunces italic text-[14px] leading-[1.45] text-[#2E2620] max-w-[22ch]"
            style={{ fontVariationSettings: '"opsz" 18, "SOFT" 100, "wght" 360' }}
          >
            {category.description}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex items-center gap-2 font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#2E2620]/80 hover:text-[#9E4A2F] transition-colors"
          >
            <span
              aria-hidden="true"
              className={`inline-block transition-transform ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
            >
              ▾
            </span>
            {isCollapsed ? 'Show' : 'Fold'} · {hiddenCount} entries
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
              transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-[#1A1613]/25">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full text-left py-4 border-t border-[#1A1613]/25 font-ibm-plex-mono text-[10px] tracking-[0.2em] uppercase text-[#2E2620]/60 hover:text-[#9E4A2F] hover:bg-[#E8DECE]/30 transition-colors px-3"
          >
            ▸ {hiddenCount} entries folded — click to unfold
          </motion.button>
        )}
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
const TerracottaAppsPage = () => {
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

  // running serial across all drawers
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
    // ensure unfolded
    setCollapsed((prev) => ({ ...prev, [k]: false }));
    requestAnimationFrame(() => {
      const el = document.getElementById(`drawer-${k}`);
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
        style={{ background: '#F3ECE0', backgroundImage: PAPER_GRADIENT }}
      >
        <div className="flex flex-col items-center gap-5">
          <TerracottaMark size={52} color="#C96442" sway />
          <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.32em] uppercase text-[#2E2620]/80">
            Opening the cabinet
          </span>
        </div>
      </div>
    );
  }

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
        title="Instruments | Fezcodex"
        description="A catalogued cabinet of small instruments — games, utilities, generators, toys."
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.32] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-14 pb-[120px]">
        {/* folio header — a typeset chapter opener above the strip */}
        <div className="pt-6 pb-2 text-center">
          <div className="font-ibm-plex-mono text-[9px] tracking-[0.34em] uppercase text-[#2E2620]/65">
            ◂ ∙ cat. no. vi · applications · mmxxvi ∙ ▸
          </div>
        </div>

        <TerracottaStrip
          left="Folio VI · instruments"
          center="A cabinet of small, useful things"
          right={`${total} catalogued · ${pinnedCount} pinned`}
        />

        {/* ============ HERO ============ */}
        <section className="pt-20 md:pt-28 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[11px] tracking-[0.22em] uppercase text-[#9E4A2F] mb-6 flex items-center gap-3">
                <span>Count, spelled</span>
                <span aria-hidden="true" className="h-px flex-1 max-w-[60px] bg-[#9E4A2F]/50" />
                <span>the cabinet</span>
              </div>

              {/* spelled-out count */}
              <h1
                className="font-fraunces italic text-[#1A1613] leading-[0.82] tracking-[-0.04em]"
                style={{
                  fontSize: 'clamp(72px, 13vw, 192px)',
                  fontVariationSettings:
                    '"opsz" 144, "SOFT" 100, "WONK" 1, "wght" 380',
                }}
              >
                {numberToWords(total)}
              </h1>
              <div
                className="mt-2 font-fraunces text-[#1A1613] tracking-[-0.035em] leading-[0.92]"
                style={{
                  fontSize: 'clamp(48px, 8vw, 120px)',
                  fontVariationSettings:
                    '"opsz" 144, "SOFT" 30, "WONK" 1, "wght" 460',
                }}
              >
                instruments
                <span
                  aria-hidden="true"
                  className="text-[#C96442]"
                  style={{ fontVariationSettings: '"wght" 800' }}
                >
                  .
                </span>
              </div>
            </div>

            <aside className="flex flex-col gap-5 lg:border-l border-[#1A161320] lg:pl-10">
              <p
                className="font-fraunces italic text-[19px] leading-[1.4] text-[#1A1613] max-w-[34ch]"
                style={{
                  fontVariationSettings:
                    '"opsz" 48, "SOFT" 100, "WONK" 0, "wght" 380',
                }}
              >
                A cabinet of{' '}
                <span
                  className="not-italic text-[#9E4A2F]"
                  style={{
                    fontStyle: 'normal',
                    fontVariationSettings: '"wght" 560',
                  }}
                >
                  small, useful things
                </span>
                . Each drawer is pulled open — pick one.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1A161320]">
                <TerracottaSpec label="Catalogued" value={`${total}`} />
                <TerracottaSpec label="Drawers" value={`${orderedCategoryKeys.length}`} />
                <TerracottaSpec label="Pinned" value={`${pinnedCount}`} />
                <TerracottaSpec label="Numbered" value="№ 001–" />
              </div>
            </aside>
          </div>
        </section>

        {/* ============ STICKY CONTROLS ============ */}
        <section className="sticky top-0 z-30 py-4 -mx-6 md:-mx-14 px-6 md:px-14 bg-[#F3ECE0]/92 backdrop-blur-md border-y border-[#1A161320]">
          {/* ledger-line search */}
          <div className="flex items-baseline gap-3">
            <MagnifyingGlassIcon
              size={14}
              className={`shrink-0 ${query ? 'text-[#C96442]' : 'text-[#2E2620]/50'}`}
            />
            <span className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#2E2620]/60 shrink-0 hidden md:inline">
              Entry
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="type a name — quote, clock, bpm, pattern…"
              className="flex-1 bg-transparent border-0 border-b border-[#1A161320] focus:border-[#C96442] focus:outline-none py-1.5 font-fraunces italic text-[18px] md:text-[22px] text-[#1A1613] placeholder:text-[#2E2620]/35 transition-colors"
              style={{
                fontVariationSettings:
                  '"opsz" 32, "SOFT" 100, "WONK" 0, "wght" 360',
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-[#2E2620]/50 hover:text-[#9E4A2F] shrink-0"
                aria-label="Clear"
              >
                <XCircleIcon size={14} weight="fill" />
              </button>
            )}
          </div>

          {/* jump bar */}
          <div className="mt-3 flex items-center gap-2 flex-wrap font-ibm-plex-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-[#2E2620]/60">Drawers</span>
            <button
              type="button"
              onClick={unfoldAll}
              className="px-2 py-0.5 border border-[#1A161320] text-[#2E2620] hover:border-[#C96442] hover:text-[#9E4A2F] transition-colors"
            >
              open all
            </button>
            <button
              type="button"
              onClick={foldAll}
              className="px-2 py-0.5 border border-[#1A161320] text-[#2E2620] hover:border-[#C96442] hover:text-[#9E4A2F] transition-colors"
            >
              fold all
            </button>
            <span aria-hidden="true" className="h-px w-5 bg-[#1A161320] mx-1" />
            {orderedCategoryKeys.map((k, idx) => (
              <button
                key={k}
                type="button"
                onClick={() => jumpTo(k)}
                className="px-2 py-0.5 border border-[#1A161320] text-[#2E2620] hover:border-[#1A1613] hover:bg-[#E8DECE]/60 transition-colors"
                title={grouped[k].name}
              >
                <span className="text-[#9E4A2F]">{ROMAN[idx] || idx + 1}</span>
                <span className="mx-1 opacity-40">·</span>
                <span>{grouped[k].name}</span>
                <span className="ml-1.5 opacity-60">{grouped[k].apps?.length || 0}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ============ DRAWERS ============ */}
        <section className="pt-4">
          {filteredKeys.length === 0 && (
            <div className="py-28 text-center">
              <p className="font-fraunces italic text-[22px] text-[#2E2620]/60">
                No instrument answers that name.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-3 font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#9E4A2F] hover:text-[#C96442]"
              >
                Clear the entry →
              </button>
            </div>
          )}

          {filteredKeys.map((k, idx) => (
            <CategoryDrawer
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

        {/* ============ FOOTER LEDGER SUMMARY ============ */}
        {!query && (
          <section className="mt-16 pt-10 border-t border-[#1A161320]">
            <div className="font-ibm-plex-mono text-[9.5px] tracking-[0.24em] uppercase text-[#9E4A2F] mb-5">
              Cabinet summary
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {orderedCategoryKeys.map((k, idx) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-3 py-2 border-b border-dashed border-[#1A161320]"
                >
                  <div>
                    <div className="font-ibm-plex-mono text-[9px] tracking-[0.22em] uppercase text-[#2E2620]/60">
                      Drawer {ROMAN[idx] || idx + 1}
                    </div>
                    <div
                      className="font-fraunces italic text-[16px] text-[#1A1613]"
                      style={{
                        fontVariationSettings:
                          '"opsz" 18, "SOFT" 100, "wght" 380',
                      }}
                    >
                      {grouped[k].name}
                    </div>
                  </div>
                  <div className="font-ibm-plex-mono text-[14px] tracking-[0.02em] text-[#9E4A2F]">
                    {String(grouped[k].apps?.length || 0).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <TerracottaColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · Fezcode</span>
              <span>
                Cabinet · № 001 – № {String(total).padStart(3, '0')}
              </span>
            </>
          }
        />

        <div className="fixed bottom-6 right-6 opacity-40 pointer-events-none z-20 hidden md:block">
          <PinnedRibbonless />
        </div>
      </div>
    </div>
  );
};

// corner mark — the bob, at rest
const PinnedRibbonless = () => <TerracottaMark size={18} color="#C96442" />;

export default TerracottaAppsPage;
