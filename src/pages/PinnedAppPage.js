import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon, ArrowRight, Star, Cpu, Globe, TerminalWindow} from '@phosphor-icons/react';
import {motion} from 'framer-motion';
import useSeo from '../hooks/useSeo';
import {appIcons} from '../utils/appIcons';

const PinnedAppCard = ({app, index}) => {
  const Icon = appIcons[app.icon] || Star;

  // Dynamic accent color based on rank
  const accentGradient = index === 0 ? 'from-yellow-400 via-orange-500 to-yellow-600' : // Gold
    index === 1 ? 'from-gray-200 via-gray-400 to-slate-500' :      // Silver
      index === 2 ? 'from-amber-700 via-orange-800 to-amber-900' :    // Bronze
        'from-cyan-500 via-blue-500 to-indigo-600';       // Cyber Blue

  return (
    <Link to={app.to} className="block group relative h-full">
      {/* Animated Glow Border */}
      <div
        className={`absolute -inset-[1px] bg-gradient-to-br ${accentGradient} rounded-2xl opacity-30 group-hover:opacity-100 blur-sm transition-opacity duration-500`}></div>

      {/* Main Card Container */}

      <div
        className="relative flex flex-col h-full bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 overflow-hidden group-hover:border-gray-700 transition-all duration-300 shadow-xl">

        {/* Subtle Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
             style={{
               backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }}>
        </div>

        {/* Watermark Icon - Restored */}
        <div
          className="absolute -bottom-8 -right-8 text-gray-700 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 rotate-12 pointer-events-none z-0">
          <Icon size={180} weight="fill"/>
        </div>

        {/* Header: ID and Rank */}

        <div className="flex justify-between items-start mb-4 relative z-10 border-b border-white/10 pb-3">

          <div className="flex flex-col">

            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono">System.App</span>

            <span
              className="text-xs font-mono text-primary-400/80">ID :: {String(app.pinned_order).padStart(3, '0')}</span>

          </div>

          <div
            className={`flex items-center justify-center w-8 h-8 rounded font-mono font-bold text-sm border ${index < 3 ? 'bg-white/10 text-white border-white/20' : 'bg-gray-900 text-gray-500 border-gray-800'}`}>

            {app.pinned_order}

          </div>

        </div>
        {/* Icon & Title */}

        <div className="relative z-10 flex-grow">

          <div className="mb-4 flex items-center justify-between">

            <div
              className={`p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300 group-hover:border-gray-600`}>

              <Icon size={32} weight="duotone"/>

            </div>

            <Cpu size={24} className="text-gray-800 group-hover:text-gray-600 transition-colors"/>

          </div>

          <h3
            className="text-xl font-bold font-mono text-white mb-2 tracking-tight group-hover:text-primary-400 transition-colors">

            {app.title}

          </h3>
          <p className="text-gray-500 font-mono text-sm leading-relaxed line-clamp-3">

            <span className="text-gray-700 select-none mr-2">{'>'}</span>

            {app.description}

          </p>

        </div>
        {/* Footer: Status */}

        <div className="relative z-10 mt-6 pt-3 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span
              className="text-[10px] font-mono uppercase tracking-wider text-gray-500 group-hover:text-green-400 transition-colors">Online</span>
          </div>
          <ArrowRight size={14}
                      className="text-gray-600 group-hover:text-white transform group-hover:translate-x-1 transition-all"/>
        </div>
      </div>
    </Link>
  );
};

const PinnedAppPage = () => {
  useSeo({
    title: 'Pinned Apps | Fezcodex',
    description: 'Core system modules and essential tools.',
    keywords: ['pinned', 'apps', 'tools', 'system', 'core'],
  });

  const [pinnedApps, setPinnedApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/apps/apps.json')
      .then((res) => res.json())
      .then((data) => {
        const allApps = Object.values(data).flatMap((cat) => categoryToApps(cat));
        const pinned = allApps
          .filter((app) => app.pinned_order)
          .sort((a, b) => a.pinned_order - b.pinned_order);
        setPinnedApps(pinned);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const categoryToApps = (category) => {
    return category.apps.map(app => ({...app, categoryName: category.name}));
  };

  return (
    <div className="min-h-screen bg-gray-950 py-16 sm:py-24 relative overflow-hidden">
      {/* Techno Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.05]"
             style={{
               backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }}>
        </div>

        {/* Glows */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-primary-500/10 blur-[120px] rounded-full mix-blend-screen"/>
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen"/>

                {/* Scanline Animation */}

                <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-primary-400/20 to-transparent opacity-40 animate-scanline"></div>

              </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="relative mb-16 text-center">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:block">
            <Link
              to="/"
              className="group text-primary-400 hover:text-primary-300 hover:underline flex items-center gap-2 text-sm transition-colors"
            >
              <ArrowLeftIcon size={18} className="transition-transform group-hover:-translate-x-1"/> Home
            </Link>
          </div>

          <motion.div

            initial={{opacity: 0, y: 20}}

            animate={{opacity: 1, y: 0}}

            transition={{duration: 0.5}}

            className="text-center"

          >

            <div
              className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gray-900/50 border border-gray-800 backdrop-blur-sm">

              <TerminalWindow size={32} className="text-primary-500"/>

            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white font-mono mb-4">

              SYSTEM_CORE <span className="text-gray-600">//</span> PINNED

            </h1>

            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto font-mono tracking-wide">

              [ ACCESSING ESSENTIAL MODULES AND TOOLS ]

            </p>

          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-900/30 border border-gray-800 rounded-3xl h-72 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {pinnedApps.map((app, index) => (
              <motion.div
                key={app.slug}
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.3, delay: index * 0.05}}
              >
                <PinnedAppCard app={app} index={index}/>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PinnedAppPage;
