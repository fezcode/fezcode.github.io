import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { getCategoryColor } from '../../utils/categoryColors';
import {
  KnitText,
  KnitIcon,
  KnitHero,
  KnitNotice,
  KnitBand,
  YARN,
  useKnitIndex,
  knitPosts,
  knitDate,
  knitPostLink,
} from '../../components/knit';
import '../../styles/Knit.css';

const kindOf = (post) => (post.series ? 'series' : post.category || 'writing');

const KnitBlogPage = () => {
  const { data, loading, error } = useKnitIndex('/posts/posts.json');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [searchParams] = useSearchParams();
  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);
  const posts = knitPosts(data);
  const categories = [...new Set(posts.map(kindOf))].sort();
  const filtered = posts.filter(
    (post) =>
      (category === 'all' || kindOf(post) === category) &&
      `${post.title} ${post.description || ''} ${(post.tags || []).join(' ')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="knt-root">
      <Seo
        title="Writing | Fezcodex"
        description="Notes on code, language, probability, and whatever refuses to leave my head."
      />
      <KnitHero
        eyebrow="Essays · Dev diaries · Rants"
        title="Notes from the margins."
        intro="On code, language, probability, and whatever refuses to leave my head."
        wool="rust"
        motif="hearts"
      >
        <input
          type="search"
          aria-label="Search writing"
          className="knt-input mt-7 max-w-2xl"
          placeholder="Find a thought…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            type="button"
            className="knt-tag"
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
          >
            All writing
          </button>
          {categories.map((value) => (
            <button
              key={value}
              type="button"
              className="knt-tag"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </KnitHero>
      <div className="knt-page">
        {loading ? (
          <KnitNotice>Unrolling the notes…</KnitNotice>
        ) : error ? (
          <KnitNotice error>The writing could not be loaded.</KnitNotice>
        ) : (
          <>
            <p className="knt-label mb-5" role="status">
              {filtered.length} entries
            </p>
            {filtered.length ? (
              filtered.map((post) => (
                <Link key={post.slug} to={knitPostLink(post)} className="knt-row">
                  <div className="knt-row-body">
                    <KnitText
                      text={`${post.series ? 'Series' : post.category || 'Writing'} · ${knitDate(post.updated || post.date)}`}
                      size="small"
                      fg={getCategoryColor('knit', kindOf(post))}
                    />
                    <KnitText
                      as="h2"
                      text={post.title}
                      fg={YARN.cream}
                      maxLines={3}
                      className="mt-3"
                    />
                    {(post.description || post.series?.description) && (
                      <p className="knt-patch knt-patch-tight mt-3 max-w-3xl text-base">
                        {post.description || post.series?.description}
                      </p>
                    )}
                    {post.series && (
                      <KnitText
                        text={`${post.series.posts?.length || 0} chapters`}
                        size="small"
                        fg={YARN.wheat}
                        className="mt-3"
                      />
                    )}
                  </div>
                  <KnitIcon name="arrowUpRight" fg={YARN.gold} />
                </Link>
              ))
            ) : (
              <KnitNotice>
                No writing matches this search.{' '}
                <button
                  type="button"
                  className="knt-link"
                  onClick={() => {
                    setQuery('');
                    setCategory('all');
                  }}
                >
                  Clear filters
                </button>
              </KnitNotice>
            )}
          </>
        )}
        <Link to="/graph" className="knt-link mt-10">
          Follow connections in the knowledge graph →
        </Link>
      </div>
      <KnitBand pattern={['peerie', 'diamonds', 'peerie']} className="mt-10" />
    </div>
  );
};

export default KnitBlogPage;
