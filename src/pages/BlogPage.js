import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import PostItem from '../components/PostItem';
import useSeo from '../hooks/useSeo';
import {ArrowLeftIcon, ArticleIcon, MagnifyingGlassIcon, FunnelIcon, XCircle, X} from '@phosphor-icons/react';
import colors from '../config/colors';

const iconColors = [
  "text-red-500",
  "text-orange-500",
  "text-amber-500",
  "text-yellow-500",
  "text-lime-500",
  "text-green-500",
  "text-emerald-500",
  "text-teal-500",
  "text-cyan-500",
  "text-sky-500",
  "text-blue-500",
  "text-indigo-500",
  "text-violet-500",
];

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
  const [iconColor, setIconColor] = useState('text-white');

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

  useEffect(() => {
    const randomIconColor = iconColors[Math.floor(Math.random() * iconColors.length)]
    setIconColor(randomIconColor);
  }, [searchQuery, activeFilter]);

  const clearFilters = () => {
    setActiveFilter('all');
    setSearchQuery('');
  };

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
        <Link
          to="/"
          className="group text-primary-400 hover:text-primary-300 hover:underline flex items-center gap-2 text-lg mb-8 transition-colors"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1"/> Back to Home
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold font-mono tracking-tight sm:text-6xl mb-4 flex items-center text-white">
              <ArticleIcon
                size={48}
                weight="fill"
                className={`mr-4 mt-2 ${iconColor}`}
              />
              <span className="text-gray-100">fc</span>
              <span className="text-gray-500">::</span>
              <span className="text-gray-100">posts</span>
              <span className="text-gray-500">::</span>
              <span className="text-gray-500">[</span>
              <span className="text-gray-100">{displayItems.length}</span>
              <span className="text-gray-500">]</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl font-mono">
              Catch up on the latest news and insights.
            </p>
          </div>

          {/* Search Input */}
          <div className="mt-8 mb-8 flex justify-center relative max-w-lg mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors duration-300"/>
            </div>
            <input
              type="text"
              placeholder="Type to filter..."
              className="block w-full pl-11 pr-24 py-3 border border-gray-700/50 rounded-2xl leading-5 bg-gray-900/50 text-gray-200 placeholder-gray-600 focus:outline-none focus:bg-gray-900/80 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 sm:text-sm transition-all duration-300 backdrop-blur-md shadow-lg hover:border-gray-600 hover:shadow-primary-500/5 font-sans"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-gray-500 hover:text-white hover:bg-gray-700 transition-all duration-200 focus:outline-none"
                  title="Clear search"
                >
                  <X weight="bold" className="h-3.5 w-3.5"/>
                </button>
              )}
              <span
                className={`text-xs font-mono px-2 py-1 rounded-md transition-colors duration-300 border ${filteredItems.length === 0 ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-gray-700/50 text-gray-500 bg-gray-800/50'}`}>
                 {filteredItems.length}
               </span>
            </div>
          </div>
        </div>

        <hr className="border-gray-800 mb-8"/>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <div className="flex items-center gap-2 mr-2 text-gray-500 font-mono text-sm">
            <FunnelIcon size={16}/>
            <span>Filter:</span>
          </div>
          {[
            {id: 'all', label: 'All'},
            {id: 'dev', label: 'Dev'},
            {id: 'feat', label: 'Feat'},
            {id: 'rant', label: 'Rant'},
            {id: 'series', label: 'Series'},
            {id: 'gist', label: 'Gist'},
            {id: 'd&d', label: 'D&D'},
          ].map((filter) => {
            const isSelected = activeFilter === filter.id;

            // Determine color key for mapping
            let colorKey = filter.id;
            if (filter.id === 'rant') colorKey = 'takes'; // 'rant' maps to 'takes' color vars

            // Resolve specific color using colors.js logic approximation or CSS vars
            // Since we are using style prop with vars in the previous version, let's stick to that pattern or use colors.js if available
            // Note: colors.js has keys like 'feat', 'series', etc.
            // Let's try to use the hex codes from colors.js if possible, or fallback to a default.

            let categoryColor = colors.primary[400]; // Default
            if (filter.id === 'all') categoryColor = '#9ca3af'; // gray-400
            else if (filter.id === 'rant') categoryColor = '#065f46'; // hardcoded matching index.css roughly or use colors.js
            // Actually, let's use the CSS variables for consistency with badges

            // Construct style object
            const activeColor = filter.id === 'all' ? '#4b5563' :
              filter.id === 'rant' ? 'var(--color-takes-badge)' :
                filter.id === 'd&d' ? 'var(--color-dnd-badge)' :
                  `var(--color-${filter.id}-badge)`;

            const style = isSelected ? {
              backgroundColor: activeColor,
              borderColor: activeColor,
              color: filter.id === 'gist' ? 'black' : 'white',
              boxShadow: `0 0 20px ${activeColor}`
            } : {};

            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                style={style}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  isSelected
                    ? 'transform scale-105'
                    : 'bg-gray-900/50 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200'
                }`}
              >
                {filter.label}
              </button>
            );
          })} {(activeFilter !== 'all' || searchQuery) && (
          <button onClick={clearFilters}
                  className="font-arvo ml-auto text-sm text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
            <XCircle size={20}/> Clear
          </button>
        )}
        </div>

        {/*mt-12 max-w-3xl mx-auto space-y-8*/}
        <div className="mt-12 mx-auto space-y-8">
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
  );
};

export default BlogPage;
