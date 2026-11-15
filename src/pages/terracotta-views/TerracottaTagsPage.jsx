import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
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

// Terra for posts, brass for logs, sage for projects — the theme palette.
const TYPE_COLOR = {
  all: '#1A1613',
  post: '#9E4A2F',
  log: '#B88532',
  project: '#6B8E23',
};

// Emphasis steps 1..4: the headword grows, darkens and gains weight.
const SIZE_CLASS = {
  1: 'text-[15px] md:text-[16px] text-[#2E2620]',
  2: 'text-[18px] md:text-[20px] text-[#1A1613]',
  3: 'text-[22px] md:text-[26px] text-[#1A1613]',
  4: 'text-[26px] md:text-[34px] text-[#9E4A2F]',
};
const SIZE_WEIGHT = { 1: 380, 2: 420, 3: 460, 4: 500 };

const toggleClass = (on) =>
  `inline-flex items-center gap-1.5 font-ibm-plex-mono text-[9.5px] tracking-[0.18em] uppercase px-2 py-1 border transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C96442] ${
    on
      ? 'border-[#1A1613] bg-[#1A1613] text-[#F3ECE0]'
      : 'border-[#1A161320] text-[#2E2620] hover:border-[#C96442] hover:text-[#9E4A2F]'
  }`;

const Dot = ({ color }) => (
  <span
    aria-hidden="true"
    className="inline-block w-[5px] h-[5px] rounded-full shrink-0"
    style={{ backgroundColor: color }}
  />
);

const Notice = ({ children }) => (
  <div className="py-24 text-center">
    <p className="font-fraunces italic text-[22px] text-[#2E2620]/60">
      {children}
    </p>
  </div>
);

