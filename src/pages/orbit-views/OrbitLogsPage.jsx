import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import piml from 'piml';
import Seo from '../../components/Seo';
import GenericModal from '../../components/GenericModal';
import RatingSystemDetail from '../../components/RatingSystemDetail';
import { useAchievements } from '../../context/AchievementContext';
import { useSidePanel } from '../../context/SidePanelContext';
import {
  OrbitFolio,
  OrbitNotice,
  OrbitRule,
  OrbitStamp,
} from '../../components/orbit';
import '../../styles/Orbit.css';

const CATEGORIES = [
  'Book',
  'Movie',
  'Video',
  'Game',
  'Article',
  'Music',
  'Series',
  'Food',
  'Websites',
  'Tools',
  'Event',
  'Quote',
];

const MONTHS = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

const isoDate = (d) => {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toISOString().slice(0, 10);
};

const starLine = (rating) =>
  rating > 0 ? '★'.repeat(rating) + '·'.repeat(5 - rating) : '—';

const creatorOf = (log) =>
  log.author ||
  log.director ||
  log.artist ||
  log.creator ||
  log.by ||
  log.studio ||
  '';

const OrbitLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const { unlockAchievement } = useAchievements();
  const { openSidePanel } = useSidePanel();

  useEffect(() => {
    unlockAchievement('log_diver');
    let cancelled = false;
    (async () => {
      try {
        const fetches = CATEGORIES.map(async (c) => {
          const r = await fetch(
            `/logs/${c.toLowerCase()}/${c.toLowerCase()}.piml`,
          );
          if (!r.ok) return [];
          const txt = await r.text();
          const data = piml.parse(txt);
          return data.logs || [];
        });
        const all = (await Promise.all(fetches)).flat();
        const withId = all
          .map((log, i) => ({
            ...log,
            id: `${log.title}-${log.date}-${i}`,
            originalIndex: i,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        if (!cancelled) setLogs(withId);
      } catch (e) {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [unlockAchievement]);

  const toggleCategory = (c) =>
    setSelected((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  const clearFilters = () => {
    setSelected([]);
    setQuery('');
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return logs.filter((log) => {
      if (selected.length && !selected.includes(log.category)) return false;
      if (!q) return true;
      return (
        log.title?.toLowerCase().includes(q) ||
        log.description?.toLowerCase().includes(q) ||
        log.author?.toLowerCase().includes(q) ||
        (log.director || '').toLowerCase().includes(q)
      );
    });
  }, [logs, selected, query]);

  // Ruled month heads: the daybook is read newest page first.
  const groups = useMemo(() => {
    const byMonth = [];
    filtered.forEach((log) => {
      const date = new Date(log.date);
      const key = Number.isNaN(date.getTime())
        ? 'UNDATED'
        : `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
      const last = byMonth[byMonth.length - 1];
      if (last && last.key === key) {
        last.entries.push(log);
      } else {
        byMonth.push({ key, entries: [log] });
      }
    });
    return byMonth;
  }, [filtered]);

  return (
    <div className="orb-root">
      <Seo
        title="Discovery Logs | Fezcodex"
        description="Films, books, music, games, and other discoveries worth keeping."
      />

      <div className="orb-page">
        <OrbitFolio
          folio="FOLIO NO. 08 — DISCOVERY LOGS"
          title="DISCOVERY LOGS"
          sub="Things seen, read, played, tasted. A record of curiosity."
          aside={<OrbitStamp>Collected along the way</OrbitStamp>}
        >
          <p className="orb-stats mt-4">
            <span>
              <strong>{String(logs.length).padStart(3, '0')}</strong> ENTRIES
            </span>
            <span>
              <strong>{String(CATEGORIES.length).padStart(2, '0')}</strong>{' '}
              CATEGORIES
            </span>
            <span>
              <strong>{String(filtered.length).padStart(3, '0')}</strong> SHOWN
            </span>
            <span>
              SCALE <strong>1★–5★</strong>
            </span>
          </p>
        </OrbitFolio>

        {/* filters */}
        <div
          className="flex flex-col gap-3 mb-6 pb-4"
          style={{ borderBottom: '1px solid var(--orb-rule)' }}
        >
          <input
            className="orb-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search discoveries…"
            aria-label="Search logs"
          />
          <div className="flex flex-wrap gap-1.5 items-baseline">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className="orb-chip"
                aria-pressed={selected.includes(c)}
                onClick={() => toggleCategory(c)}
              >
                {c}
              </button>
            ))}
            {(selected.length > 0 || query) && (
              <button type="button" className="orb-chip" onClick={clearFilters}>
                [× CLEAR]
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 items-baseline">
            <button
              type="button"
              className="orb-btn orb-btn-accent"
              onClick={() => setShowInfo(true)}
            >
              RATING SCALE
            </button>
            <Link
              to="/reading"
              className="orb-label no-underline hover:text-[var(--orb-accent)]"
            >
              READING LIST →
            </Link>
          </div>
        </div>

        {/* daybook */}
        {loading && <OrbitNotice>OPENING DISCOVERY LOGS…</OrbitNotice>}

        {!loading && filtered.length === 0 && (
          <>
            <OrbitNotice>
              NO ENTRIES MATCH — THE COLLECTION STAYS BLANK
            </OrbitNotice>
            <div className="mt-3 text-center">
              <button type="button" className="orb-btn" onClick={clearFilters}>
                CLEAR THE FILTERS
              </button>
            </div>
          </>
        )}

        {!loading &&
          groups.map((group) => (
            <section key={group.key} className="mb-6">
              <OrbitRule label={group.key} className="mb-2" />
              <ul
                className="list-none m-0 p-0 flex flex-col"
                style={{ gap: 2 }}
              >
                {group.entries.map((log) => {
                  const category = (log.category || 'log').toLowerCase();
                  const creator = creatorOf(log);
                  const rating = Number(log.rating) || 0;
                  return (
                    <li key={log.id}>
                      <Link
                        to={`/logs/${category}/${log.slug}`}
                        className="orb-row-link"
                      >
                        <span className="orb-rank shrink-0">
                          {isoDate(log.date)}
                        </span>
                        <span
                          className="orb-label hidden md:inline shrink-0"
                          style={{ width: '9ch' }}
                        >
                          {category}
                        </span>
                        <span className="font-bold truncate">
                          {log.title}
                          {creator && (
                            <span className="orb-muted font-normal">
                              {' '}
                              — {creator}
                            </span>
                          )}
                        </span>
                        <span className="orb-leader" aria-hidden="true" />
                        <span
                          className="orb-accent shrink-0"
                          aria-label={
                            rating > 0 ? `Rated ${rating} of 5` : 'Unrated'
                          }
                        >
                          {starLine(rating)}
                        </span>
                        <span className="font-bold shrink-0" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

        {!loading && filtered.length > 0 && (
          <p className="orb-stats mt-8">
            <span>
              TOTAL: <strong>{String(filtered.length).padStart(3, '0')}</strong>{' '}
              ENTRIES THIS VIEW
            </span>
          </p>
        )}
      </div>

      {/* rating scale */}
      <GenericModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Rating scale"
      >
        <div className="orb-prose">
          <p>
            Every entry uses the same five-star scale. Stars are not preference;
            they record <strong>how much of the thing held up</strong>.
          </p>
          <dl className="orb-meta mt-4">
            {[
              ['★★★★★', 'ESSENTIAL — pressed into hands, no caveats.'],
              ['★★★★·', 'CLEAR — recommended without hesitation.'],
              ['★★★··', 'WORTHWHILE — has its hour; it might be yours.'],
              ['★★···', 'THIN — a caveat beside every virtue.'],
              ['★····', 'STRUCK — kept only so the record is honest.'],
            ].map(([marks, desc]) => (
              <div className="orb-meta-row" key={marks}>
                <dt className="orb-meta-label">{marks}</dt>
                <dd className="orb-meta-value">{desc}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            className="orb-btn orb-btn-accent mt-5 w-full"
            onClick={() => {
              setShowInfo(false);
              openSidePanel(
                'Rating System Details',
                <RatingSystemDetail />,
                600,
              );
            }}
          >
            READ THE FULL GUIDE →
          </button>
        </div>
      </GenericModal>
    </div>
  );
};

export default OrbitLogsPage;
