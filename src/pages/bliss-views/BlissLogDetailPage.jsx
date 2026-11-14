import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import piml from 'piml';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowSquareOutIcon,
  ArticleIcon,
  ArrowsLeftRightIcon,
  TagIcon,
  WarningIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import MarkdownContent from '../../components/MarkdownContent';
import MarkdownLink from '../../components/MarkdownLink';
import {
  BlissWindow,
  BlissIcon,
  BlissNotice,
  BlissStars,
  BlissTitleLink,
} from '../../components/bliss';
import { getCategoryColor } from '../../utils/categoryColors';
import { logCategoryIcon } from './BlissLogsPage';
import '../../styles/Bliss.css';

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
    <div className="grid grid-cols-[8rem_1fr] gap-3 py-1 border-b border-dotted border-[#c9c4ad] last:border-b-0">
      <dt className="bl-label">{label}</dt>
      <dd className="m-0 min-w-0">{children}</dd>
    </div>
  ) : null;

const BlissLogDetailPage = () => {
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
      <div className="bl-root">
        <div className="bl-page">
          <BlissNotice>Finding the entry…</BlissNotice>
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="bl-root">
        <div className="bl-page">
          <BlissWindow
            title="Entry not found"
            icon={WarningIcon}
            tone="red"
            headingLevel={1}
          >
            <BlissNotice error>404 — no such entry in this collection.</BlissNotice>
            <Link to="/logs" className="bl-btn mt-4">
              <ArrowLeftIcon size={16} weight="bold" aria-hidden="true" />
              Back to discovery logs
            </Link>
          </BlissWindow>
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
  const categoryName = attributes.category || category;
  const { icon: categoryIcon, tone: categoryTone } = logCategoryIcon(category);

  return (
    <div className="bl-root">
      <Seo
        title={`${attributes.title} | Fezcodex`}
        description={(body || attributes.description || '').substring(0, 160)}
        image={attributes.image}
      />
      <div className="bl-page">
        <BlissWindow
          as="header"
          title={attributes.title}
          icon={categoryIcon}
          tone={categoryTone}
          headingLevel={1}
          actions={<BlissTitleLink to="/logs">← Discovery logs</BlissTitleLink>}
        >
          <div className="flex flex-wrap items-start gap-4">
            <BlissIcon
              icon={categoryIcon}
              tone={categoryTone}
              seed={category}
              size={56}
            />
            <div className="min-w-0 flex-1">
              <p className="bl-eyebrow m-0">
                {category} · saved {longDate(attributes.date)}
                {attributes.updated
                  ? ` · revised ${longDate(attributes.updated)}`
                  : ''}
              </p>
              <p className="bl-display mt-1 mb-0" aria-hidden="true">
                {attributes.title}
              </p>
              {creator && <p className="mt-2 mb-0 font-semibold">by {creator}</p>}
            </div>
          </div>

          <div className="bl-groupbox mt-5">
            <span className="bl-groupbox-label">Details</span>
            <dl className="m-0">
              <MetaRow label="Category">
                <span
                  className="font-semibold capitalize"
                  style={{ color: getCategoryColor('bliss', categoryName) }}
                >
                  {categoryName}
                </span>
              </MetaRow>
              <MetaRow label="Creator">{creator}</MetaRow>
              <MetaRow label="Platform">{attributes.platform}</MetaRow>
              {!attributes.platform && (
                <MetaRow label="Source">{attributes.source}</MetaRow>
              )}
              <MetaRow label="Year">{attributes.year}</MetaRow>
              <MetaRow label="Rating">
                {rating > 0 ? (
                  <span className="inline-flex flex-wrap items-center gap-3">
                    <BlissStars value={rating} />
                    <span className="bl-label">
                      {rating}/5 — how much held up
                    </span>
                  </span>
                ) : null}
              </MetaRow>
              <MetaRow label="Entry">{attributes.slug || slugId}</MetaRow>
              {attributes.link && (
                <MetaRow label="Where found">
                  <a
                    href={attributes.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bl-link break-all"
                  >
                    {attributes.link}
                    <ArrowSquareOutIcon size={14} aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </MetaRow>
              )}
            </dl>
          </div>
        </BlissWindow>

        <BlissWindow
          as="article"
          title="The discovery"
          icon={ArticleIcon}
          tone="blue"
          status={
            <>
              <span>{categoryName}</span>
              <span>{longDate(attributes.updated || attributes.date)}</span>
            </>
          }
        >
          <MarkdownContent
            content={body}
            className="bl-paper bl-prose"
            components={{
              a: (p) => <MarkdownLink {...p} />,
            }}
          />
        </BlissWindow>

        {attributes.tags && attributes.tags.length > 0 && (
          <BlissWindow
            title="Cross-referenced under"
            icon={TagIcon}
            tone="teal"
            inactive
          >
            <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
              {attributes.tags.map((t) => (
                <li key={t} className="bl-tag cursor-default">
                  #{t}
                </li>
              ))}
            </ul>
          </BlissWindow>
        )}

        {(prev || next) && (
          <BlissWindow
            as="nav"
            aria-label="Adjacent entries"
            title="Adjacent entries"
            icon={ArrowsLeftRightIcon}
            tone="green"
            inactive
            flush
          >
            <div className="grid sm:grid-cols-2 bg-white">
              {prev ? (
                <Link to={`/logs/${category}/${prev.slug}`} className="bl-row">
                  <ArrowLeftIcon size={18} weight="bold" aria-hidden="true" />
                  <span className="bl-row-body">
                    <span className="bl-meta">Previous entry</span>
                    <span className="bl-row-title line-clamp-2">
                      {prev.title}
                    </span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  to={`/logs/${category}/${next.slug}`}
                  className="bl-row sm:justify-end sm:text-right"
                >
                  <span className="bl-row-body">
                    <span className="bl-meta">Next entry</span>
                    <span className="bl-row-title line-clamp-2">
                      {next.title}
                    </span>
                  </span>
                  <ArrowRightIcon size={18} weight="bold" aria-hidden="true" />
                </Link>
              )}
            </div>
          </BlissWindow>
        )}
      </div>
    </div>
  );
};

export default BlissLogDetailPage;
