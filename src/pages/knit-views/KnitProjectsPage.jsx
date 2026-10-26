import React, { useEffect, useState } from 'react';
import Seo from '../../components/Seo';
import { useProjects } from '../../utils/projectParser';
import { useAchievements } from '../../context/AchievementContext';
import {
  KnitHero,
  KnitNotice,
  KnitProjectCard,
  KnitBand,
} from '../../components/knit';
import '../../styles/Knit.css';

const KnitProjectsPage = () => {
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
    <div className="knt-root">
      <Seo
        title="Projects | Fezcodex"
        description="Independent software, from native audio to human-readable data."
      />
      <KnitHero
        eyebrow="Selected software"
        title="Built to be used. Made to be explored."
        intro="Independent software, from native audio to human-readable data."
        wool="teal"
        motif="snow"
      >
        <div className="flex flex-col sm:flex-row gap-3 mt-7 max-w-3xl">
          <input
            type="search"
            aria-label="Search projects"
            placeholder="Find a project…"
            className="knt-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter projects by technology"
            className="knt-select sm:!w-60"
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
      </KnitHero>
      <div className="knt-page">
        {loading ? (
          <KnitNotice>Casting on the collection…</KnitNotice>
        ) : error ? (
          <KnitNotice error>The project collection could not be loaded.</KnitNotice>
        ) : (
          <>
            <p className="knt-label mb-5" role="status">
              {filtered.length} of {projects.length} projects
            </p>
            {filtered.length ? (
              <div className="knt-grid">
                {filtered.map((project) => (
                  <KnitProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <KnitNotice>
                No projects match this search.{' '}
                <button
                  type="button"
                  className="knt-link"
                  onClick={() => {
                    setQuery('');
                    setTag('all');
                  }}
                >
                  Clear filters
                </button>
              </KnitNotice>
            )}
          </>
        )}
      </div>
      <KnitBand pattern={['peerie', 'trees', 'peerie']} className="mt-10" />
    </div>
  );
};

export default KnitProjectsPage;
