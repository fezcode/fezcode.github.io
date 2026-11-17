import React from 'react';
import { Link } from 'react-router-dom';
import { KilimBadge } from './KilimPieces';

/** An app as a woven tag: its göl badge, the name, a kicker and the blurb. */
const KilimAppCard = ({ app, eyebrow, meta, as: Tag = 'div' }) => (
  <Tag className="list-none">
    <Link to={app.to} className="klm-card klm-card-app h-full">
      <div className="klm-card-body">
        <span className="flex items-start justify-between gap-3">
          <KilimBadge seed={app.slug} size={13} />
          {eyebrow && <span className="klm-label">{eyebrow}</span>}
        </span>
        <h3 className="klm-card-title">
          {app.title} <span aria-hidden="true">↗</span>
        </h3>
        {(app.kicker || app.tagline) && <p className="klm-label">{app.kicker || app.tagline}</p>}
        {app.description && <p className="klm-card-text">{app.description}</p>}
        {meta && <p className="klm-label mt-auto">{meta}</p>}
      </div>
    </Link>
  </Tag>
);

export default KilimAppCard;
