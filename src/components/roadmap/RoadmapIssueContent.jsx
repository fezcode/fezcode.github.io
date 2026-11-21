import React from 'react';
import { Link } from 'react-router-dom';
import { XIcon, ArrowSquareOutIcon } from '@phosphor-icons/react';
import { stages, normalizeStatus } from '../../pages/roadmap/roadmapData';

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
};

export default function RoadmapIssueContent({
  issue,
  onClose,
  standalone = false,
}) {
  const stage = stages.find(
    (entry) => entry.name === normalizeStatus(issue?.status),
  );
  const Heading = standalone ? 'h1' : 'h2';
  return (
    <div className="roadmap-detail-inner">
      <div className="roadmap-detail-top">
        <div className="roadmap-detail-reference">
          <span>
            {standalone ? 'Development issue' : issue?.id || 'Roadmap'}
          </span>
          {!standalone && issue && (
            <Link
              to={`/roadmap/${issue.id}`}
              className="roadmap-open-issue"
              aria-label="Open issue page"
              title="Open issue page"
            >
              <ArrowSquareOutIcon size={20} />
            </Link>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} aria-label="Close issue details">
            <XIcon size={24} />
          </button>
        )}
      </div>
      <Heading id="roadmap-detail-title">
        {issue?.title || 'Issue not found'}
      </Heading>
      {issue ? (
        <>
          <div className="roadmap-detail-badges">
            <span data-stage={stage.key}>
              <stage.icon size={18} />
              {stage.label}
            </span>
            <span>{issue.priority || 'Low'} priority</span>
          </div>
          <p className="roadmap-detail-description">{issue.description}</p>
          <dl className="roadmap-detail-facts">
            {[
              ['Category', issue.category],
              ['Epic', issue.epic],
              ['Assignee', issue.assignee],
              ['Created', formatDate(issue.created_at)],
              ['Target date', formatDate(issue.due_date)],
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>
          {issue.notes && (
            <section className="roadmap-detail-notes">
              <h3>Development notes</h3>
              <p>{issue.notes}</p>
            </section>
          )}
          {!standalone && (
            <Link className="roadmap-permalink" to={`/roadmap/${issue.id}`}>
              Open dedicated issue page
            </Link>
          )}
        </>
      ) : (
        <p>
          This issue isn’t in the roadmap. Close this panel to explore the
          available work.
        </p>
      )}
    </div>
  );
}
