import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  FolderOpenIcon,
  FunnelIcon,
  PlusIcon,
  TagIcon,
  WarningIcon,
  XIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import {
  BlissWindow,
  BlissIcon,
  BlissNotice,
  BlissTitleLink,
} from '../../components/bliss';
import { getCategoryColor } from '../../utils/categoryColors';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';
import { TYPE_ICONS } from './BlissTagsPage';
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

/** Bliss /tags/:tag: a tag's window, its filters, and the tagged items. */
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
            <BlissNotice error>Nothing is filed under that tag.</BlissNotice>
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
          as="header"
          title={`Tag: ${meta.label}`}
          icon={TagIcon}
          tone="teal"
          headingLevel={null}
          actions={<BlissTitleLink to="/tags">← All tags</BlissTitleLink>}
        >
          <div className="flex items-start gap-4">
            <BlissIcon
              icon={TagIcon}
              seed={view.slug}
              size={56}
              className="hidden sm:inline-flex"
            />
            <div className="min-w-0 flex-1">
              <p className="bl-eyebrow m-0">Tagged</p>
              <h1 className="bl-display mt-1 break-words">{meta.label}</h1>
              {meta.description && (
                <p className="mt-2 mb-0 max-w-2xl">{meta.description}</p>
              )}
              {stats.length > 0 && (
                <ul className="flex flex-wrap gap-x-4 gap-y-2 list-none m-0 mt-3 p-0 bl-meta">
                  {stats.map((t) => (
                    <li
                      key={t.key}
                      className="inline-flex items-center gap-1.5"
                    >
                      <BlissIcon
                        icon={TYPE_ICONS[t.key].icon}
                        tone={TYPE_ICONS[t.key].tone}
                        size={18}
                      />
                      <span className="font-bold text-[var(--bl-ink)]">
                        {meta[t.plural]}
                      </span>
                      {meta[t.plural] === 1 ? t.one.toLowerCase() : t.plural}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {view.extra.length > 0 && (
            <div className="bl-groupbox mt-5">
              <span className="bl-groupbox-label">Filtered by</span>
              <ul
                className="flex flex-wrap items-center gap-2 list-none m-0 p-0"
                aria-label="Active tag filters"
              >
                {view.active.map((tag) => (
                  <li key={tag}>
                    <span className="bl-tag bl-tag-active blt-active-chip">
                      {view.labelOf(tag)}
                      <Link
                        to={view.removeHref(tag)}
                        className="blt-remove"
                        aria-label={`Remove ${view.labelOf(tag)}`}
                      >
                        <XIcon size={11} weight="bold" aria-hidden="true" />
                      </Link>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </BlissWindow>

        <div className="grid gap-[clamp(16px,2.4vw,26px)] items-start lg:grid-cols-[minmax(0,1fr)_18rem]">
          <BlissWindow
            title="Tagged items"
            icon={FolderOpenIcon}
            tone="yellow"
            flush
            className="min-w-0"
            status={
              <>
                <span role="status">
                  {view.items.length}{' '}
                  {view.items.length === 1 ? 'object' : 'objects'}
                </span>
                <span>{view.title}</span>
              </>
            }
          >
            <div
              className="flex flex-wrap gap-2 px-3 py-3 border-b border-[#d5d1bd]"
              role="group"
              aria-label="Content type"
            >
              {view.types.map((t) => {
                const tile = TYPE_ICONS[t.key];
                const count = view.typeCounts[t.key];
                return (
                  <button
                    key={t.key}
                    type="button"
                    className="bl-tag blt-toggle"
                    aria-pressed={view.type === t.key}
                    disabled={t.key !== 'all' && count === 0}
                    onClick={() => view.setType(t.key)}
                  >
                    {tile && (
                      <BlissIcon icon={tile.icon} tone={tile.tone} size={16} />
                    )}
                    {t.label}
                    <span className="blt-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {view.items.length === 0 ? (
              <div className="p-4">
                <BlissNotice>
                  Nothing here carries all of these tags.
                </BlissNotice>
              </div>
            ) : (
              <ol className="list-none m-0 p-0 bg-white">
                {view.items.map((item) => {
                  const type = typeByKey[item.type];
                  const tile = TYPE_ICONS[item.type] || {};
                  return (
                    <li key={item.id} className="bl-row !items-start">
                      <BlissIcon
                        icon={tile.icon || TagIcon}
                        tone={tile.tone}
                        size={36}
                        className="hidden min-[400px]:inline-flex"
                      />
                      <div className="bl-row-body">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 bl-meta">
                          <span className="font-bold text-[var(--bl-ink)]">
                            {type ? type.one : item.type}
                          </span>
                          {item.category && (
                            <CategoryPill label={item.category} />
                          )}
                          {item.date && (
                            <time dateTime={item.date}>
                              {formatDate(item.date)}
                            </time>
                          )}
                        </span>
                        <h2 className="bl-row-title m-0 break-words">
                          <Link to={item.path} className="blt-title-link">
                            {item.title}
                          </Link>
                        </h2>
                        {item.series && (
                          <p className="bl-label m-0">Part of {item.series}</p>
                        )}
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
                })}
              </ol>
            )}
          </BlissWindow>

          {view.related.length > 0 && (
            <BlissWindow
              as="aside"
              aria-label="Narrow by another tag"
              title="Narrow by"
              icon={FunnelIcon}
              tone="purple"
              inactive
              flush
              className="min-w-0"
              status={<span>{view.related.length} related tags</span>}
            >
              <p className="bl-meta m-0 px-3 py-2">
                Tags that appear alongside {view.title}. Each one narrows the
                list.
              </p>
              <ul className="list-none m-0 p-0 bg-white border-t border-[#d5d1bd]">
                {view.related.map(([tag, count]) => (
                  <li
                    key={tag}
                    className="border-b border-dotted border-[#a7a28c] last:border-b-0"
                  >
                    <Link
                      to={view.addHref(tag)}
                      className="bl-row !min-h-[40px] !py-1.5"
                    >
                      <PlusIcon
                        size={14}
                        weight="bold"
                        className="shrink-0"
                        aria-hidden="true"
                      />
                      <span className="bl-row-body">
                        <span className="font-semibold break-words">
                          <span className="sr-only">Add </span>
                          {view.labelOf(tag)}
                        </span>
                      </span>
                      <span className="bl-meta shrink-0">
                        {count}
                        <span className="sr-only">
                          {count === 1 ? ' item' : ' items'}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </BlissWindow>
          )}
        </div>
      </div>
    </div>
  );
}
