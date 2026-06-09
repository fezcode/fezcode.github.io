import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../../components/Seo';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { commands as commandsData } from '../../data/commands';
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

const Kbd = ({ children }) => (
  <kbd className="px-1.5 py-0.5 rounded-md bg-white/60 shadow-[0_2px_8px_rgba(60,72,69,0.12)] text-[#5C6B67]">
    {children}
  </kbd>
);

/* ----------------------------------------------------------------
 * A single command — a verb half-heard through the fog. Hover and it
 * dissolves into focus; click and the codex obliges.
 * ---------------------------------------------------------------- */
const CommandRow = ({ command, onInvoke, defIndex }) => (
  <li
    className="group relative py-4 px-5 pl-[58px] rounded-2xl border-b border-[#3C4845]/10 hover:bg-white/40 hover:backdrop-blur-sm transition-colors duration-[250ms] cursor-pointer"
    onClick={() => onInvoke(command.commandId)}
  >
    <span
      aria-hidden="true"
      className="absolute left-5 top-[20px] font-ibm-plex-mono text-[10.5px] tracking-[0.1em] lowercase text-[#5F837B]"
    >
      {String(defIndex).padStart(2, '0')}
    </span>
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-4">
      <div>
        <h4 className="font-instr-serif font-normal text-[19px] leading-[1.3] tracking-[-0.01em] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
          {command.title}
        </h4>
        {command.description && (
          <p className="mt-1 font-outfit font-light text-[13.5px] leading-[1.5] text-[#5C6B67]">
            {command.description}
          </p>
        )}
      </div>
      <span className="font-ibm-plex-mono text-[9.5px] tracking-[0.2em] lowercase text-[#8A9894] group-hover:text-[#5F837B] transition-colors duration-[250ms] whitespace-nowrap">
        invoke →
      </span>
    </div>
  </li>
);

const MistCommandsPage = () => {
  const { togglePalette, triggerCommand } = useCommandPalette();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePalette();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePalette]);

  const filtered = useMemo(() => {
    if (!query) return commandsData;
    const q = query.toLowerCase();
    return commandsData
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (cmd) =>
            cmd.title.toLowerCase().includes(q) ||
            (cmd.description || '').toLowerCase().includes(q) ||
            cat.category.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.items.length);
  }, [query]);

  const total = commandsData.reduce((n, c) => n + c.items.length, 0);

  // Global running definition index across categories, rendered alongside.
  let defCounter = 0;

  return (
    <div
      className="min-h-screen relative text-[#3C4845] font-outfit selection:bg-[#8FA8BC]/30 selection:text-[#3C4845]"
      style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
    >
      <Seo
        title="Commands | Fezcodex"
        description="A dictionary of verbs — everything the codex knows how to do."
      />
      <MistVeil />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-14 pb-[120px]">
        <MistStrip
          left="drift ix · commands"
          center="a list of verbs, half-remembered"
          right={`${total} defined`}
        />

        {/* headword */}
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
                <span>drift entry · ix</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.06 }}
                className="font-instr-serif font-normal text-[72px] md:text-[120px] leading-[0.92] tracking-[-0.02em] text-[#3C4845]"
              >
                command, <em className="italic text-[#5F837B]">whispered.</em>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.12 }}
                className="mt-4 font-ibm-plex-mono text-[11px] tracking-[0.18em] lowercase text-[#8A9894]"
              >
                /kəˈmɑːnd/ · also: invoke · summon · run
              </motion.div>
            </div>
            <motion.aside
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.18 }}
              className="flex flex-col gap-6"
            >
              <p className="font-instr-serif text-[20px] leading-[1.45] text-[#3C4845] max-w-[36ch]">
                every verb is a{' '}
                <em className="italic text-[#5F837B]">door left ajar</em>. pick
                one, or ask softly with{' '}
                <span className="font-ibm-plex-mono text-[13px] not-italic inline-flex gap-1 align-baseline">
                  <Kbd>⌘</Kbd>
                  <Kbd>k</Kbd>
                </span>
                .
              </p>
              <MistHorizon />
              <div className="grid grid-cols-2 gap-5">
                <MistSpec label="definitions" value={`${total}`} />
                <MistSpec label="categories" value={`${commandsData.length}`} />
                <MistSpec label="invocation" value="⌘ / ctrl + k" />
                <MistSpec label="part of speech" value="verb" />
              </div>
              <button
                type="button"
                onClick={togglePalette}
                className="mt-1 inline-flex items-center justify-between gap-3 rounded-2xl bg-white/50 backdrop-blur-sm shadow-[0_18px_50px_rgba(60,72,69,0.10)] px-5 py-3 text-[#3C4845] hover:text-[#5F837B] transition-colors duration-[250ms] group"
              >
                <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase">
                  open the palette
                </span>
                <span className="font-instr-serif italic text-[15px] group-hover:translate-x-1 transition-transform duration-[250ms]">
                  →
                </span>
              </button>
            </motion.aside>
          </div>
        </section>

        {/* search */}
        <section>
          <MistHorizon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search the fog…"
            className="w-full bg-transparent border-none focus:outline-none py-5 font-instr-serif italic text-[20px] md:text-[22px] text-[#3C4845] placeholder:text-[#8A9894]/70"
          />
          <MistHorizon />
        </section>

        {/* categories as drifts */}
        <section className="pt-16">
          {filtered.length === 0 && (
            <div className="py-24 flex flex-col items-center gap-6 text-center">
              <MistOrb size={64} />
              <p className="font-instr-serif italic text-[22px] text-[#5C6B67]">
                nothing surfaces — the fog keeps that one.
              </p>
            </div>
          )}

          {filtered.map((cat, catIdx) => (
            <motion.section
              key={cat.category}
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: Math.min(catIdx, 4) * 0.06 }}
              className={catIdx === 0 ? '' : 'pt-16'}
            >
              <MistChapter
                numeral={toRoman(catIdx + 1)}
                label={cat.category.toLowerCase()}
                title={
                  <>
                    <ChapterEm>
                      {cat.category.split(' ')[0].toLowerCase()}
                    </ChapterEm>
                    {cat.category.split(' ').slice(1).length
                      ? ` ${cat.category
                          .split(' ')
                          .slice(1)
                          .join(' ')
                          .toLowerCase()}`
                      : ''}
                    .
                  </>
                }
                blurb={`${cat.items.length} verb${
                  cat.items.length === 1 ? '' : 's'
                } resting under this heading.`}
              />
              <ol>
                {cat.items.map((cmd) => {
                  defCounter += 1;
                  return (
                    <CommandRow
                      key={cmd.commandId}
                      command={cmd}
                      defIndex={defCounter}
                      onInvoke={triggerCommand}
                    />
                  );
                })}
              </ol>
            </motion.section>
          ))}
        </section>

        <div className="mt-20">
          <MistHorizon />
          <div className="pt-10 flex flex-col md:flex-row items-baseline gap-4 justify-between">
            <div className="font-instr-serif italic text-[18px] text-[#5C6B67]">
              not sure which one? let the palette listen for it.
            </div>
            <Link
              to="/"
              className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
            >
              ← back to the codex
            </Link>
          </div>
        </div>

        <MistColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · fezcode</span>
              <span className="inline-flex items-center gap-2">
                commands ·{' '}
                <span className="inline-flex gap-1">
                  <Kbd>⌘</Kbd>
                  <Kbd>k</Kbd>
                </span>
              </span>
            </>
          }
        />
      </div>
    </div>
  );
};

export default MistCommandsPage;
