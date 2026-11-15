import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import {
  KnitText,
  KnitIcon,
  KnitBand,
  KnitNotice,
  YARN,
} from '../../components/knit';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';
import '../../styles/Knit.css';
import './knit-tags.css';

// Each content type keeps its own yarn across stats, tabs and rows.
const TYPE_YARN = { post: YARN.peach, log: YARN.gold, project: YARN.lemon };

const BackLink = () => (
  <Link to="/tags" className="knt-btn">
    <KnitIcon name="arrowLeft" fg={YARN.gold} />
    <KnitText text="All tags" size="small" fg={YARN.cream} fit />
  </Link>
);

const Shell = ({ children }) => (
  <div className="knt-root">
    <div className="knt-page">{children}</div>
  </div>
);

/** Knit /tags/:tag: everything filed under one tag, narrowed by more. */
export default function KnitTagPage({ view }) {
  if (view.status === 'error')
    return (
      <Shell>
        <KnitNotice error>{view.error}</KnitNotice>
        <BackLink />
      </Shell>
    );
  if (view.status === 'loading')
    return (
      <Shell>
        <KnitNotice>Unwinding the tag…</KnitNotice>
      </Shell>
    );
  if (view.status === 'missing')
    return (
      <Shell>
        <Seo title="Tag not found | Fezcodex" />
        <BackLink />
        <KnitText
          as="h1"
          text={`No tag “${view.rawTag}”`}
          fg={YARN.cream}
          className="mt-8"
        />
        <p className="knt-patch mt-6 max-w-2xl text-lg">
          Nothing is sewn under that tag.{' '}
          <Link to="/tags" className="knt-link">
            Browse all tags
          </Link>
          .
        </p>
      </Shell>
    );

  const { meta } = view;
  return (
    <div className="knt-root">
      <Seo
        title={`${view.title} | Tags | Fezcodex`}
        description={
          meta.description ||
          `Posts, logs and projects tagged ${meta.label} on Fezcodex.`
        }
        canonicalPath={tagPath(view.slug)}
      />
      <header className="knt-wool-plum">
        <KnitBand
          pattern={['peerie', ['flowers', { bg: YARN.plum }], 'peerie']}
        />
        <div className="knt-page !pb-8">
          <BackLink />
          <KnitText
            text="Tagged"
            size="small"
            fg={YARN.wheat}
            className="mt-8"
          />
          <KnitText
            as="h1"
            text={meta.label}
            scale={2}
            fg={YARN.cream}
            className="mt-4"
          />
          {meta.description && (
            <p className="knt-patch mt-6 max-w-2xl text-lg">
              {meta.description}
            </p>
          )}
          <ul className="list-none m-0 p-0 mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {TAG_TYPES.filter((t) => meta[t.plural] > 0).map((t) => (
              <li key={t.key}>
                <KnitText
                  text={`${meta[t.plural]} ${
                    meta[t.plural] === 1 ? t.one.toLowerCase() : t.plural
                  }`}
                  size="small"
                  fg={TYPE_YARN[t.key]}
                  fit
                />
              </li>
            ))}
          </ul>
        </div>
        <KnitBand pattern="peerie" />
      </header>

      <div className="knt-page">
        {view.extra.length > 0 && (
          <div
            className="knt-patch-dark knt-patch-tight mb-6 flex flex-wrap items-center gap-2"
            aria-label="Active tag filters"
          >
            <span className="knt-label mr-1">Filtered by</span>
            {view.active.map((tag) => (
              <span key={tag} className="knt-tag knt-tg-on">
                {view.labelOf(tag)}
                <Link
                  to={view.removeHref(tag)}
                  className="knt-tg-remove"
                  aria-label={`Remove ${view.labelOf(tag)}`}
                >
                  ×
                </Link>
              </span>
            ))}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <section className="min-w-0 lg:col-span-2" aria-label="Tagged items">
            <div
              className="flex flex-wrap gap-2 mb-5"
              role="group"
              aria-label="Content type"
            >
              {view.types.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className="knt-btn"
                  aria-pressed={view.type === t.key}
                  disabled={t.key !== 'all' && view.typeCounts[t.key] === 0}
                  onClick={() => view.setType(t.key)}
                >
                  {t.key !== 'all' && (
                    <span aria-hidden="true" className="inline-flex">
                      <KnitIcon name="dot" fg={TYPE_YARN[t.key]} />
                    </span>
                  )}
                  {t.label}
                  <span className="knt-tg-count">{view.typeCounts[t.key]}</span>
                </button>
              ))}
            </div>

            {view.items.length === 0 ? (
              <KnitNotice>
                Nothing here carries all of these tags — the swatch stays blank.
              </KnitNotice>
            ) : (
              <ol className="list-none m-0 p-0">
                {view.items.map((item) => (
                  <li key={item.id} className="knt-row knt-tg-item">
                    <div className="knt-row-body">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <KnitText
                          text={`${typeByKey[item.type].one}${
                            item.category ? ` · ${item.category}` : ''
                          }`}
                          size="small"
                          fg={TYPE_YARN[item.type] || YARN.wheat}
                          fit
                        />
                        {item.date && (
                          <time className="knt-label" dateTime={item.date}>
                            {formatDate(item.date)}
                          </time>
                        )}
                      </div>
                      <h2 className="mt-3">
                        <Link to={item.path} className="knt-tg-title">
                          <KnitText
                            text={item.title}
                            fg={YARN.cream}
                            maxLines={3}
                          />
                        </Link>
                      </h2>
                      {item.series && (
                        <p className="knt-muted text-sm mt-2">
                          Part of {item.series}
                        </p>
                      )}
                      {item.description && (
                        <p className="knt-patch knt-patch-tight mt-3 max-w-3xl text-base">
                          {item.description}
                        </p>
                      )}
                      <ul
                        className="list-none m-0 p-0 mt-3 flex flex-wrap gap-1.5"
                        aria-label="Tags"
                      >
                        {item.tags.map((tag) => (
                          <li key={tag}>
                            <Link
                              to={tagPath(tag)}
                              className={`knt-tag knt-tg-chip${
                                view.active.includes(tag) ? ' knt-tg-on' : ''
                              }`}
                            >
                              #{view.labelOf(tag)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span aria-hidden="true" className="hidden sm:inline-flex">
                      <KnitIcon name="arrowUpRight" fg={YARN.gold} />
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {view.related.length > 0 && (
            <aside className="min-w-0" aria-label="Narrow by another tag">
              <div className="knt-patch-dark">
                <KnitText as="h2" text="Narrow by" fg={YARN.gold} />
                <p className="knt-muted text-sm mt-3">
                  Tags that appear alongside {view.title}. Each one narrows the
                  list.
                </p>
                <ul className="list-none m-0 p-0 mt-4 flex flex-wrap gap-2">
                  {view.related.map(([tag, count]) => (
                    <li key={tag}>
                      <Link
                        to={view.addHref(tag)}
                        className="knt-tag knt-tg-chip"
                        data-size={0}
                      >
                        + {view.labelOf(tag)}
                        <span className="knt-tg-count">{count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>

        {view.items.length > 0 && (
          <p className="knt-label mt-8">
            {view.items.length} {view.items.length === 1 ? 'item' : 'items'}{' '}
            under {view.title}
          </p>
        )}
      </div>
      <KnitBand pattern={['peerie', 'hearts', 'peerie']} className="mt-8" />
    </div>
  );
}
