import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import piml from 'piml';
import Seo from '../../components/Seo';
import GenericModal from '../../components/GenericModal';
import RatingSystemDetail from '../../components/RatingSystemDetail';
import { useAchievements } from '../../context/AchievementContext';
import { useSidePanel } from '../../context/SidePanelContext';
import {
  KilimRug,
  KilimText,
  KilimBand,
  KilimNotice,
  WOOL,
  pickBySeed,
} from '../../components/kilim';
import {
  FALLBACK_CATEGORIES,
  fetchLogCategories,
  fetchLogsForCategories,
} from '../../utils/logCategories';
import '../../styles/Kilim.css';
import './kilim-logs.css';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Each log category is its own dye lot. The runner's woven ends carry it.
const DYES = {
  book: WOOL.madder,
  movie: WOOL.indigoLight,
  video: WOOL.apricot,
  game: WOOL.pistachio,
  article: WOOL.ivory,
  music: WOOL.rose,
  series: WOOL.teal,
  food: WOOL.saffron,
  websites: WOOL.aubergine,
  tools: WOOL.indigo,
  event: WOOL.apricot,
  quote: WOOL.ivory,
};
const SPARE_DYES = [
  WOOL.madder,
  WOOL.teal,
  WOOL.saffron,
  WOOL.pistachio,
  WOOL.rose,
  WOOL.indigoLight,
];

/** The dye of a log category (unknown categories get a seeded one). */
export const logDye = (category) => {
  const key = String(category || 'log').toLowerCase();
  return DYES[key] || pickBySeed(key, SPARE_DYES);
};

// Bands that close each month's bale, in turn.
const MONTH_BANDS = ['teeth', 'chain', 'stars'];

/** Five weft pips, saffron for each point of the rating. */
export const RatingPips = ({ rating, className = '' }) => (
  <span
    className={`klm-logs-pips ${className}`}
    role="img"
    aria-label={rating > 0 ? `Rated ${rating} of 5` : 'Unrated'}
  >
    {[1, 2, 3, 4, 5].map((n) => (
      <span
        key={n}
        className="klm-logs-pip"
        data-on={n <= rating ? 'true' : undefined}
      />
    ))}
  </span>
);

const dayAndMonth = (d) => {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  return {
    day: date.getDate(),
    month: MONTHS[date.getMonth()].slice(0, 3),
  };
};

const creatorOf = (log) =>
  log.author ||
  log.director ||
  log.artist ||
  log.creator ||
  log.by ||
  log.studio ||
  '';

/**
 * Kilim /logs: a dyer's daybook. The filters live on a dye card at the side
 * (one dyed swatch per category, with its count); the entries are a stack
 * of narrow woven runners, each with fringed ends dyed in its category,
 * baled by month.
 */