/** Terracotta /tags: the codex index, a folio of headwords. */
export default function TerracottaTagsPage({ view }) {
  const ready = view.status === 'ready';
  const shown = view.shared.length + view.single.length;

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
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.32] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <main className="relative z-10 mx-auto max-w-[1080px] px-5 sm:px-6 md:px-14 pb-[120px]">
        <TerracottaStrip
          left="Folio IX · index"
          center="Every thread in the archive"
          right={ready ? `${shown} of ${view.totalTags}` : '—'}
        />

        {/* hero */}
        <section className="pt-16 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F] mb-6 flex items-center gap-3">
                <span>Codex entry · §</span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 max-w-[60px] bg-[#9E4A2F]/50"
                />
                <span>IX</span>
              </div>
              <h1
                className="font-fraunces text-[72px] md:text-[128px] leading-[0.86] tracking-[-0.035em] text-[#1A1613]"
                style={{
                  fontVariationSettings:
                    '"opsz" 144, "SOFT" 30, "WONK" 1, "wght" 460',
                }}
              >
                <ChapterEm>tags</ChapterEm>
                <span
                  aria-hidden="true"
                  className="text-[#C96442]"
                  style={{ fontVariationSettings: '"wght" 800' }}
                >
                  .
                </span>
              </h1>
            </div>
            <aside className="flex flex-col gap-5 md:border-l border-[#1A161320] md:pl-10">
              {ready ? (
                <p
                  className="font-fraunces italic text-[19px] leading-[1.4] text-[#1A1613] max-w-[36ch]"
                  style={{
                    fontVariationSettings:
                      '"opsz" 48, "SOFT" 100, "WONK" 0, "wght" 380',
                  }}
                >
                  <span
                    className="text-[#9E4A2F]"
                    style={{
                      fontStyle: 'normal',
                      fontVariationSettings: '"wght" 560',
                    }}
                  >
                    {view.totalTags} tags
                  </span>{' '}
                  across {view.totalItems} posts, logs and projects. Pick one to
                  see everything filed under it.
                </p>
              ) : (
                <p className="font-fraunces italic text-[19px] leading-[1.4] text-[#2E2620]/60">
                  The index is being drawn up.
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1A161320]">
                <TerracottaSpec
                  label="Tags"
                  value={ready ? `${view.totalTags}` : '—'}
                />
                <TerracottaSpec
                  label="Entries"
                  value={ready ? `${view.totalItems}` : '—'}
                />
                <TerracottaSpec
                  label="Sort"
                  value={view.sort === 'az' ? 'A–Z' : 'Most used'}
                />
                <TerracottaSpec
                  label="Showing"
                  value={
                    view.types.find((t) => t.key === view.type)?.label || 'All'
                  }
                />
              </div>
            </aside>
          </div>
        </section>

        {/* search + filters */}
        <section className="sticky top-0 z-30 py-4 bg-[#F3ECE0]/90 backdrop-blur-md border-y border-[#1A161320]">
          <label className="block">
            <span className="sr-only">Search tags</span>
            <input
              type="search"
              value={view.query}
              onChange={(event) => view.setQuery(event.target.value)}
              placeholder="Search the index…"
              className="w-full bg-transparent border-none focus:outline-none py-1.5 font-fraunces italic text-[20px] md:text-[22px] text-[#1A1613] placeholder:text-[#2E2620]/35"
              style={{
                fontVariationSettings:
                  '"opsz" 32, "SOFT" 100, "WONK" 0, "wght" 360',
              }}
            />
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="flex items-center gap-1.5 flex-wrap"
              role="group"
              aria-label="Content type"
            >
              <span className="mr-1 font-ibm-plex-mono text-[10px] tracking-[0.2em] uppercase text-[#2E2620]/60">
                Type
              </span>
              {view.types.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={view.type === t.key}
                  onClick={() => view.setType(t.key)}
                  className={toggleClass(view.type === t.key)}
                >
                  {t.key !== 'all' && <Dot color={TYPE_COLOR[t.key]} />}
                  {t.label}
                </button>
              ))}
            </div>
            <div
              className="flex items-center gap-1.5 flex-wrap"
              role="group"
              aria-label="Sort tags"
            >
              <span className="mr-1 font-ibm-plex-mono text-[10px] tracking-[0.2em] uppercase text-[#2E2620]/60">
                Sort
              </span>
              <button
                type="button"
                aria-pressed={view.sort === 'count'}
                onClick={() => view.setSort('count')}
                className={toggleClass(view.sort === 'count')}
              >
                Most used
              </button>
              <button
                type="button"
                aria-pressed={view.sort === 'az'}
                onClick={() => view.setSort('az')}
                className={toggleClass(view.sort === 'az')}
              >
                A–Z
              </button>
            </div>
          </div>
        </section>

        {/* the index */}
        <section className="pt-16">
          <TerracottaChapter
            numeral="I"
            label="The index"
            title={
              <>
                Threads, <ChapterEm>by weight.</ChapterEm>
              </>
            }
            blurb="The heavier the headword, the more entries carry it. The figure beside each is its tally."
          />

          {view.status === 'error' && <Notice>{view.error}</Notice>}
          {view.status === 'loading' && (
            <div className="py-24 flex flex-col items-center gap-5">
              <TerracottaMark size={44} color="#C96442" sway />
              <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.32em] uppercase text-[#2E2620]/80">
                Loading tags…
              </span>
            </div>
          )}
          {ready && shown === 0 && (
            <Notice>No tags match “{view.query}”.</Notice>
          )}

          {view.shared.length > 0 && (
            <ul
              className="flex flex-wrap items-baseline gap-x-6 gap-y-3 md:gap-x-8 md:gap-y-4 pt-8 border-t border-[#1A161320]"
              aria-label="Tags"
            >
              {view.shared.map((tag) => {
                const size = view.sizeFor(tag.shown);
                return (
                  <li key={tag.slug} className="min-w-0">
                    <Link
                      to={view.hrefFor(tag)}
                      className={`group inline-flex items-baseline gap-1.5 max-w-full break-words font-fraunces leading-[1.1] tracking-[-0.01em] border-b border-transparent hover:border-[#C96442] hover:text-[#9E4A2F] focus:outline-none focus-visible:border-[#C96442] transition-colors ${SIZE_CLASS[size]}`}
                      style={{
                        fontVariationSettings: `"opsz" 36, "SOFT" 60, "WONK" 1, "wght" ${SIZE_WEIGHT[size]}`,
                      }}
                    >
                      <span className="min-w-0 break-words">{tag.label}</span>
                      <sup className="font-ibm-plex-mono text-[9.5px] tracking-[0.14em] text-[#2E2620]/60 group-hover:text-[#9E4A2F] transition-colors">
                        {tag.shown}
                      </sup>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {view.single.length > 0 && (
            <details className="group/tail mt-14 border-t border-dashed border-[#1A161320]">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 py-5 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#2E2620] hover:text-[#9E4A2F] transition-colors focus:outline-none focus-visible:text-[#9E4A2F]">
                <span>Used once ({view.single.length})</span>
                <span
                  aria-hidden="true"
                  className="text-[#9E4A2F] transition-transform group-open/tail:rotate-90"
                >
                  →
                </span>
              </summary>
              <ul className="flex flex-wrap gap-1.5 pb-4">
                {view.single.map((tag) => (
                  <li key={tag.slug} className="min-w-0">
                    <Link
                      to={tagPath(tag.slug)}
                      className="inline-block max-w-full break-words font-ibm-plex-mono text-[9.5px] tracking-[0.14em] uppercase px-1.5 py-0.5 border border-[#1A161320] text-[#2E2620] hover:border-[#9E4A2F] hover:text-[#9E4A2F] transition-colors"
                    >
                      #{tag.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>

        <TerracottaColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · Fezcode</span>
              <span>Index · {view.totalTags} tags</span>
            </>
          }
        />
      </main>

      <div className="fixed bottom-6 right-6 opacity-40 pointer-events-none z-20 hidden md:block">
        <TerracottaMark size={18} color="#C96442" />
      </div>
    </div>
  );
}
