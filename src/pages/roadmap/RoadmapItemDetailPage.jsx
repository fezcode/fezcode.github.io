import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FolderOpenIcon } from '@phosphor-icons/react';
import piml from 'piml';
import Seo from '../../components/Seo';
import RoadmapIssueContent from '../../components/roadmap/RoadmapIssueContent';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import { flattenIssues, sortIssues, stages } from './roadmapData';
import './roadmap.css';

export default function RoadmapItemDetailPage() {
  const { id } = useParams();
  const { fezcodexTheme } = useVisualSettings();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetch('/roadmap/roadmap.piml', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Roadmap unavailable');
        return response.text();
      })
      .then((text) => {
        if (!controller.signal.aborted)
          setIssues(sortIssues(flattenIssues(piml.parse(text).issues)));
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  const index = issues.findIndex((issue) => issue.id === id);
  const issue = issues[index];
  const stage = stages.find((entry) => entry.name === issue?.status);
  const newer = issues[index - 1];
  const older = index >= 0 ? issues[index + 1] : null;

  return (
    <main
      className={`roadmap-page roadmap-issue-page ${fezcodexTheme === 'luxe' ? 'roadmap-luxe' : 'roadmap-brutalist'}`}
    >
      <Seo
        title={`${issue?.title || 'Issue details'} | Roadmap | Fezcodex`}
        description={
          issue?.description || 'Development issue details for Fezcodex.'
        }
      />
      <div className="roadmap-cabinet">
        <aside className="roadmap-index">
          <Link className="roadmap-home" to="/roadmap">
            <FolderOpenIcon size={20} />
            Back to roadmap
          </Link>
          <div className="roadmap-issue-reference">
            <span>Issue reference</span>
            <strong>{id}</strong>
          </div>
          {stage && (
            <div className="roadmap-issue-stamp" data-stage={stage.key}>
              <stage.icon size={22} />
              <span>{stage.label}</span>
            </div>
          )}
          {issue && (
            <dl className="roadmap-issue-register">
              <div>
                <dt>Category</dt>
                <dd>{issue.category || 'General'}</dd>
              </div>
              <div>
                <dt>Epic</dt>
                <dd>{issue.epic || 'No epic'}</dd>
              </div>
            </dl>
          )}
        </aside>
        <section className="roadmap-drawer" aria-label="Issue file">
          <div className="roadmap-folder-tab">
            {id}
            <span>{stage?.label || 'Issue'}</span>
          </div>
          <article className="roadmap-paper roadmap-issue-paper">
            {loading ? (
              <div className="roadmap-state" role="status">
                <h1>Loading issue…</h1>
              </div>
            ) : error ? (
              <div className="roadmap-state" role="alert">
                <h1>The issue couldn’t load.</h1>
                <p>Try fetching the roadmap again.</p>
                <button onClick={() => setAttempt((value) => value + 1)}>
                  Try again
                </button>
              </div>
            ) : !issue ? (
              <div className="roadmap-state">
                <h1>Issue not found</h1>
                <p>There is no roadmap entry for {id}.</p>
                <Link className="roadmap-permalink" to="/roadmap">
                  Browse all issues
                </Link>
              </div>
            ) : (
              <>
                <RoadmapIssueContent issue={issue} standalone />
                <nav
                  className="roadmap-issue-pagination"
                  aria-label="Browse issues"
                >
                  {newer ? (
                    <Link to={`/roadmap/${newer.id}`}>
                      <span>Newer issue / {newer.id}</span>
                      <strong>{newer.title}</strong>
                    </Link>
                  ) : (
                    <span />
                  )}
                  {older ? (
                    <Link to={`/roadmap/${older.id}`}>
                      <span>Older issue / {older.id}</span>
                      <strong>{older.title}</strong>
                    </Link>
                  ) : (
                    <span />
                  )}
                </nav>
              </>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
