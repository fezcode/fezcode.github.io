import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';
import { ACHIEVEMENTS } from '../../config/achievements';
import {
  StudioFolio,
  StudioNotice,
  StudioRule,
  StudioStamp,
} from '../../components/studio';
import '../../styles/Studio.css';

const AchievementCard = ({ achievement, unlocked, unlockedAt }) => (
  <article
    className={`std-card ${unlocked ? '' : 'is-pending'} p-4 flex flex-col gap-3`}
  >
    <div className="flex items-baseline justify-between gap-3">
      <span className={unlocked ? 'std-eyebrow' : 'std-label'}>
        {achievement.category}
      </span>
      {unlocked ? (
        <span className="std-badge">✓ HELD</span>
      ) : (
        <span className="std-label">SEALED</span>
      )}
    </div>

    <div className="flex items-start gap-3 min-w-0">
      <span
        className="std-sunken shrink-0 flex items-center justify-center"
        style={{ width: '2.5rem', height: '2.5rem', fontSize: '1.1rem' }}
        aria-hidden="true"
      >
        {unlocked ? achievement.icon : '▒'}
      </span>
      <div className="min-w-0">
        <h3
          className="std-highlight font-bold uppercase m-0"
          style={{ fontSize: '0.9rem', letterSpacing: '1px' }}
        >
          {achievement.title}
        </h3>
        <p className="std-muted m-0 mt-1" style={{ fontSize: '0.8rem' }}>
          {achievement.description}
        </p>
      </div>
    </div>

    <div className="std-leader-row mt-auto pt-1">
      <span className="std-label">{unlocked ? 'SAVED' : 'STATUS'}</span>
      <span className="std-leader" aria-hidden="true" />
      <span
        className={unlocked ? 'std-accent' : 'std-muted'}
        style={{ fontSize: '0.76rem' }}
      >
        {unlocked && unlockedAt
          ? new Date(unlockedAt)
              .toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
              .toUpperCase()
          : unlocked
            ? 'ON RECORD'
            : 'AWAITING ENTRY'}
      </span>
    </div>
  </article>
);

const StudioAchievementsPage = () => {
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
  const filledCells = Math.round(pct / 10);
  const balanceBar = `[${'█'.repeat(filledCells)}${'░'.repeat(10 - filledCells)}]`;

  const filtered = useMemo(
    () =>
      ACHIEVEMENTS.filter(
        (a) => activeCat === 'all' || a.category === activeCat,
      ),
    [activeCat],
  );

  return (
    <div className="std-root">
      <Seo
        title="Achievements | Fezcodex"
        description="Milestones from exploring Fezcodex, and discoveries still ahead."
      />
      <div className="std-page">
        <StudioFolio
          folio="FOLIO NO. 10 — AUDIT"
          title="ACHIEVEMENTS"
          sub="MARKS HELD AND MARKS STILL SEALED"
          aside={<StudioStamp>Audited</StudioStamp>}
        >
          <p className="std-stats mt-3">
            <span>
              <strong>{String(unlockedCount).padStart(2, '0')}</strong> HELD
            </span>
            <span>
              <strong>{String(total).padStart(2, '0')}</strong> TOTAL
            </span>
            <span>
              BALANCE{' '}
              <strong style={{ fontVariantNumeric: 'tabular-nums' }}>
                {balanceBar} {pct}%
              </strong>
            </span>
          </p>
        </StudioFolio>

        <div className="mb-6 flex flex-wrap items-baseline gap-1.5">
          {categories.map((c) => {
            const val = c === 'All' ? 'all' : c;
            return (
              <button
                key={c}
                type="button"
                className="std-chip"
                aria-pressed={activeCat === val}
                onClick={() => setActiveCat(val)}
              >
                {c}
              </button>
            );
          })}
        </div>

        {!showAchievementToast && (
          <p className="std-label mb-6">
            NOTICES ARE OFF — RE-ENABLE THEM IN{' '}
            <Link to="/settings" className="std-accent">
              SETTINGS
            </Link>
          </p>
        )}

        {filtered.length === 0 ? (
          <StudioNotice>No achievements in this section yet.</StudioNotice>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

        <footer className="mt-12">
          <StudioRule className="mb-4" />
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="std-label">
              AUDIT · {String(unlockedCount).padStart(2, '0')} OF{' '}
              {String(total).padStart(2, '0')} MARKS ON RECORD
            </span>
            <span className="std-label">
              SEALED MARKS OPEN IN THEIR OWN TIME
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StudioAchievementsPage;
