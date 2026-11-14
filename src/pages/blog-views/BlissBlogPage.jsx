import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowUpRightIcon,
  ArticleIcon,
  BooksIcon,
  MagnifyingGlassIcon,
  NotebookIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { getCategoryColor } from '../../utils/categoryColors';
import {
  BlissWindow,
  BlissIcon,
  BlissNotice,
  BlissTitleLink,
  useBlissIndex,
  blissPosts,
  blissDate,
  blissPostLink,
} from '../../components/bliss';
import '../../styles/Bliss.css';

const kindOf = (post) => (post.series ? 'series' : post.category || 'writing');

/** A category as a filled pill — readable on cream and on the blue hover. */
const CategoryPill = ({ kind, label }) => (
  <span
    className="inline-flex items-center rounded-sm px-1.5 text-[11px] font-bold uppercase tracking-wide text-white"
    style={{ background: getCategoryColor('bliss', kind), lineHeight: '18px' }}
  >
    {label}
  </span>
);

const BlissBlogPage = () => {
  const { data, loading, error } = useBlissIndex('/posts/posts.json');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [searchParams] = useSearchParams();
  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);
  const posts = blissPosts(data);
  const categories = [...new Set(posts.map(kindOf))].sort();
  const filtered = posts.filter(
    (post) =>
      (category === 'all' || kindOf(post) === category) &&
      `${post.title} ${post.description || ''} ${(post.tags || []).join(' ')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const clearFilters = () => {
    setQuery('');
    setCategory('all');
  };
  return (
    <div className="bl-root">
      <Seo
        title="Writing | Fezcodex"
        description="Notes on code, language, probability, and whatever refuses to leave my head."
      />
      <div className="bl-page">
        <BlissWindow
          title="Writing"
          icon={NotebookIcon}
          tone="orange"
          headingLevel={null}
        >
          <p className="bl-eyebrow m-0">Essays · Dev diaries · Rants</p>
          <h1 className="bl-display mt-2">Notes from the margins.</h1>
          <p className="mt-3 mb-0 max-w-2xl text-base">
            On code, language, probability, and whatever refuses to leave my
            head.
          </p>
          <div className="bl-groupbox mt-6">
            <span className="bl-groupbox-label">Search and filter</span>
            <label className="flex items-center gap-2 max-w-2xl">
              <MagnifyingGlassIcon
                size={20}
                weight="bold"
                className="shrink-0 text-[var(--bl-heading)]"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Search writing"
                className="bl-input"
                placeholder="Find a thought…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div
              className="flex flex-wrap gap-2 mt-4"
              role="group"
              aria-label="Filter by category"
            >
              <button
                type="button"
                className="bl-tag"
                aria-pressed={category === 'all'}
                onClick={() => setCategory('all')}
              >
                All writing
              </button>
              {categories.map((value) => (
                <button
                  key={value}
                  type="button"
                  className="bl-tag"
                  aria-pressed={category === value}
                  onClick={() => setCategory(value)}
                >
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ background: getCategoryColor('bliss', value) }}
                    aria-hidden="true"
                  />
                  {value}
                </button>
              ))}
            </div>
          </div>
        </BlissWindow>

        <BlissWindow
          title="All writing"
          icon={ArticleIcon}
          tone="blue"
          titleId="bl-writing-list"
          flush
          actions={
            <BlissTitleLink to="/graph">Knowledge graph →</BlissTitleLink>
          }
          status={
            loading || error ? undefined : (
              <>
                <span role="status">{filtered.length} entries</span>
                <Link to="/graph" className="bl-link">
                  Follow connections in the knowledge graph →
                </Link>
              </>
            )
          }
        >
          {loading ? (
            <div className="p-4">
              <BlissNotice>Unrolling the notes…</BlissNotice>
            </div>
          ) : error ? (
            <div className="p-4">
              <BlissNotice error>The writing could not be loaded.</BlissNotice>
            </div>
          ) : filtered.length ? (
            <div className="bg-white">
              {filtered.map((post) => {
                const kind = kindOf(post);
                const description =
                  post.description || post.series?.description;
                return (
                  <Link
                    key={post.slug}
                    to={blissPostLink(post)}
                    className="bl-row !items-start"
                  >
                    <BlissIcon
                      icon={post.series ? BooksIcon : ArticleIcon}
                      seed={kind}
                      size={36}
                    />
                    <div className="bl-row-body">
                      <span className="flex flex-wrap items-center gap-2 bl-meta">
                        <CategoryPill
                          kind={kind}
                          label={
                            post.series ? 'Series' : post.category || 'Writing'
                          }
                        />
                        <span>{blissDate(post.updated || post.date)}</span>
                        {post.series && (
                          <span>
                            · {post.series.posts?.length || 0} chapters
                          </span>
                        )}
                      </span>
                      <h3 className="bl-row-title m-0 line-clamp-3">
                        {post.title}
                      </h3>
                      {description && (
                        <p className="bl-meta m-0 max-w-3xl line-clamp-2">
                          {description}
                        </p>
                      )}
                    </div>
                    <ArrowUpRightIcon
                      size={18}
                      weight="bold"
                      className="shrink-0 mt-1"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-4">
              <BlissNotice>
                No writing matches this search.{' '}
                <button
                  type="button"
                  className="bl-link"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              </BlissNotice>
            </div>
          )}
        </BlissWindow>
      </div>
    </div>
  );
};

export default BlissBlogPage;
