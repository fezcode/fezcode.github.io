import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, XCircle } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';

// Columns of the wall, in order. `plural` matches the tag fields from the index.
const COUNT_COLUMNS = [
  { key: 'post', plural: 'posts', head: 'POSTS', sr: 'posts' },
  { key: 'log', plural: 'logs', head: 'LOGS', sr: 'logs' },
  { key: 'project', plural: 'projects', head: 'PROJ', sr: 'projects' },
];

// Label weight for view.sizeFor(count) -> 1..4. Heavier tags shout louder.
const LABEL_SIZE = {
  1: 'text-xl sm:text-2xl md:text-3xl text-gray-300',
  2: 'text-2xl sm:text-3xl md:text-4xl text-gray-100',
  3: 'text-3xl sm:text-4xl md:text-5xl text-white',
  4: 'text-4xl sm:text-5xl md:text-6xl text-white',
};

// Row grid: number | label | posts | logs | proj | total. On phones the four
// numerals drop to their own line under the label.
const ROW_GRID =
  'grid grid-cols-[2.75rem_minmax(0,1fr)] md:grid-cols-[4.5rem_minmax(0,1fr)_repeat(4,5.5rem)] lg:grid-cols-[5rem_minmax(0,1fr)_repeat(4,6.5rem)]';

const pad = (n, width = 3) => String(n).padStart(width, '0');

// Hard toggle block: a square slab that flips to solid emerald when on.
const blockClass = (on) =>
  `min-w-0 px-3 py-3 sm:px-5 sm:py-4 font-mono text-[11px] sm:text-xs font-black uppercase tracking-widest text-left transition-colors focus:outline-none focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400 ${
    on
      ? 'bg-emerald-500 text-black'
      : 'bg-[#050505] text-gray-500 hover:bg-white hover:text-black'
  }`;

