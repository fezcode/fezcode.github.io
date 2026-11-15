import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';
import { LedgerNotice, LedgerRule } from '../../components/ledger';
import '../../styles/Ledger.css';

const pad = (n, width = 3) => String(n).padStart(width, '0');

const BackLink = () => (
  <Link
    to="/tags"
    className="ldg-label inline-block mb-6 no-underline font-bold hover:text-[var(--ldg-accent)]"
  >
    [← THE INDEX]
  </Link>
);

const Shell = ({ children }) => (
  <div className="ldg-root">
    <div className="ldg-page">{children}</div>
  </div>
);

/**
 * Ledger view of /tags/:tag — one INDEX HEADING opened. The head states the
 * heading and its figures; below it every entry filed under the heading is a
 * numbered register line with its classification, date and cross-references.
 * A side column of further headings narrows the register, one ruled row each.
 */
const LedgerTagPage = ({ view }) => {
  if (view.status === 'error')
    return (
      <Shell>
        <LedgerNotice error>{view.error}</LedgerNotice>
      </Shell>
    );
  if (view.status === 'loading')
    return (
      <Shell>
        <LedgerNotice>RETRIEVING THE HEADING…</LedgerNotice>
      </Shell>
    );
  if (view.status === 'missing')
    return (
      <Shell>
        <Seo title="Tag not found | Fezcodex" />
        <BackLink />
        <h1 className="ldg-title mb-4 break-words">No tag “{view.rawTag}”</h1>
        <LedgerNotice error>NOTHING IS FILED UNDER THAT HEADING</LedgerNotice>
        <div className="mt-4 text-center">
          <Link to="/tags" className="ldg-btn no-underline inline-block">
            BROWSE ALL TAGS →
          </Link>
        </div>
      </Shell>
    );

  const { meta } = view;
  const figures = TAG_TYPES.filter((t) => meta[t.plural] > 0);

  return (
    <div className="ldg-root">
      <Seo
        title={`${view.title} | Tags | Fezcodex`}
        description={
          meta.description ||
          `Posts, logs and projects tagged ${meta.label} on Fezcodex.`
        }
        canonicalPath={tagPath(view.slug)}
      />

      <div className="ldg-page">
        <BackLink />

        <header
          className="pb-4 mb-6"
          style={{ borderBottom: '1px solid var(--ldg-rule)' }}
        >
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <span className="ldg-badge">TAG</span>
            <span className="ldg-label">INDEX HEADING · #{view.slug}</span>
          </div>
          <h1 className="ldg-title break-words" style={{ fontSize: '1.6rem' }}>
            {meta.label}
          </h1>
          {meta.description && (
            <p className="ldg-intro mt-2">{meta.description}</p>
          )}
          {figures.length > 0 && (
            <p className="ldg-stats mt-3">
              {figures.map((t) => (
                <span key={t.key}>
                  <strong>{pad(meta[t.plural])}</strong>{' '}
                  {meta[t.plural] === 1 ? t.one : t.plural}
                </span>
              ))}
            </p>
          )}
        </header>

        {view.extra.length > 0 && (
          <div
            className="flex flex-wrap items-center gap-2 mb-6"
            aria-label="Active tag filters"
          >
            <span className="ldg-label">FILTERED BY</span>
            {view.active.map((tag) => (
              <span
                key={tag}
                className="ldg-badge inline-flex items-center gap-2"
                style={{ paddingRight: 2 }}
              >
                {view.labelOf(tag)}
                <Link
                  to={view.removeHref(tag)}
                  aria-label={`Remove ${view.labelOf(tag)}`}
                  className="no-underline px-1.5 leading-none hover:bg-[var(--ldg-accent)] hover:text-[var(--ldg-bg)] focus-visible:bg-[var(--ldg-accent)] focus-visible:text-[var(--ldg-bg)]"
                  style={{ color: 'inherit', fontSize: '0.9rem' }}
                >
                  ×
                </Link>
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_17rem] gap-10">
          <section className="min-w-0" aria-label="Tagged items">
            <div
              className="flex flex-wrap items-baseline gap-1.5 mb-4"
              role="group"
              aria-label="Content type"
            >
              {view.types.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className="ldg-chip disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-pressed={view.type === t.key}
                  disabled={t.key !== 'all' && view.typeCounts[t.key] === 0}
                  onClick={() => view.setType(t.key)}
                >
                  {t.label}{' '}
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    · {pad(view.typeCounts[t.key], 2)}
                  </span>
                </button>
              ))}
            </div>

            <LedgerRule
              label={`ENTRIES · ${pad(view.items.length)} ON FILE`}
              className="mb-1"
            />

            {view.items.length === 0 ? (
              <LedgerNotice className="mt-3">
                NOTHING ON FILE CARRIES ALL OF THESE TAGS
              </LedgerNotice>
            ) : (
              <ol className="list-none m-0 p-0">
                {view.items.map((item, i) => (
                  <li
                    key={item.id}
                    className="py-4"
                    style={{ borderBottom: '1px dashed var(--ldg-rule)' }}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                      <span
                        className="ldg-rank"
                        style={{ fontSize: '0.78rem' }}
                      >
                        {pad(i + 1)}
                      </span>
                      <span className="ldg-badge">
                        {typeByKey[item.type].one}
                      </span>
                      {item.category && (
                        <span className="ldg-label">{item.category}</span>
                      )}
                      {item.date && (
                        <time
                          dateTime={item.date}
                          className="ldg-muted ml-auto whitespace-nowrap"
                          style={{
                            fontSize: '0.76rem',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {formatDate(item.date).toUpperCase()}
                        </time>
                      )}
                    </div>
                    <h2
                      className="m-0 font-bold uppercase break-words"
                      style={{ fontSize: '0.98rem', letterSpacing: '1px' }}
                    >
                      <Link
                        to={item.path}
                        className="ldg-highlight no-underline rounded-sm hover:bg-[var(--ldg-fg)] hover:text-[var(--ldg-bg)] focus-visible:bg-[var(--ldg-fg)] focus-visible:text-[var(--ldg-bg)] focus-visible:outline-none"
                      >
                        {item.title} <span aria-hidden="true">→</span>
                      </Link>
                    </h2>
                    {item.series && (
                      <p className="ldg-label mt-1 mb-0">
                        Part of{' '}
                        <span className="ldg-accent font-bold">
                          {item.series}
                        </span>
                      </p>
                    )}
                    {item.description && (
                      <p
                        className="ldg-muted mt-2 mb-0 break-words"
                        style={{ fontSize: '0.84rem', maxWidth: '74ch' }}
                      >
                        {item.description}
                      </p>
                    )}
                    {item.tags.length > 0 && (
                      <ul
                        className="list-none m-0 p-0 mt-3 flex flex-wrap gap-1.5"
                        aria-label="Tags"
                      >
                        {item.tags.map((tag) => {
                          const on = view.active.includes(tag);
                          return (
                            <li key={tag}>
                              <Link
                                to={tagPath(tag)}
                                className={`ldg-chip no-underline inline-block${
                                  on ? ' is-active' : ''
                                }`}
                                style={{
                                  fontSize: '0.66rem',
                                  padding: '2px 7px',
                                }}
                                aria-current={on ? 'true' : undefined}
                              >
                                #{view.labelOf(tag)}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </section>

          {view.related.length > 0 && (
            <aside className="min-w-0" aria-label="Narrow by another tag">
              <LedgerRule label="Narrow by" className="mb-2" />
              <p className="ldg-label mb-3">
                HEADINGS FILED ALONGSIDE {view.title}. EACH ONE NARROWS THE
                REGISTER.
              </p>
              <ul className="list-none m-0 p-0 flex flex-col gap-[2px]">
                {view.related.map(([tag, count]) => (
                  <li key={tag}>
                    <Link
                      to={view.addHref(tag)}
                      className="ldg-row-link"
                      style={{
                        gap: '0.6ch',
                        padding: '0.35rem 0.5rem',
                        fontSize: '0.8rem',
                      }}
                    >
                      <span
                        className="ldg-accent font-bold shrink-0"
                        aria-hidden="true"
                      >
                        +
                      </span>
                      <span className="truncate min-w-0">
                        <span className="sr-only">Add </span>
                        {view.labelOf(tag)}
                      </span>
                      <span className="ldg-leader" aria-hidden="true" />
                      <span
                        className="ldg-muted shrink-0"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        <span className="sr-only">, </span>
                        {pad(count, 2)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default LedgerTagPage;
