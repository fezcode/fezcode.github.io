import React, { useEffect, useState } from 'react';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useAchievements } from '../../context/AchievementContext';
import StudioProjectCard from '../../components/studio/StudioProjectCard';
import { StudioNotice } from '../../components/studio';
import TagLink from '../../components/TagLink';
import '../../styles/Studio.css';

const StudioProjectsPage = () => {
  const { projects, loading, error } = useProjects();
  const { unlockAchievement } = useAchievements();
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');
  useEffect(() => {
    unlockAchievement('project_pioneer');
  }, [unlockAchievement]);
  const tags = [
    ...new Set(projects.flatMap((project) => project.technologies || [])),
  ].sort();
  const filtered = projects.filter(
    (project) =>
      (tag === 'all' || project.technologies?.includes(tag)) &&
      `${project.title} ${project.shortDescription} ${(project.technologies || []).join(' ')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="std-root">
      <Seo
        title="Projects | Fezcodex"
        description="Independent software, from native audio to human-readable data."
      />
      <div className="std-page">
        <header className="mb-9">
          <p className="std-eyebrow">Selected software</p>
          <h1 className="std-title mt-4">
            Built to be used.
            <br />
            Made to be explored.
          </h1>
          <p className="std-intro">
            Independent software, from native audio to human-readable data.
          </p>
        </header>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="search"
            aria-label="Search projects"
            placeholder="Find a project…"
            className="std-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter projects by technology"
            className="std-input sm:!w-60"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
          >
            <option value="all">All technologies</option>
            {tags.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <StudioNotice>Opening the collection…</StudioNotice>
        ) : error ? (
          <StudioNotice error>
            The project collection could not be loaded.
          </StudioNotice>
        ) : (
          <>
            <p className="std-label mb-5" role="status">
              {filtered.length} of {projects.length} projects
            </p>
            {filtered.length ? (
              <div className="std-project-grid">
                {filtered.map((project) => (
                  <div
                    key={project.slug}
                    className="flex flex-col gap-2 [&>.std-project-card]:flex-1"
                  >
                    <StudioProjectCard project={project} />
                    {project.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 4).map((t) => (
                          <TagLink key={t} tag={t} className="std-chip">
                            #{t}
                          </TagLink>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <StudioNotice>
                No projects match this search.{' '}
                <button
                  type="button"
                  className="std-link"
                  onClick={() => {
                    setQuery('');
                    setTag('all');
                  }}
                >
                  Clear filters
                </button>
              </StudioNotice>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudioProjectsPage;
