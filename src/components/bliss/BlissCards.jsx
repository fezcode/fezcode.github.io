import React from 'react';
import { Link } from 'react-router-dom';
import BlissIcon from './BlissIcon';
import { BlissCover } from './BlissPieces';

/** A project as a white card: cover, title, blurb, first technologies. */
export const BlissProjectCard = ({ project }) => (
  <Link to={`/projects/${project.slug}`} className="bl-card h-full">
    <BlissCover item={project} icon="CubeIcon" />
    <h3 className="bl-card-title">{project.title}</h3>
    {project.shortDescription && (
      <p className="m-0 text-sm leading-relaxed line-clamp-4">
        {project.shortDescription}
      </p>
    )}
    {(project.technologies || []).length > 0 && (
      <span className="bl-meta mt-auto">
        {(project.technologies || []).slice(0, 3).join(' · ')}
      </span>
    )}
  </Link>
);

/** An app as a card: glossy icon, title, kicker, description, meta. */
export const BlissAppCard = ({ app, eyebrow, meta, as: Tag = 'div' }) => (
  <Tag className="list-none">
    <Link to={app.to} className="bl-card h-full">
      <span className="flex items-start justify-between gap-3">
        <BlissIcon icon={app.icon || 'ShapesIcon'} seed={app.slug} size={40} />
        {eyebrow && <span className="bl-eyebrow">{eyebrow}</span>}
      </span>
      <h3 className="bl-card-title">{app.title}</h3>
      {(app.kicker || app.tagline) && (
        <span className="bl-meta">{app.kicker || app.tagline}</span>
      )}
      {app.description && (
        <p className="m-0 text-sm leading-relaxed">{app.description}</p>
      )}
      {meta && <span className="bl-meta mt-auto">{meta}</span>}
    </Link>
  </Tag>
);
