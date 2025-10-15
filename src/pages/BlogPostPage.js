import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import PostMetadata from '../components/PostMetadata';
import { FaExternalLinkAlt } from 'react-icons/fa';

const LinkRenderer = ({ href, children }) => {
  const isExternal = href.startsWith('http') || href.startsWith('https');
  return (
    <a href={href} className="text-primary-400 hover:text-primary-600 transition-colors inline-flex items-center gap-1" target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
      {children} {isExternal && <FaExternalLinkAlt className="text-xs" />}
    </a>
  );
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true); // New state for tracking if at top
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const [postContentResponse, shownPostsResponse] = await Promise.all([
          fetch(`/posts/${slug}.txt`),
          fetch('/data/shownPosts.json')
        ]);

        let postBody = '';
        if (postContentResponse.ok) {
          postBody = await postContentResponse.text();
        } else {
          // Handle case where post content is not found
        }

        let postMetadata = null;
        if (shownPostsResponse.ok) {
          const data = await shownPostsResponse.json();
          postMetadata = data.find(item => item.slug === slug);
        } else {
          console.error('Failed to fetch shownPosts.json');
        }

        if (postMetadata && postContentResponse.ok) {
            setPost({ attributes: postMetadata, body: postBody });
        } else {
            setPost({ attributes: { title: 'Post not found' }, body: '' });
        }

      } catch (error) {
        console.error('Error fetching post or shownPosts.json:', error);
        setPost({ attributes: { title: 'Error loading post' }, body: '' });
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
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
    return <div className="text-center py-16">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center py-16">Post not found</div>;
  }

  return (
    <div className="bg-gray-900 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <Link to="/blog" className="text-primary-400 hover:text-primary-500 transition-colors mb-8 block">
              &larr; Back to Blog
            </Link>
            <div ref={contentRef} className="prose prose-xl prose-dark max-w-none">
              <ReactMarkdown components={{ a: LinkRenderer }}>{post.body}</ReactMarkdown>
            </div>
          </div>
          <div className="hidden lg:block">
            <PostMetadata metadata={post.attributes} readingProgress={readingProgress} isAtTop={isAtTop} overrideDate={post.attributes.date} updatedDate={post.attributes.updated} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;