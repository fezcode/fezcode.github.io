import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import {
  KilimText,
  KilimIcon,
  KilimBand,
  KilimNotice,
  WOOL,
  pickBySeed,
} from '../../components/kilim';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';
import { TYPE_DYE } from './KilimTagsPage';
import '../../styles/Kilim.css';
import './kilim-tags.css';

// The selvedge of each bolt is woven in a colour of its own, seeded by tag.
const SELVEDGES = [
  WOOL.madder,
  WOOL.saffron,
  WOOL.teal,
  WOOL.pistachio,
  WOOL.apricot,
  WOOL.rose,
  WOOL.ivory,
];

// Related tags are plied in a rotating set of dyes.
const PLIES = [
  WOOL.saffron,
  WOOL.teal,
  WOOL.madder,
  WOOL.pistachio,
  WOOL.rose,
  WOOL.indigoLight,
  WOOL.apricot,
];

const BackLink = () => (
  <Link to="/tags" className="klm-btn klm-btn-small">
    <KilimIcon name="arrowLeft" fg={WOOL.walnut} />
    All tags
  </Link>
);

const Shell = ({ children }) => (
  <div className="klm-root">
    <div className="klm-page">{children}</div>
  </div>
);

const TicketRow = ({ label, children }) => (
  <div className="klm-tags-ticket-row">
    <dt>{label}</dt>
    <dd>{children}</dd>
  </div>
);

/**
 * Kilim /tags/:tag: a bolt of cloth woven with that thread. A ticket is
 * pinned to the bolt's end (name, notes, what it is woven from, what it
 * plies with); the posts, logs and projects are lengths unrolled down the
 * cloth, measured off against a tape along the selvedge.
 */
