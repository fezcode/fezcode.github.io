import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useAchievements } from '../../context/AchievementContext';
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

const formatDate = (d) =>
  new Date(d)
    .toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
    })
    .toLowerCase();

const ProjectRow = ({ project, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay: Math.min(index, 8) * 0.06 }}
    className="group"
  >
    <Link
      to={`/projects/${project.slug}`}
      className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[68px_1fr_auto_24px] gap-4 md:gap-10 items-baseline py-10 border-b border-[#3C4845]/10"
    >
      <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.2em] lowercase text-[#8A9894] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
        no. {String(index + 1).padStart(2, '0')}
      </span>

      <div className="min-w-0">
        <h3 className="font-instr-serif font-normal text-[28px] md:text-[40px] leading-[1.04] tracking-[-0.01em] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
          {project.title}
          <span
            aria-hidden="true"
            className="ml-2 italic text-[#8FA8BC] opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms]"
          >
            ·
          </span>
        </h3>
        {project.shortDescription && (
          <p className="mt-2 font-outfit font-light text-[15px] md:text-[16px] leading-[1.6] text-[#5C6B67] max-w-[60ch]">
            {project.shortDescription}
          </p>
        )}
        {project.date && (
          <div className="mt-3 font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#8A9894]">
            {formatDate(project.date)}
            {project.status ? ` · ${project.status.toLowerCase()}` : ''}
          </div>
        )}
      </div>

      <div className="hidden md:flex flex-wrap gap-1.5 max-w-[220px] justify-end">
        {(project.technologies || []).slice(0, 4).map((t) => (
          <span
            key={t}
            className="font-ibm-plex-mono text-[9.5px] tracking-[0.14em] lowercase px-2 py-0.5 rounded-full bg-white/40 backdrop-blur-sm text-[#5C6B67]"
          >
            {t.toLowerCase()}
          </span>
        ))}
      </div>

      <span
        aria-hidden="true"
        className="hidden md:inline-block font-ibm-plex-mono text-[#5F837B] text-sm justify-self-end -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-[250ms]"
      >
        →
      </span>
    </Link>
  </motion.article>
);

