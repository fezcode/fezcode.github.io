import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LockIcon,
  CalendarBlankIcon,
  TrophyIcon,
  BellSlashIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';
import { ACHIEVEMENTS } from '../../config/achievements';
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

const AchievementMark = ({ achievement, status, unlockedAt }) => {
  const isUnlocked = status === 'unlocked';
  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
      className={`relative border p-6 transition-colors ${
        isUnlocked
          ? 'bg-[#F3ECE0] border-[#1A161320] hover:border-[#C96442]/60'
          : 'bg-[#E8DECE]/30 border-dashed border-[#1A161320] grayscale opacity-70 hover:opacity-90'
      }`}
    >
      <div className="flex items-start justify-between pb-4 border-b border-dashed border-[#1A161320] font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase">
        <span
          className={isUnlocked ? 'text-[#9E4A2F]' : 'text-[#2E2620]/50'}
        >
          {achievement.category}
        </span>
        <span className={isUnlocked ? 'text-[#2E2620]/70' : 'text-[#2E2620]/40'}>
          {isUnlocked ? 'held' : 'locked'}
        </span>
      </div>

      <div className="pt-6 grid grid-cols-[56px_1fr] gap-4 items-start">
        <div
          className={`w-[56px] h-[56px] flex items-center justify-center border ${
            isUnlocked
              ? 'bg-[#C96442]/10 border-[#C96442]/60 text-[#9E4A2F]'
              : 'bg-[#E8DECE]/60 border-[#1A161320] text-[#2E2620]/50'
          }`}
        >
          {isUnlocked ? (
            <span className="scale-[1.3]">{achievement.icon}</span>
          ) : (
            <LockIcon size={22} weight="regular" />
          )}
        </div>
        <div className="min-w-0">
          <h3
            className={`font-fraunces leading-[1.1] tracking-[-0.02em] text-[18px] md:text-[22px] ${
              isUnlocked ? 'text-[#1A1613]' : 'text-[#2E2620]/55'
            }`}
            style={{
              fontVariationSettings: isUnlocked
                ? '"opsz" 28, "SOFT" 40, "WONK" 1, "wght" 460'
                : '"opsz" 28, "SOFT" 30, "WONK" 0, "wght" 420',
            }}
          >
            {achievement.title}
          </h3>
          <p
            className={`mt-1.5 font-fraunces italic text-[13.5px] leading-[1.4] ${
              isUnlocked ? 'text-[#2E2620]' : 'text-[#2E2620]/55'
            }`}
            style={{
              fontVariationSettings: '"opsz" 18, "SOFT" 100, "wght" 360',
            }}
          >
            {achievement.description}
          </p>
        </div>
      </div>

      <div
        className={`mt-6 pt-4 border-t border-dashed flex items-center justify-center gap-2 font-ibm-plex-mono text-[9px] tracking-[0.22em] uppercase ${
          isUnlocked
            ? 'border-[#1A161320] text-[#9E4A2F]/80'
            : 'border-[#1A161320] text-[#2E2620]/40'
        }`}
      >
        {isUnlocked && unlockedAt ? (
          <>
            <CalendarBlankIcon size={11} weight="regular" />
            <span>
              Unlocked ·{' '}
              {new Date(unlockedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </>
        ) : (
          <>
            <LockIcon size={11} />
            <span>Still to find</span>
          </>
        )}
      </div>
    </motion.article>
  );
};

const TerracottaAchievementsPage = () => {
  const { unlockedAchievements, showAchievementToast } = useAchievements();
  const [activeCat, setActiveCat] = useState('all');

  const categories = useMemo(
    () => ['All', ...[...new Set(ACHIEVEMENTS.map((a) => a.category))].sort()],
    [],
  );

  const unlockedCount = useMemo(
    () =>
      Object.keys(unlockedAchievements).filter(
        (k) => unlockedAchievements[k].unlocked,
      ).length,
    [unlockedAchievements],
  );
  const total = ACHIEVEMENTS.length;
  const pct = Math.round((unlockedCount / total) * 100);

  const filtered = useMemo(
    () =>
      ACHIEVEMENTS.filter(
        (a) => activeCat === 'all' || a.category === activeCat,
      ),
    [activeCat],
  );

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
        title="Honors | Fezcodex"
        description="Marks held and marks still to find."
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.32] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-14 pb-[120px]">
        <TerracottaStrip
          left="Folio X · honors"
          center="Marks held, marks still to find"
          right={`${unlockedCount} / ${total}`}
        />

        {/* hero */}
        <section className="pt-20 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <div className="font-ibm-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#9E4A2F] mb-6 flex items-center gap-3">
                <TrophyIcon size={14} weight="regular" />
                <span>Codex entry · §</span>
                <span aria-hidden="true" className="h-px flex-1 max-w-[60px] bg-[#9E4A2F]/50" />
                <span>X</span>
              </div>
              <h1
                className="font-fraunces text-[72px] md:text-[128px] leading-[0.86] tracking-[-0.035em] text-[#1A1613]"
                style={{
                  fontVariationSettings:
                    '"opsz" 144, "SOFT" 30, "WONK" 1, "wght" 460',
                }}
              >
                Honors<br />
                <ChapterEm>held.</ChapterEm>
              </h1>
            </div>
            <aside className="flex flex-col gap-5 lg:border-l border-[#1A161320] lg:pl-10">
              <p
                className="font-fraunces italic text-[19px] leading-[1.4] text-[#1A1613] max-w-[36ch]"
                style={{
                  fontVariationSettings:
                    '"opsz" 48, "SOFT" 100, "WONK" 0, "wght" 380',
                }}
              >
                An audit of the{' '}
                <span
                  className="not-italic text-[#9E4A2F]"
                  style={{
                    fontStyle: 'normal',
                    fontVariationSettings: '"wght" 560',
                  }}
                >
                  small true things
                </span>{' '}
                this codex has done — and the ones still waiting.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1A161320]">
                <TerracottaSpec label="Held" value={`${unlockedCount}`} />
                <TerracottaSpec label="Total" value={`${total}`} />
                <TerracottaSpec label="Fidelity" value={`${pct}%`} />
                <TerracottaSpec
                  label="Notices"
                  value={showAchievementToast ? 'on' : 'off'}
                />
              </div>

              {/* progress rule — a literal "line" */}
              <div className="pt-2">
                <div className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#2E2620]/70 mb-2">
                  Plumb progress
                </div>
                <div className="relative h-[3px] w-full bg-[#1A161320]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute inset-y-0 left-0 bg-[#C96442]"
                  />
                </div>
              </div>

              {!showAchievementToast && (
                <div className="flex items-center gap-3 pt-2 font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#2E2620]/70">
                  <BellSlashIcon size={12} />
                  <span>
                    Notices are muted ·{' '}
                    <Link
                      to="/settings"
                      className="text-[#9E4A2F] hover:text-[#C96442]"
                    >
                      settings
                    </Link>
                  </span>
                </div>
              )}
            </aside>
          </div>
        </section>

        {/* filter */}
        <section className="py-6 border-y border-[#1A161320] flex flex-wrap items-baseline gap-3 font-ibm-plex-mono text-[10px] tracking-[0.2em] uppercase">
          <span className="text-[#2E2620]/70">Filter</span>
          {categories.map((c) => {
            const val = c === 'All' ? 'all' : c;
            const active = activeCat === val;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCat(val)}
                className={`px-2 py-1 border transition-colors ${
                  active
                    ? 'border-[#1A1613] bg-[#1A1613] text-[#F3ECE0]'
                    : 'border-[#1A161320] text-[#2E2620] hover:border-[#1A1613]/50'
                }`}
              >
                {c}
              </button>
            );
          })}
        </section>

        {/* grid */}
        <section className="pt-16">
          <TerracottaChapter
            numeral="I"
            label="Known marks"
            title={
              <>
                The <ChapterEm>record.</ChapterEm>
              </>
            }
            blurb="Each honor is a small true thing — held, dated, and archived here."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((a) => {
              const entry = unlockedAchievements[a.id];
              const unlocked = !!entry?.unlocked;
              return (
                <AchievementMark
                  key={a.id}
                  achievement={a}
                  status={unlocked ? 'unlocked' : 'locked'}
                  unlockedAt={entry?.unlockedAt}
                />
              );
            })}
          </div>
        </section>

        <TerracottaColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · Fezcode</span>
              <span>
                Honors · {unlockedCount} of {total} held
              </span>
            </>
          }
        />

        <div className="fixed bottom-6 right-6 opacity-40 pointer-events-none z-20 hidden md:block">
          <TerracottaMark size={18} color="#C96442" />
        </div>
      </div>
    </div>
  );
};

export default TerracottaAchievementsPage;
