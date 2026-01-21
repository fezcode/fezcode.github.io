import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ShareNetwork,
  ArrowsOutSimple,
  ClipboardText,
} from '@phosphor-icons/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CodeModal from '../../components/CodeModal';
import Seo from '../../components/Seo';
import LuxeArt from '../../components/LuxeArt';
import { calculateReadingTime } from '../../utils/readingTime';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import { useToast } from '../../hooks/useToast';
import MarkdownLink from '../../components/MarkdownLink';
import MarkdownContent from '../../components/MarkdownContent';

const LuxeBlogPostPage = () => {
  const { slug, episodeSlug } = useParams();
  const navigate = useNavigate();
  const currentSlug = episodeSlug || slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState(0);

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [modalCode, setModalCode] = useState('');
  const [modalLanguage, setModalLanguage] = useState('jsx');
  const { addToast } = useToast();

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, 100]);
  const progressBarScale = useTransform(scrollY, [0, document.body.scrollHeight], [0, 1]);

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
        setEstimatedReadingTime(calculateReadingTime(postBody));
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [currentSlug, navigate]);

  const openCodeModal = (content, language) => {
    setModalCode(content);
    setModalLanguage(language);
    setIsCodeModalOpen(true);
  };

  const CodeBlock = ({ inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');

    const handleCopy = () => {
      navigator.clipboard.writeText(String(children)).then(() => {
        addToast({
          title: 'Specimen Captured',
          message: 'Code has been copied to your clipboard.',
          type: 'success'
        });
      });
    };

    if (!inline && match) {
      return (
        <div className="relative group my-12">
          {/* Action Overlay */}
          <div className="absolute top-3 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <button
              onClick={() => openCodeModal(String(children).replace(/\n$/, ''), match[1])}
              className="bg-white/90 backdrop-blur-sm border border-[#1A1A1A]/10 px-3 py-1.5 text-[10px] uppercase font-outfit font-bold tracking-widest text-[#1A1A1A]/60 hover:text-white hover:bg-[#1A1A1A] transition-all rounded-full shadow-sm"
              title="Expand View"
            >
              <ArrowsOutSimple size={14} weight="bold" />
            </button>
            <button
              onClick={handleCopy}
              className="bg-white/90 backdrop-blur-sm border border-[#1A1A1A]/10 px-3 py-1.5 text-[10px] uppercase font-outfit font-bold tracking-widest text-[#1A1A1A]/60 hover:text-white hover:bg-[#1A1A1A] transition-all rounded-full shadow-sm"
              title="Copy Source"
            >
              <ClipboardText size={14} weight="bold" />
            </button>
          </div>

          <div className="rounded-sm overflow-hidden border border-[#1A1A1A]/5 shadow-sm bg-white">
            <div className="bg-[#FAFAF8] px-6 py-3 border-b border-[#1A1A1A]/5 flex justify-between items-center">
               <span className="font-outfit text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/30 font-bold">Source Specimen: {match[1]}</span>
            </div>
            <SyntaxHighlighter
              style={coy}
              language={match[1]}
              PreTag="div"
              customStyle={{
                margin: 0,
                padding: '2rem',
                fontSize: '0.9rem',
                lineHeight: '1.7',
                background: 'transparent',
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    }
    return (
      <code className={`${className} font-mono text-sm bg-[#1A1A1A]/5 text-[#8D4004] px-1.5 py-0.5 rounded-sm`} {...props}>
        {children}
      </code>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center font-outfit text-[#1A1A1A]/40 text-xs uppercase tracking-widest">
        Loading Entry...
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] selection:bg-[#C0B298] selection:text-black">
      <Seo
        title={`${post.attributes.title} | Fezcodex Journal`}
        description={post.attributes.description}
        image={post.attributes.image}
      />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#8D4004] origin-left z-[70]"
        style={{ scaleX: progressBarScale }}
      />

      {/* Hero */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative h-[60vh] w-full flex flex-col justify-center items-center text-center px-6"
      >
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
             <LuxeArt seed={post.attributes.title} className="w-full h-full mix-blend-multiply filter grayscale contrast-125" />
          </div>

          <div className="relative z-10 max-w-4xl space-y-8">
              <div className="flex items-center justify-center gap-4 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/50">
                  <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(post.attributes.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span className="flex items-center gap-2"><Clock size={14} /> {estimatedReadingTime} Min Read</span>
              </div>

              <h1 className="font-playfairDisplay text-5xl md:text-7xl lg:text-8xl text-[#1A1A1A] leading-[0.9]">
                  {post.attributes.title}
              </h1>

              {post.attributes.category && (
                  <span className="inline-block border border-[#1A1A1A]/20 px-4 py-1 rounded-full font-outfit text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/60">
                      {post.attributes.category}
                  </span>
              )}
          </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-6 pb-32 relative z-20 bg-[#F5F5F0]">

          {/* Main Body */}
          <div className="prose prose-stone prose-lg max-w-none
              prose-headings:font-playfairDisplay prose-headings:font-normal prose-headings:text-[#1A1A1A]
              prose-p:font-outfit prose-p:text-[#1A1A1A]/80 prose-p:leading-relaxed
              prose-a:text-[#8D4004] prose-a:no-underline prose-a:border-b prose-a:border-[#8D4004]/30 hover:prose-a:border-[#8D4004] prose-a:transition-colors
              prose-strong:font-medium prose-strong:text-[#1A1A1A]
              prose-li:font-outfit prose-li:text-[#1A1A1A]/80
              prose-blockquote:border-l-[#8D4004] prose-blockquote:bg-[#EBEBEB] prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic
          ">
              <MarkdownContent
                content={post.body}
                components={{
                  a: (p) => <MarkdownLink {...p} className="text-[#8D4004] hover:text-black transition-colors" />,
                  code: CodeBlock,
                }}
              />
          </div>

          {/* Footer / Meta */}
          <div className="mt-20 pt-12 border-t border-[#1A1A1A]/10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex flex-wrap gap-2">
                      {post.attributes.tags?.map(tag => (
                          <span key={tag} className="bg-[#EBEBEB] px-3 py-1 rounded-sm font-outfit text-xs text-[#1A1A1A]/60">
                              #{tag}
                          </span>
                      ))}
                  </div>

                  <div className="flex gap-4">
                      <button className="flex items-center gap-2 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/60 hover:text-[#8D4004] transition-colors">
                          <ShareNetwork size={16} /> Share
                      </button>
                  </div>
              </div>
          </div>

          {/* Navigation */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link to="/blog" className="group p-8 border border-[#1A1A1A]/10 hover:border-[#1A1A1A] transition-all bg-white">
                  <span className="flex items-center gap-2 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 mb-4 group-hover:gap-1 transition-all">
                      <ArrowLeft /> Back to Journal
                  </span>
                  <span className="font-playfairDisplay text-2xl text-[#1A1A1A]">Index</span>
              </Link>

              {/* Could add Next Post logic here similar to BrutalistBlogPostPage */}
          </div>

      </div>

      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        language={modalLanguage}
      >
        {modalCode}
      </CodeModal>
    </div>
  );
};

export default LuxeBlogPostPage;