import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, XIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';

const PAGE =
  'min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20';

const BackLink = ({ className = '' }) => (
  <Link
    to="/tags"
    className={`inline-flex items-center gap-2 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] transition-colors ${className}`}
  >
    <ArrowLeftIcon aria-hidden="true" /> All Tags
  </Link>
);

const Shell = ({ children }) => (
  <div className={PAGE}>
    <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12">
      {children}
    </main>
  </div>
);

/** Kicker line: type · category, then the date. */
const Kicker = ({ item }) => (
  <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3 font-outfit text-[10px] uppercase tracking-[0.25em]">
    <span className="font-bold text-[#8D4004]">
      {typeByKey[item.type].one}
      {item.category && (
        <span className="font-normal text-[#1A1A1A]/50">
          {' '}
          · {item.category}
        </span>
      )}
    </span>
    {item.date && (
      <time dateTime={item.date} className="text-[#1A1A1A]/35">
        {formatDate(item.date)}
      </time>
    )}
  </p>
);

/** Tags set in small caps; the active ones are underlined in rust. */
const TagLine = ({ item, view }) => (
  <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4" aria-label="Tags">
    {item.tags.map((tag) => {
      const on = view.active.includes(tag);
      return (
        <li key={tag} className="min-w-0">
          <Link
            to={tagPath(tag)}
            aria-current={on ? 'true' : undefined}
            className={`font-outfit text-[10px] uppercase tracking-[0.2em] break-words transition-colors ${
              on
                ? 'text-[#8D4004] border-b border-[#8D4004]'
                : 'text-[#1A1A1A]/40 hover:text-[#8D4004]'
            }`}
          >
            {view.labelOf(tag)}
          </Link>
        </li>
      );
    })}
  </ul>
);

