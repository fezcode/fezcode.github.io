import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CommandIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { commands as commandsData } from '../../data/commands';
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

/* ----------------------------------------------------------------
 * A single command — rendered as a numbered dictionary definition.
 *   1 · view source on github
 *       see source code of fezcodex on github      ⌘K
 * ---------------------------------------------------------------- */
const CommandRow = ({ command, onInvoke, defIndex }) => (
  <li
    className="group relative py-4 px-5 pl-[58px] border-b border-dashed border-[#1A161320] hover:bg-[#E8DECE]/35 transition-colors cursor-pointer"
    onClick={() => onInvoke(command.commandId)}
  >
    <span
      aria-hidden="true"
      className="absolute left-5 top-[19px] font-ibm-plex-mono text-[11px] tracking-[0.08em] text-[#9E4A2F]"
    >
      {String(defIndex).padStart(2, '0')}
    </span>
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-4">
      <div>
        <h4
          className="font-fraunces text-[17px] leading-[1.35] text-[#1A1613] tracking-[-0.01em] group-hover:text-[#9E4A2F] transition-colors"
          style={{
            fontVariationSettings:
              '"opsz" 18, "SOFT" 30, "WONK" 0, "wght" 440',
          }}
        >
          {command.title}
        </h4>
        {command.description && (
          <p
            className="mt-1 font-fraunces italic text-[14px] leading-[1.45] text-[#2E2620]"
            style={{
              fontVariationSettings:
                '"opsz" 18, "SOFT" 100, "wght" 360',
            }}
          >
            {command.description}
          </p>
        )}
      </div>
      <span className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#9E4A2F]/80 group-hover:text-[#C96442] whitespace-nowrap">
        invoke →
      </span>
    </div>
  </li>
);

