import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LockIcon,
  CalendarBlankIcon,
  BellSlashIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';
import { ACHIEVEMENTS } from '../../config/achievements';
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

/**
 * One honor — a veil of glass. Held marks glow faintly with eucalyptus;
 * the rest are still asleep in the fog.
 */
const AchievementMark = ({ achievement, status, unlockedAt, index }) => {
  const isUnlocked = status === 'unlocked';
  return (
    <motion.article
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: Math.min(index % 12, 12) * 0.06 }}
      className={`relative rounded-2xl p-6 backdrop-blur-sm transition-opacity duration-[250ms] ${
        isUnlocked
          ? 'bg-white/50 shadow-[0_18px_50px_rgba(60,72,69,0.10)]'
          : 'bg-white/25 shadow-[0_10px_30px_rgba(60,72,69,0.06)] opacity-65 hover:opacity-90'
      }`}
    >
      <div className="flex items-start justify-between pb-4 font-ibm-plex-mono text-[9.5px] tracking-[0.22em] lowercase">
        <span className={isUnlocked ? 'text-[#5F837B]' : 'text-[#8A9894]'}>
          {achievement.category.toLowerCase()}
        </span>
        <span className={isUnlocked ? 'text-[#5C6B67]' : 'text-[#8A9894]'}>
          {isUnlocked ? 'held' : 'asleep'}
        </span>
      </div>
      <MistHorizon
        tint={isUnlocked ? 'rgba(95,131,123,0.3)' : 'rgba(60,72,69,0.14)'}
      />

      <div className="pt-6 grid grid-cols-[56px_1fr] gap-4 items-start">
        <div
          className={`w-[56px] h-[56px] flex items-center justify-center rounded-full ${
            isUnlocked
              ? 'bg-[#5F837B]/12 text-[#5F837B] shadow-[0_0_18px_rgba(143,168,188,0.35)]'
              : 'bg-[#DFE5E3]/70 text-[#8A9894]'
          }`}
        >
          {isUnlocked ? (
            <span className="scale-[1.3]">{achievement.icon}</span>
          ) : (
            <LockIcon size={22} weight="light" />
          )}
        </div>
        <div className="min-w-0">
          <h3
            className={`font-instr-serif font-normal leading-[1.12] tracking-[-0.015em] text-[19px] md:text-[23px] ${
              isUnlocked ? 'text-[#3C4845]' : 'text-[#5C6B67]'
            }`}
          >
            {achievement.title}
          </h3>
          <p
            className={`mt-1.5 font-outfit font-light text-[13px] leading-[1.5] ${
              isUnlocked ? 'text-[#5C6B67]' : 'text-[#8A9894]'
            }`}
          >
            {achievement.description}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <MistHorizon />
        <div
          className={`pt-4 flex items-center justify-center gap-2 font-ibm-plex-mono text-[9px] tracking-[0.22em] lowercase ${
            isUnlocked ? 'text-[#5F837B]' : 'text-[#8A9894]'
          }`}
        >
          {isUnlocked && unlockedAt ? (
            <>
              <CalendarBlankIcon size={11} weight="light" />
              <span>
                woke ·{' '}
                {new Date(unlockedAt)
                  .toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                  .toLowerCase()}
              </span>
            </>
          ) : (
            <>
              <LockIcon size={11} weight="light" />
              <span>still in the fog</span>
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const MistAchievementsPage = () => {
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
      className="min-h-screen relative text-[#3C4845] font-outfit selection:bg-[#8FA8BC]/30 selection:text-[#3C4845]"
      style={{ background: '#EEF2F1', backgroundImage: FOG_GRADIENT }}
    >
      <Seo
        title="Honors | Fezcodex"
        description="Marks held and marks still to find."
      />
      <MistVeil />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-14 pb-[120px]">
        <MistStrip
          left="drift x · honors"
          center="marks held, marks still asleep"
          right={`${unlockedCount} / ${total}`}
        />

        {/* hero */}
        <section className="pt-20 md:pt-28 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-20 items-end">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8 }}
                className="font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5F837B] mb-6 flex items-center gap-3"
              >
                <MistOrb size={20} />
                <span>drift entry · x</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.06 }}
                className="font-instr-serif font-normal text-[72px] md:text-[120px] leading-[0.92] tracking-[-0.02em] text-[#3C4845]"
              >
                honors,
                <br />
                <em className="italic text-[#5F837B]">kept while waking.</em>
              </motion.h1>
            </div>
            <motion.aside
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.18 }}
              className="flex flex-col gap-6"
            >
              <p className="font-instr-serif text-[20px] leading-[1.45] text-[#3C4845] max-w-[36ch]">
                an inventory of the{' '}
                <em className="italic text-[#5F837B]">small true things</em>{' '}
                this codex has done — and the ones still dreaming. the fog keeps
                the rest.
              </p>
              <MistHorizon />
              <div className="grid grid-cols-2 gap-5">
                <MistSpec label="held" value={`${unlockedCount}`} />
                <MistSpec label="total" value={`${total}`} />
                <MistSpec label="condensed" value={`${pct}%`} />
                <MistSpec
                  label="notices"
                  value={showAchievementToast ? 'on' : 'off'}
                />
              </div>

              {/* progress — fog condensing into a line of light */}
              <div className="pt-2">
                <div className="font-ibm-plex-mono text-[9.5px] tracking-[0.22em] lowercase text-[#8A9894] mb-2">
                  drift progress
                </div>
                <div className="relative h-[3px] w-full rounded-full bg-[#3C4845]/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #5F837B, #8FA8BC)',
                      boxShadow: '0 0 12px rgba(143,168,188,0.55)',
                    }}
                  />
                </div>
              </div>

              {!showAchievementToast && (
                <div className="flex items-center gap-3 pt-2 font-ibm-plex-mono text-[10px] tracking-[0.2em] lowercase text-[#8A9894]">
                  <BellSlashIcon size={12} weight="light" />
                  <span>
                    notices are hushed ·{' '}
                    <Link
                      to="/settings"
                      className="text-[#5F837B] hover:text-[#3C4845] transition-colors duration-[250ms]"
                    >
                      settings
                    </Link>
                  </span>
                </div>
              )}
            </motion.aside>
          </div>
        </section>

        {/* filter */}
        <section>
          <MistHorizon />
          <div className="py-5 flex flex-wrap items-baseline gap-2 font-ibm-plex-mono text-[10px] tracking-[0.18em] lowercase">
            <span className="text-[#8A9894] mr-1">drift through</span>
            {categories.map((c) => {
              const val = c === 'All' ? 'all' : c;
              const active = activeCat === val;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCat(val)}
                  className={`px-2.5 py-1 rounded-full transition-colors duration-[250ms] ${
                    active
                      ? 'bg-[#5F837B]/15 text-[#5F837B]'
                      : 'text-[#5C6B67] hover:text-[#5F837B] hover:bg-white/50'
                  }`}
                >
                  {c.toLowerCase()}
                </button>
              );
            })}
          </div>
          <MistHorizon />
        </section>

        {/* grid */}
        <section className="pt-16">
          <MistChapter
            numeral="i"
            label="known marks"
            title={
              <>
                the <ChapterEm>record.</ChapterEm>
              </>
            }
            blurb="each honor is a small true thing — held, dated, half-dreamt here."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((a, idx) => {
              const entry = unlockedAchievements[a.id];
              const unlocked = !!entry?.unlocked;
              return (
                <AchievementMark
                  key={a.id}
                  achievement={a}
                  status={unlocked ? 'unlocked' : 'locked'}
                  unlockedAt={entry?.unlockedAt}
                  index={idx}
                />
              );
            })}
          </div>
        </section>

        <MistColophon
          signature={
            <>
              <span>© {new Date().getFullYear()} · fezcode</span>
              <span>
                honors · {unlockedCount} of {total} held; the fog keeps the rest
              </span>
            </>
          }
        />
      </div>
    </div>
  );
};

export default MistAchievementsPage;
