import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TerracottaPostItem from '../../components/TerracottaPostItem';
import {
  ArrowLeftIcon,
  TagIcon,
  BookOpenIcon,
  CalendarIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import GenerativeArt from '../../components/GenerativeArt';

const SpecItem = ({ icon: Icon, label, value, isAccent }) => (
  <div className="flex flex-col gap-1">
    <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-[#F3ECE0]/60">
      <Icon size={14} /> {label}
    </span>
    <span
      className={`font-mono text-sm uppercase ${isAccent ? 'text-[#C96442] font-bold' : 'text-[#F3ECE0]'}`}
    >
      {value}
    </span>
  </div>
);

const TerracottaSeriesPage = () => {
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

  const isPlaceholder = (post) => !post?.image || post.image.includes('placeholder');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F3ECE0] text-[#1A1613]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-24 bg-[#1A161320] relative overflow-hidden">
            <div className="absolute inset-0 bg-[#C96442] animate-progress origin-left"></div>
          </div>
          <span className="font-mono text-[10px] text-[#2E2620]/60 uppercase tracking-[0.3em]">
            Loading_Series
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F3ECE0] text-[#1A1613] overflow-hidden relative selection:bg-[#C96442]/25">
      <Seo
        title={`${seriesTitle} | Fezcodex Series`}
        description={`Explore the sequential entries in the "${seriesTitle}" series.`}
      />

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
            to="/blog"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-[#2E2620]/60 hover:text-[#1A1613] transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Archive</span>
          </Link>
          <h1 className="text-6xl md:text-8xl font-fraunces italic tracking-tight text-[#1A1613] mb-4 leading-none">
            Series
          </h1>
          <p className="text-[#2E2620]/60 font-mono text-[10px] uppercase tracking-[0.2em]">
            {'//'} SEQUENTIAL_ENTRIES: {seriesTitle.toUpperCase()}
          </p>
        </header>

        <div className="flex flex-col pb-32">
          {seriesPosts.map((post) => (
            <TerracottaPostItem
              key={post.slug}
              post={{
                ...post,
                slug: `series/${seriesSlug}/${post.slug}`,
                isSeries: false,
              }}
              isActive={activePost?.slug === post.slug}
              onHover={setActivePost}
            />
          ))}
        </div>

        <div className="mt-auto pt-20 border-t border-[#1A161320] text-[#2E2620]/50 font-mono text-[10px] uppercase tracking-widest">
          Stored_Episodes: {seriesPosts.length}
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

              <div className="absolute bottom-0 left-0 w-full p-16 z-10 flex flex-col gap-12">
                <div className="space-y-6 border-l border-[#F3ECE0]/10 pl-6">
                  <SpecItem
                    icon={CalendarIcon}
                    label="Date"
                    value={new Date(activePost.updated || activePost.date).toLocaleDateString('en-GB')}
                  />
                  <SpecItem icon={TagIcon} label="Category" value={activePost.category || 'Episode'} isAccent />
                </div>

                <div className="flex flex-col gap-4">
                  <h2 className="text-4xl md:text-5xl font-fraunces italic text-[#F3ECE0] tracking-tight leading-none">
                    {activePost.title}
                  </h2>
                  <p className="text-lg text-[#F3ECE0]/80 leading-relaxed max-w-xl">
                    {activePost.description || 'Part of a sequential series. Analysis and logs curated for review.'}
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4"
                >
                  <Link
                    to={`/blog/series/${seriesSlug}/${activePost.slug}`}
                    className="inline-flex items-center gap-4 text-[#F3ECE0] border-b-2 border-[#C96442] pb-2 hover:bg-[#C96442] hover:text-[#F3ECE0] transition-all px-1"
                  >
                    <span className="text-sm font-bold uppercase tracking-[0.2em]">Access_Episode</span>
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

export default TerracottaSeriesPage;
