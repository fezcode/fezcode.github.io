import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star, Hash } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Seo from '../../components/Seo';
import { appIcons } from '../../utils/appIcons';
import GenerativeArt from '../../components/GenerativeArt';

const PinnedAppCard = ({ app, index }) => {
  const Icon = appIcons[app.icon] || Star;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col overflow-hidden rounded-sm bg-zinc-900 border border-white/10 h-full"
    >
      <Link to={app.to} className="flex flex-col h-full">
        {/* Visual Header */}
        <div className="relative h-48 w-full overflow-hidden border-b border-white/5">
          <GenerativeArt
            seed={app.title + (app.icon || 'pinned')}
            className="w-full h-full opacity-40 transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />

          {/* Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="p-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-emerald-400 transform group-hover:scale-110 transition-transform duration-500">
              <Icon size={40} weight="duotone" />
            </div>
          </div>

          {/* Rank Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10">
            <span className="font-mono text-[10px] font-bold text-white uppercase tracking-widest">
              Rank {index + 1}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
              <Hash size={12} className="text-emerald-500" />
              ID: {String(app.pinned_order).padStart(3, '0')}
            </span>
            <span className="text-gray-700 text-[10px]">•</span>
            <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest">
              Pinned
            </span>
          </div>

          <h3 className="text-2xl font-bold font-sans uppercase text-white mb-3 group-hover:text-emerald-400 transition-colors tracking-tight">
            {app.title}
          </h3>

          <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed mb-6 flex-grow font-sans">
            {app.description}
          </p>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
              Open Application
            </span>
            <ArrowRight
              weight="bold"
              size={16}
              className="text-emerald-500 transform -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const BrutalistPinnedAppPage = () => {
  const [pinnedApps, setPinnedApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/apps/apps.json')
      .then((res) => res.json())
      .then((data) => {
        const allApps = Object.values(data).flatMap((cat) =>
          cat.apps.map((app) => ({ ...app, categoryName: cat.name })),
        );
        const pinned = allApps
          .filter((app) => app.pinned_order)
          .sort((a, b) => a.pinned_order - b.pinned_order);
        setPinnedApps(pinned);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
      <Seo
        title="Featured Apps | Fezcodex"
        description="A curated selection of core tools and essential applications."
        keywords={['pinned', 'apps', 'tools', 'featured', 'core']}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        {/* Header Section */}
        <header className="mb-20 text-center md:text-left">
          <Link
            to="/apps"
            className="mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft weight="bold" />
            <span>All Applications</span>
          </Link>

          <div className="flex flex-col gap-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none uppercase">
              Featured
            </h1>
            <p className="text-gray-400 font-mono text-sm max-w-2xl uppercase tracking-[0.2em] leading-relaxed mx-auto md:mx-0">
              A curated collection of essential tools and high-performance
              modules.
            </p>
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-80 w-full bg-white/5 border border-white/10 rounded-sm animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {pinnedApps.map((app, index) => (
              <motion.div
                key={app.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <PinnedAppCard app={app} index={index} />
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && pinnedApps.length === 0 && (
          <div className="py-32 text-center font-mono text-gray-600 uppercase tracking-widest border border-dashed border-white/10">
            No featured applications found.
          </div>
        )}
      </div>
    </div>
  );
};

export default BrutalistPinnedAppPage;
