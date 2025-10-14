import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg hover:bg-gray-800/80 transition-colors">
      <h3 className="text-xl font-bold text-white">{project.title}</h3>
      <p className="mt-2 text-gray-400">{project.description}</p>
      <Link to={`/projects/${project.slug}`} className="mt-4 inline-block text-teal-400 hover:text-teal-500 transition-colors">
        View Project &rarr;
      </Link>
    </div>
  );
};

export default ProjectCard;