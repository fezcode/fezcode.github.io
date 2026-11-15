import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import {
  MistVeil,
  MistOrb,
  MistHorizon,
  MistStrip,
  MistChapter,
  ChapterEm,
  MistSpec,
  MistColophon,
} from '../../components/mist';

const FOG_GRADIENT =
  'radial-gradient(1100px 600px at 80% -10%, #FFFFFF 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #D2DBD8 0%, transparent 50%), radial-gradient(700px 500px at 95% 90%, #E5EBE9 0%, transparent 45%)';

const TYPE_TINT = {
  post: '#5F837B',
  log: '#8FA8BC',
  project: '#7C8FA0',
};

/* Emphasis steps for a tag's weight: 1 (light) .. 4 (heaviest). */
const SIZE_CLASS = {
  1: 'text-[15px] text-[#5C6B67] bg-white/30',
  2: 'text-[18px] text-[#3C4845] bg-white/40',
  3: 'text-[22px] text-[#3C4845] bg-white/50',
  4: 'text-[27px] text-[#5F837B] bg-white/60 shadow-[0_10px_30px_rgba(60,72,69,0.10)]',
};

const pill = (active) =>
  `inline-flex items-center gap-2 font-ibm-plex-mono text-[9.5px] tracking-[0.18em] lowercase px-2.5 py-1 rounded-full transition-colors duration-[250ms] ${
    active
      ? 'bg-[#5F837B] text-[#EEF2F1] shadow-[0_4px_14px_rgba(95,131,123,0.35)]'
      : 'bg-white/40 backdrop-blur-sm text-[#5C6B67] hover:text-[#5F837B]'
  }`;

const Notice = ({ children, orb = true }) => (
  <div className="py-24 flex flex-col items-center gap-6 text-center">
    {orb && <MistOrb size={64} />}
    <p className="font-instr-serif italic text-[22px] text-[#5C6B67] break-words max-w-full">
      {children}
    </p>
  </div>
);

