import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useAchievements } from '../../context/AchievementContext';
import {
  TerracottaStrip,
  TerracottaChapter,
  ChapterEm,
  TerracottaMark,
  TerracottaMarkStage,
  TerracottaColophon,
  TerracottaSpec,
} from '../../components/terracotta';

const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.28 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

const PAPER_GRADIENT =
  'radial-gradient(1100px 600px at 85% -10%, #E8DECE 0%, transparent 55%), radial-gradient(900px 700px at 0% 110%, #EDE3D3 0%, transparent 50%)';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
  });

const ProjectRow = ({ project, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.04 }}
    className="group"
  >
    <Link
      to={`/projects/${project.slug}`}
      className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[68px_1fr_auto_24px] gap-4 md:gap-10 items-baseline py-10 border-b border-[#1A161320] hover:border-[#1A1613]/40 transition-colors"
    >
      <span className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F]">
        No. {String(index + 1).padStart(2, '0')}
      </span>

      <div className="min-w-0">
        <h3
          className="font-fraunces text-[28px] md:text-[40px] leading-[1.02] tracking-[-0.02em] text-[#1A1613] group-hover:text-[#9E4A2F] transition-colors"
          style={{
            fontVariationSettings: '"opsz" 48, "SOFT" 50, "WONK" 1, "wght" 450',
          }}
        >
          {project.title}
          <span
            aria-hidden="true"
            className="ml-2 text-[#C96442] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ fontVariationSettings: '"wght" 800' }}
          >
            .
          </span>
        </h3>
        {project.shortDescription && (
          <p
            className="mt-2 font-fraunces italic text-[15px] md:text-[17px] leading-[1.5] text-[#2E2620] max-w-[60ch]"
            style={{ fontVariationSettings: '"opsz" 18, "SOFT" 100, "wght" 360' }}
          >
            {project.shortDescription}
          </p>
        )}
        {project.date && (
          <div className="mt-3 font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#2E2620]/60">
            {formatDate(project.date)}
            {project.status ? ` · ${project.status.toLowerCase()}` : ''}
          </div>
        )}
      </div>

      <div className="hidden md:flex flex-wrap gap-1.5 max-w-[220px] justify-end">
        {(project.technologies || []).slice(0, 4).map((t) => (
          <span
            key={t}
            className="font-ibm-plex-mono text-[9.5px] tracking-[0.14em] uppercase px-1.5 py-0.5 border border-[#1A161320] text-[#2E2620]"
          >
            {t}
          </span>
        ))}
      </div>

      <span
        aria-hidden="true"
        className="hidden md:inline-block font-ibm-plex-mono text-[#9E4A2F] text-sm justify-self-end -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
      >
        →
      </span>
    </Link>
  </motion.article>
);

