import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import fm from 'front-matter';
import PostMetadata from '../components/PostMetadata';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/posts/${slug}.md`);
        if (response.ok) {
          const text = await response.text();
          const content = fm(text);
          setPost(content);
        } else {
          setPost({ attributes: { title: 'Post not found' }, body: '' });
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setPost({ attributes: { title: 'Error loading post' }, body: '' });
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

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
            <div className="prose prose-xl prose-dark max-w-none">
              <ReactMarkdown>{post.body}</ReactMarkdown>
            </div>
          </div>
          <div className="hidden lg:block">
            <PostMetadata metadata={post.attributes} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;