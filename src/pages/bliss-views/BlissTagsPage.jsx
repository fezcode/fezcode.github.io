import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArticleIcon,
  CaretRightIcon,
  CubeIcon,
  FolderOpenIcon,
  ListDashesIcon,
  MagnifyingGlassIcon,
  NotebookIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  SquaresFourIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { BlissWindow, BlissNotice } from '../../components/bliss';
import { loadTagIndex, tagPath } from '../../utils/tagIndex';
import { TAG_TYPES } from '../tags/tagTypes';
import '../../styles/Bliss.css';
import './bliss-tags.css';

/** Glossy tile per content type, shared with BlissTagPage. */
export const TYPE_ICONS = {
  post: { icon: ArticleIcon, tone: 'blue' },
  log: { icon: NotebookIcon, tone: 'green' },
  project: { icon: CubeIcon, tone: 'orange' },
};

/** Folder colours [front, back] by dominant content type. */
const FOLDER_TONES = {
  post: ['#7fb2ff', '#2f6fdc'],
  log: ['#8fdf6c', '#3a9a22'],
  project: ['#ffbb6e', '#d9691a'],
  none: ['#ffd97a', '#d99a0b'],
};

/** A plain folder shape, the Explorer icon. Decorative. */
export function FolderGlyph({ type = 'none', size = 40 }) {
  const [front, back] = FOLDER_TONES[type] || FOLDER_TONES.none;
  return (
    <svg
      viewBox="0 0 48 40"
      width={size}
      height={Math.round((size * 40) / 48)}
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <path
        d="M2 6a3 3 0 0 1 3-3h12l4 5h22a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z"
        fill={back}
      />
      <path
        d="M2 15a3 3 0 0 1 3-3h38a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z"
        fill={front}
        stroke={back}
        strokeWidth="1"
      />
      <path
        d="M6 15.5h36"
        stroke="#fff"
        strokeOpacity="0.65"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The type a tag is used for most (ties go to the earlier type). */
export const dominantType = (tag) => {
  let best = 'none';
  let max = 0;
  for (const t of TAG_TYPES) {
    if (tag[t.plural] > max) {
      max = tag[t.plural];
      best = t.key;
    }
  }
  return best;
};

const ICON_PX = { 0: 22, 1: 34, 2: 42, 3: 50, 4: 58 };

/** Tags per type folder, read from the shared (cached) tag index. */
function useFolderCounts() {
  const [counts, setCounts] = useState(null);
  useEffect(() => {
    let live = true;
    loadTagIndex()
      .then((index) => {
        if (!live) return;
        const next = { all: index.tags.length };
        for (const t of TAG_TYPES)
          next[t.key] = index.tags.filter((tag) => tag[t.plural] > 0).length;
        setCounts(next);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return counts;
}

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'posts', label: 'Posts', num: true },
  { key: 'logs', label: 'Logs', num: true },
  { key: 'projects', label: 'Projects', num: true },
  { key: 'total', label: 'Total', num: true },
];

/** Bliss /tags: the tag index as one file explorer window. */
export default function BlissTagsPage({ view }) {
  const ready = view.status === 'ready';
  const [mode, setMode] = useState('icons');
  const [singleOpen, setSingleOpen] = useState(false);
  // A column sort picked in Details view that the URL sort can't express.
  const [colSort, setColSort] = useState(null);
  const folderCounts = useFolderCounts();

  const shownCount = view.shared.length + view.single.length;
  const activeType = view.types.find((t) => t.key === view.type);
  const typePlural = TAG_TYPES.find((t) => t.key === view.type)?.plural;

  const col =
    colSort ||
    (view.sort === 'az'
      ? { key: 'name', dir: 'asc' }
      : { key: 'total', dir: 'desc' });

  const [shared, single] = useMemo(() => {
    if (!colSort) return [view.shared, view.single];
    const sign = colSort.dir === 'asc' ? 1 : -1;
    const value = (tag) =>
      colSort.key === 'total' ? tag.count : tag[colSort.key];
    const cmp = (a, b) =>
      colSort.key === 'name'
        ? sign * a.label.localeCompare(b.label)
        : sign * (value(a) - value(b)) || a.label.localeCompare(b.label);
    return [[...view.shared].sort(cmp), [...view.single].sort(cmp)];
  }, [colSort, view.shared, view.single]);

  const sortBy = (key) => {
    const dir =
      col.key === key
        ? col.dir === 'asc'
          ? 'desc'
          : 'asc'
        : key === 'name'
          ? 'asc'
          : 'desc';
    if (key === 'name' && dir === 'asc') {
      setColSort(null);
      view.setSort('az');
    } else if (key === 'total' && dir === 'desc') {
      setColSort(null);
      view.setSort('count');
    } else {
      setColSort({ key, dir });
    }
  };

  const sortNote = view.query
    ? `Matching “${view.query}”`
    : colSort
      ? `Sorted by ${COLUMNS.find((c) => c.key === colSort.key).label}`
      : view.sort === 'az'
        ? 'Sorted A→Z'
        : 'Sorted by use';

  return (
    <div className="bl-root">
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />
      <div className="bl-page">
        <BlissWindow
          title="Tags"
          icon={FolderOpenIcon}
          tone="yellow"
          headingLevel={1}
          flush
          status={
            ready ? (
              <>
                <span role="status">
                  {view.totalTags} objects · {shownCount} shown
                </span>
                <span>{sortNote}</span>
              </>
            ) : undefined
          }
        >
          {/* Toolbar */}
          <div className="blt-toolbar">
            <div
              className="flex items-center gap-1"
              role="group"
              aria-label="Views"
            >
              <span className="bl-label mr-1" aria-hidden="true">
                Views:
              </span>
              <button
                type="button"
                className="bl-btn bl-btn-sm"
                aria-pressed={mode === 'icons'}
                onClick={() => setMode('icons')}
              >
                <SquaresFourIcon size={16} weight="fill" aria-hidden="true" />
                Icons
              </button>
              <button
                type="button"
                className="bl-btn bl-btn-sm"
                aria-pressed={mode === 'details'}
                onClick={() => setMode('details')}
              >
                <ListDashesIcon size={16} weight="bold" aria-hidden="true" />
                Details
              </button>
            </div>
            <span
              className="blt-toolbar-sep hidden sm:block"
              aria-hidden="true"
            />
            <label className="flex items-center gap-2">
              <span className="bl-label">Sort by:</span>
              <select
                className="bl-select blt-select"
                value={view.sort}
                onChange={(event) => {
                  setColSort(null);
                  view.setSort(event.target.value);
                }}
              >
                <option value="count">Most used</option>
                <option value="az">Name (A–Z)</option>
              </select>
            </label>
            <label className="blt-search">
              <span className="sr-only">Search tags</span>
              <input
                type="search"
                className="bl-input"
                value={view.query}
                onChange={(event) => view.setQuery(event.target.value)}
                placeholder="Search tags…"
              />
              <MagnifyingGlassIcon
                size={16}
                weight="bold"
                className="blt-search-icon"
                aria-hidden="true"
              />
            </label>
          </div>

          {/* Address bar */}
          <div className="blt-addressbar">
            <span className="bl-muted hidden sm:inline">Address</span>
            <nav className="blt-address" aria-label="Location">
              <FolderGlyph size={18} />
              <Link to="/">Fezcodex</Link>
              <span className="blt-crumb-sep" aria-hidden="true">
                ›
              </span>
              <span aria-current="page" className="font-bold">
                Tags
              </span>
              {view.type !== 'all' && (
                <>
                  <span className="blt-crumb-sep" aria-hidden="true">
                    ›
                  </span>
                  <span>{activeType.label}</span>
                </>
              )}
            </nav>
          </div>

          <div className="blt-explorer">
            {/* Left pane */}
            <div className="blt-side">
              <nav className="bl-pane" aria-label="Content type">
                <span className="bl-pane-head">Folders</span>
                <div className="bl-pane-body blt-folders">
                  {view.types.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      className="bl-pane-link"
                      aria-pressed={view.type === t.key}
                      onClick={() => view.setType(t.key)}
                    >
                      <FolderGlyph
                        type={t.key === 'all' ? 'none' : t.key}
                        size={20}
                      />
                      {t.label}
                      {folderCounts && (
                        <span className="blt-folder-count">
                          {folderCounts[t.key]}
                          <span className="sr-only"> tags</span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </nav>

              <section className="bl-pane hidden md:block" aria-label="Details">
                <span className="bl-pane-head">Details</span>
                <div className="bl-pane-body px-3 py-2 text-[13px] text-[var(--bl-pane-ink)]">
                  <p className="m-0 font-bold">Tags</p>
                  <p className="m-0">File folder</p>
                  {ready && (
                    <p className="mt-2 mb-0">
                      {view.totalTags} tags across {view.totalItems} posts, logs
                      and projects. Pick one to see everything filed under it.
                    </p>
                  )}
                  <ul className="list-none m-0 mt-2 p-0 flex flex-col gap-1">
                    {TAG_TYPES.map((t) => (
                      <li key={t.key} className="flex items-center gap-2">
                        <FolderGlyph type={t.key} size={16} />
                        Mostly {t.plural}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            {/* Main pane */}
            <div className="blt-main">
              {ready && (
                <p className="m-0 px-3 pt-3 bl-meta md:hidden">
                  {view.totalTags} tags across {view.totalItems} posts, logs and
                  projects. Pick one to see everything filed under it.
                </p>
              )}
              {view.status === 'error' && (
                <div className="p-4">
                  <BlissNotice error>{view.error}</BlissNotice>
                </div>
              )}
              {view.status === 'loading' && (
                <div className="p-4">
                  <BlissNotice>Loading tags…</BlissNotice>
                </div>
              )}
              {ready && shownCount === 0 && (
                <div className="p-4">
                  <BlissNotice>
                    No tags match “{view.query}”.{' '}
                    <button
                      type="button"
                      className="bl-link"
                      onClick={() => view.setQuery('')}
                    >
                      Clear the search
                    </button>
                  </BlissNotice>
                </div>
              )}

              {ready && shownCount > 0 && mode === 'icons' && (
                <>
                  {shared.length > 0 && (
                    <ul
                      className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-1 list-none m-0 p-3"
                      aria-label="Tags"
                    >
                      {shared.map((tag) => {
                        const size = view.sizeFor(tag.shown);
                        return (
                          <li key={tag.slug}>
                            <Link
                              to={view.hrefFor(tag)}
                              className="blt-icon"
                              data-size={size}
                            >
                              <span className="blt-icon-art">
                                <FolderGlyph
                                  type={dominantType(tag)}
                                  size={ICON_PX[size]}
                                />
                              </span>
                              <span className="blt-icon-label">
                                {tag.label}
                              </span>
                              <span className="blt-icon-count">
                                {tag.shown}
                                {tag.shown === 1 ? ' item' : ' items'}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {single.length > 0 && (
                    <SingleFolder
                      open={singleOpen}
                      onToggle={() => setSingleOpen((o) => !o)}
                      count={single.length}
                    >
                      <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-x-2 list-none m-0 p-3 border-t border-[#e4e0cc]">
                        {single.map((tag) => (
                          <li key={tag.slug} className="min-w-0">
                            <Link
                              to={tagPath(tag.slug)}
                              className="blt-listitem"
                            >
                              <FolderGlyph
                                type={dominantType(tag)}
                                size={ICON_PX[0]}
                              />
                              <span>{tag.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </SingleFolder>
                  )}
                </>
              )}

              {ready && shownCount > 0 && mode === 'details' && (
                <div className="bl-listview blt-details !border-0">
                  <table>
                    <caption className="sr-only">
                      Tags, with how many posts, logs and projects carry each
                    </caption>
                    <thead>
                      <tr>
                        {COLUMNS.map((c) => {
                          const on = col.key === c.key;
                          const Arrow =
                            col.dir === 'asc'
                              ? SortAscendingIcon
                              : SortDescendingIcon;
                          return (
                            <th
                              key={c.key}
                              scope="col"
                              aria-sort={
                                on
                                  ? col.dir === 'asc'
                                    ? 'ascending'
                                    : 'descending'
                                  : 'none'
                              }
                              className={c.key === 'name' ? 'w-full' : ''}
                            >
                              <button
                                type="button"
                                className={`blt-colbtn ${c.num ? 'blt-num' : ''}`}
                                onClick={() => sortBy(c.key)}
                              >
                                {c.label}
                                {on && (
                                  <Arrow
                                    size={14}
                                    weight="bold"
                                    aria-hidden="true"
                                  />
                                )}
                              </button>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {shared.map((tag) => (
                        <DetailRow
                          key={tag.slug}
                          tag={tag}
                          href={view.hrefFor(tag)}
                          hot={typePlural}
                        />
                      ))}
                    </tbody>
                    {single.length > 0 && (
                      <tbody>
                        <tr>
                          <td colSpan={COLUMNS.length} className="blt-subrow">
                            <SingleToggle
                              open={singleOpen}
                              onToggle={() => setSingleOpen((o) => !o)}
                              count={single.length}
                            />
                          </td>
                        </tr>
                        {singleOpen &&
                          single.map((tag) => (
                            <DetailRow
                              key={tag.slug}
                              tag={tag}
                              href={tagPath(tag.slug)}
                              hot={typePlural}
                            />
                          ))}
                      </tbody>
                    )}
                  </table>
                </div>
              )}
            </div>
          </div>
        </BlissWindow>
      </div>
    </div>
  );
}

/** One tag as a row of the details table. */
function DetailRow({ tag, href, hot }) {
  return (
    <tr>
      <td>
        <Link to={href} className="inline-flex items-center gap-2 break-words">
          <FolderGlyph type={dominantType(tag)} size={18} />
          <span className="min-w-0 [overflow-wrap:anywhere]">{tag.label}</span>
        </Link>
      </td>
      {TAG_TYPES.map((t) => (
        <td
          key={t.key}
          className={`blt-num ${hot === t.plural ? 'blt-hot' : ''}`}
        >
          {tag[t.plural] || <span className="bl-muted">–</span>}
        </td>
      ))}
      <td className="blt-num font-bold">{tag.count}</td>
    </tr>
  );
}

/** The "Single items" sub-folder header button. */
function SingleToggle({ open, onToggle, count }) {
  return (
    <button
      type="button"
      className="blt-subfolder"
      aria-expanded={open}
      onClick={onToggle}
    >
      <CaretRightIcon
        size={14}
        weight="bold"
        className="blt-caret"
        aria-hidden="true"
      />
      <FolderGlyph size={20} />
      Single items ({count})
      <span className="bl-meta font-normal ml-auto hidden sm:inline">
        Tags used once
      </span>
    </button>
  );
}

/** The single-use tags, tucked into an expanding sub-folder. */
function SingleFolder({ open, onToggle, count, children }) {
  return (
    <div>
      <SingleToggle open={open} onToggle={onToggle} count={count} />
      {open && children}
    </div>
  );
}
