import React from 'react';
import { useParams } from 'react-router-dom';
import projects from '../data/projects';

const ProjectPage = () => {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">{project.title}</h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectPage;