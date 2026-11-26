import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProjects } from '../../utils/projectParser';
import { useProjectContent } from '../../hooks/useProjectContent';
import MarkdownContent from '../../components/MarkdownContent';
import TagLink from '../../components/TagLink';
import Seo from '../../components/Seo';
import { StudioNotice } from '../../components/studio';
import '../../styles/Studio.css';

export default function StudioProjectDetailPage() {
  const { slug } = useParams();
  const { projects, loading, error } = useProjects();
  const detail = useProjectContent(slug);
  const project = projects.find((entry) => entry.slug === slug);
  useEffect(() => {
    if (project?.redirect_url) window.location.assign(project.redirect_url);
  }, [project]);
  return (
    <div className="std-root">
      <div className="std-page">
        <Link className="std-chip mb-6" to="/projects">
          All projects
        </Link>
        {loading ? (
          <StudioNotice>Loading the project…</StudioNotice>
        ) : error ? (
          <StudioNotice error>
            The project couldn’t load. Please refresh to try again.
          </StudioNotice>
        ) : !project ? (
          <StudioNotice>No project was found at this address.</StudioNotice>
        ) : (
          <>
            <Seo
              title={`${project.title} | Fezcodex`}
              description={project.shortDescription}
              image={project.image}
            />
            <header className="std-project-detail-hero">
              <h1 className="std-title">{project.title}</h1>
              <p className="std-intro">{project.shortDescription}</p>
              <div className="std-actions mt-6">
                {project.demo_link && (
                  <a
                    className="std-button"
                    href={project.demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit project
                  </a>
                )}
                {project.repo_link && (
                  <a
                    className="std-button std-button-light"
                    href={project.repo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source code
                  </a>
                )}
              </div>
            </header>
            <div className="std-actions my-6">
              {[
                ...new Set([
                  ...(project.tags || []),
                  ...(project.technologies || []),
                ]),
              ].map((tag) => (
                <TagLink key={tag} tag={tag} className="std-chip">
                  {tag}
                </TagLink>
              ))}
            </div>
            {project.image && (
              <img
                className="std-project-detail-image"
                src={project.image}
                alt={project.title}
              />
            )}
            {detail.loading ? (
              <StudioNotice>Loading project notes…</StudioNotice>
            ) : detail.error ? (
              <StudioNotice error>
                Project notes couldn’t load. Please refresh to try again.
              </StudioNotice>
            ) : (
              <article className="std-prose std-project-detail-body">
                <MarkdownContent content={detail.content?.fullContent || ''} />
              </article>
            )}
          </>
        )}
      </div>
    </div>
  );
}
