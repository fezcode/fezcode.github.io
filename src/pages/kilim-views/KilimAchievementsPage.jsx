import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useAchievements } from '../../context/AchievementContext';
import { ACHIEVEMENTS } from '../../config/achievements';
import {
  KilimText,
  KilimRug,
  KilimCanvas,
  KilimBand,
  KilimNotice,
  WOOL,
  COLOURWAYS,
  pickBySeed,
  medallion,
  star,
} from '../../components/kilim';
import { makeGrid, setCell } from '../../components/kilim/engine';
import '../../styles/Kilim.css';
import './kilim-utility.css';

/*
 * Achievements as a dowry chest of woven medallions. Each category is a
 * walnut chest with a sawtooth lid; earned marks are göls woven in full
 * colour, sealed ones are still bare warp with only their ivory outline laid
 * in. The progress bar is the loom itself: woven rows on the left, bare warp
 * threads waiting on the right.
 */

/** Warp threads that have no weft over them yet. */
const WARP = '#4a2e20';
const WARP_IVORY = '#c9bc9f';
const SEALED_WAY = {
  rim: WOOL.ivory,
  a: WARP,
  b: WOOL.walnut,
  core: WOOL.walnut,
  eye: WOOL.ivory,
};

const MED_COLS = 25;
const MED_ROWS = 31;

const medallionGrid = (seed, earned) => {
  const cx = Math.floor(MED_COLS / 2);
  const cy = Math.floor(MED_ROWS / 2);
  if (!earned) {
    const g = makeGrid(MED_COLS, MED_ROWS, WOOL.walnut);
    for (let r = 0; r < MED_ROWS; r++)
      for (let c = 1; c < MED_COLS; c += 3) setCell(g, c, r, WARP);
    medallion(g, cx, cy, 9, SEALED_WAY);
    return g;
  }
  const way = pickBySeed(seed, COLOURWAYS);
  const g = makeGrid(MED_COLS, MED_ROWS, way.ground);
  for (let c = 0; c < MED_COLS; c++) {
    setCell(g, c, 0, WOOL.walnut);
    setCell(g, c, MED_ROWS - 1, WOOL.walnut);
    setCell(g, c, 1, c % 2 ? way.border : WOOL.walnut);
    setCell(g, c, MED_ROWS - 2, c % 2 ? way.border : WOOL.walnut);
  }
  medallion(g, cx, cy, 9, way);
  [
    [3, 5],
    [MED_COLS - 4, 5],
    [3, MED_ROWS - 6],
    [MED_COLS - 4, MED_ROWS - 6],
  ].forEach(([x, y]) => star(g, x, y, way.b, way.eye));
  return g;
};

/** The loom as a progress bar: woven sawtooth, then bare warp. */
const LoomProgress = ({ pct }) => (
  <KilimCanvas
    className="klm-ach-loom"
    seed="kilim-achievements-loom"
    build={(cols) => {
      const rows = 12;
      const g = makeGrid(cols, rows, WOOL.walnut);
      const done = Math.round((cols * pct) / 100);
      for (let r = 1; r < rows - 1; r++)
        for (let c = 0; c < cols; c++) {
          let hex;
          if (c < done) {
            if (r === 1 || r === rows - 2) hex = WOOL.saffron;
            else {
              const k = r - 2;
              const x = c % 8;
              hex = x < k ? WOOL.ivory : x === k ? WOOL.indigo : WOOL.madder;
            }
          } else {
            hex = c % 2 === 0 ? WARP_IVORY : WOOL.walnut;
          }
          setCell(g, c, r, hex);
        }
      return g;
    }}
    deps={[pct]}
  />
);

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const Medallion = ({ achievement, unlocked, unlockedAt }) => (
  <li>
    <article className={`klm-ach-piece ${unlocked ? 'is-earned' : 'is-sealed'}`}>
      <div className="klm-ach-medallion">
        <KilimCanvas
          cols={MED_COLS}
          seed={achievement.id}
          build={() => medallionGrid(achievement.id, unlocked)}
          deps={[achievement.id, unlocked]}
        />
        <span className="klm-ach-icon" aria-hidden="true">
          {unlocked ? achievement.icon : '?'}
        </span>
      </div>
      <h3 className="klm-ach-title">{achievement.title}</h3>
      <p className="klm-ach-desc">{achievement.description}</p>
      <span className="klm-ach-state">
        {unlocked && unlockedAt
          ? `Woven ${formatDate(unlockedAt)}`
          : unlocked
            ? 'Woven'
            : 'Bare warp'}
      </span>
    </article>
  </li>
);

const KilimAchievementsPage = () => {
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

  // one chest per category, in the order the filter chips list them
  const chests = useMemo(() => {
    const byCat = new Map();
    filtered.forEach((a) => {
      if (!byCat.has(a.category)) byCat.set(a.category, []);
      byCat.get(a.category).push(a);
    });
    return [...byCat.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="klm-root">
      <Seo
        title="Achievements | Fezcodex"
        description="Milestones from exploring Fezcodex, and discoveries still ahead."
      />
      <div className="klm-page">
        <KilimRug
          eyebrow={`${unlockedCount} woven · ${total} total · ${pct}% off the loom`}
          title="Achievements"
          intro="The dowry chest. Earned marks are woven in full colour; the rest are still bare warp, waiting for their weft."
          seed="kilim-achievements"
        >
          <div className="klm-ach-progress">
            <LoomProgress pct={pct} />
            <div className="klm-ach-progress-meta">
              <span>
                {unlockedCount} of {total} woven
              </span>
              <span>{pct}%</span>
            </div>
          </div>
        </KilimRug>

        <div
          className="klm-ach-filters"
          role="group"
          aria-label="Achievement categories"
        >
          {categories.map((c) => {
            const val = c === 'All' ? 'all' : c;
            return (
              <button
                key={c}
                type="button"
                className="klm-chip"
                aria-pressed={activeCat === val}
                onClick={() => setActiveCat(val)}
              >
                {c}
              </button>
            );
          })}
        </div>

        {!showAchievementToast && (
          <p className="klm-label klm-ach-notice">
            Notices are off. Re-enable them in{' '}
            <Link to="/settings" className="klm-link">
              settings
            </Link>
          </p>
        )}

        {filtered.length === 0 ? (
          <KilimNotice>No achievements in this section yet.</KilimNotice>
        ) : (
          chests.map(([category, list]) => {
            const held = list.filter(
              (a) => unlockedAchievements[a.id]?.unlocked,
            ).length;
            return (
              <section key={category} className="klm-ach-chest klm-wool-walnut">
                <KilimBand
                  pattern="teeth"
                  options={{ ground: WOOL.madder, tooth: WOOL.ivory }}
                />
                <div className="klm-ach-head">
                  <KilimText as="h2" text={category} fg={WOOL.saffron} />
                  <span className="klm-ach-count">
                    {held} / {list.length} woven
                  </span>
                </div>
                <ul className="klm-ach-grid">
                  {list.map((a) => {
                    const entry = unlockedAchievements[a.id];
                    return (
                      <Medallion
                        key={a.id}
                        achievement={a}
                        unlocked={!!entry?.unlocked}
                        unlockedAt={entry?.unlockedAt}
                      />
                    );
                  })}
                </ul>
              </section>
            );
          })
        )}

        <div className="klm-ach-foot">
          <span className="klm-label">
            {unlockedCount} of {total} marks on record
          </span>
          <span className="klm-label">Bare warp fills in its own time</span>
        </div>
      </div>
      <KilimBand pattern={['stripe', 'chain', 'stripe']} />
    </div>
  );
};

export default KilimAchievementsPage;
