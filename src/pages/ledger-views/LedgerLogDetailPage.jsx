import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import piml from 'piml';
import Seo from '../../components/Seo';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';
import { LedgerNotice, LedgerRule } from '../../components/ledger';
import '../../styles/Ledger.css';

const longDate = (d) => {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date
    .toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .toUpperCase();
};

const starLine = (rating) => '★'.repeat(rating) + '·'.repeat(5 - rating);

const MetaRow = ({ label, children }) =>
  children ? (
    <div className="ldg-meta-row">
      <dt className="ldg-meta-label">{label}</dt>
      <dd className="ldg-meta-value">{children}</dd>
    </div>
  ) : null;

/**
 * Ledger theme log detail — one daybook entry read in full. The head states
 * the classification, the meta block records the figures label-by-label with
 * a 16ch gutter, the body runs as ruled prose, and the pager walks the same
 * category without going back up — the /demystify pager idiom.
 */
const LedgerLogDetailPage = () => {
  const { category, slugId } = useParams();
  const [log, setLog] = useState(null);
  const [neighbours, setNeighbours] = useState({ prev: null, next: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/logs/${category}/${category}.piml`);
        if (!res.ok) {
          if (!cancelled) setLog(null);
          return;
        }
        const txt = await res.text();
        const data = piml.parse(txt);
        const all = (data.logs || [])
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        const idx = all.findIndex((l) => l.slug === slugId);
        if (idx === -1) {
          if (!cancelled) setLog(null);
          return;
        }
        const meta = all[idx];
        let body = meta.description || '';
        try {
          const r = await fetch(`/logs/${category}/${slugId}.txt`);
          if (r.ok) body = await r.text();
        } catch (e) {
          // ignore
        }
        if (!cancelled) {
          setLog({ attributes: meta, body });
          setNeighbours({
            prev: all[idx + 1] || null,
            next: all[idx - 1] || null,
          });
        }
      } catch (e) {
        if (!cancelled) setLog(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category, slugId]);

  if (loading) {
    return (
      <div className="ldg-root">
        <div className="ldg-page">
          <LedgerNotice>RETRIEVING THE ENTRY…</LedgerNotice>
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="ldg-root">
        <div className="ldg-page">
          <LedgerNotice error>
            404 — NO SUCH ENTRY IN THIS REGISTER
          </LedgerNotice>
          <div className="mt-4 text-center">
            <Link to="/logs" className="ldg-btn no-underline">
              ← BACK TO THE DAYBOOK
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { attributes, body } = log;
  const creator =
    attributes.author ||
    attributes.director ||
    attributes.artist ||
    attributes.creator ||
    attributes.by ||
    attributes.studio;
  const rating = Number(attributes.rating) || 0;
  const { prev, next } = neighbours;

  return (
    <div className="ldg-root">
      <Seo
        title={`${attributes.title} | Fezcodex`}
        description={(body || attributes.description || '').substring(0, 160)}
        image={attributes.image}
      />

      <div className="ldg-page" style={{ maxWidth: 900 }}>
        <Link
          to="/logs"
          className="ldg-label inline-block mb-6 no-underline font-bold hover:text-[var(--ldg-accent)]"
        >
          [← THE DAYBOOK]
        </Link>

        <header className="pb-4" style={{ borderBottom: '1px solid var(--ldg-rule)' }}>
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <span className="ldg-badge">{category}</span>
            {attributes.updated && (
              <span className="ldg-label">
                REVISED {longDate(attributes.updated)}
              </span>
            )}
            <span className="ldg-label ml-auto">
              FILED {longDate(attributes.date)}
            </span>
          </div>
          <h1 className="ldg-title" style={{ fontSize: '1.6rem' }}>
            {attributes.title}
          </h1>
          {creator && (
            <p className="ldg-label mt-1">BY {String(creator).toUpperCase()}</p>
          )}
          {rating > 0 && (
            <p className="mt-3" style={{ fontSize: '0.85rem' }}>
              <span className="ldg-accent" aria-label={`Rated ${rating} of 5`}>
                {starLine(rating)}
              </span>{' '}
              <span className="ldg-muted">{rating}/5 — HOW MUCH HELD UP</span>
            </p>
          )}
        </header>

        {/* the figures */}
        <dl className="ldg-meta mt-6">
          <MetaRow label="CATEGORY">
            {(attributes.category || category || '').toUpperCase()}
          </MetaRow>
          <MetaRow label="CREATOR">{creator}</MetaRow>
          <MetaRow label="PLATFORM">{attributes.platform}</MetaRow>
          {!attributes.platform && (
            <MetaRow label="SOURCE">{attributes.source}</MetaRow>
          )}
          <MetaRow label="YEAR">{attributes.year}</MetaRow>
          <MetaRow label="ENTRY">{attributes.slug || slugId}</MetaRow>
          {attributes.link && (
            <MetaRow label="WHERE FOUND">
              <a
                href={attributes.link}
                target="_blank"
                rel="noopener noreferrer"
                className="ldg-accent"
              >
                {attributes.link} ↗
              </a>
            </MetaRow>
          )}
        </dl>

        {/* the account */}
        <section className="mt-8">
          <LedgerRule label="THE ACCOUNT" className="mb-4" />
          <div className="ldg-prose">
            <MarkdownContent
              content={body}
              components={{
                a: (p) => <MarkdownLink {...p} />,
              }}
            />
          </div>
        </section>

        {attributes.tags && attributes.tags.length > 0 && (
          <section className="mt-8">
            <LedgerRule label="CROSS-REFERENCED UNDER" className="mb-3" />
            <div className="flex flex-wrap gap-1.5">
              {attributes.tags.map((t) => (
                <span key={t} className="ldg-chip" style={{ cursor: 'default' }}>
                  #{String(t).toUpperCase()}
                </span>
              ))}
            </div>
          </section>
        )}

        {(prev || next) && (
          <nav
            className="mt-10 pt-4 flex justify-between gap-4"
            style={{ borderTop: '1px solid var(--ldg-rule)' }}
            aria-label="Adjacent entries"
          >
            {prev ? (
              <Link
                to={`/logs/${category}/${prev.slug}`}
                className="ldg-label font-bold no-underline hover:text-[var(--ldg-accent)]"
              >
                ← PREV ENTRY — {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/logs/${category}/${next.slug}`}
                className="ldg-label font-bold no-underline text-right ml-auto hover:text-[var(--ldg-accent)]"
              >
                NEXT ENTRY — {next.title} →
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
};

export default LedgerLogDetailPage;