/** MIST /tags: every tag, surfacing out of the fog by weight. */
export default function MistTagsPage({ view }) {
  const ready = view.status === 'ready';
  const surfaced = view.shared.length + view.single.length;

  return (
    <div
      className="min-h-screen relative text-[#3C4845] font-outfit selection:bg-[#8FA8BC]/30 selection:text-[#3C4845] overflow-x-hidden"
      style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
    >
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />
      <MistVeil />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-14 pb-[120px]">
        <MistStrip
          left="drift ix · the index"
          center="threads that run through the fog"
          right={ready ? `${view.totalTags} tags` : 'condensing'}
        />

        {/* hero */}
        <section className="pt-20 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5F837B] mb-6 flex items-center gap-3">
                <MistOrb size={20} />
                <span>drift entry · ix</span>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9 }}
                className="font-instr-serif font-normal text-[64px] sm:text-[72px] md:text-[120px] leading-[0.92] tracking-[-0.02em] text-[#3C4845]"
              >
                tags, <em className="italic text-[#5F837B]">loosely tied.</em>
              </motion.h1>
            </div>
            <motion.aside
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.12 }}
              className="flex flex-col gap-6"
            >
              <p className="font-instr-serif text-[20px] leading-[1.45] text-[#3C4845] max-w-[34ch]">
                {ready ? (
                  <>
                    {view.totalTags} tags across {view.totalItems} posts, logs
                    and projects.{' '}
                    <em className="italic text-[#5F837B]">pick one</em> to see
                    everything filed under it.
                  </>
                ) : (
                  <>
                    the threads that run through every post, log and project —{' '}
                    <em className="italic text-[#5F837B]">still condensing.</em>
                  </>
                )}
              </p>
              <MistHorizon />
              <div className="grid grid-cols-2 gap-5">
                <MistSpec
                  label="tags"
                  value={ready ? `${view.totalTags}` : '…'}
                />
                <MistSpec
                  label="entries"
                  value={ready ? `${view.totalItems}` : '…'}
                />
                <MistSpec
                  label="surfaced"
                  value={ready ? `${surfaced}` : '…'}
                />
                <MistSpec
                  label="ordered by"
                  value={view.sort === 'az' ? 'a to z' : 'most used'}
                />
              </div>
            </motion.aside>
          </div>
        </section>

        {/* search + filters */}
        <section className="sticky top-0 z-30">
          <div className="bg-[#EEF2F1]/85 backdrop-blur-md">
            <MistHorizon />
            <div className="py-4">
              <label className="block">
                <span className="sr-only">Search tags</span>
                <input
                  type="search"
                  value={view.query}
                  onChange={(event) => view.setQuery(event.target.value)}
                  placeholder="search the fog…"
                  className="w-full bg-transparent border-none focus:outline-none py-1.5 font-instr-serif italic text-[20px] md:text-[22px] text-[#3C4845] placeholder:text-[#8A9894]/70"
                />
              </label>
              <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div
                  className="flex items-center gap-1.5 flex-wrap"
                  role="group"
                  aria-label="Content type"
                >
                  <span className="font-ibm-plex-mono text-[10px] tracking-[0.18em] lowercase text-[#8A9894] mr-1">
                    sift
                  </span>
                  {view.types.map((t) => {
                    const active = view.type === t.key;
                    const tint = TYPE_TINT[t.key];
                    return (
                      <button
                        key={t.key}
                        type="button"
                        aria-pressed={active}
                        onClick={() => view.setType(t.key)}
                        className={pill(active)}
                      >
                        {tint && (
                          <span
                            aria-hidden="true"
                            className="inline-block w-[5px] h-[5px] rounded-full"
                            style={{
                              backgroundColor: active ? '#EEF2F1' : tint,
                              boxShadow: `0 0 8px 1px ${tint}66`,
                            }}
                          />
                        )}
                        {t.label.toLowerCase()}
                      </button>
                    );
                  })}
                </div>
                <div
                  className="flex items-center gap-1.5 flex-wrap"
                  role="group"
                  aria-label="Sort tags"
                >
                  <span className="font-ibm-plex-mono text-[10px] tracking-[0.18em] lowercase text-[#8A9894] mr-1">
                    order
                  </span>
                  <button
                    type="button"
                    aria-pressed={view.sort === 'count'}
                    onClick={() => view.setSort('count')}
                    className={pill(view.sort === 'count')}
                  >
                    most used
                  </button>
                  <button
                    type="button"
                    aria-pressed={view.sort === 'az'}
                    onClick={() => view.setSort('az')}
                    className={pill(view.sort === 'az')}
                  >
                    a–z
                  </button>
                </div>
              </div>
            </div>
            <MistHorizon />
          </div>
        </section>

        {/* the cloud */}
        <section className="pt-16">
          <MistChapter
            numeral="i"
            label="the threads"
            title={
              <>
                what keeps <ChapterEm>returning.</ChapterEm>
              </>
            }
            blurb="heavier threads surface brighter. each one opens everything it ties together."
          />

          {view.status === 'error' && <Notice>{view.error}</Notice>}

          {view.status === 'loading' && (
            <div className="py-24 flex flex-col items-center gap-6">
              <MistOrb size={64} breathe />
              <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.26em] lowercase text-[#5C6B67]">
                loading tags…
              </span>
            </div>
          )}

          {ready && surfaced === 0 && (
            <div className="py-24 flex flex-col items-center gap-6 text-center">
              <MistOrb size={64} />
              <p className="font-instr-serif italic text-[22px] text-[#5C6B67] break-words max-w-full">
                no tags match “{view.query}” — the fog keeps that one.
              </p>
              {view.query && (
                <button
                  type="button"
                  onClick={() => view.setQuery('')}
                  className="font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
                >
                  let it settle →
                </button>
              )}
            </div>
          )}

          {view.shared.length > 0 && (
            <ul
              className="flex flex-wrap items-baseline gap-2 md:gap-3"
              aria-label="Tags"
            >
              {view.shared.map((tag) => (
                <li key={tag.slug} className="max-w-full">
                  <Link
                    to={view.hrefFor(tag)}
                    className={`group inline-flex items-baseline gap-2 max-w-full px-3.5 py-1.5 rounded-full backdrop-blur-sm font-instr-serif leading-[1.15] tracking-[-0.01em] hover:bg-white/70 hover:text-[#5F837B] transition-colors duration-[250ms] ${
                      SIZE_CLASS[view.sizeFor(tag.shown)] || SIZE_CLASS[1]
                    }`}
                  >
                    <span className="break-words min-w-0">{tag.label}</span>
                    <span className="font-ibm-plex-mono text-[9.5px] tracking-[0.18em] lowercase text-[#8A9894] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
                      {tag.shown}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {view.single.length > 0 && (
            <details className="group/once mt-16">
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <MistHorizon />
                <span className="flex items-center justify-between gap-4 py-5 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5C6B67] hover:text-[#5F837B] transition-colors duration-[250ms]">
                  <span>Used once ({view.single.length})</span>
                  <span
                    aria-hidden="true"
                    className="text-[#5F837B] transition-transform duration-[250ms] group-open/once:rotate-90"
                  >
                    →
                  </span>
                </span>
                <MistHorizon />
              </summary>
              <ul className="pt-6 flex flex-wrap gap-1.5">
                {view.single.map((tag) => (
                  <li key={tag.slug} className="max-w-full">
                    <Link
                      to={tagPath(tag.slug)}
                      className="inline-block max-w-full break-words font-ibm-plex-mono text-[9.5px] tracking-[0.14em] lowercase px-2 py-0.5 rounded-full bg-white/50 text-[#5C6B67] hover:text-[#5F837B] transition-colors duration-[250ms]"
                    >
                      {tag.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>

        <MistColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · fezcode</span>
              <span>tags · {view.totalTags} threads, kept while waking</span>
            </>
          }
        />
      </div>
    </div>
  );
}
