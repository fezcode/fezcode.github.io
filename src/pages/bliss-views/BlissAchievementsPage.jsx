import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircleIcon,
  LockSimpleIcon,
  SquaresFourIcon,
  TrophyIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';
import { ACHIEVEMENTS } from '../../config/achievements';
import {
  BlissWindow,
  BlissIcon,
  BlissNotice,
  BlissProgress,
  TONES,
  toneFor,
} from '../../components/bliss';
import '../../styles/Bliss.css';

/** A glossy tile holding the achievement's own glyph, or "?" while locked. */
const AchievementTile = ({ achievement, unlocked }) => {
  const [hi, lo] = unlocked
    ? TONES[toneFor(achievement.category || achievement.id)]
    : TONES.graphite;
  return (
    <span
      className="bl-icon shrink-0"
      style={{
        width: 48,
        height: 48,
        fontSize: '1.4rem',
        background: `linear-gradient(180deg, ${hi}, ${lo})`,
      }}
      aria-hidden="true"
    >
      <span className="relative font-bold">
        {unlocked ? achievement.icon || '★' : '?'}
      </span>
    </span>
  );
};

const AchievementCard = ({ achievement, unlocked, unlockedAt }) => {
  return (
    <article
      className={`bl-card h-full ${unlocked ? '' : 'opacity-60 grayscale'}`}
      style={unlocked ? undefined : { background: '#f1efe2' }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="bl-eyebrow">{achievement.category}</span>
        <span
          className={`bl-label inline-flex items-center gap-1 ${unlocked ? '!text-[#2f7a12]' : ''}`}
        >
          {unlocked ? (
            <CheckCircleIcon size={14} weight="fill" aria-hidden="true" />
          ) : (
            <LockSimpleIcon size={14} weight="fill" aria-hidden="true" />
          )}
          {unlocked ? 'Unlocked' : 'Locked'}
        </span>
      </div>
      <div className="flex items-start gap-3 min-w-0">
        <AchievementTile achievement={achievement} unlocked={unlocked} />
        <h3 className="bl-card-title flex-1 min-w-0">{achievement.title}</h3>
      </div>
      <p className="text-sm">{achievement.description}</p>
      <p className="bl-meta mt-auto">
        {unlocked && unlockedAt
          ? `Unlocked ${new Date(unlockedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}`
          : unlocked
            ? 'On record'
            : 'Awaiting discovery'}
      </p>
    </article>
  );
};

const BlissAchievementsPage = () => {
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
    <div className="bl-root">
      <Seo
        title="Achievements | Fezcodex"
        description="Milestones from exploring Fezcodex, and discoveries still ahead."
      />
      <div className="bl-page">
        <BlissWindow
          title="Achievements"
          icon={TrophyIcon}
          tone="yellow"
          headingLevel={1}
          status={
            <>
              <span>
                {unlockedCount} unlocked · {total - unlockedCount} locked
              </span>
              <span>{pct}% complete</span>
            </>
          }
        >
          <div className="flex items-start gap-4">
            <BlissIcon
              icon={TrophyIcon}
              tone="yellow"
              size={56}
              className="hidden sm:inline-flex"
            />
            <div className="min-w-0 flex-1">
              <p className="bl-eyebrow">
                {unlockedCount} held · {total} total · {pct}% complete
              </p>
              <p className="bl-display mt-1" aria-hidden="true">
                Achievements
              </p>
              <p className="bl-muted mt-2">
                Marks held, and marks still sealed. Each one fills a little
                more of the bar.
              </p>
            </div>
          </div>
          <div className="bl-groupbox mt-5">
            <span className="bl-groupbox-label">Progress</span>
            <BlissProgress
              value={pct}
              label={`${unlockedCount} of ${total} achievements unlocked`}
            />
            <p className="bl-meta mt-2">
              {unlockedCount} of {total} unlocked ({pct}%)
            </p>
          </div>
          {!showAchievementToast && (
            <p className="bl-meta mt-4">
              Notices are off — re-enable them in{' '}
              <Link to="/settings" className="bl-link">
                settings
              </Link>
            </p>
          )}
        </BlissWindow>

        <BlissWindow
          title="Collection"
          icon={SquaresFourIcon}
          tone="green"
          status={
            <>
              <span>
                {filtered.length}{' '}
                {filtered.length === 1 ? 'object' : 'objects'}
              </span>
              <span>Sealed marks open in their own time</span>
            </>
          }
        >
          <div
            className="mb-4 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by category"
          >
            {categories.map((c) => {
              const val = c === 'All' ? 'all' : c;
              return (
                <button
                  key={c}
                  type="button"
                  className="bl-tag"
                  aria-pressed={activeCat === val}
                  onClick={() => setActiveCat(val)}
                >
                  {c}
                </button>
              );
            })}
          </div>
          {filtered.length === 0 ? (
            <BlissNotice>No achievements in this section yet.</BlissNotice>
          ) : (
            <div className="bl-grid">
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
          <p className="bl-meta mt-4">
            {unlockedCount} of {total} marks on record
          </p>
        </BlissWindow>
      </div>
    </div>
  );
};

export default BlissAchievementsPage;
