import React, { useState, useEffect } from 'react';
import PostItem from '../components/PostItem';
import ProjectCard from '../components/ProjectCard';
import projects from '../data/projects';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const pinnedProjects = projects.filter(p => p.pinned);

  useEffect(() => {
    // In a real app, you'd fetch this from a CMS or API
    const postSlugs = ['long-post', 'first-post', 'second-post'];
    setPosts(postSlugs);
  }, []);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Welcome to My Awesome Blog
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Exploring the world of code, one post at a time.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-white text-center">Pinned Projects</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {pinnedProjects.map(project => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-white text-center">Recent Blog Posts</h2>
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