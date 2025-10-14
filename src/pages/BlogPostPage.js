import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    <div className="prose lg:prose-xl mx-auto">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

export default BlogPostPage;