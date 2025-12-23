import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  StarIcon,
  CalendarBlankIcon,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import GenerativeArt from './GenerativeArt';
import colors from '../config/colors';

const LogCard = ({ log, index, totalLogs, viewMode = 'grid' }) => {
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
    source,
  } = log;

  // Resolve the primary creator/source
  const creatorName = by || author || artist || creator || director;
  const sourceName = platform || source;
  const categoryColor = colors[category.toLowerCase()] || colors.primary[400];
  const categoryColorLight =
    colors[category.toLowerCase() + '-light'] || categoryColor;

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ x: 10 }}
        className="group relative flex items-center gap-4 py-4 border-b border-white/5 bg-transparent hover:bg-white/[0.02] transition-colors px-4"
      >
        <Link
          to={`/logs/${category.toLowerCase()}/${slug}`}
          className="flex items-center gap-6 w-full"
        >
          {/* Index & Date */}
          <div className="flex flex-col items-start gap-1 min-w-[100px]">
            <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
              #{String(totalLogs - index).padStart(3, '0')}
            </span>
            <span className="font-mono text-xs text-gray-400 uppercase flex items-center gap-1">
              <CalendarBlankIcon size={14} />
              {date}
            </span>
          </div>

          {/* Visual Thumbnail (Small) */}
          <div className="hidden sm:block h-14 w-14 flex-shrink-0 overflow-hidden rounded-sm border border-white/10 grayscale group-hover:grayscale-0 transition-all">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <GenerativeArt
                seed={title + category}
                className="w-full h-full opacity-60"
              />
            )}
          </div>

          {/* Main Content */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <span
                className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest border rounded-sm"
                style={{
                  color: categoryColor,
                  backgroundColor: `${categoryColor}10`,
                  borderColor: `${categoryColor}20`,
                }}
              >
                {category}
              </span>
              {rating > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-white">
                    {rating}
                  </span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        weight="fill"
                        size={10}
                        className={i < rating ? 'text-yellow-500' : 'text-white/10'}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <h3
              className="text-lg font-medium font-sans uppercase truncate transition-colors"
              style={{ color: categoryColorLight }}
            >
              {title}
            </h3>
            {creatorName && (
              <p className="text-xs text-gray-400 font-mono truncate uppercase mt-0.5">
                BY {creatorName}
              </p>
            )}
          </div>

          {/* Source & Action */}
          <div className="hidden md:flex flex-col items-end gap-1 min-w-[140px] text-right">
            {sourceName && (
              <span className="text-xs text-gray-400 font-mono uppercase truncate w-full">
                {sourceName}
              </span>
            )}
            <ArrowRightIcon
              weight="bold"
              size={16}
              className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col overflow-hidden rounded-sm bg-zinc-900 border border-white/10 h-full"
    >
      <Link
        to={`/logs/${category.toLowerCase()}/${slug}`}
        className="flex flex-col h-full"
      >
        {/* Visual Header */}
        <div className="relative h-40 w-full overflow-hidden border-b border-white/5">
          {image ? (
            <div className="w-full h-full relative">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-60"
              />
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
                borderColor: `${categoryColor}20`,
              }}
            >
              {category}
            </span>
          </div>

          {/* Rating Badge */}
          {rating > 0 && (
            <div className="absolute bottom-2 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
              <span className="font-mono text-xs font-bold text-white">
                {rating}
              </span>
              <StarIcon weight="fill" size={10} className="text-yellow-500" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
              <CalendarBlankIcon size={12} />
              {date}
            </span>
            <span className="text-gray-700 text-[9px]">•</span>
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
              #{String(totalLogs - index).padStart(3, '0')}
            </span>
          </div>

          <h3
            className="text-lg font-medium font-sans uppercase mb-2 transition-colors line-clamp-2 leading-tight"
            style={{ color: categoryColorLight }}
          >
            {title}
          </h3>

          <div className="mb-4">
            {creatorName && (
              <p className="text-xs text-gray-400 font-mono truncate">
                By {creatorName}
              </p>
            )}
            {sourceName && (
              <p className="text-[10px] text-gray-600 font-mono truncate uppercase mt-1">
                On {sourceName}
              </p>
            )}
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
              View Log
            </span>
            <ArrowRightIcon
              weight="bold"
              size={14}
              className="text-emerald-500 transform -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default LogCard;
