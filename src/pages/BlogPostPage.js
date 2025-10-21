import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  ArrowSquareOut,
  ArrowsOutSimple,
  Clipboard,
  ArrowLeft,
} from '@phosphor-icons/react';
import { customTheme } from '../utils/customTheme';
import PostMetadata from '../components/PostMetadata';
import CodeModal from '../components/CodeModal';
import { useToast } from '../hooks/useToast';

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
          onClick={() => openModal(String(children).replace(/\n$/, ''))}
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
  const currentSlug = episodeSlug || slug; // Use episodeSlug if present, otherwise use slug
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true); // New state for tracking if at top
  const contentRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      console.log('Fetching post for currentSlug:', currentSlug);
      try {
        const [postContentResponse, shownPostsResponse] = await Promise.all([
          fetch(`/posts/${currentSlug}.txt`),
          fetch('/posts/shownPosts.json'),
        ]);

        console.log('postContentResponse:', postContentResponse);
        console.log('shownPostsResponse:', shownPostsResponse);

        let postBody = '';
        if (postContentResponse.ok) {
          postBody = await postContentResponse.text();
        } else {
          console.error('Failed to fetch post content for:', currentSlug);
          // Handle case where post content is not found
        }

        let postMetadata = null;
        let seriesPosts = [];
        if (shownPostsResponse.ok) {
          const allPosts = await shownPostsResponse.json();
          postMetadata = allPosts.find((item) => item.slug === currentSlug);

          if (postMetadata && postMetadata.series) {
            seriesPosts = allPosts
              .filter((item) => item.series === postMetadata.series)
              .sort((a, b) => a.seriesIndex - b.seriesIndex);
          }
        } else {
          console.error('Failed to fetch shownPosts.json');
        }

        console.log('postMetadata:', postMetadata);
        console.log('postBody length:', postBody.length);

        if (postMetadata && postContentResponse.ok) {
          setPost({ attributes: postMetadata, body: postBody, seriesPosts });
          console.log('Post set:', { attributes: postMetadata, body: postBody, seriesPosts });
        } else {
          setPost({ attributes: { title: 'Post not found' }, body: '' });
          console.log('Post not found or content not fetched.');
        }
      } catch (error) {
        console.error('Error fetching post or shownPosts.json:', error);
        setPost({ attributes: { title: 'Error loading post' }, body: '' });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [currentSlug]);

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
  const prevPost = currentPostIndex > 0 ? post.seriesPosts[currentPostIndex - 1] : null;
  const nextPost = post.seriesPosts && currentPostIndex < post.seriesPosts.length - 1
    ? post.seriesPosts[currentPostIndex + 1]
    : null;

  const backLink = seriesSlug ? `/blog/series/${seriesSlug}` : '/blog';
  const backLinkText = seriesSlug ? 'Back to Series' : 'Back to Blog';

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
                components={{
                  a: LinkRenderer,
                  code: (props) => (
                    <CodeBlock {...props} openModal={openModal} />
                  ),
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
      <CodeModal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </CodeModal>
    </div>
  );
};

export default BlogPostPage;
