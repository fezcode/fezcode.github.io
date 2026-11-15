import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { tagPath } from '../../utils/tagIndex';
import { LedgerFolio, LedgerNotice, LedgerRule } from '../../components/ledger';
import '../../styles/Ledger.css';

// Emphasis steps for view.sizeFor(): heavier ink for the busier headings.
const NAME_INK = {
  4: 'font-bold ldg-highlight text-[0.98rem]',
  3: 'font-bold',
  2: '',
  1: 'ldg-muted text-[0.84rem]',
};

const pad = (n, width = 3) => String(n).padStart(width, '0');

/**
 * Ledger view of /tags — the INDEX at the back of the book. Every shared tag
 * is an index heading: name, dotted leader, the number of entries filed under
 * it, set in columns like a printed index. Heavier headings take heavier ink.
 * One-off headings are bound in a folded appendix.
 */
const LedgerTagsPage = ({ view }) => {
  const ready = view.status === 'ready';
  const shown = view.shared.length + view.single.length;

  return (
    <div className="ldg-root">
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />
      <div className="ldg-page">
        <LedgerFolio
          folio="THE INDEX — CROSS-REFERENCES"
          title="TAGS"
          sub="EVERY HEADING IN THE BOOK, WITH ITS ENTRIES COUNTED"
        >
          {ready && (
            <p className="ldg-stats mt-3">
              <span>
                <strong>{pad(view.totalTags)}</strong> HEADINGS
              </span>
              <span>
                <strong>{pad(view.totalItems)}</strong> POSTS, LOGS &amp;
                PROJECTS
              </span>
              <span>
                <strong>{pad(shown)}</strong> SHOWN
              </span>
            </p>
          )}
        </LedgerFolio>

        {/* finding aid */}
        <div
          className="flex flex-col gap-3 mb-6 pb-4"
          style={{ borderBottom: '1px solid var(--ldg-rule)' }}
        >
          <input
            type="search"
            className="ldg-input"
            value={view.query}
            onChange={(event) => view.setQuery(event.target.value)}
            placeholder="SEARCH THE INDEX…"
            aria-label="Search tags"
          />
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <div
              className="flex flex-wrap items-baseline gap-1.5"
              role="group"
              aria-label="Content type"
            >
              <span className="ldg-label mr-1" aria-hidden="true">
                TYPE
              </span>
              {view.types.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className="ldg-chip"
                  aria-pressed={view.type === t.key}
                  onClick={() => view.setType(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div
              className="flex flex-wrap items-baseline gap-1.5"
              role="group"
              aria-label="Sort tags"
            >
              <span className="ldg-label mr-1" aria-hidden="true">
                SORT
              </span>
              <button
                type="button"
                className="ldg-chip"
                aria-pressed={view.sort === 'count'}
                onClick={() => view.setSort('count')}
              >
                Most used
              </button>
              <button
                type="button"
                className="ldg-chip"
                aria-pressed={view.sort === 'az'}
                onClick={() => view.setSort('az')}
              >
                A–Z
              </button>
            </div>
          </div>
        </div>

        {view.status === 'error' && (
          <LedgerNotice error>{view.error}</LedgerNotice>
        )}
        {view.status === 'loading' && (
          <LedgerNotice>OPENING THE INDEX…</LedgerNotice>
        )}
        {ready && shown === 0 && (
          <LedgerNotice>
            NO HEADING MATCHES “{view.query}” — THE INDEX STAYS BLANK
          </LedgerNotice>
        )}

        {view.shared.length > 0 && (
          <section aria-label="Tags">
            <LedgerRule
              label={`${view.query ? 'MATCHES' : 'HEADINGS'} · ${pad(
                view.shared.length,
              )} FILED`}
              className="mb-2"
            />
            <ul className="list-none m-0 p-0 columns-1 sm:columns-2 lg:columns-3 gap-x-6">
              {view.shared.map((tag) => {
                const size = view.sizeFor(tag.shown);
                return (
                  <li key={tag.slug} className="break-inside-avoid mb-[2px]">
                    <Link
                      to={view.hrefFor(tag)}
                      className="ldg-row-link"
                      style={{ gap: '0.6ch', padding: '0.4rem 0.5rem' }}
                    >
                      <span className={`truncate min-w-0 ${NAME_INK[size]}`}>
                        {tag.label}
                      </span>
                      <span className="ldg-leader" aria-hidden="true" />
                      <span
                        className={`shrink-0 ${
                          size >= 3 ? 'ldg-accent font-bold' : 'ldg-muted'
                        }`}
                        style={{
                          fontSize: '0.78rem',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        <span className="sr-only">, </span>
                        {pad(tag.shown)}
                        <span className="sr-only"> entries</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {view.single.length > 0 && (
          <details className="mt-10">
            <summary className="ldg-summary">
              Used once ({view.single.length})
            </summary>
            <ul className="list-none m-0 p-0 mt-3 flex flex-wrap gap-1.5">
              {view.single.map((tag) => (
                <li key={tag.slug}>
                  <Link
                    to={tagPath(tag.slug)}
                    className="ldg-chip no-underline inline-block"
                  >
                    {tag.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}

        {ready && shown > 0 && (
          <footer className="mt-12">
            <LedgerRule className="mb-4" />
            <span className="ldg-label">
              INDEX · {pad(view.totalTags)} HEADINGS ON RECORD ·{' '}
              {view.sort === 'az' ? 'SORTED A→Z' : 'HEAVIEST FIRST'}
            </span>
          </footer>
        )}
      </div>
    </div>
  );
};

export default LedgerTagsPage;
