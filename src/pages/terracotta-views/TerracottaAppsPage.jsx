import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  CaretDownIcon,
  XIcon,
  FingerprintIcon,
  CubeIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowUpRightIcon,
  AtomIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/Seo';
import { appIcons } from '../../utils/appIcons';
import usePersistentState from '../../hooks/usePersistentState';
import { KEY_APPS_COLLAPSED_CATEGORIES } from '../../utils/LocalStorageManager';
import ArcaneSigil from '../../components/ArcaneSigil';

const SectionBackground = ({ seed }) => (
  <>
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05]">
      <svg width="100%" height="100%" className="absolute inset-0">
        <pattern id={`pattern-${seed}`} x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 10 10 L 90 10 L 90 90 L 10 90 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="1" fill="currentColor" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#pattern-${seed})`} />
      </svg>
    </div>
    <div className="absolute right-0 top-0 w-96 h-96 -mr-32 -mt-32 pointer-events-none opacity-10">
      <ArcaneSigil seed={seed} color="currentColor" className="w-full h-full" />
    </div>
  </>
);

const AppModule = ({ app, index, categoryName }) => {
  const AppIcon = appIcons[app.icon] || appIcons[`${app.icon}Icon`] || CubeIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: -4, y: -4 }}
      transition={{ delay: index * 0.02, type: 'spring', stiffness: 400, damping: 15 }}
      className="group relative"
    >
      <Link
        to={app.to}
        className="block relative aspect-square md:aspect-auto md:h-64 bg-[#F3ECE0] border border-[#1A161320] overflow-hidden hover:bg-[#1A1613] transition-all duration-300 shadow-[0_20px_40px_-25px_#1A161330]"
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700 overflow-hidden pointer-events-none">
          <div className="w-full h-full border-[0.5px] border-current opacity-30 rotate-45 scale-150" />
        </div>

        <div className="relative p-3 border-b border-[#1A161320] flex justify-between items-center bg-[#E8DECE]/40 group-hover:border-[#F3ECE0]/10 group-hover:bg-[#F3ECE0]/5 transition-colors">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#2E2620]/50 group-hover:text-[#F3ECE0]/50 transition-colors">
            {categoryName}
          </span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-[#2E2620]/30 rounded-full group-hover:bg-[#F3ECE0]/30" />
          </div>
        </div>

        <div className="relative p-5 flex flex-col h-[calc(100%-40px)] justify-between z-10">
          <div className="flex items-start justify-between">
            <div className="p-2.5 bg-[#E8DECE]/60 border border-[#1A161320] text-[#1A1613] group-hover:bg-[#F3ECE0] group-hover:text-[#1A1613] group-hover:border-[#F3ECE0] transition-all duration-500">
              <AppIcon size={24} weight="light" />
            </div>
            <ArrowUpRightIcon size={16} className="text-[#2E2620]/30 group-hover:text-[#F3ECE0]/40 transition-colors" />
          </div>

          <div>
            <h3 className="text-2xl font-playfairDisplay italic leading-tight mb-2 text-[#1A1613] group-hover:text-[#F3ECE0] transition-colors">
              {app.title}
            </h3>
            <p className="text-xs font-mono text-[#2E2620]/60 line-clamp-2 leading-relaxed group-hover:text-[#F3ECE0]/60 transition-colors">
              {app.description}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-all">
            <div className="h-[1px] flex-1 bg-[#F3ECE0]/20" />
            <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#F3ECE0]/60">Initialize</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const TerracottaAppsPage = () => {
  const [groupedApps, setGroupedApps] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = usePersistentState(
    KEY_APPS_COLLAPSED_CATEGORIES,
    {},
  );

  useEffect(() => {
    setIsLoading(true);
    fetch('/apps/apps.json')
      .then((res) => res.json())
      .then((data) => {
        setGroupedApps(data);
        setCollapsedCategories((prev) => {
          const next = { ...prev };
          Object.keys(data).forEach((k) => {
            if (next[k] === undefined) next[k] = false;
          });
          return next;
        });
      })
      .catch((err) => console.error('Failed to fetch apps:', err))
      .finally(() => setIsLoading(false));
  }, [setCollapsedCategories]);

  const appsFlat = useMemo(() => {
    const list = [];
    Object.keys(groupedApps).forEach((k) => {
      groupedApps[k].apps.forEach((app) => {
        list.push({ ...app, category: k });
      });
    });
    return list;
  }, [groupedApps]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return groupedApps;
    const query = searchQuery.toLowerCase();
    const result = {};
    Object.keys(groupedApps).forEach((k) => {
      const filtered = groupedApps[k].apps.filter(
        (app) =>
          app.title.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query),
      );
      if (filtered.length > 0) {
        result[k] = { ...groupedApps[k], apps: filtered };
      }
    });
    return result;
  }, [groupedApps, searchQuery]);

  const toggleCategory = (key) => {
    setCollapsedCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#F3ECE0] text-[#1A1613] selection:bg-[#C96442]/25 font-playfairDisplay overflow-x-hidden">
      <Seo title="Archive // Fezcodex" description="A collection of digital tools and artifacts." />

      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A161308_1px,transparent_1px),linear-gradient(to_bottom,#1A161308_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto p-6 md:p-12">
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 pb-12 border-b border-[#1A161320]">
          <div className="lg:col-span-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 group text-[10px] uppercase tracking-[0.4em] text-[#2E2620]/50 hover:text-[#1A1613] transition-colors mb-12"
            >
              <ArrowLeftIcon size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Return to Home</span>
            </Link>

            <h1 className="text-6xl md:text-9xl font-playfairDisplay italic tracking-tight leading-[0.85] mb-8 text-[#1A1613]">
              Application
              <br />
              Archive
            </h1>

            <p className="text-[#2E2620] max-w-xl text-lg leading-relaxed">
              An exhaustive collection of experimental software, digital utilities, and interactive artifacts.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end space-y-8">
            <div className="bg-[#E8DECE]/60 border border-[#1A161320] p-5 font-mono text-[10px] uppercase tracking-[0.2em] space-y-2">
              <div className="flex justify-between border-b border-[#1A161320] pb-2">
                <span className="text-[#2E2620]/60">Total Items</span>
                <span className="text-[#1A1613]">{appsFlat.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#2E2620]/60">Status</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#6B8E23] rounded-full animate-pulse" />
                  <span className="text-[#6B8E23]">Active</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Filter by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b-2 border-[#1A161320] py-6 px-2 focus:border-[#C96442] focus:outline-none transition-all font-playfairDisplay italic text-3xl placeholder-[#2E2620]/15 text-[#1A1613]"
              />
              <MagnifyingGlassIcon size={32} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2E2620]/30" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          <aside className="xl:col-span-3 hidden xl:block space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <ClockIcon size={20} className="text-[#2E2620]/60" />
                <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#2E2620]/80">
                  Recently Added
                </h2>
              </div>
              <div className="space-y-4">
                {appsFlat
                  .filter((a) => a.created_at)
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .slice(0, 4)
                  .map((app) => (
                    <Link
                      key={app.slug}
                      to={app.to}
                      className="group block p-4 bg-[#E8DECE]/40 border border-[#1A161320] hover:border-[#1A1613] transition-all"
                    >
                      <span className="block text-sm font-playfairDisplay italic mb-1 group-hover:text-[#1A1613] text-[#2E2620] transition-colors">
                        {app.title}
                      </span>
                      <span className="block text-[9px] font-mono text-[#2E2620]/50 uppercase tracking-widest">
                        {app.category}
                      </span>
                    </Link>
                  ))}
              </div>
            </section>

            <div className="p-8 border border-[#1A161320] bg-[#E8DECE]/30 relative overflow-hidden group">
              <div className="flex items-center gap-2 mb-6 font-mono text-[10px] uppercase tracking-widest text-[#2E2620]/60">
                <AtomIcon /> System Integrity
              </div>
              <div className="w-full h-32 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity">
                <ArcaneSigil seed="SidebarVisualizer" color="currentColor" className="w-full h-full" />
              </div>
            </div>
          </aside>

          <main className="xl:col-span-9 space-y-12">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-64 bg-[#E8DECE]/60 animate-pulse border border-[#1A161320]" />
                ))}
              </div>
            ) : (
              Object.keys(filteredData)
                .sort((a, b) => filteredData[a].order - filteredData[b].order)
                .map((categoryKey) => {
                  const category = filteredData[categoryKey];
                  const isCollapsed = collapsedCategories[categoryKey];

                  return (
                    <section key={categoryKey} className="relative border border-[#1A161320] bg-[#F3ECE0]/50 overflow-hidden">
                      <SectionBackground seed={categoryKey} />

                      <button
                        onClick={() => toggleCategory(categoryKey)}
                        className="relative w-full flex items-center justify-between p-6 md:p-10 hover:bg-[#E8DECE]/40 transition-colors group z-10"
                      >
                        <div className="flex items-center gap-6">
                          <div className="text-4xl md:text-6xl font-playfairDisplay italic group-hover:translate-x-2 transition-transform text-[#1A1613]">
                            {category.name}
                          </div>
                          <div className="hidden md:block h-[1px] w-32 bg-[#1A161320] group-hover:w-40 transition-all" />
                          <span className="font-mono text-[10px] text-[#2E2620]/40 uppercase tracking-[0.3em] group-hover:text-[#2E2620]/60">
                            {category.apps.length} Modules
                          </span>
                        </div>
                        <div className={`transition-transform duration-500 ${isCollapsed ? '' : 'rotate-180'}`}>
                          <CaretDownIcon size={24} weight="thin" />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {!isCollapsed && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                            className="relative overflow-hidden z-10"
                          >
                            <div className="p-6 md:p-10 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {category.apps.map((app, i) => (
                                <AppModule key={app.slug} app={app} index={i} categoryName={category.name} />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>
                  );
                })
            )}

            {!isLoading && Object.keys(filteredData).length === 0 && (
              <div className="py-32 text-center">
                <XIcon size={64} weight="thin" className="mx-auto mb-8 text-[#1A161320]" />
                <h2 className="text-4xl font-playfairDisplay italic mb-4 text-[#1A1613]">No Entries Found</h2>
                <p className="text-[#2E2620]/50 uppercase tracking-[0.2em] text-[10px]">Modify filter and retry</p>
              </div>
            )}
          </main>
        </div>

        <footer className="mt-48 pt-12 border-t border-[#1A161320] grid grid-cols-1 md:grid-cols-3 gap-12 opacity-40 hover:opacity-100 transition-all duration-700">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#1A1613]">
              <ShieldCheckIcon size={24} />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Secure Archive</span>
            </div>
            <p className="text-[9px] uppercase tracking-widest leading-relaxed text-[#2E2620]">
              All artifacts are property of the Fezcodex Collective.
            </p>
          </div>

          <div className="flex flex-col justify-center items-center gap-3">
            <div className="flex gap-1">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`w-1 h-3 ${i < 9 ? 'bg-[#1A1613]' : 'bg-[#1A161320]'}`} />
              ))}
            </div>
            <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#1A1613]">
              Protocol Synchronized
            </span>
          </div>

          <div className="text-right flex flex-col items-end justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-playfairDisplay italic leading-none mb-1 text-[#1A1613]">
                  Ahmed Samil Bulbul
                </span>
                <span className="font-mono text-[8px] text-[#2E2620]/50 tracking-[0.2em] uppercase">
                  System Architect
                </span>
              </div>
              <div className="w-12 h-12 bg-[#E8DECE]/60 border border-[#1A161320] flex items-center justify-center">
                <FingerprintIcon size={24} weight="thin" />
              </div>
            </div>
            <p className="text-[8px] tracking-[0.5em] uppercase mt-8 text-[#1A1613]">
              FCX_OS // Archive v0.9.6
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TerracottaAppsPage;