/** LUXE /tags/:tag: a feature spread of everything filed under one tag. */
export default function LuxeTagPage({ view }) {
  if (view.status === 'error')
    return (
      <Shell>
        <div className="py-32 text-center">
          <p className="font-playfairDisplay italic text-2xl text-[#1A1A1A]/40">
            {view.error}
          </p>
        </div>
      </Shell>
    );
  if (view.status === 'loading')
    return (
      <Shell>
        <div className="py-32 text-center font-outfit text-[#1A1A1A]/40 text-xs uppercase tracking-[0.2em] animate-pulse">
          Loading...
        </div>
      </Shell>
    );
  if (view.status === 'missing')
    return (
      <Shell>
        <Seo title="Tag not found | Fezcodex" />
        <BackLink className="mb-8" />
        <h1 className="font-playfairDisplay text-5xl md:text-7xl text-[#1A1A1A] mb-6 break-words">
          No tag “{view.rawTag}”
        </h1>
        <p className="font-playfairDisplay italic text-lg text-[#1A1A1A]/60 max-w-lg leading-relaxed">
          Nothing is filed under that tag.{' '}
          <Link
            to="/tags"
            className="not-italic font-outfit text-sm text-[#8D4004] border-b border-[#8D4004]/30 hover:border-[#8D4004] transition-colors"
          >
            Browse all tags
          </Link>
          .
        </p>
      </Shell>
    );

  const { meta } = view;
  const [lead, ...rest] = view.items;
  const figures = TAG_TYPES.filter((t) => meta[t.plural] > 0);

  const narrowBy = view.related.length > 0 && (
    <aside
      aria-labelledby="luxe-narrow-by"
      className="my-14 md:my-16 mx-auto max-w-4xl border-y-2 border-[#1A1A1A] py-1"
    >
      <div className="border-y border-[#1A1A1A]/20 py-8 md:py-10 px-2 md:px-8 text-center">
        <h2
          id="luxe-narrow-by"
          className="font-outfit text-[10px] uppercase tracking-[0.3em] text-[#8D4004] mb-4"
        >
          Narrow by
        </h2>
        <p className="font-playfairDisplay italic text-lg md:text-xl text-[#1A1A1A]/60 mb-5 leading-relaxed">
          Read alongside {view.title}, each one narrows the spread:
        </p>
        <ul className="font-playfairDisplay italic text-xl md:text-2xl leading-[1.9] text-[#1A1A1A]">
          {view.related.map(([tag, count], i) => (
            <li key={tag} className="inline">
              <Link
                to={view.addHref(tag)}
                aria-label={`Narrow by ${view.labelOf(tag)} (${count})`}
                className="group break-words hover:text-[#8D4004] transition-colors"
              >
                <span className="text-[#1A1A1A]/30 group-hover:text-[#8D4004] not-italic font-outfit text-base mr-0.5">
                  +
                </span>
                {view.labelOf(tag)}
                <span className="ml-1 not-italic font-outfit text-[10px] tracking-widest tabular-nums text-[#1A1A1A]/35 group-hover:text-[#8D4004]">
                  {count}
                </span>
              </Link>
              {i < view.related.length - 1 && (
                <span
                  aria-hidden="true"
                  className="mx-2.5 text-[#1A1A1A]/20 not-italic"
                >
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );

  return (
    <div className={PAGE}>
      <Seo
        title={`${view.title} | Tags | Fezcodex`}
        description={
          meta.description ||
          `Posts, logs and projects tagged ${meta.label} on Fezcodex.`
        }
        canonicalPath={tagPath(view.slug)}
      />

      <main className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Masthead */}
        <header className="pt-12 mb-10">
          <div className="flex items-center justify-between gap-4 border-b border-[#1A1A1A]/10 pb-4 mb-10">
            <BackLink />
            <span className="font-outfit text-[10px] uppercase tracking-[0.3em] text-[#1A1A1A]/40">
              The Feature
            </span>
          </div>

          {view.extra.length > 0 ? (
            <div
              className="flex flex-wrap items-baseline gap-x-2 gap-y-2 mb-5"
              aria-label="Active tag filters"
            >
              <span className="font-outfit text-[10px] uppercase tracking-[0.3em] text-[#8D4004] mr-1">
                Filed under
              </span>
              {view.active.map((tag, i) => (
                <span
                  key={tag}
                  className="inline-flex items-baseline gap-1 min-w-0"
                >
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="font-playfairDisplay italic text-lg text-[#1A1A1A]/40 mr-1"
                    >
                      &amp;
                    </span>
                  )}
                  <span className="font-playfairDisplay italic text-lg md:text-xl text-[#1A1A1A] break-words">
                    {view.labelOf(tag)}
                  </span>
                  <Link
                    to={view.removeHref(tag)}
                    aria-label={`Remove ${view.labelOf(tag)}`}
                    className="self-center w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[#1A1A1A]/40 hover:text-white hover:bg-[#8D4004] transition-colors"
                  >
                    <XIcon size={12} weight="bold" aria-hidden="true" />
                  </Link>
                </span>
              ))}
            </div>
          ) : (
            <span className="block font-outfit text-[10px] uppercase tracking-[0.3em] text-[#8D4004] mb-5">
              Filed under
            </span>
          )}

          <h1 className="font-playfairDisplay text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#1A1A1A] leading-[0.92] break-words mb-8">
            {meta.label}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-8 lg:gap-16 items-end border-b-2 border-[#1A1A1A] pb-8">
            {meta.description ? (
              <p className="font-playfairDisplay italic text-xl md:text-2xl text-[#1A1A1A]/70 max-w-3xl leading-relaxed">
                {meta.description}
              </p>
            ) : (
              <span />
            )}
            {figures.length > 0 && (
              <dl className="flex flex-wrap divide-x divide-[#1A1A1A]/15">
                {figures.map((t) => (
                  <div
                    key={t.key}
                    className="flex flex-col-reverse px-5 first:pl-0 last:pr-0 text-left"
                  >
                    <dt className="mt-2 font-outfit text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A]/40">
                      {meta[t.plural] === 1 ? t.one : t.label}
                    </dt>
                    <dd className="font-playfairDisplay text-4xl md:text-5xl tabular-nums text-[#1A1A1A] leading-none">
                      {meta[t.plural]}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* Sections */}
          <div
            className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3"
            role="group"
            aria-label="Content type"
          >
            {view.types.map((t) => {
              const active = view.type === t.key;
              const disabled = t.key !== 'all' && view.typeCounts[t.key] === 0;
              return (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={active}
                  disabled={disabled}
                  onClick={() => view.setType(t.key)}
                  className={`inline-flex items-baseline gap-1.5 pb-1 border-b font-outfit text-[11px] uppercase tracking-[0.25em] whitespace-nowrap transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                    active
                      ? 'text-[#1A1A1A] border-[#8D4004]'
                      : 'text-[#1A1A1A]/40 border-transparent enabled:hover:text-[#8D4004]'
                  }`}
                >
                  {t.label}
                  <span className="font-playfairDisplay italic normal-case tracking-normal text-xs tabular-nums">
                    {view.typeCounts[t.key]}
                  </span>
                </button>
              );
            })}
          </div>
        </header>

        {!lead ? (
          <>
            <div className="py-24 text-center border-y border-[#1A1A1A]/10">
              <p className="font-playfairDisplay italic text-2xl text-[#1A1A1A]/40 px-6">
                Nothing here carries all of these tags.
              </p>
            </div>
            {narrowBy}
          </>
        ) : (
          <section aria-label="Tagged items" className="animate-fade-in">
            {/* Lead story */}
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 pt-4 pb-2">
              <div className="lg:col-span-7 min-w-0">
                <span className="block font-playfairDisplay italic text-sm text-[#1A1A1A]/40 mb-3">
                  The lead
                </span>
                <Kicker item={lead} />
                <h2 className="font-playfairDisplay text-4xl sm:text-5xl md:text-6xl text-[#1A1A1A] leading-[1.02] break-words">
                  <Link
                    to={lead.path}
                    className="hover:italic hover:text-[#8D4004] transition-all"
                  >
                    {lead.title}
                  </Link>
                </h2>
                {lead.series && (
                  <p className="mt-4 font-playfairDisplay italic text-base text-[#1A1A1A]/50">
                    Part of {lead.series}
                  </p>
                )}
              </div>
              <div className="lg:col-span-5 min-w-0 lg:border-l lg:border-[#1A1A1A]/10 lg:pl-12 lg:self-end">
                {lead.description && (
                  <p className="font-outfit text-base md:text-lg text-[#1A1A1A]/70 leading-relaxed first-letter:font-playfairDisplay first-letter:text-5xl first-letter:float-left first-letter:mr-2 first-letter:leading-[0.85] first-letter:text-[#8D4004]">
                    {lead.description}
                  </p>
                )}
                <TagLine item={lead} view={view} />
              </div>
            </article>

            {narrowBy || (
              <hr className="my-14 border-0 border-t border-[#1A1A1A]/15" />
            )}

            {/* The rest of the issue */}
            {rest.length > 0 && (
              <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-14">
                {rest.map((item) => (
                  <li key={item.id} className="min-w-0">
                    <article className="border-t border-[#1A1A1A] pt-5 h-full flex flex-col">
                      <Kicker item={item} />
                      <h3 className="font-playfairDisplay text-2xl md:text-[1.7rem] text-[#1A1A1A] leading-tight break-words">
                        <Link
                          to={item.path}
                          className="hover:italic hover:text-[#8D4004] transition-all"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      {item.series && (
                        <p className="mt-2 font-playfairDisplay italic text-sm text-[#1A1A1A]/50">
                          Part of {item.series}
                        </p>
                      )}
                      {item.description && (
                        <p className="mt-3 font-outfit text-sm text-[#1A1A1A]/60 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-auto">
                        <TagLine item={item} view={view} />
                      </div>
                    </article>
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
