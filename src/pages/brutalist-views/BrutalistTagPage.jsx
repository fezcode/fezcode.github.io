import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, X } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';

// Square marker per content type, echoing the theme's emerald / amber / sky palette.
const TYPE_DOT = {
  post: 'bg-emerald-500',
  log: 'bg-amber-500',
  project: 'bg-sky-500',
};
const TYPE_TEXT = {
  post: 'text-emerald-400',
  log: 'text-amber-400',
  project: 'text-sky-400',
};

const pad = (n, width) => String(n).padStart(width, '0');

const BackLink = () => (
  <Link
    to="/tags"
    className="group mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
  >
    <ArrowLeft
      weight="bold"
      className="group-hover:-translate-x-1 transition-transform"
    />
    <span>All tags</span>
  </Link>
);

const Shell = ({ children }) => (
  <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-24 md:px-12">
      {children}
    </main>
  </div>
);

// Block-list heading inside the sticky column.
const BlockHead = ({ children, id }) => (
  <h2
    id={id}
    className="bg-white px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-black"
  >
    {children}
  </h2>
);

/** BRUTALIST /tags/:tag: sticky label column on the left, numbered index on the right. */
export default function BrutalistTagPage({ view }) {
  if (view.status === 'error')
    return (
      <Shell>
        <BackLink />
        <div className="border-2 border-red-500 p-6">
          <p className="font-mono text-xs text-red-400 uppercase tracking-widest break-words">
            {'//'} ERROR: {view.error}
          </p>
        </div>
      </Shell>
    );

  if (view.status === 'loading')
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4" role="status">
          <div className="h-px w-24 bg-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-400 animate-progress origin-left" />
          </div>
          <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
            Accessing_Tag
          </span>
        </div>
      </div>
    );

  if (view.status === 'missing')
    return (
      <Shell>
        <Seo title="Tag not found | Fezcodex" />
        <BackLink />
        <p className="mb-4 font-mono text-[10px] text-red-400 uppercase tracking-[0.2em]">
          404 {'//'} Tag Not Found
        </p>
        <h1 className="mb-8 border-b-4 border-white pb-6 text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] break-words [overflow-wrap:anywhere]">
          No tag “{view.rawTag}”
        </h1>
        <p className="font-mono text-sm text-gray-400 uppercase tracking-widest">
          Nothing is filed under that tag.{' '}
          <Link
            to="/tags"
            className="text-emerald-400 hover:bg-emerald-500 hover:text-black underline decoration-emerald-500/40 underline-offset-4 transition-colors"
          >
            Browse all tags
          </Link>
          .
        </p>
      </Shell>
    );

  const { meta } = view;
  const counts = TAG_TYPES.filter((t) => meta[t.plural] > 0);
  const digits = Math.max(2, String(view.items.length).length);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      <Seo
        title={`${view.title} | Tags | Fezcodex`}
        description={
          meta.description ||
          `Posts, logs and projects tagged ${meta.label} on Fezcodex.`
        }
        canonicalPath={tagPath(view.slug)}
      />

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* LEFT: sticky label column */}
        <aside
          className="min-w-0 border-b-4 border-white lg:border-b-0 lg:border-r-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto"
          aria-label="Tag details"
        >
          <div className="px-4 sm:px-6 md:px-10 pt-24 pb-10">
            <BackLink />

            <p className="mb-4 inline-flex items-center gap-2 bg-emerald-500 px-2 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-black">
              Tagged {'//'}
            </p>

            <h1 className="font-black uppercase tracking-tighter leading-[0.8] text-[clamp(3rem,12vw,12rem)] lg:text-[clamp(3rem,6.5vw,9rem)] break-words [overflow-wrap:anywhere] hyphens-auto">
              {meta.label}
            </h1>

            {meta.description && (
              <p className="mt-6 max-w-xl text-base sm:text-lg text-gray-300 font-syne leading-relaxed">
                {meta.description}
              </p>
            )}

            {/* Meta counts as stacked numerals */}
            <dl className="mt-10 border-t-2 border-white/20">
              {counts.map((t) => (
                <div
                  key={t.key}
                  className="flex items-baseline justify-between gap-4 border-b-2 border-white/10 py-2"
                >
                  <dt className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <i
                      className={`inline-block h-2 w-2 ${TYPE_DOT[t.key] || 'bg-white'}`}
                      aria-hidden="true"
                    />
                    {meta[t.plural] === 1 ? t.one : t.label}
                  </dt>
                  <dd className="font-mono text-5xl sm:text-6xl font-black leading-none tabular-nums text-white">
                    {meta[t.plural]}
                  </dd>
                </div>
              ))}
              {counts.length > 1 && (
                <div className="flex items-baseline justify-between gap-4 border-b-2 border-white/10 py-2">
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                    Total
                  </dt>
                  <dd className="font-mono text-5xl sm:text-6xl font-black leading-none tabular-nums text-emerald-400">
                    {meta.count}
                  </dd>
                </div>
              )}
            </dl>

            {/* Active filters */}
            {view.extra.length > 0 && (
              <section
                className="mt-10 border-2 border-emerald-500"
                aria-labelledby="bt-active"
              >
                <h2
                  id="bt-active"
                  className="bg-emerald-500 px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-black"
                >
                  Filtered by ({view.active.length})
                </h2>
                <ul aria-label="Active tag filters">
                  {view.active.map((tag) => (
                    <li
                      key={tag}
                      className="flex items-stretch justify-between border-t-2 border-emerald-500/30 first:border-t-0"
                    >
                      <span className="min-w-0 px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest text-emerald-400 break-all">
                        #{view.labelOf(tag)}
                      </span>
                      <Link
                        to={view.removeHref(tag)}
                        aria-label={`Remove ${view.labelOf(tag)}`}
                        className="flex shrink-0 items-center border-l-2 border-emerald-500/30 px-3 text-emerald-400 hover:bg-red-500 hover:text-black focus:outline-none focus-visible:bg-red-500 focus-visible:text-black transition-colors"
                      >
                        <X size={14} weight="bold" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Narrow by */}
            {view.related.length > 0 && (
              <section
                className="mt-10 border-2 border-white/20"
                aria-labelledby="bt-narrow"
              >
                <BlockHead id="bt-narrow">Narrow by</BlockHead>
                <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-gray-500 leading-relaxed">
                  Tags that appear alongside {view.title}. Each one narrows the
                  list.
                </p>
                <ul className="max-h-72 overflow-y-auto lg:max-h-none border-t-2 border-white/10">
                  {view.related.map(([tag, count]) => (
                    <li
                      key={tag}
                      className="border-b border-white/10 last:border-b-0"
                    >
                      <Link
                        to={view.addHref(tag)}
                        className="group flex items-center justify-between gap-3 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-gray-300 hover:bg-emerald-500 hover:text-black focus:outline-none focus-visible:bg-emerald-500 focus-visible:text-black transition-colors"
                      >
                        <span className="min-w-0 break-all">
                          <span
                            className="mr-2 text-emerald-500 group-hover:text-black"
                            aria-hidden="true"
                          >
                            +
                          </span>
                          {view.labelOf(tag)}
                        </span>
                        <span className="shrink-0 tabular-nums text-gray-600 group-hover:text-black">
                          {count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </aside>

        {/* RIGHT: numbered index */}
        <section
          className="min-w-0 px-4 sm:px-6 md:px-10 pt-10 lg:pt-24 pb-24"
          aria-label="Tagged items"
        >
          <div
            className="sticky top-0 z-20 grid grid-cols-2 sm:grid-cols-4 gap-[2px] border-2 border-white bg-white"
            role="group"
            aria-label="Content type"
          >
            {view.types.map((t) => {
              const on = view.type === t.key;
              const disabled = t.key !== 'all' && view.typeCounts[t.key] === 0;
              return (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={on}
                  disabled={disabled}
                  onClick={() => view.setType(t.key)}
                  className={`flex min-w-0 items-center justify-between gap-2 px-3 py-3 font-mono text-[11px] font-black uppercase tracking-widest transition-colors disabled:cursor-not-allowed disabled:text-gray-700 focus:outline-none focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400 ${
                    on
                      ? 'bg-emerald-500 text-black'
                      : 'bg-[#050505] text-gray-400 enabled:hover:bg-white enabled:hover:text-black'
                  }`}
                >
                  <span className="inline-flex min-w-0 items-center gap-2">
                    {t.key !== 'all' && (
                      <i
                        className={`inline-block h-2 w-2 shrink-0 ${
                          on ? 'bg-black' : TYPE_DOT[t.key] || 'bg-white'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    <span className="truncate">{t.label}</span>
                  </span>
                  <span className="tabular-nums">{view.typeCounts[t.key]}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600">
            {'//'} INDEX: {view.items.length}{' '}
            {view.items.length === 1 ? 'ENTRY' : 'ENTRIES'}
          </p>

          {view.items.length === 0 ? (
            <div className="border-2 border-dashed border-white/20 p-6">
              <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                {'//'} Nothing here carries all of these tags.
              </p>
            </div>
          ) : (
            <ol className="border-t-4 border-white">
              {view.items.map((item, i) => (
                <li
                  key={item.id}
                  className="group grid grid-cols-[3rem_minmax(0,1fr)] sm:grid-cols-[4.5rem_minmax(0,1fr)] border-b-2 border-white/10 hover:bg-white/[0.03] transition-colors"
                >
                  <span className="pt-6 font-mono text-sm sm:text-base font-black tabular-nums text-gray-600 group-hover:text-emerald-400 transition-colors">
                    [{pad(i + 1, digits)}]
                  </span>

                  <div className="min-w-0 border-l-2 border-white/10 py-6 pl-4 sm:pl-6">
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      <span className={TYPE_TEXT[item.type] || 'text-white'}>
                        {typeByKey[item.type]?.one || item.type}
                      </span>
                      {item.category && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="break-all">{item.category}</span>
                        </>
                      )}
                      {item.date && (
                        <>
                          <span aria-hidden="true">·</span>
                          <time dateTime={item.date}>
                            {formatDate(item.date)}
                          </time>
                        </>
                      )}
                    </p>

                    <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black uppercase tracking-tighter leading-[0.9] break-words [overflow-wrap:anywhere]">
                      <Link
                        to={item.path}
                        className="box-decoration-clone text-white group-hover:text-emerald-400 hover:bg-emerald-500 hover:!text-black focus:outline-none focus-visible:bg-emerald-500 focus-visible:!text-black transition-colors"
                      >
                        {item.title}
                        <ArrowUpRight
                          size={22}
                          weight="bold"
                          aria-hidden="true"
                          className="ml-1 inline-block align-top"
                        />
                      </Link>
                    </h2>

                    {item.series && (
                      <p className="mt-3 font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                        {'//'} Part of {item.series}
                      </p>
                    )}

                    {item.description && (
                      <p className="mt-3 max-w-2xl text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    <ul
                      className="mt-4 flex flex-wrap gap-[2px]"
                      aria-label="Tags"
                    >
                      {item.tags.map((tag) => {
                        const isActive = view.active.includes(tag);
                        return (
                          <li key={tag} className="max-w-full">
                            <Link
                              to={tagPath(tag)}
                              aria-current={isActive ? 'true' : undefined}
                              className={`inline-block max-w-full px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider break-all transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                                isActive
                                  ? 'bg-emerald-500 text-black'
                                  : 'bg-white/[0.06] text-gray-400 hover:bg-white hover:text-black'
                              }`}
                            >
                              #{view.labelOf(tag)}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
