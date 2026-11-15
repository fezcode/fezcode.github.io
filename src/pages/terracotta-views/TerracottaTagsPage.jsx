import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
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

// Emphasis 1..4 from sizeFor: heavier threads are set a touch larger/bolder.
const SIZE_CLASS = {
  1: 'text-[17px] md:text-[18px]',
  2: 'text-[18px] md:text-[19px]',
  3: 'text-[19px] md:text-[21px]',
  4: 'text-[20px] md:text-[23px]',
};
const SIZE_WEIGHT = { 1: 360, 2: 400, 3: 440, 4: 500 };

// The three chapters by weight, by the count shown for the selected type.
const WEIGHT_CHAPTERS = [
  {
    id: 'heavy',
    numeral: 'I',
    title: 'Heavy threads',
    fleuron: '❦',
    blurb: 'The load-bearing threads, each drawn through ten or more entries.',
    test: (n) => n >= 10,
  },
  {
    id: 'middling',
    numeral: 'II',
    title: 'Middling threads',
    fleuron: '⁂',
    blurb: 'Threads of moderate weight, carried by three to nine entries.',
    test: (n) => n >= 3 && n <= 9,
  },
  {
    id: 'light',
    numeral: 'III',
    title: 'Light threads',
    fleuron: '❧',
    blurb: 'Lighter work: threads that bind exactly two entries together.',
    test: (n) => n === 2,
  },
];

const letterOf = (label) => {
  const ch = (label || '').charAt(0).toLocaleUpperCase('en');
  return /\p{L}/u.test(ch) ? ch : '#';
};

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/* A small-caps form label, as on a printed order slip. */
const FormLabel = ({ children }) => (
  <span className="font-fraunces tc-smcp text-[13px] text-[#9E4A2F] shrink-0">
    {children}
  </span>
);

