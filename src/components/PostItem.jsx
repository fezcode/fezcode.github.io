import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, FolderIcon } from '@phosphor-icons/react';

const PostItem = ({
  slug,
  title,
  date,
  updatedDate,
  category,
  series,
  seriesIndex,
  isSeries,
  description,
  tags,
  authors,
  image,
  isActive,
  onHover = () => {},
}) => {
  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  const categoryColor =
    category === 'dev'
      ? 'var(--color-dev-badge)'
      : category === 'series'
        ? 'var(--color-series-badge)'
        : category === 'd&d' || category === 'dnd'
          ? 'var(--color-dnd-badge)'
          : category === 'gist'
            ? 'var(--color-gist-badge)'
            : category === 'feat'
              ? 'var(--color-feat-badge)'
              : 'var(--color-rant-badge)';

  const categoryBg =
    category === 'dev'
      ? 'rgba(59, 130, 246, 0.3)'
      : category === 'series'
        ? 'rgba(237, 197, 49, 0.3)'
        : category === 'd&d' || category === 'dnd'
          ? 'rgba(236, 72, 153, 0.3)'
          : category === 'gist'
            ? 'rgba(245, 158, 11, 0.3)'
            : category === 'feat'
              ? 'rgba(168, 85, 247, 0.3)'
              : 'rgba(16, 185, 129, 0.2)';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onMouseEnter={() =>
        onHover({
          slug,
          title,
          date,
          updatedDate,
          category,
          series,
          seriesIndex,
          isSeries,
          description,
          tags,
          authors,
          image,
        })
      }
      className="relative mr-4 md:mr-12"
    >
      <Link
        to={isSeries ? `/blog/series/${slug}` : `/blog/${slug}`}
        className="group relative flex items-center justify-between border-b border-white/10 py-6 pr-20 transition-all duration-300"
      >
        {/* Active Marker */}
        <div
          className={`absolute left-0 top-0 h-full w-1 transition-all duration-300 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundColor: categoryColor || 'var(--emerald-400)' }}
        />

        <div className="flex flex-1 items-baseline gap-6 pl-4 md:pl-8 min-w-0 pr-12">
          {/* Date */}
          <span
            className={`font-mono text-[10px] tracking-widest flex-shrink-0 transition-colors duration-300 ${
              isActive ? 'text-emerald-400' : 'text-gray-600'
            }`}
          >
            {formattedDate}
          </span>

          {/* Title Area */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
             {isSeries && (
                <FolderIcon size={24} weight="fill" className="text-amber-400 shrink-0 mt-0.5" />
             )}
             <div className="flex flex-col gap-1">
                <h3
                  className={`text-xl font-medium uppercase tracking-tight transition-all duration-300 md:text-2xl break-words leading-tight ${
                    isActive
                      ? 'translate-x-1 text-white'
                      : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                >
                  {title}
                </h3>

                {series && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-500/60">
                    {typeof series === 'object' ? series.title : series} {'//'} Part{' '}
                    {seriesIndex}
                  </span>
                )}
             </div>
          </div>
        </div>

        {/* Category Badge & Arrow */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <span
            className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest border rounded-sm transition-all duration-300 text-gray-300"
            style={{
              borderColor: categoryColor,
              backgroundColor: categoryBg,
            }}
          >
            {category || 'Post'}
          </span>

          <div className="w-10 flex justify-end">
            <ArrowRightIcon
              weight="bold"
              size={20}
              className={`transition-all duration-300 ${
                isActive
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-4 opacity-0 text-gray-500'
              }`}
              style={{ color: isActive ? categoryColor : undefined }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PostItem;
