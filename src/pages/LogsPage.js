import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {
  ArrowLeftIcon,
  LogIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XCircle,
} from '@phosphor-icons/react';
import {motion, AnimatePresence} from 'framer-motion';
import LogCard from '../components/LogCard';
import useSeo from '../hooks/useSeo';
import colors from '../config/colors';

// Define categories for the filter pills
const categories = [
  'Book',
  'Movie',
  'Game',
  'Article',
  'Music',
  'Series',
  'Food',
  'Websites',
  'Tools',
];

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
  // "text-purple-500",
  // "text-fuchsia-500",
  // "text-pink-500",
  // "text-rose-500",
  // "text-slate-500",
  // "text-gray-500",
  // "text-zinc-500",
  // "text-neutral-500",
  // "text-stone-500",
];

const LogsPage = () => {
  useSeo({
    title: 'Logs | Fezcodex',
    description:
      'A collection of logs, thoughts, and other miscellaneous writings.',
    keywords: ['Fezcodex', 'logs', 'thoughts', 'writing'],
    ogTitle: 'Logs | Fezcodex',
    ogDescription:
      'A collection of logs, thoughts, and other miscellaneous writings.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Logs | Fezcodex',
    twitterDescription:
      'A collection of logs, thoughts, and other miscellaneous writings.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]); // Empty means all
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [iconColor, setIconColor] = useState('text-white');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const fetchPromises = categories.map(async (category) => {
          const response = await fetch(`/logs/${category.toLowerCase()}/${category.toLowerCase()}.json`);
          if (!response.ok) {
            // If a category JSON file is not found, return an empty array for that category
            console.warn(`Category JSON not found for ${category}: ${response.statusText}`);
            return [];
          }
          return response.json();
        });

        const allLogsArrays = await Promise.all(fetchPromises);
        const combinedLogs = allLogsArrays.flat(); // Flatten the array of arrays

        const logsWithId = combinedLogs.map((log, index) => ({
          ...log,
          id: `${log.title}-${log.date}-${index}`,
          originalIndex: index,
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(logsWithId);
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    setFilteredLogs(
      logs.filter((log) => {
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(log.category);
        const matchesSearch =
          log.title.toLowerCase().includes(lowerQuery) ||
          (log.author && log.author.toLowerCase().includes(lowerQuery)) ||
          (log.description && log.description.toLowerCase().includes(lowerQuery));
        return matchesCategory && matchesSearch;
      }),
    );
    const randomIconColor = iconColors[Math.floor(Math.random() * iconColors.length)]
    setIconColor(randomIconColor);
  }, [logs, selectedCategories, searchQuery]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
  }

  return (
    <div className="py-16 sm:py-24 bg-gray-950 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        {/* Back Link */}
        <Link
          to="/"
          className="group text-primary-400 hover:text-primary-300 hover:underline flex items-center gap-2 text-lg mb-8 transition-colors"
        >
          <ArrowLeftIcon
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />{' '}
          Back to Home
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold font-mono tracking-tight sm:text-6xl mb-4 flex items-center text-white">
              <LogIcon
                size={48}
                weight="fill"
                className={`mr-4 mt-2 ${iconColor}`}
              />
              <span className="text-gray-100">fc</span>
              <span className="text-gray-500">::</span>
              <span className="text-gray-100">logs</span>
              <span className="text-gray-500">::</span>
              <span className="text-gray-500">[</span>
              <span className="text-gray-100">{logs.length}</span>
              <span className="text-gray-500">]</span>
              {/*<span className="ml-4 text-2xl text-gray-500 bg-gray-800 px-3 py-1 rounded-full font-mono align-middle">*/}
              {/*  {logs.length}*/}
              {/*</span>*/}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl font-mono">
              A digital garden of thoughts, reviews, and discoveries.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative group w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors"/>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-800/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition-all"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <hr className="border-gray-800 mb-8"/>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <div className="flex items-center gap-2 mr-2 text-gray-500 font-mono text-sm">
            <FunnelIcon size={16}/>
            <span>Filter:</span>
          </div>
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            // Get color from config or default
            const colorKey = category.toLowerCase();
            // Safe access to colors object in case keys don't match perfectly
            const categoryColor = colors[colorKey] || colors.primary[400];

            return (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                style={
                  isSelected
                    ? {
                        borderColor: categoryColor,
                        color: categoryColor,
                        boxShadow: `0 0 10px ${categoryColor}33`,
                      }
                    : {}
                }
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-all duration-200 ${
                  isSelected
                    ? 'bg-gray-800'
                    : 'bg-gray-900/50 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200'
                }`}
              >
                {category}
              </button>
            );
          })}

          {(selectedCategories.length > 0 || searchQuery) && (
            <button onClick={clearFilters} className="font-arvo ml-auto text-sm text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
              <XCircle size={20}/> Clear
            </button>
          )}
        </div>

        {loading ? (
          // Skeleton Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800/30 rounded-xl p-6 h-64 animate-pulse border border-gray-700/50"
              >
                <div className="h-8 w-8 bg-gray-700/50 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-700/30 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700/30 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          // Logs Grid
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredLogs.map((log) => (
                <motion.div
                  layout
                  key={log.id}
                  initial={{opacity: 0, scale: 0.9}}
                  animate={{opacity: 1, scale: 1}}
                  exit={{opacity: 0, scale: 0.9}}
                  transition={{duration: 0.2}}
                >
                  <LogCard
                    log={log}
                    index={log.originalIndex}
                    totalLogs={logs.length}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredLogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-mono">No logs found.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-primary-400 hover:text-primary-300 underline underline-offset-4"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsPage;
