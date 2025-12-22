import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  ArrowLeft,
  SealCheck,
  FileText,
  IdentificationBadge,
  Clock,
  Calendar,
  ArrowsOutSimple,
  ClipboardText,
} from '@phosphor-icons/react';
import GrainOverlay from '../components/GrainOverlay';
import GenerativeArt from '../components/GenerativeArt';
import { calculateReadingTime } from '../utils/readingTime';
import MarkdownLink from '../components/MarkdownLink';
import ImageModal from '../components/ImageModal';
import CodeModal from '../components/CodeModal';
import useSeo from '../hooks/useSeo';
import { useToast } from '../hooks/useToast';
import { fetchAllBlogPosts } from '../utils/dataUtils';

const dokumentCodeTheme = {
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
    background: '#ffffff',
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
    padding: '1.5em',
    margin: '1em 0',
    overflow: 'auto',
    border: '2px solid #000',
    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
  },
  comment: { color: '#666', fontStyle: 'italic' },
  punctuation: { color: '#444' },
  property: { color: '#059669', fontWeight: 'bold' },
  tag: { color: '#059669', fontWeight: 'bold' },
  boolean: { color: '#059669', fontWeight: 'bold' },
  number: { color: '#059669', fontWeight: 'bold' },
  constant: { color: '#059669', fontWeight: 'bold' },
  symbol: { color: '#059669', fontWeight: 'bold' },
  selector: { color: '#059669', fontWeight: 'bold' },
  'attr-name': { color: '#059669' },
  string: { color: '#047857' },
  char: { color: '#047857' },
  builtin: { color: '#059669', fontWeight: 'bold' },
  inserted: { color: '#111', background: '#e6ffed' },
  deleted: { color: '#111', background: '#ffeef0' },
  operator: { color: '#111' },
  entity: { color: '#111', cursor: 'help' },
  url: { color: '#111' },
  keyword: { color: '#065f46', fontWeight: 'bold' },
  function: { color: '#065f46', fontWeight: 'bold' },
  'class-name': { color: '#065f46', fontWeight: 'bold' },
  regex: { color: '#444' },
  important: { color: '#000', fontWeight: 'bold' },
  variable: { color: '#111' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};

