import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import { TAG_TYPES, typeByKey, formatDate } from '../tags/tagTypes';
import { LedgerNotice } from '../../components/ledger';
import '../../styles/Ledger.css';
import './ledger-tags.css';

const pad = (n, width = 3) => String(n).padStart(width, '0');

const BackLink = () => (
  <Link
    to="/tags"
    className="ldg-label inline-block mb-6 no-underline font-bold hover:text-[var(--ldg-accent)] focus-visible:text-[var(--ldg-accent)]"
  >
    [← CHART OF ACCOUNTS]
  </Link>
);

const Shell = ({ children }) => (
  <div className="ldg-root ldg-tg">
    <div className="ldg-page">{children}</div>
  </div>
);

/**
 * Ledger view of /tags/:tag — the ACCOUNT STATEMENT. A double-ruled header
 * states the account and its opening balance split by type; every post, log
 * and project filed under it is a numbered statement line. Extra tags
 * reconcile the statement, and the CROSS-POSTINGS table lists the accounts
 * that share entries with this one, each a further reconciliation.
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
        <LedgerNotice>DRAWING UP THE STATEMENT…</LedgerNotice>
      </Shell>
    );
  if (view.status === 'missing')
    return (
      <Shell>
        <Seo title="Tag not found | Fezcodex" />
        <BackLink />
        <h1 className="ldg-title mb-4 break-words">No tag “{view.rawTag}”</h1>
        <LedgerNotice error>NO ACCOUNT IS OPEN UNDER THAT NAME</LedgerNotice>
        <div className="mt-4 text-center">
          <Link to="/tags" className="ldg-btn no-underline inline-block">
            BROWSE ALL TAGS →
          </Link>
        </div>
      </Shell>
    );

  const { meta } = view;
  const count = view.items.length;

  return (
    <div className="ldg-root ldg-tg">
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

        {/* statement header */}
        <header className="ldg-tg-box mb-8">
          <div className="px-4 pt-4 pb-3 sm:px-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <span className="ldg-eyebrow">General ledger · tags</span>
              <span className="ldg-label">ACCOUNT № #{view.slug}</span>
            </div>
            <h1
              className="ldg-title break-words"
              style={{ fontSize: '1.45rem' }}
            >
              <span className="ldg-muted font-normal">
                Statement of account:{' '}
              </span>
              {meta.label}
            </h1>
            {meta.description && (
              <p className="ldg-intro mt-2">{meta.description}</p>
            )}
          </div>
          <dl className="ldg-tg-sum">
            <div>
              <dt>Opening balance</dt>
              <dd>{pad(meta.count)}</dd>
            </div>
            {TAG_TYPES.map((t) => (
              <div key={t.key}>
                <dt>
                  <i
                    className={`ldg-tg-key ldg-tg-seg-${t.key}`}
                    aria-hidden="true"
                  />
                  {t.label}
                </dt>
                <dd className={meta[t.plural] > 0 ? '' : 'ldg-tg-nil'}>
                  {meta[t.plural] > 0 ? pad(meta[t.plural]) : '—'}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        {view.extra.length > 0 && (
          <div
            className="flex flex-wrap items-center gap-2 mb-6"
            aria-label="Active tag filters"
          >
            <span className="ldg-label font-bold">Reconciled with:</span>
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
                  className="no-underline px-1.5 leading-none hover:bg-[var(--ldg-accent)] hover:text-[var(--ldg-bg)] focus-visible:bg-[var(--ldg-accent)] focus-visible:text-[var(--ldg-bg)] focus-visible:outline-none"
                  style={{ color: 'inherit', fontSize: '0.9rem' }}
                >
                  ×
                </Link>
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_16rem] gap-10">
          <section className="min-w-0" aria-label="Tagged items">
            <div className="ldg-tg-tabs" role="group" aria-label="Content type">
              {view.types.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className="ldg-tg-tab"
                  aria-pressed={view.type === t.key}
                  disabled={t.key !== 'all' && view.typeCounts[t.key] === 0}
                  onClick={() => view.setType(t.key)}
                >
                  {t.label} · {pad(view.typeCounts[t.key], 2)}
                </button>
              ))}
            </div>

            {count === 0 ? (
              <LedgerNotice className="mt-3">
                NOTHING ON FILE CARRIES ALL OF THESE TAGS
              </LedgerNotice>
            ) : (
              <table className="ldg-tg-lines">
                <caption className="sr-only">
                  Statement lines for {view.title}: {count} entries
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className="c-no">
                      Entry №
                    </th>
                    <th scope="col" className="c-date">
                      Date
                    </th>
                    <th scope="col" className="c-type">
                      Type
                    </th>
                    <th scope="col" className="c-cat">
                      Category
                    </th>
                    <th scope="col" className="c-part">
                      Particulars
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {view.items.map((item, i) => (
                    <tr key={item.id}>
                      <td className="c-no">
                        {pad(i + 1)}
                        <span className="ldg-muted font-normal text-[0.68rem]">
                          <span aria-hidden="true">/</span>
                          <span className="sr-only"> of </span>
                          {pad(count)}
                        </span>
                      </td>
                      <td
                        className={`c-date whitespace-nowrap ldg-muted text-[0.74rem]${
                          item.date ? '' : ' is-empty'
                        }`}
                      >
                        {item.date ? (
                          <time dateTime={item.date}>
                            {formatDate(item.date).toUpperCase()}
                          </time>
                        ) : (
                          <span className="ldg-tg-nil">—</span>
                        )}
                      </td>
                      <td className="c-type">
                        <span className="ldg-badge">
                          {typeByKey[item.type].one}
                        </span>
                      </td>
                      <td
                        className={`c-cat ldg-label${
                          item.category ? '' : ' is-empty'
                        }`}
                      >
                        {item.category || <span className="ldg-tg-nil">—</span>}
                      </td>
                      <td className="c-part min-w-0">
                        <h2
                          className="m-0 font-bold uppercase break-words"
                          style={{ fontSize: '0.9rem', letterSpacing: '1px' }}
                        >
                          <Link
                            to={item.path}
                            className="ldg-tg-acct ldg-highlight"
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
                            className="ldg-muted mt-1 mb-0 break-words"
                            style={{ fontSize: '0.78rem', maxWidth: '70ch' }}
                          >
                            {item.description}
                          </p>
                        )}
                        {item.tags.length > 0 && (
                          <ul
                            className="list-none m-0 p-0 mt-2 flex flex-wrap gap-1"
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
                                      fontSize: '0.62rem',
                                      padding: '1px 6px',
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
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5}>
                      Closing balance · {pad(count)} entries posted
                      {count !== view.typeCounts.all &&
                        ` of ${pad(view.typeCounts.all)}`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </section>

          {view.related.length > 0 && (
            <aside className="min-w-0" aria-label="Narrow by another tag">
              <table className="ldg-tg-xpost ldg-card">
                <caption className="text-left pb-2">
                  <span className="ldg-section-title block">
                    Cross-postings
                  </span>
                  <span className="ldg-label block">
                    ACCOUNTS SHARING ENTRIES WITH {view.title}. EACH ONE NARROWS
                    THE STATEMENT.
                  </span>
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Related account</th>
                    <th scope="col" className="c-num">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {view.related.map(([tag, n]) => (
                    <tr key={tag}>
                      <td>
                        <Link to={view.addHref(tag)} className="ldg-tg-xlink">
                          <span
                            className="ldg-accent font-bold shrink-0"
                            aria-hidden="true"
                          >
                            +
                          </span>
                          <span className="min-w-0">
                            <span className="sr-only">Add </span>
                            {view.labelOf(tag)}
                          </span>
                        </Link>
                      </td>
                      <td className="c-num">{n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default LedgerTagPage;
