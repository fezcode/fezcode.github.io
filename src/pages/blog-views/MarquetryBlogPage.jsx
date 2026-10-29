import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { getCategoryColor } from '../../utils/categoryColors';
import {
  MarquetryText,
  MarquetryIcon,
  MarquetryHero,
  MarquetryNotice,
  MarquetryBand,
  WOOD,
  useMarquetryIndex,
  marquetryPosts,
  marquetryDate,
  marquetryPostLink,
} from '../../components/marquetry';
import '../../styles/Marquetry.css';

const kindOf = (post) => (post.series ? 'series' : post.category || 'writing');

const MarquetryBlogPage = () => {
  const { data, loading, error } = useMarquetryIndex('/posts/posts.json');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [searchParams] = useSearchParams();
  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);
  const posts = marquetryPosts(data);
  const categories = [...new Set(posts.map(kindOf))].sort();
  const filtered = posts.filter(
    (post) =>
      (category === 'all' || kindOf(post) === category) &&
      `${post.title} ${post.description || ''} ${(post.tags || []).join(' ')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="mqt-root">
      <Seo
        title="Writing | Fezcodex"
        description="Notes on code, language, probability, and whatever refuses to leave my head."
      />
      <MarquetryHero
        eyebrow="Essays · Dev diaries · Rants"
        title="Notes from the margins."
        intro="On code, language, probability, and whatever refuses to leave my head."
      >
        <input
          type="search"
          aria-label="Search writing"
          className="mqt-input mt-7 max-w-2xl"
          placeholder="Find a thought…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            type="button"
            className="mqt-tag"
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
          >
            All writing
          </button>
          {categories.map((value) => (
            <button
              key={value}
              type="button"
              className="mqt-tag"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </MarquetryHero>
      <div className="mqt-page">
        {loading ? (
          <MarquetryNotice>Reading the notes…</MarquetryNotice>
        ) : error ? (
          <MarquetryNotice error>
            The writing could not be loaded.
          </MarquetryNotice>
        ) : (
          <>
            <p className="mqt-label mb-5" role="status">
              {filtered.length} entries
            </p>
            {filtered.length ? (
              filtered.map((post) => (
                <Link
                  key={post.slug}
                  to={marquetryPostLink(post)}
                  className="mqt-row"
                >
                  <div className="mqt-row-body">
                    <MarquetryText
                      text={`${post.series ? 'Series' : post.category || 'Writing'} · ${marquetryDate(post.updated || post.date)}`}
                      size="small"
                      fg={getCategoryColor('marquetry', kindOf(post))}
                    />
                    <MarquetryText
                      as="h2"
                      text={post.title}
                      fg={WOOD.ink}
                      maxLines={3}
                      className="mt-3"
                    />
                    {(post.description || post.series?.description) && (
                      <p className="mqt-patch mqt-patch-tight mt-3 max-w-3xl text-base">
                        {post.description || post.series?.description}
                      </p>
                    )}
                    {post.series && (
                      <MarquetryText
                        text={`${post.series.posts?.length || 0} chapters`}
                        size="small"
                        fg={WOOD.bark}
                        className="mt-3"
                      />
                    )}
                  </div>
                  <MarquetryIcon name="arrowUpRight" fg={WOOD.teal} />
                </Link>
              ))
            ) : (
              <MarquetryNotice>
                No writing matches this search.{' '}
                <button
                  type="button"
                  className="mqt-link"
                  onClick={() => {
                    setQuery('');
                    setCategory('all');
                  }}
                >
                  Clear filters
                </button>
              </MarquetryNotice>
            )}
          </>
        )}
        <Link to="/graph" className="mqt-link mt-10">
          Follow connections in the knowledge graph →
        </Link>
      </div>
      <MarquetryBand
        pattern={['peerie', 'diamonds', 'peerie']}
        className="mt-10"
      />
    </div>
  );
};

export default MarquetryBlogPage;
