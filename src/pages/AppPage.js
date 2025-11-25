import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CaretDown,
  CaretRight,
  FunnelIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence
import AppCard from '../components/AppCard';
import useSeo from '../hooks/useSeo';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_APPS_COLLAPSED_CATEGORIES } from '../utils/LocalStorageManager';
import { appIcons } from '../utils/appIcons'; // Import appIcons
import CustomDropdown from '../components/CustomDropdown'; // Import CustomDropdown

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
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Apps | Fezcodex',
    twitterDescription: 'All the available apps created within the Fezcodex.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [groupedApps, setGroupedApps] = useState({});
  const [collapsedCategories, setCollapsedCategories] = usePersistentState(
    KEY_APPS_COLLAPSED_CATEGORIES,
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [totalAppsCount, setTotalAppsCount] = useState(0); // New state for total app count
  const [sortOption, setSortOption] = useState('default'); // 'default', 'created_desc', 'created_asc'

  useEffect(() => {
    setIsLoading(true);
    fetch('/apps/apps.json')
      .then((response) => response.json())
      .then((data) => {
        setGroupedApps(data);
        setCollapsedCategories((prevState) => {
          const newState = { ...prevState };
          Object.keys(data).forEach((key) => {
            if (newState[key] === undefined) {
              newState[key] = false; // Default to open
            }
          });
          return newState;
        });

        // Calculate total number of apps
        let count = 0;
        for (const categoryKey in data) {
          count += data[categoryKey].apps.length;
        }
        setTotalAppsCount(count);
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
    if (sortOption === 'default') return apps;

    return [...apps].sort((a, b) => {
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

  const variants = {
    open: { opacity: 1, height: 'auto' },
    collapsed: { opacity: 0, height: 0 },
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/"
          className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon size={24} /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">[{totalAppsCount}]</span>
        </h1>
        <hr className="border-gray-700" />

        <div className="flex justify-end mt-4 mb-2">
          <CustomDropdown
            options={[
              { label: 'Default', value: 'default' },
              { label: 'Newest First', value: 'created_desc' },
              { label: 'Oldest First', value: 'created_asc' },
            ]}
            value={sortOption}
            onChange={setSortOption}
            icon={FunnelIcon}
            label="Sort By"
          />
        </div>

        {isLoading ? (
          // Skeleton Loading State
          <div className="mt-8">
            {[...Array(3)].map(
              (
                _,
                categoryIndex, // Simulate 3 categories
              ) => (
                <div key={categoryIndex} className="mb-8">
                  <div className="h-8 bg-gray-700 rounded w-1/3 mb-4 animate-pulse"></div>{' '}
                  {/* Category Title */}
                  <div className="h-4 bg-gray-800 rounded w-1/2 mb-6 animate-pulse"></div>{' '}
                  {/* Category Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map(
                      (
                        _,
                        appIndex, // Simulate 3 app cards per category
                      ) => (
                        <div
                          key={appIndex}
                          className="bg-gray-800 rounded-lg shadow-lg p-6 h-40 animate-pulse"
                        >
                          <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          // Actual Content
          Object.keys(groupedApps)
            .sort((a, b) => groupedApps[a].order - groupedApps[b].order)
            .map((categoryKey) => {
              const category = groupedApps[categoryKey];
              const CategoryIcon = appIcons[category.icon];
              return (
                <div key={categoryKey} className="mt-8">
                  <h2
                    className="text-3xl font-arvo font-normal tracking-tight text-gray-200 mb-2 flex items-center cursor-pointer"
                    onClick={() => toggleCategoryCollapse(categoryKey)}
                  >
                    {collapsedCategories[categoryKey] ? (
                      <CaretRight size={24} className="mr-2" />
                    ) : (
                      <CaretDown size={24} className="mr-2" />
                    )}
                    {CategoryIcon && (
                      <CategoryIcon size={28} className="mr-2" />
                    )}
                    {category.name} ({category.apps.length})
                  </h2>
                  <p className="text-gray-400 mb-4 ml-10">
                    {category.description}
                  </p>
                  <AnimatePresence initial={false}>
                    {!collapsedCategories[categoryKey] && (
                      <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={variants}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {sortApps(category.apps).map((app, index) => (
                            <AppCard key={index} app={app} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}

export default AppPage;