/* A printed tick box toggle. */
const FormOption = ({ on, onClick, children, color }) => (
  <button
    type="button"
    aria-pressed={on}
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-1.5 py-1 font-fraunces italic text-[15px] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C96442] ${
      on ? 'text-[#1A1613]' : 'text-[#2E2620]/70 hover:text-[#9E4A2F]'
    }`}
    style={{ fontVariationSettings: '"opsz" 18, "SOFT" 100, "wght" 380' }}
  >
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center w-[13px] h-[13px] border border-[#1A1613]/70 not-italic shrink-0"
    >
      {on && (
        <span
          className="block w-[7px] h-[7px]"
          style={{ backgroundColor: color || '#1A1613' }}
        />
      )}
    </span>
    {children}
  </button>
);

/* A centred printed chapter opening: fleuron, numeral, italic title, blurb. */
const ChapterHead = ({ id, numeral, title, fleuron, blurb, tally }) => (
  <header className="text-center pb-8 md:pb-10">
    <div
      aria-hidden="true"
      className="text-[#C96442] text-[22px] leading-none mb-5 select-none"
    >
      {fleuron}
    </div>
    {numeral && (
      <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.3em] uppercase text-[#9E4A2F] mb-2">
        Chapter {numeral}
      </div>
    )}
    <h2
      id={`${id}-title`}
      className="font-fraunces italic text-[34px] sm:text-[40px] md:text-[52px] leading-[1] tracking-[-0.02em] text-[#1A1613] break-words"
      style={{
        fontVariationSettings: '"opsz" 80, "SOFT" 100, "WONK" 1, "wght" 380',
      }}
    >
      {numeral && (
        <span className="not-italic text-[#9E4A2F]">{numeral}. </span>
      )}
      {title}
    </h2>
    {blurb && (
      <p
        className="mt-3 mx-auto max-w-[46ch] font-fraunces italic text-[16px] md:text-[17px] leading-[1.45] text-[#2E2620]"
        style={{ fontVariationSettings: '"opsz" 18, "SOFT" 100, "wght" 340' }}
      >
        {blurb}
      </p>
    )}
    {tally && (
      <p className="mt-3 font-fraunces tc-smcp tc-onum text-[13px] text-[#2E2620]/70">
        {tally}
      </p>
    )}
  </header>
);

/* One catalogue entry: number, italic tag, dotted rule, old-style count. */
const Entry = ({ no, to, label, count, size = 1 }) => (
  <li>
    <Link
      to={to}
      className="tc-entry font-fraunces"
      aria-label={
        count != null ? `${label}, ${plural(count, 'entry', 'entries')}` : label
      }
    >
      <span
        aria-hidden="true"
        className="tc-entry-no tc-onum font-fraunces text-[13px]"
      >
        {no}.
      </span>
      <span
        className={`tc-entry-name leading-[1.25] ${SIZE_CLASS[size]}`}
        style={{
          fontVariationSettings: `"opsz" 24, "SOFT" 100, "WONK" 1, "wght" ${SIZE_WEIGHT[size]}`,
        }}
      >
        {label}
      </span>
      {count != null && (
        <>
          <span aria-hidden="true" className="tc-leader" />
          <span
            aria-hidden="true"
            className="tc-entry-count tc-onum text-[17px] md:text-[18px]"
          >
            {count}
          </span>
        </>
      )}
    </Link>
  </li>
);

const Notice = ({ children }) => (
  <div className="py-20 text-center">
    <div aria-hidden="true" className="text-[#C96442] text-[22px] mb-4">
      ⁂
    </div>
    <p className="font-fraunces italic text-[20px] md:text-[22px] text-[#2E2620]/70">
      {children}
    </p>
  </div>
);

/** Terracotta /tags: a printed catalogue of threads, in chapters by weight. */
export default function TerracottaTagsPage({ view }) {
  const ready = view.status === 'ready';
  const shown = view.shared.length + view.single.length;
  const searching = Boolean(view.query);
  const typeLabel = view.types.find((t) => t.key === view.type)?.label || 'All';

  // Chapters: search results, alphabetical sections, or chapters by weight.
  const chapters = useMemo(() => {
    let list;
    if (searching) {
      list = [
        {
          id: 'results',
          numeral: '',
          title: 'Search results',
          fleuron: '⁂',
          blurb: `Threads answering to “${view.query}”.`,
          tags: view.shared,
        },
      ];
    } else if (view.sort === 'az') {
      const groups = new Map();
      view.shared.forEach((tag) => {
        const key = letterOf(tag.label);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(tag);
      });
      list = [...groups].map(([letter, tags]) => ({
        id: `letter-${letter === '#' ? 'num' : letter}`,
        numeral: '',
        title: letter === '#' ? 'Figures & signs' : letter,
        fleuron: '⁂',
        blurb: '',
        tags,
      }));
    } else {
      list = WEIGHT_CHAPTERS.map((c) => ({
        ...c,
        tags: view.shared.filter((tag) => c.test(tag.shown)),
      })).filter((c) => c.tags.length > 0);
    }
    // Running entry numbers carry across chapters, as in a printed catalogue.
    let start = 1;
    return list.map((c) => {
      const out = { ...c, start };
      start += c.tags.length;
      return out;
    });
  }, [searching, view.query, view.sort, view.shared]);

  const appendixStart = chapters.reduce((n, c) => n + c.tags.length, 0) + 1;
  const sectionId = (c) => `tc-ch-${c.id}`;

  return (
    <div
      className="min-h-screen relative text-[#1A1613] font-fraunces selection:bg-[#C96442]/25"
      style={{
        background: '#F3ECE0',
        backgroundImage: PAPER_GRADIENT,
        fontFeatureSettings: '"ss01", "ss02", "kern"',
      }}
    >
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.32] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <main className="relative z-10 mx-auto max-w-[1080px] px-5 sm:px-6 md:px-14 pb-[120px]">
        <TerracottaStrip
          left="Folio IX · catalogue"
          center="Every thread in the archive"
          right={ready ? `${shown} of ${view.totalTags}` : '—'}
        />

        {/* title page */}
        <section className="pt-16 md:pt-24 pb-12 md:pb-16 text-center">
          <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.3em] uppercase text-[#9E4A2F]">
            Fezcodex · Folio IX
          </div>
          <div
            aria-hidden="true"
            className="mx-auto mt-6 mb-8 h-px w-24 bg-[#1A1613]/30"
          />
          <p
            className="font-fraunces italic text-[18px] md:text-[20px] text-[#2E2620]"
            style={{
              fontVariationSettings: '"opsz" 24, "SOFT" 100, "wght" 340',
            }}
          >
            The
          </p>
          <h1
            className="font-fraunces text-[56px] sm:text-[80px] md:text-[120px] leading-[0.88] tracking-[-0.035em] text-[#1A1613]"
            style={{
              fontVariationSettings:
                '"opsz" 144, "SOFT" 30, "WONK" 1, "wght" 460',
            }}
          >
            Catalogue
            <br />
            <span className="text-[0.55em]">
              of <ChapterEm>threads</ChapterEm>
              <span
                aria-hidden="true"
                className="text-[#C96442]"
                style={{ fontVariationSettings: '"wght" 800' }}
              >
                .
              </span>
            </span>
          </h1>
          <p
            className="mt-8 mx-auto max-w-[40ch] font-fraunces italic text-[17px] md:text-[19px] leading-[1.45] text-[#2E2620]"
            style={{
              fontVariationSettings: '"opsz" 24, "SOFT" 100, "wght" 360',
            }}
          >
            {ready ? (
              <>
                being an index of{' '}
                <span className="not-italic tc-onum text-[#9E4A2F]">
                  {view.totalTags}
                </span>{' '}
                tags across{' '}
                <span className="not-italic tc-onum text-[#9E4A2F]">
                  {view.totalItems}
                </span>{' '}
                posts, logs and projects. Choose a thread to see everything
                bound with it.
              </>
            ) : (
              'The catalogue is being set in type.'
            )}
          </p>

          {/* contents */}
          {ready && (chapters.length > 0 || view.single.length > 0) && (
            <nav
              aria-label="Contents"
              className="mt-10 mx-auto max-w-[720px] border-y border-[#1A161320] py-4"
            >
              <div className="font-fraunces tc-smcp text-[13px] text-[#9E4A2F] mb-2">
                Contents
              </div>
              <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                {chapters.map((c) => (
                  <li key={c.id}>
                    <a
                      href={`#${sectionId(c)}`}
                      className="font-fraunces italic text-[15px] text-[#2E2620] hover:text-[#9E4A2F] underline decoration-transparent hover:decoration-[#C96442]/50 underline-offset-4 transition-colors"
                    >
                      {c.numeral && (
                        <span className="not-italic text-[#9E4A2F]">
                          {c.numeral}.{' '}
                        </span>
                      )}
                      {c.title}
                    </a>
                  </li>
                ))}
                {view.single.length > 0 && (
                  <li>
                    <a
                      href="#tc-ch-appendix"
                      className="font-fraunces italic text-[15px] text-[#2E2620] hover:text-[#9E4A2F] underline decoration-transparent hover:decoration-[#C96442]/50 underline-offset-4 transition-colors"
                    >
                      Appendix
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </section>

        {/* refine form */}
        <section
          aria-label="Refine the catalogue"
          className="md:sticky md:top-0 z-30 bg-[#F3ECE0]/95 backdrop-blur-md border-y-[3px] border-double border-[#1A1613]/40 py-4"
        >
          <div className="flex items-baseline justify-between gap-3 mb-3">
            <h2 className="font-ibm-plex-mono text-[10px] tracking-[0.3em] uppercase text-[#1A1613]">
              Refine the catalogue
            </h2>
            <span className="font-fraunces italic text-[13px] text-[#2E2620]/60 hidden sm:inline">
              Form IX · fill as required
            </span>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-8">
            <label className="flex items-baseline gap-3 flex-1 min-w-0">
              <FormLabel>Containing</FormLabel>
              <input
                type="search"
                value={view.query}
                onChange={(event) => view.setQuery(event.target.value)}
                placeholder="a word or part of one…"
                aria-label="Search tags"
                className="flex-1 min-w-0 bg-transparent border-0 border-b border-dotted border-[#1A1613]/50 focus:border-[#C96442] focus:outline-none px-1 py-1 font-fraunces italic text-[18px] text-[#1A1613] placeholder:text-[#2E2620]/35"
                style={{
                  fontVariationSettings: '"opsz" 24, "SOFT" 100, "wght" 360',
                }}
              />
            </label>
            <div
              className="flex items-center gap-x-1 gap-y-1 flex-wrap"
              role="group"
              aria-label="Content type"
            >
              <span className="mr-1">
                <FormLabel>Of kind</FormLabel>
              </span>
              {view.types.map((t) => (
                <FormOption
                  key={t.key}
                  on={view.type === t.key}
                  onClick={() => view.setType(t.key)}
                  color={TYPE_COLOR[t.key]}
                >
                  {t.label}
                </FormOption>
              ))}
            </div>
            <div
              className="flex items-center gap-x-1 gap-y-1 flex-wrap"
              role="group"
              aria-label="Sort tags"
            >
              <span className="mr-1">
                <FormLabel>Arranged</FormLabel>
              </span>
              <FormOption
                on={view.sort === 'count'}
                onClick={() => view.setSort('count')}
              >
                by weight
              </FormOption>
              <FormOption
                on={view.sort === 'az'}
                onClick={() => view.setSort('az')}
              >
                A–Z
              </FormOption>
            </div>
          </div>
        </section>

        {/* the catalogue */}
        <div className="pt-16 md:pt-20">
          {view.status === 'error' && <Notice>{view.error}</Notice>}
          {view.status === 'loading' && (
            <div className="py-24 flex flex-col items-center gap-5">
              <TerracottaMark size={44} color="#C96442" sway />
              <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.32em] uppercase text-[#2E2620]/80">
                Loading tags…
              </span>
            </div>
          )}
          {ready && shown === 0 && (
            <Notice>
              {searching
                ? `No thread in the catalogue answers to “${view.query}”.`
                : `No threads of kind “${typeLabel}”.`}
            </Notice>
          )}

          {chapters.map((c, idx) => (
            <section
              key={c.id}
              id={sectionId(c)}
              aria-labelledby={`${sectionId(c)}-title`}
              className={`scroll-mt-48 ${idx === 0 ? '' : 'mt-20 md:mt-24'}`}
            >
              <ChapterHead
                id={sectionId(c)}
                numeral={c.numeral}
                title={c.title}
                fleuron={c.fleuron}
                blurb={c.blurb}
                tally={`${plural(c.tags.length, 'thread', 'threads')}${
                  view.type !== 'all'
                    ? ` · counted in ${typeLabel.toLowerCase()}`
                    : ''
                }`}
              />
              <ol
                className="tc-catalogue border-t border-[#1A161320] pt-4"
                start={c.start}
                aria-label={c.title}
              >
                {c.tags.map((tag, i) => (
                  <Entry
                    key={tag.slug}
                    no={c.start + i}
                    to={view.hrefFor(tag)}
                    label={tag.label}
                    count={tag.shown}
                    size={view.sizeFor(tag.shown)}
                  />
                ))}
              </ol>
            </section>
          ))}

          {view.single.length > 0 && (
            <section
              id="tc-ch-appendix"
              aria-label="Appendix: single stitches"
              className="scroll-mt-48 mt-20 md:mt-24"
            >
              <details className="group/app border-y border-dashed border-[#1A161330]">
                <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden py-6 text-center focus:outline-none focus-visible:bg-[#C96442]/10">
                  <span className="block font-ibm-plex-mono text-[10.5px] tracking-[0.3em] uppercase text-[#9E4A2F]">
                    Appendix
                  </span>
                  <span
                    className="mt-1 block font-fraunces italic text-[28px] md:text-[34px] leading-[1.05] text-[#1A1613]"
                    style={{
                      fontVariationSettings:
                        '"opsz" 48, "SOFT" 100, "WONK" 1, "wght" 380',
                    }}
                  >
                    Single stitches
                  </span>
                  <span
                    className="mt-2 block font-fraunces italic text-[15px] text-[#2E2620]"
                    style={{
                      fontVariationSettings:
                        '"opsz" 18, "SOFT" 100, "wght" 340',
                    }}
                  >
                    {plural(view.single.length, 'thread', 'threads')} that
                    stitch a single entry each.
                  </span>
                  <span className="mt-3 inline-flex items-center gap-2 font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#2E2620]/70 group-hover/app:text-[#9E4A2F]">
                    <span className="group-open/app:hidden">Unfold</span>
                    <span className="hidden group-open/app:inline">Fold</span>
                    <span
                      aria-hidden="true"
                      className="text-[#9E4A2F] transition-transform group-open/app:rotate-90"
                    >
                      →
                    </span>
                  </span>
                </summary>
                <ol
                  className="tc-catalogue tc-catalogue--appendix pb-6"
                  start={appendixStart}
                  aria-label="Single stitches"
                >
                  {view.single.map((tag, i) => (
                    <Entry
                      key={tag.slug}
                      no={appendixStart + i}
                      to={tagPath(tag.slug)}
                      label={tag.label}
                    />
                  ))}
                </ol>
              </details>
            </section>
          )}

          {ready && shown > 0 && (
            <div
              aria-hidden="true"
              className="mt-20 text-center text-[#C96442] text-[20px] tracking-[0.6em]"
            >
              ❦ ❦ ❦
            </div>
          )}
        </div>

        <TerracottaColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · Fezcode</span>
              <span>Catalogue · {view.totalTags} threads</span>
            </>
          }
        />
      </main>

      <div className="fixed bottom-6 right-6 opacity-40 pointer-events-none z-20 hidden md:block">
        <TerracottaMark size={18} color="#C96442" />
      </div>
    </div>
  );
}
