import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import piml from 'piml';
import Seo from '../../components/Seo';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';
import { OrbitNotice, OrbitRule } from '../../components/orbit';
import '../../styles/Orbit.css';

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
    <div className="orb-meta-row">
      <dt className="orb-meta-label">{label}</dt>
      <dd className="orb-meta-value">{children}</dd>
    </div>
  ) : null;

const OrbitLogDetailPage = () => {
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
      <div className="orb-root">
        <div className="orb-page">
          <OrbitNotice>RETRIEVING THE ENTRY…</OrbitNotice>
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="orb-root">
        <div className="orb-page">
          <OrbitNotice error>
            404 — NO SUCH ENTRY IN THIS COLLECTION
          </OrbitNotice>
          <div className="mt-4 text-center">
            <Link to="/logs" className="orb-btn no-underline">
              ← BACK TO DISCOVERY LOGS
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
    <div className="orb-root">
      <Seo
        title={`${attributes.title} | Fezcodex`}
        description={(body || attributes.description || '').substring(0, 160)}
        image={attributes.image}
      />

      <div className="orb-page" style={{ maxWidth: 900 }}>
        <Link
          to="/logs"
          className="orb-label inline-block mb-6 no-underline font-bold hover:text-[var(--orb-accent)]"
        >
          [← DISCOVERY LOGS]
        </Link>

        <header
          className="pb-4"
          style={{ borderBottom: '1px solid var(--orb-rule)' }}
        >
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <span className="orb-badge">{category}</span>
            {attributes.updated && (
              <span className="orb-label">
                REVISED {longDate(attributes.updated)}
              </span>
            )}
            <span className="orb-label ml-auto">
              SAVED {longDate(attributes.date)}
            </span>
          </div>
          <h1 className="orb-title" style={{ fontSize: '1.6rem' }}>
            {attributes.title}
          </h1>
          {creator && (
            <p className="orb-label mt-1">BY {String(creator).toUpperCase()}</p>
          )}
          {rating > 0 && (
            <p className="mt-3" style={{ fontSize: '0.85rem' }}>
              <span className="orb-accent" aria-label={`Rated ${rating} of 5`}>
                {starLine(rating)}
              </span>{' '}
              <span className="orb-muted">{rating}/5 — HOW MUCH HELD UP</span>
            </p>
          )}
        </header>

        {/* the figures */}
        <dl className="orb-meta mt-6">
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
                className="orb-accent"
              >
                {attributes.link} ↗
              </a>
            </MetaRow>
          )}
        </dl>

        {/* the account */}
        <section className="mt-8">
          <OrbitRule label="THE DISCOVERY" className="mb-4" />
          <div className="orb-prose">
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
            <OrbitRule label="CROSS-REFERENCED UNDER" className="mb-3" />
            <div className="flex flex-wrap gap-1.5">
              {attributes.tags.map((t) => (
                <span
                  key={t}
                  className="orb-chip"
                  style={{ cursor: 'default' }}
                >
                  #{String(t).toUpperCase()}
                </span>
              ))}
            </div>
          </section>
        )}

        {(prev || next) && (
          <nav
            className="mt-10 pt-4 flex justify-between gap-4"
            style={{ borderTop: '1px solid var(--orb-rule)' }}
            aria-label="Adjacent entries"
          >
            {prev ? (
              <Link
                to={`/logs/${category}/${prev.slug}`}
                className="orb-label font-bold no-underline hover:text-[var(--orb-accent)]"
              >
                ← PREV ENTRY — {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/logs/${category}/${next.slug}`}
                className="orb-label font-bold no-underline text-right ml-auto hover:text-[var(--orb-accent)]"
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

export default OrbitLogDetailPage;
