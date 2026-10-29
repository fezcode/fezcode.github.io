import React from 'react';
import { Link } from 'react-router-dom';
import { MarquetryBadge } from './MarquetryPieces';

export default function MarquetryAppCard({
  app,
  eyebrow,
  meta,
  as: Tag = 'div',
}) {
  return (
    <Tag className="list-none">
      <Link to={app.to} className="mqt-card mqt-app-card h-full">
        <div className="flex items-center justify-between gap-3">
          <MarquetryBadge seed={app.slug} size={16} />
          <span className="mqt-label">{eyebrow}</span>
        </div>
        <h3>
          {app.title} <span aria-hidden="true">↗</span>
        </h3>
        {(app.kicker || app.tagline) && (
          <span className="mqt-card-meta">{app.kicker || app.tagline}</span>
        )}
        {app.description && <p>{app.description}</p>}
        {meta && <span className="mqt-card-meta mt-auto">{meta}</span>}
      </Link>
    </Tag>
  );
}
