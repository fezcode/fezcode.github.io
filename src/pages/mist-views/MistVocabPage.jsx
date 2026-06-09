import React, { Suspense, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Seo from '../../components/Seo';
import { vocabulary } from '../../data/vocabulary';
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

const ROMAN_PAIRS = [
  [10, 'x'],
  [9, 'ix'],
  [5, 'v'],
  [4, 'iv'],
  [1, 'i'],
];

const toRoman = (n) => {
  let out = '';
  let rest = n;
  ROMAN_PAIRS.forEach(([value, glyph]) => {
    while (rest >= value) {
      out += glyph;
      rest -= value;
    }
  });
  return out;
};

/* The fog while a definition condenses into the side panel. */
const Condensing = () => (
  <div className="flex flex-col items-center justify-center gap-6 py-24">
    <MistOrb size={88} />
    <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#8A9894]">
      condensing…
    </span>
  </div>
);

/**
 * One headword, surfacing out of the fog. Clicking lets the definition
 * condense in the side panel.
 */
const EntryRow = ({ entry, onOpen, defIndex }) => (
  <motion.li
    initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.7, delay: Math.min(defIndex % 14, 14) * 0.06 }}
    className="group"
  >
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left grid grid-cols-[auto_1fr_auto] md:grid-cols-[64px_1fr_auto_20px] gap-4 md:gap-8 items-baseline px-3 md:px-4 py-6 rounded-2xl border-b border-[#3C4845]/10 hover:bg-white/40 hover:backdrop-blur-sm transition-colors duration-[250ms]"
    >
      <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5F837B]">
        {String(defIndex).padStart(3, '0')}
      </span>

      <div className="min-w-0 flex items-baseline gap-3 flex-wrap">
        <h3 className="font-instr-serif font-normal text-[26px] md:text-[34px] tracking-[-0.015em] leading-[1.05] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
          {entry.title}
        </h3>
        <span className="font-ibm-plex-mono text-[9.5px] tracking-[0.2em] lowercase text-[#8A9894]">
          /{entry.slug}/
        </span>
      </div>

      <span className="hidden md:inline-flex font-ibm-plex-mono text-[9.5px] tracking-[0.2em] lowercase text-[#5C6B67]">
        {(entry.category || 'term').toLowerCase()}
      </span>

      <span
        aria-hidden="true"
        className="hidden md:inline-block font-ibm-plex-mono text-sm justify-self-end text-[#5F837B] opacity-0 blur-[2px] -translate-x-2 group-hover:opacity-100 group-hover:blur-0 group-hover:translate-x-0 transition-all duration-[250ms]"
      >
        →
      </span>
    </button>
  </motion.li>
);

const MistVocabPage = () => {
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
    openSidePanel(
      entry.title,
      <Suspense fallback={<Condensing />}>
        <LazyComponent />
      </Suspense>,
      600,
    );
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
      className="min-h-screen relative text-[#3C4845] font-outfit selection:bg-[#8FA8BC]/30 selection:text-[#3C4845]"
      style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
    >
      <Seo
        title="Glossary | Fezcodex"
        description="A lexicon of terms the codex keeps returning to."
      />
      <MistVeil />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-14 pb-[120px]">
        <MistStrip
          left="drift vii · lexicon"
          center="a glossary kept while waking"
          right={`${filtered.length} of ${entries.length}`}
        />

        {/* title */}
        <section className="pt-20 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8 }}
                className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5F837B] mb-6 flex items-center gap-3"
              >
                <MistOrb size={20} />
                <span>drift entry · vii</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.06 }}
                className="font-instr-serif font-normal text-[72px] md:text-[120px] leading-[0.92] tracking-[-0.02em] text-[#3C4845]"
              >
                lexicon,{' '}
                <em className="italic text-[#5F837B]">half-recalled.</em>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.12 }}
                className="mt-4 font-ibm-plex-mono text-[11px] tracking-[0.18em] lowercase text-[#8A9894]"
              >
                /ˈlɛk.sɪ.kɒn/ · also: glossary · terms · index
              </motion.div>
            </div>
            <motion.aside
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.18 }}
              className="flex flex-col gap-6"
            >
              <p className="font-instr-serif text-[20px] leading-[1.45] text-[#3C4845] max-w-[34ch]">
                words the codex keeps{' '}
                <em className="italic text-[#5F837B]">while waking</em> — each
                one a small light held against forgetting. the fog keeps the
                rest.
              </p>
              <MistHorizon />
              <div className="grid grid-cols-2 gap-5">
                <MistSpec label="entries" value={`${entries.length}`} />
                <MistSpec label="letters" value={`${allLetters.length}`} />
                <MistSpec label="sort" value="alphabetical" />
                <MistSpec label="opens in" value="side panel" />
              </div>
            </motion.aside>
          </div>
        </section>

        {/* search + alphabet */}
        <section className="sticky top-0 z-30">
          <div className="bg-[#EEF2F1]/85 backdrop-blur-md">
            <MistHorizon />
            <div className="py-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search the fog…"
                className="w-full bg-transparent border-none focus:outline-none py-1.5 font-instr-serif italic text-[20px] md:text-[22px] text-[#3C4845] placeholder:text-[#8A9894]/70"
              />
              <div className="mt-3 flex items-center gap-2 flex-wrap font-ibm-plex-mono text-[10px] tracking-[0.18em] lowercase">
                <span className="text-[#8A9894]">drift to</span>
                <button
                  type="button"
                  onClick={() => setActiveLetter('all')}
                  className={`px-2.5 py-0.5 rounded-full transition-colors duration-[250ms] ${
                    activeLetter === 'all'
                      ? 'bg-[#5F837B]/15 text-[#5F837B]'
                      : 'text-[#5C6B67] hover:text-[#5F837B] hover:bg-white/50'
                  }`}
                >
                  all
                </button>
                {allLetters.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => scrollToLetter(l)}
                    className="px-2.5 py-0.5 rounded-full text-[#5C6B67] hover:text-[#5F837B] hover:bg-white/50 transition-colors duration-[250ms]"
                  >
                    {l.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
            <MistHorizon />
          </div>
        </section>

        {/* groupings */}
        <section className="pt-16">
          {visibleLetters.length === 0 && (
            <div className="py-24 flex flex-col items-center gap-6 text-center">
              <MistOrb size={64} />
              <p className="font-instr-serif italic text-[22px] text-[#5C6B67]">
                nothing surfaces — the fog keeps that one.
              </p>
            </div>
          )}

          {visibleLetters.map((letter, idx) => (
            <section
              key={letter}
              id={`letter-${letter}`}
              className={`${idx === 0 ? '' : 'pt-16'} scroll-mt-40`}
            >
              <MistChapter
                numeral={toRoman(idx + 1)}
                label={`letter ${letter.toLowerCase()}`}
                title={
                  <>
                    under <ChapterEm>{letter.toLowerCase()}.</ChapterEm>
                  </>
                }
                blurb={`${grouped[letter].length} entr${
                  grouped[letter].length === 1 ? 'y' : 'ies'
                } kept here; read gently.`}
              />

              <ol>
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

        <MistColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · fezcode</span>
              <span>
                lexicon · {entries.length} definitions, kept while waking
              </span>
            </>
          }
        />
      </div>
    </div>
  );
};

export default MistVocabPage;
