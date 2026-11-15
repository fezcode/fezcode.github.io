import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';
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

const ROOT_CLASS =
  'min-h-screen relative text-[#3C4845] font-outfit selection:bg-[#8FA8BC]/30 selection:text-[#3C4845] overflow-x-hidden';
const ROOT_STYLE = { background: '#EEF2F1', backgroundImage: FOG_GRADIENT };

const BACK_CLASS =
  'inline-flex items-center gap-2 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#8A9894] hover:text-[#5F837B] transition-colors duration-[250ms]';

const UNDATED = 'undated';

const Dot = ({ tint, size = 6 }) => (
  <span
    aria-hidden="true"
    className="inline-block rounded-full shrink-0"
    style={{
      width: size,
      height: size,
      backgroundColor: tint,
      boxShadow: `0 0 8px 1px ${tint}66`,
    }}
  />
);

/* Centred fog state for loading, error and missing. */
const FogState = ({ children }) => (
  <div
    className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 text-center"
    style={ROOT_STYLE}
  >
    {children}
  </div>
);

/** Group items by year (newest first); undated items settle at the end. */
const useYearGroups = (items) =>
  useMemo(() => {
    const groups = new Map();
    items.forEach((item) => {
      const d = item.date ? new Date(item.date) : null;
      const year =
        d && !Number.isNaN(d.getTime()) ? String(d.getFullYear()) : UNDATED;
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year).push(item);
    });
    return [...groups.entries()].sort(([a], [b]) => {
      if (a === UNDATED) return 1;
      if (b === UNDATED) return -1;
      return Number(b) - Number(a);
    });
  }, [items]);