export default function KilimTagPage({ view }) {
  if (view.status === 'error')
    return (
      <Shell>
        <KilimNotice error>{view.error}</KilimNotice>
        <div className="mt-4">
          <BackLink />
        </div>
      </Shell>
    );
  if (view.status === 'loading')
    return (
      <Shell>
        <KilimNotice>Unrolling the bolt…</KilimNotice>
      </Shell>
    );
  if (view.status === 'missing')
    return (
      <Shell>
        <Seo title="Tag not found | Fezcodex" />
        <BackLink />
        <div className="klm-tags-ticket klm-tags-ticket-lone mt-8">
          <p className="klm-tags-ticket-eyebrow">No such bolt</p>
          <KilimText
            as="h1"
            text={`No tag “${view.rawTag}”`}
            fg={WOOL.madder}
            maxLines={3}
            className="mt-3"
          />
          <p className="klm-tags-ticket-text mt-4">
            Nothing is woven with that thread.{' '}
            <Link to="/tags" className="klm-tags-ticket-link">
              Browse all tags
            </Link>
            .
          </p>
        </div>
      </Shell>
    );

  const { meta } = view;
  const woven = TAG_TYPES.filter((t) => meta[t.plural] > 0);
  const selvedge = pickBySeed(view.slug, SELVEDGES);

  return (
    <div className="klm-root klm-tags">
      <Seo
        title={`${view.title} | Tags | Fezcodex`}
        description={
          meta.description ||
          `Posts, logs and projects tagged ${meta.label} on Fezcodex.`
        }
        canonicalPath={tagPath(view.slug)}
      />

      <div className="klm-page">
        <BackLink />

        <article className="klm-tags-bolt" style={{ '--selvedge': selvedge }}>
          {/* ---- the ticket pinned to the bolt's end ---- */}
          <header className="klm-tags-ticket">
            <p className="klm-tags-ticket-eyebrow">
              Bolt ticket · Fezcodex tags
            </p>
            <h1 className="mt-3">
              <span className="sr-only">Tag: {meta.label}</span>
              <span aria-hidden="true" className="block">
                <KilimText text={meta.label} fg={WOOL.madder} maxLines={3} />
              </span>
            </h1>

            <dl className="klm-tags-ticket-list">
              {meta.description && (
                <TicketRow label="Notes">
                  <span className="klm-tags-ticket-text">
                    {meta.description}
                  </span>
                </TicketRow>
              )}
              <TicketRow label="Woven from">
                <span className="flex flex-wrap gap-x-4 gap-y-1">
                  {woven.map((t) => (
                    <span key={t.key} className="inline-flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="klm-tags-dot"
                        style={{ '--dye': TYPE_DYE[t.key] }}
                      />
                      {meta[t.plural]}{' '}
                      {meta[t.plural] === 1 ? t.one.toLowerCase() : t.plural}
                    </span>
                  ))}
                </span>
              </TicketRow>
              <TicketRow label="Length">
                {view.items.length}{' '}
                {view.items.length === 1 ? 'length' : 'lengths'} in this view
              </TicketRow>
            </dl>

            {view.extra.length > 0 && (
              <div
                className="mt-5 flex flex-wrap items-center gap-2"
                aria-label="Active tag filters"
              >
                <span className="klm-tags-ticket-eyebrow mr-1">
                  Plied with:
                </span>
                {view.active.map((tag) => (
                  <span key={tag} className="klm-tags-ply-chip is-on">
                    {view.labelOf(tag)}
                    <Link
                      to={view.removeHref(tag)}
                      className="klm-tags-unply"
                      aria-label={`Remove ${view.labelOf(tag)}`}
                    >
                      ×
                    </Link>
                  </span>
                ))}
              </div>
            )}

            {view.related.length > 0 && (
              <section className="mt-5" aria-labelledby="klm-tags-combine">
                <h2 id="klm-tags-combine" className="klm-tags-ticket-eyebrow">
                  Ply with…
                </h2>
                <p className="klm-tags-ticket-text klm-tags-ticket-small mt-1">
                  Threads that run alongside {view.title}. Each one narrows the
                  cloth.
                </p>
                <ul className="list-none m-0 p-0 mt-3 flex flex-wrap gap-2">
                  {view.related.map(([tag, count], i) => (
                    <li key={tag}>
                      <Link
                        to={view.addHref(tag)}
                        className="klm-tags-ply-chip"
                        aria-label={`Combine with ${view.labelOf(tag)}, ${count} ${
                          count === 1 ? 'item' : 'items'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="klm-tags-dot"
                          style={{ '--dye': PLIES[i % PLIES.length] }}
                        />
                        {view.labelOf(tag)}
                        <span className="klm-tags-count">{count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </header>

          <KilimBand pattern="end" />

          {/* ---- cut by type ---- */}
          <div className="klm-tags-cut">
            <span className="klm-label" id="klm-tags-cut-label">
              Cut by
            </span>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-labelledby="klm-tags-cut-label"
            >
              {view.types.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className="klm-chip"
                  aria-pressed={view.type === t.key}
                  disabled={t.key !== 'all' && view.typeCounts[t.key] === 0}
                  onClick={() => view.setType(t.key)}
                >
                  {t.key !== 'all' && (
                    <span
                      aria-hidden="true"
                      className="klm-tags-dot"
                      style={{ '--dye': TYPE_DYE[t.key] }}
                    />
                  )}
                  {t.label}
                  <span className="klm-tags-count">{view.typeCounts[t.key]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ---- the cloth: lengths measured off along the tape ---- */}
          {view.items.length === 0 ? (
            <div className="klm-tags-cloth klm-tags-cloth-empty">
              <KilimNotice>
                Nothing here carries all of these threads, so there is no cloth
                to cut.
              </KilimNotice>
              {view.extra.length > 0 && (
                <Link
                  to={view.hrefFor([view.slug])}
                  className="klm-link inline-block mt-3"
                >
                  Unpick the extra threads
                </Link>
              )}
            </div>
          ) : (
            <ol className="klm-tags-cloth" aria-label="Tagged items">
              {view.items.map((item, i) => {
                const type = typeByKey[item.type];
                const date = item.date ? formatDate(item.date) : '';
                const line = [type ? type.one : item.type, item.category].filter(
                  Boolean,
                );
                return (
                  <li
                    key={item.id}
                    className="klm-tags-length"
                    style={{ '--dye': TYPE_DYE[item.type] || WOOL.ivory }}
                  >
                    <span className="klm-tags-tape" aria-hidden="true">
                      <span className="klm-tags-tape-mark">{i + 1}</span>
                    </span>
                    <div className="klm-tags-length-body">
                      <p className="klm-tags-length-meta">
                        <span className="klm-tags-dot" aria-hidden="true" />
                        {line.join(' · ')}
                        {date && (
                          <>
                            {' · '}
                            <time dateTime={item.date}>{date}</time>
                          </>
                        )}
                      </p>
                      <h2 className="klm-tags-length-title">
                        <Link to={item.path}>{item.title}</Link>
                      </h2>
                      {item.series && (
                        <p className="klm-tags-length-series">
                          Part of {item.series}
                        </p>
                      )}
                      {item.description && (
                        <p className="klm-tags-length-desc">
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
                                className={`klm-tags-thread${
                                  view.active.includes(tag) ? ' is-on' : ''
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

          <div className="klm-tags-cut">
            <p className="klm-label m-0">
              {view.items.length > 0
                ? `End of bolt · ${view.items.length} ${
                    view.items.length === 1 ? 'length' : 'lengths'
                  } woven with ${view.title}`
                : `End of bolt · ${view.title}`}
            </p>
          </div>
          <KilimBand pattern="end" />
        </article>
      </div>
    </div>
  );
}
