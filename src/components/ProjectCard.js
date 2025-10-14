import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/projects/${project.slug}`} className="block bg-gray-800/50 p-6 rounded-lg shadow-lg hover:bg-gray-800/80 transition-colors border border-gray-700/50 cursor-pointer">
      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
      <p className="mt-2 text-gray-400">{project.description}</p>
      <span className="mt-4 inline-block text-teal-400 hover:text-teal-500 transition-colors">
        View Project &rarr;
      </span>
    </Link>
  );
};

export default ProjectCard;