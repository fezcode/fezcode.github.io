import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  ArrowSquareOut,
  ArrowsOutSimple,
  Clipboard,
  ArrowLeft,
} from '@phosphor-icons/react';
import { customTheme } from '../utils/customTheme';
import PostMetadata from '../components/metadata-cards/PostMetadata';
import CodeModal from '../components/CodeModal';
import { useToast } from '../hooks/useToast';
import ImageModal from '../components/ImageModal';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const LinkRenderer = ({ href, children }) => {
  const isExternal = href.startsWith('http') || href.startsWith('https');
  return (
    <a
      href={href}
      className="text-primary-400 hover:text-primary-600 transition-colors inline-flex items-center gap-1"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children} {isExternal && <ArrowSquareOut className="text-xs" />}
    </a>
  );
};

const CodeBlock = ({
  node,
  inline,
  className,
  children,
  openModal,
  ...props
}) => {
  const match = /language-(\w+)/.exec(className || '');
  const { addToast } = useToast();
  const handleCopy = () => {
    const textToCopy = String(children);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(
        () => {
          addToast({
            title: 'Success',
            message: 'Copied to clipboard!',
            duration: 3000,
          });
        },
        () => {
          addToast({
            title: 'Error',
            message: 'Failed to copy!',
            duration: 3000,
          });
        },
      );
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        addToast({
          title: 'Success',
          message: 'Copied to clipboard!',
          duration: 3000,
        });
      } catch (err) {
        addToast({
          title: 'Error',
          message: 'Failed to copy!',
          duration: 3000,
        });
      }
      document.body.removeChild(textArea);
    }
  };

  return !inline && match ? (
    <div className="relative">
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => openModal(String(children).replace(/\n$/, ''), match[1])}
          className="text-white bg-gray-700 p-1 rounded opacity-75 hover:opacity-100"
        >
          <ArrowsOutSimple size={20} />
        </button>
        <button
          onClick={handleCopy}
          className="text-white bg-gray-700 p-1 rounded opacity-75 hover:opacity-100"
        >
          <Clipboard size={20} />
        </button>
      </div>
      <SyntaxHighlighter
        style={customTheme}
        language={match[1]}
        PreTag="div"
        {...props}
        codeTagProps={{ style: { fontFamily: "'JetBrains Mono', monospace" } }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={`${className} font-mono`} {...props}>
      {children}
    </code>
  );
};

