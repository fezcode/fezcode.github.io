import React from 'react';
import { Link } from 'react-router-dom';
import KnitText from './KnitText';
import { KnitBadge } from './KnitPieces';
import { swatchFor } from './KnitProjectCard';

/** An app as a knitted swatch: its badge, a knitted name, the blurb on felt. */
const KnitAppCard = ({ app, eyebrow, meta, as: Tag = 'div' }) => {
  const { way, className } = swatchFor(app.slug);
  return (
    <Tag className="list-none">
      <Link to={app.to} className={`knt-card h-full ${className}`}>
        <span className="flex items-start justify-between gap-3">
          <KnitBadge seed={app.slug} size={13} />
          {eyebrow && (
            <KnitText text={eyebrow} size="small" fg={way.accent} fit />
          )}
        </span>
        <KnitText as="h3" text={`${app.title} ↗`} fg={way.fg} maxLines={2} />
        {(app.kicker || app.tagline) && (
          <KnitText
            text={app.kicker || app.tagline}
            size="small"
            fg={way.accent}
            maxLines={2}
          />
        )}
        {app.description && <p className="knt-patch">{app.description}</p>}
        {meta && (
          <KnitText
            text={meta}
            size="small"
            fg={way.accent}
            maxLines={1}
            className="mt-auto"
          />
        )}
      </Link>
    </Tag>
  );
};

export default KnitAppCard;
