import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';
import { ACHIEVEMENTS } from '../../config/achievements';
import {
  LedgerFolio,
  LedgerNotice,
  LedgerRule,
  LedgerStamp,
} from '../../components/ledger';
import '../../styles/Ledger.css';

/**
 * Ledger view of the achievements — the AUDIT folio. Marks already held are
 * solid entries with a ✓ badge and their filing date; marks still sealed sit
 * as dashed pending cards. The tally is drawn as a block-character balance
 * bar, the way this book counts everything.
 */
const AchievementCard = ({ achievement, unlocked, unlockedAt }) => (
  <article className={`ldg-card ${unlocked ? '' : 'is-pending'} p-4 flex flex-col gap-3`}>
    <div className="flex items-baseline justify-between gap-3">
      <span className={unlocked ? 'ldg-eyebrow' : 'ldg-label'}>
        {achievement.category}
      </span>
      {unlocked ? (
        <span className="ldg-badge">✓ HELD</span>
      ) : (
        <span className="ldg-label">SEALED</span>
      )}
    </div>

    <div className="flex items-start gap-3 min-w-0">
      <span
        className="ldg-sunken shrink-0 flex items-center justify-center"
        style={{ width: '2.5rem', height: '2.5rem', fontSize: '1.1rem' }}
        aria-hidden="true"
      >
        {unlocked ? achievement.icon : '▒'}
      </span>
      <div className="min-w-0">
        <h3
          className="ldg-highlight font-bold uppercase m-0"
          style={{ fontSize: '0.9rem', letterSpacing: '1px' }}
        >
          {achievement.title}
        </h3>
        <p className="ldg-muted m-0 mt-1" style={{ fontSize: '0.8rem' }}>
          {achievement.description}
        </p>
      </div>
    </div>

    <div className="ldg-leader-row mt-auto pt-1">
      <span className="ldg-label">{unlocked ? 'FILED' : 'STATUS'}</span>
      <span className="ldg-leader" aria-hidden="true" />
      <span className={unlocked ? 'ldg-accent' : 'ldg-muted'} style={{ fontSize: '0.76rem' }}>
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

const LedgerAchievementsPage = () => {
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
    <div className="ldg-root">
      <Seo
        title="Achievements | Fezcodex"
        description="The audit folio — marks held on record and marks still sealed."
      />
      <div className="ldg-page">
        <LedgerFolio
          folio="FOLIO NO. 10 — AUDIT"
          title="ACHIEVEMENTS"
          sub="MARKS HELD AND MARKS STILL SEALED"
          aside={<LedgerStamp>AUDITED</LedgerStamp>}
        >
          <p className="ldg-stats mt-3">
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
        </LedgerFolio>

        <div className="mb-6 flex flex-wrap items-baseline gap-1.5">
          {categories.map((c) => {
            const val = c === 'All' ? 'all' : c;
            return (
              <button
                key={c}
                type="button"
                className="ldg-chip"
                aria-pressed={activeCat === val}
                onClick={() => setActiveCat(val)}
              >
                {c}
              </button>
            );
          })}
        </div>

        {!showAchievementToast && (
          <p className="ldg-label mb-6">
            NOTICES ARE OFF — RE-ENABLE THEM IN{' '}
            <Link to="/settings" className="ldg-accent">
              SETTINGS
            </Link>
          </p>
        )}

        {filtered.length === 0 ? (
          <LedgerNotice>NO MARKS FILED UNDER THIS SECTION</LedgerNotice>
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
          <LedgerRule className="mb-4" />
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="ldg-label">
              AUDIT · {String(unlockedCount).padStart(2, '0')} OF{' '}
              {String(total).padStart(2, '0')} MARKS ON RECORD
            </span>
            <span className="ldg-label">SEALED MARKS OPEN IN THEIR OWN TIME</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LedgerAchievementsPage;
