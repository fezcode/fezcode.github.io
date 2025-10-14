import React from 'react';
import projects from '../data/projects';
import ProjectCard from '../components/ProjectCard';

const ProjectsPage = () => {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            My Projects
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            A collection of my work and experiments.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;