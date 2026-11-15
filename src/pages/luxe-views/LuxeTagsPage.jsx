import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';

// Emphasis by usage: sizeFor() returns 1..4.
const SIZE_CLASS = {
  1: 'text-lg md:text-xl text-[#1A1A1A]/60',
  2: 'text-xl md:text-2xl text-[#1A1A1A]/75',
  3: 'text-2xl md:text-3xl text-[#1A1A1A]/90',
  4: 'text-3xl md:text-4xl text-[#1A1A1A]',
};

const pill = (active) =>
  `px-4 py-2 rounded-full font-outfit text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
    active
      ? 'bg-[#1A1A1A] text-white shadow-lg shadow-black/10'
      : 'border border-[#1A1A1A]/10 hover:border-[#1A1A1A] text-[#1A1A1A]/60'
  }`;

const toggle = (active) =>
  `px-3 py-1.5 rounded-full font-outfit text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${
    active
      ? 'bg-[#1A1A1A] text-white shadow-md'
      : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]'
  }`;

/** LUXE /tags: an editorial index of every tag. */
export default function LuxeTagsPage({ view }) {
  const noMatches =
    view.status === 'ready' && view.shared.length + view.single.length === 0;

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20">
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />

      <main className="max-w-[1400px] mx-auto px-6 md:px-12">
        <header className="mb-16 pt-12 border-b border-[#1A1A1A]/10 pb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] transition-colors"
          >
            <ArrowLeftIcon aria-hidden="true" /> Home
          </Link>
          <span className="block font-outfit text-[10px] uppercase tracking-[0.3em] text-[#8D4004] mb-4">
            Index
          </span>
          <h1 className="font-playfairDisplay text-6xl sm:text-7xl md:text-9xl text-[#1A1A1A] mb-6">
            Tags
          </h1>
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-8">
            <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed">
              {view.status === 'ready' ? (
                <>
                  <span className="font-playfairDisplay italic text-lg text-[#1A1A1A]">
                    {view.totalTags}
                  </span>{' '}
                  tags across{' '}
                  <span className="font-playfairDisplay italic text-lg text-[#1A1A1A]">
                    {view.totalItems}
                  </span>{' '}
                  posts, logs and projects. Pick one to see everything filed
                  under it.
                </>
              ) : (
                'A catalogue of every subject filed across the codex.'
              )}
            </p>

            <label className="relative group border-b border-[#1A1A1A]/20 focus-within:border-[#1A1A1A] transition-colors w-full md:w-auto md:min-w-[300px]">
              <span className="sr-only">Search tags</span>
              <input
                type="search"
                value={view.query}
                onChange={(event) => view.setQuery(event.target.value)}
                placeholder="Search tags..."
                className="w-full bg-transparent py-2 pr-6 outline-none font-outfit text-sm placeholder-[#1A1A1A]/30"
              />
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                  className={pill(view.type === t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div
              className="flex self-start lg:self-auto bg-white rounded-full p-1 border border-[#1A1A1A]/5 shadow-sm"
              role="group"
              aria-label="Sort tags"
            >
              <button
                type="button"
                aria-pressed={view.sort === 'count'}
                onClick={() => view.setSort('count')}
                className={toggle(view.sort === 'count')}
              >
                Most used
              </button>
              <button
                type="button"
                aria-pressed={view.sort === 'az'}
                onClick={() => view.setSort('az')}
                className={toggle(view.sort === 'az')}
              >
                A–Z
              </button>
            </div>
          </div>
        </header>

        {view.status === 'error' && (
          <div className="py-32 text-center">
            <p className="font-playfairDisplay italic text-2xl text-[#1A1A1A]/40">
              {view.error}
            </p>
          </div>
        )}
        {view.status === 'loading' && (
          <div className="py-32 text-center font-outfit text-[#1A1A1A]/40 text-xs uppercase tracking-[0.2em] animate-pulse">
            Loading Tags...
          </div>
        )}
        {noMatches && (
          <div className="py-32 text-center">
            <p className="font-playfairDisplay italic text-2xl text-[#1A1A1A]/40 break-words">
              No tags match “{view.query}”
            </p>
          </div>
        )}

        {view.shared.length > 0 && (
          <ul
            className="flex flex-wrap items-baseline gap-x-6 gap-y-4 md:gap-x-10 md:gap-y-6 animate-fade-in"
            aria-label="Tags"
          >
            {view.shared.map((tag) => (
              <li key={tag.slug} className="min-w-0">
                <Link
                  to={view.hrefFor(tag)}
                  className={`group inline-flex items-baseline gap-1.5 font-playfairDisplay leading-tight break-words hover:italic hover:text-[#8D4004] transition-all ${
                    SIZE_CLASS[view.sizeFor(tag.shown)] || SIZE_CLASS[1]
                  }`}
                >
                  {tag.label}
                  <sup className="font-outfit not-italic text-[10px] tracking-widest text-[#1A1A1A]/30 group-hover:text-[#8D4004] transition-colors">
                    {tag.shown}
                  </sup>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {view.single.length > 0 && (
          <details className="mt-20 border-t border-[#1A1A1A]/10 pt-8 group">
            <summary className="cursor-pointer font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/50 hover:text-[#8D4004] transition-colors">
              Used once ({view.single.length})
            </summary>
            <ul className="mt-8 flex flex-wrap gap-2">
              {view.single.map((tag) => (
                <li key={tag.slug} className="min-w-0">
                  <Link
                    to={tagPath(tag.slug)}
                    className="inline-block bg-[#EBEBEB] px-3 py-1 rounded-sm font-outfit text-xs text-[#1A1A1A]/60 hover:text-[#8D4004] transition-colors break-words"
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
