import React, { useState, useEffect } from 'react';
import PostItem from '../components/PostItem';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../utils/projectParser';
import { FaThumbtack, FaBlog } from 'react-icons/fa';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const { projects, loading, error } = useProjects();
  const pinnedProjects = projects.filter(p => p.pinned);

  useEffect(() => {
    // In a real app, you'd fetch this from a CMS or API
    const postSlugs = ['long-post', 'first-post', 'second-post'];
    setPosts(postSlugs);
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
            <FaThumbtack className="text-primary-400" /> Pinned Projects
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {pinnedProjects.map(project => (
              <ProjectCard key={project.slug} project={{ ...project, description: project.shortDescription }} />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold tracking-tight text-white text-center flex items-center justify-center gap-2">
            <FaBlog className="text-primary-400" /> Recent Blog Posts
          </h2>
          <div className="mt-8">
            {posts.slice(0, 5).map(slug => (
              <PostItem key={slug} slug={slug} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;