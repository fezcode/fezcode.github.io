import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag } from '@phosphor-icons/react';
import ImageModal from '../components/ImageModal';
import Seo from '../components/Seo';
import GenerativeArt from '../components/GenerativeArt';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { calculateReadingTime } from '../utils/readingTime';

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

const StandardBlogPostPage = () => {
  const { slug, episodeSlug } = useParams();
  const navigate = useNavigate();
  const currentSlug = episodeSlug || slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState(0);

  const [modalImageSrc, setModalImageSrc] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postsResponse = await fetch('/posts/posts.json');
        const allPostsData = await postsResponse.json();
        let allPosts = [];
        allPostsData.forEach((item) => {
          if (item.series) {
            item.series.posts.forEach((seriesPost) => {
              allPosts.push({
                ...seriesPost,
                series: { slug: item.slug, title: item.title },
              });
            });
          } else {
            allPosts.push(item);
          }
        });

        const postMetadata = allPosts.find((item) => item.slug === currentSlug);
        if (!postMetadata) {
          navigate('/404');
          return;
        }

        const contentPath = `posts/${postMetadata.filename}`;
        const postContentResponse = await fetch(`/${contentPath}`);
        const postBody = await postContentResponse.text();

        let seriesPosts = [];
        if (postMetadata.series) {
          const originalSeries = allPostsData.find(
            (item) => item.series && item.slug === postMetadata.series.slug,
          );
          if (originalSeries) seriesPosts = originalSeries.series.posts;
        }

        setPost({ attributes: postMetadata, body: postBody, seriesPosts });
        setEstimatedReadingTime(calculateReadingTime(postBody));
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [currentSlug, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const totalHeight = scrollHeight - clientHeight;
      setReadingProgress((scrollTop / totalHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono uppercase tracking-widest text-[10px]">
        <span className="animate-pulse">Decrypting_Intel_Feed...</span>
      </div>
    );
  }

  if (!post) return null;

  const currentPostIndex = post.seriesPosts?.findIndex(
    (item) => item.slug === currentSlug,
  );
  const prevPost = post.seriesPosts?.[currentPostIndex + 1];
  const nextPost = post.seriesPosts?.[currentPostIndex - 1];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 pb-32 relative">
      <Seo
        title={`${post.attributes.title} | Fezcodex`}
        description={post.body.substring(0, 150)}
        ogImage={post.attributes.image || '/images/ogtitle.png'}
      />

      {/* Reading Progress */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-white/5">
        <motion.div
          className="h-full bg-emerald-500 origin-left"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />

      {/* Hero */}
      <div className="relative h-[35vh] w-full overflow-hidden border-b border-white/10">
        <GenerativeArt
          seed={post.attributes.title}
          className="w-full h-full opacity-40 filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-6 pb-8 md:px-12">
          <div className="mb-6 flex items-center gap-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
            >
              <ArrowLeft weight="bold" />
              <span>Back to Intel</span>
            </Link>
            <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-2 py-1.5 rounded-full bg-emerald-500/5 backdrop-blur-sm">
              SOURCE: {post.attributes.category || 'Standard'}
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none max-w-5xl">
            {post.attributes.title}
          </h1>
        </div>
      </div>

      {/* Content Grid */}
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 lg:grid lg:grid-cols-12 lg:gap-24">
        <div className="lg:col-span-8">
          <div
            className="prose prose-invert prose-lg max-w-none
                prose-headings:font-sans prose-headings:uppercase prose-headings:tracking-tight prose-headings:font-bold prose-headings:text-white
                prose-p:text-gray-400 prose-p:font-sans prose-p:leading-relaxed
                prose-a:text-emerald-400 prose-a:underline prose-a:decoration-emerald-500/30 prose-a:underline-offset-4 hover:prose-a:decoration-emerald-400
                prose-code:text-emerald-300 prose-code:font-mono prose-code:bg-white/5 prose-code:px-1 prose-code:rounded-sm
                prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10
                prose-blockquote:border-l-emerald-500 prose-blockquote:bg-white/5 prose-blockquote:py-2"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {post.body}
            </ReactMarkdown>
          </div>

          {/* Series Nav Section */}
          {(prevPost || nextPost) && (
            <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-12">
              {prevPost ? (
                <Link
                  to={`/blog/${prevPost.slug}`}
                  className="group border border-white/10 p-6 transition-colors hover:bg-white hover:text-black"
                >
                  <span className="block font-mono text-[10px] uppercase text-gray-500 mb-2">
                    Previous Intel
                  </span>
                  <span className="text-xl font-bold uppercase">
                    {prevPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextPost && (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="group border border-white/10 p-6 text-right transition-colors hover:bg-white hover:text-black"
                >
                  <span className="block font-mono text-[10px] uppercase text-gray-500 mb-2">
                    Next Intel
                  </span>
                  <span className="text-xl font-bold uppercase">
                    {nextPost.title}
                  </span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="mt-16 lg:col-span-4 lg:mt-0">
          <div className="sticky top-24 space-y-12">
            <div>
              <h3 className="mb-6 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {'//'} INTEL_SPECIFICATIONS
              </h3>
              <div className="space-y-6 border-l border-white/10 pl-6">
                <SpecItem
                  icon={Calendar}
                  label="Dated"
                  value={new Date(post.attributes.date).toLocaleDateString(
                    'en-GB',
                  )}
                />
                <SpecItem
                  icon={Clock}
                  label="Process_Time"
                  value={`${estimatedReadingTime} Min`}
                />
                <SpecItem
                  icon={Tag}
                  label="Category"
                  value={post.attributes.category || 'Misc'}
                  isAccent
                />
              </div>
            </div>

            {post.seriesPosts && (
              <div>
                <h3 className="mb-6 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  {'//'} SERIES_DATA
                </h3>
                <div className="flex flex-col gap-2">
                  {post.seriesPosts.map((p, i) => (
                    <Link
                      key={p.slug}
                      to={`/blog/${p.slug}`}
                      className={`flex items-center gap-3 p-3 border transition-all ${p.slug === currentSlug ? 'bg-emerald-500 text-black border-emerald-500' : 'border-white/5 hover:border-white/20 text-gray-500 hover:text-white'}`}
                    >
                      <span className="font-mono text-[10px]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-bold uppercase truncate">
                        {p.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ImageModal
        src={modalImageSrc}
        alt="Intel Imagery"
        onClose={() => setModalImageSrc(null)}
      />
    </div>
  );
};

const SpecItem = ({ icon: Icon, label, value, isAccent }) => (
  <div className="flex flex-col gap-1">
    <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-gray-500">
      <Icon size={14} /> {label}
    </span>
    <span
      className={`font-mono text-sm uppercase ${isAccent ? 'text-emerald-400 font-bold' : 'text-white'}`}
    >
      {value}
    </span>
  </div>
);

export default StandardBlogPostPage;
