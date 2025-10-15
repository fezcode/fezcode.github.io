import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostItem from '../components/PostItem';
import { FaArrowLeft } from 'react-icons/fa';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // In a real app, you'd fetch this from a CMS or API
    const postSlugs = ['long-post', 'first-post', 'second-post', 'code-example-post'];
    setPosts(postSlugs);
  }, []);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Link to="/" className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4">
            <FaArrowLeft className="text-xl" /> Back to Home
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            From the Blog
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Catch up on the latest news and insights.
          </p>
        </div>
        <div className="mt-16">
          <div className="">
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