const KilimLogsPage = () => {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
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
        const cats = await fetchLogCategories();
        setCategories(cats);
        const all = await fetchLogsForCategories(cats, piml.parse);
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

  const counts = useMemo(() => {
    const out = {};
    logs.forEach((log) => {
      const key = String(log.category || '').toLowerCase();
      out[key] = (out[key] || 0) + 1;
    });
    return out;
  }, [logs]);

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

  // Month bales, newest first.
  const groups = useMemo(() => {
    const byMonth = [];
    filtered.forEach((log) => {
      const date = new Date(log.date);
      const key = Number.isNaN(date.getTime())
        ? 'Undated'
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

  const filtering = selected.length > 0 || query;

  return (
    <div className="klm-root klm-logs">
      <Seo
        title="Discovery Logs | Fezcodex"
        description="Films, books, music, games, and other discoveries worth keeping."
      />
      <div className="klm-page !pb-0">
        <KilimRug
          eyebrow="Collected along the way"
          title="Discovery logs"
          intro="Things seen, read, played, tasted. A record of curiosity, one runner per find."
          seed="discovery-logs"
        />
      </div>

      <div className="klm-page klm-logs-layout">
        {/* ---- the dye card: search, category swatches, rating scale ---- */}
        <aside className="klm-logs-dyecard" aria-label="Filter the logs">
          <p className="klm-logs-dyecard-head">Dye card</p>
          <label className="block">
            <span className="klm-label block mb-1.5">Search the daybook</span>
            <input
              type="search"
              className="klm-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search discoveries…"
              aria-label="Search logs"
            />
          </label>

          <p className="klm-label mt-5 mb-2" id="klm-logs-dye-label">
            Dye lots
          </p>
          <ul
            className="klm-logs-lots"
            role="group"
            aria-labelledby="klm-logs-dye-label"
          >
            {categories.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  className="klm-logs-lot"
                  aria-pressed={selected.includes(c)}
                  onClick={() => toggleCategory(c)}
                  style={{ '--dye': logDye(c) }}
                >
                  <span className="klm-logs-swatch" aria-hidden="true" />
                  <span className="klm-logs-lot-name">{c}</span>
                  <span className="klm-logs-lot-count">
                    {counts[c.toLowerCase()] || 0}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {filtering && (
            <button
              type="button"
              className="klm-btn klm-btn-small klm-btn-madder mt-3 w-full"
              onClick={clearFilters}
            >
              × Clear filters
            </button>
          )}

          <dl className="klm-logs-tally">
            <div>
              <dt>Entries</dt>
              <dd>{logs.length}</dd>
            </div>
            <div>
              <dt>Lots</dt>
              <dd>{categories.length}</dd>
            </div>
            <div>
              <dt>Shown</dt>
              <dd>{filtered.length}</dd>
            </div>
          </dl>

          <button
            type="button"
            className="klm-btn klm-btn-ivory klm-btn-small mt-4 w-full"
            onClick={() => setShowInfo(true)}
          >
            Rating scale
          </button>
          <Link to="/reading" className="klm-link inline-block mt-4">
            Reading list →
          </Link>
        </aside>

        {/* ---- the stack of runners ---- */}
        <div className="klm-logs-stack">
          {loading && <KilimNotice>Taking the runners off the loom…</KilimNotice>}

          {!loading && filtered.length === 0 && (
            <KilimNotice>
              No entries match, so the loom stays bare.{' '}
              <button type="button" className="klm-link" onClick={clearFilters}>
                Clear the filters
              </button>
            </KilimNotice>
          )}

          {!loading &&
            groups.map((group, gi) => (
              <section key={group.key} className="klm-logs-bale">
                <div className="klm-section-head !mb-3">
                  <KilimText as="h2" text={group.key} fg={WOOL.saffron} />
                  <span className="klm-label">
                    {group.entries.length}{' '}
                    {group.entries.length === 1 ? 'runner' : 'runners'}
                  </span>
                </div>
                <ul className="klm-logs-runners">
                  {group.entries.map((log) => {
                    const category = (log.category || 'log').toLowerCase();
                    const creator = creatorOf(log);
                    const rating = Number(log.rating) || 0;
                    const when = dayAndMonth(log.date);
                    return (
                      <li key={log.id} style={{ '--dye': logDye(category) }}>
                        <Link
                          to={`/logs/${category}/${log.slug}`}
                          className="klm-logs-runner"
                        >
                          <span className="klm-logs-end" aria-hidden="true" />
                          <span className="klm-date">
                            {when ? (
                              <>
                                <b>{when.day}</b>
                                <span>{when.month}</span>
                              </>
                            ) : (
                              <b>–</b>
                            )}
                          </span>
                          <div className="klm-logs-runner-body">
                            <span className="klm-logs-runner-cat">
                              {category}
                            </span>
                            <h3 className="klm-logs-runner-title">
                              {log.title}
                            </h3>
                            {creator && (
                              <span className="klm-logs-runner-by">
                                {creator}
                              </span>
                            )}
                          </div>
                          <RatingPips rating={rating} />
                          <span
                            className="klm-logs-end klm-logs-end-r"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <KilimBand
                  pattern={MONTH_BANDS[gi % MONTH_BANDS.length]}
                  className="klm-logs-bale-band"
                />
              </section>
            ))}

          {!loading && filtered.length > 0 && (
            <p className="klm-label mt-8">
              Total: {filtered.length} runners in this view
            </p>
          )}
        </div>
      </div>

      <GenericModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Rating scale"
      >
        <div>
          <p>
            Every entry uses the same five-pip scale. Pips are not preference;
            they record <strong>how much of the thing held up</strong>.
          </p>
          <dl className="mt-4 grid gap-2">
            {[
              [5, 'Essential: pressed into hands, no caveats.'],
              [4, 'Clear: recommended without hesitation.'],
              [3, 'Worthwhile: has its hour; it might be yours.'],
              [2, 'Thin: a caveat beside every virtue.'],
              [1, 'Struck: kept only so the record is honest.'],
            ].map(([pips, desc]) => (
              <div className="flex gap-3 items-center" key={pips}>
                <dt className="shrink-0">
                  <RatingPips rating={pips} />
                </dt>
                <dd>{desc}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            className="klm-btn mt-5 w-full"
            onClick={() => {
              setShowInfo(false);
              openSidePanel('Rating System Details', <RatingSystemDetail />, 600);
            }}
          >
            Read the full guide →
          </button>
        </div>
      </GenericModal>
    </div>
  );
};

export default KilimLogsPage;
