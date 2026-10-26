import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import piml from 'piml';
import Seo from '../../components/Seo';
import GenericModal from '../../components/GenericModal';
import RatingSystemDetail from '../../components/RatingSystemDetail';
import { useAchievements } from '../../context/AchievementContext';
import { useSidePanel } from '../../context/SidePanelContext';
import {
  KnitText,
  KnitIcon,
  KnitHero,
  KnitNotice,
  KnitBand,
  YARN,
} from '../../components/knit';
import {
  FALLBACK_CATEGORIES,
  fetchLogCategories,
  fetchLogsForCategories,
} from '../../utils/logCategories';
import '../../styles/Knit.css';

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

const MONTH_BANDS = ['zigzag', 'checks', 'lice'];

const isoDate = (d) => {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toISOString().slice(0, 10);
};

/** Hearts knitted in for the stars: ♥♥♥-- */
export const heartLine = (rating) =>
  rating > 0 ? '♥'.repeat(rating) + '-'.repeat(5 - rating) : '-';

const creatorOf = (log) =>
  log.author ||
  log.director ||
  log.artist ||
  log.creator ||
  log.by ||
  log.studio ||
  '';

const KnitLogsPage = () => {
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

  // Month heads: the daybook is read newest page first.
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

  return (
    <div className="knt-root">
      <Seo
        title="Discovery Logs | Fezcodex"
        description="Films, books, music, games, and other discoveries worth keeping."
      />
      <KnitHero
        eyebrow="Collected along the way"
        title="Discovery logs"
        intro="Things seen, read, played, tasted. A record of curiosity."
        wool="denim"
        motif="snow"
      >
        <KnitText
          text={`${logs.length} entries · ${categories.length} categories · ${filtered.length} shown · scale 1-5 ♥`}
          size="small"
          fg={YARN.gold}
          className="mt-6"
        />
        <input
          className="knt-input mt-6 max-w-2xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search discoveries…"
          aria-label="Search logs"
        />
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className="knt-tag"
              aria-pressed={selected.includes(c)}
              onClick={() => toggleCategory(c)}
            >
              {c}
            </button>
          ))}
          {(selected.length > 0 || query) && (
            <button type="button" className="knt-tag" onClick={clearFilters}>
              × Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3 items-center mt-5">
          <button
            type="button"
            className="knt-btn knt-btn-gold"
            onClick={() => setShowInfo(true)}
          >
            <KnitText text="Rating scale" size="small" fg={YARN.peat} fit />
          </button>
          <Link to="/reading" className="knt-link">
            Reading list →
          </Link>
        </div>
      </KnitHero>

      <div className="knt-page">
        {loading && <KnitNotice>Unpicking the discovery logs…</KnitNotice>}

        {!loading && filtered.length === 0 && (
          <KnitNotice>
            No entries match — the swatch stays blank.{' '}
            <button type="button" className="knt-link" onClick={clearFilters}>
              Clear the filters
            </button>
          </KnitNotice>
        )}

        {!loading &&
          groups.map((group, gi) => (
            <section key={group.key} className="mb-8">
              <div className="knt-section-head !mb-3">
                <KnitText as="h2" text={group.key} fg={YARN.gold} />
                <KnitText
                  text={`${group.entries.length} entries`}
                  size="small"
                  fg={YARN.wheat}
                  fit
                />
              </div>
              <KnitBand
                pattern={MONTH_BANDS[gi % MONTH_BANDS.length]}
                className="mb-4 rounded"
              />
              <ul className="list-none m-0 p-0">
                {group.entries.map((log) => {
                  const category = (log.category || 'log').toLowerCase();
                  const creator = creatorOf(log);
                  const rating = Number(log.rating) || 0;
                  return (
                    <li key={log.id}>
                      <Link
                        to={`/logs/${category}/${log.slug}`}
                        className="knt-row"
                      >
                        <div className="knt-row-body">
                          <KnitText
                            text={`${isoDate(log.date)} · ${category}`}
                            size="small"
                            fg={YARN.wheat}
                          />
                          <KnitText
                            as="h3"
                            text={log.title}
                            fg={YARN.cream}
                            maxLines={2}
                            className="mt-2"
                          />
                          {creator && (
                            <p className="knt-muted text-sm mt-1">{creator}</p>
                          )}
                        </div>
                        <span
                          aria-label={
                            rating > 0 ? `Rated ${rating} of 5` : 'Unrated'
                          }
                          className="shrink-0"
                        >
                          <KnitText
                            text={heartLine(rating)}
                            size="small"
                            fg={YARN.poppy}
                            fit
                            aria-hidden="true"
                          />
                        </span>
                        <KnitIcon name="arrowRight" fg={YARN.gold} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

        {!loading && filtered.length > 0 && (
          <p className="knt-label mt-8">
            Total: {filtered.length} entries this view
          </p>
        )}
      </div>

      <GenericModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Rating scale"
      >
        <div>
          <p>
            Every entry uses the same five-heart scale. Hearts are not
            preference; they record <strong>how much of the thing held up</strong>.
          </p>
          <dl className="mt-4 grid gap-2">
            {[
              [5, 'Essential — pressed into hands, no caveats.'],
              [4, 'Clear — recommended without hesitation.'],
              [3, 'Worthwhile — has its hour; it might be yours.'],
              [2, 'Thin — a caveat beside every virtue.'],
              [1, 'Struck — kept only so the record is honest.'],
            ].map(([hearts, desc]) => (
              <div className="flex gap-3 items-center" key={hearts}>
                <dt className="shrink-0" aria-label={`${hearts} of 5`}>
                  <KnitText
                    text={heartLine(hearts)}
                    size="small"
                    fg={YARN.poppy}
                    fit
                    aria-hidden="true"
                  />
                </dt>
                <dd>{desc}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            className="knt-btn knt-btn-primary mt-5 w-full"
            onClick={() => {
              setShowInfo(false);
              openSidePanel('Rating System Details', <RatingSystemDetail />, 600);
            }}
          >
            <KnitText text="Read the full guide →" size="small" fg={YARN.snow} fit />
          </button>
        </div>
      </GenericModal>
    </div>
  );
};

export default KnitLogsPage;
