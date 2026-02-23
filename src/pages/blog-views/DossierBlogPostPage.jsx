import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  ArrowLeft,
  SealCheck,
  ArrowsOutSimple,
  ClipboardText,
} from '@phosphor-icons/react';
import GrainOverlay from '../../components/GrainOverlay';
import CoffeeStain from '../../components/CoffeeStain';
import CensoredPolaroid from '../../components/CensoredPolaroid';
import Seo from '../../components/Seo';
import { calculateReadingTime } from '../../utils/readingTime';
import { useAchievements } from '../../context/AchievementContext';
import MarkdownLink from '../../components/MarkdownLink';
import CodeModal from '../../components/CodeModal';
import ImageModal from '../../components/ImageModal';
import { useToast } from '../../hooks/useToast';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import MermaidDiagram from '../../components/MermaidDiagram';

const dossierCodeTheme = {
  'code[class*="language-"]': {
    color: '#111',
    background: 'none',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.9em',
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
    color: '#111',
    background: '#f0f0f0',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.9em',
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
    border: '1px solid #000',
  },
  comment: { color: '#666', fontStyle: 'italic' },
  punctuation: { color: '#444' },
  property: { color: '#000', fontWeight: 'bold' },
  tag: { color: '#000', fontWeight: 'bold' },
  boolean: { color: '#000', fontWeight: 'bold' },
  number: { color: '#000', fontWeight: 'bold' },
  constant: { color: '#000', fontWeight: 'bold' },
  symbol: { color: '#000', fontWeight: 'bold' },
  selector: { color: '#000', fontWeight: 'bold' },
  'attr-name': { color: '#000' },
  string: { color: '#444' },
  char: { color: '#444' },
  builtin: { color: '#000', fontWeight: 'bold' },
  inserted: { color: '#000', background: '#e6ffed' },
  deleted: { color: '#000', background: '#ffeef0' },
  operator: { color: '#000' },
  entity: { color: '#000', cursor: 'help' },
  url: { color: '#000' },
  keyword: { color: '#000', fontWeight: 'bold' },
  function: { color: '#000', fontWeight: 'bold' },
  'class-name': { color: '#000', fontWeight: 'bold' },
  regex: { color: '#444' },
  important: { color: '#000', fontWeight: 'bold' },
  variable: { color: '#000' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};

const DossierBlogPostPage = () => {
  const { slug, episodeSlug } = useParams();
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

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  const components = useMemo(() => {
    const CodeBlock = ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const isMermaid = match && match[1] === 'mermaid';

      if (!inline && isMermaid) {
        return (
          <MermaidDiagram
            chart={String(children).replace(/\n$/, '')}
            theme="neutral"
            className="my-8 border border-black bg-[#f0f0f0] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] overflow-x-auto"
          />
        );
      }

      const handleCopy = () => {
        const textToCopy = String(children);
        navigator.clipboard.writeText(textToCopy).then(
          () =>
            addToast({
              title: 'EVIDENCE SECURED',
              message: 'Code copied to clipboard.',
              duration: 3000,
              type: 'success',
            }),
          () =>
            addToast({
              title: 'ERROR',
              message: 'Failed to copy code.',
              duration: 3000,
              type: 'error',
            }),
        );
      };

      if (!inline && match) {
        return (
          <div className="relative group my-8">
            <div className="absolute -top-3 right-4 flex gap-2 z-10">
              <button
                onClick={() =>
                  openModal(String(children).replace(/\n$/, ''), match[1])
                }
                className="bg-white border border-black px-2 py-1 text-xs uppercase font-mono tracking-wider hover:bg-black hover:text-white transition-colors flex items-center gap-1 shadow-sm"
                title="Enlarge Evidence"
              >
                <ArrowsOutSimple size={12} /> EXPAND
              </button>
              <button
                onClick={handleCopy}
                className="bg-white border border-black px-2 py-1 text-xs uppercase font-mono tracking-wider hover:bg-black hover:text-white transition-colors flex items-center gap-1 shadow-sm"
                title="Copy to Clipboard"
              >
                <ClipboardText size={12} /> COPY
              </button>
            </div>
            <div className="border border-black bg-[#f0f0f0] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              <div className="bg-black text-white px-2 py-1 text-xs font-mono uppercase tracking-widest border-b border-black flex justify-between">
                <span>
                  {'//'} ATTACHMENT: {match[1]}
                </span>
              </div>
              <SyntaxHighlighter
                style={dossierCodeTheme}
                language={match[1]}
                PreTag="div"
                CodeTag="code"
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  background: 'transparent',
                  border: 'none',
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
          className={`${className} font-mono bg-black/10 px-1.5 py-0.5 rounded-sm text-sm border-b border-black/20`}
          {...props}
        >
          {children}
        </code>
      );
    };

    const ImageRenderer = ({ src, alt }) => (
      <div className="my-12 w-full flex justify-center group relative transform rotate-1 hover:rotate-0 transition-transform duration-500 ease-in-out">
        <div className="absolute inset-0 bg-black/20 transform translate-x-2 translate-y-2 pointer-events-none -z-10 blur-sm"></div>
        <div
          className="bg-white p-3 pb-8 border border-gray-200 shadow-md cursor-pointer w-full max-w-[98%] mx-auto"
          onClick={() => setModalImageSrc(src)}
        >
          <img
            src={src}
            alt={alt}
            className="h-auto filter sepia-[0.2] contrast-[1.05] group-hover:sepia-0 transition-all duration-500 mx-auto block"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-black/40 mt-4 border-t border-black/10 pt-4">
            {'//'} EXHIBIT: {alt || 'UNLABELED'}
          </p>
        </div>
      </div>
    );

    return {
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
                ? '!text-amber-600 !hover:text-red-600 font-bold transition-colors cursor-help !decoration-amber-600/30 underline decoration-2 underline-offset-2'
                : 'inline-block px-1 bg-black/5 hover:bg-black hover:text-white transition-all font-mono text-sm mx-0.5 rounded-sm no-underline'
            }
          />
        );
      },
      pre: ({ children }) => <>{children}</>,
      code: CodeBlock,
      img: ImageRenderer,
    };
  }, [addToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin rounded-full" />
          <span className="font-mono text-xs uppercase tracking-widest text-black">
            Retrieving Archive...
          </span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] py-24 px-6 flex items-center justify-center text-gray-500 font-mono">
        File not found in archives.
      </div>
    );
  }

  const backLink = post.attributes.series
    ? `/blog/series/${post.attributes.series.slug}`
    : '/blog';

  const currentPostIndex = post.seriesPosts?.findIndex(
    (item) => item.slug === currentSlug,
  );
  const prevPost = post.seriesPosts?.[currentPostIndex - 1];
  const nextPost = post.seriesPosts?.[currentPostIndex + 1];

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#111] overflow-y-auto selection:bg-black selection:text-white custom-scrollbar font-sans relative">
      <Seo
        title={post ? `${post.attributes.title} | Fezcodex Archive` : null}
        description={post ? post.body.substring(0, 150) : null}
        image={post?.attributes?.ogImage || post?.attributes?.image}
        keywords={post?.attributes?.tags}
      />
      {/* Reading Progress */}
      <div className="fixed top-0 left-0 w-full h-1 z-[9999] bg-black/5">
        <div
          className="h-full bg-red-800 origin-left transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
      <GrainOverlay />
      <CoffeeStain />

      {/* Top Secret Stamp / Decor */}
      <div className="fixed top-0 right-0 p-8 opacity-10 pointer-events-none z-0">
        <div className="border-4 border-black p-4 rounded-sm transform rotate-12">
          <span className="text-6xl font-black uppercase tracking-widest font-mono">
            CONFIDENTIAL
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 relative z-10">
        <Link
          to={backLink}
          className="inline-flex items-center gap-2 text-black/60 hover:text-black mb-12 font-mono text-xs tracking-widest uppercase hover:underline decoration-black/30 underline-offset-4 transition-all"
        >
          <ArrowLeft weight="bold" />{' '}
          {post.attributes.series ? 'Return to Series' : 'Return to Index'}
        </Link>

        {post.attributes.image && (
          <div className="mb-12">
            <CensoredPolaroid
              imageUrl={post.attributes.image}
              censored={false}
            />
          </div>
        )}

        <header className="mb-20">
          <div className="flex flex-col items-start gap-4 mb-8">
            <span className="bg-black text-white px-3 py-1 font-mono text-xs tracking-[0.3em] uppercase">
              Fezcodex Archive {'//'} File #
              {currentSlug.substring(0, 6).toUpperCase()} ...[REDACTED]
            </span>
            <div className="w-24 h-1 bg-black"></div>
          </div>

          <h1 className="text-5xl md:text-7xl font-playfairDisplay font-medium tracking-tight text-black mb-8 leading-tight">
            {post.attributes.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 font-mono text-xs text-gray-500 uppercase tracking-wide border-t border-b border-black/10 py-6">
            <div>
              <span className="text-gray-400 block mb-1">Date Logged</span>
              <span className="text-black">
                {new Date(post.attributes.date).toLocaleDateString()}
              </span>
            </div>
            {post.attributes.updated && (
              <div>
                <span className="text-gray-400 block mb-1">Last Update</span>
                <span className="text-black">
                  {new Date(post.attributes.updated).toLocaleDateString()}
                </span>
              </div>
            )}
            <div>
              <span className="text-gray-400 block mb-1">Category</span>
              <span className="text-black">{post.attributes.category}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-1">
                Est. Reading Time
              </span>
              <span className="text-black">
                {calculateReadingTime(post.body)} min
              </span>
            </div>
          </div>
        </header>

        <article
          ref={contentRef}
          className="prose prose-lg md:prose-xl max-w-none font-mono
          prose-headings:font-playfairDisplay prose-headings:font-normal prose-headings:text-black prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-lg prose-headings:mt-16 prose-headings:mb-6 prose-headings:border-b prose-headings:border-black prose-headings:pb-2
          prose-p:font-mono prose-p:text-[#333] prose-p:leading-8 prose-p:mb-6
          prose-strong:font-bold prose-strong:text-white prose-strong:bg-black prose-strong:px-1
          prose-li:marker:text-black prose-li:font-mono
          prose-a:text-black prose-a:underline prose-a:decoration-black/30 hover:prose-a:decoration-black

          /* Table Styling - Clean & Redacted Vibe */
          prose-table:w-full prose-table:border-collapse prose-table:font-mono prose-table:text-sm prose-table:my-8
          prose-thead:bg-black prose-thead:text-white
          prose-th:p-4 prose-th:uppercase prose-th:tracking-wider prose-th:font-normal prose-th:text-left prose-th:text-white
          prose-td:p-4 prose-td:border-b prose-td:border-gray-300 prose-td:text-gray-700

          prose-blockquote:border-l-[6px] prose-blockquote:border-black prose-blockquote:bg-black/5 prose-blockquote:text-black prose-blockquote:not-italic prose-blockquote:font-mono prose-blockquote:p-6 prose-blockquote:my-8 prose-blockquote:shadow-none"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            components={components}
          >
            {post.body}
          </ReactMarkdown>
        </article>

        {/* Series Nav Section */}
        {(prevPost || nextPost) && (
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-black/10 pt-12">
            {prevPost ? (
              <Link
                to={
                  post.attributes.series
                    ? `/blog/series/${post.attributes.series.slug}/${prevPost.slug}`
                    : `/blog/${prevPost.slug}`
                }
                className="group border border-black/10 p-6 transition-colors hover:bg-black hover:text-white"
              >
                <span className="block font-mono text-[10px] uppercase text-gray-400 group-hover:text-gray-300 mb-2">
                  Previous File
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
                to={
                  post.attributes.series
                    ? `/blog/series/${post.attributes.series.slug}/${nextPost.slug}`
                    : `/blog/${nextPost.slug}`
                }
                className="group border border-black/10 p-6 text-right transition-colors hover:bg-black hover:text-white"
              >
                <span className="block font-mono text-[10px] uppercase text-gray-400 group-hover:text-gray-300 mb-2">
                  Next File
                </span>
                <span className="text-xl font-bold uppercase">
                  {nextPost.title}
                </span>
              </Link>
            )}
          </div>
        )}

        <footer className="mt-32 pt-12 border-t border-black flex flex-col md:flex-row justify-between items-center gap-6 font-mono text-xs uppercase tracking-widest text-gray-500">
          <div className="flex items-center gap-2">
            <SealCheck size={24} className="text-black" weight="fill" />
            <span>Verified Entry</span>
          </div>
          <div>
            <span>End of File</span>
          </div>
        </footer>
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
        alt="Evidence"
        onClose={() => setModalImageSrc(null)}
      />
    </div>
  );
};

export default DossierBlogPostPage;
