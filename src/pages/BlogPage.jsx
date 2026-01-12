import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PostItem from '../components/PostItem';
import GenerativeArt from '../components/GenerativeArt';
import Seo from '../components/Seo';
import { fetchAllBlogPosts } from '../utils/dataUtils';
import {
  ArrowLeft,
  XCircle,
  Clock,
  Tag,
  BookOpen,
} from '@phosphor-icons/react';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'dev', label: 'Dev' },
  { id: 'feat', label: 'Feat' },
  { id: 'rant', label: 'Rant' },
  { id: 'series', label: 'Series' },
  { id: 'gist', label: 'Gist' },
  { id: 'd&d', label: 'D&D' },
];

const BlogPage = () => {
  const [displayItems, setDisplayItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { processedPosts } = await fetchAllBlogPosts();

        const seriesMap = new Map();
        const individualPosts = [];

        processedPosts.forEach((post) => {
          if (post.series) {
            if (!seriesMap.has(post.series.slug)) {
              seriesMap.set(post.series.slug, {
                title: post.series.title,
                slug: post.series.slug,
                date: post.date,
                updated: post.updated,
                image: post.series.image,
                isSeries: true,
                posts: [],
              });
            }
            seriesMap.get(post.series.slug).posts.push(post);
          } else {
            individualPosts.push(post);
          }
        });

        const combinedItems = [
          ...Array.from(seriesMap.values()),
          ...individualPosts,
        ];
        combinedItems.sort(
          (a, b) =>
            new Date(b.updated || b.date) - new Date(a.updated || a.date),
        );

        setDisplayItems(combinedItems);
        if (combinedItems.length > 0) setActivePost(combinedItems[0]);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredItems = displayItems.filter((item) => {
    const matchesFilter = () => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'series') return item.isSeries;
      return item.category === activeFilter && !item.isSeries;
    };
    const matchesSearch = () => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title?.toLowerCase().includes(q) ||
        item.slug?.toLowerCase().includes(q)
      );
    };
    return matchesFilter() && matchesSearch();
  });

  const isPlaceholder = (post) =>
    !post?.image || post.image.includes('placeholder');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-24 bg-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-400 animate-progress origin-left"></div>
          </div>
          <span className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.3em]">
            Accessing_Intel
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-emerald-500/30">
      <Seo
        title="Archive | Fezcodex Blog"
        description="A curated collection of thoughts, insights, and digital rants."
        keywords={['Fezcodex', 'blog', 'developer', 'archive']}
      />
      {/* Dynamic Background (Static or Active Post Blur) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        {activePost &&
          (isPlaceholder(activePost) ? (
            <GenerativeArt
              seed={activePost.title}
              className="w-full h-full filter blur-3xl"
            />
          ) : (
            <img
              src={activePost.image}
              alt="bg"
              className="w-full h-full object-cover filter blur-3xl"
            />
          ))}
      </div>

      {/* LEFT PANEL: The Index */}
      <div className="w-full 4xl:pr-[50vw] relative z-10 flex flex-col min-h-screen py-24 px-6 md:pl-20 overflow-y-auto overflow-x-hidden no-scrollbar transition-all duration-300">
        <header className="mb-16">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft weight="bold" />
            <span>Home</span>
          </Link>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none">
            INTEL
          </h1>
          <p className="text-gray-400 font-mono text-[10px] uppercase tracking-[0.2em]">
            {'//'} DATA_LOGS & ARCHIVED_THOUGHTS
          </p>
        </header>

        {/* Filter Bar */}
        <div className="mb-12 flex flex-wrap items-center gap-2 border-b border-white/10 pb-8">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`rounded-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeFilter === f.id
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="ml-2 text-red-500"
            >
              <XCircle size={18} />
            </button>
          )}
        </div>

        <div className="flex flex-col pb-32">
          {filteredItems.map((item) => (
            <PostItem
              key={item.slug}
              {...item}
              isActive={activePost?.slug === item.slug}
              onHover={setActivePost}
            />
          ))}
        </div>

        <div className="mt-auto pt-20 border-t border-white/10 text-gray-600 font-mono text-[10px] uppercase tracking-widest">
          Stored_Entries: {displayItems.length}
        </div>
      </div>

      {/* RIGHT PANEL: The Stage */}
      <div className="hidden 4xl:block fixed right-0 top-0 h-screen w-1/2 bg-neutral-900 overflow-hidden border-l border-white/10 z-20">
        <AnimatePresence mode="wait">
          {activePost && (
            <motion.div
              key={activePost.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {/* Art */}
              <div className="absolute inset-0 z-0">
                <GenerativeArt
                  seed={activePost.title}
                  className="w-full h-full opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
              </div>

              {/* Details Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-16 z-10 flex flex-col gap-8">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] tracking-widest uppercase">
                    <Clock size={16} />
                    <span>
                      {new Date(
                        activePost.updated || activePost.date,
                      ).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white font-mono text-[10px] tracking-widest uppercase bg-white/10 px-2 py-1 border border-white/10 rounded-sm">
                    <Tag size={14} />
                    <span>{activePost.category || 'Post'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                    {activePost.title}
                  </h2>
                  <p className="text-lg text-gray-300 font-light leading-relaxed max-w-xl">
                    {activePost.description ||
                      'Archived content from the digital vault. Processed and cataloged for immediate access.'}
                  </p>
                </div>

                {activePost.isSeries && (
                  <div className="mt-4 flex flex-col gap-4">
                    <span className="font-mono text-[10px] text-emerald-500 font-bold tracking-widest uppercase">
                      {'//'} SERIES_MANIFEST
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {activePost.posts?.slice(0, 3).map((p, i) => (
                        <div
                          key={p.slug}
                          className="flex items-center gap-3 text-gray-500 font-mono text-[10px] uppercase"
                        >
                          <span>{String(i + 1).padStart(2, '0')}</span>
                          <span className="h-px w-4 bg-gray-800" />
                          <span className="truncate">{p.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8"
                >
                  <Link
                    to={
                      activePost.isSeries
                        ? `/blog/series/${activePost.slug}`
                        : `/blog/${activePost.slug}`
                    }
                    className="inline-flex items-center gap-4 text-white border-b-2 border-emerald-500 pb-2 hover:bg-emerald-500 hover:text-black transition-all px-1"
                  >
                    <span className="text-sm font-black uppercase tracking-[0.2em]">
                      Read_Post
                    </span>
                    <BookOpen weight="bold" size={20} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogPage;
