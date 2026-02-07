import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PostItem from '../../components/PostItem';
import { ArrowLeftIcon, ClockIcon, TagIcon, BookOpenIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import GenerativeArt from '../../components/GenerativeArt';

const BrutalistSeriesPage = () => {
  const { seriesSlug } = useParams();
  const [seriesPosts, setSeriesPosts] = useState([]);
  const [seriesTitle, setSeriesTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    const fetchSeriesPosts = async () => {
      try {
        const { processedPosts } = await fetchAllBlogPosts();

        const filteredPosts = processedPosts
          .filter((post) => post.series && post.series.slug === seriesSlug)
          .sort((a, b) => (a.seriesIndex || 0) - (b.seriesIndex || 0));

        if (filteredPosts.length > 0) {
          setSeriesPosts(filteredPosts);
          setSeriesTitle(filteredPosts[0].series.title);
          setActivePost(filteredPosts[0]);
        } else {
          setSeriesPosts([]);
          setSeriesTitle('Series Not Found');
        }
      } catch (error) {
        console.error('Error fetching series posts:', error);
        setSeriesPosts([]);
        setSeriesTitle('Error');
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesPosts();
  }, [seriesSlug]);

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
            Accessing_Series_Data
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-emerald-500/30">
      <Seo
        title={`${seriesTitle} | Fezcodex Series`}
        description={`Explore the sequential entries in the "${seriesTitle}" series.`}
        keywords={['Fezcodex', 'blog', 'series', seriesTitle]}
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
            to="/blog"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Archive</span>
          </Link>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none uppercase">
            SERIES
          </h1>
          <p className="text-gray-400 font-mono text-[10px] uppercase tracking-[0.2em]">
            {'//'} SEQUENTIAL_ENTRIES: {seriesTitle.toUpperCase()}
          </p>
        </header>

        <div className="flex flex-col pb-32">
          {seriesPosts.map((post) => (
            <PostItem
              key={post.slug}
              {...post}
              seriesIndex={post.seriesIndex}
              slug={`series/${seriesSlug}/${post.slug}`}
              isActive={activePost?.slug === post.slug}
              onHover={setActivePost}
              isSeries={false}
            />
          ))}
        </div>

        <div className="mt-auto pt-20 border-t border-white/10 text-gray-600 font-mono text-[10px] uppercase tracking-widest">
          Stored_Episodes: {seriesPosts.length}
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
                    <ClockIcon size={16} />
                    <span>
                      {new Date(
                        activePost.updated || activePost.date,
                      ).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white font-mono text-[10px] tracking-widest uppercase bg-white/10 px-2 py-1 border border-white/10 rounded-sm">
                    <TagIcon size={14} />
                    <span>{activePost.category || 'Episode'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                    {activePost.title}
                  </h2>
                  <p className="text-lg text-gray-300 font-light leading-relaxed max-w-xl">
                    {activePost.description ||
                      'Part of a sequential data stream. Analysis and implementation logs curated for technical review.'}
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8"
                >
                  <Link
                    to={`/blog/series/${seriesSlug}/${activePost.slug}`}
                    className="inline-flex items-center gap-4 text-white border-b-2 border-emerald-500 pb-2 hover:bg-emerald-500 hover:text-black transition-all px-1"
                  >
                    <span className="text-sm font-black uppercase tracking-[0.2em]">
                      Access_Episode
                    </span>
                    <BookOpenIcon weight="bold" size={20} />
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

export default BrutalistSeriesPage;
