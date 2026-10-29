import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import piml from 'piml';
import Seo from '../../components/Seo';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';
import {
  MarquetryText,
  MarquetryIcon,
  MarquetryBand,
  MarquetryNotice,
  WOOD,
} from '../../components/marquetry';
import { heartLine } from './MarquetryLogsPage';
import '../../styles/Marquetry.css';

const longDate = (d) => {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const MetaRow = ({ label, children }) =>
  children ? (
    <div className="mqt-meta-row">
      <dt className="mqt-label">{label}</dt>
      <dd>{children}</dd>
    </div>
  ) : null;

const MarquetryLogDetailPage = () => {
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
      <div className="mqt-root">
        <div className="mqt-page">
          <MarquetryNotice>Finding the entry…</MarquetryNotice>
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="mqt-root">
        <div className="mqt-page">
          <MarquetryNotice error>
            404 — no such entry in this collection.
          </MarquetryNotice>
          <Link to="/logs" className="mqt-btn mt-4">
            <MarquetryIcon name="arrowLeft" fg={WOOD.teal} />
            <MarquetryText
              text="Back to discovery logs"
              size="small"
              fg={WOOD.ink}
              fit
            />
          </Link>
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
    <div className="mqt-root">
      <Seo
        title={`${attributes.title} | Fezcodex`}
        description={(body || attributes.description || '').substring(0, 160)}
        image={attributes.image}
      />
      <header className="mqt-wood-denim">
        <MarquetryBand
          pattern={['peerie', ['snow', { bg: '#3d5a80' }], 'peerie']}
        />
        <div className="mqt-page mqt-reader !pb-8">
          <Link to="/logs" className="mqt-btn">
            <MarquetryIcon name="arrowLeft" fg={WOOD.teal} />
            <MarquetryText
              text="Discovery logs"
              size="small"
              fg={WOOD.ink}
              fit
            />
          </Link>
          <MarquetryText
            text={`${category} · saved ${longDate(attributes.date)}${attributes.updated ? ` · revised ${longDate(attributes.updated)}` : ''}`}
            size="small"
            fg={WOOD.bark}
            className="mt-8"
          />
          <MarquetryText
            as="h1"
            text={attributes.title}
            fg={WOOD.ink}
            className="mt-4"
          />
          {creator && (
            <MarquetryText
              text={`by ${creator}`}
              size="small"
              fg={WOOD.teal}
              className="mt-3"
            />
          )}
          {rating > 0 && (
            <div className="flex items-center gap-3 mt-4">
              <span aria-label={`Rated ${rating} of 5`}>
                <MarquetryText
                  text={heartLine(rating)}
                  size="small"
                  fg={WOOD.poppy}
                  fit
                  aria-hidden="true"
                />
              </span>
              <span className="mqt-label">{rating}/5 — how much held up</span>
            </div>
          )}
        </div>
        <MarquetryBand pattern="peerie" />
      </header>

      <div className="mqt-page">
        <article className="mqt-reader">
          <dl className="mqt-patch mqt-patch-tight mqt-meta">
            <MetaRow label="Category">
              {attributes.category || category}
            </MetaRow>
            <MetaRow label="Creator">{creator}</MetaRow>
            <MetaRow label="Platform">{attributes.platform}</MetaRow>
            {!attributes.platform && (
              <MetaRow label="Source">{attributes.source}</MetaRow>
            )}
            <MetaRow label="Year">{attributes.year}</MetaRow>
            <MetaRow label="Entry">{attributes.slug || slugId}</MetaRow>
            {attributes.link && (
              <MetaRow label="Where found">
                <a
                  href={attributes.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mqt-link break-all"
                >
                  {attributes.link} ↗
                </a>
              </MetaRow>
            )}
          </dl>

          <section className="mt-8">
            <MarquetryText
              as="h2"
              text="The discovery"
              fg={WOOD.teal}
              className="mb-4"
            />
            <div className="mqt-patch mqt-reader-patch">
              <MarkdownContent
                content={body}
                className="mqt-prose"
                components={{
                  a: (p) => <MarkdownLink {...p} />,
                }}
              />
            </div>
          </section>

          {attributes.tags && attributes.tags.length > 0 && (
            <section className="mt-8">
              <MarquetryText
                text="Cross-referenced under"
                size="small"
                fg={WOOD.bark}
                className="mb-3"
              />
              <div className="flex flex-wrap gap-2">
                {attributes.tags.map((t) => (
                  <span key={t} className="mqt-tag">
                    #{t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {(prev || next) && (
            <nav
              className="grid gap-3 sm:grid-cols-2 mt-10"
              aria-label="Adjacent entries"
            >
              {prev ? (
                <Link to={`/logs/${category}/${prev.slug}`} className="mqt-row">
                  <MarquetryIcon name="arrowLeft" fg={WOOD.teal} />
                  <div className="mqt-row-body">
                    <MarquetryText
                      text="Previous entry"
                      size="small"
                      fg={WOOD.bark}
                    />
                    <MarquetryText
                      text={prev.title}
                      fg={WOOD.ink}
                      maxLines={2}
                      className="mt-2"
                    />
                  </div>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link to={`/logs/${category}/${next.slug}`} className="mqt-row">
                  <div className="mqt-row-body">
                    <MarquetryText
                      text="Next entry"
                      size="small"
                      fg={WOOD.bark}
                    />
                    <MarquetryText
                      text={next.title}
                      fg={WOOD.ink}
                      maxLines={2}
                      className="mt-2"
                    />
                  </div>
                  <MarquetryIcon name="arrowRight" fg={WOOD.teal} />
                </Link>
              )}
            </nav>
          )}
        </article>
      </div>
    </div>
  );
};

export default MarquetryLogDetailPage;
