import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  StarIcon,
  HashIcon,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Seo from '../../components/Seo';
import { appIcons } from '../../utils/appIcons';
import GenerativeArt from '../../components/GenerativeArt';

const PinnedAppCard = ({ app, index }) => {
  const Icon = appIcons[app.icon] || StarIcon;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col overflow-hidden rounded-sm bg-[#F3ECE0] border border-[#1A161320] h-full shadow-[0_20px_40px_-25px_#1A161330]"
    >
      <Link to={app.to} className="flex flex-col h-full">
        <div className="relative h-48 w-full overflow-hidden border-b border-[#1A161320]">
          <GenerativeArt
            seed={app.title + (app.icon || 'pinned')}
            className="w-full h-full opacity-50 transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F3ECE0] to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="p-4 rounded-full bg-[#1A1613]/80 backdrop-blur-md border border-[#F3ECE0]/10 text-[#C96442] transform group-hover:scale-110 transition-transform duration-500">
              <Icon size={40} weight="duotone" />
            </div>
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-[#1A1613]/80 backdrop-blur-md rounded border border-[#F3ECE0]/10">
            <span className="font-mono text-[10px] font-bold text-[#F3ECE0] uppercase tracking-widest">
              Rank {index + 1}
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-grow p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] text-[#2E2620]/60 uppercase tracking-widest flex items-center gap-1">
              <HashIcon size={12} className="text-[#C96442]" />
              ID: {String(app.pinned_order).padStart(3, '0')}
            </span>
            <span className="text-[#2E2620]/30 text-[10px]">•</span>
            <span className="font-mono text-[10px] text-[#9E4A2F] uppercase tracking-widest">
              Pinned
            </span>
          </div>

          <h3 className="text-2xl font-playfairDisplay italic text-[#1A1613] mb-3 group-hover:text-[#9E4A2F] transition-colors tracking-tight">
            {app.title}
          </h3>

          <p className="text-sm text-[#2E2620] line-clamp-3 leading-relaxed mb-6 flex-grow">
            {app.description}
          </p>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#1A161320]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2E2620]/60 group-hover:text-[#1A1613] transition-colors">
              Open Application
            </span>
            <ArrowRightIcon
              weight="bold"
              size={16}
              className="text-[#C96442] transform -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const TerracottaPinnedAppPage = () => {
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
    <div className="min-h-screen bg-[#F3ECE0] text-[#1A1613] selection:bg-[#C96442]/25">
      <Seo title="Featured Apps | Fezcodex" description="A curated selection of core tools." />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-20 text-center md:text-left">
          <Link
            to="/apps"
            className="mb-12 inline-flex items-center gap-2 text-xs font-mono text-[#2E2620]/60 hover:text-[#1A1613] transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>All Applications</span>
          </Link>

          <div className="flex flex-col gap-4">
            <h1 className="text-6xl md:text-8xl font-playfairDisplay italic tracking-tight text-[#1A1613] mb-4 leading-none">
              Featured
            </h1>
            <p className="text-[#2E2620]/70 font-mono text-sm max-w-2xl uppercase tracking-[0.2em] leading-relaxed mx-auto md:mx-0">
              A curated collection of essential tools and high-performance modules.
            </p>
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-80 w-full bg-[#E8DECE]/50 border border-[#1A161320] rounded-sm animate-pulse"
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
          <div className="py-32 text-center font-mono text-[#2E2620]/50 uppercase tracking-widest border border-dashed border-[#1A161320]">
            No featured applications found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TerracottaPinnedAppPage;
