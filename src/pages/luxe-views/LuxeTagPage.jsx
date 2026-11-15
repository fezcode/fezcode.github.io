import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';

const PAGE =
  'min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-20';

const BackLink = () => (
  <Link
    to="/tags"
    className="inline-flex items-center gap-2 mb-8 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] transition-colors"
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

/** LUXE /tags/:tag: everything filed under one tag. */
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
        <BackLink />
        <h1 className="font-playfairDisplay text-5xl md:text-7xl text-[#1A1A1A] mb-6 break-words">
          No tag “{view.rawTag}”
        </h1>
        <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed">
          Nothing is filed under that tag.{' '}
          <Link
            to="/tags"
            className="text-[#8D4004] border-b border-[#8D4004]/30 hover:border-[#8D4004] transition-colors"
          >
            Browse all tags
          </Link>
          .
        </p>
      </Shell>
    );

  const { meta } = view;
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
        <header className="mb-12 pt-12 border-b border-[#1A1A1A]/10 pb-12">
          <BackLink />
          <span className="block font-outfit text-[10px] uppercase tracking-[0.3em] text-[#8D4004] mb-4">
            Tagged
          </span>
          <h1 className="font-playfairDisplay text-5xl sm:text-7xl md:text-9xl text-[#1A1A1A] mb-6 break-words leading-[0.95]">
            {meta.label}
          </h1>
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-8">
            {meta.description ? (
              <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed">
                {meta.description}
              </p>
            ) : (
              <span />
            )}
            <p className="flex flex-wrap gap-x-8 gap-y-2">
              {TAG_TYPES.filter((t) => meta[t.plural] > 0).map((t) => (
                <span key={t.key} className="flex items-baseline gap-2">
                  <span className="font-playfairDisplay text-3xl md:text-4xl text-[#1A1A1A]">
                    {meta[t.plural]}
                  </span>
                  <span className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/40">
                    {meta[t.plural] === 1 ? t.one.toLowerCase() : t.plural}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </header>

        {view.extra.length > 0 && (
          <div
            className="mb-10 flex flex-wrap items-center gap-2"
            aria-label="Active tag filters"
          >
            <span className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 mr-2">
              Filtered by
            </span>
            {view.active.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-[#1A1A1A] text-white font-outfit text-xs uppercase tracking-widest shadow-lg shadow-black/10 max-w-full"
              >
                <span className="truncate">{view.labelOf(tag)}</span>
                <Link
                  to={view.removeHref(tag)}
                  aria-label={`Remove ${view.labelOf(tag)}`}
                  className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-[#8D4004] transition-colors"
                >
                  <XIcon size={12} weight="bold" aria-hidden="true" />
                </Link>
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-12 lg:gap-16">
          <section className="min-w-0" aria-label="Tagged items">
            <div
              className="flex flex-wrap gap-2 mb-8"
              role="group"
              aria-label="Content type"
            >
              {view.types.map((t) => {
                const active = view.type === t.key;
                const disabled =
                  t.key !== 'all' && view.typeCounts[t.key] === 0;
                return (
                  <button
                    key={t.key}
                    type="button"
                    aria-pressed={active}
                    disabled={disabled}
                    onClick={() => view.setType(t.key)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-outfit text-xs uppercase tracking-widest whitespace-nowrap transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                      active
                        ? 'bg-[#1A1A1A] text-white shadow-lg shadow-black/10'
                        : 'border border-[#1A1A1A]/10 enabled:hover:border-[#1A1A1A] text-[#1A1A1A]/60'
                    }`}
                  >
                    {t.label}
                    <span
                      className={`text-[10px] ${active ? 'text-white/60' : 'text-[#1A1A1A]/30'}`}
                    >
                      {view.typeCounts[t.key]}
                    </span>
                  </button>
                );
              })}
            </div>

            {view.items.length === 0 ? (
              <div className="py-24 text-center border border-[#1A1A1A]/5 bg-white rounded-xl">
                <p className="font-playfairDisplay italic text-2xl text-[#1A1A1A]/40 px-6">
                  Nothing here carries all of these tags.
                </p>
              </div>
            ) : (
              <ol className="flex flex-col gap-4 animate-fade-in">
                {view.items.map((item) => (
                  <li
                    key={item.id}
                    className="group relative border border-[#1A1A1A]/5 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <div className="flex items-stretch">
                      <div className="flex-1 min-w-0 p-6 md:p-8">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
                          <span className="font-outfit text-[10px] uppercase tracking-widest font-bold text-[#8D4004]">
                            {typeByKey[item.type].one}
                          </span>
                          {item.category && (
                            <span className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 border border-[#1A1A1A]/10 px-1.5 py-0.5 rounded-sm">
                              {item.category}
                            </span>
                          )}
                          {item.date && (
                            <time
                              dateTime={item.date}
                              className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/30"
                            >
                              {formatDate(item.date)}
                            </time>
                          )}
                        </div>

                        <h2 className="font-playfairDisplay text-2xl md:text-3xl text-[#1A1A1A] leading-tight mb-2 break-words">
                          <Link
                            to={item.path}
                            className="hover:italic hover:text-[#8D4004] transition-all"
                          >
                            {item.title}
                          </Link>
                        </h2>

                        {item.series && (
                          <p className="font-outfit text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-3">
                            Part of {item.series}
                          </p>
                        )}
                        {item.description && (
                          <p className="font-outfit text-sm text-[#1A1A1A]/60 line-clamp-2 max-w-2xl leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        <ul
                          className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-[#1A1A1A]/5"
                          aria-label="Tags"
                        >
                          {item.tags.map((tag) => {
                            const on = view.active.includes(tag);
                            return (
                              <li key={tag} className="min-w-0">
                                <Link
                                  to={tagPath(tag)}
                                  aria-current={on ? 'true' : undefined}
                                  className={`inline-block px-3 py-1 rounded-sm font-outfit text-xs transition-colors break-words ${
                                    on
                                      ? 'bg-[#1A1A1A] text-white hover:bg-[#8D4004]'
                                      : 'bg-[#EBEBEB] text-[#1A1A1A]/60 hover:text-[#8D4004]'
                                  }`}
                                >
                                  #{view.labelOf(tag)}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div
                        className="hidden md:flex items-center justify-center border-l border-[#1A1A1A]/5 bg-[#FAFAF8] group-hover:bg-[#1A1A1A] transition-colors duration-500 w-20 shrink-0"
                        aria-hidden="true"
                      >
                        <ArrowRightIcon
                          size={22}
                          className="text-[#1A1A1A]/20 group-hover:text-white transition-colors"
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {view.related.length > 0 && (
            <aside
              className="min-w-0 lg:sticky lg:top-28 self-start"
              aria-label="Narrow by another tag"
            >
              <div className="border-t border-[#1A1A1A]/10 pt-6">
                <h2 className="font-playfairDisplay text-3xl text-[#1A1A1A] mb-3">
                  Narrow by
                </h2>
                <p className="font-outfit text-sm text-[#1A1A1A]/60 leading-relaxed mb-6">
                  Tags that appear alongside{' '}
                  <span className="font-playfairDisplay italic text-[#1A1A1A]">
                    {view.title}
                  </span>
                  . Each one narrows the list.
                </p>
                <ul className="flex flex-col">
                  {view.related.map(([tag, count]) => (
                    <li key={tag}>
                      <Link
                        to={view.addHref(tag)}
                        className="group flex items-baseline justify-between gap-4 py-2.5 border-b border-[#1A1A1A]/5 hover:border-[#8D4004]/40 transition-colors"
                      >
                        <span className="font-outfit text-sm text-[#1A1A1A]/70 group-hover:text-[#8D4004] transition-colors min-w-0 break-words">
                          <span className="text-[#1A1A1A]/30 group-hover:text-[#8D4004] mr-1.5">
                            +
                          </span>
                          {view.labelOf(tag)}
                        </span>
                        <span className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/30 shrink-0">
                          {count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
