import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // In a real app, you'd fetch this from a CMS or API
    const postSlugs = ['first-post', 'second-post'];
    setPosts(postSlugs);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="grid gap-8">
        {posts.map(slug => (
          <div key={slug} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">
              <Link to={`/blog/${slug}`} className="text-blue-500 hover:underline">
                {slug.replace(/-/g, ' ')}
              </Link>
            </h2>
            <p className="text-gray-600">
              This is a short excerpt of the blog post...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;