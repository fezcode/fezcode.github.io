import React from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES } from '../tags/tagTypes';
import {
  MistVeil,
  MistOrb,
  MistHorizon,
  MistStrip,
  MistColophon,
} from '../../components/mist';
import './mist-tags.css';

const FOG_GRADIENT =
  'radial-gradient(1100px 600px at 80% -10%, #FFFFFF 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #D2DBD8 0%, transparent 50%), radial-gradient(700px 500px at 95% 90%, #E5EBE9 0%, transparent 45%)';

/* Eucalyptus for posts, sky for logs, slate for projects. */
const TYPE_TINT = {
  post: '#5F837B',
  log: '#6F8FAA',
  project: '#66788A',
};
const TYPE_RGB = {
  post: '95, 131, 123',
  log: '111, 143, 170',
  project: '102, 120, 138',
};

/* Label size and presence by weight: 1 (faint) .. 4 (heavy and solid). */
const WEIGHT_CLASS = {
  1: 'text-[14px] px-3 py-1 text-[#5C6B67] opacity-60',
  2: 'text-[17px] px-3.5 py-1.5 text-[#3C4845] opacity-80',
  3: 'text-[21px] md:text-[24px] px-4 py-1.5 text-[#3C4845] opacity-90',
  4: 'text-[27px] md:text-[34px] px-5 py-2 text-[#2F3B38] opacity-100',
};

/* Where a tag lives most, so its bubble takes that colour. */
const dominantType = (tag, type) => {
  if (type !== 'all') return type;
  let best = 'post';
  let most = -1;
  TAG_TYPES.forEach((t) => {
    if ((tag[t.plural] || 0) > most) {
      most = tag[t.plural] || 0;
      best = t.key;
    }
  });
  return best;
};

const toggleClass = (on, tint = '#5F837B') =>
  `font-ibm-plex-mono text-[10.5px] tracking-[0.16em] lowercase px-1 py-0.5 rounded-sm underline-offset-[6px] transition-colors duration-[250ms] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#5F837B]/50 ${
    on
      ? 'underline decoration-1'
      : 'text-[#8A9894] hover:text-[#3C4845] no-underline'
  }`;

const Sep = () => (
  <span aria-hidden="true" className="text-[#8A9894]/60 select-none">
    ·
  </span>
);

