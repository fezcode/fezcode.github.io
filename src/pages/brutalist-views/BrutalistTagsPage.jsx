import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  MagnifyingGlass,
  XCircle,
  Funnel,
  Hash,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';

// Square marker per content type, echoing the theme's accent palette.
const TYPE_DOT = {
  post: 'bg-emerald-500',
  log: 'bg-amber-500',
  project: 'bg-sky-500',
};

// Emphasis steps for view.sizeFor(count) -> 1..4.
const SIZE_CLASS = {
  1: 'text-[10px] px-3 py-1.5 text-gray-400 border-white/10 bg-white/[0.03]',
  2: 'text-xs px-3 py-1.5 text-gray-200 border-white/15 bg-white/5',
  3: 'text-sm px-4 py-2 font-bold text-white border-white/25 bg-white/5',
  4: 'text-base md:text-lg px-4 py-2 font-black text-white border-emerald-500/40 bg-emerald-500/10',
};

const toggleClass = (on) =>
  `inline-flex items-center gap-2 rounded-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
    on
      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
      : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 border border-white/5'
  }`;

/** BRUTALIST /tags. */
export default function BrutalistTagsPage({ view }) {
  const noMatches =
    view.status === 'ready' && view.shared.length + view.single.length === 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-24 md:px-12">
        {/* Header */}
        <header className="mb-16 md:mb-20">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft weight="bold" />
            <span>Home</span>
          </Link>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none">
            TAGS
          </h1>
          {view.status === 'ready' && (
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-gray-400 font-mono text-[10px] sm:text-xs uppercase tracking-widest">
              <span>
                Total Tags: <span className="text-white">{view.totalTags}</span>
              </span>
              <span>
                Indexed Entries:{' '}
                <span className="text-white">{view.totalItems}</span>
              </span>
            </div>
          )}
          <p className="mt-4 text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em]">
            {'//'} POSTS, LOGS & PROJECTS. PICK ONE TO SEE EVERYTHING FILED
            UNDER IT.
          </p>
        </header>

        {/* Controls */}
        <div className="sticky top-0 z-30 bg-[#050505]/95 backdrop-blur-sm border-b border-white/10 pb-6 pt-2 mb-12 space-y-6">
          <label className="relative group block w-full">
            <span className="sr-only">Search tags</span>
            <span className="flex items-center gap-3 border-b border-gray-800 focus-within:border-emerald-500 transition-colors">
              <MagnifyingGlass
                size={20}
                className="shrink-0 text-gray-600 group-focus-within:text-emerald-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={view.query}
                onChange={(event) => view.setQuery(event.target.value)}
                placeholder="Search tags..."
                className="w-full min-w-0 bg-transparent text-xl md:text-2xl font-light font-mono text-white placeholder-gray-700 focus:outline-none py-2"
              />
              {view.query && (
                <button
                  type="button"
                  onClick={() => view.setQuery('')}
                  aria-label="Clear search"
                  className="shrink-0 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <XCircle size={20} weight="fill" />
                </button>
              )}
            </span>
          </label>

          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 mr-2 text-gray-600 font-mono text-xs uppercase tracking-widest">
                <Funnel size={14} weight="fill" aria-hidden="true" />
                <span>Type</span>
              </span>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Content type"
              >
                {view.types.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    aria-pressed={view.type === t.key}
                    onClick={() => view.setType(t.key)}
                    className={toggleClass(view.type === t.key)}
                  >
                    {t.key !== 'all' && (
                      <i
                        className={`inline-block h-2 w-2 ${TYPE_DOT[t.key] || 'bg-white'}`}
                        aria-hidden="true"
                      />
                    )}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
              <span className="mr-2 text-gray-600 font-mono text-xs uppercase tracking-widest">
                Sort
              </span>
              <div
                className="flex bg-white/5 p-1 rounded-sm border border-white/10"
                role="group"
                aria-label="Sort tags"
              >
                <button
                  type="button"
                  aria-pressed={view.sort === 'count'}
                  onClick={() => view.setSort('count')}
                  className={`px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${
                    view.sort === 'count'
                      ? 'bg-white text-black'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  Most used
                </button>
                <button
                  type="button"
                  aria-pressed={view.sort === 'az'}
                  onClick={() => view.setSort('az')}
                  className={`px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${
                    view.sort === 'az'
                      ? 'bg-white text-black'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  A–Z
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* States */}
        {view.status === 'error' && (
          <div className="py-12 px-4 text-center border border-dashed border-red-500/30 rounded-sm">
            <p className="font-mono text-xs text-red-400 uppercase tracking-widest break-words">
              {'//'} ERROR: {view.error}
            </p>
          </div>
        )}
        {view.status === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-20" role="status">
            <div className="h-px w-24 bg-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-400 animate-progress origin-left" />
            </div>
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.3em]">
              Loading_Tags
            </span>
          </div>
        )}
        {noMatches && (
          <div className="py-12 px-4 text-center border border-dashed border-white/10 rounded-sm">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest break-words">
              No tags match “{view.query}”
            </p>
          </div>
        )}

        {/* Shared tags */}
        {view.shared.length > 0 && (
          <ul
            className="flex flex-wrap items-center gap-2 pb-16"
            aria-label="Tags"
          >
            {view.shared.map((tag) => {
              const size = view.sizeFor(tag.shown);
              return (
                <li key={tag.slug} className="max-w-full">
                  <Link
                    to={view.hrefFor(tag)}
                    className={`group inline-flex max-w-full items-center gap-2 rounded-sm border font-mono uppercase tracking-widest transition-colors hover:text-black hover:bg-emerald-500 hover:border-emerald-500 ${SIZE_CLASS[size] || SIZE_CLASS[1]}`}
                  >
                    <Hash
                      size={size >= 3 ? 14 : 10}
                      aria-hidden="true"
                      className="shrink-0"
                    />
                    <span className="break-all">{tag.label}</span>
                    <span className="shrink-0 border-l border-white/20 group-hover:border-black/30 pl-2 text-[10px] font-bold text-gray-500 group-hover:text-black">
                      {tag.shown}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Long tail */}
        {view.single.length > 0 && (
          <details className="group border-t border-white/10 pt-8 pb-32">
            <summary className="cursor-pointer list-none inline-flex items-center gap-3 font-mono text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors focus:outline-none focus-visible:text-emerald-400">
              <span
                className="inline-block transition-transform group-open:rotate-90 text-emerald-500"
                aria-hidden="true"
              >
                ▸
              </span>
              Used once ({view.single.length})
            </summary>
            <ul className="mt-6 flex flex-wrap gap-2">
              {view.single.map((tag) => (
                <li key={tag.slug} className="max-w-full">
                  <Link
                    to={tagPath(tag.slug)}
                    className="inline-flex max-w-full items-center px-2 py-1 rounded-sm border border-white/5 bg-white/[0.02] font-mono text-[9px] uppercase tracking-wider text-gray-500 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors break-all"
                  >
                    #{tag.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}
      </main>
    </div>
  );
}
