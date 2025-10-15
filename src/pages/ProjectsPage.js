import React from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../utils/projectParser';
import { FaArrowLeft } from 'react-icons/fa';

const ProjectsPage = () => {
  const { projects, loading, error } = useProjects();

  if (loading) {
    return <div className="py-16 sm:py-24 text-center text-white">Loading projects...</div>;
  }

  if (error) {
    return <div className="py-16 sm:py-24 text-center text-red-500">Error loading projects: {error.message}</div>;
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <Link to="/" className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4">
            <FaArrowLeft className="text-xl" /> Back to Home
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            My Projects
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            A collection of my work and experiments.
          </p>
          <div className="mt-2 text-center">
            <span className="ml-2 px-2 py-1 text-base font-medium text-gray-200 bg-gray-800 rounded-full">Total: {projects.length}</span>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {projects.map(project => (
                        <ProjectCard key={project.slug} project={{ ...project, description: project.shortDescription }} />
                      ))}        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;