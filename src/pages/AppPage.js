import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AxeIcon,
  ArrowLeftIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CaretRight,
  CaretDown,
  Star,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import AppCard from '../components/AppCard';
import useSeo from '../hooks/useSeo';
import { appIcons } from '../utils/appIcons';
import CustomDropdown from '../components/CustomDropdown';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_APPS_COLLAPSED_CATEGORIES } from '../utils/LocalStorageManager';

function AppPage() {
  useSeo({
    title: 'Apps | Fezcodex',
    description: 'All the available apps created within the Fezcodex.',
    keywords: [
      'Fezcodex',
      'apps',
      'applications',
      'blog',
      'dev',
      'rant',
      'series',
      'd&d',
    ],
    ogTitle: 'Apps | Fezcodex',
    ogDescription: 'All the available apps created within the Fezcodex.',
    ogImage: '/images/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Apps | Fezcodex',
    twitterDescription: 'All the available apps created within the Fezcodex.',
    twitterImage: '/images/ogtitle.png',
  });

  const [groupedApps, setGroupedApps] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [totalAppsCount, setTotalAppsCount] = useState(0);
  const [sortOption, setSortOption] = useState('default'); // 'default', 'created_desc', 'created_asc'
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = usePersistentState(
    KEY_APPS_COLLAPSED_CATEGORIES,
    {},
  );

  useEffect(() => {
    setIsLoading(true);
    fetch('/apps/apps.json')
      .then((response) => response.json())
      .then((data) => {
        setGroupedApps(data);
        let count = 0;
        for (const categoryKey in data) {
          if (categoryKey !== 'Bests') {
            count += data[categoryKey].apps.length;
          }
        }
        setTotalAppsCount(count);

        // Initialize collapsed state for new categories if needed (default open)
        setCollapsedCategories((prevState) => {
          const newState = { ...prevState };
          Object.keys(data).forEach((key) => {
            if (newState[key] === undefined) {
              newState[key] = false; // Default to open (false = not collapsed)
            }
          });
          return newState;
        });
      })
      .catch((error) => console.error('Error fetching apps:', error))
      .finally(() => {
        setIsLoading(false);
      });
  }, [setCollapsedCategories]);

  const toggleCategoryCollapse = (categoryKey) => {
    setCollapsedCategories((prevState) => ({
      ...prevState,
      [categoryKey]: !prevState[categoryKey],
    }));
  };

  const sortApps = (apps) => {
    return [...apps].sort((a, b) => {
      // First filter by search query if it exists
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchA =
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query);
        const matchB =
          b.title.toLowerCase().includes(query) ||
          b.description.toLowerCase().includes(query);
        if (matchA && !matchB) return -1;
        if (!matchA && matchB) return 1;
        if (!matchA && !matchB) return 0;
      }

      if (sortOption === 'default') return 0;

      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

      if (sortOption === 'created_desc') {
        return dateB - dateA;
      } else if (sortOption === 'created_asc') {
        return dateA - dateB;
      }
      return 0;
    });
  };

  const filterApps = (apps) => {
    if (!searchQuery) return apps;
    const query = searchQuery.toLowerCase();
    return apps.filter(
      (app) =>
        app.title.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query),
    );
  };

  const variants = {
    open: { opacity: 1, height: 'auto' },
    collapsed: { opacity: 0, height: 0 },
  };

  return (
    <div className="py-16 sm:py-24 bg-gray-950 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
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

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold font-mono tracking-tight sm:text-6xl mb-4 flex items-center text-white">
              <AxeIcon
                size={48}
                weight="fill"
                className="mr-4 text-primary-500"
              />
              <span className="text-gray-100">fc</span>
              <span className="text-gray-500">::</span>
              <span className="text-gray-100">apps</span>
              <span className="text-gray-500">::</span>
              <span className="text-gray-500">[</span>
              <span className="text-gray-100">{totalAppsCount}</span>
              <span className="text-gray-500">]</span>
              {/*<span className="ml-4 text-2xl text-gray-500 bg-gray-800 px-3 py-1 rounded-full font-mono align-middle">*/}
              {/*      {totalAppsCount}*/}
              {/*  </span>*/}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              A collection of tools, games, and utilities built with React and
              passion.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative group w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-800/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition-all"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-48">
              <CustomDropdown
                options={[
                  { label: 'Default', value: 'default' },
                  { label: 'Newest', value: 'created_desc' },
                  { label: 'Oldest', value: 'created_asc' },
                ]}
                value={sortOption}
                onChange={setSortOption}
                icon={FunnelIcon}
                label="Sort By"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-800 mb-12" />

        {isLoading ? (
          // Skeleton Loading State
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800/30 rounded-2xl p-6 h-64 animate-pulse border border-gray-700/50"
              >
                <div className="h-12 w-12 bg-gray-700/50 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-700/30 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700/30 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          // Content
          <div className="space-y-8">
            {Object.keys(groupedApps)
              .sort((a, b) => groupedApps[a].order - groupedApps[b].order)
              .map((categoryKey) => {
                const category = groupedApps[categoryKey];
                const CategoryIcon = appIcons[category.icon];

                const filteredApps = filterApps(category.apps);
                const sortedApps = sortApps(filteredApps);
                const isCollapsed = collapsedCategories[categoryKey];

                if (sortedApps.length === 0) return null;

                return (
                  <motion.div
                    key={categoryKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="border border-gray-800 rounded-2xl overflow-hidden bg-gray-900/50"
                  >
                    <div
                      className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-800/50 transition-colors"
                      onClick={() => toggleCategoryCollapse(categoryKey)}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-lg transition-colors ${isCollapsed ? 'bg-gray-800 text-gray-400' : 'bg-gray-800 text-primary-400'}`}
                        >
                          {CategoryIcon && (
                            <CategoryIcon
                              size={24}
                              weight={isCollapsed ? 'regular' : 'fill'}
                            />
                          )}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold font-mono text-gray-100 flex items-center gap-3">
                            {category.name}
                            <span className="text-sm font-normal text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700">
                              {sortedApps.length}
                            </span>
                          </h2>
                          <p className="text-gray-400 text-sm mt-1 font-mono">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-500">
                        {isCollapsed ? (
                          <CaretRight size={20} />
                        ) : (
                          <CaretDown size={20} />
                        )}
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.div
                          key="content"
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          variants={variants}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-gray-800/50 mt-2 pt-6">
                            {sortedApps.map((app, index) => (
                              <div key={app.slug || index} className="relative">
                                <AppCard app={app} />
                                {app.pinned_order && (
                                  <div className="absolute top-4 right-4 text-yellow-400 drop-shadow-md z-10 pointer-events-none">
                                    <Star weight="fill" size={24} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

            {searchQuery &&
              Object.keys(groupedApps).every(
                (key) => filterApps(groupedApps[key].apps).length === 0,
              ) && (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">
                    No apps found matching "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-primary-400 hover:text-primary-300 font-medium"
                  >
                    Clear search
                  </button>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppPage;
