import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Funnel,
  MagnifyingGlass,
  CaretRight,
  CaretDown,
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
    description: 'A collection of tools, games, and utilities created within Fezcodex.',
    keywords: ['Fezcodex', 'apps', 'utilities', 'tools', 'react'],
  });

  const [groupedApps, setGroupedApps] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [totalAppsCount, setTotalAppsCount] = useState(0);
  const [sortOption, setSortOption] = useState('default');
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

        setCollapsedCategories((prevState) => {
          const newState = { ...prevState };
          Object.keys(data).forEach((key) => {
            if (newState[key] === undefined) {
              newState[key] = false;
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
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchA = a.title.toLowerCase().includes(query) || a.description.toLowerCase().includes(query);
        const matchB = b.title.toLowerCase().includes(query) || b.description.toLowerCase().includes(query);
        if (matchA && !matchB) return -1;
        if (!matchA && matchB) return 1;
      }
      if (sortOption === 'default') return 0;
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return sortOption === 'created_desc' ? dateB - dateA : dateA - dateB;
    });
  };

  const filterApps = (apps) => {
    if (!searchQuery) return apps;
    const query = searchQuery.toLowerCase();
    return apps.filter(app => app.title.toLowerCase().includes(query) || app.description.toLowerCase().includes(query));
  };

  const variants = {
    open: { opacity: 1, height: 'auto', marginBottom: 40 },
    collapsed: { opacity: 0, height: 0, marginBottom: 0 },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

        {/* Header Section */}
        <header className="mb-20">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft weight="bold" />
            <span>Home</span>
          </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                      <div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none uppercase">
                          Apps
                        </h1>
                        <p className="text-gray-400 font-mono text-sm max-w-sm uppercase tracking-widest">
                          Total Apps: {totalAppsCount}
                        </p>
                      </div>
                    </div>
                  </header>

                  {/* Controls: Search & Sort */}
                  <div className="sticky top-0 z-30 bg-[#050505]/95 backdrop-blur-sm border-b border-white/10 pb-6 pt-2 mb-12">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                          <div className="relative flex-1 group">
                             <MagnifyingGlass className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={20} />
                             <input
                                type="text"
                                placeholder="Search apps..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-b border-gray-800 pl-8 text-xl md:text-2xl font-light text-white placeholder-gray-700 focus:border-emerald-500 focus:outline-none py-2 transition-colors font-mono"
                             />
                          </div>
                <div className="w-full md:w-64">
                  <CustomDropdown
                    options={[
                      { label: 'Default Order', value: 'default' },
                      { label: 'Newest First', value: 'created_desc' },
                      { label: 'Oldest First', value: 'created_asc' },
                    ]}
                    value={sortOption}
                    onChange={setSortOption}
                    icon={Funnel}
                    label="Sort"
                    variant="brutalist"
                  />
                </div>
            </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 w-full bg-white/5 border border-white/10 rounded-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-16">
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
                  <div key={categoryKey} className="relative">
                    <button
                      className="w-full flex items-center justify-between py-4 border-b border-white/10 group mb-8"
                      onClick={() => toggleCategoryCollapse(categoryKey)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 transition-colors ${isCollapsed ? 'text-gray-600' : 'text-emerald-500'}`}>
                          {CategoryIcon && <CategoryIcon size={24} weight={isCollapsed ? 'regular' : 'fill'} />}
                        </div>
                        <div className="text-left">
                          <h2 className="text-2xl font-bold font-sans uppercase tracking-tight text-gray-200 group-hover:text-white transition-colors">
                            {category.name}
                            <span className="ml-4 font-mono text-xs font-normal text-gray-500">[{sortedApps.length}]</span>
                          </h2>
                        </div>
                      </div>
                      <div className="text-gray-600 group-hover:text-white transition-colors">
                        {isCollapsed ? <CaretRight size={20} weight="bold" /> : <CaretDown size={20} weight="bold" />}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.div
                          key="content"
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          variants={variants}
                          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sortedApps.map((app, index) => (
                              <AppCard key={app.slug || index} app={app} />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

            {searchQuery && Object.keys(groupedApps).every(key => filterApps(groupedApps[key].apps).length === 0) && (
                <div className="py-32 text-center font-mono text-gray-600 uppercase tracking-widest border border-dashed border-white/10">
                   No apps matching "{searchQuery}" found in archive.
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppPage;
