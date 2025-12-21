import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  ArrowLeft,
  ArrowsOutSimple,
  ClipboardTextIcon,
} from '@phosphor-icons/react';
import Seo from '../components/Seo';
import { useAchievements } from '../context/AchievementContext';
import MarkdownLink from '../components/MarkdownLink';
import CodeModal from '../components/CodeModal';
import ImageModal from '../components/ImageModal';
import { useToast } from '../hooks/useToast';
import { fetchAllBlogPosts } from '../utils/dataUtils';

const terminalCodeTheme = {
  'code[class*="language-"]': {
    color: '#fb923c' /* New Vegas Orange */,
    background: 'none',
    fontFamily: 'monospace',
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#fb923c' /* New Vegas Orange */,
    background: '#1a1a1a' /* Darker black */,
    fontFamily: 'monospace',
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    border: '1px solid #fb923c',
    boxShadow: '0 0 5px rgba(251, 146, 60, 0.5)' /* Orange glow */,
  },
  comment: { color: '#888' },
  punctuation: { color: '#fb923c' },
  property: { color: '#fb923c' },
  tag: { color: '#fb923c' },
  boolean: { color: '#fb923c' },
  number: { color: '#fb923c' },
  constant: { color: '#fb923c' },
  symbol: { color: '#fb923c' },
  selector: { color: '#fb923c' },
  'attr-name': { color: '#fb923c' },
  string: { color: '#fcd34d' } /* Lighter orange for strings */,
  char: { color: '#fcd34d' },
  builtin: { color: '#fb923c' },
  inserted: { color: '#fb923c', background: '#333' },
  deleted: { color: '#fb923c', background: '#333' },
  operator: { color: '#fb923c' },
  entity: { color: '#fb923c', cursor: 'help' },
  url: { color: '#fb923c' },
  keyword: { color: '#fb923c' },
  function: { color: '#fb923c' },
  'class-name': { color: '#fb923c' },
  regex: { color: '#fb923c' },
  important: { color: '#fb923c' },
  variable: { color: '#fb923c' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};

const TerminalBlogPostPage = () => {
  const { slug, episodeSlug } = useParams(); // seriesSlug is unused
  const navigate = useNavigate();
  const currentSlug = episodeSlug || slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Reading Progress Tracking
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef(null);
  const { trackReadingProgress } = useAchievements();
  const [hasTrackedRead, setHasTrackedRead] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalLanguage, setModalLanguage] = useState('jsx');
  const [modalImageSrc, setModalImageSrc] = useState(null);

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
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          document.documentElement;
        const totalHeight = scrollHeight - clientHeight;
        const currentProgress = (scrollTop / totalHeight) * 100;
        setReadingProgress(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { allPostsData, processedPosts } = await fetchAllBlogPosts();

        const postMetadata = processedPosts.find(
          (item) => item.slug === currentSlug,
        );
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
      } catch (error) {
        console.error('Error fetching post:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [currentSlug, navigate]);

  const openModal = (content, language) => {
    setModalContent(content);
    setModalLanguage(language);
    setIsModalOpen(true);
  };

  const CodeBlock = ({ inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');

    const handleCopy = () => {
      const textToCopy = String(children);
      navigator.clipboard.writeText(textToCopy).then(
        () =>
          addToast({
            title: 'COPIED',
            message: 'Code block copied!',
            duration: 3000,
            type: 'info',
          }),
        () =>
          addToast({
            title: 'ERROR',
            message: 'Failed to copy!',
            duration: 3000,
            type: 'error',
          }),
      );
    };

    if (!inline && match) {
      return (
        <div className="relative group my-6 border border-orange-500 shadow-orange-glow">
          <div className="absolute -top-3 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={() =>
                openModal(String(children).replace(/\n$/, ''), match[1])
              }
              className="text-orange-300 bg-gray-900/90 border border-orange-700/50 p-1.5 rounded-sm hover:bg-orange-700 hover:text-gray-900 transition-colors shadow-lg backdrop-blur-sm"
              title="Expand Code"
            >
              <ArrowsOutSimple size={16} />
            </button>
            <button
              onClick={handleCopy}
              className="text-orange-300 bg-gray-900/90 border border-orange-700/50 p-1.5 rounded-sm hover:bg-orange-700 hover:text-gray-900 transition-colors shadow-lg backdrop-blur-sm"
              title="Copy Code"
            >
              <ClipboardTextIcon size={16} />
            </button>
          </div>
          <SyntaxHighlighter
            style={terminalCodeTheme}
            language={match[1]}
            PreTag="div"
            CodeTag="code"
            customStyle={{
              margin: 0,
              borderRadius: 0,
              background: 'transparent',
              padding: '1.5rem',
              fontSize: '1rem',
              lineHeight: '1.6',
              border: 'none',
            }}
            {...props}
            codeTagProps={{
              style: { fontFamily: 'monospace' },
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <code
        className={`${className} font-mono text-orange-400 bg-gray-800/50 px-1.5 py-0.5 rounded-sm text-sm border border-orange-700/50`}
        {...props}
      >
        {children}
      </code>
    );
  };

  const ImageRenderer = ({ src, alt }) => (
    <div className="my-8 mx-auto w-full text-center border border-orange-500 p-4 bg-gray-900 shadow-orange-glow">
      <img
        src={src}
        alt={alt}
        className="w-full h-auto mx-auto mb-4 filter grayscale contrast-125"
        onClick={() => setModalImageSrc(src)}
      />
      <p className="font-mono text-orange-300 text-sm uppercase">
        {'//'} IMAGE LOG: {alt || 'UNKNOWN DATA'}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent animate-spin rounded-full"></div>
          <p className="font-mono text-orange-500 animate-pulse text-lg">
            BOOTING SYSTEM...
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black py-24 px-6 flex items-center justify-center font-mono text-orange-500 text-lg">
        ERROR: DATA NOT FOUND.
      </div>
    );
  }

  const currentPostIndex = post.seriesPosts?.findIndex(
    (item) => item.slug === currentSlug,
  );
  const prevPost = post.seriesPosts?.[currentPostIndex + 1];
  const nextPost = post.seriesPosts?.[currentPostIndex - 1];

  const backLink = post.attributes.series
    ? `/blog/series/${post.attributes.series.slug}`
    : '/blog';
  const backLinkText = post.attributes.series
    ? `RETURN TO SERIES: ${post.attributes.series.title.toUpperCase()}`
    : 'RETURN TO MAIN INDEX';

  return (
    <div className="min-h-screen bg-black text-orange-500 font-mono overflow-y-auto custom-scrollbar-terminal relative">
      <style>{`
        body { background-color: black; }
        .shadow-orange-glow { box-shadow: 0 0 10px rgba(251, 146, 60, 0.7); }
        .text-orange-500 { color: #fb923c; } /* Tailwind orange-500 */
        .border-orange-500 { border-color: #fb923c; }
        .custom-scrollbar-terminal::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar-terminal::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb {
          background-color: #fb923c;
          border-radius: 4px;
          border: 1px solid #9a3412;
        }
      `}</style>
      <Seo
        title={`${post.attributes.title.toUpperCase()} | TERMINAL LOG`}
        description={post.body.substring(0, 150)}
        keywords={post.attributes.tags ? post.attributes.tags.join(', ') : ''}
        ogTitle={`${post.attributes.title.toUpperCase()} | TERMINAL LOG`}
        ogDescription={post.body.substring(0, 150)}
        ogImage={post.attributes.image || '/images/asset/ogtitle.png'}
        twitterCard="summary_large_image"
        twitterTitle={`${post.attributes.title.toUpperCase()} | TERMINAL LOG`}
        twitterDescription={post.body.substring(0, 150)}
        twitterImage={post.attributes.image || '/images/asset/ogtitle.png'}
      />

      {/* Optional Scanline Effect Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-20"
        style={{
          background:
            'repeating-linear-gradient(0deg, #000, #000 1px, #0f0f0f 1px, #0f0f0f 2px)',
        }}
      ></div>
      <div className="mx-auto max-w-4xl px-4 py-12 relative z-10">
        <Link
          to={backLink}
          className="group flex items-center gap-2 text-orange-400 hover:text-orange-200 mb-8 text-sm uppercase transition-colors"
        >
          <ArrowLeft size={16} />{' '}
          <span className="underline">{backLinkText}</span>
        </Link>

        <h1 className="text-3xl font-bold mb-6 text-orange-300">
          {post.attributes.title.toUpperCase()}
        </h1>
        <p className="text-sm text-orange-400 mb-4">
          {'//'} DATE: {new Date(post.attributes.date).toLocaleDateString()}
        </p>
        {post.attributes.updated && (
          <p className="text-sm text-orange-400 mb-4">
            {'//'} LAST UPDATE:{' '}
            {new Date(post.attributes.updated).toLocaleDateString()}
          </p>
        )}
        <hr className="border-orange-500/50 mb-8" />

        <article
          ref={contentRef}
          className="prose prose-invert max-w-none
            prose-headings:text-orange-400 prose-headings:font-bold prose-headings:uppercase
            prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base
            prose-p:text-orange-500 prose-p:leading-relaxed
            prose-strong:text-orange-200
            prose-blockquote:border-l-orange-500 prose-blockquote:text-orange-400 prose-blockquote:pl-4 prose-blockquote:italic
            prose-li:marker:text-orange-500
            prose-code:before:content-none prose-code:after:content-none prose-code:text-orange-300 prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded-sm
            prose-pre:bg-gray-900 prose-pre:border prose-pre:border-orange-500 prose-pre:shadow-orange-glow
            prose-a:text-orange-400 prose-a:underline hover:prose-a:text-orange-200"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              a: (props) => {
                const isVocab =
                  props.href &&
                  (props.href.startsWith('/vocab/') ||
                    props.href.includes('/#/vocab/'));
                return (
                  <MarkdownLink
                    {...props}
                    className={
                      isVocab
                        ? 'text-orange-300 hover:text-orange-100 transition-colors cursor-help underline'
                        : 'text-orange-400 hover:text-orange-200 transition-colors underline'
                    }
                  />
                );
              },
              pre: ({ children }) => <>{children}</>,
              code: CodeBlock,
              img: ImageRenderer,
            }}
          >
            {post.body}
          </ReactMarkdown>
        </article>

        {/* Series Nav Section */}
        {(prevPost || nextPost) && (
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-orange-500/30 pt-12">
            {prevPost ? (
              <Link
                to={
                  post.attributes.series
                    ? `/blog/series/${post.attributes.series.slug}/${prevPost.slug}`
                    : `/blog/${prevPost.slug}`
                }
                className="group border border-orange-500/20 p-6 transition-colors hover:bg-orange-500/10"
              >
                <span className="block font-mono text-[10px] uppercase text-orange-700 group-hover:text-orange-500 mb-2">
                  [ PREVIOUS_DATA ]
                </span>
                <span className="text-xl font-bold uppercase text-orange-300">
                  {prevPost.title}
                </span>
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
                className="group border border-orange-500/20 p-6 text-right transition-colors hover:bg-orange-500/10"
              >
                <span className="block font-mono text-[10px] uppercase text-orange-700 group-hover:text-orange-500 mb-2">
                  [ NEXT_DATA ]
                </span>
                <span className="text-xl font-bold uppercase text-orange-300">
                  {nextPost.title}
                </span>
              </Link>
            )}
          </div>
        )}
      </div>

      <CodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={modalLanguage}
      >
        {modalContent}
      </CodeModal>
      <ImageModal
        src={modalImageSrc}
        alt="Terminal Image Data"
        onClose={() => setModalImageSrc(null)}
      />
    </div>
  );
};

export default TerminalBlogPostPage;
