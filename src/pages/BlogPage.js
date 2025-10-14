import React, { useState, useEffect } from 'react';
import PostItem from '../components/PostItem';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // In a real app, you'd fetch this from a CMS or API
    const postSlugs = ['first-post', 'second-post'];
    setPosts(postSlugs);
  }, []);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            From the Blog
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Catch up on the latest news and insights.
          </p>
        </div>
        <div className="mt-16">
          <div className="divide-y divide-gray-700">
            {posts.map(slug => (
              <PostItem key={slug} slug={slug} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;