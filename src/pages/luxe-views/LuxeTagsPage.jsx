import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { TAG_TYPES } from '../tags/tagTypes';

// Typeset weight by usage: sizeFor() returns 1..4; 0 marks a tag used once.
const RUN_CLASS = {
  0: 'text-[15px] italic text-[#1A1A1A]/45',
  1: 'text-base text-[#1A1A1A]/75',
  2: 'text-lg text-[#1A1A1A]/90',
  3: 'text-xl font-semibold text-[#1A1A1A]',
  4: 'text-2xl font-bold text-[#1A1A1A]',
};

const RANK_CLASS = {
  1: 'text-xl md:text-2xl',
  2: 'text-2xl md:text-[1.7rem]',
  3: 'text-2xl md:text-3xl',
  4: 'text-3xl md:text-4xl',
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Small-caps control: understated, an underline marks the active choice.
const smallCap = (active) =>
  `font-outfit text-[11px] uppercase tracking-[0.25em] pb-1 border-b transition-colors whitespace-nowrap ${
    active
      ? 'text-[#1A1A1A] border-[#8D4004]'
      : 'text-[#1A1A1A]/40 border-transparent hover:text-[#8D4004]'
  }`;

const letterOf = (label) => {
  const first = (label || '').trim().charAt(0);
  const folded = first.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  if (/^[A-Z]$/.test(folded)) return folded;
  if (/\p{L}/u.test(first)) return first.toUpperCase();
  return '#';
};

const anchorFor = (letter) => `tags-letter-${letter === '#' ? 'num' : letter}`;

const pad = (n) => String(n).padStart(2, '0');

const Dot = () => (
  <span aria-hidden="true" className="mx-2 text-[#1A1A1A]/20 not-italic">
    ·
  </span>
);

/** A run of tags set as flowing text in newspaper columns. */
function TagRun({ tags, view, light = false, label }) {
  return (
    <ul
      aria-label={label}
      className="columns-1 sm:columns-2 lg:columns-3 gap-x-12 [column-rule:1px_solid_rgba(26,26,26,0.08)] font-playfairDisplay leading-[2.1] text-left"
    >
      {tags.map((tag, i) => {
        const size = light || tag.shown === 1 ? 0 : view.sizeFor(tag.shown);
        return (
          <li key={tag.slug} className="inline">
            <Link
              to={view.hrefFor(tag)}
              className={`group break-words hover:italic hover:text-[#8D4004] transition-colors ${
                RUN_CLASS[size] || RUN_CLASS[1]
              }`}
            >
              {tag.label}
              <span className="ml-1 font-outfit not-italic font-normal text-[10px] tracking-widest tabular-nums text-[#1A1A1A]/35 group-hover:text-[#8D4004]">
                {tag.shown}
              </span>
            </Link>
            {i < tags.length - 1 && <Dot />}
          </li>
        );
      })}
    </ul>
  );
}

/** LUXE /tags: the A–Z index at the back of a fine magazine. */
export default function LuxeTagsPage({ view }) {
  const ready = view.status === 'ready';
  const az = view.sort === 'az';
  const noMatches = ready && view.shared.length + view.single.length === 0;

  // Every tag (shared and single) grouped under its first letter.
  const sections = useMemo(() => {
    if (!az) return [];
    const groups = new Map();
    [...view.shared, ...view.single]
      .sort((a, b) => a.label.localeCompare(b.label))
      .forEach((tag) => {
        const letter = letterOf(tag.label);
        if (!groups.has(letter)) groups.set(letter, []);
        groups.get(letter).push(tag);
      });
    return [...groups.entries()].sort(([a], [b]) =>
      a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b),
    );
  }, [az, view.shared, view.single]);

  const present = useMemo(
    () => new Set(sections.map(([letter]) => letter)),
    [sections],
  );
  const rail = useMemo(() => {
    const extras = sections
      .map(([letter]) => letter)
      .filter((l) => l !== '#' && !ALPHABET.includes(l));
    return [...ALPHABET, ...extras, ...(present.has('#') ? ['#'] : [])];
  }, [sections, present]);

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20">
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />

      <main className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Masthead */}
        <header className="pt-12 mb-10">
          <div className="flex items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-4 mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] transition-colors"
            >
              <ArrowLeftIcon aria-hidden="true" /> Home
            </Link>
            <span className="font-outfit text-[10px] uppercase tracking-[0.3em] text-[#1A1A1A]/40">
              Back Matter
            </span>
          </div>

          <span className="block font-outfit text-[10px] uppercase tracking-[0.3em] text-[#8D4004] mb-4">
            Index
          </span>
          <h1 className="font-playfairDisplay text-6xl sm:text-7xl md:text-9xl text-[#1A1A1A] leading-none mb-8">
            Tags
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] gap-8 lg:gap-16 items-end border-b-2 border-[#1A1A1A] pb-8">
            <p className="font-playfairDisplay italic text-lg md:text-xl text-[#1A1A1A]/70 max-w-2xl leading-relaxed">
              {ready ? (
                <>
                  {view.totalTags} subjects filed across {view.totalItems}{' '}
                  posts, logs and projects. Find a subject below and turn to
                  everything written under it.
                </>
              ) : (
                'A catalogue of every subject filed across the codex.'
              )}
            </p>

            <label className="relative block border-b border-[#1A1A1A]/25 focus-within:border-[#1A1A1A] transition-colors w-full">
              <span className="sr-only">Search tags</span>
              <input
                type="search"
                value={view.query}
                onChange={(event) => view.setQuery(event.target.value)}
                placeholder="Search the index..."
                className="w-full bg-transparent py-2 pr-6 outline-none font-outfit text-sm placeholder-[#1A1A1A]/30"
              />
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
              role="group"
              aria-label="Content type"
            >
              {view.types.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={view.type === t.key}
                  onClick={() => view.setType(t.key)}
                  className={smallCap(view.type === t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div
              className="flex items-center gap-x-5"
              role="group"
              aria-label="Sort tags"
            >
              <span
                aria-hidden="true"
                className="font-playfairDisplay italic text-sm text-[#1A1A1A]/40"
              >
                Arrange by
              </span>
              <button
                type="button"
                aria-pressed={az}
                onClick={() => view.setSort('az')}
                className={smallCap(az)}
              >
                A–Z
              </button>
              <button
                type="button"
                aria-pressed={!az}
                onClick={() => view.setSort('count')}
                className={smallCap(!az)}
              >
                Most used
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
              No entries match “{view.query}”
            </p>
          </div>
        )}

        {/* A–Z: letter rail and lettered sections */}
        {az && sections.length > 0 && (
          <>
            <nav
              aria-label="Jump to letter"
              className="sticky top-24 z-20 mb-12 -mx-6 md:mx-0 px-6 md:px-0 py-3 bg-[#F5F5F0]/90 backdrop-blur-md border-y border-[#1A1A1A]/10"
            >
              <ul className="flex md:flex-wrap md:justify-between gap-x-3 overflow-x-auto md:overflow-visible">
                {rail.map((letter) => (
                  <li key={letter} className="shrink-0">
                    {present.has(letter) ? (
                      <a
                        href={`#${anchorFor(letter)}`}
                        className="block px-1 py-1 font-playfairDisplay text-base text-[#1A1A1A]/80 hover:text-[#8D4004] hover:italic transition-colors"
                      >
                        {letter}
                      </a>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="block px-1 py-1 font-playfairDisplay text-base text-[#1A1A1A]/15 select-none"
                      >
                        {letter}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="animate-fade-in">
              {sections.map(([letter, tags]) => (
                <section
                  key={letter}
                  id={anchorFor(letter)}
                  aria-labelledby={`${anchorFor(letter)}-h`}
                  className="scroll-mt-44 grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)] gap-4 md:gap-10 py-10 border-b border-[#1A1A1A]/10"
                >
                  <div className="flex md:block items-baseline gap-4 border-b md:border-b-0 border-[#1A1A1A]/10 pb-3 md:pb-0">
                    <h2
                      id={`${anchorFor(letter)}-h`}
                      className="font-playfairDisplay text-7xl md:text-8xl leading-[0.8] text-[#8D4004]"
                    >
                      {letter}
                    </h2>
                    <p className="md:mt-4 font-outfit text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/35">
                      {tags.length} {tags.length === 1 ? 'entry' : 'entries'}
                    </p>
                  </div>
                  <TagRun
                    tags={tags}
                    view={view}
                    label={`Tags under ${letter}`}
                  />
                </section>
              ))}
            </div>
          </>
        )}

        {/* Most used: a ranked editorial list */}
        {!az && view.shared.length > 0 && (
          <section aria-labelledby="luxe-most-read" className="animate-fade-in">
            <div className="flex items-baseline justify-between gap-4 mb-8">
              <h2
                id="luxe-most-read"
                className="font-playfairDisplay text-4xl md:text-5xl text-[#1A1A1A]"
              >
                Most read
              </h2>
              <span className="font-outfit text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/40 text-right">
                Ranked by entries filed
              </span>
            </div>
            <ol className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 border-t border-[#1A1A1A]">
              {view.shared.map((tag, i) => (
                <li
                  key={tag.slug}
                  className="border-b border-[#1A1A1A]/10 min-w-0"
                >
                  <Link
                    to={view.hrefFor(tag)}
                    className="group flex items-baseline gap-4 sm:gap-6 py-5"
                  >
                    <span
                      aria-hidden="true"
                      className="w-12 sm:w-16 shrink-0 font-playfairDisplay italic text-4xl sm:text-5xl leading-none tabular-nums text-[#1A1A1A]/20 group-hover:text-[#8D4004] transition-colors"
                    >
                      {pad(i + 1)}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span
                        className={`block font-playfairDisplay leading-tight text-[#1A1A1A] break-words group-hover:italic group-hover:text-[#8D4004] transition-colors ${
                          RANK_CLASS[view.sizeFor(tag.shown)] || RANK_CLASS[1]
                        }`}
                      >
                        {tag.label}
                      </span>
                      <span className="block mt-1 font-outfit text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                        {TAG_TYPES.filter((t) => tag[t.plural] > 0)
                          .map(
                            (t) =>
                              `${tag[t.plural]} ${
                                tag[t.plural] === 1 ? t.one : t.label
                              }`,
                          )
                          .join(' · ')}
                      </span>
                    </span>
                    <span className="shrink-0 font-playfairDisplay text-2xl tabular-nums text-[#1A1A1A]/70">
                      {tag.shown}
                      <span className="sr-only"> entries</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        {!az && view.single.length > 0 && (
          <details className="mt-16 border-t border-[#1A1A1A]/10 pt-8">
            <summary className="cursor-pointer font-outfit text-[11px] uppercase tracking-[0.25em] text-[#1A1A1A]/50 hover:text-[#8D4004] transition-colors">
              Used once ({view.single.length})
            </summary>
            <div className="mt-8">
              <TagRun
                tags={view.single}
                view={view}
                light
                label="Tags used once"
              />
            </div>
          </details>
        )}
      </main>
    </div>
  );
}
