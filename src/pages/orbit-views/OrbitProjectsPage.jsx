import React, { useEffect, useState } from 'react';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useAchievements } from '../../context/AchievementContext';
import OrbitProjectCard from '../../components/orbit/OrbitProjectCard';
import { OrbitNotice } from '../../components/orbit';
import '../../styles/Orbit.css';

const OrbitProjectsPage = () => {
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
    <div className="orb-root">
      <Seo
        title="Projects | Fezcodex"
        description="Independent software, from native audio to human-readable data."
      />
      <div className="orb-page">
        <header className="mb-9">
          <p className="orb-eyebrow">SELECTED SOFTWARE</p>
          <h1 className="orb-title mt-4">
            Built to be used.
            <br />
            Made to be explored.
          </h1>
          <p className="orb-intro">
            Independent software, from native audio to human-readable data.
          </p>
        </header>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="search"
            aria-label="Search projects"
            placeholder="Find a project…"
            className="orb-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter projects by technology"
            className="orb-input sm:!w-60"
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
          <OrbitNotice>Opening the collection…</OrbitNotice>
        ) : error ? (
          <OrbitNotice error>
            The project collection could not be loaded.
          </OrbitNotice>
        ) : (
          <>
            <p className="orb-label mb-5" role="status">
              {filtered.length} of {projects.length} projects
            </p>
            {filtered.length ? (
              <div className="orb-project-grid">
                {filtered.map((project) => (
                  <OrbitProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <OrbitNotice>
                No projects match this search.{' '}
                <button
                  type="button"
                  className="orb-link"
                  onClick={() => {
                    setQuery('');
                    setTag('all');
                  }}
                >
                  Clear filters
                </button>
              </OrbitNotice>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrbitProjectsPage;