/** MIST /tags: a floating, centred cloud of tags in the fog. */
export default function MistTagsPage({ view }) {
  const ready = view.status === 'ready';
  const surfaced = view.shared.length + view.single.length;

  return (
    <MotionConfig reducedMotion="user">
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

        <div className="relative z-10 mx-auto max-w-[1100px] px-5 sm:px-8 md:px-14 pb-[120px]">
          <MistStrip
            left="drift ix · the index"
            center="threads that float through the fog"
            right={ready ? `${view.totalTags} tags` : 'condensing'}
          />

          {/* a quiet, centred header */}
          <header className="pt-20 md:pt-28 flex flex-col items-center text-center">
            <MistOrb size={56} />
            <motion.h1
              initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1 }}
              className="mt-6 font-instr-serif font-normal text-[52px] sm:text-[68px] md:text-[88px] leading-[0.95] tracking-[-0.02em] text-[#3C4845]"
            >
              tags
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, delay: 0.15 }}
              className="mt-4 font-instr-serif italic text-[18px] md:text-[20px] leading-[1.45] text-[#5C6B67] max-w-[38ch]"
            >
              {ready ? (
                <>
                  {view.totalTags} threads across {view.totalItems} posts, logs
                  and projects. <span className="text-[#5F837B]">pick one</span>{' '}
                  to see what it ties together.
                </>
              ) : (
                'the threads are still condensing…'
              )}
            </motion.p>
          </header>

          {/* one light search line, tiny toggles under it */}
          <section
            className="mt-14 md:mt-16 flex flex-col items-center"
            aria-label="Find a tag"
          >
            <label className="block w-full max-w-[440px]">
              <span className="sr-only">Search tags</span>
              <input
                type="search"
                value={view.query}
                onChange={(event) => view.setQuery(event.target.value)}
                placeholder="what are you looking for?"
                className="w-full bg-transparent text-center border-0 border-b border-[#5F837B]/25 focus:border-[#5F837B]/70 focus:outline-none focus:ring-0 py-2 font-instr-serif italic text-[20px] md:text-[22px] text-[#3C4845] placeholder:text-[#8A9894]/70 transition-colors duration-[250ms]"
              />
            </label>

            <div className="mt-5 flex flex-col items-center gap-2.5">
              <div
                className="flex items-center justify-center gap-x-2 gap-y-1 flex-wrap"
                role="group"
                aria-label="Content type"
              >
                {view.types.map((t, i) => {
                  const on = view.type === t.key;
                  const tint = TYPE_TINT[t.key] || '#5F837B';
                  return (
                    <React.Fragment key={t.key}>
                      {i > 0 && <Sep />}
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => view.setType(t.key)}
                        className={toggleClass(on)}
                        style={on ? { color: tint } : undefined}
                      >
                        {t.label.toLowerCase()}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
              <div
                className="flex items-center justify-center gap-x-2 flex-wrap"
                role="group"
                aria-label="Sort tags"
              >
                <button
                  type="button"
                  aria-pressed={view.sort === 'count'}
                  onClick={() => view.setSort('count')}
                  className={`${toggleClass(view.sort === 'count')} ${
                    view.sort === 'count' ? 'text-[#5F837B]' : ''
                  }`}
                >
                  by weight
                </button>
                <Sep />
                <button
                  type="button"
                  aria-pressed={view.sort === 'az'}
                  onClick={() => view.setSort('az')}
                  className={`${toggleClass(view.sort === 'az')} ${
                    view.sort === 'az' ? 'text-[#5F837B]' : ''
                  }`}
                >
                  a to z
                </button>
              </div>
              {view.type === 'all' && (
                <p className="flex items-center justify-center gap-3 flex-wrap font-ibm-plex-mono text-[9.5px] tracking-[0.16em] lowercase text-[#8A9894]">
                  <span>tinted by where each lives most</span>
                  {TAG_TYPES.map((t) => (
                    <span
                      key={t.key}
                      className="inline-flex items-center gap-1.5"
                    >
                      <span
                        aria-hidden="true"
                        className="inline-block w-[6px] h-[6px] rounded-full"
                        style={{
                          backgroundColor: TYPE_TINT[t.key],
                          boxShadow: `0 0 8px 1px ${TYPE_TINT[t.key]}66`,
                        }}
                      />
                      {t.plural}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </section>

          {/* the cloud */}
          <section className="mt-16 md:mt-20" aria-label="Tags">
            {view.status === 'error' && (
              <div className="py-20 flex flex-col items-center gap-5 text-center">
                <MistOrb size={48} breathe={false} className="opacity-60" />
                <p className="font-instr-serif italic text-[20px] text-[#5C6B67] break-words max-w-full">
                  {view.error}
                </p>
              </div>
            )}

            {view.status === 'loading' && (
              <div className="py-20 flex flex-col items-center gap-6">
                <MistOrb size={64} breathe />
                <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.26em] lowercase text-[#5C6B67]">
                  loading tags…
                </span>
              </div>
            )}

            {ready && surfaced === 0 && (
              <div className="py-20 flex flex-col items-center gap-5 text-center">
                <p className="font-instr-serif italic text-[20px] md:text-[22px] text-[#5C6B67] break-words max-w-full">
                  no tags match “{view.query}”. the fog keeps that one.
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
              <ul className="mx-auto max-w-[920px] flex flex-wrap items-center justify-center gap-x-2.5 gap-y-3 md:gap-x-4 md:gap-y-5">
                {view.shared.map((tag, i) => {
                  const weight = view.sizeFor(tag.shown);
                  const kind = dominantType(tag, view.type);
                  return (
                    <li
                      key={tag.slug}
                      className="mt-float max-w-full"
                      style={{
                        '--mt-delay': `-${((i * 1.37) % 9).toFixed(2)}s`,
                        '--mt-dur': `${(7 + ((i * 0.73) % 5)).toFixed(2)}s`,
                      }}
                    >
                      <Link
                        to={view.hrefFor(tag)}
                        data-weight={weight}
                        aria-label={`${tag.label}, ${tag.shown} ${
                          tag.shown === 1 ? 'entry' : 'entries'
                        }`}
                        className={`mt-bubble group inline-flex items-baseline gap-2 max-w-full rounded-full font-instr-serif leading-[1.15] tracking-[-0.01em] hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#5F837B]/60 transition-opacity duration-[250ms] ${
                          WEIGHT_CLASS[weight] || WEIGHT_CLASS[1]
                        }`}
                        style={{ '--mt-rgb': TYPE_RGB[kind] }}
                      >
                        <span className="break-words min-w-0">{tag.label}</span>
                        <span
                          aria-hidden="true"
                          className="font-ibm-plex-mono text-[9.5px] tracking-[0.14em]"
                          style={{ color: TYPE_TINT[kind] }}
                        >
                          {tag.shown}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            {view.single.length > 0 && (
              <details className="group/once mt-24 md:mt-28 mx-auto max-w-[760px] text-center">
                <summary className="mt-summary cursor-pointer inline-flex items-center gap-2 font-instr-serif italic text-[17px] md:text-[18px] text-[#5C6B67] hover:text-[#5F837B] transition-colors duration-[250ms] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#5F837B]/50 rounded-sm px-1">
                  and some that passed through once…
                  <span className="font-ibm-plex-mono not-italic text-[9.5px] tracking-[0.16em] text-[#8FA8BC]">
                    {view.single.length}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-ibm-plex-mono not-italic text-[11px] text-[#5F837B] transition-transform duration-[250ms] group-open/once:rotate-90"
                  >
                    →
                  </span>
                </summary>
                <MistHorizon className="mt-5" tint="rgba(95,131,123,0.25)" />
                <ul className="mt-fade-in pt-6 flex flex-wrap justify-center gap-x-3 gap-y-1.5">
                  {view.single.map((tag) => (
                    <li key={tag.slug} className="max-w-full">
                      <Link
                        to={tagPath(tag.slug)}
                        className="inline-block max-w-full break-words font-outfit font-light text-[13px] text-[#5C6B67]/80 hover:text-[#5F837B] underline-offset-4 hover:underline transition-colors duration-[250ms]"
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
    </MotionConfig>
  );
}
