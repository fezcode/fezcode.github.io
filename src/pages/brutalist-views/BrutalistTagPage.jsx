import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarBlank,
  Hash,
  Plus,
  Tag,
  X,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';

// Accent per content type, echoing the theme's emerald / amber / sky palette.
const TYPE_ACCENT = {
  post: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-400',
    bar: 'bg-emerald-500',
  },
  log: { dot: 'bg-amber-500', text: 'text-amber-400', bar: 'bg-amber-500' },
  project: { dot: 'bg-sky-500', text: 'text-sky-400', bar: 'bg-sky-500' },
};
const accentOf = (type) =>
  TYPE_ACCENT[type] || { dot: 'bg-white', text: 'text-white', bar: 'bg-white' };

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

/** BRUTALIST /tags/:tag. */
export default function BrutalistTagPage({ view }) {
  if (view.status === 'error')
    return (
      <Shell>
        <BackLink />
        <div className="py-12 px-4 text-center border border-dashed border-red-500/30 rounded-sm">
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
        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8 break-words">
          No tag “{view.rawTag}”
        </h1>
        <p className="font-mono text-sm text-gray-400 uppercase tracking-widest">
          Nothing is filed under that tag.{' '}
          <Link
            to="/tags"
            className="text-emerald-400 hover:text-white underline decoration-emerald-500/30 underline-offset-4 transition-colors"
          >
            Browse all tags
          </Link>
          .
        </p>
      </Shell>
    );

  const { meta } = view;

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

      {/* HEADER */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-16 md:px-12">
          <BackLink />

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest border text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
              <Tag weight="fill" aria-hidden="true" />
              Tagged
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8 max-w-5xl break-words">
            {meta.label}
          </h1>

          {meta.description && (
            <p className="text-lg text-gray-300 font-syne leading-relaxed max-w-2xl mb-8">
              {meta.description}
            </p>
          )}

          <p className="flex flex-wrap items-center gap-x-8 gap-y-3 text-gray-400 font-mono text-[10px] uppercase tracking-[0.2em]">
            {TAG_TYPES.filter((t) => meta[t.plural] > 0).map((t) => (
              <span key={t.key} className="inline-flex items-center gap-2">
                <i
                  className={`inline-block h-2 w-2 ${accentOf(t.key).dot}`}
                  aria-hidden="true"
                />
                <span className="text-white">{meta[t.plural]}</span>
                {meta[t.plural] === 1 ? t.one.toLowerCase() : t.plural}
              </span>
            ))}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:px-12">
        {/* Active filters */}
        {view.extra.length > 0 && (
          <div
            className="mb-12 flex flex-wrap items-center gap-2"
            aria-label="Active tag filters"
          >
            <span className="mr-2 font-mono text-xs text-gray-600 uppercase tracking-widest">
              Filtered by
            </span>
            {view.active.map((tag) => (
              <span
                key={tag}
                className="inline-flex max-w-full items-center gap-2 rounded-sm border border-emerald-500/40 bg-emerald-500/10 pl-3 font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400"
              >
                <span className="break-all py-1">#{view.labelOf(tag)}</span>
                <Link
                  to={view.removeHref(tag)}
                  aria-label={`Remove ${view.labelOf(tag)}`}
                  className="self-stretch flex items-center px-2 border-l border-emerald-500/30 hover:bg-red-500 hover:text-black transition-colors"
                >
                  <X size={12} weight="bold" aria-hidden="true" />
                </Link>
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* RESULTS */}
          <section className="lg:col-span-8 min-w-0" aria-label="Tagged items">
            <div
              className="mb-10 flex flex-wrap gap-2 border-b border-white/10 pb-8"
              role="group"
              aria-label="Content type"
            >
              {view.types.map((t) => {
                const on = view.type === t.key;
                const disabled =
                  t.key !== 'all' && view.typeCounts[t.key] === 0;
                return (
                  <button
                    key={t.key}
                    type="button"
                    aria-pressed={on}
                    disabled={disabled}
                    onClick={() => view.setType(t.key)}
                    className={`inline-flex items-center gap-2 rounded-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      on
                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                        : 'bg-white/5 text-gray-500 border border-white/5 enabled:hover:text-white enabled:hover:bg-white/10'
                    }`}
                  >
                    {t.key !== 'all' && (
                      <i
                        className={`inline-block h-2 w-2 ${accentOf(t.key).dot}`}
                        aria-hidden="true"
                      />
                    )}
                    {t.label}
                    <span
                      className={`font-mono ${on ? 'text-black/60' : 'text-gray-600'}`}
                    >
                      {view.typeCounts[t.key]}
                    </span>
                  </button>
                );
              })}
            </div>

            {view.items.length === 0 ? (
              <div className="py-12 px-4 text-center border border-dashed border-white/10 rounded-sm">
                <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                  Nothing here carries all of these tags.
                </p>
              </div>
            ) : (
              <ol className="flex flex-col border-t border-white/10">
                {view.items.map((item) => {
                  const accent = accentOf(item.type);
                  return (
                    <li
                      key={item.id}
                      className="group relative border-b border-white/10 py-8 pl-5 pr-2 hover:bg-white/[0.02] transition-colors"
                    >
                      <span
                        className={`absolute left-0 top-0 h-0 w-1 group-hover:h-full transition-all duration-500 ${accent.bar}`}
                        aria-hidden="true"
                      />
                      <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-widest">
                        <span className={`font-bold ${accent.text}`}>
                          {typeByKey[item.type].one}
                          {item.category && (
                            <span className="text-gray-500">
                              {' '}
                              {'//'} {item.category}
                            </span>
                          )}
                        </span>
                        {item.date && (
                          <span className="inline-flex items-center gap-2 text-gray-500">
                            <CalendarBlank size={12} aria-hidden="true" />
                            <time dateTime={item.date}>
                              {formatDate(item.date)}
                            </time>
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none break-words">
                        <Link
                          to={item.path}
                          className="inline-flex items-start gap-2 text-white hover:text-emerald-400 transition-colors"
                        >
                          <span>{item.title}</span>
                          <ArrowUpRight
                            size={20}
                            weight="bold"
                            aria-hidden="true"
                            className="mt-1 shrink-0 text-gray-600 group-hover:text-emerald-400 transition-colors"
                          />
                        </Link>
                      </h2>

                      {item.series && (
                        <p className="mt-3 font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                          {'//'} Part of {item.series}
                        </p>
                      )}

                      {item.description && (
                        <p className="mt-4 text-gray-400 leading-relaxed max-w-2xl">
                          {item.description}
                        </p>
                      )}

                      <ul
                        className="mt-5 flex flex-wrap gap-2"
                        aria-label="Tags"
                      >
                        {item.tags.map((tag) => {
                          const isActive = view.active.includes(tag);
                          return (
                            <li key={tag} className="max-w-full">
                              <Link
                                to={tagPath(tag)}
                                aria-current={isActive ? 'true' : undefined}
                                className={`inline-flex max-w-full items-center gap-1 rounded-sm border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider transition-colors break-all ${
                                  isActive
                                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                                    : 'border-white/5 bg-white/[0.03] text-gray-500 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5'
                                }`}
                              >
                                <Hash size={10} aria-hidden="true" />
                                {view.labelOf(tag)}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          {/* NARROW BY */}
          {view.related.length > 0 && (
            <aside
              className="lg:col-span-4 min-w-0"
              aria-label="Narrow by another tag"
            >
              <div className="lg:sticky lg:top-24 border border-white/[0.08] p-6 sm:p-8 bg-white/[0.015] backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500/40 via-transparent to-transparent" />
                <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500/60 transition-all duration-500" />
                <h2 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Tag weight="fill" aria-hidden="true" />
                  Narrow by
                </h2>
                <p className="mb-6 font-mono text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                  Tags that appear alongside {view.title}. Each one narrows the
                  list.
                </p>
                <ul className="flex flex-col">
                  {view.related.map(([tag, count]) => (
                    <li
                      key={tag}
                      className="border-b border-white/5 last:border-b-0"
                    >
                      <Link
                        to={view.addHref(tag)}
                        className="group/rel flex items-center justify-between gap-4 py-3 font-mono text-xs uppercase tracking-widest text-gray-300 hover:text-emerald-400 transition-colors"
                      >
                        <span className="inline-flex min-w-0 items-center gap-2">
                          <Plus
                            size={12}
                            weight="bold"
                            aria-hidden="true"
                            className="shrink-0 text-gray-600 group-hover/rel:text-emerald-400 transition-colors"
                          />
                          <span className="break-all">{view.labelOf(tag)}</span>
                        </span>
                        <span className="shrink-0 text-[10px] text-gray-600 group-hover/rel:text-emerald-400">
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
      </div>
    </div>
  );
}
