import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArticleIcon,
  CaretRightIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  NotebookIcon,
  TagIcon,
  TagSimpleIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { BlissWindow, BlissIcon, BlissNotice } from '../../components/bliss';
import { tagPath } from '../../utils/tagIndex';
import '../../styles/Bliss.css';
import './bliss-tags.css';

/** Glossy tile per content type, shared with BlissTagPage. */
export const TYPE_ICONS = {
  post: { icon: ArticleIcon, tone: 'blue' },
  log: { icon: NotebookIcon, tone: 'green' },
  project: { icon: CubeIcon, tone: 'orange' },
};

/** Bliss /tags: the tag index as a desktop window with a groupbox of filters. */
export default function BlissTagsPage({ view }) {
  const ready = view.status === 'ready';
  const shownCount = view.shared.length + view.single.length;
  const activeType = view.types.find((t) => t.key === view.type);

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
          icon={TagIcon}
          tone="teal"
          headingLevel={null}
          status={
            ready ? (
              <>
                <span>{view.totalTags} tags</span>
                <span>{view.totalItems} posts, logs and projects</span>
              </>
            ) : undefined
          }
        >
          <div className="flex items-start gap-4">
            <BlissIcon
              icon={TagIcon}
              tone="teal"
              size={56}
              className="hidden sm:inline-flex"
            />
            <div className="min-w-0">
              <p className="bl-eyebrow m-0">Index</p>
              <h1 className="bl-display mt-1">Tags</h1>
              {ready && (
                <p className="bl-muted mt-2 mb-0 max-w-2xl">
                  {view.totalTags} tags across {view.totalItems} posts, logs and
                  projects. Pick one to see everything filed under it.
                </p>
              )}
            </div>
          </div>

          <div className="bl-groupbox mt-5">
            <span className="bl-groupbox-label">Find</span>
            <label className="flex items-center gap-2 max-w-2xl">
              <MagnifyingGlassIcon
                size={20}
                weight="bold"
                className="shrink-0 text-[var(--bl-heading)]"
                aria-hidden="true"
              />
              <span className="sr-only">Search tags</span>
              <input
                type="search"
                className="bl-input"
                value={view.query}
                onChange={(event) => view.setQuery(event.target.value)}
                placeholder="Search tags…"
              />
            </label>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Content type"
              >
                {view.types.map((t) => {
                  const tile = TYPE_ICONS[t.key];
                  return (
                    <button
                      key={t.key}
                      type="button"
                      className="bl-tag"
                      aria-pressed={view.type === t.key}
                      onClick={() => view.setType(t.key)}
                    >
                      {tile && (
                        <BlissIcon
                          icon={tile.icon}
                          tone={tile.tone}
                          size={16}
                        />
                      )}
                      {t.label}
                    </button>
                  );
                })}
              </div>
              <div
                className="flex flex-wrap items-center gap-2"
                role="group"
                aria-label="Sort tags"
              >
                <span className="bl-label" aria-hidden="true">
                  Sort:
                </span>
                <button
                  type="button"
                  className="bl-btn bl-btn-sm"
                  aria-pressed={view.sort === 'count'}
                  onClick={() => view.setSort('count')}
                >
                  Most used
                </button>
                <button
                  type="button"
                  className="bl-btn bl-btn-sm"
                  aria-pressed={view.sort === 'az'}
                  onClick={() => view.setSort('az')}
                >
                  A–Z
                </button>
              </div>
            </div>
          </div>
        </BlissWindow>

        <BlissWindow
          title={
            view.type === 'all' ? 'All tags' : `Tags on ${activeType.label}`
          }
          icon={TagSimpleIcon}
          tone="blue"
          flush
          status={
            ready ? (
              <>
                <span role="status">
                  {shownCount} {shownCount === 1 ? 'tag' : 'tags'} shown
                </span>
                <span>
                  {view.query
                    ? `Matching “${view.query}”`
                    : view.sort === 'az'
                      ? 'Sorted A→Z'
                      : 'Sorted by use'}
                </span>
              </>
            ) : undefined
          }
        >
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

          {view.shared.length > 0 && (
            <ul
              className="flex flex-wrap items-center gap-2 list-none m-0 p-4 bg-white"
              aria-label="Tags"
            >
              {view.shared.map((tag) => {
                const size = view.sizeFor(tag.shown);
                return (
                  <li key={tag.slug}>
                    <Link
                      to={view.hrefFor(tag)}
                      className="bl-tag blt-chip"
                      data-size={size}
                    >
                      {size === 4 && (
                        <BlissIcon icon={TagIcon} seed={tag.slug} size={26} />
                      )}
                      {tag.label}
                      <span className="blt-count">
                        <span className="sr-only">, </span>
                        {tag.shown}
                        <span className="sr-only">
                          {tag.shown === 1 ? ' item' : ' items'}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {view.single.length > 0 && (
            <details className="blt-longtail">
              <summary>
                <CaretRightIcon
                  size={14}
                  weight="bold"
                  className="blt-caret"
                  aria-hidden="true"
                />
                Used once ({view.single.length})
              </summary>
              <ul className="flex flex-wrap gap-1.5 list-none m-0 p-4 bg-white border-t border-[#d5d1bd]">
                {view.single.map((tag) => (
                  <li key={tag.slug}>
                    <Link
                      to={tagPath(tag.slug)}
                      className="bl-tag blt-chip"
                      data-size={0}
                    >
                      {tag.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </BlissWindow>
      </div>
    </div>
  );
}
