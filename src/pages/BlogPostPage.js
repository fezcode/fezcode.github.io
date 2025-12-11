import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  ArrowSquareOut,
  ArrowsOutSimple,
  Clipboard,
  ArrowLeft,
  ArrowLeftIcon,
} from '@phosphor-icons/react';
import { customTheme } from '../utils/customTheme';
import PostMetadata from '../components/metadata-cards/PostMetadata';
import CodeModal from '../components/CodeModal';
import { useToast } from '../hooks/useToast';
import ImageModal from '../components/ImageModal';
import Seo from '../components/Seo';
import ShareButtons from '../components/ShareButtons';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { calculateReadingTime } from '../utils/readingTime';
import { useAchievements } from '../context/AchievementContext';
import { useSidePanel } from '../context/SidePanelContext';
import { vocabulary } from '../data/vocabulary';

// --- Helper Components ---

const MarkdownLink = ({ href, children }) => {
  const { openSidePanel } = useSidePanel();
  const isExternal = href?.startsWith('http') || href?.startsWith('https');
  const isVocab = href && (href.startsWith('/vocab/') || href.includes('/#/vocab/'));

  if (isVocab) {
    // Extract term: handle both /vocab/term and /#/vocab/term
    const parts = href.split('/vocab/');
    const term = parts[1];
    const definition = vocabulary[term];

    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          if (definition) {
            openSidePanel(definition.title, definition.content);
          } else {
            console.warn(`Vocabulary term not found: ${term}`);
          }
        }}
        className="text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1 border-b border-amber-500/30 border-dashed hover:border-solid cursor-help"
        title="Click for definition"
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 decoration-cyan-500/30 hover:decoration-cyan-400 underline underline-offset-4"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children} {isExternal && <ArrowSquareOut className="text-xs" />}
    </a>
  );
};

