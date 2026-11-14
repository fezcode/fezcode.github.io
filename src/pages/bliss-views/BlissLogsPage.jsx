import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import piml from 'piml';
import {
  ArticleIcon,
  BookOpenIcon,
  CalendarIcon,
  CaretRightIcon,
  FilmSlateIcon,
  FolderOpenIcon,
  ForkKnifeIcon,
  GameControllerIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
  MusicNotesIcon,
  NotebookIcon,
  QuotesIcon,
  StarIcon,
  TelevisionIcon,
  VideoIcon,
  WrenchIcon,
  XIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import GenericModal from '../../components/GenericModal';
import RatingSystemDetail from '../../components/RatingSystemDetail';
import { useAchievements } from '../../context/AchievementContext';
import { useSidePanel } from '../../context/SidePanelContext';
import {
  BlissWindow,
  BlissIcon,
  BlissNotice,
  BlissStars,
  BlissTitleLink,
} from '../../components/bliss';
import { getCategoryColor } from '../../utils/categoryColors';
import {
  FALLBACK_CATEGORIES,
  fetchLogCategories,
  fetchLogsForCategories,
} from '../../utils/logCategories';
import '../../styles/Bliss.css';

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

const CATEGORY_ICONS = {
  book: [BookOpenIcon, 'blue'],
  movie: [FilmSlateIcon, 'red'],
  video: [VideoIcon, 'orange'],
  game: [GameControllerIcon, 'purple'],
  article: [ArticleIcon, 'teal'],
  music: [MusicNotesIcon, 'pink'],
  series: [TelevisionIcon, 'graphite'],
  food: [ForkKnifeIcon, 'yellow'],
  websites: [GlobeIcon, 'green'],
  tools: [WrenchIcon, 'graphite'],
  event: [CalendarIcon, 'orange'],
  quote: [QuotesIcon, 'purple'],
};

/** Glossy tile for a log category: `{ icon, tone }` (unknowns get a seeded tone). */
export const logCategoryIcon = (category = '') => {
  const entry = CATEGORY_ICONS[String(category).toLowerCase()];
  return entry
    ? { icon: entry[0], tone: entry[1] }
    : { icon: NotebookIcon, tone: undefined };
};

const isoDate = (d) => {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toISOString().slice(0, 10);
};

const creatorOf = (log) =>
  log.author ||
  log.director ||
  log.artist ||
  log.creator ||
  log.by ||
  log.studio ||
  '';

const Rating = ({ rating }) =>
  rating > 0 ? (
    <BlissStars value={rating} />
  ) : (
    <span className="bl-meta">Unrated</span>
  );

const CategoryLabel = ({ category }) => {
  const { icon, tone } = logCategoryIcon(category);
  return (
    <span className="inline-flex items-center gap-2">
      <BlissIcon icon={icon} tone={tone} seed={category} size={20} />
      <span
        className="font-semibold capitalize"
        style={{ color: getCategoryColor('bliss', category) }}
      >
        {category}
      </span>
    </span>
  );
};

const BlissLogsPage = () => {
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

  // Month groups, newest first.
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

  const hasFilters = selected.length > 0 || query;

  return (
    <div className="bl-root">
      <Seo
        title="Discovery Logs | Fezcodex"
        description="Films, books, music, games, and other discoveries worth keeping."
      />
      <div className="bl-page">
        <BlissWindow
          title="Discovery logs"
          icon={NotebookIcon}
          tone="green"
          headingLevel={1}
          actions={<BlissTitleLink to="/reading">Reading list →</BlissTitleLink>}
        >
          <p className="bl-eyebrow m-0">Collected along the way</p>
          <p className="mt-1 mb-0">
            Things seen, read, played, tasted. A record of curiosity.
          </p>
          <p className="bl-meta mt-2 mb-0">
            {logs.length} entries · {categories.length} categories ·{' '}
            {filtered.length} shown · scale 1-5 ★
          </p>

          <div className="bl-groupbox mt-5">
            <span className="bl-groupbox-label">Search &amp; filter</span>
            <label className="flex items-center gap-2 max-w-2xl">
              <MagnifyingGlassIcon
                size={20}
                weight="bold"
                color="#1e5fe0"
                aria-hidden="true"
              />
              <input
                className="bl-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search discoveries…"
                aria-label="Search logs"
              />
            </label>
            <div
              className="flex flex-wrap gap-2 mt-4"
              role="group"
              aria-label="Filter by category"
            >
              {categories.map((c) => {
                const { icon, tone } = logCategoryIcon(c);
                return (
                  <button
                    key={c}
                    type="button"
                    className="bl-tag"
                    aria-pressed={selected.includes(c)}
                    onClick={() => toggleCategory(c)}
                  >
                    <BlissIcon icon={icon} tone={tone} seed={c} size={16} />
                    {c}
                  </button>
                );
              })}
              {hasFilters && (
                <button type="button" className="bl-tag" onClick={clearFilters}>
                  <XIcon size={12} weight="bold" aria-hidden="true" />
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center mt-5">
            <button
              type="button"
              className="bl-btn bl-btn-blue"
              onClick={() => setShowInfo(true)}
            >
              <StarIcon size={16} weight="fill" aria-hidden="true" />
              Rating scale
            </button>
          </div>
        </BlissWindow>

        <BlissWindow
          title="Entries"
          icon={FolderOpenIcon}
          tone="yellow"
          flush
          status={
            <>
              <span>
                {loading ? 'Loading…' : `${filtered.length} objects`}
              </span>
              <span>
                {hasFilters
                  ? `Filtered from ${logs.length} entries`
                  : `${groups.length} months`}
              </span>
            </>
          }
        >
          {loading && (
            <div className="p-4">
              <BlissNotice>Opening the discovery logs…</BlissNotice>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="p-4">
              <BlissNotice>
                No entries match this view.{' '}
                <button type="button" className="bl-link" onClick={clearFilters}>
                  Clear the filters
                </button>
              </BlissNotice>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <>
              {/* Explorer details view on wide screens. */}
              <div className="bl-listview hidden md:block">
                <table>
                  <caption className="sr-only">
                    Discovery logs, grouped by month, newest first
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">By</th>
                      <th scope="col">Category</th>
                      <th scope="col">Date</th>
                      <th scope="col">Rating</th>
                    </tr>
                  </thead>
                  {groups.map((group) => (
                    <tbody key={group.key}>
                      <tr>
                        <th
                          colSpan={5}
                          scope="colgroup"
                          className="!text-[#0a3fb8]"
                        >
                          {group.key}{' '}
                          <span className="bl-meta font-normal">
                            · {group.entries.length} entries
                          </span>
                        </th>
                      </tr>
                      {group.entries.map((log) => {
                        const category = (log.category || 'log').toLowerCase();
                        const creator = creatorOf(log);
                        const rating = Number(log.rating) || 0;
                        return (
                          <tr key={log.id}>
                            <td>
                              <Link to={`/logs/${category}/${log.slug}`}>
                                {log.title}
                              </Link>
                            </td>
                            <td className="bl-muted">{creator || '—'}</td>
                            <td>
                              <CategoryLabel category={category} />
                            </td>
                            <td className="whitespace-nowrap">
                              {isoDate(log.date)}
                            </td>
                            <td>
                              <Rating rating={rating} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  ))}
                </table>
              </div>

              {/* List rows on narrow screens. */}
              <div className="md:hidden bg-white">
                {groups.map((group) => (
                  <section key={group.key}>
                    <h3 className="bl-h3 !text-[#0a3fb8] px-3 py-2 border-b border-[#d5d1bd] bg-[#f4f3ea]">
                      {group.key}{' '}
                      <span className="bl-meta font-normal">
                        · {group.entries.length} entries
                      </span>
                    </h3>
                    <ul className="list-none m-0 p-0">
                      {group.entries.map((log) => {
                        const category = (
                          log.category || 'log'
                        ).toLowerCase();
                        const creator = creatorOf(log);
                        const rating = Number(log.rating) || 0;
                        const { icon, tone } = logCategoryIcon(category);
                        return (
                          <li key={log.id}>
                            <Link
                              to={`/logs/${category}/${log.slug}`}
                              className="bl-row"
                            >
                              <BlissIcon
                                icon={icon}
                                tone={tone}
                                seed={category}
                                size={32}
                              />
                              <span className="bl-row-body">
                                <span className="bl-row-title line-clamp-2">
                                  {log.title}
                                </span>
                                <span className="bl-meta">
                                  {isoDate(log.date)} · {category}
                                  {creator ? ` · ${creator}` : ''}
                                </span>
                                <Rating rating={rating} />
                              </span>
                              <CaretRightIcon
                                size={16}
                                weight="bold"
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            </>
          )}
        </BlissWindow>
      </div>

      <GenericModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Rating scale"
      >
        <div>
          <p>
            Every entry uses the same five-star scale. Stars are not
            preference; they record <strong>how much of the thing held up</strong>.
          </p>
          <dl className="mt-4 grid gap-2">
            {[
              [5, 'Essential — pressed into hands, no caveats.'],
              [4, 'Clear — recommended without hesitation.'],
              [3, 'Worthwhile — has its hour; it might be yours.'],
              [2, 'Thin — a caveat beside every virtue.'],
              [1, 'Struck — kept only so the record is honest.'],
            ].map(([stars, desc]) => (
              <div className="flex gap-3 items-center" key={stars}>
                <dt className="shrink-0">
                  <BlissStars value={stars} />
                </dt>
                <dd className="m-0">{desc}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            className="bl-btn bl-btn-primary mt-5 w-full"
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

export default BlissLogsPage;
