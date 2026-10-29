import React, { useEffect, useState } from 'react';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useAchievements } from '../../context/AchievementContext';
import {
  MarquetryHero,
  MarquetryNotice,
  MarquetryProjectCard,
  MarquetryBand,
} from '../../components/marquetry';
import '../../styles/Marquetry.css';

const MarquetryProjectsPage = () => {
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
    <div className="mqt-root">
      <Seo
        title="Projects | Fezcodex"
        description="Independent software, from native audio to human-readable data."
      />
      <MarquetryHero
        eyebrow="Selected software"
        title="Built to be used. Made to be explored."
        intro="Independent software, from native audio to human-readable data."
      >
        <div className="flex flex-col sm:flex-row gap-3 mt-7 max-w-3xl">
          <input
            type="search"
            aria-label="Search projects"
            placeholder="Find a project…"
            className="mqt-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter projects by technology"
            className="mqt-select sm:!w-60"
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
      </MarquetryHero>
      <div className="mqt-page">
        {loading ? (
          <MarquetryNotice>Loading the collection…</MarquetryNotice>
        ) : error ? (
          <MarquetryNotice error>
            The project collection could not be loaded.
          </MarquetryNotice>
        ) : (
          <>
            <p className="mqt-label mb-5" role="status">
              {filtered.length} of {projects.length} projects
            </p>
            {filtered.length ? (
              <div className="mqt-grid">
                {filtered.map((project) => (
                  <MarquetryProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <MarquetryNotice>
                No projects match this search.{' '}
                <button
                  type="button"
                  className="mqt-link"
                  onClick={() => {
                    setQuery('');
                    setTag('all');
                  }}
                >
                  Clear filters
                </button>
              </MarquetryNotice>
            )}
          </>
        )}
      </div>
      <MarquetryBand
        pattern={['peerie', 'trees', 'peerie']}
        className="mt-10"
      />
    </div>
  );
};

export default MarquetryProjectsPage;