const MistProjectsPage = () => {
  const { projects, loading, error } = useProjects();
  const { unlockAchievement } = useAchievements();
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('all');

  useEffect(() => {
    unlockAchievement('project_pioneer');
  }, [unlockAchievement]);

  const allTechs = Array.from(
    new Set(
      (projects || []).flatMap((p) =>
        (p.technologies || []).map((t) => t.toLowerCase()),
      ),
    ),
  )
    .sort()
    .slice(0, 12);

  const filtered = (projects || []).filter((p) => {
    if (activeTag !== 'all') {
      const techs = (p.technologies || []).map((t) => t.toLowerCase());
      if (!techs.includes(activeTag)) return false;
    }
    if (query) {
      const q = query.toLowerCase();
      if (
        !p.title?.toLowerCase().includes(q) &&
        !p.shortDescription?.toLowerCase().includes(q) &&
        !(p.technologies || []).some((t) => t.toLowerCase().includes(q))
      ) {
        return false;
      }
    }
    return true;
  });

  if (loading) {
    return (
      <div
        className="min-h-screen relative flex items-center justify-center"
        style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
      >
        <div className="flex flex-col items-center gap-6">
          <MistOrb size={64} breathe />
          <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.26em] lowercase text-[#5C6B67]">
            condensing…
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#5F837B]"
        style={{ background: '#EEF2F1' }}
      >
        err: {error.message}
      </div>
    );
  }

  const isFiltering = activeTag !== 'all' || Boolean(query.trim());
  // The clearing only appears when no filter is active, so filtering always
  // produces a visible change — the entire list below reflects the filter.
  const first = isFiltering ? null : filtered[0];
  const rest = isFiltering ? filtered : filtered.slice(1);

  return (
    <div
      className="min-h-screen relative text-[#3C4845] font-outfit selection:bg-[#8FA8BC]/30 selection:text-[#3C4845]"
      style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
    >
      <Seo
        title="Archive | Fezcodex"
        description="An archive of deployed projects, kept while waking — the fog keeps the rest."
      />
      <MistVeil />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-14 pb-[120px]">
        <MistStrip
          left="drift ii · the archive"
          center="kept while waking — the fog keeps the rest"
          right={`${filtered.length} of ${(projects || []).length} remembered`}
        />

        {/* title block — a half-remembered entry head */}
        <section className="pt-20 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5F837B] mb-6 flex items-center gap-3">
                <span>fezcodex · drift</span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 max-w-[80px]"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(95,131,123,0.5), transparent)',
                  }}
                />
                <span>ii</span>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9 }}
                className="font-instr-serif font-normal text-[72px] md:text-[120px] leading-[0.92] tracking-[-0.02em] text-[#3C4845]"
              >
                the
                <br />
                <em className="italic text-[#5F837B]">archive</em>
              </motion.h1>
            </div>
            <motion.aside
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.12 }}
              className="flex flex-col gap-5"
            >
              <p className="font-instr-serif text-[20px] md:text-[22px] leading-[1.45] text-[#3C4845] max-w-[32ch]">
                Every entry here was{' '}
                <em className="italic text-[#5F837B]">carried back across</em>{' '}
                the threshold — deployed, maintained, returned to.
              </p>
              <div className="pt-4">
                <MistHorizon />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <MistSpec label="total" value={`${(projects || []).length}`} />
                  <MistSpec label="scope" value="what surfaced" />
                  <MistSpec label="ordered by" value="recall" />
                  <MistSpec label="visibility" value="low — proceed gently" />
                </div>
              </div>
            </motion.aside>
          </div>
        </section>

        {/* filters — a veil strip with whisper chips */}
        <section className="py-2">
          <MistHorizon />
          <div className="py-6 flex flex-col md:flex-row gap-5 md:items-center">
            <div className="flex items-baseline gap-3 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5C6B67]">
              <span>sift</span>
              <span
                aria-hidden="true"
                className="h-px w-8"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(60,72,69,0.25), transparent)',
                }}
              />
            </div>

            <div className="flex flex-wrap gap-1.5 flex-1">
              <button
                type="button"
                onClick={() => setActiveTag('all')}
                className={`font-ibm-plex-mono text-[9.5px] tracking-[0.18em] lowercase px-2.5 py-1 rounded-full transition-colors duration-[250ms] ${
                  activeTag === 'all'
                    ? 'bg-[#5F837B] text-[#EEF2F1] shadow-[0_8px_24px_rgba(95,131,123,0.35)]'
                    : 'bg-white/40 backdrop-blur-sm text-[#5C6B67] hover:text-[#5F837B]'
                }`}
              >
                all
              </button>
              {allTechs.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTag(t)}
                  className={`font-ibm-plex-mono text-[9.5px] tracking-[0.18em] lowercase px-2.5 py-1 rounded-full transition-colors duration-[250ms] ${
                    activeTag === t
                      ? 'bg-[#5F837B]/15 text-[#5F837B] shadow-[0_0_12px_rgba(143,168,188,0.35)]'
                      : 'bg-white/40 backdrop-blur-sm text-[#5C6B67] hover:text-[#5F837B]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="relative md:max-w-[260px] w-full">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search the fog…"
                className="w-full bg-transparent border-b border-[#3C4845]/10 focus:border-[#5F837B]/60 focus:outline-none py-2 font-instr-serif italic text-[16px] text-[#3C4845] placeholder:text-[#8A9894]/70 transition-colors duration-[250ms]"
              />
            </div>
          </div>
          <MistHorizon />
        </section>

        {/* feature — the clearest memory, raised on a veil */}
        {first && (
          <section className="pt-16 pb-4">
            <MistChapter
              numeral="i"
              label="the clearing"
              title={
                <>
                  first to <ChapterEm>surface.</ChapterEm>
                </>
              }
              blurb="the entry the waking mind reaches for first — still deployed, still half-dreamt."
            />
            <motion.div
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl bg-white/40 backdrop-blur-sm shadow-[0_18px_50px_rgba(60,72,69,0.10)] p-8 md:p-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-center">
                <div className="flex justify-center">
                  <MistOrb
                    size={200}
                    breathe
                    title={`${first.title} — the clearing`}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-instr-serif font-normal text-[34px] md:text-[44px] leading-[1.05] tracking-[-0.015em] text-[#3C4845]">
                    {first.title}
                  </h3>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                    <MistSpec
                      label="form"
                      value={
                        first.shortDescription ||
                        'a deployed build, in daily use.'
                      }
                    />
                    <MistSpec
                      label="stack"
                      value={
                        (first.technologies || [])
                          .slice(0, 4)
                          .map((t) => t.toLowerCase())
                          .join(' · ') || '—'
                      }
                    />
                    <MistSpec
                      label="since"
                      value={first.date ? formatDate(first.date) : '—'}
                    />
                    <MistSpec
                      label="status"
                      value={(first.status || 'live — still drifting').toLowerCase()}
                    />
                  </div>
                  <div className="mt-8">
                    <Link
                      to={`/projects/${first.slug}`}
                      className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
                    >
                      /projects/{first.slug} →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* rest — the drifting list */}
        <section className="pt-20">
          <MistChapter
            numeral={isFiltering ? 'i' : 'ii'}
            label={isFiltering ? 'what the sieve held' : 'further drift'}
            title={
              isFiltering ? (
                <>
                  what <ChapterEm>remains.</ChapterEm>
                </>
              ) : (
                <>
                  in <ChapterEm>half-light.</ChapterEm>
                </>
              )
            }
            blurb={
              isFiltering
                ? `${filtered.length} of ${(projects || []).length} entries drift through the sieve.`
                : 'read each one gently; the order is only the order of remembering.'
            }
          />
          {isFiltering && (
            <div className="flex items-center gap-3 pt-3 pb-5 font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase">
              <span className="text-[#8A9894]">sifting</span>
              {activeTag !== 'all' && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5F837B]/15 text-[#5F837B] px-2.5 py-1">
                  tag · {activeTag}
                  <button
                    type="button"
                    onClick={() => setActiveTag('all')}
                    className="hover:text-[#3C4845] transition-colors duration-[250ms]"
                    aria-label="Clear tag filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {query.trim() && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/50 backdrop-blur-sm text-[#5C6B67] px-2.5 py-1">
                  query · “{query.trim()}”
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="hover:text-[#5F837B] transition-colors duration-[250ms]"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveTag('all');
                }}
                className="ml-auto text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
              >
                let it settle →
              </button>
            </div>
          )}
          <MistHorizon />
          <div>
            <AnimatePresence mode="popLayout">
              {rest.map((p, i) => (
                <ProjectRow key={p.slug} project={p} index={i + 1} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <p className="font-instr-serif italic text-[22px] text-[#8A9894]">
                  nothing surfaces — the fog keeps it for now.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveTag('all');
                  }}
                  className="mt-4 font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
                >
                  let it settle →
                </button>
              </div>
            )}
          </div>
        </section>

        <MistColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · fezcode / a. s. bulbul</span>
              <span>
                archive · drift{' '}
                {String((projects || []).length).padStart(3, '0')} — the fog
                keeps the rest
              </span>
            </>
          }
        />
      </div>
    </div>
  );
};

export default MistProjectsPage;
