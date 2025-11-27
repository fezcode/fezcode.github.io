import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostItem from '../components/PostItem';
import useSeo from '../hooks/useSeo';
import { ArrowLeftIcon } from '@phosphor-icons/react';

const BlogPage = () => {
  useSeo({
    title: 'Blog | Fezcodex',
    description:
      'Catch up on the latest news and insights from the Fezcodex blog.',
    keywords: ['Fezcodex', 'blog', 'dev', 'rant', 'series', 'd&d'],
    ogTitle: 'Blog | Fezcodex',
    ogDescription:
      'Catch up on the latest news and insights from the Fezcodex blog.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Blog | Fezcodex',
    twitterDescription:
      'Catch up on the latest news and insights from the Fezcodex blog.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });
  const [displayItems, setDisplayItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // New state for active filter
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

  useEffect(() => {
    const fetchPostSlugs = async () => {
      try {
        const response = await fetch('/posts/posts.json');
        if (response.ok) {
          const allPostsData = await response.json();

          const processedPosts = [];
          allPostsData.forEach((item) => {
            if (item.series) {
              item.series.posts.forEach((seriesPost) => {
                processedPosts.push({
                  ...seriesPost,
                  series: {
                    slug: item.slug,
                    title: item.title,
                    date: item.date,
                    updated: item.updated,
                    authors: item.authors, // Propagate authors array for series posts
                  },
                });
              });
            } else {
              processedPosts.push(item);
            }
          });

          const seriesMap = new Map();
          const individualPosts = [];

          processedPosts.forEach((post) => {
            if (post.series) {
              if (!seriesMap.has(post.series.slug)) {
                seriesMap.set(post.series.slug, {
                  title: post.series.title,
                  slug: post.series.slug,
                  date: post.date, // Use post.date for series date
                  updated: post.updated, // Use post.updated for series updated date
                  authors: post.series.authors, // Use authors array from series metadata
                  isSeries: true,
                  posts: [],
                });
              }
              seriesMap.get(post.series.slug).posts.push(post);
            } else {
              individualPosts.push(post);
            }
          });

          // Sort series posts by seriesIndex
          seriesMap.forEach((series) => {
            series.posts.sort((a, b) => a.seriesIndex - b.seriesIndex);
          });

          // Combine individual posts and series entries
          const combinedItems = [
            ...Array.from(seriesMap.values()),
            ...individualPosts,
          ];

          // Helper function to get the effective date for sorting
          const getEffectiveDate = (item) => {
            // For both series and individual posts, use updated or date from the top level
            return new Date(item.updated || item.date);
          };

          // Sort combined items by effective date (newest first)
          combinedItems.sort((a, b) => {
            const dateA = getEffectiveDate(a);
            const dateB = getEffectiveDate(b);
            return dateB - dateA;
          });

          setDisplayItems(combinedItems);
        } else {
          console.error('Failed to fetch post slugs');
          setDisplayItems([]);
        }
      } catch (error) {
        console.error('Error fetching post slugs:', error);
        setDisplayItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPostSlugs();
  }, []);

  const filteredItems = displayItems.filter((item) => {
    const matchesFilter = () => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'series') return item.isSeries;
      return item.category === activeFilter && !item.isSeries;
    };

    const matchesSearch = () => {
      if (searchQuery === '') return true;
      const query = searchQuery.toLowerCase();
      const title = item.title ? item.title.toLowerCase() : '';
      const slug = item.slug ? item.slug.toLowerCase() : '';
      const authors = item.authors ? item.authors.map(a => a.toLowerCase()).join(' ') : ''; // Include authors in search
      return title.includes(query) || slug.includes(query) || authors.includes(query);
    };

    return matchesFilter() && matchesSearch();
  });

  if (loading) {
    // Skeleton loading screen for BlogPage
    return (
      <div className="py-16 sm:py-24 animate-pulse">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-4 mx-auto"></div>
            <div className="h-12 bg-gray-800 rounded w-3/4 mb-4 mx-auto"></div>
            <div className="h-6 bg-gray-800 rounded w-1/2 mb-8 mx-auto"></div>
          </div>
          <div className="mt-16 space-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Link
            to="/"
            className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
          >
            <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" /> Back to Home
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            From the <span style={{ color: 'var(--fzcdx-spanner)' }}>Blog</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Catch up on the latest news and insights.
          </p>
          <div className="mt-4 text-center">
            <span className="ml-2 px-3 py-1 text-base font-medium text-gray-200 bg-gray-800 rounded-full">
              Total: {filteredItems.length}
            </span>
          </div>
          {/* Search Input */}
          <div className="mt-8 mb-4 flex justify-center">
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full max-w-md px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Filter Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'dev', label: 'Dev' },
              { id: 'feat', label: 'Feat' },
              { id: 'rant', label: 'Rant' },
              { id: 'series', label: 'Series' },
              { id: 'gist', label: 'Gist' },
              { id: 'd&d', label: 'D&D' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeFilter === filter.id
                    ? 'text-white shadow-md'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
                style={{
                  backgroundColor:
                    activeFilter === filter.id
                      ? filter.id === 'all'
                        ? '#4b5563' // gray-600 for All
                        : filter.id === 'series'
                          ? 'var(--color-series-badge)'
                          : filter.id === 'd&d'
                            ? 'var(--color-dnd-badge)'
                            : filter.id === 'gist'
                              ? 'var(--color-gist-badge)'
                              : filter.id === 'feat'
                                ? 'var(--color-feat-badge)'
                                : filter.id === 'rant'
                                  ? 'var(--color-takes-badge)'
                                  : `var(--color-${filter.id}-badge)` // Dynamic for dev
                      : undefined,
                    color: activeFilter === filter.id && filter.id === 'gist' ? 'black' : undefined
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-16">
          <div className="">
            {filteredItems.map((item) =>
              item.isSeries ? (
                <PostItem
                  key={item.slug}
                  slug={`series/${item.slug}`}
                  title={item.title}
                  date={item.date} // Date of the series
                  updatedDate={item.updated} // Updated date of the series
                  category="series"
                  isSeries={true}
                  authors={item.authors} // Pass authors array for series
                />
              ) : (
                <PostItem
                  key={item.slug}
                  slug={item.slug}
                  title={item.title}
                  date={item.date}
                  updatedDate={item.updated}
                  category={item.category}
                  series={item.series}
                  seriesIndex={item.seriesIndex}
                  authors={item.authors} // Pass authors array for individual posts
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
