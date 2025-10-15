import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostItem from '../components/PostItem';
import { FaArrowLeft } from 'react-icons/fa';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPostSlugs = async () => {
      try {
        const response = await fetch('/data/shownPosts.json');
        if (response.ok) {
          const slugs = await response.json();
          setPosts(slugs);
        } else {
          console.error('Failed to fetch post slugs');
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching post slugs:', error);
        setPosts([]);
      }
    };

    fetchPostSlugs();
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
          <div className="mt-4 text-center">
            <span className="ml-2 px-3 py-1 text-base font-medium text-gray-200 bg-gray-800 rounded-full">Total: {posts.length}</span>
          </div>
        </div>
        <div className="mt-16">
          <div className="">
            {posts.map(post => (
              <PostItem key={post.slug} slug={post.slug} title={post.title} date={post.date} updatedDate={post.updated} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;