import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  ArrowLeft,
  ArrowsOutSimple,
} from '@phosphor-icons/react';
import Seo from '../components/Seo';
import GenerativeArt from '../components/GenerativeArt';
import { useAchievements } from '../context/AchievementContext';
import MarkdownLink from '../components/MarkdownLink';
import CodeModal from '../components/CodeModal';
import ImageModal from '../components/ImageModal';
import { useToast } from '../hooks/useToast';

const emeraldTerminalTheme = {
  "code[class*=\"language-\"]": { "color": "#10b981", "background": "none", "fontFamily": "monospace" },
  "pre[class*=\"language-\"]": { "color": "#10b981", "background": "#050505", "fontFamily": "monospace", "border": "1px solid #10b98144", "padding": "1em" },
  "comment": { "color": "#065f46" },
  "keyword": { "color": "#34d399", "fontWeight": "bold" },
  "string": { "color": "#6ee7b7" },
  "function": { "color": "#10b981" },
  "punctuation": { "color": "#059669" },
};

const TerminalGreenBlogPostPage = () => {
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
              allPosts.push({ ...seriesPost, series: { slug: item.slug, title: item.title } });
            });
          } else {
            allPosts.push(item);
          }
        });

        const postMetadata = allPosts.find((item) => item.slug === currentSlug);
        if (!postMetadata) { navigate('/404'); return; }

        const contentPath = `posts/${postMetadata.filename}`;
        const postContentResponse = await fetch(`/${contentPath}`);
        const postBody = await postContentResponse.text();

        setPost({ attributes: postMetadata, body: postBody });
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
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
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
            <button onClick={() => openModal(String(children).replace(/\n$/, ''), match[1])} className="text-emerald-400 bg-black border border-emerald-500/30 p-1.5 hover:bg-emerald-500 hover:text-black transition-all">
              <ArrowsOutSimple size={16} />
            </button>
          </div>
          <SyntaxHighlighter style={emeraldTerminalTheme} language={match[1]} PreTag="div" CodeTag="code" customStyle={{ background: 'transparent', padding: '1.5rem' }} {...props}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    }
    return <code className="bg-emerald-500/10 text-emerald-400 px-1 rounded-sm">{children}</code>;
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-emerald-500 uppercase tracking-widest text-xs animate-pulse">Initializing_Terminal_Session...</div>;
  if (!post) return null;

  return (
    <div className="min-h-screen bg-black text-emerald-500 font-mono relative overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      <style>{`
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: #10b981; }
      `}</style>

      <Seo title={`${post.attributes.title.toUpperCase()} | TERM`} description={post.body.substring(0, 150)} ogImage={post.attributes.image || '/images/ogtitle.png'} />

      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ background: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)' }}></div>
      <div className="fixed top-0 left-0 w-full h-1 bg-emerald-950 z-50">
        <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: `${readingProgress}%` }} />
      </div>

            <div className="relative pt-32 pb-20 border-b border-emerald-500/20">
              <GenerativeArt seed={post.attributes.title} className="absolute inset-0 opacity-20 filter grayscale contrast-150 h-[30vh]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent h-[30vh]" />

              <div className="relative mx-auto max-w-5xl px-6">            <Link to="/blog" className="inline-flex items-center gap-2 border border-emerald-500/30 px-4 py-1 text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-black transition-all mb-8">
                <ArrowLeft weight="bold" /> [ BACK_TO_INDEX ]
            </Link>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                {post.attributes.title}
            </h1>
            <div className="mt-8 flex gap-6 text-[10px] uppercase tracking-widest text-emerald-500/60">
                <span>// DATE: {new Date(post.attributes.date).toLocaleDateString()}</span>
                <span>// TERM: SESSION_01</span>
            </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <article className="prose prose-invert max-w-none
            prose-headings:text-emerald-400 prose-headings:font-bold prose-headings:uppercase
            prose-p:text-emerald-500/90 prose-p:leading-relaxed prose-p:font-mono
            prose-strong:text-emerald-200 prose-strong:bg-emerald-900/30 prose-strong:px-1
            prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-500/5
            prose-code:before:content-none prose-code:after:content-none prose-a:text-emerald-400 prose-a:underline hover:prose-a:text-white"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{ code: CodeBlock, a: (p) => <MarkdownLink {...p} className="underline decoration-emerald-500/30 hover:decoration-emerald-500" /> }}>
            {post.body}
          </ReactMarkdown>
        </article>
      </div>

      <CodeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} language={modalLanguage}>{modalContent}</CodeModal>
      <ImageModal src={modalImageSrc} alt="Terminal Visual" onClose={() => setModalImageSrc(null)} />
    </div>
  );
};

export default TerminalGreenBlogPostPage;
