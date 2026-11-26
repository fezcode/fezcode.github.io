import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRightIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { getCategoryColor } from '../../utils/categoryColors';
import { StudioNotice } from '../../components/studio';
import {
  useStudioIndex,
  studioPosts,
  studioDate,
  studioPostLink,
} from '../../components/studio/useStudioContent';
import '../../styles/Studio.css';

const StudioBlogPage = () => {
  const { data, loading, error } = useStudioIndex('/posts/posts.json');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [searchParams] = useSearchParams();
  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);
  const posts = studioPosts(data);
  const categories = [
    ...new Set(
      posts.map((post) =>
        post.series ? 'series' : post.category || 'writing',
      ),
    ),
  ].sort();
  const filtered = posts.filter(
    (post) =>
      (category === 'all' ||
        (post.series ? 'series' : post.category || 'writing') === category) &&
      `${post.title} ${post.description || ''} ${(post.tags || []).join(' ')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="std-root">
      <Seo
        title="Writing | Fezcodex"
        description="Notes on code, language, probability, and whatever refuses to leave my head."
      />
      <div className="std-page">
        <header className="mb-9">
          <p className="std-eyebrow">Essays · dev diaries · rants</p>
          <h1 className="std-title mt-4">
            Notes from
            <br />
            the margins.
          </h1>
          <p className="std-intro">
            On code, language, probability, and whatever refuses to leave my
            head.
          </p>
        </header>
        <input
          type="search"
          aria-label="Search writing"
          className="std-input"
          placeholder="Find a thought…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2 my-5">
          <button
            type="button"
            className="std-chip"
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
          >
            All writing
          </button>
          {categories.map((value) => (
            <button
              key={value}
              type="button"
              className="std-chip"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {value}
            </button>
          ))}
        </div>
        {loading ? (
          <StudioNotice>Opening the notes…</StudioNotice>
        ) : error ? (
          <StudioNotice error>The writing could not be loaded.</StudioNotice>
        ) : (
          <>
            <p className="std-label mb-5" role="status">
              {filtered.length} entries
            </p>
            {filtered.length ? (
              filtered.map((post) => (
                <Link
                  key={post.slug}
                  to={studioPostLink(post)}
                  className="std-writing-row"
                >
                  <div>
                    <p className="std-label mb-3">
                      <span
                        style={{
                          color: getCategoryColor(
                            'studio',
                            post.series ? 'series' : post.category,
                          ),
                          fontWeight: 500,
                        }}
                      >
                        {post.series ? 'Series' : post.category || 'Writing'}
                      </span>{' '}
                      · {studioDate(post.updated || post.date)}
                    </p>
                    <h2 className="text-2xl md:text-3xl tracking-tight mb-3">
                      {post.title}
                    </h2>
                    <p className="std-muted max-w-3xl text-base">
                      {post.description || post.series?.description}
                    </p>
                    {post.series && (
                      <p className="std-label mt-3">
                        {post.series.posts?.length || 0} chapters
                      </p>
                    )}
                  </div>
                  <ArrowUpRightIcon size={22} className="shrink-0" />
                </Link>
              ))
            ) : (
              <StudioNotice>
                No writing matches this search.{' '}
                <button
                  type="button"
                  className="std-link"
                  onClick={() => {
                    setQuery('');
                    setCategory('all');
                  }}
                >
                  Clear filters
                </button>
              </StudioNotice>
            )}
          </>
        )}
        <Link to="/graph" className="std-link mt-10">
          Follow connections in the knowledge graph →
        </Link>
      </div>
    </div>
  );
};

export default StudioBlogPage;
