import React from 'react';
import { motion } from 'framer-motion';
import { ArrowSquareOut } from '@phosphor-icons/react';
import GenerativeArt from './GenerativeArt';

const TransmissionTile = ({ item, categoryKey, onClick }) => {
  const getCategoryTheme = (key) => {
    switch (key) {
      case 'friends': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', badge: 'Signal' };
      case 'books': return { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', badge: 'Archive' };
      default: return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', badge: 'Node' };
    }
  };

  const theme = getCategoryTheme(categoryKey);
  const title = item.title;
  const subTitle = item.description || (item.author ? `By ${item.author}` : '');

  const handleClick = (e) => {
    e.preventDefault();
    onClick(item);
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative flex flex-col overflow-hidden rounded-sm bg-[#0c0a09] border border-white/10 h-full transition-all duration-500 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]"
    >
      {/* Subtle Brown Overlay */}
      <div className="absolute inset-0 bg-[#443627] opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity" />

      {/* Corner Accents */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20 group-hover:border-emerald-500 transition-colors z-20" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20 group-hover:border-emerald-500 transition-colors z-20" />

      <button
        onClick={handleClick}
        className="flex flex-col h-full text-left relative z-10"
      >
        {/* Visual Header */}
        <div className="relative h-48 w-full overflow-hidden border-b border-white/5">
          <GenerativeArt
            seed={"2"+title+"[]"}
            className="w-full h-full opacity-40 transition-transform duration-1000 ease-out group-hover:scale-125 group-hover:opacity-60 sepia-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/20 to-transparent" />

          {/* CSS Scanline Overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <span
              className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest border rounded-sm transition-all duration-300 text-gray-300"
              style={{
                borderColor: theme.color,
                backgroundColor: theme.bg,
              }}
            >
              {theme.badge}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-8 relative bg-inherit">
          <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-white/5 uppercase select-none tracking-widest">
            {categoryKey}
          </div>

          <h3 className="text-3xl font-normal font-playfairDisplay text-white mb-4 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight tracking-tighter">
            {title}
          </h3>

          <p className="text-base text-gray-400 font-arvo line-clamp-3 mb-8 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
            {subTitle}
          </p>

          <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5 group-hover:border-emerald-500/20 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gray-500 group-hover:text-white transition-colors">
                Access Intel
              </span>
            </div>
            <ArrowSquareOut
              weight="bold"
              size={18}
              className="text-emerald-500 transform -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            />
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export default TransmissionTile;
