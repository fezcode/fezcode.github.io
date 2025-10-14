import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/posts/${slug}.md`);
        if (response.ok) {
          const text = await response.text();
          setMarkdown(text);
        } else {
          setMarkdown(`# Post not found: ${slug}`);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setMarkdown('# Error loading post');
      }
    };

    fetchPost();
  }, [slug]);

  return (
    <div className="bg-gray-900 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Link to="/blog" className="text-blue-400 hover:text-blue-500 transition-colors mb-8 block">
          &larr; Back to Blog
        </Link>
        <div className="prose prose-xl prose-dark max-w-none">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;