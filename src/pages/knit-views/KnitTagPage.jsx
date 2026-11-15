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

// The same yarns as the swatch chart on /tags.
const TYPE_WOOL = {
  post: { wool: 'knt-wool-poppy', yarn: YARN.poppy },
  log: { wool: 'knt-wool-teal', yarn: YARN.teal },
  project: { wool: 'knt-wool-gold', yarn: YARN.gold },
};

// Related tags are wound as balls in a rotating set of yarns.
const BALLS = [
  'knt-wool-gold',
  'knt-wool-teal',
  'knt-wool-poppy',
  'knt-wool-plum',
  'knt-wool-moss',
  'knt-wool-denim',
  'knt-wool-rust',
];

// Pattern rows alternate between two shades, like a striped chart.
const STRIPES = ['knt-wool-bark', 'knt-wool-peat'];

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

const MetaRow = ({ label, children }) => (
  <div className="knt-meta-row">
    <dt className="knt-label">{label}</dt>
    <dd>{children}</dd>
  </div>
);

/** Knit /tags/:tag: a felt pattern card, its items written as pattern rows. */
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
        <KnitNotice>Finding the pattern card…</KnitNotice>
      </Shell>
    );
  if (view.status === 'missing')
    return (
      <Shell>
        <Seo title="Tag not found | Fezcodex" />
        <BackLink />
        <div className="knt-patch mt-8 max-w-2xl">
          <span className="knt-label">Pattern card missing</span>
          <KnitText
            as="h1"
            text={`No tag “${view.rawTag}”`}
            fg={YARN.rust}
            className="mt-3"
          />
          <p className="mt-4 text-lg">
            Nothing is knitted under that tag.{' '}
            <Link to="/tags" className="knt-link">
              Browse all tags
            </Link>
            .
          </p>
        </div>
      </Shell>
    );

  const { meta } = view;
  const gauge = TAG_TYPES.filter((t) => meta[t.plural] > 0);

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

      <div className="knt-page">
        <BackLink />

        <article className="knt-tg-card mt-6 max-w-5xl">
          <KnitBand
            pattern={['peerie', ['checks', { a: YARN.cream, b: YARN.rust }]]}
          />

          {/* ---- the felt card: name, notes, gauge, combinations ---- */}
          <header className="knt-patch">
            <span className="knt-label">Pattern card · Fezcodex tags</span>
            <h1 className="mt-3">
              <span className="sr-only">Pattern: {meta.label}</span>
              <span aria-hidden="true" className="block">
                <KnitText
                  text={`Pattern: ${meta.label}`}
                  fg={YARN.rust}
                  maxLines={3}
                />
              </span>
            </h1>

            <dl className="knt-meta mt-5 max-w-3xl">
              {meta.description && (
                <MetaRow label="Notes">
                  <span
                    className="font-normal"
                    style={{ fontFamily: 'Literata, Georgia, serif' }}
                  >
                    {meta.description}
                  </span>
                </MetaRow>
              )}
              <MetaRow label="Gauge">
                <span className="flex flex-wrap gap-x-4 gap-y-1">
                  {gauge.map((t) => (
                    <span
                      key={t.key}
                      className="inline-flex items-center gap-2"
                    >
                      <span
                        aria-hidden="true"
                        className={`knt-tg-yarn !w-3 !h-3 ${TYPE_WOOL[t.key].wool}`}
                      />
                      {meta[t.plural]}{' '}
                      {meta[t.plural] === 1 ? t.one.toLowerCase() : t.plural}
                    </span>
                  ))}
                </span>
              </MetaRow>
              <MetaRow label="Rows">
                {view.items.length} {view.items.length === 1 ? 'row' : 'rows'}{' '}
                in this view
              </MetaRow>
            </dl>

            {view.extra.length > 0 && (
              <div
                className="mt-5 flex flex-wrap items-center gap-2"
                aria-label="Active tag filters"
              >
                <span className="knt-label mr-1">Knitted together with:</span>
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

            {view.related.length > 0 && (
              <section className="mt-5" aria-labelledby="knt-tg-combine">
                <h2 id="knt-tg-combine" className="knt-label">
                  Combine with…
                </h2>
                <p className="knt-muted text-sm mt-1">
                  Tags that appear alongside {view.title}. Each one narrows the
                  rows.
                </p>
                <ul className="list-none m-0 p-0 mt-3 flex flex-wrap gap-2">
                  {view.related.map(([tag, count], i) => (
                    <li key={tag}>
                      <Link
                        to={view.addHref(tag)}
                        className="knt-tag knt-tg-chip"
                        aria-label={`Combine with ${view.labelOf(tag)}, ${count} ${
                          count === 1 ? 'item' : 'items'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`knt-tg-ball ${BALLS[i % BALLS.length]}`}
                        />
                        {view.labelOf(tag)}
                        <span className="knt-tg-count">{count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </header>

          {/* ---- work in: the type tabs ---- */}
          <div className="knt-wool-walnut px-4 py-3 sm:px-6 flex flex-wrap items-center gap-2">
            <span className="knt-label mr-1" id="knt-tg-work-label">
              Work in
            </span>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-labelledby="knt-tg-work-label"
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
                    <span
                      aria-hidden="true"
                      className={`knt-tg-yarn !w-3 !h-3 ${TYPE_WOOL[t.key].wool}`}
                    />
                  )}
                  {t.label}
                  <span className="knt-tg-count">{view.typeCounts[t.key]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ---- the pattern rows ---- */}
          {view.items.length === 0 ? (
            <div className="knt-wool-bark px-5 py-8 sm:px-8">
              <KnitNotice className="!py-0">
                Nothing here carries all of these tags, so there is nothing to
                knit.
              </KnitNotice>
              {view.extra.length > 0 && (
                <Link to={view.hrefFor([view.slug])} className="knt-link mt-3">
                  Unpick the extra tags
                </Link>
              )}
            </div>
          ) : (
            <ol className="list-none m-0 p-0" aria-label="Tagged items">
              {view.items.map((item, i) => {
                const type = typeByKey[item.type];
                const line = [
                  `Row ${i + 1}`,
                  type ? type.one : item.type,
                  item.category,
                ].filter(Boolean);
                const date = item.date ? formatDate(item.date) : '';
                return (
                  <li
                    key={item.id}
                    className={`knt-tg-prow ${STRIPES[i % 2]}`}
                    style={{
                      '--tg-yarn': (TYPE_WOOL[item.type] || {}).yarn,
                    }}
                  >
                    <span className="knt-tg-rownum" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="knt-label !text-[color:var(--knt-wheat)]">
                        {line.join(' · ')}
                        {date && (
                          <>
                            {' · '}
                            <time dateTime={item.date}>{date}</time>
                          </>
                        )}
                      </p>
                      <h2 className="mt-2">
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
                        <p className="knt-tg-desc mt-2 max-w-3xl">
                          {item.description}
                        </p>
                      )}
                      {item.tags.length > 0 && (
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
                                aria-current={
                                  view.active.includes(tag) ? 'true' : undefined
                                }
                              >
                                {view.labelOf(tag)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="knt-wool-walnut px-4 py-3 sm:px-6">
            <p className="knt-label">
              {view.items.length > 0
                ? `Cast off · ${view.items.length} ${
                    view.items.length === 1 ? 'item' : 'items'
                  } under ${view.title}`
                : `Cast off · ${view.title}`}
            </p>
          </div>
          <KnitBand pattern={[['checks', { a: YARN.cream, b: YARN.rust }]]} />
        </article>
      </div>
      <KnitBand pattern={['peerie', 'checks', 'peerie']} className="mt-8" />
    </div>
  );
}
