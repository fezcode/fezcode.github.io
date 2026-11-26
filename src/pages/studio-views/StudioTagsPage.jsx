import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { StudioNotice } from '../../components/studio';
import '../../styles/Studio.css';

export default function StudioTagsPage({ view }) {
  const tags = [...view.shared, ...view.single];
  return (
    <div className="std-root">
      <div className="std-page">
        <Seo
          title="Topics | Fezcodex"
          description="Follow a thread through the writing, projects and discoveries."
          canonicalPath="/tags"
        />
        <header className="std-topic-hero">
          <h1 className="std-title">Follow your curiosity.</h1>
          <p className="std-intro">
            A thought in one corner leads to something in another. Explore the
            topics that connect this codex.
          </p>
        </header>
        <input
          type="search"
          className="std-input mt-6"
          value={view.query}
          onChange={(event) => view.setQuery(event.target.value)}
          placeholder="Find a topic…"
          aria-label="Search tags"
        />
        <div className="std-section-head my-6">
          <div className="std-actions" role="group" aria-label="Content type">
            {view.types.map((type) => (
              <button
                type="button"
                key={type.key}
                className="std-chip"
                aria-pressed={view.type === type.key}
                onClick={() => view.setType(type.key)}
              >
                {type.label}
              </button>
            ))}
          </div>
          <label className="std-actions">
            Sort topics
            <select
              className="std-input !w-auto"
              value={view.sort}
              onChange={(event) => view.setSort(event.target.value)}
            >
              <option value="count">Most used</option>
              <option value="az">A–Z</option>
            </select>
          </label>
        </div>
        {view.status === 'loading' ? (
          <StudioNotice>Loading topics…</StudioNotice>
        ) : view.status === 'error' ? (
          <StudioNotice error>{view.error}</StudioNotice>
        ) : (
          <>
            <p className="std-meta mb-5" role="status">
              {tags.length} topics
            </p>
            {tags.length ? (
              <div className="std-topics">
                {tags.map((tag) => (
                  <Link
                    className="std-topic"
                    key={tag.slug}
                    to={view.hrefFor(tag)}
                  >
                    <h2>{tag.label}</h2>
                    <span>
                      {tag.shown} {tag.shown === 1 ? 'entry' : 'entries'}
                    </span>
                    {tag.description && <p>{tag.description}</p>}
                  </Link>
                ))}
              </div>
            ) : (
              <StudioNotice>
                No topics match this search.{' '}
                <button
                  type="button"
                  className="std-link"
                  onClick={() => view.setQuery('')}
                >
                  Clear search
                </button>
              </StudioNotice>
            )}
          </>
        )}
      </div>
    </div>
  );
}
