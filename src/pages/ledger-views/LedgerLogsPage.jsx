import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import piml from 'piml';
import Seo from '../../components/Seo';
import GenericModal from '../../components/GenericModal';
import RatingSystemDetail from '../../components/RatingSystemDetail';
import { useAchievements } from '../../context/AchievementContext';
import { useSidePanel } from '../../context/SidePanelContext';
import {
  LedgerFolio,
  LedgerNotice,
  LedgerRule,
  LedgerStamp,
} from '../../components/ledger';
import '../../styles/Ledger.css';

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

/**
 * Ledger theme logs page — the DAYBOOK. Every discovery is a dated line in a
 * hand-ruled register: date column, category, title, dotted leader, the
 * rating in star marks, and → OPEN. Entries group under ruled month heads,
 * newest first, exactly as a daybook is kept.
 */
const LedgerLogsPage = () => {
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
    <div className="ldg-root">
      <Seo
        title="Discovery Logs | Fezcodex"
        description="The daybook — things seen, read, played, tasted, each filed as a dated line in the register."
      />

      <div className="ldg-page">
        <LedgerFolio
          folio="FOLIO NO. 08 — THE DAYBOOK"
          title="DISCOVERY LOGS"
          sub="THINGS SEEN, READ, PLAYED, TASTED — FILED IN INK"
          aside={<LedgerStamp>RATED · FILED</LedgerStamp>}
        >
          <p className="ldg-stats mt-4">
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
        </LedgerFolio>

        {/* filters */}
        <div className="flex flex-col gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid var(--ldg-rule)' }}>
          <input
            className="ldg-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH THE DAYBOOK…"
            aria-label="Search logs"
          />
          <div className="flex flex-wrap gap-1.5 items-baseline">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className="ldg-chip"
                aria-pressed={selected.includes(c)}
                onClick={() => toggleCategory(c)}
              >
                {c}
              </button>
            ))}
            {(selected.length > 0 || query) && (
              <button type="button" className="ldg-chip" onClick={clearFilters}>
                [× CLEAR]
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 items-baseline">
            <button
              type="button"
              className="ldg-btn ldg-btn-accent"
              onClick={() => setShowInfo(true)}
            >
              RATING SCALE
            </button>
            <Link to="/reading" className="ldg-label no-underline hover:text-[var(--ldg-accent)]">
              READING LIST →
            </Link>
          </div>
        </div>

        {/* daybook */}
        {loading && <LedgerNotice>OPENING THE DAYBOOK…</LedgerNotice>}

        {!loading && filtered.length === 0 && (
          <>
            <LedgerNotice>
              NO ENTRIES MATCH — THE REGISTER STAYS BLANK
            </LedgerNotice>
            <div className="mt-3 text-center">
              <button type="button" className="ldg-btn" onClick={clearFilters}>
                CLEAR THE FILTERS
              </button>
            </div>
          </>
        )}

        {!loading &&
          groups.map((group) => (
            <section key={group.key} className="mb-6">
              <LedgerRule label={group.key} className="mb-2" />
              <ul className="list-none m-0 p-0 flex flex-col" style={{ gap: 2 }}>
                {group.entries.map((log) => {
                  const category = (log.category || 'log').toLowerCase();
                  const creator = creatorOf(log);
                  const rating = Number(log.rating) || 0;
                  return (
                    <li key={log.id}>
                      <Link
                        to={`/logs/${category}/${log.slug}`}
                        className="ldg-row-link"
                      >
                        <span className="ldg-rank shrink-0">
                          {isoDate(log.date)}
                        </span>
                        <span
                          className="ldg-label hidden md:inline shrink-0"
                          style={{ width: '9ch' }}
                        >
                          {category}
                        </span>
                        <span className="font-bold truncate">
                          {log.title}
                          {creator && (
                            <span className="ldg-muted font-normal">
                              {' '}
                              — {creator}
                            </span>
                          )}
                        </span>
                        <span className="ldg-leader" aria-hidden="true" />
                        <span
                          className="ldg-accent shrink-0"
                          aria-label={rating > 0 ? `Rated ${rating} of 5` : 'Unrated'}
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
          <p className="ldg-stats mt-8">
            <span>
              CARRIED FORWARD:{' '}
              <strong>{String(filtered.length).padStart(3, '0')}</strong>{' '}
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
        <div className="ldg-prose">
          <p>
            Every entry is weighed the same way — five marks, entered in ink.
            Stars are not preference; they record{' '}
            <strong>how much of the thing held up</strong>.
          </p>
          <dl className="ldg-meta mt-4">
            {[
              ['★★★★★', 'ESSENTIAL — pressed into hands, no caveats.'],
              ['★★★★·', 'CLEAR — recommended without hesitation.'],
              ['★★★··', 'WORTHWHILE — has its hour; it might be yours.'],
              ['★★···', 'THIN — a caveat beside every virtue.'],
              ['★····', 'STRUCK — kept only so the record is honest.'],
            ].map(([marks, desc]) => (
              <div className="ldg-meta-row" key={marks}>
                <dt className="ldg-meta-label">{marks}</dt>
                <dd className="ldg-meta-value">{desc}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            className="ldg-btn ldg-btn-accent mt-5 w-full"
            onClick={() => {
              setShowInfo(false);
              openSidePanel('Rating System Details', <RatingSystemDetail />, 600);
            }}
          >
            READ THE FULL GUIDE →
          </button>
        </div>
      </GenericModal>
    </div>
  );
};

export default LedgerLogsPage;