const TerracottaProjectsPage = () => {
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
        style={{ background: '#F3ECE0', backgroundImage: PAPER_GRADIENT }}
      >
        <div className="flex flex-col items-center gap-5">
          <TerracottaMark size={52} color="#C96442" sway />
          <span className="font-ibm-plex-mono text-[10.5px] tracking-[0.32em] uppercase text-[#2E2620]/80">
            Pulling the archive
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#9E4A2F]"
        style={{ background: '#F3ECE0' }}
      >
        Err: {error.message}
      </div>
    );
  }

  const isFiltering = activeTag !== 'all' || Boolean(query.trim());
  // Cornerstone only appears when no filter is active, so filtering always
  // produces a visible change — the entire list below reflects the filter.
  const first = isFiltering ? null : filtered[0];
  const rest = isFiltering ? filtered : filtered.slice(1);

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
        title="Archive | Fezcodex"
        description="A weighted archive of deployed projects, measured and catalogued."
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.32] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-14 pb-[120px]">
        <TerracottaStrip
          left="Folio II · the archive"
          center="Held to gravity, not to fashion"
          right={`${filtered.length} of ${(projects || []).length} entries`}
        />

        {/* Title block — a small entry head, not a chapter, since THIS IS the archive */}
        <section className="pt-20 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F] mb-6 flex items-center gap-3">
                <span>Codex entry · §</span>
                <span aria-hidden="true" className="h-px flex-1 max-w-[80px] bg-[#9E4A2F]/50" />
                <span>II</span>
              </div>
              <h1
                className="font-fraunces text-[72px] md:text-[128px] leading-[0.86] tracking-[-0.035em] text-[#1A1613]"
                style={{
                  fontVariationSettings:
                    '"opsz" 144, "SOFT" 30, "WONK" 1, "wght" 460',
                }}
              >
                The<br />
                <ChapterEm>archive</ChapterEm>
                <span
                  aria-hidden="true"
                  className="text-[#C96442]"
                  style={{ fontVariationSettings: '"wght" 800' }}
                >
                  .
                </span>
              </h1>
            </div>
            <aside className="flex flex-col gap-5 lg:border-l border-[#1A161320] lg:pl-10">
              <p
                className="font-fraunces italic text-[20px] leading-[1.4] text-[#1A1613] max-w-[32ch]"
                style={{
                  fontVariationSettings:
                    '"opsz" 48, "SOFT" 100, "WONK" 0, "wght" 380',
                }}
              >
                Every entry has been{' '}
                <span
                  className="not-italic text-[#9E4A2F]"
                  style={{
                    fontStyle: 'normal',
                    fontVariationSettings: '"wght" 560',
                  }}
                >
                  held to the line
                </span>{' '}
                — deployed, maintained, and returned to.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1A161320]">
                <TerracottaSpec label="Total" value={`${(projects || []).length}`} />
                <TerracottaSpec label="Scope" value="Selected only" />
                <TerracottaSpec label="Ordered by" value="Gravity" />
                <TerracottaSpec label="Status" value="Load-bearing" />
              </div>
            </aside>
          </div>
        </section>

        {/* filters — hairline strip with mono chips */}
        <section className="py-6 border-y border-[#1A161320] flex flex-col md:flex-row gap-5 md:items-center">
          <div className="flex items-baseline gap-3 font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#2E2620]/80">
            <span>Filter</span>
            <span aria-hidden="true" className="h-px w-8 bg-[#1A161320]" />
          </div>

          <div className="flex flex-wrap gap-1.5 flex-1">
            <button
              type="button"
              onClick={() => setActiveTag('all')}
              className={`font-ibm-plex-mono text-[9.5px] tracking-[0.18em] uppercase px-2 py-1 border transition-colors ${
                activeTag === 'all'
                  ? 'border-[#1A1613] bg-[#1A1613] text-[#F3ECE0]'
                  : 'border-[#1A161320] text-[#2E2620] hover:border-[#1A1613]/50'
              }`}
            >
              All
            </button>
            {allTechs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTag(t)}
                className={`font-ibm-plex-mono text-[9.5px] tracking-[0.18em] uppercase px-2 py-1 border transition-colors ${
                  activeTag === t
                    ? 'border-[#C96442] bg-[#C96442]/10 text-[#9E4A2F]'
                    : 'border-[#1A161320] text-[#2E2620] hover:border-[#1A1613]/50'
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
              placeholder="Search entries…"
              className="w-full bg-transparent border-b border-[#1A161320] focus:border-[#C96442] focus:outline-none py-2 font-fraunces italic text-[15px] text-[#1A1613] placeholder:text-[#2E2620]/40 transition-colors"
            />
          </div>
        </section>

        {/* feature — mark stage for the top entry */}
        {first && (
          <section className="pt-16 pb-4">
            <TerracottaChapter
              numeral="I"
              label="Cornerstone"
              title={
                <>
                  The <ChapterEm>first stone.</ChapterEm>
                </>
              }
              blurb="The entry the archive returns to most — load-bearing, still deployed, still true."
            />
            <TerracottaMarkStage
              notesTitle={first.title}
              notes={[
                {
                  label: 'Form',
                  value:
                    first.shortDescription ||
                    'A deployed build, in daily use.',
                },
                {
                  label: 'Stack',
                  value:
                    (first.technologies || []).slice(0, 4).join(' · ') || '—',
                },
                {
                  label: 'Since',
                  value: first.date ? formatDate(first.date) : '—',
                },
                {
                  label: 'Status',
                  value: first.status || 'Live — load-bearing',
                },
                {
                  label: 'Access',
                  value: (
                    <Link
                      to={`/projects/${first.slug}`}
                      className="underline decoration-[#C96442]/60 underline-offset-2 hover:text-[#C96442] transition-colors"
                    >
                      /projects/{first.slug} →
                    </Link>
                  ),
                },
              ]}
              markSlot={
                <TerracottaMark
                  size={220}
                  color="#C96442"
                  sway
                  className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                  title={`${first.title} — cornerstone`}
                />
              }
            />
          </section>
        )}

        {/* rest — editorial list */}
        <section className="pt-20">
          <TerracottaChapter
            numeral={isFiltering ? 'I' : 'II'}
            label={isFiltering ? 'Matched entries' : 'Further entries'}
            title={
              isFiltering ? (
                <>
                  By <ChapterEm>this measure.</ChapterEm>
                </>
              ) : (
                <>
                  In <ChapterEm>order.</ChapterEm>
                </>
              )
            }
            blurb={
              isFiltering
                ? `${filtered.length} of ${(projects || []).length} entries meet the filter.`
                : 'Catalogued sequentially; each read on its own, each measured on the same line.'
            }
          />
          {isFiltering && (
            <div className="flex items-center gap-3 pt-3 pb-5 font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase">
              <span className="text-[#2E2620]/60">Filtering</span>
              {activeTag !== 'all' && (
                <span className="inline-flex items-center gap-1.5 border border-[#C96442] bg-[#C96442]/10 text-[#9E4A2F] px-2 py-1">
                  tag · {activeTag}
                  <button
                    type="button"
                    onClick={() => setActiveTag('all')}
                    className="hover:text-[#1A1613]"
                    aria-label="Clear tag filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {query.trim() && (
                <span className="inline-flex items-center gap-1.5 border border-[#1A161340] text-[#1A1613] px-2 py-1">
                  query · “{query.trim()}”
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="hover:text-[#9E4A2F]"
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
                className="ml-auto text-[#9E4A2F] hover:text-[#C96442]"
              >
                Reset →
              </button>
            </div>
          )}
          <div className="border-t border-[#1A1613]/25">
            <AnimatePresence mode="popLayout">
              {rest.map((p, i) => (
                <ProjectRow key={p.slug} project={p} index={i + 1} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <p className="font-fraunces italic text-[22px] text-[#2E2620]/60">
                  No entries meet the filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveTag('all');
                  }}
                  className="mt-4 font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#9E4A2F] hover:text-[#C96442]"
                >
                  Reset filter →
                </button>
              </div>
            )}
          </div>
        </section>

        <TerracottaColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · Fezcode / A. S. Bulbul</span>
              <span>Archive · folio {String((projects || []).length).padStart(3, '0')}</span>
            </>
          }
        />
      </div>
    </div>
  );
};

export default TerracottaProjectsPage;