const TerracottaCommandsPage = () => {
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
      className="min-h-screen relative text-[#1A1613] font-fraunces selection:bg-[#C96442]/25"
      style={{
        background: '#F3ECE0',
        backgroundImage: PAPER_GRADIENT,
        fontFeatureSettings: '"ss01", "ss02", "kern"',
      }}
    >
      <Seo
        title="Commands | Fezcodex"
        description="A dictionary of verbs — everything the codex knows how to do."
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.32] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <div className="relative z-10 mx-auto max-w-[1080px] px-6 md:px-14 pb-[120px]">
        <TerracottaStrip
          left="Folio IX · commands"
          center="A list of verbs. A list of doors."
          right={`${total} defined`}
        />

        {/* dictionary headword */}
        <section className="pt-20 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F] mb-6 flex items-center gap-3">
                <CommandIcon size={14} weight="regular" />
                <span>Codex entry · §</span>
                <span aria-hidden="true" className="h-px flex-1 max-w-[60px] bg-[#9E4A2F]/50" />
                <span>IX</span>
              </div>
              <div className="flex items-baseline gap-5 flex-wrap">
                <h1
                  className="font-fraunces text-[72px] md:text-[128px] leading-[0.86] tracking-[-0.035em] text-[#1A1613]"
                  style={{
                    fontVariationSettings:
                      '"opsz" 144, "SOFT" 40, "WONK" 1, "wght" 460',
                  }}
                >
                  command
                </h1>
                <sup className="font-ibm-plex-mono text-[18px] tracking-[0.12em] uppercase text-[#9E4A2F] -translate-y-4">
                  v.
                </sup>
              </div>
              <div
                className="mt-3 font-fraunces italic text-[22px] text-[#2E2620]"
                style={{
                  fontVariationSettings:
                    '"opsz" 28, "SOFT" 100, "wght" 360',
                }}
              >
                /kəˈmɑːnd/ · also: invoke · summon · run
              </div>
            </div>
            <aside className="flex flex-col gap-5 lg:border-l border-[#1A161320] lg:pl-10">
              <p
                className="font-fraunces italic text-[19px] leading-[1.4] text-[#1A1613] max-w-[36ch]"
                style={{
                  fontVariationSettings:
                    '"opsz" 48, "SOFT" 100, "WONK" 0, "wght" 380',
                }}
              >
                Every definition is a{' '}
                <span
                  className="not-italic text-[#9E4A2F]"
                  style={{
                    fontStyle: 'normal',
                    fontVariationSettings: '"wght" 560',
                  }}
                >
                  door
                </span>
                . Pick one, or ask with{' '}
                <span className="font-ibm-plex-mono text-[14px] not-italic inline-flex gap-1 align-baseline">
                  <kbd className="px-1.5 py-0.5 border border-[#1A161320]">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 border border-[#1A161320]">K</kbd>
                </span>
                .
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1A161320]">
                <TerracottaSpec label="Definitions" value={`${total}`} />
                <TerracottaSpec
                  label="Categories"
                  value={`${commandsData.length}`}
                />
                <TerracottaSpec label="Invocation" value="⌘/Ctrl + K" />
                <TerracottaSpec label="Part of speech" value="Verb" />
              </div>
              <button
                type="button"
                onClick={togglePalette}
                className="mt-2 inline-flex items-center justify-between gap-3 bg-[#1A1613] text-[#F3ECE0] px-5 py-3 hover:bg-[#C96442] transition-colors group"
              >
                <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase">
                  Open palette
                </span>
                <span className="font-fraunces italic text-[15px] group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </aside>
          </div>
        </section>

        {/* search */}
        <section className="py-6 border-y border-[#1A161320]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the lexicon…"
            className="w-full bg-transparent border-none focus:outline-none py-2 font-fraunces italic text-[20px] md:text-[22px] text-[#1A1613] placeholder:text-[#2E2620]/35"
            style={{
              fontVariationSettings:
                '"opsz" 32, "SOFT" 100, "WONK" 0, "wght" 360',
            }}
          />
        </section>

        {/* categories as Plumb parts-of-speech */}
        <section className="pt-16">
          {filtered.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-fraunces italic text-[22px] text-[#2E2620]/60">
                No entry matches.
              </p>
            </div>
          )}

          {filtered.map((cat, catIdx) => (
            <motion.section
              key={cat.category}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(catIdx, 4) * 0.05 }}
              className={catIdx === 0 ? '' : 'pt-16'}
            >
              <TerracottaChapter
                numeral={String(catIdx + 1)}
                label={cat.category}
                title={
                  <>
                    <ChapterEm>{cat.category.split(' ')[0].toLowerCase()}</ChapterEm>
                    {cat.category.split(' ').slice(1).length
                      ? ` ${cat.category.split(' ').slice(1).join(' ').toLowerCase()}`
                      : ''}
                    .
                  </>
                }
                blurb={`${cat.items.length} definition${cat.items.length === 1 ? '' : 's'} under this heading.`}
              />
              <ol className="border-t border-[#1A161320]">
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

        <div className="mt-20 pt-10 border-t border-[#1A161320] flex flex-col md:flex-row items-baseline gap-4 justify-between">
          <div className="font-fraunces italic text-[18px] text-[#2E2620]"
            style={{ fontVariationSettings: '"opsz" 24, "SOFT" 100, "wght" 380' }}
          >
            Not sure which one? Let the palette find it.
          </div>
          <Link
            to="/"
            className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#9E4A2F] hover:text-[#C96442]"
          >
            ← Back to the codex
          </Link>
        </div>

        <TerracottaColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · Fezcode</span>
              <span>
                Commands ·{' '}
                <span className="inline-flex gap-1">
                  <kbd className="px-1 border border-[#1A161320]">⌘</kbd>
                  <kbd className="px-1 border border-[#1A161320]">K</kbd>
                </span>
              </span>
            </>
          }
        />

        {/* subtle mark in the corner */}
        <div className="fixed bottom-6 right-6 opacity-40 pointer-events-none z-20 hidden md:block">
          <TerracottaMark size={18} color="#C96442" />
        </div>
      </div>
    </div>
  );
};

export default TerracottaCommandsPage;
