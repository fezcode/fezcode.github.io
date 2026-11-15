import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  FolderOpenIcon,
  PlusIcon,
  TagIcon,
  WarningIcon,
  XIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { BlissWindow, BlissIcon, BlissNotice } from '../../components/bliss';
import { getCategoryColor } from '../../utils/categoryColors';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';
import { TYPE_ICONS, FolderGlyph, dominantType } from './BlissTagsPage';
import '../../styles/Bliss.css';
import './bliss-tags.css';

const Shell = ({ children }) => (
  <div className="bl-root">
    <div className="bl-page">{children}</div>
  </div>
);

/** A category as a filled pill, as on the Bliss writing list. */
const CategoryPill = ({ label }) => (
  <span
    className="inline-flex items-center rounded-sm px-1.5 text-[11px] font-bold uppercase tracking-wide text-white"
    style={{ background: getCategoryColor('bliss', label), lineHeight: '18px' }}
  >
    {label}
  </span>
);

/** Bliss /tags/:tag: an open folder window whose items are files. */
export default function BlissTagPage({ view }) {
  if (view.status === 'error')
    return (
      <Shell>
        <BlissNotice error>{view.error}</BlissNotice>
      </Shell>
    );
  if (view.status === 'loading')
    return (
      <Shell>
        <BlissNotice>Loading…</BlissNotice>
      </Shell>
    );
  if (view.status === 'missing')
    return (
      <Shell>
        <Seo title="Tag not found | Fezcodex" />
        <BlissWindow
          title="Tag not found"
          icon={WarningIcon}
          tone="red"
          headingLevel={null}
        >
          <h1 className="bl-h2 break-words">No tag “{view.rawTag}”</h1>
          <div className="mt-4">
            <BlissNotice error>
              This folder does not exist. Nothing is filed under that tag.
            </BlissNotice>
          </div>
          <Link to="/tags" className="bl-btn mt-4">
            <ArrowLeftIcon size={16} weight="bold" aria-hidden="true" />
            Browse all tags
          </Link>
        </BlissWindow>
      </Shell>
    );

  const { meta } = view;
  const stats = TAG_TYPES.filter((t) => meta[t.plural] > 0);
  const count = view.items.length;

  return (
    <div className="bl-root">
      <Seo
        title={`${view.title} | Tags | Fezcodex`}
        description={
          meta.description ||
          `Posts, logs and projects tagged ${meta.label} on Fezcodex.`
        }
        canonicalPath={tagPath(view.slug)}
      />
      <div className="bl-page">
        <BlissWindow
          title={view.title}
          icon={FolderOpenIcon}
          tone="yellow"
          headingLevel={1}
          flush
          status={
            <>
              <span role="status">
                {count} {count === 1 ? 'object' : 'objects'}
                {view.type !== 'all' &&
                  ` · ${typeByKey[view.type].plural} only`}
              </span>
              <span>
                {view.typeCounts.all} tagged {view.title}
              </span>
            </>
          }
        >
          {/* Toolbar */}
          <div className="blt-toolbar">
            <Link to="/tags" className="bl-navbtn">
              <span className="bl-navbtn-round" aria-hidden="true">
                <ArrowLeftIcon size={16} weight="bold" />
              </span>
              All tags
            </Link>
            {view.extra.length > 0 && (
              <span className="bl-meta ml-auto">
                Filtered by {view.active.length} tags
              </span>
            )}
          </div>

          {/* Address bar: one segment per active tag */}
          <div className="blt-addressbar">
            <span className="bl-muted hidden sm:inline">Address</span>
            <nav className="blt-address" aria-label="Active tag filters">
              <FolderGlyph size={18} />
              <Link to="/tags">Tags</Link>
              {view.active.map((tag, i) => {
                const last = i === view.active.length - 1;
                return (
                  <React.Fragment key={tag}>
                    <span className="blt-crumb-sep" aria-hidden="true">
                      ›
                    </span>
                    <span className="blt-segment">
                      {last ? (
                        <span aria-current="page">{view.labelOf(tag)}</span>
                      ) : (
                        <Link to={view.hrefFor(view.active.slice(0, i + 1))}>
                          {view.labelOf(tag)}
                        </Link>
                      )}
                      <Link
                        to={view.removeHref(tag)}
                        className="blt-segment-x"
                        aria-label={`Remove ${view.labelOf(tag)}`}
                      >
                        <XIcon size={11} weight="bold" aria-hidden="true" />
                      </Link>
                    </span>
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          <div className="blt-explorer">
            {/* Left pane */}
            <div className="blt-side">
              <section className="bl-pane" aria-label="Folder details">
                <span className="bl-pane-head">Details</span>
                <div className="bl-pane-body px-3 py-2 text-[13px] text-[var(--bl-pane-ink)]">
                  <div className="flex items-center gap-2">
                    <FolderGlyph type={dominantType(meta)} size={30} />
                    <div className="min-w-0">
                      <p className="m-0 font-bold break-words">{meta.label}</p>
                      <p className="m-0">Tag folder</p>
                    </div>
                  </div>
                  {meta.description && (
                    <p className="mt-2 mb-0">{meta.description}</p>
                  )}
                  {stats.length > 0 && (
                    <ul className="flex flex-wrap gap-x-3 gap-y-1 list-none m-0 mt-2 p-0 md:flex-col">
                      {stats.map((t) => (
                        <li
                          key={t.key}
                          className="inline-flex items-center gap-1.5"
                        >
                          <BlissIcon
                            icon={TYPE_ICONS[t.key].icon}
                            tone={TYPE_ICONS[t.key].tone}
                            size={16}
                          />
                          <span className="font-bold">{meta[t.plural]}</span>
                          {meta[t.plural] === 1
                            ? t.one.toLowerCase()
                            : t.plural}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <nav className="bl-pane" aria-label="Content type">
                <span className="bl-pane-head">Folders</span>
                <div className="bl-pane-body blt-folders">
                  {view.types.map((t) => {
                    const n = view.typeCounts[t.key];
                    return (
                      <button
                        key={t.key}
                        type="button"
                        className="bl-pane-link"
                        aria-pressed={view.type === t.key}
                        disabled={t.key !== 'all' && n === 0}
                        onClick={() => view.setType(t.key)}
                      >
                        <FolderGlyph
                          type={t.key === 'all' ? 'none' : t.key}
                          size={20}
                        />
                        {t.label}
                        <span className="blt-folder-count">
                          {n}
                          <span className="sr-only">
                            {n === 1 ? ' item' : ' items'}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </nav>

              {view.related.length > 0 && (
                <nav className="bl-pane" aria-label="Narrow by another tag">
                  <span className="bl-pane-head">Related folders</span>
                  <div className="bl-pane-body">
                    <p className="m-0 px-2 pb-1 text-[12px] text-[var(--bl-pane-ink)]">
                      Tags alongside {view.title}. Each one narrows the list.
                    </p>
                    <ul className="blt-folders list-none m-0 p-0">
                      {view.related.map(([tag, n]) => (
                        <li key={tag}>
                          <Link to={view.addHref(tag)} className="bl-pane-link">
                            <PlusIcon
                              size={12}
                              weight="bold"
                              className="shrink-0"
                              aria-hidden="true"
                            />
                            <span className="min-w-0 break-words">
                              <span className="sr-only">Add </span>
                              {view.labelOf(tag)}
                            </span>
                            <span className="blt-folder-count">
                              {n}
                              <span className="sr-only">
                                {n === 1 ? ' item' : ' items'}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </nav>
              )}
            </div>

            {/* Main pane: the folder's files */}
            <section className="blt-main" aria-label="Tagged items">
              {count === 0 ? (
                <div className="p-4">
                  <BlissNotice>
                    This folder is empty. Nothing here carries all of these
                    tags.
                  </BlissNotice>
                </div>
              ) : (
                <>
                  <div
                    className="blt-colhead hidden lg:grid lg:grid-cols-[minmax(0,1fr)_6rem_9rem_7.5rem]"
                    aria-hidden="true"
                  >
                    <span>Name</span>
                    <span>Type</span>
                    <span>Category</span>
                    <span>Date</span>
                  </div>
                  <ol className="list-none m-0 p-0">
                    {view.items.map((item) => (
                      <FileRow key={item.id} item={item} view={view} />
                    ))}
                  </ol>
                </>
              )}
            </section>
          </div>
        </BlissWindow>
      </div>
    </div>
  );
}

/** One tagged item as a file row, with its preview strip underneath. */
function FileRow({ item, view }) {
  const type = typeByKey[item.type];
  const tile = TYPE_ICONS[item.type] || {};
  return (
    <li className="blt-file">
      <div className="grid gap-x-0 gap-y-1 px-2.5 pt-2 pb-1.5 lg:grid-cols-[minmax(0,1fr)_6rem_9rem_7.5rem] lg:items-center">
        <div className="flex min-w-0 items-center gap-2.5 lg:pr-2.5">
          <BlissIcon icon={tile.icon || TagIcon} tone={tile.tone} size={22} />
          <h2 className="bl-row-title m-0 min-w-0 break-words">
            <Link to={item.path} className="blt-title-link">
              {item.title}
            </Link>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pl-8 bl-meta lg:contents">
          <span className="font-bold text-[var(--bl-ink)] lg:px-2.5 lg:font-normal">
            {type ? type.one : item.type}
          </span>
          <span className="lg:px-2.5">
            {item.category ? (
              <CategoryPill label={item.category} />
            ) : (
              <span className="hidden lg:inline" aria-hidden="true">
                –
              </span>
            )}
          </span>
          <span className="lg:px-2.5">
            {item.date && (
              <time dateTime={item.date}>{formatDate(item.date)}</time>
            )}
          </span>
        </div>
      </div>
      <div className="blt-preview">
        {item.series && <p className="bl-label m-0">Part of {item.series}</p>}
        {item.description && (
          <p className="bl-meta m-0 max-w-3xl line-clamp-3">
            {item.description}
          </p>
        )}
        <ul
          className="flex flex-wrap gap-1.5 list-none m-0 mt-1.5 p-0"
          aria-label="Tags"
        >
          {item.tags.map((tag) => {
            const on = view.active.includes(tag);
            return (
              <li key={tag}>
                <Link
                  to={tagPath(tag)}
                  className={`bl-tag blt-mini ${on ? 'bl-tag-active' : ''}`}
                  aria-current={on ? 'true' : undefined}
                >
                  #{view.labelOf(tag)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
