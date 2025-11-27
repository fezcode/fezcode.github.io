import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon, PushPin, Star, ArrowRight, Crown} from '@phosphor-icons/react';
import {motion} from 'framer-motion';
import useSeo from '../hooks/useSeo';
import {appIcons} from '../utils/appIcons';

const PinnedAppCard = ({app, index}) => {
  const Icon = appIcons[app.icon] || Star;
  const isTop3 = index < 3;
  // Special styling for Top 3
  const rankColors = {
    0: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10', // Gold
    1: 'text-gray-300 border-gray-400/50 bg-gray-400/10',       // Silver
    2: 'text-amber-600 border-amber-700/50 bg-amber-700/10',     // Bronze
  };

  const rankStyle = rankColors[index] || 'text-gray-500 border-gray-700/50 bg-gray-800/50';
  return (
    <Link to={app.to}
          className={`block group relative h-full ${isTop3 ? 'col-span-1 md:col-span-1 lg:col-span-1' : ''}`}>
      <div
        className={`relative flex flex-col h-full bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-gray-800/80 transition-all duration-300 overflow-hidden group-hover:border-primary-500/30 group-hover:shadow-2xl group-hover:shadow-primary-500/20 group-hover:-translate-y-2`}>
        {/* Watermark Icon */}
        <div
          className="absolute -bottom-10 -right-10 opacity-20 group-hover:opacity-30 transition-opacity duration-500 rotate-12 pointer-events-none text-white">
          <Icon size={220} weight="fill"/>
        </div>
        {/* Rank Badge */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div
            className={`p-3 rounded-2xl bg-gray-800/80 border border-white/5 text-primary-400 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
            <Icon size={32} weight="duotone"/>
          </div>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border ${rankStyle} font-bold font-mono text-lg shadow-sm backdrop-blur-sm`}>
            {index < 3 && <Crown size={14} weight="fill" className="mr-1 -ml-1"/>}
            {app.pinned_order}
          </div>
        </div>
        <div className="relative z-10 flex-grow">
          <h3
            className={`font-bold text-white mb-3 group-hover:text-primary-400 transition-colors font-mono ${isTop3 ? 'text-2xl' : 'text-xl'}`}>
            {app.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors">
            {app.description}
          </p>
        </div>
        <div
          className="relative z-10 mt-6 flex items-center text-sm font-medium text-primary-400 group-hover:text-primary-300 transition-colors">
          Launch App <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1"/>
        </div>
      </div>
    </Link>
  );
};
const PinnedAppPage = () => {
  useSeo({
    title: 'Pinned Apps | Fezcodex',
    description: 'A curated selection of my favorite and most used apps.',
    keywords: ['pinned', 'favorite', 'apps', 'tools', 'hall of fame'],
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
      {/* Background Glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"/>
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"/>

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

          >

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white font-mono mb-6">

              Hall of <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Fame</span>

            </h1>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">

              The essential toolkit. Hand-picked and pinned for quick access.

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
    </div>
  );
};

export default PinnedAppPage;
