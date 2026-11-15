import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { TAG_TYPES } from '../tags/tagTypes';
import { LedgerFolio, LedgerNotice, LedgerRule } from '../../components/ledger';
import '../../styles/Ledger.css';
import './ledger-tags.css';

// Emphasis steps for view.sizeFor(): heavier ink for the busier accounts.
const NAME_INK = {
  4: 'font-bold ldg-highlight',
  3: 'font-bold',
  2: '',
  1: 'ldg-muted',
};

const pad = (n, width = 3) => String(n).padStart(width, '0');

/** A ledger figure: right-aligned by the cell, a dash for nil. */
const Amount = ({ value }) =>
  value > 0 ? value : <span className="ldg-tg-nil">—</span>;

/** Three stacked segments: the posts / logs / projects split of one account. */
const ShareBar = ({ tag }) => {
  const total = TAG_TYPES.reduce((sum, t) => sum + (tag[t.plural] || 0), 0);
  const label = TAG_TYPES.map((t) => `${t.plural} ${tag[t.plural] || 0}`).join(
    ', ',
  );
  return (
    <div className="ldg-tg-bar" role="img" aria-label={`Split: ${label}`}>
      {total > 0 &&
        TAG_TYPES.map((t) =>
          tag[t.plural] > 0 ? (
            <span
              key={t.key}
              className={`ldg-tg-seg-${t.key}`}
              style={{ width: `${(tag[t.plural] / total) * 100}%` }}
            />
          ) : null,
        )}
    </div>
  );
};

/** A column head that sorts, or plain text when the column cannot sort. */
const SortHead = ({ label, sortKey, dir, view, className = '' }) => {
  const sortable = Boolean(sortKey);
  const active = sortable && view.sort === sortKey;
  return (
    <th
      scope="col"
      className={`${className}${sortable ? ' is-sortable' : ''}`}
      aria-sort={sortable ? (active ? dir : 'none') : undefined}
    >
      {sortable ? (
        <button
          type="button"
          className="ldg-tg-sort"
          onClick={() => view.setSort(sortKey)}
          aria-pressed={active}
        >
          {label}
          <span className="ldg-tg-arrow" aria-hidden="true">
            {dir === 'ascending' ? '▲' : '▼'}
          </span>
          <span className="sr-only">
            {dir === 'ascending' ? ', sort A to Z' : ', sort by most used'}
          </span>
        </button>
      ) : (
        label
      )}
    </th>
  );
};

/**
 * Ledger view of /tags — the ACCOUNT TABLE. Every tag is an account on a
 * green-ruled sheet: its postings split into posts, logs and projects, a
 * total, and a share bar. The column heads sort the sheet; the foot carries
 * the balance. Single-entry accounts are bound in a SUNDRY sub-table.
 */
