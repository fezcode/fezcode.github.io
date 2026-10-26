import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import piml from 'piml';
import Seo from '../../components/Seo';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';
import {
  KnitText,
  KnitIcon,
  KnitBand,
  KnitNotice,
  YARN,
} from '../../components/knit';
import { heartLine } from './KnitLogsPage';
import '../../styles/Knit.css';

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
    <div className="knt-meta-row">
      <dt className="knt-label">{label}</dt>
      <dd>{children}</dd>
    </div>
  ) : null;

const KnitLogDetailPage = () => {
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
      <div className="knt-root">
        <div className="knt-page">
          <KnitNotice>Finding the entry…</KnitNotice>
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="knt-root">
        <div className="knt-page">
          <KnitNotice error>404 — no such entry in this collection.</KnitNotice>
          <Link to="/logs" className="knt-btn mt-4">
            <KnitIcon name="arrowLeft" fg={YARN.gold} />
            <KnitText text="Back to discovery logs" size="small" fg={YARN.cream} fit />
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
    <div className="knt-root">
      <Seo
        title={`${attributes.title} | Fezcodex`}
        description={(body || attributes.description || '').substring(0, 160)}
        image={attributes.image}
      />
      <header className="knt-wool-denim">
        <KnitBand
          pattern={['peerie', ['snow', { bg: '#3d5a80' }], 'peerie']}
        />
        <div className="knt-page knt-reader !pb-8">
          <Link to="/logs" className="knt-btn">
            <KnitIcon name="arrowLeft" fg={YARN.gold} />
            <KnitText text="Discovery logs" size="small" fg={YARN.cream} fit />
          </Link>
          <KnitText
            text={`${category} · saved ${longDate(attributes.date)}${attributes.updated ? ` · revised ${longDate(attributes.updated)}` : ''}`}
            size="small"
            fg={YARN.wheat}
            className="mt-8"
          />
          <KnitText as="h1" text={attributes.title} fg={YARN.cream} className="mt-4" />
          {creator && (
            <KnitText
              text={`by ${creator}`}
              size="small"
              fg={YARN.gold}
              className="mt-3"
            />
          )}
          {rating > 0 && (
            <div className="flex items-center gap-3 mt-4">
              <span aria-label={`Rated ${rating} of 5`}>
                <KnitText
                  text={heartLine(rating)}
                  size="small"
                  fg={YARN.poppy}
                  fit
                  aria-hidden="true"
                />
              </span>
              <span className="knt-label">{rating}/5 — how much held up</span>
            </div>
          )}
        </div>
        <KnitBand pattern="peerie" />
      </header>

      <div className="knt-page">
        <article className="knt-reader">
          <dl className="knt-patch knt-patch-tight knt-meta">
            <MetaRow label="Category">{attributes.category || category}</MetaRow>
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
                  className="knt-link break-all"
                >
                  {attributes.link} ↗
                </a>
              </MetaRow>
            )}
          </dl>

          <section className="mt-8">
            <KnitText as="h2" text="The discovery" fg={YARN.gold} className="mb-4" />
            <div className="knt-patch knt-reader-patch">
              <MarkdownContent
                content={body}
                className="knt-prose"
                components={{
                  a: (p) => <MarkdownLink {...p} />,
                }}
              />
            </div>
          </section>

          {attributes.tags && attributes.tags.length > 0 && (
            <section className="mt-8">
              <KnitText
                text="Cross-referenced under"
                size="small"
                fg={YARN.wheat}
                className="mb-3"
              />
              <div className="flex flex-wrap gap-2">
                {attributes.tags.map((t) => (
                  <span key={t} className="knt-tag">
                    #{t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {(prev || next) && (
            <nav className="grid gap-3 sm:grid-cols-2 mt-10" aria-label="Adjacent entries">
              {prev ? (
                <Link to={`/logs/${category}/${prev.slug}`} className="knt-row">
                  <KnitIcon name="arrowLeft" fg={YARN.gold} />
                  <div className="knt-row-body">
                    <KnitText text="Previous entry" size="small" fg={YARN.wheat} />
                    <KnitText text={prev.title} fg={YARN.cream} maxLines={2} className="mt-2" />
                  </div>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link to={`/logs/${category}/${next.slug}`} className="knt-row">
                  <div className="knt-row-body">
                    <KnitText text="Next entry" size="small" fg={YARN.wheat} />
                    <KnitText text={next.title} fg={YARN.cream} maxLines={2} className="mt-2" />
                  </div>
                  <KnitIcon name="arrowRight" fg={YARN.gold} />
                </Link>
              )}
            </nav>
          )}
        </article>
      </div>
    </div>
  );
};

export default KnitLogDetailPage;
