import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ArrowLeft, ArrowsOutSimple } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import MarkdownLink from '../../components/MarkdownLink';
import CodeModal from '../../components/CodeModal';
import ImageModal from '../../components/ImageModal';

const emeraldTerminalTheme = {
  'code[class*="language-"]': {
    color: '#10b981',
    background: 'none',
    fontFamily: 'monospace',
  },
  'pre[class*="language-"]': {
    color: '#10b981',
    background: '#050505',
    fontFamily: 'monospace',
    border: '1px solid #10b98144',
    padding: '1em',
  },
  comment: { color: '#065f46' },
  keyword: { color: '#34d399', fontWeight: 'bold' },
  string: { color: '#6ee7b7' },
  function: { color: '#10b981' },
  punctuation: { color: '#059669' },
};

const TerminalGreenBlogPostPage = () => {
  const { slug, episodeSlug } = useParams();
  const navigate = useNavigate();
  const currentSlug = episodeSlug || slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState(0);
  const [modalImageSrc, setModalImageSrc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalLanguage, setModalLanguage] = useState('jsx');

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
                filename: seriesPost.filename.startsWith('/')
                  ? seriesPost.filename.substring(1)
                  : seriesPost.filename,
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
        const { calculateReadingTime } = await import('../../utils/readingTime');
        setEstimatedReadingTime(calculateReadingTime(postBody));
      } catch (error) {
        console.error('Error fetching terminal post:', error);
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
      setReadingProgress((scrollTop / (scrollHeight - clientHeight)) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openModal = (content, language) => {
    setModalContent(content);
    setModalLanguage(language);
    setIsModalOpen(true);
  };

  const CodeBlock = ({ inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline && match) {
      return (
        <div className="relative group my-6 border border-emerald-500/20 bg-black shadow-lg">
          <div className="absolute -top-3 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={() =>
                openModal(String(children).replace(/\n$/, ''), match[1])
              }
              className="text-emerald-400 bg-black border border-emerald-500/30 p-1.5 hover:bg-emerald-500 hover:text-black transition-all"
            >
              <ArrowsOutSimple size={16} />
            </button>
          </div>
          <SyntaxHighlighter
            style={emeraldTerminalTheme}
            language={match[1]}
            PreTag="div"
            CodeTag="code"
            customStyle={{ background: 'transparent', padding: '1.5rem' }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    }
    return (
      <code className="bg-emerald-500/10 text-emerald-400 px-1 rounded-sm">
        {children}
      </code>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono text-emerald-500 uppercase tracking-widest text-xs animate-pulse">
        Initializing_Terminal_Session...
      </div>
    );
  if (!post) return null;

  const currentPostIndex = post.seriesPosts?.findIndex(
    (item) => item.slug === currentSlug,
  );
  const prevPost = post.seriesPosts?.[currentPostIndex + 1];
  const nextPost = post.seriesPosts?.[currentPostIndex - 1];

  return (
    <div className="min-h-screen bg-black text-emerald-500 font-mono relative overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      <Seo
        title={post ? `${post.attributes.title.toUpperCase()} | TERM` : null}
        description={post ? post.body.substring(0, 150) : null}
        image={post?.attributes?.ogImage || post?.attributes?.image}
        keywords={post?.attributes?.tags}
      />
      <style>{`
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: #10b981; }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          background:
            'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)',
        }}
      ></div>
      <div className="fixed top-0 left-0 w-full h-1 bg-emerald-950 z-[9999]">
        <div
          className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="relative pt-32 pb-12 border-b border-emerald-500/20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <GenerativeArt
            seed={post.attributes.title}
            className="w-full h-full opacity-20 filter grayscale contrast-150"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6">
          {' '}
          <Link
            to={
              post.attributes.series
                ? `/blog/series/${post.attributes.series.slug}`
                : '/blog'
            }
            className="inline-flex items-center gap-2 border border-emerald-500/30 px-4 py-1 text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-black transition-all mb-8"
          >
            <ArrowLeft weight="bold" /> [{' '}
            {post.attributes.series ? 'BACK_TO_SERIES' : 'BACK_TO_INDEX'} ]
          </Link>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            {post.attributes.title}
          </h1>
          <div className="mt-8 flex flex-wrap gap-6 text-[10px] uppercase tracking-widest text-emerald-500/60">
            <span>
              {'//'} DATE: {new Date(post.attributes.date).toLocaleDateString()}
            </span>
            <span>
              {'//'} PROCESS_TIME: {estimatedReadingTime} MIN_READ
            </span>
            <span>{'//'} TERM: SESSION_01</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <article
          className="prose prose-invert max-w-none
            prose-headings:text-emerald-400 prose-headings:font-bold prose-headings:uppercase
            prose-p:text-emerald-500/90 prose-p:leading-relaxed prose-p:font-mono
            prose-strong:text-emerald-200 prose-strong:bg-emerald-900/30 prose-strong:px-1
            prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-500/5
            prose-code:before:content-none prose-code:after:content-none prose-a:text-emerald-400 prose-a:underline hover:prose-a:text-white"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            components={{
              code: CodeBlock,
              a: (p) => (
                <MarkdownLink
                  {...p}
                  className="underline decoration-emerald-500/30 hover:decoration-emerald-500"
                />
              ),
            }}
          >
            {post.body}
          </ReactMarkdown>
        </article>

        {/* Series Nav Section */}
        {(prevPost || nextPost) && (
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-emerald-500/30 pt-12">
            {prevPost ? (
              <Link
                to={
                  post.attributes.series
                    ? `/blog/series/${post.attributes.series.slug}/${prevPost.slug}`
                    : `/blog/${prevPost.slug}`
                }
                className="group border border-emerald-500/20 p-6 transition-colors hover:bg-emerald-500/10"
              >
                <span className="block font-mono text-[10px] uppercase text-emerald-800 group-hover:text-emerald-500 mb-2">
                  [ PREVIOUS_ENTRY ]
                </span>
                <span className="text-xl font-bold uppercase text-emerald-400">
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
                className="group border border-emerald-500/20 p-6 text-right transition-colors hover:bg-emerald-500/10"
              >
                <span className="block font-mono text-[10px] uppercase text-emerald-800 group-hover:text-emerald-500 mb-2">
                  [ NEXT_ENTRY ]
                </span>
                <span className="text-xl font-bold uppercase text-emerald-400">
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
        alt="Terminal Visual"
        onClose={() => setModalImageSrc(null)}
      />
    </div>
  );
};

export default TerminalGreenBlogPostPage;
