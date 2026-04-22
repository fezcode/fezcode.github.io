import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TerracottaPostItem from '../../components/TerracottaPostItem';
import GenerativeArt from '../../components/GenerativeArt';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import {
  ArrowLeft,
  XCircle,
  Clock,
  Tag,
  BookOpen,
  MagnifyingGlass,
  Hash,
} from '@phosphor-icons/react';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'dev', label: 'Dev' },
  { id: 'ai', label: 'AI' },
  { id: 'feat', label: 'Feat' },
  { id: 'rant', label: 'Rant' },
  { id: 'series', label: 'Series' },
  { id: 'gist', label: 'Gist' },
  { id: 'd&d', label: 'D&D' },
];

const TerracottaBlogPage = () => {
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
                date: post.series.date || post.date,
                updated: post.series.updated || post.updated,
                image: post.series.image,
                isSeries: true,
                posts: [],
                tags: post.tags,
                category: post.category,
                description: post.series.description || post.description,
              });
            }
            seriesMap.get(post.series.slug).posts.push(post);
          } else {
            individualPosts.push(post);
          }
        });

        const combinedItems = [...Array.from(seriesMap.values()), ...individualPosts];
        combinedItems.sort(
          (a, b) => new Date(b.updated || b.date) - new Date(a.updated || a.date),
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
      return item.category === activeFilter;
    };
    const matchesSearch = () => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return item.title?.toLowerCase().includes(q) || item.slug?.toLowerCase().includes(q);
    };
    return matchesFilter() && matchesSearch();
  });

  const isPlaceholder = (post) => !post?.image || post.image.includes('placeholder');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F3ECE0] text-[#1A1613]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-24 bg-[#1A161320] relative overflow-hidden">
            <div className="absolute inset-0 bg-[#C96442] animate-progress origin-left"></div>
          </div>
          <span className="font-mono text-[10px] text-[#2E2620]/60 uppercase tracking-[0.3em]">
            Loading_Archive
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F3ECE0] text-[#1A1613] overflow-hidden relative selection:bg-[#C96442]/25">
      <Seo title="Archive | Fezcodex Blog" description="Curated thoughts, insights, and digital rants." />

      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        {activePost &&
          (isPlaceholder(activePost) ? (
            <GenerativeArt seed={activePost.title} className="w-full h-full filter blur-3xl" />
          ) : (
            <img src={activePost.image} alt="bg" className="w-full h-full object-cover filter blur-3xl" />
          ))}
      </div>

      <div className="w-full 4xl:pr-[50vw] relative z-10 flex flex-col min-h-screen py-24 px-6 md:pl-20 overflow-y-auto overflow-x-hidden no-scrollbar transition-all duration-300">
        <header className="mb-16">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-[#2E2620]/60 hover:text-[#1A1613] transition-colors uppercase tracking-widest"
          >
            <ArrowLeft weight="bold" />
            <span>Home</span>
          </Link>
          <h1 className="text-6xl md:text-8xl font-playfairDisplay italic tracking-tight text-[#1A1613] mb-4 leading-none">
            Intel
          </h1>
          <p className="text-[#2E2620]/60 font-mono text-[10px] uppercase tracking-[0.2em]">
            {'//'} DATA_LOGS & ARCHIVED_THOUGHTS
          </p>
        </header>

        <div className="mb-12 border-b border-[#1A161320] pb-8 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`rounded-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeFilter === f.id
                    ? 'bg-[#C96442] text-[#F3ECE0] shadow-[0_10px_20px_-10px_#C9644250]'
                    : 'bg-[#E8DECE]/50 text-[#2E2620]/60 hover:text-[#1A1613] hover:bg-[#E8DECE] border border-[#1A161320]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative group w-full max-w-md">
            <div className="flex items-center gap-2 bg-[#E8DECE]/50 border border-[#1A161320] rounded-sm px-3 py-1.5 focus-within:border-[#C96442]/60 focus-within:bg-[#E8DECE] transition-all">
              <MagnifyingGlass
                size={14}
                className="text-[#2E2620]/50 group-focus-within:text-[#9E4A2F]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Blogposts..."
                className="bg-transparent border-none outline-none text-[10px] font-mono uppercase tracking-widest text-[#1A1613] placeholder-[#2E2620]/30 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#2E2620]/50 hover:text-[#9E4A2F] transition-colors"
                >
                  <XCircle size={14} weight="fill" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col pb-32">
          {filteredItems.map((item) => (
            <TerracottaPostItem
              key={item.slug}
              post={item}
              isActive={activePost?.slug === item.slug}
              onHover={setActivePost}
            />
          ))}
          {filteredItems.length === 0 && (
            <div className="py-12 text-center border border-dashed border-[#1A161320] rounded-sm">
              <p className="font-mono text-xs text-[#2E2620]/50 uppercase tracking-widest">
                No_Intel_Found
              </p>
            </div>
          )}
        </div>

        <div className="mt-auto pt-20 border-t border-[#1A161320] text-[#2E2620]/50 font-mono text-[10px] uppercase tracking-widest">
          Total Stored Entries: {displayItems.length}
        </div>
      </div>

      <div className="hidden 4xl:block fixed right-0 top-0 h-screen w-1/2 bg-[#1A1613] overflow-hidden border-l border-[#1A161320] z-20">
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
              <div className="absolute inset-0 z-0">
                <GenerativeArt seed={activePost.title} className="w-full h-full opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1613] via-transparent to-[#1A1613]/40" />
              </div>

              <div className="absolute bottom-0 left-0 w-full p-16 z-10 flex flex-col gap-8">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-[#C96442] font-mono text-[10px] tracking-widest uppercase">
                    <Clock size={16} />
                    <span>{new Date(activePost.updated || activePost.date).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#F3ECE0] font-mono text-[10px] tracking-widest uppercase bg-[#F3ECE0]/10 px-2 py-1 border border-[#F3ECE0]/10 rounded-sm">
                    <Tag size={14} />
                    <span>{activePost.category || 'Post'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h2 className="text-6xl md:text-7xl font-playfairDisplay italic text-[#F3ECE0] tracking-tight leading-none">
                    {activePost.title}
                  </h2>
                  <p className="text-lg text-[#F3ECE0]/80 leading-relaxed max-w-xl">
                    {activePost.description || 'Archived content from the digital vault.'}
                  </p>
                </div>

                {activePost.tags && activePost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 max-w-xl">
                    {activePost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-[#F3ECE0]/70 bg-[#1A1613]/60 px-2 py-1 rounded-sm border border-[#F3ECE0]/5"
                      >
                        <Hash size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                )}

                {activePost.isSeries && (
                  <div className="mt-4 flex flex-col gap-4">
                    <span className="font-mono text-[10px] text-[#C96442] font-bold tracking-widest uppercase">
                      {'//'} SERIES_MANIFEST
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {activePost.posts?.slice(0, 3).map((p, i) => (
                        <div
                          key={p.slug}
                          className="flex items-center gap-3 text-[#F3ECE0]/60 font-mono text-[10px] uppercase"
                        >
                          <span>{String(i + 1).padStart(2, '0')}</span>
                          <span className="h-px w-4 bg-[#F3ECE0]/20" />
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
                    className="inline-flex items-center gap-4 text-[#F3ECE0] border-b-2 border-[#C96442] pb-2 hover:bg-[#C96442] hover:text-[#F3ECE0] transition-all px-2 py-2"
                  >
                    <span className="text-sm uppercase tracking-[0.2em]">Read Post</span>
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

export default TerracottaBlogPage;
