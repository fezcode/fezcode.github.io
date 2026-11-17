import React, { Fragment, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { normalizeCategory } from '../../utils/categoryColors';
import {
  KilimRug,
  KilimText,
  KilimBand,
  KilimStripe,
  KilimNotice,
  WOOL,
  useKilimIndex,
  kilimPosts,
  kilimDate,
  kilimPostLink,
} from '../../components/kilim';
import '../../styles/Kilim.css';
import '../kilim-views/kilim-content.css';

const kindOf = (post) => (post.series ? 'series' : post.category || 'writing');

/** Each kind of writing is dyed its own wool. */
const KIND_DYES = {
  dev: { background: WOOL.teal, color: WOOL.ivory },
  rant: { background: WOOL.apricot, color: WOOL.walnut },
  ai: { background: WOOL.indigoLight, color: WOOL.ivory },
  feat: { background: WOOL.aubergine, color: WOOL.ivory },
  gist: { background: WOOL.saffron, color: WOOL.walnut },
  essay: { background: WOOL.indigo, color: WOOL.ivory },
  series: { background: WOOL.rose, color: WOOL.walnut },
  'd&d': { background: WOOL.pistachio, color: WOOL.ivory },
};
const dyeFor = (kind) =>
  KIND_DYES[normalizeCategory(kind)] || { background: WOOL.madder, color: WOOL.ivory };

const yearOf = (post) => {
  const date = new Date(post.updated || post.date);
  return Number.isNaN(date.getTime()) ? 'Undated' : String(date.getFullYear());
};

const DateTag = ({ value }) => {
  const date = new Date(value);
  const valid = value && !Number.isNaN(date.getTime());
  return (
    <div className="klm-date" aria-hidden="true">
      <b>{valid ? String(date.getDate()).padStart(2, '0') : '–'}</b>
      <span>{valid ? date.toLocaleDateString('en-GB', { month: 'short' }) : 'Undated'}</span>
    </div>
  );
};

const KilimBlogPage = () => {
  const { data, loading, error } = useKilimIndex('/posts/posts.json');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [searchParams] = useSearchParams();
  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);
  const posts = kilimPosts(data);
  const categories = [...new Set(posts.map(kindOf))].sort();
  const filtered = posts.filter(
    (post) =>
      (category === 'all' || kindOf(post) === category) &&
      `${post.title} ${post.description || ''} ${(post.tags || []).join(' ')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  // The list keeps its order (newest first); each year is woven as its own band.
  const years = filtered.reduce((groups, post) => {
    const year = yearOf(post);
    const last = groups[groups.length - 1];
    if (last && last.year === year) last.posts.push(post);
    else groups.push({ year, posts: [post] });
    return groups;
  }, []);

  return (
    <div className="klm-root">
      <Seo
        title="Writing | Fezcodex"
        description="Notes on code, language, probability, and whatever refuses to leave my head."
      />
      <div className="klm-page !pb-0">
        <KilimRug
          eyebrow="Essays · Dev diaries · Rants"
          title="Notes from the margins."
          intro="On code, language, probability, and whatever refuses to leave my head."
          seed="writing"
        >
          <div className="klm-controls">
            <input
              type="search"
              aria-label="Search writing"
              className="klm-input"
              placeholder="Find a thought…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="klm-chips">
              <button
                type="button"
                className="klm-chip"
                aria-pressed={category === 'all'}
                onClick={() => setCategory('all')}
              >
                All writing
              </button>
              {categories.map((value) => (
                <button
                  key={value}
                  type="button"
                  className="klm-chip"
                  aria-pressed={category === value}
                  onClick={() => setCategory(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </KilimRug>
      </div>
      <KilimBand pattern="chain" />
      <div className="klm-page">
        {loading ? (
          <KilimNotice>Unrolling the notes…</KilimNotice>
        ) : error ? (
          <KilimNotice error>The writing could not be loaded.</KilimNotice>
        ) : (
          <>
            <p className="klm-label klm-status" role="status">
              {filtered.length} entries
            </p>
            {filtered.length ? (
              years.map(({ year, posts: group }) => (
                <section className="klm-blog-year" key={year} aria-label={year}>
                  <div className="klm-blog-year-head">
                    <KilimText as="h2" text={year} fg={WOOL.saffron} fit />
                    <KilimStripe />
                    <span className="klm-label shrink-0">{group.length} woven</span>
                  </div>
                  {group.map((post, i) => {
                    const dye = dyeFor(kindOf(post));
                    return (
                      <Fragment key={post.slug}>
                        {i > 0 && <KilimStripe />}
                        <Link to={kilimPostLink(post)} className="klm-blog-entry">
                          <DateTag value={post.updated || post.date} />
                          <div className="min-w-0">
                            <div className="klm-blog-kind">
                              <span className="klm-tag" style={dye}>
                                {post.series ? 'Series' : post.category || 'Writing'}
                              </span>
                              <span className="klm-label">
                                {kilimDate(post.updated || post.date)}
                              </span>
                              {post.series && (
                                <span className="klm-label">
                                  · {post.series.posts?.length || 0} chapters
                                </span>
                              )}
                            </div>
                            <h3 className="klm-row-title">{post.title}</h3>
                            {(post.description || post.series?.description) && (
                              <p className="klm-blog-text">
                                {post.description || post.series?.description}
                              </p>
                            )}
                          </div>
                          <span className="klm-row-arrow" aria-hidden="true">
                            ↗
                          </span>
                        </Link>
                      </Fragment>
                    );
                  })}
                </section>
              ))
            ) : (
              <KilimNotice>
                No writing matches this search.
                <button
                  type="button"
                  className="klm-link klm-btn-link"
                  onClick={() => {
                    setQuery('');
                    setCategory('all');
                  }}
                >
                  Clear filters
                </button>
              </KilimNotice>
            )}
          </>
        )}
        <Link to="/graph" className="klm-link klm-blog-graph">
          Follow connections in the knowledge graph →
        </Link>
      </div>
      <KilimBand pattern={['teeth', 'end']} className="mt-6" />
    </div>
  );
};

export default KilimBlogPage;
