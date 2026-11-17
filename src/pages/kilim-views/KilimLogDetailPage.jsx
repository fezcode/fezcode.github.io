import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import piml from 'piml';
import Seo from '../../components/Seo';
import TagLink from '../../components/TagLink';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';
import {
  KilimText,
  KilimIcon,
  KilimNotice,
  WOOL,
} from '../../components/kilim';
import { RatingPips, logDye } from './KilimLogsPage';
import '../../styles/Kilim.css';
import './kilim-logs.css';

const longDate = (d) => {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/** One line of the care label; skipped when there is nothing to say. */
const CareRow = ({ label, children }) =>
  children ? (
    <div className="klm-logs-care-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  ) : null;

const BackLink = () => (
  <Link to="/logs" className="klm-btn klm-btn-small">
    <KilimIcon name="arrowLeft" fg={WOOL.walnut} />
    Discovery logs
  </Link>
);

/**
 * Kilim /logs/:category/:slug: a single woven label sewn onto a runner dyed
 * in the log's category. The metadata hangs beside the prose as a care
 * label; the neighbouring entries are the runner's two fringed ends.
 */
const KilimLogDetailPage = () => {
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
      <div className="klm-root">
        <div className="klm-page">
          <KilimNotice>Finding the runner…</KilimNotice>
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="klm-root">
        <div className="klm-page">
          <KilimNotice error>404: no such entry in this collection.</KilimNotice>
          <div className="mt-4">
            <BackLink />
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
    <div
      className="klm-root klm-logs-detail"
      style={{ '--dye': logDye(attributes.category || category) }}
    >
      <Seo
        title={`${attributes.title} | Fezcodex`}
        description={(body || attributes.description || '').substring(0, 160)}
        image={attributes.image}
      />
      <div className="klm-page">
        <BackLink />

        {/* ---- the runner, with the label sewn on ---- */}
        <header className="klm-logs-sewn">
          <div className="klm-logs-label">
            <p className="klm-logs-label-eyebrow">
              {category} · saved {longDate(attributes.date)}
              {attributes.updated
                ? ` · revised ${longDate(attributes.updated)}`
                : ''}
            </p>
            <KilimText
              as="h1"
              text={attributes.title}
              fg={WOOL.madder}
              maxLines={3}
              className="mt-3"
            />
            {creator && <p className="klm-logs-label-by">by {creator}</p>}
            {rating > 0 && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <RatingPips rating={rating} className="klm-logs-pips-ink" />
                <span className="klm-logs-label-note">
                  {rating}/5, how much held up
                </span>
              </div>
            )}
          </div>
        </header>

        <div className="klm-logs-detail-grid">
          {/* ---- the care label ---- */}
          <aside className="klm-logs-care" aria-label="Entry details">
            <span className="klm-logs-care-hole" aria-hidden="true" />
            <p className="klm-logs-care-head">Care label</p>
            <dl>
              <CareRow label="Lot">{attributes.category || category}</CareRow>
              <CareRow label="Maker">{creator}</CareRow>
              <CareRow label="Platform">{attributes.platform}</CareRow>
              {!attributes.platform && (
                <CareRow label="Source">{attributes.source}</CareRow>
              )}
              <CareRow label="Year">{attributes.year}</CareRow>
              <CareRow label="Entry">{attributes.slug || slugId}</CareRow>
              {attributes.link && (
                <CareRow label="Where found">
                  <a
                    href={attributes.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="klm-logs-care-link"
                  >
                    {attributes.link} ↗
                  </a>
                </CareRow>
              )}
            </dl>
            {tags.length > 0 && (
              <div className="klm-logs-care-tags">
                <p className="klm-logs-care-sub">Woven under</p>
                <div className="klm-tags">
                  {tags.map((t) => (
                    <TagLink key={t} tag={t} className="klm-tag klm-logs-tag">
                      #{t}
                    </TagLink>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* ---- the prose ---- */}
          <article className="klm-logs-detail-body">
            <KilimText
              as="h2"
              text="The discovery"
              fg={WOOL.saffron}
              className="mb-4"
            />
            <MarkdownContent
              content={body}
              className="klm-prose"
              components={{
                a: (p) => <MarkdownLink {...p} />,
              }}
            />
          </article>
        </div>

        {/* ---- the runner's two ends ---- */}
        {(prev || next) && (
          <nav className="klm-logs-ends" aria-label="Adjacent entries">
            {prev ? (
              <Link
                to={`/logs/${category}/${prev.slug}`}
                className="klm-logs-runner klm-logs-neighbour"
              >
                <span className="klm-logs-end" aria-hidden="true" />
                <span className="klm-row-arrow" aria-hidden="true">
                  ←
                </span>
                <span className="klm-logs-runner-body">
                  <span className="klm-logs-runner-cat">Previous entry</span>
                  <span className="klm-logs-runner-title">{prev.title}</span>
                </span>
                <span
                  className="klm-logs-end klm-logs-end-r"
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/logs/${category}/${next.slug}`}
                className="klm-logs-runner klm-logs-neighbour klm-logs-neighbour-next"
              >
                <span className="klm-logs-end" aria-hidden="true" />
                <span className="klm-logs-runner-body">
                  <span className="klm-logs-runner-cat">Next entry</span>
                  <span className="klm-logs-runner-title">{next.title}</span>
                </span>
                <span className="klm-row-arrow" aria-hidden="true">
                  →
                </span>
                <span
                  className="klm-logs-end klm-logs-end-r"
                  aria-hidden="true"
                />
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
};

export default KilimLogDetailPage;
