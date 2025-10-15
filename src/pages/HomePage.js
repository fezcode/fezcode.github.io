import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostItem from '../components/PostItem';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../utils/projectParser';
import { FaThumbtack, FaBook, FaArrowRight } from 'react-icons/fa';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const { projects, loading, error } = useProjects();
  const pinnedProjects = projects.filter(p => p.pinned);

  useEffect(() => {
    const fetchPostSlugs = async () => {
      try {
        const response = await fetch('/data/shownPosts.json');
        if (response.ok) {
          const postsData = await response.json();
          setPosts(postsData);
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

  if (loading) {
    return <div className="py-16 sm:py-24 text-center text-white">Loading projects...</div>;
  }

  if (error) {
    return <div className="py-16 sm:py-24 text-center text-red-500">Error loading projects: {error.message}</div>;
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Welcome to fez<span className="text-primary-400">codex</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Exploring the world of code, one post at a time.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-white text-center flex items-center justify-center gap-2">
            <FaThumbtack className="text-primary-400 text-lg" /> Pinned Projects
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {pinnedProjects.map(project => (
              <ProjectCard key={project.slug} project={{ ...project, description: project.shortDescription }} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/projects" className="text-primary-400 hover:underline flex items-center justify-center gap-2">
              View All Projects <FaArrowRight />
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold tracking-tight text-white text-center flex items-center justify-center gap-2">
            <FaBook className="text-primary-400 text-lg" /> Recent Blog Posts
          </h2>
          <div className="mt-8">
            {posts.slice(0, 5).map(post => (
              <PostItem key={post.slug} slug={post.slug} title={post.title} date={post.date} updatedDate={post.updated} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/blog" className="text-primary-400 hover:underline flex items-center justify-center gap-2">
              See All Blog Posts <FaArrowRight />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;