import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { StudioNotice } from '../../components/studio';
import { tagPath } from '../../utils/tagIndex';
import { formatDate } from '../tags/tagTypes';
import '../../styles/Studio.css';

export default function StudioTagPage({ view }) {
  return (
    <div className="std-root">
      <div className="std-page">
        <Link className="std-chip mb-6" to="/tags">
          All topics
        </Link>
        {view.status === 'loading' ? (
          <StudioNotice>Loading this topic…</StudioNotice>
        ) : view.status === 'error' ? (
          <StudioNotice error>{view.error}</StudioNotice>
        ) : view.status === 'missing' ? (
          <StudioNotice>
            No entries are filed under “{view.rawTag}”. Try another topic.
          </StudioNotice>
        ) : (
          <>
            <Seo
              title={`${view.title} | Topics | Fezcodex`}
              description={
                view.meta?.description ||
                `Writing, discoveries and projects about ${view.title}.`
              }
              canonicalPath={tagPath(view.slug)}
            />
            <header className="std-topic-hero">
              <h1 className="std-title">{view.title}</h1>
              {view.meta?.description && (
                <p className="std-intro">{view.meta.description}</p>
              )}
            </header>
            {view.extra.length > 0 && (
              <div className="std-actions my-6" aria-label="Active tag filters">
                {view.active.map((tag) => (
                  <Link
                    className="std-chip"
                    key={tag}
                    to={view.removeHref(tag)}
                    aria-label={`Remove ${view.labelOf(tag)}`}
                  >
                    {view.labelOf(tag)} ×
                  </Link>
                ))}
              </div>
            )}
            <div
              className="std-actions my-6"
              role="group"
              aria-label="Content type"
            >
              {view.types.map((type) => (
                <button
                  className="std-chip"
                  type="button"
                  key={type.key}
                  aria-pressed={view.type === type.key}
                  onClick={() => view.setType(type.key)}
                >
                  {type.label} ({view.typeCounts[type.key]})
                </button>
              ))}
            </div>
            {view.related.length > 0 && (
              <section className="std-related">
                <h2>Make a connection.</h2>
                <p>Narrow this collection with another topic.</p>
                <div className="std-actions">
                  {view.related.map(([tag, count]) => (
                    <Link className="std-chip" to={view.addHref(tag)} key={tag}>
                      {view.labelOf(tag)} <span>({count})</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            <p className="std-meta my-6" role="status">
              {view.items.length}{' '}
              {view.items.length === 1 ? 'entry' : 'entries'}
            </p>
            {view.items.length ? (
              <div className="std-writing-grid">
                {view.items.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className="std-writing-card"
                  >
                    <span className="std-meta">
                      {item.type} / {formatDate(item.date)}
                    </span>
                    <h2>{item.title}</h2>
                    {item.description && <p>{item.description}</p>}
                    <span className="std-text-link">Explore</span>
                  </Link>
                ))}
              </div>
            ) : (
              <StudioNotice>
                No entries match all of these filters. Remove a topic or choose
                another content type.
              </StudioNotice>
            )}
          </>
        )}
      </div>
    </div>
  );
}
