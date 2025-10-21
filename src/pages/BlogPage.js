import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostItem from '../components/PostItem';
import usePageTitle from '../utils/usePageTitle';
import { ArrowLeftIcon } from '@phosphor-icons/react';

const BlogPage = () => {
  usePageTitle('Blog');
  const [displayItems, setDisplayItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // New state for active filter

  useEffect(() => {
    const fetchPostSlugs = async () => {
      try {
        const response = await fetch('/posts/shownPosts.json');
        if (response.ok) {
          const allPosts = await response.json();

          const seriesMap = new Map();
          const individualPosts = [];

          allPosts.forEach(post => {
            if (post.series) {
              if (!seriesMap.has(post.series)) {
                seriesMap.set(post.series, {
                  title: post.series,
                  slug: post.series.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-series', // Generate a slug for the series
                  isSeries: true,
                  posts: []
                });
              }
              seriesMap.get(post.series).posts.push(post);
            } else {
              individualPosts.push(post);
            }
          });

          // Sort series posts by seriesIndex
          seriesMap.forEach(series => {
            series.posts.sort((a, b) => a.seriesIndex - b.seriesIndex);
          });

          // Combine individual posts and series entries
          const combinedItems = [
            ...Array.from(seriesMap.values()),
            ...individualPosts,
          ];

          // Sort combined items by date (newest first), series entries should appear based on the date of their latest post
          combinedItems.sort((a, b) => {
            const dateA = a.isSeries ? new Date(Math.max(...a.posts.map(p => new Date(p.date)))) : new Date(a.date);
            const dateB = b.isSeries ? new Date(Math.max(...b.posts.map(p => new Date(p.date)))) : new Date(b.date);
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

  const filteredItems = displayItems.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'series') return item.isSeries;
    return item.category === activeFilter && !item.isSeries;
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
            className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
          >
            <ArrowLeftIcon className="text-xl" /> Back to Home
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            From the Blog
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Catch up on the latest news and insights.
          </p>
          <div className="mt-4 text-center">
            <span className="ml-2 px-3 py-1 text-base font-medium text-gray-200 bg-gray-800 rounded-full">
              Total: {filteredItems.length}
            </span>
          </div>
          {/* Filter Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('dev')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === 'dev' ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Dev
            </button>
            <button
              onClick={() => setActiveFilter('rant')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === 'rant' ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Rant
            </button>
            <button
              onClick={() => setActiveFilter('series')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === 'series' ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Series
            </button>
            <button
              onClick={() => setActiveFilter('d&d')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === 'd&d' ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              D&D
            </button>
          </div>
        </div>
        <div className="mt-16">
          <div className="">
            {filteredItems.map((item) => (
              item.isSeries ? (
                <PostItem
                  key={item.slug}
                  slug={`series/${item.slug}`}
                  title={item.title}
                  date={item.posts[item.posts.length - 1].date} // Date of the latest post in the series
                  category="series"
                  isSeries={true}
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
                />
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
