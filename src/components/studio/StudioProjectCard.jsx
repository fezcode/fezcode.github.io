import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from '@phosphor-icons/react';
import StudioArt from './StudioArt';

const StudioProjectCard = ({ project }) => (
  <Link to={`/projects/${project.slug}`} className="std-project-card">
    <StudioArt item={project} project />
    <h3>
      {project.title}
      <ArrowUpRightIcon size={20} className="shrink-0" aria-hidden="true" />
    </h3>
    {project.shortDescription && <p>{project.shortDescription}</p>}
    <span className="std-label">
      {(project.technologies || []).slice(0, 3).join(' · ')}
    </span>
  </Link>
);

export default StudioProjectCard;
