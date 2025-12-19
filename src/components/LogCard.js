import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CalendarBlank } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import GenerativeArt from './GenerativeArt';
import colors from '../config/colors';

const LogCard = ({ log, index, totalLogs }) => {
  const {
    title,
    category,
    author,
    by,
    director,
    artist,
    creator,
    date,
    rating,
    slug,
    image,
    platform,
    source
  } = log;

  // Resolve the primary creator/source
  const creatorName = by || author || artist || creator || director;
  const sourceName = platform || source;
  const categoryColor = colors[category.toLowerCase()] || colors.primary[400];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col overflow-hidden rounded-sm bg-zinc-900 border border-white/10 h-full"
    >
      <Link to={`/logs/${category.toLowerCase()}/${slug}`} className="flex flex-col h-full">
        {/* Visual Header */}
        <div className="relative h-40 w-full overflow-hidden border-b border-white/5">
           {image ? (
               <div className="w-full h-full relative">
                 <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-60" />
                 <div className="absolute inset-0 bg-zinc-900/40 mix-blend-multiply" />
               </div>
           ) : (
             <GenerativeArt
                seed={title + category}
                className="w-full h-full opacity-40 transition-transform duration-700 ease-out group-hover:scale-110"
             />
           )}

          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
             <span
                className="px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-widest border rounded-sm backdrop-blur-md"
                style={{
                    color: categoryColor,
                    backgroundColor: `${categoryColor}10`,
                    borderColor: `${categoryColor}20`
                }}
             >
                {category}
             </span>
          </div>

          {/* Rating Badge */}
           {rating > 0 && (
             <div className="absolute bottom-2 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                 <span className="font-mono text-xs font-bold text-white">{rating}</span>
                 <Star weight="fill" size={10} className="text-yellow-500" />
             </div>
           )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-5">
          <div className="flex items-center gap-2 mb-3">
             <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <CalendarBlank size={12} />
                {date}
             </span>
             <span className="text-gray-700 text-[9px]">•</span>
             <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                #{String(totalLogs - index).padStart(3, '0')}
             </span>
          </div>

          <h3 className="text-lg font-medium font-sans uppercase text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight">
            {title}
          </h3>

          <div className="mb-4">
             {creatorName && (
               <p className="text-xs text-gray-400 font-mono truncate">By {creatorName}</p>
             )}
             {sourceName && (
               <p className="text-[10px] text-gray-600 font-mono truncate uppercase mt-1">On {sourceName}</p>
             )}
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
             <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                View Log
             </span>
             <ArrowRight weight="bold" size={14} className="text-emerald-500 transform -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default LogCard;