const BlogPostPage = () => {
  const { slug, seriesSlug, episodeSlug } = useParams();
  const navigate = useNavigate();
  const currentSlug = episodeSlug || slug; // Use episodeSlug if present, otherwise use slug
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true); // New state for tracking if at top
  const contentRef = useRef(null);
  const [isModalOpen, setIsModalToOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalLanguage, setModalLanguage] = useState('jsx'); // Default to jsx
  const [modalImageSrc, setModalImageSrc] = useState(null);

  const openModal = (content, language) => {
    setModalContent(content);
    setModalLanguage(language);
    setIsModalToOpen(true);
  };

  const closeModal = () => {
    setIsModalToOpen(false);
    setModalContent('');
  };

    useEffect(() => {
      const fetchPost = async () => {
        setLoading(true);

        console.log('Fetching post for currentSlug:', currentSlug);

        try {
          // Fetch shownPosts.json
          const postsResponse = await fetch('/posts/posts.json');

          let allPostsData = [];
          if (postsResponse.ok) {
            allPostsData = await postsResponse.json();
          } else {
            console.error('Failed to fetch posts.json');
            navigate('/404');
            return;
          }

          let allPosts = [];
          allPostsData.forEach((item) => {
            if (item.series) {
              item.series.posts.forEach((seriesPost) => {
                allPosts.push({
                  ...seriesPost,
                  series: {
                    slug: item.slug,
                    title: item.title,
                  },
                });
              });
            } else {
              allPosts.push(item);
            }
          });

          let postMetadata = allPosts.find((item) => item.slug === currentSlug);

          if (!postMetadata) {
            console.error('Post metadata not found for:', currentSlug);
            navigate('/404');
            return;
          }

          let postBody = '';
          if (postMetadata.filename) {
            const contentPath = `posts/${postMetadata.filename}`;
            const postContentResponse = await fetch(`/${contentPath}`);
            if (postContentResponse.ok) {
              postBody = await postContentResponse.text();
              if (postBody.trim().startsWith('<!DOCTYPE html>')) {
                console.error('Fetched content is HTML, not expected post content for:', currentSlug);
                navigate('/404');
                return;
              }
            } else {
              console.error('Failed to fetch post content from filename:', postMetadata.filename);
              navigate('/404');
              return;
            }
          } else {
            console.error('Post metadata missing filename for:', currentSlug);
            navigate('/404');
            return;
          }

          let seriesPosts = [];
          let currentSeries = null;

          if (postMetadata.series) {
            currentSeries = postMetadata.series;
            // Find the original series object from allPostsData to get all posts in the series
            const originalSeries = allPostsData.find(
              (item) => item.series && item.slug === currentSeries.slug,
            );
            if (originalSeries) {
              seriesPosts = originalSeries.series.posts;
            }
          }

          setPost({ attributes: postMetadata, body: postBody, seriesPosts, currentSeries });
        } catch (error) {
          console.error('Error fetching post or metadata:', error);

          setPost({ attributes: { title: 'Error loading post' }, body: '' });
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
        setIsAtTop(scrollTop === 0); // Update isAtTop based on scroll position
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]); // Re-attach scroll listener if post changes

  if (loading) {
    // Skeleton loading screen for BlogPostPage
    return (
      <div className="bg-gray-900 py-16 sm:py-24 animate-pulse">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            <div className="lg:col-span-3">
              <div className="h-8 bg-gray-800 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-gray-800 rounded w-3/4 mb-8"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-800 rounded w-full"></div>
                <div className="h-6 bg-gray-800 rounded w-5/6"></div>
                <div className="h-6 bg-gray-800 rounded w-full"></div>
                <div className="h-6 bg-gray-800 rounded w-2/3"></div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-16">Post not found</div>;
  }

  const currentPostIndex = post.seriesPosts ? post.seriesPosts.findIndex(
    (item) => item.slug === currentSlug,
  ) : -1;
  const prevPost = post.seriesPosts && currentPostIndex < post.seriesPosts.length - 1
    ? post.seriesPosts[currentPostIndex + 1]
    : null;
  const nextPost = currentPostIndex > 0 ? post.seriesPosts[currentPostIndex - 1] : null;

  const backLink = post.attributes.series ? `/blog/series/${post.attributes.series.slug}` : '/blog';
  const backLinkText = post.attributes.series ? `Back to ${post.attributes.series.title}` : 'Back to Blog';

  const ImageRenderer = ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      className="cursor-pointer max-w-full h-auto"
      onClick={() => setModalImageSrc(src)}
    />
  );

  return (
    <div className="bg-gray-900 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <Link
              to={backLink}
              className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
            >
              <ArrowLeft size={24} /> {backLinkText}
            </Link>
            <div
              ref={contentRef}
              className="prose prose-xl prose-dark max-w-none"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  a: LinkRenderer,
                  code: (props) => (
                    <CodeBlock {...props} openModal={openModal} />
                  ),
                  img: ImageRenderer,
                }}
              >
                {post.body}
              </ReactMarkdown>
            </div>
            {(prevPost || nextPost) && (
              <div className="mt-8 flex justify-between items-center border-t border-gray-700 pt-8">
                {prevPost && (
                  <Link
                    to={seriesSlug ? `/blog/series/${seriesSlug}/${prevPost.slug}` : `/blog/${prevPost.slug}`}
                    className="text-primary-400 hover:underline flex items-center gap-2"
                  >
                    <ArrowLeft size={20} /> Previous: {prevPost.title}
                  </Link>
                )}
                {nextPost && (
                  <Link
                    to={seriesSlug ? `/blog/series/${seriesSlug}/${nextPost.slug}` : `/blog/${nextPost.slug}`}
                    className="text-primary-400 hover:underline flex items-center gap-2 ml-auto"
                  >
                    Next: {nextPost.title} <ArrowLeft size={20} className="rotate-180" />
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="hidden lg:block">
            <PostMetadata
              metadata={post.attributes}
              readingProgress={readingProgress}
              isAtTop={isAtTop}
              overrideDate={post.attributes.date}
              updatedDate={post.attributes.updated}
              seriesPosts={post.seriesPosts}
            />
          </div>
        </div>
      </div>
      <CodeModal isOpen={isModalOpen} onClose={closeModal} language={modalLanguage}>
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
