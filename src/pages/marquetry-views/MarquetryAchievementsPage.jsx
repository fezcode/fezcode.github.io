import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';
import { ACHIEVEMENTS } from '../../config/achievements';
import {
  MarquetryText,
  MarquetryHero,
  MarquetryNotice,
  MarquetryBand,
  WOOD,
} from '../../components/marquetry';
import '../../styles/Marquetry.css';

const InlayProgress = ({ pct }) => (
  <div
    className="mqt-progress mt-6 max-w-2xl"
    role="progressbar"
    aria-label="Achievements completed"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={pct}
  >
    <span className="mqt-progress-fill" style={{ width: `${pct}%` }} />
  </div>
);

const AchievementCard = ({ achievement, unlocked, unlockedAt }) => {
  return (
    <article
      className={`mqt-card mqt-achievement ${unlocked ? 'is-unlocked' : 'mqt-pending'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <MarquetryText
          text={achievement.category}
          size="small"
          fg={unlocked ? WOOD.teal : WOOD.bark}
          fit
        />
        <MarquetryText
          text={unlocked ? '◆ Collected' : 'Sealed'}
          size="small"
          fg={WOOD.ink}
          fit
        />
      </div>
      <div className="flex items-start gap-3 min-w-0">
        <span
          className="mqt-patch mqt-patch-tight shrink-0 flex items-center justify-center !p-0"
          style={{ width: '3rem', height: '3rem', fontSize: '1.3rem' }}
          aria-hidden="true"
        >
          {unlocked ? achievement.icon : '?'}
        </span>
        <MarquetryText
          as="h3"
          text={achievement.title}
          fg={WOOD.ink}
          maxLines={2}
          className="flex-1"
        />
      </div>
      <p className="mqt-patch">{achievement.description}</p>
      <MarquetryText
        text={
          unlocked && unlockedAt
            ? `Saved ${new Date(unlockedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}`
            : unlocked
              ? 'On record'
              : 'Awaiting entry'
        }
        size="small"
        fg={unlocked ? WOOD.teal : WOOD.bark}
        className="mt-auto"
      />
    </article>
  );
};

const MarquetryAchievementsPage = () => {
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
  const pct = total ? Math.round((unlockedCount / total) * 100) : 0;

  const filtered = useMemo(
    () =>
      ACHIEVEMENTS.filter(
        (a) => activeCat === 'all' || a.category === activeCat,
      ),
    [activeCat],
  );

  return (
    <div className="mqt-root">
      <Seo
        title="Achievements | Fezcodex"
        description="Milestones from exploring Fezcodex, and discoveries still ahead."
      />
      <MarquetryHero
        eyebrow={`${unlockedCount} collected · ${total} total · ${pct}% complete`}
        title="Achievements"
        intro="Milestones collected, and discoveries still ahead. Every one adds a piece to the codex."
      >
        <InlayProgress pct={pct} />
      </MarquetryHero>
      <div className="mqt-page">
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((c) => {
            const val = c === 'All' ? 'all' : c;
            return (
              <button
                key={c}
                type="button"
                className="mqt-tag"
                aria-pressed={activeCat === val}
                onClick={() => setActiveCat(val)}
              >
                {c}
              </button>
            );
          })}
        </div>
        {!showAchievementToast && (
          <p className="mqt-label mb-6">
            Notices are off — re-enable them in{' '}
            <Link to="/settings" className="mqt-link">
              settings
            </Link>
          </p>
        )}
        {filtered.length === 0 ? (
          <MarquetryNotice>
            No achievements in this section yet.
          </MarquetryNotice>
        ) : (
          <div className="mqt-grid">
            {filtered.map((a) => {
              const entry = unlockedAchievements[a.id];
              return (
                <AchievementCard
                  key={a.id}
                  achievement={a}
                  unlocked={!!entry?.unlocked}
                  unlockedAt={entry?.unlockedAt}
                />
              );
            })}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-12">
          <span className="mqt-label">
            {unlockedCount} of {total} marks on record
          </span>
          <span className="mqt-label">Sealed marks open in their own time</span>
        </div>
      </div>
      <MarquetryBand pattern={['peerie', 'hens', 'peerie']} className="mt-8" />
    </div>
  );
};

export default MarquetryAchievementsPage;
