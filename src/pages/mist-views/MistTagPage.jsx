import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';
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

const ROOT_CLASS =
  'min-h-screen relative text-[#3C4845] font-outfit selection:bg-[#8FA8BC]/30 selection:text-[#3C4845] overflow-x-hidden';
const ROOT_STYLE = { background: '#EEF2F1', backgroundImage: FOG_GRADIENT };

const BACK_CLASS =
  'inline-flex items-center gap-2 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#8A9894] hover:text-[#5F837B] transition-colors duration-[250ms]';

const Dot = ({ tint, size = 5 }) => (
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

/** One tagged entry: a row on the horizon, like the logs list. */
const ItemRow = ({ item, index, view }) => {
  const type = typeByKey[item.type];
  const tint = TYPE_TINT[item.type] || '#5C6B67';
  const date = item.date ? formatDate(item.date) : '';

  return (
    <motion.li
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: Math.min(index, 12) * 0.06 }}
      className="group py-7 border-b border-[#3C4845]/10"
    >
      <div className="flex items-center gap-2.5 flex-wrap font-ibm-plex-mono text-[9.5px] tracking-[0.18em] lowercase">
        <span
          className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full backdrop-blur-sm"
          style={{ color: tint, backgroundColor: `${tint}1A` }}
        >
          <Dot tint={tint} />
          {type ? type.one : item.type}
          {item.category && (
            <>
              <span className="opacity-50">·</span>
              {item.category}
            </>
          )}
        </span>
        {date && (
          <time dateTime={item.date} className="text-[#8A9894]">
            {date}
          </time>
        )}
      </div>

      <h3 className="mt-3 font-instr-serif font-normal text-[22px] md:text-[30px] leading-[1.12] tracking-[-0.01em] break-words">
        <Link
          to={item.path}
          className="text-[#3C4845] hover:text-[#5F837B] group-hover:text-[#5F837B] transition-colors duration-[250ms]"
        >
          {item.title}
          <span
            aria-hidden="true"
            className="inline-block ml-3 font-ibm-plex-mono text-sm text-[#5F837B] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-[250ms]"
          >
            →
          </span>
        </Link>
      </h3>

      {item.series && (
        <p className="mt-1 font-instr-serif italic text-[15px] text-[#5C6B67]">
          Part of {item.series}
        </p>
      )}

      {item.description && (
        <p className="mt-2 font-outfit font-light text-[13.5px] leading-[1.65] text-[#5C6B67] max-w-[64ch]">
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
                  className={`inline-block max-w-full break-words font-ibm-plex-mono text-[9.5px] tracking-[0.14em] lowercase px-2 py-0.5 rounded-full transition-colors duration-[250ms] ${
                    on
                      ? 'bg-[#5F837B]/15 text-[#5F837B]'
                      : 'bg-white/50 text-[#5C6B67] hover:text-[#5F837B]'
                  }`}
                >
                  {view.labelOf(tag)}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </motion.li>
  );
};

/** MIST /tags/:tag: everything filed under one thread. */
export default function MistTagPage({ view }) {
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

  return (
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

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-14 pb-[120px]">
        <MistStrip
          left="drift ix · a thread"
          center="everything tied to one word"
          right={`${view.items.length} of ${view.typeCounts.all} surfaced`}
        />

        {/* hero */}
        <section className="pt-16 md:pt-24 pb-10">
          <Link to="/tags" className={`${BACK_CLASS} mb-10`}>
            ← all tags
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div className="min-w-0">
              <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5F837B] mb-6 flex items-center gap-3">
                <MistOrb size={20} />
                <span>tagged</span>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9 }}
                className="font-instr-serif font-normal text-[52px] sm:text-[64px] md:text-[104px] leading-[0.95] tracking-[-0.02em] text-[#3C4845] break-words"
              >
                {meta.label}
              </motion.h1>
              {meta.description && (
                <p className="mt-6 font-instr-serif text-[20px] leading-[1.45] text-[#3C4845] max-w-[40ch]">
                  {meta.description}
                </p>
              )}
            </div>
            <motion.aside
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.12 }}
              className="flex flex-col gap-5"
            >
              <MistHorizon />
              <div className="grid grid-cols-2 gap-5">
                {counts.map((t) => (
                  <MistSpec
                    key={t.key}
                    label={
                      <span className="inline-flex items-center gap-2">
                        <Dot tint={TYPE_TINT[t.key]} />
                        {t.plural}
                      </span>
                    }
                    value={`${meta[t.plural]} ${
                      meta[t.plural] === 1 ? t.one.toLowerCase() : t.plural
                    }`}
                  />
                ))}
                <MistSpec label="in all" value={`${meta.count}`} />
              </div>
            </motion.aside>
          </div>
        </section>

        {/* active filters + type tabs */}
        <section className="py-2">
          <MistHorizon />
          <div className="py-5 flex flex-col gap-4">
            {view.extra.length > 0 && (
              <div
                className="flex items-center gap-1.5 flex-wrap"
                aria-label="Active tag filters"
              >
                <span className="font-ibm-plex-mono text-[10px] tracking-[0.18em] lowercase text-[#8A9894] mr-1">
                  filtered by
                </span>
                {view.active.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 max-w-full font-ibm-plex-mono text-[9.5px] tracking-[0.18em] lowercase pl-2.5 pr-1 py-0.5 rounded-full bg-[#5F837B]/15 text-[#5F837B]"
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
                const disabled =
                  t.key !== 'all' && view.typeCounts[t.key] === 0;
                const tint = TYPE_TINT[t.key];
                return (
                  <button
                    key={t.key}
                    type="button"
                    aria-pressed={active}
                    disabled={disabled}
                    onClick={() => view.setType(t.key)}
                    className={`inline-flex items-center gap-2 font-ibm-plex-mono text-[9.5px] tracking-[0.18em] lowercase px-2.5 py-1 rounded-full transition-colors duration-[250ms] disabled:opacity-40 disabled:cursor-not-allowed ${
                      active
                        ? 'bg-[#5F837B] text-[#EEF2F1] shadow-[0_4px_14px_rgba(95,131,123,0.35)]'
                        : 'bg-white/40 backdrop-blur-sm text-[#5C6B67] enabled:hover:text-[#5F837B]'
                    }`}
                  >
                    {tint && <Dot tint={active ? '#EEF2F1' : tint} />}
                    {t.label.toLowerCase()}
                    <span className={active ? 'opacity-80' : 'text-[#8A9894]'}>
                      {view.typeCounts[t.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <MistHorizon />
        </section>

        {/* results + narrow by */}
        <div className="pt-16 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16">
          <section className="min-w-0" aria-label="Tagged items">
            <MistChapter
              numeral="i"
              label="what it ties"
              title={
                <>
                  filed <ChapterEm>under.</ChapterEm>
                </>
              }
              blurb="posts, logs and projects carrying every active tag."
            />

            {view.items.length === 0 ? (
              <div className="py-24 flex flex-col items-center gap-6 text-center">
                <MistOrb size={64} />
                <p className="font-instr-serif italic text-[22px] text-[#5C6B67]">
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
              <>
                <MistHorizon />
                <ol>
                  {view.items.map((item, i) => (
                    <ItemRow key={item.id} item={item} index={i} view={view} />
                  ))}
                </ol>
              </>
            )}
          </section>

          {view.related.length > 0 && (
            <aside
              className="lg:sticky lg:top-24 self-start w-full"
              aria-label="Narrow by another tag"
            >
              <div className="rounded-2xl bg-white/30 backdrop-blur-sm p-6">
                <h2 className="font-ibm-plex-mono text-[10px] tracking-[0.24em] lowercase text-[#5F837B] mb-2">
                  narrow by
                </h2>
                <p className="font-instr-serif italic text-[15px] leading-[1.45] text-[#5C6B67] mb-4">
                  Tags that appear alongside {view.title}. Each one narrows the
                  list.
                </p>
                <MistHorizon tint="rgba(60,72,69,0.14)" />
                <ul className="pt-4 flex flex-wrap gap-1.5">
                  {view.related.map(([tag, count]) => (
                    <li key={tag} className="max-w-full">
                      <Link
                        to={view.addHref(tag)}
                        className="group inline-flex items-baseline gap-1.5 max-w-full font-ibm-plex-mono text-[9.5px] tracking-[0.14em] lowercase px-2 py-0.5 rounded-full bg-white/50 text-[#5C6B67] hover:text-[#5F837B] hover:bg-white/80 transition-colors duration-[250ms]"
                      >
                        <span className="break-words min-w-0">
                          + {view.labelOf(tag)}
                        </span>
                        <span className="text-[#8A9894] group-hover:text-[#5F837B]">
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
  );
}