const LedgerTagsPage = ({ view }) => {
  const ready = view.status === 'ready';
  const shown = view.shared.length + view.single.length;
  const filtered = view.type !== 'all';

  const totals = useMemo(() => {
    const sums = { shown: 0 };
    TAG_TYPES.forEach((t) => {
      sums[t.plural] = 0;
    });
    view.shared.forEach((tag) => {
      sums.shown += tag.shown;
      TAG_TYPES.forEach((t) => {
        sums[t.plural] += tag[t.plural] || 0;
      });
    });
    return sums;
  }, [view.shared]);

  const sundryTotal = useMemo(
    () => view.single.reduce((sum, tag) => sum + tag.shown, 0),
    [view.single],
  );

  const dimFor = (t) => (filtered && view.type !== t.key ? ' is-dim' : '');

  return (
    <div className="ldg-root ldg-tg">
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />
      <div className="ldg-page">
        <LedgerFolio
          folio="GENERAL LEDGER — CHART OF ACCOUNTS"
          title="TAGS"
          sub="EVERY TAG AN ACCOUNT, EVERY POST, LOG AND PROJECT A POSTING"
        >
          {ready && (
            <p className="ldg-stats mt-3">
              <span>
                <strong>{pad(view.totalTags)}</strong> ACCOUNTS
              </span>
              <span>
                <strong>{pad(view.totalItems)}</strong> POSTS, LOGS &amp;
                PROJECTS
              </span>
              <span>
                <strong>{pad(shown)}</strong> ON THIS SHEET
              </span>
            </p>
          )}
        </LedgerFolio>

        <div className="mb-5">
          <input
            type="search"
            className="ldg-input"
            value={view.query}
            onChange={(event) => view.setQuery(event.target.value)}
            placeholder="LOOK UP AN ACCOUNT…"
            aria-label="Search tags"
          />
        </div>

        <div className="ldg-tg-tabs" role="group" aria-label="Content type">
          {view.types.map((t) => (
            <button
              key={t.key}
              type="button"
              className="ldg-tg-tab"
              aria-pressed={view.type === t.key}
              onClick={() => view.setType(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {view.status === 'error' && (
          <LedgerNotice error className="mt-4">
            {view.error}
          </LedgerNotice>
        )}
        {view.status === 'loading' && (
          <LedgerNotice className="mt-4">OPENING THE LEDGER…</LedgerNotice>
        )}
        {ready && shown === 0 && (
          <LedgerNotice className="mt-4">
            NO ACCOUNT MATCHES “{view.query}” — NOTHING TO POST
          </LedgerNotice>
        )}

        {view.shared.length > 0 && (
          <>
            <p className="ldg-label mt-3 mb-2 flex flex-wrap gap-x-4 gap-y-1">
              <span aria-hidden="true">SHARE KEY:</span>
              {TAG_TYPES.map((t) => (
                <span key={t.key} aria-hidden="true">
                  <i className={`ldg-tg-key ldg-tg-seg-${t.key}`} />
                  {t.label}
                </span>
              ))}
            </p>
            <table className="ldg-tg-sheet">
              <caption className="sr-only">
                Tag accounts{view.query ? ` matching ${view.query}` : ''}, with
                posts, logs, projects and totals.{' '}
                {view.sort === 'az' ? 'Sorted A to Z.' : 'Sorted by most used.'}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="c-no">
                    №
                  </th>
                  <SortHead
                    label="Account"
                    sortKey="az"
                    dir="ascending"
                    view={view}
                    className="c-acct"
                  />
                  {TAG_TYPES.map((t) => (
                    <th key={t.key} scope="col" className={`c-num${dimFor(t)}`}>
                      {t.label}
                    </th>
                  ))}
                  <SortHead
                    label="Total"
                    sortKey="count"
                    dir="descending"
                    view={view}
                    className="c-total"
                  />
                  <th scope="col" className="c-share">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {view.shared.map((tag, i) => (
                  <tr key={tag.slug}>
                    <td className="c-no">{pad(i + 1)}</td>
                    <th scope="row" className="c-acct">
                      <Link
                        to={view.hrefFor(tag)}
                        className={`ldg-tg-acct ${
                          NAME_INK[view.sizeFor(tag.shown)]
                        }`}
                      >
                        {tag.label}
                      </Link>
                    </th>
                    {TAG_TYPES.map((t, col) => (
                      <td
                        key={t.key}
                        className={`c-num${col === 1 ? ' is-col2' : ''}${dimFor(
                          t,
                        )}`}
                        data-label={t.label.toUpperCase()}
                      >
                        <Amount value={tag[t.plural]} />
                      </td>
                    ))}
                    <td className="c-total" data-label="TOTAL">
                      {tag.shown}
                    </td>
                    <td className="c-share">
                      <ShareBar tag={tag} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={2} className="c-label text-left">
                    Balance carried
                    <span className="ldg-muted font-normal">
                      {' '}
                      · {pad(view.shared.length)} ACCOUNTS
                    </span>
                  </th>
                  {TAG_TYPES.map((t, col) => (
                    <td
                      key={t.key}
                      className={`c-num${col === 1 ? ' is-col2' : ''}${dimFor(
                        t,
                      )}`}
                      data-label={t.label.toUpperCase()}
                    >
                      {totals[t.plural]}
                    </td>
                  ))}
                  <td className="c-total" data-label="TOTAL">
                    {totals.shown}
                  </td>
                  <td className="c-share" aria-hidden="true" />
                </tr>
              </tfoot>
            </table>
          </>
        )}

        {view.single.length > 0 && (
          <details className="mt-10">
            <summary className="ldg-summary">
              Sundry accounts ({view.single.length})
            </summary>
            <p className="ldg-label mt-2 mb-3">
              ACCOUNTS WITH A SINGLE POSTING, KEPT OFF THE MAIN SHEET.
            </p>
            <div className="overflow-x-auto">
              <table className="ldg-tg-sundry">
                <caption className="sr-only">
                  Sundry accounts: tags used once
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className="c-no">
                      №
                    </th>
                    <th scope="col">Account</th>
                    <th scope="col" className="hidden sm:table-cell">
                      Posted under
                    </th>
                    <th scope="col" className="c-num">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {view.single.map((tag, i) => (
                    <tr key={tag.slug}>
                      <td className="c-no">{pad(i + 1)}</td>
                      <th scope="row" className="c-acct font-normal">
                        <Link to={view.hrefFor(tag)} className="ldg-tg-acct">
                          {tag.label}
                        </Link>
                      </th>
                      <td className="ldg-muted hidden sm:table-cell uppercase text-[0.72rem] tracking-[1px]">
                        {TAG_TYPES.filter((t) => tag[t.plural] > 0)
                          .map((t) => t.one)
                          .join(' · ')}
                      </td>
                      <td className="c-num">{tag.shown}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th
                      scope="row"
                      colSpan={2}
                      className="text-left ldg-label font-bold"
                    >
                      Sundry total
                    </th>
                    <td className="hidden sm:table-cell" />
                    <td className="c-num font-bold">{sundryTotal}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </details>
        )}

        {ready && shown > 0 && (
          <footer className="mt-12">
            <LedgerRule className="mb-4" />
            <span className="ldg-label">
              CHART OF ACCOUNTS · {pad(view.totalTags)} ON RECORD ·{' '}
              {view.sort === 'az' ? 'SORTED A→Z' : 'HEAVIEST FIRST'}
              {filtered &&
                ` · ${view.types
                  .find((t) => t.key === view.type)
                  ?.label.toUpperCase()} ONLY`}
            </span>
          </footer>
        )}
      </div>
    </div>
  );
};

export default LedgerTagsPage;
