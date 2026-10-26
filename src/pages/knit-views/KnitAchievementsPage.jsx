import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';
import { ACHIEVEMENTS } from '../../config/achievements';
import {
  KnitText,
  KnitHero,
  KnitCanvas,
  KnitNotice,
  KnitBand,
  YARN,
  swatchFor,
} from '../../components/knit';
import { makeGrid, fillRect, setCell } from '../../components/knit/engine';
import '../../styles/Knit.css';

/** A progress bar knitted as a scarf: gold rows grow along the bark. */
const ProgressScarf = ({ pct }) => (
  <KnitCanvas
    className="knt-swatch mt-6 max-w-2xl"
    build={(cols) => {
      const g = makeGrid(cols, 9, YARN.bark);
      fillRect(g, 0, 0, cols, 1, YARN.gold);
      fillRect(g, 0, 8, cols, 1, YARN.gold);
      const done = Math.round(((cols - 2) * pct) / 100);
      fillRect(g, 1, 2, done, 5, YARN.poppy);
      for (let c = 1; c < cols - 1; c += 4) setCell(g, c, 4, YARN.cream);
      return g;
    }}
    deps={[pct]}
  />
);

const AchievementCard = ({ achievement, unlocked, unlockedAt }) => {
  const { way, className } = swatchFor(achievement.id);
  return (
    <article
      className={`knt-card ${unlocked ? className : 'knt-wool-bark knt-pending'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <KnitText
          text={achievement.category}
          size="small"
          fg={unlocked ? way.accent : YARN.oat}
          fit
        />
        <KnitText
          text={unlocked ? '♥ Held' : 'Sealed'}
          size="small"
          fg={unlocked ? YARN.cream : YARN.oat}
          fit
        />
      </div>
      <div className="flex items-start gap-3 min-w-0">
        <span
          className="knt-patch knt-patch-tight shrink-0 flex items-center justify-center !p-0"
          style={{ width: '3rem', height: '3rem', fontSize: '1.3rem' }}
          aria-hidden="true"
        >
          {unlocked ? achievement.icon : '?'}
        </span>
        <KnitText
          as="h3"
          text={achievement.title}
          fg={unlocked ? way.fg : YARN.oat}
          maxLines={2}
          className="flex-1"
        />
      </div>
      <p className="knt-patch">{achievement.description}</p>
      <KnitText
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
        fg={unlocked ? way.accent : YARN.oat}
        className="mt-auto"
      />
    </article>
  );
};

const KnitAchievementsPage = () => {
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
    <div className="knt-root">
      <Seo
        title="Achievements | Fezcodex"
        description="Milestones from exploring Fezcodex, and discoveries still ahead."
      />
      <KnitHero
        eyebrow={`${unlockedCount} held · ${total} total · ${pct}% knitted`}
        title="Achievements"
        intro="Marks held, and marks still sealed. Each one is a row added to the scarf."
        wool="rust"
        motif="stars"
      >
        <ProgressScarf pct={pct} />
      </KnitHero>
      <div className="knt-page">
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((c) => {
            const val = c === 'All' ? 'all' : c;
            return (
              <button
                key={c}
                type="button"
                className="knt-tag"
                aria-pressed={activeCat === val}
                onClick={() => setActiveCat(val)}
              >
                {c}
              </button>
            );
          })}
        </div>
        {!showAchievementToast && (
          <p className="knt-label mb-6">
            Notices are off — re-enable them in{' '}
            <Link to="/settings" className="knt-link">
              settings
            </Link>
          </p>
        )}
        {filtered.length === 0 ? (
          <KnitNotice>No achievements in this section yet.</KnitNotice>
        ) : (
          <div className="knt-grid">
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
          <span className="knt-label">
            {unlockedCount} of {total} marks on record
          </span>
          <span className="knt-label">Sealed marks open in their own time</span>
        </div>
      </div>
      <KnitBand pattern={['peerie', 'hens', 'peerie']} className="mt-8" />
    </div>
  );
};

export default KnitAchievementsPage;
