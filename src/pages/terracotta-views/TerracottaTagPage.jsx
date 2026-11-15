import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';
import {
  TerracottaStrip,
  ChapterEm,
  TerracottaMark,
  TerracottaColophon,
} from '../../components/terracotta';
import './terracotta-tags.css';

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

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const FLEURON = { post: '❦', log: '⁂', project: '❧' };

const BACK_LINK =
  'inline-flex items-center gap-2 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#2E2620]/70 hover:text-[#9E4A2F] transition-colors';

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const letterOf = (label) => {
  const ch = (label || '').charAt(0).toLocaleUpperCase('en');
  return /\p{L}/u.test(ch) ? ch : '#';
};

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

/* A numbered catalogue entry inside a chapter. */
const CatalogueEntry = ({ no, item, view }) => (
  <li className="group grid grid-cols-[2.25rem_1fr] sm:grid-cols-[3rem_1fr] gap-x-3 sm:gap-x-4 py-6 md:py-7 border-b border-dotted border-[#1A161330]">
    <span
      aria-hidden="true"
      className="tc-onum font-fraunces text-[20px] md:text-[24px] leading-[1.2] text-[#9E4A2F] text-right"
    >
      {no}.
    </span>
    <div className="min-w-0">
      <h3
        className="font-fraunces italic text-[21px] md:text-[27px] leading-[1.18] tracking-[-0.01em] text-[#1A1613] break-words"
        style={{
          fontVariationSettings: '"opsz" 36, "SOFT" 100, "WONK" 1, "wght" 400',
        }}
      >
        <Link
          to={item.path}
          className="underline decoration-transparent underline-offset-[5px] hover:text-[#9E4A2F] hover:decoration-[#C96442]/50 focus:outline-none focus-visible:text-[#9E4A2F] focus-visible:decoration-[#C96442] transition-colors"
        >
          {item.title}
        </Link>
      </h3>

      <p className="mt-1.5 font-fraunces tc-smcp tc-onum text-[13.5px] text-[#2E2620]/80 flex flex-wrap gap-x-2">
        <span style={{ color: TYPE_COLOR[item.type] }}>
          {typeByKey[item.type].one}
        </span>
        {item.date && (
          <>
            <span aria-hidden="true">·</span>
            <time dateTime={item.date}>{formatDate(item.date)}</time>
          </>
        )}
        {item.category && (
          <>
            <span aria-hidden="true">·</span>
            <span className="break-all">{item.category}</span>
          </>
        )}
      </p>

      {item.series && (
        <p
          className="mt-1 font-fraunces italic text-[15px] text-[#2E2620]"
          style={{ fontVariationSettings: '"opsz" 18, "SOFT" 100, "wght" 360' }}
        >
          Part of <span className="text-[#9E4A2F]">{item.series}</span>
        </p>
      )}

      {item.description && (
        <p
          className="mt-2.5 font-fraunces text-[15.5px] md:text-[16.5px] leading-[1.55] text-[#2E2620] max-w-[64ch]"
          style={{ fontVariationSettings: '"opsz" 14, "SOFT" 50, "wght" 360' }}
        >
          {item.description}
        </p>
      )}

      {item.tags.length > 0 && (
        <ul
          className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-fraunces italic text-[14.5px]"
          aria-label="Tags"
        >
          {item.tags.map((tag) => {
            const on = view.active.includes(tag);
            return (
              <li key={tag} className="min-w-0">
                <Link
                  to={tagPath(tag)}
                  aria-current={on ? 'true' : undefined}
                  className={`break-words transition-colors focus:outline-none focus-visible:underline ${
                    on
                      ? 'px-1 bg-[#9E4A2F] text-[#F3ECE0] not-italic hover:bg-[#C96442]'
                      : 'text-[#9E4A2F] hover:text-[#C96442] underline decoration-transparent underline-offset-4 hover:decoration-[#C96442]/50'
                  }`}
                >
                  #{view.labelOf(tag)}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  </li>
);

/** Terracotta /tags/:tag: a folio, with one chapter per content type. */
export default function TerracottaTagPage({ view }) {
  const isReady = view.status === 'ready' && view.meta;

  // Chapter numerals follow the types present for this tag set, so a chapter
  // keeps its number when the contents filter hides its neighbours.
  const chapters = useMemo(() => {
    if (!isReady) return [];
    const present = TAG_TYPES.filter((t) => view.typeCounts[t.key] > 0);
    return present
      .map((t, i) => ({
        type: t,
        numeral: ROMAN[i] || `${i + 1}`,
        items: view.items.filter((item) => item.type === t.key),
      }))
      .filter((c) => c.items.length > 0);
  }, [isReady, view.items, view.typeCounts]);

  // The book index of related threads, alphabetised and grouped by letter.
  const indexGroups = useMemo(() => {
    if (!isReady) return [];
    const sorted = [...view.related].sort((a, b) =>
      view.labelOf(a[0]).localeCompare(view.labelOf(b[0])),
    );
    const groups = new Map();
    sorted.forEach((entry) => {
      const key = letterOf(view.labelOf(entry[0]));
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(entry);
    });
    return [...groups];
    // labelOf is recreated each render but depends only on the index.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, view.related]);

  if (view.status === 'error')
    return (
      <Page
        strip={
          <TerracottaStrip
            left="Folio IX · catalogue"
            center="Tag"
            right="Error"
          />
        }
      >
        <div className="py-24 text-center">
          <div aria-hidden="true" className="text-[#C96442] text-[22px] mb-4">
            ⁂
          </div>
          <p className="font-fraunces italic text-[22px] text-[#2E2620]/70">
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

  if (view.status === 'missing' || !view.meta)
    return (
      <Page
        strip={
          <TerracottaStrip
            left="Folio IX · catalogue"
            center="No such folio"
            right="404"
          />
        }
      >
        <Seo title="Tag not found | Fezcodex" />
        <section className="pt-16 md:pt-24 pb-10 text-center">
          <div className="text-left">
            <Link to="/tags" className={BACK_LINK}>
              ← All tags
            </Link>
          </div>
          <div className="mt-12 font-ibm-plex-mono text-[10px] tracking-[0.3em] uppercase text-[#9E4A2F]">
            404 · tag not found
          </div>
          <div aria-hidden="true" className="my-6 text-[#C96442] text-[22px]">
            ❦
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
            className="mt-6 mx-auto font-fraunces italic text-[19px] leading-[1.4] text-[#2E2620] max-w-[40ch]"
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
  const [primary, ...bound] = view.active;

  const activeChip = (tag) => (
    <span className="inline-flex items-baseline gap-1 max-w-full">
      <span className="font-fraunces italic text-[#9E4A2F] break-words min-w-0">
        {view.labelOf(tag)}
      </span>
      <Link
        to={view.removeHref(tag)}
        aria-label={`Remove ${view.labelOf(tag)}`}
        className="px-1 not-italic font-ibm-plex-mono text-[13px] leading-none text-[#9E4A2F] hover:bg-[#9E4A2F] hover:text-[#F3ECE0] focus:outline-none focus-visible:bg-[#9E4A2F] focus-visible:text-[#F3ECE0] transition-colors"
      >
        ×
      </Link>
    </span>
  );

  return (
    <Page
      strip={
        <TerracottaStrip
          left="Folio IX · catalogue"
          center={`Folio · ${meta.label}`}
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

      <div className="pt-10 md:pt-14">
        <Link to="/tags" className={BACK_LINK}>
          ← All tags
        </Link>
      </div>

      {/* title page */}
      <section
        aria-label="Title page"
        className="mt-8 md:mt-10 border-y-[3px] border-double border-[#1A1613]/40 px-2 sm:px-6 py-14 md:py-20 text-center"
      >
        <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.3em] uppercase text-[#9E4A2F]">
          A folio of the thread
        </div>
        <div
          aria-hidden="true"
          className="mx-auto mt-5 mb-7 h-px w-20 bg-[#1A1613]/30"
        />
        <h1
          className="font-fraunces italic text-[48px] sm:text-[72px] md:text-[112px] leading-[0.9] tracking-[-0.03em] text-[#1A1613] break-words"
          style={{
            fontVariationSettings:
              '"opsz" 144, "SOFT" 80, "WONK" 1, "wght" 420',
          }}
        >
          {meta.label}
        </h1>
        <p
          className="mt-6 font-fraunces italic text-[18px] md:text-[21px] text-[#2E2620]"
          style={{ fontVariationSettings: '"opsz" 24, "SOFT" 100, "wght" 340' }}
        >
          a catalogue of{' '}
          <span className="not-italic tc-onum text-[#9E4A2F]">
            {meta.count}
          </span>{' '}
          {meta.count === 1 ? 'entry' : 'entries'}
        </p>
        {stats.length > 0 && (
          <p className="mt-2 font-fraunces tc-smcp tc-onum text-[14px] text-[#2E2620]/80">
            comprising{' '}
            {stats.map((t, i) => (
              <React.Fragment key={t.key}>
                {i > 0 && (i === stats.length - 1 ? ' & ' : ', ')}
                <span style={{ color: TYPE_COLOR[t.key] }}>
                  {meta[t.plural]}{' '}
                  {meta[t.plural] === 1 ? t.one.toLowerCase() : t.plural}
                </span>
              </React.Fragment>
            ))}
          </p>
        )}

        {meta.description && (
          <blockquote className="mt-10 mx-auto max-w-[44ch]">
            <div aria-hidden="true" className="text-[#C96442] text-[18px] mb-3">
              ❦
            </div>
            <p
              className="font-fraunces italic text-[17px] md:text-[20px] leading-[1.5] text-[#2E2620]"
              style={{
                fontVariationSettings: '"opsz" 24, "SOFT" 100, "wght" 340',
              }}
            >
              {meta.description}
            </p>
          </blockquote>
        )}

        {view.extra.length > 0 && (
          <div
            className="mt-10 pt-6 mx-auto max-w-[640px] border-t border-[#1A161320] font-fraunces text-[17px] md:text-[18px] leading-[1.6] text-[#2E2620]"
            aria-label="Active tag filters"
          >
            <p className="flex flex-wrap justify-center items-baseline gap-x-2 gap-y-1">
              <span className="tc-smcp text-[14px] text-[#2E2620]/70">
                Filed under
              </span>
              {activeChip(primary)}
              <span className="tc-smcp text-[14px] text-[#2E2620]/70">
                bound with
              </span>
              {bound.map((tag, i) => (
                <React.Fragment key={tag}>
                  {i > 0 && <span aria-hidden="true">&amp;</span>}
                  {activeChip(tag)}
                </React.Fragment>
              ))}
            </p>
            <p className="mt-2 font-fraunces italic text-[15px] text-[#2E2620]/70">
              <span className="not-italic tc-onum">{view.typeCounts.all}</span>{' '}
              {view.typeCounts.all === 1 ? 'entry carries' : 'entries carry'}{' '}
              every one of these threads.
            </p>
          </div>
        )}
      </section>

      {/* contents: the type tabs */}
      <nav
        aria-label="Contents"
        className="mt-10 md:sticky md:top-0 z-30 bg-[#F3ECE0]/95 backdrop-blur-md py-4 border-b border-[#1A161320]"
      >
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h2 className="font-ibm-plex-mono text-[10px] tracking-[0.3em] uppercase text-[#1A1613]">
            Contents
          </h2>
          <span className="font-fraunces italic text-[13px] text-[#2E2620]/60 hidden sm:inline">
            choose the chapters to show
          </span>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6"
          role="group"
          aria-label="Content type"
        >
          {view.types.map((t) => {
            const on = view.type === t.key;
            const count = view.typeCounts[t.key];
            return (
              <button
                key={t.key}
                type="button"
                aria-pressed={on}
                disabled={t.key !== 'all' && count === 0}
                onClick={() => view.setType(t.key)}
                className={`tc-entry w-full text-left font-fraunces disabled:opacity-35 disabled:cursor-not-allowed focus-visible:ring-1 focus-visible:ring-[#C96442] ${
                  on ? 'text-[#9E4A2F]' : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-[13px] h-[13px] border border-[#1A1613]/70 shrink-0 self-center"
                >
                  {on && (
                    <span
                      className="block w-[7px] h-[7px]"
                      style={{ backgroundColor: TYPE_COLOR[t.key] }}
                    />
                  )}
                </span>
                <span
                  className={`tc-entry-name text-[17px] ${on ? 'text-[#9E4A2F]' : ''}`}
                  style={{
                    fontVariationSettings: `"opsz" 18, "SOFT" 100, "wght" ${on ? 480 : 380}`,
                  }}
                >
                  {t.key === 'all' ? 'All chapters' : t.label}
                </span>
                <span aria-hidden="true" className="tc-leader" />
                <span className="tc-entry-count tc-onum text-[17px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* chapters */}
      <section className="pt-16 md:pt-20" aria-label="Tagged items">
        {view.items.length === 0 ? (
          <div className="py-20 text-center">
            <div aria-hidden="true" className="text-[#C96442] text-[22px] mb-4">
              ⁂
            </div>
            <p className="font-fraunces italic text-[20px] md:text-[22px] text-[#2E2620]/70">
              Nothing here carries all of these tags.
            </p>
          </div>
        ) : (
          chapters.map((c, idx) => (
            <section
              key={c.type.key}
              aria-labelledby={`tc-chapter-${c.type.key}`}
              className={idx === 0 ? '' : 'mt-20 md:mt-24'}
            >
              <header className="text-center pb-8 md:pb-10">
                <div
                  aria-hidden="true"
                  className="text-[#C96442] text-[22px] leading-none mb-5"
                >
                  {FLEURON[c.type.key] || '❦'}
                </div>
                <h2
                  id={`tc-chapter-${c.type.key}`}
                  className="font-fraunces text-[32px] sm:text-[40px] md:text-[52px] leading-[1] tracking-[-0.02em] text-[#1A1613]"
                  style={{
                    fontVariationSettings:
                      '"opsz" 80, "SOFT" 60, "WONK" 1, "wght" 400',
                  }}
                >
                  <span className="block sm:inline font-ibm-plex-mono text-[11px] sm:text-[0.32em] tracking-[0.28em] uppercase text-[#9E4A2F] align-middle sm:mr-3 mb-2 sm:mb-0">
                    Chapter {c.numeral} —
                  </span>
                  <ChapterEm>{c.type.label}</ChapterEm>
                </h2>
                <p className="mt-3 font-fraunces tc-smcp tc-onum text-[13px] text-[#2E2620]/70">
                  {plural(
                    c.items.length,
                    c.type.one.toLowerCase(),
                    c.type.plural,
                  )}{' '}
                  under {view.title}
                </p>
              </header>
              <ol className="border-t border-[#1A1613]/30">
                {c.items.map((item, i) => (
                  <CatalogueEntry
                    key={item.id}
                    no={i + 1}
                    item={item}
                    view={view}
                  />
                ))}
              </ol>
            </section>
          ))
        )}
      </section>

      {/* index of related threads */}
      {view.related.length > 0 && (
        <section
          aria-labelledby="tc-related-title"
          className="mt-24 pt-10 border-t-[3px] border-double border-[#1A1613]/40"
        >
          <header className="text-center pb-8">
            <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.3em] uppercase text-[#9E4A2F]">
              Index
            </div>
            <h2
              id="tc-related-title"
              className="mt-2 font-fraunces italic text-[30px] sm:text-[36px] md:text-[44px] leading-[1.05] text-[#1A1613]"
              style={{
                fontVariationSettings:
                  '"opsz" 72, "SOFT" 100, "WONK" 1, "wght" 380',
              }}
            >
              Index of related threads
            </h2>
            <p
              className="mt-3 mx-auto max-w-[48ch] font-fraunces italic text-[15px] md:text-[16px] leading-[1.45] text-[#2E2620]"
              style={{
                fontVariationSettings: '"opsz" 18, "SOFT" 100, "wght" 340',
              }}
            >
              Threads that run alongside {view.title}. Follow one to bind it
              into this folio and narrow the catalogue; figures give the entries
              shared.
            </p>
          </header>
          <div className="tc-index">
            {indexGroups.map(([letter, entries]) => (
              <div key={letter} className="tc-index-group">
                <h3
                  className="font-fraunces text-[22px] leading-none text-[#9E4A2F] mb-2 pb-1 border-b border-[#1A161320]"
                  style={{ fontVariationSettings: '"opsz" 36, "wght" 520' }}
                >
                  {letter}
                </h3>
                <ul>
                  {entries.map(([tag, count]) => (
                    <li
                      key={tag}
                      className="tc-index-entry font-fraunces text-[16px] leading-[1.6] text-[#2E2620]"
                    >
                      <Link
                        to={view.addHref(tag)}
                        aria-label={`Narrow by ${view.labelOf(tag)}, ${plural(count, 'entry', 'entries')}`}
                        className="group/ix focus:outline-none"
                      >
                        <span className="italic break-words group-hover/ix:text-[#9E4A2F] group-focus-visible/ix:text-[#9E4A2F] underline decoration-transparent underline-offset-4 group-hover/ix:decoration-[#C96442]/50 transition-colors">
                          {view.labelOf(tag)}
                        </span>
                        <span aria-hidden="true">, </span>
                        <span
                          aria-hidden="true"
                          className="tc-onum text-[#2E2620]/70 group-hover/ix:text-[#9E4A2F]"
                        >
                          {count}
                        </span>
                        <span
                          aria-hidden="true"
                          className="ml-1 font-ibm-plex-mono text-[10px] text-[#9E4A2F] opacity-0 group-hover/ix:opacity-100 group-focus-visible/ix:opacity-100 transition-opacity"
                        >
                          +
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <TerracottaColophon
        signature={
          <>
            <span>© {new Date().getFullYear()} · Fezcode</span>
            <span>Folio · {meta.label}</span>
          </>
        }
      />
    </Page>
  );
}
