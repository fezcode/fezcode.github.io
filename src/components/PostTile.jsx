import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import GenerativeArt from './GenerativeArt';

const PostTile = ({ post }) => {
  const dateStr = new Date(post.updated || post.date).toLocaleDateString(
    'en-GB',
    {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    },
  );

  const categoryColor =
    post.category === 'dev'
      ? 'var(--color-dev-badge)'
      : post.category === 'series'
        ? 'var(--color-series-badge)'
        : post.category === 'd&d' || post.category === 'dnd'
          ? 'var(--color-dnd-badge)'
          : post.category === 'gist'
            ? 'var(--color-gist-badge)'
            : post.category === 'feat'
              ? 'var(--color-feat-badge)'
              : 'var(--color-rant-badge)';

  const categoryBg =
    post.category === 'dev'
      ? 'rgba(59, 130, 246, 0.3)'
      : post.category === 'series'
        ? 'rgba(237, 197, 49, 0.3)'
        : post.category === 'd&d' || post.category === 'dnd'
          ? 'rgba(236, 72, 153, 0.3)'
          : post.category === 'gist'
            ? 'rgba(245, 158, 11, 0.3)'
            : post.category === 'feat'
              ? 'rgba(168, 85, 247, 0.3)'
              : 'rgba(16, 185, 129, 0.2)';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col overflow-hidden rounded-sm bg-zinc-900 border border-white/10 h-full"
    >
      <Link
        to={post.isSeries ? `/blog/series/${post.slug}` : `/blog/${post.slug}`}
        className="flex flex-col h-full"
      >
        {/* Visual Header */}
        <div className="relative h-32 w-full overflow-hidden border-b border-white/5">
          <GenerativeArt
            seed={post.title}
            className="w-full h-full opacity-40 transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />

          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span
              className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest border rounded-sm transition-all duration-300 text-gray-300"
              style={{
                borderColor: categoryColor,
                backgroundColor: categoryBg,
              }}
            >
              {post.category || 'Post'}
            </span>
            {post.isSeries && (
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-sm">
                Series
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-5">
          <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2">
            {dateStr}
          </span>

          <h3 className="text-lg font-medium font-sans uppercase text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h3>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
              Read Intel
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

export default PostTile;