const DokumentBlogPostPage = () => {
  const { slug, episodeSlug } = useParams();
  const navigate = useNavigate();
  const currentSlug = episodeSlug || slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [modalImageSrc, setModalImageSrc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalLanguage, setModalLanguage] = useState('jsx');
  const { addToast } = useToast();

  useSeo({
    title: post ? `${post.attributes.title} | Fezcodex` : null,
    description: post ? post.body.substring(0, 150) : null,
    image: post?.attributes?.ogImage || post?.attributes?.image,
    keywords: post?.attributes?.tags,
  });

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
      } catch (error) {
        console.error('Error fetching dossier post:', error);
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
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setReadingProgress(progress || 0);
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

    const handleCopy = () => {
      const textToCopy = String(children);
      navigator.clipboard.writeText(textToCopy).then(
        () =>
          addToast({
            title: 'FILE COPIED',
            message: 'Code sequence secured to clipboard.',
            duration: 3000,
            type: 'success',
          }),
        () =>
          addToast({
            title: 'ERROR',
            message: 'Data extraction failed.',
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
              onClick={() =>
                openModal(String(children).replace(/\n$/, ''), match[1])
              }
              className="bg-white border-2 border-black px-2 py-1 text-xs uppercase font-mono font-black tracking-wider hover:bg-black hover:text-white transition-colors flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              title="Expand Dokument"
            >
              <ArrowsOutSimple size={12} weight="bold" /> EXPAND
            </button>
            <button
              onClick={handleCopy}
              className="bg-white border-2 border-black px-2 py-1 text-xs uppercase font-mono font-black tracking-wider hover:bg-black hover:text-white transition-colors flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              title="Copy to Clipboard"
            >
              <ClipboardText size={12} weight="bold" /> COPY
            </button>
          </div>
          <SyntaxHighlighter
            style={dokumentCodeTheme}
            language={match[1]}
            PreTag="div"
            CodeTag="code"
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              background: '#ffffff',
              border: '2px solid #000',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
            }}
            {...props}
            codeTagProps={{
              style: { fontFamily: "'JetBrains Mono', monospace" },
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <code
        className={`${className} font-mono bg-black/5 text-emerald-800 px-1.5 py-0.5 rounded-sm text-sm border-b border-black/10`}
        {...props}
      >
        {children}
      </code>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center font-mono text-black uppercase tracking-widest text-xs animate-progress">
        Accessing_Restricted_File...
      </div>
    );
  if (!post) return null;

  const currentPostIndex = post.seriesPosts?.findIndex(
    (item) => item.slug === currentSlug,
  );
  const prevPost = post.seriesPosts?.[currentPostIndex + 1];
  const nextPost = post.seriesPosts?.[currentPostIndex - 1];

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-[#111] font-sans relative overflow-x-hidden selection:bg-emerald-500/20">
      <GrainOverlay opacity={0.4} />

      <div className="fixed top-0 left-0 w-full h-1 bg-black/5 z-50">
        <div
          className="h-full bg-emerald-600"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero */}
      <div className="relative h-[50vh] w-full overflow-hidden border-b-2 border-black">
        <GenerativeArt
          seed={post.attributes.title}
          className="absolute inset-0 opacity-30 grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f3f3f3] to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12">
          <div className="mb-8 flex items-center gap-4">
            <Link
              to={
                post.attributes.series
                  ? `/blog/series/${post.attributes.series.slug}`
                  : '/blog'
              }
              className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <ArrowLeft weight="bold" />
              <span>
                {post.attributes.series ? 'Back to Series' : 'Back to Archives'}
              </span>
            </Link>
            <div className="border-2 border-emerald-600 px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 shadow-[4px_4px_0px_0px_rgba(5,150,105,1)]">
              CLASSIFIED // {post.attributes.category}
            </div>
          </div>

          <h1 className="text-4xl md:text-7xl font-playfairDisplay font-black uppercase tracking-tight text-black leading-none max-w-5xl">
            {post.attributes.title}
          </h1>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 lg:grid lg:grid-cols-12 lg:gap-24">
        <div className="lg:col-span-8">
          <article
            className="prose prose-lg md:prose-xl max-w-none
                prose-headings:font-playfairDisplay prose-headings:font-black prose-headings:uppercase prose-headings:text-black prose-headings:border-b-2 prose-headings:border-black prose-headings:pb-2
                prose-p:text-[#333] prose-p:leading-relaxed
                prose-strong:text-white prose-strong:bg-emerald-700 prose-strong:px-1
                prose-blockquote:border-l-[6px] prose-blockquote:border-emerald-600 prose-blockquote:bg-emerald-50 prose-blockquote:py-4
                prose-code:bg-black/5 prose-code:text-emerald-800
                prose-a:text-emerald-700 prose-a:underline prose-a:decoration-emerald-600/30 hover:prose-a:decoration-emerald-600"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                a: (p) => (
                  <MarkdownLink
                    {...p}
                    className="font-bold underline decoration-emerald-600/30 hover:decoration-emerald-600"
                  />
                ),
                pre: ({ children }) => <>{children}</>,
                code: CodeBlock,
              }}
            >
              {post.body}
            </ReactMarkdown>
          </article>

          {/* Series Nav Section */}
          {(prevPost || nextPost) && (
            <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-4 border-t-2 border-black pt-12">
              {prevPost ? (
                <Link
                  to={
                    post.attributes.series
                      ? `/blog/series/${post.attributes.series.slug}/${prevPost.slug}`
                      : `/blog/${prevPost.slug}`
                  }
                  className="group border-2 border-black p-6 transition-all hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span className="block font-mono text-[10px] uppercase text-gray-500 group-hover:text-gray-400 mb-2">
                    Previous Dossier
                  </span>
                  <span className="text-xl font-black uppercase">
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
                  className="group border-2 border-black p-6 text-right transition-all hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span className="block font-mono text-[10px] uppercase text-gray-500 group-hover:text-gray-400 mb-2">
                    Next Dossier
                  </span>
                  <span className="text-xl font-black uppercase">
                    {nextPost.title}
                  </span>
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="mt-16 lg:col-span-4 lg:mt-0">
          <div className="sticky top-24 space-y-12">
            <div className="border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute -top-4 -right-10 px-12 py-1 bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase rotate-45">
                AUTHENTICATED
              </div>

              <h3 className="mb-8 font-mono text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 flex items-center gap-2">
                <FileText size={18} /> FILE_SPECIFICATIONS
              </h3>

              <div className="space-y-6">
                <DossierSpec
                  icon={Calendar}
                  label="Date_Logged"
                  value={new Date(post.attributes.date).toLocaleDateString()}
                />
                <DossierSpec
                  icon={Clock}
                  label="Archive_Size"
                  value={`${calculateReadingTime(post.body)} MIN_READ`}
                />
                <DossierSpec
                  icon={IdentificationBadge}
                  label="Subject_ID"
                  value={currentSlug.substring(0, 8).toUpperCase()}
                  isAccent
                />
              </div>

              <div className="mt-12 flex items-center gap-3 border-t pt-6 border-gray-100">
                <SealCheck
                  size={32}
                  className="text-emerald-600"
                  weight="fill"
                />
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] font-bold uppercase text-gray-400 tracking-widest">
                    Verification_Status
                  </span>
                  <span className="font-mono text-[10px] font-black uppercase text-emerald-700">
                    VERIFIED_ARCHIVE_ENTRY
                  </span>
                </div>
              </div>
            </div>
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
      <ImageModal
        src={modalImageSrc}
        alt="Dossier Exhibit"
        onClose={() => setModalImageSrc(null)}
      />
    </div>
  );
};

const DossierSpec = ({ icon: Icon, label, value, isAccent }) => (
  <div className="flex flex-col gap-1">
    <span className="font-mono text-[9px] font-bold uppercase text-gray-400 tracking-widest flex items-center gap-2">
      <Icon size={14} /> {label}
    </span>
    <span
      className={`font-mono text-sm font-black uppercase ${isAccent ? 'text-emerald-600' : 'text-black'}`}
    >
      {value}
    </span>
  </div>
);

export default DokumentBlogPostPage;