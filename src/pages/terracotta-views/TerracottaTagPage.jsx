import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';
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
  post: '#9E4A2F',
  log: '#B88532',
  project: '#6B8E23',
};

const BACK_LINK =
  'inline-flex items-center gap-2 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#2E2620]/70 hover:text-[#9E4A2F] transition-colors';

const Dot = ({ color }) => (
  <span
    aria-hidden="true"
    className="inline-block w-[5px] h-[5px] rounded-full shrink-0"
    style={{ backgroundColor: color }}
  />
);

const Page = ({ children, strip }) => (
  <div
    className="min-h-screen relative text-[#1A1613] font-fraunces selection:bg-[#C96442]/25"
    style={{
      background: '#F3ECE0',
      backgroundImage: PAPER_GRADIENT,
      fontFeatureSettings: '"ss01", "ss02", "kern"',
    }}
  >
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 opacity-[0.32] mix-blend-multiply"
      style={{ backgroundImage: PAPER_GRAIN }}
    />
    <main className="relative z-10 mx-auto max-w-[1080px] px-5 sm:px-6 md:px-14 pb-[120px]">
      {strip}
      {children}
    </main>
    <div className="fixed bottom-6 right-6 opacity-40 pointer-events-none z-20 hidden md:block">
      <TerracottaMark size={18} color="#C96442" />
    </div>
  </div>
);

