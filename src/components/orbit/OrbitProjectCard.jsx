import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from '@phosphor-icons/react';
import OrbitArt from './OrbitArt';

const OrbitProjectCard = ({ project }) => (
  <Link to={`/projects/${project.slug}`} className="orb-project-card">
    <OrbitArt item={project} project />
    <h3>
      {project.title}
      <ArrowUpRightIcon size={20} className="shrink-0" aria-hidden="true" />
    </h3>
    {project.shortDescription && <p>{project.shortDescription}</p>}
    <span className="orb-label">
      {(project.technologies || []).slice(0, 3).join(' · ')}
    </span>
  </Link>
);

export default OrbitProjectCard;