/** One entry: a soft card drifting off the line. */
const DriftCard = ({ item, side, view }) => {
  const type = typeByKey[item.type];
  const tint = TYPE_TINT[item.type] || '#5C6B67';
  const date = item.date ? formatDate(item.date) : '';
  const left = side === 'left';

  return (
    <motion.li
      initial={{ opacity: 0, x: left ? -14 : 14, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8 }}
      className={`relative pl-10 md:w-1/2 ${
        left ? 'md:pl-0 md:pr-10 md:mr-auto' : 'md:pl-10 md:ml-auto'
      }`}
    >
      {/* where the card touches the line */}
      <span
        aria-hidden="true"
        className={`absolute top-8 left-4 -translate-x-1/2 w-2.5 h-2.5 rounded-full ring-4 ring-[#EEF2F1] ${
          left
            ? 'md:left-auto md:right-0 md:translate-x-1/2'
            : 'md:left-0 md:-translate-x-1/2'
        }`}
        style={{ backgroundColor: tint, boxShadow: `0 0 12px 2px ${tint}55` }}
      />
      <span
        aria-hidden="true"
        className={`absolute top-[37px] h-px w-5 left-5 ${
          left ? 'md:left-auto md:right-1.5' : 'md:left-1.5'
        }`}
        style={{
          background: `linear-gradient(${left ? '270deg' : '90deg'}, ${tint}80, transparent)`,
        }}
      />

      <article className="group rounded-[22px] bg-white/45 backdrop-blur-sm border border-white/70 shadow-[0_12px_36px_rgba(60,72,69,0.08)] hover:bg-white/65 hover:shadow-[0_16px_44px_rgba(95,131,123,0.16)] transition-all duration-[250ms] p-5 md:p-6">
        <div className="flex items-center gap-2.5 flex-wrap font-ibm-plex-mono text-[9.5px] tracking-[0.16em] lowercase">
          <span
            className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full max-w-full"
            style={{ color: tint, backgroundColor: `${tint}1A` }}
          >
            <Dot tint={tint} size={5} />
            <span className="break-words min-w-0">
              {type ? type.one.toLowerCase() : item.type}
              {item.category && (
                <>
                  <span className="opacity-50"> · </span>
                  {item.category}
                </>
              )}
            </span>
          </span>
          {date && (
            <time dateTime={item.date} className="text-[#8A9894]">
              {date}
            </time>
          )}
        </div>

        <h3 className="mt-3 font-instr-serif font-normal text-[22px] md:text-[26px] leading-[1.15] tracking-[-0.01em] break-words">
          <Link
            to={item.path}
            className="text-[#3C4845] hover:text-[#5F837B] group-hover:text-[#5F837B] focus:outline-none focus-visible:underline transition-colors duration-[250ms]"
          >
            {item.title}
          </Link>
        </h3>

        {item.series && (
          <p className="mt-1 font-instr-serif italic text-[15px] text-[#6F8FAA]">
            part of {item.series}
          </p>
        )}

        {item.description && (
          <p className="mt-2 font-outfit font-light text-[13.5px] leading-[1.65] text-[#5C6B67] break-words">
            {item.description}
          </p>
        )}

        {item.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
            {item.tags.map((tag) => {
              const on = view.active.includes(tag);
              return (
                <li key={tag} className="max-w-full">
                  <Link
                    to={tagPath(tag)}
                    aria-current={on ? 'true' : undefined}
                    className={`inline-block max-w-full break-words font-ibm-plex-mono text-[9.5px] tracking-[0.12em] lowercase px-2 py-0.5 rounded-full transition-colors duration-[250ms] ${
                      on
                        ? 'bg-[#5F837B] text-[#EEF2F1]'
                        : 'bg-[#8FA8BC]/15 text-[#5C6B67] hover:text-[#5F837B] hover:bg-[#5F837B]/15'
                    }`}
                  >
                    {view.labelOf(tag)}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </article>
    </motion.li>
  );
};

/** MIST /tags/:tag: everything under one tag, drifting along a timeline. */
export default function MistTagPage({ view }) {
  const groups = useYearGroups(view.items || []);

  if (view.status === 'error')
    return (
      <FogState>
        <MistOrb size={48} breathe={false} className="opacity-60" />
        <span className="font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#8A9894]">
          the fog would not lift
        </span>
        <p className="font-instr-serif italic text-[19px] text-[#5C6B67] break-words max-w-full">
          {view.error}
        </p>
        <Link to="/tags" className={BACK_CLASS}>
          ← all tags
        </Link>
      </FogState>
    );

  if (view.status === 'loading')
    return (
      <FogState>
        <MistOrb size={64} breathe />
        <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.26em] lowercase text-[#5C6B67]">
          loading…
        </span>
      </FogState>
    );

  if (view.status === 'missing')
    return (
      <FogState>
        <Seo title="Tag not found | Fezcodex" />
        <MistOrb size={48} breathe={false} className="opacity-60" />
        <span className="font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#8A9894]">
          404 · lost to the fog
        </span>
        <h1 className="font-instr-serif font-normal text-[34px] md:text-[48px] leading-[1.05] tracking-[-0.015em] text-[#3C4845] break-words max-w-full">
          no tag <em className="italic text-[#5F837B]">“{view.rawTag}”</em>
        </h1>
        <p className="font-outfit font-light text-[14px] text-[#5C6B67]">
          Nothing is filed under that tag.
        </p>
        <Link
          to="/tags"
          className="font-instr-serif italic text-[19px] text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
        >
          ← browse all tags
        </Link>
      </FogState>
    );

  const { meta } = view;
  const counts = TAG_TYPES.filter((t) => meta[t.plural] > 0);
  let cardIndex = 0;

  return (
    <MotionConfig reducedMotion="user">
      <div className={ROOT_CLASS} style={ROOT_STYLE}>
        <Seo
          title={`${view.title} | Tags | Fezcodex`}
          description={
            meta.description ||
            `Posts, logs and projects tagged ${meta.label} on Fezcodex.`
          }
          canonicalPath={tagPath(view.slug)}
        />
        <MistVeil />

        <div className="relative z-10 mx-auto max-w-[1100px] px-5 sm:px-8 md:px-14 pb-[120px]">
          <MistStrip
            left="drift ix · a thread"
            center="everything tied to one word"
            right={`${view.items.length} of ${view.typeCounts.all} surfaced`}
          />

          {/* the tag, centred and light */}
          <header className="pt-14 md:pt-20 mx-auto max-w-[760px] flex flex-col items-center text-center">
            <Link to="/tags" className={BACK_CLASS}>
              ← all tags
            </Link>
            <span className="mt-10 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5F837B] inline-flex items-center gap-2.5">
              <MistOrb size={18} />
              tagged
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1 }}
              className="mt-4 font-instr-serif font-normal text-[46px] sm:text-[64px] md:text-[88px] leading-[0.98] tracking-[-0.02em] text-[#3C4845] break-words max-w-full"
            >
              {meta.label}
            </motion.h1>
            {meta.description && (
              <motion.p
                initial={{ opacity: 0, filter: 'blur(6px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.1, delay: 0.15 }}
                className="mt-5 font-instr-serif italic text-[18px] md:text-[21px] leading-[1.5] text-[#5C6B67] max-w-[44ch]"
              >
                {meta.description}
              </motion.p>
            )}

            {/* meta counts */}
            <p className="mt-6 flex items-center justify-center gap-x-4 gap-y-1.5 flex-wrap font-ibm-plex-mono text-[10px] tracking-[0.16em] lowercase text-[#5C6B67]">
              {counts.map((t) => (
                <span key={t.key} className="inline-flex items-center gap-1.5">
                  <Dot tint={TYPE_TINT[t.key]} size={5} />
                  {meta[t.plural]}{' '}
                  {meta[t.plural] === 1 ? t.one.toLowerCase() : t.plural}
                </span>
              ))}
              <span className="text-[#8A9894]">{meta.count} in all</span>
            </p>

            {/* type filters */}
            <div
              className="mt-7 flex items-center justify-center gap-1.5 flex-wrap"
              role="group"
              aria-label="Content type"
            >
              {view.types.map((t) => {
                const active = view.type === t.key;
                const disabled =
                  t.key !== 'all' && view.typeCounts[t.key] === 0;
                const tint = TYPE_TINT[t.key] || '#5F837B';
                return (
                  <button
                    key={t.key}
                    type="button"
                    aria-pressed={active}
                    disabled={disabled}
                    onClick={() => view.setType(t.key)}
                    className={`inline-flex items-center gap-1.5 font-ibm-plex-mono text-[9.5px] tracking-[0.16em] lowercase px-3 py-1 rounded-full transition-colors duration-[250ms] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-1 focus-visible:ring-[#5F837B]/60 ${
                      active
                        ? 'text-[#EEF2F1] shadow-[0_4px_14px_rgba(95,131,123,0.30)]'
                        : 'bg-white/45 text-[#5C6B67] enabled:hover:bg-white/75'
                    }`}
                    style={active ? { backgroundColor: tint } : undefined}
                  >
                    {t.key !== 'all' && (
                      <Dot tint={active ? '#EEF2F1' : tint} size={5} />
                    )}
                    {t.label.toLowerCase()}
                    <span className={active ? 'opacity-80' : 'text-[#8A9894]'}>
                      {view.typeCounts[t.key]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* active filters */}
            {view.extra.length > 0 && (
              <div
                className="mt-4 flex items-center justify-center gap-1.5 flex-wrap"
                aria-label="Active tag filters"
              >
                <span className="font-instr-serif italic text-[14px] text-[#8A9894] mr-1">
                  held together by
                </span>
                {view.active.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 max-w-full font-ibm-plex-mono text-[9.5px] tracking-[0.14em] lowercase pl-3 pr-1 py-0.5 rounded-full bg-[#5F837B]/15 text-[#4E6F68] backdrop-blur-sm"
                  >
                    <span className="break-words min-w-0">
                      {view.labelOf(tag)}
                    </span>
                    <Link
                      to={view.removeHref(tag)}
                      aria-label={`Remove ${view.labelOf(tag)}`}
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[12px] leading-none hover:bg-[#5F837B] hover:text-[#EEF2F1] transition-colors duration-[250ms]"
                    >
                      ×
                    </Link>
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* narrow by: one gentle row */}
          {view.related.length > 0 && (
            <nav
              className="mt-10 mx-auto max-w-[880px]"
              aria-label="Narrow by another tag"
            >
              <MistHorizon tint="rgba(95,131,123,0.28)" />
              <div className="py-3 flex items-baseline gap-3">
                <h2 className="shrink-0 font-instr-serif italic text-[15px] text-[#5F837B]">
                  drift towards…
                </h2>
                <ul className="mt-drift-row min-w-0 flex-1 flex items-baseline gap-4 overflow-x-auto whitespace-nowrap px-6 py-1">
                  {view.related.map(([tag, count]) => (
                    <li key={tag} className="shrink-0">
                      <Link
                        to={view.addHref(tag)}
                        aria-label={`Narrow by ${view.labelOf(tag)}, ${count} ${
                          count === 1 ? 'entry' : 'entries'
                        }`}
                        className="group inline-flex items-baseline gap-1 font-outfit font-light text-[13.5px] text-[#5C6B67]/85 hover:text-[#5F837B] transition-colors duration-[250ms]"
                      >
                        <span className="text-[#8FA8BC] group-hover:text-[#5F837B]">
                          +
                        </span>
                        {view.labelOf(tag)}
                        <span className="font-ibm-plex-mono text-[9px] text-[#8A9894]">
                          {count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <MistHorizon tint="rgba(143,168,188,0.28)" />
            </nav>
          )}

          {/* the drift timeline */}
          <section
            className="mt-16 md:mt-20 mx-auto max-w-[880px]"
            aria-label="Tagged items"
          >
            {view.items.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-5 text-center">
                <MistOrb size={56} />
                <p className="font-instr-serif italic text-[20px] md:text-[22px] text-[#5C6B67]">
                  nothing here carries all of these tags.
                </p>
                {view.extra.length > 0 && (
                  <Link
                    to={tagPath(view.slug)}
                    className="font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
                  >
                    let it settle →
                  </Link>
                )}
              </div>
            ) : (
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="mt-line absolute top-0 bottom-0 left-4 md:left-1/2 w-px -translate-x-1/2"
                />
                <ol className="relative">
                  {groups.map(([year, list]) => (
                    <li key={year} className="pb-6">
                      <h2 className="relative flex md:justify-center py-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF2F1]/90 backdrop-blur-sm border border-white/80 shadow-[0_6px_20px_rgba(95,131,123,0.14)] px-3.5 py-1 font-instr-serif text-[20px] md:text-[22px] leading-none text-[#5F837B]">
                          <Dot tint="#8FA8BC" size={6} />
                          {year === UNDATED ? (
                            <em className="italic text-[#6F8FAA]">undated</em>
                          ) : (
                            year
                          )}
                          <span className="font-ibm-plex-mono text-[9px] tracking-[0.14em] text-[#8A9894]">
                            {list.length}
                          </span>
                        </span>
                      </h2>
                      <ol className="flex flex-col gap-6 md:gap-4">
                        {list.map((item) => {
                          const side = cardIndex % 2 === 0 ? 'left' : 'right';
                          cardIndex += 1;
                          return (
                            <DriftCard
                              key={item.id}
                              item={item}
                              side={side}
                              view={view}
                            />
                          );
                        })}
                      </ol>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>

          <MistColophon
            signature={
              <>
                <span>© {new Date().getFullYear()} · fezcode</span>
                <span>
                  tags · {meta.label.toLowerCase()} · {view.typeCounts.all}{' '}
                  {view.typeCounts.all === 1 ? 'entry' : 'entries'} kept
                </span>
              </>
            }
          />
        </div>
      </div>
    </MotionConfig>
  );
}