const ItemRow = ({ item, view }) => {
  const color = TYPE_COLOR[item.type] || '#2E2620';
  return (
    <li className="group py-7 md:py-8 border-b border-dashed border-[#1A161320] hover:border-[#1A1613]/40 transition-colors">
      <div className="flex items-center justify-between gap-3 flex-wrap font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#2E2620]/80">
        <span className="flex items-center gap-2 flex-wrap min-w-0">
          <span
            className="inline-flex items-center gap-1.5 px-1.5 py-0.5 border"
            style={{
              color,
              borderColor: color,
              backgroundColor: `${color}10`,
            }}
          >
            <Dot color={color} />
            {typeByKey[item.type].one}
          </span>
          {item.category && (
            <span className="text-[#2E2620]/70 break-all">{item.category}</span>
          )}
        </span>
        {item.date && (
          <time dateTime={item.date} className="text-[#2E2620]/70">
            {formatDate(item.date)}
          </time>
        )}
      </div>

      <h2
        className="mt-4 font-fraunces text-[22px] md:text-[30px] leading-[1.15] tracking-[-0.015em] text-[#1A1613] break-words"
        style={{
          fontStyle: 'italic',
          fontVariationSettings: '"opsz" 36, "SOFT" 80, "WONK" 1, "wght" 400',
        }}
      >
        <Link
          to={item.path}
          className="inline-flex items-baseline gap-3 hover:text-[#9E4A2F] focus:outline-none focus-visible:text-[#9E4A2F] transition-colors"
        >
          <span className="min-w-0">{item.title}</span>
          <span
            aria-hidden="true"
            className="hidden md:inline-block not-italic font-ibm-plex-mono text-sm text-[#9E4A2F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
          >
            →
          </span>
        </Link>
      </h2>

      {item.series && (
        <p
          className="mt-1 font-fraunces italic text-[14px] text-[#2E2620]"
          style={{
            fontVariationSettings: '"opsz" 18, "SOFT" 100, "wght" 360',
          }}
        >
          Part of <span className="text-[#9E4A2F]">{item.series}</span>
        </p>
      )}

      {item.description && (
        <p className="mt-2 font-ibm-plex-mono text-[11.5px] leading-[1.6] text-[#2E2620] max-w-[68ch]">
          {item.description}
        </p>
      )}

      {item.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
          {item.tags.map((tag) => {
            const on = view.active.includes(tag);
            return (
              <li key={tag} className="min-w-0">
                <Link
                  to={tagPath(tag)}
                  aria-current={on ? 'true' : undefined}
                  className={`inline-block max-w-full break-words font-ibm-plex-mono text-[9.5px] tracking-[0.14em] uppercase px-1.5 py-0.5 border transition-colors ${
                    on
                      ? 'border-[#9E4A2F] bg-[#9E4A2F] text-[#F3ECE0] hover:bg-[#C96442] hover:border-[#C96442]'
                      : 'border-[#1A161320] text-[#2E2620] hover:border-[#9E4A2F] hover:text-[#9E4A2F]'
                  }`}
                >
                  #{view.labelOf(tag)}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

/** Terracotta /tags/:tag: one headword and every slip filed under it. */
export default function TerracottaTagPage({ view }) {
  if (view.status === 'error')
    return (
      <Page
        strip={
          <TerracottaStrip left="Folio IX · index" center="Tag" right="Error" />
        }
      >
        <div className="py-24 text-center">
          <p className="font-fraunces italic text-[22px] text-[#2E2620]/60">
            {view.error}
          </p>
          <Link to="/tags" className={`${BACK_LINK} mt-6`}>
            ← All tags
          </Link>
        </div>
      </Page>
    );

  if (view.status === 'loading')
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#F3ECE0', backgroundImage: PAPER_GRADIENT }}
      >
        <div className="flex flex-col items-center gap-5">
          <TerracottaMark size={48} color="#C96442" sway />
          <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.32em] uppercase text-[#2E2620]/80">
            Loading…
          </span>
        </div>
      </div>
    );

  if (view.status === 'missing')
    return (
      <Page
        strip={
          <TerracottaStrip
            left="Folio IX · index"
            center="No such headword"
            right="404"
          />
        }
      >
        <Seo title="Tag not found | Fezcodex" />
        <section className="pt-16 md:pt-24 pb-10">
          <Link to="/tags" className={`${BACK_LINK} mb-10`}>
            ← All tags
          </Link>
          <div className="font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#2E2620]/60 mb-4">
            404 · tag not found
          </div>
          <h1
            className="font-fraunces text-[40px] sm:text-[56px] md:text-[80px] leading-[0.95] tracking-[-0.03em] text-[#1A1613] break-words"
            style={{
              fontVariationSettings:
                '"opsz" 144, "SOFT" 30, "WONK" 1, "wght" 460',
            }}
          >
            No tag <ChapterEm>“{view.rawTag}”</ChapterEm>
          </h1>
          <p
            className="mt-6 font-fraunces italic text-[19px] leading-[1.4] text-[#2E2620] max-w-[40ch]"
            style={{
              fontVariationSettings: '"opsz" 48, "SOFT" 100, "wght" 380',
            }}
          >
            Nothing is filed under that tag.{' '}
            <Link
              to="/tags"
              className="text-[#9E4A2F] underline decoration-[#C96442]/40 underline-offset-4 hover:decoration-[#C96442]"
            >
              Browse all tags
            </Link>
            .
          </p>
        </section>
      </Page>
    );

  const { meta } = view;
  const stats = TAG_TYPES.filter((t) => meta[t.plural] > 0);

  return (
    <Page
      strip={
        <TerracottaStrip
          left="Folio IX · index"
          center="A filed headword"
          right={`${view.items.length} of ${view.typeCounts.all}`}
        />
      }
    >
      <Seo
        title={`${view.title} | Tags | Fezcodex`}
        description={
          meta.description ||
          `Posts, logs and projects tagged ${meta.label} on Fezcodex.`
        }
        canonicalPath={tagPath(view.slug)}
      />

      {/* hero */}
      <section className="pt-16 md:pt-24 pb-10">
        <Link to="/tags" className={`${BACK_LINK} mb-10`}>
          ← All tags
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
          <div className="min-w-0">
            <div className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F] mb-6 flex items-center gap-3">
              <span>Tagged · §</span>
              <span
                aria-hidden="true"
                className="h-px flex-1 max-w-[60px] bg-[#9E4A2F]/50"
              />
              <span className="truncate">/{view.slug}/</span>
            </div>
            <h1
              className="font-fraunces text-[48px] sm:text-[64px] md:text-[96px] leading-[0.92] tracking-[-0.03em] text-[#1A1613] break-words"
              style={{
                fontVariationSettings:
                  '"opsz" 144, "SOFT" 30, "WONK" 1, "wght" 460',
              }}
            >
              {meta.label}
              <span
                aria-hidden="true"
                className="text-[#C96442]"
                style={{ fontVariationSettings: '"wght" 800' }}
              >
                .
              </span>
            </h1>
            {meta.description && (
              <p
                className="mt-5 font-fraunces italic text-[19px] md:text-[22px] leading-[1.4] text-[#2E2620] max-w-[48ch]"
                style={{
                  fontVariationSettings: '"opsz" 28, "SOFT" 100, "wght" 360',
                }}
              >
                {meta.description}
              </p>
            )}
          </div>

          <aside className="md:border-l border-[#1A161320] md:pl-10">
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1A161320]">
              {stats.map((t) => (
                <TerracottaSpec
                  key={t.key}
                  label={
                    <span className="inline-flex items-center gap-2">
                      <Dot color={TYPE_COLOR[t.key]} />
                      {t.label}
                    </span>
                  }
                  value={`${meta[t.plural]} ${
                    meta[t.plural] === 1 ? t.one.toLowerCase() : t.plural
                  }`}
                />
              ))}
              <TerracottaSpec label="In all" value={`${meta.count}`} />
            </div>
          </aside>
        </div>
      </section>

      {/* active filters */}
      {view.extra.length > 0 && (
        <div
          className="flex items-center gap-2 flex-wrap py-4 border-t border-[#1A161320]"
          aria-label="Active tag filters"
        >
          <span className="mr-1 font-ibm-plex-mono text-[10px] tracking-[0.2em] uppercase text-[#2E2620]/60">
            Filtered by
          </span>
          {view.active.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 max-w-full font-ibm-plex-mono text-[9.5px] tracking-[0.18em] uppercase pl-2 pr-1 py-1 border border-[#9E4A2F] bg-[#9E4A2F]/10 text-[#9E4A2F]"
            >
              <span className="break-words min-w-0">{view.labelOf(tag)}</span>
              <Link
                to={view.removeHref(tag)}
                aria-label={`Remove ${view.labelOf(tag)}`}
                className="px-1 text-[12px] leading-none text-[#9E4A2F] hover:bg-[#9E4A2F] hover:text-[#F3ECE0] transition-colors"
              >
                ×
              </Link>
            </span>
          ))}
        </div>
      )}

      {/* type tabs */}
      <section className="sticky top-0 z-30 py-4 bg-[#F3ECE0]/90 backdrop-blur-md border-y border-[#1A161320]">
        <div
          className="flex items-center gap-1.5 flex-wrap"
          role="group"
          aria-label="Content type"
        >
          <span className="mr-1 font-ibm-plex-mono text-[10px] tracking-[0.2em] uppercase text-[#2E2620]/60">
            Type
          </span>
          {view.types.map((t) => {
            const on = view.type === t.key;
            return (
              <button
                key={t.key}
                type="button"
                aria-pressed={on}
                disabled={t.key !== 'all' && view.typeCounts[t.key] === 0}
                onClick={() => view.setType(t.key)}
                className={`inline-flex items-center gap-1.5 font-ibm-plex-mono text-[9.5px] tracking-[0.18em] uppercase px-2 py-1 border transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C96442] disabled:opacity-40 disabled:cursor-not-allowed ${
                  on
                    ? 'border-[#1A1613] bg-[#1A1613] text-[#F3ECE0]'
                    : 'border-[#1A161320] text-[#2E2620] enabled:hover:border-[#C96442] enabled:hover:text-[#9E4A2F]'
                }`}
              >
                {t.key !== 'all' && <Dot color={TYPE_COLOR[t.key]} />}
                {t.label}
                <span
                  className={on ? 'text-[#F3ECE0]/70' : 'text-[#2E2620]/55'}
                >
                  {view.typeCounts[t.key]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 pt-16">
        <section className="min-w-0" aria-label="Tagged items">
          <TerracottaChapter
            numeral="I"
            label="The slips"
            title={
              <>
                Filed <ChapterEm>under.</ChapterEm>
              </>
            }
            blurb="Each slip bears its kind, a date, and the threads it carries."
          />

          {view.items.length === 0 ? (
            <div className="py-24 text-center border-t border-[#1A161320]">
              <p className="font-fraunces italic text-[22px] text-[#2E2620]/60">
                Nothing here carries all of these tags.
              </p>
            </div>
          ) : (
            <ol className="border-t border-[#1A1613]/25">
              {view.items.map((item) => (
                <ItemRow key={item.id} item={item} view={view} />
              ))}
            </ol>
          )}
        </section>

        {view.related.length > 0 && (
          <aside
            className="lg:sticky lg:top-24 self-start border border-dashed border-[#1A161320] p-6"
            aria-label="Narrow by another tag"
          >
            <h2 className="font-ibm-plex-mono text-[10px] tracking-[0.24em] uppercase text-[#9E4A2F] mb-3 pb-3 border-b border-[#1A161320]">
              Narrow by
            </h2>
            <p
              className="mb-4 font-fraunces italic text-[14px] leading-[1.45] text-[#2E2620]"
              style={{
                fontVariationSettings: '"opsz" 18, "SOFT" 100, "wght" 360',
              }}
            >
              Tags that appear alongside {view.title}. Each one narrows the
              list.
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {view.related.map(([tag, count]) => (
                <li key={tag} className="min-w-0">
                  <Link
                    to={view.addHref(tag)}
                    className="group inline-flex items-baseline gap-1.5 max-w-full font-ibm-plex-mono text-[9.5px] tracking-[0.14em] uppercase px-1.5 py-0.5 border border-[#1A161320] text-[#2E2620] hover:border-[#9E4A2F] hover:text-[#9E4A2F] transition-colors"
                  >
                    <span className="break-words min-w-0">
                      + {view.labelOf(tag)}
                    </span>
                    <span className="text-[#2E2620]/55 group-hover:text-[#9E4A2F]">
                      {count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      <TerracottaColophon
        signature={
          <>
            <span>© {new Date().getFullYear()} · Fezcode</span>
            <span>Tag · {meta.label}</span>
          </>
        }
      />
    </Page>
  );
}
