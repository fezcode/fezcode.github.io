import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import piml from 'piml';
import Seo from '../../components/Seo';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';
import TagLink from '../../components/TagLink';
import { StudioNotice, StudioRule } from '../../components/studio';
import '../../styles/Studio.css';

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
    <div className="std-meta-row">
      <dt className="std-meta-label">{label}</dt>
      <dd className="std-meta-value">{children}</dd>
    </div>
  ) : null;

const StudioLogDetailPage = () => {
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
      <div className="std-root">
        <div className="std-page">
          <StudioNotice>RETRIEVING THE ENTRY…</StudioNotice>
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="std-root">
        <div className="std-page">
          <StudioNotice error>
            404 — NO SUCH ENTRY IN THIS COLLECTION
          </StudioNotice>
          <div className="mt-4 text-center">
            <Link to="/logs" className="std-btn no-underline">
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
  const tags = Array.isArray(attributes.tags)
    ? attributes.tags
    : attributes.tags
      ? [attributes.tags]
      : [];

  return (
    <div className="std-root">
      <Seo
        title={`${attributes.title} | Fezcodex`}
        description={(body || attributes.description || '').substring(0, 160)}
        image={attributes.image}
      />

      <div className="std-page" style={{ maxWidth: 900 }}>
        <Link
          to="/logs"
          className="std-label inline-block mb-6 no-underline font-bold hover:text-[var(--std-accent)]"
        >
          [← DISCOVERY LOGS]
        </Link>

        <header
          className="pb-4"
          style={{ borderBottom: '1px solid var(--std-rule)' }}
        >
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <span className="std-badge">{category}</span>
            {attributes.updated && (
              <span className="std-label">
                REVISED {longDate(attributes.updated)}
              </span>
            )}
            <span className="std-label ml-auto">
              SAVED {longDate(attributes.date)}
            </span>
          </div>
          <h1 className="std-title" style={{ fontSize: '1.6rem' }}>
            {attributes.title}
          </h1>
          {creator && (
            <p className="std-label mt-1">BY {String(creator).toUpperCase()}</p>
          )}
          {rating > 0 && (
            <p className="mt-3" style={{ fontSize: '0.85rem' }}>
              <span className="std-accent" aria-label={`Rated ${rating} of 5`}>
                {starLine(rating)}
              </span>{' '}
              <span className="std-muted">{rating}/5 — HOW MUCH HELD UP</span>
            </p>
          )}
        </header>

        {/* the figures */}
        <dl className="std-meta mt-6">
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
                className="std-accent"
              >
                {attributes.link} ↗
              </a>
            </MetaRow>
          )}
        </dl>

        {/* the account */}
        <section className="mt-8">
          <StudioRule label="THE DISCOVERY" className="mb-4" />
          <div className="std-prose">
            <MarkdownContent
              content={body}
              components={{
                a: (p) => <MarkdownLink {...p} />,
              }}
            />
          </div>
        </section>

        {tags.length > 0 && (
          <section className="mt-8">
            <StudioRule label="CROSS-REFERENCED UNDER" className="mb-3" />
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <TagLink key={t} tag={t} className="std-chip">
                  #{String(t).toUpperCase()}
                </TagLink>
              ))}
            </div>
          </section>
        )}

        {(prev || next) && (
          <nav
            className="mt-10 pt-4 flex justify-between gap-4"
            style={{ borderTop: '1px solid var(--std-rule)' }}
            aria-label="Adjacent entries"
          >
            {prev ? (
              <Link
                to={`/logs/${category}/${prev.slug}`}
                className="std-label font-bold no-underline hover:text-[var(--std-accent)]"
              >
                ← PREV ENTRY — {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/logs/${category}/${next.slug}`}
                className="std-label font-bold no-underline text-right ml-auto hover:text-[var(--std-accent)]"
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

export default StudioLogDetailPage;
