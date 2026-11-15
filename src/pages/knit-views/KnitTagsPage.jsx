import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import {
  KnitText,
  KnitIcon,
  KnitHero,
  KnitNotice,
  KnitBand,
  YARN,
} from '../../components/knit';
import { tagPath } from '../../utils/tagIndex';
import '../../styles/Knit.css';
import './knit-tags.css';

/** Knit /tags: every tag as a felt label, stitched on in stepped sizes. */
export default function KnitTagsPage({ view }) {
  const ready = view.status === 'ready';
  const nothing = ready && view.shared.length + view.single.length === 0;

  return (
    <div className="knt-root">
      <Seo
        title="Tags | Fezcodex"
        description="Every tag across Fezcodex posts, logs and projects."
        canonicalPath="/tags"
      />
      <KnitHero
        eyebrow="The labels sewn into everything"
        title="Tags"
        intro={
          ready
            ? `${view.totalTags} tags across ${view.totalItems} posts, logs and projects. Pick one to see everything filed under it.`
            : 'Every thread the codex is filed under.'
        }
        wool="plum"
        motif="flowers"
      >
        {ready && (
          <KnitText
            text={`${view.totalTags} tags · ${view.totalItems} items`}
            size="small"
            fg={YARN.gold}
            className="mt-6"
          />
        )}
        <label className="block mt-6 max-w-2xl">
          <span className="sr-only">Search tags</span>
          <input
            type="search"
            className="knt-input"
            value={view.query}
            onChange={(event) => view.setQuery(event.target.value)}
            placeholder="Search tags…"
          />
        </label>
        <div
          className="flex flex-wrap gap-2 mt-4"
          role="group"
          aria-label="Content type"
        >
          {view.types.map((t) => (
            <button
              key={t.key}
              type="button"
              className="knt-tag"
              aria-pressed={view.type === t.key}
              onClick={() => view.setType(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div
          className="flex flex-wrap gap-2 mt-4"
          role="group"
          aria-label="Sort tags"
        >
          <button
            type="button"
            className="knt-btn"
            aria-pressed={view.sort === 'count'}
            onClick={() => view.setSort('count')}
          >
            Most used
          </button>
          <button
            type="button"
            className="knt-btn"
            aria-pressed={view.sort === 'az'}
            onClick={() => view.setSort('az')}
          >
            A–Z
          </button>
        </div>
      </KnitHero>

      <div className="knt-page">
        {view.status === 'error' && <KnitNotice error>{view.error}</KnitNotice>}
        {view.status === 'loading' && (
          <KnitNotice>Unwinding the tags…</KnitNotice>
        )}
        {nothing && (
          <KnitNotice>
            No tags match “{view.query}” — the swatch stays blank.{' '}
            <button
              type="button"
              className="knt-link"
              onClick={() => view.setQuery('')}
            >
              Clear the search
            </button>
          </KnitNotice>
        )}

        {view.shared.length > 0 && (
          <section aria-labelledby="knt-tags-shared">
            <div className="knt-section-head !mb-3">
              <KnitText
                as="h2"
                id="knt-tags-shared"
                text={view.query ? 'Matches' : 'Shared tags'}
                fg={YARN.gold}
              />
              <KnitText
                text={`${view.shared.length} tags`}
                size="small"
                fg={YARN.wheat}
                fit
              />
            </div>
            <KnitBand pattern="zigzag" className="mb-5 rounded" />
            <ul
              className="list-none m-0 p-0 flex flex-wrap items-center gap-2.5"
              aria-label="Tags"
            >
              {view.shared.map((tag) => (
                <li key={tag.slug}>
                  <Link
                    to={view.hrefFor(tag)}
                    className="knt-tag knt-tg-chip"
                    data-size={view.sizeFor(tag.shown)}
                  >
                    {tag.label}
                    <span className="knt-tg-count">{tag.shown}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {view.single.length > 0 && (
          <details className="knt-tg-details mt-10">
            <summary className="knt-btn">
              <span className="knt-tg-caret" aria-hidden="true">
                <KnitIcon name="caretRight" fg={YARN.gold} />
              </span>
              Used once ({view.single.length})
            </summary>
            <div className="knt-patch-dark mt-4">
              <ul className="list-none m-0 p-0 flex flex-wrap gap-2">
                {view.single.map((tag) => (
                  <li key={tag.slug}>
                    <Link
                      to={tagPath(tag.slug)}
                      className="knt-tag knt-tg-chip"
                      data-size={0}
                    >
                      {tag.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        )}

        {ready && !nothing && (
          <p className="knt-label mt-10">
            {view.shared.length + view.single.length} tags in this view
          </p>
        )}
      </div>
      <KnitBand pattern={['peerie', 'hearts', 'peerie']} className="mt-8" />
    </div>
  );
}