const BlogPostPage = () => {
  const { slug, seriesSlug, episodeSlug } = useParams();
  const navigate = useNavigate();
  const currentSlug = episodeSlug || slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const contentRef = useRef(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalLanguage, setModalLanguage] = useState('jsx');
  const [modalImageSrc, setModalImageSrc] = useState(null);

  const { trackReadingProgress } = useAchievements();
  const [hasTrackedRead, setHasTrackedRead] = useState(false);
  const { addToast } = useToast();

  // --- Effects ---

  useEffect(() => {
    setHasTrackedRead(false);
  }, [currentSlug]);

  useEffect(() => {
    if (!hasTrackedRead && readingProgress > 90) {
      trackReadingProgress(currentSlug);
      setHasTrackedRead(true);
    }
  }, [readingProgress, hasTrackedRead, currentSlug, trackReadingProgress]);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postsResponse = await fetch('/posts/posts.json');
        if (!postsResponse.ok) throw new Error('Failed to fetch posts.json');

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

        if (!postMetadata.filename) {
          navigate('/404');
          return;
        }

        const contentPath = `posts/${postMetadata.filename}`;
        const postContentResponse = await fetch(`/${contentPath}`);
        if (!postContentResponse.ok) throw new Error('Failed to fetch content');

        const postBody = await postContentResponse.text();
        if (postBody.trim().startsWith('<!DOCTYPE html>')) {
          navigate('/404');
          return;
        }

        let seriesPosts = [];
        let currentSeries = null;

        if (postMetadata.series) {
          currentSeries = postMetadata.series;
          const originalSeries = allPostsData.find(
            (item) => item.series && item.slug === currentSeries.slug,
          );
          if (originalSeries) {
            seriesPosts = originalSeries.series.posts;
          }
        }

        setPost({
          attributes: postMetadata,
          body: postBody,
          seriesPosts,
          currentSeries,
        });
        setEstimatedReadingTime(calculateReadingTime(postBody));
      } catch (error) {
        console.error('Error fetching post:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [currentSlug, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          document.documentElement;
        const totalHeight = scrollHeight - clientHeight;
        const currentProgress = (scrollTop / totalHeight) * 100;
        setReadingProgress(currentProgress);
        setIsAtTop(scrollTop === 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  // --- Handlers ---

  const openModal = (content, language) => {
    setModalContent(content);
    setModalLanguage(language);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  // --- Renderers (defined inside to access state/hooks) ---

  const CodeBlock = ({ inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');

    const handleCopy = () => {
      const textToCopy = String(children);
      navigator.clipboard.writeText(textToCopy).then(
        () =>
          addToast({
            title: 'Success',
            message: 'Copied to clipboard!',
            duration: 3000,
            type: 'techno',
          }),
        () =>
          addToast({
            title: 'Error',
            message: 'Failed to copy!',
            duration: 3000,
            type: 'error',
          }),
      );
    };

    if (!inline && match) {
      return (
        <div className="relative group my-6">
          <div className="absolute -top-3 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={() =>
                openModal(String(children).replace(/\n$/, ''), match[1])
              }
              className="text-cyan-300 bg-gray-800/90 border border-cyan-900/50 p-1.5 rounded hover:bg-gray-700 hover:text-cyan-200 transition-colors shadow-lg backdrop-blur-sm"
              title="Expand Code"
            >
              <ArrowsOutSimple size={16} />
            </button>
            <button
              onClick={handleCopy}
              className="text-cyan-300 bg-gray-800/90 border border-cyan-900/50 p-1.5 rounded hover:bg-gray-700 hover:text-cyan-200 transition-colors shadow-lg backdrop-blur-sm"
              title="Copy Code"
            >
              <Clipboard size={16} />
            </button>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-700/50 shadow-2xl">
            <SyntaxHighlighter
              style={customTheme}
              language={match[1]}
              PreTag="div"
              CodeTag="code"
              customStyle={{
                margin: 0,
                borderRadius: 0,
                background: '#0f172a',
                padding: '1.5rem',
                fontSize: '1rem',
                lineHeight: '1.6',
              }}
              {...props}
              codeTagProps={{
                style: { fontFamily: "'JetBrains Mono', monospace" },
              }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    }

    return (
      <code
        className={`${className} font-mono text-cyan-300 bg-gray-800/50 px-1.5 py-0.5 rounded text-sm border border-gray-700/50`}
        {...props}
      >
        {children}
      </code>
    );
  };

  const ImageRenderer = ({ src, alt }) => (
    <div className="my-8 mx-auto max-w-[75%] group relative rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
      <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"></div>
      <img
        src={src}
        alt={alt}
        className="cursor-pointer w-full h-auto transform transition-transform duration-500 group-hover:scale-[1.02] !border-0 !m-0 !max-w-full"
        onClick={() => setModalImageSrc(src)}
      />
    </div>
  );

  // --- Main Render ---

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] py-24 px-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="font-mono text-cyan-500 animate-pulse">
            DECRYPTING DATA STREAM...
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#020617] py-24 px-6 flex items-center justify-center text-gray-400 font-mono">
        Data not found in archives.
      </div>
    );
  }

  const currentPostIndex = post.seriesPosts
    ? post.seriesPosts.findIndex((item) => item.slug === currentSlug)
    : -1;
  const prevPost =
    post.seriesPosts && currentPostIndex < post.seriesPosts.length - 1
      ? post.seriesPosts[currentPostIndex + 1]
      : null;
  const nextPost =
    currentPostIndex > 0 ? post.seriesPosts[currentPostIndex - 1] : null;

  const backLink = post.attributes.series
    ? `/blog/series/${post.attributes.series.slug}`
    : '/blog';
  const backLinkText = post.attributes.series
    ? `Back to ${post.attributes.series.title}`
    : 'Back to Blog';

  return (
    <div className="min-h-screen bg-[#020617] pb-24 relative">
      <Seo
        title={`${post.attributes.title} | Fezcodex`}
        description={post.body.substring(0, 150)}
        keywords={post.attributes.tags ? post.attributes.tags.join(', ') : ''}
        ogTitle={`${post.attributes.title} | Fezcodex`}
        ogDescription={post.body.substring(0, 150)}
        ogImage={
          post.attributes.image || 'https://fezcode.github.io/logo512.png'
        }
        twitterCard="summary_large_image"
        twitterTitle={`${post.attributes.title} | Fezcodex`}
        twitterDescription={post.body.substring(0, 150)}
        twitterImage={
          post.attributes.image || 'https://fezcode.github.io/logo512.png'
        }
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-gray-900 to-[#020617] -z-10 border-b border-gray-800/50">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-900/10 rounded-full blur-3xl -z-10 opacity-50" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-24 relative">
        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          <div className="lg:col-span-3">
            <Link
              to={backLink}
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 font-mono text-sm tracking-widest uppercase hover:underline decoration-cyan-500/50 underline-offset-4 transition-all"
            >
              <ArrowLeftIcon size={16} /> {backLinkText}
            </Link>

            <h1 className="text-3xl md:text-5xl font-bold text-emerald-400 mb-6 tracking-tight font-mono">
              {post.attributes.title}
            </h1>

            <div className="mb-8">
              <ShareButtons
                title={post.attributes.title}
                url={window.location.href}
              />
            </div>

            <div
              ref={contentRef}
              className="prose prose-invert prose-lg max-w-none mt-8
                 prose-headings:font-mono prose-headings:font-semibold
                 prose-h1:text-emerald-400 prose-h2:text-emerald-300 prose-h3:text-emerald-200 prose-h4:text-emerald-100
                 prose-p:text-gray-300 prose-p:leading-relaxed
                 prose-strong:text-emerald-200
                 prose-blockquote:border-l-emerald-500 prose-blockquote:bg-gray-900/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r
                 prose-li:text-gray-300
                 prose-code:before:content-none prose-code:after:content-none prose-pre:text-base"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  a: MarkdownLink,
                  pre: ({ children }) => <>{children}</>,
                  code: CodeBlock,
                  img: ImageRenderer,
                }}
              >
                {post.body}
              </ReactMarkdown>
            </div>

            {(prevPost || nextPost) && (
              <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-gray-800 pt-8">
                {prevPost && (
                  <Link
                    to={
                      seriesSlug
                        ? `/blog/series/${seriesSlug}/${prevPost.slug}`
                        : `/blog/${prevPost.slug}`
                    }
                    className="group flex flex-col items-start max-w-[45%]"
                  >
                    <span className="text-xs text-gray-500 font-mono mb-1 group-hover:text-cyan-400 transition-colors">
                      <ArrowLeft size={14} className="inline mr-1" /> Previous
                      Transmission
                    </span>
                    <span className="text-gray-300 group-hover:text-white font-semibold line-clamp-2 leading-snug transition-colors">
                      {prevPost.title}
                    </span>
                  </Link>
                )}
                {!prevPost && <div></div>}
                {nextPost && (
                  <Link
                    to={
                      seriesSlug
                        ? `/blog/series/${seriesSlug}/${nextPost.slug}`
                        : `/blog/${nextPost.slug}`
                    }
                    className="group flex flex-col items-end text-right max-w-[45%]"
                  >
                    <span className="text-xs text-gray-500 font-mono mb-1 group-hover:text-cyan-400 transition-colors">
                      Next Transmission{' '}
                      <ArrowLeft size={14} className="inline ml-1 rotate-180" />
                    </span>
                    <span className="text-gray-300 group-hover:text-white font-semibold line-clamp-2 leading-snug transition-colors">
                      {nextPost.title}
                    </span>
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="hidden lg:block mt-24 space-y-6">
            <div className="sticky top-24">
              <PostMetadata
                metadata={post.attributes}
                readingProgress={readingProgress}
                isAtTop={isAtTop}
                overrideDate={post.attributes.date}
                updatedDate={post.attributes.updated}
                seriesPosts={post.seriesPosts}
                estimatedReadingTime={estimatedReadingTime}
              />
            </div>
          </div>
        </div>
      </div>
      <CodeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        language={modalLanguage}
      >
        {modalContent}
      </CodeModal>
      <ImageModal
        src={modalImageSrc}
        alt="Full size image"
        onClose={() => setModalImageSrc(null)}
      />
    </div>
  );
};

export default BlogPostPage;
