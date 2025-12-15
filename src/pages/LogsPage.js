import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  LogIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XCircle,
  InfoIcon,
  StarIcon,
  SidebarIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import LogCard from '../components/LogCard';
import useSeo from '../hooks/useSeo';
import colors from '../config/colors';
import { useAchievements } from '../context/AchievementContext';
import piml from 'piml';
import GenericModal from '../components/GenericModal';
import { useSidePanel } from '../context/SidePanelContext';
import RatingSystemDetail from '../components/RatingSystemDetail';

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
  'Event',
];

const iconColors = [
  'text-red-500',
  'text-orange-500',
  'text-amber-500',
  'text-yellow-500',
  'text-lime-500',
  'text-green-500',
  'text-emerald-500',
  'text-teal-500',
  'text-cyan-500',
  'text-sky-500',
  'text-blue-500',
  'text-indigo-500',
  'text-violet-500',
];

const LogsPage = () => {
  useSeo({
    title: 'Logs | Fezcodex',
    description: 'A collection of logs, thoughts, and other miscellaneous writings.',
    keywords: ['Fezcodex', 'logs', 'thoughts', 'writing'],
    ogTitle: 'Logs | Fezcodex',
    ogDescription: 'A collection of logs, thoughts, and other miscellaneous writings.',
    ogImage: '/images/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Logs | Fezcodex',
    twitterDescription: 'A collection of logs, thoughts, and other miscellaneous writings.',
    twitterImage: '/images/ogtitle.png',
  });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]); // Empty means all
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [iconColor, setIconColor] = useState('text-white');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { unlockAchievement } = useAchievements();
  const { openSidePanel } = useSidePanel();

  useEffect(() => {
    unlockAchievement('log_diver');
    const fetchLogs = async () => {
      try {
        const fetchPromises = categories.map(async (category) => {
          const response = await fetch(
            `/logs/${category.toLowerCase()}/${category.toLowerCase()}.piml`,
          );
          if (!response.ok) {
            // If a category PIML file is not found, return an empty array for that category
            console.warn(
              `Category PIML not found for ${category}: ${response.statusText}`,
            );
            return [];
          }
          const text = await response.text();
          const data = piml.parse(text);
          return data.logs || [];
        });

        const allLogsArrays = await Promise.all(fetchPromises);
        const combinedLogs = allLogsArrays.flat(); // Flatten the array of arrays

        const logsWithId = combinedLogs
          .map((log, index) => ({
            ...log,
            id: `${log.title}-${log.date}-${index}`,
            originalIndex: index,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(logsWithId);
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [unlockAchievement]);

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
          (log.description &&
            log.description.toLowerCase().includes(lowerQuery));
        return matchesCategory && matchesSearch;
      }),
    );
    const randomIconColor =
      iconColors[Math.floor(Math.random() * iconColors.length)];
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
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            size={16}
            weight="fill"
            className={i < rating ? 'text-yellow-500' : 'text-gray-700'}
          />
        ))}
      </div>
    );
  };

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
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold font-mono tracking-tight sm:text-6xl flex items-center text-white">
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
              </h1>
              <button
                onClick={() => setIsInfoModalOpen(true)}
                className="text-gray-500 hover:text-primary-400 transition-colors mt-2"
                aria-label="Rating System Info"
              >
                <InfoIcon size={32} />
              </button>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl font-mono">
              A digital garden of thoughts, reviews, and discoveries.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative group w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
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

        <hr className="border-gray-800 mb-8" />

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <div className="flex items-center gap-2 mr-2 text-gray-500 font-mono text-sm">
            <FunnelIcon size={16} />
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
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-all duration-200 ${isSelected ? 'bg-gray-800' : 'bg-gray-900/50 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200'}`}
              >
                {category}
              </button>
            );
          })}

          {(selectedCategories.length > 0 || searchQuery) && (
            <button
              onClick={clearFilters}
              className="font-arvo ml-auto text-sm text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <XCircle size={20} /> Clear
            </button>
          )}
        </div>

        {loading ? ( // Skeleton Grid
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
          </div> // Logs Grid
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredLogs.map((log) => (
                <motion.div
                  layout
                  key={log.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
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

      {/* Rating System Info Modal */}
      <GenericModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="About Logs & Ratings"
      >
        <div className="space-y-4">
          <p>
            The logs section serves as a digital garden for tracking various
            media consumption, thoughts, and discoveries across different
            categories like Books, Movies, Games, and more.
          </p>

          <div>
            <h3 className="font-bold text-white mb-2">Rating System</h3>
            <p className="text-sm mb-3">
              Items are rated on a 5-star scale based on personal enjoyment and
              quality:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-3">
                {renderStars(5)}
                <span className="text-gray-400">
                  - Exceptional / Masterpiece
                </span>
              </li>
              <li className="flex items-center gap-3">
                {renderStars(4)}
                <span className="text-gray-400">
                  - Great / Highly Recommended
                </span>
              </li>
              <li className="flex items-center gap-3">
                {renderStars(3)}
                <span className="text-gray-400">- Good / Worth your time</span>
              </li>
              <li className="flex items-center gap-3">
                {renderStars(2)}
                <span className="text-gray-400">- Average / Flawed</span>
              </li>
              <li className="flex items-center gap-3">
                {renderStars(1)}
                <span className="text-gray-400">- Poor / Not Recommended</span>
              </li>
            </ul>
            <button
              onClick={() => {
                setIsInfoModalOpen(false);
                unlockAchievement('east_side');
                openSidePanel(
                  'Rating System Details',
                  <RatingSystemDetail />,
                  600,
                );
              }}
              className="mt-6 flex items-center text-primary-400 hover:text-primary-300 transition-colors text-sm font-bold cursor-pointer"
            >
              <span>View Detailed Guide</span>
              <SidebarIcon className="ml-2" size={16} />
            </button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
};

export default LogsPage;
