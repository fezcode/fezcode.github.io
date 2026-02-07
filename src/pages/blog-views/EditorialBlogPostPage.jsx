import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism as lightTheme, atomDark as darkTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CodeModal from '../../components/CodeModal';
import ImageModal from '../../components/ImageModal';
import Seo from '../../components/Seo';
import { calculateReadingTime } from '../../utils/readingTime';
import { fetchAllBlogPosts } from '../../utils/dataUtils';
import { useToast } from '../../hooks/useToast';
import MarkdownLink from '../../components/MarkdownLink';
import MarkdownContent from '../../components/MarkdownContent';
import MermaidDiagram from '../../components/MermaidDiagram';

const EditorialBlogPostPage = () => {
  const { slug, episodeSlug } = useParams();
  const navigate = useNavigate();
  const currentSlug = episodeSlug || slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadingTime, setEstimatedReadingTime] = useState(0);
  const [isInvert, setIsInvert] = useState(true); // Default to Dark Mode

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeModalContent, setCodeModalContent] = useState('');
  const [codeModalLanguage, setCodeModalLanguage] = useState('jsx');

  const [modalImageSrc, setModalImageSrc] = useState(null);

  const { addToast } = useToast();

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

  const openCodeModal = (content, language) => {
    setCodeModalContent(content);
    setCodeModalLanguage(language);
    setIsCodeModalOpen(true);
  };

  const toggleInvert = () => setIsInvert(!isInvert);

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
              message: 'Code synchronized to clipboard.',
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
          <div className={`relative group my-8 border ${isInvert ? 'border-white/10' : 'border-black/10'}`}>
            <div className="absolute -top-3 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() =>
                  openCodeModal(String(children).replace(/\n$/, ''), match[1])
                }
                className={`px-2 py-1 text-[10px] uppercase font-instr-sans font-bold tracking-widest transition-all rounded-sm border ${isInvert ? 'bg-white text-black border-white/10 hover:bg-black hover:text-white' : 'bg-black text-white border-white/10 hover:bg-white hover:text-black'}`}
              >
                EXPAND
              </button>
              <button
                onClick={handleCopy}
                className={`px-2 py-1 text-[10px] uppercase font-instr-sans font-bold tracking-widest transition-all rounded-sm border ${isInvert ? 'bg-white text-black border-white/10 hover:bg-black hover:text-white' : 'bg-black text-white border-white/10 hover:bg-white hover:text-black'}`}
              >
                COPY
              </button>
            </div>
            <div className={`rounded-sm overflow-hidden ${isInvert ? 'bg-[#111111]' : 'bg-[#e8e8e8]'}`}>
              <div className={`px-4 py-2 border-b flex justify-between items-center ${isInvert ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                <span className={`font-instr-sans text-[9px] uppercase tracking-[0.2em] ${isInvert ? 'text-white/50' : 'text-black/50'}`}>
                  {match[1]}
                </span>
              </div>
              <SyntaxHighlighter
                style={isInvert ? darkTheme : lightTheme}
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
          className={`${className} font-mono px-1.5 py-0.5 rounded-sm text-sm relative -top-[0.1em] ${isInvert ? 'bg-white/10 text-white border border-white/20' : 'bg-black/5 text-black border border-black/10'}`}
          {...props}
        >
          {children}
        </code>
      );
    };

    return {
      a: (p) => (
        <MarkdownLink
          {...p}
          className={`underline decoration-1 underline-offset-4 transition-colors ${isInvert ? 'decoration-white/30 hover:decoration-white' : 'decoration-black/30 hover:decoration-black'}`}
        />
      ),
      code: ({ inline, className, children, ...props }) => {
        if (inline) {
          return (
            <code
              className={`${className} font-mono px-1.5 py-0.5 rounded-sm text-sm relative -top-[0.1em] ${isInvert ? 'bg-white/10 text-white border border-white/20' : 'bg-black/5 text-black border border-black/10'}`}
              {...props}
            >
              {children}
            </code>
          );
        }
        return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
      },
      strong: ({ children }) => <strong className="font-bold text-current">{children}</strong>,
      img: (props) => (
        <figure className="my-16 w-full group cursor-pointer" onClick={() => setModalImageSrc(props.src)}>
          <div className={`overflow-hidden border ${isInvert ? 'border-white/10' : 'border-black/10'}`}>
            <img
              {...props}
              alt={props.alt || 'Article Image'}
              className="w-full h-auto transition-all duration-700"
            />
          </div>
          {props.alt && (
            <figcaption className={`mt-4 text-center font-instr-sans text-xs uppercase tracking-widest ${isInvert ? 'text-white/50' : 'text-black/50'}`}>
              {props.alt}
            </figcaption>
          )}
        </figure>
      ),
      h1: ({ children }) => (
        <div className="mt-20 mb-8">
          <h2 className="text-5xl font-instr-serif tracking-tight mb-6">{children}</h2>
          <hr className={`border-t w-full ${isInvert ? 'border-white/25' : 'border-black/25'}`} />
        </div>
      ),
      h2: ({ children }) => (
        <div className="mt-16 mb-6">
          <h2 className="text-4xl font-instr-serif tracking-tight mb-4">{children}</h2>
          <hr className={`border-t w-full ${isInvert ? 'border-white/25' : 'border-black/25'}`} />
        </div>
      ),
      h3: ({ children }) => (
        <div className="mt-12 mb-4">
          <h3 className="text-3xl font-instr-serif italic tracking-tight mb-3">{children}</h3>
          <hr className={`border-t w-full ${isInvert ? 'border-white/25' : 'border-black/25'}`} />
        </div>
      ),
      h4: ({ children }) => (
        <div className="mt-10 mb-4">
          <h4 className="text-2xl font-instr-serif italic tracking-tight mb-3">{children}</h4>
          <hr className={`border-t w-full ${isInvert ? 'border-white/25' : 'border-black/25'}`} />
        </div>
      ),
      p: ({ node, children }) => {
        if (node.children[0].tagName === 'img') {
          return <div className="mb-8 last:mb-0">{children}</div>;
        }
        return <p className="mb-8 last:mb-0 leading-[1.8]">{children}</p>;
      },
      blockquote: ({ children }) => (
        <blockquote className={`border-l-4 pl-8 my-12 italic text-3xl font-light ${isInvert ? 'border-white/20 text-white/90' : 'border-black/20 text-black/90'}`}>
          {children}
        </blockquote>
      ),
      ul: ({ children }) => <ul className="list-disc pl-6 my-8 space-y-3">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal pl-6 my-8 space-y-3">{children}</ol>,
      hr: () => <hr className={`my-16 border-t w-full ${isInvert ? 'border-white/25' : 'border-black/25'}`} />,
      table: ({ children }) => (
        <div className="overflow-x-auto my-12">
          <table className={`w-full text-left border-collapse border ${isInvert ? 'border-white/25 text-white/90' : 'border-black/25 text-black/90'}`}>
            {children}
          </table>
        </div>
      ),
      th: ({ children }) => (
        <th className={`py-4 px-6 font-bold border ${isInvert ? 'border-white/25 bg-white/5' : 'border-black/25 bg-black/5'}`}>
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className={`py-4 px-6 border ${isInvert ? 'border-white/25' : 'border-black/25'}`}>
          {children}
        </td>
      ),
    };
  }, [isInvert, addToast]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1a1a1a] text-[#f4f4f4]">
        <div className="flex flex-col items-center gap-4">
           <div className="w-8 h-8 bg-[#f4f4f4] animate-spin" />
           <span className="font-instr-sans uppercase tracking-widest text-xs">Loading Article...</span>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const currentPostIndex = post.seriesPosts?.findIndex(
    (item) => item.slug === currentSlug,
  );
  const prevPost = post.seriesPosts?.[currentPostIndex - 1];
  const nextPost = post.seriesPosts?.[currentPostIndex + 1];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-instr-serif ${isInvert ? 'bg-[#1a1a1a] text-[#f4f4f4]' : 'bg-[#f4f4f4] text-[#1a1a1a]'}`}>
      <Seo
        title={post ? `${post.attributes.title} | Fezcodex Editorial` : null}
        description={post ? post.body.substring(0, 150) : null}
        image={post?.attributes?.ogImage || post?.attributes?.image}
        keywords={post?.attributes?.tags}
      />

      {/* Reading Progress */}
      <div className={`fixed top-0 left-0 w-full h-[3px] z-[9999] ${isInvert ? 'bg-white/5' : 'bg-black/5'}`}>
        <motion.div
          className="h-full bg-[#d2b48c] origin-left shadow-[0_0_10px_rgba(210,180,140,0.4)]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="max-w-[90rem] mx-auto px-[25px] md:pl-[5.77rem] md:pr-[2.22rem]">
            <div className={`border-b ${isInvert ? 'border-[#f4f4f4]/25' : 'border-[#1a1a1a]/25'} pb-12 mb-12`}>
                <div className="flex flex-col items-center text-center">
                    <h1 className="font-instr-serif italic text-6xl md:text-9xl mb-12 leading-[0.8] max-w-6xl tracking-tighter">
                        {post.attributes.title}
                    </h1>

                    {/* Controls & Metadata */}
                    <div className="flex flex-col items-center gap-8 mt-4">
                        <div className="flex items-center gap-8 font-instr-sans">
                             <Link
                                to={post.attributes.series ? `/blog/series/${post.attributes.series.slug}` : '/blog'}
                                className={`inline-flex items-center justify-center h-[2.66667rem] px-[1.33333rem] border-2 uppercase tracking-widest text-[10px] font-black transition-colors ${isInvert ? 'border-[#f4f4f4] text-[#f4f4f4] hover:bg-[#f4f4f4] hover:text-[#1a1a1a]' : 'border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#f4f4f4]'}`}
                            >
                                {post.attributes.series ? 'Return to Series' : 'Back to Index'}
                            </Link>

                            <button
                                className="flex items-center gap-4 hover:opacity-70 transition-opacity font-instr-sans"
                                type="button"
                                onClick={toggleInvert}
                            >
                                <span className="uppercase tracking-widest text-xs font-bold">{isInvert ? 'Light Mode' : 'Dark Mode'}</span>
                                <span className={`w-[0.83333rem] h-[0.83333rem] rounded-full border-2 ${isInvert ? 'bg-[#f4f4f4] border-[#f4f4f4]' : 'bg-[#1a1a1a] border-[#1a1a1a]'}`}></span>
                            </button>
                        </div>

                        <div className={`flex flex-wrap justify-center gap-6 font-instr-sans uppercase tracking-[0.2em] text-[10px] ${isInvert ? 'text-white/60' : 'text-black/60'}`}>
                            <Link to={`/blog?category=${post.attributes.category}`} className="hover:underline underline-offset-4 font-bold">
                                {post.attributes.category || 'Article'}
                            </Link>

                            <span className="opacity-30">{'//'}</span>

                            <span className="font-bold">{new Date(post.attributes.date).toLocaleDateString('en-GB')}</span>

                            <span className="opacity-30">{'//'}</span>

                            <span className="font-bold">{estimatedReadingTime} Min Read</span>

                            {post.attributes.updated && (
                                <>
                                    <span className="opacity-30">{'//'}</span>
                                    <span>Updated {new Date(post.attributes.updated).toLocaleDateString('en-GB')}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Body - 1 Column Layout (Wider) */}
            <div className="max-w-5xl mx-auto font-instr-serif text-xl md:text-2xl leading-[1.8] tracking-wide text-justify">
                <MarkdownContent
                    content={post.body}
                    components={components}
                />
            </div>

            {/* Back to Index Footer */}
            <div className={`mt-24 pt-12 border-t ${isInvert ? 'border-[#f4f4f4]/25' : 'border-[#1a1a1a]/25'} text-center`}>
                <Link
                    to="/blog"
                    className={`inline-flex items-center gap-2 font-instr-sans text-xl tracking-tight ${isInvert ? 'text-white hover:text-white/70' : 'text-black hover:text-black/70'} transition-opacity`}
                >
                    <span className="text-lg">←</span> Back to Blogposts
                </Link>
            </div>

            {/* Series Navigation */}
            {(prevPost || nextPost) && (
                <div className={`mt-12 pt-16 border-t ${isInvert ? 'border-[#f4f4f4]/25' : 'border-[#1a1a1a]/25'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {prevPost ? (
                            <Link
                                to={
                                    post.attributes.series
                                        ? `/blog/series/${post.attributes.series.slug}/${prevPost.slug}`
                                        : `/blog/${prevPost.slug}`
                                }
                                className={`group flex flex-col items-start p-8 border ${isInvert ? 'border-[#f4f4f4]/10 hover:bg-[#f4f4f4] hover:text-[#1a1a1a]' : 'border-[#1a1a1a]/10 hover:bg-[#1a1a1a] hover:text-[#f4f4f4]'} transition-all duration-300`}
                            >
                                <span className="font-instr-sans text-[10px] uppercase tracking-widest opacity-50 mb-6 font-bold">Previous Article</span>
                                <span className="font-instr-serif text-3xl md:text-4xl leading-tight group-hover:translate-x-2 transition-transform duration-500">{prevPost.title}</span>
                            </Link>
                        ) : <div />}

                        {nextPost && (
                            <Link
                                to={
                                    post.attributes.series
                                        ? `/blog/series/${post.attributes.series.slug}/${nextPost.slug}`
                                        : `/blog/${nextPost.slug}`
                                }
                                className={`group flex flex-col items-end text-right p-8 border ${isInvert ? 'border-[#f4f4f4]/10 hover:bg-[#f4f4f4] hover:text-[#1a1a1a]' : 'border-[#1a1a1a]/10 hover:bg-[#1a1a1a] hover:text-[#f4f4f4]'} transition-all duration-300`}
                            >
                                <span className="font-instr-sans text-[10px] uppercase tracking-widest opacity-50 mb-6 font-bold">Next Article</span>
                                <span className="font-instr-serif text-3xl md:text-4xl leading-tight group-hover:-translate-x-2 transition-transform duration-500">{nextPost.title}</span>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
      </main>

      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        language={codeModalLanguage}
      >
        {codeModalContent}
      </CodeModal>

      <ImageModal
        src={modalImageSrc}
        alt="Editorial Visual"
        onClose={() => setModalImageSrc(null)}
      />
    </div>
  );
};

export default EditorialBlogPostPage;
