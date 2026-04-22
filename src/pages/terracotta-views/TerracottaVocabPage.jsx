import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Seo from '../../components/Seo';
import { vocabulary } from '../../data/vocabulary';
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

/**
 * Each vocab entry gets its own dictionary headword row.
 * Clicking opens the definition in the side panel.
 */
const EntryRow = ({ entry, onOpen, defIndex }) => (
  <motion.li
    initial={{ opacity: 0, y: 6 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.35, delay: Math.min(defIndex, 14) * 0.025 }}
    className="group"
  >
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left grid grid-cols-[auto_1fr_auto] md:grid-cols-[64px_1fr_auto_20px] gap-4 md:gap-8 items-baseline px-0 py-6 border-b border-dashed border-[#1A161320] hover:border-[#1A1613]/40 hover:bg-[#E8DECE]/30 transition-colors"
    >
      <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#9E4A2F]">
        {String(defIndex).padStart(3, '0')}
      </span>

      <div className="min-w-0 flex items-baseline gap-3 flex-wrap">
        <h3
          className="font-fraunces text-[26px] md:text-[34px] tracking-[-0.02em] leading-[1.05] text-[#1A1613] group-hover:text-[#9E4A2F] transition-colors"
          style={{
            fontVariationSettings:
              '"opsz" 48, "SOFT" 40, "WONK" 1, "wght" 440',
          }}
        >
          {entry.title}
        </h3>
        <span className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#2E2620]/55">
          /{entry.slug}/
        </span>
      </div>

      <span
        className="hidden md:inline-flex font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#2E2620]/70"
      >
        {entry.category || 'term'}
      </span>

      <span
        aria-hidden="true"
        className="hidden md:inline-block font-ibm-plex-mono text-sm justify-self-end text-[#9E4A2F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
      >
        →
      </span>
    </button>
  </motion.li>
);

const TerracottaVocabPage = () => {
  const [query, setQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('all');
  const { openSidePanel } = useSidePanel();

  const entries = useMemo(
    () =>
      Object.entries(vocabulary)
        .map(([slug, data]) => ({ slug, ...data }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    [],
  );

  const filtered = useMemo(() => {
    let list = entries;
    if (activeLetter !== 'all') {
      list = list.filter(
        (e) => e.title.charAt(0).toUpperCase() === activeLetter,
      );
    }
    if (query) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q) ||
          (e.category || '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [entries, activeLetter, query]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach((e) => {
      const letter = e.title.charAt(0).toUpperCase();
      if (!g[letter]) g[letter] = [];
      g[letter].push(e);
    });
    return g;
  }, [filtered]);

  const allLetters = useMemo(() => {
    const s = new Set();
    entries.forEach((e) => s.add(e.title.charAt(0).toUpperCase()));
    return [...s].sort();
  }, [entries]);

  const visibleLetters = Object.keys(grouped).sort();

  const openVocab = (entry) => {
    const LazyComponent = React.lazy(entry.loader);
    openSidePanel(entry.title, <LazyComponent />, 600);
  };

  const scrollToLetter = (letter) => {
    setActiveLetter('all');
    requestAnimationFrame(() => {
      const el = document.getElementById(`letter-${letter}`);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  };

  let running = 0;

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
        title="Glossary | Fezcodex"
        description="A lexicon of terms the codex keeps returning to."
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.32] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <div className="relative z-10 mx-auto max-w-[1080px] px-6 md:px-14 pb-[120px]">
        <TerracottaStrip
          left="Folio VII · lexicon"
          center="A working glossary for the archive"
          right={`${filtered.length} of ${entries.length}`}
        />

        {/* title */}
        <section className="pt-20 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F] mb-6 flex items-center gap-3">
                <span>Codex entry · §</span>
                <span aria-hidden="true" className="h-px flex-1 max-w-[60px] bg-[#9E4A2F]/50" />
                <span>VII</span>
              </div>
              <div className="flex items-baseline gap-5 flex-wrap">
                <h1
                  className="font-fraunces text-[72px] md:text-[128px] leading-[0.86] tracking-[-0.035em] text-[#1A1613]"
                  style={{
                    fontVariationSettings:
                      '"opsz" 144, "SOFT" 40, "WONK" 1, "wght" 460',
                  }}
                >
                  lexicon
                </h1>
                <sup className="font-ibm-plex-mono text-[18px] tracking-[0.12em] uppercase text-[#9E4A2F] -translate-y-5">
                  n.
                </sup>
              </div>
              <div
                className="mt-3 font-fraunces italic text-[22px] text-[#2E2620]"
                style={{
                  fontVariationSettings:
                    '"opsz" 28, "SOFT" 100, "wght" 360',
                }}
              >
                /ˈlɛk.sɪ.kɒn/ · also: glossary · terms · index
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
                A {''}
                <span
                  className="not-italic text-[#9E4A2F]"
                  style={{
                    fontStyle: 'normal',
                    fontVariationSettings: '"wght" 560',
                  }}
                >
                  worked glossary
                </span>
                : concepts the codex returns to, kept in one honest place.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1A161320]">
                <TerracottaSpec label="Entries" value={`${entries.length}`} />
                <TerracottaSpec
                  label="Letters"
                  value={`${allLetters.length}`}
                />
                <TerracottaSpec label="Sort" value="Alphabetical" />
                <TerracottaSpec label="Opens in" value="Side panel" />
              </div>
            </aside>
          </div>
        </section>

        {/* search + alphabet */}
        <section className="sticky top-0 z-30 py-4 bg-[#F3ECE0]/92 backdrop-blur-md border-y border-[#1A161320]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the lexicon…"
            className="w-full bg-transparent border-none focus:outline-none py-1.5 font-fraunces italic text-[20px] md:text-[22px] text-[#1A1613] placeholder:text-[#2E2620]/35"
            style={{
              fontVariationSettings:
                '"opsz" 32, "SOFT" 100, "WONK" 0, "wght" 360',
            }}
          />
          <div className="mt-3 flex items-center gap-2 flex-wrap font-ibm-plex-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-[#2E2620]/60">Jump</span>
            <button
              type="button"
              onClick={() => setActiveLetter('all')}
              className={`px-2 py-0.5 border transition-colors ${
                activeLetter === 'all'
                  ? 'border-[#1A1613] bg-[#1A1613] text-[#F3ECE0]'
                  : 'border-[#1A161320] text-[#2E2620] hover:border-[#1A1613]/50'
              }`}
            >
              All
            </button>
            {allLetters.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => scrollToLetter(l)}
                className="px-2 py-0.5 border border-[#1A161320] text-[#2E2620] hover:border-[#C96442] hover:text-[#9E4A2F] transition-colors"
              >
                {l}
              </button>
            ))}
          </div>
        </section>

        {/* groupings */}
        <section className="pt-16">
          {visibleLetters.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-fraunces italic text-[22px] text-[#2E2620]/60">
                No entry matches.
              </p>
            </div>
          )}

          {visibleLetters.map((letter, idx) => (
            <section
              key={letter}
              id={`letter-${letter}`}
              className={`${idx === 0 ? '' : 'pt-16'} scroll-mt-40`}
            >
              <TerracottaChapter
                numeral={letter}
                label={`Letter ${letter}`}
                title={
                  <>
                    under <ChapterEm>{letter.toLowerCase()}.</ChapterEm>
                  </>
                }
                blurb={`${grouped[letter].length} entr${grouped[letter].length === 1 ? 'y' : 'ies'}.`}
              />

              <ol className="border-t border-[#1A161320]">
                {grouped[letter].map((entry) => {
                  running += 1;
                  return (
                    <EntryRow
                      key={entry.slug}
                      entry={entry}
                      defIndex={running}
                      onOpen={() => openVocab(entry)}
                    />
                  );
                })}
              </ol>
            </section>
          ))}
        </section>

        <TerracottaColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · Fezcode</span>
              <span>Lexicon · {entries.length} definitions</span>
            </>
          }
        />

        {/* corner mark */}
        <div className="fixed bottom-6 right-6 opacity-40 pointer-events-none z-20 hidden md:block">
          <TerracottaMark size={18} color="#C96442" />
        </div>
      </div>
    </div>
  );
};

export default TerracottaVocabPage;