/** BRUTALIST /tags: one raw, hard-ruled wall of numbered tag rows. */
export default function BrutalistTagsPage({ view }) {
  const noMatches =
    view.status === 'ready' && view.shared.length + view.single.length === 0;

  // Longest row sets the scale for every bar.
  const maxShown = useMemo(
    () => view.shared.reduce((max, tag) => Math.max(max, tag.shown), 1),
    [view.shared],
  );
  const digits = Math.max(3, String(view.shared.length).length);
  const typeLabel = view.types.find((t) => t.key === view.type)?.label || 'All';

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-24 md:px-12">
        {/* HEADER */}
        <header className="mb-12">
          <Link
            to="/"
            className="group mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft
              weight="bold"
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Home</span>
          </Link>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b-4 border-white pb-6">
            <h1 className="text-7xl sm:text-8xl md:text-[10rem] font-black tracking-tighter leading-[0.8] text-white">
              TAGS
            </h1>
            {view.status === 'ready' && (
              <dl className="grid grid-cols-2 border-2 border-white font-mono uppercase md:min-w-[22rem]">
                <div className="border-r-2 border-white p-3 sm:p-4">
                  <dt className="text-[10px] tracking-widest text-gray-500">
                    Tags
                  </dt>
                  <dd className="text-3xl sm:text-4xl font-black text-white tabular-nums">
                    {view.totalTags}
                  </dd>
                </div>
                <div className="p-3 sm:p-4">
                  <dt className="text-[10px] tracking-widest text-gray-500">
                    Entries
                  </dt>
                  <dd className="text-3xl sm:text-4xl font-black text-emerald-400 tabular-nums">
                    {view.totalItems}
                  </dd>
                </div>
              </dl>
            )}
          </div>
          <p className="mt-4 text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em]">
            {'//'} POSTS, LOGS & PROJECTS. EVERY ROW IS A TAG. PICK ONE TO SEE
            EVERYTHING FILED UNDER IT.
          </p>
        </header>

        {/* FILTER LINE */}
        <label className="group block border-2 border-white/20 focus-within:border-emerald-500 transition-colors">
          <span className="sr-only">Filter tags</span>
          <span className="flex items-center gap-2 sm:gap-4 px-3 sm:px-5">
            <span
              className="shrink-0 font-mono text-3xl sm:text-5xl md:text-6xl font-black text-emerald-500"
              aria-hidden="true"
            >
              &gt;
            </span>
            <input
              type="search"
              value={view.query}
              onChange={(event) => view.setQuery(event.target.value)}
              placeholder="FILTER_"
              className="w-full min-w-0 bg-transparent py-3 sm:py-5 font-mono text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white placeholder-gray-800 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {view.query && (
              <button
                type="button"
                onClick={() => view.setQuery('')}
                aria-label="Clear filter"
                className="shrink-0 text-gray-500 hover:text-red-500 transition-colors focus:outline-none focus-visible:text-red-500"
              >
                <XCircle size={28} weight="fill" aria-hidden="true" />
              </button>
            )}
          </span>
        </label>

        {/* TOGGLE BLOCKS */}
        <div className="mt-[-2px] grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] border-2 border-white/20 bg-white/20 gap-[2px]">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-[2px] bg-white/20">
            <span className="flex items-center bg-[#050505] px-3 sm:px-4 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-600">
              Type
            </span>
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-[2px] bg-white/20"
              role="group"
              aria-label="Content type"
            >
              {view.types.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={view.type === t.key}
                  onClick={() => view.setType(t.key)}
                  className={blockClass(view.type === t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-[2px] bg-white/20">
            <span className="flex items-center bg-[#050505] px-3 sm:px-4 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-600">
              Sort
            </span>
            <div
              className="grid grid-cols-2 gap-[2px] bg-white/20"
              role="group"
              aria-label="Sort tags"
            >
              <button
                type="button"
                aria-pressed={view.sort === 'count'}
                onClick={() => view.setSort('count')}
                className={blockClass(view.sort === 'count')}
              >
                Count
              </button>
              <button
                type="button"
                aria-pressed={view.sort === 'az'}
                onClick={() => view.setSort('az')}
                className={blockClass(view.sort === 'az')}
              >
                A–Z
              </button>
            </div>
          </div>
        </div>

        {/* STATES */}
        {view.status === 'error' && (
          <div className="mt-12 border-2 border-red-500 p-6">
            <p className="font-mono text-xs text-red-400 uppercase tracking-widest break-words">
              {'//'} ERROR: {view.error}
            </p>
          </div>
        )}
        {view.status === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-24" role="status">
            <div className="h-px w-24 bg-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-400 animate-progress origin-left" />
            </div>
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.3em]">
              Loading_Tags
            </span>
          </div>
        )}
        {noMatches && (
          <div className="mt-12 border-2 border-dashed border-white/20 p-6">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest break-words">
              {'//'} 0 ROWS. NO TAGS MATCH “{view.query}”
            </p>
          </div>
        )}

        {/* THE WALL */}
        {view.shared.length > 0 && (
          <section className="mt-12" aria-label="Tags">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600">
              {'//'} {view.shared.length} ROWS · TYPE={typeLabel} · SORT=
              {view.sort === 'az' ? 'A–Z' : 'COUNT'}
            </p>

            {/* Column heads */}
            <div
              className={`${ROW_GRID} border-y-4 border-white bg-white text-black font-mono text-[10px] font-black uppercase tracking-widest`}
              aria-hidden="true"
            >
              <span className="px-2 py-2 md:px-3">#</span>
              <span className="px-2 py-2 md:px-3 border-l-2 border-black">
                Tag
              </span>
              {COUNT_COLUMNS.map((c) => (
                <span
                  key={c.key}
                  className={`hidden md:block px-3 py-2 border-l-2 border-black text-right ${
                    view.type === c.key ? 'bg-emerald-500' : ''
                  }`}
                >
                  {c.head}
                </span>
              ))}
              <span
                className={`hidden md:block px-3 py-2 border-l-2 border-black text-right ${
                  view.type === 'all' ? 'bg-emerald-500' : ''
                }`}
              >
                Total
              </span>
            </div>

            <ol className="border-b-2 border-white/20">
              {view.shared.map((tag, i) => {
                const size = view.sizeFor(tag.shown);
                const width = Math.max(2, (tag.shown / maxShown) * 100);
                return (
                  <li
                    key={tag.slug}
                    className="border-t-2 border-white/10 first:border-t-0"
                  >
                    <Link
                      to={view.hrefFor(tag)}
                      className={`group ${ROW_GRID} items-stretch hover:bg-white/[0.04] focus:outline-none focus-visible:bg-emerald-500/10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 transition-colors`}
                    >
                      <span className="px-2 pt-4 md:px-3 font-mono text-xs md:text-sm font-bold text-gray-600 tabular-nums group-hover:text-emerald-400 transition-colors">
                        {pad(i + 1, digits)}
                      </span>

                      <span className="min-w-0 px-2 pt-3 pb-2 md:px-3 md:pb-3 border-l-2 border-white/10">
                        <span
                          className={`block font-black uppercase tracking-tighter leading-[0.9] break-words [overflow-wrap:anywhere] group-hover:text-emerald-400 transition-colors ${
                            LABEL_SIZE[size] || LABEL_SIZE[1]
                          }`}
                        >
                          {tag.label}
                        </span>
                        <span
                          className="mt-3 block h-3 bg-white/[0.06]"
                          aria-hidden="true"
                        >
                          <span
                            className="block h-full bg-emerald-500"
                            style={{ width: `${width}%` }}
                          />
                        </span>
                      </span>

                      {/* Numerals: own 4-col strip on phones, table cells from md */}
                      <span className="col-span-2 grid grid-cols-4 border-t-2 border-white/10 md:col-span-1 md:contents">
                        {COUNT_COLUMNS.map((c) => {
                          const on = view.type === c.key;
                          const n = tag[c.plural] || 0;
                          return (
                            <span
                              key={c.key}
                              className={`flex flex-col justify-center px-2 py-2 md:px-3 md:py-0 md:items-end border-l-2 border-white/10 first:border-l-0 md:first:border-l-2 font-mono tabular-nums ${
                                on ? 'bg-emerald-500/10' : ''
                              }`}
                            >
                              <span
                                className="md:hidden text-[9px] font-bold uppercase tracking-widest text-gray-600"
                                aria-hidden="true"
                              >
                                {c.head}
                              </span>
                              <span className="sr-only">{c.sr}: </span>
                              <span
                                className={`text-xl md:text-3xl lg:text-4xl font-black ${
                                  on
                                    ? 'text-emerald-400'
                                    : n
                                      ? 'text-gray-300'
                                      : 'text-gray-800'
                                }`}
                              >
                                {n}
                              </span>
                            </span>
                          );
                        })}
                        <span
                          className={`flex flex-col justify-center px-2 py-2 md:px-3 md:py-0 md:items-end border-l-2 border-white/10 font-mono tabular-nums ${
                            view.type === 'all'
                              ? 'bg-emerald-500 text-black'
                              : 'bg-white/[0.04] text-white'
                          }`}
                        >
                          <span
                            className={`md:hidden text-[9px] font-bold uppercase tracking-widest ${
                              view.type === 'all'
                                ? 'text-black/60'
                                : 'text-gray-600'
                            }`}
                            aria-hidden="true"
                          >
                            Total
                          </span>
                          <span className="sr-only">total: </span>
                          <span className="text-xl md:text-3xl lg:text-4xl font-black">
                            {tag.count}
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* LONG TAIL */}
        {view.single.length > 0 && (
          <details className="group mt-12 border-2 border-white/20 open:border-emerald-500">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 sm:px-5 font-mono text-sm sm:text-base font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors focus:outline-none focus-visible:bg-emerald-500 focus-visible:text-black [&::-webkit-details-marker]:hidden">
              <span>
                Long tail ({view.single.length})
                <span className="ml-3 hidden sm:inline text-[10px] font-bold text-gray-500 group-hover:text-black/60">
                  {'//'} USED ONCE
                </span>
              </span>
              <span
                className="text-2xl leading-none transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="border-t-2 border-white/20 px-4 py-5 sm:px-5 font-mono text-xs sm:text-sm uppercase leading-relaxed tracking-wide text-gray-500 break-words [overflow-wrap:anywhere]">
              {view.single.map((tag, i) => (
                <React.Fragment key={tag.slug}>
                  <Link
                    to={tagPath(tag.slug)}
                    className="text-gray-300 hover:bg-emerald-500 hover:text-black focus:outline-none focus-visible:bg-emerald-500 focus-visible:text-black transition-colors"
                  >
                    {tag.label}
                  </Link>
                  {i < view.single.length - 1 && ', '}
                </React.Fragment>
              ))}
              .
            </p>
          </details>
        )}
      </main>
    </div>
  );
}
