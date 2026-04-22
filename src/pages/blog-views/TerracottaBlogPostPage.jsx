import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  ArrowsOutSimple,
  ClipboardText,
} from '@phosphor-icons/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { customTheme } from '../../utils/customTheme';
import CodeModal from '../../components/CodeModal';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import { calculateReadingTime } from '../../utils/readingTime';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import { useToast } from '../../hooks/useToast';
import MarkdownLink from '../../components/MarkdownLink';
import MarkdownContent from '../../components/MarkdownContent';
import MermaidDiagram from '../../components/MermaidDiagram';

const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.2 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

const SpecItem = ({ icon: Icon, label, value, isAccent }) => (
  <div className="flex flex-col gap-1">
    <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-[#2E2620]/60">
      <Icon size={14} /> {label}
    </span>
    <span
      className={`font-mono text-sm uppercase ${isAccent ? 'text-[#9E4A2F] font-bold' : 'text-[#1A1613]'}`}
    >
      {value}
    </span>
  </div>
);

const TerracottaBlogPostPage = () => {
  const { slug, episodeSlug } = useParams();
  const navigate = useNavigate();
  const currentSlug = episodeSlug || slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalLanguage, setModalLanguage] = useState('jsx');
  const { addToast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { allPostsData, processedPosts } = await fetchAllBlogPosts();

        const postMetadata = processedPosts.find((item) => item.slug === currentSlug);
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
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const totalHeight = scrollHeight - clientHeight;
      setReadingProgress((scrollTop / totalHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openModal = (content, language) => {
    setModalContent(content);
    setModalLanguage(language);
    setIsModalOpen(true);
  };

  const components = useMemo(() => {
    const CodeBlock = ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const isMermaid = match && match[1] === 'mermaid';

      if (!inline && isMermaid) {
        return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
      }

      const handleCopy = () => {
        const textToCopy = String(children);
        navigator.clipboard.writeText(textToCopy).then(
          () =>
            addToast({
              title: 'COPIED',
              message: 'Code block copied to clipboard.',
              duration: 3000,
              type: 'success',
            }),
          () =>
            addToast({
              title: 'ERROR',
              message: 'Failed to access clipboard.',
              duration: 3000,
              type: 'error',
            }),
        );
      };

      if (!inline && match) {
        return (
          <div className="relative group my-8">
            <div className="absolute -top-3 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openModal(String(children).replace(/\n$/, ''), match[1])}
                className="bg-[#1A1613] border border-[#F3ECE0]/10 px-2 py-1 text-[10px] uppercase font-mono font-bold tracking-widest text-[#F3ECE0]/70 hover:text-[#F3ECE0] hover:bg-[#C96442] hover:border-[#C96442] transition-all rounded-sm"
                title="Expand"
              >
                <ArrowsOutSimple size={12} weight="bold" /> EXPAND
              </button>
              <button
                onClick={handleCopy}
                className="bg-[#1A1613] border border-[#F3ECE0]/10 px-2 py-1 text-[10px] uppercase font-mono font-bold tracking-widest text-[#F3ECE0]/70 hover:text-[#F3ECE0] hover:bg-[#C96442] hover:border-[#C96442] transition-all rounded-sm"
                title="Copy to Clipboard"
              >
                <ClipboardText size={12} weight="bold" /> COPY
              </button>
            </div>
            <div className="border border-[#1A161320] rounded-sm overflow-hidden shadow-[0_20px_40px_-25px_#1A161330] bg-[#15110E]">
              <div className="bg-[#1A1613] px-4 py-2 border-b border-[#F3ECE0]/10 flex justify-between items-center">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#F3ECE0]/50">
                  DATA_NODE: {match[1]}
                </span>
              </div>
              <SyntaxHighlighter
                style={customTheme}
                language={match[1]}
                PreTag="div"
                CodeTag="code"
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  background: 'transparent',
                }}
                {...props}
                codeTagProps={{ style: { fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace" } }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      }

      return (
        <code
          className={`${className} font-mono bg-[#C96442]/10 text-[#9E4A2F] px-1.5 py-0.5 rounded-sm text-sm`}
          {...props}
        >
          {children}
        </code>
      );
    };

    return {
      a: (p) => {
        const isVocab =
          p.href && (p.href.startsWith('/vocab/') || p.href.includes('/#/vocab/'));
        return (
          <MarkdownLink
            {...p}
            className={
              isVocab
                ? 'text-[#9E4A2F] font-bold transition-colors cursor-help decoration-[#C96442]/40 underline decoration-2 underline-offset-2'
                : 'underline decoration-[#C96442]/40 hover:decoration-[#C96442]'
            }
          />
        );
      },
      pre: ({ children }) => <>{children}</>,
      code: CodeBlock,
    };
  }, [addToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3ECE0] flex items-center justify-center text-[#1A1613] font-mono uppercase tracking-widest text-[10px]">
        <span className="animate-pulse">Loading...</span>
      </div>
    );
  }

  if (!post) return null;

  const currentPostIndex = post.seriesPosts?.findIndex((item) => item.slug === currentSlug);
  const prevPost = post.seriesPosts?.[currentPostIndex - 1];
  const nextPost = post.seriesPosts?.[currentPostIndex + 1];

  return (
    <div className="min-h-screen bg-[#F3ECE0] text-[#1A1613] selection:bg-[#C96442]/25 pb-32 relative">
      <Seo
        title={post ? `${post.attributes.title} | Fezcodex` : null}
        description={post ? post.body.substring(0, 150) : null}
        image={post?.attributes?.ogImage || post?.attributes?.image}
        keywords={post?.attributes?.tags}
      />

      <div className="fixed top-0 left-0 w-full h-1 z-[9999] bg-[#1A161320]">
        <motion.div
          className="h-full bg-[#C96442] origin-left shadow-[0_0_10px_#C96442]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-30 mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN }}
      />

      <div className="relative h-[35vh] w-full overflow-hidden border-b border-[#1A161320]">
        <GenerativeArt
          seed={post.attributes.title}
          className="w-full h-full opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F3ECE0] to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-6 pb-8 md:px-12">
          <div className="mb-6 flex items-center gap-4">
            <Link
              to={
                post.attributes.series
                  ? `/blog/series/${post.attributes.series.slug}`
                  : '/blog'
              }
              className="inline-flex items-center gap-2 rounded-full border border-[#1A161320] bg-[#F3ECE0]/80 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#1A1613] backdrop-blur-md transition-colors hover:bg-[#1A1613] hover:text-[#F3ECE0]"
            >
              <ArrowLeft weight="bold" />
              <span>{post.attributes.series ? 'Back to Series' : 'Back to Intel'}</span>
            </Link>
            <span className="font-mono text-[10px] text-[#9E4A2F] uppercase tracking-widest border border-[#C96442]/40 px-2 py-1.5 rounded-full bg-[#C96442]/10 backdrop-blur-sm">
              Category: {post.attributes.category || 'Terracotta'}
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-playfairDisplay italic tracking-tight text-[#1A1613] leading-none max-w-5xl">
            {post.attributes.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 lg:grid lg:grid-cols-12 lg:gap-24">
        <div className="lg:col-span-8">
          <div
            className="prose prose-lg max-w-none
                prose-headings:font-playfairDisplay prose-headings:italic prose-headings:tracking-tight prose-headings:text-[#1A1613]
                prose-p:text-[#2E2620] prose-p:leading-relaxed
                prose-li:text-[#2E2620]
                prose-a:text-[#9E4A2F] prose-a:underline prose-a:decoration-[#C96442]/40 prose-a:underline-offset-4 hover:prose-a:decoration-[#C96442]
                prose-code:text-[#9E4A2F] prose-code:font-mono prose-code:bg-[#C96442]/10 prose-code:px-1 prose-code:rounded-sm
                prose-pre:bg-transparent prose-pre:border-none prose-pre:p-0
                prose-blockquote:border-l-[#C96442] prose-blockquote:bg-[#E8DECE]/40 prose-blockquote:py-2"
          >
            <MarkdownContent content={post.body} components={components} />
          </div>

          {(prevPost || nextPost) && (
            <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#1A161320] pt-12">
              {prevPost ? (
                <Link
                  to={
                    post.attributes.series
                      ? `/blog/series/${post.attributes.series.slug}/${prevPost.slug}`
                      : `/blog/${prevPost.slug}`
                  }
                  className="group border border-[#1A161320] p-6 transition-colors hover:bg-[#1A1613] hover:text-[#F3ECE0]"
                >
                  <span className="block font-mono text-[10px] uppercase text-[#2E2620]/60 mb-2">
                    Previous Intel
                  </span>
                  <span className="text-xl font-playfairDisplay italic">{prevPost.title}</span>
                </Link>
              ) : (
                <div />
              )}
              {nextPost && (
                <Link
                  to={
                    post.attributes.series
                      ? `/blog/series/${post.attributes.series.slug}/${nextPost.slug}`
                      : `/blog/${nextPost.slug}`
                  }
                  className="group border border-[#1A161320] p-6 text-right transition-colors hover:bg-[#1A1613] hover:text-[#F3ECE0]"
                >
                  <span className="block font-mono text-[10px] uppercase text-[#2E2620]/60 mb-2">
                    Next Intel
                  </span>
                  <span className="text-xl font-playfairDisplay italic">{nextPost.title}</span>
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="mt-16 lg:col-span-4 lg:mt-0">
          <div className="sticky top-24 space-y-12">
            <div>
              <h3 className="mb-6 font-mono text-[10px] font-bold uppercase tracking-widest text-[#2E2620]/60">
                {'//'} INTEL_SPECIFICATIONS
              </h3>
              <div className="space-y-6 border-l border-[#1A161320] pl-6">
                <SpecItem
                  icon={Calendar}
                  label="Dated"
                  value={new Date(post.attributes.date).toLocaleDateString('en-GB')}
                />
                <SpecItem icon={Clock} label="Reading Time" value={`${estimatedReadingTime} Min`} />
                <SpecItem icon={Tag} label="Category" value={post.attributes.category || 'Misc'} isAccent />
              </div>
            </div>

            {post.seriesPosts && (
              <div>
                <h3 className="mb-6 font-mono text-[10px] font-bold uppercase tracking-widest text-[#2E2620]/60">
                  {'//'} SERIES_DATA
                </h3>
                <div className="flex flex-col gap-2">
                  {post.seriesPosts.map((p, i) => (
                    <Link
                      key={p.slug}
                      to={
                        post.attributes.series
                          ? `/blog/series/${post.attributes.series.slug}/${p.slug}`
                          : `/blog/${p.slug}`
                      }
                      className={`flex items-center gap-3 p-3 border transition-all ${
                        p.slug === currentSlug
                          ? 'bg-[#C96442] text-[#F3ECE0] border-[#C96442]'
                          : 'border-[#1A161320] hover:border-[#1A1613] text-[#2E2620] hover:text-[#1A1613]'
                      }`}
                    >
                      <span className="font-mono text-[10px]">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-xs font-bold uppercase truncate">{p.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={modalLanguage}
      >
        {modalContent}
      </CodeModal>
    </div>
  );
};

export default TerracottaBlogPostPage;
