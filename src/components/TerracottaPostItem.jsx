import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, FolderIcon } from '@phosphor-icons/react';

const TerracottaPostItem = ({ post, isActive, onHover = () => {} }) => {
  const { slug, title, date, category, series, seriesIndex, isSeries } = post;

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  const categoryColor =
    category === 'dev'
      ? '#6B8E23'
      : category === 'series'
        ? '#B88532'
        : category === 'd&d' || category === 'dnd'
          ? '#9E4A2F'
          : category === 'gist'
            ? '#C96442'
            : category === 'feat'
              ? '#8A6A32'
              : category === 'ai'
                ? '#6B8E23'
                : '#C96442';

  const categoryBg =
    category === 'dev'
      ? 'rgba(107, 142, 35, 0.18)'
      : category === 'series'
        ? 'rgba(184, 133, 50, 0.2)'
        : category === 'd&d' || category === 'dnd'
          ? 'rgba(158, 74, 47, 0.2)'
          : category === 'gist'
            ? 'rgba(201, 100, 66, 0.2)'
            : category === 'feat'
              ? 'rgba(138, 106, 50, 0.2)'
              : category === 'ai'
                ? 'rgba(107, 142, 35, 0.15)'
                : 'rgba(201, 100, 66, 0.18)';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onMouseEnter={() => onHover(post)}
      className="relative mr-4 md:mr-12"
    >
      <Link
        to={isSeries ? `/blog/series/${slug}` : `/blog/${slug}`}
        className="group relative flex items-center justify-between border-b border-[#1A161320] py-6 pr-20 transition-all duration-300"
      >
        <div
          className={`absolute left-0 top-0 h-full w-1 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundColor: categoryColor || '#C96442' }}
        />

        <div className="flex flex-1 items-center gap-6 pl-4 md:pl-8 min-w-0 pr-12">
          <span
            className={`font-mono text-[10px] tracking-widest flex-shrink-0 transition-colors duration-300 ${
              isActive ? 'text-[#9E4A2F]' : 'text-[#2E2620]/50'
            }`}
          >
            {formattedDate}
          </span>

          <div className="flex items-center gap-3 min-w-0 flex-1">
            {isSeries && (
              <FolderIcon
                size={24}
                weight="fill"
                className="shrink-0"
                style={{ color: categoryColor }}
              />
            )}
            <div className="flex flex-col gap-1">
              <h3
                className={`text-xl md:text-2xl font-fraunces tracking-tight transition-all duration-300 break-words leading-tight ${
                  isActive
                    ? 'translate-x-1 text-[#1A1613] italic'
                    : 'text-[#2E2620]/60 group-hover:text-[#1A1613]'
                }`}
              >
                {title}
              </h3>

              {series && (
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#9E4A2F]/70">
                  {typeof series === 'object' ? series.title : series} {'//'} Part {seriesIndex}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <span
            className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest border rounded-sm transition-all duration-300"
            style={{
              borderColor: categoryColor,
              backgroundColor: categoryBg,
              color: categoryColor,
            }}
          >
            {category || 'Post'}
          </span>

          <div className="w-10 flex justify-end">
            <ArrowRightIcon
              weight="bold"
              size={20}
              className={`transition-all duration-300 ${
                isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 text-[#2E2620]/50'
              }`}
              style={{ color: isActive ? categoryColor : undefined }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TerracottaPostItem;
